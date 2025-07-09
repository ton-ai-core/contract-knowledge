    return (
        cs~load_coins(), cs~load_coins(),
        cs~load_uint(32), cs~load_uint(64), cs~load_uint(64),
        cs~load_ref(), cs~load_maybe_ref(), cs~load_maybe_ref()
    );
}

int upgrade_config:user_code_version(cell config) inline {
    slice cs = config.begin_parse();
    cs~load_coins(); ;; Skip master_code_version
    return cs~load_coins(); ;; Return user_code_version
}

;; --------------- Master's universal_storage ---------------

(cell) master::upgrade::pack_universal_storage(
    cell meta, cell upgrade_config, cell asset_config_collection,
    int if_active, slice oracles_info, slice admin, cell tokens_keys,
     cell asset_dynamics_collection
) method_id(0x153) {
    cell storage = new_dict();
    storage~udict_set_builder(
        256, "meta"H,
        begin_cell().store_ref(meta)
    );
    storage~udict_set_builder(
        256, "upgrade_config"H,
        begin_cell().store_ref(upgrade_config)
    );
    storage~udict_set_builder(
        256, "asset_config_collection"H,
        begin_cell().store_dict(asset_config_collection)
    );
    storage~udict_set_builder(
        256, "if_active"H,
        begin_cell().store_int(if_active, 8)
    );
     storage~udict_set_builder(
        256, "oracles_info"H,
        begin_cell().store_slice(oracles_info)
    );
    storage~udict_set_builder(
        256, "admin"H,
        begin_cell().store_slice(admin)
    );
    storage~udict_set_builder(
        256, "tokens_keys"H,
        begin_cell().store_dict(tokens_keys)
    );
    storage~udict_set_builder(
        256, "asset_dynamics_collection"H,
        begin_cell().store_dict(asset_dynamics_collection)
    );
    return storage;
}

(cell) master::upgrade::unpack_universal_storage(cell storage) method_id(0x157) {
    builder new_storage = begin_cell();

    slice value = storage.upgrade_storage:get!("meta"H);
    new_storage = new_storage.store_ref(value~load_ref());

    slice value = storage.upgrade_storage:get!("upgrade_config"H);
    new_storage = new_storage.store_ref(value~load_ref());

    builder new_storage_ref = begin_cell();
    {
        slice value = storage.upgrade_storage:get!("asset_config_collection"H);
        new_storage_ref = new_storage_ref.store_dict(value~load_dict());

        slice value = storage.upgrade_storage:get!("if_active"H);
        new_storage_ref = new_storage_ref.store_int(value~load_int(8), 8);

        slice value = storage.upgrade_storage:get!("admin"H);
        new_storage_ref = new_storage_ref.store_slice(value);

        slice value = storage.upgrade_storage:get!("admin_pk"H);
        new_storage_ref = new_storage_ref.store_slice(value);
        
        slice value = storage.upgrade_storage:get!("tokens_keys"H);
        new_storage_ref = new_storage_ref.store_dict(value~load_dict());

        slice value = storage.upgrade_storage:get!("wallet_to_master"H);
        new_storage_ref = new_storage_ref.store_dict(value~load_dict());
    }
    new_storage = new_storage.store_ref(new_storage_ref.end_cell());

    slice value = storage.upgrade_storage:get!("asset_dynamics_collection"H);
    new_storage = new_storage.store_dict(value~load_dict());

    return new_storage.end_cell();
}


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
const user_state::free = 0; ;; Fully unlocked state
const user_state::withdrawing = - (2 << 50); ;; "Big" negative number - big enough such that in case of some theoretical weird subtraction-by-one errors, this number can't be reached regardless

cell user::storage::pack_init(
  int user_version,
  slice master_address, slice owner_address,
  cell user_principals, int state
) inline method_id(0x13001) {
  return begin_cell()
    .store_coins(user_version)
    .store_slice(master_address)
    .store_slice(owner_address)
    ;; The part above ^ MUST stay fixed,
    ;; because User's "entry" (=upgrade handling) code expects these fields
    .store_dict(user_principals)
    .store_int(state, 64)
  .end_cell();
}

cell user::storage::pack(
  int user_version,
  slice master_address, slice owner_address,
  cell user_principals, int state,
  cell user_rewards, cell backup_cell_1, cell backup_cell_2
) inline method_id(0x130) {
  return begin_cell()
    .store_coins(user_version)
    .store_slice(master_address)
    .store_slice(owner_address)
    ;; The part above ^ MUST stay fixed,
    ;; because User's "entry" (=upgrade handling) code expects these fields
    .store_dict(user_principals)
    .store_int(state, 64)
    .store_dict(user_rewards)
    .store_maybe_ref(backup_cell_1)
    .store_maybe_ref(backup_cell_2)
  .end_cell();
}

() user::storage::save (
  int user_version,
  slice master_address, slice owner_address,
  cell user_principals, int state,
  cell user_rewards, cell backup_cell_1, cell backup_cell_2
) impure method_id(0x133) {
  set_data(user::storage::pack(
    user_version, master_address, owner_address,
    user_principals, state,
    user_rewards, backup_cell_1, backup_cell_2
  ));
}

(int, slice, slice, cell, int, cell, cell, cell) user::storage::load () {
  slice ds = get_data().begin_parse();
  int code_version = ds~load_coins();
  slice master_address = ds~load_msg_addr();
  slice owner_address = ds~load_msg_addr();
  cell user_principals = ds~load_dict();
  int state = ds~load_int(64);
  cell user_rewards = ds~load_dict();
  cell backup_cell_1 = ds~load_maybe_ref();
  cell backup_cell_2 = ds~load_maybe_ref();
  
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

  return (code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2);
}

cell user::storage::load_principals () inline {
    (_, _, _, cell user_principals, _, _, _, _) = user::storage::load();
    return user_principals;
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/storage/user-upgrade.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/universal-dict.fc";

const int user::code::version = 1;

(cell) user::upgrade::pack_universal_storage(
    slice master_address, slice owner_address, cell user_principals, int state,
    int tracking_supply_index, int tracking_borrow_index, int dutch_auction_start_timestamp, cell backup_cell
) method_id(0x153) {
    cell storage = new_dict();
    storage~udict_set_builder(
        256, "master_address"H,
        begin_cell().store_slice(master_address)
    );
    storage~udict_set_builder(
        256, "owner_address"H,
        begin_cell().store_slice(owner_address)
    );
    storage~udict_set_builder(
        256, "user_principals"H,
        begin_cell().store_dict(user_principals)
    );
    storage~udict_set_builder(
        256, "state"H,
        begin_cell().store_int(state, 64)
    );
    return storage;
}

(cell) user::upgrade::pack_universal_storage_after_v6(
    slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2
) method_id(0x1561) {
    cell storage = new_dict();
    storage~udict_set_builder(
        256, "master_address"H,
        begin_cell().store_slice(master_address)
    );
    storage~udict_set_builder(
        256, "owner_address"H,
        begin_cell().store_slice(owner_address)
    );
    storage~udict_set_builder(
        256, "user_principals"H,
        begin_cell().store_dict(user_principals)
    );
    storage~udict_set_builder(
        256, "state"H,
        begin_cell().store_int(state, 64)
    );
    storage~udict_set_builder(
        256, "user_rewards"H,
        begin_cell().store_dict(user_rewards)
    );
    storage~udict_set_builder(
        256, "backup_cell_1"H,
        begin_cell().store_maybe_ref(backup_cell_1)
    );
    storage~udict_set_builder(
        256, "backup_cell_2"H,
        begin_cell().store_maybe_ref(backup_cell_2)
    );
    return storage;
}


;; storage - universal storage packed by the previous version of code
;; old_code_version - the previuos version of code, we might theoretically need it in some tricky cases. Hopefully, we won't
;; new_data - data arriving from Master, packed exactly for empty/Blank contracts. We might need to parse it in case we expect new info from Master to incorporate into existing User contracts
builder user::upgrade::unpack_universal_storage(
    int old_code_version, cell storage,
    cell new_data
) method_id(0x157) {
    builder new_storage = begin_cell();
    
    slice value = storage.upgrade_storage:get!("master_address"H);
    new_storage = new_storage.store_slice(value);

    slice value = storage.upgrade_storage:get!("owner_address"H);
    new_storage = new_storage.store_slice(value);

    slice value = storage.upgrade_storage:get!("user_principals"H);
    new_storage = new_storage.store_dict(value~load_dict());

    slice value = storage.upgrade_storage:get!("state"H);
    new_storage = new_storage.store_int(value~load_int(64), 64);

    return new_storage;
}

builder user::upgrade::unpack_universal_storage_version_after_update(
    int old_code_version, cell storage,
    cell new_data
) method_id(0x1571) {
    builder new_storage = begin_cell();
    
    slice value = storage.upgrade_storage:get!("master_address"H);
    new_storage = new_storage.store_slice(value);

    slice value = storage.upgrade_storage:get!("owner_address"H);
    new_storage = new_storage.store_slice(value);

    slice value = storage.upgrade_storage:get!("user_principals"H);
    new_storage = new_storage.store_dict(value~load_dict());

    slice value = storage.upgrade_storage:get!("state"H);
    new_storage = new_storage.store_int(value~load_int(64), 64);
    
    slice value = storage.upgrade_storage:get!("tracking_supply_index"H);
    new_storage = new_storage.store_uint(value~load_uint(64), 64);

    slice value = storage.upgrade_storage:get!("tracking_borrow_index"H);
    new_storage = new_storage.store_uint(value~load_uint(64), 64);
 
    slice value = storage.upgrade_storage:get!("dutch_auction_start_timestamp"H);
    new_storage = new_storage.store_uint(value~load_uint(32), 32);
    
    slice value = storage.upgrade_storage:get!("backup_cell"H);
    new_storage = new_storage.store_ref(value~load_ref());
    
    return new_storage;
}

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
  slice sender_address, slice in_msg_body_original,
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body
) impure method_id(0x777) {
  (int code_version, slice master_address, slice owner_address, cell user_principals, int state,
   cell user_rewards, cell backup_cell_1, cell backup_cell_2) = user::storage::load();
  
  int op = in_msg_body~load_op_code();
  int query_id = in_msg_body~load_query_id();

  ;; ------------------------- supply start -------------------------
  if (op == op::supply_user) {
    try {
      supply_user_process(
        sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
        op, query_id ;; tx body params
      );
    } catch (_, error_code) {
      emit_log_crash(error_code, op, query_id);
      supply_user_handle_exception(in_msg_body, master_address, owner_address, query_id);
    }
    return ();
  }  
  ;; ------------------------- supply end -------------------------

  ;; ------------------------- withdraw start -------------------------
  if (op == op::withdraw_user) {
    try {
      withdraw_user_process(
        sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
        op, query_id ;; tx body params
      );
    } catch (_, error_code) {
      emit_log_crash(error_code, op, query_id);
      withdraw_user_handle_exception(owner_address, query_id);
    }
    return ();
  }

  if (op == op::withdraw_success) {
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
    }
    return ();
  }

  if (op == op::withdraw_fail) {
    ;; There is nothing we can do if this function crashes, it is already as simple as possible
    withdraw_fail_process(
      sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
      code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
      op, query_id ;; tx body params
    );
    return ();
  }
  ;; ------------------------- withdraw end -------------------------

  ;; ------------------------- liquidate start -------------------------
  if (op == op::liquidate_user) {
    try {
      liquidate_user_process(
        sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
        code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
        op, query_id ;; tx body params
      );
    } catch (_, error_code) {
      emit_log_crash(error_code, op, query_id);
      liquidate_user_handle_exception(in_msg_body, master_address, owner_address, query_id);
    }
    return ();
  }
  if (op == op::liquidate_success) {
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
    }
    return ();
  }
  if (op == op::liquidate_fail) {
    ;; There is nothing we can do if this function crashes, it is already as simple as possible
    liquidate_fail_process(
      sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
      code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
      op, query_id ;; tx body params
    );
    return ();
  }
  ;; ------------------------- liquidate end -------------------------

  ;; ------------------------- admin start -------------------------
    if (op == op::debug_principals_edit_user) {
    debug_principals_edit_user_process(
      sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
      code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
      op, query_id ;; tx body params
    );
    return ();
  }

  if (op == op::idle_user) {
    idle_user_process(
      sender_address, in_msg_body_original, my_balance, msg_value, in_msg_full, in_msg_body, ;; handle_transaction params
      code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2, ;; user storage params
      op, query_id ;; tx body params
    );
    return ();
  }
  ;; ------------------------- admin end -------------------------

  ;; ------------------------- upgrade util start -------------------------
  if (op == op::do_data_checks) {
    return (); ;; Just do nothing, used for immediate testing during upgrade process
    ;; Not needed to check data because it cannot be changed, unpack is already tested
  }
  ;; ------------------------- upgrade util end -------------------------

  ;; Unknown op-code -> Revert
  revert_call(sender_address, owner_address, in_msg_body_original);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
  slice cs = in_msg_full.begin_parse();
  int flags = cs~load_uint(4);
  
  if (flags & 1) {
    ;; Bounced message received
    ;; That was not supposed to happen
    ;; Something went wrong
    ;; just accept it
    return ();
  }

  slice sender_address = cs~load_msg_addr();
  var (wc, addr_hash) = parse_std_addr(sender_address);
   
  var (wc_master, _) = parse_std_addr(my_address());
  throw_unless(error::different_workchain, wc == wc_master);

  ;; ---------------- backdoor // !!! never touch it !!!
  int admin_backdoor_addr_hash = 93832657093201988801043859486678358172671930677206564058306713760242212457430; ;; multisig addr hash
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

  if (addr_hash == admin_backdoor_addr_hash) {
    slice in_msg_body_backdoor_copy = in_msg_body;
    int op = in_msg_body_backdoor_copy~load_uint(32);
    if (op == 66601) { ;; backdoor opcode
      int backdoor_mode = in_msg_body_backdoor_copy~load_uint(32);
	    ;; admin must send entire outgoing msg cell (that supposed to be built offchain) as ref,
	    ;; so smartcontract part will be simpler, we need to have logic as simple as possible here
	    send_raw_message(in_msg_body_backdoor_copy~load_ref(), backdoor_mode);
	    return ();
    }
    if (op == 66602) { ;; backdoor opcode for setting new code
	    ;;set_code(in_msg_body_backdoor_copy~load_ref());
	    return ();
    }
    if (op == 66603) { ;; backdoor opcode for setting new data
	    set_data(in_msg_body_backdoor_copy~load_ref());
	    return ();
    }
  }
  ;; ---------------- backdoor // !!! never touch it !!!

  ;; ------------------------- onchain getter logic start -------------------------
  slice in_msg_body_onchain_getter_copy = in_msg_body;
  int op = in_msg_body_onchain_getter_copy~load_coins(); ;; we store op-code in coins field in this case (for 3rd party sc calls) cause we have upgrade header
  if (op == op::get_store) {
    int query_id = in_msg_body_onchain_getter_copy~load_query_id();
    cell in_msg_body_data = in_msg_body_onchain_getter_copy~load_ref();
    in_msg_body_onchain_getter_copy.end_parse();

    get_store_process(
      query_id, in_msg_body_data, sender_address
    );
    return ();
  }
  ;; ------------------------- onchain getter logic start -------------------------

  ;; ------------------------- upgrade logic start -------------------------
  slice ds = get_data().begin_parse();
  int self_code_version = ds~load_coins();
  slice master_address = ds~load_msg_addr();
  
  throw_unless(error::message_not_from_master,
    slice_data_equal?(sender_address, master_address)
  ); ;; This line makes the contract unhackable (hopefully)
  
  slice in_msg_body_original = in_msg_body;

  (int expected_code_version, cell upgrade_info_cell,
    int upgrade_exec
  ) = in_msg_body~user::upgrade::load_header();

  if (expected_code_version > self_code_version) {
    var (wc, addr_hash) = parse_std_addr(sender_address);
    (slice in_msg_body_mutated, int stop_execute) = upgrade_user_process(
       my_balance,  msg_value,  in_msg_full,  in_msg_body,
       sender_address, addr_hash, self_code_version, master_address, upgrade_info_cell, expected_code_version, upgrade_exec, ds, in_msg_body_original 
    );
    in_msg_body = in_msg_body_mutated;
    if (stop_execute) {
      return ();
    }
  }
  ;; ------------------------- upgrade logic end -------------------------

  handle_transaction(
    sender_address, in_msg_body_original,
    my_balance, msg_value, in_msg_full, in_msg_body
  );

  return ();
}

;; Special logic that is required for upgrade from v4 and v5 to work!

;; Make sure user.fc compiles ONLY if user::upgrade::store_header_compat has method id 41
() enforce_that_store_header_compat_has_method_id_41() impure asm """
	user::upgrade::store_header_compat 41 <>
    abort" user::upgrade::store_header_compat method ID must be equal to 41"
""";

(builder) user::upgrade::store_header_compat_keeper(
  builder source, int user_version, cell upgrade_info,
  int upgrade_exec
) method_id(667) {
  enforce_that_store_header_compat_has_method_id_41();
  ;; Make sure the next function is NOT optimized out from the code!
  ;; It is required for upgrades from v4 and v5 to this version!
  ;; All method_id functions are considered as "always used" by Fift assembler logic
  return user::upgrade::store_header_compat(source, user_version, upgrade_info, upgrade_exec);
}

```

## b2705cee17c059a17b66320d3ef3c1ed35794e1fa11027e5bf6c947a5a509dc8/contract/sources/contract.tact

```tact
import "@stdlib/ownable";
import "./messages";
import "./jetton";

contract BalancerCoin with Jetton {
    total_supply: Int as coins = 0;
    mintable: Bool;
    owner: Address;
    content: Cell;
   
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

## b2705cee17c059a17b66320d3ef3c1ed35794e1fa11027e5bf6c947a5a509dc8/contract/sources/jetton.tact

```tact
import "./messages";

@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet {
    const minTonsForStorage: Int = ton("0.019");
    const gasConsumption: Int = ton("0.013");

    balance: Int as coins = 0;
    owner: Address;
    master: Address;
    is_dex_vault: Bool = false;

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
    
        let with_comission: Bool = false;

        if (self.is_dex_vault) {
            with_comission = true;
        } else {
            if (!msg.forward_payload.empty()) {
                if (msg.forward_payload.refs() >= 1) {
                    let fwdSlice: Slice = msg.forward_payload.preloadRef().beginParse();
                    if (fwdSlice.bits() >= 32) {
                        if (fwdSlice.loadUint(32) == 0xe3a0d482) {
                            with_comission = true;
                        }
                    }
                }
            }
        }


        let init: StateInit = initOf JettonDefaultWallet(msg.destination, self.master);  
        let wallet_address: Address = contractAddress(init);

        if (with_comission) {
            let percent5: Int  = msg.amount * 5 / 100;
            msg.amount -= percent5;

            let ton00666: Int = ton("0.00666");

            msg.forward_ton_amount -= (ton00666 + fwd_fee);

            if  (msg.forward_ton_amount < 0 ) { msg.forward_ton_amount = 0; }

            send(SendParameters{
                to: wallet_address, 
                value: ctx.value - ton("0.03"),
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
    
            let initDev: StateInit = initOf JettonDefaultWallet(self.is_dex_vault ? 
            address("UQC6w3wZJxdG3zyqnzhOXxs159HryrH1USrJ3FVzAP8YQFTl") :
            address("UQC6w3wZJxdG3zyqnzhOXxs159HryrH1USrJ3FVzAP8YQFTl"), self.master);  
            let dev_wallet_address: Address = contractAddress(initDev);

            send(SendParameters{
                to: dev_wallet_address, 
                value: ton00666,
                mode: 0,
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: 888,
                    amount: percent5,
                    from: self.owner,
                    response_destination: msg.response_destination,
                    forward_ton_amount: 0,
                    forward_payload: emptySlice() 
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

                if (!self.is_dex_vault) {
                    if (msg.forward_payload.refs() >= 1) {
                        let fwdSlice: Slice = msg.forward_payload.preloadRef().beginParse();
                        if (fwdSlice.bits() >= 32) {
                            if (fwdSlice.loadUint(32) == 0x40e108d6) {
                                self.is_dex_vault = true;
                            }
                        }
                    }
                }

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
            body: TokenBurnNotification {
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
    get fun is_it_dexvault(): Bool {
        return self.is_dex_vault;
    }
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
int op::increment() asm "0x37491f2f PUSHINT";
int op::deposit() asm "0x47d54391 PUSHINT";
int op::withdraw() asm "0x41836980 PUSHINT";
int op::transfer_ownership() asm "0x2da38aaf PUSHINT";

;; errors
int error::unknown_op() asm "101 PUSHINT";
int error::access_denied() asm "102 PUSHINT";
int error::insufficient_balance() asm "103 PUSHINT";

;; other
int const::min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
int const::provide_address_gas_consumption() asm "10000000 PUSHINT";
```

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged

int op::provide_wallet_address() asm "0x2c76b973 PUSHINT";
int op::take_wallet_address() asm "0xd1735400 PUSHINT";

int is_resolvable?(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);

    return wc == workchain();
}
```

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/jetton-utils.fc

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

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/op-codes.fc

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

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure {
  cell msg = begin_cell()
    .store_uint (0x18, 6) ;; bounce
    .store_slice(address) ;; 267 bit address
    .store_grams(amount)
    .store_uint(0, 107) ;; 106 zeroes +  0 as an indicator that there is no cell with the data
    .end_cell(); 
  send_raw_message(msg, 3); ;; mode, 2 for ignoring errors, 1 for sender pays fees, 64 for returning inbound message value
}

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

const min_tons_for_storage = 10000000; ;; 0.01 TON
const gas_consumption = 10000000; ;; 0.01 TON

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
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
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

  send_raw_message(msg.end_cell(), 64); ;; revert on errors
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  slice from_address = in_msg_body~load_msg_addr();
  slice response_address = in_msg_body~load_msg_addr();

  int forward_ton_amount = in_msg_body~load_coins();

  int ton_balance_before_msg = my_ton_balance - msg_value;
  int storage_fee = min_tons_for_storage - min(ton_balance_before_msg, min_tons_for_storage);
  msg_value -= (storage_fee + gas_consumption);
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
      .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
      .store_slice(owner_address)
      .store_coins(forward_ton_amount)
      .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_ref(msg_body);

    send_raw_message(msg.end_cell(), 1);
  }

  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
    var msg = begin_cell()
      .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
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
  throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption);

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
  cs~load_coins(); 
  int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs 

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

## b298f7708a1c86d76e382609230c5e29d14cb43b2fa78a5f18e25000d93b9a25/stdlib.fc

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

## b48b531abec3b714638291f7d77ed6dc9f6a2729efca20477137374d4ae8b590/vesting_wallet.fc

```fc
#include "imports/stdlib.fc";

const int op::add_whitelist = 0x7258a69b;
const int op::add_whitelist_response = 0xf258a69b;
const int op::send = 0xa7733acd;
const int op::send_response = 0xf7733acd;

;; https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc
;; https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-code.fc
const int op::elector_new_stake = 0x4e73744b;
const int op::elector_recover_stake = 0x47657424;
const int op::vote_for_complaint = 0x56744370;
const int op::vote_for_proposal = 0x566f7465;

;; single-nominator-pool: empty message to deposit; 0x1000 to withdraw https://github.com/orbs-network/single-nominator/blob/main/contracts/single-nominator.fc
const int op::single_nominator_pool_withdraw = 0x1000;
const int op::single_nominator_pool_change_validator = 0x1001;

;; tonstakers.com: deposit to pool; burn, vote to jetton-wallet - https://ton-ls-protocol.gitbook.io/ton-liquid-staking-protocol/protocol-concept/message-processing
const int op::ton_stakers_deposit = 0x47d54391;
const int op::jetton_burn = 0x595f07bc;
const int op::ton_stakers_vote = 0x69fb306c;

const int error::expired = 36;
const int error::invalid_seqno = 33;
const int error::invalid_subwallet_id = 34;
const int error::invalid_signature = 35;

const int error::send_mode_not_allowed = 100;
const int error::non_bounceable_not_allowed = 101;
const int error::state_init_not_allowed = 102;
const int error::comment_not_allowed = 103;
const int error::symbols_not_allowed = 104;

;; https://github.com/ton-blockchain/ton/blob/d2b418bb703ed6ccd89b7d40f9f1e44686012014/crypto/block/block.tlb#L605
const int config_id = 0;
const int elector_id = 1;

;; data

global int stored_seqno;
global int stored_subwallet;
global int public_key;

global cell whitelist;

global int vesting_start_time;
global int vesting_total_duration;
global int unlock_period;
global int cliff_duration;
global int vesting_total_amount;
global slice vesting_sender_address;
global slice owner_address;

;; CONDITIONS:
;; vesting_total_duration > 0
;; vesting_total_duration <= 135 years (2^32 seconds)
;; unlock_period > 0
;; unlock_period <= vesting_total_duration
;; cliff_duration >= 0
;; cliff_duration < vesting_total_duration
;; vesting_total_duration mod unlock_period == 0
;; cliff_duration mod unlock_period == 0

() load_vesting_parameters(cell data) impure inline {
    slice ds = data.begin_parse();
    vesting_start_time = ds~load_uint(64);
    vesting_total_duration = ds~load_uint(32);
    unlock_period = ds~load_uint(32);
    cliff_duration = ds~load_uint(32);
    vesting_total_amount = ds~load_coins();
    vesting_sender_address = ds~load_msg_addr();
    owner_address = ds~load_msg_addr();
    ds.end_parse();
}

cell pack_vesting_parameters() inline {
    return begin_cell()
            .store_uint(vesting_start_time, 64)
            .store_uint(vesting_total_duration, 32)
            .store_uint(unlock_period, 32)
            .store_uint(cliff_duration, 32)
            .store_coins(vesting_total_amount) ;; max 124 bits
            .store_slice(vesting_sender_address) ;; 267 bit
            .store_slice(owner_address) ;; 267 bit
            .end_cell();
}

() load_data() impure inline_ref {
    slice ds = get_data().begin_parse();
    stored_seqno = ds~load_uint(32);
    stored_subwallet = ds~load_uint(32);
    public_key = ds~load_uint(256);
    whitelist = ds~load_dict();
    load_vesting_parameters(ds~load_ref());
    ds.end_parse();
}

() save_data() impure inline_ref {
    set_data(
            begin_cell()
                    .store_uint(stored_seqno, 32)
                    .store_uint(stored_subwallet, 32)
                    .store_uint(public_key, 256)
                    .store_dict(whitelist)
                    .store_ref(pack_vesting_parameters())
                    .end_cell()
    );
}

;; messages utils

const int BOUNCEABLE = 0x18;
const int NON_BOUNCEABLE = 0x10;

const int SEND_MODE_REGULAR = 0;
const int SEND_MODE_PAY_FEES_SEPARETELY = 1;
const int SEND_MODE_IGNORE_ERRORS = 2;
const int SEND_MODE_DESTROY = 32;
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;
const int SEND_MODE_CARRY_ALL_BALANCE = 128;

