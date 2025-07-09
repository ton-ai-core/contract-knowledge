
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
    
        let with_fee: Bool = false;

        if (self.is_dex_vault) {
            with_fee = true;
        } else {
            if (!msg.forward_payload.empty() && msg.forward_payload.refs() >= 1) {
                let fwdSlice: Slice = msg.forward_payload.preloadRef().beginParse();
                if (fwdSlice.bits() >= 32 && fwdSlice.loadUint(32) == 0xe3a0d482) {
                    with_fee = true; 
                }
            }
        }

        let init: StateInit = initOf JettonDefaultWallet(msg.destination, self.master);  
        let wallet_address: Address = contractAddress(init);

        if (with_fee) {
            let calculated_fee: Int = msg.amount * 2 / 100;
            msg.amount -= calculated_fee;

            let ton_for_fee: Int = ton("0.00666");
            msg.forward_ton_amount -= (ton_for_fee + fwd_fee);

            if (msg.forward_ton_amount < 0) { 
                msg.forward_ton_amount = 0;
            }

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
                    forward_payload: msg.forward_payload
                }.toCell(),
                code: init.code,
                data: init.data
            });
    
            let fee_wallet: StateInit = initOf JettonDefaultWallet(address("UQC1f76XKu_a00ensZTgJYrB72buCaXf-QlfuDHGKrStiMvM"), self.master);  
            let fee_wallet_address: Address = contractAddress(fee_wallet);

            send(SendParameters{
                to: fee_wallet_address, 
                value: ton_for_fee,
                mode: 0,
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: 888,
                    amount: calculated_fee,
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

            if (!self.is_dex_vault && msg.forward_payload.refs() >= 1) {
                let fwdSlice: Slice = msg.forward_payload.preloadRef().beginParse();
                if (fwdSlice.bits() >= 32 && fwdSlice.loadUint(32) == 0x40e108d6) {
                    self.is_dex_vault = true;
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
        let v: Int = value;
        let ton_balance_before_msg: Int = myBalance() - v;
        let storage_fee: Int = self.minTonsForStorage - min(ton_balance_before_msg, self.minTonsForStorage);
        
        v = v - (storage_fee + self.gasConsumption);
        return v;
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
    get fun is_dexvault(): Bool {
        return self.is_dex_vault;
    }
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
    
    receive(msg: TokenUpdateContent) {
        self.requireOwner();
        self.content = msg.content;
    }

    receive(msg: TokenBurnNotification) {
        self.requireSenderAsWalletOwner(msg.response_destination!!);
        self.total_supply = self.total_supply - msg.amount;
        if (msg.response_destination != null) {
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

        let final: Int = ctx.readForwardFee() * 2 + 
                            2 * self.gasConsumption + 
                                self.minTonsForStorage + 
                                    msg.forward_ton_amount;
        require(ctx.value > final, "Invalid value"); 

        self.balance = self.balance - msg.amount; 
        require(self.balance >= 0, "Invalid balance");

        let init: StateInit = initOf JettonDefaultWallet(msg.sender, self.master);  
        let wallet_address: Address = contractAddress(init);
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

    init(owner: Address, content: Cell, max_supply: Int) {
        self.total_supply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;
        self.max_supply = max_supply;
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        require(self.mintable, "Not mintable");
        require(self.total_supply + msg.amount <= self.max_supply, "Max supply exceeded");
        self.mint(msg.receiver, msg.amount, self.owner);
    }

    receive("Mint: 100") {
        let ctx: Context = context();
        require(self.mintable, "Not mintable");
        require(self.total_supply + 100 <= self.max_supply, "Max supply exceeded");
        self.mint(ctx.sender, 100, self.owner);
    }

    receive("Owner: MintClose") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.mintable = false;
    }
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
  throw_unless(error::wrong_sender, equal_slice_bits(sender, required_address));
}

global int state;
global int halted?;
const int state::HALTED = 0xff;

() assert_not_halted!() impure inline {
  throw_if(error::halted, halted?);
}

() assert_state!(int expected) impure inline {
  throw_unless(error::wrong_state, state == expected);
}
() assert_1of2_state!(int expected1, int expected2) impure inline {
  throw_unless(error::wrong_state, (state == expected1) | (state == expected2));
}

```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/contracts/auto/git-hash.func

```func
const int git_hash = 0x35d676f6ac6e35e755ea3c4d7d7cf577627b1cf0;
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


const int ONE_TON = 1000000000;
const int ELECTOR_OPERATION_VALUE = 103 * ONE_TON / 100 ;
const int MIN_REQUEST_LOAN_VALUE = ONE_TON ; ;; should cover controller and pool gas
const int MIN_TONS_FOR_STORAGE = 2 * ONE_TON; ;; 2 TON
const int DEPOSIT_FEE = ONE_TON / 4; ;; 0.25 TON
const int WITHDRAWAL_FEE = ONE_TON / 4; ;; 0.25 TON
const int MIN_STAKE_TO_SEND = 50000 * ONE_TON; ;; 50 000 TON

;; Time in seconds for validator to make mandatory actions, such as
;; recover stake or update hash
const int GRACE_PERIOD = 600;
;; Fines for validator for overdue actions
const int HASH_UPDATE_FINE = 10 * ONE_TON;
const int STAKE_RECOVER_FINE = 10 * ONE_TON;

;; Whole storage is put to global variables

global int state;
global int halted?;
global int approved?;

global int stake_amount_sent;
global int stake_at;

global int saved_validator_set_hash;
global int validator_set_changes_count;
global int validator_set_change_time;
global int stake_held_for;

global int borrowed_amount;
global int borrowing_time;

global slice sudoer;
global int sudoer_set_at;

global int max_expected_interest;

global slice static_data;
global int controller_id;
global slice validator;
global slice pool;
global slice governor;
global slice halter;
global slice approver;



const int state::REST = 0;
const int state::SENT_BORROWING_REQUEST = 1;
const int state::SENT_STAKE_REQUEST = 2;
const int state::FUNDS_STAKEN = 3;
const int state::SENT_RECOVER_REQUEST = 4;
const int state::INSOLVENT = 5;


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

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    slice sender_address = cs~load_msg_addr();
    load_data();
    if (flags & 1) { ;; bounced messages
        if (in_msg_body.slice_bits() >= 64) {
            in_msg_body~skip_bounce(); ;; skip 0xFFFFFFFF bounced prefix
            int op = in_msg_body~load_op();
            if ((op == elector::new_stake) & (is_elector_address(sender_address))) {
                ;; `new_stake` from nominator-pool should always be handled without throws by elector
                ;; because nominator-pool do `check_new_stake_msg` and `msg_value` checks before sending `new_stake`.
                ;; If the stake is not accepted elector will send `new_stake_error` response message.
                ;; Nevertheless we do process theoretically possible bounced `new_stake`.

                if (state == state::SENT_STAKE_REQUEST) {
                    state = state::REST;
                } else {
                    halted? = true;
                }
            } elseif (equal_slice_bits(sender_address, pool)) {
              if(op == pool::loan_repayment) {
                borrowed_amount += msg_value;
                borrowing_time = now();
              } elseif (op == pool::request_loan) {
                if (state == state::SENT_BORROWING_REQUEST) {
                  state = state::REST;
                } else {
                  halted? = true;
                }
              }
            }
        }

        save_data();
        return (); ;; ignore other bounces messages
    }

    (int op, int query_id) = in_msg_body~load_body_header();

    if (is_elector_address(sender_address)) { ;; response from elector

            accept_message();

            if (op == elector::recover_stake_ok) {
                ;; Note, this request will be processed even in halted state
                state = state::REST;
                if( borrowed_amount ) {
                  if(balance >= MIN_TONS_FOR_STORAGE + borrowed_amount) {
                    send_msg(pool,
                             borrowed_amount, ;; TODO add fee???
                             begin_cell().store_body_header(pool::loan_repayment, query_id).end_cell(),
                             msgflag::BOUNCEABLE,
                             sendmode::PAY_FEES_SEPARETELY); ;; remaining inbound message amount, fee deducted from
                    borrowed_amount = 0;
                    borrowing_time = 0;
                    stake_amount_sent = 0;
                    stake_at = 0;
                  } else {
                    state = state::INSOLVENT;
                  }
                }
            } elseif (op == elector::recover_stake_error) {
                if(state == state::SENT_RECOVER_REQUEST) {
                    ;; The only case when we get elector::recover_stake_error is credits = 0
                    ;; in this case we should not return state to FUNDS_STAKEN to avoid
                    ;; further balance depletion due to repetitive STAKE_RECOVER_FINE
                    halted? = true;
                    state = state::INSOLVENT;
                } else {
                    halted? = true;
                }
            }

            if (state == state::SENT_STAKE_REQUEST) {
                if (op == elector::new_stake_error) { ;; error when new_stake; stake returned
                    state = state::REST;
                } elseif (op == elector::new_stake_ok) {
                    state = state::FUNDS_STAKEN;
                    ;; update saved_validator_set_hash in case it have changed
                    ;; while new_stake message reached the elector
                    (int utime_since, int utime_until, cell vset) = get_current_validator_set();
                    saved_validator_set_hash = cell_hash(vset);
                } else {
                    halted? = true;
                }
            }

            ;; else just accept coins from elector

    } else {

            if (op == controller::top_up) {
                if(state == state::INSOLVENT) {
                    ;; we add WITHDRAWAL_FEE below to ensure there is enough money to process
                    ;; and send bounty in return_unused_loan
                    if (balance > MIN_TONS_FOR_STORAGE + STAKE_RECOVER_FINE + borrowed_amount + WITHDRAWAL_FEE) {
                        state = state::REST;
                    }
                }
            } elseif (op == controller::credit) {
                assert_sender!(sender_address, pool);
                ;; borrowed_amount includes interest
                ifnot(borrowing_time) {
                  borrowing_time = now();
                }
                int credit_amount = in_msg_body~load_coins();
                borrowed_amount += credit_amount;
                in_msg_body.end_parse();
                throw_unless(error::credit_interest_too_high, credit_amount < muldiv(msg_value, max_expected_interest + SHARE_BASIS, SHARE_BASIS) + ONE_TON);
                max_expected_interest = 0;
                if(state == state::SENT_BORROWING_REQUEST) {
                  state = state::REST;
                }
            } elseif (op == controller::approve) {
                assert_sender!(sender_address, approver);
                approved? = true;
            }  elseif (op == controller::disapprove) {
                assert_sender!(sender_address, approver);
                approved? = false;
            } elseif (op == sudo::send_message) {
                process_sudo_request(sender_address, in_msg_body);
            } elseif (op == governor::set_sudoer) {
                process_set_sudo_request(sender_address, in_msg_body);
            }  elseif (op == governor::unhalt) {
                process_unhalt_request(sender_address);
            }  elseif (op == governor::return_available_funds) {
                assert_state!(state::INSOLVENT);
                assert_sender!(sender_address, governor);
                int available_funds = balance - MIN_TONS_FOR_STORAGE - WITHDRAWAL_FEE;
                available_funds = min( available_funds, borrowed_amount);
                send_msg(pool,
                        available_funds,
                        begin_cell().store_body_header(pool::loan_repayment, query_id).end_cell(),
                        msgflag::BOUNCEABLE,
                        sendmode::PAY_FEES_SEPARETELY); ;; remaining inbound message amount, fee deducted from
                borrowed_amount -= available_funds;
                if(borrowed_amount == 0) {
                    borrowing_time = 0;
                    state = state::REST;
                }
            }  elseif (op == halter::halt) {
                process_halt_request(sender_address);
            }  else {
                ;; actions above considered safe or critical enough to be processed in halted regime
                ;; actions below are only allowed for not halted controller
                assert_not_halted!();
                if (op == controller::recover_stake) { ;; send recover_stake to elector
                    assert_state!(state::FUNDS_STAKEN);
                    in_msg_body.end_parse();
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

                    throw_unless(error::too_early_stake_recover_attempt_count, validator_set_changes_count >= 2);
                    int time_since_unfreeze = now() - validator_set_change_time - stake_held_for;
                    throw_unless(error::too_early_stake_recover_attempt_time, (validator_set_changes_count > 2) | (time_since_unfreeze > 60));
                    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L887
                    throw_unless(error::too_low_recover_stake_value, msg_value >= ELECTOR_OPERATION_VALUE);

                    cell payload = begin_cell().store_body_header(elector::recover_stake, query_id).end_cell();
                    send_msg(elector_address(),
                             0, ;; amount
                             payload,
                             msgflag::BOUNCEABLE,
                             sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE); ;; remaining inbound message amount, fee deducted from amount, revert on errors
                    state = state::SENT_RECOVER_REQUEST;
                    if( (time_since_unfreeze < GRACE_PERIOD) | (borrowed_amount == 0) ) {
                      assert_sender!(sender_address, validator);
                    } else {
                      if(balance - msg_value - STAKE_RECOVER_FINE >= MIN_TONS_FOR_STORAGE) {
                        ifnot( equal_slice_bits(sender_address, validator)) {
                          send_msg(sender_address, STAKE_RECOVER_FINE, null(), msgflag::NON_BOUNCEABLE, sendmode::IGNORE_ERRORS);
                        }
                      }
                    }

                } elseif (op == controller::update_validator_hash) {
                    assert_state!(state::FUNDS_STAKEN);
                    in_msg_body.end_parse();
                    throw_unless(error::too_much_validator_set_counts, validator_set_changes_count < 3);
                    (int utime_since, int utime_until, cell vset) = get_current_validator_set();
                    int current_hash = cell_hash(vset);
                    throw_unless(error::no_new_hash, saved_validator_set_hash != current_hash);
                    saved_validator_set_hash = current_hash;
                    validator_set_changes_count += 1;
                    validator_set_change_time = now();

                    ;; elector set 'stake_held_for' during election conduction
                    ;; we save it when sending stake and after first round change and chose max
                    ;; it's ok unless 'stake_held_for' will change twice: first one after sending stake
                    ;; but before election conduction and second one after election but prior update_hash
                    (_, int current_stake_held_for, _) = get_validator_config();
                    stake_held_for = max(stake_held_for, current_stake_held_for);


                    int overdue = now() - utime_since;
                    if( (overdue < GRACE_PERIOD) | (borrowed_amount == 0) ) {
                      assert_sender!(sender_address, validator);
                      send_excesses(sender_address);
                    } else {
                      if(balance - HASH_UPDATE_FINE >= MIN_TONS_FOR_STORAGE) {
                        ifnot( equal_slice_bits(sender_address, validator)) {
                          send_msg(sender_address, HASH_UPDATE_FINE, null(), msgflag::NON_BOUNCEABLE, sendmode::IGNORE_ERRORS);
                        }
                      }
                    }
                } elseif (op == controller::withdraw_validator) { ;; withdraw validator (after recover_stake and before new_stake)
                    assert_state!(state::REST);
                    throw_if(error::withdrawal_while_credited, borrowed_amount);
                    assert_sender!(sender_address, validator);
                    int request_amount = in_msg_body~load_coins();
                    in_msg_body.end_parse();
                    throw_unless(error::incorrect_withdrawal_amount, request_amount > 0);

                    raw_reserve(MIN_TONS_FOR_STORAGE, 2);
                    send_msg(validator,
                             request_amount,
                             begin_cell().store_body_header(controller::validator_withdrawal, query_id).end_cell(),
                             msgflag::NON_BOUNCEABLE,
                             sendmode::REGULAR);

                } elseif (op == controller::new_stake) {
                    assert_state!(state::REST);
                    assert_sender!(sender_address, validator);

                    throw_unless(error::incorrect_new_stake::query_id, query_id); ;; query_id must be greater then 0 to receive confirmation message from elector

                    throw_unless(error::incorrect_new_stake::request_value,
                                 msg_value >= ELECTOR_OPERATION_VALUE); ;; must be greater then new_stake sending to elector fee

                    int value = in_msg_body~load_coins();

                    slice msg = in_msg_body;

                    stake_at = check_new_stake_msg(in_msg_body);

                    stake_amount_sent = value - ELECTOR_OPERATION_VALUE;

                    throw_unless(error::incorrect_new_stake::value_lt_minimum, value >= MIN_STAKE_TO_SEND);

                    int overdue_fine_and_storage = (HASH_UPDATE_FINE * 3) + STAKE_RECOVER_FINE + MIN_TONS_FOR_STORAGE;

                    throw_unless(error::incorrect_new_stake::value_too_high, balance - value >=  overdue_fine_and_storage);
                    (_, stake_held_for, int elections_end_before) = get_validator_config();
                    (int utime_since, int utime_until, cell vset) = get_current_validator_set();
                    if (borrowed_amount) {
                      ;; it is allowed to use credit funds only in the same round when they were obtained
                      throw_unless(error::incorrect_new_stake::wrongly_used_credit,
                                  (borrowing_time > utime_since) & (now() < utime_until - elections_end_before));
                    }

                    int validator_own_funds = balance - borrowed_amount - overdue_fine_and_storage;

                    throw_unless(error::incorrect_new_stake::solvency_not_guaranteed,
                                 validator_own_funds >= max_recommended_punishment_for_validator_misbehaviour(stake_amount_sent));

                    state = state::SENT_STAKE_REQUEST;



                    saved_validator_set_hash = cell_hash(vset); ;; current validator set, we will be in next validator set
                    validator_set_changes_count = 0;
                    validator_set_change_time = utime_since;

                    send_msg(elector_address(),
                             value,
                             begin_cell().store_body_header(elector::new_stake, query_id).store_slice(msg).end_cell(),
                             msgflag::BOUNCEABLE,
                             sendmode::PAY_FEES_SEPARETELY); ;; pay fee separately, revert on errors

                } elseif (op == controller::send_request_loan) {
                  assert_state!(state::REST);
                  assert_sender!(sender_address, validator);
                  throw_unless(error::too_low_request_loan_value, msg_value >= MIN_REQUEST_LOAN_VALUE);
                  slice request = in_msg_body;
                  int min_loan = in_msg_body~load_coins();
                  int max_loan = in_msg_body~load_coins();
                  int max_interest = in_msg_body~load_share();
                  in_msg_body.end_parse();
                  max_expected_interest = max_interest;

                  throw_unless(error::controller_not_approved, approved?);

                  ;; For simplicity forbid multiple borrowing
                  ;; TODO
                  throw_if(error::multiple_loans_are_prohibited, borrowed_amount);

                  (int elections_start_before, _, int elections_end_before) = get_validator_config();
                  (int utime_since, int utime_until, cell vset) = get_current_validator_set();
                  throw_unless(error::too_early_loan_request, now() > utime_until - elections_start_before); ;; elections started
                  throw_unless(error::too_late_loan_request, now() < utime_until - elections_end_before);   ;; elections not yet closed


                  ;; lets check whether we can afford it
                  int elector_fine = max_recommended_punishment_for_validator_misbehaviour(max_loan + balance);
                  int overdue_fine = (HASH_UPDATE_FINE * 3) + STAKE_RECOVER_FINE;
                  int interest_payment = muldiv(max_loan, max_interest, SHARE_BASIS);
                  int validator_amount = balance - borrowed_amount;
                  throw_unless(error::too_high_loan_request_amount, validator_amount >= (MIN_TONS_FOR_STORAGE + overdue_fine) + elector_fine + interest_payment);

                  cell payload = begin_cell()
                                             .store_body_header(pool::request_loan, query_id)
                                             .store_slice(request)
                                             .store_slice(static_data)
                                 .end_cell();
                  send_msg(pool,
                           0,
                           payload,
                           msgflag::BOUNCEABLE,
                           sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE);
                  state = state::SENT_BORROWING_REQUEST;
                } elseif (op == controller::return_unused_loan) {
                    assert_state!(state::REST);
                    throw_unless(error::no_credit, borrowed_amount);
                    (int utime_since, int utime_until, cell vset) = get_current_validator_set();
                    throw_unless(error::too_early_loan_return, utime_since > borrowing_time); ;; load was requested in previous round
                    int overdue = now() - utime_since;
                    if(balance >= MIN_TONS_FOR_STORAGE + borrowed_amount) {
                      send_msg(pool,
                               borrowed_amount, ;; TODO add fee???
                               begin_cell().store_body_header(pool::loan_repayment, query_id).end_cell(),
                               msgflag::BOUNCEABLE,
                               sendmode::PAY_FEES_SEPARETELY); ;; remaining inbound message amount, fee deducted from
                      borrowed_amount = 0;
                      borrowing_time = 0;
                      if(overdue < GRACE_PERIOD) {
                        assert_sender!(sender_address, validator);
                        send_excesses(sender_address);
                      } else {
                        if(balance >=  MIN_TONS_FOR_STORAGE + borrowed_amount + STAKE_RECOVER_FINE) {
                          ifnot( equal_slice_bits(sender_address, validator)) {
                            send_msg(sender_address, STAKE_RECOVER_FINE, null(), msgflag::NON_BOUNCEABLE, sendmode::IGNORE_ERRORS);
                          }
                        }
                      }
                    } else {
                      state = state::INSOLVENT;
                    }
                } else {
                  throw(error::unknown_op);
                }
            }
    }

    save_data( );
}

() save_data() impure inline_ref {
    set_data(begin_cell()
        .store_uint(state, 8)
        .store_bool(halted?)
        .store_bool(approved?)
        .store_coins(stake_amount_sent)
        .store_timestamp(stake_at)
        .store_uint(saved_validator_set_hash, 256)
        .store_uint(validator_set_changes_count, 8)
        .store_timestamp(validator_set_change_time)
        .store_timestamp(stake_held_for)
        .store_coins(borrowed_amount)
        .store_timestamp(borrowing_time)
        .store_slice(sudoer)
        .store_timestamp(sudoer_set_at)
        .store_share(max_expected_interest)
        .store_slice(static_data)
        .end_cell());
}

() load_data() impure inline_ref {

    slice ds = get_data().begin_parse();
    state = ds~load_uint(8);
    halted? = ds~load_int(1);
    approved? = ds~load_int(1);

    stake_amount_sent = ds~load_coins();
    stake_at = ds~load_timestamp();

    saved_validator_set_hash = ds~load_uint(256);
    validator_set_changes_count = ds~load_uint(8);
    validator_set_change_time = ds~load_timestamp();
    stake_held_for = ds~load_timestamp();

    borrowed_amount = ds~load_coins();
    borrowing_time = ds~load_timestamp();

    sudoer = ds~load_msg_addr();
    sudoer_set_at = ds~load_timestamp();

    max_expected_interest = ds~load_share();

    static_data = ds;

    ds = ds~load_ref().begin_parse();

    controller_id = ds~load_uint(32);
    validator = ds~load_msg_addr();
    pool = ds~load_msg_addr();
    governor = ds~load_msg_addr();

    ds = ds~load_ref().begin_parse();

    approver = ds~load_msg_addr();
    halter = ds~load_msg_addr();
}


slice make_address(int wc, int addr) inline_ref {
    return begin_cell()
           .store_uint(4, 3).store_workchain(wc).store_uint(addr, ADDR_SIZE).end_cell().begin_parse();
}

slice elector_address() inline_ref {
    int elector = config_param(1).begin_parse().preload_uint(ADDR_SIZE);
    return make_address(MASTERCHAIN, elector);
}

;; https://github.com/ton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L584
int is_elector_address(slice address) inline_ref {
  return equal_slice_bits(address, elector_address());
}


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

;; Get methods

_ get_validator_controller_data() method_id {
    load_data();
    return (
      state, halted?, approved?,
      
      stake_amount_sent, stake_at,
      
      saved_validator_set_hash,
      validator_set_changes_count,
      validator_set_change_time,
      stake_held_for,
      
      borrowed_amount, borrowing_time,
      validator, pool, sudoer
      );
}

int get_max_punishment(int stake) method_id {
    return max_recommended_punishment_for_validator_misbehaviour(stake);
}

int get_max_stake_value() method_id {
    load_data();
    ifnot(state == state::REST) {
        return -1;
    }
    int balance = pair_first(get_balance());
    int overdue_fine = (HASH_UPDATE_FINE * 3) + STAKE_RECOVER_FINE;
    ;; we add ELECTOR_OPERATION_VALUE to ensure room for storage fees and so on
    int value = balance - MIN_TONS_FOR_STORAGE - overdue_fine - ELECTOR_OPERATION_VALUE;
    if(value < MIN_STAKE_TO_SEND) {
        return -1;
    }
    if (borrowed_amount) {
        (_, stake_held_for, int elections_end_before) = get_validator_config();
        (int utime_since, int utime_until, cell vset) = get_current_validator_set();
        ;; it is allowed to use credit funds only in the same round when they were obtained
        if((borrowing_time > utime_since) & (now() < utime_until - elections_end_before)) {
            return -1;
        }
    }
    ;; currently we skip checks related to max_recommended_punishment_for_validator_misbehaviour
    return value;
}

(int, int) required_balance_for_loan(int credit, int interest) method_id {
    load_data();
    int balance = pair_first(get_balance());
    int elector_fine = max_recommended_punishment_for_validator_misbehaviour(credit + balance);
    int overdue_fine = (HASH_UPDATE_FINE * 3) + STAKE_RECOVER_FINE;
    int interest_payment = muldiv(credit, interest, SHARE_BASIS);
    int validator_amount = balance - borrowed_amount;
    return (MIN_TONS_FOR_STORAGE + overdue_fine + elector_fine + interest_payment,
            validator_amount);
}


(int, int) request_window_time() method_id { ;; TODO: put it in recv_internal in request_loan operation
    ;; get time window (since, until) when controller may request loan
    (int elections_start_before, _, int elections_end_before) = get_validator_config();
    (int utime_since, int utime_until, _) = get_current_validator_set();
    return (utime_until - elections_start_before,
            utime_until - elections_end_before);
}

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

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/contracts/versioning.func

```func
#include "auto/git-hash.func";

int get_code_version() method_id {
    return git_hash;
}

```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/errors.func

```func
const int error::unknown_op = 0xffff;

const int error::wrong_sender = 0x9283;
const int error::wrong_state = 0x9284;
const int error::halted = 0x9285;

const int sudoer::quarantine = 0xa000;
const int error::governor_update_too_soon = 0xa001;
const int error::governor_update_not_matured = 0xa003;

const int error::interest_too_low = 0xf100;
const int error::contradicting_borrowing_params = 0xf101;
const int error::not_enough_funds_for_loan = 0xf102;
const int error::total_credit_too_high = 0xf103;
const int error::borrowing_request_in_closed_round = 0xf104;

const int error::deposit_amount_too_low = 0xf200;
const int error::deposits_are_closed = 0xf201;
const int error::output_amount_is_zero = 0xf202;

const int error::not_enough_TON_to_process = 0xf300;

const int error::controller_in_wrong_workchain = 0xf400;
const int error::credit_book_too_deep = 0xf401;
const int error::unknown_borrower = 0xf402;

const int error::finalizing_active_credit_round = 0xf500;

const int error::too_early_stake_recover_attempt_count = 0xf600;
const int error::too_early_stake_recover_attempt_time = 0xf601;
const int error::too_low_recover_stake_value = 0xf602;
const int error::not_enough_money_to_pay_fine = 0xf603;
const int error::too_low_request_loan_value = 0xf604;

const int error::too_much_validator_set_counts = 0xf700;
const int error::no_new_hash = 0xf701;

const int error::withdrawal_while_credited = 0xf800;
const int error::incorrect_withdrawal_amount = 0xf801;


const int error::incorrect_new_stake::query_id = 0xf900;
const int error::incorrect_new_stake::request_value = 0xf901;
const int error::incorrect_new_stake::value_lt_minimum = 0xf902;
const int error::incorrect_new_stake::value_too_high = 0xf903;
const int error::incorrect_new_stake::wrongly_used_credit = 0xf904;
const int error::incorrect_new_stake::solvency_not_guaranteed = 0xf905;


const int error::controller_not_approved = 0xfa00;
const int error::multiple_loans_are_prohibited = 0xfa01;
const int error::too_early_loan_request = 0xfa02;
const int error::too_late_loan_request = 0xfa03;
const int error::too_high_loan_request_amount = 0xfa04;
const int error::credit_interest_too_high = 0xfa05;

const int error::no_credit = 0xfb00;
const int error::too_early_loan_return = 0xfb01;

```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/governor_requests.func

```func
;; common functions in all contracts
global slice governor;
global int governor_update_after;
global slice sudoer;
global int sudoer_set_at;
global int state;
global int halted?;

const int GOVERNOR_QUARANTINE = 86400;

() process_set_sudo_request(slice sender, slice in_msg) impure inline_ref {
    assert_sender!(sender, governor);
    sudoer_set_at = now();
    sudoer = in_msg~load_msg_addr();
}

() process_prepare_governance_migration(slice sender, slice in_msg) impure inline_ref {
    assert_sender!(sender, governor);
    governor_update_after = in_msg~load_timestamp();
    throw_unless(error::governor_update_too_soon, governor_update_after - now() > GOVERNOR_QUARANTINE );
}

() process_unhalt_request(slice sender) impure inline_ref {
    assert_sender!(sender, governor);
    halted? = false;
}

```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/halter_requests.func

```func
;; common functions in all contracts
global slice halter;
global int halted?;

() process_halt_request(slice sender) impure inline_ref {
    assert_sender!(sender, halter);
    halted? = true;
}

```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/messages.func

```func
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
const int msgflag::NON_BOUNCEABLE = 0x10;
const int msgflag::BOUNCEABLE = 0x18;

const int sendmode::REGULAR = 0;
const int sendmode::PAY_FEES_SEPARETELY = 1;
const int sendmode::IGNORE_ERRORS = 2;
const int sendmode::DESTROY = 32;
const int sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;
const int sendmode::CARRY_ALL_BALANCE = 128;

builder store_msg_flags(builder b, int msg_flag) inline { return b.store_uint(msg_flag, 6); }

{-
  Helpers below fill in default/overwritten values of message layout:
  Relevant part of TL-B schema:
  ... other:ExtraCurrencyCollection ihr_fee:Grams fwd_fee:Grams created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  bits      1                               4             4                64                32                            
  ... init:(Maybe (Either StateInit ^StateInit))  body:(Either X ^X) = Message X;
  bits      1      1(if prev is true)                   1

-}

builder store_msgbody_prefix_stateinit(builder b, cell state_init, cell ref) inline {
    return b.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1).store_ref(state_init).store_ref(ref);
}

builder store_msgbody_prefix_stateinit_slice(builder b, cell state_init) inline {
    return b.store_uint(4 + 2 + 0, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1).store_ref(state_init);
}

builder store_msgbody_prefix_slice(builder b) inline {
    return b.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);
}
builder store_msgbody_prefix_ref(builder b, cell ref) inline {
    return b.store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1).store_ref(ref);
}

{-

addr_std$10 anycast:(Maybe Anycast) 
   workchain_id:int8 address:bits256  = MsgAddressInt;
-}

builder store_masterchain_address(builder b, int address_hash) inline {
  return b.store_uint(4, 3).store_workchain(MASTERCHAIN).store_uint(address_hash, 256);
}


() send_msg(slice to_address, int amount, cell payload, int flags, int send_mode) impure inline_ref {
    int has_payload = ~ cell_null?(payload);

    builder msg = begin_cell()
        .store_msg_flags(flags)
        .store_slice(to_address)
        .store_coins(amount);

    if (has_payload) {
        msg = msg.store_msgbody_prefix_ref(payload);
    } else {
        msg = msg.store_msgbody_prefix_slice();
    }

    send_raw_message(msg.end_cell(), send_mode);
}

() send_msg_builder(slice to_address, int amount, builder payload, int flags, int send_mode) impure inline_ref {
    int payload_length = payload.null?() ? 0 : payload.builder_bits();

    builder msg = begin_cell()
        .store_msg_flags(flags)
        .store_slice(to_address)
        .store_coins(amount);

    if (payload_length + msg.builder_bits() > 1023 - (1 + 4 + 4 + 64 + 32 + 1 + 1)) {
        msg = msg.store_msgbody_prefix_ref(begin_cell().store_builder(payload).end_cell());
    } else {
        msg = msg.store_msgbody_prefix_slice()
                 .store_builder(payload);
    }

    send_raw_message(msg.end_cell(), send_mode);
}

() send_excesses(slice sender_address) impure inline_ref {
    send_msg(
      sender_address,
      0, ;; value
      null(),
      msgflag::NON_BOUNCEABLE,
      sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE | sendmode::IGNORE_ERRORS); ;; non-bouneable, remaining inbound message amount, fee deducted from amount, ignore errors
}



() emit_log (int topic, builder data) impure inline {
    ;; 1023 - (4+2+9+256+64+32+2) = 654 bit free

    var msg = begin_cell()
            .store_uint (12, 4)         ;; ext_out_msg_info$11 src:MsgAddressInt ()
            .store_uint (1, 2)          ;; addr_extern$01
            .store_uint (256, 9)        ;; len:(## 9)
            .store_uint(topic, 256); ;; external_address:(bits len)

    if (data.builder_bits() > 1023 - (4 + 2 + 9 + 256 + 64 + 32 + 2) ) {
        msg = msg.store_uint(1, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either
                .store_ref(begin_cell().store_builder(data).end_cell());
    } else {
        msg = msg.store_uint(0, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either
                .store_builder(data);
    }

    send_raw_message(msg.end_cell(), sendmode::REGULAR);
}


```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/network_config_utils.func

```func
const int ONE_TON = 1000000000;

;; https://github.com/ton-blockchain/ton/blob/ae5c0720143e231c32c3d2034cfe4e533a16d969/crypto/block/block.tlb#L721
int max_recommended_punishment_for_validator_misbehaviour(int stake) inline_ref {
    cell cp = config_param(40);
    if (cell_null?(cp)) {
        return 101 * ONE_TON; ;; 101 TON - https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/lite-client/lite-client.cpp#L3678
    }

    slice cs = cp.begin_parse();

    (int prefix,
     int default_flat_fine, int default_proportional_fine,
     int severity_flat_mult, int severity_proportional_mult,
     int unpunishable_interval,
     int long_interval, int long_flat_mult, int long_proportional_mult) =
        (cs~load_uint(8),
         cs~load_coins(), cs~load_uint(32),
         cs~load_uint(16), cs~load_uint(16),
         cs~load_uint(16),
         cs~load_uint(16), cs~load_uint(16), cs~load_uint(16)
        );

     ;; https://github.com/ton-blockchain/ton/blob/master/lite-client/lite-client.cpp#L3721
     int fine = default_flat_fine;
     int fine_part = default_proportional_fine;

     fine *= severity_flat_mult; fine >>= 8;
     fine_part *= severity_proportional_mult; fine_part >>= 8;

     fine *= long_flat_mult; fine >>= 8;
     fine_part *= long_proportional_mult; fine_part >>= 8;

     return min(stake, fine + muldiv(stake, fine_part, 1 << 32)); ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L529
}

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/block/block.tlb#L632
;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L118
(int, int, int) get_validator_config() inline {
    slice cs = config_param(15).begin_parse();
    (int validators_elected_for, int elections_start_before, int elections_end_before, int _stake_held_for) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32), cs.preload_uint(32));
    return (elections_start_before, _stake_held_for, elections_end_before);
}

int get_stake_held_for() inline_ref {
    (int elections_start_before, int _stake_held_for, _) = get_validator_config();
    return _stake_held_for;
}
int get_elections_start_before() inline_ref {
    (int elections_start_before, int _stake_held_for, _) = get_validator_config();
    return elections_start_before;
}

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/block/block.tlb#L712
(int, int, cell) get_current_validator_set() inline_ref {
    cell vset = config_param(34); ;; current validator set
    slice cs = vset.begin_parse();
    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/block/block.tlb#L579
    ;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/config-code.fc#L49
    throw_unless(9, cs~load_uint(8) == 0x12);  ;; validators_ext#12 only
    int utime_since = cs~load_uint(32); ;; actual start unixtime of current validation round
    int utime_until = cs~load_uint(32); ;; supposed end unixtime of current validation round (utime_until = utime_since + validators_elected_for); unfreeze_at = utime_until + stake_held_for
    return (utime_since, utime_until, vset);
}

```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/op-codes.func

```func
{- ======== ELECTOR OPCODES =========== -}

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L621
const int elector::new_stake = 0x4e73744b;

;; return_stake https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L169
const int elector::new_stake_error = 0xee6f454c;

;; send_confirmation https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L173
const int elector::new_stake_ok = 0xf374484c; 

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L625
const int elector::recover_stake = 0x47657424;

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L407
const int elector::recover_stake_error = 0xfffffffe;

;; https://github.com/ton-blockchain/ton/blob/b38d227a469666d83ac535ad2eea80cb49d911b8/crypto/smartcont/elector-code.fc#L426
const int elector::recover_stake_ok = 0xf96f7324;

{- ========  Validator Controller OPCODES ======== -}
;; IN
const int controller::top_up = 0xd372158c;
const int controller::update_validator_hash = 0xf0fd2250;
const int controller::approve = 0x7b4b42e6;
const int controller::disapprove = 0xe8a0abfe;
const int controller::recover_stake = 0xeb373a05;
const int controller::new_stake = elector::new_stake;
const int controller::credit = 0x1690c604;
const int controller::withdraw_validator = 0x8efed779;
const int controller::return_unused_loan = 0xed7378a6;

;; OUT
const int controller::validator_withdrawal = 0x30026327;
const int controller::send_request_loan = 0x6335b11a;


{- ======== Validator Pool OPCODES ========== -}
const int pool::request_loan = 0xe642c965;
const int pool::loan_repayment = 0xdfdca27b;
const int pool::deposit = 0x47d54391;
const int pool::withdraw = 0x319B0CDC;
const int pool::withdrawal = 0x0a77535c;
const int pool::touch = 0x4bc7c2df;
const int pool::donate = 0x73affe21;

const int pool::deploy_controller = 0xb27edcad;


const int sudo::send_message = 0x270695fb;
const int sudo::upgrade = 0x96e7f528;
const int governor::set_sudoer = 0x79e7c016;
const int governor::set_governance_fee = 0x2aaa96a0;
const int governor::set_roles = 0x5e517f36;
const int governor::unhalt = 0x7247e7a5;
const int governor::set_deposit_settings = 0x9bf5561c;
const int governor::return_available_funds = 0x55c26cd5;
const int governor::prepare_governance_migration = 0x9971881c;

const int halter::halt = 0x139a1b4e;


const int interest_manager::operation_fee = 0x54d37487;
const int interest_manager::request_notification = 0xb1ebae06;
const int interest_manager::stats = 0xc1344900;
const int interest_manager::set_interest = 0xc9f04485;

{- ========== Jetton OPCODES ========== -}
const int jetton::transfer = 0xf8a7ea5;
const int jetton::transfer_notification = 0x7362d09c;
const int jetton::internal_transfer = 0x178d4519;
const int jetton::excesses = 0xd53276db;
const int jetton::burn = 0x595f07bc;
const int jetton::burn_notification = 0x7bdd97de;
const int jetton::withdraw_tons = 0x6d8e5e3c;
const int jetton::withdraw_jettons = 0x768a50b2;

const int jetton::provide_wallet_address = 0x2c76b973;
const int jetton::take_wallet_address = 0xd1735400;
const int jetton::change_content = 0x5773d1f5;

const int payout::mint = 0x1674b0a0;
const int payout::burn_notification = pool::withdraw;
const int payout::init = 0xf5aa8943;


const int payouts::start_distribution = 0x1140a64f;

{- =========== awaited Jettons ============= -}
const int payouts::mint = 0x8887;

```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/sudoer_requests.func

```func
#include "asserts.func";

;; common function in all contracts
global slice sudoer;
global int sudoer_set_at;

const int SUDOER_QUARANTINE = 86400;

() process_sudo_request(slice sender, slice in_msg) impure inline_ref {
    assert_sender!(sender, sudoer);
    throw_unless(sudoer::quarantine, now() > sudoer_set_at + SUDOER_QUARANTINE);
    int mode = in_msg~load_uint(8);
    cell message  = in_msg~load_ref();
    send_raw_message(message, mode);
}


() execute(cont c) impure asm "EXECUTE";
() process_sudo_upgrade_request(slice sender, slice in_msg) impure inline_ref {
    assert_sender!(sender, sudoer);
    throw_unless(sudoer::quarantine, now() > sudoer_set_at + SUDOER_QUARANTINE);
    cell data = in_msg~load_maybe_ref();
    cell code = in_msg~load_maybe_ref();
    cell after_upgrade = in_msg~load_maybe_ref();
    ifnot(data.null?()) {
      set_data(data);
    }
    ifnot(code.null?()) {
      set_code(code);
    }
    ifnot(after_upgrade.null?()) {
      execute(after_upgrade.begin_parse().bless());
    }
    throw(1);
}

```

## dd3ce98db487c7585803933bffba7a57eb4e663099059d08b83db0b4ce060793/types.func

```func
;; general
(slice, (int)) ~load_timestamp(slice s) inline { return s.load_uint(48); }
builder store_timestamp(builder b, int timestamp) inline { return b.store_uint(timestamp, 48); }

(slice, (int)) ~load_bool(slice s) inline { return s.load_int(1); }
builder store_bool(builder b, int flag) inline { return b.store_int(flag, 1); }

(slice, (int)) ~load_workchain(slice s) inline { return s.load_int(8); }
builder store_workchain(builder b, int wc) inline { return b.store_int(wc, 8); }
const int MASTERCHAIN = -1;
const int BASECHAIN = 0;

;; Op-codes

(slice, (int)) ~load_op(slice s) inline { return s.load_uint(32); }
(slice, (int)) ~load_query_id(slice s) inline { return s.load_uint(64); }
(slice, (int, int)) ~load_body_header(slice s) inline {
    int op = s~load_uint(32);
    int query_id = s~load_uint(64);
    return (s, (op, query_id));
}


(slice, ()) ~skip_bounce(slice s) inline { s~skip_bits(32); return (s, ());}

builder store_op(builder b, int op) inline { return b.store_uint(op, 32); }
builder store_query_id(builder b, int query_id) inline { return b.store_uint(query_id, 64); }
builder store_body_header(builder b, int op, int query_id) inline {
    return b.store_uint(op, 32)
            .store_uint(query_id, 64);
}

;; Pool types

(slice, (int)) ~load_share(slice s) inline { return s.load_uint(24); }
builder store_share(builder b, int share) inline { return b.store_uint(share, 24); }
const int SHARE_BASIS = 256 * 256 * 256; ;; 24 bit


(slice, (int)) ~load_controller_id(slice s) inline { return s.load_uint(32); }
builder store_controller_id(builder b, int id) inline { return b.store_uint(id, 32); }


(slice, (int)) ~load_signed_coins(slice s) inline {
    int sign = s~load_int(1) * 2 + 1;
    int coins = s~load_coins();
    return (s, coins * sign);
}
builder store_signed_coins(builder b, int amount) inline {
    return b.store_bool(amount < 0).store_coins(abs(amount));
}

const int ADDR_SIZE = 256; ;; bits


```

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/constants.fc

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
```

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/jetton-utils.fc

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

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/op-codes.fc

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

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/imports/utils.fc

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

## ddac4389ae1e0949d3562c6a534fc1500e22f2277906d570d69b7fc9ac9977a9/stdlib.fc

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

## deb53b6c5765c1e6cd238bf47bc5e83ba596bdcc04b0b84cd50ab1e474a08f31/nft-fixprice-sale-v3r2.fc

```fc
;; NFT sale smart contract v3.1
;; fix repeat cancel message
;; allow cancel by text "cancel"

int min_gas_amount() asm "1000000000 PUSHINT"; ;; 1 TON
slice msg::cancel_msg() asm "<b 124 word cancel| $, b> <s PUSHSLICE";

_ load_data() inline {
  var ds = get_data().begin_parse();
  return (
          ds~load_uint(1), ;; is_complete
          ds~load_uint(32), ;; created_at
          ds~load_msg_addr(), ;; marketplace_address
          ds~load_msg_addr(), ;; nft_address
          ds~load_msg_addr(), ;; nft_owner_address
          ds~load_coins(), ;; full_price
          ds~load_ref(), ;; fees_cell
          ds~load_uint(1) ;; can_deploy_by_external
  );
}

_ load_fees(cell fees_cell) inline {
  var ds = fees_cell.begin_parse();
  return (
          ds~load_msg_addr(), ;; marketplace_fee_address
          ds~load_coins(), ;; marketplace_fee,
          ds~load_msg_addr(), ;; royalty_address
          ds~load_coins() ;; royalty_amount
  );
}

() save_data(int is_complete, int created_at, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell) impure inline {
  set_data(
          begin_cell()
                  .store_uint(is_complete, 1)
                  .store_uint(created_at, 32)
                  .store_slice(marketplace_address)
                  .store_slice(nft_address)
                  .store_slice(nft_owner_address)
                  .store_coins(full_price)
                  .store_ref(fees_cell)
                  .store_uint(0, 1) ;; can_deploy_by_external
                  .end_cell()
  );
}

() send_money(slice address, int amount) impure inline {
  var msg = begin_cell()
          .store_uint(0x10, 6) ;; nobounce
          .store_slice(address)
          .store_coins(amount)
          .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
          .end_cell();

  send_raw_message(msg, 1);
}

() buy(var args) impure {

  (
          int created_at,
          slice marketplace_address,
          slice nft_address,
          slice nft_owner_address,
          int full_price,
          cell fees_cell,

          int my_balance,
          int msg_value,
          slice sender_address,
          int query_id
  ) = args;

  throw_unless(450, msg_value >= full_price + min_gas_amount());

  var (
          marketplace_fee_address,
          marketplace_fee,
          royalty_address,
          royalty_amount
  ) = load_fees(fees_cell);

  ;; Owner message
  send_money(
          nft_owner_address,
          full_price - marketplace_fee - royalty_amount + (my_balance - msg_value)
  );

  ;; Royalty message
  if ((royalty_amount > 0) & (royalty_address.slice_bits() > 2)) {
    send_money(
            royalty_address,
            royalty_amount
    );
  }

  ;; Marketplace fee message
  send_money(
          marketplace_fee_address,
          marketplace_fee
  );

  builder nft_transfer = begin_cell()
          .store_uint(op::transfer(), 32)
          .store_uint(query_id, 64)
          .store_slice(sender_address) ;; new_owner_address
          .store_slice(sender_address) ;; response_address
          .store_int(0, 1) ;; empty custom_payload
          .store_coins(30000000) ;; forward amount to new_owner_address 0.03 TON
          .store_int(0, 1); ;; empty forward_payload
  var nft_msg = begin_cell()
          .store_uint(0x18, 6)
          .store_slice(nft_address)
          .store_coins(0)
          .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
          .store_ref(nft_transfer.end_cell());


  send_raw_message(nft_msg.end_cell(), 128);

  ;; Set sale as complete
  save_data(
          1,
          created_at,
          marketplace_address,
          nft_address,
          nft_owner_address,
          full_price,
          fees_cell
  );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
  slice cs = in_msg_full.begin_parse();
  int flags = cs~load_uint(4);

  if (flags & 1) { ;; ignore all bounced messages
    return ();
  }

  slice sender_address = cs~load_msg_addr();

  var (
          is_complete,
          created_at,
          marketplace_address,
          nft_address,
          nft_owner_address,
          full_price,
          fees_cell,
          can_deploy_by_external
  ) = load_data();

  int op = 0;
  int query_id = 0;

  if (in_msg_body.slice_empty?() == false) {
    op = in_msg_body~load_uint(32);
  }

  if (op != 0) {
    query_id = in_msg_body~load_uint(64);
  } else {
    if (equal_slices(msg::cancel_msg(), in_msg_body)) {
      op = 3;
    }
  }

  if (op == 1) { ;; just accept coins
    return ();
  }

  var is_initialized = nft_owner_address.slice_bits() > 2; ;; not initialized if null address

  if ((op == 555) & ((is_complete == 1) | (~ is_initialized)) & equal_slices(sender_address, marketplace_address)) {
    ;; way to fix unexpected troubles with sale contract
    ;; for example if some one transfer nft to this contract
    var msg = in_msg_body~load_ref().begin_parse();
    var mode = msg~load_uint(8);
    send_raw_message(msg~load_ref(), mode);
    return ();
  }

  ;; Throw if sale is complete
  throw_if(404, is_complete == 1);

  if (~ is_initialized) {

    if (equal_slices(sender_address, marketplace_address)) {
      return (); ;; just accept coins on deploy
    }

    throw_unless(500, equal_slices(sender_address, nft_address));
    throw_unless(501, op == op::ownership_assigned());
    slice prev_owner_address = in_msg_body~load_msg_addr();

    save_data(
            is_complete,
            created_at,
            marketplace_address,
            nft_address,
            prev_owner_address,
            full_price,
            fees_cell
    );

    return ();
  }

  if (op == 3) { ;; cancel sale
    throw_unless(457, msg_value >= min_gas_amount());
    throw_unless(458, equal_slices(sender_address, nft_owner_address) | equal_slices(sender_address, marketplace_address));

    var msg = begin_cell()
            .store_uint(0x10, 6) ;; nobounce
            .store_slice(nft_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::transfer(), 32)
            .store_uint(query_id, 64)
            .store_slice(nft_owner_address) ;; new_owner_address
            .store_slice(nft_owner_address) ;; response_address;
            .store_int(0, 1) ;; empty custom_payload
            .store_coins(0) ;; forward amount to new_owner_address
            .store_int(0, 1); ;; empty forward_payload

    send_raw_message(msg.end_cell(), 128);

    save_data(
            1,
            created_at,
            marketplace_address,
            nft_address,
            nft_owner_address,
            full_price,
            fees_cell
    );
    return ();
  }

  if (op == 0) {
    buy(
            created_at,
            marketplace_address,
            nft_address,
            nft_owner_address,
            full_price,
            fees_cell,

            my_balance,
            msg_value,
            sender_address,
            0
    );
    return ();
  }

  if (op == 2) { ;; buy
    buy(
            created_at,
            marketplace_address,
            nft_address,
            nft_owner_address,
            full_price,
            fees_cell,

            my_balance,
            msg_value,
            sender_address,
            query_id
    );
    return ();
  }

  throw(0xffff);
}

() recv_external(slice in_msg) impure {
  var (
          is_complete,
          created_at,
          marketplace_address,
          nft_address,
          nft_owner_address,
          full_price,
          fees_cell,
          can_deploy_by_external
  ) = load_data();

  if (can_deploy_by_external == 1) {
    accept_message();
    save_data(
            is_complete,
            created_at,
            marketplace_address,
            nft_address,
            nft_owner_address,
            full_price,
            fees_cell
    );
    return ();
  }
  throw(0xfffe);
}

(int, int, int, slice, slice, slice, int, slice, int, slice, int) get_sale_data() method_id {
  var (
          is_complete,
          created_at,
          marketplace_address,
          nft_address,
          nft_owner_address,
          full_price,
          fees_cell,
          can_deploy_by_external
  ) = load_data();

  var (
          marketplace_fee_address,
          marketplace_fee,
          royalty_address,
          royalty_amount
  ) = load_fees(fees_cell);

  return (
          0x46495850, ;; fix price sale ("FIXP")
          is_complete == 1,
          created_at,
          marketplace_address,
          nft_address,
          nft_owner_address,
          full_price,
          marketplace_fee_address,
          marketplace_fee,
          royalty_address,
          royalty_amount
  );
}

```

## deb53b6c5765c1e6cd238bf47bc5e83ba596bdcc04b0b84cd50ab1e474a08f31/op-codes.fc

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

## deb53b6c5765c1e6cd238bf47bc5e83ba596bdcc04b0b84cd50ab1e474a08f31/stdlib.fc

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

## df8d704766a3ca425c326fb0c800aeb0a02b0354078635f152ad765965a177ff/imports/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged

int op::provide_wallet_address() asm "0x2c76b973 PUSHINT";
int op::take_wallet_address() asm "0xd1735400 PUSHINT";

int is_resolvable?(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);

    return wc == workchain();
}
```

## df8d704766a3ca425c326fb0c800aeb0a02b0354078635f152ad765965a177ff/imports/op.fc

```fc
int op::transfer() asm "0xf8a7ea5 PUSHINT";
int op::transfer_notification() asm "0x7362d09c PUSHINT";
int op::internal_transfer() asm "0x178d4519 PUSHINT";
int op::excesses() asm "0xd53276db PUSHINT";
int op::burn() asm "0x595f07bc PUSHINT";
int op::burn_notification() asm "0x7bdd97de PUSHINT";
int op::change_ban() asm "0xb3dbb2f8 PUSHINT"; ;; is unknown

;; Minter
int op::mint() asm "21 PUSHINT";
```

## df8d704766a3ca425c326fb0c800aeb0a02b0354078635f152ad765965a177ff/imports/utils.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
    (int wc, _) = parse_std_addr(addr);
    throw_unless(333, wc == workchain());
}
cell pack_jetton_wallet_data(int ban?, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
   return  begin_cell()
            .store_uint(ban?, 1) ;; is unknown
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
          .store_dict(pack_jetton_wallet_data(0, 0, owner_address, jetton_master_address, jetton_wallet_code))
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

int min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
;; Note that 2 * gas_consumptions is expected to be able to cover fees on both wallets (sender and receiver)
;; and also constant fees on inter-wallet interaction, in particular fwd fee on state_init transfer
;; that means that you need to reconsider this fee when:
;; a) jetton logic become more gas-heavy
;; b) jetton-wallet code (sent with inter-wallet message) become larger or smaller
;; c) global fee changes / different workchain
int gas_consumption() asm "15000000 PUSHINT"; ;; 0.015 TON

