Jiego: but if you can leverage without risk (as you only need to wait for your transaction to be on the green), how is it leverage?

Jiego: is more like a friend giving you money

Max: It’s probably irrelevant to Tact itself. Ill need to test maps and see how gas efficient they might be if we have thousands of entries — that was my key concern (reply to 42984)

Jiego: gotcha. What I said was that its probably gas efficient to have each loan work as an array, where each user gets a new contract deployed that tracks their debts (reply to 42986)

Jiego: if you get a gazillion users, gas is gonna blow them up

Laisky: https://docs.ton.org/develop/dapps/apis/sdk (reply to 42994)

— 2024-10-21 —

Denys: Hi everyone, I have this message: message BridgeFundsOut {     token: Address;     recipient: Address;     amount: Int as coins;     transactionId: Int as uint64;     sourceChain: String;     sourceAddress: String; } I need to calculate the hash of all its fields, so I wrote this code: let cell = beginCell()             .storeAddress(msg.token)             .storeAddress(msg.recipient)             .storeCoins(msg.amount)             .storeUint(msg.transactionId, 64)             .storeSlice(msg.sourceChain)             .storeSlice(msg.sourceAddress)             .endCell();         let hash = cell.hash();         return hash; but I get an error with these lines: .storeSlice(msg.sourceChain) .storeSlice(msg.sourceAddress) How do I properly store the string in cell to calculate the hash later?

Alexander: They are not slices they are strings. IIRC storesString is available but you should be careful that your cell now doesn’t contain references (reply to 43019)

Denys: I solved the problem simply by adding .asSlice: .storeSlice(msg.sourceChain.asSlice()) (reply to 43021)

Georgiy: That's right. You should also care about the amount of data you're going to store in the cell. It should not exceed 1023 bits, otherwise, it will fail with the Cell Overflow runtime error.  Misti will be able to detect some cell overflows starting from the next release: https://nowarp.io/tools/misti/docs/next/detectors/CellOverflow. (reply to 43022)

Denys: Thanks for the explanation. Maybe you can help me more with this, I have an event like this being created in my contract: emit(BridgeFundsOutEvent{             token: msg.token,             recipient: msg.recipient,             amount: msg.amount,             transactionId: msg.transactionId,             sourceChain: msg.sourceChain,             sourceAddress: msg.sourceAddress,         }.toCell());  and I'm trying to somehow process this event in blueprint tests to check if all the data is passed correctly: const transferResult = await bridge.send(receiver.getSender(), { value: toNano('0.5') }, fundsOutMessage);  const events = transferResult.transactions[0].events; console.log(events);  but the output I get is this:   console.log     Events:  [       {         type: 'message_sent',         from: EQBVL2212gyufws6tKtY2Fkn9r65Ys2kJqam7nUcgs6tH7uD,         to: EQBbz87xDR_ufbMtFbszj6byAaPWDJxlbhsKvRPSeuSbOQPp,         value: 500000000n,         body: x{3A60B3618016958C0DEEB4C24F74677D5D3AE348E0CBB23951839F493AD522F9E2C62957DD500154BDB6D76832B9FC2CEAD2AD6361649FDAFAE58B36909A9A9BB9D4720B3AB47C00000000000000000000000000000000000000000000000000000174876E8001_}          x{0000000000000000000000000000000000000000000000000000000000000008C_}           x{536F6C616E61}           x{307830303030},         bounced: false       }     ] (reply to 43023)

Prateek: hey guys can u tell me some javascript library to interact to smart contract deployed

Dan: {   "dependencies": {     "@orbs-network/ton-access": "^2.3.3",     "ton": "^13.9.0",     "ton-core": "^0.53.0",     "ton-crypto": "^3.2.0",     "ts-node": "^10.9.2"   } } (reply to 43030)

Prateek: hey dan can u share the sample script to interact with the smart contract

Prateek: const TonWeb = require('tonweb');  const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));  const contractAddress = 'mycontract address';   const prices = tonweb.call(contractAddress, getOptionPrices) console.log(prices);  this error is showing up : ReferenceError: getOptionPrices is not defined   i have the same getter method in my contract and i have tested it  and deployed it

sajad: what is this at your code? (reply to 43036)

Prateek: getter method in my smart contract (reply to 43038)

Prateek: const TonWeb = require('tonweb');  const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));  const contractAddress = '';  const runMethod = async()=>{     const prices = await tonweb.call(contractAddress, 'OptionPrices')     console.log(prices); }  runMethod();    {   '@type': 'smc.runResult',   gas_used: 4532,   stack: [ [ 'num', '0x21' ], [ 'num', '0x42' ] ],   exit_code: 0,   '@extra': '1729517793.8393419:4:0.25969375224502766',   block_id: {     '@type': 'ton.blockIdExt',     workchain: -1,     shard: '-9223372036854775808',     seqno: 24231557,     root_hash: 'P+asPhpOpuxPMWfpfnCX8z5yVT7cpvlLTcPucrF0dJk=',     file_hash: 'fsZGWnf5bq2id8BBwHpTTtlpE/w0WX+dgQMUNjlLssQ='   },   last_transaction_id: {     '@type': 'internal.transactionId',     lt: '27177769000001',     hash: '29qbX9n8YugXDAsV961KXoOcJMsMGwXrXhTAypaeV5M='   } } how to extract the returned value from this

Fardin: Hello my friends

Fardin: Do anybody have Jetton with tax on sell contract?

Illia: How to get the HASHEXT_SHA256 TVM opcode working in Tact?   I want to get a function in Tact with a signature like HASHEXT_SHA256(hash0: Slice, hash1: Slice) -> Slice?  Having another function which accepts builders would be highly appreciated as well

Mehmet Ali: we are working on it but could not finalize yet (reply to 43042)

Alexander: I have one. (reply to 43056)

Anton: should be something like this:   asm fun hashExtSha256binary(s1: Slice, s2: Slice): Int {   2 PUSHINT   HASHEXT_SHA256 } (reply to 43056)

Fardin: Cool, need some hand's? (reply to 43057)

Fardin: Great, Is that supported by stone? Will the users hit issues on transferring tokens? (reply to 43058)

Mehmet Ali: Would be nice. But just note that we are working on this open source project voluntarily. The contract almost finished just to be revised. If you wish to contribute just ping me pm. (reply to 43061)

Fardin: Great, let's do it (reply to 43068)

— 2024-10-22 —

EVMlord: I'll love to contribute (reply to 43068)

yash: looking for a tact dev who is also good with solidity, please dm

yash: paid gig

Illia: I don't understand how it works, but if I add a require to my smart contract, then total fees decrease by 0.000003 Toncoins. Not complaining, just wondering why adding extra require, drops the gas usage

blocksdev: Please send me your contract requirements (reply to 43106)

EVMlord: . (reply to 43098)

Georgiy: This is an English-speaking chat. Please avoid using other languages here.

Simon: Hi!  Looking for Tact dev in a new interesting project. Paid

Idj: im modifying the base jetton  smart contract in tact to have a buy function . for every 10 jettons the user needs to pay 1 TON       receive("Buy: 100"){          let ctx: Context = context();         require(self.mintable, "Can't Mint Anymore");         require(ctx.value == 10000000000, "Invalid value");         self.mint(ctx.sender, 100, self.owner);     }   i noticed that the TON isnt stored in the master contract because of self.mint  how do i modify the mint function such that store the TON the user used to call the Buy function?      // @to The Address receive the Jetton token after minting     // @amount The amount of Jetton token being minted     // @response_destination The previous owner address     fun mint(to: Address, amount: Int, response_destination: Address) {         require((self.totalSupply + amount) <= self.max_supply, "The total supply will be overlapping.");         self.totalSupply = self.totalSupply + amount; // Update total supply          let winit: StateInit = self.getJettonWalletInit(to); // Create message         send(SendParameters{                 to: contractAddress(winit),                 value: 0,                 bounce: false,                 mode: SendRemainingValue,                 body: TokenTransferInternal{                     queryId: 0,                     amount: amount,                     from: myAddress(),                     response_destination: response_destination,                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: winit.code,                 data: winit.data             }         );     }

Slava: bump to the question. really curious why this cell is stored in data and therefore effects on a contract's storage fee (reply to 42929)

EVMlord: https://chatgpt.com/share/67181ccf-d9a8-800e-9158-4839516fd485 (reply to 43128)

EVMlord: Setup this GPT for Tact support,   Link: https://chatgpt.com/g/g-J44T0ADzn-tact-genie  Hope it is helpful, would appreciate feedback

Idj: its not working @EVMlord . i get a Not Found error

— 2024-10-23 —

Bahaa: https://github.com/ArDapps/Ton-Jetton--Token-Like-Erc20-Script (reply to 43169)

⚡️ Ἑρμῆς (Hermes): 404 (reply to 43170)

Bahaa: again

Bahaa: its pubkick

EVMlord: I think it's only accessible if you're using a paid subscription of gpt4  I'll check if it can be accessed through an API standalone (reply to 43160)

Bahaa: welcome and can check all doc here https://docs.tact-lang.org/cookbook/jettons/  the erc20 at ton named == Jietton (reply to 43175)

Laisky: https://github.com/Laisky/tact-utils/tree/main/contracts/nft You might want to try this template. (reply to 43110)

Laisky: https://github.com/Laisky/tact-utils/tree/main/contracts/jetton Here is a Jetton template. Jetton is the FT token in TON, similar to ERC-20. (reply to 43169)

GooGrand: Hello, I am struggling to parse incoming forward_payload from TokenTransferNotification as   struct SomeStruct {     someFlag: Bool;     references: Slice as remaining; }  I am using it as  let data: SomeStruct = SomeStruct.fromSlice(message); but getting handling exception code 9: extra data remaining in deserialized. Can anyone help with it?

GooGrand: Are there any concerns about parsing sliced data with structs?  Sorry, there is how I pack payload  beginCell().storeBit(false).storeMaybeSlice().endCell().asSlice()

Laisky: how about SomeStruct.toCell().asSlice() ? (reply to 43185)

GooGrand: Nah, getting the same result. Tried  SomeStruct.fromSlice(message.asCell().adSlice()) SomeStruct.fromCell(message.asCell()) (reply to 43186)

Laisky: try removing the "as remaining"? (reply to 43187)

GooGrand: Almost the same error handling exception code 9: cell underflow (reply to 43188)

GooGrand: Ok, for information, I decided to parse it without struct, so it worked

Uncharted: what dex are TMA tokens deployed fastest with sufficient liquidity please

— 2024-10-24 —

Alex: I’m wondering if there are any naming conventions for TON and Tact? Looks like camelCase is more popular in tact but func use  snake_case

Jignesh: 'default' is not exported by projects/Tact-Transfer-Token/dist/tact_SampleJetton.ts, imported by ide__cell.ts         "How can i solve this issue"

Jignesh: await sampleJetton.send(         provider.sender(),          {             value: toNano('0.05'),          },         {             $$type: 'TokenTransfer',              queryId: BigInt(Date.now()),              amount: transferAmount,             destination: receiverAddress,              response_destination: provider.sender().address as Address,              custom_payload: customPayload,             forward_ton_amount: toNano('0.01'),              forward_payload: forwardPayload,          },     );  getting  Below error                                                                                                                                                                                                                                                                                                                scripts/transfer.ts:26:13 - error TS2322: Type '"TokenTransfer"' is not assignable to type '"Mint" | "MintPublic" | "TokenUpdateContent" | "TokenBurnNotification"'.  26             $$type: 'TokenTransfer',                ~~~~~~

GooGrand: As I see your error, you are trying to call JettonWallet method on JettonMinter contract. To make TokenTransfer you gotta call your own wallet (reply to 43229)

Jignesh: how can i clear privious wallet from my ton  project

Prateek: import { Address, Cell, toNano } from '@ton/core'; import { JettonUSDC } from '../wrappers/JettonUSDC'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const jettonUSDC = provider.open(await JettonUSDC.fromInit());      await jettonUSDC.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     );      await provider.waitForDeploy(jettonUSDC.address);      // run methods on jettonUSDC }  how can i pass the type Cell in the init() method to deploy the contract??

Guy: Is there a way to detect failed Jetton tx from within a smart contract? I am instructing my contract's wallet to transfer Jettons to a user.  the tx from the contract to my wallet succeeds, but the tx from the wallet to the user's wallet fails and bounces back to the wallet. Is there some kind of notification I can receive in my contract to be aware of this and make state changes accordingly? Or, is there a notification for a positive response (e.g. the the transfer succeeded), that I can then make state changes after receiving it?

Guy: send(SendParameters{             to: self.contractUsdtJettonWallet,  // The Jetton wallet to send from             value: ton("0.05"),  // This TON is for paying for gas fees of the transfer             body: JettonTransfer{                 queryId: queryId,                 amount: amount,  // Jetton amount to transfer                 destination: to,  // The recipient of the Jettons (owner of the jetton wallet)                 responseDestination: myAddress(),  // Set the contract as the destination to receive any excess TON                 customPayload: null,  // For simple transfers, this can be null                 forwardTonAmount: ton("0.1"),  // The TON amount forwarded to cover the recipient's processing cost                 forwardPayload: rawSlice("F")  // Simple forward payload for the transfer             }.toCell(),             mode: SendPayGasSeparately         });

Guy: Is there a way for the contract to determine if the 'JettonTransfer' succeeded/failed?

Cyril M |: what does -14 exit code mean?

Velocihamster: It means out of gas error, same as 13. Negative, because it cannot be faked (reply to 43251)

Velocihamster: 13 Compute Phase Out of gas error. Thrown by TVM when the remaining gas becomes negative.

Cyril M |: I increased the gas to 0.1 and still gettign the same error

Anton: do you use dump in your Tact code for testing? if so, it’s computationally expensive and you need even more gas (reply to 43254)

S: Hey. Someone can share some examples of multisender contract?

RootTon: hello everyone, I'm a beginner, can you recommend some video guides to start learning tact?

Slava: Is there a way to use 'Maybe' or 'Either' monads in tact's message or struct declarations? Would be very handy for tlb struct encoding

— 2024-10-25 —

Laisky: https://github.com/Laisky/tact-utils/blob/main/contracts/jetton/jetton.tact#L194  Is it supposed to be like this? (reply to 43260)

Laisky: https://github.com/Laisky/tact-utils I recommend this template project; you can learn how to write, deploy, and call contracts. (reply to 43267)

RootTon: Thanks 🙏 (reply to 43287)

Slava: I have a map with fixed sizes of key and value:  projects: map<Int as uint64, Int as coins>;   but in a generated FunC code value is treated like a default int257   __tact_dict_get_uint_int($self'projects, 64, $projectId, 257); $self'projects~__tact_dict_set_uint_int(64, $msg'projectId, $msg'rate, 257)   hovewer in a generated ts file it is way different:   b_0.storeDict(src.projects, Dictionary.Keys.BigUint(64), Dictionary.Values.BigUint(124));   seems line value size does not work in FunC and wrong on ts side (should be Dictionary.Values.BigVarUint(16) as i remember)

Slava: btw because of this my sandbox tests failed. if i switch to   projects: map<Int as uint64, Int>;  test are OK (reply to 43294)

S: not exactly, my backend will send a recipients and amount jettons for each and multisender will distribute jettons stored on the other contract, but thanks your repos was very useful! (reply to 43286)

⁭: I wonder how fragment selling usernames. For example, I connected my wallet ton to my username, it's stored on their server not in smart contract. When someone bids and win they transfer funds to my wallet, however they get this wallet from their server, which can be hacked or replaced by them. How this things consider to be safe or where it is stored, maybe I understand it wrong.

Yash: Hello, can someone help me with this? How can we send two jetton in a single transaction and how to get the info of both of them in a contract?

c9 👨‍🍳: I just deployed jetton but it is jetton_wallet_v1 is there any way to change it to v2 but still keep the address of the jetton master

Cyril M |: Im having problem deploying a contract from another contract. I suddenly get exit code 130 even though the message is constructed correctly

Cyril M |: this wasnt appearing before

Cyril M |: did tact have breaking change or something?

Cyril M |: im not sure what's causing anymore

Cyril M |: ive been debugging this for 2 days already

Anton: does the Country contract accept empty messages? (reply to 43314)

Cyril M |: ohhhhh

Cyril M |: right

Cyril M |: dang. how did i missed that

Deedee: how to use 3-d map in tact

Deedee: map<Int,map<Int,Int> > dont work

Cyril M |: Struct { map: map<Int, Int> } map<Int, Struct>

Cyril M |: but this is not ideal for mapping that exceed 30k key/value

Cyril M |: i just found out that mapping has 30k limit

Deedee: oh, and my dapp limit 30k user

Deedee: is there any other way bro

Cyril M |: on my case, I create a separate contract for each user

MyName: Using sub-contracts, mb (reply to 43327)

Cyril M |: similar approach to jetton wallet

Cyril M |: i store the user's data on a new separate  contract instead of mapping

Cyril M |: then let off-chain store the # of users

Deedee: If I make a stake contract and I use the amount variable to map to each wallet, I can't create a contract for each user.

Dmitry: Hm, you mean Country contract should have empty receiver? (reply to 43317)

Cyril M |: take note, you can only utilize fully the 30k limit if you dont have any other variables being store on your contract (reply to 43333)

Dmitry: But it should work without it, no?

Cyril M |: https://docs.tact-lang.org/book/maps/#limits-and-drawbacks

Cyril M |: i suggest you would create a contract of each user staking wallet (reply to 43333)

Deedee: Do you have the source code of the big projects on Ton, so I can refer to it?

Deedee: Code tact lang

Cyril M |: I have, im working on it but I signed an NDA

Deedee: if i use func-lang, that problem have reslove? (reply to 43337)

Cyril M |: nope

Cyril M |: the compile output of tact is func

Cyril M |: so the limit applies on func also

⚡️ Ἑρμῆς (Hermes): By the way, how did you make this pretty output on tests? (reply to 43310)

Deedee: so sad, ton blockchain very limit for dev contract not like evm (reply to 43345)

Cyril M |: printTransactionFees(result.transactions); (reply to 43346)

Cyril M |: i know. but it still has a lot of room for improvement (reply to 43347)

Deedee: i can find that docs sub-contract where (reply to 43329)

MyName: https://tact-by-example.org/06-contract-deploy-another (reply to 43359)

MyName: Here is an example how the contract can deploy another using unique initial params, like seqno in this example (reply to 43360)

MyName: Which proplem do you want to solve using maps?

Deedee: I have some questions as follows: 1. Who pays the fee for the sub-contract 2. How can the master contract know if a user has created a sub-contract? 3. How can the master contract know the sub-contract address of each user without saving the map (reply to 43362)

MyName: 1. Contract, calling master-contract via transaction 2. There is no way master contract knows about it. 3. You can use initOf method returns unique init data for each sub-contract by init params. And then you can get sub-contract address using contractAddress(init)

MyName: You can just save created ids in master-contract, but i think there is the same as using maps 😁 (reply to 43364)

Deedee: hmm, tks bro (reply to 43365)

Jean brice: let Id: Int = msg.data.preloadInt(257);         let hashlock: Int = msg.data.preloadInt(257);         let timelock: Int = msg.data.preloadInt(257);

— 2024-10-26 —

FakeName: Is there any NFT-Fi available in TON ?  Where i can stake my NFT or borrow loans on my NFT ?

FakeName: I’m thinking of building a Copy Trading platform within TON mini apps. The idea is to let users follow and automatically replicate trades of top traders, with features like leaderboards, real-time trade mirroring, and performance analytics, all backed by TON’s security and transparency. Does this sound feasible within TON mini apps? Any advice on handling trade replication, user management, or potential challenges with TON?

Ilya: hey guys, is anybody installed ton-cli on mac m3 with docker? (forwarded from Ilya)

Ilya: if so can u send a working guide ? (forwarded from Ilya)

Ilya: error while running tests (forwarded from Ilya)

— 2024-10-27 —

⁭: how to store more than 30k in map?

GamerZero: Why do my tests start failing when i try to dump an Address type value? My assumption is that contract runs out of gas on this operation, but i have no idea how to enable infinite gas or something so i can print values properly...

Anton: How about finite gas, but a larger value? (reply to 43464)

GamerZero: I've tried increasing test wallet balance and sending values up to 1 000 000 000, doesn't really help somehow.... (reply to 43466)

GamerZero: Seems like a bug

GamerZero: Maybe I'm doing something wrong. Should it look like that?

sajad: so we can't use map for staking contracts  right? (reply to 43460)

GamerZero: It seems that I'm passing incorrect value to treasury balance. Not sure what it should be really... (reply to 43470)

Anton: try an even larger value, dump is really expensive (reply to 43475)

Mehmet Ali: Need a guideline and some examples on TON for governance. We have a jetton and want to maintain some governance/voting functions with that.

GamerZero: Is there no way to make generic containers in the language? I saw that there once was an idea of adding zig-style comptime to the language, but this spec seems deprecated.

Anton: Nope, there are no generic containers at this moment in Tact. But there are some plans… (reply to 43480)

GamerZero: Is converting Cell to concrete struct type using Struct.fromCell costly? Can i use it as an alternative to metaprogramming for making generic tree structures for example?

— 2024-10-28 —

Vincent: error: return type of an assembler built-in function must have a well-defined fixed width   ... , slice, int, int, int, slice, slice, slice, int, cell, int, cell, int, int, slice, slice, cell) v) asm """    > DexRouter: tact compiler    > DexRouter: func compiler 💥 Compilation failed. Skipping packaging  when I am trying to build, it shows this error, it mainly because I add too much params in a message(struct). do you guys ever meet this compile error? It is beacause of too many(maybe more than 16) params in a message.  and then, how to handle that?

Vincent: anybody meet this error? params too much?

Vincent: Thanks my big bosses

Anton: what version of Tact are you using? and can you provide a minimal reproducible example? (reply to 43500)

Jignesh: i want to write mint function in react but getting error in Tonkeeper

Georgiy: That's a group about the Tact contracts language. This problem seems to be off-topic here. (reply to 43509)

Nikita Aplin: Is there a human way to get txHash from sendTransfer?  Now the logic is: 1) Received seqno BEFORE 2) Sent the transaction 3) Waited for seqno to change 4) Called the list of last transactions via the toncenter and took the last one  The doc says let transfer = await userWallet.sendTransfer(...) BUT transfer is an empty void  P.S.  import { TonClient, WalletContractV4 } from '@ton/ton';     let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });     let userWallet = tonClient.open(wallet);

Sergey: Hi everyone. I am new in TON ecosystem. Right now I starting with Tact language. I have experience in Solidity smart contracts. I understand, that concept of Tact and TON ecosystem is not the similar with EVM, it is clear. Could somebody guide me  (or give an example) how to implement the following scenario in Tact.  Scneario in EVM (solidity) Contract USDTReceiver - contract accept payments in USDT from various users. - contract tracks the total amount of payments from any user. - control allows to withdraw all usdt by the admin (doesn't matter why)  From the tech part, the user must call the method ERC20.approve({USDTReceiver}, {mount}). And then contract USDTReceiver is able to call the method ERC20.sendTransferFrom() to charge/transfer usdt from the user to contract.  How to do the same in Tact? Not sure, Jetton template has similar concept like approve and sendTransferFrom. Apparently another approach is used to accept USDT Jetton (or any other external jetton) inside Tact smart contract methods.  Please help to figure out with TON and Tact code. Thanks in advance

Denys: Hi everyone, is there any way I can get the TON balance from the contract in tact?

Denys: I faced the same problem, Jetton has only tokenTransfer and transferInternal methods, there is no such thing as in ERC-20 (transferFrom and approve methods). The only option I found is that the user himself should transfer his tokens to you. (reply to 43512)

Laisky: AFAIK, There are no standards related to Approve and transferFrom in Jetton. TEP-74 only defines transfer. (reply to 43512)

Georgiy: https://docs.tact-lang.org/ref/core-common#mybalance for your contract's balance, otherwise I would send the value as a message. (reply to 43514)

Sergey: hm.. but how people implement a case, when contract accepts usdt from other users? It is widely used scenario. (reply to 43515)

Denys: In the Jetton standard, when a user receives tokens to his wallet, a special TokenNotification message is sent to his address, so it should be processed (reply to 43519)

Laisky: The person sending the jetton will create a jetton wallet for the recipient. (reply to 43519)

Anton: does this page help? https://docs.tact-lang.org/cookbook/jettons (reply to 43519)

Yevhenii: idk why my message here was reported, but i will repeat. Can anyone advice why this jetton transfer may fail?         send(SendParameters{         to: self.state.jettonWallet!!,         value: ton("0.05"),          body: JettonTransfer{         queryId: 0,         amount: tokenAmount,         destination: sender(),         response_destination: sender(),         custom_payload: null,         forward_ton_amount: 1,         forward_payload: emptySlice()         }.toCell()         }); It fails on this line of the jetton-wallet contract.   throw_unless(708, slice_bits(in_msg_body) >= 1); And it doesn't matter if   forward_ton_amount: 1 or 0.

Yevhenii: Should there always be some non-empty forward_payload? (reply to 43524)

Denys: Hi all, please help me with a problem, I have a contract to which the user transfers Jetton, the situation is like this, Jetton is transferred in three stages: 1. the first transaction is the user calls the tokenTransfer method of his Jetton wallet, where he passes the necessary data, such as the address of the recipient, the number of tokens to be transferred, etc. 2. the second transaction is tokenTransfer sends the tokenTransferInternal message to the recipient's wallet. 3. the third transaction is sending a tokenNotification message to the owner's address from the Jetton wallet contract. my contract has a method that processes the tokenNotification message and in case something goes wrong, it should rollback the transaction. But the problem is that it can only roll back the transaction with tokenNotification message, but the token transfer itself (which was in transaction 2) cannot be rolled back, how can I solve this problem?

Denys: I was told that I can send tokens back to the user if something goes wrong, but the problem here is that I have to pay a fee for this transaction, not the user. As a result, the user can just flood my contract with inappropriate transactions, and my contract, trying to send back tokens to him, will spend all its TON's. (reply to 43528)

nisarg: does anybody have a presale(ICO) smart contract please share me github link

Sergey: Looks like it the right approach. I can handle TokenNotification message in my AcceptUSDTContract and do any required logic around who is sent the usdt.  TokenNotification message has amount, from  fields and forward_payload as well. Apparently forward_payload is reserved to pass any arbitrary data to support custom logic (reply to 43520)

Denys: That's right, I also have logic that handles tokenNotification and in case I need to roll back the transaction, I can send the tokens back to the sender. But the problem here, as I said, is that my contract will pay the commission when returning the tokens, not the user. (reply to 43531)

Nazar: Hi guys👩‍💻, we want to make a contract with a deposit method for jetton tokens(as well as TON). As we assume, the deposit method should be sub-called inside the jetton transfer call.   But when we revert the deposit method (after logical checks) it doesn't revert the transfer. It's very different from traditional Smart Contracts from other chains.   How to implement this flow. Can you suggest any project to look after. Can you suggest any workaround for that?

Sofi: Selling my src of TMA, contracts or offering my services as a paid dev.

Guy: Hi, let's say I want to create a contract that receives USDT and sends USDT.  Would this imply that the contract's wallet implementation will depend on the first client that sends USDT to the contract? How can I enforce a specific implementation? (reply to 43521)

Slava: you need at least 1 bit for forward_payload because it's stored as forward_payload:(Either Cell ^Cell), where Either is 0 or 1 (reply to 43524)

— 2024-10-29 —

Prateek: hey guys is there any documentation on how to create our own jetton token and use it in our contract

Laisky: https://github.com/Laisky/tact-utils you may take a look at this (reply to 43557)

Denys: Hi everyone, is there any way I can get the timestamp of the current block?

Denys: And can I find out the size of this Slice, i.e. how many bits it takes up? let destinationAddress: Slice = params.destinationAddress; (reply to 43565)

dotfx: Hi there! This used to work with the previous Tact version Now with v1.5.2 I got an exit error 130 (both contracts have the same opcode setted for the message structure) (reply to 41489)

Prateek: expect(tx.transactions).toHaveTransaction({             from: admin.address,             to: adminJettonWallet.address,             success: true,             op: 0xf8a7ea5,  // TokenTransfer         });  this block of code is failing in my transfer to user test case,

Guy: Hi :), sorry if I keep coming back to this, but it is unclear to me.  In this tutorial, for USDT, we have: struct JettonWalletData {     status: Int as uint4;     balance: Int as coins;     ownerAddress: Address;     jettonMasterAddress: Address; }  // And the function to calculate the wallet address may look like this: fun calculateJettonWalletAddress(     ownerAddress: Address,     jettonMasterAddress: Address,     jettonWalletCode: Cell ): Address {      let initData = JettonWalletData{         status: 0,         balance: 0,         ownerAddress,         jettonMasterAddress,     };      return contractAddress(StateInit{         code: jettonWalletCode,         data: initData.toCell(),     }); }.  My questions are: 1.  All of the JettonWallet implementations I saw take in as constructor input parameters the owner address and the master contract address.  Should the USDT wallet take in as input the JettonWalletData struct? or should it take 4 paramters: status, balance, ownerAddress, jettonMasterAddress? 2. type 'uint4' does not exist in Tact, how should I define the status parameter then? Is there a way to limit integers in tact to the range of [0,15].  3. What is this status parameter? Should I store it as a state variable in the wallet implementation? Any help on this would be much much appreciated 🙏 .  If anyone has an example of a USDT wallet in tact and doesn't mind sharing it - also much appreciated.  Thanks in advance (reply to 43522)

Mister Green: Hello, how can I chat with the support? Our game is launched and we have some questions

zk: Hello, I saw the ton org website only have the func examples, if there have some tact examples list?

Dmitry: https://tact-by-example.org/all (reply to 43574)

Anton: https://github.com/tact-lang/awesome-tact/blob/main/README.md  and   https://docs.tact-lang.org/cookbook/ (reply to 43574)

Sergey: hi everybody. Could somebody help me with the following error? I get this error upon creation a new project with blueprint sdk. I suspect something wrong with dependencies. But not sure, what exactly. When I tried to add new contracts to some existing tact samples, then everything OK. But if I create a new project with npm create ton@latest then I have a problem. Maybe no need to use @latest version? Maybe somebody already seen this problem and know the reaso

Sergey: why do  I have these errors when creating a new project  Tact compilation failed >>TypeError: paramSet.isSubsetOf is not a function  >>Error: Could not find boc in tact compilation result (reply to 43580)

Anton: If only someone added a warning explaining which Node.js version is expected (reply to 43582)

Sergey: thank you. I installed node 23. At least, I am able to build the project and create it with npm create ton@latest. (reply to 43582)

Sergey: Does anybody know the templates with common used traits? If we look into smart contract development for EVM in Solidity language, then there is openzeppelin library with various useful contracts that could be extended etc. Is there something for Tact development? I would like to extend my Jetton instance from "the right version" of Jetton contract. Also, I want to apply "role based" access control for my contracts (not just owner-based restrictions). In case of solidity development there is ERC20.sol and AccessControl.sol. Please advise the "trusted" library with useful traits

— 2024-10-30 —

blocksdev: ++ (reply to 43585)

Prateek: message(0xf8a7ea5) TokenTransfer {     queryId: Int as uint64;     // the amount of jettons to transfer     amount: Int as coins;     // the address of the jetton receiver     destination: Address;     // the address to send the excesses to     responseDestination: Address;     // the custom payload to be sent with the excesses     customPayload: Cell?;     // the amount of TON coins to forward,     // if not zero, will send additional msg with the specified amount     forwardAmount: Int as coins;     // the payload to forward     forwardPayload: Cell?; }          send(SendParameters{             to: contractAddress(init),             body: TokenTransfer{                 queryId: randomInt(),                 amount: msg.betAmount,                 destination: myAddress(),                 responseDestination: sender(),                 forwardAmount: 100_000_000 ,                 forwardPayload: beginCell().storeSlice("jetton forward msg".toSlice).endCell(),                 customPayload: null,             }.toCell(),             value:100_000_000 ,             mode: SendIgnoreErrors,         });  how to send the forward payload ???? as cell ??

S: This question is not related to the Tact language, but there are few examples of jetton multisenders and misunderstandings arise.  I already have a jetton and jetton wallet contract. I'm trying to implement a multisender contract, nothing complicated just receiving the recipients and jetton amount in msg then transfer in a loop. So my multisender can't store the jettons by itself (obviously), only on the jetton wallet instance that was created for him automatically (as I can understand), obviously I have to run the multisend function with "multisenderJettonWallet.send ... { $$type: 'MultiSend' ...}," but it can't accept this message because the jetton wallet contract itself can't receive this type of message.  So the question arises whether it would be a good practice to implement the multisend logic directly in the main jetton wallet contract and remove the multisender contract altogether or are there any other approaches to implementation?

P: sure. dm me. (reply to 42927)

— 2024-10-31 —

traceur: Hi guys, do you know how to get the account id from a ton smart contract address in Tact? I only found examples in JS, but I need to know how to do it in Tact. https://docs.ton.org/develop/dapps/cookbook#how-to-convert-user-friendly---raw-assemble-and-extract-addresses-from-strings

traceur: how to update Tact to 1.5 in blueprint project?

Anton: https://t.me/tactlang/35521 (reply to 43648)

E: Good day ) Can a smart contract read data from a child contract without sending a message from the child contract?

Guy: No, the only way to do it is to send a message from the parent contract to the child contract, and then have the child contract reply (reply to 43651)

E: Thank you (reply to 43652)

august.l: how to use this method  blockchain.setShardAccount(address, account) to directly set the state of smart contracts  is there any demo code?

dotfx: @AntonTrunov are you experiencing errors with external calls using the last tact-compiler? (reply to 43567)

Son Pin: how to selfdestruct a wallet?

Anton: Can you provide a reproducible example please? You can open an issue here: https://github.com/tact-lang/tact (reply to 43657)

dotfx: ok, will create 2 very basic contracts to be sure (reply to 43662)

Anton: thanks 🙏 (reply to 43663)

Sergey: Hi all. Could anybody advice me how to verify smart contracts on Tact? Is there any way to use some plugins to verify contract after deployment from command line or by blueprint framework?

ATH: How can I fetch SBTs from wallet?

Никита: Hello everyone. Is there any way to send Array of {wallet: ...., amount: ....} to SmartContract and send Jettons via this list.  Or should I take a different approach?

sajad: I think better use Array of struct (reply to 43674)

cubby: Hello.I’m a senior blockchain developer actively looking for my next project. My basic skills are as follows. Smart contract  ->  Rust / Solidity / Move Front-End  ->  React / Next / Vue / AngularBack-End  -> Node / Python / Go / Java  If you have any idea for a new project, I’d love to discuss how we can collaborate and work together.Looking forward to connecting!

Georgiy: 🎉 Misti 0.5 has just landed on NPM!  🔍 More Tact Detectors: Covered Tact-specific issues like CellOverflow, SuspiciousMessageMode, UnboundMap achieving totally 25 detectors.  ⚠️ Warning Suppressions: Suppress specific warnings using // @misti:suppress DetectorName comments.  💡 Usability Enhancements: Install Misti with a single command and run it on the directory containing your contracts—no extra configuration required: npm install -g @nowarp/misti misti path/to/src/contracts  🔧 Fixes & Enhancements: More configuration options, optimization and improvements. Check out the full changelog.  ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Creator: Hello everyone Could be anybody face up this problem I can't find any info in the docs Dedust. Is it possible to find out the pool data from another contract? Or maybe exist another DEX which can response similar data for my logic? I'd like to compare prices of pair

— 2024-11-01 —

poppa: If you have the pool identifier yes you can query it from another contract, however because it would be N asynchronous queries to the N pools being queried the pool states you’re comparing cannot be considered equivalent. It is entirely possible for another mutation to occur prior to your contract being able to act upon the information.   For example, if you query NOT-USDT then query TON-USDT, compare the values and determine NOT is a better opportunity (or whatever), there’s no guarantee that the state will be the same as observed for either pool by the time you perform a swap.

Viacheslav: Is there any examples in tact for proxy contract approach? maybe solution for https://github.com/ton-community/tact-challenge/blob/main/contracts/2.tact

zk: I have a question about liquid staking. I saw in the process described on the Liquid Staking Pool related Github that validators need to actively request funds from controllers. So, in theory, does the pool itself also need to create its own validator?

FREE: Hi all. Where can I find information on using AST? Can you share some code examples or a link to the documentation? I want to interact with Tact Tree with using TypeScript

— 2024-11-02 —

Anton: Btw, there is no guarantees for AST’s TypesScript API in terms of backwards compatibility between Tact versions. We can break it at any point without any prior notice. So you are on your own there (reply to 43742)

Anton: It will be mentioned in the changelog though

FREE: And how do you work with the takt compiler? do you have any problems with the tree? i'm just looking for opportunities to decompile tact code i came from c# and there is Roslyn for working with the c# compiler. (reply to 43754)

FREE: I noticed that the vs code extension can't decompile code when you press ctrl + click I'm currently looking for ways to fix this so far, what I've realized is that there are problems with the parser that is in the extension (reply to 43756)

Anton: The AST-related code sometimes gets refactorings depending on the compiler development needs, that’s it (reply to 43756)

Georgiy: I would start from misti.  You could also use its IR API which might be more suitable for your needs, as it includes more features needed for code analysis. Currently, you can use CFG, imports graph, AST store (it's like AST identifiers mapping, similar to HIR's map.rs from rustc), and the callgraph API will be merged today. (reply to 43742)

Georgiy: btw, there is no real IR yet. It will be implemented soon when FunC support is added and will be presented as a kind of lowered Tact/FunC, most likely in SSA form.

— 2024-11-03 —

cubby: Hello. Is anyone looking for a blockchain engineer?

Denys: Hi all, I'm writing tests on blueprint right now and I don't know how to do it right, see: I have a deployer and a bridge created: let deployer: SandboxContract<TreasuryContract>; let bridge: SandboxContract<Bridge>;  deployer = await blockchain.treasury("deployer");  bridge = blockchain.openContract(       await Bridge.fromInit(deployer.address, deployer.address, pub_key) );  Next I want to make Mint tokens to some address: const deployTokenResult = await fungibleToken.send(   deployer.getSender(),   {     value: toNano("0.05"),   },   {     $$type: "Mint",     amount: supply,     receiver: bridge.address,   } );  The point is that the owner of the token is bridge, not deployer, so I need to send this transaction from bridge, because in the mint function there is a check on the owner, but I can not use getSender method for bridge, only for deployer, how to solve this?

Dmitry: Hello everyone! Who wants to develop a bundle of banking products and tools, infrastructure, online payment systems, as well as crypto, ton? There are already developments and mvp, we need a team who will work on web3 and ton)) If you want, write!

Odilov: Hello.  How I can get build file ?

Odilov: I need help ❗️

Odilov: there is not this file

— 2024-11-04 —

Bzzzz: npx blueprint build (reply to 43817)

NearWormHole ▪️ 🐾: Learnt that, funC will soon be the development language to be using to build on TON and tact will stop from 2025.  How true and we all have to migrate to funC?

Laisky: None of the points are correct except for the spelling of these words. (reply to 43849)

Anton: Funny. Try it again next April Fools’ Day (reply to 43849)

Max: Hey guys, what’s the best practice for managing fees in the following scenario, if I want to make sure that the 0.1 TON + 0.1 TON for minting jettons comes only from the transaction balance, not from the contract’s balance?  receive (msg: IssueTokens) {  // Mint First Jetton (0.1 TON in fees) send(SendParameters{                 to: contractAddress(self.firstJetton),                 value: ton(“0.1”),                  mode: SendIgnoreErrors,                  body: Mint { amount: msg.amount, receiver: msg.recipient }.toCell(),                 code: self.firstJetton.code,                 data: self.firstJetton.data });   // Mint Second Token (0.1 TON in fees) send(SendParameters{                 to: contractAddress(self.secondJetton),                 value: ton(“0.1”),                  mode: SendIgnoreErrors,                  body: Mint { amount: msg.amount, receiver: msg.recipient }.toCell(),                 code: self.secondJetton.code,                 data: self.secondJetton.data });   }

Odilov: It's not working (reply to 43845)

Laisky: https://github.com/Laisky/tact-utils/blob/main/contracts/jetton/jetton.tact#L194 I’ve got an implementation here for you to check out, it may solve your question. (reply to 43856)

Max: Thanks, but I don’t really understand this code   I had two ideas:  1. Simply add require(context().value >= ton(“0.25”)) and in the end of the function do self.forward to send the excess TONs back  2. Change the value of the minting transaction from ton(“0.1”) into context().value / 2 - ton(“0.05”)   But none of them seem elegant. If we only had one jetton minting call, I could use the flag SendRemainingValue, but since I have two similar calls, I’m not sure how to do that properly (reply to 43858)

Laisky: If a transaction includes multiple sends and you wish to have precise control over the value, you might need to follow the implementation I provided. This ensures that you can control each send's value accurately, while also confirming that the ctx.value is enough to cover all sends. Additionally, use nativeReserve to protect the contract's balance, and refund any remaining ctx.value.  For the same reason that you cannot use SendRemainingValue, I think that you also cannot use self.forward. (reply to 43860)

Bzzzz: what do you mean by that? (reply to 43857)

Stanislav: I tried to gather  TON, Fifth, FunC, Tact documentation in  one GPT. Enjoy!  https://chatgpt.com/g/g-6tUyruYGF-ton-tvm-catchain-fift-func-tact

Stanislav: If you have new sources of docs - send me please )

FREE: Can y share youre files in knowlengde and promt? (reply to 43868)

Stanislav: I just  scrapped sites and put in GPT's data (reply to 43869)

FREE: I also have many gpts. I train them simply on the repository of this or that library. I make gpts for each library I work with. But I want to make a full-fledged AI assistant for Tact in the future. For now I'm studying how Tact works  https://chatgpt.com/g/g-mAVi1YFrO-misti https://chatgpt.com/g/g-TeOFnhTjH-ton-core https://chatgpt.com/g/g-Ww0389l2W-ton-sandbox https://chatgpt.com/g/g-0NyA6wyRC-tactvscode https://chatgpt.com/g/g-Cyv2cXdN7-twa-dev-sdk-react-mini-apps https://chatgpt.com/g/g-JmOvRQjNJ-telegramminiapps-tma https://chatgpt.com/g/g-tFkVOWIoi-tact

FREE: Yes, I understand. I'm just curious how you packed the information. We can make an open repository on GitHub where we can collect all the data sets and promts (reply to 43870)

Andrew: Hi everyone! Guys, do you now any API which can provide free ton for testnet? (I'd like to implement autodeposit on my smart contract)

~: whre i did see you? 🤔 (reply to 43873)

Almatbek: Choosing the Ton blockchain for Aething aligns perfectly with your goals.   Ton is designed for high-speed transactions, enabling your application to handle a significant volume of transactions efficiently.   Ton's low fees make it economically viable for both businesses and users.   Utilizing the Ton blockchain ensures that transactions are secure and transparent, which can foster trust between users and businesses—essential for your goal of creating a community that values innovative products and services. (reply to 43876)

Я̨kov: 1. https://www.tonstat.com/ 2. https://ton.org/ 3. https://docs.ton.org/  Here you go! (reply to 43878)

Stanislav: Just extracted text, no complexity (reply to 43872)

rsadiqra: what the hell is TOLK?

Georgiy: FunC successor: https://docs.ton.org/v3/documentation/smart-contracts/tolk/changelog (reply to 43885)

Hunter: 😅did you watch ton's live yesterday? (reply to 43885)

Hunter: It is going to replace tact and func .

Jiego: Yet another language? (reply to 43888)

Hunter: 😶‍🌫️yes . Let's tolk (reply to 43889)

cubby: Hello. Is anyone looking for a blockchain engineer?

Anton: It’s not going to replace Tact (reply to 43888)

Anton: It’s basically FunC with Tact-like syntax

Anton: In production contracts, message serializing/deserializing constitutes about 30% of the whole codebase

Anton: Tact gets you that almost for free

— 2024-11-05 —

Laisky: I wrote an article about Ton too! Might be worth a read. https://blog.laisky.com/p/ton-tact/ (reply to 43878)

jay: https://docs.ton.org/v3/documentation/smart-contracts/tolk/overview

jay: favored by the officials or next func. (reply to 43961)

Laisky: So, is tact going to be abandoned?

Georgiy: No, it will coexist with Tolk and Func. Tact is more high-level and prevents you from shooting yourself in the foot, while Func/Tolk give you more control and risks. (reply to 43965)

Georgiy: Actually, after refining Tact's backend, its contracts should be as efficient as Func/Tolk.

Laisky: The doc doesn't even mention tact😓 (reply to 43966)

Georgiy: I suppose that's because of TF's internal structure. (reply to 43968)

Alexander: Hi, guys, I have a problem with @ton/core javascript library. When my code is built with production configuration (Angular), it throws the error "CellType is undefined". Could anyone please suggest why this happens? Thanks!

FREE: You can try to communicate with this GPTs Maybe this will help you  https://chatgpt.com/g/g-TeOFnhTjH-ton-core (reply to 43972)

GamerZero: tact's vscode formatter extension seems completely broken

GamerZero: like, here's an example of Array type implementation in docs: https://docs.tact-lang.org/cookbook/data-structures/#array  the formatter would remove mutates keyword from all of the functions thus breaking the code

Anton: thanks, opened an issue here: https://github.com/tact-lang/tact-vscode/issues/49 (reply to 43975)

GamerZero: it's also non-deterministic sometimes (multiple attempts at formatting the same document keep producing different results), and seems to die when you put a return statement inside a while loop 😅  i would have reported that myself more thoroughly in issues but in a hurry rn (reply to 43978)

Almatbek: contact me (reply to 43980)

Hollow: i want to get all token of wallet and show balance, can anyone help me

Я̨kov: https://docs.tact-lang.org/ref/core-common/#myaddress  or  https://docs.tact-lang.org/ref/core-common/#contractaddress (reply to 43987)

Я̨kov: Do you have debug enabled?  https://docs.tact-lang.org/book/debug/#debug-mode (reply to 43991)

Irvant: Yes

Andrii: Is there a good example of accepting usdt on chain in my smart contract (wanna accept usdt in exchange for nft minting)

Odilov: Can someone tell me why I can't get the Build folder to install?

Anton: does this help? https://docs.tact-lang.org/cookbook/jettons/#usdt-jetton-operations (reply to 43995)

Odilov: Can you help me (reply to 43999)

Jiego: Get the usdt contract address, have the user create a transaction transferring the usdt, on the forwardPayload call a function on your contract that handles the transfer  https://docs.tact-lang.org/cookbook/jettons/#sending-jetton-transfer (reply to 43995)

Guy: Hi, following on that.  Using the code in this link's code  I am calculating the contract's USDT address using the USDT master address intestnet and passing in the walletCode (which I take from the master's 'get_jetton_data').  I am assuming it is a hex string (https://testnet.tonviewer.com/kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy?section=method).  Yet, when I send USDT on testnet to my contact - it always sends it to a different address.  What could I be doing wrong? Thank you.  Code snippet: // utils.ts import { Cell, Address } from '@ton/core';   export const USDT_MAINNET_ADDRESS = Address.parse("kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy"); export const USDT_WALLET_BYTECODE = "b5ee9c7201020f010003d1000114ff00f4a413....";   export function hexToCell(hex: string): Cell {     const bytes = Buffer.from(hex, 'hex');     return Cell.fromBoc(bytes)[0]; // Convert the byte buffer to a Cell } (reply to 44001)

Odilov: Please help me

Я̨kov: Use Node.js 22+ (reply to 44015)

Yan ☻️: hey guys how to change font for ton-connect ui button

Kevin: No but I recommend you don’t. Consistent branding in ecosystem is better for conversion (reply to 44021)

— 2024-11-06 —

yong: Hi guys, I’m encountering some issues while using the sha256 method. There’s no error in the contract when I use it, but the code stops executing after reaching this step.

Alex: Tact extension for VSCode stopped to work. I tried to downgrade version, it doesn’t work ether. Error is:  `Tact language server is created. [Error - 12:58:44 PM] Request textDocument/definition failed.   Message: Request textDocument/definition failed with message: Cannot read properties of undefined (reading 'body')   Code: -32603`  Somebody knows how to fix it?

Laisky: I have a similar issue too, and the constant pop-up warnings are very annoying. (reply to 44036)

Alex: yeah, moreover go-to-definition and renaming don’t work (reply to 44039)

Mark: Hi everyone! We are looking for Tact/FunC smart contract developers at OpenLend  What you will need and what you will learn:  - Smart contract development and improvement. - Interaction with decentralized applications. - Active participation in the team and exchange of experience.  OpenLend is the first lending protocol with soft liquidations that changes the approach to lending in the DeFi world on Telegram x TON. We are expanding our team and inviting talented, passionate developers.  Salary: $1500 - $4000  Please send your CV to @getmanmmm (forwarded from Mark)

Philip: There's already a GH issue for this problem. Contents of .tact file at the moment error message showed up would really help reproducing it. (reply to 44036)

Kirill: Hi there, does anyone know good chatgpts for Tact language? Seems like basic gpt4-o doesn’t know Tact language well...

Ashraf: Hello,   I am trying to prevent users from transferring token before a specific day:      receive(msg: MintPublic) {         let ctx: Context = context();         let current_time: Int = now();         let unlock_time: Int = 1735454400;                  // Check if sender is not owner and current time is before unlock date         if ((ctx.sender != self.owner) && (current_time < unlock_time)) {             throw(132);         }          require(self.mintable, "Can't Mint Anymore");         self.mint(ctx.sender, msg.amount, self.owner);     } }  But it's not working, user getting Insufficient balance when sending after that time, any one could help ?

Ashraf: I have also tried claude but seems don't know much about Tact (reply to 44045)

Skuli: U can check this  https://t.me/tactlang/43871  https://chatgpt.com/g/g-tFkVOWIoi-tact (reply to 44045)

Kirill: Awesome, I’ll check it out (reply to 44048)

— 2024-11-07 —

wizardev: Hello .  I'm Ton FunC & Tact Engineer Experienced with ton bot and mini app Plz kindly reach me out

Pasha: Hey guys, is it possible to get StateInit of  a contract based on code_hash and data_hash? (like on screenshot)

Jignesh: Hey Guys, i want to create ICO smart contract using tact  and buy my token using USDT so how to transfer usdt in ICO contract and set metadata in ICO contract.

Anton: https://docs.tact-lang.org/cookbook/jettons/#usdt-jetton-operations Does this link help? (reply to 44112)

Jignesh: any github link? (reply to 44113)

Jignesh: anybody have any idea how to do this in deploy file? (reply to 44112)

GamerZero: Could i make this system work?     external(_: SomeExternalMessage) {         require(now() > self.nextCallTime, "Call me later");                  acceptMessage();          self.nextCallTime = now() + 60;     }

GamerZero: I can't figure out why this message gets accepted more often than every minute...

GamerZero: I suppose the problem might be that it consumes more than free limit of gas for the check itself, but what can i do about it?

— 2024-11-08 —

Heydie: Hi everyone   How to interact with contract written in Tact through Tonconnect in a way that the contract will receive a message.  For example: message Add { queryId: Int as uint64; amount: Int as uint32; }

Heydie: I'd be happy if someone could help

Jignesh: i want to buy my token using usdt how to do in fronetend ?

blocksdev: Check dedust-swap docs (reply to 44165)

GamerZero: Just got an error 133, docs say it is never thrown. And my code certainly doesn't throw it       error: "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n" +         "Cannot run message on account: inbound external message rejected by transaction F1C0B5EBA1262064DA38A01A06A7D343255C7159AD9D5849513111E3F3B7C07D:\n" +         "exitcode=133, steps=49, gas_used=0\n" +         "VM Log (truncated):\n" +         "...SIGNU\n" +         "execute PUSHCONT x28945F0ADB31E1F2C087\n" +         "execute IFNOT\n" +         "execute XCHG s2\n" +         "execute NOT\n" +         "execute XCHG2 s0,s7\n" +         "execute AND\n" +         "execute THROWIF 132\n" +         "execute XCPU s2,s5\n" +         "execute EQUAL\n" +         "execute THROWIFNOT 133\n" +         "default exception handler, terminating vm with exit code 133\n",

Я̨kov: Well, that's probably not on Tact's end, since Tact doesn't throw that error anywhere in the sources (hence the docs saying it's not thrown) (reply to 44181)

GamerZero: What else could that error mean? (reply to 44182)

GamerZero: It is not present in my sources either

Я̨kov: https://docs.ton.org/v3/guidelines/nodes/nodes-troubleshooting#cannot-apply-external-message-to-current-state--external-message-was-not-accepted (reply to 44183)

Я̨kov: I've found people reporting similar issues, and the consensus of sorts is that you have to check that the version of the client from @ton/ton is correct and the wallet type is matching too.  • https://github.com/toncenter/ton-wallet/issues/196 • https://github.com/toncenter/ton-wallet/issues/207  Hope that helps :) (reply to 44183)

GamerZero: Yeah but I'm not sending external messages in this code rn (reply to 44185)

GamerZero: Does Wallet itself send them on my behalf?

Я̨kov: Seems like it, but I'd double-check (reply to 44188)

GamerZero: It's also random. I have a cron job running that sends the same exact transaction every time. Most of the time it works but one of the runs had this error out of nowhere

— 2024-11-09 —

Nerses: i have created new project using blueprint but it fails building [3/3] Creating your first contract... Build script running, compiling Game ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function     at resolveFunctionDescriptor (\@tact-lang\compiler\dist\types\resolveDescriptors.js:600:31)     at resolveDescriptors (\@tact-lang\compiler\dist\types\resolveDescriptors.js:1243:19)     at precompile (\@tact-lang\compiler\dist\pipeline\precompile.js:18:55)     at Object.build (...\@tact-lang\compiler\dist\pipeline\build.js:62:43)     at doCompileTact (...\@ton\blueprint\dist\compile\compile.js:130:28)     at doCompileInner (...\@ton\blueprint\dist\compile\compile.js:144:22)     at doCompile (...\@ton\blueprint\dist\compile\compile.js:168:23)     at async buildOne (...\@ton\blueprint\dist\build.js:21:24)     at async create (...\@ton\blueprint\dist\cli\create.js:84:9)     at async main (..\node_modules\@ton\blueprint\dist\cli\cli.js:91:5) Error: Could not find boc in tact compilation result Error: Command failed: npm exec blueprint -- create Game --type tact-empty     at checkExecSyncError (node:child_process:890:11)     at execSync (node:child_process:962:15)     at main (...\node_modules\create-ton\dist\cli.js:141:34) {   status: 1,   signal: null,   output: [ null, null, null ],   pid: 37024,   stdout: null,   stderr: null }  can someone give a hint what can cause it ?

Nerses: @novusnota42 could you please check this ?

Я̨kov: Use Node.js 22+  Btw, this error is resolved in upcoming 1.6.0 version of Tact (reply to 44242)

RootTon: hello everyone, is it possible to redeploy smarts in Tact? or is it possible to supplement an existing smart contract somehow? (I apologize in advance, I'm new to smart contracts)

Nerses: yeah it worked thanks a lot (reply to 44244)

Mirheydar: Hi, how do we call a get method of a contract from a different contract on TACT?

Anton: It’s not possible (reply to 44261)

Mirheydar: Is it the same with Func or it's TON related issue? (reply to 44262)

Anton: TON related (reply to 44263)

Александр: if it is implemented it is possible to exchanges messages like in wallet discoverable https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/ft/jetton-minter-discoverable.fc#L99 (reply to 44261)

RootTon: hello everyone, I've been digging around a bit and more or less figured out what's where, and I made a getter that just returns me a string, but with all this, when I call this getter, I get this object:  {   "success": true,   "exit_code": 0,   "stack": [     {       "type": "cell",       "cell": "b5ee9c7201010101000700000a68656c6c6f"     }   ] }  how can I get my string from this? help please

Nerses: can receive method accept two different messages at same time ?

Mirheydar: Here the query id has to be 42 or I need to provide a different id each time?

Babagana: Yes (reply to 44272)

Mirheydar: So, same all time? (reply to 44273)

Я̨kov: Different id each time. The purpose of this id is for the contracts on receiving end to not process the same message twice.  If messages in your contract are processed idempotently (i.e. multiple received messages all yield same results as the first received message), then you won't need this queryId (reply to 44272)

Mirheydar: What is wrong with this syntax? It works with blueprint test, but throws error when deployed  When I use blueprint run I get this error Error: Unsupported stack item type: tuple  when I call through tonviewer I get exit code 7

Nerses: is it possible to use foreach for map of map ?

Mirheydar: Please assist me if anyone have  any understanding on this topic (reply to 44282)

Nerses: @novusnota42 can you please answer ?

Nerses: to this question (reply to 44286)

Я̨kov: Do you mean a nested foreach loop? Should be possible (reply to 44286)

Nerses: yup.thanks a lot (reply to 44324)

— 2024-11-10 —

.: Hi guys, I need your help, I made get- request to get Holders of  Jetton and what doe's mean the first 'address'? {'address': '0:9a639a8e77....301c0092aed01dc7', 'balance': '446544', owner': {'address': '0:81b8635......0e65fd31d670a67b571eb5360', is_scam': False, is_wallet': True}}

Alex: I’m wondering how to get opcode for message declared in Tact?

Anton: You can either specify it manually when declaring a message type, or look in the ABI in the generated files (reply to 44362)

User<8134101884>: Maybe it's your wallet. What did you use to make the request? (reply to 44360)

Freed: I'm sending transaction from a wallet to router contract, which sends transactiob to child contract   How do I return TON to wallet if child contact tx fails?

Guy: Check in the parent contract for bounced<parentToChildMessage> and then return the ton to the user's address. (reply to 44373)

Toan: Have anyone ever tried submit swap using swap coffee aggregator in BE? I just follow this example here (https://docs.swap.coffee/#basic-usage) but change it from using tonconnect to BE TON wallet load from mnemonic keys but it's keep failing   const client = new TonClient({   endpoint: "https://toncenter.com/api/v2/jsonRPC",   apiKey: "your_api_key", // prevent rate limit 1 req/s });  async function loadWallet() {   const mnemonics = process.env.TON_MNEMONIC!.split(" ");    const keyPair = await mnemonicToPrivateKey(mnemonics);    const workchain = 0;   const wallet = WalletContractV4.create({     workchain,     publicKey: keyPair.publicKey,   });   const contract = client.open(wallet);    console.log(     "Load ton wallet success",     wallet.address.toString({ bounceable: false })   );    return { contract, keyPair, wallet }; }  async function main() {   console.log("starting...");   const { contract, keyPair, wallet } = await loadWallet();    const routingApi = new RoutingApi();    const assetIn: ApiTokenAddress = {     blockchain: "ton",     address: "native", // stands for TON   };   const assetOut: ApiTokenAddress = {     blockchain: "ton",     address: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs", // USDT   };    const input_amount = 1; // 1 TON    // let's build an optimal route   const route = await routingApi.buildRoute({     input_token: assetIn,     output_token: assetOut,     input_amount: input_amount,   });    // then we can build transactions payload   const transactions = await routingApi.buildTransactionsV2({     sender_address: wallet.address.toString(), // address of user's wallet     slippage: 0.1, // 10% slippage     paths: route.data.paths,   });    let messages = [];    for (const transaction of transactions.data.transactions) {     messages.push(       internal({         to: transaction.address,         value: transaction.value,         body: transaction.cell,       })     );   }    // just send the swap transaction   await contract.sendTransfer({     seqno: await contract.getSeqno(),     secretKey: keyPair.secretKey,     messages,   });  // this is not working as expected   console.log("done"); }

Ali: Hey everyone! is it possible to use Merkle Tree in Tact? If it yes, is there a any example? unfortunately i couldnt find it also i am not sure is it possible.

Nerses: Why do you need it ? All TON blockchain is tree of Cells and you can prove any subtree in it (reply to 44383)

Ali: i want to create a vesting contract for possible +100k user.

Ali: i mean like in EVM, i cant push that much data to contract in one function for gass problems etc. so thats why we usually using merkle tree. i am just try to understand how can i make in TON for that much user.

Nerses: To be frank I am not aware of vesting contracts.But I am sure architecture of Jetton can somehow help you (reply to 44386)

Alexander: It’s possible, I used merkle tree in a vesting contract. You’ll need to use FunC though for a small part of code to parse merkle proof cells (tact cannot do that currently) (reply to 44383)

Ali: its just a basic claim contract, i am just allowing to claim spasific amount every month. I beleive i can do that somehow but idk how. (reply to 44387)

Ali: gotcha (reply to 44388)

Ali: thanks

Ali: can you share an example for Func?

Nerses: You mean Jetton contract ? (reply to 44392)

Ali: No i mean, example of merkle tree in Func

Nerses: I haven't seen but I will do some research (reply to 44394)

Ali: ohh its fine, you dont need to do

Alexander: (slice, int) begin_parse_exotic(cell c) asm "XCTOS";  (slice) get_entry(cell proof_cell, int merkle_root, int index) {     (slice cs, int exotic?) = proof_cell.begin_parse_exotic();     throw_unless(42, exotic?);     throw_unless(43, cs~load_uint(8) == 3);     throw_unless(44, merkle_root == cs~load_uint(256));      cell dict = cs~load_ref();     (slice entry, int found?) = dict.udict_get?(256, index);     throw_unless(45, found?);      return entry; } (reply to 44392)

Alexander: It’s only to parse a proof cell. All the rest you can do in Tact

Ali: awesome

Ali: maybe I can just create a structure that will fix the proof. I can deploy this func code and with the merkle data I get from each message, I can solve the root and record the amount the user requested on the map and create a successful vesting contract.

Freed: Address is too large to be inside bounced message.   Tact doesn't let me receive full ParentToChild message and bounced<ParentToChild> doesn't contain address of wallet (reply to 44374)

Rus: let fizz: map<Int, Int> = emptyMap();  fizz.set(7, 123);  let deletionSuccess: Bool = fizz.del(7); // true, because map contained the entry under key 7 fizz.del(7); // false, because map no longer has an entry under key 7  Will second attempt to fizz.del(7); result in crash / does it throw / revert?

Я̨kov: No, this won't result in any error and that is by design (reply to 44420)

Rus: So I need to add fizz.del(7)!! for it to crash? (reply to 44428)

Я̨kov: Nope. If you really want it to crash, do the following:  nativeThrowIf(42069, fizz.del(7) == false); Where 42069 is the exit code that will be thrown when .del() didn't do anything to the map (reply to 44429)

Rus: Alright, thanks (reply to 44430)

Я̨kov: To let Tact generate exit code for you, do:  require(fizz.del(7), "Did not delete any entries!"); See https://docs.tact-lang.org/ref/core-debug/#require

User<7096356687>: Okay (reply to 44434)

— 2024-11-11 —

Guy: U need to put the address on the ParentToChild message (else save it in a map in the parent contract which is a bad option). Try bounced(bounced<ParentToChildMessage>) (reply to 44413)

màtín: hi  Im try to build by blueprint but  $ npx blueprint build Build script running, compiling Tact ⏳ Compiling...Tact compilation failed TypeError: paramSet.isSubsetOf is not a function Error: Could not find boc in tact compilation result Do you have any idea?

Jiego: Install node 22 (reply to 44449)

màtín: Yes (reply to 44450)

PixieLand Support: Hi guys, is energy consumption between Tact and FunC really notable? Big difference between Tact and FunC in case of energy fees for the users?

Anton: If you understand the programming model for TON blockchain the difference might be not that great (reply to 44453)

Shahzaib: is there a way to interact .net sdk (unity) wtih Tact based smart contracts?

Shakil: Hello there  i have just started  learning  the tact  language i have created a basic contract with mint and transfer can you help me to find the error in code  import "@stdlib/ownable";  struct Metadata{     name: String;     symbol: String;     totalSupply: Int;     decimal: Int; }  contract Token with Deployable {      name: String;     symbol: String;     decimal: Int as uint32;     totalSupply: Int as uint32;     owner: Address;       //mapping     balance: map<Address,Int>;     // transferToken: map<Address map<Address,Int>>;       init(name: String,symbol: String,decimal: Int,totalSupply: Int) {         self.name = name;         self.symbol = symbol;         self.decimal = decimal;         self.totalSupply = totalSupply;         self.owner = sender();     }      get fun name(): String{         return self.name;     }      get fun symbol(): String{         return self.symbol;     }      get fun totalSupply(): Int{         require(self.totalSupply > 0,"TotalSupply must be greater than 0");         return self.totalSupply;     }      get fun decimal(): Int{         return self.decimal;     }      get fun balances(address: Address): Int {     require(sender() == self.owner, "only owner");     return self.balance.get(address).unwrap("Address not found");     }       fun transfer(to: Address, amount: Int){          let recBalance = self.balance.get(to);  // Default to 0 if the address doesn't exist         require(amount >= recBalance,"Insufficient funds to transfer");          //update sender mapping update         let newBalance = balances(sender()) - amount;         self.balances.set(sender(), newBalance);          //update reciver mapping update         self.balances.set(to,amount);         send(SendParameters{             to:to,             value:amount,             mode: SendRemainingValue + SendIgnoreErrors         });     }      fun mint(to: Address, amount: Int){         require(self.owner == sender(),"Only owner can mint");         require(amount > 0,"Invalid amount");         self.balance.set(to, amount);         send(SendParameters{             to: to,             value: amount,             mode: SendRemainingValue + SendIgnoreErrors         });     }       }  Thank you

/B4ckSl4sh\: Guys, did someone encountered error, when Tact does not want to build all the files (There was no such behaviour yesterday, I did not update anything)  Using file: JettonMaster Build script running, compiling JettonMaster ⏳ Compiling...   > JettonWallet: tact compiler    > JettonWallet: func compiler    > Packaging    > JettonWallet    > Bindings    > JettonWallet    > Reports    > JettonWallet So it only compiles JettonWallet Even though It should compile JettonMaster (it is in jetton_master.tact)  import { CompilerConfig } from '@ton/blueprint';  export const compile: CompilerConfig = {     lang: 'tact',     target: 'contracts/jetton_master.tact',     options: {         debug: true,     }, };

/B4ckSl4sh\: Maybe you can share compiler output? It would be easier to find an error) (reply to 44461)

Shakil: yes here is is the compiler output let updateBalance = self.balance.get(sender()); > 63 |         let newBalance = updateBalance - amount;                                 ^~~~~~~~~~~~~~~~~~~~~~   64 |         self.balance.set(sender(), newBalance);

Shakil: Invalid type "Int?" for binary operator "-"

/B4ckSl4sh\: https://docs.tact-lang.org/book/operators/#unary-non-null-assert (reply to 44468)

/B4ckSl4sh\: Maybe I am doing something wrong? I can provide any additional info (reply to 44462)

Shakil: i have two question  1) how to use nested mapping in tact as we use in solidity  2)can we call getter funciton in another function

Aish: Hi guys,   How do we check the version of tact?

Shakil: npx tact --version  paste this in terminal (reply to 44473)

Я̨kov: 1. Put one map inside a Struct, then use that Struct for the value type of your map  Something like:  struct Idk { m: map<Int, Int> }  fun showcase() {     let m: map<Int, Idk> = emptyMap();     // here you go } 2. Nope, getter functions are only there to be called off chain. Getter cannot call another getter, but can call, say, a global function that won't modify contract state (reply to 44472)

Shakil: require(sender() == self.owner, "only owner");     return self.balance.get(address);     }       fun transfer(to: Address?, amount: Int?){          let recBalance = self.balance.get(to);         require(amount >= recBalance,"Insufficient funds to transfer");          //update sender mapping update         let newBalance = balances(sender()) - amount;         self.balances.set(sender(), newBalance);          //update reciver mapping update         self.balances.set(to,amount);         send(SendParameters{             to:to,             value:amount,             mode: SendRemainingValue + SendIgnoreErrors          });     }  so this is wrong approch that i am calling a getter function to get the value from mapping?? (reply to 44477)

Shakil: and i am not able to subtract the amount from the previous balance

Я̨kov: No, it is perfectly valid. But you seem to call send() — it obviously modifies contract state and therefore not allowed inside of a getter (get fun _() {...}) (reply to 44479)

Shakil: ohk but i think i have not call send() funciton in getter function i have call send() in transfer function which will emit the event after transaction completed

Laisky: Is there a way to convert an int to a HEX format string in tact?

Я̨kov: Yeah, but not directly. If you have an Int, you can call .toString() on it, and then you'll have the String (Slice) with bytes of that Int, which can be represented as hex by your logic.  https://docs.tact-lang.org/ref/core-strings/#inttostring (reply to 44483)

Laisky: Not sure I get it. 🤔 If I have two ints, a & b, how do I do hex(a) + hex(b) in Tact? (reply to 44484)

Aish: Thank you😊 (reply to 44474)

Aish: Hi guys, Does any one know, how do we get verified tag on tonviewer for your jetton?

/B4ckSl4sh\: Is there any guide on how to use Tact not in blueprint?

Я̨kov: Probably by using https://github.com/tact-lang/tact-template, which uses Sandbox, but not Blueprint (reply to 44494)

/B4ckSl4sh\: thx (reply to 44496)

Я̨kov: Something like this would work, but at this point it is probably best to move some of this logic off chain:  ```tact fun hex(x: Int): String {     let neg = x < 0;     let nextPos = (neg ? -x : x).toString().asSlice().bits() / 8;     let store: map<Int, Int> = emptyMap();          let quotient = (neg ? -x : x) / 16;     let remainder = (neg ? -x : x) % 16;     while (quotient != 0) {          store.set(nextPos, remainder);          nextPos -= 1;          remainder = quotient % 16;          if (quotient / 16 == 0) {              store.set(nextPos, remainder);          }          quotient /= 16;     }           let num = beginString();     if (neg) { num.append("-") }     num.append("0x");     foreach (_, v in store) {         if (v < 10) {             num.append(v.toString());         } else if (v == 10) {             num.append("A");         } else if (v == 11) {             num.append("B");         } else if (v == 12) {             num.append("C");         } else if (v == 13) {             num.append("D");         } else if (v == 14) {             num.append("E");         } else if (v == 15) {             num.append("F");         } else {             require(v < 16, "Some remainder is greater than 16!");         }     }      return num.toString(); } ```  The function above works by calculating and storing digits of the soon-to-be hex number in a map going right to left by the number, and then composing the actual number by going in reverse, since foreach obtains entries in ascending order of key values. I didn't test it much, but figured the ideas of this function might be helpful to you elsewhere (reply to 44486)

Anton: let neg = x < 0 ? true : false;  looks like   let neg = x < 0; (reply to 44498)

Laisky: Thank you so much! (reply to 44498)

E: What is the error, when try to send TON to smart contract?  [TON_CONNECT_SDK_ERROR] z Context must be an Activity

Я̨kov: Looks like something to deal with Android activity lifecycle, but I might be wrong here, so try looking for their GitHub for similar issues and ask the question there:  https://github.com/ton-connect/sdk (reply to 44503)

E: reinstall tonkeeper is helped, thanks (reply to 44505)

Urban: Perhaps someone can point me in the right direction. I'm transferring Jettons w/ comments and I need to process the comment inside a contract (via jettonNotify message). Think of this like a metadata check: if metadata OK do something, if not send jettons back/do something else. The "metadata" should hold a few pieces of information, so I'm inclined to pass a map into to jetton transfer comment and somehow parse that in the contract. For the jetton transfer Im thinking about using something like this from tonutils: https://github.com/nessshon/tonutils/blob/main/tonutils/utils.py#L145 and deserializing that in the contract. But I'm probably overthinking this. Has someone done something similar or can point me in the right direction?

Laisky: Jetton notifications aren't always guaranteed to be sent. By the time you receive a notification, the jetton transfer has already taken place. You'll have to cover the cost of sending it back, which can lead to additional expenses. (reply to 44511)

— 2024-11-12 —

Laisky: here is an example of how to generate and verify signature https://github.com/Laisky/tact-utils/blob/main/tests/Sample.spec.ts#L32 (reply to 44528)

bc1p: 🫡 GM everyone, has anyone run into this problem?  I transferred official USDT (fc jetton) to a specified contract (tact) with a forward_payload, but when I tried to parse the forward_payload inside the contract(inside message TokenNotification), I got an error: "code 9 Cell underflow." However, the same process works fine when I use tact jetton for the transfer and parse.

Howard: your Tact code? (reply to 44532)

bc1p: @howard_ton   Here is the tact code      receive (msg: TokenNotification) { // 0x7362d09c         dump("enter TokenNotification ... ");         dump(msg.amount);         dump(msg.forward_payload);         let ctx: Context = context();         let amountIn: Int = msg.amount;         let forwardPayload: Slice = msg.forward_payload;                  let nftAmount: Int = forwardPayload.loadUint(32);         dump(nftAmount); ...   And here is the ts code, package the forward data:   usdtWallet_1 = blockchain.openContract(UsdtJettonWallet.createFromConfig(             jettonWallet_params_1,              usdtJettonWalletCode         ));          console.log('111 Deployer`s USDT Jetton Wallet: ' + usdtWallet_1.address);         let curBal = await usdtWallet_1.getWalletData();         console.log('Deployer`s USDT Balance: ', curBal.balance);          //--------------------------------------------------------------------------------------------         const notifyBody = beginCell()             .storeUint(1, 32)                  //             .storeAddress(treasury.address)         //             .endCell();                  const buyResult = await usdtWallet_1.sendTransfer(             deployer.getSender(),             toNano(0.77),             toNano('0.123'),             nftsale.address,             deployer.address!!,             null,             toNano('0.55'),             notifyBody         );

bc1p: when I try to parse "forwardPayload.loadUint(32);"   Cell Underflow

Georgiy: The issue is that msg.forward_payload contains less data than you read. I would additionally check the input in contract's code using the .bits() method.  Misti will highlight these underflow cases since the next release: https://github.com/nowarp/misti/pull/214 (reply to 44535)

Shakil: TypeError: paramSet.isSubsetOf is not a function can any one help me with this error i getting this error while building smart contract

Georgiy: Use node.js 22+ (reply to 44537)

Shakil: i have created a basic ERC20 smart contract in tact build and test is done every thibk working fine  i deploy the contract on testnet not i want to verify my contract does any one i have idea how to verify contract

Shakil: what to write in directory field

/B4ckSl4sh\: If you want to verify tact code you should upload only .pkg file (reply to 44543)

Akachi: You mean jetton contract? (reply to 44539)

Shakil: yes

Andrei: Hey! Looking for an advise. I'm developing a smart contract. Basically upon the call to the smart contract, object should be initiated, then upon other calls, it get's modified, and eventually distributes the funds. After that I don't really need the object anymore.  So, my question is, what is the best design approach here? Should I create 1 smart contract, deploy it, and store/clear objects  Or should I rather deploy a new instance of smart contract upon every object creation (not even sure yet if it's possible though)?  Thanks

/B4ckSl4sh\: Both approaches is actually possible. So all depends on your needs (reply to 44559)

Skuli: How do I make myself assignees? I don't see this possibility  https://github.com/tact-lang/tact-vscode/issues/51

E: Is there any guarantee that the child smart contract created the main one?

E: How can I verify that the contract creator is a specific address?

/B4ckSl4sh\: There is no way of checking this directly (reply to 44564)

Cyril M |: store the creator address to a state var, verify it by   require(sender() == self.owner, "not owner")

E: Anyone can create a child contract, and create it interact with the main contract? (reply to 44565)

/B4ckSl4sh\: In your case the answer is above (reply to 44567)

/B4ckSl4sh\: . (reply to 44566)

E: I could be wrong, but am I the only one who can do it, or can anyone do it? (reply to 44566)

E: We take the address of the ovner and create a contract with it, via the contructor (reply to 44570)

DIAMOND_00000: Hi! Is there anyone need help regarding to creating sc development?

Santosh: Hello, Im trying to verify a signature in tact using checkSignature function but i always get false. I am using nodejs to generate the signature. Tact code:  message Payload {     queryId: Int as uint64;     publicKey: String;     signature: String;     data: String; }  receive(msg: Payload) {     dump(msg.data);     let opHash: Int = msg.data.asSlice().hash();     let verify: Bool = checkSignature(opHash, msg.signature.asSlice(), msg.publicKey.asSlice().hash());     dump("Verify");     dump(verify);     require(verify, "Invalid Signature"); }   Nodejs code  it('should verify signature', async () => {     const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');      const data = 'Hello, world!';     const hash = crypto.createHash('sha256').update(data).digest();     const signature = crypto.sign(null, hash, privateKey);      const publicKeyBuffer = publicKey.export({ type: 'spki', format: 'der' });     const publicKeyBase64 = publicKeyBuffer.toString('base64');     const publicKeyHex = Buffer.from(publicKeyBase64, 'base64').toString('hex');     const publicKeyInt = BigInt('0x' + publicKeyHex);      const payload = {         queryId: BigInt(Date.now()),         data: data,         signature: signature.toString('base64'),         publicKey: publicKeyInt.toString(),     }      let blockchainSigner = await blockchain.treasury('blockchainSigner');     await sampleJetton.send(         blockchainSigner.getSender(),         {             value: toNano('500'),         },         {             $$type: 'Payload',             ...payload,         },     ); });

Ali: i am trying to deploy a TACT contract with the TonKeeper wallet. I am succesfully connected my wallet but when in the deploying stage, i never get deployment request from mobile app. Because of this issue i cannot deploy the contract. I even tried to TonHub wallet and have same issue. Whats the problem? How can i solve it?

Ali: Btw i also change my mobile phone and i tried to both type of device 'iphone and android' but still i have that issue.

🐝 Lil BEETCH 🐝: Try to delete temp folder and try again (reply to 44578)

Ali: already did it

Ali: same issue

Ali: just did it again and now, tonkeeper is not even reading the connection qr code.

🐝 Lil BEETCH 🐝: What about desktop tonkeeper app? (reply to 44582)

Ali: also i did it

Ali: i never getting deployment transaction request in wallet

🐝 Lil BEETCH 🐝: What if you try to open this link below qr code?

Mehmet Ali: Average cost of our jetton transfer from a to b is 0.1 TON. Not sure is it efficient or not. What do you think?

Ali: i did it actually (reply to 44586)

Ali: but same issue

— 2024-11-13 —

Shakil: Hello need help i working on a function where i have to update mapping i am using replace() method.. which i saw on tact official documents but they have mention (Available since Tact 1.6) i am using (1.5.2) so can any one help that how should i update to 1.6 version

Shakil: https://docs.tact-lang.org/book/maps/#replace

dmytro affixpin: Hi everyone! Is Tact ready to be used on mainnet right now? Maybe there's already a live project written in Tact?

dmytro affixpin: The language looks great with excellent documentation, but it seems like Func is deprecated now and Tolk is coming. Will Tact also be compiled into Tolk?

Georgiy: Tact is ready for production and the implementation has been audited for security issues.  AFAIK the most interesting production Tact contracts don't put their implementation in public access, but there are a few. (reply to 44608)

Georgiy: I don't think so. Most likely, it needs its own TVM backend, but that's my personal opinion. (reply to 44609)

/B4ckSl4sh\: Yes, for example Gas Pump use contracts written in Tact (reply to 44608)

Anton: afaik, PixelSwap is implemented in Tact (reply to 44608)

Anton: Of course not :)  We are starting to work on our new optimizing compiler backend, so no transpilation into FunC or Tolk won’t be needed. We estimate its arrival in Q1 or Q2 2025 (reply to 44609)

dmytro affixpin: thank you for responses, diving deeper into Tact then 🙂

— 2024-11-14 —

⁭: Any example zk-snarks?

Shakil: balanceMap: map<Address,Int> = emptyMap();  get fun myBalance(user: Address): Int{         let userBal: Int? = self.balanceMap.get(user);         return userBal!! ;     }  getting this error "Unsupported stack item type: undefined "

Ali: its because user address may not can be exist in the map. thats why u need to add somethink for this case.       get fun myBalance(user: Address): Int {         let balance: Int? = self.balanceMap.get(user);         require(balance != null, "Address not found in balance map");         return balance!!;     }  -        get fun myBalance(user: Address): Int {         let balance: Int? = self.balanceMap.get(user);         if (balance != null) {             return balance!!;         } else {             return 0;         }     }    both of them could be work. (reply to 44669)

Shakil: please help me. how to verify contract

/B4ckSl4sh\: upload only .pkg file (reply to 44671)

Shakil: and what should i add in directory

/B4ckSl4sh\: Are you sure your code compiles correctly? (reply to 44674)

Shakil: yes contract is working fine

Shakil: [TON_CONNECT_SDK] Wallet message received: { error: { code: 0, message: 'Context must be an Activity' }, id: 26 } UnknownError: [TON_CONNECT_SDK_ERROR] UnknownError Context must be an Activity  can any one guess why i am getting this error

Я̨kov: https://t.me/tactlang/44507 (reply to 44678)

E: exact same error. (reply to 44678)

E: you can just close and reopen tonkeeper. But the error is floating and appears periodically. (reply to 44679)

— 2024-11-15 —

Andrey: Hello all. I want to decrease fees in my Jetton on tact. I have an idea to use exotic cell for wallet contract. Is it possible?

/B4ckSl4sh\: Exotic cells are not supported yet. But you can write that piece of code in funC and integrate it with tact (reply to 44720)

màtín: hey  is there any docs that guides me to reed prices OnChain(in smart contract) from DEXs

SH: check redstone oracle section from doc (reply to 44733)

Makos: What base do I need to know to start learning tatc language?

Я̨kov: 0. Know how to code a little in any popular programming language out there 1. https://tact-by-example.org 2. https://docs.tact-lang.org (reply to 44741)

Andrey: Is there any example? I don`t understand how to provide library with jetton wallet code to master on tact. Saw USDT example on funC. I need to create cell with code field in master and then compute address of wallet with it, right? (reply to 44729)

/B4ckSl4sh\: https://docs.tact-lang.org/book/import/#import-func-code (reply to 44754)

cubby: Hello. Is anyone looking for a blockchain engineer?

— 2024-11-16 —

mgnfy_view: Hello, I have a contract A which deploys contract B. Both are written in tact using the Blueprint framework. I want to call functions on contract B in the tests/ folder, how do I do so?

mgnfy_view: There are no wrapper classes generated for contract B

Anton: did you build all contracts?   npx blueprint build --all (reply to 44809)

mgnfy_view: Oh, I see!

mgnfy_view: Can you share a code snippet of how to call a function on contract B, the deployed contract? (reply to 44810)

mgnfy_view: I mean how do I use the wrapper to call the contract

mgnfy_view: I got it Open the contract with the correct init, and then you can directly read from it or send messages

2happy: i'm trying to deploy default jetton Master contract to testnet https://testnet.tonscan.org/address/EQCP7G8zXIOIaLNaiVDwQhtRk6-iLlPEEBUIqblG4gdz0ak8  There is no contract type and Jetton at all.  sources: git@github.com:howardpen9/jetton-implementation-in-tact.git  What's wrong here?

— 2024-11-17 —

Laisky: https://github.com/Laisky/tact-utils/tree/main/scripts There are many examples of contract calls here, which may help you. (reply to 44812)

Laisky: https://github.com/Laisky/tact-utils  This template project includes contracts and scripts for Jetton and NFTs, might be beneficial to you. (reply to 44846)

2happy: thank you bro (reply to 44859)

2happy: How can i deploy Jetton with in-chain metadata? Metadata  is content field in JettonMasterData? How can i make it on-chain? (reply to 44859)

2happy: I need to do something like this?  await JettonMaster.fromInit(       receiverAddr,       {         $$type: "Tep64TokenData",         flag: BigInt("0"),         content: "raw_data",       } )       ? But how can i compile my data to TD-B format? (reply to 44862)

Laisky: This code is fine; just replace raw_data with your JSON. (reply to 44869)

Alex: dedust or stonfi provide test network?

Danil: StonFi’s contracts are open source so you can deploy them on testnet. Not sure about dedust (reply to 44873)

Alex: ok, thank you (reply to 44876)

2happy: How can I detect swap on dex like dedust in wallet smart contract and take fees in ton?

Shakil: Hello! 👋  I have a doubt about TON blockchain. I'm currently working on a token contract. I have experience with Solidity, but I wanted to ask: should I add a mapping to my TON contract to keep track of addresses and tokens?

Даня: Why do i get this error: Error: Only one Tact file can be specified at a time. If you want more, provide a config!  when i write :  PS C:\Users\danil\Desktop\TON Booster> node_modules\.bin\tact compile --config tact.config.json my tact.config.json file is :

Я̨kov: compile there is redundant, simply call tact --config tact.config.json  To see all options of Tact CLI, run tact --help — there's quite a few :) (reply to 44885)

kira: hi everyone, i have written a message to receive jetton transfer notification message(0x7362d09c) JettonTransferNotification {     queryId: Int as uint64;     amount: Int as coins;     sender: Address;     forwardPayload: Slice as remaining; } and receive like below receive(msg: JettonTransferNotification) {       self.myJettonAmount += msg.amount;     } But i can't receive above message After i send an amount of jetton to my contract P/s: testnet environment Please help me

Tran: can i check transfer from DEX (stonfi, dedust)?

— 2024-11-18 —

Laisky: There's no need for a centralized ledger. Instead, deploy a separate contract for each token holder to keep track of their token balance. You can use this template as a reference. https://github.com/Laisky/tact-utils/blob/main/scripts/jetton.ts (reply to 44882)

Laisky: Notifications aren’t guaranteed to be sent. The transfer initiator must manually set the forwarded ton amount. (reply to 44888)

kira: thank you so much for your answer! i also got another problem when i want to transfer an amount of jetton from contract to my own wallet i config the message message(0xf8a7ea5) JettonTransfer {     queryId: Int as uint64;     amount: Int as coins;     destination: Address;     responseDestination: Address?;     customPayload: Cell? = null;     forwardTonAmount: Int as coins;     forwardPayload: Slice as remaining; } message WithdrawUSDT {     amount: Int as coins; } and  receive(msg: WithdrawUSDT) {         self.requireOwner();                   send(SendParameters{             to: self.myJettonWalletAddress,             value: ton("0.05"),             body: JettonTransfer{                 queryId: now(),                 amount: msg.amount,                 destination: sender(),                 responseDestination: sender(),                 customPayload: null,                 forwardTonAmount: ton("0.05"),                 forwardPayload: rawSlice("F")             }.toCell(),         });         emit(WithdrawUSDTEvent{amount: msg.amount, balance: self.myJettonAmount, sender: sender()}.toCell());     } But when i run the script  export async function run(provider: NetworkProvider) {   const pawsPurchase = provider.open(     PawsPurchase.fromAddress(Address.parse(CONTRACT_ADDRESS)),   );    // Send USDT to the contract   await pawsPurchase.send(     provider.sender(),     {       value: toNano("0.3"),     },     {       $$type: "WithdrawUSDT",       amount: 5000n     },   ); } i don't receive any jetton from contract, but i still lost 0.3 TON do you see any error in above code? (reply to 44900)

Laisky: What is the tx id? (reply to 44901)

kira: there's no tx id in my question? could you explain more? (reply to 44903)

Laisky: Could you share the tonviewer url for the transaction you referred to? (reply to 44904)

kira: https://testnet.tonscan.org/address/EQCIAbRL0hBIVud8XfHjuCLD-PTzHIKczvitHYnA2Bo0ahZE

Navpreet: Hi everyone, I need some help with TonConnect. I’m working on a Telegram mini-app project built with React.js. I've successfully implemented the 'send transaction' method, and transactions are being sent successfully. However, I want to know how to verify if a transaction has actually occurred and if the funds have been received in our wallet, so I can proceed with further processing. Any guidance or resources on this would be greatly appreciated. Thanks in advance!

Tran: Hi all, Is there any way to modify the source code of a wallet contract? I need to update some stored variables.

Shakil: Thank you @laiskycai (reply to 44899)

Anton: Fixed (reply to 43968)

bc1p: GM everyone 🫡  this function get_nft_address_by_index is must implement in a nft collection  if I defined it to getNftAddressByIndex will cause someting problem?

Laisky: I am facing an issue while trying to compute the SHA-256 value of a string in Tact. When the lengths of v1 and v2 are 63, the on-chain and off-chain calculations yield consistent results.  However, when the length of v is 64, the result from the on-chain calculation does not match the result obtained off-chain using sha256(v1 + v2). What could be causing this discrepancy?

Anton: https://docs.tact-lang.org/ref/core-math/#sha256 (reply to 44927)

Anton: sha256 at run-time uses the SHA256U TVM instruction, which only works with data with up to 1023 bits, so strings of length 128 bytes basically get truncated

Anton: @laiskycai Will be resolved in Tact 1.6: https://github.com/tact-lang/tact/issues/1056

Laisky: This is amazing! There are many scenarios that require calculating the SHA-256 value of a 128 bytes string! (reply to 44928)

ken: hey! you have to create your own abstraction. check the link below  https://medium.com/coinmonks/understanding-ton-transactions-how-to-track-transaction-results-and-utilize-tonclient-b992336eb3a3 (reply to 44915)

🗺️: Hello there is there any documentation of how can we implement stars transactions in mini app?

Yash: Hello everyone, can someone help me how to do this thing in Tact? I wish to know the address of the user who sent the jetton in the contract as well as which jetton is sent to the contract. () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     // Ensure the message body is not empty     if (in_msg_body.slice_empty?()) {         return ();     }      // Parse the message header     var cs = in_msg_full.begin_parse();      // Extract the sender address (user wallet address)     let user_wallet_address = cs~load_msg_addr(); }

Anton: https://docs.tact-lang.org/ref/core-common/#context (reply to 44938)

Yash: let whoSentMeMessage: Address = sender(); this returns the address of sender of message. So would it be user address or the jetton wallet address? (reply to 44939)

Anton: if you need to parse that info from the input message, then you need to define it’s structure first (reply to 44940)

MaratㅤSafiyev: Hello everyone! How can i verify me jetton which i launched on ton blockchain?

/B4ckSl4sh\: upload a .pkg on https://verifier.ton.org/ (reply to 44947)

MaratㅤSafiyev: can you help me with it, please? (reply to 44948)

/B4ckSl4sh\: What are you struggling with? (reply to 44949)

MaratㅤSafiyev: i dont know how to upload .pkg there (reply to 44950)

MaratㅤSafiyev: bro thanks🙏 (reply to 44948)

— 2024-11-19 —

cubby: Hello. Is anyone looking for a blockchain engineer?

Erdan: Can someone help me look into this issue?

Erdan: blueprint run   node:internal/process/promises:392       new UnhandledPromiseRejection(reason);       ^  UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "#<Event>".     at throwUnhandledRejectionsMode (node:internal/process/promises:392:7)     at processPromiseRejections (node:internal/process/promises:475:17)     at processTicksAndRejections (node:internal/process/task_queues:106:32) {   code: 'ERR_UNHANDLED_REJECTION' }

Я̨kov: Check your deploy script. Perhaps, you're not await-ing some async function or, as error says, not handling rejected promises via .catch() call or try...catch block (reply to 44989)

Erdan: i run  npm create ton@latest and create simple tact   cd my project  npx blueprint build test and run   The Tact example project cannot be deployed directly. Where do I need to modify the script?

Deedee: i need buy ton testnet

Erdan: I still haven't solved this problem. (reply to 44989)

2happy: Hello, how can i get decimals value from metadata using tonweb? Why USDT have 6 and not ordinary ones 9?

bc1p: dont scan the qr code, just copy the link into browser (reply to 44989)

Andrei: You don’t need to buy it Just start conversation with @testgiver_ton_bot - /get - solve captcha - enter testnet address, you’ll get 2 ton. Operation can be performed every hour (reply to 44995)

bc1p: GM Everyone, If I emit a event in contract, how can I get this event msg with dton, which field name should I query?

Anton: https://docs.tact-lang.org/ref/core-common/#emit (reply to 45011)

Anton: check out the note there

Ali: Hey, is there any open source bridge between EVM to TON Blockchain?

Mirka: https://github.com/ton-blockchain Search repositories with word "bridge" (reply to 45017)

Ali: I seen this before, I am looking for a contracts that written in TACT language. It will take me a while to build it from scratch. (reply to 45018)

Ali: but thanks anyway!

Aaa: Hey guys, I'm trying to integrate TonSDK in Unity C# and having the following issue.  Exception: Received error: {"ok":false,"error":"LITE_SERVER_UNKNOWN: cannot apply external message to current state : failed to parse external message: external message is not a (Message Any) according to automated checks","code":500}

Farel: how to do batch mint in tact?

Yash: Hello everyone,  is there any way to calculate square root of a number in Tact?  Also when we are making a jetton transfer, let's suppose I am sending 2.5 jetton, would it be parsed as 2.5 only in contract or it would be parsed as 2.5 * 10^number of decimals automatically?

/B4ckSl4sh\: Anywhere in blockchain your 2.5 jettons will be 2.5 * 10**yourjetton.decimals (reply to 45031)

Nerses: To my mind you can implement at least Babylonian method (reply to 45031)

Yash: Sure. I was asking if there exists any prebuilt sqrt function like other functions for log and pow. (reply to 45034)

Yash: Thanks (reply to 45033)

Yash: How to exit a loop as we do using break/continue in general coding?

Philip: I'm no expert, but generally you can use a return instead. You'll only have to separate that loop into its own function (reply to 45054)

Ali: please check here, there is a many examples. https://tact-by-example.org/04-loops (reply to 45054)

Yash: Thanks (reply to 45056)

A: Hi guys. I have writtern a simple smart contract (counter) using Tact and I want to interact with it using a Reactjs app. Documentations on TON blogs are very old and are not compatible with recent versions of blueprint. Any suggestions?

Andrei: This is rather a statement, not a question. What exact problem are you facing? (reply to 45081)

— 2024-11-20 —

Laisky: https://github.com/Laisky/tact-utils/blob/main/contracts/jetton/jetton.tact#L194 here is a simple example to do batch mint (reply to 45028)

Laisky: https://github.com/Laisky/tact-utils This template project is created using the latest versions of Tact and Blueprint. It includes contracts, scripts, and a simple web example that may be helpful to you. (reply to 45081)

Tran: Hi, I run jetton on this project, but I has some issue when deploy (reply to 45096)

Laisky: Could you describe the issue? (reply to 45097)

traceur: What does exit code -13 mean? I can’t find it on https://docs.tact-lang.org/book/exit-codes/

Anton: are you sure it’s not -14? (reply to 45109)

/B4ckSl4sh\: iirc -14 is only negative exit code (reply to 45109)

Anton: there is also -32

Anton: Method ID not found. Returned by TonLib during an attempt to execute non-existent get method.

/B4ckSl4sh\: And it means same that 32, but cannot be faked? (reply to 45114)

traceur: so -13 also means method not found?

/B4ckSl4sh\: As far as I understand, -13 is tonlib exitcode, not TVM, so if you are using tonlib -13 is definitely method not found. (reply to 45119)

traceur: Yes I’m using https://github.com/ton-org/ton

2happy: Hello. I have error, when deploying default blueprint counter contract.  What can i do with it https://pastebin.com/UrYhX5tG

— 2024-11-21 —

A: Hi guys. I know that my question is somewhat irrelevant to this group and it's a reactjs question. But I want to interact with my smart contract from a react app. I have deployed a simple smart contract named "Counter". It has a simple method getCounter that returns the current value of the counter. I know how to send Increment request to increase the counter value but don't know how to read it. Can somebody help?  My reactjs code: import { beginCell, toNano } from '@ton/core'; import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'; import { storeIncrement } from './contracts/counter'; import { CONTRACT_ADDRESS } from './constants';  const App = () => {   const [tonConnectUI] = useTonConnectUI();    const transaction = {     validUntil: Date.now() / 1000 + 60,     messages: [       {         address: CONTRACT_ADDRESS,         amount: toNano('0.01').toString(),         payload: beginCell()           .store(             storeIncrement({               $$type: 'Increment',               amount: 1n,             })           )           .endCell()           .toBoc()           .toString('base64'),       },     ],   };    const handleIncrement = async () => {     const result = await tonConnectUI.sendTransaction(transaction);      console.log('Result: ', result);   };    const handleGetCounter = async () => {     // TODO: Get counter from Counter smart contract   };    return (     <div>       <div>         <TonConnectButton />       </div>       <div>         <button onClick={handleIncrement}>Send Increment</button>       </div>       <div>         <button onClick={handleGetCounter}>Get Counter</button>       </div>     </div>   ); };  export default App;  My Tact code: import "@stdlib/deploy";  message Increment {     amount: Int as uint32 }  contract Counter with Deployable {     // Empty init() function is present by default in all Tact contracts     // since v1.3.0, so the following may be omitted:     //      counter: Int as uint32;     id: Int as uint32;      init(id: Int) {         self.counter = 0;         self.id = id;     }      receive("increment") {         self.counter += 1;     }      receive(msg: Increment) {         self.counter += msg.amount;     }      receive() {              }      get fun counter(): Int {         return self.counter;     } }

Yash: Hello  How to get this jettonWalletCode? fun calculateJettonWalletAddress(     ownerAddress: Address,     jettonMasterAddress: Address,     jettonWalletCode: Cell, ): Address {      let initData = JettonWalletData{         balance: 0,         ownerAddress,         jettonMasterAddress,         jettonWalletCode,     };      return contractAddress(StateInit{         code: jettonWalletCode,         data: initData.toCell(),     }); }

Sid🐾: Hello guys  I'm new to tact programming language   Can anyone give me a simple road map?

Я̨kov: https://t.me/tactlang/44742 (reply to 45181)

A: I think this youtube channel can be helpful:  https://youtube.com/@alefmanvladimiren-xb4pq?si=--0Gt2BR9yA-am5f (reply to 45181)

Sid🐾: thanks (reply to 45186)

Ali: This example may can be helpful. There is a way to get jettonWalletCode. https://github.com/ton-blockchain/stablecoin-contract/blob/main/scripts/setStatus.ts (reply to 45173)

— 2024-11-22 —

Laisky: https://github.com/Laisky/tact-utils You can also take a look at this template project, which includes complete contracts, scripts, tests, and a web example. The README also contains an article I wrote about TON Tact. (reply to 45181)

CryptoCooker: hi everyone, is there any some complicated smart contract on deployed mainnet?

CryptoCooker: finding dev who deployed complicated ton smart contract on mainnet.

CryptoCooker: like dex or defi

Yash: working on it. Contract done. Working on testing and deployment. (reply to 45211)

— 2024-11-23 —

Almatbek: I have experience with it what's the matter? (reply to 45212)

Yash: Hello, can someone help me with my test script. I am getting exit code 9 it('should deploy', async () => {         const friendlyAddress = 'UQBkQP48aUEDg5Y5RRc8SxFHm_C5tNcJDlh3e9pYHC-ZmDBJ';         const parsedResult = Address.parseFriendly(friendlyAddress);         const validAddress: Address = parsedResult.address;          console.log(Address.isAddress(validAddress));              console.log("Parsed Address:", validAddress.toString()); // Debug Address              let additionalData: Cell = beginCell()             .storeInt(0, 32)             .storeAddress(validAddress) // Ensure this is correct             .storeInt(5000000, 64)             .storeInt(6000000, 64)             .endCell();              let payload: Cell = beginCell()             .storeInt(0, 32)             .storeAddress(validAddress)             .storeAddress(validAddress)             .storeAddress(validAddress)             .storeInt(BigInt(Math.floor(Date.now() / 1000) + 600), 64) // Deadline: 10 minutes from now             .storeRef(additionalData) // Reference additionalData             .endCell();              console.log("Payload as Cell:", payload.toString()); // Log payload         console.log("AdditionalData as Cell:", additionalData.toString()); // Log additional data              let payloadSlice = payload.asSlice();         const send = await amm.send(             deployer.getSender(),             {                 value: toNano('5'),                 bounce: false,             },             {                 $$type: "TransferNotification",                 query_id: 0n,                 jetton_amount: 1n,                 sender: validAddress,                 payload: payloadSlice,             }         );          console.log(send);          console.log("Transaction Results:", send.transactions.map(tx => ({             from: tx.address,             success: tx.description,             exitCode: tx.outMessages,             vmLogs: tx.vmLogs,         })));              console.log("Transaction Results:", send.transactions.map(tx => ({             from: tx.address,             success: tx.description,             exitCode: tx.outMessages,             vmLogs: tx.vmLogs,         })));              expect(send.transactions).toContainEqual(expect.objectContaining({             from: deployer.address,             to: amm.address,             success: true,         }));     });  the contract takes parameter like this  message TransferNotification {     query_id: Int as uint64;     jetton_amount: Int as uint128;     sender: Address;     payload: Slice; }  // payload is like  struct TransferNotificationPayload {     op: Int as uint32;             // Operation code (e.g., swap, provide_lp)     token_wallet: Address;         // Address of the other Router token wallet     refund_address: Address;       // Address for refund if operation fails     excesses_address: Address;     // Address for TON excesses     deadline: Int as uint64;       // Execution deadline for the transaction     additional_data: Slice;        // Additional operation-specific data }  // additional_data is like struct ProvideLPPayload {     min_out: Int;                 // Minimum required tokens to receive     receiver_address: Address;    // Address where tokens will be sent     lower_price: Int as uint256;  // Lower price     upper_price: Int as uint256;  // Upper price }

Georgiy: You received the CellUnderflow error, but I don’t see that issue in the source code you provided. Could you share the implementation of the receiver of this message and the complete error message? (reply to 45255)

Georgiy: Alternatively, I would try to run the latest version of Misti on this, which can detect cell over/underflows: https://nowarp.io/tools/misti/docs/next/detectors/CellBounds/

Georgiy: Also, try to console.log the size of your payload, just for the case:         let builder: Cell = beginCell()             .storeInt(0, 32)             .storeAddress(validAddress)             .storeAddress(validAddress)             .storeAddress(validAddress)             .storeInt(BigInt(Math.floor(Date.now() / 1000) + 600), 64) // Deadline: 10 minutes from now             .storeRef(additionalData); // Reference additionalData  console.log(builder.bits()); // <--- should not exceed 1023 bits let payload = builder.endCell();

Yash: Sharing my complete source code in dm. Here I am calling the receiver TransferNotification with the operation payload to call provideLiquidity function. (reply to 45256)

Ali: Hey, is there a any pyth oracle price feed example?

— 2024-11-24 —

Ash 🤓: Hi guys

Ash 🤓: New to tact

Ash 🤓: If someone is really good at tact dm me guys got a amazing ideas to work on long term as partners

Ash 🤓: Why is it so difficult to write test cases on ton tact

Ash 🤓: Guys just some body correct me here so we code contracts in tact and what's the use of wrapper and the scripts are wrappers contains the code that tact contacts have but just in ts and the scripts are just used for deployment?? And why is ur difficult to write test on this tact and let's say can we deploy contract without caring about the tests and then develop ui and make it's interaction with it ??

Я̨kov: The wrappers are for you to test, deploy or otherwise interact with the code Tact produced for execution on TON.   Without them, you'd need to write a lot of glue code yourself in order to, say, add tests. (reply to 45311)

Я̨kov: I assume you're taking about the tests that are written in Blueprint-based contract projects, regardless of their language of implementation (FunC, Tact, or something else).  I don't know what exactly you mean by "difficult", but I generally agree. To quickly iterate with Tact you might enjoy this setup instead of writing tests: https://docs.tact-lang.org/book/debug/#lab. But once you're confident in your logic, it's better to start thoroughly covering your contracts with tests. (reply to 45311)

Ash 🤓: So if we want to interact with contracts do we need to interfere with wrappers let's ra say u created ui to interact with contracts what you need do u need wrappers to interact with it and all the functions in the contacts need to be in wrapper (reply to 45313)

— 2024-11-25 —

Ash 🤓: Yes exactly (reply to 45313)

traceur: I made two same transcations, one succeed: https://testnet.tonviewer.com/transaction/05672ad32d3f0c81f077d8e1a4678caa5766d25cbdf86820a2fd9cb4d39f99b6 the other doesn’t send the last message https://testnet.tonviewer.com/transaction/8e58446c982dfb0c269c29f9c8358d54e657887d0d98f689aba47dbe865dad19, but shows no error. The gas is same, no code change on the contracts. Does anyone know why?

traceur: Is it common in Ton network, that sometimes messages won’t be delivered to the end, and exit silently without any error?

Laisky: F sends out more value than it receives. Once F's balance is depleted, it can no longer send messages.  Additionally, I guess you configured SendIgnoreErrors in the send function, which is why no errors were shown. (reply to 45350)

kim: Hi guys!When calling Tonconnect/UI, how to configure the payload to set the token to USDT?

traceur: “F sends out more value than it receives. Once F's balance is depleted, it can no longer send messages. ” But why the first transaction fail and the second transaction succeed? In the second transaction F should has less balance. (reply to 45356)

Laisky: The first sending attempt failed, so the balance stayed in F, allowing it to have enough balance to send a message on the second attempt. (reply to 45365)

Laisky: IMHO, it’s best to ensure that the value of out is always less than the value of in. (reply to 45365)

traceur: How to ensure that? Is there any tutorial or code example? (reply to 45369)

captain🥷🏻: dm me (reply to 45363)

— 2024-11-26 —

Laisky: https://github.com/Laisky/tact-utils You can take a look at this template project; it might help you. (reply to 45372)

LowGas: Hi devs, who knows how to buy/sell jettons on GasPump, PumpFun e.t.c  Using @ton/ton JS | TS  Thanks

⁭: How to check what type of nft could contract received?

— 2024-11-27 —

Sol: Hello. Does anyone have a ready made solution for the lunchpad?

grachzy: Hi, everybody! How do I fix the error?

Anton: use Node.js v22 (reply to 45444)

Anton: ⚡️ Added a security best practices page to the documentation  There are several anti-patterns and potential attack vectors that Tact smart contract developers should be aware of. These can affect the security, efficiency, and correctness of the contracts.  With the help of community contributors, we've discussed the do's and don'ts specific to writing and maintaining secure Tact smart contracts, and written a cohesive page for you!  🧑‍🍳🎉 Community contributors: PixelPlex and Aliaksandr Bahdanau 🐙 Implementation: #1070 ✈️ Delivered: docs.tact-lang.org/book/security-best-practices  🍲 where did the threat actor go? they ran somewhere ♨️ @tact_kitchen (forwarded from Tact Kitchen)

— 2024-11-28 —

Darren: Hi, are we able to update a jetton token contract mintable value after the token is published?

Sol: Hello . looking for assistants to develop smart contracts who understand tact

CryptoCooker: can you send me dm? (reply to 45473)

Tran: U can that logic to mint function (reply to 45472)

Mehran: Hi everyone, trying to create a new contract in my project using blueprint but I get this error, what's wrong?

Александр: try pascal case: "Gene" (reply to 45479)

Mehran: Wow!!! Fixed, thanks, saved my day (reply to 45480)

Kun: https://blog.ton.org/ton-foundation-announces-telegram-web3-grants

Anton: TON Studio is hiring!  TON Studio team is looking for Sr. Developer (Smart Contracts & Audits).  You will play a key role in advancing the TON ecosystem by designing, developing, and optimizing smart contract templates and libraries for DeFi and beyond. You will collaborate with the Tact compiler and developer tools teams to enhance the efficiency of Tact and related tools, as well as support other developers in utilizing these resources effectively.   You can find more details about the job opening and apply here: https://jobs.ton.org/companies/ton-studio/jobs/42108836-sr-developer-smart-contracts-audits#content  We invite builders to post vacancies in the TON Jobs channel. To do this, you need to write to support @tonjobs_support (forwarded from TON Jobs)

— 2024-11-29 —

Anton: ⚡️ Added DeDust and STON.fi cookbooks to the documentation  Ever wondered how to build your own Decentralized EXchange? Neither have I!  However, documentation on how to interact with existing DEXes from Tact was highly requested — and, with the help of community contributors, we wrote it. Read how to swap Toncoins for Jettons, Jettons for Jettons, and provide liquidity to pools of DeDust and STON.fi, all with ⚡️ Tact.  🧑‍🍳🎉 Community contributors: PixelPlex and Aliaksandr Bahdanau 🐙 Implementations: #954, #956 ✈️ Delivered: DeDust, STON.fi  🍲 decentralized surprise liquidity provision ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Alex: I have a buch of fields in my contract. I want use them to provide TEP64 onchain metadata for my NFT collection. How I can construct and seriliaze collection_content to met TEP64 requirements? Data seriliazation paragraph is not very clear for me.

Anton: @B4ckSl4sh would you be able to provide some pointers here? (reply to 45506)

Mehran: Hello everyone, is there any sample code or guide to get info from Oracle in TACT?

/B4ckSl4sh\: https://github.com/tact-lang/jetton/blob/main/sources/utils/jetton-helpers.ts#L18  Here you can find an example of building onchain meta. (It's for Jetton, but obly difference from NFT is that there is some other fields in dictionary, as described here https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#nft-metadata-attributes) (reply to 45506)

Семен: you can use func native storeDict for your contract fields. I did something similar. But i am not sure that is good practice for building metadata onchain (reply to 45506)

Alex: yep, that works with small string values. with the bigger ones it doesnt’ meet TEP (reply to 45513)

Alex: Thanks, that is good starting point (reply to 45518)

Alex: export function makeSnakeCell(data: Buffer) {     // Create a cell that package the data     let chunks = bufferToChunks(data, CELL_MAX_SIZE_BYTES);      const b = chunks.reduceRight((curCell, chunk, index) => {         if (index === 0) {             curCell.storeInt(SNAKE_PREFIX, 8);         }         curCell.storeBuffer(chunk);         if (index > 0) {             const cell = curCell.endCell();             return beginCell().storeRef(cell);         } else {             return curCell;         }     }, beginCell());     return b.endCell(); }  is there any way to replicate same logic in tact?

/B4ckSl4sh\: It may be implemented, but it is not very easy. Maybe you consider implementing offchain meta? Or it is possible to send builded metadata fron backend? (reply to 45525)

Alex: Unfortunately I can’t store this metadata off chain. I think I’ll try to make snake cells on frontend and pass packed fields separately to contract

Mehran: Is there any way to get data from another blockchain contract for example from ETH contract from TACT?

مُهندس: How can I create a temporary wallet address, but when the coins arrive, they reach my main account?

Andrei: I guess you need a smart contracts mechanism that simply sends the full balance to another address.  However it sounds like a scam attempt… (reply to 45532)

مُهندس: No it's not a scam I just want when someone sends me coins let's say worth 50 give him a title 50 Only but the coins reach my main account (reply to 45533)

مُهندس: In short, a temporary address that only takes .50 and the balance is transferred to my main account automatically. (reply to 45534)

/B4ckSl4sh\: Yes, you need to use SendRemainingBalance sendmode (reply to 45532)

Andrei: Ok, you’d need to create a smart contracts mechanism that does what you described (reply to 45536)

A: Anyone tried this repo? https://github.com/Laisky/tact-utils/tree/main  After deploying to testnet,  jettons doesn't transfer from a wallet to another wallet (Always fails) The sender and receiver have enough $TON balance to cover network fees on their wallet

/B4ckSl4sh\: If you need Jettons you can try this repo https://github.com/tact-lang/jetton/tree/main  Feedback will be appreciated (reply to 45541)

A: The implementation is good bro. But make it txable (reply to 45544)

/B4ckSl4sh\: What do you mean by txable? (reply to 45546)

A: You can add a capability to tax users for minting and transferring Jettons. The repo I have mentioned above has this capability (reply to 45547)

/B4ckSl4sh\: I don't think this must be in default implementation)))) (reply to 45548)

Mehran: Anyone implemented Redstone in TACT? Trying to get live prices On-Chain from Redstone Oracle contract

DIAMOND_00000: hi, bro I can help you what you want. (reply to 45551)

DIAMOND_00000: I've already implemented it.

DIAMOND_00000: Can you send me dm?

bc1p: Hi ~ dose anyone know this issue #stonfi #tact   I try use tact to swap jettons with stonfi  and a exit code 8 thrown, when I try to fill the body  I know error8 means a Cell be stored more than 1023 bits But the .bits() result shows that the data is only 579 bits

— 2024-11-30 —

Anton: did you check our new page on how to communicate with ston.fi? https://docs.tact-lang.org/cookbook/dexes/stonfi/ (reply to 45575)

cubby: Hi.  Are you looking for a developer right now? I am available to discuss any project.

blocksdev: let me copy this post please. (reply to 45585)

blocksdev: Hi.  Are you looking for a developer right now? I am available to discuss any project.

undefined: How can I integrate payment acceptance into my bot? With TON of course

blocksdev: its very simple (reply to 45591)

Тюлень("⁧ (": in telegram bots u can only accept payment with telegram stars (reply to 45591)

blocksdev: you can hire or ask me to implemant this. (reply to 45591)

undefined: Haha 😂 (reply to 45595)

blocksdev: is it funny :) (reply to 45597)

undefined: How did other bots implement this? )) xRocket (reply to 45594)

Тюлень("⁧ (": https://core.telegram.org/bots/payments-stars#q-can-i-accept-payment-in-cryptocurrency-instead-of-telegram-sta (reply to 45599)

undefined: I know this one, I need to accept payments on TON (reply to 45600)

blocksdev: just generate an address and ask the user to pay (reply to 45602)

Тюлень("⁧ (": ton isnt a cryptocurrency?) (reply to 45602)

blocksdev: it is a cryptocurrency. (reply to 45604)

Wellcards support | virtual cards: You write that you can’t work on accepting payments if it’s another cryptocurrency. And how do others work, accept usdt?

Тюлень("⁧ (": so u cant use it as a payment in ur bot (reply to 45605)

blocksdev: Dude you dont know about TON payments ? (reply to 45607)

Wellcards support | virtual cards: Where is the Api description about accepting payments through stars or ton?

blocksdev: You can use it, its just you dont know about it. (reply to 45607)

Manifreebird: Is it? Seems like this is wrong info. You can make payments with Wallet in the Mini app (reply to 45594)

Тюлень("⁧ (": bro i sent u link to the official telegram docs and there is no info about ton (reply to 45608)

Тюлень("⁧ (": in order to comply with the guidelines of the App Store and Play Store (reply to 45612)

undefined: Yes (reply to 45604)

blocksdev: Dude stop, its possible and very easy to implement. if you dont know about something that doesn't mean thats not possible! (reply to 45612)

blocksdev: Dont spread the wrong info.

Тюлень("⁧ (": but what will u do when ur bot gets banned because u accepted cryptocurrency payments?) (reply to 45615)

Тюлень("⁧ (": its info from official telegram docs, lol (reply to 45616)

blocksdev: https://docs.ton.org/v3/guidelines/dapps/asset-processing/payments-processing#toncoin-deposits-get-toncoins (reply to 45602)

Тюлень("⁧ (": its not official telegram bot api docs so its not proof. good luck when ur bot gets banned (reply to 45621)

/B4ckSl4sh\: https://github.com/gobicycle/bicycle

/B4ckSl4sh\: Use this (but be aware of Highload v2 limitations) (reply to 45602)

bc1p: Thx for your answer. When I try to send a swap message to router... a action code: 40 thrown my code is almost same with the cook book (reply to 45582)

bc1p: https://testnet.tonviewer.com/transaction/58042979226d65b52f6c4684b338ac1fd40262d5f35e4c827889728ad432f371

bc1p: It seems the cell body is too big?

/B4ckSl4sh\: Not enough funds to process the message. This error is thrown when there is only enough gas to partially cover the message, but not enough to cover it completely. (reply to 45628)

bc1p: thx, I will try again.

Илья: Hi all, can you please tell me what are the most popular vulnerabilities in TON smart contracts and how to protect against them? For example, I know about Reentrancy Attack

Georgiy: These are mentioned in the Tact documentation.  Additionally, you can review what Misti is currently capable of detecting: https://nowarp.io/tools/misti/docs/next/detectors#built-in-detectors. This includes some optimization and code style detectors, though. (reply to 45634)

Илья: Thank you ❤️

Anton: please check out https://docs.tact-lang.org/book/security-best-practices/ (reply to 45634)

Anton: re-entrancy attack is not possible on TON, but there it’s second cousin — message-in-the-middle attack (reply to 45634)

Anton: it can happen for instance when your contract is expecting a reply from some contract and can be vulnerable to an unexpected malicious message that can get in the middle and exploit the vulnerability

undefined: Thank you 😊 (reply to 45627)

Alex: I’m wondering if there are any common patterns for contracts evolution/upgradability? I suppose quite a lot of changes in my contracts after MVP. How to deal with that? I came up with idea of proxy contract which will point to latest deployed main smart contract version. Are there any other options?

Anton: It will be supported in Tact natively, see this issue: https://github.com/tact-lang/tact/issues/27. Hopefully in the next release in December. Although, some advanced users described/linked workarounds in the issue (reply to 45643)

Guy: Regarding Replay attacks - so every message pretty much needs to have a uniqueId (like queryId in JettonTransfer)?

Guy: And in the contract I would need to save a map of all processedQueryIds?  Is there any other solution?

Anton: Not necessarily, it depends on your protocol (reply to 45651)

Anton: If you really need it, then a counter would suffice (reply to 45652)

Guy: In functions that change important state / send= Jetton/TON or accepr paymnts

Guy: Thanks for the reply, but then I would need to run a 'getCounter' before every call? Concurrency wise also a single counter can be problematic (reply to 45654)

Anton: It’s case-by-case, hard to say in advance. But you don’t usually need this. It’s just you might need it for some cases (reply to 45657)

Guy: OK thanks :).  I wonder why Ton does not take care of that with a nonce in a every message similar to Ethereum

— 2024-12-01 —

Sol: Hi, is there anyone who speaks Russian and is good at tact for an hour-long call to work together on one of the Projects? I need a strong mentor, in tact, so that I can gain a little understanding, write me a PM, I am ready to pay for an hour of your time if you help m

Sirk: i have one person that speak russian please DM

pid | ton: thank you Cai, that's a good article. (reply to 43957)

Илья: Hi all, can you please advise me how to send Jettons from SC. For example, I have a SC that needs to receive Jetton and then when receiving a message send them to other wallets. How can I use the send method to do this?

Anton: https://docs.tact-lang.org/cookbook/jettons/ (reply to 45685)

Rus: Can I use getters as internal functions i.e. Can I call a getter within the receive for example?

Rus: let sender = sender(); let senderSlice = sender.asSlice(); dump(senderSlice.bits()); // 267 for me  I want to convert Account ID of Address of the user to Slice as bytes32.  Is it safe to assume that I can take last 256-bits from that slice?   let address: Slice = sender().asSlice(); address.skipBits(address.bits() - 256); // get only account ID  dump(address.bits()); // 256

/B4ckSl4sh\: It's safe to assume it, but why don't you use ParseStdAddress? (reply to 45691)

Rus: Oh, that's nice, haven't noticed. Thank you (reply to 45692)

Илья: How can I get jetton wallet code? (reply to 45686)

/B4ckSl4sh\: Onchain / offchain? (reply to 45694)

Илья: Onchain

/B4ckSl4sh\: If you aren't a JettonWallet / JettonMaster itself there is no way (reply to 45696)

/B4ckSl4sh\: Why do you need such value?

Илья: . (reply to 45685)

Илья: . (reply to 45686)

Илья: In this guide for jetton wallet address need code (reply to 45700)

/B4ckSl4sh\: You need to store the JettonWallet address (reply to 45685)

Илья: Thank you. How can I do that after I'm done with my contract? There's a JettonWallet address for it somewhere anyway

Илья: For minting I use TonMinter

/B4ckSl4sh\: Well, you can deliver this address from offchain. Or, in some cases, you can assume that contract, that is sending JettonNotify to you is your jetton wallet (reply to 45703)

Rus: Are there examples of Jetton smart contracts on Tact?

/B4ckSl4sh\: https://tact-by-example.org/00-hello-world (reply to 45712)

Bohdan: itemCost: Int as coins;      init() {         itemCost = ton("1");     }      fun setPrice(newPrice: String) {       self.itemCost= ton(newPrice);     }  is it possible to set the variable like this? it throws me an error: Cannot evaluate expression to a constant: cannot evaluate a variable

Anton: Nope, ton() is a compile-time function (reply to 45717)

Mehran: Hello everyone,  Which one is cheaper (in gas fee):  1) saving a record containing struct in a map   2) Sending a message to another contract to retrieve data  I'm writing a contract in TACT, wondering which is a better approach

/B4ckSl4sh\: Depends on the size of a map (if quite big, second approach is better) (reply to 45724)

— 2024-12-02 —

Mehran: I went trough all doc's but can't find any source to determine the Gas fee of sending message between contracts, is there any source? Is there any way to know it? (reply to 45725)

/B4ckSl4sh\: Best way is to determine this value through sandbox tests. The way to determine fwd_fee exists, but i don't think you need this value in nanotons precision (reply to 45744)

mnemotiv: does sandbox reflect mainnet? (reply to 45745)

mnemotiv: I mean in fees

/B4ckSl4sh\: And testnet also (reply to 45746)

/B4ckSl4sh\: Yes (reply to 45747)

mnemotiv: nice, same fees across all network modes, so it's very predictable, I needed it for nft minting

mnemotiv: off topic: I'm new to tact, and I'm missing up-to-date NFT subdomains example in tact... I hope someone will commit it, because your git examples are not finished... (reply to 45749)

mnemotiv: regarding ton DNS...

mnemotiv: just because almost nobody is using stdlib/dns (according to GitHub search)

/B4ckSl4sh\: Okay, will add this article (reply to 45751)

Guy: Hey, can I use the built in Resumable trait? or is it prone to such a replay attack? e.g. if a 'stop' my contract then 'resume' it - an attacker can replay the 'stop' command again? (reply to 45658)

Rus: https://tact-by-example.org/07-jetton-standard  Why isn't it in @stdlib? Are there plans to add standard Jetton trait there? I would trust it more. (reply to 45713)

/B4ckSl4sh\: Because we are already working on official jetton implementation. Draft can be found at github.com/tact-lang/jetton (reply to 45765)

Rus: That's nice. Thank you for sharing. Will it stay as a separate project? (reply to 45769)

/B4ckSl4sh\: Maybe it will be merged in main repo. But now we need to ensure that everything is identical to official implementation (reply to 45771)

/B4ckSl4sh\: *including gas consumption (reply to 45772)

XD Support: Why my message about sign was deleted?

Я̨kov: Sorry, that might have been a mistake made by some admin. In any case, this chat is in English only, so please retype your question in English :) (reply to 45781)

XD Support: Hi all. From a security point of view, is it necessary to sign messages between contracts, or is it enough to check owner and seqno? (reply to 45783)

/B4ckSl4sh\: It internal messages you can always trust sender() - it will return Address of an actual sender in 100% cases (reply to 45785)

XD Support: Big thanks (reply to 45786)

Anton: Definitely not a mistake, this is an English-speaking chat (reply to 45783)

XD Support: Ok (reply to 45788)

Palas: Hello everyone, please tell me how to find out your tag/memo in a telegram?

/B4ckSl4sh\: You don't have tag/memo in your @wallet and of course there are no tag/memo when you are using Tonkeeper/Mytonwallet/Tonhub etc (reply to 45795)

— 2024-12-03 —

kira: morning everyone i write a contract for owner to withdraw USDT in Tact like below  receive(msg: WithdrawUSDT){         self.requireOwner();         require(msg.amount > 0, "Invalid amount");         require(myBalance() > MinTonForStorage, "Contract's balance is smaller than 0.1 TON");         send(SendParameters{                 to: self.myJettonWalletAddress,                 value: JettonTransferGas,                 body: JettonTransfer{                     queryId: now(),                     amount: msg.amount,                     destination: sender(),                     responseDestination: sender(),                     customPayload: null,                     forwardTonAmount: 1,                     forwardPayload: rawSlice("F")                 }.toCell()             }         );     } but when i run the function to withdraw import { Address, toNano } from '@ton/core'; import { NetworkProvider } from '@ton/blueprint'; import { PawsPurchase } from '../wrappers/PawsPurchase'; import { CONTRACT_ADDRESS } from '../constant';  export async function run(provider: NetworkProvider) {     const pawsPurchase = provider.open(PawsPurchase.fromAddress(Address.parse(CONTRACT_ADDRESS)));      await pawsPurchase.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'WithdrawUSDT',             amount: toNano("0.001"),         },     ); } i got the exitcode 49 when jettonWallet of contract want to "Jetton Internal Transfer" to jettonWallet of owner For ex: https://tonviewer.com/transaction/54367d797b41dcdc49ce879f2b72299d033cc8eaf6949b00ab731e8dabd259b9 could you help me explain why i got that exit code and fault? 🥺

kalix: hello. can i use testnet with telegram wallet?

Bad: Yes (reply to 45814)

Anton: ⚡️ Completely overhauled exit codes page in the documentation  Sometimes pages in the Tact documentation are more detailed than you'll find elsewhere. The exit codes page is a case in point.  Not only do you get a comprehensive description of what exit codes are, how they are defined, and which ones are reserved, but you also get a handy table of them with short descriptions and quick navigation to each exit code in the table of contents. Since each of the exit codes has its own headings, linking to a specific exit code is easier than ever!  In addition, all descriptions of compute phase exit codes show examples of how you might encounter them. And sometimes even help you to anticipate and avoid them.  By the way, for exit code 50 (not listed anywhere else), we've also described the current limits on config param 43 related to account state, max number of bits and cells in messages, and much more.  🧑‍🍳 Contributor: Novus Nota 🐙 Implementation: #978 ✈️ Delivered: docs.tact-lang.org/book/exit-codes  🍲 code: dismissed ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Sapperava: Read the docs, there is explanation of array, which includes answer on your question (reply to 45825)

Bohdan: could you help me? Why does  get fun balance(): Int {         return myBalance();      } return me 0 when I call it in my tests? I'm trying to get the amount of ton in the contract

/B4ckSl4sh\: Use getContractBalance function from ton/sandbox. myBalance() function works only when receiving internal messages (reply to 45846)

Bohdan: could you give me the link to documentation because I can't find it (reply to 45847)

/B4ckSl4sh\: Now I cannot do that. It was blockchain method as far as I remember (or ContractProvider) (reply to 45848)

Илья: Someone please help, using this repository: https://github.com/ton-blockchain/minter-contract to get jetton wallet address. I don't know func at all, how do i do it? : (

/B4ckSl4sh\: What do you mean by you need jetton_wallet adddress? (reply to 45852)

Илья: ) (reply to 45705)

/B4ckSl4sh\: Call get_wallet_address get method on deployed jetton master (reply to 45854)

Илья: I also have the same problem, why after the build I do not have in the wrapper is only createFromAddress, createFromConfig and sendDeploy, and writes that the build was successful

Илья: and i can use this contract code to get jetton wallet code to generate jetton wallet from func contract?

Blockchain: Hello. How do we call a function of a contract address in tact? We use interfaces in solidity. How does this happen in tact?

Я̨kov: Off-chain? By calling getter functions On-chain? Only by sending messages, contracts cannot call getters of each other (reply to 45864)

Blockchain: I want to call a deployed contract with the contract address. (reply to 45866)

......: anybody knows why the valueIn is less than valueOut + totalFees when I use the carry remaning mode to send a sub-transaction

......: just like this

Blockchain: mapping(address => uint256[]) public userTicketNumbers;    i created the code above in Solidity. How do i convert it to tact?

— 2024-12-04 —

Anton: ⚡️ GitHub supports Tact!  Now that you've clicked, let me clarify — thanks to our efforts, your support and all of you writing lots of smart contracts, Tact now has syntax highlighting all across GitHub!  — Files with a .tact extension? Boom, colored. — Blocks of code in markdown that specify tact as their language? Got you covered.  ❤️ Thanks everyone for your support and love! Without you, there would be nothing. Literally.  ✈️ We're continuing to ship awesome stuff for you — expect many shiny things this December.  🍲 growth is inevitable ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Anton: it depends on the size of your map, check out tact-by-example.org and docs.tact-lang.org (reply to 45899)

Anton: In addition to the Tact community, kudos go to @novusnota42 whose hard work on the Tree-sitter grammar made GitHub support for Tact possible (reply to 45913)

Bohdan: do I understand it correct, if I set value: 0 in the message then tons and fees will be paid by the person who sent the message?  SendParameters{                 to: contractAddress(init),                 value: 0,                  mode: SendIgnoreErrors + SendRemainingValue,                 code: init.code,                  data: init.data             }  but if I set value: ton("1") then this 1 ton will be sent from the contract balance and not from the person wallet who call this message?

Anton: you need the as bytes64 annotation  message ExtMsg {     signature: Slice as bytes64; … } (reply to 45928)

Rus: https://docs.tact-lang.org/cookbook/jettons/#sending-jetton-transfer                 // Compile-time way of expressing:                 //     beginCell().storeUint(0xF, 4).endCell().beginParse()                 // For more complicated transfers, adjust accordingly                 forwardPayload: rawSlice("F") What is forwardPayload? Is it some additional payload sent as a notification to a destination?

Rus: Is there something like approve for jettons?  I have a DEX contract.  A user interacts with that contract.   During that interaction I would like to transfer user's jettons (from user's jetton wallet) to the escrow (to the jetton wallet of my DEX contract). Suppose I know jetton master's address.

Rus: I see one possible solution now:  1. user transfers to the DEX's jetton wallet directly interacting with its jetton wallet (TokenTransfer) forwarding some payload and possibly ton amount  2. DEX's jetton wallet accepts TokenInternalTransfer and sends a TokenNotification with a forward payload and/or ton amount to the DEX contract itself  3. DEX contract accepts TokenNotification and processes according to the parsed payload...   Is it correct? (reply to 45938)

Anton: @B4ckSl4sh please take a look when you have time (reply to 45939)

/B4ckSl4sh\: Yes, that is correct approach. Jettons on TON do not support explicit approval and the only contract that can transfer them is their owner. (reply to 45939)

/B4ckSl4sh\: Yes. That is the data that will come with JettonNotify (reply to 45936)

/B4ckSl4sh\: Best approach of interacting with Jettons can be seen here https://docs.dedust.io/recipes . User transfer jettons to a Vault and then Jettons are processed without actually sending them (reply to 45938)

Rus: I wonder what happens if my DEX's contract reverts when reciving TokenTransferNotification.   The message bounces back? (reply to 45944)

Rus: In this case this would mean that the Vault reverts. (reply to 45944)

/B4ckSl4sh\: No. JettonNotify in unbounceable and user will lose the tokens. But nevermind, it's only his responsibility to attach enough tons (If the user builds message manually). If you are building a message for him and sending it using TonConnect, you should correctly estimate fee, and return excesses. (reply to 45948)

Rus: got you, thanks (reply to 45950)

Blockchain: send(SendParameters{                 to: _ticketContract,                 value: ton("0.01"),                 mode: SendIgnoreErrors,                   body: BuyticketMes{buyer: sender(), isRef: false}.toCell(),             });  In the code above, I am calling a contract address. I am trying to access the receive function called "BuyticketMes{buyer: sender(), isRef: false}" in the contract. How can I access the returned value? or is this method correct?

/B4ckSl4sh\: receivers do not return a value. A contract may send a message in receiver but it is not obligatory. Ton is not Eth and here contracts work differently (reply to 45958)

Blockchain: How to return value? Is there a method? (reply to 45967)

/B4ckSl4sh\: No. Receivers do not return a value (reply to 45968)

Blockchain: How do I read data from another contract? Is there a way to do this? (reply to 45969)

Bohdan: Messages (reply to 45971)

Blockchain: Yes. But the function I read returns an Int value. How do I get that Int value? (reply to 45972)

/B4ckSl4sh\: You cannot call get functions of other contracts onchain (reply to 45973)

sajad: hi I made a staking contract, can I check balance of address of jetton using internal functions of staking?

/B4ckSl4sh\: If I understand your question right, no, you cannot check jetton/ton balance of other contract onchain (reply to 45975)

Blockchain: I want to call “receive”. Is this possible? (reply to 45974)

Bohdan: here is an example https://tact-by-example.org/03-messages-between-contracts (reply to 45977)

/B4ckSl4sh\: You can send a message, that will be processed by this receiver (reply to 45977)

sajad: yes (reply to 45976)

sajad: how can I check it?😶

sajad: I want to check with get functions

sajad: can I?

Я̨kov: If said contract has such get functions, then you can call them off-chain and get any data they provide (reply to 45982)

sajad: So, impossible, right? (reply to 45984)

sajad: I mean on-chain

Я̨kov: Then — yeah. However, when implementing your contracts you can send replies to any messages received, thus "checking the balance of the contract" by sending the balance as a reply (reply to 45985)

sajad: 👍ok  thanks a lot

......: What's the carrying remaining mode meaning here? I noticed that part of the gas fee in A contract will be charged in A balance?

......: From my initial understanding, the gas fee must be paid by the incoming message value?

......: so werid here😫

......: @novusnota42 do you know why? thanks (reply to 45990)

— 2024-12-05 —

A: Hi guys. Is there any USDT Tether faucets available on testnet? I want to interact with it in my contract. How to get some free USDT on my testnet address?

A: I can use a DEX like stonfI to get my required token but it seems that Stonfi is not available on testnet. (reply to 46001)

Ali: How can I query the get function of a smart contract that is already deployed and whose source code I have, from another contract?

Anton: There is no way. This is just how TON blockchain works (reply to 46004)

Ali: https://docs.tact-lang.org/cookbook/multi-communication/

Ali: i think sending message are exist but get function is not right? (reply to 46005)

Anton: Yep, only through sending and receiving messages you can get any info onchain

Rus: https://docs.tact-lang.org/cookbook/jettons/#accepting-jetton-transfer  Why doesn't jetton wallet contain a receive("get_wallet_data"). This way we would be able to check the sender by extracting the code and master from the received wallet data. Of course we must trust the jetton.  I want to accept (in theory) any jetton transfers to the Vault but I must check the sender of the JettonTransferNotification is the Vault's jetton wallet every time. I don't really want to have a whitelist of supported jettons.

/B4ckSl4sh\: Unfortunately that is how jettons work (reply to 46013)

Gosha: Hello! I am working on writing an NFT Collection smart contract with on-chain generation of individual content. I tried to rewrite this TypeScript code for building on-chain content: export function toSha256(s: string): bigint {     return BigInt('0x' + sha256_sync(s).toString('hex')) }  export function toTextCell(s: string): Cell {     return beginCell().storeUint(0, 8).storeStringTail(s).endCell() }  export type collectionContent = {     name: string,     description: string,     image: string }  export function buildCollectionContentCell(content: collectionContent): Cell {     const collectionContentDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())         .set(toSha256("name"), toTextCell(content.name))         .set(toSha256("description"), toTextCell(content.description))         .set(toSha256("image"), toTextCell(content.image));          return beginCell()              .storeUint(0,8)             .storeDict(collectionContentDict)             .endCell();  } into something like this on Tact:     fun toTextCell(text: String): Cell {         return beginCell().storeSlice(text.asSlice()).endCell();     }      fun buildCollectionContentCell(content: CollectionContent): Cell {         let collectionContentDict: map<Int, Cell> = emptyMap();         collectionContentDict.set(sha256("name"), self.toTextCell(content.name));         collectionContentDict.set(sha256("description"), self.toTextCell(content.description));         collectionContentDict.set(sha256("image"), self.toTextCell(content.image));          return beginCell()             .storeUint(0, 8)             .storeRef(collectionContentDict.asCell()!!)              .endCell();     } However, it’s not working as expected—the metadata of the NFT items is coming out empty.  Could you please help me with this?

مُهندس: What is the solution (reply to 46020)

مُهندس: ؟

/B4ckSl4sh\: You are not storing prefix in toTestCell and also you store Slice (so just one cell) not string tail. (reply to 46015)

Gosha: How to store string tail in tact? Builder has no such method( (reply to 46023)

/B4ckSl4sh\: You should write that method manually (reply to 46024)

مُهندس: @B4ckSl4sh (reply to 46020)

/B4ckSl4sh\: This screen does not explain anything). Only thing I can say - why do you provide null as a parameter in send method? What exactly do you want to send? Just Toncoins? What is the purpose of this test? (reply to 46032)

مُهندس: This test is for receiving coins (reply to 46033)

/B4ckSl4sh\: Well, ton blockchain itself will take care of it) (reply to 46034)

مُهندس: This is the code

/B4ckSl4sh\: Sorry for my incorrect answer. You can utilize stringBuilder. It has a support of building tail strings (reply to 46024)

Gosha: You mean something like this?     fun toTextCell(text: String): Cell {         let sb: StringBuilder = beginTailString();         sb.append(text);         let textCell: Cell = sb.toCell();         return beginCell().storeUint(0, 8).storeRef(textCell).endCell();     }  (metadata still empty 😭) (reply to 46041)

/B4ckSl4sh\: TailString already prefixed with null byte and do don't need to store that in ref (reply to 46045)

/B4ckSl4sh\: Did you make it? (reply to 46045)

Gosha: I tried this, without storeUint(0,8):     fun toTextCell(text: String): Cell {         let sb: StringBuilder = beginTailString();         sb.append(text);         let textCell: Cell = sb.toCell();         return beginCell().storeRef(textCell).endCell();     } but nothing changed (reply to 46047)

/B4ckSl4sh\: Why don't you do return sb.toCell() ? You get an extra ref now (reply to 46049)

Gosha:     fun toTextCell(text: String): Cell {         let sb: StringBuilder = beginTailString();         sb.append(text);         return sb.toCell();     }  still empty metadata( (reply to 46050)

/B4ckSl4sh\: Can you, please share more code and link to your token. I will check it (reply to 46051)

Gosha: import "./nft_message.tact"; const minTonsForStorage: Int = ton("0.02"); const gasConsumption: Int = ton("0.02");  contract NftCollection {     next_item_index: Int as uint32 = 0;     owner_address: Address;     royalty_params: RoyaltyParams?;                           collection_content: Cell;         init(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams){         self.owner_address = owner_address;         self.collection_content = collection_content;          self.royalty_params = royalty_params;     }      receive("Mint"){         let ctx: Context = context(); // get sender Info         let msgValue: Int = ctx.value;         let tonBalanceBeforeMsg: Int = myBalance() - msgValue;         let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);         msgValue = msgValue - (storageFee + gasConsumption);         require(self.next_item_index >= 0, "non-sequential NFTs");         let nft_init: StateInit = self.getNftItemInit(self.next_item_index);          let content = CollectionContent{             name: "Example content",             description: "Example description",             image: "https://ipfs.io/ipfs/QmSgP7ENtDe6xY6DZUz73ydeYmoopJYu3BywZJPSJ338zT"         };         let individual_content: Cell = self.buildCollectionContentCell(content);          send(SendParameters{                 to: contractAddress(nft_init),                  value: msgValue,                  bounce: false,                 mode: SendIgnoreErrors,                 body: Transfer {                     query_id: 0,                     new_owner: ctx.sender,                     response_destination: self.owner_address,                     custom_payload: individual_content,                     forward_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: nft_init.code,                 data: nft_init.data             });         // dump(self.next_item_index); // Reference at: https://tact-by-example.org/03-emit         self.next_item_index = self.next_item_index + 1;          emit(LogEventMintRecord{ minter: sender(), item_id: self.next_item_index, generate_number: nativeRandom() }.toCell());     }      fun toTextCell(text: String): Cell {         let sb: StringBuilder = beginTailString();         sb.append(text);         return sb.toCell();     }      fun buildCollectionContentCell(content: CollectionContent): Cell {         let collectionContentDict: map<Int, Cell> = emptyMap();         collectionContentDict.set(sha256("name"), self.toTextCell(content.name));         collectionContentDict.set(sha256("description"), self.toTextCell(content.description));         collectionContentDict.set(sha256("image"), self.toTextCell(content.image));          return beginCell()             .storeUint(0, 8)             .storeRef(collectionContentDict.asCell()!!)              .endCell();     }       receive(msg: GetRoyaltyParams) {            let ctx: Context = context(); // get sender Info         send(SendParameters{             to: ctx.sender,             value: 0,             mode: 64,              bounce: false,             body: ReportRoyaltyParams {                 query_id: msg.query_id,                 numerator:  (self.royalty_params!!).numerator,                 denominator: (self.royalty_params!!).denominator,                 destination: self.owner_address             }.toCell()         });             }      // ------------------ Get Function  ------------------ //     get fun get_collection_data(): CollectionData {               return CollectionData{             next_item_index: self.next_item_index,              collection_content: self.collection_content,              owner_address: self.owner_address         };     }      get fun get_nft_address_by_index(item_index: Int): Address?{               let initCode: StateInit = self.getNftItemInit(item_index);         return contractAddress(initCode);     } (reply to 46052)

Gosha:       get fun getNftItemInit(item_index: Int): StateInit {         return initOf NftItem(myAddress(), item_index);     }          get fun get_nft_content(index: Int, individual_content: Cell): Cell {          return individual_content;     }      get fun royalty_params(): RoyaltyParams {         return self.royalty_params!!;     } }  contract NftItem {     collection_address: Address;     item_index: Int;      is_initialized: Bool;      owner: Address?;     individual_content: Cell?;      init(collection_address: Address, item_index: Int) {         require(sender() == collection_address, "not from collection");         self.collection_address = collection_address;         self.item_index = item_index;         self.is_initialized = false;     }      receive(msg: Transfer){         let ctx: Context = context(); // Reference: https://docs.tact-lang.org/language/ref/common#context         let msgValue: Int = self.msgValue(ctx.value);                  if (self.is_initialized == false) {  // Initial Transfer, aka the "Minting" of the NFT             require(ctx.sender == self.collection_address, "initialized tx need from collection");             self.is_initialized = true;             self.owner = msg.new_owner;             self.individual_content = msg.custom_payload;             send(SendParameters{                 to: msg.response_destination!!,                 value: msgValue,                 mode: SendPayGasSeparately,                 body: Excesses { query_id: msg.query_id }.toCell()             });         } else {             require(ctx.sender == self.owner!!, "not owner");             self.owner = msg.new_owner;  // change current owner to the new_owner             if (msg.forward_amount > 0) {                 send(SendParameters{                     to: msg.new_owner,                     value: msg.forward_amount,                     mode:  SendPayGasSeparately,                      bounce: true,                     body: OwnershipAssigned{                         query_id: msg.query_id,                         prev_owner: ctx.sender,                         forward_payload: msg.forward_payload                     }.toCell()                 });              }              msgValue = msgValue - ctx.readForwardFee();              if (msg.response_destination != null) {                  send(SendParameters{                      to: msg.response_destination!!,                     value: msgValue - msg.forward_amount,                     mode: SendPayGasSeparately,                     bounce: true,                     body: Excesses { query_id: msg.query_id }.toCell()                 });             }          }     }          receive(msg: GetStaticData){          let ctx: Context = context();         send(SendParameters {             to: ctx.sender,             value: 0,             mode: 64,  // (return msg amount except gas fees)              bounce: true,             body: ReportStaticData{                 query_id: msg.query_id,                 index_id: self.item_index,                 collection: self.collection_address             }.toCell()         });     }      fun msgValue(value: Int): Int {         let tonBalanceBeforeMsg: Int = myBalance() - value;         let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);         return value - (storageFee + gasConsumption);     }      // --------- Get Function  --------- //     get fun get_nft_data(): GetNftData {         return GetNftData {             is_initialized: self.is_initialized,              index: self.item_index,              collection_address: self.collection_address,              owner_address: self.owner!!,             individual_content: self.individual_content!!         };     } }  collection address: EQDbuck42sgvQ4_6K-seyOK_MqLvdYN2WYDtf6vhoIrx3Ym1 (reply to 46052)

/B4ckSl4sh\: Maybe that is the issue with tonapi, because your metadata is perfectly visible here https://testnet.ton.cx/address/kQDbuck42sgvQ4_6K-seyOK_MqLvdYN2WYDtf6vhoIrx3TI_ (reply to 46054)

/B4ckSl4sh\: Actually, onchain meta is not very appreciated by tonapi and other indexers

Gosha: WOWWowowo thank you for your help!!! (reply to 46055)

/B4ckSl4sh\: And there is a discussion now, to change the standard, or to deprecate onchain meta (reply to 46056)

/B4ckSl4sh\: getgems is also now have thoubles with onchain meta

Gosha: good to know)

&rey: Please don't mistake full metadata and NFT "attributes". (reply to 46059)

/B4ckSl4sh\: Did I understand recent discussion in TON Dev incorrectly? Can you, please, clarify? I would appreciate it a lot (reply to 46062)

&rey: NFT attributes are text tags, commonly used by scammers in form of "verified: true", having no bearing on item's behavior. Attributes are used for rarity calculation. (reply to 46063)

/B4ckSl4sh\: And storing this arrtibutes onchain is very inconvenient? (reply to 46064)

&rey: Actually it's unstandartized yet but not that inconvenient. (reply to 46065)

/B4ckSl4sh\: Your collection meta is live on tonviewer btw (reply to 46054)

/B4ckSl4sh\: Okay, but onchain meta will remain? And it is fully supported? (reply to 46066)

Gosha: wait, actually i didnt check it properly, sorry. This is collection meta, but meta of nft is still not visible: https://testnet.ton.cx/address/EQDUTTlemTeVRkR-6AbCoG5t4DpntbgjhfZQzFrFHGc1Zz4V (reply to 46067)

A: Is any open source DEX available on TON written in Tact language?

/B4ckSl4sh\: Maybe next year will be) but for now I don't know such dex (reply to 46077)

Blockchain: refPercent : Int as uint256 = 5;  get fun getRefPercent(): Int {         return self.refPercent;  }  The contract has not been deployed yet or method not found.  Why not working this function?

Я̨kov: Before running tests, check that you've built your contracts first.  I usually do: yarn blueprint build --all >/dev/null 2>&1 && yarn jest. Adjust for your package manager and OS: https://docs.tact-lang.org/book/debug/#lab-4 (reply to 46088)

Blockchain: i using https://ide.ton.org/ (reply to 46089)

Я̨kov: Did you save the changes & re-run the build-deploy loop? (reply to 46090)

Blockchain: yes (reply to 46091)

Blockchain: receive("deposit") {  }  I want to define a "payable" structure above. Let's imagine we sent 2 TONS here. I want the transaction to be invalid below 2 tons. how do i do it?

/B4ckSl4sh\: Tons themselves are not a part of message. So you can just do require(context().value > ton("2"), "Insufficient amount of TONs attached") (reply to 46098)

Blockchain: thanks (reply to 46100)

— 2024-12-06 —

Alex: 📣 Hey, folks! The Tact dev team kindly asks you to share some feedback regarding your experience with smart-contract programming in Tact.  Our mission is to develop a high quality programming language that can be used for every single project on TON and make code easy to write, understand and audit.  The survey covers 4 topics and will only take about 5-8 minutes of your time.   Thank you for your contribution!  👉https://paperform.co/edit/h02jnxtq (forwarded from TON Dev News)

Tea the Bottle: hello, Im using howard's Jetton template, I can send mint mess to master address and received return token, but on confirm scene of wallet, there is no offer back user will received Y Jetton line. How can I display this on confirm scene  ?

Gosha: @B4ckSl4sh  Hello, sorry for tag( We had discussion yesterday. Can you advice please what should I do, to make onchaun metadata of nft item visible? (reply to 46069)

/B4ckSl4sh\: For now I don't see an issue with your code. But will check it (reply to 46116)

/B4ckSl4sh\: Looks like you have some extra zero byte   b'\x00'   b'@'    b'\xbf\xf0\x82\xebf;W\xa0\x01\x92\xf4\xa6\xacFr\x88\xdf-\xfe\xdd\xb9\xda\x1b\xee(\xf6R\x1c\x8b\xeb\xd2\x1f\x1e\x80'     b'\x00https://ipfs.io/ipfs/QmSgP7ENtDe6xY6DZUz73ydeYmoopJYu3BywZJPSJ338zT'    b'\x00' <-- Here     b'\xbf\x82\xa3S\x7f\xf0\xdb\xce~\xec5\xd6\x9e\xdc:\x18\x9e\xe6\xf1}\x82\xf3S\xa5S\xf9\xaa\x96\xcb\x0b\xe3\xce\x89'      b'\x00Example content'     b'\xbf\x89\x04oz7\xad\x0e\xa7\xce\xe73U\x98O\xa5B\x89\x82\xf8\xb3|\x8f{\xce\xc9\x1fz\xc7\x1a|\xd1\x04'      b'\x00Example description' (reply to 46053)

/B4ckSl4sh\: But I don't really understand why

Gosha: how can I get this data? (reply to 46122)

/B4ckSl4sh\: def printCell(cell: Cell, indent = 0):     print(" " * indent, cell.bits.tobytes())     for ref in cell.refs:         printCell(ref, indent + 1)  async def main():     metaCell = Cell.one_from_boc("b5ee9c720101090100e9000102000102014802030143bff082eb663b57a00192f4a6ac467288df2dfeddb9da1bee28f6521c8bebd21f1ec004020120050600880068747470733a2f2f697066732e696f2f697066732f516d53675037454e74446536785936445a557a3733796465596d6f6f704a5975334279775a4a50534a3333387a540142bf82a3537ff0dbce7eec35d69edc3a189ee6f17d82f353a553f9aa96cb0be3ce89070142bf89046f7a37ad0ea7cee73355984fa5428982f8b37c8f7bcec91f7ac71a7cd104080020004578616d706c6520636f6e74656e740028004578616d706c65206465736372697074696f6e")     printCell(metaCell) (reply to 46124)

/B4ckSl4sh\: I doublechecked your meta. And here is the difference from meta that should be valid. (reply to 46124)

/B4ckSl4sh\: That null byte is valid. Here is the only difference in your meta to TypeScript generated (reply to 46127)

/B4ckSl4sh\: That must be not .storeRef (reply to 46053)

/B4ckSl4sh\: That must be storeMaybeRef (or store dict)

Blockchain: stagePrice: map<Int, Int>;  init() {                  self.owner = sender();         self.Prices();     }      get fun getTicketPrice(TicketStage: Int): Int {         return self.stagePrice.get(TicketStage)!!;     }  fun Prices(){         let a: Int = 0;                  repeat (18) {             if (a >= 1 && a <= 6) {                 self.stagePrice.set(a, ton("0.3"));             } else if (a >= 7 && a <= 12) {                 self.stagePrice.set(a, ton("1.47"));             } else if (a >= 13 && a <= 18) {                 self.stagePrice.set(a, ton("10.47"));             }              a = a + 1;         }     }  What is the problem??   Unsupported stack item type: undefined

Cyril M |: anyone here who have experience creating nft with tact?

Cyril M |: @here

Cyril M |: can we make the content_url of the nftitem as an api with json response?

Olumo: I have experience with that (reply to 46133)

/B4ckSl4sh\: I fixed your metadata. You should initialize your map like this.  let collectionContentDict: map<Int as uint256, Cell> = emptyMap(); (And, as said above, use storeMaybeRef, or StoreDict, or storeBit(true) and then storeRef) (reply to 46054)

/B4ckSl4sh\: Try it out please, should work perfectly) (reply to 46054)

Gosha: I'll try in few hours Thank you very much!! (reply to 46149)

Manifreebird: if you guys made mod, I will take care of Spam

ㅤㅤㅤㅤㅤ: + (reply to 46160)

EDITOR FRED: Please any idea how I can fix this in a bot receiving stars??

Gosha: It works!!! Huge thanks❤️❤️❤️ (reply to 46149)

— 2024-12-07 —

Илья: what does error code 20020 mean when performing a transaction?

/B4ckSl4sh\: Ckeck in output folder *your_contract_name*.md (reply to 46189)

Blockchain: import "@stdlib/deploy";  contract BlankContract with Deployable {      stagePrice: map<Int, Int>;      init() {         self.Prices();     }       get fun priceValue(a: Int) : Int? {         return self.stagePrice.get(a);     }      get fun priceDatas() : map<Int, Int> {         return self.stagePrice;     }       fun Prices(){         let a: Int = 0;                  repeat (18) {             if (a >= 1 && a <= 6) {                 self.stagePrice.set(a, ton("0.3"));             } else if (a >= 7 && a <= 12) {                 self.stagePrice.set(a, ton("1.47"));             } else if (a >= 13 && a <= 18) {                 self.stagePrice.set(a, ton("10.47"));             }              a = a + 1;         }     } }   priceDatas() output :  [   {     "type": "base64",     "value": "te6cckEBEgEA0wACA8/IARACASACCQIBIAMFAgEgBAYAQVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjw0YBAIBIAYHAgEgCAgCASAIDgBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI8NGAQAgEgCgwCASALCwIBIA4OAgEgDQ8CASAOEQBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArzzXAQAgEgERECAc4REQBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE4B8LAQrtSZfw=="   } ]  What is the problem? Why does such an error occur?

/B4ckSl4sh\: it is not an error. Map (as any other TON type in storage) is Cell or a part of Cell. And you get base64 representation of Cell (reply to 46194)

Blockchain: fun Prices(){         let a: Int = 0;                  repeat (18) {             if (a >= 1 && a <= 6) {                 self.stagePrice.set(a, 100);             } else if (a >= 7 && a <= 12) {                 self.stagePrice.set(a, 200);             } else if (a >= 13 && a <= 18) {                 self.stagePrice.set(a, 300);             }              a = a + 1;         }     }  i make this.    Output Same  [   {     "type": "base64",     "value": "te6cckEBEgEA0wACA8/IARACASACCQIBIAMFAgEgBAYAQVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADJAIBIAYHAgEgCAgCASAIDgBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyQAgEgCgwCASALCwIBIA4OAgEgDQ8CASAOEQBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkQAgEgERECAc4REQBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACWQGQMAAw=="   } ] (reply to 46195)

ㅤㅤㅤㅤㅤ: /report advertisement (reply to 46204)

Anton: Please don’t do it, this is not helping, just multiplying spam (reply to 46205)

— 2024-12-08 —

Mehran: In IJ IDE I have TON plugin installed, created a project for TACT using blueprint, built and deployed the project on test-net and everything works fine, but IJ IDE always show 'Unresolved reference' error for known TACT functions like   .notify or .asComment  (Attached screenshot)  Is there anyway to get ride of this error? (Don't prefer to disable all inspection errors)

Rinat | ZilPay (Will not Call or DM you): what about neovim, Helix? (reply to 46270)

Mehran: Hmm, prefer to fix IJ as I always worked with Jetbrain products and am more comfortable with that. So is it a TON plugin known issue for IJ? (reply to 46271)

Rinat | ZilPay (Will not Call or DM you): i hate vscode and any simular editor, i use helix for now and i a bit sad because it hasn't grammarly for tact (reply to 46272)

Anton: You should file an issue at their GitHub, that plugin is maintained by a separate team (reply to 46270)

Mehran: Doesn't work (reply to 46279)

Alex: Hi, is there any good smart contract example using usdt?

Я̨kov: https://docs.tact-lang.org/cookbook/jettons/#usdt-jetton-operations and the rest of the page (reply to 46289)

Alex: thanks, I saw this one just want to have a little bit more explanation in document how to use it, will be great to have sequence diagram or something similar (reply to 46290)

/B4ckSl4sh\: You can buy them on tonconsole (reply to 46292)

Rus: Hi, haven't found a notion of token decimals in jetton master contract.  How to know what is the smallest jetton amount precision?  Is it possible to learn it on-chain (or it needs to be hardcoded e.g. jettonMasterAddress => decimals)? (reply to 45769)

Alex: found diagrams here, if somebody needed   https://github.com/Laisky/tact-utils/tree/main/contracts/jetton#flows (reply to 46291)

/B4ckSl4sh\: In Blockchain no decimals exists actually. It is only for off-chain representation (reply to 46314)

Rus: Oh, okay, I just need to do some calculations with different jettons and must ensure the precision stays the same.  e.g. dst jetton amount = src jetton amount * exchange rate  But jettons may have different precision, right? (reply to 46321)

/B4ckSl4sh\: Yes (reply to 46322)

Rus: Okay I guess I need to hardcode their precision explicitly on chain

/B4ckSl4sh\: You can set your exchange_rate based on both decimals (reply to 46322)

Rus: Interesting idea (reply to 46325)

Rus: thank you! (reply to 46325)

Andrei: Hey! Is there a way in tact to get a current contract balance in the receive message block?

/B4ckSl4sh\: https://docs.tact-lang.org/ref/core-common/#mybalance (reply to 46341)

Ali: https://testnet.tonviewer.com/transaction/807204b64f87f217b77df15514fdbb89e02d45d1c6e1d9858cb89b691b1606af  whats the 708 error code in jetton stand for?

— 2024-12-09 —

Pouya: /B4ckSl4sh@combot

/B4ckSl4sh\: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L66 (reply to 46348)

Ali: actually i dont understand FUNC thats why i asked here @B4ckSl4sh        fun sendTokens(to: Address, amount: Int) {         require(self.JettonWalletAddress != newAddress(0, 0), "Jetton wallet address is not set");                  send(SendParameters{             to: self.JettonWalletAddress,             value: JettonTransferGas + GasReserve,             mode: SendRemainingValue,             body: JettonTransfer{                 queryId: self.queryId,                 amount: amount,                 destination: to,                 responseDestination: myAddress(),                 customPayload: null,                 forwardTonAmount: ton("0.01"),                 forwardPayload: emptySlice()             }.toCell()         });          self.queryId += 1;     }   that is my send code, i beleive i am using something wrong

/B4ckSl4sh\: https://docs.tact-lang.org/cookbook/jettons/#sending-jetton-transfer (reply to 46361)

Alex: Just a kind reminder: we are collecting your feedback for the Tact team!👍  Thank you to everyone who has already submitted the survey!🙏  👉https://paperform.co/edit/h02jnxtq (reply to 46113)

Andrei: Hey! When I send a message to the smart contract, how can I access the value of TON coins that message carries?

Dr. Aria: context().value (reply to 46365)

Tea the Bottle: hello, on transaction confirm, how can I let user see how many jetton they will recived back ?

Anton: Hey folks, your feedback would be greatly appreciated (reply to 46113)

Dr. Aria: i have issue with addr_none which is missing (reply to 46376)

Derrick: Hello, everyone

Derrick: i need TON Smart Contract Developer

Derrick: if you are an expert of Tact Lang and TON Smart Contract, plz let me know

Derrick: thanks for your answer (reply to 46381)

Derrick: did you built and deployed TON Smart contract?

Derrick: i have to launch Jetton token

Anton: yep, the support for addr_none is planned: https://github.com/tact-lang/tact/issues/1119 (reply to 46378)

Anton: will be in the next release

Andrei: Hey! When I'm sending a deploy message, is there a way to retain the value I'm sending with the message on the contract or the deploy message is bounced by default?

/B4ckSl4sh\: You can make a receiver for Deploy opcode (or use deploy trait from stdlib). Or you can just attach incorrect opcode - contract will be deployed and you will receive your TONs with bounced message. (I am not 100% sure this works, because I've never tried it, but I think it should work) (reply to 46395)

Andrei: Great idea, let me try. Thanks! (reply to 46396)

wizardev: I'm available for ton smart contract with func or tact Let's connect via DM (reply to 46386)

Илья: Help pls Contract fragment: message(0xf8a7ea5) JettonTransfer {     queryId: Int as uint64;     amount: Int as coins;     destination: Address;     responseDestination: Address?;     customPayload: Cell? = null;     forwardTonAmount: Int as coins;     forwardPayload: Slice as remaining; }  message SendTokens {     to: Address;     amount: Int as coins; }  receive(msg: SendTokens) {         self.requireOwner();         require(!self.stopped, "Contract was stopped");          self.queryId += 1;          let addressReciever = calculateJettonWalletAddress(             msg.to,             self.jettonMasterAddress,             self.jettonWalletCode         );          send(SendParameters{             to: addressReciever,              value: JettonTransferGas,             mode: SendIgnoreErrors,             body: JettonTransfer {                 queryId: self.queryId,                 amount: msg.amount,                 destination: msg.to,                 responseDestination: msg.to,                 customPayload: null,                 forwardTonAmount: 1,                 forwardPayload: rawSlice("F")             }.toCell(),         });          send(SendParameters{             to: sender(),             value: 0,             mode: SendRemainingValue,             body: Excesses{}.toCell()         });     }  TypeScript Code import { Address, toNano } from '@ton/core'; import { NetworkProvider } from '@ton/blueprint'; import { WalletContract } from '../wrappers/WalletContract';  export async function run(provider: NetworkProvider) {     const CONTRACT_ADDRESS = Address.parse("");     const walletContract = await provider.open(WalletContract.fromAddress(CONTRACT_ADDRESS));     await walletContract.send(         provider.sender(),         {             value: toNano("0.05")         },         {             $$type: "SendTokens",             to: Address.parse(""),             amount: 100n,         }     ) }  Try to send jetton to other wallet, but it isn`t work

/B4ckSl4sh\: What exactly does not work? (reply to 46416)

mnemotiv: only Fragment has access to that API (reply to 46441)

mnemotiv: if you mean buying it via API

mnemotiv: ofcourse there are projects which are connected to Fragment's smart contracts, but that's a story which doesn't fit this channel's topic

mnemotiv: I don't know the deep technical details about it, I just know some details and that's it (reply to 46451)

mnemotiv: what issue are you having? (reply to 46452)

mnemotiv: what you mean throw? giveaway? (reply to 46456)

mnemotiv: even if you make a site like a Fragment, you'll be just a proxy/intermediary working through Fragment smart contracts, there's no Telegram API for stars (reply to 46459)

mnemotiv: it's extraordinary provided only for Fragment

Blockchain: I created a smart contract on the tone network. I want to print the getters of this contract on the site with reactjs typescript. Likewise, I want to write the ts code that activates the receive code when I click on the button. Which document should I read for this?

— 2024-12-10 —

Tea the Bottle: /     receive("Mint") { // Public Minting         let ctx: Context = context();         let amount: Int = context().value; // Amount of TON sent with the transaction         dump(amount);          // Ensure the user sends a valid amount         require(amount >= 200000000, "Minimum 0.2 TON required to mint");         require(self.mintable, "Minting is not enabled");          // Define the Jetton conversion rate (e.g., 1 TON = 10 Jettons)         // let conversion_rate: Int = 10;         let jettons_to_mint: Int = 50000;          // Ensure the minting does not exceed the maximum supply         require(self.total_supply + jettons_to_mint <= self.max_supply, "Max supply exceeded");          // Mint the calculated amount of Jettons for the sender         self.mint(ctx.sender, jettons_to_mint, self.owner);     }

Tea the Bottle: hello, when I call this , on confirm scene do not show how much Jetton user will received

Tea the Bottle: how can I fix this ?

Илья: send(SendParameters{             to: addressReciever,              value: JettonTransferGas,             mode: SendIgnoreErrors,             body: JettonTransfer {                 queryId: self.queryId,                 amount: msg.amount,                 destination: msg.to,                 responseDestination: msg.to,                 customPayload: null,                 forwardTonAmount: 1,                 forwardPayload: rawSlice("F")             }.toCell(),         }); (reply to 46420)

Илья: This function doesn't work, I don't understand what's wrong, I pass there the address to whom to translate, only I'm not sure of the data I pass to body.

Mo30: forwardTonAmount: 1?  its nano coin based did you tried ton("1")? (reply to 46473)

Илья: Hmm, let’s try. Can you explain what this parameter is responsible for?

Mo30: idk im newbie in ton blockchain too (reply to 46480)

wizardev: Hi

wizardev: I was trying to token mint in one msg

wizardev: but encountered error

wizardev: plz help me

wizardev: fun mint(to: Address, amount: Int, response_destination: Address) {         require(self.mintable, "Can't Mint Anymore");         self.total_supply = (self.total_supply + amount); // Update total supply          let winit: StateInit = self.getJettonWalletInit(to); // Create message         send(SendParameters{                 to: contractAddress(winit),                 value: 0,                 bounce: true,                 mode: SendRemainingValue,                 body: TokenTransferInternal{                     query_id: 0,                     amount: amount,                     from: myAddress(),                     response_destination: response_destination,                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: winit.code,                 data: winit.data             }         );          send(SendParameters{                 to: contractAddress(winit),                 value: 1,                 bounce: true,                 mode: SendRemainingValue,                 body: TokenTransferInternal{                     query_id: 0,                     amount: amount,                     from: myAddress(),                     response_destination: response_destination,                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: winit.code,                 data: winit.data             }         );     }

wizardev: any one here?

Tea the Bottle: hello, how can I show user how much Jetton they will received upon finish this transaction ?

Tea the Bottle: my contract code:

Tea the Bottle: receive("Mint") { // Public Minting         let ctx: Context = context();         let amount: Int = context().value; // Amount of TON sent with the transaction         dump(amount);          // Ensure the user sends a valid amount         require(amount >= 200000000, "Minimum 0.2 TON required to mint");         require(self.mintable, "Minting is not enabled");          // Define the Jetton conversion rate (e.g., 1 TON = 10 Jettons)         // let conversion_rate: Int = 10;         let jettons_to_mint: Int = 50000;          // Ensure the minting does not exceed the maximum supply         require(self.total_supply + jettons_to_mint <= self.max_supply, "Max supply exceeded");          // Mint the calculated amount of Jettons for the sender         self.mint(ctx.sender, jettons_to_mint, self.owner);          send(SendParameters{                 to: sender(),                 value: 0,                 mode: SendRemainingValue | SendIgnoreErrors,                 bounce: false,                 body: TokenNotification{ // 0x7362d09c -- Remind the new Owner                     query_id: 0,                     amount: jettons_to_mint,                     from: myAddress(),                     forward_payload: beginCell().endCell().asSlice()                 }.toCell()             }         );      }

Sol: Hello. I really need an experienced person who can write on time, to consult on the project.

wizardev: @Thea

wizardev: Are you ton dev ?

wizardev: would you plz help me one thing ?

wizardev: I've deployed one jetton contract

wizardev: and have to interact with that contract but confused how to interact with it

wizardev:   // // Log the contract address     // console.log("Reading Contract Info...");     // console.log(`Contract Address : ${contract_address.toString()}`);      // Instantiate the contract and open it with the client     const contract = await JettonLaunch.fromAddress(Address.parse("kQAkEa4fhU2XJe9zmXUI51kp4kKDD8JE0zfG0lfhW-g0zLhs"));     const contract_open = await client.open(contract);      const initMintAmount = toNano("400000000")      const InitMint: InitMint = {         $$type: "InitMint",         amount: initMintAmount,     };      const provider = client.provider(Address.parse('kQAkEa4fhU2XJe9zmXUI51kp4kKDD8JE0zfG0lfhW-g0zLhs'))      const temp = await contract_open.send(deployer_wallet.sender(provider, secretKey), { value: BigInt('10') }, InitMint)      console.log("result : ", temp);

wizardev: This is current codebase

wizardev: JettonLaunch is jettonmaster contract

wizardev: kQAkEa4fhU2XJe9zmXUI51kp4kKDD8JE0zfG0lfhW-g0zLhs

wizardev: is jetton address

wizardev: I've to mint jetton from that contract but how can i access that contract ?

wizardev: plz help me out

wizardev: blueprint is working well

wizardev: Can we do it on here plz (reply to 46514)

wizardev: It might be helpful for other beginners

wizardev: plz leave me msg here

Sol: Consultation 30 min (reply to 46497)

Alex: Hey, could you please share some good example (not from the docs) with simple jetton transwer logic (usdt)?

Anton: would this help? https://docs.tact-lang.org/cookbook/jettons/#usdt-jetton-operations  it’s from the Tact docs but it’s in the recipe format (reply to 46532)

Alex: Hi Anton, thanks for sharing the docs, it is really great, but i still misunderstood some key concept from it so i hope that having a good example with the tests will cover that (reply to 46533)

Alex: Maybe you could anwser this questions? I found a diagram with token transfer flow. Seems that user or contract might have two wallet addresses - wallet and jetton wallet. So how can i get jetton addrees from contract? Is this jetton wallet should be initialized on the deploy? For me these topics is not very clear since i'm coming not from funC and blockchain. Lets say i have a simple contract witch main responsible is to distribute incoming jettons (usdt) to two wallet (let say contract owner and orginizer). How to communicate with such contract from the frontend (user wallet)? (reply to 46533)

Alex: is this necessary to have uint4 in status of JettonWalletData struct for USDT contract? What does it mean?  Seems i have a problem with Tact version, but i have 0.22 blueprint version

Я̨kov: Perhaps your Tact version is quite low, try yarn upgrade -p @tact-lang/compiler (adjust for your package manager) (reply to 46540)

Alex: thanks, at least a can build a contract now (reply to 46548)

Alex: what is jettonWalletCode in init of contract? https://docs.tact-lang.org/cookbook/jettons/#sending-jetton-transfer

Mo30: is there's a way use env or variable when we deploy contract?  i mean build time environment variables like dart  I don't want use init , i want define some const variable but they changed during deployment

Mo30: because these are shared between multi contracts and i don't want to pass these to other ones each time   one workaround i thought is genereting this file on fly (reply to 46552)

Alex: deploy your contract using TypeScript and put any data into init (reply to 46554)

Mo30: i know these are global static variables which i have to change when i want to deploy on mainnet or testnet and local testing (reply to 46556)

Alex: if you are using programmatic deploy then use env vars from them (reply to 46557)

🙏🙏🙏: Good day everybody!  Can somebody help me with handling asm functions in Tact? I am not sure if I'm doing sha512 right inside my contract:  asm fun sha512( s: Builder ): Slice {     ONE HASHEXT_SHA512 }  asm fun sha512Two( s1: Builder, s2: Builder ): Slice {     TWO HASHEXT_SHA512 }  Should it return Slice? Or Cell? Or smth else? I know that it returns two 256 bit integers from TVM but I don't see any explanation on how to handle such data with Tact (I know that we can do it in func).  Thanks!

Anton: @novusnota42 please take a look (reply to 46563)

Илья: How can i fix this error: "If the balance is not enough to pay for gas_usage gas then the compute phase fails with skip reason cskip_no_gas."? When I try to transfer jetton to contract

Я̨kov: If you just want an on-chain hash that'll produce correct results (same as H-strings in FunC) for Builders/Slices (viewed as Strings) with any number of bytes allowed within account limits, then refer to this comment (soon to be in the docs).  Now, in general, whenever you expect multiple return values (tensor or tuple return types OR multiple stack values), then you have to provide a Struct to capture those. For example, it can look something like this:  struct Sha512 { h1: Int; h2: Int } asm fun sha512(s: Slice): Sha512 { ONE HASHEXT_SHA512 UNPAIR } asm fun twoSha512(s1: Slice, s2: Slice): Sha512 { TWO HASHEXT_SHA512 UNPAIR } Btw, there is HASHEXTA_SHA512, which would also append the result to the provided Builder and return the new Builder. That is, no extra Structs for mapping needed :) (reply to 46563)

🙏🙏🙏: Thank you so much! I was actually doing the Struct approach but I didn’t know that asm functions could handle destructuring directly  Thank you so much again! (reply to 46570)

Oleksandr: Hey.  Created a simple counter contract on TACT  I want to know how I can interact with contract on front-end.  Found that I needed use contract wrapper from contract folder and import it to my front-end - which is weird.  On EVM I can use wagmi and ABI contract and easily  interact, but how I TON?

Blockchain: When I deploy it with sandbox, the data appears without any problems. But when I deploy it on the testnet, it appears as base64. Why is this so? Where am I doing wrong? Can you help with this? urgent!

— 2024-12-11 —

Blockchain: This is important. because there is no problem in sandbox. But testnet is problematic. why is this so? (reply to 46610)

Wild Wolf: When I deploy simple jetton contract on sandbox (https://ide.ton.org), i got the message "'default' is not exported by projects/emaaya/dist/tact_EmaayaJetton.ts, imported by ide__cell.ts  3:21:50 AM " why? who can help me?

Tanks Go Battle: Hi, what IDE do you use to code tact.

Anton: https://github.com/tact-lang/awesome-tact/blob/main/README.md#developer-tools  VS Code, JetBrains IDEs, Vim, or https://ide.ton.org (reply to 46627)

Blockchain: Hi. Can you help me please (reply to 46628)

Alex: Hey, do we have a russian speaking Tact Expert in the chat to be able to consult on smart contract development. I just need to "breake a wall" in my understanding of Jetton wallets with usdt on chain. It will take only 30 minutes.

Ash 🤓: Is there any issue idk why while deploying token creating contract and connect it to my front end I keep getting this error

Ash 🤓: Idk what's the issue

Ash 🤓: Could some one please know

Ash 🤓: @AntonTrunov could you please (reply to 46674)

/B4ckSl4sh\: Please, provide more information and attach screenshots instead of screen photos (reply to 46674)

Ash 🤓: jettonhelper.ts: import { Sha256 } from "@aws-crypto/sha256-js"; import { Dictionary, beginCell, Cell } from "@ton/core";  const ONCHAIN_CONTENT_PREFIX = 0x00; const SNAKE_PREFIX = 0x00; const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);  const sha256 = (str: string) => {     const sha = new Sha256();     sha.update(str);     return Buffer.from(sha.digestSync()); };  const toKey = (key: string) => {     return BigInt(0x${sha256(key).toString("hex")}); };  export function buildOnchainMetadata(data: { name: string; description: string; image: string }): Cell {     let dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());      // Store the on-chain metadata in the dictionary     Object.entries(data).forEach(([key, value]) => {         dict.set(toKey(key), makeSnakeCell(Buffer.from(value, "utf8")));     });      return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell(); }  export function makeSnakeCell(data: Buffer) {     // Create a cell that package the data     let chunks = bufferToChunks(data, CELL_MAX_SIZE_BYTES);      const b = chunks.reduceRight((curCell, chunk, index) => {         if (index === 0) {             curCell.storeInt(SNAKE_PREFIX, 8);         }         curCell.storeBuffer(chunk);         if (index > 0) {             const cell = curCell.endCell();             return beginCell().storeRef(cell);         } else {             return curCell;         }     }, beginCell());     return b.endCell(); }  function bufferToChunks(buff: Buffer, chunkSize: number) {     let chunks: Buffer[] = [];     while (buff.byteLength > 0) {         chunks.push(buff.slice(0, chunkSize));         buff = buff.slice(chunkSize);     }     return chunks; }

Ash 🤓: jetton.tact: import "@stdlib/deploy"; import "./traits/JettonMaster.tact"; import "./traits/JettonWallet.tact";  message TransferOwnership {     //  queryId: Int as uint64;  // Added standard queryId     newOwner: Address; }  contract Jetton with JettonMaster, Deployable {     total_supply: Int as coins;     owner: Address;     jetton_content: Cell;     mintable: Bool;      init(owner: Address, content: Cell){         // initial_supply: Int         // require(initial_supply > 0, "Initial supply must be greater than 0");         self.total_supply = 0;         self.owner = owner;         self.mintable = true;         self.jetton_content = content;     }      override inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit {         return initOf JettonWalletImp(owner_address, myAddress());     }      receive("Mint:Close"){         let ctx: Context = context();         require(ctx.sender == self.owner, "JettonMaster: Sender is not a Jetton owner");         self.mintable = false;     }      receive(msg: TransferOwnership){         // Security check         require(sender() == self.owner, "Not authorized to transfer ownership");         // Update owner         let oldOwner: Address = self.owner;         self.owner = msg.newOwner;          // Send acknowledgment         send(SendParameters{                 to: msg.newOwner,                 value: 0,                 mode: SendRemainingValue,                 body: "Ownership transferred successfully".asComment()             }         );     } }  contract JettonWalletImp with JettonWallet, Deployable {     balance: Int as coins = 0;     owner: Address;     jetton_master: Address;     init(owner: Address, jetton_master: Address){         self.owner = owner;         self.jetton_master = jetton_master;     }      override inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit {         return initOf JettonWalletImp(owner_address, self.jetton_master);     }      //Price = (Initial Price) * (1 + Purchase Amount / Liquidity Pool)^Curve Steepness }

Ash 🤓: deployjetton.tsx : script    import { Address, toNano, beginCell } from '@ton/core'; import { Jetton } from '../../wrappers/Jetton'; import { NetworkProvider } from '@ton/blueprint'; import { buildOnchainMetadata } from '../../utils/jetton-helpers';  export async function run(provider: NetworkProvider) {     const jettonParams = {         name: "S5",         description: "Elon musk will join Cypher to make ton a better place",         symbol: "S5",         image: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid",     };      // Create content Cell     let content = buildOnchainMetadata(jettonParams);      const sampleJetton = provider.open(await Jetton.fromInit(provider.sender().address as Address, content)); //1000000000000000000n      await sampleJetton.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'JettonMint',             origin: provider.sender().address as Address,             receiver: provider.sender().address as Address,             amount: 100000000000000000n,             custom_payload: null,             forward_ton_amount: toNano('0.01'),             forward_payload: beginCell().endCell().asSlice()         }     );      await provider.waitForDeploy(sampleJetton.address);      // run methods on sampleJetton }

Ash 🤓: Could you please look into it and basically after build and deploy we placed the ts files generated into the front end and linked with it but weeks keep getting errors of length+offset error even though we reduce the metadata or change the type of the image url etc and all nothing seems to work (reply to 46681)

Я̨kov: 👀 Source: trust me, bro (reply to 46684)

Ash 🤓: ?? Didn't get you,u can dm me (reply to 46686)

Ash 🤓: Could you help me out (reply to 46686)

Я̨kov: Please, don't spam or mass ping. If you want to receive any help, pack all the files you have, upload them to GitHub or something, then post a link here.  Preferably, don't write the deployment scripts in .tsx (why?), but in .ts. And consider writing some tests yourself. (reply to 46689)

Ash 🤓: Sorry but it's a private project sir couldn't share much but could invite you (reply to 46690)

Ash 🤓: No it's just a typo mistake while pasting here in tg (reply to 46690)

/B4ckSl4sh\: Or, determine the actual piece of code, that produces the error, and share it, with explanation what you are trying to do and what error you get (reply to 46690)

Ash 🤓: Could you invite you guys ?? (reply to 46691)

Ash 🤓: I have created a project to create a token and then connected it to FE then I keep getting the offset+length=15567 error i don't know if it's bcoz of the cell length and tried reducing the metadata as well but of no use (reply to 46693)

Ash 🤓: Or else @B4ckSl4sh could i invite you guys to my private repo plz

sajad: Hi I want to send jetton to my Contract, like transferFrom at solidity how can I write this fun or receive?

Blockchain: Isn't there anyone who can help me? There is a process not running on your network. It runs in sandbox. but it doesn't work on testnet and mainnet!!

— 2024-12-12 —

Philip: https://nometa.xyz/ (reply to 46719)

Crypto_: Hi  I was basically passing the token info into the contract then I keep getting the offset+length= 15567 i trimmer the metadata size to smaller and lower chunks and tried multiple times too the same error keeps coming

Alex: ⚡️Just a quick reminder that we're collecting your feedback on the developer experience.  Today is the last chance to share your thoughts with the Tact team, and your input will be taken into account!🧐 (reply to 46113)

Rus: New jetton standard is highly needed :) (reply to 46113)

Anton: what should be in that standard? (reply to 46761)

Anton: or do you mean a jetton implementation in Tact?

Rus: I mean the whole standard.   I find approval functionality like on Solana SPL tokens or Ethereum ERC20 tokens safer than Jetton Notifications solution, where the token transfer transaction is not reverted (bounced) even if the notification is reverted (bounced).  Also the jetton standard does not has decimals field to rely on the token precision on chain.  Are there any open discussions on that topic?

sajad: hi may you share your code( transfer jetton ) (reply to 46764)

/B4ckSl4sh\: There is no need of that. Fractional number of tokens is just convenient for humans, but there is no need of such information onchain (reply to 46764)

Anton: Discussion like that can be conducted here: https://github.com/ton-blockchain/TEPs (reply to 46764)

/B4ckSl4sh\: Such a standard is possible in theory, but it would make transactions more expensive, so now it's done this way (reply to 46764)

sajad: struct TokenTransferInternal {  queryId: Int;  amount: Int;  from: Address;  response_destination: Address;  forward_ton_amount: Int;  forward_payload: Slice; }  message DepositTokens {  amount: Int; } receive(msg: DepositTokens) {   let ctx: Context = context();   require(ctx.sender == self.owner, "Only owner can deposit tokens.");   require(msg.amount > 0, "Amount must be greater than zero.");    send(SendParameters{             to: self.token,             value: 0,             bounce: true,             mode: SendRemainingValue,             body: TokenTransferInternal{                 queryId: 0,                 amount: msg.amount,                 from: ctx.sender,                 response_destination: myAddress(),                 forward_ton_amount: 0,                 forward_payload: emptySlice()             }.toCell()         });   self.balanceJettonContract += msg.amount;   self.reply("DepositTokens refund".asComment());  }   I write this code but my jetton not transfering to my Contract

sajad: tx is confirm

/B4ckSl4sh\: I believe that in your case you need to send TokenTransfer (not TokenTransferInternal) to your JettonWallet (reply to 46772)

sajad: just this? (reply to 46774)

/B4ckSl4sh\: Wait, in receiver, what you are trying to process? If you want to process incoming Jettons you need to create receive(JettonNotify) (reply to 46775)

/B4ckSl4sh\: I believe this article will help you to understand https://docs.ton.org/develop/dapps/asset-processing/jettons

sajad: thanks a lot, let me check it 🌱👍 (reply to 46776)

sajad: hello again   receive(msg: JettonTransferNotification) {   if(sender() == self.owner){    self.balanceJettonContract += msg.amount;   }   if(sender() == self.token){    self.balanceJettonContract += msg.amount + 1;   }    emit(JettonInfo{sender: sender(), msgSender: msg.sender, amount: msg.amount}.toCell());           self.forward(msg.sender, null, false, null);   self.reply(JettonInfo{sender: sender(), msgSender: msg.sender, amount: msg.amount}.toCell());     }   I use this code, how can find Jetton Address is right?

sajad: I want to grow up self.balanceJettonContract

/B4ckSl4sh\: You should validate that JettonNotify comes from your JettonWallet. In most cases you need to ship information about this address from offchain. In rare cases, TEP-89 could help, but not all jettons implement TEP-89 (reply to 46781)

Anton: 📖 Secure Smart Contract Programming in Tact: Avoiding Pitfalls in the TON Ecosystem  As The Open Network evolves, its innovative features and the Tact programming language unlock new possibilities for developers. However, common mistakes can lead to vulnerabilities.  CertiK’s latest blog post highlights critical issues like data serialization, concurrency, and gas management, offering actionable insights to optimize security in Tact smart contracts. Whether you’re new to TON or a seasoned developer, these best practices are essential for building robust and secure applications.  🔗 https://www.certik.com/resources/blog/secure-smart-contract-programming-in-tact-popular-mistakes-in-the-ton (forwarded from TON Dev News)

sajad: thanks (reply to 46785)

Victor: Hi guys, how to calculate op_codes in tact?  According to docs we should use CRC32 from TL-B Schema https://docs.ton.org/v3/documentation/data-formats/tlb/crc32  but according to tact's docs we should use type signatures instead of tlb https://github.com/tact-lang/tact/blob/main/CHANGELOG.md?plain=1#L935 i.e. I've got TLB and Signature from .md project file after tact building  TLB: check_in#722bfa86 chatId:int257 = CheckIn Signature: CheckIn{chatId:int257}  I've tried to get crc32 from signature and got  crc32("CheckIn{chatId:int257}") = 0x7ec9b591 I've tried to use & 0x7FFFFFFF according to the 1st url and got 0xfec9b591  So, anyone knows how to get 722bfa86 opcode for CheckIn{chatId:int257} in tact?

Anton: you most likely do not need to calculate the message opcodes, since you can specify those like so:   message(0x722bfa86) Checkin {     chatId: Int; } (reply to 46801)

Victor: but I want to calculate  :D (reply to 46802)

Anton: here is how it’s calculated by the Tact compiler for a message: https://github.com/tact-lang/tact/blob/607c2872ea5a13c343ddb3e33bdaf8135438e0e0/src/types/resolveSignatures.ts#L185-L200 (reply to 46803)

Victor: thx a ton! omg, it uses sha256 instead of crc32 :D (reply to 46806)

— 2024-12-13 —

sajad: hi I calculate jetton wallet but it's incorrect. I use this and some other codes but all of the addresses is incorrect (reply to 46777)

Alex: You can follow examples here.   One specific thing have not clarified, due offline calculation you need to ensure what kind of Jetton Wallet you need to calculate, there are at least two of them: standard and stable coin version. (reply to 46834)

Tea the Bottle: hello, is there any example of 'trading' contract ? user can send X Ton and master wallet send Y Jetton return from wallet Z ?

Laisky: You can implement a sell message to achieve this function. (reply to 46836)

Tea the Bottle: sell message ? Im stuck at send message, Tact's send only have 'value' to send TON

Tea the Bottle: can you give me an example ? (reply to 46837)

Laisky: I don't have a trading sample, but there are numerous examples of custom messages and interactions here for you to explore. https://github.com/Laisky/tact-utils (reply to 46839)

Tea the Bottle: thank you, I will read it

sajad: thank you so much 🌱 I must be check it (reply to 46835)

Alex: Trading, do you mean “swap” or “sell”? From what you texted in following text, I conclude you mean swap.  The best way to follow the documentation of DEX(dedust and ston.fi) where you plan to manage swap.  Additional examples: - https://docs.ton.org/v3/guidelines/dapps/cookbook#third-party-decentralized-exchanges-dex - https://docs.tact-lang.org/cookbook/dexes/dedust/ - https://docs.tact-lang.org/cookbook/dexes/stonfi/ (reply to 46836)

Tea the Bottle: how about SELL ? Im not sure about get into trading centers yet. Boss's order is make it simple (reply to 46846)

Alex: As I remember we also have examples of Sell for Toncoin, but not for Jettons (Tokens). - NFT sale contracts from Getgems: https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources - Telegram numbers and usernames contracts(sale logic inside the item itself): https://github.com/TelegramMessenger/telemint (reply to 46847)

Андрей: how do I execute something in the smart contract when certain time passes? e.g. a Campaign should be closed on the deadline, and the funds should be distributed. deadline is a Contract’s state that has been initialized when the contract was deployed

Андрей: like I understand a message needs to be sent to the contract, but the whole idea of the app is that campaign gets created with a specified deadline when it should be closed. then on the deadline, the funds are transferred to the participants — who is sending the message to close the campaign?

Erfan: you should have a admin wallet authenticate it with it's address and trigger the deadline after sending the message (reply to 46855)

Андрей: but how to automate so that the message is sent right on the deadline? there won’t be anyone who is sending the message manually when the deadline date/time comes, right?   I’m coming from the web development and my head is wrapped around the concept of cron jobs that do these types of tasks. (reply to 46860)

Erfan: i believe you should make a script connect to your wallet inside it and send the message to contract use cron to run the script on deadline (reply to 46861)

Nothing: how i can create a fun like this in tact  function receiveUSDT(uint256 amount) external {         require(amount > 0, "Amount must be greater than zero");          // Transfer USDT from the sender to this contract         bool success = IERC20(usdtToken).transferFrom(msg.sender, address(this), amount);         require(success, "USDT transfer failed");     }

Nothing: contract need a receive function of usdt(jetton)

sajad: I use this for transfer jetton (reply to 46777)

sajad: read this docs (reply to 46869)

sajad: thank you so much, it's work! (reply to 46835)

Nothing: Any can give example (reply to 46868)

Nothing: this function is not working     // Anyone can call this function to deposit USDT     receive(msg: Deposit) {         // Verify the message has enough value attached         require(context().value >= ton("0.05"), "Insufficient fees attached");          // Request USDT transfer from sender to bridge         send(SendParameters{             to: self.usdtMaster,             value: 0,             mode: SendRemainingValue,             body: beginCell()                 .storeUint(0xf8a7ea5, 32)     // transfer operation                 .storeUint(msg.queryId, 64)    // query id                 .storeCoins(msg.jettonAmount)  // amount                 .storeAddress(myAddress())     // to address (bridge)                 .storeAddress(sender())        // response destination                 .storeBool(true)              // custom payload                 .storeRef(                    // storing evmAddress in payload                     beginCell()                         .storeUint(msg.evmAddress, 160)                         .endCell()                 )                 .endCell()         });                           // Emit deposit notification first         emit(DepositNotification{             queryId: msg.queryId,             sender: sender(),             evmAddress: msg.evmAddress,             jettonAmount: msg.jettonAmount         }.toCell());     }

Erfan: can i use a get method from another contract and wait for it's answer on ton blockchain?

/B4ckSl4sh\: No, you cannot call get methods onchain (reply to 46908)

Erfan: i need to check a value from a master contract for every call on sub contract sending a message to master contract and getting it back in form of a message. is this a bad idea? (reply to 46919)

Mo30: This is the only way (reply to 46921)

Erfan: but is it a bad idea? (reply to 46922)

Erfan: will the gas usage be to much?

Mo30: it costs every time (reply to 46923)

/B4ckSl4sh\: Depends on the amount of data you transfer (reply to 46924)

Erfan: imagine if master contract would get like 10k messages a day  will it become slow?

Mo30: you can add a extenal listener and update it value by api or external code (reply to 46924)

Erfan: i need this for frozen tokens part of tokens will be frozen and part of it can transfer

Erfan: on chain? (reply to 46928)

/B4ckSl4sh\: Are you planning to implement honeypot?) (reply to 46929)

Erfan: master contract is the minter and sub contracts are wallets

Erfan: no and sorry i don't know what that is (reply to 46932)

/B4ckSl4sh\: Anyway, in your scheme you can store a bool in every wallet that represents the ability of wallet to transfer funds. And this bool variable may be updated by master (reply to 46934)

Erfan: so i will have to update every wallet? (reply to 46935)

/B4ckSl4sh\: Yes (reply to 46936)

/B4ckSl4sh\: There is no better way to do that onchain

Erfan: ok man and thanks for answering (reply to 46938)

Mo30: create a separated contract for frozen tokens  and a contract for not frozen tokens for every user and hold value of frozen tokens in init function of it  on frozen contract add a method for withdrawing  and check if it withdrawing enabled Then check sender  with address of contractAddress(initOf UserContract(msg.wallet,msg.frozenAmount))  if sender is equal to this send frozenAmount to their contract or wallet (reply to 46929)

Erfan: but to unfroze i need to send a message to all contacts from the main contract? (reply to 46941)

Mo30: to your FrozenContract only  then tell to your users to withdraw (reply to 46942)

Erfan: i think i understood thank you (reply to 46943)

Nothing: who to listen event off chain

— 2024-12-14 —

Bohdan: Hi, I'm trying to calculate storage fee according to this example  https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees-low-level#computation-fees but I don't know what should I set for 'const size'? As I understand it, it should be the contract size, but where do I get it? Is it the size of the .tact file or .compiled.json or something else?

Rus: Hey. Thank you for the idea. I am experiencing some issues implementing it:  Suppose src jetton and dst jetton are of the same precision of 9 decimals.  Remind dst jetton amount = src jetton amount * exchange rate  Suppose I want to set exchange rate to 0.5 [dst/src]. I want 1 src token to be worth 0.5 dst tokens.  Since we can't work with decimal numbers, we must represent exchange rate with some precision based on both src and dst jetton decimals.  Let's set exchange rate to be 0.5 * 10^9 (9 decimals). Then: dst jetton amount = (src jetton amount * exchange rate) / 10^9  We must also divide src jetton amount * exchange rate by the "common" decimals for src jetton amount and exchange rate.  I am not sure if this value we divide by can be set as some constant and we may provide only exchange rate... (reply to 46325)

Rus: I think it is possible to hardcode the value we divide by to e.g. 10^9 and calculate exchange rate precision based on that then. (reply to 47069)

/B4ckSl4sh\: Yes, it's usually done by that (reply to 47071)

Rus: Btw, do you have some examples of how people do that? (reply to 47080)

/B4ckSl4sh\: Math stdlib will be soon available for tact, for now you can check funC math lib (reply to 47081)

/B4ckSl4sh\: https://github.com/ton-blockchain/ton/blob/master/crypto%2Fsmartcont%2Fmathlib.fc (reply to 47081)

Rus: do you mean some particular function from mathlib?

/B4ckSl4sh\: Not really, there just was some interesting examples on fixed point numbers (reply to 47084)

Rus: Could you please make an announcement when the official tact jetton implementation is ready? (reply to 47085)

/B4ckSl4sh\: Of course) (reply to 47110)

Rus: thank you ^) (reply to 47111)

Nothing: how to call or send message in ts code (not from frontend)

Nothing: i want to call this write function in code ``  receive(msg: Withdraw) {            } ``` not from forntend

/B4ckSl4sh\: There should be generated wrapper for it. Check in output directory in .ts file (reply to 47119)

Nothing: with this how i can call

— 2024-12-15 —

Rus: const payload = beginCell().storeAddress(deployer.address).storeAddress(deployer.address).storeUint(5, 64).endCell();     BitBuilder overflow        828 |         if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }       829 |         b_0.storeCoins(src.forward_ton_amount);     > 830 |         b_0.storeBuilder(src.forward_payload.asBuilder());           |             ^       831 |     };       832 | }       833 |        at BitBuilder.writeBit (node_modules/@ton/core/dist/boc/BitBuilder.js:36:19)       at BitBuilder.writeBits (node_modules/@ton/core/dist/boc/BitBuilder.js:51:18)       at Builder.storeBits (node_modules/@ton/core/dist/boc/Builder.js:69:20)       at Builder.storeSlice (node_modules/@ton/core/dist/boc/Builder.js:284:18)       at Builder.storeBuilder (node_modules/@ton/core/dist/boc/Builder.js:311:21)       at build/JettonMinter/tact_JettonWallet.ts:830:13       at Builder.storeWritable (node_modules/@ton/core/dist/boc/Builder.js:338:13)       at Builder.store (node_modules/@ton/core/dist/boc/Builder.js:362:14)       at JettonWallet.send (build/JettonMinter/tact_JettonWallet.ts:1671:32)       at Proxy.<anonymous> (node_modules/@ton/sandbox/dist/blockchain/Blockchain.js:451:47)       at Object.sendTransfer (tests/OtcMarket.spec.ts:111:44)       at Object.<anonymous> (tests/OtcMarket.spec.ts:203:53)

⁭: do you use blueprint for deployment? or webide?

Rus: blueprint

Rus: for testing*

jude: Hello guys I'm new here

jude: Why is there a Tact Language.  Is FunC and Fift not sufficient enough??

jude: Which language is this ? (reply to 46896)

Dr. Aria: Ah (reply to 47210)

jude: Which language is the best and recommended for writing smart contracts on TON blockchain?

Dr. Aria: because it made Working with TON network easier   Like comparing c and python (reply to 47208)

jude: So in this case Tact is like python.  More like how python syntax is easier than C ? (reply to 47213)

Dr. Aria: Yes  idk it was example (reply to 47214)

jude: Cool

jude: I'm new to this TON blockchain.  I'm coming from EVM background (solidity)

Nothing: tact (reply to 47208)

Rus: are there any restrictions on the size of the forward payload for jetton transfer? (reply to 47168)

Alfredo: I don't think so (reply to 47228)

Rus: Why the deploy message must be sent in SendIgnoreErrors mode?

Rus: Is it normal that in the during the deployment I get 130 exit code?

Rus: Is it possible that one sends a JettonTransfer with amount set to 0?

/B4ckSl4sh\: Yes (reply to 47274)

/B4ckSl4sh\: There is no such rule (reply to 47270)

/B4ckSl4sh\: Deployment of the contract will succeed if you attached correct StateInit and enough TONs, regardless any exit code (reply to 47271)

Rus: Continuously getting BitBuilder overflow error:  export function storeTokenTransfer(src: TokenTransfer) {     return (builder: Builder) => {         let b_0 = builder;         b_0.storeUint(260734629, 32);         b_0.storeUint(src.query_id, 64);         b_0.storeCoins(src.amount);         b_0.storeAddress(src.destination);         b_0.storeAddress(src.response_destination);         if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }         b_0.storeCoins(src.forward_ton_amount);         b_0.storeBuilder(src.forward_payload.asBuilder());      }; }  Could it be the issue with how autogenerated storeTokenTransfer uses storeBuilder?         BitBuilder overflow        828 |         if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }       829 |         b_0.storeCoins(src.forward_ton_amount);     > 830 |         b_0.storeBuilder(src.forward_payload.asBuilder());           |             ^       831 |     };       832 | }       833 |        at BitBuilder.writeBit (node_modules/@ton/core/dist/boc/BitBuilder.js:36:19)       at BitBuilder.writeBits (node_modules/@ton/core/dist/boc/BitBuilder.js:51:18)       at Builder.storeBits (node_modules/@ton/core/dist/boc/Builder.js:69:20)       at Builder.storeSlice (node_modules/@ton/core/dist/boc/Builder.js:284:18)       at Builder.storeBuilder (node_modules/@ton/core/dist/boc/Builder.js:311:21)       at build/JettonMinter/tact_JettonWallet.ts:830:13       at Builder.storeWritable (node_modules/@ton/core/dist/boc/Builder.js:338:13)       at Builder.store (node_modules/@ton/core/dist/boc/Builder.js:362:14)       at JettonWallet.send (build/JettonMinter/tact_JettonWallet.ts:1671:32)       at Proxy.<anonymous> (node_modules/@ton/sandbox/dist/blockchain/Blockchain.js:451:47)       at Object.sendTransfer (tests/OtcMarket.spec.ts:113:44)       at Object.<anonymous> (tests/OtcMarket.spec.ts:222:53) (reply to 47168)

Rus: Here is the TokenTransfer message definition`I use:  message(0xf8a7ea5) TokenTransfer {     query_id: Int as uint64;     amount: Int as coins;     destination: Address;     response_destination: Address?;     custom_payload: Cell?;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining; } (reply to 47286)

Rus: It seems like the token transfer message is too huge to be stored in one cell. Which causes an error here: if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenTransfer') {             body = beginCell().store(storeTokenTransfer(message)).endCell(); } (reply to 47286)

Abhimanyu: Any solutions for this ?

— 2024-12-16 —

Dreon: Hi can someone help me to create a withdraw token contract that can send jetton token

Dreon: I tried like in documents but in jetton transfer it did not work

Tea the Bottle: hi, may anyone explain me progress to let a user mint him self 1 NFT after finished 1 quest in my system ?

Tea the Bottle: User play game/ finish a quest and he have right for 1 NFT  X. How can I create NFT and send him mint transaction ? ( he must pay gas fee him self )

Iřřøďẽr: I have 2 questions.   Context:   Tact_code import { beginCell, Cell, contractAddress, StateInit, storeStateInit } from '@ton/core';  const [tonConnectUI] = useTonConnectUI();  const init = {     code: Cell.fromBase64('<CONTRACT_CODE>'),     data: Cell.fromBase64('<CONTRACT_INIT_DATA>') } satisfies StateInit;  const stateInit = beginCell()     .store(storeStateInit(init))     .endCell();  const address = contractAddress(0, init);  await tonConnectUI.sendTransaction({     validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes     messages: [         {             address: address.toRawString(),             amount: '5000000',             stateInit: stateInit.toBoc().toString('base64')         }     ] });  This code is the standard for the deployment of a contract via a tonconnect.   1 question - what should I put in contract_code? I have an import of @stdlib/deploy in my code. Is it easy to insert it along with the rest of the code on the clock in this place?   2 question - what exactly and how to insert into contract_init_data? What is in the code under the word init? Or without that word? Can you show me an example, please?  As I understand it, the tact does not document how exactly the contract input data should be formed, so you need to look at the auto-gen wrappers. But that's the problem. I need to deploy the contract at the time of sending the transaction

Bohdan: Hi, in this example https://tact-by-example.org/06-unbounded-maps we don't use seqno or id for TokenChild, is it because we pass an owner address to TokenChild and it serves like unique identifier?

Yash: Hello everyone, As we are having a limit of 30000 entries in a map in Tact. Is the same limit applicable in FunC as well or not?

Dr. Aria: You should avoid use maps in TON Blockchain   that doesn't specified to language (reply to 47431)

Я̨kov: Yes, since this limit stems from the limits of the blockchain itself (reply to 47431)

Bohdan: @novusnota42 👍 - does it mean yes? ) (reply to 47430)

/B4ckSl4sh\: yes (reply to 47441)

Rus: https://docs.tact-lang.org/book/exit-codes/#36

Rus: Will the message bounce back in case we sent to the invalid destination address?  Suppose A sends message M to E (where E is invalid destination address).  Then we can catch the bounced<M> at A? (reply to 47447)

/B4ckSl4sh\: what is invalid destination? (reply to 47448)

Rus: If the destination address is invalid (reply to 47449)

Rus: e.g. it doesn’t conform to the relevant TL-B schemas, contains unknown workchain ID or it has invalid length for the given workchain

/B4ckSl4sh\: message will not be sent. you will get exit code 36

Rus: ok, thank you

Rus: What if the destination address was correct, but   e.g. I sent "hello" message, but the receiver does not support receiving "hello" messages.  A "hello" -> B  In this case the message will bounce from B to A?

Rus: https://docs.tact-lang.org/book/exit-codes/#130 (reply to 47454)

/B4ckSl4sh\: if you set bounceable flag - Yes (reply to 47454)

Rus: nice, thank you (reply to 47456)

John: Hi everyone, is there any example about how to upgrade wallet contract? For instance , the jetton minter only need to upgrade one contract, but there are too many jetton wallets, and the are called dynamically.

Bohdan: how can I measure my contract size?

Anton: you can check in the compilation report: look for a .md file produced by Tact  see e.g. https://t.me/tact_kitchen/21 (reply to 47463)

Rus: get fun pathId(         srcJetton: Address,         dstJetton: Address,     ): Int {         let path: Slice = beginCell()             .storeAddress(srcJetton)             .storeAddress(dstJetton)         .asSlice();          return sha256(path);  Why does this exit with https://docs.tact-lang.org/book/exit-codes/#9?

Rus: Does the slice size must be divisible by 8 as well?

Rus: Seems to be so let path: Slice = beginCell()             .storeUint(parseStdAddress(srcJetton.asSlice()).address, 256)             .storeUint(parseStdAddress(dstJetton.asSlice()).address, 256)         .asSlice(); This helped (reply to 47474)

/B4ckSl4sh\: When using sha256 - yes (reply to 47474)

/B4ckSl4sh\: https://docs.tact-lang.org/ref/core-math/#sha256 (reply to 47474)

Rus: Is it better to send 1 big message or 2 smaller messages?  I can divide them.

Dr. Aria: 1 big message  There is a forwardFee for each message (reply to 47499)

— 2024-12-17 —

Arthur😺: Hello, I am writing a contract for bulk transfer of jetton, but when I test now, I find that a 708 exit code will be reported during the final transfer, can anyone help me to explain why?

Arthur😺: import "@stdlib/deploy";  message (0x1111) JettonAirdrop {     length: Int;     sender_jetton_wallet: Address;     jetton_user_list: map<Int, Address>;     jetton_sending_value: map<Int, Int>; }  message(0xf8a7ea5) TokenTransfer {     queryId: Int as uint64;     amount: Int as coins;     destination: Address;     response_destination: Address;     custom_payload: Cell?;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining; } contract MultiSend with Deployable {    const minTonsForStorage: Int = ton("0.03");     const gasConsumption: Int = ton("0.03");      receive(msg:JettonAirdrop){         let ctx:Context=context();         let msgValue:Int = self.msgValue(ctx.value);         let value_default: Int = 0;         let sendingValue: Int = 0;          let receiver:Address?=msg.jetton_user_list.get(value_default);         let jettonAmount: Int? = msg.jetton_sending_value.get(value_default);         require(receiver!=null,"Receiver is null");         require(jettonAmount!=null,"Jetton amount is null");         send(             SendParameters{                 to: msg.sender_jetton_wallet,                  value: ton("0.08"),                  mode:SendIgnoreErrors,                 bounce:false,                 body:TokenTransfer{                     queryId: 0,                     amount: jettonAmount!!,                     destination: receiver!!,                     response_destination: myAddress(),                     forward_ton_amount: ton("0.1"),                     forward_payload: emptySlice(),                     custom_payload: null,                 }.toCell(),         });     }      receive(){         let ctx: Context = context();         send(SendParameters{                 to: ctx.sender,                 value: 0,                  mode: SendIgnoreErrors + SendRemainingBalance,                 bounce: false         });     }      fun msgValue(value: Int): Int {         let tonBalanceBeforeMsg: Int = myBalance() - value;         let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);         let adjustedValue: Int = value - (storageFee + self.gasConsumption);         return adjustedValue;     } } here is my tact code

Arthur😺: const contract = useAsyncInitialize(async () => {     if (!client || !wallet) return;     const contract = MultiSend.fromAddress(       Address.parse("EQCNtPS2OUcrQ9y9Tzw103ZL6PHdqQAK3QPtIYBPsLCc6sTo")     ) as Contract;     return client.open(contract) as OpenedContract<User>;   }, [client]);    const sendValues = Dictionary.empty<bigint, bigint>();   sendValues.set(toNano(0n), toNano(100n));    const sendUsers = Dictionary.empty<bigint, Address>();   sendUsers.set(     toNano(0n),     Address.parse("kQAKBq0gPEriGkgcDGUrdl-yL9HnOJM-SgnIyV6c5XBVtVfl")   );  send: async () => {       const message: JettonAirdrop = {         $$type: "JettonAirdrop",         sender_jetton_wallet: Address.parse(           "kQDZJ2DV2Fb1qKAa5kqir5M7YJzeT278VYMiIO0lk7EOOvLY"         ),         jetton_sending_value: sendValues,         jetton_user_list: sendUsers,         length: toNano(1n),       };       contract?.send(         sender,         {           value: toNano("0.5"),         },         message       );     },

Arthur😺: and i use it in my react project

Никита: Hello everyone, I have encountered a problem that the hash that I receive from boc has not been looking for a transaction in tonview since yesterday. Has anyone else encountered this?

/B4ckSl4sh\: hash of the boc != transaction hash, moreover, you cannot get transaction hash if only thing you have is message boc (reply to 47549)

Никита: Based on the hash from boc, I could find the transaction in tonview, the problem is that since yesterday it stopped finding them. Here is an example of the code that found the cache and everything worked const transactionRes = await walletConnect.sendTransaction() const cell = Cell.fromBase64(transactionRes.boc) const buffer = cell.hash(); const hashHex = buffer.toString('hex'); // hashHex: 57123dffb9029bdaa9187b5d035737eea94a1b8c018e2ab1885f245eb95c6e30

/B4ckSl4sh\: They updated those methods and now it finds only transactions that are not in Blockchain yet (reply to 47552)

Никита: Yes, I noticed that only processed transactions can be found using it, but I found in the request https-tonapi.io-v2-traces in the inMsg property a hash by which you can search for a transaction

Никита: thanks btw

Никита: Can you please tell me where you found the information that they updated the method? (reply to 47554)

Rus: I've managed to fix it by removing the as remaining from the structure of my forwardPayload.  struct NotificationPayload {     jetton: Address;     type: Int as uint8;     payload: Slice; } If I set here the field payload to Slice as remaining I get bit builder overflow. Remind forwardPayload is Slice as remaining itself. (reply to 47286)

/B4ckSl4sh\: :) https://t.me/TonDevGang/7647 (reply to 47563)

Rus: I think this is because that payload field was too huge and overflowed the cell. Removing as remaining makes it be stored as a ref. (reply to 47564)

Никита: thx (reply to 47565)

P: Hi, everyone. How can we fix this compile error?    'Static function "log2" does not exist'    code: let logval: Int = log2(amount / 1000000000);

Ivan: Hey folks! 👋 I'm working with a TactCounter smart contract (code below), and I need some help crafting a working example to call the MyAdd method using sendTransaction via TON Connect.  The contract looks like this:   import "@stdlib/deploy";  message MyAdd {     queryId: Int as uint64;     amount: Int as uint32; }  contract TactCounter with Deployable {     id: Int as uint32;     counter: Int as uint32;      init(id: Int) {         self.id = id;         self.counter = 0;     }      receive(msg: MyAdd) {         self.counter += msg.amount;     }      get fun counter(): Int {         return self.counter;     }      get fun id(): Int {         return self.id;     } }  Here's an example of a basic transaction with a comment:  const body = beginCell()   .storeUint(0, 32)   .storeStringTail("Hello, TON!")   .endCell();  await connector.sendTransaction({   validUntil: Math.floor(Date.now() / 1000) + 360,   messages: [     {       address: destination,       amount: toNano("0.05").toString(),       payload: body.toBoc().toString("base64")     }   ] });  I need to adapt this approach to send the MyAdd message, filling in queryId and amount fields properly. Can anyone help with the payload construction? 🙏  Thanks in advance! 😊

/B4ckSl4sh\: Check *yourcontract*.ts file in output directory. There you will find wrapper for sending MyAdd (reply to 47573)

Ivan: Thank you so much for the guidance! I managed to make it work by adding the op at the beginning of the cell manually. However, I’m planning to write a project in Dart/Flutter, where we don't have access to the wrappers generated by Tact.  Is there a way to calculate the op value programmatically ahead of time? (reply to 47583)

/B4ckSl4sh\: I guess the best solution is to specify op manually (reply to 47592)

— 2024-12-18 —

Blockchain: When I call the CreateTicket contract, why does the same contract address get generated for each ticket creation, even though the _time value is variable? Each operation should produce a different address. Why is this happening, and how can it be resolved?  MY TACT CODE;  fun CreateTicket(_stage : Int , _time: Int) : Address {          require(sender() == self.owner, "Only administrator can call this function");         let init: StateInit = initOf Ticket(myAddress(),_time, self.stagePrice.get(_stage)!! ,sender(),self.refPercent,self.bankAddr,self.fullRandom,self.commisionPercent,self.ticketDrawLimit);         let newTicket: Address = contractAddress(init);           send(SendParameters{             to: newTicket,             value: ton("0.1"),             mode: SendIgnoreErrors,             code: init.code,             data: init.data         });          self.createdTickets.set(self.TicketID,newTicket);         self.ticketStage.set(newTicket,_stage);         self.TicketID += 1;          return newTicket;     }  OUTPUT:   [   EQDqfFN5BLW-ODXHA29rCGQ4uC1FX1pZLc6gui88rclUOcp6,   EQDqfFN5BLW-ODXHA29rCGQ4uC1FX1pZLc6gui88rclUOcp6,   EQDqfFN5BLW-ODXHA29rCGQ4uC1FX1pZLc6gui88rclUOcp6,   EQBGi8wAdveaY0J_bEp9KZ14vbloIu-Uu6TAmBhg3EK_bR5W,   EQBGi8wAdveaY0J_bEp9KZ14vbloIu-Uu6TAmBhg3EK_bR5W,   EQBGi8wAdveaY0J_bEp9KZ14vbloIu-Uu6TAmBhg3EK_bR5W ]

Santosh: Hey guys, i have a master contract which calls a Jetton contract. Any error in the jetton contract bounces the message back to admin contract. Now i am trying to add a generic handler which will send the remaining balance back to the sender. How can i get sender address in the bounce handler?  bounced(slice: Slice) {     // how can i get sender address?     dump("bounced MintJetton"); }

— 2024-12-20 —

Syed Ale: Hello everyone

Syed Ale: My name is Hasnain, I am here to get some guidance and mentorship. I am a non tech background, I want to start into the WEB3 space, from where can I start?  Can someone guide me please

Nothing: how to deploy a contract from Another contract in tact

John: Just send message with code & data to dest address, with bounceable false (reply to 47931)

/B4ckSl4sh\: Or with bounceable true. Deployment will work anyway (reply to 47937)

Laisky: I just updated the tact template project tact-utils, adding a function to convert hash integers to hex, a fullSha256 on-chain function that doesn't truncate input parameters, and a function to verify the Merkle root on-chain. If you're interested, you can check the detailed explanation in the README. https://github.com/Laisky/tact-utils

Anton: cool stuff!  btw, please notice that the full Fift support is subject to change in the future Tact versions, so WHILE:<{ …  and many other high-level control flow structures most likely won’t be available (reply to 47959)

Skuli: https://youtube.com/playlist?list=PLyDBPwv9EPsAJpR7R0cC4kgo7BjiMmUy7&si=xqYlPN5aN6m7C66n  https://youtube.com/playlist?list=PLXKwiq6Wt6m9aHs8SqfORk3bdEEhK2BLW&si=iRC8Yjs4JL-roVUI  https://youtube.com/playlist?list=PLSBBx0ivqFa7M1YvkCNyEQMoGkkbm4yFy&si=fEvjLyR1pGwcsQ_F (reply to 47923)

Skuli: Maybe this will also help you  https://chatgpt.com/g/g-tFkVOWIoi-tact (reply to 47965)

Илья: Hi all, I have a contract that allows jettons to be taken out and a database that stores the allowed amount that can be taken out. How do I keep track so that those who are not stored in our database cannot call the contract. The database is on postgresql

Skuli: It doesn't work in web3 either. Your database is completely centralized. Can't you create a variable in the contract to store everyone's addresses? (reply to 47971)

Илья: I want users to invoke the contract themselves so I don't have to pay a fee for them. Is this even possible? What are the options?

Skuli: There are two options. Either you pay a commission or they pay a commission. (reply to 47973)

Илья: they pay a commission.

Илья: But then how do I get the information that they got jettons in postgresql when calling the contract

Skuli: May be this helped u I ask in Tact GPTs (reply to 47976)

Илья: Could you send all code pls?

Илья: Tact*

Skuli: I give u full chat  https://chatgpt.com/g/g-tFkVOWIoi-tact/c/6765568d-ed0c-8013-95d4-de515a73a8ac (reply to 47979)

Илья: Thank you ❤️

Skuli: Did this fix your problem? (reply to 47982)

Илья: It is help, i`ll try to use this tips

Nothing: i am try to depoly like this its not work    receive(msg: DeployJetton) {         // Verify sufficient gas for deployment         let gas: Int = ton("0.1");  // Fixed gas amount         let forward_gas: Int = ton("0.05"); // Amount to forward for Jetton operations         require(context().value > gas + forward_gas, "Insufficient value sent for deployment");          // Deploy new Jetton contract         let stateInit: StateInit = initOf JettonCore(             msg.owner,             msg.content,             msg.max_supply,             msg.token_price,             msg.initial_mint,             msg.pool         );          // Send deployment message         send(SendParameters{             to: contractAddress(stateInit),             value: forward_gas,             bounce: false,             mode: SendRemainingValue,             code: stateInit.code,             data: stateInit.data         });          // Add the new Jetton to the pool         let jettonAddress: Address = contractAddress(stateInit);         self.pools.set(jettonAddress, JettonPool{             balance: 0,             isActive: true         });     }      fun getJettonInit(owner: Address, content: Cell, max_supply: Int, token_price: Int, initial_mint: Int, pool: Address): StateInit {         return initOf JettonCore(             owner,      // owner             content,    // content             max_supply, // max_supply             token_price, // token_price             initial_mint, // initial_mint             pool        // pool address         );     } A contract deploying jetton contract (reply to 47937)

Ivan: Hey Tact team! 2000 lines of code worked almost from the first try. I wouldn't have had any chance with FunС.  Thanks for making it so simple!

Anton: Wow! Thanks for your feedback — means a lot to us. If your project is already alive, we would be love to know about it and also ask your opinion on how to make Tact even better (reply to 48005)

— 2024-12-21 —

Laisky: Thank you for the reminder! However, if future versions of tact can directly support the full sha256 functionality, then fift will no longer be necessary. (reply to 47964)

Anton: We will certainly add it, you can track the progress here: https://github.com/tact-lang/tact/issues/1056 (reply to 48153)

Laisky: Yes, I noticed this issue; I actualy copied this piece of fift code from here.😁 (reply to 48154)

Anton: There is a second version of it, which does not use the Fift control flow instructions like WHILE, this is going to be stable (reply to 48155)

— 2024-12-22 —

Diego: Hi everyone, does anybody knows how Telegram’s Stars affect to receive TON on mini-apps? It’s just reading about it and I found that mini apps can ONLY receive stars so I’m confused here.

User<7118646036>: Hi guys, is there an example of a smart contract here that allows you to buy stars?

Zoroaster: Hi, as I know stars can subsequently be converted via Fragment and receive a Ton in return. As I understand this method bypassed the problems associated with implementing payment methods in the app. Thereby minimising the problems with regulators on the outside. As I understand it, Telegram circumvents this by the fact that stars are just an in-app purchase, like in-game purchases in games. All in all, something like that, if I'm wrong, feel free to correct me) (reply to 48264)

Diego: Great tks

Илья: has anyone worked with the checkSignature method? I'm trying to generate a message that it passed the check, but for some reason it doesn't work  message: message SendTokens {     timestamp: Int as uint64;     amount: Int as coins;     signature: Slice as remaining; }  receive: receive(msg: SendTokens) {         require(!self.stopped, "Contract was stopped");         require(now() - msg.timestamp <= 60, "Request expired");          let hash: Int = beginCell()             .storeCoins(msg.amount)             .storeUint(msg.timestamp, 64)             .endCell().hash();         let check: Bool = checkSignature(hash, msg.signature, self.trustedPublicKey);          require(check, "Wrong signature!");          self.queryId += 1;          send(SendParameters{             to: self.myJettonWalletAddress,              value: JettonTransferGas,             mode: SendIgnoreErrors,             body: JettonTransfer {                 queryId: self.queryId,                 amount: msg.amount,                 destination: sender(),                 responseDestination: sender(),                 customPayload: null,                 forwardTonAmount: 1,                 forwardPayload: rawSlice("F")             }.toCell(),         });          send(SendParameters{             to: sender(),             value: 0,             mode: SendRemainingValue,             body: Excesses{}.toCell()         });     }

Илья: js code for keys: const nacl = require("tweetnacl")  const privateKey = '0cfeb468a40bc42945882015960c49049e323887c7a797146c339cdc34edf9385c27d5e98680e6c89130bdf1c9195b6950f726722a55325ed96c5c49923ca00e'; // Приватный ключ const publicKey = '5c27d5e98680e6c89130bdf1c9195b6950f726722a55325ed96c5c49923ca00e'; // Публичный ключ  console.log("Public Key:", Buffer.from(publicKey).toString("hex")); console.log("Private Key:", Buffer.from(privateKey).toString("hex"));  // Данные для подписи const timestamp = Math.floor(Date.now() / 1000); const amount = 100000000000  console.log(timestamp);  function toBytes(timestamp, amount) {     const amountBuffer = Buffer.alloc(8); // 8 байт для amount     amountBuffer.writeBigUInt64BE(BigInt(amount), 0);      const timestampBuffer = Buffer.alloc(8); // 8 байт для timestamp     timestampBuffer.writeBigUInt64BE(BigInt(timestamp), 0);        return Buffer.concat([timestampBuffer, amountBuffer]); }  const dataToSign = toBytes(timestamp, amount);  const signature = nacl.sign.detached(dataToSign, new Uint8Array(Buffer.from(privateKey, 'hex'))); console.log("Signature (Hex):", Buffer.from(signature).toString("hex"));  js code for contracts: export async function run(provider: NetworkProvider) {     const walletContract = await provider.open(WalletContract.fromAddress(CONTRACT_ADDRESS));     await walletContract.send(         provider.sender(),         {             value: toNano("0.5")         },         {             $$type: "SendTokens",             timestamp: 1734857935n,             amount: toNano('100'),             signature: beginCell().storeBuffer(Buffer.from('d0953e0b26aa73f6380ce0989c1b3228b4b9c2d2023c80c477a5d6dfcb43299dacb9fa9fbcc0a41efadee083d31a3a2ee9f470dda1ac2b28c947d0a8a169b00c', 'hex')).asSlice()         }     ) }

Илья: Contract deployer: const walletContract = provider.open(await WalletContract.fromInit(88459981n, JETTON_WALLET_CODE, JETTON_OWNER, BigInt(0x5c27d5e98680e6c89130bdf1c9195b6950f726722a55325ed96c5c49923ca00e)));

Илья: Last one is public key

/B4ckSl4sh\: Why don't you use sign function from @ton/crypto?  const forwardPayload = beginCell()         .storeUint(0, 32)         .storeAddress(vaultAddress)         .storeAddress(poolAddress)         .endCell()                  const signature = sign(forwardPayload.hash(), secretKey)          const signedPayload = beginCell()         .storeBuffer(signature)         .storeRef(forwardPayload)         .endCell(); (reply to 48357)

Илья: О, thank (reply to 48361)

Josiah: ☝️ (reply to 48361)

Georgiy: 🎉 Misti 0.6 has just landed on NPM!  🔍 More Tact Detectors: CellBounds which covers both CellOverflow and CellUnderflow, ExitCodeUsage, EtaLikeSimplifications and ShortCircuitCondition.  ⚙️ More Tools: Added Callgraph that tracks function effects and is useful for auditing contracts.  🌐 Better Integrability: Misti can run in browser environments.  🔧 Fixes & Enhancements: Check out the full changelog.  ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Илья: Can you format of keys? (reply to 48361)

Илья: It should be ed25519?  Like this: -----BEGIN PRIVATE KEY----- MC4CAQAwBQYDK2VwBCIEIHOBPI5W3k/JNLN/b+szGmyqHkuxZbiEJhTLyf4gVhOS -----END PRIVATE KEY-----  -----BEGIN PUBLIC KEY----- MCowBQYDK2VwAyEAJWaBACTBBOjRBME88JvuqdGczvWYAUPDYs/z9leWfN4= -----END PUBLIC KEY-----

Илья: I how can I push it in a contract then I deploy or send msg

Skuli: Hello everyone, I updated my GPTs based on Tact and posted on github all the promts and knowledge that I use for it. If anyone wants to share additional data or improve my promt, you can send a PR requests  https://chatgpt.com/g/g-tFkVOWIoi-tact  https://github.com/ton-ai-core/tact-gpts/blob/main/SystemPromt.txt

Alfredo: Okay (reply to 48456)

Dr. Aria: is there transfer method?

Dr. Aria: What? (reply to 48457)

Dr. Aria: and syntax is wrong (reply to 48456)

Skuli: Wrong syntax "input" and "transfer"? Correct ? (reply to 48456)

Dr. Aria: + "self.balance" transfer params passed like ts/js objects (reply to 48461)

Skuli: Can you give me the full link to your chat in GPTs? I'll look at what request you wrote to catch the same thing in myself (reply to 48462)

Dr. Aria: i just asked  "How to send jetton" (reply to 48463)

Dr. Aria: https://tact-by-example.org/07-jetton-standard (reply to 48463)

Dr. Aria: Correct answer should be something like this

Cyril M |: what does exit code: -13 mean?

Cyril M |: it's not in the docs

— 2024-12-23 —

JoJo 🐶: Hi everyone! 👋  I’m looking for a developer TON smart contracts to help build a fun and simple project. If anyone’s interested, feel free to DM me, and we can discuss the details, timeline, and budget.  Thanks! 🎅✨

Anton: Can you reproduce it? It shouldn’t be possible (reply to 48477)

/B4ckSl4sh\: AFAIR it means that you cannot call get method for non-deployed contract (maybe you called get_wallet_data for non-deployed jetton wallet?) (reply to 48477)

Suhrad: GM Guys

Anton: @novusnota42 please look into this (reply to 48554)

/B4ckSl4sh\: It should be some api exit code, not tact-related (reply to 48558)

Я̨kov: Docs cover TON and Tact-specific exit codes, whilst the -13 you've encountered is most likely the one from Axios (used in @ton/ton) or some standard code from Node.js (reply to 48478)

Bohdan: Hi, I'm testing my dapp using orbs and testnet but from time to time requests to orbs fails with 504 error. Is it because of I use the testnet or the mainnet is also not so stable in orbs?

Илья: Somebody can help with checkSignature

Илья: smart contract contract WalletContract with Deployable, Ownable {     seqno: Int as uint64;     owner: Address;     jettonAmount: Int as coins = 0;     stopped: Bool = false;     queryId: Int as uint32 = 0;     jettonMasterAddress: Address;     myJettonWalletAddress: Address;     jettonWalletCode: Cell;     publicKey: Int as uint256;     isPass: Bool = false;      init(seqno: Int, jettonWalletCode: Cell, jettonMasterAddress: Address, publicKey: Int) {         self.seqno = seqno;         self.owner = sender();         self.jettonWalletCode = jettonWalletCode;         self.jettonMasterAddress = jettonMasterAddress;         self.publicKey = publicKey;                  self.myJettonWalletAddress = calculateJettonWalletAddress(             myAddress(),             self.jettonMasterAddress,             self.jettonWalletCode,         );     }      receive(msg: JettonNotify) {         self.jettonAmount += msg.amount;          self.forward(msg.sender, null, false, null);     }      receive(msg: SendTokens) {         require(!self.stopped, "Contract was stopped");         require(now() - msg.timestamp <= 60, "Request expired");          let msgHash: Int = self.getMessageHash(msg.timestamp, msg.amount);          let isValid: Bool = checkSignature(msgHash, msg.signature, self.publicKey);         if (isValid) {             self.isPass = true;         }          self.queryId += 1;          send(SendParameters{             to: self.myJettonWalletAddress,              value: JettonTransferGas,             mode: SendIgnoreErrors,             body: JettonTransfer {                 queryId: self.queryId,                 amount: msg.amount,                 destination: sender(),                 responseDestination: sender(),                 customPayload: null,                 forwardTonAmount: 1,                 forwardPayload: rawSlice("F")             }.toCell(),         });          send(SendParameters{             to: sender(),             value: 0,             mode: SendRemainingValue,             body: Excesses{}.toCell()         });     }      receive("stopped") {         self.requireOwner();         self.stopped = true;     }      fun getMessageHash(timestamp: Int, amount: Int): Int {         let signatureData: Cell = beginCell().storeCoins(amount).endCell();         return signatureData.hash();     }      get fun isPass(): Bool {         return self.isPass;     } }

Илья: tests: import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox'; import { toNano, Cell, Address, beginCell } from '@ton/core'; import { WalletContract } from '../wrappers/WalletContract'; import { mnemonicToWalletKey, mnemonicNew, sign } from '@ton/crypto'; import walletHex from "./jetton-wallet.compiled.json"; import '@ton/test-utils';  describe('WalletContract', () => {     let blockchain: Blockchain;     let deployer: SandboxContract<TreasuryContract>;     let walletContract: SandboxContract<WalletContract>;      let mnemonic: string[];      beforeEach(async () => {         const bocBuffer = Buffer.from(walletHex.hex, 'hex');         const JETTON_WALLET_CODE = Cell.fromBoc(bocBuffer)[0];         const JETTON_OWNER = Address.parse("");          blockchain = await Blockchain.create();          mnemonic = await mnemonicNew();         const keyPair = await mnemonicToWalletKey(mnemonic);         let publicKeyBigInt = BigInt(`0x${keyPair.publicKey.toString('hex')}`);                  walletContract = blockchain.openContract(await WalletContract.fromInit(88459981n, JETTON_WALLET_CODE, JETTON_OWNER, publicKeyBigInt));          deployer = await blockchain.treasury('deployer');          const deployResult = await walletContract.send(             deployer.getSender(),             {                 value: toNano('0.05'),             },             {                 $$type: 'Deploy',                 queryId: 0n,             }         );          expect(deployResult.transactions).toHaveTransaction({             from: deployer.address,             to: walletContract.address,             deploy: true,             success: true,         });     });      it('should deploy', async () => {         // the check is done inside beforeEach         // blockchain and walletContract are ready to use     });      it('should receive tokens', async () => {         let user = await blockchain.treasury('user');         let withdrawAmount: bigint = 1000000000n;         const timestamp = Math.floor(Date.now() / 1000);         const signatureData = beginCell().storeCoins(withdrawAmount).endCell();         const keyPair = await mnemonicToWalletKey(mnemonic);         const signature = sign(signatureData.hash(), keyPair.secretKey);         let signatureCell = beginCell().storeBuffer(signature).endCell();         await walletContract.send(             user.getSender(),             {                 value: toNano('0.5')             },             {                 $$type: 'SendTokens',                 timestamp: BigInt(timestamp),                 amount: withdrawAmount,                 signature: signatureCell.asSlice()             }         )         const isPass = await walletContract.getIsPass();         console.log(isPass);     }); });

Илья: always get false

Ivan: Hey everyone! I'm stuck with creating jetton content to initialize it from my smart contract. Is this even possible?  I've looked at the implementation in contract.deploy.ts but it seems like they adapted to TACT rather than the other way around =) Does anyone have a working example?  I tried creating:  struct JettonContent {     name: String;     symbol: String;     description: String;     image: String;     decimals: Int;    }  and calling .toCell() but it didn't work - since 0x00 needs to come first.

Anton: @B4ckSl4sh please take a look at it (reply to 48636)

/B4ckSl4sh\: You definitely misunderstood how structs in Tact work. Example of building onchain metadata in Tact can be found here https://github.com/tact-lang/tact/issues/1115 . This is for nftCollection, but is works same for Jetton/NFT. Example of building onchain metadata for Jettons can be found here https://github.com/tact-lang/jetton/blob/main/sources/utils/jetton-helpers.ts#L18 (reply to 48636)

— 2024-12-24 —

Tea the Bottle: hellp, I can not figure out what did I was wrong with this code:

Tea the Bottle: 0QB7ZWUcPrJvNcXebx26ufbiIvArUZPFh89j1jnIW29wbaQT   message(0x6017b34e) Mint {     query_id: Int as uint64;     nft_content: Cell;     receiver: Address }       receive(msg: Mint){         self.requireOwner();         require(self.next_item_index >= 0, "non-sequential NFTs");          let ctx: Context = context(); // get sender Info         let msgValue: Int = ctx.value;         let tonBalanceBeforeMsg: Int = myBalance() - msgValue;         let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);         msgValue = msgValue - (storageFee + self.gasConsumption);          let init: StateInit = initOf NftItem(self.next_item_index, myAddress(), self.owner, msg.nft_content);         let nft_item_address: Address = contractAddress(init);          // https://docs.tact-lang.org/book/send         send(             SendParameters{                 to: nft_item_address,                 value: msgValue,                 bounce: false,                 mode: SendIgnoreErrors,                 code: init.code, // initial code of the contract (the compiled bytecode)                 data: init.data, // initial data of the contract (arguments of init() function of the contract)                 body: Transfer {                     query_id: msg.query_id,                     new_owner: msg.receiver,                     response_destination: msg.receiver,                     custom_payload: emptyCell(),                     forward_amount: 0,                     forward_payload: emptySlice()                 }.toCell() // message body as a Cell             }         ); // Fields [code] and [data] are what's called an <init> package, which is used in deployments of new contracts.          self.nft_addresses.set(self.next_item_index, nft_item_address);         self.next_item_index = self.next_item_index + 1;     }

Tea the Bottle: may anyone help ?

Tea the Bottle: Im trying to create a mint mess allow owner mint NFT for selected address

Tea the Bottle: this is off chain mess:     await nftCollection.send(         provider.sender(),         {             value: toNano('0.2'),         },         {             $$type: 'Mint',             query_id: 0n,             nft_content: nftContentCell,             receiver: address('0QB7ZWUcPrJvNcXebx26ufbiIvArUZPFh89j1jnIW29wbaQT')         }     );

traceur: Hello guys, I’m using Tact’s Slice.hash to calculate slice hash https://docs.tact-lang.org/ref/core-cells/#slicehash, but no matter what data I store in the slice, it always output the same hash. Does anyone know  why? My code is as below:  fun calculateExternalId(nonce: Int): Int {     let b: Builder = beginCell();     b.storeUint(nonce, 64);     b.storeUint(now(), 64);     return b.asSlice().hash(); }

Anton: The storeUint method has the following signature:  extends fun storeUint(self: Builder, value: Int, bits: Int): Builder;   it does not have mutates keyword so it just returns a new modified builder, it does not modify its self argument in-place  you need to change your function as follows:   fun calculateExternalId(nonce: Int): Int {     let b: Builder = beginCell();     b = b.storeUint(nonce, 64);     b = b.storeUint(now(), 64);     return b.asSlice().hash(); } (reply to 48756)

Я̨kov: Or even:  fun calculateExternalId(nonce: Int): Int {     return beginCell()     .storeUint(nonce, 64)     .storeUint(now(), 64)     .endCell()     .hash(); } (reply to 48760)

Anton: endCell() is an expensive operation (reply to 48761)

Я̨kov: Replaced with .asSlice()  UPD: Back to .endCell(), it was indeed better (reply to 48762)

Dr. Aria: .asSlice also calls endCell internally (reply to 48763)

Dr. Aria: why (reply to 48762)

Anton: it compiles down to the TVM ENDC instruction which costs 518 gas units (reply to 48765)

Anton: it depends on the datatype you work with, for Address it’s a no-operation (reply to 48764)

Dr. Aria: asSlice calls endCell too so how its cheaper than that? (reply to 48768)

Anton: you are right, I just forgot about that

Petr: Fift ASM code for both options for those who are interested:   $Foo$_fun_calculateExternalId PROCREF:<{ ;; asSlice       NEWC   64 STU       NOW   SWAP   64 STU   $Builder$_fun_asSlice INLINECALLDICT       HASHSU }> $Builder$_fun_asSlice PROCINLINE:<{       ENDC       CTOS }>  $Foo$_fun_calculateExternalId2 PROCREF:<{ ;; endCell       NEWC   64 STU       NOW   SWAP   64 STU       ENDC       HASHCU }>

Anton: afair, some hash operations can be used on builders directly

Dr. Aria: okay 👌🏻 (reply to 48770)

Petr: Looks like asSlice is even slower due to the additional CTOS here 🤔 (reply to 48771)

Petr: Moreover, HASHCU (in `endCell`) requires only 26 gas, while HASHSU requires 526 (https://docs.ton.org/v3/documentation/tvm/instructions)

Anton: for instance, HASHEXT_SHA256 might be a better approach here (if the choice of a hash function is not important): it works on builders too and costs 1/33 gas units per byte

— 2024-12-25 —

Tea the Bottle: mocking from offchain that Owner can mint new NFT and direct send it to user's wallet (reply to 48757)

Tea the Bottle: will replace wallet address in code by input latter

Anton: 🎄 Merry Christmas, Folks!  As we wrap up 2024, it's time to celebrate all that we've accomplished together.  🚀 Adoption, Features and Tooling  Your biggest achievement this year was getting GitHub to support Tact on the entire website! We say you, because it wouldn't have been possible without you writing contracts, finding and reporting bugs & suggestions, and supporting Tact elsewhere ❤️  Regarding features and compiler updates, there were so many, that Tact has practically been reborn into a fresh, secure, easy and accessible language language for complex smart contracts, quick onboarding and fast prototyping.  In terms of tools, an awesome static analyzer Misti raised from 0 to hero: with over 25 issue detectors, CI/CD and Blueprint integrations. Additionally, the tree-sitter-tact and many editor packages and highlighting plugins were frequently updated to keep up with compiler updates.  📚 Documentation  Working on the clearest and most comprehensive documentation, we often had to dig deep into TON sources and discover what was really going on under the hood. And it was and is very worth it: the exit codes and assembly functions pages are the most vivid proofs.  We try to cater to both the experienced professionals and beginners on TON Blockchain, which is why you can expect more in-depth research of TVM, more production-ready examples of common contracts in Tact, and an even more streamlined onboarding experience ✈️  🐞 Bugfixes  The release 1.4.1 in particular squashed so many bugs, that the security audit of 1.5.0 went silky smooth — no critical vulnerabilities found, as announced on TON Gateway.  As for the next release, we're fixing the internal representation of Address type, reworking the type system to support more TVM types with the most safety and convenience, and making rapid strides to reduce the gas consumption 🛠  🎁 A Small Holiday Request  Finally, we have a small holiday wish: If you’ve enjoyed our progress this year, consider gifting us a GitHub star. It’s a simple gesture, but one that means the world to us. Your support helps Tact grow and reach even greater heights.  🎅 Happy holidays from the Tact team! ❤️ Take care, get some well-deserved rest and prepare for 2025 — we've got big plans for the next year  🍲 sparkling future ahead ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Tea the Bottle: hello, Im stucking here:

Tea the Bottle: with this code, address show up was diff from my Ton keeper address

Tea the Bottle: let mnemonics = (process.env.mnemonics || "").toString();  console.log(mnemonics.split(" ")) let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));  // Create wallet contract let workchain = 0; // Usually you need a workchain 0 let wallet = WalletContractV5R1.create({ workchain, publicKey: keyPair.publicKey }); console.log(wallet.address);

Tea the Bottle: I can not figure out why from same mnemonics it was gave out 2 address

Aniruddh: Are you using the same exact wallet contract version in TON Keeper as the one in your code (WalletContractV5R1)? (reply to 48868)

Tea the Bottle: I try and V5 gave out diff address but V4 is ok (reply to 48872)

Tea the Bottle: I switched wallet V5 to V4 (reply to 48879)

Tea the Bottle: V4 is better because most docs was written for V4

Tea the Bottle: yes, Im working on this. Passed that problem.

PHYN: how can I send JettonTransfer from contract creator with .ts script?  now i try to use this code, but its wrong: import { toNano, Address, Cell } from '@ton/core'; import { SuperContract } from '../wrappers/SuperContract'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const jettonWalletAddress = Address.parseRaw('contract_jetton_Wallet_Address');     const owner = Address.parse("my_address");     const jettonMasterAddress = Address.parse("master_address");     const amountToSend = toNano('100'); // Количество жетонов для отправки     const emptySlice = new Cell().beginParse();       const superContract = provider.open(         await SuperContract.fromInit(owner, jettonMasterAddress)       );      // Отправляем сообщение на контракт напрямую     await superContract.send(         provider.sender(),         {             value: toNano('0.07'), // Токены TON для покрытия газа         },         {             $$type: 'JettonTransferNotification', // Тип сообщения             queryId: BigInt(0),              amount: amountToSend, // Количество жетонов             sender: owner, // Адрес отправителя             forwardPayload: emptySlice, // Пустой forwardPayload         }     );      console.log('Jettons sent successfully.'); } (reply to 48883)

Anton: you might want to take a look at this project https://github.com/tact-lang/jetton, but keep in mind it is still WIP (reply to 48897)

— 2024-12-26 —

jacket: i run the template,i got this error,anyone help me

Georgiy: Could you share your Tact project config? (reply to 49003)

Georgiy: Okay, the issue in the deployment config. Please check if it corresponds to the following JSON schema: https://raw.githubusercontent.com/ton-community/contract-verifier-config/main/config.json. (reply to 49008)

jacket: Thank you so much! Let me have a try (reply to 49012)

Nerses: Does a comprehensive list of gas optimization tips for the TON blockchain exist, or is there any documentation that provides detailed guidance on this topic?

Anton: There is some info here: https://docs.ton.org/develop/howto/fees-low-level (reply to 49020)

0xtitn: Are there any DEXs with smart contracts written in Tact?

Anton: I’ve been told PixelSwap is written in Tact, although they are not open-source, afaik (reply to 49038)

Skuli: I have a question. Is there only smart contract bytecode in the blockchain? Are there tools to see the low-level tree/code of this contract?

/B4ckSl4sh\: explorer.toncoin.org (reply to 49046)

— 2024-12-27 —

Martin: Can someone help me? I have a deployed token (using the standard, @interface("org.ton.jetton.wallet")). I tested the transfer functionality, and everything worked before. However, now users cannot send tokens to each other. As I understand, this is due to forwardTonAmount() that Tonkeeper sets to 1 by default. When I test the script without forwardTonAmount, the transaction goes through, but with this value, an error occurs. What should I do?

Nerses: As in the TON blockchain, a wallet is also a smart contract, and if it hasn't been used for a long time, the next operation from the wallet incurs higher fees. I want to understand if this behavior also applies to other smart contracts — will the fees be higher if the last call to the contract was a long time ago?

Dr. Aria: yes (reply to 49154)

Nerses: thnx a lot (reply to 49155)

Yavər: I'm working on Testnet but I got this issue, testnet slowdown or something else ?

djan: hello,  may i ask how to get blocks sequence in tact smart contract?

Yavər: on your own contract, you need to create 'seq' value then you should get it. on other smart contract, check its code if it has seqno value and get function (reply to 49164)

Yavər: you can do nothing, u need to make your own smart contract (reply to 49148)

djan: thanks for your help, i thought rely on current block number, now i foud it's best practice is to  rely on the current time instead.  reference: https://tact-by-example.org/04-current-time (reply to 49165)

Nerses: in func there is accept_message()  which has some effects on tx fees, is there smth like that in tact  or maybe under the hood of receive() is called it ?

/B4ckSl4sh\: accept_message have a meaning only in external messages, so receive() does not call it (reply to 49185)

/B4ckSl4sh\: https://docs.tact-lang.org/book/external/#messages-have-to-be-accepted-manually (reply to 49185)

Nerses: Thanks a lot (reply to 49188)

SynthLuvr: Will we really get upgrades in December 👀 (reply to 45644)

/B4ckSl4sh\: Quite a lot or upgrades already done (especially gas-related). Maybe not all of them are in github releases now, but you can build tact conpiler yourself and get the most recent features (reply to 49229)

— 2024-12-28 —

Dapp Farm Support: Does anyone have an already existing github code for a presale

Anton: We spent quite a bit of time to extend the Tact team in Q4 2024, so the 1.6 release gets delayed until January 2025, unfortunately. Although, you can, as @B4ckSl4sh mentioned, clone the repo and build it locally, or just install it from github using npm. That kind of beta-testing would be very much appreciated. Please give it a try and give us feedback! (reply to 49229)

Илья: Hi all, this is the first time I have encountered the 9 cell underflow error. Here is a link to tvm retracer contract call: https://retracer.ton.org/?tx=afc2acfa17c95bcb0c94f422bafbad97ab41debb21c3e84920da66e0825c365d  how I generate payload:  def get_send_jettons(contract_address: str, transfer_fee: int, jettons_amount: int):     timestamp = int(time.time())     signature_data = begin_cell().store_uint(timestamp, 64).store_coins(jettons_amount).end_cell()     signature = sign_message(signature_data.hash, bytes.fromhex(PRIVATE_KEY))     signature_cell = begin_cell().store_bytes(signature).end_cell()      data = {         'address': contract_address,         'amount': str(transfer_fee),         'payload': urlsafe_b64encode(             begin_cell()                 .store_uint(0x972c818e, 32)                 .store_uint(timestamp, 64)                 .store_coins(jettons_amount)                 .store_slice(signature_cell.to_slice())                 .end_cell()                 .to_boc()         ).decode()     }          return data   send transaction: payload = get_send_jettons(PARTNER_SMARTCONTRACT, to_nano(0.05), int(to_nano(user.jettons)))                          conn = connector.get_connector(user_id)             connected = await conn.restore_connection()              if connected:                 transaction = {                     'valid_until': int(time.time() + 3600),                     'messages': [                         payload,                     ]                 }                                  response = await conn.send_transaction(transaction=transaction)  If you need something else, pls write

SynthLuvr: Thanks I'll take a look. I don't see any update in the repo regarding #27 contract upgrades (reply to 49273)

Anton: there are some workarounds, but we are going to solve this issue in a few weeks (reply to 49286)

SynthLuvr: I wonder this as well. Upgrading the parent contract is straightforward. But when there could be thousands of wallet contracts deployed, how do you go about upgrading them? (reply to 47458)

— 2024-12-29 —

John: Maybe let users do manual upgrade? (reply to 49289)

SynthLuvr: Yes of course, but there's much more complexity than that. You need to be able to determine how the upgrade works and what it's being upgraded to. That's quite a challenging problem

SynthLuvr: I've got upgrades working via Tact and locally the tests work, but on testnet it's failing with "Not a cell: null"

SynthLuvr: The problematic part is setting the data setData(msg.data); nativeThrow(0);

SynthLuvr: Did anyone find a solution for this? (reply to 28816)

Made by: gh issue has a full description of how to handle this (reply to 49465)

SynthLuvr: I didn't see a working solution in github. I saw proposed solutions, none of which work. Or is there another issue with more discussion? (reply to 49466)

Made by: issue describes general ways to make an upgrade, but unfortunately there's no "native" way to do this in tact rn. Because you should define some transition mechanism between states of your storage, you shoud create temporary migration function to do so. But I haven't tried it, it's just an idea of implementation. Imho there should me some Migration entity as a part of a language to define transitions between storage states like in good old sql databases (reply to 49467)

Made by: code upgrading is working fine btw (reply to 49467)

SynthLuvr: Yes code upgrade is fine, it's the data upgrade that's problematic (reply to 49469)

SynthLuvr: Updating the data values seems fine too. Specifically what seems problematic is modifying the shape of the data (reply to 49474)

ed: Don't touch the existing shape, add something like reserveData: Cell field, which you would utilize later on for/with possible upgrades, manually parsing additional new data (reply to 49475)

— 2024-12-31 —

Sol: Hi everyone! If you’re looking to develop smart contracts on TON, I can help. Whether it’s creating tokens, deploying contracts, or minting NFTs, feel free to reach out for assistance or collaboration!

Anton: 🎄 And a Happy New Year!  🍲 🪄✨🎁💝🎊🎉🎉🎉 ♨️ @tact_kitchen (forwarded from Tact Kitchen)

— 2025-01-01 —

/B4ckSl4sh\: It's English-speaking chat, so I will remove your message (reply to 49823)

Артем: ok (reply to 49824)

Артем: Hello friends! They shared a link with me, Looking for a developer on funC or tact need to develop a smart contract there is an example and maybe even a code base  the task is quite fast please write only if you are ready to start right now

Артем: i dont now sorry) (reply to 49824)

— 2025-01-02 —

Aniruddh: Yes Im ready to start !! (reply to 49826)

Mat: Hey I have trouble with my contract implemnetation. Can anyone help with using of checkSignature in a contract? Is there any working example available somewhere?

Hunter: how to verify user's ton address is correct or wrong using python ?

Hunter: without api request (reply to 49946)

/B4ckSl4sh\: Use pythoniq_core for example. There is address class that validates address when creating class instance (reply to 49946)

Hunter: yes , thank you (reply to 49948)

br2: Hey, happy new year everyone. I couldnt find any multisigniture contract that created with TACT. is there any example?

/B4ckSl4sh\: https://github.com/tact-lang/contract-safe  Does it match your requirements? (reply to 49953)

Hunter: Is it really a burn address?  Is it safe for burning?  Did they write it on-chain?  EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c

/B4ckSl4sh\: Use this address for burning TONs (tons sent here will be actually burned) -1:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff (reply to 49972)

/B4ckSl4sh\: And what you shared is just address of all zeroes (in basechain) (reply to 49972)

— 2025-01-03 —

Hunter: The TON minter has a function to burn jettons, right? (reply to 49974)

Mubaraak: Yeah

Thomas: EXPERIMENTAL MODEL FOR LOAD BALANCING IN CLOUD COMPUTING  USING THROTTLED ALGORITHM   Can anyone help with this please

SynthLuvr: Thank you for this. It's working great. One issue though is that Cell can only hold primitive types, so an upgrade is unable to add new composite type data (reply to 49499)

Thomas: Please kindly (reply to 50092)

br2: function generateId() internal returns (uint256) {         nonce++;         return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, bridgeNonce))); }  in evm/solidity i can create unique ids with keccak256, how can i do that in TACT language? is there a any example or do i have to done that with FUNC?

br2: fun generateBridgeId(): Int {         self.bridgeNonce += 1;         let data: StringBuilder = beginString();         data.append(self.bridgeNonce.toString());         data.append(myAddress().toString());         data.append(now().toString());         return sha256(data.toString());     }   i fixed the issue like that

br2: receive(msg: JettonTransferNotification) {         require(             sender() == self.jettonWalletAddress,             "Notification not from your jetton wallet!"         );          self.myJettonAmount += msg.amount;         let newId = self.generateBridgeId();          let evmAddress = msg.forwardPayload;          emit(BridgeDepositEvent{             amount: msg.amount,             address: sender(),             bridgeId: newId,             evmAddress: evmAddress         }.toCell());          self.bridgeNonce += 1;          // Forward excesses         self.forward(msg.sender, null, false, null);     }   in my code i have emit function but when i send transaction i cant read this event in tonviewer. how can i read BridgeDepositEvent named event? https://testnet.tonviewer.com/kQCVBH6kvphuAWZtWJodC-k__HdvUjch5EBftDfVEylckUlY

/B4ckSl4sh\: Here is your external-out message. You can copy raw body and parse it futher (reply to 50101)

br2: couldnt find it

/B4ckSl4sh\: https://testnet.tonviewer.com/transaction/7a1290afe4a1400852b92153ceb7387a2e0540dc0cd38cdc87917a53d1dcf81a (reply to 50103)

br2: thanks

— 2025-01-04 —

Potok: @howard_peng he is fake or real ??

/B4ckSl4sh\: Fake. Real one is @backer (reply to 50288)

Mr Shark: Guy, apparently you don’t have all the information (reply to 50291)

Pedro: why createpost bounces here tho? https://paste.debian.net/1342438/ the tx bounces between my v4r2 to my jetton wallet, however i have createPost func in jetton master and other receivers... Been stuck in this for a while, appreciate some quick help here pls

nonam3e: Both are real, the first one is private (reply to 50291)

Pedro: considering this jetton template: https://github.com/nikandr-surkov/Sample-Ton-Jetton-Contract/blob/master/contracts/sample_jetton.tact  Why when I send ton to the jetton master it bounces back to my v4r2 wallet?

/B4ckSl4sh\: With what opcode you send a message? (reply to 50364)

Pedro: 0x0f8a7ea5

/B4ckSl4sh\: It's jetton transfer. It should be sent to jettonWallet. It is not eth. https://docs.ton.org/develop/dapps/asset-processing/jettons#jetton-architecture (reply to 50366)

Pedro: I've been all over that page... I already tried to send to jettonWallet address and it bounces as well.

Pedro: I don't know perhaps some definition on TokenInternal, TokenInternalTransfer on that particular jetton template? Or is it fine?

Pedro: I already tried to send TON just like that:  // Constructing the message body for the transaction         const payload = beginCell()         .endCell();      const transaction = {         validUntil: Math.floor(Date.now() / 1000) + 360,         messages: [             {                 address: jettonMasterAddress.toString(),                 amount: toNano('0.1').toString(),                  payload: payload.toBoc().toString('base64'),             }         ]     };  and it bounces back, same behavior

/B4ckSl4sh\: Maybe just try different one? (reply to 50369)

Pedro: Which one?

/B4ckSl4sh\: Calculate JettonWallet that belongs to your walletv4r2 and send to it (reply to 50370)

Pedro: const wallet = useTonWallet() const userAddress = Address.parse(wallet.account.address);             const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress));              const jettonWalletAddress = await jettonMaster.getWalletAddress(userAddress);             const jettonWalletContract = client.open(JettonWallet.create(jettonWalletAddress));

Pedro: doesnt work...

Pedro: bounces

/B4ckSl4sh\: Provide tx link, please (reply to 50376)

Pedro: https://testnet.tonscan.org/tx/7c1de29d519db8735964ab120ece0632645019adcc380010c5bc9ad1e867fa2b  (sending to jetton master)

Pedro: sending to jetton wallet: https://testnet.tonscan.org/tx/9da9181ea9291fad77fd09ba40de4acd39c90d2b34f1db645decc32e028fdbd7

/B4ckSl4sh\: https://docs.tact-lang.org/book/exit-codes/#130 (reply to 50379)

Pedro: men.... i've been getting 130 with many different code I tested...

/B4ckSl4sh\: https://github.com/tact-lang/jetton  Try with this one

Pedro: https://github.com/nikandr-surkov/Sample-Ton-Jetton-Contract/blob/master/contracts/sample_jetton.tact  this one works, it does create the jetton properly. Can't you see the contract and check if something there is blocking such thing?

Pedro: I mean, I can't see no difference between yours and that one

/B4ckSl4sh\: well. Actually yes. Maybe you've deployed wrong code? idk (reply to 50383)

Pedro: Will try with your repo

Pedro: indeed... (reply to 50389)

— 2025-01-05 —

Pedro: B4ckSl4sh can you take a look at this, https://paste.debian.net/1342479/ i am trying to send ton to my jetton master thru frontend using tonconnect. The tx is bouncing

/B4ckSl4sh\: Do not send tx to jettonMaster. Send to JettonWallet and share tx link (reply to 50399)

Pedro: bounces too..   https://testnet.tonscan.org/tx/90e6c26bba4e404dab5fa6d89a292d8879769764dc188ed116b52b252ab39971

Pedro: I changed to: messages: [      {          address: jettonWalletAddress.toString(),          ...

/B4ckSl4sh\: Incorrect opcode

Pedro: yes but see the code, i dont know where that opcode comes from

Pedro: im using the right one  .storeUint(0xf8a7ea5, 32) // JettonTransfer opcode

/B4ckSl4sh\: Probably error is somewhere else. Try act.ghwnd.cc to test your contract (reply to 50453)

Pedro: im using default tact-lang/jetton

Pedro: the code i am giving you is front-end.

Pedro: i havent changed anything from the standard... How hard is it to send ton to a jetton master or even jetton wallet lol

Pedro: I dont even know how I am supposed to test a jetton transfer on act.ghwnd.cc

Pedro: mad confusing UI/UX there

/B4ckSl4sh\: I understand. And I think that your problem is there (reply to 50457)

Pedro: it's only 46 lines that I sent you lol

/B4ckSl4sh\: But opcode in your tx is incorrect lol (reply to 50462)

Pedro: can you spot something wrong in the code instead?

Pedro: I was able to make it work....

Pedro: https://testnet.tonscan.org/tx/6140badc3b649dadcee2e7cab0830d4d06c511eb356791bc544dc0134689b01f

Pedro: There are a lot of docs saying it needs internal messages, well seems it doesnt..

Pedro: B4ckSl4sh if you are around, can you take a quick look at this? https://paste.debian.net/1342562/  I am triggering a cell underflow though not sure what i am missing when parsing the message from the frontend. It is getting the right opcode, here's a tx

Pedro: https://testnet.tonscan.org/tx/fb59445d88aea1492574a2b99485af25432580e8b3dfeb8ff0bf25690965368c

Pedro: spotted one thing, should use loadRef().beginParse();`instead of `beginParse()

Pedro: not really, loadRef() is on the frontend, in the contract is only beginParse because Type "Cell" does not have a function named "loadRef"

Pedro: can you take a second look please

/B4ckSl4sh\: I think you need .beginParse().loadRef() (reply to 50520)

Pedro: let _img_url: Cell   = msg.imageURL.beginParse().loadRef();  Invalid type "Cell" for argument "cell"

/B4ckSl4sh\: You probably don't understand what you are doing (reply to 50524)

Pedro: imageURL comes from the frontend parsed as such:  .storeRef(beginCell().storeStringTail(formData.imageUrl).endCell())  my receiver (which receives from the frontend) Is trying to store such value.

Pedro: you mentioned beginParse().loadRef() but that seems frontend syntax from ton/core and not tact ?  I really dunno lol

Pedro: as you work at tact perhaps can clear whats wrong

Pedro:  .beginParse().loadRef() thats not even valid my friend.

Pedro: and loadRef.beginParse() is frontend

Pedro: I am still stuck on the same issue after giving it several tries, perhaps i am missing something minor, updated code: https://paste.debian.net/1342588/ Exit code: cell underflow.  I'd appreciate someone that can actually look at that short snippet of code and tell me what's wrong codewise (some explanation would be cool)

SynthLuvr: Error indicates the cells aren't being parsed correctly. Is there a reason you're doing the parsing manually? It's safer to use structs (reply to 50563)

— 2025-01-06 —

Agregator manager: #resume #frontend #backend #fullstack #react #nest #web3 #ton #ethereum   👨‍💻 Fulltack Developer 🕒 Experience: 4+ years  🔔 About me: More than 3 years working frontend/backend web3 (DeFi, GameFi, DAO, ethereum, solana, ton), over the years I have honed not only my professional development skills, but also my project management skills📈 and also have extensive experience in technical documentation� and team leadership👥 and motivation.   Well versed in web3 domain, can easily read and understand solidity code.  Technical stack: - JavaScript/TypeScript - React - Vite/Webpack - State managers: redux, redux-toolkit, effector - Web3: ethers/viem/wagmi/wallet connect/moralis, ton - Tests: jest, React Testing Library  - Architectural methodology: Feature-sliced-design - Backend: Nestjs, express, fastify, PostgreSQL, mysql, redis, bullmq, docker.  Worked with blockchains: - Ton, EVM, near, solana  Detailed CV, github and work experience I will send you in private messages

B74849🤬🤬: Hello. Please tell me how to send a Mint message from a contract to JettonMaster, which I made using minter ton org? I changed the owner of the token to the address of my contract. But I can’t figure out how to make the correct body message now. In my ts code I do this - static mintMessage(from: Address, to: Address, jetton_amount: bigint, forward_ton_amount: bigint, total_ton_amount: bigint, query_id: number | bigint = 0) {     const mintMsg = beginCell().storeUint(0x178d4519, 32)                                    .storeUint(0, 64)                                    .storeCoins(jetton_amount)                                    .storeAddress(null)                                    .storeAddress(from) // Response addr                                    .storeCoins(forward_ton_amount)                                    .storeMaybeRef(null)                     .endCell();          return beginCell().storeUint(21, 32).storeUint(query_id, 64) // op, queryId                           .storeAddress(to)                           .storeCoins(total_ton_amount)                           .storeCoins(jetton_amount)                           .storeRef(mintMsg)                .endCell();     }     async sendMint(provider: ContractProvider, via: Sender, to: Address, jetton_amount: bigint, forward_ton_amount: bigint, total_ton_amount: bigint) {         if(total_ton_amount <= forward_ton_amount) {             throw new Error("Total ton amount should be > forward amount");         }         await provider.internal(via, {             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: JettonMinter.mintMessage(this.address, to, jetton_amount, forward_ton_amount, total_ton_amount),             value: total_ton_amount + toNano('0.015'),         });     }. Does anyone have an example of how to do this correctly

grachzy: Hi all, is there some kind of list of live (Open Source) tact projects on github?

/B4ckSl4sh\: I honestly don't know, but maybe you can find this list somehow, as github now detects and highlights tact code (reply to 50799)

— 2025-01-07 —

Anton: https://github.com/tact-lang/awesome-tact (reply to 50799)

jay: I have developed a tool for issuing SBTs. You’re welcome to connect your testnet wallet and give it a try!  https://sbt-hub.vercel.app/

jay: It includes an SBT implementation written in Tact, utilizing on-chain metadata.

Anton: Is your SBT implementation open-source? (reply to 50842)

jay: Not yet, it’s modified based on the SBT template from getgems.

Nerses: Can you provide an example of an external message? The documentation states that an external message is one sent from outside the blockchain to the blockchain, but what are some specific scenarios where this occurs?

/B4ckSl4sh\: Check out code of any wallet (reply to 50847)

Nerses: Will the message sent from wallet to contract A be external message for A ? In docs it is stated like that,so I wonder how should be handled accept_message in receive ?Most probably I am confusing smth (reply to 50848)

/B4ckSl4sh\: https://docs.tact-lang.org/book/external/#messages-have-to-be-accepted-manually (forwarded from /B4ckSl4sh\)

/B4ckSl4sh\: There will be two messages - one external to wallet and one internal from wallet to A (reply to 50849)

Nerses: can this flow be used to attack smart contracts ?   https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/accept-message-effects#internal-message:~:text=of%20bounce%20messages.-,EXAMPLE,-For%20instance%2C%20if

/B4ckSl4sh\: Well, maybe i'm wrong and acceptMessage() may be called for internal message, but i've never seen this technique because it is nearly never applied (reply to 50856)

Nerses: got it.Is there any other way to be sure that this isnt attack flow ? I meant any platform to ask or someone who knows exactly (reply to 50864)

/B4ckSl4sh\: Just don't use acceptMessage or setGasLimit in receivers, until you are 100% know what you are doing, and everything will be okay (reply to 50865)

Ali: Hey everyone!  On the EVM side, transactions can theoretically be reversed. Therefore, when building structures that include central systems such as bridges or CEX, we wait for Transaction Finality for the relevant transaction and if there are enough approvals, we record the relevant transaction in the backend.  Is TON Blockchain has kinda same think? How do we understand that the transaction is confirmed and cannot be reversed?

Nerses: How can storage optimization be approached in TON compared to EVM? In EVM, storage is structured slot by slot (32 bytes), making it efficient to organize data types like bytes32, bytes20, and bytes10 sequentially (e.g., bytes32, bytes20, bytes10 instead of bytes20, bytes32, bytes10). However, in TON, storage is based on a cell tree structure. Does this mean there are no similar considerations for storage efficiency in TON?

Nerses: Is the Tact-lang/compiler version 1.5.3 backward compatible with version 1.4.1 ?

Anton: It should be, modulo fixing bugs or unintended behavior (reply to 50887)

Anton: Yep, it is totally different (reply to 50882)

Nerses: thanks a lot (reply to 50888)

Nerses: Can gasConsumed or myStorageDue in TACT be used in production smart contracts, or are they still under development?

Anton: both are available since Tact 1.5 and can be (and should be) used in production (reply to 50898)

Nerses: are there any examples of usage ? (reply to 50901)

Nerses: For example, gasConsumed is intended to indicate how much gas has been used so far (as stated in the documentation, it includes the gas used by the calling function itself). Can it be used to determine the gas consumption before a specific line of code?

/B4ckSl4sh\: With some limitations, yes. You will have to count tvm assembly instructions that were executed before gasConsumed(). Not that gas consumption may differ for same instructions, depending on other things (for example beginParse() consume 100 gas on fist parsing of cell, and 25 gas on futher calls (with same cell as argument)) (reply to 50905)

/B4ckSl4sh\: In most cases using @ton/sandbox with tvm logging enabled will solve gas-counting problems (reply to 50905)

Nerses: for unique ID generation I use such method in EVM keccak256(abi.encodePacked(msg.sender, block.timestamp, address(this), block.chainid));  is there a way to achieve this in TON,that even for validators cant be predictable (for example timestamp cant be changed by validator as consensus will not accept)

Ali: fun generateId(): Int {         let data: StringBuilder = beginString();         data.append(sender().toString());         data.append(now().toString());         data.append(myAddress().toString());         return sha256(data.toString());     }   check this out (reply to 50914)

Nerses: this will work,thanks for assistance,but I was seeking for more gas effective approach (in this method the computation fee will increase) (reply to 50916)

Ali: I dont have any ideas about reducing gas, i hope it works for you.

Zoroaster: Hi guys, I'm just starting to dive into this area and would like to ask you guys if it makes sense to learn Tact rather than FunC right away. I've taken a small course on Tact, but I'm not quite sure where to get more knowledge and if Tact-a is really enough. I'd also like to understand what application tasks I can use these skills in. I want to write my first project that will allow me to buy telegram stars through smart contracts, but I don't know how to do it, where to start and whether it can be done only through Tact. I myself am a mobile developer on Flutter and this area is really very new to me, so if you could give me a hint I would be very grateful.

— 2025-01-08 —

Anton: You can deploy a new contract by sending it a message with its initial code and data (reply to 50977)

Ali: In my contract, when i send some token with EVM address as a comment, EVM address value is completely blank in the transfer exit code. What could be wrong in here?   message BridgeDepositEvent {     amount: Int as coins;     address: Address;     bridgeId: Int as uint256;     evmAddress: Slice as remaining; }      receive(msg: JettonTransferNotification) {         require(             sender() == self.jettonWalletAddress,             "Notification not from your jetton wallet!"         );          self.myJettonAmount += msg.amount;         let newId = self.generateBridgeId();          emit(BridgeDepositEvent{             amount: msg.amount,             address: sender(),             bridgeId: newId,             evmAddress: msg.forwardPayload,         }.toCell());          self.bridgeNonce += 1;          // Forward excesses         self.forward(msg.sender, null, false, null);     }

Anton: Does the incoming message have non-empty forwardPayload field? (reply to 51016)

Ali: nope, here is my transfer code   function prepareTokenTransferMessage(     amount: bigint,     destination: Address,     responseDestination: Address,     forwardTonAmount: bigint,     evmAddress: string ) {          const forwardPayload = beginCell()         .storeUint(0, 32) // op code 0 for simple text message         .storeStringTail(evmAddress) // Store EVM address as a string         .endCell();      return beginCell()         .storeUint(0xf8a7ea5, 32) // op code for token transfer         .storeUint(0, 64) // query_id         .storeCoins(amount) // Token amount to transfer         .storeAddress(destination) // Bridge contract address         .storeAddress(responseDestination) // Sender's address for the response         .storeBit(false) // No custom payload         .storeCoins(forwardTonAmount) // TON amount for forwarding         .storeBit(true) // forward_payload is included         .storeRef(forwardPayload) // Include forwardPayload with EVM address         .endCell(); }

Nerses: I have a wallet address with a balance and the corresponding mnemonic, but I'm unable to recreate the exact wallet with its balance using Tonkeeper. Could this issue be related to differences in wallet contract versions (e.g., w5 beta, w5, or others)?

/B4ckSl4sh\: Yes (reply to 51022)

Nerses: is there a way to handle it ? As in block explorer i see my balance but in wallet versions for every version it shows 0 balance https://testnet.tonscan.org/address/0QBWRYE3_suXo4Ihtii5ZP4KTgY8bJ5ZRgCvxi5LqpJ7UO_H#source (reply to 51026)

/B4ckSl4sh\: Idk. Looks like it is correct v5 wallet (reply to 51028)

/B4ckSl4sh\: Where did you create it?

/B4ckSl4sh\: In Mytonwallet?

Nerses: I used tonkeeper (reply to 51030)

/B4ckSl4sh\: Then Idk😢 (reply to 51032)

Agregator manager: #resume #frontend #backend #fullstack #react #nest #web3 #ton #ethereum   👨‍💻 Fulltack Developer 🕒 Experience: 4+ years  🔔 About me: More than 3 years working frontend/backend web3 (DeFi, GameFi, DAO, ethereum, solana, ton), over the years I have honed not only my professional development skills, but also my project management skills📈 and also have extensive experience in technical documentation� and team leadership👥 and motivation.   Well versed in web3 domain, can easily read and understand solidity code.  Technical stack: - JavaScript/TypeScript - React - Vite/Webpack - State managers: redux, redux-toolkit, effector - Web3: ethers/viem/wagmi/wallet connect/moralis, ton - Tests: jest, React Testing Library  - Architectural methodology: Feature-sliced-design - Backend: Nestjs, express, fastify, PostgreSQL, mysql, redis, bullmq, docker.  Worked with blockchains: - Ton, EVM, near, solana  Detailed CV, github and work experience I will send you in private messages

Nerses: Is tonscan or ton viewer show the emitted events ? I just cant see it for my contract but contract works correctly,so event is emitted

/B4ckSl4sh\: Yes. Look for external-out in tonviewer. (In the bottom of the page) (reply to 51040)

Nerses: thanks a lot (reply to 51043)

Семен: Hello everyone. I'm making web application - UI tool for contracts based on Tact ABI. Initially i was studied of making smart contracts on Tact and made jetton on Tact with minter app for it, but i improved application. Now it load ABI from TON Verifier and build UI with contract interface.  At the moment MVP compatible with jetton master contract is ready. In future i will add support for every ABI type. If someone want to contibute it will be awesome  Here is github repo: https://github.com/supadupadao/minter  And here is example of UI for jetton master in deployed application: https://minter.supadupa.space/manage/kQC1I2HcAkUSfMCQCezbL9bVtC_kqnX-gQIToAqXJNTP7yVj

Amirhossein: Does anyone here work professionally with cocos creator?

Nerses: In what cases smart contract throws Null reference exception exit code ?

Amirhossein: For 2d game development with typescript (reply to 51060)

Nerses: In previous versions of TACT it wasnt possible to assign value to struct,can it be done in version 1.5.3 ?         let reward: Reward = Reward {                 amount: 0,                 timelock: 0         };                  if(self.rewards.exists(msg.Id)){             reward = self.rewards.get(msg.Id)!!;         }

Anton: Yep, should be possible. Please let us know if there is any issue with that (reply to 51063)

— 2025-01-09 —

Denis S: Hey, TON Friends.   We are building MemeIndex DAO analytic platform with DEX and DeFi tools as contribution to TON Ecosystem. We need to utilise grant on building: Collateralized Debt Position (CDP) / Synthetic Assets.   Looking for Devs and advisors familiar with TON stack. Please, feel free to DM me. Thank you in advance

Vincent: hi tact builders. how the complier make a tact contract to the op code? I saw in my built file, the op code is generate automatically, so how does this opcode be calculated?

Anton: Hi, the opcode is either specified at the point of message declaration:   message(0xFFFF) Foo {     // <— here in parens    … // fields }   or if it’s not specified, the Tact compiler computes it using the textual representation of the message declaration like so: name + "{" + fields.join(",") + “}”, then it’s hashed with sha256 and and only the first 32 bits of the hash are taken.  You can also get that computed value from the compilation report Tact produces (look for a .md file in the build folder). (reply to 51093)

Vincent: In my case, my function name is "SwapNativeInStonfiV2" (reply to 51095)

Vincent: how to calculate to 1718339489?

Vincent: the HEX is 0x666bc7a1

Anton: just the name is not enough, you need to combine the message name + TLB representations of the message fields + convert it to a string and feed into the newMessageOpcode function  here is how newMessageOpcode function is implemented:  https://github.com/tact-lang/tact/blob/408995bc0c824059f74a2fd7e259997bc9d0620f/src/types/resolveSignatures.ts#L276  here is how that combining is done https://github.com/tact-lang/tact/blob/main/src/types/resolveSignatures.ts#L193-L196 (reply to 51097)

Anton: on the other hand, if you are trying to interface with Ston.fi, then all the opcodes should be fixed and documented in their docs

Anton: you might want to check out this page in the Tact docs: https://docs.tact-lang.org/cookbook/dexes/stonfi

Sapperava: Hey guys. Can you please tell me when it is planned to introduce upgradeability in Tact?

Anton: it is planned, yes, you can check for workarounds and track progress here: https://github.com/tact-lang/tact/issues/27 (reply to 51103)

Александр: It is possible through FunC injection but not so convinient (reply to 51103)

Sapperava: great, thank you. will there be some kind of backward compatibility mechanism? If I write contracts based on the current version now, can they be updated later? (reply to 51104)

Sapperava: thank you, right now I'm looking more at the architectural aspect of what needs to be incorporated into the project than the implementation aspect itself) (reply to 51105)

Anton: unfortunately, we cannot provide guarantees on the format of the contract storage, although, we will try our best to provide some kind of escape hatch, for instance, in the form of a tact.config.json option that recovers previous behavior (reply to 51106)

Suraj Yadav | Decentralized Guild: GM G, I have a question for Tact/TON roadmap  if  I have to onboard a new user or a beginner in TON ecosystem. What should be the roadmap for him/her?  Assume: He/She have basic programming knowledge and concepts

Anton: I would suggest reading tact-by-example.org for now. It’s a bit outdated but still a very good example-driven resource (reply to 51109)

Sapperava: maybe there are common patterns in Tact to abstract the storage and then replace only the implementation of methods that work with the data? (reply to 51108)

Anton: for instance, now the contract storage has the “lazy loading” bit at the beginning and the dictionary of the code cells of the child contracts, but this is a subject to change in the next version, since it is more gas efficient and we are currently implementing a series of gas optimizations (reply to 51111)

Sapperava: ok, sounds good. thank you (reply to 51112)

Nerses: In my contract, users send funds to lock them, and after some time, the funds are released. To ensure the same amount is released, I use ctx.value to fix the amount sent by the user during locking. However, this creates an issue because ctx.value includes the gas cost, meaning the contract balance ends up being less than the fixed amount. As a result, when releasing funds, the user could receive more than the actual balance of the contract. Is there any method or approach to handle this issue and exclude the gas cost from ctx.value or ensure accurate fund handling?

Dmitrii: Hello guys, how do handle this issue, i import helper functions from my code, but generated ts is full of ts errors:   #13 29.00 ../contract/build/Moneypot/tact_JettonMasterTemplate.ts(65,21): error TS7006: Parameter 'src' implicitly has an 'any' type.

/B4ckSl4sh\: In this case user may send you TONs and specify the amount they want to lock in message. You will take needed TONs and send remaining back. Example of this approach can be seen in dedust, when swapping tons to jettons. (reply to 51117)

Dmitrii: and i don’t wanna loose my strict tsconfig

Nerses: Great seems this is really solution. If you are familiar with dedust could you point me the mentioned code ? (reply to 51121)

/B4ckSl4sh\: What functions are you importing? You need messages (types) and just Send function. Or I misunderstood (reply to 51120)

/B4ckSl4sh\: Unfortunately dedust has closed source code so I can't point it :(. But maybe this page will help you https://docs.dedust.io/recipes/write-a-func-contract-to-swap-ton-to-scale-and-send-to-recipient (reply to 51123)

Nerses: I wanted to explore how Dedust handles fixing the amount and sending back the remainder, as gas-related issues might arise. Should I send the remaining amount with a value of 0 and use the mode SendRemainingValue | SendIgnoreErrors to ensure that the fixed amount + gas + returned amount equals ctx.value? (reply to 51124)

Suraj Yadav | Decentralized Guild: What if we start a video format to explain in regional language as we discussed with you during Gurugram TON Bootcamp (reply to 51110)

/B4ckSl4sh\: SendIgnoreErrors are not required actually. But yes, this will work (reply to 51126)

Nerses: thanks for clarification and assistance (reply to 51128)

Anton: That would be great, the Tact team does not have the capacity to work on it at this point, but would be happy to support you otherwise (reply to 51127)

Suraj Yadav | Decentralized Guild: We will try our best (reply to 51130)

Dmitrii: i need message builder functions (reply to 51124)

Nerses: In my contract, funds are deposited, and I want to lock a fixed amount specified by the depositor (msg.amount). How can I send back the remaining amount (ctx.value - msg.amount - all paid fees) ? I used the following code:  nativeReserve(myBalance() - ctx.value + msg.amount, 0);  send(SendParameters{     to: sender(),     value: ctx.value - msg.amount,     mode: 0,     body: Excesses{}.toCell(), }); However, it doesn't seem to work. What could be the issue?

/B4ckSl4sh\: Use nativeReserve + SendRemainingBalance (reply to 51149)

B74849🤬🤬: Guys, how to track tonconnect/ui-react events, by type like in tonconnect/ui? I've already broken my head

Bohdan: give the link please (reply to 51160)

B74849🤬🤬: https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html (reply to 51163)

— 2025-01-10 —

Nerses: i used the method like you mentioned             nativeReserve(myBalance() - ctx.value + msg.amount, SendRemainingBalance);              send(SendParameters{                 to: sender(),                 value: ctx.value - msg.amount,                 mode: 0,                 body: Excesses{}.toCell(),             });  but it threw error 5 (integer out of expected range) . here is the tx https://testnet.tonviewer.com/transaction/38adfcebeeb42aaa7a39f643afd315cd8f0c4b5eddc9aa7aa3e0f4ffbde2cfc4    I think it occurs because of behavior Beware, that all message sending functions of Tact can change the actual contract’s balance, but they won’t update the value returned by this function. . what you think of this ? (reply to 51157)

/B4ckSl4sh\: I think that you misunderstood my message. Native reserve is good, leave it untouched. Just send a message with SendRemainingBalance, not SendRemainingValue (reply to 51209)

Nerses: got it thanks a lot (reply to 51211)

{ дүние } ақырет: Guys, Hello everyone! I need the help.  How can I compare two strings and check how many the chars are same in the same indexes?  Btw I am creating the smart contract, which will be like "Quiz Contract", which have the answers and should check how many answers are correct and send it, like the message.   If you have some advices or suggestions, I'll be feel well.

Nerses: is it good practise to hard code storage fee in smart contract ? or is there better way to make message sender to pay for storage fees ?

Nerses: I need to modify my contract so that the user pays for the storage fees, and the remaining value is sent back to them. How can this be achieved (perhaps using myStorageDue())? Currently, I use the following code to return the remaining value:  send(SendParameters{     to: sender(),     value: 0,     mode: SendRemainingValue | SendIgnoreErrors,     body: Excesses{}.toCell(), });  However, in this setup, my contract ends up paying for the storage fees. How can I fix this?

/B4ckSl4sh\: In any case, storage fees will be payed from your balance (reply to 51223)

/B4ckSl4sh\: SendRemainingValue should work correctly in this case (reply to 51223)

Nerses: I have an idea to use nativeReserve and myStorageDue so it will be payed by message sender (reply to 51224)

/B4ckSl4sh\: SendRemainingValue will handle it (reply to 51226)

Nerses: I will try it out now thanks (reply to 51227)

Nerses: seems that version doesnt work . here is the tx https://testnet.tonviewer.com/transaction/05f7086b40e3af52c7288fe758623437c7dc8f26b289be5884f4e9e1133c27bd  it take out as much from contract balance as the storage fee is (reply to 51227)

Nerses: here you can see that balance of contract was 1 ton before that sent message after it balance is reduced as much as storage fee need to be paid for sending the message

/B4ckSl4sh\: Hm, let me check (reply to 51230)

Nerses: you can pm me in case you need any additional info (reply to 51231)

/B4ckSl4sh\: If user will send bounceable message to you, it should work correctly (reply to 51230)

/B4ckSl4sh\: Don't ask me why - I don't know

/B4ckSl4sh\: I think even guys from TON Core don't know why does it work like that

Nerses: and it is super strange (reply to 51237)

/B4ckSl4sh\: I know. But it is 100% true https://github.com/ton-blockchain/ton/blob/ea0dc161639ef2640876d6de06f7224ac5873847/validator/impl/validate-query.cpp#L5553-L5571 (reply to 51238)

Nerses: @AntonTrunov maybe you know why it works so ?

Nerses: here for a lil bit context (reply to 51235)

/B4ckSl4sh\: I asked TON Core about it, maybe someone will share why does it work like that))))))))))) (reply to 51242)

Nerses: I have tested.Yeah it worked like you mentioned previously (reply to 51244)

/B4ckSl4sh\: But you can fix it anyway. Just nativeReserve storage fee in case of unbounceable message arrived (reply to 51245)

Nerses: I tried but wasnt able to do that. What you think using nativeReserve will keep more funds in case of bounceable message ? (reply to 51246)

/B4ckSl4sh\: Hm, but I don't exactly know how to check in Tact if the incoming message is bounceable (reply to 51246)

/B4ckSl4sh\: @Gusarich any ideas?

Nerses: I used nativeReserve(mybalance() + storageDue(),0)  but it threw exit code 37 (gas error) (reply to 51246)

/B4ckSl4sh\: Well, that is the solution too. Not ideal, but still a solution (reply to 51249)

/B4ckSl4sh\: MyBalance() includes incoming message value (reply to 51252)

/B4ckSl4sh\: so something like nativeReserve(myBalance() + storageDue() - context().value, 0) should work (reply to 51252)

Nerses:         nativeReserve(myBalance() - context().value + myStorageDue(), 0);          send(SendParameters{                     to: sender(),                     value: 0,                     mode: SendRemainingValue | SendIgnoreErrors,                     body: Excesses{}.toCell(),                 }); used that and send bouncable message again the issue raised.🤦‍♂️ (reply to 51255)

/B4ckSl4sh\: Well, you can throw in case of unbounceable message ahahah (reply to 51256)

/B4ckSl4sh\: Or just ignore it

/B4ckSl4sh\: Your contract will freeze only on -0.1 TONs

Nerses: the problem is that the contract is created for swaps.so having such issue means that someone else will pay instead of others (reply to 51260)

BAKU: Hello everyone, what could be the problem? More precisely, what do errors 9 -130 mean when sending a transaction to a contract, the money comes in but returns automatically with these errors

/B4ckSl4sh\: Hmmmmm, maybe you should add one more myStorageDue in case incoming message is unbounceable (reply to 51256)

/B4ckSl4sh\: I still don't know how to check it in tact thought (reply to 51264)

/B4ckSl4sh\: @NersesA try context().bounced (reply to 51265)

/B4ckSl4sh\: Maybe it is misspelled idk, should be bounce, not bounced  Or you can parse manually from context().raw (reply to 51266)

Nerses: I will try now (reply to 51267)

Илья: Hi all, please tell me what can be the problem. If I leave the message Slice, then why the error 9 Cell underflow comes out. But if I remove it, everything is normal and there are no errors.  message code: message (0x972c818e) SendTokens {     timestamp: Int as uint64;     amount: Int as coins;     signature: Slice; }  send message: def get_send_jettons(contract_address: str, transfer_fee: int, jettons_amount: int):     timestamp = int(time.time())     signature_data = begin_cell().store_uint(timestamp, 64).store_coins(jettons_amount).end_cell()     signature = sign_message(signature_data.hash, bytes.fromhex(PRIVATE_KEY))     signature_cell = begin_cell().store_bytes(signature).end_cell()     data = {         'address': contract_address,         'amount': str(transfer_fee),         'payload': urlsafe_b64encode(             begin_cell()                 .store_uint(0x972c818e, 32)                 .store_uint(timestamp, 64)                 .store_coins(jettons_amount)                 .store_slice(signature_cell.to_slice())                 .end_cell()                 .to_boc()         ).decode()     }          return data

BAKU: ? (reply to 51263)

Daniil: first thing that comes to mind is parsing in_msg_full cell (reply to 51250)

/B4ckSl4sh\: Yeah, but how that can be retrieved in Tact? (reply to 51273)

Daniil: sadly, context() only has a slice of this cell with bounce flag skipped. and as far as I know incoming message is not stored anywhere else (reply to 51274)

Nerses: is there any differences on signing and signature verifying between wallet version w4 and w5r1 ?

/B4ckSl4sh\: Afair yes, message for v4r2 won't fit for W5 (reply to 51280)

Nerses: is there any solution for that ? for example to make applicable one version signature for another (reply to 51283)

/B4ckSl4sh\: Why do you need that? (reply to 51285)

Nerses: User signs of chain and signature is verified on smart contract.That worked previously when I used w4 wallet but same code doesn't works for w5 (reply to 51287)

/B4ckSl4sh\: I still don't really understand (reply to 51288)

Nerses: I used script to sign message (wallet w4) that message should be verified by contract so that it will know specific user has signed it.All that worked in w4 but now in wallet w5 it doesn't work.I mean signing with wallet w5 (reply to 51292)

— 2025-01-11 —

Alex: Good day. I have a question, a number of transactions in the application can sometimes fall under the category of suspicious. The question is, can the choice of the programming language of the bot that uses the smart contract for transactions affect the quality of operations? That is, for example, my bot is written in Python and some transactions have a suspicious sign. However, if I write Here in JavaScript, this sign disappears. Can this really make sense, or is it still a matter of the operation and organization of the transactions themselves in the Tact FanС language.. and the choice of programming language for the Bot does not matter?

/B4ckSl4sh\: All you mentioned does not matter at all (reply to 51346)

Alex: Ok, but why the suspicious transactions appear? Only, because neural network of ton-network dreams about some internal parameters or frequency my transactions? (reply to 51350)

/B4ckSl4sh\: TON itself does not know anything about how suspicious your transaction is. Tonapi/Tonviewer somehow determines, does it look suspicious or not (reply to 51352)

— 2025-01-12 —

Anton: @braglop the working language in this chat is English and the chat is moderated strictly to make it a useful place for all devs of any origin, so I removed your discussion in Russian.   To answer some of your concerns: - there are production contracts written in Tact, for instance GasPump. The language is growing in terms of adoption: a lot of contracts on verifier.ton.org are implemented in Tact; - you can check the WIP Jetton implementation written in Tact here: https://github.com/tact-lang/jetton. It is WIP because we want to implement a few features based on modern TVM instructions. We are using this contract as a benchmark to improve gas consumption of Tact contracts, some of those are already implemented and will be released in Tact 1.6, you can check the results in the table here: https://github.com/tact-lang/jetton/wiki#gas-benchmark-results - TON Studio is building many useful Tact contract templates, like Jettons, NFTs, simple DEXes, for devs to make it easier to build on TON with Tact

Mikael: Hello!  I try to calculate jetton wallet address of the smart contract inside it  And do it using   struct JettonWalletData {     status: Int as uint4;     balance: Int as coins;     ownerAddress: Address;     jettonMasterAddress: Address; }  // And the function to calculate the wallet address may look like this: fun calculateJettonWalletAddress(     ownerAddress: Address,     jettonMasterAddress: Address,     jettonWalletCode: Cell ): Address {      let initData = JettonWalletData{         status: 0,         balance: 0,         ownerAddress,         jettonMasterAddress,     };      return contractAddress(StateInit{         code: jettonWalletCode,         data: initData.toCell(),     }); }  I took Cell from explorer, which i received using get_jetton_data, but when i passed it to  ``` jettonWalletCode: Cell = "CODE_FROM_EXPLORER" ``` I received error   How to convert data from exlorer to Cell inside Tact?

/B4ckSl4sh\: I don't understand what you are trying to do (reply to 51559)

SweetJesus: He wants to take jetton wallet's code boc in hex from explorer and convert it to cell inside the contract. (if I got it right) (reply to 51568)

/B4ckSl4sh\: Hmmmm, not a usual task actually) But I think this can done like asm fun getCell() {B{*your boc*} B > boc PUSHREF}

— 2025-01-13 —

Семен: If you want to calculate Tact contract address via init code + init data you need to add system cell to init parameters  afaik tact implicitly add additional parameters to init data (contract constructor)  Recently I came across with it and solved like this (link) In short init data will be something similar to this:  let init = beginCell() // Implicit Tact init data .storeRef(SYSTEM_CELL) .storeUint(0, 1) // Jetton wallet init data .storeAddress(master) .storeAddress(owner) .endCell()   I didn’t find in docs recommended way to solve similar issues. Maybe it bad practice (reply to 51559)

Vincent: hihi how to handle the message of a bounced message: eg:     bounced(msg: bounced<SomMessage>) { msg.count = 0; }  I just want to set this data but I cannot do it due to compile error. Anyone can give me a hand?

/B4ckSl4sh\: Why do you want to modify data from incoming message? (reply to 51614)

Vincent: I have two smart contract A and B, the external user send a message to A, A then forward the message to B, then B bounced the message to A, In the smart contract A , I want to return the ton to this external user. If I use sender(), I don't think it will be right becasuse the sender() is now B. So I want to decode from incoming bounced message from B and get the address of this external user. (reply to 51615)

Vincent: In this case, handling the bounced message from B, I don't know whom to refund to.

/B4ckSl4sh\: It is impossible, as bounced message contain only 255 bits of original message (address occupy 267) (reply to 51616)

Ivan: Hi everyone! I'm encountering an issue with the Tact Language in VSCode.  Getting multiple "Request textDocument/definition failed" errors with the message "Cannot read properties of undefined (reading 'body')".  Has anyone faced this before or knows how to resolve it?  Any help would be appreciated.

Anton: looks like an instance of this issue: https://github.com/tact-lang/tact-vscode/issues/43 (reply to 51625)

— 2025-01-14 —

Anton: The plugin author fixed the issue. Can you please check this release solves it for you? (reply to 51625)

Nerses: Is it possible for a contract to not have an init() function?

Georgiy: You could skip it if you initialized all the fields in their declarations. (reply to 51702)

Nerses: thanks a lot (reply to 51703)

Ivan: just updated, and everything seems to be working fine. thanks! (reply to 51686)

cubby: Are you looking for a developer right now? I am available to discuss any project.

— 2025-01-15 —

LC💎: Hello, how to solve the problem of showing unverified tokens?

Nerses: what security issues can arise having same queryId for multiple tokenTransfer messages from same contract ?

Nerses: in case in same contract I do more than one token transfers can their querId s be same ?

/B4ckSl4sh\: Query_id does not matter at all. You can set this value in anything you want (reply to 51772)

Nerses: in docs it is stated that queryId is for preventing replay attacks.Thats why I thought it would be issue (reply to 51781)

/B4ckSl4sh\: Can you point out where it is stated? (reply to 51782)

Nerses: https://docs.tact-lang.org/cookbook/jettons/#sending-jetton-transfer:~:text=%3A%20JettonTransfer%7B-,//%20To%20prevent%20replay%20attacks,queryId%3A%2042%2C,-//%20Jetton%20amount%20to (reply to 51783)

/B4ckSl4sh\: That is not true. Docs will be corrected (reply to 51784)

/B4ckSl4sh\: @novusnota42 (reply to 51784)

Nerses: thanks for clarification (reply to 51785)

grachzy: Hi all. How do I implement "set_code" in tact to change the contract code after a deploy?

/B4ckSl4sh\: idk maybe this is already in stdlib, but you can always do  asm fun setCode(code: Cell) { SETCODE } (reply to 51804)

Skuli: Hi all. I recommend testing using Cursor IDE when programming smart contracts. Today I made a contribution in which I wrote ready-made system promts that improve interaction with AI.  https://github.com/tact-lang/tact-template/pull/42

Skuli: It searches for all errors in the code automatically until it fixes your code. It looks very cool. (reply to 51806)

— 2025-01-16 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Hi everyone! I'm looking for a cheap way to generate a unique index_id in tact. I have 3 factors: start_time and end_time which are uint32 also process_mode which is 1-5 uint8. I want to create unique index based on these factors so I can address my master contract to right child contract, same as NFT collection and NFT Item but data-based index

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I tried hashing combined string using sha256, but it is expensive. (reply to 51822)

Anton: I’d probably just combined all the bits together into a number with bitwise operations (shifts, | and `&`) (reply to 51822)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Ah, Due to the need for code transparency for users I missed this one. awesome, thanks for solution.  Then, Can we cast bits to a cell to construct a struct from it? I mean  `typedStruct.fromCell(index_bits.toCell()) (reply to 51828)

/B4ckSl4sh\: Why do you need that? (reply to 51833)

Anton: this look a bit too complicated, can you share your typedStruct definition? (reply to 51833)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: A 3rd contract needs to receive it as structured body: struct TaskData {   mode: Int as uint8;   start_time: Int as uint32;   end_time: Int as uint32; } (reply to 51834)

/B4ckSl4sh\: And index_id will be (for example) mode << 64 | start_time << 32 | end_time (reply to 51836)

/B4ckSl4sh\: But I am not sure about the priority of this operations, so better to use braces) (reply to 51837)

Anton: would something like this work?  TaskData {   mode: mode,   start_time: start_time,   end_time: end_time }.toCell()

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: I was looking for a way to cast bits to a struct. well, i'd do it with inline shifting. thank you (reply to 51839)

Dr Crypto: How do I start building a smart contract on ton network?

Masud: Read docs

Super kid: How can I deploy smart contract on testnet?

Super kid: How can I active testnet  in extension wallet?

/B4ckSl4sh\: for example like this  https://github.com/tact-lang/jetton/blob/main/sources/contract.deploy.ts#L16  But it is not the only way (reply to 51851)

BAKU: help solve the problem( when scanning qr, payment for jetton deployment is not called

Denis: Hey! Is there a reason why such var types are not mentioned in the doc?  struct VarIntegers {     a: Int as varint16;     b: Int as varint32;     c: Int as varuint16;     d: Int as varuint32; }  I found this in doc. And also vscode extension marks this as an error

Oleg: What vscode extension are you using? (reply to 51862)

Anton: These are not released yet. It’s a part of the upcoming Tact 1.6 release  @novusnota42 take a look please (reply to 51862)

Я̨kov: Yup, they will be described soon.  That said, current Tact docs don't feature them at all — there's no struct VarIntegers there :) (reply to 51865)

Skuli: Hello everyone, does anyone know where there is a guide on installing this repository locally on my computer? I want to test it locally to add some contributions related to templates, but it doesn't start for me. I use Node.js version 22 https://github.com/ton-org/blueprint  I get an error when installing its dependencies anyway.

/B4ckSl4sh\: I can't see which exact module is missing (reply to 51879)

Skuli: U need console?  PS C:\Users\legov\OneDrive\Documents\GitHub\blueprint> npm install                                                                                     npm warn cleanup Failed to remove some directories [ npm warn cleanup   [ npm warn cleanup     '\\\\?\\C:\\Users\\legov\\OneDrive\\Documents\\GitHub\\blueprint\\node_modules\\protobufjs', npm warn cleanup     [Error: EBUSY: resource busy or locked, rmdir 'C:\Users\legov\OneDrive\Documents\GitHub\blueprint\node_modules\protobufjs'] { npm warn cleanup       errno: -4082, npm warn cleanup       code: 'EBUSY', npm warn cleanup       syscall: 'rmdir', npm warn cleanup       path: 'C:\\Users\\legov\\OneDrive\\Documents\\GitHub\\blueprint\\node_modules\\protobufjs' npm warn cleanup     } npm warn cleanup   ], npm warn cleanup   [ npm warn cleanup     'C:\\Users\\legov\\OneDrive\\Documents\\GitHub\\blueprint\\node_modules\\protobufjs', npm warn cleanup     [Error: EBUSY: resource busy or locked, rmdir 'C:\Users\legov\OneDrive\Documents\GitHub\blueprint\node_modules\protobufjs'] { npm warn cleanup       errno: -4082, npm warn cleanup       code: 'EBUSY', npm warn cleanup       syscall: 'rmdir', npm warn cleanup       path: 'C:\\Users\\legov\\OneDrive\\Documents\\GitHub\\blueprint\\node_modules\\protobufjs' npm warn cleanup     } npm warn cleanup   ] npm warn cleanup ] npm error code 1 npm error path C:\Users\legov\OneDrive\Documents\GitHub\blueprint\node_modules\@tact-lang\compiler npm error command failed npm error command C:\WINDOWS\system32\cmd.exe /d /s /c node .husky/install.mjs || true npm error node:internal/modules/cjs/loader:1252 npm error   throw err; npm error   ^ npm error npm error Error: Cannot find module 'C:\Users\legov\OneDrive\Documents\GitHub\blueprint\node_modules\@tact-lang\compiler\.husky\install.mjs' npm error     at Function._resolveFilename (node:internal/modules/cjs/loader:1249:15) npm error     at Function._load (node:internal/modules/cjs/loader:1075:27) npm error     at TracingChannel.traceSync (node:diagnostics_channel:315:14) npm error     at wrapModuleLoad (node:internal/modules/cjs/loader:218:24) npm error     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:170:5) npm error     at node:internal/main/run_main_module:36:49 { npm error   code: 'MODULE_NOT_FOUND', npm error   requireStack: [] npm error } npm error npm error Node.js v22.11.0 npm error "true" �� ���� ����७��� ��� ���譥� npm error ��������, �ᯮ��塞�� �ணࠬ��� ��� ������ 䠩���. npm error A complete log of this run can be found in: C:\Users\legov\AppData\Local\npm-cache\_logs\2025-01-16T17_22_45_390Z-debug-0.log PS C:\Users\legov\OneDrive\Documents\GitHub\blueprint> (reply to 51880)

/B4ckSl4sh\: Check docs.ton.org (reply to 51884)

Zewa 🧻: Found in docs such code:  // _ value1:int256 value2:int256 value3:int256 ^[value4:int256] = SomeValue; struct SomeValue {     value1: Int as int256;     value2: Int as int256;     value3: Int as int256;     value4: Int as int256; }  AFAIK ^[value4:int256] is a ref to Cell with value4:int256. But why in this struct it looks as non-ref data?

mohammed hummed: Okay (reply to 51889)

cubby: Are you looking for a developer right now?  I am available to discuss any project.

Erfan: clean npm cache and delete yarn.lock file if it's not getting fixed try installing with yarn maybe it will help (reply to 51879)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: open task manager, in the process tab look for node. you can use search bar too. then right click on each one » end task. remove node_modules and package-lock.json then try with command npm ci  also, windows 10 has a issue with long addresses, move it to root of your drive (reply to 51881)

— 2025-01-17 —

Anton: Tact tries to provide an abstraction for you. It does automatic serialization / deserialization for you (reply to 51888)

Rohit: I used Blueprint to deploy a Tact contract, and after that, I ran the npx blueprint verify command to verify it.    I received a message stating:   > "Contract verified successfully"  Here is the link where the contract code is displayed:   https://verifier.ton.org/EQAQj9K6L6M-ihdtQpAxydp8p7MyWMvvwLpSF-5E8YR-m6DA  However, on TonScan the contract still shows as unverified:   https://testnet.tonscan.org/address/kQAQj9K6L6M-ihdtQpAxydp8p7MyWMvvwLpSF-5E8YR-mxtK  If anyone knows the solution, please help.

Anton: You might just have to wait a bit and if the issue persists contact the support of TON verifier and/or TonScan (reply to 51921)

Anton: ⚡️ Added AI prompts for Cursor and Windsurf to tact-template  Did you know, that there's a tact-template that comes pre-configured to kickstart your new Tact projects?  It is much slimmer than the Blueprint-based projects, and focused only on Tact: it includes the compiler, Sandbox-based Jest tests, and basic scripts and utils to get you started in no time!  🪄 And now, with the help of a community contributor, it also has neat system prompts designed specifically for AI-focused editors like Cursor and Windsurf. Utilize them to gain an edge over competition and aid yourself with prototyping smart contracts.  ⚠️ That said, be mindful of the use of AI and make sure to thoroughly test and debug your smart contracts. Funds won't protect themselves 😅  🧑‍🍳🎉 Community contributor: Skuli Dropek 🐙 Implementation: #42 ✈️ Delivered: tact-template  🍲 the 's' in ai stands for security ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Anton: Thanks @skulidropek for that contribution! ⚡️⚡️ (reply to 51806)

Skuli: I also want to say that I have a huge number of GPTs related to TON. Maybe they will be able to help someone someday.  I fed them github repositories and documentation https://chatgpt.com/g/g-tFkVOWIoi-tact https://chatgpt.com/g/g-JmOvRQjNJ-telegramminiapps-tma https://chatgpt.com/g/g-Cyv2cXdN7-twa-dev-sdk-react-mini-apps https://chatgpt.com/g/g-Ww0389l2W-ton-sandbox https://chatgpt.com/g/g-TeOFnhTjH-ton-core https://chatgpt.com/g/g-0NyA6wyRC-tactvscode https://chatgpt.com/g/g-mAVi1YFrO-misti https://chatgpt.com/g/g-674d6f4925108191817170dc91cb0a50-telegramui  Right now I'm aiming to update the blueprint repository and add system prompts for all templates. (reply to 51924)

Rohit: Okay Thanks (reply to 51922)

djan: hello, folks, the jetton notification message‘s structure and encoding are fixed, right?

grachzy: Can you tell me where to set supply as a number? In the master contract?

Я̨kov: Jetton (token) supply? In the JettonMinter, by sending it a Mint message. See this for example message, which is sent here  @B4ckSl4sh double-check me, pls :) (reply to 51939)

/B4ckSl4sh\: You are 100% right. Supply is automatically updated on Mint and Burn operations (reply to 51946)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: can I get some hint from you to optimise my output please? thanks in advanced  extends inline fun packData(self: TaskData): Int {   return (self.mode << 128) | (self.start_time << 96) | (self.end_time << 64) | (self.round_id << 32) | (self.seqno); }  inline fun unpackData(index: Int): TaskData {   let mode: Int = (index >> 128) & 0x7;   let start_time: Int = (index >> 96) & 0xffffffff;   let end_time: Int = (index >> 64) & 0xffffffff;   let round_id = (index >> 32) & 0xffffffff;   let seqno: Int = index & 0xffffffff;    return TaskData {     mode: mode,     start_time: start_time,     end_time: end_time,     round_id: round_id,     seqno: seqno   } } as you see, current output size is 128+8.  is there any way to reduce it to 128? (reply to 51837)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: here is my struct: struct TaskData {   mode: Int as uint8;   start_time: Int as uint32;   end_time: Int as uint32;   round_id: Int as uint32;   seqno: Int as uint32; } (reply to 51961)

/B4ckSl4sh\: Idk, maybe you don't need 32 bits dor round_id and seqno (reply to 51962)

/B4ckSl4sh\: Also I don't know what does mode mean. Does all 8 bits are used?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: its an int between 1 to 5 (reply to 51964)

/B4ckSl4sh\: So 3 bits are enough (reply to 51965)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: and end_time, is unix timestamp, do you think 28 is enough to calculate only the remain from start time?  max value is 1 year or 31556926 secs  I mean end_time = start_time + remain (reply to 51966)

/B4ckSl4sh\: If end_time is duration, you definitely can save some bits there (reply to 51967)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: thank you so much (reply to 51968)

— 2025-01-18 —

B74849🤬🤬: hi, is it possible to change the format of the displayed address in tonconnect/react? the address is correct, but in a different format than in tonkeeper

Andrew: How do I use nested maps?  Allowance: map<Address, Int>; allowances: map<Address, Allowance>;

Andrew: how to type a alice

Andrew: How do I define an alias?

Andrew: Could someone please provide me with a token demo? Thank you very much！

Anton: you can wrap a map into a struct like so:   struct AllowanceMap {     unbox: map<Address, Int>; }  contract NestedMaps {     get fun test(): Int {         let allowances: map<Address, AllowanceMap> = emptyMap();         let allowance = AllowanceMap { unbox: emptyMap() };         allowance.unbox.set(myAddress(), 42);         allowances.set(myAddress(), allowance);         return allowances.get(myAddress())!!.unbox.get(myAddress())!!;     } } (reply to 51996)

Anton: there is a docs page showing how to interact with Jettons: https://docs.tact-lang.org/cookbook/jettons/   and a WIP implementation of Jetton contracts in Tact: https://github.com/tact-lang/jetton (reply to 51999)

Andrew: Thank you! Can you please provide me with a token demo?

Andrew: How do I use the Tact language to interact with USDT originally written in FunC? For example, how to transfer USDT?

Anton: I already gave you the link, check the examples (reply to 52012)

Andrew: Why doesn't this use a map like ERC20? Instead, it uses contract JettonWallet with WalletExitcodes, GasConstants { balance: Int as coins;. Is it because each person's contract is independent?

Anton: because TON blockchain’s architecture is very different from Ethereum, https://tact-by-example.org explains it somewhere here https://tact-by-example.org/06-parent-child (reply to 52015)

Игорь: hi guys! i have found out that about 75% of transactions from my wallet were bounced  have you any idea why?  I worked a lot with eth and ton seems a bit creepy to me

Zewa 🧻: Hey! I'm a bit confused while working with maps. @ton/core  let cell = slice.loadRef(); let map = Dictionary.loadDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell(), cell.beginParse())  And it works with the map I have.  But with tact   struct MapStruct {     m: map<Int as int32, Cell>; } ... let cell = slice.loadRef(); let map = MapStruct.fromCell(cell)   I'm getting exitCode: 9.  Maybe I'm doing something wrong? 🙂 Are there way to loadDict without temp Struct?  I've also tried to call func load_dict with ext function and seems like there are no errors while parsing:  (slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT"; ... @name(load_dict) extends mutates native loadDict(self: Slice): Cell; ... let mapCell = cell.beginParse().loadDict(); dump(mapCell);

— 2025-01-19 —

B.: Hello, guys! I hope you are doing well!  Can you help me please, I need the example of the code, which     (1) will receive the message     (2) check is the amount of TONs enough for proceed     (3) send the remaining amount (if is exist)  The sender should pay for storage and operation fees.

Ivan: Hey everyone!   Need help with jetton deposits implementation. Here's my setup:  - Game contract deploys jetton master contract, mints tokens and transfers them to game's wallet (to ensure tokens are only accessible through gameplay) - Initially players can participate by paying only gas fees and earn tokens through gameplay - After initial phase ends(maybe 2 or 3 months), players need to deposit tokens to participate - Each player has a Child contract tracking their balance - Using standard jetton implementation in Tact  What's working: - Token transfers FROM game contract to players - Child contracts tracking balances - Initial free participation phase  The core issue: How to detect when players send tokens back to the game's wallet? Need to know: 1. When tokens arrive and who sent them 2. The exact amount received  The balance update logic is ready - just need help with detecting incoming jetton transfers.  Thanks! 🙏

Dmitrii: check for JettonTransferNotification message  msg.sender, msg.amount (reply to 52122)

Ivan: You mean my game contract, as the owner of the wallet contract, will receive the JettonTransferNotification message (if I implement this receive method)? (reply to 52129)

Dmitrii: yes, check web for examples (reply to 52134)

Dmitrii: https://tact-by-example.org/07-jetton-standard (reply to 52134)

Ivan: I'm such a noob - the answer was right there in the comments 🤦‍♂️ Thanks a lot! (reply to 52136)

Ivan: // 0x7362d09c - notify the new owner of JettonToken that the transfer is complet🤦😂

Skuli: Here is an example of code, you could use it to generate such code AI ( https://t.me/tactlang/51923 )  import "@stdlib/deploy";  contract MessageHandler with Deployable {     owner: Address;     requiredAmount: Int as uint64;      init(owner: Address, requiredAmount: Int) {         self.owner = owner;         self.requiredAmount = requiredAmount;     }      receive("processMessage") {         let ctx: Context = context();          // Ensure sender covers required amount         require(ctx.value >= self.requiredAmount, "Insufficient TONs provided");          // Calculate remaining balance after required amount         let remaining: Int = ctx.value - self.requiredAmount;         // Deduct storage/operation fees if necessary         let storageFee: Int = ton("0.01"); // Example storage fee         let operationFee: Int = ton("0.02"); // Example operation fee         let totalFees: Int = storageFee + operationFee;          // Ensure fees can be paid         require(remaining >= totalFees, "Not enough remaining to cover fees");          // Calculate final refund amount         let refundAmount: Int = remaining - totalFees;          // Send refund to the sender if any balance remains         if (refundAmount > 0) {             send(SendParameters{                 to: ctx.sender,                 value: refundAmount,                 bounce: true,                 mode: 0             });         }     } } (reply to 52087)

Finance/Software: Anybody know how to, set your token name, because I actually did before I deployed this contract, but it’s showing unknown which I guess is the default token name

/B4ckSl4sh\: I think that may work if you won't do loadRef first, maybe the right way is do do MapStruct.fromSlice(slice) (reply to 52040)

— 2025-01-20 —

B.: Can you help me?  Is this code below do the same thing          let ton_before = (myBalance() - context().value);          let storage_fee: Int = (self.storageReserve - min(ton_before, self.storageReserve));  that do this function  let debt: Int = myStorageDue();  or not?

Andrew: Please someone can tells me?How can I call another contract's get function within a contract?

Anton: https://docs.tact-lang.org/book/contracts/#getter-functions (reply to 52197)

Vlad: And there is an opportunity in Tact to get initOf(smth.fc) of the contract?

Vlad: I want to receive USDT payments on .tact contract

/B4ckSl4sh\: Afaik no, you should build stateInit yourself (reply to 52220)

Vlad: Can you provide please a little Example? How can i calculate address of contract BOC or hash? (reply to 52222)

/B4ckSl4sh\: @name(get_sbt_item_code) native getSbtItemCode(): Cell;  asm fun cellHash(cell: Cell): Int { HASHCU }  inline fun getStateInit(index: Int): Cell {     let data = beginCell().storeUint(index, 64).storeSlice(address("UQBAmIBdInKmGzdTUMay9fqq8nyCZ9jnUh_yBFEE_cfediVD").asSlice()).endCell(); //TODO replace collection address.     return beginCell().storeUint(0, 2).storeMaybeRef(getSbtItemCode()).storeMaybeRef(data).storeUint(0, 1).endCell(); }  fun calculateNftAddressByIndex(index: Int): Slice {     return beginCell()         .storeUint(4, 3)         .storeInt(0, 8)        .storeUint(cellHash(getStateInit(index)), 256)         .endCell()         .beginParse(); } (reply to 52225)

B.: receive(msg: SendQuiz) {         require(!self.locked, "re-entrancy detected");         self.locked = true;          require(context().sender == self.owner, "only the owner can send a quiz");         require(self.is_initialized, "contract not initialized");          send(SendParameters{             to: msg.quizAddress,             value: 0,             bounce: false,             mode: SendRemainingValue,             body: msg.answers,         });          self.locked = false;         emit("Quiz sent to \(msg.quizAddress) by \(context().sender)".asComment());     }   Does it make sense to use pope locked in this receive or not. The AI ​​just says something like an attack can be carried out and it works like a mutex. But the code it generates (I didn't insert it here) is a completely different case in my opinion.  Can you help me?

/B4ckSl4sh\: No, it does not make sence as transactions in TON are atomic. And two messages will not be processed at the same time (reply to 52260)

B.: Thank you so much! (reply to 52273)

— 2025-01-21 —

j: help me, how can i call smart contract in web?

Adam: use ton sdk

Adam: or use get methods with any api

Adam: depends what you mean by call

Adam: if a call that need gas than use sdk

Adam: if doesnt need gas use liteserver with the get method

/B4ckSl4sh\: transactions also may be sent using http api (toncenter/tonapi, etc) (reply to 52318)

Adam: yeah you just need to sign it (reply to 52322)

油饼: Is there an example of a Tact contract code that interacts with USDT? I don't know how to import the USDT contract code for verification. (reply to 52010)

Adam: get method to the jetton master (reply to 52327)

油饼: thank you very much, What I mean is, when deploying the contract, how can I obtain the USDT code, which is the code cell, to use as a parameter for stateInit? The USDT code is written in FunC language. (reply to 52328)

Adam: You wan to calculate the jetton wallet inside the func ?

Adam: Here is it for usdt

油饼: Do I need to first compile the USDT contract code into BOC and then import it?

Adam: You can pass it in the transaction you are making (reply to 52330)

Adam: In the message

Adam: Make a cell and load it inside than pass it to the contract with the call message

Adam: But here is the jetton wallet code if you need it

Adam: b5ee9c72010101010023000842028f452d7a4dfd74066b682365177259ed05734435be76b5fd4bd5d8af2b7c3d68

Adam: This the one for usdt (reply to 52339)

油饼: ok, i see, thank you very much

Adam: If you wannit as a cell

Adam: Use this method

Adam: get_jetton_data

Adam: num: 0x5148e3baabcb0  num: -0x1  cell: b5ee9c72010101010024000043800c881fc78d28207072c728a2e7896228f37e17369ae121cb0eef7b4b0385f33310  cell: b5ee9c7201010701007d00010300c00102012002030143bff872ebdb514d9c97c283b7f0ae5179029e2b6119c39462719e4f46ed8f7413e640040143bff7407e978f01a40711411b1acb773a96bdd93fa83bb5ca8435013c8c4b3ac91f400601020005003e68747470733a2f2f7465746865722e746f2f757364742d746f6e2e6a736f6e00040036  It will return this the last cell is the jetton code

Adam: b5ee9c72010101010023000842028f452d7a4dfd74066b682365177259ed05734435be76b5fd4bd5d8af2b7c3d68 for usdt this is the jetton code just load it and pass it to that fucntion (reply to 52341)

油饼: i'm a new noob, how to send the message to usdt master contract through tonhub or other ways? (reply to 52347)

Adam: What message ??

Adam: If you want to check it in web

Adam: Just go in tonviewer to section web

Adam: If you want to do it with js

油饼: thank you, i got it (reply to 52354)

Adam: if you want to get the cell than you can with java script

油饼: which method should i use? (reply to 52357)

Adam: fromHex

Adam: wallet code is

Adam: const UsdtWalletCode = cell.fromHex("b5ee9c72010101010023000842028f452d7a4dfd74066b682365177259ed05734435be76b5fd4bd5d8af2b7c3d68");

Adam: this the cell wallet code you want (reply to 52363)

Adam: this will do (reply to 52363)

油饼: Thank you so much for your patience and for taking the time to help me with my questions. I really appreciate your assistance and support. (reply to 52365)

油饼: I completely understand now.

Adam: You welcome anytime

Илья: Hi all. How can I return the remainder of the contract call, I tried via a separate send call, but as I realized everything goes away the first time this method is called  receive(msg: SendTokens) {         require(!self.stopped, "Contract was stopped");         require(now() - msg.timestamp <= 120, "Request expired");          let msgHash: Int = self.getMessageHash(msg.timestamp, msg.amount);          let isValid: Bool = checkSignature(msgHash, msg.signature, self.publicKey);         require(isValid, "Invalid signature!");          self.queryId += 1;          send(SendParameters{             to: self.myJettonWalletAddress,              value: 0,             mode: SendIgnoreErrors,             body: JettonTransfer {                 queryId: self.queryId,                 amount: msg.amount,                 destination: sender(),                 responseDestination: sender(),                 customPayload: null,                 forwardTonAmount: 1,                 forwardPayload: rawSlice("F")             }.toCell(),         });          send(SendParameters{             to: sender(),             value: 0,             mode: SendIgnoreErrors + SendRemainingValue,             body: Excesses{}.toCell(),         });     }

Anton: might be the issue described here: https://docs.tact-lang.org/book/send/#outbound-message-processing (reply to 52369)

Adam: can you clarify the issue ? (reply to 52369)

Adam: pretty sure you it doesnt have leave enough gas for second one to  send

Илья: Yeah, it can be

Илья: How does SendPayGasSeparately work? (reply to 52370)

Adam: it will be the msg.amount + gasfee if using this method (reply to 52374)

Илья: Fee of first send

Adam: without it the gas fee will be taken from the amount itself (reply to 52375)

Илья: O (reply to 52378)

Илья: I just have a question: how do I accurately calculate what amount of ton to send to issue tokens and what amount to return (in bounce message)?

Adam: normally even without that the normal token contract after issuing tokens it will send the remaining (reply to 52380)

Adam: responseDestination: sender()

Adam: the remaining will be sent here (reply to 52382)

Илья: it's just that the tonkeeper doesn't indicate that I got anything back.

Adam: send the tx if you can

Adam: ill check it

Илья: иthat's why I didn't realize what was going on

Илья: https://tonviewer.com/transaction/1090935419031c601f95b3deda2f229f8687f879777747dde950d18ca9019c8d?utm_source=tonkeeper

Adam: yeah check the tree transaction

Adam: you will find excess is send back to you in the end

Adam: well guess we are a like , ton devs with no jobs lmao (reply to 52392)

User<956256389>: Any smart con dev and full-stack devs here? Pm me please!

User<956256389>: dm (reply to 52402)

— 2025-01-22 —

油饼: hello, can help me to solve this problem?

Byebye: Hello, how i can send bulk/multiple transaction ?

Anton: The address field does not fit into the 224 bit limits for bounced messages, because addresses take up 267 bits (reply to 52448)

油饼: How can I solve this problem? For example, a user sends a message to Contract 1, Contract 1 sends a message to Contract 2, Contract 2 bounces the message back to Contract 1, and then Contract 1 returns the amount to the user. (reply to 52452)

油饼: Do I need to temporarily store the user address in the Contract1? (reply to 52453)

Adam: You can manage that with op code (reply to 52453)

Adam: The contract 1 needs to open the body of the bounced message

Adam: Check it’s a bounce

Adam: Oh I see where is the problem we dont have the address of the sender

油饼: My current approach is to temporarily store the user address in a map within Contract 1, and then retrieve and delete it after the bounce. I'm not sure if this approach is reasonable. (reply to 52458)

Adam: It will the up the fees alot (reply to 52459)

Adam: Because it will storage fee with tx too

油饼: Could you give me some reasonable suggestions? (reply to 52461)

User: Is that possible to avoid bounce in your contract 2 and just send it back to user address? (reply to 52453)

User: Why it can be bounced?

Adam: I dont think contract 2 it’s his contract (reply to 52463)

Adam: If it was his contract he can just manage it there

Adam: Is contract 2 yours too?? (reply to 52462)

油饼: yes ,it's mine.  Contract 1 is the main contract that records total data, similar to the main contract of a jetton. Contract 2 is a user-specific contract used to record the user's exclusive data, like a sub-contract of a jetton. The user sends a staking message to Contract 1, which deploys Contract 2 for the user and confirms whether the user has already staked. If the user has already staked, it does not allow the user to stake again and refunds the amount. (reply to 52467)

Adam: That simplifies things alot (reply to 52468)

油饼: I understand now. It's reasonable and practical to use Contract 2 to refund the amount to the user, right? I hadn't thought of that. Thank you very much for your suggestion. (reply to 52469)

Adam: contract MyContract {     bounced(msg: bounced<MyMessage>) {         // ...     } } (reply to 52468)

Adam: use this on contract 1 this allows you to process bounced message that was sent form contract 1

Adam: and get the adrress from the message

Adam: so instead of storing the address in the contract storage store it in the message and if bounced process the bounced message and send it back to user

油饼: can't bounce address in bounced message (reply to 52452)

油饼: the address size is too big

Adam: I see than send the message to contract 2 and make it non bounceable

Adam: then proccess the error on contract 2

油饼: Yes, I understand now. Thank you for your suggestion. (reply to 52482)

Adam: You welcome any time

Adam: nice (reply to 52487)

BAKU: Tell me which option is correct?Or is there an example?

Adam: They are all correct (reply to 52492)

Adam: Just make sure you retrieve in the contract the right way

Kelp1e: hi, does anyone have chats for TMA development?

Anthony: https://t.me/devs (reply to 52497)

BAKU: How to call a smart contract correctly? like this for example if the contract already exists

Yavər: use TonClient4 (reply to 52499)

BAKU: are there any working examples? (reply to 52500)

Smart: if the wallet is inactive, it sends all back to smart contract, how can i avoid this?

/B4ckSl4sh\: send unbounceable (reply to 52502)

Yoka: Did anyone see that DMD is down to $1? Do you think this is a good point to buy?

Алексей: Is https://github.com/tact-lang/ton-opcode stable?  I tried to decompile contract EQCh2S-2BhZPZcQaHT4rqlRpEkO6G4PVUwTCKuKtOebA9cAx, it fails with error: Error: Unknown opcode: b1111001011101

Yavər: search in google + there are a bunch of tutorials you can find in youtube (reply to 52501)

Yavər: this is developers chat not about to investment (reply to 52505)

/B4ckSl4sh\: We are supporting it, but it is actually far from perfect : (. Let me check your opode (reply to 52507)

/B4ckSl4sh\: This opcode is not implemented yet. But I will add it asap. Thank you for the report! (reply to 52507)

BAKU: For example? Where exactly do we call the contract? I need it so that when a person connects a wallet and a transaction occurs, I need it to say CONTRACT CALL instead of transfer (reply to 52508)

Yavər: you need to make your own Smart Contract and deploy it to blockchain, look at these videos (reply to 52514)

Skuli: I don't know if this will help you, but you can use chatgpt to brainstorm your ideas. Just always check the information it gives you.  https://chatgpt.com/g/g-tFkVOWIoi-tact (reply to 52514)

Yavər: yeah, its working proper, I used it to convert Func to Tact, normal gpt didn't make correct translation, but it did it with little bit issue. (reply to 52520)

Skuli: For this you can use tact-template + cursor  https://t.me/tactlang/51923 (reply to 52522)

Adam: Coool

Yavər:  // external message receiver, which responds to off-chain message "hello, it's me"     external("hello, it's me") {         // can't be replied to as there's no sender!         self.counter = 0;     }  When I try to send external message on Testnet I got an error like this:  AxiosError: Request failed with status code 500  But other functions works correctly: sendIncrement, deposit and I sent TON coin to smart contract, that mean it has enough coin to gas fee.  export async function run(provider: NetworkProvider, args: string[]) {     const ui = provider.ui();      const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Main address'));      if (!(await provider.isContractDeployed(address))) {         ui.write(`Error: Contract at address ${address} is not deployed!`);         return;     }      const main = provider.open(Main.fromAddress(address));      const counterValueBefore = await main.getCounter();      console.log("counter before external:", fromNano(counterValueBefore));      await main.sendExternal("hello, it's me");      console.log('ID', await main.getId());      const counterValueAfter = await main.getCounter();      console.log("counter after external:", fromNano(counterValueAfter)); }

Yavər: okay, cool that mean you know what is my mistake in here (reply to 52539)

Yavər: . (reply to 52537)

Skuli: this is full error? (reply to 52537)

Skuli: Have you tried transferring funds there through the Tonkeeper client and getting this message? (reply to 52537)

Yavər:  receive("reset counter"){         self.counter = 0;         dump("External CAlled");     }      // external message receiver, which responds to off-chain message "hello, it's me"     external("test") {         // can't be replied to as there's no sender!         acceptMessage();         send(SendParameters {             to: myAddress(),             value: ton("0.05"),             bounce: false,             mode: SendIgnoreErrors,              body: "reset counter".asComment(),         });     } - I added the acceptMessage function and its worked properly but then its going to infinite calling

Yavər: I'm trying just send External Message to the Contract (reply to 52548)

/B4ckSl4sh\: You should prevent same message execution by yourself (in external receivers). Thats how TON works (reply to 52556)

Yavər: its called once in external (reply to 52558)

Yavər: I need to stop it in blockchain

/B4ckSl4sh\: Check how it is done in wallet contract (reply to 52560)

Yavər:     message ExternalReset {         seqno: Int as uint32;     }       exMessageCurrentSeqno: Int as uint32;       external(msg: ExternalReset) {          require(msg.seqno == self.exMessageCurrentSeqno, "Seqno is Invalid!");          // Accept the external message         acceptMessage();          self.counter = 0;         self.exMessageCurrentSeqno += 1;          commit();     }  Fixed!

— 2025-01-23 —

BAKU: Friends, help me, I'm tired already, or give me specific information, I use everything I can, I can't make a contract call, more precisely, when I want it to be written instead of send when I connect the wallet and call the transaction, I can't find the contract CALL information, AI WRITES NONSENSE, no need to be smart about it, just help me please, or give me information

Adam: What you need? (reply to 52609)

BAKU: When transferring money, instead of Send, write Contract Call (reply to 52610)

Yavər: what do you do, explain step by step (reply to 52611)

Dmitrii: the jettonWallet address on owner can be computeg alogrithmically (reply to 52328)

Adam: Yeah ik just show her how to get the jettonwalletcode (reply to 52614)

Adam: To compute any jetton wallet address algoritimacally

BAKU: make a joke that for my business I have a store and I want to make gifts for my workers, the logic is that my contract can create a coin, a random amount, and when a person connects his wallet, he should have a contract call written and not just send, the logic of the contract is already written and everything works, you send him an amount and it gives a random amount of coins, but still I can't call it, the button is on the site where my workers will go (reply to 52613)

BAKU: I found a picture on the internet, it should probably look like this

Adam: I can make that contract for you easily (reply to 52617)

Adam: And contract call is just a normal message

BAKU: in what sense? I'm learning for myself, I need understanding, not an order (reply to 52619)

Adam: Well you need to create a contract using func or tact

Adam: This contract have a logic when it receives a message it send an randint of tokens

BAKU: is there an example at all? in 2 lines at least for my understanding I've been sitting over this for a week (reply to 52620)

Adam: What language you are using to code the contract?

BAKU: tact

Adam: Tact , func or tolk?

Adam: Okey (reply to 52626)

Adam: Let me send you the documents for the parts you need

Adam: https://docs.tact-lang.org/cookbook/jettons/#sending-jetton-transfer

Adam: You will need the Jetton code you can store it in the contract local storage before deploying

Yavər: npm create ton@latest (reply to 52617)

Yavər: you need to make this (reply to 52618)

Yavər: search in youtube how to make tact contract

bukobabs: Hello, I am trying to send "TokenNotification" during "TokenTransferInternal" at mint operation. Calculated fee for "Jetton Notify · 0x7362d09c" operation at testnet is greater than 0. Is this expected? I think it has 0 fee at mainnet.

Bohdan: Is it possible to check if the contract has been deployed? For example, I have Conract A and want to interact with Contract B, but I want to know that Contract B is deployed before the interaction. Is it possible to do in tact?

/B4ckSl4sh\: Is the contract B written by you? (reply to 52655)

Bohdan: yes

Bohdan: actually I create it with initOf()

/B4ckSl4sh\: Just send correct bounceable message, if you receive bounce -> contract is not deployed (in most cases) (reply to 52657)

/B4ckSl4sh\: Maybe you just want to attach state init in any case? (reply to 52658)

/B4ckSl4sh\: Sending stateInit to deployed contract does nothing (reply to 52660)

Bohdan: how to do it? (reply to 52660)

/B4ckSl4sh\: sendParameters have "code" and "data" fields iirc (reply to 52662)

Bohdan: got it, thanks

cubby: Are you looking for a developer right now?   I am available to discuss any project.

Zewa 🧻: Hey! Probably a silly question 🙂  I have a contract that dump(uint256) in loop. and I'm getting -14 error code after 15 iterations.  I'm using blueprint and in the test I increased deploy and reciever nanoToncoins amount to value: toNano('2000.00'), but still getting only 15 dumps and then exitcode: -14.  What I'm doing wrong? 🙂

/B4ckSl4sh\: 0.4 Ton is the limit you can use on gas in one transaction. Want to consume more? Send a message to yourself and continue spending gas ) (reply to 52675)

Zewa 🧻: Thanks :)

— 2025-01-24 —

djan: Friends, can you help me? I have Contract 1, where users can stake a certain amount each round. Contract 1 continuously generates revenue and periodically calculates dividends based on the proportion of the players' staked amounts, then enters a new round. To address the issue of unlimited user growth, I designed Contract 2 for each user, but I don't know how to solve the problem of infinite growth of dividend historical data. Can you give me some reasonable suggestions?

Adam: Using ft (reply to 52707)

Adam: fingible tokens will allow you to store nothing but still kmow who staked and how much they stake

djan: What I mean is that I want users to actively claim their earnings, but the amount they can claim is determined by their staked amount and the earnings, which are dynamic. I don't know how to store the earnings data for each round. (reply to 52709)

djan: I originally wanted to design a Contract 3 for the earnings, but since the earnings are calculated, users cannot determine the address of Contract 3 when they claim their earnings. (reply to 52710)

Adam: you can store it in interanal storage of contract but I dont recomment that (reply to 52710)

Adam: the best way is when a person stake either genrate a proof of stake and store it somewhere in your local data

Adam: or for each stake for exemple let's say they staked 50000 token issue for them 50,000 staked-token like how lp work

Adam: like that there is nothing to store uk how mucch they staked just by how much staked-token they own

djan: Okay, thank you very much. I'll first understand how this mechanism works. (reply to 52715)

djan: Is there any open-source code for liquidity staking mining on the TON blockchain that I can study? (reply to 52715)

Adam: I don't think so (reply to 52718)

Adam: you can check in dedust they their contracts

Adam: I am working on one anyways I ll make it open source as soon as I finish it it will solve the storage issue (reply to 52718)

Adam: 🚀 Staking Made Scalable! 🪙  Hey everyone! 👋  Here’s a small idea for a staking contract using the Jetton principle it took me some time to apply . Here are the keyfeatures:  Scalability: Each Jetton wallet tracks its own staking data, solving the problem of storing infinite dividend history. 📊 How it works: 1️⃣ Stake TON → Master contract mints staked Jettons and keep the staked ton. 2️⃣ Withdraw → Burn Jettons, get TON back and get data from your jetton wallet to calculate reward .  Simple, efficient, and perfect for scaling! Let me know your thoughts!  Check my git so you can read the contract:   https://github.com/Vodka2134156/staked-TON/   Thanks for motivations  Note :In my contract I stored just date of staking you can store more data of staking and the contract is detected as token so people will be more familiar with it (reply to 52718)

Adam: Note: this is not liquid staking this time lock staking , staked ton or token can t be moved through wallet, this is just a solution for pool staking contracts needing alot of storage (reply to 52732)

Adam: can be turned into pool staking you need to remove the restriction in the contract and not record the time on the contract (reply to 52735)

djan: Thank you very much for providing the source code for me to study. I will carefully read through the project's code and master the relevant knowledge of TON smart contract development. (reply to 52736)

Adam: You welcome, sharing is what help chain grow I used this logic on some staking project (reply to 52738)

Adam: the difference is just no stocking data in one main contract but stocking in small contract in case here the jetton wallet contract

Adam: which make it infinitely scalable as the data is decentralised hahaha, we are on blockchain so think decentralized

Adam: that's how tokens can store ifinite amount of holders

Adam: like that you can store infinite amount of stakers token act like a proof of stake in there

djan: Yes, I am slowly grasping the core ideas of the architecture. I need to carefully read the code you provided to gain a deeper understanding of some important development details, such as security issues. Once again, I appreciate your enthusiastic help. (reply to 52744)

Adam: Yeah, no worries. (reply to 52745)

Adam: There are some imperfections as I coded in only 3 hours. If you don’t understand some points just write me a message here (reply to 52745)

djan: Okay， thanks (reply to 52757)

— 2025-01-25 —

AlexOnCrypto - WILL DM FIRST: I like tact

Adam: Same (reply to 52816)

AlexOnCrypto - WILL DM FIRST: Why func looks só ugly

AlexOnCrypto - WILL DM FIRST: Didn't they learned from the SVM

Vladimir: Hey guys! Is there any chance to find lean jetton wallet implementation in Tact? Example implementations accumulate a lot of TON after each transfer and than gradually increases own balance without the possibility of using it: https://tact-by-example.org/07-jetton-standard https://github.com/howardpen9/jetton-implementation-in-tact/blob/8ff4598bceab69a25093cc7147d017275299776d/sources/jetton.tact#L122

Anton: have you tried tact-lang/jetton? It’s still wip but already decent (reply to 52821)

grachzy: Hi all, nft item metadata on getgems is not loading. How to solve the problem? Thanks in advance)  https://github.com/getgems-community-tact/nft-template-in-tact/

grachzy: import { beginCell, contractAddress, toNano, Cell, Address } from "ton"; import { NetworkProvider } from '@ton-community/blueprint'; import { NftCollection } from "../wrappers/NftCollection";  export async function run(provider: NetworkProvider) {     const OFFCHAIN_CONTENT_PREFIX = 0x01;     const string_first = "https://green-real-raccoon-214.mypinata.cloud/ipfs/bafybeiduhdakilkzxtr6ppdogdusrk6qstdanczzhjwqvknfl4lvk5ixqe/";      let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();      let owner = provider.sender().address!;     let collection = provider.open(await NftCollection.fromInit(owner, newContent, {         $$type: "RoyaltyParams",         numerator: 350n, // 350n = 35%         denominator: 1000n,         destination: owner,     }));     await collection.send(provider.sender(), {value: toNano("0.1")}, "Mint");     await provider.waitForDeploy(collection.address); }

— 2025-01-26 —

Adam: Just follow in you json the format that get gems support (reply to 52866)

djan: hello, how to build the mint  message in tact ?

Adam: Sure give me a second (reply to 52908)

Adam: message Mint {     amount: Int;     receiver: Address; } receive(msg: Mint) {         let ctx: Context = context();         require(ctx.sender == self.owner, "Not Owner");         require(self.mintable, "Can't Mint Anymore");         self.mint(msg.receiver, msg.amount, self.owner); // (to, amount, response_destination)     } fun mint(to: Address, amount: Int, response_destination: Address) {         require(self.totalSupply + amount <= self.max_supply, "The total supply will be overlapping.");         self.totalSupply = self.totalSupply + amount; // Update total supply          let winit: StateInit = self.getJettonWalletInit(to); // Create message         send(SendParameters{             to: contractAddress(winit),              value: 0,              bounce: false,             mode: SendRemainingValue,             body: TokenTransferInternal{                  queryId: 0,                 amount: amount,                 from: myAddress(),                 response_destination: response_destination,                 forward_ton_amount: 0,                 forward_payload: emptySlice()             }.toCell(),             code: winit.code,             data: winit.data         });     }

Adam: and define Token Transfer internal Like this

Adam: message(0x178d4519) TokenTransferInternal {     queryId: Int as uint64;     amount: Int as coins;     from: Address;     response_destination: Address;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton }

Adam: this is how to build a mint in the jetton master contract , if you want just a mint message to send to another master contract than just follow the same structure to build the message cell in tact

djan: this message i defined is right? (reply to 52908)

Adam: master message is not needed (reply to 52915)

Adam: minting doesn't need more infors then to address and amount to mint

djan: if no master mesage, the total_supply will be right? (reply to 52917)

djan: I am sending a mint message to another already deployed Jetton contract (written in func).

Adam: In that case you need the master message (reply to 52919)

Adam: store the master msg as a refferencein the main boy

djan: Is it correct to define the Tact structure like this according to the code in the screenshot of Func? (reply to 52915)

Adam: Let MasterMessage:cell =  beginCell()     .storeUnint(randomOp,32))     .storeUnint(Id)     .storeCoins(AmountToMint)     .endCell(); let MintMessage:cell  = beginCell()     .storeUnint(Opcode,32))     .storeAddress(ToAddress)     .storeRef(MasterMessage)     .endCell(); (reply to 52922)

Adam: define master messgae

djan: Okay, I understand. Thank you very much for your help.

Adam: the message above is what you need to send (reply to 52926)

Adam: But the contract needs to be the owner of the jetton (reply to 52926)

djan: Why doesn't the Mint message you constructed here have an amount field? Isn't the mint_tokens function supposed to take the amount parameter? Also, I don't quite understand why the amount and jett_amount variables are separated in the Func code. Aren't they the same?

Adam: this amount is not used for anything and you cant add the amount in the message dirrectly because you must follow what that master contract accepts (reply to 52929)

Adam: It's a smart contract already deployed so you have no choice other then to follow the message structure they are using

djan: okay, thank you (reply to 52932)

Adam: the problem is that if you send amount as parmeter token will be sent to you

Adam: but the total supply will not be updated

Adam: so both you need master message too

djan: Okay, I understand now. I didn't quite grasp the significance of this design before. Perhaps this design offers more flexibility in certain scenarios.

djan: thank you very much

Adam: yeah master message updates the total supply (reply to 52937)

Adam: and the mint message amount is sent back to user

djan: okay

— 2025-01-27 —

onchainwiz 🐐 🍅🐈👾 BITS $X 🦆🐾: Hello everyone, I'm new here

onchainwiz 🐐 🍅🐈👾 BITS $X 🦆🐾: Sorry i need help to understand something

— 2025-01-28 —

Adam: Sure (reply to 53004)

Adam: Hi (reply to 53026)

— 2025-01-29 —

Nerses: How TACT file and contract name can be renamed so it will compiles later ? as just simple renaming causes error "could not determine executable to run"

Anton: It’s not entirely clear what you are asking. How do you run Tact? Do you use Blueprint, tact-template, something else? (reply to 53115)

Nerses: I use blueprint. I used to compile contracts with command npx blueprint build. Is there anything I can describe better so the problem will be clear ? (reply to 53116)

Александр: Maybe problem with .compile file located in wrappers. Make sure that targets include new contracts file name (reply to 53115)

Nerses: You are right,it was the solution.I renamed accordingly in compile files and it worked. Thanks for your help (reply to 53118)

Cyril M |: hi guys, I wanna know if there's a cheaper way to airdrop jetton? right now the estimates shows 7 TON per 100 address. we have like 109,000 address to airdrop and it would cost around 7.6k TON

Cyril M |: how did $Dogs able to airdrop to 2.5m address

Cyril M |: ithat'

Cyril M |: that's 1,750,000,000 TON

Johnny Le: https://t.me/tondev_news/152 (reply to 53142)

Johnny Le: try this

Cyril M |: or $8,750,000,000

Johnny Le: its  Mintless Jettons

Johnny Le: https://docs.ton.org/v3/guidelines/dapps/asset-processing/mintless-jettons#retrieving-airdrop-information

Johnny Le: this is what ur looking 4

Cyril M |: do we have a sample in tact?

Cyril M |: anyone has an example of mintless jetton on tact?

/B4ckSl4sh\: I guess it does not exists now (reply to 53165)

Nikita: Hello, who knows Tact well and can help me fix and slightly adjust my contract? If everything turns out great, I will reward you well. I need some consultation, maybe to refine the code or make some changes.

/B4ckSl4sh\: You can share small piece of code in chat (reply to 53183)

— 2025-01-30 —

grachzy: Hi all, how can I implement in tact to analyze a transaction by asset type (nft, jetton and other crypto assets)? For example, I have a wallet contract called from the main contract, which receives assets from 2 users, the contract analyzes these assets, if they correspond to the declared ones, then the exchange between the users takes place.

Aniruddh: I have experience with Tact and can help fix and refine your smart contract. Let’s discuss the issues and possible improvements. I’m available for consultation and any necessary adjustments. Looking forward to working on this! (reply to 53183)

Adam: You want to make an exchange between two users right ??? (reply to 53195)

Adam: You can either maka contract that do that and deploy it the contract will like a box when bothe users give it the adviced amounts it send the items

Adam: Like a third person who assist the exchange

Adam: Or can be done programtically using the api and checking the later txs

Adam: But the contract approach is safer

Ali: Hi friends  I need help to tact smart contract and nodejs control debug  My transaction jetton transfer inside bridge contract failed

Ali: Please help

Adam: What’s the issue?

— 2025-01-31 —

Nerses: Is there any method to get testnet jettons ? I used ton minter but seems recently it has some problems

Imya: Hello everyone, can anyone help me fix the errors?   1)Property 'getCounter' does not exist on type 'SandboxContract<Firstcontract>'.ts(2339)  2)Argument of type 'string' is not assignable to parameter of type 'Deploy'.ts(2345)

— 2025-02-01 —

Afam: Its better to ask who knows typescript well (reply to 53183)

Skuli: Hello everyone, why does the tact compiler return only one error? (The very first one)  Are you planning to make it return all the errors it finds in the code at once? (reply to 53183)

Anton: yep, we plan to do that, hopefully in the upcoming Tact version 1.6.0 (reply to 53336)

Skuli: Can anyone tell me where I can find the creator's blueprint? I've been waiting for a long time for feedback on my mr request  https://github.com/ton-org/blueprint/pull/170

Anton: I think the maintainer is a bit too busy with other projects (reply to 53338)

Равиль: Hi. Help please. I am sending a usdt token to the contract address, but the smart contract is not included in the TokenNotification function.

Fire: Ensure your contract implements ITokenReceiver, correctly processes Jetton transfer messages with op code 0x7362d09c, includes a valid payload, has enough TON for gas fees, and debug using TON Explorer or CLI tools. (reply to 53407)

Павел: Hello everyone!  I recently read this post https://t.me/nextmayor/655  I found myself in points 1 and 3 (especially about the shit)  And this motivated me to verify smart contracts.  I want to ask the community to "point me in the eye" at the mistakes made.  Well, so that it doesn't get too boring, I'm announcing a very modest Bugbounty https://t.me/krediton_official/18

Равиль: I guess this is because the token notification is not getting through. Skip Reason: cskip_no_gas how can I force you to send a notification? (reply to 53407)

— 2025-02-02 —

/B4ckSl4sh\: Increase forwardTonAmount (reply to 53411)

Ilia: bring 'em (reply to 53409)

— 2025-02-03 —

Nerses: I am using @orbs-network/ton-access  for doing txs and I get this error     data: {       ok: false,       error: 'No working liteservers with ls_index=None, archival=None',       code: 503     } . Has someone else also encountered same issue or know how to fix it ?

Mikael: Error: Malformed response:  Why this error cause during script exectuion? I made npx blueprint run command and selected necessary script and mainnet as a chain

Nerses: I am doing jetton transfer to smart contract and based on jetton notify message forward_payload the contract does some action. After successful transfer in contract accumulates some amount of funds, and I can find out where it comes from. Could someone give a hint what can cause this ?

Nerses: https://testnet.tonviewer.com/transaction/ced543d271a033581b7e969d6ef2e17f1e27c7b09b086c186f1cb18cae4f7741

Nerses: after this tx in contract accumulated 0.078060727 ton

Adam: What causes what?? (reply to 53505)

NEO: hello I have a problem  How can I communicate with jetton master from jetton wallet when a transfer is happening?

Nerses: what causes accumulating  fonds in contract (reply to 53510)

Adam: The forward amount received each jetton transfer has a forward amount and in your case it accumulates on contract and that’s a good thing (reply to 53513)

Adam: Because the smart contract will need to perform some actions so it needs gas too

Adam: With a message?? (reply to 53512)

NEO: yeah but token transfer is a message itself so I need to keep track of its properties like amount and etc but how? (reply to 53516)

Adam: No when jetton wallet receive the message (reply to 53517)

Adam: It will issue two messages one of them to the master contract

Bekzod Muminov: Okay (reply to 53519)

NEO: this is what it looks like (reply to 53519)

Adam: If anyone need a smart contract dev on TON contact me :)

Nerses: How do decentralized exchanges (DEXs) handle fund swaps when a transaction fails? Specifically, if a user sends jettons to initiate a swap, and the swap is processed based on the payload data in the jetton notify message, what mechanisms are in place to ensure that the user's funds are refunded in case the transaction fails after receiving the jettons?

Nerses: Can I obtain jetton wallet address on chain in smart contract in case I receive jetton master address as input message ?

Adam: Yess (reply to 53526)

Adam: Can be caculated using jetton address code and wallet address

Nerses: is it the only approach ? (reply to 53528)

Nerses: as for every jetton to store its code it will be not effective

/B4ckSl4sh\: Sometimes https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md  is available (reply to 53530)

Adam: If i remember it’s already passed in the message (reply to 53531)

— 2025-02-04 —

😉$ E.M: Hello everyone, I am Ehsan from Iran. I am completely new and have no specific information about the Ton network. But I am very interested in learning about it. I am working on blockchain-related mini-applications. And I am interested in spending my time learning the Ton blockchain and in this way, both joining the community of network activists and increasing my Ton amount.

Ester: I'd suggest finding them on youtube. Vladimir Alefman has bunch of lessons to start with, but not sure if it available on English (reply to 53558)

😉$ E.M: Thk👋 (reply to 53559)

Anton: ⚡️ Added a Compilation page to the docs  ❓ Did you know how to use Tact compiler on the CLI and its configuration settings? ❓ Have you ever wanted to easily upgrade the compiler or pin a specific version? ❓ Or have you ever wondered about the build/ or output/ folders and build artifacts produced within them? ✅ Well, look no further — the Compilation page describes it all and more!  See what's in store: ▪️ Compiler upgrades ▪️ Compilation report ▪️ BoC-encoded contracts code ▪️ Contract's package .pkg and ABI .abi ▪️ Bindings and wrappers for simpler deployments, debugging and interactions with deployed contracts  The wrappers are currently only generated for TypeScript, but this may change in the future — stay tuned 😉  🧑‍🍳 Contributor: Novus Nota 🐙 Implementation: #1309 and #1676 ✈️ Delivered: docs.tact-lang.org/book/compile  The image for this post is taken from:  https://xkcd.com/1755/  🍲 don't console my bugs ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Ivan: Hey everyone! I saw the "Work in Progress – DO NOT USE IN PRODUCTION YET" notice on /tact-lang/jetton.  Could you briefly explain the advantages of this particular implementation? Also, how does it compare to other implementations—are there any caveats or issues with them in contrast to this official one?  And is there a production-ready Jetton implementation in Tact that you’d recommend?

Anton: it’s actually almost ready: we would like to introduce some modern gas-related features there but the baseline is good already (although there was no external security auditing so far) (reply to 53575)

Anton: @B4ckSl4sh might probably add some more on the immediate plans

/B4ckSl4sh\: Yeah, audit has not been conducted yet, but according to our internal tests - it should work as expected. After Tact 1.6 release  this implementation will be even closer to reference implementation (reply to 53575)

Ivan: Could you please provide a link to that implementation? (reply to 53579)

Vladimir: Recently, I tried using tact-lang/jetton, but I ran into an issue — each transfer costs around 1 TON. Something is definitely off! 😬 (reply to 53575)

Anton: @B4ckSl4sh could you please check this (reply to 53581)

/B4ckSl4sh\: Can you please provide transaction link? (reply to 53581)

/B4ckSl4sh\: https://github.com/ton-blockchain/token-contract/tree/main (reply to 53580)

Vladimir: https://tonviewer.com/transaction/aa8e2d13c2d530c202f553bd403633bb5a687b8d832194cd898d4ebbe537c45b

Ivan: It looks like this is the Func implementation.🥲  By the way, can I deploy a Func contract from a Tact contract? (reply to 53584)

/B4ckSl4sh\: I will double check this in couple of hours. Can you please upload the jetton to verifier.ton.org? (reply to 53585)

Inquisitor: Who can help or write a contract like GetGems for an NFT marketplace, where each NFT is assigned to a new TON address? I can provide a reward, but it might take some time.

Vladimir: I’m deleted it’s sources already 😓 (reply to 53587)

/B4ckSl4sh\: Maybe you remember what version of tact you've been using? (reply to 53590)

Vladimir: maybe it was in this commit https://github.com/chiliec/Satoshi/commit/25f589a1b7eee0a5cd9a0746a16f60b5a6dad8d5 but I'm not sure and nearest commit with dependencies update is https://github.com/chiliec/Satoshi/commit/da6618f296f177c1fe3a38af431b76e1033ff904#diff-053150b640a7ce75eff69d1a22cae7f0f94ad64ce9a855db544dda0929316519 (reply to 53591)

/B4ckSl4sh\: Are you sure you was using https://github.com/tact-lang/jetton ? Because I know nothing about jetton you shared, it looks like you were using jetton from community (reply to 53593)

Vladimir: I initially wanted to use tact-lang/jetton, but I encountered an issue with it. In the end, I used a combination of different code for my Jetton 🙂 (reply to 53597)

Anton: what was that issue? (reply to 53598)

Vladimir: I saw that transfer fee is ~1 TON 🫢 (reply to 53599)

Anton: I’m sure this is not true (reply to 53600)

Anton: sorry

Anton: there are gas benchmarks in that repo and none of those shows results like yours, actually far away from it

Vladimir: yep, my transaction is confirmed that, it was an error in transaction and emulation before transaction was lied. (reply to 53601)

Vladimir: Ok, sorry for bother you. I'll investigate this issue later

/B4ckSl4sh\: That is the way how tonkeeper calculates "fee". In most cases it means amount of tons you sent minus amount of tons you received (reply to 53601)

Denis: Today I sent the solution to the task for the TON contest. Guys, thanks for the tact-lang, it made my life really better, because func need more time to learn.  Your docs are really helpful, thank you for your work 🙂  Ofc there were a lot of surprises, I don't remember all of them, but for example, there was a bit challenge to parse Merkle Proof cell, because contract just rises exit code 9 and thats all 😄 God bless TVM whitepaper  and your func/asm code import.

— 2025-02-05 —

Kunang: When is the testnet?🙏

Anton: Thanks for your kind words, really appreciate it. Especially given the fact that today is one of the Tact teammates’ birthday :)  We have planned to have native Merkle proofs support in Tact, most likely in v1.7, please stay tuned :) (reply to 53607)

ABCDE: Hello everyone!  I need to store a group of numbers, and it can potentially be very large. Numbers are added via a message from another contract. At a certain point, I need to recalculate these numbers in a loop.  What's the best way to store them? Currently, I'm using a map, but when the number of elements exceeds 300-400, I hit the gas limit. Could serialization be a solution? Or should I manually pack them into storage slots? How can I make this as gas-efficient as possible?

Anton: please check out https://tact-by-example.org/06-parent-child (reply to 53624)

Adam: Storing them in one contract will cause problems cant you store them in small contracts linked to users (reply to 53624)

Дмитрий: Hello there. Is anyone looking for a smart contract developer?

Brendon: Uhhh me?

Дмитрий: Write to me if you need a smart contract (reply to 53683)

Anton: 🚀 Tact v1.5 Audited by Trail of Bits  The security audit for Tact v1.5 has been completed by Trail of Bits, a leading Web3 security firm.  ✅ No high-severity vulnerabilities were found.  🔧 Some bugs and points of improvement were discovered and addressed in a new Tact v1.5.4 bugfix release.  Thanks to Trail of Bits for their thorough review!  The report can be accessed at the Trail of Bits GitHub repo: https://github.com/trailofbits/publications/blob/master/reviews/2025-01-ton-studio-tact-compiler-securityreview.pdf  ⚡️ In the meantime we continue to improve Tact with new language features, gas optimizations (a lot of those lately!), and enhancements to the compiler’s reliability. This ensures a secure and efficient development experience on TON Blockchain.  👉 Upgrade to Tact 1.5.4, if not already: https://docs.tact-lang.org/book/compile/#upgrades  🍲 cooking with great care for performance and users ♨️ @tact_kitchen (forwarded from Tact Kitchen)

— 2025-02-06 —

Traffic Builder: ```javascript import fs from 'fs'; import path from 'path'; import { Address, contractAddress } from "@ton/core"; import { DailyCheckIn } from "../build/DailyCheckIn/tact_DailyCheckIn.ts"; import { prepareTactDeployment } from "@tact-lang/deployer";  // Parameters let testnet = true;                                 // Flag for testnet or mainnet let owner = Address.parse('UQBpWhIopkwTSwbSBQqIfGpgEMEkaOwdw-xtT1YWHosyQLJL');    // Our sample contract has an owner let init = await DailyCheckIn.init(owner);    // Create initial data for our contract  // Calculations let address = contractAddress(0, init);     // Calculate contract address. MUST match with the address in the verifier let data = init.data.toBoc();               // Create init data let pkg = fs.readFileSync(                  // Read package file     path.resolve("./build/DailyCheckIn/tact_DailyCheckIn.pkg") );  // Prepare deploy let link = await prepareTactDeployment({ pkg, data, testnet });  // Present a deployment link and contract address console.log('Address: ' + address.toString({ testOnly: testnet })); console.log('Deploy link: ' + link); ```  got error:  node:internal/process/esm_loader:40       internalBinding('errors').triggerUncaughtException(                                 ^ AxiosError: connect ECONNREFUSED 0.0.0.0:443  at the code "let link = await prepareTactDeployment({ pkg, data, testnet });"

Traffic Builder: Anybody can answer the question,pls?

Adam: Hi , if anyone needs a contract developer contact me.

Traffic Builder: i got it, i need put proxy before command.

Traffic Builder: i got this, and the web page is not changed when i connect the wallet. So what's wrong,sir?

Traffic Builder: i'm trying the testnet of ton

Brendon: I am not a robot

Brendon: You put proxy before command? I

Brendon: Like the word proxy?

Brendon: Or is proxy it’s only other thing

Traffic Builder: oh, it is a vpn.Ya know what I'm sayin.

Traffic Builder: export https_proxy .... && npx tsx --inspect=12345 scripts/deploy.js

Traffic Builder: I've already fixed this problem, but now I've got a new one. (reply to 53742)

Traffic Builder: this is my link,aHR0cHM6Ly92ZXJpZmllci50b24ub3JnL3RhY3REZXBsb3llci9RbVFlTHBtNE1aZXg1S0tvekdSa2F3NHZLTmRLWVZ3WFV2bjNheEc4WnhXU3FOP3Rlc3RuZXQ=

ABCDE: Sure, I create a separate smart contract for each user, and I store these numbers in the user's smart contract. But it takes too much gas to save these numbers in a map, and even more gas to recalculate them. (reply to 53628)

ABCDE: Thank you for your response. I replied above. (reply to 53669)

Adam: Why save them in a map if each user save his ? (reply to 53763)

Adam: The whole purpose of each persopn saving his is to not have a map

Nxrix: can a contract store a string and how long can it be?

Anton: A contract cannot have more than 65536 different cells and one cell can only contain at most 127 ASCII characters. But you will be most likely limited by 0.4 TON gas limit. Also, it’s usually not a good idea to do string manipulations in smart contracts: it is expensive and should be done at the backend side of your dapp, for instance (reply to 53767)

Traffic Builder: When I built the TACT code, I generated this kind of code for the method. Should I call the contract using this approach?

Traffic Builder: const cell = beginCell().store((builder) => {     let b_0 = builder;    b_0.storeUint(1628779796, 32);     b_0.storeStringRefTail("test comment");}).endCell(); await tonConnectUI.sendTransaction({    messages: [         {            validUntil: Math.floor(Date.now() / 1000) + 360,             network: CHAIN.TESTNET,            address: Address.parse("0QA2JQ-j9xCHzaOH76xW5x1mfAy19ZaCPlhpo6MAgAUlR6H5").toRawString(),             amount: toNano("0.08").toString(),            payload: cell.toBoc().toString("base64")         }    ] })  I try to call the contract for the function SignAction1. The transaction is finished. Then I got this.

Traffic Builder: This is my contract code: import "@stdlib/deploy"; import "@stdlib/ownable";  message SignAction1 {     comment: String; }  message OwnerWithdraw {     amount: Int; }  message OwnerWithdrawJetton {     value: Int as coins;     gas: Int as coins;     jetton_wallet_contract_address: Address; }  contract DailyCheckIn with Deployable, OwnableTransferable {     total_count: Int;     owner: Address;      init(owner: Address) {         self.total_count = 0;         self.owner = sender();     }      receive(msg: SignAction1) {         let ctx: Context = context();         self.total_count += 1;         self.reply("".asComment());     }      receive(msg: OwnerWithdraw) {         self.requireOwner();         send(SendParameters{         to: self.owner,         value: msg.amount,         bounce: false         });     }      receive(msg: String){         require(context().value >= ton("0.002"), "not enough fee");     }      get fun totalCount(): Int {         return self.total_count;     }      get fun balance(): Int {         return myBalance();     } } Status Error Timestamp 2025/2/6 19:45:50 Hash c669ccd7bb598ee6de0159559fd82bbcae96a467dda7a8cced83ac3eb35bf9af  Action { "from": "0QC9ZtEFshtb147SC_RSUkUxj392p5f_a9K4kU09fdpVvMRx", "to": "0QA2JQ-j9xCHzaOH76xW5x1mfAy19ZaCPlhpo6MAgAUlR6H5", "event": "call_contract", "source_alias": null, "destination_alias": null, "message": null, "is_external": false, "is_success": false, "is_swapped": false, "is_aggregated": false, "is_bounced": false, "is_service": false, "op": "0x61153514", "tonAmount": "80000000", "amount": "80000000" } This is the error i got.Is there method to get more error info?

Brendon: Deploy ownabke

Brendon: Ownaable

Brendon: Deploy

Brendon: hash: "c669ccd7bb598ee6de0159559fd82bbcae96a467dda7a8cced83ac3eb35bf9af" });

— 2025-02-07 —

Adam: Hi, if anyone needs a smart contract dev dm me

Brendon: I need a smart contract

izayl: new to Tact, anyone known the full name of tact?

Denis: Tact-lang? 🤔 (reply to 53835)

Я̨kov: The Awesome Contract Treasury  P.S.: Officially, Tact stands for TON Actors (reply to 53835)

Adam: awesome

— 2025-02-08 —

Adam: Hi

Adam: can someone fix the docs for accepting nfts in tact it's set wrong?

Adam: https://docs.tact-lang.org/cookbook/nfts/#accepting-nft-ownership-assignment

Adam: this part is wrong

Adam: you are a responsibe please correct the docs , the message struct is wrong here will get people into 136 exit code (reply to 46113)

Jiego: you can always send a PR https://github.com/tact-lang/tact/blob/main/docs/src/content/docs/cookbook/nfts.mdx (reply to 53879)

Adam: Thanks I suggested the improvement there

Adam: Here is the PR :https://github.com/tact-lang/tact/pull/1747

Adam: https://tact-by-example.org/07-jetton-standard is this too editable ?

Adam: it's missing some important message for dedust to work so it will most likely fail in dedust

Я̨kov: Not sure, that website is slowly getting out of date. Moreover, the Jetton implementation given there was a quick hack pulled together by some members of the community and is NOT intended for production use.  At this point, it is only good for presenting many features of Tact at once, i.e. for learning :)   In coming months, we plan on introducing a refurbished version of it, which could feature the proper Tact implementation of the Jetton (currently WIP) (reply to 53901)

Adam: Yeah just saw that thanks again . (reply to 53903)

Adam: Hey guys if anyone needs a dev for smart contracts on TON contact me.😇

Adam: Can you send tx or hash

Adam: Error message are shown just in debugging

Adam: Not in tvm execution

Adam: You can check the tvm steps

Adam: If it fails at a throwif you can check which throwif it failed on

Я̨kov: Unfortunately, transaction can only show you the exit code as a number, not as a string.  That said, see: https://docs.tact-lang.org/ref/core-debug/#require  And https://docs.tact-lang.org/book/compile/#report (reply to 53909)

Я̨kov: Yes, with throw(yourExitCode) or other functions here: https://docs.tact-lang.org/ref/core-debug (reply to 53919)

Adam: It’s not a tact issue (reply to 53922)

Adam: It’s tvm that doesn’t support it

Adam: Throw exit code should do it for you and let’s hope for TVM upgrades they are upgrading constantly

Brendon: I need to talk to someone on the phone…. Have a serious question down wanna type it out (reply to 53890)

Brendon: Please

Brendon: Maybe one of these

Adam: ?? (reply to 53927)

Jiego: ???? (reply to 53927)

Fire: I have some issue with building smart contract on TON network

Brendon: Well you’re gonna have to give me a minute until I can concentrate

Adam: Take your time (reply to 53934)

Jiego: We all do buddy, we all do (reply to 53932)

Anton: GasPump and PixelSwap, for example (reply to 53937)

Я̨kov: They're made by community members, just like you and me :) (reply to 53939)

Я̨kov: Different people prefer different distribution models. I, too, prefer Open Source or at least Source-available, but mileage waries (reply to 53940)

Seva: Are there any examples of binary search or segment tree implementation. Is it possible?

Я̨kov: For one, GasPump's TypeScript wrappers for contracts were obtained with Tact.  About wrappers Tact produces, in general: https://docs.tact-lang.org/book/compile/#wrap (reply to 53944)

Я̨kov: I'm not sure of the purpose, but if you're ok with bigger gas use, you can represent maps as arrays and then do, say, binary search.  https://docs.tact-lang.org/cookbook/data-structures/#array (reply to 53945)

Good: Hello, guys. Is there available contract of battery.ton by Tonkeeper in github or somewhere else? I want to play with it a bit

Я̨kov: FunC-only, but can be rewritten and/or imported in Tact: https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-code.fc  More about importing FunC in Tact: https://docs.tact-lang.org/book/import/#import-func-code (reply to 53955)

Good: Great. Thank you (reply to 53956)

Vlad: Hi, all. I am starting to learn tact. Who can help me with the code of contract deployment?

Good: For tact contract it's optimal to use blueprint. Deploying here (reply to 53963)

/B4ckSl4sh\: I'd say it's not so clear-cut)) I personally prefer  https://github.com/tact-lang/tact-template (reply to 53966)

User<956256389>: Hello everyone friends! There are investors and developers who could help me with the development of a project in which I am sure of 100 percent

Adam: or just npm start latest@ton

Adam: and choose a template

— 2025-02-09 —

Good: Hello, guys. How can I extract public_key as Int from received message to checkDataSignature? Also, is there easy way to make corresponding signature from message payload on ts-client side?

Anton: message Foo {     publicKey: Int as uint256;     … }

Ilia: Or: https://crypto.stackexchange.com/questions/18105/how-does-recovering-the-public-key-from-an-ecdsa-signature-work (reply to 54004)

Ilia: In short - there is a way to recover knowing signature and message hash

Adam: An external or internal message ? (reply to 54004)

Adam: Received message doesnt have by default the pubkey

Adam: Only the adress and value

Adam: You need either to pass it each time in the message itself as Int

Adam: Or do like wallet contract does (save the pubkey in the wallet storage in deployement)

— 2025-02-10 —

Adam: What? You interact with it with the op codes you chose

Ivan: /tact-lang/tact-language-server Thanks for the TACT Extension! Why didn't you announce it? =) 👍

Anton: we are testing it internally now, it still has some rough edges, for instance, it does not have a formatter and it does not report compiler errors yet (reply to 54129)

Anton: we will properly announce it when the plugin gets integrated with the compiler

Anton: thanks for your feedback :)

Anton: if you have some ideas how to improve it or found a bug, please feel free to open an issue here https://github.com/tact-lang/tact-language-server/issues

Я̨kov: However, if you don't have any issues, please leave a positive review so that the plugin becomes more popular in the future ❤️ (reply to 54133)

Anton: hopefully you will like some nice inlay hints, like on the picture

Anton: it tells you the parameter names and also, in this case, the exit code which corresponds to the message string

Ivan: so handy, thanks! (reply to 54135)

Ivan: and finally I can jump wherever I want in a click))

Adam: this is a multisig contract (reply to 54135)

Adam: ?

Anton: yep, this one: https://github.com/tact-lang/tact/blob/main/examples/multisig-3.tact (reply to 54141)

Adam: eyy bad timing just opened a bounty in git about making a multisig contracts , wallet standards ,and nft standards in tact to add to tact-by-exemples hahah I guess bad timing of mine

Adam: ?

Дмитрий: I wanted to inform you that this repository contains an incorrect contract.deploy.ts file. Please, check this  https://github.com/tact-lang/contract-wallet (reply to 54145)

Adam: Can you prcise exaclty what you think is wrong?

Adam: Yeah you are right the initilising of the contract is done wrongly

Adam: You need to initilise the contract with publickey and wallet Id

Adam: the contract is porbably outdated since it was from 2023 and still not solved

Дмитрий: And this repository is closed or it’s deleted  https://github.com/tact-lang/awesome-tact?tab=readme-ov-file#-smart-contracts-examples

Anton: thanks for letting us know

Adam: the repo is outdated with an old wallet contract and wrong initilisings (reply to 54165)

Дмитрий: Maybe you should update repositories that was uploaded 2 years ago and earlier

Adam: to be honest even the actual token standars available on tact is lacking some fundamantals and would be gas heavy and fail on dexes so no point of undating launchpad not alteast token contract is updated (reply to 54164)

Adam: I can do that if it can be added to the exemples? (reply to 54167)

Adam: I would appreciate that actually

Дмитрий: I have work jetton example. It can be listed on DEX (reply to 54168)

Adam: yeah it needed just to opcode provide jetton wallet and another one i dont remember but it's still gas heave tact still need gas optimisation and move on from func building (reply to 54171)

Adam: if you check the build folder and read the func you will fimd out that it's so heavy

Adam: But for now it's all good as tact is improving quite fast

Дмитрий: Can you give me some ideas to example contracts? I want to practice

Adam: Try to make an escrow on tact (reply to 54175)

Adam: for nfts

Adam: I am always down to write contract for comunity to learn

Adam: I am already working on ton-dns impelementation in tact I dont knwo if it's possible to dd them later to the tact exemple , tact-by-exemple contarct are outdated and people needs exemple to learn tact

Adam: If you can guys suggest contract that you want to see as exemple to learn from them I can make them

Дмитрий: Can you talk about it more? (reply to 54176)

Дмитрий: What is escrow?

Adam: For exemple you want to sell me an nft , make a contract that will hold that nft and the person can buy that nft from it for a certain price (reply to 54181)

Adam: you deploy the contract and send the nft to it

Adam: the contract will act like a middle man between seller and buyers

Дмитрий: NFT sale contract?

Дмитрий: I’ve seen ready-made examples somewhere

Adam: Yes in func it is avaialble

Adam: but I dont think in tact

Adam: getgems nft contract

Adam: implement this on tact

Adam: for wallet contarct exemple you think I should adapt which wallet version and revision? (reply to 54186)

Adam: can I get your opinion to Anton , for DNS-ton too? (reply to 54165)

Дмитрий: I think w4r2 is good (reply to 54192)

Дмитрий: Or last

Adam: I just don't want to interact with something if they are already working on it

Дмитрий: I use this version (reply to 54194)

Adam: yeah v4 second revision (reply to 54197)

Adam: It has alot of pluggins that I don't know if they are doable with tact

Adam: You mean the v5? (reply to 54195)

Дмитрий: Yeah (reply to 54200)

Adam: first I will start with correcting this a repo (reply to 54159)

Adam: and if they agree I can try to make the basic func contract available in productuion into TON

Adam: because they require more work

Vlad: Does anyone have a link to minter contract only on tact? https://github.com/ton-blockchain/minter

Adam: Minter contract is not complete on tact I advice to use the func version for the moment (reply to 54205)

Adam: https://github.com/Vodka2134156/wallet (reply to 54194)

Adam: here is a deployable version

Adam: where you can initialise and deploy just corrected the deployement and initialising part

Дмитрий: Good

Дмитрий: I am working on nft sale contract now. Maybe it will be ready tomorrow

Adam: That's good too

Adam: ? (reply to 54221)

Bohdan: hi guys, do your contracts deploy fine on testnet? Because I have some weird error: [TON_CONNECT_SDK] Wallet message received: {   error: { code: 0, message: 'java.lang.NullPointerException' },   id: 16 }

⚡Mohammed: hello every one

⚡Mohammed: I'm working on an application that supports payments via TON Connect SDK, where users can pay for their subscription fees using USDT Jettons through Tonkeeper. The goal is to successfully transfer USDT Jettons from the user's wallet to the bot's wallet, ensuring that the invoice is displayed correctly in Tonkeeper, and the bot receives the payment.

⚡Mohammed: Issues We Have Encountered So Far 1️⃣ Issue 1: "Invalid amount: 0" Error When executing handleTonPayment, we receive the following error:  yaml Copy Edit ❌ Payment failed: [TON_CONNECT_SDK_ERROR] UnknownError Invalid amount: 0 ✅ Solutions We Tried:  Ensured that amountInNanoJettons is correctly calculated (5 USDT = 5000000 nanoJettons). Logged values in the console, and they appear correct: yaml Copy Edit 🔹 USDT Amount: 5 🔹 Amount in NanoJettons: 5000000n Set amount: "0" inside transaction, as the amount is included in payloadBase64, but the error still persists.

⚡Mohammed: 2️⃣ Issue 2: Tonkeeper Displays Invoice with 0 USDT When I set a valid value for amount inside transaction, Tonkeeper opens the invoice successfully. However, the invoice displays 0 USDT instead of the correct amount. When clicking "Confirm Payment", no amount is deducted from the wallet except for network fees, meaning that the actual value is not included in the transaction. ✅ Solutions We Tried:  Passing amount: "0" → Received the error Invalid amount: 0. Removing amount from transaction completely → Received the error No value for amount. Passing amount: amountInNanoJettons.toString() → But Tonkeeper still does not display the correct amount in the invoice. Ensured that payloadBase64 contains the correct amount → But Tonkeeper still displays 0 USDT.

⚡Mohammed: Code Handling the Payment 🔹 createJettonTransferPayload Function to Generate the Payload ts Copy Edit export const createJettonTransferPayload = (recipientAddress: string, amount: bigint) => {     if (!recipientAddress) {         throw new Error("❌ recipientAddress is missing or invalid");     }      console.log(✅ Creating Jetton Transfer Payload for recipient: ${recipientAddress});      return beginCell()         .storeUint(0xf8a7ea5, 32) // ✅ Jetton transfer OP Code         .storeUint(0, 64) // ✅ Query ID         .storeCoins(amount) // ✅ Amount in nanoJettons         .storeAddress(Address.parseRaw(recipientAddress)) // ✅ Recipient address         .storeAddress(null) // ✅ Forward TON address - Not used         .storeCoins(0) // ✅ Forward amount - Not used         .endCell()         .toBoc()         .toString("base64"); // ✅ Convert Payload to Base64 };

⚡Mohammed: Any help or suggestions would be greatly appreciated! 🙏🚀

Adam: beginCell()           .storeUint(0xf8a7ea5, 32)           .storeUint(0, 64)           .storeCoins(toNano(amount))           .storeAddress(Address.parse(recipientAddress))           .storeAddress(Address.parse(recipientAddress))           .storeBit(0)           .storeCoins(1)           .storeBit(0)           .endCell()            .toBoc()            .toString("base64"); (reply to 54235)

Adam: this the right payload to use

Nikita: Who knows how to retrieve all NFTs that are on a smart contract? The smart contract itself ensures that the NFTs it holds are available on the Marketplace. How can I extract these NFTs so they are displayed on the Marketplace?

Adam: Inside the smart contract ? (reply to 54243)

Adam: or off-chain

Nikita: . (reply to 54245)

Nikita: Well, the NFTs are on the contract, so how can I add them to the marketplace on my client? How can I get a list of all NFTs for sale? (reply to 54244)

— 2025-02-11 —

Adam: Yeah you can just call an api on ton api (reply to 54247)

Nikita: And will it return all NFTs even if there are 1000 of them? I don’t understand (reply to 54248)

Adam: See this will return even if there is 1000 item

Nikita: It’s free? (reply to 54261)

Nikita: This is also used on professional NFT marketplaces? (reply to 54261)

Adam: Yes and yes

know: What exactly are USDT Jettons? Is it a way to make smaller denominations of USDT or something more specific? (reply to 54232)

Pedro: That's not the right way to encode to base64 with ton keeper (reply to 54235)

Nikita: What if everything is on different contracts? So each NFT for sale is on a separate contract? (reply to 54248)

Pedro: I can't understand why somebody would use http api to query contracts..

Pedro: Is the contract closed-source?

Pedro: Anyway, through that api endpoint you won't  get all nft for sale, only nfts of a specific account

Nikita: How do? (reply to 54277)

Pedro: you should look for the right endpoint that returns all listings, https://docs.tonconsole.com/tonapi/rest-api/nft (reply to 54284)

P: Why this error occurs if I use @ton/ton at in frontend?

Adam: Define buffer in you config (reply to 54292)

Adam: because google or whatever navigator you have doesnt suppot buffers

— 2025-02-12 —

B.: Guys, Hello! How can I send "Messages with Encrypted Comments".  If op is 0x2167da4b, then the message is a "transfer message with encrypted comment". This message is serialized as follows:  I need specify the op, I think

⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮⁮⁮ ⁪⁬⁮⁮⁮: Hi  Who can help me to fix my Tact code

Anton: hey, you can specify message opcodes using the following syntax:   message(0x2167da4b) MessageName {     messageField1: Type1,     messageField2: Type2,     … } (reply to 54339)

B.: Thank you, so much (reply to 54343)

Good: Ok. Thank you. It works for Ed25519. But it's weird  ecrecover is implemented in tact and I didn't find legal methods in ton's sdks in order to get {r,s,v} from payload and keys. Just {r,s} (reply to 54006)

Adam: what do you need the ed25519 signature verification for (reply to 54380)

Adam: the contract can just store his pubkey at deplyement

Adam: so you dont pass it each time

Good: check the integrity of the payload when sending through an intermediary contract and verify that it belongs to the sender

Good: Ed25519 doesn't allow to check the last, and I just compare ctx.sender with some msg field

Adam: Just sign the message (reply to 54385)

Adam: At last publickkey and signature

Adam: It will be like that

Good: done 2 days ago (reply to 54387)

Adam: .storeref(signedMessag) .store_slice(sig) .storeInt(pubkey)

Adam: This is the message that you can send

Adam: The contract will check signatures with pubkey and signed message

Adam: And then perform actions on signed message

Adam: And you can get ctx.sender from pubkey to compare (reply to 54393)

Good: that's ok. I've managed that recently. Above it's just my feedback about ton's drawbacks

— 2025-02-13 —

Edward: Hi, guys. How to add new sender into deploy typescript? I know the owner sender of tact contract is from WALLET_MNEMONIC in .env file, but don't the logic how it create the network provider. Thank you

Good: smth like that await contract.send(         YOUR_SENDER,         {             value: toNano('0.05'),         },         {             $$type: 'Deploy',             queryId: 0n,         }     ); (reply to 54419)

Edward: i need to know how to get the "your_sender", because i already deploy the tact contract, but just have provider.sender() able to call function send, i want another wallet able to call function, Thanks

Good: This is an example how to open wallet contract. And this is example how to use your sender. Hope, tha's enough to combine. Just use your wallet contract instead of sender

Edward: Ok, thanks

Nikita: Who knows how to implement a contract system for a marketplace where each NFT will have its own separate contract, and I will be able to manage it? That is, a person can list their NFT on the marketplace, it will be stored in the contract, they can retrieve it, and perform similar actions. And someone else can buy it. How can I implement this? Do I need to create smart contracts for this, or is it all somehow handled on the backend?

— 2025-02-14 —

WhyesCode: You will need to create individual smart contracts for each NFT to make this work.  That way, users can list their NFTs, have them securely stored in the contract, retrieve them when needed, and others can purchase them...all handled on the blockchain. (reply to 54455)

WhyesCode: Your backend will manage the user interface and interactions, but the core actions like transfers and sales are best managed through these smart contracts for transparency and security.

S: How I can post a job in this group?

Anton: you cannot post a gambling-related job ad here, sorry (reply to 54477)

S: what about mentorship for an hour?

Jiego: reeks of scam (reply to 54480)

/B4ckSl4sh\: Yeah, looks like this. I will remove it (reply to 54481)

Good: Are there contributors of tonion-contracts here?

Good: I have pr for you

— 2025-02-15 —

Дмитрий: Hello everyone. I have created NFT fixprice sale contract, but it is not tested. Can you take a look at it and give me your feedback in a private message or in this chat? It is important to understand that this is only a draft  https://github.com/Ravvw/nft_sale_contract_in_tact/tree/main  Upd. I would like to add jetton support and some more interesting features in the future

— 2025-02-16 —

⚡Mohammed: Hello TON Community,  I'm getting a "can't decode address transactions" error from the /v2/jettons/transactions endpoint.  Problem: GET request to: https://tonapi.io/v2/jettons/transactions?jetton_address={JETTON_CONTRACT_ADDRESS}&account={WALLET_ADDRESS}  Returns: ```json {     "error": "can't decode address transactions" } Context: Trying to get Jetton payment records for a wallet. Using Jetton contract & wallet addresses as parameters.  Tried:  User-Friendly & Raw formats for WALLET_ADDRESS. Verified JETTON_CONTRACT_ADDRESS format. Addresses valid on explorers. Reviewed API docs, no error info. Questions:  Is /v2/jettons/transactions the right endpoint for wallet payment records? If not, which one is? Correct formats for WALLET_ADDRESS & JETTON_CONTRACT_ADDRESS? Raw WALLET_ADDRESS mandatory? Why "can't decode address transactions" error? Address format issue? API issue? Any help appreciated! I would be very grateful for any help or suggestions to resolve this issue. Thank you in advance for your assistance!

Setmax: Hey guys,  I have this code:   receive(msg: PredictMessage) {     emit(PredictEvent{         eventNumber: msg.eventNumber,         a_1: msg.a_1,         a_2: msg.a_2,          a_3: msg.a_3,         a_4: msg.a_4,          a_5: msg.a_5,         a_6: msg.a_6,         ton_amount: context().value,         user: sender()     }.toCell());      send(SendParameters{         to: self.master,         bounce: true,         value: context().value - self.MinTonForStorage,         mode: SendRemainingValue + SendIgnoreErrors     }); }    I want to send the entire TON amount(0.05) in this message to the master account while keeping some of it for MinTonForStorage.  I’ve tried different combinations of flags and modes, but none of them worked for me. Does anyone have any ideas on how to achieve this?

Anton: hey, we have your exact use case described in the docs: https://docs.tact-lang.org/book/send/#outbound-message-processing  there is an explanation why it does not work and the docs offer a solution (reply to 54548)

ABCDE: Each user has map of numbers (reply to 53765)

Adam: Whoever askzd about ths

Adam: I want to create a token that will also depend on the price of gold (for example, gold is growing my token will also grow, gold falls, the price of my token will also fall) ie just will be partially dependent on gold. I chat gpt made a smart contract I don't think it will be right, so I would like to work with a person who develops his own smart contracts and work with him. I need token only reacts to the rate of gold.

Adam: I cant find your message anymore

🗺️: But this is not how it works (reply to 54555)

Adam: Idk 🤷 (reply to 54557)

Adam: Someone sent me this message

Adam: I replied than it disappeared from my dms

Somyaditya: Hi guys, I am working to develop a smart contract that will handle receiving and withdrawing USDT (Jettons)

Somyaditya: Can anyone provide me some reference please, how can i interact with usdt to initiate the transfers and receive the tokens

Somyaditya: I have good experience in Solidity Smart contracts, but trying Tact for the first time

Adam: Just accept the jetton notification message (reply to 54571)

Adam: If you cant i can make you the usdt handling part

Somyaditya: Could you please share me

Somyaditya: Also how can i call usdt contract to make the transfer

— 2025-02-17 —

Erdan: does https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json update? 'app_name': 'telegram-wallet', 'bridge_url': 'https://walletbot.me/tonconnect-bridge/bridge' Bridge error -> READY_STATE_CONNECTING

Anton: Try searching the Tact docs, there are some examples in the Cookbook part (reply to 54571)

Nerses: I am working on a DeFi project for swaps where the user is responsible for covering all fees, including storage fees. However, there's a challenge when the user wants to swap Toncoin: determining the exact amount they should send and how to handle any excess while ensuring the contract retains only the required amount.  I tried investigating StonFi and Dedust for insights but couldn’t find anything valuable. Does anyone have experience with this or know of a proper approach?

Nikita: Does anyone know how the Telegram gift-selling system in Tonnel works?

maksim: Based on v5 wallet plugins, soon there will be an example of a similar system implemented in Tact (reply to 54606)

Nikita: Really? (reply to 54607)

Nikita: But they are in Telegram, not on the blockchain. (reply to 54607)

maksim: I mean v5 wallet plugins, not the gift-selling system (reply to 54608)

Nikita: Ok (reply to 54610)

maksim: Integration is made through Fragment (reply to 54609)

Nikita: Really? (reply to 54612)

Nikita: How? (reply to 54612)

bb: hello, someone knows how state variables are displayed in tact?

/B4ckSl4sh\: What do you mean by "displayed"? (reply to 54624)

bb: Sorry, I mean expressed

bb: uint variable keeps giving error

/B4ckSl4sh\: Share a minimal example, please (reply to 54627)

bb: totalSupply: uint256 = 10000000000; // 10,000,000,000 tokens     owner: address;     balances: map(address, uint256);

bb: uint erroe, with or without 256

bb: no?

bb: no help?

/B4ckSl4sh\: You are using incorrect syntax for maps (reply to 54629)

bb: I know but I cannot find right one

bb: state {         totalSupply: uint;                  owner: address;                     balances: map(address, uint);      }  this also wrong

Я̨kov: Maybe you've meant:  struct State {     totalSupply: Int;     owner: Address;                 balances: map<Address, Int>; }  Documentation on maps: https://docs.tact-lang.org/book/maps/

Я̨kov: By the way, it seems like you intend to make a large map in a single contract, which goes against the sharding principles and approaches used on TON — to make smaller individual contracts for storing state of the individual user/owner.  For an example of that, see the (WIP!) implementation of Jetton (i.e. Token) in Tact: https://github.com/tact-lang/jetton (reply to 54636)

bb: thank you

bb: I am beginner, maybe too ambitious try...

bb: where do i find a thorough lexicon of FunC language and Tact language?

— 2025-02-18 —

Adam: You want code in tact or func? (reply to 54642)

Rob: Hi guys. I have a very simple counter contract: import "@stdlib/deploy";  contract Counter with Deployable {     val: Int as uint32;     queryId: Int as uint32;      init(queryNumber: Int) {         self.val = 0;         self.queryId = queryNumber;     }      receive("increment") {         self.val += 1;     }      get fun counter(): Int {         return self.val;     } } My question is that how to send a transaction with increment message to the contract using @tonconnect/ui package in Javascript? I have already written the following code. But it shows me fee calculation error. I think there is a problem with encoding payload: const incrementCounter = async () => {         if (!connectedWallet) return;         try {             const payload = btoa("increment"); // Encode "increment" message in Base64              const transaction = {                 validUntil: Math.floor(Date.now() / 1000) + 60,                 messages: [                     {                         address: CONTRACT_ADDRESS,                         amount: "100000000", // Small amount of TON for execution                         payload, // Encoded message                     },                 ],             };              await tonConnectUI?.sendTransaction(transaction);             fetchCounter(); // Refresh counter after transaction         } catch (error) {             console.error("Error sending transaction:", error);         }     };

Pedro: https://docs.ton.org/v3/guidelines/ton-connect/guidelines/preparing-messages (reply to 54670)

maksim: Hi, can you provide error log? (reply to 54670)

Pedro: Check the docs to see how to encode the increment receiver on the frontend properly with the operation code and pass it to tonconnect as base64 like this: payload: increment.toBoc().toString("base64") (reply to 54670)

/B4ckSl4sh\: I guess you need something like  payload = beginCell().storeUint(0, 32).storeStringTail("increment").endCell() (reply to 54670)

KADDECHE 🐾: Hello

KADDECHE 🐾: I am new here I want to learn I coming from binance airdrop ton !? 😊

Pedro: Behnam (reply to 54678)

Rob: According to the documentation the payload parameter should be of type string: const transaction = {     validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec     messages: [         {             address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",             amount: "20000000",          // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove         },         {             address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",             amount: "60000000",          // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove         }     ] } (reply to 54677)

Pedro: Check this comment Behnam (reply to 54678)

Rob: Got it thank you 👍 It should be like this: const payload = beginCell().storeUint(0, 32).storeStringTail("increment").endCell().toBoc().toString("base64"); (reply to 54690)

— 2025-02-19 —

Lols Anti Spam: Steve Hacks, spam is prohibited (spam)

Denis S: Hi, friends   We are looking one dev to complete our team for TON hackathon.  Please DM me if you interested.

User<7171664780>: GM Everyone 👋

Edward: Hi, Guy I have a question about the jetton internal transfer myJettonWwalletInit: StateInit;  receive(msg: Transfer) {    let qid = self.currentWithdrawCounter;    self.currentWithdrawCounter = qid + 1;     send(SendParameters{       to: contractAddress(self.myJettonWalletInit),       value: ton("0.05"),       bounce: false,       mode: SendRemainingValue,       body: TokenTransfer{          queryId: qid,          amount: msg.amount,          destination: msg.receiver,          response_destination: msg.receiver,          custom_payload: null,          forward_ton_amount: ton("0.01"),          forward_payload: emptySlice(),       }.toCell(),       code: self.myJettonWalletInit.code,       data: self.myJettonWalletInit.data,    }); } I create 2 contracts, 1 is jetton token and 1 is function contract, I try to send this receive function, but keep getting actionResultCode: 37(no enough ton or jetton?), I changed the value and forward_ton_amount to higher ton, still display same error.  In the transaction, the transaction process only reached Jetton Transfer, won't go to the next Jetton Internal Transfer and Jetton Notify.   How to solve this problem?

maksim: Hi, are you sure Jetton Wallet contract instance you are sending this to has enough jettons for the transfer? (reply to 54725)

Edward: I test it in ton/sandbox, I already mint the enough jetton, like I mint 500000000000n and I just want to transfer 20000000000n, still getting 37 actionResultCode

Edward: I checked the contract jetton wallet has enough balance to transfer

/B4ckSl4sh\: 37 means you attached not enough TONs. Use fwdTonAmount = 1. (reply to 54728)

Edward: ya, i have added fwdtoamount more than 10 still the same error

/B4ckSl4sh\: I mean try fwdTonAmount exactly 1, not 1 TON (reply to 54731)

Edward: ya, this also tried, set it to 1

/B4ckSl4sh\: You use SendRemainingValue + non zero value (reply to 54733)

/B4ckSl4sh\: Consider setting value of your message to 0 (reply to 54738)

Edward: ok, i will try it, Thanks

WhyesCode: DM me (reply to 54718)

Setmax: receive(msg: PredictMessage) {         nativeReserve(self.MinTonForStorage, ReserveExact);          emit(PredictEvent{          eventNumber: msg.eventNumber,          a_1: msg.a_1,          a_2: msg.a_2,           a_3: msg.a_3,          a_4: msg.a_4,           a_5: msg.a_5,          a_6: msg.a_6,          ton_amount: context().value,          telegram_id: msg.telegram_id,          user: sender()}.toCell());          send(SendParameters{             to: self.master,             bounce: true,             value: 0,             mode: SendRemainingBalance + SendIgnoreErrors         });     }   The initial problem has been resolved. Now, I’m just curious—how can I send the entire amount of TON to the master address while ensuring that the user pays the transaction fee separately? Is this feasible, or should I add some extra fee to the initial TON amount? (reply to 54549)

Adam: Hi if anyone need a ton dev you can dm me, dms are open for ideas and builds

Oleg: Guys, what I should choose as a lang to develop smart contracts on TON: FunC or Tact?

Я̨kov: Previously, I'd say it depends on expected gas-efficiency. However, with the upcoming 1.6.0 release, Tact's gas consumption has really dropped (up to 2.5x reduction in some cases!).  So, pick Tact — you'll learn the basics in a week, and during that time we'll make the final adjustments for 1.6.0 :)  Start here: https://docs.tact-lang.org/#start (reply to 54760)

DeFi Maestro: Hi, I text you. (reply to 54759)

/B4ckSl4sh\: Yeah, gas consumption also depends on code size. But primarly it depends on what opcode you use (and it's amount) (reply to 54768)

Oleg: So Tact is high-level lang or low-level? (reply to 54771)

Petr: High-level (reply to 54772)

— 2025-02-20 —

Barack 💎: Aight (reply to 54780)

Anton: but you can always use `asm`-functions, so low-level at the same time (reply to 54775)

3shadow7: guys , i think of create game , is all code of my game will write in Tact ?

3shadow7: and if my code of the game was a big file , is it will cost me high gas ? or there is a way to keep things out of  block chain !

Я̨kov: Write the game without the blockchain, i.e. off-chain — blockchain fees and throughput are NOT meant for games, but for financial things.  But if you want to, you can keep track of in-game currencies (jettons), awards and achievements (soulbound nfts), or other such things using the blockchain, i.e. on-chain. (reply to 54804)

3shadow7: yeah i mean keep the objects and charctars and func of my game offchain , but things like wards insaid the game will be onchain , or maybe lemted charctars also be onchain as nft , soo is there away to keep some of things offchain and some is onchain , and also there is connect between them ?

Denis: btw, why do you use tact as tranlator to func? is it so hard to compile directly to TVM? (reply to 54762)

Philip: a) for historic reasons prior to any of team members even joining b) keep an eye on future updates :> (reply to 54826)

— 2025-02-21 —

Jack: Hi, How to convert TL-B to Tact Message or Struct, any tools or information is appreciated :)

Jack: I want sendTransfer messages  include internal body

Anton: Hi, there is no such at this time, although the Tact team has plans to introduce it in Q1 or Q2 2025. If you share the TL-B scheme you’d like to represent, we might be able to help you with translation (reply to 54866)

Jack: thank you sir, I don't want to spend your time, I going to research.

Edward: Hi, is it possible to make snake cell in tact?

/B4ckSl4sh\: For text? (reply to 54881)

Edward: for jetton transfer from functional contract to user,  functional contract jetton wallet jetton transfer to user in tact receive(msg: Transfer) {     let ctx: Context = context();     let qid = self.currentWithdrawCounter;     self.currentWithdrawCounter = qid + 1;      send(SendParameters{        to: self.myJettonWalletAddress,        value: ton("0.1"),        body: TokenTransfer{           queryId: qid,           amount: msg.amount,           destination: msg.receiver,                   response_destination: ctx.sender,           custom_payload: null,           forward_ton_amount: 0,           forward_payload: emptySlice(),        }.toCell(), }); self.myJettonAmount =            self.myJettonAmount - msg.amount;  }

Anton: 📝 TON devs — we need your feedback!  Building on TON? Tell us what works (and what doesn’t) in a quick survey on:  • Developing on TON, tooling, programming languages (FunC, Tact, Tolk), TMAs, guides  Fill it out, drop your wallet & claim an exclusive reputation SBT!  Make your voice count.  (forwarded from Society Builders)

Илья: how do you get 67.2% of the amount? In Tact?

Anton: depending on your goals and your data representation it could be something like this:  asm fun muldiv(x: Int, y: Int, z: Int): Int { MULDIV }  contract Foo {     get fun test(x: Int): Int {         return muldiv(x, 672, 1000);     } } (reply to 54889)

Sun☯️: Hi friends ,can anyone help me , I need to do an contract for mint nft , can someone help me with it , maybe existing any ready  examples how to build it ? We with team already tried yesterday an few ways which we found on tact, but after mint picture of NFT is not visualized on getgems🙏

Oleg: What file is required to deploy and call contract after compilation? (without blueprint)

Sun☯️: ((((

Adam: ?? (reply to 54916)

Adam: Why you dont want to use the blueprint?

Oleg: I'm going to deploy this contract many times (reply to 54923)

Anton: you can try tact-lang/tact-template (reply to 54916)

Sun☯️: Yes it's is probably,  I have an nft on ipfs , and need contract to mint it clear (reply to 54921)

Sun☯️: U just deployed your nft there for mint ? (reply to 54929)

Sun☯️: Seems like its easier yes, hmm,  interesting,  thank u   will try (reply to 54930)

Oleg: I don't really understand what it is for, I want to understand which files are required to deploy and call contract (reply to 54925)

Sun☯️: Thank u, but how u user to Add your metadata on getgems ? But using json of nft and colction ?

Sun☯️: Yes, that's without costs, only for deploy ) (reply to 54940)

Sun☯️: Yes, I hope ,someone will see) and will give (reply to 54939)

Adam: Oh use than test (reply to 54924)

Adam: You can try contract behaviors without deploying

Adam: Or if you can use tonconnect deploy

Adam: Like that users just with ton connect can deploy contracts them selves

Oleg: I mean that I'm going deploy this contract many times not to test or something, it is for production.

Nerses: Is anyone familiar with the Fragment project? How secure is it to sell a username there, and how does the process work technically? Lately, I've been receiving multiple messages from people interested in buying my username, and it doesn’t seem like a scam. Can someone provide guidance on this?

Seva: Fragment is quite trustable (reply to 54954)

Nerses: I just cant understand how it is done technically (reply to 54955)

Abrahim: How can I use username

Nerses: I mean the part of swap.Suppose I sell my username and when my wallet accepts funds how my tg handle is changed,is it done automatically or can even fragment have access to my tg account (reply to 54956)

Seva: I think it’s architecture is quite interesting to research and explore, but here we discuss Tact language, and Fragment architecture is a little bit out of the topic. That is my opinion. (reply to 54956)

Nerses: To be frank I agree with you.Just hoped someone from fragment team will react to message (reply to 54959)

Nerses: thanks for assistance

Seva: Anything can happen here. Good journey! (reply to 54960)

— 2025-02-22 —

Seva: Does someone has experience of writing on Tact with Grok 3 Beta? What tips can you give for achieving better results?

Petr: Hey, check rules here: https://github.com/tact-lang/tact-template/blob/main/.cursorrules (reply to 55009)

Skuli: Hi, I don't see the point in using grok as a chat interface via x. I recommend using cursor because it is intended for programming (reply to 55009)

Skuli: Use Cursor + tact-template

— 2025-02-23 —

Jack: hey guys , where are code and init data after compiled

Skuli: ? (reply to 55070)

Я̨kov: The code is compiled to the .boc format, and the data is simply the starting (or initial, hence "init") values for variables in the persistent state of the contract.  https://docs.tact-lang.org/book/compile/#boc  Combination of initial code and data is used to obtain the address of the future contract, to where you send the deployment message with said code & data.  https://docs.tact-lang.org/ref/core-common/#contractaddressext (reply to 55065)

Frz: I have a DAO project that I want to implement on the TON blockchain. This project allows members to earn passive income in exchange for expanding the community and increasing transactions on the TON blockchain. If you need more details, let me know and I can continue.

Ivan: Hi everyone! Quick question, just to be sure:  Am I understanding correctly: During a chain of calls where User1 triggers ParentContract -> ChildContract -> back to ParentContract, can User2 modify the state variable in ParentContract before the first chain completes?  Context: - User1 sets variable to 1 in Parent - Parent sends 1 to Child - Child sends 1 back to Parent - Parent checks if (variable == received)

— 2025-02-24 —

Jack: thank you, it works (reply to 55076)

Seva: In general — yes, because ParentContract is available for the next transaction after sending message to the ChildContract, however you can build the architecture of the smart-contract in a way, that User2 would not be able to modify the state variable in ParentContract before the first chain completes. For example you can implement a counter state variable that's state is updated once the whole chain of transactions is executed (the message from ChildContract came back to ParentContract) (reply to 55126)

— 2025-02-25 —

Andrew: "Hello everyone, how can I obtain DEX swap records by parsing blocks on the TON blockchain?"

Fire: I can help you for that part

Andrew: please give me a demo

Barack 💎: Is this chat same as the other TON chats. The chat dev I were kicks someone for just requesting to know something. This is so sad. You guys should tell us the important thing about this chat groups then because we are here to learn right? I was pissed because I never share anything bad in the group 😡

Barack 💎: If you don’t want people to share insights then make the group only admin exclusive 😤

Dmitry: Hey guys! Do we have a SBT implementation in Tact?

Anton: hey, I haven’t seen one yet, there are some NFT contracts in https://github.com/tact-lang/awesome-tact though (reply to 55191)

Dmitry: I guess SBT is just a regular NFT without transfers, am I right? 😅

Obe: hello everyone i am new here and i was wondering if anyone can point me in the way of study materials i can use for learning ton smart contract programming

Я̨kov: Hello, you can start here: https://docs.tact-lang.org/#start  In addition, take a look at awesome-tact, which has many great resources, tools, guides, and more: https://github.com/tact-lang/awesome-tact (reply to 55216)

— 2025-02-26 —

Alex: I’m getting 135 exit code during contract deploy. Looks like that because I use initOf other contract in init of my contract. Any way how I can solve that? I need other contract to be owner of my contract and I don’t want to pass it as arg in init and I don’t want to use sender() as well

Anton: Could you please share a reproducible example? We have tests with initOf in the init function of a contract, so that is supported (reply to 55239)

Alex: I can’t share example due to NDA. But I figured it out:  I used separate function that returns address of contract:   fun master_addr(): Address{     return contractAddress(initOf MasterV0()); }  once I changed my init to use contractAddress(initOf MasterV0()) instead of master_addr() it started to work (reply to 55243)

Anton: Thanks for sharing. We will try to reproduce (reply to 55247)

Maxim: Hi guys! Is there any way to find out what computeFee is made up of in a specific part of transaction? It looks like one simple operation burns to much gas

/B4ckSl4sh\: you can use dump(getComputeFee()) and then calculate the difference (reply to 55300)

Maxim: difference with what? (reply to 55302)

Maxim: that's actual figures (reply to 55301)

Maxim: Tact compilation failed Error: Static function "getComputeFee" does not exist (reply to 55302)

/B4ckSl4sh\: you can place dump(getComputeFee()) before the place that consumes gas, and after that place (reply to 55303)

/B4ckSl4sh\: https://docs.tact-lang.org/ref/core-advanced/#getcomputefee (reply to 55305)

/B4ckSl4sh\: it should be available (reply to 55307)

Я̨kov: Maybe you're using the older VSCode extension that suggests you wrong things?  Try upgrading the compiler and/or installing different plugins, we recently had a lot of new things published: https://github.com/tact-lang/tact#tooling (reply to 55305)

Maxim: getComputeFee Available since Tact 1.5  maybe I have an older version

Maxim: yep, I have 1.4.3

Я̨kov: Oh, that's a rather old version. Try upgrading it: https://docs.tact-lang.org/book/compile/#upgrades (reply to 55311)

— 2025-02-27 —

Sỹ: Hi eveyone, I need help with following logic  receive() {  // how can I get ton value from incoming message? }

Я̨kov: By calling context().value  See: https://docs.tact-lang.org/ref/core-common/#context (reply to 55344)

Sỹ: Thank you! (reply to 55345)

Anton: we need more context to understand your issue (reply to 55367)

Hung: Hello, I just started developing yesterday, so I have a very beginner-level question.  I can't access the .ton domain network. I carefully read the documentation stating that a specific proxy must be used as a "secret gateway," and I have tried everything—from the proxy provided by Ton Wallet to the connector.exe available on GitHub. However, I still can't connect.  Could it be that my country (or region) is banned?  When I use a proxy and fail to connect in Chrome, I get error codes like ERR_TIMEOUT and ERR_PROXY. When I disable the proxy and fail, I receive a DNS ERROR code.

Z: Hello, are the random numbers obtained by the random method in tact completely random? I checked the documentation and found that func requires seeds, but does tact not?

Daniil: try this one https://github.com/xssnick/Tonutils-Proxy?tab=readme-ov-file#download-precompiled-version (reply to 55382)

Я̨kov: Common functions for random numbers in Tact do not require you to provide the seed: https://docs.tact-lang.org/ref/core-random/  That said, under the hood they do setup the RNG in the same way as it's commonly done in FunC, see https://docs.tact-lang.org/ref/core-advanced/#nativepreparerandom and following functions (reply to 55393)

&rey: Proposition about fundamental limitations for some languages: in Tact, you can't have a single function which'd group querying SBT's data, receiving it and handling it some more (e.g. set loan rate according to past achievements).

Daniil: is it even a good idea to allow doing this in context of TON architecture? (reply to 55398)

&rey: In some proof-carrying languages it might be OK, if you have tools to reason about synchronization. (reply to 55399)

Philip: Let's assume it is. If you understand what was meant, please, explain (reply to 55399)

Philip: oh, I probably understood  you're talking about the case when some linear code executes in context of several contracts (reply to 55400)

&rey: That, and {   let achievement: SBT = ...;   let owner: 'sometime Address = achievement.query_owner().await;   ... } (reply to 55401)

Philip: and it's not only possible, but I thought about it :)

Philip: TVM is a very good target for this

Z: Thanks (reply to 55397)

Philip: I don't think we'll get there in context of our current compiler architecture, but that will change quite soon  I'm very happy that not only I find it annoying to break linear code into contracts (reply to 55400)

&rey: Ohh! That might make my research into Structured Async Language for TON somewhat obsolete)) (reply to 55407)

— 2025-02-28 —

Hung: Already tried not worked. But thanks (reply to 55396)

Sỹ: Hi, if I define a message with some string as input. But I don't store it in contract, would it cost storage fee? If someone send very long string to the contract, how can filter such message. I am aware of require(condition, some_message), can it be used for this purpose?

maksim: You don't pay storage fee's for incoming messages, only if you store it (reply to 55448)

Tiisu: I am a begginer to the tact language. Can someone mentor me

Dmitry: Have you read the doc? https://docs.tact-lang.org/ (reply to 55456)

Tiisu: I am still looking at it (reply to 55457)

Dmitry: Try @hackthetonbot, maybe it will help to solidify your knowledge

Tiisu: Aight. (reply to 55461)

Tiisu: Do you mind if I send you a DM (reply to 55461)

Dmitry: You can post your questions in the @hacktheton chat, it will help others to learn something new

Tiisu: Aight

Don: Hi guys is the a way to make contracts upgradeable in tact?

Dmitry: Yes, but it will require to use assembly function with SETCODE instruction (reply to 55489)

Dmitry: Like that:  asm fun setCode(code: Cell) { SETCODE }

Maxim: Hey, Guys! How to set minimum amount for Tonkeeper transfer? I have defined a check for incoming value, but it doesn't work - it returns an error code, while Tonkeeper still misses this requirement during transaction fee calculation.

Sỹ: Your UI code need to handle that when it send TokenTransfer request. The contract's already checked incoming value and aborted which is correct. (reply to 55498)

Maxim: Absolutely, if I use my own UI I can set the amount of fee to whatever I want. But what if I use Tonkeeper instead of my own UI and just want to send a transaction?

Maxim: Maybe, I could add some fake code, that would generate calculations and increase cost of transaction while Tonkeeper estimates transaction fee (but it shouldn't actually be executed) Any ideas?

Sỹ: Your mesage is custom   format. How can you send it through tokeeper.

Maxim: I would like to send standard message TokenTransfer (0xf8a7ea5)

Sỹ: I think you are sending 10 token , not 10 TON. Maybe add dump(context().value) and dump(msg.amount) before your checks to see what it is.

Maxim: yes, it was 10 TOKENs, not TONs (reply to 55511)

Sỹ: If you don't want to hold ton in the contract then just remove the check.

Maxim: I need more fee to be able to pay for forward messages

Sỹ: Fee is about 0.003 ton or smthing. You can look it up and set proper number. (reply to 55518)

Sỹ: 0.25 is very high

Maxim: I need exactly that much, I have already calculated it practically. In general, of course, you need less, but in my case for some reason if you put less, the transaction does not go through. And with this amount, everything goes through, but at the same time half of this amount is returned as change with TokenExcesses (0xd53276db)

Sỹ: If that's the case, I can't help. Gl!

Maxim: But what if the wallet contract stores a large amount of data and for this the minimum amount of TON on the balance must be 0.25 TON? It turns out that I can't activate such a contract with a simple transfer, since not enough TON coins will be transferred? (reply to 55522)

Sỹ: Sorry, that is beyond my knowledge. I believe you are doing much complex thing than I ever do with TON. (reply to 55528)

/B4ckSl4sh\: Get methods can be called only offchain (reply to 55535)

/B4ckSl4sh\: Usually the best way is to store that address directly, during the deployment (reply to 55541)

— 2025-03-01 —

Anton: 🎉 Tact v1.6.0 is released!  🏆 This is the biggest update of Tact since its creation, bigger than all previous milestones combined. There were so many improvements that we've even won over FunC in terms of gas usage on many standard contracts, such as Jettons. 🤔 Don't believe me? 🥳 Let's unpack Tact v1.6.0 together and see these improvements for ourselves!  We'll start with the number one achievement of this release:  ⛽️ Gas optimization victory over FunC  Gas has long been a major pain point for Tact. Prior to v1.6.0, Tact's gas usage on many common contracts, such as Jettons, was far from ideal, requiring about 2.5 times gas of the FunC reference implementation.  But with Tact 1.6.0, those old gas-expensive days are long gone.  🤯 For example, a Tact rewrite of the reference FunC Jetton code consumes less gas for transfer, burn and discovery messages! 😎 So, expect to receive easy-to-use idiomatic Tact implementations of common contracts in the near future  Some of the things we did to achieve this: ▪️ Removed "system" cell — parent contract code is no longer stored in the system cell with all the child contract codes ▪️ Removed redundant address checks ▪️ Deprecated Deployable trait in favor of receive(){} ▪️ Introduced contract parameters as an alternative to init() function  And optimized compiler internals, many old and new functions in the stdlib:  🧰 Some of the standard library additions and changes  • Added specialized deploy and message functions for efficient on-chain deployments and non-deployment messages respectively • Many math functions, such as divc, mulShiftRightCeil, and others • More advanced functions, such as setGasLimit, setSeed, myCode, and others • Handy throwIf and throwUnless functions, which deprecated their "native" prefixed counterparts • Optimized emptyCell and emptySlice functions • Int.toString function now consumes up to 64% less gas • Int.toFloatString function now consumes up to 62% less gas  Added many functions for Cell, Slice and Builder types: •  Variable integer serialization types and the corresponding .load and .store functions of Slice and Builder types • Functions Slice.hashData and String.hashData for efficient hashes of data only • Functions for working with addresses: Slice.asAddress, Slice.asAddressUnsafe, contractHash, and a new BasechainAddress type its helper functions • ...and more!  🧳 More auxiliary things  • Basic let-destructuring of structs and Messages • Compile-time method ID expressions for getters and Message opcodes • The codeOf expression to get the code of child contracts • More map improvements and new methods, like replace and replaceGet • New augmented assignment operators &&=, ||=, >>= and <<= • Better error reporting for many cases • Generation of constants in TypeScript wrappers • The -w, --watch CLI flags for watching for changes and automatic recompilations • CLI for the Tact's TVM disassembler — unboc • Fixes of the compilation report • Fixes of the compiler's third-party API • Fixes of the internal infrastructure and code generation • Lots of other miscellaneous bug fixes and smaller enhancements • ...and documentation for all of that and beyond!  Besides, check out the updated Awesome Tact list and add your awesome projects, especially those using Tact in production!  ⚠️ Breaking changes  There are only two, and they're both pretty minor:  • Tact 1.6.0 replaces Context.bounced field with Context.bounceable, which tells whether the received message can bounce back or not. Previously, the bounced was useless since any bounced messages would be handled in a separate bounced() receiver.  • The enabledMasterchain option was removed from tact.config.json. Going forward, support of masterchain addresses is always enabled in Tact contracts.  ♥️ Special thanks goes to all the contributors and community members — without you there would be nothing. Let's keep building the future of smart contracts with ⚡️ Tact! 📜 See full release notes for Tact v1.6.0 📥 And upgrade Tact in your projects  🍲 we're beating the gas allegations with this one 🗣🗣🗣 ♨️ @tact_kitchen (forwarded from Tact Kitchen)

Anton: Time to upgrade folks!

Dmitry: If you want to challenge your knowledges - check it out  https://t.me/hacktheton/138

Denis: now tact gas consumption is +- same as using func or there are optimizations that makes it use less gas? 🙂 (reply to 55569)

Anton: Tact now provides some out-of-the-box optimizations that people can also replicate in FunC with some magic Fift techniques. Most optimizations are in the code generator but some requires some planning from the smart contracts dev, for instance, using the new features and stdlib functions like - contract parameters   - Basechain Addresses - deploy and message functions instead of send  We are working on a new page in the Tact docs which provides some guidelines on how to do gas optimizations in your Tact contracts. Will be published next week, stay tuned :) (reply to 55577)

Setmax: Hey Anton, Great job on the upgrade! Do you have an estimated timeline for the contract upgrade feature? (reply to 55578)

Philip: Why estimate if it's already there?  https://docs.tact-lang.org/cookbook/upgrades/ (reply to 55579)

&rey: Is function for converting contract data [onchain] in plans? (reply to 55580)

Philip: I've just created an issue. This will be tough though, and I'm not sure how soon we get there. (reply to 55589)

Andrey: Greate job, guys! Thank you!

Andrey: Does it work correctly? The last time I used this method, it broke address calculations with child contracts. I suspect this is due to the presence of a cell with the contract code itself in the state. (reply to 55580)

Я̨kov: Should be. There's no "system" cell anymore — Tact no longer stores the parent contract code in the system cell with all the child contract codes used in initOf expression. Instead, the myCode function and related instruction are used.  However, if your logic is too complex to lay out flat (some recursive dependencies), then there would be a system-like cell. But in that case, upgrades would be very hard even if it wasn't there :) (reply to 55592)

Amir: Hi everyone,   I’m working on a TON smart contract called PixelSelection and need some help modifying the SelectPixels message handling code. I’ve included the relevant contract and client code below, along with details of an error I encountered. I’d really appreciate your insights on how to fix this and improve the functionality!  Overview of the Current Code  The PixelSelection contract allows users to select pixels by sending a SelectPixels message with a bigPixel value. The contract then extracts up to eachSelected (set between 2 and 25) 3-digit numbers from bigPixel and processes them as pixel selections if they meet certain conditions (e.g., not already selected, within bounds, etc.). Here's the key part of the contract:

Amir: receive(msg: SelectPixels) {     let divisor: Int = self.gameConfig.minValue; // e.g., 1_000_000 for eachSelected = 2     self.safeSend();     require(!self.gameConfig.gameEnded, "Game Ended");     require(msg.bigPixel >= self.gameConfig.minValue && msg.bigPixel < self.gameConfig.maxValue, "Invalid pixel");      let falseNumber = self.gameConfig.falseNumber; // e.g., 9     let remaining = msg.bigPixel % divisor;     let digitsLeft = self.gameConfig.totalDigits; // e.g., 6 for eachSelected = 2     let counter = 0;      let currentTime: Int = now();     let threeDigits = falseNumber;     while (digitsLeft >= 3) {         threeDigits = remaining % 1000; // Extract 3 digits         if ((threeDigits != falseNumber) && (threeDigits < self.gameConfig.totalGamePixels)         && (counter < self.gameConfig.eachSelected) && (!self.isPixelSelected(threeDigits))) {             self.pixelData.set(threeDigits, PixelData{...});             emit(PixelSelectedEvent{...}.toCell());             counter = counter + 1;         }         remaining = remaining / 1000;         digitsLeft = digitsLeft - 3;     }      require(counter != 0 , "No Valid Data Selected");     let total_cost: Int = self.gameConfig.price * counter;     require(context().value >= total_cost, "Insufficient funds");     // Payment processing follows... }

Amir: The client-side JavaScript code sends the SelectPixels message like this:

Amir: const bigPixel = 2; // Test value const messageBody = beginCell()     .storeUint(0x15952fac, 32) // Operation code     .storeUint(bigPixel, 32)   // bigPixel value     .endCell();  await walletContract.sendTransfer({     seqno: seqno,     secretKey: keyPair.secretKey,     messages: [internal({         to: contractAddress,         value: toNano("0.05"),         body: messageBody,         bounce: true,     })] });

Amir: The Problem  I deployed the contract on the TON testnet and tried sending a SelectPixels transaction with bigPixel = 2. However, the transaction failed with an error. Here’s the transaction log:   Timestamp: Mar 2, 2025, 03:14:08 AM Hash: a03289db8f0d117c4e562cc6a3786084b90d51b7134cc5830b1de5a0e92e7f1e  From: 0QBqTfI7lR3GhBY3TCiruGaFdlvsbms9xQ8y4TvmXvhJxa-u To: kQAjskv9ZlomJHwzs4KrEWyluFizhIQTgRlrXnenjznRmdOp  TON Amount: 0.01 TON Op Code: 0x15952fac  Status: Error Success: False   I suspect the issue is related to the bigPixel value or how it’s processed in the contract. With eachSelected = 2, minValue = 1_000_000, and maxValue = 2_000_000, the contract expects bigPixel to be a 6-digit number (e.g., 1_234_567). Sending bigPixel = 2 fails the requirement msg.bigPixel >= self.gameConfig.minValue, which could explain the error.  Questions for Help  Fixing the Input Value: Should I modify the client code to send a valid bigPixel (e.g., 1_234_567)? What’s a good test value for eachSelected = 2 and totalGamePixels = 9? Or should I adjust the contract’s minValue and maxValue to accept smaller numbers like 2?    Improving SelectPixels Logic: The current logic extracts 3-digit numbers from bigPixel and checks them against conditions. How could I simplify this or make it more flexible (e.g., support variable digit lengths)?  Any suggestions to handle edge cases better (e.g., when no valid pixels are selected)?    Debugging the Error: How can I get more detailed error info from the testnet to confirm why it failed? Is there a way to log revert reasons in TON?    General Enhancements: Any other improvements you’d recommend for the SelectPixels functionality or the contract overall?

— 2025-03-02 —

Denis: ai based coding + ai based questioning 🙂  ai based answer will be a good end of the this conversation :D  no one can help you until you understand what you want to achieve :)

Amir: Thanks ai answered me 🤣🤣🤣

Илья: Hi, help me solve the problem. I send a jetton (from tonkeeper) to a contract and expect my contract to accept the notify message, but for some reason there is not enough gas in it

/B4ckSl4sh\: JettonNotify does not have to even exist, so sending it with 1 nanoton is perfectly valid behaviour  (that is exactly what tonkeeper does) (reply to 55643)

Илья: Shit, thank you 🙈 (reply to 55644)

Илья: Guys, is there some kind of service that allows you to calculate the cost of maintaining a contract?

Ash: Hello Everyone, Can anyone help me with this?  I'm writing an Airdrop contract in Tact where I have used signature-based airdrop minting on TON:    🔹 Off-Chain: Signature Generation 1️⃣ Create a Cell storing:  User’s address (storeAddress) Reward amount (storeInt with 256 bits) 2️⃣ Convert the Cell to bytes (toBoc()). 3️⃣ Sign the bytes using Ed25519 with the private key. 4️⃣ Save the signature, user address, and reward in signedAirdropData.json.   🔹 On-Chain: Signature Verification 1️⃣ The contract receives:  User address Reward amount Signature (as a Slice)  2️⃣ Recreates the same Cell with: Provided user address Provided reward amount 3️⃣ Converts the Cell to a Slice. 4️⃣ Uses checkDataSignature to verify the signature. ✅

Ash: I'm unable to mint tokens because the checkDataSignature function keeps returning false (reply to 55659)

Ash: I have used ton/crypto for signature verification off chain and is giving me false. Please someone help me with this    import { Address, beginCell } from '@ton/core'; import { signVerify } from '@ton/crypto';  async function verifySignature(     userAddress: string,    // User's wallet address     amount: bigint,         // Amount in nanotons     signature: string,      // Hex signature     publicKey: string       // Public key in hex ): Promise<boolean> {     // 1. Create the same message that was signed     const message = beginCell()         .storeAddress(Address.parse(userAddress))         .storeInt(amount, 256)         .endCell();          // 2. Get the bytes of the message     const messageBytes = message.toBoc();      // 3. Convert hex strings to Buffers     const signatureBuffer = Buffer.from(signature, 'hex');     const publicKeyBuffer = Buffer.from(publicKey.replace('0x', ''), 'hex');          // 4. Verify the signature     return signVerify(messageBytes, signatureBuffer, publicKeyBuffer); }  // Example usage: async function main() {     verifySignature(         "EQD2NmD_lH5f_TRb6ewqNYVAKHjwxK7bVxOjvT1-GTj9jqhF",         69000000000n,         "your_signature_hex",         "0x6cd68c8b3b2e6db246837eb2e7521d2ee15fa9502cb10d0deb889a11b38a9c89"     ).then(console.log); }  main();

Ash: My public key, signature, address and reward all are correct and I have used this function to generate the signature       const message = beginCell()         .storeAddress(Address.parse(userAddress))         .storeInt(toNano(reward), 256)         .endCell();          // Get the bytes to sign (instead of the hash)     const dataBytes = message.toBoc();          // Sign the data bytes directly     const signature = sign(dataBytes, keyPair.secretKey); (reply to 55673)

A: It seems that the recent version of Tact compiler has proplems with the following defenition: balance: Int as coins = 0;  // Initial balance of Jettons  The error says: Trait "SomeTraitName" requires field "balance" of type "Int", but "Int as coins" given

A: But Int is not memory-efficient. How to use an efficient data-type?

Anton: you need to have matching memory layouts (reply to 55676)

S | Coder: Hello everyone! I need to create forwarder contract. Can I  get any examples?

— 2025-03-03 —

Ash: Anyone pls help me with this? (reply to 55673)

&rey: Well since you verify against hash then you must compute signature against hash too. (reply to 55674)

Sỹ: Have you looked at the examples at tact-by-example.org? (reply to 55680)

Ash: I tried it with the hash, still getting false when I execute it (reply to 55694)

Ash: Is anyone there? I'm struggling with this problem. (reply to 55673)

Philip: what is "your_signature_hex" (reply to 55735)

Philip: please provide a minimal complete reproducible example

Philip: https://stackoverflow.com/help/minimal-reproducible-example

Amir: how to find GENERATE_HASH_METHOD_ID of  receive(msg: GenerateHash) where message GenerateHash {     randTimeValue: Int; }

— 2025-03-04 —

Sata: init(jettonWalletCode: Cell, jettonMasterAddress: Address, owner: Address) {         self.owner = owner;         self.jettonWalletAddress = calculateJettonWalletAddress(myAddress(), jettonMasterAddress, jettonWalletCode);     }  how can i provide the jettonWalletCode parameter? is it something related to the jetton contract?

Ash: e44b470b6e9c96e76c668ab20b6009efe310a3b27425c54a3ae3bb4d1ce281470d9eecb1b6dcee8c88cc32e3da76d716d3eb2bd7fe563eec4c51fbc559ed4a0e (reply to 55736)

Ash: Here is the Minimal Reproducible Example

Ash: This is my Smart Contract    import "@stdlib/deploy";  // Message for signature-based minting message VerifySignatureMint {     userAddress: Address;     reward: Int;     signature: Slice; }  contract MinimalReproducibleExample with Deployable {     pub: Int as uint256;     init() {         self.pub = 0x6cd68c8b3b2e6db246837eb2e7521d2ee15fa9502cb10d0deb889a11b38a9c89;     }     // New function to verify the signature     fun verifySignature(userAddress: Address, reward: Int, signature: Slice): Bool {         // Create a slice containing the data to verify         let dataCell: Cell = beginCell()             .storeAddress(userAddress)             .storeInt(reward, 256)             .endCell();                  let dataSlice: Slice = dataCell.beginParse();         return checkDataSignature(dataSlice, signature, self.pub);     }     // New handler for signature-based minting     receive(msg: VerifySignatureMint) {         // Verify the signature before minting         require(self.verifySignature(msg.userAddress, msg.reward, msg.signature), "Invalid signature");         // Other Logics     } }

Ash: This is the script to run the VerifySignatureMint in smart Contract    import { Address, toNano, beginCell } from '@ton/core'; import { MinimalReproducibleExample } from '../wrappers/MinimalReproducibleExample'; import { NetworkProvider } from '@ton/blueprint';   export async function run(provider: NetworkProvider) {     // Test data from your provided information     const testData = {         contractAddress: "EQDlSR_MnNlqZW0apFx6OXp3ZYrmoPTj9TSmHhdXzwOemxmB",         userAddress: "0QCfwXGx7kkNOCoE8QVOE5eYBMyNpcxvbMgEJ2UrDUM1TaOn",         reward: 69000000000000000000n,         signature: "e44b470b6e9c96e76c668ab20b6009efe310a3b27425c54a3ae3bb4d1ce281470d9eecb1b6dcee8c88cc32e3da76d716d3eb2bd7fe563eec4c51fbc559ed4a0e",         publicKey: "0x6cd68c8b3b2e6db246837eb2e7521d2ee15fa9502cb10d0deb889a11b38a9c89"     };      try {         const contract = provider.open(MinimalReproducibleExample.fromAddress(Address.parse(testData.contractAddress)));         await contract.send(             provider.sender(),             {                 value: toNano('0.05'),             },             {                 $$type: 'VerifySignatureMint',                 userAddress: Address.parse(testData.userAddress),                 reward: toNano(testData.reward.toString()),                 signature: beginCell().storeBuffer(Buffer.from(testData.signature, 'hex')).endCell().beginParse()             }         );         console.log('Successfully signature-based minting');     } catch (error) {         console.error("Error:", error);     } }

Anton: 🚨 We wanted to share that the release of PixelSwap new version is slightly delayed. Because something fresh and incredibly exciting has caught our attention!   💎 Introducing Tact v1.6.0 — the most significant update since Tact's inception, surpassing all previous milestones combined! This release includes numerous improvements, even outperforming FunC in gas usage across many standard contracts, including Jettons. 🏆  👉 Dive into Tact v1.6.0 & explore these fantastic enhancements  At PixelSwap, we are committed to bringing you the latest technology on TON. We’re thrilled to see the updates and have decided to grow alongside it. Tact v1.6.0 will be integrated into the new version of PixelSwap, saving users even more on gas fees and providing a smoother experience.  Stay tuned — we believe this wait will be worth it! 💙  ——— Official Links 🔹LayerPixel: Homepage | Twitter | Channel | Community | Medium | Bot 🔹PixelSwap : Homepage | Twitter | Channel | SWAP | Pool 🔹PixelDAO : Twitter | Forum | Chat Group (forwarded from PixelSwap)

Nerses: are docs of TACT updated based on version 1.6.0 ? (reply to 55781)

/B4ckSl4sh\: Yes (reply to 55782)

Ash: Hi @verytactical  Here's the minimal reproducible code... Can you please help me with this? (reply to 55771)

Nikita: Could anyone help me to install tact-lang/compiler please? Always the same errors, already tried different versions of node:  yarn add @tact-lang/compiler     yarn add v1.22.19 info No lockfile found. [1/4] Resolving packages... [2/4] Fetching packages... [3/4] Linking dependencies... [4/4] Building fresh packages... [1/2] ⠂ @tact-lang/opcode error ...\node_modules\@tact-lang\opcode: Command failed. Exit code: 1 Command: node .husky/install.mjs || true Arguments: Directory: ...\node_modules\@tact-lang\opcode Output: node:internal/modules/cjs/loader:1228   throw err;   ^  Error: Cannot find module '...\node_modules\@tact-lang\opcode\.husky\install.mjs'     at Function._resolveFilename (node:internal/modules/cjs/loader:1225:15)     at Function._load (node:internal/modules/cjs/loader:1055:27)     at TracingChannel.traceSync (node:diagnostics_channel:322:14)     at wrapModuleLoad (node:internal/modules/cjs/loader:220:24)     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:170:5)     at node:internal/main/run_main_module:36:49 {   code: 'MODULE_NOT_FOUND',   requireStack: [] }  Node.js v22.14.0 "true"  npm is not working too. Можно продолжить на русском, если удобнее

Anton: Try installing Tact v1.6.0 (reply to 55791)

Nikita: Is not working too, the same error (reply to 55795)

Anton: try removing node_modules, we test Tact installation across various OSes, Node versions and packages managers in CI, so the problem must be on your side: https://github.com/tact-lang/tact/blob/main/.github/workflows/tact.yml (reply to 55801)

bulul: Hello everyone! I'm a bit new to contracts and I'm planning to develop my own GameFi product. I have the following question: we are planning to use Go language on the backend, but I was told that Tact works better with Rust. Maybe I don't understand something. But at what stage and with what does Tact integrate? And where do we store the points tapped by the user?  Thanks for the answers!!

bulul: And I have one question.  Where should the points tapped in the game by the user be stored?

Я̨kov: Generally, they should be stored in your database and handled by your backend. Blockchain is a database for the financial operations, but it is not a good place for in-game events and currency, unless that currency is about to be converted to or from Toncoin (reply to 55814)

bulul: I love you!  I was also recommended to store the points on the ipfs network. Is this nonsense or not? (reply to 55817)

Я̨kov: Seems to be — IPFS is for storage, but a large number of writes (such as in your case) would defeat its purpose, IMO (reply to 55818)

Ash: The Contract is always returning false when I try to run checkDataSignature function.  Can anyone help me with this? I tried every approach, but wasn't able to find any solutions to it (reply to 55771)

Nurda: Hello everyone 👋🏻   We are developing a mini-app that will soon be ready for the release.   Are there any built-in methods for promoting mini-applications in Telegram?

Philip: Is it written in Tact? (reply to 55821)

Nurda: Yeah

Anton: sounds cool, is it opensource? (reply to 55823)

Nurda: No, it’s just a mini game app

Philip: Then unfortunately there's not much this chat can help you with

Nurda: I’m looking for marketing. Are there any Telegram integrated services to promote the app?

Philip: This is not a marketing chat, this is a developer chat

Nurda: Yeah I’ve noticed. Sorry for that. Just don’t know whom to ask for

Sata: Could anyone help me with this, when I derive the contract's wallet just after deploying it, the address is always inactive even when I fund it with jettons and ton, is there any solution for this? To automate jetton transfer through the contract (reply to 55756)

Ash: Tact team , can you please help me with this? (reply to 55820)

Anton: can you please make a standalone repo with a test showing what is not working and some clear instructions how to install the dependencies and run the test? (reply to 55838)

Daniil: You’re calculating the signature wrong. You should not convert it to BoC but just take a hash of it and sign this hash. Then in smart contract you also take the signed cell’s hash to verify it. (reply to 55771)

— 2025-03-05 —

Duc: Good morning everyone I am writing TON smart contract with Tact  I have written a function to receive a message like below (in Jetton contract) receive(msg: TransferUSDT){         let ctx: Context = context();         require(self.admin.get(ctx.sender) == true, "Not Admin");         let winit: StateInit = self.getUSDTWalletInit(self.USDTWalletAddress, msg.to);         send(SendParameters{                 to: contractAddress(winit),                 value: 0,                 bounce: false,                 mode: SendRemainingValue,                 body: TokenTransferInternal{                     queryId: now(),                     amount: msg.amount,                     from: myAddress(),                     forward_ton_amount: 0,                     forward_payload: rawSlice("0")                 }.toCell(),                 code: winit.code,                 data: winit.data             }         );     } and a script to call the that message: await profToken.send(         provider.sender(),         {             value: toNano('0.1'),         },         {             $$type: 'TransferUSDT',             to: userAddress,             amount: toNano("0.00001"), // 0.001 USDTUSDT         },     );  But i keep getting failed transaction with error "Insufficient amount" Note that the contract has 0.81 TON and 0.05 USDT (meaning the contract has enough money to do the transaction) Thank u so much

Anton: are you sure this means 0.001 USDT and not 10000 USDT? (reply to 55891)

Duc: i mean 0.01 USDT

Anton: you are using toNano which multiplies that argument by 10^9 (reply to 55903)

Duc: i have tried 30000n but it didn't work

Anton: what are the measure units for amount do you have any documentation on this? (reply to 55905)

Duc: i'm searching by ChatGpt

Duc: If USDT has 6 decimal places (like USDT on Ethereum, BSC, or TON): 0.03 USDT=0.03×10^6=30,000

kira: this is an argument in message "TransferUSDT", being declared as  message TransferUSDT {   to: Address;   amount: Int as coins; } (reply to 55906)

Fin: Is the testnet.toncenter database down?

Fin: it api doesn't work

/B4ckSl4sh\: Testnet is experiencing some load now. TON-Core team is doing some stress-testing afaik (reply to 55925)

Setmax: Hey guys, I used the upgrade mechanism, added two new get methods and a counter variable to the initial contract, built it, and then used contract.code.boc in upgrade.ts:               const newCodePath = './build/contract.code.boc';             const newCodeBoc = fs.readFileSync(newCodePath);             const newCodeCell = Cell.fromBoc(newCodeBoc)[0];              // Send the upgrade message             console.log('Sending upgrade message...');             await MyContract.send(                 provider.sender(),                 {                     value: toNano('0.05'),                 },                 {                     $$type: 'Upgrade',                     code: newCodeCell,                     data: null                 }             );   Now, it seems that none of the methods, including getVersion, are callable, and I keep getting the ‘Got exit_code: 9’ error. morover i used latest version of tact compiler. Any idea? (reply to 55580)

— 2025-03-06 —

Alireza: Hi, I have two questions based on the following example: https://tact-by-example.org/07-jetton-standard  1- Why should a user be able to burn a jetton token? 2- are receiver and bounced functions of TokenTransferInternal in JettonDefaultWallet correct? (regarding the balance)

Georgiy: 🎉 Misti 0.7 has just landed on NPM!  🔍 More Tact Detectors: StateMutationInGetter, UnprotectedCall and SuspiciousLoop.  ⚡ Tact 1.6.1 support: Including new language syntax and features.  ⚙️ Improved Tools: Added more Callgraph functionality to enhance contracts audits.  🔧 Fixes & Enhancements: Check out the full changelog. (forwarded from nowarp | TON Security)

Я̨kov: That example is very outdated. We're working on the newer, optimized and streamlined Jetton implementation in Tact — follow https://github.com/tact-lang/jetton for more :) (reply to 55990)

Higher Thought Sandeep: Mini app on ton blockchain

фьюри IT (CYBER-SECURITY): hi bros

фьюри IT (CYBER-SECURITY): how can i create nft username&

фьюри IT (CYBER-SECURITY): ?

фьюри IT (CYBER-SECURITY): who can help me?

— 2025-03-07 —

Hoang: Does anyone know where I can obtain USDT Jetton on the testnet?

Anton: 🎉 Tact v1.6.2 is released!  Release a day keeps the sanitarians away.   Seriously though, before we commit to the next big release, refining rough edges and adding useful things to the standard library is always nice without making you wait for them for long. To discover such points of improvement, we actively collect feedback that we see in Tact chats and that we receive from the teams that actively use Tact in production.  We're not yet done with all the suggestions, so apart from this release, there are plans to make at least one more patch release with possible bug fixes and additions to the standard library.  ❤️ All constructive feedback is welcome — let's enjoy writing ⚡️ Tact together!  On that note, let's quickly unpack the v1.6.2:  🛠 Bug fixes  • An empty init() function is no longer implicitly added when empty contract parameters are declared. This is done to save gas and storage, and it is backward compatible with the lazy initialization that Tact offered as the sole data initialization mechanism before v1.6.0.  • Compiler no longer screams at you if the message struct becomes small enough to fit into the 224 bits and does not require an explicit bounced<M> constructor. That was a noisy warning, and it's much better without it.  • Contract constructors are now public in TypeScript wrappers.  • Now, if getters do not have explicit method ID overrides in Tact code, they are called by their name and not their numeric IDs in the generated TypeScript wrappers. This change restores the pre-1.6.0 behavior that was important for compatibility with some third-party tools that do not support calling getters by their method IDs.  • Compiler upgrades via npm i now work as they should. Note that upgrades through the npm update --save command continue working, too.  🧰 Standard library additions and changes  • Doc comments, doc comments everywhere! They're especially fun to use with the language server, see more info on that below.  • Added Slice.skipRef, Slice.skipMaybeRef, Slice.skipBool, Slice.skipCoins, Slice.skipVarUint16, Slice.skipVarInt16, Slice.skipVarUint32, Slice.skipVarInt32, Slice.skipAddress functions.  📜 See the full release notes for Tact v1.6.2 📥 And upgrade Tact in your projects  The alpha testing for the new TON Studio's official Tact language server continues. Have you tried it? It also has a neat VSCode extension and an extension for VSCode-based editors!  Here's a quick rundown of their features: • Semantic syntax highlighting • Code completion with auto import, postfix completion, snippets, and import completion • Go to definition, implementation, type definition • Find all references, workspace symbol search, symbol renaming • Types and documentation on hover • Inlay hints for types, parameter names, and more • On-the-fly inspections with quick fixes • Signature help inside calls, and actions for initOf and struct initialization • Lenses with implementation/reference counts • Gas estimates for assembly functions • Commands for building and testing projects based on Blueprint and tact-template • Integration with Tact compiler and Misti static analyzer  Sounds exciting? Install it and tell us what needs improvement — the language server is quite new, but it matures very fast!  🍲 please try to enjoy each release equally ♨️ @tact_kitchen from the @ton_studio (forwarded from Tact Kitchen)

Sata: testgiver_ton_usdt_bot  You can get testnet usdt on this bot (reply to 56077)

Hoang: Thanks for the reply! It gave me a link, but when I clicked on it to open my Tonkeeper, it showed 'Error: Unsupported link.' I'm not sure if the bot is outdated or if it's something I did wrong. (reply to 56088)

Sata: If the USDT testnet faucet isn’t working, you can create your own custom USDT Jetton for testing. you can either deploy the smart contract manually or use jetton tools available online to create. (reply to 56089)

Sehm: /I need help to build a dapp for SBT claim.

Skuli: Hi everyone! Does anyone know if there is a utility that automatically checks the validity of a contract before deploying? I get an "error" when deploying a contract. I tried to catch it through sandbox, but it didn't work. Is there something more universal?

Dmitry: Error code? (reply to 56112)

Skuli: I mean I want to see this error locally when deploying. I don't want to see it when the contract is deployed to the block chain. I want to deploy the contract locally to see these kinds of problems. (reply to 56114)

Dmitry: Ah, I see

Dmitry: It’s interesting how Tonkeeper emulates transactions, maybe there are some methods for that in ton library or something like that

Skuli: tone sandbox can't help with this? (reply to 56117)

Dmitry: Sure, you can try to deploy in sandbox and inspect vm trace

Dmitry: Why it didn’t work for you?

Skuli: I'll try to look at sandbox again.  I just want to achieve a result where I can see everything immediately at the stage of the problem's appearance, and not in production

Dmitry: Yeah, sandbox should be perfect for that (reply to 56121)

— 2025-03-08 —

Ash: I have added my code in this repo in which i'm having issue with checkDataSignature function in the contract. Its always Returning false.  https://github.com/Ashwin-Selvaraj/Tact-checkDataSignature.git (reply to 55839)

Mohammad: Hey everyone, I am using vscode and getting this error:  Tact standard library is missing! Try installing dependencies with yarn/npm install or specify tact.stdlib.path in settings

&rey: That's "224 bits not counting the opcode", right? After all, 256 bits of original message were kept always, adding 32-bit bounced prefix. (reply to 56081)

Petr: Hey, are you using Blueprint or tact-template? (reply to 56146)

Mohammad: Using blueprint (reply to 56150)

Petr: Hmm, does node_modules contain @tact-lang/compiler and stdlib folder in it? Try yarn install and restart VS Code (reply to 56151)

Mohammad: I updated path to tact-lang/compiler/dist in my preferences. The error is gone but "Go to Declaration" does not work. (reply to 56156)

Petr: Try to setup tact.stdlib.path setting to node_modules/@tact-lang/compiler/stdlib (reply to 56157)

Mohammad: Thanks, Did the same but I can't navigate to the definitions (reply to 56158)

Petr: Have you restarted VS Code? (reply to 56159)

Mohammad: Yep (reply to 56160)

Petr: Even to local variables or only definitions from stdlib? (reply to 56159)

Mohammad: Editor cannot recognize any definition at all. (reply to 56162)

Petr: Any chance that you have two Tact extensions installed? (reply to 56163)

Mohammad: I had but I removed previous one. Now I am using only one. from Ton Studio. (reply to 56164)

Petr: Oh, can you send logs from:  Cmd/Ctrl + Shift + P > Toggle Terminal > Output > Tact

Mohammad: I can't send txt file. Would it be ok to share raw content?

Petr: Send me the file in DM please

Mohammad: Thank you

Petr: Windows things, will be fixed in 0.4 this Monday 🙂

mansudo: yo everyone, im new, what's the diff between tact and tolk langs? is tact considered tolk successor like tolk is to FunC?

Я̨kov: Kind of. Tolk was an attempt to modernize FunC, while Tact is a production-ready and battle-tested language focused on efficiency and simplicity. It has lots of distinct features and it's also safe — we've passed a thorough security audit by Trail of Bits last autumn.  Tact has comprehensive documentation, ever-expanding collection of great tooling and long-lasting plans for the future.  Come aboard: https://docs.tact-lang.org/#start  And check out selected update notices in the @tact_kitchen 👋 (reply to 56197)

mansudo: Thanks. The question ofc is compiler. It's pretty costly (reply to 56200)

mansudo: At least that's what i've heard, because it compiles to funC eventually, which is compiled to fift

Я̨kov: That's a thing of the past. Although we still compile to FunC, we now employ a wide range of optimizations which are tough and cumbersome to do when programming in FunC directly.  See: https://t.me/tact_kitchen/58 (reply to 56201)

— 2025-03-10 —

Amor: Hey. I have a  issue struct ArrayAffiliate {     childrens: map<Int, Address>;     arrLength: Int = 0;     MaxSize: Int = 100000;     arrStart: Int as uint8 = 0; } let arr: ArrayAffiliate = self.affiliates.get(parent)!!; foreach (key, value in arr.childrens) {    dump(key);    dump(value); }      #DEBUG#: File contracts/trait-stake/affiliate.tact:76:17:     #DEBUG#: dump(i)     #DEBUG#: 0     #DEBUG#: File contracts/trait-stake/affiliate.tact:77:17:     #DEBUG#: dump(value)     #DEBUG#: EQBJa9i8wwwC26ANheOAOQbt_Z5fGoFvQLYKbnvkNlHxcwZd     #DEBUG#: File contracts/trait-stake/affiliate.tact:76:17:     #DEBUG#: dump(i)     #DEBUG#: 1 I would like to dump to debug. map has 9 item.but foreach only dump address at item[0]. . please help me. Thanks

Anton: dump is computationally expensive, you probably need to send more gas (reply to 56291)

Amor: thank. I send 150 Ton. but dump to item 7. miss 2 item (reply to 56292)

Anton: There is a limit 0.4 TON per transaction (reply to 56294)

— 2025-03-11 —

Алексей: Is there a way to make address literal? Like "UQAAA...AAJKZ"a in func

Алексей: I guess there isn't(

maksim: https://docs.tact-lang.org/ref/core-comptime/#address (reply to 56378)

Philip: @HackToLuck This chat is in English  Please provide minimal complete reproducible example that shows the issue exists

Алексей: I'm trying to setup LSP in sublime, and everything seems to work, except for lsp cannot find stdlib. How to fix this properly?  I see this in logs: [ERROR] [11-03-2025 15:39:24] Standard library not found! Searched in:  /Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/src/stdlib/stdlib /Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/src/stdlib /Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/stdlib /Users/alex/probe/tact/simple-counter/stdlib

Petr: Known problem, can you try manually setting "tact.stdlib.path" to  /Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/dist/src/stdlib/ for now? (reply to 56401)

Алексей: It doesn't have any errors in logs right now, but shouldn't  it suggest "Ownable" here? (on screenshot it suggested by sublime, not lsp) (reply to 56402)

Алексей: But now it has warning: [WARN] [11-03-2025 16:04:38] No file to index in file:///Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/dist/src/stdlib/

Petr: Can you show ls /Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/ and ls /Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/dist?

Алексей: alex:~$ ls /Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/ LICENSE  README.md bin  dist  package.json alex:~$ ls /Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/dist abi  cli  grammar  pipeline verify.d.ts ast  config  imports  server  verify.js benchmarks context  index.d.ts stdlib  vfs bindings error  index.js storage browser.d.ts func  optimizer types browser.js generator packaging utils (reply to 56406)

Petr: Ah, thank you, try /Users/alex/probe/tact/simple-counter/node_modules/@tact-lang/compiler/dist/stdlib

Алексей: yeah, now it works thanks! (reply to 56408)

Petr: Cool! Thanks for pointing this out, I'll release a fix today

Алексей: ahh, lsp feels so good, I hate func and tolk tooling for their exclusive intellij support only

Petr: Yeah, Tact kinda opposite right now as we support any editor with LSP support except IntelliJ (reply to 56411)

offsdfg: that includes Zed too? (reply to 56413)

Petr: Not yet, as Zed requires writing a plugin to run LSP 🙁 https://github.com/tact-lang/tact-language-server/issues/208

Ivan: hey everyone =) is the SendParameters value limited to 0.4 TON, or can I set it higher even though no more than 0.4 TON will actually be spent?

Ivan: I just want to find a simple payment method and don't want to store user balances

Я̨kov: You can send more than 0.4 Toncoin in any transfer :) (reply to 56420)

Ivan: So to confirm, I can set value > 0.4 TON in SendParameters? Just want to make sure =) (reply to 56422)

Я̨kov: Yes, you can  send(SendParameters{     value: ton("5"), // this will send 5 Toncoin     to: sender(), });  Just make sure that the contract has enough funds for this, or you'll get exit code 37 in the action phase: Not enough Toncoin (reply to 56423)

Я̨kov: In your tests and other scripts, replace { $$type: 'Deploy, queryId: 0n } or similar to just null  And then make sure that your contracts have an null message body receiver, i.e. an empty one: receive()  :) (reply to 56447)

Ilia: thanks, mate! very much obliged. (reply to 56448)

Я̨kov: No problem. The Deployable trait and related message structs were too expensive to use compared to simple deployments with a null message body.  By the way, to send excesses back on deployment, instead of the empty receive(){}, starting with Tact 1.6.1 you could have receve(){ cashback(sender()) } (reply to 56449)

Я̨kov: I'll try to update the templates in Blueprint soon to match the changes we've made :) (reply to 56450)

KTO: Помогите решить проблему. Смарт-контракт NFT коллекции не определяется на версии 1.6.2  Хотя тот же смарт-контракт на версии 1.5.3 работает нормально

KTO: Смарт на 1.5.3 kQAltV2dQ9_JtXu5P-kLvsrV8nLmnnJWZmI5rPg3I7NMQn5U Определяется нормально  Тот же смарт на 1.6.2 kQC1EgVpdDvnq_fBdNK9YnNhRUgc13yLauh1OIzGTzBQxOMe Вообще не определяется

KTO: Его даже ton.cx не считывает

Ilia: Ok. It works. But now upon execution I see that:   1) transaction has deploy: false instead of deploy: true 2) transaction has success: false  3) transaction bounced  But contract was indeed deployed.  Are those intentional? (reply to 56448)

/B4ckSl4sh\: Did you add empty. receiver?  like  receive() {  //cashback(sender()) <- if needed } (reply to 56458)

Ilia: I certainly did not. 8 ) Thank you. Is there a place in docs I'm missing? (reply to 56459)

Я̨kov: Well, there are two and both will be edited soon:  https://docs.tact-lang.org/book/receive/ — this is mostly right https://docs.tact-lang.org/book/deploy — this requires heavy edits (reply to 56460)

Ilia: I see. Looking forward to updates, then. (reply to 56461)

Я̨kov: By the way, do you use https://github.com/tact-lang/tact-language-server? It has just got inspections and quick fixes for replacing Deployable trait in contracts. And in terms of other features, there is a lot :)  It's in open alpha now, so if you find any issues with it, you can report them here or on its bug tracker: https://github.com/tact-lang/tact-language-server/issues  Hope it helps ❤️ (reply to 56462)

Ilia: I have VS Code plugin installed. But to be honest beyond syntax highlighting does not help much. Will look into it. Thanks. (reply to 56463)

Я̨kov: Oh, then you probably have the old one! The new one is here.  It conflicts with the previous extension, so it's better to keep only one installed, preferably the newer one :) (reply to 56466)

Ilia: No. This is the one I'm using. (reply to 56467)

Ilia: Looks like I had issues with standard library path, I see more hints now. Thank you. (reply to 56467)

Ilia: like a charm

Я̨kov: Awesome! This is a known issue and it will be resolved in the next extension release (reply to 56478)

KTO: Will they help me? Why is the NFT collection interface not defined on version 1.6.2? (reply to 56454)

Я̨kov: Does this issue persist on NFT explorers specifically, like GetGems and such? (reply to 56484)

KTO: getgems shows the collection, but the NFT explorers don't show (reply to 56486)

KTO: It is also not displayed in the TonKeeper wallet. And ton.cx He can't identify her either. (reply to 56486)

Я̨kov: Hmm, it's quite peculiar. I don't know what caused it, but we'll look into it deeper in the near future.  After all, once the Jetton implementation in Tact is ready for production, we'll do other standard contracts like NFTs :) (reply to 56488)

KTO: But after all, on version 1.5.3 everything works fine and is displayed. (reply to 56489)

KTO: Is there really no way to solve this problem? (reply to 56489)

/B4ckSl4sh\: Tomorrow we will dive deep into this (reply to 56491)

KTO: For the test, I used this smart contract:  https://github.com/howardpen9/nft-template-in-tact (reply to 56492)

Я̨kov: Well, the getters/methods are still there, which means it might be an issue on the explorers side. Once again, we'll try to test some more soon :) (reply to 56491)

— 2025-03-12 —

Алексей: Is there any reason why tact-lang/jetton doesn't use @stdlib/ownable traits?

Daniil: Toncenter works fine, the problem is on tonapi/tonscan side.  We’ll figure it out with them (reply to 56454)

Anton: That trait hardcodes the exit code and initially we wanted to just replicate the reference contract by TON Core (reply to 56534)

Алексей: But require also kind of hardcodes exit code deriving it from error message 🤔 (reply to 56536)

Anton: Yeah, so I personally prefer throwUnless for that reason (reply to 56537)

Ash: Hello developers, anyone ready to do Freelance? I have a functionality in Tact Smart Contract to complete

&rey: Sounds like there should be an autogenerated method sendAny for testing contract on malformed messages / sending no body / etc. (reply to 56448)

Philip: That was the plan for nextgen wrappers. Unfortunately this means we'll have to circumvent majority of the code in Sandbox, and that's not easy (reply to 56567)

&rey: "malformed" message payloads, then? Ones the contract doesn't expect. (reply to 56570)

Philip: ? (reply to 56571)

Philip: Malformed payloads are hard to pass, because Sandbox was build to force users into using contract's interface

Philip: It's already possible to get blockchain.provider(), and do low-level send on it, but extending contract's interface with that would be tedious and unsafe

Philip: Basically we'll have to redo the whole interface of Sandbox just to get our wrappers fixed, so it will take time

Я̨kov: If you mean to send messages bodies with unexpected opcodes, then that can be done via your proposed sendAny and/or in a similar manner, yeah  https://docs.tact-lang.org/book/exit-codes/#130 (reply to 56571)

— 2025-03-14 —

Балтика: Is the contract automatically activated when I make my first top up? I compiled a small contract on TACT and sent some TON to it, but the status of the contract did not change  UQBFwXWTnR4M__kcM8FOgsX1eB7p_M1r4CMD0M0K_YY3vZo3

Алексей: The most easy way to deploy contract is to use blueprint, run yarn blueprint run or smth like that (reply to 56702)

Z: Hello, I wrote a sales contract using tact, and printed out some information using emit. My plan is to use Go to search for these emits and save them in the database. Is this reasonable?

Z: Since tact does not have an approval-like operation in solidity, when using tokens to purchase goods in the tact contract, the user needs to transfer the token directly to the contract. After the transfer is completed, some necessary post-purchase contract logic is processed in TokenNotification. Is this correct?

Алексей: I think I found a bug, for this simple contract  message Test {     refferer: Address? }  contract Main() {     receive() {         cashback(sender());     }      receive(msg: Test) {         cashback(sender());     } }   Tact generates following tlb: ### Test TL-B: test#e6e73381 refferer:Maybe address = Test Signature: Test{refferer:Maybe address}  And when I send  {     $$type: "Test",     refferer: Address.parse("0QBUFT1SH0IglM6VSb8iTPUqElMnK-goI85_f1A_XYXlwwvA") }   The resulting message body has cell with 32bit opcode + 267bit address, but it has no maybe bit before address, isn't it a conflict with tlb 🤔

Philip: Unfortunately that's not just bug at our side, that's a widespread bug over the whole ecosystem.  Take a look at these lines for loading Address? in @ton/core library (reply to 56713)

Philip: At some point of time someone decided that "optional address" is optional if it might be an addr_none, but the address can be addr_none even if it wasn't optional

Philip: In one of the next versions of Tact we'll try to fix it on our side by making a correct independent implementation of block.tlb, but before that we have what we have

Алексей: And @ton/core won't fix that? (reply to 56716)

Philip: Maybe I wasn't too clear when I reported the bug a few months ago, but, well, no. (reply to 56719)

Philip: And I'm not sure it's @ton/core to blame here. Maybe they have it for compatibility with someone else

— 2025-03-15 —

Valentyn: 🚨 Need Help with Deploying a Smart Contract on TON 🚨    I'm trying to deploy a smart contract on TON but keep getting errors when sending deploy-full.boc via lite-client. I generate deploy-full.boc using fift with the command:   rm deploy-full.boc && fift -I /Users/valentinvdovicenko/ton-nft-marketplace/ton/crypto/fift/lib -s deploy-full.fif && ls -l deploy-full.boc && hexdump -C deploy-full.boc   Then, I send it using:   lite-client -C /Users/valentinvdovicenko/ton-nft-marketplace/mainnet-global.config.json -c "sendfile /Users/valentinvdovicenko/ton-nft-marketplace/deploy-full.boc"   I keep getting errors like "cannot apply external message to current state: failed to parse external message: external message is not a (Message Any) according to automated checks", "server version is too old (at least 1.1 with capabilities 1 required), some queries are unavailable", "timeout for adnl query query", and "failed to parse external message". How can I verify if deploy-full.boc is correctly generated and ensure the lite-client is working properly? Any help would be appreciated! 🙏

/B4ckSl4sh\: You definitely don't take the easy way out (reply to 56749)

/B4ckSl4sh\: Why do you need to deploy your contract using lite-server binary? (reply to 56750)

Valentyn: "That's not my style—I go all in. No shortcuts, just results. 😎" (reply to 56750)

Valentyn: "I need to deploy my contract using the lite-client binary because I'm working directly with the TON blockchain, and it allows me to send raw external messages efficiently. If there's a better approach, I'm open to suggestions!" (reply to 56751)

/B4ckSl4sh\: Are you sure you have latest lite-client?   https://github.com/ton-blockchain/ton/releases/tag/v2025.03 (reply to 56749)

Алексей: Yeah I am not sure what is deploy-full.fif, likely the problem is there (reply to 56749)

Gosha: Hello! Am I correct in understanding that message(params: MessageParameters) is only used for sending Toncoin, and if I want to send some meaningful message, I should use send(params: SendParameters)?

Алексей: The meaningful part is body of the message. You can pass body both in MessageParamters and SendParameters (reply to 56758)

Алексей: However with message(params: MessageParameters) you cannot deploy new contract

Gosha: So docs are wrong?

Алексей: I think it should be data, not body. I think this a typo yes, but maybe I am wrong.. (reply to 56761)

&rey: Well I believe the code is correct, meaning TL-B is not. (reply to 56713)

Алексей: Also I am kind of curious why tact need send() at this point when it has message() and deploy() 🤔

Anton: Already fixed in the main branch, will be released next week with a couple more fixes and improvements (reply to 56763)

&rey: Mm... isn't it kind of early considering upcoming node changes in handling varaddrs? (reply to 56765)

Anton: It had send originally and then we added the optimized deploy and message functions, while keeping send for backwards compatibility (reply to 56764)

&rey: Suppose you'd Iike to unfreeze a contract. How'd you go about that in Tact? (reply to 56764)

Valentyn: Yes, exactly. message(params: MessageParameters) is mostly for sending Toncoin, whereas send(params: SendParameters) lets you include a meaningful message body. But for deploying a new contract, you’d need to send an external message with StateInit, which isn’t possible with message(params: MessageParameters). (reply to 56758)

Алексей: There is a problem? You can construct StateInit from code and data, isn't that enough? (reply to 56768)

Алексей: Please don't use ai... (reply to 56770)

&rey: No, as address might not match State for unfreezing in that case. (reply to 56771)

Я̨kov: You're right, it's a typo and it will be quickly resolved (reply to 56762)

Anton: good point  we will adapt to that as well (reply to 56766)

Anton: @pcrafter @gosunov have you had a chance to look at our new gas guidelines for Tact contracts?  Here is the link: https://docs.tact-lang.org/book/gas-best-practices.  We would appreciate your feedback and suggestions

&rey: Well not yet... I suppose it's a nice cue to try writing in Tact) (reply to 56776)

&rey: Looks nice. Do you plan to update the Security article to use the global functions too? (reply to 56776)

Я̨kov: Do you mean to use the message() over send() and such? Then, yes — https://github.com/tact-lang/tact/issues/2393 (reply to 56779)

Балтика: import "@stdlib/deploy";  // Deposit wallet contract contract Wallet with Deployable {     owner: Address;          // Owner address (master wallet)     user_id: Int as uint64;  // User identifier      // Contract initialization     init(owner: Address, user_id: Int) {         self.owner = owner;         self.user_id = user_id;     }      // Processing incoming messages without type (just TON)     receive() {         // Empty function - contract just activates when receiving funds     }      // Getting contract information     get fun owner(): Address {         return self.owner;     }      get fun user_id(): Int {         return self.user_id;     } } (reply to 56707)

Балтика: I compile the contract code into a HEX string and then already on nodejs predict the address of the contract by passing it unique data. After sending funds to the address the contract is not executed. What am I doing wrong?

Алексей: Blindly following ai... If you want the easiest way to deploy contract use blueprint. If you want the hard way find how to construct and attach stateinit to the message (reply to 56787)

— 2025-03-16 —

Rjey: Hello good people.  I'm new here so forgive me if I'm asking a repeated question. What are some good resources for in depth learning of the TVM and Tact else than the documentation? I have finished Nikandr Surkov's course and have been a solidity developer myself, and now I need some noob friendly resource for going deeper, thanks to all in advance

— 2025-03-17 —

Gosha: Hello! Can anyone help me with parsing a payload? Is there an elegant way to parse a payload into a message or a struct?  For example, my payload is a Slice where I store either: struct A { a: Int } struct B { b: Address } How can I determine which struct it is when receiving this payload?  I found Struct.fromSlice in the documentation, but it doesn’t seem to support pattern matching based on the struct type

/B4ckSl4sh\: You can create a payload  struct C {    a: Int?    b: Address? }  This is not what you exactly want, but probably it's better solution for you (reply to 56948)

ILYAR: Sample parsing a payload via TL-B  Create schema.tlb // struct A { a: Int } a a: int256 = A; // struct B { b: Address } b b: MsgAddressInt = B;  Generate code by schema npx @ton-community/tlb-codegen@2.0.0-beta.0 -o schema.ts schema.tlb  Write code sample.ts use types from schema.ts and run npx ts-node sample.ts 42 Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF {   bocA: 'te6cckEBAQEAJgAASAYovqEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKu1DVIw=',   bocB: 'te6cckEBAQEAKAAAS25ndrKf5mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZwvzU+eg==' } bocA { kind: 'A', a: 42n } bocB { kind: 'B', b: Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF }  #tlb (reply to 56948)

— 2025-03-18 —

Gosha: Thx, But I was thinking more about how this code would look on Tact, where the payload contains the transferred message. https://github.com/ston-fi/dex-core/blob/main/contracts/router.func#L80 (reply to 56982)

maksim: In case like this (with jetton transfer notification), you can define receiver as in this, and then use forwardPayload Slice type field to parse it manually. If you are certain in what type you are expecting, you can use Struct.fromSlice, but yeah, it only supports predefined structs at the moment  If you have limited number of possible incoming payloads, you could do something like tagging yourself, like make first 32 bytes define struct type, for example  struct FirstPossiblePayload {  tag: Int as uint32, // e.g tag is 0x1 for this  ... your fields }  message(0x7362d09c) JettonNotification {     queryId: Int as uint64;     amount: Int as coins;     sender: Address;     forwardPayload: Slice as remaining; }  struct SecondPossiblePayload {  tag: Int as uint32, // e.g tag is 0x2 for this  ... your fields }  // in receiver code  let payload = msg.forwardPayload let tag = payload.loadUint(32)  if (tag == 0x1) {  // parse with Struct.fromSlice } // same with other cases (reply to 57007)

Gosha: Thanks, that helped! I'm curious, how does the message receiver in Tact determine what kind of message has arrived? I assume the op code is already "added" there, so maybe it's possible to extract it from the transferred message without adding a new tag field? (reply to 57008)

maksim: Yes, our router does exactly this (parsing incoming message OP) to determine what receiver should accept the message, but we can't use this in case of a few possible payloads. I mean in one receiver, if it's suits your use-case, you can define exact structure of full message, for example:  message(0x7362d09c) JettonNotification {     queryId: Int as uint64;     amount: Int as coins;     sender: Address;     forwardPayload: Int as uint256; // uint instead of remaining if you only want to accept this exact payload }  But if you want to have a few of this, you will have to write separate receivers for them. Not perfect but somewhat similar example is Tact v5 wallet contract compatible with func, check patterns used there (you might need to check v5 tlb to get a grip) (reply to 57009)

Anton: As Maksim said, you can explicitly specify the message opcode, but if you need to access the opcode in your code, you can add a constant like this:   const TakeWalletAddressOpcode: Int = 0xd1735400;  message(TakeWalletAddressOpcode) TakeWalletAddress {     queryId: Int as uint64;     walletAddress: Address;     ownerAddress: Cell?; //It is Maybe ^Address, just encoded it like this }   There is a task to add static fields for message opcodes: https://github.com/tact-lang/tact/issues/2230, so you will be able to do it in a simpler way: TakeWalletAddress.opcode (reply to 57009)

— 2025-03-19 —

Anton: 🎉 Tact v1.6.3 and v1.6.4 are released!  We're back with some quality-of-life improvements! I cannot promise there won't be another patch release before the next big one — that's because we're working on something really enticing in the background and would like you to continue receiving updates in the meantime.  Now, this isn't a dual release per se. It's just that the post for v1.6.3 got lost in the river of time... Kidding! The two patches are simply very connected since we wanted to ensure that v1.6.4 acknowledges the possible gaps in v1.6.3.  Let's unfold the v1.6.3 and v1.6.4 at once:  🛠 Bug fixes  • In the compilation report, TL-B for Address? is not Maybe Address, but plain Address. This is a temporary measure until the Address type is reworked to allow not just the addr_std scheme, but also the addr_none, addr_var and addr_extern.  • Parameter reordering optimization is now only applied to single-parameter asm extension functions, to avoid confusion when performing multiple mutation operations on arguments.  • The postinstall script has been removed from Tact's package.json so that Node.js package managers won't unexpectedly trip on it when you try to upgrade or reinstall the compiler in your projects.  ✍️ Documentation updates  • Deprecated Deployable and FactoryDeployable traits in favor of null message body receive(), with or without a call to the new cashback() function at your discretion.  • ⛽️ Added gas best practices page, go check it out to reduce gas usage of your contracts: Gas best practices.  • 🎁 Enhanced the TypeScript wrappers produced by Tact compiler, and documented how to use the new exit code and opcode records: Interacting with TypeScript wrappers.  • Added missing reference docs and fixed many descriptions and links throughout the standard library.  • Made a significant change to the Reference section: removed the core-common and core-advanced pages, and distributed their contents across other libraries, such as: core-crypto, core-contextstate, core-send, core-gas, and core-addresses.  🧳 Miscellaneous improvements  • Added forceBasechain() and forceWorkchain() functions.  • Added the internalExternalReceiversOutsideMethodsMap config option as part of optimization options to prevent the contracts from being incorrectly recognized by some explorers and user wallets.  • Further decreased gas usage of contracts with some special cases of binary and fallback Slice receivers. This is relevant mainly for Jettons, but other contracts could benefit from this, too.  • The old parser is finally removed. As a user of the compiler, you shouldn't notice a thing, but if something misparses or behaves weirdly in terms of syntax — please notify us in the chat or by opening an issue and providing a minimal reproducible example.  📜 See the full release notes for Tact v1.6.3 and Tact v1.6.4 📥 And upgrade Tact in your projects  🍲 spinning cat be like: u-ii-tact-i, ou-iii-tact-i ♨️ @tact_kitchen from the @ton_studio (forwarded from Tact Kitchen)

— 2025-03-20 —

Nyine: 👍

Алексей: Tact developers, do you know about tvm inscruction SDBEGINSQ? I think this instruction can reduce gas consumption almost in every case by several dozens units, and has no drawbacks (maybe).  I rewrote generated func code with it https://pastebin.com/nLHBHcPZ, this saves 96 gas units.  I actually wanted to contribute, but I think it requires pretty heavy changes in code, and I am not sure if it is needed

Anton: wow! looks interesting 🚀  will definitely take a look (reply to 57242)

Балтика: contract Wallet {     id: Int as uint64;          init(id: Int) {         self.id = id;     }          receive() {         cashback(sender());     } }

Балтика: import { Address, beginCell, Cell, toNano } from '@ton/core';  const codeHex = 'xxx-hex-code';  function getWalletAddress(id: number, codeHex: string): Address {     const code = Cell.fromBoc(Buffer.from(codeHex, 'hex'))[0];      const data = beginCell()         .storeUint(id, 64) // id хранится как uint64         .endCell();      const stateInit = beginCell()         .storeBit(0) // No split_depth         .storeBit(0) // No special         .storeBit(1) // Has code         .storeBit(1) // Has data         .storeBit(0) // No library         .storeRef(code)         .storeRef(data)         .endCell();      const hash = stateInit.hash();     const address = new Address(0, hash);     console.log('Generated wallet address:', address);     return address; }

Балтика: What's the problem? I generate addresses based on the received hex string with blueprint build command. Then I expect the contract to be deployed at the first replenishment. What am I doing wrong?

Anton: You are building your data cell manually, you should have used the fromInit function that Tact generates for you.  Since you are using the init function, Tact adds the lazy deployment bit into the data cell.  Your way should work if you switch to using contract parameters introduced in Tact 1.6.0, like this:   contract Wallet(id: Int as uint64) {     receive() {         cashback(sender());     } } (reply to 57248)

Балтика: contract Wallet(id: Int as uint64) {     receive() {         cashback(sender());     } } import { Address } from '@ton/core'; import { Wallet } from '@/build/Wallet/tact_Wallet';  async function getWalletAddress(id: bigint): Promise<Address> {     const wallet = await Wallet.fromInit(id);     return wallet.address; } (reply to 57249)

Балтика: I did as you said but I am not getting the expected behavior. I updated the hex string after compilation and use the wrapper from the build folder. When sending funds (0.1 TON) the contract does not change its status to active.

Балтика: Does it matter if I use bounced or non-bounced addresses?

/B4ckSl4sh\: No (reply to 57253)

/B4ckSl4sh\: how do you actually send funds to the address? (reply to 57252)

Балтика: Tonkeeper (reply to 57255)

Балтика: My plan is to have these contracts serve as a pad between the master wallet and transfer funds in the future. The first replenishment should, as I thought, deploy the contract and send a message to the master wallet about the initial replenishment amount (excluding deployment costs and sending commission)

/B4ckSl4sh\: You should attach stateInit to your message to deploy contract, you don't have this feature in tonkeeper interface, you should deploy your contract by script in prefered language (reply to 57256)

Балтика: What is the point of lazy deployment then? I'm just a newbie 😔

Балтика: My task was to not pay immediately for the deployment of each contract from my wallet and to deploy the contract upon receipt of the first funds. Since a day there may be thousands of users and accordingly thousands of contracts. According to your logic it turns out to be costly.

Я̨kov: To perform some specific action upon deployment and do it just once and never again.  Before contract parameters were introduced in Tact v1.6.0, this one-off function was used primarily to set default values of contract variables (reply to 57259)

Балтика: What is the present value of deploying the contract?

Балтика: I think I got it. The contract address itself does not give anything since it is just an address and the contract code is not in the blockchain. Thank you. So I was just generating a bunch of addresses that had nothing inherently behind them. And when I sent the TON they just stayed there?

— 2025-03-21 —

Alex: I bumped tact version and one of my test starts to fail.  I have contract A, that receives incoming message, then changes it’s state and sends message to contract B. Then contract B processes message and notifies A. If state of A wasn’t changed on step 1 then notification from B fails.   Previously transaction on the last step was ok, and now it started to fail because of state A.  I have debug logs in my contract, then tells me that state was changed. but getter function tells that state didn’t change.  how to deal  with that?

grachzy: Does anyone have an opensource project with dex / liquidity pool on tact?

Anton: TON Studio is going to work on an open-source DEX but it won’t be ready until Q3 2025 (reply to 57321)

Anton: There is PixelSwap DEX written in Tact, but it is closed-source

Anton: Hmm, interesting the Tact team could help you debug the issue, but we would have to look at the source code most likely (reply to 57317)

Anton: Or you can try produce an MRE: https://stackoverflow.com/help/minimal-reproducible-example

Pedro: maybe tact-team can use https://github.com/elizaos-plugins/plugin-ton for the new DEX — I can help with that as I've been developing stuff with it already

— 2025-03-22 —

A: Does anyone know how to configure Blueprint framework to work with MyLocalTon? I'm running an instance of MyLocalTon in my local machine.

— 2025-03-23 —

🔳 ivan: Hello everyone, I am trying to use tact-utils for my project (Laisky/tact-utils on github)  I got an error when trying to compile simple jetton contract  ---------my code  import "../tact-utils/contracts/jetton/jetton";  contract Hello with JettonMaster {  ... everything else like in the README  -------- error  tact-utils/contracts/jetton/jetton.tact:24:5: Trait "JettonMaster" requires field "staticTax" of type "Int", but "Int as coins" given   23 |     owner: Address; > 24 |     staticTax: Int as coins = ton("0.001");  -----------  When I fixed it by patching parent contracts, I got this  ---- Error: tact-utils/contracts/common/traits.tact:50:9: Type "Txable" does not have a function named "reply"   49 |             .toString(); > 50 |         self.reply(answer.asComment());                ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   51 |     }  ----   What is the best way to fix? Are there working recipes for jettons in tact?

Anton: Have a look at https://github.com/tact-lang/jetton (reply to 57487)

Я̨kov: You can probably replace that with cashback(sender()), assuming that you're on Tact 1.6.2+ (reply to 57487)

🔳 ivan: yeah, I just commentedf that out but cashback is better solution , thx (reply to 57491)

🔳 ivan: thx! (reply to 57490)

🔳 ivan: it says not for prod) I am doing semi-prod app (reply to 57490)

🔳 ivan: hope both templates will work on mainnet lol

Anton: it does, indeed  but it’s only because we have not done a security audit for the Jetton contracts (reply to 57494)

🔳 ivan: how close is the tact jetton bytecode to the official one? (reply to 57499)

🔳 ivan: besides developer experience, are there other pros (cons)?

🔳 ivan: i am choosing tact only because of DevEx btw.

Anton: actually, it is also an official Jetton from TON Studio :)  I would also say it is also a more modern version compared to the FunC implementation. You can compare it to the Notcoin Jetton probably (reply to 57508)

🔳 ivan: not sure if I am aware about notcoin jetton unique features (reply to 57511)

— 2025-03-24 —

Amor: Exit code 9: Cell underflow after I upgrade contract In Tact. I can't call any function. How to fix it?

Anton: https://stackoverflow.com/help/minimal-reproducible-example (reply to 57563)

🔳 ivan: is there the same for nft? (reply to 57490)

🔳 ivan: found only this: howardpen9/nft-template-in-tact  does it worth looking into?

maksim: We have porting nft FunC logic to Tact in progress at the moment, it won't be final TEP implementation but it will be something to base your work on, I will update you in the chat when we will have it ready  About the repo that you have referenced, it is not up to date with latest Tact features and changes, so while you can check it, I won't recommend using it in real world, many techniques there are considered deprecated by now

Amor: @name(set_code) native setCode(code: Cell);  message ChangeCode {     new_code: Cell; }  receive(msg: ChangeCode) {     require(sender() == self.owner, "only owner can change code");     setCode(msg.newCode);  } After upgrade code. I encountered Exit code: 9 when I call any function. and contract can't upgrade

🔳 ivan: ok get it. one more question  I want to use WalleetV5R1 with tact-lang/jetton  possible? (reply to 57571)

maksim: Yes, jetton's TEP is designed to work with any wallet implementation, Tact version follows the same rules

🔳 ivan: ok good, so I just change WalletV4 to WalletV5 in the script and can expect it work. thanks

🔳 ivan: in jetton-helpers.ts (buildOnchainMetadata) I see that decimals and symbol are not defined. I can define it there, no problem. but will it be picked up on explorers?

maksim: Yes  We currently are in process of integration of end-to-end tests with API providers and explorers to ensure this behaviour is checked, but with manual checks latest version is good to go

🔳 ivan: I was able to deploy and mint tokens with my walletv5. however tokens are not automatically picked up by TonKeeper browser extension and I can't find "Import token" functionality.  are there any wallets that automatically pick up jettons or provide functionality to import?  I want my users to see their tokens in some popular wallet

/B4ckSl4sh\: Can you, please, share mint transaction link? (reply to 57579)

🔳 ivan: not yet. bot still doesn't allow me  https: //testnet .to nscan .or g/ru/tx/d832e37a86c90506237635e3535a037dad75cffcd0940f342820963ee2eb573d (reply to 57580)

🔳 ivan: I think its because tonkeeper doesn't work with testnet (after clicking 5 times it asks for privatekey to create wallet. i paste private key and it just shows me mainnet wallet with this key -_-

🔳 ivan: i'll try same on mainnet now.

Я̨kov: They changed the UI and testnet wallets can be selected in the wallets dropdown menu (reply to 57633)

🔳 ivan: ok, I deployed test token on mainnet, and still can't see it in my tonkeeper interface (web extension)   tonscan . org /jetton/EQC3pKdaJhIAE2yKhT77YNUNZMB0aKRCu8PD0Jh-9xmaql-5#transactions

/B4ckSl4sh\: You probably need to set "optimizations": {     "internalExternalReceiversOutsideMethodsMap": true } to false   in your tact.config.json (reply to 57642)

🔳 ivan: thank you, that worked (reply to 57643)

Vadim: I am facing the same issue right now, I can see state from dump being changed once I receive the message, but when I call read function later is shows no change, did u find any way to fix it? (reply to 57317)

/B4ckSl4sh\: Can you, please, share an example or something like that? (reply to 57659)

Vadim: I will try to make a minimalistic example with test right now (reply to 57660)

Vadim: I also encouter this issue on migrating to 1.6.4    prikol.spec.ts  FAIL  tests/prikol.spec.ts   ● Test suite failed to run      sources/output/fun_Prikol.ts:1790:5 - error TS1117: An object literal cannot have multiple properties with the same name.      1790     "Contract stopped": 40368,  (I suppressed it for now with putting // @ts-nocheck on every wrapper that is generated, but it also looks like an issue), I believe that it  is  comming from Stoppable stdlib, when I run build it generates Prikol_errors_backward`(Prikol is name of my contract) with two entries of `Contract stopped and assigns second entry error_id 40368

Vadim: As for this issue I’ve put code snippet on gist https://gist.github.com/Datswishty/7901023d8269743f0a453a2dac5a85e8 (it is not the prettiest code) , importang logs are bellow   console.log     #DEBUG#: File sources/prikol.tact:25:9:     #DEBUG#: dump("Inside JettonTransferNotification1")     #DEBUG#: Inside JettonTransferNotification1     #DEBUG#: File sources/prikol.tact:34:13:     #DEBUG#: dump("Inside if")     #DEBUG#: Inside if     #DEBUG#: File sources/prikol.tact:37:17:     #DEBUG#: dump("Inside if2")     #DEBUG#: Inside if2     #DEBUG#: File sources/prikol.tact:39:17:     #DEBUG#: dump(self.jettonWalletBalance)     #DEBUG#: 100        at SmartContract.runCommon (node_modules/@ton/sandbox/dist/blockchain/SmartContract.js:252:21)    console.log     #DEBUG#: File sources/prikol.tact:57:9:     #DEBUG#: dump("Trying to get wallet amount")     #DEBUG#: Trying to get wallet amount     #DEBUG#: File sources/prikol.tact:58:9:     #DEBUG#: dump(self.jettonWalletBalance)     #DEBUG#: 0        at SmartContract.get (node_modules/@ton/sandbox/dist/blockchain/SmartContract.js:301:21)    console.log     0n        at Object.<anonymous> (tests/prikol.spec.ts:93:17)   FAIL  tests/prikol.spec.ts   Prikol     ✕ should work (341 ms)    ● Prikol › should work      expect(received).toEqual(expected) // deep equality      Expected: 100n     Received: 0n  I am using tact-template with tact-compiler 1.6.4, node 23.9.0, macos, my tsconfig is following -  {     "projects": [         {             "name": "fun",             "path": "./sources/prikol.tact",             "output": "./sources/output",             "mode": "full",             "options": {                 "external": false,                 "debug": true,                 "ipfsAbiGetter": false,                 "interfacesGetter": false,                 "experimental": {                     "inline": false                 }             }         }     ] } (reply to 57659)

Anton: thanks for sharing, could you also share the imports so we can reproduce the issue on our side? (reply to 57663)

Vadim: Sure, here - https://github.com/Datswishty/tmp (reply to 57664)

Anton: got it, thanks  we understand where the problem is and will fix it asap  in the mean time, you can replace the Stoppable trait with a custom implementation for now (it should not reuse the “Contract stopped” string in its `require`s, since this what causes that error due to an error message clash) (reply to 57665)

Vadim: just to clarify , having a custom implementation for Stoppable does not fix the issue with https://t.me/tactlang/57663, I’ve tried it with   import "@stdlib/ownable";  trait Unstoppable with Ownable {          stopped: Bool;     owner: Address;      fun requireNotStopped() {         require(!self.stopped, "Contract definetly not stopped");     }      fun requireStopped() {         require(self.stopped, "Contract for sure is stopped");     }      receive("Stop") {         self.requireOwner();         self.requireNotStopped();         self.stopped = true;         self.reply("Stopped".asComment());     }      get fun stopped(): Bool {         return self.stopped;     } }  and although no error in code wrapper, the other issue still persists (reply to 57666)

Anton: Does it work if you remove the return statement from your JettonTransferNotification receiver at line 46? (reply to 57667)

Vadim: wow, it does work then I remove return on line 46 (reply to 57668)

Vadim: I still want to use return though 😂

Anton: thanks for testing, will fix this in 1.6.5 :)  aiming at the end of this week (reply to 57669)

— 2025-03-25 —

KTO: How can I verify a smart contract written in tact? I send a file from build (.fc) and get an error

maksim: Send .pkg file (reply to 57746)

maksim: It is also generated by building Tact sources

KTO: Is this the only option on tact? (reply to 57747)

Я̨kov: Verifying a contract means to ensure that your contract's sources correspond to the generated BoC code.  For that reason and some other considerations, Tact compiler produces a .pkg file as one of the compilation artifacts.  Use that .pkg file on verifier.ton.org :)  https://docs.tact-lang.org/book/compile/#pkg

🔳 ivan: strange error in extension (compiles succesfully)

Petr: Hey, are you using the latest version of the VS Code extension? (reply to 57757)

Petr: 0.4.1

Petr: Oh, looks like it's a bug in the extension, for now you can disable this inspection:   "tact.inspections.disabled": [     "missed-field-in-contract" ], (reply to 57760)

🔳 ivan: in .vscode/settings.json? (reply to 57762)

Petr: yep

Petr: My bad, correct setting:  "tact.inspections.disabled": [     "struct-initialization" ],

— 2025-03-26 —

⚡Mohammed: Hello TON Community,  I'm currently working on a payment management system on the TON network, and it works well with internal payments coming from Web3 wallets that include Jetton data and memo information. I now want to expand the system to support external payments coming from exchanges such as Binance using the TONCENTER library.  My question is:Is there a reliable way to process external payments through the TONCENTER library? What are the best strategies to distinguish these payments (for example, by using the memo address) so that they can be correctly identified and linked to the payment records in my system?  Any advice or practical experiences from the community would be greatly appreciated. Thank you very much!

Andrey: Hi all. Is it extension trusted? https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact  only 264 installs

Oleg: Yes (reply to 57814)

Petr: Hey, this is a new official extension 🙂 (reply to 57814)

Anton: The VS Code extension is currently in the alpha release stage, so please open issues in its repo https://github.com/tact-lang/tact-language-server/issues if something is not working or you have any suggestion

Anton: but it is already pretty powerful and can guide you towards writing better, safer and more gas-efficient contracts

Andrey: Yes, I have already noticed. Thank you very much for making TON convenient for developers! (reply to 57818)

Petr: Stay tuned for the next releases with a formatter that will allow you to write not only efficient but also beautiful code!

LowGas: import "@stdlib/deploy"; import "@stdlib/ownable"; import "./messages.tact";  contract AnyJettonReceive with Ownable, Deployable {     owner: Address;     count: Int = 0;      init(owner: Address) {         self.owner = owner;     }      receive(msg: JettonTransferNotification) {         self.count += 1;     }      get fun get_count(): Int {         return self.count;     } }  Hi devs, who knows, why this receive message doesn’t work, I was sent Jetton assets to contract address, but count= 0

Андрей: Can you please share Address of this contract by text? (reply to 57834)

LowGas: kQBB8elaY-HI5yFvr4yMoeVNQwT6UKDNS3bwv5UxpPpOE4E1 (reply to 57835)

LowGas: https://testnet.tonviewer.com/kQBB8elaY-HI5yFvr4yMoeVNQwT6UKDNS3bwv5UxpPpOE4E1

Андрей: Can you share msg: JettonTransferNotification too? Seems like problem right here

LowGas: message(0x7362d09c) JettonTransferNotification {     queryId: Int as uint64;     amount: Int as coins;     sender: Address;     forwardPayload: Slice as remaining; }

Андрей: Oh, just never mind, when you transfer NOT you transfer only 0.000000001 TON, that is so small to execute contract, you need to transfer at least 0.001 TON ( may be more, just suggestion )

LowGas: Thanks, can I use gas from the contract balance? Because I need to receive Jetton transfer from example wallet (Tonkeeper, MyTonWallet e.t.c) (reply to 57841)

Андрей: Unfortunately no, you can read more in https://docs.ton.org/v3/documentation/tvm/tvm-overview#compute-phase-skipped

Андрей: Usually services use ton connect to resolve this situations

LowGas: But how I can to change this value, because initiator is jetton_wallet, we can change params only in Jetton Transfer 0x0f8a7ea5 (reply to 57841)

/B4ckSl4sh\: forward_ton_amount is the amout that will be attached with jetton_norify (reply to 57847)

— 2025-03-27 —

Dmitry: Hi!  I come from the Ethereum world and there are some things I find hard to understand about Tact.  Suppose I have a receiver that sends some Jettons and then emits a success event.  How can I make sure that the JettonTransfer actually completed before I emit the event?

maksim: Since Ton is asynchronous, the only way to implement your example is to chain transactions as return codes, and emit event only on incoming successful next chain message  For this, you have JettonTransferNotification message in jettons TEP  Some small real world example of this semantic could be found here, however this shows only the end of the "transaction chain", the success check (reply to 57900)

maksim: Basically, you cannot know if send or message functions and their results (out messages) would be successful when you call them, you can only know the result if the receiving contract somehow confirms it

Dmitry: Do I understand correctly that I should set the address of my contract in responseDestination in the JettonTransfer structure, and then make a JettonNotification handler in which I will emit an event about a successful operation for my backend?

/B4ckSl4sh\: No, JettonNotify is only for new  Jettons owner (reply to 57904)

&rey: *make an Excesses handler. (reply to 57904)

&rey: Though you will have no guarantee that it was your transfer which triggered that, EVEN if you check that message was sent from destination's jetton wallet.

Pedro: Tonkeeper is able to tell if a txn will succeed or not before execution. If you want to know about the possible txn outcome without the user executing it, perhaps you need to wrap your logic and make it an 'external' func to be called via front-end/tonkeeper.

Pedro: . (reply to 57904)

&rey: That would work if frontend needed to know about operation success. But what if contract needs? (reply to 57909)

Pedro: Why you can't see the output of a func call in the contract?

Dmitry: Because it's not EVM 😄 (reply to 57912)

Dan: Guys, I'm using web ton ide. And if I deploy and test locally there is no issue with read calls from ide. But in testnet I've got a lotta issue with types or returning objects. Has anybody met this before?

Oleg: Can you provide some examples? (reply to 57917)

Dan: basically I've got two issues. One is that some functions return undefined but shouldn't  Unsupported stack item type: undefined 3:12:46 PM   and other issue that objects returned in base64 and not decoded  {     "type": "base64",     "value": "te6cckEBCAEAfQACA9AIAQMBASACACsAAAAAanf33gAAAAAAAAAAAAAAAAACAQEgBAE7AAAAAWg1+oAAAAABAAAAACAvrwgAIC+vCAQAAAAKBQID0AgGBgEBIAcAVAAAAAGAHQkt0efdwgA/gl5maURaXq/sn8tuEEn26BEUKsxlJ7kkAvrwgEI7zUk="   }  functions that return undefined on testnet but work fine locally in the same scenario:      // Total pending funds by user     get fun getPendingFunds(user: Address): Int? {         return self.pendingFunds.get(user);     }      // Get specific events     get fun getEventById(id: Int): Event? {         return self.events.get(id);     } (reply to 57918)

ed: cannot reproduce. tested with tact-lang 1.6.4 -- upgrading only code everything works as expected, same as before. cell underflow does occur if setData with a different contract's data structure is set, however, there is a workaround of manually handling the data changes and providing reserved cell at contract's deployment (reply to 57572)

Amor: Thanks (reply to 57929)

Amor: Can you please give me docs  providing reserved cell at contract's deployment? (reply to 57929)

ed: define the persistent state variable as a Cell. then parse-update-modify it however you want, update its structure etc and persist it on chain, essentially like you would do it in func. reference: https://docs.tact-lang.org/ref/core-cells/ (reply to 57933)

Amor: Thank

Andrey: Hello everyone! I encountered a problem when updating a contract that has a child contract. If the contract does not have imported child contracts, then the method specified in the documentation works correctly. But if there are child contracts, then after the update everything breaks. I came up with a workaround - I create a child contract date as on funC and write the code in the cell. With this approach, nothing breaks. Is this how it should be or am I mistaken somewhere? Attaching the code for reproduce https://github.com/apashintsev/TactUpgrade

/B4ckSl4sh\: Hmmmmmmm, I think I understood why you get the problem (reply to 57951)

/B4ckSl4sh\: We will try to fix this in next update, what you can try is to make circulliar contract dependencies.  (quite ugly workaround, but still) (Wait for example, I will show) (reply to 57951)

/B4ckSl4sh\: contract A {     number: Int as uint32 = 0; // Different numbers to get different StateInit      receive() {      }      get fun getNext(): StateInit {         return initOf B();     } } contract B {     number: Int as uint32 = 1; // Different numbers to get different StateInit      receive() {      }      get fun getNext(): StateInit {         return initOf A();     } }   Adding this two contracts in your file should help (reply to 57951)

Andrey: It looks like gas expensive, is not it?

Andrey: Child contract will store code of parent and parent will store code of child

/B4ckSl4sh\: You don't need to use this contracts (reply to 57955)

/B4ckSl4sh\: They will just create circular dependencies, and Tact will fallback to different child contract storage (reply to 57957)

/B4ckSl4sh\: That should be compatible with SETCODE (reply to 57958)

— 2025-03-28 —

saqib: Hey Devs,  Building a Betting system for my game. I want to use bets of $0.1, $0.2, $5 and $10 and before the game I need to lock the amount of players in a smart contract and at the end after deduction need to transfer to winner but can't find any doc for how to accept and transfer USDC / USDT from and to Smart contract

saqib: Using tact language

maksim: https://docs.tact-lang.org/cookbook/jettons/#usdt-jetton-operations (reply to 57991)

Ilia: Hey. I've used wrong wallet address during blueprint deployment process and ton-connect cached it somewhere I can't find any documentation where exactly. Is there, I dunno, ton-disconnect or something?

/B4ckSl4sh\: Remove .temp folder (reply to 58027)

Ilia: Thank you! (reply to 58028)

Jimmy: Hello everyone I am looking for articles or documentation that could help me execute signed transactions in TON. I am building a system that will reward users, depending on an action they will receive tokens in their wallet (previously logged in), but I need this transaction to be done without human interaction, and to be processed automatically. The idea is to do this in a tact contract.

Ilia: Do any of iOs Wallet applications allow Testnet connection?

Oleg: Tonkeeper (reply to 58039)

Anton: hey hey, can you please try again? should work on Tact 1.6.5 :) (reply to 57670)

Vadim: Yeah, not it works, thanks! I will do more tests today, will let you know if there are any new issues 🙂 Thank you guys for fast releases! (reply to 58045)

Anton: Thanks for your help 🫡 (reply to 58050)

saqib: hey guys, I created testnet tokens using ton minter and i have tokens in my ton keeper wallet and i just send to following smart contract code but when i want to see the balance, it's returning 0 just and i'm using tonkeeper  import "@stdlib/deploy";  // Define the JettonTransferNotification message structure message JettonTransferNotification {     query_id: Int as uint64;     amount: Int as coins;     sender: Address;     forward_payload: Slice; }  contract JettonReceiver with Deployable {     // State variable to store the total received Jettons     totalReceived: Int as coins;      // Initialization function     init() {         self.totalReceived = 0;     }      // Function to handle incoming JettonTransferNotification messages     receive(msg: JettonTransferNotification) {         // Validate that the sender is a recognized Jetton wallet         // (Implement your validation logic here)         dump("Received JettonTransferNotification from:");     dump(msg.sender);      dump("Amount:");     dump(msg.amount);      // Validate sender (optional)     // Implement your validation logic here      // Update the total received Jettons          // Update the total received Jettons         self.totalReceived += msg.amount;          // Additional logic can be implemented here     }      // Getter function to retrieve the total received Jettons     get fun getTotalReceived(): Int  {         return self.totalReceived;     } }

saqib: https://testnet.tonviewer.com/kQCvLZi-e_FsEyyCWqRQnEFbrdDft-oHUmgUS7q-xpLKCxkM

saqib: also which jettonwallet supports JettonTransferNotification ?

— 2025-03-29 —

Kirill: Hello everyone. Please tell me how best to make sure that the first message always goes one hundred percent. Right now, 0.003 tones are enough to send, but as I understand it, in theory, it may stop being enough   fun createUser(userStorageAddress: Address, userAddress: Address, invitedId: Int, value: Int) {         let userId: Int = self.nextUserIndex;         self.nextUserIndex = self.nextUserIndex + 1;         nativeReserve(self.minTonsForStorage, 0);          send(SendParameters{             to: userStorageAddress,             value: ton("0.003"),             mode: SendIgnoreErrors,             body: SetupUserStorage{                 userId: userId             }.toCell()         });          let init: StateInit = initOf FtUserMain(userId, myAddress());         send(SendParameters{             to: contractAddress(init),             value: 0,             mode: SendRemainingBalance,             body: SetupUserMain{                 owner: userAddress,                 invitedId: invitedId,                 programs: self.programs             }.toCell(),             code: init.code,             data: init.data         });     }

Adam: Use mode pay gas separately with value:0 it will pay gas from the contract balance but be careful as the storage grow as you will need to pay more (reply to 58105)

Kirill: If make like this?    send(SendParameters{             to: userStorageAddress,             value: ton("0.02"),             mode: SendIgnoreErrors,             body: SetupUserStorage{                 userId: userId             }.toCell()         });   receive(msg: SetupUserStorage) {         self.requireMaster();         self.id = msg.userId;         nativeReserve(self.minTonsForStorage, 0);          send(SendParameters{             to: self.owner,             value: 0,             mode: SendRemainingBalance         });     }

Adam: ??? (reply to 58107)

Adam: You changed the value ?

&rey: | SendPayGasSeparately (reply to 58105)

Anton: better use SendPayFwdFeesSeparately since yesterday :)

Adam: Sheesh new version

&rey: Oh. The best rename out there!

saqib: Hey guys need help (reply to 58081)

saqib: I'm stuck on this

saqib: Many jetton wallets are not supporting this forward to amount

saqib: Is there any other workaround?

saqib: I'm doing transactions with USDT for now and there is no so many solutions available to try.

saqib: Users mostly have wallets ton chain support and according to docs they need to send forward a ton amount and in the UI of wallets it's not even supported.

saqib: Stuck from 24 hours 😭😭😭

Андрей: Usually services using ton connect to custom forward ton amount

Amor: You must foward_ton_amount  https://docs.ton.org/v3/documentation/tvm/tvm-overview#compute-phase-skipped (reply to 58081)

saqib: which services ser? you mean wallets? (reply to 58128)

saqib: i know this but there is no option in the wallets for this (reply to 58129)

saqib: ... (reply to 58126)

saqib: i already mentioned this....

Андрей: No, some sort of protocols, e.g. DEXes (reply to 58132)

saqib: but ser, i'm trying this in custom smart contract where user will bet $0.1 - $5 for a room using USDT. (reply to 58136)

saqib: I'm new to this chain also, coming from rust and evm chains

Amor:  const mess = beginCell().storeUint(3, 8).endCell(); // * custom payload     let packed = beginCell()         .store(             storeJettonTransfer({                 $$type: "JettonTransfer",                 query_id: 0n,                 amount: toNano("200000"), // jetton amount                 destination: yourContractAddress, // your contract address                 response_destination: deployer.address!,                 custom_payload: null,                 forward_ton_amount: toNano("0.25"), // * forward ton amount                 forward_payload: mess.asSlice()             })         )         .endCell();     await deployer.send({         to: Address.parse(''), // your jetton wallet address         value: toNano('0.4'),         body: packed,     }) u can custom forward_ton_amount

Андрей: I guess you would have website or TMA, there you can use ton connect (reply to 58137)

saqib: what is this language? (reply to 58139)

Amor: typescript (reply to 58141)

saqib: can i get docs about this? as tact is not supporting. I thought it's func. (reply to 58142)

saqib: On the website, users just have their wallets through which they can pay the required fee for the room in USDT. (reply to 58140)

Андрей: No, it is not language on TON, https://docs.ton.org/v3/guidelines/ton-connect/overview (reply to 58143)

saqib: This runs only in Telegram, right? not outside it... (reply to 58145)

Андрей: Why? No (reply to 58146)

saqib: https://github.com/ton-community/tma-usdt-payments-demo' (reply to 58147)

saqib: this was not running outside the TG

Андрей: Because it sample of TMA that using ton connect (reply to 58148)

Андрей: https://docs.ton.org/v3/guidelines/ton-connect/frameworks/web (reply to 58146)

saqib: This makes sense now, but the problem again is the contract, where I need to lock the amount of bets in the contract, and after the game ends, I need to transfer it back to the winners. Just this thing is left only. (reply to 58151)

Андрей: Firstly you need to understand how jettons work  https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons (reply to 58152)

saqib: yes ser (reply to 58153)

Amor: Contract can't auto send back. You must call it and trigger it send (reply to 58152)

saqib: see here it's also mentioned about this forward_ton_amount but the user wallet don't have this thing and i need to initiate custom transction somehow here?

saqib: yes sir but firstly the tokens must come in the contract! (reply to 58155)

saqib: Using TonConnect, this will be resolved. ? (reply to 58156)

Amor: No. U must custom (reply to 58158)

Amor: if you send Jetton with tonConnect default. It send foward_ton_amount 0.000000001. Your contract receive Jetton but JettonTransferNotification compute-phase-skipped (no excute code in receive(msg: JettonTransferNotification) ) (reply to 58158)

saqib: yes, that's what happening with me at the moment using tonkeeper testnet then what's the workaround here? (reply to 58160)

saqib: and i already implemented this: receive(msg: JettonTransferNotification)

saqib: this (reply to 58139)

Amor: It call contract in your web or Dapp (reply to 58163)

saqib: ooh

Slava: @AntonTrunov that's what I was talking about :)  When the message is sent with this poorly named flag (+1) It won't pay for GAS on the destination contract. It will only pay the forwarding fees. And if you would set the value to zero the destination contract won't be even executed due to the lack of gas.  When sending a message you should always make sure that it carries enough value to pay for the gas and any further forwarding that needs to be done in your execution chain. (reply to 58106)

/B4ckSl4sh\: And that is a reason why it is renamed to SendPayFwdFeesSeparately (reply to 58174)

Anton: Yep, added a new constant and deprecated the old one as you suggested :) (reply to 58174)

saqib: I'm on localhost error getting when trying to connect with modal using    <TonConnectUIProvider manifestUrl="http://localhost:3000/tonconnect-manifest.json">

saqib: ```  {     "url": "http://localhost:3000/",     "name": "TON Vote",     "iconUrl": "https://ton.vote/logo.png"   } ```

saqib: is localhost supported or not

&rey: No. How would wallet app download the manifest? (reply to 58192)

saqib: I don't knowsir. i'm following docs just and there it's written to put the app url (reply to 58193)

Slava: Use zrok, it's very good. (reply to 58194)

Hello, World: Hello!  Can you recommend templates code for jetton, nft to develop on top of them smart-contracts fast?  I found out a project: "tonion-contracts" and want to choose it to not reinvent the wheel, but maybe you can share more code templates that better than this one?

Anton: 🎉 Tact v1.6.5 is released!  Back with another round of refinements! While we're working on many exciting things in the background, we're committed to fixing every bug that the community might discover so that Tact can provide a flawless developer experience.  Furthermore, we now actively employ AI and large language model (LLM) fuzzing techniques, such as documentation-driven approaches where LLMs are given only the Tact language documentation and access to the compiler. Then, LLM agents generate potentially problematic code snippets, compile them, and analyze results. They further iterate and provide new, interesting bug reports — resolving those makes both Tact compiler and Tact documentation better at the same time!  Check out this awesome article from one of the team members to learn more: Documentation-Driven Compiler Fuzzing with Large Language Models.  And now, let's see what's new in Tact v1.6.5, starting with the most prominent part of this patch release:  🛠 Bug fixes  • Ternary operator ?: now correctly works with structs and null values • New parser now properly handles the code that wasn't completed at the end of the file • The error for assembly functions and the get attribute is now correctly shown • Now, when you call the dump() function with an argument of the unsupported StringBuilder type, the error will always be shown even if the debug mode is disabled • Improper whitespace between the operator and the equals sign is no longer allowed • The &&= and ||= augmented assignment operators are now properly short-circuited • Get methods now can return an optional contract state • The Struct.fromSlice(), Message.fromSlice(), and similar functions now work properly if the slice has been parsed entirely and the  last field of the struct had the serialization annotation as remaining • The wildcard symbol _ is prohibited for struct and message struct fields, function names, contract, and trait names • The contract's state is now properly saved on early return statements in the receiver functions  🧳 Miscellaneous improvements  • Whenever you access context().sender, it now calls the sender() function instead to optimize the gas usage • The internalExternalReceiversOutsideMethodsMap option and its respective receiver order optimization were reworked to ensure compatibility with explorers and user wallets • The SendPayGasSeparately constant was deprecated in favor of SendPayFwdFeesSeparately — they're functionally identical, but the latter better expresses the intent and action that this optional flag makes when sending messages • The Stoppable trait now throws the exit code 133 instead of the exit code generated by the require() function from the "Contract stopped" message  📜 See the full release notes for Tact v1.6.5 📥 And upgrade Tact in your projects  LLMs are great, but we value our community no less. It's great being around a bunch of talented, passionate, and bright engineers who make a future of safe and scalable ⚡️ Tact smart contracts on TON possible for everyone. Thank you for everything you do and for the feedback you give!  A special shoutout goes to the RSquad team @rsquadlife for their early adoption of Tact features, thoughtful suggestions, and bug reports. If punk were code, they'd be its maintainers 🤘  🍲 ghibli deez bugs ♨️ @tact_kitchen from the @ton_studio (forwarded from Tact Kitchen)

saqib: Yes I am like using local tunnel to exposed my local IP so I can see the wallet is connected to the website now (reply to 58198)

Slava: 🐈  The future is here... (reply to 58204)

saqib: const senderJettonWallet = "kQCwisASwcXfmtoy1dUEmh-yALAmm38T4-nsE_-4wo_Ibhpt";    const senderWallet = "0QBMzuN8Wosx8WWy2nfC-6ncTPreXOgsE0aR0hQiPA3faIyh";    const recipientAddress = "EQDSWMJAGJWgthdegbd8XEnjr9CmvgxH43toI3aXp3AKCzVe";      // For a jetton with 6 decimals:    const decimals = 6;    const realAmount = BigInt(1 * 10 ** decimals); // 1 jetton in minimal units (e.g., 1_000_000)      // For fees, adjust forward TON accordingly (e.g., minimal amount for gas)    const forwardTon = toNano("0.05"); // e.g., 0.05 TON      // Build the jetton transfer payload    const body = beginCell()      .storeUint(0xf8a7ea5, 32)                          // Jetton transfer op code      .storeUint(0, 64)                                  // query_id (set to 0)      .storeCoins(realAmount)                            // jetton amount (adjusted for token decimals)      .storeAddress(Address.parse(recipientAddress))     // destination: your smart contract address      .storeAddress(Address.parse(senderWallet))         // response_destination: sender's wallet address      .storeUint(0, 1)                                   // custom_payload: empty      .storeCoins(forwardTon)                            // forward_ton_amount to cover fees      .storeUint(0, 1)                                   // forward_payload: empty      .endCell();      if (!connectionRestored) {      return <div>Please wait...</div>;    }      const transaction: SendTransactionRequest = {      validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes validity      messages: [        {          // Call the sender's jetton wallet contract          address: senderJettonWallet,          // Send enough TON to cover fees (adjust as necessary)          amount: toNano("0.1").toString(),          payload: body.toBoc().toString("base64"),        },      ],    };

saqib: hey guys, my transaction is not going for the jettons

saqib: getting this error every time

saqib: and change the wallets order then only i'm receiving just

saqib: back

saqib: from my wallet which contains jettons i need to send to smart contract and it's giving error while if i transfer directly from tonkeeper ui then transction is going through

Ene: How to mine  the coin

saqib: tonminter (reply to 58234)

Ene: Yes

saqib: solved this as i was using the jettor master address not the jettor wallet!

— 2025-03-30 —

Hello, World: It would be awesome if so.  I'm currently researching ton and how to code in tact, but I faced some problems that no latest and safe boilerplates such as jetton and nft implementation in tact, also how to interact with them properly (for instance: how to handle nft receiving to the smart contract address and if in the last message is error, send nft back to user or something like that) (reply to 57571)

Hello, World: By now, there's no clear examples how to work with asynchronous model with minimal pain. Hope it will become much much better in the future.

Hello, World: And if the error occurs need to handle it via bounced function, but can it be more easy way to not think about what will happen, just to not change the state if the got error.  Or it's not possible coz of TVM architecture?

saqib: Hey devs, How should I get TESTNET USDT tokens? I already have Ton Coins but i need usdt one

saqib: isn't there any bridge ??????

/B4ckSl4sh\: Mint anything you want and use it like usdt (reply to 58293)

saqib: Bro, why are there no proper docs? Now, where should I get the JettonWallet code? It's asking for a file.

saqib: 😥😥

&rey: Btw is it planned to replace docs' way of getting JW address with the fully general one via get-methods?

/B4ckSl4sh\: Yes (reply to 58320)

/B4ckSl4sh\: I want also to integrate that in stdlib, to calculate JW onchain if needed (reply to 58320)

angel: To identify and link payments, the best strategy is to use the memo field. (reply to 57803)

angel: Create a blueprint.config.ts file in the root of your Blueprint project to specify the connection to your local TON network. (reply to 57389)

Hello, World: Do you mean for every jetton with just its address? If so, it would be cool (reply to 58322)

/B4ckSl4sh\: For every jetton, but jetton_master's code and data are needed (reply to 58333)

Hello, World: But how it can calculated for every jetton, for swap functionality for example? (reply to 58334)

/B4ckSl4sh\: ? I did not get you (reply to 58335)

Hello, World: In production for example can be different versions of jettons (reply to 58336)

Hello, World: I mean I do not write the code for that jettons

Hello, World: And do not know their data, only address

/B4ckSl4sh\: Yeah, and you will need code and data of for each one (reply to 58337)

/B4ckSl4sh\: You can get that offchain (reply to 58339)

/B4ckSl4sh\: Even in tonviewer for example (reply to 58341)

Hello, World: But dex protocols for example maybe do it via on chain contract deployer or I'm not right? (reply to 58341)

&rey: Jetton address gets into a DEX/some project via offchain means, right?

&rey: Then master code and data can be simply sent along.

P: I can help you. If you need, DM me. (reply to 58137)

Yoviar▪️: Hii

Yoviar▪️: and actually I'm confused about how to connect to smart contracts via nuxt, YouTube videos and documentation are very limited

Yoviar▪️: Btw i deploy in testnet

— 2025-03-31 —

Ivan: Hi I find out that I can't get a Child address in a Parent getter =( Could someone suggest a gas-free(if exist) solution to get Child address for a specific Owner? Here's what I'm trying to do:  contract Parent {     get fun childAddress(str: String): Address {         let initChild = initOf Child(address(str));         return contractAddress(initChild);     } }  contract Child {     owner: Address;     init(owner: Address) {         self.owner = owner;     } }

🔳 ivan: why do you pass string to getter? (reply to 58387)

🔳 ivan: look at jetton getter for wallet code. it accepts owner address

🔳 ivan: do you get an error with this or a wrong address?

Ivan: ty sir 👍 (reply to 58389)

Alireza: how to test bounced messages in with Jest? I wrote the following, but any address with the same shape are considered as valid.  it('should restore balance on transfer bounce', async () => {             // First mint tokens to set up a wallet             const mintAmount = '100';             await mintTokens(env.jettonMaster, env.deployer, env.deployer.address, BigInt(mintAmount), BigInt('100'));                          // Get the deployer's wallet             const deployerWallet = await env.getUserWallet(env.deployer.address);                          // Get initial balance             const { balance: initialBalance } = await deployerWallet.getGetWalletData();                          // Create a transfer message that will bounce             // We'll use a non-existent address to cause a bounce             const invalidAddress = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');              const transferAmount = '50';                          // First execute the transfer to reduce wallet balance             const { transactions } = await deployerWallet.send(                 env.deployer.getSender(),                 { value: toNano('0.1') },                 {                     $$type: 'JettonTransfer',                     queryId: BigInt('1001'),                     amount: BigInt(transferAmount),                     destination: invalidAddress,                     responseDestination: env.deployer.address,                     customPayload: null,                     forwardTonAmount: toNano('0.05'),                     forwardPayload: beginCell().storeUint(0, 1).endCell().beginParse()                 }             );               expect(transactions).toHaveTransaction({                 success: false,             });                           // Verify balance is reduced             const { balance: balanceAfterTransfer } = await deployerWallet.getGetWalletData();             expect(balanceAfterTransfer.toString()).toEqual(initialBalance.toString());          });

Hello, World: "get fun" construction only for off-chain data obtaining? But can I somehow send a message to another contract to get data from get fun? Or another contract should implement not get fun, but receiver for this purpose?

Андрей: No, you can't call get fun from another contract, only receive/send messages (reply to 58443)

Hello, World: Okey, I just face some issues with identification token, I can handle it via jetton transfer notification, but can't get want this jetton is, to do something with jetton (reply to 58444)

— 2025-04-01 —

Yoviar▪️: Hi everyone, today I have finished creating a smart contract and have deployed it on the testnet, and now I want to implement it with vue, what should I create first, do I have to create a wallet contract, I am very confused maybe someone can help

Hello, World: Hello!  If I understood it right for now no way to validate jetton / nft on-chain that jetton has master wallet that I need, as also as NFT item can't be validated that from NFT collection that I need?  I don't found a messages to send from jetton master key by its address to verify that jetton wallet is true its wallet, and I can get nft static data (and collection address), but collection smart-contract has no on-chain message to verify that NFT item is really from right collection that I needed to handle when receive to my smart-contract?

🔳 ivan: you can store wallet code and jetton master address, and calculate expected jetton wallet address, then compare (reply to 58501)

saqib: Hello,  Unsupported stack item type: undefined  I'm getting this error In test enviroment but not in sandbox there it's giving proper msg

Yoviar▪️: Hello, I want to ask whether the get function cannot accept parameters, because I always get an error when I want to retrieve campaign data.  this is my smartcontract code:  import "@stdlib/deploy"; import "@stdlib/ownable";  struct Campaign{     id: Int as uint32;     name: String;     balance: Int as uint32; }  message CreateCampaign {     name: String; }  contract Donation with Deployable, Ownable {     owner: Address;     campaigns: map<Int as uint32, Campaign>;     numOfCampaign: Int as uint32;     campaignId : Int as uint32;      init() {         self.owner = sender();         self.campaigns = emptyMap();         self.numOfCampaign = 0;         self.campaignId = 0;     }      get fun campaign(id: Int): Campaign?{         return self.campaigns.get(id);     }      get fun totalCampaign(): Int{         return self.numOfCampaign;     }      receive(msg: CreateCampaign) {         self.campaigns.set(self.campaignId, Campaign{             id: self.campaignId,             name: msg.name,             balance: 0,         });          self.numOfCampaign += 1;         self.campaignId += 1;     } }   and this is my script for create campaign  import { toNano } from '@ton/core'; import { Donation } from '../wrappers/Donation'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const donation = provider.open(await Donation.fromInit());      await donation.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'CreateCampaign',             name: 'campaign 1',         },     );      provider.sender(); }   and this is script for get Campaign detail  import { toNano } from '@ton/core'; import { Donation } from '../wrappers/Donation'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const donation = provider.open(await Donation.fromInit());      const campaign = await donation.getCampaign(1n);      console.log(campaign); }

Yoviar▪️: Please helpme

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: try with 0n (reply to 58531)

Yoviar▪️: init() {         self.owner = sender();         self.campaigns = emptyMap();         self.numOfCampaign = 0;         self.campaignId = 1;     }   I have replaced it with this

Yoviar▪️: and still error

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: what is error, and please write in EN (reply to 58531)

Yoviar▪️: error is : not a number

Yoviar▪️: on the test it went well  it('should create campaign', async () => {         const message: CreateCampaign = {             $$type: 'CreateCampaign',             name: 'campaign1',         };          await donation.send(             deployer.getSender(),             {                 value: toNano('0.05'),             },             message,         );          const campaign = await donation.getCampaign(1n);         console.log(campaign);     });

Yoviar▪️: it so confusing

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: are you sure you already created treasury instance for deployer?   also, ensure your contract received expected transaction:  it('should create campaign', async () => {         const message: CreateCampaign = {             $$type: 'CreateCampaign',             name: 'campaign1',         };          const result = await donation.send(             deployer.getSender(),             {                 value: toNano('0.05'),             },             message,         );          expect(result.transactions).toHaveTransaction({             to: donation.address,             success: true         });          const campaign = await donation.getCampaign(1n);         console.log(campaign);     }); (reply to 58545)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this is maybe an TS error, is not related to your contract (reply to 58543)

Yoviar▪️: the test runs fine, but when run on the script it gives error, I am also confused, maybe I have to reinstall ts

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: what you mean?  if you have this problem on chain, update your contract and pass an argument to init(). for example get that owner address as arg instead of context.   init(owner: Address) {         self.owner = owner;         self.campaigns = emptyMap();         self.numOfCampaign = 0;         self.campaignId = 0;     } (reply to 58553)

Yoviar▪️: shouldn't owner =sender()?

Yoviar▪️: ok i will try

🔳 ivan: Hey everyone. Somebody recently mentioned that NFT standard implementation in Tact is in progress  How are you going to resolve the issue that Either type is not supported ?

🔳 ivan: I am asking because I encountered the issue when forward payload is not passed properly when I try to use my tact-based NFT on a marketplace

saqib: hey guys, Need help seriously here!!  << import "@stdlib/deploy";   struct Room {     gameType: Int; }   contract TestContract with Deployable {         m_rooms: map<Int, Room>;          init () {         self.m_rooms = emptyMap();           self.m_rooms.set(1,Room{             gameType:1             })         }                get fun getRoomInfo(roomId: Int): Room      {     let roomOpt: Room? = self.m_rooms.get(roomId);     require(roomOpt != null, "Room not found");     return roomOpt!!;     }    } >>  i'm getting following error here: Unsupported stack item type: undefined  Unsupported stack item type: undefined

saqib: when call the getter function

saqib: asking this second time

saqib: how to retreieve the values from mapping?

Андрей: The forward payload is constructed off-chain. At this stage, we can use Slice as remaining, as shown in the reference FunC code: https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/nft/nft-item.fc#L87. (reply to 58561)

maksim: Can you please provide snippet how you call get method?  From typescript code I mean (reply to 58564)

saqib: I'm doing it in TON IDE (reply to 58569)

saqib: on Sandbox enviroment it's working fine but not on testnet and mainnet!

maksim: Can you please provide the link to the contract deployed in mainnet/testnet?

saqib: https://testnet.tonviewer.com/EQCvVgfMXo6AxUCMl4A654_X9K9WrmMxfO94AKKFk2CkCI7O (reply to 58572)

saqib: https://verifier.ton.org/EQCvVgfMXo6AxUCMl4A654_X9K9WrmMxfO94AKKFk2CkCI7O?testnet

maksim: Thanks, our team will check it shortly

saqib: pls pls, i'm stuck on this and need to sumbit my main contract... (reply to 58575)

maksim: I think it works fine in terms of code generation/execution, the problem might be in WebIDE if you get error only there  If not so and you were able to get this undefined somewhere else, please provide more info on it

saqib: Yes, this problem i'm facing on testnet and mainnet in WEB IDE not in the sandbox (reply to 58577)

maksim: Thanks for reporting, we will work on this issue here (reply to 58578)

Oleg: Thank you for reproduction code. It's a problem on the WebIDE side (reply to 58578)

saqib: okay  so how do i test now for local ? (reply to 58580)

maksim: import { toNano } from "@ton/core"; import { Blockchain } from "@ton/sandbox"; import "@ton/test-utils"; import { TestContract } from "./output/sample_TestContract";  describe("contract", () => {     it("should deploy correctly and execute get method", async () => {         const blockchain = await Blockchain.create();          const owner = await blockchain.treasury("owner");          const contract = blockchain.openContract(await TestContract.fromInit());          const deployResult = await contract.send(             owner.getSender(),             { value: toNano(1) },             {                 $$type: "Deploy",                 queryId: 0n,             }         );         expect(deployResult.transactions).toHaveTransaction({             from: owner.address,             to: contract.address,             deploy: true,             success: true,         });          const getMethodResult = await contract.getGetRoomInfo(1n);          expect(getMethodResult).toEqual({             $$type: "Room",             gameType: 1n,         });     }); }); (reply to 58581)

saqib: cmpilation docs, I mean how to build and compile locally (reply to 58582)

Ivan: Hi everyone Could you please help me fill stack parameters for curl req for this getter:  get fun getAddress(a: Address): Address {     return a; }  curl -X 'POST' \   'https://testnet.toncenter.com/api/v3/runGetMethod' \   -H 'accept: application/json' \   -H 'Content-Type: application/json' \   -d '{   "address": "Address",   "method": "getAddress",   "stack": [     {       "type": "?????",       "value": "?????"     }   ] }'

🔳 ivan: not sure I got your answer.   here are my snippets:  message(0x05138d91) OwnershipAssigned {     queryId: Int as uint64;     prevOwner: Address;     forwardPayload: Cell?; }    // forward         if (msg.forwardAmount > 0) {             send(SendParameters{                 to: msg.responseDestination,                 value: msg.forwardAmount,                 bounce: false,                 mode: SendDefaultMode + SendPayGasSeparately,                 body: OwnershipAssigned{                     queryId: msg.queryId,                     prevOwner: prevOwner,                     forwardPayload: msg.forwardPayload,                 }.toCell(),             });         }   any clue how should I change it? (reply to 58568)

Андрей: forwardPayload: Slice as remaining; (reply to 58597)

— 2025-04-02 —

Ilya: Hi! Can you tell me if there is a way to calculate how often I need to top up my smart contract or send messages to keep it active? Let's say I have a smart contract that is active, but I rarely or never send messages to it, but the data it stores is important to me.

/B4ckSl4sh\: Can you, please, share mint transaction link? (reply to 58683)

Defi Fomo: Hi all. why does tonkeeper get this error when transacting via ton connect?

— 2025-04-03 —

Hello, World: What I have to prefer in tact? CamelCase or snake_case?  I just see that everyone write it in their own prefers, but exists some recommendations about variables styling?

Anton: hey, we usually prefer camel case, this will be supported in the Tact language server soon: https://github.com/tact-lang/tact-language-server/issues/520 (reply to 58737)

Hello, World: Thanks (reply to 58738)

Kirill: Hi! Can anyone tell me why dump in init of a child contract only works the third time? (It seems that it is created only the third time)  import "@stdlib/deploy";  message AddChild { }  contract Main with Deployable {          receive("addChild") {         let init = initOf Child(myAddress());         let chunkAddress = contractAddress(init);                  send(SendParameters{             to: chunkAddress,             body: AddChild{}.toCell(),             value: ton("0.1"),             mode: SendIgnoreErrors,             code: init.code,             data: init.data         });     } }  contract Child {     parent: Address;      init(parent: Address) {         self.parent = parent;         dump("child init");     }      receive(msg: AddChild)     {} }   it happens in https://ide.ton.org  upd: with different amount of ton it takes different amounts of call to deploy ;)  i have calculated the formula, it goes like 2N + 1 times of send to deploy, where N - 0.1 amount of ton

Anton: interesting, thanks for catching this, as a workaround you can adjust the amount of toncoin in the settings like so (reply to 58742)

Sol: Came across an interesting situation yesterday: a project launched a smart contract on TON, but due to a small mistake, they lost part of their funds. This isn’t the first time I’ve seen a coding error cost more than the development itself.  Smart contracts are powerful, but without a proper approach, they can cause more problems than benefits. I’ve noticed that many projects ignore audits and fail to plan the logic properly.  Has anyone here faced similar issues?

/B4ckSl4sh\: Mint any token in testnet. For example our jetton:  https://github.com/tact-lang/jetton (reply to 58765)

/B4ckSl4sh\: I didn't get you actually (reply to 58779)

/B4ckSl4sh\: You can check example of mint action in scripts/contract.deploy.ts

maksim: JettonNotification is not connected to mint action in any way, if I had understood your question correctly (reply to 58782)

Бахруз: Здравствуйте ну здесь не по-русски язык?

Oleg: English please (reply to 58791)

Sol: https://t.me/tactlang_ru (reply to 58791)

— 2025-04-04 —

Adera: let mintMessage: Mint = Mint {             queryId: msg.queryId,             receiver: msg.sender,             tonAmount: ctx.value,             mintMessage: JettonTransferInternal {                 queryId: msg.queryId,                 amount: mint_amount,                 sender: myAddress(),                 responseDestination: myAddress(),                 forwardTonAmount: 0,                 forwardPayload: beginCell().storeUint(0, 1).asSlice()             },         };

R: hi

R: 👋

A: Hi guys. How to get the size of contract including data + code to calculate storage fees?

maksim: Hi, check it here (reply to 58848)

Andrei: Hey Perhaps a dumb question, but still Can I deposit jetton to the ton smart contract, and if so, can I send Jettons from smart contract and how? Any pointers to related knowledge base are appreciated Thanks

/B4ckSl4sh\: https://docs.tact-lang.org/cookbook/jettons/ (reply to 58898)

maksim: Here is also repo with tests and jetton interaction examples (reply to 58898)

— 2025-04-05 —

Hello, World: I through I find a way to validate NFT on-chain and it works, but now I understood that someone else can write a custom nft contract to look like another nft collection.  Code from tact docs: inline fun calculateNFTAddress(index: Int, collectionAddress: Address, nftCode: Cell): Address {     let initData = NFTItemInitData{         index,         collectionAddress,     };      return contractAddress(StateInit{code: nftCode, data: initData.toCell()}); }    My code for on-chain nft check: receive(msg: OwnershipAssigned) {         let forward_payload: Cell = msg.forward_payload.asCell().beginParse().loadRef();          let nft_index: Int = forward_payload.beginParse().loadUint(64);         let nft_code: Cell = forward_payload.beginParse().loadRef();          let calculated_address: Address = calculateNFTAddress(nft_index, self.NFT_COLLECTION_ADDRESS, nft_code);          let string_builder: StringBuilder = beginComment();         if(calculated_address == sender()) {             string_builder.append("NFT is correct! ");         } else {             string_builder.append("ERROR NFT!");         }         string_builder.append(nft_index.toString());         string_builder.append(" ");         string_builder.append(calculated_address.toString()); ................. }  It works fine, but I guess if someone will write a custom item contract that will have the same init as passed via payload forward, so my contract will check it and say that nft is correct, but it's not the correct one!

Hello, World: So, now I have no idea how to really check (on-chain) nft item that this is the item from collection I need, not from another collection.

Hello, World: Only can imagine to pass NFT item code when init my smart-contract, because when I did my tests with getgems test version, all my nft had the same smart-contract code

Андрей: You need to store nft code and collection address in your contract, and just forward index, and by index calculate address   receive(msg: OwnershipAssigned) {         let forward_payload: Cell = msg.forward_payload.asCell().beginParse().loadRef();          let nft_index: Int = forward_payload.beginParse().loadUint(64);          let calculated_address: Address = calculateNFTAddress(nft_index, self.NFT_COLLECTION_ADDRESS, self.NFT_ITEM_CODE);          let string_builder: StringBuilder = beginComment();         if(calculated_address == sender()) {             string_builder.append("NFT is correct! ");         } else {             string_builder.append("ERROR NFT!");         }         string_builder.append(nft_index.toString());         string_builder.append(" ");         string_builder.append(calculated_address.toString()); ................. }  btw you can use structures in messages, it helps you not have to do the parsing yourself (reply to 58910)

Hello, World: Yeah, I figured it out in my last message (reply to 58940)

Candy: Hello, I need help explaining the transaction in this contract of mine, the last surplus TON I refunded to the user, why didn't the user's wallet receive it and it's no longer in the contract, so where did this TON go and I can't trace that transaction.

Candy: https://tonviewer.com/transaction/415fa259c08bae4498ffe0515ef091ec84fafe50dd6f4190e594c1566313663c

Candy: Can anyone help! Thanks

— 2025-04-06 —

Adam: with what

Adam: as I see here wallet a recieved the excess as you needed (reply to 58987)

Candy: this is Ton refund (reply to 59029)

Candy: but I can't find it in my wallet nor in the contract

Candy: I can't find the destination of that quantity

&rey: Look on contract B (Value flow tab shows that even more clearly). (reply to 59032)

𝓢𝓮𝓵𝓯-𝓞𝔀𝓷𝓮𝓻: Created an emoji ⚡️, what do you think?

Anton: Looks awesome ❤️ (reply to 59053)

— 2025-04-08 —

Georgiy: 🎉 Misti 0.8 has just landed on NPM!  ⚡️ More Detectors: New detectors to find possible optimizations introduced in Tact 1.6: SuboptimalSend, PreferBinaryReceiver, PreferSenderFunction, ImplicitOpcode and SuboptimalCellOperation.  ⚙️ Improved Integrability: Standartized JSON output for smoother integration.  👩‍💻 LSP Actions Support: Misti now provides API for LSP code actions, introducing quickfix suggestions for some detectors.  🔧 Fixes & Enhancements: Check out the full changelog. (forwarded from nowarp | TON Security)

&rey: Appropriate value for it is .forwardAmount. (reply to 59111)

— 2025-04-09 —

Kirill: Does anyone know why with the growth of messages in the cascade of contracts there can be emissions of 2-3 times on gas fee

— 2025-04-10 —

John: WoW，Tact Fuzzing Agent on No.5 of open router top apps

Philip: You can read more about it here (reply to 59246)

Hello, World: Hi!  If I send a message from my smart-contract to another and got bounced, so I need in my smart contract write bounced function with sent message?  For example: Jetton Transfer -> My Smart Contract (jetton transfer handler receiver) -> Transfer -> Another Smart Contract (Got transfer message but throw bounced) -> My smart contract again So, I need to create bounced<Transfer> receiver?

Hello, World: I mean: a type of bounced message has to be the same type of message that I sent to another contract.  If I sent Transfer message and then got bounced I should handle it as a bounced <Transfer>?

/B4ckSl4sh\: Yes (reply to 59256)

T.E.S: Hi erveryone,  i want connect the nodes (step excess) into a single flow that generates a new node, please sugguest solutions help me

T.E.S: Do you have any solutions? (reply to 59271)

&rey: You'll need a separate contract that counts incoming messages and forwards everything when last one arrives. (reply to 59270)

ShhhToshi: I have a coin show unverified underneath it on tonkeeper wallet.. anyone know why..?

T.E.S: Yes, it's my contract, so I want to map each excess to a new step. (reply to 59273)

T.E.S: const OP_CODE_EXCESS_JETTON: Int = 0xd53276db;  receive(msg: Slice) {         acceptMessage();         // require(msg.bits() >= 32, "Message too short for opcode");          if (msg.bits() >= 32) {             let op: Int = msg.loadUint(32); // Load opCode từ body             if (op == OP_CODE_EXCESS_JETTON) {                 // let value_refun = context().value - ton("0.005");                 // let fee_refun = ton("0.005");                 let msgValue = context().value;                 self.pending_user_fee.value += msgValue;                 emit("OP_CODE_EXCESS_JETTON".asComment());                 emit(msgValue.toString().asComment());             }         } else {             emit("Thank".asComment());         }     }  it's code hook excess

T.E.S: so i don't solutions map all excess

&rey: // initialize skip_transfers=jetton_excess_count-1 receive(msg: Excess) {     if (self.skip_transfers > 0) {         self.skip_transfers -= 1;     } else {         send(..., mode: SendRemainingBalance ...)     } } (reply to 59277)

&rey: In a separate contract.

T.E.S: your solutions only handle step excess end, don't map all excess to new step (reply to 59279)

&rey: I claim this solution matches what you drew, sending all TON to A in one tx, exactly. (reply to 59282)

Terry: it's default, for verify, pls push your jetton infomation to ton assets github repo (reply to 59275)

&rey: Could you draw what my solution does in your opinion? (reply to 59282)

T.E.S: thanks, i control total excess after handle step end (reply to 59283)

T.E.S: i want return remaining  value for user (reply to 59285)

&rey: At this step I cannot understand your sentences at all. (reply to 59286)

T.E.S: ah, i control total transfer jetton, after match excess end (total_excess  == total transfer)  then return remaining value (reply to 59288)

— 2025-04-11 —

ShhhToshi: Hey is there any tonviewer team here ?

Ansar: hi,  i am new to tact language from where i can learn that from scratch , thank you

/B4ckSl4sh\: https://docs.tact-lang.org/book/learn-tact-in-y-minutes/ (reply to 59355)

Hello, World: Hi, there!)  According to tact docs there's 224 bits on bounced event: Currently, bounced messages in TON have only 224 usable data bits in the message body and don’t have any references.     But I guess it's not enough to store even one Address type on bounced message. So, if smart-contract sent jettons or nft, there's no possible check for why recipient of that asset.  So, the question here is that query_id solves the problem? I'm thinking about create a map in my smart-contract that will hold info about query_id and if something is going wrong in bounced message I can retrieve an address of sender and other useful data.

/B4ckSl4sh\: Yeah, in some cases that is good approach. But be careful about maximum map capacity (reply to 59368)

Hello, World: Thanks, I will try this approach out (reply to 59369)

&rey: Don't trust user-passed query IDs because user can send two messages with the same. Instead, use curLt() for outgoing bounceables. (reply to 59368)

Hello, World: Yeah, I will generate a pseudo-random value when sent a message inside the smart-contract (reply to 59378)

&rey: curLt() is better since it is guaranteed to be unique on each transaction within one contract. (reply to 59379)

— 2025-04-12 —

zin: 🤔

Vladimir: 🎉 Welcome Challenge: A Tact Developers Competition!  DivaTech is launching TON Contests — a platform for hosting competitions for TON smart contract developers.  To celebrate the launch, we’re kicking off our first contest — Welcome Challenge with a $1000 prize pool!  You’ll face 5 easy-to-medium-level tasks in Tact smart contract development, with 6 hours to solve them.  📅 When: April 13, 3:00 PM – 9:00 PM (GMT+3) 🌍 Where: Online at toncontests.com  🏆 Prizes:  🥇 Top 5: $100 each  🥈 Next10: $35 each  🥉 Next 15: $10 each  Registration for the Welcome Challenge is now open

Slava: Hey. Even if you can request this information on-chain, the moment you will receive it — it will be outdated, because the user can transfer them away in the next message. (reply to 59516)

— 2025-04-13 —

Abbas: how do I get ~10-15 testnet accounts funded to do a final testnet testing of my contracts? do I have to wait 15 hours to get 2 TOn in each? :D can't i just pay for the TON? That'd be easier and quicker

Slava: Kindly ask @f_closer (reply to 59567)

Slava: Also, reducing your "prices" on testnet is probably a good idea.

Abbas: Isn't the point of testnet to do a real-world, beta test? if my contract needs 10 TON for each participant (whcih is not much, around $40) how the heck am i supposed to test it with 5 participants on testnet

Amir: TON blockchain support HD wallets

Kristjan: Hello guys, plz help me...

Я̨kov: There's no function in the stdlib, but you may add this asm function to your code:  asm extends fun asInt(self: Bool): Int {}  And then use it as such: true.asInt() (reply to 59595)

Я̨kov: I'll just leave this page here for no reason at all: https://docs.tact-lang.org/book/gas-best-practices/

Anton: looks like this can be useful for the ongoing challenge: https://t.me/tactlang/59471 (reply to 59601)

Skuli: I was the first to solve all 5 problems. Of course, I tested the AI ​​tools. We are waiting for the results and will see how well the AI ​​coped with this test.

Я̨kov: It's an extension (extends), but not an extension mutation (extends mutates) function. Hence, it cannot mutate the value.  Either assign the x.asmInc() back to x somewhere (x = x.asmInc()), or add a mutates attribute and remove the return type:  asm extends mutates fun asmIncMut(self: Int) { INC }  // ... let x = 0; x.asmIncMut(); // x is now 1 (reply to 59604)

Yoviar▪️: Has anyone here ever created a donation website with ton blockchain implementation? I really need a tutorial.

Yoviar▪️: Yes, I'm looking for a tutorial, or other implementations besides Jetton and Mint Token, I didn't find any, especially those implemented with the Vue library.

Yoviar▪️: Is there no example from the developer side?

Abbas: I dont think a donation website needs tact. It needs a payment gateway

— 2025-04-14 —

Yoviar▪️: I have created the smart contract using tact, what I am confused about now is the integration between my tact smart contract and vue

Yoviar▪️: Maybe anyone can create a smart contract integrated with Vue, especially to call the receive method in the smart contract, maybe on YouTube, for my learning.

Yoviar▪️: I don't have a mentor, that's why I'm so confused wkwkwkkw

Yoviar▪️: I just learn from Alefman & TON channel

Hello, World: In my opinion it will be the same as it in react js, but just UI connect wallet implementation is different (reply to 59675)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: you already have good resources. check that TMA with TON integration (Sample Token Minter) course from Alefman (reply to 59679)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Sending whole balance via first message and return it after process can be an un-safe solution. your task should triggering by token transfer notification msg and your required data can store in payload (reply to 59516)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: but there is no way to interact with your contract from zero balance wallets

— 2025-04-15 —

Anton: 🧠 Tact Smart Battle 🤜  Join the ultimate smart contract challenge powered by Tact, organized by TON Studio & Codeforces  🏅 Prize Pool — $20,000 in Toncoin!  🎯 Challenge Tasks: 1. Simple Voting — basic voting system. 2. Serial Voting — multiple proposals via a master contract. 3. Scalable Voting — support up to 4 billion voters. 4. Voting with Refunds — refunds to voters. 5. Gas-Managed Voting — fully optimized contracts.  🏆 Rewards: - Top 128 participants share the prize pool and receive exclusive Soulbound Tokens (SBTs). - All participants with valid solutions also receive a Participant SBT. - SBTs include embedded on-chain developer reputation.  ⭐️ Additional Perks: - Top participants will be invited for job interviews at TON Studio.  ⏰ Duration: 7 days  🗓️ Start Date: April 21, 12:00 (UTC+3) 🛑 Deadline: April 28, 12:00 (UTC+3)  Registration: 👉 Challenge Link (Codeforces)   Registration guide: 👉 Notion link  Community & Support: 👉 Telegram Challenge Chat  Good luck and may your contracts be efficient and bug-free! 🚀🔥 (forwarded from TON Contests)

abdallah: can some one of top 5 share the solution for the fifths problem (reply to 59603)

Niloy: If there are any emoji or sticker sets that contain all animated 3d coins like bitcoin, toncoin

Shi Wei: Hi, when will the winners be announced and how do we get the prize money? (reply to 59471)

Евгений: from contest page:   Prize Distribution: Contest results will be checked by juries for correctness and compliance with the rules. After that, rewards will be sent to connected wallets by April 17, 18:00 GMT+3. (reply to 59778)

Shi Wei: Thanks!

Yet Another Anti-Spam Bot: Bot decided that this is a spamer. Is it correct? Vote (1/3)

Алексей: I am wondering why Tact doesn't support default fields value in contract parameters? I am tending to use init approach just because I can have defaults. Would be cool if I could write like this   contract Test(     x: Int as uint64,     y: Bool = false, ) {     receive() { cashback(sender()); } }

Я̨kov: We have some ideas how that could be done, including enhancements on the TypeScript wrappers side.  As of now, you can use structs to represent the contract's state. Here's how:  struct ContractState {     field1: Int as uint32 = 0;     field2: Bool = false;     // you can add or remove fields here,     // and all fields of this struct     // would constitute the contract's data }  contract Showcase(     state: ContractState, ) {} (reply to 59805)

Anton: this can only affect the TS wrappers, and onchain deployments by a parent contract  so, yeah, the example by @novusnota42 is good and can be extended like so:   contract ShowcaseParent() {     receive() {         deploy(DeployParameters {             value: 0,             mode: SendRemainingValue,             body: Msg { queryId: 42 }.toCell(),             init: initOf Showcase(ContractState {}),         });     } } (reply to 59805)

— 2025-04-16 —

Daddy: I don't know if I can ask questions here I don't want to get banned

Ivan: Hi, What’s the difference between JettonWalletGovernance and JettonWallet in /tact-lang/jetton? I couldn’t find anything in the docs or chat history.

Ivan: i dont mean a line-by-line comparison, just wondering about the purpose of Governance 😅

maksim: Governance is a partiially TEP-compatible (no burn) jetton, that is used in USDT on TON. It includes lock mechanics (freeze wallets, etc) (reply to 59853)

maksim: So it is an another popular jetton interface/implementation

— 2025-04-17 —

sape: How do I get the hexadecimal value not decimal value of the sha256 function?

sape: The documentation does not say anything except it returning an Int

Anton: If possible, you should not do anything with strings in your contract (reply to 59880)

sape: This feature is required for the contract

sape: I ended up creating a hex version of the decimal but it is not the right thing to do

sape: Is there a limitation for strings? (reply to 59882)

Anton: it’s inefficient in terms of gas

Anton: you should be able to move all string processing into your backend/frontend (reply to 59883)

sape: Understood. The thing is I am not saving strings just comparing a value generated on the fly with the front end to match them

Anton: why can’t you compare numbers?

sape: I want to create a fingerprint out of the hex value

Yoviar▪️: I want the wallet connection to the website to automatically disconnect when the user exit the browser. Is there anything that can help? const isBrowser = sessionStorage.getItem("browser"); if (isBrowser == null) {   await tonConnect.disconnect(); } I am using this code, but I think it can be improved, or there might be better practices that can be applied.

sape: You may be able to use the beforeunload event. The thing is page reloads and back button presses will also activate it. (reply to 59891)

Yoviar▪️: isn't unload used for reload? (reply to 59892)

sape: Reloads and closing tabs

Yoviar▪️: Yes, what I want is when the user exit the browser, that's why I use session storage, when reloading or switching tabs, I want the wallet to stay connected to the website.

sape: Seems like you have the closest thing to detecting a close then

sape: Unless the browser itself triggers an event when closing you're limited to JS capabilities

Yoviar▪️: Yes that's right, I'm copying the feature on the initia website, when the user exits the browser the wallet automatically disconnects, maybe I should implement a jwt token

Yoviar▪️: so that there is no need to disconnect when the user closes the browser

sape: This would make it better for the user to be honest (reply to 59898)

Samyar: How can i check if the contract address received an NFT?

/B4ckSl4sh\: Here are the example of builing onchain metadata in tact, It will help you to write parsing https://docs.tact-lang.org/cookbook/nfts/#onchain-metadata-nft-collection (reply to 59913)

Shi Wei: Is anyone willing to share their code for problems 4 and 5 of the welcome contest?

Евгений: I'm in top15 though, so probably not best optimization (reply to 59920)

— 2025-04-18 —

Shi Wei: Thanks so much!

AGT: How to add Jetton addresses in batches? Can any volunteers answer my questions, please🙏🏿

Samyar: it hasn't event started... (reply to 59920)

Anton: it’s about the contest by DivaTech that took place last Sunday (reply to 59983)

Samyar: oh, i didn't know about it (reply to 59984)

— 2025-04-19 —

Yet Another Anti-Spam Bot: Bot decided that this is a spamer. Is it correct? Vote (1/3)

Chinonyerem Σ 🆙 UXUY ⚡VIA: hello, good morning. please can I use visual studio code to compete for the Tact Smart Battle? (reply to 59984)

Anton: Hi, sure  You can install the Tact extension by TON Studio either - from the marketplace: https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact - or from Open VSX: https://open-vsx.org/extension/tonstudio/vscode-tact (reply to 60076)

Chinonyerem Σ 🆙 UXUY ⚡VIA: ok thank you very much (reply to 60077)

Sol: I am ready to discuss your idea for implementation, places are limited - write to PM

Georgiy: The new patch release supports the latest Tact version 1.6.6

Georgiy: Misti 0.8.1 has just been released.  🔧 This patch release introduces Tact 1.6.6 support and includes minor changes and fixes. Check out the full changelog. (forwarded from nowarp | TON Security)

— 2025-04-20 —

kragle: Hey guys, probably a very simple question: does anybody know how to get a size of a String literal or String builder in Tact? I'm writing a validation of message input to make sure the payload doesn't exceed N characters. Thanks in advance!

Yoviar▪️: receive(msg: WithdrawCampaign){         self.requireOwner();         require(self.campaigns.exists(msg.id), "campaign not found");          let campaign = self.campaigns.get(msg.id);         let balance = myBalance();          require(campaign!!.balance >= msg.amount, "insufficient balance");         require(balance > msg.amount, "insufficient balance");          send(SendParameters{             to: self.owner,              value: msg.amount,              mode: 0,             bounce: true,         });          require(balance > myBalance(), "failed withdraw campaign");          self.campaigns.set(msg.id, Campaign{             id: msg.id,             name: campaign!!.name,             balance: campaign!!.balance - msg.amount,         });     }  I have a function like this for withdraw balance, and now I'm confused, why require after send can't run properly? is there a solution?

Евгений: Caution  Beware that all message-sending functions of Tact can change the actual balance of the contract, but they won’t update the value returned by this function. (reply to 60191)

Slava: You should thoroughly understand how the Blockchain works before writing the code. Writing the code without knowing the principles is very dangerous. (reply to 60191)

Baran Battal: hello everyone , how to fix this ?

Евгений: I guess someone need to update that dependency, then this warning should disappear (reply to 60204)

Yet Another Anti-Spam Bot: Bot decided that this is a spamer. Is it correct? Vote (1/3)

— 2025-04-21 —

Алексей: Is it possible to write extending mutating function on map?

Алексей: I see this stuff in stubs.tact  extends mutates fun set(self: map<K, V>, key: K, val: V);  But when I try  extends mutates fun mySet(self: map<Address, Bool>, k: Address)  I get this error Extend functions must have a reference type as the first parameter

Anton: A workaround for now would be to wrap your map into a struct:   struct CustomMap {     m: map<Int as uint32, Bool> }  extends mutates fun foo(self: CustomMap) {     self.m.set(0, true);     self.m.set(1, true); }   This will be supported natively in one of the next upcoming Tact releases (reply to 60283)

Pavel: Hello everyone, could you please advise how to identify the token I created on minter ton org  in the contract.

Pavel: fun calculateJettonWalletAddress(     ownerAddress: Address,     jettonMasterAddress: Address,     jettonWalletCode: Cell ): Address { If I understand correctly:  ownerAddress refers to the contract address (myAddress())  jettonMasterAddress is the address of the Jetton Minter contract from minter ton org  Question: Where can I obtain the jettonWalletCode value? Is this typically predefined in the TACT standard libraries, or should it be retrieved from the minter contract?

maksim: If you are wondering about accepting this token inside your contract or calculating jetton wallet addresses based on the minter address, you can check this example from our cookbook

Pavel: Thanks! (reply to 60291)

maksim: You can retrieve it from the explorers in case of already existing jettons, or directly from Tact-generated wrappers in case of Tact-Jetton  Second case is covered in the link above (reply to 60290)

Potok: Can you tell me how to check for an entry in slice and, if not, add this entry to slice? Something like that: addressHash  = context().sender.aslice().hash(); s: Slice = beginCell().endCell().beginParse().loadBits(2048); if (s.getBit(addressHash)) {             throw();         } s.setBit(addressHash, true);

Zewa 🧻: > Implementing Map from scratch for the codeforces event 😄

— 2025-04-22 —

......: how can we verify that a same address can't interact with a contract twice without using map because they are too costly if address are in millions?

maksim: Apply same concept as from web2 point of view - sharding (reply to 60428)

......: votedShard: map<Int as uint32, map<Address, Bool>>; does tact doesn't have structure like this?

Я̨kov: You can make nested maps through structs as values, but it'll be quite expensive.  The idea of sharding is that you have a parent contract which deploys many child contracts — one per each user (user's wallet). Then, the parent and child contracts exchange messages to update each others states when needed, with all necessary checks upfront.  For an example, see the Jetton (token) implementation, where Minter is the parent contract and Wallet is the child: https://github.com/tact-lang/defi-cookbook/tree/main/jettons/impl/basic (reply to 60432)

Samyar: how can i check if a contract is already deployed?

Anton: you can send it a message and wait for reply (reply to 60438)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Hi there. for sending a message with body to sender in optimized way, what is the best function to use? send OR message OR self.reply?

maksim: message  but it also might be deploy, depending on your use-case (reply to 60450)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: thanks for response.   I want to reply to sender onchain which already deployed (reply to 60451)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: so why message() has Gas-expensive tag as send() in docs?

Я̨kov: Although message() is more effective than send(), they both use 500 gas or more simply due to the nature of sending messages on TON and the required logic underneath.  Both functions are implemented in Fift/TVM assembly, so if you want a more in-depth answer, you can read the sources — send() just has more things to do :) (reply to 60453)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: this is awesome. thanks for your time 👍🏻 (reply to 60454)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: message is not bounced at throw:  deploy(DeployParameters{             init: initOf ChildInfo(myAddress(), sender(), false),             mode: SendPayFwdFeesSeparately,               bounce: true,             value: 0,             body: msg.toCell()         });  here is my receiver:  receive(msg: InitChild) {         throwUnless(401, sender() == self.parent);         throwIf(500, self.initialed);         self.initialed = true;     }

— 2025-04-23 —

&rey: Because there's nothing to bounce, no TON remaining in the message. (reply to 60508)

Yet Another Anti-Spam Bot: Bot decided that this is a spamer. Is it correct? Vote (1/3)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Is it possible to be sure parent will receive the bounce without sending the remaining value? (reply to 60547)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: SendPayFwdFeesSeparately | SendBounceIfActionFail is not affect  :/

Kent: Hello

Kent: Yes

Lols Anti Spam: MEM: false TON Tact Language Chat

&rey: You should really look at what the last contract receives, and check what is needed to cause the bounce. (reply to 60582)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: send() works as expected but deploy() (reply to 60622)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: also deploy() is work without cashback(). cashbasck after deploy

Денис: Hello everyone, can someone help with creating simple minter? I tried with funC, but it doesn't work, I'm confused now

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: We need an clarifications on C & E. I don't know how to contact with TON Studio team

&rey: Ask via Codeforces interface. (reply to 60637)

Bulat: A, B, D also have very weak tests. Rule Any voter can vote only one time. is not properly checked

Anton: Folks, this is definitely offtopic here

ahajkda: Does anyone know, If I want to receive some funds in the contract, reserve a percentage of it and send the remainder to some other address, do I have to freeze the funds I want to keep somehow or how does it work?

&rey: You just send an outgoing message with appropriate value. Everything else will remain owned by the contract. (reply to 60667)

Denis: Is there a cheap way (as in "not via a Cell") to get the hash from an Address?

— 2025-04-24 —

Daniil: I think you need parseStdAddress  https://docs.tact-lang.org/ref/core-addresses/#parsestdaddress (reply to 60687)

Denis: The part I was missing was asSlice on Address. Now, is there some built-in cast from Bool to Int?

tyulpan: here: https://t.me/tactlang/59597 (reply to 60747)

Yoooy: Hi guys! please tell me if someone knows the best practice of using SendOnlyEstimateFee. I would be very grateful for an example of usage. I couldn't find anything in the documentation except the description.

— 2025-04-25 —

Fedor: Hi, I came across a strange behavior with nativeReserve function. I have the following code:  receive () {  dump ("do reserve and cashback");  dump (myBalance());  nativeReserve (1_000, 0);  cashback(sender)); }   My expectation is that I would reserve 1k nanoton in my smart contract and return the rest to the issuer.   I wrote a test where I send an empty message with 1 ton to this contract. I expect that the contract balance would be 1_000 nanoton, but somehow in my tests the cashback() doesn't seem to return any funds to the sender

Fedor: Here is the logs of my test

Fedor: I am failing to understand what I am doing wrong here, because based on the docs it does sound like nativeReserve is intended to be used in conjunction with cashback()

Salvatore: Same here. Did literally exact same thing, tried to play with mode values, yet didn’t work for me. Will try again soon, if I could find the solution I’ll tell you, if nobody answers (reply to 60853)

Salvatore: This got me curious… 🤔 Unsuccessfully tried to find more information about nativeReserve or some prod code examples

&rey: Please check /book/send/#outbound-message-processing in Tact docs. (reply to 60853)

X$💰🍀🇺🇦: 😌😊 (reply to 60864)

Fedor: Do I miss something specific? I did read that section and it does explain that it is tricky to correctly send 2 messages working with the balance, but that at the end it mention that it is encouraged to use nativeReserve and then return the remaining balance using send (cashback is more user friendly wrapper over send) (reply to 60860)

&rey: cashback uses SendRemainingValue under the hood. (reply to 60866)

ahajkda: I am experimenting with asm code but documentation of sending messages seems a bit ambiguous to me, does anyone have any experience in this regard?

— 2025-04-26 —

Baran Battal: Are there any useful resources to learn how to use fift with tact?

Gosha: Hey! Can someone help plz, how to implement asm function DICTGETNEXT. Which parameters and returns should it have? I tried several variants, but keep getting exit_code: 7(

Baran Battal: Is there any resource explain gas cost for tact syntax?

— 2025-04-27 —

Mykola: Question about task2. What does it mean: to impersonate the `ProposalMaster` contract

SHY(⁠*⁠_⁠*⁠): When the deployer of the new proposal is not the proposal Master (reply to 60974)

Mykola: Thanks for clarification. (reply to 60976)

Igor: Hi! I have function receive(msg: Message) {   self.counter += 1;   //commit();   require(msg.amount < 10, "amount < 10 required");   //...code here  } In current implementation counter is rolled back when require "fails", but I want to persist counter change on every message. How to achieve this? I see commit() function in the doc, but looks like it does something different...

Евгений: commit should preserve storage even if error occured (reply to 60984)

Евгений: Another way I see, is that you can send back message with error code, instead of throwing error in compute phase

Igor: It doesn't save self.counter even with commit(). I dump it every time and it increments only it there was no error... (reply to 60986)

Igor: Hm, seems like possible solution How to send message with exit code? (reply to 60987)

Евгений: hm I have no idea then, commit worked for me

Евгений: just normal message using 'send' or 'message' functions (reply to 60989)

Евгений: that's what I mean

Евгений: but receiver should know and parse that message

Евгений: that's not standard

Igor: Hm, could you please then send some example with commit if it works for you? I think that I'm wrong in some really tiny detail

Алексей: I guess it's kind of tact issue, because before the commit you need to manually set C4 register and the tact does it for you automatically but only at the end and after commit (reply to 60988)

DeFi Maestro: What is the issue? (reply to 60636)

Anton: you can check how it’s done in our benchmarks:  https://github.com/tact-lang/tact/blob/main/src/benchmarks/contracts/wallet-v4.tact#L119-L120  This is a known issue, btw. https://github.com/tact-lang/tact/issues/2496 (reply to 60995)

Алексей: Don't know if it is known issue   message Hello {     name: String }  contract Test {     receive() {         message(MessageParameters{             to: sender(),             value: 0,             mode: SendRemainingValue,             body: Hello.toCell(),         });     } }   There is syntax error (maybe not?), but the compiler doesn't tell it in a nice way, only fails at a func stage

Ilia: Is there any documentation page that clearly explains how map is serialised and stored and how much memory in contract storage it takes?

Я̨kov: Not sure about the coverage or clarity of it, but there's an in-depth section on maps in TON Docs: https://docs.ton.org/v3/documentation/data-formats/tlb/tl-b-types#hashmap (reply to 61022)

Mykola: Question about task 4:  The `ProposalMaster` contract should have a top-up empty message receiver that increases the contract balance to 0.01 TON each time it is invoked. What should it do when balance is already larger?

Mykola: The contract should accept all the funds if the incoming message carries a smaller TON amount. Does it mean that smaller messages = smaller than 0.01TON ?

/B4ckSl4sh\: I'd recommend you to use nativeReserve with mode ReserveAtMost (reply to 61043)

MaratㅤSafiyev: Hello guys! My friend wrote for me the smart contract. Can u check it?   https://github.com/SAFIYEV/token1/tree/main    Thanks🙏

Destiny | Matchain 🔥: What's it for (reply to 61054)

&rey: It does not work. (reply to 61054)

MaratㅤSafiyev: Oh why?

&rey: I'm not interested in making THAT (essentially honeypot, due to pause ability) work. (reply to 61061)

MaratㅤSafiyev: I can't write now smart contacts i am learning. I asked my friend to write for me smart contract. And he sebt me that.   Okay bro, thanks

Ilia: What is the difference between using MessageParameter's field bounce and mode SendBounceIfActionFail?

— 2025-04-28 —

Crypto: guys, is there any way to save gas, such as asm

— 2025-04-29 —

/B4ckSl4sh\: The hard way is to normalise external message hash and then wait for message in loop (reply to 61191)

/B4ckSl4sh\: The easy way is to use Toncenter, they will do that for you

/B4ckSl4sh\: let me find the needed method (reply to 61193)

/B4ckSl4sh\: Try /api/v3/message (reply to 61194)

DeFi Maestro: Yes, you can use Tact's asm, but it's experimental and can be tricky to debug. (reply to 61108)

Ilia: can you expand a bit what "wait for message" means? which api are you referring to? (reply to 61192)

— 2025-04-30 —

A: I've seen something like this in this repo: https://github.com/ton-blockchain/minter/blob/main/src/lib/deploy-controller.ts#L181  async burnJettons(     tonConnection: TonConnectUI,     amount: BN,     jettonAddress: string,     walletAddress: string,   ) {     const tc = await getClient();      const waiter = await waitForSeqno(       tc.openWalletFromAddress({         source: Address.parse(walletAddress),       }),     );      const tx: SendTransactionRequest = {       validUntil: Date.now() + 5 * 60 * 1000,       messages: [         {           address: jettonAddress,           amount: toNano(0.031).toString(),           stateInit: undefined,           payload: burn(amount, Address.parse(walletAddress)).toBoc().toString("base64"),         },       ],     };      await tonConnection.sendTransaction(tx);      await waiter();   }  The code uses the old ton package which I prefer not to use. The await waiter(); part is where I'm interested in. But I don't understand how to bring it to my code which uses the latest version of @ton/ton package (reply to 61196)

/B4ckSl4sh\: Just save current seqno, send transaction and then wait for seqno to change (reply to 61324)

A: How to wait for seqno to change? I tried to rewrite the waitForSeqno function available here. But I'm totally confused. the Wallet type is not available in @ton/ton package. Instead there is WalletContractV4. Here is my code: export async function waitForSeqno(provider: ContractProvider, wallet: WalletContractV4) {   const seqnoBefore = await wallet.getSeqno(provider);    return async () => {     for (let attempt = 0; attempt < 25; attempt++) {       await sleep(3000);       const seqnoAfter = await wallet.getSeqno(provider);       if (seqnoAfter > seqnoBefore) return;     }     throw new Error("Timeout");   }; }  But I don't understand how to use it in my sendTransfer function: const client = useTonClient(); const { sender, walletAddress } = useTonConnect(); sendTransfer: async (amount: string | number) => {             const forwardTonAmount = toNano("0.05");             const forwardPayload = beginCell().storeUint(0, 1).endCell().asSlice();             const packedMessage = beginCell().store(                 storeJettonTransfer({                     $$type: "JettonTransfer",                     queryId: BigInt(Date.now()),                     amount: toNano(amount),                     destination: Address.parse(SOME_ADDRESS),                     responseDestination: sender.address!,                     customPayload: null,                     forwardTonAmount,                     forwardPayload                 })             ).endCell();              await sender.send({                 value: toNano("0.1"),                 to: contract.address!,                 bounce: true,                 body: packedMessage             });         } (reply to 61325)

/B4ckSl4sh\: your waitForSeqno looks good, what exactly is not working? (reply to 61330)

A: I don't understand this part: const waiter = await waitForSeqno(       client.openWalletFromAddress({         source: Address.parse(walletAddress),       }),     );  there is no function named openWalletFromAddress()  in the latest version of TonClient (package @ton/ton) (reply to 61332)

/B4ckSl4sh\: const walletContract = WalletContractV4.create({     workchain: 0,     publicKey: keyPair.publicKey, }); const openedWallet = client.open(walletContract); (reply to 61334)

A: Thank you but I'm using @tonconnect/ui-react and @tonconnect/ui packages. I don't create WalletContractV4 manually. Is there any way to wait for seqno using these packages? (reply to 61335)

/B4ckSl4sh\: Obtain wallet address from tonconnect and call get-method seqno on this address using, for example toncenter  https://toncenter.com/api/v3/index.html#/ (reply to 61336)

A: const { walletAddress } = useTonConnect(); const client = useTonClient();  await cleint?.runMethod(walletAddress!, "seqno") Is this the right way to obtain seqno? (reply to 61337)

/B4ckSl4sh\: Doesn't look correct (reply to 61340)

A: Any example of how to use this API? The documentation seems not good enough (reply to 61337)

/B4ckSl4sh\: Use fetch function. It is usual rest-api (reply to 61343)

— 2025-05-01 —

Артур: Hi guys! I have this simple contract:  import "./messages";  contract ContractB {     id: Int as uint8;      init(msg: DeployContractB) {         self.id = msg.id;     }      receive("HelloB") {         self.reply("ContractBResponse".asComment());     }      receive() {} }  I’ve noticed that when "HelloB" is called, the contract’s balance decreases (by a very small amount, like 10^-7, but still). Now I’m wondering — is it possible to write a contract that uses only the TON from incoming messages without touching its own balance?

Dmitry: TON Smart Contracts pay for storage from own balance, but you can lock some funds from incoming message to compensate it (reply to 61416)

Артур: Could you please tell me how I can achieve that? I mean, locking the funds from the incoming message? (reply to 61418)

Dmitry: https://docs.tact-lang.org/ref/core-contextstate/#nativereserve (reply to 61419)

Артур: Thank you! (reply to 61420)

— 2025-05-02 —

Jared: Is there anyone looking for the developer now?

Roman: How do I add comment to forwardPayload in NFTTransfer? In tact  message(0x5fcc3d14) NFTTransfer {     queryId: Int as uint64;     newOwner: Address; // Address of the new owner of the NFT item.     responseDestination: Address; // Address to send a response confirming a successful transfer and the remaining incoming message coins.     customPayload: Cell? = null; // Optional custom data. In most cases, this should be null.     forwardAmount: Int as coins; // The amount of nanotons to be sent to the new owner.     forwardPayload: Slice as remaining; // Optional custom data that should be sent to the new owner. }

V: Hey looking to start develop on Ton, some articles on the topics for beginners ?

Андрей: https://docs.tact-lang.org/book/learn-tact-in-y-minutes/ (reply to 61507)

V: Thanks 🙏🏽

Шу: Hello everyone! Please help me figure this out. When I compile file main.tact I keep getting the same error: Error: main.tact:3:13: Expected ":" 2 | // Variable for storing NFT description > 3 | storage last_description: cell;  Tact version 1.6.7 I checked it on two different computers with Ubuntu and MacOS. I've already rewritten it dozens of times in different ways, nothing helps(((  contract Fanta {     // Variable for storing the last NFT description     storage last_description: cell;      init() {         self.last_description = empty_cell(); // Пустое значение при инициализации     }      // mint NFT — just save description     receive("mint") {         let description = slice::load_ref();         self.last_description = description.as_cell();         send_raw_message(sender(), 0, "Mint successful");     }      // Get last description     get fun get_last_description(): cell {         return self.last_description;     } } This Expected ":" it constantly appears... Thanks advance! 🙏

Dmitry: Just remove ‘’’storage’’’ (reply to 61521)

Dmitry: Your code looks very awkward tbh

Dmitry: Some weird mix of Tact and FunC

Шу: I am an amateur) thanks for your advice I will try it

Dmitry: I will not expect that this code will compile

Dmitry: https://docs.tact-lang.org/book/learn-tact-in-y-minutes/

Dmitry: Maybe you want to start here

David: Hi, I want to ask, does anyone know where I can get a smart contract for a reward token? (The one where the commission from purchases/sales is divided between holders.)

— 2025-05-03 —

Roman: How to check this for Anonymous Telegram Numbers? (reply to 58940)

— 2025-05-04 —

Georgiy: 🔧 Announcing: OCaml library for FunC parsing: nowarp/ocaml-func  For developers working with FunC, this library provides AST and parser functionality. (forwarded from nowarp | TON Security)

— 2025-05-05 —

Randolph: I have a smart contract written in Tact. Which SDK is most suitable for initiating interactions from the frontend?

maksim: I guess there is only one option now - using Ton Connect as wallet provider and Tact generated wrappers within it to create messages for send (reply to 61743)

Yet Another Anti-Spam Bot: Bot decided that this is a spamer. Is it correct? Vote (1/3)

— 2025-05-06 —

Abrham: Hi, I've developed a web app similar to Polymarket where users can deposit Toncoin and interact with the platform. When a user wants to withdraw their balance, the process should be automatic.  I understand how to handle deposits using TON Connect, but my question is: How can I automate withdrawals without requiring my manual intervention?

Daniil: Use highload wallet on backend (reply to 61849)

Akan: Hi guys, I need some help sending a message to a contract from a react app, the user connects their wallet and then triggers the transaction that then sends the message as the payload of the transaction, I have figured everything except the creation of the payload, its a lot of cell manupulation I see online, which is a bit confusing, is there some article I can use to figure it out?  Thanks a bunch!

Akan: Thank you!, I have figured it out (reply to 61925)

— 2025-05-07 —

Ivan: Hi! I have a receive method where the message contains a referrer address (other than the sender). Since the message may be sent from an alternative client, I need to validate this address in my receive method to ensure it's valid and I can send messages to it. Could you provide an example or just point me in the right direction? I need something like this:  receive(msg: MyMessage) {     let isValid = isAddressValid(msg.referrerAddress); //???     if(isValid) {         someAction();     } }

Slava: I'm afraid you will have to define what the "valid" is, in your terms. (reply to 61995)

Ivan: - Is properly formatted according to the blockchain's address structure (this would probably throw an error earlier, when the client tries to send the message) - Exists on the same chain as my contract (reply to 61998)

Slava: I believe the Tact will handle address deserialization for you and will halt if the address format is invalid.

maksim: True, if it's defined in MyMessage message definition as Address field than Tact will handle it (reply to 62000)

Slava: Regarding the workchain, check the methods starting from here.

Anton: For you all, JetBrains IDEs lovers: intelli-tact plugin release 📸  🍲 got IDEA? ♨️ @tact_kitchen from the @ton_studio (forwarded from TON Dev News)

Brave: offtopic but  Please make a FunC lsp plugin for neovim (or just vim)  Add FunC to the nvim-lspconfig pleeeeaseee 🥺 (reply to 62005)

Anton: you should probably ask the team behind FunC to do it :) (reply to 62007)

Brave: 💯  But only the TacT team is actually doing shit...  So i hardly think about moving from FunC -> to Tact... 🤔 (reply to 62009)

Anton: you should be, you can already be more gas efficient since Tact 1.6.0 (if you follow the guidelines here: https://docs.tact-lang.org/book/gas-best-practices/)  and we are working on a new backend to completely cut off FunC and Fift from the compilation pipeline (reply to 62010)

Brave: soon, i will seriously look forward into doing that. 🤝  We'll see)) (reply to 62011)

Slava: 👏🏻 😅 (reply to 62010)

— 2025-05-08 —

🔳 ivan: Hi! I created a contract that emits event. Now i want to build a listener for such a contract. can you please guide me on off-chain part of this solution? how to get emitted events and parse the event data given event "abi"?

Adam: Yeah sure thing what if you can explain what you want the listener to do I can help (reply to 62071)

Lê: can you help me?  async getCounter(provider: ContractProvider) {         const builder = new TupleBuilder();         const source = (await provider.get('counter', builder.build())).stack;         const result = source.readBigNumber();         return result;     } this void is problem with user wallet

— 2025-05-09 —

Daniil: hello, tell me how to get correct op code from forwardPayload  const innerPayload = beginCell()                 .storeUint(0x54d5c342, 32)                  .endCell();                  const jwPayload = beginCell()                 .storeUint(0xf8a7ea5, 32)                 .storeUint(0, 64)                 .storeCoins(10 * 10**decimals)                 //.storeCoins(toNano(1))                 .storeAddress(smcAddress)                 .storeUint(0, 2) // response address -- null                 .storeUint(0, 1)                 .storeCoins(toNano("0.1"))                 .storeBit(1)                 .storeRef(innerPayload)                 .endCell()                  const payload = jwPayload.toBoc().toString('base64');  receive(msg: JettonTransferNotification) {          if (!msg.forwardPayload.empty()) {             let payload: Slice = msg.forwardPayload;             let opcode: Int = payload.loadUint(32);               if (opcode == 0x54d5c342) {                 self.requireNotStopped();                 let seed: Int = getSeed();                  setSeed(seed);                                let prize: Int = random(self.minPrize, self.maxPrize);                    send(SendParameters{                     to: self.myJettonWallet,                     value: JettonTransferGas,                     body: JettonTransfer {                         queryId: 6,                         amount: prize,                         destination: sender(),                         responseDestination: myAddress(),                         customPayload: null,                         forwardTonAmount: ton("0.015"),                         forwardPayload: rawSlice("F")                     }.toCell()                 });             }         } else {             self.myJettonBalance += msg.amount;             self.forward(msg.sender, null, false, null);         }        }

klass: Please check out here:  https://github.com/ton-blockchain/liquid-staking-contract/blob/1f4e9badbed52a4cf80cc58e4bb36ed375c6c8e7/utils.ts#L426 (reply to 62161)

A: Hi guys. Anyone faced this issue: When TonConnect is connected to a wallet (in a React.js app), sending the transaction causes openning a url in the browser instead of openning the already installed Wallet app (eg. TonKeeper). When sending the transaction the app should ask to open the already installed wallet app instead of openning this page.

Slava: It's not the first report of this issue. (reply to 62193)

— 2025-05-10 —

Kenny: Hi guys. I'm new to Ton and Tact. I don't know what a map<K, V> actually does under the hood, so I have concerns that this type will consume lots of gas.  According to Ton docs, TVM is a stack machine, and it can operates on 7 types like integer and cell. So I'm assuming a map<K, V> is essentially a cell. (If my understanding is wrong here, then please ignore the following questions)  As far as I know, the data/bits in a cell cannot be randomly accessed, and can only be converted to a slice, then read and parsed bit by bit. Based on this fact, I have 2 questions:  1. Does a map<K, V> create a new cell for each new key value pair? And all cells (each with one and only one key-value pair in it) are organized in a binary-tree-like structure, leveraging the ability that each cell can store at most 4 references to other cells.  2. What's the time complexity of map.get and map.set and other functions? It seems to be O(log N) or even worse?  Thanks in advance 🙏

Philip: Maps are called "dictionaries" on TVM side, and operations on them are implemented with assembly instructions. See "Dictionary manipulation" section here. (reply to 62249)

Philip: Exact details on how dictionaries are stored can be found in tvm.pdf whitepaper, section 3.3 (reply to 62249)

Kenny: Thanks a lot!!! I'll check them

Philip: Time complexity doesn't really matter much, the thing that counts is amount of spent gas. TVM instruction documentation has "gas" column, albeit sometimes that number is wrong.  You can enable full TVM logs in sandbox and see actual gas costs for every instruction (reply to 62249)

Kenny: At first I didn't know there are dedicated TVM instructions on operating on hashmap/dictionary. I thought the functionality of a map<K, V> is provided by Tact via encapsulating lots of low-level codes. But since there are dedicated TVM instructions, you are probably right that the time complexity doesn't matter much

Philip: Also I have to tell that if you intend to store large amount of data in maps, you'll hit a limit on total amount of storage of a single contract. Scalable solution would use a child contract.  I recall we had some kind of documentation about that, but don't recall where exactly. The person who knows will likely answer here after weekend and public holidays are over (reply to 62254)

Kenny: Yea, I've seen this on Tact book. Thanks for reminding 🥹 (reply to 62255)

Amr: Hi

Kenny: I also think it would be better if the details (reference links) of how a map<K, V> works is written in the "Maps" chapter of the Tact Book.

Slava: I wonder what was the reason behind renaming dictionaries to maps. This is very confusing. Especially for people coming from lower level stuff.

Anton: Who knows :) We just have to live with this now (reply to 62264)

Slava: Oh, I see )

Slava: By the way, I haven't seen any mention of the dictionaries in Tact docs.

Anton: https://docs.tact-lang.org/book/exit-codes/#10 (reply to 62267)

Anton: https://docs.tact-lang.org/book/maps/#ascell (reply to 62249)

Slava: I was expecting to find it on this page.

Anton: it is the same page :) (reply to 62274)

Anton: a quick Cmd+F (Ctrl+F) revealed it to me  but yeah, this can be improved, of course

Kenny: These docs are really helpful! Thanks a lot

Anton: thanks for your questions that help improve the docs

Anton: I just opened an issue about the map representation: https://github.com/tact-lang/tact/issues/3029

Slava: I would've moved it to the top of the page or even renamed the page to read "Maps (dictionaries)" ;) (reply to 62275)

— 2025-05-11 —

Kenny: Hi guys. I have 2 questions regarding the "Communication and messaging" chapter in the Reference.  1. What's the point of send() function? If I want to send a message without deploying a contract, I can use message() and it's even cheaper. If I want to send a message and deploy a contract if there's no contract, I can use deploy() and it's cheaper too. So when should I use send()?  2. Under which situation should I use sendRawMessage()? According to the TL-B definition of a message: int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool   src:MsgAddressInt dest:MsgAddressInt    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams   created_lt:uint64 created_at:uint32 = CommonMsgInfo; ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt    import_fee:Grams = CommonMsgInfo; ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt   created_lt:uint64 created_at:uint32 = CommonMsgInfo;  message$_ {X:Type} info:CommonMsgInfo   init:(Maybe (Either StateInit ^StateInit))   body:(Either X ^X) = Message X; and the SendParameters: struct SendParameters {     mode: Int = SendDefaultMode;     body: Cell? = null;     code: Cell? = null;     data: Cell? = null;     value: Int;     to: Address;     bounce: Bool = true; }  It seems that SendParameters covers all settable fields except for IHR related fields (but anyway IHR mechanism isn't implemented yet).

User<7759979758>: Differ is in sugar and compilation result. Method "message" is universal, "send" & "deploy" — more specific.

/B4ckSl4sh\: send is general, while message and deploy are mose specific (reply to 62393)

/B4ckSl4sh\: It's left mainly for backwards compatibility (reply to 62392)

Kenny: Thanks!

— 2025-05-13 —

Kenny: Hi guys. What will happen if there's no corresponding receiver function when receiving a message? For example:  1. When receiving an internal message with body of unknown opcode, and there's no fallback receive(msg: Slice)  2. When receiving an internal message without body, and there's no receive()  3. When receiving a bounced message, but there's no bounced() or other bounced message receiver.  Will this message be simply ignored without throwing an error, and the message value is credited to the contract? Or will the contract throws an error in computation phase?

Евгений: 1. error thrown for unknown opcode 2. if opcode is known, then contract will try to parse body (if opcode requires that) and error thrown because body is empty 3. it should be just ignored (reply to 62662)

Kenny: Oh! I understand. Thanks a lot 🙏

Fynn: Hello, I’m trying to do the following with no success: User calls a function to deposit some amount x of Ton in a contract, so the user can send x + y amount of Ton to cover fees. I can specify x in the msg itself, and y should be greater than a constant to cover fees. I though about calling nativeReserve to reserve the amount of x, so only x is effectively sent to the contract and send the rest with SendRemainingValue and value = 0. But it doesn’t seem to work, can someone see the flaw in my approach?

maksim: This is tricky, but reserve doesn't work with this send mode because of very low level stuff (reseve doesn't update internal message balance) (reply to 62717)

maksim: Your approach is right, but this is the corner case for such action combination

/B4ckSl4sh\: And if I understood correctly, exactly what you are doing but with mode SendRemainingBalance will work for you

Fynn: Then it’s not really possible, another approach is instead of relying in the actual balance of the contract, I could keep track of the balances myself and rely on this number instead of the actual balance of the contract. But wanted to still try the approach that looked more natural

maksim: Here is docs link for this  https://docs.ton.org/v3/documentation/smart-contracts/message-management/message-modes-cookbook#mode64  See notice section (reply to 62717)

Fynn: Is there some way to do this that doesn’t involve keeping track of the balance myself? This would complicate the code a lot since I need to add a step to solve this divergence between the actual balance of the contract and the one I’d like to track.

&rey: I wouldn't recommend; after all, some transactions might've decreased balance (with storage fees) while not launching TVM at all. (reply to 62724)

fruitful-l: Hi, I'm trying to make Jetton transfer from my contract to my wallet. This is how I do it: receive(msg: Invested) {         let init = getJettonWalletInit(myAddress());         self.budget += msg.value;         send(SendParameters {             to: contractAddress(init),             value: msg.value,             body: JettonTransfer {                 queryId: self.id,                 amount: 100,                 destination: msg.investor,                 responseDestination: null,                 customPayload: null,                 forwardTonAmount: 1,                 forwardPayload: beginCell().storeUint(32, 7).asSlice(),                                              }.toCell(),         }); I'm confident I'm doing something wrong, surly there's a problem with calculating contract's wallet address as after it gets the msg, it sends another message to init contract that bounces back

Anton: you might want to check out the recipes in https://github.com/tact-lang/defi-cookbook (reply to 62751)

fruitful-l: Glad to know that the solution is somewhere there. I'm having huge troubles implementing what I've seen on the cookbook into my contract, but thanks anyway for reducing the search area (reply to 62752)

&rey: Does that consider that a) a random jetton is likely incompatible with any specific implementation of this, b) jetton master contract is not equal to myAddress() in context of this tx? (reply to 62751)

fruitful-l: Should it be equal to jetton master address? Isn't it supposed to be address of the contract that has jettons? (reply to 62754)

— 2025-05-14 —

Seva: The to address in SendParameters should be the Jetton wallet address (derived from the Jetton master contract and your contract’s address), not the Jetton master address. The Jetton wallet is the contract that holds the Jettons for your contract.

fruitful-l: The contract I’m using this function in is not the jetton master. I was trying to send message to the contract’s jetton wallet, therefore I need its jetton address. I’m using inline function imported from another contract, and that was the error. It’s from the minter and has arguments: address(wallet), myAddress(Should be minter address, but since I imported it became another jetton wallet address), and balance. The solution was using initial function which I described above but with minter address and not myAddress() (reply to 62799)

Seva: Thank you for such a detailed description and comments. Do you have you any additional issues now? (reply to 62830)

Angel Ⓜ️ MEMES: Please how does this work?

fruitful-l: Everything seems to be working, at least for now, thanks! (reply to 62837)

Angel Ⓜ️ MEMES: Anyone please 🙏 (reply to 62838)

Seva: I did not got you clearly, what exactly do you mean by "this"? Is it a situation, issue, event or smthng else? How would you describe "this"? (reply to 62840)

Sol: looking for orders for the development team

Герман: Тут есть русские?

Sol: https://t.me/tactlang_ru (reply to 62888)

— 2025-05-15 —

u: I can help you (reply to 35371)

Kenny: Hi guys, me again 🥺 Under the hood, is a struct actually a tuple in TVM? For example: struct Coordinate {     x: Int as int32;     y: Int as int32; }  fun foo() {     let c = Coordinate {         x: 4,         y: 3,     }; } From TVM's perspective, is variable c a tuple with 2 integer elements, so x and y together form only one element on the stack? Or there are 2 integer elements on the stack, representing x and y namely?

Hung: is jBTC token is legit? i just wanna use BTC in TON network for my projects

Anton: It depends, but it’s usually two elements in the stack (reply to 62926)

Kenny: Thanks!

Seva: Me too (reply to 62882)

— 2025-05-16 —

A: Hi guys. How to get the user's wallet type using code to see if they are using version 5 or other versions? eg WalletContractv4, WalletContractV5R1, ...

Alexander: Hello everyone. Is there a way to on-chain verify that the STON fi router address passed to the contract actually belongs to STON fi? DeDust has this option and it is implemented by creating a proof for a specific pair of jettons (there is an example in their sdk), which does not allow funds to be sent to the hacker's wallet  Here is the implementation for DeDust:  // DeDust contract type const DEDUST_CONTRACT_TYPE_VAULT: Int = 1; const DEDUST_CONTRACT_TYPE_POOL: Int = 2; const DEDUST_CONTRACT_TYPE_LIQUIDITY_DEPOSIT: Int = 3;  // DeDust factory address const DEDUST_FACTORY_ADDRESS: Address = address(   "EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67" );  // DeDust contract code const DEDUST_BLANK_CODE: Cell = cell(   "te6ccgEBBAEAlgABFP8A9KQT9LzyyAsBAgJwAwIACb8pMvg8APXeA6DprkP0gGBB2onai9qPHDK3AgFA4LEAIZGWCgOeLAP0BQDXnoGSA/YB2s/ay9rI4v/aIxx72omh9IGmDqJljgvlwgcIHgmmPgMEITZ1R/V0K+XoB6Z+AmGpph4CA6hD9ghDodo92qYgjCCLBAHKTdqHsdqD2+ID5f8=" );  // Create proof to confirm DeDust address fun createProofAddress(   factoryAddress: Address,   contractType: Int,   jettonAddress: Address? ): Address {   let data = beginCell()     .storeAddress(factoryAddress)     .storeUint(contractType, 8);    if (jettonAddress == null) {     data = data.storeUint(0b0000, 4);   } else {     let parsedAddress = parseStdAddress(jettonAddress!!.asSlice());      data = data       .storeUint(0b0001, 4)       .storeInt(parsedAddress.workchain, 8)       .storeUint(parsedAddress.address, 256);   }    return contractAddress(     StateInit {       code: DEDUST_BLANK_CODE,       data: data.endCell()     }   ); }  // Create proof to confirm the DeDust vault address fun createVaultProofAddress(   factoryAddress: Address,   jettonAddress: Address? ): Address {   return createProofAddress(     factoryAddress,     DEDUST_CONTRACT_TYPE_VAULT,     jettonAddress   ); }  // Verification of DeDust vault address fun verifyVaultAddress(   vaultAddress: Address,   factoryAddress: Address,   jettonAddress: Address? ) {   require(     vaultAddress == createVaultProofAddress(factoryAddress, jettonAddress),     "Invalid DeDust vault address"   ); }  And what is the implementation for STON fi?

Slava: Hey. You just need to compare the contract's code with the canonical one. (reply to 63072)

— 2025-05-18 —

M.a: C:\Users\extra>npm install -g https://github.com/tact-lang/tact.gitnpm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.npm warn deprecated glob@8.1.0: Glob versions prior to v9 are no longer supported\

Anton: it’s fine, won’t affect your smart contracts (reply to 63274)

M.a: I want to create a system that receives inputs from the user and, based on a specific algorithm, generates a license key to be used for activating a software application. Last night, I was installing the prerequisites, but I ran into some issues while trying to install Tact. I'll try again tonight and also get help from ChatGPT.

poppa: Have you considered that the blockchain state is public and therefore any license key you generate will be readable by the entire world? (reply to 63276)

Daniil: I don't think smart contract is the right solution for that goal (reply to 63276)

Daniil: why? (reply to 63291)

M.a: Yes, the keys are visible to everyone, but each key is generated for only one user ID, so the keys are unique." (reply to 63282)

M.a: Smart contracts eliminate the need for a server and simplify the process of collecting subscription fees. I no longer need to generate the keys manually—there just needs to be a complex enough algorithm so that the encryption cannot be easily guessed through reverse engineering. (reply to 63290)

M.a: The user enters their account number and selects the license duration, and the key is generated based on these inputs. On the other side, within the software, it checks whether the account number matches the system's account number and whether the algorithm follows the pattern defined by the developer. Only then is the user authorized to use the software.

M.a: I have a problem: this is my first experience writing a smart contract, and I couldn't even run hello.tact without errors. I'm using ChatGPT for help, but I'm still getting errors. I was hoping to have a simple example of a contract to help me get started.

M.a: contract Hello {      get inline greet(): String {         return "Hello, blockchain!";     }  }   What is the problem?

Denis: Try harder 🌚️️ https://docs.tact-lang.org/book/learn-tact-in-y-minutes/ (reply to 63342)

&rey: that tends to make things worse. LLMs are extremely not familiar with TON. (reply to 63338)

&rey: It is actually comparable with coming from EVM to TON.

Jan: Which AMM dex like uniswap v2 in Ton chain?

&rey: Both Dedust and Stonfi I guess? Tho how is that related to Tact? (reply to 63346)

Jan: Which one is built using tact between two? Also can I implement adding liquidity in my Tact contract even if the dex is not built using Tact? (reply to 63347)

&rey: 1. Neither. 2. Of course. Tact can send pretty much any message to other contracts, and that is sufficient to control, in particular, liquidity adding. (TON's account boundary also happens to abstract implementation away.) (reply to 63348)

/B4ckSl4sh\: We are developing https://github.com/tact-lang/dex now, you can check it out (reply to 63348)

Jan: Do you have any codesnippet which interacts ston.fi and adding liquidity using Tact? (reply to 63349)

&rey: No. But I know that, per https://docs.ston.fi/developer-section/api-reference-v2/example_lp_provide, you just have to send two jetton transfers with appropriate forward payloads. (reply to 63352)

Anton: have you checked this page?  https://docs.tact-lang.org/cookbook/dexes/stonfi/#liquidity-provision  if something does not work there, please let us know (reply to 63352)

Jan: How can we deploy new contract and get address inside receiver()? For example in solidity ERC20 token = new ERC20(....); address tokenAddress = address(token); How can we implement this in Tact?

— 2025-05-19 —

&rey: Note: you can obtain address prior to deploying contract. Knowing this, do you still need to deploy it? (reply to 63390)

M.a: Is the smart contract code I use for the license key generation algorithm visible to everyone? If the answer is yes, is there a way to keep the algorithm hidden?

&rey: Visible to everyone. No you can't hide algorithm. (reply to 63424)

&rey: Nor the data or results of evaluation, actually, so if a "license key" is generated it will be available to anyone.

M.a: It doesn’t matter if the key itself is publicly accessible; what matters to me is that the key generation algorithm is not made public. (reply to 63426)

&rey: You are choosing wrong tools. Blockchain, with its transparency and ability to replicate+verify any part, is uniquely bad-suited for the task. (reply to 63427)

Jan: I am going to build token factory contract which deploys new token when user requests Btw how can we get address before deploy? (reply to 63423)

&rey: I believe you should check out Tact Smart Battle, it can point at some fundamental knowledge for you. (reply to 63429)

Jan: What is Tact Smart Battle? (reply to 63430)

&rey: This one: https://github.com/ton-studio/tact-smart-battle, which was run on Codeforces. (reply to 63431)

Georgiy: If you must use blockchain (you should not), you could move the key generation logic to the off-chain part (kind of trusted oracle) and store the computation results on-chain. These could either be the keys generated by your algorithm as-is or zk proofs that you know them if they also need to be private. (reply to 63424)

Michaelzy: Hey guys  want to know if it's possible to upgrade contracts on tact or if its better(possible) to design a proxy contract

Dmitry: https://docs.tact-lang.org/cookbook/upgrades/ (reply to 63463)

Michaelzy: Thank you (reply to 63464)

Dagnachew: Hi

— 2025-05-20 —

`SayedEx: Hello

`SayedEx: i am new in TON anyone can help me with jetton deployment?

Georgiy: The easier way is to use blueprint: https://github.com/ton-org/blueprint?tab=readme-ov-file#deploying-contracts (reply to 63543)

Anton: take a look at this project https://github.com/tact-lang/jetton  it showcases deployment scripts  you might also want to check out this repo too: https://github.com/tact-lang/defi-cookbook (reply to 63543)

`SayedEx: I can verify the contract as well here sir?   Also, can you please send me a standard jetton token smart contract that i can learn and deploy to production.   Thanks 🙌 (reply to 63546)

Michaelzy: good morning guys Tact dev here i currently have this transaction payload in my script that sends message to my contract and it executes successfully.  const message = beginCell()     .storeUint(2016634319, 32)     .storeUint(0, 64)     .storeStringRefTail(trackData.tun3zTitle)     .storeStringRefTail(trackData.coverImage)     .endCell();  this is the message in my contract message Mint{     query_id: Int as uint64;        name: String;     image: String; }  But i want to make the name and string values optional in my contract like this  message Mint{     query_id: Int as uint64;        name: String?;     image: String?; }  how can i modify my payload to match this new message struct because old one wont work

Daniil: Consider using auto-generated wrappers for message composing instead (reply to 63553)

M.a: "I want to send a transaction with a private comment to a smart contract I wrote. Can this comment, considering it's private, be understood by the contract?"

&rey: Contract execution is replicated by each and every validator, and also by any interested party. You're looking for some ZK technology. (reply to 63563)

`SayedEx: anyone can help? (reply to 63548)

Devialle: Hello everyone, I am looking for an experienced developer on tact with extensive experience

sajad: dm (reply to 63570)

— 2025-05-21 —

🔳 ivan: hey everyone. where can I find repo with tact docs?

🔳 ivan: ( i want to try using raw docs files to teach my cursor )

Georgiy: https://github.com/tact-lang/tact/tree/main/docs (reply to 63650)

Devon: hi guys, we just launched an open source community project tonmcp.xyz for interacting with Ton blockchain using natural language, pin me if you have questions install it or want to collaborate on PRs 😆

Michaelzy: how do i use it the wrapper in my blueprint folder only contains an export statement (reply to 63558)

M.a: Can a smart contract search for a past comment using a hash or address? A comment that was previously sent to the contract's address.

Mirka: Contract can't access past transactions but it can save comment/data you need (reply to 63656)

M.a: I want to save a private comment. After saving it, is it still fully secure, or can it be accessed through hacking?  I want to introduce a key to the contract only once without writing the key itself inside the contract code, and use this key for encryption.

Dmitry: Nothing is private in the blockchain (reply to 63659)

Dmitry: You already have been advised in which direction you should look (reply to 63564)

Я̨kov: You can also give it llms.txt, see: * https://docs.tact-lang.org/llms.txt — for full context * https://docs.tact-lang.org/llms-small.txt — for smaller context windows (reply to 63651)

Skuli: I do the same We can cooperate (reply to 63651)

Philip: Please share the code and error messages  https://nometa.xyz/ (reply to 63672)

Anton: this is not valid Tact, there is no storage blocks (reply to 63678)

Anton: LLMs are not of much help with TON smart contract languages, please check out https://docs.tact-lang.org/

Petr: Or at least try this one: https://chatgpt.com/g/g-tFkVOWIoi-tact

Skuli: I can recommend using my template for development with Cursor AI. It is compatible with blueprint, but I use a custom version of blueprint. You will be able to create contracts autonomously from start to finish, but the system is not ready yet.  https://github.com/ton-ai-core/contract-knowlenge (reply to 63688)

🔳 ivan: raw llms not but if fed with knowledge base - that could work. (reply to 63685)

Skuli: Just documentation won't help much. It is necessary to create a system in which AI can feel free. Test the code yourself. See the result yourself.  it is necessary to make a mutation testing library for TON. Also, the code will have to be covered by 100% tests. (reply to 63697)

— 2025-05-22 —

Anton: We’ve launched the ultimate hunt for bugs and hacker mastery — the epic CTF has begun at positive.com/ctf!   On the menu: blazing challenges in EVM and TON security — plus one juicy Bug Bounty worth 100 TON! (forwarded from Positive Web3)

Stark: hey i am looking to deploy bridge on ton for smooth transactions with evm chain, any idea which repo i should fork and any previous deployments available?

`SayedEx: I have a repo (reply to 63800)

Bohdan: Who know what does this error from https://ton.access.orbs.network means? {"ok":false,"error":"VALIDATE_ACCOUNT_STATEFailed to unpack Account","code":500}

— 2025-05-25 —

RDN: Hello, can anyone help me with problem?  I tried to call contract getters from my front-end app and getting an error 500 with message   `response:  "{\"ok\":false,\"error\":\"VALIDATE_ACCOUNT_STATEFailed to unpack Account\",\"code\":500}"`  that is my code     const adminContract = useAsyncInitialize(async () => {         if (!client) return;          const contract = AdminContract.fromAddress(Address.parse('EQAmKTAgl5jlvLX4_xZbCQpahocbkh7nSMpblxPFWbAfk4Mm'));         const b = await client.getBalance(Address.parse('EQAmKTAgl5jlvLX4_xZbCQpahocbkh7nSMpblxPFWbAfk4Mm')); <---- error is here         debugger          return client.open(contract) as OpenedContract<AdminContract>     }, [client])  Test wallet connected, contract deployed, and its balance more than 0

— 2025-05-26 —

7VPN ||: Hello. I am new in smart contract and TON blockchain. for a test project i want to launch a token with basic features like send, Freeze and burn. i just install nodejs in phpstorm and create a sample with npm create ton@latest but i don't know what i am doing and how i must customize my token with my logo name and etc... is there any sample to undrestand the concept? or any course? Thank you in advance.

maksim: Hello, here is reference jetton (token in TON) implementation in Tact https://github.com/tact-lang/jetton  And here is cookbook with different examples of working with this jettons (sending, receiving, etc) https://github.com/tact-lang/defi-cookbook  Based on this, you should be able to implement your own custom logic (reply to 64120)

7VPN ||: Thank you i will check them all. but i have some basic questions because i don't have any experience in blockchain programming. launching token ( or should i say jetton?) in TON blockchain is same as writing an smart contract? or first i should launch a token in another way and then write a smart contract for manage the token? (reply to 64121)

maksim: Launching jetton means to deploy a smart contract that implements jetton logic  You can do it either by yourself, or by using some tools. Here is open-source minter tool for deploying Tact jettons, that does this for you https://kaladin13.github.io/minter/ (NOTE: work on this is still in progress, only use it for testing purposes in testnet, it might be migrated to the other url soon too)  And here is more detailed guide on how to mint your first jetton in text format https://docs.ton.org/v3/guidelines/dapps/tutorials/mint-your-first-token (reply to 64123)

7VPN ||: so i think it's better to start with cloning /tact-lang/jetton and deploy a sample jetton and then work with examples at tact-lang/defi-cookbook for more details. yes? (reply to 64124)

maksim: Jetton repo also contains deploy scripts, so you can go with this approach too

7VPN ||: yes i am following that. i am trying to find contact.deploy.ts file to edit it (reply to 64128)

M.a: Hi How install toncli??

Slava: https://github.com/disintar/toncli/blob/master/INSTALLATION.md (reply to 64154)

— 2025-05-27 —

Chief: Hello,  I am having issues getting my nft item metadata to display on tonviewer and getgems  Firstly I am the individual_content (from TEP64 standard in my init like this init(         owner: Address,         collection_address: Address,         item_index: Int,         individual_content: Cell?,         metadata: Metadata?     ) {         self.owner = owner;         self.collection_address = collection_address;         self.item_index = item_index;         self.is_initialized = false;         self.metadata = metadata;         let dict: map<Int as uint256, Cell> = emptyMap();         let attribute  = "[{ }]";         dict.set(sha256("name"), beginTailString().concat("Michaelzy #1").toCell());         dict.set(sha256("description"), beginTailString().concat("Michaelzy test nft").toCell());         dict.set(sha256("image"), beginTailString().concat("image here").toCell());         dict.set(sha256("content_url"), beginTailString().concat("empty url").toCell());         dict.set(sha256("attributes"), beginTailString().concat(attribute).toCell());                   self.individual_content = beginCell()             .storeUint(0, 8)             .storeMaybeRef(dict.asCell()!!)             .endCell();     }  then i implemented the getter as so: get fun get_nft_data(): GetNftData {         return GetNftData{             is_initialized: self.is_initialized,             index: self.item_index,             collection_address: self.collection_address,             owner_address: self.owner,             individual_content: self.individual_content!!,         };     }  the tonviewer link shows the owner address and collection address but the content metadata is empty. I'd appreciate your help pls

Nerses: Hi all, I’m writing a TACT function where the user sends amount_sent and specifies amount_to_lock. The contract should:  Lock exactly amount_to_lock in state  Refund the surplus (amount_sent – amount_to_lock) to the sender after covering all fees (incl. storage rent)  Any recommended TACT pattern or sample code?

maksim:       nativeReserve(msg.amount, ReserveExact | ReserveAddOriginalBalance | ReserveBounceIfActionFail);        message(MessageParameters {                 to: sender(),                 value: 0,                 bounce: false,                 mode: SendRemainingBalance,             });  It should look something like this (reply to 64222)

maksim: Don't use cashback() function since it uses SendRemainingValue send mode, and this mode would fail if you use it together with reserve

Nerses: I used smth like that,but problem is that before it contract also has some balance so if I use this code the caller will get all balance except msg.amount (reply to 64223)

Nerses: yeah I have tested that😅😅 Thanks anyway (reply to 64224)

maksim: No, it won't since you are using ReserveAddOriginalBalance mode in reserve here (reply to 64225)

maksim: This mode ensures that all previous balance is secure

Nerses: let me try and inform you (reply to 64227)

Nerses: No the code didnt behave like expected.Here I have run same script without changing any parameter and used the code you provided.As you can see every time it returned different amount (reply to 64227)

Nerses: even for first call I have specified to keep 0.1 but it kept 0.2

maksim: Can you please provide related code snippet

Nerses: let me send it in DM (reply to 64232)

— 2025-05-28 —

Bhavyaraj singh: I am beginners is  any tips for me

Anton: hi and welcome, a good place to start is https://docs.tact-lang.org  you can find how to install the Tact tooling here: https://tact-lang.org/#tooling (reply to 64257)

fruitful-l: Is Tact by example still being supported? It just seems like there’s a lot of outdated content, like deployable trait, and a ton of room for improvement like more immersive user-contract interactions, but I’m not sure if any of this is ever coming to this project

Anton: Right now it’s not maintained, however we started working on a project that is inspired by tact-by-example but will be updated to include all the recent language features (reply to 64259)

fruitful-l: Great to know, thanks!

Chief: Hi Anton, can I get you help with an issue I am having? Thanks. (reply to 64258)

Chief: @@tiredofbeeing or anyone who can help, I will be grateful. Really need the help in resolving a bug. Thanks

Chief: I also would like to ask,  I am currently writing an nft and jetton smart contract and would just like to ask which is recommended to use between onchain metadata and offchain metadata

maksim: Offchain meta could get lost with time (link expire for example) and needs to be fetched separately, while onchain data is stored on the blockchain so no such issues, but you will pay slightly more storage fees for more size stored in your contract. Generally, it's a trade-off of what you want more, but from web3 perspective storing data on-chain is more "correct" (decentralization and etc) (reply to 64268)

maksim: Please share the issue or question in chat (reply to 64267)

M.a: Where can I find the selector? I want to connect the contract to a web page, and it seems I need a selector for that.

maksim: Seems that you need TON Connect frontend protocol, https://docs.ton.org/v3/guidelines/ton-connect/guidelines/how-ton-connect-works (reply to 64271)

M.a: Thanks 🙏 (reply to 64272)

Chief: I am having issues getting my nft item metadata to display on tonviewer. Tonviewer displays the owner address and collection address but doesn't display the metadata (individual_content) (reply to 64270)

M.a: Actually, I don't have enough knowledge for this task, but I have a serious goal. That's why I’m first teaching ChatGPT using the official documentation, and then I want it to help me based on that. Sometimes, though, it seems to think it's developing a contract on the Ethereum network 😅

maksim: You might want to check this org and related ai repos, https://github.com/ton-ai-core (reply to 64275)

maksim: Please provide more context and/or related code snippets and explorer links (reply to 64274)

Ivan: Hi, what can I do if I sent my tokens from Tonkeeper to another Jetton wallet (instantiated from another my contract)? The Jetton notify failed =(. Could you please take a look at this transaction: https://testnet.tonviewer.com/transaction/5f980113c456b97c5351e1127ae54a6b50c09ca57e8b3a25ccd627ee72392181?section=trace (reply to 53450)

/B4ckSl4sh\: Tonkeeper sets forwardTonAmount to 1n

Ivan: so i cant send jettons with it? (reply to 64279)

/B4ckSl4sh\: You can't invoke destination contract (reply to 64280)

Rami: Hi guys! I'm unable to access the Telegram Wallet due to country restrictions. Are there plans to lift these restrictions for EU and Usa and other restricted coutry? If so, what steps are needed to make this happen from telegram to do so?  and is the team actively working on a solution?

/B4ckSl4sh\: But Jettons themselves will be sent (reply to 64281)

Ivan: bad for me =( looks like the only solution is to write a separate wallet for my project? maybe there are good wallet repos in tact? (reply to 64283)

/B4ckSl4sh\: You usually just need to propose a correct transaction to your user by TonConnect (reply to 64286)

Ivan: you mean to invoke tonkeepr transaction on client side, not from tonkeeper itself? (reply to 64289)

/B4ckSl4sh\: Yes (reply to 64290)

Ivan: ty sir

Chief: I will share that. Can I please share this in DM. Thanks (reply to 64277)

Andrei: Hi! How do I keep the value sent in a deploy message and make sure it's not bounced back to the wallet?  Right now, the value is being sent back, even though I have the flag bounce set to false.   export async function run(provider: NetworkProvider) {     const contract = provider.open(await Contract.fromInit(ID, AMOUNT));      const deploymentFee = toNano('0.05');     const totalValue = toNano(AMOUNT.toString()) + deploymentFee;      await contract.send(         provider.sender(),         {             value: totalValue,             bounce: false,         },         {             $$type: 'Deploy',             queryId: 0n,         },     );      await provider.waitForDeploy(contract.address); }

maksim: The message doesn't bounce, however I guess you are using Deployable trait that includes cashback function in it, and this function returns all remaining funds from deploy (reply to 64309)

maksim: You can read more about this here  https://docs.tact-lang.org/ref/stdlib-deploy/#deployable

Andrei: Thank you. (reply to 64310)

7VPN ||: Hello i have this contract code: import "@stdlib/ownable"; message IncreaseOwner{     amount : Int as uint32; }  contract TestOwnable with Deployable, Ownable {     init(id : Int) {         self.owner = sender();          self.val = 1;         self.id = id;     }     receive(msg: IncreaseOwner) {         self.requireOwner();         self.val = self.val + msg.amount;     } } deployed it with a wallet and now test it  import { Address, toNano } from '@ton/core'; import { TestOwnable } from '../build/TestOwnable/TestOwnable_TestOwnable'; import { NetworkProvider,sleep } from '@ton/blueprint';  export async function run(provider: NetworkProvider, args: string[]) {     const address = Address.parse("kQAy8gzhh2uIakN4yIzCBC7aWdZ1xwpO9gDyszr2AD7lCi2M");      const testOwnable = provider.open(TestOwnable.fromAddress(address));      await testOwnable.send(         provider.sender(),             {                 value: toNano('0.01'),             },             {                 $$type : "IncreaseOwner",                 amount: 6n,             }     )  }  problem is no matter from what wallet i sent this request, val increase for amount and never checked if the sender is owner or not how i can fix it?

Андрей: Can you provide piece of code, where you check self.val? In that code you just send message from wallet (reply to 64346)

7VPN ||: as i read in document of we put self.requireOwner() in contract and then receiving a message from a wallet which is not owner the transaction will be failed and don't require extra work. is it wrong? (reply to 64347)

Андрей: Yeah, but you don’t check transaction fail (reply to 64348)

7VPN ||: aha, so how i must check it? in receive(msg: IncreaseOwner) i must add something? because i don't want self.val = self.val + msg.amount; executed when not owner (reply to 64349)

Андрей: If you check in testnet than you can view it in tonviewer  If you check locally you can view transaction  const trxRes = await… console.log(trxRes.transactions) (reply to 64350)

7VPN ||: sorry but didn't catch it. in my idea if sender is not owner the next lines will not be executed so val never changes with messages from non owner wallet.  but now you said that i must check if transaction is failed i shouldn't increase val  i just take a look as tonviewer and didn't see any failed transaction https://testnet.tonviewer.com/kQAy8gzhh2uIakN4yIzCBC7aWdZ1xwpO9gDyszr2AD7lCi2M this is my contract (reply to 64351)

— 2025-05-29 —

7VPN ||: you know unfortunately i am new in blockchain programming because of that i am confused here and sorry for that

Андрей: Are you sure the requireOwner() call is present in your saved code? I couldn’t find a const declaration 132 in the code you shared (fift)  https://docs.tact-lang.org/ref/stdlib-ownable/#ownable (reply to 64353)

7VPN ||: yes (reply to 64354)

Андрей: Please try to deploy again,  yarn build yarn deploy (reply to 64356)

7VPN ||: here you can see my contract, my script and terminal. first i saved then npx blueprint build —all then npx blueprint run my script. in terminal it's clear that my wallet and owner wallet is not same

7VPN ||: ok i will do it now (reply to 64357)

7VPN ||: yarn build works but deploy failed. no command finds. and problem still here (reply to 64361)

Андрей: You rewrite ownable trait? It make more sense (reply to 64358)

Андрей: Just delete it 😁

Андрей: https://docs.tact-lang.org/ref/core-debug/#throwunless

7VPN ||: i wasn't rewrite it. in my last test done that and same can it be because of internal and external message? i am confirm transaction through my tonkeeper wallet on my phone (reply to 64363)

Андрей: No, your connection method doesn’t affect at contract code/behaviour (reply to 64366)

7VPN ||: ok i done something new     get fun checkSenderAddress():Address {         return sender();     } and then     const testOwnable = provider.open(TestOwnable.fromAddress(address));       const owner = await testOwnable.getCheckSenderAddress();      console.log(owner - ${owner}) got: Error: Unable to execute get method. Got exit_code: 11 (reply to 64367)

Amor: I think u should refer OwnableTransferable2Step trait (reply to 64369)

Nicholas: Hello I'm here

&rey: Well a get-method cannot be protected "for owner only" — there is no sender() in it! (reply to 64369)

7VPN ||: exactly (reply to 64384)

7VPN ||: i try to get sender() address but i failed a lot and i don't know why. if anyone can help please     cacheSender : Address;     receive() {         self.cacheSender = self.owner;     }     get fun checkSender(): Address {         return self.cacheSender;     } then i send this scripts     try {         await testOwnable.send(             provider.sender(),             {                 value: toNano('0.01'),             },             null         );         ui.write(`✅ IncreaseOwner sent successfully.`);     } catch (err) {         ui.write(`❌ Transaction failed:`);         ui.write(`${err}`);     } now cacheSender must be set as owner then in another script     const ownerFlag = await testOwnable.getCheckSender(); // returns BigInt     console.log(`Sender IS : ${ownerFlag}`); Error: Unable to execute get method. Got exit_code: 11

&rey: You tend to have some extra code for the contract. Please stash it away and try again. (reply to 64402)

&rey: (that is, I hope your implementation with custom — and wrong — Ownable is used by no one) (reply to 64358)

Nerses: What traits should be used instead of Deployable and FactoryDeployable, since they’ve been deprecated as of version 1.6? I couldn’t find anything about replacements in the documentation.

/B4ckSl4sh\: you should use empty receiver instead of Deployable (reply to 64414)

/B4ckSl4sh\: receive() {  }

Petr: Hey, if you use VS Code with the Tact extension, it has a quickfix for this case (reply to 64414)

Nerses: the problem is that with empty receiver having cashback the call fails (reply to 64418)

Nerses: while using the trait Deployabel,everything is ok

Petr: Can you attach a link to ton viewer?

/B4ckSl4sh\: It is normal behaviour (reply to 64420)

/B4ckSl4sh\: contract is deployed

Nerses: https://testnet.tonviewer.com/kQCx6EQxN-QVAFHOpOMoOZ1T04-tNKTrYIlg-VCpYUOuQklw (reply to 64422)

Zohirbek: Hello TON Community!  I’m developing a creative and community-driven NFT collection called Telegram Garage, designed for integration into the Telegram Gifts section and based on the TON blockchain.  The collection includes 15 unique NFTs — 5 classic cars, 5 ultra-luxury Rolls-Royce designs, and 5 front-facing Lamborghinis — all created with a unified, clean, and collectible aesthetic.  I'm looking for: — a TON developer to help build a Mini App for in-app viewing/minting — a UI designer familiar with TON ecosystem design standards — a promoter or marketing partner to grow our Telegram-based audience  The goal is to bring more TON-native art into Telegram's gifting economy, and also attract early adopters and collectors.  If you're interested in collaborating (profit-share or hybrid model possible), or want to support/invest, I’d love to connect!  Thank you!

— 2025-05-30 —

Seva: Ready to make a result, DM. (reply to 64428)

Chief: Hello community,  I am trying to get code and data to test contract upgrade of my contract (SETCODE) but my Contract.compile.json file doesn't change (hash, hashBase64 and hex values) after building with Blueprint  I also noticed my nft Collection and NftItem have the same compile.json after building both individually

maksim: SETCODE doesn't affect compilation results since it changes code at runtime, when contract is already in the network, and .json result is static file during compilation (reply to 64436)

Chief: Okay (reply to 64437)

Chief: I defined SETCODE in my contract. I want to send a message to update the code and data with new code and data cells. I was trying to get the new code through ⁠ const codeCell = Cell.fromHex(hex); ⁠ where 'hex' is from my compile.json but the problem is that after i updated the code of my contract, the hex of the new contract is the same as the hex of the old contract. (reply to 64437)

Chief: Any pointers to how to properly execute SETCODE will be appreciated. Currently i need to get the new Cell of my updated contract and pass it to my old contract. Here is the Upgrade message in my old contract:           self.requireOwner();         if (msg.code != null) {             // Change of code will be applied at the end of this transaction             setCode(msg.code!!);         }         if (msg.data != null) {             // Change of data will be immediate             setData(msg.data!!);         }     }  asm fun setCode(cell: Cell) { SETCODE }  asm fun setData(data: Cell) { c4 POP }

&rey: You also have to stop current execution with command like THROW 0. (reply to 64442)

&rey: It must mean that compiler determined those contracts are same. Or that you run wrong blueprint command. (reply to 64440)

&rey: Please also add validation with oldDataHash or like, so that no updates between forming the upgrade message and processing it can ever be lost in the contract. (reply to 64442)

— 2025-06-02 —

🌸Alunvit🌸: Hi everyone! 👋  I'm working on a Telegram Web App game called ALUNBIT — a soul-based, step-counting adventure with deep moral choices.  🧠 Core concept: Players grow unique NFT souls (light, dark, or neutral) by walking in real life and making decisions in story-driven investigations (inspired by Sherlock Holmes). Souls evolve based on thinking quality, not XP.  🎮 Key mechanics: – Step-based earning system – Map with hidden chests and missions – Moral choices affect soul evolution – NFT marketplace for souls – Premium roles (Pirate, Wizard, etc.) – Clan-based referral system – Powered by TON  💡 Our vision: a mix of Aglet, Hamster Combat, and detective mechanics, where critical thinking matters more than just clicks.  We're building an MVP now and looking for devs interested in TON integration (NFTs, TonConnect, smart contracts) and gamified blockchain UX.  Let me know if you're interested in the idea or want to collaborate!

— 2025-06-03 —

Oha: 🧩 Looking for some support – TON Telegram Mini Game  Hi everyone!  I'm building a small Telegram Mini App that combines XP progression, daily tasks, and NFT avatars, with wallet integration planned via TON Connect.  The basics are already in place (bot, task system, early UI), but I’d really appreciate support with: – TON Connect integration – Mini App UI logic (HTML + JS) – Optional: NFT-based access control or gated content  Open to short-term collaboration, feedback, or co-building.  If you have experience with Telegram Bots or Mini Apps and feel like helping out, feel free to DM. Happy to share the current progress & roadmap.  Thanks!

— 2025-06-04 —

Yet Another Anti-Spam Bot: Bot decided that this is a spamer. Is it correct? Vote (1/3)