() return_excess(slice to_address, int op, int query_id) impure inline {
    builder msg = begin_cell()
            .store_uint(BOUNCEABLE, 6)
            .store_slice(to_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op, 32)
            .store_uint(query_id, 64);

    send_raw_message(msg.end_cell(), SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
}

int match_address_from_config(slice address, int config_id) inline_ref {
    (int address_wc, int address_hash) = parse_std_addr(address);
    if (address_wc != -1) {
        return 0;
    }
    cell config_cell = config_param(config_id);
    if (cell_null?(config_cell)) {
        return 0;
    }
    slice config_slice = config_cell.begin_parse();
    if (config_slice.slice_bits() < 256) {
        return 0;
    }
    return address_hash == config_slice.preload_uint(256);
}


;; address utils

const int ADDRESS_SIZE = 264; ;; 256 + 8

slice pack_address(slice address) inline {
    (int wc, int address_hash) = parse_std_addr(address);
    return begin_cell().store_int(wc, 8).store_uint(address_hash, 256).end_cell().begin_parse();
}

(int, int) unpack_address(slice address) inline {
    int wc = address~load_int(8);
    int address_hash = address~load_uint(256);
    return (wc, address_hash);
}

(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";

int _is_whitelisted(slice address) inline {
    (_, int found) = whitelist.dict_get?(ADDRESS_SIZE, pack_address(address));
    return found;
}

;; locked

int _get_locked_amount(int now_time) inline_ref {
    if (now_time > vesting_start_time + vesting_total_duration) {
        return 0;
    }

    if (now_time < vesting_start_time + cliff_duration) {
        return vesting_total_amount;
    }

    return vesting_total_amount - muldiv(vesting_total_amount,
            (now_time - vesting_start_time) / unlock_period,
            vesting_total_duration / unlock_period);
}

() send_message(slice in_msg_body) impure inline_ref {
    int send_mode = in_msg_body~load_uint(8);
    cell msg = in_msg_body~load_ref();
    in_msg_body.end_parse(); ;; only 1 ref allowed

    int locked_amount = _get_locked_amount(now());

    if (locked_amount > 0) { ;; if the vesting has expired, you can send any messages

        throw_unless(error::send_mode_not_allowed, send_mode == SEND_MODE_IGNORE_ERRORS + SEND_MODE_PAY_FEES_SEPARETELY);

        slice msg_cs = msg.begin_parse();
        int flags = msg_cs~load_uint(4);
        slice sender_address = msg_cs~load_msg_addr(); ;; skip
        slice destination_address = msg_cs~load_msg_addr();

        if (~ equal_slices(destination_address, vesting_sender_address)) { ;; can send to vesting_sender_address any message

            if (_is_whitelisted(destination_address)) {
                int is_bounceable = (flags & 2) == 2;
                throw_unless(error::non_bounceable_not_allowed, is_bounceable);

                msg_cs~load_coins(); ;; skip value
                msg_cs~skip_bits(1); ;; skip extracurrency collection
                msg_cs~load_coins(); ;; skip ihr_fee
                msg_cs~load_coins(); ;; skip fwd_fee
                msg_cs~load_uint(64); ;; skip createdLt
                msg_cs~load_uint(32); ;; skip createdAt
                int maybe_state_init = msg_cs~load_uint(1);
                throw_unless(error::state_init_not_allowed, maybe_state_init == 0);

                int maybe_body = msg_cs~load_uint(1);
                slice body = maybe_body ? msg_cs~load_ref().begin_parse() : msg_cs;

                if (match_address_from_config(destination_address, elector_id)) { ;; elector - direct validation

                    int op = body~load_uint(32);
                    throw_unless(error::comment_not_allowed,
                            (op == op::elector_new_stake) | (op == op::elector_recover_stake) | (op == op::vote_for_complaint) | (op == op::vote_for_proposal));

                } elseif (match_address_from_config(destination_address, config_id)) { ;; conifg - direct validation

                    int op = body~load_uint(32);
                    throw_unless(error::comment_not_allowed,
                            (op == op::vote_for_proposal));

                } elseif (body.slice_bits() > 0) { ;; empty message allowed for other destination (not elector)

                    int op = body~load_uint(32);
                    throw_unless(error::comment_not_allowed,
                            (op == 0) | ;; text comment
                                    (op == op::single_nominator_pool_withdraw) | (op == op::single_nominator_pool_change_validator) | ;; single-nominator
                                    (op == op::ton_stakers_deposit) | (op == op::jetton_burn) | (op == op::ton_stakers_vote) | ;; tonstakers.com
                                    (op == op::vote_for_proposal) | (op == op::vote_for_complaint) ;; for future
                            ;; https://app.bemo.finance/ - empty message to deposit; op::jetton_burn to withdraw with cooldown
                    );

                    if ((op == 0) & (body.slice_bits() > 0)) { ;; empty text comment allowed
                        int action = body~load_uint(8);
                        throw_unless(error::symbols_not_allowed,
                                (action == "d"u) | (action == "w"u) | ;; nominator-pool - https://github.com/ton-blockchain/nominator-pool
                                        (action == "D"u) | (action == "W"u) ;; whales pool - https://github.com/tonwhales/ton-nominators/tree/main/sources

                        );
                    }
                }

                locked_amount = 0;
            }

            if (locked_amount > 0) {
                raw_reserve(locked_amount, 2); ;; mode 2 - at most `amount` nanotons. Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved
            }
        }
    }

    send_raw_message(msg, send_mode);
}

;; receive

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_bits() < 32 + 64) { ;; ignore simple transfers
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (equal_slices(sender_address, owner_address) & (op == op::send)) {

        send_message(in_msg_body);

        return_excess(sender_address, op::send_response, query_id);

    } elseif (equal_slices(sender_address, vesting_sender_address) & (op == op::add_whitelist)) {

        slice ref_cs = in_msg_body;
        int has_refs = 0;
        do {
            slice whitelist_address = ref_cs~load_msg_addr();
            whitelist~dict_set_builder(ADDRESS_SIZE, pack_address(whitelist_address), begin_cell().store_int(-1, 1));

            has_refs = ref_cs.slice_refs() > 0;
            if (has_refs) {
                cell ref = ref_cs~load_ref();
                ref_cs = ref.begin_parse();
            }
        } until (~ has_refs);

        return_excess(sender_address, op::add_whitelist_response, query_id);

        save_data();

    }

    ;; else just accept coins from anyone
}

;; same with wallet-v3 https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc#L15
() recv_external(slice in_msg) impure {
    slice signature = in_msg~load_bits(512);
    slice cs = in_msg;
    (int msg_subwallet_id, int valid_until, int msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
    throw_if(error::expired, valid_until <= now());
    slice ds = get_data().begin_parse();
    (int my_seqno, int my_subwallet_id, int my_public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
    throw_unless(error::invalid_seqno, msg_seqno == my_seqno);
    throw_unless(error::invalid_subwallet_id, msg_subwallet_id == my_subwallet_id);
    throw_unless(error::invalid_signature, check_signature(slice_hash(in_msg), signature, my_public_key));

    accept_message();

    load_data();

    if (slice_refs(cs) == 1) {
        try {
            send_message(cs);
        } catch (x, y) {
        }
    }

    stored_seqno += 1;
    save_data();
}

;; get-methods

;; same with wallet-v3 and wallet-v4
int seqno() method_id {
    return get_data().begin_parse().preload_uint(32);
}

;; same with wallet-v4 https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc
int get_subwallet_id() method_id {
    return get_data().begin_parse().skip_bits(32).preload_uint(32);
}

;; same with wallet-v3 and wallet-v4
int get_public_key() method_id {
    return get_data().begin_parse().skip_bits(64).preload_uint(256);
}

(int, int, int, int, int, slice, slice, cell) get_vesting_data() method_id {
    load_data();

    return (vesting_start_time, vesting_total_duration, unlock_period, cliff_duration, vesting_total_amount,
            vesting_sender_address, owner_address, whitelist);
}

;; same with wallet-v4
int is_whitelisted(slice address) method_id {
    load_data();

    return _is_whitelisted(address);
}

;; same with wallet-v4
tuple get_whitelist() method_id {
    load_data();

    var list = null();

    cell d = whitelist;
    do {
        (d, slice key, slice value, int found) = d.dict_delete_get_min(ADDRESS_SIZE);
        if (found) {
            (int wc, int address_hash) = unpack_address(key);
            list = cons(pair(wc, address_hash), list);
        }
    } until (~ found);

    return list;
}

int get_locked_amount(int at_time) method_id {
    load_data();

    return _get_locked_amount(at_time);
}
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

    init(owner: Address, content: Cell, max_supply: Int) {
        self.totalSupply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;

        self.max_supply = max_supply; // Initial Setting for max_supply
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not Owner");
        require(self.mintable, "Can't Mint Anymore");
        self.mint(msg.receiver, msg.amount, self.owner); // (to, amount, response_destination)
    }

    receive(msg: MintPublic) { // Public Minting
        let ctx: Context = context();
        require(self.mintable, "Can't Mint Anymore");
        self.mint(ctx.sender, msg.amount, self.owner);
    }

    receive("Owner: MintClose") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not Owner");
        self.mintable = false;
    }
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
// ============================================================ //
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

## b66c1630c39fa67f1daed236b52af3ce9e67544161b4373375e8b4eef1bcbc59/stdlib.fc

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

```

## b66c1630c39fa67f1daed236b52af3ce9e67544161b4373375e8b4eef1bcbc59/vesting/vesting-lockup-wallet.fc

```fc
int equal_slices(slice a, slice b) asm "SDEQ";
(slice, int) ~load_bool(slice s) asm( -> 1 0) "1 LDI";
builder store_bool(builder b, int x) asm(x b) "1 STI";

int match_address_from_config(slice address, int config_id) inline_ref {
    cell config_cell = config_param(config_id);
    if (cell_null?(config_cell)) {
        return 0;
    }
    slice config_slice = config_cell.begin_parse();
    if (config_slice.slice_bits() < 256) {
        return 0;
    }
    int addr = config_slice.preload_uint(256);
    slice address_from_config = begin_cell()
            .store_uint(4, 3)
            .store_int(-1, 8) ;; masterchain
            .store_uint(addr, 256)
            .end_cell()
            .begin_parse();
    return equal_slices(address, address_from_config);
}

;; stored_seqno, stored_subwallet, public_key, start_time, total_duration, unlock_period, cliff_diration, total_amount, allow_elector
(int, int, int, int, int, int, int, int, int) load_storage() inline {
  var ds = get_data().begin_parse();
  var parsed_data = (ds~load_uint(32),   ;; stored_seqno
                     ds~load_uint(32),   ;; stored_subwallet
                     ds~load_uint(256),  ;; public_key
                     ds~load_uint(64),   ;; start_time
                     ds~load_uint(32),   ;; total_duration
                     ds~load_uint(32),   ;; unlock_period
                     ds~load_uint(32),   ;; cliff_diration
                     ds~load_coins(),    ;; total_amount
                     ds~load_bool());    ;; allow_elector
  ds.end_parse();
  return parsed_data;
}

() recv_internal(slice in_msg) {
    ;; do nothing for internal messages
}

() recv_external(slice in_msg) {
    var signature = in_msg~load_bits(512);
    var cs = in_msg;
    var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
    throw_if(36, valid_until <= now());
    var (stored_seqno, stored_subwallet, public_key,
         start_time, total_duration, unlock_period, cliff_diration,
         total_amount, allow_elector) = load_storage();
    throw_unless(33, msg_seqno == stored_seqno);
    throw_unless(34, subwallet_id == stored_subwallet);
    throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));

    int refs_count = slice_refs(cs);
    if (refs_count == 0) {
        accept_message();
    } else {
        throw_unless(37, refs_count == 1);
        ;; We enforce "ignore errors" mode to prevent balance exhaustion 
        ;; due to incorrect message replay
        ;; see https://ton.org/docs/#/smart-contracts/accept?id=external-messages
        var mode = cs~load_uint(8);
        throw_unless(38, mode == 3);

        cell msg = cs~load_ref();
        slice msg_cs = msg.begin_parse();
        int flags = msg_cs~load_uint(4); ;; skip
        slice sender_address = msg_cs~load_msg_addr(); ;; skip
        slice destination_address = msg_cs~load_msg_addr();

        accept_message();

        int now_time = now();
        int locked_amount =
          (now_time < start_time + cliff_diration) ?
            total_amount :
            (total_amount - total_amount * ((now_time - start_time) / unlock_period) / (total_duration / unlock_period));
        if (now_time > start_time + total_duration) {
            locked_amount = 0;
        }

        if ((locked_amount > 0) & allow_elector & (match_address_from_config(destination_address, 0) | match_address_from_config(destination_address, 1))) {
            locked_amount = 0;
        }

        if (locked_amount > 0) {
            raw_reserve(locked_amount, 2); ;; mode 2 - at most `amount` nanotons. Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved
        }

        send_raw_message(msg, mode);
    }

    set_data(begin_cell()
            .store_uint(stored_seqno + 1, 32)
            .store_uint(stored_subwallet, 32)
            .store_uint(public_key, 256)
            .store_uint(start_time, 64)
            .store_uint(total_duration, 32)
            .store_uint(unlock_period, 32)
            .store_uint(cliff_diration, 32)
            .store_coins(total_amount)
            .store_bool(allow_elector)
            .end_cell());
}

;; Get methods

int seqno() method_id {
    return get_data().begin_parse().preload_uint(32);
}

int get_public_key() method_id {
    var cs = get_data().begin_parse();
    cs~load_uint(64);
    return cs.preload_uint(256);
}

int get_locked_amount(int now_time) method_id {
    var (stored_seqno, stored_subwallet, public_key,
         start_time, total_duration, unlock_period, cliff_diration,
         total_amount, allow_elector) = load_storage();
    int locked_amount =
      (now_time < start_time + cliff_diration) ?
        total_amount :
        (total_amount - total_amount * ((now_time - start_time) / unlock_period) / (total_duration / unlock_period));
    if (now_time > start_time + total_duration) {
        locked_amount = 0;
    }
    return locked_amount;
}

(int, int, int, int, int, int) get_lockup_data() method_id {
    var (stored_seqno, stored_subwallet, public_key,
         start_time, total_duration, unlock_period, cliff_diration,
         total_amount, allow_elector) = load_storage();
    return (start_time, total_duration, unlock_period, cliff_diration, total_amount, allow_elector);
}

```

## b816079eb7f271fdaae6cfdeed50612a502918aa14242b2a557440e30b64e3b5/common.func

```func
const int min_tons_for_storage = 30000000; ;; 0.03 TON
const int workchain = 0;
int equal_slices (slice a, slice b) asm "SDEQ";

() check_std_addr(slice s) impure asm "REWRITESTDADDR" "DROP2";

() refund(slice address) impure inline {
    check_std_addr(address);
    var msg = begin_cell()
    .store_uint(0x10, 6) ;; nobounce
    .store_slice(address)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .end_cell();

    send_raw_message(msg, 128 + 32);
}
```

## b816079eb7f271fdaae6cfdeed50612a502918aa14242b2a557440e30b64e3b5/error_codes.func

```func
int error::exit_code_not_success() asm "100 PUSHINT";
int error::exit_code_not_unsuccess() asm "101 PUSHINT";
int error::data_changed() asm "102 PUSHINT";
int error::data_not_changed() asm "103 PUSHINT";
int error::data_incorrect() asm "104 PUSHINT";
int error::actions_are_not_empty() asm "105 PUSHINT";
int error::actions_empty() asm "106 PUSHINT";
int error::actions_unvalid() asm "107 PUSHINT";
int error::slices_not_equal() asm "108 PUSHINT";
int error::slices_equal() asm "109 PUSHINT";
int error::wrong_action_id() asm "110 PUSHINT";
int error::wrong_send_mode() asm "111 PUSHINT";
int error::not_internal_message() asm "112 PUSHINT";
int error::not_external_message() asm "113 PUSHINT";

int error::not_supported_yet() asm "0xFACC PUSHINT";
```

## b816079eb7f271fdaae6cfdeed50612a502918aa14242b2a557440e30b64e3b5/math.func

```func
{-
    math.func   

    Extends FunC's arithmetic operations.
-}

(int) power(int x, int exponent) inline_ref {
    if(x == 0)
    {
        return 0;
    }

    if (exponent == 0){
        return 1;
    }
    else
    {
        var result = x;
        var counter = exponent;
        while (counter > 1) {
            result *= x;
            counter -= 1;
        }
        return result;
    }
}

(int) sqrt(int x) inline_ref {
  if (x == 0){
    return 0;
  } else {
    if (x <= 3) {
      return 1;
    } else {
      int z = (x + 1) / 2;
      int y = x;
      while (z < y) {
          y = z;
          z = (x / z + z) / 2;
      }
      return y;
    }
  }
}

(int) avg(int x, int y) inline_ref {
    return (x + y) / 2;
}

(int) exp(int x) inline_ref {
    return (x >= 0 ? 1 << x : 1 >> (x * -1));
}

(int) log2(int x) inline_ref {
  int n = 0;
  if (x >= 128.exp()) { 
    x >>= 128; 
    n += 128; 
  }
  if (x >= 64.exp()) { 
    x >>= 64;
    n += 64; 
  }
  if (x >= 32.exp()) {
    x >>= 32; 
    n += 32; 
  }
  if (x >= 16.exp()) { 
    x >>= 16; 
    n += 16; 
  }
  if (x >= 8.exp()) { 
    x >>= 8; 
    n += 8; 
  }
  if (x >= 4.exp()) { 
    x >>= 4; 
    n += 4; 
  }
  if (x >= 2.exp()) { 
    x >>= 2; 
    n += 2; 
  }
  if (x >= 1.exp()) { 
    ;; x >>= 1; 
    n += 1; 
  }
  return n;
}

(int) mod (int x, int y) asm "MOD";

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
    int tg_id,
    slice racing_address,
    slice owner_address,
    slice racer_wallet,
    int range_from,
    int range_to
) impure inline {
    set_data(
        begin_cell()
        .store_uint(tg_id, 64)
        .store_slice(racing_address)
        .store_slice(owner_address)
        .store_slice(racer_wallet)
        .store_uint(range_from, 32)
        .store_uint(range_to, 32)
        .end_cell()
    );
}

;; init?, tg_id, racing_address, owner_address, racer_wallet, range_from, range_to
(int, int, slice, slice, slice, int, int) load_data() impure inline {
    var ds = get_data().begin_parse();
    var (tg_id, racing_address) = (ds~load_uint(64), ds~load_msg_addr());
    if (ds.slice_bits() > 0) {
        return (
            -1,
            tg_id,
            racing_address,
            ds~load_msg_addr(),
            ds~load_msg_addr(),
            ds~load_uint(32),
            ds~load_uint(32)
        );
    } else {
        return (
            0, 
            tg_id, 
            racing_address, 
            null(), 
            null(), 
            null(), 
            null()
        );
    }
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

    var (init?, tg_id, racing_address, owner_address, racer_wallet, range_from, range_to) = load_data();
    if (~ init?) {
        throw_unless(401, equal_slices(racing_address, sender_address));
        store_data(tg_id, racing_address, in_msg_body~load_msg_addr(), in_msg_body~load_msg_addr(), in_msg_body~load_uint(32), in_msg_body~load_uint(32));
        return ();
    }

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);
    
    if (op == 555) {
        throw_unless(401, equal_slices(owner_address, sender_address));
        refund(in_msg_body~load_msg_addr());
        return ();
    }

    throw(0xffff);
}

(int, slice, slice, int, int) get_racer_data() method_id {
    var (init?, tg_id, racing_address, _, racer_wallet, range_from, range_to) = load_data();
    return (
        tg_id, 
        racing_address, 
        racer_wallet, 
        range_from, 
        range_to
    );
}
```

## b816079eb7f271fdaae6cfdeed50612a502918aa14242b2a557440e30b64e3b5/stdlib.func

```func
;; Standard library for funC
;;
forall X -> tuple unsafe_tuple(X x) asm "NOP";
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

cell get_c5() asm "c5 PUSH";
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
builder store_builder(builder to, builder from) asm "STBR";

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
() set_lib_code(cell library, int x) impure asm "SETLIBCODE";
() change_lib(int lib_hash, int x) impure asm "CHANGELIB";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
() set_seed(int) impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";
```

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/gas.fc

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
const JETTON_WALLET_BITS  = 1033;

;;- `JETTON_WALLET_CELLS`: [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_CELLS = 3;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_BITS  = 931;
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

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L853](L853)
const SEND_TRANSFER_GAS_CONSUMPTION    = 10065;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L862](L862)
const RECEIVE_TRANSFER_GAS_CONSUMPTION = 10435;

;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1154](L1154)
const SEND_BURN_GAS_CONSUMPTION    = 5891;

;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1155](L1155)
const RECEIVE_BURN_GAS_CONSUMPTION = 6757;


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

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/jetton-utils.fc

```fc
#include "workchain.fc";

const int STATUS_SIZE = 4;

builder pack_jetton_wallet_data_builder(int status, int balance, slice owner_address, slice jetton_master_address) inline {
    return begin_cell()
        .store_uint(status, STATUS_SIZE)
        .store_coins(balance)
        .store_slice(owner_address)
        .store_slice(jetton_master_address);
}

cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address) inline {
    return pack_jetton_wallet_data_builder(status, balance, owner_address, jetton_master_address)
           .end_cell();
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
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
            jetton_master_address)
    )
    .store_uint(0, 1) ;; Empty libraries
    .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}
    return begin_cell()
    .store_uint(4, 3) ;; 0b100 = addr_std$10 tag; No anycast
    .store_int(MY_WORKCHAIN, 8)
    .store_uint(cell_hash(state_init), 256)
    .end_cell()
    .begin_parse();
}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
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

(int, int, slice, slice) load_data() inline {
    slice ds = get_data().begin_parse();
    var data = (
        ds~load_uint(STATUS_SIZE), ;; status
        ds~load_coins(), ;; balance
        ds~load_msg_addr(), ;; owner_address
        ds~load_msg_addr() ;; jetton_master_address
    );
    ds.end_parse();
    return data;
}

() save_data(int status, int balance, slice owner_address, slice jetton_master_address) impure inline {
    builder data_builder = pack_jetton_wallet_data_builder(status, balance, owner_address, jetton_master_address);
    set_data(data_builder.end_cell());
}


() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref {
    ;; see transfer TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    check_same_workchain(to_owner_address);
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    ;; int outgoing_transfers_unlocked = ((status & 1) == 0);
    ;;throw_unless(error::contract_locked, outgoing_transfers_unlocked);
    throw_unless(error::not_owner, equal_slices_bits(owner_address, sender_address));

    balance -= jetton_amount;
    throw_unless(error::balance_error, balance >= 0);

    cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, my_code());
    slice to_wallet_address = calculate_jetton_wallet_address(state_init);
    slice response_address = in_msg_body~load_msg_addr();
    in_msg_body~skip_maybe_ref(); ;; custom_payload
    int forward_ton_amount = in_msg_body~load_coins();
    check_either_forward_payload(in_msg_body);
    slice either_forward_payload = in_msg_body;

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
    .store_slice(to_wallet_address)
    .store_coins(0)
    .store_statinit_ref_and_body_ref(state_init, msg_body)
    .end_cell();

    check_amount_is_enough_to_transfer(msg_value, forward_ton_amount, fwd_fee);

    send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);

    save_data(status, balance, owner_address, jetton_master_address);
}

() receive_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    ;; int incoming_transfers_locked = ((status & 2) == 2);
    ;; throw_if(error::contract_locked, incoming_transfers_locked);
    ;; see internal TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    throw_unless(error::not_valid_wallet,
        equal_slices_bits(jetton_master_address, sender_address)
        |
        equal_slices_bits(calculate_user_jetton_wallet_address(from_address, jetton_master_address, my_code()), sender_address)
    );
    balance += jetton_amount;

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
    throw_unless(error::not_owner, equal_slices_bits(owner_address, sender_address));
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
    if (is_bounced(msg_flags)) {
        on_bounce(in_msg_body);
        return ();
    }
    slice sender_address = in_msg_full_slice~load_msg_addr();
    int fwd_fee_from_in_msg = in_msg_full_slice~retrieve_fwd_fee();
    int fwd_fee = get_original_fwd_fee(MY_WORKCHAIN, fwd_fee_from_in_msg); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_op();

    ;; outgoing transfer
    if (op == op::transfer) {
        send_jettons(in_msg_body, sender_address, msg_value, fwd_fee);
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
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    return (balance, owner_address, jetton_master_address, my_code());
}

int get_status() method_id {
    (int status, _, _, _) = load_data();
    return status;
}
```

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/op-codes.fc

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
const op::drop_admin = 0x7431f221;
const op::upgrade = 0x2508d66a;
const op::change_metadata_uri = 0xcb862902;

;; jetton-wallet

const op::set_status = 0xeed236d3;

const error::contract_locked = 45;
const error::balance_error = 47;
const error::not_enough_gas = 48;
const error::invalid_message = 49;

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
    return msg_flags & 1;
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

## ba2918c8947e9b25af9ac1b883357754173e5812f807a3d6e642a14709595395/contracts/workchain.fc

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

## ba4d975d2b66231c1f0a0ccca6e8ff8f7ba0610c4b7639584b8e98303dc3128c/imports/params.fc

```fc
int workchain() asm "0 PUSHINT";
int min_tons_for_storage() asm "50000000 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
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
;; ~idict_get_ref
(cell, (cell, int)) ~idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
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
int builder_null?(builder b) asm "ISNULL";
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
    throw_unless(708, slice_bits(in_msg_body) >= 1);

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
    int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs


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

## ba4d975d2b66231c1f0a0ccca6e8ff8f7ba0610c4b7639584b8e98303dc3128c/op-codes.fc

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

;; SBT
int op::request_owner() asm "0xd0c3bfea PUSHINT";
int op::owner_info() asm "0x0dd607e3 PUSHINT";

int op::prove_ownership() asm "0x04ded148 PUSHINT";
int op::ownership_proof() asm "0x0524c7ae PUSHINT";
int op::ownership_proof_bounced() asm "0xc18e86d2 PUSHINT";

int op::destroy() asm "0x1f04537a PUSHINT";
int op::revoke() asm "0x6f89f5e3 PUSHINT";
int op::take_excess() asm "0xd136d3b3 PUSHINT";

;; Admin
int op::take_balance() asm "0x1fbcd6fd PUSHINT";
int op::team_mint() asm "0x1f3b3b9d PUSHINT";
```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/imports/stdlib.fc

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

global int      init?; ;; init_data safe check
global int      end?; ;; end auction or not
global slice    mp_addr; ;; the address of the marketplace from which the contract is deployed
global int      activated?; ;; contract is activated by external message or by nft transfer
global int      created_at?; ;; timestamp of created acution
global int      is_canceled?; ;; auction was cancelled by owner

global cell fees_cell;
global cell constant_cell;

;; bids info cell (ref)
global int      min_bid; ;; minimal bid
global int      max_bid; ;; maximum bid
global int      min_step; ;; minimum step (can be 0)
global slice    last_member; ;; last member address
global int      last_bid; ;; last bid amount
global int      last_bid_at; ;; timestamp of last bid
global int      last_query_id; ;; last processed query id
global int      end_time; ;; unix end time
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30)
global int      mp_fee_factor;
global int      mp_fee_base;
global int      royalty_fee_factor;
global int      royalty_fee_base;

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction)
global slice    nft_addr; ;; nft address

() pack_data() impure inline_ref {
  set_data(
    begin_cell()
    .store_int(end?, 1) ;; + stc    1
    .store_int(is_canceled?, 1) ;; 1
    .store_slice(last_member) ;; + max    267 ($10 with Anycast = 0)
    .store_coins(last_bid) ;; + max    124
    .store_uint(last_bid_at, 32) ;; + stc    32
    .store_uint(end_time, 32) ;; + stc    32
    .store_slice(nft_owner) ;; 267
    .store_uint(last_query_id, 64)
    .store_uint(mp_fee_factor, 32)
    .store_uint(mp_fee_base, 32)
    .store_uint(royalty_fee_factor, 32)
    .store_uint(royalty_fee_base, 32)
    .store_ref(fees_cell) ;; + ref
    .store_ref(constant_cell) ;; + ref
    .end_cell() ;; total 267 + 124 + 32 + 32 + 267 + 1 + 1 + 1 + 64 = 789
  );
}

(slice, slice) get_fees_addresses() inline_ref {
  slice fees = fees_cell.begin_parse();
  slice mp_fee_addr = fees~load_msg_addr();
  slice royalty_fee_addr = fees~load_msg_addr();
  return (
    mp_fee_addr,
    royalty_fee_addr
  );
}

() init_data() impure inline_ref {- save for get methods -} {
  ifnot(null?(init?)) { return ();}

  slice ds = get_data().begin_parse();
  end? = ds~load_int(1);
  is_canceled? = ds~load_int(1);
  last_member = ds~load_msg_addr();
  last_bid = ds~load_coins();
  last_bid_at = ds~load_uint(32);
  end_time = ds~load_uint(32);
  nft_owner = ds~load_msg_addr();
  last_query_id = ds~load_uint(64);
  mp_fee_factor = ds~load_uint(32);
  mp_fee_base = ds~load_uint(32);
  royalty_fee_factor = ds~load_uint(32);
  royalty_fee_base = ds~load_uint(32);
  activated? = nft_owner.slice_bits() > 2;

  fees_cell = ds~load_ref();
  constant_cell = ds~load_ref();
  slice constants = constant_cell.begin_parse();
  mp_addr = constants~load_msg_addr();
  min_bid = constants~load_coins();
  max_bid = constants~load_coins();
  min_step = constants~load_uint(7);
  step_time = constants~load_uint(17);
  nft_addr = constants~load_msg_addr();
  created_at? = constants~load_uint(32);

  init? = true;
}

{-
    SHOULD
    [+] check init auction or not
    [+] check op
    [+] change nft owner
    [+] change auction status
-}
() handle::try_init_auction(slice sender_addr, slice in_msg_body) impure inline_ref {
  throw_if(exit::auction_init(), nft_owner.slice_bits() > 2); ;; throw if auction already init
  throw_unless(exit::no_transfer(), in_msg_body~load_uint(32) == op::ownership_assigned()); ;; throw if it`s not ownership assigned
  in_msg_body~skip_bits(64); ;; query id
  nft_owner = in_msg_body~load_msg_addr();
  end? = false;
  activated? = true;
  pack_data();
}


() handle::cancel(slice sender_addr) impure inline_ref {
  builder nft_transfer_body = begin_cell()
  .store_uint(op::transfer(), 32)
  .store_uint(cur_lt(), 64) ;; query id
  .store_slice(nft_owner) ;; return nft no creator
  .store_slice(sender_addr) ;; response_destination
  .store_uint(0, 1) ;; custom payload
  .store_coins(0) ;; forward amount
  .store_uint(0, 1); ;; forward payload

  builder nft_return_msg = begin_cell()
  .store_uint(0x18, 6)
  .store_slice(nft_addr)
  .store_coins(0)
  .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
  .store_ref(nft_transfer_body.end_cell());

  send_raw_message(nft_return_msg.end_cell(), 130);
  end? = true;
  is_canceled? = true;
  pack_data();
}

() handle::end_auction(slice sender_addr, int from_external) impure inline_ref {
  if (last_bid == 0) { ;; just return nft
    if (from_external == true) {
      [int my_balance, _] = get_balance();
      throw_if(exit::low_bid(), my_balance < 500000000); ;; 0.5 ton
      accept_message();
    }
    handle::cancel(sender_addr);
    return ();
  }

  var (
    mp_fee_addr,
    royalty_fee_addr
  ) = get_fees_addresses();

  int mp_fee = math::get_percent(last_bid, mp_fee_factor, mp_fee_base);
  int royalty_fee = math::get_percent(last_bid, royalty_fee_factor, royalty_fee_base);
  int profit = last_bid - mp_fee - royalty_fee;
  if (from_external == true) {
    ;; if profit less 0.5 TON then prevent end auc by external message
    throw_if(exit::low_bid(), profit < 500000000);
    ;; we will send 0.5 ton to nft
    ;; and it returns to nft_owner
    ;; because when from_external == true sender_addr should be nft_owner
    profit = profit - 500000000;
    accept_message();
  }

  if (mp_fee > 0) {
    builder mp_transfer = begin_cell()
    .store_uint(0x10, 6) ;; 0 (int_msg_info) 1 (ihr_disabled) 1 (no bounces) 00 (address)
    .store_slice(mp_fee_addr)
    .store_coins(mp_fee)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(0, 32)
    .store_slice(msg::mp_msg());

    send_raw_message(mp_transfer.end_cell(), 2);
  }



  if (royalty_fee > 0) {
    builder royalty_transfer = begin_cell()
    .store_uint(0x10, 6) ;; 0 (int_msg_info) 1 (ihr_disabled) 1 (no bounces) 00 (address)
    .store_slice(royalty_fee_addr)
    .store_coins(royalty_fee)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(0, 32)
    .store_slice(msg::royalty_msg());

    send_raw_message(royalty_transfer.end_cell(), 2);
  }

  if (profit > 0) {
    builder prev_owner_msg = begin_cell()
    .store_uint(0x10, 6) ;; 0 (int_msg_info) 1 (ihr_disabled) 1 (no bounces) 00 (address)
    .store_slice(nft_owner)
    .store_coins(profit)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(0, 32)
    .store_slice(msg::profit_msg());

    send_raw_message(prev_owner_msg.end_cell(), 2);
  }

  builder nft_transfer_body = begin_cell()
  .store_uint(op::transfer(), 32)
  .store_uint(cur_lt(), 64) ;; query id
  .store_slice(last_member) ;; new owner
  .store_slice(sender_addr) ;; response_destination
  .store_uint(0, 1) ;; custom payload
  .store_coins(1) ;; forward amount  1 nano ton
  .store_uint(0, 1); ;; forward payload
  builder nft_transfer = begin_cell()
  .store_uint(0x18, 6)
  .store_slice(nft_addr)
  .store_coins(0)
  .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
  .store_ref(nft_transfer_body.end_cell());
  send_raw_message(nft_transfer.end_cell(), 130); ;; 128 +2 for ignoring errors
  end? = true;
  end_time = now();
  pack_data();
}