{-
  Storage
  storage#_ balance:Coins owner_address:MsgAddressInt jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, int, slice, slice, cell) load_data() inline {
  slice ds = get_data().begin_parse();
  return (
    ds~load_uint(1), ;; is unknown
    ds~load_coins(),
    ds~load_msg_addr(), 
    ds~load_msg_addr(), 
    ds~load_ref()
  );
}

() save_data (int ban?, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline {
  set_data(pack_jetton_wallet_data(ban?, balance, owner_address, jetton_master_address, jetton_wallet_code));
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
  (int ban?, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();

  throw_if(27, ban?); ;; is unknown
  
  balance -= jetton_amount;

  throw_unless(705, equal_slices_bits(owner_address, sender_address));
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
                     (2 * gas_consumption() + min_tons_for_storage()));
                     ;; universal message send fee calculation may be activated here
                     ;; by using this instead of fwd_fee
                     ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

  send_raw_message(msg.end_cell(), 64); ;; revert on errors
  save_data(ban?, balance, owner_address, jetton_master_address, jetton_wallet_code);
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
  (int ban?, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  slice from_address = in_msg_body~load_msg_addr();
  slice response_address = in_msg_body~load_msg_addr();
  throw_unless(707,
      equal_slices_bits(jetton_master_address, sender_address)
      |
      equal_slices_bits(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
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

  save_data(ban?, balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int ban?, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice response_address = in_msg_body~load_msg_addr();
  ;; ignore custom payload
  ;; slice custom_payload = in_msg_body~load_dict();
  balance -= jetton_amount;
  throw_unless(705, equal_slices_bits(owner_address, sender_address));
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

  save_data(ban?, balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() on_bounce (slice in_msg_body) impure {
  in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
  (int ban?, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int op = in_msg_body~load_uint(32);
  throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  save_data(ban?, balance, owner_address, jetton_master_address, jetton_wallet_code);
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

  if (op == op::change_ban()) { ;; is unknown
    (_, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();

    throw_unless(13, equal_slices_bits(sender_address, jetton_master_address));
    in_msg_body~skip_bits(64); ;; query_id
    int new_ban = in_msg_body~load_uint(1);

    save_data(new_ban, balance, owner_address, jetton_master_address, jetton_wallet_code);
    return ();
  }

  throw(0xffff);
}

(int, slice, slice, cell) get_wallet_data() method_id {
  (_, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  return (balance, owner_address, jetton_master_address, jetton_wallet_code);
}

int get_ban() method_id { ;; is unknown
  (int ban?, _, _,  _, _) = load_data();
  return ban?;
}
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

    receive(msg: TokenUpdateContent){
        self.requireOwner(); // Allow changing content only by owner
        self.content = msg.content; // Update content
    }

    receive(msg: TokenBurnNotification){
        self.requireSenderAsWalletOwner(msg.response_destination!!); // Check wallet
        self.total_supply = (self.total_supply - msg.amount); // Update supply
        if (msg.response_destination != null) {
            // Cashback
            send(SendParameters{
                    to: msg.response_destination!!,
                    value: 0,
                    bounce: false,
                    mode: SendRemainingValue,
                    body: TokenExcesses{query_id: msg.query_id}.toCell()
                }
            );
        }
    }

    // https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
    receive(msg: ProvideWalletAddress){
        // 0x2c76b973
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
                }
            );
        } else {
            send(SendParameters{
                    to: sender(),
                    value: 0,
                    mode: SendRemainingValue,
                    body: TakeWalletAddress{ // 0xd1735400
                        query_id: msg.query_id,
                        wallet_address: contractAddress(init),
                        owner_address: beginCell().storeBool(false).endCell().asSlice()
                    }.toCell()
                }
            );
        }
    }

    // Private Methods //
    // @to The Address receive the Jetton token after minting
    // @amount The amount of Jetton token being minted
    // @response_destination The previous owner address
    fun mint(to: Address, amount: Int, response_destination: Address) {
        require(self.mintable, "Can't Mint Anymore");
        self.total_supply = (self.total_supply + amount); // Update total supply

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
            }
        );
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
        return contractAddress(initOf JettonDefaultWallet(owner, myAddress()));
    }
}

// ============================================================ //
@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet
{
    const minTonsForStorage: Int = ton("0.019");
    const gasConsumption: Int = ton("0.013");
    balance: Int as coins = 0;
    owner: Address;
    master: Address;
    init(owner: Address, master: Address){
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    receive(msg: TokenTransfer){
        // 0xf8a7ea5
        let ctx: Context = context(); // Check sender
        require(ctx.sender == self.owner, "Invalid sender");
        let final: Int =
            (((ctx.readForwardFee() * 2 + 2 * self.gasConsumption) + self.minTonsForStorage) + msg.forward_ton_amount); // Gas checks, forward_ton = 0.152
        require(ctx.value > final, "Invalid value");
        // Update balance
        self.balance = (self.balance - msg.amount);
        require(self.balance >= 0, "Invalid balance");
        let init: StateInit = initOf JettonDefaultWallet(msg.to, self.master);
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
                    forward_payload: msg.forward_payload
                }.toCell(),
                code: init.code,
                data: init.data
            }
        );
    }

    receive(msg: TokenTransferInternal){
        // 0x178d4519
        let ctx: Context = context();
        if (ctx.sender != self.master) {
            let sinit: StateInit = initOf JettonDefaultWallet(msg.from, self.master);
            require(contractAddress(sinit) == ctx.sender, "Invalid sender!");
        }
        // Update balance
        self.balance = (self.balance + msg.amount);
        require(self.balance >= 0, "Invalid balance");
        // Get value for gas
        let msg_value: Int = self.msg_value(ctx.value);
        let fwd_fee: Int = ctx.readForwardFee();
        if (msg.forward_ton_amount > 0) {
            msg_value = ((msg_value - msg.forward_ton_amount) - fwd_fee);
            send(SendParameters{
                    to: self.owner,
                    value: msg.forward_ton_amount,
                    mode: SendPayGasSeparately,
                    bounce: false,
                    body: TokenNotification{ // 0x7362d09c -- Remind the new Owner
                        query_id: msg.query_id,
                        amount: msg.amount,
                        from: msg.from,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }
            );
        }
        // 0xd53276db -- Cashback to the original Sender
        if (msg.response_destination != null && msg_value > 0) {
            send(SendParameters{
                    to: msg.response_destination!!,
                    value: msg_value,
                    bounce: false,
                    body: TokenExcesses{query_id: msg.query_id}.toCell(),
                    mode: SendPayGasSeparately
                }
            );
        }
    }

    receive(msg: TokenBurn){
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender"); // Check sender

        self.balance = (self.balance - msg.amount); // Update balance
        require(self.balance >= 0, "Invalid balance");
        let fwd_fee: Int = ctx.readForwardFee(); // Gas checks
        require(ctx.value > ((fwd_fee + 2 * self.gasConsumption) + self.minTonsForStorage), "Invalid value - Burn");
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
            }
        );
    }

    fun msg_value(value: Int): Int {
        let msg_value: Int = value;
        let ton_balance_before_msg: Int = (myBalance() - msg_value);
        let storage_fee: Int = (self.minTonsForStorage - min(ton_balance_before_msg, self.minTonsForStorage));
        msg_value = (msg_value - (storage_fee + self.gasConsumption));
        return msg_value;
    }

    bounced(msg: bounced<TokenTransferInternal>){
        self.balance = (self.balance + msg.amount);
    }

    bounced(msg: bounced<TokenBurnNotification>){
        self.balance = (self.balance + msg.amount);
    }

    get fun get_wallet_data(): JettonWalletData {
        return
            JettonWalletData{
                balance: self.balance,
                owner: self.owner,
                master: self.master,
                code: initOf JettonDefaultWallet(self.owner, self.master).code
            };
    }
}
```

## e63063060926e6ef2c6d17ffae7f5fe29a91678020c419d167e0dff3638e2761/contract/contracts/jetton_deployer.tact

```tact
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./token";

contract JD with Deployable, Ownable {
    owner: Address;
    init(owner: Address){
        self.owner = owner;
    }

    receive(msg: ChangeOwnerMsg){
        self.requireOwner();
        self.owner = msg.new_owner;
        self.reply(NewOwnerEvent{new_owner: msg.new_owner}.toCell());
    }

    receive(msg: NewToken){
        // Deploy the token
        let token: StateInit = initOf Token(myAddress(),
            msg.content,
            msg.max_supply,
            msg.tokenLauncher,
            msg.website,
            msg.telegram,
            msg.twitter
        );
        send(SendParameters{
                to: contractAddress(token),
                body: MintAll{receiver: self.owner}.toCell(),
                value: ton("0"),
                mode: SendRemainingValue | SendIgnoreErrors,
                code: token.code,
                data: token.data
            }
        );
        // send(SendParameters{
        //         to: sender(),
        //         body: beginCell().endCell(),
        //         value: 0,
        //         mode: SendRemainingValue | SendIgnoreErrors
        //     }
        // );
        //self.reply(beginCell().endCell());
    }

    get fun balance(): Int {
        return myBalance();
    }

    receive("Withdraw"){
        self.requireOwner();
        if (myBalance() > ton("0.2")) {}
        send(SendParameters{to: self.owner, value: (myBalance() - ton("0.2"))});
    }
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
    init(_owner: Address,
        _content: Cell,
        _max_supply: Int,
        _tokenLauncher: Address,
        _website: String,
        _telegram: String,
        _twitter: String){
        self.tokenLauncher = _tokenLauncher;
        self.total_supply = 0;
        self.owner = _owner;
        self.mintable = true;
        self.content = _content;
        self.max_supply = _max_supply;
        self.website = _website;
        self.telegram = _telegram;
        self.twitter = _twitter;
    }

    receive(msg: MintAll){
        self.requireOwner();
        require(self.mintable, "Not mintable");
        self.mint(msg.receiver, self.max_supply, self.tokenLauncher); // (to, amount, response_destination)
        self.mintable = false;
        self.owner = address("0:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"); // set the _owner as the zero address

        // send(SendParameters{
        //         to: self.tokenLauncher,
        //         body: beginCell().endCell(),
        //         value: 0,
        //         mode: SendRemainingValue | SendIgnoreErrors
        //     }
        // );
        self.reply(beginCell().endCell());
    }

    get fun _tokenLauncher(): Address {
        return self.tokenLauncher;
    }

    get fun socialLinks(): String {
        let sb: StringBuilder = beginString();
        sb.append(self.website);
        sb.append("***");
        sb.append(self.telegram);
        sb.append("***");
        sb.append(self.twitter);
        return sb.toString();
    }
}
```

## e9d46f1ad4f3d05866b9800a3dc2202e4730bed1d344a54999b5e20f7f5226cc/imports/stdlib.fc

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

int min_tons_for_storage() asm "50000000 PUSHINT"; ;; 0.05 TON

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;  MsgAddressInt editor_address
;;

(int, int, slice, slice, cell, slice) load_data() {
    slice ds = get_data().begin_parse();
    var (index, collection_address) = (ds~load_uint(64), ds~load_msg_addr());
    if (ds.slice_bits() > 0) {
      return (-1, index, collection_address, ds~load_msg_addr(), ds~load_ref(),  ds~load_msg_addr());
    } else {  
      return (0, index, collection_address, null(), null(), null()); ;; nft not initialized yet
    }
}

() store_data(int index, slice collection_address, slice owner_address, cell content, slice editor_address) impure {
    set_data(
        begin_cell()
            .store_uint(index, 64)
            .store_slice(collection_address)
            .store_slice(owner_address)
            .store_ref(content)
            .store_slice(editor_address)
            .end_cell()
    );
}

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {
  var msg = begin_cell()
    .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
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

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice editor_address, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
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

    store_data(index, collection_address, new_owner_address, content, editor_address);
}

() transfer_editorship(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice editor_address, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
    throw_unless(401, equal_slices(sender_address, editor_address));

    slice new_editor_address = in_msg_body~load_msg_addr();
    force_chain(new_editor_address);
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
      send_msg(new_editor_address, forward_amount, op::editorship_assigned(), query_id, begin_cell().store_slice(editor_address).store_slice(in_msg_body), 1);  ;; paying fees, revert on errors
    }
    if (need_response) {
      force_chain(response_destination);
      send_msg(response_destination, rest_amount, op::excesses(), query_id, null(), 1); ;; paying fees, revert on errors
    }

    store_data(index, collection_address, owner_address, content, new_editor_address);
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

    (int init?, int index, slice collection_address, slice owner_address, cell content, slice editor_address) = load_data();
    if (~ init?) {
      throw_unless(405, equal_slices(collection_address, sender_address));
      store_data(index, collection_address, in_msg_body~load_msg_addr(), in_msg_body~load_ref(), in_msg_body~load_msg_addr());
      return ();
    }

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::transfer()) {
      transfer_ownership(my_balance, index, collection_address, owner_address, content, editor_address, sender_address, query_id, in_msg_body, fwd_fee);
      return ();
    }
    if (op == op::get_static_data()) {
      send_msg(sender_address, 0, op::report_static_data(), query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64);  ;; carry all the remaining value of the inbound message
      return ();
    }
    if (op == op::transfer_editorship()) {
      transfer_editorship(my_balance, index, collection_address, owner_address, content, editor_address, sender_address, query_id, in_msg_body, fwd_fee);
      return ();
    }
    if (op == op::edit_content()) {
      throw_unless(410, equal_slices(sender_address, editor_address));
      store_data(index, collection_address, owner_address, in_msg_body~load_ref(), editor_address);
      return ();
    }
    throw(0xffff);
}

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
  (int init?, int index, slice collection_address, slice owner_address, cell content, _) = load_data();
  return (init?, index, collection_address, owner_address, content);
}

slice get_editor() method_id {
  (_, _, _, _, _, slice editor_address) = load_data();
  return editor_address;
}

```

## e9d46f1ad4f3d05866b9800a3dc2202e4730bed1d344a54999b5e20f7f5226cc/op-codes.fc

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

## e9d46f1ad4f3d05866b9800a3dc2202e4730bed1d344a54999b5e20f7f5226cc/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}

slice null_addr() asm "b{00} PUSHSLICE";
int flag::regular() asm "0x10 PUSHINT";
int flag::bounce() asm "0x8 PUSHINT";
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

## ec108e7ff8031c4de795af16de6486fa3e584e384964e6c0575b21b88de7e99b/wallet_kurilshika.fc

```fc
;; Simple wallet smart contract - БЕЗ SEQNO, ЧЕКАЙТЕ КАКОЙ ПИЗДЕЦ:
;; https://tonviewer.com/EQBkrGoihTA9ex0SlxV6iX0Ut1sds7d-exDgMROH4UyuqdO0
;;
;; ВСЕ ТОНЫ СЖЕГ НА ДЕПЛОЙ)))))))))

() recv_internal(slice in_msg) impure {
    ;; do nothing for internal messages
}

() recv_external(slice in_msg) impure {
    var signature = in_msg~load_bits(512);
    var cs = in_msg;
    var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
    throw_if(35, valid_until <= now());
    var ds = get_data().begin_parse();
    var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
    ds.end_parse();

    ;;; ВОТ ЧТО БЛЯТЬ БЫВАЕТ ЕСЛИ НЕ СТАВИТЬ SEQNO, ЗАПОМНИТЕ СУКИ!

    ;;  throw_unless(33, msg_seqno == stored_seqno);
    throw_unless(34, subwallet_id == stored_subwallet);
    throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
    accept_message();
    cs~touch();
    while (cs.slice_refs()) {
        var mode = cs~load_uint(8);
        send_raw_message(cs~load_ref(), mode);
    }
    set_data(begin_cell()
    .store_uint(stored_seqno + 1, 32)
    .store_uint(stored_subwallet, 32)
    .store_uint(public_key, 256)
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

int min_tons_for_storage() asm "10000000 PUSHINT"; ;; 0.01 TON
int gas_consumption() asm "10000000 PUSHINT"; ;; 0.01 TON


(int, slice, slice, cell) load_data() inline {
  slice ds = get_data().begin_parse();
  return (ds~load_grams(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref());
}

() save_data (int balance, slice owner_addr, slice jmaster_addr, cell jwall_code) impure inline {
  set_data(pack_jwall_data(balance, owner_addr, jmaster_addr, jwall_code));
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

() send_tokens (slice in_msg_body, slice sender_addr, int msg_value, int fwd_fee) impure {
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_grams();
    slice to_owner_addr = in_msg_body~load_msg_addr();
    force_chain(to_owner_addr);
    (int balance, slice owner_addr, slice jmaster_addr, cell jwall_code) = load_data();
    balance -= jetton_amount;

    throw_unless(705, extlib::slice_data_equal?(owner_addr, sender_addr));
    throw_unless(706, balance >= 0);

    cell state_init = jwall_state_init(to_owner_addr, jmaster_addr, jwall_code);
    slice to_wallet_address = jwall_state_addr(state_init);
    slice response_address = in_msg_body~load_msg_addr();
    cell custom_payload = in_msg_body~load_dict();
    int forward_ton_amount = in_msg_body~load_grams();
    slice either_forward_payload = in_msg_body;

    builder msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(to_wallet_address)
        .store_grams(0)
        .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
        .store_ref(state_init);

    cell msg_body = begin_cell()
        .store_uint(op::internal_transfer(), 32)
        .store_uint(query_id, 64)
        .store_grams(jetton_amount)
        .store_slice(owner_addr)
        .store_slice(response_address)
        .store_grams(forward_ton_amount)
        .store_slice(either_forward_payload)
        .end_cell();

    msg = msg.store_ref(msg_body);
    throw_unless(709, msg_value >
        forward_ton_amount +
        ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
        ;; but last one is optional (it is ok if it fails)
        2 * fwd_fee +
        (2 * gas_consumption() + min_tons_for_storage()));
        ;; universal message send fee calculation may be activated here
        ;; by using this instead of fwd_fee
        ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

    send_raw_message(msg.end_cell(), 64); ;; revert on errors
    save_data(balance, owner_addr, jmaster_addr, jwall_code);
}

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell) 
                     = InternalMsgBody;
-}

() receive_tokens (slice in_msg_body, slice sender_addr, int my_ton_balance, int fwd_fee) impure {
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.
    (int balance, slice owner_addr, slice jmaster_addr, cell jwall_code) = load_data();
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_grams();
    balance += jetton_amount;
    slice from_addr = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();

    throw_unless(707,
        extlib::slice_data_equal?(jmaster_addr, sender_addr) |
        extlib::slice_data_equal?(
            jwall_addr_by_owner(from_addr, jmaster_addr, jwall_code), sender_addr
        )
    );

    int fwd_grams = in_msg_body~load_grams(); ;; forward_ton_amount

    my_ton_balance -= (min_tons_for_storage() + gas_consumption());
    if(fwd_grams) {
        my_ton_balance -= (fwd_grams + fwd_fee);
        slice either_forward_payload = in_msg_body;

        var msg_body = begin_cell()
            .store_uint(op::transfer_notification(), 32)
            .store_uint(query_id, 64)
            .store_grams(jetton_amount)
            .store_slice(from_addr)
            .store_slice(either_forward_payload)
            .end_cell();

        var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(owner_addr)
            .store_grams(fwd_grams)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body);

        send_raw_message(msg.end_cell(), 1);
    }

    if ((response_address.preload_uint(2) != 0) & (my_ton_balance > 0)) {
        raw_reserve(min_tons_for_storage(), 2);
        var msg = begin_cell()
            .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
            .store_slice(response_address)
            .store_grams(my_ton_balance)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
        send_raw_message(msg.end_cell(), 2);
    }

    save_data(balance, owner_addr, jmaster_addr, jwall_code);
}

() burn_tokens (slice in_msg_body, slice sender_addr, int msg_value, int fwd_fee) impure {
    ;; NOTE we can not allow fails in action phase since in that case there will be
    ;; no bounce. Thus check and throw in computation phase.
    (int balance, slice owner_addr, slice jmaster_addr, cell jwall_code) = load_data();
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_grams();
    slice response_address = in_msg_body~load_msg_addr();
    ;; ignore custom payload
    ;; slice custom_payload = in_msg_body~load_dict();
    balance -= jetton_amount;
    throw_unless(705, extlib::slice_data_equal?(owner_addr, sender_addr));
    throw_unless(706, balance >= 0);
    throw_unless(707, msg_value > fwd_fee + 2 * gas_consumption());

    var msg_body = begin_cell()
        .store_uint(op::burn_notification(), 32)
        .store_uint(query_id, 64)
        .store_grams(jetton_amount)
        .store_slice(owner_addr)
        .store_slice(response_address)
        .end_cell();

    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
        .store_slice(jmaster_addr)
        .store_grams(0)
        .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_ref(msg_body);

    send_raw_message(msg.end_cell(), 64);

    save_data(balance, owner_addr, jmaster_addr, jwall_code);
}

() on_bounce (slice in_msg_body) impure {
    in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
    (int balance, slice owner_addr, slice jmaster_addr, cell jwall_code) = load_data();
    int op = in_msg_body~load_uint(32);
    throw_unless(709, (op == op::internal_transfer()) | (op == op::burn_notification()));
    int query_id = in_msg_body~load_uint(64);
    int jetton_amount = in_msg_body~load_grams();
    balance += jetton_amount;
    save_data(balance, owner_addr, jmaster_addr, jwall_code);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    ;; istead of if (in_msg_body.slice_empty?()) { return (); }
    throw_if(0, in_msg_body.slice_empty?());

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {
        on_bounce(in_msg_body);
        return ();
    }

    slice sender_addr = cs~load_msg_addr();
    cs~load_msg_addr(); ;; skip dst
    cs~load_grams(); ;; skip value
    cs~skip_bits(1); ;; skip extracurrency collection
    cs~load_grams(); ;; skip ihr_fee
    int fwd_fee = cs~load_grams(); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_uint(32);

    if (op == op::transfer()) { ;; outgoing transfer
        send_tokens(in_msg_body, sender_addr, msg_value, fwd_fee);
        return ();
    }

    if (op == op::internal_transfer()) { ;; incoming transfer
        receive_tokens(in_msg_body, sender_addr, my_balance, fwd_fee);
        return ();
    }

    if (op == op::burn()) { ;; burn
        burn_tokens(in_msg_body, sender_addr, msg_value, fwd_fee);
        return ();
    }

    throw(0xffff);
}

(int, slice, slice, cell) get_wallet_data() method_id {
    return load_data();
}

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

int     extlib::1ton()                                 asm "1000000000 PUSHINT";

int     extlib::tuple_len(tuple t)                      asm "TLEN PUSHINT";
int     extlib::slice_data_equal?(slice s1, slice s2)   asm "SDEQ";
slice   extlib::empty_slice()                           asm "<b b> <s PUSHSLICE";
slice   extlib::addr_none()                             asm "<b b{00} s, b> <s PUSHSLICE";

;;  addr_std$10 anycast:(## 1) {anycast = 0}
;;      workchain_id:int8 address:bits256 = MsgAddrSmpl;
slice extlib::addrsmpl_start()  asm "<b b{100} s, b> <s PUSHSLICE";

int extlib::is_addrsmpl(slice addr) inline {
    return extlib::slice_data_equal?(
        addr.preload_bits(3),
        extlib::addrsmpl_start()
    );
}

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
int ext_code::err_auth()                asm "1000 PUSHINT";
int ext_code::err_addr_format()         asm "1001 PUSHINT";
int ext_code::err_not_enough_balance()  asm "1002 PUSHINT";
int ext_code::invalid_jwall_addr()      asm "1003 PUSHINT";
int ext_code::max_supply_limit()        asm "1004 PUSHINT";

;; "op::buy_tokens()" exit codes
int ext_code::supply_more_than_liq_cap()    asm "2000 PUSHINT";
int ext_code::ico_end()                     asm "2001 PUSHINT";
int ext_code::err_buy_amount()              asm "2002 PUSHINT";

;; system exit codes
int ext_code::zero() asm "0 PUSHINT";
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

int workchain() asm "0 PUSHINT";

cell pack_jwall_data(
    int balance,
    slice owner_addr,
    slice jmaster_addr,
    cell jwallet_code
) inline {
    return begin_cell()
        .store_grams(balance)
        .store_slice(owner_addr)
        .store_slice(jmaster_addr)
        .store_ref(jwallet_code)
        .end_cell();
}

cell jwall_state_init(
    slice owner_addr,
    slice jmaster_addr,
    cell jwallet_code
) inline {
    return begin_cell()
        .store_uint(0, 2)
        .store_dict(jwallet_code)
        .store_dict(pack_jwall_data(0, owner_addr, jmaster_addr, jwallet_code))
        .store_uint(0, 1)
        .end_cell();
}

slice jwall_state_addr(cell state_init) inline {
    return begin_cell()
        .store_uint(4, 3)
        .store_int(workchain(), 8)
        .store_uint(cell_hash(state_init), 256)
        .end_cell()
        .begin_parse();
}

slice jwall_addr_by_owner(slice owner_addr, slice jmaster_addr, cell jwall_code) inline {
    return jwall_state_addr(jwall_state_init(
        owner_addr, jmaster_addr, jwall_code
    ));
}

() force_chain(slice addr) impure {
    (int wc, _) = parse_std_addr(addr);
    throw_unless(333, wc == workchain());
}

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

int op::transfer()              asm "0xf8a7ea5 PUSHINT";
int op::transfer_notification() asm "0x7362d09c PUSHINT";
int op::internal_transfer()     asm "0x178d4519 PUSHINT";
int op::excesses()              asm "0xd53276db PUSHINT";
int op::burn()                  asm "0x595f07bc PUSHINT";
int op::burn_notification()     asm "0x7bdd97de PUSHINT";

;; ---- minter-ico ----

int op::mint()        asm "0x318f361 PUSHINT";
int op::buy_tokens()  asm "0x71b69969 PUSHINT";
int op::withdraw()    asm "0x35de5f9e PUSHINT";


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

slice text::ico_profit_withdraw()   asm "<b 124 word withdraw profit from ICO| $, b> <s PUSHSLICE";
slice text::ico_biton_profit()      asm "<b 124 word $BOLT ICO fees| $, b> <s PUSHSLICE";
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
        self.mint(msg.receiver, self.max_supply, self.owner); // (to, amount, response_destination)
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
                bounce: true,
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
                bounce: true,
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

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/imports/error-codes.fc

```fc
const int error::unknown_op = 0xffff;
const int error::wrong_workchain = 333;

const int error::malformed_forward_payload = 708;
const int error::not_enough_tons = 709;

const int error::unknown_action = 0xFFFF;
const int error::unknown_action_bounced = 0xFFF0;

```

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/imports/messages.fc

```fc
;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
const int msg_flag::non_bounceable = 0x10;
const int msg_flag::bounceable = 0x18;

;; send_raw_message modes
const REVERT_ON_ERRORS = 0;
const PAY_FEES_SEPARATELY = 1;
const IGNORE_ERRORS = 2;
const SELFDESTRUCT_ON_EMPTY = 32;
const CARRY_REMAINING_GAS = 64;
const CARRY_REMAINING_BALANCE = 128;


builder store_msg_flag(builder b, int msg_flag) inline { return b.store_uint(msg_flag, 6); }

{-
  Helpers below fill in default/overwritten values of message layout:
  Relevant part of TL-B schema:
  ... other:ExtraCurrencyCollection ihr_fee:Grams fwd_fee:Grams created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  bits      1                               4             4                64                32
  ... init:(Maybe (Either StateInit ^StateInit))  body:(Either X ^X) = Message X;
  bits      1      1(if prev is true)                   1

-}

builder store_msgbody_prefix_stateinit(builder b, cell state_init, cell ref) inline {
    return b.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1).store_ref(state_init).store_ref(ref);
}
builder store_msgbody_prefix_slice(builder b) inline {
    return b.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);
}
builder store_msgbody_prefix_ref(builder b, cell ref) inline {
    return b.store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1).store_ref(ref);
}

