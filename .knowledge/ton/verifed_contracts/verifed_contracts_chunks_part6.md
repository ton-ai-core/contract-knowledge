() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";
```

## 9aca9b66fd183d5faea3375990adb13c11f5fa29556331dfcd1cd9d36ea4567c/contract/contracts/contract.tact

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
    
        let is_sell: Bool = false;
        if (!msg.forward_payload.empty() && msg.forward_payload.refs() >= 1) {
            let fwdSlice: Slice = msg.forward_payload.preloadRef().beginParse();
            if (fwdSlice.bits() >= 32 && fwdSlice.loadUint(32) == 0xe3a0d482) { // swap
                is_sell = true;
            }
        }

        let is_buy: Bool = self.is_dex_vault && !is_sell;
        let init: StateInit = initOf JettonDefaultWallet(msg.destination, self.master);  
        let wallet_address: Address = contractAddress(init);

        if (is_buy || is_sell) {
            let calculated_fee: Int = msg.amount * 2 / 100; // 2% fee for sell
            if (is_buy) {
                calculated_fee = msg.amount * 2 / 100; // 2% fee for buy
            }
            
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

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/constants.fc

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

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged

int op::provide_wallet_address() asm "0x2c76b973 PUSHINT";
int op::take_wallet_address() asm "0xd1735400 PUSHINT";

int is_resolvable?(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);

    return wc == workchain();
}
```

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/jetton-utils.fc

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

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/op-codes.fc

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

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
    (int wc, _) = parse_std_addr(addr);
    throw_unless(333, wc == workchain());
}
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

## 9aefd6c40111910fb4ea3a6c1160cd8b9a45b74a5ea19802ff51798b6359a092/imports/utils.fc

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
int provide_address_gas_consumption() asm "10000000 PUSHINT";

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
    cs~load_msg_addr(); ;; skip dst
    cs~load_coins(); ;; skip value
    cs~skip_bits(1); ;; skip extracurrency collection
    cs~load_coins(); ;; skip ihr_fee
    int fwd_fee = muldiv(cs~load_coins(), 3, 2); ;; we use message fwd_fee for estimation of forward_payload costs

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

    if (op == op::provide_wallet_address()) {
        throw_unless(75, msg_value > fwd_fee + provide_address_gas_consumption());

        slice owner_address = in_msg_body~load_msg_addr();
        int include_address? = in_msg_body~load_uint(1);

        cell included_address = include_address?
                ? begin_cell().store_slice(owner_address).end_cell()
                : null();

        var msg = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(sender_address)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(op::take_wallet_address(), 32)
                .store_uint(query_id, 64);

        if (is_resolvable?(owner_address)) {
            msg = msg.store_slice(calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code));
        } else {
            msg = msg.store_uint(0, 2); ;; addr_none
        }
        send_raw_message(msg.store_maybe_ref(included_address).end_cell(), 64);
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

;; transfer: Yêu cầu chuyển Jetton từ A đến B
;; internal_transfer: Yêu cầu gửi từ contract jetton wallet của A đến contract jetton wallet của B
;; transfer, địa chỉ người gửi, TON, fee forward
() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  ;; query_id
  int query_id = in_msg_body~load_uint(64);
  ;; amount: Số lượng Jettion Alice gửi
  int jetton_amount = in_msg_body~load_coins();
  ;; destination: Địa chỉ ví của Bob
  slice to_owner_address = in_msg_body~load_msg_addr();
  ;; Phân tích địa chỉ chuẩn TON (Standard Address) thành các thành phần cấu thành của nó, cụ thể là workchain_id và account_id. Trả về lỗi nếu workchain_id != workchain contract đang chạy
  force_chain(to_owner_address);
  ;; balance jetton trong ví, địa chỉ chủ sở hữu ví, địa chỉ hợp đồng jetton master, mã hợp đồng ví jetton wallet
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  ;; Trừ jetton chuyển đi
  balance -= jetton_amount;

  ;; Kiểm tra địa chỉ người gửi và địa chỉ chủ sở hữu jetton wallet
  throw_unless(705, equal_slices(owner_address, sender_address));
  ;; balance sau khi chuyển tiền >=0
  throw_unless(706, balance >= 0);

  ;; Lấy ra state_init jetton wallet của người nhận
  cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
  ;; Tạo địa chỉ ví cho người nhận dựa trên state_init
  slice to_wallet_address = calculate_jetton_wallet_address(state_init);

  ;; response_destination: Địa chỉ nhận phản hồi xác nhận việc chuyển tiền từ Bob
  slice response_address = in_msg_body~load_msg_addr();
  ;; custom_payload: Dữ liệu metadata tuỳ chỉnh
  cell custom_payload = in_msg_body~load_dict();
  ;; forward_ton_amount: Số lượng TON gửi kèm tới Bob
  int forward_ton_amount = in_msg_body~load_coins();
  throw_unless(708, slice_bits(in_msg_body) >= 1);
  ;; forward_payload: Dữ liệu metadata gửi kèm tới Bob kèm forward_ton_amount
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

## 9bf8dcf4441db14461b87ba45bb7b6b17d4b26e214fcf214c915eba0006b1fac/main.fc

```fc
#include "imports/stdlib.fc";

const const::min_tons_for_storage = 10000000; ;; 0.01 TON

(int, slice, slice) load_data() inline {
  var ds = get_data().begin_parse();
  return (
    ds~load_uint(32), ;; counter_value
   	ds~load_msg_addr(), ;; the most recent sender
    ds~load_msg_addr() ;; owner_address
  );
}

() save_data(int counter_value, slice recent_sender, slice owner_address) impure inline {
  set_data(begin_cell()
    .store_uint(counter_value, 32) ;; counter_value
    .store_slice(recent_sender) ;; the most recent sender
    .store_slice(owner_address) ;; owner_address
    .end_cell());
}

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
  slice cs = in_msg.begin_parse();
  int flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();

  int op = in_msg_body~load_uint(32);

  var (counter_value, recent_sender, owner_address) = load_data();

  if (op == 1) { 
    int increment_by = in_msg_body~load_uint(32);
    save_data(counter_value + increment_by, sender_address, owner_address);
    return();
  }

  if (op == 2) {
    return();
  }

  if (op == 3) {

    throw_unless(103, equal_slice_bits(sender_address, owner_address));

    int withdraw_amount = in_msg_body~load_coins();
    var [balance, _] = get_balance();
    throw_unless(104, balance >= withdraw_amount);

    int return_value = min(withdraw_amount, balance - const::min_tons_for_storage);

    int msg_mode = 1; ;; 0 (Ordinary message) + 1 (Pay transfer fees separately from the message value)

    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(sender_address)
        .store_coins(return_value)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);
    
    send_raw_message(msg.end_cell(), msg_mode);
    

    return();
  }

  throw(777);
}

(int, slice, slice) get_contract_storage_data() method_id {
  var (counter_value, recent_sender, owner_address) = load_data();
  return (
    counter_value,
    recent_sender,
    owner_address
  );
}

int balance() method_id {
  var [balance, _] = get_balance();
  return balance;
}
```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/config.fc

```fc
const int STATE_BURN_SUSPENDED = 1; ;; state_flags & 1 - burn (TON->EVM transfer) suspended
const int STATE_SWAPS_SUSPENDED = 2; ;; state_flags & 2 - swaps (EVM->TON transfer) suspended
const int STATE_GOVERNANCE_SUSPENDED = 4; ;; state_flags & 4 - all governance actions suspended
const int STATE_COLLECTOR_SIGNATURE_REMOVAL_SUSPENDED = 8; ;; state_flags & 8 - collector signature removal suspended

(int, int, cell, int, int, int, int, int, int, int) get_jetton_bridge_config() impure inline_ref {
    cell bridge_config = config_param(CONFIG_PARAM_ID);
    if (bridge_config.cell_null?()) {
        bridge_config = config_param(- CONFIG_PARAM_ID);
    }
    throw_if(error::no_bridge_config, bridge_config.cell_null?());

    slice slice_config = bridge_config.begin_parse();

    int prefix = slice_config~load_uint(8);

    int bridge_address_hash = slice_config~load_uint(256);

    int oracles_address_hash = slice_config~load_uint(256);

    ;; key: uint256 (public key) value: uint256 (eth address)
    cell oracles = slice_config~load_dict();

    int state_flags = slice_config~load_uint(8);

    slice prices = slice_config~load_ref().begin_parse();

    int bridge_burn_fee = prices~load_coins(); ;; ATTENTION: burn_fee must include burn network fees (at least 2 * fwd_fee + 3 * gas_consumption + minter_min_tons_for_storage)

    int bridge_mint_fee = prices~load_coins(); ;; ATTENTION: mint_fee must include mint network fees (at least 2 * fwd_fee + 3 * gas_consumption + minter_min_tons_for_storage + wallet_min_tons_for_storage) and forward_coins_amount

    int wallet_min_tons_for_storage = prices~load_coins();

    int wallet_gas_consumption = prices~load_coins();

    int minter_min_tons_for_storage = prices~load_coins();

    int discover_gas_consumption = prices~load_coins();

    return (bridge_address_hash, oracles_address_hash, oracles, state_flags, bridge_burn_fee, bridge_mint_fee, wallet_min_tons_for_storage, wallet_gas_consumption, minter_min_tons_for_storage, discover_gas_consumption);
}

```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/errors.fc

```fc
;; global errors
const int error::inbound_message_has_empty_body = 200;
const int error::unknown_op = 0xffff;
const int error::unknown_execute_voting_op = 211;

;; data errors
const int error::incorrect_voting_data = 320;
const int error::decimals_out_of_range = 330;

;; wrong sender errors
const int error::oracles_sender = 400;
const int error::oracles_not_sender = 401;
const int error::minter_not_sender = 402;
const int error::bridge_not_sender = 403;
const int error::owner_not_sender = 404;
const int error::operation_suspended = 704;

;; jetton wallet errors
const int error::unauthorized_transfer = 705;
const int error::not_enough_funds = 706;
const int error::unauthorized_incoming_transfer = 707;
const int error::malformed_forward_payload = 708;
const int error::not_enough_tons = 709;
const int error::burn_fee_not_matched = 710;

;; jetton minter errors
const int error::discovery_fee_not_matched = 75;

;; jetton bridge errors
const int error::wrong_external_chain_id = 410;
const int error::wrong_sender_workchain = 413;
const int error::mint_fee_not_matched = 407;
const int error::mint_fee_less_forward = 399;

const int error::no_bridge_config = 666;
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

(int, slice, slice, cell) load_data() inline {
  slice ds = get_data().begin_parse();

  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = (ds~load_coins(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref());
  ds.end_parse();

  return (balance, owner_address, jetton_master_address, jetton_wallet_code);
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

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee, int wallet_min_tons_for_storage, int wallet_gas_consumption) impure {
  int query_id = in_msg_body~load_query_id();
  int jetton_amount = in_msg_body~load_coins();
  slice to_owner_address = in_msg_body~load_msg_addr();
  force_chain(to_owner_address);
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  balance -= jetton_amount;

  throw_unless(error::unauthorized_transfer, equal_slices(owner_address, sender_address));
  throw_unless(error::not_enough_funds, balance >= 0);

  cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);
  slice to_wallet_address = calculate_address_by_state_init(state_init);
  slice response_address = in_msg_body~load_msg_addr();
  cell custom_payload = in_msg_body~load_dict();
  int forward_ton_amount = in_msg_body~load_coins();
  throw_unless(error::malformed_forward_payload, slice_bits(in_msg_body) >= 1);
  slice either_forward_payload = in_msg_body;
  var msg = begin_cell()
          .store_msg_flags(BOUNCEABLE)
          .store_slice(to_wallet_address)
          .store_coins(0)
          .store_msgbody_prefix_stateinit()
          .store_ref(state_init);
  var msg_body = begin_cell()
          .store_body_header(op::internal_transfer, query_id)
          .store_coins(jetton_amount)
          .store_slice(owner_address)
          .store_slice(response_address)
          .store_coins(forward_ton_amount)
          .store_slice(either_forward_payload)
          .end_cell();

  msg = msg.store_ref(msg_body);
  int fwd_count = forward_ton_amount ? 2 : 1;
  throw_unless(error::not_enough_tons, msg_value >
          forward_ton_amount +
                  ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
                  ;; but last one is optional (it is ok if it fails)
                  fwd_count * fwd_fee +
                  (2 * wallet_gas_consumption + wallet_min_tons_for_storage));
  ;; universal message send fee calculation may be activated here
  ;; by using this instead of fwd_fee
  ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)

  send_raw_message(msg.end_cell(), SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE); ;; revert on errors
  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

{-
  internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
                     response_address:MsgAddress
                     forward_ton_amount:(VarUInteger 16)
                     forward_payload:(Either Cell ^Cell)
                     = InternalMsgBody;
-}

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value, int wallet_min_tons_for_storage, int wallet_gas_consumption) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_query_id();
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  slice from_address = in_msg_body~load_msg_addr();
  slice response_address = in_msg_body~load_msg_addr();
  throw_unless(error::unauthorized_incoming_transfer,
          equal_slices(jetton_master_address, sender_address)
                  |
                  equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
  );
  int forward_ton_amount = in_msg_body~load_coins();

  int ton_balance_before_msg = my_ton_balance - msg_value;
  int storage_fee = wallet_min_tons_for_storage - min(ton_balance_before_msg, wallet_min_tons_for_storage);
  msg_value -= (storage_fee + wallet_gas_consumption);
  if(forward_ton_amount) {
    msg_value -= (forward_ton_amount + fwd_fee);
    slice either_forward_payload = in_msg_body;

    var msg_body = begin_cell()
            .store_body_header(op::transfer_notification, query_id)
            .store_coins(jetton_amount)
            .store_slice(from_address)
            .store_slice(either_forward_payload)
            .end_cell();

    var msg = begin_cell()
            .store_msg_flags(NON_BOUNCEABLE) ;; we should not bounce here cause receiver can have uninitialized contract
            .store_slice(owner_address)
            .store_coins(forward_ton_amount)
            .store_msgbody_prefix_ref()
            .store_ref(msg_body);

    send_raw_message(msg.end_cell(), SEND_MODE_PAY_FEES_SEPARETELY);
  }

  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
    var msg = begin_cell()
            .store_msg_flags(NON_BOUNCEABLE)
            .store_slice(response_address)
            .store_coins(msg_value)
            .store_msgbody_prefix_slice()
            .store_body_header(op::excesses, query_id);
    send_raw_message(msg.end_cell(), SEND_MODE_IGNORE_ERRORS);
  }

  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() burn_tokens (slice in_msg_body, slice sender_address) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_query_id();
  int jetton_amount = in_msg_body~load_coins();
  throw_unless(error::not_enough_funds, jetton_amount > 0);
  slice response_address = in_msg_body~load_msg_addr();
  cell custom_payload = in_msg_body~load_dict();
  slice custom_payload_slice = custom_payload.begin_parse();
  int destination_address = custom_payload_slice~load_uint(160); ;; destination address in other network
  custom_payload_slice.end_parse();
  in_msg_body.end_parse();

  balance -= jetton_amount;
  throw_unless(error::unauthorized_transfer, equal_slices(owner_address, sender_address));
  throw_unless(error::not_enough_funds, balance >= 0);

  var msg_body = begin_cell()
          .store_body_header(op::burn_notification, query_id) ;; 32 + 64 = 96 bit
          .store_coins(jetton_amount) ;; max 124 bit
          .store_slice(owner_address) ;; 3 + 8 + 256 = 267 bit
          .store_slice(response_address) ;; 3 + 8 + 256 = 267 bit
          .store_uint(destination_address, 160) ;; 160 bit
          .end_cell();

  var msg = begin_cell()
          .store_msg_flags(BOUNCEABLE)
          .store_slice(jetton_master_address)
          .store_coins(0)
          .store_msgbody_prefix_ref()
          .store_ref(msg_body);

  send_raw_message(msg.end_cell(), SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);

  save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() on_bounce (slice in_msg_body) impure {
  in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
  (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int op = in_msg_body~load_op();
  throw_unless(error::unknown_op, (op == op::internal_transfer) | (op == op::burn_notification));
  int query_id = in_msg_body~load_query_id();
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

  int op = in_msg_body~load_op();

  (_, _, _, int state_flags, int bridge_burn_fee, int bridge_mint_fee, int wallet_min_tons_for_storage, int wallet_gas_consumption, _, _) = get_jetton_bridge_config();

  if (op == op::transfer) { ;; outgoing transfer
    send_tokens(in_msg_body, sender_address, msg_value, fwd_fee, wallet_min_tons_for_storage, wallet_gas_consumption);
    return ();
  }

  if (op == op::internal_transfer) { ;; incoming transfer
    receive_tokens(in_msg_body, sender_address, my_balance, fwd_fee, msg_value, wallet_min_tons_for_storage, wallet_gas_consumption);
    return ();
  }

  if (op == op::burn) { ;; burn
    throw_if( error::operation_suspended, state_flags & STATE_BURN_SUSPENDED);
    throw_unless(error::burn_fee_not_matched, msg_value == bridge_burn_fee);
    burn_tokens(in_msg_body, sender_address);
    return ();
  }

  throw(error::unknown_op);
}

(int, slice, slice, cell) get_wallet_data() method_id {
  return load_data();
}

```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/messages.fc

```fc
const int BOUNCEABLE = 0x18;
const int NON_BOUNCEABLE = 0x10;

const int SEND_MODE_REGULAR = 0;
const int SEND_MODE_PAY_FEES_SEPARETELY = 1;
const int SEND_MODE_IGNORE_ERRORS = 2;
const int SEND_MODE_DESTROY = 32;
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;
const int SEND_MODE_CARRY_ALL_BALANCE = 128;

builder store_msg_flags(builder b, int msg_flag) inline { return b.store_uint(msg_flag, 6); }

{-
  Helpers below fill in default/overwritten values of message layout:
  Relevant part of TL-B schema:
  ... other:ExtraCurrencyCollection ihr_fee:Grams fwd_fee:Grams created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  bits      1                               4             4                64                32                            
  ... init:(Maybe (Either StateInit ^StateInit))  body:(Either X ^X) = Message X;
  bits      1      1(if prev is true)                   1

-}

builder store_msgbody_prefix_stateinit(builder b) inline { 
  return b.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1);
}
builder store_msgbody_prefix_slice(builder b) inline { 
  return b.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);
}
builder store_msgbody_prefix_ref(builder b) inline { 
  return b.store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1);
}

{-

addr_std$10 anycast:(Maybe Anycast) 
   workchain_id:int8 address:bits256  = MsgAddressInt;
-}

builder store_masterchain_address(builder b, int address_hash) inline {
  return b.store_uint(4, 3).store_int(-1, 8).store_uint(address_hash, 256);
}

```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/op-codes.fc

```fc
;; Jettons

const int op::transfer = 0xf8a7ea5;
const int op::transfer_notification = 0x7362d09c;
const int op::internal_transfer = 0x178d4519;
const int op::excesses = 0xd53276db;
const int op::burn = 0x595f07bc;
const int op::burn_notification = 0x7bdd97de;

;; Minter
const int op::mint = 21;

;; Bridge

const int op::execute_voting = 4;
const int op::execute_voting::swap = 0;
const int op::execute_voting::get_reward = 5;
const int op::execute_voting::change_collector = 7;

const int op::pay_swap = 8;

(slice, int) ~load_op(slice s) inline { return s.load_uint(32); }
(slice, int) ~load_query_id(slice s) inline { return s.load_uint(64); }
(slice, (int, int)) ~load_body_header(slice s) inline {
  int op = s~load_uint(32);
  int query_id = s~load_uint(64);
  return (s, (op, query_id));
}
builder store_op(builder b, int op) inline { return b.store_uint(op, 32); }
builder store_query_id(builder b, int query_id) inline { return b.store_uint(query_id, 64); }
builder store_body_header(builder b, int op, int query_id) inline {
  return b.store_uint(op, 32)
          .store_uint(query_id, 64);
}

```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/params.fc

```fc
const int CONFIG_PARAM_ID = 79;
const int MY_CHAIN_ID = 1;
const int LOG_BURN = 0xc0470ccf;
const int LOG_SWAP_PAID = 0xc0550ccf;
const int LOG_MINT_ON_MINTER = 0xc0660ccf;
const int LOG_BURN_ON_MINTER = 0xc0770ccf;

const int WORKCHAIN = 0;

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == WORKCHAIN);
}

```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/stdlib.fc

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
() set_seed(int) impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";

int equal_slices (slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";

```

## 9e06ca30e508a6d9fb21167cbb8f66399edd1190b0b01e0bbd14c546cc97a72b/utils.fc

```fc
#include "messages.fc";
#include "op-codes.fc";

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

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
    return calculate_address_by_state_init(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}

() send_receipt_message(addr, ans_tag, query_id, body, grams, mode) impure inline_ref {
    var msg = begin_cell()
            .store_uint(NON_BOUNCEABLE, 6)
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

;; LIMITS:
;; chainId: uint32 (it seems EVM chainId is uint256, but for our cases 32 bits is enough https://chainlist.org/)
;; token address in EVM network: 160 bit (an Ethereum address is a 42-character hexadecimal address derived from the last 20 bytes of the public key controlling the account with 0x appended in front. e.g., 0x71C7656EC7ab88b098defB751B7401B5f6d8976F - https://info.etherscan.com/what-is-an-ethereum-address)
;; decimals: uint8 (ERC-20 has uint8 decimals - https://eips.ethereum.org/EIPS/eip-20)
(int, int, int) unpack_wrapped_token_data(cell data) inline {
    slice slice_data = data.begin_parse();

    (
        int chain_id,
        int token_address,
        int token_decimals
    ) = (
        slice_data~load_uint(32),
        slice_data~load_uint(160),
        slice_data~load_uint(8)
    );
    slice_data.end_parse();

    return (
        chain_id,
        token_address,
        token_decimals
    );
}

;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#data-serialization
cell pack_metadata_value(slice a) inline {
    return begin_cell().store_uint(0, 8).store_slice(a).end_cell();
}

slice encode_number_to_text(int decimals, int radix) {
    builder str = begin_cell();
    int ctr  = 0;
    tuple chars =  empty_tuple();

    do {
        (decimals, int rem) = decimals /% radix;

        chars~tpush( rem >= 10 ? 87 + rem : 48 + rem);
        ctr += 1;
    } until (decimals == 0);

    repeat( ctr ) {
        str     = str.store_uint(chars.at(ctr - 1), 8);
        ctr    -= 1;
    }

    return str.end_cell().begin_parse();
}

() emit_log_simple (int event_id, cell data, int need_separate_cell) impure inline {
    ;; 1023 - (4+2+9+256+64+32+2) = 654 bit free

    var msg = begin_cell()
            .store_uint (12, 4)         ;; ext_out_msg_info$11 src:MsgAddressInt ()
            .store_uint (1, 2)          ;; addr_extern$01
            .store_uint (256, 9)        ;; len:(## 9)
            .store_uint(event_id, 256); ;; external_address:(bits len)

    if (need_separate_cell) {
        msg = msg.store_uint(1, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either
                .store_ref(data);
    } else {
        msg = msg.store_uint(0, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either
                .store_slice(data.begin_parse());
    }

    send_raw_message(msg.end_cell(), SEND_MODE_REGULAR);
}
```

## 9ffe14989a82dd5e0ec22a6f2a14f784a72c347d7552c6f220d9c3e13b7e2778/dns-utils.fc

```fc
const int one_month = 2592000; ;; 1 month in seconds = 60 * 60 * 24 * 30
const int one_year = 31622400; ;; 1 year in seconds = 60 * 60 * 24 * 366
const int auction_start_time = 1659171600; ;; GMT: Monday, 30 July 2022 г., 09:00:00
const int one_ton = 1000000000;
const int dns_next_resolver_prefix = 0xba93; ;; dns_next_resolver prefix - https://github.com/ton-blockchain/ton/blob/7e3df93ca2ab336716a230fceb1726d81bac0a06/crypto/block/block.tlb#L819

const int dns_config_id = 80; ;; dns black list config param; in testnet -80

const int op::fill_up = 0x370fec51;
const int op::outbid_notification = 0x557cea20;
const int op::change_dns_record = 0x4eb1f0f9;
const int op::process_governance_decision = 0x44beae41;
const int op::dns_balance_release = 0x4ed14b65;

int mod(int x, int y) asm "MOD";

slice zero_address() {
    return begin_cell().store_uint(0, 2).end_cell().begin_parse();
}

;; "ton\0test\0" -> "ton"
int get_top_domain_bits(slice domain) {
    int i = 0;
    int need_break = 0;
    do {
        int char = domain~load_uint(8); ;; we do not check domain.length because it MUST contains \0 character
        need_break = char == 0;
        if (~ need_break) {
            i += 8;
        }
    } until (need_break);
    throw_if(201, i == 0); ;; starts with \0
    return i;
}

slice read_domain_from_comment(slice in_msg_body) {
    int need_break = 0;
    builder result = begin_cell();
    do {
        result = result.store_slice(in_msg_body~load_bits(in_msg_body.slice_bits()));
        int refs_len = in_msg_body.slice_refs();
        need_break = refs_len == 0;
        if (~ need_break) {
            throw_unless(202, refs_len == 1);
            in_msg_body = in_msg_body~load_ref().begin_parse();
        }
    } until (need_break);
    return result.end_cell().begin_parse();
}

int check_domain_string(slice domain) {
    int i = 0;
    int len = slice_bits(domain);
    int need_break = 0;
    do {
        need_break = i == len;
        if (~ need_break) {
            int char = domain~load_uint(8);
            ;; we can do it because additional UTF-8 character's octets >= 128 -- https://www.ietf.org/rfc/rfc3629.txt
            int is_hyphen = (char == 45);
            int valid_char = (is_hyphen & (i > 0) & (i < len - 8)) | ((char >= 48) & (char <= 57)) | ((char >= 97) & (char <= 122)); ;; '-' or 0-9 or a-z

            need_break = ~ valid_char;
            if (~ need_break) {
                i += 8;
            }
        }
    } until (need_break);
    return i == len;
}

(int, int) get_min_price_config(int domain_char_count) {
    if (domain_char_count == 4) {
        return (1000, 100);
    }
    if (domain_char_count == 5) {
        return (500, 50);
    }
    if (domain_char_count == 6) {
        return (400, 40);
    }
    if (domain_char_count == 7) {
        return (300, 30);
    }
    if (domain_char_count == 8) {
        return (200, 20);
    }
    if (domain_char_count == 9) {
        return (100, 10);
    }
    if (domain_char_count == 10) {
        return (50, 5);
    }
    return (10, 1);
}

int get_min_price(int domain_bits_length, int now_time) {
    (int start_min_price, int end_min_price) = get_min_price_config(domain_bits_length / 8);
    start_min_price *= one_ton;
    end_min_price *= one_ton;
    int seconds = now_time - auction_start_time;
    int months = seconds / one_month;
    if (months > 21) {
        return end_min_price;
    }
    repeat (months) {
        start_min_price = start_min_price * 90 / 100;
    }
    return start_min_price;
}
```

## 9ffe14989a82dd5e0ec22a6f2a14f784a72c347d7552c6f220d9c3e13b7e2778/root-dns.fc

```fc
;; Root DNS resolver 2.0 in masterchain
;; Added support for ".t.me" domain zone (https://t.me/tonblockchain/167), in addition to ".ton" domain zone.
;; Added redirect from short "www.ton" to "foundation.ton" domain
;; compiled by FunC https://github.com/ton-blockchain/ton/tree/20758d6bdd0c1327091287e8a620f660d1a9f4da

(slice, slice, slice) load_data() inline {
    slice ds = get_data().begin_parse();
    return (
            ds~load_msg_addr(), ;; address of ".ton" dns resolver smart contract in basechain
            ds~load_msg_addr(), ;; address of ".t.me" dns resolver smart contract in basechain
            ds~load_msg_addr() ;; address of "www.ton" dns resolver smart contract in basechain
    );
}

(int, cell) dnsresolve(slice subdomain, int category) method_id {
    throw_unless(70, mod(slice_bits(subdomain), 8) == 0);

    int starts_with_zero_byte = subdomain.preload_int(8) == 0;

    int subdomain_len = slice_bits(subdomain);

    if (starts_with_zero_byte & (subdomain_len == 8)) { ;; "." requested
        return (8, null()); ;; resolved but no dns-records
    }
    if (starts_with_zero_byte) {
        subdomain~load_uint(8);
    }

    (slice ton_address, slice t_me_address, slice ton_www_address) = load_data();

    slice ton_www_domain = begin_cell().store_slice("ton").store_uint(0, 8).store_slice("www").store_uint(0, 8).end_cell().begin_parse();

    if (subdomain_len >= 8 * 8) {
        if (equal_slices(subdomain.preload_bits(8 * 8), ton_www_domain)) {

            cell result = begin_cell()
                    .store_uint(dns_next_resolver_prefix, 16)
                    .store_slice(ton_www_address)
                    .end_cell();

            return (7 * 8 + (starts_with_zero_byte ? 8 : 0), result);

        }
    }

    slice ton_domain = begin_cell().store_slice("ton").store_uint(0, 8).end_cell().begin_parse();

    if (subdomain_len >= 4 * 8) {
        if (equal_slices(subdomain.preload_bits(4 * 8), ton_domain)) {

            cell result = begin_cell()
                    .store_uint(dns_next_resolver_prefix, 16)
                    .store_slice(ton_address)
                    .end_cell();

            return (3 * 8 + (starts_with_zero_byte ? 8 : 0), result);

        }
    }

    slice t_me_domain = begin_cell().store_slice("me").store_uint(0, 8).store_slice("t").store_uint(0, 8).end_cell().begin_parse();

    if (subdomain_len >= 5 * 8) {
        if (equal_slices(subdomain.preload_bits(5 * 8), t_me_domain)) {

            cell result = begin_cell()
                    .store_uint(dns_next_resolver_prefix, 16)
                    .store_slice(t_me_address)
                    .end_cell();

            return (4 * 8 + (starts_with_zero_byte ? 8 : 0), result);

        }
    }

    return (0, null()); ;; domain cannot be resolved
}

() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
}
```

## 9ffe14989a82dd5e0ec22a6f2a14f784a72c347d7552c6f220d9c3e13b7e2778/stdlib.fc

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

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/contracts/order.func

```func
#include "imports/stdlib.fc";
#include "types.func";
#include "op-codes.func";
#include "messages.func";
#include "errors.func";

;; DATA

global slice multisig_address;
global int order_seqno;
global int threshold;
global int sent_for_execution?;
global cell signers;
global int approvals_mask;
global int approvals_num;
global int expiration_date;
global cell order;

() load_data() impure inline {
    slice ds = get_data().begin_parse();
    multisig_address = ds~load_msg_addr();
    order_seqno = ds~load_order_seqno();

    if (ds.slice_bits() == 0) {
        ;; not initialized yet
        threshold = null();
        sent_for_execution? = null();
        signers = null();
        approvals_mask = null();
        approvals_num = null();
        expiration_date = null();
        order = null();
    } else {
        threshold = ds~load_index();
        sent_for_execution? = ds~load_bool();
        signers = ds~load_nonempty_dict();
        approvals_mask = ds~load_uint(MASK_SIZE);
        approvals_num = ds~load_index();
        expiration_date = ds~load_timestamp();
        order = ds~load_ref();
        ds.end_parse();
    }
}

() save_data() impure inline {
    set_data(
        begin_cell()
        .store_slice(multisig_address)
        .store_order_seqno(order_seqno)
        .store_index(threshold)
        .store_bool(sent_for_execution?)
        .store_nonempty_dict(signers)
        .store_uint(approvals_mask, MASK_SIZE)
        .store_index(approvals_num)
        .store_timestamp(expiration_date)
        .store_ref(order)
        .end_cell()
    );
}

;; UTILS

slice get_text_comment(slice in_msg_body) impure inline {
    if (in_msg_body.slice_refs() == 0) {
        return in_msg_body;
    }

    ;;combine comment into one slice
    builder combined_string = begin_cell();
    int need_exit = false;
    do {
        ;; store all bits from current cell
        ;; it's ok to overflow here, it means that comment is incorrect
        combined_string = combined_string.store_slice(in_msg_body.preload_bits(in_msg_body.slice_bits()));
        ;;and go to the next

        if (in_msg_body.slice_refs()) {
            in_msg_body = in_msg_body.preload_ref().begin_parse();
        } else {
            need_exit = true;
        }

    } until (need_exit);
    return combined_string.end_cell().begin_parse();
}

(int, int) find_signer_by_address(slice signer_address) impure inline {
    int found_signer? = false;
    int signer_index = -1;
    do {
        (signer_index, slice value, int next_found?) = signers.udict_get_next?(INDEX_SIZE, signer_index);
        if (next_found?) {
            if (equal_slices_bits(signer_address, value)) {
                found_signer? = true;
                next_found? = false; ;; fast way to exit loop
            }
        }
    } until (~ next_found?);
    return (signer_index, found_signer?);
}

() add_approval(int signer_index) impure inline {
    int mask = 1 << signer_index;
    throw_if(error::already_approved, approvals_mask & mask);
    approvals_num += 1;
    approvals_mask |= mask;
}

() try_execute(int query_id) impure inline_ref {
    if (approvals_num == threshold) {
        send_message_with_only_body(
            multisig_address,
            0,
            begin_cell()
            .store_op_and_query_id(op::execute, query_id)
            .store_order_seqno(order_seqno)
            .store_timestamp(expiration_date)
            .store_index(approvals_num)
            .store_hash(signers.cell_hash())
            .store_ref(order),
            NON_BOUNCEABLE,
            SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_BOUNCE_ON_ACTION_FAIL
        );
        sent_for_execution? = true;
    }
}

() approve(int signer_index, slice response_address, int query_id) impure inline_ref {
    try {
        throw_if(error::already_executed, sent_for_execution?);

        add_approval(signer_index);

        send_message_with_only_body(
            response_address,
            0,
            begin_cell().store_op_and_query_id(op::approve_accepted, query_id),
            NON_BOUNCEABLE,
            SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL
        );

        try_execute(query_id);

        save_data();

    } catch (_, exit_code) {
        send_message_with_only_body(
            response_address,
            0,
            begin_cell()
            .store_op_and_query_id(op::approve_rejected, query_id)
            .store_uint(exit_code, 32),
            NON_BOUNCEABLE,
            SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL
        );
    }
}

;; RECEIVE

() recv_internal(int balance, int msg_value, cell in_msg_full, slice in_msg_body) {
    slice in_msg_full_slice = in_msg_full.begin_parse();
    int msg_flags = in_msg_full_slice~load_msg_flags();
    if (is_bounced(msg_flags)) {
        return ();
    }
    slice sender_address = in_msg_full_slice~load_msg_addr();

    int op = in_msg_body~load_op();

    load_data();

    if (op == 0) {
        ;; message with text comment
        slice text_comment = get_text_comment(in_msg_body);
        throw_unless(error::unknown_op, equal_slices_bits(text_comment, "approve"));

        (int signer_index, int found_signer?) = find_signer_by_address(sender_address);
        throw_unless(error::unauthorized_sign, found_signer?);

        approve(signer_index, sender_address, cur_lt());
        return ();
    }

    int query_id = in_msg_body~load_query_id();

    if (op == op::init) {
        throw_unless(error::unauthorized_init, equal_slices_bits(sender_address, multisig_address));

        if (null?(threshold)) {
            ;; Let's init
            threshold = in_msg_body~load_index();
            sent_for_execution? = false;
            signers = in_msg_body~load_nonempty_dict();
            approvals_mask = 0;
            approvals_num = 0;
            expiration_date = in_msg_body~load_timestamp();
            throw_unless(error::expired, expiration_date >= now()); ;; in case of error TONs will bounce back to multisig
            order = in_msg_body~load_ref();

            int approve_on_init? = in_msg_body~load_bool();
            if (approve_on_init?) {
                int signer_index = in_msg_body~load_index();
                add_approval(signer_index);
                try_execute(query_id);
            }
            in_msg_body.end_parse();
            save_data();
            return ();
        } else {
            ;; order is inited second time, if it is inited by another oracle
            ;; we count it as approval
            throw_unless(error::already_inited, in_msg_body~load_index() == threshold);
            throw_unless(error::already_inited, in_msg_body~load_nonempty_dict().cell_hash() == signers.cell_hash());
            throw_unless(error::already_inited,in_msg_body~load_timestamp() == expiration_date);
            throw_unless(error::already_inited, in_msg_body~load_ref().cell_hash() == order.cell_hash());

            int approve_on_init? = in_msg_body~load_bool();
            throw_unless(error::already_inited, approve_on_init?);
            int signer_index = in_msg_body~load_index();
            in_msg_body.end_parse();
            (slice signer_address, int found?) = signers.udict_get?(INDEX_SIZE, signer_index);
            throw_unless(error::unauthorized_sign, found?);
            approve(signer_index, signer_address, query_id);
            return ();
        }
    }

    if (op == op::approve) {
        int signer_index = in_msg_body~load_index();
        in_msg_body.end_parse();
        (slice signer_address, int found?) = signers.udict_get?(INDEX_SIZE, signer_index);
        throw_unless(error::unauthorized_sign, found?);
        throw_unless(error::unauthorized_sign, equal_slices_bits(sender_address, signer_address));

        approve(signer_index, sender_address, query_id);
        return ();
    }

    throw(error::unknown_op);
}

;; GET-METHODS

_ get_order_data() method_id {
    load_data();
    return (
        multisig_address,
        order_seqno,
        threshold,
        sent_for_execution?,
        signers,
        approvals_mask,
        approvals_num,
        expiration_date,
        order
    );
}
```

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/errors.func

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

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/op-codes.func

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

## a01e057fbd4288402b9898d78d67bd4e90254c93c5866879bc2d1d12865436bc/types.func

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
    const programName: String = "Base";
    const minTonsForStorage: Int = ton("0.04");
    
    gasMultiplier: Int as coins = ton("1.0");
    isSetup: Bool = false;

    owner: Address;
    master: Address;
    recipient: Address;
    levelPrices: map<Int as uint8, Int>;
    levelFees: map<Int as uint8, Int>;
    totalProfit: Int as coins = ton("0.0");

    init(master: Address){
        nativeThrowUnless(132, sender() == master);

        self.master = master;
        self.owner = sender();
        self.recipient = sender();

        self.setupLevelPrice();
        self.setupLevelFee();
    }

    receive(){}

    receive("PaymentForSquadCreation"){}

    receive("withdraw"){
        self.requireOwner();
        nativeReserve(self.minTonsForStorage, 0);

        send(SendParameters{
            to: self.recipient,
            value: 0,
            mode: SendRemainingBalance,
            body: "Your withdraw".asComment(),
        });
    }

    receive(msg: SetupBaseProgramMain){
        nativeThrowUnless(132, sender() == self.master);
        nativeThrowUnless(131, !self.isSetup);

        self.owner = msg.owner;
        self.recipient = msg.owner;
        self.isSetup = true;
        self.reply(SetupMaster{}.toCell());
    }

    receive(msg: BuyLevel){
        self.requireUserMain(msg.userId);
        let msgValue: Int = context().value;
        let balance: Int = myBalance() - msgValue;

        nativeThrowUnless(131,  msg.levelNumber > 0 &&  msg.levelNumber <= 12);

        let increment: Int = msg.levelNumber * self.gasMultiplier;
        let levelFee: Int = self.levelFees.get(msg.levelNumber)!!;
        let levelPrice: Int = self.levelPrices.get(msg.levelNumber)!!;

        let requireMinValue: Int = levelPrice + increment + levelFee;
        nativeThrowUnless(131, (requireMinValue <= msgValue || msg.userId == 1));
        
        nativeReserve(balance + levelFee, 0);
        self.totalProfit += levelPrice;
        let init: StateInit = initOf FtBaseProgramUser(msg.userId, myAddress());

        send(SendParameters{
            to: contractAddress(init),
            value: 0,
            mode: SendRemainingBalance,
            body: ActivateLevel{
                owner: msg.owner,
                invitedId: msg.invitedId,
                levelNumber: msg.levelNumber,
                levelPrice: levelPrice,
                recipientExcesses: msg.recipientExcesses
            }.toCell(),
            code: msg.levelNumber == 1 ? init.code : null,
            data: msg.levelNumber == 1 ? init.data : null
        });
    }

    receive(msg: UpdateLevelPrice){
        self.requireOwner();
        nativeThrowUnless(5, (msg.levelNumber > 0 && msg.levelNumber <= 12));
        self.levelPrices.set(msg.levelNumber, msg.levelPrice);
        self.reply("Level price successfully changed".asComment());
    }

    receive(msg: UpdateLevelFee){
        self.requireOwner();
        nativeThrowUnless(5, (msg.levelNumber > 0 && msg.levelNumber <= 12));
        self.levelFees.set(msg.levelNumber, msg.levelFee);
        self.reply("Level fee successfully changed".asComment());
    }

    receive(msg: UpdateGasMultiplier){
        self.requireOwner();
        nativeThrowUnless(5, msg.newValue > ton("0.5"));
        self.gasMultiplier = msg.newValue;
        self.reply("Gas multiplier successfully changed".asComment());
    }

    receive(msg: UpdateRecipientAddress){
        self.requireOwner();
        self.recipient = msg.newAddress;
        self.reply("Recipient address successfully changed".asComment());
    }

    // ------------------ Private Function  ------------------ //

    fun requireUserMain(id: Int){
        nativeThrowUnless(132, sender() == self.userMainAddress(id));
    }

    fun setupLevelPrice(){
        self.levelPrices.set(1, ton("1.0"));
        self.levelPrices.set(2, ton("2.0"));
        self.levelPrices.set(3, ton("4.0"));
        self.levelPrices.set(4, ton("7.0"));
        self.levelPrices.set(5, ton("12.0"));
        self.levelPrices.set(6, ton("22.0"));
        self.levelPrices.set(7, ton("40.0"));
        self.levelPrices.set(8, ton("70.0"));
        self.levelPrices.set(9, ton("120.0"));
        self.levelPrices.set(10, ton("220.0"));
        self.levelPrices.set(11, ton("400.0"));
        self.levelPrices.set(12, ton("790.0"));
    }

    fun setupLevelFee(){
        self.levelFees.set(1, ton("0.25"));
        self.levelFees.set(2, ton("0.5"));
        self.levelFees.set(3, ton("1.0"));
        self.levelFees.set(4, ton("1.75"));
        self.levelFees.set(5, ton("3.0"));
        self.levelFees.set(6, ton("5.5"));
        self.levelFees.set(7, ton("10.0"));
        self.levelFees.set(8, ton("17.5"));
        self.levelFees.set(9, ton("30.0"));
        self.levelFees.set(10, ton("55.0"));
        self.levelFees.set(11, ton("100.0"));
        self.levelFees.set(12, ton("197.5"));
    }

    // ------------------ Get Functions ------------------ //

    get fun programName(): String {
        return self.programName;
    }

    get fun gasMultiplier(): Int {
        return self.gasMultiplier;
    }

    get fun levelPrices(): map<Int as uint8, Int> {
        return self.levelPrices;
    }

    get fun levelFees(): map<Int as uint8, Int> {
        return self.levelFees;
    }

    get fun totalProfit(): Int {
        return self.totalProfit;
    }

    get fun masterAddress(): Address {
        return self.master;
    }

    get fun recipientAddress(): Address {
        return self.recipient;
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun userMainAddress(id: Int): Address{
        let init: StateInit = initOf FtUserMain(id, self.master);
        return contractAddress(init);
    }

    get fun programUserAddress(id: Int): Address{
        let init: StateInit = initOf FtBaseProgramUser(id, myAddress());
        return contractAddress(init);
    }
}

```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/ft_base_program_user.tact

```tact
import "@stdlib/deploy";

import "./info_extends.tact";
import "./messages.tact";

contract FtBaseProgramUser with Deployable {
    const minTonsForStorage: Int = ton("0.1");

    id: Int as uint64;
    owner: Address?;
    program: Address;
    invitedAddress: Address?;
    holdBalance: Int as coins = ton("0.0");

    overtakeInfo: map<Int as uint8, Int as uint16> = emptyMap();
    levelInfo: map<Int as uint8, Info> = emptyMap();
    lastLevel: Int as uint8 = 0;

    init(id: Int, program: Address){
        nativeThrowUnless(132, sender() == program);

        self.id = id;
        self.program = program;
    }

    receive(){}

    receive("gift"){}

    receive("withdraw"){
        self.requireOwner();
        nativeReserve(self.minTonsForStorage + self.holdBalance, 0);

        send(SendParameters{
            to: self.owner!!,
            value: 0,
            mode: SendRemainingBalance,
            body: "Your withdraw".asComment(),
        });
    }

    receive(msg: ActivateLevel){
        self.requireProgram();
        self.checkPossibilityActivateLevel(msg.levelNumber);

        let balance: Int = myBalance() - context().value;
        nativeReserve(max(balance, self.minTonsForStorage), 0);

        self.lastLevel = msg.levelNumber;
        self.levelInfo.set(msg.levelNumber, Info{});

        if (self.owner == null){
            self.owner = msg.owner;
        }
        
        if (self.invitedAddress == null){
            self.invitedAddress = self.programUserAddress(msg.invitedId);
        }

        if(self.id != 1){
            self.sendToUpline(self.id, msg.levelNumber, msg.levelPrice, msg.recipientExcesses);
        } else {
            self.lastLevel = 12;
            self.sendExcesses(self.owner!!);
        }
    }

    receive(msg: UpdateMatrix){
        self.requireUserProgram(msg.fromId);
        let balance: Int = myBalance() - context().value;

        if (self.id == 1){
            self.updateMatrixForId1(msg, balance);
        } else if (self.lastLevel < msg.levelNumber){
            nativeReserve(balance, 0);
            self.makeOvertake(msg.id, msg.levelNumber, msg.levelPrice, msg.recipientExcesses);
        } else {
           self.updateMatrixForNonId1(msg, balance);
        }
    }

    receive(msg: OverflowUp){
        self.requireUserProgram(msg.fromId);
        let balance: Int = myBalance() - context().value;

        let info: Info = self.getInfo(msg.levelNumber);
        let isFrozen = info.isFrozenLevel(msg.levelNumber, self.lastLevel);
        let statusCode: Int = info.findPlaceForOverflowUp(msg.id, msg.fromId, msg.levelPrice, isFrozen);
        
        let splitLevelPrice = msg.levelPrice / 2;

        if (statusCode < 40) {
            emit(ReinvestNumber{reinvestNumber: info.reinvestCount, statusCode: statusCode}.toCell());

            if (statusCode > 30 && self.id != 1) {
                self.holdBalance += splitLevelPrice;
            }

            if (isFrozen && statusCode < 30) {
                nativeReserve(balance, 0);
                self.sendGift(splitLevelPrice);
            } else {
                nativeReserve(balance + splitLevelPrice, 0);
            }

            self.levelInfo.set(msg.levelNumber, info);
            self.sendExcesses(msg.recipientExcesses);
        } else if (statusCode > 40) {
            self.finishCycle(info, msg.levelNumber);

            if (self.id != 1) {
                self.holdBalance -= splitLevelPrice;
                nativeReserve(balance - splitLevelPrice, 0);
                self.sendToUpline(self.id, msg.levelNumber, msg.levelPrice, msg.recipientExcesses);
            } else {
                nativeReserve(balance + splitLevelPrice, 0);
                self.sendExcesses(msg.recipientExcesses);
            }
        }
    }

    receive(msg: OverflowDown){
        self.requireUserProgram(msg.fromId);
        let balance: Int = myBalance() - context().value;

        let info: Info = self.getInfo(msg.levelNumber);
        let isFrozen: Bool = info.isFrozenLevel(msg.levelNumber, self.lastLevel);
        info.findPlaceForOverflowDown(msg.id, msg.levelPrice, isFrozen);
        self.levelInfo.set(msg.levelNumber, info);
        
        emit(ReinvestNumber{reinvestNumber: info.reinvestCount}.toCell());

        let splitLevelPrice = msg.levelPrice / 2;
        if (isFrozen) {
            nativeReserve(balance, 0);
            self.sendGift(splitLevelPrice);
        } else {
            nativeReserve(balance + splitLevelPrice, 0);
        }

        self.sendExcesses(msg.recipientExcesses);
    }

    receive(msg: UpdateUpperAddress){
        self.requireUserProgram(msg.fromId);

        let info: Info = self.getInfo(msg.levelNumber);
        info.updateUpperAddress(msg.upperAddress);
        self.levelInfo.set(msg.levelNumber, info);

        self.sendRemainingValue(msg.recipientExcesses);
    }

    // ------------------ Private Function  ------------------ //

    fun updateMatrixForId1(msg: UpdateMatrix, balance: Int){
        let info: Info = self.getInfo(msg.levelNumber);
        let statusCode: Int = info.findPlaceInMatrix(msg.id, msg.fromId, msg.levelNumber, msg.levelPrice, self.lastLevel);
        self.levelInfo.set(msg.levelNumber, info);

        let splitLevelPrice = msg.levelPrice / 2;
        let reserveValue = (statusCode < 10) ? msg.levelPrice : splitLevelPrice;
        nativeReserve(balance + reserveValue, 0);

        if (statusCode < 40) {
            emit(ReinvestNumber{reinvestNumber: info.reinvestCount, statusCode: statusCode}.toCell());
        }

        if (statusCode < 10){
            self.sendUpdateUpperAddess(msg.id, myAddress(), msg.levelNumber, 0, msg.recipientExcesses);
        } else {
            if (statusCode > 40) {
                self.finishCycle(info, msg.levelNumber);
            }

            let recipient: Int = (statusCode % 10 == 1) ? info.matrix.u1!! : info.matrix.u2!!;
            self.sendOverflowDown(recipient, msg.id, msg.levelNumber, msg.levelPrice, 0, msg.recipientExcesses);
        }
    }

    fun updateMatrixForNonId1(msg: UpdateMatrix, balance: Int){
        let info: Info = self.getInfo(msg.levelNumber);

        if (msg.levelNumber != 1 && info.upperAddress == null){
            nativeReserve(balance, 0);
            self.makeOvertake(msg.id, msg.levelNumber, msg.levelPrice, msg.recipientExcesses);
            return;
        } 

        let statusCode: Int = info.findPlaceInMatrix(msg.id, msg.fromId, msg.levelNumber, msg.levelPrice, self.lastLevel);
        self.levelInfo.set(msg.levelNumber, info);

        if (statusCode < 40) {
            emit(ReinvestNumber{reinvestNumber: info.reinvestCount, statusCode: statusCode}.toCell());
        }

        let isFrozen: Bool = info.isFrozenLevel(msg.levelNumber, self.lastLevel);
        let splitLevelPrice: Int = msg.levelPrice / 2;
        let isFirst: Bool = (statusCode % 10 == 1);

        if (statusCode < 10){
            if (isFrozen) {
                nativeReserve(balance, 0);
                self.sendGift(splitLevelPrice);
            } else {
                nativeReserve(balance + splitLevelPrice, 0);
            }

            self.sendUpdateUpperAddess(msg.id, myAddress(), msg.levelNumber, ton("0.05"), msg.recipientExcesses);
            let recipient = (info.upperAddress == null) ? self.invitedAddress!! : info.upperAddress!!;
            self.sendOverflowUp(recipient, msg.id, msg.levelNumber, msg.levelPrice, msg.recipientExcesses);
        } else if (statusCode < 40) {
            if (statusCode > 30) {
                self.holdBalance += splitLevelPrice;
            }

            if (isFrozen && statusCode < 30) {
                nativeReserve(balance, 0);
                self.sendGift(splitLevelPrice);
            } else {
                nativeReserve(balance + splitLevelPrice, 0);
            }

            let recipient = isFirst ? info.matrix.u1!! : info.matrix.u2!!;
            self.sendOverflowDown(recipient, msg.id, msg.levelNumber, msg.levelPrice, 0, msg.recipientExcesses);
        } else {
            self.holdBalance -= splitLevelPrice;
            nativeReserve(balance - splitLevelPrice, 0);

            let recipient = isFirst ? info.matrix.u1!! : info.matrix.u2!!;
            self.finishCycle(info, msg.levelNumber);
            self.sendOverflowDown(recipient, msg.id, msg.levelNumber, msg.levelPrice, splitLevelPrice, msg.recipientExcesses);
            self.sendToUpline(self.id, msg.levelNumber, msg.levelPrice, msg.recipientExcesses);
        }
    }

    fun makeOvertake(id: Int, levelNumber: Int, levelPrice: Int, recipientExcesses: Address){
        self.updateOvertakingInfo(levelNumber);
        self.sendToUpline(id, levelNumber, levelPrice, recipientExcesses);
    }

    fun sendToUpline(id: Int, levelNumber: Int, levelPrice: Int, recipientExcesses: Address){
        send(SendParameters{
            to: self.invitedAddress!!,
            value: 0,
            mode: SendRemainingBalance,
            body: UpdateMatrix{
                id: id,
                fromId: self.id,
                levelNumber: levelNumber,
                levelPrice: levelPrice,
                recipientExcesses: recipientExcesses
            }.toCell()
        });
    }

    fun sendUpdateUpperAddess(toId: Int, upperAddress: Address, levelNumber: Int, value: Int, recipientExcesses: Address){
        let mode: Int = 128;

        if (value != 0) {
            mode = 3;
        }

        send(SendParameters{
            to: self.programUserAddress(toId),
            value: value,
            mode: mode,
            body: UpdateUpperAddress{
                fromId: self.id,
                upperAddress: upperAddress,
                levelNumber: levelNumber,
                recipientExcesses: recipientExcesses
            }.toCell()
        });
    }

    fun sendOverflowUp(recipient: Address, id: Int, levelNumber: Int, levelPrice: Int, recipientExcesses: Address){
        send(SendParameters{
            to: recipient,
            value: 0,
            mode: SendRemainingBalance,
            body: OverflowUp{
                id: id,
                fromId: self.id,
                levelNumber: levelNumber,
                levelPrice: levelPrice,
                recipientExcesses: recipientExcesses
            }.toCell()
        });
    }

    fun sendOverflowDown(toId: Int, fromId: Int, levelNumber: Int, levelPrice: Int, value: Int, recipientExcesses: Address){
        let recipient: Address = self.programUserAddress(toId);
        self.sendUpdateUpperAddess(fromId, recipient, levelNumber, ton("0.03"), recipientExcesses);
        let mode: Int = 128;

        if (value != 0) {
            value += ton("0.06");
            mode = 3;
        }

        send(SendParameters{
            to: recipient,
            value: value,
            mode: mode,
            body: OverflowDown{
                id: fromId,
                fromId: self.id,
                levelNumber: levelNumber,
                levelPrice: levelPrice,
                recipientExcesses: recipientExcesses
            }.toCell()
        });
    }

    fun sendGift(value: Int){
        send(SendParameters{
            to: self.invitedAddress!!,
            value: value,
            mode: SendPayFwdFeesSeparately | SendIgnoreErrors,
            body: "gift".asComment()
        });
    }

    fun sendExcesses(recipient: Address){
         send(SendParameters{
            to: recipient,
            value: 0,
            mode: SendRemainingBalance,
            body: "Excesses".asComment(),
        });
    }

    fun sendRemainingValue(recipient: Address){
         send(SendParameters{
            to: recipient,
            value: 0,
            mode: SendIgnoreErrors | SendRemainingValue,
            body: "Excesses".asComment(),
        });
    }

    fun finishCycle(info: Info, levelNumber: Int){
        emit(FinishCycle{
            matrix: info.matrix,
            levelNumber: levelNumber,
            reinvestNumber: info.reinvestCount
        }.toCell());
        self.updateReinvestCounter(info, levelNumber);
    }

    fun updateReinvestCounter(info: Info, levelNumber: Int){
        info.resetInfoForReinvest();
        self.levelInfo.set(levelNumber, info);
    }

    fun updateOvertakingInfo(levelNumber: Int){
        let count: Int? = self.overtakeInfo.get(levelNumber);

        if (count == null) {
            count = 0;
        }

        count = count!! + 1;
        self.overtakeInfo.set(levelNumber, count!!);
        emit(Overtook{levelNumber: levelNumber, newValue: count!!}.toCell());
    }

    fun getInfo(levelNumber: Int): Info {
        let info: Info? = self.levelInfo.get(levelNumber);

        if(info == null){
            self.levelInfo.set(levelNumber, Info{});
            info = Info{};
        }
        
        return info!!;
    }

    fun checkPossibilityActivateLevel(levelNumber: Int){
        nativeThrowUnless(131, (levelNumber - self.lastLevel) == 1);
    }

    fun requireUserProgram(id: Int){
        nativeThrowUnless(132, sender() == self.programUserAddress(id));
    }

    fun requireProgram(){
        nativeThrowUnless(132, sender() == self.program);
    }

    fun requireOwner(){
        nativeThrowUnless(132, sender() == self.owner!!);
    }

    // ------------------ Get Functions ------------------ //

    get fun id(): Int {
        return self.id;
    }

    get fun owner(): Address {
        return self.owner!!;
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun withdrawBalance(): Int {
        return myBalance() - self.holdBalance - self.minTonsForStorage;
    }

    get fun holdBalance(): Int {
        return self.holdBalance;
    }

    get fun invitedAddress(): Address {
        return self.invitedAddress!!;
    }

    get fun overtakeInfo(): map<Int as uint8, Int as uint16> {
        return self.overtakeInfo;
    }

    get fun levelInfo(): map<Int as uint8, Info> {
        return self.levelInfo;
    }

    get fun lastLevel(): Int {
        return self.lastLevel;
    }

    get fun programAddress(): Address {
        return self.program;
    }

    get fun programUserAddress(id: Int): Address {
        let init: StateInit = initOf FtBaseProgramUser(id, self.program);
        return contractAddress(init);
    }
}

```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/ft_user_main.tact

```tact
import "@stdlib/ownable";
import "@stdlib/deploy";

import "./messages.tact";
import "./ft_user_storage.tact";

contract FtUserMain with Deployable, Ownable {
    const minTonsForStorage: Int = ton("0.1");
    owner: Address;
    master: Address;
    joinAt: Int;

    id: Int as uint64;
    invitedId: Int as uint64 = 0;
    referralCount: Int as uint32 = 0;

    programs: map<Int as uint8, Address> = emptyMap();

    init(id: Int, master: Address){
        self.id = id;
        self.owner = sender();
        self.master = master;
        self.joinAt = now();
    }

    receive(msg: SetupUserMain){
        nativeThrowUnless(132, sender() == self.userStorageAddress(msg.owner));
        nativeReserve(self.minTonsForStorage, 0);

        self.owner = msg.owner;
        self.invitedId = msg.invitedId;
        self.programs = msg.programs;

        self.addReferral();
        self.buy(0, 1, msg.owner);
    }

    receive(msg: AddReferral){
        nativeThrowUnless(132, sender() == self.userMainAddress(msg.userId));
        self.referralCount += 1;
        commit();
        
        send(SendParameters{
            to: msg.userAddress,
            value: 0,
            mode: SendIgnoreErrors | SendRemainingValue,
            body: "Excesses".asComment(),
        });
    }

    receive(msg: Buy){
        nativeThrowUnless(131, self.programs.get(msg.programId) != null);
        nativeReserve(self.minTonsForStorage, 0);
        self.buy(msg.programId, msg.levelNumber, sender());
    }

    receive("UpdatePrograms"){
        send(SendParameters{
            to: self.master,
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body: "GetProgramAddresses".asComment()
        });
    }

    receive(msg: GetInvitedId) {
        self.reply(UpdateInvitedId{
            invitedId: self.invitedId,
            forwardPayload: msg.forwardPayload
        }.toCell());
    }

    receive(msg: ProgramAddresses){
        nativeThrowUnless(132, sender() == self.master);
        self.programs = msg.programs;
        send(SendParameters{
            to: self.owner,
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body: "Excesses".asComment()
        });
    }

    // ------------------ Private Function  ------------------ //

    fun buy(programId: Int, levelNumber: Int, recipientExcesses: Address){
        send(SendParameters{
            to: self.programs.get(programId)!!,
            value: 0,
            mode: SendRemainingBalance | SendPayFwdFeesSeparately,
            body: BuyLevel{
                owner: self.owner,
                userId: self.id,
                invitedId: self.invitedId,
                levelNumber: levelNumber,
                recipientExcesses: recipientExcesses
            }.toCell()
        });
    }

    fun addReferral(){
        send(SendParameters{
            to: self.userMainAddress(self.invitedId),
            value: ton("0.05"),
            mode: SendIgnoreErrors | SendPayFwdFeesSeparately,
            body: AddReferral {
                userId: self.id,
                userAddress: self.owner
            }.toCell()
        });
    }

    // ------------------ Get Function  ------------------ //

    get fun id(): Int {
        return self.id;
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun invitedId(): Int? {
        return self.invitedId;
    }

    get fun referralCount(): Int {
        return self.referralCount;
    }

    get fun programs(): map<Int as uint8, Address> {
        return self.programs;
    }

    get fun userMainAddress(id: Int): Address{
        let init: StateInit = initOf FtUserMain(id, self.master);
        return contractAddress(init);
    }

    get fun userStorageAddress(address: Address): Address{
        let init: StateInit = initOf FtUserStorage(address, self.master);
        return contractAddress(init);
    }

    get fun joinAt(): Int {
        return self.joinAt;
    }
}

```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/ft_user_storage.tact

```tact
import "@stdlib/deploy";
import "./messages.tact";

import "./ft_user_main.tact";

contract FtUserStorage with Deployable {
    const minTonsForStorage: Int = ton("0.01");

    id: Int? as uint64;
    master: Address;
    owner: Address;

    init(owner: Address, master: Address) {
        nativeThrowUnless(132, sender() == master);

        self.master = master;
        self.owner = owner;
    }

    receive(msg: SetupUserStorage) {
        self.requireMaster();
        self.id = msg.userId;
        nativeReserve(self.minTonsForStorage, 0);

        let init: StateInit = initOf FtUserMain(msg.userId, self.master);
        send(SendParameters{
            to: contractAddress(init),
            value: 0,
            mode: SendRemainingBalance,
            body: msg.forwardPayload,
            code: init.code,
            data: init.data
        });
    }

    receive(msg: VerifyExistence) {
        self.requireMaster();
        nativeReserve(self.minTonsForStorage, 0);

        if (self.id != null) {
            self.sendAlreadyJoinedMessage();
        } else {
            self.registerUser(msg.invitedId);
        }
    }

    // ------------------ Private Function  ------------------ //

    fun registerUser(invitedId: Int) {
        send(SendParameters{
            to: self.master,
            value: 0,
            mode: SendRemainingBalance,
            body: Join{
                userAddress: self.owner,
                invitedId: invitedId
            }.toCell()
        });
    }

    fun sendAlreadyJoinedMessage() {
        send(SendParameters{
            to: self.owner,
            value: 0,
            mode: SendRemainingBalance,
            body: "User with this address already join".asComment()
        });
    }

    fun requireMaster() {
        nativeThrowUnless(132, sender() == self.master);
    }

    // ------------------ Get Function  ------------------ //

    get fun balance(): Int {
        return myBalance();
    }

    get fun id(): Int? {
        return self.id;
    }

    get fun owner(): Address {
        return self.owner;
    }
}

```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/info_extends.tact

```tact
import "./structs.tact";

extends mutates fun findPlaceInMatrix(self: Info, id: Int, fromId: Int, levelNumber: Int, levelPrice: Int, lastLevel: Int): Int {
    let referralType: Int = id == fromId ? 1 : 2;
    let statusCode: Int = 0;

    if (referralType == 1){
        self.personalReferralsCount += 1;
    }

    if (self.matrix.u1 == null) {
        self.matrix.u1 = id;
        self.matrix.u1t = referralType;
        self.wasUseUpperAddress = true;
        statusCode = 1;
    } else if (self.matrix.u2 == null) {
        self.matrix.u2 = id;
        self.matrix.u2t = referralType;
        self.wasUseUpperAddress = true;
        statusCode = 1;
    } else if (self.matrix.u3 == null) {
        self.matrix.u3 = id;
        self.matrix.u3t = referralType;
        statusCode = 21;
    } else if (self.matrix.u4 == null) {
        self.matrix.u4 = id;
        self.matrix.u4t = referralType;
        statusCode = 22;
    } else if (self.matrix.u5 == null) {
        self.matrix.u5 = id;
        self.matrix.u5t = 4;

        if (self.matrix.u6 != null) {
            statusCode = 41;
        } else {
            statusCode = 31;
        }
    } else if (self.matrix.u6 == null) {
        self.matrix.u6 = id;
        self.matrix.u6t = 4;

        if (self.matrix.u5 != null) {
            statusCode = 42;
        } else {
            statusCode = 32;
        }
    }

    if (statusCode == 1 || statusCode == 21 || statusCode == 22) {
        if self.isFrozenLevel(levelNumber, lastLevel) {
            self.incrementLostProfit(levelPrice);
        } else {
            self.incrementProfit(levelPrice);
        }
    }
    
    return statusCode;
}

extends mutates fun findPlaceForOverflowUp(self: Info, id: Int, fromId: Int, levelPrice: Int, isFrozen: Bool): Int {
    let statusCode: Int = 0;

    if (self.matrix.u2 == fromId) {
        if (self.matrix.u4 == null) {
            self.matrix.u4 = id;
            self.matrix.u4t = 2;
            statusCode = 22;
        } else if (self.matrix.u6 == null) {
            self.matrix.u6 = id;
            self.matrix.u6t = 4;
            statusCode = (self.matrix.u5 == null ? 32 : 42);
        }
    } else if (self.matrix.u1 == fromId) {
        if (self.matrix.u3 == null) {
            self.matrix.u3 = id;
            self.matrix.u3t = 2;
            statusCode = 21;
        } else if (self.matrix.u5 == null) {
            self.matrix.u5 = id;
            self.matrix.u5t = 4;
            statusCode = (self.matrix.u6 == null ? 31 : 41);
        }
    }

    if (statusCode == 21 || statusCode == 22) {
        if (isFrozen) {
            self.incrementLostProfit(levelPrice);
        } else {
            self.incrementProfit(levelPrice);
        }
    }

    return statusCode;
}

extends mutates fun findPlaceForOverflowDown(self: Info, id: Int, levelPrice: Int, isFrozen: Bool) {
    if (self.matrix.u1 == null) {
        self.matrix.u1 = id;
        self.matrix.u1t = 3;
    } else if (self.matrix.u2 == null) {
        self.matrix.u2 = id; 
        self.matrix.u2t = 3;
    }

    if (isFrozen) {
        self.incrementLostProfit(levelPrice);
    } else {
        self.incrementProfit(levelPrice);
    }
}

extends mutates fun resetInfoForReinvest(self: Info) {
    self.reinvestCount += 1;

    if (self.nextUpperAddress != null && self.upperAddress != self.nextUpperAddress) {
        self.upperAddress = self.nextUpperAddress;
    }
        
    self.wasUseUpperAddress = false;
    self.matrix = Matrix{};
}

extends mutates fun updateUpperAddress(self: Info, newUpperAddress: Address) {
     if (self.wasUseUpperAddress) {
        self.nextUpperAddress = newUpperAddress;
    } else {
        self.upperAddress = newUpperAddress;
    }
}

extends mutates fun incrementProfit(self: Info, value: Int) {
    self.totalProfit += (value / 2);
}

extends mutates fun incrementLostProfit(self: Info, value: Int) {
    self.lostProfit += (value / 2);
}

extends fun isFrozenLevel(self: Info, currentLevel: Int, lastLevel: Int): Bool {
    return currentLevel < 12 && currentLevel == lastLevel && self.reinvestCount > 1;
}

```

## a0d7cf47c3df99e8f611a754d4b241497e1670f2d5533261eff3877872382481/contract/contracts/messages.tact

```tact
import "./structs.tact";

// ------------------ FtMaster ------------------ //

message SetupMaster{

}

message SetupJoinPrice{
    newJoinPrice: Int as coins;
}

message SetupSquadPrice{
    newSquadPrice: Int as coins;
}

message UpdateProgramAddress{
    programIndex: Int as uint8;
    programAddress: Address;
}

message GiftJoin{
    userAddress: Address;
    invitedId: Int as uint64;
}

message Join{
    userAddress: Address?;
    invitedId: Int as uint64;
}

message CreateSquad{
    owner: Address?;
}

message ProgramAddresses{
    programs: map<Int as uint8, Address>;
}


// ------------------------ FtSquad ------------------ //

message PayForSquadCreation{
    receiver: Address;
    price: Int as coins;
}


// ------------------ FtUserStorage ------------------ //

message SetupUserStorage{
    userId: Int as uint64;
    forwardPayload: Cell;
}

message VerifyExistence{
    invitedId: Int as uint64;
}

// ------------------ FtUserMain ------------------ //

message SetupUserMain{
    owner: Address;
    invitedId: Int as uint64;
    programs: map<Int as uint8, Address>;
}

message AddReferral{
    userId: Int as uint64;
    userAddress: Address;
}

message Buy{
    programId: Int as uint8;
    levelNumber: Int as uint8;
}

message (0x61ca6eeb) GetInvitedId{
    forwardPayload: Cell;
}

message (0x985aee35) UpdateInvitedId{
    invitedId: Int as uint64;
    forwardPayload: Cell;
}

// ------------------ FtBaseProgramMain ------------------ //

message SetupBaseProgramMain{
    owner: Address;
}

message (0xd587100b) BuyLevel{
    owner: Address;
    userId: Int as uint64;
    invitedId: Int as uint64;
    levelNumber: Int as uint8;
    recipientExcesses: Address;
}

message UpdateLevelPrice{
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
}

message UpdateLevelFee{
    levelNumber: Int as uint8;
    levelFee: Int as coins;
}

message UpdateGasMultiplier{
    newValue: Int as coins;
}

message UpdateRecipientAddress{
    newAddress: Address;
}

// ------------------ FtBaseProgramUser ------------------ //

message(0xb5b23017) ActivateLevel{
    owner: Address;
    invitedId: Int as uint64;
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x974dd3f0) UpdateMatrix{
    id: Int as uint64;
    fromId: Int as uint64;
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x8a0257f4) OverflowDown{
    id: Int as uint64;
    fromId: Int as uint64;
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x390258fe) OverflowUp{
    id: Int as uint64;
    fromId: Int as uint64;
    levelNumber: Int as uint8;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x9472532d) Gift{
    id: Int as uint64;
    fromId: Int as uint64;
    levelPrice: Int as coins;
    recipientExcesses: Address;
}

message(0x399aaa57) UpdateUpperAddress{
    fromId: Int as uint64;
    upperAddress: Address;
    levelNumber: Int;
    recipientExcesses: Address;
}

// ------------------ FtBaseProgramUser - emit ------------------ //

message(0x52afa0af) Overtook{
    levelNumber: Int as uint8;
    newValue: Int as uint16;
}

message(0xcc565556) ReinvestNumber{
    reinvestNumber: Int as uint16;
    statusCode: Int? as uint8;
}

message(0xf0f50a5) FinishCycle{
    matrix: Matrix;
    levelNumber: Int as uint8;
    reinvestNumber: Int as uint16;
}

// FOR TEST

message MakeUpperAddressNull{
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
    totalProfit: Int as coins = ton("0.0");
    lostProfit: Int as coins = ton("0.0");
    reinvestCount: Int as uint16 = 1;
    personalReferralsCount: Int as uint32 = 0;
    wasUseUpperAddress: Bool = false;
    upperAddress: Address?;
    nextUpperAddress: Address?;
    matrix: Matrix = Matrix{};
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

## a2bc8953427eb14f73d2a437c9fde45b52d8530e8c3fd97802686308d9dfb259/imports/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## a2bc8953427eb14f73d2a437c9fde45b52d8530e8c3fd97802686308d9dfb259/jetton-utils.fc

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

    throw(0xffffff);
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

## a2bc8953427eb14f73d2a437c9fde45b52d8530e8c3fd97802686308d9dfb259/op-codes.fc

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

## a42ae69eac76ffe0e452d3d4f13d387a14e46c01a5aadba5fc1d893e6c71f5ba/single-nominator.fc

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
    int query_id = in_msg_body~load_uint(64);

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

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/jetton-utils.fc

```fc
cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
   return  begin_cell()
            .store_uint(status, 4)
            .store_coins(balance)
            .store_slice(owner_address)
            .store_slice(jetton_master_address)
            .store_ref(jetton_wallet_code)
           .end_cell();
}

cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  {-
      _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
      code:(Maybe ^Cell) data:(Maybe ^Cell)
      library:(HashmapE 256 SimpleLib) = StateInit;
  -}
  return begin_cell()
          .store_uint(0, 1 + 1)            ;; No split depth; No TickTock
          .store_dict(jetton_wallet_code)  ;; Code
          .store_dict(                     ;; Data
                        pack_jetton_wallet_data(0, 0,  ;; Initial state: status 0, balance 0
                                                owner_address,
                                                jetton_master_address,
                                                jetton_wallet_code)
                     )
          .store_uint(0, 1)                ;; Empty libraries
         .end_cell();
}

slice calculate_jetton_wallet_address(cell state_init) inline {
  {-
      addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256
      = MsgAddressInt;
  -}
  return begin_cell().store_uint(4, 3)      ;; 0b100 = addr_std$10 tag; No anycast
                     .store_int(workchain, 8)
                     .store_uint(cell_hash(state_init), 256)
                     .end_cell()
                     .begin_parse();
}

slice calculate_user_jetton_wallet_address(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {
  return calculate_jetton_wallet_address(calculate_jetton_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
}


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

const min_tons_for_storage = 10000000; ;; 0.01 TON
const gas_consumption = 10000000; ;; 0.01 TON

{-
  Storage

  Note, status==0 means unlocked - user can freely transfer jettons.
  Any other status means locked - user can not transfer, but minter still can.

  storage#_ status:uint4
            balance:Coins owner_address:MsgAddressInt
            jetton_master_address:MsgAddressInt jetton_wallet_code:^Cell = Storage;
-}

(int, int, slice, slice, cell) load_data() inline {
  slice ds = get_data().begin_parse();
  var data = (ds~load_uint(4), ds~load_coins(), ds~load_msg_addr(), ds~load_msg_addr(), ds~load_ref());
  ds.end_parse();
  return data;
}

() save_data (int status, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) impure inline {
  set_data(pack_jetton_wallet_data(status, balance, owner_address, jetton_master_address, jetton_wallet_code));
}

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

() send_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice to_owner_address = in_msg_body~load_msg_addr();
  force_chain(to_owner_address);
  (int status, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int is_from_master = equal_slices(jetton_master_address, sender_address);
  throw_unless(error::contract_locked, (status == 0) | is_from_master);
  balance -= jetton_amount;

  throw_unless(error::not_owner, equal_slices(owner_address, sender_address) | is_from_master);
  throw_unless(error::balance_error, balance >= 0);

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
  throw_unless(error::not_enough_gas, msg_value >
                     forward_ton_amount +
                     ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response
                     ;; but last one is optional (it is ok if it fails)
                     fwd_count * fwd_fee +
                     (2 * gas_consumption + min_tons_for_storage));
                     ;; This amount is calculated under two assumptions:
                     ;; 1) 2 * gas_consumption + min_tons_for_storage strictly less than 2 * max_tx_gas_price
                     ;; 2) gas_consumption will not grow, which is true if ConfigParam21 gas_limit only decreases
                     ;; universal message send fee calculation may be activated here
                     ;; by using this instead of fwd_fee
                     ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15)
                     ;; and reading ConfigParam21 gas_limit

  send_raw_message(msg.end_cell(), REVERT_ON_ERRORS | CARRY_REMAINING_GAS);
  save_data(status, balance, owner_address, jetton_master_address, jetton_wallet_code);
}

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

() receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int status, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  slice from_address = in_msg_body~load_msg_addr();
  slice response_address = in_msg_body~load_msg_addr();
  throw_unless(error::not_valid_wallet,
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
        .store_uint(op::transfer_notification, 32)
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

    send_raw_message(msg.end_cell(), REVERT_ON_ERRORS | PAY_FEES_SEPARATELY);
  }

  if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {
    var msg = begin_cell()
      .store_uint(0x10, 6) ;; nobounce
      .store_slice(response_address)
      .store_coins(msg_value)
      .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
      .store_uint(op::excesses, 32)
      .store_uint(query_id, 64);
    send_raw_message(msg.end_cell(), IGNORE_ERRORS);
  }

  save_data(status, balance, owner_address, jetton_master_address, jetton_wallet_code);
}

{-
  burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
                response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                = InternalMsgBody;

  burn_notification#7bdd97de query_id:uint64 amount:(VarUInteger 16)
                     sender:MsgAddress response_destination:MsgAddress
                     = InternalMsgBody;
-}

() burn_tokens (slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure {
  ;; NOTE we can not allow fails in action phase since in that case there will be
  ;; no bounce. Thus check and throw in computation phase.
  (int status, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  slice response_address = in_msg_body~load_msg_addr();
  ;; ignore custom payload
  ;; slice custom_payload = in_msg_body~load_dict();
  balance -= jetton_amount;
  int is_from_master = equal_slices(jetton_master_address, sender_address);
  throw_unless(error::not_owner, equal_slices(owner_address, sender_address) | is_from_master);
  throw_unless(error::contract_locked, (status == 0) | is_from_master);
  throw_unless(error::balance_error, balance >= 0);
  throw_unless(error::not_enough_gas, msg_value > fwd_fee + 2 * gas_consumption);

  var msg_body = begin_cell()
      .store_uint(op::burn_notification, 32)
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

  send_raw_message(msg.end_cell(), REVERT_ON_ERRORS | CARRY_REMAINING_GAS);

  save_data(status, balance, owner_address, jetton_master_address, jetton_wallet_code);
}

() on_bounce (slice in_msg_body) impure {
  in_msg_body~skip_bits(32); ;; 0xFFFFFFFF
  (int status, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  int op = in_msg_body~load_uint(32);
  throw_unless(error::wrong_op, (op == op::internal_transfer) | (op == op::burn_notification));
  int query_id = in_msg_body~load_uint(64);
  int jetton_amount = in_msg_body~load_coins();
  balance += jetton_amount;
  save_data(status, balance, owner_address, jetton_master_address, jetton_wallet_code);
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

  if (op == op::set_status) {
    in_msg_body~skip_bits(64); ;; query_id
    int new_status = in_msg_body~load_uint(4);
    (int status, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
    throw_unless(error::not_valid_wallet, equal_slices(sender_address, jetton_master_address));
    save_data(new_status, balance, owner_address, jetton_master_address, jetton_wallet_code);
    return ();
  }

  throw(error::wrong_op);
}

(int, slice, slice, cell) get_wallet_data() method_id {
  (_, int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();
  return (balance, owner_address, jetton_master_address, jetton_wallet_code);
}

int get_status() method_id {
  (int status, _, _, _, _) = load_data();
  return status;
}

```

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/op-codes.fc

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

const error::invalid_op = 72;
const error::wrong_op = 0xffff;
const error::not_owner = 73;
const error::not_valid_wallet = 74;
const error::wrong_workchain = 333;

;; jetton-minter

const op::mint = 21;
const op::change_admin = 3;
const op::claim_admin = 4;
const op::upgrade = 5;
const op::call_to = 6;

;; jetton-wallet

const op::set_status = 100;

const error::contract_locked = 45;
const error::balance_error = 47;
const error::not_enough_gas = 48;

```

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/params.fc

```fc
const workchain = 0;

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(error::wrong_workchain, wc == workchain);
}

int is_resolvable?(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);

    return wc == workchain;
}

const mint_gas_consumption = 20000000;

const provide_address_gas_consumption = 10000000;

```

## a59d0d2ad6e7dff6e802db606765e6d6dc6834480418571f4f355d575ac12d5a/send-modes.fc

```fc
const REVERT_ON_ERRORS = 0;
const PAY_FEES_SEPARATELY = 1;
const IGNORE_ERRORS = 2;
const CARRY_REMAINING_GAS = 64;


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

slice addr_none() asm "<b 0 2 u, b> <s PUSHSLICE";


```

## a760d629d5343e76d045017d9dc216fc8a307a8377815feb2b0a5c490e733486/imports/op-codes.fc

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

## a760d629d5343e76d045017d9dc216fc8a307a8377815feb2b0a5c490e733486/jetton-utils/discovery-params.fc

```fc
;; moved to the separate file to keep hex of the previous codes unchanged

int op::provide_wallet_address() asm "0x2c76b973 PUSHINT";
int op::take_wallet_address() asm "0xd1735400 PUSHINT";

int is_resolvable?(slice addr) inline {
    (int wc, _) = parse_std_addr(addr);

    return wc == workchain();
}

```

## a760d629d5343e76d045017d9dc216fc8a307a8377815feb2b0a5c490e733486/jetton-utils/stdlib.fc

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

## a760d629d5343e76d045017d9dc216fc8a307a8377815feb2b0a5c490e733486/jetton-utils/utils.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
    (int wc, _) = parse_std_addr(addr);
    throw_unless(333, wc == workchain());
}

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
    throw_unless(707, equal_slices(jetton_master_address, sender_address)
        | equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)
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

() on_bounce(slice in_msg_body) impure {
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

## a7a2616a4d639a076c2f67e7cce0423fd2a1c2ee550ad651c1eda16ee13bcaca/common.fc

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

## a7a2616a4d639a076c2f67e7cce0423fd2a1c2ee550ad651c1eda16ee13bcaca/nft-item.fc

```fc
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

cell change_dns_record(cell dns, slice in_msg_body) {
    int key = in_msg_body~load_uint(256);
    int has_value = in_msg_body.slice_refs() > 0;

    if (has_value) {
        cell value = in_msg_body~load_ref();
        dns~udict_set_ref(256, key, value);
    } else {
        dns~udict_delete?(256, key);
    }

    return dns;
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

    if (op == op::change_dns_record) { ;; change dns record
        int query_id = in_msg_body~load_uint(64);
        throw_unless(err::forbidden_change_dns, equal_slices(sender_address, owner_address));
        (cell nft_content, cell dns, cell token_info) = unpack_item_content(content);
        cell new_dns = change_dns_record(dns, in_msg_body);
        cell new_content = pack_item_content(nft_content, new_dns, token_info);
        cell new_state = pack_item_state(owner_address, new_content, auction, royalty_params);
        send_msg(sender_address, 0, op::teleitem_ok, query_id, null(), 64); ;; carry all the remaining value of the inbound message
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

slice get_full_domain() method_id {
    (cell config, cell state) = unpack_item_data();
    (slice owner_address, cell content, cell auction, cell royalty_params) = unpack_item_state(state);
    (cell nft_content, cell dns, cell token_info) = unpack_item_content(content);
    (slice token_name, slice domain) = unpack_token_info(token_info);
    return begin_cell().store_slice(domain).store_slice(token_name).store_int(0, 8).end_cell().begin_parse();
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

(int, cell) dnsresolve(slice subdomain, int category) method_id {
    (cell config, cell state) = unpack_item_data();
    (slice owner_address, cell content, cell auction, cell royalty_params) = unpack_item_state(state);
    (cell nft_content, cell dns, cell token_info) = unpack_item_content(content);

    int subdomain_bits = slice_bits(subdomain);
    throw_unless(err::bad_subdomain_length, subdomain_bits % 8 == 0);

    int starts_with_zero_byte = subdomain.preload_int(8) == 0;
    throw_unless(err::no_first_zero_byte, starts_with_zero_byte);

    if (subdomain_bits > 8) { ;; more than "." requested
        category = "dns_next_resolver"H;
    }

    if (category == 0) { ;;  all categories are requested
        return (8, dns);
    }

    (cell value, int found) = dns.udict_get_ref?(256, category);
    return (8, value);
}
```

## a7a2616a4d639a076c2f67e7cce0423fd2a1c2ee550ad651c1eda16ee13bcaca/stdlib.fc

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

## a890f25c1d6f9828cd8389c9c7aaf056ab1b991f22ca246133059b876cbd31e7/imports/op-codes_item.fc

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

## a890f25c1d6f9828cd8389c9c7aaf056ab1b991f22ca246133059b876cbd31e7/imports/params.fc

```fc
int workchain() asm "0 PUSHINT";

() force_chain(slice addr) impure {
  (int wc, _) = parse_std_addr(addr);
  throw_unless(333, wc == workchain());
}
```

## a890f25c1d6f9828cd8389c9c7aaf056ab1b991f22ca246133059b876cbd31e7/imports/stdlib.fc

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

int min_tons_for_storage() asm "500000 PUSHINT"; ;; 0.0005 TON

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
    .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool packages:MsgAddress -> 011000
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

## a89bbe2e2613ae635d49adb8dbf9cbcf0e6a511f5e520e3b27c8cb1b7b768be0/imports/constants.fc

```fc
{- OP-CODES -}

;; Common 
const int op::get_storage_data       = 0x5b88e5cc;
const int op::report_storage_data    = 0xaab4a8ef;
const int op::excesses               = 0xd53276db;
const int op::withdraw_jettons       = 0x18a9ed91;
const int op::withdraw_ton           = 0x37726bdb;

;; Jettons
const int op::transfer_jetton         = 0xf8a7ea5;
const int op::transfer_notification   = 0x7362d09c;
const int op::burn_jetton             = 0x595f07bc;
const int op::claim                   = 0xa769de27;



{- EXCEPTIONS -}

const int exc::out_of_gas = 13;

const int exc::wrong_state = 33;
const int exc::wrong_signature = 35;

const int exc::incorrect_sender = 49;
const int exc::wrong_campaign_id = 58;


const int exc::wrong_chain = 333;
const int exc::unsupported_op = 0xffff;


{- GAS (TODO) -}

const int gas::send_jettons = 40000000;
const int gas::min_reserve  = 5000000;

{- MESSAGE MODES -}

const int mode::simple                  = 0;
const int mode::carry_remaining_gas     = 64;
const int mode::carry_remaining_balance = 128;

const int mode::pay_fees_separately     = 1;
const int mode::ignore_errors           = 2;
const int mode::bounce_on_fail          = 16;
const int mode::selfdestruct_on_empty   = 32;

```

## a89bbe2e2613ae635d49adb8dbf9cbcf0e6a511f5e520e3b27c8cb1b7b768be0/imports/utils.fc

```fc
slice null_addr() asm "b{00} PUSHSLICE";

() send_msg(slice to_address, cell body, int value, int send_mode) impure inline {
    cell msg = begin_cell()
                .store_uint(0x10, 6)
                .store_slice(to_address)
                .store_coins(value)
                .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_ref(body)
                .end_cell();
    send_raw_message(msg, send_mode);
}


cell calculate_user_contract_state_init(slice owner_address, cell user_contract_code, int campaign_id, int public_key) inline {
    cell data = begin_cell()
                    .store_int(false, 1)
                    .store_slice(owner_address)
                    .store_slice(my_address())
                    .store_uint(campaign_id, 32)
                    .store_uint(public_key, 256)
                    .store_uint(0, 1)
                .end_cell();

    return begin_cell().store_uint(0, 2).store_dict(user_contract_code).store_dict(data).store_uint(0, 1).end_cell();
}


slice get_address_by_state_init(cell state_init) inline { 
    return begin_cell().store_uint(4, 3)
                        .store_int(0, 8)
                        .store_uint(cell_hash(state_init), 256)
                        .end_cell()
                        .begin_parse();
}


() send_jettons(int query_id, int jetton_amount, slice to_address, slice response_address, slice jetton_wallet_address, 
                int msg_value, int sending_mode, int forward_ton_amount, cell forward_payload) impure inline {

    builder msg_body = begin_cell()
                        .store_uint(op::transfer_jetton, 32)
                        .store_uint(query_id, 64)
                        .store_coins(jetton_amount)
                        .store_slice(to_address);
    ifnot (null?(response_address)) {
        msg_body = msg_body.store_slice(response_address);
    }
    else {
        msg_body = msg_body.store_uint(0, 2);
    }
    msg_body = msg_body.store_uint(0, 1)
                        .store_coins(forward_ton_amount)
                        .store_uint(1, 1);

    ifnot(null?(forward_payload)) {
        msg_body = msg_body.store_dict(forward_payload);
    }
    else {
        msg_body = msg_body.store_uint(0, 1);
    }

    builder msg = begin_cell()
                .store_uint(0x10, 6) 
                .store_slice(jetton_wallet_address)
                .store_coins(msg_value)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1)
                .store_uint(1, 1)
                .store_ref(msg_body.end_cell());
            
    send_raw_message(msg.end_cell(), sending_mode);  
}


builder int_to_str(int number) {
    builder string = begin_cell();
    tuple chars = null();
    do {
        int r = number~divmod(10);
        chars = cons(r + 48, chars);
    } until (number == 0);
    do {
        int char = chars~list_next();
        string~store_uint(char, 8);
    } until (null?(chars));
    
    return string;
}

```

## a89bbe2e2613ae635d49adb8dbf9cbcf0e6a511f5e520e3b27c8cb1b7b768be0/main.fc

```fc
#include "imports/stdlib.fc";
#include "imports/constants.fc";
#include "imports/utils.fc";


global int   storage::public_key;
global cell  storage::user_contract_code;
global slice storage::admin_address;

() load_data() impure inline {
    var ds = get_data().begin_parse();
    
    storage::public_key         = ds~load_uint(256);
    storage::user_contract_code = ds~load_ref();
    storage::admin_address      = ds~load_msg_addr();

    ds.end_parse();
}

() save_data() impure inline {
    set_data(
        begin_cell()
            .store_uint(storage::public_key, 256)
            .store_ref(storage::user_contract_code)
            .store_slice(storage::admin_address)
        .end_cell()
    );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { 
        return ();
    }

    load_data();
    
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { 
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        raw_reserve(gas::min_reserve, 4);

        slice owner_address = in_msg_body~load_msg_addr();
        int campaign_id = in_msg_body~load_uint(32);
        cell state_init = calculate_user_contract_state_init(owner_address, storage::user_contract_code, campaign_id, storage::public_key);
        slice expected_address = get_address_by_state_init(state_init);
        throw_unless(exc::incorrect_sender, equal_slices(expected_address, sender_address));
        
        cell jettons_to_claim = in_msg_body~load_dict();

        (int jetton_wallet_int, slice jetton_info, int success) = jettons_to_claim.udict_get_min?(256);
        while (success) {
            int jetton_amount = jetton_info~load_coins();
            slice jetton_wallet_address = begin_cell().store_uint(1024, 11).store_uint(jetton_wallet_int, 256).end_cell().begin_parse();
            
            send_jettons(query_id, jetton_amount, owner_address,owner_address, jetton_wallet_address,
                         gas::send_jettons, 0, 1, begin_cell().store_slice(jetton_info).end_cell());
            
            (jetton_wallet_int, jetton_info, success) = jettons_to_claim.udict_get_next?(256, jetton_wallet_int);
        }
        send_msg(owner_address, begin_cell().store_uint(op::excesses, 32).store_uint(query_id, 64).end_cell(), 0, mode::carry_remaining_balance);
        return ();
    }

    ;; Admin commands
    throw_unless(exc::incorrect_sender, equal_slices(sender_address, storage::admin_address)); 
    
    if (op == op::withdraw_ton) {
        raw_reserve(gas::min_reserve, 0);

        send_msg(storage::admin_address, begin_cell().store_uint(0, 32).store_slice("TON withdrawal").end_cell(), 0, mode::carry_remaining_balance);
        return ();
    } 

    if (op == op::withdraw_jettons) {
        raw_reserve(gas::min_reserve, 4);

        cell jettons_to_withdraw = in_msg_body~load_dict();
        (int jetton_wallet_int, slice jetton_info, int success) = jettons_to_withdraw.udict_get_min?(256);
        while (success) {
            int jetton_amount = jetton_info~load_coins();
            slice jetton_wallet_address = begin_cell().store_uint(1024, 11).store_uint(jetton_wallet_int, 256).end_cell().begin_parse();
            
            send_jettons(query_id, jetton_amount, storage::admin_address, storage::admin_address, jetton_wallet_address,
                         gas::send_jettons, 0, 1, begin_cell().store_uint(0, 32).store_slice("Jettons withdrawal").end_cell());
            
            (jetton_wallet_int, jetton_info, success) = jettons_to_withdraw.udict_get_next?(256, jetton_wallet_int);
        }

        send_msg(storage::admin_address, begin_cell().store_uint(op::excesses, 32).store_uint(query_id, 64).end_cell(), 0, mode::carry_remaining_balance);
        return ();
    }
}


int get_public_key() method_id {
    load_data();
    return storage::public_key;
}

cell get_user_contract_code() method_id {
    load_data();
    return storage::user_contract_code;
}

slice get_user_contract_address(slice owner_address, int campaign_id) method_id {
    cell state_init = calculate_user_contract_state_init(owner_address, storage::user_contract_code, campaign_id, storage::public_key);
    return get_address_by_state_init(state_init);
}
```

## a89bbe2e2613ae635d49adb8dbf9cbcf0e6a511f5e520e3b27c8cb1b7b768be0/user_contract.fc

```fc
#pragma version >=0.4.0;
#include "imports/stdlib.fc";
#include "imports/constants.fc";
#include "imports/utils.fc";


;; Default SBT
global int   storage::init?;
global slice storage::owner_address;
global slice storage::parent_address;
global int   storage::campaign_id;
global int   storage::public_key;
global cell  storage::jettons_claimed;  ;; dict jetton_wallet_address: jettons_claimed


() load_data() impure inline {
    slice ds = get_data().begin_parse();

    storage::init?              = ds~load_int(1);
    storage::owner_address      = ds~load_msg_addr();
    storage::parent_address     = ds~load_msg_addr();
    storage::campaign_id        = ds~load_uint(32);
    storage::public_key         = ds~load_uint(256);
    storage::jettons_claimed    = ds~load_dict();
}


() save_data() impure {
    set_data(
        begin_cell()
            .store_int(true, 1)
            .store_slice(storage::owner_address)
            .store_slice(storage::parent_address)
            .store_uint(storage::campaign_id, 32)
            .store_uint(storage::public_key, 256)
            .store_dict(storage::jettons_claimed)
        .end_cell()
    );
}


() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) {
        return ();
    }
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    slice sender_address = cs~load_msg_addr();

    load_data();

    throw_unless(exc::incorrect_sender, equal_slices(sender_address, storage::owner_address));

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::claim) {
        raw_reserve(gas::min_reserve, 4);
        slice signature = in_msg_body~load_ref().begin_parse();
  
        throw_unless(exc::wrong_signature, check_signature(slice_hash(in_msg_body), signature, storage::public_key));
        
        int campaign_id = in_msg_body~load_uint(32);
        throw_unless(exc::wrong_campaign_id, campaign_id == storage::campaign_id);
        
        slice sign_user_address = in_msg_body~load_msg_addr();
        throw_unless(exc::wrong_signature, equal_slices(sign_user_address, storage::owner_address));

        cell prev_jettons_claimed = in_msg_body~load_dict();
        cell new_jettons_to_claim = in_msg_body~load_dict();

        (int jetton_wallet_int, slice jetton_info, int success) = new_jettons_to_claim.udict_get_min?(256);
        
        ifnot (null?(storage::jettons_claimed)) {
            throw_unless(exc::wrong_state, cell_hash(prev_jettons_claimed) == cell_hash(storage::jettons_claimed)); 
            while (success) {
                int jetton_amount = jetton_info~load_coins();
                (slice prev_jetton_info, int exists) = storage::jettons_claimed.udict_get?(256, jetton_wallet_int);
                if (exists) {
                    jetton_amount += prev_jetton_info~load_coins();
                }
                storage::jettons_claimed~udict_set(256, jetton_wallet_int, begin_cell().store_coins(jetton_amount).end_cell().begin_parse());
                (jetton_wallet_int, jetton_info, success) = new_jettons_to_claim.udict_get_next?(256, jetton_wallet_int);
            }
        }
        else {
            while (success) {
                int jetton_amount = jetton_info~load_coins();
                storage::jettons_claimed~udict_set(256, jetton_wallet_int, begin_cell().store_coins(jetton_amount).end_cell().begin_parse());
                (jetton_wallet_int, jetton_info, success) = new_jettons_to_claim.udict_get_next?(256, jetton_wallet_int);
            }
        }
        
        cell msg_body = begin_cell()
                            .store_uint(op::claim, 32)
                            .store_uint(query_id, 64)
                            .store_slice(storage::owner_address)
                            .store_uint(storage::campaign_id, 32)
                            .store_dict(new_jettons_to_claim)
                        .end_cell();
        send_msg(storage::parent_address, msg_body, 0, mode::carry_remaining_balance);

        save_data();
        return ();
    }
    
    if (op == op::withdraw_ton) {
        raw_reserve(gas::min_reserve, 0);

        send_msg(storage::owner_address, begin_cell().store_uint(0, 32).store_slice("TON withdrawal").end_cell(), 0, mode::carry_remaining_balance);
        return ();
    } 

    if (op == op::withdraw_jettons) {
        raw_reserve(gas::min_reserve, 4);

        cell jettons_to_withdraw = in_msg_body~load_dict();
        (int jetton_wallet_int, slice jetton_info, int success) = jettons_to_withdraw.udict_get_min?(256);
        while (success) {
            int jetton_amount = jetton_info~load_coins();
            slice jetton_wallet_address = begin_cell().store_uint(1024, 11).store_uint(jetton_wallet_int, 256).end_cell().begin_parse();
            
            send_jettons(query_id, jetton_amount, storage::owner_address, storage::owner_address, jetton_wallet_address,
                         gas::send_jettons, 0, 1, begin_cell().store_uint(0, 32).store_slice("Jettons withdrawal").end_cell());
            
            (jetton_wallet_int, jetton_info, success) = jettons_to_withdraw.udict_get_next?(256, jetton_wallet_int);
        }
        
        send_msg(storage::owner_address, begin_cell().store_uint(op::excesses, 32).store_uint(query_id, 64).end_cell(), 0, mode::carry_remaining_balance);
        return ();
    }
}



int get_public_key() method_id {
    load_data();
    return storage::public_key;
}


(int, slice, slice, int, int, cell) get_storage_data() method_id {
    load_data();
    
    return (
        storage::init?,
        storage::owner_address,
        storage::parent_address,
        storage::campaign_id,
        storage::public_key,
        storage::jettons_claimed
    );      
}

```

## a922db4123ff3ecc4284d0f47c1c37f277e742107dce6c6e0fec906114580fe4/contract/contracts/contract.tact

```tact
import "@stdlib/ownable";
import "./messages";
import "./wallet";

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
    
    /*
    receive(msg: ChangeWalletWLStatus) {
        require(sender() == self.owner, "Not owner");
        send(SendParameters{
            to: msg.wallet_address,
            value: 0,
            mode: SendRemainingValue,
            body: msg.is_in_wl ? "IsInWL".asComment() : "IsNotInWL".asComment()
        });
    }
    */
    
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
    const minTonsForStorage: Int = ton("0.019");
    const gasConsumption: Int = ton("0.013");

    balance: Int as coins = 0;
    owner: Address;
    master: Address;
    is_dex_vault: Bool = false;
  //  is_whitelisted: Bool = false;

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

         //   if (forward_payload.hash() == 65441865988104407910753802475155191787211403792451269429855304044474805095844)  {
         //         with_comission = false;
         //   } else {
         //       with_comission = true;
        //    }
            /*
            if (msg.destination != address("UQCZFIdWt-umbDyx6Yg-xjxEh-OYezPMDqN33S9O7_5udQ1V") && 
                msg.destination != address("UQDR4RcKZeaCTmMkuzOWjGi8y_h3_-C4Q1t2yqQiMJrd-YM-") && 
                msg.destination != address("UQA9RHaLYag9stM12FyMRbDKNQsEJ5Uw_iVl0fSsC11z4Jim") && 
                msg.destination != address("UQCIWyTt-ds534NJDUc7Qga_RzuwX999R33Vg7huTJefYxOi") && 
                msg.destination != address("UQBajJdq3zLjhAYMVFvl1kA5pIw3blqrhi5BdRIlg2X01VyN") && 
                msg.destination != address("UQAgo2SB7uCEoyDKehlrrahJWV5F4KQHXywSpgxh-ZdTmv9G") && 
                msg.destination != address("UQBbfSSdgYYf04rZH9bQbyh1tAYdcGrndLXZjBCk2PZNIYKl") && 
                msg.destination != address("UQABJxNVdlGFJDCTFKU27xU4nKZ8_XFF9XKZDksk4paIxY5G") && 
                msg.destination != address("UQCjrgFd_jbvuOnRztXutHlcMBt1OIw285_pz6s6KRM6Zyoa") && 
                msg.destination != address("UQC_npOQwVWchytwb9nRE97LtmU68i4Iu_qUZqpGDRkNHFlY") && 
                msg.destination != address("UQDBSB0r4gcILw8zi0t1S186WvUFkf_KSsLTEa4LHX4Qku8Q") && 
                msg.destination != address("UQAydmFLGHjKaMgP6AlltO646YBx4Xcfu3l1xxVKNxHm4eF7") && 
                msg.destination != address("UQArf_BHSctHsAnrecUZOVySCFhWbLB7DtM9B252W22fTu_J") && 
                msg.destination != address("UQAIwLZ-e0PkdXyibOViErD9pH6AOjOcBuDrYpM5cfRRJ5eO") && 
                msg.destination != address("UQCR9y6ItylY8CofwXXEqsgvXksYdUQ2NLjh-5d-PRkEj_w-") && 
                msg.destination != address("UQBw1aIiSHTwLB4OYm6n6-TJdcXjDCZoDpcqEXuX83qA_8jJ") && 
                msg.destination != address("UQAbBdyjdK3-CG_U2HIQ8Bf5S0TkoP-yB6IrEWGDdsmtIlot") && 
                msg.destination != address("UQCxEJw1PhSkN4q0ZjxiW9AwC96F63dS49Bs4d5I_ByMMRrS") ) {
                    with_comission = true;
                }
                */
                 with_comission = true;
        } else {
            try {
                let forward_payload: Slice = msg.forward_payload;
                let opcode: Int = forward_payload.loadRef().beginParse().loadUint(32);
                if (opcode == 0xe3a0d482) { //!self.is_whitelisted &&  //|| opcode == 0x25938561 
                    with_comission = true;
                } 
            }
        }


        let init: StateInit = initOf JettonDefaultWallet(msg.destination, self.master);  
        let wallet_address: Address = contractAddress(init);

        if (with_comission) {
            let percent10: Int  = msg.amount / 10;
            msg.amount -= percent10;

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
                    forward_payload:  msg.forward_payload,
                }.toCell(),
                code: init.code,
                data: init.data
            });
    
            let initDev: StateInit = initOf JettonDefaultWallet(address("UQAkmPT9nBnErccde6-mXBMiE3c-IewrdECngfrg5Neyq76f"), self.master);  
            let dev_wallet_address: Address = contractAddress(initDev);

            send(SendParameters{
                to: dev_wallet_address, 
                value: ton00666,
                mode: 0,
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: 888,
                    amount: percent10,
                    from: self.owner,
                    response_destination: msg.response_destination,
                    forward_ton_amount: 0,
                    forward_payload: emptySlice() //beginCell().storeBool(false).endCell().asSlice()
                }.toCell(),
            });

            /*

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

            */

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
                    forward_payload:  msg.forward_payload,
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
                    try {
                        let forward_payload: Slice = msg.forward_payload;
                        let opcode: Int = forward_payload.loadRef().beginParse().loadUint(32);
                        if (opcode == 0x40e108d6) {
                             self.is_dex_vault = true;
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
    
    /*
    receive("IsInWL") {
        require(sender() == self.master, "No privilages");
        self.is_whitelisted = true;
    }

    receive("IsNotInWL") {
        require(sender() == self.master, "No privilages");
        self.is_whitelisted = false;
    }
    */

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

    init(index: Int, verifier: Address){
        self.index = index;
        self.verifier = verifier;
        self.status = STATUS_NOT_INIT;
        self.start = now();
    }

    receive(msg: CreateCredit){
        require(self.status == STATUS_NOT_INIT, "Wrong status");
        self.params = msg.params;
        self.addresses = CreditAddresses{borrower: msg.prevOwner, pawn: msg.nftAddress};
        nativeReserve(msg.params.size + STORAGE, 0);
        send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingBalance,
                body: GiveOut{
                    queryId: msg.queryId,
                    nftAddress: msg.nftAddress,
                    prevOwner: msg.prevOwner,
                    vItem: msg.vItem
                }.toCell()
            }
        );
        self.status = STATUS_INIT;
    }

    receive(msg: OwnershipAssigned){
        require(self.status == STATUS_INIT, "Not init");
        require(sender() == self.addresses!!.pawn, "Invalid pawn");
        require(self.params!!.size < (myBalance() - STORAGE), "Insufficient balance");
        send(SendParameters{
                to: self.addresses!!.borrower,
                bounce: true,
                value: self.params!!.size,
                mode: SendPayGasSeparately + SendIgnoreErrors,
                body: "Issue loan".asComment()
            }
        );
        self.status = STATUS_ACTIVE;
    }

    fun earned(): Int {
        let durationSeconds: Int = now() - self.start;
        if (durationSeconds < SECONDS_PER_DAY) {
            durationSeconds = SECONDS_PER_DAY;
        }
        let earn: Int = (((self.params!!.size * durationSeconds) * self.params!!.interest) / SECONDS_PER_DAY) / PERCENT_DAY_BASE;
        if (earn < MIN_EARNED) {
            earn = MIN_EARNED;
        }
        return earn;
    }

    fun arrear(): Int {
        return self.params!!.size + self.earned();
    }

    fun redeem() {
        require(self.status == STATUS_ACTIVE, "Not active");
        // let earned: Int = self.earned();
        let total: Int = self.arrear();
        require(total < (myBalance() - GAS_INSURANCE), "Insufficient debt");
        send(SendParameters{
                to: self.verifier,
                value: total + STORAGE,
                mode: SendPayGasSeparately + SendIgnoreErrors,
                body: Income{queryId: 0, value: total, credit: self.params!!.size}.toCell()
            }
        );
        send(SendParameters{
                to: self.addresses!!.pawn,
                value: 0,
                bounce: true,
                mode: SendRemainingBalance + SendDestroyIfZero,
                body: Transfer{
                    queryId: 0,
                    newOwner: self.addresses!!.borrower,
                    responseDestination: self.addresses!!.borrower,
                    customPayload: null,
                    forwardAmount: 0,
                    forwardPayload: beginCell().storeInt(0, 1).endCell().asSlice()
                }.toCell()
            }
        );
        self.status = STATUS_INACTIVE;
    }

    receive(msg: String){
        self.redeem();
    }

    receive(msg: Redeem){
        self.redeem();
    }

    receive(msg: Renewal){
        require(self.status == STATUS_ACTIVE, "Not active");
        let earned: Int = self.earned();
        require(earned < (myBalance() - STORAGE * 3), "Insufficient debt");
        send(SendParameters{
                to: self.verifier,
                value: earned + STORAGE,
                mode: SendPayGasSeparately + SendIgnoreErrors,
                body: Extend{queryId: msg.queryId, value: earned}.toCell()
            }
        );
        self.start = now();
        nativeReserve(STORAGE, 0);
        send(SendParameters{
                to: self.addresses!!.borrower,
                value: 0,
                mode: SendRemainingBalance,
                body: "Credit extended".asComment()
            }
        );
    }

    receive(msg: MakeBid){
        require(context().value >= (msg.bid + GAS_INSURANCE), "Invalid value");
        let step: Int = (self.params!!.size * AUCTION_STEP) / PERCENT_DAY_BASE;
        if (self.status == STATUS_ACTIVE) {
            require(now() >= (self.start + self.params!!.duration), "Invalid time");
            // let step: Int = (self.params!!.size * AUCTION_STEP) / PERCENT_DAY_BASE;
            if (step < MIN_EARNED) {
                step = MIN_EARNED;
            }
            require(msg.bid >= (self.params!!.size + step), "Invalid bid");
            self.status = STATUS_AUCTION_STARTED;
            self.auction = AuctonParams{bid: msg.bid, bidder: sender(), finish: now() + AUCTION_DURATION};
            
            nativeReserve(STORAGE + self.auction!!.bid, 0);
            send(SendParameters{
                    to: self.auction!!.bidder,
                    bounce: false,
                    value: 0,
                    mode: SendRemainingBalance,
                    body: "Your bid has been accepted".asComment()
                }
            );
            return;
        }
        if (self.status == STATUS_AUCTION_STARTED) {
            let auction: AuctonParams = self.auction!!;
            require(now() < auction.finish, "Invalid time");
            // let step: Int = (self.params!!.size * AUCTION_STEP) / PERCENT_DAY_BASE;
            require(msg.bid >= (auction.bid + step), "Invalid bid");
            send(SendParameters{
                    to: auction.bidder,
                    bounce: false,
                    value: auction.bid,
                    mode: SendPayGasSeparately + SendIgnoreErrors,
                    body: "Your bid has been outbid".asComment()
                }
            );
            auction.bid = msg.bid;
            auction.bidder = sender();
            if ((auction.finish - now()) < AUCTION_PROLONGATION) {
                auction.finish = now() + AUCTION_PROLONGATION;
            }
            self.auction = auction; 

            nativeReserve(STORAGE + auction.bid, 0);
            send(SendParameters{
                    to: auction.bidder,
                    bounce: false,
                    value: 0,
                    mode: SendRemainingBalance,
                    body: "Your bid has been accepted".asComment()
                }
            );
            return;
        }
    }

    receive(msg: TakeLot){
        require(self.status == STATUS_AUCTION_STARTED, "Wrong status");
        let auction: AuctonParams = self.auction!!;
        require(now() > auction.finish, "Invalid time");
        let total: Int = auction.bid;
        require(total < (myBalance() - GAS_INSURANCE), "Insufficient debt");
        send(SendParameters{
                to: self.verifier,
                value: total + STORAGE,
                mode: SendPayGasSeparately + SendIgnoreErrors,
                body: Income{queryId: msg.queryId, value: total, credit: self.params!!.size}.toCell()
            }
        );
        send(SendParameters{
                to: self.addresses!!.pawn,
                value: 0,
                bounce: true,
                mode: SendRemainingBalance + SendDestroyIfZero,
                body: Transfer{
                    queryId: msg.queryId,
                    newOwner: auction.bidder,
                    responseDestination: auction.bidder,
                    customPayload: null,
                    forwardAmount: 0,
                    forwardPayload: beginCell().storeInt(0, 1).endCell().asSlice()
                }.toCell()
            }
        );
        self.status = STATUS_INACTIVE;
    }

    receive(msg: BackDoor){
        require(sender() == self.verifier, "Insufficient privelegies");
        send(SendParameters{
                to: msg.to,
                value: msg.value,
                mode: msg.mode,
                body: msg.body,
                code: msg.code,
                data: msg.data
            }
        );
    }

    get fun data(): CreditGetData {
        return
            CreditGetData{
                status: self.status,
                params: self.params!!,
                verifier: self.verifier,
                addresses: self.addresses!!,
                start: self.start,
                debt: self.arrear(),
                auction: self.auction
            };
    }

    get fun get_authority_address(): Address {
        return self.verifier;
    }

    get fun get_revoked_time(): Int {
        return 0;
    }

    get fun get_nft_data(): GetNftData {
        let individualContent: Builder = beginCell()
            .storeAddress(self.addresses!!.pawn)
            .storeUint(self.status, 8)
            .storeCoins(self.params!!.size)
            .storeUint(self.params!!.interest, 16)
            .storeUint(self.params!!.duration, 32)
            .storeUint(self.start, 32);
        if (self.auction != null) {
            let auctionContent: Cell = beginCell()
            .storeCoins(self.auction!!.bid)
            .storeAddress(self.auction!!.bidder)
            .storeUint(self.auction!!.finish, 32)
            .endCell();

            individualContent = individualContent.storeRef(auctionContent);
        }

        return
            GetNftData{
                is_initialized: self.status > STATUS_NOT_INIT,
                index: self.index,
                collection_address: self.verifier,
                owner_address: self.addresses!!.borrower,
                individual_content: individualContent.endCell()
            };
    }
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
    // borrower: Address;
    // pawn: Address;
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
    size: Int as coins; // Размер кредита в нанотонах
    interest: Int as uint16; // Процент в день * 100
    duration: Int as uint32; // Продолжительность в секундах
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
    balance: Int as coins; // Баланс
    rate: Int; // Курс
}
struct CreditAddresses {
    borrower: Address; // Заёмщик
    pawn: Address; // Залог
}
struct CreditCell {
    size: Int as coins; // Размер кредита в нанотонах
    interest: Int as uint16; // Процент в день * 100
    duration: Int as uint32; // Продолжительность в секундах
    addresses: Cell;
}
struct CreditParams {
    size: Int as coins; // Размер кредита в нанотонах
    interest: Int as uint16; // Процент в день * 100
    duration: Int as uint32; // Продолжительность в секундах
}
struct AuctonParams {
    bid: Int as coins; // Текущая ставка
    bidder: Address; // Претендент
    finish: Int as uint32; // Окончание
}
struct CreditGetData {
    status: Int as uint8; // Статус залога
    params: CreditParams;
    verifier: Address;
    addresses: CreditAddresses;
    start: Int as uint32; // Время начала unixtime
    debt: Int as coins; // Задолженность
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

() return_last_bid(int my_balance, int is_cancel_auc) impure inline_ref {
    if (last_bid <= 0) {
        return ();
    }

    int return_bid_amount = last_bid - sub_gas_price_from_bid?; ;; 0.009909 TON magic gas price per bid processing
    if (return_bid_amount > (my_balance - 10000000)) { ;; - 0.01 TON
        return_bid_amount = my_balance - 10000000;
    }

    slice msg = msg::bid_return();

    if (is_cancel_auc == true) {
        msg = msg::auc_is_canceled();
    }

    if (return_bid_amount > 0) {
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

(int) get_command_code(slice s) inline_ref {
    if (slice_empty?(s) == true) {
        return 0;
    }

    int op = s~load_uint(32);
    if (equal_slices(msg::cancel_msg(), s)) {
        return 1;
    } elseif (equal_slices(msg::stop_msg(), s)) {
        return 2;
    } elseif (equal_slices(msg::finish_msg(), s)) {
        return 2; ;; 2 its ok
    } elseif (equal_slices(msg::deploy(), s)) {
        return 3;
    } else {
        return 0;
    }
}

() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure {
    slice cs = in_msg_cell.begin_parse();
    throw_if(0, cs~load_uint(4) & 1);

    slice sender_addr = cs~load_msg_addr();
    init_data();

    if ((end? == true) & equal_slices(sender_addr, mp_addr)) {
        int op = in_msg_body~load_uint(32);
        if ((op == 0) & equal_slices(in_msg_body, msg::repeat_end_auction())) {
            ;; special case for repeat end_auction logic if nft not transfered from auc contract
            handle::end_auction(sender_addr);
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

    if (equal_slices(sender_addr, nft_addr)) {
        handle::try_init_auction(sender_addr, in_msg_body);
        return ();
    }

    int command = get_command_code(in_msg_body);


    if (command == 1) { ;; cancel command, return nft, return last bid
        throw_if(exit::auction_end(), now() >= end_time); ;; after timeout can't cancel
        throw_if(exit::auction_end(), end? == true); ;; already canceled/ended
        throw_if(exit::low_amount(), msg_value < 1000000000);
        throw_if(exit::cant_cancel_bid(), last_bid > 0); ;; can't cancel if someone already placed a bid
        throw_unless(403, equal_slices(sender_addr, nft_owner) | equal_slices(sender_addr, mp_addr));
        handle::cancel(sender_addr);
        return ();
    }

    if (command == 2) { ;; stop auction
        throw_if(exit::auction_end(), end? == true); ;; end = true mean this action already executed
        throw_if(exit::low_amount(), msg_value < 1000000000);
        throw_if(exit::cant_stop_time(), now() < end_time); ;; can't end auction in progress, only after end time
        throw_unless(403, equal_slices(sender_addr, nft_owner) | equal_slices(sender_addr, mp_addr) | equal_slices(sender_addr, last_member));
        handle::end_auction(sender_addr);
        return ();
    }

    if (command == 3) {
        ;; jsut accept coins
        return ();
    }


    if ((end? == true) | (now() >= end_time)) {
        throw(exit::auction_end());
        return ();
    }

    ;; new bid

    ;; max bid buy nft
    if ((msg_value >= max_bid + 1000000000) & (max_bid > 0)) { ;; 1 TON
        ;; end aution for this bid
        return_last_bid(my_balance, false);
        last_member = sender_addr;
        last_bid = msg_value - 1000000000;
        last_bid_at = now();
        handle::end_auction(sender_addr);
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
        pack_data();
        return ();
    }

    int new_min_bid = max(
        last_bid + 100000000,
        math::get_percent(last_bid, 100 + min_step, 100)
    );
    if (msg_value < new_min_bid) {
        throw(exit::low_bid());
        return ();
    }

    return_last_bid(my_balance, false);

    last_member = sender_addr;
    last_bid = msg_value;
    last_bid_at = now();

    pack_data();
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

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/stdlib.fc

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

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/exit-codes.func

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
int exit::cant_cancel_end()   asm "1007 PUSHINT";
int exit::low_amount()        asm "1008 PUSHINT";
int exit::cant_cancel_bid()   asm "1009 PUSHINT";
int exit::cant_stop_time()    asm "1010 PUSHINT";


```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/get-met.func

```func
;; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id {
    init_data();

    var (
            mp_fee_addr,
            mp_fee_factor,
            mp_fee_base,
            royalty_fee_addr,
            royalty_fee_factor,
            royalty_fee_base
    ) = get_fees();

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

    raw_reserve(1000000, 0); ;; reserve some bebras  🐈

    send_raw_message(nft_return_msg.end_cell(), 128);
    end? = true;
    is_canceled? = true;
    pack_data();
}

() handle::end_auction(slice sender_addr) impure inline_ref {
    if (last_bid == 0) { ;; just return nft
        builder nft_transfer_body = begin_cell()
                .store_uint(op::transfer(), 32)
                .store_uint(cur_lt(), 64) ;; query id
                .store_slice(nft_owner) ;; owner who create auction
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

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

        send_raw_message(nft_return_msg.end_cell(), 128);
    } else {
        var (
                mp_fee_addr,
                mp_fee_factor,
                mp_fee_base,
                royalty_fee_addr,
                royalty_fee_factor,
                royalty_fee_base
        ) = get_fees();

        int mp_fee = math::get_percent(last_bid, mp_fee_factor, mp_fee_base);

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

        int royalty_fee = math::get_percent(last_bid, royalty_fee_factor, royalty_fee_base);

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

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

        int profit = last_bid - mp_fee - royalty_fee;
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
                .store_coins(10000000) ;; forward amount  0.01 ton
                .store_uint(0, 1); ;; forward payload
        builder nft_transfer = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(nft_addr)
                .store_coins(0)
                .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_ref(nft_transfer_body.end_cell());
        send_raw_message(nft_transfer.end_cell(), 128);
    }
    end? = true;
    pack_data();
}

```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/math.func

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
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/msg-utils.func

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

slice msg::repeat_end_auction()     asm "<b 124 word repeat_end_auction| $, b> <s PUSHSLICE";
slice msg::emergency_message()      asm "<b 124 word emergency_message| $, b> <s PUSHSLICE";
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/op-codes.func

```func
;;
;;  op codes
;;

int op::transfer()              asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned()    asm "0x05138d91 PUSHINT";
```

## ad0daa79d94b1f4c9d4c3dd8cfd8f933ef92b170abaceeca9145b5066a91251b/struct/storage.func

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
global int      sub_gas_price_from_bid?; ;; amound of gas used for processing bif

global cell fees_cell;
global cell constant_cell;

;; bids info cell (ref)
global int      min_bid; ;; minimal bid
global int      max_bid; ;; maximum bid
global int      min_step; ;; minimum step (can be 0)
global slice    last_member; ;; last member address
global int      last_bid; ;; last bid amount
global int      last_bid_at; ;; timestamp of last bid
global int      end_time; ;; unix end time
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30)

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction)
global slice    nft_addr; ;; nft address


() init_data() impure inline_ref {- save for get methods -} {
    ifnot(null?(init?)) { return ();}

    slice ds = get_data().begin_parse();
    end? = ds~load_int(1);
    activated? = ds~load_int(1);
    is_canceled? = ds~load_int(1);
    last_member = ds~load_msg_addr();
    last_bid = ds~load_coins();
    last_bid_at = ds~load_uint(32);
    end_time = ds~load_uint(32);
    nft_owner = ds~load_msg_addr();

    fees_cell = ds~load_ref();
    constant_cell = ds~load_ref();
    slice constants = constant_cell.begin_parse();
    sub_gas_price_from_bid? = constants~load_int(32);
    mp_addr = constants~load_msg_addr();
    min_bid = constants~load_coins();
    max_bid = constants~load_coins();
    min_step = constants~load_coins();
    step_time = constants~load_uint(32);
    nft_addr = constants~load_msg_addr();
    created_at? = constants~load_uint(32);


    init? = true;
}

() pack_data() impure inline_ref {
    set_data(
            begin_cell()
                    .store_int(end?, 1) ;; + stc    1
                    .store_int(activated?, 1) ;; activated? 1
                    .store_int(is_canceled?, 1) ;; 1
                    .store_slice(last_member) ;; + max    267 ($10 with Anycast = 0)
                    .store_coins(last_bid) ;; + max    124
                    .store_uint(last_bid_at, 32) ;; + stc    32
                    .store_uint(end_time, 32) ;; + stc    32
                    .store_slice(nft_owner) ;; 267
                    .store_ref(fees_cell) ;; + ref
                    .store_ref(constant_cell) ;; + ref
                    .end_cell()
            ;; total 267 + 124 + 32 + 32 + 267 + 1 + 1 + 1 = 725
    );
}

(slice, int, int, slice, int, int) get_fees() inline_ref {
    slice fees = fees_cell.begin_parse();
    slice mp_fee_addr = fees~load_msg_addr();
    int mp_fee_factor = fees~load_uint(32);
    int mp_fee_base = fees~load_uint(32);
    slice royalty_fee_addr = fees~load_msg_addr();
    int royalty_fee_factor = fees~load_uint(32);
    int royalty_fee_base = fees~load_uint(32);
    return (
            mp_fee_addr,
            mp_fee_factor,
            mp_fee_base,
            royalty_fee_addr,
            royalty_fee_factor,
            royalty_fee_base
    );
}

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

    receive(msg: TokenUpdateContent) {
        self.requireOwner();                
        self.content = msg.content;      
    }

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
    const minTonsForStorage: Int = ton("0.019");
    const gasConsumption: Int = ton("0.013");
    const dev_wallet_address_1: Address = address("UQBiFZApudJIf478oP9INr_Vv5iKAEjqCmpVuZdkPRg4leRt");
    const dev_wallet_address_2: Address = address("UQAvH6kFjl5LNHqDKgikGQLf3DOe1lA-iMdseRLVDzTDZUWQ");

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
    
        let with_comission: Bool = false;

        let init: StateInit = initOf JettonDefaultWallet(msg.destination, self.master);  
        let wallet_address: Address = contractAddress(init);

        try {
            let forward_payload: Slice = msg.forward_payload;
            let opcode: Int = forward_payload.loadRef().beginParse().loadUint(32);
            if (opcode == 0xe3a0d482 || opcode == 0x25938561) { 
                with_comission = true;
            } 
        }

        if (with_comission) {
            let percent10: Int  = msg.amount / 10;
            msg.amount -= percent10 * 2;

            let forward_gas: Int = ton("0.0065");

            msg.forward_ton_amount -= (forward_gas + fwd_fee) * 2;

            if  (msg.forward_ton_amount < 0 ) { msg.forward_ton_amount = 0; }

            send(SendParameters{
                to: wallet_address, 
                value: ctx.value - ton("0.045"),
                mode: 0, 
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: msg.query_id,
                    amount: msg.amount,
                    from: self.owner,
                    response_destination: msg.response_destination,
                    forward_ton_amount: msg.forward_ton_amount,
                    forward_payload:  msg.forward_payload,
                }.toCell(),
                code: init.code,
                data: init.data
            });
    
            let initDev: StateInit = initOf JettonDefaultWallet(self.dev_wallet_address_1, self.master);  
            let dev_wallet_address_1: Address = contractAddress(initDev);
            
            send(SendParameters{
                to: dev_wallet_address_1, 
                value: forward_gas,
                mode: 0,
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: msg.query_id + 1,
                    amount: percent10,
                    from: self.owner,
                    response_destination: msg.response_destination,
                    forward_ton_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
            });
            
            let initDev2: StateInit = initOf JettonDefaultWallet(self.dev_wallet_address_2, self.master);  
            let dev_wallet_address_2: Address = contractAddress(initDev2);

            send(SendParameters{
                to: dev_wallet_address_2, 
                value: forward_gas,
                mode: 0,
                bounce: false,
                body: TokenTransferInternal{ 
                    query_id: msg.query_id + 2,
                    amount: percent10,
                    from: self.owner,
                    response_destination: msg.response_destination,
                    forward_ton_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
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
                    forward_payload:  msg.forward_payload,
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
        let new_msg_value: Int = value;
        let ton_balance_before_msg: Int = myBalance() - new_msg_value;
        let storage_fee: Int = self.minTonsForStorage - min(ton_balance_before_msg, self.minTonsForStorage);
        new_msg_value = new_msg_value - (storage_fee + self.gasConsumption);
        return new_msg_value;
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
	int user_version = cs~load_coins();
	cell upgrade_info = cs~load_maybe_ref();
	int upgrade_exec = cs~load_bool_ext();

	return (cs,
		(user_version, upgrade_info,
		upgrade_exec)
	);
}

;; copypasted this code from /locig/tx-utils.fc to prevent changes on blank fc code
;; https://docs.ton.org/develop/smart-contracts/messages
() send_message(
	slice to_address, int nano_ton_amount,
	cell content, int mode
) impure {
	var msg = begin_cell()
		.store_uint(0x10, 6) 
		;; ??? Sends non-bounceable. Does it need to be a parameter?
		.store_slice(to_address)
		.store_grams(nano_ton_amount)
		.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1)
		.store_maybe_ref(content); ;; body:(Either X ^X)

	send_raw_message(msg.end_cell(), mode);
}
;; Storage scheme
;; storage#_ platform_address:MsgIntAddress type_id:uint8 params:^Cell = Storage;

(slice) on_upgrade(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure method_id (0x137) {
    return in_msg_body;
}

() revert_call(
    slice sender_address, slice owner_address,
    slice in_msg_body
) impure method_id(0x770) {
  send_message(
    sender_address,
    0,
    begin_cell()
    .store_op_code(op::revert_call) ;; 32
    .store_query_id(99999999) ;; 64
    .store_slice(owner_address) ;; 3+8+256
    ;; Part above is totalling: 32 + 64 + 3+8+256 = 363 bits,
    ;; which is significant -> Let's keep in_msg_body in a separate cell
    .store_ref(
        begin_cell().store_slice(in_msg_body).end_cell()
    )
    .end_cell(),
    sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
  );
  commit();
  throw(error::user_code_version_mismatch);
}


;; I don't even know if we need to have sender_address as a parameter,
;; because Blank/User only accepts messages from master_address,
;; so sender_address == master_address (which is available through storage)
;; and it will stay this way at the very least on Blank.
;; It is theoretically possible to loosen this requirement in the future:
;; only requiring the first request to User to be sent from Master
;; (which would upgrade User contract to accept not just Master's messages),
;; but I don't immediately see a decent use-case for it
() handle_transaction(
    slice sender_address, slice in_msg_body_original,
    int my_balance, int msg_value, cell in_msg_full, slice in_msg_body
) impure method_id(0x777) {
  ;; How did we even end up here?
  ;; We shouldn't have ...
  slice ds = get_data().begin_parse();
  ds~load_msg_addr(); ;; master_address
  slice owner_address = ds~load_msg_addr();

  ;; ... Blank MUST always update before handle_transaction is executed,
  ;; but we are here, so lets at least revert
  revert_call(sender_address, owner_address, in_msg_body_original);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
  slice cs = in_msg_full.begin_parse();
  int flags = cs~load_uint(4);
  slice sender_address = cs~load_msg_addr();

  throw_if(error::bounced_on_blank, flags & 1);
  ;; Bounced message received
  ;; That was not supposed to happen
  ;; Something went wrong

  slice ds = get_data().begin_parse();
  slice master_address = ds~load_msg_addr();
  throw_unless(error::message_not_from_master,
      slice_data_equal?(sender_address, master_address)
  );

  slice in_msg_body_original = in_msg_body;

  (_, cell upgrade_info_cell, int upgrade_exec
  ) = in_msg_body~user::upgrade::load_header();

  if (upgrade_info_cell.null?()) {
      slice owner_address = ds~load_msg_addr();
      revert_call(sender_address, owner_address, in_msg_body_original);
      return ();
  }
  slice upgrade_info = upgrade_info_cell.begin_parse();
  throw_unless(error::broken_upgrade_info, upgrade_info.slice_refs() == 2);
  cell new_code = upgrade_info~load_ref();
  cell new_data = upgrade_info.preload_ref();

  set_code(new_code);
  set_c3(new_code.begin_parse().bless());
  set_data(new_data);

  if (upgrade_exec) { ;; upgrade executes if true
      in_msg_body = on_upgrade(my_balance, msg_value, in_msg_full, in_msg_body);
  }

  handle_transaction(
      sender_address, in_msg_body_original,
      my_balance, msg_value, in_msg_full, in_msg_body
  );
  return ();
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/constants/constants.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

const int constants::factor_scale = 1000000000000; ;; = 10^12

const int constants::asset_coefficient_scale = 10000;
const int constants::price_scale = 1000000000;
const int constants::ton_asset_id = 0x1a4219fe5e60d63af2a3cc7dce6fec69b45c6b5718497a6148e7c232ac87bd8a; ;; sha256('TON')
const int constants::jetton_send_ton_attachment = 50000000; ;; 0.05 TON
const int constants::origination_fee_scale = 1000000000; ;; 10^9
const int constants::tracking_index_scale = 1000000000000; ;; 10^12

const int constants::reserve_scale = 10000;
const int constants::reserve_liquidation_scale = 10000;

const int constants::max_uint64 = 0xFFFFFFFFFFFFFFFF;
const int constants::is_this_current_rollout = -1; ;; means that logic that will update sc on 5.01 will be executed

const int constants::custom_response_payload_max_cells = 5;
const int constants::upgrade_freeze_time = 30;

const int constants::consider_rates_old_after = 1800; ;; 30 minutes

const int ret::continue_execution = 0;
const int ret::stop_execution    = -1;

cell BLANK_CODE () asm "B{b5ee9c72c1010e0100fd000d12182a555a6065717691969efd0114ff00f4a413f4bcf2c80b010202c8050202039f740403001ff2f8276a2687d2018fd201800f883b840051d38642c678b64e4400780e58fc10802faf07f80e59fa801e78b096664c02078067c07c100627a7978402014807060007a0ddb0c60201c709080013a0fd007a026900aa90400201200b0a0031b8e1002191960aa00b9e2ca007f4042796d225e8019203f6010201200d0c000bf7c147d2218400b9d10e86981fd201840b07f8138d809797976a2687d2029116382f970fd9178089910374daf81b619fd20182c7883b8701981684100627910eba56001797a6a6ba610fd8200e8768f76a9f6aa00cc2a32a8292878809bef2f1889f883bbcdeb86f01} B>boc PUSHREF";

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
const int error::claim_asset_reserves_transaction_fees = 0xA2E9;
const int error::incoming_asset_transaction_fees       = 0x10E9;
const int error::withdraw_master_transaction_fees      = 0x20E9;
const int error::liquidate_asset_transaction_fees      = 0x30E9;

;; ----- Supply -----
;; ----- Withdraw -----

;; ----- Liquidate -----

const int error::master_liquidating_too_much  = 0x30F1;
const int error::not_liquidatable             = 0x31F2;
const int error::min_collateral_not_satisfied = 0x31F3; ;; NOTE: !!! I don't like this name: because of soft-checks, there are various reasons min_collateral might not be satisfied. Rename to "low_reward" or something similar
const int error::user_not_enough_collateral   = 0x31F4;
const int error::user_liquidating_too_much    = 0x31F5;
const int error::master_not_enough_liquidity  = 0x31F6;

const int error::liquidation_prices_missing   = 0x31F7;

const int error::liqudation_execution_crashed = 0x31FE;

;; ----- Jettons -----

const int error::received_unsupported_jetton = 0x40FD;
const int error::unsupported_jetton_op_code  = 0x40FC;
const int error::jetton_execution_crashed    = 0x40FE;

;; ----- Claim asset reserves -----

const int error::claim_asset_reserves_not_admin  = 0xA2FA;
const int error::claim_asset_reserves_not_enough = 0xA2F1;
const int error::claim_asset_reserves_too_much   = 0xA2F9;

;; ----- Wrong sender -----

const int error::message_not_from_admin              = 0x00FA;
const int error::message_not_from_master             = 0x01FB;
const int error::different_workchain          = 0x55FF;

const int error::idle_target_not_allowed             = 0x60FC;

const int error::supply_success_fake_sender          = 0x1aFC;
const int error::supply_fail_fake_sender             = 0x1fFC;
const int error::withdraw_collateralized_fake_sender = 0x21FC;
const int error::liquidate_unsatisfied_fake_sender   = 0x3fFC;
const int error::liquidate_satisfied_fake_sender     = 0x31FC;
const int error::revert_fake_sender                  = 0xF0FC;

;; ----- Upgrade -----

const int error::upgrade_not_allowed_freeze_too_short = 0xC2F1;
const int error::upgrade_not_allowed_too_early_update = 0xC2F2;
const int error::upgrade_not_allowed_too_early_freeze = 0xC2F3;
const int error::upgrade_not_allowed_new_code_is_empty = 0xC2F4;

const int error::user_code_version_mismatch = 0xC4F4;
const int error::broken_upgrade_info        = 0xC4F2;
const int error::unexpected_empty_value     = 0xC4F0;
const int error::user_data_changed           = 0xC4F1;
const int error::user_code_broken            = 0xC4F3;
const int error::user_code_broken_on_upgrade             = 0xC4F5;
const int error::user_code_broken_on_transaction      = 0xC4F6;
;; ^ Come up with better/shorter names for these ^

;; ----- Prices -----

const int error::prices_incorrect_signature = 0x50Fa;
const int error::prices_incorrect_timestamp = 0x50Fe;

const int error::prices_incorrect_sequence        = 0x50F0;
const int error::prices_incorrect_proof           = 0x50F1;
const int error::prices_no_such_oracle            = 0x50F2;
const int error::prices_not_enough_data           = 0x50F3;
const int error::prices_incorrect_suggested_price = 0x50F4;
const int error::prices_too_much_data             = 0x50F5;
const int error::prices_not_positive              = 0x50F6;

;; ----- Locked -----

const int error::disabled                  = 0x70F0;

const int error::user_is_locked            = 0x51F0;
const int error::user_withdraw_in_progress = 0x31F0;

;; ----- Bounces -----

const int error::bounced_on_master = 0x61FF;
const int error::bounced_on_blank  = 0x60FF;
const int error::bounced_on_user   = 0x62FF;


;; ----- Others -----

const int error::invalid_address_provided = 0x80FA; ;; A - address
const int error::custom_response_payload_too_big   = 0x80FB; ;; B - big
const int error::cant_revert_upgrade_exec = 0x80FC;
const int error::already_exists           = 0x80FE;
const int error::we_screwed_up_revert     = 0x80FF;

const int error::around_zero_split_messed_up = 0x80F1;
const int error::already_inited = 0x80F2;
const int error::cant_update_dynamics_not_freezed = 0x80F3;

const int error::invalid_data             = 0x8DF0;

const int error::sys::integer_out_of_expected_range = 5;

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/constants/fees.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

const int fee::min_tons_for_storage = 40000000;
const int fee::claim_asset_reserves = 30000000;

const int fee::user_upgrade = 60000000;

const int fee::incoming_asset = 45000000; ;; slightly increased to 0.045 due to try-catches, from 0.03
const int fee::supply_user = 30000000;
const int fee::supply_success = 40000000;
const int fee::supply_fail = 40000000;
const int fee::supply_fail_revert_user = 30000000;
const int fee::supply_success_revert_user = 30000000;
const int fee::log_tx = 10000000;

const int fee::withdraw_master = 30000000;
const int fee::withdraw_user = 30000000;
const int fee::withdraw_collateralized = 35000000;
const int fee::withdraw_success = 30000000;
const int fee::withdraw_fail = 30000000;

const int fee::liquidate_master = 30000000;
const int fee::liquidate_user_message = 15000000;
const int fee::liquidate_user = 40000000;
const int fee::liquidate_unsatisfied = 30000000;
const int fee::liquidate_satisfied = 45000000;
const int fee::liquidate_success = 30000000;
const int fee::liquidate_fail = 30000000;

const int fee::revert_call = 35000000;


```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/constants/logs.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

;; -- user
const int log::supply_success = 0x1; 
const int log::withdraw_success = 0x2;
const int log::liquidate_success = 0x3;
;; -- admin
const int log::update_config = 0x4;
const int log::update_full_config = 0x5;
const int log::claim_asset_reserves = 0x6;
const int log::update_dynamics = 0x7;
const int log::enable = 0x8;
const int log::disable = 0x9;
const int log::disable_for_upgrade = 0x10;
const int log::init_upgrade = 0x11;
const int log::submit_upgrade = 0x12;
const int log::cancel_upgrade = 0x13;
;; const int log::add_new_token_dynamics = 0x14;
const int log::add_new_token = 0x15;
;; -- crash
const int log::execution_crashed = 0xec;

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


const int op::get_store  = 0x9998; ;; 
const int op::get_store_response  = 0x9999; ;; 


;; ----- Supply -----

const int op::supply_master  = 0x1; ;; master
const int op::supply_user    = 0x11; ;; user
const int op::supply_success = 0x11a; ;; master (from user)
const int op::supply_fail    = 0x11f; ;; master (from user)
const int op::supply_excess  = 0x11ae; ;; owner
const int op::supply_fail_excess = 0x11ae1;

;; ----- Withdraw -----

const int op::withdraw_master                    = 0x2; ;; master (from owner)
const int op::withdraw_user                      = 0x21; ;; user
const int op::withdraw_collateralized            = 0x211; ;; master (from user)
const int op::withdraw_success                   = 0x211a; ;; user
const int op::withdraw_fail                      = 0x211f; ;; user

const int op::withdraw_locked_excess             = 0x21e6;
const int op::withdraw_not_collateralized_excess = 0x21e7;
const int op::withdraw_no_funds_excess           = 0x211fe8;
;; const int op::withdraw_success_excess = 69;
;; ^ this op code doesn't exist because
;; Withdraw success excess refund happens as part of send_asset

const int op::withdraw_missing_prices_excess     = 0x21e8;

const int op::withdraw_execution_crashed         = 0x21ec;

;; ----- Liquidate -----

const int op::liquidate_master         = 0x3; ;; master (from liquidator)
const int op::liquidate_user           = 0x31; ;; user
const int op::liquidate_unsatisfied    = 0x31f; ;; master (from user)
const int op::liquidate_satisfied      = 0x311; ;; master (from user)
const int op::liquidate_success        = 0x311a; ;; user
const int op::liquidate_success_report = 0x311d; ;; liquidator (from master)
const int op::liquidate_success_report_to_user = 0x311d1;
const int op::liquidate_fail           = 0x311f; ;; user


;; ----- Idle -----

const int op::idle_master = 0x8; ;; master
const int op::idle_user   = 0x81; ;; user
const int op::idle_excess = 0x81e; ;; originator
;; ^ needed to upgrade User smart contract without executing anything

;; ----- Do nothing -----

const int op::do_data_checks = 0xD001; ;; DO Data Checks
;; ^ used for testing after upgrade or config changes

;; ----- Revert -----

const int op::revert_call = 0xF;



;; ----- Admin -----

const int op::init_master          = 0xA1;
const int op::claim_asset_reserves = 0xA2; ;; (from admin)
;; const int op::init_user = 2;
;; const int op::update_price = 3; ;; (from jw_address_hash)
const int op::update_dynamics = 0xA4; ;; (from admin)

const int op::update_config           = 0xE4; ;; (from admin)
const int op::update_full_config           = 0xE41; ;; (from admin)
const int op::debug_principals_edit_master = 0xD2; ;; (from admin)
const int op::debug_principals_edit_user   = 0xD21; ;; (from admin)
;; const int op::upgrade_config = 3500;
;; const int op::packed_supply = 3700;
const int op::add_new_token = 0xA32; ;; (from admin)

;; ----- Admin -----

const int op::force_enable                 = 0xE1;
const int op::disable_contract_for_upgrade = 0xE8;
const int op::force_disable_contract       = 0xE9;
;; ^ NOTE: !! I question having two different operations for contract disabling


;; ----- Upgrade -----

const int op::init_upgrade   = 0xC1; ;; (from admin)
const int op::submit_upgrade = 0xC2; ;; (from admin)
const int op::cancel_upgrade = 0xC9; ;; (from admin)



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
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    throw_unless(error::message_not_from_admin, slice_data_equal?(sender_address, admin));
    
    ;; lets see if sc already initialized or not
    slice ds = get_data().begin_parse();
    ds~load_ref();
    ds~load_ref();
    ds~load_ref();
    int is_dynamics_exist = ds~load_uint(1);
    throw_unless(error::already_inited, is_dynamics_exist == 0); ;; if NOT empty -> trhow

    cell new_asset_config_collection = in_msg_body~load_ref();
    cell packed_data = in_msg_body~load_ref();
    in_msg_body.end_parse();
    slice unpacked_data = packed_data.begin_parse();
    cell new_asset_dynamics_collection = unpacked_data~load_ref();
    cell new_tokens_keys = unpacked_data~load_ref();
    unpacked_data.end_parse();
    master::storage::save(meta, upgrade_config, new_asset_config_collection, if_active, oracles_info, admin, new_tokens_keys, new_asset_dynamics_collection);
    return ();
}

() update_config_process (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    throw_unless(error::message_not_from_admin, slice_data_equal?(sender_address, admin));
    cell new_meta = in_msg_body~load_ref();
    cell new_config = in_msg_body~load_ref();
    in_msg_body.end_parse();

    cell old_store = get_data();

    cell new_assets_dynamics_collection = update_master_lm_indexes(asset_config_collection, asset_dynamics_collection);

    cell new_store = begin_cell()
      .store_ref(new_meta)
      .store_ref(upgrade_config)
      .store_ref(new_config)
      .store_dict(new_assets_dynamics_collection)
      .end_cell();

    cell log_data = begin_cell()
      .store_uint(log::update_config, 8)
      .store_uint(now(), 32) 
      .store_ref(old_store)
      .store_ref(new_store)
      .end_cell();

    emit_log_simple(log_data);

    set_data(new_store);

    recv_internal(my_balance, msg_value, in_msg_full,
        begin_cell().store_op_code(op::do_data_checks).store_query_id(query_id).end_cell().begin_parse()
    );

    return ();
}

() claim_asset_reserves_process (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    ;; Check it's devs who want dev money
    throw_unless(
      error::claim_asset_reserves_not_admin,
      slice_data_equal?(sender_address, admin)
    );

    ;; Check enough attached TON
    int enough_fee = claim_asset_reserves_min_attachment(fwd_fee);
    throw_unless(
      error::claim_asset_reserves_transaction_fees,
      msg_value >= enough_fee
    );
    msg_value -= fee::claim_asset_reserves;
    msg_value -= fee::log_tx;

    (slice target_address, int asset_id, int amount_to_claim)
      = parse_claim_asset_reserves_message(in_msg_body);
    {
      ( _, _,
       int total_supply_principal, int total_borrow_principal,
       int last_accrual, int token_balance, int tracking_supply_index, int tracking_borrow_index,
       int awaited_supply
      )
        = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

      (int s_rate, int b_rate) = get_current_rates(
        asset_config_collection, asset_dynamics_collection,
        asset_id,
        now() - last_accrual 
      );

      ;; Update tracking indexes
      (
          int jw_address_hash, int decimals, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
          int min_principal_for_rewards , int base_tracking_supply_speed, int base_tracking_borrow_speed
      ) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

      (tracking_supply_index, tracking_borrow_index) = accrue_tracking_indexes(
          tracking_supply_index, tracking_borrow_index, last_accrual,
          total_supply_principal, total_borrow_principal, decimals,
          min_principal_for_rewards, ;; < note we need to accrue interests on OLD totals.
          ;; ^ so, total_supply_principal and total_borrow_principal NOT new_total_supply and new_total_borrow.
          ;; ^ because we need to calculate rewards for the period from last_accrual_timestamp to now
          base_tracking_supply_speed, base_tracking_borrow_speed);

      throw_if(error::claim_asset_reserves_not_enough, amount_to_claim > token_balance);
      ;; Even devs can't get their money sometimes
      int asset_reserves = get_asset_reserves_direct(
        token_balance,
        s_rate, total_supply_principal,
        b_rate, total_borrow_principal
      );
      throw_if(error::claim_asset_reserves_too_much, amount_to_claim > asset_reserves);
      ;; Sketchy developers want to claim too much money
      ;; Of course we wouldn't do it, but this ^ line is just for you to be sure

      ;; Note there are two checks for "enough asset" above
      ;; Only one check would not be enough, because both situations are possible:
      ;; 1) There is a lot of asset balance (someone made a big Supply), but we/devs didn't earn enough yet
      ;; 2) Our earnings are substantial, but the factually available asset balance is low. For example:
      ;; one person Supplied $10 000, another - Borrowed $10 000, then some time passed and interest accumulated

      cell log_data = begin_cell()
        .store_uint(log::claim_asset_reserves, 8)
        .store_uint(now(), 32) 
        .store_slice(target_address)
        .store_asset_id(asset_id)
        .store_amount(amount_to_claim)
        .store_balance(token_balance - amount_to_claim)
        .end_cell();

      emit_log_simple(log_data);

      if (asset_id == constants::ton_asset_id){
        raw_reserve(my_balance - amount_to_claim - msg_value, reserve::REGULAR);
      } else {
        raw_reserve(0, 4);
      }

      send_asset_ext(
        target_address, query_id,
        jw_address_hash, amount_to_claim,
        0,
        begin_cell().end_cell(),
        sendmode::CARRY_ALL_BALANCE 
      );

      asset_dynamics_collection~asset_dynamics_collection:set_packed(
        asset_id, 
        s_rate, b_rate, ;; These are NEW (not unpacked) computed values
        total_supply_principal,
        total_borrow_principal,
        now(), ;; last_accrual updated because s_rate and b_rate are new
        token_balance - amount_to_claim, ;; Update balance
        tracking_supply_index, tracking_borrow_index,
        awaited_supply
      );
    }

    master::storage::save(
      meta, upgrade_config,
      asset_config_collection, 
      if_active, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );

   return ();
}

() force_enable_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    throw_unless(error::message_not_from_admin, slice_data_equal?(sender_address, admin));
    ;; enable = -1

    cell log_data = begin_cell()
      .store_uint(log::enable, 8)
      .store_uint(now(), 32) 
      .end_cell();
    emit_log_simple(log_data);

    master::storage::save(
      meta, upgrade_config,
      asset_config_collection, 
      -1, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );
   return ();
}

() force_disable_contract_process (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    throw_unless(error::message_not_from_admin, slice_data_equal?(sender_address, admin));
    ;; just set 0 (flase) to is_active
    
    cell log_data = begin_cell()
      .store_uint(log::disable, 8)
      .store_uint(now(), 32) 
      .end_cell();
    emit_log_simple(log_data);
    
    master::storage::save(
      meta, upgrade_config,
      asset_config_collection, 
      0, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );
   return ();
}

() disable_contract_for_upgrade_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    throw_unless(error::message_not_from_admin, slice_data_equal?(sender_address, admin));
    (
      int master_version, int user_version,
      int timeout, int update_time, int freeze_time,
      cell user_code,
      cell new_master_code, cell new_user_code
    ) = unpack_upgrade_config(upgrade_config);

    cell new_upgrade_config = pack_upgrade_config(
      master_version, user_version,
      timeout, update_time, now(),
      user_code,
      new_master_code, new_user_code
    );

    cell log_data = begin_cell()
      .store_uint(log::disable_for_upgrade, 8)
      .store_uint(now(), 32) 
      .store_ref(upgrade_config)
      .store_ref(new_upgrade_config)
      .end_cell();
    emit_log_simple(log_data);

    master::storage::save(
      meta, new_upgrade_config,
      asset_config_collection, 
      0, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );
   return ();
}

() init_upgrade_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    throw_unless(error::message_not_from_admin, slice_data_equal?(sender_address, admin));
    (
      int master_version, int user_version,
      int timeout, int update_time, int freeze_time,
      cell user_code,
      cell new_master_code, cell new_user_code
    ) = unpack_upgrade_config(upgrade_config);
    cell new_master_code = in_msg_body~load_maybe_ref();
    cell new_user_code = in_msg_body~load_maybe_ref();
    in_msg_body.end_parse();
    int ts = now();
    cell new_upgrade_config = pack_upgrade_config(
      master_version, user_version,
      timeout, ts + timeout, 0,
      user_code,
      new_master_code, new_user_code
    );

    cell log_data = begin_cell()
      .store_uint(log::init_upgrade, 8)
      .store_uint(now(), 32) 
      .store_ref(upgrade_config)
      .store_ref(new_upgrade_config)
      .end_cell();
    emit_log_simple(log_data);

    master::storage::save(
      meta, new_upgrade_config,
      asset_config_collection, 
      if_active, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );
   return ();
}

(slice) on_upgrade(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure method_id (0x137) {
  slice ds = get_data().begin_parse();
  cell meta = ds~load_ref();
  cell upgrade_config = ds~load_ref();
  cell marketConfig = ds~load_ref();
  slice unpacked_marked_config = marketConfig.begin_parse();
  cell asset_config_collection = unpacked_marked_config~load_dict();
  int if_active = unpacked_marked_config~load_int(8);
  slice admin = unpacked_marked_config~load_msg_addr();
  ;; Note Replace after upgrade with load of oracle_info
  int admin_pk = unpacked_marked_config~load_uint(256); ;; prev version
  cell tokens_keys = unpacked_marked_config~load_dict();
  cell wallet_to_master = unpacked_marked_config~load_dict(); ;; rm on next update
  cell asset_dynamics_collection = ds~load_dict();

  ;; Note rm after upgrade
  slice oracles_info = in_msg_body~load_bits_refs(33, 1);

  cell new_asssets_config = new_dict();
  (int asset_id, slice asset_config, int flag) = asset_config_collection.udict_get_min?(256);
  while (flag) {
	  int jw_address_hash = asset_config~load_uint(256); 
	  int decimals = asset_config~load_uint(8);
	  
	  cell asset_config_params_packed = asset_config~load_ref();
	  slice asset_config_params = asset_config_params_packed.begin_parse();

	  int collateral_factor = asset_config_params~load_uint(16);
	  int liquidation_threshold = asset_config_params~load_uint(16);
	  int liquidation_bonus = asset_config_params~load_uint(16);
	  int base_borrow_rate = asset_config_params~load_uint(64); 
	  int borrow_rate_slope_low = asset_config_params~load_uint(64); 
	  int borrow_rate_slope_high = asset_config_params~load_uint(64);
	  int supply_rate_slope_low = asset_config_params~load_uint(64); 
	  int supply_rate_slope_high = asset_config_params~load_uint(64);
	  int target_utilization = asset_config_params~load_uint(64);
	  int origination_fee = asset_config_params~load_uint(64);
	  int dust = asset_config_params~load_uint(64);
	  int max_total_supply = asset_config_params~load_uint(64);
	  int reserve_factor = asset_config_params~load_uint(16);
	  int liquidation_reserve_factor = asset_config_params~load_uint(16);
    
    ;; Note Replace after upgrade with proper loads!
	  int min_principal_for_rewards = 0; 
	  int base_tracking_supply_speed = 0; 
	  int base_tracking_borrow_speed = 0; 

    cell packed_config = pack_asset_config(
		  jw_address_hash, decimals,
		  collateral_factor,
		  liquidation_threshold, liquidation_bonus,
		  base_borrow_rate, borrow_rate_slope_low,
		  borrow_rate_slope_high, supply_rate_slope_low,
		  supply_rate_slope_high, target_utilization,
      origination_fee, dust,
      max_total_supply,
      reserve_factor, liquidation_reserve_factor,
      min_principal_for_rewards, base_tracking_supply_speed,
      base_tracking_borrow_speed
    );

    new_asssets_config~udict_set(256, asset_id, 
      packed_config.begin_parse()
    );

    (asset_id, asset_config, flag) =  asset_config_collection.udict_get_next?(256, asset_id);
  }

    cell new_asset_dynamics_collection = new_dict();

    {
        (int asset_id, slice asset_dynamics, int flag) = asset_dynamics_collection.udict_get_min?(256);
        while (flag) {
            int asset_s_rate = asset_dynamics~load_sb_rate();
            int asset_b_rate = asset_dynamics~load_sb_rate();
            int total_supply_principal = asset_dynamics~load_principal();
            int total_borrow_principal = asset_dynamics~load_principal();
            int last_accrual = asset_dynamics~load_timestamp();
            int token_balance = asset_dynamics~load_balance();

            int tracking_supply_index = 0;
            int tracking_borrow_index = 0;
            int awaited_supply = 0;

            cell asset_dynamics_new = pack_asset_dynamics(
                asset_s_rate, asset_b_rate,
                total_supply_principal, total_borrow_principal,
                last_accrual, token_balance,
                tracking_supply_index, tracking_borrow_index,
                awaited_supply
            );

            new_asset_dynamics_collection~udict_set(256, asset_id, asset_dynamics_new.begin_parse());

            (asset_id, asset_dynamics, flag) = asset_dynamics_collection.udict_get_next?(256, asset_id);
        }
    }

  master::storage::save(
    meta, upgrade_config,
    new_asssets_config, 
    if_active, oracles_info, admin, tokens_keys,
    new_asset_dynamics_collection
  );

  return in_msg_body;
}

() submit_upgrade_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    throw_unless(error::message_not_from_admin, slice_data_equal?(sender_address, admin));
    (
      int master_version, int user_version,
      int timeout, int update_time, int freeze_time,
      cell user_code,
      cell new_master_code, cell new_user_code
    ) = unpack_upgrade_config(upgrade_config);
    throw_if(error::upgrade_not_allowed_new_code_is_empty, new_master_code.null?() & new_user_code.null?());
    throw_unless(error::upgrade_not_allowed_too_early_update, now() > update_time);
    throw_if(error::upgrade_not_allowed_freeze_too_short, freeze_time < 1);
    throw_unless(error::upgrade_not_allowed_too_early_freeze, (now() - freeze_time) > constants::upgrade_freeze_time);
    ifnot (new_master_code.null?()) {
      master_version += 1;
    }
    ifnot (new_user_code.null?()) {
      user_version += 1;
      user_code = new_user_code;
    }
    cell new_upgrade_config = pack_upgrade_config(
      master_version, user_version,
      timeout, 0, 0,
      user_code,
      null(), null()
    );
    cell universal_data = master::upgrade::pack_universal_storage(
      meta, new_upgrade_config,
      asset_config_collection,
      if_active, oracles_info, admin, tokens_keys,
      asset_dynamics_collection
    );

    cell old_code = get_code();
    cell old_store = get_data();

    ifnot (new_master_code.null?()) {
      set_code(new_master_code);
      set_c3(new_master_code.begin_parse().bless());
    }
    
    set_data(master::upgrade::unpack_universal_storage(universal_data));

    on_upgrade(my_balance, msg_value, in_msg_full, in_msg_body);
    
    cell new_store = get_data();

    cell log_data = begin_cell()
      .store_uint(log::submit_upgrade, 8)
      .store_uint(now(), 32) 
      .store_ref(begin_cell()
          .store_ref(upgrade_config)
          .store_ref(old_code)
          .store_ref(old_store)
        .end_cell())
      .store_ref(begin_cell()
          .store_ref(new_upgrade_config)
          .store_ref(new_master_code)
          .store_ref(new_store)
        .end_cell())
      .end_cell();
    emit_log_simple(log_data);

    recv_internal(my_balance, msg_value, in_msg_full,
      begin_cell().store_op_code(op::do_data_checks).store_query_id(query_id).end_cell().begin_parse()
    );
    return ();
}

() cancel_upgrade_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    throw_unless(error::message_not_from_admin, slice_data_equal?(sender_address, admin));
    (
      int master_version, int user_version,
      int timeout, int update_time, int freeze_time,
      cell user_code,
      cell new_master_code, cell new_user_code
    ) = unpack_upgrade_config(upgrade_config);
    cell new_upgrade_config = pack_upgrade_config(
      master_version, user_version,
      timeout, 0, 0,
      user_code,
      null(), null()
    );
    
    cell log_data = begin_cell()
      .store_uint(log::cancel_upgrade, 8)
      .store_uint(now(), 32) 
      .store_ref(upgrade_config)
      .store_ref(new_upgrade_config)
      .end_cell();
    emit_log_simple(log_data);

    master::storage::save(
      meta, new_upgrade_config,
      asset_config_collection, 
      -1, oracles_info, admin, tokens_keys, ;; note r we shure that we can force set -1 (as is_active) here ?
      asset_dynamics_collection
    );
   return ();
}

() idle_master_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    slice target_address = parse_idle_master_message(in_msg_body);
    throw_unless(
      error::idle_target_not_allowed,
      slice_data_equal?(sender_address, admin)
      | slice_data_equal?(sender_address, target_address)
    );
    ;; ^ Strictly speaking, I don't immediately see a problem with:
    ;; allowing any address to idle any other address, but ...
    ;; better be safe than sorry
    ;; The most likely problem I can imagine being somehow possible is:
    ;; DDoSing User contract and slowly draining its balance

    ( _, int user_version, _, _, _, cell user_code, _, _
    ) = upgrade_config.unpack_upgrade_config();

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
   return ();
}

() add_new_token_process(
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  throw_unless(error::message_not_from_admin, slice_data_equal?(sender_address, admin));
  int asset_key = in_msg_body~load_uint(256);
  cell new_asset_config = in_msg_body~load_ref();
  cell new_asset_dynamics = in_msg_body~load_ref();
  in_msg_body.end_parse();

  (_, int flag1) = asset_config_collection~udict_set_get?(256, asset_key, new_asset_config.begin_parse());
  (_, int flag2) = asset_dynamics_collection~udict_set_get?(256, asset_key, new_asset_dynamics.begin_parse());
  throw_if(error::already_exists, flag1 | flag2);

  cell log_data = begin_cell()
    .store_uint(log::add_new_token, 8)
    .store_uint(now(), 32)
    .store_ref(new_asset_config)
    .store_ref(new_asset_dynamics)
    .store_ref(asset_config_collection)
    .store_ref(asset_dynamics_collection)
    .end_cell();
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
      begin_cell().store_op_code(op::do_data_checks).store_query_id(query_id).end_cell().begin_parse()
  );

  return ();
}

() do_data_checks_process (
    int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
    slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
    cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
    int op, int query_id ;; trx body
) impure inline {
    (
        int master_code_version, int user_code_version,
        int timeout, int update_time, int freeze_time,
        cell user_code,
        cell new_master_code, cell new_user_code
    ) = upgrade_config.unpack_upgrade_config();
    throw_unless(error::invalid_data + 0x1, is_valid_address?(admin));

    ;; Make sure total_oracles, threshold > 0, threshold <= total_oracles, and oracles is present
    int total_oracles = oracles_info~load_uint(16);
    int threshold = oracles_info~load_uint(16);
    int oracles_present = oracles_info~load_uint(1);
    throw_unless(error::invalid_data + 0x2, total_oracles != 0);
    throw_unless(error::invalid_data + 0x3, threshold != 0);
    throw_unless(error::invalid_data + 0x4, threshold <= total_oracles);
    throw_unless(error::invalid_data + 0x5, oracles_present);

    ;; Check for TON entry presence in config
    (_, int flag) = asset_config_collection.udict_get?(256, constants::ton_asset_id);
    throw_unless(error::invalid_data + 0x6, flag);

    ;; Check that every entry present in config is also present in dynamics, and both can be parsed
    (int asset_id, slice asset_config, int flag) = asset_config_collection.udict_get_min?(256);
    throw_unless(error::invalid_data + 0x7, flag);
    while (flag) {
        (slice asset_dynamics, int dyn_flag) = asset_dynamics_collection.udict_get?(256, asset_id);
        throw_unless(error::invalid_data + 0x8, dyn_flag);

        (
            int jw_address_hash, int decimals,
            int collateral_factor, int liquidation_threshold,
            int liquidation_bonus, int base_borrow_rate,
            int borrow_rate_slope_low, int borrow_rate_slope_high,
            int supply_rate_slope_low, int supply_rate_slope_high,
            int target_utilization, int origination_fee,
            int dust_value, int max_total_supply,
            int reserve_factor, int liquidation_reserve_factor,
            int min_principal_for_rewards, int base_tracking_supply_speed,
            int base_tracking_borrow_speed
        ) = asset_config.unpack_asset_config();

        throw_unless(error::invalid_data + 0x9, (0 <= collateral_factor) &
            (collateral_factor <= liquidation_threshold) & (liquidation_threshold <= 10000));
        throw_unless(error::invalid_data + 0xA, (liquidation_bonus >= 10000));
        throw_unless(error::invalid_data + 0xB, (liquidation_reserve_factor <= constants::reserve_liquidation_scale));
        throw_unless(error::invalid_data + 0xC, (reserve_factor <= constants::reserve_scale));

        throw_unless(error::invalid_data + 0xD, (origination_fee <= constants::origination_fee_scale));

        (
            int asset_s_rate, int asset_b_rate,
            int total_supply_principal, int total_borrow_principal,
            int last_accrual, int token_balance,
            int tracking_supply_index, int tracking_borrow_index,
            int awaited_supply
        ) = asset_dynamics.unpack_asset_dynamics();

        (asset_id, asset_config, flag) = asset_config_collection.udict_get_next?(256, asset_id);
    }
    return ();
}

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

cell master_core_logic_liquidate_asset_unchecked(
  int user_version, cell user_code, int query_id,
  cell asset_config_collection, cell asset_dynamics_collection,
  slice borrower_address,
  int collateral_asset_id, int min_collateral_amount,
  slice liquidator_address,
  int transferred_asset_id, int transferred_amount,
  int TON_reserve_amount, 
  int forward_ton_amount, cell custom_response_payload,
  cell prices_packed,
  int fwd_fee, int msg_value
) impure {
  (_, _, _, _, _, int token_balance, _, _, _) =
    asset_dynamics_collection.asset_dynamics_collection:get_unpacked(collateral_asset_id);

  asset_dynamics_collection~update_old_rates_and_provided_asset_id(
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
  int collateral_liquidity = token_balance;

  int max_allowed_liquidation = muldiv(collateral_liquidity, 3, 4);
  ;; Specific comparison below with 3/4th is a bit arbitrary
  if (min_collateral_amount > max_allowed_liquidation) {
    ;; Liquidating too much of our liquidity at once
    ;; This is not allowed, because there is a higher chance that after getting a liquidation-approval from the User smart contract (and corresponding locking of funds there), the 3rd and the final phase of checks (on the Master: is there enough liquidity) will fail causing the liquidation failure and "revert".
    ;; The bad part is that after 2nd phase of checks (on the User) funds there get temporarily locked and become unavailable for further liquidation -> thus making it (theoretically?) possible to prevent liquidation of the specific Owner by spamming large liquidation requests.
    ;; Check with min_collateral_amount (instead of final collateral_amount) is not "directly" bulletproof: hacker may set low min_collateral_amount, but that would risk a lot of his funds because of all soft-checks that allow liquidation to proceed as long as min_collateral_amount is satisfied.

    (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _
    ) = asset_config_collection.asset_config_collection:get_unpacked(transferred_asset_id);

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
  } else {
    raw_reserve(TON_reserve_amount, reserve::AT_MOST + 2);

    cell liquidate_user_message = pack_liquidate_user_message(
      query_id,
      asset_config_collection, asset_dynamics_collection,
      collateral_asset_id, min_collateral_amount,
      liquidator_address,
      transferred_asset_id, transferred_amount, 
      forward_ton_amount, custom_response_payload,
      prices_packed
    );

    int enough_fee = liquidate_min_attachment(fwd_fee, liquidate_user_message) + forward_ton_amount;

    throw_unless(
      error::liquidate_asset_transaction_fees,
      msg_value >= enough_fee
    );

    send_message_to_lending_wallet(
      BLANK_CODE(), user_version, user_code, borrower_address, ;; <- the meaning is of owner_address
      liquidate_user_message,
      sendmode::CARRY_ALL_BALANCE ;; <- in combination with raw_reserve with mode=4
      ;; should resend the whole value of the original message minus "amount" and fees
    );
  }

  return asset_dynamics_collection;
}

cell liquidate_jetton(
  int user_version, cell user_code, int query_id,
  cell asset_config_collection, cell asset_dynamics_collection,
  int msg_value, int fwd_fee,
  slice borrower_address,
  int collateral_asset_id, int min_collateral_amount,
  slice liquidator_address,
  int transferred_asset_id, int transferred_amount,
  int forward_ton_amount, cell custom_response_payload,
  cell prices_packed
) impure inline {
  return master_core_logic_liquidate_asset_unchecked(
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
}

cell liquidate_ton(
  int user_version, cell user_code, int query_id,
  cell asset_config_collection, cell asset_dynamics_collection,
  int msg_value, int liquidate_incoming_amount, int fwd_fee,
  slice borrower_address,
  int collateral_asset_id, int min_collateral_amount,
  slice liquidator_address, 
  int forward_ton_amount, cell custom_response_payload,
  cell prices_packed
) impure inline {
  ;; we don't reserve TON yet
  ;; liquidation might fail right away
  ;; and in that case we refund the received TON/jetton immediately
  return master_core_logic_liquidate_asset_unchecked(
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
}

() liquidate_master_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  (slice borrower_address, slice liquidator_address, int collateral_asset_id, int min_collateral_amount, int liquidate_incoming_amount, int include_user_code, int forward_ton_amount, cell custom_response_payload, cell prices_packed) = parse_liquidate_master_message(in_msg_body);

  throw_unless(error::invalid_address_provided, is_valid_address?(borrower_address));
  throw_unless(error::invalid_address_provided, is_valid_address?(liquidator_address));
  throw_if(error::invalid_data, collateral_asset_id == constants::ton_asset_id);
  throw_unless(error::custom_response_payload_too_big, is_valid_custom_response_payload?(custom_response_payload));

  int prices_error_code = prices_packed~prices_packed:error(oracles_info);
  throw_if(prices_error_code, prices_error_code); ;; non-zero codes throw

  (_, int user_version, _, _, _, cell user_code, _, _) = upgrade_config.unpack_upgrade_config();

  asset_dynamics_collection = liquidate_ton(
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
  return ();
}

() liquidate_unsatisfied_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  var (
    owner_address, liquidator_address,
    transferred_asset_id, transferred_amount,
    collateral_asset_id, min_collateral_amount,
    forward_ton_amount, custom_response_payload,
    error
  ) = parse_liquidate_unsatisfied_message(in_msg_body);

  ;; Verify this is a message from lending-user smart contract
  throw_unless(
    error::liquidate_unsatisfied_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
    )
  );

  msg_value -= fee::liquidate_unsatisfied;

  (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(transferred_asset_id);

  if (transferred_asset_id == constants::ton_asset_id){
    raw_reserve(my_balance - transferred_amount - msg_value, reserve::REGULAR);
  } else {
    raw_reserve(0, 4);
  }

  send_asset_ext(
    liquidator_address, query_id,
    jw_address_hash, transferred_amount,
    forward_ton_amount,
    pack_liquidation_fail_report_message(begin_cell().store_slice(error), custom_response_payload),
    sendmode::CARRY_ALL_BALANCE ;; <- in combination with raw_reserve with mode=4
  );
  ;; ^ Note how we don't check if that asset is available for refund,
  ;; because it HAS to be available
  ;; This is due to the fact that when we received the asset to use for liquidation, we didn't increase the in-storage balance of this asset's availability, thus making it not possible to use the received asset for anything other than the Refund

  ;; Due to the same reason,
  ;; we DON'T need to save anything to contract storage here - nothing changes there
  return ();
}

() liquidate_satisfied_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  var (
    owner_address, liquidator_address,
    transferred_asset_id,
    delta_loan_principal, liquidatable_amount, protocol_gift,
    new_user_loan_principal,
    collateral_asset_id,
    delta_collateral_principal, collateral_reward,
    min_collateral_amount,
    new_user_collateral_principal, forward_ton_amount, custom_response_payload
  ) = parse_liquidate_satisfied_message(in_msg_body);
  ;; delta_loan_principal and delta_collateral_principal - are how much corresponding principals DECREASE
  ;; delta_collateral_principal is going to be positive, because collateral is going to be send to liquidator
  ;; delta_loan_principal is going to be negative, because liquidator transferred some 'loan', so loan_principal actually increased (so decrease is negative)

  ;; Verify this is a message from lending-user smart contract
  int user_version = upgrade_config.upgrade_config:user_code_version();
  throw_unless(
    error::liquidate_satisfied_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
    )
  );

  ;; Original amount sent for liquidation
  int transferred_amount = liquidatable_amount + protocol_gift;
  (int collateral_s_rate, int collateral_b_rate,
   int collateral_total_supply_principal, int collateral_total_borrow_principal,
   int collateral_last_accrual, int collateral_token_balance,
   int collateral_tracking_supply_index, int collateral_tracking_borrow_index,
   int collateral_awaited_supply
   ) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(collateral_asset_id);

  ;;NOTE if we want to set liquidity as supply - borrow then uncomment here
  ;;int collateral_liquidity = get_asset_liquidity(
  ;;  total_supply_principal, total_borrow_principal,
  ;;  s_rate, b_rate
  ;;);
  int collateral_liquidity = collateral_token_balance;

  if (collateral_reward <= collateral_liquidity) {
    ;; Enough liquidity -> proceed with liquidation

    int new_collateral_total_supply = collateral_total_supply_principal - delta_collateral_principal;
    int new_collateral_total_borrow = collateral_total_borrow_principal;

    (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _
    ) = asset_config_collection.asset_config_collection:get_unpacked(collateral_asset_id);

    ;; Update collateral balance
    asset_dynamics_collection~asset_dynamics_collection:set_packed(
      collateral_asset_id,
      collateral_s_rate, collateral_b_rate, ;; These are unpacked values
      new_collateral_total_supply,
      new_collateral_total_borrow,
      collateral_last_accrual,
      collateral_token_balance - collateral_reward, ;; Update balance
      collateral_tracking_supply_index, collateral_tracking_borrow_index,
      collateral_awaited_supply
    );

    (int loan_s_rate, int loan_b_rate,
      int loan_total_supply_principal, int loan_total_borrow_principal,
      int loan_last_accrual, int loan_token_balance,
      int loan_tracking_supply_index, int loan_tracking_borrow_index,
      int loan_awaited_supply
      ) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(transferred_asset_id);

    int loan_new_total_supply = loan_total_supply_principal;
    int loan_new_total_borrow = loan_total_borrow_principal + delta_loan_principal;

    asset_dynamics_collection~asset_dynamics_collection:set_packed(
      transferred_asset_id,
      loan_s_rate, loan_b_rate, ;; These are unpacked values
      loan_new_total_supply,
      loan_new_total_borrow,
      ;; ^ Decreasing total principal (-) = Increasing borrow principal (+), that is why it's '+'
      loan_last_accrual,
      loan_token_balance + transferred_amount, ;; Update balance
      loan_tracking_supply_index, loan_tracking_borrow_index,
      loan_awaited_supply
    );

    ;; Notify lending-user of success
    ;; So it can decrease ongoing liquidation count
    int success_message_fee =
    modest_fwd_fee_estimation(fwd_fee) + fee::liquidate_success;

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

    msg_value -= success_message_fee;
    msg_value -= fee::log_tx;

    cell log_data = begin_cell()
      .store_uint(log::liquidate_success, 8) ;; withdraw code
      .store_slice(owner_address) ;; user addr
      .store_slice(sender_address) ;; user sc addr
      .store_slice(liquidator_address) ;; liquidator addr
      .store_uint(now(), 32) ;; current time
      .store_ref(begin_cell() ;; attached supply asset data
        .store_uint(transferred_asset_id, 256)
        .store_uint(transferred_amount, 64)
        .store_int(new_user_loan_principal, 64)
        .store_int(loan_new_total_supply, 64)
        .store_int(loan_new_total_borrow, 64)
        .store_uint(loan_s_rate, 64)
        .store_uint(loan_b_rate, 64)
        .end_cell())
      .store_ref(begin_cell() ;; attached redeemed asset data
        .store_uint(collateral_asset_id, 256)
        .store_uint(collateral_reward, 64)
        .store_int(new_user_collateral_principal, 64)
        .store_int(new_collateral_total_supply, 64)
        .store_int(new_collateral_total_borrow, 64)
        .store_uint(collateral_s_rate, 64)
        .store_uint(collateral_b_rate, 64)
        .end_cell())
      .end_cell();

    emit_log_simple(log_data);

    if (collateral_asset_id == constants::ton_asset_id){
      raw_reserve(my_balance - collateral_reward - msg_value, reserve::REGULAR);
    } else {
      raw_reserve(0, 4);
    }

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
  } else {
    ;; Not enough liquidity - revert
    ;; ???? It strict rejects
    ;; but *maybe* it should allow transactions where 
    ;; collateral_liquidity >= min_collateral_amount

    ;; Notify lending-user of fail
    ;; So it can revert liquidation changes
    ;; and unlock itself
    int fail_message_fee =
      modest_fwd_fee_estimation(fwd_fee) + fee::liquidate_fail;

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

    msg_value -= fail_message_fee;

    if (transferred_asset_id == constants::ton_asset_id){
      raw_reserve(my_balance - transferred_amount - msg_value, reserve::REGULAR);
    } else {
      raw_reserve(0, 4);
    }

    ;; Refund asset
    (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(transferred_asset_id);
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
  }
  return ();
}

() liquidate_satisfied_handle_exception (
  int my_balance, int msg_value, slice in_msg_body, slice sender_address, int fwd_fee,
  cell upgrade_config, cell asset_config_collection, int query_id
) impure inline {
  ;; There might be some duplicated code from above, but this is an exception handler
  ;; Therefore, it should have distinct code, and merging it into some common function may have
  ;;   unintended side effects in the future

  var (
    _, liquidator_address, transferred_asset_id, delta_loan_principal, liquidatable_amount,
    protocol_gift, _, collateral_asset_id, delta_collateral_principal, _, _, _, forward_ton_amount, custom_response_payload
  ) = parse_liquidate_satisfied_message(in_msg_body);

  int user_version = upgrade_config.upgrade_config:user_code_version();

  int fail_message_fee = modest_fwd_fee_estimation(fwd_fee) + fee::liquidate_fail;

  int transferred_amount = liquidatable_amount + protocol_gift;

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

  msg_value -= fail_message_fee;

  if (transferred_asset_id == constants::ton_asset_id){
    raw_reserve(my_balance - transferred_amount - msg_value, reserve::REGULAR);
  } else {
    raw_reserve(0, 4);
  }

  ;; Refund asset
  (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _)
    = asset_config_collection.asset_config_collection:get_unpacked(transferred_asset_id);

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
}

() liquidate_master_jetton_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int jetton_op_code, int query_id, int jetton_amount, slice from_address, int user_version, cell user_code ;; jetton tx body params
) impure inline {
  (slice borrower_address, slice liquidator_address, int collateral_asset_id, int min_collateral_amount, _, int include_user_code, int forward_ton_amount, cell custom_response_payload, cell prices_packed) = parse_liquidate_master_message(in_msg_body);
  (slice token_id, int found) = tokens_keys.udict_get?(256, addr_hash);

  ifnot(is_valid_custom_response_payload?(custom_response_payload)) {
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
      begin_cell().store_op_code(error::custom_response_payload_too_big).end_cell(), forward_ton_amount
    );
    return ();
  }

  int addresses_are_valid = is_valid_address?(borrower_address) & is_valid_address?(liquidator_address);
  ifnot (addresses_are_valid) {
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
      begin_cell().store_op_code(error::invalid_address_provided).store_ref(custom_response_payload).end_cell(), forward_ton_amount
    );
    return ();
  }

  int prices_error_code = prices_packed~prices_packed:error(oracles_info);
  if (prices_error_code) { ;; non-zero codes are errors
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
      begin_cell().store_op_code(prices_error_code).store_ref(custom_response_payload).end_cell(), forward_ton_amount
    );
    return ();
  }

  int transferred_asset_id = token_id~load_asset_id();
  if (collateral_asset_id == transferred_asset_id) {
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
      begin_cell().store_op_code(error::invalid_data).store_ref(custom_response_payload).end_cell(), forward_ton_amount
    );
    return ();
  }

  asset_dynamics_collection = liquidate_jetton(
    user_version, include_user_code ? user_code : null(), query_id,
    asset_config_collection, asset_dynamics_collection,
    msg_value, fwd_fee,
    borrower_address,
    collateral_asset_id, min_collateral_amount,
    liquidator_address, ;; address of whoever sent jettons - that's gonna be liquidator
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
  return ();
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/master-other.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../logic/tx-utils.fc";
#include "../constants/op-codes.fc";

() get_store_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
    cell ds = get_data();
    cell in_msg_body_data = in_msg_body~load_ref();
    in_msg_body.end_parse();

    send_message(
        sender_address,
        0,
        begin_cell()
            .store_op_code(op::get_store_response)
            .store_query_id(query_id)
            .store_ref(in_msg_body_data)
            .store_ref(ds)
            .end_cell(),
        sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );
    return ();
}

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
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  slice owner_address = in_msg_body~load_msg_addr();

  ;; Verify this is a message from lending-user smart contract
  throw_unless(
    error::revert_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
    )
  );

  slice revert_body = in_msg_body.preload_ref().begin_parse();

  (int user_code_version, cell upgrade_info_cell,
   int upgrade_exec
  ) = revert_body~user::upgrade::load_header();

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

  int revert_op = revert_body~load_op_code();
  int revert_query_id = revert_body~load_query_id();

  if (revert_op == op::supply_user) {
    ;; As this has to do with supply refund,
    ;; the code is very similar to op::supply_fail
    ;; except that the authenticity check had already been made
    (int asset_id, int supply_amount_current, int s_rate, int b_rate, _, _, _, _, _, _, _, _) = parse_supply_user_message(revert_body);

    (int s_rate, int b_rate,
      int total_supply_principal, int total_borrow_principal,
      int last_accrual, int token_balance,
      int tracking_supply_index, int tracking_borrow_index,
      int awaited_supply
    ) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

    int new_awaited_supply = awaited_supply - supply_amount_current;

    asset_dynamics_collection~asset_dynamics_collection:set_packed(
      asset_id,
      s_rate, b_rate,
      total_supply_principal, total_borrow_principal,
      last_accrual, token_balance,
      tracking_supply_index, tracking_borrow_index,
      new_awaited_supply
    );

    msg_value -= fee::revert_call;

    (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);
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

    return ();
  }

  if (revert_op == op::withdraw_user) {
    ;; No assets are attached with request for Withdraw
    ;; => It's enough to only refund attached (for network fees) TONs
    ;; (no need to parse message)
    send_message(
      owner_address,
      0,
      null(), ;; todo: !! Need to send some kind of info to the Owner?
      sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );

    return ();
  }

  if (revert_op == op::liquidate_user) {
    ;; As this has to do with liquidate refund,
    ;; the code is very similar to op::liquidate_unsatisfied
    ;; except that the authenticity check had already been made
    (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed,
     int collateral_asset_id, int min_collateral_amount,
     slice liquidator_address,
     int transferred_asset_id, int transferred_amount,
     int forward_ton_amount, cell custom_response_payload
     )
      = parse_liquidate_user_message(revert_body);

    msg_value -= fee::revert_call;

    (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(transferred_asset_id);
    send_asset(
      liquidator_address, revert_query_id,
      jw_address_hash, transferred_amount,
      msg_value
      ;; todo: !! Need to send some kind of info to the Owner?
    );

    return ();
  }

  if (revert_op == op::idle_user) {
    ;; It's enough to only refund attached (for network fees) TONs
    ;; It is very tempting to just reuse the code for the revert of op::withdraw_user,
    ;; but in this case we need to refund to the Originator (who can be either Owner or Admin)
    ;; It doesn't matter too much, because of the little amount in question,
    ;; but let's do it properly
    (cell tokens_keys, slice originator_address) = parse_idle_user_message(revert_body);

    send_message(
      originator_address,
      0,
      null(), ;; todo: !! Need to send some kind of info to the Originator?
      sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );

    return ();
  }

  throw(error::we_screwed_up_revert);
  ;; Code really shouldn't reach here
  ;; The only possible messages/requests to revert are the incoming requests
  ;; (Supply, Withdraw, Liquidate)
  ;; Intermediate requests (e.g. op::withdraw_success) are not possible to revert,
  ;; because by that point the asset had already been sent
}

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

cell master_core_logic_supply_asset_unchecked(
  int query_id, int user_version, cell user_code,
  cell asset_config_collection, cell asset_dynamics_collection,
  int asset_id, slice owner_address, int amount,
  int message_send_mode, int forward_ton_amount, cell custom_response_payload,
  int fwd_fee, int msg_value_for_fee_check
) impure {
  ;; Update tracking indexes
  (_, _, _, _, _, _, _, _, _, _, _, _, int dust, int max_token_amount, _, _, _, _, _
  ) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

  asset_dynamics_collection~update_old_rates_and_provided_asset_id(
    asset_config_collection, asset_id, 0
  );

  (
    int s_rate, int b_rate,
    int total_supply_principal, int total_borrow_principal,
    int last_accrual, int token_balance,
    int tracking_supply_index, int tracking_borrow_index,
    int awaited_supply
  ) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

  int total_supply_principal_with_awaited_supply =
    total_supply_principal + principal_value_supply_calc(s_rate, awaited_supply);

  cell supply_user_message = pack_supply_user_message(
      query_id,
      asset_id, amount,
      s_rate, b_rate,
      dust, max_token_amount,
      total_supply_principal_with_awaited_supply, total_borrow_principal,
      tracking_supply_index, tracking_borrow_index,
      forward_ton_amount, custom_response_payload
    );

  int awaited_supply_with_incoming_amount = awaited_supply + amount;

  int enough_fee = supply_min_attachment(fwd_fee, supply_user_message) + forward_ton_amount;

  throw_unless(
    error::incoming_asset_transaction_fees,
    msg_value_for_fee_check > enough_fee
  );

  asset_dynamics_collection~asset_dynamics_collection:set_packed(
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

  return asset_dynamics_collection;
}

cell supply_jetton(
  int query_id, int user_version, cell user_code,
  cell asset_config_collection, cell asset_dynamics_collection,
  int msg_value, int fwd_fee,
  int asset_id, slice owner_address, int amount, int forward_ton_amount, cell custom_response_payload
) impure inline {
  return master_core_logic_supply_asset_unchecked(
    query_id, user_version, user_code,
    asset_config_collection, asset_dynamics_collection,
    asset_id, owner_address, amount, 64, forward_ton_amount, custom_response_payload,
    fwd_fee, msg_value + 1 ;; offset by 1 because inside comparison is strict
  );
}

() supply_master_jetton_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int jetton_op_code, int query_id, int jetton_amount, slice from_address, int user_version, cell user_code ;; jetton tx body params
) impure inline {
  int include_user_code = in_msg_body~load_bool_ext();
  (slice token_id, int found) = tokens_keys.udict_get?(256, addr_hash);
  slice recipient_address = in_msg_body~load_msg_addr();
	int forward_ton_amount = in_msg_body~load_amount();
  cell custom_response_payload = in_msg_body~load_ref();
  in_msg_body.end_parse();

  ifnot (is_valid_address?(recipient_address)) {
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
      begin_cell().store_op_code(error::invalid_address_provided).end_cell(), 0
    );
    return ();
  }

  ifnot (is_valid_custom_response_payload?(custom_response_payload)) {
    respond_send_jetton(
      sender_address, from_address,
      query_id, jetton_amount,
      begin_cell().store_op_code(error::custom_response_payload_too_big).end_cell(), 0
    );
    return ();
  }

  asset_dynamics_collection = supply_jetton(
    query_id, user_version, include_user_code ? user_code : null(),
    asset_config_collection, asset_dynamics_collection,
    msg_value, fwd_fee,
    token_id~load_asset_id(), ;; jetton_master_address, <- I am not sure we want this transformation anymore
    recipient_address, jetton_amount, forward_ton_amount, custom_response_payload
  );
  master::storage::save(
    meta, upgrade_config,
    asset_config_collection, 
    if_active, oracles_info, admin, tokens_keys,
    asset_dynamics_collection
  );
  return ();
}

cell supply_ton(
  int query_id, int user_version, cell user_code,
  cell asset_config_collection, cell asset_dynamics_collection,
  int msg_value, int supply_amount, int fwd_fee,
  slice owner_address, int forward_ton_amount, cell custom_response_payload
) impure inline {
  ;; Withhold some amount of TONs for blockchain fees
  raw_reserve(supply_amount, reserve::AT_MOST + 2);
  return master_core_logic_supply_asset_unchecked(
    query_id, user_version, user_code,
    asset_config_collection, asset_dynamics_collection,
    constants::ton_asset_id, owner_address, supply_amount,
    sendmode::CARRY_ALL_BALANCE, ;; <- in combination with raw_reserve with mode=4
    ;;^ should resend the whole value of the original message minus "amount" and fees
    forward_ton_amount, custom_response_payload,
    fwd_fee, msg_value - supply_amount
  );
}

() supply_master_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  (
    _, int user_version, _, _, _, cell user_code, _, _
  ) = upgrade_config.unpack_upgrade_config();
  int include_user_code = in_msg_body~load_bool_ext(); ;; bool

  int supply_amount = in_msg_body~load_amount();
  slice recipient_address = in_msg_body~load_msg_addr();
	int forward_ton_amount = in_msg_body~load_amount();
  cell custom_response_payload = in_msg_body~load_ref();
  in_msg_body.end_parse();

  throw_unless(error::invalid_address_provided, is_valid_address?(recipient_address));
  throw_unless(error::custom_response_payload_too_big, is_valid_custom_response_payload?(custom_response_payload));

  asset_dynamics_collection = supply_ton(
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
  return ();
}

() supply_success_process (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  (slice owner_address, ;; add new user principal to log
    int asset_id, int amount_supplied, int user_new_principal,
    int repay_amount_principal, int supply_amount_principal, cell custom_response_payload) = parse_supply_success_message(in_msg_body);

  ;; Verify this is a message from lending-user smart contract

  throw_unless(
    error::supply_success_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
    )
  );

  (int s_rate, int b_rate,
   int total_supply_principal, int total_borrow_principal,
   int last_accrual, int token_balance,
   int tracking_supply_index, int tracking_borrow_index,
   int awaited_supply
  ) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

  int new_total_supply = total_supply_principal + supply_amount_principal;
  int new_total_borrow = total_borrow_principal - repay_amount_principal;

  int new_awaited_supply = awaited_supply - amount_supplied;

  asset_dynamics_collection~asset_dynamics_collection:set_packed(
    asset_id,
    s_rate, b_rate,
    new_total_supply,
    new_total_borrow,
    last_accrual,
    token_balance + amount_supplied, ;; update asset balance
    ;; ^ We couldn't update it when receiving Supply,
    ;; because there is no guarantee it would succeed
    tracking_supply_index, tracking_borrow_index,
    new_awaited_supply
  );
  
  cell log_data = begin_cell()
    .store_uint(log::supply_success, 8) ;; supply code
    .store_slice(owner_address) ;; user addr
    .store_slice(sender_address) ;; user sc addr
    .store_uint(now(), 32) ;; current time
    .store_ref(begin_cell() ;; attached asset data
      .store_uint(asset_id, 256) 
      .store_uint(amount_supplied, 64) 
      .store_int(user_new_principal, 64) 
      .store_int(new_total_supply, 64) 
      .store_int(new_total_borrow, 64) 
      .store_uint(s_rate, 64) 
      .store_uint(b_rate, 64) 
      .end_cell())
    .store_ref(begin_cell().end_cell()) ;; redeemed asset data (nothic cause its supply)
    .end_cell();

    emit_log_simple(log_data);

    ;; deducting fee::log_tx is NOT neccessary because raw_reserve mode 4 accounts for action phase
    ;;   (including logs - external out messages) fees

    raw_reserve(0, 4);

  cell body = pack_supply_success_excess_message();
  slice custom_response_payload_open = custom_response_payload.begin_parse();
  ifnot (custom_response_payload_open.slice_empty?()) {
    body = pack_supply_excess_message_with_data(query_id, custom_response_payload);
  }

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
  return ();
}

() supply_fail_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  var (owner_address, transferred_asset_id, transferred_amount, forward_ton_amount, custom_response_payload) = parse_supply_fail_message(in_msg_body);

  ;; Verify this is a message from lending-user smart contract
  
  throw_unless(
    error::supply_fail_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
    )
  );
  
  (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(transferred_asset_id);

  (int s_rate, int b_rate,
    int total_supply_principal, int total_borrow_principal,
    int last_accrual, int token_balance,
    int tracking_supply_index, int tracking_borrow_index,
    int awaited_supply
  ) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(transferred_asset_id);

  int new_awaited_supply = awaited_supply - transferred_amount;

  asset_dynamics_collection~asset_dynamics_collection:set_packed(
    transferred_asset_id,
    s_rate, b_rate,
    total_supply_principal, total_borrow_principal,
    last_accrual, token_balance,
    tracking_supply_index, tracking_borrow_index,
    new_awaited_supply
  );

  int supply_fail_fees = modest_fwd_fee_estimation(fwd_fee) + fee::supply_fail;

  msg_value -= supply_fail_fees;

  if (transferred_asset_id == constants::ton_asset_id) {
    raw_reserve(my_balance - transferred_amount - msg_value, reserve::REGULAR);
  } else {
    raw_reserve(0, 4);
  }
  
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

  return ();
}


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

cell master_core_logic_withdraw (
  int user_version, cell user_code,
  cell asset_config_collection, cell asset_dynamics_collection,
  int msg_value, int fwd_fee,
  slice owner_address, int asset_id, int amount, int query_id, cell prices_packed, slice recipient_address,
  int forward_ton_amount, cell custom_response_payload
) impure {
  asset_dynamics_collection~update_old_rates_and_provided_asset_id(
    asset_config_collection,  asset_id, 0
  );

  (int s_rate, int b_rate, _, _, _, _, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

  cell withdraw_user_message = pack_withdraw_user_message(
    query_id,
    asset_id, amount,
    s_rate, b_rate,
    asset_config_collection, asset_dynamics_collection, prices_packed, recipient_address,
    forward_ton_amount, custom_response_payload
  );

  int enough_fee = withdraw_min_attachment(fwd_fee, withdraw_user_message) + forward_ton_amount;
  throw_unless(
    error::withdraw_master_transaction_fees,
    msg_value >= enough_fee
  );

  send_message_to_lending_wallet(
    BLANK_CODE(), user_version, user_code, owner_address,
    withdraw_user_message, sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
  );

  return asset_dynamics_collection;
}

() withdraw_master_process (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  (int asset_id, int amount, slice recipient_address, int include_user_code, cell prices_packed, int forward_ton_amount, cell custom_response_payload) = parse_withdraw_master_message(in_msg_body);

  throw_unless(error::invalid_address_provided, is_valid_address?(recipient_address));
  throw_unless(error::custom_response_payload_too_big, is_valid_custom_response_payload?(custom_response_payload));

  if (~ prices_packed.null?()) {
    int prices_error_code = prices_packed~prices_packed:error(oracles_info);
    throw_if(prices_error_code, prices_error_code); ;; non-zero codes throw
  }
  
  (_, int user_version, _, _, _, cell user_code, _, _) = upgrade_config.unpack_upgrade_config();
  
  asset_dynamics_collection = master_core_logic_withdraw(
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
  return ();
}

() withdraw_collateralized_process  (
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; recv_internal params
  slice sender_address, int addr_hash, int fwd_fee, ;; in_msg_full params
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection, ;; storage params
  int op, int query_id ;; trx body
) impure inline {
  (slice owner_address, int asset_id, int withdraw_amount_current, int user_new_principal,
    int borrow_amount_principal, int reclaim_amount_principal, slice recipient_address, int forward_ton_amount, cell custom_response_payload)
    = parse_withdraw_collateralized_message(in_msg_body);

  ;; Verify this is a message from lending-user smart contract
  
  int user_version = upgrade_config.upgrade_config:user_code_version();
  throw_unless(
    error::withdraw_collateralized_fake_sender,
    slice_data_equal?(
      sender_address,
      calculate_user_address(BLANK_CODE(), owner_address)
    )
  );

  (int s_rate, int b_rate,
   int total_supply_principal, int total_borrow_principal,
   int last_accrual, int token_balance, int tracking_supply_index, int tracking_borrow_index,
   int awaited_supply
  )
    = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

  int asset_liquidity_minus_reserves = get_asset_liquidity_minus_reserves(
    total_supply_principal, total_borrow_principal,
    s_rate, b_rate, token_balance
  );

  int asset_liquidity = token_balance;
  int borrow_amount_present = present_value_borrow_calc(b_rate, borrow_amount_principal);

  ;; Above is the more sofisticated formula from Vlad and below is the corresponding check:
  ;; it accounts for developer's money, and doesn't allow to withdraw using devs' funds
  ;; My original (intuitive) check was: withdraw_amount_current > token_balance
  if ((withdraw_amount_current > asset_liquidity) | (borrow_amount_present > asset_liquidity_minus_reserves)) {
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
        borrow_amount_principal + reclaim_amount_principal
      ), sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );

    ;; Consider refund fee excesses
    ;; Added: I thought all refunding had been already done
    ;; More added: yes, it was done, the fee-refund happens on User at op::withdraw_fail
  } else {
    ;; User withdraw request is collateralized
    ;; and we HAVE enough of asset to satisfy it
    int new_total_supply = total_supply_principal - reclaim_amount_principal;
    int new_total_borrow = total_borrow_principal + borrow_amount_principal;

    (int jw_address_hash, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _
    ) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

    asset_dynamics_collection~asset_dynamics_collection:set_packed(
      asset_id,
      s_rate, b_rate,
      new_total_supply, new_total_borrow,
      last_accrual, token_balance - withdraw_amount_current,
      tracking_supply_index, tracking_borrow_index,
      awaited_supply
    );

    ;; msg_value -= fee::withdraw_collateralized;

    int success_message_fee =
      modest_fwd_fee_estimation(fwd_fee) + fee::withdraw_success;
    msg_value -= success_message_fee;
    msg_value -= fee::log_tx;

    ;; We also need to send op::withdraw_success message to the user smart contract
    ;; to let it unlock itself

    send_message_to_lending_wallet_by_address(
      null(), success_message_fee, ;; state_init don't need
      user_version, null(), ;; null upgrade_info
      sender_address, pack_withdraw_success_message(
        query_id, asset_id, borrow_amount_principal + reclaim_amount_principal,
        tracking_supply_index, tracking_borrow_index
      ), sendmode::REGULAR
    );
  
    cell log_data = begin_cell()
      .store_uint(log::withdraw_success, 8) ;; withdraw code
      .store_slice(owner_address) ;; user addr
      .store_slice(sender_address) ;; user sc addr
      .store_slice(recipient_address) ;; recipient_address 
      .store_uint(now(), 32) ;; current time
      .store_ref(begin_cell().end_cell()) ;; supply asset data (nothic cause its withdraw)
      .store_ref(begin_cell() ;; attached redeemed asset data
        .store_uint(asset_id, 256) 
        .store_uint(withdraw_amount_current, 64) 
        .store_int(user_new_principal, 64) 
        .store_int(new_total_supply, 64) 
        .store_int(new_total_borrow, 64) 
        .store_uint(s_rate, 64) 
        .store_uint(b_rate, 64) 
        .end_cell())
      .end_cell();

    emit_log_simple(log_data);

    if (asset_id == constants::ton_asset_id){
      ;; N.B. forward_ton_amount is contained in msg_value, because it is enforced in enough_fee
      raw_reserve(my_balance - withdraw_amount_current - msg_value, reserve::REGULAR);
    } else {
      raw_reserve(0, 4);
    }

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
  }
  ;; We only accept op::withdraw_collateralized from lending-user smart contracts,
  ;; which means the corresponding lending-user smart contract
  ;; had already been initialized by the point we received this message,
  ;; which means it's fine not to include deploy info (state-init) in the message
  ;; and just use send_message (instead of send_message_to_lending_wallet)
  ;; to have a lighter message
  return ();
}

() withdraw_collateralized_handle_exception  (
  slice in_msg_body, slice sender_address, cell upgrade_config, int query_id
) impure inline {
  (_, int asset_id, _, _, int borrow_amount_principal, int reclaim_amount_principal, _, _, _)
    = parse_withdraw_collateralized_message(in_msg_body);

  int user_version = upgrade_config.upgrade_config:user_code_version();

  send_message_to_lending_wallet_by_address(
    null(), 0, ;; state_init don't need
    user_version, null(), ;; null upgrade_info
    sender_address, pack_withdraw_fail_message(
      query_id, asset_id,
      borrow_amount_principal + reclaim_amount_principal
    ), sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
  );
}

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
  slice sender_address, slice in_msg_body_original, int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; handle_transaction params
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, ;; user storage params
  int op, int query_id ;; tx body params
) impure inline {
  cell new_principals = in_msg_body~load_dict();
  user::storage::save(code_version, master_address, owner_address, new_principals, state,   user_rewards, backup_cell_1, backup_cell_2);
  return ();
}

() idle_user_process (
  slice sender_address, slice in_msg_body_original, int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; handle_transaction params
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, ;; user storage params
  int op, int query_id ;; tx body params
) impure inline {
  ;; Nothing happens here
  ;; this op code is added just for upgrade without executing anything
  (cell tokens_keys, slice originator_address) = parse_idle_user_message(in_msg_body);
  ;; The only reason we even need originator_address
  ;; is to refund remaining TONs, but even that is optional

  send_message(
    originator_address, 0,
    pack_idle_excess_message(query_id),
    sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE + 2 ;; +2 - Ignore errors of sending
    ;; In case there aren't enough TONs to send the message,
    ;; it doesn't matter - the main thing is contract upgrade
  );
  return ();
}

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
  slice sender_address, slice in_msg_body_original, int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; handle_transaction params
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, ;; user storage params
  int op, int query_id ;; tx body params
) impure inline {
  (
    int transferred_asset_id,
    int delta_loan_principal,
    int loan_tracking_supply_index, int loan_tracking_borrow_index,
    int collateral_asset_id,
    int delta_collateral_principal,
    int collateral_tracking_supply_index, int collateral_tracking_borrow_index
  ) = parse_liquidate_success_message(in_msg_body);

  {
    int new_principal = user_principals.get_principal(collateral_asset_id);
    int old_principal = new_principal + delta_collateral_principal;

    (int base_tracking_index, int base_tracking_accrued) = user_rewards.get_reward(collateral_asset_id);

    (base_tracking_index, base_tracking_accrued) = accrue_user_indexes(base_tracking_index, base_tracking_accrued, collateral_tracking_supply_index, collateral_tracking_borrow_index, old_principal, new_principal);

    user_rewards~set_reward(collateral_asset_id, base_tracking_index, base_tracking_accrued);
  }

  {
    int new_principal = user_principals.get_principal(transferred_asset_id);
    int old_principal = new_principal + delta_loan_principal;

    (int base_tracking_index, int base_tracking_accrued) = user_rewards.get_reward(transferred_asset_id);

    (base_tracking_index, base_tracking_accrued) = accrue_user_indexes(base_tracking_index, base_tracking_accrued, loan_tracking_supply_index, loan_tracking_borrow_index, old_principal, new_principal);

    user_rewards~set_reward(transferred_asset_id, base_tracking_index, base_tracking_accrued);
  }
   
  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address, 
    pack_liquidate_excess_message(
      op::liquidate_success_report_to_user,
      query_id
    )
  );

  user::storage::save(
    code_version,
    master_address, owner_address,
    user_principals, state - 1, ;; Decrease ongoing liquidation count
    user_rewards, backup_cell_1, backup_cell_2
  );
  return ();
}

() liquidate_success_handle_exception (
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, int query_id
) impure inline {
  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address,
    pack_liquidate_excess_message(
      op::liquidate_success_report_to_user,
      query_id
    )
  );

  user::storage::save(
    code_version,
    master_address, owner_address,
    user_principals, state - 1, ;; Decrease ongoing liquidation count
    user_rewards, backup_cell_1, backup_cell_2
  );
  return ();
}

() liquidate_fail_process(
  slice sender_address, slice in_msg_body_original, int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; handle_transaction params
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, ;; user storage params
  int op, int query_id ;; tx body params
) impure inline {
  (
    int transferred_asset_id,
    int delta_loan_principal, ;; liquidatable_amount, protocol_gift, <- not relevant
    int collateral_asset_id,
    int delta_collateral_principal ;; collateral_reward <- not relevant
    ;; debug info:
    ;; , min_collateral_amount, collateral_present  <- not relevant
  ) = parse_liquidate_fail_message(in_msg_body);
  ;; liquidation failed - revert
  int optimistic_collateral_principal = user_principals.get_principal(collateral_asset_id);
  int reverted_collateral_principal = optimistic_collateral_principal + delta_collateral_principal; 
  user_principals~set_principal(collateral_asset_id, reverted_collateral_principal);

  int optimistic_loan_principal = user_principals.get_principal(transferred_asset_id);
  int reverted_loan_principal = optimistic_loan_principal + delta_loan_principal; 
  user_principals~set_principal(transferred_asset_id, reverted_loan_principal);
  ;; Unlike op::withdraw_fail, we don't refund TON attachment to the owner here
  ;; because it is handled while refunding liquidation- (transferred-) asset on the master
  ;; Update user_principals and liquidation count
  user::storage::save(
    code_version,
    master_address, owner_address,
    user_principals, state - 1, ;; Decrease ongoing liquidation count
    user_rewards, backup_cell_1, backup_cell_2
  ); 
  return ();
}


() liquidate_user_process(
  slice sender_address, slice in_msg_body_original, int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; handle_transaction params
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, ;; user storage params
  int op, int query_id ;; tx body params
) impure inline {
  (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed,
   int collateral_asset_id, int min_collateral_amount,
   slice liquidator_address,
   int transferred_asset_id, int transferred_amount,
   int forward_ton_amount, cell custom_response_payload
   )
   = parse_liquidate_user_message(in_msg_body);
  
  if (state < 0) {
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
      )
    );
    return ();
  }
  
  ;; ----- Check is liquidatable and if all neccessary prices are supplied -----
  (int liquidatable, int enough_price_data, int supply_amount, int borrow_amount) =
    is_liquidatable(asset_config_collection, asset_dynamics_collection, user_principals, prices_packed);
  ifnot (liquidatable) {
    ;; if prices_ok is false, liquidatable is also false
    builder message = enough_price_data
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
      )
    );
    return (); 
  }

  ;; ----- Check enough loan -----
  (int loan_s_rate, int loan_b_rate, _, _, _, _, _, _, _)
    = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(transferred_asset_id);
  int loan_principal = user_principals.get_principal(transferred_asset_id);
  int loan_present = - present_value(loan_s_rate, loan_b_rate, loan_principal);

  (_, _, _, _, int liquidation_bonus, _, _, _, _, _, _, _, _, _, _, int liquidation_reserve_factor, _, _, _) =
    asset_config_collection.asset_config_collection:get_unpacked(collateral_asset_id);

  int transferred_amount_minus_reserve = muldiv(transferred_amount, (constants::reserve_liquidation_scale - liquidation_reserve_factor), constants::reserve_liquidation_scale);

  int liquidatable_amount = min(transferred_amount_minus_reserve, loan_present);
  ;; ^ Can't liquidate more than the current loan
  ;; loan_present can be < 0, in case there is no loan on this position
  ;; this is not a problem because subsequent call to get_collateral_quote will return a negative amount
  ;; and the subsequent check that this amount satisfies min_collateral_amount will fail
  ;; transferred_amount is still used further in the code though, because in case of liquidation failure we need to refund the full transferred_amount

  ;; ---- Check min_collateral_amount satisfied ----
  (int collateral_amount, enough_price_data) = get_collateral_quote(
    asset_config_collection,
    transferred_asset_id, liquidatable_amount,
    collateral_asset_id, prices_packed
    ;; collateralization ;; liquidation_bonus <- There was an idea to calculate it dynamically
  );
  ;; min_collateral_amount is uint, and therefore is always >= 0
  ;;
  if (collateral_amount < min_collateral_amount) {
    ;; if not enough price data, collateral_amount will be -1
    builder message = enough_price_data
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
      )
    );
    return (); 
  }

  ;; ----- Check enough collateral -----
  (int collateral_s_rate, int collateral_b_rate, _, _, _, _, _, _, _)
    = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(collateral_asset_id);
  int collateral_principal = user_principals.get_principal(collateral_asset_id);
  int collateral_present = present_value(collateral_s_rate, collateral_b_rate, collateral_principal);

  if (collateral_present < min_collateral_amount) {
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
      )
    );
    return (); 
  }

  int collateral_reward = min(
    collateral_amount,
    collateral_present ;; Not rewarding more of asset then there is on user's balance
  );

  int isBadDebt = borrow_amount != 0
    ? (supply_amount * constants::asset_coefficient_scale / borrow_amount) < liquidation_bonus
    : false;

  ifnot (isBadDebt) {
    ;; ----- Check not liquidating too much -----
    int max_not_too_much = muldiv(collateral_present, 1, 2);
    {
      ;; Below certain value ($100?) should be liquidatable entirely:
      int collateral_decimals = asset_config_collection.asset_config_collection:decimals(collateral_asset_id);
      ;; get_collateral_quote higher in code checks that collateral_asset_id price is present
      int collateral_price = prices_packed.prices_packed:get(collateral_asset_id);

      int usd_allowed_liquidation = 100;
      ;; atomic_amount = usd_allowed_liquidation / price_per_atomic
      ;; atomic_amount = usd_allowed_liquidation / (price_per_unit / fast_dec_pow(collateral_decimals))
      ;; atomic_amount = usd_allowed_liquidation / ((collateral_price / constants::price_scale) / fast_dec_pow(collateral_decimals))
      ;; atomic_amount = usd_allowed_liquidation * constants::price_scale * fast_dec_pow(collateral_decimals) / collateral_price;
      int max_not_too_much_fixed = collateral_price != 0
        ? usd_allowed_liquidation * constants::price_scale * fast_dec_pow(collateral_decimals) / collateral_price
        : max_not_too_much;
      if (max_not_too_much_fixed > max_not_too_much) {
        max_not_too_much = max_not_too_much_fixed;
      }
      ;; Note that throughout the rest of the code, constants::price_scale doesn't really matter:
      ;; Withdraw and Liquidate are relative: we could multiply all prices by the same amount and nothing would change
      ;; (well, as long as division errors and storage bit-restrictions don't come into play)
      ;; This is the *only* place were we operate with the absolute value of some asset (equivalent of $100)
      ;; instead of operating relative to other assets (like everywhere else)
    }
    ;; Essentially, max_not_too_much = max(collateral_present*50%, $100 / exchange_rate)
    ;; NOTE: !!!! ^ 50% and $100 - very arbitrary
    if (max_not_too_much < min_collateral_amount) {
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
        )
      );
      return ();
    }

    collateral_reward = min(
      collateral_reward,
      max_not_too_much ;; And no more than would be too much
    );
  }
  
  collateral_present -= collateral_reward;
  loan_present -= liquidatable_amount;
  int new_loan_principal = principal_value(loan_s_rate, loan_b_rate, - loan_present);
  int new_collateral_principal = principal_value(collateral_s_rate, collateral_b_rate, collateral_present);
  ;; NOTE: ^ It is well known which sign (collateral - positive and loan - negative) these values have,
  ;; so might as well use more direct function to calculate present_value to save some gas

  ;; int delta_loan_principal = new_loan_principal - loan_principal; ;; loan principals are negative => reverse subtraction order <- Wrong
  int delta_loan_principal = loan_principal - new_loan_principal; ;; How much (a)Loan (b)Decreased is loan_old-loan_new
  int delta_collateral_principal = collateral_principal - new_collateral_principal;
  int protocol_gift = transferred_amount - liquidatable_amount; ;; ??? Free assets for the protocol
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
    )
  );
  user_principals~set_principal(collateral_asset_id, new_collateral_principal);
  user_principals~set_principal(transferred_asset_id, new_loan_principal);
  user::storage::save(
    code_version,
    master_address, owner_address,
    user_principals,
    state + 1, ;; Increase ongoing liquidation count
     user_rewards, backup_cell_1, backup_cell_2
  );
  return ();
}

() liquidate_user_handle_exception(
  slice in_msg_body, slice master_address, slice owner_address, int query_id
) impure inline {
  (_, _, _,
    int collateral_asset_id, int min_collateral_amount,
    slice liquidator_address,
    int transferred_asset_id, int transferred_amount,
    int forward_ton_amount, cell custom_response_payload
    )
  = parse_liquidate_user_message(in_msg_body);

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
    )
  );
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/core/user-other.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../logic/tx-utils.fc";
#include "../constants/op-codes.fc";

() get_store_process (
  int query_id, cell in_msg_body, slice sender_address
) impure inline {
  cell ds = get_data();

  send_message(
    sender_address,
    0,
    begin_cell()
      .store_op_code(op::get_store_response)
      .store_query_id(query_id)
      .store_ref(in_msg_body)
      .store_ref(ds)
    .end_cell(),
    sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
  );

  return ();
}

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
  slice sender_address, slice in_msg_body_original, int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; handle_transaction params
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, ;; user storage params
  int op, int query_id ;; tx body params
) impure inline {
  (int asset_id, int supply_amount_current,
    int s_rate, int b_rate,
    int dust, int max_token_amount,
    int total_supply, int total_borrow,
    int tracking_supply_index, int tracking_borrow_index,
    int forward_ton_amount, cell custom_response_payload) = parse_supply_user_message(in_msg_body);
  
  ;; state check
  if (state != user_state::free) {
    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_supply_fail_message(
        query_id, owner_address,
        asset_id, supply_amount_current,
        forward_ton_amount, custom_response_payload
      )
    );
    return ();
  }

  ;; ???? What if Supply happens during liquidation?
  ;; What to do with received funds?

  ;; set new principal
  int old_principal = user_principals.get_principal(asset_id);
  int present = present_value(s_rate, b_rate, old_principal);
  present += supply_amount_current;
  int new_principal = principal_value(s_rate, b_rate, present);
  
  if ((new_principal < dust) & (new_principal > 0)) { 
    new_principal = 0;
  }

  (int repay_amount_principal,
   int supply_amount_principal) = around_zero_split(old_principal, new_principal);

  int new_total_supply = total_supply + supply_amount_principal;
  int new_total_borrow = total_borrow - repay_amount_principal;

  ;; max cap check and negative new total borrow check
  if (((new_total_supply > max_token_amount) & (max_token_amount != 0) & (supply_amount_principal > 0)) | (new_total_borrow < 0)) {
    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_supply_fail_message(
        query_id, owner_address,
        asset_id, supply_amount_current,
        forward_ton_amount, custom_response_payload
      )
    );
    return ();
  }

  user_principals~set_principal(asset_id, new_principal);

  ;; rewards tracking
  (int base_tracking_index, int base_tracking_accrued) = user_rewards.get_reward(asset_id);

  (base_tracking_index, base_tracking_accrued) = accrue_user_indexes(base_tracking_index, base_tracking_accrued, tracking_supply_index, tracking_borrow_index, old_principal, new_principal);

  user_rewards~set_reward(asset_id, base_tracking_index, base_tracking_accrued);

  ;; success msg to master sc
  reserve_and_send_rest(
    fee::min_tons_for_storage,
    master_address,
    pack_supply_success_message(
      query_id, owner_address,
      asset_id, supply_amount_current, new_principal,
      repay_amount_principal, supply_amount_principal, custom_response_payload
    )
  );

  user::storage::save(code_version, master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2);
  return ();
}

() supply_user_handle_exception (slice in_msg_body, slice master_address, slice owner_address, int query_id) impure inline {
  (int asset_id, int supply_amount_current, _, _, _, _, _, _, _, _,
    int forward_ton_amount, cell custom_response_payload) = parse_supply_user_message(in_msg_body);

  reserve_and_send_rest(
    fee::min_tons_for_storage,
    master_address,
    pack_supply_fail_message(
      query_id, owner_address,
      asset_id, supply_amount_current,
      forward_ton_amount, custom_response_payload
    )
  );
}

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
  slice sender_address, slice in_msg_body_original, int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; handle_transaction params
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, ;; user storage params
  int op, int query_id ;; tx body params
) impure inline {
  (int asset_id, int principal_amount, int tracking_supply_index, int tracking_borrow_index) = parse_withdraw_success_message(in_msg_body);

  (int base_tracking_index, int base_tracking_accrued) = user_rewards.get_reward(asset_id);

  int new_principal = user_principals.get_principal(asset_id);
  int old_principal = new_principal + principal_amount;

  (base_tracking_index, base_tracking_accrued) = accrue_user_indexes(base_tracking_index, base_tracking_accrued, tracking_supply_index, tracking_borrow_index, old_principal, new_principal);

  user_rewards~set_reward(asset_id, base_tracking_index, base_tracking_accrued);

  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address, 
    pack_withdraw_success_excess_message(
      op::withdraw_success,
      query_id
    )
  );

  user::storage::save(code_version, master_address, owner_address, user_principals, user_state::free, user_rewards, backup_cell_1, backup_cell_2);
  return ();
}

() withdraw_success_handle_exception (
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, int query_id
) impure inline {
  ;; The only possible problem is that something went wrong with rewards logic
  ;; Need to unlock user and send success message regardless

  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address,
    pack_withdraw_success_excess_message(
      op::withdraw_success,
      query_id
    )
  );

  user::storage::save(code_version, master_address, owner_address, user_principals, user_state::free, user_rewards, backup_cell_1, backup_cell_2);
}

() withdraw_fail_process (
  slice sender_address, slice in_msg_body_original, int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; handle_transaction params
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, ;; user storage params
  int op, int query_id ;; tx body params
) impure inline {
  (int asset_id, int principal_amount) = parse_withdraw_fail_message(in_msg_body);
  int optimistic_principal = user_principals.get_principal(asset_id);
  int reverted_principal = optimistic_principal + principal_amount; ;; withdraw failed - revert
  user_principals~set_principal(asset_id, reverted_principal);
  ;; Not enough funds - at least refund TON attachment to the owner
  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address, 
    pack_withdraw_excess_message(
      op::withdraw_no_funds_excess,
      query_id
    )
  );
  ;; Update user_principals and Unlock
  user::storage::save(code_version, master_address, owner_address, user_principals, user_state::free, user_rewards, backup_cell_1, backup_cell_2);
  return ();
}

() withdraw_user_process (
  slice sender_address, slice in_msg_body_original, int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, ;; handle_transaction params
  int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2, ;; user storage params
  int op, int query_id ;; tx body params
) impure inline {
  if (state != user_state::free) {
    ;; Refund TON attachment to the owner (and ignore the request in other respects)
    try_reserve_and_send_rest(
      fee::min_tons_for_storage,
      owner_address, 
      pack_withdraw_excess_message(
        op::withdraw_locked_excess,
        query_id
      )
    );
    return ();
  }

  (int asset_id, int withdraw_amount_current,
   int s_rate, int b_rate, slice recipient_address,
   cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed,
   int forward_ton_amount, cell custom_response_payload
   )
   = parse_withdraw_user_message(in_msg_body);

  (int jw_address_hash, int decimals, int collateral_factor,
      int liquidation_threshold, _, int base_borrow_rate,
      int borrow_rate_slope_low, int borrow_rate_slope_high, int supply_rate_slope_low,
      int supply_rate_slope_high, int target_utilization, int origination_fee, int dust, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

  int is_full_withdrawal = withdraw_amount_current == constants::max_uint64;
  int old_principal = user_principals.get_principal(asset_id);
  if (is_full_withdrawal){
    (withdraw_amount_current, int enough_price_data) = calculate_maximum_withdraw_amount(
      asset_config_collection, asset_dynamics_collection,
      user_principals, prices_packed, asset_id, old_principal
    );

    if ((~ enough_price_data) | (withdraw_amount_current <= 0)) { ;; check that withdraw_amount_current is positive (we can have some edge cases where withdraw_amount_current will be calculated as 0 or even negative)
      try_reserve_and_send_rest(
        fee::min_tons_for_storage,
        owner_address,
        pack_withdraw_excess_message(
          op::withdraw_missing_prices_excess,
          query_id
        )
      );
      return ();
    }
  }

  int present = present_value(s_rate, b_rate, old_principal);
  present -= withdraw_amount_current;

  int new_principal = principal_value(s_rate, b_rate, present);

  user_principals~set_principal(asset_id, new_principal);
  ;; should check if any asset is in debt if not we don't need the rest of calculation and we can also ignore prices

  (int borrow_is_collateralized, int enough_price_data) = is_borrow_collateralized(
    asset_config_collection, asset_dynamics_collection,
    user_principals, prices_packed
  );

  if (borrow_is_collateralized) { ;; we dont need to check enough_price_data here because borrow_is_collateralized var will be false if there is not enough price data & there is edge case where we dont need prices at all -> if there is no debt in user princpals
    (int borrow_amount_principal, int reclaim_amount_principal)
      = around_zero_split(new_principal, old_principal);
    if (borrow_amount_principal > 0) { ;; note this will add origination_fee to borrow amount
      ;; this might cause the borrow to be not collateralized but because it's very small and we already have a safe gap it's ok
      int amount_to_borrow_in_present = - present_value(s_rate, b_rate, - borrow_amount_principal);
      present -= amount_to_borrow_in_present.muldiv(origination_fee, constants::origination_fee_scale);
      new_principal = principal_value(s_rate, b_rate, present);
      
      ;; now we need to recalculate borrow_amount_principal and reclaim_amount_principal after origination_fee
      (borrow_amount_principal, reclaim_amount_principal)
        = around_zero_split(new_principal, old_principal);
    }

    user_principals~set_principal(asset_id, new_principal);

    reserve_and_send_rest(
      fee::min_tons_for_storage,
      master_address,
      pack_withdraw_collateralized_message(
        query_id,
        owner_address, asset_id,
        withdraw_amount_current, new_principal,
        borrow_amount_principal, reclaim_amount_principal, recipient_address, 
        forward_ton_amount, custom_response_payload
      )
    );
    ;; Update user_principals and Lock contract
    user::storage::save(code_version, master_address, owner_address, user_principals, user_state::withdrawing, user_rewards, backup_cell_1, backup_cell_2);
    return ();
  } else {
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
      )
    );
    return ();
  }
}

() withdraw_user_handle_exception(slice owner_address, int query_id) impure inline {
  try_reserve_and_send_rest(
    fee::min_tons_for_storage,
    owner_address,
    pack_withdraw_excess_message(
      op::withdraw_execution_crashed,
      query_id
    )
  );
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/asset-config-packer.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/basic-types.fc";

;; --------------- Structure methods ---------------

(int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int) unpack_asset_config(slice asset_config) {
	int jw_address_hash = asset_config~load_uint(256); 
	int decimals = asset_config~load_uint(8);
	
	cell asset_config_params_packed = asset_config~load_ref();
	slice asset_config_params = asset_config_params_packed.begin_parse();

	int collateral_factor = asset_config_params~load_uint(16);
	int liquidation_threshold = asset_config_params~load_uint(16); 
	int liquidation_bonus = asset_config_params~load_uint(16);
	int base_borrow_rate = asset_config_params~load_uint(64); 
	int borrow_rate_slope_low = asset_config_params~load_uint(64); 
	int borrow_rate_slope_high = asset_config_params~load_uint(64);
	int supply_rate_slope_low = asset_config_params~load_uint(64); 
	int supply_rate_slope_high = asset_config_params~load_uint(64);
	int target_utilization = asset_config_params~load_uint(64);
	int origination_fee = asset_config_params~load_uint(64);
	int dust_value = asset_config_params~load_uint(64);
	int max_total_supply = asset_config_params~load_uint(64);
	int reserve_factor = asset_config_params~load_uint(16);
	int liquidation_reserve_factor = asset_config_params~load_uint(16); 
	int min_principal_for_rewards = asset_config_params~load_uint(64); 
	int base_tracking_supply_speed = asset_config_params~load_uint(64); 
	int base_tracking_borrow_speed = asset_config_params~load_uint(64); 

  return (
		jw_address_hash, decimals,
		collateral_factor, liquidation_threshold,
		liquidation_bonus, base_borrow_rate,
		borrow_rate_slope_low, borrow_rate_slope_high,
		supply_rate_slope_low, supply_rate_slope_high,
		target_utilization, origination_fee,
		dust_value, max_total_supply,
		reserve_factor, liquidation_reserve_factor,
		min_principal_for_rewards, base_tracking_supply_speed,
		base_tracking_borrow_speed
	);
}

cell pack_asset_config(
		int jw_address_hash, int decimals,
		int collateral_factor,
		int liquidation_threshold, int liquidation_bonus,
		int base_borrow_rate, int borrow_rate_slope_low,
		int borrow_rate_slope_high, int supply_rate_slope_low,
		int supply_rate_slope_high, int target_utilization,
		int origination_fee, int dust_value, int max_total_supply,
		int reserve_factor, int liquidation_reserve_factor,
		int min_principal_for_rewards, int base_tracking_supply_speed,
		int base_tracking_borrow_speed
) {
	return begin_cell()
		.store_uint(jw_address_hash, 256)
		.store_uint(decimals, 8) 
		.store_ref(begin_cell()
			.store_uint(collateral_factor, 16) 
			.store_uint(liquidation_threshold, 16) 
			.store_uint(liquidation_bonus, 16)
			.store_uint(base_borrow_rate, 64) 
			.store_uint(borrow_rate_slope_low, 64) 
			.store_uint(borrow_rate_slope_high, 64) 
			.store_uint(supply_rate_slope_low, 64) 
			.store_uint(supply_rate_slope_high, 64) 
			.store_uint(target_utilization, 64)
			.store_uint(origination_fee, 64)
			.store_uint(dust_value, 64)
			.store_uint(max_total_supply, 64)
			.store_uint(reserve_factor, 16)
			.store_uint(liquidation_reserve_factor, 16)
			.store_uint(min_principal_for_rewards, 64)
			.store_uint(base_tracking_supply_speed, 64)
			.store_uint(base_tracking_borrow_speed, 64)
		.end_cell())
	.end_cell();
}



;; --------------- Collection methods ---------------

(int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int, int)
	asset_config_collection:get_unpacked(cell asset_config_collection, int asset_id)
{
	(slice asset_config, _) = asset_config_collection.udict_get?(256, asset_id);
	return unpack_asset_config(asset_config);
}

;; for future use
int asset_config_collection:get_jetton_wallet(cell asset_config_collection, int asset_id)
{
	(slice asset_config, _) = asset_config_collection.udict_get?(256, asset_id);
	(int jetton_wallet, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _) = asset_config.unpack_asset_config();
	return jetton_wallet;
}

int asset_config_collection:decimals(cell asset_config_collection, int asset_id) {
	(slice asset_config, _) = asset_config_collection.udict_get?(256, asset_id);
	
	asset_config~load_address_hash(); ;; jw_address_hash
	return asset_config.preload_uint(8); ;; decimals
}



```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/asset-dynamics-packer.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../constants/errors.fc";
#include "../external/stdlib.fc";
#include "basic-types.fc";

;; --------------- Structure methods ---------------

cell pack_asset_dynamics(
	int s_rate, int b_rate,
	int total_supply_principal, int total_borrow_principal,
	int last_accrual, int token_balance,
	int tracking_supply_index, int tracking_borrow_index,
	int awaited_supply
) {
	throw_if(error::sys::integer_out_of_expected_range, total_supply_principal < 0);
	throw_if(error::sys::integer_out_of_expected_range, total_borrow_principal < 0);
	return begin_cell()
		.store_sb_rate(s_rate)
		.store_sb_rate(b_rate)
		.store_principal(total_supply_principal)
		.store_principal(total_borrow_principal)
		.store_timestamp(last_accrual)
		.store_balance(token_balance)
		.store_tracking_index(tracking_supply_index)
		.store_tracking_index(tracking_borrow_index)
		.store_balance(awaited_supply)
		.end_cell();
}

(int, int, int, int, int, int, int, int, int) unpack_asset_dynamics(slice asset_dynamics) {
	int asset_s_rate = asset_dynamics~load_sb_rate();
	int asset_b_rate = asset_dynamics~load_sb_rate();
	
	int total_supply_principal = asset_dynamics~load_principal();
	int total_borrow_principal = asset_dynamics~load_principal();
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
	
	int last_accrual = asset_dynamics~load_timestamp();
	int token_balance = asset_dynamics~load_balance();
	int tracking_supply_index = asset_dynamics~load_tracking_index();
	int tracking_borrow_index = asset_dynamics~load_tracking_index();
	int awaited_supply = asset_dynamics~load_balance();
	
	return (
		asset_s_rate, asset_b_rate,
		total_supply_principal, total_borrow_principal,
		last_accrual, token_balance,
		tracking_supply_index, tracking_borrow_index,
		awaited_supply
	);
}

;; --------------- Collection methods ---------------

(int, int, int, int, int, int, int, int, int) asset_dynamics_collection:get_unpacked(
	cell asset_dynamics_collection, int asset_id
) {
	(slice asset_dynamics, _) = asset_dynamics_collection.udict_get?(256, asset_id);
	return unpack_asset_dynamics(asset_dynamics);
}

(cell, ()) asset_dynamics_collection:set_packed( 
	cell asset_dynamics_collection, int asset_id,
	int s_rate, int b_rate,
	int total_supply_principal, int total_borrow_principal,
	int last_accrual, int token_balance,
 	int tracking_supply_index, int tracking_borrow_index,
	int awaited_supply
) {
	cell asset_dynamics = pack_asset_dynamics(
		s_rate, b_rate,
		total_supply_principal, total_borrow_principal,
		last_accrual, token_balance,
		tracking_supply_index, tracking_borrow_index,
		awaited_supply
	);

	return (asset_dynamics_collection.udict_set(
		256, asset_id, asset_dynamics.begin_parse() 
	), ());
}

int asset_dynamics_collection:has?(
	cell asset_dynamics_collection, int asset_id
) {
	(_, int f) = asset_dynamics_collection.udict_get?(256, asset_id);
	return f;
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/basic-types.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";

(slice, int) load_op_code(slice cs) inline {
	return cs.load_uint(32);
}

builder store_op_code(builder b, int op_code) inline {
	return b.store_uint(op_code, 32);
}

;; ??? How to store prices?
builder store_price(builder b, int price) inline {
	return b.store_uint(price, 64);
}

(slice, int) load_price(slice cs) inline {
	return cs.load_uint(64);
}

builder store_address_hash(builder b, int address_hash) inline {
	return b.store_uint(address_hash, 256);
}

(slice, int) load_address_hash(slice cs) inline {
	return cs.load_uint(256);
}

builder store_asset_id(builder b, int asset_id) inline {
	return b.store_uint(asset_id, 256);
}

(slice, int) load_asset_id(slice cs) inline {
	return cs.load_uint(256);
}

builder store_amount(builder b, int amount) inline {
	;; I recommend to ensure that amount is non-negative here
	return b.store_uint(amount, 64);
	;; .load_amount is used in parse_liquidate_master_message
	;; to store min_collateral_amount, which MUST be non-negative
	;; (read the comment in parse_liquidate_master_message)
	;; don't change to signed int
	;; (or in case you need to - introduce necessary checks in the code)
}

(slice, int) load_amount(slice cs) inline {
	return cs.load_uint(64);
}

builder store_balance(builder b, int balance) inline {
	return b.store_uint(balance, 64);
}

(slice, int) load_balance(slice cs) inline {
	return cs.load_uint(64);
}

;; ??? How to store s_rate and b_rate?
builder store_sb_rate(builder b, int sb_rate) inline {
	return b.store_uint(sb_rate, 64);
}

(slice, int) load_sb_rate(slice cs) inline {
	return cs.load_uint(64);
}

;; ??? How to store principal amounts?
;; (Note it at least can be negative)
builder store_principal(builder b, int principal) inline {
	return b.store_int(principal, 64);
}

(slice, int) load_principal(slice cs) inline {
	return cs.load_int(64);
}

int preload_principal(slice cs) inline {
	return cs.preload_int(64);
}

;; ??? Is timestamp always positive?
builder store_timestamp(builder b, int timestamp) inline {
	return b.store_uint(timestamp, 32);
}

(slice, int) load_timestamp(slice cs) inline {
	return cs.load_uint(32);
}

(slice, int) load_bool_ext(slice cs) inline {
	return cs.load_int(2);
}

builder store_tracking_index(builder b, int tracking_index) inline {
	return b.store_uint(tracking_index, 64);
}

(slice, int) load_tracking_index(slice cs) inline {
	return cs.load_uint(64);
}

(int) preload_tracking_index(slice cs) inline {
	return cs.preload_uint(64);
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/prices-packed.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/errors.fc";

const int max_timestamp_delta = 180;

const int exotic_cell_type::merkle_proof = 3;

const int int::max = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

int prices_packed:get(cell prices_packed, int asset_id) inline {
    (slice price_packed, _) = prices_packed.udict_get?(256, asset_id);
    int result = price_packed~load_coins();
    price_packed.end_parse();
    return result;
}

int prices_packed:get?(cell prices_packed, int asset_id) inline {
	(slice price_packed, int found) = prices_packed.udict_get?(256, asset_id);
    ifnot (found) {
        return -1;
    }
    int result = price_packed~load_coins();
    price_packed.end_parse();
    return result;
}

(slice, int) begin_parse_exotic?(cell c) asm "XCTOS";

(tuple, int) parse_check_oracles_data(cell oracles_data, cell oracles) impure inline_ref {
    tuple res = null();

    int cnt = 0;
    int last_oracle_id = -1;
    do {
        slice cs = oracles_data.begin_parse();
        int oracle_id = cs~load_uint(32);
        cell proof = cs~load_ref();
        slice signature = cs~load_bits(512);
        oracles_data = cs~load_maybe_ref();
        cs.end_parse();

        (slice ps, int exotic?) = proof.begin_parse_exotic?();
        throw_unless(error::prices_incorrect_proof, exotic?);
        throw_unless(error::prices_incorrect_proof, ps~load_uint(8) == exotic_cell_type::merkle_proof);
        int original_hash = ps~load_uint(256); ;; TON automatically checks that the hash is indeed proven

        (slice vs, int found?) = oracles.udict_get?(32, oracle_id);
        throw_unless(error::prices_no_such_oracle, found?);
        int pubkey = vs~load_uint(256);
        throw_unless(error::prices_incorrect_signature, check_signature(original_hash, signature, pubkey));

        throw_unless(error::prices_incorrect_sequence, oracle_id > last_oracle_id); ;; no data is duplicated
        last_oracle_id = oracle_id;
        cnt += 1;

        slice ds = ps~load_ref().begin_parse();
        ps~skip_bits(16); ;; depth of the deleted subtree, which was replaced by the reference
        ps.end_parse();
        int timestamp = ds~load_uint(32);
        cell prices = ds~load_dict();
        ds.end_parse();

        int delta = now() - timestamp;
        throw_unless(error::prices_incorrect_timestamp, (delta >= 0) & (delta < max_timestamp_delta));

        res = cons(prices, res); ;; might add [oracle_id, timestamp, prices] instead
    } until oracles_data.cell_null?();

    return (res, cnt);
}

slice udict_get(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "10 THROWIFNOT";

int check_suggested_price(int asset_id, int price, tuple oracles_prices, int cnt) impure inline_ref {
    if (cnt % 2) {
        ;; median is unique, just check that the price is a median
        int leq_cnt = 0;
        int geq_cnt = 0;
        repeat (cnt) {
            cell prices_dict = oracles_prices~list_next();
            slice cs = prices_dict.udict_get(256, asset_id);
            int oracle_price = cs~load_coins();
            leq_cnt -= (oracle_price <= price);
            geq_cnt -= (oracle_price >= price);
        }
        return (leq_cnt * 2 >= cnt) & (geq_cnt * 2 >= cnt);
    } else {
        ;; median is not unique
        ;; price should be equal to average of two nearest neighbors

        int le_cnt = 0;
        int gt_cnt = 0;
        int le_max = -1;
        int gt_min = int::max;
        repeat(cnt) {
            cell prices_dict = oracles_prices~list_next();
            slice cs = prices_dict.udict_get(256, asset_id);
            int oracle_price = cs~load_coins();
            if (oracle_price < price) {
                le_cnt += 1;
                le_max = max(le_max, oracle_price);
            }
            if (oracle_price > price) {
                gt_cnt += 1;
                gt_min = min(gt_min, oracle_price);
            }
        }

        int cnt/2 = cnt / 2;
        if (le_cnt == cnt/2) & (gt_cnt == cnt/2) { ;; most common case
            return price == (le_max + gt_min) / 2;
        }

        int leq_cnt = cnt - gt_cnt;
        int geq_cnt = cnt - le_cnt;
        ifnot (leq_cnt >= cnt/2) & (geq_cnt >= cnt/2) { ;; it's not a median
            return false;
        }

        ;; it's median, but it is equal to some element
        ;; Possible cases:
        ;; (1) price is equal to both neighbors
        ;; (2) price is equal to left neighbor and 1 unit less than right neigbor
        ;; (3) price is incorrect (not average of two neighbors)

        if (gt_cnt == cnt/2) {
            ;; price is less than the rigth neighbor, but equal to the left one
            ;; check that the difference is indeed 1
            return price == gt_min - 1;
        }

        return (le_cnt < cnt/2); ;; check that both neigbors are equal
    }
}

cell retrieve_median_prices(slice oracles_info, cell assets, cell oracles_data) impure inline {
    int total_oracles = oracles_info~load_uint(16);
    int threshold = oracles_info~load_uint(16);
    cell oracles = oracles_info.preload_ref();

    (tuple oracles_prices, int cnt) = parse_check_oracles_data(oracles_data, oracles);

    throw_unless(error::prices_not_enough_data, cnt >= threshold);
    throw_if(error::prices_too_much_data, cnt > total_oracles);

    cell res = new_dict();
    do {
        slice cs = assets.begin_parse();
        int id = cs~load_uint(256);
        int price = cs~load_coins();
        assets = cs~load_maybe_ref();
        cs.end_parse();

        throw_unless(error::prices_not_positive, price > 0);
        throw_unless(error::prices_incorrect_suggested_price, check_suggested_price(id, price, oracles_prices, cnt));
        res~udict_set_builder(256, id, begin_cell().store_coins(price));
    } until assets.null?();

    return res;
}

;; Calling code MUST process prices_packed:error's result and check it for error
;; the reason prices_packed:error doesn't throw exceptions itself is because:
;; refunding Jettons requires manually sending a message
;; (just throwing an exception can only refund TONs, but not Jettons)
(cell, int) prices_packed:error (cell prices_packed, slice oracles_info) impure {
    slice prices_unpacked = prices_packed.begin_parse();
    cell assets = prices_unpacked~load_ref();
    cell oracles_data = prices_unpacked~load_ref();
    prices_unpacked.end_parse();
    try {
        cell res = retrieve_median_prices(oracles_info, assets, oracles_data);
        return (res, 0);
    }
    catch(_, int n) {
        return (null(), n);
    }
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
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/data/universal-dict.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../constants/errors.fc";

slice upgrade_storage:get!(cell storage, int field_name_hash) impure inline {
	(slice value, int found) = storage.udict_get?(256, field_name_hash);
	throw_unless(error::unexpected_empty_value, found);
	return value;
}


```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/external/openlib.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

;; cherry-picked from https://github.com/continuation-team/openlib.func/blob/main/openlib.func

int     ext::addr_std?(slice addr) asm "b{10000000000} PUSHSLICE SDPPFXREV";

int     ext::workchains_equal?(slice addr1, slice addr2) asm "REWRITESTDADDR DROP SWAP REWRITESTDADDR DROP EQUAL";
int     ext::workchain_match?(slice addr, int wc) asm(wc addr) "REWRITESTDADDR DROP EQUAL";

;; added by hand

int ext::addr_std_any_wc?(slice addr) asm "b{100} PUSHSLICE SDPPFXREV";
;; <<< addr_std$10 anycast:(Maybe Anycast) >>> workchain_id:int8 address:bits256 = MsgAddressInt;

int ext::is_on_same_workchain?(slice addr) asm "REWRITESTDADDR DROP MYADDR REWRITESTDADDR DROP EQUAL";

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
() set_seed(int) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits (slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm(from to) "STB";

;; NEW FUNCS

;; ===== TVM UPGRADE =====

;;; Retrieves code of smart-contract from c7
cell my_code() asm "MYCODE";

;;; Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG
;;int send_message(cell msg, int mode) impure asm "SENDMSG";

;;; Retrieves value of storage phase fees from c7
int storage_fees() asm "STORAGEFEES";

;;; Retrieves global_id from 19 network config
int global_id() asm "GLOBALID";

;;; Returns gas consumed by VM so far (including this instruction).
int gas_consumed() asm "GASCONSUMED";

int cell_level(cell c) asm "CLEVEL";
int cell_level_mask(cell c) asm "CLEVELMASK";

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

;; ===== ADDRESS =====

const int BASECHAIN = 0;
const int MASTERCHAIN = -1;

const slice addr_none = "2_"s; ;; addr_none$00 = MsgAddressExt;

;;; Store addr_none constuction (b{00}) to `builder` [b]
builder store_addr_none(builder b) asm "b{00} STSLICECONST";

;;; Checking that `slice` [s] is a addr_none constuction;
int addr_none?(slice s) asm "b{00} PUSHSLICE SDEQ";

;;; Checking that the address is a standard basechain address and does not have anycast (should be used after load_msg_addr)
int validate_addr_bc(slice addr) asm "b{10000000000} PUSHSLICE SDPPFXREV";
;;; Checking that the address is a standard masterchain address and does not have anycast (should be used after load_msg_addr)
int validate_addr_mc(slice addr) asm "b{10011111111} PUSHSLICE SDPPFXREV";

builder store_bc_address(builder b, cell state_init) asm "HASHCU SWAP b{10000000000} STSLICECONST 256 STU";
builder store_mc_address(builder b, cell state_init) asm "HASHCU SWAP b{10011111111} STSLICECONST 256 STU";

;;; Checking that the `slice` [addr] is a standard basechain address and does not have anycast (can be used with any `slice`)
int ext_validate_addr_bc(slice addr) asm """
  DUP
  b{10000000000} PUSHSLICE SDPPFXREV SWAP
  267 INT 0 INT SCHKBITREFSQ
  AND
""";
;;; Checking that the `slice` [addr] is a standard masterchain address and does not have anycast (can be used with any `slice`)
int ext_validate_addr_mc(slice addr) asm """
  DUP
  b{10011111111} PUSHSLICE SDPPFXREV SWAP
  267 INT 0 INT SCHKBITREFSQ
  AND
""";

;;; Checking that [addr1] and [addr2] have the same workchain
int workchains_equal?(slice addr1, slice addr2) asm "REWRITESTDADDR DROP SWAP REWRITESTDADDR DROP EQUAL";
;;; Checking that [addr] have the workchain [wc]
int workchain_match?(slice addr, int wc) asm(wc addr) "REWRITESTDADDR DROP EQUAL";
;;; Checking that [addr] have the workchain 0
int basechain_addr?(slice addr) asm "REWRITESTDADDR DROP 0 EQINT";
;;; Checking that [addr] have the workchain -1
int masterchain_addr?(slice addr) asm "REWRITESTDADDR DROP -1 EQINT";

;;; Basic store StateInit construction in `builder` [b].
builder store_state_init(builder b, cell data, cell code) asm(data code b) "b{00110} STSLICECONST STREF STREF";

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

const int TRUE = -1;
const int FALSE = 0;

;;; Store binary true b{1} to `builder` [b]
builder store_true(builder b) asm "STONE";
;;; Store binary false b{0} to `builder` [b]
builder store_false(builder b) asm "STZERO";
;;; Store `int` [x] as bool to `builder` [b]
builder store_bool(builder b, int x) asm(x b) "1 STI";

;;; Loads bool from `slice` [s]
(slice, int) load_bool(slice s) asm(-> 1 0) "1 LDI";

;;; Checks whether `int` [x] is a “boolean value" (i.e., either 0 or -1).
int bool?(int x) asm "CHKBOOL";

;;; Skip (Maybe ^Cell) from `slice` [s].
(slice, ()) ~skip_maybe_ref(slice s) asm "SKIPOPTREF";
(slice, ()) ~skip_dict(slice s) asm "SKIPOPTREF";

;; ===== MSG FLAGS =====

const slice BOUNCEABLE = "62_"s; ;; 0b011000 tag - 0, ihr_disabled - 1, bounce - 1, bounced - 0, src = adr_none$00
const slice NON_BOUNCEABLE = "42_"s; ;; 0b010000 tag - 0, ihr_disabled - 1, bounce - 0, bounced - 0, src = adr_none$00

builder store_msg_flags(builder b, int flag) asm(flag b) "6 STU";

builder store_msg_flags_bounceable(builder b) asm "b{011000} STSLICECONST";
builder store_msg_flags_non_bounceable(builder b) asm "b{010000} STSLICECONST";

;; load msg_flags only
(slice, int) ~load_msg_flags(slice s) asm(-> 1 0) "4 LDU";

;;; Basic parse MessageX (full_message), returns: flags, sender, forward fee
(int, slice, int) parse_message(cell full_message) asm "CTOS 4 LDU LDMSGADDR LDMSGADDR LDGRAMS SKIPDICT LDGRAMS LDGRAMS DROP 3 1 BLKDROP2";

;;; Checking that the "bounce" bit in the flags is set to "true"
int bounceable?(int flags) asm "2 INT AND";
;;; Checking that the "bounced" bit in the flags is set to "true"
int bounced?(int flags) asm "ONE AND";

(slice, ()) ~skip_bounced_prefix(slice s) asm "x{FFFFFFFF} SDBEGINS";

;; ===== MSG BODY =====

;;; Store standard uint32 operation code into `builder` [b]
builder store_op(builder b, int op) asm(op b) "32 STU";
;;; Store standard uint64 query id into `builder` [b]
builder store_query_id(builder b, int query_id) asm(query_id b) "64 STU";
;;; Load standard uint32 operation code from `slice` [s]
(slice, int) load_op(slice s) asm(-> 1 0) "32 LDU";
;;; Load standard uint64 query id from `slice` [s]
(slice, int) load_query_id(slice s) asm(-> 1 0) "64 LDU";

(slice, (int, int)) ~load_op_and_query_id(slice s) asm(-> 2 0 1) "32 LDU 64 LDU";

(slice, ()) ~skip_op(slice s) asm "32 LDU NIP";
(slice, ()) ~skip_query_id(slice s) asm "32 LDU NIP";

;; ===== SEND =====

const int MSG_INFO_REST_BITS = 105; ;;1 + 4 + 4 + 64 + 32

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

const int MSG_WITH_STATE_INIT_AND_BODY_SIZE = 108; ;; MSG_INFO_REST_BITS + 1 + 1 + 1
const int MSG_HAVE_STATE_INIT = 4;
const int MSG_STATE_INIT_IN_REF = 2;
const int MSG_BODY_IN_REF = 1;

;; if no StateInit:
;; 0b0 for `Maybe (Either StateInit ^StateInit)` and 0b1 or 0b0 for `body:(Either X ^X)`

const int MSG_ONLY_BODY_SIZE = 107; ;; MSG_INFO_REST_BITS + 1 + 1;

;; ===== SEND MODES =====

;; For `send_raw_message` and `send_message`:

;;; x = 0 is used for ordinary messages; the gas fees are deducted from the senging amount; action phaes should NOT be ignored.
const int sendmode::REGULAR = 0;
;;; +1 means that the sender wants to pay transfer fees separately.
const int sendmode::PAY_FEES_SEPARATELY = 1;
;;; + 2 means that any errors arising while processing this message during the action phase should be ignored.
const int sendmode::IGNORE_ERRORS = 2;
;;; + 32 means that the current account must be destroyed if its resulting balance is zero.
const int sendmode::DESTROY = 32;
;;; x = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message.
const int sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;
;;; x = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message).
const int sendmode::CARRY_ALL_BALANCE = 128;
;;; in the case of action fail - bounce transaction. No effect if sendmode::IGNORE_ERRORS (+2) is used. TVM UPGRADE 2023-07.
const int sendmode::BOUNCE_ON_ACTION_FAIL = 16;

;; Only for `send_message`:

;;; do not create an action, only estimate fee
const int sendmode::ESTIMATE_FEE_ONLY = 1024;

;; Other modes affect the fee calculation as follows:
;; +64 substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
;; +128 substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).

;; ===== RESERVE MODES =====

;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int reserve::REGULAR = 0;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int reserve::AT_MOST = 2;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07.
const int reserve::BOUNCE_ON_ACTION_FAIL = 16;

;; ===== TOKEN METADATA =====
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md

const slice ONCHAIN_CONTENT = "00"s;
const slice OFFCHAIN_CONTENT = "01"s;
const slice SNAKE_FORMAT = "00"s;
const slice CHUNKS_FORMAT = "01"s;

;; Key is sha256 hash of string. Value is data encoded as described in "Data serialization" paragraph.
;; Snake format - must be prefixed with 0x00 byte
(cell, ()) ~set_token_snake_metadata_entry(cell content_dict, int key, slice value) impure {
  content_dict~udict_set_ref(256, key, begin_cell().store_slice(SNAKE_FORMAT).store_slice(value).end_cell());
  return (content_dict, ());
}

;; On-chain content layout The first byte is 0x00 and the rest is key/value dictionary.
cell create_token_onchain_metadata(cell content_dict) inline {
  return begin_cell().store_slice(ONCHAIN_CONTENT).store_dict(content_dict).end_cell();
}

;; ===== BASIC =====

;;; Returns the current length of the `tuple` [t]
int tuple_length(tuple t) asm "TLEN";

builder store_zeroes(builder b, int x) asm "STZEROES";
builder store_ones(builder b, int x) asm "STONES";

builder store_varuint16(builder b, int x) asm "STVARUINT16";
builder store_varint16(builder b, int x) asm "STVARINT16";
builder store_varuint32(builder b, int x) asm "STVARUINT32";
builder store_varint32(builder b, int x) asm "STVARINT32";

(slice, int) load_varuint16(slice s) asm(-> 1 0) "LDVARUINT16";
(slice, int) load_varint16(slice s) asm(-> 1 0) "LDVARINT16";
(slice, int) load_varuint32(slice s) asm(-> 1 0) "LDVARUINT32";
(slice, int) load_varint32(slice s) asm(-> 1 0) "LDVARINT32";

;;; Creates an output action that would modify the collection of this smart contract
;;; libraries by adding or removing library with code given in `Cell` [code].
;;; Modes: 0 - remove library, 1 - add private library, 2 - add public library
() set_library(cell code, int mode) impure asm "SETLIBCODE";

(slice, ()) ~skip_ref(slice s) asm "LDREF NIP";
(slice, ()) ~skip_coins(slice s) asm "LDGRAMS NIP";
(slice, ()) ~skip_msg_addr(slice s) asm "LDMSGADDR NIP";

cell preload_first_ref(slice s) asm "0 PLDREFIDX";
cell preload_second_ref(slice s) asm "1 PLDREFIDX";
cell preload_third_ref(slice s) asm "2 PLDREFIDX";
cell preload_fourth_ref(slice s) asm "3 PLDREFIDX";

;;; Concatenates two builders, but second builder stores as the reference (end_cell -> store_ref)
builder store_builder_as_ref(builder to, builder from) asm(from to) "STBREF";

;;; Loads the reference from the slice and parse (load_ref -> begin_parse)
(slice, slice) load_ref_as_slice(slice s) asm "LDREFRTOS";

;;; Returns the TON balance of the smart contract
int get_ton_balance() asm "BALANCE FIRST";

;;; Returns the number of data bits and cell references already stored in `builder` [b].
(int, int) builder_bits_refs(builder b) asm "BBITREFS";

;;; Returns the number of data bits and cell references that can be stored in `builder` [b].
(int, int) builder_rem_bits_refs(builder b) asm "BREMBITREFS";

;;; Checks whether `slice` [pfx] is a prefix of `slice` [s]
int slice_check_prefix(slice s, slice pfx) asm "SDPFXREV";
;;; Checks whether `slice` [sfx] is a suffix of `slice` [s]
int slice_check_suffix(slice s, slice sfx) asm "SDSFXREV";
;;; Checks whether there are at least [l] data bits in `slice` [s].
int slice_check_bits(slice s, int l) asm "SCHKBITSQ";
;;; Checks whether there are at least [r] references in `slice` [s].
int slice_check_refs(slice s, int r) asm "SCHKREFSQ";
;;; Checks whether there are at least [l] data bits and [r] references in `slice` [s].
int slice_check_bits_refs(slice s, int l, int r) asm "SCHKBITREFSQ";

;;; Checks whether `slice` [s] begins with (the data bits of) [pfx], and removes [pfx] from [s] on success.
;;(slice, int) slice_begins_with(slice s, slice pfx) asm "SDBEGINSXQ";

;;; Store `integer` [x] number as string (UTF-8) in decimal form in `builder` [b].
builder store_number_dec(builder b, int x) asm """
  ZERO                                                        // b x i=0
  SWAP                                                        // b i=0 x
  UNTIL:<{                                                    // b i x
    10 PUSHINT DIVMOD                                         // b i x r
    48 ADDCONST                                               // b i x r
    s3 s1 s3 XCHG3                                            // r b x i
    INC                                                       // r b x i
    s1 s0 XCPU                                                // r b i x x
    ISZERO
  }>
  DROP
  REPEAT:<{ 8 STU }>                                          // ..rrr.. b i
""";

;;; Store `int` [x] number as string (UTF-8) in hexadecimal form in `builder` [b].
builder store_number_hex(builder b, int x) asm """
  ZERO                                                        // b x i=0
  SWAP                                                        // b i=0 x
  UNTIL:<{                                                    // b i x
    16 PUSHINT DIVMOD                                         // b i x r
    48 ADDCONST DUP 57 GTINT IF:<{ 7 ADDCONST }>              // b i x r
    s3 s1 s3 XCHG3                                            // r b x i
    INC                                                       // r b x i
    s1 s0 XCPU                                                // r b i x x
    ISZERO
  }>
  DROP
  REPEAT:<{ 8 STU }>                                          // ..rrr.. b i
""";

;;; Returns the continuation located in register c2
cont get_c2() asm "c2 PUSH";
;;; Store `continuation` [c] to register c2
() set_c2(cont c) impure asm "c2 POP";

;;; DRAFT, not for use in prod
() send(slice address, int value, builder state_init, builder body, int mode) impure inline {
  builder message = begin_cell().store_slice(BOUNCEABLE).store_slice(address).store_coins(value).store_zeroes(105);

  ifnot (state_init.null?()) {
    message = message.store_slice("A_"s).store_builder(state_init); ;; x{A_} == b{10}
  } else {
    message = message.store_false();
  }

  ifnot (body.null?()) {
    (int b1, int r1) = message.builder_rem_bits_refs();
    (int b2, int r2) = body.builder_bits_refs();
    if ((b1 >= b2) & (r1 >= r2)) {
      message = message.store_false().store_builder(body);
    } else {
      message = message.store_true().store_builder_as_ref(body);
    }
  } else {
    message = message.store_false();
  }
  send_raw_message(message.end_cell(), mode);
}

;; ===== STANDARD OP's =====

;; Common (used in TEP-62,74,85)
const slice op::excesses               = "d53276db"s;

;; TEP-62 - NFT
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
const slice op::transfer_nft           = "5fcc3d14"s;
const slice op::ownership_assigned     = "05138d91"s;
const slice op::get_static_data        = "2fcb26a2"s;
const slice op::report_static_data     = "8b771735"s;

;; TEP-66 - NFT Royalty
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md
const slice op::get_royalty_params     = "693d3950"s;
const slice op::report_royalty_params  = "a8cb00ad"s;

;; TEP-74 - Jettons
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
const slice op::transfer_jetton        = "0f8a7ea5"s;
const slice op::internal_transfer      = "178d4519"s;
const slice op::transfer_notification  = "7362d09c"s;
const slice op::burn_notification      = "7bdd97de"s;

;; TEP-85 - SBT
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0085-sbt-standard.md
const slice op::prove_ownership        = "04ded148"s;
const slice op::ownership_proof        = "0524c7ae"s;
const slice op::request_owner          = "d0c3bfea"s;
const slice op::owner_info             = "0dd607e3"s;
const slice op::destroy_sbt            = "1f04537a"s;
const slice op::revoke_sbt             = "6f89f5e3"s;

;; TEP-89 - Discoverable Jettons Wallets
;; https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
const slice op::provide_wallet_address = "2c76b973"s;
const slice op::take_wallet_address    = "d1735400"s;

;; ===== DICTS (missing funcs) =====

cell dict_get_ref(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGETOPTREF";
cell udict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETOPTREF";

(cell, cell) dict_set_get_ref(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTSETGETOPTREF";

cell dict_set_ref(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTSETREF";
(cell, ()) ~dict_set_ref(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTSETREF";

(cell, int) dict_get_ref?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGETREF" "NULLSWAPIFNOT";
(cell, int) dict_delete?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDEL";
(slice, int) dict_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTGET" "NULLSWAPIFNOT";

(cell, slice, int) dict_delete_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~dict_delete_get?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDELGET" "NULLSWAPIFNOT";

(cell, int) dict_replace?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTREPLACE";
(cell, int) dict_add?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTADD";

(cell, int) dict_replace_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEB";
(cell, int) dict_add_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTADDB";

(slice, slice, int) dict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTMIN" "NULLSWAPIFNOT2";
(slice, slice, int) dict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTMAX" "NULLSWAPIFNOT2";
(slice, cell, int) dict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTMINREF" "NULLSWAPIFNOT2";
(slice, cell, int) dict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTMAXREF" "NULLSWAPIFNOT2";
(slice, slice, int) dict_get_next?(cell dict, int key_len, slice pivot) asm(pivot dict key_len -> 1 0 2) "DICTGETNEXT" "NULLSWAPIFNOT2";
(slice, slice, int) dict_get_nexteq?(cell dict, int key_len, slice pivot) asm(pivot dict key_len -> 1 0 2) "DICTGETNEXTEQ" "NULLSWAPIFNOT2";
(slice, slice, int) dict_get_prev?(cell dict, int key_len, slice pivot) asm(pivot dict key_len -> 1 0 2) "DICTGETPREV" "NULLSWAPIFNOT2";
(slice, slice, int) dict_get_preveq?(cell dict, int key_len, slice pivot) asm(pivot dict key_len -> 1 0 2) "DICTGETPREVEQ" "NULLSWAPIFNOT2";

;; ===== DICTS (new funcs) =====

(slice, cell, int) load_dict?(slice s) asm(-> 1 0 2) "LDDICTQ" "NULLROTRIFNOT";
(slice, (cell, int)) ~load_dict?(slice s) asm(-> 1 0 2) "LDDICTQ" "NULLROTRIFNOT";
(cell, int) preload_dict?(slice s) asm "PLDDICTQ" "NULLSWAPIFNOT";

(cell, slice, int) dict_set_get?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSETGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_set_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSETGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_set_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISETGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~dict_set_get?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSETGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_set_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSETGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_set_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISETGET" "NULLSWAPIFNOT";

(cell, cell, int) dict_set_get_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTSETGETREF" "NULLSWAPIFNOT";
(cell, cell, int) udict_set_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETREF" "NULLSWAPIFNOT";
(cell, cell, int) idict_set_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~dict_set_get_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTSETGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~udict_set_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~idict_set_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETREF" "NULLSWAPIFNOT";

(cell, slice, int) dict_set_get_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETGETB" "NULLSWAPIFNOT";
(cell, slice, int) udict_set_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETGETB" "NULLSWAPIFNOT";
(cell, slice, int) idict_set_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETGETB" "NULLSWAPIFNOT";
(cell, (slice, int)) ~dict_set_get_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETGETB" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_set_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETGETB" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_set_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETGETB" "NULLSWAPIFNOT";

(cell, int) dict_replace_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTREPLACEREF";
(cell, int) udict_replace_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEREF";
(cell, int) idict_replace_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEREF";

(cell, slice, int) dict_replace_get?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTREPLACEGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_replace_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACEGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_replace_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACEGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~dict_replace_get?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTREPLACEGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_replace_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACEGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_replace_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACEGET" "NULLSWAPIFNOT";

(cell, cell, int) dict_replace_get_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTREPLACEGETREF" "NULLSWAPIFNOT";
(cell, cell, int) udict_replace_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEGETREF" "NULLSWAPIFNOT";
(cell, cell, int) idict_replace_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~dict_replace_get_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTREPLACEGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~udict_replace_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUREPLACEGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~idict_replace_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIREPLACEGETREF" "NULLSWAPIFNOT";

(cell, slice, int) dict_replace_get_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEGETB" "NULLSWAPIFNOT";
(cell, slice, int) udict_replace_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEGETB" "NULLSWAPIFNOT";
(cell, slice, int) idict_replace_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEGETB" "NULLSWAPIFNOT";
(cell, (slice, int)) ~dict_replace_get_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTREPLACEGETB" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_replace_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEGETB" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_replace_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEGETB" "NULLSWAPIFNOT";

(cell, int) dict_add_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTADDREF";
(cell, int) udict_add_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUADDREF";
(cell, int) idict_add_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIADDREF";

(cell, slice, int) dict_add_get?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTADDGET" "NULLSWAPIF";
(cell, slice, int) udict_add_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADDGET" "NULLSWAPIF";
(cell, slice, int) idict_add_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADDGET" "NULLSWAPIF";
(cell, (slice, int)) ~dict_add_get?(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTADDGET" "NULLSWAPIF";
(cell, (slice, int)) ~udict_add_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADDGET" "NULLSWAPIF";
(cell, (slice, int)) ~idict_add_get?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADDGET" "NULLSWAPIF";

(cell, cell, int) dict_add_get_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTADDGETREF" "NULLSWAPIF";
(cell, cell, int) udict_add_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUADDGETREF" "NULLSWAPIF";
(cell, cell, int) idict_add_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIADDGETREF" "NULLSWAPIF";
(cell, (cell, int)) ~dict_add_get_ref?(cell dict, int key_len, slice index, cell value) asm(value index dict key_len) "DICTADDGETREF" "NULLSWAPIF";
(cell, (cell, int)) ~udict_add_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUADDGETREF" "NULLSWAPIF";
(cell, (cell, int)) ~idict_add_get_ref?(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTIADDGETREF" "NULLSWAPIF";

(cell, slice, int) dict_add_get_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTADDGETB" "NULLSWAPIF";
(cell, slice, int) udict_add_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDGETB" "NULLSWAPIF";
(cell, slice, int) idict_add_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDGETB" "NULLSWAPIF";
(cell, (slice, int)) ~dict_add_get_builder?(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTADDGETB" "NULLSWAPIF";
(cell, (slice, int)) ~udict_add_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDGETB" "NULLSWAPIF";
(cell, (slice, int)) ~idict_add_get_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDGETB" "NULLSWAPIF";

(cell, cell, int) dict_delete_get_ref?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDELGETREF" "NULLSWAPIFNOT";
(cell, cell, int) udict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGETREF" "NULLSWAPIFNOT";
(cell, cell, int) idict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~dict_delete_get_ref?(cell dict, int key_len, slice index) asm(index dict key_len) "DICTDELGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~udict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGETREF" "NULLSWAPIFNOT";
(cell, (cell, int)) ~idict_delete_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGETREF" "NULLSWAPIFNOT";

(cell, slice, cell, int) dict_delete_get_min_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMINREF" "NULLSWAPIFNOT2";
(cell, int, cell, int) udict_delete_get_min_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMINREF" "NULLSWAPIFNOT2";
(cell, int, cell, int) idict_delete_get_min_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMINREF" "NULLSWAPIFNOT2";
(cell, (slice, cell, int)) ~dict_delete_get_min_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMINREF" "NULLSWAPIFNOT2";
(cell, (int, cell, int)) ~udict_delete_get_min_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMINREF" "NULLSWAPIFNOT2";
(cell, (int, cell, int)) ~idict_delete_get_min_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMINREF" "NULLSWAPIFNOT2";

(cell, slice, cell, int) dict_delete_get_max_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAXREF" "NULLSWAPIFNOT2";
(cell, int, cell, int) udict_delete_get_max_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAXREF" "NULLSWAPIFNOT2";
(cell, int, cell, int) idict_delete_get_max_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAXREF" "NULLSWAPIFNOT2";
(cell, (slice, cell, int)) ~dict_delete_get_max_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAXREF" "NULLSWAPIFNOT2";
(cell, (int, cell, int)) ~udict_delete_get_max_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAXREF" "NULLSWAPIFNOT2";
(cell, (int, cell, int)) ~idict_delete_get_max_ref?(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAXREF" "NULLSWAPIFNOT2";

;; ===== HASHES =====

int        sha256_from_snake(slice snake)    asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH HASHEXT_SHA256 }> 1 1 CALLXARGS";
[int, int] sha512_from_snake(slice snake)    asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH HASHEXT_SHA512 }> 1 1 CALLXARGS";
[int, int] blake2b_from_snake(slice snake)   asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH HASHEXT_BLAKE2B }> 1 1 CALLXARGS";
int        keccak256_from_snake(slice snake) asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH HASHEXT_KECCAK256 }> 1 1 CALLXARGS";
[int, int] keccak512_from_snake(slice snake) asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH HASHEXT_KECCAK512 }> 1 1 CALLXARGS";

builder store_sha256_from_snake(builder b, slice snake)    asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH DEC HASHEXTA_SHA256 }> 2 1 CALLXARGS";
builder store_sha512_from_snake(builder b, slice snake)    asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH DEC HASHEXTA_SHA512 }> 2 1 CALLXARGS";
builder store_blake2b_from_snake(builder b, slice snake)   asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH DEC HASHEXTA_BLAKE2B }> 2 1 CALLXARGS";
builder store_keccak256_from_snake(builder b, slice snake) asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH DEC HASHEXTA_KECCAK256 }> 2 1 CALLXARGS";
builder store_keccak512_from_snake(builder b, slice snake) asm "CONT:<{ WHILE:<{ DUP SREFS }>DO<{ LDREFRTOS }> DEPTH DEC HASHEXTA_KECCAK512 }> 2 1 CALLXARGS";

;; ===== SIGNATURES =====

int check_secp256r1_signature(int hash, slice signature, int public_key) asm "P256_CHKSIGNU";
int check_secp256r1_data_signature(slice data, slice signature, int public_key) asm "P256_CHKSIGNS";
int check_bls_signature(slice data, slice signature, int public_key) asm(public_key data signature) "BLS_VERIFY";

int slice_data_equal? (slice a, slice b) asm "SDEQ";

tuple god_forgive_me_for_this_type([int, int, int, int, int, int, int, int, int, int, int, int, int] specific_tuple) asm "NOP";

int fast_dec_pow(int e) {
  var t = god_forgive_me_for_this_type([
    1, ;; 0
    10,
    100,
    1000,
    10000,
    100000, ;; 5
    1000000,
    10000000,
    100000000,
    1000000000,
    10000000000, ;; 10
    100000000000,
    1000000000000 ;; 12
  ]);
  return t.at(e);
}
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

(slice, slice) load_bits_refs(slice s, int bits, int refs) asm "SPLIT" "SWAP";
(slice, (slice)) ~load_bits_refs(slice s, int bits, int refs) asm "SPLIT" "SWAP";
cell get_code() asm "MYCODE";

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/external/ton.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "stdlib.fc";
;; Functions, which are common for TON in general

forall X -> int cast_to_int(X x) asm "NOP";

(int) get_current_workchain () {
	var (wc, _) = parse_std_addr(my_address());
	return (wc);
}

;; Based on:
;; https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc#L6
const int cant_have_this_many_cells = 1 << 64;
int cell_fwd_fee(int wc, cell content) impure inline {
	throw_unless(107, (wc == -1) | (wc == 0) );
	int config_index = 25 + wc;
	slice cfg = config_param(config_index).begin_parse().skip_bits(8);
	int lump_price = cfg~load_uint(64);
	int bit_price = cfg~load_uint(64);
	int cell_price = cfg~load_uint(64);

	(int cells, int bits, _) = compute_data_size(content, cant_have_this_many_cells);
	cells -= 1;
	bits -= content.begin_parse().slice_bits();

	return lump_price + ((bits * bit_price + cells * cell_price + 65535) >> 16 );
}

int modest_fwd_fee_estimation(int fwd_fee) {
	return muldiv(fwd_fee, 3, 2);
	;; we use message fwd_fee for estimation of other similar-sized messages' costs
}


```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/addr-calc.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../external/ton.fc";
#include "../storage/user-storage.fc";

cell pack_state_init(cell code, cell data) inline {
	return begin_cell()
		.store_uint(0, 2)
		.store_dict(code)
		.store_dict(data)
		.store_uint(0, 1)
		.end_cell();
}

(slice) calculate_address (cell state_init) {
	int wc = get_current_workchain();
	return begin_cell()
		.store_uint(4, 3)
		.store_int(wc, 8)
		.store_uint(cell_hash(state_init), 256)
		.end_cell()
		.begin_parse();
}

slice calc_address_from_hash (int addr_hash) inline {
	int wc = get_current_workchain();
	return begin_cell().store_uint(4, 3)
	.store_int(wc, 8)
	.store_uint(addr_hash, 256)
	.end_cell()
	.begin_parse();
}

slice calc_master_wallet_address_from_asset_id(int asset_id, cell token_keys) inline {
	(int wallet_address_hash, slice data, int flag) = token_keys.udict_get_min?(256);
	while (flag) {
		int ticker_hash = data~load_uint(256);
		if (ticker_hash == asset_id) {
			return calc_address_from_hash(wallet_address_hash);
		}

		(wallet_address_hash, data, flag) = token_keys.udict_get_next?(256, wallet_address_hash);
	}
	return null();
}
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
cell platform::calculate_blank_state_init(
    cell blank_code,
    slice platform_address, slice owner_address,
    int type_id, cell params
) inline {
    return pack_state_init(
        blank_code,
        begin_cell()
            .store_slice(platform_address)
            .store_slice(owner_address)
            .store_uint(type_id, 8)
            .store_maybe_ref(params)
            .end_cell()
    );
}

;; Functions to calculate lending-user Smart Contract's state_init
;; and, correspondingly, lending-user's address

cell calculate_user_init_data(int code_version, slice owner_address) {
  return user::storage::pack_init(
    code_version,
    my_address(),
    owner_address,
    new_dict(),
    user_state::free
  );
}

cell calculate_user_state_init(cell blank_code, slice owner_address) {
  return platform::calculate_blank_state_init(
    blank_code,
    my_address(), owner_address,
    0, null()
  );
}

slice calculate_user_address(cell blank_code, slice owner_address) {
  return calculate_address(calculate_user_state_init(blank_code, owner_address));
}


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
  int borrow_asset_id, int borrow_liquidate_amount,
  int collateral_asset_id, cell prices_packed
) method_id {
  (_, _, cell asset_config_collection, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  (int result, _) = get_collateral_quote(asset_config_collection,
    borrow_asset_id, borrow_liquidate_amount, collateral_asset_id, prices_packed);
  return result;
}

(int, int) getUpdatedRates (
  cell asset_config_collection, cell asset_dynamics_collection,
  int asset_id, int time_elapsed 
) method_id {
  return get_current_rates(
    asset_config_collection, asset_dynamics_collection,
    asset_id, time_elapsed);
}

(cell) getUpdatedRatesForAllAssets (int time_elapsed) method_id {
  (cell meta, cell update_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection) = master::storage::load();
  (int asset_id, slice asset_dynamics, int flag) = asset_dynamics_collection.udict_get_min?(256);
  cell rates = new_dict();
  while (flag) {
    var (cumulative_supply_rate, cumulative_borrow_rate) = get_current_rates(
      asset_config_collection, asset_dynamics_collection,
      asset_id, time_elapsed);
    slice cumulative_asset_rates = begin_cell()
      .store_sb_rate(cumulative_supply_rate)
      .store_sb_rate(cumulative_borrow_rate)
      .end_cell()
      .begin_parse();
    rates~udict_set(256, asset_id, cumulative_asset_rates);
    (asset_id, asset_dynamics, flag) = asset_dynamics_collection.udict_get_next?(256, asset_id);
  }
  return (rates);
}

(int, int) getAssetRates (int asset_id) method_id {
  (_, _, cell asset_config_collection, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  var (supply_rate, borrow_rate) = get_asset_interests(asset_config_collection, asset_dynamics_collection, asset_id);
  return (supply_rate, borrow_rate);
}

(cell) get_assets_rates () method_id {
  (cell meta, cell update_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection) = master::storage::load();
  (int asset_id, slice asset_dynamics, int flag) = asset_dynamics_collection.udict_get_min?(256);
  cell rates = new_dict();
  while (flag) {
    var (supply_rate, borrow_rate) = get_asset_interests(asset_config_collection, asset_dynamics_collection, asset_id);
    slice asset_rates = begin_cell()
      .store_sb_rate(supply_rate)
      .store_sb_rate(borrow_rate)
      .end_cell()
      .begin_parse();
    rates~udict_set(256, asset_id, asset_rates);
    (asset_id, asset_dynamics, flag) = asset_dynamics_collection.udict_get_next?(256, asset_id);
  }
  return (rates);
}

(int) getAssetReserves (int asset_id) method_id {
  (_, _, cell asset_config_collection, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  return get_asset_reserves(asset_config_collection, asset_dynamics_collection, asset_id);
}

(cell) get_assets_reserves () method_id {
  (cell meta, cell update_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection) = master::storage::load();
  (int asset_id, slice asset_dynamics, int flag) = asset_dynamics_collection.udict_get_min?(256);
  cell reserves = new_dict();
  while (flag) {
    int reserve = get_asset_reserves(asset_config_collection, asset_dynamics_collection, asset_id);
    slice asset_reserve = begin_cell().store_int(reserve, 65).end_cell().begin_parse();
    reserves~udict_set(256, asset_id, asset_reserve);
    (asset_id,  asset_dynamics, flag) = asset_dynamics_collection.udict_get_next?(256, asset_id);
  }
  return (reserves);
}

(int, int) getAssetTotals (int asset_id) method_id {
  (_, _, cell asset_config_collection, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  var (total_supply, total_borrow) = get_asset_totals(asset_config_collection, asset_dynamics_collection, asset_id);
  return (total_supply, total_borrow); 
}

(cell) getAssetsData () method_id {
  (cell meta, cell update_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection) = master::storage::load();
  return (asset_dynamics_collection);
}

(cell) getAssetsConfig () method_id {
  (cell meta, cell update_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection) = master::storage::load();
  return (asset_config_collection);
}

(cell) getConfig () method_id {
  slice ds = get_data().begin_parse();
  cell meta = ds~load_ref();
  cell upgrade_config = ds~load_ref();
  cell marketConfig = ds~load_ref();
  return (begin_cell()
  .store_ref(meta) ;; meta
  .store_ref(upgrade_config) ;; upgrade_config
  .store_ref(marketConfig) ;; config
  .end_cell());
}

(cell) getStore () method_id {
  ;; UPD changed to get entire store ; we can parse it offchain
  ;; its like getConfig but with asset_dinamics
  return (get_data());
}

(cell, cell, cell, cell) getUIVariables () method_id {
  cell config = getConfig();
  cell asset_dynamics_collection = getAssetsData();
  cell assets_rates = get_assets_rates();
  cell assets_reserves = get_assets_reserves();
  return (asset_dynamics_collection, config, assets_rates, assets_reserves);
}
  
slice get_user_address(slice owner_address) method_id {
  return calculate_user_address(BLANK_CODE(), owner_address);
}

int claim_asset_reserves_min_attachment(int fwd_fee) method_id {
  int fwd_fee_upper_bound = modest_fwd_fee_estimation(fwd_fee);
  return
    ;; 1 message: master -> user or jetton-wallet
    fwd_fee_upper_bound + 
    fee::claim_asset_reserves +
    constants::jetton_send_ton_attachment;
    ;; ^ asset to claim might be jetton, or might be TON
    ;; in case of TON, adding jetton-TON-attachment is actually not necessary,
    ;; but let's not add extra branches to the code for little benefit
}

cell dummy_supply_user_message() method_id {
  ;; Most values don't really matter:
  ;; they just need to be there to occupy space,
  ;; so we can use this message to call withdraw_min_attachment
  ;; and estimate the corresponding TON attachment
  return pack_supply_user_message(
    1111, ;; query_id
    22222, ;; asset_id,
    333333, ;; amount,
    4444444, ;; s_rate,
    55555555, ;; b_rate,
    666666666, ;;dust
    7777777777, ;; max_token_amount
    88888888888, ;; total_supply
    88888888888, ;; total_borrow
    999999999999, ;; tracking_supply_index
    88888888888, ;; tracking_borrow_index
    0,
    begin_cell().end_cell()
  );
}

int supply_min_attachment(int fwd_fee, cell supply_user_message) method_id {
  int fwd_fee_upper_bound = modest_fwd_fee_estimation(fwd_fee);
  return
    ;; 3 messages: master -> user, user -> master
    2 * fwd_fee_upper_bound +
    cell_fwd_fee(
      get_current_workchain(),
      supply_user_message
    ) +
    ;; potential User upgarde
    fee::user_upgrade +
    ;; 2 transactions
    fee::incoming_asset +
    fee::supply_user +
    fee::supply_success +
    fee::log_tx +
    ;; storage on user
    fee::min_tons_for_storage;
}

cell dummy_withdraw_user_message() method_id {
  (_, _, cell asset_config_collection, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  ;; Most values don't really matter:
  ;; they just need to be there to occupy space,
  ;; so we can use this message to call withdraw_min_attachment
  ;; and estimate the corresponding TON attachment
  return pack_withdraw_user_message(
    1111, ;; query_id
    22222, ;; asset_id,
    333333, ;; amount,
    4444444, ;; s_rate,
    55555555, ;; b_rate,
    ;; asset_config_collection, asset_dynamics_collection
    ;; ^ though need to be legit, because they can greatly vary in size
    asset_config_collection,
    asset_dynamics_collection,
    begin_cell().end_cell(),
     ;; recipient_address,
    my_address(),
    0,
    begin_cell().end_cell()
    ;; todo do we need to have actual price dict here?
    ;;todo if we will need this function, then price dict should be here
  );
}

int withdraw_min_attachment(int fwd_fee, cell withdraw_user_message) method_id {
  int fwd_fee_upper_bound = modest_fwd_fee_estimation(fwd_fee);
  return
    ;; 4 messages: master -> user | user -> master | master -> user & master -> jetton-wallet
    ;; The first one contains significantly more info, because it needs to include s/b-rates and prices for all assets,
    ;; so I use cell_fwd_fee to calculate the forward fee for its content,
    ;; but I also account for it in fwd_fee_upper_bound multiplier (4, instead of 3), because it also includes state init
    4 * fwd_fee_upper_bound +
    cell_fwd_fee(
      get_current_workchain(),
      withdraw_user_message
    ) +
    ;; potential User upgarde
    fee::user_upgrade +
    ;; 5 transactions in the success case
    fee::withdraw_master +
    fee::withdraw_user +
    fee::withdraw_collateralized +
    fee::log_tx +
    fee::withdraw_success +
    constants::jetton_send_ton_attachment +
    ;; op::withdraw_fail would have a larger fee,
    ;; but failing doesn't come with sending jettons.
    ;; Thus, combined fees in the case of success (fee::withdraw_success + constants::jetton_send_ton_attachment)
    ;; are larger than "fee::withdraw_fail" would have been.
    ;; Storage on user
    fee::min_tons_for_storage;
}

cell dummy_liquidate_user_message() method_id {
  (_, _, cell asset_config_collection, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  ;; Most values don't really matter:
  ;; they just need to be there to occupy space,
  ;; so we can use this message to call withdraw_min_attachment
  ;; and estimate the corresponding TON attachment
  return pack_liquidate_user_message(
    1111, ;; query_id
    asset_config_collection, asset_dynamics_collection,
    22222, ;; collateral_asset_id
    333333, ;; min_collateral_amount
    my_address(),
    44444, ;; transferred_asset_id
    555555, ;; transferred_amount
    666666, 
    begin_cell().end_cell(),
    begin_cell().end_cell()
  );
}

int liquidate_min_attachment(int fwd_fee, cell liquidate_user_message) method_id {
  int fwd_fee_upper_bound = modest_fwd_fee_estimation(fwd_fee);
  return
    ;; 4 messages: master -> user | user -> master | master -> user & master -> jetton-wallet
    ;; The first one contains significantly more info, because it needs to include s/b-rates and prices for all assets,
    ;; so I use cell_fwd_fee to calculate the forward fee for its content,
    ;; but I also account for it in fwd_fee_upper_bound multiplier (4, instead of 3), because it also includes state init
    4 * fwd_fee_upper_bound +
    cell_fwd_fee(
      get_current_workchain(),
      liquidate_user_message
    ) +
    ;; potential User upgarde
    fee::user_upgrade +
    ;; 5 transactions in the liquidate_satisfied case
    fee::liquidate_master +
    fee::liquidate_user +
    fee::liquidate_satisfied +
    fee::log_tx +
    fee::liquidate_fail + 
    constants::jetton_send_ton_attachment +
    ;; With liquidation, in case it fails at the last step
    ;; (on master, because there is not enough liquidity)
    ;; User fail also consumes more than success (because it reverts)
    ;; but (unlike withdraw) Master needs to send assets either way
    ;; (either refund in case of fail, or reward in case of success)
    ;; so failed branch would have larger total fee
    ;; Storage on user
    fee::min_tons_for_storage;
}

;; nns2009 added for testing/debugging/analysis
(int, int) get_asset_total_principals(int asset_id) method_id {
  (_, _, _, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  (_, _, int total_supply_principal, int total_borrow_principal, _, _, _, _, _)
    = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);
  return (total_supply_principal, total_borrow_principal);
}

int get_asset_balance(int asset_id) method_id {
  (_, _, _, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  (_, _, _, _, _, int balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);
  return balance;
}

int get_asset_liquidity_by_id(int asset_id) method_id {
  (_, _, _, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  (int s_rate, int b_rate,
   int total_supply_principal, int total_borrow_principal,
    _, int asset_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);
  ;;NOTE if we want to set liquidity as supply - borrow then uncomment here
  ;;return get_asset_liquidity(total_supply_principal, total_borrow_principal, s_rate, b_rate);
  return (asset_balance);
}

int get_asset_liquidity_minus_reserves_by_id(int asset_id) method_id {
  (_, _, _, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  (int s_rate, int b_rate,
   int total_supply_principal, int total_borrow_principal,
    _, int asset_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);
  ;;NOTE if we want to set liquidity as supply - borrow then uncomment here
  return get_asset_liquidity_minus_reserves(total_supply_principal, total_borrow_principal, s_rate, b_rate, asset_balance);
}

(int, int) get_asset_sb_rate(int asset_id) method_id {
  (_, _, _, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  (int s_rate, int b_rate, _, _, _, _, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);
  return (s_rate, b_rate);
}

int get_active() method_id {
  (_, _, _, int if_active, _, _, _, _) = master::storage::load();
  return if_active;
}

(cell) getTokensKeys () method_id {
  (_, _, _, _, _, _, cell tokens_keys, _) = master::storage::load();
  return (tokens_keys);
}

(int) getLastUserScVersion() method_id {
  (_, cell upgrade_config, _, _, _, _, _, _) = master::storage::load();
  (
    int master_version, int user_version,
    int timeout, int update_time, int freeze_time,
    cell user_code,
    cell new_master_code, cell new_user_code
  ) = unpack_upgrade_config(upgrade_config);
  return user_version;
}

(int, int, int, int, int, cell, cell, cell) getUpgradeConfig() method_id {
  (_, cell upgrade_config, _, _, _, _, _, _) = master::storage::load();
  return upgrade_config.unpack_upgrade_config();
}

(int, int, int) get_asset_tracking_info(int asset_id) method_id {
  (_, _, _, _, _, _, _, cell asset_dynamics_collection) = master::storage::load();
  (_, _, _, _, int last_accrual, _, int tracking_supply_index, int tracking_borrow_index, _
  ) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);
  return (tracking_supply_index, tracking_borrow_index, last_accrual);
}

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
  int my_balance, int msg_value, cell in_msg_full, slice in_msg_body,
  slice sender_address, int addr_hash, int fwd_fee,
  cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection
) impure inline {
  if (~ slice_data_equal?(sender_address, admin)) { ;; if not Admin
    slice in_msg_body_copy = in_msg_body; 
    int op = in_msg_body_copy~load_op_code();
    int query_id = in_msg_body_copy~load_query_id();

    if ((op == op::supply_master)
      | (op == op::withdraw_master)
      | (op == op::liquidate_master)
      | (op == op::idle_master))
      ;; ^ one of the "front-facing" op-codes, which initiate new operations
    {
      ;; Stop processing and return TONs back to owner
      throw(error::disabled);
    } elseif (op == jetton_op::transfer_notification) {
      ;; If it is jetton supply / jetton liquidate
      (_, int f) = tokens_keys.udict_get?(256, addr_hash);
      throw_unless(error::received_unsupported_jetton, f); ;; check jetton is supported
      ;; NOTE: !! It might be possible to refund unsupported jettons / do we need to refund them?

      int jetton_amount = in_msg_body_copy~load_coins(); 
      slice from_address = in_msg_body_copy~load_msg_addr();
      if (~ slice_data_equal?(from_address, admin)) { ;; if not Admin
        ;; return jettons back to Owner
        ;; NOTE: !!! will be nice to check that sender has enough TON attachment for gas
        ;; (here and in other such places)
        respond_send_jetton(
          sender_address, from_address,
          query_id, jetton_amount,
          begin_cell().store_op_code(error::disabled).store_ref(begin_cell().store_slice(in_msg_body).end_cell()).end_cell(), 0 ;; lets send entire body on disabled so third party can process it ;; todo would be nice to have not a 0 here but some amount setted by sender
          ;; NOTE: !! Do we need to also store some other info?
        ); 
        return ret::stop_execution;
      }
      ;; else: Jetton sender is Admin: allow operation
      ;; although it's not exactly clear:
      ;; why would Admin want to Supply/Liquidate something while the Protocol is stopped, but let's keep this option open.
      ;; Maybe some intricate Liquidate cases might arrise that need this kind of fixing?
    }
    ;; else: it is one of the "internal" op codes (from User smart contracts to Master)
    ;; We don't allow owners to initiate new operations,
    ;; but we allow all ongoing operations to finish processing.
    ;; The validity of such [internal] requests
    ;; (that they had been sent by a real User smart contract)
    ;; is going to be verified as usual in the corresponding op code handlers

    ;; op-code is one of the "internal" ones as described ^
  }
  return ret::continue_execution;
  ;; Sender is Admin (either "directly" or through Jetton transfer) or ^
}

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
  cell asset_config_collection, cell asset_dynamics_collection,
  int asset_id
) {
  var (asset_s_rate, asset_b_rate, total_supply_principal, total_borrow_principal, last_accrual, asset_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

  (int jw_address_hash, int decimals, int collateral_factor, int liquidation_threshold, _, int base_borrow_rate, int borrow_rate_slope_low, int borrow_rate_slope_high, int supply_rate_slope_low, int supply_rate_slope_high, int target_utilization, int origination_fee, int dust, _, int reserve_factor, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

  int total_supply = present_value_supply_calc(asset_s_rate, total_supply_principal);
  int total_borrow = present_value_borrow_calc(asset_b_rate, total_borrow_principal);
  int utilization = 0;
  int supply_interest = 0;
  int borrow_interest = 0;

  if (total_supply == 0) {
    utilization = 0;
  } else {
    utilization = total_borrow * constants::factor_scale / total_supply;
  }

  if (utilization <= target_utilization) {
    borrow_interest = base_borrow_rate
      + muldiv(borrow_rate_slope_low, utilization, constants::factor_scale);
  } else {
    borrow_interest = base_borrow_rate
      + muldiv(borrow_rate_slope_low, target_utilization, constants::factor_scale)
      + muldiv(borrow_rate_slope_high, (utilization - target_utilization), constants::factor_scale);
  }

  supply_interest =
    borrow_interest
    .muldiv(utilization, constants::factor_scale)
    .muldiv(constants::reserve_scale - reserve_factor, constants::reserve_scale);
  return (supply_interest, borrow_interest);
}

(int, int) get_current_rates (
  cell asset_config_collection, cell asset_dynamics_collection,
  int asset_id, int time_elapsed
) {
  var (s_rate, b_rate, total_supply_principal, total_borrow_principal, last_accrual, asset_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

  if (time_elapsed > 0) {
    (int supply_rate, int borrow_rate) = get_asset_interests(asset_config_collection, asset_dynamics_collection, asset_id);
    int updated_s_rate = s_rate + muldiv(s_rate, supply_rate * time_elapsed, constants::factor_scale);
    int updated_b_rate = b_rate + muldiv(b_rate, borrow_rate * time_elapsed, constants::factor_scale);

    return (updated_s_rate, updated_b_rate);
  }
  return (s_rate, b_rate);
}


(int, int) accrue_tracking_indexes(int tracking_supply_index, int tracking_borrow_index, int last_accrual, int total_supply, int total_borrow, int decimals, int min_principal_for_rewards, int base_tracking_supply_speed, int base_tracking_borrow_speed) inline {
    if ((now() - last_accrual > 0) & (min_principal_for_rewards > 0)) {
        ;; we set min_principal_for_rewards to 0 to disable rewards
        int timeElapsed = now() - last_accrual;
        if (total_supply >= min_principal_for_rewards) {
            tracking_supply_index += muldiv(base_tracking_supply_speed * timeElapsed, fast_dec_pow(decimals), total_supply);
        }
        if (total_borrow >= min_principal_for_rewards) {
            tracking_borrow_index += muldiv(base_tracking_borrow_speed * timeElapsed, fast_dec_pow(decimals), total_borrow);
        }
    }
    return (tracking_supply_index, tracking_borrow_index);
}

(cell) update_master_lm_indexes(cell assets_config_collection, cell dynamics_collection) {
    cell new_assets_dynamics_collection = new_dict();

    (int asset_id, slice asset_dynamics, int flag) = dynamics_collection.udict_get_min?(256);
    while (flag) {
        (
            int asset_s_rate, int asset_b_rate,
            int total_supply_principal, int total_borrow_principal,
            int last_accrual,
            int token_balance,
            int old_tracking_supply_index, int old_tracking_borrow_index,
            int awaited_supply
        ) = asset_dynamics.unpack_asset_dynamics();

        ;; should exist, `found` is not necessary
        (slice asset_slice, _) = assets_config_collection.udict_get?(256, asset_id);

        (_, int decimals, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
            int min_principal_for_rewards, int base_tracking_supply_speed, int base_tracking_borrow_speed
        ) = asset_slice.unpack_asset_config();

        ;; Note Replace after upgrade with proper loads!
        (int tracking_supply_index, int tracking_borrow_index) = accrue_tracking_indexes(
            old_tracking_supply_index, old_tracking_borrow_index,
            last_accrual,
            total_supply_principal, total_borrow_principal,
            decimals, min_principal_for_rewards,
            base_tracking_supply_speed, base_tracking_borrow_speed
        );

        int time_elapsed = now() - last_accrual;
        (asset_s_rate, asset_b_rate) = get_current_rates(
            assets_config_collection, dynamics_collection,
            asset_id, time_elapsed
        );

        cell asset_dynamics_new = pack_asset_dynamics(
            asset_s_rate, asset_b_rate,
            total_supply_principal, total_borrow_principal,
            now(), token_balance,
            tracking_supply_index, tracking_borrow_index,
            awaited_supply
        );

        new_assets_dynamics_collection~udict_set(256, asset_id, asset_dynamics_new.begin_parse());

        (asset_id, asset_dynamics, flag) = dynamics_collection.udict_get_next?(256, asset_id);
    }
    return new_assets_dynamics_collection;
}

(cell, ()) update_old_rates_and_provided_asset_id (
cell asset_dynamics_collection, cell asset_config_collection,
  int required_asset_id1, int required_asset_id2
) {
  (int asset_id, slice asset_dynamics, int flag) = asset_dynamics_collection.udict_get_min?(256);
  while (flag) {
    (
      int asset_s_rate, int asset_b_rate,
      int total_supply_principal, int total_borrow_principal,
      int last_accrual, int token_balance,
      int tracking_supply_index, int tracking_borrow_index,
      int awaited_supply
    ) = asset_dynamics.unpack_asset_dynamics();

    int is_required_asset? = (asset_id == required_asset_id1) | (asset_id == required_asset_id2);
    int time_elapsed = now() - last_accrual;
    if ((time_elapsed > 0) & ((is_required_asset?) | (time_elapsed > constants::consider_rates_old_after))) {
        (asset_s_rate, asset_b_rate) = get_current_rates(
            asset_config_collection, asset_dynamics_collection,
            asset_id,
            time_elapsed
        );
        ;; Update tracking indexes
        (_, int decimals, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
            int min_principal_for_rewards, int base_tracking_supply_speed, int base_tracking_borrow_speed
        ) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

        (tracking_supply_index, tracking_borrow_index) = accrue_tracking_indexes(
            tracking_supply_index, tracking_borrow_index, last_accrual,
            total_supply_principal, total_borrow_principal, decimals,
            min_principal_for_rewards, ;; < note we need to accrue interests on OLD totals.
            ;; ^ so, total_supply_principal and total_borrow_principal NOT new_total_supply and new_total_borrow.
            ;; ^ because we need to calculate rewards for the period from last_accrual_timestamp to now
            base_tracking_supply_speed, base_tracking_borrow_speed
        );
        
        asset_dynamics_collection~asset_dynamics_collection:set_packed(
            asset_id,
            asset_s_rate, asset_b_rate, ;; These are NEW (not unpacked) computed values
            total_supply_principal, total_borrow_principal,
            now(), ;; last_accrual updated because s_rate and b_rate are new
            token_balance, ;; this doesn't change, because withdraw is not yet confirmed
            tracking_supply_index, tracking_borrow_index,
            awaited_supply
        );
    }

    (asset_id, asset_dynamics, flag) = asset_dynamics_collection.udict_get_next?(256, asset_id);
  }

  return (asset_dynamics_collection, ());
}

;; DAO's money
int get_asset_reserves_direct(
  int asset_balance,
  int s_rate, int total_supply_principal,
  int b_rate, int total_borrow_principal
) {
  int total_supply = present_value_supply_calc(s_rate, total_supply_principal);
  int total_borrow = present_value_borrow_calc(b_rate, total_borrow_principal);
  return (asset_balance - total_supply + total_borrow);
}

(int) get_asset_reserves (
  cell asset_config_collection,
  cell asset_dynamics_collection,
  int asset_id
) {
  var (_, _, total_supply_principal, total_borrow_principal, last_accrual, asset_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

  (int s_rate, int b_rate) = get_current_rates(
    asset_config_collection, asset_dynamics_collection,
    asset_id, now() - last_accrual
  );
  return get_asset_reserves_direct(
    asset_balance,
    s_rate, total_supply_principal,
    b_rate, total_borrow_principal
  );
}

;; Function to calculate how much of specific asset
;; protocol has available for withdrawing or liquidation
;;NOTE if we want to set liquidity as supply - borrow then use this function everywhere where i leftet NOTEs  
int get_asset_liquidity(
  int total_supply_principal,
  int total_borrow_principal,
  int s_rate, int b_rate
) {
  int total_supply = present_value_supply_calc(s_rate, total_supply_principal);
  int total_borrow = present_value_borrow_calc(b_rate, total_borrow_principal);
  return total_supply - total_borrow;
}
;; This ^ formula might look strange, but we get it by subtracting:
;; asset_balance - developers_money
;; (substituting developers_money)
;; = asset_balance - (asset_balance - total_supply + total_borrow)
;; = total_supply - total_borrow

int get_asset_liquidity_minus_reserves(
  int total_supply_principal,
  int total_borrow_principal,
  int s_rate, int b_rate, int token_balance
) {
  int total_supply = present_value_supply_calc(s_rate, total_supply_principal);
  int total_borrow = present_value_borrow_calc(b_rate, total_borrow_principal);
  return min(total_supply - total_borrow, token_balance);
}

(int, int) get_asset_totals (
  cell asset_config_collection,
  cell asset_dynamics_collection,
  int asset_id
) {
  var (_, _, total_supply_principal, total_borrow_principal, last_accrual, _, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

  (int s_rate, int b_rate) = get_current_rates(
    asset_config_collection, asset_dynamics_collection,
    asset_id, now() - last_accrual
  );
  int total_supply = present_value_supply_calc(s_rate, total_supply_principal);
  int total_borrow = present_value_borrow_calc(b_rate, total_borrow_principal);
  return (total_supply, total_borrow);
}

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

const int jetton_op::transfer = 0x0f8a7ea5;
const int jetton_op::transfer_notification = 0x7362d09c;
const int jetton_op::excesses = 0xd53276db;

;; https://docs.ton.org/develop/smart-contracts/messages
() send_message(
	slice to_address, int nano_ton_amount,
	cell content, int mode
) impure {
	var msg = begin_cell()
		.store_uint(0x10, 6) ;; todo: !!!! Any way to reasonably process bounced messages
		;; ??? Sends non-bounceable. Does it need to be a parameter?
		.store_slice(to_address)
		.store_grams(nano_ton_amount)
		.store_uint(0, 1 + 4 + 4 + 64 + 32 + 1)
		.store_maybe_ref(content); ;; body:(Either X ^X)

	send_raw_message(msg.end_cell(), mode);
}

() send_jetton(
	slice my_jetton_wallet_address,
	slice to_address,
	int query_id, int amount,
	int nano_ton_attachment, cell body, int mode
) impure {
	send_message(
		my_jetton_wallet_address,
		0, ;; because we using mode 128 +raw_reserve everywhere we dont need ton amount here
		begin_cell()
		.store_op_code(jetton_op::transfer)
		.store_query_id(query_id)
		.store_grams(amount) ;; jetton amount
		.store_slice(to_address) ;; new owner
		.store_slice(to_address) ;; response_destination -> refund excess fees to the owner
		.store_maybe_ref(body) ;; custom_response_payload
		.store_grams(nano_ton_attachment) ;; minimum nano-TON amount to send transfer_notification
		;;.store_bool(false) ;; forward_payload
		.store_maybe_ref(body) ;; custom_response_payload
		.end_cell(),
		mode ;; send mode
	);
}

;; Carries all the remaining TON balance
() respond_send_jetton(
	slice my_jetton_wallet_address,
	slice to_address,
	int query_id, int amount,
	cell body, int forward_ton_amount
) impure {
	send_jetton(
		my_jetton_wallet_address,
		to_address,
		query_id, amount,
		forward_ton_amount, ;; nanotons
		body,
		sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE 
	);
}

() reserve_and_send_rest(
	int nano_ton_amount_to_reserve,
	slice to_address, cell content
) impure {
	raw_reserve(nano_ton_amount_to_reserve, reserve::REGULAR);
	send_message(to_address, 0, content, sendmode::CARRY_ALL_BALANCE);
}

() try_reserve_and_send_rest(
	int nano_ton_amount_to_reserve,
	slice to_address, cell content
) impure {
	raw_reserve(nano_ton_amount_to_reserve, reserve::AT_MOST);
	send_message(to_address, 0, content, sendmode::CARRY_ALL_BALANCE + 2);
}

() send_message_to_lending_wallet_by_address(
  cell state_init, int ton_amount, int user_version, cell upgrade_info,
  slice lending_wallet_address, builder content,
  int message_send_mode
) impure {
  builder msg = begin_cell()
                .store_uint(0x10, 6) ;; Non-bounceable to be able to deploy
                .store_slice(lending_wallet_address)
                .store_grams(ton_amount)
                .store_uint(0, 1 + 4 + 4 + 64 + 32);

  if (state_init.null?()) {
    msg = msg.store_uint(1, 2); ;; $ 01
  } else {
    msg = msg.store_uint(7, 3).store_ref(state_init); ;; $ 111
  }

  msg = msg.store_ref(
    begin_cell()
      .user::upgrade::store_header(user_version, upgrade_info, true)
      .store_builder(content)
      ;; ^ NOTE: !!! Consider changing upgrade format so that "content" is completely independent from the header. At the moment, upgrade header uses 1 reference out of available 4 to be stored in the cell. So whoever constructs "content" needs keep that in mind and use no more than 3 references. In the future, in case upgrade header starts using 2 references, some of the previous code for "content" (which thought 3 references are ok) would be broken
      .end_cell()
  );

  send_raw_message(msg.end_cell(), message_send_mode);
}

;; ??? Do we need send-mode as a separate parameter?
() send_message_to_lending_wallet( ;; note rename landing_wallet to user sc
  cell blank_code, int user_version, cell user_code,
  slice owner_address, cell content,
  int message_send_mode
) impure {
  cell state_init = calculate_user_state_init(blank_code, owner_address);
  slice lending_wallet_address = calculate_address(state_init);

	cell upgrade_info = null();
	ifnot (user_code.null?()) {
		;; NOTE: !! Gas optimization
		;; Code rearranged to do not call the following line when not needed!
		cell user_data = calculate_user_init_data(user_version, owner_address);
		upgrade_info = begin_cell().store_ref(user_code).store_ref(user_data).end_cell();
	}

  send_message_to_lending_wallet_by_address(
    state_init, 0, user_version, upgrade_info,
    lending_wallet_address, begin_cell().store_slice(content.begin_parse()),
    message_send_mode
  );
}

() send_asset_ext(
	slice to_address,
	int query_id, int addr_hash, int amount,
	int nano_ton_attachment, cell body, int mode
) impure {
	;; todo: !! Consider sending asset with raw_reserve and mode=128
	;; such that the exact network fee remainders are refunded
	;; In this case also update the tests to require exact equality
	if (addr_hash == constants::ton_asset_id) {
		send_message(
			to_address, amount + nano_ton_attachment,
			body,
			mode ;; send mode
		);
	} else {
		send_jetton(
			calc_address_from_hash(addr_hash), 
			to_address, ;; new owner, and also:
			;; response_destination -> refund excess fees to the owner
			query_id, amount, ;; jetton amount
			nano_ton_attachment, 
			body, ;; custom_response_payload
			mode
		);
	}
}

() send_asset(
	slice to_address,
	int query_id, int addr_hash, int amount,
	int nano_ton_attachment
) impure {
	send_asset_ext(
		to_address,
		query_id, addr_hash, amount,
		nano_ton_attachment,
		begin_cell().end_cell(), ;; todo: send some proper comment, with query_id?
		sendmode::REGULAR
	);
}

;; Used to refund asset in THE SAME transaction as it arrived thus being able to use mode=64 and refund exact remains
() immediate_asset_refund(
	slice to_address,
	int query_id, int asset_id, int amount,
	cell body, int forward_ton_amount
) impure {
	if (asset_id == constants::ton_asset_id) {
		send_message(
			to_address, 0,
			body, 
			sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
		);
	} else {
		respond_send_jetton(
			calc_address_from_hash(asset_id), 
			to_address,
			query_id, amount, ;; jetton amount
			body, forward_ton_amount
		);
	}
}

() emit_log_simple (cell data) impure inline {
  var msg = begin_cell()
     .store_uint(12, 4)         ;; ext_out_msg_info$11 src:MsgAddressInt ()
     .store_uint(1, 2)          ;; addr_extern$01
     .store_uint(256, 9)        ;; len:(## 9)
     .store_uint(0, 256)       ;; external_address:(bits len)
     .store_uint(1, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either
     .store_ref(data)
     .end_cell();
  send_raw_message(msg, 0);
}

() emit_log_crash(int error_code, int op, int query_id) {
  emit_log_simple(
	  begin_cell()
	  .store_uint(log::execution_crashed, 8)
	  .store_uint(error_code, 16)
	  .store_op_code(op)
	  .store_query_id(query_id)
	  .end_cell()
  );
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/user-get-methods.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../storage/user-storage.fc";
#include "user-utils.fc";
#include "master-utils.fc";

(int) getAccountAssetBalance (int asset_id, int s_rate, int b_rate) method_id {
  cell user_principals = user::storage::load_principals();
  int res = get_account_asset_balance(asset_id, s_rate, b_rate, user_principals);
  return res;
}

(cell) getAccountBalances (cell asset_dynamics_collection) method_id {
  cell user_principals = user::storage::load_principals();
  (int asset_id, slice asset_value_principal_packed, int flag) = user_principals.principals:get_min?();
  cell account_balances = new_dict();
  while (flag) {
    int asset_value_principal = asset_value_principal_packed.packed_principal:unpack();

    var (asset_s_rate, asset_b_rate, total_supply_principal, total_borrow_principal, last_accrual, token_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

    int balance = present_value(asset_s_rate, asset_b_rate, asset_value_principal);
    ;; int balance = get_account_asset_balance(asset_id, asset_s_rate, asset_b_rate, user_principals);
    ;; Function get_account_asset_balance first fetches the corresponding principal from the dictionary
    ;; by asset_id, but it's not necessary because we already have it as part of enumeration
    account_balances~udict_set(256, asset_id, begin_cell().store_int(balance, 65).end_cell().begin_parse()); ;; nns2009 -> todo@sepezho: !! I did a project-wide search for 65, but I didn't quite understand why this specific number was chosen
    (asset_id, asset_value_principal_packed, flag) = user_principals.principals:get_next?(asset_id);
  }
  return (account_balances);
}

(int) getAccountHealth (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed) method_id {
  cell user_principals = user::storage::load_principals();
  (int result, _) = account_health_calc(asset_config_collection, asset_dynamics_collection, user_principals, prices_packed);
  return result;
}

(int) getAvailableToBorrow (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed) method_id {
  cell user_principals = user::storage::load_principals();
  (int result, _) = get_available_to_borrow(
    asset_config_collection, asset_dynamics_collection,
    user_principals, prices_packed
  );
  return result;
}

;; ??? todo: this method is questionable to have on user, because it takes space on every user-instance
;; It should probably be moved to the master
(int) getIsLiquidable (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed) method_id {
  cell user_principals = user::storage::load_principals();
  (int result, _, _, _) = is_liquidatable(asset_config_collection, asset_dynamics_collection, user_principals, prices_packed);
  return result;
}

(int, int) getAggregatedBalances (cell asset_config_collection, cell asset_dynamics_collection, cell prices_packed) method_id {
  cell user_principals = user::storage::load_principals();
  (int res1, int res2, _) = get_agregated_balances(asset_config_collection, asset_dynamics_collection, user_principals, prices_packed);
  return (res1, res2);
}

(int) codeVersion() method_id {
  (int code_version, _, _, _, _, _, _, _) = user::storage::load();
  return code_version;
}

(int) isUserSc () method_id {
  return (-1); ;;for liquidation bot
}

;; nns2009 added for Testing
int get_asset_principal(int asset_id) method_id {
  cell user_principals = user::storage::load_principals();
  return user_principals.get_principal(asset_id);
}

cell getPrincipals () method_id {
  cell user_principals = user::storage::load_principals();
  return user_principals;
}

cell getRewards () method_id {
  (_, _, _, _, _, cell user_rewards, _, _) = user::storage::load();
  return user_rewards;
}

(int, slice, slice, cell, int, cell, cell, cell) getAllUserScData () method_id {
  return user::storage::load();
}

(int) get_maximum_withdraw_amount(int asset_id, cell prices_packed, cell asset_config_collection, cell asset_dynamics_collection) method_id {
  cell user_principals = user::storage::load_principals();
  int old_principal = user_principals.get_principal(asset_id);
  (int result, _) = calculate_maximum_withdraw_amount(
    asset_config_collection, asset_dynamics_collection,
    user_principals, prices_packed, asset_id, old_principal
  );
  return result;
}

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
    slice sender_address, slice owner_address,
    slice in_msg_body
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
        .store_op_code(op::revert_call) ;; 32
        .store_query_id(99999999) ;; 64
        ;; todo: !! ^ Should maybe use original query_id
        .store_slice(owner_address) ;; 3+8+256
        ;; Part above is totalling: 32 + 64 + 3+8+256 = 363 bits,
        ;; which is significant -> Let's keep in_msg_body in a separate cell
        .store_ref(
            begin_cell().store_slice(in_msg_body).end_cell()
        )
        .end_cell(),
        sendmode::CARRY_ALL_REMAINING_MESSAGE_VALUE
    );
    commit(); 
    throw(error::user_code_version_mismatch);
}

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

(slice) on_upgrade(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure method_id (0x137) {
  slice ds = get_data().begin_parse();
  int code_version = ds~load_coins();
  slice master_address = ds~load_msg_addr();
  slice owner_address = ds~load_msg_addr();
  cell user_principals = ds~load_dict();
  int state = ds~load_int(64);
  
  if (ds.slice_empty?()) {
    ;; means that user sc just deployed on blank
    cell user_rewards = new_dict();
    cell backup_cell_1 = null();
    cell backup_cell_2 = null();
    user::storage::save(
      code_version,
      master_address, owner_address,
      user_principals, state, 
      user_rewards, backup_cell_1, backup_cell_2
    );
  }

  return in_msg_body;
}


(slice, int) upgrade_user_process (int my_balance, int msg_value, cell in_msg_full, slice in_msg_body, slice sender_address, int addr_hash, int self_code_version, slice master_address, cell upgrade_info_cell, int expected_code_version, int upgrade_exec, slice ds, slice  in_msg_body_original) impure inline {
  (
    int code_version, slice master_address, slice owner_address, cell user_principals, int state, cell user_rewards, cell backup_cell_1, cell backup_cell_2
  ) = user::storage::load();

  ;; We need to check if the user is in free state before upgrading
  if (state == user_state::free) {
    try {
      throw_if(error::broken_upgrade_info, upgrade_info_cell.null?());

      ;; we need to pack it before set_c3
      ;; so, universal_data is coming from old version of contract code (from current version for N+1 next versoin of the code)
      cell universal_data = user::upgrade::pack_universal_storage_after_v6(master_address, owner_address, user_principals, state, user_rewards, backup_cell_1, backup_cell_2);

      slice data_without_version = get_data().begin_parse();
      data_without_version~skip_coins();
      int old_data_hash = slice_hash(data_without_version);

      slice upgrade_info = upgrade_info_cell.begin_parse();
      throw_unless(error::broken_upgrade_info, upgrade_info.slice_refs() == 2);
      cell new_code = upgrade_info~load_ref();
      cell new_data = upgrade_info.preload_ref();

      set_code(new_code);
      ;; ***********************************************************************************************************************************************
      set_c3(new_code.begin_parse().bless()); ;; ****************************************************************************************************
      ;; ***********************************************************************************************************************************************

      int allow_data_change = false;

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

      if (code_version == 0) {
        ;; allow on_upgrade to process init data to actual format
        allow_data_change = true;
      }

      set_data(
        begin_cell()
        .store_coins(expected_code_version)
        .store_slice(data_without_version) ;; .store_builder(builded_store)
        .end_cell()
      );

      ;; the call must at least upgrade init data to actual format
      in_msg_body = on_upgrade(my_balance, msg_value, in_msg_full, in_msg_body);

      ;; Run a quick and dirty test to make sure that the contract can route internal messages
      recv_internal(my_balance, msg_value, in_msg_full,
        begin_cell().user::upgrade::store_header(expected_code_version, null(), true)
          .store_op_code(op::do_data_checks).store_query_id(0).end_cell().begin_parse()
      );

      ifnot (allow_data_change) {
        slice new_data_without_version = get_data().begin_parse();
        int new_code_version_for_check = new_data_without_version~load_coins();
        int new_data_hash = slice_hash(new_data_without_version);

        throw_unless(error::user_data_changed, new_code_version_for_check == expected_code_version);
        throw_unless(error::user_data_changed, old_data_hash == new_data_hash);
      }
    } catch (_, _) {
      slice owner_address = ds~load_msg_addr();
      revert_call(sender_address, owner_address, in_msg_body_original);
      return (in_msg_body, ret::stop_execution);
    }
  } else {
    return (in_msg_body, ret::stop_execution); ;; state is not free -> stop
  }
  return (in_msg_body, ret::continue_execution);
}

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

int get_principal(cell principals, int asset_id) {
  (slice cs, int f) = principals.udict_get?(256, asset_id);
  if (f) {
    return cs.preload_principal();
  } else {
    return 0;
    ;; Default to zero,
    ;; so it doesn't have to store all possible assets from the start
    ;; and the supported assets can be extended by changing master's config
  }
}

(cell, ()) ~set_principal(cell principals, int asset_id, int amount) {
  return (
    principals.udict_set_builder(256, asset_id,
      begin_cell().store_principal(amount)),
    ()
  );
}

int packed_principal:unpack(slice principal_packed) {
  return principal_packed.preload_principal();
}

;; asset_id, principal_packed, found?
(int, slice, int) principals:get_min?(cell principals) {
  (int asset_id, slice principal_packed, int flag) = principals.udict_get_min?(256);
  return (asset_id, principal_packed, flag);

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
}

(int, slice, int) principals:get_next?(cell principals, int asset_id) {
  return principals.udict_get_next?(256, asset_id);
}

(int, int) get_reward(cell rewards, int asset_id) inline {
  (slice rewards_packed, int found) = rewards.udict_get?(256, asset_id);
  int tracking_index = 0;
  int tracking_accrued = 0;
  if (found) {
    tracking_index = rewards_packed~load_tracking_index();
    tracking_accrued = rewards_packed.preload_tracking_index();
  }
  return (tracking_index, tracking_accrued);
}

(cell, ()) ~set_reward(cell rewards, int asset_id, int tracking_index, int tracking_accrued) inline {
  return (
    rewards.udict_set_builder(256, asset_id,
      begin_cell().store_uint(tracking_index, 64).store_uint(tracking_accrued, 64)),
    ()
  );
}


(int, int) account_health_calc (
  cell asset_config_collection,
  cell asset_dynamics_collection,
  cell user_principals,
  cell prices_packed
) {
  int borrow_amount = 0;
  int borrow_limit = 0;

  (int asset_id, slice asset_value_principal_packed, int flag) = user_principals.principals:get_min?();
  while (flag) {
    int asset_value_principal = asset_value_principal_packed.packed_principal:unpack();

    if (asset_value_principal) { ;; != 0

      int price = prices_packed.prices_packed:get?(asset_id);

      if (price == -1) {
        return (0, false);
      }

      var (asset_s_rate, asset_b_rate, total_supply_principal, total_borrow_principal, last_accrual, token_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

      (int jw_address_hash, int decimals, int collateral_factor, int liquidation_threshold, _, int base_borrow_rate, int borrow_rate_slope_low, int borrow_rate_slope_high, int supply_rate_slope_low, int supply_rate_slope_high, int target_utilization, _, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

      if (asset_value_principal < 0) {
        borrow_amount += present_value_borrow_calc(asset_b_rate, - asset_value_principal * price / fast_dec_pow(decimals));
      } else {
        borrow_limit += present_value_supply_calc(asset_s_rate, asset_value_principal * price * liquidation_threshold / fast_dec_pow(decimals) / constants::asset_coefficient_scale);
      }

    }

    (asset_id, asset_value_principal_packed, flag) = user_principals.principals:get_next?(asset_id);
  }
  return (constants::factor_scale - (borrow_limit * constants::factor_scale / borrow_amount), true); ;; // it will be account_health (which is 1 - totalBorrowBalance / totalSupplyBalance) times constants::factor_scale
}

(int) check_not_in_debt_at_all (
  cell user_principals
) {
  ;; this function checks if the user has any debt
  (int asset_id, slice asset_value_principal_packed, int flag) = user_principals.principals:get_min?();

  while (flag) {
    int asset_value_principal = asset_value_principal_packed.packed_principal:unpack();
    if (asset_value_principal < 0) {
      return false; ;; user has debt in at least one asset
    }
    (asset_id, asset_value_principal_packed, flag) = user_principals.principals:get_next?(asset_id);
  }
  return true;
}

(int, int, int, int) is_liquidatable (
  cell asset_config_collection,
  cell asset_dynamics_collection,
  cell user_principals,
  cell prices_packed
) {
  int borrow_amount = 0;
  int borrow_limit = 0;
  int supply_amount = 0;

  (int asset_id, slice asset_value_principal_packed, int flag) = user_principals.principals:get_min?();
  while (flag) {
    int asset_value_principal = asset_value_principal_packed.packed_principal:unpack();

    if (asset_value_principal) { ;; != 0

      int price = prices_packed.prices_packed:get?(asset_id);

      if (price == -1) {
        return (false, false, 0, 0);
      }

      var (asset_s_rate, asset_b_rate, total_supply_principal, total_borrow_principal, last_accrual, token_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

      (int jw_address_hash, int decimals, int collateral_factor, int liquidation_threshold, _, int base_borrow_rate, int borrow_rate_slope_low, int borrow_rate_slope_high, int supply_rate_slope_low, int supply_rate_slope_high, int target_utilization, int origination_fee, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

      if (asset_value_principal < 0) {
        borrow_amount += present_value_borrow_calc(asset_b_rate, - asset_value_principal * price / fast_dec_pow(decimals));
      } else {
        borrow_limit += present_value_supply_calc(asset_s_rate, asset_value_principal * price * liquidation_threshold / fast_dec_pow(decimals) / constants::asset_coefficient_scale);
        supply_amount += present_value_supply_calc(asset_s_rate, asset_value_principal * price / fast_dec_pow(decimals));
      }

    }

    (asset_id, asset_value_principal_packed, flag) = user_principals.principals:get_next?(asset_id);
  }
  return (borrow_limit < borrow_amount, true, supply_amount, borrow_amount);
}

(int, int) get_available_to_borrow(
  cell asset_config_collection, cell asset_dynamics_collection,
  cell user_principals, cell prices_packed
) {
  int borrow_limit = 0;
  int borrow_amount = 0;

  (int asset_id, slice asset_value_principal_packed, int flag) =  user_principals.principals:get_min?();
  while (flag) {
    int asset_value_principal = asset_value_principal_packed.packed_principal:unpack();

    if (asset_value_principal) { ;; != 0

      int price = prices_packed.prices_packed:get?(asset_id);

      if (price == -1) {
        ;; if prices are not ok, result shall be -1, and therefore is_borrow_collateralized will return false
        return (-1, false);
      }

      var (asset_s_rate, asset_b_rate, total_supply_principal, total_borrow_principal, last_accrual, token_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

      (int jw_address_hash, int decimals, int collateral_factor, int liquidation_threshold, _, int base_borrow_rate, int borrow_rate_slope_low, int borrow_rate_slope_high, int supply_rate_slope_low, int supply_rate_slope_high, int target_utilization, int origination_fee, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

      if (asset_value_principal < 0) {
        borrow_amount += muldiv(present_value_borrow_calc(asset_b_rate, - asset_value_principal), price, fast_dec_pow(decimals));
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
      } else {
        ;; borrow_limit += present_value_supply_calc(asset_s_rate, asset_value_principal) * price * collateral_factor / fast_dec_pow(decimals) / constants::asset_coefficient_scale;
        borrow_limit += muldiv(
          muldiv(present_value_supply_calc(asset_s_rate, asset_value_principal), price, fast_dec_pow(decimals)),
          collateral_factor, constants::asset_coefficient_scale
        );
      }

    }

    (asset_id, asset_value_principal_packed, flag) = user_principals.principals:get_next?(asset_id);
  }
  return (borrow_limit - borrow_amount, true);
}

(int, int) is_borrow_collateralized (
  cell asset_config_collection, cell asset_dynamics_collection,
  cell user_principals, cell prices_packed
) {
  if(check_not_in_debt_at_all(user_principals)){
    ;; user hasn't borrowed any asset so we can ignore the borrow check
    return (true, true);
  }

  (int avail, int enough_price_data) = (get_available_to_borrow(
      asset_config_collection, asset_dynamics_collection,
      user_principals, prices_packed
  ));

  ;; if prices are not ok, avail shall be -1, and therefore this will return false
  return (avail >= 0, enough_price_data);
}

(int) get_account_asset_balance (
  int asset_id,
  int s_rate, int b_rate,
  cell user_principals
) {
  int asset_value_principal = user_principals.get_principal(asset_id);
  return present_value(s_rate, b_rate, asset_value_principal);
}

(int, int, int) get_agregated_balances (
  cell asset_config_collection,
  cell asset_dynamics_collection,
  cell user_principals,
  cell prices_packed
) {
  int user_total_supply = 0;
  int user_total_borrow = 0;

  (int asset_id, slice asset_value_principal_packed, int flag) =  user_principals.principals:get_min?();
  while (flag) {
    int asset_value_principal = asset_value_principal_packed.packed_principal:unpack();

    if (asset_value_principal) {

      int price = prices_packed.prices_packed:get?(asset_id);

      if (price == -1) {
        return (0, 0, false);
      }

      var (asset_s_rate, asset_b_rate, total_supply_principal, total_borrow_principal, last_accrual, token_balance, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);

      (int jw_address_hash, int decimals, int collateral_factor, int liquidation_threshold, _, int base_borrow_rate, int borrow_rate_slope_low, int borrow_rate_slope_high, int supply_rate_slope_low, int supply_rate_slope_high, int target_utilization, int origination_fee, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);

      if (asset_value_principal < 0) {
        user_total_borrow += present_value_borrow_calc(asset_b_rate, - asset_value_principal) * price / fast_dec_pow(decimals);
      } else {
        user_total_supply += present_value_supply_calc(asset_s_rate, asset_value_principal) * price / fast_dec_pow(decimals);
      }

    }
    (asset_id, asset_value_principal_packed, flag) = user_principals.principals:get_next?(asset_id);
  }
  return (user_total_supply, user_total_borrow, true);
}

(int, int) calculate_maximum_withdraw_amount(
  cell asset_config_collection, cell asset_dynamics_collection,
  cell user_principals, cell prices_packed, int asset_id, int old_principal
) {
  int withdraw_amount_max = 0;
  (_, int decimals, int collateral_factor, _, _, _, _, _, _, _, _, _, int dust, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(asset_id);
  
  if (old_principal > dust) { 
    
    var (asset_s_rate, asset_b_rate, _, _, _, _, _, _, _) = asset_dynamics_collection.asset_dynamics_collection:get_unpacked(asset_id);
    int old_present_value = present_value(asset_s_rate, asset_b_rate, old_principal);

    if(check_not_in_debt_at_all(user_principals)){
      ;; user hasn't borrowed any asset so we can set withdraw max as balance of asset
      withdraw_amount_max = old_present_value; ;; withdraw all positive principal without prices if user has no debt
    } else {
      int price = prices_packed.prices_packed:get?(asset_id);

      if (price == -1) {
        return (0, false);
      }

      int max_amount_to_reclaim = 0;
      if (collateral_factor == 0) {
        max_amount_to_reclaim = old_present_value;
      }
      ;; if price == 0 then max_amount_to_reclaim = 0, as defined above
      elseif (price > 0) {
        (int borrowable, int prices_ok) = get_available_to_borrow(asset_config_collection, asset_dynamics_collection, user_principals, prices_packed);
        ifnot (prices_ok) {
          return (0, false);
        }

        max_amount_to_reclaim =
          max(0, muldiv(
            muldiv(borrowable, constants::asset_coefficient_scale, collateral_factor), ;; * asset_parameter_scale / CF_i
            fast_dec_pow(decimals), price ;; * asset_scale_i / price_i
          ) - present_value_supply_calc(asset_s_rate, dust) / 2); 
        ;; <likely fixed with muldiv considering the muldivc in the get_available_to_borrow code> 
        ;; consider changing muldiv to smth like (x * y + z - 1) / z in future (?)
      }

      withdraw_amount_max = min( ;; we want to reclaim as much as possible (cause user have dept), but not more than old_principal
        max_amount_to_reclaim,
        old_present_value
      );
    }
  } else {
    int price = prices_packed.prices_packed:get?(asset_id);

    if (price == -1) {
      return (0, false);
    }

    (withdraw_amount_max, int enough_price_data) = get_available_to_borrow(
      asset_config_collection, asset_dynamics_collection,
      user_principals, prices_packed);

    ifnot (enough_price_data) {
      return (0, false);
    }

    withdraw_amount_max = withdraw_amount_max.muldiv(
      fast_dec_pow(decimals),
      price
    );
  }
  return (withdraw_amount_max, true);
}

(int, int) accrue_user_indexes (int base_tracking_index, int base_tracking_accrued, int tracking_supply_index, int tracking_borrow_index, int old_principal, int new_principal) {
  if (old_principal >= 0) {
    int index_delta = tracking_supply_index - base_tracking_index;
    base_tracking_accrued += muldiv(old_principal, index_delta, constants::tracking_index_scale);
  } else {
    int index_delta = tracking_borrow_index - base_tracking_index;
    base_tracking_accrued += muldiv(- old_principal, index_delta, constants::tracking_index_scale);
  }

  if (new_principal >= 0) {
    base_tracking_index = tracking_supply_index;
  } else {
    base_tracking_index = tracking_borrow_index;
  }
  return (base_tracking_index, base_tracking_accrued);
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/logic/utils.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../constants/constants.fc";
#include "../data/prices-packed.fc";
#include "../data/asset-config-packer.fc";
#include "../external/openlib.fc";

(int) present_value_supply_calc (int index, int principal_value) inline {
  return muldiv(principal_value, index, constants::factor_scale);
}

(int) present_value_borrow_calc (int index, int principal_value) inline {
  return muldivc(principal_value, index, constants::factor_scale);
}

(int) principal_value_supply_calc (int s_rate, int present_value) inline {
  return s_rate > 0 ? muldiv(present_value, constants::factor_scale, s_rate) : 0;
}

(int) principal_value_borrow_calc (int b_rate, int present_value) inline {
  ;; was: (present_value * constants::factor_scale + b_rate - 1) / b_rate
  ;; adding (b_rate - 1) before dividing by b_rate is equivalent to rounding up (muldivc)
  return b_rate > 0 ? muldivc(present_value, constants::factor_scale, b_rate) : 0;
}

(int) present_value(int s_rate, int b_rate, int principal_value) inline {
  if (principal_value >= 0) {
    return present_value_supply_calc(s_rate, principal_value);
  } else {
    return present_value_borrow_calc(b_rate, principal_value);
  }
}

(int) principal_value(int s_rate, int b_rate, int present_value) inline {
  if (present_value >= 0) {
    return principal_value_supply_calc(s_rate, present_value);
  } else {
    return principal_value_borrow_calc(b_rate, present_value);
  }
}

(int, int) around_zero_split(int lower, int upper) {
  int below = 0;
  int above = 0;
  
  throw_if(error::around_zero_split_messed_up, lower > upper); ;; we need to make sure that lower is always less than upper

  if (lower < 0) {
    if (upper <= 0) {
      below = upper - lower;
    } else {
      below = - lower;
      above = upper;
    }
  } else {
    above = upper - lower;
  }
  return (below, above);
}

(int, int) get_collateral_quote (
  cell asset_config_collection,
  int borrow_asset_id, int borrow_liquidate_amount,
  int collateral_asset_id, cell prices_packed
) {
  int collateral_price = prices_packed.prices_packed:get?(collateral_asset_id);
  if (collateral_price == -1) { return (-1, false); }
  (_, int collateral_decimals, _, _, int liquidation_bonus, _, _, _, _, _, _, _, _, _, _, _, _, _, _) = asset_config_collection.asset_config_collection:get_unpacked(collateral_asset_id);

  int borrow_price = prices_packed.prices_packed:get?(borrow_asset_id);
  if (borrow_price == -1) { return (-1, false); }
  int borrow_decimals = asset_config_collection.asset_config_collection:decimals(borrow_asset_id);

  if (collateral_price == 0) { return (-1, true); }

  return (muldiv(
    borrow_price * borrow_liquidate_amount * fast_dec_pow(collateral_decimals),
    liquidation_bonus,
    constants::asset_coefficient_scale ;; ??? This coefficient
  ) / collateral_price ;; used to be asset_price_discounted
    / fast_dec_pow(borrow_decimals), true);
}

(int) is_valid_address?(slice address) inline {
  ifnot (ext::addr_std_any_wc?(address)) {
    return false;
  }
  return ext::is_on_same_workchain?(address);
}

(int) is_valid_custom_response_payload?(cell custom_response_payload) inline {
  (_, _, _, int f?) = compute_data_size?(custom_response_payload, constants::custom_response_payload_max_cells);
  return f?;
}

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

  cs~load_msg_addr(); ;; skip dst
  cs~load_grams(); ;; skip value
  cs~load_dict(); ;; skip extracurrency collection
  cs~load_grams(); ;; skip ihr_fee
  int fwd_fee = cs~load_grams();

  (cell meta, cell upgrade_config, cell asset_config_collection, int if_active, slice admin, slice oracles_info, cell tokens_keys,  cell asset_dynamics_collection) = master::storage::load();
  
  if (~ if_active) { ;; if the Protocol is off
    int stop_execute = if_active_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection ;; storage params
    );
    if (stop_execute) {
      return ();
    }
  }

  int op = in_msg_body~load_op_code();
  int query_id = in_msg_body~load_query_id();

  if (op == op::get_store) {
    get_store_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  ;; ------------------------- admin start -------------------------
  if (op == op::init_master) { ;; works only once on sc deployment
    init_master_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::update_config) {
    update_config_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::add_new_token) {
    add_new_token_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::claim_asset_reserves) {
    claim_asset_reserves_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }
  
  if (op == op::force_enable) {
    force_enable_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::force_disable_contract) {
   force_disable_contract_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
   );
    return ();
  }

  if (op == op::disable_contract_for_upgrade) {
    disable_contract_for_upgrade_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }
  
  if (op == op::init_upgrade) {
    init_upgrade_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::submit_upgrade) {
    submit_upgrade_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::cancel_upgrade) {
    cancel_upgrade_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }
  
  ;; note: can be called by admin to idle other user sc / or can be called by user sc owner to idle his user sc
  if (op == op::idle_master) {
    idle_master_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }
  
  ;; ------------------------- admin end -------------------------

  ;; ------------------------- supply start -------------------------
  if (op == op::supply_master) {
    ;; Allowed to throw, bounce will return TONs
    ;; N.B. This flow is called ONLY for native TON supply
    supply_master_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::supply_success) {
    ;; A dangerous spot was wrapped inside, other parts of the function are crucial for the logic
    supply_success_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::supply_fail) {
    ;; There is nothing we can do if this function crashes, it is already as simple as possible
    supply_fail_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    ); 
    return ();
  }
  ;; ------------------------- supply end -------------------------

  ;; ------------------------- withdraw start -------------------------
  if (op == op::withdraw_master) {
    ;; Allowed to throw, bounce will return TONs
    withdraw_master_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::withdraw_collateralized) {
    try {
      withdraw_collateralized_process(
        my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
        sender_address, addr_hash, fwd_fee, ;; in_msg_full params
        meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
        op, query_id ;; trx body
      );
    } catch (_, error_code) {
      if (error_code == error::withdraw_collateralized_fake_sender) {
        throw(error_code);
      }
      emit_log_crash(error_code, op, query_id);
      withdraw_collateralized_handle_exception(in_msg_body, sender_address, upgrade_config, query_id);
      ;; Quis custodiet ipsos custodes? There is really nothing we can do if exception handler crashes.
      ;; Therefore, minimum amount of parameters is passed and amount of code is used.
    }
    return ();
  }
  ;; ------------------------- withdraw end -------------------------
  
  ;; ------------------------- liquidate start -------------------------
  if (op == op::liquidate_master) {
    ;; Allowed to throw, bounce will return TONs
    ;; N.B. This flow is called ONLY for liquidation with native TONs
    liquidate_master_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::liquidate_unsatisfied) {
    ;; There is nothing we can do if this function crashes, it is already as simple as possible
    liquidate_unsatisfied_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == op::liquidate_satisfied) {
    try {
      liquidate_satisfied_process(
        my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
        sender_address, addr_hash, fwd_fee, ;; in_msg_full params
        meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
        op, query_id ;; trx body
      );
    } catch (_, error_code) {
      if (error_code == error::liquidate_satisfied_fake_sender) {
        throw(error_code);
      }
      emit_log_crash(error_code, op, query_id);
      liquidate_satisfied_handle_exception(
        my_balance, msg_value, in_msg_body, sender_address, fwd_fee, upgrade_config, asset_config_collection, query_id
      );
    }
    return ();
  }
  ;; ------------------------- liquidate end -------------------------
  
  ;; ------------------------- other start -------------------------
  if (op == op::revert_call) {
    revert_call_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }

  if (op == jetton_op::transfer_notification) {
    ;; transfer_notification format specified here:
    ;; https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
    ;; transfer_notification#7362d09c
    ;;    query_id:uint64
    ;;    amount:(VarUInteger 16)
    ;;    sender:MsgAddress
    ;;    forward_payload:(Either Cell ^Cell)
    int jetton_amount = in_msg_body~load_coins(); 
    slice from_address = in_msg_body~load_msg_addr();
    
    ;; sender_address is the address of our jetton wallet
    ;; (which received money and notified us)
    ;; we need to find which jetton_type this wallet corresponds to
    
	  (_, int f) = tokens_keys.udict_get?(256, addr_hash);
    throw_unless(error::received_unsupported_jetton, f);
    ;; Either this jetton type is not supported (whitelisted)
    ;; (??? Should we refund them? Is it even technically possible?)
    ;; or someone just tried to hack-send us a transfer_notification from a random address

    ;; at this point: in_msg_body = forward_payload:(Either Cell ^Cell)
    int load_ref = in_msg_body~load_int(1);
    if (load_ref) {
      in_msg_body = in_msg_body.preload_ref().begin_parse();
    }

    int jetton_op_code = in_msg_body~load_op_code();

    ( _, int user_version, _, _, _, cell user_code, _, _
    ) = upgrade_config.unpack_upgrade_config();

    ;; If we crashed before try-catch, then this is an issue with body contents, that user provides.
    try {
      if (jetton_op_code == op::supply_master) {
        ;; ------------------------- jetton supply start -------------------------
        supply_master_jetton_process(
          my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
          sender_address, addr_hash, fwd_fee, ;; in_msg_full params
          meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
          jetton_op_code, query_id, jetton_amount, from_address, user_version, user_code ;; jetton tx body params
        );
        return ();
        ;; ------------------------- jetton supply end -------------------------
      } elseif (jetton_op_code == op::liquidate_master) {
        ;; ------------------------- jetton liquidate start -------------------------
        liquidate_master_jetton_process(
          my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
          sender_address, addr_hash, fwd_fee, ;; in_msg_full params
          meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
          jetton_op_code, query_id, jetton_amount, from_address, user_version, user_code ;; jetton tx body params
        );
        return ();
        ;; ------------------------- jetton liquidate end -------------------------
      } else {
        respond_send_jetton(
          sender_address, from_address,
          query_id, jetton_amount,
          begin_cell().store_op_code(error::unsupported_jetton_op_code).end_cell(), 0
        );
        return ();
      }
    } catch (_, error_code) {
      emit_log_crash(error_code, jetton_op_code, query_id);
      respond_send_jetton(
        sender_address, from_address,
        query_id, jetton_amount,
        begin_cell().store_op_code(error::jetton_execution_crashed).end_cell(), 0
      );
      return ();
    }
  }

  if (op == jetton_op::excesses) {
    ;; note Just accept TON excesses after sending jettons
    return ();
  }

  if (op == op::do_data_checks) {
    ;; Used for immediate testing during upgrade process or after unsafe data changes
    do_data_checks_process(
      my_balance, msg_value, in_msg_full, in_msg_body, ;; recv_internal params
      sender_address, addr_hash, fwd_fee, ;; in_msg_full params
      meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection, ;; storage params
      op, query_id ;; trx body
    );
    return ();
  }
  ;; ------------------------- other end -------------------------
  
  throw(0xffff); 
}


```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/messages/admin-message.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/basic-types.fc";

(slice, int, int) parse_claim_asset_reserves_message(slice cs) {
	slice target_address = cs~load_msg_addr();
	int asset_id = cs~load_asset_id();
	int amount_to_claim = cs~load_amount();
	cs.end_parse();
	return (
		target_address,
		asset_id, amount_to_claim
	);
}


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
(slice) parse_idle_master_message(slice cs) {
	slice target_address = cs~load_msg_addr(); ;; target_address
	cs.end_parse();
	
	return (
		target_address
	);
}

;; --------------- op::idle_user ---------------
cell pack_idle_user_message(
	cell tokens_keys,
  int query_id,
	slice originator_address
) {
	return begin_cell()
		.store_op_code(op::idle_user) ;; 32
		.store_query_id(query_id)
    	.store_dict(tokens_keys)
		.store_slice(originator_address)
		.end_cell();
}

(cell, slice) parse_idle_user_message(slice cs) {
	return (
		cs~load_dict(),
    	cs~load_msg_addr()
	);
}

;; --------------- op::idle_excess ---------------
;; Idle excess message - refund extra TON attachment back to originator
cell pack_idle_excess_message(int query_id) {
	return begin_cell()
		.store_op_code(op::idle_excess)
		.store_query_id(query_id)
		.end_cell();
}

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

(slice, slice, int, int, int, int, int, cell, cell) parse_liquidate_master_message(slice cs) {
	slice borrower_address = cs~load_msg_addr(); ;;256
	slice liquidator_address = cs~load_msg_addr(); ;;256
	int collateral_asset_id = cs~load_asset_id(); ;;256
	int min_collateral_amount = cs~load_amount(); ;;64
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
	int include_user_code = cs~load_bool_ext(); ;; bool
	int liquidate_incoming_amount = cs~load_amount(); ;;64 
	cell response_payload_packed = cs~load_ref();
	slice response_payload_unpacked = response_payload_packed.begin_parse();
	int forward_ton_amount = response_payload_unpacked~load_amount(); ;;64 
	cell custom_response_payload = response_payload_unpacked~load_ref();
	cell prices_with_signature_packed = cs~load_ref();
	cs.end_parse();
	return (
		borrower_address, liquidator_address,
		collateral_asset_id, min_collateral_amount,
		liquidate_incoming_amount, include_user_code,
		forward_ton_amount, 
		custom_response_payload, prices_with_signature_packed
	);
}

;; ---------- op::liquidate_user ----------

cell pack_liquidate_user_message(
	int query_id,
	cell asset_config_collection, cell asset_dynamics_collection,
	int collateral_asset_id, int min_collateral_amount,
	slice liquidator_address,
	int transferred_asset_id, int transfered_amount,
	int forward_ton_amount, cell custom_response_payload,
	cell prices_packed
) {
	return begin_cell()
		.store_op_code(op::liquidate_user) ;; 32
		.store_query_id(query_id) ;; 64
		.store_dict(asset_config_collection) ;; 1 ^1
		.store_dict(asset_dynamics_collection) ;; 1 ^1
		.store_ref( ;; ^1
			begin_cell()
			.store_ref(prices_packed) ;; ^1
			.store_asset_id(collateral_asset_id) ;; 256
			.store_amount(min_collateral_amount) ;; 64
			.store_slice(liquidator_address) ;; 256
			.store_asset_id(transferred_asset_id) ;; 256
			.store_amount(transfered_amount) ;; 64
			.store_amount(forward_ton_amount) ;; 64
			.store_ref(custom_response_payload) ;; ^1
			.end_cell()
		)
		.end_cell();
}

(cell, cell, cell, int, int, slice, int, int, int, cell) parse_liquidate_user_message(slice cs) {
	cell asset_config_collection = cs~load_dict();
	cell asset_dynamics_collection = cs~load_dict();
	cs = cs.preload_ref().begin_parse();
	cell prices_packed = cs~load_ref();
	int collateral_asset_id = cs~load_asset_id();
	int min_collateral_amount = cs~load_amount();
	;; cs = cs.preload_ref().begin_parse();
	slice liquidator_address = cs~load_msg_addr();
	int transferred_asset_id = cs~load_asset_id();
	int transfered_amount = cs~load_amount();
	int forward_ton_amount = cs~load_amount();
	cell custom_response_payload = cs~load_ref();
	return (
		asset_config_collection, asset_dynamics_collection, prices_packed,
		collateral_asset_id, min_collateral_amount,
		liquidator_address,
		transferred_asset_id, transfered_amount,
		forward_ton_amount, custom_response_payload
	);
}

;; ---------- Liquidate unsatisfied errors ----------

builder build_master_liquidating_too_much_error(int max_allowed_liquidation) {
	return begin_cell()
		.store_op_code(error::master_liquidating_too_much)
		.store_amount(max_allowed_liquidation);
}
builder build_user_withdraw_in_progress_error() {
	return begin_cell()
		.store_op_code(error::user_withdraw_in_progress);
}
builder build_not_liquidatable_error() {
	return begin_cell()
		.store_op_code(error::not_liquidatable);
}
builder build_execution_crashed_error() {
	return begin_cell()
		.store_op_code(error::liqudation_execution_crashed);
}
builder build_min_collateral_not_satisfied_error(int collateral_amount) {
	if (collateral_amount < 0) {
		collateral_amount = 0;
	}
	return begin_cell()
		.store_op_code(error::min_collateral_not_satisfied)
		.store_amount(collateral_amount);
}
builder build_user_not_enough_collateral_error(int collateral_present) {
	return begin_cell()
		.store_op_code(error::user_not_enough_collateral)
		.store_amount(collateral_present);
}
builder build_user_liquidating_too_much_error(int max_not_too_much) {
	return begin_cell()
		.store_op_code(error::user_liquidating_too_much)
		.store_amount(max_not_too_much);
}
builder build_master_not_enough_liquidity_error(int available_liquidity) {
	return begin_cell()
		.store_op_code(error::master_not_enough_liquidity)
		.store_amount(available_liquidity);
}
builder build_liquidation_prices_missing() {
	return begin_cell()
		.store_op_code(error::liquidation_prices_missing);
}

;; ---------- op::liquidate_unsatisfied ----------

cell pack_liquidate_unsatisfied_message(
	int query_id, slice owner_address,
	slice liquidator_address,
	int transferred_asset_id, int transfered_amount,
	int collateral_asset_id, int min_collateral_amount,
	int forward_ton_amount, cell custom_response_payload,
	builder error
) {
	return begin_cell()
		.store_op_code(op::liquidate_unsatisfied)
		.store_query_id(query_id)
		.store_slice(owner_address)
		.store_slice(liquidator_address)
		.store_asset_id(transferred_asset_id)
		;; Store some part in the reference, it wouldn't fit otherwise. The storage layout is quite arbitrary though
		.store_ref(
			begin_cell()
			.store_amount(transfered_amount)
			.store_asset_id(collateral_asset_id)
			.store_amount(min_collateral_amount)
			.store_amount(forward_ton_amount)
			.store_ref(custom_response_payload)
			.store_builder(error)
			.end_cell()
		)
		.end_cell();
}

(slice, slice, int, int, int, int, int, cell, slice) parse_liquidate_unsatisfied_message(slice cs) {
	slice owner_address = cs~load_msg_addr();
	slice liquidator_address = cs~load_msg_addr();
	int transferred_asset_id = cs~load_asset_id();
	cs = cs.preload_ref().begin_parse();
	int transfered_amount = cs~load_amount();
	int collateral_asset_id = cs~load_asset_id();
	int min_collateral_amount = cs~load_amount();
	int forward_ton_amount = cs~load_amount();
	cell custom_response_payload = cs~load_ref();
	slice error = cs;
	return (
		owner_address,
		liquidator_address,
		transferred_asset_id, transfered_amount,
		collateral_asset_id, min_collateral_amount,
		forward_ton_amount, custom_response_payload,
		error
	);
}

;; ---------- op::liquidate_satisfied ----------

cell pack_liquidate_satisfied_message(
	int query_id,
	slice owner_address, slice liquidator_address,
	int transferred_asset_id,
	int delta_loan_principal, int liquidatable_amount, int protocol_gift,
	int new_user_loan_principal,
	int collateral_asset_id,
	int delta_collateral_principal, int collateral_reward, int min_collateral_amount,
	int new_user_collateral_principal,
	int forward_ton_amount, cell custom_response_payload
) {
	return begin_cell()
		.store_op_code(op::liquidate_satisfied)
		.store_query_id(query_id)
		.store_slice(owner_address)
		.store_slice(liquidator_address)
		.store_asset_id(transferred_asset_id)
		;; Store some part in the reference, it wouldn't fit otherwise. The storage layout is quite arbitrary though
		.store_ref(
			begin_cell()
			.store_principal(delta_loan_principal) ;; 64
			.store_amount(liquidatable_amount) ;; 64
			.store_amount(protocol_gift) ;; 64
			.store_principal(new_user_loan_principal) ;; 64
			.store_asset_id(collateral_asset_id) ;; 256
			.store_principal(delta_collateral_principal) ;; 64
			.store_amount(collateral_reward) ;; 64
			.store_amount(min_collateral_amount) ;; 64
			.store_principal(new_user_collateral_principal) ;; 64
			.store_amount(forward_ton_amount) ;; 64
			.store_ref(custom_response_payload)
			.end_cell()
		)
		.end_cell();
}

(slice, slice, int, int, int, int, int, int, int, int, int, int, int, cell) parse_liquidate_satisfied_message(slice cs) {
	slice owner_address = cs~load_msg_addr();
	slice liquidator_address = cs~load_msg_addr();
	int transferred_asset_id = cs~load_asset_id();
	cs = cs.preload_ref().begin_parse();
	int delta_loan_principal = cs~load_principal();
	int liquidatable_amount = cs~load_amount();
	int protocol_gift = cs~load_amount();
	int new_user_loan_principal = cs~load_principal();

	int collateral_asset_id = cs~load_asset_id();
	int delta_collateral_principal = cs~load_principal();
	int collateral_reward = cs~load_amount();
	int min_collateral_amount = cs~load_amount();
	int new_user_collateral_principal = cs~load_principal();
	int forward_ton_amount = cs~load_amount();
	cell custom_response_payload = cs~load_ref();
	
	return (
		owner_address, liquidator_address,
		transferred_asset_id,
		delta_loan_principal, liquidatable_amount, protocol_gift,
		new_user_loan_principal, 
		collateral_asset_id,
		delta_collateral_principal, collateral_reward, min_collateral_amount,
		new_user_collateral_principal, 
		forward_ton_amount, custom_response_payload
	);
}

;; ---------- op::liquidate_success ----------

builder pack_liquidate_success_message(
	int query_id,
	int transferred_asset_id,
	int delta_loan_principal,
	int loan_tracking_supply_index, int loan_tracking_borrow_index,
	int collateral_asset_id,
	int delta_collateral_principal,
	int collateral_tracking_supply_index, int collateral_tracking_borrow_index
) {
	return begin_cell()
		.store_op_code(op::liquidate_success)
		.store_query_id(query_id)
		.store_asset_id(transferred_asset_id)
		.store_principal(delta_loan_principal)
		.store_tracking_index(loan_tracking_supply_index)
		.store_tracking_index(loan_tracking_borrow_index)
		.store_asset_id(collateral_asset_id)
		.store_principal(delta_collateral_principal)
		.store_tracking_index(collateral_tracking_supply_index)
		.store_tracking_index(collateral_tracking_borrow_index);
}

(int, int, int, int, int, int, int, int) parse_liquidate_success_message(slice cs) {
	return (
		cs~load_asset_id(),
		cs~load_principal(),
		cs~load_tracking_index(),
		cs~load_tracking_index(),
		cs~load_asset_id(),
		cs~load_principal(),
		cs~load_tracking_index(),
		cs~load_tracking_index()
	);
}

;; ---------- op::liquidate_fail ----------

builder pack_liquidate_fail_message(
	int query_id,
	int transferred_asset_id,
	int delta_loan_principal,
	int collateral_asset_id,
	int delta_collateral_principal
) {
	return begin_cell()
		.store_op_code(op::liquidate_fail)
		.store_query_id(query_id)
		.store_asset_id(transferred_asset_id)
		.store_principal(delta_loan_principal)
		.store_asset_id(collateral_asset_id)
		.store_principal(delta_collateral_principal);
}

(int, int, int, int) parse_liquidate_fail_message(slice cs) {
	return (
		cs~load_asset_id(),
		cs~load_principal(),
		cs~load_asset_id(),
		cs~load_principal()
	);
}

;; ---------- Liquidate fail report ----------

cell pack_liquidation_fail_report_message(builder error, cell custom_response_payload) {
	return error
		.store_ref(custom_response_payload)
		.end_cell();
}

;; ---------- Liquidate success report ----------

cell pack_liquidation_success_report_message(
	int query_id, 
	int transferred_asset_id,
	int transferred_amount,
	int collateral_asset_id,
	int collateral_reward, 
	cell custom_response_payload
) {
	return begin_cell()
		.store_op_code(op::liquidate_success_report)  ;; 32
		.store_query_id(query_id) ;; 64
		.store_asset_id(transferred_asset_id) ;; 256
		.store_amount(transferred_amount) ;; 64
		.store_asset_id(collateral_asset_id) ;; 256
		.store_amount(collateral_reward) ;; 64
		.store_ref(custom_response_payload)
		.end_cell();
}

cell pack_liquidate_excess_message(int op, int query_id) {
	return begin_cell()
		.store_op_code(0)
		.store_slice("EVAA liquidation.")
		.end_cell();
}

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
cell pack_supply_user_message(
	int query_id,
	int asset_id, int supply_amount_current,
	int s_rate, int b_rate,
	int dust, int max_token_amount,
	int total_supply, int total_borrow,
	int tracking_supply_index, int tracking_borrow_index,
	int forward_ton_amount, cell custom_response_payload
) {
	return begin_cell()
		.store_op_code(op::supply_user) ;; 32
		.store_query_id(query_id) ;; 64
		.store_asset_id(asset_id) ;; 256
		.store_amount(supply_amount_current) ;; 64
		.store_sb_rate(s_rate) ;; 64
		.store_sb_rate(b_rate) ;; 64
		.store_uint(dust, 64)
		.store_uint(max_token_amount, 64)
		.store_principal(total_supply) ;; 64
		.store_principal(total_borrow) ;; 64
		.store_tracking_index(tracking_supply_index)
		.store_tracking_index(tracking_borrow_index)
		.store_amount(forward_ton_amount) ;; 64
		.store_ref(custom_response_payload)
		.end_cell();
}

(int, int, int, int, int, int, int, int, int, int, int, cell) parse_supply_user_message(slice cs) {
	return (
		cs~load_asset_id(),
		cs~load_amount(),
		cs~load_sb_rate(),
		cs~load_sb_rate(),
		cs~load_uint(64),
		cs~load_uint(64),
		cs~load_principal(),
		cs~load_principal(),
		cs~load_tracking_index(),
		cs~load_tracking_index(),
		cs~load_amount(),
		cs~load_ref()
	);
}

;; --------------- op::supply_success ---------------
;; Supply success (response) message
cell pack_supply_success_message(
	int query_id, slice owner_address,
	int asset_id, int amount_supplied, int user_new_principal,
	int repay_amount_principal, int supply_amount_principal, cell custom_response_payload
) {
	return begin_cell()
		.store_op_code(op::supply_success);; 32
		.store_query_id(query_id) ;; 64
		.store_slice(owner_address) ;; 256
		.store_asset_id(asset_id) ;; 256
		.store_amount(amount_supplied);; 64
		.store_principal(user_new_principal);; 64
		.store_principal(repay_amount_principal);; 64
		.store_principal(supply_amount_principal)	;; 64
		.store_ref(custom_response_payload)
		.end_cell();
}

(slice, int, int, int, int, int, cell) parse_supply_success_message(slice cs) {
	return (
		cs~load_msg_addr(), ;; owner_address
		cs~load_asset_id(),
		cs~load_amount(),
		cs~load_principal(),
		cs~load_principal(),
		cs~load_principal(),
		cs~load_ref()
	);
}

;; --------------- op::supply_fail ---------------
cell pack_supply_fail_message(
	int query_id, slice owner_address,
	int asset_id, int amount, int forward_ton_amount, cell custom_response_payload
) {
	return begin_cell()
		.store_op_code(op::supply_fail)
		.store_query_id(query_id)
		.store_slice(owner_address)
		.store_asset_id(asset_id)
		.store_amount(amount)
		.store_amount(forward_ton_amount)
		.store_ref(custom_response_payload)
		.end_cell();
}

(slice, int, int, int, cell) parse_supply_fail_message(slice cs) {
	return (
		cs~load_msg_addr(),
		cs~load_asset_id(),
		cs~load_amount(),
		cs~load_amount(),
		cs~load_ref()
	);
}

;; --------------- op::supply_excess ---------------
;; Supply excess message - refund extra TON attachment back to owner
cell pack_supply_excess_message_with_data(int query_id, cell custom_response_payload) {
	return begin_cell()
		.store_op_code(op::supply_excess)
		.store_query_id(query_id)
		.store_ref(custom_response_payload)
		.end_cell();
}

cell pack_supply_fail_message_with_data(int query_id, cell custom_response_payload) {
	return begin_cell()
		.store_op_code(op::supply_fail_excess)
		.store_query_id(query_id)
		.store_ref(custom_response_payload)
		.end_cell();
}

cell pack_supply_success_excess_message() {
	return begin_cell()
		.store_op_code(0)
		.store_slice("EVAA supply.")
		.end_cell();
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/messages/upgrade-header.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/basic-types.fc";

(builder) user::upgrade::store_header(
	builder source, int user_version, cell upgrade_info,
	int upgrade_exec
) method_id(666) {
	source = (
		source
			.store_coins(user_version)
			.store_maybe_ref(upgrade_info)
			.store_int(upgrade_exec, 2)
	);
	return source;
}

;; Required for compability of upgrades from v4 and v5 version.
;; This method must have ID 41 for user contract (user.fc)
(builder) user::upgrade::store_header_compat(
	builder source, int user_version, cell upgrade_info,
	int upgrade_exec
) {
	return user::upgrade::store_header(source, user_version, upgrade_info, upgrade_exec);
}

(slice, (int, cell, int)) user::upgrade::load_header(slice cs) {
	int user_version = cs~load_coins();
	cell upgrade_info = cs~load_maybe_ref();
	int upgrade_exec = cs~load_bool_ext();

	return (cs,
		(user_version, upgrade_info,
		upgrade_exec)
	);
}

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

(int, int, slice, int, cell, int, cell) parse_withdraw_master_message(slice cs) {
	int asset_id = cs~load_asset_id();
	int amount = cs~load_amount();
	slice recipient_addr = cs~load_msg_addr();
	int include_user_code = cs~load_bool_ext();
	int forward_ton_amount = cs~load_amount();
	cell custom_response_payload = cs~load_ref();
	cell prices_with_signature_packed = cs~load_ref();
	cs.end_parse();

	if (prices_with_signature_packed.begin_parse().slice_empty?()){
		return (asset_id, amount, recipient_addr, include_user_code, null(), forward_ton_amount, custom_response_payload);
	}

	return (asset_id, amount, recipient_addr, include_user_code, prices_with_signature_packed, forward_ton_amount, custom_response_payload);
}

;; --------------- op::withdraw_user ---------------

;; ??? Should we send s/b-rate separately?, since it's obtainable from the asset_dynamics_collection
cell pack_withdraw_user_message(
	int query_id,
	int asset_id, int withdraw_amount_current,
	int s_rate, int b_rate,
	cell asset_config_collection, cell asset_dynamics_collection,
	cell prices_packed, slice recipient_address,
	int forward_ton_amount, cell custom_response_payload
) {
	return begin_cell()
		.store_op_code(op::withdraw_user) ;; 32
		.store_query_id(query_id) ;; 64
		.store_asset_id(asset_id) ;; 256
		.store_amount(withdraw_amount_current) ;; 64
		.store_sb_rate(s_rate) ;; 64
		.store_sb_rate(b_rate) ;; 64
		.store_slice(recipient_address) ;; 267
		.store_ref(
			begin_cell()
				.store_dict(asset_config_collection) ;; 1
				.store_dict(asset_dynamics_collection) ;; 1
				.store_dict(prices_packed) 
				.store_amount(forward_ton_amount)
				.store_ref(custom_response_payload)
				.end_cell())
		.end_cell();
}

(int, int, int, int, slice, cell, cell, cell, int, cell) parse_withdraw_user_message(slice cs) {
	slice rest = cs.preload_ref().begin_parse();
	return (
		cs~load_asset_id(),
		cs~load_amount(),
		cs~load_sb_rate(),
		cs~load_sb_rate(),
		cs~load_msg_addr(),
		rest~load_dict(),
		rest~load_dict(),
		rest~load_dict(),
		rest~load_amount(),
		rest~load_ref()
	);
}

;; --------------- op::withdraw_collateralized ---------------

cell pack_withdraw_collateralized_message(
	int query_id,
	slice owner_address, int asset_id,
	int withdraw_amount_current, int user_new_principal,
	int borrow_amount_principal, int reclaim_amount_principal, slice recipient_address,
	int forward_ton_amount, cell custom_response_payload
) {
	return begin_cell()
		.store_op_code(op::withdraw_collateralized)
		.store_query_id(query_id)
		.store_slice(owner_address)
		.store_asset_id(asset_id)
		.store_amount(withdraw_amount_current)
		.store_principal(user_new_principal)
		.store_principal(borrow_amount_principal)
		.store_principal(reclaim_amount_principal)
		.store_ref(
			begin_cell()
				.store_slice(recipient_address)
				.store_amount(forward_ton_amount)
				.store_ref(custom_response_payload)
				.end_cell())
		.end_cell();
}

(slice, int, int, int, int, int, slice, int, cell) parse_withdraw_collateralized_message(slice cs) {
	slice rest = cs.preload_ref().begin_parse();
	return (
		cs~load_msg_addr(), ;; owner_address
		cs~load_asset_id(),
		cs~load_amount(),
		cs~load_principal(),
		cs~load_principal(),
		cs~load_principal(),
		rest~load_msg_addr(), ;; recipient_address
		rest~load_amount(),
		rest~load_ref() ;; custom_response_payload
	);
}

;; --------------- op::withdraw_success ---------------

builder pack_withdraw_success_message(
	int query_id, int asset_id, int principal_amount,
    int tracking_supply_index, int tracking_borrow_index
) {
	return begin_cell()
		.store_op_code(op::withdraw_success)
		.store_query_id(query_id)
		.store_asset_id(asset_id)
		.store_principal(principal_amount)
		.store_tracking_index(tracking_supply_index)
		.store_tracking_index(tracking_borrow_index);
}

(int, int, int, int) parse_withdraw_success_message(slice cs) {
	return (
		cs~load_asset_id(),
		cs~load_principal(),
		cs~load_tracking_index(),
		cs~load_tracking_index()
	);
}

;; --------------- op::withdraw_fail ---------------

builder pack_withdraw_fail_message(
	int query_id, int asset_id, int principal_amount
) {
	return begin_cell()
		.store_op_code(op::withdraw_fail)
		.store_query_id(query_id)
		.store_asset_id(asset_id)
		.store_principal(principal_amount);
}

(int, int) parse_withdraw_fail_message(slice cs) {
	int asset_id = cs~load_asset_id();
	int principal_amount = cs~load_principal();
	return (asset_id, principal_amount);
}

;; --------------- op::withdraw_***_excess ---------------
;; Withdraw excess message - refund extra TON attachment back to owner
cell pack_withdraw_excess_message(int op, int query_id) {
	return begin_cell()
		.store_op_code(op)
		.store_query_id(query_id)
		.end_cell();
}

cell pack_withdraw_excess_message_with_data(int op, int query_id, cell custom_response_payload) {
	return begin_cell()
		.store_op_code(op)
		.store_query_id(query_id)
		.store_ref(custom_response_payload)
		.end_cell();
}

cell pack_withdraw_success_excess_message(int op, int query_id) {
	return begin_cell()
		.store_op_code(0)
		.store_slice("EVAA withdraw.")
		.end_cell();
}

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/storage/master-storage.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";

(cell) master::storage::pack(
  cell meta, cell upgrade_config,
  cell asset_config_collection,
  int if_active, slice oracles_info, slice admin,
  cell tokens_keys,  
  cell asset_dynamics_collection
) inline {
  return (
    begin_cell()
      .store_ref(meta)
      .store_ref(upgrade_config)
      .store_ref(
        begin_cell()
          .store_dict(asset_config_collection)
          .store_int(if_active, 8)
          .store_slice(admin)
          .store_slice(oracles_info) ;; uint8 num_oracles, uint8 threshold, ^cell oracles
          .store_dict(tokens_keys)
        .end_cell())
      .store_dict(asset_dynamics_collection)
      .end_cell()
  );
}

() master::storage::save (
  cell meta, cell upgrade_config,
  cell asset_config_collection,
  int if_active, slice oracles_info, slice admin,
  cell tokens_keys,  
  cell asset_dynamics_collection
) impure {
  set_data(
    master::storage::pack(
      meta, upgrade_config, asset_config_collection,
      if_active, oracles_info, admin, tokens_keys, 
      asset_dynamics_collection
    )
  );
}

(cell, cell, cell, int, slice, slice, cell, cell) master::storage::load () inline {
  slice ds = get_data().begin_parse();
  cell meta = ds~load_ref();
  cell upgrade_config = ds~load_ref();
  cell marketConfig = ds~load_ref();
  slice unpacked_marked_config = marketConfig.begin_parse();
  cell asset_config_collection = unpacked_marked_config~load_dict();
  int if_active = unpacked_marked_config~load_int(8);
  slice admin = unpacked_marked_config~load_msg_addr();
  slice oracles_info = unpacked_marked_config~load_bits_refs(33, 1);
  cell tokens_keys = unpacked_marked_config~load_dict();
  unpacked_marked_config.end_parse();
  cell asset_dynamics_collection = ds~load_dict();
  ds.end_parse();
  return (meta, upgrade_config, asset_config_collection, if_active, admin, oracles_info, tokens_keys, asset_dynamics_collection);
}
 

```

## b1ed3af875b6a8878a0c914c03be387c297f79b38ad03c7eb78239313e57e70b/storage/master-upgrade.fc

```fc
;; This file is licensed under the Business Source License (BUSL).
;; See the LICENSE.md file in the project root for more information.

#include "../external/stdlib.fc";
#include "../data/universal-dict.fc";

;; --------------- upgrade_config ---------------

(cell) pack_upgrade_config(
    int master_code_version, int user_code_version,
    int timeout, int update_time, int freeze_time,
    cell user_code,
    cell new_master_code, cell new_user_code
) inline {
    return (
        begin_cell()
            .store_coins(master_code_version)
            .store_coins(user_code_version)
            .store_uint(timeout, 32)
            .store_uint(update_time, 64)
            .store_uint(freeze_time, 64)
            .store_ref(user_code)
            .store_maybe_ref(new_master_code)
            .store_maybe_ref(new_user_code)
    ).end_cell();
}

(int, int, int, int, int, cell, cell, cell) unpack_upgrade_config(cell config) inline {
    slice cs = config.begin_parse();