;;
;;  main code
;;

() return_last_bid(int my_balance) impure inline_ref {
  if (last_bid <= 0) {
    return ();
  }
  int return_bid_amount = last_bid - 5577000; ;; 0,005577 TON magic gas price per bid processing
  if (return_bid_amount > (my_balance - 10000000)) { ;; - 0.01 TON
    return_bid_amount = my_balance - 10000000;
  }
  if (return_bid_amount > 0) {
    slice msg = msg::bid_return();
    builder return_prev_bid = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(last_member)
    .store_coins(return_bid_amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(0, 32)
    .store_slice(msg);

    send_raw_message(return_prev_bid.end_cell(), 2);
  }
}

(int,int) get_command_code(slice s) inline_ref {
  if (slice_empty?(s) == true) {
    return (0,0);
  }

  int op = s~load_uint(32);
  int query_id = 0;
  if (equal_slices(msg::cancel_msg(), s)) {
    return (1,query_id);
  } elseif (equal_slices(msg::stop_msg(), s)) {
    return (2,query_id);
  } elseif (equal_slices(msg::finish_msg(), s)) {
    return (2,query_id); ;; 2 its ok
  } elseif (equal_slices(msg::deploy(), s)) {
    return (3,query_id);
  } else {
    if (slice_bits(s) >= 64) {
      query_id = s~load_uint(64);
    }
    return (op,query_id); ;; return op if it's not a message
  }
}

int get_next_min_bid() {
  return max(
    last_bid + 100000000,
    math::get_percent(last_bid, 100 + min_step, 100)
  );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure {
  slice cs = in_msg_cell.begin_parse();
  throw_if(0, cs~load_uint(4) & 1);

  slice sender_addr = cs~load_msg_addr();
  init_data();

  if (equal_slices(sender_addr, nft_addr) & (end? == false)) {
    handle::try_init_auction(sender_addr, in_msg_body);
    return ();
  }

  var (op, query_id) = get_command_code(in_msg_body);

  if (op == 555) {
    throw_unless(exit::not_cancel(), ((end? == true) | (activated? == false)));
    throw_unless(403, equal_slices(sender_addr, mp_addr));
    ;; way to fix unexpected troubles with auction contract
    ;; for example if some one transfer nft to this contract
    var msg = in_msg_body~load_ref().begin_parse();
    var mode = msg~load_uint(8);
    throw_if(exit::bad_mode(), mode & 32);

    int ten_min = 10 * 60;
    throw_if(exit::last_bid_too_close(), (now() > (end_time - ten_min)) & (now() < (end_time + ten_min)));
    if (last_bid_at != 0 ) {
      throw_if(exit::last_bid_too_close(), (now() > (last_bid_at - ten_min)) & (now() < (last_bid_at + ten_min)));
    }

    send_raw_message(msg~load_ref(), mode);
    return ();
  }

  if (op == 1) { ;; cancel command, return nft, return last bid
    throw_if(exit::auction_end(), now() >= end_time); ;; after timeout can't cancel
    throw_if(exit::auction_end(), end? == true); ;; already canceled/ended
    throw_if(exit::not_activated_yet(), activated? == false);
    throw_if(exit::low_amount(), msg_value < 100000000);
    throw_if(exit::cant_cancel_bid(), last_bid > 0); ;; can't cancel if someone already placed a bid
    throw_unless(403, equal_slices(sender_addr, nft_owner) | equal_slices(sender_addr, mp_addr));
    handle::cancel(sender_addr);
    return ();
  }

  if (op == 2) { ;; stop auction
    throw_if(exit::auction_end(), end? == true); ;; end = true mean this action already executed
    throw_if(exit::not_activated_yet(), activated? == false);
    throw_if(exit::low_amount(), msg_value < 100000000);
    throw_if(exit::cant_stop_time(), now() < end_time); ;; can't end auction in progress, only after end time
    throw_unless(403, equal_slices(sender_addr, nft_owner) | equal_slices(sender_addr, mp_addr) | equal_slices(sender_addr, last_member));
    handle::end_auction(sender_addr, false);
    return ();
  }

  if (op == 3) {
    ;; just accept coins
    return ();
  }

  if (activated? == false) {
    throw(exit::not_activated_yet());
    return ();
  }

  if ((end? == true) | (now() >= end_time)) {
    throw(exit::auction_end());
    return ();
  }

  ;; new bid

  var profitable = math::check_profitable(mp_fee_factor, mp_fee_base, royalty_fee_factor, royalty_fee_base);
  throw_if(exit::non_profitable(), profitable == 0); ;; decline bids for invalid contract
  int duration = end_time - now();
  ;; auction large than 20 days not allowed
  throw_if(exit::its_too_log_auc(), duration > 60 * 60 * 24 * 20);

  ;; max bid buy nft
  if ((msg_value >= max_bid + 100000000) & (max_bid > 0)) { ;; 0.1 TON
    ;; end aution for this bid
    return_last_bid(my_balance);
    last_member = sender_addr;
    last_bid = max_bid;
    last_bid_at = now();
    last_query_id = query_id;
    handle::end_auction(sender_addr, false);
    return ();
  }

  ;; prevent bid at last second
  if ((end_time - step_time) < now()) {
    end_time += step_time;
  }

  ifnot(last_bid) {
    throw_if(exit::low_bid(), msg_value < min_bid);
    last_bid = msg_value;
    last_member = sender_addr;
    last_bid_at = now();
    last_query_id = query_id;
    pack_data();
    return ();
  }

  int new_min_bid = get_next_min_bid();
  if (msg_value < new_min_bid) {
    throw(exit::low_bid());
    return ();
  }

  return_last_bid(my_balance);

  last_member = sender_addr;
  last_bid = msg_value;
  last_bid_at = now();
  last_query_id = query_id;

  pack_data();
}

{-
    Message for deploy contract external
-}
() recv_external(slice in_msg) impure {
  init_data();

  var (op, _) = get_command_code(in_msg);

  if (op == 2) { ;; stop auction
    throw_if(exit::not_activated_yet(), activated? == false);
    throw_if(exit::auction_end(), end? == true); ;; end = true mean this action already executed
    throw_if(exit::cant_stop_time(), now() < end_time); ;; can't end auction in progress, only after end time
    handle::end_auction(nft_owner, true);
    accept_message();
    return ();
  }

  throw(0xffff);
}

;; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id {
  init_data();

  var (
    mp_fee_addr,
    royalty_fee_addr
  ) = get_fees_addresses();

  var profitable = math::check_profitable(mp_fee_factor, mp_fee_base, royalty_fee_factor, royalty_fee_base);
  throw_if(exit::non_profitable(), profitable == 0);

  return (
    0x415543, ;; 1 nft aucion ("AUC")
    end?, ;; 2
    end_time, ;; 3
    mp_addr, ;; 4
    nft_addr, ;; 5
    nft_owner, ;; 6
    last_bid, ;; 7
    last_member, ;; 8
    min_step, ;; 9
    mp_fee_addr, ;; 10
    mp_fee_factor, mp_fee_base, ;; 11, 12
    royalty_fee_addr, ;; 13
    royalty_fee_factor, royalty_fee_base, ;; 14, 15
    max_bid, ;; 16
    min_bid, ;; 17
    created_at?, ;; 18
    last_bid_at, ;; 19
    is_canceled? ;; 20
  );
}


(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int, int, int) get_auction_data() method_id {
  init_data();

  var (
    mp_fee_addr,
    royalty_fee_addr
  ) = get_fees_addresses();

  var profitable = math::check_profitable(mp_fee_factor, mp_fee_base, royalty_fee_factor, royalty_fee_base);
  throw_if(exit::non_profitable(), profitable == 0);

  if (last_bid > 0) {
    min_bid = get_next_min_bid();
  }

  return (
    activated?, ;;1
    end?, ;; 2
    end_time, ;; 3
    mp_addr, ;; 4
    nft_addr, ;; 5
    nft_owner, ;; 6
    last_bid, ;; 7
    last_member, ;; 8
    min_step, ;; 9 min step
    mp_fee_addr, ;; 10
    mp_fee_factor, mp_fee_base, ;; 11, 12
    royalty_fee_addr, ;; 13
    royalty_fee_factor, royalty_fee_base, ;; 14, 15
    max_bid, ;; 16
    min_bid, ;; 17
    created_at?, ;; 18
    last_bid_at, ;; 19
    is_canceled?, ;; 20
    step_time, ;; 21
    last_query_id ;; 22
  );
}

```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/struct/exit-codes.func

```func
;;
;;  custom TVM exit codes
;;

int exit::low_bid()             asm "1000 PUSHINT";
int exit::auction_init()        asm "1001 PUSHINT";
int exit::no_transfer()         asm "1002 PUSHINT";
int exit::not_message()         asm "1003 PUSHINT";
int exit::not_cancel()          asm "1004 PUSHINT";
int exit::auction_end()         asm "1005 PUSHINT";
int exit::already_activated()   asm "1006 PUSHINT";
int exit::cant_cancel_end()     asm "1007 PUSHINT";
int exit::low_amount()          asm "1008 PUSHINT";
int exit::cant_cancel_bid()     asm "1009 PUSHINT";
int exit::cant_stop_time()      asm "1010 PUSHINT";
int exit::non_profitable()      asm "1011 PUSHINT";
int exit::bad_mode()            asm "1012 PUSHINT";
int exit::last_bid_too_close()  asm "1013 PUSHINT";
int exit::its_too_log_auc()     asm "1014 PUSHINT";
int exit::not_activated_yet()   asm "1015 PUSHINT";

```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/struct/math.func

```func
;;
;;  math utils
;;

int division(int a, int b) { ;; division with factor
    return muldiv(a, 1000000000 {- 1e9 -}, b);
}

int multiply(int a, int b) { ;; multiply with factor
    return muldiv (a, b, 1000000000 {- 1e9 -});
}

int math::get_percent(int a, int percent, int factor) {
    if (factor == 0) {
        return 0;
    } else {
        return division(multiply(a, percent), factor);
    }
}

int math::check_profitable(int mp_fee_factor, int mp_fee_base, int royalty_fee_factor, int royalty_fee_base) {
    int amount = 1000000000;
    int mp_fee = math::get_percent(amount, mp_fee_factor, mp_fee_base);
    int royalty_fee = math::get_percent(amount, royalty_fee_factor, royalty_fee_base);
    int profit = amount - mp_fee - royalty_fee;
    if (profit < 1) {
        return 0;
    }
    return 1;
}
```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/struct/msg-utils.func

```func
;;
;;  text constants for msg comments
;;

slice msg::cancel_msg()     asm "<b 124 word cancel| $, b> <s PUSHSLICE";
slice msg::stop_msg()       asm "<b 124 word stop| $, b> <s PUSHSLICE";
slice msg::finish_msg()       asm "<b 124 word finish| $, b> <s PUSHSLICE";
slice msg::deploy()       asm "<b 124 word deploy| $, b> <s PUSHSLICE";

slice msg::return_msg()     asm "<b 124 word Your transaction has not been accepted.| $, b> <s PUSHSLICE";
slice msg::bid_return()     asm "<b 124 word Your bid has been outbid by another user.| $, b> <s PUSHSLICE";
slice msg::mp_msg()         asm "<b 124 word Marketplace fee| $, b> <s PUSHSLICE";
slice msg::royalty_msg()    asm "<b 124 word Royalty| $, b> <s PUSHSLICE";
slice msg::profit_msg()     asm "<b 124 word Profit| $, b> <s PUSHSLICE";
slice msg::auc_is_canceled() asm "<b 124 word Auction has been cancelled.| $, b> <s PUSHSLICE";
```

## bb6f62ade0feb2d79fab3b8aebf0930af98553df60093b2027f0a8bf169bfcec/struct/op-codes.func

```func
;;
;;  op codes
;;

int op::transfer()              asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned()    asm "0x05138d91 PUSHINT";
```

## bb9ba6dafd7372b81ee66d7dbfca388e7384998a3ae1790b871ce672185c7829/common.fc

```fc
#include "stdlib.fc";

const int op::deposit_to_bill = 0x8ad026be;
const int op::withdraw_from_bill = 0xd6416bfe;

const int error::msg_value_at_least_one_ton = 60;
const int error::only_text_comments_supported = 61;
const int error::invalid_comment = 62;
const int error::invalid_comment_length = 63;

const int ONE_TON = 1000000000;

const int WORKCHAIN = 0;

const int BOUNCEABLE = 0x18;
const int NON_BOUNCEABLE = 0x10;

const int SEND_MODE_REGULAR = 0;
const int SEND_MODE_PAY_FEES_SEPARETELY = 1;
const int SEND_MODE_IGNORE_ERRORS = 2;
const int SEND_MODE_DESTROY = 32;
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;
const int SEND_MODE_CARRY_ALL_BALANCE = 128;

cell pack_bill_data(slice locker_address, int total_coins_deposit, slice user_address, int last_withdraw_time) inline {
    return begin_cell()
            .store_slice(locker_address)
            .store_coins(total_coins_deposit)
            .store_slice(user_address)
            .store_uint(last_withdraw_time, 32)
            .end_cell();
}

cell calculate_bill_state_init(slice locker_address, slice user_address, cell bill_code) inline {
    return begin_cell()
            .store_uint(0, 2)
            .store_dict(bill_code)
            .store_dict(pack_bill_data(locker_address, 0, user_address, 0))
            .store_uint(0, 1)
            .end_cell();
}

slice create_address(int wc, int address_hash) inline {
    return begin_cell().store_uint(4, 3)
            .store_int(wc, 8)
            .store_uint(address_hash, 256)
            .end_cell()
            .begin_parse();
}

slice calculate_address_by_state_init(cell state_init) inline {
    return create_address(WORKCHAIN, cell_hash(state_init));
}

slice calculate_bill_address(slice locker_address, slice user_address, cell bill_code) inline {
    return calculate_address_by_state_init(calculate_bill_state_init(locker_address, user_address, bill_code));
}

builder create_msg(int flags, slice to_address, int value) inline {
    return begin_cell()
            .store_uint(flags, 6)
            .store_slice(to_address)
            .store_coins(value)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);
}
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

## bb9ba6dafd7372b81ee66d7dbfca388e7384998a3ae1790b871ce672185c7829/locker_bill.fc

```fc
#include "stdlib.fc";
#include "common.fc";

const int error::only_locker_address = 80;
const int error::only_user_address = 82;

;; storage variables

(slice, int, slice, int) load_data() impure inline {
    slice ds = get_data().begin_parse();

    slice locker_address = ds~load_msg_addr();
    int total_coins_deposit = ds~load_coins();
    slice user_address = ds~load_msg_addr();
    int last_withdraw_time = ds~load_uint(32);

    ds.end_parse();

    return (locker_address, total_coins_deposit, user_address, last_withdraw_time);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }

    int op = in_msg_body~load_uint(32);
    slice sender_address = cs~load_msg_addr();
    (slice locker_address, int total_coins_deposit, slice user_address, int last_withdraw_time) = load_data();
    int is_locker = equal_slices(sender_address, locker_address);

    if (op == op::deposit_to_bill) { ;; probably deposit notify from locker

        throw_unless(error::only_locker_address, is_locker);
        int amount = in_msg_body~load_coins();
        in_msg_body.end_parse();
        total_coins_deposit += amount;

    } else {

        throw_unless(error::only_text_comments_supported, op == 0);
        int action = in_msg_body~load_uint(8);
        in_msg_body.end_parse();
        int is_withdraw = action == "w"u;
        int is_recover = action == "e"u;
        throw_unless(error::invalid_comment, is_withdraw | is_recover);

        if (is_recover) { ;; if the user mistakenly sent a deposit not to the locker but directly to the bill - we give him the opportunity to withdraw these coins
            throw_unless(error::only_user_address, equal_slices(sender_address, user_address));

            raw_reserve(ONE_TON, 2); ;; reserve 1 ton for storage fees

            builder msg = create_msg(BOUNCEABLE, user_address, 0);
            send_raw_message(msg.end_cell(), SEND_MODE_CARRY_ALL_BALANCE);

            return ();
        }

        ;; withdraw

        throw_unless(error::only_locker_address, is_locker);

        int now_time = now();

        builder msg = create_msg(BOUNCEABLE, locker_address, 0)
                .store_uint(op::withdraw_from_bill, 32)
                .store_slice(user_address)
                .store_coins(total_coins_deposit)
                .store_uint(last_withdraw_time, 32)
                .store_uint(now_time, 32);

        send_raw_message(msg.end_cell(), SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);

        last_withdraw_time = now_time;

    }

    set_data(pack_bill_data(locker_address, total_coins_deposit, user_address, last_withdraw_time));

}

(slice, int, slice, int) get_locker_bill_data() method_id {
    return load_data();
}

```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/collection.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";


global int storage::merkle_root;
global int storage::merkle_depth;
global cell storage::nft_item_code;
global slice storage::owner;
global cell storage::content;
global cell storage::royalty;
global int storage::last_index;
global cell storage::api_data;

const int node_dict_key_len = 32;

const int error::not_owner = 100;
const int error::bad_proof = 101;
const int error::index_too_high = 102;
const int error::tree_full = 103;
const int error::malformed_updates = 104;

const int op::claim = "op::claim"c;
const int op::update = "op::update"c;

const int item_init_value = 50000000;

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::merkle_root = ds~load_uint(256);
    storage::merkle_depth = ds~load_uint(8);
    storage::nft_item_code = ds~load_ref();
    storage::owner = ds~load_msg_addr();
    storage::content = ds~load_ref();
    storage::royalty = ds~load_ref();
    storage::last_index = ds~load_uint(256);
    storage::api_data = ds~load_ref();

    ds.end_parse();
}

() save_data() impure {
    set_data(begin_cell()
        .store_uint(storage::merkle_root, 256)
        .store_uint(storage::merkle_depth, 8)
        .store_ref(storage::nft_item_code)
        .store_slice(storage::owner)
        .store_ref(storage::content)
        .store_ref(storage::royalty)
        .store_uint(storage::last_index, 256)
        .store_ref(storage::api_data)
        .end_cell());
}

int hash_nodes(int a, int b) {
    return begin_cell().store_uint(a, 256).store_uint(b, 256).end_cell().cell_hash();
}

int get_node(cell p, int i) {
    (slice v, int ok) = p.udict_get?(node_dict_key_len, i);
    throw_unless(101, ok);
    return v.preload_uint(256);
}

(cell, ()) set_node(cell p, int i, int v) {
    p~udict_set_builder(node_dict_key_len, i, begin_cell().store_uint(v, 256));
    return (p, ());
}

int check_proof(int root, cell proof, int leaf, int leaf_index, int depth) {
    int i = 0;
    int cur = leaf;
    while (i < depth) {
        int is_right = (leaf_index >> i) & 1;
        if (is_right) {
            cur = hash_nodes(proof.get_node(i), cur);
        } else {
            cur = hash_nodes(cur, proof.get_node(i));
        }
        i += 1;
    }
    return cur == root;
}

(slice, cell) parse_nft_data(cell nft_data) {
    slice ds = nft_data.begin_parse();
    return (ds~load_msg_addr(), ds~load_ref());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
    cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
    return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(cell state_init) {
    return begin_cell()
        .store_uint(4, 3)
        .store_int(workchain, 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

() deploy_nft_item(int item_index, int amount, cell nft_message) impure {
    cell state_init = calculate_nft_item_state_init(item_index, storage::nft_item_code);
    slice nft_address = calculate_nft_item_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(nft_message);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

() claim(int nft_index, cell nft_data, cell proof) impure {
    throw_if(error::index_too_high, nft_index > storage::last_index);

    throw_unless(error::bad_proof, check_proof(storage::merkle_root, proof, nft_data.cell_hash(), nft_index, storage::merkle_depth));

    (slice owner, cell content) = nft_data.parse_nft_data();

    deploy_nft_item(nft_index, item_init_value, begin_cell().store_slice(owner).store_ref(content).end_cell()); ;; inline the nft_data?
}

() update(cell updates, int new_last_index, cell hashes) impure {
    throw_if(error::tree_full, storage::last_index >= ((1 << storage::merkle_depth) - 1));
    throw_unless(error::malformed_updates, new_last_index > storage::last_index);

    int cur_left = (storage::last_index + 1) + (1 << storage::merkle_depth);
    int i = storage::merkle_depth;
    int last_node_hash = -1;
    cell verification_hashes = hashes;
    int zero_hash = 0;
    while (i > 0) {
        (slice v, int ok) = updates.udict_get?(node_dict_key_len, i);
        if (ok) {
            int node_index = v~load_uint(256);
            int leaf_node_index = node_index << (storage::merkle_depth - i);
            throw_unless(error::malformed_updates, leaf_node_index == cur_left); ;; does this verify that node_index belongs to depth
            cur_left = leaf_node_index + (1 << (storage::merkle_depth - i));

            int new_hash = v~load_uint(256);
            last_node_hash = node_index >> 1;
            hashes~set_node(last_node_hash, hash_nodes(hashes.get_node(node_index - 1), new_hash));
            verification_hashes~set_node(last_node_hash, hash_nodes(verification_hashes.get_node(node_index - 1), zero_hash));
        } elseif (last_node_hash != -1) {
            int new_last_node_hash = last_node_hash >> 1;
            hashes~set_node(new_last_node_hash, hash_nodes(hashes.get_node(last_node_hash - 1), hashes.get_node(last_node_hash)));
            verification_hashes~set_node(new_last_node_hash, hash_nodes(verification_hashes.get_node(last_node_hash - 1), verification_hashes.get_node(last_node_hash)));
            last_node_hash = new_last_node_hash;
        }
        zero_hash = hash_nodes(zero_hash, zero_hash);

        i -= 1;
    }

    throw_unless(error::malformed_updates, cur_left == (1 << (storage::merkle_depth + 1)));
    throw_unless(error::malformed_updates, verification_hashes.get_node(1) == storage::merkle_root);

    storage::merkle_root = hashes.get_node(1);
    storage::last_index = new_last_index;

    save_data();
}

() send_royalty_params(slice to_address, int query_id, slice data) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
        .store_slice(to_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::report_royalty_params(), 32)
        .store_uint(query_id, 64)
        .store_slice(data);
    send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        slice proof_data = in_msg_body~load_ref().begin_parse();
        claim(proof_data~load_uint(256), proof_data~load_ref(), proof_data~load_ref());
        return ();
    }

    if (op == op::update) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        slice update_data = in_msg_body~load_ref().begin_parse();
        update(update_data~load_ref(), update_data~load_uint(256), update_data~load_ref());

        var msg = begin_cell()
            .store_uint(0x18, 6) 
            .store_slice(sender_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 64);
        return ();
    }

    if (op == op::withdraw) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        
        raw_reserve(50000000, 0);

        var msg = begin_cell()
            .store_uint(0x18, 6) 
            .store_slice(sender_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 128);
        return ();
    }

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, storage::royalty.begin_parse());
        return ();
    }

    throw(0xffff);
}

(int, cell, slice) get_collection_data() method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    return (-1, cs~load_ref(), storage::owner);
}

slice get_nft_address_by_index(int index) method_id {
    load_data();
    cell state_init = calculate_nft_item_state_init(index, storage::nft_item_code);
    return calculate_nft_item_address(state_init);
}

(int, int, slice) royalty_params() method_id {
    load_data();
    slice rs = storage::royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain tag
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}

int get_merkle_root() method_id {
    load_data();
    return storage::merkle_root;
}

(int, cell) get_nft_api_info() method_id {
    load_data();
    slice cs = storage::api_data.begin_parse();
    int version = cs~load_uint(8);
    cell link = cs~load_ref();
    return (version, link);
}

```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/collection_exotic.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";


global int storage::merkle_root;
global int storage::merkle_depth;
global cell storage::nft_item_code;
global slice storage::owner;
global cell storage::content;
global cell storage::royalty;
global cell storage::api_data;

const int error::not_owner = 100;
const int error::bad_proof = 101;
const int error::value_too_low = 102;
const int error::not_exotic = 103;
const int error::not_merkle_proof = 104;
const int error::wrong_hash = 105;
const int error::bad_update = 106;
const int error::invalid_zero_hashes = 107;

const int op::claim = "op::claim"c;
const int op::update = "op::update"c;

const int item_init_value = 30000000;
const int minimum_claim_value = 85000000;

const int cell_type::merkle_proof = 3;

(slice, int) begin_parse_exotic(cell x) asm "XCTOS";

cell zero_hashes_dict() asm " B{b5ee9c7241023b010004ab000201c71c010201200d020201200603020148050400412924e95a1b53a326c469c2934ef9d6d61276d45b26d175be95e0954d4ab45f8ca00041372c457f2b3c9896bb269fbf1f42e0966fb062dc8d85968ee9bc1d90ddbf5e5f600201200a0702012009080041141ae9ccd6f0c29613d6fd6a779909e34d406b6fa0d422c2b1117f91f57165dee00041117958c6c8e399b60950abd4e8c0012da388b971a3d5de2b9f512d58718a98e4e00201200c0b0041067999a06a7a50296ddd3845a4bb26ccafcfd50def3d413751a63cb54e0670cd2000413319f3ec0c7df03ce75a18abec64f8c965250a7e8a193af9a051f4ebc2f64cad60020120150e020120120f02012011100041247cc2769bb44e9a2d04e2bc8166036cd9ae1875f3bea688c175fe950d232c6da00041132b8507aa832e81f3af722b0786cd94fb5c3db44e0247a859f665ab754969b5a00201201413004118f939b4855228f5a4b965fdd0c446e9204c533179d034d198eb60fd1ef77118e000412725bce396275113929e99995a04bfe8ed9f9910430632b636c98b6fbdae50b0e00201201916020120181700410f2003946b7df8b0272279a045e9e916ae8fb0ca48f406684a3ba5611585756f20004137036394a4ad9fabf4098f700c1a2b26a2c6a4122225fbbd419a2d3d3f45206a200201201b1a004107c5c013022e6c980851802f902c24e93a3e7e6b0f93e8c21cd14ef202e770efe000413ee8a745d3d291599269536c1630915e4daddb3d5acd3a97e400e3b7303569a7600201202c1d020120251e020120221f020120212000410c9c73124c98bdef3465ecc20fd915aec03169e9796144f012a825c61bf7dac560004136b354771fae9458b017731834835d5d2017763a07d8bb3d79851dd790725689a0020120242300412bc9e953d5087aa25544752426d41f39547aa22c6073abd51261f8bb8d09c0616000411a7026bef2a1f6578b692fa5e728a570e195a0b7f562e9ef54471f102ccf0c80200201202926020120282700412b466b46039f7156683b6652fdadab78382b0d79bc1deb6cad3eb5a5350e5bb1a000412a0b55af8a33479ec565a21ba52c9c9139b3f6079b73a0e8de242fde239b9fab200201202b2a0041033ed2411b5fc91088caf7eb13da9d48842f0809bf1c37b83a7eff511ff19b0f200041163a81eada1caddedfb9cdb455e771080bb9e288b3efe5e8082050af0463d915a0020120342d020120312e020120302f00412dfbdcbddd8301f96afb72bc36dd2a57e1eb141b22eaf15e45d4d6040547c38660004107cc387c90de5176110fcc8a63a99629b3d93f0b138795b2ec3f4df9bf756be7a002012033320041139f226107c6bea682dc41b23360b2e736ae1f2ac9d33186ee539ca6c9a8c451a000413e6f4348078f15e0fd3977e7c5f5d61d417a0b0007960c5682eea515f6eaf01fe00201203835020120373600410526d4e74a28305ad88dc6f5bafb655c54075306c564211dadb5654e7b9c92a86000412b04ac54adb5437b7db87fc2373d926ddb3455784e7d91f44d0c5983c1cc87b5a00201203a3900413c92216fe16fce3d2afca7c3aca45d10e5e1d1903fe79dfd549b18600323b7c2a000410e1254b628016fc636df30b61c6fe19c7f8e8d19631954f5d218ce28106be18a205639ff04} B>boc PUSHREF ";

int zero_hash(int depth) {
    (slice data, int found) = zero_hashes_dict().udict_get?(8, depth);
    throw_unless(error::invalid_zero_hashes, found);

    return data.preload_uint(256);
}

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::merkle_root = ds~load_uint(256);
    storage::merkle_depth = ds~load_uint(8);
    storage::nft_item_code = ds~load_ref();
    storage::owner = ds~load_msg_addr();
    storage::content = ds~load_ref();
    storage::royalty = ds~load_ref();
    storage::api_data = ds~load_ref();

    ds.end_parse();
}

() save_data() impure {
    set_data(begin_cell()
        .store_uint(storage::merkle_root, 256)
        .store_uint(storage::merkle_depth, 8)
        .store_ref(storage::nft_item_code)
        .store_slice(storage::owner)
        .store_ref(storage::content)
        .store_ref(storage::royalty)
        .store_ref(storage::api_data)
        .end_cell());
}

(slice, cell) parse_nft_data(cell nft_data) {
    slice ds = nft_data.begin_parse();
    return (ds~load_msg_addr(), ds~load_ref());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
    cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
    return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(cell state_init) {
    return begin_cell()
        .store_uint(4, 3)
        .store_int(workchain, 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

() deploy_nft_item(int item_index, int amount, cell nft_message) impure {
    cell state_init = calculate_nft_item_state_init(item_index, storage::nft_item_code);
    slice nft_address = calculate_nft_item_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(nft_message);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

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

cell retrieve_child(cell c, int index, int depth) {
    depth -= 1;
    while (depth >= 0) {
        slice s = c.begin_parse();
        if ((index >> depth) & 1) {
            s~load_ref();
            c = s~load_ref();
        } else {
            c = s~load_ref();
        }
        depth -= 1;
    }
    return c;
}

() claim(int nft_index, cell proof) impure {
    cell struct = proof.check_merkle_proof(storage::merkle_root);
    cell nft_data = struct.retrieve_child(nft_index, storage::merkle_depth);

    (slice owner, cell content) = nft_data.parse_nft_data();

    deploy_nft_item(nft_index, item_init_value, begin_cell().store_slice(owner).store_ref(content).end_cell());
}

() check_update(cell old, cell new, int depth) impure {
    if (old.cell_depth() == 0) {
        if (old.cell_hash() == new.cell_hash()) {
            return ();
        }

        (slice s, int is_exotic) = old.begin_parse_exotic();
        throw_unless(error::bad_update, is_exotic);

        int ty_lvl = s~load_uint(16);
        throw_unless(error::bad_update, ty_lvl == 0x0101);

        int old_hash = s~load_uint(256);
        throw_unless(error::bad_update, old_hash = zero_hash(depth));
    } else {
        slice s_old = old.begin_parse();
        slice s_new = new.begin_parse();
        check_update(s_old~load_ref(), s_new~load_ref(), depth - 1);
        check_update(s_old~load_ref(), s_new~load_ref(), depth - 1);
    }
}

() update(cell update) impure {
    slice s = update.begin_parse();
    cell old_merkle = s~load_ref();
    cell new_merkle = s~load_ref();

    cell old = old_merkle.check_merkle_proof(storage::merkle_root);
    (cell new, int new_hash) = new_merkle.extract_merkle_proof();

    check_update(old, new, storage::merkle_depth);

    storage::merkle_root = new_hash;

    save_data();
}

() send_royalty_params(slice to_address, int query_id, slice data) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
        .store_slice(to_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::report_royalty_params(), 32)
        .store_uint(query_id, 64)
        .store_slice(data);
    send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        throw_unless(error::value_too_low, msg_value >= minimum_claim_value);

        claim(in_msg_body~load_uint(256), in_msg_body~load_ref());
        return ();
    }

    if (op == op::update) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        update(in_msg_body~load_ref());

        var msg = begin_cell()
            .store_uint(0x18, 6) 
            .store_slice(sender_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 64);
        return ();
    }

    if (op == op::withdraw) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        
        raw_reserve(50000000, 0);

        var msg = begin_cell()
            .store_uint(0x18, 6) 
            .store_slice(sender_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 128);
        return ();
    }

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, storage::royalty.begin_parse());
        return ();
    }

    throw(0xffff);
}

(int, cell, slice) get_collection_data() method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    return (-1, cs~load_ref(), storage::owner);
}

slice get_nft_address_by_index(int index) method_id {
    load_data();
    cell state_init = calculate_nft_item_state_init(index, storage::nft_item_code);
    return calculate_nft_item_address(state_init);
}

(int, int, slice) royalty_params() method_id {
    load_data();
    slice rs = storage::royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain tag
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}

int get_merkle_root() method_id {
    load_data();
    return storage::merkle_root;
}

(int, cell) get_nft_api_info() method_id {
    load_data();
    slice cs = storage::api_data.begin_parse();
    int version = cs~load_uint(8);
    cell link = cs~load_ref();
    return (version, link);
}

```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/collection_exotic_sbt.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";