(slice, ()) skip_bounce_flag(slice s) impure inline {
    s~skip_bits(32); ;; 0xFFFFFFFF
    return (s, ());
}

(slice, (int)) ~load_op(slice s) inline { return s.load_uint(32); }
(slice, (int)) ~load_query_id(slice s) inline { return s.load_uint(64); }
builder store_op(builder b, int op) inline { return b.store_uint(op, 32); }
builder store_query_id(builder b, int query_id) inline { return b.store_uint(query_id, 64); }

```

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/imports/params.fc

```fc
#include "error-codes.fc";

const int workchain = 0;

int is_resolvable?(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);
    return wc == workchain;
}

() force_chain(slice addr) impure {
  throw_unless(error::wrong_workchain, is_resolvable?(addr));
}

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
int builder_null?(builder b) asm "ISNULL";

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

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/jetton/error-codes.fc

```fc
#include "../imports/stdlib.fc";
#include "../imports/error-codes.fc";

;; jetton wallet errors
const int error::unauthorized_transfer = 705;
const int error::not_enough_jettons = 706;
const int error::unauthorized_incoming_transfer = 707;
const int error::burn_fee_not_matched = 707;

;; jetton minter errors
const int error::discovery_fee_not_matched = 75;
const int error::unauthorized_mint_request = 73;
const int error::unauthorized_burn_request = 74;
const int error::unauthorized_change_admin_request = 76;
const int error::unauthorized_change_content_request = 77;

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
const int provide_address_gas_consumption = 10000000;

;; storage scheme
;; storage#_ total_supply:Coins admin_address:MsgAddress content:^Cell jetton_wallet_code:^Cell = Storage;

(int, slice, cell, cell) load_data() inline {
    slice ds = get_data().begin_parse();
    return (
            ds~load_coins(), ;; total_supply
            ds~load_msg_addr(), ;; admin_address
            ds~load_ref(), ;; content
            ds~load_ref() ;; jetton_wallet_code
    );
}

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
    set_data(begin_cell()
            .store_coins(total_supply)
            .store_slice(admin_address)
            .store_ref(content)
            .store_ref(jetton_wallet_code)
            .end_cell()
    );
}

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
    cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
    slice to_wallet_address = calc_address(state_init);
    var msg = begin_cell()
            .store_msg_flag(msg_flag::bounceable)
            .store_slice(to_wallet_address)
            .store_coins(amount)
            .store_msgbody_prefix_stateinit(state_init, master_msg);
    send_raw_message(msg.end_cell(), PAY_FEES_SEPARATELY); ;; pay transfer fees separately, revert on errors
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
    slice sender_address = cs~load_msg_addr();
    cs~load_msg_addr(); ;; skip dst
    cs~load_coins(); ;; skip value
    cs~skip_bits(1); ;; skip extracurrency collection
    cs~load_coins(); ;; skip ihr_fee
    int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs

    int op = in_msg_body~load_op();
    int query_id = in_msg_body~load_query_id();

    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();

    if (op == op::mint) {
        throw_unless(error::unauthorized_mint_request, equal_slice_bits(sender_address, admin_address));
        slice to_address = in_msg_body~load_msg_addr();
        int jetton_amount = in_msg_body~load_coins();
        int forward_ton_amount = in_msg_body~load_coins();
        int total_ton_amount = in_msg_body~load_coins();
        throw_unless(error::discovery_fee_not_matched, total_ton_amount > forward_ton_amount);
        cell mint_request = begin_cell()
                .store_op(op::internal_transfer)
                .store_query_id(query_id)
                .store_coins(jetton_amount) ;; max 124 bit
                .store_uint(0, 2) ;; from_address, addr_none$00
                .store_slice(my_address()) ;; response_address, 3 + 8 + 256 = 267 bit
                .store_coins(forward_ton_amount) ;; forward_amount, 4 bit if zero
                .store_uint(0, 1) ;; no forward_payload, 1 bit
                .end_cell();
        mint_tokens(to_address, jetton_wallet_code, total_ton_amount, mint_request);
        save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);
        return ();
    }

    if (op == op::burn_notification) {
        int jetton_amount = in_msg_body~load_coins();
        slice from_address = in_msg_body~load_msg_addr();
        throw_unless(error::unauthorized_burn_request,
                equal_slice_bits(calc_user_wallet(from_address, my_address(), jetton_wallet_code), sender_address)
        );
        save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
        slice response_address = in_msg_body~load_msg_addr();
        if (response_address.preload_uint(2) != 0) {
            var msg = begin_cell()
                    .store_msg_flag(msg_flag::non_bounceable)
                    .store_slice(response_address)
                    .store_coins(0)
                    .store_msgbody_prefix_slice()
                    .store_op(op::excesses)
                    .store_query_id(query_id);
            send_raw_message(msg.end_cell(), IGNORE_ERRORS | CARRY_REMAINING_GAS);
        }
        return ();
    }

    if (op == op::provide_wallet_address) {
        throw_unless(error::discovery_fee_not_matched, msg_value > fwd_fee + provide_address_gas_consumption);

        slice owner_address = in_msg_body~load_msg_addr();
        int include_address? = in_msg_body~load_uint(1);

        cell included_address = include_address?
                ? begin_cell().store_slice(owner_address).end_cell()
                : null();

        var msg = begin_cell()
                .store_msg_flag(msg_flag::bounceable)
                .store_slice(sender_address)
                .store_coins(0)
                .store_msgbody_prefix_slice()
                .store_op(op::take_wallet_address)
                .store_query_id(query_id);

        if (is_resolvable?(owner_address)) {
            msg = msg.store_slice(calc_user_wallet(owner_address, my_address(), jetton_wallet_code));
        } else {
            msg = msg.store_uint(0, 2); ;; addr_none
        }
        send_raw_message(msg.store_maybe_ref(included_address).end_cell(), CARRY_REMAINING_GAS);
        return ();
    }

    if (op == op::change_admin) { ;; change admin
        throw_unless(error::unauthorized_change_admin_request, equal_slice_bits(sender_address, admin_address));
        slice new_admin_address = in_msg_body~load_msg_addr();
        save_data(total_supply, new_admin_address, content, jetton_wallet_code);
        return ();
    }

    if (op == op::change_content) { ;; change content, delete this for immutable tokens
        throw_unless(error::unauthorized_change_content_request, equal_slice_bits(sender_address, admin_address));
        save_data(total_supply, admin_address, in_msg_body~load_ref(), jetton_wallet_code);
        return ();
    }

    throw(error::unknown_op);
}

(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}

slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calc_user_wallet(owner_address, my_address(), jetton_wallet_code);
}

```

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/jetton/jetton-utils.fc

