# GitHub Docs Parser - Part 3

    readonly init?: StateInit

    static fromInit(code: Cell, data: Cell) {
        return new MyContract(contractAddress(0, {code: code, data: data}), {code: code, data: data})
    }

    constructor(address: Address, init?: StateInit) {
        this.address = address
        this.init = init
    }

    async send(
        provider: ContractProvider,
        via: Sender,
        args: {value: bigint; bounce?: boolean | null | undefined},
        body: Cell,
    ) {
        await provider.internal(via, {...args, body: body})
    }

    async getRunMethod(provider: ContractProvider, id: number | string, stack: TupleBuilder = new TupleBuilder()) {
        return (await provider.get(id, stack.build())).stack
    }
}

async function main() {
    const blockchain = await Blockchain.create();
    // blockchain.verbosity.vmLogs = "vm_logs_verbose"

    // First we need to gather state of the contract from the blockchain:
    const contractCode = Cell.fromHex("b5ee9c7201021a0100050e000114ff00f4a413f4bcf2c80b0102016202030202cb0405020120101101d7d0cb434c0c05c6c23910c200835c874c7c0608405e351466ea44c38601035c87e800c3b51343e803e903e90353534ffc07e1874541168504d3e10721401be80940133c59633c5b33332fff27b55383e903e900c7e800c7d007e800c7e80004c5c3e0e80b4c7c04074cfc044a06001da23864658380e78b64814183fa0bc004fced44d0fa00fa40fa40d4d4d3ff01f861d1268210642b7d07ba8ecb35355161c705f2e04904fa4021fa4430c000f2e14dfa00d4d120d0d31f018210178d4519baf2e0488040d721fa00fa4031fa4031fa0020d70b009ad74bc00101c001b0f2b19130e254431be0392582107bdd97debae3022582102c76b973bae30234240708090a018e2191729171e2f839206e9381782e9120e2216e9431817ee09101e25023a813a0738104ad70f83ca00270f83612a00170f836a07381051382100966018070f837a0bcf2b025597f0b01e63505fa00fa40f828f84128103401db3c6f2230f9007074c8cb02ca07cbffc9d05008c705f2e04a12a144145036f841c85006fa025004cf1658cf16cccccbffc9ed54fa40d120d70b01c000b38e22c8801001cb0501cf1670fa027001cb6a8210d53276db01cb1f0101cb3fc98042fb00915be21801d2355f033401fa40d2000101d195c821cf16c9916de2c8801001cb055004cf1670fa027001cb6a8210d173540001cb1f500401cb3f23fa4430c0008e9df828f84110354150db3c6f2230f9007074c8cb02ca07cbffc9d012cf1697316c127001cb01e2f400c98050fb001804fe82106501f354ba8e2530335142c705f2e04902fa40d1400304f841c85006fa025004cf1658cf16cccccbffc9ed54e0248210fb88e119ba8e24313303d15131c705f2e0498b024034f841c85006fa025004cf1658cf16cccccbffc9ed54e0248210cb862902bae302302382102508d66abae3022382107431f221bae30210360c0d0e0f01c082103b9aca0070fb02f828f84110364150db3c6f223020f9007074c8cb02ca07cbffc8801801cb0501cf1758fa02029858775003cb6bcccc9730017158cb6acce2c98011fb005005a04314f841c85006fa025004cf1658cf16cccccbffc9ed5418004e34365145c705f2e049c85003cf16c9103412f841c85006fa025004cf1658cf16cccccbffc9ed540022365f0302c705f2e049d4d4d101ed54fb04004a335042c705f2e04901d18b028b024034f841c85006fa025004cf1658cf16cccccbffc9ed54001c5f068210d372158cbadc840ff2f002014812130202711617013fb5d15da89a1f401f481f481a9a9a7fe03f0c3a228be09f051f08225b678de4501802016a1415002eab5bed44d0fa00fa40fa40d4d4d3ff01f861d110245f04002eaa67ed44d0fa00fa40fa40d4d4d3ff01f861d15f05f841015badbcf6a2687d007d207d206a6a69ff80fc30e88a2f827c147c20896d9e3791187c80383a6465816503e5ffe4e84018008baf16f6a2687d007d207d206a6a69ff80fc30e8bf99e836c1783872ebdb514d9c97c283b7f0ae5179029e2b6119c39462719e4f46ed8f7413e62c780a38646583fa0064a1804001f6840f7f7026fa4431abfb531149461804c8cb035003fa0201cf1601cf16cbff208100cac8cb0f01cf1724f90025d7652582020134c8cb1712cb0fcb0fcbff8e2906a45c01cb0971f90400527001cbff71f90400abfb28b25304b9933434239130e220c02024c000b117e610235f033333227003cb09c922c8cb0112190014f400f400cb00c9016f02");
    const contractData = Cell.fromHex("b5ee9c720101040100af0002979056bc75ddfc673410080177e274e049215c770a7fbc709371cfb836bea9100f522b0ea608c92d495da648211a56b90a6f27e9f2c5241dd6b2c716d530d50027787d2a0e4223997141d188c001020842020f1ad3d8a46bd283321dde639195fb72602e9b31b1727fecc25e2edc10966df4010003006e68747470733a2f2f6170692e68616d737465726b6f6d6261742e696f2f7075626c69632f746f6b656e2f6d657461646174612e6a736f6e");
    // Use mainnet address of the Jetton Master contract
    const JettonMasterAddress = Address.parse("EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo");
    // Open the contract, so sandbox can send messages to it
    const openedContract = blockchain.openContract(
        new MyContract(JettonMasterAddress)
            // {code: contractCode, data: contractData})
    );

    // Instead of deploying the contract, we can set shard account directly
    await blockchain.setShardAccount(JettonMasterAddress, createShardAccount({
        address: JettonMasterAddress,
        code: contractCode,
        data: contractData,
        balance: toNano("0.05"),
        workchain: 0
    }));

    // If some arguments are needed, we can pass them as second argument like this:
    const stack = new TupleBuilder();
    stack.writeAddress(Address.parse("UQDKHZ7e70CzqdvZCC83Z4WVR8POC_ZB0J1Y4zo88G-zCSRH"));

    const result = await openedContract.getRunMethod('get_wallet_address', stack);
    console.log("Jetton Wallet Address: ", result.readAddress());
}

void main();
```

</TabItem>

<TabItem value="Python" label="Python">

Unfortunately, there is currently no tool like Sandbox for Python to emulate the blockchain. 
However, you can still implement something similar with [pytvm](https://github.com/yungwine/pytvm).
This example helps to understand how to correctly construct the data needed to obtain the address.
Essentially you need to build the same thing as `get_wallet_address(slice owner_address) method_id` in the master contract:

```python

# Recreate from jetton-utils.fc calculate_jetton_wallet_address()
# https://tonscan.org/jetton/EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo#source

from pytoniq_core import Address, Cell, Builder, Slice

# Constants from the HMSTR FunC code
STATUS_SIZE = 4
MERKLE_ROOT_SIZE = 256
SALT_SIZE = 10  # Bits for salt
ITERATION_NUM = 32  # Number of salt iterations
MY_WORKCHAIN = 0  # Assuming Basechain (0)

# --- Configuration Variables ---
# Replace these values with your actual data before running the script
OWNER_ADDRESS_EXAMPLE = "UQDKHZ7e70CzqdvZCC83Z4WVR8POC_ZB0J1Y4zo88G-zCSRH" # Binance Hot Wallet
JETTON_MASTER_ADDRESS_EXAMPLE = "EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo" # HMSTR Jetton Master
# Gather from the blockchain using master's get_jetton_data method or compile from source.
JETTON_WALLET_CODE_HEX_EXAMPLE = "b5ee9c72010101010023000842020f1ad3d8a46bd283321dde639195fb72602e9b31b1727fecc25e2edc10966df4"
# The merkle_root from the master contract using get_mintless_airdrop_hashmap_root method.
MERKLE_ROOT_EXAMPLE = 29945721131613672054990630604903528297803118035866103598622265652475246912273
# --- End Configuration Variables ---

def pack_jetton_wallet_data(
    status: int,
    balance: int,
    owner_address_slice: Slice,
    jetton_master_address_slice: Slice,
    merkle_root: int,
    salt: int,
) -> Cell:
    """
    Packs the jetton wallet data into a cell, similar to FunC's pack_jetton_wallet_data.
    Note: owner_address_slice and jetton_master_address_slice should be slices
    representing the full MsgAddressInt structure (e.g., from builder.store_address().end_cell().begin_parse()).
    """
    builder = Builder()
    builder.store_uint(status, STATUS_SIZE)
    builder.store_coins(balance)
    builder.store_slice(owner_address_slice)
    builder.store_slice(jetton_master_address_slice)
    builder.store_uint(merkle_root, MERKLE_ROOT_SIZE)
    builder.store_uint(salt, SALT_SIZE)
    return builder.end_cell()

def calculate_jetton_wallet_state_init_and_salt(
    owner_address: Address,
    jetton_master_address: Address,
    jetton_wallet_code: Cell,
    merkle_root: int,
) -> tuple[Cell, int]:
    """
    Calculates the optimal StateInit for a jetton wallet and the salt used.
    This function mirrors the logic of `calculate_jetton_wallet_properties_cheap`
    and subsequent StateInit construction in FunC.
    """
    owner_hash_part_int = int.from_bytes(owner_address.hash_part, "big")
    owner_prefix = owner_hash_part_int >> (256 - 4)  # First 4 bits of owner's address hash

    # Create full slice representations of addresses for storing in the data cell
    owner_addr_builder = Builder()
    owner_addr_builder.store_address(owner_address)
    owner_addr_data_slice = owner_addr_builder.end_cell().begin_parse()

    jetton_master_addr_builder = Builder()
    jetton_master_addr_builder.store_address(jetton_master_address)
    jetton_master_addr_data_slice = jetton_master_addr_builder.end_cell().begin_parse()

    min_distance = 0xFFFF
    best_salt = 0 # FunC starts salt at -1 and increments, so first real salt is 0
    
    best_state_init_cell = None

    # Loop for salt values from 0 to ITERATION_NUM (inclusive)
    for current_salt in range(ITERATION_NUM + 1):
        # 1. Create the jetton wallet data cell
        # Status and balance are 0 for this calculation, as in FunC's _cheap version
        data_cell = pack_jetton_wallet_data(
            status=0,
            balance=0,
            owner_address_slice=owner_addr_data_slice,
            jetton_master_address_slice=jetton_master_addr_data_slice,
            merkle_root=merkle_root,
            salt=current_salt,
        )

        # 2. Create the StateInit cell
        state_init_builder = Builder()
        state_init_builder.store_uint(0, 2)  # No split_depth, No special
        state_init_builder.store_maybe_ref(jetton_wallet_code)
        state_init_builder.store_maybe_ref(data_cell)
        state_init_builder.store_uint(0, 1)  # Empty libraries
        current_state_init_cell = state_init_builder.end_cell()

        # 3. Calculate account_hash (hash of state_init)
        account_hash_bytes = current_state_init_cell.hash
        account_hash_int = int.from_bytes(account_hash_bytes, "big")

        # 4. Calculate wallet_prefix (first 4 bits of StateInit hash)
        wallet_prefix = account_hash_int >> (256 - 4)

        # 5. Calculate XOR distance
        distance = wallet_prefix ^ owner_prefix

        if distance < min_distance:
            min_distance = distance
            best_salt = current_salt
            best_state_init_cell = current_state_init_cell
        
        if min_distance == 0: # Found a perfect match
            break
            
    if best_state_init_cell is None:
        # This should not happen if ITERATION_NUM >= 0, as at least one iteration will run.
        # For safety, if it were to occur, recompute with the initial salt (0 or best_salt if it was updated).
        # However, the logic ensures best_state_init_cell is set on the first iteration.
        # Re-create the data cell and state_init with the best_salt found (or default 0)
        final_data_cell = pack_jetton_wallet_data(
            status=0, balance=0,
            owner_address_slice=owner_addr_data_slice,
            jetton_master_address_slice=jetton_master_addr_data_slice,
            merkle_root=merkle_root, salt=best_salt
        )
        final_state_init_builder = Builder()
        final_state_init_builder.store_uint(0, 2)
        final_state_init_builder.store_maybe_ref(jetton_wallet_code)
        final_state_init_builder.store_maybe_ref(final_data_cell)
        final_state_init_builder.store_uint(0, 1)
        best_state_init_cell = final_state_init_builder.end_cell()


    return best_state_init_cell, best_salt

def calculate_jetton_wallet_address_from_state_init(
    state_init: Cell, workchain: int = MY_WORKCHAIN
) -> Address:
    """
    Calculates the jetton wallet address from its StateInit cell.
    """
    state_init_hash = state_init.hash  # This is the 256-bit hash part of the address
    return Address(f"{workchain}:{state_init_hash.hex()}")

def calculate_user_jetton_wallet_address_py(
    owner_address_str: str,  # User-friendly address string, e.g., "EQ..."
    jetton_master_address_str: str,  # User-friendly address string, e.g., "EQ..."
    jetton_wallet_code_boc_hex: str,  # BOC HEX string for the jetton wallet code cell
    merkle_root: int = 0,
) -> tuple[str, int]:
    """
    Calculates the user's jetton wallet address and the salt used.
    This is the Python equivalent of FunC's `calculate_user_jetton_wallet_address`.
    Returns the address as a user-friendly string and the salt.
    """
    owner_address = Address(owner_address_str)
    jetton_master_address = Address(jetton_master_address_str)
    
    # Ensure jetton_wallet_code_boc_hex is bytes if it's hex string
    if isinstance(jetton_wallet_code_boc_hex, str):
        jetton_wallet_code_boc_bytes = bytes.fromhex(jetton_wallet_code_boc_hex)
    else:
        jetton_wallet_code_boc_bytes = jetton_wallet_code_boc_hex

    jetton_wallet_code = Cell.one_from_boc(jetton_wallet_code_boc_bytes)

    state_init_cell, salt_used = calculate_jetton_wallet_state_init_and_salt(
        owner_address, jetton_master_address, jetton_wallet_code, merkle_root
    )

    wallet_address = calculate_jetton_wallet_address_from_state_init(
        state_init_cell, MY_WORKCHAIN
    )
    
    # Return user-friendly, bounceable address string and the salt
    return wallet_address.to_str(is_user_friendly=True, is_bounceable=True, is_test_only=False), salt_used

if __name__ == "__main__":
    # Example Usage:
    # Ensure the CONFIGURATION VARIABLES at the top of the script are set correctly.

    # You can get this by compiling your jetton wallet FunC code to a .cell file, 
    # then converting that .cell file (which is BOC) to a hex string.
    # Or if you have the .fif file for the code: fift -s build/jetton-wallet-code.fif -o jetton-wallet-code.cell
    # Then convert jetton-wallet-code.cell (binary file) to hex.

    print(f"Note: Using HMSTR jetton wallet code from the top of the script if not changed.\n"
          f"Ensure 'JETTON_WALLET_CODE_HEX_EXAMPLE' is the actual BOC hex of your jetton wallet code.\n")

    try:

        calculated_address, salt = calculate_user_jetton_wallet_address_py(
            owner_address_str=OWNER_ADDRESS_EXAMPLE,
            jetton_master_address_str=JETTON_MASTER_ADDRESS_EXAMPLE,
            jetton_wallet_code_boc_hex=JETTON_WALLET_CODE_HEX_EXAMPLE,
            merkle_root=MERKLE_ROOT_EXAMPLE # Pass the actual merkle_root here
        )
        print(f"Calculated Jetton Wallet Address: {calculated_address}")
        print(f"Salt used: {salt}")


    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please ensure you have 'pytoniq-core' installed (pip install pytoniq-core).")
        print("And provide valid address strings and a valid BOC hex for the jetton wallet code.") 


```
Read the simple example [here](/example-code-snippets/pythoniq/jetton-offline-address-calc-wrapper.py).

</TabItem>
</Tabs>

Most tokens implement the [TEP-74 standard](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc), except [Jetton-with-governance contracts](https://github.com/ton-blockchain/stablecoin-contract) which add a wallet `status` field and [mintless jettons](/v3/guidelines/dapps/asset-processing/mintless-jettons) featuring `merkle root` and `salt` fields, with all implementations maintaining core token functionality. 

### How to construct a message for a jetton transfer with a comment?

When constructing a message for a jetton transfer, refer to [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer), which defines the token standard.

#### Transfer jettons
<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_5_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

:::warning
When displaying token amounts, they are usually divided by `10^decimals` (often `9 decimals`). This allows for the use of the `toNano` function. If the number of decimals is different (e.g., 6), you will need to adjust accordingly.

Of course, one can always do calculation in indivisible units.
:::

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const jettonWalletAddress = Address.parse('put your jetton wallet address');
    const destinationAddress = Address.parse('put destination wallet address');

    const forwardPayload = beginCell()
        .storeUint(0, 32) // 0 opcode means we have a comment
        .storeStringTail('Hello, TON!')
        .endCell();

    const messageBody = beginCell()
        .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
        .storeUint(0, 64) // query id
        .storeCoins(toNano(5)) // jetton amount, amount * 10^9
        .storeAddress(destinationAddress)
        .storeAddress(destinationAddress) // response destination
        .storeBit(0) // no custom payload
        .storeCoins(toNano('0.02')) // forward amount - if >0, will send notification message
        .storeBit(1) // we store forwardPayload as a reference
        .storeRef(forwardPayload)
        .endCell();

    const internalMessage = internal({
        to: jettonWalletAddress,
        value: toNano('0.1'),
        bounce: true,
        body: messageBody
    });
    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");
const {mnemonicToKeyPair} = require("tonweb-mnemonic");

async function main() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://toncenter.com/api/v2/jsonRPC', {
            apiKey: 'put your api key'
        })
    );
    const destinationAddress = new TonWeb.Address('put destination wallet address');

    const forwardPayload = new TonWeb.boc.Cell();
    forwardPayload.bits.writeUint(0, 32); // 0 opcode means we have a comment
    forwardPayload.bits.writeString('Hello, TON!');

    /*
        Tonweb has a built-in class for interacting with jettons, which has
        a method for creating a transfer. However, it has disadvantages, so
        we manually create the message body. Additionally, this way we have a
        better understanding of what is stored and how it functions.
     */

    const jettonTransferBody = new TonWeb.boc.Cell();
    jettonTransferBody.bits.writeUint(0xf8a7ea5, 32); // opcode for jetton transfer
    jettonTransferBody.bits.writeUint(0, 64); // query id
    jettonTransferBody.bits.writeCoins(new TonWeb.utils.BN('5')); // jetton amount, amount * 10^9
    jettonTransferBody.bits.writeAddress(destinationAddress);
    jettonTransferBody.bits.writeAddress(destinationAddress); // response destination
    jettonTransferBody.bits.writeBit(false); // no custom payload
    jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0.02')); // forward amount
    jettonTransferBody.bits.writeBit(true); // we store forwardPayload as a reference
    jettonTransferBody.refs.push(forwardPayload);

    const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));
    const jettonWallet = new TonWeb.token.ft.JettonWallet(tonweb.provider, {
        address: 'put your jetton wallet address'
    });

    // available wallet types: simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // workchain
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: jettonWallet.address,
        amount: tonweb.utils.toNano('0.1'),
        seqno: await wallet.methods.seqno().call(),
        payload: jettonTransferBody,
        sendMode: 3
    }).send(); // create transfer and send it
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, WalletV4R2, begin_cell
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    USER_ADDRESS = wallet.address
    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_JETTON_WALLET = (await provider.run_get_method(address=JETTON_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0].load_address()
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # TextComment op-code
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # Jetton Transfer op-code
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1 * 10**9)             # Jetton amount to transfer in nanojetton
                    .store_address(DESTINATION_ADDRESS) # Destination address
                    .store_address(USER_ADDRESS)        # Response address
                    .store_bit(0)                       # Custom payload is None
                    .store_coins(1)                     # Ton forward amount in nanoton
                    .store_bit(1)                       # Store forward_payload as a reference
                    .store_ref(forward_payload)         # Forward payload
                    .end_cell())

    await wallet.transfer(destination=USER_JETTON_WALLET, amount=int(0.05*1e9), body=transfer_cell)
    await provider.close_all()

asyncio.run(main())
```

</TabItem>

</Tabs>

If the `forward_amount` is nonzero, a notification about the Jetton reception will be sent to the destination contract. Additionally, if the `response_destination` address is non-null, excess Toncoins (called "excesses") will be sent to that address.


:::tip
Explorers support comments in Jetton notifications, similar to regular TON transfers. Comments are formatted as 32 zero bits followed by UTF-8 text.
:::

:::tip
Be careful when calculating fees and amounts for jetton transfer messages. For instance, transferring 0.2 TON with no excess may prevent you from receiving 0.1 TON in a response.
:::

## TEP-62 (NFT standard)

NFT collections on TON are highly customizable. The NFT contract can be defined as any contract that provides a valid get-method to return metadata. The transfer operation is standardized similarly to [Jettons](/v3/guidelines/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment).
:::warning
Reminder: all methods about NFT below are not bound by TEP-62 to work. Before trying them, check if your NFT or collection process those messages in an expected way. The wallet app emulation may be useful in this case.
:::

### How to use NFT batch deployment?

NFT collection smart contracts allow batch deployment of up to 250 NFTs in a single transaction. However, due to the 1 TON computation fee limit, this number is practically reduced to 100-130 NFTs.

#### Batch mint NFT
:::info
Does not specified by NFT standard for /ton-blockchain /token-contract
:::
<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10.svg?raw=true',
    dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_10_dark.svg?raw=true',
  }}
/>
</div>
<br></br>

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, Cell, Dictionary, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";

async function main() {
    const collectionAddress = Address.parse('put your collection address');
   	const nftMinStorage = '0.05';
    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' // for Testnet
    });
    const ownersAddress = [
        Address.parse('EQBbQljOpEM4Z6Hvv8Dbothp9xp2yM-TFYVr01bSqDQskHbx'),
        Address.parse('EQAUTbQiM522Y_XJ_T98QPhPhTmb4nV--VSPiha8kC6kRfPO'),
        Address.parse('EQDWTH7VxFyk_34J1CM6wwEcjVeqRQceNwzPwGr30SsK43yo')
    ];
    const nftsMeta = [
        '0/meta.json',
        '1/meta.json',
        '2/meta.json'
    ];

    const getMethodResult = await client.runMethod(collectionAddress, 'get_collection_data');
    let nextItemIndex = getMethodResult.stack.readNumber();
```

</TabItem>
</Tabs>

To deploy a batch, the contract stores information about new NFTs in a dictionary. The process involves: setting up storage fees (e.g., `0.05`), obtaining arrays with the new NFT owners and content, retrieving the `next_item_index` using the `get_collection_data` method.

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
	let counter = 0;
    const nftDict = Dictionary.empty<number, Cell>();
    for (let index = 0; index < 3; index++) {
        const metaCell = beginCell()
            .storeStringTail(nftsMeta[index])
            .endCell();
        const nftContent = beginCell()
            .storeAddress(ownersAddress[index])
            .storeRef(metaCell)
            .endCell();
        nftDict.set(nextItemIndex, nftContent);
        nextItemIndex++;
        counter++;
    }

	/*
		We need to write our custom serialization and deserialization
		functions to store data correctly in the dictionary since the
		built-in functions in the library are not suitable for our case.
	*/
    const messageBody = beginCell()
        .storeUint(2, 32)
        .storeUint(0, 64)
        .storeDict(nftDict, Dictionary.Keys.Uint(64), {
            serialize: (src, builder) => {
                builder.storeCoins(toNano(nftMinStorage));
                builder.storeRef(src);
            },
            parse: (src) => {
                return beginCell()
                    .storeCoins(src.loadCoins())
                    .storeRef(src.loadRef())
                    .endCell();
            }
        })
        .endCell();

    const totalValue = String(
        (counter * parseFloat(nftMinStorage) + 0.015 * counter).toFixed(6)
    );

    const internalMessage = internal({
        to: collectionAddress,
        value: totalValue,
        bounce: true,
        body: messageBody
    });
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
</Tabs>

Next, we need to correctly calculate the total transaction cost. The value of `0.015` was obtained through testing, but it can vary for each scenario. This mainly depends on the content of the NFT, as an increase in content size results in a higher **forward fee** (the fee for delivery).

### How to change the owner of a collection's smart contract?

Changing the owner of a collection is simple. Specify the `opcode = 3`, any `query_id`, and the new owner’s address.


<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const collectionAddress = Address.parse('put your collection address');
    const newOwnerAddress = Address.parse('put new owner wallet address');

    const messageBody = beginCell()
        .storeUint(3, 32) // opcode for changing owner
        .storeUint(0, 64) // query id
        .storeAddress(newOwnerAddress)
        .endCell();

    const internalMessage = internal({
        to: collectionAddress,
        value: toNano('0.05'),
        bounce: true,
        body: messageBody
    });
    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");
const {mnemonicToKeyPair} = require("tonweb-mnemonic");

async function main() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://toncenter.com/api/v2/jsonRPC', {
            apiKey: 'put your api key'
        })
    );
    const collectionAddress  = new TonWeb.Address('put your collection address');
    const newOwnerAddress = new TonWeb.Address('put new owner wallet address');

    const messageBody  = new TonWeb.boc.Cell();
    messageBody.bits.writeUint(3, 32); // opcode for changing owner
    messageBody.bits.writeUint(0, 64); // query id
    messageBody.bits.writeAddress(newOwnerAddress);

    // available wallet types: simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // workchain
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: collectionAddress,
        amount: tonweb.utils.toNano('0.05'),
        seqno: await wallet.methods.seqno().call(),
        payload: messageBody,
        sendMode: 3
    }).send(); // create transfer and send it
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
</Tabs>


### How to change the content of a collection's smart contract?

The content of an NFT collection contract is stored in a single cell, which includes two parts:

- сollection metadata
- NFT common content (base URL for metadata)

The first cell contains the collection's metadata, while the second one contains the base URL for the NFT metadata.

Often, the collection's metadata is stored in a format similar to `0.json` and continues incrementing, while the address before this file remains the same. This address should be stored in the NFT common content.

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from "@ton/core";

async function main() {
    const collectionAddress = Address.parse('put your collection address');
    const newCollectionMeta = 'put url fol collection meta';
    const newNftCommonMeta = 'put common url for nft meta';
    const royaltyAddress = Address.parse('put royalty address');

    const collectionMetaCell = beginCell()
        .storeUint(1, 8) // we have offchain metadata
        .storeStringTail(newCollectionMeta)
        .endCell();
    const nftCommonMetaCell = beginCell()
        .storeUint(1, 8) // we have offchain metadata
        .storeStringTail(newNftCommonMeta)
        .endCell();

    const contentCell = beginCell()
        .storeRef(collectionMetaCell)
        .storeRef(nftCommonMetaCell)
        .endCell();

    const royaltyCell = beginCell()
        .storeUint(5, 16) // factor
        .storeUint(100, 16) // base
        .storeAddress(royaltyAddress) // this address will receive 5% of each sale
        .endCell();

    const messageBody = beginCell()
        .storeUint(4, 32) // opcode for changing content
        .storeUint(0, 64) // query id
        .storeRef(contentCell)
        .storeRef(royaltyCell)
        .endCell();

    const internalMessage = internal({
        to: collectionAddress,
        value: toNano('0.05'),
        bounce: true,
        body: messageBody
    });

    const internalMessageCell = beginCell()
        .store(storeMessageRelaxed(internalMessage))
        .endCell();
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
<TabItem value="js-tonweb" label="JS (tonweb)">

```js
const TonWeb = require("tonweb");
const {mnemonicToKeyPair} = require("tonweb-mnemonic");

async function main() {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(
        'https://testnet.toncenter.com/api/v2/jsonRPC', {
            apiKey: 'put your api key'
        })
    );
    const collectionAddress  = new TonWeb.Address('put your collection address');
    const newCollectionMeta = 'put url fol collection meta';
    const newNftCommonMeta = 'put common url for nft meta';
    const royaltyAddress = new TonWeb.Address('put royalty address');

    const collectionMetaCell = new TonWeb.boc.Cell();
    collectionMetaCell.bits.writeUint(1, 8); // we have offchain metadata
    collectionMetaCell.bits.writeString(newCollectionMeta);
    const nftCommonMetaCell = new TonWeb.boc.Cell();
    nftCommonMetaCell.bits.writeUint(1, 8); // we have offchain metadata
    nftCommonMetaCell.bits.writeString(newNftCommonMeta);

    const contentCell = new TonWeb.boc.Cell();
    contentCell.refs.push(collectionMetaCell);
    contentCell.refs.push(nftCommonMetaCell);

    const royaltyCell = new TonWeb.boc.Cell();
    royaltyCell.bits.writeUint(5, 16); // factor
    royaltyCell.bits.writeUint(100, 16); // base
    royaltyCell.bits.writeAddress(royaltyAddress); // this address will receive 5% of each sale

    const messageBody = new TonWeb.boc.Cell();
    messageBody.bits.writeUint(4, 32);
    messageBody.bits.writeUint(0, 64);
    messageBody.refs.push(contentCell);
    messageBody.refs.push(royaltyCell);

    // available wallet types: simpleR1, simpleR2, simpleR3,
    // v2R1, v2R2, v3R1, v3R2, v4R1, v4R2
    const keyPair = await mnemonicToKeyPair('put your mnemonic'.split(' '));
    const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0 // workchain
    });

    await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: collectionAddress,
        amount: tonweb.utils.toNano('0.05'),
        seqno: await wallet.methods.seqno().call(),
        payload: messageBody,
        sendMode: 3
    }).send(); // create transfer and send it
}

main().finally(() => console.log("Exiting..."));
```

</TabItem>
</Tabs>

When updating NFT metadata or content, royalty information must also be included, especially when using the appropriate opcode to modify this data. It's important to remember that you don't need to update all values if only certain elements are changing. For instance, if the only change is to the NFT common content, the other data remains the same and can be reused without modification.

## Third-party: decentralized exchanges (DEX)

### How to send a swap message to DEX (DeDust)?

DEXs (Decentralized Exchanges) operate using various protocols. In this section, we will focus on **DeDust**, a decentralized exchange built on TON.

 * [DeDust documentation](https://docs.dedust.io/).

DeDust provides two primary paths for exchanging assets: jetton \<-> jetton or TON \<-> jetton. Each has a different scheme. The process involves sending either jettons or Toncoins to specific vaults and including a special payload. Below is the process for both types of swaps:

```tlb
swap#e3a0d482 _:SwapStep swap_params:^SwapParams = ForwardPayload;
              step#_ pool_addr:MsgAddressInt params:SwapStepParams = SwapStep;
              step_params#_ kind:SwapKind limit:Coins next:(Maybe ^SwapStep) = SwapStepParams;
              swap_params#_ deadline:Timestamp recipient_addr:MsgAddressInt referral_addr:MsgAddress
                    fulfill_payload:(Maybe ^Cell) reject_payload:(Maybe ^Cell) = SwapParams;
```
Similarly, when swapping from TON to jetton, a transfer message to the TON vault must be sent, and the swap information will be contained in the forward_payload.
And the scheme of toncoin to jetton swap:

```tlb
swap#ea06185d query_id:uint64 amount:Coins _:SwapStep swap_params:^SwapParams = InMsgBody;
              step#_ pool_addr:MsgAddressInt params:SwapStepParams = SwapStep;
              step_params#_ kind:SwapKind limit:Coins next:(Maybe ^SwapStep) = SwapStepParams;
              swap_params#_ deadline:Timestamp recipient_addr:MsgAddressInt referral_addr:MsgAddress
                    fulfill_payload:(Maybe ^Cell) reject_payload:(Maybe ^Cell) = SwapParams;
```
This is the scheme for the body of transfer to the toncoin **vault**.

First, you need to know the **vault** addresses of the jettons you will swap or toncoin **vault** address. This can be done using the `get_vault_address` get method of the contract [**Factory**](https://docs.dedust.io/reference/factory). As an argument you need to pass a slice according to the scheme:
```tlb
native$0000 = Asset; // for ton
jetton$0001 workchain_id:int8 address:uint256 = Asset; // for jetton
```
Also for the exchange itself, we need the **pool** address - acquired from get method `get_pool_address`. As arguments - asset slices according to the scheme above. In response, both methods will return a slice of the address of the requested **vault** / **pool**.

This information is sufficient to construct the swap message.

<Tabs groupId="code-examples">

 <TabItem value="js-ton" label="JS (@ton)">
DEXs use different protocols for their work, we need to familiarize ourselves with key concepts and some vital components and also know the TL-B schema involved in doing our swap process correctly. In this tutorial, we deal with DeDust, one of the famous DEX implemented entirely in TON.
 DeDust introduced an abstract Asset concept that includes any swappable asset type. This simplifies the process because the type of asset doesn't matter in the swap. This abstraction allows the straightforward exchange of extra currency or even assets from other chains.

   Following is the TL-B schema that DeDust introduced for the Asset concept.

```tlb
native$0000 = Asset; // for ton

// for any jetton,address refer to jetton master address
jetton$0001 workchain_id:int8 address:uint256 = Asset;

// Upcoming, not implemented yet.
extra_currency$0010 currency_id:int32 = Asset;
```

DeDust utilizes three key components for asset swaps:

- Factory: This component locates and constructs the vaults and pools required for the swap.
- Vault: The vault is responsible for holding assets and receiving transfer messages. When a swap is requested, the vault informs the corresponding pool.
- Pool: The pool calculates the swap amount based on predefined formulas and informs the vault, which in turn releases the swapped asset to the user.


Calculations of swap amount are based on a mathematical formula, which means so far we have two different pools, one known as Volatile, that operates based on the commonly used "Constant Product" formula: <InlineMath math="x \cdot y = k" />, And the other known as Stable-Swap - Optimized for assets of near-equal value (e.g. USDT / USDC, TON / stTON). It uses the formula: <InlineMath math="x^3 \cdot y + y^3 \cdot x = k" />.
So for every swap we need the corresponding Vault and it needs just implement a specific API tailored for interacting with a distinct asset type. DeDust has three implementations of Vault, Native Vault - Handles the native coin (Toncoin). Jetton Vault - Manages jettons and Extra-Currency Vault (upcoming) - Designed for TON extra-currencies.


DeDust provides an SDK, written in TypeScript, to interact with the contracts, components, and APIs needed for the swap. Before swapping any assets, the environment must be set up and the necessary objects initialized.

```bash
npm install --save @ton/core @ton/ton @ton/crypto

```

we also need to bring DeDust SDK as well.

```bash
npm install --save @dedust/sdk
```

Now we need to initialize some objects.

```typescript
import { Factory, MAINNET_FACTORY_ADDR } from "@dedust/sdk";
import { Address, TonClient4 } from "@ton/ton";

const tonClient = new TonClient4({
  endpoint: "https://mainnet-v4.tonhubapi.com",
});
const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
//The Factory contract  is used to  locate other contracts.
```

The swap process involves finding the corresponding vault and pool for the assets to be swapped. For instance, swapping TON for SCALE (a jetton token) involves:

```typescript
import { Asset, VaultNative } from "@dedust/sdk";

//Native vault is for TON
const tonVault = tonClient.open(await factory.getNativeVault());
//We use the factory to find our native coin (Toncoin) Vault.
```

Finding the Vault and Pool for both TON and SCALE.

```typescript
import { PoolType } from "@dedust/sdk";

const SCALE_ADDRESS = Address.parse(
  "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE",
);
// master address of SCALE jetton
const TON = Asset.native();
const SCALE = Asset.jetton(SCALE_ADDRESS);

const pool = tonClient.open(
  await factory.getPool(PoolType.VOLATILE, [TON, SCALE]),
);
```

Ensure that the contracts are deployed: Always check that the contracts for the vault and pool are active, as sending funds to inactive contracts may result in permanent loss.
```typescript
import { ReadinessStatus } from "@dedust/sdk";

// Check if the pool exists:
if ((await pool.getReadinessStatus()) !== ReadinessStatus.READY) {
  throw new Error("Pool (TON, SCALE) does not exist.");
}

// Check if the vault exits:
if ((await tonVault.getReadinessStatus()) !== ReadinessStatus.READY) {
  throw new Error("Vault (TON) does not exist.");
}
```

Sending transfer messages: Once the vault and pool are confirmed, send the transfer message with the amount of TON to be swapped for SCALE.

```typescript
import { toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";

  if (!process.env.MNEMONIC) {
    throw new Error("Environment variable MNEMONIC is required.");
  }

  const mnemonic = process.env.MNEMONIC.split(" ");

  const keys = await mnemonicToPrivateKey(mnemonic);
  const wallet = tonClient.open(
    WalletContractV3R2.create({
      workchain: 0,
      publicKey: keys.publicKey,
    }),
  );

const sender = wallet.sender(keys.secretKey);

const amountIn = toNano("5"); // 5 TON

await tonVault.sendSwap(sender, {
  poolAddress: pool.address,
  amount: amountIn,
  gasAmount: toNano("0.25"),
});
```

To swap Token X with Y, the process is the same, for instance, we send an amount of X token to vault X, vault X
receives our asset, holds it, and informs Pool of (X, Y) that this address asks for a swap, now Pool based on
calculation informs another Vault, here Vault Y releases equivalent Y to the user who requests swap.

The difference between assets is just about the transfer method for example, for jettons, we transfer them to the Vault using a transfer message and attach a specific forward_payload, but for the native coin, we send a swap message to the Vault, attaching the corresponding amount of TON.

This is the schema for TON and jetton :

```tlb
swap#ea06185d query_id:uint64 amount:Coins _:SwapStep swap_params:^SwapParams = InMsgBody;
```

So every vault and corresponding Pool is designed for specific swaps and has a special API tailored to special assets.

This was swapping TON with jetton SCALE. The process for swapping jetton with jetton is the same, the only difference is we should provide the payload that was described in the TL-B schema.

```TL-B
swap#e3a0d482 _:SwapStep swap_params:^SwapParams = ForwardPayload;
```

```typescript
//find Vault
const scaleVault = tonClient.open(await factory.getJettonVault(SCALE_ADDRESS));
```

```typescript
//find jetton address
import { JettonRoot, JettonWallet } from '@dedust/sdk';

const scaleRoot = tonClient.open(JettonRoot.createFromAddress(SCALE_ADDRESS));
const scaleWallet = tonClient.open(await scaleRoot.getWallet(sender.address);

// Transfer jettons to the Vault (SCALE) with corresponding payload

const amountIn = toNano('50'); // 50 SCALE

await scaleWallet.sendTransfer(sender, toNano("0.3"), {
  amount: amountIn,
  destination: scaleVault.address,
  responseAddress: sender.address, // return gas to user
  forwardAmount: toNano("0.25"),
  forwardPayload: VaultJetton.createSwapPayload({ poolAddress }),
});
```

</TabItem>

<TabItem value="ton-kotlin" label="ton-kotlin">

Build Asset slice:
```kotlin
val assetASlice = buildCell {
    storeUInt(1,4)
    storeInt(JETTON_MASTER_A.workchainId, 8)
    storeBits(JETTON_MASTER_A.address)
}.beginParse()
```

Run get methods:
```kotlin
val responsePool = runBlocking {
    liteClient.runSmcMethod(
        LiteServerAccountId(DEDUST_FACTORY.workchainId, DEDUST_FACTORY.address),
        "get_pool_address",
        VmStackValue.of(0),
        VmStackValue.of(assetASlice),
        VmStackValue.of(assetBSlice)
    )
}
stack = responsePool.toMutableVmStack()
val poolAddress = stack.popSlice().loadTlb(MsgAddressInt) as AddrStd
```

Build and transfer message:
```kotlin
runBlocking {
    wallet.transfer(pk, WalletTransfer {
        destination = JETTON_WALLET_A // yours existing jetton wallet
        bounceable = true
        coins = Coins(300000000) // 0.3 ton in nanotons
        messageData = MessageData.raw(
            body = buildCell {
                storeUInt(0xf8a7ea5, 32) // op Transfer
                storeUInt(0, 64) // query_id
                storeTlb(Coins, Coins(100000000)) // amount of jettons
                storeSlice(addrToSlice(jettonAVaultAddress)) // destination address
                storeSlice(addrToSlice(walletAddress))  // response address
                storeUInt(0, 1)  // custom payload
                storeTlb(Coins, Coins(250000000)) // forward_ton_amount // 0.25 ton in nanotons
                storeUInt(1, 1)
                // forward_payload
                storeRef {
                    storeUInt(0xe3a0d482, 32) // op swap
                    storeSlice(addrToSlice(poolAddress)) // pool_addr
                    storeUInt(0, 1) // kind
                    storeTlb(Coins, Coins(0)) // limit
                    storeUInt(0, 1) // next (for multihop)
                    storeRef {
                        storeUInt(System.currentTimeMillis() / 1000 + 60 * 5, 32) // deadline
                        storeSlice(addrToSlice(walletAddress)) // recipient address
                        storeSlice(buildCell { storeUInt(0, 2) }.beginParse()) // referral (null address)
                        storeUInt(0, 1)
                        storeUInt(0, 1)
                        endCell()
                    }
                }
            }
        )
        sendMode = 3
    })
}
```
</TabItem>

<TabItem value="py" label="Python">

This example shows how to swap Toncoins to jettons.

```py
from pytoniq import Address, begin_cell, LiteBalancer, WalletV4R2
import time
import asyncio

DEDUST_FACTORY = "EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67"
DEDUST_NATIVE_VAULT = "EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_"

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)

    JETTON_MASTER = Address("EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE")  # jetton address swap to
    TON_AMOUNT = 10**9  # 1 ton - swap amount
    GAS_AMOUNT = 10**9 // 4  # 0.25 ton for gas

    pool_type = 0 # Volatile pool type

    asset_native = (begin_cell()
                   .store_uint(0, 4) # Asset type is native
                   .end_cell().begin_parse())
    asset_jetton = (begin_cell()
                   .store_uint(1, 4) # Asset type is jetton
                   .store_uint(JETTON_MASTER.wc, 8)
                   .store_bytes(JETTON_MASTER.hash_part)
                   .end_cell().begin_parse())

    stack = await provider.run_get_method(
        address=DEDUST_FACTORY, method="get_pool_address",
        stack=[pool_type, asset_native, asset_jetton]
    )
    pool_address = stack[0].load_address()

    swap_params = (begin_cell()
                  .store_uint(int(time.time() + 60 * 5), 32) # Deadline
                  .store_address(wallet.address) # Recipient address
                  .store_address(None) # Referall address
                  .store_maybe_ref(None) # Fulfill payload
                  .store_maybe_ref(None) # Reject payload
                  .end_cell())
    swap_body = (begin_cell()
                .store_uint(0xea06185d, 32) # Swap op-code
                .store_uint(0, 64) # Query id
                .store_coins(int(1*1e9)) # Swap amount
                .store_address(pool_address)
                .store_uint(0, 1) # Swap kind
                .store_coins(0) # Swap limit
                .store_maybe_ref(None) # Next step for multi-hop swaps
                .store_ref(swap_params)
                .end_cell())

    await wallet.transfer(destination=DEDUST_NATIVE_VAULT,
                          amount=TON_AMOUNT + GAS_AMOUNT, # swap amount + gas
                          body=swap_body)

    await provider.close_all()

asyncio.run(main())

```
</TabItem>
</Tabs>

## Basics of message processing

### How to parse transactions of an account (transfers, jettons, NFTs)?

The list of transactions on an account can be fetched through `getTransactions` API method. It returns an array of `Transaction` objects, with each item having lots of attributes. However, the fields that are the most commonly used are:
 - Sender, Body and Value of the message that initiated this transaction
 - Transaction's hash and logical time (LT)

_Sender_ and _Body_ fields may be used to determine the type of message (regular transfer, jetton transfer, nft transfer etc).

Below is an example on how you can fetch 5 most recent transactions on any blockchain account, parse them depending on the type and print out in a loop.

<Tabs groupId="code-examples">
<TabItem value="js-ton" label="JS (@ton)">

```js
import { Address, TonClient, beginCell, fromNano } from '@ton/ton';

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: '1b312c91c3b691255130350a49ac5a0742454725f910756aff94dfe44858388e',
    });

    const myAddress = Address.parse('EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN'); // address that you want to fetch transactions from

    const transactions = await client.getTransactions(myAddress, {
        limit: 5,
    });

    for (const tx of transactions) {
        const inMsg = tx.inMessage;

        if (inMsg?.info.type == 'internal') {
            // we only process internal messages here because they are used the most
            // for external messages some of the fields are empty, but the main structure is similar
            const sender = inMsg?.info.src;
            const value = inMsg?.info.value.coins;

            const originalBody = inMsg?.body.beginParse();
            let body = originalBody.clone();
            if (body.remainingBits < 32) {
                // if body doesn't have opcode: it's a simple message without comment
                console.log(`Simple transfer from ${sender} with value ${fromNano(value)} TON`);
            } else {
                const op = body.loadUint(32);
                if (op == 0) {
                    // if opcode is 0: it's a simple message with comment
                    const comment = body.loadStringTail();
                    console.log(
                        `Simple transfer from ${sender} with value ${fromNano(value)} TON and comment: "${comment}"`
                    );
                } else if (op == 0x7362d09c) {
                    // if opcode is 0x7362d09c: it's a Jetton transfer notification

                    body.skip(64); // skip query_id
                    const jettonAmount = body.loadCoins();
                    const jettonSender = body.loadAddressAny();
                    const originalForwardPayload = body.loadBit() ? body.loadRef().beginParse() : body;
                    let forwardPayload = originalForwardPayload.clone();

                    // IMPORTANT: we have to verify the source of this message because it can be faked
                    const runStack = (await client.runMethod(sender, 'get_wallet_data')).stack;
                    runStack.skip(2);
                    const jettonMaster = runStack.readAddress();
                    const jettonWallet = (
                        await client.runMethod(jettonMaster, 'get_wallet_address', [
                            { type: 'slice', cell: beginCell().storeAddress(myAddress).endCell() },
                        ])
                    ).stack.readAddress();
                    if (!jettonWallet.equals(sender)) {
                        // if sender is not our real JettonWallet: this message was faked
                        console.log(`FAKE Jetton transfer`);
                        continue;
                    }

                    if (forwardPayload.remainingBits < 32) {
                        // if forward payload doesn't have opcode: it's a simple Jetton transfer
                        console.log(`Jetton transfer from ${jettonSender} with value ${fromNano(jettonAmount)} Jetton`);
                    } else {
                        const forwardOp = forwardPayload.loadUint(32);
                        if (forwardOp == 0) {
                            // if forward payload opcode is 0: it's a simple Jetton transfer with comment
                            const comment = forwardPayload.loadStringTail();
                            console.log(
                                `Jetton transfer from ${jettonSender} with value ${fromNano(
                                    jettonAmount
                                )} Jetton and comment: "${comment}"`
                            );
                        } else {
                            // if forward payload opcode is something else: it's some message with arbitrary structure
                            // you may parse it manually if you know other opcodes or just print it as hex
                            console.log(
                                `Jetton transfer with unknown payload structure from ${jettonSender} with value ${fromNano(
                                    jettonAmount
                                )} Jetton and payload: ${originalForwardPayload}`
                            );
                        }

                        console.log(`Jetton Master: ${jettonMaster}`);
                    }
                } else if (op == 0x05138d91) {
                    // if opcode is 0x05138d91: it's a NFT transfer notification

                    body.skip(64); // skip query_id
                    const prevOwner = body.loadAddress();
                    const originalForwardPayload = body.loadBit() ? body.loadRef().beginParse() : body;
                    let forwardPayload = originalForwardPayload.clone();

                    // IMPORTANT: we have to verify the source of this message because it can be faked
                    const runStack = (await client.runMethod(sender, 'get_nft_data')).stack;
                    runStack.skip(1);
                    const index = runStack.readBigNumber();
                    const collection = runStack.readAddress();
                    const itemAddress = (
                        await client.runMethod(collection, 'get_nft_address_by_index', [{ type: 'int', value: index }])
                    ).stack.readAddress();

                    if (!itemAddress.equals(sender)) {
                        console.log(`FAKE NFT Transfer`);
                        continue;
                    }

                    if (forwardPayload.remainingBits < 32) {
                        // if forward payload doesn't have opcode: it's a simple NFT transfer
                        console.log(`NFT transfer from ${prevOwner}`);
                    } else {
                        const forwardOp = forwardPayload.loadUint(32);
                        if (forwardOp == 0) {
                            // if forward payload opcode is 0: it's a simple NFT transfer with comment
                            const comment = forwardPayload.loadStringTail();
                            console.log(`NFT transfer from ${prevOwner} with comment: "${comment}"`);
                        } else {
                            // if forward payload opcode is something else: it's some message with arbitrary structure
                            // you may parse it manually if you know other opcodes or just print it as hex
                            console.log(
                                `NFT transfer with unknown payload structure from ${prevOwner} and payload: ${originalForwardPayload}`
                            );
                        }
                    }

                    console.log(`NFT Item: ${itemAddress}`);
                    console.log(`NFT Collection: ${collection}`);
                } else {
                    // if opcode is something else: it's some message with arbitrary structure
                    // you may parse it manually if you know other opcodes or just print it as hex
                    console.log(
                        `Message with unknown structure from ${sender} with value ${fromNano(
                            value
                        )} TON and body: ${originalBody}`
                    );
                }
            }
        }
        console.log(`Transaction Hash: ${tx.hash().toString('hex')}`);
        console.log(`Transaction LT: ${tx.lt}`);
        console.log();
    }
}

main().finally(() => console.log('Exiting...'));
```

</TabItem>

<TabItem value="py" label="Python">

```py
from pytoniq import LiteBalancer, begin_cell
import asyncio

async def parse_transactions(transactions):
    for transaction in transactions:
        if not transaction.in_msg.is_internal:
            continue
        if transaction.in_msg.info.dest.to_str(1, 1, 1) != MY_WALLET_ADDRESS:
            continue

        sender = transaction.in_msg.info.src.to_str(1, 1, 1)
        value = transaction.in_msg.info.value_coins
        if value != 0:
            value = value / 1e9

        if len(transaction.in_msg.body.bits) < 32:
            print(f"TON transfer from {sender} with value {value} TON")
        else:
            body_slice = transaction.in_msg.body.begin_parse()
            op_code = body_slice.load_uint(32)

            # TextComment
            if op_code == 0:
                print(f"TON transfer from {sender} with value {value} TON and comment: {body_slice.load_snake_string()}")

            # Jetton Transfer Notification
            elif op_code == 0x7362d09c:
                body_slice.load_bits(64) # skip query_id
                jetton_amount = body_slice.load_coins() / 1e9
                jetton_sender = body_slice.load_address().to_str(1, 1, 1)
                if body_slice.load_bit():
                    forward_payload = body_slice.load_ref().begin_parse()
                else:
                    forward_payload = body_slice

                jetton_master = (await provider.run_get_method(address=sender, method="get_wallet_data", stack=[]))[2].load_address()
                jetton_wallet = (await provider.run_get_method(address=jetton_master, method="get_wallet_address",
                                                               stack=[
                                                                        begin_cell().store_address(MY_WALLET_ADDRESS).end_cell().begin_parse()
                                                                     ]))[0].load_address().to_str(1, 1, 1)

                if jetton_wallet != sender:
                    print("FAKE Jetton Transfer")
                    continue

                if len(forward_payload.bits) < 32:
                    print(f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton")
                else:
                    forward_payload_op_code = forward_payload.load_uint(32)
                    if forward_payload_op_code == 0:
                        print(f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and comment: {forward_payload.load_snake_string()}")
                    else:
                        print(f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and unknown payload: {forward_payload} ")

            # NFT Transfer Notification
            elif op_code == 0x05138d91:
                body_slice.load_bits(64) # skip query_id
                prev_owner = body_slice.load_address().to_str(1, 1, 1)
                if body_slice.load_bit():
                    forward_payload = body_slice.load_ref().begin_parse()
                else:
                    forward_payload = body_slice

                stack = await provider.run_get_method(address=sender, method="get_nft_data", stack=[])
                index = stack[1]
                collection = stack[2].load_address()
                item_address = (await provider.run_get_method(address=collection, method="get_nft_address_by_index",
                                                              stack=[index]))[0].load_address().to_str(1, 1, 1)

                if item_address != sender:
                    print("FAKE NFT Transfer")
                    continue

                if len(forward_payload.bits) < 32:
                    print(f"NFT transfer from {prev_owner}")
                else:
                    forward_payload_op_code = forward_payload.load_uint(32)
                    if forward_payload_op_code == 0:
                        print(f"NFT transfer from {prev_owner} with comment: {forward_payload.load_snake_string()}")
                    else:
                        print(f"NFT transfer from {prev_owner} with unknown payload: {forward_payload}")

                print(f"NFT Item: {item_address}")
                print(f"NFT Collection: {collection}")
        print(f"Transaction hash: {transaction.cell.hash.hex()}")
        print(f"Transaction lt: {transaction.lt}")

MY_WALLET_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"
provider = LiteBalancer.from_mainnet_config(1)

async def main():
    await provider.start_up()
    transactions = await provider.get_transactions(address=MY_WALLET_ADDRESS, count=5)
    await parse_transactions(transactions)
    await provider.close_all()

asyncio.run(main())
```
</TabItem>

</Tabs>

Note that this example covers only the simplest case with incoming messages, where it is enough to fetch the transactions on a single account. If you want to go deeper and handle more complex chains of transactions and messages, you should take `tx.outMessages` field into account. It contains the list of the output messages sent by smart-contract in the result of this transaction. To understand the whole logic better, you can read these articles:
* [Message overview](/v3/documentation/smart-contracts/message-management/messages-and-transactions)
* [Internal messages](/v3/documentation/smart-contracts/message-management/internal-messages)

This topic is explored in depth in the [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing) article.

### How to find transaction for a certain TON Connect result?

TON Connect 2 only returns the cell sent to the blockchain, not the transaction hash itself, as the transaction may not be confirmed. To track a transaction from TON Connect, you can search for it in your account history using an indexer.
:::tip
You can use an indexer to make the search easier. The provided implementation is for `TonClient` connected to a RPC.
:::

Prepare `retry` function for attempts on listening blockchain:
```typescript

export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof Error) {
        lastError = e;
      }
      await new Promise(resolve => setTimeout(resolve, options.delay));
    }
  }
  throw lastError;
}

```

Create a listener function that will assert specific transaction on certain account with specific incoming external message, equal to body message in boc:

<Tabs>
<TabItem value="ts" label="@ton/ton">

```typescript

import {Cell, Address, beginCell, storeMessage, TonClient} from "@ton/ton";

const res = tonConnectUI.send(msg); // exBoc in the result of sending message
const exBoc = res.boc;
const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'INSERT YOUR API-KEY', // https://t.me/tonapibot
    });

export async function getTxByBOC(exBoc: string): Promise<string> {

    const myAddress = Address.parse('INSERT TON WALLET ADDRESS'); // Address to fetch transactions from

    return retry(async () => {
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        for (const tx of transactions) {
            const inMsg = tx.inMessage;
            if (inMsg?.info.type === 'external-in') {

                const inBOC = inMsg?.body;
                if (typeof inBOC === 'undefined') {

                    reject(new Error('Invalid external'));
                    continue;
                }
                const extHash = Cell.fromBase64(exBoc).hash().toString('hex')
                const inHash = beginCell().store(storeMessage(inMsg)).endCell().hash().toString('hex')

                console.log(' hash BOC', extHash);
                console.log('inMsg hash', inHash);
                console.log('checking the tx', tx, tx.hash().toString('hex'));


                // Assuming `inBOC.hash()` is synchronous and returns a hash object with a `toString` method
                if (extHash === inHash) {
                    console.log('Tx match');
                    const txHash = tx.hash().toString('hex');
                    console.log(`Transaction Hash: ${txHash}`);
                    console.log(`Transaction LT: ${tx.lt}`);
                    return (txHash);
                }
            }
        }
        throw new Error('Transaction not found');
    }, {retries: 30, delay: 1000});
}

 txRes = getTxByBOC(exBOC);
 console.log(txRes);
```

</TabItem>

</Tabs>

### How to find transaction or message hash?

:::info
Be careful with the hash definition. It can be either a transaction hash or a message hash.
:::

To get transaction hash you need to use a `hash` method of a transaction. To get external message hash you need
to build a message cell using a `storeMessage` method and then use a `hash` method of this cell.

<Tabs>
  <TabItem value="ts" label="@ton/ton">

```typescript
import { storeMessage, TonClient } from '@ton/ton';
import { Address, beginCell } from '@ton/core';

const tonClient = new TonClient({ endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' });

const transactions = await tonClient.getTransactions(Address.parse('[ADDRESS]'), { limit: 10 });
for (const transaction of transactions) {
  // ful transaction hash
  const transactionHash = transaction.hash();

  const inMessage = transaction.inMessage;
  if (inMessage?.info.type === 'external-in') {
    const inMessageCell = beginCell().store(storeMessage(inMessage)).endCell();
    // external-in message hash
    const inMessageHash = inMessageCell.hash();
  }

  // also you can get hash of out messages if needed
  for (const outMessage of transaction.outMessages.values()) {
    const outMessageCell = beginCell().store(storeMessage(outMessage)).endCell();
    const outMessageHash = outMessageCell.hash();
  }
}
```

  </TabItem>

</Tabs>

Also you can get a hash of message when building it. Note that this is the same hash as the hash of the message sent to initiate the transaction, as in the previous example.

<Tabs>
  <TabItem value="ts" label="@ton/ton">

```typescript
import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import { internal, TonClient, WalletContractV4 } from '@ton/ton';
import { toNano } from '@ton/core';

const tonClient = new TonClient({ endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' });

const mnemonic = await mnemonicNew();
const keyPair = await mnemonicToPrivateKey(mnemonic);
const wallet = tonClient.open(WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 }));
const transfer = await wallet.createTransfer({
  secretKey: keyPair.secretKey,
  seqno: 0,
  messages: [
    internal({
      to: wallet.address,
      value: toNano(1)
    })
  ]
});
const inMessageHash = transfer.hash();
```

  </TabItem>

</Tabs>

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Getting started
Before diving into dApps, make sure you understand blockchain fundamentals. You may find our [The Open Network](/v3/concepts/dive-into-ton/introduction) and [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains) articles useful.

TON dApps are applications without a backend that interact with the blockchain. In most cases, they work with custom [smart contracts](/v3/documentation/smart-contracts/overview). This documentation explains how to process standard assets available in TON, both as examples and to accelerate dApp development.

You can write dApps in any programming language that has an SDK for TON. Most developers build them as websites, followed by Telegram Mini Apps.

<Button href="/v3/guidelines/dapps/tma/overview" colorType={'primary'} sizeType={'sm'}>

Build a TMA

</Button>


<Button href="/v3/guidelines/dapps/apis-sdks/sdk" colorType="secondary" sizeType={'sm'}>

Choose an SDK

</Button>



## TON course: dApps

:::tip
Before starting the course, make sure you have a solid understanding of blockchain basics. If you need a refresher, we recommend taking the [Blockchain basics with TON](https://stepik.org/course/201294/promo) ([RU version](https://stepik.org/course/202221/), [CHN version](https://stepik.org/course/200976/)) course.
Module 3 covers core dApp concepts.
:::

The [TON Blockchain course](https://stepik.org/course/176754/) is a comprehensive guide to TON Blockchain development.

Module 5 and 6 completely fully cover DApp development. You'll learn how to build a dApp, work with TON Connect, use SDKs, and interact with the blockchain.


<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Check TON Blockchain course

</Button>


<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>


## Basic tools and resources

Here are key resources for your dApp development journey:

1. [Developer wallets](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps)
2. [Blockchain explorers](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton)
3. [API documentation](/v3/guidelines/dapps/apis-sdks/api-types)
4. [SDKs for various languages](/v3/guidelines/dapps/apis-sdks/sdk)
5. [Using the testnet](/v3/documentation/smart-contracts/getting-started/testnet)
6. [TON unfreezer](https://unfreezer.ton.org/)

### Asset management

Working with assets? These guides cover the essentials:

- [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)
- [Token (jetton) processing](/v3/guidelines/dapps/asset-processing/jettons)
- [Handling NFTs](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
- [Parsing metadata](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)

### Introduction to DeFi

Interested in decentralized finance (DeFi)? These resources explain how to manage different asset types:

- [Understanding Toncoin](/v3/documentation/dapps/defi/coins)
- [Tokens: jettons & NFTs](/v3/documentation/dapps/defi/tokens)
- [TON payments](/v3/documentation/dapps/defi/ton-payments)
- [Setting up subscriptions](/v3/documentation/dapps/defi/subscriptions)

## Tutorials and examples

### DeFi basics

- Create your first token: [Mint your first jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token)
- Step by Step: [NFT collection minting](/v3/guidelines/dapps/tutorials/nft-minting-guide)

### Language-specific guides

#### JavaScript

- [Payment process](https://github.com/toncenter/examples)
- [TON bridge](https://github.com/ton-blockchain/bridge)
- [Web wallet](https://github.com/toncenter/ton-wallet)
- [Dumpling sales bot](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

#### Python

- [Example projects](https://github.com/psylopunk/pytonlib/tree/main/examples)
- [Storefront bot](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)

#### Go

- [Examples](https://github.com/xssnick/tonutils-go/tree/master/example)

### Advanced topics

- [Zero-knowledge proofs](/v3/guidelines/dapps/tutorials/zero-knowledge-proofs)

### Wallet examples

- [Desktop standard wallet (C++ and Qt)](https://github.com/ton-blockchain/wallet-desktop)
- [Android standard wallet (Java)](https://github.com/ton-blockchain/wallet-android)
- [iOS standard wallet (Swift)](https://github.com/ton-blockchain/wallet-ios)
- [TonLib CLI (C++)](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/tonlib-cli.cpp)

## 👨‍💻 Contribution

Missing some crucial material? You can either write a tutorial yourself or describe the issue to the community.


<Button href="/v3/contribute/participate" colorType="primary" sizeType={'sm'}>

Contribute

</Button>


<Button href="https://github.com/ton-community/ton-docs/issues/new?assignees=&labels=feature+%3Asparkles%3A%2Ccontent+%3Afountain_pen%3A&template=suggest_tutorial.yaml&title=Suggest+a+tutorial" colorType={'secondary'} sizeType={'sm'}>

Suggest a tutorial

</Button>



<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tma/grants.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/grants.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Grants

## Telegram Web3 Grants

To drive innovation, [TON Foundation](https://ton.foundation/en) has launched the [Telegram Web3 Grants](http://t.me/toncoin/991) program. This initiative encourages developers to create new platforms or migrate existing ones to TON and Telegram.

## How to participate?

Whether you're a well-established business, a new startup, or an individual developer, now is the perfect time to get involved. Submit your Telegram application via [this bot](https://t.me/app_moderation_bot) and apply for [the grant program](https://t.me/trendingapps/33). Let's shape the future together.


<Button href="https://t.me/app_moderation_bot" colorType={'primary'} sizeType={'sm'}>

Submit application

</Button>


<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tma/guidelines/monetization.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/guidelines/monetization.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'
import ThemedImage from '@theme/ThemedImage';


# Monetization


## Wallet Pay
<br></br>
<img src="https://storage.googleapis.com/ton-strapi/reason_Card5_19eeac1401/reason_Card5_19eeac1401.png" alt="Wallet Pay illustration"/>
<br></br>
Wallet Pay is the primary payment system for Telegram Mini Apps, supporting both crypto and fiat transactions. Monitor your order statistics and withdraw funds easily.
Embedded within the Wallet ecosystem, Wallet Pay facilitates seamless financial exchanges between merchants and their customers.

Useful links:
- [Wallet Pay Business Support](https://t.me/WalletPay_supportbot) is a Telegram bot for contacting the Wallet Pay support team.
- [Demo Store Bot](https://t.me/PineAppleDemoWPStoreBot) is a Telegram bot for demonstrating Wallet Pay functionality.

:::note
All payments are processed using real assets
:::

- [Merchant Community](https://t.me/+6TReWBEyZxI5Njli) is a Telegram group for members to share experiences and solutions.



## TON Connect

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/ton-connect/ton-connect_1.svg?raw=true',
    dark: '/img/docs/ton-connect/ton-connect_1-dark.svg?raw=true',
  }}
/>
<br></br>

TON Connect is a communication protocol that links **wallets** and **apps** in TON.

**Apps** built on TON provide rich functionality and high performance and are designed to protect user funds via smart contracts. Because these apps use decentralized technologies like blockchain, they are commonly referred to as decentralized applications (DApps).

**Wallets** provide the interface to approving transactions securely store users’ cryptographic keys on their personal devices. This separation of responsibilities enables rapid innovation and ensures a high level of security for users. Wallets do not need to create closed ecosystems, while apps do not need to bear the risk of storing users' accounts.

TON Connect enhances the user experience by enabling seamless interaction between wallets and apps.


<Button href="/v3/guidelines/ton-connect/overview" colorType={'primary'} sizeType={'sm'}>

Discover TON Connect

</Button>


## Integrate tokens

You can create your own token on TON Blockchain and integrate it into your app. You can also integrate existing tokens into your app.


<Button href="/v3/documentation/dapps/defi/tokens" colorType={'primary'} sizeType={'sm'}>

Understand DeFi

</Button>


## Subscriptions on TON

Because transactions on the TON blockchain are fast and network fees are low, you can process recurring payments on-chain via smart contracts.

For example, users can subscribe to digital content or other services and pay a monthly fee of 1 TON.



<Button href="/v3/documentation/dapps/defi/subscriptions" colorType={'primary'} sizeType={'sm'}>

Read more

</Button>


<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tma/guidelines/publishing.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/guidelines/publishing.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'


# Publishing Mini Apps

As developers, it's important to understand the ecosystem we operate in. Telegram offers a unique opportunity for Mini App developers through its robust platform and expansive user base. This article outlines the available channels for publishing your Mini Apps on Telegram.

## tApps Center

**What is tApps Center?** The TON Foundation launched the Telegram Apps Center to serve as a centralized repository for Telegram Bots and Mini Apps (TMAs). This platform enhances the user experience by providing an interface similar to familiar app stores.

**Broad ecosystem support**. The Telegram Apps Center is not limited to TON Ecosystem—it welcomes apps from other blockchains as well. Web3 integration is not required to be listed in this catalog. This inclusive approach aims to position Telegram as an "Everything Super App", similar to WeChat, where users can access a variety of services within a single interface.


<Button href="https://www.tapps.center/" colorType={'primary'} sizeType={'sm'}>

Open tApps Center

</Button>


### Why publish on tApps Center?

**Greater visibility**. The Telegram Apps Center provides developers with a prime opportunity to showcase their projects to a broad audience, making it easier to attract users and investors.

**Community spirit**. The platform fosters a community-driven environment, promoting collaboration and the exchange of resources and knowledge.


<Button href="https://blog.ton.org/ton-ecosystem-evolved-introducing-telegram-apps-center-t-apps-center" colorType={'secondary'} sizeType={'sm'}>

Read more in TON Blog

</Button>


## Launch within Telegram

Telegram currently supports six different ways to launch Mini Apps: from a [keyboard button](https://core.telegram.org/bots/webapps#keyboard-button-web-apps), from an [inline button](https://core.telegram.org/bots/webapps#inline-button-web-apps), from the [bot menu button](https://core.telegram.org/bots/webapps#launching-web-apps-from-the-menu-button), via [inline mode](https://core.telegram.org/bots/webapps#inline-mode-web-apps), from a [direct link](https://core.telegram.org/bots/webapps#direct-link-web-apps), and even from the [attachment menu](https://core.telegram.org/bots/webapps#launching-web-apps-from-the-attachment-menu).

![](/img/docs/telegram-apps/publish-tg-1.jpeg)

### Keyboard button Mini Apps

**TL;DR:** Mini Apps launched from a **web_app** type [keyboard button](https://core.telegram.org/bots/api#keyboardbutton) can send data back to the bot in a *service message* using [Telegram.WebApp.sendData](https://core.telegram.org/bots/webapps#initializing-web-apps), allowing the bot to respond without communicating with any external servers.

Users can interact with bots using [custom keyboards](https://core.telegram.org/bots#keyboards), [buttons under bot messages](https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating), as well as by sending freeform **text messages** or any of the **attachment types** supported by Telegram, such as photos, videos, files, locations, contacts, and polls. Bots can leverage **HTML5** for user-friendly input interfaces.

You can send a **web_app** type [KeyboardButton](https://core.telegram.org/bots/api#keyboardbutton) that opens a Mini App from a specific URL.

To transmit user data back to the bot, the Mini App calls the [Telegram.WebApp.sendData](https://core.telegram.org/bots/webapps#initializing-web-apps) method. The bot receives the data as a string in a service message and can continue interacting with the user.

**Good for:**

- **Custom data input interfaces** such as a personalized calendar, advanced search lists, a randomizer that selects an option, etc.
- **Reusable components** that do not depend on a particular bot.

### Inline button Mini Apps

**TL;DR:** For interactive Mini Apps like [@DurgerKingBot](https://t.me/durgerkingbot), use a **web_app** type [Inline KeyboardButton](https://core.telegram.org/bots/api#inlinekeyboardbutton), which retrieves basic user information and allows the user to send a message to the bot.

If receiving text data alone is insufficient or you need a more advanced and personalized interface, you can open a Mini App using a **web_app** type [Inline KeyboardButton](https://core.telegram.org/bots/api#inlinekeyboardbutton).

Clicking the button opens a Mini App at the specified URL. The Mini App receives the user’s [theme settings](https://core.telegram.org/bots/webapps#color-schemes), , basic information (ID, name, username, language code), and a unique session identifier **query_id**, enabling message sending on behalf of the user.

The bot can call the Bot API method [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) to send an inline message from the user back to the bot and close the Mini App. After receiving the message, the bot can continue interacting with the user.

**Good for:**

- Fully-fledged web services and integrations,
- **Unlimited** use cases.

### Launching Mini Apps from the menu button

**TL;DR:** Mini Apps can be launched from a customized menu button. This provides quick access to the app and functions **identically** to [launching a Mini App from an inline button](https://core.telegram.org/bots/webapps#inline-button-web-apps).

By default, chats with bots always show a convenient **menu button** that provides quick access to all listed [commands](https://core.telegram.org/bots#commands). With [Bot API 6.0](https://core.telegram.org/bots/api-changelog#april-16-2022), this button can be used to **launch a Mini App** instead.

To configure the menu button, specify the text it should show and the Mini App URL. There are two ways to set these parameters:

- To customize the button for **all users**, use [@BotFather](https://t.me/botfather) (the /setmenubutton command or *Bot Settings > Menu Button*).
- To customize the button for both **all users** and **specific users**, use the [setChatMenuButton](https://core.telegram.org/bots/api#setchatmenubutton) method in the Bot API. For example, change the button text according to the user's language, or show links to different web apps based on the user's settings in your bot.

Apart from this, Web Apps opened via the menu button work in the same way as [inline buttons](https://core.telegram.org/bots/webapps#inline-button-web-apps).

[@DurgerKingBot](https://t.me/durgerkingbot) allows launching its Mini App both from both an inline button and the menu button.

### Inline mode Mini Apps

**TL;DR:** Mini Apps launched via **web_app** type [InlineQueryResultsButton](https://core.telegram.org/bots/api#inlinequeryresultsbutton) can be used anywhere in inline mode. Users can create content in a web interface and seamlessly send it to the current chat via inline mode.

**New**: The *button* parameter in the [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery) method to display a special 'Switch to Mini App' button either above or in place of the inline results. This button will **open a Mini App** from the specified URL. Once done, you can call the [Telegram.WebApp.switchInlineQuery](https://core.telegram.org/bots/webapps#initializing-web-apps) method to send the user back to inline mode.

Inline Mini Apps have **no access** to the chat – they can't read messages or send new ones on behalf of the user. To send messages, the user must be redirected to **inline mode** and actively pick a result.

**Good for:**

- Fully-fledged web services and integrations in inline mode.

### Direct link Mini Apps

**TL;DR:** Mini App bots can be launched from a direct link in any chat. They support a *startapp* parameter and are aware of the current chat context.

**New**: Direct links **open a Mini App** in the current chat. If a non-empty *startapp* parameter is included in the link, it appears in the Mini App's *start_param* field and in the GET parameter *tgWebAppStartParam*.

In this mode, Mini Apps use *chat_type* and *chat_instance* parameters to track the current chat context. This enables **concurrent** and **shared** usage among multiple chat members–ideal for live whiteboards, group orders, multiplayer games, and similar apps.

Mini Apps opened from a direct link have **no access** to the chat–they can't read and send messages. Users must switch to inline mode to send messages.

**Examples**

- https://t.me/botusername/appname
- https://t.me/botusername/appname?startapp=command

**Good for:**

- Fully-fledged web services and integrations accessible in one tap,
- Cooperative, multiplayer, or teamwork-oriented services within a chat,
- **Unlimited** use cases.

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tma/guidelines/testing-apps.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/guidelines/testing-apps.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage'

# Testing Mini Apps

## Using bots in the test environment

To log in to the test environment, use one of the following methods:

- **iOS:** Tap 10 times on the Settings icon. Navigate to > Accounts > Login to another account > Test.
- **Telegram Desktop:** Open ☰ Settings > Shift + Alt + Right click **Add Account** and select **Test Server**.
- **macOS:** Click the Settings icon 10 times to open the Debug Menu. `⌘` + Click **Add Account** and log in using your phone number.

The test environment is completely separate from the main environment. You must create a **new user account** and a **new bot** using [@BotFather](https://t.me/BotFather).


Once you have received your bot token, send requests to the Bot API using this format:

`https://api.telegram.org/bot<token>/test/METHOD_NAME`

**Note:** When using the test environment, you may use HTTP links without TLS to test your Mini App.

## Debug mode for Mini Apps

Use the following tools to identify app-specific issues in your Mini App.

### Android

- [Enable USB-Debugging](https://developer.chrome.com/docs/devtools/remote-debugging/) on your device.
- In Telegram Settings, scroll to the bottom, press and hold the **version number** two times.
- Choose *Enable WebView Debug* in Debug Settings.
- Connect your phone to your computer and open chrome://inspect/#devices in Chrome.
- Launch your Mini App on your phone, and it will appear in Chrome’s Inspect Devices tab.

### iOS

iOS WebView debugging requires the Safari desktop browser on macOS.

**On iOS device:**
- Go to *Settings*.
- Scroll down and tap Safari.
- Scroll to the bottom and press *Advanced*.
- Enable *Web Inspector*.

**On macOS:**
- Open Safari.
- Open *Settings* (`⌘` + `,`).
- Select the *Advanced* tab.
- Check *Show features for web developers*.

**Next steps:**
- Connect your iOS device to the Mac via USB cable.
- Open Mini App inside iOS Telegram client.
- In Safari on macOS, go to *Develop* in the menu bar.
- Select the connected iPhone.
- (Optional) select *Connect via network* and disconnect the cable.
- Under the *Telegram* block, select the opened WebView URL.

### Telegram Desktop on Windows, Linux, and macOS

- Download and launch the latest version of Telegram Desktop on **Windows**, **Linux** or **macOS** (5.0.1 at the time of writing)
- Go to *Settings > Advanced > Experimental settings > Enable webview inspection*.
- on Windows and Linux, right-click in the WebView and choose *Inspect*.
- On macOS, you need to access the Inspect through [Safari Developer menu](https://support.apple.com/en-gb/guide/safari/sfri20948/mac) as Inspect is not available via right-click.

### Telegram macOS

- Download and launch the [beta version](https://telegram.org/dl/macos/beta) of Telegram macOS.
- Quickly click the Settings icon five times to open the debug menu and enable **Debug Mini Apps**.

Right-click inside the Mini App and choose *Inspect Element*.

## Testing with Eruda

[Eruda](https://github.com/liriliri/eruda) is a tool that provides a web-based console for debugging and inspecting web pages on mobile devices and desktop browsers.

![1](/img/docs/telegram-apps/eruda-1.png)

### Step 1: include Eruda library

To begin, add the Eruda library to your HTML file:

**Option 1:** use a CDN (recommended).

```html
<!-- Include Eruda from CDN (Recommended) -->
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
```

**Option 2:** install via npm.

```bash npm2yarn
npm install eruda --save
```

### Step 2: initialise Eruda

If using the CDN, initialize Eruda when the page loads:

```html
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
<script>
  // Initialize Eruda
  eruda.init();
</script>

```

If you prefer modern tooling and packages, add this script to your project:

```jsx
import eruda from 'eruda'

eruda.init()
```

### Step 3: launch Eruda

After deploying your Mini App:

- Open it in Telegram.
- Press the Eruda icon to start debugging.

<ConceptImage style={{maxWidth:'200pt', margin: '10pt 20pt 0 0', display: 'flex-box'}} src="/img/docs/telegram-apps/eruda-2.png" />
<ConceptImage style={{maxWidth:'200pt', margin: '10pt 20pt', display: 'flex-box'}}  src="/img/docs/telegram-apps/eruda-3.png" />


<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tma/guidelines/tips-and-tricks.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/guidelines/tips-and-tricks.mdx
================================================
import Feedback from '@site/src/components/Feedback';


# Tips and tricks


On this page, you'll find a list of frequently asked questions about issues in TMA.

### How to solve the cache overflow issue in TMA?

:::tip
Reinstalling the Telegram application is the only effective solution.
:::


### Are there any recommendations on caching headers for HTML files?

:::tip
It’s best to disable caching in HTML files. To ensure caching is turned off, specify the following headers in your request:

```curl
Cache-Control: no-store, must-revalidate
Pragma: no-cache
Expires: 0
```
:::


### What is suggested IDE for development TMA?

Developing in Google Chrome is more convenient due to its familiar developer tools.

To retrieve the mini-app's launch parameters and open this link in Chrome, use the web version of Telegram: [https://web.telegram.org/](https://web.telegram.org/)



### Closing behavior


In many web applications, users may accidentally close the app while scrolling to the top. This can happen if they drag a section of the app too far, inadvertently triggering its closure.


<p align="center">
    <br />
    <img width="240" src="/img/docs/telegram-apps/closing-behaviour.svg" alt="closing_behaviour_durgerking" />
    <br />
</p>


To prevent accidental closures, enable `closing_behavior` in TMA. This method adds a confirmation dialog, where the user can either approve or decline closing of the Web App.



```typescript
window.Telegram.WebApp.enableClosingConfirmation()
```


## How to specify a description for a certain language in the TMA?

:::tip
Use the following methods to configure descriptions in different languages:

* https://core.telegram.org/bots/api#setmydescription
* https://core.telegram.org/bots/api#setmyshortdescription

:::

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tma/notcoin.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/notcoin.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Notcoin

## Links

- [Notcoin telegram mini app](https://t.me/notcoin_bot/click)
- [GitHub teams](https://github.com/OpenBuilders)
- [Notcoin clicker frontend](https://github.com/OpenBuilders/notcoin-clicker)
- [Notcoin smart-contract](https://github.com/OpenBuilders/notcoin-contract)

## Project description

Notcoin was created by the Open Builders team, the independent developers from the TON community. It is a pioneering digital asset that has quickly captured the attention of the online community, reaching an impressive milestone of 4 million players. Unlike traditional cryptocurrencies, Notcoin is designed with a unique approach that combines elements of gamification, social interaction, and digital scarcity to create an engaging user experience. This innovation not only challenges conventional wisdom about digital currencies but also demonstrates the potential for viral growth in digital assets.

### Key features

- **Gamification**: Notcoin integrates game-like elements into its ecosystem, encouraging user engagement and participation through challenges, achievements, and rewards. This approach significantly differs from the typical transaction-based model of other cryptocurrencies, making it more accessible and enjoyable for a broader audience.
- **Social dynamics**: The platform leverages social networks and community-building as a core part of its strategy. Users are motivated to invite friends and participate in community events, fostering a sense of belonging and significantly contributing to its viral spread.
- **Digital scarcity and rewards**: Notcoin employs a mechanism of digital scarcity, ensuring that the asset remains valuable and sought after. This is coupled with a rewards system that incentivizes active participation and contribution to the community.
- **Innovative technology**: The underlying technology of Notcoin is designed for scalability, security, and ease of use. This ensures that as the platform grows, it remains efficient and accessible to users worldwide.
- **Environmental considerations**: Notcoin takes a conscious approach to its environmental impact, utilizing energy-efficient methods in its operation and promoting sustainable practices within its community.

### Summary

Notcoin’s rise to 4 million players is a testament to its innovative approach to digital assets. By combining gamification, social dynamics, digital scarcity, and cutting-edge technology, Notcoin has established a new paradigm in the cryptocurrency world. Its focus on community and environmental sustainability further sets it apart, making it not just a digital currency but a movement towards a more engaging and responsible digital economy. The platform’s success signals a growing interest in alternative digital currencies and the potential for viral growth in the sector, challenging traditional notions of value and community in the digital age.

## Front-end

The project presents a very simple functionality. The Notcoin component is an interactive button that reacts to user touches with animations and dynamic updates. This component can be used in various interactive applications (games) where animation and feedback on user actions are needed.

## Smart contract

### Notcoin jetton

The Notcoin jetton is forked from https://github.com/ton-blockchain/stablecoin-contract but with the governance functionality removed.

### Details

Notcoin represents a standard TON jetton smart contract with additional functionality:
- The admin of the jetton can change the jetton-minter code and its full data.

:::warning
It is critically important for the issuer to carefully manage the admin's account private key to avoid any potential risks of being hacked. It is highly recommended to use a multi-signature wallet as the admin account, with private keys stored on different air-gapped hosts/hardware wallets.
:::

:::warning
The contract does not check the code and data on upgrade messages, so it is possible to brick the contract if you send invalid data or code. Therefore, always check the upgrade in the testnet before applying it on the main network.
:::

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tma/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/overview.mdx
================================================
---
description: Telegram Mini Apps (or TMAs) are web applications that run inside the Telegram messenger. They are built using web technologies — HTML, CSS, and JavaScript.
---

import Feedback from "@site/src/components/Feedback";
import Button from "@site/src/components/button";

# What are Mini Apps?

<div style={{width: '100%', textAlign:'center', margin: '10pt auto'}}>
  <video style={{width: '100%',maxWidth: '600px', borderRadius: '10pt'}} muted={true} autoPlay={true} loop={true}>
    <source src="/files/twa.mp4" type="video/mp4" />

    Your browser does not support the video tag.

  </video>
</div>

Telegram Mini Apps (or TMAs) are web applications that run inside the Telegram messenger. They are built using web technologies — HTML, CSS, and JavaScript.

:::tip
Since TMAs are web pages and use JavaScript, you need to choose [JS/TS-based SDK](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript).
:::

Unlock access to **Telegram’s 900 million users**. With just one click, you can offer your app or service to a massive audience.

<Button href="/v3/guidelines/dapps/tma/tutorials/step-by-step-guide" colorType={'primary'} sizeType={'sm'}>

Step-by-step guide

</Button>

<Button href="/v3/guidelines/dapps/tma/tutorials/app-examples" colorType={'secondary'} sizeType={'sm'}>

See examples

</Button>

## Overview

Telegram bots can fully replace traditional websites, offering seamless user authorization, Integrated payments with 20+ payment providers (including Google Pay & Apple Pay), tailored push notifications for engaging users, and much more.

With Mini Apps, bots gain an entirely new dimension. Developers can create highly flexible interfaces using JavaScript, the world's most widely used programming language.

Here are some key features of Telegram Mini Apps:

- **Integration within Telegram**: Telegram Mini Apps are designed to blend smoothly into Telegram, providing a native-like user experience. Users can access them from chats, groups, or inline bot interactions.
- **Enhanced Functionality**: TMAs go beyond messaging—they can power games, content-sharing apps, productivity tools, financial services, and more.
- **Cross-Platform Compatibility**: Since TMAs are web-based, they work seamlessly across Android, iOS, Windows, Mac, and Linux—no extra installations required.
- **Bot Interaction**: Many TMAs use Telegram bots for interactive, automated experiences, allowing users to receive real-time responses and dynamic content.
- **Development Frameworks**: Developers can build TMAs with HTML, CSS, and JavaScript, leveraging Telegram’s APIs to create feature-rich applications.
- **Monetization Opportunities**: TMAs can be monetized through in-app purchases, subscriptions, and ads, making them an attractive option for developers and businesses.
- **Web3 Ready**: TMAs support TON SDK, TON Connect, and token-based transactions, allowing seamless integration with blockchain-powered applications.
- **Community Development**: Telegram has a strong developer ecosystem, where third-party developers actively create and share TMAs, fostering innovation and diversity.

Telegram Mini Apps enhance the Telegram experience by bringing powerful new functionalities, while giving developers an opportunity to create, distribute, and monetize their apps within the Telegram ecosystem.

## Getting started

### TMA documentation

- [Telegram Mini Apps documentation](https://docs.telegram-mini-apps.com) — a community-driven documentation for TWA.
- [TMA documentation by Telegram](https://core.telegram.org/bots/webapps) — a full description on the Telegram website.

### Telegram developers community

Join a special Telegram developers chat to discuss Mini Apps development and get support:

<Button href="https://t.me/+1mQMqTopB1FkNjIy" colorType={'primary'} sizeType={'sm'}>

Join chat

</Button>

### Mini Apps SDKs

- [twa-dev/sdk](https://github.com/twa-dev/sdk) — NPM package for TMA SDK.
- [twa-dev/boilerplate](https://github.com/twa-dev/Boilerplate) — Another boilerplate for a new TWA.
- [twa-dev/Mark42](https://github.com/twa-dev/Mark42) — Mark42 is a simple lightweight tree-shakable UI library for TWA.
- [ton-defi-org/tonstarter-twa](https://github.com/ton-defi-org/tonstarter-twa) — Template for new TWA interaction with TON.

## Integrate with TON Connect

Connect with users wallets with the help of the TON Connect protocol. Read more about it here:

<Button href="/v3/guidelines/ton-connect/overview" colorType={'primary'} sizeType={'sm'}>

Discover TON Connect

</Button>

<Feedback />



================================================
FILE: docs/v3/guidelines/dapps/tma/tutorials/app-examples.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/tutorials/app-examples.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# TMA examples

Explore the examples below to learn how to create your own Telegram Mini App.

## Basic TMA example

<p align="center">
  <br />
    <img width="240" src="/img/docs/telegram-apps/tapps.png" alt="logo of telegram mini apps" />
      <br />
</p>


This example demonstrates a simple Telegram Mini App using plain JavaScript, HTML, and CSS. The goal is to provide a minimalistic starting point for creating a TMA without relying on complex build tools or advanced libraries.

- App is available at: [t.me/simple_telegram_mini_app_bot/app](https://t.me/simple_telegram_mini_app_bot/app).
- Bot menu button: [t.me/simple_telegram_mini_app_bot](https://t.me/simple_telegram_mini_app_bot).
- Deployment URL: [https://telegram-mini-apps-dev.github.io/vanilla-js-boilerplate/](https://telegram-mini-apps-dev.github.io/vanilla-js-boilerplate/).


<Button href="https://t.me/simple_telegram_mini_app_bot/app" colorType={'primary'} sizeType={'sm'}>

Open demo

</Button>


<Button href="https://github.com/Telegram-Mini-Apps-Dev/vanilla-js-boilerplate.git" colorType={'secondary'} sizeType={'sm'}>

GitHub

</Button>




### Features
- Minimalistic user interface.
- No external libraries or frameworks.
- Easy to understand and modify.

### Getting started

#### Prerequisites

A modern web browser with JavaScript enabled.

#### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/Telegram-Mini-Apps-Dev/vanilla-js-boilerplate.git
```

2. Navigate to the project directory:

```bash
cd vanilla-js-boilerplate
```

Open `index.html` in your preferred code editor or IDE.

### Usage
1. Open index.html in your preferred code editor or IDE.
2. Make any necessary modifications.
3. Create your own GitHub repository, commit, and push your updates.
4. In GitHub, navigate to Settings > Pages > Build and Deployment.
5. If GitHub Actions is enabled, your assets will deploy automatically, and you'll receive a public URL like:`https://<username>.github.io/vanilla-js-boilerplate/`.
6. Use this URL with [@BotFather](https://t.me/BotFather) to create your own Telegram Web App (TWA).

## Modern TMA example


### Introduction

Vite is a front-end build tool and development server designed to improve development speed and efficiency. This example shows how to use Vite to create a modern Telegram Mini App.

You can find the example project here [https://github.com/Telegram-Mini-Apps-Dev/vite-boilerplate](https://github.com/Telegram-Mini-Apps-Dev/vite-boilerplate) or you follow the following instructions.

### Prerequisites

To start, we will scaffold a Vite project.

With npm:


```bash
$ npm create vite@latest
```

With yarn:

```bash
$ yarn create vite
```

Follow the on-screen prompts.

Or you can simply run this command to create a React project with TypeScript Support:

```bash
# npm 7+, extra double-dash is needed:
npm create vite my-react-telegram-web-app -- --template react-ts

# or yarn
yarn create vite my-react-telegram-web-app --template react-ts

# this will change the directory to recently created project
cd my-react-telegram-web-app
```

### Development of a Mini App

To start the development mode of the project, run the following commands in the terminal:

```bash
# npm
npm install
npm run dev --host

# or yarn
yarn
yarn dev --host
```

The `--host` option provides a URL with an IP address, which can be used for testing during development. In development mode, a self-signed SSL certificate is used. This allows testing with hot reload only in the web version of Telegram [https://web.telegram.org](https://web.telegram.org/a/#6549734463)/ due to platform restrictions on iOS, Android, and macOS.

```bash npm2yarn
npm install @vitejs/plugin-basic-ssl
```

Then change `vite.config.ts`. Add import:

```jsx
import basicSsl from '@vitejs/plugin-basic-ssl';
```

And add the plugin

```jsx
export default defineConfig({
   plugins: [react(), basicSsl()]
});
```

You can use `ngrok` to expose your local server to the internet with an SSL certificate. This enables hot module replacement on all Telegram platforms.

```bash
# where 5173 is the port number from npm/yarn dev --host
ngrok http 5173
```

Also, we are going to prepare our project for deployment:

```jsx
export default defineConfig({
   plugins: [react(), basicSsl()],
	 build: {
	   outDir: './docs'
	 },
   base: './'
});
```

We will use the deploy script for GitHub Actions that will run on pushes targeting the master branch. From the root of your project:

```bash
# we are going to create GitHub Actions config for deployment
mkdir .github
cd .github
mkdir workflows
cd workflows
touch static.yml
```

Now add this config to `static.yml`:

```yaml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['master']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: './'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          # Upload dist repository
          path: './docs'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

In GitHub repository settings, go to Settings → Pages and choose GitHub Actions for Build and Deployment. After each push to master, GitHub Pages will automatically deploy your code.
![Screenshot 2023-09-11 at 22.07.44.png](/img/docs/telegram-apps/modern-1.png)

Telegram provides an SDK via a direct [link](https://core.telegram.org/bots/webapps#initializing-web-apps), but using `@twa-dev/sdk` offers TypeScript support and better integration.


```bash npm2yarn
npm install @twa-dev/sdk
```

Open `/src/main.tsx` file and add following:

```tsx
import WebApp from '@twa-dev/sdk'

WebApp.ready();

ReactDOM.createRoot...
```

`WebApp.ready()`method informs Telegram that the Mini App is ready to display. This method should be called as early as possible to ensure all interface elements load before the app appears.

Then add some interaction with the user. Go to `src/App.tsx` and add a button that triggers an alert.

```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import WebApp from '@twa-dev/sdk'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
		{/* Here we add our button with alert callback */}
      <div className="card">
        <button onClick={() => WebApp.showAlert(`Hello World! Current count is ${count}`)}>
            Show Alert
        </button>
      </div>
    </>
  )
}

export default App
```

And now we need to create a Telegram Bot so that we can launch Telegram Mini App within the messenger application.

### Setting up a bot for the App

To launch the Telegram Mini App within the messenger, you need to create a bot and configure it. Follow these steps:

<Button href="/v3/guidelines/dapps/tma/tutorials/step-by-step-guide#setting-up-a-bot-for-the-mini-app" colorType={'primary'} sizeType={'sm'}>

Setup a bot

</Button>


### Hints

When using a self-signed SSL certificate, you may see security warnings.

**Fix:** Click **Advanced** and then **Proceed to `<local dev server address>`** to continue debugging in the web version of Telegram.

![Screenshot 2023-09-11 at 18.58.24.png](/img/docs/telegram-apps/modern-2.png)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tma/tutorials/design-guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/tutorials/design-guidelines.mdx
================================================
import Feedback from '@site/src/components/Feedback';


# TMA design guidelines

:::info
Starting with version **6.10**, Telegram updated the Mini App color palette by fixing some old colors and adding new ones.

:::

For context, let's look back at the update history.



### Changelog
1. `bg_color` and `secondary_bg_color` have been updated.

![](/img/docs/tma-design-guidelines/tma-design_1.png)


### Reasons for these changes

• These colors were originally intended for page backgrounds, not UI controls.

• To maintain consistency, they have been updated.

• `section_bg_color` was introduced to color the backgrounds of different sections and cards.

To enhance your app’s appearance, adjust how you use color variables.

The example above clearly shows what will change on iOS. There should be no changes on Android.



1. New colors.
Many new colors have been added with most being noticeable on Android. The examples focus on Android but apply to all platforms.

![](/img/docs/tma-design-guidelines/tma-design_2.png)

2. Telegram header colors has become available for Mini Apps.

![](/img/docs/tma-design-guidelines/tma-design_3.png)


3. accent_text_color is now available for highlighting accent elements in your apps. Previously, everyone used the less suitable dark link_color.

![](/img/docs/tma-design-guidelines/tma-design_4.png)

4. For all secondary cell labels, use `subtitle_text_color` to create more contrast and improve the accessibility.

![](/img/docs/tma-design-guidelines/tma-design_5.png)


5. A new token `section_header_text_color` is now available for section headers of cards.

![](/img/docs/tma-design-guidelines/tma-design_6.png)


6. For cells that trigger a destructive action, use `destructive_text_color` instead of custom color.


<p align="center">
    <br />
    <img width="360" src="/img/docs/tma-design-guidelines/tma-design_7.png" alt="" />
    <br />
</p>



7. A reasonable question arises: how should `link_color` and `hint_color` be used now?

Use `hint_color` for hint sections under different sections. For backgrounds like `secondary_bg_color`, use `link_color`.

## See also

* [Original source](https://telegra.ph/Changes-in-Color-Variables-for-Telegram-Mini-Apps-11-20)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tma/tutorials/step-by-step-guide.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tma/tutorials/step-by-step-guide.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# TMA launch tutorial

Telegram Mini Apps (TMA) are web applications that run inside the Telegram messenger. They are built using web technologies—HTML, CSS, and JavaScript. Telegram Mini Apps can be used to create dApps, games, and other types of apps that can be run inside Telegram.

## Create your Mini App

1. To connect your Mini App to Telegram, add the SDK script `telegram-web-app.js` using this code:

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```
:::tip
It's best to disable caching in the HTML. To ensure your caching is turned off, specify these headers in your request:

```curl
Cache-Control: no-store, must-revalidate
Pragma: no-cache
Expires: 0
```
:::

2. Once the script is connected, the **[window.Telegram.WebApp](https://core.telegram.org/bots/webapps#initializing-web-apps)** object becomes available. Learn more about creating Mini App using [`telegram-web-app.js`](/v3/guidelines/dapps/tma/tutorials/app-examples#basic-tma-example) here.

3. You can also connect the SDK using the NPM package for Telegram Mini Apps SDK:

```bash npm2yarn
npm i @twa-dev/sdk
```

Find a guide for `@twa-dev/sdk` [here](/v3/guidelines/dapps/tma/tutorials/app-examples#modern-tma-example).

4. Once your Mini App is ready and deployed to a web server, move on to the next step.

## Setting up a bot for the Mini App

To connect your Mini App to Telegram, you need to create a bot and set up a Mini App for it. Follow these steps:

### 1. Start a chat with BotFather

- Open the Telegram app or web version.
- Search for `@BotFather` in the search bar or click this link [https://t.me/BotFather](https://t.me/BotFather).
- Start a chat with BotFather by clicking `START`.

### 2. Create a new bot

- Send the `/newbot` command to BotFather.
- Choose a display name for your bot. It can include spaces.
- Choose a unique username for your bot that ends with `bot`, such as `sample_bot`.

### 3. Set up the bot Mini App

- Send the `/mybots` command to [@BotFather](https://t.me/BotFather).
- Select your bot from the list and choose **Bot settings**.
- Select **Menu button**.
- Choose **Edit menu button URL** and send URL to your Telegram Mini App (e.g., a link from GitHub Pages deployment).

### 4. Access the bot

- Search for your bot using its username in Telegram's search bar.
- Click the button next to attach picker to launch your Telegram Mini App in messenger.
- You’re awesome!

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tutorials/jetton-airdrop.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tutorials/jetton-airdrop.md
================================================
import Feedback from '@site/src/components/Feedback';

import Player from '@site/src/components/player'

# How to launch a jetton airdrop

## Overview

This article describes ready-to-use methods for mass token distribution on the TON Blockchain.

## TONAPI Airdrop

<Player url="https://www.youtube.com/watch?v=8HHXykOyNys" />

- [Tool](https://tonapi.io/airdrop?utm_source=web&utm_medium=tondocs&utm_campaign=tondocs_1)

- [Documentation](https://docs.tonconsole.com/tonconsole/jettons/airdrop)

### About the instrument

- Throughput: up to 10 million claims.
- Optimized for the TON blockchain.
- Earn per claim – the organizer sets the price.
- Developed by the Tonkeeper team. Check out other products:
    - Non-custodial wallet [Tonkeeper](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper);
    - [TON Connect](/v3/guidelines/ton-connect/overview);
    - [Tonviewer](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton#tonviewer);
    - [TON API](https://tonapi.io/).

### Example of organizing an airdrop

1. Collect a list of eligible user wallet addresses within your DApp;
2. Enter the airdrop details in TONAPI Airdrop: token address, claim fee;
3. Upload the wallet list;
4. Enable claims.

On the client side of the DApp, implement a request to our API (details in the [documentation](https://docs.tonconsole.com/tonconsole/jettons/airdrop#api-for-dapp-interaction)). If a positive response is received, the user will be prompted to claim the token.

## See also

[Learn more about TON API](https://tonapi.io?utm_source=web&utm_medium=tondocs&utm_campaign=tondocs_2)
<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tutorials/mint-your-first-token.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tutorials/mint-your-first-token.md
================================================
import Feedback from '@site/src/components/Feedback';

# Mint your first jetton

Welcome, dev! It's great to have you here. 👋

You'll learn how to create your first token on TON using TON Minter.
To mint a token, we will use the [TON Minter](https://minter.ton.org/).

## 📖 What you'll learn

By the end of this tutorial, you'll be able to:

- deploy a token using TON Minter
- customize your token
- manage and use the token
- edit token parameters


## 📌 Prepare before you start
Before you start, make sure you have the following:

1. A [Tonhub](https://ton.app/wallets/tonhub-wallet) / [Tonkeeper](https://ton.app/wallets/tonkeeper) wallet or any other TON-compatible wallet.
At least 0.25 Toncoin in your wallet (plus extra for blockchain fees)

:::tip Starter tip
 ~0.5 TON should be enough for this tutorial.
:::
 

## 🚀 Let's get started!

Use your web browser to open the service [TON Minter](https://minter.ton.org/) / [TON Minter testnet](https://minter.ton.org/?testnet=true).

![image](/img/tutorials/jetton/jetton-main-page.png)

### Deploy a jetton using your browser

#### Connect wallet

Open [TON Minter](https://minter.ton.org/) or [TON Minter testnet](https://minter.ton.org/?testnet=true) in your web browser. Click "Connect Wallet" and link your Tonhub or another supported wallet.

#### ![image](/img/tutorials/jetton/jetton-connect-wallet.png)

**Scan the QR-code** in a [Mobile wallet (Tonhub e.g.)](https://ton.app/wallets/tonhub-wallet)

#### Fill in the blanks with relevant information

1. Name (usually 1-3 words).
2. Symbol (usually 3-5 uppercase characters).
3. Amount (for example, 1,000,000).
4. Description of the token (optional).

#### Token logo URL (optional)

![image](/img/tutorials/jetton/jetton-token-logo.png)

If you want your token to stand out, you’ll need to host an attractive logo online.

* https://bitcoincash-example.github.io/website/logo.png

:::info
 You can easily find out about the URL placement of the logo in the [repository](https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices) in the 'Where is this metadata stored' paragraph.

 * On-chain.
 * Off-chain IPFS.
 * Off-chain website.
:::

#### How to create your logo URL?

 1. Prepare a **256x256** PNG image of the token logo with a transparent background.
 2. Host it online using, for example, [GitHub Pages](https://pages.github.com/).
 3. [Create a new public repository](https://docs.github.com/en/get-started/quickstart/create-a-repo) with the name `website`.
 4. Upload your prepared image to git and enable `GitHub Pages`.
    1. [Add GitHub Pages to your repository](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
    2. [Upload your image and get a link](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).
 5. If possible, purchase a custom domain for your project. Use any domain seller like [Google Domains](https://domains.google/) or [GoDaddy](https://www.godaddy.com/). Then, connect your custom domain to the repository in the previous step, you can follow the instructions [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
 6. If you have a custom domain, your image URL should be `https://bitcoincash.org/logo.png` instead of the `github.io` one. This prevents dependency on GitHub and gives you full control over hosting.


 ## 💸 Send jettons
On the right side of the screen, you can **send tokens** to multi-currency wallets such as [Tonkeeper](https://tonkeeper.com/) or [Tonhub](https://ton.app/wallets/tonhub-wallet).

![image](/img/tutorials/jetton/jetton-send-tokens.png)

:::info
 You also can **burn** your tokens to reduce their amount.
 
 ![image](/img/tutorials/jetton/jetton-burn-tokens.png)
:::

 ### 📱 Send tokens from your phone using Tonkeeper

Prerequisites:

1. You must have Jettons in your wallet.
2. You need at least 0.1 Toncoin to cover transaction fees.

#### Step-by-step guide

Then, go to **your token**, set the **amount** to send, and enter the **recipient address.**

![image](/img/tutorials/jetton/jetton-send-tutorial.png)


 ## 📚 Using the token on the site

You can manage your token by entering its address in the **search bar** at the top of the TON Minter site.
 
:::info
 The address can be found on the right side if you are already in the owner panel, or you can find the token address when receiving an airdrop.

 ![image](/img/tutorials/jetton/jetton-wallet-address.png)
:::


 ## ✏️ Jetton (token) customization

With the [FunC](/v3/documentation/smart-contracts/func/overview) language, you can change a token's behavior in your favor.

To make any changes, start here:

* https://github.com/ton-blockchain/minter-contract

### Step-by-step guide for developers

 1. Ensure you have all dependencies from the [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts) repository.
 2. Clone the [minter-contract repository](https://github.com/ton-blockchain/minter-contract) and rename the project. 
 3. To install, open a terminal at the root and run:

 ```bash npm2yarn
 npm install
 ```

 4. Edit the smart contract files. All contract files are in `contracts/*.fc`

 5. Build a project by using: 

 ```bash npm2yarn
 npm run build
 ```
 The result will describe the process of creating the necessary files and the search for smart contracts. 
 
 :::info
 Read the console, there are a lot of tips!
 :::
    
 6. You can test your changes using:

 ```bash npm2yarn
 npm run test
 ```

 7. Edit the **name** and other metadata of the token in `build/jetton-minter.deploy.ts` by changing the JettonParams object.

 ```js
// This is example data - Modify these parameters for your jetton!
// - Data is stored on-chain (except for the image data itself)
// - Owner should usually be the deploying wallet's address.
   
 const jettonParams = {
  owner: Address.parse("EQD4gS-Nj2Gjr2FYtg-s3fXUvjzKbzHGZ5_1Xe_V0-GCp0p2"),
  name: "MyJetton",
  symbol: "JET1",
  image: "https://www.linkpicture.com/q/download_183.png", // Image URL
  description: "My jetton",
};
 ```

 8. To deploy a token, use the following command:

 ```bash npm2yarn
 npm run deploy
 ```
 The result of running your project:

    ```js
    > @ton-defi.org/jetton-deployer-contracts@0.0.2 deploy
    > ts-node ./build/_deploy.ts

    =================================================================
    Deploy script running, let's find some contracts to deploy..

    * We are working with 'mainnet'

    * Config file '.env' found and will be used for deployment!
     - Wallet address used to deploy from is: YOUR-ADDRESS
     - Wallet balance is YOUR-BALANCE TON, which will be used for gas

    * Found root contract 'build/jetton-minter.deploy.ts - let's deploy it':
     - Based on your init code+data, your new contract address is: YOUR-ADDRESS
     - Let's deploy the contract on-chain.
     - Deploy transaction sent successfully
     - Block explorer link: https://tonwhales.com/explorer/address/YOUR-ADDRESS
     - Waiting up to 20 seconds to check if the contract was actually deployed.
     - SUCCESS! Contract deployed successfully to address: YOUR-ADDRESS
     - New contract balance is now YOUR-BALANCE TON, make sure it has enough to pay rent
     - Running a post deployment test:
    {
      name: 'MyJetton',
      description: 'My jetton',
      image: 'https://www.linkpicture.com/q/download_183.png',
      symbol: 'JET1'
    }
    ```


## What's next?

If you want to dive deeper, read this article by Tal Kol:  
* [How and why to shard your smart contract—studying the anatomy of TON Jettons](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)

If you want to learn more about other token-minting solutions, read this article:
* [History of mass minting on TON](https://blog.ton.org/history-of-mass-minting-on-ton)


## References

 - Project: https://github.com/ton-blockchain/minter-contract
 - [Jetton processing](/v3/guidelines/dapps/asset-processing/jettons)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tutorials/nft-minting-guide.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tutorials/nft-minting-guide.md
================================================
import Feedback from '@site/src/components/Feedback';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

# Step by step NFT collection minting 

## 👋 Introduction
Non-fungible tokens (NFTs) have become one of the hottest topics in the world of digital art and collectibles. NFTs are unique digital assets that use blockchain technology to verify ownership and authenticity. They have opened new possibilities for creators and collectors to monetize and trade digital art, music, videos, and other forms of digital content. In recent years, the NFT market has exploded, with some high-profile sales reaching millions of dollars. In this article, we will build an NFT collection on TON step by step.

**This is the beautiful collection of ducks you will create by the end of this tutorial:**

![](/img/tutorials/nft/collection.png)


## 🦄 What you will learn
1. You will mint an NFT collection on TON.
2. You will understand how NFTs on TON work.
3. You will put an NFT on sale.
4. You will upload metadata to [pinata.cloud](https://pinata.cloud).

## 💡 Prerequisites
You must already have a testnet wallet with at least 2 TON. You can get testnet coins from [@testgiver_ton_bot](https://t.me/testgiver_ton_bot).

:::info How to use the testnet on my Tonkeeper wallet?  
1. Open Wallets list.
2. Create a new Testnet wallet: Add wallet → Add Testnet Account.
:::

We will use Pinata as our IPFS storage system, so you also need to create an account on [pinata.cloud](https://pinata.cloud) and get api_key and api_secret. The official Pinata [documentation](https://docs.pinata.cloud/account-management/api-keys) can help with that. Once you have these API tokens, I’ll be waiting for you here!

## 💎 What is an NFT on TON?

Before starting the main part of our tutorial, we need to understand how NFTs work on TON. Unexpectedly, we will first explain of how NFTs work on Ethereum (ETH), to highlight the uniqueness of NFT implementation on TON compared to other blockchains.

### NFT implementation on ETH 

The implementation of the NFT in ETH is extremely simple. There is 1 main contract for the collection, which stores a simple hashmap containing the NFT data for that collection. All requests related to this collection (such as transferring an NFT, putting it up for sale, etc.) are sent directly to the single contract.

![](/img/tutorials/nft/eth-collection.png)

### Problems with such implementation on TON

The [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) in TON describes the issues of using this model:

* Unpredictable gas consumption. In TON, gas consumption for dictionary operations depends on exact set of keys. TON is an asynchronous blockchain, meaning you cannot predict how many messages from other users will reach a smart contract before yours. This uncertainty makes it difficult to determine gas costs, especially in smart contract chains like wallet → NFT smart contract → auction → NFT smart contract. If gas costs cannot be predicted, issues may arise where ownership of the NFT smart contract changes, but there are not enough Toncoins for the auction operation. Using smart contracts without dictionaries allows for deterministic gas consumption.

* Scalability issues (becomes a bottleneck). TON scales through sharding, which partitions the network into shardchains under load. A single, large smart contract for a popular NFT contradicts this concept because many transactions would refer to one contract, creating a bottleneck. Although TON supports sharded smart contracts (see the whitepaper), they are not yet implemented.


**TL;DR**
The ETH solution is not scalable and is unsuitable for an asynchronous blockchain like TON.

### TON NFT implementation

On TON, there is one master contract—the collection’s smart contract—which stores its metadata, the owner's address, and, most importantly, the logic for minting new NFTs. To create ("mint") a new NFT, you simply send a message to the collection contract. This contract then deploys a new NFT item contract using the data you provide.

![](/img/tutorials/nft/ton-collection.png)

:::info
You can check out the article on [NFT processing on TON](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) or read the [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) for a deeper understanding.
:::

## ⚙ Setup development environment
Let's start by creating an empty project:

1. Create a new folder

```bash
mkdir MintyTON
```

2. Open this folder

```bash
cd MintyTON
```

3. Initialize the project

```bash
yarn init -y
```

4. Install TypeScript

```bash
yarn add typescript @types/node -D
```

5. Initialize the TypeScript project

```bash
tsc --init
```

6. Copy this configuration into tsconfig.json

```json
{
    "compilerOptions": {
      "module": "commonjs",
      "target": "es6",
      "lib": ["ES2022"],
      "moduleResolution": "node",
      "sourceMap": true,
      "outDir": "dist",
      "baseUrl": "src",
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "strict": true,
      "esModuleInterop": true,
      "strictPropertyInitialization": false
    },
    "include": ["src/**/*"]
}
```

7. Add a script to build & start the app in `package.json`

```json
"scripts": {
    "start": "tsc --skipLibCheck && node dist/app.js"
  },
```

8. Install required libraries

```bash
yarn add @pinata/sdk dotenv @ton/ton @ton/crypto @ton/core buffer
```

9. Create a `.env` file and add your own data based on this template
```
PINATA_API_KEY=your_api_key
PINATA_API_SECRET=your_secret_api_key
MNEMONIC=word1 word2 word3 word4
TONCENTER_API_KEY=aslfjaskdfjasasfas
```
You can get a TON Center API key from [@tonapibot](https://t.me/tonapibot) and choose mainnet or testnet. Store the 24-word seed phrase of the collection owner’s wallet in the MNEMONIC variable.

Great! Now we are ready to start writing code for our project.

### Write helper functions

First, let's create the `openWallet` function in `src/utils.ts`. This function will open our wallet using a mnemonic and return its  publicKey/secretKey. 

We get a pair of keys based on 24 words (a seed phrase):
```ts
import { KeyPair, mnemonicToPrivateKey } from "@ton/crypto";
import { beginCell, Cell, OpenedContract} from "@ton/core";
import { TonClient, WalletContractV4 } from "@ton/ton";

export type OpenedWallet = {
  contract: OpenedContract<WalletContractV4>;
  keyPair: KeyPair;
};

export async function openWallet(mnemonic: string[], testnet: boolean) {
  const keyPair = await mnemonicToPrivateKey(mnemonic);
```

Create a class instance to interact with toncenter:
```ts
  const toncenterBaseEndpoint: string = testnet
    ? "https://testnet.toncenter.com"
    : "https://toncenter.com";

  const client = new TonClient({
    endpoint: `${toncenterBaseEndpoint}/api/v2/jsonRPC`,
    apiKey: process.env.TONCENTER_API_KEY,
  });
```  

Finally, open our wallet:
```ts
  const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });

  const contract = client.open(wallet);
  return { contract, keyPair };
}
```

Nice! After that, we'll create the main entry point for our project—`src/app.ts`. 
Here, we will use the newly created `openWallet` function and call our main function, `init`.
Thats enough for now.
```ts
import * as dotenv from "dotenv";

import { openWallet } from "./utils";
import { readdir } from "fs/promises";

dotenv.config();

async function init() {
  const wallet = await openWallet(process.env.MNEMONIC!.split(" "), true);  
}

void init();
```

Next, let's create a `delay.ts` file in the `src` directory, which will contain a function that waits until `seqno` increases. 
```ts
import { OpenedWallet } from "./utils";

export async function waitSeqno(seqno: number, wallet: OpenedWallet) {
  for (let attempt = 0; attempt < 10; attempt++) {
    await sleep(2000);
    const seqnoAfter = await wallet.contract.getSeqno();
    if (seqnoAfter == seqno + 1) break;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

:::info What is it - seqno?
Simply put, seqno is a counter that tracks outgoing transactions from a wallet. It helps prevent Replay Attacks. hen a transaction is sent to a wallet smart contract, it compares the seqno field in the transaction with the one stored in the wallet. If they match, the transaction is accepted, and the stored seqno increments by one. If they don't match, the transaction is discarded. This is why we need to wait a bit after every outgoing transaction.
:::


## 🖼 Prepare metadata

Metadata is simple information that describes an NFT or an NFT collection (e.g., name, description, etc.).

First, we need to store NFT images in /data/images/ and name them `0.png`, `1.png`, ... for photos, and `logo.png` for avatars of our collection. You can either [download pack](/img/tutorials/nft/ducks.zip) of ducks images or use your own images. Store metadata files in `/data/metadata/`. 

### NFT specifications

Most projects on TON follow these metadata specifications for NFT collections:


Name | Explanation 
---|---
name | Collection name
description |	Collection description
image | Link to the avatar image. Supported formats: https, ipfs, TON Storage.
cover_image	| Link to the collection cover image.
social_links | List of up to 10 links to the project's social media profiles.

![image](/img/tutorials/nft/collection-metadata.png)

Based on this, let's create our own metadata file, `collection.json`, to describe the NFT collection!
```json
{
  "name": "Ducks on TON",
  "description": "This collection is created for showing an example of minting NFT collection on TON. You can support creator by buying one of this NFT.",
  "social_links": ["https://t.me/DucksOnTON"]
}
```
Note: We’re not adding the "image" parameter just yet—you’ll see why later!

Once done, you can create as many NFT metadata files as you like.

Each NFT item follows these metadata specifications:

Name | Explanation 
---|---
name | NFT name. Recommended length: 15-30 characters
description | NFT description. Recommended length: Up to 500 characters
image | Link to the NFT image. 
attributes | List of NFT attributes, where a trait_type (attribute name) and value (a short description) are specified.
lottie | Link to a JSON file with Lottie animation (if specified, the animation will play on the NFT’s page).
content_url	| Link to additional content.
content_type | Type of content from the content_url link (e.g., video/mp4).

![image](/img/tutorials/nft/item-metadata.png)


```json
{
  "name": "Duck #00",
  "description": "What about a round of golf?",
  "attributes": [{ "trait_type": "Awesomeness", "value": "Super cool" }]
}
```

After that, you can create as many files of an NFT item with their metadata as you want.

### Upload metadata

Now let's write some code, that will upload our metadata files to IPFS. Create a `metadata.ts` file in `src` directory and add all needed imports:
```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";
```

After that, we need to create a function that will actually upload all files from our folder to IPFS:
```ts
export async function uploadFolderToIPFS(folderPath: string): Promise<string> {
  const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
  });

  const response = await pinata.pinFromFS(folderPath);
  return response.IpfsHash;
}
```

Great! Back to the question at hand: why did we leave the "image" field in the metadata files empty? Imagine a situation where you want to create 1000 NFTs in your collection and, accordingly, you have to manually go through each item and manually insert a link to your image. This is really inconvenient and wrong, so let's write a function that will do this automatically!

```ts
export async function updateMetadataFiles(metadataFolderPath: string, imagesIpfsHash: string): Promise<void> {
  const files = readdirSync(metadataFolderPath);

  await Promise.all(files.map(async (filename, index) => {
    const filePath = path.join(metadataFolderPath, filename)
    const file = await readFile(filePath);
    
    const metadata = JSON.parse(file.toString());
    metadata.image =
      index != files.length - 1
        ? `ipfs://${imagesIpfsHash}/${index}.jpg`
        : `ipfs://${imagesIpfsHash}/logo.jpg`;
    
    await writeFile(filePath, JSON.stringify(metadata));
  }));
}
```
Here we first read all of the files in the specified folder:
```ts
const files = readdirSync(metadataFolderPath);
```

Iterate over each file and get its content
```ts
const filePath = path.join(metadataFolderPath, filename)
const file = await readFile(filePath);

const metadata = JSON.parse(file.toString());
```

After that, we assign the value `ipfs://{IpfsHash}/{index}.jpg` to the image field. If this file is mnot the last one in the folder, assign `ipfs://{imagesIpfsHash}/logo.jpg` and rewrite the file with new data.

Full code of metadata.ts:
```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function uploadFolderToIPFS(folderPath: string): Promise<string> {
  const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
  });

  const response = await pinata.pinFromFS(folderPath);
  return response.IpfsHash;
}

export async function updateMetadataFiles(metadataFolderPath: string, imagesIpfsHash: string): Promise<void> {
  const files = readdirSync(metadataFolderPath);

  files.forEach(async (filename, index) => {
    const filePath = path.join(metadataFolderPath, filename)
    const file = await readFile(filePath);
    
    const metadata = JSON.parse(file.toString());
    metadata.image =
      index != files.length - 1
        ? `ipfs://${imagesIpfsHash}/${index}.jpg`
        : `ipfs://${imagesIpfsHash}/logo.jpg`;
    
    await writeFile(filePath, JSON.stringify(metadata));
  });
}
```

Great, let's call these methods in our app.ts file.
Add the imports of our functions:
```ts
import { updateMetadataFiles, uploadFolderToIPFS } from "./src/metadata";
```

Save the variables with the path to the metadata/images folder and call our functions to load the metadata.
```ts
async function init() {
  const metadataFolderPath = "./data/metadata/";
  const imagesFolderPath = "./data/images/";

  const wallet = await openWallet(process.env.MNEMONIC!.split(" "), true);

  console.log("Started uploading images to IPFS...");
  const imagesIpfsHash = await uploadFolderToIPFS(imagesFolderPath);
  console.log(
    `Successfully uploaded the pictures to ipfs: https://gateway.pinata.cloud/ipfs/${imagesIpfsHash}`
  );

  console.log("Started uploading metadata files to IPFS...");
  await updateMetadataFiles(metadataFolderPath, imagesIpfsHash);
  const metadataIpfsHash = await uploadFolderToIPFS(metadataFolderPath);
  console.log(
    `Successfully uploaded the metadata to ipfs: https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
  );
}
```

After that you can run `yarn start` and see the link to your deployed metadata!

### Encode offchain content

How will our metadata files stored in the smart contract be referenced? This question can be fully answered by the [Token Data Standart](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md). 
In some cases, it is not enough to simply provide the desired flag and the link as ASCII characters. That is why let's consider splitting our link into several parts using the snake format.

First, create the function in `./src/utils.ts`. The function that will convert our buffer into chunks:

```ts
function bufferToChunks(buff: Buffer, chunkSize: number) {
  const chunks: Buffer[] = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.subarray(0, chunkSize));
    buff = buff.subarray(chunkSize);
  }
  return chunks;
}
```

And create a function that will bind all the chunks into 1 snake-cell:
```ts
function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, 127);

  if (chunks.length === 0) {
    return beginCell().endCell();
  }

  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell();
  }

  let curCell = beginCell();

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];

    curCell.storeBuffer(chunk);

    if (i - 1 >= 0) {
      const nextCell = beginCell();
      nextCell.storeRef(curCell);
      curCell = nextCell;
    }
  }

  return curCell.endCell();
}
```

Finally, we need to create a function that will encode the offchain content into cells using this functions:
```ts
export function encodeOffChainContent(content: string) {
  let data = Buffer.from(content);
  const offChainPrefix = Buffer.from([0x01]);
  data = Buffer.concat([offChainPrefix, data]);
  return makeSnakeCell(data);
}
```

## 🚢 Deploy NFT collection
Once our metadata is ready and uploaded to IPFS, we can proceed with deploying our collection!

We will create a file to store all logic related to our collection in `/contracts/NftCollection.ts`. As always, we start with imports:
```ts
import {
  Address,
  Cell,
  internal,
  beginCell,
  contractAddress,
  StateInit,
  SendMode,
} from "@ton/core";
import { encodeOffChainContent, OpenedWallet } from "../utils";
```

Next, we declare a type that describes the initial data required for our collection:
```ts
export type collectionData = {
  ownerAddress: Address;
  royaltyPercent: number;
  royaltyAddress: Address;
  nextItemIndex: number;
  collectionContentUrl: string;
  commonContentUrl: string;
}
```

Name | Explanation 
---|---
ownerAddress |	The address set as the collection owner. Only the owner can mint new NFTs
royaltyPercent | 	The percentage of each sale that goes to the specified address
royaltyAddress | The wallet address that receives royalties from sales of this NFT collection
nextItemIndex | The index assigned to the next NFT item
collectionContentUrl | The URL of the collection metadata
commonContentUrl | he base URL for NFT item metadata

First, let's write a private method that returns a cell containing our collection's code.
```ts
export class NftCollection {
  private collectionData: collectionData;

  constructor(collectionData: collectionData) {
    this.collectionData = collectionData;
  }

  private createCodeCell(): Cell {
    const NftCollectionCodeBoc =
      "te6cckECFAEAAh8AART/APSkE/S88sgLAQIBYgkCAgEgBAMAJbyC32omh9IGmf6mpqGC3oahgsQCASAIBQIBIAcGAC209H2omh9IGmf6mpqGAovgngCOAD4AsAAvtdr9qJofSBpn+pqahg2IOhph+mH/SAYQAEO4tdMe1E0PpA0z/U1NQwECRfBNDUMdQw0HHIywcBzxbMyYAgLNDwoCASAMCwA9Ra8ARwIfAFd4AYyMsFWM8WUAT6AhPLaxLMzMlx+wCAIBIA4NABs+QB0yMsCEsoHy//J0IAAtAHIyz/4KM8WyXAgyMsBE/QA9ADLAMmAE59EGOASK3wAOhpgYC42Eit8H0gGADpj+mf9qJofSBpn+pqahhBCDSenKgpQF1HFBuvgoDoQQhUZYBWuEAIZGWCqALnixJ9AQpltQnlj+WfgOeLZMAgfYBwGyi544L5cMiS4ADxgRLgAXGBEuAB8YEYGYHgAkExIREAA8jhXU1DAQNEEwyFAFzxYTyz/MzMzJ7VTgXwSED/LwACwyNAH6QDBBRMhQBc8WE8s/zMzMye1UAKY1cAPUMI43gED0lm+lII4pBqQggQD6vpPywY/egQGTIaBTJbvy9AL6ANQwIlRLMPAGI7qTAqQC3gSSbCHis+YwMlBEQxPIUAXPFhPLP8zMzMntVABgNQLTP1MTu/LhklMTugH6ANQwKBA0WfAGjhIBpENDyFAFzxYTyz/MzMzJ7VSSXwXiN0CayQ==";
    return Cell.fromBase64(NftCollectionCodeBoc);
  }
}
```
In this method, we simply read the cell from the base64 representation of the collection smart contract.

Now, we need to create the cell containing our collection’s initial data. Essentially, we must store collectionData correctly. First, we create an empty cell and store the collection owner's address and the index of the next item to be minted. Let’s define the next private method:

```ts
private createDataCell(): Cell {
  const data = this.collectionData;
  const dataCell = beginCell();

  dataCell.storeAddress(data.ownerAddress);
  dataCell.storeUint(data.nextItemIndex, 64);
```

Next, we create an empty cell to store the collection’s content. We then store a reference to the encoded content cell within our main data cell.

```ts
const contentCell = beginCell();

const collectionContent = encodeOffChainContent(data.collectionContentUrl);

const commonContent = beginCell();
commonContent.storeBuffer(Buffer.from(data.commonContentUrl));

contentCell.storeRef(collectionContent);
contentCell.storeRef(commonContent.asCell());
dataCell.storeRef(contentCell);
```

After that, we create a cell containing the NFT item code and store a reference to this cell in dataCell.

```ts
const NftItemCodeCell = Cell.fromBase64(
  "te6cckECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMntVIAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAgEgCQgAET6RDBwuvLhTYALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCwoAcnCCEIt3FzUFyMv/UATPFhAkgEBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viDACCAo41JvABghDVMnbbEDdEAG1xcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wCTMDI04lUC8ANqhGIu"
);
dataCell.storeRef(NftItemCodeCell);
```

The smart contract stores royalty parameters using royaltyFactor, royaltyBase, and royaltyAddress. The royalty percentage is calculated using the formula: <InlineMath math="\left( \frac{\text{royaltyFactor}}{\text{royaltyBase}} \right) \times 100\%" />
. If we know royaltyPercent, calculating royaltyFactor is straightforward.




```ts
const royaltyBase = 1000;
const royaltyFactor = Math.floor(data.royaltyPercent * royaltyBase);
```

After performing these calculations, we store the royalty data in a separate cell and reference it in dataCell.

```ts
const royaltyCell = beginCell();
royaltyCell.storeUint(royaltyFactor, 16);
royaltyCell.storeUint(royaltyBase, 16);
royaltyCell.storeAddress(data.royaltyAddress);
dataCell.storeRef(royaltyCell);

return dataCell.endCell();
}
```


Now, let's write a getter that returns the `StateInit` of our collection.
```ts
public get stateInit(): StateInit {
  const code = this.createCodeCell();
  const data = this.createDataCell();

  return { code, data };
}
```

We also need a getter that calculates the collection’s address. In TON, a smart contract’s address is simply the hash of its `StateInit`.
```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```


The final step is writing a method to deploy the smart contract to the blockchain!
```ts
public async deploy(wallet: OpenedWallet) {
    const seqno = await wallet.contract.getSeqno();
    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.05",
          to: this.address,
          init: this.stateInit,
        }),
      ],
      sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    });
    return seqno;
  }
```
Deploying a new smart contract in our case means sending a message from our wallet to the collection address, which we can calculate if we have `StateInit`, along with its `StateInit`.
When the owner mints a new NFT, the collection accepts the owner's message and sends a new message to the created NFT smart contract, which requires a fee. Let’s write a method to replenish the collection’s balance based on the number of NFTs to be minted:
```ts
public async topUpBalance(
    wallet: OpenedWallet,
    nftAmount: number
  ): Promise<number> {
    const feeAmount = 0.026 // approximate value of fees for 1 transaction in our case 
    const seqno = await wallet.contract.getSeqno();
    const amount = nftAmount * feeAmount;

    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: amount.toString(),
          to: this.address.toString({ bounceable: false }),
          body: new Cell(),
        }),
      ],
      sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    });

    return seqno;
  }
```

Now, let’s add a few include statements to `app.ts`:

```ts
import { waitSeqno } from "./delay";
import { NftCollection } from "./contracts/NftCollection";
```

Finally, we add a few lines to the end of the `init()` function to deploy the new collection:

```ts
console.log("Start deploy of nft collection...");
const collectionData = {
  ownerAddress: wallet.contract.address,
  royaltyPercent: 0.05, // 0.05 = 5%
  royaltyAddress: wallet.contract.address,
  nextItemIndex: 0,
  collectionContentUrl: `ipfs://${metadataIpfsHash}/collection.json`,
  commonContentUrl: `ipfs://${metadataIpfsHash}/`,
};
const collection = new NftCollection(collectionData);
let seqno = await collection.deploy(wallet);
console.log(`Collection deployed: ${collection.address}`);
await waitSeqno(seqno, wallet);
```


## 🚢 Deploy NFT items
Once our collection is ready, we can start minting our NFTs! We will store the code in `src/contracts/NftItem.ts`

Unexpectedly, we need to return to `NftCollection.ts `and add the following type near `collectionData` at the top of the file.

```ts
export type mintParams = {
  queryId: number | null,
  itemOwnerAddress: Address,
  itemIndex: number,
  amount: bigint,
  commonContentUrl: string
}
```
Name | Explanation 
---|---
itemOwnerAddress |	The address set as the item's owner
itemIndex | The index of the NFT item
amount | The amount of TON sent to the NFT upon deployment
commonContentUrl | The full link to the item URL, which is "commonContentUrl" of the collection + this commonContentUrl


Next, we create a method in the NftCollection class to construct the body for deploying an NFT item. First, we store a bit to indicate to the collection smart contract that we want to create a new NFT. Then, we store the queryId and the index of the NFT item.

```ts
public createMintBody(params: mintParams): Cell {
    const body = beginCell();
    body.storeUint(1, 32);
    body.storeUint(params.queryId || 0, 64);
    body.storeUint(params.itemIndex, 64);
    body.storeCoins(params.amount);
```

After that, we create an empty cell and store the owner's address:
```ts
    const nftItemContent = beginCell();
    nftItemContent.storeAddress(params.itemOwnerAddress);
```

We store a reference in this cell (containing the NFT item content) to the item's metadata.
```ts
    const uriContent = beginCell();
    uriContent.storeBuffer(Buffer.from(params.commonContentUrl));
    nftItemContent.storeRef(uriContent.endCell());
```

We store a reference to the cell with the item content in our body cell.
```ts
    body.storeRef(nftItemContent.endCell());
    return body.endCell();
}
```
Now, we return to `NftItem.ts`. The only step left is to send a message to our collection contract with the body of our NFT.

```ts
import { internal, SendMode, Address, beginCell, Cell, toNano } from "@ton/core";
import { OpenedWallet } from "utils";
import { NftCollection, mintParams } from "./NftCollection";
import { TonClient } from "@ton/ton";

export class NftItem {
  private collection: NftCollection;

  constructor(collection: NftCollection) {
    this.collection = collection;
  }

  public async deploy(
    wallet: OpenedWallet,
    params: mintParams
  ): Promise<number> {
    const seqno = await wallet.contract.getSeqno();
    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.05",
          to: this.collection.address,
          body: this.collection.createMintBody(params),
        }),
      ],
      sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
    });
    return seqno;
  }
}
```

At the end, we write a short method to retrieve an NFT’s address by its index:

Create a client variable to call the collection’s get-method.

```ts
static async getAddressByIndex(
  collectionAddress: Address,
  itemIndex: number
): Promise<Address> {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: process.env.TONCENTER_API_KEY,
  });
```

Call the get-method to return the NFT address based on its index.
```ts
  const response = await client.runMethod(
    collectionAddress,
    "get_nft_address_by_index",
    [{ type: "int", value: BigInt(itemIndex) }]
  );
```

Parse the returned address.
```ts
    return response.stack.readAddress();
}
```

Now, let's add some code to `app.ts` to automate the NFT minting process:


```ts
  import { NftItem } from "./contracts/NftItem";
  import { toNano } from '@ton/core';
```

First, read all files in the metadata folder.

```ts
const files = await readdir(metadataFolderPath);
files.pop();
let index = 0;
```

Next, top up the collection’s balance.
```ts
seqno = await collection.topUpBalance(wallet, files.length);
await waitSeqno(seqno, wallet);
console.log(`Balance top-upped`);
```
Finally, iterate through each metadata file, create an `NftItem` instance, and call the deploy method. After that, wait until the seqno increases.

```ts
for (const file of files) {
    console.log(`Start deploy of ${index + 1} NFT`);
    const mintParams = {
      queryId: 0,
      itemOwnerAddress: wallet.contract.address,
      itemIndex: index,
      amount: toNano("0.05"),
      commonContentUrl: file,
    };

    const nftItem = new NftItem(collection);
    seqno = await nftItem.deploy(wallet, mintParams);
    console.log(`Successfully deployed ${index + 1} NFT`);
    await waitSeqno(seqno, wallet);
    index++;
  }
```

## 🏷 Put the NFT on sale

To list an NFT for sale, we need two smart contracts:

- **Marketplace** - Handles the logic for creating new sales.
- **Sale contract** - Manages the logic for buying and canceling sales.

### Deploy the marketplace
Create a new file: `/contracts/NftMarketplace.ts`. Create a basic class that accepts the marketplace owner’s address and generates a cell with the smart contract code and initial data (we will use [basic version of NFT-Marketplace smart contract](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-marketplace.fc)).
```ts
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  internal,
  SendMode,
  StateInit,
} from "@ton/core";
import { OpenedWallet } from "../utils";

export class NftMarketplace {
  public ownerAddress: Address;

  constructor(ownerAddress: Address) {
    this.ownerAddress = ownerAddress;
  }


  public get stateInit(): StateInit {
    const code = this.createCodeCell();
    const data = this.createDataCell();

    return { code, data };
  }

  private createDataCell(): Cell {
    const dataCell = beginCell();

    dataCell.storeAddress(this.ownerAddress);

    return dataCell.endCell();
  }

  private createCodeCell(): Cell {
    const NftMarketplaceCodeBoc = "te6cckEBBAEAbQABFP8A9KQT9LzyyAsBAgEgAgMAqtIyIccAkVvg0NMDAXGwkVvg+kDtRND6QDASxwXy4ZEB0x8BwAGOK/oAMAHU1DAh+QBwyMoHy//J0Hd0gBjIywXLAljPFlAE+gITy2vMzMlx+wCRW+IABPIwjvfM5w==";
    return Cell.fromBase64(NftMarketplaceCodeBoc)
  }
}
```

Implement a method to calculate the smart contract address based on `StateInit`.
```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

Write a method to deploy the marketplace.

```ts
public async deploy(wallet: OpenedWallet): Promise<number> {
    const seqno = await wallet.contract.getSeqno();
    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.5",
          to: this.address,
          init: this.stateInit,
        }),
      ],
      sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
    });
    return seqno;
  }
```

The deployment process is similar to other smart contracts (such as NftItem or a new collection). However, we initially fund the marketplace with 0.5 TON instead of 0.05 TON. Why? When deploying a new sales contract, the marketplace processes the request and sends a message to the new contract. Since this process involves additional transaction fees, we need extra TON.

Finally, add a few lines of code to `app.ts` to deploy the marketplace.

```ts
import { NftMarketplace } from "./contracts/NftMarketplace";
```

Then:

```ts
console.log("Start deploy of new marketplace  ");
const marketplace = new NftMarketplace(wallet.contract.address);
seqno = await marketplace.deploy(wallet);
await waitSeqno(seqno, wallet);
console.log("Successfully deployed new marketplace");
```

### Deploying the sale contract

Now, we can deploy the NFT sale smart contract. How does it work?Transfer the NFT to the sale contract by changing its owner in the item data. In this tutorial, we will use [nft-fixprice-sale-v2](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v2.fc) smart contract.

Create a new file: `/contracts/NftSale.ts`. Declare a type that describes the sale contract data. 
```ts
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  internal,
  SendMode,
  StateInit,
  storeStateInit,
  toNano,
} from "@ton/core";
import { OpenedWallet } from "utils";

export type GetGemsSaleData = {
  isComplete: boolean;
  createdAt: number;
  marketplaceAddress: Address;
  nftAddress: Address;
  nftOwnerAddress: Address | null;
  fullPrice: bigint;
  marketplaceFeeAddress: Address;
  marketplaceFee: bigint;
  royaltyAddress: Address;
  royaltyAmount: bigint;
};
```

Create a class and a method to generate the initial data cell for the smart contract.

```ts
export class NftSale {
  private data: GetGemsSaleData;

  constructor(data: GetGemsSaleData) {
    this.data = data;
  }
}
```

We will begin with creating a cell with fee details:
- The address receiving the marketplace fee.
- The TON amount sent as a marketplace fee.
- The address receiving the royalty from the sale.
- The royalty amount.

```ts
private createDataCell(): Cell {
  const saleData = this.data;

  const feesCell = beginCell();

  feesCell.storeAddress(saleData.marketplaceFeeAddress);
  feesCell.storeCoins(saleData.marketplaceFee);
  feesCell.storeAddress(saleData.royaltyAddress);
  feesCell.storeCoins(saleData.royaltyAmount);
```

Following that we can create an empty cell and just store information from saleData in the correct order. Right after that, store the reference to the cell with the fees information:
```ts
  const dataCell = beginCell();

  dataCell.storeUint(saleData.isComplete ? 1 : 0, 1);
  dataCell.storeUint(saleData.createdAt, 32);
  dataCell.storeAddress(saleData.marketplaceAddress);
  dataCell.storeAddress(saleData.nftAddress);
  dataCell.storeAddress(saleData.nftOwnerAddress);
  dataCell.storeCoins(saleData.fullPrice);
  dataCell.storeRef(feesCell.endCell());

  return dataCell.endCell();
}
```

And as always, add methods to get stateInit, the initial code cell, and the smart contract address.

```ts
public get address(): Address {
  return contractAddress(0, this.stateInit);
}

public get stateInit(): StateInit {
  const code = this.createCodeCell();
  const data = this.createDataCell();

  return { code, data };
}

private createCodeCell(): Cell {
  const NftFixPriceSaleV2CodeBoc =
    "te6cckECDAEAAikAART/APSkE/S88sgLAQIBIAMCAATyMAIBSAUEAFGgOFnaiaGmAaY/9IH0gfSB9AGoYaH0gfQB9IH0AGEEIIySsKAVgAKrAQICzQgGAfdmCEDuaygBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkHCAEMjLBVADzxYB+gLLaslx+wAlwgAl10nCArCOF1BFcIAQyMsFUAPPFgH6AstqyXH7ABAjkjQ04lpwgBDIywVQA88WAfoCy2rJcfsAcCCCEF/MPRSBwCCIYAYyMsFKs8WIfoCy2rLHxPLPyPPFlADzxbKACH6AsoAyYMG+wBxVVAGyMsAFcsfUAPPFgHPFgHPFgH6AszJ7VQC99AOhpgYC42EkvgnB9IBh2omhpgGmP/SB9IH0gfQBqGBNgAPloyhFrpOEBWccgGRwcKaDjgskvhHAoomOC+XD6AmmPwQgCicbIiV15cPrpn5j9IBggKwNkZYAK5Y+oAeeLAOeLAOeLAP0BZmT2qnAbE+OAcYED6Y/pn5gQwLCQFKwAGSXwvgIcACnzEQSRA4R2AQJRAkECPwBeA6wAPjAl8JhA/y8AoAyoIQO5rKABi+8uHJU0bHBVFSxwUVsfLhynAgghBfzD0UIYAQyMsFKM8WIfoCy2rLHxnLPyfPFifPFhjKACf6AhfKAMmAQPsAcQZQREUVBsjLABXLH1ADzxYBzxYBzxYB+gLMye1UABY3EDhHZRRDMHDwBTThaBI=";

  return Cell.fromBase64(NftFixPriceSaleV2CodeBoc);
}
```

To deploy the sale contract, we must form a message and send it to the marketplace:

First, create a cell storing the StateInit of the new sale contract

```ts
public async deploy(wallet: OpenedWallet): Promise<number> {
    const stateInit = beginCell()
      .store(storeStateInit(this.stateInit))
      .endCell();
```

Create a cell with the message body. 
- Set op-code = 1 to indicate a new sale contract deployment.
- Store the coins sent to the new sale contract.
- Store two references: StateInit of the new contract; the body sent to the new contract.
- Send the message to deploy the contract.


```ts
  const payload = beginCell();
  payload.storeUint(1, 32);
  payload.storeCoins(toNano("0.05"));
  payload.storeRef(stateInit);
  payload.storeRef(new Cell());
```

Finally, let's send our message:

```ts
  const seqno = await wallet.contract.getSeqno();
  await wallet.contract.sendTransfer({
    seqno,
    secretKey: wallet.keyPair.secretKey,
    messages: [
      internal({
        value: "0.05",
        to: this.data.marketplaceAddress,
        body: payload.endCell(),
      }),
    ],
    sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
  });
  return seqno;
}
```

Once the sale contract is deployed, the only step left is to transfer ownership of the NFT item to the sale contract’s address.

### Transferring the item
Transferring an item means sending a message from the owner’s wallet to the smart contract with the new owner's information.

Go to `NftItem.ts` and create a new static method in NftItem class to construct the transfer message body:

Create an empty cell and populate it with data.

```ts
static createTransferBody(params: {
    newOwner: Address;
    responseTo?: Address;
    forwardAmount?: bigint;
  }): Cell {
    const msgBody = beginCell();
    msgBody.storeUint(0x5fcc3d14, 32); // op-code 
    msgBody.storeUint(0, 64); // query-id
    msgBody.storeAddress(params.newOwner);
```

Include the following details:
- Op-code, query-id, and the new owner's address.
- The address where a confirmation response will be sent.
- The remaining incoming message coins.
- The amount of TON sent to the new owner.
- Whether the recipient will receive a text payload.

```ts
  msgBody.storeAddress(params.responseTo || null);
  msgBody.storeBit(false); // no custom payload
  msgBody.storeCoins(params.forwardAmount || 0);
  msgBody.storeBit(0); // no forward_payload 

  return msgBody.endCell();
}
```

Create a transfer function to execute the NFT transfer.

```ts
static async transfer(
    wallet: OpenedWallet,
    nftAddress: Address,
    newOwner: Address
  ): Promise<number> {
    const seqno = await wallet.contract.getSeqno();

    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.05",
          to: nftAddress,
          body: this.createTransferBody({
            newOwner,
            responseTo: wallet.contract.address,
            forwardAmount: toNano("0.02"),
          }),
        }),
      ],
      sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
    });
    return seqno;
  }
```

Nice, we are almost done! Go back to `app.ts`  and retrieve the address of the NFT we want to sell:

```ts
const nftToSaleAddress = await NftItem.getAddressByIndex(collection.address, 0);
```

Create a variable to store sale information.

At beggining of the `app.ts`, add:

```ts
import { GetGemsSaleData, NftSale } from "./contracts/NftSale";
```

And then:

```ts
const saleData: GetGemsSaleData = {
  isComplete: false,
  createdAt: Math.ceil(Date.now() / 1000),
  marketplaceAddress: marketplace.address,
  nftAddress: nftToSaleAddress,
  nftOwnerAddress: null,
  fullPrice: toNano("10"),
  marketplaceFeeAddress: wallet.contract.address,
  marketplaceFee: toNano("1"),
  royaltyAddress: wallet.contract.address,
  royaltyAmount: toNano("0.5"),
};
```

Note, that you set `nftOwnerAddress` to null. This ensures that the sale contract accepts coins upon deployment.

Deploy our sale:

```ts
const nftSaleContract = new NftSale(saleData);
seqno = await nftSaleContract.deploy(wallet);
await waitSeqno(seqno, wallet);
```

... and transfer it!
```ts
await NftItem.transfer(wallet, nftToSaleAddress, nftSaleContract.address);
```

Finally, we can launch our project and enjoy the process!

```
yarn start
```

Go to https://testnet.getgems.io/collection/{YOUR_COLLECTION_ADDRESS_HERE} and look to this perfect ducks!

## Conclusion 

Today, you learned a lot about TON and successfully created your own NFT collection on the testnet! If you have any questions or spot an error, feel free to contact the author: [@coalus](https://t.me/coalus)

## References

- [GetGems NFT-contracts](https://github.com/getgems-io/nft-contracts)
- [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)

## About the author 
- _Coalus_ on [Telegram](https://t.me/coalus) or [GitHub](https://github.com/coalus)

## See also
 - [NFT use cases](/v3/documentation/dapps/defi/nft)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2.md
================================================
---
description: In this article, we'll create a simple Telegram bot for accepting payments in TON.
---
import Feedback from '@site/src/components/Feedback';


# Bot with own balance

:::caution
The integration method described in this guide is one of the available approaches. With ongoing developments, Telegram Mini Apps provide additional capabilities that better suit modern security and functionality requirements.
:::

In this article, we'll create a simple Telegram bot for accepting payments in TON.

## 🦄 What it looks like

The bot will look like this:

![image](/img/tutorials/bot1.png)

### Source code

The sources are available on GitHub:
* https://github.com/Gusarich/ton-bot-example

## 📖 What you'll learn
You'll learn how to:
 - Create a Telegram bot in Python3 using Aiogram,
 - Work with SQLITE databases,
 - Work with public TON API.

## ✍️ What you need to get started
Install [Python](https://www.python.org/) if you haven't already.

Install the required PyPi libraries:
 - aiogram,
 - requests.

You can install them with one command in the terminal.
```bash
pip install aiogram==2.21 requests
```

## 🚀 Let's get started!
Create a directory for our bot with four files in it:
 - `bot.py`— Program to run the Telegram bot,
 - `config.py`— Configuration file,
 - `db.py`— Module for interacting with the SQLite database,
 - `ton.py`— Module for handling payments in TON.

The directory should look like this:
```
my_bot
├── bot.py
├── config.py
├── db.py
└── ton.py
```

Now, let’s start coding!

## Config
We'll begin with `config.py` since it's the smallest file. We just need to set a few parameters in it.

**config.py**
```python
BOT_TOKEN = 'YOUR BOT TOKEN'
DEPOSIT_ADDRESS = 'YOUR DEPOSIT ADDRESS'
API_KEY = 'YOUR API KEY'
RUN_IN_MAINNET = True  # Switch True/False to change mainnet to testnet

if RUN_IN_MAINNET:
    API_BASE_URL = 'https://toncenter.com'
else:
    API_BASE_URL = 'https://testnet.toncenter.com'
```

Here you need to fill in the values in the first three lines:
 - `BOT_TOKEN`- Your Telegram bot token [creating a bot](https://t.me/BotFather).
 - `DEPOSIT_ADDRESS` - Your project's wallet address for receiving payments. You can create a new TON Wallet and copy its address. 
 - `API_KEY` - Your API key from TON Center which you can get in [this bot](https://t.me/tonapibot).

You can also choose whether your bot will run on the Testnet or the Mainnet (4th line).

Once these values are set, we can move forward!


## Database
Now let's edit the `db.py` file to store user balances.

Import the sqlite3 library.
```python
import sqlite3
```

Initialize the database connection and cursor (you can choose any filename instead of `db.sqlite`).
```python
con = sqlite3.connect('db.sqlite')
cur = con.cursor()
```

Create a table called **Users** with `uid` and `balance` columns to store information about users and their balances.
```python
cur.execute('''CREATE TABLE IF NOT EXISTS Users (
                uid INTEGER,
                balance INTEGER
            )''')
con.commit()
```

Define helper functions to interact with the database:

`add_user` function will be used to insert new users into the database.
```python
def add_user(uid):
    # new user always has balance = 0
    cur.execute(f'INSERT INTO Users VALUES ({uid}, 0)')
    con.commit()
```

`check_user` function will be used to check if the user exists in the database or not.
```python
def check_user(uid):
    cur.execute(f'SELECT * FROM Users WHERE uid = {uid}')
    user = cur.fetchone()
    if user:
        return True
    return False
```

`add_balance` function will be used to increase the user's balance.
```python
def add_balance(uid, amount):
    cur.execute(f'UPDATE Users SET balance = balance + {amount} WHERE uid = {uid}')
    con.commit()
```

`get_balance` function will be used to retrieve the user's balance.
```python
def get_balance(uid):
    cur.execute(f'SELECT balance FROM Users WHERE uid = {uid}')
    balance = cur.fetchone()[0]
    return balance
```

And that's all for the `db.py` file!

Once this file is set up, we can use these functions in other parts of the bot.


## TON Center API
In the `ton.py` file we'll declare a function that will process all new deposits, increase user balances, and notify users.

### getTransactions method

We'll use the TON Center API. Their documentation is available here:
https://toncenter.com/api/v2/

We need the [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) method to retrieve information about the latest transactions of a given account.
Let's review the input parameters this method requires and what it returns.

The only mandatory input field is `address`, but we also need the `limit` field to specify how many transactions we want to retrieve.

Let's test this method on the [TON Center website](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) website using any existing wallet address to see what the output looks like.
```json
{
  "ok": true,
  "result": [
    {
      ...
    },
    {
      ...
    }
  ]
}
```

Well, so the `ok` field is set to `true` when everything is good, and we have an array `result` with the list of `limit` latest transactions. Now let's look at one single transaction:

```json
{
    "@type": "raw.transaction",
    "utime": 1666648337,
    "data": "...",
    "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "32294193000003",
        "hash": "ez3LKZq4KCNNLRU/G4YbUweM74D9xg/tWK0NyfuNcxA="
    },
    "fee": "105608",
    "storage_fee": "5608",
    "other_fee": "100000",
    "in_msg": {
        "@type": "raw.message",
        "source": "EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL",
        "destination": "EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN",
        "value": "100000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "32294193000002",
        "body_hash": "tDJM2A4YFee5edKRfQWLML5XIJtb5FLq0jFvDXpv0xI=",
        "msg_data": {
            "@type": "msg.dataText",
            "text": "SGVsbG8sIHdvcmxkIQ=="
        },
        "message": "Hello, world!"
    },
    "out_msgs": []
}
```

We can see that the key details for identifying a specific transaction are stored in the `transaction_id` field. We need the `lt` field from this to determine the chronological order of transactions.

Now, we're ready to create a payment handler.

### Sending API requests from code

Let's start by importing the required libraries along with the `config.py` and `db.py` files.
```python
import requests
import asyncio

# Aiogram
from aiogram import Bot
from aiogram.types import ParseMode

# We also need config and database here
import config
import db
```

Let's explore how payment processing can be implemented.

We can call the API every few seconds to check if new transactions have been received in our wallet.

To do this, we need to track the last processed transaction. The simplest approach is to save this transaction’s details in a file and update it every time a new transaction is processed.

What information should we store? We only need the `lt` (logical time) value, which will allow us to determine which transactions need to be processed.

Next, we define an asynchronous function called `start`. Why async? Because the Aiogram library for Telegram bots is asynchronous, making it easier to work with async functions.

This is what our `start` function should look like:
```python
async def start():
    try:
        # Try to load last_lt from file
        with open('last_lt.txt', 'r') as f:
            last_lt = int(f.read())
    except FileNotFoundError:
        # If file not found, set last_lt to 0
        last_lt = 0

    # We need the Bot instance here to send deposit notifications to users
    bot = Bot(token=config.BOT_TOKEN)

    while True:
        # Here we will call API every few seconds and fetch new transactions.
        ...
```

Within the `while` loop, we need to call the TON Center API every few seconds.
```python
while True:
    # 2 Seconds delay between checks
    await asyncio.sleep(2)

    # API call to TON Center that returns last 100 transactions of our wallet
    resp = requests.get(f'{config.API_BASE_URL}/api/v2/getTransactions?'
                        f'address={config.DEPOSIT_ADDRESS}&limit=100&'
                        f'archival=true&api_key={config.API_KEY}').json()

    # If call was not successful, try again
    if not resp['ok']:
        continue
    
    ...
```

After making a `requests.get` call, the response is stored in the `resp` variable. The resp object contains a result list with the 100 most recent transactions for our address.

Now, we iterate through these transactions and identify the new ones.

```python
while True:
    ...

    # Iterating over transactions
    for tx in resp['result']:
        # LT is Logical Time and Hash is hash of our transaction
        lt, hash = int(tx['transaction_id']['lt']), tx['transaction_id']['hash']

        # If this transaction's logical time is lower than our last_lt,
        # we already processed it, so skip it

        if lt <= last_lt:
            continue
        
        # at this moment, `tx` is some new transaction that we haven't processed yet
        ...
```

How to process a new transaction? We need to:
 - Identify which user sent the transaction,
 - Update that user's balance,
 - Notify the user about their deposit.

Below is the code that handles this:

```python
while True:
    ...

    for tx in resp['result']:
        ...
        # at this moment, `tx` is some new transaction that we haven't processed yet

        value = int(tx['in_msg']['value'])
        if value > 0:
            uid = tx['in_msg']['message']

            if not uid.isdigit():
                continue

            uid = int(uid)

            if not db.check_user(uid):
                continue

            db.add_balance(uid, value)

            await bot.send_message(uid, 'Deposit confirmed!\n'
                                    f'*+{value / 1e9:.2f} TON*',
                                    parse_mode=ParseMode.MARKDOWN)
```

Let's analyze what it does:

All the information about the coin transfer is in `tx['in_msg']`. We just need the `value` and `message` fields.

First, we check if value is greater than zero—if not, we ignore the transaction.

Next, we verify that the ( `tx['in_msg']['message']` ) field contains a valid user ID from our bot and that the UID exists in our database.

After these checks, we extract the deposit amount `value` and the user ID `uid`. Then, we add the funds to the user’s account and send them a notification.
Also note that value is in nanotons by default, so we need to divide it by 1 billion. We do that in line with notification:
`{value / 1e9:.2f}`
Here we divide the value by `1e9` (1 billion) and leave only two digits after the decimal point to show it to the user in a friendly format.

Once a transaction is processed, we must update the stored `lt` value to reflect the most recent transaction.

It's simple:
```python
while True:
    ...
    for tx in resp['result']:
        ...
        # we have processed this tx

        # lt variable here contains LT of the last processed transaction
        last_lt = lt
        with open('last_lt.txt', 'w') as f:
            f.write(str(last_lt))
```

And that's all for the `ton.py` file!
Our bot is now 3/4 done; we only need to create a user interface with a few buttons in the bot itself.

## Telegram bot

### Initialization

Open the `bot.py` file and import all necessary modules.
```python
# Logging module
import logging

# Aiogram imports
from aiogram import Bot, Dispatcher, types
from aiogram.dispatcher.filters import Text
from aiogram.types import ParseMode, ReplyKeyboardMarkup, KeyboardButton, \
                          InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils import executor

# Local modules to work with the Database and TON Network
import config
import ton
import db
```

Let's set up logging to our program so that we can see what happens later for debugging.
```python
logging.basicConfig(level=logging.INFO)
```

Next, we initialize the bot and dispatcher using Aiogram:
```python
bot = Bot(token=config.BOT_TOKEN)
dp = Dispatcher(bot)
```

Here we use the `BOT_TOKEN` from our config file.

At this point, our bot is initialized but still lacks functionality. We now need to define interaction handlers.

### Message handlers

#### /start Command

Let's begin with the `/start` and `/help` commands handlers. This function will be triggered when the user launches the bot for the first time, restarts it, or uses the  `/help` command.

```python
@dp.message_handler(commands=['start', 'help'])
async def welcome_handler(message: types.Message):
    uid = message.from_user.id  # Not neccessary, just to make code shorter

    # If user doesn't exist in database, insert it
    if not db.check_user(uid):
        db.add_user(uid)

    # Keyboard with two main buttons: Deposit and Balance
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.row(KeyboardButton('Deposit'))
    keyboard.row(KeyboardButton('Balance'))

    # Send welcome text and include the keyboard
    await message.answer('Hi!\nI am example bot '
                         'made for [this article](docs.ton.org/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2).\n'
                         'My goal is to show how simple it is to receive '
                         'payments in Toncoin with Python.\n\n'
                         'Use keyboard to test my functionality.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```

The welcome message can be customized to anything you prefer. The keyboard buttons can also be labeled as needed, but in this example, we use the most straightforward labels for our bot: `Deposit` and `Balance`.

#### Balance button

Once the user starts the bot, they will see a keyboard with two buttons. However, pressing these buttons won't yield any response yet, as we haven't created functions for them.

Let's add a function to check the user's balance.

```python
@dp.message_handler(commands='balance')
@dp.message_handler(Text(equals='balance', ignore_case=True))
async def balance_handler(message: types.Message):
    uid = message.from_user.id

    # Get user balance from database
    # Also don't forget that 1 TON = 1e9 (billion) Nanoton
    user_balance = db.get_balance(uid) / 1e9

    # Format balance and send to user
    await message.answer(f'Your balance: *{user_balance:.2f} TON*',
                         parse_mode=ParseMode.MARKDOWN)
```

The implementation is simple: we retrieve the balance from the database and send a message displaying it to the user.

#### Deposit button

Let's implement the **Deposit** button. Here’s how it works:

```python
@dp.message_handler(commands='deposit')
@dp.message_handler(Text(equals='deposit', ignore_case=True))
async def deposit_handler(message: types.Message):
    uid = message.from_user.id

    # Keyboard with deposit URL
    keyboard = InlineKeyboardMarkup()
    button = InlineKeyboardButton('Deposit',
                                  url=f'ton://transfer/{config.DEPOSIT_ADDRESS}&text={uid}')
    keyboard.add(button)

    # Send text that explains how to make a deposit into bot to user
    await message.answer('It is very easy to top up your balance here.\n'
                         'Simply send any amount of TON to this address:\n\n'
                         f'`{config.DEPOSIT_ADDRESS}`\n\n'
                         f'And include the following comment: `{uid}`\n\n'
                         'You can also deposit by clicking the button below.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```


This step is crucial because, in `ton.py` we identify which user made a deposit by extracting their UID from the transaction comment. Now, within the bot, we must guide the user to include their UID in the transaction comment.

### Bot start

The final step in `bot.py` is to launch the bot and also start the `start` function from `ton.py`.

```python
if __name__ == '__main__':
    # Create Aiogram executor for our bot
    ex = executor.Executor(dp)

    # Launch the deposit waiter with our executor
    ex.loop.create_task(ton.start())

    # Launch the bot
    ex.start_polling()
```

At this point, we have written all the necessary code for our bot. If everything is set up correctly, the bot should work when you run the following command in the terminal: `python my-bot/bot.py`.

If the bot does not function as expected, compare your code with the code [from this repository](https://github.com/Gusarich/ton-bot-example) to ensure there are no discrepancies.

## References

 - Made for TON as part of [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)
 - [Telegram @Gusarich](https://t.me/Gusarich), [Gusarich on GitHub](https://github.com/Gusarich) - _Gusarich_

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js.md
================================================
---
description: At the end of the tutorial, you will write a beautiful bot that will be able to accept payments for your product directly in TON.
---
import Feedback from '@site/src/components/Feedback';

# Bot for selling dumplings

:::caution
The integration method described in this guide is one of the available approaches. With ongoing developments, Telegram Mini Apps provide additional capabilities that better suit modern security and functionality requirements.
:::

In this article, we'll create a simple Telegram bot for accepting payments in TON.

## 🦄 What it looks like

By the end of the tutorial, you will have a fully functional bot that can accept payments for your product directly in TON.

The bot will look like this:

![bot preview](/img/tutorials/js-bot-preview.jpg)

## 📖 What you'll learn
You'll learn how to:
 - Create a Telegram bot in NodeJS using grammY,
 - Work with the public TON Center API.

> Why use grammY?
grammY is a modern, high-level framework designed for fast and efficient development of Telegram bots using JavaScript, TypeScript, or Deno. It features excellent [documentation](https://grammy.dev) and an active community ready to help.


## ✍️ What you need to get started
Install [NodeJS](https://nodejs.org/en/download/) if you haven't yet.

You will also need the following libraries:
 - grammy,
 - ton,
 - dotenv.

You can install them with a single terminal command.
```bash npm2yarn
npm install ton dotenv grammy @grammyjs/conversations
```

## 🚀 Let's get started!
The structure of our project will look like this:
```
src
    ├── bot
        ├── start.js
        ├── payment.js
    ├── services 
        ├── ton.js
    ├── app.js
.env
```
* `bot/start.js` & `bot/payment.js` - Handlers for the Telegram bot,
* `src/ton.js` - Business logic related to TON,
* `app.js` - Initializes and launches the bot.


Now let's start writing the code!

## Config
Let's begin with `.env`. You need to set the following parameters:

**.env**
```
BOT_TOKEN=
TONCENTER_TOKEN=
NETWORK=
OWNER_WALLET= 
```

Here you need to fill in the values in the first four lines:
 - `BOT_TOKEN` - Your Telegram bot token, obtained after [creating a bot](https://t.me/BotFather).
 - `OWNER_WALLET` - Your project's wallet address for receiving payments. You can create a new TON wallet and copy its address.
 - `API_KEY` - Your API key from TON Center, available via [@tonapibot](https://t.me/tonapibot)/[@tontestnetapibot](https://t.me/tontestnetapibot) for the Mainnet and Testnet, respectively.
 - `NETWORK` - The network on which your bot will operate: Testnet or Mainnet.

With the config file set up, we can move forward!

## TON Center API
In `src/services/ton.py`, we will define functions to verify transactions and generate payment links.

### Getting the latest wallet transactions

Our goal is to check whether a specific transaction exists in a wallet.

How to solve it:
1. Retrieve the latest transactions for our wallet. Why our wallet? In this case, we do not have to worry about what the user's wallet address is, we do not have to confirm that it is their wallet, and we do not have to store this wallet.
2. Filter incoming transactions only.
3. Iterate through transactions and verify if the comment and amount match our data.
4. Celebrate the solution to our problem.

#### Getting the latest transactions

Using the TON Center API, we can refer to their [documentation](https://toncenter.com/api/v2/) and call the [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) method with just the wallet address. We also use the limit parameter to restrict the response to 100 transactions.

For example, a test request for `EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N` (this is the TON Foundation address):
```bash
curl -X 'GET' \
  'https://toncenter.com/api/v2/getTransactions?address=EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N&limit=100' \
  -H 'accept: application/json'
```
Great, now we have a list of transactions on hand in `["result"]`, now let's take a closer look at 1 transaction.


```json
{
      "@type": "raw.transaction",
      "utime": 1667148685,
      "data": "*data here*",
      "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "32450206000003",
        "hash": "rBHOq/T3SoqWta8IXL8THxYqTi2tOkBB8+9NK0uKWok="
      },
      "fee": "106508",
      "storage_fee": "6508",
      "other_fee": "100000",
      "in_msg": {
        "@type": "raw.message",
        "source": "EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG",
        "destination": "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
        "value": "1000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "32450206000002",
        "body_hash": "Fl+2CzHNgilBE4RKhfysLU8VL8ZxYWciCRDva2E19QQ=",
        "msg_data": {
          "@type": "msg.dataText",
          "text": "aGVsbG8g8J+Riw=="
        },
        "message": "hello 👋"
      },
      "out_msgs": []
    }
```

From this JSON file, we can extract some insights:

- The transaction is incoming, which is indicated by an empty `out_msgs` field.
- We can extract the transaction comment, sender, and amount.

Now, we're ready to create a transaction checker.

### Working with TON

Start with importing the required TON library:
```js
import { HttpApi, fromNano, toNano } from "ton";
```

Think about how to check if the user has sent the transaction we need.

It's all very simple. We can simply sort only incoming transactions to our wallet, and then go through the last 100 transactions, and if there is a transaction with the same comment and amount, then we have found the transaction we need!


Initialize the http client for convenient work with TON:
```js
export async function verifyTransactionExistance(toWallet, amount, comment) {
  const endpoint =
    process.env.NETWORK === "mainnet"
      ? "https://toncenter.com/api/v2/jsonRPC"
      : "https://testnet.toncenter.com/api/v2/jsonRPC";
  const httpClient = new HttpApi(
    endpoint,
    {},
    { apiKey: process.env.TONCENTER_TOKEN }
  );
```
Here we simply generate the endpoint url based on which network is selected in the configuration. And after that we initialize the http client.

So, now we can get the last 100 transactions from the owner's wallet.
```js
const transactions = await httpClient.getTransactions(toWallet, {
    limit: 100,
  });
```

Filter, leaving only incoming transactions (if the out_msgs of the transaction is empty, we leave it).
```js
let incomingTransactions = transactions.filter(
    (tx) => Object.keys(tx.out_msgs).length === 0
  );
```

Now we just have to go through all the transactions. If a matching transaction is found, we return true.
```js
  for (let i = 0; i < incomingTransactions.length; i++) {
    let tx = incomingTransactions[i];
    // Skip the transaction if there is no comment in it
    if (!tx.in_msg.msg_data.text) {
      continue;
    }

    // Convert transaction value from nano
    let txValue = fromNano(tx.in_msg.value);
    // Get transaction comment
    let txComment = tx.in_msg.message

    if (txComment === comment && txValue === value.toString()) {
      return true;
    }
  }

  return false;
```
Since values are in nanotons by default, we divide by 1 billion or use the `fromNano` method from the TON library.
And that's it for the `verifyTransactionExistance` function!

Finally, we create a function to generate a payment link by embedding the transaction parameters in a URL.
```js
export function generatePaymentLink(toWallet, amount, comment, app) {
  if (app === "tonhub") {
    return `https://tonhub.com/transfer/${toWallet}?amount=${toNano(
      amount
    )}&text=${comment}`;
  }
  return `https://app.tonkeeper.com/transfer/${toWallet}?amount=${toNano(
    amount
  )}&text=${comment}`;
}
```
All we need is just to substitute the transaction parameters in the URL. Make sure to convert the transaction value to nano.


## Telegram bot

### Initialization

Open the `app.js` file and import all the handlers and modules we need.
```js
import dotenv from "dotenv";
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import {
  startPaymentProcess,
  checkTransaction,
} from "./bot/handlers/payment.js";
import handleStart from "./bot/handlers/start.js";
```

Set up the dotenv module to work with environment variables:

```js
dotenv.config();
```

Now, define a function to run the bot. To prevent it from stopping due to errors, include:

```js
async function runApp() {
  console.log("Starting app...");

  // Handler of all errors, in order to prevent the bot from stopping
  process.on("uncaughtException", function (exception) {
    console.log(exception);
  });
```

Next, initialize the bot and the necessary plugins.
```js
  // Initialize the bot
  const bot = new Bot(process.env.BOT_TOKEN);

  // Set the initial data of our session
  bot.use(session({ initial: () => ({ amount: 0, comment: "" }) }));
  // Install the conversation plugin
  bot.use(conversations());

  bot.use(createConversation(startPaymentProcess));
```
Here we use `BOT_TOKEN` from our configuration we created at the beginning of the tutorial.

We have initialized the bot, but it is still empty. We need to add some features to interact with the user.
```js
  // Register all handelrs
  bot.command("start", handleStart);
  bot.callbackQuery("buy", async (ctx) => {
    await ctx.conversation.enter("startPaymentProcess");
  });
  bot.callbackQuery("check_transaction", checkTransaction);
```
Reacting to the command/start, the handleStart function will be executed. If the user clicks on the button with callback_data equal to "buy", we will start our "conversation", which we registered just above. And when we click on the button with callback_data equal to `"check_transaction"`, we will execute the `checkTransaction` function.

Finally, launch the bot and output a log a success message.
```js
  // Start bot
  await bot.init();
  bot.start();
  console.info(`Bot @${bot.botInfo.username} is up and running`);
```

### Message handlers

#### /start Command

Let's begin with the `/start` command handler. This function is triggered when a user starts or restarts the bot.

```js
import { InlineKeyboard } from "grammy";

export default async function handleStart(ctx) {
  const menu = new InlineKeyboard()
    .text("Buy dumplings🥟", "buy")
    .row()
    .url("Article with a detailed explanation of the bot's work", "docs.ton.org/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js");

  await ctx.reply(
    `Hello stranger!
Welcome to the best Dumplings Shop in the world <tg-spoiler>and concurrently an example of accepting payments in TON</tg-spoiler>`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```
First, import the InlineKeyboard from the grammy module. Then, create an inline keyboard offering to buy dumplings and linking to this tutorial. 
The `.row()` method places the next button on a new line.
We send a welcome message (formatted with HTML) along with the keyboard. You can customize this message as needed.

#### Payment process

We begin by importing the necessary modules:

```js
import { InlineKeyboard } from "grammy";

import {
  generatePaymentLink,
  verifyTransactionExistance,
} from "../../services/ton.js";
```
After that, we will create a startPaymentProcess handler, which we have already registered in the `app.js`. This function is executed when a specific button is pressed.

To remove the spinning watch icon in Telegram, we acknowledge the callback before proceeding.

```js
  await ctx.answerCallbackQuery();
```
Next, we need to send the user a picture of dumplings, ask them to send the number of dumplings that they want to buy. Wait for the user to enter this number.
```js
  await ctx.replyWithPhoto(
    "https://telegra.ph/file/bad2fd69547432e16356f.jpg",
    {
      caption:
        "Send the number of portions of yummy dumplings you want buy\nP.S. Current price for 1 portion: 3 TON",
    }
  );

  // Wait until the user enters the number
  const count = await conversation.form.number();
```
Next, we calculate the total amount of the order and generate a random string that we will use for the transaction comment and add the postfix `"dumplings"`.
```js
  // Get the total cost: multiply the number of portions by the price of the 1 portion
  const amount = count * 3;
  // Generate random comment
  const comment = Math.random().toString(36).substring(2, 8) + "dumplings";
```

Save the resulting data to the session so that we can get this data in the next handler.
```js
  conversation.session.amount = amount;
  conversation.session.comment = comment;
```

We generate links for quick payment and create a built-in keyboard.
```js
const tonhubPaymentLink = generatePaymentLink(
    process.env.OWNER_WALLET,
    amount,
    comment,
    "tonhub"
  );
  const tonkeeperPaymentLink = generatePaymentLink(
    process.env.OWNER_WALLET,
    amount,
    comment,
    "tonkeeper"
  );

  const menu = new InlineKeyboard()
    .url("Click to pay in TonHub", tonhubPaymentLink)
    .row()
    .url("Click to pay in Tonkeeper", tonkeeperPaymentLink)
    .row()
    .text(`I sent ${amount} TON`, "check_transaction");
```
Send the message using the keyboard, in which ask the user to send a transaction to our wallet address with a randomly generated comment.

```js
  await ctx.reply(
    `
Fine, all you have to do is transfer ${amount} TON to the wallet <code>${process.env.OWNER_WALLET}</code> with the comment <code>${comment}</code>.

<i>WARNING: I am currently working on ${process.env.NETWORK}</i>

P.S. You can conveniently make a transfer by clicking on the appropriate button below and confirming the transaction in the offer`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```

Now all we have to do is create a handler to check for the presence of a transaction.
```js
export async function checkTransaction(ctx) {
  await ctx.answerCallbackQuery({
    text: "Wait a bit, I need to check the availability of your transaction",
  });

  if (
    await verifyTransactionExistance(
      process.env.OWNER_WALLET,
      ctx.session.amount,
      ctx.session.comment
    )
  ) {
    const menu = new InlineKeyboard().text("Buy more dumplings🥟", "buy");

    await ctx.reply("Thank you so much. Enjoy your meal!", {
      reply_markup: menu,
    });

    // Reset the session data
    ctx.session.amount = 0;
    ctx.session.comment = "";
  } else {
    await ctx.reply("I didn't receive your transaction, wait a bit");
  }
}
```
Next, simply check for a transaction, and if it exists, notify the user and flush the data in the session.

### Start of the bot

To start the bot, use this command:

```bash npm2yarn
npm run app
```

If your bot isn't working correctly, compare your code with the code [from this repository](https://github.com/coalus/DumplingShopBot). If issues persist, feel free to contact me on Telegram. You can find my Telegram account below.

## References

 - Made for TON as a part of [ton-footsteps/58](https://github.com/ton-society/ton-footsteps/issues/58)
 - [Telegram @coalus](https://t.me/coalus), [Coalus on GitHub](https://github.com/coalus) - _Coalus_
 - [Bot sources](https://github.com/coalus/DumplingShopBot)

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot.md
================================================
---
description: In this article, we'll guide you through the process of accepting payments in a Telegram bot.
---

import Feedback from '@site/src/components/Feedback';

# Storefront bot with payments in TON

:::caution
The integration method described in this guide is one of the available approaches. With ongoing developments, Telegram Mini Apps provide additional capabilities that better suit modern security and functionality requirements.
:::

In this article, we'll guide you through the process of accepting payments in a Telegram bot.

## 📖 What you'll learn

In this article, you'll learn how to:

- Create a Telegram bot using Python and Aiogram,
- Work with the public TON Center API,
- Work with an SQlite database,
- How to accept payments in a Telegram bot by applying the knowledge from previous steps.

## 📚 Before we begin

Make sure you have installed the latest version of Python and the following packages:

- aiogram,
- requests.
- sqlite3.

## 🚀 Let's get started!

We'll follow this order:

1. Work with an SQlite database.
2. Work with the public TON API (TON Center).
3. Create a Telegram bot using Python and Aiogram.
4. Profit!

Let's create the following four files in our project directory:

```
telegram-bot
├── config.json
├── main.py
├── api.py
└── db.py
```

## Config

In `config.json`, we store our bot token and public TON API key.

```json
{
  "BOT_TOKEN": "Your bot token",
  "MAINNET_API_TOKEN": "Your mainnet api token",
  "TESTNET_API_TOKEN": "Your testnet api token",
  "MAINNET_WALLET": "Your mainnet wallet",
  "TESTNET_WALLET": "Your testnet wallet",
  "WORK_MODE": "testnet"
}
```

In `config.json`, define whether you'll use use `Testnet` or `Mainnet`.

## Database

### Create a database

This example uses a local Sqlite database.

Create a file called `db.py`.

To work with the database, import sqlite3 module and some modules for handling time.

```python
import sqlite3
import datetime
import pytz
```

- `sqlite3`—module for working with sqlite database,
- `datetime`—module for working with time.
- `pytz`—module for working with timezones.

Next, establish a connection to the database and a cursor:

```python
locCon = sqlite3.connect('local.db', check_same_thread=False)
cur = locCon.cursor()
```

If the database does not exist, it will be created automatically.

We need two tables:

#### Transactions:

```sql
CREATE TABLE transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                         NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
);
```

- `source`—payer's wallet address,
- `hash`—transaction hash,
- `value`—transaction value,
- `comment`—transaction comment.

#### Users:

```sql
CREATE TABLE users (
    id         INTEGER       UNIQUE
                             NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
);
```

- `id`—Telegram user ID,
- `username`—Telegram username,
- `first_name`—Telegram user's first name,
- `wallet`—user wallet address.

The `users` table stores Telegram users along with their Telegram ID, @username,
first name, and wallet. The wallet is added to the database upon the first
successful payment.

The `transactions` table stores verified transactions.
To verify a transaction, we need a unique transaction hash, source, value, and comment.

To create these tables, we need to run the following function:

```python
cur.execute('''CREATE TABLE IF NOT EXISTS transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                        NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
)''')
locCon.commit()

cur.execute('''CREATE TABLE IF NOT EXISTS users (
    id         INTEGER       UNIQUE
                            NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
)''')
locCon.commit()
```

This code will create the tables if they are not already created.

### Work with database

Let's analyze the process:
A user makes a transaction. How do we verify it? How do we ensure that the same transaction isn't confirmed twice?

Each transaction includes a `body_hash`, which allows us to easily check whether the transaction is already in the database.

We only add transactions that have been verified. The `check_transaction` function determines whether a given transaction is already in the database.

`add_v_transaction` adds transaction to the transactions table.

```python
def add_v_transaction(source, hash, value, comment):
    cur.execute("INSERT INTO transactions (source, hash, value, comment) VALUES (?, ?, ?, ?)",
                (source, hash, value, comment))
    locCon.commit()
```

```python
def check_transaction(hash):
    cur.execute(f"SELECT hash FROM transactions WHERE hash = '{hash}'")
    result = cur.fetchone()
    if result:
        return True
    return False
```

`check_user` verifies if the user exists in the database and adds them if not.

```python
def check_user(user_id, username, first_name):
    cur.execute(f"SELECT id FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()

    if not result:
        cur.execute("INSERT INTO users (id, username, first_name) VALUES (?, ?, ?)",
                    (user_id, username, first_name))
        locCon.commit()
        return False
    return True
```

The user can store a wallet in the table. It is added with the first successful purchase. The `v_wallet` function checks if the user has an associated wallet. If not, it adds the wallet upon the user's first successful purchase.

```python
def v_wallet(user_id, wallet):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    if result[0] == "none":
        cur.execute(
            f"UPDATE users SET wallet = '{wallet}' WHERE id = '{user_id}'")
        locCon.commit()
        return True
    else:
        return result[0]
```

`get_user_wallet` simply retrieves the user's wallet.

```python
def get_user_wallet(user_id):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    return result[0]
```

`get_user_payments` returns the user's payment history.
This function checks if the user has a wallet. If they do, it provides the list of their payments.

```python
def get_user_payments(user_id):
    wallet = get_user_wallet(user_id)

    if wallet == "none":
        return "You have no wallet"
    else:
        cur.execute(f"SELECT * FROM transactions WHERE source = '{wallet}'")
        result = cur.fetchall()
        tdict = {}
        tlist = []
        try:
            for transaction in result:
                tdict = {
                    "value": transaction[2],
                    "comment": transaction[3],
                }
                tlist.append(tdict)
            return tlist

        except:
            return False
```

## API

_We can interact with the blockchain using third-party APIs provided by network members. These services allow developers to bypass the need their own node and customize their API._

### Required requests

What do we need to confirm that a user has transferred the required amount?

We simply need to check the latest incoming transfers to our wallet and find a transaction from the right address with the right amount (and possibly a unique comment).
For this, TON Center provides the `getTransactions` method.

### getTransactions

By default, this method retrieves the last 10 transactions. However, we can request more, though this slightly increases the response time. In most cases, requestin additional transactions is unnecessary.

If more transactions are required, each transaction includes `lt` and `hash`. We can fetch, for example, the last 30 transactions. If the required transaction is not found, we can take `lt` and `hash` of the last transaction in the list and include them in a new request.

This allows us to retrieve the next 30 transactions, and so on.

For example, consider the wallet in the test network `EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5`.

Using a [query](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&to_lt=0&archival=true) returns a response containing two transactions.
Note that some details have been omitted for clarity.

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1944556000003",
        // highlight-next-line
        "hash": "swpaG6pTBXwYI2024NAisIFp59Fw3k1DRQ5fa5SuKAE="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "kBfGYBTkBaooeZ+NTVR0EiVGSybxQdb/ifXCRX5O7e0=",
        "message": "Sea breeze 🌊"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1943166000003",
        // highlight-next-line
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Spring forest 🌲"
      },
      "out_msgs": []
    }
  ]
}
```

By adding `lt` and `hash` to the query, we can retrieve the next two two transactions in sequence. That is, instead of getting the first and second transactions, we will receive the second and third.

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        "lt": "1943166000003",
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Spring forest 🌲"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        "lt": "1845458000003",
        "hash": "k5U9AwIRNGhC10hHJ3MBOPT//bxAgW5d9flFiwr1Sao="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "XpTXquHXP64qN6ihHe7Tokkpy88tiL+5DeqIrvrNCyo=",
        "message": "Second"
      },
      "out_msgs": []
    }
  ]
}
```

The request will look like as follows [this.](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&lt=1943166000003&hash=hxIQqn7lYD%2Fc%2FfNS7W%2FiVsg2kx0p%2FkNIGF6Ld0QEIxk%3D&to_lt=0&archival=true)

We will also need a method `detectAddress`.

Here is an example of a Tonkeeper wallet address on Testnet: `kQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aCTb`. If we look for the transaction in the explorer, the address appears as: `EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R`.

This method provides us with the correctly formatted address.

```json
{
  "ok": true,
  "result": {
    "raw_form": "0:b3409241010f85ac415cbf13b9b0dc6157d09a39d2bd0827eadb20819f067868",
    "bounceable": {
      "b64": "EQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
      // highlight-next-line
      "b64url": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R"
    },
    "non_bounceable": {
      "b64": "UQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU",
      "b64url": "UQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU"
    }
  }
}
```

Additionally, we need `b64url`, which allows us to validate the user's address.

Basically, that's all we need.

### API requests and what to do with them

Now, let's move to the IDE andreate the `api.py` file.

Import the necessary libraries.

```python
import requests
import json
# We import our db module, as it will be convenient to add from here
# transactions to the database
import db
```

- `requests`—to make requests to the API,
- `json`—to work with JSON,
- `db`—to work with our sqlite database.

Let's create two variables to store the base URLs for our requests.

```python
# This is the beginning of our requests
MAINNET_API_BASE = "https://toncenter.com/api/v2/"
TESTNET_API_BASE = "https://testnet.toncenter.com/api/v2/"
```

We get all API tokens and wallets from the config.json file.

```python
# Find out which network we are working on
with open('config.json', 'r') as f:
    config_json = json.load(f)
    MAINNET_API_TOKEN = config_json['MAINNET_API_TOKEN']
    TESTNET_API_TOKEN = config_json['TESTNET_API_TOKEN']
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']
```

Depending on the network, we take the necessary data.

```python
if WORK_MODE == "mainnet":
    API_BASE = MAINNET_API_BASE
    API_TOKEN = MAINNET_API_TOKEN
    WALLET = MAINNET_WALLET
else:
    API_BASE = TESTNET_API_BASE
    API_TOKEN = TESTNET_API_TOKEN
    WALLET = TESTNET_WALLET
```

Our first request function `detectAddress`.

```python
def detect_address(address):
    url = f"{API_BASE}detectAddress?address={address}&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    try:
        return response['result']['bounceable']['b64url']
    except:
        return False
```

At the input, we have the estimated address, and at the output, we have either the "correct" address necessary for us to do further work or False.

You may notice that an API key has appeared at the end of the request. It is needed to remove the limit on the number of requests to the API. Without it, we are limited to one request per second.

Here is next function for `getTransactions`:

```python
def get_address_transactions():
    url = f"{API_BASE}getTransactions?address={WALLET}&limit=30&archival=true&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    return response['result']
```

This function returns the last 30 transactions for our `WALLET`.

The `archival=true` parameter ensures that transactions are retrieved from a node with a complete blockchain history.

At the output, we get a list of transactions, such as `[{0},{1},...,{29}]` which are represented as a list of dictionaries.
And finally the last function:

```python
def find_transaction(user_wallet, value, comment):
		# Get the last 30 transactions
    transactions = get_address_transactions()
    for transaction in transactions:
				# Select the incoming "message" - transaction
        msg = transaction['in_msg']
        if msg['source'] == user_wallet and msg['value'] == value and msg['message'] == comment:
						# If all the data match, we check that this transaction
						# we have not verified before
            t = db.check_transaction(msg['body_hash'])
            if t == False:
								# If not, we write in the table to the verified
								# and return True
                db.add_v_transaction(
                    msg['source'], msg['body_hash'], msg['value'], msg['message'])
                print("find transaction")
                print(
                    f"transaction from: {msg['source']} \nValue: {msg['value']} \nComment: {msg['message']}")
                return True
						# If this transaction is already verified, we check the rest, we can find the right one
            else:
                pass
		# If the last 30 transactions do not contain the required one, return False
		# Here you can add code to see the next 29 transactions
		# However, within the scope of the Example, this would be redundant.
    return False
```

At the input, we get the correct wallet address, amount and comment. If the expected incoming transaction is found, the output is True; otherwise, it is False.

## Telegram bot

First, let's establish the bot's foundation.

### Imports

In this part, we will import the required libraries.

From `aiogram` we need `Bot`, `Dispatcher`, `types` and `executor`.

```python
from aiogram import Bot, Dispatcher, executor, types
```

`MemoryStorage` is needed for the temporary storage of information.

`FSMContext`, `State`, and `StatesGroup` are needed for working with the state machine.

```python
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
```

`json` is needed to work with json files. `logging` is needed to log errors.

```python
import json
import logging
```

`api` and `db` are our own files which we will fill in later.

```python
import db
import api
```

### Config setup

It is recommended to store data such as `BOT_TOKEN` and wallet addresses for receiving payments in a separate file called `config.json` for convenience.

```json
{
  "BOT_TOKEN": "Your bot token",
  "MAINNET_API_TOKEN": "Your mainnet api token",
  "TESTNET_API_TOKEN": "Your testnet api token",
  "MAINNET_WALLET": "Your mainnet wallet",
  "TESTNET_WALLET": "Your testnet wallet",
  "WORK_MODE": "testnet"
}
```

#### Bot token

`BOT_TOKEN` is the Telegram bot token obtained from [@BotFather](https://t.me/BotFather)

#### Working mode

The `WORK_MODE` key defines whether the bot operates in the test or main network; `testnet` or `mainnet` respectively.

#### API tokens

API tokens for `*_API_TOKEN` can be obtained from the [TON Center](https://toncenter.com/) bots:

- Mainnet — [@tonapibot](https://t.me/tonapibot)
- Testnet — [@tontestnetapibot](https://t.me/tontestnetapibot)

#### Connecting the config to our bot

Next, we complete the bot setup by retrieving the bot token from `config.json` :

```python
with open('config.json', 'r') as f:
    config_json = json.load(f)
    # highlight-next-line
    BOT_TOKEN = config_json['BOT_TOKEN']
		# put wallets here to receive payments
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']

if WORK_MODE == "mainnet":
    WALLET = MAINNET_WALLET
else:
		# By default, the bot will run on the testnet
    WALLET = TESTNET_WALLET
```

### Logging and bot setup

```python
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN, parse_mode=types.ParseMode.HTML)
dp = Dispatcher(bot, storage=MemoryStorage())
```

### States

States allow us to devide the bot workflow into stages, each designated for a specific task.

```python
class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()
```

For details and examples, refer to the [Aiogram documentation](https://docs.aiogram.dev/en/latest/).

### Message handlers

This is the part where we will write the bot interaction logic.

We'll be using two types of handlers:

- `message_handler` is used to handle messages from users,
- `callback_query_handler` is used to handle callbacks from inline keyboards.

If we want to handle a message from the user, we will use `message_handler` by placing `@dp.message_handler` decorator above the function. In this case, the function will be called when the user sends a message to the bot.

In the decorator, we can specify the conditions under which the function will be called. For example, if we want the function to be called only when the user sends a message with the text `/start`, then we will write the following:

```
@dp.message_handler(commands=['start'])
```

Handlers need to be assigned to an async function. In this case, we will use  `async def` syntax. The `async def` syntax is used to define the function that will be called asynchronously.

#### /start

Let's start with `/start` command handler.

```python
@dp.message_handler(commands=['start'], state='*')
async def cmd_start(message: types.Message):
    await message.answer(f"WORKMODE: {WORK_MODE}")
    # check if user is in database. if not, add him
    isOld = db.check_user(
        message.from_user.id, message.from_user.username, message.from_user.first_name)
    # if user already in database, we can address him differently
    if isOld == False:
        await message.answer(f"You are new here, {message.from_user.first_name}!")
        await message.answer(f"to buy air send /buy")
    else:
        await message.answer(f"Welcome once again, {message.from_user.first_name}!")
        await message.answer(f"to buy more air send /buy")
    await DataInput.firstState.set()
```

In the decorator of a handler, you may see `state='*'`, meaning the handler will be triggered regardless of the bot's state. If we want the handler to activate only in a specific state, we specify it, such as `state=DataInput.firstState`, ensuring the handler runs only when the bot is in `firstState`.

After the user sends `/start` command, the bot will check if the user is in database using `db.check_user` function. If not, it will add him. This function will also return the bool value and we can use it to address the user differently. After that, the bot will set the state to `firstState`.

#### /cancel

The /cancel command returns the bot to `firstState`.

```python
@dp.message_handler(commands=['cancel'], state="*")
async def cmd_cancel(message: types.Message):
    await message.answer("Canceled")
    await message.answer("/start to restart")
    await DataInput.firstState.set()
```

#### /buy

And, of course, there is a `/buy` command handler. In this example, we sell different types of air and use the reply keyboard to choose the type.

```python
# /buy command handler
@dp.message_handler(commands=['buy'], state=DataInput.firstState)
async def cmd_buy(message: types.Message):
    # reply keyboard with air types
    keyboard = types.ReplyKeyboardMarkup(
        resize_keyboard=True, one_time_keyboard=True)
    keyboard.add(types.KeyboardButton('Just pure 🌫'))
    keyboard.add(types.KeyboardButton('Spring forest 🌲'))
    keyboard.add(types.KeyboardButton('Sea breeze 🌊'))
    keyboard.add(types.KeyboardButton('Fresh asphalt 🛣'))
    await message.answer(f"Choose your air: (or /cancel)", reply_markup=keyboard)
    await DataInput.secondState.set()
```

So, when a user sends `/buy` command, the bot sends him a reply keyboard with air types. After the user chooses the type of air, the bot will set the state to `secondState`.

This handler will work only when `secondState` is set and will be waiting for a message from the user with the air type.  In this case, we need to store the air type that the user choses, so we pass FSMContext as an argument to the function.

FSMContext is used to store data in the bot's memory. We can store any data in it but this memory is not persistent, so if the bot is restarted, the data will be lost. But it's good to store temporary data in it.

```python
# handle air type
@dp.message_handler(state=DataInput.secondState)
async def air_type(message: types.Message, state: FSMContext):
    if message.text == "Just pure 🌫":
        await state.update_data(air_type="Just pure 🌫")
    elif message.text == "Fresh asphalt 🛣":
        await state.update_data(air_type="Fresh asphalt 🛣")
    elif message.text == "Spring forest 🌲":
        await state.update_data(air_type="Spring forest 🌲")
    elif message.text == "Sea breeze 🌊":
        await state.update_data(air_type="Sea breeze 🌊")
    else:
        await message.answer("Wrong air type")
        await DataInput.secondState.set()
        return
    await DataInput.WalletState.set()
    await message.answer(f"Send your wallet address")
```

Use...

```python
await state.update_data(air_type="Just pure 🌫")
```

...to store the air type in FSMContext. After that, we set the state to `WalletState` and ask the user to send their wallet address.

This handler activates only in WalletState, expecting a valid wallet address.

Consider the next handler. It may seem complex, but it isn’t. First, we verify whether the message contains a wallet address of the correct length using `len(message.text) == 48`. Then, we call the `api.detect_address` function to validate the address. This function also returns the standardized *correct* address, which is stored in the database.

After that, we get the air type from FSMContext using `await state.get_data()` and store it in  `user_data` variable.

Now we have all the data required for the payment process. We just need to generate a payment link and send it to the user. Let's use the inline keyboard.

The bot provides three payment buttons:

- TON wallet,
- Tonhub,
- Tonkeeper.

These buttons are advantageous of special buttons because they guide users to install a wallet if they don't have one

You are free to use whatever you want.

And we need a button that the user will press after tmaking a transaction, allowing the bot to verify the payment.

```python
@dp.message_handler(state=DataInput.WalletState)
async def user_wallet(message: types.Message, state: FSMContext):
    if len(message.text) == 48:
        res = api.detect_address(message.text)
        if res == False:
            await message.answer("Wrong wallet address")
            await DataInput.WalletState.set()
            return
        else:
            user_data = await state.get_data()
            air_type = user_data['air_type']
            # inline button "check transaction"
            keyboard2 = types.InlineKeyboardMarkup(row_width=1)
            keyboard2.add(types.InlineKeyboardButton(
                text="Check transaction", callback_data="check"))
            keyboard1 = types.InlineKeyboardMarkup(row_width=1)
            keyboard1.add(types.InlineKeyboardButton(
                text="Ton Wallet", url=f"ton://transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(
                text="Tonkeeper", url=f"https://app.tonkeeper.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(
                text="Tonhub", url=f"https://tonhub.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            await message.answer(f"You choose {air_type}")
            await message.answer(f"Send <code>1</code> toncoin to address \n<code>{WALLET}</code> \nwith comment \n<code>{air_type}</code> \nfrom your wallet ({message.text})", reply_markup=keyboard1)
            await message.answer(f"Click the button after payment", reply_markup=keyboard2)
            await DataInput.PayState.set()
            await state.update_data(wallet=res)
            await state.update_data(value_nano="1000000000")
    else:
        await message.answer("Wrong wallet address")
        await DataInput.WalletState.set()
```

#### /me

One last message handler is `/me`. It shows the user's payments.

```python
# /me command handler
@dp.message_handler(commands=['me'], state="*")
async def cmd_me(message: types.Message):
    await message.answer(f"Your transactions")
    # db.get_user_payments returns list of transactions for user
    transactions = db.get_user_payments(message.from_user.id)
    if transactions == False:
        await message.answer(f"You have no transactions")
    else:
        for transaction in transactions:
            # we need to remember that blockchain stores value in nanotons. 1 toncoin = 1000000000 in blockchain
            await message.answer(f"{int(transaction['value'])/1000000000} - {transaction['comment']}")
```

### Callback handlers

Callback data is embedded in buttons, allowing the bot to recognize user actions.

For example, the “Payment Confirmed” button sends the callback "check", which the bot must process.

Callback handlers are very similar to message handlers but they have `types.CallbackQuery` as an argument instead of `message`. Function decorator is also different.

```python
@dp.callback_query_handler(lambda call: call.data == "check", state=DataInput.PayState)
async def check_transaction(call: types.CallbackQuery, state: FSMContext):
    # send notification
    user_data = await state.get_data()
    source = user_data['wallet']
    value = user_data['value_nano']
    comment = user_data['air_type']
    result = api.find_transaction(source, value, comment)
    if result == False:
        await call.answer("Wait a bit, try again in 10 seconds. You can also check the status of the transaction through the explorer (tonscan.org/)", show_alert=True)
    else:
        db.v_wallet(call.from_user.id, source)
        await call.message.edit_text("Transaction is confirmed \n/start to restart")
        await state.finish()
        await DataInput.firstState.set()
```

In this handler we get user data from FSMContext and use `api.find_transaction` to check if the transaction was successful. If so, the wallet address is stored in the database, and the bot notifies the user. After that, the user can check their transaction anytime using `/me`.

### Finalizing main.py

At the end, don't forget:

```python
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
```

This part is needed to start the bot.
In `skip_updates=True` we specify that we do not want to process old messages. But if you want to process all messages, you can set it to `False`.

:::info

All code of `main.py` can be found [here](https://github.com/LevZed/ton-payments-in-telegram-bot/blob/main/bot/main.py).

:::

## Bot in action

Congratulations! The bot is ready. You can test it!

Steps to run the bot:

1. Fill in the `config.json` file.
2. Run `main.py`.

All files must be in the same folder. To start the bot, you need to run the `main.py` file. You can do it in your IDE or in the terminal like this:

```
python main.py
```

If errors occur, check them in the terminal. Maybe you have missed something in the code.

Example of a working bot [@AirDealerBot](https://t.me/AirDealerBot)

![bot](/img/tutorials/apiatb-bot.png)

## References

- Made for TON as part of [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)
- [Telegram @Revuza](https://t.me/revuza), [LevZed on GitHub](https://github.com/LevZed) - _Lev_

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tutorials/web3-game-example.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tutorials/web3-game-example.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON Blockchain for games

## What’s in the tutorial
In this tutorial, we will explore how to integrate TON Blockchain into a game. As an example, we will use a Flappy Bird clone built with Phaser and gradually add GameFi features. To improve readability, we will use short code snippets and pseudocode. Additionally, we will provide links to real code blocks for better understanding. The complete implementation can be found in the [demo repo](https://github.com/ton-community/flappy-bird).

![Flappy Bird game without GameFi features](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

We will implement the following:
- Achievements. Let’s reward our users with [SBTs](/v3/concepts/glossary#sbt). The achievement system is a great tool for increasing user engagement.
- Game currency. On the TON blockchain, it’s easy to launch your own token (jetton). The token can be used to create an in-game economy. Our users will be able to earn game coins and spend them later.
- Game shop. We will allow users to purchase in-game items using either in-game currency or TON coins.
  
## Preparations

### Install GameFi SDK
First, we need to set up the game environment by installing `assets-sdk`. This package is designed to provide developers with everything required to integrate blockchain into games. The library can be used either from the CLI or within Node.js scripts. In this tutorial, we will use the CLI approach.
```sh
npm install -g @ton-community/assets-sdk@beta
```

### Create a master wallet
Next, we need to create a master wallet. This wallet will be used to mint jettons, collections, NFTs, and SBTs, as well as to receive payments.
```sh
assets-cli setup-env
```
You will be asked a few questions during the setup.

Field | Hint
:----- | :-----
Network | Select `testnet` since this is a test game.
Type | Select `highload-v2`wallet type, as it offers the best performance for use as a master wallet.
Storage | Storage is used to hold `NFT`/`SB`T files. You can choose between `Amazon S3` (centralized) or `Pinata` (decentralized).  For this tutorial, we'll use Pinata since decentralized storage is more illustrative for a Web3 game.
IPFS gateway | This service loads asset metadata from  `pinata`, `ipfs.io,  or a custom service URL.

The script will output a link where you can view the created wallet's state.

![New wallet in Nonexist status](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

As you can see, the wallet has not actually been created yet. To finalize the creation, we need to deposit funds into it. In a real-world scenario, you can fund the wallet however you prefer using its address. In our case, we will use the [Testgiver TON Bot](https://t.me/testgiver_ton_bot). Open it to claim 5 test TON coins.

A little later, you should see 5 TON in the wallet, and its status will change to Uninit. The wallet is now ready. After the first transaction, its status will change to Active.
![Wallet status after top-up](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### Mint in-game currency
We are going to create an in-game currency to reward users.
```sh
assets-cli deploy-jetton
```
You will be asked a few questions during the setup:

Field | Hint
:----- | :-----
Name | Token name, for example ` Flappy Jetton `.
Description | Token description, for instance: A vibrant digital token from the Flappy Bird universe.
Image | Download prepared [jetton logo](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png) and specify file path. Of course, you can use any image.
Symbol | `FLAP` or enter any abbreviation you want to use.
Decimals | How many zeros after the dot your currency will have. Let’ it be `0` in our case.

The script will output a link where you can view the created jetton's state. It will have an **Active** status. The wallet’s status will change from **Uninit** to **Active**.

![In-game currency / jetton](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### Create collections for SBTs
For our demo game, we will reward users after their first and fifth games. To do this, we will mint two collections, where SBTs will be assigned when users meet the required conditions—playing for the first and fifth time:
```sh
assets-cli deploy-nft-collection
```

Field | First game | Fifth game
:----- | :----- | :-----
Type | `sbt` | `sbt`
Name | Flappy First Flight | Flappy High Fiver
Description | Commemorating your inaugural journey in the Flappy Bird game! | Celebrate your persistent play with the Flappy High Fiver NFT!
Image | You can download [the image](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png) here | You can download [the image](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png) here

Now that we are fully prepared, let's proceed to implementing the game logic.

## Connecting wallet
The process begins with the user connecting their wallet. Let's integrate wallet connectivity.

To interact with the blockchain from the client side, we need to install the GameFi SDK for Phaser:
```sh
npm install --save @ton/phaser-sdk@beta
```
Now, let's set up GameFi SDK and create an instance of it:

```typescript
import { GameFi } from '@ton/phaser-sdk'

const gameFi = await GameFi.create({
    network: 'testnet'
    connector: {
        // if tonconnect-manifest.json is placed in the root you can skip this option
        manifestUrl: '/assets/tonconnect-manifest.json',
        actionsConfiguration: {
            // address of your Telegram Mini App to return to after the wallet is connected
            // url you provided to BothFather during the app creation process
            // to read more please read https://github.com/ton-community/flappy-bird#telegram-bot--telegram-web-app
            twaReturnUrl: URL_YOU_ASSIGNED_TO_YOUR_APP
        },
        contentResolver: {
            // some NFT marketplaces don't support CORS, so we need to use a proxy
            // you are able to use any format of the URL, %URL% will be replaced with the actual URL
            urlProxy: `${YOUR_BACKEND_URL}/${PROXY_URL}?url=%URL%`
        },
        // where in-game purchases come to
        merchant: {
            // in-game jetton purchases (FLAP)
            // use address you got running `assets-cli deploy-jetton`
            jettonAddress: FLAP_ADDRESS,
            // in-game TON purchases
            // use master wallet address you got running `assets-cli setup-env`
            tonAddress: MASTER_WALLET_ADDRESS
        }
    },

})
```
> To learn more about initialization options please read the [library documentation](https://github.com/ton-org/game-engines-sdk).

> To learn what `tonconnect-manifest.json` is please check ton-connect [manifest description](/v3/guidelines/ton-connect/guidelines/creating-manifest).

Next, we are ready to create a **Wallet Connect** button. Let’s create a UI scene in Phaser that will contain the **Connect** button:

```typescript
class UiScene extends Phaser.Scene {
    // receive gameFi instance via constructor
    private gameFi: GameFi;

    create() {
        this.button = this.gameFi.createConnectButton({
            scene: this,
            // you can calculate the position for the button in your UI scene
            x: 0,
            y: 0,
            button: {
                onError: (error) => {
                    console.error(error)
                }
                // other options, read the docs
            }
        })
    }
}
```

> Read how to create [connect button](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L82) and the [UI scene](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L45).

To monitor when a user connects or disconnects their wallet, use the following code snippet:
```typescript
function onWalletChange(wallet: Wallet | null) {
    if (wallet) {
        // wallet is ready to use
    } else {
        // wallet is disconnected
    }
}
const unsubscribe = gameFi.onWalletChange(onWalletChange)
```

> To learn about more complex scenarios please check out the full implementation of [wallet connect flow](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L16).

Read how [game UI managing](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L50) can be implemented.

Now that we have the user's wallet connected, we can move forward.

![Connect wallet button](/img/tutorials/gamefi-flappy/wallet-connect-button.png)
![Confirm wallet connection](/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png)
![Wallet is connected](/img/tutorials/gamefi-flappy/wallet-connected.png)


## Implementing achievements & rewards
To implement the achievements and reward system, we need to set up an endpoint that will be triggered each time a user plays.

### `/played` endpoint
We need to create an endpoint `/played ` which does the following:
- receives a request body containing the user’s wallet address and Telegram initial data, which is passed to the Mini App during launch. The initial data must be parsed to extract authentication details and verify that the user is sending the request on their own behalf.
- tracks and stores the number of games a user has played.
- checks whether this is the user’s first or fifth game. If so, it rewards the user with the corresponding SBT.
- rewards the user with 1 FLAP for each game played.

> Read [/played endpoint](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L197) code.

### Request `/played` endpoint
Every time the bird hits a pipe or falls, the client code must call the `/played` endpoint, passing the correct request body:
```typescript
async function submitPlayed(endpoint: string, walletAddress: string) {
    return await (await fetch(endpoint + '/played', {
        body: JSON.stringify({
            tg_data: (window as any).Telegram.WebApp.initData,
            wallet: walletAddress
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })).json()
}

const playedInfo = await submitPlayed('http://localhost:3001', wallet.account.address);
```

> Read [submitPlayer function](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/game-scene.ts#L10) code.

Let’s play for the first time and ensure we receive a FLAP token and an SBT. Click the Play button, fly through a pipe or two, then crash into a pipe. Everything works!

![Rewarded with token and SBT](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

Play four more times to earn the second SBT, then open your TON Space Wallet. Here are your collectibles:
![Achievements as SBT in Wallet](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## Implementing the game shop
To set up an in-game shop, we need two components. The first is an endpoint that provides information about users' purchases. The second is a global loop that monitors user transactions and assigns game properties to item owners.

### `/purchases` endpoint
The endpoint does the following:
- receive `auth` query parameter containing Telegram Mini App initial data.
- retrieves the items a user has purchased and responds with a list of those items.

> Read [/purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303) endpoint code.

### Purchases loop
o track user payments, we need to monitor transactions in the master wallet. Each transaction must include a message in the format `userId`:`itemId`. We will store the last processed transaction, retrieve only new ones, assign purchased properties to users based on `userId` and `itemId`, and update the last transaction hash. This process will run in an infinite loop.

> Read the [purchase loop](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110) code.

### Client side for the shop

On the client side, we have a **Shop** button.


![Enter shop button](/img/tutorials/gamefi-flappy/shop-enter-button.png)

When a user clicks this button, the **Shop Scene** opens. The shop contains a list of items available for purchase. Each item has a price and a Buy button. When a user clicks the Buy button, the purchase is processed.

Opening the **Shop Scene** will trigger the loading of purchased items and refresh the list every 10 seconds.

```typescript
// inside of fetchPurchases function
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// watch for purchases
setTimeout(() => { fetchPurchases() }, 10000)
```

> Read [showShop function](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191) code.

Now, we need to implement the purchase process. To do this, we will first create a GameFi SDK instance and then use the `buyWithJetton` method:
```typescript
gameFi.buyWithJetton({
    amount: BigInt(price),
    forwardAmount: BigInt(1),
    forwardPayload: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + itemId
});
```

![Game prop to purchase](/img/tutorials/gamefi-flappy/purchase-item.png)
![Purchase confirmation](/img/tutorials/gamefi-flappy/purchase-confirmation.png)
![Property is ready to use](/img/tutorials/gamefi-flappy/purchase-done.png)

It is also possible to pay with TON coins:
```typescript
import { toNano } from '@ton/phaser-sdk'

gameFi.buyWithTon({
    amount: toNano(0.5),
    comment: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + 1
});
```

## Afterword

That’s it for this tutorial! We explored the basic GameFi features, but the SDK offers additional functionality, such as player-to-player transfers and utilities for working with NFTs and collections. More features will be introduced in the future.

To learn about all available GameFi features, read the documentation for [ton-org/game-engines-sdk](https://github.com/ton-org/game-engines-sdk) and [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk).

Let us know your thoughts in [Discussions](https://github.com/ton-org/game-engines-sdk/discussions)!


The complete implementation is available in the [flappy-bird](https://github.com/ton-community/flappy-bird) repository.

<Feedback />




================================================
FILE: docs/v3/guidelines/dapps/tutorials/zero-knowledge-proofs.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/dapps/tutorials/zero-knowledge-proofs.md
================================================
import Feedback from '@site/src/components/Feedback';

# Building a simple ZK project on TON

## 👋 Introduction

**Zero-knowledge (ZK)** proofs are a fundamental cryptographic concept that allows **the prover** to prove to **the verifier** that a statement is true without revealing any additional information. ZK proofs are a powerful tool for building privacy-preserving systems and are widely used in applications such as anonymous payments, private messaging, and trustless bridges.



:::tip TVM upgrade 2023.07
Before June 2023, verifying cryptographic proofs on TON was not possible. Due to the complex computations required for the pairing algorithm, the TON Virtual Machine (TVM) needed to be upgraded with new opcodes to support proof verification. This functionality was added in the [June 2023 update](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade#bls12-381) and, at the time of writing, is only available on testnet.
:::

## 🦄 This tutorial will cover
1. The basics of zero-knowledge cryptography, with a focus on zk-SNARKs (zero-knowledge succinct non-interactive argument of knowledge).
2. How to initiate a trusted setup ceremony (using the Powers of Tau).
3. Writing and compiling a simple ZK circuit (using the Circom language).
4. Generating, deploying, and testing a FunC contract to verify a sample ZK proof.


## 🟥🟦 Explaining ZK-proofs with a color-focused example

Before diving into the technical details, let's start with a simple analogy. Imagine you want to prove to a color-blind person that two colors are different. We’ll use an interactive method to demonstrate this. Assume the color-blind person (the verifier) has two identical pieces of paper, one red 🟥 and one blue 🟦.

The verifier shows the prover one of two colored pieces of paper and asks them to remember the color. Then, the verifier hides the paper behind their back, either keeping the same color or swapping it for the other color. Afterward, they ask the prover whether the color has changed. If the prover correctly identifies whether the color has changed, it suggests that the prover can distinguish between the colors—or they were simply lucky, since there’s a 50% chance of guessing correctly.

If this process is repeated 10 times, and you answer correctly each time, the verifier can be ~99.90% confident that you truly see the colors. After 30 repetitions, their confidence level rises to 99.9999999%.

However, this method is interactive, meaning it requires multiple steps between the prover and verifier. In a decentralized application (DApp), having users send 30 transactions to prove a fact would be inefficient. This is why a non-interactive solution is needed—enter zk-SNARKs and zk-STARKs.

For this tutorial, we’ll focus on zk-SNARKs. However, you can learn more about zk-STARKs on the [StarkWare website](https://starkware.co/stark/), and find a comparison of zk-SNARKs vs. zk-STARKs in this [Panther Protocol blog post](https://blog.pantherprotocol.io/zk-snarks-vs-zk-starks-differences-in-zero-knowledge-technologies/).

### 🎯 Zk-SNARK: zero-knowledge succinct non-interactive argument of knowledge

A zk-SNARK is a non-interactive proof system where the prover submits a single proof to demonstrate that a statement is true. The verifier can then quickly validate the proof. Typically, working with a zk-SNARK involves three main steps:
* Performing a trusted setup using a [multi-party computation (MPC)](https://en.wikipedia.org/wiki/Secure_multi-party_computation) protocol to generate proving and verification keys (using Powers of TAU),
* Generating a proof using a prover key, public input, and secret input (witness),
* Verifying the proof.


Let’s set up our development environment and start coding!

## ⚙ Setting up the development environment

Follow these steps to begin:

1. Create a new project called "simple-zk" using [Blueprint](https://github.com/ton-org/blueprint) using Blueprint by running the following command, after that, enter a name for your contract (e.g. ZkSimple) and then select the first option (using an empty contract).
```bash 
npm create ton@latest simple-zk
```

2. Clone the [snarkjs repo](https://github.com/kroist/snarkjs) that is adjusted to support FunC contracts
```bash
git clone https://github.com/kroist/snarkjs.git
cd snarkjs
npm ci
cd ../simple-zk
```

3. Install the required libraries needed for ZkSNARKs
```bash
npm add --save-dev snarkjs ffjavascript
npm i -g circom
```

4. Modify the package.json file by adding the necessary dependencies. Note that some opcodes used in this tutorial are not yet available on the mainnet release.
```json
"overrides": {
    "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",
    "@ton-community/func-js": "0.6.3-tvmbeta.1"
}
```

5. Update the version of the @ton-community/sandbox to ensure compatibility with the latest [latest TVM updates](https://t.me/thetontech/56).
```bash
npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1
```

Great! Now we’re ready to start writing our first ZK project on TON!

We now have two main folders in our ZK project:
* `simple-zk` folder: contains the Blueprint template, where we’ll write our circuits, contracts, and tests.
* `snarkjs` folder: contains the snarkjs repository that we cloned in step 2.

## Circom circuit

First let's create a folder named `simple-zk/circuits`. Inside this folder, create a new file and add the following code::
```circom
template Multiplier() {
   signal private input a;
   signal private input b;
   //private input means that this input is not public and will not be revealed in the proof

   signal output c;

   c <== a*b;
 }

component main = Multiplier();
```

The circuit above defines a simple multiplier. Using this circuit, we can prove that we know two numbers (a and b) that multiply to produce a specific number (c)—without revealing the values of a and b themselves.

For more information about the Circom language, visit [this website](https://docs.circom.io/).

Next, we’ll create a folder to store our build files and move the necessary data there. While inside the `simple-zk` folder, run the following commands:
```bash
mkdir -p ./build/circuits
cd ./build/circuits
```

### 💪 Creating a trusted setup with Powers of TAU

Now, it’s time to establish a trusted setup using the [Powers of Tau](https://a16zcrypto.com/posts/article/on-chain-trusted-setup-ceremony/) method. This process may take a few minutes to complete. Let’s get started:
```bash
echo 'prepare phase1'
node ../../../snarkjs/build/cli.cjs powersoftau new bls12-381 14 pot14_0000.ptau -v
echo 'contribute phase1 first'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v -e="some random text"
echo 'contribute phase1 second'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0001.ptau pot14_0002.ptau --name="Second contribution" -v -e="some random text"
echo 'apply a random beacon'
node ../../../snarkjs/build/cli.cjs powersoftau beacon pot14_0002.ptau pot14_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
echo 'prepare phase2'
node ../../../snarkjs/build/cli.cjs powersoftau prepare phase2 pot14_beacon.ptau pot14_final.ptau -v
echo 'Verify the final ptau'
node ../../../snarkjs/build/cli.cjs powersoftau verify pot14_final.ptau
```

Once the process is complete, a file named pot14_final.ptau will be created inside the build/circuits folder. This file can be reused for generating future circuits.

:::caution Constraint size
If you plan to write a more complex circuit with additional constraints, you’ll need to generate a Powers of Tau (PTAU) setup using a larger parameter. 

You can remove the unnecessary files:
```bash
rm pot14_0000.ptau pot14_0001.ptau pot14_0002.ptau pot14_beacon.ptau
```
### 📜 Circuit compilation

To compile the circuit, run the following command from the `build/circuits` folder:
```bash
circom ../../circuits/test.circom --r1cs circuit.r1cs --wasm circuit.wasm --prime bls12381 --sym circuit.sym
```

After running this command, the compiled circuit will be available in `build/circuits/circuit.sym`, `build/circuits/circuit.r1cs`, and `build/circuits/circuit.wasm`.

:::info altbn-128 and bls12-381 curves
The altbn-128 and bls12-381 elliptic curves are currently supported by snarkjs. However, the [altbn-128](https://eips.ethereum.org/EIPS/eip-197) curve is only supported on Ethereum, whereas TON exclusively supports the bls12-381 curve.
:::

To check the constraint size of the circuit, run:

```bash
node ../../../snarkjs/build/cli.cjs r1cs info circuit.r1cs 
```

Therefore, the correct result should be:
```bash
[INFO]  snarkJS: Curve: bls12-381
[INFO]  snarkJS: # of Wires: 4
[INFO]  snarkJS: # of Constraints: 1
[INFO]  snarkJS: # of Private Inputs: 2
[INFO]  snarkJS: # of Public Inputs: 0
[INFO]  snarkJS: # of Labels: 4
[INFO]  snarkJS: # of Outputs: 1
```

Now we can generate the reference zkey by executing:
```bash
node ../../../snarkjs/build/cli.cjs zkey new circuit.r1cs pot14_final.ptau circuit_0000.zkey
```

Next, add a contribution to the zkey with the following command:
```bash
echo "some random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

Then, export the final zkey:
```bash
echo "another random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0001.zkey circuit_final.zkey
```

At this point, the final zkey is stored in `build/circuits/circuit_final.zkey` file. The zkey is then verified by entering the following:
```bash
node ../../../snarkjs/build/cli.cjs zkey verify circuit.r1cs pot14_final.ptau circuit_final.zkey
```

Finally, it's time to generate the verification key:
```bash
node ../../../snarkjs/build/cli.cjs zkey export verificationkey circuit_final.zkey verification_key.json
```

Then, remove unnecessary files to clean up the workspace:
```bash
rm circuit_0000.zkey circuit_0001.zkey
```


After conducting the above processes, the `build/circuits` folder should be displayed as follows: 
```
build
└── circuits
        ├── circuit_final.zkey
        ├── circuit.r1cs
        ├── circuit.sym
        ├── circuit.wasm
        ├── pot14_final.ptau
        └── verification_key.json

```

### ✅ Exporting the verifier contract

The final step in this section is to generate the FunC verifier contract, which will be used in our ZK project.
```bash
node ../../../snarkjs/build/cli.cjs zkey export funcverifier circuit_final.zkey ../../contracts/verifier.fc
``` 
Then the `verifier.fc` file will be generated in the `contracts` folder.

## 🚢 Deploying the verifier contract

Now, let's review the `contracts/verifier.fc` file step by step. This file contains the core logic required for ZK-SNARK verification.

```func
const slice IC0 = "b514a6870a13f33f07bc314cdad5d426c61c50b453316c241852089aada4a73a658d36124c4df0088f2cd8838731b971"s;
const slice IC1 = "8f9fdde28ca907af4acff24f772448a1fa906b1b51ba34f1086c97cd2c3ac7b5e0e143e4161258576d2a996c533d6078"s;

const slice vk_gamma_2 = "93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"s;
const slice vk_delta_2 = "97b0fdbc9553a62a79970134577d1b86f7da8937dd9f4d3d5ad33844eafb47096c99ee36d2eab4d58a1f5b8cc46faa3907e3f7b12cf45449278832eb4d902eed1d5f446e5df9f03e3ce70b6aea1d2497fd12ed91bd1d5b443821223dca2d19c7"s;
const slice vk_alpha_1 = "a3fa7b5f78f70fbd1874ffc2104f55e658211db8a938445b4a07bdedd966ec60090400413d81f0b6e7e9afac958abfea"s;
const slice vk_beta_2 = "b17e1924160eff0f027c872bc13ad3b60b2f5076585c8bce3e5ea86e3e46e9507f40c4600401bf5e88c7d6cceb05e8800712029d2eff22cbf071a5eadf166f266df75ad032648e8e421550f9e9b6c497b890a1609a349fbef9e61802fa7d9af5"s;
```

Above you can see the constants that verifier contracts must use to implement proof verification. These parameters can be found in the `build/circuits/verification_key.json` file.

```func
slice bls_g1_add(slice x, slice y) asm "BLS_G1_ADD";
slice bls_g1_neg(slice x) asm "BLS_G1_NEG";
slice bls_g1_multiexp(
        slice x1, int y1,
        int n
) asm "BLS_G1_MULTIEXP";
int bls_pairing(slice x1, slice y1, slice x2, slice y2, slice x3, slice y3, slice x4, slice y4, int n) asm "BLS_PAIRING";
```
The above lines are the new [TVM opcodes](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07#bls12-381) (BLS12-381) that allow pairing checks to be conducted on the TON Blockchain.

The load_data and save_data functions store and retrieve proof verification results (primarily for testing purposes).

```func
() load_data() impure {

    var ds = get_data().begin_parse();

    ctx_res = ds~load_uint(32);

    ds.end_parse();
}

() save_data() impure {
    set_data(
            begin_cell()
                    .store_uint(ctx_res, 32)
                    .end_cell()
    );
}
```

Next there are several simple util functions. These functions process and load proof data sent to the contract.
```func
(slice, slice) load_p1(slice body) impure {
    ...
}

(slice, slice) load_p2(slice body) impure {
    ...
}

(slice, int) load_newint(slice body) impure {
    ...
}
```

And the last part is the groth16Verify function that verifies the validity of the proof sent to the contract.
```func
() groth16Verify(
        slice pi_a,
        slice pi_b,
        slice pi_c,

        int pubInput0

) impure {

    slice cpub = bls_g1_multiexp(

            IC1, pubInput0,

            1
    );


    cpub = bls_g1_add(cpub, IC0);
    slice pi_a_neg = bls_g1_neg(pi_a);
    int a = bls_pairing(
            cpub, vk_gamma_2,
            pi_a_neg, pi_b,
            pi_c, vk_delta_2,
            vk_alpha_1, vk_beta_2,
            4);
    ;; ctx_res = a;
    if (a == 0) {
        ctx_res = 0;
    } else {
        ctx_res = 1;
    }
    save_data();
}
```

Next, we need to edit two files inside the `wrappers` folder. The first file that needs our attention is the `ZkSimple.compile.ts` file (If a different contract name was chosen in Step 1, update the filename accordingly. ). We need to add `verifier.fc` to the list of contracts that must be compiled.

```ts
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/verifier.fc'], // <-- here we put the path to our contract
};
```

The other file that needs attention is `ZkSimple.ts`. We need to first add the `verify` opcode to the `Opcodes` enum: 

```ts
export const Opcodes = {
  verify: 0x3b3cca17,
};
```

Next, add the `sendVerify` function to the `ZkSimple` class. This function sends the proof to the contract for verification::
```ts
async sendVerify(
  provider: ContractProvider,
  via: Sender,
  opts: {
  pi_a: Buffer;
  pi_b: Buffer;
  pi_c: Buffer;
  pubInputs: bigint[];
  value: bigint;
  queryID?: number;
}
) {
  await provider.internal(via, {
    value: opts.value,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    body: beginCell()
      .storeUint(Opcodes.verify, 32)
      .storeUint(opts.queryID ?? 0, 64)
      .storeRef(
        beginCell()
          .storeBuffer(opts.pi_a)
          .storeRef(
            beginCell()
              .storeBuffer(opts.pi_b)
              .storeRef(
                beginCell()
                  .storeBuffer(opts.pi_c)
                  .storeRef(
                    this.cellFromInputList(opts.pubInputs)
                  )
              )
          )
      )
      .endCell(),
  });
}
```

Next, we’ll add the `cellFromInputList` function to the `ZkSimple` class. This function converts public inputs into a format compatible with the contract:
```ts
 cellFromInputList(list: bigint[]) : Cell {
  var builder = beginCell();
  builder.storeUint(list[0], 256);
  if (list.length > 1) {
    builder.storeRef(
      this.cellFromInputList(list.slice(1))
    );
  }
  return builder.endCell()
}
```

Finally, add the `getRes` function, which retrieves the verification result:
```ts
 async getRes(provider: ContractProvider) {
  const result = await provider.get('get_res', []);
  return result.stack.readNumber();
}
```

Now, we can run the required tests before deploying the contract. The contract must successfully pass all tests before deployment. To run the tests, execute the following command from the root of the `simple-zk` folder:
```bash
npx blueprint test
```

## 🧑‍💻 Writing tests for the verifier

Let's open the `ZkSimple.spec.ts` file inside the `tests` older and write a test for the verify function. The test is conducted as follows:
```ts
describe('ZkSimple', () => {
  let code: Cell;

  beforeAll(async () => {
    code = await compile('ZkSimple');
  });

  let blockchain: Blockchain;
  let zkSimple: SandboxContract<ZkSimple>;

  beforeEach(async () => {
    // deploy contract
  });

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and zkSimple are ready to use
  });

  it('should verify', async () => {
    // todo write the test
  });
});
```

First, we need to import several packages that will be used in the test:
```ts
import * as snarkjs from "snarkjs";
import path from "path";
import {buildBls12381, utils} from "ffjavascript";
const {unstringifyBigInts} = utils;

* If you run the test, the result will be a TypeScript error, because we don't have a declaration file for the module 'snarkjs' & ffjavascript. This can be addressed by editing the `tsconfig.json` file in the root of the `simple-zk` folder. We'll need to change the _**strict**_ option to **_false_** in that file
* 
We'll also need to import the `circuit.wasm` and `circuit_final.zkey` files which will be used to generate the proof to send to the contract. 
```ts
const wasmPath = path.join(__dirname, "../build/circuits", "circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits", "circuit_final.zkey");
```

Let's fill the `should verify` test. We first need to generate a proof. The proof will later be sent to the contract for verification.
```ts
it('should verify', async () => {
  // proof generation
  let input = {
    "a": "123",
    "b": "456",
  }
  let {proof, publicSignals} = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);
  let curve = await buildBls12381();
  let proofProc = unstringifyBigInts(proof);
  var pi_aS = g1Compressed(curve, proofProc.pi_a);
  var pi_bS = g2Compressed(curve, proofProc.pi_b);
  var pi_cS = g1Compressed(curve, proofProc.pi_c);
  var pi_a = Buffer.from(pi_aS, "hex");
  var pi_b = Buffer.from(pi_bS, "hex");
  var pi_c = Buffer.from(pi_cS, "hex");
  
  // todo send the proof to the contract
});
```

To carry out the next step it is necessary to define the `g1Compressed`, `g2Compressed`, and `toHexString` functions. These functions will convert the cryptographic proof into the format expected by the contract.

```ts
function g1Compressed(curve, p1Raw) {
  let p1 = curve.G1.fromObject(p1Raw);

  let buff = new Uint8Array(48);
  curve.G1.toRprCompressed(buff, 0, p1);
  // convert from ffjavascript to blst format
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function g2Compressed(curve, p2Raw) {
  let p2 = curve.G2.fromObject(p2Raw);

  let buff = new Uint8Array(96);
  curve.G2.toRprCompressed(buff, 0, p2);
  // convert from ffjavascript to blst format
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte: any) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join("");
}
```

Once we have the proof formatted correctly, we can send it to the contract using the `sendVerify` function. The `sendVerify` function expects the following five parameters:  `pi_a`, `pi_b`, `pi_c`, `pubInputs`, and `value`.
```ts
it('should verify', async () => {
  // proof generation
  
  
  // send the proof to the contract
  const verifier = await blockchain.treasury('verifier');
  const verifyResult = await zkSimple.sendVerify(verifier.getSender(), {
    pi_a: pi_a,
    pi_b: pi_b,
    pi_c: pi_c,
    pubInputs: publicSignals,
    value: toNano('0.15'), // 0.15 TON for fee
  });
  expect(verifyResult.transactions).toHaveTransaction({
    from: verifier.address,
    to: zkSimple.address,
    success: true,
  });

  const res = await zkSimple.getRes();

  expect(res).not.toEqual(0); // check proof result

  return;
  
});
```

Are you ready to verify your first proof on TON Blockchain? To kick things off, let's run the Blueprint test by executing the following command in the terminal:
```bash
npx blueprint test
```

The result should be as follows:
```bash
 PASS  tests/ZkSimple.spec.ts
  ZkSimple
    ✓ should deploy (857 ms)
    ✓ should verify (1613 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        4.335 s, estimated 5 s
Ran all test suites.
```

In order to check the repo that contains the code from this tutorial, visit [here](https://github.com/SaberDoTcodeR/zk-ton-doc).

## 🏁 Conclusion 

In this tutorial, you have learned:

* The fundamentals of zero-knowledge proofs, specifically ZK-SNARKs.
* How to write and compile circom circuits.
* How to use MPC and the Powers of TAU to generate verification keys.
* How to work with Snarkjs to export a FunC verifier.
* How to use Blueprint for deploying a verifier and writing tests.

Note: This tutorial covered a basic ZK use case, but zero-knowledge proofs can power many advanced applications across different industries, including:

* private voting systems,
* private lottery systems,
* private auction systems,
* private transactions (for Toncoin or jettons).

If you have any questions or run into any errors, feel free to reach out to the author: [@saber_coder](https://t.me/saber_coder)


## 📌 References

- [TVM June 2023 upgrade](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade)
- [SnarkJs](https://github.com/iden3/snarkjs)
- [SnarkJs FunC fork](https://github.com/kroist/snarkjs)
- [Sample ZK on TON](https://github.com/SaberDoTcodeR/ton-zk-verifier)
- [Blueprint](https://github.com/ton-org/blueprint)


## 📖 See also

- [TON trustless bridge EVM contracts](https://github.com/ton-blockchain/ton-trustless-bridge-evm-contracts)
- [Tonnel network: privacy protocol on TON](http://github.com/saberdotcoder/tonnel-network)
- [TVM challenge](https://blog.ton.org/tvm-challenge-is-here-with-over-54-000-in-rewards)


## 📬 About the author 
- _Saber_ on [Telegram](https://t.me/saber_coder), [GitHub](https://github.com/saberdotcoder), and [LinkedIn](https://www.linkedin.com/in/szafarpoor).

<Feedback />




================================================
FILE: docs/v3/guidelines/get-started-with-ton.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/get-started-with-ton.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';
import ConceptImage from '@site/src/components/conceptImage'
import Player from '@site/src/components/player'

# Get started with TON

Discover the speed, reliability, and core principles of asynchronous thinking by building your first application on the TON blockchain — from scratch.


:::tip newcomer-friendly guide
This is the perfect place to start if you're entirely new to programming.
:::

This learning path is split into __5__ beginner-friendly modules and takes approximately __45 minutes__.

## What you will learn

In this step-by-step guide, you'll learn how to create and interact with the TON blockchain applications using JavaScript. While it's possible to figure it out independently, this path offers a faster, smoother experience — especially if you're starting.

Here's what you'll do:

1. Create your TON wallet using Tonkeeper.
2. Use a Testnet faucet to top up your wallet with test tokens.
3. Learn key smart contract concepts like **addresses** and **cells**.
4. Interact with the TON blockchain using the TypeScript SDK and an API provider.
5. Compile and send your first transaction using the NFT Miner console app.


_You're about to mine your first NFT rocket achievement!_
As one of the first TON explorers, you'll complete a Proof-of-work smart contract and unlock a hidden reward for your wallet. Let's dive in:

<div style={{width: '100%', maxWidth:'250pt',  textAlign: 'center', margin: '0 auto' }}>
  <video width={'300'} style={{width: '100%', maxWidth:'250pt',  borderRadius: '10pt', margin: '15pt auto' }} muted={true} autoPlay={true} loop={true}>
    <source src="/files/onboarding-nft.mp4" type="video/mp4" />
Your browser does not support the video tag.
  </video>
</div>

Our goal for today is to mine an NFT! This achievement will stay with you *forever*.

Finally, you can mine this NFT achievement even in the Mainnet. (_it costs only 0,05 TON!_).

### Video tutorial

For a smoother walkthrough, check out this carefully crafted video tutorial by _Vladimir Alefman_.

<Player url="https://youtu.be/mgVUY04I_3A" />


### Mining on TON Blockchain

Today, we are going to teach our prospective builders how to mine on TON Blockchain. This experience helps you understand the significance of mining and why Bitcoin mining helped revolutionize the industry.

Although the proof-of-work giver smart contract framework, which defined the initial mining process that laid the foundation for TON, was completed at launch, the last TON was mined in June 2022 to conclude TON's proof-of-work (PoW) token distribution mechanism. That said, with our recent transition to proof-of-stake (PoS), the era of staking on TON has just begun.

* [Dive deeper into our economic model and mining on TON](https://ton.org/mining)


Now, let’s focus on the first steps to becoming a **TON Developer** and learn how to mine an NFT on TON! Below is an example of what we're aiming to create.

<div style={{ width: '100%', textAlign: 'center', margin: '0 auto' }}>
  <video style={{ width: '100%', borderRadius: '10pt', margin: '15pt auto', maxWidth: '90%' }} muted={true} autoPlay={true}
         loop={true}>
    <source src="/files/onboarding.mp4" type="video/mp4" />

Your browser does not support the video tag.

  </video>
</div>

If we stay focused on the task at hand, we can create a miner in about half an hour.

## Getting started

To get started, all developers will make use of the following components:

* __Wallet__: You need a non-custodial wallet to store an NFT in Testnet mode.
* __Repository__:  We’ll use a ready-made template designed specifically for you.
* __Developer Environment__:  Developers need to determine whether they want to mine in a local or cloud environment.

### Download and create a wallet

First, you need a non-custodial wallet to receive and store your TON. For this guide, we are using Tonkeeper.
You need to enable Testnet mode within the wallet to receive Testnet TON coins. These tokens will be used later to send a final minting transaction to the smart contract.

:::info
With a non-custodial wallet, the user owns the wallet and holds the private key themselves.
:::

To download and create a TON wallet, follow these simple steps:

1. Install the Tonkeeper app on your smartphone. It can be downloaded [here](https://Tonkeeper.com/).
2. Next, you need to [enable test mode](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper-test-environment) within Tonkeeper.

Easy! Let's go to the development now.

### Project setup

We use a boilerplate to simplify your life and skip routine low-level tasks.

:::tip
Note that you need to [sign in](https://github.com/login) to GitHub for further work.
:::

Please use the [ton-onboarding-challenge](https://github.com/ton-community/ton-onboarding-challenge) template to create your project by clicking the “Use this template” button and selecting the “Create a new repository” tab as shown below:


<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/1.png?raw=true',
        dark: '/img/tutorials/onboarding/1-dark.png?raw=true',
    }}
/>
<br></br>

After completing this step, you'll have access to a highly performant repository that can serve as your miner's core. Congratulations!

### Development environments

The next step is to choose which developer environment best suits your needs, experience level, and overall skill set. As you can see, this process can be carried out using either a cloud-based or local environment. Developing on the cloud is often considered simpler and easier to get started. Below, we’ll outline the steps required for both approaches.

:::tip
Ensure you have opened the repository in your GitHub profile generated from the template in the previous step.
:::


<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/3.png?raw=true',
        dark: '/img/tutorials/onboarding/3-dark.png?raw=true',
    }}
/>
<br></br>

#### Local and cloud development environments

* Using a Javascript IDE can be challenging for users unfamiliar with it, especially if your computer and tooling systems are not configured for this purpose.

* However, if you're familiar with NodeJS and Git and know how to work with `npm`, you may find it more comfortable to use a **local environment**.

#### Cloud codespaces

If you choose the cloud development environment, it's easy to get started by first selecting the _Code_ tab and then by clicking on the _Create codespace on master_ button within the GitHub repository shown below:


<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/2.png?raw=true',
        dark: '/img/tutorials/onboarding/2-dark.png?raw=true',
    }}
/>
<br></br>

After completing this step, GitHub will create a special cloud workspace that allows you to access the VSCode Online IDE (Visual Studio Code Online Integrated Development Environment).

Once access is granted (the codespace typically starts in about 30 seconds), you have everything required to begin without installing Git, Node.js, or other developer tools.

#### Local development environments

To set up a local development environment, you require access to these three essential tools:

- **Git**: Git is an essential tool for every developer working with repositories. It can be downloaded [here](https://git-scm.com/downloads).
- **NodeJS**: Node.js is the JavaScript and TypeScript runtime environment typically used for application development on TON. It can be downloaded [here](https://nodejs.org/en/download/).
- **JavaScript IDE**. JavaScript IDE’s are typically used for development within local development environments. An example of this case is Visual Studio Code ([VSCode](https://code.visualstudio.com/download)).

To get started, you need to clone your GitHub repository boilerplate and open the correct repository in your Integrated Development Environment (IDE).


#### Running scripts

In this guide, you'll need to run TypeScript scripts. All commands, such as running scripts or installing modules, are executed through the command line, which is located in the IDE's Terminal workspace, which is typically found at the bottom of the IDE.

For example, in the Cloud Codespaces, you should open the Terminal workspace if it is not already open:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/6.png?raw=true',
        dark: '/img/tutorials/onboarding/6-dark.png?raw=true',
    }}
/>
<br></br><br></br>

Enter commands in this window and execute them with _Enter_:


<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/4.png?raw=true',
        dark: '/img/tutorials/onboarding/4-dark.png?raw=true',
    }}
/>
<br></br><br></br>

The terminal is also available as a separate application. Please choose the appropriate version based on your IDE and OS.

Great! After these steps, you're ready to get deeper into TON Blockchain secrets.

## Connect to TON

Okay, what do you need to connect to TON Blockchain?

* __Smart contract address__ as a point of destination. We aim to mine an NFT from the _proof-of-work smart contract_, so we need an address to determine the current mining complexity.
* __API provider__ to make requests to TON Blockchain. TON has multiple [API types](/v3/guidelines/dapps/apis-sdks/api-types) for different purposes. We will use the testnet version of [toncenter.com](https://toncenter.com/) API.
* __JavaScript SDK__: a JavaScript SDK (recall that an SDK is a Software Development Kit) is needed to parse the smart contract address used and prepare it to create an API request. To better understand TON addresses and why they need to be parsed to carry out this process, please see this [resource](/v3/documentation/smart-contracts/addresses) to understand why we should parse it. To carry out this procedure, we use [`@ton/ton`](https://github.com/ton-org/ton).

In the next section, we describe how users send their initial requests to TON Blockchain using the TON Center API and `@ton/ton` to receive data from the PoW smart contract.

### Smart contract addresses

For the miner to work correctly, we need to add two different smart contract address types. These include:

1. __Wallet address__: a wallet address is required for the miner to receive their mining reward (in this case, we must use the [Tonkeeper Testnet mode](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper-test-environment)).
2. __Collection address__: a collection address is required to act as a smart contract to correctly mine an NFT (to carry out this process, copy the NFT collection address under the TON onboarding challenge collection name from the [Getgems website](https://testnet.getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX)).

Next, we open the `./scripts/mine.ts` file in your miner and create a `mine()` function composed of initial constants as follows:

```ts title="./scripts/mine.ts"
import {Address} from '@ton/ton';

const walletAddress = Address.parse('YOUR_WALLET_ADDRESS');
const collectionAddress = Address.parse('COLLECTION_ADDRESS');

async function mine () {


}

mine();
```

#### Using the async mine() function

Later, when creating a TON NFT Miner, several requests will be executed to the public API to relay responses to the correct code string in exchange for the desired instructions. Leveraging the async/await function dramatically improves code simplicity.

#### Address parsing

On TON, smart contract addresses come in different forms that employ numerous flag types. In this context specifically, we use the _user-friendly address form_. If you are curious to learn more about the different smart contract address types, feel free to check out this additional [resource](/v3/documentation/smart-contracts/addresses) in our documentation.

For the miner to work correctly, we need to add two different smart contract address types. These include:

The `Address.parse()` method located in the `@ton/ton` SDK allows the developer to create an address object to convert addresses from one form to another in a simplified manner.

### Connect to an API provider

In this step, we'll connect with TON via TON Center, which is hosted on the toncenter.com API provider, using specific commands in the script.

The simplest way to do it is by specifying the Testnet endpoint `https://testnet.toncenter.com/api/v2/jsonRPC`.

<br></br>

<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/5.png?raw=true',
        dark: '/img/tutorials/onboarding/5-dark.png?raw=true',
    }}
/>

<br></br>

We add `client` and `endpoint` in the `./scripts/mine.ts` script using _TonClient_ and Testnet TON Center endpoint `https://testnet.toncenter.com/api/v2/jsonRPC`:

```ts title="./scripts/mine.ts"
import {Address, TonClient} from "@ton/ton"

// ... previous code

// specify endpoint for Testnet
const endpoint = "https://testnet.toncenter.com/api/v2/jsonRPC"

// initialize ton library
const client = new TonClient({ endpoint });
```

:::info what to do in production?
Using an RPC node provider or running your own ton-http-api instance is better for that. Read more at the [TON Center API page](/v3/guidelines/dapps/apis-sdks/ton-http-apis).
:::

### Receiving mining data from TON Blockchain

Finally, the next step in the process is to retrieve specific mining data from TON Blockchain.

By consulting the [README file](https://github.com/ton-community/ton-onboarding-challenge#mining-process-deep-dive) needed to complete the TON onboarding challenge, the latest TON mining data is obtained by running the `get_mining_data` method. Once initiated, the result will be as follows:

As a result, we should receive an array with these fields:

```bash
(
	int pow_complexity,
	int last_success,
	int seed,
	int target_delta,
	int min_cpl,
	int max_cpl
)
```

#### Running smart contract get methods on TON

Using `@ton/ton` is possible to run the `client.runMethod(SMART_CONTRACT_ADDRESS, METHOD)` function.
Running this code will result in the following console output:

```ts title="./scripts/mine.ts"
// ... previous code

const miningData = await client.runMethod(collectionAddress, 'get_mining_data');

console.log(miningData.stack);
```

Furthermore, to run the script, it is necessary to enter the following command [in the terminal](/v3/guidelines/get-started-with-ton#running-scripts):

```bash
npm run start:script
```

:::tip
To avoid unexpected issues, ensure you have finalized all previous steps, including inputting contract addresses.
:::

Good! As long as the above processes are executed correctly, a successful connection to the API will be achieved, and the necessary data will be displayed in the console. The correct console output should be initiated as follows:

```bash
TupleReader {
  items: [
    {
      type: 'int',
      value: 7237005577332262213973186563042994240829374041602535252466099000494570602496n
    },
    { type: 'int', value: 1730818693n },
    { type: 'int', value: 281644526620911853868912633959724884177n },
    { type: 'int', value: 30n },
    { type: 'int', value: 171n },
    { type: 'int', value: 252n }
  ]
}

```

The output above shows data on executing a process with a collection of numerical (_int_) values. The current focus is to convert this numerical output into a more practical format.

We need to convert the hex output to something _useful_.

:::info GAS PARAMETERS ON TON
__Warning__: Though this information is highly complex and __not necessary for this tutorial__ if you're interested in understanding the complex technical aspects of TON, consider using these resources:
1. To better understand how TON Virtual Machine (TVM) operates and _how TON processes transactions_, check out [TVM overview section](/v3/documentation/tvm/tvm-overview).
2. Secondly, if you want to learn more about how transaction and gas fees work on TON, consider diving into [this section](/v3/documentation/smart-contracts/transaction-fees/fees) of our documentation.
3. Finally, to better understand the exact gas values needed to carry out TVM instructions, see [this section](/v3/documentation/tvm/instructions#gas-prices) of our documentation.
:::

Now, let's return to the tutorial!

#### Numerical mining data in a user-friendly format

In the section above, we discuss numerical (_int_) values needed to receive mining data. Before processing, further received data must be converted into a more easily understandable and usable format.

As it is clear when examining the given output, numbers can be substantial. We will use `bigint` (the big number implementation in JavaScript) to deal with them. `BigInt` works with large numbers that are more significant than the maximum `number` integer values. Let’s use this example to get a better idea of the _Mining Data_ required for this process:

```ts title="./scripts/mine.ts"
// ... previous code

const { stack } = miningData;

const complexity = stack.readBigNumber();
const lastSuccess = stack.readBigNumber();
const seed = stack.readBigNumber();
const targetDelta = stack.readBigNumber();
const minCpl = stack.readBigNumber();
const maxCpl = stack.readBigNumber();

console.log({ complexity, lastSuccess, seed, targetDelta, minCpl, maxCpl });
```

As shown above, the different components of _miningData_ use stack-based numbers for different parameters, which will be introduced in the section below. To achieve the desired value outcome, we used the `stack.readBigNumber()` function to read a `bigint` from the stack.

After this process is complete, we may print values to the console. Try to run the script again by running the command:

```bash
npm run start:script
```

Here is an example output:

```bash
{
  complexity: 7237005577332262213973186563042994240829374041602535252466099000494570602496n,
  lastSuccess: 1730818693n,
  seed: 281644526620911853868912633959724884177n,
  targetDelta: 30n,
  minCpl: 171n,
  maxCpl: 252n
}
```

Let's cover the Mining Data command that translates different data parameters when programming mining data into TON Blockchain. These include:

* `complexity` is the most important number for miners. It's a Proof-of-Work complexity for the values. You're successful _if the final hash is less than complexity_.
* `lastSuccess` is a [unix timestamp](https://www.unixtimestamp.com/) date and time representation that keeps track of the last mining transaction on TON. Each time the last_success metric changes, it's necessary to rerun the miner because the seed also changes during this process.
* `seed` denotes a unique value a smart contract generates to calculate the desired hash. To better understand this process and learn more about how the seed changes and why, look at the project files folder using the `ctx_seed` keyword (Ctrl+F with the keyword `ctx_seed`).
* `targetDelta`, `minCpl` and `maxCpl` won't be used in our tutorial. But you can always read more about how they are used in smart contracts to calculate proof-of-work complexity in the source files of the collection in your project.

Now that we understand the parameters discussed above, we have the values(`complexity`, `lastSuccess`, `seed`) that we will use in our NFT Miner in the next chapter.

## Prepare an NFT miner

Hey, you're doing a great job!

After connecting to TON and retrieving the necessary mining data from the blockchain to create an NFT miner, let's focus on the next steps in this process to achieve our goal.

In this chapter, you will _prepare a mining message_ and _calculate a hash_ of the message. After that, you will _find a hash that's less(`<`) than the complexity_ we got from the smart contract.

That is what a miner is! Simple, isn't it?

### Preparing mining messages

First, we must prepare a mining message by ensuring the correct parameters to ensure this process's validity and data integrity.

Thankfully, the [README file](https://github.com/ton-community/ton-onboarding-challenge#mining-process-deep-dive) allows us to retrieve the correct guidelines to achieve this goal. As you can see, the above README file comprises a table with specific fields and cell types (titled "Layout of proof of work cell') to help achieve our desired result.

:::info What are cells?
Cells are data storage structures on TON that fulfill numerous purposes, including increasing network scalability and smart contract transaction speeds. We won't get into specifics here, but if you're interested in understanding the complexity of cells and how they work, consider diving into [this](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) section of our documentation.
:::

Fortunately, all the data structures used in this tutorial are already written in TypeScript. Use the `MineMessageParams` object from _NftGiver.data.ts_ to build a transaction with _Queries_:

```ts title="./scripts/mine.ts"
import { unixNow } from '../lib/utils';
import { MineMessageParams, Queries } from '../wrappers/NftGiver';

// ... previous code

const mineParams: MineMessageParams = {
    expire: unixNow() + 300, // 5 min is enough to make a transaction
    mintTo: walletAddress, // your wallet
    data1: 0n, // temp variable to increment in the miner
    seed // unique seed from get_mining_data
};

let msg = Queries.mine(mineParams); // transaction builder
```

Probably you have a question: where are the _op_ and _data2_ from the [table](https://github.com/ton-community/ton-onboarding-challenge#mining-process-deep-dive)?

* In the table, the numerical value of data1 must equal that of data2. To omit the filling of the data2 value, the transaction builder performs a low-level process (see Queries.mine() sources).
* Because the `op` classification is always constant, it is already implemented in transaction builder _Queries_ and in _OpCodes_. You can find the opcode by going to the source code of the `mine()` method.

:::tip
Though it may be interesting to check out the source code (`../wrappers/NftGiver.ts`), but it is unnecessary.
:::

### Creating TON NFT miners

Now that we have completed the process to prepare messages for our TON miner, let’s jump into the initial process to create a miner.
First, let’s consider this line of code:

```ts
let msg = Queries.mine(mineParams);
```

Above, we compiled a `msg` value. The idea of mining is to find a hash `msg.hash()` that will be less than `complexity` from the last received _get_mining_data()_. We can increment `data1` as many times as we need.

The pure miner will continue to run indefinitely if `msg.hash()` is bigger than `complexity` (message hash is larger than PoW mining complexity).

Here is an example of the code running as it relates to `BigInt` in TypeScript:

```ts title="./scripts/mine.ts"
let msg = Queries.mine(mineParams);

const bufferToBigint = (buffer: Buffer) => BigInt('0x' + buffer.toString('hex'));

while (bufferToBigint(msg.hash()) > complexity) {
    mineParams.expire = unixNow() + 300;
    mineParams.data1 += 1n;
    msg = Queries.mine(mineParams);
}

console.log('Yoo-hoo, you found something!');
```

We convert the hash from the `msg.hash()` to `bigint `with the `bufferToBigint()` function. This is done to use this hash in comparison with `complexity`.

Though the miner will work properly after completing the above steps, it will have a visually unappealing appearance (try `npm run start:script`). Therefore, we must address this issue. Let’s jump in.

#### Improving TON miner appearance

We want to make the miner look sexy now! How do we do it?

Just follow me, my friend, follow me.

To achieve our goal, we’ll add these commands:

```ts title="./scripts/mine.ts"
let msg = Queries.mine(mineParams); // transaction builder
let progress = 0;

const bufferToBigint = (buffer: Buffer) => BigInt('0x' + buffer.toString('hex'));

while (bufferToBigint(msg.hash()) > complexity) {
    console.clear()
    console.log(`Mining started: please, wait for 30-60 seconds to mine your NFT!`)
    console.log()
    console.log(`⛏ Mined ${progress} hashes! Last: `, bufferToBigint(msg.hash()))

    mineParams.expire = unixNow() + 300;
    mineParams.data1 += 1n;
    msg = Queries.mine(mineParams);
}

console.log()
console.log('💎 Mission completed: msg_hash less than pow_complexity found!');
console.log()
console.log('msg_hash:       ', bufferToBigint(msg.hash()))
console.log('pow_complexity: ', complexity)
console.log('msg_hash < pow_complexity: ', bufferToBigint(msg.hash()) < complexity);

return msg;
```

Just check it out! Let’s execute the command:


```bash
npm run start:script
```

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/tutorials/onboarding/7.png?raw=true',
        dark: '/img/tutorials/onboarding/7-dark.png?raw=true',
    }}
/>
<br></br>

_Cool, isn't it?_

After executing these commands correctly, we'll have a visually appealing NFT miner. In the next section, we'll focus on connecting a wallet to the miner to create a payment channel that accepts and receives transactions from TON Blockchain.

## Prepare a transaction

Next, we'll outline the steps to compile a message and send it to the blockchain with your [Tonkeeper wallet](https://Tonkeeper.com/).
The upcoming steps will guide you in completing the process of __mining an NFT__ on TON.

#### Top up wallet balance via the token faucet

We need to acquire some TON Testnet tokens to proceed to the next step. This can be achieved using the Testnet [faucet found here](https://t.me/testgiver_ton_bot).

### Leverage Blueprint transaction opportunities

To ensure that the NFT mining process is carried out correctly and that the user can store their NFT properly, we will use [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript) to simultaneously interact with TON Blockchain and the Tonkeeper wallet.

To achieve this goal, we'll use the standard `run()` function to run to the creation of the transaction and send it:
```ts title="./scripts/mine.ts"
import { toNano } from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';

async function mine() {
  // code from previous steps
}

export async function run(provider: NetworkProvider) {
    // Do not forget to return `msg` from `mine()` function
    const msg = await mine();

    await provider.sender().send({
        to: collectionAddress,
        value: toNano(0.05),
        body: msg
    });
}
```

Let’s run the above script to send transaction:

```bash
npm start
```

Note that we use `npm start` instead of `npm run start:script`. This is because we need to leverage the advantages of the blueprint (under the hood, `blueprint run` is called).

After running this command, answer the questions as shown below to connect your Tonkeeper wallet:

```
? Which network do you want to use?
> testnet
? Which wallet are you using?
> TON Connect compatible mobile wallet (example: Tonkeeper)
? Choose your wallet (Use arrow keys)
> Tonkeeper
```

Scan the QR code shown in the terminal with your Tonkeeper wallet to establish a connection; no transaction has been sent yet.
Once connected, confirm the transaction in Tonkeeper.

Do you sense the _experience_ in the air? That's you on your way to becoming a TON developer.

## Mine NFT with a wallet

There are two main ways to mine an NFT on TON:

* [Simple: NFT Testnet Mining](/v3/guidelines/get-started-with-ton#simple-nft-testnet-mining)
* [Genuine: NFT Mainnet Mining](/v3/guidelines/get-started-with-ton#genuine-nft-mainnet-mining)

### Simple: NFT Testnet mining

Below are the steps needed to initiate your first Testnet transaction to mine your NFT:

1. Activate [Testnet mode within your Tonkeeper wallet](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper-test-environment)
2. Input our Testnet wallet address from Tonkeeper into the `walletAddress` variable in the `./scripts/mine.ts`.
3. Input address of the [NFT collection from Testnet](https://testnet.getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX) into `collectionAddress` variable in the `./scripts/mine.ts`.

#### Mine a Testnet NFT rocket

To successfully mine an NFT rocket on Testnet, it is necessary to follow these steps:

1. _Open_ the Tonkeeper wallet on your phone (it should hold some newly received TON Testnet tokens).
2. _Select_ scan mode in the wallet to scan the QR code.
3. _Run_ your miner to acquire the correct hash (this process takes between 30 and 60 seconds).
4. _Follow_ the steps in the Blueprint dialogue.
5. _Scan_ the generated QR code from the miner.
6. _Confirm_ the transaction in your Tonkeeper wallet.

:::tip final tip
Because other developers may be carrying out the same process in an attempt to mine their own NFT, you may need to try the process a couple of times to succeed, as another user could mine the next NFT available right before you.
:::

Soon after initiating this process, you will have successfully mined your first NFT on TON, and it should appear in your Tonkeeper wallet.

![](/img/tutorials/onboarding/8.svg)

Welcome aboard, __a true TON Developer__! You did it.

### Genuine: NFT Mainnet mining

Hey! For those who wish to mine an NFT on TON Mainnet, these instructions should be followed:

1. You have activated _Mainnet_ mode in your Tonkeeper (it should hold at least 0.1 TON).
2. Input our _Mainnet_ wallet address from Tonkeeper into the `walletAddress` variable in the `./scripts/mine.ts`
3. Input address of the [NFT collection from the Mainnet](https://getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX) into `collectionAddress` variable in the `./scripts/mine.ts`
4. Replace __endpoint__ to the _Mainnet_:

```ts title="./scripts/mine.ts"
// specify endpoint for Mainnet
const endpoint = "https://toncenter.com/api/v2/jsonRPC"
```

#### Mine a Mainnet NFT rocket

As we outlined in the Testnet NFT rocket mining process, to successfully mine an NFT rocket on the Mainnet, it is necessary to follow these steps:

1. _Open_ the Tonkeeper wallet on your phone (remember, it should hold some TON tokens).
2. _Select_ scan mode in the wallet to scan the QR code.
3. _Run_ your miner to acquire the correct hash (this process takes between 30 and 60 seconds).
4. _Follow_ the steps in the Blueprint dialogue.
5. _Scan_ the generated QR code from the miner.
6. _Confirm_ the transaction in your Tonkeeper wallet.

:::tip final tip
Because other developers may be carrying out the same process to mine their own NFT, you may have to try the process a couple of times to be successful (as another user could mine the next NFT available right before you).
:::

After some time, you will have __mined your NFT__ and become a TON Developer in TON Blockchain. The ritual is complete. Look at your NFT in Tonkeeper.

<div style={{ width: '100%', textAlign: 'center', margin: '0 auto' }}>
  <video width={'300'} style={{ width: '100%', borderRadius: '10pt', margin: '15pt auto' }} muted={true} autoPlay={true} loop={true}>
    <source src="/files/onboarding-nft.mp4" type="video/mp4" />

Your browser does not support the video tag.

  </video>
</div>

Welcome aboard, __a TON Developer__! You did it.

## What's next?

_First, take a rest! You did a big task! You are a TON developer now. But it's only the beginning of the long way._

## See also

After finishing the TON onboarding challenge, where we successfully mined an NFT, consider taking a look at some of these materials that detail different portions of TON's Ecosystem:

* [What is blockchain? What is a smart contract? What is gas?](https://blog.ton.org/what-is-blockchain)
* [TON Hello World: Step-by-step guide for writing your first smart contract](https://helloworld.tonstudio.io/02-contract/)
* [Develop smart contracts: Introduction](/v3/documentation/smart-contracts/overview)
* [[YouTube] Ton Dev Study - FunC & Blueprint](https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg)
* [How to work with wallet smart contracts](/v3/guidelines/smart-contracts/howto/wallet)
* [FunC Journey: Part 1](https://blog.ton.org/func-journey)
* [Bot for sales of dumplings](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)
* [Mint Your first Jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token)
* [Step by step NFT collection minting](/v3/guidelines/dapps/tutorials/nft-minting-guide)
* [How to run TON Site](/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site)


:::info have some feedback?
You are one of the first explorers here. If you find any mistakes or feel stacked, please send feedback to [@SwiftAdviser](https://t.me/SwiftAdviser). I will fix it ASAP! :)
:::

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/custom-overlays.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/custom-overlays.md
================================================
import Feedback from '@site/src/components/Feedback';

# Custom overlays

TON nodes communicate with each other by forming subnets called **overlay**. A few common overlay nodes participate, such as public overlays for each shard. Validators also participate in general validator overlays and overlays for specific validator sets.

Nodes can also be configured to join custom overlays for two primary purposes: broadcasting external messages and broadcasting block candidates.

Participation in custom overlays allows for the avoidance of uncertainty of public overlays and improves delivery reliability and delays.

Each custom overlay has a strictly determined list of participants with predefined permissions, particularly permission to send external messages and blocks. The overlay's configuration should be the same on all participating nodes.

If you have multiple nodes under your control, it is expedient to unite them into a custom overlay, where all validators can send block candidates and all LS can send external messages. That way, LS will synchronize faster while simultaneously increasing the external message delivery rate (and delivery more robust in general). Note that additional overlay causes additional network traffic.

## Default custom overlays

MyTonCtrl utilizes default custom overlays, which can be found [here](https://ton-blockchain.github.io/fallback_custom_overlays.json). These overlays are typically not in use and are meant for emergency situations when there are connectivity issues with the public overlay.

If you wish to stop participating in default custom overlays, please run the following commands:

```bash
MyTonCtrl> set useDefaultCustomOverlays false
MyTonCtrl> delete_custom_overlay default
```

## Creating a custom overlay

### Collect ADNL  addresses

To add validators to a custom overlay, you can use either their `fullnode adnl id` available with `validator-console -c getconfig` or `validator adnl id`, which can be found in MyTonCtrl's status. 

To add liteservers to a custom overlay, you must use their `fullnode adnl id`.

### Create a config file

Create a config file in the following format:

```json
{
    "adnl_address_hex_1": {
        "msg_sender": true,
        "msg_sender_priority": 1
    },
    "adnl_address_hex_2": {
        "msg_sender": false
    },

    "adnl_address_hex_2": {
        "block_sender": true
    },
  ...
}
```

`msg_sender_priority` determines the order of external message inclusion in blocks: messages from higher-priority sources are first processed. Messages from the public overlay and local LS have priority 0.

:::caution
All nodes listed in the configuration **must** participate in the overlay; if they do not add an overlay with the exact same configuration, connectivity will be poor and broadcasts may fail.
:::

There is a special word `@validators` to create a dynamic custom overlay that MyTonCtrl will generate automatically each round adding all current validators.

### Add custom overlay

Use the following MyTonCtrl command to add a custom overlay:

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

:::caution
The name and config file **must** be the same on all overlay members. Check that the overlay has been created using MyTonCtrl's `list_custom_overlays` command.
:::

### Debug

You can set the node verbosity level equal to 4, and grep logs with the **CustomOverlay** word.

## Deleting a custom overlay

To remove a custom overlay from a node, use the MyTonCtrl command `delete_custom_overlay <name>.`

If the overlay is dynamic (i.e., there is a `@validators` word in the config), it will be deleted within one minute; otherwise, it will be removed instantly.

To make sure that the node has deleted the custom overlay, check MyTonCtrl's `list_custom_overlays`  and `showcustomoverlays` validator-console commands.

## Low level

List of validator-console commands for managing custom overlays:

* `addcustomoverlay <path_to_config>`: Adds a custom overlay to the local node. Note that this configuration must be in a format different from the config used for MyTonCtrl:

    ```json
    {
      "name": "OverlayName",
      "nodes": [
        {
          "adnl_id": "adnl_address_b64_1",
          "msg_sender": true,
          "msg_sender_priority": 1
        },
        {
          "adnl_id": "adnl_address_b64_2",
          "msg_sender": false
        }, ...
      ]
    }
    ```

* `delcustomoverlay <name>`: Removes the custom overlay from the node.

* `showcustomoverlays`: Displays a list of custom overlays known to the node.

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/faq.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/faq.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# FAQ

## MyTonCtrl directory usage

MyTonCtrl is a wrapper that stores its files in two locations:

1. `~/.local/share/mytonctrl/`: Long-term files such as logs are stored here.
2. `/tmp/mytonctrl/`: Temporary files are stored here.

MyTonCtrl includes another script called `mytoncore`, which stores files in the following locations:

1. `~/.local/share/mytoncore/`: Permanent files, the main configuration will be stored here.
2. `/tmp/mytoncore/`: Temporary files and parameters used for elections will be saved here.

MyTonCtrl downloads its source code, along with the validator, into the following directories:

1. `/usr/src/mytonctrl/`
2. `/usr/src/ton/`

MyTonCtrl compiles the validator components into the following directory:

1. `/usr/bin/ton/`

MyTonCtrl creates a working directory for the validator here:

1. `/var/ton/`

---

## If MyTonCtrl was installed as root

The configurations will be stored differently:

1. `/usr/local/bin/mytonctrl/`
2. `/usr/local/bin/mytoncore/`

---

## How to remove MyTonCtrl

Run the script as an administrator and remove the compiled TON components:

```bash
sudo bash /usr/src/mytonctrl/scripts/uninstall.sh
sudo rm -rf /usr/bin/ton
```

Ensure you have the necessary permissions to delete or modify files and directories.

## Directory changes with MyTonCtrl

### Changing validator working directory pre-installation

If you want to change the working directory of the validator before installation, you have two options:

1. **Fork the project**: You can fork the project and make your modifications there. To learn how to fork a project, use the command `man git-fork`.

2. **Create a symbolic link**: Alternatively, you can create a symbolic link with the following command:

   ```bash
   ln -s /opt/ton/var/ton /var/ton
   ```

This command will create a link at `/var/ton` that points to `/opt/ton`.

### Changing validator working directory post-installation

To change the working directory of the validator from `/var/ton/` after installation, follow these steps:

1. **Stop services**: First, stop the services using the following commands:

   ```bash
   systemctl stop validator.service
   systemctl stop mytoncore.service
   ```

2. **Move validator files**: Next, move the validator files with this command:

   ```bash
   mv /var/ton/* /opt/ton/
   ```

3. **Update configuration paths**: Ensure you update the paths in the configuration file located at `~/.local/share/mytoncore/mytoncore.db`.

4. **Consider experience**: Note that there might be limited experience with this type of transfer, so take this into account as you proceed.

Make sure you have sufficient permissions to execute these commands and make these changes.

## Understanding validator status and restarting validator in MyTonCtrl

This [document](/v3/guidelines/nodes/running-nodes/validator-node) will help you confirm if MyTonCtrl has become a full validator.

## Restarting your validator

If you need to restart your validator, run this command:

```bash
systemctl restart validator.service
```

Please ensure you have the necessary permissions to execute these commands and make any needed adjustments. <u>**Remember to back up important data before performing operations that may affect your validator.**</u>

## See also

- [Troubleshooting](/v3/guidelines/nodes/nodes-troubleshooting)

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-backup-restore.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-backup-restore.md
================================================
import Feedback from '@site/src/components/Feedback';

# Node configuration backup and restore

MyTonCtrl enables users to easily create and restore backups of node configurations with two straightforward commands. This feature allows efficient and quick transfer of node configurations from one host to another.

## Manual backup package creation

The `create_backup` command initializes manual backup creation, which should take no more than a few seconds.

MyTonCtrl will create a backup package in the user's home directory. The package name will include the hostname and the backup's epoch timestamp.

The backup will include the following components:

* Node configuration file located at (`/var/ton-work/db/config.json`)

* Node keyring found in (`/var/ton-work/db/keyring`)

* Node liteserver and console keys stored in (`/var/ton-work/keys`)

* MyTonCtrl configuration database and related files located at (`~/.local/share/mytoncore`)

* Wallet and pool data

## Automated backup package creation

If your node is involved in validation, you can set up automated backups of the node configuration. These backups will be performed immediately after your node participates in the elections, ensuring that all data needed for the upcoming validation cycle is preserved.

To enable automated backups, set the parameter: `auto_backup` to `true` by issuing the command `set auto_backup true` on the MyTonCtrl console.

### Automated backup location and lifecycle

By default, automated backups are saved in the directory `/tmp/mytoncore/auto_backups/` located in the home folder of the user under which the **mytoncore** process is running. You can change this location by adjusting the `auto_backup_path` parameter in the MyTonCtrl console.

**Note that automated backups that are older than 7 days will be automatically deleted.**

### Restore backup package

**Important notes**:

* Make sure to stop or disable the TON node on the donor machine. Failing to do so can lead to connectivity and synchronization issues on both machines. It is recommended to stop the donor node for at least 20 minutes before applying the backup data to the new machine.

* Before restoring the backup package to the existing node, it is strongly advised to manually back up the node's original configuration to ensure you have a rollback option.

Use the `restore_backup <file_name>` command and follow the provided instructions. Backups should be restored to a fully synchronized node. MyTonCtrl will retain all settings except for the IP address, which will be updated accordingly.

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-private-alerting.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-private-alerting.md
================================================
import Feedback from '@site/src/components/Feedback';

# MyTonCtrl private alerting bot

## Overview

**MyTonCtrl Private Alerting Bot** is a tool for receiving notifications about your node's status via Telegram Bot.

The bot is designed to send notification messages to Telegram only. It **does not** manage the validator or process any commands.

This bot is part of the MyTonCtrl toolset and is compatible with both validators and liteservers. To utilize it, you must create a separate private bot in Telegram and configure it within MyTonCtrl.

You can use one bot to monitor multiple nodes.

## Setup

To set up the MyTonCtrl Alerting Bot, follow these steps:

### 1. Prepare your bot

1. Visit [@BotFather](https://t.me/BotFather) and create a bot by using the command `/newbot`. After completing this step, you will receive a `BotToken`.

2. Go to your bot and press the `Start` button. This action will enable you to receive messages from the bot.

3. The bot can send messages to either private messages or groups. If you want to receive messages from the bot in a group chat, make sure to add the bot to that group.

4. Visit [@getmyid_bot]([https://t.me/getmyid_bot](https://t.me/getmyid_bot)) and press the **Start** button. The bot will reply with your `ChatId`; you can use this ID if you wish to receive messages directly to your Telegram account.

If you want to receive messages in a group, add the bot to the group, and it will provide you with the group's `ChatId`.

### Activating the alert bot on MyTonCtrl

1. Enable the `alert-bot` using the following command:

	```bash
	MyTonCtrl> enable_mode alert-bot
	```

2. Execute the command:

	```bash
	MyTonCtrl> setup_alert_bot <bot_token> <chat_id>
	```

If you configure everything correctly, you will receive a welcome message listing all available alerts.

## Supported Alerts

The MyTonCtrl Alert Bot supports the following alerts:

- The validator's wallet balance is less than 10 Toncoins.
  
- The node's database usage exceeds 80%.

- The node's database usage exceeds 95%.

- The validator's efficiency is less than 90% in the validation round.

- The node is out of sync by more than 20 seconds.

- The node is not running (service is down).

- The node is unresponsive to ADNL connections.

- The validator has not created any blocks in the past 6 hours.

- The validator has been slashed in the previous validation round.

- The validator's stake has not been accepted.

- The validator's stake has been accepted (info alert with no sound).

- The validator's stake has been returned (info alert with no sound).

- The validator's stake has not been returned.

- There is an active network proposal that has received more than 50% of the required votes, but the validator has not voted on it.
 
## Enabling and disabling alerts

To enable or disable alerts, use the following commands:

*  To enable an alert, use the command 
	```bash
	MyTonCtrl> enable_alert <alert-name>
	```
*  To disable an alert, use the command :
	```bash
	MyTonCtrl> disable_alert <alert-name>
	```
*  To check the status of alerts, use the command:
 	```bash
	MyTonCtrl> list_alerts
	```
* To send a test message, use the command:
	```bash
	MyTonCtrl> test_alert
	```
* To disable the Alert Bot, use the command: 
	```bash
	MyTonCtrl> disable_mode  alert-bot
	```
<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-prometheus.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-prometheus.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# MyTonCtrl prometheus metrics

MyTonCtrl can be configured to expose Prometheus metrics for monitoring and alerting purposes. 
This guide will walk you through the process of enabling Prometheus metrics in MyTonCtrl.

### Metrics delivery method

Currently, MyTonCtrl can only push metrics to Prometheus because of security reasons. 
So it should be used with the [Prometheus Pushgateway](https://github.com/prometheus/pushgateway) service.

## Setup

:::caution
For validators it's highly recommended to run Prometheus and Pushgateway on a separate server.
:::

1. Install Pushgateway

    You can install the Pushgateway service by following the instructions in the [official documentation](https://github.com/prometheus/pushgateway?tab=readme-ov-file#run-it).
    The easiest way to do that is via docker:
  
      ```bash
      docker pull prom/pushgateway
      docker run -d -p 9091:9091 prom/pushgateway
      ```

2. Configure Prometheus

    Create `prometheus.yml` file adding the Pushgateway job to the scrape_configs section. Example of the configuration file:

    ```yaml
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
   
    scrape_configs:
      - job_name: "prometheus"
        static_configs:
          - targets: ["localhost:9090"]
    
      - job_name: "pushgateway"
        honor_labels: true
        static_configs:
          - targets: ["localhost:9091"]  # or "host.docker.internal:9091" if you are using Docker
     ```

3. Install Prometheus

    You can install Prometheus by following the instructions in the [official documentation](https://prometheus.io/docs/prometheus/latest/installation/).
    The easiest way to do that is via docker:
  
      ```bash
    docker volume create prometheus-data
    docker run -d \
        --add-host host.docker.internal:host-gateway \
        -p 9090:9090 \
        -v ./prometheus.yml:/etc/prometheus/prometheus.yml \
        -v prometheus-data:/prometheus \
        prom/prometheus
      ```

4. Configure MyTonCtrl

    Enable mode `prometheus` in MyTonCtrl:

    ```bash
    MyTonCtrl> enable_mode prometheus
    ```

    Set the Pushgateway url:

    ```bash
    MyTonCtrl> set prometheus_url http://<host>:9091/metrics/job/<jobname>
    ```
    :::warning
    Note that it is very important to use different job names for different nodes in case you want to monitor multiple nodes with the same Prometheus instance.
    :::

5. Check the metrics

    You can check that Prometheus scrapes the metrics by opening the Prometheus web interface:

    ```bash
    http://<host>:9090/targets
    ```

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-remote-controller.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-remote-controller.md
================================================
import Feedback from '@site/src/components/Feedback';

# MyTonCtrl remote controller

MyTonCtrl and TON Node can be used on separate machines. There are some advantages of using that:

* To participate in elections, the validator wallet's private key is required by MyTonCtrl. If the Node server 
is compromised, it could lead to unauthorized access to the wallet funds. As a security measure, MyTonCtrl can be hosted on a separate server.
* MyTonCtrl continually expands its functionality, which may consume resources crucial for the Node.
* Probably in future big validators will be able to host several instances of MyTonCtrl controlling several nodes on one server.  

## Setting up

Prepare 2 servers: one is for running TON Node that meets the requirements and one is for running MyTonCtrl which does not require a lot of resources.

1. Node server:

Install MyTonCtrl in `only-node` mode:

```
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh -m validator -l
```

It will install TON Node and create a backup file which you need to download and transfer to the Controller server:

```log
...
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start CreateSymlinks fuction
Local DB path: /home/user/.local/share/mytoncore/mytoncore.db
[info]    01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start ConfigureOnlyNode function
[1/2] Copied files to /tmp/mytoncore/backupv2
[2/2] Backup successfully created in mytonctrl_backup_hostname_timestamp.tar.gz!
If you wish to use archive package to migrate node to different machine please make sure to stop validator and mytoncore on donor (this) host prior to migration.
[info]    01.01.2025, 00:00:00.000 (UTC)  <MainThread>  Backup successfully created. Use this file on the controller server with `--only-mtc` flag on installation.
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  Start/restart mytoncore service
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  sleep 1 sec
[5/5] Mytonctrl installation completed
```

Note, that you still got access to MyTonCtrl console on this server, which you need to update the Node, watch Node metrics, etc.
Also, it creates a `mytoncore` service which is used to send telemetry (if it was not disabled). 
If you want to return control of the node to this server, use command

```bash
MyTonCtrl> set onlyNode false
systemctl restart mytoncore
```

2. Controller server

Install MyTonCtrl in `only-mtc` mode:

```
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh -p /home/user/mytonctrl_backup_hostname_timestamp.tar.gz -o
```

Check the `status` command, there should appear `Node IP address` field:

```log
MyTonCtrl> status
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetValidatorWallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetLocalWallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetWalletFromFile function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start WalletVersion2Wallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetDbSize function
===[ Node status ]===
Node IP address: 0.0.0.0
Validator index: n/a
...
```

## Notes

On updates, you need to `update` and `upgrade` both Node server and Controller server

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-validator-standby.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-validator-standby.md
================================================
import Feedback from '@site/src/components/Feedback';

# Standby validator nodes

Validator node operators must ensure the continuous and reliable operation of their validators. Failure to do so can negatively impact the performance of the TON network and may lead to significant penalties.

However, no system is flawless, and validators may fail in their duties for several reasons, including:

* Loss of synchronization with the TON network due to hardware overload or physical network issues

* Hardware malfunction

* ISP failure

## Standby node

We recommend that all validator operators maintain at least one standby node that can take over validation duties if the main machine fails.

The standby machine should ideally be hosted at a different physical location/ISP. It should have MyTonCtrl installed in full node mode and be synchronized with the TON Blockchain network. **Hardware sizing should match your main validator configuration.**

## Standby activation mechanics

Currently, the node operator activates the standby node manually, as there is no automated main/standby operation.

## Backup

To transfer validation duties from the main node to the standby node, operators require the following information:

* An up-to-date MyTonCtrl configuration database and files.

* An up-to-date node configuration file and keyring.

* The keys needed for MyTonCtrl functionality.

MyTonCtrl offers functionality to [create backups](mytonctrl-backup-restore.md) that include all necessary data. If you operate a validator node, we highly recommend setting up [automated backups](mytonctrl-backup-restore.md#automated-backup-creation) and regularly downloading backup archives from your machine.

## Restore

Before transferring the validator configuration to the standby machine, make sure to stop or disable the TON node on the donor machine for approximately 20 minutes. **Failure to follow this step may lead to connectivity issues and crashes on both the donor and target machines.**

The restore process is outlined in [the section](mytonctrl-backup-restore.md).

Additionally, create and retain a backup of your standby node's original configuration before applying or restoring a backup package from another machine. You will need this backup to revert the standby node back to standby mode.

## Standby rollback

To transfer your validator configuration back to the main validator machine and restore the standby node, follow these steps:

1. Back up the active validator configuration from the standby node.
2. Transfer the configuration to the main validator machine according to the instructions provided earlier.
3. Restore the backup of the standby node's original configuration that you created before applying the validator configuration

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/monitoring/performance-monitoring.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/monitoring/performance-monitoring.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Performance monitoring

## Monitoring TON server performance

Tools such as `htop`, `iotop`, `iftop`, `dstat`, and `nmon` are effective for measuring real-time system performance; however, they fall short when it comes to troubleshooting performance issues that have occurred in the past.

This guide recommends using the Linux SAR (System Activity Report) utility for monitoring the performance of TON servers, and it provides an explanation of how to use it effectively.

:::tip
This guideline helps to identify whether your server experiences a resource shortage, not whether the validator engine performs badly.
:::

### Installation

#### SAR Installation

```bash
sudo apt-get install sysstat
```

#### Enable automatic statistics gathering

```bash
sudo sed -i 's/false/true/g' /etc/default/sysstat
```

#### Enable the service

```bash
sudo systemctl enable sysstat sysstat-collect.timer sysstat-summary.timer
```

#### Start the service

```bash
sudo systemctl start sysstat sysstat-collect.timer sysstat-summary.timer
```

### Usage

By default, the SAR gathers statistics every 10 minutes and shows statistics for the current day, starting at midnight. You can check it by running the SAR without parameters:

```bash
sar
```

If you want to see statistics of the previous day or two days before, pass the number as an option:

```bash
sar -1   # previous day
sar -2   # two days ago
```

For the exact date, you should use the f option to point to the `sa` file of a given day within a month. Thus, for the September 23rd it would be:

```bash
sar -f /var/log/sysstat/sa23
```

To identify performance issues, it is essential to run specific SAR reports and analyze their results effectively.

The following list outlines the SAR commands that can be used to gather various system statistics. By combining these commands with the provided options, you can quickly generate reports for the desired date.

### Memory report

```bash
sar -rh
```

The TON validator engine uses the **jemalloc** feature, which allows it to cache a significant amount of data. As a result, the `sar —rh` command often returns a low number in the `%memused` column.

Meanwhile, you will typically see a high number in the `kbcached` column. Therefore, there is no need to worry about the low amount of free RAM indicated in the `kbmemfree` column. The key indicator to monitor is the value shown in the `%memused` column.

If the percentage exceeds 90%, you should consider adding more RAM. Additionally, keep an eye on your validator engine to ensure it doesn't stop unexpectedly due to an out-of-memory (OOM) issue. The best way to check for this is to grep the `/var/ton-work/log` file for any **Signal** messages.

**Swap usage:**

```bash
sar -Sh
```

If you notice that a swap is used, you should consider adding more RAM. The general recommendation from the **TON Core team** is to disable the swap.

### CPU report

```bash
sar -u
```

If your server utilizes CPU on average up to 70% (see the `%user` column), this should be considered as good.

### Disk Usage report

```bash
sar -dh
```

Watch the `%util` column and react accordingly if it stays above 90% for a particular disk.

### Network report

Use the commands :

```bash
sar -n DEV -h
```

or

```bash
sar -n DEV -h --iface=<interface name>
```

if you want to filter results by network interface name.

Check out the result of column `%ifutil` - it shows the usage of your interface considering its maximum link speed.

You can check what speed is supported by your NIC by executing the command below:

```bash
cat /sys/class/net/<interface>/speed
```

:::info
The speed you're experiencing is not what your provider promised you.
:::

Consider upgrading your link speed if `%ifutil` shows above 70% usage or columns `rxkB/s` and `txkB/s` reporting values close to a bandwidth provided by your provider.

### Reporting a performance issue

Before reporting any performance issues, ensure that you meet the minimum requirements for the node. Then, execute the following commands:

To generate today's report, run:

```bash
sar -rudh | cat && sar -n DEV -h --iface=eno1 | cat > report_today.txt
```

For yesterday's report, use the following command:

```bash
sar -rudh -1 | cat && sar -n DEV -h --iface=eno1 -1 | cat > report_yesterday.txt
```

Additionally, stop the TON node and measure your disk I/O and network speed with the command below:

```bash
sudo fio --randrepeat=1 --ioengine=io_uring --direct=1 --gtod_reduce=1 --name=test --filename=/var/ton-work/testfile --bs=4096 --iodepth=1 --size=40G --readwrite=randread --numjobs=1 --group_reporting
```

Look for the value at `read: IOPS=` and include it in your report. A value above **10K IOPS** is considered good.

Check your download and upload speeds using the following command:

```bash
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python3 -
```

Speeds exceeding **700 Mbit/s** are deemed satisfactory.

When reporting, please send the SAR report, IOPS, and network speed results to [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).

Initial version - _[@neodix](https://t.me/neodix) - TON Core team_, Sep 23, 2024

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/node-maintenance-and-security.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/node-maintenance-and-security.md
================================================
import Feedback from '@site/src/components/Feedback';

# Maintenance and security

## Introduction

This guide provides essential information for maintaining and securing TON validator nodes.

It assumes that you install a validator using the configuration and tools **[recommended by the TON Foundation](/v3/guidelines/nodes/running-nodes/full-node)**. However, the general concepts discussed here can be applied to other scenarios, making them useful for experienced system administrators.

## Maintenance

### Database grooming

The TON node maintains its database at the location specified by the `--db` flag in the `validator-engine`, which is usually `/var/ton-work/db`. To reduce the database size, you can decrease the time-to-live (TTL) for some of the stored data.

The current TTL values are in the node's service file, which is typically located at `/etc/systemd/system/validator.service`. If you use MyTonCtrl, you can check the status by running the command `installer status`. The system will use the default values if any of the TTL values are not set.

### `archive-ttl`

`archive-ttl` is a parameter that defines the TTL for the blocks. The default value is 604800 seconds (7 days). You can decrease this value to reduce the database size.

```bash
MyTonCtrl> installer  set_node_argument  --archive-ttl <value>
```

If you don't use MyTonCtrl, you can edit the node service file.

### `state-ttl`

`state-ttl` is a parameter defining the block states' TTL. The default value is 86400 seconds (24 hours). You can decrease this value to reduce the database size, but for validators, it's highly recommended that the default value be used (keep the flag unset).

Also, this value should be more than the length of the validation period (check the value in [15th config param](/v3/documentation/network/configs/blockchain-configs#param-15)).

```bash
MyTonCtrl> installer  set_node_argument  --state-ttl <value>
```

If you don't use MyTonCtrl, you can edit the node service file.

### Backups

To efficiently back up your validator, it is essential to copy the key node configuration files, keys, and MyTonCtrl settings. Here are the important files to back up:

1. **Node configuration file**:  `/var/ton-work/db/config.json`

2. **Node private keyring**:  `/var/ton-work/db/keyring`

3. **Node public keys**:  `/var/ton-work/keys`

4. **MyTonCtrl configuration and wallets**:  
   - If you installed MyTonCtrl as a regular user: `$HOME/.local/share/myton*` (where `$HOME` is your home directory)
   - If you installed MyTonCtrl as root: `/usr/local/bin/mytoncore`

Backing up this set of files will provide everything you need to recover your node from scratch.

#### Snapshots

Modern file systems such as ZFS offer snapshot functionality. Most cloud providers also allow their customers to make snapshots of their machines, during which the entire disk is preserved for future use.

The problem with both methods is that you must stop the node before performing a snapshot. Failure to do so will most likely result in a corrupt database with unexpected consequences. Many cloud providers also require you to power down the machine before performing a snapshot.

Such stops should not be performed often. If you snapshot your node once a week, then in the worst case scenario after recovery, you will have a node with a week-old database, and it will take your node more time to catch up with the network than to perform a new installation using the MyTonCtrl **install from dump** feature (`-d` flag added during invocation of `install.sh` script).

### Disaster recovery

To recover your node on a new machine, follow these steps:

#### Install MyTonCtrl/node

For the fastest node initialization, add the `-d` switch to the invocation of the installation script.

#### Switch to root user

```sh
sudo  -s
```

#### Stop mytoncore and validator processes

```sh
systemctl  stop  validator
systemctl  stop  mytoncore
```

#### Apply backed up node configuration files

* Node configuration file: `/var/ton-work/db/config.json`

* Node private keyring: `/var/ton-work/db/keyring`

* Node public keys: `/var/ton-work/keys`

#### Set node IP address

If your new node has a different IP address, you need to update the node configuration file located at `/var/ton-work/db/config.json`. Change the value of `leaf.addrs[0].ip` to reflect the new IP address in decimal format. You can use **[this](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)** Python script to convert your IP address to decimal.

#### Ensure proper database permissions

```sh
chown  -R  validator:validator  /var/ton-work/db
```
#### Apply backed-up MyTonCtrl configuration files

Replace `$HOME/.local/share/myton*` with `$ HOME/.local/share/myton*`, where $HOME is the home directory of the user who started the installation of MyTonCtrl with backed-up content. Make sure that the user is the owner of all files you copy.

#### Start mytoncore and validator processes

```sh
systemctl  start  validator
systemctl  start  mytoncore
```

## Security

### Host-level security

Host-level security is a huge topic that is outside the scope of this document; however, we advise that you never install MyTonCtrl under the root user and use a service account to ensure privilege separation.

### Network-level security

TON validators are high-value assets that should be protected against external threats. One of the first steps is to make your node as invisible as possible, which means locking down all network connections. On a validator node, only a UDP Port used for node operations should be exposed to the internet.

#### Tools

We will utilize the **[ufw](https://help.ubuntu.com/community/UFW)** firewall interface along with the **[jq](https://github.com/stedolan/jq)** JSON command-line processor.

#### Management networks

As a node operator, you need to retain full control and access to the machine. To do this, you need at least one fixed IP address or range.

We also advise you to set up a small **jumpstation** VPS with a fixed IP Address that can be used to access your locked-down machine(s) if you do not have a fixed IP at your home or office or to add an alternative way to access secured machines should you lose your primary IP address.

#### Install ufw and jq

```sh
sudo  apt  install  -y  ufw  jq
```

#### Basic lockdown of ufw ruleset

```sh
sudo  ufw  default  deny  incoming; sudo  ufw  default  allow  outgoing
```

#### Disable automated ICMP echo request accept

```sh
sudo  sed  -i  's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g'  /etc/ufw/before.rules
```

#### Enable all access from management network(s)

```sh
sudo  ufw  insert  1  allow  from <MANAGEMENT_NETWORK>
```

Repeat the above command for each management network/address.

#### Expose node/validator UDP port to public

```sh
sudo  ufw  allow  proto  udp  from  any  to  any  port  `sudo jq -r '.addrs[0].port' /var/ton-work/db/config.json`
```
#### Doublecheck your management networks

:::caution important
**Before enabling a firewall,  double-check that you added the correct management addresses!**
:::

#### Enable ufw firewall

```sh
sudo  ufw  enable
```

#### Checking status

To check the firewall status use the following command:

```sh
sudo  ufw  status  numbered
```

Here is an example output of a locked-down node with two management networks/addresses:

```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_A>/28
[ 2] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_B>/32
[ 3] <NODE_PORT>/udp            ALLOW IN    Anywhere
[ 4] <NODE_PORT>/udp (v6)       ALLOW IN    Anywhere (v6)
```
#### Expose liteserver port

```sh
sudo  ufw  allow  proto  tcp  from  any  to  any  port  `sudo jq -r '.liteservers[0].port' /var/ton-work/db/config.json`
```

Note that the liteserver port should not be exposed publicly on a validator.

#### More information on UFW

See this excellent **[ufw tutorial](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)** from the Digital Ocean for more ufw magic.

### IP switch

If you suspect that your node is under attack, consider changing your IP address. The method for switching will depend on your hosting provider. You may need to pre-order a second IP address, clone your **stopped** virtual machine (VM) to create a new instance or set up a fresh instance through a [disaster recovery](#disaster-recovery) process.

:::warning
Regardless of the approach you choose, be sure to [update your new IP address](#set-node-ip-address) in the node configuration file!
:::

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/nodes-troubleshooting.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/nodes-troubleshooting.md
================================================
import Feedback from '@site/src/components/Feedback';

# Troubleshooting

This section provides answers to the most common questions regarding how to run nodes.

## Failed to get account state

```
Failed to get account state
```

This error suggests that there are problems when trying to search for the account in the shard state. It likely means that the liteserver node is syncing too slowly, causing the MasterChain synchronization to advance faster than the ShardChain (BaseChain) synchronization. As a result, while the node is aware of the latest MasterChain block, it is unable to verify the account state in the most recent ShardChain block, leading to the error.

## Failed to unpack account state

```
Failed to unpack account state
```

This error means that the requested account doesn't exist in its current state. That means that this account is simultaneously not deployed AND has zero balance

## About no progress in node synchronization within 3 hours

Try to perform the following checks:

1. Is the process running without crashes? (Check `systemd` process status)

2. Is there a firewall between the node and the internet? If so, will it pass incoming UDP traffic to the port specified in the field `addrs[0].port` of the `/var/ton-work/db/config.json` file?

3. Is there a NAT between the machine and the internet? If so, ensure that the IP address defined in the `addrs[0].ip` field of the `/var/ton-work/db/config.json` file corresponds to the real public IP of the machine. Note that the value of this field is specified as a signed INT. The `ip2dec` and `dec2ip` scripts located in [ton-tools/node](https://github.com/sonofmom/ton-tools/tree/master/node) can be used to perform conversions.

## Archive node is out of sync even after 5 days of the syncing process

Go through the checklist [from this section](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours).

## Slow sync potential reasons

The disk is relatively weak, so it’s advisable to check the IOPS, although hosting providers sometimes exaggerate these numbers.

## Cannot apply external message to current state : External message was not accepted

```
Cannot apply external message to current state : External message was not accepted
```

This error indicates that the contract did not accept the external messages. You need to look for the **exitcode** in the trace. An exitcode of -13 means that the account does not have enough TON to accept a message, or it requires more than the available **gas_credit**.

For wallet contracts:
- An exitcode of 33 indicates a wrong **seqno**, which likely means the **seqno** data you are using is outdated.
- An exitcode of 34 indicates a wrong subwallet_id. For older wallet versions (v1/v2), this may mean an incorrect signature.
- An exitcode of 35 means that the message is either expired or the signature is incorrect.

## What does error 651 mean?

`[Error : 651 : no nodes]` indicates that your node cannot locate another node within the TON Blockchain.

This process can sometimes take up to 24 hours. However, if you've been receiving this error for several days, that means that your node cannot synchronize via a current network connection.

:::tip Solution
You need to check the firewall settings, including any NAT settings if they exist. 

It should allow incoming connections on one specific port and outgoing connections from any port.
:::

## Validator console is not settings

If you encounter the `Validator console is not settings` error, it indicates that you are running `MyTonCtrl` from a user other than the one you used for the installation.

:::tip Solution
Run `MyTonCtrl` from [the user you've installed](/v3/guidelines/nodes/running-nodes/full-node#switch-to-non-root-user) it (non-root sudo user).

```bash
mytonctrl
```
:::

### Running MyTonCtrl as different user

Running MyTonCtrl as a different user may trigger the following error:

```bash
Error:  expected  str,  bytes  or  os.PathLike  object,  not  NoneType
```

To resolve this issue, you need to run MyTonCtrl as the user who installed it.

## What does "block is not applied" mean?

**Q:** Sometimes we encounter messages like `block is not applied` or `block is not ready` for various requests. Is this normal?  

**A:** Yes, this is normal. Typically, it means that you tried to retrieve a block that has not yet reached the node you requested.  

**Q:** If comparative frequency appears, does it indicate there is a problem?  

**A:** No, it does not. You should check the "Local validator out of sync" value in MyTonCtrl. If it is less than 20 seconds, then everything is functioning normally.  

**Keep in mind that the node is continuously synchronizing.** There may be times when you attempt to receive a block that has not yet reached the node you are querying. 

In such cases, you should repeat the request after a short delay.

## Out of sync issue with -d flag

If you encounter an issue where the `out of sync` equals the timestamp after downloading `MyTonCtrl` with the `-d` flag, it's possible that the dump wasn't installed correctly (or it's already outdated).

:::tip Solution
The recommended solution is to reinstall `MyTonCtrl` again with the new dump.
:::

If synchronization takes an unusually long time, there may be issues with the dump. Please [contact us](https://t.me/SwiftAdviser) for assistance.

Execute the `mytonctrl` command using the user account under which it was installed.

## Error command... timed out after 3 seconds

This error indicates that the local node is not yet synchronized, has been out of sync for less than 20 seconds, and that public nodes are being utilized. Public nodes do not always respond, which can result in a timeout error.

:::tip Solution
The solution to the problem is to wait for the local node to synchronize or to execute the same command multiple times before proceeding.
:::

## Status command displays without local node section

![](/img/docs/full-node/local-validator-status-absent.png)

If there is no local node section in the node status, typically, this means something went wrong during installation, and the step of creating/assigning a validator wallet was skipped.

Also, check that the validator wallet is specified.

Check directly the following:

```bash
MyTonCtrl> get  validatorWalletName
```

If `validatorWalletName` is null then execute the following:

```bash
MyTonCtrl> set  validatorWalletName  validator_wallet_001
```

## Transfer a validator on the new server

:::info
Transfer all keys and configs from the old to the working node and start it. In case something goes wrong on the new one, the source where everything is set up is still available.
:::

The best way (while the penalty for temporary non-validation is small, it can be done without interruption):

1. Perform a clean installation on the new server using `mytonctrl` command, and wait until everything is synchronized.

2. Stop the `mytoncore` and validator `services` on both machines, and make backups on the source and on the new one:
- 2.1 `/usr/local/bin/mytoncore/...`
- 2.2 `/home/${user}/.local/share/mytoncore/...`
- 2.3 `/var/ton-work/db/config.json`
- 2.4 `/var/ton-work/db/config.json.backup`
- 2.5 `/var/ton-work/db/keyring`
- 2.6 `/var/ton-work/keys`

3. Transfer from the source to the new one (replace the contents):
- 3.1 `/usr/local/bin/mytoncore/...`
- 3.2 `/home/${user}/.local/share/mytoncore/...`
- 3.3 `/var/ton-work/db/config.json`
- 3.4 `/var/ton-work/db/keyring`
- 3.5 `/var/ton-work/keys`

4. In `/var/ton-work/db/config.json` edit `addrs[0].ip` to the current one, which was after installation (can be seen in the backup `/ton-work/db/config.json.backup`)

5. Check the permissions on all replaced files.

6. On the new one, start the `mytoncore` and `validator` services and check that the node synchronizes and then validates.

7. On the new one, make a backup:
```bash
cp  var/ton-work/db/config.json  var/ton-work/db/config.json.backup
```

## MyTonCtrl was installed by another user. Probably you need to launch mtc with ... user

Run MyTonCtrl with the user that used to install it.

For example, the most common case is when someone tries to run MyTonCtrl as a root user, even though it was installed under a different user. In this case, you need to log in to the user who installed MyTonCtrl and run MyTonCtrl from that user.

### MyTonCtrl was installed by another user. Probably you need to launch mtc with `validator` user

Run command `sudo chown <user_name>:<user_name> /var/ton-work/keys/*` where `<user_name>` is user which installed MyTonCtrl.

### MyTonCtrl was installed by another user. Probably you need to launch mtc with `ubuntu` user

Additionally `mytonctrl` command may not work properly with this error. For example, the `status` command may return empty result.

Check `MyTonCtrl` owner:

```bash
ls  -lh  /var/ton-work/keys/
```

If the owner is the `root` user, [uninstall](/v3/guidelines/nodes/running-nodes/full-node#uninstall-mytonctrl) `MyTonCtrl` and [install](/v3/guidelines/nodes/running-nodes/full-node#run-a-node-text) it again **using non-root user**.

Otherwise, log out from the current user and log in as the correct user. If you are using an SSH connection, terminate it to make the message disappear.

## MyTonCtrl's console launch breaks after message "Found new version of mytonctrl! Migrating!"

There are two known cases when this error appears:

### Error after updating MytonCtrl

* If MyTonCtrl was installed by the root user: Delete the file `/usr/local/bin/mytonctrl/VERSION.`

* If MyTonCtrl was installed by a non-root user: Delete the file `~/.local/share/mytonctrl/VERSION.`

### Error during MytonCtrl installation

`MytonCtrl` may be running, but the node won't function properly. Remove `MytonCtrl` from your computer and reinstall it, making sure to address any previous errors encountered.

## See also

* [MyTonCtrl FAQ](/v3/guidelines/nodes/faq)
* [MyTonCtrl errors](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors)

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/overview.md
================================================
import Feedback from '@site/src/components/Feedback';

# Overview

This page collects some recommendations that could be followed to manage Nodes on TON Blockchain.

* [TON node types](/v3/documentation/infra/nodes/node-types)

## Running TON node

* [Running validator node](/v3/guidelines/nodes/running-nodes/validator-node)
* [Running full node](/v3/guidelines/nodes/running-nodes/full-node)
* [Running liteserver node](/v3/guidelines/nodes/running-nodes/liteserver-node)
* [Running archive node](/v3/guidelines/nodes/running-nodes/archive-node)

## Maintenance

If you have problems with running nodes it's recommended to get acquainted with the following articles.

* [Troubleshooting](/v3/guidelines/nodes/nodes-troubleshooting)
* [Maintenance and security](/v3/guidelines/nodes/node-maintenance-and-security)
* [FAQ](/v3/guidelines/nodes/faq)


<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/persistent-states.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/persistent-states.md
================================================
import Feedback from '@site/src/components/Feedback';

# Persistent states

Nodes periodically store snapshots of the blockchain's states. Each state is created at a specific MasterChain block and has a defined time-to-live (TTL). The selection of the block and TTL follows this algorithm:

Only key blocks can be selected. A block has a timestamp marked as `ts`. Time is divided into periods of length `2^17` seconds (approximately 1.5 days). For a given block with timestamp `ts`, we calculate the period as `x = floor(ts / 2^17)`. The first key block from each period is chosen to create a persistent state.

The TTL of a state from period `x` is calculated as `2^(18 + ctz(x))`, where `ctz(x)` represents the number of trailing zeros in the binary representation of `x` (i.e., the largest integer `y` such that `x` is divisible by `2^y`).

This means that persistent states are created every 1.5 days. Half of these states have a TTL of `2^18` seconds (3 days), while half of the remaining states have a TTL of `2^19` seconds (6 days), and so forth.

In 2025, there will be several long-term persistent states, each lasting at least 3 months:

| Block seqno | Block time | TTL | Expires at |
|--:|--:|--:|--:|
| [8930706](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=8930706) | 2021-01-14 15:08:40 | 12427 days | 2055-01-24 08:45:44 |
| [27747086](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=27747086) | 2023-03-02 05:08:11 | 1553 days | 2027-06-02 19:50:19 |
| [36907647](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=36907647) | 2024-03-24 13:47:57 | 776 days | 2026-05-10 07:09:01 |
| [40821182](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=40821182) | 2024-10-04 18:08:08 | 388 days | 2025-10-28 02:48:40 |
| [43792209](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=43792209) | 2025-01-09 20:18:17 | 194 days | 2025-07-23 00:38:33 |

When the node starts for the first time, it must download a persistent state. This process is implemented in the file [validator/manager-init.cpp](https://github.com/ton-blockchain/ton/blob/master/validator/manager-init.cpp).

Beginning with the initialization block, the node downloads all newer key blocks. It selects the most recent key block that has a persistent state still available (using the formula mentioned above) and subsequently downloads the corresponding MasterChain state, along with the states for all shards or only those shards that are necessary for this node.

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/running-nodes/archive-node.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/running-nodes/archive-node.md
================================================
import Feedback from '@site/src/components/Feedback';

# Archive node

:::info
Before this article, read about [Full node](/v3/guidelines/nodes/running-nodes/full-node).
:::

## Overview

An archive node is a type of full node that stores extended historical data from a blockchain. If you are creating a blockchain explorer or a similar application that requires access to historical data, it is recommended that you use an archive node as an indexer.

## OS requirements

We highly recommend installing mytonctrl using the supported operating systems:

- Ubuntu 20.04
- Ubuntu 22.04
- Debian 11

## Minimal hardware requirements

- 16-core CPU
- 128 GB ECC Memory
- 12 TB SSD _OR_ Provisioned 64+k IOPS storage
- 1 Gbit/s network connectivity, both inbound and outbound
- 16 TB/month traffic on peak load
- Linux OS with open files limit above 400k
- A public IP address (fixed IP address)

:::info Data compression
Uncompressed data requires 12 TB of storage. A ZFS volume with compression reduces this to 11 TB. As of February 2025, the data volume is growing by approximately 0.1 to 1 TB per month, depending on the load.
:::

## Installation

### Install ZFS and prepare volume

Dumps come in the form of ZFS snapshots compressed using plzip. You need to install ZFS on your host and restore the dump. See [Oracle Documentation](https://docs.oracle.com/cd/E23824_01/html/821-1448/gavvx.html#scrolltoc) for more details.

Usually, it's a good idea to create a separate ZFS pool for your node on a _dedicated SSD drive_. This will allow you to manage storage space and back up your node easily.

1. Install [ZFS](https://ubuntu.com/tutorials/setup-zfs-storage-pool#1-overview):

```shell
sudo apt install zfsutils-linux
```

2. [Create a pool](https://ubuntu.com/tutorials/setup-zfs-storage-pool#3-creating-a-zfs-pool) on your dedicated 4 TB `<disk>` and name it `data`:

```shell
sudo zpool create data <disk>
```

3. We recommend enabling compression on the parent ZFS filesystem before restoring. This will save you a [significant amount of space](https://www.servethehome.com/the-case-for-using-zfs-compression/). To enable compression for the `data` volume, use the root account to enter the following:

```shell
sudo zfs set compression=lz4 data
```

### Install MyTonCtrl

Please use the [Running Full Node](/v3/guidelines/nodes/running-nodes/full-node) guide to **install** and **run** mytonctrl.

### Run an archive node

#### Prepare the node

1. Before performing a restore, you must stop the validator using the root account:

```shell
sudo -s
systemctl stop validator.service
```

2. Make a backup of `ton-work` config files (we will need `/var/ton-work/db/config.json`, `/var/ton-work/keys`, and `/var/ton-work/db/keyring`):

```shell
mv /var/ton-work /var/ton-work.bak
```

#### Download the dump

Here is an example command to download & restore the **mainnet** dump from the ton.org server:

```shell
curl -L -s https://archival-dump.ton.org/dumps/mainnet_full_44888096.zfs.zstd | pv | zstd -d -T16 | zfs recv mypool/ton-db
```

To install the **testnet** dump, use:

```shell
wget -c https://dump.ton.org/dumps/latest_testnet_archival.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

The mainnet dump size is approximately 9 TB, so it may take several days to download and restore. The dump size will increase as the network grows.

Prepare and run the command:

1. Install the necessary tools (`pv`, `plzip`, `zstd`).
2. Tell `plzip` to use as many cores as your machine allows to speed up extraction (`-n`).

#### Mount the dump

1. Mount ZFS:

```shell
zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work
```

2. Restore `db/config.json`, `keys`, and `db/keyring` from the backup to `/var/ton-work`:

```shell
cp /var/ton-work.bak/db/config.json /var/ton-work/db/config.json
cp -r /var/ton-work.bak/keys /var/ton-work/keys
cp -r /var/ton-work.bak/db/keyring /var/ton-work/db/keyring
```

3. Set the permissions for the `/var/ton-work` and `/var/ton-work/keys` directories correctly:

- The owner of the `/var/ton-work/db` directory should be the `validator` user:

```shell
chown -R validator:validator /var/ton-work/db
```

- The owner of the `/var/ton-work/keys` directory should be the `ubuntu` user:

```shell
chown -R ubuntu:ubuntu /var/ton-work/keys
```

#### Update configuration

Update the node configuration for the archive node.

1. Open the node config file `/etc/systemd/system/validator.service`:

```shell
nano /etc/systemd/system/validator.service
```

2. Add storage settings for the node in the `ExecStart` line:

```shell
--state-ttl 3153600000 --archive-ttl 3153600000
```

:::info
Please remain patient after starting the node and monitor the logs closely.
The dump files lack DHT caches, requiring your node to discover other nodes and synchronize with them.
Depending on the snapshot's age and your network bandwidth,
your node might need **anywhere from several hours to multiple days** to synchronize with the network.
**The synchronization process typically takes up to 5 days when using minimum hardware specifications.**
This is expected behavior.
:::

:::caution
If the node sync process has already taken 5 days, but the node is still out of sync, you should check the
[troubleshooting section](/v3/guidelines/nodes/nodes-troubleshooting#archive-node-is-out-of-sync-even-after-5-days-of-the-syncing-process).
:::

#### Start the node

1. Start the validator by running the command:

```shell
systemctl start validator.service
```

2. Open `mytonctrl` from the _local user_ and check the node status using the `status` command.

## Node maintenance

The node database requires cleansing from time to time (we advise doing this once a week). To do so, please perform the following steps as root:

1. Stop the validator process (Never skip this!):

```shell
sudo -s
systemctl stop validator.service
```

2. Remove old logs:

```shell
find /var/ton-work -name 'LOG.old*' -exec rm {} +
```

3. Remove temporary files:

```shell
rm -r /var/ton-work/db/files/packages/temp.archive.*
```

4. Start the validator process:

```shell
systemctl start validator.service
```

## Troubleshooting and backups

If, for some reason, something does not work or breaks, you can always [roll back](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk) to the `@archstate` snapshot on your ZFS filesystem. This is the original state from the dump.

1. Stop the validator process (**Never skip this!**):

```shell
sudo -s
systemctl stop validator.service
```

2. Check the snapshot name:

```shell
zfs list -t snapshot
```

3. Roll back to the snapshot:

```shell
zfs rollback data/ton-work@dumpstate
```

If your node operates properly, you may remove this snapshot to reclaim storage space. However, we recommend creating regular filesystem snapshots for rollback capability since the validator node may occasionally corrupt data and `config.json`. For automated snapshot management, [zfsnap](https://www.zfsnap.org/docs.html) handles rotation effectively.

:::tip Need help?
Have a question or need help? Please ask in the [TON dev chat](https://t.me/tondev_eng) to get help from the community. MyTonCtrl developers also hang out there.
:::

## Tips & tricks

:::info
Basic info about archival dumps is present at https://archival-dump.ton.org/
:::

### Remove dump snapshot

1. Find the correct snapshot

```bash
zfs list -t snapshot
```

2. Delete it

```bash
zfs destroy <snapshot>
```

### Force the archive node not to store blocks

To force the node not to store archive blocks, use the value `86400`. Check the [set_node_argument section](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#set_node_argument) for more details.

```bash
installer set_node_argument --archive-ttl 86400
```

## Support

Contact technical support at [@ton_node_help](https://t.me/ton_node_help).

## See also

- [TON node types](/v3/documentation/infra/nodes/node-types)
- [Run a full node](/v3/guidelines/nodes/running-nodes/full-node)

<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/running-nodes/full-node.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/running-nodes/full-node.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Full node

## OS requirements

We highly recommend installing MyTonCtrl using the supported operating systems:

- Ubuntu 20.04
- Ubuntu 22.04
- Debian 11

## Hardware requirements

:::caution Node usage on personal local machine
You shouldn't run any type of node on your personal local machine for extended periods, even if it meets the requirements. Nodes actively use disks, which can lead to rapid wear and potential damage.
:::

### With validator

- 16 cores CPU
- 128 GB RAM
- 1TB NVME SSD _OR_ Provisioned 64+k IOPS storage
- 1 Gbit/s network connectivity
- Public IP address (_fixed IP address_)
- 64 TB/month traffic (100 TB/month on peak load)

:::info Be ready for peak loads
To reliably handle peak loads, a connection of at least 1 Gbit/s is typically required, while the average load is expected to be around 100 Mbit/s.
:::

### Port forwarding

All types of nodes require a static external IP address, one UDP port forwarded for incoming connections, and all outgoing connections to be open—the node uses random ports for new outgoing connections. The node must also be visible to the outside world over the NAT.

You can accomplish this by contacting your network provider or [renting a server](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers) to run a node.

:::info
You can find out which UDP port is open using the `netstat -tulpn` command.
:::

### Recommended providers

The TON Foundation recommends the following providers for running a Validator:

| Cloud Provider | Instance Type                   | CPU                     | RAM     | Storage                           | Network         | Public IP                               | Traffic       |
| -------------- | ------------------------------- | ----------------------- | ------- | --------------------------------- | --------------- | --------------------------------------- | ------------- |
| GCP            | `n2-standard-16`                | `32 vCPUs`              | `128GB` | `1TB NVMe SSD`                    | `16 Gbps`       | Reserve a static external IP            | `64 TB/month` |
| Alibaba Cloud  | `ecs.g6.4xlarge`                | `32 vCPUs`              | `128GB` | `1TB NVMe SSD`                    | `Up to 10 Gbps` | Bind an Elastic IP                      | `64 TB/month` |
| Tencent Cloud  | `M5.4XLARGE`                    | `32 vCPUs`              | `128GB` | `1TB NVMe SSD`                    | `Up to 10 Gbps` | Associate an Elastic IP                 | `64 TB/month` |
| Vultr          | `bare metal Intel E-2388G`      | `16 Cores / 32 Threads` | `128GB` | `1.92TB NVMe SSD`                 | `10 Gbps`       | Fixed IP address included with instance | `64 TB/month` |
| DigitalOcean   | `general purpose premium Intel` | `32 vCPUs`              | `128GB` | `1TB NVMe SSD`                    | `10 Gbps`       | Fixed IP address included with instance | `64 TB/month` |
| Latitude       | `c3.medium.x86`                 | `16 Cores / 32 Threads` | `128GB` | `1.9TB NVMe SSD`                  | `10 Gbps`       | Fixed IP address included with instance | `64 TB/month` |
| AWS            | `i4i.8xlarge`                   | `32 vCPUs`              | `256GB` | `2 x 3,750 AWS Nitro SSD (fixed)` | `Up to 25 Gbps` | Bind an Elastic IP                      | `64 TB/month` |

:::info
**Note:** Prices, configurations, and availability can change. It is recommended to always refer to the official documentation and pricing pages of the respective cloud provider before making any decisions.
:::

## Run a Node (video)

[//]: # "<ReactPlayer controls={true} style={{borderRadius:'10pt', margin:'15pt auto', maxWidth: '100%'}} url='/docs/files/TON_nodes.mp4' />"

Please, check this video step-by-step tutorial to start promptly:

<video
  style={{
    borderRadius: "10pt",
    margin: "auto",
    width: "100%",
    maxWidth: "100%",
  }}
  controls={true}
>
  <source src="/files/TON_nodes.mp4" type="video/mp4" />
</video>

## Run a node (text)

### Switch to non-root user

:::warning
This step is required to successfully install and use MyTonCtrl—don't ignore non-root user creation. Without this step, there will be no errors during installation, but MyTonCtrl will not work properly.
:::

If you don't have a non-root user, you can create one with the following steps (otherwise, skip the first two steps and go to the third).

1. Login as root and create new user:

```bash
sudo adduser <username>
```

2. Add your user to the sudo group:

```bash
sudo usermod -aG sudo <username>
```

3. Log into the new user (if you are using ssh, **you will need to stop current session and reconnect with correct user**)

```bash
ssh <username>@<server-ip-address>
```

### Install the MyTonCtrl

Download and run the installation script from the **non-root** user account with **sudo** privileges:

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu">

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh
```

  </TabItem>
  <TabItem value={'debian'} label={'Debian'}>

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
su root -c 'bash install.sh'
```

  </TabItem>
</Tabs>

- `-d` - **mytonctrl** will download a [dump](https://dump.ton.org/) of the latest blockchain state.
  This will reduce synchronization time by several times.
- `-c <path>` - If you want to use not public liteservers for synchronization. _(not required)_
- `-i` - Ignore minimum requirements, use it only if you want to check compilation process without real node usage.
- `-m` - Mode, can be `validator` or `liteserver`.
- `-t` - Disable telemetry.

**To use testnet**, `-c` flag should be provided with `https://ton.org/testnet-global.config.json` value.

Default `-c` flag value is `https://ton-blockchain.github.io/global.config.json`, which is default mainnet config.

### Running the MyTonCtrl

1. Run `MyTonCtrl` console **from the local user account used for installation**:

```sh
mytonctrl
```

2. Check the `MyTonCtrl` status using the `status` command:

```sh
status
```

**In testnet** `status fast` command must be used instead of `status`.

The following statuses should be displayed:

- **mytoncore status**: should display in green.
- **local validator status**: should also display in green.
- **local validator out of sync**: initially, a `n/a` string is displayed. As soon as the newly created validator connects with other validators, the number will be around 250k. As synchronization progresses, this number decreases. When it falls below 20, the validator is synchronized.

Example of the **status** command output:

![status](/img/docs/nodes-validator/mytonctrl-status.png)

:::caution Make sure you have same output for status
For all nodes type **Local Validator status** section should appear.
Otherwise, [check troubleshooting section](/v3/guidelines/nodes/nodes-troubleshooting#status-command-displays-without-local-node-section) and [check node logs](/v3/guidelines/nodes/running-nodes/full-node#check-the-node-logs).
:::

Please wait until the `Local validator out of sync` status is less than 20 seconds.

When a new node is started, even from a dump, it is important to wait up to 3 hours before the _out of sync_ number begins to decrease. This delay occurs because the node must establish its place in the network and propagate its addresses through the DHT tables, among other processes.

### Uninstall mytonctrl

Download script and run it:

```bash
sudo bash /usr/src/mytonctrl/scripts/uninstall.sh
```

### Check mytonctrl owner

Run:

```bash
ls -lh /var/ton-work/keys/
```

## Tips & tricks

### List of available commands

- You can use `help` to get a list of available commands:

![Help command](/img/docs/full-node/help.jpg)

### Check the MyTonCtrl logs

- To check **MyTonCtrl** logs, open `~/.local/share/mytoncore/mytoncore.log` for a local user or `/usr/local/bin/mytoncore/mytoncore.log` for root.

![logs](/img/docs/nodes-validator/manual-ubuntu_mytoncore-log.png)

### Check the node logs

Check the node logs in case of failure:

```bash
tail -f /var/ton-work/log.thread*
```

## Support

Contact technical support with [@ton_node_help](https://t.me/ton_node_help).

<Feedback />



================================================
FILE: docs/v3/guidelines/nodes/running-nodes/liteserver-node.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/running-nodes/liteserver-node.md
================================================
import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Liteserver node

:::info
Before reading this article, please refer to the section on [Full node](/v3/guidelines/nodes/running-nodes/full-node) for more information.
:::

When an endpoint is activated in a full node, that node becomes a **liteserver**. This type of node can handle and respond to requests from the lite-client, facilitating smooth interaction with the TON Blockchain.

## Hardware requirements

Running a liteserver mode requires fewer resources than a [validator](/v3/guidelines/nodes/running-nodes/full-node#hardware-requirements), but it is still recommended that you use a powerful machine:

- minimum of 16-core CPU  
- minimum of 128 GB RAM  
- at least 1 TB NVMe SSD or provisioned storage with 64,000+ IOPS  
- 1 Gbps network connectivity  
- 16 TB of traffic per month during peak load  
- fixed public IP address  

### Recommended providers

Feel free to use the cloud providers listed in the [recommended providers](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers) section.

Hetzner and OVH are not allowed to run a validator, but you can use them to run a liteserver:

- __Hetzner__: EX101, AX102
- __OVH__: RISE-4

## Installation of liteserver

If you don't have `MyTonCtrl`, install it using the `-m liteserver` flag.

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu">

  ```bash
  wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
  sudo bash ./install.sh -m liteserver
  ```

  </TabItem>
  <TabItem value={'debian'} label={'Debian'}>

  ```bash
  wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
  su root -c 'bash ./install.sh -m liteserver'
  ```

  </TabItem>
</Tabs>

- `-d`: The `MyTonCtrl` command will download a [dump](https://dump.ton.org/) of the latest blockchain state, significantly reducing synchronization time. 
- `-c <path>`: This option allows you to use private liteservers for synchronization. _(This option is not required.)_
- `-i`: Use this flag to ignore minimum requirements. It should only be used if you want to check the compilation process without utilizing a real node.
- `-m`: This specifies the mode and can be set to either `validator` or `liteserver`.

To use the Testnet, you must provide the `-c` flag with the value `https://ton.org/testnet-global.config.json.` The default value for the `-c` flag is `https://ton-blockchain.github.io/global.config.json`, which refers to the mainnet configuration. 

If you already have `MyTonCtrl` installed, run:

```bash
user@system:~# mytonctrl
MyTonCtrl> enable_mode liteserver
```

## Check the firewall settings

Firstly, check the liteserver port specified in your `/var/ton-work/db/config.json` file. This port may vary with each new installation of `MyTonCtrl` and can be found in the `port` field.

```json
{
  ...
  "liteservers": [
    {
      "ip": 1605600994,
      "port": LITESERVER_PORT
      ...
    }
  ]
}
```

If you use a cloud provider, open this port in the firewall settings. For instance, if you are using AWS, you should open the port in the [security group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html).

Here is an example of how to open a port in the firewall of a bare metal server:

### Opening a port in the firewall

We will use the `ufw` utility (see the [cheatsheet](https://www.cyberciti.biz/faq/ufw-allow-incoming-ssh-connections-from-a-specific-ip-address-subnet-on-ubuntu-debian/)). However, feel free to use any alternative that you prefer.

1. If `ufw` is not already installed, install it:

```bash
sudo apt update
sudo apt install ufw
```

2. Enable SSH connections:

```bash
sudo ufw allow ssh
```

3. Ensure that you allow the port indicated in the `config.json` file:

```bash
sudo ufw allow <port>
```

4. Enable the firewall:

```bash
sudo ufw enable
```

5. Check the firewall status:

```bash
sudo ufw status
```

To do this, you can open the port in your server's firewall settings.

## Interaction with liteserver (lite-client)

1. Create a new project directory on your machine and place the `config.json` file in it. You can obtain this configuration by running the following command:

```bash
installer clcf # in mytonctrl
```

It will create a file at `/usr/bin/ton/local.config.json` on your machine where `MyTonCtrl` is installed. Check the [MyTonCtrl documentation for more information](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#clcf).

2. Install libraries.

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

  ```bash
  npm i --save ton-core ton-lite-client
  ```

  </TabItem>
  <TabItem value="python" label="Python">

  ```bash
  pip install pytonlib
  ```

  </TabItem>
  <TabItem value="go" label="Golang">

  ```bash
  go get github.com/xssnick/tonutils-go
  go get github.com/xssnick/tonutils-go/lite
  go get github.com/xssnick/tonutils-go/ton
  ```
  </TabItem>
</Tabs>

3. Initialize and request MasterChain information to confirm that the liteserver is running properly.

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

Update the project type to `module` in your `package.json` file.

  ```json
  {
      "type": "module"
  }
  ```

Create a file named `index.js` and include the following content:
  ```js
  import { LiteSingleEngine } from 'ton-lite-client/dist/engines/single.js'
  import { LiteRoundRobinEngine } from 'ton-lite-client/dist/engines/roundRobin.js'
  import { Lite } from 'ton-lite-client/dist/.js'
  import config from './config.json' assert {type: 'json'};


  function intToIP(int ) {
      var part1 = int & 255;
      var part2 = ((int >> 8) & 255);
      var part3 = ((int >> 16) & 255);
      var part4 = ((int >> 24) & 255);

      return part4 + "." + part3 + "." + part2 + "." + part1;
  }

  let server = config.liteservers[0];

  async function main() {
      const engines = [];
      engines.push(new LiteSingleEngine({
          host: `tcp://${intToIP(server.ip)}:${server.port}`,
          publicKey: Buffer.from(server.id.key, 'base64'),
      }));

      const engine = new LiteRoundRobinEngine(engines);
      const  = new Lite({ engine });
      const master = await .getMasterchainInfo()
      console.log('master', master)

  }

  main()

  ```

  </TabItem>
  <TabItem value="python" label="Python">

  ```python
    from pytoniq import LiteClient

    async def main():
        client = LiteClient.from_mainnet_config(  # choose mainnet, testnet or custom config dict
            ls_i=0,  # index of liteserver from config
            trust_level=2,  # trust level to liteserver
            timeout=15  # timeout not includes key blocks synchronization as it works in pytonlib
        )
    
        await client.connect()
    
        await client.get_masterchain_info()
    
        await client.reconnect()  # can reconnect to an exising object if had any errors
    
        await client.close()
    
        """ or use it with context manager: """
        async with LiteClient.from_mainnet_config(ls_i=0, trust_level=2, timeout=15) as client:
            await client.get_masterchain_info()

  ```

  </TabItem>
  <TabItem value="go" label="Golang">

  ```go
  package main

  import (
      "context"
      "encoding/json"
      "io/ioutil"
      "log"
      "github.com/xssnick/tonutils-go/liteclient"
      "github.com/xssnick/tonutils-go/ton"
  )

  func main() {
      client := liteclient.NewConnectionPool()

      content, err := ioutil.ReadFile("./config.json")
      if err != nil {
          log.Fatal("Error when opening file: ", err)
      }

      config := liteclient.GlobalConfig{}
      err = json.Unmarshal(content, &config)
      if err != nil {
          log.Fatal("Error during Unmarshal(): ", err)
      }

      err = client.AddConnectionsFromConfig(context.Background(), &config)
      if err != nil {
          log.Fatalln("connection err: ", err.Error())
          return
      }

      // initialize ton API lite connection wrapper
      api := ton.NewAPIClient(client)

      master, err := api.GetMasterchainInfo(context.Background())
      if err != nil {
          log.Fatalln("get masterchain info err: ", err.Error())
          return
      }

      log.Println(master)
}

  ```
  </TabItem>
</Tabs>

4. You can now interact with your own liteserver.

## See also

- [YouTube-Tutorial how to launch a liteserver](https://youtu.be/p5zPMkSZzPc)
<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/running-nodes/run-mytonctrl-docker.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/running-nodes/run-mytonctrl-docker.md
================================================
import Feedback from '@site/src/components/Feedback';

# Running MyTonCtrl in Docker

This guide provides a step-by-step process for installing MyTonCtrl using Docker.

## Hardware requirements

To ensure an optimal experience while running MyTonCtrl, here are the recommended hardware specifications:

- 16-core CPU
- 128 GB RAM
- 1TB NVME SSD or provisioned 64+k IOPS storage
- 1 Gbit/s network connectivity
- Public IP address (fixed IP address)
- 16 TB/month traffic on peak load

:::warning 
 This setup is primarily intended for testing purposes, so it may not be suitable for production environments. If you’d like to bypass hardware checks for any reason, you can easily do this by setting the variable ``IGNORE_MINIMAL_REQS=true``.
:::
## Software requirements

To get started, please ensure you have the following software installed:

- Docker CE  
- Docker CE CLI  
- Containerd.io  
- Docker Buildx Plugin  
- Docker Compose Plugin  

For detailed installation instructions, see the official [Docker installation guide](https://docs.docker.com/engine/install/).

## Tested operating systems

We’ve successfully tested MyTonCtrl on these operating systems:

- Ubuntu 20.04  
- Ubuntu 22.04  
- Ubuntu 24.04  
- Debian 11  
- Debian 12  

## Running MyTonCtrl v2 using the official Docker image

Here’s how you can pull the image and set up your MyTonCtrl node:

```bash
docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-blockchain/ton-docker-ctrl:latest
```

## Installing and starting MyTonCtrl from source

If you prefer to install from source, just follow these easy steps:

1. Clone the repository with the latest version:

```bash
git clone https://github.com/ton-blockchain/ton-docker-ctrl.git
```

2. Change into the project directory:

```bash
cd ./ton-docker-ctrl
```

3. Open the `.env` file and make any necessary updates:

```bash
vi .env
```

4. Next, build the Docker image, which will set up everything you need—compiling the latest versions of fift, validator-engine, lite-client, and more:

```bash
docker compose build ton-node
```

5. Finally, start MyTonCtrl:

```bash
docker compose up -d
```

## Migrating a non-Docker full node or validator to a Dockerized MyTonCtrl v2

If you want to transition your existing TON setup to a Dockerized version, specify the paths for your TON binaries, source files, work directory, and MyTonCtrl settings:

```bash
docker run -d --name ton-node --restart always \
-v <EXISTING_TON_WORK_FOLDER>:/var/ton-work \
-v /usr/bin/ton:/usr/bin/ton \
-v /usr/src/ton:/usr/src/ton \
-v /home/<USER>/.local/share:/usr/local/bin \
ghcr.io/ton-blockchain/ton-docker-ctrl:latest
```

## Variable settings

In the `.env` file, you can configure the following variables:

- ``GLOBAL_CONFIG_URL``: Points to the network configurations for the TON Blockchain (default: [Testnet](https://ton.org/testnet-global.config.json))  
- ``MYTONCTRL_VERSION``: Indicates the Git branch used for assembling MyTonCtrl  
- ``TELEMETRY``: Turn telemetry on or off  
- ``MODE``: Define the mode for MyTonCtrl (either validator or liteserver)  
- ``IGNORE_MINIMAL_REQS``: Option to bypass hardware requirements  

## Stopping and deleting MyTonCtrl

When it’s time to stop or remove your MyTonCtrl setup, here’s how you can do it:

1. Stop the container:

```bash
docker compose stop
```

2. Delete the container:

```bash
docker compose down
```

3. To completely remove the container along with its data:

```bash
docker compose down --volumes
```

## Connecting to MyTonCtrl

You can easily connect to MyTonCtrl using this command:

```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```

Once connected, check the status with:

```bash
MyTonCtrl> status
```
![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)

And if you would like to see a list of commands you can use, simply enter:

```bash
MyTonCtrl> help
```

## Reviewing MyTonCtrl logs

Monitoring the situation is simple, as you can easily view the logs:

```bash
docker compose logs
```

## Updating MyTonCtrl and TON

Updating your version of TON and MyTonCtrl is easy: just navigate to the directory containing your `docker-compose.yml` file and rebuild.

```bash
cd ./ton-docker-ctrl
docker compose build ton-node
```

After that, restart Docker Compose:

```bash
docker compose up -d
```

When you’re connected to MyTonCtrl, it will automatically check for updates. If any are available, you’ll see a message saying, “``MyTonCtrl update available. Please update it with the `update` command``”.  To do the update, use the command below and specify the branch you want:

```bash
MyTonCtrl> update mytonctrl2
```

## Changing the data storage path

TON and MyTonCore data is stored in ``/var/lib/docker/volumes/``by default. If you wish to change this storage path, update the required route in the ``volumes`` section of your `docker-compose.yml` file to fit your needs. 
<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/running-nodes/running-a-local-ton.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/running-nodes/running-a-local-ton.md
================================================
import Feedback from '@site/src/components/Feedback';

# Running a local TON

MyLocalTon is your personal blockchain development environment, running directly on your local computer. This comprehensive guide covers the installation, configuration, and operation of this powerful development tool.

## MyLocalTon user guide

### Prerequisites

Before starting, ensure your system meets these requirements:

-   Java version 21 or higher
-   Python 3.x for HTTP API integration
-   Windows users must install Microsoft Visual C++ Redistributable 2015+ x64    

### Installation process

#### Windows installation steps

- Install Microsoft Visual C++ Redistributable 2015+ x64
- Download the correct JAR file based on your system architecture:
    -   For x86-64 systems: `MyLocalTon-x86-64.jar`
    -   For ARM64 systems: `MyLocalTon-arm64.jar`

#### Linux/MacOS Installation Steps

```bash
# For x86-64 systems
wget https://github.com/neodix42/MyLocalTon/releases/latest/download/MyLocalTon-x86-64.jar 
# For ARM64 systems
wget https://github.com/neodix42/MyLocalTon/releases/latest/download/MyLocalTon-arm64.jar
```

#### Building from source

##### Prerequisites setup

```bash
# Install Java Development Kit (JDK)  
sudo  apt  install default-jdk 
# Install Apache Ant build tool  
sudo  apt  install ant 
# Install Maven build automation tool  
sudo  apt  install maven
```

##### Clone and build

```bash
git clone https://github.com/neodix42/MyLocalTon.git
cd MyLocalTon
mvn clean package assembly:single
```

##### Locate built artifacts

After successful compilation, find your built artifacts in the `target` directory:

-   `MyLocalTon-x86_64.jar` for x86-64 systems
-   `MyLocalTon-arm64.jar` for ARM64 systems

### Basic operation

Launch MyLocalTon using Java:

```bash
# For x86-64 systems  
java -jar MyLocalTon-x86-64.jar

# For ARM64 systems  
java -jar MyLocalTon-arm64.jar`
```
#### Command line options

MyLocalTon accepts several parameters to customize its operation:

-   `nogui`: Run without graphical interface
-   `ton-http-api`: Enable HTTP API functionality
-   `explorer`: Launch explorer interface
-   `ip.addr.xxx.xxx`: Set custom IP address
-   `with-validators-N`: Specify number of validators to start
-   `custom-binaries=absolute-path`: Use custom binaries
-   `debug`: Enable debug mode

For complete technical details, [see](https://github.com/neodix42/MyLocalTon?tab=readme-ov-file#parameters).

MyLocalTon features a user-friendly interface:
![](/img/docs/mylocalton.jpeg)
![](/img/docs/mylocalton-demo.gif)

### Lite-client access setup

MyLocalTon generates permanent private/public keys for secure lite-server and validator-engine-console connections:

To establish a lite-client connection:

```bash
lite-client -a 127.0.0.1:4443 -b E7XwFSQzNkcRepUC23J2nRpASXpnsEKmyyHYV4u/FZY= -c last
```

To access validator-engine-console:

```bash
validator-engine-console -a 127.0.0.1:4441 -k <absolute-path>/myLocalTon/genesis/bin/certs/client -p <absolute-path>/myLocalTon/genesis/bin/certs/server.pub
```

### Monitoring your system

Track MyLocalTon's operation through these log files:

-   Main application logs: `./myLocalTon/MyLocalTon.log`
-   Validator-engine logs: `./myLocalTon/genesis/db/log`

### Troubleshooting guide

- Run MyLocalTon in debug mode:

  ```bash
  java -jar MyLocalTon*.jar debug
  ```
- Check log files for error messages
- Verify system requirements are met

### Essential information

1.  System compatibility matrix:
    
    | Operating System |  Architecture      | Supported |
    | --------------------  | ---------------       |  ----------- |
    | Linux                 |  x86_64               |  ✅          |
    | Linux                 |  arm64/aarch64        |  ✅          |
    | MacOS                 |   x86_64 (12+)        |  ✅          |
    | MacOS                 |  arm64/aarch64        |  ✅          |
    | Windows               |  x86_64.              |  ✅          |
    
2.  MacOS users note
    
    If you use MacPorts instead of Homebrew, execute these commands:
     ```bash
    mkdir -p /usr/local/opt/readline/lib
    ln -s /opt/local/lib/libreadline.8.dylib /usr/local/opt/readline/lib
    ```
    
3. Upgrade process :
    
    Currently, upgrading requires these steps:
    
    - Download the latest version
    - Replace the existing MyLocalTon file
    - Remove the myLocalTon directory
    
    Developers are planning to include direct upgrade functionality in future releases.
    
4.  HTTP API integration:
    
    ```bash
    # Linux Installation  
    sudo  apt  install -y python3 
    sudo  apt  install -y      
    python3-pip pip3 install --user ton-http-api 
    
    # MacOS Installation  
    brew install -q python3 
    python3 -m ensurepip --upgrade
    pip3 install --user ton-http-api 
    
    # Windows Installation  
    wget https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe    
    python -m ensurepip --upgrade
    start pip3 install -U ton-http-api`
    
### Important notice

:::caution
Developers currently classify MyLocalTon as alpha software, making it unsuitable for production environments. For containerized deployment, developers recommend using the  [dedicated Docker repository](https://github.com/neodix42/mylocalton-docker).
:::

### Resources

* [MyLocalTon binaries](https://github.com/neodiX42/MyLocalTon/releases)

* [MyLocalTon source code](https://github.com/neodiX42/MyLocalTon)
<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/running-nodes/secure-guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/running-nodes/secure-guidelines.md
================================================
import Feedback from '@site/src/components/Feedback';

# Secure guidelines for nodes

Ensuring the security of nodes, particularly in decentralized networks such as blockchain or distributed systems, is essential for maintaining data integrity, confidentiality, and availability. The guidelines for securing nodes should cover several layers, including network communication, hardware, and software configurations. Below are a set of guidelines to enhance node security:

### 1. Use the server exclusively to operate the TON node:

* Using the server for additional tasks presents a potential security risk.

### 2. Update and patch regularly:

* Keep your system updated with the latest security patches.  
* Regularly use package management tools like apt (Debian/Ubuntu) or yum/dnf (CentOS/Fedora) to perform updates.

	```bash
	#Debian/Ubuntu
	sudo apt update && sudo  apt  upgrade  -y
	
	#CentOS
	sudo yum update && sudo yum upgrade -y

	#Fedora
	sudo dnf update && sudo dnf upgrade -y
	```

* Consider automating security updates by enabling unattended upgrades for your system.

### 3. Ensure a robust SSH configuration:

* **Disable root login:** Prevent root access through SSH by editing the `/etc/ssh/sshd_config` file.

	```bash
	PermitRootLogin no
	```
* **Use SSH keys:** For a more secure connection, opt for SSH keys instead of password authentication.
	```bash
	PasswordAuthentication no
	```
* **Modify the default SSH port:** Changing the default SSH port can help reduce automated brute-force attacks:

	```bash
	Port 2222
	```
*	**Restrict SSH access:** Allow SSH connections only from trusted IP addresses by implementing firewall rules.

### 4. Implement a firewall

* Set up a firewall to permit only essential services. Common tools are **ufw (Uncomplicated Firewall)** and **iptables**:

	```bash
	sudo ufw allow 22/tcp # Allow SSH
	sudo ufw allow 80/tcp # Allow HTTP
	sudo ufw allow 443/tcp # Allow HTTPS
	sudo ufw enable # Enable firewall
	```

### 5. Monitor logs

* Regularly monitor system logs to detect suspicious activities:
    *  `/var/log/auth.log` (for authentication attempts)
    *  `/var/log/syslog` or `/var/log/messages`
* Consider implementing centralized logging.

### 6. Limit user privileges

* Grant root or sudo privileges only to trusted users. Use the sudo command carefully and audit the `/etc/sudoers` file to limit access.

* Regularly review user accounts and remove any unnecessary or inactive users.

### 7. Utilize SELinux or AppArmor

*  **SELinux** (on RHEL/CentOS) and **AppArmor** (on Ubuntu/Debian) provide mandatory access control, adding an extra layer of security by restricting programs from accessing specific system resources.

### 8. Install security tools

* Utilize tools such as **Lynis** to conduct regular security audits and identify potential vulnerabilities:

	```bash
	sudo apt install lynis
	sudo lynis audit system
	```

### 9. Disable unnecessary services 

* To minimize the attack surface, disable or remove any unused services. For instance, if FTP or mail services are not needed, ensure to disable them: 

	```bash
	sudo systemctl disable service_name
	```

### 10. Implement intrusion detection and prevention systems (IDS/IPS)

* Use tools like **Fail2ban** to block IP addresses after multiple failed login attempts:

	```bash
	sudo apt install fail2ban
	```

* Utilize **AIDE (Advanced Intrusion Detection Environment)** to monitor file integrity and identify any unauthorized changes.

:::caution
Please remain vigilant and ensure that your node is secure at all times.
:::
<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/running-nodes/staking-with-nominator-pools.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/running-nodes/staking-with-nominator-pools.md
================================================
import Feedback from '@site/src/components/Feedback';

# Staking with nominator pools

## Overview

With TON smart contracts, you can implement any staking and deposit mechanics you want.

However, there is native staking in TON Blockchain - you can lend Toncoin to validators for staking and share the reward for validation.

The one who lends to validator is called the **nominator**.

A smart contract, called a [**nominator pool**](/v3/documentation/smart-contracts/contracts-specs/nominator-pool), provides the ability for one or more nominators to lend Toncoin in a validator stake, and ensures that the validator can use that Toncoin only for validation. This smart contract guarantees the distribution of the reward.

If you are familiar with cryptocurrencies, you must have heard about **validators** and **nominators**. Now, the time has come to find out what they are — the two major actors ruling the blockchain.

## Validator

A validator is a network node that helps keep the blockchain running by verifying (or validating) suggested blocks and recording them on the blockchain.

To become a validator, you must meet two requirements: have a high-performance server and obtain at least 300,000 Toncoins, in order to make a stake. At the time of writing, there are up to 400 validators per round on TON.

## Nominator

:::info
New version of [nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/) available, read more in the [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/) and [Vesting contract](/v3/documentation/smart-contracts/contracts-specs/vesting-contract/) pages.
:::

It's evident that not everyone can afford to have 100,000s of Toncoin on their balance – here's where nominators come into play. Simply put, the nominator is a user who lends his TON to validators. Every time the validator earns a reward by validating blocks, it is distributed between the involved participants.

TON Whales pool allows a minimum deposit of 50 TON. TON Foundation open nominator pool allows users to stake Toncoin in a fully decentralized way, starting with **10,000 TON**.

_From [TON Community post](https://t.me/toncoin/543)._

There should always be **10 TON** on the pool balance - this is the minimum balance for the network storage fee.

## Cost per month

Since validation round lasts ~18 hours, takes about 5 TON per validation round and 1 nominator pool takes part in even and odd validation rounds it will take **~105 TON per month** to operate the pool.

## How to participate?

- [The list of the TON nominator pools](https://tonvalidators.org/)

## Source code

- [Nominator pool smart contract source code](https://github.com/ton-blockchain/nominator-pool)

:::info
The theory of nominators is described in [TON Whitepaper](https://docs.ton.org/ton.pdf), chapters 2.6.3, 2.6.25.
:::

## See also 
- [Running validator node](/v3/guidelines/nodes/running-nodes/validator-node)
- [Nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/)
- [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/)
<Feedback />




================================================
FILE: docs/v3/guidelines/nodes/running-nodes/validator-node.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/nodes/running-nodes/validator-node.md
================================================
import Feedback from '@site/src/components/Feedback';

# Validator node

Network validators confirm all user transactions. If all validators agree that a transaction is valid, it gets added to the blockchain. Invalid transactions are rejected. See more information [here](https://ton.org/validators).

## Minimal hardware requirements

- 16-core CPU  
- 128 GB RAM  
- 1TB NVMe SSD or provisioned 64+k IOPS storage  
- 1 Gbit/s network connectivity  
- Public IP address (fixed IP address)  
- 100 TB/month traffic at peak load

> Typically you'll need at least a 1 Gbit/s connection to reliably accommodate peak loads (the average load is expected to be approximately 100 Mbit/s).

> We draw special attention of validators to IOPS disk requirements, it is crucially important for smooth network operation.

## Port forwarding

All types of nodes require a static external IP address, one UDP port forwarded for incoming connections, and all outgoing connections to be open—the node uses random ports for new outgoing connections. The node must also be visible to the outside world over the NAT.

You can work with your network provider or [rent a server](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers) to run a node.

:::info
To determine which UDP ports are open, use the `netstat -tulpn` command.
:::

## Prerequisites

### Learn slashing policy

If a validator processes less than 90% of the expected blocks during a validation round, they will be fined by 101 TON.

Learn more about the [slashing policy](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties).
  
### Running a fullnode

Launch the [Full Node](/v3/guidelines/nodes/running-nodes/full-node) before follow this article.

Ensure that validator mode is enabled by using the `status_modes` command. If it is not enabled, refer to the [MyTonCtrl enable_mode command](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#enable_mode).

## Architecture

![image](/img/nominator-pool/hot-wallet.png)

## View the list of wallets

Check out the list of available wallets in the `MyTonCtrl` console using the `wl` command:

```sh
wl
```

During the installation of `MyTonCtrl`, the installer creates a wallet named `validator_wallet_001`.

![wallet list](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png)

## Activate the wallets

1. Send the necessary number of coins to the wallet and activate it. The minimum stake is approximately __300K TON__, and the maximum is about __1M__ TON. To understand the required amount of coins, please check the current stakes at [tonscan.com](https://tonscan.com/validation). For  more information, see [how maximum and minimum stakes calculated](/v3/documentation/infra/nodes/validation/staking-incentives#values-of-stakes-max-effective-stake).

2. Use the `vas` command to view the history of transfers:

```sh
vas [wallet name]
```

3. Use the `aw` command to activate the wallet. The `wallet name` parameter is optional; if no arguments are provided, all available wallets will be activated.

```sh
aw [wallet name]
```

![account history](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png)

## Your validator is ready to use

**mytoncore** automatically participates in elections by dividing the wallet balance into two parts. These parts are then used as a stake for participation. Additionally, you can manually adjust the stake size:

```sh
set  stake  50000
```

The command above sets the stake size to 50k Toncoins. If the bet is accepted and your node becomes a validator, the stake can only be withdrawn in the second election as per the electorate's rules.

![setting stake](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-set_ru.png)

## Adhere to rules  

:::caution Slashing policy for underperforming validators
If a validator processes less than 90% of the expected number of blocks during a validation round, that validator will incur a fine of 101 TON. For more information, read about the [slashing policy](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties).
:::

As a TON validator, make sure you follow these crucial steps to ensure network stability and avoid slashing penalties in the future.

### Important measures:

1. Follow [@tonstatus](https://t.me/tonstatus), turn on notifications, and be prepared for urgent updates if needed.

2. Make sure that your hardware meets or exceeds the [minimum system requirements](/v3/guidelines/nodes/running-nodes/validator-node#minimal-hardware-requirements).

3. We strongly urge you to utilize [MyTonCtrl](https://github.com/ton-blockchain/mytonctrl).

	- In `MyTonCtrl`, ensure that updates are synchronized with notifications and enable telemetry by setting the option: `set sendTelemetry true`.

4. Set up monitoring dashboards for RAM, disk, network, and CPU usage. For technical assistance, please contact [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).

5. Monitor the efficiency of your validator with dashboards.

	- Please verify with `MyTonCtrl` using the `check_ef` command.

	- Check [Build dashboard with APIs](/v3/guidelines/nodes/running-nodes/validator-node#validation-effectiveness-apis).

:::info
`MyTonCtrl` enables you to evaluate the performance of validators using the command `check_ef`. This command provides efficiency data for both the last round and the current round. The data is retrieved by calling the `checkloadall` utility. Make sure that your efficiency is above 90% for the entire round period.
:::

:::info
If you encounter low efficiency, take action to resolve the issue. If necessary, contact technical support at [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).
:::

## Validation effectiveness APIs

:::info
Please set up dashboards to monitor your validators using the APIs provided below.
:::

### Penalized validators tracker

You can track penalized validators on each round with [@tonstatus_notifications](https://t.me/tonstatus_notifications).

#### Validation API

You can use this [API](https://elections.toncenter.com/docs) to obtain information about current and past validation rounds (cycles) - including the timing of rounds, which validators participated, their stakes, and more. Information regarding current and past elections for each validation round is also available.

#### Efficiency API

You can use this [API](https://toncenter.com/api/qos/index.html#/) to obtain information about the efficiency of validators over time.

This API analyzes data from the catchain to provide an estimate of a validator's efficiency. It serves as an alternative to the `checkloadall` utility.

Unlike `checkloadall`, which only works on validation rounds, this API allows you to set any time interval to analyze a validator's efficiency.

##### Workflow:

1. To the API, provide the ADNL address of your validator along with a time interval (`from_ts`, `to_ts`). For accurate results, choose a sufficient interval, such as 18 hours ago to the present moment.

2. Retrieve the result. If your efficiency percentage is below 80%, your validator is malfunctioning.

3. Your validator must actively participate in validation and use the same ADNL address throughout the specified time period. For example, if a validator contributes to validation every second round, you should only indicate the intervals during which they participated. Failing to do so may result in an inaccurate underestimate. This requirement applies not only to MasterChain validators (with an index < 100) but also to other validators (with an index > 100).

## Support

Contact technical support [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot). This bot is for validators only and will not assist with questions for regular nodes.

If you run a regular node, then contact the group: [@mytonctrl_help](https://t.me/mytonctrl_help).

## See also

* [Run a full node](/v3/guidelines/nodes/running-nodes/full-node)
* [Troubleshooting](/v3/guidelines/nodes/nodes-troubleshooting)
* [Staking incentives](/v3/documentation/infra/nodes/validation/staking-incentives)
<Feedback />




================================================
FILE: docs/v3/guidelines/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/overview.md
================================================
import Feedback from '@site/src/components/Feedback';

# Overview

// TODO: need to be written
<Feedback />




================================================
FILE: docs/v3/guidelines/quick-start/blockchain-interaction/reading-from-network.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/blockchain-interaction/reading-from-network.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import ThemedImage from "@theme/ThemedImage";
import Button from '@site/src/components/button'

# Reading from network

## Introduction

This guide will walk you through reading data from TON Blockchain. You'll learn how to:
- Fetch account information
- Call `get methods`
- Retrieve account transactions

By the end, you'll understand how to interact with [TON HTTP-based APIs](/v3/guidelines/dapps/apis-sdks/ton-http-apis). In this guide, [TON Center](https://toncenter.com/) is used—a fast and reliable HTTP API for TON.

## Set up environment

First, visit the installation pages and install [Node.js and npm](https://nodejs.org/en/download/) for your OS. Check that the installation is correct by running the following commands:

```bash
node -v
npm -v
```

Versions of `node` and `npm` should be at least `v20` and `v10` correspondingly.

## Project setup

Let’s set up your project structure:
1. Create a new directory for your project and navigate into it.
2. Initialize a Node.js project.
3. Install the required dependencies.
4. Initialize TypeScript configuration.

Run these commands in your terminal:

```bash
mkdir reading-from-ton && cd reading-from-ton
npm init -y
npm install typescript ts-node @ton/ton @ton/core @ton/crypto
npx tsc --init
```

To run a TypeScript script saved as `script.ts` in your current directory, run:

```bash
npx ts-node script.ts
```

## Reading account information

Account information includes the `balance`, `state`, `code`, and `data`.
- `balance`: The amount of TON the account holds.
- `state`: Can be one of:
  - **Nonexist**: The address has no data.
  - **Uninit**: The address has a balance but no smart contract code.
  - **Active**: The address is live with code and balance.
  - **Frozen**: The address is locked due to insufficient balance for storage costs.
- `code`: The contract's code in raw format.
- `data`: Serialized contract data stored in a [*Cell*](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage).

Account state may be obtained using the [`getContractState`](https://testnet.toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get/) method.


#### Account's address

To get account information, you need the account's address. In TON, we can use a user-friendly address — a base64url-encoded string that represents a blockchain account in a human-readable and error-resistant format.

User-friendly addresses also include special flags that define how the address should be used. For example, some addresses are valid only on Testnet, while others work on any network. These flags are encoded in the first few bits and influence the first letter of the address:
* Addresses beginning with **E** or **U** are used on **Mainnet**
* Addresses beginning with **k** or **0** are used for **Testnet**

**Mainnet example:**

* `EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF`
* `UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA`

**Testnet example:**

* `kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP`
* `0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK`


#### Your address in the following examples

In the given code snippets, feel free to change the example address to your test wallet address in this line.

```typescript
 // Replace with any address
const accountAddress = Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-');
```


#### Implementation

Create a new file `1-get-account-state.ts`:

```typescript title="1-get-account-state.ts"
import { Address, TonClient } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Replace with any address
  const accountAddress = Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-');

  // Calling method on http api
  const state = await tonClient.getContractState(accountAddress);


  console.log('State: ', state.state);
  console.log('Balance: ', state.balance);
  console.log('Data: ', state.data?.toString('hex'));
  console.log('Code: ', state.code?.toString('hex'));
}

main();
```

Run this example using the following command:

```bash
npx ts-node 1-get-account-state.ts
```

#### Expected result

```bash
State:  active
Balance:  3722511000883n
Data:  b5ee9c7241010101002...fd1e976824402aa67b98
Code:  b5ee9c7241021401000...c9ed54696225e5
```

**Note:** the balance may differ from the example because anyone can send funds to the wallet, so the amount is dynamic and not fixed.

## Calling get methods

Get methods are special functions in smart contracts that allow you to conveniently observe the current state of a smart contract, returning only the **specific data** you need—without having to read the entire account state, as we did in the first example. While reading the whole account provides you with all the information, including balance, code, data, and more, get methods allow you to query **precise pieces of information**, making the process more efficient and developer-friendly.

Their execution:
- Do not charge any fees from contracts.
- Cannot modify the smart contract’s storage or state.

The result of calling a get method via the TON HTTP API is returned in a stack format, which can be deserialised step-by-step using functions like `readNumber()` or others, depending on the expected data type.

#### Why do we need this?
In TON, tokens or jettons are managed via separate contracts called **Jetton wallets**, which are linked to users' main wallet addresses. To interact with a user's tokens, we first need to know the address of their Jetton wallet contract.

The `get_wallet_address` get method on the Jetton master contract allows us to retrieve the **verified Jetton wallet contract address**  for a given user's main wallet address.

In this example, we demonstrate how to call this method to obtain the user's Jetton wallet address.

#### Implementation

Create a new file `2-call-get-method.ts`:

```typescript title="2-call-get-method.ts"
import { Address, TonClient, TupleBuilder } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Building optional get method parameters list
  const builder = new TupleBuilder();

  // Replace with your address
  builder.writeAddress(Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'));

  const accountAddress = Address.parse('kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy')

  // Calling http api to run get method on specific contract
  const result = await tonClient.runMethod(
    accountAddress, // address to call get method on
    'get_wallet_address', // method name
    builder.build(), // optional params list
  );

  // Deserializing get method result
  const rawAddress = result.stack.readAddress();

  console.log("Raw address:", rawAddress.toRawString());
  console.log("User-friendly address:", rawAddress.toString({ bounceable: true, urlSafe: true, testOnly: true}));

}

main();
```

Run this example using the following command:

```bash
npx ts-node 2-call-get-method.ts
```

#### Expected result

```bash
Raw address: 0:25f2bf1ce8f83ed0c0fd73ea27aac77093cdcf900c750b071df7fb0288e019b2
User-friendly address: kQB11H0oDahylXlASZjiDtINlrS0PevVMsvtsbmKmvN5l9np
```

As you can see, the get method returns the contract address in two formats:

* The _raw address_ (hexadecimal format) is how TON represents addresses internally. It’s precise but not very human-friendly.
* The _user-friendly address_  is a readable, safer format designed for sharing and everyday use. It’s easier to work with in wallets and apps.

Both addresses point to the same contract — in this case, the **Jetton wallet contract** associated with the user’s wallet address.


Get methods may also be called using Tonviewer:

1. Navigate to the [get methods section](https://testnet.tonviewer.com/kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy?section=method).
2. Select `get_wallet_address`.
3. Insert the address from the example *0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-* into the slice section.
4. Press **Execute**.

You will end up with the same address you got from the console.

### Using wrappers for simplicity

Wrappers are classes that simplify interactions with smart contracts by turning complex blockchain operations into simple function calls. Instead of manually serializing cells and transactions, you can just call methods like `jettonMaster.getWalletAddress()` that already perform these tasks for you. Here's an example of using a wrapper functionally equivalent to the previous code snippet:

```typescript
import { Address, JettonMaster, TonClient } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Initializing wrappers
  const jettonMaster = tonClient.open(
    JettonMaster.create(Address.parse('kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy')),
  );

  // Calling get method through wrapper
  const address = await jettonMaster.getWalletAddress(Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'));
  console.log(address);
}

main();
```

## Fetching account transactions

Interaction within an account on the blockchain happens due to [messages and transactions](/v3/documentation/smart-contracts/message-management/messages-and-transactions/).

### What is a transaction?

A transaction in TON consists of the following:
- The incoming message that initially triggers the contract (special ways to trigger exist)
- Contract actions caused by the incoming message, such as an update to the contract's storage (optional)
- Outgoing messages generated and sent to other actors (optional)

<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_2.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_2_dark.png?raw=true',
  }}
/>


### Key transaction fields

A transaction obtained from the API has the following structure:

```json5
{
  "address": {
    "account_address": "EQD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje02Zx"
  },
  "utime": 1738588970,
  ...
  "in_msg": {
    ...
  },
  "out_msgs": [...]
}
```
- `address`: The account address where the transaction occurred.
- `utime`: The [unix timestamp](https://www.unixtimestamp.com/) of the transaction.
- `in_msg`: The incoming [message](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-message) that triggered the transaction.
- `out_msgs`: Outgoing messages sent during the transaction.

### What is a message?

A message is a packet of data exchanged between actors (users, applications, or smart contracts). It typically contains information instructing the receiver on what action to perform, such as updating storage or sending a new message.

<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light: '/img/docs/message-delivery/message_delivery_1.png?raw=true',
      dark: '/img/docs/message-delivery/message_delivery_1_dark.png?raw=true',
    }}
  />
</div>

### Key message fields

```json5
{
  "hash": "mcHdqltDAB8ODQHqtedtYQIS6MQL7x4ut+nf9tXWGqg=",
  "source": "EQAJTegD8OO-HksHfI4KVDqb7vW9Dlqi5C1FTcL1dECeosTf",
  "destination": "EQD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje02Zx",
  "value": "20000000",
  ...
  "msg_data": {
    "body": "te6cckEBAQEAAgAAAEysuc0=",
    ...
  },
  ...
}
```
- `hash`: A cryptographic message identifier which is computed after the message is included in a transaction and assigned a [logical time (lt)](/v3/documentation/smart-contracts/message-management/messages-and-transactions/#what-is-a-logical-time), which determines its processing order. The hash is not part of the original message and uniquely identifies the finalized message for integrity verification.
- `source`: The address of the sender (the account that initiated the message).
- `destination`: The address of the receiver (the account that will process the message).
- `value`: The amount of TON (in nanoTON) attached to the message.
- `msg_data`: Contains the message body and state initialization.


#### Implementation

Let’s now try to fetch transactions for an account we control.

Before running this code:
* Go to [Tonviewer](https://testnet.tonviewer.com) and open your Testnet wallet address, which we created earlier in the [Getting Started](/v3/guidelines/quick-start/getting-started#interacting-with-ton-ecosystem) section.
* Send some test TON to yourself using [Testgiver Ton Bot](https://t.me/testgiver_ton_bot/).
* Wait a few seconds and make sure the transaction appears in Tonviewer.

:::important
Make sure you're working in the Testnet, not the Mainnet.

Also, please note that the Testnet API may update data with some delay, so your transaction might not appear immediately when querying through the API.
:::

* Then, create a new file `3-fetch-account-transaction.ts`:

```typescript title="3-fetch-account-transaction.ts"
import { Address, TonClient } from "@ton/ton";

async function main() {
  // Initializaing TON HTTP API Client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Calling method on http api
  // full api: https://testnet.toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get
  const transactions = await tonClient.getTransactions(
    // Replace with your Testnet address to fetch transactions
    Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-'),
    {
      limit: 10,      //maximum ammount of recieved transactions
      archival: true, //search in all history
    },
  );

  const firstTx = transactions[0];
  const { inMessage } = firstTx;

  console.log('Timestamp:', firstTx.now);
  if (inMessage?.info?.type === 'internal') {
    console.log('Value:', inMessage.info.value.coins);
    console.log('Sender:', inMessage.info.src.toString({ testOnly: true }));
  }
}

main();
```

* Replace `Address.parse('0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-')` with your Testnet address.

Run this example using the following command:

```bash
npx ts-node 3-fetch-account-transaction.ts
```

#### Expected result

```bash
Timestamp: 1748338158
Value: 48526800n
Sender: kQDhJ2Kx7dD6FLzAXcqiI4Xsu4ioY6JlE24m9Tx86eGkq0OF
```

:::info
A more complex example of traversing transactions graph may be found [here](/v3/guidelines/dapps/asset-processing/payments-processing/#retrieve-incomingoutgoing-transactions).
:::

## Next step

Now that you’ve learned how to read data from TON Blockchain, it’s time to explore how to **write data to the network**.

Click the button below to continue:

<Button href="/v3/guidelines/quick-start/blockchain-interaction/writing-to-network" colorType={'primary'} sizeType={'sm'}>

  Writing to the network

</Button>


<Feedback />





================================================
FILE: docs/v3/guidelines/quick-start/blockchain-interaction/writing-to-network.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/blockchain-interaction/writing-to-network.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import ThemedImage from "@theme/ThemedImage";
import Button from '@site/src/components/button'

# Writing to the network

In the previous section, you learned how to **read data** from the TON Blockchain. Now, let's explore how to **write data** to it.

## Introduction

This guide will walk you through writing data to TON Blockchain. You'll learn how to:
- Make transactions
- Transfer TON/NFTs

## Set up environment

First, visit the installation pages and install [Node.js and npm](https://nodejs.org/en/download/) for your OS. Check that the installation is correct by running the following commands:

```bash
node -v
npm -v
```

Versions of `node` and `npm` should be at least `v20` and `v10` correspondingly.

## Project setup

Let's set up our project structure:

1. Create a new directory for your project
2. Initialize a Node.js project
3. Install the required dependencies
4. Initialize TypeScript configuration.

Run these commands in your terminal:

```bash
mkdir writing-to-ton && cd writing-to-ton
npm init -y
npm install typescript ts-node @ton/ton @ton/core @ton/crypto
npx tsc --init
```

To run scripts, use the following command:

```bash
npx ts-node script.ts
```

## Sending TON

The simplest interaction between two accounts in TON Blockchain is a TON transfer. The process involves preparing and signing a transaction and then sending it to the blockchain.

A common transfer would look like this:

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1.svg?raw=true',
      dark: '/img/docs/ecosystem-messages-layout/ecosystem_messages_layout_1_dark.svg?raw=true',
    }}
  />
</div>
<br></br>

:::caution
Unlike in the [Reading from network](/v3/guidelines/quick-start/blockchain-interaction/reading-from-network) section, a Toncenter API key is mandatory in the following examples. It may be retrieved using [the following guide](/v3/guidelines/dapps/apis-sdks/api-keys).
:::

#### Implementation

Create a new file `1-send-ton.ts`:

```typescript title="1-send-ton.ts"
import { mnemonicToWalletKey } from "@ton/crypto";
import { comment, internal, toNano, TonClient, WalletContractV3R2, WalletContractV4, WalletContractV5R1 } from "@ton/ton";
import { SendMode } from "@ton/core";

async function main() {
  // Initializing tonClient for sending messages to blockchain
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'YOUR_API_KEY',  //acquire it from: https://t.me/toncenter
  });

  // Using mnemonic to derive public and private keys
  // ATTENTION! Replace on your own mnemonic 24-word phrase that you get from wallet app!
  const mnemonic = "swarm trumpet innocent empty faculty banner picnic unique major taste cigar slogan health neither diary monster jar scale multiply result biology champion genuine outside".split(' ');
  const { publicKey, secretKey } = await mnemonicToWalletKey(mnemonic);

  // Creating wallet depending on version (v5r1 or v4 or V3R2), uncomment which version do you have
  const walletContract = WalletContractV5R1.create({ walletId: { networkGlobalId: -3 }, publicKey }); // networkGlobalId: -3 for Testnet, -239 for Mainnet
  //const walletContract = WalletContractV4.create({ workchain: 0, publicKey });
  //const walletContract = WalletContractV3R2.create({ workchain: 0, publicKey });

  // Opening wallet with tonClient, which allows to send messages to blockchain
  const wallet = tonClient.open(walletContract);

  // Retrieving seqno used for replay protection
  const seqno = await wallet.getSeqno();

  // Sending transfer
  await wallet.sendTransfer({
    seqno,
    secretKey,
    messages: [internal({
      to: wallet.address, // Transfer will be made to the same wallet address
      body: comment('Hello from wallet!'), // Transfer will contain comment
      value: toNano(0.05), // Amount of TON, attached to transfer
    })],
    sendMode: SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS,
  });
}

main();
```

Using `API_KEY` in this case, allows you to access TON functionality through the `endpoint`. By running this script, we authenticate to our wallet through a `public/private key` pair generated from the `mnemonic phrase`. After preparing a transaction, we send it to TON, resulting in a message that the wallet sends to itself with the *'Hello from wallet!'* message.

:::caution Advanced Level
In most scenarios, `SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS` will work, but if you want a deeper understanding, continue reading in the [message modes cookbook](/v3/documentation/smart-contracts/message-management/message-modes-cookbook/).
:::


Run this example using the following command:

```bash
npx ts-node 1-send-ton.ts
```

#### Expected result

Navigate to [Tonviewer](https://testnet.tonviewer.com/) and paste your address into the search bar. You should see a TON transfer with the *'Hello from wallet!'* comment.

## Sending NFTs

[Non-fungible tokens](/v3/guidelines/dapps/asset-processing/nft-processing/nfts/) (NFTs) are assets like a piece of art, digital content, or video that have been tokenized via a blockchain. In TON, NFTs are represented via a collection of smart contracts:
- **NFT Collection**: stores information about the NFT collection.
- **NFT Item**: stores information about the NFT item that the user owns.

To send an NFT, we should first acquire one. The easiest way to do that is to create and deploy your own NFT through [TON Tools](https://ton-collection-edit.vercel.app/deploy-nft-single). Note that the `owner` addresses of your NFT must be your wallet address to be able to perform operations on it.

The basic operation of the [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) in TON is `transfer`. What is actually performed is changing the address of the `owner` in NFT storage to the `new owner`, which is the address of another contract that is now able to perform operations with the `NFT Item`.

:::tip

See [Actors and roles](/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/processing-messages#actors-and-roles) for a more conceptual description.

:::

#### Implementation

Create a new file `2-send-nft.ts`:

```typescript title="2-send-nft.ts"
import { mnemonicToWalletKey } from "@ton/crypto";
import { Address, beginCell, comment, internal, toNano, TonClient, WalletContractV5R1 } from "@ton/ton";
import { SendMode } from "@ton/core";


async function main() {
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'YOUR_API_KEY',  //acquire it from: https://t.me/toncenter
  });

  // Using mnemonic to derive public and private keys
  // ATTENTION! Replace on your own mnemonic 24-word phrase that you get from wallet app!
  const mnemonic = "swarm trumpet innocent empty faculty banner picnic unique major taste cigar slogan health neither diary monster jar scale multiply result biology champion genuine outside".split(' ');
  // Remember that it should be mnemonic of the wallet that you have made an owner of NFT

  const { publicKey, secretKey } = await mnemonicToWalletKey(mnemonic);
  const walletContract = WalletContractV5R1.create({ walletId: { networkGlobalId: -3 }, publicKey });
  const wallet = tonClient.open(walletContract);
  const seqno = await wallet.getSeqno();

  const nftTransferBody = beginCell()
    .storeUint(0x5fcc3d14, 32) // opcode for nft transfer
    .storeUint(0, 64) // query id
    .storeAddress(wallet.address) // address to transfer ownership to
    .storeAddress(wallet.address) // response destination
    .storeBit(0) // no custom payload
    .storeCoins(1) // forward amount - if >0, will send notification message
    .storeMaybeRef(comment('Hello from NFT!'))
    .endCell();

  //The one that you have acquired from https://ton-collection-edit.vercel.app/deploy-nft-single
  const nftAddress = Address.parse('YOUR_NFT_ADDRESS'); 
  // Sending NFT transfer
  await wallet.sendTransfer({
    seqno,
    secretKey,
    messages: [internal({
      to: nftAddress,
      body: nftTransferBody,
      value: toNano(0.05),
    })],
    sendMode: SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS,
  });
}
main();
```

Run this example using the following command:

```bash
npx ts-node 2-send-nft.ts
```

#### Expected result

Navigate to [Tonviewer](https://testnet.tonviewer.com/) and paste your address into the search bar. You should see an NFT transfer with the *'Hello from NFT!'* comment.

## Next step

Now that you’ve learned how to write data to TON Blockchain, it’s time to move on to the next stage—**developing your smart contracts**. You’ll first need to **set up your development environment** with the necessary tools and libraries to do that.

Click the button below to get started:

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/setup-environment" colorType={'primary'} sizeType={'sm'}>

  Setup development environment

</Button>

<Feedback />



================================================
FILE: docs/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Blueprint overview

> **Summary:** In the previous steps, we installed and configured all the tools required for TON smart contract development and created our first project template.

Before we proceed to actual smart contract development, let's briefly describe the project structure and explain how to use the **`Blueprint`**.

## Project structure

:::warning
If you didn't choose the proposed names in the previous steps, source code file names and some of the in-code entities may differ.
:::

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```ls title="Project structure"
Example/
├── contracts/           # Folder containing smart contracts code
│   ├── imports/         # Library imports for contracts
│   │   └── stdlib.fc    # Standard library for FunC
│   └── hello_world.fc   # Main contract file
├── scripts/             # Deployment and on-chain interaction scripts
│   ├── deployHelloWorld.ts     # Script to deploy the contract
│   └── incrementHelloWorld.ts  # Script to interact with the contract
├── tests/               # Test folder for local contract testing
│   └── HelloWorld.spec.ts      # Test specifications for the contract
└── wrappers/            # TypeScript wrappers for contract interaction
    ├── HelloWorld.ts           # Wrapper class for smart contract
    └── HelloWorld.compile.ts   # Script for contract compilation
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```ls title="Project structure"
Example/
├── contracts/           # Folder containing smart contracts code
│   └── hello_world.tolk # Main contract file
├── scripts/             # Deployment and on-chain interaction scripts
│   ├── deployHelloWorld.ts     # Script to deploy the contract
│   └── incrementHelloWorld.ts  # Script to interact with the contract
├── tests/               # Test fo der for local contract testing
│   └── HelloWorld.spec.ts      # Test specifications for the contract
└── wrappers/            # TypeScript wrappers for contract interaction
    ├── HelloWorld.ts           # Wrapper class for smart contract
    └── HelloWorld.compile.ts   # Script for contract compilation
```
</TabItem>
</Tabs>

### `/contracts`

This folder contains your smart contract source code written in one of the available programming languages used for TON Blockchain smart contract development.

### `/scripts`

The `scripts` directory contains `TypeScript` files that help you deploy and interact with your smart contracts on-chain using previously implemented wrappers.

### `/tests`

This directory contains test files for your smart contracts. Testing contracts directly on the TON network is not the best option because deployment requires some amount of time and may lead to losing funds. This testing playground allows you to execute multiple smart contracts and even send messages between them in your **"local network"**. Tests are crucial for ensuring your smart contracts behave as expected before deployment to the network.

### `/wrappers`

To interact with your smart contract off-chain, you need to serialize and deserialize messages sent to it. `Wrapper` classes are developed to mirror your smart contract implementation, making its functionality simple to use.


## Development flow

Almost any smart contract project development consists of five simple steps:

1. Edit the smart contract code in the `/contracts` folder and build it by running the build script:

```bash
npx blueprint build
```

2. Update the smart contract wrapper in the `/wrappers` folder to correspond to changes in the contract.

3. Update tests in the `/tests` folder to ensure the correctness of the new functionality and run the test script:

```bash
npx blueprint test
```

4. Repeat steps 1-3 until you achieve the desired result.

5. Update the deployment script in the `/scripts` folder and run it using this command:

```bash
npx blueprint run
```

:::tip
All examples in this guide follow the sequence of these **1-3 steps** with corresponding code samples. **Step 5**, the deployment process, is covered in the last section of the guide: [Deploying to network](/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/deploying-to-network).
:::

Also, you can always generate the same structure for another smart contract if, for example, you want to create multiple contracts interacting with each other by using the following command:

```bash
npx blueprint create PascalCase # Don't forget to name the contract in PascalCase
```

## Next step

Now you’re all set — it's time to start writing smart contracts. We’ll begin with the basics: **storage** and **get methods**.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/storage-and-get-methods" colorType={'primary'} sizeType={'sm'}>

  Storage & get methods

</Button>

<Feedback />



================================================
FILE: docs/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/deploying-to-network.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/deploying-to-network.mdx
================================================
import Feedback from "@site/src/components/Feedback";

# Deploying to network

> **Summary:** In previous steps, we developed and tested our smart contracts, ensuring their correctness.

In this part of the guide, we will proceed with the deployment of previously developed smart contracts and cover interaction with them on-chain.

## Address and initial state

We already know that [address](/v3/documentation/smart-contracts/addresses/) is a unique identifier of a `smart contract` on the network, used to send transactions and verify the sender upon receiving. However, we still haven't discussed how it's created. The common formula for a smart contract address looks like this:

***address = hash(state_init(code, data))***

The address of a smart contract is a hash of the aggregated initial code and data of the smart contract upon deployment. This simple mechanism has a few important consequences:

### You already know the address

In TON, any address that doesn't have any data is considered in the `nonexistent` state. Nevertheless, when we created a wallet using the wallet app in the [Getting started](/v3/guidelines/quick-start/getting-started) section, we were still able to get the address of our **future** wallet smart contract from the wallet app before its deployment and examine it in the explorer.

The reason behind this is that creating your **private** and **public** key pair through a **mnemonic phrase**, where the second key is part of the initial data of the smart contract, makes the `state_init` of our contract fully determined:
- **code** is one of the standard wallet implementations, like `v5r1`.
- **data** is the `public_key` along with other default initialized fields.

This makes it possible to calculate the future wallet smart contract address.

### Magic storage member

In previous steps, we deliberately didn't explain the purpose of `ctx_id` and `ID` stored in our smart contract's state and why they remained untouched in all the smart contract functionality. Now, their purpose should start to become clearer.

Since we can't deploy a smart contract with the same `state_init`, the only way to provide the same initial code and **"same"** initial data is to create a separate field in it, ensuring additional uniqueness. This, in the case of a wallet, gives you the opportunity to have the same key pair for several wallet smart contracts.

{/*### One to rule them all

If you've already considered that the `ID` field is a must-have for any smart contract, there is another opportunity that could change your mind. Let's examine the previously developed `CounterInternal` smart contract's init section:

```tact
init(id: Int, owner: Address) {
    self.id = id;
    self.counter = 0;
    self.owner = owner;
}
```

If we remove the `id` field from its initial storage, we can ensure that **only one** `CounterInternal` smart contract can exist for a particular owner.

:::info Tokens
This mechanism plays a crucial role in [Jetton Processing](/v3/guidelines/dapps/asset-processing/jettons/). Each non-native (jetton) token requires its own `Jetton Wallet` for a particular owner and, therefore, provides a calculable address for it, creating a **star scheme** with the basic wallet in the center.
:::
*/}
## Implementation

Now that our smart contracts are fully tested, we are ready to deploy them to TON. In `Blueprint`, this process is the same for both `Mainnet` and `Testnet` and for any of the presented languages in the guide: `FunC` or `Tolk`.

### Step 1: update the deployment script

Deployment scripts rely on the same wrappers that you have used in testing scripts. We will use one common script to deploy both of the previously deployed smart contracts. Update `deployHelloWorld.ts` with this code:

```typescript title="/scripts/deployHelloWorld.ts"
// @version TypeScript 5.8.3
import { toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const helloWorld = provider.open(
        HelloWorld.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                ctxCounter: 0,
                ctxCounterExt: 0n,
            },
            await compile('HelloWorld')
        )
    );

    await helloWorld.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(helloWorld.address);

    console.log('ID', await helloWorld.getID());
}
```

### Step 2: run deploy script

You can run the script by entering the following command:

```bash
npx blueprint run deployHelloWorld
```

### Step 3: choose network

After that, you will see an interactive menu allowing you to choose a network:

```bash
? Which network do you want to use? (Use arrow keys)
  mainnet
❯ testnet
  custom
```

:::danger
Before deployment to the `Mainnet`, ensure that your smart contracts correspond to [Security measures](/v3/guidelines/smart-contracts/security/overview/). As we said before, the `HelloWorld` smart contract **doesn't**.
:::

### Step 4: choose wallet app

Next, choose the way to access your wallet. The easiest way to do that is using [TON Connect](/v3/guidelines/ton-connect/overview/) for the most popular wallet apps: `TonKeeper`, `MyTonWallet`, or `Tonhub`.

```bash
? Which wallet are you using? (Use arrow keys)
❯ TON Connect compatible mobile wallet (example: Tonkeeper) 
  Create a ton:// deep link 
  Mnemonic

? Choose your wallet (Use arrow keys)
❯ Tonkeeper 
  MyTonWallet 
  Tonhub
```

Finally, scan the QR code in the terminal through your wallet app and connect the wallet. After you've done that for the first time in the project, this step will be skipped.

You will receive a transaction request in your wallet app each time your code requires currency for a transaction.

### Step 5: observe your smart contract in network

After confirming the request in your wallet and awaiting deployment, you will see a corresponding message with a reference to your newly deployed smart contract view in the explorer:

```bash
Contract deployed at address EQBrFHgzSwxVYBXjIYAM6g2RHbeFebJA8QUDwg4IX8CPDPug
You can view it at https://testnet.tonscan.org/address/EQBrFHgzSwxVYBXjIYAM6g2RHbeFebJA8QUDwg4IX8CPDPug
```

**Congratulations!** Your custom `smart contract` is ready to execute `get methods` the same way as your wallet in the [Getting started](/v3/guidelines/quick-start/getting-started) section and execute `transactions` the same as in the [Blockchain interaction](/v3/guidelines/quick-start/blockchain-interaction/reading-from-network) section — consider reading it to understand how to interact with `smart contracts` off-chain if you haven't already.


:::tip
Using `Blueprint` and wallet apps is not the only option. You can create a message with [state_init](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) by yourself. Moreover, you can do it even through a smart contract's [internal message](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout).
:::

<Feedback />



================================================
FILE: docs/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/processing-messages.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/processing-messages.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Feedback from "@site/src/components/Feedback";
import Button from '@site/src/components/button'

# Processing messages

> **Summary:** In previous steps, we modified our smart contract interaction with `storage`, `get methods`, and learned the basic smart contract development flow.

Now, we are ready to move on to the main functionality of smart contracts — **sending and receiving messages**. In TON, messages are used not only for sending currency but also as a data-exchange mechanism between smart contracts, making them crucial for smart contract development.

:::tip
If you are stuck on some of the examples, you can find the original template project with all modifications performed during this guide [here](https://github.com/ton-community/onboarding-sandbox/tree/main/quick-start/smart-contracts/Example/contracts).
:::

---

## Internal messages

Before we proceed to implementation, let's briefly describe the main ways and patterns that we can use to process internal messages.

### Actors and roles

Since TON implements the [actor](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains/#single-actor) model, it's natural to think about smart contract relations in terms of `roles`, determining who can access smart contract functionality or not. The most common examples of roles are:

- `anyone`: any contract that doesn't have a distinct role.
- `owner`: a contract that has exclusive access to some crucial parts of the functionality.

Let's examine the `recv_internal` function signature to understand how we could use that:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure
```
 - `my_balance` - smart-contract balance at the beginning of the transaction.
 - `msg_value` - funds received with message.
 - `in_msg_full` - `cell` containing "header" fields of the message.
 - `in_msg_body` - [slice](/v3/documentation/smart-contracts/func/docs/types#atomic-types) containing payload of the message.
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk
fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice)
```
 - `myBalance` - balance of smart contract at the beginning of the transaction.
 - `msgValue` - funds received with message.
 - `msgFull` - `cell` containing "header" fields of message.
 - `msgBody` - [slice](/v3/documentation/smart-contracts/func/docs/types#atomic-types) containing payload pf the message.
</TabItem>
</Tabs>

:::info  
You can find a comprehensive description of sending messages in this [section](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout).
:::

What we are specifically interested in is the source address of the message, which we can extract from the `msg_full` cell. By obtaining that address and comparing it to a stored one — we can conditionally allow access to crucial parts of our smart contract functionality. A common approach looks like this:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func
;; This is NOT a part of the project, just an example.
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    ;; Parse the sender address from in_msg_full
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    slice sender_address = cs~load_msg_addr();

    ;; check if message was send by owner
    if (equal_slices_bits(sender_address, owner_address)) {
      ;;owner operations
      return
    } else if (equal_slices_bits(sender_address, other_role_address)){
      ;;other role operations
      return
    } else {
      ;;anyone else operations
      return
    }

    ;;no known operation were obtained for presented role
    ;;0xffff is not standard exit code, but is standard practice among TON developers
    throw(0xffff);
}
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk
// This is NOT a part of the project, just an example.
fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice) {
    // Parse the sender address from in_msg_full
    var cs: slice = msgFull.beginParse();
    val flags = cs.loadMessageFlags();
    var sender_address = cs~load_msg_address();

    if (isSliceBitsEqual(sender_address, owner_address)) {
      // owner operations
      return
    } else if (isSliceBitsEqual(sender_address, other_role_address)){
      // other role operations
      return
    } else {
      // anyone else operations
      return
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}
```
</TabItem>
</Tabs>


### Operations

A common pattern in TON contracts is to include a **32-bit operation code** in message bodies, which tells your contract what action to perform:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func
;; This is NOT a part of the project, just an example!
const int op::increment = 1;
const int op::decrement = 2;

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    ;; Step 1: Check if the message is empty
    if (in_msg_body.slice_empty?()) {
        return; ;; Nothing to do with empty messages
    }

    ;; Step 2: Extract the operation code
    int op = in_msg_body~load_uint(32);

    ;; Step 3-7: Handle the requested operation
    if (op == op::increment) {
        increment();   ;;call to specific operation handler
        return;
    } else if (op == op::decrement) {
        decrement();
        ;; Just accept the money
        return;
    }

    ;; Unknown operation
    throw(0xffff);
}
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk
//This is NOT a part of the project, just an example!
const op::increment : int = 1;
const op::decrement : int = 2;

fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice) {
    // Step 1: Check if the message is empty
    if (slice.isEndOfSlice()) {
        return; // Nothing to do with empty messages
    }

    // Step 2: Extract the operation code
    var op = in_msg_body~load_uint(32);

    // Step 3-7: Handle the requested operation
    if (op == op::increment) {
        increment();   //call to specific operation handler
        return;
    } else if (op == op::decrement) {
        decrement();
        // Just accept the money
        return;
    }

    // Unknown operation
    throw(0xffff);
}
```
</TabItem>
</Tabs>

By combining both of these patterns, you can achieve a comprehensive description of your smart contract's systems, ensuring secure interaction between them and unleashing the full potential of the TON actors model.

## External messages

`External messages` are your only way of toggling smart contract logic from outside the blockchain. Usually, there is no need for implementation of them in smart contracts because, in most cases, you don't want external entry points to be accessible to anyone except you. If this is all the functionality that you want from the external section, the standard way is to delegate this responsibility to a separate actor - [wallet](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#basic-wallets), which is practically the main reason they were designed for.

Developing external endpoints includes several standard [approaches](/v3/documentation/smart-contracts/message-management/external-messages) and [security measures](/v3/guidelines/smart-contracts/security/overview) that might be overwhelming at this point. Therefore, in this guide, we will implement incrementing the previously added `ctx_counter_ext` number.

:::danger
This implementation is **unsafe** and may lead to losing your contract funds. Don't deploy it to `Mainnet`, especially with a high smart contract balance.
:::

## Implementation

Let's modify our smart contract to receive external messages following the standard steps described in the previous [Blueprint overview](/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview) section.

### Step 1: edit smart contract code

Add the `recv_external` function to the `HelloWorld` smart contract:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
() recv_external(slice in_msg) impure {
    accept_message();

    var (ctx_id, ctx_counter, ctx_counter_ext) = load_data();

    var query_id = in_msg~load_uint(64);
    var addr = in_msg~load_msg_addr();
    var coins = in_msg~load_coins();
    var increase_by = in_msg~load_uint(32);

    var msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(coins)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_uint(op::increase, 32)
        .store_uint(query_id, 64)
        .store_uint(increase_by, 32);
    send_raw_message(msg.end_cell(), 0);

    ctx_counter_ext += increase_by;
    save_data(ctx_id, ctx_counter, ctx_counter_ext);

    return ();
}
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/HelloWorld.tolk"
fun acceptExternalMessage(): void
    asm "ACCEPT";

fun onExternalMessage(inMsg: slice) {
    acceptExternalMessage();
    var (ctxId, ctxCounter, ctxCounterExt) = loadData();

    var queryId = inMsg.loadUint(64);
    var addr = inMsg.loadAddress();
    var coins = inMsg.loadCoins();
    var increaseBy = inMsg.loadUint(32);

    var msg = beginCell()
        .storeUint(0x18, 6)
        .storeSlice(addr)
        .storeCoins(coins)
        .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .storeUint(OP_INCREASE, 32)
        .storeUint(queryId, 64)
        .storeUint(increaseBy, 32);
    sendRawMessage(msg.endCell(), 0);

    ctxCounterExt += increaseBy;
    saveData(ctxId, ctxCounter, ctxCounterExt);

    return ();
}
```
</TabItem>
</Tabs>

This function, upon receiving an external message, will increment our `ctx_counter_ext` and also send an internal message to the specified address with the `increase` operation.

Verify that the smart contract code is correct by running:

```bash
npx blueprint build
```

Expected output should look like this:

```bash
✅ Compiled successfully! Cell BOC result:

{
  "hash": "310e49288a12dbc3c0ff56113a3535184f76c9e931662ded159e4a25be1fa28b",
  "hashBase64": "MQ5JKIoS28PA/1YROjU1GE92yekxZi3tFZ5KJb4foos=",
  "hex": "b5ee9c7241010e0100d0000114ff00f4a413f4bcf2c80b01020120020d02014803080202ce0407020120050600651b088831c02456f8007434c0cc1caa42644c383c0040f4c7f4cfcc4060841fa1d93beea5f4c7cc28163c00b817c12103fcbc2000153b513434c7f4c7f4fff4600017402c8cb1fcb1fcbffc9ed548020120090a000dbe7657800b60940201580b0c000bb5473e002b70000db63ffe002606300072f2f800f00103d33ffa40fa00d31f30c8801801cb055003cf1601fa027001cb6a82107e8764ef01cb1f12cb3f5210cb1fc970fb0013a012f0020844ca0a"
}

✅ Wrote compilation artifact to build/HelloWorld.compiled.json
```

### Step 2: update wrapper

Add a wrapper method to call it through our wrapper class for sending external messages:

```typescript title="/wrappers/HelloWorld.ts"
async sendExternalIncrease(
    provider: ContractProvider,
    opts: {
        increaseBy: number;
        value: bigint;
        addr: Address;
        queryID?: number;
    }
) {
    const message = beginCell()
        .storeUint(opts.queryID ?? 0, 64)
        .storeAddress(opts.addr)
        .storeCoins(opts.value)
        .storeUint(opts.increaseBy, 32)
    .endCell()

    return await provider.external(message);
}
```

### Step 3: update test

Update the test to ensure that the `HelloWorld` contract received the external message, and updated its counters:

```typescript title="/tests/HelloWorld.spec.ts"
//@version TypeScript 5.8.3
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano} from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('HelloWorld', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HelloWorld');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let helloWorld: SandboxContract<HelloWorld>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        helloWorld = blockchain.openContract(
            HelloWorld.createFromConfig(
                {
                    id: 0,
                    ctxCounter: 0,
                    ctxCounterExt: 0n,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await helloWorld.sendDeploy(deployer.getSender(), toNano('1.00'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: helloWorld.address,
            deploy: true,
            success: true,
        });
    });

    it('should receive external message and update counter', async () => {
        const [__, counterExtBefore] = await helloWorld.getCounters()
        const increase = 5;

        const result = await helloWorld.sendExternalIncrease({
            increaseBy: increase,
            value: toNano(0.05),
            addr: deployer.address, // Using deployer address
            queryID: 0
        });

        expect(result.transactions).toHaveTransaction({
            from: undefined, // External messages have no 'from' address
            to: helloWorld.address,
            success: true,
        });

        const [_, counterExt] = await helloWorld.getCounters()
        expect(counterExtBefore + BigInt(increase)).toBe(counterExt);
    });
});
```

{/*This test describes the common transaction flow of any `multi-contract` system:
1. Send an external message to toggle the smart contract logic outside the blockchain.
2. Trigger one or more internal messages to be sent to other contracts.  
3. Upon receiving an internal message, change the contract state and repeat **step 2** if required.

Since the resulting sequence of transactions might be overwhelming for understanding, it's a good practice to create a `sequence diagram` describing your system. Here is an example of our case:

<div style={{marginBottom: '30px'}} align="center">
  <img src="/img/tutorials/quick-start/multi-contract.png" alt="Multi-contract scheme"/>
</div> */}

Verify that all examples are correct by running the test script:

```bash
npx blueprint test
```

Expected output should look like this:

```bash
 PASS  tests/HelloWorld.spec.ts
  HelloWorld
    ✓ should receive external message and update counter (251 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.841 s, estimated 2 s
Ran all test suites.

```

## Next step

Now that you understand how smart contracts send and receive messages, you can **deploy your contract** to TON Blockchain.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/deploying-to-network" colorType={'primary'} sizeType={'sm'}>

  Deploying to network

</Button>

<Feedback />



================================================
FILE: docs/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/storage-and-get-methods.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/storage-and-get-methods.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Storage and get methods

> **Summary:** In the previous steps, we learned how to use the `Blueprint` and its project structure.

:::tip
If you're stuck on any of the examples, you can find the original template project with all modifications made during this guide [here](https://github.com/ton-community/onboarding-sandbox/tree/main/quick-start/smart-contracts/Example/contracts).
:::

Almost all smart contracts need to store their `data` between transactions. This guide explains standard ways to manage `storage` for smart contracts and how to use `get methods` to access it outside the blockchain.

## Smart contract storage operations

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
There are two main instructions that provide access to smart contract storage:

 - `get_data()` returning the current storage cell.
 - `set_data()` setting storage cell.

</TabItem>
<TabItem value="Tolk" label="Tolk">
There are two main instructions that provide access to smart contract storage: 

 - `getContractData()` returning current storage `Cell`.
 - `setContractData()` setting storage `Cell`.

</TabItem>
</Tabs>

Let's examine the [Cell](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) structure to understand how to manage contract storage:

## Cell structure

TON Blockchain uses a data structure called **Cell** as the fundamental unit for storing data. Cells are the building blocks of smart contract data and have the following characteristics:

- A Cell can store up to 1023 bits (approximately 128 bytes) of data.
- A Cell can reference up to 4 other Cells (children).
- A Cell is immutable once created.

You can think of a Cell as the following structure:

```typescript
// Conceptual representation of a Cell
interface Cell {
  bits: BitString; // Up to 1023 bits
  refs: Cell[];    // Up to 4 child cells
}
```

## Implementation

Let's modify our smart contract by following the standard steps described in the previous [Blueprint overview](/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview) section.

### Step 1: edit smart contract code

If manually serializing and deserializing the storage cell becomes inconvenient, a common practice is to define two wrapper methods that handle this logic. If you haven't modified the smart contract code, it should include the following lines in the `/contracts/hello_world.fc`:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
global int ctx_id;
global int ctx_counter;

;; load_data populates storage variables using stored data
() load_data() impure {
    var ds = get_data().begin_parse();

    ctx_id = ds~load_uint(32);
    ctx_counter = ds~load_uint(32);

    ds.end_parse();
}

;; save_data stores storage variables as a cell into persistent storage
() save_data() impure {
    set_data(
        begin_cell()
            .store_uint(ctx_id, 32)
            .store_uint(ctx_counter, 32)
            .end_cell()
    );
}
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world.tolk"
global ctxID: int;
global ctxCounter: int;

// loadData populates storage variables from persistent storage
fun loadData() {
    var ds = getContractData().beginParse();

    ctxID = ds.loadUint(32);
    ctxCounter = ds.loadUint(32);

    ds.assertEndOfSlice();
}

// saveData stores storage variables as a cell into persistent storage
fun saveData() {
    setContractData(
        beginCell()
        .storeUint(ctxID, 32)
        .storeUint(ctxCounter, 32)
        .endCell());
}
```
</TabItem>
</Tabs>

#### Managing storage

Let's modify our example slightly by exploring another common storage management approach in smart contract development:

Rather than initializing global variables, we'll:
1. Pass storage members as parameters via `save_data(members...)`.
2. Retrieve them using `(members...) = get_data()`.
3. Move the global variables `ctx_id` and `ctx_counter` into the method bodies.

Also let's add an additional **256-bit integer** to our storage as `ctx_counter_ext` global variable. The modified implementation should appear as follows:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
(int, int, int) load_data() {
    var ds = get_data().begin_parse();

    int ctx_id = ds~load_uint(32);
    int ctx_counter = ds~load_uint(32);
    int ctx_counter_ext = ds~load_uint(256);

    ds.end_parse();

    return (ctx_id, ctx_counter, ctx_counter_ext);
}

() save_data(int ctx_id, int ctx_counter, int ctx_counter_ext) impure {
    set_data(
        begin_cell()
            .store_uint(ctx_id, 32)
            .store_uint(ctx_counter, 32)
            .store_uint(ctx_counter_ext, 256)
        .end_cell()
    );
}
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world.tolk"
// load_data retrieves variables from TVM storage cell
// impure because of writting into global variables
fun loadData(): (int, int, int) {
    var ds = getContractData().beginParse();

    // id is required to be able to create different instances of counters
    // since addresses in TON depend on the initial state of the contract
    var ctxID = ds.loadUint(32);
    var ctxCounter = ds.loadUint(32);
    var ctxCounterExt = ds.loadUint(256);

    ds.assertEndOfSlice();

    return (ctxID, ctxCounter, ctxCounterExt);
}

// saveData stores storage variables as a cell into persistent storage
fun saveData(ctxID: int, ctxCounter: int, ctxCounterExt: int) {
    setContractData(
        beginCell()
        .storeUint(ctxID, 32)
        .storeUint(ctxCounter, 32)
        .storeUint(ctxCounterExt, 256)
        .endCell()
    );
}
```
</TabItem>
</Tabs>

Remember to:
1. Remove the global variables `ctx_id` and `ctx_counter`
2. Update the function usage by copying storage members locally as shown:

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
;; load_data() on:
var (ctx_id, ctx_counter, ctx_counter_ext) = load_data();

;; save_data() on:
save_data(ctx_id, ctx_counter, ctx_counter_ext);
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world.tolk"
// loadData() on:
var (ctxID, ctxCounter, ctxCounterExt) = loadData();

// saveData() on:
saveData(ctxID, ctxCounter, ctxCounterExt);
```
</TabItem>
</Tabs>

#### Get methods

The main purpose of `get methods` is to provide an external read access to storage data through a convenient interface — primarily to extract the information needed for preparing **transactions**.
Let's add a getter function that returns both the main and extended counter values stored in the smart contract.

<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
(int, int) get_counters() method_id {
    var (_, ctx_counter, ctx_counter_ext) = load_data();
    return (ctx_counter, ctx_counter_ext);
}
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world.tolk"
get get_counters(): (int, int) {
    var (_, ctxCounter, ctxCounterExt) = loadData();
    return (ctxCounter, ctxCounterExt);
}
```
</TabItem>
</Tabs>

And don’t forget to update the variables in the get methods to match the unpacking from `load_data()`.


<Tabs groupId="language">
  <TabItem value="FunC" label="FunC">
    ```func title="/contracts/hello_world.fc"
    int get_counter() method_id {
    var (_, ctx_counter, _) = load_data();
    return ctx_counter;
  }

    int get_id() method_id {
    var (ctx_id, _, _) = load_data();
    return ctx_id;
  }
    ```
  </TabItem>
  <TabItem value="Tolk" label="Tolk">
    ```tolk title="/contracts/hello_world.tolk"
    get currentCounter(): int {
    var (ctxID, ctxCounter, ctxCounterExt) = loadData();
    return ctxCounter;
  }

    get initialId(): int {
    var (ctxID, ctxCounter, ctxCounterExt) = loadData();
    return ctxID;
  }
    ```
  </TabItem>
</Tabs>


And that's all! In practice, all **get methods** follow this straightforward pattern and require no additional complexity. Remember, you can ignore return values using the `_` placeholder syntax.

Here's the final smart contract implementation:
<Tabs groupId="language">
<TabItem value="FunC" label="FunC">
```func title="/contracts/hello_world.fc"
#include "imports/stdlib.fc";

const op::increase = "op::increase"c; ;; create an opcode from string using the "c" prefix, this results in 0x7e8764ef opcode in this case

(int, int, int) load_data() {
    var ds = get_data().begin_parse();

    int ctx_id = ds~load_uint(32);
    int ctx_counter = ds~load_uint(32);
    int ctx_counter_ext = ds~load_uint(256);

    ds.end_parse();

    return (ctx_id, ctx_counter, ctx_counter_ext);
}

() save_data(int ctx_id, int ctx_counter, int ctx_counter_ext) impure {
    set_data(
        begin_cell()
            .store_uint(ctx_id, 32)
            .store_uint(ctx_counter, 32)
            .store_uint(ctx_counter_ext, 256)
        .end_cell()
    );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore all empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }

    var (ctx_id, ctx_counter, ctx_counter_ext) = load_data(); ;; here we populate the storage variables

    int op = in_msg_body~load_uint(32); ;; by convention, the first 32 bits of incoming message is the op
    int query_id = in_msg_body~load_uint(64); ;; also by convention, the next 64 bits contain the "query id", although this is not always the case

    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data(ctx_id, ctx_counter, ctx_counter_ext);
        return ();
    }

    throw(0xffff); ;; if the message contains an op that is not known to this contract, we throw
}

int get_counter() method_id {
    var (_, ctx_counter, _) = load_data();
    return ctx_counter;
}

int get_id() method_id {
    var (ctx_id, _, _) = load_data();
    return ctx_id;
}

(int, int) get_counters() method_id {
    var (_, ctx_counter, ctx_counter_ext) = load_data();
    return (ctx_counter, ctx_counter_ext);
}
```
</TabItem>
<TabItem value="Tolk" label="Tolk">
```tolk title="/contracts/hello_world.tolk"
const OP_INCREASE = 0x7e8764ef;  // arbitrary 32-bit number, equal to OP_INCREASE in wrappers/CounterContract.ts

fun loadData(): (int, int, int) {
    var ds = getContractData().beginParse();

    var ctxID = ds.loadUint(32);
    var ctxCounter = ds.loadUint(32);
    var ctxCounterExt = ds.loadUint(256);

    ds.assertEndOfSlice();

    return (ctxID, ctxCounter, ctxCounterExt);
}

fun saveData(ctxID: int, ctxCounter: int, ctxCounterExt: int) {
    setContractData(
        beginCell()
        .storeUint(ctxID, 32)
        .storeUint(ctxCounter, 32)
        .storeUint(ctxCounterExt, 256)
        .endCell()
    );
}

fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice) {
    if (msgBody.isEndOfSlice()) { // ignore all empty messages
        return;
    }

    var cs: slice = msgFull.beginParse();
    val flags = cs.loadMessageFlags();
    if (isMessageBounced(flags)) { // ignore all bounced messages
        return;
    }

    var (ctxID, ctxCounter, ctxCounterExt) = loadData(); // here we populate the storage variables

    val op = msgBody.loadMessageOp(); // by convention, the first 32 bits of incoming message is the op
    val queryID = msgBody.loadMessageQueryId(); // also by convention, the next 64 bits contain the "query id", although this is not always the case

    if (op == OP_INCREASE) {
        val increaseBy = msgBody.loadUint(32);
        ctxCounter += increaseBy;
        saveData(ctxID, ctxCounter, ctxCounterExt);
        return;
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}

get currentCounter(): int {
    var (ctxID, ctxCounter, ctxCounterExt) = loadData();
    return ctxCounter;
}

get initialId(): int {
    var (ctxID, ctxCounter, ctxCounterExt) = loadData();
    return ctxID;
}

get get_counters(): (int, int) {
    var (_, ctxCounter, ctxCounterExt) = loadData();
    return (ctxCounter, ctxCounterExt);
}
```
</TabItem>
</Tabs>

Before proceeding, verify your changes by compiling the smart contract:

```bash
npx blueprint build
```

The expected output should look like this:

```bash
Build script running, compiling HelloWorld

✅ Compiled successfully! Cell BOC result:

{
  "hash": "310e49288a12dbc3c0ff56113a3535184f76c9e931662ded159e4a25be1fa28b",
  "hashBase64": "MQ5JKIoS28PA/1YROjU1GE92yekxZi3tFZ5KJb4foos=",
  "hex": "b5ee9c7241010e0100d0000114ff00f4a413f4bcf2c80b01020120020d02014803080202ce0407020120050600651b088831c02456f8007434c0cc1caa42644c383c0040f4c7f4cfcc4060841fa1d93beea5f4c7cc28163c00b817c12103fcbc2000153b513434c7f4c7f4fff4600017402c8cb1fcb1fcbffc9ed548020120090a000dbe7657800b60940201580b0c000bb5473e002b70000db63ffe002606300072f2f800f00103d33ffa40fa00d31f30c8801801cb055003cf1601fa027001cb6a82107e8764ef01cb1f12cb3f5210cb1fc970fb0013a012f0020844ca0a"
}

✅ Wrote compilation artifact to build/HelloWorld.compiled.json
```

This means the HelloWorld contract was successfully compiled. A hash was generated, and the compiled code was saved to `build/HelloWorld.compiled.json`.

### Step 2: update wrapper

Next, we'll update our wrapper class to align with the new storage layout and `get method`. We need to:

1. Modify the `helloWorldConfigToCell` function.
2. Update the `HelloWorldConfig` type.
3. Ensure proper storage initialization during contract creation.
4. Include the 256-bit `ctxCounterExt` field we added earlier.

These changes will maintain consistency with our smart contract modifications.

```typescript title="/wrappers/HelloWorld.ts"
// @version TypeScript 5.8.3
export type HelloWorldConfig = {
    id: number;
    ctxCounter: number;
    ctxCounterExt: bigint;
};

export function helloWorldConfigToCell(config: HelloWorldConfig): Cell {
    return beginCell()
        .storeUint(config.id, 32)
        .storeUint(config.ctxCounter, 32)
        .storeUint(config.ctxCounterExt, 256)
    .endCell();
}
```

Next, implement a method to call the new `get_counters` smart contract get method, which retrieves both counter values in a single request:

```typescript title="/HelloWorld.ts"
async getCounters(provider: ContractProvider) : Promise<[number, bigint]> {
    const result = await provider.get('get_counters', []);
    const counter = result.stack.readNumber();
    const counterExt = result.stack.readBigNumber();

    return [counter, counterExt]
}
```

### Step 3: update tests

Finally, let's test the new functionality using our updated wrapper:

1. Initialize the contract storage by creating a `helloWorldConfig` with test values.
2. Execute each `get` method to retrieve stored data.
3. Validate that values match the initial configuration.

Example implementation:

```typescript title="/tests/HelloWorld.spec.ts"
// @version TypeScript 5.8.3
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano} from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('HelloWorld', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HelloWorld');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let helloWorld: SandboxContract<HelloWorld>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        helloWorld = blockchain.openContract(
            HelloWorld.createFromConfig(
                {
                    id: 0,
                    ctxCounter: 0,
                    ctxCounterExt: 0n,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await helloWorld.sendDeploy(deployer.getSender(), toNano('1.00'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: helloWorld.address,
            deploy: true,
            success: true,
        });
    });

    it('should correctly initialize and return the initial data', async () => {
        // Define the expected initial values (same as in beforeEach)
        const expectedConfig = {
            id: 0,
            counter: 0,
            counterExt: 0n
        };

        // Log the initial configuration values before verification
        console.log('Initial configuration values (before deployment):');
        console.log('- ID:', expectedConfig.id);
        console.log('- Counter:', expectedConfig.counter);
        console.log('- CounterExt:', expectedConfig.counterExt);

        console.log('Retrieved values after deployment:');
        // Verify counter value
        const counter = await helloWorld.getCounter();
        console.log('- Counter:', counter);
        expect(counter).toBe(expectedConfig.counter);

        // Verify ID value
        const id = await helloWorld.getID();
        console.log('- ID:', id);
        expect(id).toBe(expectedConfig.id);

        // Verify counterExt
        const [_, counterExt] = await helloWorld.getCounters();
        console.log('- CounterExt', counterExt);
        expect(counterExt).toBe(expectedConfig.counterExt);
    });

    // ... previous tests
});
```

Now you can run the new test script with this command:

```bash
npx blueprint test
```

The expected output should look like this:

```bash
# "custom log messages"

 PASS  tests/HelloWorld.spec.ts
  HelloWorld
    ✓ should correctly initialize and return the initial data (431 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.591 s, estimated 6 s
```

## Next step

You’ve written your first smart contract using FunC or Tolk, tested it, and explored how storage and get methods work.

Now it’s time to move on to one of the most important parts of smart contracts —**processing messages:** sending and receiving them.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/processing-messages" colorType={'primary'} sizeType={'sm'}>

  Processing messages

</Button>

<Feedback />



================================================
FILE: docs/v3/guidelines/quick-start/developing-smart-contracts/setup-environment.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/developing-smart-contracts/setup-environment.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Button from '@site/src/components/button'

# Setup development environment

> **Summary:** In the previous steps, we learned the concept of a smart contract and basic ways of interacting with TON Blockchain through **wallet apps** and **explorers**.

This guide covers the basic steps of setting up your smart contract development environment using **`Blueprint`** and creating a basic project template.

## Prerequisites

- Basic programming skills.
- Familiarity with the command-line interface.

## Setup development environment

For this guide, we will rely on the [Blueprint](https://github.com/ton-org/blueprint/) and [Node.js](https://nodejs.org/en)/TypeScript stack for writing wrappers, tests, and deployment scripts for your smart contract, as it provides the easiest, ready-to-use environment for smart contract development.

:::info
Using native tools and language-dependent SDKs for smart contract development is covered in more advanced sections here:
- [Compile and build smart contracts on TON](/v3/documentation/archive/compile#ton-compiler).
- [Creating state init for deployment](/v3/guidelines/smart-contracts/howto/wallet#creating-the-state-init-for-deployment).
:::

### Step 1: install Node.js

First, visit the [installation page](https://nodejs.org/en/download) and execute the download commands in `PowerShell` or `Bash` corresponding to your operating system (Windows/Linux).

Check that `npm` and `node` are installed by executing the following command:

```bash
npm -v
node -v
```

### Step 2: choose a smart contract development language

During the guide, we provide examples in `FunC`, `Tolk`, and `Tact`. You can choose any of them and even combine smart contracts in different languages. To proceed through the guide, there is no need for a deep understanding of the chosen language—basic programming skills will be enough.

:::info
You can find a brief overview of the languages here: [Programming languages](/v3/documentation/smart-contracts/overview#programming-languages).
:::

### Step 3: set up Blueprint

Change the directory to the parent folder of your future project and run the following command:

```bash
npm create ton@latest
```

This will run an interactive script to create the project template. You can enter anything you want, but if you want to follow the same paths as in this guide, choose the following:

1. **Project name**: `Example`  
2. **First contract name**: `HelloWorld`  
3. **Project template**: a **simple counter contract** in `FunC`, `Tolk` or `Tact`

Finally, change your current directory to the generated project template folder and install all required dependencies:

```bash
cd ./Example
npm install
```

### Step 4 (optional): IDE and editor support

The TON community has developed plugins that provide syntax support for several IDEs and code editors. You can find them here: [plugin list](/v3/documentation/smart-contracts/getting-started/ide-plugins).

Also, consider installing plugins that support **JavaScript/TypeScript** tools for your preferred IDE or code editor, specifically `Jest`, for debugging smart contract tests.



## Choose the programming language

Now that your environment is set up choose a programming language to get started:

- **FunC or Tolk**: estimated time to learn is 25 min for each.
- **Tact**: estimated time to learn is 15 min.


<Button href="/v3/guidelines/quick-start/developing-smart-contracts/func-tolk-folder/blueprint-sdk-overview" colorType="primary" sizeType={'sm'}>
  Start with FunC or Tolk

</Button>


<Button href="/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-blueprint-sdk-overview" colorType={'secondary'} sizeType={'sm'}>

  Start with Tact

</Button>



<Feedback />



================================================
FILE: docs/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-blueprint-sdk-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-blueprint-sdk-overview.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Blueprint overview

> **Summary:** In the previous steps, we installed and configured all the tools required for TON smart contract development and created our first project template.

:::info
We recommend installing the [Tact extension for VS Code](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact). It offers syntax highlighting, error hints, and a smoother development experience.
:::

Before we proceed to actual smart contract development, let's briefly describe the project structure and explain how to use the **`Blueprint`**.

## Project structure

:::warning
If you didn't choose the proposed names in the previous steps, source code file names and some of the in-code entities may differ.
:::

<Tabs groupId="language">
  <TabItem value="Tact" label="Tact">
    ```ls title="Project structure"
    Example/
    ├── contracts/           # Folder containing smart contracts code
    │   ├── hello_world.tact   # Main contract file
    ├── scripts/             # Deployment and on-chain interaction scripts
    │   ├── deployHelloWorld.ts     # Script to deploy the contract
    │   └── incrementHelloWorld.ts  # Script to interact with the contract
    ├── tests/               # Test folder for local contract testing
    │   └── HelloWorld.spec.ts      # Test specifications for the contract
    └── wrappers/            # TypeScript wrappers for contract interaction
    ├── HelloWorld.ts           # Wrapper class for smart contract
    └── HelloWorld.compile.ts   # Script for contract compilation
    ```
  </TabItem>

</Tabs>

### `/contracts`

This folder contains your smart contract source code written in one of the available programming languages used for TON Blockchain smart contract development.

### `/scripts`

The `scripts` directory contains `TypeScript` files that help you deploy and interact with your smart contracts on-chain using previously implemented wrappers.

### `/tests`

This directory contains test files for your smart contracts. Testing contracts directly on the TON network is not the best option because deployment requires some amount of time and may lead to losing funds. This testing playground allows you to execute multiple smart contracts and even send messages between them in your **"local network"**. Tests are crucial for ensuring your smart contracts behave as expected before deployment to the network.

### `/wrappers`

To interact with your smart contract off-chain, you need to serialize and deserialize messages sent to it. `Wrapper` classes are developed to mirror your smart contract implementation, making its functionality simple to use.


## Development flow

Almost any smart contract project development consists of five simple steps:

1. Edit the smart contract code in the `/contracts` folder and build it by running the build script:

```bash
npx blueprint build
```

2. Update the smart contract wrapper in the `/wrappers` folder to correspond to changes in the contract.

3. Update tests in the `/tests` folder to ensure the correctness of the new functionality and run the test script:

```bash
npx blueprint test
```

4. Repeat steps 1-3 until you achieve the desired result.

5. Update the deployment script in the `/scripts` folder and run it using this command:

```bash
npx blueprint run
```

:::tip
All examples in this guide follow the sequence of these **1-3 steps** with corresponding code samples. **Step 5**, the deployment process, is covered in the last section of the guide: [Deploying to network](/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-deploying-to-network).
:::

Also, you can always generate the same structure for another smart contract if, for example, you want to create multiple contracts interacting with each other by using the following command:

```bash
npx blueprint create PascalCase # Don't forget to name the contract in PascalCase
```

## Next step

Now you’re all set — it's time to start writing smart contracts. We’ll begin with the basics: **storage** and **get methods**.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-storage-and-get-methods" colorType={'primary'} sizeType={'sm'}>

  Storage & get methods

</Button>

<Feedback />



================================================
FILE: docs/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-deploying-to-network.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-deploying-to-network.mdx
================================================
import Feedback from "@site/src/components/Feedback";

# Deploying to network

> **Summary:** In previous steps, we developed and tested our smart contracts, ensuring their correctness.

In this part of the guide, we will proceed with the deployment of previously developed smart contracts and cover interaction with them on-chain.

## Address and initial state

We already know that [address](/v3/documentation/smart-contracts/addresses/) is a unique identifier of a `smart contract` on the network, used to send transactions and verify the sender upon receiving. However, we still haven't discussed how it's created. The common formula for a smart contract address looks like this:

***address = hash(state_init(code, data))***

The address of a smart contract is a hash of the aggregated initial code and data of the smart contract upon deployment. This simple mechanism has a few important consequences:

### You already know the address

In TON, any address that doesn't have any data is considered in the `nonexistent` state. Nevertheless, when we created a wallet using the wallet app in the [Getting started](/v3/guidelines/quick-start/getting-started) section, we were still able to get the address of our **future** wallet smart contract from the wallet app before its deployment and examine it in the explorer.

The reason behind this is that creating your **private** and **public** key pair through a **mnemonic phrase**, where the second key is part of the initial data of the smart contract, makes the `state_init` of our contract fully determined:
- **code** is one of the standard wallet implementations, like `v5r1`.
- **data** is the `public_key` along with other default initialized fields.

This makes it possible to calculate the future wallet smart contract address.

### Magic storage member

In previous steps, we deliberately didn't explain the purpose of `ctxID` and `ID` stored in our smart contract's state and why they remained untouched in all the smart contract functionality. Now, their purpose should start to become clearer.

Since we can't deploy a smart contract with the same `state_init`, the only way to provide the same initial code and **"same"** initial data is to create a separate field in it, ensuring additional uniqueness. This, in the case of a wallet, gives you the opportunity to have the same key pair for several wallet smart contracts.

### One to rule them all

If you've already considered that the `ID` field is a must-have for any smart contract, there is another opportunity that could change your mind. Let's examine the previously developed `HelloWorld` smart contract's init section:

```tact
init(id: Int, owner: Address) {
    self.id = id;
    self.counter = 0;
    self.owner = owner;
}
```

If we remove the `id` field from its initial storage, we can ensure that **only one** `HelloWorld` smart contract can exist for a particular owner.

:::info Tokens
This mechanism plays a crucial role in [Jetton processing](/v3/guidelines/dapps/asset-processing/jettons). Each non-native (jetton) token requires its own `Jetton Wallet` for a particular owner and, therefore, provides a calculable address for it, creating a **star scheme** with the basic wallet in the center.
:::

## Implementation

Now that our smart contracts are fully tested, we are ready to deploy them to TON. In `Blueprint`, this process is the same for both `Mainnet` and `Testnet` and for any of the presented languages in the guide: `FunC`, `Tact`, or `Tolk`.

### Step 1: update the deployment script

Deployment scripts rely on the same wrappers that you have used in testing scripts. We will use one common script to deploy both of the previously deployed smart contracts. Update `deployHelloWorld.ts` with this code:

```typescript title="/scripts/deployHelloWorld.ts"
// @version TypeScript 5.8.3
import { toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sender = provider.sender();
    if (!sender.address) {
        throw new Error('Sender address is required');
    }

    const helloWorld = provider.open(
        await HelloWorld.fromInit(0n, sender.address)
    );

    await helloWorld.send(
        sender,
        { value: toNano('0.05') },
        null
    );

    await provider.waitForDeploy(helloWorld.address);

    console.log('ID', await helloWorld.getId());
}
```

### Step 2: run deploy script

You can run the script by entering the following command:

```bash
npx blueprint run deployHelloWorld
```

### Step 3: choose network

After that, you will see an interactive menu allowing you to choose a network:

```bash
? Which network do you want to use? (Use arrow keys)
  mainnet
❯ testnet
  custom
```

:::danger
Before deployment to the `Mainnet`, ensure that your smart contracts correspond to [Security measures](/v3/guidelines/smart-contracts/security/overview). As we said before, the `HelloWorld` smart contract **doesn't**.
:::

### Step 4: choose wallet app

Next, choose the way to access your wallet. The easiest way to do that is using [TON Connect](/v3/guidelines/ton-connect/overview/) for the most popular wallet apps: `TonKeeper`, `MyTonWallet`, or `Tonhub`.

```bash
? Which wallet are you using? (Use arrow keys)
❯ TON Connect compatible mobile wallet (example: Tonkeeper)
  Create a ton:// deep link
  Mnemonic

? Choose your wallet (Use arrow keys)
❯ Tonkeeper
  MyTonWallet
  Tonhub
```

Finally, scan the QR code in the terminal through your wallet app and connect the wallet. After you've done that for the first time in the project, this step will be skipped.

You will receive a transaction request in your wallet app each time your code requires currency for a transaction.

### Step 5: observe your smart contract in network

After confirming the request in your wallet and awaiting deployment, you will see a corresponding message with a reference to your newly deployed smart contract view in the explorer:

```bash
Contract deployed at address EQBrFHgzSwxVYBXjIYAM6g2RHbeFebJA8QUDwg4IX8CPDPug
You can view it at https://testnet.tonscan.org/address/EQBrFHgzSwxVYBXjIYAM6g2RHbeFebJA8QUDwg4IX8CPDPug
```

**Congratulations!** Your custom `smart contract` is ready to execute `get methods` the same way as your wallet in the [Getting started](/v3/guidelines/quick-start/getting-started#navigation-tabs) section and execute `transactions` the same as in the [Blockchain interaction](/v3/guidelines/quick-start/blockchain-interaction/reading-from-network) section — consider reading it to understand how to interact with `smart contracts` off-chain if you haven't already.

:::tip
Using `Blueprint` and wallet apps is not the only option. You can create a message with [state_init](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) by yourself. Moreover, you can do it even through a smart contract's [internal message](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout).
:::


## What’s next?
You’ve made it through the guide — great job!
Now, it’s time to dive deeper and keep building. Here are some helpful resources to continue *your Tact journey*:
- [Official website](https://tact-lang.org) - overview, news, and ecosystem links
- [Tact documentation](https://docs.tact-lang.org) — the go-to reference for language features
- [Tact github repo](https://github.com/tact-lang) — source code, issues, and contributions
- [Tact by example](https://tact-by-example.org/all) — hands-on smart contract examples
- [Tact smart battle](https://github.com/ton-studio/tact-smart-battle) — coding challenges to sharpen your skills
- [@tact_kitchen](https://t.me/tact_kitchen) — channel with the latest Tact updates
- [@tactlang](https://t.me/tactlang) — chat for dev discussions and help

Stay curious, build boldly, and don’t hesitate to ask questions — the Tact community is here for you!

<Feedback />



================================================
FILE: docs/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-storage-and-get-methods.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-storage-and-get-methods.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Storage and get methods

> **Summary:** In the previous steps, we learned how to use the `Blueprint SDK` and its project structure.

:::info
For more details, refer to the [Tact documentation](https://docs.tact-lang.org/#start/) and [Tact By Example](https://tact-by-example.org/00-hello-world/).
:::


Smart contracts often need to store data, like counters or ownership information, and provide a way to read or update it through messages. In this section, you’ll learn how to define and initialize contract storage, receive and handle incoming messages, and create getter functions to read contract states outside the blockchain.

Let's create and modify our smart contract following the standard steps described in the previous [Blueprint overview](/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-blueprint-sdk-overview/) section.


## Step 1: edit smart contract code


At the top of the generated contract file: `hello_world.tact`, you may see a **message** definition:

```tact title="/contracts/hello_world.tact"
message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}
```

A **message** is a structure that sends data into a contract from another contract or outside the blockchain.
Tact simplifies working with messages by automatically serializing and deserializing them into [TVM cells](https://docs.ton.org/v3/documentation/data-formats/tlb/msg-tlb). You don’t need to write low-level serialization code or think about bit layout manually — Tact handles that for you.

Every message is assigned a unique 32-bit identifier called an **opcode** (short for operation code). This identifier is stored at the beginning of the serialized message and helps the contract understand what type of message it is *receiving*.

By default, Tact automatically assigns this identifier. However, you can also define it manually, for example, when evolving the structure of your messages over time:

```tact title="/contracts/hello_world.tact"
message(0x7e8764ef) Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}
```


<details>
  <summary><b>Tact automatically serializes messages into TVM cells.</b></summary>

  When compiled, Tact will automatically serialize this message into a TVM cell. Internally, it would be represented something like this:

  ```func
  begin_cell()
  .store_uint(0x7e8764ef, 32) ;; message opcode
  .store_uint(query_id, 64)
  .store_uint(amount, 32)
  .end_cell()
  ```

  Usually, you don’t need to think about this — Tact takes care of it behind the scenes. However, it can be helpful to understand when debugging or interacting with low-level language like FunC.

</details>



#### Defining the contract

The [contract](https://docs.tact-lang.org/book/contracts/) definition in Tact follows an object-oriented programming style:

```tact
contract HelloWorld {
    ...
}
```

#### Contract storage

A contract may store its state variables as follows. They may be accessed with [`Self reference`](https://docs.tact-lang.org/book/contracts/#self)

```tact
id: Int as uint32;
counter: Int as uint32;
```
These fields are serialized similarly to structures and stored in the contract's data register.

Use `self.id` and `self.counter` to access them within contract functions.

#### Initializing the contract

Define an [`init()`](https://docs.tact-lang.org/book/contracts/#init-function/) function to set initial values:

```tact title="/contracts/hello_world.tact"
init(id: Int) {
    self.id = id;
    self.counter = 0;
}
```

#### Handling messages

To accept messages from other contracts, use a [receiver](https://docs.tact-lang.org/book/functions/#receiver-functions) function. Receiver functions automatically match the message's opcode and invoke the corresponding function:

```tact title="/contracts/hello_world.tact"
receive(msg: Add) {
    self.counter += msg.amount;
    self.notify("Cashback".asComment());
}
```

For accepting messages with empty body you can add `receive` function with no arguments:

```tact title="/contracts/hello_world.tact"
receive() {
    cashback(sender())
}
```

#### Getter functions

Tact supports [getter functions](https://docs.tact-lang.org/book/functions/#getter-functions) for retrieving contract state off-chain:

:::note
Get function cannot be called from another contract.
:::

```tact title="/contracts/hello_world.tact"
get fun counter(): Int {
    return self.counter;
}
```

#### Complete contract

```tact title="/contracts/hello_world.tact"
// message with opcode
message(0x7e8764ef) Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

// Contract defenition
contract HelloWorld {

    // storage variables
    id: Int as uint32;
    counter: Int as uint32;

    // init function.
    init(id: Int) {
        self.id = id;
        self.counter = 0;
    }

    // default(null) receive for deploy
    receive() {
        cashback(sender())
    }

    // function to receive messages from other contracts
    receive(msg: Add) {
        self.counter += msg.amount;

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    // getter function to be called offchain
    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }
}
```

Verify that smart contract code is correct by running build script:

```bash
npx blueprint build
```

Expected output should look like this:

```bash
✅ Compiled successfully! Cell BOC result:

{
  "hash": "cdd26fef4db3a94d735a0431be2f93050c181e6b497346ededea38d8a4a21080",
  "hashBase64": "zdJv702zqU1zWgQxvi+TBQwYHmtJc0bt7eo42KSiEIA=",
  "hex": "b5ee9c7241020e010001cd00021eff00208e8130e1f4a413f4bcf2c80b010604f401d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019ad31fd31ffa4055206c139d810101d700fa405902d1017001e204925f04e002d70d1ff2e0822182107e8764efba8fab31d33fd31f596c215023db3c03a0884130f84201706ddb3cc87f01ca0055205023cb1fcb1f01cf16c9ed54e001020305040012f8425210c705f2e084001800000000436173686261636b01788210946a98b6ba8eadd33f0131c8018210aff90f5758cb1fcb3fc913f84201706ddb3cc87f01ca0055205023cb1fcb1f01cf16c9ed54e05f04f2c0820500a06d6d226eb3995b206ef2d0806f22019132e21024700304804250231036552212c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb000202710709014dbe28ef6a268690000cd698fe98ffd202a903609cec08080eb807d202c816880b800f16d9e3618c08000220020378e00a0c014caa18ed44d0d200019ad31fd31ffa4055206c139d810101d700fa405902d1017001e2db3c6c310b000221014ca990ed44d0d200019ad31fd31ffa4055206c139d810101d700fa405902d1017001e2db3c6c310d000222bbeaff01"
}

✅ Wrote compilation artifact to build/HelloWorld.compiled.json
```

## Step 2: update wrapper

After building your contract, Tact automatically generates a special wrapper file. This [wrapper]((https://docs.tact-lang.org/book/compile/#wrap-ts)) simplifies interaction with your contract from TypeScript, such as calling its methods or sending messages.

In the wrapper file, you'll find this line of code:

```typescript title="/wrappers/HelloWorld.ts"
export * from '../build/HelloWorld/tact_HelloWorld';
```

This code exports everything inside the `tact_HelloWorld.ts` file in the build folder, making it available for use in other files.

## Step 3: updating tests


<details>
  <summary><b>Updating tests</b></summary>

  Now let's ensure that our smart contract correctly updates the counter:
  - Deploy the `HelloWorld` contract with an initial ID.
  - Check that the initial counter value is `0`.
  - Send an `Add` message to increment the counter.
  - Verify that the counter value increases by the expected amount.


  Implementation of test should look like this:

  ```typescript title="/tests/HelloWorld.spec.ts"
  // @version TypeScript 5.8.3
  import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
  import { toNano } from '@ton/core';
  import { HelloWorld } from '../wrappers/HelloWorld';
  import '@ton/test-utils';

  describe('HelloWorld Basic Tests', () => {
  let blockchain: Blockchain;
  let helloWorld: SandboxContract<HelloWorld>;
  let sender: SandboxContract<TreasuryContract>;

  beforeEach(async () => {
  blockchain = await Blockchain.create();
  sender = await blockchain.treasury('user');

  helloWorld = blockchain.openContract(
  // init with id = 0
  await HelloWorld.fromInit(0n)
  );

  const deployResult = await helloWorld.send(
  sender.getSender(),
{ value: toNano('1') },
  null
  );

  expect(deployResult.transactions).toHaveTransaction({
  from: sender.address,
  to: helloWorld.address,
  deploy: true,
  success: true
});
});

  it('should initialize with id = 0 and counter = 0', async () => {
  const id = await helloWorld.getId();
  const counter = await helloWorld.getCounter();
  expect(id).toBe(0n);
  expect(counter).toBe(0n);
});

  it('should increase counter by given amount', async () => {
  const result = await helloWorld.send(
  sender.getSender(),
{ value: toNano('0.1') },
{
  $$type: 'Add',
  queryId: 0n,
  amount: 10n
}
  );

  expect(result.transactions).toHaveTransaction({
  from: sender.address,
  to: helloWorld.address,
  success: true
});

  const counter = await helloWorld.getCounter();
  expect(counter).toBe(10n);
});
});

  ```

  Don't forget to verify the example is correct by running test script:

  ```bash
  npx blueprint test
  ```

  Expected output should look like this:

  ```bash

  PASS  tests/HelloWorld.spec.ts
  HelloWorld Basic Tests
  ✓ should initialize with id = 0 and counter = 0 (305 ms)
  ✓ should increase counter by given amount (120 ms)

  Test Suites: 1 passed, 1 total
  Tests:       2 passed, 2 total
  Snapshots:   0 total
  Time:        1.399 s
  Ran all test suites.


  ```
</details>


## Next step

You've written your first smart contract using Tact, tested it, and explored how storage and get methods work.

Now, it's time to **deploy the contract** to TON Blockchain.

<Button href="/v3/guidelines/quick-start/developing-smart-contracts/tact-folder/tact-deploying-to-network" colorType={'primary'} sizeType={'sm'}>

  Deploy to the network

</Button>



<Feedback />



================================================
FILE: docs/v3/guidelines/quick-start/getting-started.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/quick-start/getting-started.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import ThemedImage from '@theme/ThemedImage';
import MnemonicGenerator from "@site/src/components/MnemonicGenerator";
import Button from '@site/src/components/button'

# Getting started

Welcome to the TON Quick start guide! This guide will give you a starting point for further research into TON concepts and basic practical experience in developing applications with TON Ecosystem.

## Prerequisites

- Basic programming knowledge.
- Around __30 minutes__ of your time.

> **Note**: We will provide a short explanation of core concepts during the guide, but if you prefer a more theoretical approach, you can check out the core concepts of [TON Blockchain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains) first.

## What you'll learn

- Understand the key principles of TON Blockchain, including `messages`, `smart contracts`, and `addresses`.
- Interact with TON Ecosystem, including wallets and blockchain explorers.
- Interact with TON Blockchain, such as reading from and writing data.
- Set up a development environment using the `Blueprint` for `smart contract` development.
- Start writing smart contracts using the `FunC`, `Tolk`, and `Tact` programming languages in TON.

## Concept of smart contract

You can think of smart contracts in TON as programs running on the blockchain, following the well-known behavioral concept of the [actor](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#single-actor) model.

:::info
In contrast to other blockchains, where you can call other contract codes synchronously, a smart contract in TON is a standalone entity that communicates equally with other smart contracts. Smart contracts interact by sending messages to each other, and the processing of these messages happens asynchronously due to the asynchronous nature of transactions in TON.
:::

Each processing of a message by the receiving smart contract is considered a transaction, resulting in the following actions:
- Sending further messages.
- Changing internal data or even the code of the smart contract itself.
- Changing its balance.

The available interfaces of a smart contract are:
- Receiving **`internal messages`** from another smart contract.
- Receiving **`external messages`** from outside the blockchain.
- Receiving **`get methods`** requests from outside the blockchain.

In contrast to `internal` and `external` messages, `get methods` are not considered a **transaction**. They are special functions of the smart contract that cannot change the contract's internal state or perform any other action except querying specific data from the contract's state.

:::info
Contrary to what might seem intuitive, invoking `get methods` from other contracts **is not possible**.
:::

## Interacting with TON Ecosystem

Before we start our journey to becoming TON developers, we should become advanced users of TON! Let's create your own `wallet`, send a few transactions, and see how our actions are reflected on the blockchain using `explorers`.

### Step 1: create a new wallet using an app

The simplest way to create a `wallet` is to visit https://ton.org/wallets and choose one of the wallet apps from the list. They are all pretty similar, so let's choose [Tonkeeper](https://tonkeeper.com/). Go ahead, install it, and run it.

### Step 2: Mainnet and Testnet

In TON, there are two different networks called `Mainnet` and `Testnet`, each with distinct roles:
- `Mainnet` is the primary network where actual transactions take place, carrying real economic value as they involve real cryptocurrency.
- `Testnet` is a testing version of TON Blockchain designed for development and testing purposes. It's a risk-free zone for developers to test without financial implications. It's mainly used for development, testing `smart contracts`, and trying new features.

#### Getting funds

Transactions in TON always require some amount of funds, as executing a smart contract code requires a [fee](/v3/documentation/smart-contracts/transaction-fees/fees) payment. TON basic transactions are very cheap—about 1 cent per transaction. Getting the equivalent of $5 worth of [Toncoin](/v3/documentation/dapps/defi/coins) will be enough for hundreds of them. Here’s how you can get them:

- For `Mainnet`, you can get `Toncoins` by simply pressing the buy button in the user interface or asking someone to send them to your `address`. You can copy the address from the wallet app, which is usually located near your balance.

:::info
Don't worry, sharing your `address` is **totally safe**, unless you don't want it to be associated with you.
:::

- For the `Testnet` version, you can request funds from the [Testgiver Ton Bot](https://t.me/testgiver_ton_bot/) **completely for free**! After a short wait, you will receive 2 `Toncoins` that will appear in your wallet app.

### Step 3: creating Testnet wallet

If you decide to use the `Testnet` version, you can do so by following the guide below.

#### Generating a mnemonic

To create your first Testnet wallet in Tonkeeper, you should obtain a mnemonic using the button below. Do not forget to save this phrase!

<MnemonicGenerator />

#### Creating wallet

To create Testnet wallet, click *`Wallet`* -> *`Add Wallet`* -> *`TestnetAccount`*. Then, import the seed phrase generated in the previous step.

<div style={{display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '30px'}}>
  <br/>
  <ThemedImage
    height='600px'
    alt=""
    sources={{
      light: '/img/tutorials/quick-start/tonkeeper-light.jpg?raw=true',
      dark: '/img/tutorials/quick-start/tonkeeper-dark.jpg?raw=true',
    }}
  />
  <br/>
</div>


### Step 4: exploring TON Blockchain

Congratulations! We’ve created our first wallet and received some funds in it. Now, let's take a look at how our actions are reflected in the blockchain. We can do this by using various [explorers](https://ton.app/explorers/).

An `explorer` is a tool that allows you to query data from the chain, investigate TON `smart contracts`, and view transactions. For our examples, we are going to use [Tonviewer](https://tonviewer.com/).

:::tip
Note that when using the `Testnet`, you should manually change the explorer mode to the `Testnet` version. Don't forget that these are different networks that do not share any transactions or smart contracts. Therefore, your `Testnet` wallet will not be visible in `Mainnet` mode and vice versa.
:::

Let's take a look at our newly created wallet using the `explorer`: copy your wallet address from the app and insert it into the search bar of the explorer like this:

<div style={{marginBottom: '30px'}}>
  <img src="/img/tutorials/quick-start/explorer1.png" alt="Screenshot of explorer search interface"/>
</div>

#### Address state

First, let's examine the common [address state](/v3/documentation/smart-contracts/addresses/#addresses-state) of our smart contract:

- `Nonexisting`: If you haven't received funds to your `address` yet, you will see the default state for any address that has not been used before and, therefore, has no data.

<div style={{marginBottom: '30px'}}>
  <img src="/img/tutorials/quick-start/nonexist.png" alt="Screenshot of nonexistent wallet state"/>
</div>

- `Uninit`: Stands for an address that has some metadata, such as funds, but hasn't been initialized by deployed `smart contract` code or data.

<div style={{marginBottom: '30px'}}>
  <img src="/img/tutorials/quick-start/uninit.png" alt="Screenshot of uninitialized wallet state"/>
</div>

:::info
This might seem unintuitive: why is your wallet in the `uninit` state when you’ve already created it? There is a small difference between the `wallet app` and the `wallet smart contract`:

- The `wallet app` is your off-chain client for the `wallet smart contract`.
- The `wallet smart contract` is the contract itself. Since its deployment requires some fees, most `wallet apps` don’t actually deploy the wallet `smart contract` until you receive funds on your address and try to make your first transaction.
:::

- `Active`: This is the state of a deployed `smart contract` with a positive balance. To deploy our wallet, let's send the first transaction to someone special—**ourselves**—and see how it looks on the `blockchain`. Enter the send menu in your wallet app and transfer some funds to your own address that you’ve copied before. In the explorer, our contract should start looking something like this:

<div style={{marginBottom: '30px'}}>
  <img src="/img/tutorials/quick-start/active.png" alt="Screenshot of active wallet state"/>
</div>

:::info
There is also a fourth state called [frozen](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee), which stands for a smart contract with a [storage charge](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee) that exceeds its balance. In this state, the smart contract cannot perform any operations.
:::

And here we are — our wallet contract is deployed and ready to use. Let's examine the provided user interface:

#### Metadata section
- **Address**: Your account's unique ID (e.g., `QQB...1g6VdFEg`).
- **Balance**: Current TON amount.
- **Type**: Contract version (e.g., `wallet_v5r1` – detected automatically by code).
- **State**: Address state. It may be `nonexisting`, `uninit`, `active`, or `frozen`.

#### Navigation tabs
- **History/Transactions**: Displays recent activity (e.g., received funds, contract deployments).
- **Code**: Shows raw smart contract code compiled from `FunC`/`Tact`/`Tolk`.
- **Methods**: Allows execution of `get methods` to retrieve persistent contract data.

## Next steps

- Now that you’ve tried the `wallet app`, take a moment to explore further: create another `wallet account`, try sending some TON between them, and observe how the transactions appear in the explorer.
- When you're ready, move on to the next step:

<Button href="/v3/guidelines/quick-start/blockchain-interaction/reading-from-network" colorType={'primary'} sizeType={'sm'}>

  Reading from network

</Button>

<Feedback />



================================================
FILE: docs/v3/guidelines/smart-contracts/fee-calculation.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/fee-calculation.md
================================================
import Feedback from '@site/src/components/Feedback';

# Fees calculation

## Introduction

When your contract begins processing an incoming message, you should verify the number of TONs attached to the message to ensure it is sufficient to cover [all types of fees](/v3/documentation/smart-contracts/transaction-fees/fees#elements-of-transaction-fee). To achieve this, you need to calculate (or predict) the fee for the current transaction.

This document explains how to calculate fees in FunC contracts using the latest TVM opcodes.

:::info opcodes
For a comprehensive list of TVM opcodes, including those mentioned below, refer to the [TVM instruction page](/v3/documentation/tvm/instructions).
:::

## Storage fee

### Overview

In short, `storage fees` are the costs of storing a smart contract on the blockchain. You pay for every second the smart contract remains stored on the blockchain.

Use the `GETSTORAGEFEE` opcode with the following parameters:

| Param name | Description                                             |
| :--------- | :------------------------------------------------------ |
| cells      | Number of contract cells                                |
| bits       | Number of contract bits                                 |
| is_mc      | True if the source or destination is in the MasterChain |

:::info 
The system counts only unique hash cells for storage and forward fees. For example, it counts three identical hash cells as one. This mechanism deduplicates data by storing the content of multiple equivalent sub-cells only once, even if they are referenced across different branches. [Read more about deduplication](/v3/documentation/data-formats/tlb/library-cells). 
:::

### Calculation flow

Each contract has its balance. You can calculate how many TONs your contract requires to remain valid for a specified `seconds` duration using the function:

```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

You can then hardcode this value into the contract and calculate the current storage fee using:

```func
;; functions from func stdlib (not available on mainnet)
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int my_storage_due() asm "DUEPAYMENT";

;; constants from stdlib
;;; Creates an output action which reserves exactly x nanoTONs (if y = 0).
const int RESERVE_REGULAR = 0;
;;; Creates an output action which reserves at most x nanoTONs (if y = 2).
;;; Bit +2 in y ensures the external action does not fail if the specified amount cannot be reserved. Instead, it reserves all remaining balance.
const int RESERVE_AT_MOST = 2;
;;; In the case of action failure, the transaction is bounced. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. [v3/documentation/tvm/changelog/tvm-upgrade-2023-07#sending-messages](https://ton.org/docs/#/tvm/changelog/tvm-upgrade-2023-07#sending-messages)
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

() calculate_and_reserve_at_most_storage_fee(int balance, int msg_value, int workchain, int seconds, int bits, int cells) inline {
 int on_balance_before_msg = my_ton_balance - msg_value;
 int min_storage_fee = get_storage_fee(workchain, seconds, bits, cells); ;; You can hardcode this value if the contract code will not be updated.
 raw_reserve(max(on_balance_before_msg, min_storage_fee + my_storage_due()), RESERVE_AT_MOST);
}
```

If `storage_fee` is hardcoded, **remember to update it** during the contract update process. Not all contracts support updates, so this is an optional requirement.

## Computation fee

### Overview

In most cases, use the `GETGASFEE` opcode with the following parameters:

| Param      | Description                                             |
| :--------- | :------------------------------------------------------ |
| `gas_used` | Gas amount, calculated in tests and hardcoded           |
| `is_mc`    | True if the source or destination is in the MasterChain |

### Calculation flow

```func
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
```

But how do you determine `gas_used`? Through testing!

To calculate `gas_used`, you should write a test for your contract that:

1. Executes a transfer.
2. Verifies its success and retrieves the transfer details.
3. Checks the amount of gas the transfer uses for computation.

The contract's computation flow can depend on input data. You should run the contract in a way that maximizes gas usage. Ensure you are using the most computationally expensive path to test the contract.

```ts
// Initialization code
const deployerJettonWallet = await userWallet(deployer.address);
let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
const notDeployerJettonWallet = await userWallet(notDeployer.address);
let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
let sentAmount = toNano("0.5");
let forwardAmount = toNano("0.05");
let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
// Ensure the payload is unique to charge cell loading for each payload.
let customPayload = beginCell().storeUint(0xfedcba0987654321n, 128).endCell();

// Let's use this case for fee calculation
// Embed the forward payload into the custom payload to ensure maximum gas usage during computation
const sendResult = await deployerJettonWallet.sendTransfer(
  deployer.getSender(),
  toNano("0.17"), // tons
  sentAmount,
  notDeployer.address,
  deployer.address,
  customPayload,
  forwardAmount,
  forwardPayload
);
expect(sendResult.transactions).toHaveTransaction({
  // excesses
  from: notDeployerJettonWallet.address,
  to: deployer.address,
});
/*
transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
 sender:MsgAddress forward_payload:(Either Cell ^Cell)
 = InternalMsgBody;
*/
expect(sendResult.transactions).toHaveTransaction({
  // notification
  from: notDeployerJettonWallet.address,
  to: notDeployer.address,
  value: forwardAmount,
  body: beginCell()
    .storeUint(Op.transfer_notification, 32)
    .storeUint(0, 64) // default queryId
    .storeCoins(sentAmount)
    .storeAddress(deployer.address)
    .storeUint(1, 1)
    .storeRef(forwardPayload)
    .endCell(),
});
const transferTx = findTransactionRequired(sendResult.transactions, {
  on: deployerJettonWallet.address,
  from: deployer.address,
  op: Op.transfer,
  success: true,
});

let computedGeneric: (transaction: Transaction) => TransactionComputeVm;
computedGeneric = (transaction) => {
  if (transaction.description.type !== "generic")
    throw "Expected generic transaction";
  if (transaction.description.computePhase.type !== "vm")
    throw "Compute phase expected";
  return transaction.description.computePhase;
};

let printTxGasStats: (name: string, trans: Transaction) => bigint;
printTxGasStats = (name, transaction) => {
  const txComputed = computedGeneric(transaction);
  console.log(`${name} used ${txComputed.gasUsed} gas`);
  console.log(`${name} gas cost: ${txComputed.gasFees}`);
  return txComputed.gasFees;
};

send_gas_fee = printTxGasStats("Jetton transfer", transferTx);
```

## Forward fee

### Overview

The forward fee is charged for outgoing messages.

Generally, there are three scenarios for forward fee processing:

1. The message structure is deterministic, and you can predict the fee.
2. The message structure depends heavily on the incoming message structure.
3. You cannot predict the outgoing message structure at all.

### Calculation flow

If the message structure is deterministic, use the `GETFORWARDFEE` opcode with the following parameters:

| Param name | Description                                             |
| :--------- | :------------------------------------------------------ |
| cells      | Number of cells                                         |
| bits       | Number of bits                                          |
| is_mc      | True if the source or destination is in the MasterChain |

:::info 
The system counts only unique hash cells for storage and forward fees. For example, it counts three identical hash cells as one. This mechanism deduplicates data by storing the content of multiple equivalent sub-cells only once, even if they are referenced across different branches. [Read more about deduplication](/v3/documentation/data-formats/tlb/library-cells). 
:::

However, if the outgoing message depends significantly on the incoming structure, you may not be able to fully predict the fee. In such cases, try using the `GETORIGINALFWDFEE` opcode with the following parameters:

| Param name | Description                                             |
| :--------- | :------------------------------------------------------ |
| fwd_fee    | Parsed from the incoming message                        |
| is_mc      | True if the source or destination is in the MasterChain |

:::caution 
Be careful with the `SENDMSG` opcode, as it uses an **unpredictable amount** of gas. Avoid using it unless necessary.
:::

The `SENDMSG` opcode is the least optimal way to calculate fees, but it is better than not checking.

If even `GETORIGINALFWDFEE` cannot be used, one more option exists. Use the `SENDMSG` opcode with the following parameters:

| Param name | Description     |
| :--------- | :-------------- |
| cells      | Number of cells |
| mode       | Message mode    |

Modes influence the fee calculation in the following ways:

- **`+1024`**: This mode does not create an action but only estimates the fee. Other modes will send a message during the action phase.
- **`+128`**: This mode substitutes the value of the entire contract balance before the computation phase begins. This is slightly inaccurate because gas expenses, which cannot be estimated before the computation phase, are excluded.
- **`+64`**: This mode substitutes the entire balance of the incoming message as the outgoing value. This is also slightly inaccurate, as gas expenses that cannot be estimated until the computation is completed are excluded.
- Refer to the [message modes page](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes) for additional modes.

It creates an output action and returns the fee for creating a message. However, it uses an unpredictable amount of gas, which cannot be calculated using formulas. To measure gas usage, use `GASCONSUMED`:

```func
int send_message(cell msg, int mode) impure asm "SENDMSG";
int gas_consumed() asm "GASCONSUMED";
;; ... some code ...

() calculate_forward_fee(cell msg, int mode) inline {
 int gas_before = gas_consumed();
 int forward_fee = send_message(msg, mode);
 int gas_usage = gas_consumed() - gas_before;

 ;; forward fee -- fee value
 ;; gas_usage -- the amount of gas used to send the message
}
```

## See also

- [Stablecoin contract with fees calculation](https://github.com/ton-blockchain/stablecoin-contract)

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/get-methods.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/get-methods.md
================================================
import Feedback from '@site/src/components/Feedback';

# Get methods

:::note
To fully benefit from this content, readers must understand the [FunC programming language](/v3/documentation/smart-contracts/func/overview/) on the TON Blockchain. This knowledge is crucial for grasping the information presented here.
:::

## Introduction

Get methods are special functions in smart contracts that allow you to query specific data. Their execution doesn't cost any fees and happens outside of the blockchain.

These functions are widespread in most smart contracts. For example, the default [Wallet contract](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts/) has several get methods, such as `seqno()`, `get_subwallet_id()` and `get_public_key()`. Wallets, SDKs, and APIs use them to fetch data about wallets.

## Design patterns for get methods

### Basic get methods design patterns

1. **Single data point retrieval**: A fundamental design pattern is to create methods that return individual data points from the contract's state. These methods have no parameters and return a single value.

Example:

```func
int get_balance() method_id {
return get_data().begin_parse().preload_uint(64);
}
```

2. **Aggregate data retrieval**: Another common method is to create methods that gather multiple pieces of data from a contract's state in one call. This is useful when specific data points are often used together. You can see this approach frequently in [Jetton](#jettons) and [NFT](#nfts) contracts.

Example:

```func
(int, slice, slice, cell) get_wallet_data() method_id {
return load_data();
}
```

### Advanced get methods design patterns

1. **Computed data retrieval**: In some cases, the data that needs to be retrieved isn't stored directly in the contract's state but calculated based on the state and the input arguments.

Example:

```func
slice get_wallet_address(slice owner_address) method_id {
(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

2. **Conditional data retrieval**: Sometimes, the data that needs to be retrieved depends on certain conditions, such as the current time.

Example:

```func
(int) get_ready_to_be_used() method_id {
int ready? = now() >= 1686459600;
return ready?;
}
```

## Most common get methods

### Standard wallets

#### seqno()

```func
int seqno() method_id {
 return get_data().begin_parse().preload_uint(32);
}
```

Returns the transaction's sequence number within a specific wallet. This method is primarily used for [replay protection](/v3/guidelines/smart-contracts/howto/wallet#replay-protection---seqno).

#### get_subwallet_id()

```func
int get_subwallet_id() method_id {
 return get_data().begin_parse().skip_bits(32).preload_uint(32);
}
```

- [What is subwallet ID?](/v3/guidelines/smart-contracts/howto/wallet#subwallet-ids)

#### get_public_key()

```func
int get_public_key() method_id {
 var cs = get_data().begin_parse().skip_bits(64);
 return cs.preload_uint(256);
}
```

This method retrieves the public key associated with the wallet.

### Jettons

#### get_wallet_data()

```func
(int, slice, slice, cell) get_wallet_data() method_id {
 return load_data();
}
```

This method returns the complete set of data associated with a jetton wallet:

- (int) balance
- (slice) owner_address
- (slice) jetton_master_address
- (cell) jetton_wallet_code

#### get_jetton_data()

```func
(int, int, slice, cell, cell) get_jetton_data() method_id {
 (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
 return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

Returns data of a jetton master, including its total supply, the address of its admin, the content of the jetton, and its wallet code.

#### get_wallet_address(slice owner_address)

```func
slice get_wallet_address(slice owner_address) method_id {
 (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
 return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

Given the owner's address, this method calculates and returns the address for the owner's jetton wallet contract.

### NFTs

#### get_nft_data()

```func
(int, int, slice, slice, cell) get_nft_data() method_id {
 (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
 return (init?, index, collection_address, owner_address, content);
}
```

Returns the data associated with a non-fungible token, including whether it has been initialized, its index in a collection, the address of its collection, the owner's address, and its content.

#### get_collection_data()

```func
(int, cell, slice) get_collection_data() method_id {
 var (owner_address, next_item_index, content, _, _) = load_data();
 slice cs = content.begin_parse();
 return (next_item_index, cs~load_ref(), owner_address);
}
```

Returns the data of an NFT collection, including the index of the next item available for minting, the content of the collection, and the owner's address.

#### get_nft_address_by_index(int index)

```func
slice get_nft_address_by_index(int index) method_id {
 var (_, _, _, nft_item_code, _) = load_data();
 cell state_init = calculate_nft_item_state_init(index, nft_item_code);
 return calculate_nft_item_address(workchain(), state_init);
}
```

Given an index, this method calculates and returns the corresponding NFT item contract address within this collection.

#### royalty_params()

```func
(int, int, slice) royalty_params() method_id {
 var (_, _, _, _, royalty) = load_data();
 slice rs = royalty.begin_parse();
 return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

This method fetches the royalty parameters for an NFT. These parameters include the royalty percentage paid to the original creator whenever the NFT is sold.

#### get_nft_content(int index, cell individual_nft_content)

```func
cell get_nft_content(int index, cell individual_nft_content) method_id {
 var (_, _, content, _, _) = load_data();
 slice cs = content.begin_parse();
 cs~load_ref();
 slice common_content = cs~load_ref().begin_parse();
 return (begin_cell()
 .store_uint(1, 8) ;; offchain tag
 .store_slice(common_content)
 .store_ref(individual_nft_content)
 .end_cell());
}
```

Given an index and [individual NFT content](#get_nft_data), this method fetches and returns the NFT's combined common and individual content.

## How to work with get methods

### Calling get methods on popular explorers

#### Tonviewer

You can call get methods at the bottom of the page in the **Methods** tab.

- https://tonviewer.com/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI?section=method

#### Ton.cx

You can call get methods on the "Get methods" tab.

- https://ton.cx/address/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI

### Calling get methods from code

We will use Javascript libraries and tools for the examples below:

- [ton](https://github.com/ton-org/ton/) library
- [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript) 

Let's say there is some contract with the following get method:

```func
(int) get_total() method_id {
 return get_data().begin_parse().preload_uint(32); ;; load and return the 32-bit number from the data
}
```

This method returns a single number loaded from the contract data.

You can use the code snippet below to call this get method on a contract deployed at a known address:

```ts
import { TonClient } from "@ton/ton";
import { Address } from "@ton/core";

async function main() {
  // Create Client
  const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
  });

  // Call get method
  const result = await client.runMethod(
    Address.parse("EQD4eA1SdQOivBbTczzElFmfiKu4SXNL4S29TReQwzzr_70k"),
    "get_total"
  );
  const total = result.stack.readNumber();
  console.log("Total:", total);
}

main();
```

This code will produce an output in the format `Total: 123`. The number may vary, as this is just an example.

### Testing get methods

We can use the [Sandbox](https://github.com/ton-community/sandbox/) to test smart contracts, which is installed by default in new Blueprint projects.

First, you must add a special method in the contract wrapper to execute the get method and return the typed result. Let's say your contract is called _Counter_, and you have already implemented the method to update the stored number. Open `wrappers/Counter.ts` and add the following method:

```ts
async getTotal(provider: ContractProvider) {
    const result = (await provider.get('get_total', [])).stack;
    return result.readNumber();
}
```

It executes the get method and retrieves the resulting stack. In this snippet, we read a single number from the stack. In more complex cases where multiple values are returned at once, you can simply call the `readSomething` type of method multiple times to parse the entire execution result from the stack.

Finally, we can use this method in our tests. Navigate to the `tests/Counter.spec.ts` and add a new test:

```ts
it("should return correct number from get method", async () => {
  const caller = await blockchain.treasury("caller");
  await counter.sendNumber(caller.getSender(), toNano("0.01"), 123);
  expect(await counter.getTotal()).toEqual(123);
});
```

You can check it by running `npx blueprint test` in your terminal. If you did everything correctly, this test should be marked as passed!

## Invoking get methods from other contracts

Contrary to what might seem intuitive, invoking get methods from other contracts is impossible on-chain. This limitation stems primarily from the nature of blockchain technology and the need for consensus.

First, acquiring data from another ShardChain may introduce significant latency. Such delays could disrupt the contract execution flow, as blockchain operations are designed to execute in a deterministic and timely manner.

Second, achieving consensus among validators would be problematic. Validators would also need to invoke the same get method to verify a transaction's correctness. However, if the state of the target contract changes between these multiple invocations, validators could end up with differing versions of the transaction result.

Lastly, smart contracts in TON are designed to be pure functions: they will always produce the same output for the same input. This principle allows for straightforward consensus during message processing. Introducing runtime acquisition of arbitrary, dynamically changing data would break this deterministic property.

### Implications for developers

These limitations mean that one contract cannot directly access the state of another contract via its get methods. While the inability to incorporate real-time, external data into a contract's deterministic flow might seem restrictive, it is precisely these constraints that ensure the integrity and reliability of blockchain technology.

### Solutions and workarounds

In the TON Blockchain, smart contracts communicate through messages rather than directly invoking methods from one another. One can send a message to another contract requesting the execution of a specific method. These requests usually begin with special [operation codes](/v3/documentation/smart-contracts/message-management/internal-messages).

A contract designed to handle such requests will execute the specified method and return the results in a separate message. While this approach may seem complex, it effectively streamlines communication between contracts, enhancing the scalability and performance of the blockchain network.

This message-passing mechanism is integral to the TON Blockchain's operation, paving the way for scalable network growth without requiring extensive synchronization between shards.

For effective inter-contract communication, it is crucial to design your contracts so that they can properly accept and respond to requests. This involves implementing methods that can be invoked on-chain to return responses.

Let's consider a simple example:

```func
#include "imports/stdlib.fc";

int get_total() method_id {
 return get_data().begin_parse().preload_uint(32);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
 if (in_msg_body.slice_bits() < 32) {
 return ();
 }

 slice cs = in_msg_full.begin_parse();
 cs~skip_bits(4);
 slice sender = cs~load_msg_addr();

 int op = in_msg_body~load_uint(32); ;; load the operation code

 if (op == 1) { ;; increase and update the number
 int number = in_msg_body~load_uint(32);
 int total = get_total();
 total += number;
 set_data(begin_cell().store_uint(total, 32).end_cell());
 }
 elseif (op == 2) { ;; query the number
 int total = get_total();
 send_raw_message(begin_cell()
 .store_uint(0x18, 6)
 .store_slice(sender)
 .store_coins(0)
 .store_uint(0, 107) ;; default message headers (see sending messages page)
 .store_uint(3, 32) ;; response operation code
 .store_uint(total, 32) ;; the requested number
 .end_cell(), 64);
 }
}
```

In this example, the contract receives and processes internal messages by interpreting operation codes, executing specific methods, and returning responses appropriately:

- Op-code `1` denotes a request to update the number in the contract's data.
- Op-code `2` signifies a request to query the number from the contract's data.
- Op-code `3` is used in the response message, which the calling smart contract must handle to receive the result.

For simplicity, we used just simple little numbers 1, 2, and 3 for the operation codes. But for real projects, consider setting them according to the standard:

- [CRC32 hashes for op-codes](/v3/documentation/data-formats/tlb/crc32)

## Common pitfalls and how to avoid them

1. **Misuse of get methods**: As mentioned earlier, get methods are designed to return data from the contract's state and are not meant to change the contract's state. Attempting to alter the contract's state within a get method will not do it.

2. **Ignoring return types**: Every get method must have a clearly defined return type that matches the retrieved data. If a method is expected to return a specific type of data, ensure that all execution paths within the method return this type. Inconsistent return types should be avoided, as they can lead to errors and complications when interacting with the contract.

3. **Assuming cross-contract calls**: A common misconception is that get methods can be called directly from other contracts on-chain. However, as previously discussed, this is not possible due to the inherent nature of blockchain technology and the requirement for consensus. Always remember that get methods are designed for off-chain use, while on-chain interactions between contracts are facilitated through internal messages.

## Conclusion

Get methods are vital for querying data from smart contracts on the TON Blockchain. While they have certain limitations, understanding these constraints and learning how to work around them is crucial for effectively utilizing get methods in your smart contracts.

## See also
- [Writing tests examples](/v3/guidelines/smart-contracts/testing/writing-test-examples)

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/guidelines.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Overview

This page navigates within the TON smart contracts guidelines. 

## Guides overview

### Smart contract development

| Guide                                                                                           | Stack                            | Description                                                       |
|-------------------------------------------------------------------------------------------------|----------------------------------|-------------------------------------------------------------------|
| [TON Hello world](https://helloworld.tonstudio.io/01-wallet/)                                         | FunC; TS, @ton/ton               | Write and deploy your first contract.                             |
| [Working with wallet smart contracts](/v3/guidelines/smart-contracts/howto/wallet/)             | FunC; TS, @ton/ton               | Learn in detail interaction with various wallets smart contracts. |
| [Speedrun TON](https://tonspeedrun.tapps.ninja/)                                                    | FunC; TS, @ton/ton               | Learn contract development with series of guidelines.             |
| [Writing tests with Blueprint](/v3/guidelines/smart-contracts/testing/overview/)                | TS, @ton/ton                     | Learn how to write and invoke local tests for contract.           |
| [Shard optimizations on TON](/v3/guidelines/smart-contracts/howto/shard-optimization/)          | TS, @ton/ton                     | Learn best practice for contract shard optimization.              |
| [Writing tests examples](/v3/guidelines/smart-contracts/testing/writing-test-examples/)         | TS, @ton/ton                     | Learn how to write various test suites for edge cases.            |
| [Interact with multisig wallets using TypeScript](/v3/guidelines/smart-contracts/howto/multisig-js) | TS, @ton/ton                     | Learn how to interact to multisig wallet in TON.                  |


### Scalability and security

| Guide                                                                                                                                                  | Stack                   | Description                                                                      |
|--------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|----------------------------------------------------------------------------------|
| [How to shard your TON smart contract and why](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons) | Design and architecture | Learn concept of contract system with jetton standard                            |
| [Airdrop claiming guidelines](/v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice/)                                                       | Design and architecture | Learn concepts on contract interactions and their impact on overall performance. |
| [Things to focus on while working with TON blockchain](/v3/guidelines/smart-contracts/security/things-to-focus/)                                       | FunC                    | Best practices for DApps development in TON.                                     |
| [Secure smart contract programming](/v3/guidelines/smart-contracts/security/secure-programming/)                                                       | FunC                    | Best practices for secure development of smart contracts on FunC.                |
| [Drawing conclusions from TON hack challenge](/v3/guidelines/smart-contracts/security/ton-hack-challenge-1/)                                           | FunC                    | Best practices for secure development                                            |
| [Random number generation](/v3/guidelines/smart-contracts/security/random-number-generation/)                                                          | FunC                    | Generating random numbers in TON for various projects.                           |


### Advanced 

| Guide                                                                                                                                                  | Stack                    | Description                                                                              |
|--------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|------------------------------------------------------------------------------------------|
| [Generation of block random seed](/v3/guidelines/smart-contracts/security/random/)                                                                     | C++, Core               | Explanation on random in TON.                                                            |
| [Compilation instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions/)                                                     | C++, cmake, Core        | Compile executables from source for deep native integration.                             |
| [Instructions for low-memory machines](/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory/)                                          | С++                     | Extension for compilation on low-memory machines.                                        |
| [Make a simple multisig contract with fift](/v3/guidelines/smart-contracts/howto/multisig/)                                                            | Fift, Lite Client       | This tutorial will help you learn how to deploy your multisig contract with Lite Client. |

## TON course: contract development

The [TON blockchain course](https://stepik.org/course/176754/) is a comprehensive guide to blockchain development.

- Module 2 is dedicated to __TVM, transactions, scalability and business cases__.
- Module 3 is dedicated to __smart contract development lifecycle__.


<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Check the TON blockchain course

</Button>


<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>


## See also
- [Smart contract documentation](/v3/documentation/smart-contracts/overview/)

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Airdrop claiming guidelines

In this article, we'll explore an imaginary claim solution, identify its performance issues, and propose solutions. The focus will be on contract interactions and their impact on overall performance. Code, security aspects, and other nuances are beyond the scope of this discussion.

## Claim machine

:::info
How does a typical claim solution work? Let's break it down.
:::

The user submits some form of proof to demonstrate eligibility for the claim. The solution verifies the proof and sends jettons to the user. In this case, `proof` refers to a [merkle proof](/v3/documentation/data-formats/tlb/exotic-cells#merkle-proof), but it could also be signed data or any other authorization method. To send jettons, we'll need a jetton wallet and minter. Additionally, we must prevent users from claiming twice—this requires a double-spend protection contract. And, of course, we'd like to monetize this, right? So, we'll need at least one claim wallet. Let's summarize:

### Distributor

Takes the proof from the user, checks it, and releases the jettons.
State init: `(merkle_root, admin, fee_wallet_address)`.

### Double spend

Receives message, bounces if already used, otherwise passes message further

### Jetton

Jetton wallet, where the tokens will be sent from by the _distributor_.
Jetton minter is out of the scope of this article.

### Fee wallet

Any kind of wallet contract

## Architecture

### V1

The initial design that comes to mind is as follows:

1. The user sends proof to the distributor.
2. The distributor verifies the proof and deploys a `double spend` contract.
3. The distributor sends a message to the double spend contract.
4. If the double spend contract has not been deployed previously, it sends a `claim_ok` message to the distributor.
5. The distributor sends the claim fee to the fee wallet.
6. The distributor releases the jettons to the user.

**NAIVE ART AHEAD!**

What's wrong with that?
Looks like a loop is redundant here.

### V2

A linear design is more effective:

1. The user deploys the `double spend` contract, which proxies the proof to the distributor.
2. The distributor verifies the `double spend` contract's address using the state init `(distributor_address, user_address?)`.
3. The distributor checks the proof (with the user index included as part of the proof) and releases the jettons.
4. The distributor sends the fee to the fee wallet.

**More naive art**

## Shard optimizations

Ok, we got something going, but what about shard optimizations?

### What are these?

To build a fundamental understanding, refer to [wallet creation for different shards](/v3/guidelines/dapps/asset-processing/payments-processing/#wallet-creation-for-different-shards). In short, a shard is a 4-bit address prefix, similar to networking. When contracts are in the same network segment, messages are processed without routing, making them significantly faster.

### Identifying addresses we can control

#### Distributor address

We have full control over the distributor's data and can place it in any shard. How? Remember, the contract address is [defined by its state](/v3/documentation/smart-contracts/addresses#account-id). We can use one of the contract's data fields as a nonce and keep trying until we achieve the desired result. A good example of a nonce in actual contracts is the `subwalletId` or `publicKey` for a wallet contract. Any field that can be modified after deployment or doesn't impact the contract logic (like `subwalletId`) will work. You could even create an unused field explicitly for this purpose, as demonstrated by [vanity-contract](https://github.com/ton-community/vanity-contract).

#### Distributor jetton wallet

We can't directly control the resulting jetton wallet address. However, if we control the distributor address, we can choose it so that the resulting jetton wallet ends up in the same shard. How? There's a [library](https://github.com/Trinketer22/turbo-wallet) for that! While it currently supports only wallets, extending it to arbitrary contracts is relatively easy. Please take a look at how it's implemented for [HighloadV3](https://github.com/Trinketer22/turbo-wallet/blob/44fe7ee4300e37e052871275be8dd41035d45c3a/src/lib/contracts/HighloadWalletV3.ts#L20).

### Double spend contract

The double-spend contract should be unique per proof, so can we shard-tune it? Let's think about it. If you consider the proof structure, it depends on how the data is organized. The first idea that comes to mind is a structure similar to [mintless jettons](https://github.com/tonkeeper/TEPs2/blob/mintles/text/0177-mintless-jetton-standard.md#handlers):

```
_ amount:Coins start_from:uint48 expired_at:uint48 = AirdropItem;

_ _(HashMap 267 AirdropItem) = Airdrop;
```

In this case, the address distribution is random, and all data fields are meaningful, making it untunable. However, nothing stops us from modifying it like this:

```
_ amount:Coins start_from:uint48 expired_at:uint48 nonce:uint64 = AirdropItem;

_ _(HashMap 267 AirdropItem) = Airdrop;
```

Or even:

```
_ amount:Coins start_from:uint48 expired_at:uint48 addr_hash: uint256 = AirdropItem;

_ _(HashMap 64 AirdropItem) = Airdrop;
```

Here, a 64-bit index can act as a nonce, and the address becomes part of the data payload for verification. If the double-spend data is constructed from `(distributor_address, index)`, where the index is part of the data, we maintain reliability while making the address shard tunable via the index parameter.

#### User address

We don't control user addresses, right? Yes, **BUT** we can group them so that the user address shard matches the distributor shard. In this case, each distributor processes a `merkle root` consisting entirely of users from its shard.

Here's the improved and more polished version of your text:

#### Summary

We can place the `double_spend -> dist -> dist_jetton` chain in the same shard. What remains for other shards is the `dist_jetton -> user_jetton -> user_wallet` path.

### How to deploy such a setup

Let's break it down step by step. One key requirement is that the _distributor_ contract must have an updatable _merkle root_.

1. Deploy a distributor in each shard (0-15), using the initial `merkle_root` as a nonce to ensure it resides in the same shard as its Jetton wallet.
2. Group users by their distributor shard.
3. For each user, find an index such that the _double spend_ contract `(distributor, index)` ends up in the same shard as the user's address.
4. Generate _merkle roots_ using the indexes from the previous step.
5. Update the _distributors_ with the corresponding _merkle roots_.

Now, everything should be ready to go!

### V3

1. Index tuning enables users to deploy the _double spend_ contract in the same shard.
2. The distributor in the user's shard verifies the sending `double spend` address by checking the state init `(distributor_address, index)`.
3. The distributor sends the fee to the fee wallet.
4. The distributor checks the proof (with the user index included) and releases jettons via the jetton wallet in the same shard.

**More naive art**

Is there anything wrong with this approach? Let's take a closer look.  
...  
Yes, there is! There's only one fee wallet, and fees queue up to a single shard. This could have been a disaster! (Has this ever happened in real life?).

### V4

1. It's the same as V3, but now there are 16 fee wallets, each in the same shard as its _distributor_.
2. Make the _fee wallet_ address updatable.

**A bit more art**

How about now? LGTM.

## What's next?

We can always push further. For example, consider a custom [jetton wallet](https://github.com/ton-community/mintless-jetton/blob/main/contracts/jetton-utils.fc#L142) with built-in shard optimization. This ensures the user's jetton wallet ends up in the same shard as the user with an 87% probability. However, this is relatively uncharted territory, so you'll need to explore it on your own. Good luck with your TGE!

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/howto/compile/compilation-instructions.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/howto/compile/compilation-instructions.md
================================================
import Feedback from '@site/src/components/Feedback';

# Compile from sources

You can download prebuilt binaries [here](/v3/documentation/archive/precompiled-binaries#1-download).

If you still want to compile sources yourself, follow the instructions below.

:::caution
This is a simplified quick build guide.

If you are building for production and not for home use, it's better to use [autobuild scripts](https://github.com/ton-blockchain/ton/tree/master/.github/workflows).
:::

## Common

The software is likely to compile and work properly on most Linux systems. It should work on macOS and even Windows.

1. Download the newest version of TON Blockchain sources available at the GitHub repository https://github.com/ton-blockchain/ton/:

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2. Install the newest versions of:
   - `make`
   - `cmake` version 3.0.2 or later
   - `g++` or `clang` (or another C++14-compatible compiler as appropriate for your operating system).
   - OpenSSL (including C header files) version 1.1.1 or later
   - `build-essential`, `zlib1g-dev`, `gperf`, `libreadline-dev`, `ccache`, `libmicrohttpd-dev`, `pkg-config`, `libsodium-dev`, `libsecp256k1-dev`, `liblz4-dev`

### On Ubuntu

```bash
apt update
sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev libsecp256k1-dev liblz4-dev
```

3. Suppose that you have fetched the source tree to directory `~/ton`, where `~` is your home directory, and that you have created an empty directory `~/ton-build`:

```bash
mkdir ton-build
```

Then run the following in a terminal of Linux or MacOS:

```bash
cd ton-build
export CC=clang
export CXX=clang++
cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
```

### On MacOS

Prepare the system by installing required system packages

```zsh
brew install ninja libsodium libmicrohttpd pkg-config automake libtool autoconf gnutls
brew install llvm@16
```

Use newly installed clang.

```zsh
  export CC=/opt/homebrew/opt/llvm@16/bin/clang
  export CXX=/opt/homebrew/opt/llvm@16/bin/clang++
```

Compile secp256k1

```zsh
  git clone https://github.com/bitcoin-core/secp256k1.git
  cd secp256k1
  secp256k1Path=`pwd`
  git checkout v0.3.2
  ./autogen.sh
  ./configure --enable-module-recovery --enable-static --disable-tests --disable-benchmark
  make -j12
```

and lz4:

```zsh
  git clone https://github.com/lz4/lz4
  cd lz4
  lz4Path=`pwd`
  git checkout v1.9.4
  make -j12
```

and relink OpenSSL 3.0

```zsh
brew unlink openssl@1.1
brew install openssl@3
brew unlink openssl@3 &&  brew link --overwrite openssl@3
```

Now you can compile TON

```zsh
cmake -GNinja -DCMAKE_BUILD_TYPE=Release .. \
-DCMAKE_CXX_FLAGS="-stdlib=libc++" \
-DSECP256K1_FOUND=1 \
-DSECP256K1_INCLUDE_DIR=$secp256k1Path/include \
-DSECP256K1_LIBRARY=$secp256k1Path/.libs/libsecp256k1.a \
-DLZ4_FOUND=1 \
-DLZ4_LIBRARIES=$lz4Path/lib/liblz4.a \
-DLZ4_INCLUDE_DIRS=$lz4Path/lib
```



:::tip
If you are compiling on a computer with low memory (e.g., 1 Gb), don't forget to [create a swap partitions](/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory).
:::

## Download global config

For tools like lite client you need to download the global network config.

Download the newest configuration file from https://ton-blockchain.github.io/global.config.json for mainnet:

```bash
wget https://ton-blockchain.github.io/global.config.json
```

or from https://ton-blockchain.github.io/testnet-global.config.json for testnet:

```bash
wget https://ton-blockchain.github.io/testnet-global.config.json
```

## Lite client

To build a lite client, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [download the config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config), and then do:

```bash
cmake --build . --target lite-client
```

Run the Lite Client with config:

```bash
./lite-client/lite-client -C global.config.json
```

If everything was installed successfully, the Lite Client will connect to a special server (a full node for the TON Blockchain Network) and will send some queries to the server.
If you indicate a writeable "database" directory as an extra argument to the client, it will download and save the block and the state corresponding to the newest masterchain block:

```bash
./lite-client/lite-client -C global.config.json -D ~/ton-db-dir
```

Basic help info can be obtained by typing `help` into the Lite Client. Type `quit` or press `Ctrl-C` to exit.

## FunC

To build FunC compiler from source code, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) described above and then:

```bash
cmake --build . --target func
```

To compile FunC smart contract:

```bash
./crypto/func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

To build Fift compiler from source code, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) described above and then:

```bash
cmake --build . --target fift
```

To run Fift script:

```bash
./crypto/fift -s script.fif script_param0 script_param1 ..
```

## Tonlib-cli

To build tonlib-cli, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [download the config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) and then do:

```bash
cmake --build . --target tonlib-cli
```

Run the tonlib-cli with config:

```bash
./tonlib/tonlib-cli -C global.config.json
```

Basic help info can be obtained by typing `help` into the tonlib-cli. Type `quit` or press `Ctrl-C` to exit.

## RLDP-HTTP-Proxy

To build rldp-http-proxy, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [download the config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) and then do:

```bash
cmake --build . --target rldp-http-proxy
```

The Proxy binary will be located as:

```bash
./rldp-http-proxy/rldp-http-proxy
```

## Generate-random-id

To build generate-random-id, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) and then do:

```bash
cmake --build . --target generate-random-id
```

The binary will be located as:

```bash
./utils/generate-random-id
```

## Storage-daemon

To build storage-daemon and storage-daemon-cli, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) and then do:

```bash
cmake --build . --target storage-daemon storage-daemon-cli
```

The binary will be located at:

```bash
./storage/storage-daemon/
```

# Compile old TON versions

TON releases: https://github.com/ton-blockchain/ton/tags

```bash
git clone https://github.com/ton-blockchain/ton.git
cd ton
# git checkout <TAG> for example checkout func-0.2.0
git checkout func-0.2.0
git submodule update --init --recursive
cd ..
mkdir ton-build
cd ton-build
cmake ../ton
# build func 0.2.0
cmake --build . --target func
```

## Compile old versions on Apple M1

TON supports Apple M1 from 11 Jun 2022 ([Add apple m1 support (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430) commit).

To compile older TON revisions on Apple M1:

1. Update RocksDb submodule to 6.27.3

   ```bash
   cd ton/third-party/rocksdb/
   git checkout fcf3d75f3f022a6a55ff1222d6b06f8518d38c7c
   ```

2. Replace root `CMakeLists.txt` by https://github.com/ton-blockchain/ton/blob/c00302ced4bc4bf1ee0efd672e7c91e457652430/CMakeLists.txt

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory.md
================================================
import Feedback from '@site/src/components/Feedback';

# Compile TON on low-memory machines

:::caution
This section provides low-level instructions for working with TON.
:::

To compile TON on systems with limited memory (< 1 GB), you need to create swap partitions.

## Prerequisites

When compiling C++ components on Linux, you may encounter memory-related failures:

```
C++: fatal error: Killed signal terminated program cc1plus
compilation terminated.
```

## Solution

Follow these steps to create a 4GB swap partition:

```bash
# Create swap partition
sudo mkdir -p /var/cache/swap/

# Allocate 4GB swap space (64MB blocks × 64)
sudo dd if=/dev/zero of=/var/cache/swap/swap0 bs=64M count=64

# Set secure permissions
sudo chmod 0600 /var/cache/swap/swap0

# Initialize swap
sudo mkswap /var/cache/swap/swap0

# Activate swap
sudo swapon /var/cache/swap/swap0

# Verify activation
sudo swapon -s
```

### Swap management commands

**Remove swap partition:**

```bash
sudo swapoff /var/cache/swap/swap0
sudo rm /var/cache/swap/swap0
```

**Free all swap space:**

```bash
sudo swapoff -a
# Check memory: free -m
```

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/howto/multisig-js.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/howto/multisig-js.md
================================================
---
description: At the end of this guide you will deploy multisig wallet and send some transactions using ton library
---
import Feedback from '@site/src/components/Feedback';

# Interact with multisig wallets using TypeScript

:::warning
This page is heavily outdated and will be updated soon.  
Refer to the [multisig-contract-v2](https://github.com/ton-blockchain/multisig-contract-v2), the most up-to-date multisignature contract on TON.  
Use npm and avoid updating this guide.
:::

## Introduction

If you’re unfamiliar with multisig wallets on TON, you can learn more [here](/v3/guidelines/smart-contracts/howto/multisig).

By following these steps, you’ll learn how to:

- Create and deploy a multisig wallet.
- Create, sign, and send transactions using the wallet.

We’ll create a TypeScript project and use the [ton](https://www.npmjs.com/package/ton) library, so you’ll need to install it first. We’ll also use [ton-access](https://www.orbs.com/ton-access/):

```bash
yarn add typescript @types/node ton ton-crypto ton-core buffer @orbs-network/ton-access
yarn tsc --init -t es2022
```

The full code for this guide is available here:  
[https://github.com/Gusarich/multisig-ts-example](https://github.com/Gusarich/multisig-ts-example)

---

## Create and deploy a multisig wallet

Let’s create a source file, such as `main.ts`. Open it in your favorite code editor and follow along!

### 1. Import required modules

First, import the necessary modules:

```js
import {
  Address,
  beginCell,
  MessageRelaxed,
  toNano,
  TonClient,
  WalletContractV4,
  MultisigWallet,
  MultisigOrder,
  MultisigOrderBuilder,
} from "ton";
import { KeyPair, mnemonicToPrivateKey } from "ton-crypto";
import { getHttpEndpoint } from "@orbs-network/ton-access";
```

### 2. Create a TonClient instance

Initialize the `TonClient`:

```js
const endpoint = await getHttpEndpoint();
const client = new TonClient({ endpoint });
```

### 3. Generate key pairs

Create key pairs for the multisig wallet:

```js
let keyPairs: KeyPair[] = [];

let mnemonics = [
    ['orbit', 'feature', ...], // Replace with a 24-word seed phrase
    ['sing', 'pattern',  ...],
    ['piece', 'deputy', ...],
    ['toss', 'shadow',  ...],
    ['guard', 'nurse',   ...]
];

for (let i = 0; i < mnemonics.length; i++) {
    keyPairs[i] = await mnemonicToPrivateKey(mnemonics[i]);
}
```

### 4. Create a MultisigWallet object

You can create a `MultisigWallet` object in two ways:

- **Import an existing wallet by address**:

  ```js
  let addr: Address = Address.parse(
    "EQADBXugwmn4YvWsQizHdWGgfCTN_s3qFP0Ae0pzkU-jwzoE"
  );
  let mw: MultisigWallet = await MultisigWallet.fromAddress(addr, { client });
  ```

- **Create a new wallet**:
  ```js
  let mw: MultisigWallet = new MultisigWallet(
    [keyPairs[0].publicKey, keyPairs[1].publicKey],
    0,
    0,
    1,
    { client }
  );
  ```

### 5. Deploy the multisig wallet

You can deploy the wallet in two ways:

- **Via internal message**:

  ```js
  let wallet: WalletContractV4 = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPairs[4].publicKey,
  });
  // Ensure the wallet is active and has a balance
  await mw.deployInternal(
    wallet.sender(client.provider(wallet.address, null), keyPairs[4].secretKey),
    toNano("0.05")
  );
  ```

- **Via external message**:
  ```js
  await mw.deployExternal();
  ```

---

## Create, sign, and send an order

### 1. Create an order

Use `MultisigOrderBuilder` to create a new order:

```js
let order1: MultisigOrderBuilder = new MultisigOrderBuilder(0);
```

### 2. Add messages to the order

Add messages to the order:

```js
let msg: MessageRelaxed = {
  body: beginCell()
    .storeUint(0, 32)
    .storeBuffer(Buffer.from("Hello, world!"))
    .endCell(),
  info: {
    bounce: true,
    bounced: false,
    createdAt: 0,
    createdLt: 0n,
    dest: Address.parse("EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"),
    forwardFee: 0n,
    ihrDisabled: true,
    ihrFee: 0n,
    type: "internal",
    value: { coins: toNano("0.01") },
  },
};

order1.addMessage(msg, 3);
```

### 3. Build and sign the order

Convert the `MultisigOrderBuilder` to `MultisigOrder` and sign it:

```js
let order1b: MultisigOrder = order1.build();
order1b.sign(0, keyPairs[0].secretKey);
```

### 4. Create and sign another order

Create another order, add a message, and sign it with a different key:

```js
let order2: MultisigOrderBuilder = new MultisigOrderBuilder(0);
order2.addMessage(msg, 3);
let order2b = order2.build();
order2b.sign(1, keyPairs[1].secretKey);

order1b.unionSignatures(order2b); // Merge signatures from order2b into order1b
```

### 5. Send the signed order

Send the signed order:

```js
await mw.sendOrder(order1b, keyPairs[0].secretKey);
```

### 6. Build and run the project

Compile the project:

```bash
yarn tsc
```

Run the compiled file:

```bash
node main.js
```

If no errors occur, you’ve done everything correctly! Verify the transaction using an explorer or wallet.

---

## Other methods and properties

### Clear messages

Clear messages from a `MultisigOrderBuilder`:

```js
order2.clearMessages();
```

### Clear signatures

Clear signatures from a `MultisigOrder`:

```js
order2b.clearSignatures();
```

### Access public properties

You can access public properties from `MultisigWallet`, `MultisigOrderBuilder`, and `MultisigOrder` objects:

- **MultisigWallet**:

  - `owners`: `Dictionary<number, Buffer>` of signatures (`ownerId => signature`).
  - `workchain`: Workchain where the wallet is deployed.
  - `walletId`: Wallet ID.
  - `k`: Number of signatures required to confirm a transaction.
  - `address`: Wallet address.
  - `provider`: `ContractProvider` instance.

- **MultisigOrderBuilder**:

  - `messages`: Array of `MessageWithMode` to be added to the order.
  - `queryId`: Global time until which the order is valid.

- **MultisigOrder**:
  - `payload`: `Cell` with order payload.
  - `signatures`: `Dictionary<number, Buffer>` of signatures (`ownerId => signature`).

---

## References

- [Low-level multisig guide](/v3/guidelines/smart-contracts/howto/multisig)
- [ton.js Documentation](https://ton-community.github.io/ton/)
- [Multisig contract sources](https://github.com/ton-blockchain/multisig-contract)

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/howto/multisig.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/howto/multisig.md
================================================
---
description: At the end of the tutorial, you will have deployed multisig contract in TON Blockchain.
---

import Feedback from '@site/src/components/Feedback';

# Make a simple multisig contract with fift

:::caution advanced level
This information is **very low-level**. It could be hard for newcomers and designed for advanced people who want to understand [fift](/v3/documentation/smart-contracts/fift/overview). The use of fift is not required in everyday tasks.
:::

## 💡 Overview

This tutorial helps you learn how to deploy your multisig contract.  
Recall that an (n, k)-multisig contract is a multisignature wallet with n private key holders, which accepts requests to send messages if the request (aka order, query) collects at least k holders' signatures.

Based on the original multisig contract code and updates by akifoq:

- [Original TON Blockchain multisig-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc)
- [akifoq/multisig](https://github.com/akifoq/multisig) with fift libraries to work with multisig.

:::tip starter tip
For anyone new to multisig: [What is Multisig Technology? (video)](https://www.youtube.com/watch?v=yeLqe_gg2u0)
:::

## 📖 What you'll learn

- How to create and customize a simple multisig wallet.
- How to deploy a multisig wallet using lite-client.
- How to sign a request and send it in a message to the blockchain.

## ⚙ Set your environment

Before we begin our journey, check and prepare your environment.

- Install `func`, `fift`, `lite-client` binaries, and `fiftlib` from the [Installation](/v3/documentation/archive/precompiled-binaries) section.
- Clone the [repository](https://github.com/akifoq/multisig) and open its directory in CLI.

```bash
git clone https://github.com/akifoq/multisig.git
cd ~/multisig
```

## 🚀 Let's get started!

1. Compile the code to fift.
2. Prepare multisig owners' keys.
3. Deploy your contract.
4. Interact with the deployed multisig wallet in the blockchain.

### Compile the contract

Compile the contract to Fift with:

```cpp
func -o multisig-code.fif -SPA stdlib.fc multisig-code.fc
```

### Prepare multisig owners' keys

#### Create participants' keys

To create a key, you need to run:

```cpp
fift -s new-key.fif $KEY_NAME$
```

- Where `KEY_NAME` is the file name where the private key will be written.

For example:

```cpp
fift -s new-key.fif multisig_key
```

We'll receive a `multisig_key.pk` file with the private key inside.

#### Collect public keys

Also, the script will issue a public key in the format:

```
Public key = Pub5XqPLwPgP8rtryoUDg2sadfuGjkT4DLRaVeIr08lb8CB5HW
```

Anything after `"Public key = "` needs to be saved somewhere!

Let's store it in a file called `keys.txt`. It's important to have one public key per line.

### Deploy your contract

#### Deploy via lite-client

After creating all the keys, you need to collect the public keys into a text file, `keys.txt`.

For example:

```bash
PubExXl3MdwPVuffxRXkhKN1avcGYrm6QgJfsqdf4dUc0an7/IA
PubH821csswh8R1uO9rLYyP1laCpYWxhNkx+epOkqwdWXgzY4
```

After that, you need to run:

```cpp
fift -s new-multisig.fif 0 $WALLET_ID$ wallet $KEYS_COUNT$ ./keys.txt
```

- `$WALLET_ID$` - the wallet number assigned for the current key. It is recommended that each new wallet with the same key use a unique `$WALLET_ID$`.
- `$KEYS_COUNT$` - the number of keys needed for confirmation, usually equal to the number of public keys.

:::info wallet_id explained
It is possible to create many wallets with the same keys (Alice key, Bob key). What should we do if Alice and Bob already have a treasure? That's why `$WALLET_ID$` is crucial here.
:::

The script will output something like:

```bash
new wallet address = 0:4bbb2660097db5c72dd5e9086115010f0f8c8501e0b8fef1fe318d9de5d0e501

(Saving address to file wallet.addr)

Non-bounceable address (for init): 0QBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAbel

Bounceable address (for later access): kQBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAepg

(Saved wallet creating query to file wallet-create.boc)
```

:::info
If you have a "public key must be 48 characters long" error, please make sure your `keys.txt` has a Unix-type word wrap - LF. For example, word wrap can be changed via the Sublime text editor.
:::

:::tip
A bounceable address is better to keep - this is the wallet's address.
:::

#### Activate your contract

You need to send some TON to our newly generated _treasure_. For example, 0.5 TON. You can send testnet coins via [@testgiver_ton_bot](https://t.me/testgiver_ton_bot).

After that, you need to run lite-client:

```bash
lite-client -C global.config.json
```

:::info Where to get `global.config.json`?
You can get a fresh config file `global.config.json` for [mainnet](https://ton.org/global-config.json) or [testnet](https://ton.org/testnet-global.config.json).
:::

After starting lite-client, it's best to run the `time` command in the lite-client console to make sure the connection was successful:

```bash
time
```

Okay, lite-client works!

After that, you need to deploy the wallet. Run the command:

```
sendfile ./wallet-create.boc
```

After that, the wallet will be ready to work within a minute.

### Interact with a multisig wallet

#### Create a request

First, you need to create a message request:

```cpp
fift -s create-msg.fif $ADDRESS$ $AMOUNT$ $MESSAGE$
```

- `$ADDRESS$` - address where to send coins.
- `$AMOUNT$` - number of coins.
- `$MESSAGE$` - the file name for the compiled message.

For example:

```cpp
fift -s create-msg.fif EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB 0.1 message
```

:::tip
Use the `-C comment` attribute to add a comment for your transaction. To get more information, run the _create-msg.fif_ file without parameters.
:::

#### Choose a wallet

Next, you need to choose a wallet to send coins from:

```
fift -s create-order.fif $WALLET_ID$ $MESSAGE$ -t $AWAIT_TIME$
```

Where

- `$WALLET_ID$` — is an ID of the wallet backed by this multisig contract.
- `$AWAIT_TIME$` — Time in seconds that the smart contract will await signs from multisig wallet's owners for the request.
- `$MESSAGE$` — here is the name of the message boc-file created in the previous step.

:::info
The request expires if the time equals `$AWAIT_TIME$` passed before the request signs. As usual, `$AWAIT_TIME$` equals a couple of hours (7200 seconds).
:::

For example:

```
fift -s create-order.fif 0 message -t 7200
```

The ready file will be saved in `order.boc`.

:::info
`order.boc` must be shared with key holders; they must sign it.
:::

#### Sign your part

To sign, you need to do:

```bash
fift -s add-signature.fif $KEY$ $KEY_INDEX$
```

- `$KEY$` - file name containing the private key to sign, without extension.
- `$KEY_INDEX$` - index of the given key in `keys.txt` (zero-based).

For example, for our `multisig_key.pk` file:

```
fift -s add-signature.fif multisig_key 0
```

#### Create a message

After everyone has signed the order, it needs to be turned into a message for the wallet and signed again with the following command:

```
fift -s create-external-message.fif wallet $KEY$ $KEY_INDEX$
```

In this case, only one sign of the wallet's owner will be enough. The idea is that you can't attack a contract with invalid signatures.

For example:

```
fift -s create-external-message.fif wallet multisig_key 0
```

#### Send sign to TON blockchain

After that, you need to start the light client again:

```bash
lite-client -C global.config.json
```

And finally, we want to send our sign! Just run:

```bash
sendfile wallet-query.boc
```

If everyone else signed the request, it will be completed!

You did it, ha-ha! 🚀🚀🚀

## See also

- [Read more about multisig wallets in TON](https://github.com/akifoq/multisig) — _[@akifoq](https://t.me/aqifoq)_
- [Multisig wallet v2](https://github.com/ton-blockchain/multisig-contract-v2)

<Feedback />



================================================
FILE: docs/v3/guidelines/smart-contracts/howto/nominator-pool.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/howto/nominator-pool.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# How to use the nominator pool

:::tip
Before reading this tutorial, you should familiarize yourself with [nominator pool specification](/v3/documentation/smart-contracts/contracts-specs/nominator-pool).
:::

## Running the validator in nominator pool mode {#validator-pool-mode}

1. Set up the hardware for the validator - you will need 8 vCPUs, 128GB memory, 1TB SSD, a fixed IP address, and 1Gb/s internet speed.

   To maintain network stability, distribute validator nodes across different geographical locations worldwide rather than concentrating them in a single data center. Use [this site](https://status.toncenter.com/) to assess the load of various locations. The map indicates high data center utilization in Europe, especially in Finland, Germany, and Paris. Therefore, avoid using providers such as Hetzner and OVH.

   > Ensure your hardware meets or exceeds the specifications above. Running the validator on insufficient hardware negatively impacts the network and could result in penalties.

   > Note that as of May 2021, Hetzner has prohibited mining on its servers. This ban includes both PoW and PoS algorithms. Even installing a regular node may violate their terms of service.

   > **Recommended providers include:** [Amazon](https://aws.amazon.com/), [DigitalOcean](https://www.digitalocean.com/), [Linode](https://www.linode.com/), [Alibaba Cloud](https://alibabacloud.com/), [Latitude](https://www.latitude.sh/).

2. Install and synchronize **mytonctrl** as described in the guide [here](/v3/guidelines/nodes/running-nodes/full-node#install-the-mytonctrl).

   For additional help, refer to this [video instruction](/v3/guidelines/nodes/running-nodes/full-node#run-a-node-video).

3. Transfer 1 TON to the validator wallet address in the `wl` list.

4. Use the `aw` command to activate your validator wallet.

5. Activate pool mode:

   ```bash
   enable_mode nominator-pool
   set stake null
   ```

6. Create two pools (for even and odd validation rounds):

   ```bash
   new_pool p1 0 1 1000 300000
   new_pool p2 0 1 1001 300000
   ```

   Where:

   - `p1` is the pool name;
   - `0` % is the validator's reward share (e.g., use 40 for 40%);
   - `1` is the maximum number of nominators in the pool (should be \<= 40);
   - `1000` TON is the minimum validator stake (should be >= 1K TON);
   - `300000` TON is the minimum nominator stake (should be >= 10K TON);

   > (!) Pool configurations do not have to be identical. You can add 1 to the minimum stake of one pool to make them different.

   > (!) Use https://tonmon.xyz/ to determine the current minimum validator stake.

7. Type `pools_list` to display pool addresses:

   ```bash
   pools_list
   Name  Status  Balance  Address
   p1    empty   0        0f98YhXA9wnr0d5XRXT-I2yH54nyQzn0tuAYC4FunT780qIT
   p2    empty   0        0f9qtmnzs2-PumMisKDmv6KNjNfOMDQG70mQdp-BcAhnV5jL
   ```

8. Send 1 TON to each pool and activate the pools:

   ```bash
   mg validator_wallet_001 0f98YhXA9wnr0d5XRXT-I2yH54nyQzn0tuAYC4FunT780qIT 1
   mg validator_wallet_001 0f9qtmnzs2-PumMisKDmv6KNjNfOMDQG70mQdp-BcAhnV5jL 1
   activate_pool p1
   activate_pool p2
   ```

9. Type `pools_list` to display pools:

   ```bash
   pools_list
   Name  Status  Balance      Address
   p1    active  0.731199733  kf98YhXA9wnr0d5XRXT-I2yH54nyQzn0tuAYC4FunT780v_W
   p2    active  0.731199806  kf9qtmnzs2-PumMisKDmv6KNjNfOMDQG70mQdp-BcAhnV8UO
   ```

10. Open each pool via the link "https://tonscan.org/nominator/{address_of_pool}" and verify pool configurations.

11. Proceed with the validator deposit to each pool:

    ```bash
    deposit_to_pool validator_wallet_001 <address_of_pool_1> 1005
    deposit_to_pool validator_wallet_001 <address_of_pool_2> 1005
    ```

In these commands, `1005` TON is the deposit amount. The pool will deduct 1 TON to process the deposit.

12. Proceed with the nominator deposit to each pool:

    Visit the pool link (from **Step 9**) and click **ADD STAKE**.
    You can also make a deposit using **mytonctrl**, using the following commands:

    ```bash
    mg nominator_wallet_001 <address_of_pool_1> 300001 -C d
    mg nominator_wallet_001 <address_of_pool_2> 300001 -C d
    ```

> (!) The nominator wallet must be initialized in the basechain (workchain 0).

> (!) Remember that the validator and nominator wallets must be stored separately! Store the validator wallet on the server with the validator node to ensure the processing of all system transactions. Meanwhile, store the nominator wallet in your cold cryptocurrency wallet.

> To withdraw a nominator deposit, send a transaction with the comment `w` to the pool address (attach 1 TON to process the transaction). You can also perform this action using **mytonctrl**.

13. Invite nominators to deposit into your pools. The participation in validation will commence automatically.


> (!) Ensure you have at least 200 TON/month in your validator wallet for operation fees.

  > In the TON blockchain, the validator cycle is approximately 18 hours, and there are roughly 40.5 validation rounds per month (assuming a 30-day month).
  
  > Here's the breakdown of costs based on participation:
    >
    > - **Participating in only odd or even cycles (half of the rounds):**
    >
    >   - Rounds per month: ~20.25
    >   - Cost per round: ~5 Toncoins
    >   - `total cost = 20.25 * 5 -> ~101.25 Toncoins`
    >
    > - **Participating in both odd and even cycles (all rounds):**
    >   - Rounds per month: ~40.5
    >   - Cost per round : ~ 5 Toncoins
    >   - `total cost = 40.5 * 5 -> ~202.50 Toncoins`


## Pool configuration

If you intend to lend to yourself, use `new_pool p1 0 1 1000 300000` (maximum of 1 nominator, 0% validator share).

If you're creating a pool for numerous nominators, you might use something like this: `new_pool p1 40 40 10000 10000` (maximum of 40 nominators, 40% validator share, minimum participant stakes of 10K TON).

## Transitioning a regular validator to nominator pool mode

1. Input `set stake 0` to discontinue election participation.

2. Await the return of both your stakes from the elector.

3. Proceed with the steps under [Running the validator in nominator pool mode](#validator-pool-mode) from the **4th step** onwards.
   <Feedback />



================================================
FILE: docs/v3/guidelines/smart-contracts/howto/shard-optimization.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/howto/shard-optimization.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Shard optimizations on TON

## Architecture basics

TON processes countless transactions in parallel. This capability relies on the infinite sharding paradigm. When the load on a group of validators approaches its throughput limit, the system splits (shards) the group. Two groups of validators then independently and in parallel process this load. The system deterministically performs these splits, and the contract address associated with the transaction determines which group processes it. The system processes addresses close to each other (sharing the same prefix) in the same shard.TON processes countless transactions in parallel. This capability relies on the [infinite sharding paradigm](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm). When the load on a group of validators approaches its throughput limit, the system splits (shards) the group. Two groups of validators then independently and in parallel process this load. The system deterministically performs these splits, and the contract address associated with the transaction determines which group processes it. The system processes addresses close to each other (sharing the same prefix) in the same shard.

When one contract sends a message to another, two scenarios can occur: either both contracts reside in the same shard or in different shards. In the first scenario, the current group already holds all the necessary data and can process the message immediately. In the second scenario, the system must route the message from one group to another. To prevent message loss or double-processing, the system requires proper accounting. It achieves this by registering a queue of outgoing messages from the sender's shard in a MasterChain block. The receiver's shard must explicitly confirm that it has processed this queue. This overhead slows down cross-shard message delivery, as the system requires at least one MasterChain block between the block where the message was sent and the block where it was consumed. Typically, this delay lasts about 12-13 seconds.

Since the system processes all transactions for a single account within one shard, the transactions per second (TPS) speed for that account becomes limited. This limitation means that when designing an architecture for a new mass-scale protocol, you should aim to avoid central points. Furthermore, if a chain of transactions follows the same route, sharding will not speed up its processing. Each contract in the chain will face the same TPS limit, and delivery latency will increase the overall chain processing time.

In a mass-scale system, the trade-off between latency and throughput becomes the key factor separating good and great protocols.

## To shard or not to shard

To enhance user experience and reduce processing time, protocols must identify which parts of their system can process transactions in parallel and benefit from sharding to improve throughput. They must also determine which parts are strictly sequential and will achieve lower latency if placed in the same shard.

A prime example of throughput optimization involves Jettons. Since transfers from A to B and C to D operate independently, the system can process them in parallel. By distributing all jetton wallets randomly and uniformly across the address space, the system achieves a balanced load distribution across the blockchain, enabling throughput of hundreds of transfers per second (and potentially thousands in the future) with acceptable latency.

On the other hand, consider a smart contract, contract A, that interacts with jettons. Suppose contract A performs an action when it receives jetton X, and its associated jetton wallet is contract B. Placing contract A and contract B in different shards will not increase throughput. Instead, each incoming transfer will follow the same chain of addresses, creating bottlenecks at each step. Placing contracts A and B in the same shard improves latency, reducing the overall chain processing time.

## Practical conclusion for smart contract developers

If you rely on a single smart contract to execute business logic, consider deploying multiple instances of that contract to leverage TON’s parallelism. If this approach isn’t feasible and your smart contract interacts with a predefined set of other contracts (such as jetton wallets), aim to place them in the same shard. You can often achieve this off-chain by brute-forcing specific contract addresses to ensure all desired jetton wallets have neighboring addresses. In some cases, onchain brute-forcing is also acceptable.

Upcoming node and network performance improvements will likely boost the throughput of individual shards and reduce delivery latency. However, these advancements will coincide with a growing number of users. As more users join the network, shard optimization will become increasingly critical. Eventually, it will determine the success of mass-scale applications: users will naturally prefer the most convenient option, meaning the application with lower latency. Therefore, don’t delay shard-optimizing your application in anticipation of overall network improvements. Act now! In many cases, shard optimization may even outweigh gas optimization in importance.

## Practical conclusion for services

### Deposits

If you expect deposits at a rate exceeding, for example, 30 transfers per second, you should use multiple addresses to accept them in parallel and achieve high throughput. If you know the user’s deposit address — for instance, through a transaction initiated via TON Connect - select the deposit address closest to the user’s wallet address. Below is the ready-to-use TypeScript code for choosing the closest address:

```typescript
import { Address } from "@ton/ton";

function findMatchingBits (a: number, b: number, start_from: number) {
    let bitPos    = start_from;
    let keepGoing = true;
    do {
        const bitCount = bitPos + 1;
        const mask     = (1 << (bitCount)) - 1;
        const shift    = 8 - bitCount;
        if(((a >> shift) & mask) == ((b >> shift) & mask)) {
            bitPos++;
 }
        else {
            keepGoing = false;
 }
 } while(keepGoing && bitPos < 7);

    return bitPos;
}

function chooseAddress(user: Address, contracts: Address[]) {
  const maxBytes = 32;
  let byteIdx = 0;
  let bitIdx = 0;
  let bestMatch: Address | undefined;

    if(user.workChain !== 0) {
        throw new TypeError(`Only basechain user address allowed:${user}`);
 }
    for(let testContract of contracts) {
        if(testContract.workChain !== 0) {
            throw new TypeError(`Only basechain deposit address allowed:${testContract}`);
 }
        if(byteIdx >= maxBytes) {
            break;
 }
        if(byteIdx == 0 || testContract.hash.subarray(0, byteIdx).equals(user.hash.subarray(0, byteIdx))) {
            let keepGoing  = true;
            do {
                if(keepGoing && testContract.hash[byteIdx] == user.hash[byteIdx]) {
                    bestMatch = testContract;
                    byteIdx++;
                    bitIdx = 0;
                    if(byteIdx == maxBytes) {
                        break;
 }
 }
                else {
                    keepGoing = false;
                    if(bitIdx < 7) {
                        const resIdx = findMatchingBits(user.hash[byteIdx], testContract.hash[byteIdx], bitIdx);
                        if(resIdx > bitIdx) {
                            bitIdx = resIdx;
                            bestMatch = testContract;
 }
 }
 }
 } while(keepGoing);
 }
 }
    return {
        match: bestMatch,
        prefixLength: byteIdx * 8 + bitIdx
 }
}
```

If you expect jetton deposits, you should not only create multiple deposit addresses but also shard-optimize them. Ensure each deposit address resides in the same shard as its corresponding jetton wallet. You can use a generator for such addresses, available [here](https://github.com/Trinketer22/turbo-wallet). Additionally, selecting the deposit address closest to the user’s wallet address will further improve efficiency.

### Withdrawals

The same applies to withdrawals; if you need to send a large number of transfers per second, it is advisable to have multiple sending addresses and shard-optimize them with jetton wallets if necessary.

## Shard optimizations 101

### Explain shards like I'm from web 2

Like any other blockchain, the TON blockchain is a network, so it makes sense to try to explain it in web2 (IPv4) networking terms.

#### Endpoints

In general networking, the endpoint is a physical device; in blockchain, the endpoint is a smart contract.

#### Shards

In this analogy, a shard functions like a subnet. The key difference lies in the addressing scheme: IPv4 uses a 32-bit system, while TON employs a 256-bit one.  
The shard prefix of a contract address identifies the group of validators responsible for computing the results of its incoming messages. From a networking perspective, a request within the same network segment processes faster than one routed elsewhere. This principle resembles using a CDN to host content closer to end users; in TON, we deploy contracts closer to the users.

When the load on a shard surpasses a [certain threshold](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm#algorithm-for-deciding-whether-to-split-or-merge), the system splits the shard. This split allocates dedicated computational resources to the overloaded contract and isolates its impact on the broader network. Currently, the maximum shard prefix length is 4 bits, allowing the blockchain to split into a maximum of 16 shards, ranging from prefix 0 to 15.


### Problems during shard optimizations

Let's get more practical.

#### Check if two addresses belong to the same shard

Since we know that the shard prefix is a maximum of 4 bits, a code snippet for it could look like this:

```typescript
import { Address } from '@ton/core';
const addressA = Address.parse(...);
const addressB = Address.parse(...);

if((addressA.hash[0] >> 4) == (addressB.hash[0] >> 4)) {
  console.log("Same shard");
} else {
  console.log("Nope");
}
```

From the human perspective, the easiest way to check the address shard is to look at the address [raw form](/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses#raw-address).
One could use the [address page](https://ton.org/address/) for it.
Let's test it on the USDT address, for example: `EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs`.
You will see `0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe` as a raw representation, and the first 4 bits are essentially the first hexadecimal symbol - `b`.
Now we know that the USDT minter is located in shard `b` (hex) or `11` (decimal).

### How to deploy a contract to a specific shard

To understand how this works, you must first grasp how a contract address [depends](/v3/documentation/smart-contracts/addresses#account-id) on its code and data. Essentially, the system generates the address by computing a SHA256 hash of the contract’s code and data at deployment time.  

Given this, the only way to deploy a contract with the same code in a different shard is to manipulate its initial data. The data field influencing the resulting contract address is called a _nonce_. You can use any field that is either safe to update after deployment or does not directly affect contract execution for this purpose.  

One of the earliest examples of this principle in action is the [vanity contract](https://github.com/ton-community/vanity-contract). It includes a `salt` data field specifically designed to _brute-force_ a value that produces the desired address pattern.  

Placing a contract into a specific shard follows the same approach, except the prefix you need to match is much shorter. A simple starting point for this is the wallet contract.  

- The [Wallet creation for different shard](/v3/guidelines/dapps/asset-processing/payments-processing/#wallet-creation-for-different-shards) article illustrates the case where the public key is used as a nonce to put the wallet in a specific shard.
- The other example is [turbo-wallet](https://github.com/Trinketer22/turbo-wallet/blob/d239c1a1ac31c7f5545c2ef3ddc909d6cbdafe24/src/lib/contracts/HighloadWalletV3.ts#L44) using subwalletId for the [same](https://github.com/Trinketer22/turbo-wallet/blob/d239c1a1ac31c7f5545c2ef3ddc909d6cbdafe24/src/lib/turboWallet.ts#L80) purposes.
 You can pretty quickly extend the [ShardedContract](https://github.com/Trinketer22/turbo-wallet/blob/main/src/lib/ShardedContract.ts) interface using your contract constructor to make it _sharded_ too.

## Mass jetton distribution solutions

If you need to distribute jettons to tens or hundreds of thousands - or even millions - of users, refer to this [page](/v3/guidelines/dapps/asset-processing/mintless-jettons). We recommend leveraging existing, battle-tested services. Several of these solutions are deeply optimized, offering shard-optimized performance and lower costs compared to custom-built alternatives:

- **Mintless jettons:** During a Token Generation Event (TGE), you can enable users to claim a predefined airdrop directly from the jetton wallet contract. This approach is cost-effective, eliminates the need for additional transactions, and operates on-demand (only users ready to spend jettons will claim them).
- **Tonapi solution for jetton mass sending:** This solution distributes existing jettons by sending them directly to user wallets. Proven by Notcoin and DOGS (handling millions of transfers each), it optimizes latency, throughput, and costs. [Mass jetton sending](https://docs.tonconsole.com/tonconsole/jettons/mass-sending).
- **[TokenTable solution](https://docs.tokentable.xyz/) for decentralized claim:** This approach lets users claim jettons from specific claim transactions (users cover the fees). Tested by Avacoin and DOGS (millions of transfers), it maximizes throughput while managing costs.

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/howto/single-nominator-pool.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/howto/single-nominator-pool.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to use a single nominator pool

:::tip
Before proceeding with this tutorial, we recommend familiarizing yourself with the [single nominator pool specification](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool).
:::

### Set up single nominator mode

:::caution
Before starting, ensure you have topped up and [activated](/v3/guidelines/nodes/running-nodes/validator-node#activate-the-wallets) the validator's wallet.
:::

1. Enable single nominator mode:

```bash
MyTonCtrl> enable_mode single-nominator
```

2. Verify if single nominator mode is enabled:

```bash
MyTonCtrl> status_modes
Name              Status   Description
single-nominator  enabled  Orbs's single nominator pools.
```

3. Create a pool:

```bash
MyTonCtrl> new_single_pool <pool-name> <owner_address>
```

If you have already created a pool, you can import it:

```bash
MyTonCtrl> import_pool <pool-name> <pool-addr>
```

4. Display pool addresses using `pools_list`:

```bash
MyTonCtrl> pools_list
Name       Status  Balance  Version   Address
test-pool  empty   0.0      spool_r2  kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX
```

5. Activate the pool:

```bash
MyTonCtrl> activate_single_pool <pool-name>
```

After successfully activating the pool:

```bash
MyTonCtrl> pools_list
Name       Status  Balance  Version   Address
test-pool  active  0.99389  spool_r2  kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX
```

You can manage this pool via MyTonCtrl like a standard nominator pool.

:::info
If the pool's balance is sufficient to participate in both rounds (`balance > min_stake_amount * 2`), MyTonCtrl will automatically participate in both rounds using `stake = balance / 2`, unless you manually set the stake using the `set stake` command. This behavior differs from using a nominator pool but resembles staking with a validator wallet.
:::

## Start without MyTonCtrl

#### Prepare a launched validator

If you have MyTonCtrl installed and a validator running:

1. Stop validation and withdraw all funds.

#### Prepare from scratch

If you have no prior validator setup, follow these steps:

1. [Run a validator](/v3/guidelines/nodes/running-nodes/full-node) and ensure it is synced.
2. Stop validation and withdraw all funds.

### Prepare single nominator

1. Install [Node.js](https://nodejs.org/en) v.16 or later and npm ([detailed instructions](https://github.com/nodesource/distributions#debian-and-ubuntu-based-distributions)).
2. Install `ts-node` and the `arg` module:

```bash
$ sudo apt install ts-node
$ sudo npm i arg -g
```

3. Create symlinks for compilers:

```bash
$ sudo ln -s /usr/bin/ton/crypto/fift /usr/local/bin/fift
$ sudo ln -s /usr/bin/ton/crypto/func /usr/local/bin/func
```

4. Run a test to verify the setup:

```bash
$ npm run test
```

5. Replace MyTonCtrl nominator-pool scripts: [Install pool scripts](https://raw.githubusercontent.com/orbs-network/single-nominator/main/mytonctrl-scripts/install-pool-scripts.sh).

### Create a single nominator pool

1. Obtain a TON Center API key from [@tonapibot](https://t.me/tonapibot) on Telegram.
2. Set environment variables:

```bash
export OWNER_ADDRESS=<owner_address>
export VALIDATOR_ADDRESS=<validator_wallet_address>
export TON_ENDPOINT=https://toncenter.com/api/v2/jsonRPC
export TON_API_KEY=<toncenter_api_key>
```

3. Create a deployer address:

```bash
$ npm run init-deploy-wallet
Insufficient Deployer [EQAo5U...yGgbvR] funds 0
```

4. Top up the deployer address with 2.1 TON.
5. Deploy the pool contract to get the pool address (`Ef-kC0..._WLqgs`):

```bash
$ npm run deploy
```

6. Convert the address to `.addr`:

```bash
$ fift -s ./scripts/fift/str-to-addr.fif Ef-kC0..._WLqgs
```

(Saving address to file single-nominator.addr)

7. Back up the deployer private key (`./build/deploy.config.json`) and `single-nominator.addr` files.
8. Copy `single-nominator.addr` to `mytoncore/pools/single-nominator-1.addr`.
9. Send a stake from the owner's address to the single nominator's address.

### Withdrawals from the single nominator

#### Using wallets to withdraw

**Fift:**

1. Create a `withdraw.boc` request with the desired amount:

```bash
$ fift -s ./scripts/fift/withdraw.fif <withdraw_amount>
```

2. Create and sign the request from the owner's wallet:

```bash
$ fift -s wallet-v3.fif <my-wallet> <single_nominator_address> <sub_wallet_id> <seqno> <amount=1> -B withdraw.boc
```

3. Broadcast the query:

```bash
$ lite-client -C global.config.json -c 'sendfile wallet-query.boc'
```

**Tonkeeper:**

1. Create a `withdraw.boc` request with the desired amount:

```bash
$ fift -s ./scripts/fift/withdraw.fif <withdraw_amount>
```

2. Send the request to the single nominator address:

```bash
$ tons wallet transfer <my-wallet> <single_nominator_address> <amount=1> --body withdraw.boc
```

3. Link TypeScript:

```bash
npm link typescript
```

4. Generate a deeplink:

```bash
npx ts-node scripts/ts/withdraw-deeplink.ts <single-nominator-addr> <withdraw-amount>
```

5. Open the deeplink on the owner's phone.

## Deposit to pool

You can deposit using **MyTonCtrl** with the following commands:

```sh
MyTonCtrl> mg <from-wallet-name> <pool-account-addr> <amount>
```

or

```sh
MyTonCtrl> deposit_to_pool <pool-addr> <amount>
```

Alternatively, follow these steps:

1. Navigate to the pool’s page: `https://tonscan.org/nominator/{pool_address}`.
2. Ensure the pool information is displayed correctly. If the pool has an incorrect smart contract, no information will appear.
3. Click the `ADD STAKE` button or scan the QR code using Tonkeeper or another TON wallet.
4. Enter the TON amount and send the transaction. The TON coins will then be added to staking.

If the wallet does not open automatically, manually send the transaction by copying the pool address and using any TON wallet. Note that 1 TON will be deducted as a commission for processing the deposit.

## Withdraw funds

You can withdraw funds using the following command:

```sh
MyTonCtrl> withdraw_from_pool <pool-addr> <amount>
```

Alternatively, create and send the transaction manually:

<Tabs groupId="code-examples">
<TabItem value="toncore" label="JS (@ton)">

```js
import {
  Address,
  beginCell,
  internal,
  storeMessageRelaxed,
  toNano,
} from "@ton/core";

async function main() {
  const single_nominator_address = Address.parse("single nominator address");
  const WITHDRAW_OP = 0x1000;
  const amount = 50000;

  const messageBody = beginCell()
    .storeUint(WITHDRAW_OP, 32) // op code for withdrawal
    .storeUint(0, 64) // query_id
    .storeCoins(amount) // amount to withdraw
    .endCell();

  const internalMessage = internal({
    to: single_nominator_address,
    value: toNano("1"),
    bounce: true,
    body: messageBody,
  });
}
```

</TabItem>

<TabItem value="tonconnect" label="Golang">

```go
func WithdrawSingleNominatorMessage(single_nominator_address string, query_id, amount uint64) (*tonconnect.Message, error) {

    const WITHDRAW_OP = 0x1000;

    payload, _ := cell.BeginCell().
        MustStoreUInt(WITHDRAW_OP, 32). // op code for withdrawal
        MustStoreUInt(query_id, 64).    // query_id
        MustStoreCoins(amount).        // amount to withdraw
        EndCell().MarshalJSON();

    msg, err := tonconnect.NewMessage(
        single_nominator_address,
        tlb.MustFromTON("1").Nano().String(), // nanocoins to transfer/compute message
        tonconnect.WithPayload(payload));

    if err != nil {
        return nil, err;
 }

    return msg, nil;
}
```

</TabItem>
</Tabs>

## Election process

### Set up a single nominator pool

Configure the single nominator pool contract using the [following instructions](/v3/guidelines/smart-contracts/howto/single-nominator-pool#set-up-a-single-nominator-pool).

### Join the elections

[Deposit](/v3/guidelines/smart-contracts/howto/single-nominator-pool#set-up-a-single-nominator-pool) the minimum stake amount into the single nominator pool.

**MyTonCtrl** will automatically join the elections. You can set the stake amount that MyTonCtrl sends to the [elector contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector) approximately every 18 hours on Mainnet and 2 hours on Testnet.

```sh
MyTonCtrl> set stake 90000
```

Find the **minimum stake** amount using the `status` command.

![](/img/docs/single-nominator/tetsnet-conf.png)

You can set `stake` to `null`, which will calculate based on the `stakePercent` value (check with `status_settings`).

Verify if the election has started:

```bash
MyTonCtrl> status
```

For Testnet:

```bash
MyTonCtrl> status fast
```

Example:

![](/img/docs/single-nominator/election-status.png)

If the election has started and the single nominator pool is activated, the validator will **automatically** send an **ElectorNewStake** message to the elector contract at the beginning of the next round.

Check the validator wallet:

```sh
MyTonCtrl> wl
Name                  Status  Balance           Ver  Wch  Address
validator_wallet_001  active  995.828585374     v1   -1   kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
```

Check the transaction history:

```sh
MyTonCtrl> vas kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
Address                                           Status  Balance        Version
kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct  active  995.828585374  v1r3

Code hash
c3b9bb03936742cfbb9dcdd3a5e1f3204837f613ef141f273952aa41235d289e

Time                 Coins   From/To
39 minutes ago >>>  1.3     kf_hz3BIXrn5npis1cPX5gE9msp1nMTYKZ3l4obzc8phrBfF
```

This **ElectorNewStake** transaction appears in the single nominator contract history on Tonviewer:

![](/img/docs/single-nominator/new-stake.png)

In this example, **MyTonCtrl** automatically staked `90000` Toncoins on the elector contract.

### Check validator status

At the beginning of the next round, check the validator status with the `status` command (`status fast` on Testnet).

![](/img/docs/single-nominator/status-validator.png)

Confirm if your node has become a full validator by checking:

1. **Validator efficiency** – The local validator's efficiency should be green and not `n/a`.
2. **Validator index** – The validator index should be greater than -1.

### Check profit

At the end of the round, **MyTonCtrl** sends an **ElectorRecoverStakeRequest** message to the elector contract. It returns `stake + profit` to your single nominator pool.

![](/img/docs/single-nominator/validator-profit.png)

You can also check the pool's transaction history with the `vas` command:

![](/img/docs/single-nominator/validator-profit-vas.png)

### Stop participating

If you no longer wish to participate in validation:

1. Disable validator mode:

```bash
MyTonCtrl> disable_mode validator
```

2. [Withdraw](/v3/guidelines/smart-contracts/howto/single-nominator-pool#withdraw-funds) all funds from the single nominator contract to the owner wallet.

## Transitioning a regular validator to nominator pool mode

1. Disable the `validator` mode to stop participating in elections.
2. Wait for both stakes to return from the elector.
3. Follow the [steps](/v3/guidelines/smart-contracts/howto/single-nominator-pool#set-up-a-single-nominator-pool) to set up a single nominator pool.

## Single nominator pool client

- Use the open-source client [Single nominator client](https://github.com/orbs-network/single-nominator-client) to deploy and interact with the contract.
- For support, contact the team on [Telegram](https://t.me/single_nominator).

## Run a single nominator pool with a vesting contract

Initially, the owner of the vesting contract manages it with their wallet contract. This scheme involves managing interactions between multiple contracts.

| Contracts               | Interface for managing                      |
| ----------------------- | ------------------------------------------- |
| `validator_wallet`      | MyTonCtrl                                   |
| `vesting`               | [vesting.ton.org](https://vesting.ton.org/) |
| `owner_wallet`          | Apps like Tonkeeper or MyTonWallet          |
| `single_nominator_pool` | MyTonCtrl                                   |

- `owner_wallet` – The TON wallet that owns the `vesting`.

:::caution
Ensure you have backed up the vesting `owner_wallet` recovery phrase. If you lose access to the `owner_wallet`, you will also lose access to managing the `vesting` funds, and recovery will be impossible.
:::

1. Run a full node and wait for it to sync.
2. Enable validator mode and retrieve the `wallet_v1` address created during installation using `MyTonCtrl wl`.
3. Send 200 TON (for monthly expenses) to the `validator_wallet`.
4. Create a `single_nominator_pool`:

```bash
MyTonCtrl> new_single_pool <pool-name> <vesting>
```

Example:

```bash
MyTonCtrl> new_single_pool my_s_pool EQD...lme-D
```

5. Activate the `single_nominator_pool`:

```bash
MyTonCtrl> activate_single_pool <pool-name>
```

Example:

```bash
MyTonCtrl> activate_single_pool my_s_pool
```

6. After the `single_nominator_pool` address appears on-chain, request whitelisting from the person who provided the vesting contract.
7. Once whitelisted, you can send locked tokens from the `vesting` contract to the `single_nominator_pool` using [vesting.ton.org](https://vesting.ton.org/):
   - a. Connect the `owner_wallet` on [vesting.ton.org](https://vesting.ton.org/).
   - b. Test by sending 10 TON from `vesting` to the `single_nominator_pool`.
   - c. Return the remaining funds (~8 TON) to `vesting` with a message [amount 0, comment `w`] via the [vesting.ton.org](https://vesting.ton.org/) interface.
   - d. Confirm the remaining funds are received in `vesting`.
8. Transfer the required TON amount from `vesting` to `single_nominator_pool` for both cycles.
9. Wait for the validators’ voting.
   <Feedback />



================================================
FILE: docs/v3/guidelines/smart-contracts/howto/wallet.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/howto/wallet.md
================================================
---
description: In this tutorial, you will learn how to fully work with wallets, messages and smart contracts.
---

import Feedback from '@site/src/components/Feedback';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with wallet smart contracts

## 👋 Introduction

Learning how wallets and transactions work on TON before beginning smart contracts development is essential. This knowledge will help developers understand the interaction between wallets, messages, and smart contracts to implement specific development tasks.

:::tip
Before starting this tutorial, we recommend reviewing the [Wallet contracts](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts) article.
:::

This section will teach us to create operations without using pre-configured functions to understand development workflows. The references chapter contains all the necessary references for analyzing this tutorial.

## 💡 Prerequisites

This tutorial requires basic knowledge of JavaScript and TypeScript or Golang. It is also necessary to hold at least 3 TON (which can be stored in an exchange account, a non-custodial wallet, or the Telegram bot wallet). It is necessary to have a basic understanding of [cell](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage), [addresses in TON](/v3/documentation/smart-contracts/addresses), [blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains) to understand this tutorial.

:::info MAINNET DEVELOPMENT IS ESSENTIAL  
Working with the TON Testnet often leads to deployment errors, difficulty tracking transactions, and unstable network functionality. Completing most of the development on the TON Mainnet could help avoid potential issues. This may reduce the number of transactions and minimize fees.
:::

## 💿 Source code

All code examples used in this tutorial can be found in the following [GitHub repository](https://github.com/aSpite/wallet-tutorial).

## ✍️ What you need to get started

- Ensure NodeJS is installed.
- Specific Ton libraries are required and include: @ton/ton 13.5.1+, @ton/core 0.49.2+ and @ton/crypto 3.2.0+.

**OPTIONAL**: If you prefer Go instead of JS, install the [tonutils-go](https://github.com/xssnick/tonutils-go) library and the GoLand IDE to develop on TON. This library will be used in this tutorial for the GO version.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```bash
npm i --save @ton/ton @ton/core @ton/crypto
```

</TabItem>
<TabItem value="go" label="Golang">

```bash
go get github.com/xssnick/tonutils-go
go get github.com/xssnick/tonutils-go/adnl
go get github.com/xssnick/tonutils-go/address
```

</TabItem>
</Tabs>

## ⚙ Set your environment

To create a TypeScript project, you need to follow these steps in order:

1. Create an empty folder (which we’ll name WalletsTutorial).
2. Open the project folder using the CLI.
3. Use the following commands to set up your project:

```bash
npm init -y
npm install typescript @types/node ts-node nodemon --save-dev
npx tsc --init --rootDir src --outDir build \ --esModuleInterop --target es2020 --resolveJsonModule --lib es6 \ --module commonjs --allowJs true --noImplicitAny false --allowSyntheticDefaultImports true --strict false
```

:::info
To help us carry out the following process, a `ts-node` executes TypeScript code directly without precompiling. `nodemon` restarts the node application automatically when file changes in the directory are detected.
::: 

4. Next, remove these lines from `tsconfig.json`:

```json
  "files": [
    "\\",
    "\\"
 ]
```

5. Then, create a `nodemon.json` config in your project root with the following content:

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "npx ts-node ./src/index.ts"
}
```

6. Add this script to `package.json` instead of "test", which is included when the project is created.

```json
"start:dev": "npx nodemon"
```

7. Create a `src` folder in the project root and an `index.ts` file in this folder.
8. Next, the following code should be added:

```ts
async function main() {
  console.log("Hello, TON!");
}

main().finally(() => console.log("Exiting..."));
```

9. Run the code using the terminal:

```bash
npm run start:dev
```

10. Finally, the console output will appear.

![](/img/docs/how-to-wallet/wallet_1.png)

:::tip Blueprint
The TON Community created an excellent tool for automating all development processes (deployment, contract writing, testing) called [Blueprint](https://github.com/ton-org/blueprint). However, we will not need such a powerful tool, so the instructions above should be followed.
:::

**OPTIONAL:** When using Golang, follow these instructions:

1. Install the GoLand IDE.
2. Create a project folder and a `go.mod` file with the following content. If the current version of Go is outdated, update it to the required version to proceed with this process:

```
module main

go 1.20
```

3. Type the following command into the terminal:

```bash
go get github.com/xssnick/tonutils-go
```

4. Create the `main.go` file in the root of your project with the following content:

```go
package main

import (
  "log"
)

func main() {
  log.Println("Hello, TON!")
}
```

5. Change the module's name in the `go.mod` to `main`.
6. Run the code above until the output in the terminal is displayed.

:::info
It is also possible to use another IDE since GoLand isn’t free, but it is preferred.
:::

:::warning IMPORTANT
Add all coding components to the `main` function created in the [⚙ Set your environment](/v3/guidelines/smart-contracts/howto/wallet#-set-your-environment) section.

Only the imports required for that specific code section are specified in each new section. Combine new imports with the existing ones as needed.
:::

## 🚀 Let's get started!

In this tutorial, we’ll learn which wallets (versions 3 and 4) are most often used on TON Blockchain and get acquainted with how their smart contracts work. This will allow developers to better understand the different message types on the TON platform to make it simpler to create messages, send them to the blockchain, deploy wallets, and eventually, be able to work with high-load wallets.

Our main task is to build messages using various objects and functions for @ton/ton, @ton/core, and @ton/crypto (ExternalMessage, InternalMessage, Signing, etc.) to understand what messages look like on a bigger scale. To carry out this process, we'll use two main wallet versions (v3 and v4) because exchanges, non-custodial wallets, and most users only use these specific versions.

:::note
This tutorial may not explain particular details on occasion. In these cases, more details will be provided later.

**IMPORTANT:** Throughout this tutorial, the [wallet v3 code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) is used to understand the wallet development process better. Version v3 has two sub-versions: r1 and r2. Currently, only the second version is being used, which means that when we refer to v3 in this document, it implies v3r2.
:::

## 💎 TON Blockchain wallets

All wallets operating on the TON Blockchain are smart contracts, and everything running on TON functions as a smart contract. Like most blockchains, TON allows users to deploy and customize smart contracts for various purposes, enabling full wallet customization.
Wallet smart contracts on TON facilitate communication between the platform and other types of smart contracts. However, it’s essential to understand how wallet communication works.

### Wallet сommunication

Generally, TON Blockchain has two message types: `internal` and `external`. External messages allow sending messages to the blockchain from the outside world, thus allowing communication with smart contracts that accept such messages. The function responsible for carrying out this process is as follows:

```func
() recv_external(slice in_msg) impure {
 ;; some code
}
```

Before exploring wallets in more detail, let’s examine how wallets accept external messages. On TON, every wallet stores the owner’s `public key`, `seqno`, and `subwallet_id`. When a wallet receives an external message, it uses the `get_data()` method to retrieve data from its storage. The wallet then performs several verification checks to determine whether to accept the message. This process works as follows:

```func
() recv_external(slice in_msg) impure {
 var signature = in_msg~load_bits(512); ;; get signature from the message body
 var cs = in_msg;
 var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));  ;; get rest values from the message body
 throw_if(35, valid_until <= now()); ;; check the relevance of the message
 var ds = get_data().begin_parse(); ;; get data from storage and convert it into a slice to be able to read values
 var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256)); ;; read values from storage
 ds.end_parse(); ;; make sure we do not have anything in ds variable
 throw_unless(33, msg_seqno == stored_seqno);
 throw_unless(34, subwallet_id == stored_subwallet);
 throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
 accept_message();
```

> 💡 Useful links:
>
> ["load_bits()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> ["get_data()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#get_data)
>
> ["begin_parse()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#begin_parse)
>
> ["end_parse()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#end_parse)
>
> ["load_int()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> ["load_uint()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> ["check_signature()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#check_signature)
>
> ["slice_hash()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
>
> ["accept_message()" in docs](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects)

Now, let’s take a closer look.

### Replay protection - seqno

Message replay protection in the wallet smart contract relies on the `seqno` (Sequence Number), which tracks the order of sent messages. Preventing message repetition is critical, as duplicate messages can compromise the system’s integrity. When analyzing wallet smart contract code, the `seqno` is typically managed as follows:

```func
throw_unless(33, msg_seqno == stored_seqno);
```

The code above compares the `seqno` from the incoming message with the `seqno` stored in the smart contract. If the values do not match, the contract returns an error with the `33 exit code`. This ensures that if the sender provides an invalid `seqno`, indicating a mistake in the message sequence, the contract prevents further processing and safeguards against such errors.

:::note
It's also essential to consider that anyone can send external messages. If you send 1 TON to someone, someone else can repeat this message. However, when the seqno increases, the previous external message becomes invalid, and no one will be able to repeat it, thus preventing the possibility of stealing your funds.
:::

### Signature

As mentioned earlier, wallet smart contracts accept external messages. However, since these messages originate from the outside world, their data cannot be fully trusted. Therefore, each wallet stores the owner's public key. When the wallet receives an external message signed with the owner’s private key, the smart contract uses the public key to verify the message’s signature. This ensures the message genuinely comes from the contract owner.

The wallet first extracts the signature from the incoming message to perform this verification. It then loads the public key from storage and validates the signature using the following process:

```func
var signature = in_msg~load_bits(512);
var ds = get_data().begin_parse();
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
```

If all verification steps succeed, the smart contract accepts and processes the message:

```func
accept_message();
```

:::info accept_message()
Since external messages do not include the Toncoin required to pay transaction fees, the `accept_message()` function applies a `gas_credit` (currently valued at 10,000 gas units). This allows the contract to perform necessary calculations for free, provided the gas usage does not exceed the `gas_credit` limit. After invoking `accept_message()`, the smart contract deducts all gas costs (in TON) from its balance. You can read more about this process [here](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects).
:::

### Transaction expiration

Another step used to check the validity of external messages is the `valid_until` field. As you can see from the variable name, this is the time in UNIX before the message is valid. If this verification process fails, the contract completes the processing of the transaction and returns the 35 exit code as follows:

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
throw_if(35, valid_until <= now());
```

This algorithm safeguards against potential errors, such as when a message is no longer valid but is still sent to the blockchain for an unknown reason.

### Wallet v3 and wallet v4 differences

The key difference between wallet v3 and wallet v4 lies in wallet v4’s support for `plugins`. Users can install or delete these plugins, which are specialized smart contracts capable of requesting a specific amount of TON from the wallet smart contract at a designated time.

Wallet smart contracts automatically send the required amount of TON in response to plugin requests without requiring the owner’s involvement. This functionality mirrors a **subscription model**, which is the primary purpose of plugins. We won’t delve into these details further as they fall outside the scope of this tutorial.

### How wallets facilitate communication with smart contracts

As mentioned, a wallet smart contract accepts external messages, validates them, and processes them if all checks pass. Once the contract accepts a message, it begins a loop to extract messages from the body of the external message, creates internal messages, and sends them to the blockchain as shown below:

```func
cs~touch();
while (cs.slice_refs()) {
 var mode = cs~load_uint(8); ;; load message mode
 send_raw_message(cs~load_ref(), mode); ;; get each new internal message as a cell with the help of load_ref() and send it
}
```

:::tip touch()
On TON, all smart contracts run on the stack-based TON Virtual Machine (TVM). ~ touch() places the variable `cs` on top of the stack to optimize code running for less gas.
:::

Since a single cell can store **a maximum of 4 references**, we can send up to 4 internal messages per external message.

> 💡 Useful links:
>
> ["slice_refs()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)
>
> ["send_raw_message() and message modes" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)
>
> ["load_ref()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_ref)

## 📬 External and internal messages

This section will explore `internal` and `external` messages in more detail. We’ll create and send these messages to the network, minimizing reliance on pre-built functions.

To simplify this process, we’ll use a pre-built wallet. Here’s how to proceed:

1. Install the [wallet app](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps) (e.g., Tonkeeper is used by the author)
2. Switch the wallet app to v3r2 address version
3. Deposit 1 TON into the wallet
4. Send the message to another address (you can send it to yourself, to the same wallet).

This way, the Tonkeeper wallet app will deploy the wallet contract, which we can use for the following steps.

:::note
At the time of writing, most wallet apps on TON default to wallet v4. However, since plugins are not required for this tutorial, we’ll use the functionality provided by wallet v3. Tonkeeper allows users to select their preferred wallet version, so it’s recommended to deploy wallet v3.
:::

### TL-B

As mentioned earlier, everything in the TON Blockchain is a smart contract composed of cells. Standards are essential to ensure proper serialization and deserialization of data. For this purpose, `TL-B` was developed as a universal tool to describe various data types, structures, and sequences within cells.

This section will explore [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb). This file will be invaluable for future development as it outlines how to assemble different types of cells. Specifically for our purposes, it provides detailed information about the structure and behavior of internal and external messages.

:::info
This guide provides basic information. For further details, please refer to our TL-B [documentation](/v3/documentation/data-formats/tlb/tl-b-language) to learn more about TL-B.
:::

### CommonMsgInfo

Initially, each message must first store `CommonMsgInfo` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L123-L130)) or `CommonMsgInfoRelaxed` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L132-L137)). This allows us to define technical details that relate to the message type, message time, recipient address, technical flags, and fees.

By reading the `block.tlb` file, we can notice three types of CommonMsgInfo: `int_msg_info$0`, `ext_in_msg_info$10`, `ext_out_msg_info$11`. We will not go into specific details detailing the specificities of the `ext_out_msg_info` TL-B structure. That said, it is an external message type that a smart contract can send to use as an external log. For examples of this format, consider having a closer look at the [Elector](https://tonscan.org/address/Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF) contract.

When examining [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L127-L128), you’ll notice that **only `CommonMsgInfo` is available when using the `ext_in_msg_info` type**. It is because fields like `src`, `created_lt`, `created_at`, and others are overwritten by validators during transaction processing. Among these, the `src` field is particularly important. Since the sender’s address is unknown when the message is sent, validators populate this field during verification. This ensures the `src` address is accurate and cannot be tampered with.

However, the `CommonMsgInfo` structure only supports the `MsgAddress` specification. Since the sender’s address is typically unknown, it’s necessary to use `addr_none` (represented by two zero bits `00`). The `CommonMsgInfoRelaxed` structure is used in such cases, as it supports the `addr_none` address. For `ext_in_msg_info` (used for incoming external messages), the `CommonMsgInfo` structure is sufficient because these messages don’t require a sender and always use the [MsgAddressExt](https://hub.com/ton/ton.blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100) structure (represented by `addr_none$00`, meaning two zero bits). This eliminates the need to overwrite the data.

:::note
The numbers after the `$` symbol are the bits that must be stored at the beginning of a specific structure for further identification of these structures during reading (deserialization).
:::

### Internal message creation

Internal messages facilitate communication between contracts. When examining various contract types, such as [NFTs](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/nft/nft-item.fc#L51-L56) and [Jettons](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-wallet.fc#L139-L144), you’ll often encounter the following lines of code, which are commonly used when writing contracts that send messages:

```func
var msg = begin_cell()
 .store_uint(0x18, 6) ;; or 0x10 for non-bounce
 .store_slice(to_address)
 .store_coins(amount)
 .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
 ;; store something as a body
```

Let’s examine `0x18` and `0x10` (where `x` denotes hexadecimal). These numbers can be represented in binary as `011000` and `010000`, assuming we allocate 6 bits. This means the code above can be rewritten as follows:

```func
var msg = begin_cell()
 .store_uint(0, 1) ;; this bit indicates that we send an internal message according to int_msg_info$0
 .store_uint(1, 1) ;; IHR Disabled
 .store_uint(1, 1) ;; or .store_uint(0, 1) for 0x10 | bounce
 .store_uint(0, 1) ;; bounced
 .store_uint(0, 2) ;; src -> two zero bits for addr_none
 .store_slice(to_address)
 .store_coins(amount)
 .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
 ;; store something as a body
```

Now, let’s go through each option in detail:

|    Option    |                                                                                                                                                                                                                           Explanation                                                                                                                                                                                                                           |
| :----------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| IHR Disabled |                Currently, this option is disabled (meaning we store `1`) because Instant Hypercube Routing (IHR) is not yet fully implemented. This option will become relevant once many [Shardchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#many-accountchains-shards) are active on the network. For more details about the IHR Disabled option, refer to [tblkch.pdf](https://ton.org/tblkch.pdf) (chapter 2).                |
|    Bounce    | When sending messages, errors can occur during smart contract processing. Setting the `Bounce` option to `1` (true) is essential to prevent TON loss. If any errors arise during transaction processing, the message will be returned to the sender, and the same amount of TON (minus fees) will be refunded. Refer to [this guide](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) for more details on non-bounceable messages. |
|   Bounced    |                                                                                                                                  Bounced messages are those returned to the sender due to an error during transaction processing with a smart contract. This option indicates whether the received message is bounced or not.                                                                                                                                   |
|     Src      |                                                                                                                                                                                 The Src is the sender's address. In this case, two zero bits indicate the `addr_none` address.                                                                                                                                                                                  |

The following two lines of code:

```func
...
.store_slice(to_address)
.store_coins(amount)
...
```

- we specify the recipient and the number of TON to be sent.

Finally, let’s look at the remaining lines of code:

```func
...
 .store_uint(0, 1) ;; Extra currency
 .store_uint(0, 4) ;; IHR fee
 .store_uint(0, 4) ;; Forwarding fee
 .store_uint(0, 64) ;; Logical time of creation
 .store_uint(0, 32) ;; UNIX time of creation
 .store_uint(0, 1) ;; State Init
 .store_uint(0, 1) ;; Message body
 ;; store something as a body
```

|          Option          |                                                                                                                                                       Explanation                                                                                                                                                        |
| :----------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Extra currency      |                                                                                                                     This is a native implementation of existing jettons and is not currently in use.                                                                                                                     |
|         IHR fee          |                                                                              As mentioned, IHR is not currently used, so this fee is always zero. For more information, refer to [tblkch.pdf](https://ton.org/tblkch.pdf) (section 3.1.8).                                                                               |
|      Forwarding fee      |                                                                        A forwarding message fee. For more information, refer to [fees documentation](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#transactions-and-phases).                                                                         |
| Logical time of creation |                                                                                                                                   The time used to create the correct messages queue.                                                                                                                                    |
|  UNIX time of creation   |                                                                                                                                        The time the message was created in UNIX.                                                                                                                                         |
|        State Init        |                        The code and source data for deploying a smart contract. If the bit is set to `0`, there is no State Init. However, if it’s set to `1`, an additional bit is required to indicate whether the State Init is stored in the same cell (`0`) or written as a reference (`1`).                        |
|       Message body       | This section determines how the message body is stored. If the message body is too large to fit directly into the message, it is stored as a **reference**. In this case, the bit is set to `1` to indicate that the body is stored as a reference. If the bit is `0`, the body resides in the same cell as the message. |

Validators rewrite the above values (including src), excluding the State Init and the Message Body bits.

:::note
If the number value fits within fewer bits than is specified, then the missing zeros are added to the left side of the value. For example, 0x18 fits within 5 bits -> `11000`. However, since 6 bits were specified, the result becomes `011000`.
:::

Next, we’ll prepare a message to send Toncoins to another wallet v3. For example, let’s say a user wants to send 0.5 TON to themselves with the comment "**Hello, TON!**". To learn how to send a message with a comment, refer to this documentation section: [How to send a simple message](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-simple-message).

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from "@ton/core";

let internalMessageBody = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32). // write 32 zero bits to indicate that a text comment will follow
  MustStoreStringSnake("Hello, TON!"). // write our text comment
  EndCell()
```

</TabItem>
</Tabs>

Above, we created an `InternalMessageBody` to store the body of our message. Note that if the text exceeds the capacity of a single Cell (1023 bits), it’s necessary to **split the data into multiple cells**, as outlined in [this documentation](/v3/documentation/smart-contracts/message-management/internal-messages). However, high-level libraries handle cell creation according to the requirements in this case, so there’s no need to worry about it at this stage.

Next, the `InternalMessage` is created according to the information we have studied earlier as follows:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { toNano, Address } from "@ton/ton";

const walletAddress = Address.parse("put your wallet address");

let internalMessage = beginCell()
  .storeUint(0, 1) // indicate that it is an internal message -> int_msg_info$0
  .storeBit(1) // IHR Disabled
  .storeBit(1) // bounce
  .storeBit(0) // bounced
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress)
  .storeCoins(toNano("0.2")) // amount
  .storeBit(0) // Extra currency
  .storeCoins(0) // IHR Fee
  .storeCoins(0) // Forwarding Fee
  .storeUint(0, 64) // Logical time of creation
  .storeUint(0, 32) // UNIX time of creation
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(internalMessageBody) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

walletAddress := address.MustParseAddr("put your address")

internalMessage := cell.BeginCell().
  MustStoreUInt(0, 1). // indicate that it is an internal message -> int_msg_info$0
  MustStoreBoolBit(true). // IHR Disabled
  MustStoreBoolBit(true). // bounce
  MustStoreBoolBit(false). // bounced
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress).
  MustStoreCoins(tlb.MustFromTON("0.2").NanoTON().Uint64()).   // amount
  MustStoreBoolBit(false). // Extra currency
  MustStoreCoins(0). // IHR Fee
  MustStoreCoins(0). // Forwarding Fee
  MustStoreUInt(0, 64). // Logical time of creation
  MustStoreUInt(0, 32). // UNIX time of creation
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

### Creating a message

We must create a `client` to retrieve our wallet smart contract's `seqno` (sequence number). This client will send a request to execute the Get method `seqno` on our wallet. Additionally, we must include the seed phrase (saved during wallet creation [here](#-external-and-internal-messages)) to sign our message. Follow these steps to proceed:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC", // you can replace it on https://testnet.toncenter.com/api/v2/jsonRPC for testnet
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = "put your mnemonic"; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(" "); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "strings"
)

mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection) // create client

block, err := client.CurrentMasterchainInfo(context.Background()) // get the current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

// The next three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. With the tonutils-go library, this is all implemented, but we’re doing it again to get a full understanding.
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys

privateKey := ed25519.NewKeyFromSeed(k)
```

</TabItem>
</Tabs>

To proceed, we must send the `seqno`, `keys`, and `internal message`. Next, we’ll create a [message](/v3/documentation/smart-contracts/message-management/sending-messages) for our wallet and store the data in the sequence outlined at the beginning of the tutorial. This is achieved as follows:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from "@ton/crypto";

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id | We consider this further
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32) // store seqno
  .storeUint(3, 8) // store mode of our internal message
  .storeRef(internalMessage); // store our internalMessage as a reference

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to the wallet smart contract and sign it to get signature

let body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "time"
)

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // Message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32). // store seqno
  MustStoreUInt(uint64(3), 8). // store mode of our internal message
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to the wallet smart contract and sign it to get the signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()
```

</TabItem>
</Tabs>

Note that no `.endCell()` was used in defining the `toSign` here. In this case, it is necessary **to transfer toSign content directly to the message body**. If writing a cell was required, it would have to be stored as a reference.

:::tip Wallet V4
In addition to the basic verification process we learned above for the Wallet V3, Wallet V4 smart contracts [extract the opcode to determine whether a simple translation or a message associated with the plugin](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L94-L100) is required. To match this version, it is necessary to add the `storeUint(0, 8).` (JS/TS), `MustStoreUInt(0, 8).` (Golang) functions after writing the **sequence number (seqno)** and before specifying the transaction mode.
:::

### External message creation

To deliver an internal message to the blockchain from the outside world, it must be sent within an external message. As previously discussed, we’ll use the `ext_in_msg_info$10` structure since our goal is to send an external message to our contract. Now, let’s create the external message that will be sent to our wallet:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
let externalMessage = beginCell()
  .storeUint(0b10, 2) // 0b10 -> 10 in binary
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress) // Destination address
  .storeCoins(0) // Import Fee
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // 0b10 -> 10 in binary
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

|    Option    |                                                                                                                      Explanation                                                                                                                      |
| :----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     Src      | The sender address. Since an incoming external message cannot have a sender, there will always be 2 zero bits (an addr_none [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100)). |
|  Import Fee  |                                                                                                   The fee for importing incoming external messages.                                                                                                   |
|  State Init  |                Unlike the Internal Message, the State Init within the external message is needed **to deploy a contract from the outside world**. The State Init used with the Internal Message allows one contract to deploy another.                |
| Message Body |                                                                                               The message must be sent to the contract for processing.                                                                                                |

:::tip 0b10
0b10 (b - binary) denotes a binary record. Two bits are stored in this process: `1` and `0`. Thus, we specify that it's `ext_in_msg_info$10`.
:::

Now that we have a completed message ready to send to our contract, the next step is to serialize it into a `BoC` ([bag of cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)). Once serialized, we can send it using the following code:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
console.log(externalMessage.toBoc().toString("base64"));

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tl"
)

log.Println(base64.StdEncoding.EncodeToString(externalMessage.ToBOCWithFlags(false)))

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

> 💡 Useful link:
>
> More about [Bag of cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)

As a result, we got the output of our BOC in the console, and the message was sent to our wallet. By copying the base64 encoded string, it is possible to [manually send our message and retrieve the hash using toncenter](https://toncenter.com/api/v2/#/send/send_boc_return_hash_sendBocReturnHash_post).

## 👛 Deploying a wallet

We’ve covered the basics of creating messages to help us deploy a wallet. Previously, we deployed wallets using wallet apps, but we’ll deploy our wallet manually this time.

In this section, we’ll walk through creating a wallet (wallet v3) from scratch. You’ll learn how to compile the wallet smart contract code, generate a mnemonic phrase, obtain a wallet address, and deploy the wallet using external messages and State Init (state initialization).

### Generating a mnemonic

The first step in creating a wallet is generating a `private` and `public` key. We’ll generate a mnemonic seed phrase and extract the keys using cryptographic libraries.

Here’s how to accomplish this:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { mnemonicToWalletKey, mnemonicNew } from "@ton/crypto";

// const mnemonicArray = 'put your mnemonic'.split(' ') // get our mnemonic as array
const mnemonicArray = await mnemonicNew(24); // 24 is the number of words in a seed phrase
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic
console.log(mnemonicArray); // if we want, we can print our mnemonic
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"crypto/ed25519"
	"crypto/hmac"
	"crypto/sha512"
	"log"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"golang.org/x/crypto/pbkdf2"
	"strings"
)

// mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array
mnemonic := wallet.NewSeed() // get new mnemonic

// The following three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. It has all been implemented in the tonutils-go library, but it immediately returns the finished wallet object with the address and ready methods. So we’ll have to write the lines to get the key separately. Goland IDE will automatically import all required libraries (crypto, pbkdf2, and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys
// 32 is a key len

privateKey := ed25519.NewKeyFromSeed(k) // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key
log.Println(publicKey) // print publicKey so that at this stage, the compiler does not complain that we do not use our variable
log.Println(mnemonic) // if we want, we can print our mnemonic
```

</TabItem>
</Tabs>

The private key is needed to sign messages, and the public key is stored in the wallet’s smart contract.

:::danger IMPORTANT
Make sure to output the generated mnemonic seed phrase to the console, save it, and use it (as detailed in the previous section) to ensure the same key pair is used each time the wallet’s code is run.
:::

### Subwallet IDs

One of the most notable benefits of wallets being smart contracts is the ability to create **a vast number of wallets** using just one private key. This is because the addresses of smart contracts on TON Blockchain are computed using several factors, including the `stateInit`. The stateInit contains the `code` and `initial data`, which is stored in the blockchain’s smart contract storage.

Changing just one bit within the stateInit can generate a different address. That is why the `subwallet_id` was initially created. The `subwallet_id` is stored in the contract storage and can be used to create many different wallets (with different subwallet IDs) with one private key. This functionality can be handy when integrating various wallet types with centralized services such as exchanges.

The default `subwallet_id` value is `698983191`, as per the [line of code](https://github.com/ton-blockchain/ton/blob/4b940f8bad9c2d3bf44f196f6995963c7cee9cc3/tonlib/tonlib/TonlibClient.cpp#L2420) below taken from the TON Blockchain’s source code:

```cpp
res.wallet_id = td::as<td::uint32>(res.config.zero_state_id.root_hash.as_slice().data());
```

It is possible to retrieve genesis block information (zero_state) from the [configuration file](https://ton.org/global-config.json). Understanding the complexities and details of this is not necessary, but it's important to remember that the default value of the `subwallet_id` is `698983191`.

Each wallet contract checks the `subwallet_id` field for external messages to avoid instances where requests are sent to a wallet with another ID:

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(34, subwallet_id == stored_subwallet);
```

We will need to add the above value to the initial data of the contract, so the variable needs to be saved as follows:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subWallet = 698983191;
```

</TabItem>
<TabItem value="go" label="Golang">

```go
var subWallet uint64 = 698983191
```

</TabItem>
</Tabs>

### Compiling wallet code

Now that the private and public keys and the `subwallet_id` are clearly defined, we must compile the wallet code. We’ll use the [wallet v3 code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) from the official repository.

The [@ton-community/func-js](https://github.com/ton-community/func-js) library is necessary to compile wallet code. This library allows us to compile FunC code and retrieve a cell containing the code. To get started, install the library and save it to the `package.json` as follows:

```bash
npm i --save @ton-community/func-js
```

We’ll only use JavaScript to compile code, as the libraries for compiling code are JavaScript-based. However, after compiling is finalized, as long as we have our cell's **base64 output**, it is possible to use this compiled code in languages such as Go and others.

First, we must create two files: `wallet_v3.fc` and `stdlib.fc`. The compiler relies on the `stdlib.fc` library, which contains all the necessary basic functions corresponding to `asm` instructions. You can download the `stdlib.fc` file [here](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc). For the `wallet_v3.fc` file, copy the code from the repository.

Now, we have the following structure for the project we are creating:

```
.
├── src/
│   ├── main.ts
│   ├── wallet_v3.fc
│   └── stdlib.fc
├── nodemon.json
├── package-lock.json
├── package.json
└── tsconfig.json
```

:::info
It’s OK if your IDE plugin conflicts with the `() set_seed(int) impure asm "SETRAND";` in the `stdlib.fc` file.
:::

Remember to add the following line to the beginning of the `wallet_v3.fc` file to indicate that the functions from the stdlib will be used below:

```func
#include "stdlib.fc";
```

Now let’s write code to compile our smart contract and run it using `npm run start:dev`:

```js
import { compileFunc } from "@ton-community/func-js";
import fs from "fs"; // we use fs for reading content of files
import { Cell } from "@ton/core";

const result = await compileFunc({
  targets: ["wallet_v3.fc"], // targets of your project
  sources: {
    "stdlib.fc": fs.readFileSync("./src/stdlib.fc", { encoding: "utf-8" }),
    "wallet_v3.fc": fs.readFileSync("./src/wallet_v3.fc", {
      encoding: "utf-8",
    }),
  },
});

if (result.status === "error") {
  console.error(result.message);
  return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0]; // get buffer from base64 encoded BOC and get cell from this buffer

// now we have base64 encoded BOC with compiled code in the result.codeBoc
console.log("Code BOC: " + result.codeBoc);
console.log("\nHash: " + codeCell.hash().toString("base64")); // get the hash of cell and convert it to base64 encoded string. We will need it further
```

The result will be the following output in the terminal:

```text
Code BOC: te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==

Hash: idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

Once this process is complete, you can retrieve the same cell (using the base64 encoded output) containing our wallet code using other libraries and languages:

<Tabs groupId="code-examples">
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

base64BOC := "te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==" // save our base64 encoded output from compiler to variable
codeCellBytes, _ := base64.StdEncoding.DecodeString(base64BOC) // decode base64 in order to get byte array
codeCell, err := cell.FromBOC(codeCellBytes) // get cell with code from byte array
if err != nil { // check if there are any error
  panic(err)
}

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type, and output to the terminal
```

</TabItem>
</Tabs>

The result will be the following output in the terminal:

```text
idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

After the above processes are complete, the hashes match, confirming that the correct code is used within our cell.

### Creating the state init for deployment

Before building a message, it is essential to understand what a State Init is. First, let’s go through the [TL-B scheme](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L141-L143):

|   Option    |                                                                                                                                                                                                                Explanation                                                                                                                                                                                                                 |
| :---------: |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| split_depth |        This option is designed for highly loaded smart contracts that can be split and distributed across multiple [ShardChains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#many-accountchains-shards). For more details on how this works, refer to the [tblkch.pdf](https://ton.org/tblkch.pdf) (section 4.1.6). Since this feature is not needed for wallet smart contracts, only a `0` bit is stored.         |
|   special   | This option is used for **TicTok** smart contracts that are automatically triggered for each block. Regular smart contracts, such as wallets, do not require this functionality. For more details, refer to [this section](/v3/documentation/data-formats/tlb/transaction-layout#tick-tock) or the [tblkch.pdf](https://ton.org/tblkch.pdf) (section 4.1.6). Since this feature is unnecessary for our use case, only a `0` bit is stored. |
|             |
|    code     |                                                                                                                                                                                   `1` bit means the presence of the smart contract code as a reference.                                                                                                                                                                                    |
|    data     |                                                                                                                                                                                   `1` bit means the presence of the smart contract data as a reference.                                                                                                                                                                                    |
|   library   |                     This option refers to a library that operates on the [MasterChain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#masterchain-blockchain-of-blockchains) and can be shared across multiple smart contracts. Since wallets do not require this functionality, its bit is set to `0`. For more information, refer to [tblkch.pdf](https://ton.org/tblkch.pdf) (section 1.8.4).                      |

Next, we’ll prepare the `initial data`, which will be present in our contract’s storage immediately after deployment:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from "@ton/core";

const dataCell = beginCell()
  .storeUint(0, 32) // Seqno
  .storeUint(698983191, 32) // Subwallet ID
  .storeBuffer(keyPair.publicKey) // Public Key
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32). // Seqno
  MustStoreUInt(698983191, 32). // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()
```

</TabItem>
</Tabs>

The contract `code` and its `initial data` are present at this stage. With this data, we can produce our **wallet address**. The wallet's address depends on the State Init, which includes the code and initial data.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from "@ton/core";

const stateInit = beginCell()
  .storeBit(0) // No split_depth
  .storeBit(0) // No special
  .storeBit(1) // We have code
  .storeRef(codeCell)
  .storeBit(1) // We have data
  .storeRef(dataCell)
  .storeBit(0) // No library
  .endCell();

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
)

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true). // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String()) // Output contract address to console
```

</TabItem>
</Tabs>

We can build and send the message to the blockchain using the State Init.

:::warning
Keep in mind this concept for your services
:::

To carry out this process, **a minimum wallet balance of 0.1 TON** is required (the balance can be less, but this amount is guaranteed sufficient). To accomplish this, we’ll need to run the code mentioned earlier in the tutorial, obtain the correct wallet address, and send 0.1 TON to this address. Alternatively, you can send this sum manually via your wallet app before sending the deployment message.

Deployment by external messages is presented here primarily for educational purposes; in practice, it's much more convenient to [deploy smart contracts via wallets](/v3/guidelines/smart-contracts/howto/wallet#contract-deployment-via-wallet), which will be described later.

Let’s start with building a message similar to the one we built **in the previous section**:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from "@ton/crypto";
import { toNano } from "@ton/core";

const internalMessageBody = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const internalMessage = beginCell()
  .storeUint(0x10, 6) // no bounce
  .storeAddress(
    Address.parse("put your first wallet address from were you sent 0.1 TON")
  )
  .storeCoins(toNano("0.03"))
  .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) // We store 1, which means we have a body as a reference
  .storeRef(internalMessageBody)
  .endCell();

// message for our wallet
const toSign = beginCell()
  .storeUint(subWallet, 32)
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32)
  .storeUint(0, 32) // We put seqno = 0 because after deploying wallet will store 0 as seqno
  .storeUint(3, 8)
  .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), keyPair.secretKey);
const body = beginCell().storeBuffer(signature).storeBuilder(toSign).endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tlb"
  "time"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(address.MustParseAddr("put your first wallet address from where you sent 0.1 TON")).
  MustStoreBigCoins(tlb.MustFromTON("0.03").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1, which means we have a body as a reference
  MustStoreRef(internalMessageBody).
  EndCell()

// message for our wallet
toSign := cell.BeginCell().
  MustStoreUInt(subWallet, 32).
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32).
  MustStoreUInt(0, 32). // We put seqno = 0 because after deploying, the wallet will store 0 as seqno
  MustStoreUInt(3, 8).
  MustStoreRef(internalMessage)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash())
body := cell.BeginCell().
  MustStoreSlice(signature, 512).
  MustStoreBuilder(toSign).
  EndCell()
```

</TabItem>
</Tabs>

Once this process is complete, the result is a properly constructed State Init and Message Body.

### Sending an external message

The **main difference** lies in including the external message, as the State Init is stored to ensure proper contract deployment. Since the contract doesn’t yet have its code, it cannot process internal messages. Therefore, we send its code and initial data, enabling it to process our message with the "Hello, TON!" comment **after successful deployment**.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const externalMessage = beginCell()
  .storeUint(0b10, 2) // indicates that it is an incoming external message
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(contractAddress)
  .storeCoins(0) // Import fee
  .storeBit(1) // We have State Init
  .storeBit(1) // We store State Init as a reference
  .storeRef(stateInit) // Store State Init as a reference
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // indicates that it is an incoming external message
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(contractAddress).
  MustStoreCoins(0). // Import fee
  MustStoreBoolBit(true). // We have State Init
  MustStoreBoolBit(true).  // We store State Init as a reference
  MustStoreRef(stateInit). // Store State Init as a reference
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

Finally, we can send our message to the blockchain to deploy our wallet and use it.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)
if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

Note that we sent an internal message using mode `3`. If you must redeploy the same wallet, **the smart contract can be destroyed**. To do this, set the [mode](/v3/documentation/smart-contracts/message-management/message-modes-cookbook#mode160) to `160` by adding `128` (take the entire balance of the smart contract) + `32` (destroy the smart contract). This will retrieve the remaining TON balance and allow you to deploy the wallet again.

Remember that for each new transaction, the `seqno` must be incremented by one.

:::info
The contract code we used is [verified](https://tonscan.org/tx/BL9T1i5DjX1JRLUn4z9JOgOWRKWQ80pSNevis26hGvc=), so you can see an example [here](https://tonscan.org/address/EQDBjzo_iQCZh3bZSxFnK9ue4hLTOKgsCNKfC8LOUM4SlSCX#source).
:::

## 💸 Working with wallet smart contracts

After completing the first half of this tutorial, we’ve gained a deeper understanding of wallet smart contracts, including how they are developed and used. We’ve also learned how to deploy and destroy them and how to send messages without relying on pre-configured library functions. The next section will focus on building and sending more complex messages to apply what we've learned further.

### Sending multiple messages simultaneously

As you already know, [a single cell can store up to 1023 bits of data and up to 4 references](/v3/documentation/data-formats/tlb/cell-boc#cell) to other cells. In the first section of this tutorial, we explained how internal messages are delivered in a ‘whole’ loop as a link and sent. This means it’s possible to **store up to 4 internal messages within an external message**, allowing four messages to be sent simultaneously.

To accomplish this, we need to create four different internal messages. We can do this manually or through a `loop`. We need to define three arrays: an array of TON amount, an array of comments, and an array of messages. For messages, we need to prepare another array - internalMessages.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from "@ton/core";

const internalMessagesAmount = ["0.01", "0.02", "0.03", "0.04"];
const internalMessagesComment = [
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third message without comment
  "Hello, TON! #4",
];
const destinationAddresses = [
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
]; // All 4 addresses can be the same

let internalMessages: Cell[] = []; // array for our internal messages
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessagesAmount := [4]string{"0.01", "0.02", "0.03", "0.04"}
internalMessagesComment := [4]string{
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third message without comment
  "Hello, TON! #4",
}
destinationAddresses := [4]string{
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
} // All 4 addresses can be the same

var internalMessages [len(internalMessagesAmount)]*cell.Cell // array for our internal messages
```

</TabItem>
</Tabs>

[Sending mode](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes) for all messages is set to `mode 3`. However, an array can be created to fulfill different purposes if different modes are required.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from "@ton/core";

for (let index = 0; index < internalMessagesAmount.length; index++) {
  const amount = internalMessagesAmount[index];

  let internalMessage = beginCell()
    .storeUint(0x18, 6) // bounce
    .storeAddress(Address.parse(destinationAddresses[index]))
    .storeCoins(toNano(amount))
    .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1);

  /*
It’s unclear whether we’ll have a message body at this stage. Therefore, we’ll only set a bit for the `stateInit`. If we include a comment, it means we have a message body. In that case, set the bit to `1` and store the body as a reference.
 */

  if (internalMessagesComment[index] != "") {
    internalMessage.storeBit(1); // we store Message Body as a reference

    let internalMessageBody = beginCell()
      .storeUint(0, 32)
      .storeStringTail(internalMessagesComment[index])
      .endCell();

    internalMessage.storeRef(internalMessageBody);
  } else internalMessage.storeBit(0);
  /*
 Since we do not have a message body, we indicate that 
 the message body is in this message but do not write it, 
 which means it is absent. In that case, just set the bit to 0.
 */

  internalMessages.push(internalMessage.endCell());
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

for i := 0; i < len(internalMessagesAmount); i++ {
  amount := internalMessagesAmount[i]

  internalMessage := cell.BeginCell().
    MustStoreUInt(0x18, 6). // bounce
    MustStoreAddr(address.MustParseAddr(destinationAddresses[i])).
    MustStoreBigCoins(tlb.MustFromTON(amount).NanoTON()).
    MustStoreUInt(0, 1+4+4+64+32+1)

  /*
It’s unclear whether we’ll have a message body at this stage. Therefore, we’ll only set a bit for the `stateInit`. If we include a comment, it means we have a message body. In that case, set the bit to `1` and store the body as a reference.
 */

  if internalMessagesComment[i] != "" {
    internalMessage.MustStoreBoolBit(true) // we store Message Body as a reference

    internalMessageBody := cell.BeginCell().
      MustStoreUInt(0, 32).
      MustStoreStringSnake(internalMessagesComment[i]).
      EndCell()

    internalMessage.MustStoreRef(internalMessageBody)
 } else {
    /*
 Since we do not have a message body, we indicate that
 the message body is in this message but do not write it,
 which means it is absent. In that case, just set the bit to 0.
 */
    internalMessage.MustStoreBoolBit(false)
 }
  internalMessages[i] = internalMessage.EndCell()
}
```

</TabItem>
</Tabs>

Now let's use our knowledge from [chapter two](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet) to build a message for our wallet that can send four messages simultaneously:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";

const walletAddress = Address.parse("put your wallet address");
const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = "put your mnemonic"; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(" "); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32); // store seqno
// Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8)
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "strings"
  "time"
)

walletAddress := address.MustParseAddr("put your wallet address")

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

mnemonic := strings.Split("put your mnemonic", " ") // word1 word2 word3
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key

block, err := client.CurrentMasterchainInfo(context.Background()) // get the current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32) // store seqno
  // Do not forget that if we use Wallet V4, we need to add MustStoreUInt(0, 8).
```

</TabItem>
</Tabs>

Next, we’ll add the messages that we built earlier in the loop:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
for (let index = 0; index < internalMessages.length; index++) {
  const internalMessage = internalMessages[index];
  toSign.storeUint(3, 8); // store mode of our internal message
  toSign.storeRef(internalMessage); // store our internalMessage as a reference
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
for i := 0; i < len(internalMessages); i++ {
    internalMessage := internalMessages[i]
    toSign.MustStoreUInt(3, 8) // store mode of our internal message
    toSign.MustStoreRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
</Tabs>

Now that the above processes are complete, let’s **sign** our message, **build an external message** (as outlined in previous sections of this tutorial), and **send it** to the blockchain:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from "@ton/crypto";

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to the wallet smart contract and sign it to get signature

let body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();

let externalMessage = beginCell()
  .storeUint(0b10, 2) // ext_in_msg_info$10
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress) // Destination address
  .storeCoins(0) // Import Fee
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tl"
)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to the wallet smart contract and sign it to get the signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // ext_in_msg_info$10
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

:::info Connection error
If an error related to the lite-server connection (in Golang) occurs, you may need to run the code repeatedly until the message is successfully sent. This happens because the `tonutils-go` library uses multiple lite-servers from the global configuration specified in the code. However, not all lite-servers may accept the connection.
:::

After completing this process, you can use a TON blockchain explorer to verify that the wallet sent four messages to the specified addresses.

### NFT transfers

In addition to regular messages, users often send NFTs to each other. Unfortunately, not all libraries specifically use methods for interacting with this type of smart contract. As a result, we need to write code that allows us to construct messages for sending NFTs. First, let’s familiarize ourselves with the TON NFT [standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md).

Specifically, we need to thoroughly understand the TL-B schema for [NFT Transfers](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer).

- `query_id`: Query ID has no value in message processing. The NFT contract doesn't validate it; it only reads it. This value can be helpful when a service wants to assign a specific query ID to each message for identification purposes. Therefore, we will set it to 0.

- `response_destination`: After processing the ownership change message, there will be extra TONs. If specified, they will be sent to this address; otherwise, they will remain on the NFT balance.

- `custom_payload`: The custom_payload is used for specific tasks and is not typically required for ordinary NFTs.

- `forward_amount`: If the forward_amount isn’t zero, the specified TON amount will be sent to the new owner, who will then be notified that they received something.

- `forward_payload`: The forward_payload is additional data that can be sent to the new owner along with the `forward_amount`. For example, the forward_payload allows users to [add a comment during the transfer of an NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#forward_payload-format), as demonstrated earlier in the tutorial. However, despite being part of TON’s NFT standard, blockchain explorers do not fully support displaying these details. A similar issue exists when displaying Jettons.

Now, let's build the message itself:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from "@ton/core";

const destinationAddress = Address.parse(
  "put your wallet where you want to send NFT"
);
const walletAddress = Address.parse(
  "put your wallet, which is the owner of NFT."
);
const nftAddress = Address.parse("put your nft address");

// We can add a comment, but it will not be displayed in the explorers,
// as they do not support it at the time of writing the tutorial.
const forwardPayload = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const transferNftBody = beginCell()
  .storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
  .storeUint(0, 64) // query_id
  .storeAddress(destinationAddress) // new_owner
  .storeAddress(walletAddress) // response_destination for excesses
  .storeBit(0) // we do not have custom_payload
  .storeCoins(toNano("0.01")) // forward_amount
  .storeBit(1) // we store forward_payload as a reference
  .storeRef(forwardPayload) // store forward_payload as a .reference
  .endCell();

const internalMessage = beginCell()
  .storeUint(0x18, 6) // bounce
  .storeAddress(nftAddress)
  .storeCoins(toNano("0.05"))
  .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) // We store 1, which means we have the body as a reference
  .storeRef(transferNftBody)
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

destinationAddress := address.MustParseAddr("put your wallet where you want to send NFT")
walletAddress := address.MustParseAddr("put your wallet which is the owner of NFT")
nftAddress := address.MustParseAddr("put your nft address")

// We can add a comment, but it will not be displayed in the explorers,
// as they do not support it at the time of writing the tutorial.
forwardPayload := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

transferNftBody := cell.BeginCell().
  MustStoreUInt(0x5fcc3d14, 32). // Opcode for NFT transfer
  MustStoreUInt(0, 64). // query_id
  MustStoreAddr(destinationAddress). // new_owner
  MustStoreAddr(walletAddress). // response_destination for excesses
  MustStoreBoolBit(false). // we do not have custom_payload
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()). // forward_amount
  MustStoreBoolBit(true). // we store forward_payload as a reference
  MustStoreRef(forwardPayload). // store forward_payload as a reference
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x18, 6). // bounce
  MustStoreAddr(nftAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.05").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1, which means we have the body as a reference
  MustStoreRef(transferNftBody).
  EndCell()
```

</TabItem>
</Tabs>

The NFT transfer opcode comes from [the same standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema).
Now, let's complete the message as laid out in this tutorial's previous sections. The correct code to complete the message is in the [GitHub repository](/v3/guidelines/smart-contracts/howto/wallet#-source-code).

The same procedure can also be applied to Jettons. To carry out this process, refer to the TL-B [standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) for Jettons transfers. It’s important to note that a slight difference exists between NFT and Jettons transfers.

### Wallet v3 and wallet v4 get methods

Smart contracts often use [GET methods](/v3/guidelines/smart-contracts/get-methods). However, they don’t run inside the blockchain but on the client side. GET methods have many uses and provide accessibility to different data types for smart contracts. For example, the [get_nft_data() method in NFT smart contracts](https://github.com/ton-blockchain/token-contract/blob/991bdb4925653c51b0b53ab212c53143f71f5476/nft/nft-item.fc#L142-L145) allows users to retrieve specific content, owner, and NFT collection information.

Below we’ll learn more about the basics of GET methods used with [V3](https://github.com/ton-blockchain/ton/blob/e37583e5e6e8cd0aebf5142ef7d8db282f10692b/crypto/smartcont/wallet3-code.fc#L31-L41) and [V4](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L164-L198). Let’s start with the methods that are the same for both wallet versions:

|        Method        |                                                                                                       Explanation                                                                                                       |
| :------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     int seqno()      |                     This method is essential for retrieving the current seqno and sending messages with the correct value. In previous sections of this tutorial, we frequently called this method.                     |
| int get_public_key() | This method retrieves the public key. While get_public_key() is not widely used, various services can utilize it. For example, some API services allow retrieving multiple wallets associated with the same public key. |

Now, let’s move to the methods that only the V4 wallet makes use of:

|                     Method                     |                                                                                                                            Explanation                                                                                                                            |
| :--------------------------------------------: |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|             int get_subwallet_id()             |                                                                                   Earlier in the tutorial, we considered this. This method allows you to retrive subwallet_id.                                                                                    |
| int is_plugin_installed(int wc, int addr_hash) |         Let us know if the plugin has been installed. To call this method, you need to pass the [WorkChain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-a-blockchain-with-your-own-rules) and the plugin address hash.          |
|            tuple get_plugin_list()             |                                                                                                     This method returns the address of the installed plugins.                                                                                                     |

Let’s consider the `get_public_key` and the `is_plugin_installed` methods. These two methods were chosen because we would first have to get a public key from 256 bits of data, and then we would have to learn how to pass a slice and different types of data to GET methods. This is very useful to help us learn how to properly use these methods.

First, we need a client who is capable of sending requests. Therefore, we’ll use a specific wallet address ([EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF](https://tonscan.org/address/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF)) as an example:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { Address } from "@ton/core";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const walletAddress = Address.parse(
  "EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"
); // my wallet address as an example
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "log"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get the current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletAddress := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF") // my wallet address as an example
```

</TabItem>
</Tabs>

Now, we need to call the GET method wallet.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
// I always call runMethodWithError instead of runMethod to be able to check the exit_code of the called method.
let getResult = await client.runMethodWithError(
  walletAddress,
  "get_public_key"
); // run get_public_key GET Method
const publicKeyUInt = getResult.stack.readBigNumber(); // read answer that contains uint256
const publicKey = publicKeyUInt.toString(16); // get hex string from bigint (uint256)
console.log(publicKey);
```

</TabItem>
<TabItem value="go" label="Golang">

```go
getResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "get_public_key") // run get_public_key GET Method
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}

// We have a response as an array with values and should specify the index when reading it
// In the case of get_public_key, we have only one returned value that is stored at 0 index
publicKeyUInt := getResult.MustInt(0) // read answer that contains uint256
publicKey := publicKeyUInt.Text(16)   // get hex string from bigint (uint256)
log.Println(publicKey)
```

</TabItem>
</Tabs>

After the call is successfully completed, the end result is an extremely large 256-bit number that must be translated into a hex string. The resulting hex string for the wallet address we provided above is as follows: `430db39b13cf3cb76bfa818b6b13417b82be2c6c389170fbe06795c71996b1f8`.
Next, we leverage the [TonAPI](https://docs.tonconsole.com/tonapi/rest-api) (/v1/wallet/findByPubkey method) by inputting the obtained hex string into the system. It is immediately clear that the first element in the array within the answer will identify my wallet.

Then, we switch to the `is_plugin_installed` method. As an example, we’ll again use the wallet we used earlier ([EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k](https://tonscan.org/address/EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k)) and the plugin ([EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ](https://tonscan.org/address/EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ)):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const oldWalletAddress = Address.parse(
  "EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k"
); // my old wallet address
const subscriptionAddress = Address.parseFriendly(
  "EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ"
); // subscription plugin address, which is already installed on the wallet
```

</TabItem>
<TabItem value="go" label="Golang">

```go
oldWalletAddress := address.MustParseAddr("EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k")
subscriptionAddress := address.MustParseAddr("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ") // subscription plugin address which is already installed on the wallet
```

</TabItem>
</Tabs>

Now, we need to retrieve the plugin’s hash address to translate it into a number and send it to the GET Method.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const hash = BigInt(`0x${subscriptionAddress.address.hash.toString("hex")}`);

getResult = await client.runMethodWithError(
  oldWalletAddress,
  "is_plugin_installed",
  [
    { type: "int", value: BigInt("0") }, // pass workchain as int
    { type: "int", value: hash }, // pass plugin address hash as int
  ]
);
console.log(getResult.stack.readNumber()); // -1
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "math/big"
)

hash := big.NewInt(0).SetBytes(subscriptionAddress.Data())
// runGetMethod will automatically identify types of passed values
getResult, err = client.RunGetMethod(context.Background(), block, oldWalletAddress,
  "is_plugin_installed",
  0,    // pass workchain
  hash) // pass plugin address
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}

log.Println(getResult.MustInt(0)) // -1
```

</TabItem>
</Tabs>

The response must be `-1`, meaning the result is `true`. It is also possible to send a slice and a cell if required. It would be enough to create and transfer a Slice or Cell instead of using the BigInt, specifying the appropriate type.

### Contract deployment via wallet

In chapter three, we deployed a wallet. To accomplish this, we initially sent some TON and a message from the wallet to deploy a smart contract. However, this process is not broadly used with external messages and is often used mainly for wallets. While developing contracts, the deployment process is initialized by sending internal messages.

To achieve this, we’ll use the V3R2 wallet smart contract introduced in [the third chapter](/v3/guidelines/smart-contracts/howto/wallet#compiling-wallet-code). In this case, we’ll set the `subwallet_id` to `3` or any other number required to generate a different address while using the same private key (this value is customizable):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell, Cell } from "@ton/core";
import { mnemonicToWalletKey } from "@ton/crypto";

const mnemonicArray = "put your mnemonic".split(" ");
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic

const codeCell = Cell.fromBase64(
  "te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A=="
);
const dataCell = beginCell()
  .storeUint(0, 32) // Seqno
  .storeUint(3, 32) // Subwallet ID
  .storeBuffer(keyPair.publicKey) // Public Key
  .endCell();

const stateInit = beginCell()
  .storeBit(0) // No split_depth
  .storeBit(0) // No special
  .storeBit(1) // We have code
  .storeRef(codeCell)
  .storeBit(1) // We have data
  .storeRef(dataCell)
  .storeBit(0) // No library
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
  "golang.org/x/crypto/pbkdf2"
  "strings"
)

mnemonicArray := strings.Split("put your mnemonic", " ")
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key

BOCBytes, _ := base64.StdEncoding.DecodeString("te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==")
codeCell, _ := cell.FromBOC(BOCBytes)
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32).           // Seqno
  MustStoreUInt(3, 32).           // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true).  // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()
```

</TabItem>
</Tabs>

Next, we’ll retrieve the address from our contract and build the Internal Message. We'll also add the "Deploying..." comment to our message.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, toNano } from "@ton/core";

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console

const internalMessageBody = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Deploying...")
  .endCell();

const internalMessage = beginCell()
  .storeUint(0x10, 6) // no bounce
  .storeAddress(contractAddress)
  .storeCoins(toNano("0.01"))
  .storeUint(0, 1 + 4 + 4 + 64 + 32)
  .storeBit(1) // We have State Init
  .storeBit(1) // We store State Init as a reference
  .storeRef(stateInit) // Store State Init as a reference
  .storeBit(1) // We store Message Body as a reference
  .storeRef(internalMessageBody) // Store Message Body Init as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "log"
)

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String())   // Output contract address to console

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Deploying...").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(contractAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()).
  MustStoreUInt(0, 1+4+4+64+32).
  MustStoreBoolBit(true).            // We have State Init
  MustStoreBoolBit(true).            // We store State Init as a reference
  MustStoreRef(stateInit).           // Store State Init as a reference
  MustStoreBoolBit(true).            // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body Init as a reference
  EndCell()
```

</TabItem>
</Tabs>

:::info
Note that the bits have been specified above and that the stateInit and internalMessageBody have been saved as references.
:::

Since the links are stored separately, we could write:

```tlb
4 (0b100) + 2 (0b10) + 1 (0b1) -> (4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
```

Tha also means:

```tlb
(0b111, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
```
Then, save two references.


Next, we’ll prepare a message for our wallet and send it:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { sign } from "@ton/crypto";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = "put your mnemonic".split(" ");
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const walletAddress = Address.parse("put the wallet address you will deploy.");
const getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
const seqno = getMethodResult.stack.readNumber(); // get seqno from response

// message for our wallet
const toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32) // store seqno
  // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8)
  .storeUint(3, 8)
  .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), walletKeyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature
const body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();

const external = beginCell()
  .storeUint(0b10, 2) // indicate that it is an incoming external message
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress)
  .storeCoins(0) // Import fee
  .storeBit(0) // We do not have State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();

console.log(external.toBoc().toString("base64"));
client.sendFile(external.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
  "time"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get the current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletMnemonicArray := strings.Split("put your mnemonic", " ")
mac = hmac.New(sha512.New, []byte(strings.Join(walletMnemonicArray, " ")))
hash = mac.Sum(nil)
k = pbkdf2.Key(hash, []by

[Content truncated due to size limit]


================================================
FILE: docs/v3/guidelines/smart-contracts/security/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/security/overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Overview

:::info  
This article needs an update. Please help us improve it.  
:::

**This page provides recommendations to help secure your smart contract.**

If you are developing a smart contract, here are some examples of errors that could lead to losing funds:

- [TON Hack Challenge #1](https://github.com/ton-blockchain/hack-challenge-1)
  - [Drawing conclusions from TON Hack Challenge](/v3/guidelines/smart-contracts/security/ton-hack-challenge-1)

## TON course: security

:::tip  
Before diving into developer-level security topics, ensure you understand security at the user level. To achieve this, take the [Blockchain Basics with TON](https://stepik.org/course/201294/promo) course ([RU version](https://stepik.org/course/202221/), [CHN version](https://stepik.org/course/200976/)). Module 5 covers the basics of user-level security.  
:::

The [TON Blockchain course](https://stepik.org/course/176754/) is a comprehensive guide to TON Blockchain development.

Module 8 thoroughly covers smart contract security on TON Blockchain.

<Button
  href="https://stepik.org/course/176754/promo"
  colorType={"primary"}
  sizeType={"sm"}
>
  Check TON Blockchain course
</Button>{" "}

<Button
  href="https://stepik.org/course/201638/promo"
  colorType={"secondary"}
  sizeType={"sm"}
>
  CHN
</Button>{" "}

<Button
  href="https://stepik.org/course/201855/promo"
  colorType={"secondary"}
  sizeType={"sm"}
>
  RU
</Button>{" "}

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/security/random-number-generation.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/security/random-number-generation.md
================================================
import Feedback from '@site/src/components/Feedback';

# Random number generation

Generating random numbers is a common task in many projects. While you may have seen the `random()` function in FunC documentation, note that its result can be easily predicted unless you use additional techniques.

## How can someone predict a random number?

Computers struggle to generate truly random information because they strictly follow user instructions. To address this, developers have created methods for generating pseudo-random numbers.

These algorithms typically require a _seed_ value to produce a sequence of _pseudo-random_ numbers. You will always get the same result if you run the same program with the same _seed_ multiple times. In TON, the _seed_ varies for each block.

- [Generation of block random seed](/v3/guidelines/smart-contracts/security/random)

To predict the result of the `random()` function in a smart contract, one would need to know the current `seed` of the block, which is impossible unless you are a validator.

There are multiple approaches to generate random values, each offering different trade-offs between speed, security, and decentralization guarantees.

Below we outline three fundamental approaches:

---

## Approach 1: randomize_lt {#randomize_lt}

**Mechanism**: Generates [randomness using block logical time](/v3/guidelines/smart-contracts/security/ton-hack-challenge-1/#4-lottery) (`lt`) and blockchain entropy.  
**Security model**:

- ✅ Safe against user manipulation
- ❌ Vulnerable to colluding validators (could theoretically predict/influence values)

**Speed**: Fast (single-block operation)  
**Use cases**:

- Non-critical applications, for example gaming & NFTs
- Scenarios where validator trust is assumed

---

## Approach 2: block skipping {#block-skip}

**Mechanism**: Uses [entropy from skipped blocks](https://github.com/puppycats/ton-random?tab=readme-ov-file#ton-random) in blockchain history.  
**Security model**:

- ✅ Resistant to user manipulation
- ⚠️ Not fully secure against determined validators (may influence block inclusion timing)

**Speed**: Slow (requires multiple blocks to finalize)  
**Use cases**:

- Medium-stakes applications, for example lottery systems
- Scenarios with partial trust in validator set

---

## Approach 3: commit-reveal scheme {#commit-reveal}

**Mechanism**:

1. **Commit phase**: Participants submit hashed secrets
2. **Reveal phase**: Secrets are disclosed and combined to generate final randomness

**Security model**:

- ✅ Cryptographically secure when properly implemented
- ✅ Resilient to both users and validators
- ⚠️ Requires protocol-level verification of commitments

**Speed**: Very slow (multi-phase, multi-block process)  
**Use cases**:

- High-value applications, for example decentralized auctions
- Systems requiring Byzantine fault tolerance

---

## Key considerations

| Factor                    | `randomize_lt` | Block skipping | Commit-reveal |
| ------------------------- | -------------- | -------------- | ------------- |
| Speed                     | Fast           | Moderate       | Slow          |
| User resistance           | High           | High           | Highest       |
| Validator resistance      | Low            | Medium         | Highest       |
| Implementation complexity | Low            | Medium         | High          |

---

:::caution
No method is universally perfect – choose based on:

- Value-at-risk in your application
- Required time-to-finality
- Trust assumptions about validators

:::


Always audit implementations through formal verification where possible.

<Feedback />



================================================
FILE: docs/v3/guidelines/smart-contracts/security/random.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/security/random.md
================================================
import Feedback from '@site/src/components/Feedback';

# Generation of block random seed  

:::caution  
This information is accurate at the time of writing. It may change during any network upgrade.  
:::  

Lottery contracts occasionally appear on TON. These contracts often use unsafe methods to handle randomness, making the generated values predictable and allowing the lottery to be exploited.  

Exploiting weaknesses in random number generation typically involves using a proxy contract that forwards a message if the random value meets specific conditions. While proposals exist for wallet contracts that can execute arbitrary on-chain code (specified and signed by the user), most popular wallet versions do not support this functionality. So, if a lottery checks whether a gambler participates through a wallet contract, is it safe?  

Alternatively, the question can be framed as: Can an external message be included in a block where the random value matches the sender's requirements?  

The sender cannot influence randomness directly. However, validators generating blocks and including proposed external messages can.  

## How validators affect the seed  

Limited information about this topic, even in whitepapers, confuses developers. The [TON Whitepaper](https://docs.ton.org/ton.pdf) mentions block randomness briefly:  

> The algorithm used to select validator task groups for each shard (w, s) is deterministic pseudorandom. **It uses pseudorandom numbers embedded by validators into each MasterChain block (generated by a consensus using threshold signatures) to create a random seed**, and then computes, for example, Hash(code(w). code(s).validator_id.rand_seed) for each validator.  

However, the most reliable and up-to-date source is the code itself. Let's examine [collator.cpp](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/validator/impl/collator.cpp#L1590):  

```cpp
  {
 // generate rand seed
 prng::rand_gen().strong_rand_bytes(rand_seed->data(), 32);
    LOG(DEBUG) << "block random seed set to " << rand_seed->to_hex();
  }
```

This code generates the random seed for a block. It resides in the collator code because the party generating blocks requires it, while lite validators do not.

A single validator or collator generates the seed when creating a block. This raises the following question:  

## Can the decision to include an external message be made after the seed is known?

Yes, it can. Here’s why: if the system imports an external message, its execution must succeed. Since execution can depend on random values, the block seed must be known beforehand.

Thus, there **is** a way to exploit "unsafe" (single-block) randomness if the sender collaborates with a validator. Even if the contract uses `randomize_lt()`, the validator can generate a suitable seed or include the proposed external message in a block that meets all conditions. A validator acting in this way would still be considered fair. This is the essence of decentralization.  

To fully cover randomness, let's address one more question.  

## How does the block seed affect randomness in contracts?  

The seed generated by the validator is not used directly in all contracts. Instead, it is [hashed with the account address](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/crypto/block/transaction.cpp#L876).  

```cpp
bool Transaction::prepare_rand_seed(td::BitArray<256>& rand_seed, const ComputePhaseConfig& cfg) const {
 // we might use SHA256(block_rand_seed . addr . trans_lt)
 // instead, we use SHA256(block_rand_seed . addr)
 // if the smart contract wants to randomize further, it can use RANDOMIZE instruction
 td::BitArray<256 + 256> data;
  data.bits().copy_from(cfg.block_rand_seed.cbits(), 256);
 (data.bits() + 256).copy_from(account.addr_rewrite.cbits(), 256);
  rand_seed.clear();
  data.compute_sha256(rand_seed);
  return true;
}
```

Pseudorandom numbers are then generated using the procedure described on the [TVM instructions](/v3/documentation/tvm/instructions#F810) page:  

> **x\{F810} RANDU256**  
> Generates a new pseudorandom unsigned 256-bit Integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.  

This process is confirmed by examining the code for [preparing the contract's c7](https://github.com/ton-blockchain/ton/blob/master/crypto/block/transaction.cpp#L903) (c7 is a tuple for temporary data, storing the contract address, starting balance, random seed, etc.) and [generating random values](https://github.com/ton-blockchain/ton/blob/master/crypto/vm/tonops.cpp#L217-L268).  

## Conclusion  

No random number generation in TON is entirely safe in terms of unpredictability. This means **no perfect lottery can exist on TON**, nor can any lottery be fully trusted to be fair.  

Typical usage of pseudorandom number generators (PRNGs) may include `randomize_lt()`, but such contracts can still be tricked by selecting the correct blocks to send messages. Proposed solutions, such as sending messages to another workchain and receiving a response to skip blocks, only delay the threat. In reality, any validator (representing 1/250 of the TON Blockchain) can choose the optimal time to send a request to a lottery contract so that the response arrives in a block they generate. They can then select any block seed they desire. This risk will increase once collators are introduced to the mainnet, as standard complaints cannot fine them since they do not stake anything in the Elector contract.  

<!-- TODO: Find an example contract using random without any additions and demonstrate how to determine the result of RANDU256 knowing the block random seed (include a link to dton.io to show the generated value). -->  

<!-- TODO: Next article. "Let's proceed to writing a tool that exploits this. It will attach to a validator and include proposed external messages in blocks satisfying specific conditions—provided a fee is paid." -->  

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/security/secure-programming.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/security/secure-programming.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from "@theme/ThemedImage";

# Secure smart contract programming

In this section, we’ll explore some of the most interesting features of the TON blockchain and walk through a list of best practices for developers programming smart contracts in FunC.

## Contract sharding

When developing contracts for the EVM, you typically split the project into multiple contracts for convenience. In some cases, it’s possible to implement all functionality in a single contract, and even when splitting is necessary, such as with Liquidity Pairs in an Automated Market Maker, it doesn’t introduce significant complexity. Transactions are executed entirely: either everything succeeds, or everything reverts.

In TON, it’s strongly recommended to avoid “unbounded data structures” and [split a single logical contract into smaller pieces](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons), each managing a small amount of data. A basic example is the implementation of TON Jettons, TON’s version of Ethereum’s ERC-20 token standard. In short:

1. One `jetton-minter` stores `total_supply`, `minter_address`, and references to token metadata and `jetton_wallet_code`.
2. Multiple `jetton-wallet` contracts, one for each token owner, store the owner’s address, their balance, the `jetton-minter` address, and a reference to `jetton_wallet_code`.

This design ensures that Jetton transfers occur directly between wallets without affecting high-load addresses, enabling parallel transaction processing. As a result, your contract will likely become a “group of contracts” that actively interact with each other.

## Partial execution of transactions is possible

![smart1.png](/img/docs/security-measures/secure-programming/smart1.png)

A unique property of TON smart contracts is the possibility of partial transaction execution. For example, consider the message flow of a standard TON Jetton:

1. The sender sends an `op::transfer` message to its wallet (`sender_wallet`).
2. `sender_wallet` reduces the token balance.
3. `sender_wallet` sends an `op::internal_transfer` message to the recipient’s wallet (`destination_wallet`).
4. `destination_wallet` increases its token balance.
5. `destination_wallet` sends an `op::transfer_notification` to its owner (`destination`).
6. `destination_wallet` returns excess gas with an `op::excesses` message to the `response_destination`, usually the sender.

If `destination_wallet` fails to process the `op::internal_transfer` message, such as due to an exception or insufficient gas, this step and subsequent ones won’t execute. However, the first step, reducing the balance in `sender_wallet`, will still complete. This results in partial transaction execution, an inconsistent state of the `Jetton`, and potential loss of funds.

In the worst-case scenario, all tokens could be stolen this way. For example, if you first credit bonuses to a user and then send an `op::burn` message to their Jetton wallet, you cannot guarantee that the `op::burn` will succeed.

## TON smart contract developers must control gas

In Solidity, gas management is less of a concern for contract developers. If a user provides insufficient gas, the transaction reverts, though the gas is not refunded. If they provide enough gas, the actual costs are automatically calculated and deducted from their balance.

In TON, the situation is different:

1. If there’s insufficient gas, the transaction may partially execute.
2. If there’s excess gas, the developer must return it.
3. If a “group of contracts” exchanges messages, gas control and calculation must occur in each message.

TON cannot automatically calculate gas costs. Since transaction execution can take a long time, the user might run out of TON coins by the end. This is where the carry-value principle comes into play.

## TON smart contract developers must manage storage

A typical message handler in TON follows this approach:

```func
() handle_something(...) impure {
    (int total_supply, <a lot of vars>) = load_data();
    ... ;; do something, change data
    save_data(total_supply, <a lot of vars>);
}
```

Unfortunately, `<a lot of vars>` often involves enumerating all contract data fields. For example:

```func
(
    int total_supply, int swap_fee, int min_amount, int is_stopped, int user_count, int max_user_count,
    slice admin_address, slice router_address, slice jettonA_address, slice jettonA_wallet_address,
    int jettonA_balance, int jettonA_pending_balance, slice jettonB_address, slice jettonB_wallet_address,
    int jettonB_balance, int jettonB_pending_balance, int mining_amount, int datetime_amount, int minable_time,
    int half_life, int last_index, int last_mined, cell mining_rate_cell, cell user_info_dict, cell operation_gas,
    cell content, cell lp_wallet_code
) = load_data();
```

This approach has several drawbacks:

1. Adding a new field requires updating `load_data()/save_data()` statements throughout the contract, which is labor-intensive and error-prone.
2. Namespace pollution can lead to bugs, such as shadowing a storage field with a local variable, which can overwrite the contract state.
3. Parsing and repacking the entire storage on every function call increases gas costs.

>In a recent CertiK audit, we discovered that the developer mixed up two arguments in the `save_data()` function:  
>```func  
>save_data(total_supply, min_amount, swap_fee, ...)  
>```  
>Without an external audit by a team of experts, detecting such a bug is challenging. The function was rarely used, and the confused parameters often had a value of zero. Identifying this type of error requires knowing exactly what to look for.  
>Secondly, "namespace pollution" is a common issue. For example, in another audit, we found the following code in the middle of a function:  
>```func  
>int min_amount = in_msg_body~load_coins();  
>```  
>Here, a local variable shadowed a storage field, and at the end of the function, the overwritten value was stored in the contract state. This allowed an attacker to manipulate the contract’s state. The problem is exacerbated by FunC’s allowance of [variable redeclaration](/v3/documentation/smart-contracts/func/docs/statements#variable-declaration): “This is not a declaration, but just a compile-time insurance that `min_amount` has type `int`.”

## Tips

### 1. Always draw message flow diagrams

Even in a simple contract like a TON Jetton, there are numerous messages, senders, receivers, and data pieces. For more complex contracts like decentralized exchanges (DEXs), the number of messages in a single workflow can exceed ten.

![smart2.png](/img/docs/security-measures/secure-programming/smart2.png)

At CertiK, we use the [DOT](<https://en.wikipedia.org/wiki/DOT_(graph_description_language)>) language to describe and update such diagrams during audits. This helps auditors visualize and understand complex interactions within and between contracts.

### 2. Avoid failures and handle bounced messages

Define the entry point in your message flow—the message that initiates the cascade of messages in your contract group. Perform all necessary checks (payload, gas supply, etc.) here to minimize the chance of failure in subsequent stages.

If you’re unsure whether all conditions will be met, such as whether the user has enough tokens, the message flow is likely designed incorrectly.

In subsequent messages, use `throw_if()/throw_unless()` as assertions rather than checks. Many contracts also handle bounced messages as a precaution.

For example, in TON Jetton, if the recipient’s wallet cannot accept tokens, the sender’s wallet processes the bounced message and returns the tokens to its balance.

```func
() on_bounce (slice in_msg_body) impure {
    in_msg_body~skip_bits(32);  ;;0xFFFFFFFF

    (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();

    int op = in_msg_body~load_op();

    throw_unless(error::unknown_op, (op == op::internal_transfer) | (op == op::burn_notification));

    int query_id = in_msg_body~load_query_id();
    int jetton_amount = in_msg_body~load_coins();

    balance += jetton_amount;
    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code);
}
```

While handling bounced messages is recommended, it’s not a complete solution. Bounced messages require gas, and if the sender doesn’t provide enough, the bounce won’t occur. Additionally, TON doesn’t support chain bounces, so a bounced message cannot be re-bounced.

### 3. Expect a man-in-the-middle attack

A message cascade can span multiple blocks. Assume that while one message flow is running, an attacker can initiate a parallel flow. If a property, such as the user’s token balance, is checked at the start, don’t assume it will remain valid at later stages.

### 4. Use the carry-value pattern

Messages between contracts must carry valuables. In TON Jetton, `sender_wallet` subtracts the balance and sends it with an `op::internal_transfer` message to `destination_wallet`, which then adds the balance to its own or bounces it back.

An incorrect implementation would be querying the Jetton balance on-chain. By the time the response to `op::get_balance` arrives, the balance might have already been spent.

Instead, implement an alternative flow:

1. The master sends an `op::provide_balance` message to the wallet.
2. The wallet zeroes its balance and sends back `op::take_balance`.
3. The master receives the funds, decides if they’re sufficient, and either uses them or returns them to the wallet.

### 5. Return value instead of rejecting

Contracts often receive requests with values. Instead of rejecting invalid requests via `throw_unless()`, return the value to the sender.

For example, in TON Jetton:

1. The sender sends an `op::transfer` message via `sender_wallet` to `your_contract_wallet`, specifying `forward_ton_amount` and `forward_payload`.
2. `sender_wallet` sends an `op::internal_transfer` message to `your_contract_wallet`.
3. `your_contract_wallet` sends an `op::transfer_notification` message to `your_contract`, delivering `forward_ton_amount`, `forward_payload`, `sender_address`, and `jetton_amount`.
4. Your contract processes the request in `handle_transfer_notification()`.

At this stage, avoid `throw_if()/throw_unless()`, as it could result in lost Jettons. Use try-catch statements, available in FunC v0.4.0+, to handle errors and return Jettons if necessary.

### 6. Calculate gas and check msg_value

Estimate the gas cost of each handler in your message flow and check the sufficiency of `msg_value`. Avoid demanding excessive gas, as it must be divided among subsequent messages. Recalculate gas requirements if your code starts sending more messages.

### 7. Return gas excesses carefully

If excess gas isn’t returned to the sender, funds will accumulate in your contracts. While not catastrophic, this is suboptimal. Popular contracts like TON Jetton return excess gas with an `op::excesses` message.

TON provides a useful mechanism: `SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64`. This mode forwards remaining gas with the message. However, avoid this mode if:

1. Your contract has no other non-linear handlers, as storage fees will deplete the contract balance.
2. Your contract emits events, sending messages to external addresses, as the cost is deducted from the contract balance.
3. Your contract attaches value to messages or uses `SEND_MODE_PAY_FEES_SEPARATELY = 1`, as these actions deduct from the contract balance.

In these cases, manually calculate and return excess gas:

```func
int ton_balance_before_msg = my_ton_balance - msg_value;
int storage_fee = const::min_tons_for_storage - min(ton_balance_before_msg, const::min_tons_for_storage);
msg_value -= storage_fee + const::gas_consumption;

if(forward_ton_amount) {
    msg_value -= (forward_ton_amount + fwd_fee);
...
}

if (msg_value > 0) {    ;; return excess gas
    var msg = begin_cell()
        .store_uint(0x10, 6)
        .store_slice(response_address)
        .store_coins(msg_value)
...
}
```

Ensure the contract balance doesn’t run out, as this could lead to partial transaction execution.

### 8. Use nested storage

Organize storage into blocks of related data:

```func
() handle_something(...) impure {
    (slice swap_data, cell liquidity_data, cell mining_data, cell discovery_data) = load_data();
    (int total_supply, int swap_fee, int min_amount, int is_stopped) = swap_data.parse_swap_data();
    …
    swap_data = pack_swap_data(total_supply + lp_amount, swap_fee, min_amount, is_stopped);
    save_data(swap_data, liquidity_data, mining_data, discovery_data);
}
```

This approach minimizes changes when adding new fields and avoids namespace pollution. If storage contains many fields, group them hierarchically.

### 9. Use `end_parse()`

Use `end_parse()` when reading data from storage or message payloads. This ensures you read as much as you write, preventing hard-to-debug issues.

### 10. Use helper functions and avoid magic numbers

Write wrappers, helper functions, and declare constants to improve code readability. Avoid magic numbers, as they make the code harder to understand and maintain.

For example, instead of:

```func
var msg = begin_cell()
    .store_uint(0xc4ff, 17)         ;; 0 11000100 0xff
    .store_uint(config_addr, 256)
    .store_grams(1 << 30)           ;; ~1 gram of value
    .store_uint(0, 107)
    .store_uint(0x4e565354, 32)
    .store_uint(query_id, 64)
    .store_ref(vset);

send_raw_message(msg.end_cell(), 1);
```

Use:

```func
const int SEND_MODE_REGULAR = 0;
const int SEND_MODE_PAY_FEES_SEPARATELY = 1;
const int SEND_MODE_IGNORE_ERRORS = 2;
const int SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE = 64;

builder store_msgbody_prefix_stateinit(builder b) inline {
    return b.store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1);
}

builder store_body_header(builder b, int op, int query_id) inline {
    return b.store_uint(op, 32).store_uint(query_id, 64);
}

() mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {
    cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);
    slice to_wallet_address = calculate_address_by_state_init(state_init);

    var msg = begin_cell()
        .store_msg_flags(BOUNCEABLE)
        .store_slice(to_wallet_address)
        .store_coins(amount)
        .store_msgbody_prefix_stateinit()
        .store_ref(state_init)
        .store_ref(master_msg);

    send_raw_message(msg.end_cell(), SEND_MODE_REGULAR);
}
```

## References

- [Original article](https://blog.ton.org/secure-smart-contract-programming-in-func) - _CertiK_

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/security/things-to-focus.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/security/things-to-focus.md
================================================
import Feedback from '@site/src/components/Feedback';

# Things to focus on while working with TON Blockchain

In this article, we will review and discuss the elements to consider for those who want to develop TON applications.

## Checklist

### 1. Name collisions

Func variables and functions may contain almost any legit character. I.e. `var++`, `~bits`, `foo-bar+baz` including commas are valid variables and functions names.

When writing and inspecting a Func code, Linter should be used.

- [IDE plugins](/v3/documentation/smart-contracts/getting-started/ide-plugins)

### 2. Check the throw values

Each time the TVM execution stops normally, it stops with exit codes `0` or `1`. Although it is done automatically, TVM execution can be interrupted directly in an unexpected way if exit codes `0` and `1` are thrown directly by either `throw(0)` or `throw(1)` command.

- [How to handle errors](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- [TVM exit codes](/v3/documentation/tvm/tvm-exit-codes)

### 3. Func is a strictly typed language with data structures holding exactly what they are supposed to store

It is crucial to keep track of what the code does and what it may return. Keep in mind that the compiler cares only about the code and only in its initial state. After certain operations stored values of some variables can change.

Reading unexpected variables values and calling methods on data types that are not supposed to have such methods (or their return values are not stored properly) are errors and are not skipped as "warnings" or "notices" but lead to unreachable code. Keep in mind that storing an unexpected value may be okay, however, reading it may cause problems e.g. error code 5 (integer out of expected range) may be thrown for an integer variable.

### 4. Messages have modes

It is essential to check the message mode, in particular its interaction with previous messages sent and fees. A possible failure is not accounting for storage fees, in which case contract may run out of TON leading to unexpected failures when sending outgoing messages. You can view the message modes [here](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### 5. Replay protection {#replay-protection}

There are two custom solutions for wallets (smart contracts that store user funds): `seqno-based` (using a counter to prevent processing the same message twice) and `high-load` (storing processed identifiers and their expiration times).

- [Seqno-based wallets](/v3/guidelines/dapps/asset-processing/payments-processing/#seqno-based-wallets)
- [High-load wallets](/v3/guidelines/dapps/asset-processing/payments-processing/#high-load-wallets)

For `seqno`, refer to [this section](/v3/documentation/smart-contracts/message-management/sending-messages#mode3) for details on possible replay scenarios.

### 6. TON fully implements the actor model

It means the code of the contract can be changed. It can either be changed permanently, using [`SETCODE`](/v3/documentation/smart-contracts/func/docs/stdlib#set_code) TVM directive, or in runtime, setting the TVM code registry to a new cell value until the end of execution.

### 7. TON Blockchain has several transaction phases: computational phase, actions phase, and a bounce phase among them

The computational phase executes the code of smart contracts and only then the actions are performed (sending messages, code modification, changing libraries, and others). So, unlike on Ethereum-based blockchains, you won't see the computational phase exit code if you expected the sent message to fail, as it was performed not in the computational phase, but later, during the action phase.

- [Transactions and phases](/v3/documentation/tvm/tvm-overview#transactions-and-phases)

### 8. TON contracts are autonomous

Contracts in the blockchain can reside in separate shards, processed by other set of validators, meaning that developer cannot pull data from other contracts on demand. Thus, any communication is asynchronous and done by sending messages.

- [Sending messages from smart-contract](/v3/documentation/smart-contracts/message-management/sending-messages)
- [Sending messages from DApp](/v3/guidelines/ton-connect/guidelines/sending-messages)

### 9. Unlike other blockchains, TON does not contain revert messages, only exit codes

It is helpful to think through the roadmap of exit codes for the code flow (and have it documented) before starting programming your TON smart contract.

### 10. Func functions that have method_id identifiers have method IDs

They can be either set explicitly `"method_id(5)"`, or implicitly by a func compiler. In this case, they can be found among methods declarations in the .fift assembly file. Two of them are predefined: one for receiving messages inside of blockchain `(0)`, commonly named `recv_internal`, and one for receiving messages from outside `(-1)`, `recv_external`.

### 11. TON crypto address may not have any coins or code

Smart contracts addresses in TON blockchain are deterministic and can be precomputed. Ton Accounts, associated with addresses may even contain no code which means they are uninitialized (if not deployed) or frozen while having no more storage or TON coins if the message with special flags was sent.

### 12. TON addresses may have three representations

TON addresses may have three representations.
A full representation can either be "raw" (`workchain:address`) or "user-friendly". The last one is the one users encounter most often. It contains a tag byte, indicating whether the address is `bounceable` or `not bounceable`, and a workchain id byte. This information should be noted.

- [Raw and user-friendly addresses](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)

### 13. Keep track of the flaws in code execution

Unlike Solidity where it's up to you to set methods visibility, in the case of Func, the visibility is restricted in a more intricate way either by showing errors or by `if` statements.

### 14. Keep an eye on gas before sending bounced messages

In case the smart contract sends the bounced messages with the value, provided by a user, make sure that the corresponding gas fees are subtracted from the returned amount not to be drained.

### 15. Monitor the callbacks and their failures

TON blockchain is asynchronous. That means the messages do not have to arrive successively. e.g. when a fail notification of an action arrives, it should be handled properly.

### 16. Check if the bounced flag was sent receiving internal messages

You may receive bounced messages (error notifications), which should be handled.

- [Handling of standard response messages](/v3/documentation/smart-contracts/message-management/internal-messages#handling-of-standard-response-messages)

## References

- [Original article](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain) - _0xguard_

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/security/ton-hack-challenge-1.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/security/ton-hack-challenge-1.md
================================================
import Feedback from '@site/src/components/Feedback';

# Drawing conclusions from TON Hack Challenge

The TON Hack Challenge was held on October 23.
There were several smart contracts deployed to the TON mainnet with synthetic security breaches. Every contract had a balance of 3000 or 5000 TON, allowing participant to hack it and get rewards immediately.

Source code and contest rules were hosted on GitHub [here](https://github.com/ton-blockchain/hack-challenge-1).

## Contracts

### 1. Mutual fund

:::note SECURITY RULE
Always check functions for [`impure`](/v3/documentation/smart-contracts/func/docs/functions#impure-specifier) modifier.
:::

The first task was very simple. The attacker could find that `authorize` function was not `impure`. The absence of this modifier allows a compiler to skip calls to that function if it returns nothing or the return value is unused.

```func
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 2. Bank

:::note SECURITY RULE
Always check for [modifying/non-modifying](/v3/documentation/smart-contracts/func/docs/statements#methods-calls) methods.
:::

`udict_delete_get?` was called with `.` instead `~`, so the real dict was untouched.

```func
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note SECURITY RULE
Use signed integers if you really need it.
:::

Voting power was stored in message as an integer. So the attacker could send a negative value during power transfer and get infinite voting power.

```func
(cell,()) transfer_voting_power (cell votes, slice from, slice to, int amount) impure {
  int from_votes = get_voting_power(votes, from);
  int to_votes = get_voting_power(votes, to);

  from_votes -= amount;
  to_votes += amount;

  ;; No need to check that result from_votes is positive: set_voting_power will throw for negative votes
  ;; throw_unless(998, from_votes > 0);

  votes~set_voting_power(from, from_votes);
  votes~set_voting_power(to, to_votes);
  return (votes,());
}
```

### 4. Lottery

:::note SECURITY RULE
Always randomize seed before doing [`rand()`](/v3/documentation/smart-contracts/func/docs/stdlib#rand)
:::

Seed was brought from logical time of the transaction, and a hacker can win by bruteforcing the logical time in the current block (cause lt is sequential in the borders of one block).

```func
int seed = cur_lt();
int seed_size = min(in_msg_body.slice_bits(), 128);

if(in_msg_body.slice_bits() > 0) {
    seed += in_msg_body~load_uint(seed_size);
}
set_seed(seed);
var balance = get_balance().pair_first();
if(balance > 5000 * 1000000000) {
    ;; forbid too large jackpot
    raw_reserve( balance - 5000 * 1000000000, 0);
}
if(rand(10000) == 7777) { ...send reward... }
```

### 5. Wallet

:::note SECURITY RULE
Remember that everything is stored in the blockchain.
:::

The wallet was protected with password, it's hash was stored in contract data. However, the blockchain remembers everything—the password was in the transaction history.

### 6. Vault

:::note SECURITY RULE
Always check for [bounced](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) messages.
Don't forget about errors caused by [standard](/v3/documentation/smart-contracts/func/docs/stdlib) functions.
Make your conditions as strict as possible.
:::

The vault has the following code in the database message handler:

```func
int mode = null();
if (op == op_not_winner) {
    mode = 64; ;; Refund remaining check-TONs
               ;; addr_hash corresponds to check requester
} else {
     mode = 128; ;; Award the prize
                 ;; addr_hash corresponds to the withdrawal address from the winning entry
}
```

Vault does not have a bounce handler or proxy message to the database if the user sends “check”. In the database we can set `msg_addr_none` as an award address because `load_msg_address` allows it. We are requesting a check from the vault, database tries to parse `msg_addr_none` using [`parse_std_addr`](/v3/documentation/smart-contracts/func/docs/stdlib#parse_std_addr), and fails. Message bounces to the vault from the database and op is not `op_not_winner`.

### 7. Better bank

:::note SECURITY RULE
Never destroy account for fun.
Make [`raw_reserve`](/v3/documentation/smart-contracts/func/docs/stdlib#raw_reserve) instead of sending money to yourself.
Think about possible race conditions.
Be careful with hashmap gas consumption.
:::

There were race conditions in the contract: you could deposit money, then try to withdraw it twice in concurrent messages. There is no guarantee that a message with reserved money will be processed, so the bank can shut down after a second withdrawal. After that, the contract could be redeployed and anybody could withdraw unclaimed money.

### 8. Dehasher

:::note SECURITY RULE
Avoid executing third-party code in your contract.
:::

```func
slice try_execute(int image, (int -> slice) dehasher) asm "<{ TRY:<{ EXECUTE DEPTH 2 THROWIFNOT }>CATCH<{ 2DROP NULL }> }>CONT"   "2 1 CALLXARGS";

slice safe_execute(int image, (int -> slice) dehasher) inline {
  cell c4 = get_data();

  slice preimage = try_execute(image, dehasher);

  ;; restore c4 if dehasher spoiled it
  set_data(c4);
  ;; clean actions if dehasher spoiled them
  set_c5(begin_cell().end_cell());

  return preimage;
}
```

There is no way to safe execute a third-party code in the contract, because [`out of gas`](/v3/documentation/tvm/tvm-exit-codes#standard-exit-codes) exception cannot be handled by `CATCH`. The attacker simply can [`COMMIT`](/v3/documentation/tvm/instructions#F80F) any state of contract and raise `out of gas`.

## Conclusion

Hope this article has shed some light on the non-obvious rules for FunC developers.

## References

- [dvlkv on GitHub](https://github.com/dvlkv) - _Dan Volkov_
- [Original article](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep) - _Dan Volkov_

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/testing/overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/testing/overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Writing tests with Blueprint

## Overview

The TypeScript SDK, named [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript), already includes the test toolkit (usually Sandbox). You can create a demo project and run the default test in two steps:

1. Create a new Blueprint project:

```bash
npm create ton@latest MyProject
```

2. Run a test:

```bash
cd MyProject
npx blueprint test
```

As a result, you’ll see the corresponding output in the terminal window:

```bash
% npx blueprint test

> MyProject@0.0.1 test
> jest

 PASS  tests/Main.spec.ts
  Main
    ✓ should deploy (127 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.224 s, estimated 2 s
Ran all test suites.
```

## Basic usage

Testing smart contracts allows you to cover security, optimize gas spending, and examine edge cases.  
Writing tests in Blueprint (based on [Sandbox](https://github.com/ton-org/sandbox)) involves defining arbitrary actions with the contract and comparing the test results with the expected outcome. For example:

```typescript
it("should execute with success", async () => {
  // Description of the test case
  const res = await main.sendMessage(sender.getSender(), toNano("0.05")); // Perform an action with the contract and save the result in res

  expect(res.transactions).toHaveTransaction({
    // Configure the expected result with the expect() function
    from: main.address, // Set the expected sender for the transaction
    success: true, // Set the desirable result using the matcher property success
 });

  printTransactionFees(res.transactions); // Print a table with details on spent fees
});
```

### Writing tests for complex assertions

The basic workflow for creating a test is as follows:

1. Create a specific wrapped `Contract` entity using `blockchain.openContract()`.
2. Describe the actions your `Contract` should perform and save the execution result in the `res` variable.
3. Verify the properties using the `expect()` function and the matcher `toHaveTransaction()`.

The `toHaveTransaction` matcher expects an object with any combination of fields from the `FlatTransaction` type, defined with the following properties:

| Name    | Type     | Description                                                                                                                                                |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from    | Address? | Contract address of the message sender                                                                                                                     |
| on      | Address  | Contract address of the message destination (alternative name for the property `to`).                                                                      |
| value   | bigint?  | Amount of TON coins in the message, in nanotons                                                                                                            |
| body    | Cell     | Message body defined as a Cell                                                                                                                             |
| op      | number?  | Op code is usually the operation identifier number (crc32 from TL-B). Expected in the first 32 bits of a message body.                                     |
| success | boolean? | Custom Sandbox flag that defines the resulting status of a certain transaction. True if both the compute and the action phases succeeded. Otherwise, False. |

You can omit fields you’re not interested in and pass functions that accept the types and return booleans (`true` meaning good) to check, for example, number ranges, message opcodes, etc. Note that if a field is optional (like `from?: Address`), the function must also accept the optional type.

:::tip  
The complete list of matcher fields is in the [Sandbox documentation](https://github.com/ton-org/sandbox#test-a-transaction-with-matcher).  
:::

### Specific test suite

#### Extract send mode

To extract the send mode of a sent message, use the following code:

```ts
const re = await blockchain.executor.runTransaction({
  message: beginCell().endCell(),
  config: blockchain.configBase64,
  libs: null,
  verbosity: "short",
  shardAccount: beginCell()
 .storeAddress(address)
 .endCell()
 .toBoc()
 .toString("base64"),
  now: Math.floor(Date.now()) / 1000,
  lt: BigInt(Date.now()),
  randomSeed: null,
  ignoreChksig: false,
  debugEnabled: true,
});

if (!re.result.success || !re.result.actions) {
  throw new Error("fail");
}

const actions = loadOutList(Cell.fromBase64(re.result.actions).beginParse());
for (const act of actions) {
  if (act.type === "sendMsg") {
    // process action
    console.log(act.mode);
 }
}
```

## Tutorials

Learn more about testing from the most valuable community tutorials on TON:

- [Lesson 2: Testing FunC for a Smart Contract](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/smartcontract/2lesson/secondlesson.md)
- [TON Hello World part 4: Step-by-step guide for testing your first smart contract](https://helloworld.tonstudio.io/04-testing/)
- [TON Smart Contract Pipeline](https://dev.to/roma_i_m/ton-smart-contract-pipeline-write-simple-contract-and-compile-it-4pnh)
- [[YouTube] Sixth lesson FunC & Blueprint: Gas, fees, tests](https://youtu.be/3XIpKZ6wNcg)

## Examples

Check test suites used for TON Ecosystem contracts and learn by examples:

- [Liquid-staking-contract sandbox tests](https://github.com/ton-blockchain/liquid-staking-contract/tree/main/tests)
- [Governance_tests](https://github.com/Trinketer22/governance_tests/blob/master/config_tests/tests/)
- [JettonWallet.spec.ts](https://github.com/EmelyanenkoK/modern_jetton/blob/master/tests/JettonWallet.spec.ts)
- [Governance_tests](https://github.com/Trinketer22/governance_tests/blob/master/elector_tests/tests/complaint-test.fc)
- [MassSender.spec.ts](https://github.com/Gusarich/ton-mass-sender/blob/main/tests/MassSender.spec.ts)
- [Assurer.spec.ts](https://github.com/aSpite/dominant-assurance-contract/blob/main/tests/Assurer.spec.ts)

## See also

- [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript)

<Feedback />




================================================
FILE: docs/v3/guidelines/smart-contracts/testing/writing-test-examples.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/smart-contracts/testing/writing-test-examples.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ConceptImage from "@site/src/components/conceptImage";
import ThemedImage from "@theme/ThemedImage";

# Writing test examples

This page demonstrates how to write tests for FunC contracts using the [Blueprint](https://github.com/ton-org/blueprint) ([Sandbox](https://github.com/ton-org/sandbox)).
The test suites focus on the demo contract [Fireworks](https://github.com/ton-community/fireworks-func), a smart contract that starts running with the `set_first` message.

When you create a new FunC project using `npm create ton@latest`, the SDK automatically generates a test file `tests/contract.spec.ts` in the project directory for testing the contract:

```typescript
import ...

describe('Fireworks', () => {
 ...

    expect(deployResult.transactions).toHaveTransaction({
 ...
 });
});

it('should deploy', async () => {
    // The check is done inside beforeEach
    // blockchain and fireworks are ready to use
});
```

Run tests using the following command:

```bash
npx blueprint test
```

You can specify additional options and vmLogs using `blockchain.verbosity`:

```typescript
blockchain.verbosity = {
  ...blockchain.verbosity,
  blockchainLogs: true,
  vmLogs: "vm_logs_full",
  debugLogs: true,
  print: false,
};
```

## Direct unit tests

The Fireworks contract demonstrates different ways of sending messages in the TON Blockchain.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: "/img/docs/writing-test-examples/test-examples-schemes.svg?raw=true",
    dark: "/img/docs/writing-test-examples/test-examples-schemes-dark.svg?raw=true",
  }}
/>
<br></br>

When you deploy the contract with the `set_first` message and sufficient TON amount,
it automatically executes with primary and usable combinations of send modes.

The Fireworks contract redeploys itself, creating three entities, each with its ID and, as a result, a different smart contract address.

For clarity, define the Fireworks instances with different `state_init` by ID with the following names:

- **1 - Fireworks Setter**: This entity spreads different launch opcodes and can be extended to support up to four different opcodes.  
- **2 - Fireworks Launcher-1**: This Fireworks instance launches the first fireworks, sending messages to the launcher.  
- **3 - Fireworks Launcher-2**: This Fireworks instance launches the second fireworks, sending messages to the launcher.  

<details>  
    <summary>Expand details on transactions</summary>

**Index** refers to the ID of a transaction in the `launchResult` array.  

- **0**: An external request to the treasury sends an outbound message `op::set_first` with 2.5 TON to Fireworks.  
- **1**: The Fireworks Setter contract processes a transaction with `op::set_first`, sending two outbound messages to Fireworks Launcher-1 and Fireworks Launcher-2.  
- **2**: Fireworks Launcher-1 processes a transaction with `op::launch_first`, sending four outbound messages to the Launcher.  
- **3**: Fireworks Launcher-2 processes a transaction with `op::launch_second`, sending one outbound message to the Launcher.  
- **4**: The Launcher processes a transaction with an incoming message from Fireworks Launcher-1, sent with `send mode = 0`.  
- **5**: The Launcher processes a transaction with an incoming message from Fireworks Launcher-1, sent with `send mode = 1`.  
- **6**: The Launcher processes a transaction with an incoming message from Fireworks Launcher-1, sent with `send mode = 2`.  
- **7**: The Launcher processes a transaction with an incoming message from Fireworks Launcher-1, sent with `send mode = 128 + 32`.  
- **8**: The Launcher processes a transaction with an incoming message from Fireworks Launcher-2, sent with `send mode = 64`.  

</details>

Each "firework" is an outbound message with a unique message body, appearing in transactions with IDs 3 and 4.

Below is a list of tests for each transaction expected to execute successfully.

### Transaction ID:1 success test

[This test](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L75) verifies that the fireworks are successfully set by sending a transaction with a value of 2.5 TON.  
This is the simplest case, in which the main goal is to confirm that the transaction result's `success` property is `true`.  

To filter a specific transaction from the `launchResult.transactions` array, you can use the most convenient fields: `from`, `to`, and `op`. This combination retrieves only one transaction.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light:
      "/img/docs/writing-test-examples/test-examples-schemes_id1.svg?raw=true",
    dark: "/img/docs/writing-test-examples/test-examples-schemes_id1_dark.svg?raw=true",
  }}
/>
<br></br>

The transaction[ID:1] in the Fireworks Setter contract is invoked with `op::set_first`
and executes two outbound messages to Fireworks Launcher-1 and Fireworks Launcher-2.

```typescript
it("first transaction[ID:1] should set fireworks successfully", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  expect(launchResult.transactions).toHaveTransaction({
    from: launcher.address,
    to: fireworks.address,
    success: true,
    op: Opcodes.set_first,
 });
});
```

### Transaction ID:2 success test

[This test](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L92) checks if transaction[ID:2] executes successfully.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light:
      "/img/docs/writing-test-examples/test-examples-schemes_id2.svg?raw=true",
    dark: "/img/docs/writing-test-examples/test-examples-schemes_id2_dark.svg?raw=true",
  }}
/>
<br></br>

The transaction in Fireworks Launcher-1 is invoked with `op::launch_first` and executes
four outbound messages to the launcher.

```typescript
it("should exist a transaction[ID:2] which launches first fireworks successfully", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  expect(launchResult.transactions).toHaveTransaction({
    from: fireworks.address,
    to: launched_f1.address,
    success: true,
    op: Opcodes.launch_first,
    outMessagesCount: 4,
    destroyed: true,
    endStatus: "non-existing",
 });

  printTransactionFees(launchResult.transactions);
});
```

When a transaction affects the state of a contract, you can specify this using the `destroyed` and `endStatus` fields.

The complete list of account status-related fields includes:

- **`destroyed`**: `true` if the existing contract was destroyed due to executing a certain transaction. Otherwise, it is `false`.
- **`deploy`**: This custom Sandbox flag indicates whether the contract was deployed during this transaction. It is `true` if the contract was not initialized before this transaction and became initialized afterward. Otherwise, it is `false`.
- **`oldStatus`**: AccountStatus before transaction execution. Values: `'uninitialized'`, `'frozen'`, `'active'`, `'non-existing'`.
- **`endStatus`**: AccountStatus after transaction execution. Values: `'uninitialized'`, `'frozen'`, `'active'`, `'non-existing'`.

### Transaction ID:3 success test

[This test](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L113) checks if transaction[ID:3] executes successfully.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light:
      "/img/docs/writing-test-examples/test-examples-schemes_id3.svg?raw=true",
    dark: "/img/docs/writing-test-examples/test-examples-schemes_id3_dark.svg?raw=true",
  }}
/>
<br></br>

The transaction[ID:3] occurs in Fireworks Launcher-1, is invoked with `op::launch_first`,
and executes four outbound messages to the launcher.

```typescript
it("should exist a transaction[ID:3] which launches second fireworks successfully", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  expect(launchResult.transactions).toHaveTransaction({
    from: fireworks.address,
    to: launched_f2.address,
    success: true,
    op: Opcodes.launch_second,
    outMessagesCount: 1,
 });

  printTransactionFees(launchResult.transactions);
});
```

### Transaction ID:4 success test

[This test](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L133) checks if transaction[ID:4] executes successfully.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light:
      "/img/docs/writing-test-examples/test-examples-schemes_id4.svg?raw=true",
    dark: "/img/docs/writing-test-examples/test-examples-schemes_id4_dark.svg?raw=true",
  }}
/>
<br></br>

Transaction[ID:4] occurs in the Launcher with an incoming message from Fireworks Launcher-1. This message is sent with `send mode = 0` in the transaction[ID:2].

```typescript
it("should exist a transaction[ID:4] with a comment send mode = 0", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  expect(launchResult.transactions).toHaveTransaction({
    from: launched_f1.address,
    to: launcher.address,
    success: true,
    body: beginCell()
 .storeUint(0, 32)
 .storeStringTail("send mode = 0")
 .endCell(), // 0x00000000 comment opcode and encoded comment
 });
});
```

### Transaction ID:5 success test

[This test](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L152) checks if transaction[ID:5] executes successfully.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light:
      "/img/docs/writing-test-examples/test-examples-schemes_id5.svg?raw=true",
    dark: "/img/docs/writing-test-examples/test-examples-schemes_id5_dark.svg?raw=true",
  }}
/>
<br></br>

Transaction[ID:5] occurs in the launcher with an incoming message from Fireworks Launcher-1. This message is sent with `send mode = 1`.

```typescript
it("should exist a transaction[ID:5] with a comment send mode = 1", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  expect(launchResult.transactions).toHaveTransaction({
    from: launched_f1.address,
    to: launcher.address,
    success: true,
    body: beginCell()
 .storeUint(0, 32)
 .storeStringTail("send mode = 1")
 .endCell(), // 0x00000000 comment opcode and encoded comment
 });
});
```

### Transaction ID:6 success test

[This test](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L170) checks if transaction[ID:6] executes successfully.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light:
      "/img/docs/writing-test-examples/test-examples-schemes_id6.svg?raw=true",
    dark: "/img/docs/writing-test-examples/test-examples-schemes_id6_dark.svg?raw=true",
  }}
/>
<br></br>

Transaction[ID:6] occurs in the launcher with an incoming message from Fireworks Launcher-1. This message is sent with `send mode = 2`.

```typescript
it("should exist a transaction[ID:6] with a comment send mode = 2", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  expect(launchResult.transactions).toHaveTransaction({
    from: launched_f1.address,
    to: launcher.address,
    success: true,
    body: beginCell()
 .storeUint(0, 32)
 .storeStringTail("send mode = 2")
 .endCell(), // 0x00000000 comment opcode and encoded comment
 });
});
```

### Transaction ID:7 success test

[This test](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L188) checks if transaction[ID:7] executes successfully.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light:
      "/img/docs/writing-test-examples/test-examples-schemes_id7.svg?raw=true",
    dark: "/img/docs/writing-test-examples/test-examples-schemes_id7_dark.svg?raw=true",
  }}
/>
<br></br>

Transaction[ID:7] occurs in the launcher with an incoming message from Fireworks Launcher-1. This message is sent with `send mode = 128 + 32`.

```typescript
it("should exist a transaction[ID:7] with a comment send mode = 32 + 128", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  expect(launchResult.transactions).toHaveTransaction({
    from: launched_f1.address,
    to: launcher.address,
    success: true,
    body: beginCell()
 .storeUint(0, 32)
 .storeStringTail("send mode = 32 + 128")
 .endCell(), // 0x00000000 comment opcode and encoded comment
 });
});
```

### Transaction ID:8 success test

[This test](https://github.com/ton-community/fireworks-func/blob/main/tests/Fireworks.spec.ts#L188) checks if transaction[ID:8] executes successfully.

<br></br>
<ThemedImage
  alt=""
  sources={{
    light:
      "/img/docs/writing-test-examples/test-examples-schemes_id8.svg?raw=true",
    dark: "/img/docs/writing-test-examples/test-examples-schemes_id8_dark.svg?raw=true",
  }}
/>
<br></br>

Transaction[ID:8] occurs in the launcher with an incoming message from Fireworks Launcher-2. This message is sent with `send mode = 64`.

```typescript
it("should exist a transaction[ID:8] with a comment send mode = 64", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  expect(launchResult.transactions).toHaveTransaction({
    from: launched_f2.address,
    to: launcher.address,
    success: true,
    body: beginCell()
 .storeUint(0, 32)
 .storeStringTail("send_mode = 64")
 .endCell(), // 0x00000000 comment opcode and encoded comment
 });
});
```

## Printing and reading transaction fees

Reading details about fees during testing can help optimize the contract. The `printTransactionFees` function prints the entire transaction chain in a convenient format.

```typescript
it("should execute and print fees", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  console.log(printTransactionFees(launchResult.transactions));
});
```

For instance, in the case of `launchResult`, the following table will be printed:

| (index) | op           | valueIn        | valueOut       | totalFees      | outActions |
| ------- | ------------ | -------------- | -------------- | -------------- | ---------- |
| 0       | 'N/A'        | 'N/A'          | '2.5 TON'      | '0.010605 TON' | 1          |
| 1       | '0x5720cfeb' | '2.5 TON'      | '2.185812 TON' | '0.015836 TON' | 2          |
| 2       | '0x6efe144b' | '1.092906 TON' | '1.081142 TON' | '0.009098 TON' | 4          |
| 3       | '0xa2e2c2dc' | '1.092906 TON' | '1.088638 TON' | '0.003602 TON' | 1          |
| 4       | '0x0'        | '0.099 TON'    | '0 TON'        | '0.000309 TON' | 0          |
| 5       | '0x0'        | '0.1 TON'      | '0 TON'        | '0.000309 TON' | 0          |
| 6       | '0x0'        | '0.099 TON'    | '0 TON'        | '0.000309 TON' | 0          |
| 7       | '0x0'        | '0.783142 TON' | '0 TON'        | '0.000309 TON' | 0          |
| 8       | '0x0'        | '1.088638 TON' | '0 TON'        | '0.000309 TON' | 0          |

![](/img/docs/writing-test-examples/fireworks_trace_tonviewer.png?=RAW)

**Index** refers to the ID of a transaction in the `launchResult` array.

- **0**: External request to the treasury that results in a message `op::set_first` to Fireworks.
- **1**: The Fireworks transaction results in four messages to the launcher.
- **2**: Transaction on Launched Fireworks-1 from the Launcher, with a message sent using the `op::launch_first` opcode.
- **3**: Transaction on Launched Fireworks-2 from the Launcher, with a message sent using the `op::launch_second` opcode.
- **4**: Transaction on the Launcher with an incoming message from Launched Fireworks-1, sent with `send mode = 0`.
- **5**: Transaction on the Launcher with an incoming message from Launched Fireworks-1, sent with `send mode = 1`.
- **6**: Transaction on the Launcher with an incoming message from Launched Fireworks-1, sent with `send mode = 2`.
- **7**: Transaction on the Launcher with an incoming message from Launched Fireworks-1, sent with `send mode = 128 + 32`.
- **8**: Transaction on the Launcher with an incoming message from Launched Fireworks-2, sent with `send mode = 64`.

## Transaction fees tests

This test verifies whether the transaction fees for launching the fireworks are as expected. You can define custom assertions for different parts of the commission fees.

```typescript
it("should execute with expected fees", async () => {
  const launcher = await blockchain.treasury("launcher");
  const launchResult = await fireworks.sendDeployLaunch(
    launcher.getSender(),
    toNano("2.5")
 );

  // Total fee
  console.log("total fees = ", launchResult.transactions[1].totalFees);

  const tx1 = launchResult.transactions[1];
  if (tx1.description.type !== "generic") {
    throw new Error("Generic transaction expected");
 }

  // Compute fee
  const computeFee =
    tx1.description.computePhase.type === "vm"
      ? tx1.description.computePhase.gasFees
      : undefined;
  console.log("computeFee = ", computeFee);

  // Action fee
  const actionFee = tx1.description.actionPhase?.totalActionFees;
  console.log("actionFee = ", actionFee);

  if (computeFee == null || undefined || actionFee == null || undefined) {
    throw new Error("undefined fees");
 }

  // Check if Compute Phase and Action Phase fees exceed 1 TON
  expect(computeFee + actionFee).toBeLessThan(toNano("1"));
});
```

## Edge cases tests

This section provides test cases for TVM exit [codes](/v3/documentation/tvm/tvm-exit-codes) that can occur during transaction processing. These exit codes are part of the blockchain code itself. It is necessary to distinguish between exit codes during the [Compute Phase](/v3/documentation/tvm/tvm-overview#compute-phase) and the Action Phase.

The contract logic is executed during the Compute Phase. Various actions can be created while processing. These actions are processed in the next phase—the Action Phase. If the Compute Phase is unsuccessful, the Action Phase does not start. However, a successful Compute Phase does not guarantee that the Action Phase will also succeed.

### Compute Phase | exit code = 0

This exit code indicates that the Compute Phase of the transaction was completed successfully.

### Compute Phase | exit code = 1

An alternative exit code for denoting the success of the Compute Phase is `1`. To trigger this exit code, use the [RETALT](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L20) opcode.

This opcode must be called in the main function (e.g., `recv_internal`). If called in another function, the exit from that function will be `1`, but the total exit code will be `0`.

### Compute Phase | exit code = 2

TVM is a [stack machine](/v3/documentation/tvm/tvm-overview#tvm-as-a-stack-machine). When interacting with different values, the system places them on the stack. If an opcode requires elements from the stack but finds it empty, the system throws this error.

This issue can arise when working directly with opcodes, as [stdlib.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) assumes this problem will not occur. 

### Compute Phase | exit code = 3

Before execution, the system converts any code into a `continuation`. This special data type includes a slice with code, a stack, registers, and other data required for code execution. If needed, you can run this continuation later, passing the necessary parameters to initialize the stack's state.  

First, we [build](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L31-L32) such a continuation. In this case, it is an empty continuation that does nothing. Next, using the opcode `0 SETNUMARGS`, we indicate that no values should be on the stack at the start of execution. Then, we call the continuation using the opcode `1 -1 SETCONTARGS`, passing one value. Since there should have been no values, we get a StackOverflow error.

### Compute Phase | exit code = 4

In TVM, `integer` values can range from -2<sup>256</sup> < x < 2<sup>256</sup>. If a value exceeds this range during calculation, exit code 4 is thrown.

### Compute Phase | exit code = 5

If an `integer` value exceeds the expected range, exit code 5 is thrown. For example, if a negative value is used in the `.store_uint()` function.

### Compute Phase | exit code = 6

At a lower level, opcodes are used instead of familiar function names. In HEX form, these opcodes can be seen in [this table](/v3/documentation/tvm/instructions). In this example, we [use](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L25) `@addop`, which adds a non-existent opcode.

When attempting to process this opcode, the emulator does not recognize it and throws exit code 6.

### Compute Phase | exit code = 7

This is a common error that occurs when receiving the wrong data type. In this [example](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L79-L80), the `tuple` contained three elements, but an attempt was made to unpack four.

There are many other cases where this error is thrown, such as:

- [Not a null](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L433)
- [Not an integer](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L441)
- [Not a cell](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L478)
- [Not a cell builder](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L500)
- [Not a cell slice](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L509)
- [Not a string](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L518)
- [Not a bytes chunk](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L527)
- [Not a continuation](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L536)
- [Not a box](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L545)
- [Not a tuple](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L554)
- [Not an atom](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/stack.cpp#L598)

### Compute Phase | exit code = 8

All data in TON is stored in [cells](/v3/documentation/data-formats/tlb/cell-boc#cell). A cell can store up to 1023 bits of data and four references to other cells. If you attempt to write more than 1023 bits or more than four references, exit code 8 is thrown.

### Compute Phase | exit code = 9

If you attempt to read more data from a slice than it contains, the system throws exit code 9. For example, this occurs if you try to read 11 bits from a slice containing only 10 bits or attempt to load a reference when no references exist.

### Compute Phase | exit code = 10

This error is thrown when working with [dictionaries](/v3/documentation/smart-contracts/func/docs/stdlib/#dictionaries-primitives). For example, if the value associated with a key [is stored in another cell](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L100-L110) as a reference, you must use the `.udict_get_ref()` function to retrieve the value.

However, the reference to another cell [should only be one](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/dict.cpp#L454), not two, as in this example:

```
root_cell
├── key
│   ├── value
│   └── value - second reference for one key
└── key
 └── value
```

This is why attempting to read the value results in exit code 10.

**Additional:** You can also store the value next to the key in the dictionary:

```
root_cell
├── key-value
└── key-value
```

**Note:** The actual structure of the dictionary is more complex than shown in the examples above. These examples are simplified for clarity.

### Compute Phase | exit code = 11

This error occurs when something unknown happens. For example, when using the [SENDMSG](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07#sending-messages) opcode, if you pass the [wrong](https://github.com/ton-community/fireworks-func/blob/ef49b4da12d287a8f6c2b6f0c19d65814c1578fc/contracts/fireworks.fc#L116) (e.g., empty) cell with a message, this error occurs.

It also occurs when attempting to call a non-existent method. Developers often encounter this when calling a non-existent GET method.

### Compute Phase | exit code = -14 (13)

The system throws this error if there is insufficient TON to handle the Compute Phase. In the `Excno` enum class, which defines exit codes for various Compute Phase errors, [the value 13 is specified](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/vm/excno.hpp#L39).  

However, during processing, the system applies the [NOT operation](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L1574) to this value, changing it to `-14`. This ensures that the exit code cannot be faked using functions like `throw`, as these functions only accept positive values for exit codes. 

### Action Phase | exit code = 32

The Action Phase starts after the Compute Phase and processes actions stored in [register c5](/v3/documentation/tvm/tvm-initialization#control-register-c5) during the Compute Phase. If the system detects incorrect data in this register, it throws exit code 32.  

### Action Phase | exit code = 33

Currently, a maximum of `255` actions can be included in one transaction. The Action Phase ends with exit code 33 if this limit is exceeded.

### Action Phase | exit code = 34

This exit code covers most errors when working with actions, such as invalid messages or incorrect actions.

### Action Phase | exit code = 35

You must specify the correct source address when building a message's [CommonMsgInfo](/v3/guidelines/smart-contracts/howto/wallet#commonmsginfo) part. It must be either [addr_none](/v3/documentation/data-formats/tlb/msg-tlb#addr_none00) or the address of the account sending the message.

In the blockchain code, this is handled by [check_replace_src_addr](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L1985).

### Action Phase | exit code = 36

If the destination address is invalid, exit code 36 is thrown. Possible reasons include a non-existent workchain or an incorrect address. All checks can be seen in [check_rewrite_dest_addr](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L2014-L2113).

### Action Phase | exit code = 37

This exit code is similar to `-14` in the Compute Phase. It indicates insufficient balance to send the specified amount of TON.

### Action Phase | exit code = 38

This is similar to exit code `37` but refers to insufficient [ExtraCurrency](/v3/documentation/infra/minter-flow#extracurrency) balance.

### Action Phase | exit code = 40

If there is enough TON to process part of a message (e.g., 5 cells) but the message contains 10 cells, exit code 40 is thrown.

### Action Phase | exit code = 43

This error may occur if the maximum number of cells in the library is exceeded or the maximum depth of the Merkle tree is exceeded.

A library is a cell stored in [MasterChain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#masterchain-blockchain-of-blockchains) and can be used by all smart contracts if it is [public](https://github.com/ton-blockchain/ton/blob/9728bc65b75defe4f9dcaaea0f62a22f198abe96/crypto/block/transaction.cpp#L1844).

:::info  
Since the order of lines may change when updating the code, some links may become outdated. Therefore, all links reference the code base at commit [9728bc65b75defe4f9dcaaea0f62a22f198abe96](https://github.com/ton-blockchain/ton/tree/9728bc65b75defe4f9dcaaea0f62a22f198abe96).  
:::

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/business/ton-connect-for-business.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/business/ton-connect-for-business.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON Connect for business

TON Connect is built to be customizable for businesses by offering powerful features that attract traffic and increase user retention.

## Product features

- secure and private authentication with controlled personal data disclosure
- arbitrary transaction signing on TON within a single user session
- instant connectivity between applications and user wallets
- automatic application availability directly within wallets

## Adopting TON Connect

### Basic steps

In order for developers to integrate TON Connect into their applications the specialized TON Connect SDK is used. The process is quite simple and can be performed by accessing the correct documentation when needed.

TON Connect allows users to connect their applications with numerous wallets via a QR code or universal connectivity link. Apps can also be opened within a wallet using a built-in browser extension and it is critical to keep up to date with additional features that are added to TON Connect moving forward.

### Common implementation cases

By using the [TON Connect SDK](https://github.com/ton-connect/sdk), detailed instructions to integrate TON Connect allows developers to:
- connect their applications with carious TON wallet types
- backend login via the corresponding wallet's address
- sending request transactions and in-wallet signing(accepting requests)

To gain a better understand of what is possible with this solution, check out our demo app that is available on GitHub: [https://github.com/ton-connect/](https://github.com/ton-connect/demo-dapp)

### Currently supported technology stack:

- all web applications — serverless and backends
- React-Native mobile apps
- SDK for mobile applications in Swift, Java, Kotlin

TON Connect is an open protocol and can be used to develop DApps with any programming language or development environment.

For JavaScript (JS) applications, the TON developer community created a JavaScript SDK that allows developers to integrate TON Connect seamlessly in minutes. SDKs designed to operate with additional programming languages will be available in the future.

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/business/ton-connect-for-security.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/business/ton-connect-for-security.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON Connect for security

TON Connect ensures that users have explicit control over the data they share, meaning data is not susceptible to leakage during app and wallet transfer. To reinforce this design, wallets and apps employ strong cryptographic authentication systems that work together.

## User data and funds security

- On TON Connect, user data is end-to-end encrypted when transmitted to wallets via bridges. This allows apps and wallets to employ third-party bridge servers that decrease the possibility of data theft and manipulation, dramatically increasing data integrity and safety.
- Through TON Connect, security parameters are implemented to allow users' data to be directly authenticated with their wallet address. This will enable users to use multiple wallets and choose which one is used within a particular app.
- The TON Connect protocol allows for sharing personal data items (such as contact details and KYC info, etc.), meaning the user explicitly confirms sharing such data.

Specific details and related code examples about TON Connect and its underlying security-focused design can be found via [TON Connect GitHub](https://github.com/ton-connect/).

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/frameworks/react.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/frameworks/react.mdx
================================================
import Feedback from '@site/src/components/Feedback';


# TON Connect for React

The recommended SDK for React Apps is a [UI React SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-react). It is a React component that provides a high-level way to interact with TON Connect.

## Implementation

### Installation

To start integrating TON Connect into your dApp, you need to install the `@tonconnect/ui-react` package:

```bash npm2yarn
npm i @tonconnect/ui-react
```

### TON Connect initiation


After installing the package, you should create a `manifest.json` file for your application. More information on creating a manifest.json file can be found [here](/v3/guidelines/ton-connect/guidelines/creating-manifest).

After creating the manifest file, import TonConnectUIProvider to the root of your Mini App and pass the manifest URL:

```tsx
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export function App() {
    return (
        <TonConnectUIProvider manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json">
            { /* Your app */ }
        </TonConnectUIProvider>
    );
}

```

### Connect to the wallet

Add the `TonConnectButton`. 
```tsx
export const Header = () => {
  return (
    <header>
      <span>My App with React UI</span>
      <TonConnectButton />
    </header>
  );
};
```
The `TonConnectButton` is a universal UI component for initializing a connection. After the wallet is connected, it transforms into a wallet menu. Prefer to place the **Connect** button in the top right corner of your app.

You can add the `className` and style props to the button:

```js
<TonConnectButton className="my-button-class" style={{ float: "right" }}/>
```
Note that you cannot pass a child to the `TonConnectButton`.

You can always initiate the connection manually using the  `useTonConnectUI` hook and [openModal](https://github.com/ton-connect/sdk/tree/main/packages/ui#open-connect-modal) method.

```tsx
export const Header = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  return (
    <header>
      <span>My App with React UI</span>
      <button onClick={() => tonConnectUI.openModal()}>
        Connect Wallet
      </button>
    </header>
  );
};
```

#### Connect with a specific wallet
To open a modal window for a specific wallet, use the `openSingleWalletModal()` method. This method takes the wallet's `app_name` as a parameter (refer to the [wallets-list.json](https://github.com/ton-blockchain/wallets-list/blob/main/wallets-v2.json) file) and opens the corresponding wallet modal. It returns a promise that resolves once the modal window opens successfully.

```tsx
<button onClick={() => tonConnectUI.openSingleWalletModal('tonwallet')}>
  Connect Wallet
</button>
```

### Redirects

If you want to redirect the user to a specific page after wallet connection, you can use the `useTonConnectUI` hook and [customize your return strategy](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-the-return-strategy).

#### Telegram Mini Apps

If you want to redirect the user to a [Telegram Mini App](/v3/guidelines/dapps/tma/overview) after wallet connection, you can customize the `TonConnectUIProvider` element:

```tsx
      <TonConnectUIProvider
            // ... other parameters
          actionsConfiguration={{
              twaReturnUrl: 'https://t.me/<YOUR_APP_NAME>'
          }}
      >
      </TonConnectUIProvider>
```

[Open example on GitHub](https://github.com/ton-connect/demo-dapp-with-wallet/blob/master/src/App.tsx)

### UI customization

To [customize UI](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation) of the modal, you can use the `useTonConnectUI` hook and the `setOptions` function. See more about the `useTonConnectUI` hook in the [Hooks](#hooks) section.

## Hooks

If you want to use some low-level TON Connect UI SDK features in your React app, you can use hooks from the `@tonconnect/ui-react` package.

### useTonAddress

Use it to get the user's current TON wallet address. Pass the boolean parameter `isUserFriendly` to choose the address format, where the `isUserFriendly` is `true` by default. The hook will return an empty string if the wallet is not connected.


```tsx
import { useTonAddress } from '@tonconnect/ui-react';

export const Address = () => {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);

  return (
    userFriendlyAddress && (
      <div>
        <span>User-friendly address: {userFriendlyAddress}</span>
        <span>Raw address: {rawAddress}</span>
      </div>
    )
  );
};
```

### useTonConnectModal
Use this hook to access the functions for opening and closing the modal window. The hook returns an object with the current modal state and methods to open and close the modal.

```tsx
import { useTonConnectModal } from '@tonconnect/ui-react';

export const ModalControl = () => {
    const { state, open, close } = useTonConnectModal();

    return (
      <div>
          <div>Modal state: {state?.status}</div>
          <button onClick={open}>Open modal</button>
          <button onClick={close}>Close modal</button>
      </div>
    );
};
```

### useTonWallet

Use this hook to retrieve the user's current TON wallet.
The hook will return `null` if the wallet is not connected. The `wallet` object provides common data such as the user's address, provider, [TON proof](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users), and other attributes (see the [Wallet interface](https://ton-connect.github.io/sdk/interfaces/_tonconnect_sdk.Wallet.html)).

Additionally, you can access more specific details about the connected wallet, such as its name, image, and other attributes (refer to the [WalletInfo interface](https://ton-connect.github.io/sdk/types/_tonconnect_sdk.WalletInfo.html)).


```tsx
import { useTonWallet } from '@tonconnect/ui-react';

export const Wallet = () => {
  const wallet = useTonWallet();

  return (
    wallet && (
      <div>
        <span>Connected wallet address: {wallet.account.address}</span>
        <span>Device: {wallet.device.appName}</span>
        <span>Connected via: {wallet.provider}</span>
        {wallet.connectItems?.tonProof?.proof && <span>Ton proof: {wallet.connectItems.tonProof.proof}</span>}

        <div>Connected wallet info:</div>
        <div>
          {wallet.name} <img src={wallet.imageUrl} />
        </div>
      </div>
    )
  );
};

```

### useTonConnectUI

Access the `TonConnectUI` instance and update the UI options function.

[See more about TonConnectUI instance methods](https://github.com/ton-connect/sdk/tree/main/packages/ui#send-transaction)

[See more about the `setOptions` function](https://github.com/ton-connect/sdk/tree/main/packages/ui#change-options-if-needed)


```tsx
import { Locales, useTonConnectUI } from '@tonconnect/ui-react';

export const Settings = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  const onLanguageChange = (language: Locales) => {
    setOptions({ language });
  };

  return (
    <div>
      <label>language</label>
      <select onChange={(e) => onLanguageChange(e.target.value as Locales)}>
        <option value="en">en</option>
        <option value="ru">ru</option>
      </select>
    </div>
  );
};
```

### useIsConnectionRestored
`useIsConnectionRestored` indicates the current status of the connection restoring process.
You can use it to detect when the connection restoring process is finished.

```tsx
import { useIsConnectionRestored } from '@tonconnect/ui-react';

export const EntrypointPage = () => {
  const connectionRestored = useIsConnectionRestored();

  if (!connectionRestored) {
    return <Loader>Please wait...</Loader>;
  }

  return <MainPage />;
};
```

## Usage

Let's look at how to use the React UI SDK in practice.

### Sending transactions

Send Toncoins to a specific address:

```js
import { useTonConnectUI } from '@tonconnect/ui-react';

const transaction: SendTransactionRequest = {
  validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
  messages: [
    {
      address:
        "0QD-SuoCHsCL2pIZfE8IAKsjc0aDpDUQAoo-ALHl2mje04A-", // message destination in user-friendly format
      amount: "20000000", // Toncoin in nanotons
    },
  ],
};

export const Settings = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  return (
    <div>
      <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
        Send transaction
      </button>
    </div>
  );
};

```
:::tip
Get more examples on the [Preparing messages](/v3/guidelines/ton-connect/guidelines/preparing-messages) page.
:::

### Understanding transaction status by hash

Learn the principle explained in [payment processing](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions) using the tonweb library.

### Optional check on the backend: ton_proof

:::tip
Understand how to sign and verify messages: [Signing and verification](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users)
:::

To ensure that the user truly owns the declared address, you can use `ton_proof`.

Use the `tonConnectUI.setConnectRequestParameters` function to set up your connection request parameters. You can use it for:
- Loading State: Show a loading state while waiting for a response from your backend.
- Ready State with tonProof: Set the state to 'ready' and include the tonProof value.
- If an error occurs, remove the loader and create the connect request without additional parameters.

```ts
const [tonConnectUI] = useTonConnectUI();

// Set loading state
tonConnectUI.setConnectRequestParameters({ state: "loading" });

// Fetch tonProofPayload from the backend
const tonProofPayload: string | null =
  await fetchTonProofPayloadFromBackend();

if (tonProofPayload) {
  // Set ready state with tonProof
  tonConnectUI.setConnectRequestParameters({
    state: "ready",
    value: { tonProof: tonProofPayload },
  });
} else {
  // Remove loader
  tonConnectUI.setConnectRequestParameters(null);
}
```

#### Handling ton_proof result

You can find the `ton_proof` result in the `wallet` object when the wallet is connected:

```ts
useEffect(() => {
    tonConnectUI.onStatusChange((wallet) => {
      if (
        wallet.connectItems?.tonProof &&
        "proof" in wallet.connectItems.tonProof
      ) {
        checkProofInYourBackend(
          wallet.connectItems.tonProof.proof,
          wallet.account.address
        );
      }
    });
  }, [tonConnectUI]);
```

#### Structure of ton_proof

```ts
type TonProofItemReplySuccess = {
  name: "ton_proof";
  proof: {
    timestamp: string; // Unix epoch time (seconds)
    domain: {
      lengthBytes: number; // Domain length
      value: string;  // Domain name
    };
    signature: string; // Base64-encoded signature
    payload: string; // Payload from the request
  }
}
```

You can find an example of authentication on this [page](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users#react-example).

### Wallet disconnection

Call to disconnect the wallet:
```js
const [tonConnectUI] = useTonConnectUI();

await tonConnectUI.disconnect();
```

#### Deploying contract

Deploying a contract using TON Connect is pretty straightforward. You must:

- Obtain the contract `code` and `data`
- Store them as a `stateInit` cell
- Send a transaction using the `statement` field provided

Note that `CONTRACT_CODE` and `CONTRACT_INIT_DATA` may be found in wrappers.

```typescript
import { beginCell, Cell, contractAddress, StateInit, storeStateInit } from '@ton/core';

const [tonConnectUI] = useTonConnectUI();

const init = {
    code: Cell.fromBase64('<CONTRACT_CODE>'),
    data: Cell.fromBase64('<CONTRACT_INIT_DATA>')
} satisfies StateInit;

const stateInit = beginCell()
    .store(storeStateInit(init))
    .endCell();

const address = contractAddress(0, init);

await tonConnectUI.sendTransaction({
    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
    messages: [
        {
            address: address.toRawString(),
            amount: '5000000',
            stateInit: stateInit.toBoc().toString('base64')
        }
    ]
});

```

## Wrappers

Wrappers are classes that simplify interaction with the contract, allowing you to work without concerning yourself with the underlying details.

- When developing a contract in FunC, write the wrapper yourself.
- When using the [Tact language](https://docs.tact-lang.org), wrappers are automatically generated for you.

:::tip
Check out the [Blueprint](https://github.com/ton-org/blueprint) documentation how to develop and deploy contracts
:::

Let's take a look at the default `Blueprint` counter wrapper example and how we can use it:

<details>
<summary>Wrapper usage</summary>
Counter wrapper class:

```ts
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type CounterConfig = {
    id: number;
    counter: number;
};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell().storeUint(config.id, 32).storeUint(config.counter, 32).endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
};

export class Counter implements contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Counter(address);
    }

    static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
        const data = counterConfigToCell(config);
        const init = { code, data };
        return new Counter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }
}

```

Then you can use this class in your react component:

```ts

import "buffer";
import {
  TonConnectUI,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import {
  Address,
  beginCell,
  Sender,
  SenderArguments,
  storeStateInit,
  toNano,
  TonClient,
} from "@ton/ton";

class TonConnectProvider implements Sender {
  /**
   * The TonConnect UI instance.
   * @private
   */
  private readonly provider: TonConnectUI;

  /**
   * The address of the current account.
   */
  public get address(): Address | undefined {
    const address = this.provider.account?.address;
    return address ? Address.parse(address) : undefined;
  }

  /**
   * Creates a new TonConnectProvider.
   * @param provider
   */
  public constructor(provider: TonConnectUI) {
    this.provider = provider;
  }

  /**
   * Sends a message using the TonConnect UI.
   * @param args
   */
  public async send(args: SenderArguments): Promise<void> {
    // The transaction is valid for 10 minutes.
    const validUntil = Math.floor(Date.now() / 1000) + 600;

    // The recipient's address should be in bounceable format for all smart contracts.
    const address = args.to.toString({ urlSafe: true, bounceable: true });

    // The address of the sender, if available.
    const from = this.address?.toRawString();

    // The amount to send in nano tokens.
    const amount = args.value.toString();

    // The state init cell for the contract.
    let stateInit: string | undefined;
    if (args.init) {
      // State init cell for the contract.
      const stateInitCell = beginCell()
        .store(storeStateInit(args.init))
        .endCell();
      // Convert the state init cell to boc base64.
      stateInit = stateInitCell.toBoc().toString("base64");
    }

    // The payload for the message.
    let payload: string | undefined;
    if (args.body) {
      // Convert the message body to boc base64.
      payload = args.body.toBoc().toString("base64");
    }

    // Use the TonConnect UI to send the message and wait for the sending
    await this.provider.sendTransaction({
      validUntil: validUntil,
      from: from,
      messages: [
        {
          address: address,
          amount: amount,
          stateInit: stateInit,
          payload: payload,
        },
      ],
    });
  }
}

const CONTRACT_ADDRESS = "EQAYLhGmznkBlPxpnOaGXda41eEkliJCTPF6BHtz8KXieLSc";

const getCounterInstance = async () => {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  });

  // OR you can use createApi from @ton-community/assets-sdk
  // import {
  //   createApi,
  // } from "@ton-community/assets-sdk";

  // const NETWORK = "testnet";
  // const client = await createApi(NETWORK);


  const address = Address.parse(CONTRACT_ADDRESS);
  const counterInstance = client.open(Counter.createFromAddress(address));

  return counterInstance;
};

export const Header = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();

  const increaseCount = async () => {
    const counterInstance = await getCounterInstance();
    const sender = new TonConnectProvider(tonConnectUI);

    await counterInstance.sendIncrease(sender, {
      increaseBy: 1,
      value: toNano("0.05"),
    });
  };

  const getCount = async () => {
    const counterInstance = await getCounterInstance();

    const count = await counterInstance.getCounter();
    console.log("count", count);
  };

  return (
    <main>
      {!wallet && (
        <button onClick={() => tonConnectUI.openModal()}>Connect Wallet</button>
      )}
      {wallet && (
        <>
          <button onClick={increaseCount}>Increase count</button>
          <button onClick={getCount}>Get count</button>
        </>
      )}
    </main>
  );
};

```
</details>


### Wrappers for jettons and NFTs

To interact with jettons or NFTs, you can use [assets-sdk](https://github.com/ton-community/assets-sdk).
This SDK provides wrappers that simplify interaction with these assets. Please check our [examples](https://github.com/ton-community/assets-sdk/tree/main/examples) section for practical examples.

## API documentation

[Latest API documentation](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)


## Examples

* Step-by-step [TON Hello World guide](https://helloworld.tonstudio.io/03-client/) to create a simple dApp with React UI.
* [Demo dApp](https://github.com/ton-connect/demo-dapp-with-react-ui) - Example of a dApp with `@tonconnect/ui-react`.
* [ton.vote](https://github.com/orbs-network/ton-vote) - Example of React website with TON Connect implementation.


## See also

- [TON Connect for Vue apps](/v3/guidelines/ton-connect/frameworks/vue)
- [TON Connect for HTML/JS apps](/v3/guidelines/ton-connect/frameworks/web)

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/frameworks/vue.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/frameworks/vue.mdx
================================================
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Feedback from '@site/src/components/Feedback';

# TON Connect for Vue

The recommended SDK for Vue Apps is a [UI Vue SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-vue). A Vue component provides a high-level way to interact with TON Connect.

## Implementation

### Installation

To start integrating TON Connect into your dApp, install the `@townsquarelabs/ui-vue` package. You can use npm or yarn for this purpose:

```bash npm2yarn
npm i @townsquarelabs/ui-vue
```

### Use TonConnectUIPlugin

Use TonConnectUIPlugin before mounting the app. You can specify UI options using plugin options.
:::tip
[See all available options](https://github.com/TownSquareXYZ/tonconnect-ui-vue/blob/ff8cbb66aa30b7c29ac1a1f76c96ebef91700ff3/src/utils/UIProvider.ts#L9).
:::

<Tabs groupId="TonConnectUIPlugin">
  <TabItem value="For Vue@3" label="For Vue@3">
  ```html
  import { createApp } from 'vue'
  import { TonConnectUIPlugin } from '@townsquarelabs/ui-vue'

  import App from './App.vue'

  const app = createApp(App)
  app
    .use(TonConnectUIPlugin,{ manifestUrl: "https://<YOUR_APP_URL>/tonconnect-manifest.json" })
    .mount('#app')
  ```
  </TabItem>
  <TabItem value="For Vue@2.7" label="For Vue@2.7">
  ```html
  import Vue from 'vue'
  import { TonConnectUIPlugin } from '@townsquarelabs/ui-vue'

  import App from './App.vue'

  Vue.use(TonConnectUIPlugin, {
    manifestUrl: "https://<YOUR_APP_URL>/tonconnect-manifest.json"
  });

  new Vue({
    render: (h) => h(App)
  }).$mount('#app')
  ```
  </TabItem>
</Tabs>

### Connect to the wallet
`TonConnectButton` is a universal UI component for initializing connection. After the wallet is connected, it transforms into a wallet menu.
You should place it in the top right corner of your app.

```html
<template>
  <header>
    <span>My App with Vue UI</span>
    <TonConnectButton/>
  </header>
</template>

<script>
import { TonConnectButton } from '@townsquarelabs/ui-vue';

export default {
  components: {
    TonConnectButton
  }
}
</script>
```

You can add `buttonRootId` props to the button as well. 

```ts
<TonConnectButton button-root-id="button-root-id" />
```

You can also add `class` and `style` props to the button. Note that you cannot pass a child to the `TonConnectButton`.

```ts
<TonConnectButton class="my-button-class" :style="{ float: 'right' }"/>
```

### Redirects

If you want to redirect the user to a specific page after wallet connection, you can use the `useTonConnectUI` hook and [customize your return strategy](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-the-return-strategy).

#### Telegram Mini Apps

If you want to redirect the user to a [Telegram Mini App](/v3/guidelines/dapps/tma/overview) after wallet connection, you can customize the `TonConnectUIProvider` element:

```html
<template>
  <!-- Your app -->
</template>

<script>
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

export default {
  name: 'SetRedirect',
  setup() {
    const {tonConnectUI, setOptions} = useTonConnectUI();
    setOptions({ actionsConfiguration: { twaReturnUrl: 'https://t.me/<YOUR_APP_NAME>' } });
  }
};
</script>
```

[Read more in SDK documentation](https://github.com/ton-connect/sdk/tree/main/packages/ui#use-inside-twa-telegram-web-app)

### UI customization

To [customize UI](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation) of the modal, you can use the `useTonConnectUI` hook and the `setOptions` function. See more about the `useTonConnectUI` hook in the [Hooks](#usetonconnectui) section.


## Hooks

### useTonAddress
Use it to get the user's current ton wallet address. Pass the boolean parameter `isUserFriendly` to choose the address format. The hook will return an empty string if the wallet is not connected.

```html
<template>
  <div v-if="address">
    <span>User-friendly address: {{ userFriendlyAddress }}</span>
    <span>Raw address: {{ rawAddress }}</span>
  </div>
</template>

<script>
import { useTonAddress } from '@townsquarelabs/ui-vue';

export default {
  setup() {
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);

    return {
      userFriendlyAddress,
      rawAddress
    }
  }
}
</script>
```

### useTonWallet
Use it to get the user's current ton wallet. If the wallet is not connected, the hook will return null.

```html
<template>
  <div v-if="wallet">
    <span>Connected wallet: {{ wallet.name }}</span>
    <span>Device: {{ wallet.device.appName }}</span>
  </div>
</template>

<script>
import { useTonWallet } from '@townsquarelabs/ui-vue';

export default {
  setup() {
    const wallet = useTonWallet();

    return {
      wallet
    }
  }

}
</script>
```

### useTonConnectModal

Use this hook to access the functions for opening and closing the modal window. The hook returns an object with the current modal state and methods to open and close the modal.

```html
<template>
  <div>
    <div>Modal state: {{ state?.status }}</div>
    <button @click="open">Open modal</button>
    <button @click="close">Close modal</button>
  </div>
</template>

<script>
import { useTonConnectModal } from '@townsquarelabs/ui-vue';

export default {
  setup() {
    const { state, open, close } = useTonConnectModal();
    return { state, open, close };
  }
};
</script>
```

### useTonConnectUI
Use it to get access to the `TonConnectUI` instance and UI options updating function.

<details>
  <summary><b>Show the example</b></summary>
```html
<template>
  <div>
    <button @click="sendTransaction">Send transaction</button>
    <div>
      <label>language</label>
      <select @change="onLanguageChange($event.target.value)">
        <option value="en">en</option>
        <option value="ru">ru</option>
        <option value="zh">zh</option>
      </select>
    </div>
  </div>
</template>

<script>
import { Locales, useTonConnectUI } from '@townsquarelabs/ui-vue';

export default {
  name: 'Settings',
  setup() {
    const {tonConnectUI, setOptions} = useTonConnectUI();

    const onLanguageChange = (lang) => {
      setOptions({ language: lang as Locales });
    };

    const myTransaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [
        {
          address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
          amount: "20000000",
          // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
        },
        {
          address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
          amount: "60000000",
          // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
        }
      ]
    }

    const sendTransaction = () => {
      tonConnectUI.sendTransaction(myTransaction);
    };

    return { onLanguageChange, sendTransaction };
  }
};
</script>
```


</details>

or

```ts 
<script lang="ts">
import { TonConnectUI, useTonWallet, tonConnectUIKey } from "@townsquarexyz/ui-vue";
const tonConnectUI = inject<TonConnectUI | null>(tonConnectUIKey, null);
</script>
```

[See more about TonConnectUI instance methods](https://github.com/ton-connect/sdk/tree/main/packages/ui#send-transaction)

[See more about the `setOptions` function](https://github.com/ton-connect/sdk/tree/main/packages/ui#change-options-if-needed)


### useIsConnectionRestored
`useIsConnectionRestored` indicates the current status of the connection restoring process.
You can use it to detect when the connection restoring process is finished.

```html
<template>
  <div>
    <div v-if="!connectionRestored">Please wait...</div>
    <MainPage v-else />
  </div>
</template>

<script>
import { useIsConnectionRestored } from '@townsquarelabs/ui-vue';

export default {
  name: 'EntrypointPage',
  setup() {
    const connectionRestored = useIsConnectionRestored();
    return { connectionRestored };
  }
};
</script>
```


## Usage

Let's take a look at how to use the Vue UI SDK in practice.

### Sending transactions

Send Toncoins to a specific address:

```html
<template>
  <div>
    <button @click="sendTransaction">Send transaction</button>
  </div>
</template>

<script>
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

export default {
  name: 'Settings',
  setup() {
    const { tonConnectUI } = useTonConnectUI();

    const myTransaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [
        {
          address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
          amount: "20000000",
          // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
        },
        {
          address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
          amount: "60000000",
          // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
        }
      ]
    }

    const sendTransaction = () => {
      tonConnectUI.sendTransaction(myTransaction);
    };

    return { sendTransaction };
  }
};
</script>
```
### Understanding transaction status by hash

Learn the principle explained in [payment processing](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions) using the tonweb library.

### Add connect request parameters: ton_proof

:::tip
Understand how to sign and verify messages: [Signing and Verification](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users)
:::

Use the `tonConnectUI.setConnectRequestParameters` function to pass your connect request parameters.

This function takes one parameter:

#### loading
Set state to `'loading'` while waiting for your backend's response. If a user opens the connect wallet modal, he will see a loader.
```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const { tonConnectUI } = useTonConnectUI();

tonConnectUI.setConnectRequestParameters({
    state: 'loading'
});
```

#### ready

Set the state to `'ready'` and define the `tonProof` value. Apply the parameters passed to the connect request using QR and a universal link.

```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const { tonConnectUI } = useTonConnectUI();

tonConnectUI.setConnectRequestParameters({
    state: 'ready',
    value: {
        tonProof: '<your-proof-payload>'
    }
});
```

#### remove loading

Remove the loader if enabled via `state: 'loading'`. For example, if you received an error instead of a response from your backend. 

Connect requests will be created without any additional parameters.

```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const { tonConnectUI } = useTonConnectUI();

tonConnectUI.setConnectRequestParameters(null);
```


You can call `tonConnectUI.setConnectRequestParameters` multiple times if your tonProof payload has a bounded lifetime. For instance, you can refresh connect request parameters every 10 minutes.


```ts
import { ref } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const { tonConnectUI } = useTonConnectUI();

// enable ui loader
tonConnectUI.setConnectRequestParameters({ state: 'loading' });

// fetch you tonProofPayload from the backend
const tonProofPayload: string | null = await fetchTonProofPayloadFromBackend();

if (!tonProofPayload) {
    // remove loader, connect request will be without any additional parameters
    tonConnectUI.setConnectRequestParameters(null);
} else {
    // add tonProof to the connect request
    tonConnectUI.setConnectRequestParameters({
        state: "ready",
        value: { tonProof: tonProofPayload }
    });
}

```


You can find the `ton_proof` result in the `wallet` object when the wallet is connected:

```ts
import { ref, onMounted } from 'vue';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const { tonConnectUI } = useTonConnectUI();

onMounted(() =>
    tonConnectUI.onStatusChange(wallet => {
        if (wallet.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
            checkProofInYourBackend(wallet.connectItems.tonProof.proof, wallet.account);
        }
}));
```

### Wallet disconnection

Call to disconnect the wallet:
```js
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

const { tonConnectUI } = useTonConnectUI();

await tonConnectUI.disconnect();
```

## Troubleshooting

### Animations not working

If you are experiencing issues with animations not working in your environment, it might be due to a lack of support for the Web Animations API. To resolve this issue, you can use the `web-animations-js` polyfill.

#### Using npm

To install the polyfill, run the following command:

```shell
npm install web-animations-js
```

Then, import the polyfill into your project:

```typescript
import 'web-animations-js';
```

#### Using CDN

Alternatively, you can include the polyfill via CDN by adding the following script tag to your HTML:

```html
<script src="https://www.unpkg.com/web-animations-js@latest/web-animations.min.js"></script>
```

Both methods will provide a fallback implementation of the Web Animations API and should resolve your animation issues.

## Examples

* [Demo dApp](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui) - Example of a dApp with `@townsquarelabs/ui-vue`.

## See also

- [TON Connect for React apps](/v3/guidelines/ton-connect/frameworks/react/)
- [TON Connect for HTML/JS apps](/v3/guidelines/ton-connect/frameworks/web/)

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/frameworks/web.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/frameworks/web.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TON Connect for JS

This guide will help you integrate TON Connect into your Javascript app for user authentication and transactions.

If using React for your DApp, look at the [TON Connect UI React SDK](/v3/guidelines/ton-connect/frameworks/react).

If you're using Vue for your DApp, look at the [TON Connect UI Vue SDK](/v3/guidelines/ton-connect/frameworks/vue).


## Implementation

### Installation

<Tabs groupId="Installation">
  <TabItem value="CDN" label="CDN">
Add the script to the `<HEAD>` element of your website:
    <br/>
    <br/>


```html
<script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>
```
  </TabItem>
  <TabItem value="NPM" label="NPM">
   Install the [@tonconnect/ui](https://www.npmjs.com/package/@tonconnect/ui) package:

```bash npm2yarn
npm i @tonconnect/ui
```
  </TabItem>
</Tabs>

### TON Connect initiation

After installing the package, create a `manifest.json` file for your app.
More information on how to create a `manifest.json` file can be found [here](/v3/guidelines/ton-connect/guidelines/creating-manifest).

Add a button with a `ton-connect` id to connect to the wallet:

```html
<div id="ton-connect"></div>
```

*After this tag*, add a script for `tonConnectUI` in the `<body>` part of the app page:

```html
<script>
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
        buttonRootId: 'ton-connect'
    });
</script>
```

### Connect to the wallet

The `'ton-connect'` button in `buttonRootId` will automatically manage clicks.

But you can open **connect modal** programmatically, for example, after clicking on the custom button:

```html
<script>
    async function connectToWallet() {
        const connectedWallet = await tonConnectUI.connectWallet();
        // Do something with connectedWallet if needed
        console.log(connectedWallet);
    }

    // Call the function
    connectToWallet().catch(error => {
        console.error("Error connecting to wallet:", error);
    });
</script>
```

### Redirects

#### Customizing return strategy

To redirect the user to a specific URL after connection, you can [customize your return strategy](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-the-return-strategy).

#### Telegram Mini Apps

To redirect the user to a [Telegram Mini App](/v3/guidelines/dapps/tma/overview) after wallet connection use the `twaReturnUrl` option:

```tsx
tonConnectUI.uiOptions = {
      twaReturnUrl: 'https://t.me/YOUR_APP_NAME'
  };
```

[Read more in SDK documentation](https://github.com/ton-connect/sdk/tree/main/packages/ui#use-inside-twa-telegram-web-app)

### UI customization

TonConnect UI provides an interface that should be familiar and recognizable to the user when using various apps. However, the app developer can modify this interface to keep it consistent with the app's interface.

- [TonConnect UI documentation](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation)


## SDK documentation

- [SDK documentation](https://github.com/ton-connect/sdk/blob/main/packages/ui/README.md)
- [Latest API documentation](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

## Usage

Let's look at the example of using the TON Connect UI in the app.

### Sending messages

Here's an example of sending a transaction using the TON Connect UI:

```js
import TonConnectUI from '@tonconnect/ui';

const tonConnectUI = new TonConnectUI({ //connect application
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: '<YOUR_CONNECT_BUTTON_ANCHOR_ID>'
});

const transaction = {
  validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
  messages: [
        {
            address: "EQABa48hjKzg09hN_HjxOic7r8T1PleIy1dRd8NvZ3922MP0", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

:::tip
Get more examples on the [Preparing messages](/v3/guidelines/ton-connect/guidelines/preparing-messages) page.
:::

### Understanding transaction status by hash

Learn the principle explained in [payment processing](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions) using the tonweb library.

### Signing and verification

Understand how to sign and verify messages using the TON Connect:
- [Signing and verification](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users)
- [TON Connect UI implementation on GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui#add-connect-request-parameters-ton_proof)

### Wallet disconnection

Call to disconnect the wallet:
```js
await tonConnectUI.disconnect();
```

## See also

* [UI customization](https://github.com/ton-connect/sdk/tree/main/packages/ui#ui-customisation)
* [[YouTube] TON Connect UI React [RU]](https://youtu.be/wIMbkJHv0Fs?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_&t=1747)
* [[YouTube] Connect TON Connect UI to site [RU]](https://www.youtube.com/watch?v=HUQ1DPfFxG4&list=PLyDBPwv9EPsAIWi8vgic9kiV3KF_wvIcz&index=4)

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/guidelines/creating-manifest.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/guidelines/creating-manifest.md
================================================
import Feedback from '@site/src/components/Feedback';


# Creating the TON Connect manifest for DApp

## Manifest definition 

Every app needs a manifest to pass meta information to the wallet. 

The manifest is a JSON file named `tonconnect-manifest.json` and has the following format:

```json
{
    "url": "<app-url>",                        // required
    "name": "<app-name>",                      // required
    "iconUrl": "<app-icon-url>",               // required
    "termsOfUseUrl": "<terms-of-use-url>",     // optional
    "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

|Field|Requirement| Description                                                                                                                                                                                                      |
|---|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`url` |required| `url` defines the app URL.  It will be used to open the DApp after clicking its icon in the wallet. It is recommended to pass the URL without closing the slash, e.g., 'https://mydapp.com' instead of 'https://mydapp.com/'. |
| `name`|required| `name` defines the app name. Typically simple word. Shouldn't be used as identifier.                                                                                                                             |
| `iconUrl`| required | `iconUrl` defines the URL to the app icon. It must be in `PNG` or `ICO` format. `SVG` icons are not supported. Perfectly pass the URL to a 180x180px PNG icon.                                                                   |
| `termsOfUseUrl` |optional| Optional for usual apps, but required for the apps placed in the Tonkeeper recommended apps list.                                                                                                       |
| `privacyPolicyUrl` | optional | Optional for usual apps, but required for the apps placed in the Tonkeeper recommended apps list.                                                                                                       |

:::info
The original definition is [here](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#app-manifest).
:::

### Example

```json
{
    "url": "https://ton.vote",
    "name": "TON Vote",
    "iconUrl": "https://ton.vote/logo.png"
}
```
## Best practices

- Place the manifest in the root of your app and repository, for example: `https://myapp.com/tonconnect-manifest.json`. It allows the wallet to handle your app better and improve the UX connected to your app.
- The fields `url`, `iconUrl`, `termsOfUseUrl`, `privacyPolicyUrl`: must be publicly accessible from the internet and should be requestable from any origin without CORS restrictions.
- The manifest must be publicly accessible from the internet and should be requestable from any origin without CORS restrictions.
- Ensure that the `manifest.json` file is accessible via a GET request at its URL

## See also
- [TON Connect GitHub - App manifest](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#app-manifest)

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/guidelines/developers.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/guidelines/developers.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON Connect SDKs

## SDK List

:::info
We recommend using the [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) kit for your DApps. Only switch to lower levels of the SDK or reimplement your protocol version if your product requires it.
:::

This page contains the list of useful libraries for TON Connect.

* [TON Connect React](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-react) 
* [TON Connect JS SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-js-sdk)
* [TON Connect Vue](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-vue)
* [TON Connect Python SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-python)
* [TON Connect Dart](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-dart)
* [TON Connect C#](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-c)
* [TON Connect Unity](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-unity)
* [TON Connect Go](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-go)

## TON Connect React

- [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) - TON Connect User Interface (UI) for React applications

`@tonconnect/ui-react` is a React UI kit for the TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol in React apps.

* Example of a DApp with `@tonconnect/ui-react`: [GitHub](https://github.com/ton-connect/demo-dapp-with-react-ui)
* Example of deployed `demo-dapp-with-react-ui`: [GitHub](https://ton-connect.github.io/demo-dapp-with-react-ui/)

```bash
npm i @tonconnect/ui-react
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui-react)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui-react)
- [API Documentation](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)


## TON Connect JS SDK

The TON Connect repository contains the following main packages:

- [@tonconnect/ui](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-ui) - TON Connect User Interface (UI)
- [@tonconnect/sdk](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-sdk)  - TON Connect SDK
- [@tonconnect/protocol](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-protocol-models) - TON Connect protocol specifications


### TON Connect UI

TON Connect UI is a UI kit for TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol. It allows you to integrate TON Connect into your app more efficiently using our UI elements, such as the **connect wallet** button, **select wallet** dialog, and **confirmation** modals.

```bash
npm i @tonconnect/ui
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui)
- [API Documentation](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

The TON Connect **User Interface (UI)** is a framework that allows developers to improve and unify the user **experience (UX)** for TON application users.

Developers can easily integrate TON Connect with apps using simple UI elements such as the connect wallet button, select wallet dialog, and confirmation modals. Here are three primary examples of how TON Connect improves UX in apps:

* Example of app functionality in the DApp browser: [GitHub](https://ton-connect.github.io/demo-dapp/)
* Example of a backend partition of the DApp above: [GitHub](https://github.com/ton-connect/demo-dapp-backend)
* Bridge server using Go: [GitHub](https://github.com/ton-connect/bridge)


This kit simplifies the implementation of TON Connect in apps built for the TON Blockchain. Standard frontend frameworks are supported, as are applications that don’t use predetermined frameworks.


### TON Connect SDK

The TON Connect SDK is the lowest level of the three frameworks that help developers integrate TON Connect into their applications. It primarily connects apps to TON wallet apps via the TON Connect protocol.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

### TON Connect protocol models

This package contains protocol requests, protocol responses, event models, and encoding and decoding functions. Developers may use this to integrate TON Connect to wallet apps written in TypeScript. In order to integrate TON Connect into a DApp, use the [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk).

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)


## TON Connect Vue

TON Connect UI Vue is a Vue UI kit for the TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol in Vue apps.

* Example of a DApp with `@townsquarelabs/ui-vue`: [GitHub](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui)
* Example of deployed `demo-dapp-with-vue-ui`: [GitHub](https://townsquarexyz.github.io/demo-dapp-with-vue-ui/)

```bash
npm i @townsquarelabs/ui-vue
```

- [GitHub](https://github.com/TownSquareXYZ/tonconnect-ui-vue)
- [NPM](https://www.npmjs.com/package/@townsquarelabs/ui-vue)

## TON Connect Python

### pytonconnect

Python SDK for TON Connect 2.0. An analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
pip3 install pytonconnect
```

- [GitHub](https://github.com/XaBbl4/pytonconnect)


### ClickoTON-Foundation tonconnect

Library for connecting TON Connect to Python apps

```bash
git clone https://github.com/ClickoTON-Foundation/tonconnect.git
pip install -e tonconnect
```

[GitHub](https://github.com/ClickoTON-Foundation/tonconnect)


## TON Connect Dart

Dart SDK for TON Connect 2.0. analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 $ dart pub add darttonconnect
```

* [GitHub](https://github.com/romanovichim/dartTonconnect)


## TON Connect C#

C# SDK for TON Connect 2.0. An analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 $ dotnet add package TonSdk.Connect
```

* [GitHub](https://github.com/continuation-team/TonSdk.NET/tree/main/TonSDK.Connect)

## TON Connect Unity

Unity asset for TON Connect 2.0. Uses `continuation-team/TonSdk.NET/tree/main/TonSDK.Connect`.

Use it to integrate the TON Connect protocol with your game.

* [GitHub](https://github.com/continuation-team/unity-ton-connect)
* [Docs](https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started)


## TON Connect Go

Go SDK for TON Connect 2.0.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 go get github.com/cameo-engineering/tonconnect
```

* [GitHub](https://github.com/cameo-engineering/tonconnect)



## General questions and concerns

If you encounter any additional issues during the implementation of TON Connect, contact developers with [GitHub issues](https://github.com/ton-blockchain/ton-connect/issues).

## See also

* [Step-by-step guide for building your first web client](https://helloworld.tonstudio.io/03-client/)
* [[YouTube] TON Smart Contracts | 10 | Telegram DApp[EN]](https://www.youtube.com/watch?v=D6t3eZPdgAU&t=254s&ab_channel=AlefmanVladimir%5BEN%5D)
* [Ton Connect Getting started](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
* [Integration manual](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk)
* [[YouTube] TON Dev Study TON Connect Protocol [RU]](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/guidelines/how-ton-connect-works.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/guidelines/how-ton-connect-works.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'
import ThemedImage from '@theme/ThemedImage';

# How TON Connect works

TON Connect is a communication protocol between **wallets** and **apps** in TON.



<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/ton-connect/ton-connect_1.svg?raw=true',
        dark: '/img/docs/ton-connect/ton-connect_1-dark.svg?raw=true',
    }}
/>
<br></br>

## Bird's eye view

**Apps** built on TON offer rich functionality and are designed to protect user funds through smart contracts. Since these apps use decentralized technologies like blockchain, they are typically called **decentralized applications (DApps)**.

**Wallets** offer the user interface for approving transactions and securely store users' cryptographic keys on their devices.

This separation of responsibilities allows for rapid innovation and a high level of security: wallets don't need to create closed ecosystems, and apps don't need to bear the risk of holding users' accounts.

TON Connect is designed to provide a seamless user experience between wallets and apps.

## See also

- [TON Connects SDKs](/v3/guidelines/ton-connect/guidelines/developers/)
- [TON Connect for Business](/v3/guidelines/ton-connect/business/ton-connect-for-business/)
- [TON Connect Security](/v3/guidelines/ton-connect/business/ton-connect-for-security/)

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk.md
================================================
import Feedback from '@site/src/components/Feedback';

# Integration manual with the JavaScript SDK

:::danger
The page is outdated and will be deleted soon. Learn actual JS flow from [the guideline for web](/v3/guidelines/ton-connect/frameworks/web).
:::

In this tutorial, we’ll create a sample web app that supports TON Connect 2.0 authentication. It will allow for signature verification to eliminate the possibility of fraudulent identity impersonation without the need for agreement establishment between parties.

## Documentation links

1. [@tonconnect/sdk documentation](https://www.npmjs.com/package/@tonconnect/sdk)  
2. [Wallet-application message exchange protocol](https://github.com/ton-connect/docs/blob/main/requests-responses.md) 
3. [Tonkeeper implementation of wallet side](https://github.com/tonkeeper/wallet/tree/main/packages/mobile/src/tonconnect)

## Prerequisites

In order for connectivity to be fluent between apps and wallets, the web app must make use of manifest that is accessible via wallet applications. The prerequisite to accomplish this is typically a host for static files. For example, if a developer wants to make use of GitHub pages, or deploy their website using TON Sites hosted on their computer. This would mean their web app site is publicly accessible.

## Getting wallets support list

To increase the overall adoption of TON Blockchain, it is necessary that TON Connect 2.0 is able to facilitate a vast number of application and wallet connectivity integrations. Of late and of significant importance, the ongoing development of TON Connect 2.0 has allowed for the connection of the Tonkeeper, TonHub, MyTonWallet and other wallets with various TON Ecosystem Apps. It is our mission to eventually allow for the exchange of data between applications and all wallet types built on TON via the TON Connect protocol. For now, this is achieved by enabling TON Connect to load an extensive list of available wallets currently operating within the TON Ecosystem.

At the moment our sample web app enables the following:

1. loads the TON Connect SDK (library meant to simplify integration),
2. creates a connector (currently without an application manifest),
3. loads a list of supported wallets (from  [wallets.json on GitHub](https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json)).

For learning purposes, let's take a looks at the HTML page described by the following code:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>  <!-- (1) -->
  </head>
  <body>
    <script>
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();  // (2)
        const walletsList = await connector.getWallets();  // (3)
        
        console.log(walletsList);
      }
    </script>
  </body>
</html>
```

If you load this page in a browser and check the console, you may see something like this:

```bash
> Array [ {…}, {…} ]

0: Object { name: "Tonkeeper", imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png", aboutUrl: "https://tonkeeper.com", … }
  aboutUrl: "https://tonkeeper.com"
  bridgeUrl: "https://bridge.tonapi.io/bridge"
  deepLink: undefined
  embedded: false
  imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png"
  injected: false
  jsBridgeKey: "tonkeeper"
  name: "Tonkeeper"
  tondns: "tonkeeper.ton"
  universalLink: "https://app.tonkeeper.com/ton-connect"
```

According to TON Connect 2.0 specifications, wallet app information always makes use of the following format:
```js
{
    name: string;
    imageUrl: string;
    tondns?: string;
    aboutUrl: string;
    universalLink?: string;
    deepLink?: string;
    bridgeUrl?: string;
    jsBridgeKey?: string;
    injected?: boolean; // true if this wallet is injected to the webpage
    embedded?: boolean; // true if the DAppis opened inside this wallet's browser
}
```

## Button display for various wallet apps

Buttons may vary according to your web application design.
The current page produces the following result:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>

    // highlight-start
    <style>
      body {
        width: 1000px;
        margin: 0 auto;
        font-family: Roboto, sans-serif;
      }
      .section {
        padding: 20px; margin: 20px;
        border: 2px #AEFF6A solid; border-radius: 8px;
      }
      #tonconnect-buttons>button {
        display: block;
        padding: 8px; margin-bottom: 8px;
        font-size: 18px; font-family: inherit;
      }
      .featured {
        font-weight: 800;
      }
    </style>
    // highlight-end
  </head>
  <body>
    // highlight-start
    <div class="section" id="tonconnect-buttons">
    </div>
    // highlight-end
    
    <script>
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();

        // highlight-start
        let buttonsContainer = $('#tonconnect-buttons');
        
        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Connect with ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` means we are browsing the app from wallet application
            // we need to mark this sign-in option somehow
            connectButton.classList.add('featured');
          }
          
          if (!wallet.bridgeUrl && !wallet.injected && !wallet.embedded) {
            // no `bridgeUrl` means this wallet app is injecting JS code
            // no `injected` and no `embedded` -> app is inaccessible on this page
            connectButton.disabled = true;
          }
          
          buttonsContainer.appendChild(connectButton);
        }
	// highlight-end
      };
    </script>
  </body>
</html>
```

Please note the following:

1. If the web page is displayed through a wallet application, it sets the property `embedded` option to `true`. This means it is important to highlight this login option because it's most commonly used.
2. If a specific wallet is built using only JavaScript (it has no `bridgeUrl`) and it hasn't set property `injected` (or `embedded`, for safety), then it is clearly inaccessible and the button should be disabled.


## Connection without the app manifest

In the instance the connection is made without the app manifest, the script should be changed as follows:

```js
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
        
        let buttonsContainer = $('#tonconnect-buttons');

        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Connect with ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` means we are browsing the app from wallet application
            // we need to mark this sign-in option somehow
            connectButton.classList.add('featured');
          }
          
          // highlight-start
          if (wallet.embedded || wallet.injected) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              connector.connect({jsBridgeKey: wallet.jsBridgeKey});
            };
          } else if (wallet.bridgeUrl) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              console.log('Connection link:', connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
              }));
            };
          } else {
            // wallet app does not provide any auth method
            connectButton.disabled = true;
          }
	  // highlight-end
          
          buttonsContainer.appendChild(connectButton);
        }
      };
```

Now that the above process has been carried out, status changes are being logged (to see whether TON Connect works or not). Showing the modals with QR codes for connectivity is out of the scope of this manual. For testing purposes, it is possible to use a browser extension or send a connection request link to the user’s phone by any means necessary (for example, using Telegram).
Note: we haven't created an app manifest yet. At this time, the best approach is  to analyze the end result if this requirement is not fulfilled.

### Logging in with Tonkeeper

In order to log into Tonkeeper, the following link is created for authentication (provided below for reference):
```
https://app.tonkeeper.com/ton-connect?v=2&id=3c12f5311be7e305094ffbf5c9b830e53a4579b40485137f29b0ca0c893c4f31&r=%7B%22manifestUrl%22%3A%22null%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D
```
When decoded, the `r` parameter produces the following JSON format:
```js
{"manifestUrl":"null/tonconnect-manifest.json","items":[{"name":"ton_addr"}]}
```

Upon clicking the mobile phone link, Tonkeeper automatically opens and then closes, dismissing the request. Additionally, the following error appears in the web app page console:
`Error: [TON_CONNECT_SDK_ERROR] Can't get null/tonconnect-manifest.json`.

This indicates that the application manifest must be available for download.
 
## Connection with using app manifest

Starting from this point forward, it is necessary to host user files (mostly tonconnect-manifest.json) somewhere. In this instance we’ll use the manifest from another web application. This however  is not recommended for production environments, but allowed for testing purposes.

The following code snippet:

```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
```
Must be replaced with this version:
```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect({manifestUrl: 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'});
        // highlight-next-line
        window.connector = connector;  // for experimenting in browser console
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
	// highlight-next-line
        connector.restoreConnection();
```

In the newer version above, the storing `connector`  variable in the `window` was added so it is accessible in the browser console. Additionally, the `restoreConnection` so users don’t have to log in on each web application page.


### Logging in with Tonkeeper

If we decline our request from wallet, The result that appeared in the console will `Error: [TON_CONNECT_SDK_ERROR] Wallet declined the request`.

Therefore, the user is able to accept the same login request if the link is saved. This means the web app should be able to handle the authentication decline as non-final so it works correctly.

Afterwards, the login request is accepted and is immediately reflected in the browser console as follows:

```bash
22:40:13.887 Connection status:
Object { device: {…}, provider: "http", account: {…} }
  account: Object { address: "0:b2a1ec...", chain: "-239", walletStateInit: "te6cckECFgEAAwQAAgE0ARUBFP8A9..." }
  device: Object {platform: "android", appName: "Tonkeeper", appVersion: "2.8.0.261", …}
  provider: "http"
```

The results above take the following into consideration:
1. **Account**: information: contains the address (workchain+hash), network (mainnet/testnet), and the wallet stateInit that is used for public key extraction.
2. **Device**: information: contains the name and wallet application version (the name should be equal to what was requested initially, but this can be verified to ensure authenticity), and the platform name and supported features list.
3. **Provider**: contains http -- which allows all requests and responses between the wallet and web applications to be served over the bridge.

## Logging out and requesting TonProof

Now we have logged into our Mini App, but... how does the backend know that it is the correct party? To verify this we must request the wallet ownership proof. 

This can be completed only using authentication, so we must log out. Therefore, we run the following code in the console:

```js
connector.disconnect();
```

When the disconnection process is complete, the `Connection status: null` will be displayed.

Before the TonProof is added, let's alter the code to show that the current implementation is insecure:

```js
let connHandler = connector.statusChangeSubscriptions[0];
connHandler({
  device: {
    appName: "Uber Singlesig Cold Wallet App",
    appVersion: "4.0.1",
    features: [],
    maxProtocolVersion: 3,
    platform: "ios"
  },
  account: {
    /* TON Foundation address */
    address: '0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8',
    chain: '-239',
    walletStateInit: 'te6ccsEBAwEAoAAFcSoCATQBAgDe/wAg3SCCAUyXuiGCATOcurGfcbDtRNDTH9MfMdcL/+ME4KTyYIMI1xgg0x/TH9Mf+CMTu/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOjRAaTIyx/LH8v/ye1UAFAAAAAAKamjF3LJ7WtipuLroUqTuQRi56Nnd3vrijj7FbnzOETSLOL/HqR30Q=='
  },
  provider: 'http'
});
```

The resulting lines of code in the console are almost identical to those displayed when the connection was initiated in the first place. Therefore, if the backend doesn't perform user authentication correctly as expected, a way to test if it is working correctly is required. To accomplish this, it is possible to act as the TON Foundation within the console, so the legitimacy of token balances and token ownership parameters can be tested. Naturally, the provided code doesn't change any variables in the connector, but the user is able to use the app as desired unless that connector is protected by the closure. Even if that is the case, it is not difficult to extract it using a debugger and coding breakpoints.

Now that the authentication of the user has been verified, let's proceed to writing the code.

## Connection using TonProof

According to TON Connect’s SDK documentation, the second argument refers to the `connect()` method which contains a payload that will be wrapped and signed by the wallet. Therefore, the result is new connection code:

```js
          if (wallet.embedded || wallet.injected) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              connector.connect({jsBridgeKey: wallet.jsBridgeKey},
                                {tonProof: 'doc-example-<BACKEND_AUTH_ID>'});
            };
          } else if (wallet.bridgeUrl) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              console.log('Connection link:', connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
              }, {tonProof: 'doc-example-<BACKEND_AUTH_ID>'}));
            };
```

Connection link:
```
https://app.tonkeeper.com/ton-connect?v=2&id=4b0a7e2af3b455e0f0bafe14dcdc93f1e9e73196ae2afaca4d9ba77e94484a44&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fratingers.pythonanywhere.com%2Fratelance%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%2C%7B%22name%22%3A%22ton_proof%22%2C%22payload%22%3A%22doc-example-%3CBACKEND_AUTH_ID%3E%22%7D%5D%7D
```
Expanded and simplified `r` parameter:
```js
{
  "manifestUrl":
    "https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json",
  "items": [
    {"name": "ton_addr"},
    {"name": "ton_proof", "payload": "doc-example-<BACKEND_AUTH_ID>"}
  ]
}
```

Next, the url address link is sent to a mobile device and opened using Tonkeeper.

After this process is complete, the following wallet-specific information is received:

```js
{
  "device": {
    "platform": "android",
    "appName": "Tonkeeper",
    "appVersion": "2.8.0.261",
    "maxProtocolVersion": 2,
    "features": [
      "SendTransaction"
    ]
  },
  "provider": "http",
  "account": {
    "address": "0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad",
    "chain": "-239",
    "walletStateInit": "te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c="
  },
  "connectItems": {
    "tonProof": {
      "name": "ton_proof",
      "proof": {
        "timestamp": 1674392728,
        "domain": {
          "lengthBytes": 28,
          "value": "ratingers.pythonanywhere.com"
        },
        "signature": "trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ==",
        "payload": "doc-example-<BACKEND_AUTH_ID>"
      }
    }
  }
}
```
Let's verify the received signature. In order to accomplish this, the signature verification uses Python because it can easily interact with the backend. The libraries required to carry out this process are the `pytoniq` and the `pynacl`.

Next, it is necessary to retrieve the wallet's public key. To accomplish this, `tonapi.io` or similar services are not used because the end result cannot be reliably trusted. Instead, this is accomplished by parsing the `walletStateInit`.

It is also critical to ensure that the `address` and `walletStateInit`  match, or the payload could be signed with their wallet key by providing their own wallet in the `stateInit` field and another wallet in the `address` field.

The `StateInit` is made up of two reference types: one for code and one for data. In this context, the purpose is to retrieve the public key so the second reference (the data reference) is loaded. Then 8 bytes are skipped (4 bytes are used for the `seqno` field and 4 for `subwallet_id` in all modern wallet contracts) and the next 32 bytes are loaded (256 bits) -- the public key.

```python
import nacl.signing
import pytoniq

import hashlib
import base64

received_state_init = 'te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c='
received_address = '0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad'

state_init = pytoniq.Cell.one_from_boc(base64.b64decode(received_state_init))

address_hash_part = state_init.hash.hex()
assert received_address.endswith(address_hash_part)

public_key = state_init.refs[1].bits.tobytes()[8:][:32]

# bytearray(b'#:\xd3\x1d\xa6\xb7\x97\x9b\xa0\xdc\x8eLO\xb9Dc\x9e\xf4G\xb6\xac\xadPq\xbf\xb4f\xe8\x8f\xf6\xf6\xfb')

verify_key = nacl.signing.VerifyKey(bytes(public_key))
```

After the sequencing code above is implemented, the correct documentation is consulted to check which parameters are verified and signed using the wallet key:

> ```
> message = utf8_encode("ton-proof-item-v2/") ++  
>           Address ++  
>           AppDomain ++  
>           Timestamp ++  
>           Payload
> 
> signature = Ed25519Sign(
>   privkey,
>   sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message))
> )
> ```


> Whereby the:
> -   `Address` denotes the wallet address encoded as a sequence:
>     -   `workchain`: 32-bit signed integer big endian;
>     -   `hash`: 256-bit unsigned integer big endian;
> -   `AppDomain` is the Length ++ EncodedDomainName
>     -   `Length` uses a 32-bit value of utf-8 encoded app domain name length in bytes
>     -   `EncodedDomainName` id `Length`-byte utf-8 encoded app domain name
> -   `Timestamp` denotes the 64-bit unix epoch time of the signing operation
> -   `Payload` denotes a variable-length binary string
> -   `utf8_encode` produces a plain byte string with no length prefixes.

Let's reimplement this in Python.  The endianness of some of the integers above is not specified, so several examples must be considered. Please refer to the following Tonkeeper implementation detailing some related examples: : [ConnectReplyBuilder.ts](https://github.com/tonkeeper/wallet/blob/77992c08c663dceb63ca6a8e918a2150c75cca3a/src/tonconnect/ConnectReplyBuilder.ts#L42).

```python
received_timestamp = 1674392728
signature = 'trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ=='

message = (b'ton-proof-item-v2/'
         + 0 .to_bytes(4, 'big') + si.bytes_hash()
         + 28 .to_bytes(4, 'little') + b'ratingers.pythonanywhere.com'
         + received_timestamp.to_bytes(8, 'little')
         + b'doc-example-<BACKEND_AUTH_ID>')
# b'ton-proof-item-v2/\x00\x00\x00\x00\xb2\xa1\xec\xf5T^\x07l\xd3j\xe5\x16\xea~\xbd\xf3*\xea\x00\x8c\xaa+\x84\xaf\x98f\xbe\xcb \x88\x95\xad\x1c\x00\x00\x00ratingers.pythonanywhere.com\x984\xcdc\x00\x00\x00\x00doc-example-<BACKEND_AUTH_ID>'

signed = b'\xFF\xFF' + b'ton-connect' + hashlib.sha256(message).digest()
# b'\xff\xffton-connectK\x90\r\xae\xf6\xb0 \xaa\xa9\xbd\xd1\xaa\x96\x8b\x1fp\xa9e\xff\xdf\x81\x02\x98\xb0)E\t\xf6\xc0\xdc\xfdx'

verify_key.verify(hashlib.sha256(signed).digest(), base64.b64decode(signature))
# b'\x0eT\xd6\xb5\xd5\xe8HvH\x0b\x10\xdc\x8d\xfc\xd3#n\x93\xa8\xe9\xb9\x00\xaaH%\xb5O\xac:\xbd\xcaM'
```

After implementing the above parameters, if an attacker tries to impersonate a user and doesn't provide a valid signature, the following error will be displayed:

```bash
nacl.exceptions.BadSignatureError: Signature was forged or corrupt.
```
## See also

* [Preparing Messages](/v3/guidelines/ton-connect/guidelines/preparing-messages)
* [Sending Messages](/v3/guidelines/ton-connect/guidelines/sending-messages)

## Next steps

When writing a dApp, the following should also be considered:

- after a successful connection is completed (either a restored or new connection), the `Disconnect` button should be displayed instead of several `Connect` buttons
- after a user disconnects, `Disconnect` buttons will need to be recreated
- wallet code should be checked, because
   - newer wallet versions could place public keys in a different location and create issues
   - the current user may sign in using another type of contract instead of a wallet. Thankfully, this will contain the public key in the expected location

Good luck and have fun writing dApps!

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/guidelines/preparing-messages.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/guidelines/preparing-messages.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Preparing messages

While using TON Connect, you should construct the message body for the payload used in various operations. On this page, you can find the most relevant payload examples for use with the TON Connect SDKs.

## Cells and message serialization

Before diving into building messages, let's introduce the concept of cells, which message bodies are made from.

### What is a cell?

A cell is a basic data structure in the TON Blockchain. It can store up to `1023` bits and hold up to `4` references to other cells, which allows you to store more complex data structures.
Libraries like `@ton/core` and `@ton-community/assets-sdk` provide efficient cell handling.

You can read more about cells [here](/v3/documentation/data-formats/tlb/cell-boc).

### Creating a cell

To build a cell, you use the `beginCell()` function. While the cell is _open_, you can store various data types with `store...()` functions.
When you're done, you close the cell with the `endCell()` function.

```ts
import { Address, beginCell } from "@ton/ton";

const cell = beginCell()
  .storeUint(99, 64) // Stores uint 99 in 64 bits
  .storeAddress(Address.parse('[SOME_ADDR]')) // Stores an address
  .storeCoins(123) // Stores 123 as coins
  .endCell() // Closes the cell
```

:::info
Examples were provided only for @ton/ton library. However, every version of [SDKs](/v3/guidelines/dapps/apis-sdks/sdk) implementation has similar functions.
:::

### Parsing a cell

The `beginParse()` function is called to read or parse data from a cell. You read data in the same order it was stored using similar `load...()` functions:

```ts
const slice = cell.beginParse();
const uint = slice.loadUint(64);
const address = slice.loadAddress();
const coins = slice.loadCoins();
```

### Larger amounts of data

Each cell has a 1023-bit limit. If you exceed this, an error occurs:

```ts
// This will fail due to overflow
const cell = beginCell()
  .storeUint(1, 256)
  .storeUint(2, 256)
  .storeUint(3, 256)
  .storeUint(4, 256) // Exceeds 1023-bit limit (256 + 256 + 256 + 256 = 1024)
  .endCell()
```

To store more data, cells can reference up to four other cells. You can use the `storeRef()` function to create nested cells:

```ts
const cell = beginCell()
  .storeUint(1, 256)
  .storeUint(2, 256)
  .storeRef(beginCell()
    .storeUint(3, 256)
    .storeUint(4, 256)
    .endCell())
  .endCell()
```

To load a referenced (nested) cell, use `loadRef()`:

```ts
const slice = cell.beginParse();
const uint1 = slice.loadUint(256);
const uint2 = slice.loadUint(256);
const innerSlice = slice.loadRef().beginParse(); // Load and parse nested cell
const uint3 = innerSlice.loadUint(256);
const uint4 = innerSlice.loadUint(256);
```

### Optional references and values

Cells can store optional values, which may be null. These are stored using the `storeMaybe...()` functions:

```ts
const cell = beginCell()
  .storeMaybeInt(null, 64) // Optionally stores an int
  .storeMaybeInt(1, 64)
  .storeMaybeRef(null) // Optionally stores a reference
  .storeMaybeRef(beginCell()
    .storeCoins(123)
    .endCell());
```

You can parse optional values using the corresponding `loadMaybe...()` functions. Returned values are nullable so do not forget to check them for null!

```ts
const slice = cell.beginParse();
const maybeInt = slice.loadMaybeUint(64);
const maybeInt1 = slice.loadMaybeUint(64);
const maybeRef = slice.loadMaybeRef();
const maybeRef1 = slice.loadMaybeRef();
if (maybeRef1) {
  const coins = maybeRef1.beginParse().loadCoins();
}
```

### Using assets sdk for more straightforward serialization and deserialization

Manually handling cells can be tedious, so the `@ton-community/assets-sdk` provides convenient methods for serializing and deserializing messages.

Using `@ton-community/assets-sdk` is more readable and less error-prone.

<Tabs groupId="Serialization/Deserialization">

  <TabItem value="@ton-community/assets-sdk" label="@ton-community/assets-sdk">

```ts
import {Address, beginCell} from "@ton/core";
import {storeJettonTransferMessage, loadJettonTransferMessage} from "@ton-community/assets-sdk";

// serialization
const cell = beginCell()
  .store(storeJettonTransferMessage({
    queryId: 42n,
    amount: 100n,
    destination: Address.parse('[DESTINATION]'),
    responseDestination: Address.parse('[RESPONSE_DESTINATION]'),
    customPayload: null,
    forwardAmount: 1n,
    forwardPayload: null,
  }))
  .endCell()

// deserialization
const transferMessage = loadJettonTransferMessage(cell.beginParse());
```

  </TabItem>

  <TabItem value="@ton/ton" label="@ton/ton">

```ts
import {Address, beginCell} from "@ton/core";

// serialization
const cell = beginCell()
  .storeUint(260734629, 32)
  .storeUint(42, 64)
  .storeCoins(100)
  .storeAddress(Address.parse('[DESTINATION]'))
  .storeAddress(Address.parse('[RESPONSE_DESTINATION]'))
  .storeMaybeRef(null)
  .storeCoins(1)
  .storeMaybeRef(null)
  .endCell();

// deserialization
const slice = cell.beginParse();
const op = slice.loadUint(32);
const queryId = slice.loadUint(64);
const amount = slice.loadCoins();
const destination = slice.loadAddress();
const responseDestination = slice.loadAddress();
const customPayload = slice.loadMaybeRef();
const fwdAmount = slice.loadCoins();
const fwdPayload = slice.loadMaybeRef();

const transferMessage = { op, queryId, amount, destination, responseDestination, customPayload, fwdAmount, fwdPayload };
```

  </TabItem>
</Tabs>

## TON Connect JS SDK examples

### Transaction template

No matter what level of task a developer is solving, it is typically necessary to use the connector entity from `@tonconnect/sdk` or `@tonconnect/ui`.
Examples created based on `@tonconnect/sdk` and `@tonconnect/ui`:

<Tabs groupId="TON Connect template">

<TabItem value="tonconnect-react" label="@tonconnect/ui-react">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';

const transaction = {
    //transaction body
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>
<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui';

const tonConnectUI = new TonConnectUI({ //connect application
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: '<YOUR_CONNECT_BUTTON_ANCHOR_ID>'
});

const transaction = {
    //transaction body
}

const result = await tonConnectUI.sendTransaction(transaction)

```

</TabItem>
<TabItem value="tonconnect-js" label="@tonconnect/sdk">

```js
import TonConnect from '@tonconnect/sdk';
const connector = new TonConnect();

await connector.sendTransaction({
    //transaction body
})

```

</TabItem>

</Tabs>

### Regular TON transfer

TON Connect SDKs include wrappers for sending messages, making it easy to prepare regular transfers of Toncoins between two wallets as default transaction without payload.

The `address` must be in a [user-friendly format](/v3/documentation/smart-contracts/addresses#user-friendly-address), not a raw. If the message is being sent to a smart contract, it must be bounceable; if the message is being sent to a wallet, it must be non-bounceable.

A regular TON transfer using the TON Connect JS SDKs can be executed as follows:


<Tabs groupId="Regular Transfer">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
const [tonConnectUI] = useTonConnectUI();

const transaction = {
    messages: [
        {
            address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ]

}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui';

const tonConnectUI = new TonConnectUI({ //connect application
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: '<YOUR_CONNECT_BUTTON_ANCHOR_ID>'
});

const transaction = {
    messages: [
        {
            address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">


```js
import TonConnect from '@tonconnect/sdk';
const connector = new TonConnect();

await connector.sendTransaction({
    messages: [
        {
            address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ]
})

```
</TabItem>
</Tabs>

:::tip
Learn more about [TON smart contract addresses](/v3/documentation/smart-contracts/addresses).
:::

For specific custom transactions, a particular payload must be defined.


### Transfer with a comment

The simplest example involves adding a payload with a comment. See more details on [this page](/v3/documentation/smart-contracts/message-management/internal-messages#simple-message-with-a-comment).
Before the transaction, it is necessary to prepare a `body` [cell](/v3/documentation/data-formats/tlb/cell-boc) via the [@ton/ton](https://github.com/ton-org/ton) JavaScript library.

```js
import { beginCell } from '@ton/ton'

const body = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment
  .endCell();
```

The transaction body is created by the following:

<Tabs groupId="Transfer With a Comment">

<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: destination,
            amount: toNano("0.05").toString(),
            payload: body.toBoc().toString("base64") // payload with comment in body
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```
</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: destination,
            amount: toNano("0.05").toString(),
            payload: body.toBoc().toString("base64") // payload with comment in body
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
import TonConnect from '@tonconnect/sdk';
import { toNano } from '@ton/ton'

const connector = new TonConnect();

await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: destination,
      amount: toNano("0.05").toString(),
      payload: body.toBoc().toString("base64") // payload with comment in body
    }
  ]
})
```
</TabItem>
</Tabs>


### Jetton transfer

The `body` for jetton transfers is based on the ([TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)) standard. Please note that the number of decimals can vary between different tokens: for example, USDT uses 6 decimals (1 USDT = 1 × 10<sup>6</sup>), while typically jettons and Toncoin uses 9 decimals (1 TON = 1 × 10<sup>9</sup>).

:::info
You can use `assets-sdk` library with the methods out of the box (even with `ton-connect`)
:::


<Tabs groupId="Jetton transfer">
<TabItem value="@ton/ton" label="@ton/ton">

```js
    import { beginCell, toNano, Address } from '@ton/ton'
    // transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
    // response_destination:MsgAddress custom_payload:(Maybe ^Cell)
    // forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
    // = InternalMsgBody;

    const body = beginCell()
        .storeUint(0xf8a7ea5, 32)                 // jetton transfer op code
        .storeUint(0, 64)                         // query_id:uint64
        .storeCoins(toNano("0.001"))              // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)
        .storeAddress(Address.parse(Wallet_DST))  // destination:MsgAddress
        .storeAddress(Address.parse(Wallet_SRC))  // response_destination:MsgAddress
        .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell)
        .storeCoins(toNano("0.05"))                 // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message
        .storeUint(0,1)                           // forward_payload:(Either Cell ^Cell)
        .endCell();
```


Next, sending the transaction with this body to sender's `jettonWalletContract` executed:

<Tabs groupId="Jetton transfer">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract, // sender jetton wallet
            amount: toNano("0.05").toString(), // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with jetton transfer body
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```


</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract,  // sender jetton wallet
            amount: toNano("0.05").toString(),         // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with jetton transfer body
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
import TonConnect from '@tonconnect/sdk';
import { toNano } from '@ton/ton'

const connector = new TonConnect();
//...
await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: jettonWalletContract,            // sender jetton wallet
      amount: toNano("0.05").toString(),                   // for commission fees, excess will be returned
      payload: body.toBoc().toString("base64")  // payload with jetton transfer body
    }
  ]
})
```

</TabItem>
</Tabs>


- `validUntil` - UNIX-time until message valid
- `jettonWalletAddress` - Address, JettonWallet address, that defined based on JettonMaser and Wallet contracts
- `balance` - Integer, the amount of Toncoin used for gas payments in nanotons.
- `body` - payload for the `jettonContract`


<details>
    <summary>Jetton wallet state init and address preparation example</summary>


```js
import { Address, TonClient, beginCell, StateInit, storeStateInit } from '@ton/ton'

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'put your api key'
    })

    const jettonWalletAddress = Address.parse('Sender_Jetton_Wallet');
    let jettonWalletDataResult = await client.runMethod(jettonWalletAddress, 'get_wallet_data');
    jettonWalletDataResult.stack.readNumber();
    const ownerAddress = jettonWalletDataResult.stack.readAddress();
    const jettonMasterAddress = jettonWalletDataResult.stack.readAddress();
    const jettonCode = jettonWalletDataResult.stack.readCell();
    const jettonData = beginCell()
        .storeCoins(0)
        .storeAddress(ownerAddress)
        .storeAddress(jettonMasterAddress)
        .storeRef(jettonCode)
        .endCell();

    const stateInit: StateInit = {
        code: jettonCode,
        data: jettonData
    }

    const stateInitCell = beginCell()
        .store(storeStateInit(stateInit))
        .endCell();

    console.log(new Address(0, stateInitCell.hash()));
}
```

</details>
</TabItem>
<TabItem value="assets/sdk" label="assets/sdk">

:::tip
Note: For the browser, you must set a polyfill for `Buffer`.
:::
For more examples, check [documentation](https://github.com/ton-community/assets-sdk)

```js
const NETWORK = "testnet";
const api = await createApi(NETWORK);
const provider = new TonConnectUI(); // OR you can use tonConnectUI as a provider from @tonconnect/ui-react

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const storage: PinataStorageParams = {
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretKey: process.env.PINATA_SECRET!,
};

const sdk = AssetsSDK.create({
  api,
  storage,
  sender,
});

const jetton = sdk.openJettonWallet(Address.parse("JETTON_ADDRESS"));
const RECEIVER_ADDRESS = Address.parse("RECIEVER_ADDRESS");

jetton.send(sender, RECEIVER_ADDRESS, toNano(10));
```

OR you can use Jetton Contract with built-in methods:

```ts
const provider = tonConnectUi;

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});

const jettonMaster = client.open(
  JettonMinter.createFromAddress(
    Address.parse("[JETTON_WALLET]"),
    new DefaultContentResolver()
  )
);

const jettonWalletAddress = await jettonMaster.getWalletAddress(
  sender.address!
);
const jettonContent = await jettonMaster.getContent();
const jettonDecimals = jettonContent.decimals ?? 9;

const jetton = client.open(JettonWallet.createFromAddress(jettonWalletAddress));

await jetton.send(
  sender,
  Address.parse("[SENDER_WALLET]"),
  BigInt(1 * 10 ** jettonDecimals)
);

```

</TabItem>
</Tabs>


### Jetton transfer with comment

<Tabs groupId="Jetton transfer with Comment">
<TabItem value="@ton/ton" label="@ton/ton">

The `messageBody` for jetton transfer([TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)) with comment we should additionally to the regular transfer `body` serialize comment and pack this in the `forwardPayload`.  Please note that the number of decimals can vary between different tokens:

- 9 decimals: 1 TON = 1 × 10<sup>9</sup> typically for various jettons and always for Toncoin
- 6 decimals: 1 USDT = 1 × 10<sup>6</sup> specific jettons, like USDT

```js
    import { beginCell, toNano, Address } from '@ton/ton'
    // transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
    // response_destination:MsgAddress custom_payload:(Maybe ^Cell)
    // forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
    // = InternalMsgBody;

    const destinationAddress = Address.parse('put destination wallet address');

    const forwardPayload = beginCell()
        .storeUint(0, 32) // 0 opcode means we have a comment
        .storeStringTail('Hello, TON!')
        .endCell();

    const body = beginCell()
        .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer
        .storeUint(0, 64) // query id
        .storeCoins(toNano("5")) // Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)
        .storeAddress(destinationAddress) // TON wallet destination address
        .storeAddress(destinationAddress) // response excess destination
        .storeBit(0) // no custom payload
        .storeCoins(toNano("0.02")) // forward amount (if >0, will send notification message)
        .storeBit(1) // we store forwardPayload as a reference
        .storeRef(forwardPayload)
        .endCell();

```

Next, send the transaction with this body to the sender's `jettonWalletContract` executed:

<Tabs groupId="Jetton transfer">
  <TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
    import { useTonConnectUI } from '@tonconnect/ui-react';
	import { toNano } from '@ton/ton'


    const jettonWalletContract = Address.parse('put your jetton wallet address');

    const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
  {
    address: jettonWalletContract, // sender jetton wallet
    amount: toNano("0.05").toString(), // for commission fees, excess will be returned
    payload: body.toBoc().toString("base64") // payload with jetton transfer and comment body
  }
    ]
  }

    export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
    <div>
    <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
    Send transaction
  </button>
</div>
);
};
```


</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
  import TonConnectUI from '@tonconnect/ui'
  import { toNano } from '@ton/ton'

  const transaction = {
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
{
  address: jettonWalletContract,  // sender jetton wallet
  amount: toNano("0.05").toString(),         // for commission fees, excess will be returned
  payload: body.toBoc().toString("base64") // payload with jetton transfer and comment body
}
  ]
}

  const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
  import TonConnect from '@tonconnect/sdk';
  import { toNano } from '@ton/ton'

  const connector = new TonConnect();
  //...
  await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
{
  address: jettonWalletContract,            // sender jetton wallet
  amount: toNano("0.05").toString(),                   // for commission fees, excess will be returned
  payload: body.toBoc().toString("base64")  // payload with jetton transfer and comment body
}
  ]
})
```

</TabItem>
</Tabs>


- `validUntil` - UNIX-time until message valid
- `jettonWalletAddress` - Address, JettonWallet address, that defined based on JettonMaser and Wallet contracts
- `balance` - Integer, the amount of Toncoin used for gas payments in nanotons.
- `body` - payload for the `jettonContract`


<details>
  <summary>Jetton wallet state init and address preparation example</summary>


```js
  import { Address, TonClient, beginCell, StateInit, storeStateInit } from '@ton/ton'

  async function main() {
  const client = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  apiKey: 'put your api key'
})

  const jettonWalletAddress = Address.parse('Sender_Jetton_Wallet');
  let jettonWalletDataResult = await client.runMethod(jettonWalletAddress, 'get_wallet_data');
  jettonWalletDataResult.stack.readNumber();
  const ownerAddress = jettonWalletDataResult.stack.readAddress();
  const jettonMasterAddress = jettonWalletDataResult.stack.readAddress();
  const jettonCode = jettonWalletDataResult.stack.readCell();
  const jettonData = beginCell()
  .storeCoins(0)
  .storeAddress(ownerAddress)
  .storeAddress(jettonMasterAddress)
  .storeRef(jettonCode)
  .endCell();

  const stateInit: StateInit = {
  code: jettonCode,
  data: jettonData
}

  const stateInitCell = beginCell()
  .store(storeStateInit(stateInit))
  .endCell();

  console.log(new Address(0, stateInitCell.hash()));
}
```

</details>
</TabItem>
<TabItem value="assets/sdk" label="assets/sdk">

:::tip
Note: For the browser, you must set a polyfill for `Buffer`.
:::
For more examples, check [documentation](https://github.com/ton-community/assets-sdk)

```js
const NETWORK = "testnet";
const api = await createApi(NETWORK);
const provider = new TonConnectUI(); // OR you can use tonConnectUI as a provider from @tonconnect/ui-react

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const storage: PinataStorageParams = {
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretKey: process.env.PINATA_SECRET!,
};

const sdk = AssetsSDK.create({
  api,
  storage,
  sender,
});

const jetton = sdk.openJettonWallet(Address.parse("JETTON_ADDRESS"));

const forwardPayload = beginCell()
        .storeUint(0, 32) // 0 opcode means we have a comment
        .storeStringTail('Hello, TON!')
        .endCell();

jetton.send(sender, RECEIVER_ADDRESS, toNano(10), { notify: { payload: forwardPayload } });
```

</TabItem>
</Tabs>

### Jetton burn


<Tabs groupId="Jetton Burn">
<TabItem value="@ton/ton" label="@ton/ton">

The `body` for jetton burn is based on the ([TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer)) standard. Please note that the number of decimals can vary between different tokens:

- 9 decimals: 1 TON = 1 × 10<sup>9</sup> typically for various jettons and always for Toncoin
- 6 decimals: 1 USDT = 1 × 10<sup>6</sup> specific jettons, like USDT



```js
    import { beginCell, Address } from '@ton/ton'
// burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
//               response_destination:MsgAddress custom_payload:(Maybe ^Cell)
//               = InternalMsgBody;

    const body = beginCell()
        .storeUint(0x595f07bc, 32)                // jetton burn op code
        .storeUint(0, 64)                         // query_id:uint64
        .storeCoins(toNano("0.001"))              // amount:(VarUInteger 16) - Jetton amount in decimal (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)
        .storeAddress(Address.parse(Wallet_SRC))  // response_destination:MsgAddress - owner's wallet
        .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell) - w/o payload typically
        .endCell();
```

Message places into the following request:


<Tabs groupId="Jetton Burn">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract, // owner's jetton wallet
            amount: toNano("0.05").toString(),  // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with a jetton burn body
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```


</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract,  // owner's jetton wallet
            amount: toNano("0.05").toString(),         // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with a jetton burn body
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: jettonWalletContract, // owner's jetton wallet
      amount: toNano("0.05").toString(), // for commission fees, excess will be returned
      payload: body.toBoc().toString("base64") // payload with a jetton burn body
    }
  ]
})
```

</TabItem>
</Tabs>

- `jettonWalletAddress` - Jetton Wallet contract address, that defined based on JettonMaser and Wallet contracts
- `amount` - Integer, amount of Toncoin for gas payments in nanotons.
- `body` - payload for the jetton wallet with the `burn#595f07bc` op code

</TabItem>
<TabItem value="assets/sdk" label="assets/sdk">

:::tip
Note: For the browser, you must set a polyfill for `Buffer`.
:::
For more examples, check [documentation](https://github.com/ton-community/assets-sdk)

```js
const NETWORK = "testnet";
const api = await createApi(NETWORK);
const provider = new TonConnectUI(); // OR you can use tonConnectUI as a provider from @tonconnect/ui-react

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const storage: PinataStorageParams = {
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretKey: process.env.PINATA_SECRET!,
};

const sdk = AssetsSDK.create({
  api,
  storage,
  sender,
});

const jetton = sdk.openJettonWallet(Address.parse("JETTON_ADDRESS"));

jetton.sendBurn(sender, toNano(10));
```

OR you can use Jetton Contract with built-in methods:

```ts
const provider = tonConnectUi;

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});

const jettonMaster = client.open(
  JettonMinter.createFromAddress(
    Address.parse("[JETTON_WALLET]"),
    new DefaultContentResolver()
  )
);

const jettonWalletAddress = await jettonMaster.getWalletAddress(
  sender.address!
);
const jettonContent = await jettonMaster.getContent();
const jettonDecimals = jettonContent.decimals ?? 9;

const jetton = client.open(JettonWallet.createFromAddress(jettonWalletAddress));

await jetton.sendBurn(
  sender,
  BigInt(1 * 10 ** jettonDecimals)
);

```


</TabItem>
</Tabs>

### NFT transfer

<Tabs groupId="NFT Transfer">
<TabItem value="@ton/ton" label="@ton/ton">
The `body` message typically should be done according the following way:

```js
import { beginCell, toNano } from '@ton/ton'

//  transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell)
//   forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody;

    const body = beginCell()
        .storeUint(0x5fcc3d14, 32)               // NFT transfer op code 0x5fcc3d14
        .storeUint(0, 64)                        // query_id:uint64
        .storeAddress(Address.parse(NEW_OWNER_WALLET)) // new_owner:MsgAddress
        .storeAddress(Address.parse(Wallet_DST))       // response_destination:MsgAddress
        .storeUint(0, 1)                         // custom_payload:(Maybe ^Cell)
        .storeCoins(1)                           // forward_amount:(VarUInteger 16) (1 nanoTon = toNano("0.000000001"))
        .storeUint(0,1)                          // forward_payload:(Either Cell ^Cell)
        .endCell();
```

`WALLET_DST` - Address - The address of the initial NFT owner for the receiving excess
Transfer the `NFTitem` to a new owner `NEW_OWNER_WALLET`.

<Tabs groupId="NFT Transfer">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: jettonWalletContract, // NFT Item address, which will be transferred
            amount: toNano("0.05").toString(),  // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with a NFT transfer body
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```


</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: NFTitem,  // NFT Item address, which will be transferred
            amount: toNano("0.05").toString(),  // for commission fees, excess will be returned
            payload: body.toBoc().toString("base64") // payload with a NFT transfer body
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: NFTitem, // NFT Item address, which will be transferred
      amount: toNano("0.05").toString(),  // for commission fees, excess will be returned
      payload: body.toBoc().toString("base64") // payload with a NFT transfer body
    }
  ]
})
```
</TabItem>
</Tabs>

- `NFTitem` - Address - The address of the NFT item smart contract which we want to transfer to a new owner `NEW_OWNER_WALLET`.
- `balance` - Integer, the amount of Toncoin used for gas payments in nanotons.
- `body` - payload for the NFT contract

</TabItem>

<TabItem value="assets/sdk" label="assets/sdk">

:::tip
Note: For the browser, you must set a polyfill for `Buffer`.
:::
For more examples, check [documentation](https://github.com/ton-community/assets-sdk)

```js
const NETWORK = "testnet";
const api = await createApi(NETWORK);
const provider = new TonConnectUI(); // OR you can use tonConnectUI as a provider from @tonconnect/ui-react

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);

const storage: PinataStorageParams = {
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretKey: process.env.PINATA_SECRET!,
};

const sdk = AssetsSDK.create({
  api,
  storage,
  sender,
});

const nft = sdk.openNftItem(Address.parse("NFT_ADDRESS"));
const RECEIVER_ADDRESS = Address.parse("RECIEVER_ADDRESS");

nft.send(sender, RECEIVER_ADDRESS);
```

OR you can use an NFT Contract with built-in methods:

```ts
const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});
const provider = tonConnectUi;
const nftItem = client.open(
  NftItem.createFromAddress(Address.parse("[NFT_WALLET]"))
);

// https://github.com/ton-community/assets-sdk/blob/main/examples/use-tonconnect.ts
const sender = new TonConnectSender(provider);
await nftItem.send(sender, Address.parse("[SENDER_WALLET]"));

// TIP: NFTs can include royalties, allowing creators to earn a percentage from each sale.
// Here is an example of how to get it.
const royalty = await nftItem.getRoyaltyParams();
const royaltyPercent =
  Number(royalty.numerator) / Number(royalty.denominator);
```

</TabItem>
</Tabs>

### NFT sale (GetGems)

Here is an example of preparing message and transaction for sale on GetGems marketplace, according to contract [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc).

To place NFT on the GetGems Sale Contract, we should prepare a special message body, `transferNftBody`, to transfer NFT to the special NFT Sale contract.
```js
    const transferNftBody = beginCell()
        .storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
        .storeUint(0, 64) // query_id
        .storeAddress(Address.parse(destinationAddress)) // new_owner - GetGems sale contracts deployer, should never change for this operation
        .storeAddress(Address.parse(walletAddress)) // response_destination for excesses
        .storeBit(0) // we do not have custom_payload
        .storeCoins(toNano("0.2")) // forward_amount
        .storeBit(0) // we store forward_payload is this cell
        .storeUint(0x0fe0ede, 31) // not 32, because previous 0 will be read as do_sale opcode in deployer
        .storeRef(stateInitCell)
        .storeRef(saleBody)
        .endCell();
```

Because the message requires a lot of steps, the entire algorithm is huge and can be found here:
<details>
    <summary>Show entire algorithm for the creating NFT Sale message body</summary>


```js
import { Address, beginCell, StateInit, storeStateInit, toNano, Cell } from '@ton/ton'

async function main() {
    // func:0.4.4 src:op-codes.fc, imports/stdlib.fc, nft-fixprice-sale-v3r3.fc
    // If GetGems updates its sale smart contract, you will need to obtain the new smart contract from https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/nft-fixprice-sale-v3/NftFixpriceSaleV3.source.ts.
    const NftFixPriceSaleV3R3CodeBoc = 'te6ccgECDwEAA5MAART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgL30A6GmBgLjYSS+CcH0gGHaiaGmAaY/9IH0gfSB9AGppj+mfmBg4KYVjgGAASpiFaY+F7xDhgEoYBWmfxwjFsxsLcxsrZBZjgsk5mW8oBfEV4ADJL4dwEuuk4QEWQIEV3RXgAJFZ2Ngp5OOC2HGBFWAA+WjKFkEINjYQQF1AYHAdFmCEAX14QBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkCH6RFtwgBDIywVQA88WAfoCy2rJcfsAJcIAJddJwgKwjhtQRSH6RFtwgBDIywVQA88WAfoCy2rJcfsAECOSNDTiWoMAGQwMWyy1DDQ0wchgCCw8tGVIsMAjhSBAlj4I1NBobwE+CMCoLkTsPLRlpEy4gHUMAH7AATwU8fHBbCOXRNfAzI3Nzc3BPoA+gD6ADBTIaEhocEB8tGYBdD6QPoA+kD6ADAwyDICzxZY+gIBzxZQBPoCyXAgEEgQNxBFEDQIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVOCz4wIwMTcowAPjAijAAOMCCMACCAkKCwCGNTs7U3THBZJfC+BRc8cF8uH0ghAFE42RGLry4fX6QDAQSBA3VTIIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVADiODmCEAX14QAYvvLhyVNGxwVRUscFFbHy4cpwIIIQX8w9FCGAEMjLBSjPFiH6Astqyx8Vyz8nzxYnzxYUygAj+gITygDJgwb7AHFwVBcAXjMQNBAjCMjLABfLH1AFzxZQA88WAc8WAfoCzMsfyz/J7VQAGDY3EDhHZRRDMHDwBQAgmFVEECQQI/AF4F8KhA/y8ADsIfpEW3CAEMjLBVADzxYB+gLLaslx+wBwIIIQX8w9FMjLH1Iwyz8kzxZQBM8WE8oAggnJw4D6AhLKAMlxgBjIywUnzxZw+gLLaswl+kRbyYMG+wBxVWD4IwEIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVACHvOFnaiaGmAaY/9IH0gfSB9AGppj+mfmC3ofSB9AH0gfQAYKaFQkNDggPlozJP9Ii2TfSItkf0iLcEIIySsKAVgAKrAQAgb7l72omhpgGmP/SB9IH0gfQBqaY/pn5gBaH0gfQB9IH0AGCmxUJDQ4ID5aM0U/SItlH0iLZH9Ii2F4ACFiBqqiU'
    const NftFixPriceSaleV3R3CodeCell = Cell.fromBoc(Buffer.from(NftFixPriceSaleV3R3CodeBoc, 'base64'))[0]

    const marketplaceAddress = Address.parse('EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS'); // GetGems Address
    const marketplaceFeeAddress = Address.parse('EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS'); // GetGems Address for Fees
    const destinationAddress = Address.parse("EQAIFunALREOeQ99syMbO6sSzM_Fa1RsPD5TBoS0qVeKQ-AR"); // GetGems sale contracts deployer

    const walletAddress = Address.parse('EQArLGBnGPvkxaJE57Y6oS4rwzDWuOE8l8_sghntXLkIt162');
    const royaltyAddress = Address.parse('EQArLGBnGPvkxaJE57Y6oS4rwzDWuOE8l8_sghntXLkIt162');
    const nftAddress = Address.parse('EQCUWoe7hLlklVxH8gduCf45vPNocsjRP4wbX42UJ0Ja0S2f');
    const price = toNano("5"); // 5 TON

    const feesData = beginCell()
        .storeAddress(marketplaceFeeAddress)
        // 5% - GetGems fee
        .storeCoins(price / BigInt(100) * BigInt(5))
        .storeAddress(royaltyAddress)
        // 5% - Royalty, can be changed
        .storeCoins(price / BigInt(100) * BigInt(5))
        .endCell();

    const saleData = beginCell()
        .storeBit(0) // is_complete
        .storeUint(Math.round(Date.now() / 1000), 32) // created_at
        .storeAddress(marketplaceAddress) // marketplace_address
        .storeAddress(nftAddress) // nft_address
        .storeAddress(walletAddress) // previous_owner_address
        .storeCoins(price) // full price in nanotons
        .storeRef(feesData) // fees_cell
        .storeUint(0, 32) // sold_at
        .storeUint(0, 64) // query_id
        .endCell();

    const stateInit: StateInit = {
        code: NftFixPriceSaleV3R3CodeCell,
        data: saleData
    };
    const stateInitCell = beginCell()
        .store(storeStateInit(stateInit))
        .endCell();

    // not needed, just for example
    const saleContractAddress = new Address(0, stateInitCell.hash());

    const saleBody = beginCell()
        .storeUint(1, 32) // just accept coins on deploy
        .storeUint(0, 64)
        .endCell();

    const transferNftBody = beginCell()
        .storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
        .storeUint(0, 64) // query_id
        .storeAddress(destinationAddress) // new_owner
        .storeAddress(walletAddress) // response_destination for excesses
        .storeBit(0) // we do not have custom_payload
        .storeCoins(toNano("0.2")) // forward_amount
        .storeBit(0) // we store forward_payload is this cell
        .storeUint(0x0fe0ede, 31) // not 32, because we stored 0 bit before | do_sale opcode for deployer
        .storeRef(stateInitCell)
        .storeRef(saleBody)
        .endCell();
}
```

</details>

The prepared `transferNftBody` should be sent to the NFT Item contract with at least `1.08` TON, which is expected for successful processing. Excess will be returned to a sender's wallet.

<Tabs groupId="NFT Sale Fix Price">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: NFTitem, //address of the NFT Item contract, that should be placed on market
            amount: toNano("0.3").toString(), // amount that will require on gas fees, excess will be return
            payload: transferNftBody.toBoc().toString("base64") // payload with the transferNftBody message
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```

</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: NFTitem, //address of NFT Item contract, that should be placed on market
            amount: toNano("0.3").toString(), // amount that will require on gas fees, excess will be return
            payload: transferNftBody.toBoc().toString("base64") // payload with the transferNftBody message
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>

<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
await connector.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: NFTitem, //address of NFT Item contract, that should be placed on market
      amount: toNano("0.3").toString(), // amount that will require on gas fees, excess will be return
      payload: transferNftBody.toBoc().toString("base64") // payload with the transferNftBody message
    }
  ]
})
```
</TabItem>
</Tabs>

### NFT buy (GetGems)

<Tabs groupId="NFT Buy tabs">
<TabItem value="@ton/ton" label="@ton/ton">

The process of buying NFT for [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) sale contract could be carried out with a regular transfer without payload. The only important thing is the accurate TON amount, which is calculated as follows:
`buyAmount = Nftprice TON + 1.0 TON`.

<Tabs groupId="NFT Buy">
<TabItem value="tonconnect-react-ui" label="@tonconnect/react-ui">

```js
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/ton'

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: nftSaleContract,  // NFT Sale contract, that is current desired NFT Item
            amount: toNano(buyAmount).toString(), // NFT Price + exactly 1 TON, excess will be returned
        }
    ]
}

export const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};
```


</TabItem>

<TabItem value="tonconnect-ui" label="@tonconnect/ui">

```js
import TonConnectUI from '@tonconnect/ui'
import { toNano } from '@ton/ton'

const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: nftSaleContract,  // NFT Sale contract, that is current desired NFT Item
            amount: toNano(buyAmount).toString(), // NFT Price + exactly 1 TON, excess will be returned
        }
    ]
}

const result = await tonConnectUI.sendTransaction(transaction)
```

</TabItem>
<TabItem value="tonconnect-sdk" label="@tonconnect/sdk">

```js
await connector.sendTransaction({
validUntil: Math.floor(Date.now() / 1000) + 360,
messages: [
    {
        address: nftSaleContract,  // NFT Sale contract, that is current desired NFT Item
        amount: toNano(buyAmount).toString(), // NFT Price + exactly 1 TON, excess will be returned
    }
]
})
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="assets/sdk" label="assets/sdk">

:::tip
Note: For the browser, you must set a polyfill for `Buffer`.
:::
For more examples, check [documentation](https://github.com/ton-community/assets-sdk)

```js
const nft = sdk.openNftSale(Address.parse("NFT_ADDRESS"));
nft.sendBuy(sdk.sender!, { queryId: BigInt(1) })
```

</TabItem>
</Tabs>

## TON Connect Python SDK

Python examples are using [PyTonConnect](https://github.com/XaBbl4/pytonconnect) and [pytoniq](https://github.com/yungwine/pytoniq).

```python
    from pytoniq_core import Address
    from pytonconnect import TonConnect
```

:::tip
Read examples [source](https://github.com/yungwine/ton-connect-examples/blob/master/main.py).
:::

### Regular TON transfer


```python
connector = TonConnect(
    manifest_url='https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect-manifest.json')
is_connected = await connector.restore_connection()

transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        {
            'address' :'0:0000000000000000000000000000000000000000000000000000000000000000', # destination address
            'amount' : 1000000000,  # amount should be specified in nanocoins, 1 TON
        }
    ]
}
```


### Transfer with comment

At first order, implement a message with comment via the following function:

```python
    def get_comment_message(destination_address: str, amount: int, comment: str) -> dict:

        data = {
            'address': destination_address,
            'amount': str(amount),
            'payload': urlsafe_b64encode(
                begin_cell()
                .store_uint(0, 32)  # op code for comment message
                .store_string(comment)  # store comment
                .end_cell()  # end cell
                .to_boc()  # convert it to boc
            )
            .decode()  # encode it to urlsafe base64
        }

        return data
```

Final transaction body for transfer with comment:

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_comment_message(
            destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
            amount=int(0.01 * 10**9),  # amount should be specified in nanocoins
            comment='hello world!'
        )
    ]
}
```
:::tip
Learn more about [TON smart contract addresses](/v3/documentation/smart-contracts/addresses).
:::

### Jetton transfer

Example of function for building jetton transfer transaction. Please note that the number of decimals can vary between different tokens: for example, USDT uses 6 decimals (1 USDT = 1 × 10<sup>6</sup>), while TON uses 9 decimals (1 TON = 1 × 10<sup>9</sup>).

```python
from pytoniq_core import begin_cell
from base64 import urlsafe_b64encode

def get_jetton_transfer_message(jetton_wallet_address: str, recipient_address: str, transfer_fee: int, jettons_amount: int, response_address: str = None) -> dict:
    data = {
        'address': jetton_wallet_address,
        'amount': str(transfer_fee),
        'payload': urlsafe_b64encode(
        begin_cell()
        .store_uint(0xf8a7ea5, 32)  # op code for jetton transfer message
        .store_uint(0, 64)  # query_id
        .store_coins(jettons_amount) # Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Exapmple: 1 USDT = 1 * 10**6 and 1 TON = 1 * 10**9
        .store_address(recipient_address)  # destination address
        .store_address(response_address or recipient_address)  # address send excess to
        .store_uint(0, 1)  # custom payload
        .store_coins(1)  # forward amount
        .store_uint(0, 1)  # forward payload
        .end_cell()  # end cell
        .to_boc()  # convert it to boc
        )
        .decode()  # encode it to urlsafe base64
    }

    return data
```

Final transaction body:


```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_jetton_transfer_message(
        jetton_wallet_address='EQCXsVvdxTVmSIvYv4tTQoQ-0Yq9mERGTKfbsIhedbN5vTVV',
        recipient_address='0:0000000000000000000000000000000000000000000000000000000000000000',
        transfer_fee=int(0.07 * 10**9),
        jettons_amount=int(0.01 * 10**9),  # replace 9 for jetton decimal. For example for USDT it should be (amount * 10**6)
        response_address=wallet_address
        ),
    ]
}

```


### Jetton burn

Example of function for building jetton burn transaction. Please note that the number of decimals can vary between different tokens: for example, USDT uses 6 decimals (1 USDT = 1 × 10<sup>6</sup>), while TON uses 9 decimals (1 TON = 1 × 10<sup>9</sup>).

```python
from pytoniq_core import begin_cell
from base64 import urlsafe_b64encode

def get_jetton_burn_message(jetton_wallet_address: str, transfer_fee: int, jettons_amount: int, response_address: str = None) -> dict:
    data = {
        'address': jetton_wallet_address,
        'amount': str(transfer_fee),
        'payload': urlsafe_b64encode(
            begin_cell()
            .store_uint(0x595f07bc, 32)  # op code for jetton burn message
            .store_uint(0, 64)  # query_id
            .store_coins(jettons_amount) # Jetton amount in decimal (decimals = 6 - USDT, 9 - default)
            .store_address(response_address)  # address send excess to
            .end_cell()  # end cell
            .to_boc()  # convert it to boc
        )
        .decode()  # encode it to urlsafe base64
    }
    return data
```

The final transaction body:

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_jetton_burn_message(
            jetton_wallet_address='EQCXsVvdxTVmSIvYv4tTQoQ-0Yq9mERGTKfbsIhedbN5vTVV',
            transfer_fee=int(0.07 * 10 ** 9),
            jettons_amount=int(0.01 * 10 ** 9),  # replace 9 for jetton decimal. For example for jUSDT it should be (amount * 10**6)
            response_address=wallet_address
        ),
    ]
}
```


### NFT transfer

Example of function for a NFT transfer transaction:


```python
from pytoniq_core import begin_cell
from base64 import urlsafe_b64encode


def get_nft_transfer_message(nft_address: str, recipient_address: str, transfer_fee: int, response_address: str = None) -> dict:
    data = {
        'address': nft_address,
        'amount': str(transfer_fee),
        'payload': urlsafe_b64encode(
            begin_cell()
            .store_uint(0x5fcc3d14, 32)  # op code for nft transfer message
            .store_uint(0, 64)  # query_id
            .store_address(recipient_address)  # new owner
            .store_address(response_address or recipient_address)  # address send excess to
            .store_uint(0, 1)  # custom payload
            .store_coins(1)  # forward amount (0.000000001 * 10 ** 9) = 1 nanoTon
            .store_uint(0, 1)  # forward payload
            .end_cell()  # end cell
            .to_boc()  # convert it to boc
        )
        .decode()  # encode it to urlsafe base64
    }
    return data

```

The final transaction body:

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_nft_transfer_message(
            nft_address='EQDrA-3zsJXTfGo_Vdzg8d07Da4vSdHZllc6W9qvoNoMstF-',
            recipient_address='0:0000000000000000000000000000000000000000000000000000000000000000',
            transfer_fee=int(0.07 * 10**9),
            response_address=wallet_address
        ),
    ]
}
```


### NFT sale (GetGems)


Here is an example of preparing message and transaction for sale on GetGems marketplace, according to contract [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc).

To place NFT on GetGems Sale contract, we should prepare special message body `transferNftBody` that will be transfer NFT to special NFT Sale contract.


<details>
<summary>Example of creating NFT Sale Body</summary>

```python
import time
from base64 import urlsafe_b64encode

from pytoniq_core.boc import Cell, begin_cell, Address
from pytoniq_core.tlb import StateInit


def get_sale_body(wallet_address: str, royalty_address: str, nft_address: str, price: int, amount: int):
    # func:0.4.4 src:op-codes.fc, imports/stdlib.fc, nft-fixprice-sale-v3r3.fc
    # If GetGems updates its sale smart contract, you will need to obtain the new smart contract from https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/nft-fixprice-sale-v3/NftFixpriceSaleV3.source.ts.
    nft_sale_code_cell = Cell.one_from_boc('te6ccgECDwEAA5MAART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgL30A6GmBgLjYSS+CcH0gGHaiaGmAaY/9IH0gfSB9AGppj+mfmBg4KYVjgGAASpiFaY+F7xDhgEoYBWmfxwjFsxsLcxsrZBZjgsk5mW8oBfEV4ADJL4dwEuuk4QEWQIEV3RXgAJFZ2Ngp5OOC2HGBFWAA+WjKFkEINjYQQF1AYHAdFmCEAX14QBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkCH6RFtwgBDIywVQA88WAfoCy2rJcfsAJcIAJddJwgKwjhtQRSH6RFtwgBDIywVQA88WAfoCy2rJcfsAECOSNDTiWoMAGQwMWyy1DDQ0wchgCCw8tGVIsMAjhSBAlj4I1NBobwE+CMCoLkTsPLRlpEy4gHUMAH7AATwU8fHBbCOXRNfAzI3Nzc3BPoA+gD6ADBTIaEhocEB8tGYBdD6QPoA+kD6ADAwyDICzxZY+gIBzxZQBPoCyXAgEEgQNxBFEDQIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVOCz4wIwMTcowAPjAijAAOMCCMACCAkKCwCGNTs7U3THBZJfC+BRc8cF8uH0ghAFE42RGLry4fX6QDAQSBA3VTIIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVADiODmCEAX14QAYvvLhyVNGxwVRUscFFbHy4cpwIIIQX8w9FCGAEMjLBSjPFiH6Astqyx8Vyz8nzxYnzxYUygAj+gITygDJgwb7AHFwVBcAXjMQNBAjCMjLABfLH1AFzxZQA88WAc8WAfoCzMsfyz/J7VQAGDY3EDhHZRRDMHDwBQAgmFVEECQQI/AF4F8KhA/y8ADsIfpEW3CAEMjLBVADzxYB+gLLaslx+wBwIIIQX8w9FMjLH1Iwyz8kzxZQBM8WE8oAggnJw4D6AhLKAMlxgBjIywUnzxZw+gLLaswl+kRbyYMG+wBxVWD4IwEIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVACHvOFnaiaGmAaY/9IH0gfSB9AGppj+mfmC3ofSB9AH0gfQAYKaFQkNDggPlozJP9Ii2TfSItkf0iLcEIIySsKAVgAKrAQAgb7l72omhpgGmP/SB9IH0gfQBqaY/pn5gBaH0gfQB9IH0AGCmxUJDQ4ID5aM0U/SItlH0iLZH9Ii2F4ACFiBqqiU')

    # fees cell

    marketplace_address = Address('EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS')
    marketplace_fee_address = Address('EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS')
    destination_address = Address('EQAIFunALREOeQ99syMbO6sSzM_Fa1RsPD5TBoS0qVeKQ-AR')

    wallet_address = Address(wallet_address)
    royalty_address = Address(royalty_address)
    nft_address = Address(nft_address)

    marketplace_fee = int(price * 5 / 100)  # 5%
    royalty_fee = int(price * 5 / 100)  # 5%

    fees_data_cell = (begin_cell()
                      .store_address(marketplace_fee_address)
                      .store_coins(marketplace_fee)
                      .store_address(royalty_address)
                      .store_coins(royalty_fee)
                      .end_cell())


    sale_data_cell = (begin_cell()
                      .store_bit_int(0) # is_complete
                      .store_uint(int(time.time()), 32) # created_at
                      .store_address(marketplace_address)
                      .store_address(nft_address)
                      .store_address(wallet_address)
                      .store_coins(price)
                      .store_ref(fees_data_cell)
                      .store_uint(0, 32) # sold_at
                      .store_uint(0, 64) # query_id
                      .end_cell())

    # not needed, just for example
    state_init_cell = StateInit(code=nft_sale_code_cell, data=sale_data_cell).serialize()

    sale_body = (begin_cell()
                 .store_uint(1, 32) # just accept coins on deploy
                 .store_uint(0, 64)
                 .end_cell())

    transfer_nft_body = (begin_cell()
                         .store_uint(0x5fcc3d14, 32) # Opcode for NFT transfer
                         .store_uint(0, 64) # query_id
                         .store_address(destination_address)
                         .store_address(wallet_address)
                         .store_bit_int(0) # we do not have custom_payload
                         .store_coins(int(0.2 * 10**9)) # forward_amount
                         .store_bit_int(0) # we store forward_payload is this cell
                         .store_uint(0x0fe0ede, 31) # not 32, because we stored 0 bit before | do_sale opcode for deployer
                         .store_ref(state_init_cell)
                         .store_ref(sale_body)
                         .end_cell())

    data = {
        'address': nft_address.to_str(),
        'amount': str(amount),
        'payload': urlsafe_b64encode(transfer_nft_body.to_boc()).decode()
    }

    return data
```

</details>

The final transaction body:

```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        get_sale_body(
            nft_address='EQDrA-3zsJXTfGo_Vdzg8d07Da4vSdHZllc6W9qvoNoMstF-',
            wallet_address='0:0000000000000000000000000000000000000000000000000000000000000000',
            royalty_address='0:0000000000000000000000000000000000000000000000000000000000000000',
            price=int(5 * 10**9),
            amount=int(0.3 * 10**9)
        ),
    ]
}
```

### NFT buy (GetGems)

The process of buy NFT for [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) sale contract could be carry out with regular transfer without payload, the only important thing is accurate TON amount, that calculates as follows:
`buyAmount = Nftprice TON + 1.0 TON`.


```python
transaction = {
    'valid_until': int(time.time() + 3600),
    'messages': [
        {
            'address': nft_address,
            'amount': buyAmount,
        }
    ]
}
```

## TON Connect Go SDK

Go examples are using [tonconnect](https://github.com/cameo-engineering/tonconnect) and [tonutils-go](https://github.com/xssnick/tonutils-go).

```go
import "github.com/cameo-engineering/tonconnect"
import "github.com/xssnick/tonutils-go/address"
```

:::tip
Read [tonconnect](https://github.com/cameo-engineering/tonconnect/blob/master/examples/basic/main.go) and [tonutils-go](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#how-to-use) examples.
:::

There you can find how to create a tonconnect session and send a transaction constructed with messages.

```go
s, _ := tonconnect.NewSession()
// create ton links
// ...
// create new message msg and transaction
boc, _ := s.SendTransaction(ctx, *tx)
```

In further examples, only messages and transactions will be created.

### Regular TON transfer

Example of function for building regular TON transfer message:

```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
)

func Transfer(dest string, amount uint64) (*tonconnect.Message, error) {
	msg, err := tonconnect.NewMessage(
		dest,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
	)
	return msg, err
}
```
Final transaction body:

```go
msg, err := Transfer("0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbLZ", uint64(math.Pow(10, 9)))
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

### Transfer with comment

Example of function for building transfer with comment message:

```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func TransferWithComment(dest string, amount uint64, comment string) (*tonconnect.Message, error) {
	payload, _ := cell.BeginCell().
		MustStoreUInt(0, 32).
		MustStoreStringSnake(comment).
		EndCell().MarshalJSON()
	msg, err := tonconnect.NewMessage(
		dest,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
		tonconnect.WithPayload(payload))
	return msg, err
}
```
Final transaction body:

```go
msg, err := TransferWithComment("0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbLZ", uint64(math.Pow(10, 9)), "new comment")
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

### Jetton transfer

Example of function for jetton transfer message. Please note that the number of decimals can vary between different tokens: for example, USDT uses 6 decimals (1 USDT = 1 × 10<sup>6</sup>), while TON uses 9 decimals (1 TON = 1 × 10<sup>9</sup>).

```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func JettonTransferMessage(jetton_wallet_address string, amount uint64,
	jettons_amount uint64, recipient_address, response_address string,
	fwd_amount uint64, fwd_payload *cell.Cell) (*tonconnect.Message, error) {
	payload, _ := cell.BeginCell().
		MustStoreUInt(0xf8a7ea5, 32). // op code for jetton transfer message (op::transfer)
		MustStoreUInt(0, 64).         // query_id
		MustStoreCoins(jettons_amount). // Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Exapmple: 1 USDT = 1 * 10**6 and 1 TON = 1 * 10**9
		MustStoreAddr(address.MustParseAddr(recipient_address)). // address send excess to
		MustStoreAddr(address.MustParseAddr(response_address)).
		MustStoreUInt(0, 1).        // custom payload
		MustStoreCoins(fwd_amount). // set 0 if don't want transfer notification
		MustStoreMaybeRef(fwd_payload).
		EndCell().MarshalJSON()

	msg, err := tonconnect.NewMessage(
		jetton_wallet_address,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
		tonconnect.WithPayload(payload))

	if err != nil {
		return nil, err
	}

	return msg, nil
}
```

Final transaction body:

```go
msg, err := JettonTransferMessage("kQA8Q7m_pSNPr6FcqRYxllpAZv-0ieXy_KYER2iP195hBXiX",
                                    uint64(math.Pow(10, 9)),
                                    uint64(10),
                                    "0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbL2",
                                    "EQBuObr2M7glm08w6cBGjIuuCbmvBFGwuVs6qb3AQpac9XpX",
                                    uint64(0), nil)
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

### Jetton burn

Example of function for jetton burn message. Please note that the number of decimals can vary between different tokens: for example, USDT uses 6 decimals (1 USDT = 1 × 10<sup>6</sup>), while TON uses 9 decimals (1 TON = 1 × 10<sup>9</sup>).


```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func JettonBurnMessage(jetton_wallet_address string, amount uint64,
	jettons_amount uint64, response_address string) (*tonconnect.Message, error) {

	payload, _ := cell.BeginCell().
		MustStoreUInt(0xf8a7ea5, 32).                           // op code for jetton burn message (op::burn)
		MustStoreUInt(0, 64).                                   // query_id
		MustStoreCoins(jettons_amount).                         // Jetton amount in decimal (decimals = 6 - USDT, 9 - default)
		MustStoreAddr(address.MustParseAddr(response_address)). // address send excess to
		EndCell().MarshalJSON()

	msg, err := tonconnect.NewMessage(
		jetton_wallet_address,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
		tonconnect.WithPayload(payload))

	if err != nil {
		return nil, err
	}

	return msg, nil
}
```

Final transaction body:

```go
msg, err := JettonBurnMessage("kQA8Q7m_pSNPr6FcqRYxllpAZv-0ieXy_KYER2iP195hBXiX",
                                uint64(math.Pow(10, 9)),
                                uint64(10),
                                "EQBuObr2M7glm08w6cBGjIuuCbmvBFGwuVs6qb3AQpac9XpX")
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

### NFT transfer

Example of function for NFT transfer message:

```go
import (
	"fmt"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func NftTransferMessage(nft_address string, amount uint64, recipient_address, response_address string,
	fwd_amount uint64, fwd_payload *cell.Cell) (*tonconnect.Message, error) {

	payload, _ := cell.BeginCell().
		MustStoreUInt(0x5fcc3d14, 32).                           // op code for nft transfer message (op::transfer())
		MustStoreUInt(0, 64).                                    // query_id
		MustStoreAddr(address.MustParseAddr(recipient_address)). // new owner
		MustStoreAddr(address.MustParseAddr(response_address)).  // address send excess to
		MustStoreUInt(0, 1).                                     // custom payload
		MustStoreCoins(fwd_amount).                              // set 0 if don't want transfer notification
		MustStoreMaybeRef(fwd_payload).
		EndCell().MarshalJSON()

	msg, err := tonconnect.NewMessage(
		nft_address,
		fmt.Sprintf("%d", amount), // nanocoins to transfer/compute message
		tonconnect.WithPayload(payload))

	if err != nil {
		return nil, err
	}

	return msg, nil
}
```

Final transaction body:

```go
msg, err := NftTransferMessage("EQDrA-3zsJXTfGo_Vdzg8d07Da4vSdHZllc6W9qvoNoMstF-",
                                uint64(math.Pow(10, 9)),
                                "0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbL2",
                                "0QBZ_35Wy144n2GBM93YpcV4KOKcIjDJk8DdX4kyXEEHcbL2",
                                uint64(0), nil)
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

### NFT sale (GetGems)

Here is an example of preparing a message and transaction for sale on the GetGems marketplace, according to contract [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc).

To place NFT on the GetGems Sale contract, we should prepare a special message body, `transferNftBody` that will transfer NFT to the special NFT Sale contract.
```go
transferNftBody := cell.BeginCell().
    MustStoreUInt(0x5fcc3d14, 32).        // opcode for NFT transfer
    MustStoreUInt(0, 64).                 // query_id
    MustStoreAddress(destinationAddress). // new_owner - GetGems sale contracts deployer, should never change for this operation
    MustStoreAddress(walletAddress).      // response_destination for excesses
    MustStoreUInt(0, 1).                  // we do not have custom_payload
    MustStoreCoins(0.2*math.Pow(10, 9)).  // forward_amount
    MustStoreUInt(0, 1).                  // we store forward_payload is this cell
    MustStoreUInt(0x0fe0ede, 31).         // not 32, because previous 0 will be read as do_sale opcode in deployer (op::do_sale)
    MustStoreRef(stateInitCell).
    MustStoreRef(saleBody).
    EndCell()
```

Because the message requires a lot of steps, the entire algorithm is huge and can be found here:
<details>
    <summary>Show entire algorithm for the creating NFT Sale message body</summary>

```go
import (
	"fmt"
	"math"
	"time"

	"github.com/cameo-engineering/tonconnect"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func NftSaleMessage(wallet, royalty, nft string, amount, price uint64) (*tonconnect.Message, error) {
    // func:0.4.4 src:op-codes.fc, imports/stdlib.fc, nft-fixprice-sale-v3r3.fc
    // If GetGems updates its sale smart contract, you will need to obtain the new smart contract from https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/nft-fixprice-sale-v3/NftFixpriceSaleV3.source.ts.
	fixPriceV3R3Code := new(cell.Cell)
	fixPriceV3R3Code.UnmarshalJSON([]byte("te6ccgECDwEAA5MAART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgL30A6GmBgLjYSS+CcH0gGHaiaGmAaY/9IH0gfSB9AGppj+mfmBg4KYVjgGAASpiFaY+F7xDhgEoYBWmfxwjFsxsLcxsrZBZjgsk5mW8oBfEV4ADJL4dwEuuk4QEWQIEV3RXgAJFZ2Ngp5OOC2HGBFWAA+WjKFkEINjYQQF1AYHAdFmCEAX14QBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkCH6RFtwgBDIywVQA88WAfoCy2rJcfsAJcIAJddJwgKwjhtQRSH6RFtwgBDIywVQA88WAfoCy2rJcfsAECOSNDTiWoMAGQwMWyy1DDQ0wchgCCw8tGVIsMAjhSBAlj4I1NBobwE+CMCoLkTsPLRlpEy4gHUMAH7AATwU8fHBbCOXRNfAzI3Nzc3BPoA+gD6ADBTIaEhocEB8tGYBdD6QPoA+kD6ADAwyDICzxZY+gIBzxZQBPoCyXAgEEgQNxBFEDQIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVOCz4wIwMTcowAPjAijAAOMCCMACCAkKCwCGNTs7U3THBZJfC+BRc8cF8uH0ghAFE42RGLry4fX6QDAQSBA3VTIIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVADiODmCEAX14QAYvvLhyVNGxwVRUscFFbHy4cpwIIIQX8w9FCGAEMjLBSjPFiH6Astqyx8Vyz8nzxYnzxYUygAj+gITygDJgwb7AHFwVBcAXjMQNBAjCMjLABfLH1AFzxZQA88WAc8WAfoCzMsfyz/J7VQAGDY3EDhHZRRDMHDwBQAgmFVEECQQI/AF4F8KhA/y8ADsIfpEW3CAEMjLBVADzxYB+gLLaslx+wBwIIIQX8w9FMjLH1Iwyz8kzxZQBM8WE8oAggnJw4D6AhLKAMlxgBjIywUnzxZw+gLLaswl+kRbyYMG+wBxVWD4IwEIyMsAF8sfUAXPFlADzxYBzxYB+gLMyx/LP8ntVACHvOFnaiaGmAaY/9IH0gfSB9AGppj+mfmC3ofSB9AH0gfQAYKaFQkNDggPlozJP9Ii2TfSItkf0iLcEIIySsKAVgAKrAQAgb7l72omhpgGmP/SB9IH0gfQBqaY/pn5gBaH0gfQB9IH0AGCmxUJDQ4ID5aM0U/SItlH0iLZH9Ii2F4ACFiBqqiU"))

	marketplaceAddress := address.MustParseAddr("EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS")    // GetGems Address
	marketplaceFeeAddress := address.MustParseAddr("EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS") // GetGems Address for Fees
	destinationAddress := address.MustParseAddr("EQAIFunALREOeQ99syMbO6sSzM_Fa1RsPD5TBoS0qVeKQ-AR")    // GetGems sale contracts deployer

	walletAddress := address.MustParseAddr(wallet)
	royaltyAddress := address.MustParseAddr(royalty)
	nftAddress := address.MustParseAddr(nft)

	feesData := cell.BeginCell().
		MustStoreAddr(marketplaceFeeAddress).
		// 5% - GetGems fee
		MustStoreCoins(price * 100 * 5).
		MustStoreAddr(royaltyAddress).
		// 5% - Royalty, can be changed
		MustStoreCoins(price / 100 * 5).
		EndCell()

	saleData := cell.BeginCell().
		MustStoreUInt(0, 1).                                // is_complete
		MustStoreUInt(uint64(time.Now().UTC().Unix()), 32). // created_at
		MustStoreAddr(marketplaceAddress).                  // marketplace_address
		MustStoreAddr(nftAddress).                          // nft_address
		MustStoreAddr(walletAddress).                       // previous_owner_address
		MustStoreCoins(price).                              // full price in nanotons
		MustStoreRef(feesData).                             // fees_cell
		MustStoreUInt(0, 32).                               // sold_at
        MustStoreUInt(0, 64).                               // query_id
		EndCell()

	stateInit := &tlb.StateInit{
		Data: saleData,
		Code: fixPriceV3R3Code,
	}

	stateInitCell, err := tlb.ToCell(stateInit)
	if err != nil {
		return nil, err
	}

	// not needed, just for example
	// saleContractAddress := address.NewAddress(0, 0, stateInitCell.Hash())

	saleBody := cell.BeginCell().
		MustStoreUInt(1, 32). // just accept coins on deploy
		MustStoreUInt(0, 64).
		EndCell()

	transferNftBody, err := cell.BeginCell().
		MustStoreUInt(0x5fcc3d14, 32).             // opcode for NFT transfer
		MustStoreUInt(0, 64).                      // query_id
		MustStoreAddr(destinationAddress).         // new_owner - GetGems sale contracts deployer, should never change for this operation
		MustStoreAddr(walletAddress).              // response_destination for excesses
		MustStoreUInt(0, 1).                       // we do not have custom_payload
		MustStoreCoins(uint64(0.2*math.Pow(10, 9))). // forward_amount
		MustStoreUInt(0, 1).                       // we store forward_payload is this cell
		MustStoreUInt(0x0fe0ede, 31).              // not 32, because previous 0 will be read as do_sale opcode in deployer (op::do_sale)
		MustStoreRef(stateInitCell).
		MustStoreRef(saleBody).
		EndCell().MarshalJSON()

	if err != nil {
		return nil, err
	}

	msg, err := tonconnect.NewMessage(
		nftAddress.String(),
		fmt.Sprintf("%d", amount),
		tonconnect.WithPayload(transferNftBody))

	if err != nil {
		return nil, err
	}

	return msg, nil
}
```

The final transaction body:

```go
msg, err := NftSaleMessage("EQArLGBnGPvkxaJE57Y6oS4rwzDWuOE8l8_sghntXLkIt162",
                            "EQArLGBnGPvkxaJE57Y6oS4rwzDWuOE8l8_sghntXLkIt162",
                            "EQCUWoe7hLlklVxH8gduCf45vPNocsjRP4wbX42UJ0Ja0S2f",
                            uint64(0.3*math.Pow(10, 9)), uint64(5*math.Pow(10, 9)))
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

</details>

### NFT buy (GetGems)

The process of buying NFT for [nft-fixprice-sale-v3r3](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v3r3.fc) sale contract could be carried out with a regular transfer without payload; the only important thing is an accurate TON amount, which is calculated as follows:
`buyAmount = Nftprice TON + 1.0 TON`.

```go
msg, err := tonconnect.NewMessage(nftAddress, buyAmount)
if err != nil {
    log.Fatal(err)
}
tx, err := tonconnect.NewTransaction(
    tonconnect.WithTimeout(10*time.Minute),
    tonconnect.WithTestnet(),
    tonconnect.WithMessage(*msg),
)
if err != nil {
    log.Fatal(err)
}
```

## Authors
- JavaScript examples — _[@aSpite](https://t.me/aspite)_
- Python examples — _[@yunwine](https://t.me/yungwine)_
- Go examples — _[@gleb498](https://t.me/gleb498)_

## See also
* [TON Connect SDKs](/v3/guidelines/ton-connect/guidelines/developers)
* [TON Connect - sending messages](/v3/guidelines/ton-connect/guidelines/sending-messages)
* [Smart contract development - sending messages](/v3/documentation/smart-contracts/message-management/sending-messages)
* [TON jetton processing](/v3/guidelines/dapps/asset-processing/jettons)
* [NFT processing on TON](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/guidelines/sending-messages.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/guidelines/sending-messages.md
================================================
import Feedback from '@site/src/components/Feedback';

# Sending messages

TON Connect has more powerful options than just authenticating users in the dApp; it also allows sending outgoing messages via connected wallets.

You will understand:
- how to send messages from the DApp to the blockchain
- how to send multiple messages in one transaction
- how to deploy a contract using TON Connect

## Playground page

We will use the low level [TON Connect SDK](https://github.com/ton-connect/sdk/tree/main/packages/sdk) for JavaScript. We'll experiment in the browser console on a page where the wallet is already connected. Here is the sample page:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js"></script>
    <script src="https://unpkg.com/tonweb@0.0.41/dist/tonweb.js"></script>
  </head>
  <body>
    <script>
      window.onload = async () => {
        window.connector = new TonConnectSDK.TonConnect({
          manifestUrl: 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'
        });
        connector.restoreConnection();
      }
    </script>
  </body>
</html>
```

Feel free to copy-paste it into your browser console and run it.

## Sending multiple messages

### Understanding a task

We will send two messages in one transaction: one to your address, carrying 0.2 TON, and one to the other wallet address, carrying 0.1 TON.

By the way, there is a limit to the number of messages sent in one transaction:
- standard ([v3](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v3)/[v4](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4)) wallets: 4 outgoing messages;
- highload wallets: 255 outgoing messages (close to blockchain limitations).

### Sending the messages

Run the following code:

```js
console.log(await connector.sendTransaction({
  validUntil: Math.floor(new Date() / 1000) + 360,
  messages: [
    {
      address: connector.wallet.account.address,
      amount: "200000000"
    },
    {
      address: "EQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrSD7",
      amount: "100000000"
    }
  ]
}));
```

You'll notice that this command does not print anything into the console, `null` or `undefined`, as functions returning nothing do. This means that `connector.sendTransaction` does not exit immediately.

Open your wallet application, and you'll see why. There is a request showing what you are sending and where the coins would go. Please, accept it.


### Getting the result

The function will exit, and the output from the blockchain will be printed:

```json
{
  boc: "te6cckEBAwEA4QAC44gBZUPZ6qi8Dtmm1cot1P175lXUARlUVwlfMM19lkERK1oCUB3RqDxAFnPpeo191X/jiimn9Bwnq3zwcU/MMjHRNN5sC5tyymBV3SJ1rjyyscAjrDDFAIV/iE+WBySEPP9wCU1NGLsfcvVgAAACSAAYHAECAGhCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWoAmJaAAAAAAAAAAAAAAAAAAAAGZCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWnMS0AAAAAAAAAAAAAAAAAAADkk4U"
}
```

BoC is [bag of cells](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage), the way data is stored in TON. Now, we can decode it.

Decode this BoC in the tool of your choice, and you'll get the following tree of cells:

```bash
x{88016543D9EAA8BC0ED9A6D5CA2DD4FD7BE655D401195457095F30CD7D9641112B5A02501DD1A83C401673E97A8D7DD57FE38A29A7F41C27AB7CF0714FCC3231D134DE6C0B9B72CA6055DD2275AE3CB2B1C023AC30C500857F884F960724843CFF70094D4D18BB1F72F5600000024800181C_}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD6A00989680000000000000000000000000000}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD69CC4B40000000000000000000000000000}
```

This is a serialized external message, and two references are outgoing messages representations.

```bash
x{88016543D9EAA8BC0ED9A6D5CA2DD4FD7BE655D401195457095F30CD7D964111...
  $10       ext_in_msg_info
  $00       src:MsgAddressExt (null address)
  "EQ..."a  dest:MsgAddressInt (your wallet)
  0         import_fee:Grams
  $0        (no state_init)
  $0        (body starts in this cell)
  ...
```

Returning the BoC of the sent transaction is to track it.

### Processing transactions initiated with TON Connect

To find a transaction by `extInMsg`, you need to do the following:

1. Parse the received `extInMsg` as a cell.
2. Calculate the `hash()` of the obtained cell.

:::info
The received hash is what the `sendBocReturnHash` methods of TON Center API are already returning to you.
:::

3. Search for the required transaction using this hash through an indexer:

   - Using TON Center [api_v3_transactionsByMessage_get](https://toncenter.com/api/v3/#/default/get_transactions_by_message_api_v3_transactionsByMessage_get).

   - Using the `/v2/blockchain/messages/{msg_id}/transaction` method from [TON API](https://tonapi.io/api-v2).

   - Collect transactions independently and search for the required extInMsg by its hash: [see example](/v3/guidelines/dapps/cookbook#how-to-find-transaction-for-a-certain-ton-connect-result).

It's important to note that `extInMsg` may not be unique, which means collisions can occur. However, all transactions are unique.
If you are using this for an informative display, this method should be sufficient. With standard wallet contracts, collisions can occur only in exceptional situations.

## Sending complex transactions

### Serialization of cells

Before we proceed, let's talk about the format of the messages we will send.

* **payload** (string base64, optional): raw one-cell BoC encoded in Base64.
  * We will use it to store text comments on transfer
* **stateInit** (string base64, optional): raw one-cell BoC encoded in Base64.
  * We will use it to deploy a smart contract

After building a message, you can serialize it into BoC. 

```js
TonWeb.utils.bytesToBase64(await payloadCell.toBoc())
```

### Transfer with comment

You can use [toncenter/tonweb](https://github.com/toncenter/tonweb) JS SDK or your favourite tool to serialize cells to BoC.

Text comments on transfer are encoded as opcode 0 (32 zero bits) + UTF-8 bytes of comment. Here's an example of how to convert it into a bag of cells.

```js
let a = new TonWeb.boc.Cell();
a.bits.writeUint(0, 32);
a.bits.writeString("TON Connect tutorial!");
let payload = TonWeb.utils.bytesToBase64(await a.toBoc());

console.log(payload);
// te6ccsEBAQEAHQAAADYAAAAAVE9OIENvbm5lY3QgMiB0dXRvcmlhbCFdy+mw
```

### Smart contract deployment

And we'll deploy an instance of super simple [chatbot Doge](https://github.com/LaDoger/doge.fc), mentioned as one of [smart contract examples](/v3/documentation/smart-contracts/overview#examples-of-smart-contracts). First of all, we load its code and store something unique in data to receive our very own instance that someone else has not deployed. Then, we combine code and data into stateInit.

```js
let code = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes('te6cckEBAgEARAABFP8A9KQT9LzyyAsBAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AN4uuM8='));
let data = new TonWeb.boc.Cell();
data.bits.writeUint(Math.floor(new Date()), 64);

let state_init = new TonWeb.boc.Cell();
state_init.bits.writeUint(6, 5);
state_init.refs.push(code);
state_init.refs.push(data);

let state_init_boc = TonWeb.utils.bytesToBase64(await state_init.toBoc());
console.log(state_init_boc);
//  te6ccsEBBAEAUwAABRJJAgE0AQMBFP8A9KQT9LzyyAsCAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AAAQAAABhltsPJ+MirEd

let doge_address = '0:' + TonWeb.utils.bytesToHex(await state_init.hash());
console.log(doge_address);
//  0:1c7c35ed634e8fa796e02bbbe8a2605df0e2ab59d7ccb24ca42b1d5205c735ca
```

And it's time to send our transaction:

```js
console.log(await connector.sendTransaction({
  validUntil: Math.floor(new Date() / 1000) + 360,
  messages: [
    {
      address: "EQAcfDXtY06Pp5bgK7voomBd8OKrWdfMskykKx1SBcc1yh5O",
      amount: "69000000",
      payload: "te6ccsEBAQEAHQAAADYAAAAAVE9OIENvbm5lY3QgMiB0dXRvcmlhbCFdy+mw",
      stateInit: "te6ccsEBBAEAUwAABRJJAgE0AQMBFP8A9KQT9LzyyAsCAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AAAQAAABhltsPJ+MirEd"
    }
  ]
}));
```

:::info
Get more examples on the [Preparing messages](/v3/guidelines/ton-connect/guidelines/preparing-messages) page for Transfer NFT and Jettons.
:::

After confirmation, we may see our transaction complete at [tonscan.org](https://tonscan.org/tx/pCA8LzWlCRTBc33E2y-MYC7rhUiXkhODIobrZVVGORg=).

## What happens if the user rejects a transaction request?

It's pretty easy to handle request rejection, but it's better to know what would happen in advance when you're developing some project.

When a user clicks **Cancel** in the popup in the wallet application, an exception is thrown: 

```ts
Error: [TON_CONNECT_SDK_ERROR] The Wallet declined the request 
```

This error can be considered final (unlike connection cancellation) - if it has been raised, then the requested transaction will definitely not happen until the next request is sent.

## See also

* [Preparing messages](/v3/guidelines/ton-connect/guidelines/preparing-messages)

<Feedback />




================================================
FILE: docs/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';

# Verifying signed-in users on the backend

This page describes a method for the backend to ensure that the user truly owns the declared address.

Note that user verification is not required for all dApps.

It is helpful if you want to verify a user by providing them with their personal information from the backend.

## How does it work?

- User initiates the sign-in process.
- Backend generates a `ton_proof` entity and sends it to frontend.
- Frontend signs in to wallet using `ton_proof` and receives a signed `ton_proof`.
- Frontend sends signed `ton_proof` to backend for verification.


<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/ton-connect/ton_proof_scheme.svg?raw=true',
        dark: '/img/docs/ton-connect/ton_proof_scheme-dark.svg?raw=true',
    }}
/>
<br></br>

## Structure of the ton_proof

We will use the  `ton_proof`, implemented inside the connector.

```js
type TonProofItemReply = TonProofItemReplySuccess | TonProofItemReplyError;

type TonProofItemReplySuccess = {
  name: "ton_proof";
  proof: {
    timestamp: string; // 64-bit unix epoch time of the signing operation (seconds)
    domain: {
      lengthBytes: number; // AppDomain Length
      value: string;  // app domain name (as url part, without encoding)
    };
    signature: string; // base64-encoded signature
    payload: string; // payload from the request
  }
}

```

## Checking ton_proof on server side

1. Retrieve `TonProofItemReply` from a user.
2. Verify that the received domain corresponds to your application's domain.
3. Check if `TonProofItemReply.payload` is permitted by the original server and is still active.
4. Check if `timestamp` is actual at the moment.
5. Assemble a message according to the [message scheme](/v3/guidelines/ton-connect/guidelines/verifying-signed-in-users#concept-explanation).
6. Retrieve `public_key` either from API (a) or via back-end logic (b)
- 6a:
    - Retrieve `{public_key, address}` from the `walletStateInit` with [TON API](https://docs.tonconsole.com/tonapi#:~:text=/v2/-,tonconnect,-/stateinit) method `POST /v2/tonconnect/stateinit`.
    - Verify that the address extracted from `walletStateInit` to the wallet `address` declared by the user.
- 6b:
    - Obtain the wallet `public_key` via the wallet contract [get method](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc#L174).
    - If the contract is inactive or lacks the get_method found in older wallet versions (v1-v3), then obtaining the key in this manner will be impossible. Instead, you must parse the walletStateInit provided by the front end. Ensure that TonAddressItemReply.walletStateInit.hash() equals TonAddressItemReply.address.hash(), indicating a BoC hash.
7. Verify that the `signature` from the front end correctly signs the assembled message and matches the `public_key` of the address.

## React example

1. Add a token provider to the root of your app:

```tsx
function App() {
    const [token, setToken] = useState<string | null>(null);

  return (
      <BackendTokenContext.Provider value={{token, setToken}}>
            { /* Your app */ }
      </BackendTokenContext.Provider>
  )
}
```

2. Implement authentication on the front end with backend integration:

<details>
<summary>Example</summary>

```tsx
import {useContext, useEffect, useRef} from "react";
import {BackendTokenContext} from "./BackendTokenContext";
import {useIsConnectionRestored, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {backendAuth} from "./backend-auth";

const localStorageKey = 'my-dapp-auth-token';
const payloadTTLMS = 1000 * 60 * 20;

export function useBackendAuth() {
    const { setToken } = useContext(BackendTokenContext);
    const isConnectionRestored = useIsConnectionRestored();
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const interval = useRef<ReturnType<typeof setInterval> | undefined>();

    useEffect(() => {
        if (!isConnectionRestored || !setToken) {
            return;
        }

        clearInterval(interval.current);

        if (!wallet) {
            localStorage.removeItem(localStorageKey);
            setToken(null);

            const refreshPayload = async () => {
                tonConnectUI.setConnectRequestParameters({ state: 'loading' });