global int storage::merkle_root;
global int storage::merkle_depth;
global cell storage::nft_item_code;
global slice storage::owner;
global cell storage::content;
global cell storage::royalty;
global cell storage::api_data;

const int error::not_owner = 100;
const int error::bad_proof = 101;
const int error::value_too_low = 102;
const int error::not_exotic = 103;
const int error::not_merkle_proof = 104;
const int error::wrong_hash = 105;
const int error::bad_update = 106;
const int error::invalid_zero_hashes = 107;

const int op::claim = "op::claim"c;
const int op::update = "op::update"c;
const int op::withdraw = "op::withdraw"c;

const int item_init_value = 30000000;
const int minimum_claim_value = 85000000;

const int cell_type::merkle_proof = 3;

(slice, int) begin_parse_exotic(cell x) asm "XCTOS";

cell zero_hashes_dict() asm " B{b5ee9c7241023b010004ab000201c71c010201200d020201200603020148050400412924e95a1b53a326c469c2934ef9d6d61276d45b26d175be95e0954d4ab45f8ca00041372c457f2b3c9896bb269fbf1f42e0966fb062dc8d85968ee9bc1d90ddbf5e5f600201200a0702012009080041141ae9ccd6f0c29613d6fd6a779909e34d406b6fa0d422c2b1117f91f57165dee00041117958c6c8e399b60950abd4e8c0012da388b971a3d5de2b9f512d58718a98e4e00201200c0b0041067999a06a7a50296ddd3845a4bb26ccafcfd50def3d413751a63cb54e0670cd2000413319f3ec0c7df03ce75a18abec64f8c965250a7e8a193af9a051f4ebc2f64cad60020120150e020120120f02012011100041247cc2769bb44e9a2d04e2bc8166036cd9ae1875f3bea688c175fe950d232c6da00041132b8507aa832e81f3af722b0786cd94fb5c3db44e0247a859f665ab754969b5a00201201413004118f939b4855228f5a4b965fdd0c446e9204c533179d034d198eb60fd1ef77118e000412725bce396275113929e99995a04bfe8ed9f9910430632b636c98b6fbdae50b0e00201201916020120181700410f2003946b7df8b0272279a045e9e916ae8fb0ca48f406684a3ba5611585756f20004137036394a4ad9fabf4098f700c1a2b26a2c6a4122225fbbd419a2d3d3f45206a200201201b1a004107c5c013022e6c980851802f902c24e93a3e7e6b0f93e8c21cd14ef202e770efe000413ee8a745d3d291599269536c1630915e4daddb3d5acd3a97e400e3b7303569a7600201202c1d020120251e020120221f020120212000410c9c73124c98bdef3465ecc20fd915aec03169e9796144f012a825c61bf7dac560004136b354771fae9458b017731834835d5d2017763a07d8bb3d79851dd790725689a0020120242300412bc9e953d5087aa25544752426d41f39547aa22c6073abd51261f8bb8d09c0616000411a7026bef2a1f6578b692fa5e728a570e195a0b7f562e9ef54471f102ccf0c80200201202926020120282700412b466b46039f7156683b6652fdadab78382b0d79bc1deb6cad3eb5a5350e5bb1a000412a0b55af8a33479ec565a21ba52c9c9139b3f6079b73a0e8de242fde239b9fab200201202b2a0041033ed2411b5fc91088caf7eb13da9d48842f0809bf1c37b83a7eff511ff19b0f200041163a81eada1caddedfb9cdb455e771080bb9e288b3efe5e8082050af0463d915a0020120342d020120312e020120302f00412dfbdcbddd8301f96afb72bc36dd2a57e1eb141b22eaf15e45d4d6040547c38660004107cc387c90de5176110fcc8a63a99629b3d93f0b138795b2ec3f4df9bf756be7a002012033320041139f226107c6bea682dc41b23360b2e736ae1f2ac9d33186ee539ca6c9a8c451a000413e6f4348078f15e0fd3977e7c5f5d61d417a0b0007960c5682eea515f6eaf01fe00201203835020120373600410526d4e74a28305ad88dc6f5bafb655c54075306c564211dadb5654e7b9c92a86000412b04ac54adb5437b7db87fc2373d926ddb3455784e7d91f44d0c5983c1cc87b5a00201203a3900413c92216fe16fce3d2afca7c3aca45d10e5e1d1903fe79dfd549b18600323b7c2a000410e1254b628016fc636df30b61c6fe19c7f8e8d19631954f5d218ce28106be18a205639ff04} B>boc PUSHREF ";

int zero_hash(int depth) {
    (slice data, int found) = zero_hashes_dict().udict_get?(8, depth);
    throw_unless(error::invalid_zero_hashes, found);
    
    return data.preload_uint(256);
}

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::merkle_root = ds~load_uint(256);
    storage::merkle_depth = ds~load_uint(8);
    storage::nft_item_code = ds~load_ref();
    storage::owner = ds~load_msg_addr();
    storage::content = ds~load_ref();
    storage::royalty = ds~load_ref();
    storage::api_data = ds~load_ref();

    ds.end_parse();
}

() save_data() impure {
    set_data(begin_cell()
        .store_uint(storage::merkle_root, 256)
        .store_uint(storage::merkle_depth, 8)
        .store_ref(storage::nft_item_code)
        .store_slice(storage::owner)
        .store_ref(storage::content)
        .store_ref(storage::royalty)
        .store_ref(storage::api_data)
        .end_cell());
}

(slice, cell, slice) parse_nft_data(cell nft_data) {
    slice ds = nft_data.begin_parse();
    return (ds~load_msg_addr(), ds~load_ref(), ds~load_msg_addr());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
    cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
    return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(cell state_init) {
    return begin_cell()
        .store_uint(4, 3)
        .store_int(workchain, 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

() deploy_nft_item(int item_index, int amount, cell nft_message) impure {
    cell state_init = calculate_nft_item_state_init(item_index, storage::nft_item_code);
    slice nft_address = calculate_nft_item_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(nft_message);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

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

cell retrieve_child(cell c, int index, int depth) {
    depth -= 1;
    while (depth >= 0) {
        slice s = c.begin_parse();
        if ((index >> depth) & 1) {
            s~load_ref();
            c = s~load_ref();
        } else {
            c = s~load_ref();
        }
        depth -= 1;
    }
    return c;
}

() claim(int nft_index, cell proof) impure {
    cell struct = proof.check_merkle_proof(storage::merkle_root);
    cell nft_data = struct.retrieve_child(nft_index, storage::merkle_depth);

    (slice owner, cell content, slice authority) = nft_data.parse_nft_data();

    deploy_nft_item(nft_index, item_init_value, begin_cell().store_slice(owner).store_ref(content).store_slice(authority).end_cell());
}

() check_update(cell old, cell new, int depth) impure {
    if (old.cell_depth() == 0) {
        if (old.cell_hash() == new.cell_hash()) {
            return ();
        }

        (slice s, int is_exotic) = old.begin_parse_exotic();
        throw_unless(error::bad_update, is_exotic);

        int ty_lvl = s~load_uint(16);
        throw_unless(error::bad_update, ty_lvl == 0x0101);

        int old_hash = s~load_uint(256);
        throw_unless(error::bad_update, old_hash = zero_hash(depth));
    } else {
        slice s_old = old.begin_parse();
        slice s_new = new.begin_parse();
        check_update(s_old~load_ref(), s_new~load_ref(), depth - 1);
        check_update(s_old~load_ref(), s_new~load_ref(), depth - 1);
    }
}

() update(cell update) impure {
    slice s = update.begin_parse();
    cell old_merkle = s~load_ref();
    cell new_merkle = s~load_ref();

    cell old = old_merkle.check_merkle_proof(storage::merkle_root);
    (cell new, int new_hash) = new_merkle.extract_merkle_proof();

    check_update(old, new, storage::merkle_depth);

    storage::merkle_root = new_hash;


    save_data();
}

() send_royalty_params(slice to_address, int query_id, slice data) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
        .store_slice(to_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::report_royalty_params(), 32)
        .store_uint(query_id, 64)
        .store_slice(data);
    send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        throw_unless(error::value_too_low, msg_value >= minimum_claim_value);

        claim(in_msg_body~load_uint(256), in_msg_body~load_ref());
        return ();
    }

    if (op == op::update) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        update(in_msg_body~load_ref());
        
        var msg = begin_cell()
            .store_uint(0x18, 6) 
            .store_slice(sender_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 64);
        return ();
    }

    if (op == op::withdraw) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        
        raw_reserve(50000000, 0);

        var msg = begin_cell()
            .store_uint(0x18, 6) 
            .store_slice(sender_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 128);
        return ();
    }

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, storage::royalty.begin_parse());
        return ();
    }

    throw(0xffff);
}

(int, cell, slice) get_collection_data() method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    return (-1, cs~load_ref(), storage::owner);
}

slice get_nft_address_by_index(int index) method_id {
    load_data();
    cell state_init = calculate_nft_item_state_init(index, storage::nft_item_code);
    return calculate_nft_item_address(state_init);
}

(int, int, slice) royalty_params() method_id {
    load_data();
    slice rs = storage::royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain tag
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}

int get_merkle_root() method_id {
    load_data();
    return storage::merkle_root;
}

(int, cell) get_nft_api_info() method_id {
    load_data();
    slice cs = storage::api_data.begin_parse();
    int version = cs~load_uint(8);
    cell link = cs~load_ref();
    return (version, link);
}

```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/collection_new.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";


global int storage::merkle_root;
global int storage::merkle_depth;
global cell storage::nft_item_code;
global slice storage::owner;
global cell storage::content;
global cell storage::royalty;
global cell storage::api_data;

const int error::not_owner = 100;
const int error::bad_proof = 101;
const int error::value_too_low = 102;

const int op::claim = "op::claim"c;
const int op::update = "op::update"c;

const int item_init_value = 30000000;
const int minimum_claim_value = 85000000;

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::merkle_root = ds~load_uint(256);
    storage::merkle_depth = ds~load_uint(8);
    storage::nft_item_code = ds~load_ref();
    storage::owner = ds~load_msg_addr();
    storage::content = ds~load_ref();
    storage::royalty = ds~load_ref();
    storage::api_data = ds~load_ref();

    ds.end_parse();
}

() save_data() impure {
    set_data(begin_cell()
        .store_uint(storage::merkle_root, 256)
        .store_uint(storage::merkle_depth, 8)
        .store_ref(storage::nft_item_code)
        .store_slice(storage::owner)
        .store_ref(storage::content)
        .store_ref(storage::royalty)
        .store_ref(storage::api_data)
        .end_cell());
}

int hash_nodes(int a, int b) {
    return begin_cell().store_uint(a, 256).store_uint(b, 256).end_cell().cell_hash();
}

int check_proof(int root, cell proof, int leaf, int leaf_index, int depth) {
    int i = 0;
    int cur = leaf;
    slice ps = proof.begin_parse();
    while (i < depth) {
        int is_right = (leaf_index >> i) & 1;
        if (is_right) {
            cur = hash_nodes(ps.preload_uint(256), cur);
        } else {
            cur = hash_nodes(cur, ps.preload_uint(256));
        }
        ps = ps.preload_ref().begin_parse();
        i += 1;
    }
    return cur == root;
}

(slice, cell) parse_nft_data(cell nft_data) {
    slice ds = nft_data.begin_parse();
    return (ds~load_msg_addr(), ds~load_ref());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
    cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
    return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(cell state_init) {
    return begin_cell()
        .store_uint(4, 3)
        .store_int(workchain, 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

() deploy_nft_item(int item_index, int amount, cell nft_message) impure {
    cell state_init = calculate_nft_item_state_init(item_index, storage::nft_item_code);
    slice nft_address = calculate_nft_item_address(state_init);
    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_address)
        .store_coins(amount)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init)
        .store_ref(nft_message);
    send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

() claim(int nft_index, cell nft_data, cell proof) impure {
    throw_unless(error::bad_proof, check_proof(storage::merkle_root, proof, nft_data.cell_hash(), nft_index, storage::merkle_depth));

    (slice owner, cell content) = nft_data.parse_nft_data();

    deploy_nft_item(nft_index, item_init_value, begin_cell().store_slice(owner).store_ref(content).end_cell());
}

(int, int) process_update(cell update, tuple zh, int depth) {
    slice cs = update.begin_parse();
    int leaf = cs~load_int(1);
    if (leaf) {
        int proof = cs~load_int(1);
        int hash = cs~load_uint(256);
        if (proof) {
            return (hash, hash);
        } else { ;; update
            return (zh.at(depth), hash);
        }
    } else {
        (int old_left, int new_left) = process_update(cs~load_ref(), zh, depth - 1);
        (int old_right, int new_right) = process_update(cs~load_ref(), zh, depth - 1);
        return (hash_nodes(old_left, old_right), hash_nodes(new_left, new_right));
    }
}

() update(cell update) impure {
    tuple zh = empty_tuple();
    zh~tpush(0);
    int i = 0;
    while (i < storage::merkle_depth - 1) {
        int prev = zh.at(i);
        zh~tpush(hash_nodes(prev, prev));
        i += 1;
    }

    (int old_hash, int new_hash) = process_update(update, zh, storage::merkle_depth);

    throw_unless(error::bad_proof, old_hash == storage::merkle_root);

    storage::merkle_root = new_hash;

    save_data();
}

() send_royalty_params(slice to_address, int query_id, slice data) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
        .store_slice(to_address)
        .store_coins(0)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::report_royalty_params(), 32)
        .store_uint(query_id, 64)
        .store_slice(data);
    send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        throw_unless(error::value_too_low, msg_value >= minimum_claim_value);

        slice proof_data = in_msg_body~load_ref().begin_parse();
        claim(in_msg_body~load_uint(256), proof_data~load_ref(), proof_data~load_ref());
        return ();
    }

    if (op == op::update) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        update(in_msg_body~load_ref());

        var msg = begin_cell()
            .store_uint(0x18, 6) 
            .store_slice(sender_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 64);
        return ();
    }

    if (op == op::withdraw) {
        throw_unless(error::not_owner, equal_slices(sender_address, storage::owner));
        
        raw_reserve(50000000, 0);

        var msg = begin_cell()
            .store_uint(0x18, 6) 
            .store_slice(sender_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 128);
        return ();
    }

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, storage::royalty.begin_parse());
        return ();
    }

    throw(0xffff);
}

(int, cell, slice) get_collection_data() method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    return (-1, cs~load_ref(), storage::owner);
}

slice get_nft_address_by_index(int index) method_id {
    load_data();
    cell state_init = calculate_nft_item_state_init(index, storage::nft_item_code);
    return calculate_nft_item_address(state_init);
}

(int, int, slice) royalty_params() method_id {
    load_data();
    slice rs = storage::royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
    load_data();
    slice cs = storage::content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain tag
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}

int get_merkle_root() method_id {
    load_data();
    return storage::merkle_root;
}

(int, cell) get_nft_api_info() method_id {
    load_data();
    slice cs = storage::api_data.begin_parse();
    int version = cs~load_uint(8);
    cell link = cs~load_ref();
    return (version, link);
}

```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/imports/params.fc

```fc
#include "stdlib.fc";

const int workchain = 0;

() force_chain(slice addr) impure {
    (int wc, _) = parse_std_addr(addr);
    throw_unless(333, wc == workchain);
}

slice null_addr() asm "b{00} PUSHSLICE";
int flag::regular() asm "0x10 PUSHINT";
int flag::bounce() asm "0x8 PUSHINT";

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
int builder_null?(builder b) asm "ISNULL";

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

    if (~ null?(payload)) {
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
    throw_unless(708, slice_bits(in_msg_body) >= 1);

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
    int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs


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

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/op-codes.fc

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

;; SBT
int op::request_owner() asm "0xd0c3bfea PUSHINT";
int op::owner_info() asm "0x0dd607e3 PUSHINT";

int op::prove_ownership() asm "0x04ded148 PUSHINT";
int op::ownership_proof() asm "0x0524c7ae PUSHINT";
int op::ownership_proof_bounced() asm "0xc18e86d2 PUSHINT";

int op::destroy() asm "0x1f04537a PUSHINT";
int op::revoke() asm "0x6f89f5e3 PUSHINT";
int op::take_excess() asm "0xd136d3b3 PUSHINT";

```

## bbac2f6d5904eb04d3d78f17de7a5e26a19dd8eef5fda44103c964e9e190f9f4/sbt_item.fc

```fc
#include "imports/stdlib.fc";
#include "imports/params.fc";
#include "imports/op-codes.fc";

;;
;;  TON SBT Item Smart Contract
;;

int min_tons_for_storage() asm "50000000 PUSHINT"; ;; 0.05 TON

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

global int storage::index;
global int init?;
global slice storage::collection_address;
global slice storage::owner_address;
global slice storage::authority_address;
global cell storage::content;
global int storage::revoked_at;

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::index              = ds~load_uint(64);
    storage::collection_address = ds~load_msg_addr();
    init?                       = false;

    if (ds.slice_bits() > 0) {
        init?                      = true;
        storage::owner_address     = ds~load_msg_addr();
        storage::content           = ds~load_ref();
        storage::authority_address = ds~load_msg_addr();
        storage::revoked_at        = ds~load_uint(64);
    }
}

() store_data() impure {
    set_data(
            begin_cell()
                    .store_uint(storage::index, 64)
                    .store_slice(storage::collection_address)
                    .store_slice(storage::owner_address)
                    .store_ref(storage::content)
                    .store_slice(storage::authority_address)
                    .store_uint(storage::revoked_at, 64)
                    .end_cell()
    );
}

() send_msg(int flag, slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {
    var body = begin_cell().store_uint(op, 32).store_uint(query_id, 64);
    if (~ builder_null?(payload)) {
        body = body.store_builder(payload);
    }

    var msg = begin_cell()
            .store_uint(flag, 6)
            .store_slice(to_address)
            .store_coins(amount)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(body.end_cell());

    send_raw_message(msg.end_cell(), send_mode);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    slice sender_address = cs~load_msg_addr();

    load_data();

    if (~ init?) {
        throw_unless(405, equal_slices(storage::collection_address, sender_address));

        storage::owner_address     = in_msg_body~load_msg_addr();
        storage::content           = in_msg_body~load_ref();
        storage::authority_address = in_msg_body~load_msg_addr();
        storage::revoked_at        = 0;

        store_data();
        return ();
    }

    int op = in_msg_body~load_uint(32);

    if (flags & 1) { ;; route all prove_ownership bounced messages to owner
        ;; first op was 0xffffffff, because of bounced, now we need to read real one
        op = in_msg_body~load_uint(32);

        if (op == op::ownership_proof()) {
            int query_id = in_msg_body~load_uint(64);
            ;; mode 64 = carry all the remaining value of the inbound message
            send_msg(flag::regular(), storage::owner_address, 0, op::ownership_proof_bounced(), query_id, null(), 64);
        }
        return ();
    }

    int query_id = in_msg_body~load_uint(64);

    if (op == op::request_owner()) {
        slice dest = in_msg_body~load_msg_addr();
        cell body = in_msg_body~load_ref();
        int with_content = in_msg_body~load_uint(1);

        var msg = begin_cell()
                .store_uint(storage::index, 256)
                .store_slice(sender_address)
                .store_slice(storage::owner_address)
                .store_ref(body)
                .store_uint(storage::revoked_at, 64)
                .store_uint(with_content, 1);

        if (with_content != 0) {
            msg = msg.store_ref(storage::content);
        }

        ;; mode 64 = carry all the remaining value of the inbound message
        send_msg(flag::regular() | flag::bounce(), dest, 0, op::owner_info(), query_id, msg, 64);
        return ();
    }
    if (op == op::prove_ownership()) {
        throw_unless(401, equal_slices(storage::owner_address, sender_address));

        slice dest = in_msg_body~load_msg_addr();
        cell body = in_msg_body~load_ref();
        int with_content = in_msg_body~load_uint(1);

        var msg = begin_cell()
                .store_uint(storage::index, 256)
                .store_slice(storage::owner_address)
                .store_ref(body)
                .store_uint(storage::revoked_at, 64)
                .store_uint(with_content, 1);

        if (with_content != 0) {
            msg = msg.store_ref(storage::content);
        }

        ;; mode 64 = carry all the remaining value of the inbound message
        send_msg(flag::regular() | flag::bounce(), dest, 0, op::ownership_proof(), query_id, msg, 64);
        return ();
    }
    if (op == op::get_static_data()) {
        var msg = begin_cell().store_uint(storage::index, 256).store_slice(storage::collection_address);

        ;; mode 64 = carry all the remaining value of the inbound message
        send_msg(flag::regular(), sender_address, 0, op::report_static_data(), query_id, msg, 64);
        return ();
    }
    if (op == op::destroy()) {
        throw_unless(401, equal_slices(storage::owner_address, sender_address));

        send_msg(flag::regular(), sender_address, 0, op::excesses(), query_id, null(), 128);

        storage::owner_address = null_addr();
        storage::authority_address = null_addr();
        store_data();
        return ();
    }
    if (op == op::revoke()) {
        throw_unless(401, equal_slices(storage::authority_address, sender_address));
        throw_unless(403, storage::revoked_at == 0);

        storage::revoked_at = now();
        store_data();
        return ();
    }
    if (op == op::take_excess()) {
        throw_unless(401, equal_slices(storage::owner_address, sender_address));

        ;; reserve amount for storage
        raw_reserve(min_tons_for_storage(), 0);

        send_msg(flag::regular(), sender_address, 0, op::excesses(), query_id, null(), 128);
        return ();
    }
    if (op == op::transfer()) {
        throw(413);
    }
    throw(0xffff);
}

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
    load_data();
    return (init?, storage::index, storage::collection_address, storage::owner_address, storage::content);
}

slice get_authority_address() method_id {
    load_data();
    return storage::authority_address;
}

int get_revoked_time() method_id {
    load_data();
    return storage::revoked_at;
}

```

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)
int op::increment() asm "0x37491f2f PUSHINT";
int op::deposit() asm "0x47d54391 PUSHINT";
int op::withdraw() asm "0x41836980 PUSHINT";
int op::transfer_ownership() asm "0x2da38aaf PUSHINT";

;; errors
int error::unknown_op() asm "101 PUSHINT";
int error::access_denied() asm "102 PUSHINT";
int error::insufficient_balance() asm "103 PUSHINT";