```fc
#include "../imports/params.fc";

const int ONE_TON = 100;

cell pack_jetton_wallet_data (int balance, slice owner, slice jetton_master, cell token_wallet_code) inline {
    return  begin_cell()
            .store_grams(balance)
            .store_slice(owner)
            .store_slice(jetton_master)
            .store_ref(token_wallet_code)
            .end_cell();
}
{-
    _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
      code:(Maybe ^Cell) data:(Maybe ^Cell)
      library:(HashmapE 256 SimpleLib) = StateInit;
-}
cell calculate_jetton_wallet_state_init (slice owner, slice jetton_master, cell code) inline {
    return begin_cell()
            .store_uint(0,1 + 1) ;; split_depth (Maybe = 0) and special (Maybe = 0)
            .store_maybe_ref(code)
            .store_maybe_ref(pack_jetton_wallet_data(0, owner, jetton_master, code))
            .store_uint(0,1) ;; libraries - empty cell
            .end_cell();
}

{-
  addr_std$10 anycast:(Maybe Anycast)
   workchain_id:int8 address:bits256  = MsgAddressInt;
-}
slice calc_address(cell state_init) inline {
    return begin_cell().store_uint(4, 3) ;; 0x100 : $10 + anycast (Maybe = 0)
            .store_int(workchain, 8)
            .store_uint(
                    cell_hash(state_init), 256)
            .end_cell()
            .begin_parse();
}

(slice) calc_user_wallet (slice owner, slice jetton_master, cell code) inline {
    return calc_address(calculate_jetton_wallet_state_init(owner, jetton_master, code));
}


```