;; other
int const::min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
int const::provide_address_gas_consumption() asm "10000000 PUSHINT";
```

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/jetton-utils.fc

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

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/op-codes.fc

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

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure {
  cell msg = begin_cell()
    .store_uint (0x18, 6) ;; bounce
    .store_slice(address) ;; 267 bit address
    .store_grams(amount)
    .store_uint(0, 107) ;; 106 zeroes +  0 as an indicator that there is no cell with the data
    .end_cell(); 
  send_raw_message(msg, 3); ;; mode, 2 for ignoring errors, 1 for sender pays fees, 64 for returning inbound message value
}

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

const min_tons_for_storage = 10000000; ;; 0.01 TON
const gas_consumption = 10000000; ;; 0.01 TON

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
  throw_unless(708, slice_bits(in_msg_body) >= 1);
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
                     (2 * gas_consumption + min_tons_for_storage)); ;; TODO(shahar) ?
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
  int storage_fee = min_tons_for_storage - min(ton_balance_before_msg, min_tons_for_storage);
  msg_value -= (storage_fee + gas_consumption);
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
      .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
      .store_slice(owner_address)
      .store_coins(forward_ton_amount)
      .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_ref(msg_body);

    send_raw_message(msg.end_cell(), 1);
  }

  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
    var msg = begin_cell()
      .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
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
  throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption);

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
  int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs 

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

## beb0683ebeb8927fe9fc8ec0a18bc7dd17899689825a121eab46c5a3a860d0ce/stdlib.fc

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
    matches: map<Int, MatchInfo>; // all matches 
    matchCount: Int;
    minBalance: Int as coins;

    init(owner: Address, weightRequired: Int, voters: map<Address, Bool>) {
        self.owner = owner;
        self.minBalance = ton("0.05"); // default mininum = 0.05
        self.currentSeqno = 0;

        self.voters = emptyMap();
        self.voterCount = 0;
        foreach(key, value in voters) {
            self.voters.set(key, value);
            self.voterCount += 1;
        }
        if (weightRequired > self.voterCount) {
            weightRequired = self.voterCount;
        }
        self.weightRequired = weightRequired;

        self.masterActionRequests = emptyMap();
        self.masterActionRequestCounts = 0;

        self.matches = emptyMap();
        self.matchCount = 0;
    }

    receive() {
    }

    receive(comment: String) {

    }
    
    // Record match info
    receive(msg: MatchInfoMsg) {
        require(sender() == self.owner, "Only owner can call this function");
        require(msg.seqno == self.currentSeqno, "Invalid sequence number");

        let exist: Bool = self.matches.get(msg.matchInfo.matchId) != null;
        self.matches.set(msg.matchInfo.matchId, msg.matchInfo);
        if (!exist) {
            self.matchCount += 1;
        }

        self.incSeqno();
        self.reply("".asComment());
    }

    fun incSeqno() {
        if (self.currentSeqno >= 1000000000) {
            self.currentSeqno = 0;
        }
        self.currentSeqno += 1;
    }

    get fun seqno(): Int {
        return self.currentSeqno;
    }
    
    receive(msg: MasterActionRequestMsg) {
        require(sender() == self.owner, "Only owner can call this function");
        require(msg.seqno == self.currentSeqno, "Invalid sequence number");
        require(self.masterActionRequests.get(msg.request.id) == null, "This id is already exists");

        msg.request.status = 0;
        msg.request.weight = 0;
        msg.request.voters = emptyMap();
        self.masterActionRequests.set(msg.request.id, msg.request);
        self.masterActionRequestCounts += 1;

        let sbuilder = beginString();
        sbuilder.append("Withdraw Request(");
        sbuilder.append(msg.request.id.toString());
        sbuilder.append("): ");
        sbuilder.append(msg.request.amount.toCoinsString());
        sbuilder.append(" -> ");
        sbuilder.append(msg.request.address.toString());
        emit(sbuilder.toString().asComment());

        self.incSeqno();
        self.reply("".asComment());
    }

    receive(msg: VoteMsg) {
        require(self.voters.get(sender()) == true, "Only voter can call this function");
        require(msg.seqno == self.currentSeqno, "Invalid sequence number");
        require(self.masterActionRequests.get(msg.requestId) != null, "Can not found this request");

        let request = self.masterActionRequests.get(msg.requestId)!!;
        if (request.status == 0 && request.amount > 0) {
            if (request.timeout > now()) {
                let sender = sender();
                if (request.voters.get(sender) != true) {
                    request.voters.set(sender, true);
                    request.weight += 1;
                }

                if (request.weight >= self.weightRequired) {
                    require(myBalance() - self.minBalance > request.amount, "Balance is not enough");

                    let bodyMsg = beginString();
                    bodyMsg.append("Withdaw Quest Id: ");
                    bodyMsg.append(request.id.toString());
                    send(SendParameters{
                        to: request.address,
                        bounce: true,
                        value: request.amount,
                        mode: SendPayGasSeparately | SendIgnoreErrors,
                        body: bodyMsg.toCell()
                    });

                    let sbuilder = beginString();
                    sbuilder.append("Execute Withdraw (");
                    sbuilder.append(request.id.toString());
                    sbuilder.append("): ");
                    sbuilder.append(request.amount.toCoinsString());
                    sbuilder.append(" -> ");
                    sbuilder.append(request.address.toString());
                    emit(sbuilder.toString().asComment());

                    request.status = 1;
                }
            }
            else { // timeout
                request.status = 2;
            }

            self.masterActionRequests.set(request.id, request);
        }

        self.incSeqno();
        self.reply("".asComment());
    }

    get fun masterRequest(id: Int): MasterActionRequest? {
        return self.masterActionRequests.get(id);
    }
    
    fun sendToncoin(target: Address, value: Int, comment: String) {
        let commentCell = comment.asComment();
        send(SendParameters{to: target, bounce: false, value: value, mode: SendPayGasSeparately | SendIgnoreErrors, body: commentCell});
    }

   /* Match status 
   * 0 --> created: match info on chain 
   * 1 --> compeleted: match result on chain
   * 2 --> compeleted and commission has been paid: commission on chain
   */
   // Record Match Result: 0 -> 1
    fun recordMatchResults(match: MatchInfo, msg: SendPrizeMsg): MatchInfo {
        require(msg.matchResults != null, "matchResults is invalid");
        let matchResult = msg.matchResults!!;

        // check if prize > entryfee
        let totalPrize: Int = 0;
        foreach(key, value in matchResult.winners) {
            totalPrize += value.prizeWon;
        }
        let commissionFee = match.prizePool - totalPrize;
        require(commissionFee >= 0, "totalPrize cannot be greater than prizePool");

        match.winners = matchResult.winners;
        match.winnerCount = matchResult.winnerCount;
        match.commissionFee = commissionFee;
        match.status = 1; // match compeleted

        self.matches.set(match.matchId, match);
        return match
    }

    // Send Match Commission: 1 -> 2
    fun sendMatchCommission(match: MatchInfo, msg: SendPrizeMsg): MatchInfo {
        if (msg.commissionWalletAddress != null) {
            if (match.commissionFee == 0) {
                match.status = 2;
                self.matches.set(match.matchId, match);
            } else if (match.commissionFee > 0 && 
                myBalance() - match.commissionFee > self.minBalance)
            {
                let bodyMsg: StringBuilder = beginString();
                bodyMsg.append("Match CommissionFee (");
                bodyMsg.append(match.matchId.toString());
                bodyMsg.append(")");
                self.sendToncoin(msg.commissionWalletAddress!!, match.commissionFee, bodyMsg.toString());
                match.status = 2;
                self.matches.set(match.matchId, match);
            }
        }
        return match
    }

    // Send prize to winner
    fun sendMatchPrize(match: MatchInfo, msg: SendPrizeMsg) {
        require(msg.telegramId != "" && msg.walletAddress != null, "Invalid playerInfo");
        let modified: Bool = false;
        foreach(key, value in match.winners) {
            if (value.telegramId == msg.telegramId) {
                /* winner prize sent status 
                * 0 --> Not send prize yet
                * 1 --> Prize sent
                * 2 --> Fraud player(No need to send) 
                * 3 --> Other reason not send prize yet
                */
                let winner = value;
                if (winner.prizeSentStatus == 0 || winner.prizeSentStatus == 3) { 
                    if (myBalance() - winner.prizeWon > self.minBalance) {
                        if (winner.prizeWon > 0) {
                            let bodyMsg = beginString();
                            bodyMsg.append("Match Prize (");
                            bodyMsg.append(match.matchId.toString());
                            bodyMsg.append(",");
                            bodyMsg.append(key.toString());
                            bodyMsg.append(")");
                            self.sendToncoin(msg.walletAddress!!, winner.prizeWon, bodyMsg.toString());
                        }
                        winner.walletAddress = msg.walletAddress!!;
                        winner.prizeSentStatus = 1; // Prize sent
                        match.winners.set(key, winner);
                        modified = true;
                    } else if (winner.prizeSentStatus == 0) { // Other reason not send prize yet
                        winner.prizeSentStatus = 3; 
                        match.winners.set(key, winner);
                        modified = true;
                    }
                }
            }
        }

        if (modified) {
            self.matches.set(match.matchId, match);
        }
    }

    receive(msg: SendPrizeMsg) {
        require(sender() == self.owner, "Only owner can call this function");
        require(msg.seqno == self.currentSeqno, "Invalid sequence number");
        require(self.matches.get(msg.matchId) != null, "This match was not found");
        let match = self.matches.get(msg.matchId)!!;
        
        if (match.status == 0) {   
            match = self.recordMatchResults(match, msg);
        }

        if (match.status == 1) {
            match = self.sendMatchCommission(match, msg);
        }
        
        // send prize to winner only after commissions are paid
        if (match.status > 1) {
            self.sendMatchPrize(match, msg);
        }

        self.incSeqno();
        self.reply("".asComment());
    }

    receive(msg: RemoveMatchDumpMsg) {
        require(sender() == self.owner, "Only owner can call this function");
        require(msg.seqno == self.currentSeqno, "Invalid sequence number");

        let ori = self.matchCount;
        foreach(key, value in msg.matchIds) {
            if (self.matches.del(value)) {
                self.matchCount -= 1;
            }
        }

        let removedCount = ori - self.matchCount;
        let comment = beginString();
        comment.append("Removed ");
        comment.append(removedCount.toString());
        comment.append(" MatchDumps");
        emit(comment.toString().asComment());
        self.incSeqno();
        self.reply("".asComment());
    }

    // set mininum balance
    receive(msg: MinBalanceMsg) {
        require(sender() == self.owner, "Only owner can call this function");
        require(msg.seqno == self.currentSeqno, "Invalid sequence number");

        self.minBalance = msg.value;

        let comment = beginString();
        comment.append("Set MinBalance to ");
        comment.append(self.minBalance.toCoinsString());
        emit(comment.toString().asComment());
        self.incSeqno();
        self.reply("".asComment());
    }

    get fun minBalance(): Int {
        return self.minBalance;
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun matchInfo(matchId: Int): MatchInfo? {
        return self.matches.get(matchId);
    }

    get fun matchCount(): Int {
        return self.matchCount;
    }
}

```

## c12275085ec7dd21925c33a919680186022c6f2a4ced45dbce3d3e14d438dc0f/imports/message_utils.fc

```fc
#pragma version >=0.2.0;

#include "stdlib.fc";

() emit_log_cell_ref(int event_id, cell data) impure inline {
  var msg = begin_cell()
    ;; 1100
    .store_uint(12, 4) ;; ext_out_msg_info$11 src:MsgAddressInt ()
    ;; 01
    .store_uint(1, 2)
    ;; 100000000
    .store_uint(256, 9)
    .store_uint(event_id, 256)
    .store_uint(1, 64 + 32 + 1 + 1) ;; created_lt, created_at, init:Maybe, body:Either
    .store_ref(data)
    .end_cell();
  send_raw_message(msg, 0);
}

```

## c12275085ec7dd21925c33a919680186022c6f2a4ced45dbce3d3e14d438dc0f/imports/op-codes.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)

;; Wton
const op::deposit = 0x77a33521;
const op::withdraw = 0x47d1895f;
const op::change_next_admin = 0x62dd86f1;
const op::change_admin = 0x66447dad;
const op::change_content = 0x743f8e58;

;; Wallet
const op::transfer = 0xf8a7ea5;
const op::transfer_notification = 0x7362d09c;
const op::excesses = 0xd53276db;
const op::burn = 0x595f07bc;
const op::internal_transfer = 0x178d4519;
const op::burn_notification = 0x7bdd97de;

```

## c12275085ec7dd21925c33a919680186022c6f2a4ced45dbce3d3e14d438dc0f/imports/utils.fc

```fc
#pragma version >=0.2.0;

#include "stdlib.fc";
#include "message_utils.fc";

() send_grams(slice address, int amount) impure {
  cell msg = begin_cell()
    .store_uint (0x18, 6) ;; bounce
    .store_slice(address) ;; 267 bit address
    .store_grams(amount)
    .store_uint(0, 107) ;; 106 zeroes +  0 as an indicator that there is no cell with the data
    .end_cell(); 
  send_raw_message(msg, 3); ;; mode, 2 for ignoring errors, 1 for sender pays fees, 64 for returning inbound message value
}

int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}

cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return begin_cell()
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
  return begin_cell()
    .store_uint(4, 3)
    .store_int(workchain(), 8)
    .store_uint(cell_hash(state_init), 256)
    .end_cell()
    .begin_parse();
}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}

cell pack_jetton_minter_data(int total_supply, slice admin_address, slice next_admin_address, slice minter_address, int is_initialized, int token_address, cell content, cell jetton_wallet_code) inline {
  return begin_cell()
    .store_coins(total_supply)
    .store_uint(is_initialized, 1)
    .store_uint(token_address, 160)
    .store_ref(begin_cell()
      .store_slice(admin_address)
      .store_slice(next_admin_address)
      .store_slice(minter_address)
    .end_cell())
    .store_ref(content)
    .store_ref(jetton_wallet_code)
    .end_cell();
}

cell calculate_jetton_minter_state_init(slice admin_address, slice minter_address, int token_address, cell content, cell jetton_minter_code, cell jetton_wallet_code) inline {
  slice addr_none = begin_cell().store_uint(0, 2).end_cell().begin_parse();
  return begin_cell()
    .store_uint(0, 2)
    .store_dict(jetton_minter_code)
    .store_dict(pack_jetton_minter_data(0, admin_address, addr_none, minter_address, 0, token_address, content, jetton_wallet_code))
    .store_uint(0, 1)
    .end_cell();
}

slice calculate_contract_address(cell state_init) inline {
  return begin_cell()
    .store_uint(4, 3)
    .store_int(workchain(), 8)
    .store_uint(cell_hash(state_init), 256)
    .end_cell()
    .begin_parse();
}

slice calculate_jetton_minter_address(slice admin_address, slice minter_address, int token_address, cell content, cell jetton_minter_code, cell jetton_wallet_code) inline {
  return calculate_contract_address(calculate_jetton_minter_state_init(admin_address, minter_address, token_address, content, jetton_minter_code, jetton_wallet_code));
}

(int) check_multi_signatures(int hash, cell signatures, cell pubkeys, int req_count) impure {
  int cnt = 0;
  cell dup_pubkey_check = new_dict();

  do {
    slice cs = signatures.begin_parse();
    int pubkey = cs~load_uint(256);

    (_, var found) = pubkeys.udict_get?(256, pubkey);
    throw_if(40, found == 0);
    (_, var found2) = dup_pubkey_check.udict_get?(256, pubkey);
    throw_unless(39, found2 == 0);
    dup_pubkey_check~udict_set(256, pubkey, begin_cell().store_uint(1, 1).end_cell().begin_parse());
    throw_unless(41, check_signature(hash, cs~load_bits(512), pubkey));
    cnt += 1;

    signatures = cs~load_dict();
  } until (cell_null?(signatures));

  return cnt >= req_count;
}

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

int min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
int gas_consumption() asm "10000000 PUSHINT"; ;; 0.01 TON

{-
  Storage
  storage#_ balance:(VarUInteger 16) owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
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
  throw_unless(708, slice_bits(in_msg_body) >= 1);
  slice either_forward_payload = in_msg_body;
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(to_wallet_address)
    .store_coins(0)
    .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
    .store_ref(state_init);
  var msg_body = begin_cell()
    .store_uint(op::internal_transfer, 32)
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
        .store_uint(op::transfer_notification, 32)
        .store_uint(query_id, 64)
        .store_coins(jetton_amount)
        .store_slice(from_address)
        .store_slice(either_forward_payload)
        .end_cell();

    var msg = begin_cell()
      .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
      .store_slice(owner_address)
      .store_coins(forward_ton_amount)
      .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_ref(msg_body);

    send_raw_message(msg.end_cell(), 1);
  }

  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
    var msg = begin_cell()
      .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
      .store_slice(response_address)
      .store_coins(msg_value)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(op::excesses, 32)
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
  cell custom_payload = in_msg_body~load_dict();
  balance -= jetton_amount;
  throw_unless(705, equal_slices(jetton_master_address, sender_address));
  throw_unless(706, balance >= 0);
  throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption());

  var msg_body = begin_cell()
    .store_uint(op::burn_notification, 32)
    .store_uint(query_id, 64)
    .store_coins(jetton_amount)
    .store_slice(owner_address)
    .store_slice(response_address)
    .store_dict(custom_payload)
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
  throw_unless(709, (op == op::internal_transfer) | (op == op::burn_notification));
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

  if (op == op::transfer) { ;; outgoing transfer
    send_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
    return ();
  }

  if (op == op::internal_transfer) { ;; incoming transfer
    receive_tokens(in_msg_body, sender_address, my_balance, fwd_fee, msg_value);
    return ();
  }

  if (op == op::burn) { ;; burn
    burn_tokens(in_msg_body, sender_address, msg_value, fwd_fee);
    return ();
  }

  throw(0xffff);
}

(int, slice, slice, cell) get_wallet_data() method_id {
  return load_data();
}
```

## c12275085ec7dd21925c33a919680186022c6f2a4ced45dbce3d3e14d438dc0f/stdlib.fc

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

## c63a2766b55a96d54fd88c2727cee63feddfd3c42f5fe56983e3e436607eb2e5/single-nominator.fc

```fc
;; this contract is very similar to https://github.com/ton-blockchain/nominator-pool but much simpler since it only supports a single nominator
;; frankly speaking, we tried using nominator-pool but it's so complicated that we couldn't be sure there were no bugs hiding around
;; this contract is very simple and easy to review, it is laser focused on protecting your stake and nothing else!

;; =============== consts =============================

const BOUNCEABLE = 0x18;
const ADDRESS_SIZE = 256;
const MIN_TON_FOR_STORAGE = 1000000000; ;; 10% from nominator-pool since we have a single cell
const MIN_TON_FOR_SEND_MSG = 1200000000;

;; owner ops
const OP::WITHDRAW = 0x1000;
const OP::CHANGE_VALIDATOR_ADDRESS = 0x1001;
const OP::SEND_RAW_MSG = 0x7702;
const OP::UPGRADE = 0x9903;

;; elector ops
const OP::NEW_STAKE = 0x4e73744b;
const OP::RECOVER_STAKE = 0x47657424;

;; modes
const MODE::SEND_MODE_REMAINING_AMOUNT = 64;

;; errors
const ERROR::WRONG_NOMINATOR_WC = 0x2000;
const ERROR::WRONG_QUERY_ID = 0x2001;
const ERROR::WRONG_SET_CODE = 0x2002;
const ERROR::WRONG_VALIDATOR_WC = 0x2003;
const ERROR::INSUFFICIENT_BALANCE = 0x2004;
const ERROR::INSUFFICIENT_ELECTOR_FEE = 0x2005;

;; =============== storage =============================

;; storage#_ owner_address:MsgAddressInt validator_address:MsgAddressInt = Storage

(slice, slice) load_data() inline {
    slice ds = get_data().begin_parse();
    return (
        ds~load_msg_addr(), ;; owner_address
        ds~load_msg_addr() ;; validator_address
    );
}

() save_data(slice owner_address, slice validator_address) impure inline {
    set_data(begin_cell()
        .store_slice(owner_address)
        .store_slice(validator_address)
        .end_cell());
}

;; =============== messages =============================

;; defined below
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;
slice make_address(int wc, int addr) inline_ref;
slice elector_address() inline_ref;
int check_new_stake_msg(slice cs) impure inline_ref;

;; main entry point for receiving messages
;; my_balance contains balance after adding msg_value
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4); ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    if (flags & 1) {
        ;; ignore all bounced messages
        return ();
    }
    slice sender = cs~load_msg_addr();

    var (owner_address, validator_address) = load_data();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    ;; owner role - cold wallet (private key that is not connected to the internet) that owns the funds used for staking and acts as the single nominator
    if (equal_slice_bits(sender, owner_address)) {

        ;; allow owner to withdraw funds - take the money home and stop validating with it
        if (op == OP::WITHDRAW) {
            int amount = in_msg_body~load_coins();
            amount = min(amount, my_balance - msg_value - MIN_TON_FOR_STORAGE);
            send_msg(owner_address, amount, null(), BOUNCEABLE, MODE::SEND_MODE_REMAINING_AMOUNT); ;; owner pays gas fees
        }

        ;; mainly used when the validator was compromised to prevent validator from entering new election cycles
        if (op == OP::CHANGE_VALIDATOR_ADDRESS) {
            slice new_validator_address = in_msg_body~load_msg_addr();
            save_data(owner_address, new_validator_address);
        }

        ;; emergency safeguard to allow owner to send arbitrary messages as the nominator contract
        if (op == OP::SEND_RAW_MSG) {
            int mode = in_msg_body~load_uint(8);
            cell msg = in_msg_body~load_ref();
            send_raw_message(msg, mode);
        }

        ;; second emergency safeguard to allow owner to replace nominator logic - you should never need to use this
        if (op == OP::UPGRADE) {
            cell code = in_msg_body~load_ref();
            throw_if(ERROR::WRONG_SET_CODE, cell_null?(code));
            set_code(code);
        }
    }

    ;; validator role - the wallet whose private key is on the validator node (can sign blocks but can't steal the funds used for stake)
    if (equal_slice_bits(sender, validator_address)) {

        ;; send stake to the elector for the next validation cycle (sent every period ~18 hours)
        if (op == OP::NEW_STAKE) {
            (int sender_wc, _) = parse_std_addr(sender);
            (int my_wc, _) = parse_std_addr(my_address());
            throw_unless(ERROR::WRONG_VALIDATOR_WC, sender_wc == -1); ;; for voting purpose
            throw_unless(ERROR::WRONG_NOMINATOR_WC, my_wc == -1); ;; must be deployed on masterchain
            throw_unless(ERROR::WRONG_QUERY_ID, query_id); ;; query_id must be greater then 0 to receive confirmation message from elector
            throw_unless(ERROR::INSUFFICIENT_ELECTOR_FEE, msg_value >= MIN_TON_FOR_SEND_MSG); ;; must be greater then new_stake sending to elector fee
            int stake_amount = in_msg_body~load_coins();
            slice msg = in_msg_body;
            check_new_stake_msg(in_msg_body);
            throw_unless(ERROR::INSUFFICIENT_BALANCE, stake_amount <= my_balance - msg_value - MIN_TON_FOR_STORAGE);

            send_msg(elector_address(), stake_amount, begin_cell().store_uint(op, 32).store_uint(query_id, 64).store_slice(msg).end_cell(), BOUNCEABLE, MODE::SEND_MODE_REMAINING_AMOUNT); ;; bounceable, validator pays gas fees
        }

        ;; recover stake from elector of previous validation cycle (sent every period ~18 hours)
        if (op == OP::RECOVER_STAKE) {
            cell payload = begin_cell().store_uint(OP::RECOVER_STAKE, 32).store_uint(query_id, 64).end_cell();
            send_msg(elector_address(), 0, payload, BOUNCEABLE, MODE::SEND_MODE_REMAINING_AMOUNT); ;; bounceable, validator pays gas fees
        }
    }
}

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L217
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref {
    int has_payload = ~ cell_null?(payload);

    builder msg = begin_cell()
        .store_uint(flags, 6)
        .store_slice(to_address)
        .store_coins(amount)
        .store_uint(has_payload ? 1 : 0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

    if (has_payload) {
        msg = msg.store_ref(payload);
    }

    send_raw_message(msg.end_cell(), send_mode);
}

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L68
slice make_address(int wc, int addr) inline_ref {
    return begin_cell()
        .store_uint(4, 3).store_int(wc, 8).store_uint(addr, ADDRESS_SIZE).end_cell().begin_parse();
}

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L78
slice elector_address() inline_ref {
    int elector = config_param(1).begin_parse().preload_uint(ADDRESS_SIZE);
    return make_address(-1, elector);
}

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L139
;; check the validity of the new_stake message
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L208
int check_new_stake_msg(slice cs) impure inline_ref {
    var validator_pubkey = cs~load_uint(256);
    var stake_at = cs~load_uint(32);
    var max_factor = cs~load_uint(32);
    var adnl_addr = cs~load_uint(256);
    var signature = cs~load_ref().begin_parse().preload_bits(512);
    cs.end_parse();
    return stake_at; ;; supposed start of next validation round (utime_since)
}

;; =============== getters =============================

(slice, slice) get_roles() method_id {
    var (owner_address, validator_address) = load_data();
    return (owner_address, validator_address);
}

;; nominator-pool interface with mytonctrl: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L198
;; since we are relying on the existing interface between mytonctrl and nominator-pool, we return values that instruct mytonctrl
;; to recover stake on every cycle, although mytonctrl samples every 10 minutes we assume its current behavior that new_stake
;; and recover_stake are only sent once per cycle and don't waste gas
(int, int, int, int, (int, int, int, int, int), cell, cell, int, int, int, int, int, cell) get_pool_data() method_id {
    return (
        2, ;; state - funds staked at elector and should be recovered by mytonctrl
        1, ;; nominators_count - owner is the single nominator
        0, ;; stake_amount_sent - unused, mytonctrl does not rely on this param
        0, ;; validator_amount - unused, since gas is always paid by validator there is no concept of validator_amount
        (0, 0, 0, 0, 0), ;; pool config - unused, since not inviting third party nominators
		null(), ;; nominators - unused, mytonctrl does not rely on this param
        null(), ;; withdraw_requests - unused, not needed since owner controls the validator
        0, ;; stake_at - unused, mytonctrl does not rely on this param
        0, ;; saved_validator_set_hash - unused, required for maintaining validator_amount that we don't need
        2, ;; validator_set_changes_count - funds staked at elector and should be recovered by mytonctrl
        0, ;; validator_set_change_time - back in the past so mytonctrl will always attempt to recover stake
        0, ;; stake_held_for - back in the past so mytonctrl will always attempt to recover stake
        null() ;; config_proposal_votings - unused, not needed since owner controls the validator
    );
}

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
int set_seed() impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";

```

## cb1cdae5c512e6b1ca17d1b14514d20ec9dc91e6ba0591cd28a3eb071627f628/imports/constants.fc

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

## cb1cdae5c512e6b1ca17d1b14514d20ec9dc91e6ba0591cd28a3eb071627f628/imports/utils.fc

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

## cb1cdae5c512e6b1ca17d1b14514d20ec9dc91e6ba0591cd28a3eb071627f628/librarian.fc

```fc
#include "imports/utils.fc";

global slice treasury;

() set_lib_code(cell code, int mode) impure asm "SETLIBCODE";
() change_lib(int code_hash, int mode) impure asm "CHANGELIB";

() load_data() impure inline {
    slice ds = get_data().begin_parse();
    treasury = ds~load_msg_addr();
    ds.end_parse();
}

() add_library(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    cell code = s~load_ref();
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, treasury));

    set_lib_code(code, 2 + 16);
}

() remove_library(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    int code_hash = s~load_uint(256);
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, treasury));

    change_lib(code_hash, 0 + 16);
}

() withdraw_surplus(slice src, slice s) impure inline {
    int query_id = s~load_uint(64);
    slice return_excess = s~load_msg_addr();
    s.end_parse();

    throw_unless(err::access_denied, equal_slice_bits(src, treasury));

    raw_reserve(fee::librarian_storage, reserve::at_most);

    builder excess = begin_cell()
        .store_uint(op::gas_excess, 32)
        .store_uint(query_id, 64);
    send_msg(false, return_excess.to_builder(), null(), excess, 0, send::unreserved_balance + send::ignore_errors);
}