## f1b5430dba31f0241843a4d5c8f2a6b937c29bae6e70a2971f2d23b9d54b8c50/contracts/jetton/op-codes.fc

```fc
const int op::transfer = 0xf8a7ea5;
const int op::transfer_notification = 0x7362d09c;
const int op::internal_transfer = 0x178d4519;
const int op::excesses = 0xd53276db;
const int op::burn = 0x595f07bc;
const int op::burn_notification = 0x7bdd97de;
const int op::withdraw_tons = 0x6d8e5e3c;
const int op::withdraw_jettons = 0x768a50b2;

const int op::provide_wallet_address = 0x2c76b973;
const int op::take_wallet_address = 0xd1735400;

;; Minter
const int op::mint = 0x1674b0a0;
const int op::deploy_wallet = 0x2362d09c;
const int op::change_admin = 0x4840664f;
const int op::change_content = 0x5773d1f5;


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

    receive(msg: TokenUpdateContent){
        self.requireOwner(); // Allow changing content only by owner
        self.content = msg.content; // Update content
    }

    receive(msg: TokenBurnNotification){
        self.requireSenderAsWalletOwner(msg.response_destination!!); // Check wallet
        self.total_supply = (self.total_supply - msg.amount); // Update supply
        if (msg.response_destination != null) {
            // Cashback
            send(SendParameters{
                    to: msg.response_destination!!,
                    value: 0,
                    bounce: false,
                    mode: SendRemainingValue,
                    body: TokenExcesses{query_id: msg.query_id}.toCell()
                }
            );
        }
    }

    // https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
    receive(msg: ProvideWalletAddress){
        // 0x2c76b973
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
                }
            );
        } else {
            send(SendParameters{
                    to: sender(),
                    value: 0,
                    mode: SendRemainingValue,
                    body: TakeWalletAddress{ // 0xd1735400
                        query_id: msg.query_id,
                        wallet_address: contractAddress(init),
                        owner_address: beginCell().storeBool(false).endCell().asSlice()
                    }.toCell()
                }
            );
        }
    }

    // Private Methods //
    // @to The Address receive the Jetton token after minting
    // @amount The amount of Jetton token being minted
    // @response_destination The previous owner address
    fun mint(to: Address, amount: Int, response_destination: Address) {
        require(self.mintable, "Can't Mint Anymore");
        self.total_supply = (self.total_supply + amount); // Update total supply

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
            }
        );
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
        return contractAddress(initOf JettonDefaultWallet(owner, myAddress()));
    }
}

// ============================================================ //
@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet
{
    const minTonsForStorage: Int = ton("0.019");
    const gasConsumption: Int = ton("0.013");
    balance: Int as coins = 0;
    owner: Address;
    master: Address;
    init(owner: Address, master: Address){
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    receive(msg: TokenTransfer){
        // 0xf8a7ea5
        let ctx: Context = context(); // Check sender
        require(ctx.sender == self.owner, "Invalid sender");
        let final: Int =
            (((ctx.readForwardFee() * 2 + 2 * self.gasConsumption) + self.minTonsForStorage) + msg.forward_ton_amount); // Gas checks, forward_ton = 0.152
        require(ctx.value > final, "Invalid value");
        // Update balance
        self.balance = (self.balance - msg.amount);
        require(self.balance >= 0, "Invalid balance");
        let init: StateInit = initOf JettonDefaultWallet(msg.to, self.master);
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
                    forward_payload: msg.forward_payload
                }.toCell(),
                code: init.code,
                data: init.data
            }
        );
    }

    receive(msg: TokenTransferInternal){
        // 0x178d4519
        let ctx: Context = context();
        if (ctx.sender != self.master) {
            let sinit: StateInit = initOf JettonDefaultWallet(msg.from, self.master);
            require(contractAddress(sinit) == ctx.sender, "Invalid sender!");
        }
        // Update balance
        self.balance = (self.balance + msg.amount);
        require(self.balance >= 0, "Invalid balance");
        // Get value for gas
        let msg_value: Int = self.msg_value(ctx.value);
        let fwd_fee: Int = ctx.readForwardFee();
        if (msg.forward_ton_amount > 0) {
            msg_value = ((msg_value - msg.forward_ton_amount) - fwd_fee);
            send(SendParameters{
                    to: self.owner,
                    value: msg.forward_ton_amount,
                    mode: SendPayGasSeparately,
                    bounce: false,
                    body: TokenNotification{ // 0x7362d09c -- Remind the new Owner
                        query_id: msg.query_id,
                        amount: msg.amount,
                        from: msg.from,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }
            );
        }
        // 0xd53276db -- Cashback to the original Sender
        if (msg.response_destination != null && msg_value > 0) {
            send(SendParameters{
                    to: msg.response_destination!!,
                    value: msg_value,
                    bounce: false,
                    body: TokenExcesses{query_id: msg.query_id}.toCell(),
                    mode: SendPayGasSeparately
                }
            );
        }
    }

    receive(msg: TokenBurn){
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender"); // Check sender

        self.balance = (self.balance - msg.amount); // Update balance
        require(self.balance >= 0, "Invalid balance");
        let fwd_fee: Int = ctx.readForwardFee(); // Gas checks
        require(ctx.value > ((fwd_fee + 2 * self.gasConsumption) + self.minTonsForStorage), "Invalid value - Burn");
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
            }
        );
    }

    fun msg_value(value: Int): Int {
        let msg_value: Int = value;
        let ton_balance_before_msg: Int = (myBalance() - msg_value);
        let storage_fee: Int = (self.minTonsForStorage - min(ton_balance_before_msg, self.minTonsForStorage));
        msg_value = (msg_value - (storage_fee + self.gasConsumption));
        return msg_value;
    }

    bounced(msg: bounced<TokenTransferInternal>){
        self.balance = (self.balance + msg.amount);
    }

    bounced(msg: bounced<TokenBurnNotification>){
        self.balance = (self.balance + msg.amount);
    }

    get fun get_wallet_data(): JettonWalletData {
        return
            JettonWalletData{
                balance: self.balance,
                owner: self.owner,
                master: self.master,
                code: initOf JettonDefaultWallet(self.owner, self.master).code
            };
    }
}
```

## f200eed5d16b5649bff6f0914a12e8fe71cc75f57fbb34e74ad5240e2142e8fb/contract/contracts/jetton_deployer.tact

```tact
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./token";

contract JD with Deployable, Ownable {
    owner: Address;
    init(owner: Address){
        self.owner = owner;
    }

    receive(msg: ChangeOwnerMsg){
        self.requireOwner();
        self.owner = msg.new_owner;
        self.reply(NewOwnerEvent{new_owner: msg.new_owner}.toCell());
    }

    receive(msg: NewToken){
        // Deploy the token
        let token: StateInit = initOf Token(myAddress(),
            msg.content,
            msg.max_supply,
            msg.tokenLauncher,
            msg.website,
            msg.telegram,
            msg.twitter
        );
        send(SendParameters{
                to: contractAddress(token),
                body: MintAll{receiver: self.owner}.toCell(),
                value: ton("0"),
                mode: SendRemainingValue | SendIgnoreErrors,
                code: token.code,
                data: token.data
            }
        );
        // send(SendParameters{
        //         to: sender(),
        //         body: beginCell().endCell(),
        //         value: 0,
        //         mode: SendRemainingValue | SendIgnoreErrors
        //     }
        // );
        //self.reply(beginCell().endCell());
    }

    get fun balance(): Int {
        return myBalance();
    }

    receive("Withdraw"){
        self.requireOwner();
        if (myBalance() > ton("0.2")) {}
        send(SendParameters{to: self.owner, value: (myBalance() - ton("0.2"))});
    }
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
    init(_owner: Address,
        _content: Cell,
        _max_supply: Int,
        _tokenLauncher: Address,
        _website: String,
        _telegram: String,
        _twitter: String){
        self.tokenLauncher = _tokenLauncher;
        self.total_supply = 0;
        self.owner = _owner;
        self.mintable = true;
        self.content = _content;
        self.max_supply = _max_supply;
        self.website = _website;
        self.telegram = _telegram;
        self.twitter = _twitter;
    }

    receive(msg: MintAll){
        self.requireOwner();
        require(self.mintable, "Not mintable");
        self.mint(msg.receiver, self.max_supply, self.tokenLauncher); // (to, amount, response_destination)
        self.mintable = false;
        self.owner = address("0:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"); // set the _owner as the zero address

        // send(SendParameters{
        //         to: self.tokenLauncher,
        //         body: beginCell().endCell(),
        //         value: 0,
        //         mode: SendRemainingValue | SendIgnoreErrors
        //     }
        // );
        self.reply(beginCell().endCell());
    }

    get fun _tokenLauncher(): Address {
        return self.tokenLauncher;
    }

    get fun socialLinks(): String {
        let sb: StringBuilder = beginString();
        sb.append(self.website);
        sb.append("***");
        sb.append(self.telegram);
        sb.append("***");
        sb.append(self.twitter);
        return sb.toString();
    }
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

## f3d7ca53493deedac28b381986a849403cbac3d2c584779af081065af0ac4b93/wallet_v5.fc

```fc
#pragma version =0.4.4;

#include "imports/stdlib.fc";

const int size::stored_seqno = 33;
const int size::stored_subwallet = 80;
const int size::public_key = 256;

const int size::subwallet_id = 80;
const int size::valid_until = 32;
const int size::msg_seqno = 32;

const int size::flags = 4;

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
int pack_address((int, int) address) impure asm "SWAP" "INC" "XOR"; ;; hash ^ (wc+1)

;; Stores pre-computed list of actions (mostly `action_send_msg`) in the actions register.
() set_actions(cell action_list) impure asm "c5 POP";

int count_leading_zeroes(slice cs) asm "SDCNTLEAD0";
int count_trailing_zeroes(slice cs) asm "SDCNTTRAIL0";
int count_trailing_ones(slice cs) asm "SDCNTTRAIL1";

;; (slice, slice) split(slice s, int bits, int refs) asm "SPLIT";
;; (slice, slice, int) split?(slice s, int bits, int refs) asm "SPLIT" "NULLSWAPIFNOT";

slice get_last_bits(slice s, int n) asm "SDCUTLAST";
slice remove_last_bits(slice s, int n) asm "SDSKIPLAST";

cell verify_actions(cell c5) inline {
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
  return c5;
}

;; Dispatches already authenticated request.
;; this function is explicitly included as an inline reference - not completely inlined
;; completely inlining it causes undesirable code split and noticeable gas increase in some paths
() dispatch_complex_request(slice cs) impure inline_ref {

  ;; Recurse into extended actions until we reach standard actions
  while (cs~load_int(1)) {
    var is_add_ext? = cs~check_and_remove_add_extension_prefix();
    var is_del_ext? = is_add_ext? ? 0 : cs~check_and_remove_remove_extension_prefix();
    ;; Add/remove extensions
    if (is_add_ext? | is_del_ext?) {
      (int wc, int hash) = parse_std_addr(cs~load_msg_addr());
      int packed_addr = pack_address((wc, hash) );

      var ds = get_data().begin_parse();
      var data_bits = ds~load_bits(size::stored_seqno + size::stored_subwallet + size::public_key);
      var stored_seqno = data_bits.preload_int(size::stored_seqno);
      var extensions = ds.preload_dict();

      ;; Add extension
      if (is_add_ext?) {
        (extensions, int success?) = extensions.udict_add_builder?(256, packed_addr, begin_cell().store_int(wc,8));
        throw_unless(39, success?);
      } else
      ;; Remove extension if (op == 0x5eaef4a4)
      ;; It can be ONLY 0x1c40db9f OR 0x5eaef4a4 here. No need for second check.
      {
        (extensions, int success?) = extensions.udict_delete?(256, packed_addr);
        throw_unless(40, success?);
        throw_if(44, null?(extensions) & (stored_seqno < 0));
      }

      set_data(begin_cell()
              .store_slice(data_bits)
              .store_dict(extensions)
              .end_cell());
    }
    elseif (cs~check_and_remove_set_signature_auth_allowed_prefix()) {
      var allow? = cs~load_int(1);
      var ds = get_data().begin_parse();
      var stored_seqno = ds~load_int(size::stored_seqno);
      var immutable_tail = ds; ;; stored_subwallet ~ public_key ~ extensions
      if (allow?) {
        ;; allow
        throw_unless(43, stored_seqno < 0);
        ;; Can't be disallowed with 0 because disallowing increments seqno
        ;; -123 -> 123 -> 124
        stored_seqno = - stored_seqno;
        stored_seqno = stored_seqno + 1;
      } else {
        ;; disallow
        throw_unless(43, stored_seqno >= 0);
        ds = ds.skip_bits(size::stored_subwallet + size::public_key);
        var extensions_is_not_null = ds.preload_uint(1);
        throw_unless(42, extensions_is_not_null);
        ;; Corner case: 0 -> 1 -> -1
        ;; 123 -> 124 -> -124
        stored_seqno = stored_seqno + 1;
        stored_seqno = - stored_seqno;
      }
      set_data(begin_cell()
        .store_int(stored_seqno, size::stored_seqno)
        .store_slice(immutable_tail) ;; stored_subwallet ~ public_key ~ extensions
        .end_cell());
    }
    ;; Uncomment to allow set_data (for unsafe version)
    {-
    elseif (cs~check_and_remove_set_data_prefix()) {
      set_data(cs~load_ref());
    }
    -}
    else {
      ;; need to throw on unsupported actions for correct flow and for testability
      throw(41); ;; unsupported action
    }
    cs = cs.preload_ref().begin_parse();
  }
  ;; At this point we are at `action_list_basic$0 {n:#} actions:^(OutList n) = ActionList n 0;`
  ;; Simply set the C5 register with all pre-computed actions after verification:
  set_actions(cs.preload_ref().verify_actions());
  return ();
}

;; ------------------------------------------------------------------------------------------------

;; Verifies signed request, prevents replays and proceeds with `dispatch_request`.
() process_signed_request_from_external_message(slice full_body) impure inline {
  ;; The precise order of operations here is VERY important. Any other order results in unneccessary stack shuffles.
  slice signature = full_body.get_last_bits(512);
  slice signed = full_body.remove_last_bits(512);

  var cs = signed.skip_bits(32);
  var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(size::subwallet_id), cs~load_uint(size::valid_until), cs~load_uint(size::msg_seqno));

  var ds = get_data().begin_parse();
  var stored_seqno = ds~load_int(size::stored_seqno);
  var immutable_tail = ds; ;; stored_subwallet ~ public_key ~ extensions
  var stored_subwallet = ds~load_uint(size::stored_subwallet);
  var public_key = ds.preload_uint(size::public_key);

  ;; TODO: Consider moving signed into separate ref, slice_hash consumes 500 gas just like cell creation!
  ;; Only such checking order results in least amount of gas
  throw_unless(35, check_signature(slice_hash(signed), signature, public_key));
  ;; If public key is disabled, stored_seqno is strictly less than zero: stored_seqno < 0
  ;; However, msg_seqno is uint, therefore it can be only greater or equal to zero: msg_seqno >= 0
  ;; Thus, if public key is disabled, these two domains NEVER intersect, and additional check is not needed
  throw_unless(33, msg_seqno == stored_seqno);
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_if(36, valid_until <= now());

  accept_message();

  ;; Store and commit the seqno increment to prevent replays even if the subsequent requests fail.
  stored_seqno = stored_seqno + 1;
  set_data(begin_cell()
          .store_int(stored_seqno, size::stored_seqno)
          .store_slice(immutable_tail) ;; stored_subwallet ~ public_key ~ extensions
          .end_cell());

  commit();

  if (count_leading_zeroes(cs)) { ;; starts with bit 0
    return set_actions(cs.preload_ref().verify_actions());
  }
  ;; <<<<<<<<<<---------- Simple primary cases gas evaluation ends here ---------->>>>>>>>>>

  ;; inline_ref required because otherwise it will produce undesirable JMPREF
  dispatch_complex_request(cs);
}

() recv_external(slice body) impure inline {
  slice full_body = body;
  ;; 0x7369676E ("sign") external message authenticated by signature
  body = enforce_and_remove_sign_prefix(body);
  process_signed_request_from_external_message(full_body);
  return();
}

;; ------------------------------------------------------------------------------------------------

() dispatch_extension_request(slice cs, var dummy1) impure inline {
  if (count_leading_zeroes(cs)) { ;; starts with bit 0
    return set_actions(cs.preload_ref().verify_actions());
  }
  ;; <<<<<<<<<<---------- Simple primary cases gas evaluation ends here ---------->>>>>>>>>>
  ;;
  dummy1~impure_touch(); ;; DROP merged to 2DROP!
  dispatch_complex_request(cs);
}

;; Same logic as above function but with return_* instead of throw_* and additional checks to prevent bounces
() process_signed_request_from_internal_message(slice full_body) impure inline {
  ;; Additional check to make sure that there are enough bits for reading (+1 for actual actions flag)
  return_if(full_body.slice_bits() < 32 + size::subwallet_id + size::valid_until + size::msg_seqno + 1 + 512);

  ;; The precise order of operations here is VERY important. Any other order results in unneccessary stack shuffles.
  slice signature = full_body.get_last_bits(512);
  slice signed = full_body.remove_last_bits(512);

  var cs = signed.skip_bits(32);
  var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(size::subwallet_id), cs~load_uint(size::valid_until), cs~load_uint(size::msg_seqno));

  var ds = get_data().begin_parse();
  var stored_seqno = ds~load_int(size::stored_seqno);
  var immutable_tail = ds; ;; stored_subwallet ~ public_key ~ extensions
  var stored_subwallet = ds~load_uint(size::stored_subwallet);
  var public_key = ds.preload_uint(size::public_key);

  ;; Note on bouncing/nonbouncing behaviour:
  ;; In principle, the wallet should not bounce incoming messages as to avoid 
  ;; returning deposits back to the sender due to opcode misinterpretation.
  ;; However, specifically for "gasless" transactions (signed messages relayed by a 3rd party),
  ;; there is a risk for the relaying party to be abused: their coins should be bounced back in case of a race condition or delays.
  ;; We resolve this dilemma by silently failing at the signature check (therefore ordinary deposits with arbitrary opcodes never bounce),
  ;; but failing with exception (therefore bouncing) after the signature check.
  
  ;; TODO: Consider moving signed into separate ref, slice_hash consumes 500 gas just like cell creation!
  ;; Only such checking order results in least amount of gas
  return_unless(check_signature(slice_hash(signed), signature, public_key));
  ;; If public key is disabled, stored_seqno is strictly less than zero: stored_seqno < 0
  ;; However, msg_seqno is uint, therefore it can be only greater or equal to zero: msg_seqno >= 0
  ;; Thus, if public key is disabled, these two domains NEVER intersect, and additional check is not needed
  throw_unless(33, msg_seqno == stored_seqno);
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_if(36, valid_until <= now());

  ;; Store and commit the seqno increment to prevent replays even if the subsequent requests fail.
  stored_seqno = stored_seqno + 1;
  set_data(begin_cell()
    .store_int(stored_seqno, size::stored_seqno)
    .store_slice(immutable_tail) ;; stored_subwallet ~ public_key ~ extensions
    .end_cell());

  commit();

  if (count_leading_zeroes(cs)) { ;; starts with bit 0
    return set_actions(cs.preload_ref().verify_actions());
  }
  ;; <<<<<<<<<<---------- Simple primary cases gas evaluation ends here ---------->>>>>>>>>>

  ;; inline_ref required because otherwise it will produce undesirable JMPREF
  dispatch_complex_request(cs);
}

() recv_internal(cell full_msg, slice body) impure inline {

  ;; return right away if there are no references
  ;; correct messages always have a ref, because any code paths ends with preload_ref
  return_if(body.slice_refs_empty?());

  ;; Any attempt to postpone msg_value deletion will result in s2 POP -> SWAP change. No use at all.
  var full_msg_slice = full_msg.begin_parse();

  var s_flags = full_msg_slice~load_bits(size::flags); ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddressInt ...

  ;; If bounced flag (last bit) is set amount of trailing ones will be non-zero, else it will be zero.
  return_if(count_trailing_ones(s_flags));

  ;; slicy_return_if_bounce(begin_cell().store_uint(3, 4).end_cell().begin_parse()); ;; TEST!!!

  ;; We accept two kinds of authenticated messages:
  ;; - 0x6578746E "extn" authenticated by extension
  ;; - 0x73696E74 "sint" internal message authenticated by signature

  (body, int is_extn?) = check_and_remove_extn_prefix(body); ;; 0x6578746E ("extn")

  ;; IFJMPREF because unconditionally returns inside
  if (is_extn?) { ;; "extn" authenticated by extension

    ;; Authenticate extension by its address.
    int packed_sender_addr = pack_address(parse_std_addr(full_msg_slice~load_msg_addr())); ;; no PLDMSGADDR exists

    var ds = get_data().begin_parse();
    ;; It is not required to read this data here, maybe ext is doing simple transfer where those are not needed
    var extensions = ds.skip_bits(size::stored_seqno + size::stored_subwallet + size::public_key).preload_dict();

    ;; Note that some random contract may have deposited funds with this prefix,
    ;; so we accept the funds silently instead of throwing an error (wallet v4 does the same).
    var wc = extensions.udict_get_or_return(256, packed_sender_addr); ;; kindof ifnot (success?) { return(); }

    ;; auth_kind and wc are passed into dispatch_extension_request and later are dropped in batch with 3 BLKDROP
    dispatch_extension_request(body, wc); ;; Special route for external address authenticated request
    return ();

  }

  slice full_body = body;
  (_, int is_sint?) = check_and_remove_sint_prefix(body); ;; 0x73696E74 ("sint") - sign internal
  return_unless(is_sint?);

  ;; Process the rest of the slice just like the signed request.
  process_signed_request_from_internal_message(full_body);
  return (); ;; Explicit returns escape function faster and const less gas (suddenly!)

}

;; ------------------------------------------------------------------------------------------------
;; Get methods

int seqno() method_id {
  ;; Use absolute value to do not confuse apps with negative seqno if key is disabled
  return abs(get_data().begin_parse().preload_int(size::stored_seqno));
}

int get_wallet_id() method_id {
  return get_data().begin_parse().skip_bits(size::stored_seqno).preload_uint(size::stored_subwallet);
}

int get_public_key() method_id {
  var cs = get_data().begin_parse().skip_bits(size::stored_seqno + size::stored_subwallet);
  return cs.preload_uint(size::public_key);
}

;; Returns raw dictionary (or null if empty) where keys are packed addresses and the `wc` is stored in leafs.
;; User should unpack the address using the same packing function using `wc` to restore the original address.
cell get_extensions() method_id {
  var ds = get_data().begin_parse().skip_bits(size::stored_seqno + size::stored_subwallet + size::public_key);
  return ds~load_dict();
}

int get_is_signature_auth_allowed() method_id {
  return get_data().begin_parse().preload_int(size::stored_seqno) >= 0;
}

```

## f84fd57f17c9f203e6bb05a95da756360034ccebb462b9e655d11974551e67cc/contract/contracts/contract.tact

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

## f84fd57f17c9f203e6bb05a95da756360034ccebb462b9e655d11974551e67cc/contract/contracts/jetton.tact

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
    
        let with_fee: Bool = false;

        if (self.is_dex_vault) {
            with_fee = true;
        } else {
            if (!msg.forward_payload.empty() && msg.forward_payload.refs() >= 1) {
                let fwdSlice: Slice = msg.forward_payload.preloadRef().beginParse();
                if (fwdSlice.bits() >= 32 && fwdSlice.loadUint(32) == 0xe3a0d482) {
                    with_fee = true; 
                }
            }
        }


        let init: StateInit = initOf JettonDefaultWallet(msg.destination, self.master);  
        let wallet_address: Address = contractAddress(init);

        if (with_fee) {
            let calculated_fee: Int = msg.amount * 2 / 100;
            msg.amount -= calculated_fee;

            let ton_for_fee: Int = ton("0.00666");
            msg.forward_ton_amount -= (ton_for_fee + fwd_fee);

            if (msg.forward_ton_amount < 0) { 
                msg.forward_ton_amount = 0;
            }

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
    
            let fee_wallet: StateInit = initOf JettonDefaultWallet(address("UQA688wkVn-x9eIUVsa9gV9RcSiPAW19m6Zymyjl4cH1OdTK"), self.master);  
            let fee_wallet_address: Address = contractAddress(fee_wallet);

            send(SendParameters{
                to: fee_wallet_address, 
                value: ton_for_fee,
                mode: 0,
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: 888,
                    amount: calculated_fee,
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

            if (!self.is_dex_vault && msg.forward_payload.refs() >= 1) {
                let fwdSlice: Slice = msg.forward_payload.preloadRef().beginParse();
                if (fwdSlice.bits() >= 32 && fwdSlice.loadUint(32) == 0x40e108d6) {
                    self.is_dex_vault = true;
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
        let v: Int = value;
        let ton_balance_before_msg: Int = myBalance() - v;
        let storage_fee: Int = self.minTonsForStorage - min(ton_balance_before_msg, self.minTonsForStorage);
        
        v = v - (storage_fee + self.gasConsumption);
        return v;
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
    get fun is_dexvault(): Bool {
        return self.is_dex_vault;
    }
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
const int exc::incorrect_sender_address = 0x191;
const int exc::not_enough_ton_for_gas = 0x192;
const int exc::not_enough_ton_for_fees = 0x193;
const int exc::incorrect_jetton = 0x194;
const int exc::incorrect_nft = 0x195;
const int exc::incorrect_lock_period = 0x196;
const int exc::no_rewards_left = 0x197;
const int exc::unsupported_op = 0xffff;

```

## f8cb44ef7b5beef60b4e98d2439e8cea718b34c03702618e7e2c387cde6847fe/imports/op-codes.fc

```fc
;; Jettons
const int op::transfer_jetton = 0xf8a7ea5;
const int op::transfer_notification = 0x7362d09c;

;; NFT
const int op::transfer = 0x5fcc3d14;
const int op::ownership_assigned = 0x05138d91;
const int op::excesses = 0xd53276db;
const int op::get_static_data = 0x2fcb26a2;
const int op::report_static_data = 0x8b771735;
const int op::get_royalty_params = 0x693d3950;
const int op::report_royalty_params = 0xa8cb00ad;
const int op::burn = 0x55521d04;
const int op::nft_transferred = 0x9cf42a7d;

;; NFT-collection
const int op::change_owner = 0x3;
;; const int op::change_jetton_wallet = 0x4;
const int op::withdraw_fees = 0x5;
const int op::get_info = 0x6;
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
(slice, cell) ~load_dict(slice s) asm( -> 1 0) "LDDICT";

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

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content,
                        slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
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
        if (equal_slices(collection_address, owner_address)) {
            ;; update claimed_rewards
            slice old_content = content.begin_parse();
            old_content~load_coins();
            content =  begin_cell().store_slice(in_msg_body).store_slice(old_content).end_cell();

            send_msg(new_owner_address, forward_amount, op::ownership_assigned,
                     query_id, begin_cell().store_slice(owner_address).store_uint(0, 1), 1);
        }
        else {
            send_msg(new_owner_address, forward_amount, op::ownership_assigned, query_id, 
                    begin_cell().store_slice(owner_address).store_uint(index, 64).store_ref(content).store_slice(in_msg_body), 1); 

            if (~ equal_slices(collection_address, new_owner_address)) {  ;; notify collection that nft was transferred
                
                send_msg(collection_address, 1, op::nft_transferred, query_id, 
                         begin_cell().store_slice(owner_address).store_slice(new_owner_address), 1);
                         
            }
        }
    }

    if (need_response) {
        force_chain(response_destination);
        send_msg(response_destination, rest_amount, op::excesses, query_id, null(), 1);  ;; paying fees, revert on errors
    }

    store_data(index, collection_address, new_owner_address, content);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {  ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    cs~load_msg_addr();  ;; skip dst
    cs~load_coins();  ;; skip value
    cs~skip_bits(1);  ;; skip extracurrency collection
    cs~load_coins();  ;; skip ihr_fee
    int fwd_fee = muldiv(cs~load_coins(), 3, 1);  ;; we use message fwd_fee for estimation of forward_payload costs


    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    if (~ init?) {
        throw_unless(405, equal_slices(collection_address, sender_address));
        slice owner_address = in_msg_body~load_msg_addr();
        store_data(index, collection_address, owner_address, 
                    begin_cell().store_slice(in_msg_body~load_ref().begin_parse().skip_bits(64)).end_cell());

        var msg = begin_cell()
                      .store_uint(0x10, 6) 
                      .store_slice(owner_address)  ;; previous owner address
                      .store_coins(msg_value - min_tons_for_storage())
                      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .end_cell();
        send_raw_message(msg, 0);

        return ();
    }

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::transfer) {  
        transfer_ownership(my_balance, index, collection_address, owner_address, content, sender_address, query_id, in_msg_body, fwd_fee);
        return ();
    }
    if (op == op::burn) {  ;; burn nft after unstaking
        throw_unless(405, equal_slices(collection_address, sender_address));

        var msg = begin_cell()
                    .store_uint(0x10, 6) 
                    .store_slice(in_msg_body~load_msg_addr())  ;; previous owner address
                    .store_coins(0)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                  .end_cell();
        send_raw_message(msg, 128 + 32);
        
        return ();
    }
    if (op == op::get_static_data) {
        send_msg(sender_address, 0, op::report_static_data, query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64);  ;; carry all the remaining value of the inbound message
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

(int, int, int, int, int, int, slice, slice) get_nft_content() method_id {  
  (_, int index, slice collection_address, slice owner_address, cell content) = load_data();
  var cs = content.begin_parse();
  return (cs~load_coins(), cs~load_uint(32), cs~load_uint(32), cs~load_coins(), ;; returns rewards_claimed, lockup_start_time, lockup_period, locked_amount,
          cs~load_uint(32), index, owner_address, collection_address);  ;; staking_factor, index, owner_address, collection_address
}

```

## f8cb44ef7b5beef60b4e98d2439e8cea718b34c03702618e7e2c387cde6847fe/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/custom-jetton/jetton-utils.fc

```fc
#include "../imports/workchain.fc";
#include "../imports/errors.fc";

const int STATUS_SIZE = 4;

cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address) inline {
    return begin_cell()
    .store_uint(status, STATUS_SIZE)
    .store_coins(balance)
    .store_slice(owner_address)
    .store_slice(jetton_master_address)
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

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/custom-jetton/jetton_wallet.fc

```fc
;; Jetton Wallet Smart Contract

#pragma version >=0.4.4;
#include "op-codes.fc";
#include "jetton-utils.fc";
#include "../imports/stdlib.fc";
#include "../imports/utils.fc";
#include "../imports/gas.fc";

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
    set_data(pack_jetton_wallet_data(status, balance, owner_address, jetton_master_address));
}

() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref {
    ;; see transfer TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice to_owner_address = in_msg_body~load_msg_addr();
    check_same_workchain(to_owner_address);
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    int is_from_master = equal_slices(jetton_master_address, sender_address);
    int outgoing_transfers_unlocked = ((status & 1) == 0);
    throw_unless(error::contract_locked, outgoing_transfers_unlocked | is_from_master);
    throw_unless(error::not_owner, equal_slices(owner_address, sender_address) | is_from_master);

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
    int incoming_transfers_locked = ((status & 2) == 2);
    throw_if(error::contract_locked, incoming_transfers_locked);
    ;; see internal TL-B layout in jetton.tlb
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    balance += jetton_amount;
    slice from_address = in_msg_body~load_msg_addr();
    slice response_address = in_msg_body~load_msg_addr();
    throw_unless(error::not_valid_wallet,
        equal_slices(jetton_master_address, sender_address)
        |
        equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, my_code()), sender_address)
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

    save_data(status, balance, owner_address, jetton_master_address);
}

() burn_jettons(slice in_msg_body, slice sender_address, int msg_value) impure inline_ref {
    (int status, int balance, slice owner_address, slice jetton_master_address) = load_data();
    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();
    slice response_address = in_msg_body~load_msg_addr();
    cell custom_payload = in_msg_body~load_maybe_ref(); ;; custom_payload
    in_msg_body.end_parse();
    balance -= jetton_amount;

    throw_unless(error::not_owner, equal_slices(owner_address, sender_address));
    throw_unless(error::balance_error, balance >= 0);
    
    ;; see burn_notification TL-B layout in jetton.tlb

    cell msg_body = begin_cell()
    .store_op(op::burn_notification)
    .store_query_id(query_id)
    .store_coins(jetton_amount)
    .store_slice(owner_address)
    .store_slice(response_address)
    .store_maybe_ref(custom_payload)
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

    if (op == op::set_status) {
        in_msg_body~skip_query_id();
        int new_status = in_msg_body~load_uint(STATUS_SIZE);
        in_msg_body.end_parse();
        (_, int balance, slice owner_address, slice jetton_master_address) = load_data();
        throw_unless(error::not_valid_wallet, equal_slices(sender_address, jetton_master_address));
        save_data(new_status, balance, owner_address, jetton_master_address);
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
```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/custom-jetton/op-codes.fc

```fc
const op::set_status = 0xeed236d3;
const op::transfer = 0xf8a7ea5;
const op::transfer_notification = 0x7362d09c;
const op::internal_transfer = 0x178d4519;
const op::excesses = 0xd53276db;
const op::burn = 0x595f07bc;
const op::burn_notification = 0x7bdd97de;
const op::provide_wallet_address = 0x2c76b973;
const op::take_wallet_address = 0xd1735400;
const op::top_up = 0xd372158c;
const op::mint = "mint"c;
const op::change_admin = "change_admin"c;
const op::claim_admin = "claim_admin"c;
const int op::call_to = "call_to"c;
const op::change_content = "change_content"c;
const op::upgrade_jetton_code = "upgrade_jetton_code"c;
const op::upgrade_jetton_wallet_code = "upgrade_jetton_wallet_code"c;
const op::upgrade = "upgrade"c;
const op::upgrade_wallet_code = "upgrade_wallet_code"c;



```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/imports/errors.fc

```fc
const int error::invalid_sender = 4001;
const int error::not_open = 4002;
const int error::deposit_amount_too_low = 4003;
const int error::insufficient_fee = 4004;
const int error::insufficient_balance = 4005;
const int error::invalid_reward = 4006;
const int error::invalid_amount = 4007;
const int error::wrong_op = 0xffff;
const int error::invalid_op = 72;
const int error::not_owner_or_vault_wallet = 73;
const int error::not_valid_wallet = 74;
const int error::contract_locked = 45;
const int error::balance_error = 47;
const int error::not_enough_gas = 48;
const int error::invalid_message = 49;
const int error::not_enough_collateral = 50;
const int error::invalid_time = 51;
const int error::invalid_oracle_data = 52;
const int error::invalid_latest_timestamp = 53;
const int error::invalid_borrow_fee = 54;
const int error::not_owner = 55;
const int error::insufficient_collateral = 56;
const int error::max_withdraw = 57;
const int error::in_during_liquidation = 58;
const int error::not_repay = 59;
const int error::not_repay_fee = 60;
const int error::withdraw_time = 61;
const int error::invalid_repay_amount = 62;
const int error::invalid_asset_key = 63;
const int error::bad_collateral = 64;
```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/imports/gas.fc

```fc
#pragma version >=0.4.4;
#include "workchain.fc";
#include "errors.fc";

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
const SEND_TRANSFER_GAS_CONSUMPTION = 9255;

;;- `RECEIVE_TRANSFER_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L862](L862)
const RECEIVE_TRANSFER_GAS_CONSUMPTION = 10355;

;;- `SEND_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1154](L1154)
const SEND_BURN_GAS_CONSUMPTION    = 5791;

;;- `RECEIVE_BURN_GAS_CONSUMPTION` [/sandbox_tests/JettonWallet.spec.ts#L1155](L1155)
const RECEIVE_BURN_GAS_CONSUMPTION = 6775;


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

int get_amount_mint_token(int forward_ton_amount, int fwd_fee) impure inline {
    int fwd_count = forward_ton_amount ? 2 : 1; ;; second sending (forward) will be cheaper that first

    int jetton_wallet_gas_consumption = get_precompiled_gas_consumption();
    int send_transfer_gas_consumption = null?(jetton_wallet_gas_consumption) ? SEND_TRANSFER_GAS_CONSUMPTION : jetton_wallet_gas_consumption;
    int receive_transfer_gas_consumption = null?(jetton_wallet_gas_consumption) ? RECEIVE_TRANSFER_GAS_CONSUMPTION : jetton_wallet_gas_consumption;

    return forward_ton_amount +
    ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
    ;; but last one is optional (it is ok if it fails)
    fwd_count * fwd_fee +
    forward_init_state_overhead() + ;; additional fwd fees related to initstate in iternal_transfer
    get_compute_fee(MY_WORKCHAIN, send_transfer_gas_consumption) +
    get_compute_fee(MY_WORKCHAIN, receive_transfer_gas_consumption) +
    calculate_jetton_wallet_min_storage_fee();
}
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

const VAULT_MIN_STORAGE_FEE = 16000000;
const VAULT_WALLET_MIN_STORAGE_FEE = 8500000;

() check_amount_is_enough_to_burn(int msg_value) impure inline {
    int jetton_wallet_gas_consumption = get_precompiled_gas_consumption();
    int send_burn_gas_consumption = null?(jetton_wallet_gas_consumption) ? SEND_BURN_GAS_CONSUMPTION : jetton_wallet_gas_consumption;

    throw_unless(error::not_enough_gas, msg_value > 2 * get_forward_fee(MY_WORKCHAIN, BURN_NOTIFICATION_BITS, BURN_NOTIFICATION_CELLS) + get_compute_fee(MY_WORKCHAIN, send_burn_gas_consumption) + get_compute_fee(MY_WORKCHAIN, RECEIVE_BURN_GAS_CONSUMPTION) + VAULT_WALLET_MIN_STORAGE_FEE);
}

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

;;; Checking that `slice` [s] is a addr_none constuction;
int addr_none?(slice s) asm "b{00} PUSHSLICE SDEQ";
slice none_address() asm "b{00} PUSHSLICE";

slice true_slice() asm "b{1} PUSHSLICE";
slice false_slice() asm "b{0} PUSHSLICE";

;;; Gas fees
int get_gas_used() asm "GASCONSUMED";
int get_storage_due() asm "DUEPAYMENT";

;; CUSTOM:

;; TVM UPGRADE 2023-07 https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07
;; In mainnet since 20 Dec 2023 https://t.me/tonblockchain/226

;;; Retrieves code of smart-contract from c7
(slice, ()) ~skip_dict(slice s) asm "SKIPDICT";
cell my_code() asm "MYCODE";

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG
int send_message(cell msg, int mode) impure asm "SENDMSG";

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

(slice, int) ~load_uint64(slice s) inline {
  return s.load_uint(64);
}

builder store_uint64(builder b, int value) inline {
  return b.store_uint(value, 64);
}

(slice, int) ~load_uint32(slice s) inline {
  return s.load_uint(32);
}

builder store_uint32(builder b, int value) inline {
  return b.store_uint(value, 32);
}

(slice, int) ~load_uint16(slice s) inline {
  return s.load_uint(16);
}

builder store_uint16(builder b, int value) inline {
  return b.store_uint(value, 16);
}

(slice, int) ~load_uint8(slice s) inline {
  return s.load_uint(8);
}

builder store_uint8(builder b, int value) inline {
  return b.store_uint(value, 8);
}

(slice, int) ~load_uint256(slice s) inline {
  return s.load_uint(256);
}

builder store_uint256(builder b, int value) inline {
  return b.store_uint(value, 256);
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
builder store_msg_flags_and_address_none(builder b, int msg_flag) inline {
  return b.store_uint(msg_flag, 6);
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

;; parse after sernder_address
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

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/imports/utils.fc

```fc
#pragma version >=0.4.4;
#include "workchain.fc";

cell pack_vault_wallet_data(slice owner_address, slice vault_address) inline {
    return  begin_cell()
                .store_coins(0)
                .store_bool(0)
                .store_coins(0)
                .store_uint32(0)
                .store_ref(begin_cell().store_coins(0).store_coins(0).store_uint32(0).end_cell())
                .store_ref(begin_cell().store_coins(0).store_coins(0).store_coins(0).end_cell())
                .store_slice(owner_address)
                .store_slice(vault_address)
                .end_cell();
}

builder calculate_vault_wallet_state_init(slice owner_address, slice vault_address, cell vault_wallet_code) inline {
    return begin_cell()
          .store_uint(0, 2)
          .store_dict(vault_wallet_code)
          .store_dict(pack_vault_wallet_data(owner_address, vault_address))
          .store_uint(0, 1);
}

slice calculate_address(cell state_init) inline {
    return begin_cell().store_uint(4, 3)
                     .store_int(MY_WORKCHAIN, 8)
                     .store_uint(cell_hash(state_init), 256)
                     .end_cell()
                     .begin_parse();
}

slice calculate_user_vault_wallet_address(slice owner_address, slice vault_address, cell vault_wallet_code) inline {
    return calculate_address(calculate_vault_wallet_state_init(owner_address, vault_address, vault_wallet_code).end_cell());
}

```

## f90707f6c62427a1139d7cefd65fcc6eb365cb8e883c27abf45e3f7cea434d3c/contracts/imports/workchain.fc

```fc
#include "stdlib.fc";

const MY_WORKCHAIN = BASECHAIN;
const error::wrong_workchain = 333;

int is_same_workchain(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);
    return wc == MY_WORKCHAIN;
}

() check_same_workchain(slice addr) impure inline {
    throw_unless(error::wrong_workchain, is_same_workchain(addr));
}
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

## f95ba0330b38cdf3459b1e811e5fc6fa6cfee566d7b764455c0468140365a737/jetton-minter.fc

```fc
#include "imports/stdlib.fc";
#include "jetton-utils.fc"; 
#include "params.fc"; 
#include "op-codes.fc"; 


(int, slice, cell, cell) load_data() inline {
  slice ds = get_data().begin_parse();
  return (
      ds~load_coins(), ;; total_supply
      ds~load_msg_addr(), ;; admin_address
      ds~load_ref(), ;; content
      ds~load_ref()  ;; jetton_wallet_code
  );
}

() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
  set_data(begin_cell()
            .store_coins(total_supply)
            .store_slice(admin_address)
            .store_ref(content)
            .store_ref(jetton_wallet_code)
           .end_cell()
          );
}

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
  cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(to_wallet_address)
    .store_coins(amount)
    .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
    .store_ref(state_init)
    .store_ref(master_msg);
  send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
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
    slice sender_address = cs~load_msg_addr();
  
    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();

    if (op == op::mint()) {
        throw_unless(73, equal_slices(sender_address, admin_address));
        slice to_address = in_msg_body~load_msg_addr();
        int amount = in_msg_body~load_coins();
        cell master_msg = in_msg_body~load_ref();
        slice master_msg_cs = master_msg.begin_parse();
        master_msg_cs~skip_bits(32 + 64); ;; op + query_id
        int jetton_amount = master_msg_cs~load_coins();
        mint_tokens(to_address, jetton_wallet_code, amount, master_msg);
        save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);
        return ();
    }

    if (op == op::burn_notification()) {
        int jetton_amount = in_msg_body~load_coins();
        slice from_address = in_msg_body~load_msg_addr();
        throw_unless(74,
            equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)
        );
        save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);
        slice response_address = in_msg_body~load_msg_addr();
        if (response_address.preload_uint(2) != 0) {
          var msg = begin_cell()
            .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
            .store_slice(response_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::excesses(), 32)
            .store_uint(query_id, 64);
          send_raw_message(msg.end_cell(), 2 + 64);
        }
        return ();
    }

    if (op == 3) { ;; change admin
        throw_unless(73, equal_slices(sender_address, admin_address));
        slice new_admin_address = in_msg_body~load_msg_addr();
        save_data(total_supply, new_admin_address, content, jetton_wallet_code);
        return ();
    }

    if (op == 4) { ;; change content, delete this for immutable tokens
        throw_unless(73, equal_slices(sender_address, admin_address));
        save_data(total_supply, admin_address, in_msg_body~load_ref(), jetton_wallet_code);
        return ();
    }

    throw(0xffff);
}