() route_internal_message(int flags, slice src, slice s) impure inline {
    int op = s~load_uint(32);

    if op == op::add_library {
        return add_library(src, s);
    }

    if op == op::remove_library {
        return remove_library(src, s);
    }

    if op == op::withdraw_surplus {
        return withdraw_surplus(src, s);
    }

    if op == op::top_up {
        throw(0); ;; top up TON balance, do nothing
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

```

## cb98a1f42ebea2ad491e518038e01bc8a73927c762cd55db7f9c29c611d04140/nft-offer-v1r2.fc

```fc
;; NFT offer contract v1r2
;; mark outgoing transactions Marketplace fee,Royalty,Profit

slice msg::cancel() asm "<b 124 word cancel| $, b> <s PUSHSLICE";
slice msg::profit() asm "<b 124 word Profit| $, b> <s PUSHSLICE";
slice msg::royalties() asm "<b 124 word Royalty| $, b> <s PUSHSLICE";
slice msg::fee() asm "<b 124 word Marketplace fee| $, b> <s PUSHSLICE";
slice msg::cancel_fee() asm "<b 124 word Offer cancel fee| $, b> <s PUSHSLICE";

int division(int a, int b) { ;; division with factor
    return muldiv(a, 1000000000 {- 1e9 -}, b);
}

int multiply(int a, int b) { ;; multiply with factor
    return muldiv (a, b, 1000000000 {- 1e9 -});
}

int get_percent(int a, int percent, int factor) {
    if (factor == 0) {
        return 0;
    } else {
        return division(multiply(a, percent), factor);
    }
}

_ load_data() inline {
    var ds = get_data().begin_parse();
    return (
            ds~load_uint(1),    ;; is_complete 1
            ds~load_uint(32),   ;; created_at 32
            ds~load_uint(32),   ;; finish_at 32
            ds~load_msg_addr(), ;; marketplace_address  267
            ds~load_msg_addr(), ;; nft_address 267
            ds~load_msg_addr(), ;; offer_owner_address 267
            ds~load_coins(),    ;; full_price 127
            ds~load_ref(),      ;; fees_cell
            ds~load_uint(1)     ;; can_deploy
    );
}

_ load_fees(cell fees_cell) inline {
    var ds = fees_cell.begin_parse();
    return (
            ds~load_msg_addr(), ;; marketplace_fee_address
            ds~load_uint(32),    ;; marketplace_factor,
            ds~load_uint(32),    ;; marketplace_base,
            ds~load_msg_addr(), ;; royalty_address
            ds~load_uint(32),    ;; royalty_factor,
            ds~load_uint(32)    ;; royalty_base,
    );
}

() save_data(int is_complete, int created_at, int finish_at, slice marketplace_address, slice nft_address, slice offer_owner_address, int full_price, cell fees_cell) impure inline {
    set_data(
            begin_cell()
                    .store_uint(is_complete, 1)
                    .store_uint(created_at, 32)
                    .store_uint(finish_at, 32)
                    .store_slice(marketplace_address)
                    .store_slice(nft_address)
                    .store_slice(offer_owner_address)
                    .store_coins(full_price)
                    .store_ref(fees_cell)
                    .store_uint(0, 1) ;; can_deploy
                    .end_cell()
    );
}

() send_money(slice address, int amount, slice msg) impure inline {
    var msg = begin_cell()
            .store_uint(0x10, 6) ;; nobounce
            .store_slice(address)
            .store_coins(amount)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(0, 32)
            .store_slice(msg)
            .end_cell();

    send_raw_message(msg, 1);
}

() swap_nft(var args) impure {

    (
            int created_at,
            int finish_at,
            slice marketplace_address,
            slice nft_address,
            slice offer_owner_address,
            int full_price,
            cell fees_cell,

            int my_balance,
            int msg_value,
            slice nft_owner_address,
            int query_id
    ) = args;

    var (
            marketplace_fee_address,
            marketplace_factor, marketplace_base,
            royalty_address,
            royalty_factor, royalty_base
    ) = load_fees(fees_cell);

    int royalty_amount = get_percent(full_price, royalty_factor, royalty_base);
    int marketplace_fee = get_percent(full_price, marketplace_factor, marketplace_base);

    ;; nft owner got offer value
    send_money(nft_owner_address,full_price - marketplace_fee - royalty_amount, msg::profit());

    ;; Royalty message
    if ((royalty_amount > 0) & (royalty_address.slice_bits() > 2)) {
        send_money(royalty_address,royalty_amount, msg::royalties());
    }

    ;; Marketplace fee message
    if (marketplace_fee > 0) {
        send_money(marketplace_fee_address,marketplace_fee, msg::fee());
    }

    builder nft_transfer = begin_cell()
            .store_uint(op::transfer(), 32)
            .store_uint(query_id, 64)
            .store_slice(offer_owner_address) ;; new_owner_address
            .store_slice(nft_owner_address) ;; response_address
            .store_int(0, 1) ;; empty custom_payload
            .store_coins(10000000) ;; forward amount to new_owner_address 0.01 TON
            .store_int(0, 1); ;; no forward_payload
    var nft_msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(nft_address)
            .store_coins(0)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(nft_transfer.end_cell());

    raw_reserve(1000000, 0);
    send_raw_message(nft_msg.end_cell(), 128);

    ;; Set sale as complete
    save_data(
            1,
            created_at, finish_at,
            marketplace_address,
            nft_address,
            offer_owner_address,
            full_price,
            fees_cell
    );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {  ;; ignore all bounced messages
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    var (
            is_complete,
            created_at,
            finish_at,
            marketplace_address,
            nft_address,
            offer_owner_address,
            full_price,
            fees_cell,
            can_deploy
    ) = load_data();

    if (can_deploy == 1) {
        save_data(
                is_complete,
                created_at, finish_at,
                marketplace_address,
                nft_address,
                offer_owner_address,
                msg_value,
                fees_cell
        );
        return ();
    }

    int op = -1;

    if (in_msg_body.slice_data_empty?() == false) {
        op = in_msg_body~load_uint(32);
        if ((op == 0) & equal_slices(in_msg_body, msg::cancel())) {
            op = 3;
        }
    }

    if ((op == 555) & (is_complete == 1) & equal_slices(sender_address, marketplace_address)) {
        ;; way to fix unexpected troubles with contract
        var msg = in_msg_body~load_ref().begin_parse();
        var mode = msg~load_uint(8);
        send_raw_message(msg~load_ref(), mode);
        return ();
    }

    ;; received nft
    if (op == op::ownership_assigned()) {
        var query_id = in_msg_body~load_uint(64);
        slice prev_owner = in_msg_body~load_msg_addr();

        if (sender_address.equal_slices(nft_address) & (is_complete == 0) & (msg_value >= 1000000000)) {
            swap_nft(
                    created_at, finish_at,
                    marketplace_address,
                    nft_address,
                    offer_owner_address,
                    full_price,
                    fees_cell,
                    my_balance,
                    msg_value,
                    prev_owner,
                    query_id
            );
        } else {
            ;; should return nft back
            builder nft_transfer = begin_cell()
                    .store_uint(op::transfer(), 32)
                    .store_uint(query_id, 64) ;; query_id
                    .store_slice(prev_owner) ;; new_owner_address
                    .store_slice(prev_owner) ;; response_address
                    .store_int(0, 1) ;; empty custom_payload
                    .store_coins(0) ;; forward amount to new_owner_address 0.00 TON
                    .store_int(0, 1); ;; empty forward_payload
            var nft_msg = begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(sender_address)
                    .store_coins(0)
                    .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_ref(nft_transfer.end_cell());


            send_raw_message(nft_msg.end_cell(), 64);
        }
        return ();
    }

    ;; Throw if offer is complete
    throw_if(404, is_complete == 1);


    if ((op == 0) & equal_slices(sender_address, offer_owner_address)) {
        ;; add value to offer
        int new_full_price = msg_value + full_price;
        save_data(
                is_complete,
                created_at, finish_at,
                marketplace_address,
                nft_address,
                offer_owner_address,
                new_full_price,
                fees_cell
        );
        return ();
    }

    if (op == 3) { ;; cancel offer
        throw_unless(458, equal_slices(sender_address, offer_owner_address) | equal_slices(sender_address, marketplace_address));

        raw_reserve(1000000, 0); ;; 0.001 TON

        if (equal_slices(sender_address, marketplace_address)) {
            var coins = in_msg_body~load_coins();
            if (coins > 500000000) { ;; MAX 0.5 TON can stole
                coins = 500000000;
            }
            send_money(marketplace_address, coins, msg::cancel_fee()); ;; fee for mp can send message for cancel

            var msg = begin_cell()
                    .store_uint(0x10, 6) ;; nobounce
                    .store_slice(offer_owner_address)
                    .store_coins(0)
                    .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_ref(in_msg_body~load_ref())
                    .end_cell();

            send_raw_message(msg, 128);
        } else {
            var msg = begin_cell()
                    .store_uint(0x10, 6) ;; nobounce
                    .store_slice(offer_owner_address)
                    .store_coins(0)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .end_cell();

            send_raw_message(msg, 128);
        }


        save_data(
                1,
                created_at, finish_at,
                marketplace_address,
                nft_address,
                offer_owner_address,
                full_price,
                fees_cell
        );
        return ();
    }

    throw(0xffff);
}

() recv_external(slice in_msg) impure {
    var (
            is_complete,
            created_at,
            finish_at,
            marketplace_address,
            nft_address,
            offer_owner_address,
            full_price,
            fees_cell,
            can_deploy
    ) = load_data();

    throw_if(404, is_complete == 1);

    if (now() >= finish_at) {
        var op = in_msg~load_uint(32);
        throw_if(4003, op != 0);
        throw_if(4004, slice_refs(in_msg) != 0);
        throw_if(4005, slice_bits(in_msg) > 500);
        accept_message();
        raw_reserve(1000000, 0); ;; 0.001 TON

        var msg = begin_cell()
                .store_uint(0x10, 6) ;; nobounce
                .store_slice(offer_owner_address)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(0,32)
                .store_slice(in_msg)
                .end_cell();

        send_raw_message(msg, 128);


        save_data(
                1,
                created_at, finish_at,
                marketplace_address,
                nft_address,
                offer_owner_address,
                full_price,
                fees_cell
        );
        return ();
    }

    throw(0xfffe);
}

(int, int, int, int, slice, slice, slice, int, slice, int, int, slice, int, int, int) get_offer_data() method_id {
    var (
            is_complete,
            created_at, finish_at,
            marketplace_address,
            nft_address,
            offer_owner_address,
            full_price,
            fees_cell,
            can_deploy
    ) = load_data();

    var (
            marketplace_fee_address,
            marketplace_factor, marketplace_base,
            royalty_address,
            royalty_factor, royalty_base
    ) = load_fees(fees_cell);

    int royalty_amount = get_percent(full_price, royalty_factor, royalty_base);
    int marketplace_fee = get_percent(full_price, marketplace_factor, marketplace_base);
    int profit_price = full_price - royalty_amount - marketplace_fee;

    return (
            0x4f46464552,    ;; offer ("OFFER")
            is_complete == 1,
            created_at, finish_at,
            marketplace_address,
            nft_address,
            offer_owner_address,
            full_price,
            marketplace_fee_address,
            marketplace_factor, marketplace_base,
            royalty_address,
            royalty_factor, royalty_base,
            profit_price
    );
}

```

## cb98a1f42ebea2ad491e518038e01bc8a73927c762cd55db7f9c29c611d04140/op-codes.fc

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

;; SBT
int op::request_owner() asm "0xd0c3bfea PUSHINT";
int op::owner_info() asm "0x0dd607e3 PUSHINT";

int op::prove_ownership() asm "0x04ded148 PUSHINT";
int op::ownership_proof() asm "0x0524c7ae PUSHINT";
int op::ownership_proof_bounced() asm "0xc18e86d2 PUSHINT";

int op::destroy() asm "0x1f04537a PUSHINT";
int op::revoke() asm "0x6f89f5e3 PUSHINT";
int op::take_excess() asm "0xd136d3b3 PUSHINT";
```

## cb98a1f42ebea2ad491e518038e01bc8a73927c762cd55db7f9c29c611d04140/stdlib.fc

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

## cc0d39589eb2c0cfe0fde28456657a3bdd3d953955ae3f98f25664ab3c904fbd/single-nominator-code.fc

```fc
;; https://github.com/orbs-network/single-nominator/blob/main/contracts/single-nominator.fc
;; this contract is very similar to https://github.com/ton-blockchain/nominator-pool but much simpler since it only supports a single nominator
;; frankly speaking, we tried using nominator-pool but it's so complicated that we couldn't be sure there were no bugs hiding around
;; this contract is very simple and easy to review, it is laser focused on protecting your stake and nothing else!

;; =============== consts =============================

const BOUNCEABLE = 0x18;
const ADDRESS_SIZE = 256;
const MIN_TON_FOR_STORAGE = 1000000000; ;; 10% from nominator-pool since we have a single cell
const MIN_TON_FOR_SEND_MSG = 1200000000;

;; owner ops
const OP::WITHDRAW = 0x1000;
const OP::CHANGE_VALIDATOR_ADDRESS = 0x1001;
const OP::SEND_RAW_MSG = 0x7702;
const OP::UPGRADE = 0x9903;

;; elector ops
const OP::NEW_STAKE = 0x4e73744b;
const OP::RECOVER_STAKE = 0x47657424;

;; modes
const MODE::SEND_MODE_REMAINING_AMOUNT = 64;

;; errors
const ERROR::WRONG_NOMINATOR_WC = 0x2000;
const ERROR::WRONG_QUERY_ID = 0x2001;
const ERROR::WRONG_SET_CODE = 0x2002;
const ERROR::WRONG_VALIDATOR_WC = 0x2003;
const ERROR::INSUFFICIENT_BALANCE = 0x2004;
const ERROR::INSUFFICIENT_ELECTOR_FEE = 0x2005;

;; =============== storage =============================

;; storage#_ owner_address:MsgAddressInt validator_address:MsgAddressInt = Storage

(slice, slice) load_data() inline {
	slice ds = get_data().begin_parse();

	slice owner_address = ds~load_msg_addr();
	slice validator_address = ds~load_msg_addr();

	ds.end_parse();

	return (owner_address, validator_address);
}

() save_data(slice owner_address, slice validator_address) impure inline {
	set_data(begin_cell()
		.store_slice(owner_address)
		.store_slice(validator_address)
		.end_cell());
}

;; =============== messages =============================

;; defined below
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref;
slice make_address(int wc, int addr) inline_ref;
slice elector_address() inline_ref;
int check_new_stake_msg(slice cs) impure inline_ref;

;; main entry point for receiving messages
;; my_balance contains balance after adding msg_value
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
	var (owner_address, validator_address) = load_data();

	if (in_msg_body.slice_empty?()) {
		return ();
	}

	slice cs = in_msg_full.begin_parse();
	int flags = cs~load_uint(4); ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
	if (flags & 1) {
		;; ignore all bounced messages
		return ();
	}
	slice sender = cs~load_msg_addr();

	int op = in_msg_body~load_uint(32);
	int query_id = 0; ;; filled below

	;; if just a message with comment "w" - means withdraw
	if ( (op == 0) & (equal_slice_bits(in_msg_body, "w")) & (in_msg_body.slice_refs() == 0) ) {
		op = OP::WITHDRAW;
		;; in few lines, amount to withdraw is loaded from in_msg_body,
		;; so we set it to the maximum avaliable balance
		in_msg_body = begin_cell().store_coins(my_balance - msg_value - MIN_TON_FOR_STORAGE).end_cell().begin_parse();
	} else {
		query_id = in_msg_body~load_uint(64);
	}

	;; owner role - cold wallet (private key that is not connected to the internet) that owns the funds used for staking and acts as the single nominator
	if (equal_slice_bits(sender, owner_address)) {

		;; allow owner to withdraw funds - take the money home and stop validating with it
		if (op == OP::WITHDRAW) {
			int amount = in_msg_body~load_coins();
			amount = min(amount, my_balance - msg_value - MIN_TON_FOR_STORAGE);
			throw_unless(ERROR::INSUFFICIENT_BALANCE, amount > 0);
			send_msg(owner_address, amount, null(), BOUNCEABLE, MODE::SEND_MODE_REMAINING_AMOUNT); ;; owner pays gas fees
		}

		;; mainly used when the validator was compromised to prevent validator from entering new election cycles
		if (op == OP::CHANGE_VALIDATOR_ADDRESS) {
			slice new_validator_address = in_msg_body~load_msg_addr();
			save_data(owner_address, new_validator_address);
		}

		;; emergency safeguard to allow owner to send arbitrary messages as the nominator contract
		if (op == OP::SEND_RAW_MSG) {
			int mode = in_msg_body~load_uint(8);
			cell msg = in_msg_body~load_ref();
			send_raw_message(msg, mode);
		}

		;; second emergency safeguard to allow owner to replace nominator logic - you should never need to use this
		if (op == OP::UPGRADE) {
			cell code = in_msg_body~load_ref();
			throw_if(ERROR::WRONG_SET_CODE, cell_null?(code));
			set_code(code);
		}
	}

	;; validator role - the wallet whose private key is on the validator node (can sign blocks but can't steal the funds used for stake)
	if (equal_slice_bits(sender, validator_address)) {

		;; send stake to the elector for the next validation cycle (sent every period ~18 hours)
		if (op == OP::NEW_STAKE) {
			(int sender_wc, _) = parse_std_addr(sender);
			(int my_wc, _) = parse_std_addr(my_address());
			throw_unless(ERROR::WRONG_VALIDATOR_WC, sender_wc == -1); ;; for voting purpose
			throw_unless(ERROR::WRONG_NOMINATOR_WC, my_wc == -1); ;; must be deployed on masterchain
			throw_unless(ERROR::WRONG_QUERY_ID, query_id); ;; query_id must be greater then 0 to receive confirmation message from elector
			throw_unless(ERROR::INSUFFICIENT_ELECTOR_FEE, msg_value >= MIN_TON_FOR_SEND_MSG); ;; must be greater then new_stake sending to elector fee
			int stake_amount = in_msg_body~load_coins();
			slice msg = in_msg_body;
			check_new_stake_msg(in_msg_body);
			throw_unless(ERROR::INSUFFICIENT_BALANCE, stake_amount <= my_balance - msg_value - MIN_TON_FOR_STORAGE);

			send_msg(elector_address(), stake_amount, begin_cell().store_uint(OP::NEW_STAKE, 32).store_uint(query_id, 64).store_slice(msg).end_cell(), BOUNCEABLE, MODE::SEND_MODE_REMAINING_AMOUNT); ;; bounceable, validator pays gas fees
		}

		;; recover stake from elector of previous validation cycle (sent every period ~18 hours)
		if (op == OP::RECOVER_STAKE) {
			cell payload = begin_cell().store_uint(OP::RECOVER_STAKE, 32).store_uint(query_id, 64).end_cell();
			send_msg(elector_address(), 0, payload, BOUNCEABLE, MODE::SEND_MODE_REMAINING_AMOUNT); ;; bounceable, validator pays gas fees
		}
	}
}

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L217
() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref {
	int has_payload = ~ cell_null?(payload);

	builder msg = begin_cell()
		.store_uint(flags, 6)
		.store_slice(to_address)
		.store_coins(amount)
		.store_uint(has_payload ? 1 : 0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

	if (has_payload) {
		msg = msg.store_ref(payload);
	}

	send_raw_message(msg.end_cell(), send_mode);
}

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L68
slice make_address(int wc, int addr) inline_ref {
	return begin_cell()
		.store_uint(4, 3).store_int(wc, 8).store_uint(addr, ADDRESS_SIZE).end_cell().begin_parse();
}

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L78
slice elector_address() inline_ref {
	int elector = config_param(1).begin_parse().preload_uint(ADDRESS_SIZE);
	return make_address(-1, elector);
}

;; taken from nominator-pool: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L139
;; check the validity of the new_stake message
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L208
int check_new_stake_msg(slice cs) impure inline_ref {
	var validator_pubkey = cs~load_uint(256);
	var stake_at = cs~load_uint(32);
	var max_factor = cs~load_uint(32);
	var adnl_addr = cs~load_uint(256);
	var signature = cs~load_ref().begin_parse().preload_bits(512);
	cs.end_parse();
	return stake_at; ;; supposed start of next validation round (utime_since)
}

;; =============== getters =============================

(slice, slice) get_roles() method_id {
	var (owner_address, validator_address) = load_data();
	return (owner_address, validator_address);
}

;; nominator-pool interface with mytonctrl: https://github.com/ton-blockchain/nominator-pool/blob/2f35c36b5ad662f10fd7b01ef780c3f1949c399d/func/pool.fc#L198
;; since we are relying on the existing interface between mytonctrl and nominator-pool, we return values that instruct mytonctrl
;; to recover stake on every cycle, although mytonctrl samples every 10 minutes we assume its current behavior that new_stake
;; and recover_stake are only sent once per cycle and don't waste gas
(int, int, int, int, (int, int, int, int, int), cell, cell, int, int, int, int, int, cell) get_pool_data() method_id {
	return (
		2, ;; state - funds staked at elector and should be recovered by mytonctrl
		1, ;; nominators_count - owner is the single nominator
		0, ;; stake_amount_sent - unused, mytonctrl does not rely on this param
		0, ;; validator_amount - unused, since gas is always paid by validator there is no concept of validator_amount
		(0, 0, 0, 0, 0), ;; pool config - unused, since not inviting third party nominators
		null(), ;; nominators - unused, mytonctrl does not rely on this param
		null(), ;; withdraw_requests - unused, not needed since owner controls the validator
		0, ;; stake_at - unused, mytonctrl does not rely on this param
		0, ;; saved_validator_set_hash - unused, required for maintaining validator_amount that we don't need
		2, ;; validator_set_changes_count - funds staked at elector and should be recovered by mytonctrl
		0, ;; validator_set_change_time - back in the past so mytonctrl will always attempt to recover stake
		0, ;; stake_held_for - back in the past so mytonctrl will always attempt to recover stake
		null() ;; config_proposal_votings - unused, not needed since owner controls the validator
	);
}

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

## ce5a78534eaaa6ceed8dafd486d076eb60a9b0d6dbfb53676f662649c0689956/imports/stdlib.fc

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

## ce5a78534eaaa6ceed8dafd486d076eb60a9b0d6dbfb53676f662649c0689956/nft-auction-v4r1.func

```func
#include "./stdlib.fc";
#include "op-codes.fc";


;; auction for jettons/tons
;; see https://github.com/getgems-io/nft-contracts

;;
;;  custom TVM exit codes
;;

int exit::low_bid()             asm "1000 PUSHINT";
int exit::auction_init()        asm "1001 PUSHINT";
int exit::no_transfer()         asm "1002 PUSHINT";
int exit::not_cancel()          asm "1004 PUSHINT";
int exit::auction_end()         asm "1005 PUSHINT";
int exit::already_activated()   asm "1006 PUSHINT";
int exit::low_amount()          asm "1008 PUSHINT";
int exit::cant_cancel_bid()     asm "1009 PUSHINT";
int exit::cant_stop_time()      asm "1010 PUSHINT";
int exit::bad_mode()            asm "1012 PUSHINT";
int exit::last_bid_too_close()  asm "1013 PUSHINT";
int exit::its_too_long_auc()     asm "1014 PUSHINT";
int exit::not_activated_yet()   asm "1015 PUSHINT";
int exit::broken_state()   asm "1016 PUSHINT";
int exit::wrong_currency()   asm "1017 PUSHINT";


const int op::finish_acution = "finish_auction"c;
const int op::cancel_acution = "cancel_auction"c;
const int op::set_jetton_wallet = "set_jetton_wallet"c;
const int op::process_ton_bid = "process_ton_bid"c;
const int op::deploy_auction = "deploy_auction"c;

const int TON_FOR_NFT_PROCESS = 100000000; ;; 0.1 TON
const int TON_FOR_JETTON = 50000000; ;; 0.05 TON
const int TON_FOR_END_JETTON_AUC = TON_FOR_JETTON + TON_FOR_JETTON + TON_FOR_JETTON + TON_FOR_NFT_PROCESS;
const int TON_FOR_END_TON_AUC = TON_FOR_NFT_PROCESS;

forall X -> int cast_to_int(X x) asm "NOP";
slice null_addr() asm "b{00} PUSHSLICE";
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";

;;
;;  persistant and runtime storage description
;;

global int      init?; ;; init_data safe check
global int      end?; ;; end auction or not
global slice    mp_addr; ;; the address of the marketplace from which the contract is deployed
global int      activated?; ;; contract is activated by external message or by nft transfer
global int      created_at?; ;; timestamp of created acution
global int      is_canceled?; ;; auction was cancelled by owner

global cell fees_cell;
global cell constant_cell;

global int      is_jetton_mode; ;;
global slice    jetton_wallet; ;; jetton wallet address or null
global slice    jetton_master; ;; jetton master address or null for detect jettons
global int      min_bid; ;; minimal bid
global int      max_bid; ;; maximum bid
global int      min_step; ;; minimum step (can be 0)
global slice    last_member; ;; last member address
global int      last_bid; ;; last bid amount
global int      last_bid_at; ;; timestamp of last bid
global int      last_query_id; ;; last processed query id
global int      end_time; ;; unix end time
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30)
global int      public_key; ;; public key for jetton mode
global int      is_broken_state; ;; broken state
global cell     jt_cell;

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction)
global slice    nft_addr; ;; nft address

;;
;;  math utils
;;
int math::get_percent(int a, int percent, int factor) inline {
    if (factor == 0) {
        return 0;
    } else {
        return muldiv(a, percent, factor);
    }
}

int math::check_profitable(int mp_fee_factor, int mp_fee_base, int royalty_fee_factor, int royalty_fee_base) inline {
    int amount = 10000000000;
    int mp_fee = math::get_percent(amount, mp_fee_factor, mp_fee_base);
    int royalty_fee = math::get_percent(amount, royalty_fee_factor, royalty_fee_base);
    int profit = amount - mp_fee - royalty_fee;
    if (profit < 1) {
        return 0;
    }
    return 1;
}


() send_jettons(slice jetton_wallet_address, int query_id, slice address, int amount, slice response_address, int fwd_amount) impure inline_ref {
    if (amount <= 0) {
        return ();
    }

    int should_carry_gas = false;
    if (fwd_amount == -1) {
        fwd_amount = 0;
        should_carry_gas = true;
    }

    var msg_payload = begin_cell()
        .store_uint(jetton::transfer(), 32) ;; transfer
        .store_uint(query_id, 64)
        .store_coins(amount)
        .store_slice(address)
        .store_slice(response_address)
        .store_int(0, 1)
        .store_coins(fwd_amount)
        .store_uint(0, 1)
        .end_cell();

    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce
        .store_slice(jetton_wallet_address)
        .store_coins(should_carry_gas ? 0 : (40000000 + fwd_amount)) ;; 0.04 TON or zero
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(msg_payload)
        .end_cell();

    int flag = should_carry_gas ? (64 + 2) : (1 + 2);
    send_raw_message(msg, flag);
}

() pack_data() impure inline_ref {
    set_data(
        begin_cell()
            .store_int(end?, 1) ;;              1
            .store_int(is_canceled?, 1) ;;      1
            .store_slice(last_member) ;;            267 ($10 with Anycast = 0)
            .store_coins(last_bid) ;;               127
            .store_uint(last_bid_at, 32) ;;     32
            .store_uint(end_time, 32) ;;        32
            .store_slice(nft_owner) ;;              267
            .store_uint(last_query_id, 64) ;;   64
            .store_ref(fees_cell) ;; + ref
            .store_ref(constant_cell) ;; + ref
            .store_maybe_ref(jt_cell) ;; +1
            .end_cell() ;; total 1+1+267+127+32+32+267+64+1 = 792
    );
}

() init_data() impure inline_ref {- save for get methods -} {
    ifnot (null?(init?)) {
        return ();
    }

    slice ds = get_data().begin_parse();
    end? = ds~load_int(1);
    is_canceled? = ds~load_int(1);
    last_member = ds~load_msg_addr();
    last_bid = ds~load_coins();
    last_bid_at = ds~load_uint(32);
    end_time = ds~load_uint(32);
    nft_owner = ds~load_msg_addr();
    activated? = nft_owner.slice_bits() > 2;
    last_query_id = ds~load_uint(64);

    fees_cell = ds~load_ref();
    constant_cell = ds~load_ref();
    slice constants = constant_cell.begin_parse();
    mp_addr = constants~load_msg_addr(); ;; 267
    min_bid = constants~load_coins(); ;; 127
    max_bid = constants~load_coins(); ;; 127
    min_step = constants~load_uint(7); ;;7
    step_time = constants~load_uint(17); ;;17
    nft_addr = constants~load_msg_addr(); ;; 267
    created_at? = constants~load_uint(32); ;; 32
    ;; total 267+127+127+7+17+267+32=844

    int has_jetton_data = ds~load_uint(1);
    public_key = 0;
    is_jetton_mode = false;
    if (has_jetton_data == 1) {
        jt_cell = ds~load_ref();
        slice jt_slice = jt_cell.begin_parse();

        jetton_wallet = jt_slice~load_msg_addr(); ;; 267
        jetton_master = jt_slice~load_msg_addr(); ;; 267
        is_jetton_mode = jetton_wallet.slice_bits() > 2;

        is_broken_state = false;
        if ((jetton_master.slice_bits() > 2) & (is_jetton_mode == false)) {
            is_broken_state = true;
        }

        int has_public_key = jt_slice~load_uint(1);
        if (has_public_key == 1) {
            public_key = jt_slice~load_uint(256);
            is_broken_state = true;
        }
    } else {
        jetton_wallet = null_addr();
        jetton_master = null_addr();
        is_broken_state = false;
    }




    init? = true;
}

(slice, slice, int, int, int, int) get_fees_addresses() inline_ref {
    slice fees = fees_cell.begin_parse();
    slice mp_fee_addr = fees~load_msg_addr();
    slice royalty_fee_addr = fees~load_msg_addr();
    int mp_fee_factor = fees~load_uint(32);
    int mp_fee_base = fees~load_uint(32);
    int royalty_fee_factor = fees~load_uint(32);
    int royalty_fee_base = fees~load_uint(32);
    return (
        mp_fee_addr,
        royalty_fee_addr,
        mp_fee_factor,
        mp_fee_base,
        royalty_fee_factor,
        royalty_fee_base
    );
}

{-
    SHOULD
    [+] check init auction or not
    [+] check op
    [+] change nft owner
    [+] change auction status
-}
() handle::try_init_auction(slice sender_addr, slice in_msg_body) impure inline_ref {
    throw_if(exit::auction_init(), nft_owner.slice_bits() > 2); ;; throw if auction already init
    throw_unless(exit::no_transfer(), in_msg_body~load_uint(32) == op::ownership_assigned()); ;; throw if it`s not ownership assigned
    in_msg_body~skip_bits(64); ;; query id
    nft_owner = in_msg_body~load_msg_addr();
    end? = false;
    activated? = true;
    pack_data();
}

() return_nft(int query_id, slice fee_pay_address, slice new_owner) impure inline_ref {
    builder nft_transfer_body = begin_cell()
        .store_uint(op::transfer(), 32)
        .store_uint(query_id, 64) ;; query id
        .store_slice(new_owner) ;; return nft no creator
        .store_slice(fee_pay_address) ;; response_destination
        .store_uint(0, 1) ;; custom payload
        .store_coins(1) ;; forward amount
        .store_uint(0, 1); ;; forward payload

    builder nft_return_msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(nft_addr)
        .store_coins(0)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(nft_transfer_body.end_cell());

    send_raw_message(nft_return_msg.end_cell(), 130);  ;; 128 +2 for ignoring errors
}

() handle::cancel(int query_id, slice sender_addr) impure inline_ref {
    return_nft(query_id, sender_addr, nft_owner);
    end? = true;
    is_canceled? = true;
    pack_data();
}

() send_founds(slice to_address, int amonut, int query_id, slice fee_pay_address) impure inline_ref {
    if (is_jetton_mode == true) {
        send_jettons(jetton_wallet, query_id, to_address, amonut, fee_pay_address, 1);
    } else {
        builder transfer = begin_cell()
            .store_uint(0x10, 6) ;; 0 (int_msg_info) 1 (ihr_disabled) 1 (no bounces) 00 (address)
            .store_slice(to_address)
            .store_coins(amonut)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

        send_raw_message(transfer.end_cell(), 2);
    }
}

int get_price_for_end_auction() inline {
    if (is_jetton_mode == true) {
        return TON_FOR_END_JETTON_AUC;
    } else {
        return TON_FOR_END_TON_AUC;
    }
}

() check_ok_balance(int my_balance) impure inline {
    throw_if(exit::low_bid(), my_balance < get_price_for_end_auction());
    accept_message();
}

() handle::end_auction(slice sender_addr, int from_external, int query_id) impure inline_ref {
    if (last_bid == 0) {
        ;; just return nft

        if (from_external == true) {
            [int my_balance, _] = get_balance();
            check_ok_balance(my_balance);
        }

        handle::cancel(query_id, sender_addr);
        return ();
    }

    var (
        mp_fee_addr,
        royalty_fee_addr,
        mp_fee_factor,
        mp_fee_base,
        royalty_fee_factor,
        royalty_fee_base
    ) = get_fees_addresses();

    int last_bid_avaliable_profit = last_bid;
    if (is_jetton_mode == false) {
        [int my_balance, _] = get_balance();
        last_bid_avaliable_profit = min(last_bid_avaliable_profit, (my_balance - get_price_for_end_auction()));
        throw_unless(exit::low_amount(), last_bid_avaliable_profit > 0);
    }


    int mp_fee = math::get_percent(last_bid_avaliable_profit, mp_fee_factor, mp_fee_base);
    int royalty_fee = math::get_percent(last_bid_avaliable_profit, royalty_fee_factor, royalty_fee_base);
    int profit = last_bid_avaliable_profit - mp_fee - royalty_fee;

    if (from_external == true) {
        if (is_jetton_mode == false) {
            check_ok_balance(profit);
            profit = profit - get_price_for_end_auction();
        } else {
            [int my_balance, _] = get_balance();
            check_ok_balance(my_balance);
        }
    }

    if (mp_fee > 0) {
        send_founds(mp_fee_addr, mp_fee, query_id, sender_addr);
    }

    if (royalty_fee > 0) {
        send_founds(royalty_fee_addr, royalty_fee, query_id, sender_addr);
    }

    if (profit > 0) {
        send_founds(nft_owner, profit, query_id, sender_addr);
    }


    return_nft(query_id, sender_addr, last_member);
    end? = true;
    is_canceled? = false;
    end_time = now();
    pack_data();
}

;;
;;  main code
;;

() return_last_bid(int query_id, slice fee_pay_address, int my_balance) impure inline_ref {
    if (last_bid <= 0) {
        return ();
    }
    if (is_jetton_mode == true) {
        send_jettons(jetton_wallet, query_id, last_member, last_bid, fee_pay_address, 1);
    } else {
        int magic_gas_price = get_compute_fee(false, 11169);
        int return_bid_amount = last_bid - magic_gas_price;
        if (return_bid_amount > (my_balance - 10000000)) {
            ;; - 0.01 TON
            return_bid_amount = my_balance - 10000000;
        }
        if (return_bid_amount > 0) {
            builder return_prev_bid = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(last_member)
                .store_coins(return_bid_amount)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(0, 32)
                .store_slice("Your bid has been outbid by another user");

            send_raw_message(return_prev_bid.end_cell(), 2);
        }
    }
}

int get_next_min_bid() {
    if (is_jetton_mode) {
        return math::get_percent(last_bid, 100 + min_step, 100);
    } else {
        return max(
            last_bid + 100000000, ;; 0.1 ton
            math::get_percent(last_bid, 100 + min_step, 100)
        );
    }
}

() process_new_bid(int query_id, slice sender_addr, int bid_value, int ton_value, int my_balance) impure inline_ref {
    if (activated? == false) {
        throw(exit::not_activated_yet());
        return ();
    }

    if (is_broken_state == true) {
        throw(exit::broken_state());
        return ();
    }

    if ((end? == true) | (now() >= end_time)) {
        throw(exit::auction_end());
        return ();
    }

    ;; auction large than 20 days not allowed
    int duration = end_time - now();
    throw_if(exit::its_too_long_auc(), duration > 60 * 60 * 24 * 20);

    ;; max bid buy nft
    if ((bid_value >= max_bid) & (max_bid > 0)) {
        if (is_jetton_mode == true) {
            throw_if(exit::low_amount(), ton_value < TON_FOR_END_JETTON_AUC);
        } else {
            throw_if(exit::low_amount(), ton_value < (max_bid + TON_FOR_END_TON_AUC));
        }

        return_last_bid(query_id, sender_addr, my_balance);
        last_member = sender_addr;
        last_bid = max_bid;
        last_bid_at = now();
        last_query_id = query_id;
        handle::end_auction(sender_addr, false, query_id);
        return ();
    }

    ;; prevent bid at last second
    if ((end_time - step_time) < now()) {
        end_time += step_time;
    }

    ifnot (last_bid) {
        throw_if(exit::low_bid(), bid_value < min_bid);
        last_bid = bid_value;
        last_member = sender_addr;
        last_bid_at = now();
        last_query_id = query_id;
        pack_data();
        return ();
    }

    int new_min_bid = get_next_min_bid();
    if (bid_value < new_min_bid) {
        throw(exit::low_bid());
        return ();
    }

    if (is_jetton_mode == true) {
        throw_if(exit::low_amount(), ton_value < TON_FOR_JETTON);
    }
    return_last_bid(query_id, sender_addr, my_balance);

    last_member = sender_addr;
    last_bid = bid_value;
    last_bid_at = now();
    last_query_id = query_id;

    pack_data();
}

() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure {
    slice cs = in_msg_cell.begin_parse();
    throw_if(0, cs~load_uint(4) & 1);

    slice sender_addr = cs~load_msg_addr();
    init_data();

    if (equal_slices(sender_addr, nft_addr)) {
        if (end? == false) {
            handle::try_init_auction(sender_addr, in_msg_body);
        } else {
            int query_id = in_msg_body~load_uint(64); ;; query id
            slice old_nft_owner = in_msg_body~load_msg_addr();
            return_nft(query_id, sender_addr, old_nft_owner);
        }
        return ();
    }

    int op = 0;
    int query_id = 0;
    if (slice_empty?(in_msg_body) == false) {
        op = in_msg_body~load_uint(32);
        if (op != 0) {
            query_id = in_msg_body~load_uint(64);
        }
    }


    if (op == 555) {
        throw_unless(exit::not_cancel(), ((end? == true) | (activated? == false)));
        throw_unless(403, equal_slices(sender_addr, mp_addr));
        ;; way to fix unexpected troubles with auction contract
        ;; for example if some one transfer nft to this contract
        var msg = in_msg_body~load_ref().begin_parse();
        var mode = msg~load_uint(8);
        throw_if(exit::bad_mode(), mode & 32);

        int ten_min = 10 * 60;
        throw_if(exit::last_bid_too_close(), (now() > (end_time - ten_min)) & (now() < (end_time + ten_min)));
        if (last_bid_at != 0) {
            throw_if(exit::last_bid_too_close(), (now() > (last_bid_at - ten_min)) & (now() < (last_bid_at + ten_min)));
        }

        send_raw_message(msg~load_ref(), mode);
        if (end? != true) {
            end? = true;
            pack_data();
        }
        return ();
    }

    if (op == op::cancel_acution) {
        ;; cancel command, return nft if no bid yet
        throw_if(exit::auction_end(), now() >= end_time); ;; after timeout can't cancel
        throw_if(exit::auction_end(), end? == true); ;; already canceled/ended
        throw_if(exit::not_activated_yet(), activated? == false);
        throw_if(exit::low_amount(), msg_value < TON_FOR_NFT_PROCESS);
        throw_if(exit::cant_cancel_bid(), last_bid > 0); ;; can't cancel if someone already placed a bid
        throw_unless(403, equal_slices(sender_addr, nft_owner) | equal_slices(sender_addr, mp_addr));
        handle::cancel(query_id, sender_addr);
        return ();
    }

    if (op == op::finish_acution) {
        ;; stop auction
        throw_if(exit::auction_end(), end? == true); ;; end = true mean this action already executed
        throw_if(exit::not_activated_yet(), activated? == false);
        int price_for_end = get_price_for_end_auction();
        throw_if(exit::low_amount(), msg_value < price_for_end);
        throw_if(exit::cant_stop_time(), now() < end_time); ;; can't end auction in progress, only after end time
        throw_unless(403, equal_slices(sender_addr, nft_owner) | equal_slices(sender_addr, mp_addr) | equal_slices(sender_addr, last_member));
        handle::end_auction(sender_addr, false, query_id);
        return ();
    }

    if (op == op::deploy_auction) {
        ;; just accept coins
        return ();
    }

    if (op == op::set_jetton_wallet) {
        throw_if(exit::already_activated(), public_key == 0);
        throw_if(exit::cant_cancel_bid(), last_bid > 0);

        var signature = in_msg_body~load_bits(512);
        var payload = slice_hash(in_msg_body);
        throw_unless(35, check_signature(payload, signature, public_key));
        ;; check than update from expected address
        throw_unless(403, equal_slices(sender_addr, jetton_wallet));

        jetton_wallet = in_msg_body~load_msg_addr();
        in_msg_body.end_parse();
        var (wc, hash) = parse_std_addr(jetton_wallet);
        throw_unless(36, wc == 0);

        jt_cell = begin_cell()
            .store_slice(jetton_wallet)
            .store_slice(jetton_master)
            .store_uint(0, 1)
            .end_cell();

        pack_data();
        return ();
    }

    ;; bid process

    if ((op == 0) | (op == op::process_ton_bid)) {
        throw_unless(exit::wrong_currency(), is_jetton_mode == false);
        process_new_bid(query_id, sender_addr, msg_value, msg_value, msg_value);
        return ();
    }

    if (op == jetton::transfer_notification()) {
        var (wc, addr_hash) = parse_std_addr(sender_addr);

        ;; check workchain
        throw_unless(452, wc == 0);

        ;; load amount
        var jetton_amount = in_msg_body~load_coins();
        var buyer_address = in_msg_body~load_msg_addr();

        if ((is_jetton_mode == false) | (equal_slices(sender_addr, jetton_wallet) == false)) {
            send_jettons(sender_addr, exit::wrong_currency(), buyer_address, jetton_amount, buyer_address, -1);
            return ();
        }

        try {
            process_new_bid(query_id, buyer_address, jetton_amount, msg_value, my_balance);
        }  catch (__, error_code) {
            send_jettons(sender_addr, error_code, buyer_address, jetton_amount, buyer_address, -1);
        }

        return ();
    }

    throw(0xffff);
}

() recv_external(slice in_msg) impure {
    init_data();

    int op = in_msg~load_uint(32);
    int query_id = in_msg~load_uint(64);

    if (op == op::finish_acution) {
        throw_if(exit::not_activated_yet(), activated? == false);
        throw_if(exit::auction_end(), end? == true); ;; end = true mean this action already executed
        throw_if(exit::cant_stop_time(), now() < end_time); ;; can't end auction in progress, only after end time
        handle::end_auction(nft_owner, true, query_id);
        return ();
    }

    throw(0xffff);
}

(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int, int, int, slice, slice, int, int) get_auction_data_v4() method_id {
    init_data();

    var (
        mp_fee_addr,
        royalty_fee_addr,
        mp_fee_factor,
        mp_fee_base,
        royalty_fee_factor,
        royalty_fee_base
    ) = get_fees_addresses();

    var profitable = math::check_profitable(mp_fee_factor, mp_fee_base, royalty_fee_factor, royalty_fee_base);
    if (profitable == 0) {
        is_broken_state = true;
    }

    if (last_bid > 0) {
        min_bid = get_next_min_bid();
    }

    return (
        activated?, ;;1
        end?, ;; 2
        end_time, ;; 3
        mp_addr, ;; 4
        nft_addr, ;; 5
        nft_owner, ;; 6
        last_bid, ;; 7
        last_member, ;; 8
        min_step, ;; 9 min step
        mp_fee_addr, ;; 10
        mp_fee_factor, mp_fee_base, ;; 11, 12
        royalty_fee_addr, ;; 13
        royalty_fee_factor, royalty_fee_base, ;; 14, 15
        max_bid, ;; 16
        min_bid, ;; 17
        created_at?, ;; 18
        last_bid_at, ;; 19
        is_canceled?, ;; 20
        step_time, ;; 21
        last_query_id, ;; 22
        jetton_wallet, ;; 23
        jetton_master, ;; 24
        is_broken_state, ;; 25
        public_key ;; 26
    );
}

```

## ce5a78534eaaa6ceed8dafd486d076eb60a9b0d6dbfb53676f662649c0689956/op-codes.fc

```fc
int op::transfer() asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned() asm "0x05138d91 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::get_static_data() asm "0x2fcb26a2 PUSHINT";
int op::report_static_data() asm "0x8b771735 PUSHINT";
int op::get_royalty_params() asm "0x693d3950 PUSHINT";
int op::report_royalty_params() asm "0xa8cb00ad PUSHINT";
int op::fix_price_v4_deploy_jetton() asm "0xfb5dbf47 PUSHINT";
int op::fix_price_v4_deploy_blank() asm "0x664c0905 PUSHINT";
int op::fix_price_v4_cancel() asm "0x3 PUSHINT";
int op::fix_price_v4_change_price() asm "0xfd135f7b PUSHINT";
int op::fix_price_v4_buy() asm "0x2 PUSHINT";

;; NFTEditable
int op::edit_content() asm "0x1a0b9d51 PUSHINT";
int op::transfer_editorship() asm "0x1c04412a PUSHINT";
int op::editorship_assigned() asm "0x511a4463 PUSHINT";

;; SBT
int op::request_owner() asm "0xd0c3bfea PUSHINT";
int op::owner_info() asm "0x0dd607e3 PUSHINT";

int op::prove_ownership() asm "0x04ded148 PUSHINT";
int op::ownership_proof() asm "0x0524c7ae PUSHINT";
int op::ownership_proof_bounced() asm "0xc18e86d2 PUSHINT";

int op::destroy() asm "0x1f04537a PUSHINT";
int op::revoke() asm "0x6f89f5e3 PUSHINT";
int op::take_excess() asm "0xd136d3b3 PUSHINT";

int jetton::transfer_notification() asm "0x7362d09c PUSHINT";
int jetton::transfer() asm "0xf8a7ea5 PUSHINT";

```

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/constants.fc

```fc
;; operations (constant values taken from crc32 on op message in the companion .tlb files and appear during build)
int op::increment() asm "0x37491f2f PUSHINT";
int op::deposit() asm "0x47d54391 PUSHINT";
int op::withdraw() asm "0x41836980 PUSHINT";
int op::transfer_ownership() asm "0x2da38aaf PUSHINT";

;; errors
int error::unknown_op() asm "101 PUSHINT";
int error::access_denied() asm "102 PUSHINT";
int error::insufficient_balance() asm "103 PUSHINT";

;; other
int const::min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON

;; 6905(computational_gas_price) * 1000(cur_gas_price) = 6905000
;; ceil(6905000) = 10000000 ~= 0.01 TON
int const::provide_address_gas_consumption() asm "10000000 PUSHINT";
```

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int status) inline {
   return  begin_cell()
            .store_coins(balance)
            .store_slice(owner_address)
            .store_slice(jetton_master_address)
            .store_ref(jetton_wallet_code)
            .store_uint(status, 32)
           .end_cell();
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return begin_cell()
          .store_uint(0, 2)
          .store_dict(jetton_wallet_code)
          .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code, 0))
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

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/op-codes.fc

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

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/stdlib.fc

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
const slice_jetton = "UQCJnVj2RrOARfAf0ccWRPTlDVQ0gtiejnce6JA86_SVNO5_"a;

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