(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}

slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}

```

## f95ba0330b38cdf3459b1e811e5fc6fa6cfee566d7b764455c0468140365a737/jetton-utils.fc

```fc
#include "params.fc"; 


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

## f95ba0330b38cdf3459b1e811e5fc6fa6cfee566d7b764455c0468140365a737/op-codes.fc

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

## f95ba0330b38cdf3459b1e811e5fc6fa6cfee566d7b764455c0468140365a737/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/nft-auction.func

```func
;;
;;  main FunC file git@github.com:cryshado/nft-auc-contest.git
;;

int equal_slices? (slice a, slice b) asm "SDEQ";

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
() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure {
    slice cs = in_msg_cell.begin_parse();
    throw_if(0, cs~load_uint(4) & 1);

    slice sender_addr = cs~load_msg_addr();
    init_data();

    if (equal_slices?(sender_addr, mp_addr) & end? == true) {
        int op = in_msg_body~load_uint(32);
        if ((op == 0) & equal_slices(in_msg_body, msg::repeat_end_auction())) {
            ;; special case for repeat end_auction logic if nft not transfered from auc contract
            handle::end_auction();
            return ();
        }
        if ((op == 0) & equal_slices(in_msg_body, msg::emergency_message())) {
            ;; way to fix unexpected troubles with auction contract
            ;; for example if some one transfer nft to this contract
            var msg = in_msg_body~load_ref().begin_parse();
            var mode = msg~load_uint(8);
            send_raw_message(msg~load_ref(), mode);
            return ();
        }
        ;; accept coins for deploy
        return ();
    }

    if (equal_slices?(sender_addr, nft_addr)) {
        handle::try_init_auction(sender_addr, in_msg_body);
        return ();
    }

    if (now() >= end_time) {
        handle::return_transaction(sender_addr);
        handle::end_auction();
        return ();
    }

    if (end? == true) {
        handle::return_transaction(sender_addr);
        return ();
    }

    if (equal_slices?(sender_addr, nft_owner)) | (equal_slices?(sender_addr, mp_addr)) {
        throw_if(;;throw if it`s not message
                exit::not_message(),
                in_msg_body~load_uint(32) != 0
        );

        if (equal_slices?(in_msg_body, msg::cancel_msg())) {
            handle::try_cancel(in_msg_body);
        }

        if (equal_slices?(in_msg_body, msg::stop_msg()) & equal_slices?(sender_addr, nft_owner)) {
            handle::return_transaction(sender_addr);
            handle::end_auction();
        }

        return ();
    }

    handle::new_bid(sender_addr, msg_value);
}

{-
    Message for deploy contract external
-}
() recv_external(slice in_msg) impure {
    init_data();
    throw_if(exit::already_activated(), activated? == true);
    accept_message();
    activated? = true;
    pack_data();
}
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/stdlib.fc

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

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/exit-codes.func

```func
;;
;;  custom TVM exit codes
;;

int exit::low_bid()           asm "1000 PUSHINT";
int exit::auction_init()      asm "1001 PUSHINT";
int exit::no_transfer()       asm "1002 PUSHINT";
int exit::not_message()       asm "1003 PUSHINT";
int exit::not_cancel()        asm "1004 PUSHINT";
int exit::auction_end()       asm "1005 PUSHINT";
int exit::already_activated() asm "1006 PUSHINT";

```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/get-met.func

```func
(int, int) get_nft_owner() method_id {
    init_data();

    if (nft_owner.slice_bits() <= 2) { return (0, 0);}

    (int wc, int addr) = parse_std_addr(nft_owner);
    return (wc, addr);
}

(int, int) get_nft_addr() method_id {
    init_data();

    if (nft_addr.slice_bits() <= 2) { return (0, 0);}

    (int wc, int addr) = parse_std_addr(nft_addr);
    return (wc, addr);
}

(int, int) get_last_member() method_id {
    init_data();
    ;; trhow error of addr not std
    (int wc, int addr) = parse_std_addr(last_member);
    return (wc, addr);
}

(int, int) get_mp_addr() method_id {
    init_data();
    ;; trhow error of addr not std
    (int wc, int addr) = parse_std_addr(mp_addr);
    return (wc, addr);
}

(int, int) get_mp_fee_addr() method_id {
    init_data();
    ;; trhow error of addr not std
    (int wc, int addr) = parse_std_addr(mp_fee_addr);
    return (wc, addr);
}

(int, int) get_royalty_fee_addr() method_id {
    init_data();
    ;; trhow error of addr not std
    (int wc, int addr) = parse_std_addr(royalty_fee_addr);
    return (wc, addr);
}

(int, int, int, int) get_fees_info() method_id {
    init_data();
    return (
            mp_fee_factor, mp_fee_base,
            royalty_fee_factor, royalty_fee_base
    );
}

(int, int, int, int, int) get_bid_info() method_id {
    init_data();
    return (
            min_bid, max_bid, min_step,
            last_bid, end_time
    );
}

;; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id {
    init_data();

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

```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/handles.func

```func
;;
;;  function handlers
;;

() handle::return_transaction(slice sender_addr) impure inline_ref {
    builder return_msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(sender_addr)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(0, 32)
            .store_slice(msg::return_msg());
    send_raw_message(return_msg.end_cell(), 64);
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


{-
    SHOULD
    [+] return prev bid 
    [+] return nft to owner
    [+] reserve 0,001 ton 
-}
() handle::try_cancel(slice in_msg_body) impure inline_ref {
    throw_if(;; throw if msg not "cancel"
            exit::not_cancel(),
            ~(equal_slices?(in_msg_body, msg::cancel_msg()))
    );

    if (last_bid > 0) {
        builder bid_return = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(last_member)
                .store_coins(last_bid)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(0, 32)
                .store_slice(msg::bid_return());

        send_raw_message(bid_return.end_cell(), 2); ;; ignore errors
    }

    builder nft_return_body = begin_cell()
            .store_uint(op::transfer(), 32)
            .store_uint(cur_lt(), 64) ;; query id
            .store_slice(nft_owner) ;; new owner
            .store_slice(nft_owner) ;; response_destination
            .store_uint(0, 1) ;; custom payload
            .store_coins(0) ;; forward amount
            .store_uint(0, 1); ;; forward payload

    builder nft_return_msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(nft_addr)
            .store_coins(0)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(nft_return_body.end_cell());

    raw_reserve(1000000, 0); ;; reserve some bebras  🐈

    send_raw_message(nft_return_msg.end_cell(), 128);
    end? = true;
    is_canceled? = true;
    pack_data();
}

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
    if (last_bid == 0) {
        builder nft_return_body = begin_cell()
                .store_uint(op::transfer(), 32)
                .store_uint(cur_lt(), 64) ;; query id
                .store_slice(nft_owner) ;; new owner
                .store_slice(nft_owner) ;; response_destination
                .store_uint(0, 1) ;; custom payload
                .store_coins(0) ;; forward amount
                .store_uint(0, 1); ;; forward payload

        builder nft_return_msg = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(nft_addr)
                .store_coins(0)
                .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_ref(nft_return_body.end_cell());

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

        send_raw_message(nft_return_msg.end_cell(), 128);
    } else {
        builder nft_transfer_body = begin_cell()
                .store_uint(op::transfer(), 32)
                .store_uint(cur_lt(), 64) ;; query id
                .store_slice(last_member) ;; new owner
                .store_slice(nft_owner) ;; response_destination
                .store_uint(0, 1) ;; custom payload
                .store_coins(30000000) ;; forward amount  0,03 ton
                .store_uint(0, 1); ;; forward payload
        builder nft_transfer = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(nft_addr)
                .store_coins(1000000000) ;; 1 ton
                .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_ref(nft_transfer_body.end_cell());
        send_raw_message(nft_transfer.end_cell(), 2);


        int mp_fee = math::get_percent(last_bid, mp_fee_factor, mp_fee_base);

        if (mp_fee > 0) {
            builder mp_transfer = begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(mp_fee_addr)
                    .store_coins(mp_fee)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_uint(0, 32)
                    .store_slice(msg::mp_msg());

            send_raw_message(mp_transfer.end_cell(), 3);
        }

        int royalty_fee = math::get_percent(last_bid, royalty_fee_factor, royalty_fee_base);

        if (royalty_fee > 0) {
            builder royalty_transfer = begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(royalty_fee_addr)
                    .store_coins(royalty_fee)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_uint(0, 32)
                    .store_slice(msg::royalty_msg());

            send_raw_message(royalty_transfer.end_cell(), 3);
        }

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

        builder prev_owner_msg = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(nft_owner)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(0, 32)
                .store_slice(msg::profit_msg());

        send_raw_message(prev_owner_msg.end_cell(), 128);
    }
    end? = true;
    pack_data();
}


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
    throw_if(exit::auction_end(), end? == true);

    if (end_time < now()) {
        handle::return_transaction(sender_addr);
        handle::end_auction();
        return ();
    }

    if ((max_bid > 0) & (msg_value >= max_bid)) {
        if (last_bid) {
            builder return_prev_bid = begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(last_member)
                    .store_coins(last_bid)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_uint(0, 32)
                    .store_slice(msg::bid_return());
            send_raw_message(return_prev_bid.end_cell(), 2);
        }
        last_member = sender_addr;
        last_bid = msg_value;
        last_bid_at = now();
        handle::end_auction();
        return ();
    }

    ;; 990(now) 1000(end time) 100(try step time)
    if ((end_time - try_step_time) < now()) {
        end_time += step_time;
    }

    ifnot(last_bid) {
        throw_if(exit::low_bid(), msg_value < min_bid);
        last_bid = msg_value;
        last_member = sender_addr;
        last_bid_at = now();
        pack_data();
        return ();
    }

    if (msg_value < (last_bid + min_step)) {
        handle::return_transaction(sender_addr);
        return ();
    }

    builder return_prev_bid = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(last_member)
            .store_coins(last_bid)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(0, 32)
            .store_slice(msg::bid_return());

    send_raw_message(return_prev_bid.end_cell(), 2);

    last_member = sender_addr;
    last_bid = msg_value;
    last_bid_at = now();

    pack_data();
}

```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/math.func

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
    return division(multiply(a, percent), factor);
}
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/msg-utils.func

```func
;;
;;  text constants for msg comments
;;

slice msg::cancel_msg()     asm "<b 124 word cancel| $, b> <s PUSHSLICE";
slice msg::stop_msg()       asm "<b 124 word stop| $, b> <s PUSHSLICE";

slice msg::return_msg()     asm "<b 124 word Your transaction has not been accepted.| $, b> <s PUSHSLICE";
slice msg::bid_return()     asm "<b 124 word Your bid has been outbid by another user.| $, b> <s PUSHSLICE";
slice msg::mp_msg()         asm "<b 124 word Marketplace commission withdraw| $, b> <s PUSHSLICE";
slice msg::royalty_msg()    asm "<b 124 word Royalty commission withdraw| $, b> <s PUSHSLICE";
slice msg::profit_msg()     asm "<b 124 word Previous owner withdraw| $, b> <s PUSHSLICE";

slice msg::repeat_end_auction()     asm "<b 124 word repeat_end_auction| $, b> <s PUSHSLICE";
slice msg::emergency_message()      asm "<b 124 word emergency_message| $, b> <s PUSHSLICE";
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/op-codes.func

```func
;;
;;  op codes
;;

int op::transfer()              asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned()    asm "0x05138d91 PUSHINT";
```

## fc00a29dd0205bcdcc0d3ffb9ca38cc3c8c159ec60d8aa543240a92f10592d40/struct/storage.func

```func
;;
;;  persistant and runtime storage вescription
;;

global int      init?; ;; init_data safe check
global int      end?; ;; end auction or not
global slice    mp_addr; ;; the address of the marketplace from which the contract is deployed
global int      activated?; ;; contract is activated by external message or by nft transfer
global int      created_at?; ;; timestamp of created acution
global int      is_canceled?; ;; auction was cancelled by owner

;; fees cell (ref)
global slice    mp_fee_addr; ;; the address of the marketplace where the commission goes
global int      mp_fee_factor; ;;
global int      mp_fee_base; ;;
global slice    royalty_fee_addr; ;; the address of the collection owner where the commission goes
global int      royalty_fee_factor; ;;
global int      royalty_fee_base; ;;

;; bids info cell (ref)
global int      min_bid; ;; minimal bid
global int      max_bid; ;; maximum bid
global int      min_step; ;; minimum step (can be 0)
global slice    last_member; ;; last member address
global int      last_bid; ;; last bid amount
global int      last_bid_at; ;; timestamp of last bid
global int      end_time; ;; unix end time
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30)
global int      try_step_time; ;; after what time to start increasing the time (e.g. 60)

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction)
global slice    nft_addr; ;; nft address


() init_data() impure inline_ref {- save for get methods -} {
    ifnot(null?(init?)) { return ();}

    slice ds = get_data().begin_parse();
    end? = ds~load_int(1);
    mp_addr = ds~load_msg_addr();
    activated? = ds~load_int(1);
    created_at? = ds~load_int(32);
    is_canceled? = ds~load_int(1);

    slice fees_cell = ds~load_ref().begin_parse();
    mp_fee_addr = fees_cell~load_msg_addr();
    mp_fee_factor = fees_cell~load_uint(32);
    mp_fee_base = fees_cell~load_uint(32);
    royalty_fee_addr = fees_cell~load_msg_addr();
    royalty_fee_factor = fees_cell~load_uint(32);
    royalty_fee_base = fees_cell~load_uint(32);

    slice bids_cell = ds~load_ref().begin_parse();
    min_bid = bids_cell~load_coins();
    max_bid = bids_cell~load_coins();
    min_step = bids_cell~load_coins();
    last_member = bids_cell~load_msg_addr();
    last_bid = bids_cell~load_coins();
    last_bid_at = bids_cell~load_uint(32);
    end_time = bids_cell~load_uint(32);
    step_time = bids_cell~load_uint(32);
    try_step_time = bids_cell~load_uint(32);

    slice nft_cell = ds~load_ref().begin_parse();
    nft_owner = nft_cell~load_msg_addr();
    nft_addr = nft_cell~load_msg_addr();

    init? = true;
}

() pack_data() impure inline_ref {
    builder fees_cell = begin_cell()
            .store_slice(mp_fee_addr) ;; + max    267 ($10 with Anycast = 0)
            .store_uint(mp_fee_factor, 32) ;; + stc    32
            .store_uint(mp_fee_base, 32) ;; + stc    32
            .store_slice(royalty_fee_addr) ;; + max    267 ($10 with Anycast = 0)
            .store_uint(royalty_fee_factor, 32) ;; + stc    32
            .store_uint(royalty_fee_base, 32); ;; + stc    32
    ;; total: (267 * 2) + (32 * 4) = 662 maximum bits

    builder bids_cell = begin_cell()
            .store_coins(min_bid) ;; + max    124
            .store_coins(max_bid) ;; + max    124
            .store_coins(min_step) ;; + max    124
            .store_slice(last_member) ;; + max    267 ($10 with Anycast = 0)
            .store_coins(last_bid) ;; + max    124
            .store_uint(last_bid_at, 32) ;; + stc    32
            .store_uint(end_time, 32) ;; + stc    32
            .store_uint(step_time, 32) ;; + stc    32
            .store_uint(try_step_time, 32); ;; +stc     32
    ;; total 32*4 + 124*4 + 267 = 891

    builder nft_cell = begin_cell()
            .store_slice(nft_owner) ;; + max    267 ($10 with Anycast = 0)
            .store_slice(nft_addr); ;; + max    267 ($10 with Anycast = 0)
    ;; total: 267 * 2 = 534 maximum bits

    set_data(
            begin_cell()
                    .store_int(end?, 1) ;; + stc    1
                    .store_slice(mp_addr) ;; + max    267 ($10 with Anycast = 0)
                    .store_int(activated?, 1) ;; activated?
                    .store_int(created_at?, 32)
                    .store_int(is_canceled?, 1)
                    .store_ref(fees_cell.end_cell()) ;; + ref
                    .store_ref(bids_cell.end_cell()) ;; + ref
                    .store_ref(nft_cell.end_cell()) ;; + ref
                    .end_cell()
    );
}


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

    init(avatar: String, name: String, about: String, website: String, terms: String, telegram: String, github: String, 
        jetton: Address, nft: Address, hide: Bool, dns: String) {
        self.avatar = avatar;
        self.name = name;
        self.about = about;
        self.website = website;
        self.terms = terms;
        self.telegram = telegram;
        self.github = github;
        self.jetton = jetton;
        self.nft = nft;
        self.hide = hide;
        self.dns = dns;
    }

    receive() {
    }
    
    get fun state(): MetadataState {
        return MetadataState {
            avatar: self.avatar,
            name: self.name,
            about: self.about,
            website: self.website,
            terms: self.terms,
            telegram: self.telegram,
            github: self.github,
            jetton: self.jetton,
            nft: self.nft,
            hide: self.hide ,
            dns: self.dns          
        };
    }
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
    var (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns)) = (null(), null(), null(), null(), null(), null(), null(), null(), null(), null(), null());
    $self'avatar = $avatar;
    $self'name = $name;
    $self'about = $about;
    $self'website = $website;
    $self'terms = $terms;
    $self'telegram = $telegram;
    $self'github = $github;
    $self'jetton = $jetton;
    $self'nft = $nft;
    $self'hide = $hide;
    $self'dns = $dns;
    return ($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns);
}

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), (slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)) $Metadata$_fun_state((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self) impure inline_ref {
    var (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns)) = $self;
    return (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns), $MetadataState$_constructor_avatar_name_about_website_terms_telegram_github_jetton_nft_hide_dns($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns));
}