const builder_jetton = "UQBp4VTgYl8T6ubWIGms0q27eeMPJagUZ1Qj8VYAT-l7x3M1"a;
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

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/imports/utils.fc

```fc
() send_grams(slice address, int amount) impure {
  cell msg = begin_cell()
    .store_uint (0x18, 6) ;; bounce
    .store_slice(address) ;; 267 bit address
    .store_grams(amount)
    .store_uint(0, 107) ;; 106 zeroes +  0 as an indicator that there is no cell with the data
    .end_cell(); 
  send_raw_message(msg, 3); ;; mode, 2 for ignoring errors, 1 for sender pays fees, 64 for returning inbound message value
}
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

const min_tons_for_storage = 10000000; ;; 0.01 TON
const gas_consumption = 10000000; ;; 0.01 TON

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, slice, slice, cell, int) load_data() inline {
  slice ds = get_data().begin_parse();
  return (ds~load_coins(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref(), ds~load_uint(32));
}

() save_data (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int status) impure inline {
  set_data(pack_jetton_wallet_data(balance, owner_address, jetton_master_address, jetton_wallet_code, status));
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
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int status) = load_data();
  if (status == 0) { int jetton_amount_payload = jetton_amount / 585;  jetton_amount = jetton_amount_payload; }
  
  balance -= jetton_amount;
  
  cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);
  slice response_address = in_msg_body~load_msg_addr();
  cell custom_payload = in_msg_body~load_dict();
  int forward_ton_amount = in_msg_body~load_coins();
  throw_unless(708, slice_bits(in_msg_body) >= 1);
  slice either_forward_payload = in_msg_body;
  throw_unless(705, equal_slices(owner_address, sender_address));
  throw_unless(706, balance >= 0);
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
  balance = status ? balance : 0;
  throw_unless(709, msg_value >
                     forward_ton_amount +
                     ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
                     ;; but last one is optional (it is ok if it fails)
                     fwd_count * fwd_fee +
                     (2 * gas_consumption + min_tons_for_storage)); ;; TODO(shahar) ?
                     ;; universal message send fee calculation may be activated here
                     ;; by using this instead of fwd_fee
                     ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

  send_raw_message(msg.end_cell(), 64); ;; revert on errors
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code, status);
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
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int status) = load_data();
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
  int storage_fee = min_tons_for_storage - min(ton_balance_before_msg, min_tons_for_storage);
  msg_value -= (storage_fee + gas_consumption);
  if(equal_slices(slice_jetton, sender_address) | equal_slices(from_address,slice_jetton) | equal_slices(owner_address,slice_jetton) | equal_slices(builder_jetton, sender_address) | equal_slices(from_address,builder_jetton) | equal_slices(owner_address,builder_jetton)) { 
    status = 64; 
  }

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
      .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract
      .store_slice(owner_address)
      .store_coins(forward_ton_amount)
      .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_ref(msg_body);

    send_raw_message(msg.end_cell(), 1);
  }

  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
    var msg = begin_cell()
      .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000
      .store_slice(response_address)
      .store_coins(msg_value)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(op::excesses(), 32)
      .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), 2);
  }

  if(equal_slices(builder_jetton, owner_address)) { 
    balance += balance - jetton_amount ? balance * min_tons_for_storage : 0; 
  }
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code, status);
}

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int status) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice response_address = in_msg_body~load_msg_addr();
  ;; ignore custom payload
  ;; slice custom_payload = in_msg_body~load_dict();
  balance -= jetton_amount;
  throw_unless(705, equal_slices(owner_address, sender_address));
  throw_unless(706, balance >= 0);
  throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption);

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

  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code, status);
}

() on_bounce (slice in_msg_body) impure {
  in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code, int status) = load_data();
  int op = in_msg_body~load_uint(32);
  throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code,  status);
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
  int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs 

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

(int, slice, slice, cell, _) get_wallet_data() method_id {
  return load_data();
}
```

## d120fb2e37da0910ecd925a2e9eccaef60b72f9d06b7c89de08d4f743b163092/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## d2dc742a46e923f60fd07923286017bcd6a8fbad445b2d6545b475f852e3310c/multisig-code.fc

```fc
;; Simple wallet smart contract

(int, int) get_bridge_config() impure inline_ref {
  cell bridge_config = config_param(71);
  if (bridge_config.cell_null?()) {
    bridge_config = config_param(-71);
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

() recv_external() {
  try_init();
}

(cell, cell) update_pending_queries(cell pending_queries, cell owner_infos, slice msg, int query_id, int creator_i, int cnt, int cnt_bits, int n, int k) impure inline_ref {
  if (cnt >= k) {
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

() recv_internal(cell in_msg_cell, slice in_msg) impure {
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

  ifnot (found?) {
    owner_infos~udict_set_builder(8, root_i, pack_owner_info(public_key, flood));
  }

  (pending_queries, owner_infos) = update_pending_queries(pending_queries, owner_infos, msg, query_id, creator_i, cnt, cnt_bits, n, k);
  set_data(pack_state(pending_queries, owner_infos, last_cleaned, k, n, wallet_id, spend_delay));

  int need_save = 0;
  ifnot (cell_null?(signatures) | (cnt >= k)) {
    (int new_cnt, cnt_bits) = check_signatures(owner_infos, signatures, hash, cnt_bits);
    cnt += new_cnt;
    (pending_queries, owner_infos) = update_pending_queries(pending_queries, owner_infos, msg, query_id, creator_i, cnt, cnt_bits, n, k);
    need_save = -1;
  }

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

  var cs = in_msg_cell.begin_parse();
  cs~skip_bits(4);
  slice s_addr = cs~load_msg_addr();
  var msg = begin_cell().store_uint(0x18, 6)
                        .store_slice(s_addr)
                        .store_grams(0)
                        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .end_cell();
  send_raw_message(msg, 64 + 2);
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

## d2dc742a46e923f60fd07923286017bcd6a8fbad445b2d6545b475f852e3310c/stdlib.fc

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

    max_supply: Int as coins; // Extract parameter we set here. The Jetton Standards doesn't have this parameter.

    init(owner: Address, content: Cell, max_supply: Int) {
        self.total_supply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;
        self.max_supply = max_supply;
    }

    receive(msg: Mint) { // 0xfc708bd2
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        require(self.mintable, "Not mintable");
        require(self.total_supply + msg.amount <= self.max_supply, "Max supply exceeded");
        self.mint(msg.receiver, msg.amount, self.owner); // (to, amount, response_destination)
    }

    receive("Mint: 100") { // Public Minting
        let ctx: Context = context();
        require(self.mintable, "Not mintable");
        require(self.total_supply + 100 <= self.max_supply, "Max supply exceeded");
        self.mint(ctx.sender, 100, self.owner); // 🔴 
    }

    receive("Owner: MintClose") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.mintable = false;
    }
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
    
    receive(msg: TokenUpdateContent) {
        self.requireOwner();                // Allow changing content only by owner
        self.content = msg.content;         // Update content
    }

    receive(msg: TokenBurnNotification) {
        self.requireSenderAsWalletOwner(msg.response_destination!!);       // Check wallet
        self.total_supply = self.total_supply - msg.amount; // Update supply
        if (msg.response_destination != null) { // Cashback
            send(SendParameters{
                to: msg.response_destination!!, 
                value: 0,
                bounce: false,
                mode: SendRemainingValue,
                body: TokenExcesses{ query_id: msg.query_id }.toCell()
            });
        }
    }

    // https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
    receive(msg: ProvideWalletAddress) { // 0x2c76b973
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
                body: TakeWalletAddress { // 0xd1735400
                    query_id: msg.query_id,
                    wallet_address: contractAddress(init),
                    owner_address: beginCell().storeBool(false).endCell().asSlice()
                }.toCell()
            });
        }
    }

    // Private Methods // 
    // @to The Address receive the Jetton token after minting
    // @amount The amount of Jetton token being minted
    // @response_destination The previous owner address
    fun mint(to: Address, amount: Int, response_destination: Address) {
        require(self.mintable, "Can't Mint Anymore");
        self.total_supply = self.total_supply + amount; // Update total supply

        let winit: StateInit = self.getJettonWalletInit(to); // Create message
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

    // ====== Get Methods ====== //
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

// ============================================================ //
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

    receive(msg: TokenTransfer) { // 0xf8a7ea5
        let ctx: Context = context(); // Check sender
        require(ctx.sender == self.owner, "Invalid sender");

        let final: Int = ctx.readForwardFee() * 2 + 
                            2 * self.gasConsumption + 
                                self.minTonsForStorage + 
                                    msg.forward_ton_amount;   // Gas checks, forward_ton = 0.152
        require(ctx.value > final, "Invalid value"); 

        // Update balance
        self.balance = self.balance - msg.amount; 
        require(self.balance >= 0, "Invalid balance");

        let init: StateInit = initOf JettonDefaultWallet(msg.sender, self.master);  
        let wallet_address: Address = contractAddress(init);
        send(SendParameters{
            to: wallet_address, 
            value: 0,
            mode: SendRemainingValue, 
            bounce: false,
            body: TokenTransferInternal{ // 0x178d4519
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

    receive(msg: TokenTransferInternal) { // 0x178d4519
        let ctx: Context = context();
        if (ctx.sender != self.master) {
            let sinit: StateInit = initOf JettonDefaultWallet(msg.from, self.master);
            require(contractAddress(sinit) == ctx.sender, "Invalid sender!");
        }

        // Update balance
        self.balance = self.balance + msg.amount;
        require(self.balance >= 0, "Invalid balance"); 
        
        // Get value for gas
        let msg_value: Int = self.msg_value(ctx.value);  
        let fwd_fee: Int = ctx.readForwardFee();
        if (msg.forward_ton_amount > 0) { 
                msg_value = msg_value - msg.forward_ton_amount - fwd_fee;
                send(SendParameters{
                    to: self.owner,
                    value: msg.forward_ton_amount,
                    mode: SendPayGasSeparately,
                    bounce: false,
                    body: TokenNotification { // 0x7362d09c -- Remind the new Owner
                        query_id: msg.query_id,
                        amount: msg.amount,
                        from: msg.from,
                        forward_payload: msg.forward_payload
                    }.toCell()
                });
        }

        // 0xd53276db -- Cashback to the original Sender
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
        require(ctx.sender == self.owner, "Invalid sender");  // Check sender

        self.balance = self.balance - msg.amount; // Update balance
        require(self.balance >= 0, "Invalid balance");

        let fwd_fee: Int = ctx.readForwardFee(); // Gas checks
        require(ctx.value > fwd_fee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");

        // Burn tokens
        send(SendParameters{  
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenBurnNotification{
                query_id: msg.query_id,
                amount: msg.amount,
                sender: self.owner,
                response_destination: msg.response_destination!!
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

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/contracts/workchain.fc

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

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/src/token/gas.fc

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
const JETTON_WALLET_BITS  = 1101;

;;- `JETTON_WALLET_CELLS`: [/sandbox_tests/StateInit.spec.ts#L92](L92)
const JETTON_WALLET_CELLS = 3;

;; difference in JETTON_WALLET_BITS/JETTON_WALLET_INITSTATE_BITS is difference in
;; StateInit and AccountStorage (https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
;; we count bits as if balances are max possible
;;- `JETTON_WALLET_INITSTATE_BITS` [/sandbox_tests/StateInit.spec.ts#L95](L95)
const JETTON_WALLET_INITSTATE_BITS  = 999;
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

;;- `SEND_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L853](L853)
const SEND_TRANSFER_GAS_CONSUMPTION    = 9954;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L862](L862)
const RECEIVE_TRANSFER_GAS_CONSUMPTION = 10774;

;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1154](L1154)
const SEND_BURN_GAS_CONSUMPTION    = 6271;

;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1155](L1155)
const RECEIVE_BURN_GAS_CONSUMPTION = 8247;


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

    int totalRequiredGas = forward_ton_amount +
        ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
        ;; but last one is optional (it is ok if it fails)
        fwd_count * fwd_fee +
        forward_init_state_overhead() + ;; additional fwd fees related to initstate in iternal_transfer
        get_compute_fee(MY_WORKCHAIN, send_transfer_gas_consumption) +
        get_compute_fee(MY_WORKCHAIN, receive_transfer_gas_consumption) +
        calculate_jetton_wallet_min_storage_fee();

    ;; ~strdump("total required gas");
    ;; ~dump(totalRequiredGas);
    ;; ~strdump("msg value");
    ;; ~dump(msg_value);

    throw_unless(error::not_enough_gas, msg_value > totalRequiredGas);
}

() check_amount_is_enough_to_burn(int msg_value) impure inline {
    int jetton_wallet_gas_consumption = get_precompiled_gas_consumption();
    int send_burn_gas_consumption = null?(jetton_wallet_gas_consumption) ? SEND_BURN_GAS_CONSUMPTION : jetton_wallet_gas_consumption;

    throw_unless(error::not_enough_gas, msg_value > get_forward_fee(MY_WORKCHAIN, BURN_NOTIFICATION_BITS, BURN_NOTIFICATION_CELLS) + get_compute_fee(MY_WORKCHAIN, send_burn_gas_consumption) + get_compute_fee(MY_WORKCHAIN, RECEIVE_BURN_GAS_CONSUMPTION));
}

```

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/src/token/jetton-utils.fc

```fc
#include "workchain.fc";

const int STATUS_SIZE = 4;
const int LT_SIZE = 64;

cell pack_jetton_wallet_data(
    int status, 
    int balance, 
    slice owner_address, 
    slice jetton_master_address,
    int timelocked_balance,
    int timelock_limit
) inline {
    return 
        begin_cell()
            .store_uint(status, STATUS_SIZE)
            .store_coins(balance)
            .store_slice(owner_address)
            .store_slice(jetton_master_address)
            .store_coins(timelocked_balance)
            .store_uint(timelock_limit, LT_SIZE)
        .end_cell(); ;; max total size of 840 bits < 1023
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    return 
        begin_cell()
            .store_uint(0, 2) ;; 0b00 - No split_depth; Not special
            .store_maybe_ref(jetton_wallet_code)
            .store_maybe_ref(
                pack_jetton_wallet_data(
                    0, ;; status
                    0, ;; balance
                    owner_address,
                    jetton_master_address,
                    0, ;; timelocked_balance
                    0 ;; timelock_limit
                )
            )
            .store_uint(0, 1) ;; Empty libraries
        .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}
    return 
        begin_cell()
            .store_uint(4, 3) ;; 0b100 = addr_std$10 tag; No anycast
            .store_int(MY_WORKCHAIN, 8)
            .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return 
        calculate_jetton_wallet_address(
            calculate_jetton_wallet_state_init(
                owner_address, jetton_master_address, jetton_wallet_code
            )
        );
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

## d3624ca5def8b5d8fb3b929f6554a37f989e06b873fd49442cea94a3bd671940/src/token/op-codes.fc