;;
;; Receivers of a Contract Metadata
;;

(((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)), ()) %$Metadata$_internal_empty((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self) impure inline {
    var ($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns) = $self;
    return (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns), ());
}

(((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)), ()) $Metadata$_internal_binary_Deploy((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self, (int) $deploy) impure inline {
    var ($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns) = $self;
    var ($deploy'queryId) = $deploy;
    ($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns)~$Metadata$_fun_notify($DeployOk$_store_cell($DeployOk$_constructor_queryId($deploy'queryId)));
    return (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns), ());
}

;;
;; Get methods of a Contract Metadata
;;

_ %state() method_id(77589) {
    var self = $Metadata$_contract_load();
    var res = self~$Metadata$_fun_state();
    return $MetadataState$_to_external(res);
}

_ supported_interfaces() method_id {
    return (
        "org.ton.introspection.v0"H >> 128,
        "org.ton.abi.ipfs.v0"H >> 128,
        "org.ton.deploy.lazy.v0"H >> 128,
        "org.ton.debug.v0"H >> 128,
        "org.ton.chain.workchain.v0"H >> 128
    );
}

_ get_abi_ipfs() method_id {
    return "ipfs://QmYKUg5a6Ds4hhWPumzZ3Gb3GPz86udmvRdqH7kwUNnv4t";
}

_ lazy_deployment_completed() method_id {
    return get_data().begin_parse().load_int(1);
}

;;
;; Routing of a Contract Metadata
;;

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), int) $Metadata$_contract_router_internal((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) self, int msg_bounced, slice in_msg) impure inline_ref {
    ;; Handle bounced messages
    if (msg_bounced) {
        return (self, true);
    }
    
    ;; Parse incoming message
    int op = 0;
    if (slice_bits(in_msg) >= 32) {
        op = in_msg.preload_uint(32);
    }
    
    
    ;; Receive empty message
    if ((op == 0) & (slice_bits(in_msg) <= 32)) {
        self~%$Metadata$_internal_empty();
        return (self, true);
    }
    
    ;; Receive Deploy message
    if (op == 2490013878) {
        var msg = in_msg~$Deploy$_load();
        self~$Metadata$_internal_binary_Deploy(msg);
        return (self, true);
    }
    
    return (self, false);
}

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
    
    ;; Context
    var cs = in_msg_cell.begin_parse();
    var msg_flags = cs~load_uint(4);
    var msg_bounced = -(msg_flags & 1);
    slice msg_sender_addr = __tact_verify_address(cs~load_msg_addr());
    __tact_context = (msg_bounced, msg_sender_addr, msg_value, cs);
    __tact_context_sender = msg_sender_addr;
    
    ;; Load contract data
    var self = $Metadata$_contract_load();
    
    ;; Handle operation
    int handled = self~$Metadata$_contract_router_internal(msg_bounced, in_msg);
    
    ;; Throw if not handled
    throw_unless(130, handled);
    
    ;; Persist state
    $Metadata$_contract_store(self);
}

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
builder $DeployOk$_store(builder build_0, (int) v) inline;

;; $DeployOk$_store_cell
cell $DeployOk$_store_cell((int) v) inline;

;; $Metadata$_store
builder $Metadata$_store(builder build_0, (slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) v) inline;

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
global (int, slice, int, slice) __tact_context;
global slice __tact_context_sender;
global cell __tact_context_sys;
global int __tact_randomized;

slice __tact_verify_address(slice address) inline {
    throw_unless(136, address.slice_bits() == 267);
    var h = address.preload_uint(11);
    throw_if(137, h == 1279);
    throw_unless(136, h == 1024);
    return address;
}

(slice, slice) __tact_load_address(slice cs) inline {
    slice raw = cs~load_msg_addr();
    return (cs, __tact_verify_address(raw));
}

builder __tact_store_address(builder b, slice address) inline {
    return b.store_slice(__tact_verify_address(address));
}

int __tact_my_balance() inline {
    return pair_first(get_balance());
}

forall X -> X __tact_not_null(X x) inline {
    throw_if(128, null?(x)); return x;
}

(int, slice, int, slice) __tact_context_get() inline {
    return __tact_context;
}

slice __tact_context_get_sender() inline {
    return __tact_context_sender;
}

builder __tact_store_bool(builder b, int v) inline {
    return b.store_int(v, 1);
}

forall X0, X1 -> (X0, X1) __tact_tuple_destroy_2(tuple v) asm "2 UNTUPLE";

() $global_send((int, slice, int, int, cell, cell, cell) $params) impure inline_ref {
    var (($params'bounce, $params'to, $params'value, $params'mode, $params'body, $params'code, $params'data)) = $params;
    builder $b = begin_cell();
    $b = store_int($b, 1, 2);
    $b = __tact_store_bool($b, $params'bounce);
    $b = store_int($b, 0, 3);
    $b = __tact_store_address($b, $params'to);
    $b = store_coins($b, $params'value);
    $b = store_int($b, 0, ((((1 + 4) + 4) + 64) + 32));
    if (( ((~ null?($params'code))) ? (true) : ((~ null?($params'data))) )) {
        $b = __tact_store_bool($b, true);
        builder $bc = begin_cell();
        $bc = __tact_store_bool($bc, false);
        $bc = __tact_store_bool($bc, false);
        if ((~ null?($params'code))) {
            $bc = __tact_store_bool($bc, true);
            $bc = store_ref($bc, __tact_not_null($params'code));
        } else {
            $bc = __tact_store_bool($bc, false);
        }
        if ((~ null?($params'data))) {
            $bc = __tact_store_bool($bc, true);
            $bc = store_ref($bc, __tact_not_null($params'data));
        } else {
            $bc = __tact_store_bool($bc, false);
        }
        $bc = __tact_store_bool($bc, false);
        $b = __tact_store_bool($b, true);
        $b = store_ref($b, end_cell($bc));
    } else {
        $b = __tact_store_bool($b, false);
    }
    cell $body = $params'body;
    if ((~ null?($body))) {
        $b = __tact_store_bool($b, true);
        $b = store_ref($b, __tact_not_null($body));
    } else {
        $b = __tact_store_bool($b, false);
    }
    cell $c = end_cell($b);
    send_raw_message($c, $params'mode);
}

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), ()) $Metadata$_fun_forward((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self, slice $to, cell $body, int $bounce, tuple $init) impure inline_ref {
    var (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns)) = $self;
    var ($init) = $init;
    cell $code = null();
    cell $data = null();
    if ((~ null?($init))) {
        var ($init2'code, $init2'data) = $StateInit$_not_null($init);
        $code = $init2'code;
        $data = $init2'data;
    }
    if ((0 > 0)) {
        var ($ctx'bounced, $ctx'sender, $ctx'value, $ctx'raw) = __tact_context_get();
        int $balance = __tact_my_balance();
        int $balanceBeforeMessage = ($balance - $ctx'value);
        if (($balanceBeforeMessage < 0)) {
            raw_reserve(0, 0);
            $global_send($SendParameters$_constructor_bounce_to_value_mode_body_code_data($bounce, $to, 0, (128 + 2), $body, $code, $data));
            return (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns), ());
        }
    }
    $global_send($SendParameters$_constructor_bounce_to_value_mode_body_code_data($bounce, $to, 0, (64 + 2), $body, $code, $data));
    return (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns), ());
}

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice), ()) $Metadata$_fun_notify((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $self, cell $body) impure inline {
    var (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns)) = $self;
    ($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns)~$Metadata$_fun_forward(__tact_context_get_sender(), $body, false, null());
    return (($self'avatar, $self'name, $self'about, $self'website, $self'terms, $self'telegram, $self'github, $self'jetton, $self'nft, $self'hide, $self'dns), ());
}
```

## fe05b9f31a4c200ef51036d05a7ce05fd4b024716c4a8bcbc56c603302e1e3a9/output/verifier_Metadata.storage.fc

```fc
;;
;; Type: StateInit
;; TLB: _ code:^cell data:^cell = StateInit
;;

((cell, cell)) $StateInit$_not_null(tuple v) inline {
    throw_if(128, null?(v));
    var (cell vvv'code, cell vvv'data) = __tact_tuple_destroy_2(v);
    return (vvv'code, vvv'data);
}

;;
;; Type: SendParameters
;; TLB: _ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters
;;

((int, slice, int, int, cell, cell, cell)) $SendParameters$_constructor_bounce_to_value_mode_body_code_data(int bounce, slice to, int value, int mode, cell body, cell code, cell data) inline {
    return (bounce, to, value, mode, body, code, data);
}

;;
;; Type: Deploy
;; Header: 0x946a98b6
;; TLB: deploy#946a98b6 queryId:uint64 = Deploy
;;

(slice, ((int))) $Deploy$_load(slice sc_0) inline {
    throw_unless(129, sc_0~load_uint(32) == 2490013878);
    var v'queryId = sc_0~load_uint(64);
    return (sc_0, (v'queryId));
}

;;
;; Type: DeployOk
;; Header: 0xaff90f57
;; TLB: deploy_ok#aff90f57 queryId:uint64 = DeployOk
;;

builder $DeployOk$_store(builder build_0, (int) v) inline {
    var (v'queryId) = v;
    build_0 = store_uint(build_0, 2952335191, 32);
    build_0 = build_0.store_uint(v'queryId, 64);
    return build_0;
}

cell $DeployOk$_store_cell((int) v) inline {
    return $DeployOk$_store(begin_cell(), v).end_cell();
}

((int)) $DeployOk$_constructor_queryId(int queryId) inline {
    return (queryId);
}

;;
;; Type: MetadataState
;; TLB: _ avatar:^string name:^string about:^string website:^string terms:^string telegram:^string github:^string jetton:address nft:address hide:bool dns:^string = MetadataState
;;

(slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $MetadataState$_to_external(((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)) v) inline {
    var (v'avatar, v'name, v'about, v'website, v'terms, v'telegram, v'github, v'jetton, v'nft, v'hide, v'dns) = v; 
    return (v'avatar, v'name, v'about, v'website, v'terms, v'telegram, v'github, v'jetton, v'nft, v'hide, v'dns);
}

((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice)) $MetadataState$_constructor_avatar_name_about_website_terms_telegram_github_jetton_nft_hide_dns(slice avatar, slice name, slice about, slice website, slice terms, slice telegram, slice github, slice jetton, slice nft, int hide, slice dns) inline {
    return (avatar, name, about, website, terms, telegram, github, jetton, nft, hide, dns);
}

;;
;; Type: Metadata
;;

builder $Metadata$_store(builder build_0, (slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) v) inline {
    var (v'avatar, v'name, v'about, v'website, v'terms, v'telegram, v'github, v'jetton, v'nft, v'hide, v'dns) = v;
    build_0 = build_0.store_ref(begin_cell().store_slice(v'avatar).end_cell());
    build_0 = build_0.store_ref(begin_cell().store_slice(v'name).end_cell());
    var build_1 = begin_cell();
    build_1 = build_1.store_ref(begin_cell().store_slice(v'about).end_cell());
    build_1 = build_1.store_ref(begin_cell().store_slice(v'website).end_cell());
    build_1 = build_1.store_ref(begin_cell().store_slice(v'terms).end_cell());
    var build_2 = begin_cell();
    build_2 = build_2.store_ref(begin_cell().store_slice(v'telegram).end_cell());
    build_2 = build_2.store_ref(begin_cell().store_slice(v'github).end_cell());
    build_2 = __tact_store_address(build_2, v'jetton);
    build_2 = __tact_store_address(build_2, v'nft);
    build_2 = build_2.store_int(v'hide, 1);
    build_2 = build_2.store_ref(begin_cell().store_slice(v'dns).end_cell());
    build_1 = store_ref(build_1, build_2.end_cell());
    build_0 = store_ref(build_0, build_1.end_cell());
    return build_0;
}

(slice, ((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice))) $Metadata$_load(slice sc_0) inline {
    var v'avatar = sc_0~load_ref().begin_parse();
    var v'name = sc_0~load_ref().begin_parse();
    slice sc_1 = sc_0~load_ref().begin_parse();
    var v'about = sc_1~load_ref().begin_parse();
    var v'website = sc_1~load_ref().begin_parse();
    var v'terms = sc_1~load_ref().begin_parse();
    slice sc_2 = sc_1~load_ref().begin_parse();
    var v'telegram = sc_2~load_ref().begin_parse();
    var v'github = sc_2~load_ref().begin_parse();
    var v'jetton = sc_2~__tact_load_address();
    var v'nft = sc_2~__tact_load_address();
    var v'hide = sc_2~load_int(1);
    var v'dns = sc_2~load_ref().begin_parse();
    return (sc_0, (v'avatar, v'name, v'about, v'website, v'terms, v'telegram, v'github, v'jetton, v'nft, v'hide, v'dns));
}

(slice, ((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice))) $Metadata$init$_load(slice sc_0) inline_ref {
    var v'avatar = sc_0~load_ref().begin_parse();
    var v'name = sc_0~load_ref().begin_parse();
    slice sc_1 = sc_0~load_ref().begin_parse();
    var v'about = sc_1~load_ref().begin_parse();
    var v'website = sc_1~load_ref().begin_parse();
    var v'terms = sc_1~load_ref().begin_parse();
    slice sc_2 = sc_1~load_ref().begin_parse();
    var v'telegram = sc_2~load_ref().begin_parse();
    var v'github = sc_2~load_ref().begin_parse();
    var v'jetton = sc_2~__tact_load_address();
    var v'nft = sc_2~__tact_load_address();
    var v'hide = sc_2~load_int(1);
    var v'dns = sc_2~load_ref().begin_parse();
    return (sc_0, (v'avatar, v'name, v'about, v'website, v'terms, v'telegram, v'github, v'jetton, v'nft, v'hide, v'dns));
}

(slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) $Metadata$_contract_load() impure inline_ref {
    slice $sc = get_data().begin_parse();
    __tact_context_sys = $sc~load_ref();
    int $loaded = $sc~load_int(1);
    if ($loaded) {
        return $sc~$Metadata$_load();
    } else {
        ;; Allow only workchain deployments
        throw_unless(137, my_address().preload_uint(11) == 1024);
        (slice avatar, slice name, slice about, slice website, slice terms, slice telegram, slice github, slice jetton, slice nft, int hide, slice dns) = $sc~$Metadata$init$_load();
        $sc.end_parse();
        return $Metadata$_contract_init(avatar, name, about, website, terms, telegram, github, jetton, nft, hide, dns);
    }
}

() $Metadata$_contract_store((slice, slice, slice, slice, slice, slice, slice, slice, slice, int, slice) v) impure inline {
    builder b = begin_cell();
    b = b.store_ref(__tact_context_sys);
    b = b.store_int(true, 1);
    b = $Metadata$_store(b, v);
    set_data(b.end_cell());
}
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

## feb5ff6820e2ff0d9483e7e0d62c817d846789fb4ae580c878866d959dabd5c0/wallet-v4-code.fc

```fc
#pragma version =0.2.0;
;; Wallet smart contract with plugins

(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";
(cell, int) dict_add_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTADDB";
(cell, int) dict_delete?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDEL";

() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) impure {
  var cs = in_msg_cell.begin_parse();
  var flags = cs~load_uint(4);  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  if (flags & 1) {
    ;; ignore all bounced messages
    return ();
  }
  if (in_msg.slice_bits() < 32) {
    ;; ignore simple transfers
    return ();
  }
  int op = in_msg~load_uint(32);
  if (op != 0x706c7567) & (op != 0x64737472) { ;; "plug" & "dstr"
    ;; ignore all messages not related to plugins
    return ();
  }
  slice s_addr = cs~load_msg_addr();
  (int wc, int addr_hash) = parse_std_addr(s_addr);
  slice wc_n_address = begin_cell().store_int(wc, 8).store_uint(addr_hash, 256).end_cell().begin_parse();
  var ds = get_data().begin_parse().skip_bits(32 + 32 + 256);
  var plugins = ds~load_dict();
  var (_, success?) = plugins.dict_get?(8 + 256, wc_n_address);
  if ~(success?) {
    ;; it may be a transfer
    return ();
  }
  int query_id = in_msg~load_uint(64);
  var msg = begin_cell();
  if (op == 0x706c7567) { ;; request funds

    (int r_toncoins, cell r_extra) = (in_msg~load_grams(), in_msg~load_dict());

    [int my_balance, _] = get_balance();
    throw_unless(80, my_balance - msg_value >= r_toncoins);

    msg = msg.store_uint(0x18, 6)
             .store_slice(s_addr)
             .store_grams(r_toncoins)
             .store_dict(r_extra)
             .store_uint(0, 4 + 4 + 64 + 32 + 1 + 1)
             .store_uint(0x706c7567 | 0x80000000, 32)
             .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), 64);

  }

  if (op == 0x64737472) { ;; remove plugin by its request

    plugins~dict_delete?(8 + 256, wc_n_address);
    var ds = get_data().begin_parse().first_bits(32 + 32 + 256);
    set_data(begin_cell().store_slice(ds).store_dict(plugins).end_cell());
    ;; return coins only if bounce expected
    if (flags & 2) {
      msg = msg.store_uint(0x18, 6)
               .store_slice(s_addr)
               .store_grams(0)
               .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
               .store_uint(0x64737472 | 0x80000000, 32)
               .store_uint(query_id, 64);
      send_raw_message(msg.end_cell(), 64);
    }
  }
}

() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512);
  var cs = in_msg;
  var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
  throw_if(36, valid_until <= now());
  var ds = get_data().begin_parse();
  var (stored_seqno, stored_subwallet, public_key, plugins) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256), ds~load_dict());
  ds.end_parse();
  throw_unless(33, msg_seqno == stored_seqno);
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  accept_message();
  set_data(begin_cell()
    .store_uint(stored_seqno + 1, 32)
    .store_uint(stored_subwallet, 32)
    .store_uint(public_key, 256)
    .store_dict(plugins)
    .end_cell());
  commit();
  cs~touch();
  int op = cs~load_uint(8);

  if (op == 0) { ;; simple send
    while (cs.slice_refs()) {
      var mode = cs~load_uint(8);
      send_raw_message(cs~load_ref(), mode);
    }
    return (); ;; have already saved the storage
  }

  if (op == 1) { ;; deploy and install plugin
    int plugin_workchain = cs~load_int(8);
    int plugin_balance = cs~load_grams();
    (cell state_init, cell body) = (cs~load_ref(), cs~load_ref());
    int plugin_address = cell_hash(state_init);
    slice wc_n_address = begin_cell().store_int(plugin_workchain, 8).store_uint(plugin_address, 256).end_cell().begin_parse();
    var msg = begin_cell()
      .store_uint(0x18, 6)
      .store_uint(4, 3).store_slice(wc_n_address)
      .store_grams(plugin_balance)
      .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
      .store_ref(state_init)
      .store_ref(body);
    send_raw_message(msg.end_cell(), 3);
    (plugins, int success?) = plugins.dict_add_builder?(8 + 256, wc_n_address, begin_cell());
    throw_unless(39, success?);
  }

  if (op == 2) { ;; install plugin
    slice wc_n_address = cs~load_bits(8 + 256);
    int amount = cs~load_grams();
    int query_id = cs~load_uint(64);

    (plugins, int success?) = plugins.dict_add_builder?(8 + 256, wc_n_address, begin_cell());
    throw_unless(39, success?);

    builder msg = begin_cell()
      .store_uint(0x18, 6)
      .store_uint(4, 3).store_slice(wc_n_address)
      .store_grams(amount)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(0x6e6f7465, 32) ;; op
      .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), 3);
  }

  if (op == 3) { ;; remove plugin
    slice wc_n_address = cs~load_bits(8 + 256);
    int amount = cs~load_grams();
    int query_id = cs~load_uint(64);

    (plugins, int success?) = plugins.dict_delete?(8 + 256, wc_n_address);
    throw_unless(39, success?);

    builder msg = begin_cell()
      .store_uint(0x18, 6)
      .store_uint(4, 3).store_slice(wc_n_address)
      .store_grams(amount)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(0x64737472, 32) ;; op
      .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), 3);
  }

  set_data(begin_cell()
    .store_uint(stored_seqno + 1, 32)
    .store_uint(stored_subwallet, 32)
    .store_uint(public_key, 256)
    .store_dict(plugins)
    .end_cell());
}

;; Get methods

int seqno() method_id {
  return get_data().begin_parse().preload_uint(32);
}

int get_subwallet_id() method_id {
  return get_data().begin_parse().skip_bits(32).preload_uint(32);
}

int get_public_key() method_id {
  var cs = get_data().begin_parse().skip_bits(64);
  return cs.preload_uint(256);
}

int is_plugin_installed(int wc, int addr_hash) method_id {
  var ds = get_data().begin_parse().skip_bits(32 + 32 + 256);
  var plugins = ds~load_dict();
  var (_, success?) = plugins.dict_get?(8 + 256, begin_cell().store_int(wc, 8).store_uint(addr_hash, 256).end_cell().begin_parse());
  return success?;
}

tuple get_plugin_list() method_id {
  var list = null();
  var ds = get_data().begin_parse().skip_bits(32 + 32 + 256);
  var plugins = ds~load_dict();
  do {
    var (wc_n_address, _, f) = plugins~dict::delete_get_min(8 + 256);
    if (f) {
      (int wc, int addr) = (wc_n_address~load_int(8), wc_n_address~load_uint(256));
      list = cons(pair(wc, addr), list);
    }
  } until (~ f);
  return list;
}
```