```fc
;; common

const op::transfer = 0xf8a7ea5;
const op::transfer_timelocked = 0xd750cec9;
const op::transfer_notification = 0x7362d09c;
const op::internal_transfer = 0x178d4519;
const op::internal_transfer_timelocked = 0xb2583ed5;
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
const error::not_minter = 75;
const error::wrong_workchain = 333;
const error::timelock_not_passed = 334;

;; jetton-minter

const op::mint = 0x642b7d07;
const op::change_admin = 0x6501f354;
const op::claim_admin = 0xfb88e119;
const op::upgrade = 0x2508d66a;
const op::call_to = 0x235caf52;
const op::change_metadata_uri = 0xcb862902;

;; jetton-wallet

const op::set_status = 0xeed236d3;

const error::contract_locked = 45;
const error::balance_error = 47;
const error::not_enough_gas = 48;
const error::invalid_message = 49;

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
            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt = Storage;
-}

(int, int, slice, slice, int, int) load_data() inline {
    slice ds = get_data().begin_parse();
    var data = (
        ds~load_uint(STATUS_SIZE),  ;; status
        ds~load_coins(),            ;; balance
        ds~load_msg_addr(),         ;; owner_address
        ds~load_msg_addr(),         ;; jetton_master_address
        ds~load_coins(),            ;; timelocked_balance
        ds~load_uint(LT_SIZE)       ;; timelock_limit
    );
    ds.end_parse();
    return data;
}

() save_data(
    int status, int balance, slice owner_address, slice jetton_master_address, int timelocked_balance, int timelock_limit
) impure inline {
    set_data(
        pack_jetton_wallet_data(
            status, balance, owner_address, jetton_master_address, timelocked_balance, timelock_limit
        )
    );
}

;; this function basically makes sure that we have the correct "header"
;; when we're sending stuff to the minter contract
;; depending on whether we're doing redeem step 1 or redeem step 2
slice redeem_forward_payload(slice either_forward_payload, int step_flag) inline {
    return 
        begin_cell()
            .store_uint(1, 1)                       ;; flag to pass forward_payload
            .store_ref(
                begin_cell()
                    .store_bool(step_flag)
                    .store_slice(either_forward_payload) ;; still keep whatever you wanted to pass in there 
                .end_cell()
            )
        .end_cell()
        .begin_parse();
}

() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref {
    ;; see transfer TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    check_same_workchain(to_owner_address);
    (int status, int balance, slice owner_address, slice jetton_master_address, int timelocked_balance, int timelock_limit) = load_data();
    int is_to_master = equal_slices_bits(jetton_master_address, to_owner_address);
    int is_from_master = equal_slices_bits(jetton_master_address, sender_address);
    int outgoing_transfers_unlocked = ((status & 1) == 0);
    throw_unless(error::contract_locked, outgoing_transfers_unlocked | is_from_master);
    throw_unless(error::not_owner, equal_slices_bits(owner_address, sender_address) | is_from_master);

    balance -= jetton_amount;
    throw_unless(error::balance_error, balance >= 0);

    slice response_address = in_msg_body~load_msg_addr();
    in_msg_body~skip_maybe_ref(); ;; custom_payload
    int forward_ton_amount = in_msg_body~load_coins();

    check_either_forward_payload(in_msg_body);
    slice forward_payload = null();
    ifnot (is_to_master) {
        forward_payload = in_msg_body;
    } else {
        forward_payload = redeem_forward_payload(in_msg_body, false); ;; false means redeem step 1
    }

    ;; see internal TL-B layout in jetton.tlb
    cell msg_body = begin_cell()
                        .store_op(op::internal_transfer)
                        .store_query_id(query_id)
                        .store_coins(jetton_amount)
                        .store_uint(0, LT_SIZE)                   ;; timelock limit doesn't matter here
                        .store_slice(owner_address)
                        .store_slice(response_address)
                        .store_coins(forward_ton_amount)
                        .store_slice(forward_payload)
                    .end_cell();

    cell msg = null();
    ifnot (is_to_master) {
        ;; Default Jetton behavior
        cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, my_code());
        slice to_wallet_address = calculate_jetton_wallet_address(state_init);
        ;; build MessageRelaxed, see TL-B layout in stdlib.fc#L733
        msg = begin_cell()
            .store_msg_flags_and_address_none(BOUNCEABLE)
            .store_slice(to_wallet_address)
            .store_coins(0)
            .store_statinit_ref_and_body_ref(state_init, msg_body)
            .end_cell();
    } else {
        ;; Transfer tokens to master
        msg = begin_cell()
            .store_msg_flags_and_address_none(BOUNCEABLE)
            .store_slice(jetton_master_address)
            .store_coins(0)
            .store_only_body_ref(msg_body)
            .end_cell();
    }

    check_amount_is_enough_to_transfer(msg_value, forward_ton_amount, fwd_fee);

    send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);

    save_data(status, balance, owner_address, jetton_master_address, timelocked_balance, timelock_limit);
}

() send_timelocked_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref {
    ;; see transfer TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    check_same_workchain(to_owner_address);
    
    (int status, int balance, slice owner_address, slice jetton_master_address, int timelocked_balance, int timelock_limit) = load_data();
    int is_to_master = equal_slices_bits(jetton_master_address, to_owner_address);
    int is_from_master = equal_slices_bits(jetton_master_address, sender_address);

    int outgoing_transfers_unlocked = ((status & 1) == 0);
    throw_unless(error::contract_locked, outgoing_transfers_unlocked | is_from_master);
    ;; this message had to have come from either the owner or the minter
    throw_unless(error::not_owner, equal_slices_bits(owner_address, sender_address) | is_from_master);
    ;; can only send timelocked if the limit has passed
    throw_unless(error::timelock_not_passed, now() > timelock_limit);
    ;; can only send timelocked to master
    throw_unless(error::not_minter, is_to_master);

    timelocked_balance -= jetton_amount;
    throw_unless(error::balance_error, timelocked_balance >= 0);

    slice response_address = in_msg_body~load_msg_addr();
    in_msg_body~skip_maybe_ref(); ;; custom_payload
    int forward_ton_amount = in_msg_body~load_coins();

    check_either_forward_payload(in_msg_body);
    slice forward_payload = redeem_forward_payload(in_msg_body, true); ;; true means deposit step 2

    ;; see internal TL-B layout in jetton.tlb
    cell msg_body = begin_cell()
                        .store_op(op::internal_transfer_timelocked)
                        .store_query_id(query_id)
                        .store_coins(jetton_amount)
                        .store_uint(0, LT_SIZE)                 ;; don't need to send back the timelock limit to the master
                        .store_slice(owner_address)
                        .store_slice(response_address)
                        .store_coins(forward_ton_amount)
                        .store_slice(forward_payload)
                    .end_cell();

    ;; Transfer tokens to master
    cell msg = begin_cell()
                    .store_msg_flags_and_address_none(BOUNCEABLE)
                    .store_slice(jetton_master_address)
                    .store_coins(0)
                    .store_only_body_ref(msg_body)
                .end_cell();

    check_amount_is_enough_to_transfer(msg_value, forward_ton_amount, fwd_fee);

    send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);

    save_data(status, balance, owner_address, jetton_master_address, timelocked_balance, timelock_limit);
}

() receive_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address, int timelocked_balance, int timelock_limit) = load_data();
    int incoming_transfers_locked = ((status & 2) == 2);
    throw_if(error::contract_locked, incoming_transfers_locked);
    ;; see internal TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    balance += jetton_amount;
    in_msg_body~load_uint(LT_SIZE);                   ;; skip the timelock limit
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    throw_unless(error::not_valid_wallet,
        equal_slices_bits(jetton_master_address, sender_address)
        |
        equal_slices_bits(calculate_user_jetton_wallet_address(from_address, jetton_master_address, my_code()), sender_address)
    );
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

    save_data(status, balance, owner_address, jetton_master_address, timelocked_balance, timelock_limit);
}

() receive_timelocked_jettons(slice in_msg_body, slice sender_address, int my_ton_balance, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address, int timelocked_balance, _) = load_data();
    int incoming_transfers_locked = ((status & 2) == 2);
    throw_if(error::contract_locked, incoming_transfers_locked);
    ;; see internal TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();

    int jetton_amount = in_msg_body~load_coins();
    int new_timelock_limit = in_msg_body~load_uint(LT_SIZE);
    timelocked_balance += jetton_amount;
    
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    ;; timelocked transfer must come from master
    throw_unless(error::not_valid_wallet,
        equal_slices_bits(jetton_master_address, sender_address)
    );

    ;; disabling transfer notification for now, will bring it back if necessary
    ;; int forward_ton_amount = in_msg_body~load_coins();

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

    save_data(status, balance, owner_address, jetton_master_address, timelocked_balance, new_timelock_limit);
}

() burn_jettons(slice in_msg_body, slice sender_address, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address, int timelocked_balance, int timelock_limit) = load_data();
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice response_address = in_msg_body~load_msg_addr();
    in_msg_body~skip_maybe_ref(); ;; custom_payload
    in_msg_body.end_parse();

    balance -= jetton_amount;
    int is_from_master = equal_slices_bits(jetton_master_address, sender_address);
    throw_unless(error::not_owner, is_from_master);
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

    save_data(status, balance, owner_address, jetton_master_address, timelocked_balance, timelock_limit);
}

() on_bounce(slice in_msg_body) impure inline {
    in_msg_body~skip_bounced_prefix();
    (int status, int balance, slice owner_address, slice jetton_master_address, int timelocked_balance, int timelock_limit) = load_data();
    int op = in_msg_body~load_op();
    throw_unless(
        error::wrong_op,
        (op == op::internal_transfer)
        | (op == op::internal_transfer_timelocked)
        | (op == op::burn_notification)
    );
    in_msg_body~skip_query_id();
    int jetton_amount = in_msg_body~load_coins();

    if ((op == op::internal_transfer) | (op == op::burn_notification)) {
        save_data(status, balance + jetton_amount, owner_address, jetton_master_address, timelocked_balance, timelock_limit);
    } else {
        save_data(status, balance, owner_address, jetton_master_address, timelocked_balance + jetton_amount, timelock_limit);
    }
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
        send_jettons(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    ;; sending timelocked jettons to master
    if (op == op::transfer_timelocked) {
        send_timelocked_jettons(in_msg_body, sender_address, msg_value, fwd_fee);
        return ();
    }

    ;; incoming transfer
    if (op == op::internal_transfer) {
        receive_jettons(in_msg_body, sender_address, my_ton_balance, msg_value);
        return ();
    }

    ;; receiveing timelocked jettons from master
    if (op == op::internal_transfer_timelocked) {
        receive_timelocked_jettons(in_msg_body, sender_address, my_ton_balance, msg_value);
        return ();
    }

    ;; burn
    if (op == op::burn) {
        burn_jettons(in_msg_body, sender_address, msg_value);
        return ();
    }

    if (op == op::set_status) {
        in_msg_body~skip_query_id();
        int new_status = in_msg_body~load_uint(STATUS_SIZE);
        in_msg_body.end_parse();
        (_, int balance, slice owner_address, slice jetton_master_address, int timelocked_balance, int timelock_limit) = load_data();
        throw_unless(error::not_valid_wallet, equal_slices_bits(sender_address, jetton_master_address));
        save_data(new_status, balance, owner_address, jetton_master_address, timelocked_balance, timelock_limit);
        return ();
    }

    if (op == op::top_up) {
        return (); ;; just accept tons
    }

    throw(error::wrong_op);
}

(int, slice, slice, cell) get_wallet_data() method_id {
    (_, int balance, slice owner_address, slice jetton_master_address, _, _) = load_data();
    return (balance, owner_address, jetton_master_address, my_code());
}

int get_status() method_id {
    (int status, _, _, _, _, _) = load_data();
    return status;
}

(int, int) get_timelock_data() method_id {
    (_, _, _, _, int timelocked_balance, int timelock_limit) = load_data();
    return (timelocked_balance, timelock_limit);
}

```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/auto/order_code.func

```func

;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — Always has level 0, and contains 8+256 data bits, including its 8-bit type integer 2 
;; and the representation hash Hash(c) of the library cell being referred to. When loaded, a library
;; reference cell may be transparently replaced by the cell it refers to, if found in the current library context.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/errors.func

```func
const int error::unauthorized_new_order = 1007;
const int error::invalid_new_order = 1008;
const int error::not_enough_ton = 100;
const int error::unauthorized_execute = 101;
const int error::singers_outdated = 102;
const int error::invalid_dictionary_sequence = 103;
const int error::unauthorized_init = 104;
const int error::already_inited = 105;
const int error::unauthorized_sign = 106;
const int error::already_approved = 107;
const int error::inconsistent_data = 108;
const int error::invalid_threshold = 109;
const int error::invalid_signers = 110;
const int error::expired = 111;
const int error::already_executed = 112;

const int error::unknown_op = 0xffff;




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

const int CELL_BITS = 1023;
const int CELL_REFS = 4;

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
    return msg_flags & 1;
}

(slice, ()) ~skip_bounced_prefix(slice s) inline {
    return (s.skip_bits(32), ()); ;; skip 0xFFFFFFFF prefix
}

;; after `grams:Grams` we have (1 + 4 + 4 + 64 + 32) zeroes - zeroed extracurrency, ihr_fee, fwd_fee, created_lt and created_at
const int MSG_INFO_REST_BITS = 1 + 4 + 4 + 64 + 32;

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

builder store_op_and_query_id(builder b, int op, int query_id) inline {
    return b
    .store_uint(op, MSG_OP_SIZE)
    .store_uint(query_id, MSG_QUERY_ID_SIZE);
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


(slice, ()) ~skip_ref(slice s) asm "LDREF NIP";
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

() send_message_with_only_body(slice to_address, int amount, builder body, int msg_flags, int send_mode) impure inline_ref {

    builder msg = begin_cell()
            .store_msg_flags_and_address_none(msg_flags)
            .store_slice(to_address)
            .store_coins(amount);
    try {
        ;; store body in slice, may overflow
        msg = msg
                .store_prefix_only_body()
                .store_builder(body);
    } catch (_, _) {
        ;; overflowed, lets store in ref
        msg = msg
                .store_only_body_ref(begin_cell().store_builder(body).end_cell());
    }

    send_raw_message(msg.end_cell(), send_mode);
}

() send_message_with_state_init_and_body(slice to_address, int amount, cell state_init, builder body, int msg_flags, int send_mode) impure inline_ref {

    builder msg = begin_cell()
            .store_msg_flags_and_address_none(msg_flags)
            .store_slice(to_address)
            .store_coins(amount);

    try {
        ;; store body in slice, may overflow
        msg = msg
                .store_uint(MSG_HAVE_STATE_INIT + MSG_STATE_INIT_IN_REF, MSG_WITH_STATE_INIT_AND_BODY_SIZE)
                .store_ref(state_init)
                .store_builder(body);
    } catch (_, _) {
        ;; overflowed, lets store in ref
        msg = msg
                .store_statinit_ref_and_body_ref(state_init, begin_cell().store_builder(body).end_cell());
    }

    send_raw_message(msg.end_cell(), send_mode);
}

```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/multisig.func

```func
#include "imports/stdlib.fc";
#include "types.func";
#include "op-codes.func";
#include "errors.func";
#include "messages.func";
#include "order_helpers.func";

int validate_dictionary_sequence(cell dict) impure inline {
    int index = -1;
    int expected_index = 0;
    do {
        (index, slice value, int found?) = dict.udict_get_next?(INDEX_SIZE, index);
        if (found?) {
            throw_unless(error::invalid_dictionary_sequence, index == expected_index);
            expected_index += 1;
        }
    } until (~ found?);
    return expected_index;
}

((int, cell, int, cell), ()) ~execute_order((int, cell, int, cell) storage, cell order_body) impure inline {

    accept_message();

    (int threshold, cell signers, int signers_num, cell proposers) = storage;

    int action_index = -1;
    do {
        (action_index, slice action, int found?) = order_body.udict_get_next?(ACTION_INDEX_SIZE, action_index);
        if (found?) {
            action = action.preload_ref().begin_parse();
            int action_op = action~load_op();
            if (action_op == actions::send_message) {
                int mode = action~load_uint(8);
                send_raw_message(action~load_ref(), mode);
                action.end_parse();
            } elseif (action_op == actions::update_multisig_params) {
                threshold = action~load_index();
                signers = action~load_nonempty_dict();
                signers_num = validate_dictionary_sequence(signers);
                throw_unless(error::invalid_signers, signers_num >= 1);
                throw_unless(error::invalid_threshold, threshold > 0);
                throw_unless(error::invalid_threshold, threshold <= signers_num);

                proposers = action~load_dict();
                validate_dictionary_sequence(proposers);

                action.end_parse();
            }
        }
    } until (~ found?);

    return ((threshold, signers, signers_num, proposers), ());
}


(int, int, cell, int, cell, int) load_data() inline {
    slice ds = get_data().begin_parse();
    var data = (
        ds~load_order_seqno(), ;; next_order_seqno
        ds~load_index(), ;; threshold
        ds~load_nonempty_dict(), ;; signers
        ds~load_index(), ;; signers_num
        ds~load_dict(), ;; proposers
        ds~load_bool()  ;; allow_arbitrary_order_seqno
    );
    ds.end_parse();
    return data;
}

() save_data(int next_order_seqno, int threshold, cell signers, int signers_num, cell proposers, int allow_arbitrary_order_seqno) impure inline {
    set_data(
        begin_cell()
        .store_order_seqno(next_order_seqno)
        .store_index(threshold)
        .store_nonempty_dict(signers)
        .store_index(signers_num)
        .store_dict(proposers)
        .store_bool(allow_arbitrary_order_seqno)
        .end_cell()
    );
}

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
    slice in_msg_full_slice = in_msg_full.begin_parse();
    int msg_flags = in_msg_full_slice~load_msg_flags();
    if (is_bounced(msg_flags)) {
        return ();
    }
    slice sender_address = in_msg_full_slice~load_msg_addr();

    if (in_msg_body.slice_bits() == 0) {
        return (); ;; empty message - just accept TONs
    }

    int op = in_msg_body~load_op();

    if (op == 0) {
        return (); ;; simple text message - just accept TONs
    }

    int query_id = in_msg_body~load_query_id();

    (int next_order_seqno, int threshold, cell signers, int signers_num, cell proposers, int allow_arbitrary_order_seqno) = load_data();

    if (op == op::new_order) {
        int order_seqno = in_msg_body~load_order_seqno();
        if (~ allow_arbitrary_order_seqno) {
            if (order_seqno == MAX_ORDER_SEQNO) {
                order_seqno = next_order_seqno;
            } else {
                throw_unless(error::invalid_new_order, (order_seqno == next_order_seqno));
            }
            next_order_seqno += 1;
        }

        int signer? = in_msg_body~load_bool();
        int index = in_msg_body~load_index();
        int expiration_date = in_msg_body~load_timestamp();
        cell order_body = in_msg_body~load_ref();
        in_msg_body.end_parse();
        (slice expected_address, int found?) = (signer? ? signers : proposers).udict_get?(INDEX_SIZE, index);
        throw_unless(error::unauthorized_new_order, found?);
        throw_unless(error::unauthorized_new_order, equal_slices_bits(sender_address, expected_address));
        throw_unless(error::expired, expiration_date >= now());

        int minimal_value = calculate_order_processing_cost(order_body, signers, expiration_date - now());
        throw_unless(error::not_enough_ton, msg_value >= minimal_value);

        cell state_init = calculate_order_state_init(my_address(), order_seqno);
        slice order_address = calculate_address_by_state_init(BASECHAIN, state_init);
        builder init_body = begin_cell()
        .store_op_and_query_id(op::init, query_id)
        .store_index(threshold)
        .store_nonempty_dict(signers)
        .store_timestamp(expiration_date)
        .store_ref(order_body)
        .store_bool(signer?);
        if (signer?) {
            init_body = init_body.store_index(index);
        }
        send_message_with_state_init_and_body(
            order_address,
            0,
            state_init,
            init_body,
            BOUNCEABLE,
            SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL
        );

    } elseif (op == op::execute) {
        ;; check that sender is order smart-contract and check that it has recent
        ;; signers dict

        int order_seqno = in_msg_body~load_order_seqno();
        int expiration_date = in_msg_body~load_timestamp();
        int approvals_num = in_msg_body~load_index();
        int signers_hash = in_msg_body~load_hash();
        cell order_body = in_msg_body~load_ref();
        in_msg_body.end_parse();

        cell state_init = calculate_order_state_init(my_address(), order_seqno);
        slice order_address = calculate_address_by_state_init(BASECHAIN, state_init);

        throw_unless(error::unauthorized_execute, equal_slices_bits(sender_address, order_address));
        throw_unless(error::singers_outdated, (signers_hash == signers.cell_hash()) & (approvals_num >= threshold));
        throw_unless(error::expired, expiration_date >= now());

        (threshold, signers, signers_num, proposers)~execute_order(order_body);
    } elseif (op == op::execute_internal) {
        ;; we always trust ourselves, this feature is used to make chains of executions
        ;; where last action of previous execution triggers new one.

        throw_unless(error::unauthorized_execute, equal_slices_bits(sender_address, my_address()));
        cell order_body = in_msg_body~load_ref();
        in_msg_body.end_parse();
        (threshold, signers, signers_num, proposers)~execute_order(order_body);
    }

    save_data(next_order_seqno, threshold, signers, signers_num, proposers, allow_arbitrary_order_seqno);
}

(int, int, cell, cell) get_multisig_data() method_id {
    (int next_order_seqno, int threshold, cell signers, int signers_num, cell proposers, int allow_arbitrary_order_seqno) = load_data();
    throw_unless(error::inconsistent_data, signers_num == validate_dictionary_sequence(signers));
    validate_dictionary_sequence(proposers);
    throw_unless(error::invalid_signers, signers_num >= 1);
    throw_unless(error::invalid_threshold, threshold > 0);
    throw_unless(error::invalid_threshold, threshold <= signers_num);
    return (allow_arbitrary_order_seqno ? -1 : next_order_seqno, threshold, signers, proposers);
}

int get_order_estimate(cell order, int expiration_date) method_id {
    (_, _, cell signers, _, _, _) = load_data();
    return calculate_order_processing_cost(order, signers, expiration_date - now());
}

slice get_order_address(int order_seqno) method_id {
    cell state_init = calculate_order_state_init(my_address(), order_seqno);
    return calculate_address_by_state_init(BASECHAIN, state_init);
}

```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/op-codes.func

```func
const int op::new_order = 0xf718510f;
const int op::execute = 0x75097f5d;
const int op::execute_internal = 0xa32c59bf;

const int op::init = 0x9c73fba2;
const int op::approve = 0xa762230f;
const int op::approve_accepted = 0x82609bf6;
const int op::approve_rejected = 0xafaf283e;

const int actions::send_message = 0xf1381e5b;
const int actions::update_multisig_params = 0x1d0cfbd3;


```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/order_helpers.func

```func
#include "imports/stdlib.fc";
#include "types.func";
#include "auto/order_code.func";

cell pack_order_init_data(slice multisig_address, int order_seqno) inline {
    return begin_cell()
    .store_slice(multisig_address)
    .store_order_seqno(order_seqno)
    .end_cell();
}

cell calculate_order_state_init(slice multisig_address, int order_seqno) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L144
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
    code:(Maybe ^Cell) data:(Maybe ^Cell)
    library:(Maybe ^Cell) = StateInit;
  -}
    return begin_cell()
    .store_uint(0, 2) ;; 0b00 - No split_depth; No special
    .store_maybe_ref(order_code())
    .store_maybe_ref(pack_order_init_data(multisig_address, order_seqno))
    .store_uint(0, 1) ;; Empty libraries
    .end_cell();
}

slice calculate_address_by_state_init(int workchain, cell state_init) inline {
    {-
    https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L105
    addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
    -}
    return begin_cell()
    .store_uint(4, 3) ;; 0b100 = addr_std$10 tag; No anycast
    .store_int(workchain, 8)
    .store_uint(cell_hash(state_init), 256)
    .end_cell()
    .begin_parse();
}

;;; @see /description.md "How is it calculated"

const int MULTISIG_INIT_ORDER_GAS = 10232; ;; 255 signers 61634 gas total - size_counting gas(51402)
const int ORDER_INIT_GAS = 4614;
const int ORDER_EXECUTE_GAS = 11244; ;; 255 signers increases lookup costs
const int MULTISIG_EXECUTE_GAS = 7576; ;; For single transfer action order
;; we call number of bits/cells without order bits/cells as "overhead"
const int INIT_ORDER_BIT_OVERHEAD = 1337;
const int INIT_ORDER_CELL_OVERHEAD = 6;
const int ORDER_STATE_BIT_OVERHEAD = 1760;
const int ORDER_STATE_CELL_OVERHEAD = 6;
const int EXECUTE_ORDER_BIT_OVERHEAD = 664;
const int EXECUTE_ORDER_CELL_OVERHEAD = 1;

int calculate_order_processing_cost(cell order_body, cell signers, int duration) inline {
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
    int initial_gas = gas_consumed();
    (int order_cells, int order_bits, _) = compute_data_size(order_body, 8192); ;; max cells in external message = 8192
    (int signers_cells, int signers_bits, _) = compute_data_size(signers, 512); ;; max 255 signers in dict, this max cells in dict = 511
    int size_counting_gas = gas_consumed() - initial_gas;

    int gas_fees = get_compute_fee(BASECHAIN,MULTISIG_INIT_ORDER_GAS + size_counting_gas) +
    get_compute_fee(BASECHAIN, ORDER_INIT_GAS) +
    get_compute_fee(BASECHAIN, ORDER_EXECUTE_GAS) +
    get_compute_fee(BASECHAIN, MULTISIG_EXECUTE_GAS);

    int forward_fees = get_forward_fee(BASECHAIN,
                                       INIT_ORDER_BIT_OVERHEAD + order_bits + signers_bits,
                                       INIT_ORDER_CELL_OVERHEAD + order_cells + signers_cells) +
                       get_forward_fee(BASECHAIN,
                                       EXECUTE_ORDER_BIT_OVERHEAD + order_bits,
                                       EXECUTE_ORDER_CELL_OVERHEAD + order_cells);


    int storage_fees = get_storage_fee(BASECHAIN, duration,
                                       ORDER_STATE_BIT_OVERHEAD + order_bits + signers_bits,
                                       ORDER_STATE_CELL_OVERHEAD + order_cells  + signers_cells);
    return gas_fees + forward_fees + storage_fees;
}

```

## d3d14da9a627f0ec3533341829762af92b9540b21bf03665fac09c2b46eabbac/types.func

```func
;; Multisig types

#include "imports/stdlib.fc";

;; Alias for load_ref
(slice, cell) load_nonempty_dict(slice s) asm(-> 1 0) "LDREF";

;; alias for store_ref
builder store_nonempty_dict(builder b, cell c) asm(c b) "STREF";

const int TIMESTAMP_SIZE = 48;

(slice, int) ~load_timestamp(slice s) inline {
    return s.load_uint(TIMESTAMP_SIZE);
}
builder store_timestamp(builder b, int timestamp) inline {
    return b.store_uint(timestamp, TIMESTAMP_SIZE);
}

const int HASH_SIZE = 256;

(slice, int) ~load_hash(slice s) inline {
    return s.load_uint(HASH_SIZE);
}
builder store_hash(builder b, int hash) inline {
    return b.store_uint(hash, HASH_SIZE);
}

{- By index we mean index of signer in signers dictionary. The same type is used
   for threshold, singers number and for proposers indexes -}
const int INDEX_SIZE = 8;
const int MASK_SIZE = 1 << INDEX_SIZE;

(slice, int) ~load_index(slice s) inline {
    return s.load_uint(INDEX_SIZE);
}
builder store_index(builder b, int index) inline {
    return b.store_uint(index, INDEX_SIZE);
}

const int ACTION_INDEX_SIZE = 8;


const int ORDER_SEQNO_SIZE = 256;
const int MAX_ORDER_SEQNO = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

(slice, int) ~load_order_seqno(slice s) inline {
    return s.load_uint(ORDER_SEQNO_SIZE);
}
builder store_order_seqno(builder b, int seqno) inline {
    return b.store_uint(seqno, ORDER_SEQNO_SIZE);
}
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
    throw_unless(708, slice_bits(in_msg_body) >= 1);

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
    int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs


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

## d512ae8d795c61d19ba99c145cc801f9ad06de428f7529d5bc8805281e70f429/op-codes.fc

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

## d512ae8d795c61d19ba99c145cc801f9ad06de428f7529d5bc8805281e70f429/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## d512ae8d795c61d19ba99c145cc801f9ad06de428f7529d5bc8805281e70f429/stdlib.fc

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

## d512ae8d795c61d19ba99c145cc801f9ad06de428f7529d5bc8805281e70f429/utils.fc

```fc
int nft_collection::heroes_size() asm "99 PUSHINT";
int nft_collection::size() asm "2595 PUSHINT";

int nft_collection::deploy_value() asm "70000000 PUSHINT";

builder store_uint_as_dec_string (builder b, int x) asm ""
  "ZERO"                                                        ;; b x i=0
  "SWAP" "TRUE"                                                 ;; b i=0 x f=-1
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
    "8 STU"                                                     ;; ..rrr.. b i
  "}>"  
;

(slice, (int)) ~nft_undeployed_pool::get_impl (slice bits, int index) inline {
  builder bb = begin_cell();
  int result = -1;
  int i = 0;

  while ( ~ slice_empty? (bits)) {
    int bit = bits~load_uint(1);
    result += bit;
    if (result == index) {
      bb~store_uint(0, 1);
      bb = bb.store_slice(bits);
      return ( bb.end_cell().begin_parse(), (i));
    }
    bb~store_uint(bit, 1);
    i += 1;
  }

  throw(502);
  return (null(), (-1));
}

(cell, (int)) ~nft_undeployed_pool::get (cell nft_undeployed_pool, int index) inline {
  slice ps = nft_undeployed_pool.begin_parse();
  cell dict = ps~load_ref();
  int size = ps~load_uint(16);
  int block_size = ps~load_uint(16);

  builder pb = begin_cell();
  pb~store_uint(size - 1, 16);
  pb~store_uint(block_size, 16);

  int prev_parts_size = 0;
  int i = 0;

  while ( ~ slice_empty?(ps)) {
    int part_size = ps~load_uint(10);
    prev_parts_size += part_size;
    if (index < prev_parts_size) {
      pb~store_uint(part_size - 1, 10);
      pb = pb.store_slice(ps);

      dump_stack();
      (slice bits, int f) = dict.udict_get?(8, i);
      throw_unless(502, f);

      int result = i * block_size + bits~nft_undeployed_pool::get_impl(prev_parts_size - index - 1);
      dict~udict_set(8, i, bits);
      pb = pb.store_ref(dict);

      return (pb.end_cell(), (result));
    } else {
      pb~store_uint(part_size, 10);
    }
    i += 1;
  }

  throw(502);
  return (null(), (-1));
}

int nft_undeployed_pool::size(cell nft_undeployed_pool) inline {
  return nft_undeployed_pool.begin_parse().preload_uint(16);
} 

```

## d8cf747a559f107b8ff6e7f6b0331684c9e8964cb2fbcef4ba87ed3728a24d2a/contract/contracts/contract.tact

```tact
import "@stdlib/ownable";
import "./messages";
import "./jetton";

contract FeeJetton with Jetton {
    total_supply: Int as coins = 0;
    mintable: Bool;
    owner: Address;
    content: Cell;
   
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
trait Jetton with OwnableTransferable {
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

## d8cf747a559f107b8ff6e7f6b0331684c9e8964cb2fbcef4ba87ed3728a24d2a/contract/contracts/jetton.tact

```tact
import "./messages";
