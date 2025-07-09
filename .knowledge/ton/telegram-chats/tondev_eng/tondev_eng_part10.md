&rey: Yes, get_jetton_data or sth like that returns it. (reply to 128262)

&rey: Make sure to cross-check that jetton master really gives that jetton wallet's address, or you risk spending TON on wrong contract but thinking that's just high fees.

Valentin: Is there a way to get faster access to this client?   const tonClient4 = new TonClient4({       endpoint: await getHttpV4Endpoint({         network: 'mainnet',       }),       timeout: 100000,     });

User<7460221582>: there are few methods to get faster access to that client (reply to 128272)

Valentin: e.g?

User<7460221582>: first,  u can select the high0performance endpoints

User<7460221582>: second, instead of creating new client's instance for each request,  create a single

User<7460221582>: and reuse it

User<7460221582>: okay?

Valentin: yeah ofc

Valentin: how (reply to 128276)

User<7460221582>: choose reliable,  low latency servers closet to ur location (reply to 128283)

&rey: I don't think there is much point in choosing from one well-known server. (reply to 128284)

User<7460221582>: but it is important to use the nearest server in the geographical region (reply to 128285)

&rey: Nearest server from the set of one is always the one and same actually 😀 (and I haven't heard of many RPC options for TonClient4). (reply to 128286)

User<7460221582>: exactly (reply to 128287)

Valentin: there has to be a way, its too slow to connect to remote storage

Eduard: Hello, can anyone from ton support help me with a problem I've had?

Alex: Hey, TON is eager to hear about everyone's development experiences. Your opinion will diffidently affect on further focus of improvement developer experience, don't hesitate to share your with us during this weekend.  👉https://eoolk3ab.paperform.co/ (reply to 126822)

D: Please tell me how to decode the boc from the mempool(ton-api) to parse all the transactions inside and find out the opcodes

— 2024-12-07 —

Alex: You can start from this example: https://docs.ton.org/v3/guidelines/dapps/cookbook#how-to-parse-transactions-of-an-account-transfers-jettons-nfts (reply to 128329)

barbod: nice (reply to 128321)

barbod: import { TonClient, WalletContractV4, internal } from "@ton/ton"; import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto"; import TonWeb from "tonweb";  // Create Client const client = new TonClient({   endpoint: "https://toncenter.com/api/v2/jsonRPC", });  // Generate new key let mnemonics = [  ];  let keyPair = await mnemonicToPrivateKey(mnemonics); const { publicKey, secretKey } = keyPair;  // // Create wallet contract const workchain = 0; // Usually you need a workchain 0 const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey }); const contract = client.open(wallet); const amount = 0.01;   const seqno = await contract.getSeqno(); // // ارسال تراکنش await setTimeout(async () => {   const tranler = await contract.createTransfer({     seqno,     secretKey,     messages: [       internal({         value: TonWeb.utils.toNano(amount.toString()),         to: "UQCPWJ0RvEy-C9KzzxaTV9IGscro3NLSY3GbZPdwc_43HA1-",         bounce: false,         body: "artan",       }),     ],   });    setTimeout(async () => {     await contract.send(tranler);   }, 3000); }, 3000);   I am transferring my Ton coins with this code, but the problem is that I don't know how I can check the status.  I want to see if it has been successfully sent or not. If it has, what are the comment and hash? (reply to 128263)

Mamadoo ၊||၊ DeSpeed ၊||၊: How can i change stars into Ton

Олег: Hey guys, having a hard time writing  a wrapper for  a function  () withdraw(int amount) impure {     throw_unless(error::not_authorized, equal_slices(context::sender, data::owner_address));      send_raw_message(begin_cell()         .store_uint(0x18, 6)         .store_slice(data::jetton_wallet)         .store_coins(0)         .store_uint(1, 107)         .store_ref(begin_cell()             .store_uint(op::jetton::transfer, 32)             .store_uint(context::query_id, 64)             .store_coins(amount)             .store_slice(data::owner_address)             .store_slice(data::owner_address)             .store_uint(0, 1)             .store_coins(10000000)             .store_uint(0, 1)         .end_cell())     .end_cell(), 64); } Long story short - I have issues with passing ContractProvider, yet It was stated in all wrappers, but wasn't neccesary to pass from wrapper call, but when I wrote the wrapper myself it's requiring ContractProvider argument. I'm using blueprint as framework

Олег: Has anyone faced similiar issue?

Sam: Hey guys, I need help  const transaction = {     validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec     messages: [         {             address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",             amount: "20000000",          // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove         },         {             address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",             amount: "60000000",          // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove         }     ] }  try {     const result = await tonConnectUI.sendTransaction(transaction);      // you can use signed boc to find the transaction      const someTxData = await myAppExplorerService.getTransaction(result.boc);     alert('Transaction was sent successfully', someTxData); } catch (e) {     console.error(e); } How can i generate payload ?  I want transfer HMSTR to another wallet   Plz helo me

DeeNoize: Hello, guys. Who can help me with the TON Connect? (rus,eng speaking)

Imran: What is the equivalent of JS console.log in a TON smart contract function for debugging?  ```` () recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {} ```  I want to log the parameters of my contract.

Imran: Follow the Stackoverflow answer to generate payload. https://stackoverflow.com/a/78895080/28570375 (reply to 128377)

Imran: What kind of help do you need? I think you should ask your question directly here with the specific details of your problem. (reply to 128392)

Sam: script.js:54 Uncaught ReferenceError: beginCell is not defined     at script.js:54:14 (reply to 128407)

Imran: import { beginCell } from "@ton/core"; (reply to 128411)

Sam: can i send message in the your dm> (reply to 128412)

Imran: Okay

TON Bounty Bridge: ​Implement STONfi Swap V2 in tonutils (Python)  🏷 Developer Tool  Summary:Add STONfi Swap V2 to tonutils (Python) for TON-to-Jetton, Jetton-to-TON, and Jetton-to-Jetton swaps...  Rewards: • 400 USD in TON  Created by littlecat-dev

Даниил: Good afternoon, tell me how you can transfer web data from js to unity. I am grateful in advance 🤝

&rey: Please choose an appropriate chat then; I don't think many people here can fix something with Unity. (reply to 128430)

Imran: What is the equivalent of JS console.log in a TON smart contract function for debugging?  () recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {} I want to log the parameters of my contract.

&rey: Maybe a debugger (retracer.ton.org) would suit you better?  Generally, you can use msg_value~dump() and ~strdump("a constant description"). (reply to 128444)

Imran: Thanks. Let me play with the things. (reply to 128445)

Олег: Have anyone had the same issue? (reply to 128375)

Cube: Start your wrapper function name with "send", for example "sendWithdraw(...)" and blueprint will pass contractProvider automatically (reply to 128452)

Олег: Duude, thanks a lot!

Nikita: Hi guys,  I am looking for information on how to use TonConnectUI to blacklist a signer's wallet address for a multisig contract from my web app.    Does the TON network have a function for blacklisting signers wallets in a multisig like etherium? Andwhatis the correct structure of a transaction body message request if it exists?  Thank you in advance for your help!

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: In case that you need to send results from ton connect to your controller, use ajax (reply to 128430)

— 2024-12-08 —

a: Hi, how does MyTonCtrl modify the data storage directory?

a: I didn't find where I can modify the configuration of its datastore

Sam: Anyone know how to calculate a transaction fee?  For example, if I want to transfer 1000 Hamster, how much fee is required?

Mamadoo ၊||၊ DeSpeed ၊||၊: I don't know, Ton  is the most f..u.ing disgusting Blockchain ever. It has many different gas fee in different things 🤣 (reply to 128532)

Mamadoo ၊||၊ DeSpeed ၊||၊: one ton collection if you put it's NFT on sale it needs 0.01 usdt .  But another needs 0.33 ton

Олег: Your advice really helped, thank you. But now I face slightly different issue. () send_tokens(slice recipient, int amount) impure {     send_raw_message(begin_cell()         .store_uint(0x18, 6)         .store_slice(data::jetton_wallet)         .store_coins(0)         .store_uint(1, 107)         .store_ref(begin_cell()             .store_uint(op::jetton::transfer, 32)             .store_uint(context::query_id, 64)             .store_coins(amount)             .store_slice(recipient)             .store_slice(recipient)             .store_uint(0, 1)             .store_coins(10000000)             .store_uint(0, 1)         .end_cell())     .end_cell(), 64); } How should wrapper look like for this function? (reply to 128453)

Олег: The trxn passes through, but tokens are not sent, each time it returns 709 error, as far as I know it is lack of funds issue

Sam: Should the recipient's address be included in this field?  Plz help me (reply to 128377)

Sam: And what is : response_destination

&rey: It is usually done arbitrarily in my experience. There are clear upper bounds for any token specified in advance: 0.06 TON should be enough for any common jetton transfer (assuming zero forward amount). (reply to 128532)

&rey: Please take a look at https://docs.ton.org/v3/documentation/smart-contracts/message-management/ecosystem-messages-layout#transfer-jettons. You send the first message (the leftmost arrow). (reply to 128560)

Sam: I understood  And can you show me jetton wallet example? Plz (reply to 128568)

Дмитрий: Hello. I develop simple game on React and I want to add ability for buying Jettons. I use assets-sdk for working with Jettons. I made custom Jettons, I know how to send Jettons from JettonMinter to user JettonWallet. But I don't understand how force the user  to pay for Jettons. Maybe someone can help me?

Олег: Can anyone help? (reply to 128551)

&rey: Generally you create a smart contract (often called "liquidity pool"; you can do that on DeDust or StonFi), and then jettons will be purchasable automatically. Backend will not be (zero trust principle), and frontend would make a swap request. (reply to 128583)

Дмитрий: There is way to do it on testnet? (reply to 128609)

Fotex: Why can't I connect to liteserver? Every time I try to connect via pytoniq (python ton library), I get a TimeoutError. What can I do?

&rey: Some liteservers are unavailable for certain IPs or at all. Please try LiteBalancer. (reply to 128612)

Ivan: Hello there!  What’s this error mean?  Failed Compute Phase. Exit code 710

Ivan: I’m trying to send jettons from wallet to wallet

Ivan: Jettons are frozen?

Sam: ??? (reply to 128570)

&rey: It indeed seems so. Looking at https://retracer.ton.org/?tx=e4c9a42cd3848c3953ba5dfcfb0690c53b632b57274e4b1c145ab63d1a129ae0, I see: — on instruction 51, value 0 (above some Slice {8002132... is pushed onto stack; it is loaded from c4 — contract's persistent storage — instructions 52-63 don't touch it — instructions 64-66 check that that four-bit field  is equal to 1. (reply to 128620)

&rey: I'd suggest not to use jettons with such mechanics unless you absolutely must or remember how to handle it.

&rey: Here you are: https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-wallet.fc. (reply to 128570)

Sam: For example this is jetton wallet ?  0:09f2e59dec406ab26a5259a45d7ff23ef11f3e5c7c21de0b0d2a1cbe52b76b3 (reply to 128632)

&rey: I don't know, and blockchain does not know, as it's not deployed. (reply to 128633)

— 2024-12-09 —

Jacob: rpc error :   cannot compute block with specified transaction: cannot find block (0,03d18a0b4b77c76f) lt=28733542000001: lt not in db  how to address this issue?  Thank you

TKAINU: Hello, i call transfer Cati token, but error: Compute Phase Success: false Exit code: 709  I have never encountered this error 709, please help me, this is a cati contract  https://tonviewer.com/EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7

final: Check source code of Jetton master or wallet (reply to 128677)

TKAINU: I found the error, due to lack of gas, but the opcode here is 709, not 48 like other contracts. (reply to 128678)

final: Because it is thrown by contract itself, which provides custom op codes (reply to 128679)

Martin: GM guys, I'm facing an issue when sending message which throws an error 34 - "unsupported action". Do you guys have this one before and how to handle this one?  Many thanks!

Chris: hihi

Chris: Hello everyone, I am installing tonos-cli, I encountered a problem, I cloned the following URL, but the CMakeLists.txt file is missing, please tell me which URL should I clone?

&rey: I'm not certain that tool works for TON. (reply to 128722)

Chris: Hi, I am referring to EverX Labs github, so ton don't have the official cli? (reply to 128723)

&rey: TON has toncli. Everscale is a separate blockchain, another fork of Telegram Open Network. (reply to 128726)

Chris: I understand, thank you for your explanation, can you teach me how to install toncli?

&rey: Here it is: https://github.com/disintar/toncli/blob/master/INSTALLATION.md. (reply to 128729)

Sharma: Hey Guys i am using  import { TonClient, WalletContractV4, internal } from "@ton/ton"; WalletContractV4 to transfer the ton via typescript. But not able to get transaction hash.  Please help me with this

Sharma: using below code link  https:// tonhelloworld. com/ 01-wallet/

&rey: How would you use transaction hash, and which of two transactions making up TON transfer you want to get? (reply to 128743)

Sharma: https:// tonhelloworld. com/ 01-wallet/ in the above link (I have added spaces wasn;t able to send msg without spaces in link)  i am following step9.ts (reply to 128747)

Chris: Thanks for the offer, does the CLI you provide also support decoding the BOC function? (reply to 128730)

Tea the Bottle: hello, Im stucking at this part: when user send a Message to master contract, how can I let user what will they received back ?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 21  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

User<7057220524>: Hello, everyone! I'm now implementing Jetton Transfer on Testnet. But during execution, there is an error like this:   "Starting Jetton Transfer... Validated TON Address: kQBhSM9IgBCEEqkugbx_W0VgxvGJnVxeQBWjGS4vhSCb0UGz Validated TON Address: 0QDfK2keqcbdPGzA4nSMxnwzyAoOprTacq-qYNtqof8MbISY Addresses validated. Wallet initialized. Fetching Jetton Wallet data... Error during Jetton transfer: Error: http provider parse response error     at HttpProviderUtils.parseResponse (C:\Users\Loyalty\Documents\Jetton TRS\node_modules\tonweb\src\providers\HttpProviderUtils.js:51:25)     at HttpProvider.call2 (C:\Users\Loyalty\Documents\Jetton TRS\node_modules\tonweb\src\providers\index.js:154:34)     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)     at async JettonWallet.getData (C:\Users\Loyalty\Documents\Jetton TRS\node_modules\tonweb\src\contract\token\ft\JettonWallet.js:60:24)     at async C:\Users\Loyalty\Documents\Jetton TRS\index.js:106:34 {   result: {     '@type': 'smc.runResult',     gas_used: 670,     stack: [ [Array] ],     exit_code: 11,     '@extra': '1733743078.1810906:0:0.43261249227031207',     block_id: {       '@type': 'ton.blockIdExt',       workchain: -1,       shard: '-9223372036854775808',       seqno: 25821712,       root_hash: 'h3NvFNxe+SD0YN3ES+GZDKGAx7XiIgPcIG2e9Mfjd2I=',       file_hash: 'XehFHgrmZllObil/VvsxmvCKENLepUuPC01yMWQNi9o='     },     last_transaction_id: {       '@type': 'internal.transactionId',       lt: '28881838000002',       hash: 'K3Jlrnea/u+mvicsbPHMnXZH7uM/M8RBbjuwA+Ns9y4='     }   } } "   How can I fix this?

Bus: Hi, how to set up a smart contract that can serve a small TON HTML site? Is there any information how such a contract should look like?

Mujtaba: Hello everyone, I was just curious about this quotation from whitepaper  A workchain may declare some number of raw data bytes per account to be ____ (doesn’t cost)  Does the base workchain currently has some bytes allowed? And where can we find this param in the config?

Mujtaba: I just quoted the word from whitepaper 🤦‍♂️ (reply to 128781)

&rey: It is unsupported (even though it should've been developed). (reply to 128779)

&rey: I don't think so. (reply to 128783)

&rey: Please contact developers of whatever wallet emulates your transaction wrong. (reply to 128759)

&rey: Decoding to what datatype, sorry? (reply to 128751)

Levis: hi is there any usdt faucets i can use in testnet development

Chris: Cell & Bag of Cells ^^ (reply to 128793)

&rey: I asked what should be the result. (reply to 128797)

Tea the Bottle: I just dont understand how contract calculate returning of transactions ? (reply to 128792)

Chris: I will like to get payload data,such as min_out , amount,etc (reply to 128799)

&rey: I don't understand what you ask about; probably you have some incorrect idea about how TON Blockchain works. (reply to 128806)

&rey: 1. BOC doesn't contain any data about what fields are in cells. 2. toncli doesn't support providing such markup (TL-B) either. (reply to 128813)

Tom: Yeah, basically a pack of bits with predefined layout.

{ дүние } ақырет: Hello TON Community,  I am a final-year student working on my diploma project titled "Decentralized Learning Management System (LMS)". I have chosen to build this system using the TON Blockchain and Go programming language.  I have recently completed a course on TON Blockchain and have gained foundational knowledge about the technology. However, I would greatly appreciate guidance and advice from experienced developers to ensure the successful completion of my project.  My project involves integrating TON Blockchain to enhance decentralization, data security, and efficiency in learning management systems.   Currently, I am focused on designing smart contracts for my project. My idea is to:     Create mints representing individual courses.     Award users tokens upon completing each course.     Allow users to exchange all earned tokens for a certificate token upon completing all courses.  This concept is still in its early stages, and I am unsure if it is feasible or the best approach to achieve my goals. I would greatly appreciate feedback, advice, or examples of similar implementations from experienced members of this community.  If anyone in this group is experienced in similar implementations or can share resources, examples, or mentorship, it would mean a lot to me. I am also open to collaborating on related initiatives.

Chris: Let me explain, because I have from tonconsole's api, get the BOC in mempool, at present only decode the sender, amount from it, I want to decode more playload data, may I ask what way can I do it? (reply to 128846)

Sharma: Hey Everyone,   I am doing transaction using @ton/ton lib but all the transaction is getting reversed.  Can you help me what type of address  should i parse too.   example txn hash 474367c1fa8d75d2b675f548287a8037b5e2eebd53b047159e764020b1594d71

&rey: Generally you use Python (pytoniq) for processing. (reply to 128849)

Chris: Could you provide me with the documentation? (reply to 128851)

Sad Bun 🐇: bounce flag should be false when you send to wallet which is not deployed (non-exist/uninit) (reply to 128850)

&rey: No. In TON, you just write such code — or translate from an existing implementation. (reply to 128852)

Sharma: Thnx it worked. (reply to 128853)

Chris: Can you provide some examples? I've written some functions in JS before, but they don't work. (reply to 128854)

&rey: JS for parsing incoming jetton transfer notifications: https://github.com/toncenter/examples/blob/main/deposits-jettons.js#L123-L132. (reply to 128856)

Rasoul: Hi I have a wallet and I want to automatically approve certain transactions that require confirmation. How can I set this up using an API ?

&rey: That's not a done thing. You need to 1. reimplement TON Connect 2, wallet side, in your own wallet application, 2. use existing or create your own bridge, 3. start the app; only then it will work. (reply to 128858)

Rasoul: I don't understand. Can you explain further? (reply to 128860)

Rasoul: Is there a way to give 24 backup key to a script and connect it to the desired application or site and have it confirm the transactions? (reply to 128860)

Rasoul: Or any method I need to automatically confirm transactions

&rey: "connect script to the desired application" is like a few weeks of work. (reply to 128862)

Rasoul: What is your suggestion? (reply to 128864)

&rey: This is: https://t.me/tondev_eng/128860. (reply to 128865)

Musharraf: Hello, I wanted to create a TON  wallet, can you give me an example?

&rey: Hello! If you're a newcomer, you can simply install an app from https://ton.org/wallets, and that's it. (reply to 128867)

Rasoul: Do you know of any services that offer this? So how do cex verify their own transactions? (reply to 128868)

&rey: CEX? Presumably they don't use TON Connect 2 inside, and have no need to connect to any external sites, which is THE difficulty. Without such need, they can simply send messages with pytoniq or similar libraries. (reply to 128869)

Khashayar: Hey guys any links or documents on how i can deploy my Custom token on TON ?   I tried Ton IDE  It just gives out weird errors   I tried manual way of compiling and converting Func to fift and to TVC but that’s just so confusing to me   Any ready projects that i can just use my contracts instead  But follow the project path?

&rey: https://minter.ton.org is the most common way.  However, first you develop jetton architecture, then write the contracts, and only then deploy. Token's internal logic does not change (unless you use SETCODE but I will not provide instruction on this). (reply to 128872)

Khashayar: Minter ton just make a basic token  I want more options on my Contract  That’s why im trying to write my own contract   I did write mine  Dunno if it’s ok or not  I don’t know how to deploy it (reply to 128873)

Khashayar: Have all the contract files ready  Just don’t know how to deploy

&rey: Create initial data cell. Then, calculate StateInit. Then, send message to <0:hash of StateInit> with a bit of TON and StateInit itself attached. (reply to 128875)

TonAlph: Someone help me to get ton api pls

Nick: You mean this one?   https://toncenter.com/ (reply to 128879)

TonAlph: I mean api url (reply to 128883)

Nick: https://toncenter.com/api/v2 Or https://toncenter.com/api/v3  Or these ones for test net  https://testnet.toncenter.com/api/v2 Or https://trstnet.toncenter.com/api/v3

Nick: That's some different one, there are a lot of API you can use, personally I use toncenter, but you can use any (reply to 128896)

&rey: I shall note GPT-generated code did not work for TON any time I, or other devs, tried. (reply to 128896)

TonAlph: Ohh 😦 (reply to 128899)

&rey: Yes, only manually writing, as it happens)  You should first describe your task to yourself, and then check out which of dton.io/graphql | toncenter.com | tonapi.io suit you. (reply to 128900)

TonAlph: Ok thk you. (reply to 128901)

Аro: Please repair tonconnect ui

TON Bounty Bridge: ​Implement referral system in the TON Circle  🏷 Developer Tool  Summary:Create a new page in TMA with all the necessary information about how the Referral System works, int...  Created by coalus

Jorsh: I try to use tonConnectUi in react, but it has an error with the versions that are incompatible (i have react 19.0.0 and tonConnect 2.0.9)

Valentin: Do you guys know example of tokens with buy/sell tax?

Sam: Is there any programmer? I need, I will pay him if he can help me Related to tonConnect, create transaction

Imran: Yup, @tonconnect/ui-react not working with react v19.0.0 but it's working with react v18 (reply to 128940)

Valentin: Hey, qq about jettons. Do jetton_wallet contracts need to be deployed or are them automatically created when someone transfers funds into it?

Akachi: @pcrafter do we have meme on TON?

&rey: I note that I moderate discussion concerning memecoins and TMAs in this chat; offtopic (anything not related to development of new things or help with using existing code) is deleted with possible ban. (reply to 129096)

&rey: Automatically. (reply to 129092)

&rey: Concerning my ^^ message: Telegram and its stars are not related to TON. (reply to 129109)

Sam: ! (reply to 129057)

&rey: Could you name what message you want to create, please? (reply to 129057)

&rey: 1. Off topic for this chat. 2. Fragment and Telegram are deeply integrated, with all those anonymous numbers and such. (reply to 129124)

Sam: I want transfer 1000 HMSTR with my wallet to my freind wallet I want do it this with script (tonConnect)  I don't know how can i create transaction   For example I want know all parameters of this picture  Why have 2 address ? And addresses should be what address and ......  And for example in the this section:  messages: [     address: '',     amount: '',     body: '' ] Address and amount should be what input ? (reply to 129123)

&rey: Moderator warning for offtop. (reply to 129130)

&rey: The former address is destination. The latter indicates where TON which haven't been used for transfer shall be returned. (all TON transactions are backed with some TON value, at least for computation and other fees, but with jettons there's always excess amount left). It normally contains sender's address. (reply to 129133)

Sam: 4th: receiver's address 5th: sender's address  Right ? (reply to 129146)

Sam: And I want transfer HMSTR So how does the script know what currency I want to transfer? (reply to 129146)

&rey: The message destination (in sendTransfer / sendTransaction) is sender's jetton wallet of corresponding token. (reply to 129159)

Sam: Check this  this is right ? (reply to 129174)

Sam: so if true why dont work (reply to 129188)

&rey: You have to send 0.04-0.07 TON to jetton wallet. (reply to 129196)

Sam: what do you mean (reply to 129197)

&rey: Well you use body2 somewhere? (reply to 129201)

Sam: Yes i generate body2 and put to paylod (reply to 129203)

Sam: This is HMSTR jetton wallet address?  0:09f2e59dec406ab26a5259a45d7ff23ef11f3e5c7c21de0b0d2a1cbe52b76b3d

&rey: No it isn't. Please note that jetton wallet is not the same thing as jetton master. (reply to 129216)

Sam: How can i find HMSTR jetton wallet address (reply to 129221)

&rey: Well that is covered by docs already! Here it is: https://docs.ton.org/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offchain. (reply to 129224)

Sam: Ok lemme check (reply to 129225)

Sam: In which parameter should the HMSTR jetton wallet address be placed after it is found? (reply to 129225)

&rey: In messages[0].address. (reply to 129231)

Sam: This address right ? (reply to 129213)

Sam: And amount is a fee in the this pic ? (reply to 129213)

&rey: I suppose you can say so, yes. (reply to 129237)

— 2024-12-10 —

Dev System: I have a shortlink web platform, do you have any suggestions for creating tokens and then selling ownership?

Aleks: Hey all. How to switch to testnet on TonKeeper Desktop? Can’t find it since recent update. Using 3.26.1

Olesia: Hello, what does .store_uint(0x10, 6) flag mean instead of 0x18 when sending messages?

Ксения: 0x18 in binary is 0b011000, 0x10 is 0b010000  These bits mean: 1st indicates it is int_msg_info, 2nd - ihr is disabled, 3rd - can message be bounced, 4th - is message  the result of bouncing itself, last two - addr_none for sender address (it will be rewritten by validator, so we use the shortest valid address)  0x10 differs from the 0x18 only by the third bit, which is 0 (message can't be bounced) (reply to 129333)

&rey: I'm not sure that is implemented. (reply to 129334)

TON Bounty Bridge: ​Schemes Upgrade for TON Documentation  🏷 Developer Tool  Summary:Improve the visual representation of concepts in the TON Cookbook by redrawing current schemes to fi...  Rewards: • SBT Bounty Reward • 800 USD in TON  Created by AiramGol

Smart: hi all, anybody who uses tonconnect, what happened to this?   const connectedWallet = await tonConnectUI.connectWallet();   const unfriendlyAddress = connectedWallet.account.address   const address = Address.parse(unfriendlyAddress); it now returns some dictionary instead of address. {'workChain': 0, 'hash': {'type': 'Buffe... (expected str, got dict)

:): Morning everyone!  I’m writing a smart contract in Tact that holds multiple tokens (via Jetton Wallets).   The intended functionality is as follows:  When the contract receives 1 TON, it automatically transfers 1 Jetton X or Y depending on the address of the Jetton Wallet to be debited that is provided dynamically via a transaction message.   However, I’m facing an issue where the tokens are not being transferred as expected.   Router.tact :    import "@stdlib/deploy"; import "@stdlib/ownable";  message TokenTransfer {     jettonWallet: Address;     amount: Int as coins;     destination: Address;     responseDestination: Address;     customPayload: Cell?;     forwardTonAmount: Int as coins;     forwardPayload: Slice as remaining; }  contract RouterWallet with Deployable {     owner: Address;            init(owner: Address) {         self.owner = owner;     }      // Jettons Transfers With Dynamic Jetton wallet Address     receive(msg: TokenTransfer) {                  let ctx: Context = context();          let tokenAmount: Int = ctx.value;         let jettonWalletAddress: Address = msg.jettonWallet; // jetton add transmitted          let tokenMessage: TokenTransfer = TokenTransfer{             amount: tokenAmount,             destination: ctx.sender, // Response to the sender             responseDestination: myAddress(),             customPayload: null,             forwardTonAmount: ton("0.1"),             forwardPayload: emptySlice()         };                    send(SendParameters{             to: jettonWalletAddress,             value: ton("0.05"),             mode: SendIgnoreErrors,             body: tokenMessage.toCell()         });      } }    ----  Transaction example :     // Dynamic parameters const jettonWalletAddress = "kQDO08pZn-TcBEIexzaHcFh09lkgc8Kb9chHTvYnc-Wt1DpL"; const autoResponderAddress = "kQBQu9WdDkn-ec5kpTBXHiipCtjPVSZf-1VgXJiSZL3s9NSP";              // Build the message let messageBody = beginCell()     .storeUint(0xd67c61e1, 32)  // Opcode pour transfert     .storeUint(0, 64)                .storeCoins(7000000)             .storeAddress(Address.parse(jettonWalletAddress)) // Wallet Jetton to use     .storeAddress(Address.parse(autoResponderAddress))     .storeUint(0, 1)                 .storeCoins(ToNano("0.1"))       .storeUint(0, 1)                 .storeUint(0, 32)                .endCell();              // Transaction data const transactionData = {     validUntil: Math.floor(Date.now() / 1000) + 60,     messages: [{         address: autoResponderAddress,         amount: "700000000", // 0.7 TON         payload: messageBody.toBoc().toString("base64")      }] };     Could someone guide me on:  Potential causes for the tokens not being transferred?  Steps to debug the issue effectively?  Any advice or pointers would be greatly appreciated! 😊

Mr. AnonCoder: does anybody have an example of how to generate an Ton Wallet programmatically?

&rey: Um, I wasn't aware it was hard? (reply to 129390)

Mr. AnonCoder: what? (reply to 129401)

Namon: https://docs.ton.org/v3/guidelines/smart-contracts/howto/wallet#generating-a-mnemonic (reply to 129390)

:): Isn't there a nice developer who knows tact-lang to tell me what I'm doing wrong? (reply to 129381)

Tomek: How do I start, if I want to learn how to build an mini-app?

:): https://www.learn-js.org/ (reply to 129406)

&rey: forwardTonAmount is greater than value[to jetton wallet], which can't be completed. (reply to 129381)

Best Trading: I want to learn how to write smart contracts

&rey: I'd recommend the first five options of pinned survey. (reply to 129418)

发财哥: Hello everyone, has anyone used the api of https://github.com/toncenter/ton-indexer? When querying the Get NFT collections method, how do I pass the collection_address value? It always returns null

发财哥: request url :  https://toncenter.com/api/v3/nft/collections?collection_address=0%3A80d78a35f955a14b679faa887ff4cd5bfc0f43b4a4eea2a7e6927f3701b273c2&owner_address=0%3Ad146a499ee4f1b5841e14d679955f84357f1617a0837afa0e9028cf137b2893e&limit=10&offset=0

&rey: Please try urlsafe user-friendly format. (reply to 129422)

发财哥: Do you mean the format of the address? How to convert the format? (reply to 129424)

发财哥: https://toncenter.com/api/v3/nft/collections?collection_address=EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi&owner_address=UQDRRqSZ7k8bWEHhTWeZVfhDV_Fhegg3r6DpAozxN7KJPvGH&limit=10&offset=0   It always returns null

Sam: Bro still I have problem 😭  Can i send message in the your dm? (reply to 129233)

&rey: I think you can contact @Gusarich , that'd be the best way to know) (reply to 129437)

Sachin: Are there any tondevs in here that can point me in the right direction to help us create a smart contract for our automated vaults.

Shkiper: Hello guys, please help me, I need to automate the identification of a transaction in the blockchain, I have a problem with a comment in the body of the transaction how to form a comment correctly so that it is not encoded or how to decode the boc transaction correctly???

Valentin: Is there a way to get transactions with the whole transactions tree (with children tx) using any of the clients?

Valentin: like the whole tree

&rey: Tonapi does that. (reply to 129521)

Valentin: ton client doesn't?

Valentin: i get the tx but not children in the getTransactions() call

&rey: No. Those are thinner wrappers over TON Blockchain, and blockchain doesn't store transaction tree somewhere in consecutive slots. (reply to 129524)

Goldmaster525: Hello, can I get your help for func contract dev?

Goldmaster525: When I deploy JettonMinter contract, I got this error.

&rey: Please ask. Chat history and documentation (docs.ton.org) are also to your service. (reply to 129531)

&rey: Old Asm.fif installed... try updating blueprint. (reply to 129532)

Goldmaster525: oh, version issue? ill try. thanks

Victor: Hello everyone, can you tell me, I don't understand what the error is, I want to create a dictionary where the keys are address hashes, so the key in the dictionary can only be int. Such a key is used to store certain data for a certain wallet. But when I run the tests, he writes that he cannot serialize BigInt, although if you substitute literals like 1, 2, 3... instead of a hash, then everything works. Tell me please () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     slice cs = in_msg_full.begin_parse();     int flags = cs~load_uint(4);      cell data = get_data();     slice ds = data.begin_parse();     cell dic = ds.slice_bits() == 0 ? new_dict() : data;      slice sender_address = cs~load_msg_addr();     cell sender_cell = begin_cell().store_slice(sender_address).end_cell();     sender_hash = cell_hash(sender_cell);     slice hash = in_msg_body~load_bits(256);      dic~udict_set(256, sender_hash, hash);      set_data(dic);      return (); }  cell load_data() inline {   cell data = get_data();   slice ds = data.begin_parse();   if (ds.slice_bits() == 0) {     return new_dict();   } else {     return data;   } }  slice get_the_hash() method_id {     cell dic = load_data();     (slice hash, int success) = dic.udict_get?(256, sender_hash);      return hash; }

— 2024-12-11 —

Jacob: how to debug contract which has been deployed on testnet?

&rey: TMA questions without TON content are off topic for this chat.

Fatih Tasdemir: Hello everyone! We're working on a TMA project and are planning to create our own SBT collection using Ton Society's cSBT method. Anyone knows a documentation or a tutorial about making an SBT collection?

Goldmaster525: I deployed jetton minter (it's from notcoin jetton). when I deployed, metadatauri seems not valid. please recommend me where I can upload metadata to avoid this issue. thanks

WhyesCode: Yes. You can hire me (reply to 129472)

Wiz: Probably. Let me know if you need help. You can dm if you’d like. (reply to 129472)

Goldmaster525: I also get this problem. I need your help.  any idea? (reply to 129697)

&rey: Well maybe provider.api() returns just TonClient? TS type casts don't actually do anything and certainly don't implement additional methods. (reply to 129729)

Goldmaster525: It's in this way. what can I do fix?

Goldmaster525: How to case it in force?

&rey: If you have an apple, you can't force it into an orange, even when its type is labelled Apple|Orange. So no you can't. (reply to 129732)

Goldmaster525: Oh, I am confused. How can I pass? please teach me

Goldmaster525: As you know, it's from node_module. I have to upgrade or downgrade it? (reply to 129733)

&: DM me (reply to 129472)

Xu Chen: I have a question. I currently have a hash. How can I determine if the transactions in the transaction tree are all successful, and how are they linked together?  I also looked at the “prev hash” in the message, but it doesn’t match.

B_BIG_MIC: Hi guys, is testnet working? For a few days now I haven't been able to change to the test network in my tonkeeper

Pironmind: Question what language is better for TON? FunC or Tact?

Anton: try both and see the difference  it also depends on your project and your time and budget constraints (reply to 129808)

Pironmind: Low budget of course (reply to 129809)

Pironmind: Simple Jeton with vesting for example?

Smart: Tact is much easier to understand and many examples (reply to 129808)

Anton: for instance https://gaspump.tg is written in Tact, the founder did that in a week, including learning Tact

Goldmaster525: Hello guys. I need your help. I deployed jetton minter on mainnet with this token metadata. It's on ipfs and reachable to that as you can see. What's wrong? Why is the token name Unknown Token?

&rey: Why do you assume some "switching to testnet" in newer versions of Tonkeeper? (reply to 129803)

sulaiman: Okay (reply to 129816)

Goldmaster525: you mean? (reply to 129821)

Goldmaster525: You mean this token metadata is ok. tonscan recognizes that token's metadata as you can see, but why doesn't it load token name and symbol correctly? Btw in tonviewer, its metadata is default unknown token one. 😮‍💨 (reply to 129821)

Chibouni: I have problems  whith ukwn token

Ash 🤓: Is there anyone with good understanding about tact or func

Ash 🤓: Ran into bugs brothers would be grateful if someone could help

WhyesCode: What's the issue? (reply to 129931)

Ash 🤓: I tried to create a token creation form and it will take name symbol supply img description that's all and when I deploy there I took the file from the build folder and kept it in the frontend folder and then it seems to be a error I don't know where the error part but whenever I try launching token (reply to 129934)

Павел: Hello everyone! Has anyone used Webhook API from tonapi? Is it stable? What about missed messages? Is there a mechanism for resending in case my server is unavailable?

Joker: Hello there! Can you help me with generating BOC as there in lesson:  https://docs.ton.org/v3/guidelines/dapps/tutorials/nft-minting-guide  There is not exist any explanation of how to get this BOC...  Can anyone explain or give the link for answer to question - How to get this BOC hex code?  Thank you in advance!

Ash 🤓: Use Tonx api (reply to 129941)

Павел: What reason? (reply to 129944)

Ash 🤓: For ur use case u can use it (reply to 129949)

Namon: This boc - compiled code of nft collection smart contract  How to get boc hex?  Cell.fromBase64("te6cck...").toBoc().toString("hex") (reply to 129942)

Petr 🇷🇺: If I compile contract written on func to fift I can get it? Or when deploy this contract? I'm about te6cck... in your example (reply to 129952)

Павел: Have you used it? There is no concrete JSONRPC-methods for webhooks, only text docs without details (reply to 129950)

&rey: I compiled contracts like that: https://github.com/ProgramCrafter/ton-contract-template. (reply to 129942)

Joker: Thank you (reply to 129962)

Joker: Can you give me line in your repo, where outputs this boc code? Or command sequence to get it boc code? (reply to 129962)

&rey: toncli fift run %BASE_DIR%\build\contract.fif  outputs that BOC into build\boc\contract.boc as raw bytes; you can encode as needed. (reply to 129964)

Joker: Very helpfully! Thank you very much! (reply to 129965)

Ash 🤓: Sir do you know tact (reply to 129965)

&rey: Somewhat. (reply to 129967)

manu: Hello! I am new around here and face the following issue. I have installed Tonkeeper browser and created a wallet. During a tutorial the connect did not allow me to select testnet and would instead try to connect my mainnet wallet. Thought I would try a different wallet app so I went for 'Wallet on Telegram'. In here I was able to insert my mnemonic and set up a password, however now the 'Wallet on Telegram' has generated a new mnemonic for me and asks me to back-up. I do not want this, I want to use my existing wallet which has funds instead of creating a new one. I can not find any way to log out in Wallet on Telegram. Does anybody have any advice on this ? Thanks!

fjila: Why do I see multiple contracts have a "force chain" function in their contract?

Sam: Is there any programmer? I need, I will pay him if he can help me Related to tonConnect, create transaction section

Imran: I'm attempting to batch deploy NFTs using the @ton/core package, but I'm encountering a "Cell underflow" error. I'm unsure what might be causing this issue during the Cell building process. Could someone help me identify the mistake?

&rey: I don't think you need to do storeDict inside reference; you should do that on the main message. (reply to 130028)

Blockchain: When I deploy it with sandbox, the data appears without any problems. But when I deploy it on the testnet, it appears as base64. Why is this so? Where am I doing wrong? Can you help with this? urgent!

Imran: Not working. Still getting the same "Cell underflow" error. (reply to 130036)

Imran: /**  * import {   beginCell,   Cell,   contractAddress,   toNano,   Dictionary,   Address, } from "@ton/core";  */  const generateBatchMintCellNftsJSON = () => {   const baseIndex = 14;   const owners = Array.from({ length: 1 }, () => "NFT_OWNERS_ADDRESS");   const nfts = owners.map((address, index) => ({     itemIndex: baseIndex + index,     amount: toNano(0.2),     itemOwnerAddress: address,     itemContentUri: "",   }));   return nfts; };  interface NftsJSON {   itemIndex: number;   amount: bigint;   itemOwnerAddress: string;   itemContentUri: string; }  function createBatchMintBody(nfts: NftsJSON[]): Cell {   const dict = Dictionary.empty<bigint, Cell>(     Dictionary.Keys.BigUint(64),     Dictionary.Values.Cell()   );    for (const nft of nfts) {     const nftItemContent = beginCell()       .storeAddress(Address.parse(nft.itemOwnerAddress))       .storeStringRefTail(nft.itemContentUri)       .endCell();      const containerCell = beginCell()       .storeCoins(nft.amount)       .storeRef(nftItemContent)       .endCell();      dict.set(BigInt(nft.itemIndex), containerCell);   }    const finalCell = beginCell()     .storeUint(2, 32)     .storeUint(0, 64)     .storeDict(dict)     .endCell();    return finalCell; }

Imran: Single mint is working fine using the following code Cell.  `const createMintBody = (params: {   itemIndex: number;   amount: bigint;   itemOwnerAddress: string;   itemContentUri: string; }) => {   const nftItemContent = beginCell()     .storeAddress(Address.parse(params.itemOwnerAddress))     .storeStringRefTail("");    const body = beginCell()     .storeUint(1, 32)     .storeUint(0, 64) // query_id     .storeUint(params.itemIndex, 64)     .storeCoins(params.amount)     .storeRef(nftItemContent)     .endCell();   return body; };`

Imran: But batch mint is not working using createBatchMintBody function generated Cell

— 2024-12-12 —

&rey: Something is definitely missing here, some TON-like amount. (reply to 130052)

Imran: I am not sure what I missed.

Imran: I think the error is getting from here?

Imran: Maybe udict is not parsing properly from Cell

Imran: I am not getting any idea. Please help me

Imran: Am I creating the createBatchMintBody function dictionary correctly?

Gift: Does TON do chain abstractions?

vahid: Hello,  I am working with the api/v3/transactions endpoint, and I would like to know how to determine if a transaction is definitely a simple TON transfer.  What specific fields or criteria in the transaction response should I check to confirm that it involves transferring TON and not interacting with a smart contract or transferring tokens like NFTs or other assets?  Thank you for your assistance!

&rey: You can check that destination contract didn't send any messages and didn't change its data. If there are no changes on either that or other contracts, then the contract simply accepted TON. (reply to 130117)

vahid: Filtering for TON Transactions:  The opcode is checked to match "0x00000000", which helps identify simple TON transfers. Validation of Value Consistency:  The delta (change in balance) is calculated and compared with the transaction's value to ensure the values align correctly, with a small error margin (eps). Minimum Transfer Threshold:  Transactions with a value below 1000 are filtered out, ensuring only significant transfers are processed. Value Formatting:  The transfer value is formatted to include decimals for better readability.  Are these conditions sufficient to reliably identify simple TON transfers? Or are there additional criteria we should include to ensure accuracy? (reply to 130118)

Zharko: Why don't ton wallets work in the United States?

&rey: Note: TON DNS NFTs process messages with opcodes 0. Note: Tact contracts handle text comments.  etc  I think MY two criteria are both necessary and sufficient, no need to ask LLM about that which it doesn't know at all. (reply to 130119)

vahid: How do I check this condition? Can you tell me exactly what to check in this service?  api/v3/transactions

Alex: Calling All TMA Developers!  TON Studio is conducting a short survey to understand the challenges TMA developers face. Your insights are key to building better tools and solutions.  It’s a quick 2-3 minute survey – we’d love to hear from you!  👉 Share your thoughts here. Thank you for your support! (forwarded from TON Society)

kspr444: hello i successfully added fullscreen on my webapp but dont understand how to configure contentSafearea() someone can help me?

Ash 🤓: Hi  I was basically passing the token info into the contract then I keep getting the offset+length= 15567 i trimmer the metadata size to smaller and lower chunks and tried multiple times too the same error keeps coming

Chris: Hello everyone, I would like to ask a question, how do I receive mempool data when querying a 88018ffa code, please have a way to know which is the opcode of a contract?

Nguyễn Linh: Does anyone use any of RPC Nodes below? Do you have any recommend? QuickNode, Chainstack, Tatum, GetBlock Nodes, GetBlocks Nodes, TON Access, Toncenter, nownodes.io, Chainbase

Anoxy (Wally.id) 😎 ❤️ 😎: Hi everyone, How do I force TonConnectUI to only connect to mainnet wallet or testnet wallet ?

Олег: Can someone help me? () send_tokens(slice recipient, int amount) impure {     send_raw_message(begin_cell()         .store_uint(0x18, 6)         .store_slice(data::jetton_wallet)         .store_coins(0)         .store_uint(1, 107)         .store_ref(begin_cell()             .store_uint(op::jetton::transfer, 32)             .store_uint(context::query_id, 64)             .store_coins(amount)             .store_slice(recipient)             .store_slice(recipient)             .store_uint(0, 1)             .store_coins(10000000)             .store_uint(0, 1)         .end_cell())     .end_cell(), 64); }  I'm trying to call this method from recv_internal ...     elseif (context::op == op::destroy_contract) {         int amount = in_msg_body~load_uint(256);         send_tokens(context::sender, amount);     }  and transaction passes through but without any transfer of jettons Error code is 709 - https://testnet.tonscan.org/ru/address/kQAD98KBViA2Jxj5BbAiFsm7luVCZOqbGype-Tx6NlyzZPba this means that there is not enough jettons, but I've minted enough to withdraw Any ideas on the issue?

— 2024-12-13 —

叶师傅: Hello,gentlemen.Is there an api to get the newest block including all the events? I read the documentation,but found nothing(maybe I’m blind🤣),thanks in advanced ❤️  My current solution  getBlockchainMasterchainHead getBlockchainBlockTransactions

&rey: I don't think so, in particular because some liteservers lag on synchronization. (reply to 130254)

叶师傅: Alright,thanks❤️ (reply to 130259)

Khashayar: Hey guys im a newbie i wanna make a custom jetton  My problem is that my contract gets deployed without any problems   Problem is i don’t receive tokens after deployment   Is there a problem with deployment script?

Osalotioman: Please does anyone know how much ton is needed to activate a wallet? Like the minimum amount?

&rey: 0.001 TON should be sufficient. Anything stating amount on order of 0.1 TON or more is scam. (reply to 130265)

Osalotioman: Thanks

&rey: Activating, or deploying, a wallet means that blockchain records its public key, version, etc (actually, StateInit) under the address which only had TON balance previously.

&rey: You usually don't receive any jettons after deployment, why would you? Rather, you mint however much you need. (reply to 130264)

Osalotioman: To receive a soul bound token is activation necessary?

&rey: SBT... I don't think it cares for deployment status. Compressed NFTs (cNFT, cSBT) might. (reply to 130270)

Osalotioman: Okay

Osalotioman: Didn't change the wallet details on tonscan.org 😔 (reply to 130266)

Toby | OSL: Hi all I saw there is a scheduled network update in Dec 17. May I understand the details of the upgrade? How likely would the network stability be impact

Luke: Hi everyone, after I hash the response boc from a recently sent transaction like this: const response = await TonConnectUI?.sendTransaction({                     messages: [                         {                             address: args.to.toString(),                             amount: args.value.toString(),                             payload: args.body?.toBoc().toString('base64'),                         },                     ],                     validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes                 });                 const inMsgHash = Cell.fromBoc(Buffer.from(response.boc, 'base64'))[0]                     .hash()                     .toString('base64');                 console.log({ inMsgHash }); I went to testnet.tonviewer.com to search by hash and see that it is pending. However, after around 5 minutes, I reload the page and it shows 404 not found error.  What might be the cause of this?

Luke: https://testnet.tonviewer.com/transaction/149751124566363c66b6312ecddcf0dd2d4d9dc502f03177358ae92ca03e97a7

Paul2: Hi, Is it still available to call apis for wallet integration in react project? We are going to implement game item purchase by USDT(Ton) using TON Space wallet like in-app wallet. Not sure why api calls are getting blocked.

User<7477077163>: @tonconnect/ui-react (reply to 130286)

Khashayar: Then why on jetton.live you receive Jettons right after deployment?🤔 (reply to 130269)

Paul2: Thanks! (reply to 130287)

Khashayar: Hey sorry for taking your time but can you help me (reply to 130269)

Khashayar: I already deployed the minter

Khashayar: Now im trying to deploy jettonwallet

Khashayar: But it gets bounced back

Khashayar: Is there a problem with the code?

Khashayar: I tried all the ways i could think of  Just can’t find it

Dmitry | backend4you.ton: dont do that. jettons wallets deploys automatically just initiate the jetton transfer (reply to 130295)

Khashayar: Don’t i need this to mint the tokens? (reply to 130300)

Dmitry | backend4you.ton: yes. to mint tokens - send mint tx to jetton master (reply to 130301)

Khashayar: How can i mint from minter then Do i need to write a script?

Dmitry | backend4you.ton: master will create tokens and send them to you. during this, your "destination" jetton wallet will  magically be created

Khashayar: I get it But contract im using doesn’t have a Call function upon deploying to send the tokens to admin   Do i need another script to call minter  And minter will send the tokens to me? (reply to 130304)

Khashayar: Trying to learn jettons is really hard  ERC20 tokens has a lot of good sources to learn everything   Is there a good source that i can actually learn things needed?

Khashayar: YouTube videos are outdated and TON received updates since then

final: docs.ton.org and source code of existing contracts (reply to 130306)

Khashayar: Literally tried every single Contract on Github  I can deploy them But working with them is so confusing (reply to 130308)

Khashayar: Why TON doesn’t have a Write Contract like ERC20 tokens?

final: There is nothing to do with it, welcome to ton) (reply to 130309)

Dmitry | backend4you.ton: yes, you need a script to create a _message_ to minter, with special structure (mint opcode, amount, jetton receiver address etc), sign it and send. like initial deploy, but different body (reply to 130305)

Khashayar: Thank you i will try it (reply to 130312)

&rey: updates? on jettons? I doubt that (reply to 130307)

Chris: @pcrafter   hi &rey 2ne:v   Sorry to bother you again,I am currently using TonWeb to parse BOC. While I can successfully extract data from the root cell, the sub-cell data fails to parse correctly. I would like to confirm whether this is an issue with the BOC structure itself or if the parsing logic requires adjustments.  My quesitons  :   1.Why are sub-cells displayed as x{} or unsupported address type? Does this indicate that sub-cells contain no valid data, or is there a need for further optimization in parsing logic?  2.Are there recommended solutions for handling unsupported address type errors?  Here is the relevant code snippet, focusing on sub-cell parsing:  // Function to parse sub-cells const parseSubCell = (cell, depth = 1) => {     try {         const slice = cell.beginParse();         console.log(`${'  '.repeat(depth)}Sub Cell Raw Data:`, cell.print());          const opCode = slice.loadUint(32).toString(16);         console.log(`${'  '.repeat(depth)}Detected Sub Cell OpCode:`, opCode);          const tokenWallet = safeLoadAddress(slice, "token_wallet");         const minOut = slice.loadCoins().toString();         const toAddress = safeLoadAddress(slice, "to_address");         const referralAddress = safeLoadAddress(slice, "referral_address");          const nestedCells = [];         while (slice.refs > 0) {             const nestedCell = slice.loadRef();             nestedCells.push(parseSubCell(nestedCell, depth + 1));         }          return {             op_code: opCode,             token_wallet: tokenWallet,             min_out: minOut,             to_address: toAddress,             referral_address: referralAddress,             nested_cells: nestedCells,         };     } catch (error) {         console.error(`${'  '.repeat(depth)}Error parsing sub-cell: ${error.message}`);         return null;     } };  Here is the output during runtime: Recived BOC boc: 'te6cckEBBAEA4wAB5YgAZLuw0AFzAwXKZNAHX12U/Zani6…'  decode Cell: x{880064BBB0D001730305CA64D0075F5D94FD96A78BA34F75C73EDB8F3B6EC4E5BBC2039B4B3B73FFFFF88B3ADFD1700000001DA140B28D7358EC483DB3238ACC41E079D1062B1AB3789F34F39C7A8B0930A2873C8086DB35D5275880830DB84B727E26EF2F071F61EA2A6A674B87AB4FE8221D_}  x{0EC3C86D03}   x{}   x{42001D81A8D3943FA2C19AFA76DEE6C6F85EB83909C63009E6F15B058B6D7D6C94F820EE6B280000000000000000000000000000000000007B2254797065223A2270726F70222C224964223A313836373439373135383337333533353734347D}  decode response_destination error: unsupported address type decode data: {query_id: '9799943546446283123', amount: '0', destination: 'empty address', response_destination: 'unsupported_address', forward_ton_amount: '0', …}

Ehsan: Hello guys, is there any resource or code example for minting bulk sbt as cNFT?

&rey: Your chosen RPC provider wants you to send no more than 1 request per second. (reply to 130341)

Chaincode: When transferring TON jettons to a contract, is it possible to call the contract's functions?

Tom: Yes, forward payload (reply to 130371)

Chaincode: This is so hard to understand, is there any message builder reference?

Tom: Take your time, have a look at the flow chart of jetton transfer (reply to 130373)

Chaincode: Replace this with a function call cell?

Tom: Yes, use forwardPayload as your calldata (reply to 130375)

Chaincode: Thanks, It's ok now.  But is there a good way to send the amount to the contract func? (reply to 130398)

Imran: "I’m stuck on notifying a Jetton transfer with a comment. I used "String".asComment().asSlice() in forward_payload, but it’s not working. What mistake am I making?"

Imran: Anyone know?

Imran: ` fun mint(to: Address, amount: Int, response_destination: Address) {         require(self.totalSupply + amount <= self.max_supply, "The total supply will be overlapping.");         self.totalSupply = self.totalSupply + amount; // Update total supply          let winit: StateInit = self.getJettonWalletInit(to); // Create message         send(SendParameters{             to: contractAddress(winit),              value: 0,              bounce: false,             mode: SendRemainingValue,             body: TokenTransferInternal{                  queryId: 0,                 amount: amount,                 from: myAddress(),                 response_destination: response_destination,                 forward_ton_amount: 0,                 forward_payload: emptySlice()             }.toCell(),             code: winit.code,             data: winit.data         });     }`

Imran: How to mint jetton with comment?

&rey: beginCell().storeUint(0, 33).storeSlice("Comment".asSlice()).asSlice() (reply to 130507)

Imran: Yes (reply to 130524)

Imran: I used your shared code but I don't see any comment in transaction. What's the issue? (reply to 130526)

&rey: That's strange, it should have worked. Could you name a transaction hash, please? (reply to 130538)

&rey: Would you care to explain custom token "TON"? This chat doesn't intend to help someone to scam another. (reply to 130545)

Imran: I used forward_payload in mint function.

Imran: It's just a test token. I am learning the things. Nothing special. Just a random name. (reply to 130549)

Zaxs: Hi devs, I need help on my telegram mini app. I am facing a problem. I have implemented send transaction feature it is returning me boc responce not the txhash. how can i check if transaction is confirmed on blockchain through this boc? using react sdk

Zaxs: kindly help me if anyone have the solution. I want to recieve payments from the premium users and verify the transaction if it is completed (reply to 130557)

Wiz: Just launched complex tokenomics on test net. Would someone be open to testing the token and functionality?

— 2024-12-14 —

Anoxy (Wally.id) 😎 ❤️ 😎: does anyone know how to get the tx hash after sending a transaction with tonconnectui?

Anoxy (Wally.id) 😎 ❤️ 😎: this is not true for Bitcoin, and I think that goes for TON as well.  Correction: TON does not allow the prediction of the tx hash before sending a transaction (reply to 128072)

Zaxs: then how we will get the txhash? after sending trans we recieve boc. how we will verify the transaction if completed? (reply to 130607)

w: Why only a few  block broadcasts on overlay

Jen D: Hi all, my company (KIP Protocol) is looking to hire an experienced TON developer to make AI-driven Telegram apps incorporating TON payment and crowdfunding mechanisms. If you are interested please DM me examples of your previous work 🙏

Imran | Never DM First: Hi

Anoxy (Wally.id) 😎 ❤️ 😎: You can convert the boc to a msg hash and use toncenter api V3 and  use action method for querying the msg hash (reply to 130626)

Piri Piri: can someone give me an example of a contract that contains tables and operations on those tables? like add data, modify data etc

&rey: TVM has no concept of table, you'll have to build it first. (reply to 130645)

Piri Piri: I'd love some guidance for that. Is there any example i can look into?

&rey: I have no coins which I would advise anyone to use. If someone is writing you in private impersonating me, please report that. (reply to 130668)

Anoxy (Wally.id) 😎 ❤️ 😎: And more precisely it is here  https://testnet.toncenter.com/api/v3/index.html#/actions/api_v3_get_actions  Check for msg_hash field (reply to 130626)

&rey: Import it from @ton/ton! (reply to 130688)

&rey: ton and ton-core are long deprecated and moved. (reply to 130691)

Iřřøďẽr: Hi, what is it?

Iřřøďẽr: Unfortunately no, this problem is related to the ton core library (reply to 130699)

&rey: I don't know if a solution has been found, but it helped me to go through all ways to install Buffer polyfill (onto the build system of course). (reply to 130698)

Iřřøďẽr: As I understand it, Buffer is part of node.js, therefore, is not pulled up in the browser. Apparently I should move the code to the backend (reply to 130703)

&rey: Polyfills make it appear in browser as well. (reply to 130706)

&rey: Your build system is configured incorrectly as well, it seems. (reply to 130702)

Iřřøďẽr: It didn't work out ( (reply to 130708)

&rey: There were like six different ways to add them. (reply to 130710)

Iřřøďẽr: Well, I took the path of least resistance, thank you for your support (reply to 130711)

Tom: Buffer polyfills work fine in most case. You need to configure correctly depending on your bundler (vite, webpack, etc)

Zaxs: thanks i got this response. How I will check if it's confirmed not pending and why it is showing "success":false —  {   "actions": [     {       "trace_id": "Z0DTu8W4HED/ot/zfg2bSI7/12n4WSwOlBx1W6ehnrY=",       "action_id": "VlWvCOfAXGbFODjtttLdITS2m2MeLvPSEOgAoZcrNDQ=",       "start_lt": "29071985000001",       "end_lt": "29071985000001",       "start_utime": 1734179690,       "end_utime": 1734179690,       "transactions": [         "ZZFaCeT3wawXBitxsWmFT4VKLgCtZ3qFI3InkFKd0h8=",         "Z0DTu8W4HED/ot/zfg2bSI7/12n4WSwOlBx1W6ehnrY="       ],       "success": false,       "type": "ton_transfer",       "details": {         "source": "0:F4D1EA038D7056DFA52A4C66651F23861C1D324497C7073579774E21ECDC22DA",         "destination": "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F",         "value": "100000000",         "comment": null,         "encrypted": false       }     }   ],   "address_book": {     "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F": {       "user_friendly": "0QBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL6DP",       "domain": null     },     "0:F4D1EA038D7056DFA52A4C66651F23861C1D324497C7073579774E21ECDC22DA": {       "user_friendly": "0QD00eoDjXBW36UqTGZlHyOGHB0yRJfHBzV5d04h7Nwi2um2",       "domain": null     }   },   "metadata": {} } (reply to 130644)

Sam: Hey what's problem in the my code ? I want transfer 10 HMSTR !

Dmitry | backend4you.ton: Do you actually have hmstr? If you got some from HKombat - you need to claim them first. (reply to 130770)

Sam: I have HMSTR in the my wallet (reply to 130779)

&rey: responseAddress (second storeAddress in body) is wrong, but that's not the cause of error. (reply to 130770)

Sam: So how can i fix it the code (reply to 130782)

Sam: and why responseAddress (second storeAddress in body) is wrong (reply to 130782)

&rey: That parameter controls where excess TON not used in transfer go. They should never go to any of jetton contracts at risk of being uselessly locked there forever. (reply to 130784)

Sam: Please tell me all the problems of this code to work properly (reply to 130770)

Sam: const jettonMasterAddress = "EQBam5RuB3inYXsUlamTIEqu-tNy5NmX4FBLAcZe_360eWWE"; // Hamster Jetton Master Address

Nothing: how to call or send message in ts code (not from frontend)

&rey: You should obtain jetton wallet address correctly. Hint: EQAJ8... is jetton master, not a wallet.  It would be easier to answer your question if that was code, or if you had actually named the problem. It would be faster for you to search over chat history. (reply to 130783)

Nothing: i want to call this write function in code ``  receive(msg: Withdraw) {            } ```

Nothing: not on forntend

&rey: Example: https://github.com/ProgramCrafter/wallet-contract/blob/main/basic-interaction-wallet-inplug-v2.ts (substitute your wallet version, API provider, etc). (reply to 130788)

&rey: That's some different jetton master. (reply to 130787)

Sam: Mean also this is not correct ? (reply to 130794)

&rey: Well it stopped corresponding to jettons you have.  const jettonMasterAddress = "EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo"; is correct but not sufficient for the usecase. (reply to 130795)

Sam: My brother, I have been having this problem for almost a month😭 Can you fix this for me at a cost?  I just want to transfer 10 HMSTR (with comment)  And also with tonConnect (reply to 130794)

&rey: I can note that documentation docs.ton.org is available at zero charge 24/7, and I'm busy at certain times. (reply to 130797)

Nothing: iam using tact (reply to 130793)

&rey: You should combine that example with an auto-generated wrapper for message you want. (reply to 130802)

Sam: I am very very very weak in this area I have been trying to fix this for a month, but it still doesn't work (reply to 130801)

Nothing: if u dont mind send one more example i am not able to understand

Nothing: iam new

Anoxy (Wally.id) 😎 ❤️ 😎: Seems like it didn't go through ? (reply to 130761)

— 2024-12-15 —

Zaxs: when i check it on explorer it is confirmed transaction. how i will check it through apis (reply to 130846)

jude: Hello guys I'm new here 👋

jude: Is there like an equivalent of OpenZeppelin for TON blockchain??  Cos men that FunC Language is something else 😏

Sam: import { Address, beginCell, toNano } from "@ton/core";  const jettonWalletContractAddress = "EQBam5RuB3inYXsUlamTIEqu-tNy5NmX4FBLAcZe_360eWWE"; const recipientAddress = "UQD7vKW-IomWK_KGfUO-B7x5ZvYCUw0N5yxLv6pOI5TsVrqk"; const jettonAmount = "10" * 1e6;  async function sendHMSTR() {     const forwardPayload = beginCell()         .storeUint(0, 32)         .storeStringTail('Hello, HMSTR!')         .endCell();      const body = beginCell()         .storeUint(0xf8a7ea5, 32)         .storeUint(0, 64)         .storeCoins(jettonAmount)         .storeAddress(Address.parse(recipientAddress))         .storeAddress(Address.parse('0:dc4eaf0bf70fdf39af9062345f4774890c2c2880d2e37f436c9fa8e6614fbd04'))         .storeBit(0)         .storeCoins(1)         .storeBit(1)         .storeRef(forwardPayload)         .endCell();      const transaction = {         validUntil: Math.floor(Date.now() / 1000) + 360,         messages: [             {                 address: jettonWalletContractAddress.toString(),                 amount: toNano('0.02').toString(),                 payload: body.toBoc().toString("base64"),             },         ],     };      console.log(transaction) }  sendHMSTR();  What have problem in the this code ?

Sam: Why Failled?

Victor: Hi guys, do we have a tool to deserialize message payload values according to tl-b schema?

Mohammad: Hey guys, I have questions about it .ton dns nfts. 1. Can I link it to another smart contract on the network? If yes, why are explorers not detecting it? Should I transfer it to that contract address? 2. Is it possible to renew someone else's dns from my own wallet?

Ehsan: Hey  about the second question I think that only owner must send a tx to the DNS contract to renew. (reply to 130903)

Ehsan: and about first question, I think you can put any address to be resolved with your DNS. TON Site, smart contract address and etc.  Recently tonviewer applied a change in their website and sometimes it says not found. I don’t know why.

Iřřøďẽr: If in the TACT language I need to send tacs, but in the size maBalance - myBalance * 0.015. how do I go about it? You can't use floating point numbers in the tact, so I could divide by ~65, however how do I do it all correctly, since only integer division is available?

Anoxy (Wally.id) 😎 ❤️ 😎: Then I don't get why success is false in ur response (reply to 130883)

ed: too low of a fee (reply to 130899)

发财哥: How do I parse this body data? I cannot get the transaction token and amount information from transactions?

Mohammad: Thanks for the response. I saw Notcoin's jetton minter SC and I was wondering what happens if this .ton dns expires.   1. What happens to the NFT itself? 2. What happens to the stored record in it.  * The DNS owner is NOTcoin's minter smart contract. (reply to 130905)

Ehsan: nothing will happen (reply to 130931)

Mr Radikali: const JETTON_MINTER_CODE = Cell.fromBoc("b5ee9c72c1020d0100029c000000000d00120018002a006b007000bc0139018f02110218027b0114ff00f4a413f4bcf2c80b01020162050202037a600403001faf16f6a2687d007d206a6a183faa9040007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400202cc07060093b5f0508806e0a84026a8280790a009f404b19e2c039e2d99924591960225e801e80196019241f200e0e9919605940f97ff93a0ef003191960ab19e2ca009f4042796d625999992e3f60102f1d906380492f81f000e8698180b8d8492f81f07d207d2018fd0018b8eb90fd0018fd001801698fe99ff6a2687d007d206a6a18400aa9385d47199a9a9b1b289a6382f97024817d207d006a18106840306b90fd001812881a282178050a502819e428027d012c678b666664f6aa7041083deecbef29385d718140b0801a682102c76b9735270bae30235373723c0038e1a335035c705f2e04903fa403059c85004fa0258cf16ccccc9ed54e03502c0048e185124c705f2e049d4304300c85004fa0258cf16ccccc9ed54e05f05840ff2f00901fe365f03820898968015a015bcf2e04b02fa40d3003095c821cf16c9916de28210d1735400708018c8cb055005cf1624fa0214cb6a13cb1f14cb3f23fa443070ba8e33f828440370542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d0cf16966c227001cb01e2f4000a000ac98040fb0001c036373701fa00fa40f82854120670542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05006c705f2e04aa1034545c85004fa0258cf16ccccc9ed5401fa403020d70b01c300915be30d0c003e8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb002eedfd83")[0]; const JETTON_WALLET_CODE = Cell.fromBoc("b5ee9c72c1021101000323000000000d001200220027002c00700075007a00e8016801a801e2025e02af02b402bf0114ff00f4a413f4bcf2c80b010201620302001ba0f605da89a1f401f481f481a8610202cc0e0402012006050083d40106b90f6a2687d007d207d206a1802698fc1080bc6a28ca9105d41083deecbef09dd0958f97162e99f98fd001809d02811e428027d012c678b00e78b6664f6aa40201200c07020120090800d73b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b08160824c4b402805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b552002f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a019ad822860822625a028062849e5c412440e0dd7c138c34975c2c0600b0a007cc30023c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718010c8cb0524cf165006fa0215cb6a14ccc971fb001024102301f1503d33ffa00fa4021f001ed44d0fa00fa40fa40d4305136a1522ac705f2e2c128c2fff2e2c254344270542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c920f9007074c8cb02ca07cbffc9d004fa40f40431fa0020d749c200f2e2c4778018c8cb055008cf1670fa0217cb6b13cc80d009e8210178d4519c8cb1f19cb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08209c9c380a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed540201d4100f00113e910c1c2ebcb8536000c30831c02497c138007434c0c05c6c2544d7c0fc03383e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7e08403e29fa954882ea54c4d167c0278208405e3514654882ea58c511100fc02b80d60841657c1ef2ea4d67c02f817c12103fcbc200475cc36")[0]; const sha256 = (str) => {     const sha = new Sha256();     sha.update(str);     return Buffer.from(sha.digestSync());   }; const jettonOnChainMetadataSpec = {   name: "utf8",   description: "utf8",   image: "ascii",   decimals: "utf8",   symbol: "utf8",   image_data: undefined,   uri: "ascii", }; const params = {     onChainMetaDataL:{         name: "Major Tokenas",         symbol: "MAR",         description: "",         image: "",         decimals: "9"     },     offchainUri:undefined,     owner: addra,     amountToMint: new BN(10000) }   function buildJettonOffChainMetadata(metadata){     return beginCell()     .storeInt(0x01, 8)     .storeBuffer(Buffer.from(metadata, "ascii"))     .endCell(); }  function addressForContract(params){     return contractAddress({workchain:0,initialCode:params.code,initialData:params.data})  } (reply to 130934)

Mr Radikali:  function buildJettonOnchainMetadata(data){     const KEYLEN = 256;     const dict = beginDict(KEYLEN);        Object.entries(data).forEach(([k, v]) => {       if (v === undefined || v === "") return;          let bufferToStore = Buffer.from(v, jettonOnChainMetadataSpec[k]);          const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);          const rootCell = new Cell();       rootCell.bits.writeUint8(0x00);       let currentCell = rootCell;          while (bufferToStore.length > 0) {         currentCell.bits.writeBuffer(bufferToStore.slice(0, CELL_MAX_SIZE_BYTES));         bufferToStore = bufferToStore.slice(CELL_MAX_SIZE_BYTES);         if (bufferToStore.length > 0) {           let newCell = new Cell();           currentCell.refs.push(newCell);           currentCell = newCell;         }       }          dict.storeRef(sha256(k), rootCell);     });        return beginCell().storeInt(0x00, 8).storeDict(dict.endDict()).endCell();    }  function initDate(owner,data,offchainUri){     if (!data && !offchainUri) {         throw new Error("Must either specify onchain data or offchain uri");       }       return beginCell()         .storeCoins(0)         .storeAddress(owner)         .storeRef(           offchainUri ? buildJettonOffChainMetadata(offchainUri) : buildJettonOnchainMetadata(data),         )         .storeRef(JETTON_WALLET_CODE)         .endCell();      }  function mintBody(     owner,     jettonValue,     transferToJWallet,     queryId,   ){     return beginCell()     .storeUint(21, 32)     .storeUint(queryId, 64) // queryid     .storeAddress(owner)     .storeCoins(transferToJWallet)     .storeRef(       // internal transfer message       beginCell()         .storeUint(0x178d4519, 32)         .storeUint(0, 64)         .storeCoins(toNano("1000"))         .storeAddress(null)         .storeAddress(owner)         .storeCoins(toNano(0.004))         .storeBit(false) // forward_payload in this slice, not separate cell         .endCell(),     )     .endCell();   }     var fsl = {     code: JETTON_MINTER_CODE,     data: initDate(params.owner, params.onChainMetaDataL, ""),     deployer: params.owner,     value: JETTON_DEPLOY_GAS,     message: mintBody(params.owner, params.amountToMint, toNano(0.5), 0),   };    var contractAddr = addressForContract(fsl)      let cell = new Cell();   new StateInit({ data: fsl.data, code: fsl.code }).writeTo(cell);    console.log({     address:contractAddr.toString(),     value:fsl.value.toString(),     stateInit:cell.toBoc().toString("base64"),     payload:fsl.message.toBoc().toString("base64")   }) (reply to 130938)

Mr Radikali: This is my code that I shared whats my code problem ? (reply to 130934)

Mr Radikali: Admin ? (reply to 130940)

دی دی پرایم: Does anyone know when BTC bridge (tgBTC I think) will be available?

Mr Radikali: But when I use ton Minter site its all ok I want to mint like this How can do that ? (reply to 130941)

Mr Radikali: please answer it (reply to 130940)

Musharraf: Can you provide any documentation or examples of decentralized exchange (DEX) integration with TON?

Tom: Try submit in testnet and debug (reply to 130934)

Mr Radikali: How can I submit with testnet ? (reply to 130949)

Tom: Can you confirm anw? (reply to 130934)

Mr Radikali: Nope I think error from Metadata I dont know (reply to 130952)

Mr Radikali: But Ton minter site is OK (reply to 130944)

Mr Radikali: I want to create code like this (reply to 130944)

Mr Radikali: but generated transaction Like this (reply to 130934)

Tom: Basically, you send the mint transaction with init state. So it can be both deployed and executed (reply to 130955)

Iřřøďẽr: I have 2 questions.   Context:   Tact_code import { beginCell, Cell, contractAddress, StateInit, storeStateInit } from '@ton/core';  const [tonConnectUI] = useTonConnectUI();  const init = {     code: Cell.fromBase64('<CONTRACT_CODE>'),     data: Cell.fromBase64('<CONTRACT_INIT_DATA>') } satisfies StateInit;  const stateInit = beginCell()     .store(storeStateInit(init))     .endCell();  const address = contractAddress(0, init);  await tonConnectUI.sendTransaction({     validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes     messages: [         {             address: address.toRawString(),             amount: '5000000',             stateInit: stateInit.toBoc().toString('base64')         }     ] });  This code is the standard for the deployment of a contract via a tonconnect.   1 question - what should I put in contract_code? I have an import of @stdlib/deploy in my code. Is it easy to insert it along with the rest of the code on the clock in this place?   2 question - what exactly and how to insert into contract_init_data? What is in the code under the word init? Or without that word? Can you show me an example, please?  As I understand it, the clock does not document how exactly the contract input data should be formed, so you need to look at the auto-gen wrappers. But that's the problem. I need to deploy the contract at the time of sending the transaction

Mohammad: In general What happens if we do not renew our .ton NFT? (reply to 130932)

Mr Radikali: Send transaction without init state? (reply to 130960)

&rey: 0.05, rather. (reply to 130898)

&rey: 1. You can. The domain linked and owned to same wallet is shown. 2. No. (reply to 130903)

&rey: Aren't you trying to forward 0.5 TON to jetton wallet out of a lower amount JETTON_DEPLOY_GAS? (reply to 130940)

&rey: Tact doesn't document how you must form initial contract data so you MUST look into auto-generated wrappers. (reply to 130962)

Mr Radikali: Whats minimum Fee gas ? (reply to 130970)

Iřřøďẽr: How do I do this? (reply to 130971)

&rey: You mean, how to open a file in your operating system? (reply to 130973)

Iřřøďẽr: No. I wrote the code on the tact and compiled it through blueprint. However, I did this for a test. My main task is to deploy the contract at the moment by sending a transaction using tonconnect funds. I filled in the code field. Now I need to fill in this init, but I don't understand what to insert there. Where can I get this information? (reply to 130974)

&rey: > Where can I get this information? In directory wrappers/, as it happens. (reply to 130975)

Iřřøďẽr: Yes, and if it were, I wouldn't ask, but that directory refers to build, which contains information that I don't understand (reply to 130977)

Iřřøďẽr: There's technical information and an insanely huge file (reply to 130978)

Mohammad: Thank you. I wanted to know what happens if my NFT owner is a smart contract that can't transfer the ownership or even renew it. What happens to the NFT?  This situation: https://t.me/tondev_eng/130931 (reply to 130969)

&rey: When it expires, nothing happens on its own but anyone can release the domain for auction. I'm not sure how DNS is handled then. (reply to 130985)

Ehsan: It will be re-auctioned. (reply to 130963)

Abhimanyu: Any solutions for this ?

Yarr.myn: Hi, Any one know an Online compiler for TON smart contracts? an IDE or anything that i can use to compile smart contracts on ton.

Yarr.myn: or should i just set up it locally.   im just looking for a simple online solution

&rey: Nujan IDE. (reply to 131000)

Yarr.myn: Thanks mate, will check it out (reply to 131002)

Musharraf: Can you provide any documentation or examples of decentralized exchange (DEX) integration with TON? (reply to 131002)

Ƥυrу: can somebody help me with getting all swap transactions of a specific jetton ?

— 2024-12-16 —

Kyle: Hi guys! Why txhash get from boc not found on testnet but it works on mainnet? Please help me.

Cai: Hey guys, I've just started developing with TON and could use some help, even if just to link me up where I can read about this.  I'm trying to make my contract secure against replay attacks. I've been instructed to use a seqno approach in my nonce/signature for that matter. What I'm a bit confused about is, this seqno would be stored in the contract, correct? Then I'd need to make a get request from my signer to know what is the current seqno is to sign with it. I would then send the message and in the contract I'd check if the seqno received matches the current seqno, if the same allow transaction, otherwise fail transaction.  Now this seems like it would work great it I had a single user trying to make a transaction, but if I have millions, clearly this would generate many collisions, if I had many users call the signer at the same time then only the first transaction would be processed and the rest would fail because of invalid signature/nonce.  Am I missing something here? Is there another way to go about this?

Dmitry | backend4you.ton: You are correct. Seqno will not work for multi-user contracts. Wallets use it, because typical wallet is owned only by one user. (reply to 131093)

Cai: How would I go about making a transaction not replayable in this case? (reply to 131094)

𝖘𝖔𝖜𝖑𝖈: Please tell me where to get a comment from the transaction when transferring JETTON in the Ton Center API

Dmitry | backend4you.ton: What transaction? Can you give more details. Usually, users are allowed to purchase something more than one, they just need to pay several times too. (reply to 131097)

Cai: So the issue I'm trying to solve is that I have a secure message in my admin contract which orchestrate the creation and calling messages in the parent contracts, let's say to claim a reward for the sake of the example. When the message is called I grant some TON to the sender of the message. This message currently is not safe against replay attack, which means, if the user resends the same message it gets rewarded a second time.  I've been told that a good way to prevent this from happening would be to have seqno in my admin contract and then send the current seqno in the nonce of the message, and then check if those are the same, and if true, then move up the seqno and perform the message.  This works as expected. But I'd expect it only works for a single message in flight, if like 10 people send the message at the same time, they would have the same seqno and only the first message would be processed. Right?  So I was wondering if there would be a state of the art way of handling this in a way that avoid as many collisions as possible. (reply to 131104)

Dmitry | backend4you.ton: how admin contract decides, which user (his claim message) is valid (must be rewarded) and which is a fake?  (I mean 'initial' message, not replay) (reply to 131105)

Cai: Only the jetton owner can claim (reply to 131106)

Dmitry | backend4you.ton: jetton owner can claim without limits? so, * user sends 'claim' to admin * admin checks that user is actually an owner, then sends 'claim-proceeed' to parent contract * parent checks that message is from admin, and sends coins to user  check 'sender' address on 2 and 3, so replay will not be possible. (reply to 131107)

Cai: I was going off some suggestion from auditors, but I realise now this function is supposed to be called just once. Therefore I can simply set a bool in the contract and fail if the message is ever called again (reply to 131108)

Tom: If you are trying to have a replay guard with multiple callers, you could use external middleware contracts.

Cai: Could you point me out where I can read more about this? (reply to 131111)

Cai: I'm REALLY new to all of this

Tom: This might help.  https://github.com/Gusarich/airdrop (reply to 131113)

Mr Radikali: Did you fined solution ? (reply to 130962)

Iřřøďẽr: No (reply to 131124)

Iřřøďẽr: Repeat

Iřřøďẽr: I have 2 questions.   Context:   Tact_code import { beginCell, Cell, contractAddress, StateInit, storeStateInit } from '@ton/core';  const [tonConnectUI] = useTonConnectUI();  const init = {     code: Cell.fromBase64('<CONTRACT_CODE>'),     data: Cell.fromBase64('<CONTRACT_INIT_DATA>') } satisfies StateInit;  const stateInit = beginCell()     .store(storeStateInit(init))     .endCell();  const address = contractAddress(0, init);  await tonConnectUI.sendTransaction({     validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes     messages: [         {             address: address.toRawString(),             amount: '5000000',             stateInit: stateInit.toBoc().toString('base64')         }     ] });  This code is the standard for the deployment of a contract via a tonconnect.   1 question - what should I put in contract_code? I have an import of @stdlib/deploy in my code. Is it easy to insert it along with the rest of the code on the clock in this place?   2 question - what exactly and how to insert into contract_init_data? What is in the code under the word init? Or without that word? Can you show me an example, please?  As I understand it, the tact does not document how exactly the contract input data should be formed, so you need to look at the auto-gen wrappers. But that's the problem. I need to deploy the contract at the time of sending the transaction

Mr Radikali: do you know how to do that ? with JS Code ? (reply to 131127)

Iřřøďẽr: Yeah (reply to 131129)

Iřřøďẽr: This is the deployment of contracts through the tonconnect. I'm looking for answers that haven't been given to me yet.

Mr Radikali: I want to deployment of contract using tonconnect   minter site is work but my code it doesnt work (reply to 131131)

Tea the Bottle: hello, I want do something like your contract, may I read your contract referral ? (reply to 131129)

Henry: How to find the token balance of a wallet (not TON balance)?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 56 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 22  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Kyle: Is there any updates on testnet guys? I generate hash from boc on testnet but it can not be found on explorer or api. But on mainnet it works fine. Please help me

&rey: Well hash of TC2 BOC is not, and was never, a transaction hash. (reply to 131139)

&rey: Please try loading transaction by that external message hash a bit later; it may still not be included in blockchain if you request too soon.

{ дүние } ақырет: Hello, everyone👋  Guys, can you answer on question "Can smart contract in blockchain write the data to ton storage without any backend"?  I am building the "QUIZ Smart Contract" and I need to write the scores of the wallets to TON Storage.

&rey: It can't. TON Storage is fundamentally based on trust, and only uses blockchain to prove data is stored incentivize providers to not discard data.  Also, TON Storage doesn't interact with data changes well. (reply to 131156)

Enoch StrongNationDev 🔵: Hello guys👋 Good day everyone, please I need an assistance I am a developer I want to add a function that triggers toncoin transaction in my telegram mini app but it's showing "Bad Request" when user try to send toncoin, that's the transaction isn't going successful  I need help from the team please.  I am looking forward to get a response from anyone as soon as possible. Thank you

Manuel: Hi guys I need a developer for my project please  Someone that can create tokens and NFTs on Ton and can create telegram mini apps

Elvis: Hi good afternoon.  I'm new here. I just started learning how to create a smart contract on TON blockchain.  Can someone recommend a video or documentation for me?  How can I use this command: npm create ton@latest to create and deploy a jetton to TON testnet and Mainnet.  Please if there is a video tutorial on this. Kindly send. I'll appreciate 🙏

Cai: https://www.youtube.com/@AlefmanVladimirEN-xb4pq (reply to 131177)

Elvis: How to fix this ??:  const curState = await provider.api().getContractState(minterContract.address); const curState = await provider.api().getContractState(minterContract.address); const contractState = await api.getContractState(minterAddress); const curState = await provider.api().getContractState(address);  Property 'getContractState' does not exist on type 'TonClient4 | TonClient'.   Property 'getContractState' does not exist on type 'TonClient4'.ts(2339)

发财哥: how to decode the data in the body?

Dmitry | backend4you.ton: You need to know the structure. Every type of transaction have own body structure. Its called TL-B, so you must know TL-B for every type of transaction you want to decode (reply to 131188)

Waco: Hi everyone!  I’m having trouble working with the TIP-3 Token Wallet contract on TON. When trying to decode messages using the ABI from Broxus GitHub TIP3, I get the error:  "Message can't be decoded: The message body does not match the specified ABI"  What I’ve tried:  Used the ABI from the repository and documentation — the error persists. Tried compiling the contract manually via npm, but ran into build issues.  Questions: How can I get the correct ABI for this contract? Any tips to resolve this decoding issue?  Thanks for any help!

&rey: This is not the right chain. The Open Network has no "The message body does not match the specified ABI" errors. (reply to 131197)

&rey: I'd expect that you're working with Everscale.

Mr Radikali: Hey there i want to deploy mint with tonweb or python based Script not web template !  How can set transfer stateInit and payload in transfer ?

&rey: Please check pytoniq's send_transfer arguments. (reply to 131232)

Mr Radikali: There is no method send_transfer in pytoniq (reply to 131235)

&rey: Ok. There is await wallet_contract.transfer(destination=..., amount=..., body=..., state_init=...). (reply to 131236)

Mr Radikali: Is this ok for deploy contract ?  I want to deploy contract without web template I generated payload and stateInit to add transaction for mint (reply to 131237)

— 2024-12-17 —

Kyle: Hi guys! Is there any way to get trace id from boc?

P: How can we fix this bug?  "Static function "log2" does not exist"  code: let logval: Int = log2(amount / 1000000000);

AmirhN: heya! how do i get wallet address from state init (base64 encoded string)?

AmirhN: i get this error stateInit and address do not match each other from tonProof, and i need to debug it, so i think if i find out what address is my stateInit returning would help

TON Bounty Bridge: ​Integrated Development Environment for Telegram Mini Apps: TMA Studio  🏷 Developer Tool  Created by erfanmola

Nhat Nguyen: How to generate payload mint NFT Collection :<

Henry: How to parse this kind of cell using tonweb library?

Mahdi: hello I use tonutils python library to submit transactions, since yesterday when i submitted transactions tx hash is different to network tx hash why does this happen?  my code a mistake or the network has issues?

Alma G: Hey, is it possible to add vibration to TMA game?

Ehsan: Hey, Yes (reply to 131288)

Ash: Hey are there any tact developers?

Ehsan: Check haptic feedback: https://core.telegram.org/bots/webapps#hapticfeedback (reply to 131288)

WhyesCode: You can hire me (reply to 131167)

Alma G: Thanks! (reply to 131293)

Brian ☀️: Hi everyone !  I'm making sendTransfer from serverside and follow this doc :  https://docs.ton.org/v3/guidelines/dapps/cookbook  I createWalletV4, getBalance, seqo,.. but When I check contract state, it's uninitialized  So when I make sendTransfer it always return error 500

Brian ☀️: Create Wallet base on mnemonic and address

Brian ☀️: Code do transfer ton

WhyesCode: Is your mnemonic for tonkeeper giving the same address? (reply to 131298)

TKAINU: You can try replacing contractv4 with contractv3r2 (reply to 131299)

Brian ☀️: yes I sure it same, double check in wallet (reply to 131300)

WhyesCode: Try this first first... It should work (reply to 131301)

WhyesCode: If it didn't, you can hire me. I will check the code and fix it for you.

Brian ☀️: Yes thanks, I changed to V3 and it's work. @@

WhyesCode: Great 👍 (reply to 131305)

Victor: hi guys, do we have a limit for Map? I've heard about different numbers - 10k elements, 30k elements, I've wrote a test and it successfully completed even 41k set elements from 0 to 40999, so do we have a limit of elements for maps?

&rey: Have you tried to store such map in contract in blockchain? (reply to 131332)

Victor: no, blueprint/sandbox only (reply to 131333)

&rey: Also you might've been misled by cell deduplication effect, which won't allow to store that many distinct values. (reply to 131332)

Victor: I set 41k map values of Structures with different values and int257 keys (reply to 131335)

Victor: omg, I didn't use toHaveTransaction to check a status of transaction, will re-check (reply to 131335)

&rey: How did it turn out? (reply to 131338)

Victor: I've updated test and re-ran this, I think it'll take several hours again (reply to 131344)

Dmitry | backend4you.ton: Also, take a note on gas usage for some lookup get-method and tx to make some map update. (reply to 131349)

Suraj: Hi @admins  I deployed a jetton contract_using toncli, but unable to verify the sources on verify ton.   Can you please tell me which files I need to upload on the website exactly, I tried to upload these files from ton/jetton_minter/func but the hash does not match.  what am I missing here.

&rey: Please check out version of your FunC compiler and set the same in UI. (reply to 131385)

Suraj: it's 0.4.5 and used the same on ui, still same, I deployed two jetton, one my mistake on the same system and same direcory, and none of them are matching with the source (reply to 131388)

Umaid: Hi How can I activate my TON wallet. I just created my new wallet on the TON keeper then I sent 0.1 TON to my newly wallet to activate  but it is still inactive. Should I have to send a TON from the new wallet to any other wallet then it will activate or should I send more TON for Active?

&rey: From. (From the new wallet to itself is also fine.) (reply to 131399)

&rey: Please note that many interactions with TON do not require a deployed wallet, in fact.

eXirad @GATTOMONAM: Hello there 👋🏾☺️ I think i somehow broke  the ton coin  blockchain   By accident  I bought an nft  from a collection  ( nft costs 0.3ton )  But this specific nft is asking me 1 toncoin for gas fee while the other nfts from the same collection  cost  0.0088 ton  to transfer (reply to 131388)

eXirad @GATTOMONAM: This is the nft that is having the gas fee problem  I noticed 2 strange things about this nft (reply to 131405)

eXirad @GATTOMONAM: First  The balance of this nft is 1.046 toncoin instead of 0.046  like the other ones (reply to 131406)

eXirad @GATTOMONAM: And secondly i somehow failed to receive this nft after i received it ??? 😅 (reply to 131407)

&rey: I'd suppose it is scam. Check collection address against one you trust. (reply to 131409)

eXirad @GATTOMONAM: Well i checked everything and everything is official about this nft  same as other ones (reply to 131411)

Stanislav: Hi! Please help, how to fill response_adress?

&rey: Your opcode does not match TEP-74 transfer order. (reply to 131418)

Stanislav: It's ok in my program, it's 0xaf750d34 converted to decinal (reply to 131423)

&rey: But transfer opcode is 0x0f8a7ea5. Unless you are doing something other, but I think message must be serialized in a different way then. (reply to 131424)

Stanislav: It's tonfun jetton opcode (reply to 131425)

SS: Hello guys,Any TON dev have time to consult us for a few minutes?

&rey: Please go ahead (if your question is technical). (reply to 131432)

User<7057220524>: Which errors will be occured when we only use Ton APIs and database to implement token staking functionality?

Namon: Anything It is best to make a jetton that will be issued in exchange for staked tokens and increase the value of this jetton in tokens over time (reply to 131441)

— 2024-12-18 —

Harry: Can anyone help me with this ?

AmirhN: hey! as far as i know you can't set custom gas on TON blockchain, is that correct? If yes, how do people build sandwich attack bots? From what i've seen, looks like they bundle the buy and sell in same TX tho, and probably it increases the gas, is that the reason? (reply to 131434)

Namon: same shard for sender contract and receiver contract (reply to 131486)

AmirhN: I'm mostly curious about how they front-run and buy before the actual buyer (reply to 131487)

Namon: there is sender 1, sender 2 and receiver sender 1 and receiver are in different shards, and sender 2 and receiver are in the same sender 1 sends his message and sender 2 immediately follows sender 1's message can wait for the block to close before moving to another shard and the receiver processes it sender 2's message can immediately reach the receiver and be processed the rest of the chain is the same for them, therefore, if sender 2 is in the shard with the receiver, his message can be processed before sender 1's if he is in a different shard from the receiver  something like this (reply to 131488)

AmirhN: oh, makes sense. thanks! (reply to 131490)

Gold: great

Gold: the best (reply to 131490)

Kyle: Hi guys! How to estimate transaction fee on frontend. I see there is a way to estimate fee but it requires private key, which it's not suitable for me. Please help me.

John: Hi everyone, new here,  I would like to fetch onchain transaction data from a transaction hash?

&: Use tonapi service

WhyesCode: What? (reply to 131479)

final: how i can find out which jetton was sent in jetton notify message?

User<7057220524>: I've sent reply via DM. (reply to 131533)

Trevor K: Hey guys, is TON Storage still in active development? Is there a place were TON Storage providers/developers talk specifically? Trying to get more information on running nodes and expectations

User<7057220524>: Yes, of course.  TON storage is actively developed as a decentralized file-sharing and data storage solution within the ecosystem. It enables users to exchange files securely and ensures data availability through financial incentives via smart contracts. (reply to 131536)

Trevor K: Is there any active explores that give insight to total network capacity, total data stored, ect? Im sitting on 8PB of storage I can make available and trying to gauge expectations here (reply to 131537)

Umaid: Is there any other way? (reply to 131400)

User<7057220524>: I know that, at the moment, no explorer for you. it's decentralized, so it'll be not easy to make into centrally.  pls check them like TON Stat, Tonscan. (reply to 131538)

Victor: 30218 (reply to 131344)

Dmitry | backend4you.ton: from sender address. either store "known" senders (and their masters), or call get_wallet_data (TEP-74) on sender to know owner and jetton-master and re-check by calling get_wallet_address on master and compare result (reply to 131533)

final: how i can call those methods from smart contract? afaik onchain get methods are not possible

Dmitry | backend4you.ton: yes, from SC you can't, only from webapp. for SC, the only way is to store "correct" senders in SC data (reply to 131543)

G: Is any TON developer (who works on the core code of TON) here and can help me setup a local ton network for debugging purposes?

&rey: It's hard to find them I think. Anyways, MyLocalTon worked in my experience. (reply to 131551)

&rey: And if you want to simply debug contracts, then @ton/sandbox is even better.

Dastan | Frontend: has anyone implemented sending jetton on react/vue/etc?

G: Does it actually run the validator code? In MyLocalTon? Can it simulate 2 validators? (reply to 131553)

&rey: It does, and you can see one in task manager. I don't remember how to launch 2 validators there (or how to connect an external one) but that should be doable. (reply to 131557)

Navneet: Hey fellow developer GM GM  I am a full stack developer experience in web2 platforms , and i want to switch to web3 . so anyone suggest me where to start and how can I be a web3 developer

G: Thanks (reply to 131558)

Dastan | Frontend: import { useQuery } from '@tanstack/vue-query' import { beginCell, Address, TonClient } from '@ton/ton' import { getQueryParams } from './helpers' import { computed, unref } from 'vue'  const TON_JSON_RPC = 'https://toncenter.com/api/v2/jsonRPC'  const client = new TonClient({ endpoint: TON_JSON_RPC })  export const jettonQueryKeys = createQueryKeys('jetton', {   getJettonMasterAddress: (args: {     userAddress: string     jettonMasterAddress: string   }) => [args], })  export const useGetJettonMasterAddress = (   userAddress: string,   jettonMasterAddress: string ) => {   const query = useQuery({     ...jettonQueryKeys.getJettonMasterAddress({ userAddress, jettonMasterAddress }),     queryFn: async ({ queryKey }) => {       const { userAddress, jettonMasterAddress } = getQueryParams(queryKey)        const userAddressCell = beginCell()         .storeAddress(Address.parse(userAddress))         .endCell()        return client.runMethod(Address.parse(jettonMasterAddress), 'get_wallet_address', [         { type: 'slice', cell: userAddressCell },       ])     },   })    return {     ...query,     jettonMaster: computed(() => {       return unref(query.data)?.stack.readAddress()     }),   } }        ‘…’,   ‘…’ )  const recipientAddress = Address.parse(‘…’) const forwardPayload = beginCell()   .storeUint(0, 32) // 0 opcode means we have a comment   .storeStringTail('Hello, TON!')   .endCell()  const messageBody = computed(() =>   beginCell()     .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer     .storeUint(0, 64) // query id     .storeCoins(toNano(100)) // jetton amount, amount * 10^9     .storeAddress(recipientAddress)     .storeAddress(recipientAddress)) // response destination     .storeBit(0) // no custom payload     .storeCoins(0) // forward amount - if >0, will send notification message     .storeBit(0) // we store forwardPayload as a reference     // .storeRef(forwardPayload)     .endCell() )  const paymentRequest: Ref<SendTransactionRequest | null> = computed(() => {   const normalizedAddress = Address.normalize(unref(jettonMaster) ?? '')   if (!normalizedAddress) {     return null   }   return {     messages: [       {         address: Address.normalize(unref(jettonMaster) ?? ''),         amount: '0',         payload: unref(messageBody).toBoc().toString('base64'),       },     ],     validUntil: Math.floor(Date.now() / 1000) + 360, // Expiration time in seconds since epoch   } })  async function sendTransaction() {   tonConnectUI     .sendTransaction(paymentRequest.value)     .then((transactionResult) => {        console.log('Transaction successful:', transactionResult)     })     .catch((error) => {       console.log(error)     }) } (reply to 131556)

Elvis: Hi Please someone should help me 🙏🏾. How do I use On-chain metadata instead of External metadata.  The code below uses External metadata. How do I modify it to use On-chain metadata ??  // On-chain metadata (type: 0), External metadata (type: 1)     const content = jettonContentToCell({ type: 1, uri: contentUrl });

Tom: You could try TEP64. Basically it’s a cell with dictionary. (reply to 131588)

Huy: Hello everyone, i have once issue. The app I link to the wallet, then from the app send the transaction to another wallet. At this time, the wallet has a notice that it needs to confirm the transaction, but when I go to the wallet, I don't see a popup to click confirm. Please help me!!! thanks

DMDE: hello guys, there is a services/sites to lock my own tokens in TON chain for specific time?

Umaid: I'm facing this issue while transferring TON (reply to 131617)

Pibu: hey folks! what happens when I send to to an account that is in nonexist state? I always thought that it will get initialised, but I get bounces with cskip_no_state reason... this transfer is done via a contract, should I include some flags to init an account?

&rey: You should include StateInit, indeed. (If you don't have receiver's data, including public key if that's a wallet, you can't initialize their contract.) (reply to 131621)

Oyekanmi: Did anyone know how I can trade ton tesnet on ton wallet

Suraj: how can I retrieve the wallet seed phrase for wallet deployed using toncli?

Suraj: Can you please support!   I built another jetton using toncli - jetton_minter and deployed to testnet, and uploaded the source files to verifier from jetton_minter/func/***.func files but the hash is still not matching. (reply to 131388)

NICK: New scam - scammers sending requests that they want to buy your telegram username. Link comes from scammer bot account immitating fragment bot. Be aware don't click any links

NICK: Report to admin because scammer will delete messages quickly

— 2024-12-19 —

Jacob: Q1: what's the relation between lt and created lt?    I have convert  17.12.2024, 12:20:03 to timestamp , it is 1734438003, but is not 29170423000002  Q2:  for all the actions of one contact, how to get the min lt and max lt?   when we get transactions of on contract , how to  build parameters such as opts.lt and  opts.to_lt?  getTransactions(address: Address, opts: {         limit: number;         lt?: string;         hash?: string;         to_lt?: string;         inclusive?: boolean;         archival?: boolean;     })  Created at: 17.12.2024, 12:20:03 Created lt: 29170423000002

Khashayar: Since a wallet has two addresses—a bounce address and a regular address—which one should I save in the contract as admin wallet? Or does it not matter, as both will work?

Suraj: Your own wallet address (reply to 131724)

&rey: Both will, since onchain there is no difference. (reply to 131724)

&rey: 1. lt increases, that's all. It has no relation with utime. 2. Transaction's lt ..= created_lt fir the last outgoing message in list. (reply to 131721)

Freddy | metafields.xyz: need testnet funds 0QAn70DlO3aJrJdBDO8K_Z5IE9BytI2xreEDQjiZLKaIRo6v

Freddy | metafields.xyz: any faucet ? new to TON

Suraj: testgiver_ton_bot (reply to 131736)

Freddy | metafields.xyz: thank you ser (reply to 131738)

XY: How can I verify a transaction? How decode and get hash from BOC? with:  {   boc: "te6cckEBAwEA4QAC44gBZUPZ6qi8Dtmm1cot1P175lXUARlUVwlfMM19lkERK1oCUB3RqDxAFnPpeo191X/jiimn9Bwnq3zwcU/MMjHRNN5sC5tyymBV3SJ1rjyyscAjrDDFAIV/iE+WBySEPP9wCU1NGLsfcvVgAAACSAAYHAECAGhCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWoAmJaAAAAAAAAAAAAAAAAAAAAGZCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWnMS0AAAAAAAAAAAAAAAAAAADkk4U" }

&rey: The thing you receive from TON Connect 2 is not a transaction guarantee actually, as it doesn't wait for transaction appearing; consequently, you can't get hash from it. (reply to 131747)

DashShift: Hi, I'm new to TON and trying to deploy a contract on the testnet. I used Blueprint, and everything seems to run fine, but I’m not receiving a wallet popup to confirm the deployment. Here's the console output I get:  npx blueprint run   Using file: deployNftMarketplaceContract   ? Which network do you want to use? testnet   ? Which wallet are you using? TON Connect compatible mobile wallet (example: Tonkeeper)   Connected to wallet at address: EQDu3FzpueZbO8bSH5U2MgEuMjP-tAEaKdvvyClmgzkH4iHB   Sending transaction. Approve in your wallet...[TON_CONNECT_SDK] Send http-bridge request: {     method: 'sendTransaction',     params: [       '{"messages":[{"address":"EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5","amount":"50000000","payload":"te6cckEBAQEAAgAAAEysuc0="}],"valid_until":1734590598178,"from":"0:eedc5ce9b9e65b3bc6d21f953632012e3233feb4011a29dbefc82966833907e2","network":"-3"}'     ],     id: '7'   }    Does anyone have suggestions or know how to resolve this? Thanks in advance!

Cynthia: How to find an account which is frozen by Tether?

WhyesCode: Hey! Double-check your wallet connection and network settings. Make sure everything is updated and look for any console errors. That usually does the trick! (reply to 131753)

DashShift: Hey, thanks. I connected to mobile app instead of web and redid the wallet connection and it worked. (reply to 131760)

WhyesCode: Great 👍 (reply to 131761)

Justin: Hi everyone, can anyone help me solve this problem? I sent an external message with 1 ton to a contract, and the contract wants to keep 0.4 ton. I want the remaining 0.6 ton to be returned to the sender after deducting gas fees. Is this possible? I tried to use nativeReserve to keep part of the amount, but it doesn't seem to work with SendRemainingValue.

FreeSpirit: I need to send a message to my deployed contract on the mainnet. I sent the message in this format, but I received error 130. Could you please assist me with this issue?

https:// 🏁: Then, is there any way to check if transaction is successful? (reply to 131751)

&rey: First, something needs to wait until tx (more precisely, external message, BOC of which is returned) is included, and that something is not the wallet app. (reply to 131789)

&rey: I'm not sure if backend should handle all of transfers sent to it, or if each frontend instance should listen separately.

Elvis: I Don't understand 😕.  Send code ser... Please 🥺 (reply to 131590)

&rey: And, what makes you use the word "successful" on transactions as though they might instead do something which was not intended? (reply to 131789)

XY: But I understood something else from your document. !?  So how should I verify the transaction with the api? Is using toncenter api a useful method? (reply to 131751)

Cai: To verify if the transaction was successful onchain you can extract the hash from the BOC response by doing function extractTxHash(transactionResponse: SendTransactionResponse) {   const cell = Cell.fromBase64(transactionResponse.boc);   const buffer = cell.hash();   const txHash = buffer.toString('hex');    return txHash; } then you can poll from the API via txHash like  getTxWithHash = async (hash: string) => {     const url = `https://preview.toncenter.com/api/v3/events?msg_hash=${hash}`;     const response = await fetch(url);     interface Response {       events: [{ actions: [{ success: boolean }] }];     }     const data: Response = await response.json();     const actions = data?.events?.[0]?.actions ?? [];      console.error('getTxWithHash=', data);     return {       raw: data,       actions: actions.length,       success: actions.every((a) => a.success),     };   }; and then you need to apply the logic you need using the number of actions and the success. Basically when I do a purchase in my app it executes 4 actions (passing data from contracts via msg) So in my polling I do something like this  private confirmBuyToken = (txHash: string) => {     return () =>       getTxWithHash(txHash).then((res) => {         if (!res.success) {           throw new Error(`Tx failed`);         }         // Observed the buy action has 6 transactions but in theory after the first 3 we can consider it success         if (res.actions < 3) {           return undefined; // retry         }         return 'success';       });   }; (reply to 131797)

Cai: Here is a simple wrapper over the send transaction to send the transaction and return the hash private sendTransaction = async (     txRequest: SendTransactionRequest,   ) => {     try {       const transactionResponse = await this.tonConnectUI.sendTransaction(         txRequest,       );       const txHash = extractTxHash(transactionResponse);       console.log('Transaction Hash:', txHash);       return txHash;     } catch (e) {       throw e;     }   };

XY: Thank you for your good answer.   Should I send the resulting hash to the backend and have it verify the transaction with the hash? Because as we know, a transaction is not considered completed once it is done, right? (reply to 131798)

Cai: You can do it either in the FE or the BE, ofc it's safer if it's done in the BE (reply to 131801)

XY: Very good. So what are the other methods used for? I read an article about using ton-lite-client for verification, can you give a brief explanation about it? (reply to 131802)

Cai: I'm not, by any means, a specialist, so I have no idea what that is 😜 (reply to 131803)

XY: And why did this brother of ours say that? @cainaleao (reply to 131794)

XY: No problem, and by giving me a method, you saved me from a lot of searching. (reply to 131804)

Cai: Well, that he would have to answer. But I believe it's just miscommunication. I think the word "successful" is misleading, because once the operation has gone through the wallet one could say it was a success operation (did not throw an error) but the onchain async operation is still in flight, and the outcome is not determined yet. So you'd need to "verify" a transaction and its outcome (reply to 131805)

br2: I want to deploy my own FUNC jetton contract. Where can i find a example for it?

WhyesCode: Read documentation (reply to 131809)

br2: in documentation i couldnt find an example, i event lookup to github actually

Cai: Can it be using TACT? (reply to 131809)

Cai: TACT will be built in FUNC ultimately

br2: i check tact by example website jetton contract but seems it has a issue (reply to 131813)

Cai: it doesnt

ghorban: why me other account baned

Cai: We use it heavily

br2: it doesnt sending JettonTransferNotification when i send some staking contract etc.

br2: let me compile and send issue in here (reply to 131819)

Anton: we are building a WIP Jetton in Tact that is compatible with the TEP-standards https://github.com/tact-lang/jetton (reply to 131816)

Cai: hm I have not dealt with any staking stuff 🤔

Cai: For anyone starting it's worth putting the time to watch this: https://www.youtube.com/@AlefmanVladimirEN-xb4pq

br2: looking fire 🔥 let me try it, thanks* (reply to 131823)

Cai: Had a quick look, not going to go deep into this. But I'd recommend you change your magic numbers into consts for the sake of readability (reply to 131823)

Cai: require(context().value >= ton("0.006625199"), "Insufficient gas"); -> const MIN_GAS_FEE = ton("0.006625199"); require(context().value >= MIN_GAS_FEE, "Insufficient gas");` (reply to 131829)

br2: i just deployed jetton and also i deployed this,  tact-lang org/cookbook/jettons/#accepting-jetton-transfer  when i send transfer notification i get this issue "12495: { message: Notification not from your jetton wallet! },"  here is a transaction testnet_tonviewer com/transaction/18b983e3f0061b3a0207e0b76f8551a0d4fa596dffe1e449811b65e28f1642ef (reply to 131823)

br2: what could be went wrong, i didnt understand

Try: Hi  can anyone help me   I want my frontend to interact with our smart contract. but not able to find good SDK or method   if any one can suggest me it will be really great

Anonymous💰: @ton/ton

Павел: Hi everyone! How can I cancel my GetGems sale on contract nft_fixprice_sale_v3 programmatically?

Павел: No info on them GitHub...

Ayush: Do anyone know where to find recent grants available in TON ??

Edm: has the testnet TONCenter v3 API stopped indexing new blocks? New transactions on testnet are not showing from any API response

Zaxs: Hi, @everyone can u please tell why apis getting this response ? it was working correctly few time ago - response {   "transactions": [],   "address_book": {} }

— 2024-12-20 —

sh: Hi, community After developing the game, we integrated it with Ton Space Wallet using the Ton Connect SDK. We added a "Return to Game" button after signing or sending a transaction in the Ton Space Wallet, but the app remains in the wallet and does not return to the game. Is there any additional parameter or setup required to address this issue?

E: Are all the functions related to random in the Tact grammar safe? If so, how are they made safe and not vulnerable to attacks? Is there any risk of being predicted or attacked like ETH, when using them in smart contracts?

&rey: I meant to say that in most cases you only need to check if the first, external, message got included in blockchain — that everything will certainly happen as it should. (reply to 131805)

Ippolito: how can i make a ton transaction to pay a fragment transaction using TONAPI?

Anonymous💰: using ton sdk (reply to 131959)

&rey: Fragment inner workings (ID assignment) are not subject to this chat. (reply to 131959)

Albert: Can you help me with this? My .ton site not working 😭 (reply to 65264)

Albert: Anybody done successfully with a static host .ton domain on ton storage?

pid | ton: are there any examples of smart contracts written in tolk-lang?

&rey: There are: https://github.com/xssnick/cron-contract/blob/master/contracts/cron.tolk. (reply to 131985)

pid | ton: thanks rey, that's help a lot (reply to 131988)

دی دی پرایم: Sir do you know what happend to TON all-in-one browser they talked about in first TON Gateway? It seems they cancled it in favor of Telegram in-app browser (reply to 131988)

WhyesCode: What's the issue? (reply to 131974)

FreeSpirit: how can i accept all messages inside tact?

Anton: https://docs.tact-lang.org/book/receive/#receive-internal-messages  > receive(msg: Slice) - called when binary message of unknown type is sent to the contract (reply to 131992)

Iřřøďẽr: Bonjour. Existe-t-il des bibliothèques sur js pour TACT vous permettant de compiler le code à partir du frontend et de le renvoyer?

Dmitry | backend4you.ton: check https://github.com/tact-lang/web-ide - they have made IDE, maybe you'll find something there (reply to 131994)

Albert: Which word? (reply to 132000)

&rey: One which stands for "without charge". (reply to 132001)

Iřřøďẽr: C'est intéressant, 👏🏻 (reply to 131997)

&rey: And I don't know of such hosting, precisely because TON Storage is system for paying to incentivize others to store your file. If they deem they want it. And no guarantees that you can download it.

Albert: Is there any like GitHub static host? In ton storage? Or I have to start some kind of process on my PC? (reply to 131991)

&rey: Please use English in this chat. (reply to 132003)

Danilo: Hello

Danilo: Wow, it seems I cannot post my question ^^

Danilo: Multiline messages does not work here?

Danilo: We are having problems to correctly derive our correct keypair from the mnemonic. We tried several different approaches, but none is returning our correct testnet public key that we can see on https://wallet.ton.org/?testnet=true  Does someone know how to solve this issue?

Danilo: import { mnemonicToPrivateKey } from "@ton/crypto";  const mnemonic = "test test test test test test test test test test test test test test test test test test test test test test test test" async function main() {     // we also tried with the wallet backup password, and other variations, among other variations like using mnemonicToSeed, etc     const keys = await mnemonicToPrivateKey(mnemonic.split(" "));     const publicKeyBase64 = keys.publicKey.toString("base64");     const publicKeyBase64url = keys.publicKey.toString("base64url");     console.log("Public Key Base64:", publicKeyBase64);     console.log("Public Key Base64URL:", publicKeyBase64url); }  main().then(e => console.log(e)).catch(err => console.log(err))

&rey: No, problem with some word probably.  Please mind rate limit which is certainly in place. (reply to 132020)

Danilo: Ok, thx, it seems it was because of the link (reply to 132025)

Giorgio: Is there a way to convert Stars to TON?

Hufsa 🇬🇧 | $TINU Engineering: Hey guys, I have a following problem:  I am using latest version of '@ton/ton' library (15.1.0) and I am trying to use getTransactions method, like this:  const transactions = await this._tonClient.getTransactions(clientAddress, { limit: 10 })  It clearly sends a request to ton orbs, that looks something like this.  {   "id": "1",   "jsonrpc": "2.0",   "method": "getTransactions",   "params": {     "address": "[WALLET_ADDRESS]",     "limit": 10   } }  but the response i get is this:  {     "ok": false,     "error": "LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time",     "code": 500 }  Not sure what to do with it, as TON documentation is really poor. Maybe anyone here encountered a problem like this before? The Wallet Address is a 'wallet_v3r2' contract

Hufsa 🇬🇧 | $TINU Engineering: This is really weird as it looks like it should be just a simple json_rpc call

Hufsa 🇬🇧 | $TINU Engineering: I think its also worth mentioning that the same code works flawlessly on testnet, only on mainnet there is an issue

User<7057220524>: What I think... - first, check the wallet address passed to getTransactions is in the correct format.  - second, check the wallet has been active recently on the mainnet and also you're not requesting transactions beyond the actual blockchain range. - third, consider querying the masterchain block using getMasterchainInfo to verify synchronization. if the lite server isn't fully synced with the masterchain, it can't find block or tx. (reply to 132042)

Hufsa 🇬🇧 | $TINU Engineering: Thanks for reply, so:  - The wallet address is in EQ format and has been recently used on mainnet  https://tonviewer.com/EQCtdLiAI8mvDLCyhR1E9DUm4R5_zHbrynfYjRp3dlBpTbbA this is the one  as far as I am aware, no address is working, all return error  - getMasterchainInfo returned:  {     "workchain": -1,     "shard": "-9223372036854775808",     "initSeqno": 0,     "latestSeqno": 43133691 }  I am getting endpoint via getHttpEndpoint form @orbs-network/ton-access  The full request/response looks like this (skipped some unimportant stuff):  Request URL: https://ton.access.orbs.network/55033c0ff5Bd3F8B62C092Ab4D238bEE463E5503/1/mainnet/toncenter-api-v2/jsonRPC Request Method: POST  Payload:  {     "id": "1",     "jsonrpc": "2.0",     "method": "getTransactions",     "params": {         "address": "EQCtdLiAI8mvDLCyhR1E9DUm4R5_zHbrynfYjRp3dlBpTbbA",         "limit": 10     } }  Response:   {     "ok": false,     "error": "LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time",     "code": 500 } (reply to 132043)

Hufsa 🇬🇧 | $TINU Engineering: Additionally, this is a quite old code, and i am certain it worked at one point

User<7057220524>: I think the error appears related to a synchronization issue or a misconfiguration with the endpoint.   - the response from getMasterchainInfo indicates a latestSeqno of 43133691, which suggests that the endpoint is synced.  so check that this value is increasing when re-querying after a short interval. (reply to 132045)

Minimal ☄️: Guys, how to redirect iOS users via TON CONNECT to wallet to send transaction and to redirect them back to the app after the transaction?  I have tried with 'back' value for returnStrategy, twaReturnUrl, and skipRedirectToWallet key with 'ios' and 'never' values but with no luck?

Minimal ☄️: I have read that if there are any async operations between click and sending tx on iOS - redirect won't work, and I am fine with that, I would like it at least to return to the mini app after the transaction

User<5458531765>: Hi I’m trying to generate the state_init for a WalletV4R2 using the following Python code. The wallet address is generated correctly, but the state_init is wrong when compared to the expected output.  Can someone help me identify what’s wrong with my code?  from tonsdk.contract.wallet import WalletV4ContractR2 import base64  public_key = bytes.fromhex("98845663921b15d8e55ae14d30095c01c6af499a107af4ba1334e1e4ce78c640") private_key = bytes.fromhex("851adfaff9bb164bb65ae14b446df6e49c38464003703cf43ffe7e5ddd31c63b98845663921b15d8e55ae14d30095c01c6af499a107af4ba1334e1e4ce78c640")   wallet = WalletV4ContractR2(public_key=public_key, private_key=private_key, wc=0)  wallet_address = wallet.address.to_string()  state_init = wallet.create_state_init()  state_init_boc = state_init["state_init"].to_boc()  state_init_base64 = base64.b64encode(state_init_boc).decode('utf-8')  print(f"Wallet Address: {wallet_address}") print(f"State Init (Base64): {state_init_base64}")

br2: is there a any suggested FUNC vscode extension?

Liho: https://testnet.tonviewer.com/kQAJlQ7uv_J6rhb2Ed1rMDMVYWniK2CnuQuL0tXR_-81TkjW  how do i withdrawn or transfer the Test USDT back to owner wallet?

&rey: That is not possible for any chain/token. (reply to 132153)

Liho: Why? User purchased with test usdt and send to the contract, cant the contract transfer the test usdt token back to owner account aka withdraw? (reply to 132170)

Liho: Then whats the point of sending usdt to the smart contract?

Liho: Or u telling me this is the limitation of ton contract, if want to do usdt withdrawal/transfer we shall use eth contract instead?

&rey: The point is that destination contract starts to own those jettons. (reply to 132172)

&rey: Like, wallets are also smart contracts, and it would be strange if you could "withdraw"/"retake" USDT sent to someone else.

Liho: Now the testusdt is in a jettonwallet and the smart contract is the holder  Im trying to run jetton transfer function to send it back to owner jetton wallet   Or do you have any idea how to achieve this? Or impossible at all?

Liho: https://testnet.tonviewer.com/kQAs_IOTdivSIc8_35r0fBOeCOfColyE8S3Ka3tc82vZo3me

&rey: I don't think you can do this in any blockchain. For instance, in Eth, how would you transfer jettons from someone else to you (if allowance hasn't been set)? (reply to 132180)

Liho: Im the owner of the contract

&rey: destination contract must support this. I see you have sent USDT to some collection, which is unlikely to do so. (reply to 132180)

Liho: The contract own the jetton

Liho: Ok u mean the contract need to write a withdraw or transfer function for the jetton izit?

&rey: That's actually beside the point because you can't make collection order its jetton wallet to transfer some to you – unless you wrote some code for that. (reply to 132183)

Liho: Ok thanks

User<5458531765>: hi , can you pls help me? (reply to 132170)

User<5458531765>: @pcrafter (reply to 132075)

&rey: Try setting flags index=False, crc32=False (or just False, False). Two pings is a bit too much. (reply to 132075)

— 2024-12-21 —

Blythex: A little Question i Hope you can Help me Here which are the Default Security Audit steps for a Blockhain

&rey: First and foremost, you must determine what the contracts system has to do. Without that, it is impossible to check whether it is correct. (reply to 132243)

&rey: Then, you and your dev team come into touch with auditors, fix uncovered issues until contracts work correctly (I'm explicitly not saying "until no errors are found", because the point is to make an always-working system).

Blythex: Thanks this will Help us 🙏 (reply to 132253)

User<7230296641>: Hi, what is the reason for Exit code 47? There is no explanation for 47 on docs.ton.org.

&rey: There must be explanation in contract's source code; they can throw anything they want. (reply to 132270)

User<7230296641>: Thank you very much. In addition, I would like to ask: Due to sharding and different routing on ton, if a transaction involves several contract calls, the technical documentation mentions that it will take several blocks to complete. In this way, in dex, a swap message will be passed through several contract calls, so this transaction may affect the pool conversion rate after an uncertain number of blocks in the future. Am I understanding correctly?

Dmitry | backend4you.ton: Exactly. And some bots have pre-created wallets in same shard as dex acc, and they watch mempool for swaps with high slippage and emit their own swap tx once they see “victim”, and their tx may be processed first. (reply to 132272)

User<7230296641>: Does pre-created wallets mean creating a transaction?

User<7230296641>: When viewing the relevant information of block ID, for example: Start lt/End lt 52053606000000 - 52053606000014 Asynchronous transactions are sorted by LT, but in a block, you can see that many transactions have the same LT (for example, 52053606000000). How are the same LTs sorted? Is there a smaller granularity inside TVM?

Iřřøďẽr: Had a look at this, came to a conclusion - it is really possible to compile pre-tested code on the frontend in the moment, because the compiler is written in ts. I found functions in src that are responsible for deploy, but it would take too long to build all the logic. From boc creation to deployment. Maybe there are ready-made solutions? Or no such thing has been created yet? (reply to 131997)

Dmitry | backend4you.ton: No. I tried to say that they tried many “master” wallets to find one that will have its Jetton wallet in desired shard. (reply to 132274)

User<7230296641>: OKay.okay,thank you. (reply to 132282)

Yae Thura: Hello,I have an issue about the encrypted message in transaction history.I made a transaction for not pixel in order to get the verification code.Then I got a transaction refund along with the code.Problem is that I can’t decrypt and read code in Binance.Would you like to help me about the code please 🙏

Blythex: Question again is it hard to find Security Auditors which we can Trust or give it a "better" way for this to find some? (reply to 132253)

Anton: https://docs.ton.org/v3/concepts/qa-outsource/auditors (reply to 132314)

Blythex: Thanks 4 fast replay   Can i contract this people to If its 4 a whole new Chain system which is Not Ton? (reply to 132322)

Tom: Do you have any personal recommendation from this list? Thanks (reply to 132322)

Anton: I would say Trail of Bits, but they are in the more expensive side of the spectrum (reply to 132324)

Blythex: Why i was my msg removed what did wrong ?

&rey: 1. It isn't on topic. 2. Call for blind trust might be net bad, because scammers often assume identity of popular people in the ecosystem; checking what is said works in more cases. 3. The chat is maintained in order to provide a good complement to TON documentation, which can be searched for answer on many hard questions. Statements which don't contribute to discourse (or are misleading/etc) may be deleted when irrelevant.  Moderator decisions are best discussed personally. (reply to 132329)

Blythex: I agree (reply to 132331)

.: Hi,  what does before_lt in ton console api?  I couldn't find anything

4: savePreparedInlineMessage

— 2024-12-22 —

&rey: Please use @devs chat for TMA development, since TMA are not bound to TON in any way. (reply to 132397)

&rey: I'm not sure what you can use for Telegram bots, but that's not for this chat either.

Bright✌: Hello pls has anyone built a nft mint  website for ton blockchain Need help

&rey: Getgems have) (reply to 132451)

Bright✌: Yes I know (reply to 132480)

Bright✌: I want to have own custom website I mean

Bright✌: So users can come and mint nft then sell on getgem marketplace

فرشاد: / (reply to 132444)

WhyesCode: Do you mind we work together? (reply to 132451)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: You can ask me your questions if you are using react + typescript and you need some advice about connecting to TON and processing NFTs (reply to 132487)

Oleg: Hi Everyone! I have a question about requesting historical balances for address via API. If I use toncenter api, I can request list of events via /api/v3/events Response contains list of events and also very useful fields account_state_before and  account_state_after (including balance). But this balance only represents balance in TON.  My question is, is there a way to request similar data for Jettons? To know historical balance for the address in specified Jetton.

&rey: You need to query jetton wallet state then. Since you know both address and jetton, that's quite easy. (reply to 132520)

Oleg: I’ll try it now, thanks! (reply to 132521)

Oleg: No, it doesn’t work unfortunately… Interestingly, the API returns exactly the same data as if I would request for main address. (reply to 132521)

Oleg: Example:  UQAvuTVCsIWH9flxBwNTWXXXnZutGTAc5n9mQMPrcELMj1bW (main)  EQDce8FIcT6fo8AOSM-nDx7AAG1-GP3NMgUingIiyNSE1lZ8 (Jetton)    The response of /api/v3/events is exactly the same for two.

Anonymous💰: Hi, all. how can I start to study Ton blockchain?

R.P. 🐾 Bailey: Hello guys can you tell me how to burn tokens , token are launched on Blum memepad and they are on Ton keeper

WhyesCode: Docs.ton.org (reply to 132528)

Anonymous💰: Thanks (reply to 132533)

Genri: Hello 👋

Zaxs: Hello devs,   Can somebody tell me best way to check if send transaction is confirmed or not?   I am using the tonapi  I send the boc to recieve msg_hash using tonapi then i send  the msg_hash to check the transaction - https://testnet.toncenter.com/api/v3/transactionsByMessage?msg_hash=${encodeURIComponent(msg_hash)}  but it is showing this -"error": "number of field descriptions must equal number of destinations, got 69 and 67"  it was working few days ago but not now. Please help me

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: that mean you have to send 2 more fields, check the endpoint documents (reply to 132540)

Zaxs: tried directly on the toncenter site with more than 2 fields but not working empty res even transaction is success - {   "transactions": [],   "address_book": {} } (reply to 132544)

Rafal: What is the best solution to check locally gas used by a contract execution? Blueprint?

— 2024-12-23 —

Daniel(""): G'day chat. Am I able to deploy nft collection in testnet?

stefan: Did someone know If there IS a nft Generator for Ton?

Zaxs: If any Devs have solution let me know (reply to 132540)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: async function getTX (msg_hash: string) {     const result = await fetch(         `https://testnet.toncenter.com/api/v3/transactionsByMessage?msg_hash=${msg_hash}&direction=in`, {             method: 'GET',             headers: {                 accept: 'application/json',                 'Content-Type': 'application/json',                 'X-API-KEY': YOUR_API_KEY             }         }     )      return await result.json(); } (reply to 132625)

Alex: TonTech team is developing infrastructure projects like Liteserver and is eager to improve them. To better understand the current needs, they launched a survey. Please share the needs you feel are and will be helpful for your product with the Infrastructure Developer Survey.   👉https://forms.gle/D9ZWAo1qMnNrio3dA (forwarded from TON Dev News)

Leboss: Hello can someone provide update to issue I raised with contract I created which is holding funds and not sending to TON wallet

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 56 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 23  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

WhyesCode: Do you have more details about error? stack trace, log, or something? (reply to 132639)

Zaxs: Thanks, Sometimes it works and sometimes throw error. why? is it tonapi issue or something else? (reply to 132629)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: sometimes you are reaching rate limit sometimes your rate is open (reply to 132647)

oracle: I want to switch my archive node to lightserver mode, but I get these errors, any ideas how to fix it?    MyTonCtrl> enable_mode liteserver Error: Cannot enable liteserver mode while validator mode is enabled. Use `disable_mode validator` first.  MyTonCtrl> disable_mode validator Error: lock_file error: time out.  MyTonCtrl>

oracle: ;(

fade: maybe try sudo systemctl stop mytoncore sudo systemctl stop validator before disabling validator mode, then start the services after that (reply to 132651)

oracle: same result((( i try it before    MyTonCtrl> enable_mode liteserver Error: Cannot enable liteserver mode while validator mode is enabled. Use `disable_mode validator` first.  MyTonCtrl> disable_mode validator Error: lock_file error: time out.  MyTonCtrl> (reply to 132655)

fade: try to stop mytoncore then delete ~/.local/share/mytoncore/mytoncore.db.lock

oracle: this work! thank you again) (reply to 132657)

Zaxs: thanks btw hoping so it is rate limit issue not api. i will use it in large userbase app. will purchase paid version so it can handle the load (reply to 132648)

Vladyslav: Can anyone help to understand problem?  I try to send jsonRpc runGetMethod with this params: {  "method" : "runGetMethod",   "id" : "ton",  "jsonrpc" : "2.0",   "params" : {    "method" : "get_wallet_address",     "stack" : [ {      "type" : "slice",       "value" : "te6cckEBAQEAJAAAQ4AAq5uGt+h8ySblAsNCqRLXVOXzfmdfoMdYRu+iI9Q475BfJfPc"    } ],     "address" : "kQDEfyeBvCLtNmm7E83KmOoanCUl2E-t4KprIp-VhfSVRk0J"  } } But toncenter returns this:  {      "ok": false,      "error": "",      "code": 503  }  This request works for api request: curl -X 'POST' \    'https://testnet.toncenter.com/api/v3/runGetMethod' \    -H 'accept: application/json' \    -H 'Content-Type: application/json' \    -d '{    "method" : "get_wallet_address",    "address" : "kQDEfyeBvCLtNmm7E83KmOoanCUl2E-t4KprIp-VhfSVRk0J",    "stack" : [ {      "type" : "cell",      "value" : "te6cckEBAQEAJAAAQ4AYj+TwN4Rdps03Ynm5Ux1DU4Skuwn1vBVNZFPysL6SqND1xqG1"    } ]  }'

Павел: Hi! How can I cancel GetGems sale using python? I tried with tonutils, but tx not appears on blockchain... Cannot understand why

Павел: To be honestly, I want to send NFT on sale to specific address. My strategy is:  1) Cancel sale 2) Transfer to address  But first tx not appears in blockchain and second fails with error (because its owner still sale contract)

Павел: Here is my code:  async def transfer_nft_to_user(         self, nft_address: str, user_wallet_address: str     ) -> None:         wallet, _, _, _ = WalletV4R2.from_mnemonic(             self._tonutils_tonapi_client(), self.aura_nft_wallet_mnemonic         )         nft = await self.get_nft_data(nft_address)         if nft is None or nft.sale is None:             logger.error(                 f"Can't find nft with address {nft_address} and sale on chain. User wallet: {user_wallet_address}"             )             return         sale_cancel_body = SaleV3R3.build_cancel_sale_body()         sale_cancel_tx_hash = await wallet.transfer(             destination=nft.sale.address.to_userfriendly(),             amount=1,             body=sale_cancel_body,         )         logger.info(             f"Nft sale (address: {nft.sale.address}) for nft with address {nft_address} successfully cancelled. User wallet: {user_wallet_address}. Tx hash: {sale_cancel_tx_hash}"         )          transfer_body = NFTStandard.build_transfer_body(             new_owner_address=Address(user_wallet_address),             forward_payload=(                 begin_cell()                 .store_uint(0, 32)                 .store_snake_string("Hello from AuraXCrypto!")                 .end_cell()             ),             forward_amount=1,         )         tx_hash = await wallet.transfer(             destination=nft_address,             amount=0.05,             body=transfer_body,         )         logger.info(             f"Nft with address {nft_address} successfully transfered to user wallet. User wallet: {user_wallet_address}. Tx hash: {tx_hash}"         )

Павел: Hmmm, if I comment code with transfer NFT Sale Cancel goes as intended... There must be something wrong with seqno😕

&rey: Well you can't do two transfers at once. (reply to 132687)

Павел: How? (reply to 132692)

Павел: Sorry, thinked you wrote "Why?", not "Well..."

&rey: Wait until first is recorded in chain and, that's important, its transaction chain completes. (reply to 132693)

Павел: I must wait for seqno, or periodically fetch tx hash? (reply to 132695)

&rey: That's not sufficient. You must wait until NFT records it is on your address. (reply to 132697)

Павел: Got it 😎😎😎😎 Thank you (reply to 132698)

Soly: Hi sir , what is the best way to get webhook transaction updates ? (reply to 132698)

— 2024-12-24 —

TON Bounty Bridge: ​Blum  Created by DiyorXasano

Jagveer: Hi @all  Is TON chain allow us to develop a token with custom logic with token transfer tax fee and also tax fee on Buy/Sell operation like we can do in EVM based ERC-20 tokens?

&rey: Token cannot (and should not) distinguish between "buy/sell/stake/..." and just transfers. (reply to 132806)

Jagveer: So we can not implement this logic in TON token Right?

Jagveer: @pcrafter

Jagveer: Like in EVM based ERC-20 tokens we can override transfer method and implement tax logic inside transfer method

Naruto: Hi, I am using toncenter api to fetch transactions of an address, but I am unable to find the data related to the token transferred in the transaction, I want to get the contract of the token transferred and amount it only gives me data for the ton transferred

RM: Hi everyone . For participating in consensus , its given in the TON website that validators propose candidates for new blocks (made up of transaction batches), while other validators validate and approve them via digital signatures. . How does the validator propose the candidates for block proposal - on what basis ? Is it random or is there any criteria that needs to be met . Any idea on this?

Sad Bun 🐇: you have to parse jetton transfer message body i guess (reply to 132813)

MT: Is there a way to initiate the transfer of multiple NFTs at the same time? For example, using smart contracts and the like

Zurcher: Good day house, anyone here who has been able to link a ton dns to a website ?

&rey: Have you read through catchain.pdf? (reply to 132816)

&rey: Well on blockchain level there's no such thing as jetton, and toncenter reflects what happened exactly. (reply to 132813)

&rey: Your wallet is a pretty capable smart contract, it can transfer up to 4 items (wallet v5 – up to 255) with a single confirmation request. (reply to 132825)

MT: Which method do I need to use to perform this transfer operation? I didn't find any relevant method documentation (reply to 132833)

Виконт vangaard: They are all smart contracts right? (reply to 132832)

TON Bounty Bridge: ​SvelteKit UI Components Library for Telegram Mini Apps  🏷 Developer Tool    Rewards: • $8000 in TON equivalent • Standard TON Footstep SBT  Created by hitaspdotnet

Naruto: If i transfer some USDT using an address and fetch the transactions for that address using toncenter how can I get the data for the token transferred and it's amount? (reply to 132832)

Naruto: Because I don't exactly see that in the response I get from the API

Naruto: It only displays the TON amount

Sad Bun 🐇: https://tonviewer.com/transaction/212a20983cd0e7769bd6baac524ad9772543e9ce78fe480b2d62ce355a0a283a  this info is inside msg body  toncenter doesn't decode it, you have to do it manually (reply to 132845)

Naruto: How exactly we have to do it can you suggest? Because I tried decoding some of it(according to google) to get the value and it was wrong (reply to 132847)

Sad Bun 🐇: this string is boc  you should load it into a cellslice  then read first 32 bits - it's opcode  check that opcode is jetton transfer or jetton notification (or any other message type which you are interested in)  after that read other fields - query_id, amount, destination and etc. (you can see types and order of fields in tonviewer)  most sdks support reading basic types from cellslice, so hopefully it won't be a huge problem (reply to 132848)

Anonymous💰: 🎄

Naruto: Thanks a lot man, will let you know after I test this (reply to 132850)

Frenly: ton website doesn't work

Виконт vangaard: TON website isn't working

Iřřøďẽr: Ton scam? (reply to 132951)

Frenly: What do you mean? They probably have some technical difficulties. (reply to 132974)

&rey: Nope, and documentation docs.ton.org (which is arguably more important) is up. (reply to 132974)

— 2024-12-25 —

&rey: Fixed. (reply to 132951)

Vl: hi. how check multi address ton for deposit on nodejs?

Outcasters: How can I send testnet ton to normal ton wallets

WhyesCode: Manually or with code? (reply to 133050)

Outcasters: Manually (reply to 133125)

Dmitry | backend4you.ton: you cant use testnet ton in mainnet and vice versa some (many) wallets have ability to switch to testnet (read manual for your wallet) and use testnet addresses to send/recieve testnet coins, but nobody can "transfer" coins between networks. (reply to 133050)

Outcasters: Thanks for info (reply to 133130)

Tea the Bottle: hello, Im stucking here:  with this code, address show up was diff from my Ton keeper address  let mnemonics = (process.env.mnemonics || "").toString();  console.log(mnemonics.split(" ")) let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));  // Create wallet contract let workchain = 0; // Usually you need a workchain 0 let wallet = WalletContractV5R1.create({ workchain, publicKey: keyPair.publicKey }); console.log(wallet.address);   I can not figure out why from same mnemonics it was gave out 2 address

TKAINU: It will be 1 display address and 1 standard Ton address (reply to 133134)

Tea the Bottle: I solved it, V4 is ok, V5 is a mess. Tonkepper using w5, not v5r1 like ton ton (reply to 133135)

&rey: Those names "w5" and "v5r1" refer to one and the same. (reply to 133136)

Tea the Bottle: it gave out 2 difference address

Tea the Bottle: Using V4 and no problem

User<7919588131>: /stat@combot

RM: No , where can I get that pdf . Can you please share it (reply to 132831)

Виконт vangaard: Can someone send me PDFs to learn TON Smart contracts development (func or tact) in English

musashi: hey guys I got a weird issue with sending ton inside FunC code. here is my sendTon function:   () send_ton(slice recepient, int amount) impure inline {     var msg = begin_cell()             .store_uint(0x18, 6)             .store_slice(recepient)             .store_coins(amount)             .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)             .end_cell();     send_raw_message(msg, 1); }   I tried to sent 2 TON to recepient but recepient received less than that

musashi: pls give me some hint sir @pcrafter

&rey: This: https://docs.ton.org/catchain.pdf. (reply to 133146)

&rey: And received is obtained by..? (reply to 133157)

musashi: by sending 2 TON from the contract to recepient mate (reply to 133160)

musashi: or did I misunderstand your question hehe?

musashi: here is the code I used to check the recepient balance change    const platformFeeRecipientBalanceBefore = await platformFeeRecipient.getBalance(); ... const platformFeeRecipientBalanceAfter = await platformFeeRecipient.getBalance();  expect(platformFeeRecipientBalanceAfter - platformFeeRecipientBalanceBefore).toEqual(toNano(2));

&rey: Well that would not work in any case. (reply to 133163)

&rey: There are fees irrelevant(unknown) to the sender, such as computation and storage on destination contract.

musashi: but the recepient didn't do anything =)

musashi: so it still work correctly on testnet/mainnet instead of the sandbox tests?

&rey: It did. (reply to 133166)

musashi: what =)))

&rey: Was there a transaction on recipient? (reply to 133169)

musashi: of course, the ton sending to him tx

musashi: only this tx sir

musashi: did I make any mistake sir @pcrafter ?

Leo: The transaction on recepient consumed some ton as shown in totalFees above

Tom: Try printTransactionFees (reply to 133172)

musashi: yes but I used mode 1 mean pay gas separately so it should be deducted from my contract instead of the tx (reply to 133175)

Tom: That’s only forwardFee (reply to 133178)

musashi: hmm so which mode should I use to let recepient receive 100% of the 2 TON?

musashi: I read about the mode 1 on Ton docs

Rasoul: Hi everyone, Is there a way to buy an NFT using a script?

&rey: Pinging me always isn't a good idea. So, you have a moderator warning. (reply to 133183)

&rey: Source contract simply has no access to read storage or computation fee for message it sends. (reply to 133181)

RM: Should I generate keys to become a ton validator and participate in consensus . as we generate the keys for ethereum validator

&rey: I've heard mytonctrl takes care of all that. Mind hardware requirements. (reply to 133188)

Rasoul: I would be grateful if you could help me. (reply to 133183)

Tom: First you need to figure it out what it means by ”buy”. What contract, which method, what are the parameters (reply to 133183)

RM: Okay so to become a ton validator , all we have to do is setup a full node , install mytonctrl and run validator node by staking minimum toncoins right ? (reply to 133190)

&rey: btw those two points are one and the same) (reply to 133195)

RM: Yea got it 👍thanks :) (reply to 133196)

Rasoul: I want   to buy NFT from Getgems (reply to 133194)

Tom: Then I would suggest you read the respective contracts first. https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts (reply to 133201)

Руслан И: Has anyone sold their Telegram username before? Do you know of any scam schemes related to selling usernames? Someone just offered to buy my username for a significant amount of money. I’m wondering if this might be a scam.

&rey: It might. Don't click on any links provided by them, and use any NFT marketplace you trust, finding link by yourself (common choices are Getgems aka https://getgems.io and Fragment aka https://fragment.com). (reply to 133203)

&rey: I'd also like to note that is off topic for this chat.

musashi: so you mean it's impossible to let recepient receive exactly 2 TON in my case? (reply to 133187)

Руслан И: Oh, okay, sorry (reply to 133205)

&rey: Yes; or recipient must return amount over the required level. (reply to 133208)

&rey: Actually returning excess is a common practice, done via raw_reserve(2 TON, 4); send_raw_message(to sender, 130); IIRC

𝘼𝙧𝙮𝙖𝙣.🦴: Guys, I'm a beginner and I need a HelloWord script to send ton via Python. I also checked ton site, but I couldn't find a simple script.

&rey: Chat history is also a well of knowledge. from pytoniq import LiteBalancer, WalletV3R2, begin_cell import asyncio  mnemonics = []  destination = 'EQBeeFa0...' present_ton = 1.4 comment = 'UwU'  async def main():      provider = LiteBalancer.from_mainnet_config(1)     await provider.start_up()      wallet = await WalletV3R2.from_mnemonic(provider=provider, mnemonics=mnemonics)      transfer = {         "destination": destination,         "amount":      int(10**9 * present_ton) + 1,         "body":        begin_cell().store_uint(0, 32).store_string_tail(comment).end_cell()     }      await wallet.transfer(**transfer)     await client.close_all()  asyncio.run(main()) (reply to 133229)

Joker: Hello guys! Is there any examples for vanity addresses generation on github maybe? I understand correct, I need change some specific props in smart contract and redeploying so many times as needed to find specific prefix/postfix in the testnet? Then I could repeat same conditions to deploy into mainnet once? Or maybe this many operations can be repeated locally, e.g. with blueprint/sandbox?

&rey: Seriously? https://t.me/tondev_eng/119352  And, for that matter, all of that is done locally. (reply to 133264)

Haa: Hi, does anyone know why https://minter.ton.org/ keeps reversing my token creation transactions?

Haa: I have about 0.7 Ton in the wallet so it cant be low balance

&rey: Well nothing can reverse transactions so what actually happens? (reply to 133277)

Haa: https://tonviewer.com/UQB74eZmAPTt9X2PwwLYn-R8-lZwJ4pboE2OmMIkDyAiAZTR?section=transactions  Says "bounced" here (reply to 133279)

&rey: Something is wrong with your wallet app since it neglected to attach StateInit. (reply to 133281)

Haa: oh okay, I am using Trustwallet. Which wallet would you recommend? (reply to 133282)

&rey: I use a wallet which I cannot recommend, unfortunately. Please look at https://ton.org/wallets and DYOR (reply to 133283)

Haa: Okay, thank you (reply to 133284)

m: Hi all, I've encountered a problem: when tonconnectui wallet connects on ios, I can't track the connection via onStatusChange until the user returns to the browser. is there any solution?

User<7218809845>: hi, what is the easiest way to transfer Ton in Python?

&rey: You're welcome to dozen messages up: https://t.me/tondev_eng/133230. (reply to 133307)

User<7218809845>: assert mnemonic_is_valid(mnemonics), 'mnemonics are invalid!'            ~~~~~~~~~~~~~~~~~^^^^^^^^^^^ AssertionError: mnemonics are invalid! (reply to 133310)

&rey: Well 'course you need to enter mnemonic for sender wallet. (reply to 133313)

User<7218809845>: I used this code to generate wallet:    import json from tonsdk.contract.wallet import Wallets, WalletVersionEnum   def generate_wallet(_id):     with open('wallet.json', 'r') as file:         wallets = json.load(file)      mnemonics, pub_k, priv_k, wallet = Wallets.create(WalletVersionEnum.v4r2, workchain=0)     wallet_address = wallet.address.to_string(True, True, False)           wallets.update(         {             _id: {                 "address": wallet_address,                 "public_key": pub_k.hex(),                 "private_key": priv_k.hex(),                 "mnemonic": " ".join(mnemonics)            }         }     )      with open('wallet.json', 'w') as file:         json.dump(wallets, file, indent=4)     return wallets[_id]  generate_wallet(1) (reply to 133314)

User<7218809845>: output:   {     "1": {         "address": "UQCrbPe3vNll9c7E37YwmKo_phLTbh7rcAuLV-lwaDoBieLM",         "public_key": "138bf2be89a2f9b224be43068376d7ef24b442df68a11999d704aac2944d7453",         "private_key": "3f8ac57ae5e3b96eeb5ef85654fa246cb0cb7277a47a3be772b6ef05193591bf138bf2be89a2f9b224be43068376d7ef24b442df68a11999d704aac2944d7453",         "mnemonic": "gentle joy scatter announce insane extend hedgehog smoke kiss response appear wasp december rotate cloud illness silk august promote finish skate virtual rain march"     } } (reply to 133315)

&rey: You must've entered mnemonic incorrectly. mnemonics = 'gentle ... march'.split()  (and change imported wallet version corresponding to which you want) (reply to 133316)

User<7218809845>: 🙏🙏 (reply to 133317)

&rey: By the way you don't need any tonsdk if you have pytoniq. I'm not even sure how you came to know of the former, since it was unlisted due to a soundness issue.

User<7218809845>: really? I didn't know it had an issue. Is it a security problem? (reply to 133319)

&rey: Tonsdk's cells are (or were) serialized incorrectly. That might lead to wrong transfer order being signed, yes, and there might be various security implications. (reply to 133320)

User<7218809845>: oh (reply to 133321)

User<7218809845>: can I create w5 wallet with pytoniq? (reply to 133321)

&rey: I think you need to implement v5 wallet class separately, like in https://github.com/yungwine/pytoniq/blob/master/pytoniq/contract/wallets/wallet.py. (reply to 133325)

Heydar: @pcrafter do you have any idea? (reply to 127669)

&rey: No. (reply to 127669)

AmirhN: Can anyone explain what's happening with these transactions? Somehow the swaps are failing, and magically the TONs are being transferred to other wallets, this is not my wallet, im just observing and curious how it works

AmirhN: For context, a famous russian artist launched a meme on TON, and now selling them in small batches and doing this, not sure if intended to wash the money or not

AmirhN: and then on the receiver wallet, it shows this

AmirhN: Mostly curious how a failed swap results in move of TON to another wallet

&rey: You'd better look at single transaction tree, and its tab "Value flow". (reply to 133358)

AmirhN: Yes i did, that's how i found they're not failed swaps, and actually moving the TON (reply to 133360)

AmirhN: this is an example

AmirhN: oh 2 images deleted, you may check logs (recent actions)

AmirhN: is it like he is simply bundling two transactions in one, one is a swap intended to fail, the next one is a simple transfer? so somehow it doesn't show stuff in explorer?

&rey: Mind message rate limit, then. (reply to 133369)

&rey: I think that's just builtin DEX functionality. (reply to 133370)

AmirhN: Oh, ok. That's weird anyway and i was trying to understand how it is happening 😁 (reply to 133372)

User<7218809845>: AttributeError: 'Builder' object has no attribute 'store_string_tail'. Did you mean: 'store_string'? (reply to 133230)

&rey: I believe DEX has configurable parameter where source asset goes if swap fails. (reply to 133373)

AmirhN: Oh, that makes sense! I didn't find anything in the Ston.fi UI tho, but probably they're interacting with the smart contracts directly then, thanks for the response! (reply to 133376)

***: Hey! who can i talk to about Telegram Stars and integration it to the TMA?

Игорь: Hi everyone, I'm making my first ton app and can't deal with BoC what is it and why is it needed? I didn't find any relative info on it  const {boc} = await tonConnectUi.sendTransaction(tx);

&rey: To @devs. (reply to 133381)

&rey: Well generally speaking it is not required to handle it in any way. (reply to 133382)

User<7218809845>: from pytoniq import LiteBalancer, WalletV4R2, begin_cell, LiteClient import asyncio  mnemonics = ["..."]   destination = 'UQBp...' present_ton = 0.001 comment = 'UwU'  async def main():      client = LiteClient.from_mainnet_config(         ls_i=0,         trust_level=2,         timeout=15     )      await client.connect()      provider = LiteBalancer.from_mainnet_config(1)     await provider.start_up()      wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)      transfer = {         "destination": destination,         "amount":      int(10**9 * present_ton) + 1,         "body":        begin_cell().store_uint(0, 32).store_string(comment).end_cell()     }      await wallet.transfer(**transfer)     await client.close_all()  asyncio.run(main())    output:  pytoniq.liteclient.client.RunGetMethodError: Get method "seqno" for account Address<EQDi8YwApzW7-cEL-KeIRqGDy5Zxgi...> returned exit code -256  why?

— 2024-12-26 —

Tea the Bottle: hello, Im looking for guide to create messenge with @ton/ton

Tea the Bottle: I can send string but found no guide to send custom messenge yet

匿名少女: Hey guys I am looking for people with TMA promotion or development experience. DM me if you’re interested in collaborating or working on a project together!

Hong Kyun: Hello guys! Is there ant specific method to get mass amount of previous transaction histories on TON.  Old node APIs says 1000 txs per query but newer ones doesn’t state any limits, is it still 1000 txs per getTransactions?

Tea the Bottle: hello, how long should I wait for each request ? Im trying to make multi request from server but look like there is limits. or limit is only appy to testet ?

Tea the Bottle: function createTonClient() {   return new TonClient4({ endpoint: "https://sandbox-v4.tonhubapi.com/" }); }

Tea the Bottle: which provider that you recommend ?

Tea the Bottle: Im trying to choose for my project but found not docs

perfogic: @pcrafter hello, is there any platform for ton indexer on smart contracts ?

perfogic: or i have to build it on my own? Thanks

Nerses: Does a comprehensive list of gas optimization tips for the TON blockchain exist, or is there any documentation that provides detailed guidance on this topic?

&rey: I don't think any list can be exhaustive; just as a theorem proves that it's impossible to check if two programs do the same actions in general case. (reply to 133460)

RM: I tried setting up fullnode for testnet and got the error: This machine has 12 CPUs and 32632060KB of Memory. Requires a minimum of 16  processors and  64000000 RAM. Is there any way that we can setup the node for Testnet with this configuration ?

fade: you'd have to build your own, useful resources can be found here: https://github.com/tonkeeper/opentonapi/blob/master/pkg/blockchain/indexer/indexer.go https://github.com/yungwine/pytoniq/blob/master/examples/blocks/block_scanner.py (reply to 133444)

&rey: I don't think you can! (reply to 133466)

fade: i think running mytonctrl install script with -i will ignore the minimum requirements, no? (reply to 133468)

&rey: Well I don't know but running a node with such configuration is risky, isn't it? (reply to 133469)

fade: yeah it does say -i is for checking the compliation process only and shouldn't be used

RM: In the ton docs - its given that we need 16 cores CPU and 128 GB RAM to setup a node. But nothing is mentioned about testnet. So we need the same configuration for testnet also right ?

User<5458531765>: I'm facing this error while I wanna make a transfer with Pytoniq library: Error during transfer: Get method "seqno" for account Address<EQDi8YwApzW7-cEL-KeIRqGDy5Zxgi9aYzS-m91C7dZ_wf06> returned exit code -256  that's because Pythoniq library is not able to initialize account upon needed what should i do? (reply to 133470)

Rasoul: my wallet is wallet_v5r1  but pytoniq  not have suppurt this wallet what  is  solution ? (reply to 133230)

fade: if get seqno failed then you'd need to generate the state init for that  wallet and include it in the external message, and use seqno 0 (reply to 133476)

🏆: How my contract can create deposit contract for user? I mean to make user pay for that in first transaction

fade: here's a snippet of my old code, not sure if it works anymore but you can use it as a reference async def _wallet_transfer(     wallet: WalletV3R2 | WalletV3R1 | WalletV4R2,     destination: Address,     amount: int,     body: Cell, ):      state_init = None          try:         wallet_seqno = await wallet.get_seqno()     except RunGetMethodError:         # uninit wallet, seqno is 0         wallet_seqno = 0         state_init = wallet.state_init      wallet_message = wallet.create_wallet_internal_message(         destination=destination,         send_mode=3,  # 2 for ignore errors, 1 for sender pays fee         value=amount,         body=body,         state_init=None,     )      transfer_msg = wallet.raw_create_transfer_msg(         private_key=wallet.private_key,  # type: ignore         seqno=wallet_seqno,         valid_until=int(time.time()) + 3600,         wallet_id=wallet.wallet_id,         messages=[wallet_message],     )      message = wallet.create_external_msg(         src=None,         dest=wallet.address,         import_fee=0,         state_init=state_init,         body=transfer_msg,     )      serialized_message = message.serialize()     message_boc = serialized_message.to_boc()     txid = serialized_message.hash.hex()      client.raw_send_message(message_boc) (reply to 133476)

TTY: hey guys,sorry to bother. i got a question: i am using ton connect ui and send transaction. then i got a boc.

TTY: then how can i use it to confirm the transaction succeed by using this boc?

TTY: i got stuck here for a long time.

TTY: after decode it, i can get the txn hash? what about the next step? 😢

Rasoul: Please advise. (reply to 133477)

TTY: yeah i was trying to do it but i didn't find any useful doc. 😞

&rey: Idk if it's been translated but there is an extensive description in Russian. https://gist.github.com/mr-tron/a4b3e8eff3a982e3426f6397eb9a2450 (reply to 133492)

🏆: Any library to convert one address type to another?

fade: you'd have to implement it yourself, see the implementation in tongo (reply to 133491)

Danilo: Hello everyone, do you know a way to retrieve all tokens testnet contract addresses? Or a testnet alternative to this url wss://omni-ws.ston.fi?

perfogic: many thanks, i will check it (reply to 133467)

MBA: Hello there i working on a project and i need 500 TON in testnet is there anyone that could helps me?

Ibrohimov Oybek 🇺🇿: @testgiver_ton_bot i think this bot can send TON  It only gives 2 ton (reply to 133502)

MBA: I want test something on telegram numbers in test net and fragment dont have testnet

Nerses: I am totally agree with that , but anyway are there some approaches or structures that can save fees (reply to 133465)

Dimer: Помогите мне, как получить хеш транзакции на пайтоне? У меня сохраняется в БД постоянно предпоследняя.

&rey: @tondev. (reply to 133514)

&rey: Yeah. Minimize cell creation/parsing calls. Concatenate builders instead of converting one into slice and storing it then (re: all jetton implementations except mine 😄). Use optimal algorithms. (reply to 133505)

Matan: Hello everyone, do you know if there's a way to get a raw transaction including the external message bytes via toncenter or LiteServer APIs? Or put it another way, let's say i have a root transaction and i see the in_msg.hash where can I get the bytes that hash to this value?

musashi: in which case that we get both undefined issues in logged transaction like this sir @pcrafter   exitCode: undefined, actionResultCode: undefined,

{ дүние } ақырет: Hi guys! Please can you help me understand  0089-jetton-wallet-discovery with TON amount higher than 5000 gas-units + msg_forward_prices.lump_price + msg_forward_prices.cell_price = 0.0061 TON for current basechain settings (if amount is less than that it is not possible to send response) attached How can I calculate the TON amount nowadays?

&rey: I believe if there was no contract state (that is, not deployed). (reply to 133532)

musashi: thanks mate

musashi: I guess i built the wrong stateinit

Bastin: Hi guys, I need some high-level expert advice. I want to build a proof of personhood telegram bot. The bot can link a telegram account/phone number to a unique proof of personhood identifier. So it could, for example, only allow accounts that are verified people to post in certain channels, or share links, etc.  I would also like this bot to be able to access cross-chain-identities like KILT or Frequency and have access a decentralized databank, to store the account - identifier pairs.  Another feature should be a KYC Service. Banks for example, pay the Bot a certain amount of TON to verify a phone number (so that this number hasn't been used twice be a certain person and it's unique to that person). These TON are getting used to pay for decentralized infrastructure, for example accessing other blockchains and decentralized databases or even incentivise people to register into this network by handing them out TON for registering.  Is it possible to bridge TON to networks like KILT, PolygonID, Frequency, or Filecoin, Arweave etc. to access Identifiers on them? It's probable possible for some and for some it isn't so the question is rather how can I find out for which network it's possible?  If that's not possible at all, what are current proof of personhood approaches on TON? I could only find Humancode.  Thank you for reading

Matan: This document is great (I google translated it) and it addresses my issue exactly. However, it fails to mention that what it refers to as "body_hash" which is the most useful hash is the one hash that is unusable by any TON API (e.g. you can't find the transaction with it etc) (reply to 133496)

&rey: Well, literally any: @ton/core, pytoniq-core, TonWeb, etc. (reply to 133498)

Matan: Sorry I'll correct myself. It appears that toncenter's /v3/transactionsByMessage has the option to find the transaction with body_hash. Problem is most explorers don't use it or even show it (reply to 133546)

&rey: *not body_hash but ext_msg_hash, I'd believe. (reply to 133550)

Matan: It can find by both msg_hash and body_hash. I tested it just now (reply to 133551)

Matan: Toncenter's /v3/messages also accepts body_hash but it's not too useful (reply to 133551)

Naruto: is there any way to directly get the data of the jetton being transferred in a transaction?

Hashim: I want to add ton wallet in my app in flutter

Vl: just do it (reply to 133584)

Hashim: How

degun: hello. I'm not a beginner dev but new on TON. I created an account V5r1 only with tonkeeper then import it on testnet with tonkeeper. when I call the testnet it's always the wallet of the mainnet which is created by WalletContractV5R1.create. I try to create the address wallet directly with hex buffer but the buffer is the same on mainnet and testnet. Any idea? it's just the helloworld sample. Thanks.

&rey: Had something to do with subwallet IDs. (reply to 133587)

degun: ha ok. I see a subwallet here : 'context: { workchain: 0, walletVersion: 'v5r1', subwalletNumber: 0 }' . I will work on this, I discover it. (reply to 133589)

— 2024-12-27 —

m: when tonconnectui wallet connects on ios, I can't track the connection via onStatusChange until the user returns to the browser. maybe you know the solution? (reply to 133614)

Ahamd: Hello friends, I want to write a robot that the user sends some TON and then receives the same amount from me in another currency in Tonkeeper. How can I do it? please help I will also pay for the education  Like the photo above

Sol: Hello everyone! I am looking for a technical specification or task related to developing smart contracts on the TON blockchain. If anyone has ongoing projects or documents describing specific requirements, please share or let me know where I can find one. Thank you in advance!

TKAINU: For example, I have contract A with balance Ton = 0, executing transactions in parallel: - Receive jetton token X with 2 Ton from wallet 1 - When notified of receipt of Jetton X, 1 ton will be transferred from A to wallet 2 So the transferred ton will be taken from the contract, or taken from the ton of wallet 1 transferred to, because when I make the transaction to transfer ton from A to wallet 2, there will be an error of not having enough ton, even though I have received ton from wallet 1 and sent it over. Please help me

&rey: No contract executes anything in parallel; all transactions are serialized. (reply to 133627)

&rey: Please learn from existing swap contracts. (reply to 133623)

&rey: Sounds like iOS problem actually. (reply to 133621)

Anoxy (Wally.id) 😎 ❤️ 😎: Yeah iOS issue it is (reply to 133621)

Oskarcv: hey there is there someone who has a snippet to transfer some jettons ? as of now from tonConnectUi  I have the wallet, also I know the wallet where i want to send some jettons  the issue is that with tonConnect i was gettings some issues to get the transaction going so desided to look into tonweb  just wondering if someone has good documentation link on tonweb or can bring more light into this

Rohit: Hey guys. Does anyone know if Unity based games can be integrated with TMA with WebGL? If yes, what are the limitations?

&rey: Please keep to the chat topic; yours is more suitable for @devs. (reply to 133650)

Rohit: Sorry (reply to 133651)

Дмитрий: Hello! Somebody have problem with testent? When I try to deploy contract, in Tonkeeper confirm transaction, it's loading and then show "Error". I use blueprint and in console show  "UnknownError: [TON_CONNECT_SDK_ERROR] UnknownError java.lang.NullPointerException"

User<8044419537>: Testnet was not working why???

Maxey: Hi everyone,    I'm currently writing gas-related tests, and I've noticed that the numbers I get when running on the sandbox locally are different from those on the testnet. The main difference seems to be in the total_fee field, where the testnet values are consistently higher than my local environment. I suspect this might be due to differences in the blockchain config.    Has anyone tried adjusting the settings to make the local environment match the on-chain configuration?    Would appreciate any insights!

Nerses: As in the TON blockchain, a wallet is also a smart contract, and if it hasn't been used for a long time, the next operation from the wallet incurs higher fees. I want to understand if this behavior also applies to other smart contracts — will the fees be higher if the last call to the contract was a long time ago?

RiSSE: Hello everybody! I get an error when sending usdt jetton, how can I fix it?(   async function sendJettonViaMainWallet({  wallet,  keyPair,  senderJettonWalletAddress,  toAddress,  amountStr,  decimals }) {  const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {    address: senderJettonWalletAddress  });   const jettonAmountBN = toNano(amountStr, decimals);  const forwardAmount = toNano('0.02');   const bodyCell = await jettonWallet.createTransferBody(    toAddress,    jettonAmountBN,    forwardAmount,    ''  );   const walletAddress = await wallet.getAddress();  const balanceNano = await tonweb.provider.getBalance(    walletAddress.toString(true, true, true)  );  const gasNeeded = toNano('0.05');  if (BigInt(balanceNano) < BigInt(gasNeeded)) {    throw new Error(      `You need enough TON. Have: ${fromNano(balanceNano)}, need: ~0.05`    );  }   const seqno = await wallet.methods.seqno().call();   const transfer = wallet.methods.transfer({    secretKey: keyPair.secretKey,    toAddress: senderJettonWalletAddress,    amount: gasNeeded,    seqno,    payload: bodyCell,    sendMode: 3  });   const result = await transfer.send();  console.log(`[sendJettonViaMainWallet] result:`, result);  return 'Jetton TX sent (via main wallet)'; }

Cryo_mil: Ene64byQf4nTZRjWKf3M1RPkQunRUL9C2FQNUQQvpump

Tom: You could try to find the current full config cell from testnet or dump the config you are looking for.  Testnet: https://testnet.tonviewer.com/config Sandbox: const config = parseFullConfig(         loadConfigParamsAsSlice(blockchain.configBase64),       ); (reply to 133672)

RiSSE: unfortunately, it didn't help, maybe it's the usdt address, I'm using EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs.   const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {    address: senderJettonWalletAddress  }); (reply to 133679)

Maxey: It looks like to update the config, I need to use:    blockchain.setConfig(Cell.fromBase64("...config dumped from network..."))    How can I obtain the base64 result from this URL? I don't see this specific field inside. (reply to 133678)

Anoxy (Wally.id) 😎 ❤️ 😎: Doesn't TON have a gasless sending feature for jettons? (reply to 133679)

&rey: That's a not very precise way of putting it, but yes. (reply to 133675)

&rey: TON doesn't. Certain services do, of their good will, offer "paid-by-same-jetton" sending feature. (reply to 133689)

Nerses: could you please elaborate on that in case my description wasnt technically correct ? (reply to 133690)

&rey: Set forward amount to zero. (reply to 133676)

&rey: If contract hasn't been used for a long time, the next operation on it must pay all accrued storage fees which will be higher indeed. That "increase" does not apply to computation/forward/action fees. (reply to 133692)

Maxey: I compared several gas-related fields between the on-chain config and the local config, and they appear to be the same. I suspect that the current version of the sandbox should have the same config as the on-chain version. However, the difference in the total_fee field might be caused by something else. (reply to 133684)

Nerses: Is under the hood in TON blockchain operates Storage daemon for storage or it is just program that can be used for storage management.

𝘼𝙧𝙮𝙖𝙣.🦴: Hello friends, I need a script to buy NFT from getgems. Can you please advise how to do this?

Africhain: I can write for you (reply to 133703)

Nerses: In forward fees is mentioned about IHR and HR mechanisms but there is no reference to them,can someone simply explain what are they or provide any appropriate material for investigation ? https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees-low-level#forward-fees

Anoxy (Wally.id) 😎 ❤️ 😎: Can u tell what services do that? (reply to 133691)

SynthLuvr: Also have been having problems on testnet for the last few hours (reply to 133671)

Assistant ROM: What is this error for? It comes when I request a transaction  at Pb.<anonymous> (index-Do2R8vG4.js:1081:15917)     at Generator.next (<anonymous>)     at index-Do2R8vG4.js:48:1321     at new Promise (<anonymous>)     at yt (index-Do2R8vG4.js:48:1141)     at Pb.sendTransaction (index-Do2R8vG4.js:1081:15437)     at $ (index-Do2R8vG4.js:44:7801)

SynthLuvr: How do we set symbols and names for tokens?

Nerses: fees in TON are calculated as shown in the image from docs.In case I have contract that sending message to it needs high computation cost, can that factor be used for attacking the contract ?

Nerses: I mean deliberately send low amount to cause contract to pay rest of fees

&rey: Until accept_message(), gas is upper-bounded by message value.

&rey: Old JS in browser. (reply to 133725)

Nerses: can you explain more detailed ? (reply to 133732)

Nerses: what will be if 'attacker'  will send enough  funds to reach accept_message() but not enough for full successful tx ? (reply to 133732)

&rey: Then, indeed, contract will pay. But I should note that most of contracts don't use accept_message() at all. (reply to 133735)

Nerses: so the contracts which use accept_message() it is highly possible way to be attacked ? (reply to 133736)

&rey: Yes; most often they call accept intentionally. (reply to 133737)

Nerses: can you refer to any docs for later investigation of accept_message() ? (reply to 133738)

&rey: I can refer to https://docs.ton.org now that search works there. (reply to 133739)

SynthLuvr: Testnet is still down. Who's responsible for it?

SynthLuvr: Hmm maybe it's not a problem with testnet but the API server used by TonKeeper 🤔

SynthLuvr: On mainnet Tonkeeper is working fine

SynthLuvr: I see transactions on testnet going through via TON Wallet

SynthLuvr: Ok yes other testnet wallets are working fine, just Tonkeeper on testnet is currently not working

— 2024-12-28 —

User<7218809845>: Hi 👋  I’m trying to retrieve wallet transactions using the LiteBalancer node with your example code which is :  https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py but I’m facing this error:  Traceback (most recent call last):   File "/root/tr.py", line 19, in <module>     asyncio.run(main())   File "/usr/lib/python3.10/asyncio/runners.py", line 44, in run     return loop.run_until_complete(main)   File "/usr/lib/python3.10/asyncio/base_events.py", line 649, in run_until_complete     return future.result()   File "/root/tr.py", line 9, in main     trs = await client.get_transactions(address='EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG', count=3)   File "/usr/local/lib/python3.10/dist-packages/pytoniq/liteclient/client.py", line 788, in get_transactions     tr_result, _ = await self.raw_get_transactions(address, amount, from_lt, from_hash)   File "/usr/local/lib/python3.10/dist-packages/pytoniq/liteclient/client.py", line 747, in raw_get_transactions     result = await self.liteserver_request('getTransactions', data)   File "/usr/local/lib/python3.10/dist-packages/pytoniq/liteclient/client.py", line 288, in liteserver_request     return await self.liteserver_query(data, qid)   File "/usr/local/lib/python3.10/dist-packages/pytoniq/liteclient/client.py", line 280, in liteserver_query     raise LiteServerError(result["code"], result["message"]) pytoniq.liteclient.client.LiteServerError: Liteserver crashed with -400 code. Message: cannot compute block with specified transaction: cannot find block (0,6f5bc67986e06430) lt=51195781000001: lt not in db  Could you help me resolve this?

Andrei_ka: hi, i am working on a jetton presale app, next step is to add nft and exchange for usdt , you can find project repo here : https://github.com/ffx-crypto , i will be glad for your feedback (reply to 133626)

&rey: Didn't happen for me actually. Try LiteServer with ls_index=2 instead of balancer. Use trust_level=0. Try accessing liteservers from another location. (reply to 133815)

fade: has anyone been experiencing constant out of sync issue since the december 17 node update?

fade: it seems like the liteserver couldn't handle the same amount of traffic after the update, so sometimes it overloads or something, causing out of sync

T: There is Russian speaking chat for devs, you can find it in search (reply to 133849)

vahid: Hi everyone, I'm using Quasar with the @townsquarelabs/ui-vue library to integrate TonConnect into my app. However, I keep running into build issues. Specifically, errors like: "default" is not exported by "src/App.vue?vue&type=script&lang.ts"  Has anyone encountered similar problems with this library in Quasar? How did you resolve them? Any help would be greatly appreciated. Thanks! 😊

&rey: Seems like you have forgotten to convert TON amount to indivisible (that is, multiply by 10**9). (reply to 133870)

&rey: Well now I'd guess contract expects another payload scheme, something like query ID. (reply to 133877)

𝑀𝑢𝑘𝑒𝑠ℎ: Some Mini-App Developers has created wallet drainers.   And stealing everything in wallet with just one swipe. Which is kind of sad.

User<7218809845>: import asyncio import binascii from pytoniq import LiteBalancer, Address  async def main():     async with LiteBalancer.from_mainnet_config() as client:         address = 'UQCgsde7Nqs7lHHoHDv-SxaZsozWBQ0CwtrzV7OOqa77o1bA'         count = 50          transactions = await client.get_transactions(address=Address(address), count=count)         # print(len(transactions))         for i in range(len(transactions)):             transaction = transactions[i]             # print(transaction)             print("hash: ", binascii.hexlify(transaction.prev_trans_hash).decode())             print("source:", str(transaction.in_msg.info.src))             print("destination: ", str(transaction.in_msg.info.dest))             try:                 value_ton = transaction.in_msg.info.value_coins / 10**9             except:                 value_ton = "Error"             print("Value (TON):", value_ton)             print("-" * 40) if __name__ == '__main__':     asyncio.run(main())    Hello everyone, In the code above, I am using transaction.prev_trans_hash to retrieve the transaction hash, but it seems to give me the hash of the previous transaction rather than the current one.  I’m not sure what attribute or method I should use to get the hash of the current transaction instead. Could anyone guide me on how to retrieve the current transaction hash properly?  Thank you!

&rey: transaction.cell.hash (reply to 133893)

User<7218809845>: how can I get the LT and block info for each transaction with pytoniq? (reply to 133895)

&rey: 1. transaction.lt 2. should be given along the transaction object (reply to 133897)

N. T.: Hi, How can i build a ton explorer similar ton viewer or ton scan?

Bobby: parse transctions to db and create a trransaction api for browser.

Bobby: and then

Bobby: you can do that

Iřřøďẽr: Why?

Knight: so many scammers

Zoro: can someone help me verify the source code to ton verifier deployed using toncli?

Zoro: what is the procedure, the souce code and onchain code hash not matching.

User<7218809845>: thank you for daleget (reply to 133898)

User<7218809845>: How can I decrypt this cipher_text using the private key or whatever else is needed?   If someone can help me out, I'll send them 10 TON as a reward.

WhyesCode: Let's see (reply to 133965)

&rey: Here's the relevant docs section. https://docs.ton.org/v3/documentation/smart-contracts/message-management/internal-messages#messages-with-encrypted-comments  Do you need link to specific script if I can find it? (reply to 133965)

&rey: I'd expect you are using different FunC version. (reply to 133935)

User<7218809845>: how should I decrypt it with python? (reply to 133968)

&rey: I'm not sure; you can port it from https://github.com/toncenter/ton-wallet/blob/master/src/js/util/encryption.js. (reply to 133970)

User<7218809845>: 15 Ton (reply to 133965)

Oskarcv: Hi there, I've been reading the documentation (https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons) and also  https://github.com/toncenter/tonweb having the tonweb 0.0.66 the code looks something like this    * jetton    */    const jettonWalletAddress = new TonWeb.utils.Address("E....7");   const destinationAddress = Address.parse('UQB...6');    const provider = new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC');   const tonweb = new TonWeb(provider);    // Define the wallet A and wallet B addresses const walletAAddress = wallet;  // Address of Wallet A (sender) const walletBAddress = 'UQ........6';  // Address of Wallet B (receiver) const jettonMasterAddress = 'EQBt.......7'; // The address of the Jetton master contract const jettonAmount = 1000000000; // Amount of jettons to send (in nanoTON, i.e. 1 TON = 1e9 nanoTON)  // Create a wallet object for Wallet A (sender) const walletA = tonweb.wallet.create();  // Get the Jetton master contract for transferring jettons const jettonMaster = new TonWeb.contract.jetton.JettonMaster(jettonMasterAddress);  // Create the transfer payload (data for transferring jettons) async function createTransferPayload() {   // Create the transfer payload to send jettons from Wallet A to Wallet B   const transferPayload = await tonweb.contract.jetton.JettonMaster.createTransferPayload({     recipient: walletBAddress, // Wallet B address     amount: jettonAmount, // Amount of jettons to send     senderWalletAddress: walletAAddress, // Wallet A address (sender)   });    return transferPayload; }  // Function to send jettons from Wallet A to Wallet B async function sendJettons() {   try {     const transferPayload = await createTransferPayload();          // Send jettons from Wallet A to Wallet B     const transaction = await walletA.methods.transfer({       destination: jettonMasterAddress, // Jetton master address       value: 100000000, // Transaction fee (in nanoTON)       body: transferPayload, // Transfer payload     }).send();          console.log('Transaction successful:', transaction);   } catch (error) {     console.error('Error transferring jettons:', error);   } }  at this point im totaly lost  is there someone who can point me into the right direction ?

&rey: https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons#send-jettons-with-comment contains things you might need. (reply to 134006)

— 2024-12-29 —

Oskarcv: Really appreciate your hint will spend some time there 🙏 (reply to 134009)

Isabella: Can someone provide an example of how to encrypt a TON transaction comment using Tonweb?

Wild Wolf: // First, make sure TonWeb is imported const TonWeb = require('tonweb');  // Initialize TonWeb with your endpoint const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));  async function sendTransactionWithMemo(fromWallet, toAddress, amount, memo) {     try {         // Convert amount to nanotons (1 TON = 1,000,000,000 nanotons)         const amountNano = TonWeb.utils.toNano(amount);          // Prepare the transaction         const transaction = {             to: toAddress,             value: amountNano,             seqno: await fromWallet.methods.seqno().call(),             // Add memo to the transaction payload             payload: TonWeb.utils.stringToBytes(memo),             // Send all remaining balance             sendMode: 3,         };          // Create and send the transfer         const transfer = await fromWallet.methods.transfer(transaction);         const sendResult = await transfer.send();          return sendResult;     } catch (error) {         console.error('Error sending transaction:', error);         throw error;     } }  // Example usage: /* const wallet = new TonWeb.WalletClass(tonweb.provider, {     publicKey: 'your_public_key',     wc: 0 });  const toAddress = 'EQD...'; // Destination address const amount = '1.5'; // Amount in TON const memo = 'Payment for services'; // Your memo message  sendTransactionWithMemo(wallet, toAddress, amount, memo)     .then(result => console.log('Transaction sent:', result))     .catch(error => console.error('Failed to send transaction:', error)); */ (reply to 134045)

Isabella: Could you elaborate on how the memo is being encrypted in the transaction payload? (reply to 134053)

&rey: Here it is (from a few messages above): https://github.com/toncenter/ton-wallet/blob/master/src/js/util/encryption.js (reply to 134045)

Sol: Looking for Clients: Smart Contract Development for TON  Are you looking to bring your blockchain project to life on the TON (The Open Network)? I specialize in the development of high-quality, secure, and efficient smart contracts tailored to your needs.  What I Offer:  • Smart Contract Development: Expertise in FunC, TACT, FIFT, and Blueprint for custom solutions.  • NFT Projects: Development, deployment, minting, and transfer of NFTs on TON.  • Optimization & Debugging: Troubleshooting and improving existing contracts for better performance.  • Deployment Assistance: Complete guidance on deploying contracts to the TON blockchain.  Why Choose Me?  • Deep understanding of TON’s architecture and tools.  • Proven experience in blockchain and smart contract development.  • Clear communication, detailed explanations, and step-by-step support.  • Commitment to delivering high-quality, secure, and scalable solutions.  Let’s Collaborate!  Whether you’re building a decentralized application, launching an NFT collection, or exploring innovative use cases for smart contracts, I’m here to help.  Contact me today to discuss your project requirements and how we can bring your ideas to life on TON!

&rey: Would you care to prove your expertise?  The test question is: 1) given a game server that wants to increase players' score (aka mint more jettons to them), 2) given that number of players may be quite high so we want users to pay for recording score in blockchain, 3) given a feature that users should be able to record several victories at once, using one transaction tree (to save on gas), how can this scheme be built? (Btw there is an ideal answer.) (reply to 134088)

Mr Radikali: I create token from tact lang Jetton in github when I mint again its said failed

&rey: Only by invoking a corresponding get-method. (reply to 134117)

Joker: Help me, please! Anywhere presence example of ts/js wrappers for getgems contracts? In their repo (https://github.com/getgems-io/nft-contracts) used very old versions of libraries, that not compatible with latest ton boilerplate stuff. And their repo is too complicated...

Tvoja 🐸: Hello, I completed the course and put my telegram handle and wallet at the end, when can I expect sbt?

— 2024-12-30 —

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 56 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 25  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Portukali: Anybody knows how can i trade on blum with javascript?

RM: Hey , i want to run TON testnet validator . i want testnet coins for that . I used testgiver ton bot , but i get just 2 ton/hour , which is not sufficient to run the validator . How can i get 10,001 test Grams so that i can start my validator

slavagm: You can buy it at TonConsole (reply to 134262)

RM: I want that for testnet . Can you please share the link (reply to 134263)

slavagm: https://tonconsole.com/ Buy testnet TON here (reply to 134264)

Sachin: Hi all,   Co-founder of levelq.finance   We re looking for additional SC devs to help us build out our vault strategies

— 2024-12-31 —

William: Hi guys when I wanna transfer ton to another address , I keep facing thus error : Transfer failed: Liteserver crashed with 0 code. Message: cannot apply external message to current state : Failed to unpack account state   any solution?

Tuan: Hello everyone, I’d like to ask if anyone in the group has worked on a tap game before. I’m not sure how to design the tap => score increase mechanism to make it reasonable. I currently have two options:  Use WebSocket => the front end sends an event every time the user taps => the backend increases the score. Use HTTP to increase the user’s score => the front end saves the score locally and only sends it to the backend via HTTPS when the session ends. Does anyone have any better suggestions? Thank you very much!

Hamit: Hello  How does the TON Bridge exactly work? I have custom tokens on ETH. Can I bridge them just by using https://bridge.ton.org/?

Vanshika: Hi Everyone, can anyone please tell what is the avg TON required to become a testnet validator on TON Network

&rey: I doubt you'll be able to become a validator with less than 4.5M on testnet; see https://testnet.tonviewer.com/config#34. (reply to 134376)

Vanshika: 4.5M? As in 4.5 million? (reply to 134377)

User<7218809845>: whats the benefit (reply to 134376)

Vanshika: Not sure what do you mean by benefit Just wanted to test some things out in testnet so that we could move to mainnet (reply to 134383)

&rey: FYI mainnet validators also have to provide a large stake. (reply to 134384)

William: @pcrafter  Hi can you help me pls? (reply to 134346)

&rey: Please have happy holidays! (reply to 134393)

William: wish u a happy holidays too bro but it's 911 I will really appreciate it if you can help me (reply to 134394)

William: just take a look at this error I'm using pytoniq (reply to 134346)

&rey: A specific transfer script? (reply to 134396)

William: from pytoniq import LiteBalancer, WalletV4R2, begin_cell,Address from functions import wallet_gen import asyncio import time import json  mnemonics = [             "test",         ]   async def wallet_transfer(wallet, destination, amount):     state_init = None      try:         wallet_seqno = await wallet.get_seqno()     except Exception:         # Wallet is not initialized; set seqno to 0 and get state_init         wallet_seqno = 0         state_init = wallet.state_init      # Create the internal wallet message     wallet_message = wallet.create_wallet_internal_message(         destination=destination,         send_mode=3,  # 2 for ignore errors, 1 for sender pays fee         value=amount,         body=begin_cell().end_cell(),  # Empty body for simple transfer         state_init=None,     )      # Create the transfer message     transfer_msg = wallet.raw_create_transfer_msg(         private_key=wallet.private_key,  # Use wallet's private key         seqno=wallet_seqno,         valid_until=int(time.time()) + 3600,  # Message valid for 1 hour         wallet_id=wallet.wallet_id,         messages=[wallet_message],     )      # Create the external message including state_init if needed     message = wallet.create_external_msg(         src=None,         dest=wallet.address,         import_fee=0,         state_init=state_init,         body=transfer_msg,     )      # Serialize and send the message     serialized_message = message.serialize()     message_boc = serialized_message.to_boc()     await wallet.provider.raw_send_message(message_boc)     print(f"Transfer message sent. TXID: {serialized_message.hash.hex()}")   async def main():     with open("wallet.json", "r") as file:         wallets = json.load(file)     wallets_list = list(wallets.keys())      provider = LiteBalancer.from_mainnet_config(2)     await provider.start_up()      # Initialize wallet     wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)       for _id in wallets_list:          try:             provider2 = LiteBalancer.from_mainnet_config(2)             provider3 = LiteBalancer.from_mainnet_config(2)             await provider2.start_up()             await provider3.start_up()             print(_id)             temp_wallet = await wallet_gen(_id)             account_wallet_address = Address(wallets[_id]['address'])             temp_wallet_address = Address(temp_wallet['address'])             temp_wallet_mnemonics = temp_wallet['mnemonic']             account_wallet_mnemonics = wallets[_id]['mnemonic']             twallet = await WalletV4R2.from_mnemonic(provider=provider2, mnemonics=temp_wallet_mnemonics)             account_wallet = await WalletV4R2.from_mnemonic(provider=provider3, mnemonics=account_wallet_mnemonics)             cpt = Address("test")             # Transfer 0.01 TONs to the wallet itself             await wallet_transfer(                 wallet=wallet,                 destination=temp_wallet_address,                 amount=int(10**9 * 0.13),  # 0.13 TON in nanotons             )             print(f"Transfer1 completed successfully. 0.13Ton from: {wallet.address} to: {temp_wallet_address}\n")             time.sleep(60)             await wallet_transfer(                 wallet=twallet,                 destination=account_wallet_address,                 amount=int(10**9 * 0.115),  # 0.115 TON in nanotons             )             print(f"Transfer2 completed successfully. 0.115Ton from: {twallet.address} to: {account_wallet_address}")             time.sleep(60)             await wallet_transfer(                 wallet=account_wallet,                 destination=cpt_contract,                 amount=int(10**9 * 0.1),  # 0.1 TON in nanotons             )             print(f"Transfer3 completed successfully. 0.1Ton from: {account_wallet.address} to: {cpt_contract}")          except Exception as e:             print("Transfer failed:", e)             with open("fail.txt", "a") as fail_file:                 fail_file.write(f"{_id}\n")             time.sleep(10)

William:           finally:             await provider2.close_all()             await provider3.close_all()          print("-------")     await provider.close_all()  asyncio.run(main())

William: @pcrafter  here (reply to 134397)

&rey: Using multiple `provider`s is strange and not guaranteed to work IIRC. (reply to 134398)

William: oh ok so what should I do instead? (reply to 134402)

&rey: Use single provider. (reply to 134403)

&rey: Also, which specific transfer raises that error?

William: I faced an error (sometimes) when I used single provider (reply to 134404)

William: it's random  sometimes it's OK, but most of the times it gives me this error: Transfer failed: Liteserver crashed with 0 code. Message: cannot apply external message to current state : Failed to unpack account state (reply to 134405)

&rey: Your message doesn't look like an error because it shows no traceback. (reply to 134407)

William: right , but it won't transfer the TON (reply to 134408)

&rey: I meant "show the traceback" actually. I also have questions for why you generate address in wallet_gen function instead of taking it from wallet wrapper with twallet.address. (reply to 134409)

William: nope I think u misunderstood  this is generating new wallets (reply to 134410)

William: it works like this: transfer from wallet_1 to wallet_2 transfer from wallet_2 to wallet_3 transfer from wallet_3 to wallet_4

William: when I use single provider :  Transfer failed: Liteserver crashed with 0 code. Message: cannot apply external message to current state : Failed to unpack account state (reply to 134404)

&rey: Well I haven't misunderstood, and you're essentially doing the following. import pytoniq_fixes.uninit_seqno_zero  from pytoniq import LiteClient, WalletV4R2, begin_cell, Address from functions import wallet_gen import asyncio import time import json  root_mnemonics = [             "test",         ]   async def main():     with open("wallet.json", "r") as file:         wallets = json.load(file)      provider = LiteClient.from_mainnet_config(ls_index=2, trust_level=1)     await provider.start_up()          root_wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=root_mnemonics)     root_address = root_wallet.address.to_str()          for (wid, info) in wallets.items():         try:             print(wid)                          temp_wallet_mnemonics = (await wallet_gen(wid))['mnemonic']             temp_wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=temp_wallet_mnemonics)                          mid_wallet_mnemonics = info['mnemonic']             mid_wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mid_wallet_mnemonics)                          mixed = Address('test')                          await root_wallet.transfer(destination=temp_wallet.address, amount=int(0.13e9))             print(f'Transfer1 successfully attempted to initiate. 0.13 TON from: {root_address} to: {temp_wallet.address.to_str()}\n')             time.sleep(60)             # unsafe {std::hint::assume_unchecked( <transfer 1 actually started> );}             # unsafe {std::hint::assume_unchecked( <conditional on transfer starting, it has already arrived> );}                          await temp_wallet.transfer(destination=mid_wallet.address, amount=int(0.115e9))             print(f'Transfer2 successfully attempted to initiate. 0.115 TON from: {temp_wallet.address.to_str()} to: {mid_wallet.address.to_str()}\n')             time.sleep(60)             # unsafe {std::hint::assume_unchecked( <transfer 2 actually started> );}             # unsafe {std::hint::assume_unchecked( <conditional on transfer starting, it has already arrived> );}                          await mid_wallet.transfer(destination=mixed, amount=int(0.1e9))             print(f'Transfer3 successfully attempted to initiate. 0.1 TON from: {mid_wallet.address.to_str()} to: {mixed.to_str()}\n')          except Exception as e:             print('Transfer failed:', e)             with open('fail.txt', 'a') as fail_file:                 fail_file.write(f'{wid} : {e!r}\n')             time.sleep(10)          print('-------')     await provider.close_all()  asyncio.run(main()) (reply to 134411)

&rey: These four assumptions I indicated are not true in general.

&rey: Btw if you're creating intermediate wallets you can initialize them along with sending some TON in.

William: it won't initialize just by sending some ton in it  I couldn't do this (reply to 134416)

&rey: Well, what if you set StateInit in internal message? (It won't help with your issue but is cleaner overall.) (reply to 134417)

&rey: The fastest fix is to submit external message to TonAPI along with LiteClient.

William: my messages keep deleting

William: but It doesn't matter for now  I need the error to be fixed

William: what external message? and what should be inside the message? (reply to 134426)

&rey: also submit to TonAPI (reply to 134398)

William: I didn't understand... (reply to 134432)

Albert: https://github.com/toncenter/examples/blob/e8a694e6b1890cb432a7db6653c29f48d30e7c39/deposits-jettons.js#L126 (reply to 117310)

User<6149564930>: I have a ton wallet and it fails any transactions I try to make because someone else has access to it and he cam do the transactions only. When he does. It's always with some contract added to the transactions. How can I regain my acces and send my funds in it?

User<6149564930>: basically the other owner deployed a contract on the wallet that restricts transactions. and now only he can do transactions which means I cannot move my funds in the wallet to another

William: I’m working on a process that involves transferring TON coins sequentially across multiple wallets. For each transfer, I need to set the trust level to 0, but this step takes about a minute to process, which slows down the workflow.

&rey: This endpoint: https://tonapi.io/v2/liteserver/send_message. (reply to 134439)

&rey: Thank you for noticing a chat issue; it has been fixed.

— 2025-01-01 —

TON Bounty Bridge: ​TON Academy: Gamified Education  🏷 Education  Summary:A gamified platform that helps users learn the TON ecosystem with interactive lessons, animations, q...  Created by mohammadjafarinejad

Vanshika: Hi, we have TON explorer which allows to see elections participants, locked stakes in current election. Is there any way we can see previous election details?

RM: Hi everyone,  What is the amount of testnet ton coins that needs to be staked , so that the validator is elected and participates in the validation process

Dmitry | backend4you.ton: Check next one message above yours - it’s highly possible that that explorer has testnet version too. (reply to 134524)

Ron: Hello  I created an in-game payment in my mini app that allows users to pay for some particular assets . Anytime they try to pay it keeps saying "unable to verify transaction " what could be the cause?

PNT: Check the time on this pc (reply to 134529)

Kami: hello happy new year we are connecting ton blockchain to our app, the problem is that after clicking on connect the user goes to a page where after clicking on tonkeeper to open it gives the above error that  We have sent pictures, what to do to open Tonkeeper directly? can you help me thank you

&rey: It sure seems like Tonkeeper is not installed on their machine. (reply to 134577)

Kami: They installed it, but when you click on ToneKeeper, it should enter ToneKeeper, but it happens like this (reply to 134598)

TON Bounty Bridge: ​Message Modes Cookbook improvement  🏷 Education  Summary:https://docs.ton.org/v3/documentation/smart-contracts/message-management/message-modes-cookbookto be...  Rewards: • $800 in TON equivalent • Standard TON Footsteps NFT  Created by ProgramCrafter

— 2025-01-02 —

KB: Hello, everyone.  Does anyone of you know how to prefill receiver address and TON amount for the deep link of @wallet? https://t(dot)me/wallet?startapp=send-ton

Hashim: HI Dev i need help i want to connect ton wallet, telegram,  bitget in my flutter based app that link with minibot but i do not know how to add this like in blum when we click on connect wallet it auto redirect to user wallet and connect on adress

&rey: I believe you want TON Connect 2: https://docs.ton.org/v3/guidelines/ton-connect/overview. (reply to 134615)

KB: Thank you for answering! Will also look for alternatives to achieve it. (reply to 134611)

Ahamd: How can I write a receive transaction with ton connect ui?

Ahamd: @pcrafter (reply to 134618)

&rey: TC2 only ever specifies the first message — what user sends. Wallet apps may provide best-effort simulation showing what smart contracts will do in response to that message. (reply to 134618)

Ahamd: Can you explain more, I am a beginner or a document (reply to 134620)

Ahamd: Do you have a sample code? (reply to 134622)

&rey: Please wait for my response:

Ahamd: I want to set up a wallet that contains a number of notcoins and divide it among my users (reply to 134618)

&rey: "write a receive transaction" seems totally misguided. "Divide existing assets among ..." is, on the other hand, totally clear.  TON Blockchain is set of "smart contracts" — programs with some TON balance and persistent data. (Users' wallets are smart contracts as well.) They interact by sending messages to each other; each transaction happens on exactly one contract, consisting of handling one incoming message and possibly sending some out.  Wallet apps show that something will be received iff that is shown by contract emulation (that is, when user confirms TC2 operation, the resulting transaction tree would involve user receiving something). (reply to 134626)

Hashim: I want to connect in flutter but i cannot understand this on ton web if you share code or guide step by step (reply to 134616)

&rey: What's the approximate number of users? 255? 10k? (reply to 134630)

ʟɪɢʜᴛ: Is learning TON smart contract development worth it? Can it lead to good income in USD?

&rey: It is possible to earn a large amount but being attracted to some industry only because of high income is misguided in most cases. Answering in more detail would require to know what projects you want to see built and working. (reply to 134640)

Tea the Bottle: Im minting nft and boss said fee is too high

Tea the Bottle: Is there any way to reduct this fee when call contract ?

&rey: forward this back: What funds will be used to pay for NFT storage, if not those provided to deploy it? (reply to 134646)

Tea the Bottle: isnt it send with 0.05 part ?

Tea the Bottle: boss asking about 0.1 fee

Tea the Bottle: and I found not any way to modify that fee

Tom: Well, basically you could specify the total value of TON and the send mode. (reply to 134651)

Tom: Could you give us the transaction hash to look at?

Tea the Bottle: await nftCollection.send(         provider.sender(),         {             value: toNano('0.09'),         },         {             $$type: 'Mint',             query_id: nextItemIndex,             nft_content: nftContentCell,             receiver: address('0QCKRPwJ-dnYG1YmfM5-1cXeufbXgUR37JrmQwfdv-uI9wLU')         }     );

Tea the Bottle: just changed 0.05 to 0.09 for testing]

Tea the Bottle: this is a success transaction which fully deplot new NFT

Tea the Bottle: 62e1007fddc7652631042e39bc7a94e8f06d11e1304b56487596063c200ec1cd

&rey: Those fees for transferring data over messages are indeed that high. Check "value flow" tab. (reply to 134650)

Tea the Bottle: it's for total fee of  the data was send over network, right ? (reply to 134662)

Tea the Bottle: I understand problem

&rey: Well, you can also reduce computation fees (I believe ~in half) by using FunC instead of Tact.

Tea the Bottle: I'm using ryanamaral Tact template

&rey: that might save 0.007 TON

Tea the Bottle: she send all data from local, so that minting is high

Tea the Bottle: image blob was send when minting

&rey: Please try sending the image directly to NFT instead of through collection, that will cut forward fees in half. That's some architecture problem I guess.

Tea the Bottle: so create NFT first then send image to NFT latter ?

&rey: That choice is on you. Or "deploy NFT with image first, approve it through collection later". Mind message order: A —> C —> B may be executed before A —> B even if A first sends message to B and then to C in the same transaction. (reply to 134671)

Tea the Bottle: understand, thank you

Anton: You can also use the current main branch of Tact to reduce computation fees, btw. Might give you an improvement of about 1.5x (reply to 134663)

Tea the Bottle: thank you, I solved problem. (reply to 134670)

Minimal ☄️: Did anyone got Context must be an activity exception while trying to sign transaction on TonKeeper, on testnet?  I am getting this exception on Android, iOS and PCs (win 11).  I am unable to reproduce it since it's happening in seemingly random times.

jennifer [afk]: retrieve all holders of jetton, then analyze all transactions on jetton_wallet of the addresses. (reply to 134709)

jennifer [afk]: just check opcodes (reply to 134712)

fade: If you're not familar with TON, you're better off just using geckoterminal (or other screener) api for that (reply to 134709)

fade: i havent used tact at all, is it really that unoptimized? (reply to 134665)

&rey: It makes unnecessary assertions about address validity, and some other things. (reply to 134721)

fade: i guess the stack is unoptimized too? func already shuffling the stack a lot, i imagine tact would be worse (reply to 134722)

TON Bounty Bridge: ​Blum  Created by abdullahplagunju

WhyesCode: Could you provide more examples of the expected output format for the summarized data? (reply to 134709)

Assistant ROM: Can anyone help with this error?

Daniel: Hello! I’m working on a contract with payout distribution. With each sale, the number of historical owners increases by one. So, on the first sale, the first owner gets the full 10%, on the second sale, they get 5%, on the third sale, 3.33%, and so on.  It seems better to have people claim their rewards from the contract themselves (since there could be more than 255 addresses). However, this would require storing their balances in a dictionary, and iterating through the list to update the balances after each sale might not be optimal.  Help me with the architecture 🙏

fade: how about storing the balance data in a separate contract for each of your user? like how stonfi v2 vault works for the collected referral fee (reply to 134742)

César: Hello someone can help me with a basic tact function?

César: I am trying to make a smart contract in tact:  - Function to deposit a jetton token in the contract. - OK  - Function to withdrawal a jetton token from the contract - I dont see any in the docs.  Its no possible?

&rey: To do that contract simply sends transfer order to its jetton wallet. (reply to 134747)

César: You have some example? (reply to 134748)

&rey: Yes. Haven't you got one? Anyways, here you are: https://docs.tact-lang.org/cookbook/jettons/#sending-jetton-transfer. (reply to 134749)

César: Yes, already see it, I come from solidity and I dont understand sorry.  But here where you specify the token to send, if for example in contract you have several tokens?

&rey: You may be interested in this: — jetton balance is stored in a separate contract for each (owner,jetton master) pair — only owner can transfer or burn their jettons — jetton wallet can be deterministically derived onchain — from master code+data or from jetton wallet code+format (if jetton to work with is known in advance) (reply to 134751)

César: send(SendParameters{             to: self.myJettonWalletAddress,             value: JettonTransferGas,             body: JettonTransfer{                 queryId: 42,                 amount: msg.amount,                 destination: sender(),                 responseDestination: sender(),                 customPayload: null,                 forwardTonAmount: 1,                  forwardPayload: rawSlice("F")             }.toCell(),         });  For example here I dont understand if the smart contract have severals tokens, where input the one i want withdraw (reply to 134750)

&rey: You'll need to specify the jetton wallet corresponding to token you want to transfer. Other tokens have other addresses there. (reply to 134753)

César: I want: I deposit a tokens in a smart contract, then i want any user can call a function to whitdraw the tokens he want.   Its possible? (reply to 134754)

César: Then the smart contract will create a JettonWalletAddress for each token i will deposit.  Then user will need input the JettonWalletAddress he want

&rey: I'd advise to choose one specific user and transfer all jettons to them directly; at least, that's what will happen inevitably. (reply to 134755)

César: its just a test for other contract i want to do

&rey: Here: https://testnet.tonviewer.com/kQBH_4zezLWdjxdnXHcmK-flGHDIc1VoHj4VtDxN4LyWDQM9/jetton/kQBH56r1DMumiHLzLH7iL-pmH6h4b0986cRpod1fJMw_4M42  (kQBIjRegFR4y8JXr1TLjxM049D8FROPLPhtw4jOLqxwzVlkh is the address you want)

César: I see yes

— 2025-01-03 —

ilya: Hi. Looking for a feedback from TON community. Please, have a look and leave a comment! The project is Bitcoin Lightning Bridge.  https://questbook.app/dashboard/?chainId=10&grantId=65c7836df27e2e1702d2d279&proposalId=676f359b8f4a6bf405a2fac5&role=builder

&rey: I'd like to note that Everscale and TON are not same; it would help to clarify which blockchain you're building for.  Also, I (personally) can't reconcile ideas of simple HTLC and $40K funding. (reply to 134784)

ilya: Thank you for suggestion. Yes, you are not the same. I will try to make it more clear  What do you mean you can't? Is it too expensive for you? (reply to 134792)

&rey: I'm just a smc developer, but I'd expect to see $900-$3000 payment requested/given for writing HTLC contract. (reply to 134794)

ilya: I probably should expand on that part. While HTLC contract alone is very small, it is being integrated into Lightning network client which should interact with TON network, besides normal operations related to LN/BTC. And everything altogether must be packaged into web3 app on user's side.   So it is quite cheap to me. (reply to 134795)

JinHyoung: Hi, I'm a developer currently working on a Pool contract on the TON blockchain.  I would like to seek the community's opinion regarding the fee handling mechanism in the contract.  I'm considering two approaches:  Returning all remaining fees to users after deducting minimum storage costs from transactions Retaining a portion of fees (e.g., 5-10%) in the Pool contract for operational purposes I have several questions regarding this:  Which approach would be more appropriate for sustainable DeFi protocol operation? If we retain a portion of the fees, what would be a reasonable percentage to maintain? What are the advantages and disadvantages of each approach, and what issues might arise during actual operation? If anyone has experience operating similar Pool contracts, I would appreciate hearing about your experiences. I hope to find better direction through the community's feedback. Thank you.

&rey: A primary choice would be to hold something on scale of 0.2-1.0 TON on pool contract, and using TON in transfer requests to fulfill swaps only. (However it so happens that if you don't give portion of fees to liquidity providers, you have too few providers...) (reply to 134797)

JinHyoung: Thank you for your insightful response. (reply to 134798)

Hashim: HI Dev i need help i want to connect ton wallet, telegram,  bitget in my flutter based app that link with minibot but i do not know how to add this like in blum when we click on connect wallet it auto redirect to user wallet and connect on adress share code

Mubaraak: First you have to cancel the connection on your wallet, Then connect it to ton space, use VPN (reply to 134802)

TON Bounty Bridge: ​Telegram Mini Apps Starter Kit for TON Ecosystem on Replit  🏷 Developer Tool  Summary:A comprehensive, ready-to-use starter kit for developers to create Telegram Mini Apps on Replit plat...  Rewards: • 400 USD  Created by anuragasawa20

Ippolito: Any examples to send transaction using python? i’ve already tried this but it’s saying the mnemonic is invalid while it’s actually correct. Help please

Amir: Hello, I want to learn how to write a smart contract, I want to make something like this, can someone help me?

AmirhN: Have u tried tonutils? (reply to 134840)

Ippolito: Not yet, do you mind sending an example? Thanks! (reply to 134846)

AmirhN: Tonutils lib has many examples in the repo and readme 😁 (reply to 134847)

دی دی پرایم: Is there any cloud storage app on TON?

Ippolito: doing the transaction using pytonlib leads to this error:  -1 Not enough funds  I’m passing the amount in nanotons and i have enough funds in the wallet. What’s this error??

— 2025-01-04 —

Алина: This is in_msg of a transaction, left - obtained via TON API, right - obtained via raw transactions from a liteserver. Why are these different?

&rey: BOC can be serialized in different ways. Check cell hash to test for equality. (reply to 134926)

Алина: 😯 it worked. Thanks! (reply to 134928)

&rey: It's not generally possible to trace something in node spaghetti-code but IIRC any timestamp within 10s can be chosen, otherwise catchain consensus will fail. (reply to 134932)

&rey: Well the block is generated, then it must be sent to other validators, then signatures must be collected from across all the Earth. After that, block must be referenced in masterchain, the same procedure must repeat. (reply to 134935)

IMAN: what was that word? (reply to 134943)

jennifer [afk]: must be f r e e (reply to 134944)

IMAN: thx (reply to 134946)

Jorsh: Ton connect is working now in react 19 ?

jennifer [afk]: hi everyone, is it possible to decode message payload (boc in base64)? and manage it as begincell?

Nick: Hi there, don't you know guys how to get a query id from hight wallet v3?  I'm using HighloadWalletV3 from tonkite JS lib. It requires to use query id sequence. After every transaction I have to incriminate it to make it work. I don't want to store it in DB, so is it possible to fetch it by API or from lib somehow?  const queryIdSequence = HighloadWalletV3.restoreSequence(21)  UPD: ok I've got the answer. I got this code and just after getting op I added const queryId = body.loadUint(64); and got it

Thomcrypto: Hello 👋

Ippolito: ? (reply to 134866)

T: hi everyone, i deployed a jetton master contract, can let it support mintless jetton feature?

PetX: I want to build an NFT upgrade system and I need a robot and its contract. How do I get it? For my project

x_x: Hi, Happy New Year! Can we discuss about that? I can't DM you. :) (reply to 135004)

2happy: Where i can get testnet usdt? I need to test 6-decimal token.

Daniel: You can launch you own Jetton in testnet with 6-decimals because there is no official one (reply to 135025)

2happy: i found this https://testnet.tonviewer.com/kQC4TQ2VgbnM9ZNdtPTg4HtILfTWhx45le1yWZPfPQqA6A-x?section=holders (reply to 135026)

Daniel: Its just a Jetton for testing purposes, but you can’t mint it for yourself (reply to 135027)

2happy: okey, thanks (reply to 135028)

Daniel: Try this one https://t.me/testnet_usdt_giver_bot (reply to 135029)

Daniel: It’s just a jetton with 6 decimals but it has a giver bot so you don’t need to launch your own token

2happy: That's what I needed, thanks (reply to 135030)

Alexander: @tolk_vm  JetBrains IDE plugin (v 2.4.3) don't auto-locate stdlib for TOLK, so some functions such as getContractData, setContractData and multiple others couldn't be located (and couldn't do "go-to-definition")  Compilation via blueprint is fine.  What's potential source of this issue and how it could be fixed?

Lisa: Hello guys anyone using TON center API can help me retrieve the fees of a  transaction , it’s either missing some data either I don’t know how to calculate with the data retrieved from transactions endpoint

jennifer [afk]: wdym? (reply to 135038)

César: How to call the "Claim" function of the SC I mean

jennifer [afk]: u mean payload? (reply to 135041)

César: Yes I think

jennifer [afk]: check dms (reply to 135045)

know: Hello, first time dev with a question about TMAs (hopefully this is an ok place to ask);   I am having trouble getting TON Connect to integrate with my app. I added the script to the head of my HTML but the link doesn’t do anything. I’m using only basic html/css/js for the app.   I saw a comment in the wild that said you shouldn’t use vanilla JS when building TMAs, but didn’t explain why. Does anyone know if this is true and if using vanilla JS really does mess things up?  I have the json manifest file in the root directory, but just now I saw another comment implying that manifest and  connect don’t work with each other. Is this true?   Thank you in advance!

— 2025-01-05 —

4Basic: Hello please does any one can ask some basic question about create my first website .ton, there is a lot of information that I easy get lost in

&rey: Basic questions? 1. Do you plan to update website's contents? 2. Where will it be hosted? 3. Given hosting option, what browsers will support loading your website? (Relevant for adding TMA functionality or etc, which btw is to be discussed in @devs if you decide integration with Telegram is needded.) (reply to 135058)

4Basic: can aswer xD

4Basic: if by any chance u can anwser those question that would be really helpfull for me (reply to 135060)

&rey: Please try paying attention (rest if needed), because MY answers are not that relevant there)  1. I don't plan to update your website's contents; 2. I don't plan to host it either; 3. Given local location, the dApp will only be visible in desktop browser. (reply to 135063)

4Basic: i want to say here that i was attempting to write "if some can anwsear those questions" (reply to 135061)

4Basic: ok and u know how can i create a .ton website ? (reply to 135064)

&rey: That actually depends on how you want to host it, that's why I'm asking. (reply to 135066)

4Basic: not from my home

4Basic: i ear about TON storage to host  it

4Basic: that is not what i mean lmao (reply to 135068)

4Basic: just want it to get online h24 not from my computer

4Basic: pleas any one ?

0xNameless: can anyone give some suggestion for ton-connect issue255 ?

0xNameless: i just found this problem on Android,it seems all telegram accout share the same localStorage in each miniapp

0xNameless: it caused the local wallet information of multiple accounts to be the same

Nick: Hi, guys! Is it possible to send 10k messages in a row using highload wallet v3?  I tried tonkite lib and put 250 messages in each transaction (40 transactions in total). I set appropriate query id, but still I was getting this error after about 20 transactions. Does it mean I can't send any transactions amount even using highload wallet v3?  error: rejected by account before smart-contract execution

Nick: Does it mean I need to code the smart contract with FuncC or something like this? (reply to 135087)

Nick: I need a mass transfer of 10k from one address to another (reply to 135089)

Nick: I'm a developer so they hired me to code a solution to not to pay money for software so I'm trying to build it myself

kocmo12: Check tonraffles mass sender (reply to 135090)

Nick: I need to code the solution for a custom software, not to buy a proprietary one (reply to 135091)

&rey: I really doubt it is possible, because of block limits. (reply to 135085)

Hashim: I want to add in my flutter app (reply to 134808)

WhyesCode: If you need a custom solution, I can help you create a contract that allows upgradability of NFTs (reply to 135004)

doni: Hi Does anyone has an example how to use paging on the graphql backend ?  https://dapp-01.tontech.io/graphql

BOBBY: Yeah (reply to 135101)

Professor: Hi guys anyone looking to hire a dev with c/c++ python experience would like to engage   Please tag if anyone is hiring

doni: can you please share ? (reply to 135104)

Nxrix: Hello I'm making a wallet using js I wanted to ask about how wallets store the secret keys with the password pin

Алина: What node sources you were referring to? (reply to 134933)

&rey: These ones: https://github.com/ton-blockchain/ton/. (reply to 135141)

Алина: Oh, i see, i thought for a moment you mean node.js sources! (reply to 135142)

Jacob: hello , can some one help me ?  MyTonCtrl> status fast [debug]   05.01.2025, 14:23:47.887 (UTC)  <MainThread>  start GetValidatorStatus function [warning] 05.01.2025, 14:23:47.917 (UTC)  <MainThread>  GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a number, not 'NoneType' [debug]   05.01.2025, 14:23:47.917 (UTC)  <MainThread>  start GetValidatorWallet function [debug]   05.01.2025, 14:23:47.917 (UTC)  <MainThread>  start GetLocalWallet function [debug]   05.01.2025, 14:23:47.917 (UTC)  <MainThread>  start GetWalletFromFile function [debug]   05.01.2025, 14:23:47.927 (UTC)  <MainThread>  start WalletVersion2Wallet function [debug]   05.01.2025, 14:23:47.927 (UTC)  <MainThread>  start GetDbSize function ===[ Node status ]=== ADNL address of local validator: 82968988338305C285FE75798154F998A3205EC19D66BC5709DF125A32A15C3A Public ADNL address of node: F1DDFB3F59733D727AD49C36838D44A8EE69F1E762B0B0951D06BA2BE2330FD9 Load average[4]: 1.46, 1.65, 1.48 Network load average (Mbit/s): 101.24, 147.56, 105.39 Memory load: ram:[0.67 Gb, 12.1%], swap:[0.0 Gb, 0.0%] Disks load average (MB/s): sda:[1.79, 3.48%] Mytoncore status: working, 2 days Local validator status: working, 2 minutes Local validator out of sync: n/a Local validator last state serialization: None blocks ago Local validator database size: 0.0 Gb, 4.5% Version mytonctrl: 33bd174 (master) Version validator: ea0dc16 (master)

Jacob: it seems that the lightserver can not syn blocks

Jacob: Local validator database size: 0.0 Gb, 4.5%  the first value should not be 0.0 Gb,but now it is

Jacob: MyTonCtrl> status_modes Name              Status             Description                                                             validator         disabled  Validator functions. Activates participating in elections and staking. If pools and l/s modes are disabled stakes from validator wallet. nominator-pool    disabled  Standard nominator pools.                                                        single-nominator  disabled  Orbs's single nominator pools.                                                   liquid-staking    disabled  Liquid staking controllers.                                                      liteserver        enabled   For liteserver usage only without validator.                                     alert-bot         disabled  Telegram bot alerts

Jacob: MyTonInstaller> status ===[ Services status ]=== Full node status: enabled Mytoncore status: enabled V.console status: enabled Liteserver status: enabled ===[ Node arguments ]=== --threads: 3 --daemonize: --global-config: /usr/bin/ton/global.config.json --db: /var/ton-work/db/ --logname: /var/ton-work/log --archive-ttl: 2592000 --verbosity: 1

Jacob: ton@vmi1805943:/var/ton-work$ sudo systemctl list-units  | grep git   mtc-jsonrpc.service                                                                         loaded activating auto-restart mtc-jsonrpc service. Created by https://github.com/igroman787/mypylib.   mytoncore.service                                                                           loaded active     running      mytoncore service. Created by https://github.com/igroman787/mypylib.   ton_http_api.service                                                                        loaded active     running      ton_http_api service. Created by https://github.com/igroman787/mypylib.   validator.service                                                                           loaded active     running      validator service. Created by https://github.com/igroman787/mypylib. ton@vmi1805943:/var/ton-work$ sudo systemctl list-units | grep ton   mytoncore.service                                                                           loaded active     running      mytoncore service. Created by https://github.com/igroman787/mypylib.   ton_http_api.service                                                                        loaded active     running      ton_http_api service. Created by https://github.com/igroman787/mypylib.

Jacob: "that loaded activating auto-restart mtc-jsonrpc service." , does this service effect the syn blocks?

Jacob: ton@vmi1805943:/var/ton-work$ sudo tail -f log.thread1.log [ 1][t 1][2025-01-03 11:10:56.946489892][adnl-network-manager.cpp:113][!NetworkManager] [networkmanager]: dropping IN message [?->?]: peer table unitialized

Jacob: ton@vmi1805943:/var/ton-work$ sudo tail -f log.thread2.log [ 3][t 2][2025-01-03 10:16:57.583065467][validator-engine.cpp:1424][!validator-engine]  found init block [ w=-1 s=9223372036854775808 seq=17908219 y6qWqhCnLgzWHjUFmXysaiOljuK5xVoCRMLzUwGInVM= Y/GziXxwuYte0AM4WT7tTWsCx+6rcfLpGmRaEQwhUKI= ]

&rey: I'm not sure there are specialists on full nodes here actually.

Jacob: ton@vmi1805943:/var/ton-work$ sudo tail -f log.thread7.log [ 1][t 7][2025-01-03 10:16:57.593248198][validator-engine.cpp:1762][!validator-engine]  created config file '/var/ton-work/db//config.json' [ 1][t 7][2025-01-03 10:16:57.593448652][validator-engine.cpp:1763][!validator-engine]  check it manually before continue

Jacob: Thank you very much. I just want to build my own liteserver (reply to 135155)

Jacob: here is my command line :  nohup sudo ./install.sh -m liteserver -n testnet -c https://ton.org/testnet-global.config.json -i &

Jacob: ============================================================== hello , can some one help me ?  0. Qestions:  all in world , the node can not sync blocks.  ==============================================================

Jacob: ============================================================== below is the details: 1. status fast  MyTonCtrl> status fast [debug]   05.01.2025, 14:23:47.887 (UTC)  <MainThread>  start GetValidatorStatus function [warning] 05.01.2025, 14:23:47.917 (UTC)  <MainThread>  GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a number, not 'NoneType' [debug]   05.01.2025, 14:23:47.917 (UTC)  <MainThread>  start GetValidatorWallet function [debug]   05.01.2025, 14:23:47.917 (UTC)  <MainThread>  start GetLocalWallet function [debug]   05.01.2025, 14:23:47.917 (UTC)  <MainThread>  start GetWalletFromFile function [debug]   05.01.2025, 14:23:47.927 (UTC)  <MainThread>  start WalletVersion2Wallet function [debug]   05.01.2025, 14:23:47.927 (UTC)  <MainThread>  start GetDbSize function ===[ Node status ]=== ADNL address of local validator: 82968988338305C285FE75798154F998A3205EC19D66BC5709DF125A32A15C3A Public ADNL address of node: F1DDFB3F59733D727AD49C36838D44A8EE69F1E762B0B0951D06BA2BE2330FD9 Load average[4]: 1.46, 1.65, 1.48 Network load average (Mbit/s): 101.24, 147.56, 105.39 Memory load: ram:[0.67 Gb, 12.1%], swap:[0.0 Gb, 0.0%] Disks load average (MB/s): sda:[1.79, 3.48%] Mytoncore status: working, 2 days Local validator status: working, 2 minutes Local validator out of sync: n/a Local validator last state serialization: None blocks ago Local validator database size: 0.0 Gb, 4.5% Version mytonctrl: 33bd174 (master) Version validator: ea0dc16 (master) it seems that the lightserver can not syn blocks Local validator database size: 0.0 Gb, 4.5%  the first value should not be 0.0 Gb,but now it is MyTonCtrl> status_modes Name              Status             Description                                                             validator         disabled  Validator functions. Activates participating in elections and staking. If pools and l/s modes are disabled stakes from validator wallet. nominator-pool    disabled  Standard nominator pools.                                                        single-nominator  disabled  Orbs's single nominator pools.                                                   liquid-staking    disabled  Liquid staking controllers.                                                      liteserver        enabled   For liteserver usage only without validator.                                     alert-bot         disabled  Telegram bot alerts MyTonInstaller> status ===[ Services status ]=== Full node status: enabled Mytoncore status: enabled V.console status: enabled Liteserver status: enabled ===[ Node arguments ]=== --threads: 3 --daemonize: --global-config: /usr/bin/ton/global.config.json --db: /var/ton-work/db/ --logname: /var/ton-work/log --archive-ttl: 2592000 --verbosity: 1

Jacob: 2. service about all ton   2.1 server name  and sercie status ton@vmi1805943:/var/ton-work$ sudo systemctl list-units  | grep git   mtc-jsonrpc.service                                                                     loaded activating auto-restart mtc-jsonrpc service. Created by https://github.com/igroman787/mypylib.   mytoncore.service                                                                           loaded active     running      mytoncore service. Created by https://github.com/igroman787/mypylib.   ton_http_api.service                                                                        loaded active     running      ton_http_api service. Created by https://github.com/igroman787/mypylib.   validator.service                                                                           loaded active     running      validator service. Created by https://github.com/igroman787/mypylib. ton@vmi1805943:/var/ton-work$ sudo systemctl list-units | grep ton   mytoncore.service                                                                           loaded active     running      mytoncore service. Created by https://github.com/igroman787/mypylib.   ton_http_api.service                                                                        loaded active     running      ton_http_api service. Created by https://github.com/igroman787/mypylib. GitHub GitHub - igroman787/mypylib  Contribute to igroman787/mypylib development by creating an account on GitHub.   2.2 about the log   "that loaded activating auto-restart mtc-jsonrpc service." , does this service effect the syn blocks? ton@vmi1805943:/var/ton-work$ sudo tail -f log.thread1.log [ 1][t 1][2025-01-03 11:10:56.946489892][adnl-network-manager.cpp:113][!NetworkManager] [networkmanager]: dropping IN message [?->?]: peer table unitialized ton@vmi1805943:/var/ton-work$ sudo tail -f log.thread2.log [ 3][t 2][2025-01-03 10:16:57.583065467][validator-engine.cpp:1424][!validator-engine]  found init block [ w=-1 s=9223372036854775808 seq=17908219 y6qWqhCnLgzWHjUFmXysaiOljuK5xVoCRMLzUwGInVM= Y/GziXxwuYte0AM4WT7tTWsCx+6rcfLpGmRaEQwhUKI= ] I'm not sure there are specialists on full nodes here actually. ton@vmi1805943:/var/ton-work$ sudo tail -f log.thread7.log [ 1][t 7][2025-01-03 10:16:57.593248198][validator-engine.cpp:1762][!validator-engine]  created config file '/var/ton-work/db//config.json' [ 1][t 7][2025-01-03 10:16:57.593448652][validator-engine.cpp:1763][!validator-engine]  check it manually before continue I'm not sure there are specialists on full nodes here actually.

Jacob: 3. liteserver mode install command line  nohup sudo ./install.sh -m liteserver -n testnet -c https://ton.org/testnet-global.config.json -i &

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: Hello guys, how can I find my mnemonics and private key wallet?  Actually I found my mnemonics but I need private key for smart contracts

Алина: import { mnemonicToWalletKey } from "@ton/crypto";  async function main() {  const { publicKey, secretKey } = await mnemonicToWalletKey(   MNEMONIC.split(' ')  );   console.log(   publicKey.toString("base64"),   secretKey.toString("base64"),  ); }  main(); (reply to 135173)

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: Do You know how can I get it on python? (reply to 135174)

Алина: Not my go-to choice 😅 (reply to 135175)

&: How to store null cell in FunC? In TS ->  beginCell().storeMaybeRef(null).endCell()  How to convert this into FunC?

&rey: begin_cell().store_uint(0, 1).end_cell() == begin_cell().store_dict(null()).end_cell() == ... (reply to 135177)

&: Thx. how about null address? (reply to 135178)

&rey: Of course! .store_uint(0, 2) (reply to 135179)

&: Wow. that makes me crazy long time. Thx a lot.

&rey: pytoniq.keys.mnemonic_to_private_key(<list of mnemonic words>) (reply to 135175)

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: can you explain more please? (reply to 135183)

&rey: import pytoniq  # the best [low-level] lib for interacting with TON import getpass  # built-in  mnemonic = getpass.getpass().split()  # input e.g. apple apple ... apple public_key, secret_key = pytoniq.keys.mnemonic_to_private_key(mnemonic) (reply to 135185)

Jacob: [2025-01-05 17:07:51.416846077][full-node-shard.cpp:538][!manager]     getnextkey: [Error : 651 : not inited]

Jacob: can someone give me some infomation about it (litesever mode , block sync)

Jacob: it means the data recieved from peer is invalid or my  validator-engine not be initied corrctly ?

Jacob: another question,  is there a stalbe http server for testnet ?  orbs-networks and toncent is not stable when call getTransactions with only limit parameter

Jacob: Jan 06 00:53:02 vmi1805943.contaboserver.net systemd[1]: validator.service: Succeeded. Jan 06 00:53:02 vmi1805943.contaboserver.net systemd[1]: Stopped validator service.  Jan 06 00:53:02 vmi1805943.contaboserver.net systemd[1]: Started validator service.  Jan 06 01:00:34 vmi1805943.contaboserver.net systemd[1]: validator.service: Main process exited, code=killed, status=9/KILL  why my validator.service always kill by signal 9, i have not send the kill -9 signal ?

Mubaraak: Exactly like how I explained you (reply to 135097)

Jacob: Is there a chanel which provide full node  or liteserer node support ?

Hashim: Share code or any video what do you say (reply to 135195)

&rey: Didn't this help? https://docs.ton.org/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk (reply to 135199)

Hashim: This is in js i use flutter dart with firebase (reply to 135200)

Hashim: I downloaded ton github  but i don't know how to link github code in my page with connect  button

&rey: If there is no framework then you'll have to write your own based on @tonconnect/sdk. It's not especially hard, as documented in the article. (reply to 135202)

&rey: I'd also like to remind that TON Connect 2 serves to connect user's wallet application to some site (aka dApp frontend).

Hashim: Can you share code (reply to 135207)

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: Bro what is the best way to transfer TON with pythoniq using mnemonic? (reply to 135206)

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: I tried old codes in up but didn't answer

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: Can you guide me please?😁 (reply to 135207)

&rey: The best? I only have a proprietary version; though, it is guaranteed to complete the transfer eventually regardless of what else happens with the wallet. (reply to 135209)

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: Can You please tell me how can I do it?(sending 1 TON with comment) (reply to 135212)

&rey: What failed? Have you checked if wallet version matches? (reply to 135210)

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: I got errors with this and by the way this my wallet is V4R2 (reply to 133230)

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: 😔😔

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: I changed it to V4 but didn't work

&rey: I can't  what the problem  from your  due to lack  . (reply to 135216)

&rey: Something like full error message (with traceback) would make your problem solvable.

𝙷𝙰𝙽𝙶𝙾𝚅𝙴𝚁: Can I send it to your PV? (reply to 135221)

Thomas: Kindly check the wallet is initialised or not in Blockchain viewer  If it's  unit or non exist Make a transaction and try (reply to 135218)

Thomas: I have code for V4R2 Want? (reply to 135218)

— 2025-01-06 —

Alan | Torch: Does anyone here know how to implement TypeScript's dict.generateMerkleProof method in Python or Go? We want to pass multiple addresses into the generateMerkleProof function so that it can merge Merkle proofs for multiple users to reduce computation time. Additionally, we want to maximize CPU usage using Python or Go, as it would be much easier than using TypeScript's child_process. However, I noticed that Python and Go do not seem to have a similar built-in function available.

BizX: I am a passionate blockchain and web3 frontend developer  I am looking for opportunity to work  if someone have a project and idea, plz drop to me

창대: Hi I'm trying to deploy a contract on the TON blockchain. How would I go about adding a lock up feature to the wallet?

창대: I will use ton-blockchain/minter-contract in github

WhyesCode: Yes, I can help (reply to 135255)

Alan | Torch: Wow, could you please share your idea? (reply to 135274)

Alan | Torch: I’m not familiar with sdk other than typescript, so really appreciate for your help 🤘

WhyesCode: You will need to write a custom function. You can use libraries like pymerkle for Python or merkle for Go. (reply to 135275)

Alan | Torch: Yet in Golang, I saw another function named proofSkeleton. However there isn’t sufficient documentation to explain how can we use it in production (reply to 135277)

WhyesCode: Sometimes, implementation itself can provide insights into how to use a function. Look at the source code of the package where proofSkeleton is defined. (reply to 135278)

RM: Hi everyone, can anyone tell what exactly frozenstake mean in ton network

WhyesCode: It means a portion of a user's funds are locked up in the staking process. (reply to 135280)

WhyesCode: In one word, LOCKED.

RM: In the tonscan.org , i can see that few validators have frozenstake , but others have frozenstake as None . Why is it so

WhyesCode: It's likely because those validators have not locked any of their funds in the staking process (reply to 135283)

WhyesCode: They are either not participating in staking or have chosen to keep their funds liquid.

WhyesCode: I mean validators with frozenstake as "None"

&rey: Because they only participate in current validation round I guess, and "frozen stake" comes from the previous one. (reply to 135283)

&rey: An important part of validation round is when validators of it don't generate any more blocks, but others have chance to raise complaints on blockchain invalidity, and on each complaint the validators would vote. Stakes are frozen during those hours so that there is something to fine if invalid block is found. (reply to 135280)

&rey: sorry, how is this related to TON at all? If you're misleading people you'll have to be permanently banned. (reply to 135277)

WhyesCode: Misleading? NO. I'm only trying to help here (reply to 135289)

Tom: If you're using Go tonutils, check this: https://t.me/tonutils/8079 (reply to 135275)

Tom: The library is fully capable of creating proof or multiple proof. The problem is that it takes a little modification to make it compatible with @ton/core implementation.

Alan | Torch: Wow you're quite a master of go-utils! Could you please share some examples here for implementing that?   I’m curious about how much computation time can be reduced by using Golang to calculate Merkle proofs compared to the TypeScript SDK, specifically for approximately 2,500 and 5,000 dictionary entries. This will help us decide whether to introduce a Golang-based service to the team. (reply to 135292)

Amir: Hello, I want to learn how to write a smart contract, I want to make something like this, can someone help me?

Tom: Not really, I don't have much time with it so the internal implementation is kinda unknown for me 😁 But for @ton/core, it uses Js Map underneath to store all entries which results in high memory consumption. (reply to 135304)

Tom: If you decide to use Go, you could ask inside their chat imo

Vanshika: Hi Apart from being idle or having poor performance, how the validators could get penalized in TON? What are those misbehaviours exactly? What are the things that we should avoid? Also, is the penalty same for network downtime and misbehaviours? 101 TON? (reply to 135288)

&rey: I'm not familiar with validator inner workings but I remember those: signing a fork, signing invalid block, IIRC not broadcasting a created block in timely manner. (reply to 135309)

&rey: Violations to the first two, as well as accepting catchain communications from disqualified, immediately disqualify the validator from current round. Not sure what happens with stake. (reply to 135310)

Vanshika: Okay Is there any way we could stop this from happening? Any parameters we can pass so that our validator won’t do this? Any kind of slashing protection? (reply to 135312)

&rey: All of that already works even on default settings; to get more certainty that your blocks are valid, you could try using ECC RAM. (reply to 135313)

Vanshika: Okay, thanks (reply to 135314)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 56 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 29  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Alan | Torch: Sure. I have tested. Golang speed up incredibly, in future, the only reason I will use typescript is convenience. (reply to 135308)

User<7611800731>: AI16Z’s ElizaOS AI Agent framework is very popular, in fact it’s ranked #1 in AI Agent platforms in terms of number of Github stars; they already have a Ton blockchain plugin https://github.com/elizaOS/eliza —- 1. anyone have used that Ton plugin?  2. maybe there are opportunities to build more plugins like telegram plugins?  3. or platform on top of Eliza to better suit ton blockchain ?

Alan | Torch: It is 400x faster than dict.generateMerkleProof typescript version. Amazing (reply to 135330)

Danil: Hey guys, we are developing dApp with custom tonConnect modals. Is there any API or method for "Open wallet" button on confirmation?   Thanks!

&rey: I believe it would be easier to write based on @tonconnect/sdk? Anyways, I don't know, but there is source code of each package. (reply to 135337)

&rey: 1. Not used but seen source code; it can only do outgoing TON transfers, and it is not guaranteed that they happen at all. Well, and load USDT/TON pool data to infer TON price.  2. They do have Telegram client it seems.  3. Just send pull requests to https://github.com/elizaOS/eliza/tree/main/packages/plugin-ton if you wish so. (reply to 135331)

Danil: Ty! (reply to 135338)

hemangi: Hi everyone i am having issues in referrel integration in telgram mini app.any help would be appreciated

Tom: Glad you made it. Just curious, what is your maximum size of keys? (reply to 135336)

&rey: Please choose chat appropriate for TMAs instead of one about development on TON. (reply to 135351)

hemangi: can you refer  me TMA group ?

&rey: @devs. (reply to 135354)

hemangi: thank you (reply to 135361)

Alan | Torch: 150,000 as baseline (reply to 135352)

Tom: That’s fairly small in my opinion but having scaling in mind is good. (reply to 135365)

Alan | Torch: Yup, yet it shows that typescript cannot handle the job even there are only 150k entries... (reply to 135366)

Tom: I believe it can handle that number but it depends on hardware spec. Computer with 16GB RAM can handle that inside a webapp with web-worker

&rey: well you're given evidence to the contrary; please check the claim you made (reply to 135368)

Tom: Sorry if I remember incorrectly but as far as I recollect, the @ton/core implementation consumption is high but it’s still possible with my hardware spec. I have trouble when the data is at 300K entries. (reply to 135369)

Tom: To be precise, the error was with heap allocation on NodeJS and I have to increase the limitation to around 12GB

Tom: This is my comment for 150K entries with this dict layout [key: address]: { amount: coins, message: string tails } (reply to 135368)

Tom: xssnick/tonutils-go is much more performant. No argument here 😁

Tom: Btw, sharding is inevitable in foreseeable future. I’m still learning but we have to chunk it anw. (reply to 135367)

Алина: Do public DHT nodes sometimes get unavailable?

&rey: Pretty much nobody knows how to even access those, I guess) (reply to 135384)

Алина: Well, there's the pytoniq library and sometimes it works fine and sometimes it just won't connect to the nodes (reply to 135385)

Vanshika: Hey, is there any article/documentation which will describe the uses of all the addresses which are being used in TON validator like, ADNL address of local validator, Public ADNL address of node, local and remote address of validator

Алина: dht-ping-servers util showed that some DHT nodes are indeed dead

&rey: I wasn't aware pytoniq does anything with DHT; I thought it only connects to blockchain liteservers. (reply to 135386)

4Basic: Heelo,  I want to create my webpage on TON blockchain, i'm here with an ubuntu server where i create my nginx page, import Ton basics and build all i need, i'm ended up here to lunch my page with this command :  rldp-http-proxy/rldp-http-proxy -a 10.0.2.15:3333 -L '*' -C global.config.json -A wf2l2kchvyhnfjn4l5rqz2yatpdkuomynpwylafos747mlbqvmsbl4o -d -l ../log  so i supposed that from here, my page sould be accessible from my windows and the adnl adresse if i have my TON proxy on, so i test but nothing, and this is what my log return : [ 2][t 1][2025-01-06 18:19:13.202297408][TonlibClient.cpp:2891][!tonlibclient][&!config->ignore_cache_] Unknown LastBlockState: [Error : 0 : not found]  pleas need some help, ty for all reply !

4Basic: pleas my brain is melting on that

ㅤ: hola

— 2025-01-07 —

BIN: Hello, не знаю как вышло, но когда-то давно оказался в бане ру чата, можно разбан пожалуйста?

&rey: Please contact с @f_closer. (Generally, it's better to try appealing moderator decisions within a week while it is still visible what happened.) (reply to 135417)

Martin: GM guys, I am trying to integrate the websocket into my app to subscribe to traces on blockchain but it seems like currently it does not support testnet. Is there anyone who met this problem before?

BizX: I am a passionate blockchain and web3 frontend developer  I am looking for opportunity to work  if someone have a project and idea, plz drop to me

Nhat Nguyen: I have question when send to Blockchain how to listener transaction success to send next transaction. I need handle case send queue transaction same wallet. Pls help me

Sol: We are a skilled smart contract development team focused on the TON blockchain. Our services include:  • Smart contract development and optimization  • NFT project deployment  • Development with FunC, TACT, and more

Vanshika: Hi guys, I was running TON full node in docker container and was trying to test something so I stopped my container But when I tried starting the container again with existing mounted volumes, I am getting this error when using "mytonctrl": [error]   07.01.2025, 04:11:40.496 (UTC)  <MainThread>  GetValidatorConfig error  also the syncing is not completed, it's been almost 18hrs Local validator out of sync: n/a  can anyone please help

پشتیبانی: Hello friends How can I convert recovery phrase to private key in tonkeeper?

Nerses: Are there any specific code comment conventions, like NatSpec in Solidity, for documenting functions and logic? If not, how do you usually handle comments?

پشتیبانی: No for using in my code (reply to 135449)

Nerses: can this flow be used to attack smart contracts ?   https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/accept-message-effects#internal-message:~:text=of%20bounce%20messages.-,EXAMPLE,-For%20instance%2C%20if

TON Bounty Bridge: ​TON Connect SDK for Python  🏷 Developer Tool  Summary:I propose developing a fully functional and robustTON Connect SDKin Python to address the shortcomin...  Rewards: • SBT Bounty Reward • 1500 USD in TON  Created by nessshon

User<7718025931>: Hello guys, our team is looking peoples for NFT-GAME  we are looking for beta-testers and chat-moderators 🤑😎 who interesting be a part of our team text me for details 🤝

.: why ton connect modal is not working in react for me?

Ali: Hey everyone!  On the EVM side, transactions can theoretically be reversed. Therefore, when building structures that include central systems such as bridges or CEX, we wait for Transaction Finality for the relevant transaction and if there are enough approvals, we record the relevant transaction in the backend.  Is TON Blockchain has kinda same think? How do we understand that the transaction is confirmed and cannot be reversed?

Akachi: Be aware of scammers (reply to 135466)

Tim: If transaction is recorded in masterchain - it can no longer be reverted. (reply to 135473)

Ali: how can i check in my backend the transaction is recorded in masterchain? @TrueCarry

doni: Hi Does anyone has an example how to use paging on the graphql backend ?  https://dapp-01.tontech.io/graphql

Nerses: How can storage optimization be approached in TON compared to EVM? In EVM, storage is structured slot by slot (32 bytes), making it efficient to organize data types like bytes32, bytes20, and bytes10 sequentially (e.g., bytes32, bytes20, bytes10 instead of bytes20, bytes32, bytes10). However, in TON, storage is based on a cell tree structure. Does this mean there are no similar considerations for storage efficiency in TON?

&rey: Make contract operations build as few cells as possible. Given that, try to minimize total cell count. (reply to 135483)

&rey: If a transaction is returned by plain blockchain APIs (IIRC any except TonAPI) it has been recorded. (reply to 135476)

Nerses: Is the Tact-lang/compiler version 1.5.3 backward compatible with version 1.4.1 ?

&rey: generally, if it is recorded in workchain, it cannot be reverted either, at risk of fines and disqualification for validators signing the fork) (reply to 135475)

Ali: instead of TONAPI, which api provider you suggesting? (reply to 135491)

Ali: gotcha thanks! (reply to 135493)

&rey: Toncenter. dton.io. Some others (https://docs.ton.org/v3/guidelines/dapps/apis-sdks/api-types) I don't remember. (reply to 135494)

Ali: thanks

Nerses: Can gasConsumed or myStorageDue in TACT be used in production smart contracts, or are they still under development?

Nerses: Is there built in function to convert Int48 to Int or it should be done Int48->slice->Int ?

&rey: There's no int48 in the first place, all TVM integers are Int (int257 if you want to name size and signedness). (reply to 135501)

Nerses: in my use case i have field which type is Int as Int64 (not Int48) so i need to convert to In. (reply to 135502)

Odd: Hey! Anyone here looking for developers or designers?

&rey: It is already Int when you take it from the structure. (reply to 135504)

Alan | Torch: We building a minimal scalable typescript adapter to ensure tonapi can be compatible with toncenter input (TONAPI adapter has memory leak issue when using get transaction, and another reason is we don't want to intstall too many dependencies).   This is the implementation for get method result, I just wonder if anyone has any experience on this transform function? Is there any problem with the function?  (The above comment is copy from tonapi definition)

Ad: hey there, i am learning ton blockchain. is there a way to compute a jetton user wallet address without doing an api call, i mean locally in python?

&rey: Yes. To do so, you have to inline jetton master code and data, and do pytvm invocation. (reply to 135512)

Ad: cool. can you point to an example online maybe?

Amir: Hello friends, I want to learn ton smart contract writing, is it worth the time? For international income

&rey: It is possible to earn a large amount but being attracted to some industry only because of high income is misguided in most cases. Answering in more detail would require to know what projects you want to see built and working. (reply to 135519)

Amir: I'm still a programmer and I'm interested in it, but in some situations, it's really not possible to move forward with only interests, it also needs income.

&rey: Well literally https://github.com/yungwine/pytvm/blob/9956750c81e4aff07e1efc85936e67c253023159/examples/get_method.py#L22-L36. (reply to 135514)

Alexander: It is possible to learn something without an income (reply to 135521)

Amir: Can you live without income? (reply to 135523)

&rey: Regardless of the fact that it is certainly possible, this is delving into off topic.

Jorsh: The problem between react 19 and ton connect is resolved?

User<7870430276>: good them

TON Bounty Bridge: ​The Ton Society website needs to update the username data  🏷 Resource  Summary:Create an update of these usernames that the user is currently using  Created by the7holy

— 2025-01-08 —

Vesting: Hello

Zaza: hi guys，may I ask if the TON blockchain testnet has USDT deployed? Where can I obtain testnet USDT?

jennifer [afk]: https://t.me/testnet_usdt_giver_bot (reply to 135563)

Zaza: thx~ (reply to 135566)

Sam: 👍

Root: https://tonviewer.com/transaction/6c94c310c2a82c14db5e736e98f97952276004d7422ff91949ba104475f53b0d  How this transaction created

jennifer [afk]: bounce: true (reply to 135573)

Root: And IhrDisabled = false

Root: Whate is IhrDisabled mean?

RM: Hi everyone , after setting up validator , in validator-console we can see local key and remote key . Can anyone tell me what exactly is the difference between them and the use of it

Ihor Million: From that perspective, it’s not worth it. Currently, the market is not that huge as for ether/web3 developers.  But the key to the success is to be one of the first and most experienced. It may be a key for you for good money in future.   Anyway, I would recommend you to pay attention to your own desires (reply to 135521)

Ad: many thanks 👍 (reply to 135522)

Mithra: Hi, how can the "Suspicious" tag be removed from Jetton trasnactions? https://tonviewer.com/transaction/1febf0d679ce69f7c3c47bf3fc6480a0f99a40974b02ded8a035dad56ebed102  This was a Liquidity Pool Jetton transfer.

jennifer [afk]: spam subden dms, cause tonapi is awful (reply to 135598)

Ihor Million: Hello, dear developers   I’m a new in TON and I remember how I started to develop for EOS and that massive amount of pitfalls. Just for eg hidden from developers need to stake cpu worth 50k$ to be able to process transactions on your smart contract.   Can I ask you please to share the pitfalls that made you impressed when you stated to develop on TON?

Ihor Million: Mostly worry about the issues I should be aware of before to decide to move my game to TON

User<7012417474>: some body know why jetton transaction fail but i not receive my jetton ?

jennifer [afk]: maybe u will show ur transaction? (reply to 135603)

Nerses: I have a wallet address with a balance and the corresponding mnemonic, but I'm unable to recreate the exact wallet with its balance using Tonkeeper. Could this issue be related to differences in wallet contract versions (e.g., w5 beta, w5, or others)?

jennifer [afk]: probably versions (reply to 135605)

User<7012417474>: it only show 706 exit code (reply to 135604)

M: Can any one help me to use TON wallet with PYTHON??

Africhain: Explain please (reply to 135609)

M: I want to write a python code that this program can be connected to the ton wallet and I can transfer with it and... (reply to 135610)

Africhain: Ok (reply to 135611)

Vesting: Hello, I wanna ask about reall time transaction. I want when I get TON in my wallet it trow data  to my website like: block number, time, address sender, amount, etc. How I can pass this problem?.

A: hi how should write a withdraw code for python using toncenter api for ton and usdt?

Africhain: Which language (reply to 135622)

A: python (reply to 135624)

Africhain: Ok (reply to 135625)

A: thanks (reply to 135626)

Africhain: Talk to me in few minutes (reply to 135627)

Александр: How can I enable double verification to perform an operation? (By double verification I mean verification with the help of another wallet) I did not find such a function in Tonkeeper, maybe it is in other wallets?

Timur: cell msg_body = begin_cell()         .store_uint(op::create_ico, 32)         .store_ref(           begin_cell()             .store_slice(sender)             .store_slice(jetton_wallet)             .store_slice(my_address())           .end_cell()         )         .store_ref(           begin_cell().store_coins(allocation_one).end_cell()         ) .end_cell()  why i can’t push some data in the second ref? There where i do «store_coins(allocation_one), then the contract doesn’t want to be built (if i push empty cell «begin_cell().end_cell()», then it’s okay), the blueprint return an error: RuntimeError: null function or function signature mismatch

&rey: Is this providing value to chat members? (reply to 135634)

&rey: Would you care to prove your expertise?  The test question is: 1) given a game server that wants to increase players' score (aka mint more jettons to them), 2) given that number of players may be quite high so we want users to pay for recording score in blockchain, 3) given a feature that users should be able to record several victories at once, using one transaction tree (to save on gas), how can this scheme be built? (Btw there is an ideal answer.) (reply to 135636)

dr: Hi all! While developing a dapp on nextjs with @tonconnect/ui-react library, a problem arose that persists only in telegram mini app on phone and when tonkeeper wallet is connected.  When accessing the page, everything works correctly: the wallet is connected, calls to the blockchain go through. But if you refresh the page, a call to the blockchain opens this page. if you restart the app, the problem disappears until the page is reloaded.  Does anyone know what this might be related to?

Timur: the data doesn’t matter, i pushed store_coins(1000000000) and not only coins, but slices too. the error will be the same

Timur: and also another contract builds endlessly and the third contract builds fine, lol =)

&rey: I'd believe that's a compiler issue. You can open issue on TON monorepo providing small reproducible example. You can work around it... perhaps creating cell separately? (reply to 135633)

Erti: Getting familar with TON by following some great lessons on GH. Ran into this code in Lesson 1:  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     throw_if(35,in_msg_body.slice_bits() < 32);      int n = in_msg_body~load_uint(32);      slice ds = get_data().begin_parse();     int total = ds~load_uint(64);      total += n;      set_data(begin_cell().store_uint(total, 64).end_cell()); }  int get_total() method_id {     slice ds = get_data().begin_parse();     int total = ds~load_uint(64);      return total; }   I'd use get_total()'s code as a private function (like private int calculate_total...) to avoid boilerplate in both. But as far as I'm concerned, there's no such thing as a private modifier in FunC. Are there any workarounds/conventions regarding such cases where I don't want a function to be callable from anywhere but the contract itself? Thanks!

User<7012417474>: Somebody can help me :( i want take my jetton back ? (reply to 135603)

User<7012417474>: I dont know why jetton not back to my wallet

Timur: cell msg = begin_cell()       .store_uint(0x18, 6)       .store_slice(calculate_ico_address(calculate_ico_state_init(jetton_msg)))       .store_coins(0)       .store_uint(7, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)       .store_ref(calculate_ico_state_init(jetton_msg))       .store_ref(msg_body)       .end_cell();  .store_uint(7, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)  — The error was because of this expression and it turns out that in another cell  .store_uint(7, 108) — I simply replaced it with 108   Lol...) (reply to 135633)

&: 706 error is negative balance error. When you're trying to send more jetton than your balance. then 706 error will happen (reply to 135603)

Vitalik: Hi all. I have a question. It will be good to use Unity for creating a game in telegram. Build will be about 7-8 Mb.

User<7012417474>: thank you, it right (reply to 135663)

User<7012417474>: it sent in prev tx so in next tx it not enough balance

User<7012417474>: i only see failed tx but not see prev tx

Ippolito: has anyone got ready script to handle incoming transaction on ton without using paid API providers? text me

SynthLuvr: Is there any Discord bot for token holding verification? Like Collab Land for EVM

Danilo: Hello everyone,  while sending a transaction / transfer, which would be the easiest way to get it's hash?  await contract.sendTransfer({       seqno,       secretKey: keyPair.secretKey,       sendMode: SendMode.PAY_GAS_SEPARATELY,       messages: [internalMessage],     });  Getting the last transactions using the getTransactions will not be good enough since because of race conditions I could get another one instead.  Do you know how to solve this problem?

Avetik: Good day. which api can i use to get TON price for financial operations?

&rey: You should be rather more precise than "price".  Do you want a guarantee that you can swap X TON for P*X of some currency in a timely manner? Do you perhaps want a guarantee that you can obtain that much TON? Do you want to use the same estimate of value that users see in their wallet applications? (These values are all different, of course.) (reply to 135695)

Avetik: thanks for the reply, mate.  I need jetton/ton price. In this context, price is the estimated amount of jetton that I can exchange for 1 TON (reply to 135696)

&rey: Do you remember that jetton may have a very thin liquidity so 0.01 J is worth can be swapped to 100 TON but 10 J are only 110 TON or like? (reply to 135697)

Avetik: Yeah, I understand that.

Avetik: The jetton is listed on Stonfi, but I can't find any endpoint that will return jetton/ton price. it only returns jetton/usdt price.

Avetik:   "dex_usd_price": "0.00002976212466693517",     "dex_price_usd": "0.00002976212466693517"

&rey: Well just use that multiplying by TON/USDT. (reply to 135701)

Avetik: soo, I need Ton/usdt but which api to use ?

Combot: Combot has warned Nxrix (1/3) Reason: Word **** is not allowed (reply to 135705)

Nxrix: why (reply to 135707)

&rey: StonFi uses EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c as an address for native TON. (reply to 135705)

Avetik: Thanks mate.

— 2025-01-09 —

PNT: what is this guys? (reply to 135317)

Nerses: In my contract, users send funds to lock them, and after some time, the funds are released. To ensure the same amount is released, I use ctx.value to fix the amount sent by the user during locking. However, this creates an issue because ctx.value includes the gas cost, meaning the contract balance ends up being less than the fixed amount. As a result, when releasing funds, the user could receive more than the actual balance of the contract. Is there any method or approach to handle this issue and exclude the gas cost from ctx.value or ensure accurate fund handling?

Артем: Hello guys, tell me how I can parse the result of calling liteserver getAccountTransaction( tl-b scheme inclusive) in typescript/js

Nick: Hey, guys, I bought a toncenter API key. Don't you know if the limits of usage of testnet and mainnet key are separate?

&: Why don;t you try to use dict & send_gas_fee_separately? (reply to 135773)

Nerses: the user decides how much to send and the message mode,so the contract should handle and fix correct amount.I think what you mentioned should be done in user side. Please correct me if i am mistaken (reply to 135776)

&: user  = dev? if not then you will provide frontend. then give pre-defined amount and send back extra ton. (reply to 135777)

Nerses: this violates my protocol structure. (reply to 135778)

Nerses: this can be solution, but I would like to give the solution in contract level,as it should be used with different dapps, and i dont want to restrict dapp impleemntation (reply to 135778)

&: 😀😀 Your protocol is really good. Even cannot define deposit logic. If someone violates, then he will get loss from his action You are the rule and you can make rule. (reply to 135779)

&: @NersesA Your idea is locked.

Nerses: I think there might be a misunderstanding about the issue I raised. (reply to 135786)

Justin: data: {       ok: false,       error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by transaction 066C8E85A48919D25B62794463C9375D567A63146B504734DBEF843F70201FC5:\n' +         'exitcode=36, steps=13, gas_used=0\n' +         'VM Log (truncated):\n' +         '...CTPUSHCONST 19 (xC_,1)\n' +         'execute DICTIGETJMPZ\n' +         'execute PUSHPOW2 9\n' +         'execute LDSLICEX\n' +         'execute DUP\n' +         'execute LDU 32\n' +         'execute LDU 32\n' +         'execute LDU 32\n' +         'execute XCHG s2\n' +         'execute NOW\n' +         'execute LEQ\n' +         'execute THROWIF 36\n' +         'default exception handler, terminating vm with exit code 36\n',       code: 500     }   },   status: 500    Does anyone know how to solve this problem? This is encountered on the test chain. I have never encountered the same code before, but I have been getting this error for the past week. The same errors I found on Google only raised questions, but no cases were solved. The explanation for error code 36 is "Invalid Destination address in the outbound message.", but from the code, the desination address should be valid, and I can successfully transfer funds manually using tonkeeper. Does anyone know what causes this problem and how to solve it?

Nerses: This can be solution.If a contract receives 10 coins and needs to lock 9 coins while sending back the remaining 1 coin (which should also cover gas fees, with the leftover being returned to the sender), what is the best approach to handle this? How can I ensure the remaining balance is properly calculated and sent back without causing errors? (reply to 135786)

Minimal ☄️: Is there a way to use highload wallet as multisig at the same time? when for example sending TON manually from it?

Mohammad: Hey everyone. I have a question about dnsresolve get method. I have 2 contracts both have dnsresolve getter. I wanted to know what should I expect in each getter as inputs. x.ton NFT next_dns_resolver is contract A. Contract A's next resolver is contract B. And contract B dnsresolve will resolve to a wallet address.  What are the inputs of dnsresolve on each of these contracts?

Ilia: Hey, everybody. I have a question about creating a wallet. Please tell me how to correctly implement non-custodial wallets. What libraries should be used ? For all that I found and used it was to create a wallet using a mnemonic phrase. And how can I do that I would have a main wallet and deposit wallets, created with the help of the main wallet, and I could carry out a transfer operation from the deposit to the main wallet? How to realize this correctly, do I need to save the mnemonic phrase for all deposit addresses? Or there is a library as for other currencies for example eth - hdwallet(library).

&rey: Please check out https://docs.ton.org/v3/guidelines/web3/ton-dns/subresolvers. (reply to 135800)

&rey: TON uses a single address. After all, you need SBTs to arrive to the right place in the beginning, because they can't be transferred. (reply to 135814)

Mohammad: Thank you sm. yet another question. How many times I can return next_dns_resolver. I mean I want to create a flow in which contract B is next resolver for contract A and then contract C is next_resolver and final resolver for contrarct B. Is it even possible? (reply to 135815)

&rey: Every step must consume at least one byte from requested domain. (reply to 135817)

Ilia: How then is the approach implemented on exchanges such as Binance or other exchanges that they use? (reply to 135816)

&rey: Well they are custodials. (reply to 135819)

Ilia: Are they using tonmemo to make a record of how much money someone has, using a smart contract? Or am I misunderstanding how it works? (reply to 135820)

&rey: Well there's no such thing as "tonmemo" so presumably they don't use it.  There is a variety of backend libraries which can handle all of that. If you're unfamiliar, please check out https://github.com/gobicycle/bicycle. (reply to 135821)

Ilia: Thanks, I'll definitely look into it. (reply to 135822)

miya: I don't know much about ton. I want to use code to get the lowest-priced anonymous number in fragment. I have been looking for a long time but can't find relevant information. Can anyone help me? I can pay for it.

Vini: Hello team, checking the TON docs there are mentions about 2 patterns of addresses, Raw and User Friendly. Checking the explorer I can only see the User Friendly pattern as origin and the destination addresses. Can I assume this to implement an address validator or is there scenarios where raw addresses are used for transactions?

&rey: As it happens, blockchain itself doesn't use either. (reply to 135829)

Vini: So, BaseChain is the only master chain operating so far, and as I can see it uses the 48 base64 string pattern. Is that correct?

Ilia: I looked it up and realized my mistake, when I wrote I meant just what to use to make custodial wallets - I use python and the aiotx library to generate address. What do I need to learn and where do I look to understand how I can implement custodial wallets? (reply to 135820)

&rey: 1. I'm not sure aiotx will work correctly in all cases, because it is based on tonsdk which corrupted cell serialization sometimes. 2. https://docs.ton.org/v3/documentation/dapps/assets/overview is right I guess. (reply to 135832)

Nolan: this error happens out of nowhere, for me the code below worked   ;; Construct burn message         cell burn_msg = begin_cell()             .store_uint(op::burn, 32)             .store_uint(query_id, 64)             .store_coins(stoken_amount)             .store_slice(receiver_address) ;; response address             .end_cell();          ;; Send message to wallet         var msg = begin_cell()             .store_uint(0x18, 6)             .store_slice(stoken_wallet_address)             .store_coins(0)             .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)             .store_ref(stoken_state_init)             .store_ref(burn_msg);          send_raw_message(msg.end_cell(), 1); ;; burn the stoken  but the below was failing somehow with same error of null function  ;; transfer assent_amount of asset to receiver by triggering transfer op on asset wallet         cell transfer_msg = begin_cell()             .store_uint(op::transfer, 32)             .store_uint(query_id, 64)             .store_coins(asset_amount)             .store_slice(receiver_address) ;; response address             .end_cell();          ;; Send message to wallet         var msg = begin_cell()             .store_uint(0x18, 6)             .store_slice(asset_wallet_address)             .store_coins(0)             .store_uint(4 + 2 +1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)             .store_ref(asset_state_init)             .store_ref(transfer_msg);         send_raw_message(msg.end_cell(), 1); ;; send message to asset wallet   As soon as I changed  (4 + 2 +1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1) to (7, 108) it worked (reply to 135659)

Timur: yep, that’s true (reply to 135837)

Nerses: In my contract, funds are deposited, and I want to lock a fixed amount specified by the depositor (msg.amount). How can I send back the remaining amount (ctx.value - msg.amount - all paid fees) ? I used the following code:  nativeReserve(myBalance() - ctx.value + msg.amount, 0);  send(SendParameters{     to: sender(),     value: ctx.value - msg.amount,     mode: 0,     body: Excesses{}.toCell(), }); However, it doesn't seem to work. What could be the issue?

&rey: Have you sent anything else by that moment? (reply to 135845)

Mohammad: I'm encountering an issue with my Ton DNS implementation. I have a dns NFT ('x.ton') that's designed to delegate subdomain resolution to another contract. However, I'm facing difficulties when attempting to resolve subdomains like 'a.x.ton' on Tonviewer.  My current approach involves setting a 'next_resolver' within the 'x.ton' contract, which points to the contract responsible for resolving subdomains. This resolver contract will return another next_resolver and points to the subdomain a itself which is another smart contract containing a.x.ton records (wallet, ...)  My goal is to avoid using a dictionary within that resolver contract for storing subdomain mappings. I want to maintain the delegation logic within that contract (by setting the 'next_resolver') while utilizing the records stored exclusively within another dedicated resolver contract.  Despite this setup, Tonviewer fails to correctly navigate to the expected wallet when I attempt to resolve 'a.x.ton'." (reply to 135818)

Ad: Hello, i am trying to monitor dedust pools price changes (reserve), but getting the out-external messages from the blocks is vrry much delayed (blocks ate 7 to 10s old when i get them). i am using the liteclient of pytoniq library (python). How can i improve block data latency?

Thanh TX: Hello guys,. Im trying to get v4R2 address from mnemonics, but what I got is different with ton keeper wallet. How could I got the same address?  import crypto from "@ton/crypto"; import ton from "@ton/ton"; import { toUserFriendlyAddress } from "@tonconnect/ui";  export async function makeV4Address() {     const workchain = 0; // Usually you need a workchain 0     const keyPair = await crypto.mnemonicToPrivateKey(mnemonics);     const wallet = ton.WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });      const rawFormat = `${workchain}:${wallet.publicKey.toString("hex")}`;     const addr = await toUserFriendlyAddress(wallet.address.toRawString());     console.log(addr) } makeV4Address()

WhyesCode: Can you explain the issue you are facing? (reply to 135770)

— 2025-01-10 —

boot adbot: does anyone know how to decompile BOCs

&rey: https://github.com/ProgramCrafter/wallet-contract/blob/c4e9271abae8abe554a82e7d34f8c87b073acd8e/build.ts#L6. (reply to 135890)

WhyesCode: I can help if you want to hire someone. (reply to 135890)

Matthew: hi all, how to delete old order of multisig v1 wallet

KBA07: Hello, everyone. I am using https://github.com/xssnick/tonutils-go To create a wallet from a private key. After creating a wallet i am running the faucet to transfer 2 Ton to the wallet address. This makes the state of the wallet as attached in the figure above.  After this i am trying to send 1 Ton to the tonkeeper wallet i created initially for the testing purposes Using the commands BuildTransfer and SendWaitTransaction.  I am getting an error "cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction 730E374D1C25C7A255B4C864EAAEF3D2D74455E6783760AA8EA6F50903DBD029:\nexitcode=135, steps=45, gas_used=0\nVM Log (truncated):\n...HG s10\nexecute HASHSU\nexecute XCHG3 s0,s12,s12\nexecute terminating vm with exit code 135\n"  The contract v5r1 for the wallet is not deployed Hence the error. Is there any library, or a way where i can compile and deploy the contract code?

Cesqa: Good mornıng guys

User<7158594595>: Hi guys, I can't see any function read string on smart contract kind of load_slice.... what I want to do is accept string on smart contract and send ton with comment    cell message_body = begin_cell() ;; Creating a cell with message                         .store_uint(0, 32)                         .store_slice(referId)                         .end_cell(); How can  I implement this?

&rey: There's no string in TVM either, those are just slices of UTF-8-decodable bytes. When you store_slice one, you lose length information and may run into some problems with tail for long strings. (reply to 135902)

Press >>>: Hello, I went to the chat in Russian, they gave us the rules for familiarisation. While I was reading I was banned, can you tell me who to write about this issue?

Mr: Hello  Does anyone build with ton connect UI on the ton blockchain   I'm trying to initiate a ton transfer but the wallet keeps saying failed to calculate fee and the docs on the ton connect UI doesn't show anything related to inputting the gas fee when initiating the ton transfer

User<7158594595>: Thanks for sharing wisdom? Then what is the solution? (reply to 135904)

ROST & FLAME: Hello everyone, I’m encountering a syntax error with my “func” while writing a smart contract. Can anyone help me resolve this?

&rey: Is there any chance that ref code has fixed length in bytes? (reply to 135912)

WhyesCode: Can you share the error code? (reply to 135915)

Nerses: I have tried several ways for example what you have already suggested in Russian chat of TON (send in mode SendRemainingBalance) but it also didnt work (reply to 135851)

Nerses: her is the tx https://testnet.tonviewer.com/transaction/3308fd1fd8148993bd56a47e25315a869f40fda1f47dea3149fae5f64cffdbad (reply to 135919)

User<7158594595>: um... how about this? cell referralId = forward_payload~load_ref(); ...   cell message_body = begin_cell() ;; Creating a cell with message                         .store_uint(0, 32)                         .store_slice(referralId.begin_parse())                         .store_uint(pool_realBaseReserves + jetton_amount, 64)                         .store_uint(pool_realQuoteReserves - quote_amount, 64)                         .store_uint(quote_amount, 64)                         .store_uint(jetton_amount, 64)                         .end_cell();   var msg = begin_cell()                 .store_uint(0x18, 6) ;; nobounce                 .store_slice(fee_address)                 .store_coins(fee_amount)                 .store_msgbody_prefix_ref(message_body)                 .end_cell();                  send_raw_message(msg, 1); (reply to 135916)

&rey: I have not said "send in mode SendRemainingBalance"; I have said that plus "with value 0" and you managed to ignore that.  (And the message discussed must be sent last, after any logs.) (reply to 135920)

Nerses: thanks for clarification.It worked (reply to 135922)

Rusty | Titan: Recently I found out that TON Core reduced blocktimes on the network. Does anyone know where the official announcements are from TON core regarding network upgrades and/or planning changes?

&rey: Don't forget to check if news mislead you. As for official announcements, any validator-related changes go through https://t.me/tonstatus. (reply to 135924)

Rusty | Titan: hmmm last update was dec 17

Rusty | Titan: does that mean blocktimes were not actually reduced this year - i saw the news on twitter Jan 7

&rey: This plot is reflecting reality more precisely. (reply to 135929)

Rusty | Titan: Ok thanks for this (reply to 135930)

Rusty | Titan: Looks like block times are increasing

&rey: Rate, not time. (reply to 135933)

Rusty | Titan: Yep typo*

Rusty | Titan: Is this on dune? (reply to 135930)

Виконт vangaard: Where did you get this chart? (reply to 135930)

&rey: I'm not sure but I've come across it really recently. That same data can be constructed from Tonviewer I guess. (reply to 135937)

Tolya: Currently in @tolya (eng) or @anatolii_makosov (rus).  Also we plan to create ton core channel soon.  As for reducing block times - this is the result of our 9 updates over the past year https://github.com/ton-blockchain/ton/releases (reply to 135924)

Rusty | Titan: ok this is the info i was looking for

Rusty | Titan: appreciate it

Rusty | Titan: Do you know a good dashboard for TON validator stats?

Tolya: are you validator?

Rusty | Titan: no a TON DeFi builder - but we're planning on spinning one up

User<7158594595>: anyone can help me? (reply to 135921)

A: tonlibjson.amd64.dll  where should i get this file?

Dom: Probably github (reply to 135955)

A: not found there (reply to 135957)

Nolan: I have a query regarding handling of arbitrary JettonTokens in my contract, I saw that the packing for wallets could be in different formats.  For exaample in the ton-blockchain group for the minter-contract repo, the Jetton Minter packs the data as:  cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {    return  begin_cell()             .store_coins(balance)             .store_slice(owner_address)             .store_slice(jetton_master_address)             .store_ref(jetton_wallet_code)            .end_cell(); }   Where as in the in the same group for the stablecoin it is packed as:   cell pack_jetton_wallet_data(int status, int balance, slice owner_address, slice jetton_master_address) inline {     return begin_cell()     .store_uint(status, STATUS_SIZE)     .store_coins(balance)     .store_slice(owner_address)     .store_slice(jetton_master_address)     .end_cell(); }   For my contract to handle any arbitrary token, it needs to calculate calculate_user_jetton_wallet_address for that jetton which will in turn use the pack_jetton_wallet_data.   So how will my contract know which packing to use?   I thought if I pass packed_data as argument that should solve the issue as I do store jetton_master_addresses for allowed assets, and if I can somehow only extract the master_address, I can match it with asset-mapping to validate correct mapping.   Then calculating wallet address based on the packed_data is easy.

Nerses: is it good practise to hard code storage fee in smart contract ?

Nerses: or is there better way to make message sender to pay for storage fees ?

Vova: how to check owener of smartcontract

&rey: There's no such thing in general. (reply to 135964)

Nolan: why is it that the compiler does not give any error with this snippet:    if (op == op::claim_receipt) {         slice receiver_address = in_msg_body~load_msg_addr();         int receipt_index = in_msg_body~load_uint(32);         cell asset_jetton_wallet_code = in_msg_body~load_ref();         ;;int gasAmount = in_msg_body~load_coins();   Where if I just comment out gasAmount,    if (op == op::claim_receipt) {         slice receiver_address = in_msg_body~load_msg_addr();         int receipt_index = in_msg_body~load_uint(32);         cell asset_jetton_wallet_code = in_msg_body~load_ref();         int gasAmount = in_msg_body~load_coins();   it gives error:   $ blueprint build STokenMinter Using file: STokenMinter Build script running, compiling STokenMinter Error: FunC compilation error: fatal: unknown assembler operation  I have done the same thing at multiple different places where I use in_msg_body~load_coins(); and it works perfectly, but now it is failing?

Ruoqian: /stat@combot

Combot: Total messages:135968

YAMAHA: Seed (reply to 135973)

&rey: Russian chat is @tondev, English chat is here.  Check out settings, wallet version should be choosable there. (reply to 135973)

Farhad: i would like to develop an html code which converts the raw hex address to user-friendly address using tonconnect-sdk. could you help me? i do not know how to use toUserFriendlyAddress method?

&rey: You would like to create a JS code (in HTML page) which converts the raw HEX address to user-friendly address the same way as https://ton.org/address does, using the library which is suitable for that (instead of TON Connect 2 which is for writing into blockchain). (reply to 135987)

Farhad: how can i use toUserFriendlyAddress method? (reply to 135989)

Nerses: is there any differences on signing and signature verifying between wallet version w4 and w5r1 ?

&rey: How can one use the transferNftsFromYourWallet method?))) Alternatively, what are you talking about? (reply to 135990)

Farhad: i mean toUserFriendlyAddress function has not been defined in tonconnect-sdk.min.js. how can i load it in HTML? (reply to 135996)

&rey: Please read my first reply, on the chance it hints you how it is actually done. (reply to 135997)

Farhad: i checked it. it uses tonweb code. (reply to 135999)

Vini: Hello, can I have a better explanation about how this works please? "If you have not used your TON Wallet for a significant period of time (1 year), you will have to pay a significantly larger commission than usual because the wallet pays commission on sending and receiving transactions". Is the "duration" param in the storage fee calculation related to the "idle" period?

— 2025-01-11 —

Nakli Aman: Hey bothers i made a mess,i accidently sent 21,000 $ worth of TON and telegram numbers to a W5 Testnet  i was migrating my wallet and while using tonkeeper, i accidentally imported my seed to testnet wallet  is der any way to recover funds, i still have the private keys and seed   any help and guide would be appreciated

Nakli Aman: Can you help me with any library that converts seed to private key (reply to 136056)

Nakli Aman: if i can private key from testnet and import it mainnet it should allow me ro access my funds

Nakli Aman: yes then how was i able to send to testnet address

Nakli Aman: plus the address looks different, when i open on blockexplorer or when i connect with fragment

Nakli Aman: but on fragment it looks like this

Nakli Aman: i can connect to fragment

Nakli Aman: and few other websites

Nakli Aman: but when i try to transfer my wallet detects that i have 0 balance, and stops me

Nakli Aman: which means i can access the wallet only if i knew how testnets and mainnet wallet private keys are genrated

&rey: (private keys are same but subwallet IDs are different) (reply to 136073)

Nakli Aman: you missing the point (reply to 136075)

&rey: I guess you can use TonDevWallet by @TrueCarry to import the same mnemonic with "custom" subwallet ID. If that doesn't help, it would be strange. (reply to 136055)

Nakli Aman: sounds helpful (reply to 136078)

&rey: bug 2) was fixed with wallets of version 5 (reply to 136075)

&rey: Why bug? Because with same address, any transfer would go through both in mainnet and testnet. That's not very granular...  Fortunately, now Tonkeeper uses one subwallet ID for mainnet and another for testnet. (reply to 136083)

Nakli Aman: bot removed my video

Nakli Aman: i sent here, it went here (reply to 136067)

Nakli Aman: can't upload img or videos here

Nakli Aman: Somehow this mainnet address is being generated from my testnet address

&rey: I reported that TK bug on your behalf. (reply to 136095)

Nakli Aman: thanks, i already see someone report this, but i lost a lot of funds

Nakli Aman: thanks a million, trying this (reply to 136078)

Ирина Л Ирина: Hi

Ирина Л Ирина: Im looking for ux/ui designers, Developer of tact, func, tester and  investors for my Tap to earn ton game

Nakli Aman: Thanks to @TrueCarry    He added Custom Updates to his app Which now supports BIP as well as TON seed

Nolan: @pcrafter   I am stuck at a point where my flow is like this:  I have a manager contract that needs to make calls to a JettonMinter contract to Mint tokens.   So essentially it needs to invoke op::mint on JettonMinter which will then invoke op::internal_transfer on the jetton wallet.   I have structured the code in the following way:   (cell) create_mint_master_message(int query_id, int token_amount, slice jetton_master_address) {   cell master_msg = begin_cell()             .store_uint(op::internal_transfer, 32)              .store_uint(query_id, 64)                  .store_coins(token_amount)              .store_uint(0, 2)              .store_slice(jetton_master_address)             .store_coins(0)             .end_cell();   return master_msg; }  (cell) create_mint_message(int query_id, int gasAmount, slice receiver, cell master_msg) {   var msg = begin_cell()         .store_uint(op::mint, 32)         .store_uint(query_id, 64)         .store_slice(receiver)         .store_coins(gasAmount)         .store_ref(master_msg)         .end_cell();    return msg; }    And I am calling the it from the Manager contract with:   ;; call mint on yToken (yTokenMinter), first create master message     cell master_msg = create_mint_master_message(0, balanceAmount, g_yToken);      ;; call mint on yToken (yTokenMinter) to mint tokens to receiver     var mint_msg = create_mint_message(0, tokenGas, receiver, master_msg);      var msg = begin_cell()             .store_uint(0x18, 6)             .store_slice(g_yToken)              .store_coins(managerGas)             .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)             .store_ref(mint_msg);      send_raw_message(msg.end_cell(), 1);    While testing I am getting variable errors, sometimes exitCode 9, other times exit code 5 not sure what is causing issue

Nolan: the mint in JettonMinter is defined as:  if (op == op::mint) {         ;; Only minter_redeemer can mint         throw_unless(73, has_minter_redeemer_role(sender_address));         throw_unless(74, g_isPaused == 0);         slice to_address = in_msg_body~load_msg_addr();         int amount = in_msg_body~load_coins();         cell master_msg = in_msg_body~load_ref();          ;; The next lines are standard from the original code         slice master_msg_cs = master_msg.begin_parse();         master_msg_cs~skip_bits(32 + 64); ;; skip op + query_id         int jetton_amount = master_msg_cs~load_coins();          ;; check blacklist         throw_unless(0xBA, is_blacklisted(to_address) == 0);          mint_tokens(to_address, g_jettonWalletCode, amount, master_msg);         g_totalSupply += jetton_amount;         save_data();         return ();     }    and it works perfectly independently, if I try to directly call it from FE, it mints the tokens to the receiver (reply to 136141)

Nolan: so the only issue could be the way ManagerContract is unable to call Mint on JettonMinter, from the tests it seems as if the call is not even going to Minter and is returning from the manager itself

Nolan: if anyone could help with this, that would be great, been stuck on trying to resolve this for the entire day

Africhain: Sure (reply to 136144)

&rey: You generally must not ask for DMs. (reply to 136148)

Nolan: the issue was solved, there was a type mismatch in the way I was loading fee and jetton amount causing issue inthe master_msg (reply to 136144)

Joker: Hello! Can you help me, please? I looking for way how I can get sale contract address (nft_sale_getgems_v3) for nft by nft address?  Example sale contract in testnet is: https://testnet.tonviewer.com/kQDAFv6GP2a_AUXfG1AG6191kf82SGtU5JJO8-VHTmdCHm6Q?section=nfts

DreamHigh: I am full stack developer and looking for new job opportunities

O(log(n)): when I use the sendTransaction method of ton-connect I don't have this part.   I'm missing something?

Mr: Can anyone help me with the issue I'm having with ton connect UI   I'm trying to transfer ton and Jetton after connecting the ton wallet to the website but when the transaction prompt comes up it says unable to calculate fee

— 2025-01-12 —

doni: does anyone use this tool ?   is there any pagination support for the graphql DB ?   https://dapp-01.tontech.io/graphql

&rey: What do you want to accomplish and what's the current list of scripts? (reply to 136322)

Mohammad: Hello friends, I have a few questions concerning NFT storage fees on the TON network:  1. How long can an NFT with an initial balance of 0.05 TON be expected to remain active before its storage balance is depleted? 2. If an NFT's storage balance falls below the required threshold and it becomes "frozen," what are the necessary steps to restore its functionality? Is it essential to have the original code and data from the NFT's last active state to re-deploy it after a freeze? 3. Who is ultimately responsible for ensuring an NFT's storage balance remains sufficient to prevent freezing? Is it the owner's obligation to regularly top up the NFT's balance? 4. What are the consequences of a .ton DNS NFT depleting its storage balance? Will the associated DNS record be permanently lost, or can it be recovered from the DNS collection during a future deployment attempt?

4Basic: Did u build a website on .ton DNS ?

TheCryptoSamaritan: Hi I am looking for backend engineers with experience building on TON for a trading bot project.

&rey: 1. Depends on onchain content size. 2. Send message paying for storage, with StateInit = last stored state. Anyone can do this. Yes, having those cells is required; if archival nodes are available, that is quite easy. 3. Whoever sends messages to the NFT. Generally, owner's. 4. Resolution will fail until contract is unfrozen, as that's all stored onchain. (reply to 136332)

— 2025-01-13 —

Combot: Combot has warned Toffees.flex. Mcnde (1/3) Reason: 1 reports (reply to 136387)

cm4a: can I create my ton wallet via ton api

&rey: A wallet on TON needs a keypair — secret key, which MUST only be held by you, and public key matching the former. Given this definition, you may know that no API can create you a true wallet, it must be done locally. (reply to 136394)

KBA07: I created a v5r1 wallet - https://testnet.tonscan.org/address/0QAdruGTQCCTU6UtetvkAFsguRiY0YqGxEkmUFv_jxinvoOh Upon initialising the contract i saw that it received 1 AIOTX. Is it expected?

User<7158594595>: kind of marketing, promo, you can ignore it (reply to 136397)

KBA07: This will not impact the wallet behaviour, rent or transaction fee in any sort right?

fedya eremin: Hello, may I ask a question about TonConnect TonProof verification here?

ROST & FLAME: I’m using func 0.4.6 and encountering a syntax error. Does anyone know how to help?

Nick: Hi is it possible to create TON wallet using rust (maybe the tonlib create), or do I need to use wallet app like tonkeeper to create it? Thank you

Nick: *It can be using any crate or maybe using the api, because all i see is deriving an existing wallet instead of creating a new TON wallet

User<7158594595>: Yep (reply to 136399)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 56 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 31  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

O(log(n)): Can anyone help here? (reply to 136189)

&rey: Perhaps you are missing the understanding what Tonkeeper shows. (reply to 136189)

O(log(n)): Yes I'm still learning, and I'm a little perplexed. For example here it's in my wallet.   I'm actually trying to learn how to display this part (reply to 136432)

&rey: you have been misled. That's akin to "how to make a ball fall from the sky to you". (reply to 136436)

User<7158594595>: so it's simulation, which you can't control it. (reply to 136436)

O(log(n)): okay hahahah so it's not possible to reproduce this scenario using only sendTransaction ? (reply to 136437)

O(log(n)): so it's simulated by the wallet? (reply to 136439)

User<7158594595>: by the blockchain, wallet just shows that information to you

O(log(n)): ok got it, do you've a resource that can help me simulate this by the Blockchain? (reply to 136442)

&rey: Yes. There must be a counterparty (smart contract) which will automatically send the response message to you. (reply to 136440)

&rey: Using the metaphor with a ball, either you have to send it into the sky so that it then falls, or someone must throw it at you.

Akachi: Interested (reply to 136365)

O(log(n)): well if I understand your balloon metaphor correctly: Send the ball into the sky = you send a transaction to a smart contract  Someone sends the ball back to you = the smart contract responds with another transaction (reply to 136445)

Ivan: Hello everyone! I hope you're doing well. I have a somewhat unusual request, but it’s important for a project I'm working on. I need to test on the TON testnet and require about 10,000 TON for that purpose. If anyone is able to help, I would greatly appreciate it. Thank you so much in advance! 🙏 0QA-q5mP8QBgLv9AGelDYUv3KfNmzF4JfnzmBe_JRJa6Yf_L

TON Bounty Bridge: ​Help improve your ecosystem  🏷 Developer Tool  Summary:In all points, this ecosystem is the best, and in my opinion, a tool should be used for the particip...  Created by AMG8569

Insomnia: Hello Friends

Insomnia: Just out of curiosity, is it possible to produce smart contractless tokens?

Insomnia: I heard something like this

WhyesCode: I can assist you if you still need help with it. (reply to 136190)

WhyesCode: ? (reply to 136358)

WhyesCode: Contractless? How will the transactions happen? (reply to 136460)

Freddy | metafields.xyz: was wondering the same (reply to 136466)

Altaaf | proSEED: I need a smart contract Dev to voluntarily work with a certain project building on TON.

&rey: Inscriptions? Those things have zero onchain guarantee, I'm not sure what's there to talk about. (reply to 136460)

&rey: It might help if you at least named an area (DEX / NFT lending / timer / ...) and role (J/M/S/TL/Arch). (reply to 136476)

&: DM me (reply to 136476)

&rey: Welcome to permanent ban for begging. (reply to 136497)

Vl: Hello. What are some nodejs sdk's for listening to blocks in TON?

— 2025-01-14 —

&rey: — https://github.com/toncenter/examples/tree/main/block (polling Toncenter) — SSE-subscribing to Tonapi (not sure where the SDK might be) (reply to 136500)

Vl: thx. How relevant is this solution? And what should I use for a stable Raw or index solution? (reply to 136501)

Victor: hello, guys. I am trying to make highload wallet v3. but there were many problem. please help me.   OKX hot wallet ( highload wallet v3 ) can  send many different transaction in a second that ignore SeqNo and send it.   I want to make the same wallet as okx. Currently deployed highload wallet contract, but I don't know how to configure transfer code.   highload wallet has different function as opposed to a WalletContractV3 wallet.  Could you help me how to make many different transfer by highload wallet?

WhyesCode: Are you gonna pay? (reply to 136516)

TTY: Hi guys, I got this transaction:  {   "ok": true,   "result": [     {       "@type": "raw.transaction",       "address": {         "@type": "accountAddress",         "account_address": "EQC38obx9nMfL6pCJu3ItwqKumu0OvN-1FzDcHfDAVHqlZwj"       },       "utime": 1736752063,       "data": "te6cckECCQEAAgMAA7V7fyhvH2cx8vqkIm7ci3Coq6a7Q6837UXMNwd8MBUeqVAAAwFXa0sgFJb7neX7Jwlfq/mu9y6sSM0Ha8VWR8n+tmROU+w5r6QQAAMBVpS3fBZ4S7vwABRgwaBIAQIDAQGgBACCcmDW6frR8WbXP1+zslKJ6rVZW3o3m3SzZeRwCExH9JeIPtRJsvPTb7208ov0cAG7vWUyM24zcNfixHA0pLFS06ECFwxkiQBMS0AYYMGOEQcIAbFIAFjqkJS4y2vnma1zbAj0ipGVE1P3jJdXL54+XHc0G19zAC38obx9nMfL6pCJu3ItwqKumu0OvN+1FzDcHfDAVHqlUATEtAAGELteAABgKu0N1oTPCXduwAUBYnNi0JwAAAAAAAAAADD0JAgBod4lLoz4YF0eEBwrAiygMUlN02Hn8MRCCE7JfDs4l+sGAHQAAAAAMjAyNTAxMTMwNzA3MDYzNjItMTNjZDkzNGQtMzk0Ni00Y2M3LWI1NGYtYWE4NTQ2MmIyODk4AJxAe+sNQAAAAAAAAAAAHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAW8AAAAAAAAAAAAAAAAEtRS2kSeULjPfdJ4YfFGEir+G1RruLcPyCFvDGFBOfjgSM28H7",       "transaction_id": {         "@type": "internal.transactionId",         "lt": "52868744000001",         "hash": "TEP4JJNrAPQMxmJk/ktI09kHxk23ggxHoY/4UzF3++c="       },       "fee": "396546",       "storage_fee": "146",       "other_fee": "396400",       "in_msg": {         "@type": "raw.message",         "source": "EQAsdUhKXGW188zWubYEekVIyomp-8ZLq5fPHy47mg2vueTu",         "destination": "EQC38obx9nMfL6pCJu3ItwqKumu0OvN-1FzDcHfDAVHqlZwj",         "value": "20000000",         "fwd_fee": "548271",         "ihr_fee": "0",         "created_lt": "52868741000002",         "body_hash": "TRfKvtHc3SVoJ8DLAbrlAwzeFvk662TF6k4zWSKGMT8=",         "msg_data": {           "@type": "msg.dataRaw",           "body": "te6cckEBAgEAcAABYnNi0JwAAAAAAAAAADD0JAgBod4lLoz4YF0eEBwrAiygMUlN02Hn8MRCCE7JfDs4l+sBAHQAAAAAMjAyNTAxMTMwNzA3MDYzNjItMTNjZDkzNGQtMzk0Ni00Y2M3LWI1NGYtYWE4NTQ2MmIyODk47GsEjw==",           "init_state": ""         },         "message": "c2LQnAAAAAAAAAAAMPQkCAGh3iUujPhgXR4QHCsCLKAxSU3TYefwxEIITsl8OziX6w==\n"       },       "out_msgs": []     }   ] }

TTY: I am wondering is there any way to parse the body? Or parse the message? "msg_data": {           "@type": "msg.dataRaw",           "body": "te6cckEBAgEAcAABYnNi0JwAAAAAAAAAADD0JAgBod4lLoz4YF0eEBwrAiygMUlN02Hn8MRCCE7JfDs4l+sBAHQAAAAAMjAyNTAxMTMwNzA3MDYzNjItMTNjZDkzNGQtMzk0Ni00Y2M3LWI1NGYtYWE4NTQ2MmIyODk47GsEjw==",           "init_state": ""         },

Bluepot: Hello guys, I am trying to transfer jetton and ton using v5 wallet on the node backend. Anyone can help me?

WhyesCode: Reach out (reply to 136553)

Tom - Bushi: hi all, is it possible to send an encrypted message where the receiver pays for the transfer? Basically to allow a web2 person to send a message without having to hold TON for gas

fraffo: Hello, any news on the status of Ton Proxy and Ton Storage?

dorkydork: anyone doing the challenge?

Alchi: You can refer to docs.ton.org to get detailed help about high-load wallet v3 (reply to 136516)

Tigran: Hello guys, im trying to rewrite funct to transfer TON coin with BoC.       const body = beginCell()        .storeBuffer(signature)        .storeUint(transaction.validUntil, 64)        .storeUint(transaction.messages[0].amount, 64)        .endCell();      const externalMessage = beginCell()       .storeUint(0b10, 2)       .storeUint(0, 2)       .storeAddress(address)       .storeCoins(0)       .storeBit(0)       .storeBit(1)       .storeRef(body)       .endCell();      const client = new TonClient({        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",        apiKey:          "...",      });        client.sendFile(signedMessage.toBoc());  but im getting error (pic). Can you help me pls, what im doing wrong...

&rey: There isn't such a way on blockchain. In fact, it would be a very bad idea for obvious reasons. (reply to 136556)

Bruno A.: Hello, does anyone have any code on github or api to detect new pools/pairs? I was trying to use the tonscan API, but I couldn't do it that way. Similar to the services that some DEXs have, to identify new pairs created, I was wondering if anyone has already done something like this and could give me a hint, since I wanted to complete this step so that I could continue with the application I have in mind.

LJCrypto: Hello guys, I'm using the tonconnnectUI sdk and I'm testing out a simple transaction but I keep running into this error on TonKeeper. Why could this be the case

Anoke: hi u can check this sample with /ton/ton it helped me  https://github.com/ton-org/ton/issues/44 (reply to 136567)

Tom - Bushi: of course I meant assuming the receiver would be willing to pay for such a message, not that someone can just use the funds of others 😅 (reply to 136576)

B.o.L.o: hey guys , I'm looking for an open-source payment solution on TON similar to SolanaPay or Coinbase Commerce. Do know any project ?

&rey: Certainly! https://github.com/gobicycle/bicycle. (reply to 136582)

&rey: If senders' list is limited, that can be done with a separate contract. If not, then messages have to be already transmitted prior to accepting them, so there's no point in blockchain. (reply to 136580)

B.o.L.o: Not sure if I can do something like this: A customer wallet interacts with a smart contract, sends money to the smart contract, and then the smart contract splits the money between two addresses. Before building something like this, I was looking for similar projects. (reply to 136587)

WhyesCode: Got any help? (reply to 136578)

Bright✌: Hello guys, i need some explaiantion on adding the isFullscreen to a mini app

jennifer [afk]: @devs (reply to 136600)

LJCrypto: No, I haven't (reply to 136597)

WhyesCode: I can send you a frontend sample you can use. (reply to 136605)

— 2025-01-15 —

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: 1. Ensure you are using same network as your wallet  2. If you are in localhost env, make sure your manifest uses same url (reply to 136605)

LJCrypto: Sure (reply to 136613)

Nick: Hi guys when i use the testnet toncenter api https://testnet.toncenter.com/api/v2/sendBocReturnHash using v5 wallet, i got:  {   "ok": false,   "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction B0155BBFB7E37BC7C0EEDC17742B48517A2352CDDF4F71C6042087165E6B70D0:\nexitcode=135, steps=45, gas_used=0\nVM Log (truncated):\n...HG s10\nexecute HASHSU\nexecute XCHG3 s0,s12,s12\nexecute CHKSIGNU\nexecute PUSHCONT x28945F0ADB31E1F2C087\nexecute IFNOT\nexecute PUSH s8\nexecute PUSHCONT x5F0ADB31\nexecute IFNOTJMP\nexecute THROW 135\ndefault exception handler, terminating vm with exit code 135\n",   "code": 500 }  Any ideas?

&rey: The signature you provided was invalid. (reply to 136621)

Nick: 1) Is it only for the v5 wallet only when sending? 2) What causes it? Because when im using v4, i have no issues (reply to 136623)

Nick: I'm using this crate: https://github.com/mitinarseny/toner (reply to 136624)

&rey: They forgot that opcode has also to be signed. (reply to 136625)

Bright✌: Anyone pls (reply to 136600)

Nick: Any suggestions? Should i use different crate? Or perhaps sign the opcode myself?  Btw i apologize if i ask too many questions, I’m new to the ton community (reply to 136627)

ForestCat🐾: I'm building a betting platform on the TON blockchain, and I want to include the following feature: when a user creates an account on the platform, they should automatically see their TON wallet address and memo without using the "Connect Wallet" button. Would this be possible?

&rey: Sign yourself; perhaps you'll be able to reuse some code. signed_request$_             // 32 (opcode from outer)   wallet_id:    #            // 32   valid_until:  #            // 32   msg_seqno:    #            // 32   inner:        InnerRequest //   signature:    bits512      // 512 (reply to 136630)

Nick: I’ll keep you posted, btw if you want to see the code with the error, i posted it here:  https://github.com/mitinarseny/toner/issues/9 (reply to 136632)

ForestCat🐾: ? (reply to 136631)

Andy: You could derive the private key from some user data and make a wallet based on that, signing and sending transactions on the server side. Not the best idea for security though (reply to 136631)

Lalit: Hello

Howard: Has anyone encountered a situation where the toncenter send message response in_msg different from the in_msg on the chain?

&: Impossible.  How about login with ton wallet? (reply to 136631)

User<7158594595>: sorry, not possible (reply to 136631)

Legend: I think that is possible. (reply to 136631)

Theo: Hi guys, I am new to blockchain so hope you guys don't mind me asking some silly questions. May i ask how can I get usdt (tip-3) tokens to my TON testnet? I have been trying to find a faucet but I could only find Testgiver for TON but not usdt🥲

LC💎: Hello, how to solve the problem of showing unverified tokens?

&rey: Well I don't think Tether have issued any test-stablecoins so you can use ANY jetton you like (preferably with decimals=6). A new one can be created on https://minter.ton.org/?testnet=true. (reply to 136658)

Theo: thanks for your help. i tried to scan the qr code in connect wallet but seems it doesn work on my desktop. and the connect wallet button has no resp on my mobile 🙁

Assistant ROM: Does anyone have expertise in JS and making contracts? I want to run something

WhyesCode: Yes. What is it that you want to run? (reply to 136663)

SynthLuvr: Do you have launchpad ready now? (reply to 123914)

SynthLuvr: Does anyone know of TON launchpad? Originally we were going to use PinkSale but they're facing some technical difficulties with TON

SynthLuvr: I need it ready today 😅 We planned to go live with PinkSale but didn't realize until yesterday that it's broken

User<7158594595>: I did complete on dedust (reply to 136672)

SynthLuvr: I don't see any launchpad on dedust. How did you do it? (reply to 136673)

&rey: I've heard of TONRaffles. (reply to 136669)

SynthLuvr: Interesting. I try to create and it gives error: This token is not supported. Please use a modern token. Not sure what that means (reply to 136678)

klass: Hello, searching for work! My CV: https://drive.google.com/file/d/1w4fzhfxYkRrvFsTOt3r92hupUgL-XLHc/view?usp=sharing

&rey: I'd like to test your expertise?  The validation question is: 1) given a game server that wants to increase players' score (aka mint more jettons to them), 2) given that number of players may be quite high so we want users to pay for recording score in blockchain, 3) given a feature that users should be able to record several victories at once, using one transaction tree (to save on gas), how can this scheme be built? (Btw there is an ideal answer.) (reply to 136681)

klass: To address the described scenario optimally, here’s the ideal approach to structuring this scheme:  ---  ### 1. Smart Contract Design for Score Recording  #### a. Batch Recording Mechanism Design a smart contract that: - Supports batch transactions where multiple scores (or victories) can be recorded in a single transaction. - Accepts a list of victories with corresponding data (e.g., player ID, score increment, timestamp).  #### b. Payment Integration - Require users to include a payment in their transaction to cover the cost of recording the scores.  - The payment amount can be proportional to the number of victories recorded to ensure fairness and cover gas fees.  #### c. Verification - Use cryptographic signatures to verify that the data submitted (victories and scores) is valid and not tampered with. - Optionally, implement anti-cheat mechanisms if the scores originate from a game server.  ---  ### 2. Efficient Gas Usage via Merkle Trees To reduce gas fees when recording multiple victories: - Merkle Tree Structure:    - Players (or the server) construct a Merkle tree off-chain where each leaf represents a single victory.   - Submit the Merkle root to the smart contract in a single transaction.   - Store the root on-chain for verification purposes. - Proof-Based Verification:   - Allow players to submit individual victory proofs later if needed (e.g., for disputes or further validation).   - The proof will verify against the Merkle root stored on-chain.  ---  ### 3. Gas Payment Management - Players prepay a balance into the contract or include the payment directly in the batch transaction. - Deduct gas fees for recording scores from the prepaid balance.  ---  ### 4. Player-Oriented UX - Provide tools (e.g., a web app or SDK) to help players construct the Merkle tree and batch their victories. - Automate signing and submission of transactions for convenience.  ---  ### 5. Scalability and Security - Scalability: Use rollups or sidechains if the number of players is exceptionally high, with periodic settlement on the main chain. - Security: Regularly audit the smart contract and ensure it handles edge cases to prevent abuse.  ---  ### Ideal Flow 1. Player Wins Games: Off-chain, the game server tracks victories. 2. Batch Submission:     - The player (or game server) batches multiple victories into a Merkle tree.    - Sends the root and required payment in a single transaction to the contract. 3. Contract Validation:    - Contract validates the payment and stores the Merkle root.    - Optionally records a summary of the scores on-chain. 4. Optional Individual Proofs: Players can later submit individual proofs if needed.  ---  Would you say this aligns with your ideal answer? If not, let me know what I missed! (reply to 136682)

Egor: Hello everyone. I need some help: I'm working on a React app with Telegram UI and trying to connect to Tonkeeper from the Telegram desktop app, but the wallet doesn't recognize the app. Everything works fine from mobile and web. Has anyone encountered this issue?

Danny: may i ask if anyone has the exp of integrating tonConnect to react for web development? i wonder if there is a way to get the balances of different tokens separately.   i have been reading toncenter API but seems it only shows the overall balance of the wallet. thank you!

Legend: There is API for getting getton balance in tonapi. (reply to 136691)

Kirill: Maybe someone needs a Golang developer in your team? I want to join a project that is related to web3.

KBA07: What is the minimum ton balance which should be kept to initialise the wallet contract. The doc mentions 3. I have done it with 2 ton in the testnet account. The actual contract call only takes ~0.01 Ton.

KBA07: Is it fine to keep 1 Ton for simplicity?

Danny: i am reading it now. thank you for your reply😀 (reply to 136692)

fraffo: again, any news on ton storage and ton proxy? (reply to 136563)

Vanshika: Hi everyone, can anyone please tell me how the ADNL address is generated when we run a validator node in TON? is it bound to the public ip of our server?

Xonxora: The minimum TON balance required to initialize a wallet contract typically depends on the network's settings and the specific contract implementation. In the case of the TON blockchain, the 3 TON minimum mentioned in the documentation is generally the minimum required for wallet initialization, including storage and operational costs for the contract.  However, in your testnet experience, the actual contract call only took ~0.01 TON, which is expected since the contract itself consumes much less during execution. The extra balance likely accounts for the initial contract setup, including potential fees for deployment and storage, not just the actual transaction cost.  In the testnet, this might be relaxed to allow for easier testing, hence you were able to initialize it with 2 TON instead of the full 3 TON. But for mainnet deployment, you should ensure the full 3 TON balance to cover initialization and unforeseen costs. (reply to 136702)

Xonxora: - The ADNL address is derived from the public key of the validator, not directly tied to the server’s IP. - The public IP is used for node discovery, but the ADNL address itself remains constant and is not dependent on the server's IP. - If the IP changes, the node might need to re-register its information, but the ADNL address will not change as long as the public key stays the same. (reply to 136715)

Anoke: I've just now faced sth like this problem, it was for me because i didn't provide init field in external message, maybe same for u (reply to 136624)

Vanshika: Public key as in validator’s public key? (reply to 136718)

Xonxora: Yes, the ADNL address is tied to the validator’s public key in the TON network. (reply to 136721)

Vanshika: I was running ton node in docker container And I was testing something like what will happen if the server stops abruptly or the container will get killed; so I stopped the container and deleted it with its mounted volumes But when I tried to run the container again without the backed up config file, I could see the old details, the ADNL addresses, the keys, wallet everything was there How did this happen?

Vanshika: My expectations were that it will run as a fresh node And then I can replace the configs with the backed up configs; then I will get the data

Xonxora: When you ran the TON node in the Docker container, the key components like the ADNL address, validator keys, and wallet details were likely stored inside the container's filesystem or mounted volumes that were bound to the host machine. (reply to 136723)

Vanshika: Yeah but I deleted the mounted volumes as well as the whole container (reply to 136725)

Xonxora: When you stopped and deleted the container without the backed-up config file, Docker might have still retained some data or state in the Docker volumes or persistent storage that was used by the container. (reply to 136725)

Vanshika: Yeah but I deleted it from there before starting the container again (reply to 136727)

Xonxora: Did you also delete images? (reply to 136726)

Vanshika: Yeah I tried doing that as well (reply to 136729)

Xonxora: When you run the following command, what can you see? docker image ls -a

Xonxora: Or you can see on Docker Desktop (reply to 136730)

Vanshika: Nothing, the list is empty (reply to 136731)

Xonxora: Ah, I see Also you can verify whether docker container and volumes are empty correctly docker ps -a docker volume ls (reply to 136733)

Vanshika: Yeah I have verified that It’s empty (reply to 136734)

Xonxora: If you suspect the data is stored on the host, manually check and delete any directories used for persistent data storage by your container (reply to 136735)

Vanshika: okay

cm4a: You mean it's not possible to create ton wallet (reply to 136655)

Nerses: what security issues can arise having same queryId for multiple tokenTransfer messages from same contract ?

Stephan: Hello everyone, please tell me: how to get the last masterchain block in TonClient?

Mozzy: Hello guys, I’m trying to set up a TON node, I’m using the pre build binaries…my only issue right now how to download the configuration files   Please can anyone help me with this?

Mozzy: This is my first time setting up a TON node or any node in particular

Gal: Hey Mozzy, I can’t help you with this information. I hope it’s fine to ask you questions, as a person that is new to this project and trying to learn more about it. Where I can see the amount of nodes, miners and validators in the network?  Good luck with becoming the next node 🤞🏽😉 (reply to 136746)

Combot: Combot has warned perfect 🚀 (1/3) Reason: Word **** is not allowed

Nerses: can SomeContract() be address in this example fromdocs let foundMeSome: Address = contractAddress(initOf SomeContract()); ?

&rey: Null. (reply to 136742)

&rey: Nodes: you'd probably have to join their overlay to know. Keep in mind that most are for private usage only.  Miners: 0. Validators: around 400 (https://tonviewer.com/config#34). (reply to 136756)

0xLucky: hello

Karen: Hi, everyone. I ran my tone-nodes, everything was cool until the moment when I was trying to send a request to lite-server.  The error is: [ 1][t 0][2025-01-15 18:36:06.253741175][TcpListener.cpp:64][!TcpListener[port:30003]]  Accept [ 1][t 0][2025-01-15 18:36:06.254725844][adnl-ext-server.cpp:64][!inconn]       failed to init crypto: [Error : 0 : ]  Could you help, please?

Gal: Thank you so much 🙏🏽 I would definitely check it out. Hope you’re fine with beginner enthusiastic questions 🤗 How come there are no miners? What secure the network? Only staking? (reply to 136775)

&rey: Validators' consensus, and those are indeed elected by stake. They provide amount exceeding 300'000 TON as a collateral for fair work; in total, that amounts to over billion TON being kept on the Elector contract. (reply to 136784)

&rey: The consensus mechanism is true BFT so unless 1/3 of validators (by stake) are unfair it is impossible to break something in the network. Those questions, including why mining was not chosen, are extensively described in TON whitepapers, and you can find those on docs.ton.org.

Gal: Thank you for sharing knowledge 🙏🏽 I will read and check the links you sent to learn more about TON .

Ihor Million: Hello devs!   I’m on my way to release my game project for ton by the end of Feb and I’m very interested in the marketing ways (any websites / channels / projects who want to partnership / your personal experience ) - I would be glad for any kind of help.  As well, if you can share the average CPA for telegram mini app (in tg ads) - I would be happy to hear. I decided to launch the game on TON first, instead of Sol. But tbh have no info about best channels to buy traffic

— 2025-01-16 —

King Panther: I developed an obfuscation transfer system purely for privacy purposes. It's currently in beta and running on the TON blockchain. I'd love to hear your thoughts!

Leo: Is it zk-based?

King Panther: No zk. Only proxy routings (reply to 136810)

Leo: So it's centralized? The privacy is just hidden publicly but exposed to proxies? (reply to 136812)

King Panther: No, it’s not centralized. The system is designed to enhance privacy without compromising user security. The proxies don’t have access to any user data, they simply facilitate the transaction flow. Everything is automated and handled off-chain to prevent any data exposure. No individual or entity can see or control user information. The goal is to protect privacy while maintaining security. (reply to 136817)

King Panther: Old school (reply to 136811)

DogeSaveTheGod: you get shit like this when you try to do fraud but are too stupid to (reply to 136809)

King Panther: This allows us to offer a more cost-effective and scalable solution for privacy-focused transfers. (reply to 136817)

Leo: I know but how, without zk? If everything is handled off-chain, it means the privacy is exposed to off-chain service provider right (reply to 136818)

King Panther: Fraud? It’s a privacy proxy service, nothing more. Protecting privacy isn’t illegal, people just call it fraud when they can’t figure out how it works. 😂 (reply to 136820)

King Panther: The system uses automated proxy wallets that don’t store or access any user data. Transactions are dynamically routed to break traceability, offering strong privacy without the high costs of ZK proofs. No off-chain provider ever sees or controls user information. (reply to 136822)

&rey: And rightly so in some cases.  To get more constructive: 1. What guarantees (aka mathematically/algorithmically proves) that transaction receiver, sender and value will not be reconstructed in reasonable time by any third party? 2. What guarantees that user funds will go to the indicated destination? (reply to 136823)

&rey: @silentiumcode  2. This is true. However, user generally knows where they connect their wallet. 3. Yes. It is a good idea to scan for outgoing messages on frontend and for incoming messages to your collecting contract(wallet) on backend.  Why delete?

Silentium: deleted message because I already understood how to implement tonconnect in my app  the question was:  1) How to request user to send given amount of TON to my address 2) How is authentication done? With my very limited understanding it seems that anyone can act as my app simply by providing url to my manifest.json and then request a transaction from user to his wallet 3) After I had sent transaction to user and he has confirmed it, what is the best practice I can use to set payment completed in my app? Should I maybe scan transactions on my wallet and search for tx from address of the connected wallet? (reply to 136835)

Silentium: anyway thanks

Aurora Brokerage &: Greetings everyone, Someone should educate me on how to join validate TON blockchain.

&rey: At the very least: mytonctrl, lack of documentation, and over 300'000 TON required. (reply to 136838)

Mikal: Is the anycast feature available on main net? It looks like addresses have support for an anycast feature, but I cannot find much more info that that.

&rey: I'd be delighted to hear results if you get to testing it. @ton/sandbox should emulate them just fine. (reply to 136857)

Maddy: How can I bridge a token from ETH to TON ? Does wormhole or other bridges do the token transfer or we need to create bridge to burn token and mint the token on TON ?

Mikal: Thanks for you answer 😄️️️️️️ I have not looked at testing it, but it is good to know that it is supported in the Sandbox. Do you know if it is enabled on testnet or mainnet? Or know of anywhere I could get answers to such questions? (reply to 136859)

Minimal ☄️: Anyone getting 'Context must be an Activity' error thrown on Testnet on TonKeeper wallet while signing on declining the transaction?  This error is killing me because when the user signs the transaction and sends the TON, I am unable to get event that he signed it, so I catch the error and accept the action the user paid for, and then verify it via backend,  but when the user declines the transaction in the wallet and this error is thrown, since I am unable to know because lack of an event if the user has declined the transaction, I am accepting it and after few minutes when it's not verified on the blockchain I am restarting it.  I don't like this because I am losing atomicity of action + sending of tx and it would be really ugly and unprofessional from the app's side

Adam: Who does can explain this, what these transactions for?

&rey: They are sent in attempt to scam users. (reply to 136873)

Silentium: hello, how do I retrieve transaction info by it`s boc?

IMe: anyone who has knowledge in telegram bots n pumpfun , let me know. Looking for a dev for paid work.

Anonymous💰: Hello. Pls let me know which is better between Ton and Eth.

Legend: I can do that, please let me know your detailed requirements. (reply to 136893)

0xLucky: As a full-stack and blockchain developer, I would be happy to assist you with your project involving Telegram bots and pumpfun development. (reply to 136893)

Anonymous💰: Can you share your idea? (reply to 136893)

Alchi: DM me. I have developed Pump.fun similar platform on TON blockchain. From smart contract to website. all of them (reply to 136893)

0xtitn: could you send me url? (reply to 136910)

WhyesCode: What specific functionalities do you need for the Telegram bot and PumpFun integration? (reply to 136893)

WhyesCode: It depends on you and your project. (reply to 136897)

&rey: By transaction BOC or external message BOC? (reply to 136887)

Silentium: i`m not sure. I am sending transaction to user for confirmation and the only output I get is some boc. I need to later validate that transaction was paid by this boc (reply to 136920)

&rey: The thing returned by TC2's sendTransaction is external message BOC. You can get representation hash of its cell and poll APIs with it (on frontend, obviously), then sending transaction lt and hash to backend to confirm. Also, check incoming messages on backend side. (reply to 136921)

Silentium: which API can I use? (reply to 136923)

&rey: Toncenter /api/v3/transactionsByMessage. (reply to 136924)

— 2025-01-17 —

Silentium: msg_hash is probably the field I need to send to retrieve transaction. I tried sending:  1. cell:  919[8801B33A35ADC144A16D7E2EC797ABF82CE49D6B5868418595485A86B444A7D3FDD4039B4B3B73FFFFF88B3C4F88580000019D93C28963186635E8B6F5E7F2991E915D406B69A76E4132AF20AA04CC7F219E0515661ACC9EA4B579F2A1C550A644D141B0809B9132EB3EC9502C69B19425040E] -> {   40[0EC3C86D03] -> {     0[],     416[62006CCE8D6B7051285B5F8BB1E5EAFE0B39275AD61A1061655216A1AD1129F4FF7521DCD6500000000000000000000000000000]   } }   2. cell.hash:  b'\x9c\xd1\x85\xfbH\x8a\xb61\xfd\x82\x15\xd3~ \xc7\xe5.$&6L\xda\x91\xcepGc&\xb9\xd32\xd7'   3. boc:  te6cckEBBAEAtwAB5YgBszo1rcFEoW1+LseXq/gs5J1rWGhBhZVIWoa0RKfT/dQDm0s7c///+Is8T4hYAAABnZPCiWMYZjXotvXn8pkekV1Aa2mnbkEyryCqBMx/IZ4FFWYazJ6ktXnyocVQpkTRQbCAm5Ey6z7JUCxpsZQlBA8BAgoOw8htAwMCAGhiAGzOjWtwUShbX4ux5er+CzknWtYaEGFlUhahrREp9P91IdzWUAAAAAAAAAAAAAAAAAAAAAD3wGN0  yet none of these fields are correct. how do I get msg_hash from external message BOC? (reply to 136925)

&rey: body_hash = cell.hash (reply to 136942)

Silentium: async def get_transaction_by_hash(self, cell_hash):         print(cell_hash)         async with self.session.get(                 url="https://toncenter.com/api/v3/transactionsByMessage",                 params={                         "body_hash": str(cell_hash)                 }) as response:                         if not response:                         print(response)                         return                     data = await response.json()                     print(data) this prints:  b'\x85B\xb9\xc2)\xd1\xc9\x1e\xde\xd6\x13\xc7\xcd\xde\xaf\xdev\xa5\xef\xdf{\xb5e\xff!|\x9a{&<\xff\xb5' {'error': 'failed to decode: schema: error converting value for "body_hash"'}

Silentium: if i send bytes without converting to string, it raises exception

Adam: Hi can you explain little bit more if it won't be a burden to you, thx UQBMoPulTVPGuC-8Hb0wIcN1GvBavBmpi9J6qWJfFjnLiWtb screen from this address (reply to 136874)

&rey: well, perhaps "body_hash": cell_hash.hex() ? (reply to 136946)

WhyesCode: If you need the script/frontend context for sending jetton successfully either in Reactjs or Vue3, let me know.

Silentium: this works, yet does not find transaction (reply to 136950)

Silentium: if i pass cell hash as msg_hash param it does. thanks, appreciate your help very much

&rey: Duly noted. Thanks. (reply to 136957)

Nolan: Is it possible to upgrade a contract A  to ContracAUpgraded by using set_data() and set_code(),  where Contract A needed variables A, B, C but ContractAUpgraded needs variables A,B,C,D?  If so how will this affect load_data() and save_data() of contractA which was programmed to only load and save 3 data variables but now the new code has 4 variables? (reply to 136959)

&rey: set_code changes code only. It seems you need to change data cell as well — this is usually done by invoking a provided upgrade continuation, (or may be done by set_data if you're sure the data will not be changed between sending upgrade message and acting on it.) (reply to 136960)

Nolan: so a single function like this should not be a a problem right, where I am setting both in one go?   if (op == op::upgrade) {         (cell new_data, cell new_code) = (in_msg_body~load_ref(), in_msg_body~load_ref());         in_msg_body.end_parse();         set_data(new_data);         set_code(new_code);         return ();     }

Nolan: this is something I saw being done in stablecoin-contract example in ton-blockchain repo (reply to 136962)

Johnny Le: const { TonClient, WalletContractV4, internal } = require("@ton/ton"); const { mnemonicToPrivateKey } = require("@ton/crypto"); require("buffer");  async function importWallet(   mnemonic,   endpoint = "https://toncenter.com/api/v2/jsonRPC" ) {   try {     console.log("Starting wallet import...");      const words = mnemonic.split(" ").filter((word) => word.length > 0);     if (words.length !== 12) {       throw new Error(         `Invalid number of words. Expected 12, got ${words.length}`       );     }      const client = new TonClient({       endpoint: endpoint,     });      console.log("Converting mnemonic to keypair...");     const keyPair = await mnemonicToPrivateKey(words);      console.log("Creating V4 wallet contract...");     const wallet = WalletContractV4.create({       workchain: 0,       publicKey: keyPair.publicKey,     });      const contract = client.open(wallet);      const address = contract.address.toString();     console.log("Wallet address:", address);      const balance = await contract.getBalance();     console.log("Balance:", balance.toString());      return {       success: true,       wallet: wallet,       contract: contract,       keyPair: keyPair,       address: address,       balance: balance,       client: client,     };   } catch (error) {     console.error("Error details:", error);     return {       success: false,       error: error.message,     };   } }

Johnny Le: but the wallet seems different to when I imported to ton keeper

Johnny Le: its 12 words seed phrases, pls check

&rey: But that's false. (reply to 136964)

Johnny Le: why its false (reply to 136969)

Johnny Le: mine is success but the address is totally different

&rey: Because TON uses a non-EVM-compatible algorithm for generating private keys from mnemonics, and it usually has 24 words as input. (reply to 136970)

Johnny Le: no I use okx and 12 words is that it returned (reply to 136974)

Nolan: @pcrafter anything on this? (reply to 136962)

&rey: That's not standard then. You have to find what algorithm is used by OKX for key derivation. (reply to 136976)

Johnny Le: Okay thank bro

&rey: What happens if you send upgrade message, then some change from a side message is done, and then the upgrade message arrives? (reply to 136962)

Nolan: the contract is pausable, so we first set the entire contract to paused status so that none of the external messages arrive apart from upgrading code.   This way any of the side messages will be rejected.  Also only the admin can call the upgrade.  This should be safe enough right? (reply to 136982)

Rohit: I used Blueprint to deploy a Tact contract, and after that, I ran the npx blueprint verify command to verify it.    I received a message stating:   > "Contract verified successfully"  Here is the link where the contract code is displayed:   https://verifier.ton.org/EQAQj9K6L6M-ihdtQpAxydp8p7MyWMvvwLpSF-5E8YR-m6DA  However, on TonScan the contract still shows as unverified:   https://testnet.tonscan.org/address/kQAQj9K6L6M-ihdtQpAxydp8p7MyWMvvwLpSF-5E8YR-mxtK  If anyone knows the solution, please help.

Karen: Hi, everyone!  Can I use in TONWEB (js) library as an endpoint the local liteserver url?

Vahid: what is Fastnet ? do you have resource about it ?

Anonymous💰: ? (reply to 136995)

Karen: I want to use local liteserver and TONWEB library for HTTP API (reply to 137013)

Anonymous💰: Sure. You can use it. (reply to 137014)

Karen: But what HTTP provider should I set? IP:port (lite server port) is not working (reply to 137015)

Don Bouillon: I’m not sure if you can verify testnet contracts, but if you’re the dev you shouldnt need to anyway. tact makes it pretty easy to write test scripts for your deployed contracts. my advice would be to try to learn how to do that. (reply to 136986)

Karen: what version of tonweb the one that is in docs: https://docs.ton.org/develop/dapps/asset-processing/jettons#overview? Because when i write: const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"}); I get error, it needs JettonMinterOptions, not a single address

Saleha: client = TonCenterClient(orbs_access=True, testnet=True)         wallet = Wallet(provider=client, mnemonics=seed_phrase, version="v4r2") tx_hash = await wallet.transfer_ton(             destination_address=target_address,             amount=max_balance / 10**9         )  Upon checking in test wallet all transactions "failed". What could I be doing wrong?

— 2025-01-18 —

Johnny Le: Hi, can I send all token balance with all Ton in my wallet to a new address ?

Super kid: /stat@combot

Combot: Total messages:137051

&rey: That is possible, though each jetton requires a separate message to be transferred. (reply to 137047)

Johnny Le: can u help me with the code (reply to 137056)

&rey: Can you prove that the wallet you want to migrate is actually yours? (reply to 137057)

Johnny Le:     const transactionParams = {       privateKey: derivedKey,       data: {         type: "jettonTransfer",         fromJettonAccount: jettonAddress,         to: "UQAioZgPc4NyCcWzMgU-F4I9MfjhoeY9D-hONyR9E52u8mpK",         seqno: currentSeqno,         toIsInit: false,         memo: "jetton transfer",         decimal: 9,         amount: balance,         messageAttachedTons: "200000000",         invokeNotificationFee: "1",         expireAt: Math.floor(Date.now() / 1000) + 60,         sendMode: 1,         queryId: "18446744073709551615",       },     };

&rey: Actually I don't recognize this SDK; looks nice though. (reply to 137061)

Vincent: why I get the exit code 48 in transferring jetton?

Mohammad: Hey everyone, Does TonConnect react library support multiple wallet connections? I want to give my users ability to connect different wallets and switch between them for different actions.

&rey: You should connect with the dev in Russian chat who has completed that literally two hours ago. (reply to 137069)

M: Any developer here? I want to know if there’s a way to dry-run the transaction (simulate its execution) without actually broadcasting it.

M: I’m using TonConnect to send a transaction in the TON blockchain,  tonConnection.sendTransaction(tx)

&rey: @ton/sandbox; see section on RemoteBlockchainStorage. (reply to 137076)

M: is it possible to interact with actual blockchain testnet/mainnet and simulate a transaction (reply to 137081)

&rey: Well the actual simulation will always be done locally, but the data will be pulled. Have you tried, you know, reading that doc section? (reply to 137086)

KBA07: Hi, I want to check and obervation for working with boc.      t.Run("sample_test", func(t *testing.T) {         v5r1final := "b5ee9c7241021401000281000114ff00f4a413f4bcf2c80b01020120020d020148030402dcd020d749c120915b8f6320d70b1f2082106578746ebd21821073696e74bdb0925f03e082106578746eba8eb48020d72101d074d721fa4030fa44f828fa443058bd915be0ed44d0810141d721f4058307f40e6fa1319130e18040d721707fdb3ce03120d749810280b99130e070e2100f020120050c020120060902016e07080019adce76a2684020eb90eb85ffc00019af1df6a2684010eb90eb858fc00201480a0b0017b325fb51341c75c875c2c7e00011b262fb513435c280200019be5f0f6a2684080a0eb90fa02c0102f20e011e20d70b1f82107369676ebaf2e08a7f0f01e68ef0eda2edfb218308d722028308d723208020d721d31fd31fd31fed44d0d200d31f20d31fd3ffd70a000af90140ccf9109a28945f0adb31e1f2c087df02b35007b0f2d0845125baf2e0855036baf2e086f823bbf2d0882292f800de01a47fc8ca00cb1f01cf16c9ed542092f80fde70db3cd81003f6eda2edfb02f404216e926c218e4c0221d73930709421c700b38e2d01d72820761e436c20d749c008f2e09320d74ac002f2e09320d71d06c712c2005230b0f2d089d74cd7393001a4e86c128407bbf2e093d74ac000f2e093ed55e2d20001c000915be0ebd72c08142091709601d72c081c12e25210b1e30f20d74a111213009601fa4001fa44f828fa443058baf2e091ed44d0810141d718f405049d7fc8ca0040048307f453f2e08b8e14038307f45bf2e08c22d70a00216e01b3b0f2d090e2c85003cf1612f400c9ed54007230d72c08248e2d21f2e092d200ed44d0d2005113baf2d08f54503091319c01810140d721d70a00f2e08ee2c8ca0058cf16c9ed5493f2c08de20010935bdb31e1d74cd0b4d6c35e"         v, _ := hex.DecodeString(v5r1final)         c, _ := cell.FromBOC(v)          v1 := hex.EncodeToString(c.ToBOC())         assert.Cmp(t, v5r1final, v1)     })  If i try this logic the source hex and the destination hex doesn’t match. Is there any configuration/metadata which can be configured at the boc level to preserve the contents of the data?

&rey: You should compare cell representation hashes actually. (reply to 137095)

Dana: hello I am Dana a new member and support me.

KBA07: You mean cell.ToHash() (reply to 137096)

0xLucky: how support you? (reply to 137098)

Игорь: hi guys! i have found out that about 75% of transactions from my wallet were bounced  have you any idea why?  I worked a lot with eth and ton seems a bit creepy to me

&rey: This is deterministic; messages from your wallet bounce if and only if they are sent in bounceable mode and the destination contract fails handling them. (reply to 137115)

Combot: Combot has warned Ursss_ysn (1/3) Reason: Word ***** is not allowed

— 2025-01-19 —

Likido: Hello, I need help

jennifer [afk]: hi (reply to 137144)

ONX: Hey is anyone here was able to successfully fork TonKeeper react native repo or MyTonWallet mobile?

Karen: Hi, everyone! When I create new wallet, how can I set automatically transferring to admin wallet?              const nacl = TonWeb.utils.nacl;             const keyPair = nacl.sign.keyPair();             const publicKey = keyPair.publicKey;             const secretKey = keyPair.secretKey;              const wallet = this.tonwebService.tonWeb.wallet.create({ publicKey });              const address = await wallet.getAddress();

&rey: The most obvious way to do so is to use a smart contract which would do automatic transfers upon each incoming message, in contrast to wallet contract which accepts those. (reply to 137158)

Karen: Do you have any code examples? (reply to 137159)

&rey: No. I only have docs.ton.org at hand at the moment. (reply to 137160)

Karen: OK, thank you for the idea (reply to 137161)

Ad: Hello, i am using a lite client to get block data ("ListBlockTransactions"), but the transaction results are not ordered in the good way, how can I recover the correct block order, apart from sorting on LT?

Ellis: Hey! My name is Ellis Osborn and I am looking for a talented full-stack developer. We are building Fitcentive - a longevity x web3 startup. Ping me if interested!

&rey: I don't remember but possibly the latter. (reply to 137190)

Karen: Hi! How can I deploy the contract using tonweb? I don't find any example code. I have already compiled my .fc to .boc

Raviolli: Hi, write me in DM (reply to 137201)

VladimirT: Oh, I just found out that bitwise operations are still performed before comparison operations.  So yes, you are right (reply to 137205)

userton: There’s no real difference with 1&2 right guys? 😳 (reply to 137209)

userton: Oh like the condition sequence matters? (reply to 137212)

VladimirT: Am I wrong, or if these two expressions are really equivalent, the output should always be true...?

Ad: when i iterate over the block transactions usind lite client (pytoniq) I get a different transaction order than tonapi.io. why could that be?  can i check which is correct using another tool? (reply to 137171)

&rey: Sort by (lt, transaction hash) pair. (reply to 137215)

userton: Have you tried using ‘and’ instead of & operator to insure proper Boolean evaluation? I’m not sure if that would work (reply to 137214)

Malima>>Web3.js Ambassador Lead: Yes, I have (reply to 137217)

VladimirT: If I remember correctly, there shouldn't be any difference in this case (reply to 137217)

VladimirT: Because comparison operators give 0 or 1, and bitwise AND will give the same result as AND

Ad: the tonapi ordering does not sort by tx hash (check this block https://tonviewer.com/block/(0,e000000000000000,48807546) ) when i sort by lt then tx hash, i get a different sorting... (reply to 137216)

VladimirT: Yeah, that's right Because the operations here are performed in the following order 1. In brackets 2. Bitwise AND 3. Comparison with y (reply to 137222)

Ad: could it be tonapi.io has the wrong order? (reply to 137224)

&rey: Please cease discussing the question already solved; or, if it is not solved, write down the answer in ONE message. (reply to 137217)

Mr: Does anyone have a working repo that shows code on how to transfer jettons using ton connect UI?  The ton connect UI docs doesn't seem to work

DEM: I need help connecting ADSGRAM, I don't understand a bit. I am ready to pay for the help.

&rey: Why are you asking in TON chat instead of, I don't know, @devs? (reply to 137233)

— 2025-01-20 —

User<8171670349>: Hello there how can I send jettons using next js and tonweb

User<8171670349>: How can I use vh as highload ? Guess that is wallet type right ?

pony: how can i get faucet

Mehrdad: use this bot:  @testgiver_ton_bot (reply to 137271)

Opti: Is there a web code compiler to generate smart contracts for automation of transactions from the TON network?

&rey: What do you mean? Any TON transaction already happened on a smart contract... (reply to 137275)

Combot: Combot has warned Opti (1/3) Reason: Word ******* is not allowed (reply to 137276)

&rey: Well coin distribution is an entirely different question from what you asked, isn't it?

Opti: How can I do this?

Opti: How to transfer the assets you deserve to your wallet by paying the transaction fee

&rey: There is a repository for exactly that by https://github.com/Gusarich/. (reply to 137281)

Opti: I will look into this thank you

User<7894330870>: I have experienced Jetton Wallet development, token automatic systems, and other experiences. (reply to 137258)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 56 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 31  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

KBA07: What is the easiest way to estimate the transaction fees before sending a transaction in tonutils library in golang

KBA07: I know it is very hard to exactly estimate but ~0.005 - 0.005 ton variation should be good enough

Яш: Hi all.  I am a complete new developer in ton. I want to know   for code:  const addressString: string = '0QBl2N7Jk2eplljKJJBJy7mKijrTFYvG_Q0oTL1wf3Fg_yjX' const address: Address = Address.parse(addressString);  console.log(address)    Why my output is EQBl2N7Jk2eplljKJJBJy7mKijrTFYvG_Q0oTL1wf3Fg_86Y

Ad: where can i find information on how messages a processed in a shard (the order of processing)?

Алина: What's the point of RLDP-HTTP proxy?

Oken: Who is this, he literally have tokens which worth billions

Oken: Or it's binance hot wallet address?

Oken: Did he downloaded ton mod unlimited money. I want PayPal version of it. If I be serious, who is this whale of not, usdt and hamster (reply to 137316)

Ghosthawk: rich man (reply to 137316)

Яш: Anyone? (reply to 137297)

Dmytro: Poor guy (reply to 137316)

Ssi: it's kinda a new version of address (reply to 137297)

Яш: Thank you, any documentation what I can follow? (reply to 137329)

Ssi: I'm not certain but a quick browsing has given me this: https://docs.ton.org/participate/wallets/contracts 🙂 (reply to 137330)

Яш: Thank you! (reply to 137331)

fedya eremin: hello, I am a bit new to blockchain, so what handler of tonapi should I use to validate jetton transfer?

Tony Montana : Hello everyone, I have Apple developer accounts and I would like to establish new partnerships to sell them. Those who are interested can contact me.

dolPH: Its work or fake?

DeFi: Very obviously fake (reply to 137341)

dolPH: Thanx

— 2025-01-21 —

Sol: I am looking for a permanent job as a smart contract developer

TON Bounty Bridge: ​Клейм SBT в обход бота  🏷 Developer Tool  Summary:Добрый день. Обнаружил баг, при котором можно получить SBT из бота в обход условий ( в данном случае...  Created by Korkin-ton

Howard: Tolk, nice.  https://docs.ton.org/v3/documentation/smart-contracts/tolk/overview

Vitalii Kaminskyi: Greetings to you community! Please tell me someone communicates with this comrade @Sg_orge, so he is in this group, and this character insults me and blocks me! Although I do a lot of good for him and unfairly receive negativity in response! I want to contact here to get in touch with this person and talk everything out! Any help is welcome

Thick: Greetings, everyone! I’m new to TON, and I previously worked with EVM chains. Currently, I’m trying to implement a backend validator service to ensure that transactions don’t disappear due to rollbacks. In EVM, I usually store a transaction along with its block height and wait for a certain number of blocks to confirm that the transaction is still on the blockchain. Could you please give me some advice on how I can ensure that a TON transaction will not disappear after a certain period of time?

Adam: same

Adam: The new func, easier to code (reply to 137357)

Adam: you can store the transaction hash and proof with the block that the transacion was in (reply to 137370)

Adam: to confirm that transaction went throught you can use useless trustless confirmation in backend

Gal: Hello friends  I’m looking for information about the DAO of the project. Is there any Q&A event I can ask questions? I was reading documentation and governance on the website and still couldn’t get the answers to my questions. (reply to 30208)

Gal: Is there governance for TON? Is there DAO for TON? Is it working?

Gal: How decisions are made in TON DAO?

&rey: Do you count validator set as DAO? It is, being able to vote on config changes and accept or reject node code modifications. (reply to 137379)

Thick: First of all, thank you for your answer! Could you please provide some additional information? I’m using the TON HTTP API and the /getTransactions endpoint to retrieve transaction information. However, the problem is that the transaction in the response doesn’t include any details about the block, such as block_hash, height, or seq_no. How can I determine which block my transaction belongs to? Additionally, I have a second question: what is “useless trustless confirmation”? (reply to 137373)

Adam: you can locate it using either the hash (reply to 137383)

Adam: const master = await client.getMasterchainInfo(); const txCount = 2; const addr = Address.parse(     "EQARXqu9hEzxsSP5ZdI5n3gv5XxFJQu8uPvEt0IJOwadzfA0" ); const accState = await client.getAccountState(addr, master.last); const offset = {     hash: accState.lastTx.hash.toString(16),     lt: accState.lastTx.lt.toString(10), }; const rawTxs = await client.getAccountTransactions(     addr,     offset.lt,     Buffer.from(offset.hash, "hex"),     txCount ); assert(rawTxs.ids.length === txCount); const txs = Cell.fromBoc(rawTxs.transactions).map((cell, i) => ({     tx: loadTransaction(cell.asSlice()),     blockId: rawTxs.ids[i], }));

Adam: here is a basic cllient code to get block id of trasactions on your accounts

oracle: Hi all, can you tell me how to find out from which seq node stores blocks?

TON Bounty Bridge: ​Docker Images for TON Nodes with Mytonctrl  🏷 Approved 🏷 Developer Tool  Summary:Develop a user-friendly Docker Images for TON Blockchain Nodes with Mytonctrl.  Rewards: • SBT Bounty Reward • 1000 USD in TON  Assignees: fmira21 Created by reveloper

Alex: TON Studio is a team of experienced engineers working with the fast growing TON Ecosystem.  We are seeking an experienced and motivated Tech Support to join our team and contribute to the growing TON Ecosystem.   Your primary responsibility will be to provide technical support to partners and users, as well as to ensure smooth interactions with first-level projects.  👉Read More

Adam: what skills are needed? (reply to 137393)

Runo: Hello everyone. Please tell me what data can be extracted from the transaction BoC?  Ideally, I would like to receive the sender, the final recipient (not the intermediate jetton governed!), the quantity, the token address in the transfer Is it really possible to get this from the BoC?  We used tonapi before, but now a "do not use for calculations" sign has appeared

Adam: You can check look for opxcode in the transaction it’s the first bits of the the tx body , than from that you can tell if it’s token transfer or ton transfer (reply to 137401)

Adam: Ton transfer has a structure and token transfer has there structure following each case structure you can get receiver amount and token

&rey: Let me guess: you're listening to external messages and want to parse that to "what will happen" — essentially, to those same Tonapi's events. (reply to 137401)

Яш: Greetings again.  Any good documentation for TON programming?  Like from good starter?  Thank you.

Runo: I save the transaction data to the database and check the transaction against the user in the database.  transaction is initiated in tonconnect (reply to 137408)

&rey: The thing returned by TC2 does not guarantee that any transfer happens, you know that? (reply to 137413)

Adam: You can check the transaction boc send and read it (reply to 137413)

Adam: Can be either failure or a success keep that in mind while storing

Adam: I meant the boc is returned before confirmation so it doesn’t guarantee anything

&rey: Also, you're doing something very wicked; normally, if you send transfer request via TC2, you would know what transfer exactly (TON/jetton/where to/amount/etc) you requested. (reply to 137413)

Adam: Lmao I forgot about too he can save them directly from there (reply to 137420)

Runo: now the result is recently checked by hash in  http://tonapi.io/v2/blockchain/transactions/{trans_hash}

Runo: but there the data-specific part of decoded_body is optional

Runo: the point is to carry out an operation in tonconnect, get links to its result, then check and record

Adam: Yeah and you want to get the transaction hash to get link to tx?

Runo: no, i have the transaction hash, but tonapi says that the api answers can't be used for calculations. I'd like to get the data from somewhere else, the only one that comes to mind is BoC

&rey: Please look carefully; that warning only applied to one endpoint IIRC. (reply to 137429)

Runo: there are also endpoints that do not have a warning, but if it is on the main handle, then the rest, related to the event entity, may also contain irrelevant information.  Still, is it possible to somehow extract the sender's address, the final recipient's address, the number of tokens sent and the success of the transaction (or failure)  I want to validate the transaction so that the data is reliable

&rey: I remind you that TC2-returned BOC is not reliable. Wallet app can literally not send that message to blockchain (or replace it with transferring a much lower amount) and you'd be none the wiser. (reply to 137431)

Mahdi: hello guys, if the following contract has 100 ton in it, how much it will send?   () withdraw(int value, slice in_msg, slice target) impure {      ...      ;; Reserve extra     raw_reserve(extra, 0);       var body = begin_cell()         .store_uint(op, 32)         .store_uint(query_id, 64)     .end_cell();      var msg = begin_cell()         .store_uint(0x10, 6)         .store_slice(target)         .store_coins(0)         .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)         .store_ref(body)     .end_cell();      send_raw_message(msg, 64);

User<8171670349>: What is main and testnet   -239 / -3 which is with?

&rey: Either fails or sends whatever TON is remaining after computation. (reply to 137433)

&rey: -239 is mainnet, -3 is testnet. (reply to 137434)

Mahdi: does it send 100 ton - extra? (reply to 137435)

User<8171670349>: Thanks!

Mahdi: i want it to send balance - extra - computation

&rey: No; whatever remains of incoming message. (reply to 137437)

Mahdi: what is mean (reply to 137440)

&rey: Mode 128 would work exactly as you wish! (reply to 137439)

User<8171670349>: Do you know why tonkeeper allow to send on main net when network is set to testnet ? (reply to 137436)

User<8171670349>: In dapp

Mahdi: >  whatever remains of incoming message.  what is mean?

Mahdi: can i dm you? (reply to 137442)

&rey: No point in DMing.  If contract had 100 TON originally, incoming message had 1 TON and you spent 0.06 TON on computation, then 0.94 TON would be sent out. (reply to 137445)

Mahdi: great, so no reduction in contract balance?

Adam: it will send when you sent - computation (reply to 137433)

Adam: yeah the sender pay the gas (reply to 137448)

&rey: There would be no reduction... except TVM authors messed up with storage fee. (reply to 137448)

Mahdi: thanks guys, helping a lot

Mahdi: if you have a question related to solidity eth, solana i'm here

Adam: thanks (reply to 137453)

&rey: I'd like to notify any takers that this is chat about TON development, with offtopic being deleted and possibly banned. (reply to 137453)

Runo: Okay, one more time.  I have: - hash of the transaction - Bag of Cells  I need to get: - sender's address - the address of the final recipient (not the master address of the jetton wallet) - the number of tokens sent - transaction status (success/failure)  We are currently doing this by accessing the endpoint tonapi: http://tonapi.io/v2/blockchain/transactions/{transaction_hash}  However, there is a warning in the documentation that the data returned by the API should not be used for calculations. Therefore, they may be irrelevant, probably on any endpoint, if the warning appears on the main one.  We use the event endpoint, only this warning appears on it, so we switched to blockchain/transactions, but there decoded_body, which contains information about the token transfer, is indicated as an optional part of the response, but we would like to always receive information.  We want to get accurate data (see the list above). How can this be done? (reply to 137432)

&rey: — Load /blockchain/transactions for sender's wallet (you can obtain it from TON Connect), yes. — Enumerate out_msgs (there might be up to 255 transfers to you, and you must handle all). Take note of .source.address and .decoded_body. — If decoded op name is "jetton_transfer" directed at you, you still have to check if it is a real jetton, or something worthless, or scam. Caching sender's jetton wallet addresses would work fine. — And no, you don't get "success/failure" there because the transaction chain might not be completed yet. (reply to 137457)

Howard: ;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL cell new_dict() asm "NEWDICT";  Anyone know how to implement this in Tolk?

Adam: you cant just create a new dic like this var dict = createEmptyDict();? (reply to 137459)

Adam: already in "@stdlib/tvm-dicts"

perfogic: Hi i just wonder is there anyway that ton will reduce the block time in the future like 1s. Currently it is 3s, it is too slow for actions like swapping on dex

Adam: maybe if there is more validators in future

&rey: *less validators. (reply to 137464)

Adam: both works they can add more (reply to 137465)

Adam: and less weight required for validation it will have same effect

&rey: Remember that majority validators of shardchain must agree that block is valid.  Establishing consensus among all of them is a long task, considering they are scattered across all the Earth, so networking is not instant.

Adam: not all validators if 2/3 validates it's enough (reply to 137468)

Adam: for master chain to same principle

Adam: if there are more validators they can just divide more the shard validation and main chain signing

Howard: shit, where is that file? Not at common.tolk (reply to 137462)

Howard: aslo current Stndard libary without:      asm "GETPRECOMPILEDGAS";      asm(value index dict key_len) "DICTUSETREF"; (reply to 137461)

Adam: for get ref there is nothing such as it in tolk let me check

Adam: there uDictGetRef inside @stdlib/tvm-dicts my bad

Adam: these are all the available in tvm-dicts

Adam: not it's not in comon (reply to 137472)

Adam: you can just define them if you want same way set ref was defined with there assembler algo (reply to 137473)

Howard: how about these TVM V6?

Howard: Thanks, I just realized have 2 libraries on Tolk. Thanks. (reply to 137479)

Adam: https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/tolk-stdlib/tvm-dicts.tolk (reply to 137483)

Adam: here you are this one has them all (reply to 137485)

Howard: Cool, GETSTORAGEFEE is at https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/tolk-stdlib/gas-payments.tolk  Thanks. (reply to 137487)

Adam: You welcome bro (reply to 137488)

Adam: if you need to check signatures just ust the asm checksignu because I guess it is not there in the stdlib (reply to 137488)

Howard: I found the missing one!   we missed this in Tolk: int get_precompiled_gas_consumption() asm "GETPRECOMPILEDGAS";  https://github.com/search?q=repo%3Aton-blockchain%2Fton+GETPRECOMPILEDGAS&type=code (reply to 137488)

Howard: Let's go!!! 🤕😁😅 (reply to 137491)

Adam: and check_data_signature too it takes a slice and hash is then use checksignu (reply to 137493)

Adam: I guess the  tvm6 are all there (reply to 137488)

Howard: It's Config C7: https://docs.ton.org/v3/documentation/tvm/changelog/tvm-upgrade-2024-04#c7; seems not in the Tolk libraries this moment. (reply to 137496)

Dan: Hey guys. I've just finished the first tutorial on creating and deploying a smart contract with Tolk. Give it a look if you're interested. The repo's here: https://github.com/dankorotin/tolk-tutorials/ Stars, issues and PRs are welcome. Or DM me if you want to discuss something. Cheers! ❤️

Adam: oh true; (reply to 137497)

Adam: it can be added (reply to 137497)

Adam: but wait that stdlib i sent you is for tollk 0.7 there was new ones for tolk v1? (reply to 137497)

Adam: Maybe it's already there for stdlib tolk v1

Adam: Or I guess it has not been updated from since then

Adam: all edited last week so it's updated

Adam: Maybe it's just they forgot?

Adam: It just need some definition added I can find some that are in func but not there

Adam: my bad for check signs they are defined (reply to 137497)

Adam: ```@pure fun isSignatureValid(hash: int, signature: slice, publicKey: int): bool     asm "CHKSIGNU";  /// Checks whether [signature] is a valid Ed25519-signature of the data portion of slice data using publicKey, /// similarly to [isSignatureValid]. /// If the bit length of [data] is not divisible by eight, throws a cell underflow exception. /// The verification of Ed25519 signatures is the standard one, /// with sha256 used to reduce [data] to the 256-bit number that is actually signed. @pure fun isSliceSignatureValid(data: slice, signature: slice, publicKey: int): bool     asm "CHKSIGNS";``` check signs are defined

Howard: haha, but I only need: GETPRECOMPILEDGAS (reply to 137511)

Adam: I can define it for you

Adam: fun Get_precompiled_gas_fee(): int     asm "GETPRECOMPILEDGAS" ;

Adam: here you are (reply to 137513)

Howard: oh! That simple? Thanks (reply to 137517)

Adam: yes you just reffer to the assembly tvm function GETPRECOMPILEDGAS (reply to 137519)

Adam: you can do that in func too (reply to 137519)

&rey: That is not related to development on TON; it might be relevant to TMAs if it is even true.

EvZ I DONT DM FIRST: why delete my question ? The blog article literally says to come to this chat if you have more questions...

Khashayar: Hey i wanna know  about the new rules of telegram mini apps must Use TON blockchain only  Anyone’s know what’s the point of this move?

EvZ I DONT DM FIRST: I asked some questions and it was just deleted lol (reply to 137532)

EvZ I DONT DM FIRST: trying to figure out timelines and deadlines for migration

Khashayar: TON is literally worst blockchain to build on I don’t get this move Maybe at least make the blockchain better for devs first?

Adam: you can't ask here

Khashayar: Feb 1 for new apps Feb 21 or 26 older apps (reply to 137534)

EvZ I DONT DM FIRST: thanks where did you get this info ? (reply to 137537)

Adam: Was your issue solved by the way? (reply to 137513)

Adam: just lack docummentations (reply to 137535)

Adam: once you get the hang of it it's one of the simplest actually

Adam: and allow more freedom

Khashayar: Well giving a 9 days deadline on a new blockchain  That lack many things  Who came up with that lol (reply to 137542)

Adam: I get it (reply to 137546)

Adam: you can discus that in ton society chat

Adam: here is devlopement place

Khashayar: Dunno I had 3 devs tried to work for me on a TON project   Which they were actually good devs for BNB & ETH   But they just quit mid work and said this blockchain lacks info  And they can’t work on it (reply to 137543)

Khashayar: Yes im talking about development   I hope someone in telegram think again and delay this decision until their blockchain make sense to build on (reply to 137549)

EvZ I DONT DM FIRST: Thanks! Even thats confusing. Doesnt make sense, Who writes this stuff (reply to 137539)

Adam: Yeah I get you , I has a little to no similiraties to other chains (reply to 137550)

&rey: One time, it was well-known that TON is easier to enter WITHOUT knowledge of Ethereum but with just open eyes. (reply to 137550)

Adam: By comparaison just 2023 there were no documentations (reply to 137553)

EvZ I DONT DM FIRST: Docs lack a bit but its not that hard TBH. (reply to 137550)

Khashayar: lol (reply to 137555)

Adam: Maybe just get someone more orientated ton ? (reply to 137550)

Mahdi: TRUE is -1 in func? (reply to 137225)

Adam: each blockchain make have some basics you need to het hang of before building

Khashayar: Defi is literally dead on TON  Compare TVL with Now and 2023  Telegram thought ok lets force devs to work on it  Maybe think like Maybe we do need to work on TON first and see why nobody wanna build here (reply to 137555)

Adam: yes (reply to 137560)

Mahdi: for example what will be the result of (3>0) & 10 ? it will be -1 & 10 so what is the result?

&rey: It might. Still, we are improving it. (And this chat is an additional treasure of knowledge actually.)  If each person named at least one thing wrong with the docs, it would be better! (reply to 137550)

Adam: -1 is true basically (reply to 137564)

Adam: there is no bool in func

VladimirT: (3 > 0) — True = 1 -1 1 & 10 = 0 (reply to 137564)

&rey: — (3>0) = -1  (all bits of int257 switched on) — (-1)&10 = 10  So, the final answer would be 10. (reply to 137564)

Adam: it's -1&10 (reply to 137570)

Adam: not 1 hahaha

Khashayar: I agree with you.  But how devs supposed to work on a chain with such a weak documentation  And just magically turn their projects into TON?  Building projects even in chains that devs are completely familiar takes lots of time  And MONEY !  since you are admin maybe ask them to give 2-3 months to devs  This doesn’t make sense (reply to 137566)

Adam: true is all bits switched on (reply to 137576)

Adam: so -1

VladimirT: Ah, I see. Thanks (reply to 137579)

&rey: I don't have authority over Telegram, and Telegram mini-app development had no authority over this chat. Now... idk yet, actually.  TMA development is at @devs. (reply to 137575)

Khashayar: Well telegram has No support to talk to  So is anyone in @devs actually work in telegram? (reply to 137582)

Adam: No idea but TMA Is not related to this chat (reply to 137584)

Adam: The discussin of lack of documentation maybe interresting and further devlopement

Adam: But the one about TMA dcisions are not related to here

&rey: 1. Determine what the project needs to do. 2. Write down when, what and under what conditions some assets will move, or stored variables change. 3. Check if the architecture is secure. While not, repeat points 1-2. 4. Implement. (reply to 137575)

Khashayar: Thank you But this just sad  Telegram acting like it’s a chain like Ethereum  And everything is ready   Now devs just come here or get banned (reply to 137590)

Adam: Sorry for you man (reply to 137591)

Morgan | Rogues Studio - Outmine / World of Rogues: https://blog.ton.org/ton-telegram-exclusive-partnership-2025

Morgan | Rogues Studio - Outmine / World of Rogues: The above article links to this channel to discuss this announcement. So anyone wanting clarity on how to migrate etc and why this is needed, apparently this is the place for such a discussion.

Mohammad: Hey everyone I am using tonconnect ui-react But I cannot connect to TON Space. Does anyone know what wallet configuration I should use?   {                         appName: "tonwallet",                         name: "TON Wallet",                         imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",                         aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",                         universalLink: "https://wallet.ton.org/ton-connect",                         jsBridgeKey: "tonwallet",                         bridgeUrl: "https://bridge.tonapi.io/bridge",                         platforms: ["chrome", "android"]                     }

KBA07: I have a question, why do i see a transaction being sent to the same address when i just deploy the contract for wallet initialization for v5r1.   Is it possible to skip that transaction for just the contract deployment. I remember we could do this for v4r2 initialization where just the contract was deployed without any txn being sent.

KBA07: FYI, I am using w.DeployContractWaitTransaction of tonutils-go.

Adam: Can you send the error if there is any

Adam: And txn of deployement if possible

DeFi: lol scammer (reply to 137634)

Игорь: Does anyone here know the low-level details of hashes and Merkle Proofs specific to TON?  Why does a cell have a “level”, hashes of different levels, and why do we need exotic cells of types “Merkle Proof” and “Merkle Update”.  I understand how the proof described in: https://docs.ton.org/v3/documentation/data-formats/tlb/exotic-cells works. I understand why exotic cells of type “Pruned Branch” are needed, and the description in the link is exactly how I understand Merkle Proofs work, but the example in the link does not use a larger cell level, nor exotic cells of types “Merkle Proof” or “Merkle Update”.  I have read the entire TON Blockchain Whitepaper and there is not a single example why those are needed. The cell level is called “de Brujin level” by Nikolai, but Google only shows results related to Lambda Calculus, nothing blockchain related.  Does anyone know: what Nikolai meant and why is it needed?

Sven: Does the new TON only rule apply to mini-apps that are not on the Telegram  Apps Center?

Alexander: Gentlemen, I've just read the blog

Alexander: All mini apps utilizing blockchain in any capacity, including custodial and non-custodial wallets, user authorization, on-chain signatures, and the sending and receiving of blockchain-based assets, must implement TON Connect as their exclusive wallet connect protocol in the next month.

Alexander: I have a question about this part: Does this decision affect all mini apps that use Telegram, regardless of the chain, and most importantly what is the meaning of "mini app" in this context?

Marco | TAC: Ton Connect only works on TON. So TL/DR if you build a miniapp with web3 features it must target TON Blockchain only (both assets and wallet) (reply to 137662)

— 2025-01-22 —

Kevin: such a horrible decision on behalf of the ton foundation team, and shocking that telegram agreed to such terms. (reply to 137664)

Kevin: i've had plans for a multi-chain TWA and now i think it'll just remain a web-app

Kevin: Where is this happening? This new requirement is not a restriction on TON’s part, but it is Telegram restricting all apps to use the TON chain. Do you support Apple needing all payments on their devices to pay 30% to Apple? (reply to 137677)

Kevin: I also don’t know what this means. Sure, TON has built a network of apps on telegram that help other TON devs, but that doesn’t explain why telegram should restrict all other devs to use TON’s blockchain. TON and Telegram are separate entities with separate goals, though much aligned, they should not restrict themselves and others to working exclusively with them. (reply to 137677)

Kevin: Or do you believe that developers and consumers should have choices (reply to 137679)

Marco | TAC: Ok I have no idea why I get combot messages and get my messages deleted. I'm at 2/3 warnings and I def don't want to be banned. Happy to continue the convo in dm.

Marco | TAC: Commercial agreements exists for this reason. And they include exclusivity. Is do ut des (reply to 137680)

Kevin: I understand their motivation ($) but I think their decision is hurting developer trust and freedom which are two of the guiding principles of telegram (reply to 137685)

Marco | TAC: As a developer I can still build and deploy whatever I want on Ton, including a tornado cash. And ton today is more decentralized and permissionless than any other Ethereum L2. So why this decision should hurt me? (reply to 137686)

Kevin: Yes, this decision has no impact of what you can build on TON. But it restricts what you can build on Telegram. (reply to 137688)

Marco | TAC: You build on telegram to access its vast distribution. And telegram have a commercial deal with ton that provide exclusivity to such distribution.   If you target ethereum or Solana users you can still have insane amount of different distribution channels.

Bordia: Curious to learn about some examples here that you have in mind (reply to 137689)

Kevin: Someone should be allowed to build and distribute any dApp in a telegram mini app for any chain. This helps telegram IMO. And I think it hurts public trust for telegram to make any strict and enforced exclusivity deals. There was always an implicit link between TG and TON, but to make it official and restrict other chains is over the top and seems to go against what telegram has always stood for. (reply to 137691)

Kevin: But telegram is hurting their chances of becoming “the everything app” where everyone can connect by limiting their blockchain integrations. (reply to 137690)

Combot: Combot has kicked Marco | TAC

Kevin: 😢 (reply to 137696)

Adam: You mean why prunning is needed in ton if that's your question , well a full merkle  prrofs can become very large by pruning branches  you reduce the size and data and only critical data and hashes required for verification the integrity are kept

Adam: to compute a merkle proof you need to prune all unused branch  compute their hash and replace them by their pruned cell , the advantage is that storing a merkle proof require less size ,but you can still check if the merkle proof is for that three but checking their hashes , that advantage is that merkle proof is relatively low size compared the original three (reply to 137642)

Adam: And the verification is easy as you just have to compare the root hash with proof reference

Adam: https://docs.ton.org/v3/documentation/data-formats/tlb/proofs check this exemple from verification of blocks merkle

Adam: This one of the crucial steps to verify block header after that signatures must be validated

Adam: And if you familiar with python here is how merkle profs are used in contect of blocks

Adam: Basically when you receive a merkle proof you chech the hash_1 if it matches the root hash than datas from that merkle are datas from the original tree and can be trusted

Velder: how to set my account to testnet in tonkeeper desktop latest version

Adam: go to setting and scroll down then click on tokeeper logo 5 times it should open the dev menu (reply to 137713)

Adam: alternatively

Adam: you can click on manage here

Adam: setup wallet

Adam: then import testnet account

Velder: Thank you, I meant the desktop version for MacOs🥲

Velder: But thank you very much anyway😃 (reply to 137714)

Adam: Same procedure (reply to 137719)

Velder: My accounts in this app used to be testnet,but after I upgraded the version, it became mainnet

Velder: I can’t found the env toggle button now

Adam: Yeah now test’et accounts show with normal accounts

Gazii: Hi   I'm currently working on a project that interacts with the TON blockchain using the pytoniq library. I have transitioned my code from tonsdk to pytoniq, but I'm encountering an issue when attempting to fetch the name of a token from a contract.  Problem Description:  When I try to parse the token data, I receive the following error:  ERROR:root:Missing Cell method: 'Cell' object has no attribute 'read_uint' anyone know how fix this ?

Adam: You need to parse the cell first (reply to 137726)

Adam: Then read_uint

&rey: slice = c.begin_parse() slice.load_uint(...) (reply to 137726)

Gazii: Thanks will try (reply to 137730)

Velder: My problem has been solved, thank you very much. It turns out that I need to re-import the testnet account to use it now. (reply to 137725)

Adam: you are welcome anyime. (reply to 137733)

Игорь: No, that is completely clear and is in line with what people describe by "Merkle Proof" outside of TON Blockchain.   The question is: why do we need higher-level hashes? (reply to 137703)

Adam: They act like same as the ref hash but for the higher levels (reply to 137740)

Игорь: Why do we need higher level cells? (reply to 137742)

&rey: Suppose you have a merkle proof cell. It is not literally identical to the cell with all the data, so it must be stored separately on disk — implying it has a different hash. On the other hand, it represents the original cell, so its <some-level> hash is equal to the original. (reply to 137740)

Adam: Well a mekle proof can be for just one level of the whole cell (reply to 137743)

Adam: You can need then to chock higher hashes and iterate ig

&rey: What else would you do if you need to Merkle-prove a cell which is itself a Merkle proof? (reply to 137743)

Adam: The process will be recursive ig (reply to 137747)

Игорь: Hm 🤔 ... I gotta think it through for a while ...

Adam: You need to go through higher hashes then and verify it’s position and consistency within the parent structure (reply to 137749)

Adam: That’s where higher hashes become handy

Howard: /stat@combot

Combot: Total messages:137753

Adam: Wouldnt that mean what of the higher hashes of the merkle proof is the hash_1 of the the merkle-proof that we want to verify merkle-priove (reply to 137747)

&rey: That has to be tested, actually. (reply to 137756)

Adam: The block signatures are signature of that message = (Prefix + block_hash + bloc_file hash )

Adam: Using ed25519

Adam: That message is 544 bit is there any way to verify it on func

Adam: Func only support 256 hash verifying with VERIFYSIGNU asm

Adam: + idk why that choice they couldve signed the sha 256 of that message instead but instead they signed the raw message (reply to 137760)

Adam: Was it ton dev related? (reply to 137765)

Alan: curious does Telegram’s “cryptocurrency functionality” policy extend to a Mini App that only calls a non‑TON trading platform’s RestFul API with user‑provided API keys—without issuing tokens or integrating a wallet? (reply to 137662)

Howard: All @TApps have to use TON Connect, that's all. (reply to 137772)

Howard: #tolk  Is there any people know how this turn into Tolk?          cell included_address = include_address?         ? begin_cell().store_slice(owner_address).end_cell()         : null();  espeically the include_address?

User<7218809845>: I want to connect my wallet to the following TON Connect link using Python:  https://app.tonkeeper.com/ton-connect?id=29996c281172249fcce0fed3bb8a540b703d176503badfe74582642994bd4753&open=1&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fclaim.tokentable.xyz%2Fmanifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D&ret=googlechrome%3A%2F%2F&v=2   How can I parse and sign this request using Python, and link it to my wallet? Are there any specific libraries or examples I should look into?

Adam: I can t see include_address in func stdlib so I can define it in tolk (reply to 137774)

Adam: if you can tell me from which include_address? in this code is from in func I can make a tolk version of it (reply to 137774)

Alan: thanks for clarifying!  since the mini app purely uses RestFul API keys to trade on non-TON perpetual CEXs and DEXs (like a UI terminal with no blockchain interactions in app), does it still need to integrate with TON Connect to comply with the TOS?  or mini app of this nature is not allowed? (reply to 137773)

Adam: here is coorect way (reply to 137774)

Adam: var isIncludeAddress: int = inMsgBody.loadBool(); var includedAddress: cell = isIncludeAddress         ? beginCell().storeSlice(ownerAddress).endCell()         : null; (reply to 137774)

Adam: this should do if, I rememeber that snipet of code you sent is from jetton minter contract , there (include_address?) was defined like this "int include_address? = in_msg_body~load_uint(1);" i turned into the tolk equivalent for it (reply to 137782)

&rey: Well you can check how Tonkeeper handles that, the source code is available. (reply to 137775)

Hosseini: Hi, I bought my website's domain address through tonkeeper. Is it possible to buy web hosting from Tonkeeper? Is there such a feature? Please advise.

&rey: There isn't. (Also, TON DNS is not visible in general domain resolution system, only in clients which choose to support that.) (reply to 137787)

Hosseini: I am in a country that has many restrictions and may not allow my site to work. How can I buy hosting and domain from a reliable country and pay for it using Tonkeeper? Do you know such a website? (reply to 137790)

Alexander: Great q (reply to 137772)

&rey: Well, since apparently the article directed people to this chat...  I'd assume they meant "if you want to glorify (and direct people towards) any blockchain other than TON in your Telegram mini-app, please don't". I'm not representative of Telegram but the intent looks like that. (I also recommend to read through full ToS for bots and TMAs, those documents have more to them.) (reply to 137772)

Howard: Hi, what is the error for actionResultCode: 37? (reply to 55811)

Andrey: https://docs.ton.org/v3/documentation/tvm/tvm-exit-codes  Not enough TON. The message sends too much TON, or there isn't enough TON remaining after deducting fees. (reply to 137794)

Adam: This is the deployement message? (reply to 137794)

Nerses: If I am not mistaken it is connected with gas. Have you checked the docs ? (reply to 137794)

Oken: It calls phishing (reply to 137341)

TON Bounty Bridge: ​Rust, The new chapter  Created by MrAliSalehi

Smart: if the wallet is inactive, it sends all back to smart contract, how can i avoid this?

Howard: yes, deplopying message. I will check around. (reply to 137798)

Adam: Add some more ton to the deployeemnt message (reply to 137817)

oracle: My archive node is already synchronized, question, can I reduce --state-ttl to base 24 hours because the base is growing awfully strong and not enough space?    --state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000

Adam: Here you are (reply to 137820)

oracle: yes yes, but is it no problem for my indexer? (reply to 137821)

Adam: Yeah it can (reply to 137822)

Adam: But depending on your indexer if you need old data then dont change it

@🐸🍅🪨🐈‍⬛🌱💠WAVE 🌊👾 BITS$🧑🏻‍💻 $GEEKS🧬Ⓜ️ MEMES🌱SEED🧑🏻‍💻 🟥🍅🚀superALFA: Yes will accept deploying message

Adam: The current validation lengh is less than one day so you can deccrease it

Cyrus: Hi 👋

Adam: Hii (reply to 137831)

Cyrus: would like to understand how to use the proof_boc and proof_hash parameters in this context :  wallet_message = wallet.create_wallet_internal_message(     destination=destination,     send_mode=3,     value=amount,     body=begin_cell()         .store_uint(0x503d1c97, 32)         .end_cell(),     state_init=None, )

Cyrus: hope you feeling good mate ❤ (reply to 137833)

Adam: More context needed ? (reply to 137834)

Combot: Combot has warned Louis (1/3) Reason: Word **** is not allowed

Louis: Hi everyone,  I hope you’re all doing well! I’m a developer at Scorechain, a crypto-compliance company. Thanks to the support we’ve received here, we’ve gained a deep understanding of the TON ecosystem and successfully integrated it into our crypto-compliance tool.  It’s now available for testing via our Telegram bot, ScorechainBot, which is accessible to all of you.  Additionally, my team and I came across a GitHub repository that lists many companies related to crypto-compliance: https://github.com/ton-society/ecosystem-map?tab=readme-ov-file#compliance. We were wondering if there might be an opportunity for us to be listed there as well. Does anyone happen to know the repository owner?  Thank you!

Cyrus: I need to put proof_boc and proof_hash so I can use them (reply to 137836)

Adam: Proof boc and proof hash is to proove that a transaction is within a certain block using merkle proofing (reply to 137841)

Cyrus: I know (reply to 137842)

Adam: What you need exactly? Please

Adam: The question was how to use them I answered

Cyrus: I wanna make this transaction and interact with it manually :  https://tonviewer.com/transaction/3e6d0d974260d83bb7008e97bfc5b3127eacd33f9141629c51f1b3a953116ebc and this is the data I have: {"index":1352555,"amount":"23529411760","unlockingAt":1736272800,"ownerAddress":"UQCiJB60wPdp8_Y3CgRzXxqbiXdrXXb1u4Yljg8we-teA9iM","proofHash":"44d27adaa07b2da230a3bed89fe26de6f0592907b47c6516512ac5b1c71407ab","proofBoc":"te6cckECJAEAAzAACUYDj4knF4Hn01Uihhjvmvnrqwl0g7mbEXjNS1OgYTpeDp4AFgEiA8qgAiMiASADBChIAQH18mKXOWM0VqnqBBkTuRlpzGMPM7EjZ3CTmm0BBKEe3AAUIgEgBSIiASAGByhIAQEgg8KWXom1PQpPdifTSN2b8rri/94UVwsdFieTUgP01AASIgEgCCEiASAJICIBIAoLKEgBAdxvgVop+yHkjbZ5EvFhJfz4PDay4lh1la07TbfnZgeuAA4iASAMHyIBIA0OKEgBAT3AT5cRxO8cF07yMiLrx1xRK4bOD07w5y+rvWsvGtM+AAwiASAPHiIBIBAdIgEgERwiASASEyhIAQEI6fPc6QyeudQNJDuXUbKuIXuvN+gy7zISgVQ126Ao4AAFIgEgFBUoSAEBBASj5oXo5FEbPFZCt/P04ahx+H4QyfQJcjsMwTP80RgABiIBIBYbIgEgFxgoSAEBuN5Hh57YCLs/mljX8cZ8LHAtXjCAXgGWZsKW+H4lhc8AAyIBWBkaAFilwAoiQetMD3afP2NwoEc18am4l3a1129buGJY4PMHvrXgNQV6dlSwZ31roChIAQHp0O9EGd5JvqWhdBngWQ2S9rrypOCVXCMgseEmaedqpQABKEgBAY2OGHmiS24jR8t6ThWycSKkCLxTP3WwklSewF25itfmAAUoSAEB31oGeSRLp5sB3rktHFVJTnktZHvcQtko2LW1aMoT+dQACChIAQHbptFkV2xthdxrjfWbC+hcxf9exTUHSQGn7RCxdxjqOAAKKEgBARgLObiPqphLHeyDZ5kilBz4QdrJIbC4GHGh/+UuKj0EAAooSAEBiuNrpXf2WW7GsfeU05QTD4uXAzR7McdjksMpSud4Cc8ADShIAQETHw65SnZ2/iE0tN8eqZQWi5HKlJwz+ahc5CwYtOELsAAPKEgBARaoSJAqY9b5zX/eZZ2g5SqjA7NhVRoJSPcobrTlqZ/BABEoSAEBAlrr0d8upevILDbXyYR3CkcCp9KleOeCOyuBMSNIYlwAEyhIAQGQLjSwVavETkuAMPo5qzcotxacnmP/HLqRPzDDJm5FbwASsAM8JQ=="}

Adam: You want to make a smilar transaction ? (reply to 137852)

Cyrus: yes bro (reply to 137853)

&rey: Send to its unbounceable variant of address. (reply to 137815)

Cyrus: hi 👋 (reply to 137865)

Mcflury2225: Why my message got deleted ?

Mcflury2225: Was just asking about the bots on telegram like trojan and if they‘ll still work

&rey: And the chat is just about how to develop on TON. (reply to 137873)

Mcflury2225: Still you could tell me if yes or no ? Didn‘t got an answer on other Socials, chats

&rey: Attempting to circumvent moderation decisions is a bannable offence.

Perp: Yeah so from what I'm reading they want to force users into a singular app where assets utilize TON. Nobody asked for this or wants this so I'm curious to see how long this lasts. (reply to 137876)

Howard: About #Tolk question:  fun get_precompiled_gas_consumption(): int      asm "GETPRECOMPILEDGAS";      var jetton_wallet_gas_consumption = get_precompiled_gas_consumption();     debugPrint(jetton_wallet_gas_consumption);   Only got null.... why?

Howard: GETPRECOMPILEDGAS is the part of TVM V6 on FUNC (reply to 137886)

Howard: ohhhh but this issues didn't happend on FunC! That was why I got Exit Code 7;  Can feel how strict for Type control in Tolk. Nice. (reply to 137890)

Howard: How can we set the value in zero if it's null? Using if X : Y, what else? (reply to 137890)

Adam: here you are   jetton_wallet_gas_consumption == null ? 0 : jetton_wallet_gas_consumption (reply to 137896)

Adam: this will set the value to 0 if null (reply to 137898)

Howard:     var jetton_wallet_gas_consumption = get_precompiled_gas_consumption();     jetton_wallet_gas_consumption == null ? 0 : jetton_wallet_gas_consumption;  The FunC wouldn't have error in there; when sum up the null and zero tho. (reply to 137898)

Adam: yes (reply to 137902)

Howard: Just spent many hours in these few days trying on Tolk, I will say it's good!  Just implemented the USDT (FunC code) to the Tolk; might be the first Jetton Standard example in Tolk? Can't be sure. But hope can help you guys for the people joining TON in the near future! #repo #jetton #tolk  https://github.com/howardpen9/ton-usdt-in-tolk

Adam: Yes even if It returned null func wont show anything. this fucntion will always return null wont do that for only precompiled smart contract on chain (reply to 137902)

Adam: That was actually was the one of the first issues I encountered in func when I started , very low debugging you cant tell where is the issue unless you do alot of tests

&rey: L82 doesn't actually do any assignment, you know? (reply to 137902)

Adam: Yeah dw we solve it (reply to 137912)

&rey: There is error, null is not summable with int (if you actually use the result, otherwise FunC optimizes entire expressions out). (reply to 137902)

Adam: I just forgot variable assisgnement

Adam: In func there would nt be an error i will count as 0 (reply to 137914)

Adam: But here he must define it as 0 when null

0xLucky: Is there anyone looking for a dev?

Saul: hi  I need to put proof_boc and proof_hash in this :  wallet_message = wallet.create_wallet_internal_message(         destination=destination,         send_mode=3,         value=amount,         body=begin_cell()         .store_uint(0x503d1c97, 32)         .end_cell(),         state_init=None,     )  how should I do this? (reply to 137914)

&rey: Could you just find a reference implementation and replicate it, please? (reply to 137920)

Adam: Put proof boc in a transaction ? (reply to 137920)

Adam: What does that even mean the proof boc is to proof the transaction is within the bloc

Adam: How you gonna put it if the tx is not sent

&rey: Sometimes yes, and sometimes to prove right to some jettons in a distributing contract. (reply to 137924)

Mahdi: Hello guys, is there anyone knows how ton whales nominator contract works?

Saul: Sorry to bother you, but if I could have found it, I wouldn't have bothered you (reply to 137921)

Saul: yes , that's exactly what I want (reply to 137926)

Saul: I have proof_boc and proof_hash , I just don't know how to use them

Adam: The proof boc of what exactly (reply to 137932)

Saul: @pcrafter  I know you are so busy , but I really need this really appreciate it if u can help me out

Saul: look this is an example of what I wanna do :  https://tonviewer.com/transaction/9c8dcef200d84ad21ac601949e155788b98ebabf40ae7559b6d5d949daa2c4fd   I have the necessary data's that include proof_boc and proof_hash, I just need to put theses 2 parameters into this :  wallet_message = wallet.create_wallet_internal_message(         destination=destination,         send_mode=3,         value=amount,         body=begin_cell()         .store_uint(0x503d1c97, 32)         .end_cell(),         state_init=None,     ) (reply to 137933)

Karen: const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"}); I get an error, it needs JettonMinterOptions, not a single address  How can I solve? I am using tonweb@0.0.66

Adam: https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js (reply to 137939)

Adam: Here you can check all the needed options for jetton minter constructor

Karen: Official documentation:  import TonWeb from "tonweb"; const tonweb = new TonWeb(); const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"}); const data = await jettonMinter.getJettonData(); console.log('Total supply:', data.totalSupply.toString()); console.log('URI to off-chain metadata:', data.jettonContentUri);

Karen: The code from the official TON docs is not working 😥

Adam: You need all these adminAddress: Address, jettonContentUri: string, jettonWalletCodeHex: string, (reply to 137939)

Adam: you the ketton wallet code too

Karen: Where should I find the jettoncontenturi if I have already posted my jetton to on chain? (reply to 137945)

Adam: Use tonviewer (reply to 137947)

Adam: Use the get method and it will give you all you need

Saul: anything in pytoniq? cause I done know js just python (reply to 137941)

Karen: jetton_content is the jettonContentUri? (reply to 137949)

Adam: Non i can give you the uri if you send me you token (reply to 137952)

Saul: anyone can help me with this? I will donate 100$ (reply to 137938)

Saul: @pcrafter  dude please help 🙏 (reply to 137938)

Prof.kenzy: I tried helping, check your PMs and let me know if it worked (reply to 137920)

— 2025-01-23 —

Winder: Is this an error ? 1 usdt should be 1*10^6 ?

Winder: https://docs.ton.org/v3/guidelines/ton-connect/guidelines/preparing-messages#jetton-transfer

Adam: It’s 10 6 just a mistake (reply to 138006)

권경우: I am a Korean. I'm saying this because I'm in a hurry Sent usdt from bitget to gate. I typed the address correctly, but I typed the address tag incorrectly. I don't know where the usdt is and it doesn't even show up in the blockchain searcher.

권경우: I don't think the blockchain search is possible because ton network doesn't support usdt, how can I find it?

권경우: please help me

Ghosthawk: This group is the Ton community of developers, but to answer your question: If you sent USDT (selecting the TON Network) to the GATE exchange, it is probably in their wallets. You can contact the exchange's support. You can also check TON/Jetton sends over the Ton network with Tonviewer.    It is probably about Memo/Reference code, because exchanges usually keep funds in one wallet and the only thing that separates them is your assigned Account number. (reply to 138019)

&rey: by the way, it does (EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs), but that doesn't help since you sent those between custodials (reply to 138022)

권경우: I'm a beginner, so I don't understand what you're saying

Alexander: 경우님 좀 도와드릴까요?

권경우: 네 도와주세요

Ghosthawk: Note that malicious people may request funds from you here, claiming that they can recover your funds. Contact the support of the exchange you are submitting to for resolution of your issue. They will explain the relevant procedures you need to follow. (reply to 138032)

SwapStyle: Hi, may I know the recommended compute and disk requirements for running TON testnet liteserver archival node please?

Quyeen: Hello? Can i custom modal connect UI of @tonconnect/ui-react package to show only TelegramWallet and TonKeeper?

sangmin: 경우님 잘 해결하시길 기원합니다.

Alexander: 상민님도 개발자세요?

sangmin: yes !

Tom: Excuse me, is there maintainer of ton-connect/sdk here? I would like to reach out to ask about a Pull Request. Thanks a lot.

Saul: I’m facing an issue with my script while calling a contract in a transaction and initializing the state. The script throws this error:  Transaction error: Unable to complete the operation Transaction details show: cskip_bad_state.  transaction link : https://tonviewer.com/transaction/89d964f31db4cc7dbf169d5dd9bea40b2ac366196190bf693a9b6f8a67f49782  My Script:   from pytoniq import LiteBalancer, WalletV4R2, begin_cell, Address,Builder import asyncio import time import base64  proof_boc = "te6cckECJgEAA1sACUYDsMgGWqupz3UYKy+TBiUU+xGAienK9PtEBVDpsNABuUAAFgEiA8qgAiUiASADJCIBIAQjIgEgBSIiASAGISIBIAcgIgEgCAkoSAEBJW6uvwTScp/3vqFkzRfLrl9zecqxAsH6EugMJEII9KgADiIBIAofIgEgCx4iASAMHSIBIA0cIgEgDhsiASAPEChIAQEnO6P4pXUVhXm3u1KuIGXkU7hfiSinDrb59z+JjGvHngAHIgEgERoiASASEyhIAQFKweRsDBVPLfFA25m/pUlKGlsacwFPagBe3C7g7P2YVQADIgEgFBUoSAEB3zOy8HQh1o2QEs3fMDJxMkvWvPH9hlWJQ0HkI//dKjoAASIBIBYXKEgBAbYBTGz5MS9RLQeBiKoHmEvxvrjB2zmoOkDl3o8umgQEAAIiASAYGShIAQHqLbciL6O1l7jVPizL9BuBtLdNEyTJkaEC7H3wfqgNOgABAFilQAxAp766zBnasY1L+ItR8Z5Xqlc/tnZrR2FXbfvoJXfbZR7K5ifgZ5EH8ChIAQEWDHFjljmfoZu1++lty2T5SumlxSks0Rd82NhSgJLaxAAEKEgBAWwaWE+R9hyOHEMNw5EcziE4AVuALhbCMbGxhITmgC2sAAgoSAEBWgUtze544aaMsUPr53jEjafws3ls9pWFBynLQac2QI8ACShIAQHlDWam1SxbHwx3gOZbwVGR4/4k0kD+bY04nqPTkh2ylQALKEgBAccAF3sn24gx1RvLq1mEm+tqWqzZGH57SkS7fAK+3iBxAAwoSAEBlCRmvHmA6lfr+vy+H1Byk99d1YI0w3KVwpHTrWJpny4ADihIAQGfLmZF2ZR86wcjys1QGRgubabC6XmeoA9oXEsYx5NDSwAPKEgBAS2x8g1cJOPXOHvHZupLmQZ65lqR3BZQfh2uP33WzjeQABEoSAEBzF/hgERZuGydfadjzG4iGd4gXNcT499OoxIO51GMM88AEihIAQGwFPLIs5EL82KRM8cvk4AMHNMoHiX9R0/qXgCtHL+QgQATKEgBAdq/DkHo1iE8jvsnxlCrc1cKk1cNlpDCG81sEzWKdSWmABQoSAEBXGnzLfw9Nb7iDld0vUpM0u1mCZ9ae8ZMbfMJhC6JWKsAFSf5KTQ=" proof_hash = "f7bba43eb696c5dccbb22541feeca1d00f5a3cccb769306be4c4991fb1bc7cab" proof_hash_bytes = bytes.fromhex(proof_hash) proof_boc_bytes = base64.b64decode(proof_boc) cells = Builder.from_boc(proof_boc_bytes)  mnemonics = [...]  async def wait_for_seqno(wallet, prev_seqno):     while True:         current_seqno = await wallet.get_seqno()         if current_seqno > prev_seqno:             break         await asyncio.sleep(1)  async def wallet_transfer(wallet, destination, amount):     state_init = None      try:         wallet_seqno = await wallet.get_seqno()         print(f"Using seqno: {wallet_seqno}")     except Exception:         print("Failed to fetch seqno.")         wallet_seqno = 0         state_init = wallet.state_init        wallet_message = wallet.create_wallet_internal_message(         destination=destination,         send_mode=3,         value=amount,         body=begin_cell()         .store_uint(0x503d1c97, 32)         # .store_ref(proof_boc_bytes)         .store_bytes(proof_hash_bytes)         .end_cell(),         bounce=False,         state_init=si,     )      transfer_msg = wallet.raw_create_transfer_msg(         private_key=wallet.private_key,         seqno=wallet_seqno,         valid_until=int(time.time()) + 3600,         wallet_id=wallet.wallet_id,         messages=[wallet_message],     )      message = wallet.create_external_msg(         src=None,         dest=wallet.address,         import_fee=0,         state_init=si,         body=transfer_msg,     )      serialized_message = message.serialize()     message_boc = serialized_message.to_boc()     await wallet.provider.raw_send_message(message_boc)     print(f"Transfer message sent. TXID: {serialized_message.hash.hex()}")  async def main():     global si     provider = LiteBalancer.from_mainnet_config(0)     await provider.start_up()      main_wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)     si = main_wallet.state_init      destination = Address("EQB2QViWTAgwGlDh8R7WMWysnJt3C0u7PmyVkkYHv082UfHF")          await wallet_transfer(         wallet=main_wallet,         destination=destination,         amount=int(10**9 * 0.27),     )      await provider.close_all()  asyncio.run(main())

Saul: @pcrafter  hi can you help pls? (reply to 138054)

Saul: @pcrafter  If you don’t answer, I’ll try initializing my own state ⚰

Adam: what (reply to 138059)

Saul: it's a joke (reply to 138060)

Adam: very dark one

Saul: yea😂 (reply to 138062)

Nxrix: can 256 bit secret key be turned into 24 word seed phrase?

Tom: I don't think it's possible. From mnemonic to entropy is HMAC-SHA512. It's a hash function (reply to 138066)

Tom: Can you please explain this further?  Or in case you're trying to bruteforce the wordlist, try to revert this secret key back to my original 24 words:  b7006dd870715545532508edf1bc9156f34f7b9572e4dbb5bc7f28325ee234a1f04530ef84c5f2db2833d500244408358439995e645c47ca667f719c2f4a0404  (this is a throwaway PK I just generated, not meant to be used) 😁 (reply to 138072)

Nxrix: Yeah I was guessing that it uses a hash function (reply to 138070)

&rey: I remind you that TON doesn't use standard algorithms to convert mnemonic to keypair. Please familiarize yourself with algorithms that are actually used.  Hint: https://github.com/ton-org/ton-crypto/blob/c3435833a0da52a96f674c352c4c6f91fcc07f6d/src/mnemonic/mnemonic.ts#L51-L90. (reply to 138072)

Adam: No (reply to 138066)

Adam: Short answer is no

Adam: But you can use private key to sign, so no need for memonic

Tom: Even when I give you 24 words scrambled, I doubt that it would take less than years to brute force for the correct order to construct a specific public key 😁 (reply to 138072)

Adam: Hahaha that's a bold assumption (reply to 138072)

Adam: if you can do it than I might question the whole blockchain logic

Shivansh: i see some argument is going on😂 maybe i shouldn't text at this point

Tom: Nah, please go ahead (reply to 138088)

Adam: it's not even an argumement there is no debate (reply to 138088)

&rey: Having a person saying misleading statements  banned from the chat is not impossible, indeed. (reply to 138102)

Tom: There is possibility and impossibility. Nothing is complicated regarding this. If it’s possible, please back your statements.

Tom: Well, he will not be able to back his words then…

Adam: Haha I mean hashing is the basic to know about blockchain (reply to 138106)

ErdeHoon: can i get auth for snapshot download?

Artem: hi all, could you explain how does work ton-proxy-contract?

Алина: What is required to consistently get broadcasted messages from the overlay? Is it contributing to the distribution of the messages? Is it regularly pinging the overlay nodes? I get a flush of external messages for a few seconds and then it stops and i receive no messages and after a few seconds it restores again and then stops again. Why is it so inconsistent?

Алина: Pinging more frequently kind of helps i figure

internet: Whats up guys, could anyone tell me how to blueprint run smart contract to testnet without using real ton wallet or the real money?

internet: Cuz if i do use testnet->tonkeeper n transaction does happen, I get struck by this

internet: which well... happens... not for the first time

Cai: What would be the simplest way to get a wallet address (W5) from a mnemonic?

Adam: Import it to tonkeeper? (reply to 138688)

Cai: What? I mean, I have my mnemonic and I want to programatically get the wallet address V5R1 associated to it, I tried doing with tonweb but it seems it doesnt support v5r1 provider (reply to 138691)

Santosh: Hello All, i have this failed transaction https://tonviewer.com/transaction/fa8b7ec423855f1779bc552f3232c8e4337a76e1e3bc40d38236f02b0e4a94b4 with reason insufficient TON. I performed another transaction soon after with same amount of TON which succeded. Clearly the transaction had enough TON, any ideas why it would fail abruptly.  Also how can i handle refunds in such cases?

𝐴𝑅𝐸𝐹 𝑆𝑆: A good question (reply to 138710)

Ghosthawk: Maybe it is about token price change. (reply to 138710)

Santosh: No, my transaction was supposed to create the token but it never got to that point. (reply to 138715)

— 2025-01-24 —

Andrew: Hi all per the new exclusivity, if we integrated to ton via web3auth would that satisfy the new requirements?

&rey: Presumably it would not. (reply to 138732)

Andrew: Hmm that's unfortunate. For ton connect is there a way to use a wallet associated directly with the users telegram account?  Like account abstraction in other chains. Or are we now basically forced to use the connect wallet UI that is frankly old school u/x at this point.

&rey: There, generally, is not such a wallet.  Or are we now basically forced to use the connect wallet UI  I believe it has been written in clear text that yes you have to use official TC2 libraries? (reply to 138747)

Andrew: Got it, well on wallet web3auth would allow access to a wallet using the users email or social login.  Altho they don't use ton connect but rather tonweb sdk.  So for whatever reason I guess that's "not allowed" now.  Too bad.  Ok thx! (reply to 138749)

SwapStyle: Hi, may I know the recommended compute and disk requirements for running TON testnet liteserver archival node please?  Additionally, what's the expected disk growth size?

Averroes: sorry idk where to ask   customofferrobot are scam or not ??  this guy query me with fragment link ( but the real url goto that bot and display fragment ) maybe phishing rite ? am i wrong ?

Андрей: if someone writes to you first - be sure that it is phishing (reply to 138760)

Виконт vangaard: Don't click on such links, they lead to wallet drainers (reply to 138760)

Tonenthu: @delovoyslava  please check your dm, I am wanting long months to receive my bounty's compensation, yet no reaction

Brian: Hello everyone

Brian: I want to learn how I can put my website in my domain ton because I tried yesterday following the steps of "how to run websites on ton" and when I tried to scan the QR code appeared to me an unknown error on Tonkeeper

Brian: And also I want to know how to upload my website's files because I am learning and I know only how to do it using GitHub and deploy my website with GitHub pages

Brian: Can you help me?

Brian: Exactly, I always try to hear what they want sometimes they only want to know more about me (reply to 138778)

Adam: Hey everyone! 👋  Here’s a small idea for a staking contract using the Jetton principle it took me some time to apply . Here are the keyfeatures:  Scalability: Each Jetton wallet tracks its own staking data, solving the problem of storing infinite dividend history. 📊 How it works: 1️⃣ Stake TON → Master contract mints staked Jettons and keep the staked ton. 2️⃣ Withdraw → Burn Jettons, get TON back and get data from your jetton wallet to calculate reward .  Simple, efficient, and perfect for scaling! Let me know your thoughts!  Check my git so you can read the contract:   https://github.com/Vodka2134156/staked-TON/   Thanks for motivations  Note :In my contract I stored just date of staking you can store more data of staking and the contract is detected as token so people will be more familiar with it

Tim: > Staked Jettons can only be sent to the master contract. Any attempt to transfer staked Jettons to another address will fail, ensuring that the staking mechanism remains secure and prevents misuse. This severely limits use cases. Usually users want to be able to move their staked liquidity tokens. (reply to 138782)

Adam: this is not liquid staking (reply to 138783)

Adam: this is pooled staking but just a solution for not recording any data on the pool smart contract the ft or nft you can choose which solution act like a proof of stake (reply to 138794)

Adam: You can modify the the jetton wallet to lock the funds too until the periods has ended you can add penalties etc (reply to 138795)

Andrew: Hey all, Ive been working on a plugin that uses the Ton javascript sdk and noticed a few issues with it.  Particularly, I am getting a 429 error when trying to send a transfer. I've cross referenced all the docs and am definitely passing everything in correctly, so i'm leaning towards an error in the TON sdk that needs to be resolved. Please let me know if you guys have a solution or can put in the fix.

Adam: Send the tx and the code if you can (reply to 138803)

Andrew: Can't send links in here

Adam: Hash of tx

Andrew: one sec let me see

Adam: A screen anything just to see what are you talking about

Andrew: ok

Andrew: This is the code, all values are correct when printed out

&rey: 429 Too Many Requests HTTP/1.1 (reply to 138804)

Adam: Have you tried to add waits between the requests (reply to 138814)

Andrew: I've only ever sent one request at a time

Adam: You used the provider more than one time in your code

Adam: They count request too

Andrew: its the action that creates tx's nothing else

Andrew: Unless the rate limit is set at 2-3 requests we are def not hitting the upper limit here, cause even in isolation it is not working

Andrew: here is tx hash: 0030bbe0fb37ac82909815423046fa6984f940b61728634d240062a213290708

Andrew: It says invalid tx

Andrew: The current code implementation will make one call to get balance and create one tx

Andrew: calls are cached (reply to 138820)

&rey: 1 request per second, exactly. (reply to 138824)

Andrew: even so we are not hitting that

&rey: 1. getSeqno 2. send (reply to 138832)

Andrew: If you can only make 1 api call per second and need to getseq number and send and create tx then this is unusable from a user perspective

&rey: Usually one obtains an API key for this. Or uses two APIs at once, which also happens.   I'll try to forward the request for more default RPS to Toncenter. (reply to 138834)

Andrew: ok

Andrew: Ok yes that worked but we really need to figure out a better way or make that known on the docs that it's 1rps

Andrew: the transaction hash still doesn't show up tho

Andrew: This was the actual tx hash: cee5e3b7bfeb85aa39daad3d1dc4dd660393a510d561916158d353e12843aa2a  This was the tx returned by the function within our code: 0030bbe0fb37ac82909815423046fa6984f940b61728634d240062a213290708

&rey: transfer.hash() is hash of external message ("transfer order"), which is but one component of transaction. (reply to 138842)

Andrew: got it what would be the best way to get actually tx

&rey: Well waiting for its appearance in blockchain is inevitable... (reply to 138844)

Adam: using the body to check for it on chain but like @pcrafter said you waiting for it's apperance is inevitable (reply to 138844)

Andrew: how do you get form this format: DdsSdgUKF1tq7pYQjlj1J8h2oY4+MzFdKOA+k7IVxuc= to the real one, i noticed i can search by  this provided hash but its not correct format.

Adam: you can search for it using the hex of the hash it works on tonviewer but you need to wait for it to appear on chain first (reply to 138854)

Andrew: thats fine but how do i convert back to regular hash

Adam: give a valid hash first to try so I dont give you a wrong answer (reply to 138854)

Andrew: DdsSdgUKF1tq7pYQjlj1J8h2oY4+MzFdKOA+k7IVxuc=

Andrew: That is a valid hash

Adam: Can't find any tx with it

Andrew: are you on test net

Adam: on sorryno

Adam: and what is the one you get ? (reply to 138858)

fedya eremin: Hello, guys, i have a question. Is it possible to charge gas and other commissions in jetton transfer to recepient?

Andrew: i get that, but wanna convert it to the full format

Adam: what do you mean full format (reply to 138866)

Andrew: 0ddb1276050a175b6aee96108e58f527c876a18e3e33315d28e03e93b215c6e7  This

Adam: that's just the hex version of it hahaha (reply to 138868)

Andrew: i see

Adam: function base64ToHex(base64: string): string {     // Decode Base64 to a binary string     const binaryString = atob(base64);      // Convert binary string to a hexadecimal string     return Array.from(binaryString)         .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))         .join(''); } (reply to 138872)

Andrew: thank you

Adam: it will return the version you want (reply to 138874)

Andrew: sweet

Adam: The base64 hash sometimes will return nothing in tonviewer because of the slahes that's why the they the HEX version instead

Adam: I don't know how this is in context but thanks (reply to 138882)

Andrew: Adam to provide more context for you and the issues im running into.  Im working on the TON plugin and got some insight from your team that there is a 1 request per second rate limit. Just to send the a transaction we need to make 4-5 api calls. I have delayed the time between calls even more but it seems like there are even issues with rate limits per minute, etc. If you guys can please provide some more insight or support that would be great. These limits need to be increase otherwise this is virtually unusable

Combot: Combot has warned Adam Ton (1/3) Reason: Word **** is not allowed (reply to 138887)

Adam: Hahaha I said a word I shouldn’t ??

&rey: You need API key for Toncenter. Some bot gives those; you can find its link at https://toncenter.com. (reply to 138885)

Adam: I got warned because I said toncent is f*** (reply to 138893)

Adam: Did not know it was in the combot

&rey: Yes, that synonym of "without charge" is actually a favourite word of spammers. (reply to 138897)

Adam: Damn Ill use the synonyme then  if I need to use it (reply to 138898)

BizX: I am a passionate blockchain and web3 frontend developer I am looking for opportunity to work if someone have a project and idea, plz drop to me

Assistant ROM: What is the code I have to write about receiving the token in the smart contract?

Adam: Explain (reply to 138916)

Adam: Token received is basically updating the jetton wallet with new balance and sendNotification to the owner wallet (reply to 138916)

— 2025-01-25 —

Bluepot: Hello everyone. I want to make a Jetton. When sending tokens to someone, I want to burn 50% of the number of tokens sent and send 50%. How can I make this token. In wallet contract, I will burn and transfer the token. but it has an error. Please help me!

Bluepot: if (burn_amount > 0) {     var msg_body = begin_cell()       .store_uint(op::burn_notification(), 32)       .store_uint(query_id, 64)       .store_coins(burn_amount)       .store_slice(owner_address)       .store_slice(to_owner_address)       .end_cell();      var msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(jetton_master_address)     .store_coins(0)     .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)     .store_ref(msg_body);      send_raw_message(msg.end_cell(), 64);    }    cell state_init = calculate_jetton_wallet_state_init(to_owner_address, jetton_master_address, jetton_wallet_code);   slice to_wallet_address = calculate_jetton_wallet_address(state_init);   slice response_address = in_msg_body~load_msg_addr();   cell custom_payload = in_msg_body~load_dict();   int forward_ton_amount = in_msg_body~load_coins();   throw_unless(708, slice_bits(in_msg_body) >= 1);   slice either_forward_payload = in_msg_body;   var msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(to_wallet_address)     .store_coins(0)     .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)     .store_ref(state_init);   var msg_body = begin_cell()     .store_uint(op::internal_transfer(), 32)     .store_uint(query_id, 64)     .store_coins(transfer_amount)     .store_slice(owner_address)     .store_slice(response_address)     .store_coins(forward_ton_amount)     .store_slice(either_forward_payload)     .end_cell();

Bluepot: This is transfer and burn contract.

Adam: well you dont need all this (reply to 138939)

Adam: just edit the jetton wallet so when poeple receive money their balance only have  50% added to their balance no the whole value

Adam: then send a notification to the master to update the total supply (reply to 138944)

Adam:  receive(msg: TokenTransferInternal) { // 0x178d4519         let ctx: Context = context();          if (ctx.sender != self.master) {             let sinit: StateInit = initOf JettonDefaultWallet(self.master, msg.from);             require(contractAddress(sinit) == ctx.sender, "Invalid sender!");         }          // Update balance         self.balance = self.balance + msg.amount / 2; only add to their balance half of what received         require(self.balance >= 0, "Invalid balance");          self.currentTime =  now(); //store data of staking                  // Get value for gas         let msgValue: Int = self.msgValue(ctx.value);           let fwdFee: Int = ctx.readForwardFee();         msgValue = msgValue - msg.forward_ton_amount - fwdFee;                    // 0x7362d09c - notify the new owner of JettonToken that the transfer is complete         if (msg.forward_ton_amount > 0) {              send(SendParameters{                 to: self.owner,                 value: msg.forward_ton_amount - 3,                 mode: SendPayGasSeparately + SendIgnoreErrors,                 bounce: false,                 body: TokenNotification {                     queryId: msg.queryId,                     amount: msg.amount / 2,                     from: msg.from,                     forward_payload: msg.forward_payload                 }.toCell()             });             send(SendParameters{ // send a burn notification                 to: self.master,                 value: 3, // this value needs to be greater than 3 it's what the master contract uses to update supply can be deducted from ton forward amount                 mode: SendPayGasSeparately + SendIgnoreErrors,                 bounce: false,                 body: burnMessage {//you make the burn message how you want                      queryId: msg.queryId,                     amount: msg.amount / 2,                     from: msg.from,                     forward_payload: msg.forward_payload                 }.toCell()             });         }

Adam: something like the code above will do this will add 50% to the users balance and update the total supply with -50% (reply to 138940)

&rey: Please correct send modes + values... (reply to 138946)

Adam: sure (reply to 138948)

Adam: updated the values what send mode is needed in that case to not cause out bount message issues? (reply to 138948)

&rey: Suppose user forwards 1000 TON. It is unacceptable to divert half of that for burn message. (reply to 138950)

Adam: Yeah true makes sense (reply to 138951)

Adam: Let me update it

Adam: fwdfee is enough ? (reply to 138951)

&rey: Generally, that's thing best known by you and by tests... (reply to 138954)

Adam: this will do then (reply to 138946)

&rey: Notifying with amount that was not actually credited is unsound (breaks any DEX, for instance). (reply to 138946)

Adam: so notify with amount / 2 will do (reply to 138957)

&rey: This burn notification is pretty much fine except master contract cannot handle it, because value is set to zero.  Also, if 5 jetton indivisibles were sent, 2 will be credited and 2 will be noted in a burn message, with 1 lost forever. (reply to 138946)

Adam: he can experiment later of how much value he can have it I cant know without testing how master contract will need to update it's total supply (reply to 138959)

Adam: we can test the value in a varibale first to know how much will be lost then add it to the burn (reply to 138959)

Adam: can be done by checking the the decimal part of that division perfrmed if it's not 0 in our case it's either 0.5 or 0 and compute accordingly

Adam: but the value for me it's impossible to know without testing he just need to do tests and each time deducted from the forward ton amount so he need to know how much it's used by the master contract in average (reply to 138959)

M: Hi ’m building an app, and I need a large amount of TON tokens for testing in the testnet environment. If anyone can share some testnet TON 0QDVi4djl5s0g69y1VxvqGjg9xsbMdAIDl-GPKjdXqNIHQGW

D 3 B X 1: how can i get jetton balance in react? with tonconnect

Adam: get address of user using tonconnect then use apis (reply to 138967)

D 3 B X 1: which api? (reply to 138968)

Adam: toncenter

D 3 B X 1: I need a sample code to check how many Notcoin a wallet has (reply to 138970)

Adam: check their balance using wallet mehod (reply to 138996)

Mithra: Hi, guys. Does anyone know what an ExitCode 41 could mean in a FunC contract if it is not listed in the contract's errors? In particular, I mean the USDT contract.

&rey: Easiest to find out via retracer. (reply to 139020)

Mithra: I found empirically. I was trying to send more USDT than I had. (reply to 139021)

lunar: how to get a large amount of test ton?

lunar: I would like to get myself a test tons

Maddy: Hey, I have a wallet which has TON but when I try to transfer some token out of it through API I get error of  - LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

— 2025-01-26 —

clark: Does TON have a concept similar to "Priority Fee", or does it operate on a first-come-first-served basis?

Adam: Short answer ton doesn’t have « priority fees » :  Here are the fees ton have : https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees (reply to 139059)

Edward | Kelp: @admin I have a Mini App deployed to production and applied for a verified badge.  How long does it take or what is the criteria for this?  It's been awhile now.

Adam: Not the right place to ask (reply to 139081)

Adam: Try asking in the TMA chat @devs

Edward | Kelp: Thanks.  Will ask about this there. (reply to 139084)

Vlad: import { beginCell, contractAddress, toNano, Cell, Address } from "ton"; import { NetworkProvider } from '@ton-community/blueprint'; import { NftCollection } from "../wrappers/NftCollection";  export async function run(provider: NetworkProvider) {     const OFFCHAIN_CONTENT_PREFIX = 0x01;     const string_first = "https://green-real-raccoon-214.mypinata.cloud/ipfs/bafybeiduhdakilkzxtr6ppdogdusrk6qstdanczzhjwqvknfl4lvk5ixqe/";      let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();      let owner = provider.sender().address!;     let collection = provider.open(await NftCollection.fromInit(owner, newContent, {         $$type: "RoyaltyParams",         numerator: 350n, // 350n = 35%         denominator: 1000n,         destination: owner,     }));     await collection.send(provider.sender(), {value: toNano("0.1")}, "Mint");     await provider.waitForDeploy(collection.address); }

Vlad: Hi all, nft item metadata on getgems is not loading. How to solve the problem? Thanks in advance)  https://github.com/getgems-community-tact/nft-template-in-tact/

Brave: more context please. (reply to 139095)

Vlad: The collection content is uploading, but the nft item is not  https://green-real-raccoon-214.mypinata.cloud/ipfs/bafybeiduhdakilkzxtr6ppdogdusrk6qstdanczzhjwqvknfl4lvk5ixqe/ - item.json and meta.json (collection)  get fun get_nft_data(): GetNftData {         let b: StringBuilder = beginString();         let collectionData: String = self.individual_content.asSlice().asString();         b.append(collectionData);         b.append(self.item_index.toString());         b.append(".json");          return GetNftData {             is_initialized: self.is_initialized,              index: self.item_index,              collection_address: self.collection_address,              owner_address: self.owner,             individual_content: b.toCell()         };     } (reply to 139096)

Brave: wierd. can you show whats the output is?  im lazy to check it, but i guess that would help other guys to help you. (reply to 139104)

Vlad: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/nft_collection/nft_collection.tact#L74

He's die..: Can someone help me with sending Jettons from one wallet to another through code?

&rey: Yes docs can, https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons#best-practices. (reply to 139127)

He's die..: I want to use the sendTransaction function through TonConnect. Is it possible? (reply to 139131)

&rey: Just port/copy that code, remembering: "[sender] posts jetton transfer [order] to sender's jetton wallet". (reply to 139137)

Tommy: русские есть? кто на питоне пишет?

Deniel: Only english @tondev – russian community (reply to 139141)

Yousif: Hi Iam new on TonDev. i wanted to ask if there are ready sites that i can make some decorations changes on font and images to be ready to use? Like wordpress themes .

✌️Yescoiner🌱SEED Full cripto 📦 Bums: Goodnight, I'am searching for someone that can dev a game that awards the players crypto if you can do it, give me the price.

Yousif: Is there any other community that i can ask this question there?

— 2025-01-27 —

M: I have confirmed the transaction from the wallet. tx is sent but in the app it is still asking confirmation, the problem is based on popup confirmation  i need to call some API in my backend whats the work around for this issue, if i cancel confirmation i can't because transaction throws an error

Vanshika: Hi guys we are planning to run TON validator in mainnet with below configuration: 2xXeon E5-2660 v3 2.60 GHz  so it has 10 core CPU, 2x 10 cores so 20 cores total the minimum requirement is 16 core CPU would this configuration work?

Carlos: /stat@combot

Combot: Total messages:139177

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 30  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

M R X: Help Needed: Duplicate Account Created After Unban (@PhilosopherW)...  I am unable to access the account which was unbanned   When I try to login it starts making new telegram account....

Falco: Does anyone know why the efficiency on https://toncenter.com/api/qos/cycleScoreboard differs from checkloadall function in ton lite client?

Lex: hi, I have made a usdt transaction through my Ton wallet to Coin Store Exchange but I mistakenly used the wrong Memo.   This is the My Ton wallet address UQCWEqKiTZVPmdeL54T_GLR7rnBpgn7qnZXrP1kDkDkjOiMY   And here is my transaction hash 45befa5c1a4b2a791dabd419837a10a658975537c8b7da89811bbc90460cec9a I use HONOR 50 smart phone  .What is the status of my usdt, can it still be returned? (reply to 139195)

&rey: Only the exchange can do anything with that, NOT anyone in this chat or writing in DMs. (reply to 139196)

Adam: Oh you can see with coin store exchange (reply to 139196)

Adam: For the ton side the transaction is already on chain so not reversable

Adam: And dont listen to anyone in dms who tell you they can help only listen to official support

Lex: I already tell their contact support, but they can't do anything because the transaction already on chain, tidak mengapa, itu adalah kesilapan saya (reply to 139205)

Adam: Then it’s lost sadly (reply to 139206)

Lex: it's okay ,that's a lesson to be more careful (reply to 139207)

&rey: Not relevant to TON at all. In line with this, I won't even speculate on possible reasons. (reply to 139182)

&rey: I don't know. Try running full node first. (reply to 139169)

M R X: Who should I contact? (reply to 139216)

&rey: Presumably Telegram via built-in support. Please note: even if they don't respond, that will not allow you to discuss the issue in this chat. (reply to 139219)

M R X: Ok i will not (reply to 139220)

Алина: How to convert bigint shard number to the hex format that tonviewer understands?

&rey: 13835058055282163712n.toString(16) "c000000000000000" (reply to 139223)

Алина: not quite (reply to 139224)

&rey: Add (1n << 64n) if value is negative. (reply to 139225)

Алина: I've stumbled on this method, seems to work for both positives and negatives, i guess:   (13835058055282163712n & 0xffffffffffffffffn).toString(16) "c000000000000000"

lucky80 🐈‍⬛ 💠: Hi guys good evening   I have question about TMA migration program.   1. We are on multichain, and so we need to migrate all asset on different chain to TON blockchain? 2. What about liquidity? there are locked liquidity and we don't have control over this. should this be migrated as well?  Thanks

Adam: Here where to ask @devs (reply to 139237)

Oken: Is ton existed in etherium before ton mainnet?

&rey: I doubt, even though that's possible: current mainnet has previously been called "testnet2" IIRC, and everything depends on when the bridges were built. (reply to 139239)

Tma#Sup: Пожалуйста снимите блокировку в ру чате, я отправлял ссылку на гитхаб и меня заблокировали

Mr.travellerr: you can send via DM (reply to 139246)

&rey: Hi! Just now, I'm writing down a list of exercises for a book about TON. Here are three about its idea!  (1.2.a) Name the three main types of blockchains that comprise the TON architecture. (1.2.b) Explain the role of shardchains in TON's scalability strategy. How do they contribute to handling a large volume of transactions? (1.2.c) Describe the process of message routing in the TON network. How does TON ensure efficient message delivery across its multi-blockchain architecture, especially considering its asynchronous nature? Discuss the challenges and solutions for maintaining message integrity and order in such a system. (Hint: Think about network topology, routing algorithms, and mechanisms to handle asynchronous communication in a decentralized environment).

Adam: That’s good (reply to 139252)

Adam: When will it be online?

&rey: Not earlier than next year I guess, with me having to take courses on extended discrete math to be able to explain all concepts well. TON is, after all, async-focused, and current applications don't seem to utilize that much.  I'm taking inspiration in Donald Knuth's "The Art of Computer Programming". (reply to 139254)

— 2025-01-28 —

Sunny: Evening Team TON!

Sunny: Hope you're all well. Just joining the ecosystem...thought i'd say Hi. I'm not a Dev per se...but we have build an artistic creators ecosystem that we are launching on TON (our utility token) and obviously, the mini-app within Telegram.

Sunny: If you want to know more, just ask. W e would love to collab with your projects should there be synergy in what we are doing.

Oskarcv: hi there, does someone know how i can make a transfer of jetton I've been stuck for weeks, i have follow, https://docs.ton.org/v3/guidelines/dapps/cookbook#how-to-transfer-ton-how-to-send-a-text-message-to-another-wallet and  https://docs.ton.org/develop/dapps/asset-processing/jettons#send-jettons-with-comment and i simply cant get the transaction pass through   does someone knows if there is a github or something to try to figure out how to send a jetton pls   I'm totally lost in here

Anonymous💰: I know it. ;) (reply to 139274)

Daniil: What type of wallet do you need to make a batch transfer of jettons to many addresses and save on gas? HighloadV3 or regular v5 is ok?

jennifer [afk]: highload (reply to 139281)

Alex: We have this example project: https://github.com/ton-community/tma-usdt-payments-demo  This is not the right production way to build TMA, but the way you can play around payload (message content) and learn the message and transactions flow for Jettons.  If you want learn the basic of how to send tx, you may learn this from https://docs.ton.org/v3/guidelines/get-started-with-ton. (reply to 139274)

Daniil: Is there any guide on how to do it? I am using golang (reply to 139282)

jennifer [afk]: https://docs.ton.org/v3/documentation/smart-contracts/contracts-specs/highload-wallet (reply to 139284)

Alex: I suggest to follow up this guide, to get clear image about how highloadwallet v3 works. Next, reimplement this logic with Golang. If you face problems with Golang, this ask in the tonutils-go community. (reply to 139284)

Daniil: thank you (reply to 139286)

Shivansh: Looking for a collaboration with ton, can anyone suggest whom to talk to?

Jason $ETN 🆙 UXUY: I have a quick question if anyone could spare 10 minutes to try and help me with this I really appreciate it I'm creating a react app and I'm using tonconnect SDK  They are transaction buttons within the application and they will send the transaction message to the wallet of the user and upon transaction being completed will return the message to the app fine this is working all good for me where I have the problem is couple of users inform me that they were able to get the in-app rewards by completing the transaction on testnet now I've been trying to adjust my code this is where it's at now  useEffect(() => {     const initializeTonConnect = async () => {       try {         tonConnectUI.setConnectRequestParameters({           network: 'mainnet', // Force use of Mainnet         });         await tonConnectUI.connectionRestored;         setIsLoading(false);       } catch (err) {         console.error('TonConnect initialization error:', err);         setMessage(`TonConnect error: ${err.message}`);         setMessageColor("red");         setIsLoading(false);       }     };     initializeTonConnect();   }, [tonConnectUI]); const transaction = (cost) => ({     validUntil: Math.floor(Date.now() / 1000) + 300,     messages: [       {         address: "UQByLRa7aQmaFA-3QXWLj3tpWvOPh5DDAkJ0G4FvQFo-UdGX",         amount: cost,       },     ],   });    const handleClick = async () => {     setButtonText("Processing...");     setButtonDisabled(true);  What I'm trying to do is force the response to only go as successful back to the application if it is complered on MAINNET What am I doing wrong ?

Jason $ETN 🆙 UXUY: And yes I have tried replacing 'mainnet' with the global id -239   useEffect(() => {     const initializeTonConnect = async () => {       try {         tonConnectUI.setConnectRequestParameters({           network: '-239', // Force use of Mainnet         });         await tonConnectUI.connectionRestored;         setIsLoading(false);       } catch (err) {         console.error('TonConnect initialization error:', err);         setMessage(TonConnect error: ${err.message});         setMessageColor("red");         setIsLoading(false);       }     };     initializeTonConnect();   }, [tonConnectUI]); (reply to 139308)

Adam: Confirm the tx on mainnet before sending rewards (reply to 139309)

Jason $ETN 🆙 UXUY: With API ? (reply to 139310)

Adam: Toncenter (reply to 139311)

Jason $ETN 🆙 UXUY: I'm not a very advanced level coder in fact I know literally close to nothing I'm trying to get this application to work with the least amount of re-coding what I already have I definitely do not have the skills to make it check each transaction initiated wait to give the rewards until it's confirmed on the blockchain and the API for TonAPI or tonconsole or toncenter gives the hash (reply to 139310)

Jason $ETN 🆙 UXUY: So just to reiterate there's nothing that I can add in the code that specifies that it must not allow testnet wallets to be connected there's nothing I can do ? (reply to 139313)

Adam: I dont think so , normally to avoid this people make either a smart contract that upon receiving a call distributes or have the tx checked on chain when sent (reply to 139314)

Oken: It's possible to create contract which owns many walletv5 wallets and walletv5 doesn't have their private keys. One main contract private key controls all?

Adam: Yeah (reply to 139319)

Adam: The problem is that the smart contract is initialized by both initial datas

Adam: Si if you want to deploy two smart contract same key you will endup with the same

Adam: The idea needs more thinking through

Adam: You can make a main contract that upon being called transfer the message to all the wallet v5 and wallet v5 accept the internal message but the wallet v5 code then will need some tweaking because now they accept exeternal messages with signatures

&rey: I'd bet it is possible to get that in-app reward without doing any transaction. You should do all sensitive checks on backend, treating frontend as nothing but a guide for user. (reply to 139308)

Ihor Million: Hey there guys,  Do you know, is it good org - https://github.com/Telegram-Mini-Apps ?

Ihor Million: Worry about malicious sources

Jason $ETN 🆙 UXUY: Maybe I've obfuscated it maybe I haven't maybe I'm lazy but I'm pretty sure everything can be tampered with always obviously if you get a good look at the back end and you could probably figure out a way unless maybe stopping cross site scripting (reply to 139326)

Adam: yes?

Adam: what data

Adam: regular wallet v5 is way simpler to procced to but the limit is 256 message (reply to 139281)

Liad: Hey guys ! I own a local website in israel, and wondered if i could embrace Ton's features somehow.  Paeticularly those who use Ton DNS,payments,proxy,sites,storage.  Anything that can help would be a bless !

&rey: Generally, that's a wrong order; first you should think what features the site should have, and second how to implement them. (reply to 139372)

Oken: Does ton have hardfork or softforks? (reply to 139376)

Oken: Or any forks? (reply to 139376)

Liad: Not quite sure i undersrood what you mean (reply to 139376)

&rey: There are TON and <some other TVM blockchains> which originated from the same source code; there aren't like two TON blockchains of equal stature, though I should note that testnet and mainnet work on same principles.  You can see list of hardforks in network connection config https://ton-blockchain.github.io/global.config.json. (reply to 139382)

Combot: Combot has warned Oken (1/3) Reason: Word **** is not allowed

Oken: Thanks (reply to 139390)

Oken: Question about audit. It's mаjor gаme nft smart contract. What will happen if I send 0.05 TОN with same or modified message to ЕQ...ZH address? Do I get freе nft or it won't works like this?

Oken: https://tonviewer.com/transaction/6b9fa13938310c87fde62c8e27586fdd6288d583c00053b96f283e658db1684d (reply to 139395)

Oken: If anyone knows please tell. I wanna learn about it before I launch my own collection

&rey: 1. Intent: what do you want to be available on the site. 2. Means: what technologies you'll use for (1). (reply to 139385)

Liad: /stat@combot

Combot: Total messages:139399

Oken: I tried with another address but received address which connected to major. But how does contract knows who to send to (reply to 139395)

Oken: How does contract can message with external databases? (reply to 139403)

&rey: It cannot obtain any additional information (from "external databases", or from other contracts) during a transaction. (reply to 139404)

Oken: https://tonviewer.com/transaction/c9ecb231f6a4fba04d844d99e304ca57fcc24c2391c100a58e7e3986d70a3afd (reply to 139405)

Oken: I used this (reply to 139395)

Oken: Nft received other address which is connected to major (reply to 139406)

Oken: How does smart contract knows

&rey: First of all, why would it work? Generally, you have to mathematically prove that your request/contract/system will work, not just look for obvious counterarguments. (reply to 139406)

&rey: Well there are two options: 1. contract contents (data cell), 2. message contents. (reply to 139413)

Oken: It that major case, which method was used (reply to 139415)

&rey: You're welcome to figure it out, because I haven't ever seen their contracts and would like to remain ignorant. (reply to 139416)

Oken: I just want to know how the contract knows who to send what NFT to, regardless of who he accepted the fee from if external data is restricted. Or you already answered the question with this? (reply to 139415)

Oken: In first case, I wanna know what I did, I sent 0.05 ton, then what? Do I send some message there (reply to 139406)

lucky80 🐈‍⬛ 💠: thanks (reply to 139238)

Oken: I found ton tutorial in stepik from official ton, but there is no real examples. They didn't show real transactions in tonviewer and what thing does what

— 2025-01-29 —

Oken: Whadahell

Oken: I just can copy ton code and launch my own Blockchain huh?

N R (InfinitOptions): Hi is there crypto recovery expert here / develope familair with Ton transcations? I have a possible client trying to rcover ton from an auction, funds from a domain sale went to an address identical to his except for last 3 digits. Funds are still there. Please DM if you can help

Shivansh: wanted to talk about a partnership with TON, we are organizing a 24 hour open innovation hackathon, would like to talk to someone

Vitalii: Hello, guys. Are there any validators among you? I am looking for a reliable validator to connect a TON Liquid Staking contract to provide liquidity under APY.  Please respond

&rey: "Crypto recovery" is a branch of scam, but here's what to check genuinely: TON addresses have multiple forms pointing at the same contract. It sounds very much like your client had indeed received money but just didn't recognize their address, due to unbounceable-bounceable form differences. (reply to 139480)

&rey: They should put address into converter at ton.org/address to check that. (reply to 139511)

&rey: MyLocalTon does pretty much that. (reply to 139477)

Alexe: Hey guys, I'm trying to use the tonweb library to fetch jetton metadata, but I have a problem. I'm trying to instantiate TonWeb like this (which is same is from official docs):   const tonWeb = new TonWeb(           new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'),         )  but I get TypeError: Cannot read properties of undefined (reading 'HttpProvider')  Any ideas why?

Anonymous💰: hm... (reply to 139576)

&rey: Well your TonWeb lib did not load. (reply to 139576)

Alexe: Should I have some specific target in tsconfig to load tonweb? (reply to 139581)

&rey: Generally, you just include it in a script tag. (reply to 139583)

Alexe: I'm not using html, this is for a typescript backend (reply to 139584)

Anonymous💰: nest? (reply to 139585)

Alexe: yes (reply to 139597)

Julius: Hello, I'm new to the TON blockchain and still learning the concepts. I have a question: is it possible to import a wallet using tonutils-go if I have the following data?      Wallet version: V3R2     Private Key: <hex string>     Public Key: <hex string>     Wallet ID: <int>     Address: -1:<hex string>  I want to transfer the balance from this wallet to another one. The wallet mentioned above is on a test blockchain, not the real TON.  If someone could point me in the right direction, I would really appreciate it.

Julius: I tried the method w, err := wallet.FromPrivateKey(api, pk, wallet.V3R2) , but the address changed, there is something that I don't get

Max: I received a payment from Fragment with text "Reward from Telegram channel Ref#SQ6YWnuAP. Does anyone know which Telegram channel it came from?

Anoke: hi, maybe i miss understood u, maybe not. try to check bounceable/non-bounceable addresses and try to research this way. as i remember it changes 2 first symbols of address (reply to 139609)

Алина: How to convert hex shard number into a decimal big int? 😅😁

Алина: Oh, it's just strconv.ParseUint(shard, 16, 64)

User<6616116780>: hello world

Darvish Industrial and Financial Group: Hello, good time. I have a question, and I would appreciate your guidance.    If we want to distribute a token that we have created to a large number of wallets—around 120,000 users—what software or platform should we use?    Where can we check the costs associated with this transfer?

Combot: Combot has warned Darvish Industrial and Financial Group (Nylon Production Groupe of Darvish) (2/3) Reason: Word ********* is not allowed (reply to 139637)

Darvish Industrial and Financial Group: What is the best way to carry out this process quickly and efficiently?     It is clear that my question is specifically related to the TON blockchain, as we intend to carry out this process within this ecosystem.    Thank you for your response and guidance, dear friends. (reply to 139637)

&rey: The most common way is to let users take their jettons; there was certain repository by https://github.com/Gusarich to that effect. (The process can be improved by splitting the user array by first 8 bits of their address and assigning them to different contracts but there are some details.) (reply to 139640)

Julius: This was not exactly the problem, but your information was very helpful, I was able to figure out and now I don't need to import that private key anymore, thanks! (reply to 139619)

— 2025-01-30 —

Daniel: Hey everyone, has anyone worked with payment invoices from tonconsole? I can't figure out where to register webhook

&rey: They say "3. Register a webhook on the Overview page to handle invoice status changes." (reply to 139648)

Alexe: Hey everyone, are there any examples how to parse the jetton content cell to get the metadata (name, symbol, etc.)?

Anonymous💰: sure (reply to 139671)

Alexe: Can you please share them with me as well? 😅 (reply to 139672)

Adam: ´´´  const TonWeb = require('tonweb');  // Initialize TonWeb with a provider const tonweb = new TonWeb(     new TonWeb.HttpProvider('https://ton-mainnet.core.chainstack.com/.../api/v2/jsonRPC') );  // Replace with the actual Jetton master contract address const jettonMasterAddress = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'; // e.g., mainnet USDT  async function fetchJettonMetadata(jettonMasterAddress) {     try {         const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: jettonMasterAddress});         const data = await jettonMinter.getJettonData();          console.log('Jetton Metadata:');         console.log('Total supply:', data.totalSupply.toString());         console.log('URI to off-chain metadata:', data.jettonContentUri);     } catch (error) {         console.error('Error fetching jetton metadata:', error);     } }  fetchJettonMetadata(jettonMasterAddress); ´´´ (reply to 139673)

Victor: GM, why taxes at ton is too high??

Adam: what fees ? (reply to 139678)

Anonymous💰: ??? (reply to 139678)

Minimal ☄️: Guys, I have 2 questions regarding 'bounce' property:  1. Is it true that v4 wallets can't set bounce flag to true (in case of failed tx, the assets are lost)?  2. How to set bounce to true in my transactions:  const cell = new window.TonWeb.boc.Cell();             cell.bits.writeUint(0, 32);             cell.bits.writeString(invoicePayload);             const boc = await cell.toBoc();             const payload = window.TonWeb.utils.bytesToBase64(boc);

&rey: 1. They can. 2. That flag isn't in payload. Convert destination address to bounceable form. (reply to 139685)

Minimal ☄️: How can I do that, should I parse address differently and use that parsed address as a destination or? (reply to 139687)

&rey: new TonWeb.Address('...').toString(???) (reply to 139688)

Minimal ☄️: Thank you very much!  I have find a solution in the meantime (with your help), one can use: https://ton.org/address/  It converts instantly to mainnet/testnet and (non)bouncable addresses

Anonymous💰: Sure (reply to 139695)

Mohammad: Hey everyone I built a telegram mini app using vite+react. Each time I release an update, I see the old version in my mini app unless I reload it one time. But even after the reload, if I close and re-open the app, I see the old version. I checked that imported scripts and css files names are changed, but Telegram is loading the previous cached version. What is the best practice to solve this issue?

Yaroslav: Hello everyone! Question about Jetton func contracts from samples https://github.com/ton-blockchain/stablecoin-contract. Why when adding a variable to storage of the jetton wallet contract and updating all storage-related functions load() and save() in the test environment in blueprint mint goes ok, but when deploying to the testnet when calling mint on the walleta address, error 9 underflow pops up

Adam: The error 9 probably comming from load

Adam: Make sure the initial storage is set correctly to be loaded

User<7529240988>: Hello guys, I want to know how to make a cloud mining platform for TON

&rey: You do know that TON is not mined, right? (reply to 139718)

User<7529240988>: What do you mean? (reply to 139721)

Haa: Hi, does anyone have a reliable guide on how to send tokens from the backend using quicknode rpc and nextjs?

Haa: Can’t find any resources online

Holst 🧙🏻‍♂️: Hello guys! I need some help with dust liquidity, here is mt tx and its always. Here is my attempts: link   Any help will be very usefull. Thanks : )

Green: what do you want to know? you tried to add liquidty but not working? (reply to 139729)

Adam: it worked correctly (reply to 139729)

Anonymous💰: Did you try to send jetton? (reply to 139729)

Holst 🧙🏻‍♂️: yep, i want to deposit to ton/usdt pool (reply to 139730)

Anonymous💰: Got it. ;) (reply to 139734)

Green: maybe you don't add liquidty on deudst platform. when I develop ton launchpad, for add liquidity, you have to do two things. not only deposit but also create vault  similar to create pair on solana ;)          const TON = Asset.native()         const JETTON = Asset.jetton(Address.parse(jettonMasterAddress))          const body = beginCell()             .storeUint(0x21cfe02b, 32) // opcode for jetton transfer             .storeUint(0, 64) // query id             .storeSlice(JETTON.toSlice())             .endCell();           const myTransaction = {              validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec             messages: [                 {                     address: t_DedustFactoryAddress,                     amount: toNano(0.1).toString(),                     payload: body.toBoc().toString('base64'),                     // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove                 },              ]         } (reply to 139734)

Green: wish this help you. (reply to 139734)

Anonymous💰: Deposit is easier than withdraw.

Holst 🧙🏻‍♂️: Thanks all guys! Now it's working 😘

— 2025-01-31 —

albert: I want to create a smart contract for me. Can someone send me a message?

WhyesCode: can you provide more info about the project (reply to 139779)

Green: for you? (reply to 139779)

albert: Yes dm mi (reply to 139780)

Mr.travellerr: Do you need ton smart contract? (reply to 139793)

albert: Yes (reply to 139794)

Anonymous💰: Paid work? (reply to 139795)

Yousif: its not proof of work,  Its POS consensus (proof of stake) thats mean you have to hold Ton coins in staking in order to get more Ton coins. (reply to 139724)

Oken: 175 transactions per second?

Adam: Yes (reply to 139799)

Oken: Polygon faster than ton? (reply to 139800)

Adam: No beacuse there is no way polygon  is 65k tps

Adam: Solana tps is 4k

Adam: Polygon if I remember it was around 50 tps

Denis: Polygon can get pretty high, i think at least to some thousands tps

Yoni: Hello devs, am new for ton.I have question on ton api can refund or money back from payments?

&rey: No. No blockchain is actually able to revoke already-happened transactions, and TON is no exception. (reply to 139808)

Yoni: okay what about fee to send ton to users? (reply to 139811)

&rey: Here: https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees#fees-for-sending-ton. (reply to 139812)

Ghosthawk: you can use testnet before send real transactions. (reply to 139808)

Yoni: Am try to make payment from telegram ton space, can you suggest me docs for api documentation also webhook   Thanks (reply to 139813)

albert: Yes (reply to 139796)

Anonymous💰: How much? (reply to 139817)

albert: It depends on the project. (reply to 139818)

Anonymous💰: As you mentioned, you want Ton smart contract.

Minimal ☄️: Hello,  What is the minimum amount of TON on a wallet in order to deploy it on a TESTNET? I am talking abount V4R2 wallet,  Also, what is the minimum amount of TON needed when sending a TX with a comment, also on a TESTNET?  I am unable to find those information online

Sunny: Is there a way to identify the deployer wallet of a token? I am able to see this information for other chains like ethereum, base and solana through their explorers. Was wondering if a similar method exists for TON?

Adam: the deployer is the the one who deployed the master smaert comtract of token (reply to 139823)

Sunny: Is there a way to identify the wallet that was used to create the contract? (reply to 139824)

Adam: yes (reply to 139825)

Sunny: nice, where can I see this info?

Adam: scroll in the transaction of the master contract

Adam: the first one is the deployement

Sunny: I'm using Tonviewer. Is that the right tool for it?

Ivan: Hey, what do you think of adding @randomcoffee_official_bot here to help builders-builders connect?  @tsivarev @alefman

Anonymous💰: Right. (reply to 139835)

User<7529240988>: I didn't understand (reply to 139797)

Sunny: Okay. Right now I'm looking at tonviewer[dot]com/EQBsosmcZrD6FHijA7qWGLw5wo_aH8UN435hi935jJ_STORM I should scroll down to the first txn in the transactions section? (reply to 139831)

Adam: UQCNN5fzh2kjZzg6-txCGyPvvcV7LeaxiVGRNjC5fdFS_hg2 (reply to 139841)

Adam: tonviewer[dot]com/transaction/4fab3e8e3437ae256aa7dd770926bff75ae7a88aa501635b6c461d306f3b854e

Adam: deployement tx here

Green: exactly (reply to 139841)

Sunny: I see that now. Thank you so much! Is there no way other than to scroll past all the transactions? This token didn't have a lot so it's relatively easy. Some tokens have a lot of them (reply to 139844)

Green: then you can use script with tonapi (reply to 139851)

Adam: use tonapi to get first ransaction that contract (reply to 139851)

Sunny: will check this out, thanks! (reply to 139852)

Sunny: Thanks! Will check this out (reply to 139853)

&rey: Use dton.io/graphql to filter transactions which originated in uninit state and ended active. (reply to 139851)

sepehrmnp: Hello What happens if an account with a lot of data, never does any transaction or no transaction comes to it and have low amount of TON balance?

Adam: It gets frozen (reply to 139858)

Adam: Until you pay ren and provide the data that was in it

Adam: It will hold only the balance and data in hash meanwhile

Mehmet Ali: our jetton transfers tagged as "SUSPICIOUS transaction " at tonviewer. Any idea where to call to correct this?

&rey: First some spammer sends a message, then it arrives to your contract and initiates transaction which freezes it. (reply to 139858)

&rey: No, it is not subject to storage fee because it doesn't represent anything in blockchain. (reply to 139860)

Akash: What if no one send any transaction? (reply to 139864)

Minimal ☄️: How to activate an address on testnet created on TonKeeper?  I am sending assets to it but it's bouncing every time?

&rey: Remains active, accumulates more fee. (reply to 139868)

&rey: The easiest way is to send an outgoing message [to oneself, probably]. (reply to 139869)

Minimal ☄️: but once it's created, there is no assets to be sent? (reply to 139871)

&rey: Make sender use nonbounceable address (starting with 0). Faucet recognized that. (reply to 139872)

WhyesCode: It could be due to unusual transaction patterns or unverified smart contracts. (reply to 139863)

Mehmet Ali: thx, any idea how to verify jetton sc? (reply to 139880)

Mehmet Ali: Any doc, guide, howto? (reply to 139896)

سهیل: Hi someone can help me make me smart wallets Tonkip To cancel

Adam: What? (reply to 139907)

Anonymous💰: ??? (reply to 139907)

سهیل: i can't speak inglish

Ghosthawk: Many don't know. So you can use the translation to explain yourself. (reply to 139910)

𝐴𝑅𝐸𝐹 𝑆𝑆: Can this api be used to send ton? https://toncenter.com/api/v2/

Adam: You can send external messages to your wallet signed (reply to 139914)

𝐴𝑅𝐸𝐹 𝑆𝑆: Please explain more? (reply to 139915)

𝐴𝑅𝐸𝐹 𝑆𝑆: whats external messages? (reply to 139915)

Adam: When you use tonkeeper for exemple to send ton

Adam: You send an external messages to you wallet signed by the private key

𝐴𝑅𝐸𝐹 𝑆𝑆: so external messages  =  send ton ? (reply to 139920)

Anonymous💰: https://docs.ton.org/v3/guidelines/dapps/cookbook (reply to 139921)

𝐴𝑅𝐸𝐹 𝑆𝑆: 😃 (reply to 139922)

Adam: You get it now (reply to 139924)

Julius: Someone know why I got this error while using tonutils-go? I'm trying to convert a block to a cell, below is a example of the code that generate this error:  keyBlockData, err := api.GetBlockData(ctx, block) blockCell, _ := tlb.ToCell(keyBlockData.BlockInfo)  panic: runtime error: index out of range [0] with length 0  goroutine 1 [running]: github.com/xssnick/tonutils-go/tlb.ToCell({0x458e00, 0xc00057e160})         C:/Users/user/go/pkg/mod/github.com/xssnick/tonutils-go@v1.10.2/tlb/loader.go:474 +0x1239 main.main()         C:/Temp/src/main.go:154 +0xc25 exit status 2

WhyesCode: It looks like the error is due to trying to access an element that doesn't exist in the keyBlockData.BlockInfo array. (reply to 139926)

WhyesCode: Double-check that keyBlockData.BlockInfo is populated correctly before calling ToCell.

Not a Pro: Hello, I need to register a webhook for payments, in documentation it is written that it should be approved by the admin. The admin mentioned in documentation doesn’t respond to messages.  Is there another way to reach out to him? It’s been a week.

𝐴𝑅𝐸𝐹 𝑆𝑆: Liteserver crashed with -256 code. Message: contract is not initialized (reply to 139925)

Tim: becuase contract is not initialized

Adam: Remove messaage it has mnemonic (reply to 139933)

Adam: You need to initiatlise contract and with a wallet smart contract first

Adam: wallet smart contracts accept external messagzs

𝐴𝑅𝐸𝐹 𝑆𝑆: its testnet (reply to 139935)

Adam: Oh okey

Julius: Since is a block that I get with the other method, I would expect to be correct, but I tested with mainnet and testnet and both ended in error (reply to 139928)

Julius: By the way, the only way to prune a block in tonutils-go is to reconstruct it manually? For example, If I just want the header...

𝐴𝑅𝐸𝐹 𝑆𝑆: Which part of the document should I refer to? (reply to 139936)

Adam: Just send a tx using tonkeeper (reply to 139943)

𝐴𝑅𝐸𝐹 𝑆𝑆: Whats tx (reply to 139944)

Adam: Just send a transaction using tonkeepr

Adam: Btw you can use tonweb and sdks to send ton too hope uk that

𝐴𝑅𝐸𝐹 𝑆𝑆: Why tonkeeper (reply to 139947)

Adam: Just one the many ways to initialise contract (reply to 139950)

𝐴𝑅𝐸𝐹 𝑆𝑆: Does sending a ton coin to a another wallet require an initial contract? (reply to 139951)

𝐴𝑅𝐸𝐹 𝑆𝑆: I was completely confused.

WhyesCode: Yeah! probably if you want to extract only the necessary parts like the header. (reply to 139941)

WhyesCode: Use relevant methods from the tonutils-go library to parse and extract the required information.  Let me know if you need a code sample.

Julius: I will do that, thank you (reply to 139954)

𝐴𝑅𝐸𝐹 𝑆𝑆: i change wallet  now i get this error Get method "seqno" for account Address<EQC-XECXxv-M-6BfI3S3z5TpPFqujgDJhaQe9dL5fYKvfwy5> returned exit code -256

&rey: An inconvenience of pytoniq is that it doesn't work with newly created wallets. Or, rather, requires to use .raw_transfer. (reply to 139958)

Adam: and initialize seqno with 0 of error but i checked the contract it has 0 in balance (reply to 139958)

𝐴𝑅𝐸𝐹 𝑆𝑆: Is the wallet version important, too? (reply to 139962)

&rey: Not really. (reply to 139964)

bt/ss: Is it common for the bridge.ton.org to be always very slow?

— 2025-02-01 —

@CryptoCops: Hello. Does TON offer a GPU service?

&rey: It doesn't. Maybe you meant "does anyone offer a GPU-for-TON service", the question which is very different but is also presumably answered "no". (reply to 139980)

bt/ss: Still going (reply to 139968)

bt/ss: Should I just accept the funds as lost? why does the foundation with millions of funding keep up a website that just steals money?

@CryptoCops: is there an affiliate program or any kind of a rewards program for tje TON wallet? (reply to 139981)

bt/ss: not to be rude or anything but... what (reply to 139983)

@CryptoCops: i wasn't sure if TON owned their own GPUs or not (reply to 139984)

&rey: The blockchain doesn't and can't have such. On the other hand, there is Telegram's custodial application "Wallet" which might have rewards program.  Please DYOR into safety of Telegram Wallet for your usecases. (reply to 139984)

albert: I want to create a smart contract for me. Can someone send me a message?

Anurag: hello ton mods

WhyesCode: You're not ready (reply to 139995)

Mr.travellerr: is this scam? (reply to 140004)

John: Hey guys is anyone here who can help change little bit burn function on blueprint framework?

Adam: sure (reply to 140010)

𝐴𝑅𝐸𝐹 𝑆𝑆: when we call this api  https://bridge.tonapi.io/bridge/message?client_id=790445fbba5bb6df1b8856560c73d8f479714a760b0082cf6875a774f5611c7c&to=477d794c1d1d6bdb0c0d1a82f297454dd8a6fd91a87cdaec3ae98dd60c9d3342&ttl=300&topic=sendTransaction how can receive this event in pytoniq?

Avid: what is your mean of receive event; sending transaction with pytoniq? (reply to 140019)

𝐴𝑅𝐸𝐹 𝑆𝑆: When this api is called  In Tonkeeper this appears (reply to 140020)

Avid: https://github.com/ton-blockchain/ton-connect/blob/main/bridge.md read this document its abount ton connet bridge protocol idk but maybe also transfer some datas with internal links not just with this protocol (reply to 140021)

Majid: Hi

Majid: Any help?

cm4a: Can I create a casino with ton transaction send/receive on website

Green: sure, you have to develop smart contract (reply to 140041)

.: Hi, im trying to send Usdt to another Telegram wallet using tontonnect, but i got this error. Have you some solutionS? Im already have 0.3 Ton on my ton space. Maybe fees is too high?

KRONOS: Hey guys so one of my utilities is a telegram bot for minting and deploying memes on Solana. I need some clarification on this announcement. My bot can no longer operate now since it is based on solana blockchain and not TON?

&rey: That's probably a question for lawyers but remember that TMAs and just bots might have different rules. (reply to 140051)

KRONOS: So only the domain based applications then? (reply to 140053)

Majid: I welter the wrong mémo

Green: if wrong memo you already did, then here dev can't help you, you can contact with binance team.

Mohammad: Is there any way to have TonConnectUI in react and blueprint wrappers in my mini app? I want to use those wrappers for running get methods (with TonClient or TonApi) and sendingTransactions through those wrappers

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: There is many way to have TonConnectUI in react and blueprint wrappers in your mini app  import type { MyContract } from "../../wrappers/myContract"; (reply to 140077)

WhyesCode: Yes. It's possible (reply to 140041)

cm4a: How any api (reply to 140085)

WhyesCode: https://t.me/tondev_eng/140044 (reply to 140086)

.: Hi, im trying to send Usdt to another Telegram wallet using tontonnect, but i got this error. Have you some solutionS? Im already have 0.3 Ton on my ton space. Maybe fees is too high?

— 2025-02-02 —

.: Hi! Do anyone know, how to use op code “buy” for smart contract of Jetton? I saw  const op::buy = "op::buy"c; if (op == op::buy) {   Is it mean that I need to send transaction with op-code “op::buy”?

Mehmet Ali: Anyone has any idea why my jetton transfers tagged as "Suspicious Transaction". By the way my jetton sc has blue tick, verified.

.: But I need to change it for CRC32, right? Will it be 0x8a6cb8f4? (reply to 140128)

WhyesCode: Yes (reply to 140130)

.: i got more ton and now have 3 tons, still have that problem. Im trying to send 1 usdt (reply to 140109)

Bruno A.: Have someone already had this kind of problem while trying to use @tonconnect/ui-react on Next/React?   TypeError: Cannot read properties of undefined (reading 'ReactCurrentDispatcher')

— 2025-02-03 —

Eben-Ezer: Hello

TON Bounty Bridge: ​Ton  🏷 Developer Tool  Summary:UQD_8LuYUOvBq4xDNplDqko1oxxI4xtQawN3sXn4khz4mI4y  Created by mehdii1362

Nishant | Emerging Tech Product Guy: Any TON Dev here for Smart contract development ? Need few Jetton contract to be developed and integrated.

Merlin: yeah it is possible (reply to 140041)

cm4a: Documentation (reply to 140185)

WhyesCode: What are the mechanisms? Can you share details. (reply to 140181)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 31  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Mikael: Error: Malformed response:  Why this error cause during script exectuion? I made  npx blueprint run  command and selected necessary script and mainnet as a chain

Nerses: I am doing jetton transfer to smart contract and based on jetton notify message forward_payload the contract does some action. After successful transfer in contract accumulates some amount of funds, and I can find out where it comes from. Could someone give a hint what can cause this ?

Nerses: https://testnet.tonviewer.com/transaction/ced543d271a033581b7e969d6ef2e17f1e27c7b09b086c186f1cb18cae4f7741

Nerses: after this tx in contract accumulated 0.078060727 ton

Lukasz: Hi guys where was on docs.ton.org instruction step by step what I should install to start programming on TON. I have mean environment. Can somebody tell me?

WhyesCode: Are you a dev? (reply to 140208)

Adam: What do you need exactly? (reply to 140181)

Evgenii: You are sending forward_amount 0.09 ton, op::transfer_notification pays fees separately. All excesses end up in an owner balance if your handling logic doesn't send any outbound messages. What's bothering you here? (reply to 140200)

Nerses: in contract which receives jetton notify some funds are accumulate after tx. Which wasnt planned by architecture (reply to 140213)

Evgenii: contract which receives jetton notify gets forward_ton_amount grams. in your case 0.09 - fees which seems to match 0.078060727. if you do not design this owner contract to do something with this notification - what did you expect? this is by design (reply to 140214)

Nerses: is there any solution for such cases ? as specifying exact amount will ot be good approach to my mind (reply to 140215)

Evgenii: you may specify any amount in your transaction. you may specify none - and no notification will be sent. take a look at the reference implementation https://github.com/ton-blockchain/stablecoin-contract/blob/main/contracts/jetton-wallet.fc (reply to 140216)

Adam: But that’s bad as I said the contract needs gas to perform action so you need to give a forward amount (reply to 140217)

Evgenii: it depends. if some actions are needed to be performed on notification - a reasonable amount of TONs must be passed (and as a rule of good manners - should be sent back to the originator as excesses on tx completion). In certain cases a recipient could even wish to pay for transaction from its own balance (accept message). (reply to 140218)

Adam: He said that the contract upon receiving a jetton notification will perform certain actions (reply to 140219)

Nerses: Can I obtain jetton wallet address on chain in smart contract in case I receive jetton master address as input message ?

meomeocoj | Mike: Hi guy i try to use online crc32 to detect our opcode but seem it not correct how u guy dettect that

&rey: No in general. You should obtain jetton MASTER's code and data cells as well. (reply to 140228)

Evgenii: there is op::provide_wallet_address in minter contract to have it on chain. but under normal circumstances you should not care about jetton wallet contract associated with the address... (reply to 140228)

Nerses: if contract's actions are based on that jetton wallet address, will not calling op::provide_wallet_address  cause any issue as TON is asynchronous ? (reply to 140233)

Evgenii: for me it seems you are doing something strange. you send jettons based on wallet address itself, jetton wallet is calculated for you. (reply to 140234)

&rey: It isn't. Suppose the contract received some jettons A without notification, and LATER needs to send those out. How would it know its jetton wallet? (reply to 140235)

oracle: i have error when try to start my validator, is some one know what is this?    [pid 1199957] [time 1738592074] Signal: 6 ------- Stack Backtrace ------- /usr/bin/ton/validator-engine/validator-engine[0x561fb9] /usr/bin/ton/validator-engine/validator-engine[0x560516] /lib/x86_64-linux-gnu/libpthread.so.0(+0x13140)[0x7fa26f224140] /lib/x86_64-linux-gnu/libc.so.6(gsignal+0x141)[0x7fa26ed40d51] /lib/x86_64-linux-gnu/libc.so.6(abort+0x123)[0x7fa26ed2a537] /usr/bin/ton/validator-engine/validator-engine[0x56cbd7] /usr/bin/ton/validator-engine/validator-engine[0x58130a] /usr/bin/ton/validator-engine/validator-engine[0x56c516] /usr/bin/ton/validator-engine/validator-engine[0x5666aa] /usr/bin/ton/validator-engine/validator-engine[0x6b59ae] /usr/bin/ton/validator-engine/validator-engine[0x6b4d80] /usr/bin/ton/validator-engine/validator-engine[0x5f1102] /usr/bin/ton/validator-engine/validator-engine[0x5b87ae] /usr/bin/ton/validator-engine/validator-engine[0x582495] /usr/bin/ton/validator-engine/validator-engine[0x58223f] /usr/bin/ton/validator-engine/validator-engine[0x58ac2d] /usr/bin/ton/validator-engine/validator-engine[0x589440] /usr/bin/ton/validator-engine/validator-engine[0x58949e] /usr/bin/ton/validator-engine/validator-engine[0x4c6b60] /lib/x86_64-linux-gnu/libpthread.so.0(+0x7ea7)[0x7fa26f218ea7] /lib/x86_64-linux-gnu/libc.so.6(clone+0x3f)[0x7fa26ee03acf] -------------------------------

Evgenii: you ask your contract to send jettons to the wallet address. you do not need to know destination jetton wallet. (reply to 140236)

&rey: Yes, but the problem is that contract doesn't know its own jetton wallet either. (reply to 140238)

Evgenii: I would pre-calculate this and save to contract storage. (reply to 140239)

Evgenii: if we are talking about validation of the notification message

&rey: Back to square one; @NersesA is probably asking how to do this. (reply to 140240)

Evgenii: pre-calculare it off-chain

Nerses: it is  impractical as in that way you limit your contract to work only for specific jettons (reply to 140240)

&rey: If a contract is to handle unlimited amount of jettons, it cannot store all those jetton wallet addresses. Also, that requires some admin role permitting to initialize the map since it cannot be included in the StateInit. (reply to 140243)

Evgenii: you may have dict of such wallets then. an alternative - is to calculating this on-chain by async calls to minter each time, waiting for response and proceeding in a separate transaction (reply to 140244)

&rey: Minter can be just a malicious contract, actually, and return USDT jetton wallet. (reply to 140246)

Evgenii: admin role is not required - you can deploy your contract with stateInit w/o this information and bind an additional data as a body. constructor pattern (reply to 140245)

Nerses: currently I think about that approach but I think ton's asynchronous  behavior will bring some surprises (reply to 140246)

&rey: and have a MEV send their own constructor message with maliciously constructed dict. That won't do too. (reply to 140248)

Evgenii: your stateInit would include an owner address to check an op was sent from a right sender. also 1 bit of state would make sure this could be only called once (reply to 140250)

Nerses: referring to this. Then how in dexes the transferred funds are refunded in case swap isnt completed ? do they hardcode and support only few jettons ? (reply to 140239)

🇵🇸: what is the lowest hardware requirement for running liteserver for own use?

Adam: Only Jetton wallet know it’s owner (reply to 140239)

Adam: So when i receive a message from it’s owner it does the transfer

&rey: Each vault supports one asset only. (reply to 140253)

Adam: They dont care about owner they send funds back to the jetton wallet that sent them (reply to 140253)

Adam: You dont need to know the owner to refund

Nerses: yes but I need to know my jetton wallet and it is on chain ,thats the problem (reply to 140260)

Adam: In the example you sent of dexes you already know the jetton wallet because it initiated the swap? (reply to 140262)

Adam: With the jetton code and wallet address you can know the jetton wallet address even if it’s not initiated (reply to 140262)

Nerses: I think there was misunderstood. I sent jettons to dex and now in case swap failed the dex should refund. But the dex contract doesnt know it's own jetton wallet address to whom it should send jetton transfer message and later that jetton wallet will do real transfer (reply to 140263)

Adam: The dex can predict it’s jetton wallet (reply to 140266)

Adam: Using jetton code and its address

Adam: It can calculate it

Nerses: yeah it will solve of course but when you want your contract to work for arbitrary jetton it becomes real overhead to have for every jetton its ode (reply to 140264)

oracle: someone (reply to 140237)

Adam: Just check the jetton notify message (reply to 140272)

Adam: It has in it ´s data the jetton code

Adam: If you explain what you want to so exactly i can help (reply to 140272)

KAM N: TON supports three different languages, and as a Rust developer with some experience in Solidity, I’m wondering—why do we even need three languages?

Nerses: I have a smart contract where users can send arbitrary jettons. The jetton transfer message contains a payload with specific data, which is then copied into the transfer notification payload. When the contract receives jettons, it needs to perform certain operations based on this data. If the operation fails, the contract is supposed to return the jettons to the user. The challenge is that the jetton type can be arbitrary, and the contract’s jetton wallet address is not known on-chain. (reply to 140277)

Adam: Then the smart contract will use the jetton notify to get jetton code and perform actions (reply to 140280)

Nerses: cant  it use just sender() and send to that address token Transfer message specifying as destination the address of from field of TokenNotification ? (reply to 140281)

Adam: Token transfer must be sent to jetton wallet (reply to 140282)

Nerses: yeah so sender() of receiver TokeNotification will be smart contracts jetton wallet (reply to 140285)

Adam: Actually yeah (reply to 140286)

Adam: The sender of jetton notification is the jetton wallet

High/or: Hello, is it possible that the manifest for TONconnect is host on a .ton site?

&rey: 1. TVM assembly is (after 1-to-1 converting to bytecode) what validators run to determine what contracts do. 2. FunC takes care of stack allocation. 3. Tact takes care of cell contents allocation and abstracts out... too many features to my taste, actually. (reply to 140279)

Adam: And tolk new language (reply to 140292)

Anton: which ones do you miss the most? (reply to 140292)

Anton: (if you skip tensors, tuples, and generics which are coming soon)

Tom: Me personally I would just take tolk instead of tact. Too many sugarcoating with Tact imo

&rey: — From the top of my head: abstracting Strings leads devs to think that there might be such underlying type in the TVM, and then we get questions like "how to load string from slice" when length information is already lost.  — On the other hand, there's no abstraction, no convenient way to express TransferNotification's type correctly, including that one bit indicating if forward payload is inline or in reference. (reply to 140294)

WhyesCode: The problem that the majority are having is that they develop in Ton with an EVM based blockchain mindset. (reply to 140257)

sax: Good evening, can you help me? The problem with buying tokens  I wrote the code (pytonlib)  And what's the problem  This code           cell = Cell()         cell.bits.write_uint(0xaf750d34, 32) cell.bits.write_uint(randint(0, 2**64), 64)         cell.bits.write_coins(1000)         cell.bits.write_uint(0, 1)            cell.bits.write_uint(0, 1)  ((6bf5bf94854a5267276489316479efa142d2d67c69bb107284e45482df9eecf8 transaction hash))  It works, but the purchased tokens do not come to me as a result, as I understood, I did not specify the address where to return the purchased tokens  But the question is how to specify?  I can't find it anywhere.

Adam: buying tokens from where? (reply to 140310)

Adam: this op code is for blum buys ? or what plateform

sax: I send transaction to smart contract of Jetton wallet  On screenshot A - me, B - Jetton Wallet (reply to 140311)

sax: And I want this

sax: op code of standard bcl_jetton_minter.fc (reply to 140312)

Adam: var buyer_address = sender_address;          ;; Throw if trading is disabled         throw_if(err::trading_disabled, ctx_trading_enabled == 0);          ;; Throw if not enough TONs         throw_if(err::no_funds_for_gas, msg_value < gas::buy_op_cost);          ;; Deduct gas fee         msg_value -= gas::buy_op_cost;          var min_receive_amount = in_msg_body~load_coins();         var referral = in_msg_body~load_maybe_ref();          ;; Change buyer if its specified         if (~ slice_empty?(in_msg_body)) {             buyer_address = in_msg_body~load_msg_addr();         }

Adam: normally you dont need to precise

Adam: you just precise if you want to send to someone else other than you

Adam: can you send me the tx you did (reply to 140310)

sax: 6bf5bf94854a5267276489316479efa142d2d67c69bb107284e45482df9eecf8  And my reference   c693884f4694037db890df473930befa13de586410782a47d01554b282bf550e   (I'm afraid to send links😅) (reply to 140321)

Adam: noramlly you received (reply to 140322)

Adam: here is your jetton wallet EQCeMAlGpzJKDB_5DsiVdmOHbmEYHRtNkwCw-M2UQ8NNogGQ

Sane: Всем привет, возможно не туда пишу но я бы хотел сделать страничку для донатов  Я хочу чтобы там выходил такой выбор как на картинке Но я не хочу чтобы пользователь подключал свой кошелек  А чтобы вышло меню и он выбрал приложение через что он хочет сделать донат  Такое можно реализовать?

Georg Leon: It is possible, if you need to do this, write (reply to 140325)

Sane: Well i need to do this but i don't have money to pay someone for it  So if you could possibly send some docs about this I would really appreciate this (reply to 140329)

sax: Thank you!  But why I don't see it in tonscan / tonviewer? (reply to 140326)

Adam: Donation for what exactly (reply to 140331)

Adam: because the jetton wallet it's not detected correctly (reply to 140333)

Sane: I make some random stuff time by time and some people appreciate my work and want to donate (reply to 140334)

Green: think your jetton wallet deployed wrongly (reply to 140322)

sax: Why ?😅 (reply to 140337)

Adam: your jetton wallet has no owner (reply to 140338)

Green: because jetton wallet has owner, your wallet address or even zero address ok, but your jetton wallet shows nothing.

Green: maybe you don't set any parameter when send transaction, it's normal ^^

Adam: It's about how your message configured (reply to 140310)

Adam:   if (op == op::buy) {         int init_msg_value = msg_value;          ;; By default sender is the buyer         var buyer_address = sender_address;          ;; Throw if trading is disabled         throw_if(err::trading_disabled, ctx_trading_enabled == 0);          ;; Throw if not enough TONs         throw_if(err::no_funds_for_gas, msg_value < gas::buy_op_cost);          ;; Deduct gas fee         msg_value -= gas::buy_op_cost;          var min_receive_amount = in_msg_body~load_coins();         var referral = in_msg_body~load_maybe_ref();          ;; Change buyer if its specified         if (~ slice_empty?(in_msg_body)) {             buyer_address = in_msg_body~load_msg_addr();         }

Adam: here how the contract handles buy this part can detect a slice and make the address empty (reply to 140344)

Adam: ?? (reply to 140347)

Majid: The platform support usdt but the ton is now in binance cold exchange. I need validator (reply to 140349)

sax: Oh, I understand my problem But How to do this ?          cell = Cell()         cell.bits.write_uint(0xaf750d34, 32)           cell.bits.write_uint(randint(0, 2**64), 64)           cell.bits.write_coins(1000)           cell.bits.write_uint(1, 1)           cell.bits.write_address(Address("UQDITL8dBNu3qfYmo0LecA_9gePwZz7kYYhMETxwEb4BrzVR"))           cell.bits.write_uint(0, 1)  Right ? But it return 9 error TVM (reply to 140345)

Adam: yes add the ref flag too and try (reply to 140351)

Adam: this (reply to 140310)

sax: Sorry, I didn't understand (reply to 140352)

Adam: try with this (reply to 140353)

sax: cell = Cell()         cell.bits.write_uint(0xaf750d34, 32)          cell.bits.write_uint(randint(0, 2**64), 64)         cell.bits.write_coins(1000)         cell.bits.write_uint(0, 1)           cell.bits.write_address(Address("UQDITL8dBNu3qfYmo0LecA_9gePwZz7kYYhMETxwEb4BrzVR"))         cell.bits.write_uint(0, 1)  This returned error 717 a17bf29e134b0613b1965655f8f0613ef49ff6da0e0618098c0dcf741fe2fe6f (transaction) (reply to 140355)

Adam: Remove the last one

sax: 717 error too... (reply to 140358)

Adam: const err::too_few_coins_to_buy = 717;

Adam: that's what error 717 is

Heydar: I cant understand what exactly these tags : { msg_import_ext, msg_import_deferred_fin, msg_import_deferred_tr, msg_import_ihr, msg_import_imm, msg_import_fin, msg_import_tr, msg_discard_fin, msg_discard_tr }    I want to learn more about out messages

Heydar: totally not good docs about these values! (reply to 140368)

— 2025-02-04 —

&rey: Transactions are irreversible. (reply to 140350)

Julius: Hello, when I send an internal message to a contract using "tx, block, err := w.SendWaitTransaction(ctx, &wallet.Message{...}", there is some way to read the response message? I can see in the tonscan that my contract sent OUT a message response using send_raw_message, but looking at the tx.IO.In.Msg object, I didn' find the same hex OP from the response in tonscan, I'm missing something or tonutils-go don't have the payload of this message?

Darlo: Hi, when trying to deploy a contract, how can you solve the invalid address type error ?

Darlo: @jdotty3 is already in my DM posing as some customer support, saying I asked something personal, asking which wallet I use. He's blocked. If you want to reply me, kindly respond to me here. Thanks.

WhyesCode: To read the response message, use SendRawMessage, then retrieve it with GetMessage. This way, you'll get the payload you're looking for. (reply to 140378)

Maddy: Hey, How to make sure that the txn I send using  sendFile method gets confirmed so that I don't double spend in case I get error in between ?  await client.sendFile(signedTransaction);

oracle: Is it normal that the rpc.mountd process opens and listens to a large number of tcp and udp ports when the node is running?

Green: Hi guys, with tonkeeper, jetton mint is working well, but when doing on mini app, telegram wallet, sometimes it says failed emulation, How can I handle it?

&rey: The transaction will not be accepted more than once because wallet contract will require next sequential number. (reply to 140391)

Anurag: is there any provider on TON who can give us the API for fetching the token price and other details specifically present on TON chain

Daivd: Hello, Telegram mini app has to connect with TON?

Daivd: If use another network(ex: sol, evm), the mini app will be blocked?

Daivd: ???

Евгений: my guess: there should be a way for server to send a transaction on behalf of users. server will pay for gas, but then transaction will send back 100% of that gas from user's wallet or something like that. and these transactions could be batched.  now can you give 'ideal answer' please? (reply to 136682)

Victor: Hey guys! @TONX Lab just dropped a deep dive into TON Multisig smart contracts—covering its architecture, deployment steps, key features, and dev considerations.  👉 https://medium.com/tonx-lab/how-multisig-works-on-ton-a-technical-breakdown-of-multisig-v2-smart-contracts-8cac6477ee9b  If you're building on TON, this might be super useful. Enjoy!

&rey: Yes. Topic seems more appropriate for @devs. (reply to 140410)

Daivd: thanks (reply to 140415)

Minimal ☄️: Highload wallets are not mentioned in this, do they go under 'Order contracts'? (reply to 140414)

B: How could mev bot sell honeypot? txid f148fae23a419d4cd1f88f7206647bddf2e9f6c7b57c9ef7d7668d05cec97de8

Minimal ☄️: Is it possible to deploy Highload wallet on mainnet without deployer wallet? I see in Python's SDK that it can be done, while in JS it seems that developer wallet is needed?  Can I create a highload wallet, send TON to it and deploy it by itself?

Morpheus || $SHIVA: I'm a developer on ton and my team is having an issue regarding a jetton, just this week we noticed that the value of the jetton has been reseted to 0 which is abnormal

Morpheus || $SHIVA: there wasn't a massive dump or something terrible that happened that could have led to it

Morpheus || $SHIVA: it was showing the value on dexscreener and dedust, but wallet started showing 0 and also tonviewer isn't showing any value

Morpheus || $SHIVA: please how do I go about it

Morpheus || $SHIVA: The game server has a jetton master contract with a mint function that requires its signature, when a user achieves a victory, the server generates a signed message (victory proof) containing the user's address, amount to mint, and a unique nonce. The user collects several such signed proofs then sends a transaction to the jetton master contract, including all the signed proofs, the contract verifies each signature, checks the nonce hasn't been used, and mints the jettons to the user's wallet. The user pays the gas for this transaction, which covers all the mints at once. (reply to 136682)

&rey: It is a good but not ideal solution, yes. Note that signature-checking opcodes are subsidized only the first few times during single transaction, then they become quite expensive. (reply to 140447)

Maddy: I'm checking if the seq no. is increased or not. But that doesn't determine if the txn was successful or not (reply to 140404)

&rey: That doesn't seem to work well; server might record 1 indivisible point N times, taking all those fees for N transaction chains from user's wallet; it is not clear how to add user's authentication too. (reply to 140413)

Morpheus || $SHIVA: I just thought of something for a reduced gas check, the server can aggregate victories into a Merkle tree and computes the root, server sends a transaction to the contract, signing and committing this Merkle root, but it's done per batch not per player (reply to 140448)

&rey: Well, to ideal solution?  Jetton wallets that are also [unidirectional non-closeable] payment channels from server.

Morpheus || $SHIVA: the transaction would require a signature check, when players want to claim their victories they submit a Merkle proof showing their victory is part of the committed root (reply to 140451)

Morpheus || $SHIVA: 🤔 (reply to 140452)

&rey: Thus, server stores TOTAL amount of jettons issued to each user, and signs a new total after each victory. User may choose any of those signed messages and submit to their jetton wallet. (reply to 140452)

&rey: Jetton wallet stores two values: current balance and how much has been <taken> already. Subtract the second from the user's message, and you'll get how much jettons were won in a subsegment of games the user chose to submit.  Check server's signature, increase balance, and that's about all.

Morpheus || $SHIVA: new_balance = current_balance + victory_amount    seqno += 1    message = pack(new_balance) + pack(seqno)    signature = ed25519_sign(message, server_private_key) (reply to 140457)

Morpheus || $SHIVA: from my calculations;  Total cost: ~0.0111 ton (vs 0.06 ton in Merkle approach)  that's good 👍👍

&rey: Btw you've forgotten to sign which user receives those jettons. (Also, the code looks suspiciously unlike TON.) (reply to 140458)

Morpheus || $SHIVA: yeah, just writing a broad overview 😅 (reply to 140460)

&rey: So user may choose to play 300 games, record result of first 60 ones onchain, and that doesn't need any iteration over a long dictionary; just one signature check and some math. (reply to 140457)

Евгений: I misunderstood the task. I initially thought it required the server to distribute the tokens instead of the users. Thanks for revealing ideal answer. (reply to 140450)

sax: Hi, can you tell me what the problem might be?  I am using ton library for Python.  And when I send a transaction it is sent with UQ***BrzVR. And when I output my address it is EQ***Br2iU (wallet.address method)  *I import wallet without any parameters just client.import_wallet(word_list).

&rey: Those addresses are same, just as foundation.ton == UQCD39V... (reply to 140468)

sax: I was thinking the same thing But when I started specifying EQ***BrzVR instead of UQ***Br2iU in the cell transaction, I got an error.  *I used cell.bits.write_address(Address(address)) (reply to 140469)

&rey: You've definitely mixed those suffixes up. (reply to 140471)

sax: Problem in UQ/ EQ ? (reply to 140472)

&rey: You should copy the whole address, there'll no be errors. Last 3 chars are checksum, and it changes if you unset bounceable flag. (reply to 140473)

&rey: Please use appropriate chats like @devs. Here, this is offtopic and will be deleted promptly. (reply to 140477)

Julius: tonutils-go don't have those methods/functions, but for now I'll leave this problem alone and investigate in the future, thanks (reply to 140388)

Daniel: How to register webhook for payment invoice in tonconsole?

&rey: Please try contacting @subden, if the option is not available on dashboard page. (reply to 140483)

Morpheus || $SHIVA: does anyone have an idea of how to reach out to the tonkeeper's team regarding this (reply to 140432)

WhyesCode: When you send a transaction using w.SendWaitTransaction, the response from your contract is in the outbound messages. Instead of checking tx.IO.In.Msg, you should look at tx.IO.Out. That's where you'll find the payload of the response message your contract sent, including the hex OP code you're seeing on Tonscan. (reply to 140482)

Julius: I inspected it with a debugger and did not find, but since I am still learning, I will have to study further, in tonutils-go there is no example of this. What I find weird is that I did a tx.Dump() and the results shows this: Amount 0.03 TON, Created at: 1738703529, Created lt 30999143000002 Bounce: true, Bounced false, IHRDisabled false SrcAddr: EQAbEbNLaJZ0DPJz9oS8U1ekXNTsC0SKX3AETADK8i8t_ITx DstAddr: EQA7FPHqIvObo_gCgBVdHPrtPAQCUCemmmyi26iMl7h3EkgP Payload: 97[11A78FFED51F9114CE2A64108_] tx.IO.In.Msg.DestAddr(): EQAbEbNLaJZ0DPJz9oS8U1ekXNTsC0SKX3AETADK8i8t_ITx tx.IO.In.Msg.SenderAddr(): NONE tx.IO.In.Msg.Payload(): ...  From this I concluded that the response payload should be in tx.IO.In.Msg, because I suppose that DstAddr is mine, because above it is in the SrcAddr (reply to 140493)

Julius: Besides this, I did not find documentation about the cell format returned

Julius: But the hex did not have the op code

Julius: Here is the tonscan of this submit to contract: https://testnet.tonscan.org/tx/581a66a73ea7c3952bcd083c3e43eff10c6b5de6ad0e6a6102cf8b538e428ef9

Julius: The payload of the EXTERNAL_IN of this, is: Payload: 616[C7A2ECDE695F6E2B916960CA73C2EDDDCC2B08262FFAFC096DD3397A0900463CEE4C045C89B70AA4137E7C53B296A43CC0A439C8123EB61197DA58C9DB8C180629A9A31767A2835A0000001E01] -> {   513[22001D8A78F51179CDD1FC01400AAE8E7D769E02012813D34D36516DD4464BDC3B89200E4E1C000000000000000000000000000011A78FFED51F9114CE2A64108_] }  The cell starting with 513 seems to be the sent message, because in the end is the op that I set + query_id

WhyesCode: From your tx.Dump() output, here's what stands out:  - SrcAddr: EQAb... (This is your wallet address) - DstAddr: EQA7... (This is your contract address)  So, the transaction you're inspecting is from your wallet to the contract. The payload you're seeing in tx.IO.In.Msg is the message you sent to the contract, not the response from it. (reply to 140499)

WhyesCode: The response from your contract isn't in tx.IO.In.Msg. Instead, it's part of a separate transaction where the contract sends a message back to your wallet. This means you need to look for incoming transactions to your wallet where the sender is your contract

WhyesCode: Ah, I see what's going on! The cell starting with 513 is indeed your sent message, especially since it ends with the op code and query_id you set. (reply to 140503)

WhyesCode: The numbers like 616 and 513 represent the cell descriptors in the serialized data structure

Julius: They are the number of bits, I figured out

WhyesCode: Good 👍 (reply to 140508)

Julius: The message between the wallet and the contract is something that I have not in mind, I will study further, thanks

Majid: Hello

— 2025-02-05 —

Majid: Can some one enlight me ?

&rey: This is scam and not related to anyone in TON. (reply to 140516)

bt/ss: anyone can get that name (reply to 140521)

&rey: Projects (TON Society, Tonkeeper, and all those) almost never write first, and never ask to transfer any money.  You should DYOR, and in that research remember the guiding rule: whatever [transfer to you] has not happened and is not guaranteed by blockchain, might not happen.

&rey: Names are all talk, actually. Even TON DNS doesn't keep you from impersonation if users don't know the correct domain (like, is tonke****-air****.ton supposed to be legit or scam?) Thus, I repeat once again: what is not guaranteed by blockchain, might as well be false. Or based on a high level of trust. (reply to 140521)

Kareem | Manexus: Hello Guys

Kareem | Manexus: GM

Kareem | Manexus: I have a question, how do we implement EVM smart contracts on top of the TON network ?

Kareem | Manexus: I've heard about TEVM, but I haven't found any clear references. For example, is it possible to implement a TON RPC url in Metamask to deploy an EVM smart contract?

Tim: No, and you can't have EVM in TON (reply to 140532)

Kareem | Manexus: okay thanks for the confirmation, looks like i will change it to a TON smart contract with FunC (reply to 140533)

Daniel: hey guys do you know if we use a library cell instead of regular smart contract if its immutable? e.g. we cant call set_code on it?

WhyesCode: Is that what you need on @devs ? (reply to 140544)

WhyesCode: Okay (reply to 140549)

Green: use tonweb (reply to 140551)

&rey: Like https://github.com/ProgramCrafter/wallet-contract/blob/c4e9271abae8abe554a82e7d34f8c87b073acd8e/test-wallet-inplug-v2.ts#L46 (works in browser too). (reply to 140551)

Евгений: Hi group. I was trying to create transaction with tonConnect lib via UI. Transaction works, however funds are returned back to the sender immediately. What could be the issue here?

Green: ton amount is small so bounced (reply to 140558)

Евгений: What is the lowest limit? I was testing with 1 Ton sending (reply to 140559)

&rey: You used EQ address and sent money to uninit address, probably. Recode it to UQ (addr.toString({bounceable: false})) (reply to 140558)

Lmao: Good afternoon everyone! We are a team of Fantasy Builders looking for programmers for a project - Surfers - a platform where you can play mini games and watch YouTube videos and get points for it, which will be converted into tokens (the project uses YouTube API, i.e. videos are viewed directly in the WebApp itself), it is necessary to refine the frontend and the connection with blockchain (Ton connect, Smart contract for tasks (Make a ton transaction, etc.). etc), make payment for some items in Telegram stars, and implement adsgram between videos (if the user is watching SHORTS). This is a superficial TOR, if you are interested, please write to me in ls, I will send you more detailed TOR, also information about the project and about our team in general.We are now awaiting investment from TON FOUNDATION. Payment will be made in stages, after receiving the investment, we will warn you in advance.  Thank you!

Евгений: Will try, thanks (reply to 140562)

Green: testnet tonviewer explorer is not working...

B: Help pls (reply to 140428)

Aleks: Seems like testnet is down… Txs are not going through for me as well (reply to 140566)

WhyesCode: Not sure that topic relates here. (reply to 140587)

&rey: It actually does, though someone probably needs to disassemble the code which was run. (reply to 140593)

Minimal ☄️: What does it mean when toncenter returns 'Malformed response'?   Trying to deploy highload wallet from active V4 wallet using code from tutorial for wallet deploying, worked on testnet but doesn't work on mainnet

WhyesCode: Often, it's because the mainnet requires a different API endpoint or needs an API key, unlike the testnet. (reply to 140610)

WhyesCode: Testnet and mainnet have different endpoints. On the testnet, you might've used https://testnet.toncenter.com/api/v2/, but for the mainnet, you should switch to https://toncenter.com/api/v2/.

WhyesCode: Check if your code is pointing to the correct mainnet endpoint.

Minimal ☄️: API key is for the mainnet definitely and I am using https://toncenter.com/api/v2/jsonRPC (reply to 140612)

WhyesCode: I sent you a doc, probably it might help solve your issue.

Minimal ☄️: We haven't fixed the issue, please if anyone knows how to help, I would be really grateful :)  For the context,  V4 wallet is active, Highload is nonexistent (only mnemonics is generated)  The main issue seems with the TonClient.getContractState nethod, as I have tried to use it to test if deployer address is deployed and it returns the same error

&rey: They say downgrading @ton/ton should help. (reply to 140623)

Minimal ☄️: Well f, you have just solved my issue (reply to 140626)

Minimal ☄️: can you tell me where did you find that information?

Minimal ☄️: Thank you so f much!

&rey: It has been somewhere above yesterday (or in Russian chat perhaps). (reply to 140628)

Minimal ☄️: Probably in Russian, there is no words about it here, Thanks again! :) (reply to 140631)

Minimal ☄️: Hey Grandpa, thanks, but rey has fixed the issue (reply to 140635)

Minimal ☄️: I'll delete the extra messages so nobody gets confused

Omar Hariri: Hello,I completed TON & Telegram Blockchain Сourse When can I get the sbt please?

𝓢𝓽𝓮𝓵𝓵𝓪: const TonWeb = require('tonweb'); const tonweb = new TonWeb();  const privateKey = TonWeb.utils.base64ToBytes('YOUR_PRIVATE_KEY_BASE64');  const keyPair = TonWeb.utils.keyPairFromSecretKey(privateKey); const wallet = new WalletClass(tonweb.provider, {   publicKey: keyPair.publicKey, });   const walletAddress = await wallet.getAddress();  const toAddress = 'EQ...';  const amount = TonWeb.utils.toNano('1');   const seqno = await wallet.methods.seqno().call();  await wallet.methods.transfer({   secretKey: keyPair.secretKey,   toAddress: toAddress,   amount: amount,   seqno: seqno,   payload: null,    sendMode: 3, }).send(); Hello, experts. please help me with this code. 1. how to test this in TON test net. 2. how to add test net to wallet. 3. how to get PIVATEKEY_BASE64 in this code.

Adam: 1. In provider use testnet.tocenter provider (reply to 140651)

Adam: For base 64 keypair.secretkey is a buffer just turn it to base64 (reply to 140651)

Adam: const TonWeb = require('tonweb'); const tonMnemonic = require("tonweb-mnemonic") const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC')); //testnet const mnemonic = [] //list of 24 word const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic); const wallet = new WalletClass(tonweb.provider, {   publicKey: keyPair.publicKey, });   const walletAddress = await wallet.getAddress();  const toAddress = 'EQ...';  const amount = TonWeb.utils.toNano('1');   const seqno = await wallet.methods.seqno().call();  await wallet.methods.transfer({   secretKey: keyPair.secretKey,   toAddress: toAddress,   amount: amount,   seqno: seqno,   payload: null,    sendMode: 3, }).send(); (reply to 140651)

Adam: what this do?? (reply to 140659)

Combot: Total messages:140664

Eran: Hi all, has anyone else experienced issues where locally computed message hashes don't match the ones on the chain?

Eran: Literally hashing a message from the chain results in something different

Adam: show me the result tx

Eran: as hex?

Adam: yeah

Eran: here is the base 64 encoding: te6ccgEBBQEAugABRYgBsArgxUCwyPPtuMfjzWycTbtoMw6rztF7i7REmAFT/fwMAQGhc2lnbn///xFno2KTAAAABZtvHUqo8Oe0+JUlss6fCNowM+pZb2f1B8lTe8H42/jOzcRxKQ0iktB4gCRWSkXJzuls2ymPz6SG/

Eran: e6ccgEBBQEAugABRYgBsArgxUCwyPPtuMfjzWycTbtoMw6rztF7i7REmAFT/fwMAQGhc2lnbn///xFno2KTAAAABZtvHUqo8Oe0+JUlss6fCNowM+pZb2f1B8lTe8H42/jOzcRxKQ0iktB4gCRWSkXJzuls2ymPz6SG/yiznUmcScEgAgIKDsPIbQMDBAAAAGZiAD98IEWiCoZGgohD+j3II9lfPEELQbv5US+xe/7hDDspGAw1AAAAAAAAAAAAAAAAAAA=

Adam: check with the same body and value you created a similar message  but that wont result in the same exact message

Eran: here is the hex: b5ee9c720101050100ba0001458801b00ae0c540b0c8f3edb8c7e3cd6c9c4dbb68330eabced17b8bb444980153fdfc0c0101a17369676e7fffff1167a36293000000059b6f1d4aa8f0e7b4f89525b2ce9f08da3033ea596f67f507c9537bc1f8dbf8cecdc471290d2292d0788024564a45c9cee96cdb298fcfa486ff28b39d499c49c12002020a0ec3c86d0303040000006662003f7c2045a20a8646828843fa3dc823d95f3c410b41bbf9512fb17bfee10c3b29180c350000000000000000000000000000

Adam: yoy used the same body and account id to creat an external message

Adam: but that wont result at the same message

Adam: bcasue account state change

Adam: even with same body you wont get same message

Eran: So you're saying that the message hash is not computable locally?

Eran: I computed the same hash as I do now when I broadcasted the transaction, hours ago

Adam: it is but two message dont have the same hash even if they have same body

Eran: But all the other pamarmeters are identical

Adam: but the acount state on chain changed

Adam: and why the message is an internal message

Adam: and you computing an external one?

Eran: I am broadcasting a message and I'd like to track it, to do so I compute the message hash in memory and poll the chain to find it

Eran: Isn't the first in message of a transaction actually an ext message?

&rey: *of transaction tree, you meant to say. (reply to 140693)

Eran: yes

Eran: Is it possible that there has been a hard fork in the chain? This never happened until yesterday

&rey: No, you can check that in network config (https://ton.org/global.config.json) (reply to 140696)

Eran: Have there been other such cases in the past?

&rey: The more prosaic explanation is that you might've forgotten StateInit.

Eran: No, there is no state init, I validate it

Eran: here is the code btw if you want to run it on your own:  func Test_FailingTx(t *testing.T) {     tonKeeprClient, err := tap.New()    require.NoError(t, err)     failingTx := "7cd5ce546570218f31e0ea233a245cdd693fdf38bdbdbb620a8284eefe427891"     tx, err := tonKeeprClient.GetBlockchainTransactionByMessageHash(        context.Background(),         tap.GetBlockchainTransactionByMessageHashParams{             MsgID: failingTx,        },     )    require.NoError(t, err)      inMsg := tx.InMsg    fmt.Println(inMsg)     msgBody := inMsg.Value.RawBody     hash := inMsg.Value.Hash     fmt.Printf("real hash %s\n", hash)     bodyBocs, err := boc.DeserializeBocHex(msgBody.Value)     require.NoError(t, err)    require.Len(t, bodyBocs, 1)     accountID := ton.MustParseAccountID(tx.GetAccount().Address)     require.NoError(t, err)     require.False(t, inMsg.Value.Init.IsSet())     extMsg, err := ton.CreateExternalMessage(        accountID,         bodyBocs[0],        nil,         tlb.VarUInteger16FromInt64(inMsg.Value.ImportFee),    )     require.NoError(t, err)     extMsgCell := boc.NewCell()     err = tlb.Marshal(extMsgCell, extMsg)    require.NoError(t, err)     computedHash, err := extMsgCell.HashString()     require.NoError(t, err)     res, err := extMsgCell.ToBocString()    require.NoError(t, err)     fmt.Printf("res: %s\n", res)     require.NoError(t, err)     fmt.Printf("computed hash %s\n", computedHash)    require.Equal(t, hash, computedHash) }

&rey: IIRC hash is (and always was) calculated with import fee set to zero? (reply to 140701)

Eran: Yes

Anurag: is there any API in the TON which can give me the address on writing the token name ???

&rey: Name (ticker) is not unique for jettons, master address is. (reply to 140709)

WhyesCode: Why is my message deleted?

&rey: For one, there are no "Ton APIs itself", are there?.. (reply to 140718)

WhyesCode: So TON doesn't have an API? Is that what you say (reply to 140720)

&rey: A good idea, which is unlikely to yield scam jettons, is to use https://github.com/tonkeeper/ton-assets. (reply to 140709)

Adam: How you intending to deal with scams ? (reply to 140709)

jennifer [afk]: maybe using search of tonviewer  https://tonapi.io/v2/accounts/search?name=major  it gives u the addresses and u sort them by whitelist to get the one u need (reply to 140709)

Ghosthawk: use fragment website always not 3rd party (reply to 140740)

— 2025-02-06 —

High/or: Hello, is it possible that the manifest for TONconnect is host on a .ton site?

Adam: that's sad (reply to 140740)

Adam: Idk you should try It's not hard to setup (reply to 140744)

Adam: I don't think it's possible since ton dns doesnt follow traditional https

sh: Can provide a way to filter only TON deposit and withdrawal transactions in the Transaction List API of TON Center? For example, transactions that change the balance.  https://toncenter.com/api/v3/transactions?account=address..

Adam:  "account_state_before": {         "hash": "3xFTI7SDIPN4QZtl/rEz4biCtQrxfvMuPfyiEBomInU=",         "balance": "48901643774",         "account_status": "active",         "frozen_hash": null,         "data_hash": "EjAaoRT3CUNxeZVPjEW9EfHV4EH7capEn3bUmKZ+LMA=",         "code_hash": "hNr6RJ+Ypph3ibojI1gHK8D3bcRSQAKl0JGLmnXS1Zk="       },       "account_state_after": {         "hash": "UVNUFNzpzXftmUlgLNy8sUTrlYu6f0bEmTSvFLCx/eE=",         "balance": "0",         "account_status": "active",         "frozen_hash": null,         "data_hash": "cyCxsCqgBwB9orSlDHQBsnXNll8HWFqeTd7Tbd8H7mU=",         "code_hash": "hNr6RJ+Ypph3ibojI1gHK8D3bcRSQAKl0JGLmnXS1Zk="       }

Adam: check acount state before and acount state after

Adam: this tx for exemple changed balance

Adam: and of there is any out message track it to to get the full tx tree

ZombHunt: Hi guys, does anyone know that what should I do if I want to get recommended on the Telegram App Center? And in which way can I get in touch with the official staff of the App Center?

albert: Hello, is there a video on YouTube about creating smart contracts?

Adam: yes in tact there is few (reply to 140761)

albert: Send me link (reply to 140762)

sh: Thank you for your response I have confirmed that sending USDT generates two transactions. The first transaction is a Jetton transfer, and the second transaction appears to be the refund of the remaining network fee after the Jetton transfer. In this case, if we subtract the before balance of the first transaction from the after balance of the second transaction, does that give the actual network fee used? (reply to 140754)

Anurag: But if user is querying the name then how will I be able to input master address, another thing is that it is true that I need to fetch only the coin inside ton blockchain (reply to 140717)

Adam: To track this USDT check for the body it will have jetton transfee op code from that you can verify how much usdt was sent (reply to 140769)

sh: I'll check that part as well.  What I also want to know is the network fee used for the USDT transfer, including any refunds. Since the TX records are different from Ethereum, it's quite difficult to analyze.... (reply to 140771)

Nxrix: is there an api allowing me to simply get nfts of a user with filters applied

Adam: And refund are issued by the jetton walllet that recived usdt last tx in the tree

sh: thx reponse get started with development. (reply to 140776)

&rey: Well it's best to delete&report those chats. Now, that's offtopic. (reply to 140786)

Nxrix: what is the crc16 in end of address used to

&rey: So that you can't accidentally enter 8 instead of B and transfer money to inaccessible place. (reply to 140788)

Nxrix: so I must use it to verify the real hex address? (reply to 140789)

&rey: Hex address doesn't have any checksum in place so nothing to verify, unfortunately m (reply to 140790)

Tom: Hey guys, seem like the latest update of @ton/core breaks with a lot of rpcs (including orb network and dedust rpc).  https://github.com/ton-org/ton/commit/d9ccfa02153f5b2ff344c1621d3c451c6cddb5d9#diff-918891c722aef246646b4a93edae6a3204e5ad53a8fa72fb05e066cbe3e1b420R27-R31

Tom: They introduced extra_currencies but the RPCs are not yet deployed. Anyone facing the same problems and is there any workaround?

Tom: This is a breaking change and it seems like TON foundation was kinda rushing to push.

&rey: Downgrade the lib. (and I've been wondering why they haven't yanked the release... now I see) (reply to 140793)

Tom: Yeah. I will pin the version for now. A lot of applications are breaking because of this last week change 😭

Tom: Pinning at 15.1.0 hopefully helps. https://github.com/ton-org/ton/tree/v15.1.0

Nxrix: like this? (reply to 140789)

Tom: Well, it's part of our end, our pnpm-lock.yaml is ignored by cloudflare pages  because of stupid deploy env 😭 (reply to 140796)

abdallah: one is offering me to buy my username but i feel iam about to get scammed (reply to 140801)

WhyesCode: Use your block button 😔 (reply to 140802)

Nxrix: is there an api for accessing dns names address or other info?

TON Bounty Bridge: ​ANIS  Created by Sinariaz1

Howard: What is the "Continuation" in TVM? (reply to 136961)

Adam: The data is a cell doesnt know variable maybe how tact view is confusing but the number of variable doesnt matter at all (reply to 136960)

&rey: Function, with args possibly set. (reply to 140819)

Adam: For you said the contract have 3 args but sometimes can have 4 you just need to make load data and save data in some sort that when they load your first three variables check if the rest of the slice is empty of not they save the 4 variable or load 4 variable

Adam: For the save data you just define a structure that is adabtable to any number of variables

Nxrix: does anyone remember tonapi rest api used to parse address into other formats?

Minimal ☄️: Guys,  I have an issue with the @wallet bot when signing transaction from TMA (iOS and sometimes PC)  When paying with TON space wallet, it quits my TMA and I am unable to know if the user has declined the transaction or accepted (but it's also bad UX since it has to open the TMA again), is there a way not to turn off the TMA when redirecting to the @wallet tx signing?  On android it works well (but leaves the app minimized after closing the wallet bot).  I am using tonConnect SDK, and I have set twaReturnUrl to my bot's link

Adam: Try using tonconnect ui sdk (reply to 140828)

Minimal ☄️: I meant on UI when I said SDK (reply to 140829)

&rey: iOS made this unavailable. Recommend users to move to PC. (reply to 140828)

Minimal ☄️: Just to confirm, iOS users will always after confirming/declining the transaction have the closed TMA that sent them to the wallet?  No matter the return strategy or the twaReturnUrl? (reply to 140832)

Minimal ☄️: And how can I make it to always be UP on PC, and to maximize after the wallet is done on the Android? (reply to 140832)

Bluepot: Hello everyone. Sorry for the interruption. I wanna mint token that will 1% burn when send token. but I dont know as well about this. could you please give me example. I am using FunC for development smart contract. Thank you. please help me.

Tom: Why would you want to use api for that kind of tasks? (reply to 140827)

Nxrix: I'm not going to actually use it I was just testing my code with it anyways I found it it was toncenter detect api (reply to 140841)

Bluepot: Thank you for your reply. but could you give me more details. especially project url or github url?

Bluepot: Actually it is problem. I already make a minter contract. (reply to 140844)

Nxrix: testnet?0x91:(bounceable?0x11:0x51) what was the other flag for testnet?

Олег: Hey everyone, can someone tell me the alternative to events in EVM? I need to check if a transaction was successful and if tokens were transferred to the user.

TON Bounty Bridge: ​Pastor  🏷 Developer Tool  Summary:Referral  Created by PastorNapas1991

EvZ I DONT DM FIRST: anyone else getting this rate limit error ?

EvZ I DONT DM FIRST: ah well I cant post the link hang on

Nxrix: Am I allowed to send my github repo here?

&rey: Generally, this is chat to help with development of one's project, not with its promotion) (reply to 140869)

Jomari: NjMgOS41aDIuNzgzem0tMS4wODQgMS40MjdxLjY2IDAgMS4wNTcuMzg4LjQwNy4zODkuNDA3Ljk5NCAwIC41OTYtLjQwNy45ODQtLjM5Ny4zOS0xLjA1Ny4zODktLjY1IDAtMS4wNTYtLjM4OS0uMzk4LS4zODktLjM5OC0uOTg0IDAtLjU5Ny4zOTgtLjk4NS40MDYtLjM5NyAxLjA1Ni0uMzk3Ii8+PC9zdmc+);background-repeat:no-repeat;background-size:contain;padding-left:34px}@media (prefers-color-scheme:dark){body{background-color:#222;color:#d9d9d9}}</style><meta http-equiv=\"refresh\" content=\"390\"></head><body class=\"no-js\"><div class=\"main-wrapper\" role=\"main\"><div class=\"main-content\"><noscript><div class=\"h2\"><span id=\"challenge-error-text\">Enable JavaScript and cookies to continue</span></div></noscript></div></div><script>(function(){window._cf_chl_opt={cvId: '3',cZone: \"banana.carv.io\",cType: 'managed',cRay: '90ddf53cad0d5276',cH: 'jZTbZ4HGMPgqgo2vqSeoXyZcTeIeX.ryN0WUpy4tzOA-1738874454-1.2.1.1-el7QIfWkTSLd3rGIBv8x53lOB2AL0B2jPtVzoBi_o07je3c9SOzho0aQ6qdlbgE5',cUPMDTk: \"\\/tonconnect-manifest.json?_t=1738874441269&cf_chl_tk=QsLZQYW_MCsTmruC8RI_mcECB9rPhpiatS6efX6I4OU-1738874454-1.0.1.1-HVWwzCSiOLey9I1q4plplCFeJGGLMTOjyl5J9C8kSOI\",cFPWv: 'g',cITimeS: '1738874454',cTTimeMs: '1000',cMTimeMs: '390000',cTplC: 0,cTplV: 5,cTplB: 'cf',cK: \"\",fa: \"\\/tonconnect-manifest.json?_t=1738874441269&cf_chl_f_tk=QsLZQYW_MCsTmruC8RI_mcECB9rPhpiatS6efX6I4OU-1738874454-1.0.1.1-HVWwzCSiOLey9I1q4plplCFeJGGLMTOjyl5J9C8kSOI\",md: \"J0TPSKd7yc7O4QPVCobd2R4bAqePG2TFbi9ELrCuw7Y-1738874454-1.2.1.1-4F5G8ulTN8I5cX.qB2piZrHmbGekkHXAqg6FE66x_33j9Iw6GzvPKYvYrpSx5x82GCuXzZ_9GSaU9Esh5p5fM5tgqKKsspjJb53CxVJ1aycvw0RC5tH8EDL50M2RNa8.CxJFDIC8B9VlVBAc5emXV8DtADc5OmAtrG0TWz9Cjwj96.poUPzGyM5HlwlvmpR.6r8FAHZnNWdUaJMTSqNpxwYf3PyiGSiLCOFewqIb8LM9ow9ahe1TZUn2Brgnet426YRjMnqOEZFkzLX._8e012fbznt4wR4btuJAiH5y2x1ONmYjIAv.Vt2V64O8Kb_81CKXWN8hUYvZu92qkbtkiP1XVJfpBATEY9heIuWnFt31vnmUNJynzttA0tts4w51P7DeyNcZeaZol4QBxL3UHAhNHYGZD64GCkd3Ao5RAvKJdadc1qfsFMxlLs78YiO_L0t0_lZ9QEKu.RVzQx37g0fHxHKmErSZg5sZtMAJ4XbJJz61l8_ldjWJVaaLPPhbHYLzGbvKyKMUCiGkc.DhLyv7MMymYKG.AZqIXKYz1LfOXS0XKQdA.McmbysSEL6qnMBR0JyuEVChGJ46yTNlRbU6Fmf9ytqc.XVGppumBIOasPz3RSv7p_J9oSrlbc5XxTrLA6COHyXWHUPXHFquOyzQMSq7x8RD6csUysKneczdk0RQ3mpR1eGbFvVbtoC7Pv5CoW.6.3MZvHdrcIYCLLpYj.2Svn02eSEC.YcWl0zgnM.Dwg0owjYDKgUh_UN9i_XJPAzO9qZ6Uy7rUsi.vExM_dcWnY.KCfU8s5bvb98mnEDfkd0oxzSHpPOCd21fcMCDGqH.bXbTrXwArf4zLBgfSOTPbuPPxrx6ZvaivcLxPZECHsMQcA3jJCTbInStrlSP7v1Go1B2h6209r_0ux7fNu3LtRhKz8bIccOUS8ewcXfmhu7uT5Bra8jIonnXXjUaeYhkqkhMa9_oDK1JGUB.G.vQuixxGIDDmtx_Yw9jwGvXsUEyb8.svkk7eCcmHV4t5VMpL2pvBeDgkbt6cgYA1JpD2KLsgsQHWIEOZxrTLUOVMG2kwTUIyOzvlFWxWS7m3rI1t9JtwgC9PeAqaEqMp_U9q6acBv98pE_ccl4R26cVj326lRtQGHT3.WY6TIJL9pnxc0AMXloQVPUzQUyc_X94qDBV9JfGdkQKCPfMUfr6u7gnOWtrcPmyNmGpDhgqt6wKUFRd0ts3jxsBTa8n7VqC2b45m1z9bhql58gIkyfo6VlY8zwLGyuz4toHBzPi3TSNuJ5.wu6v66KLsUVPLkufyQIcJNMay5rc3KPdfZasSLhJSjSW5GOUI7NAY.HI5mYULykG842qA9zjtWbJ1bs4MjcxYQw597m5haljnQRrXGoIHsmCNLNTlxJXl4u.wRevyHKOgKj4o_Ug2in6Q_p2.8yp7JJKK6UksNmIc_2KMN6n8tombuopoIVqL6.Nd7W.NVTm8MKCzmM37kpfQUNywGLD64jEvU63F2tV_oFwicXv2.28AeWP3hco3CsOdSkbRiCQ1kIlrBkp4SApnWut7PGdvnWRisZVAAniWSuRTyDul6xsycvYtdCvMGTHt5JtyYvxAoVOCcvD0Re3XuzYPh3PCyjaT0Hd477S15Q3c2bi35hLFQkLf9bMbOtNCyIgQhQBk5AUd56gf4Zd7VjtEs4qCtXyv3PHAdeNZHaiVqx37evGW0a2adnnJH3h_Q9026t887Hm82Gs1Xnt4TfqVycbU_pSYRREuyGUL1Ysgo5t9DNj7xB_V41x2bjQXDzteXIEDTUl1uEUA.Fn3zQwzny.uAVXAE082X2f9JJLFJ2xGQ6kNPSJksiyoCOomxyYEf_Sh5F.TMalplu1vvBOAwEYb7WlabsPjZwzpdFBnX_yQ.LmwFILxpEmICIf8ViPciDsrASomqN9ktOWRQMQIuuQn6JPX3maN2NyuJ4cjmuqxHgjjmIQAz3n.HnWQZhiXA_NBB5Z0YhS1Ujbc1RjzFZp7nC9_e4oFq.VcjRYE7oOow3YJqkcPFdNxECrCtGPwfX.km0rQLbXa39NHdalTGWFSiytPKqG6SecBGHMU2rKrFc9QH4Cxr2fC9at0Cid43tIcw4zkx6qWfXSPqyW6I6OgeTm05gqP8njAa8hQ4wEdzn5yvkEY7T6v_TBH3IUFB3EB1Ygh44dFozY_jEFpP3p0kw5IWWDQGZvF6HvsSGj8yDnIAJF8f6zyqv_beHkht.NlXtKiFK7qScGLfx.IGX7N2PkTXdp_0p8.vf5vR0KQljtFBKQIn_GeWDQK90cj5Oy62QuYAuNaWnl.ts.oUMWFn3.As3SP8xHjGFM6q_Ixyox8ifzrs2Cm8n7zLa7jgrSqAfJ08R4_dJAkkhwhLmzpCLTynnNudWkDJdfGYBjtK8yy6OqpDEZEMiFEY1heDhoCMZN8hi9rOElMkt58cZ3sNyfH_YcXOd4OCZDpGMPj1tgVhoRUVciud_ibJY.qRnpBlh.uGwQDTszchK92cMbVBscjf6o6LToATMAXelZS9Z3aAp2Rmre3.BNgAYafLaTRESbFOgje3C6dWrdNSoI9.ZyYt2f.GSYA3shb4o7R8wRtOGsTykI3UM5wUcNrjkoUmyLwO5z

— 2025-02-07 —

Combot: Combot has warned Adam Ton (2/3) Reason: Word **** is not allowed

Adam: Hi , if anyone needs a smart contract dev on ton you can contact me.

Adam: hahaha used that word again that starts with f (reply to 140886)

albert: Scam (reply to 140887)

Main: hello! I am trying setup a connect to wallet for my mini app but I am getting fail to load manifest. I am running my project on my local computer

Alfons: Are you already try to make manifest.json online? (reply to 140896)

Main: I haven't tried yet. I am working on it right now. thanks! (reply to 140905)

Alfons: Oke, I hope it works perfectly 😊 (reply to 140907)

Adam: ? (reply to 140894)

Ali: const walletAddress = Address.parse(WALLET_ADDRESS)       const transactionCost = toNano("0.02")        const transaction = beginCell()         .storeUint(0, 32)         .storeStringTail(uuid)         .endCell();        await tonConnectUI.sendTransaction({         validUntil: Math.floor(Date.now() / 1000) + 240,         messages: [           {             address: walletAddress.toString(),             amount: transactionCost.toString(),             payload: transaction.toBoc().toString("base64"),           },         ],       })   when i send some transafer TON coins to regular wallet, my ton tokens are returning back. how can i send my TON coins to another wallet with comment?

Adam: Any tx we can check?

Adam: If it’s a bounce send it to none bounceable address

&rey: address: walletAddress.toString({bounceable: false}) (reply to 140924)

Ali: awesome thanks

Ivan: sup guys, someone is using @ton-api/ton-adapter?  having an issue with it when trying call contract method with bigints in params: Not a cell: int  will appreciate if someone have solution for this

WhyesCode: You serialize your BigInt values into Cells before passing them to the contract method? (reply to 140935)

Ivan: with tonclient4 it's not required, and contract wont even accept this value (reply to 140937)

WhyesCode: Maybe a code snippet will help identify the issue, if you can share (reply to 140938)

Ivan: const ta = new TonApiClient()  const pool = ta.open(Pool.createFromAddress(TON_USDT));  const estimatedSwapOut = await pool.getEstimatedSwapOut({   assetIn: Asset.native(),   amountIn: toNano(1), });  Error: Not a cell: int at TupleReader.readCell

WhyesCode: the method getEstimatedSwapOut is expecting a parameter in the form of a Cell, but it's receiving an integer. (reply to 140940)

Sam: Hello guys, I'm developing a mini app and wanted to integrate ton into it  I have successfully managed to add ton connect ui and it's working well  send transaction is also working  After send transaction, a boc is returned, I wanted to know how do I find the txhash from that boc to verify it Like I'm fetching the wallet's latest transactions using api but unable to find which transaction is related to the boc

Adam: You have the external message hash you can look for it in ton blockchain by parsing that account txs (reply to 140948)

Sam: Yeah I made extHash from the boc  Idk how to find the transaction after that (reply to 140956)

Sam: Like with what do I compare the extHash with

&rey: With in_msg of transaction. (reply to 140958)

Minimal ☄️: Guys, do you know some groups where people are exchanging referrals links,  for app promoting purposes?

Sam: Please explain in a little detail, I'm new to this🥹  The in_msg is an object with various params  Also different APIs have different in_msg What specifically do I need to use (reply to 140960)

Adam: You toncenter api to check an account txs

Sam: Ok what to use from in_msg (reply to 140963)

Adam: In_msg.hash

Adam: Compare it with external message each transaction tree in ton start with external message

Adam: Se hash that hash compare it with your hash that you got

Sam: Ok thanks I'll try this and update ❤️👍🏻 (reply to 140968)

&rey: You are not welcome to do unconstructive discussion in this chat. (reply to 140972)

&rey: well the specific details (how this works, what's cost of deobfuscating) would be interesting but I've already banned them... (reply to 140969)

Adam: He was just promoting it hahah not here to discuss about it (reply to 140975)

Adam: Probably works like bridging

Adam: Verify deposit on reception wallet and trigger transfer from the sending wallet

Sam: Can you please confirm that this method is correct for generating extHash   const bocCell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(response.boc));          const extHash = TonWeb.utils.bytesToBase64(await bocCell.hash()); (reply to 140968)

Adam: Here is how to get tx by boc   import {Cell, Address, beginCell, storeMessage, TonClient} from "@ton/ton";  const res = tonConnectUI.send(msg); // exBoc in the result of sending message const exBoc = res.boc; const client = new TonClient({         endpoint: 'https://toncenter.com/api/v2/jsonRPC',         apiKey: 'INSERT YOUR API-KEY', // https://t.me/tonapibot     });  export async function getTxByBOC(exBoc: string): Promise<string> {      const myAddress = Address.parse('INSERT TON WALLET ADDRESS'); // Address to fetch transactions from      return retry(async () => {         const transactions = await client.getTransactions(myAddress, {             limit: 5,         });         for (const tx of transactions) {             const inMsg = tx.inMessage;             if (inMsg?.info.type === 'external-in') {                  const inBOC = inMsg?.body;                 if (typeof inBOC === 'undefined') {                      reject(new Error('Invalid external'));                     continue;                 }                 const extHash = Cell.fromBase64(exBoc).hash().toString('hex')                 const inHash = beginCell().store(storeMessage(inMsg)).endCell().hash().toString('hex')                  console.log(' hash BOC', extHash);                 console.log('inMsg hash', inHash);                 console.log('checking the tx', tx, tx.hash().toString('hex'));                   // Assuming `inBOC.hash()` is synchronous and returns a hash object with a, Address, bmethod                 if (extHash === inHash) {                     console.log('Tx match');                     const txHash = tx.hash().toString('hex');                     console.log(`Transaction Hash: ${txHash}`);                     console.log(`Transaction LT: ${tx.lt}`);                     return (txHash);                 }             }         }         throw new Error('Transaction not found');     }, {retries: 30, delay: 1000}); }   txRes = getTxByBOC(exBOC);  console.log(txRes);

Adam: This uses the hash of txs to get the right transaction

Sam: I saw this but this is not working  I think the api has changed some things 😢

Adam: Throws error?

Sam: Also I can't directly use this as I am making the website using vanilla js I don't have node js

Sam: That's why I was using the TonWeb library

TON Bounty Bridge: ​"Develop a Python Library for Interacting with the TON Blockchain"  🏷 Developer Tool  Summary:The goal of this bounty task is to develop a Python library that simplifies interactions with the TO...  Created by Omar-Hariri

albert: How much does it cost to deploy a contract on the ton network?

&rey: Less than 0.03 TON; it's done with single message containing StateInit. (reply to 140989)

Bluepot: Hello everyone. Sorry for the interruption. I wanna mint token that will 1% burn when send token. but I dont know as well about this. could you please give me example. I am using FunC for development smart contract. Thank you. please help me.

Green: have to change jetton master contract as your logic (reply to 141004)

Bluepot: Thank you for your kind. So I have to change when total supply is reduce when send token. but it has error.   if (op == op::transfer_notification()) {         ;; int jetton_amount = in_msg_body~load_coins();         ;; int burn_amount = muldiv(jetton_amount, 1, 100);         save_data(total_supply - 1, admin_address, content, jetton_wallet_code);         return ();     }

Bluepot: Thank you everyone. But actually when I add send with burn, it has error. And I am using FunC. How can I solve this problem?

&rey: And on that moment you lose. The code you provided did not resemble TEP-74 jettons even remotely. (reply to 141018)

&rey: What error? (reply to 141020)

Bluepot: https://testnet.tonscan.org/tx/2de6dfef3be98d73132fb664b8ce08ff7e27eba8b81db972f93a21a6f99f0bb9

Bluepot: And totalsupply didnt change

Bluepot: I cant change totalsupply.

Sam: I tried running this code in node The hash doesn't match with any transaction (reply to 140980)

Adam: You sure you change it to testnet? (reply to 141026)

Sam: yes I did, without testnet the fetched transactions list is empty

Adam: And with testnet none match the hash?

Adam: The tx is on testnet right?

Sam: no the exthash and inhash are different for all transactions

Sam: yes (reply to 141032)

Adam: So no tx match it? (reply to 141033)

Sam: nope none (reply to 141036)

Adam: Can you send the exthash here if you dont mind

Sam: yeah wait a moment

Sam: this is the boc  te6ccgEBBAEAygABRYgAcdsYUBvwRBZR4cXYaHlLTIUFNNe1tQ+MFo/M9jTrzNYMAQGaOIIe/+m4+ZLgFp63GNvreaPHFAFhqiAvf/8zkIrg/OjKevXNNqelCAFsH6Bpx8fue68qKfa6JRXGxqS9TQgvDSmpoxdnpfurAAAABQMCAWhiABx2xhQG/BEFlHhxdhoeUtMhQU017W1D4wWj8z2NOvM1oF9eEAAAAAAAAAAAAAAAAAABAwA2AAAAAFRPTiBDb25uZWN0IDIgdHV0b3JpYWwh

Adam: Can you hash it

Sam: 86bfcc9b4a3a543a33b7176ca6c5ec0c73e272c512ba8b47bc62ffbaca7c5d08

Sam: I got this from the code you sent

Adam: This one right here

Sam: yes

&rey: Btw this is hex version, not base64. (reply to 141042)

Sam: yeah (reply to 141050)

Adam: yeah he is comparing both hex versiom

Adam: Use toncenter api (reply to 141051)

Sam: yeah I used that only

Adam: this one send as an answer transactions with their hashes too

Adam: (base64) hash

Sam: ok lemme try the v3 version thanks for your help ❤️

Adam: I used it that's how i found your tx

Adam: and use the hash base64 not hex (reply to 141062)

Sam: okie thanks

Adam: this api returns base64

Sam: Oh I got this hash earlier using the tonweb library.....but couldn't find the transaction using the v2 version

Bluepot: @pcrafter please help me. (reply to 141023)

Sam: thank you so so much brooo ❤️

&rey: I'm unable to help with your request. (reply to 141070)

Adam: It worked (reply to 141071)

Sam: Yessss (reply to 141075)

Sam: Just finished it now

Adam: you are welcome

Adam: Hi , if anyone needs a smart contract dev on ton you can contact me.

Adam: what do you mean ? the response? (reply to 141082)

Adam: The user send transaction using tonconnect? (reply to 141085)

Adam: you can verify balance of that wallet (reply to 141089)

Adam: if balance changed then procced

Adam: when user send money

Adam: the start a while loop on that address to verify it's balance when balance change using tonweb they transfer money received to their wallet and confirm payment for user

Adam: store them in database

Adam: and only check them if uk user has paid

Adam: yess

Adam: I dont think there is alternative on ton (reply to 141102)

&rey: Make intermediate address a contract that would automatically forward money to the central wallet. Listen to all transactions on the central one. (reply to 141096)

&rey: Don't know, not relevant.

Adam: Or make it a contract that forward money and notify with data you want but that takes more effort (reply to 141107)

— 2025-02-08 —

Duck: hello, for mini app developer standards, if we want to create transaction features with ton, such as on-chain check-ins or payment mechanisms, should we use ton connect with client-side code, or should we develop the code on the backend?

albert: How can I find the website address of a Telegram webapp?

4Basic: You can search maybe by the domain name that could be link with a wallet (reply to 141131)

Adam: You use tonconnect in the client-side and registring checkins in the backend side (reply to 141130)

Adam: .

Rangogenius: Is there any group that investors and founders can chat and send their freelance needed project?

Joe: I have a question. Suppose I have two Nominator pools running on two different nodes, each corresponding to a different Validator. Now, I want to merge the two pools into one node by transferring the second pool from the second node to the first node. Will this work properly?  Or is there a recommended migration method? Thanks!

Leo: Hey guys I'm trying to get the token (jetton) work with my telegram app, Right now the ton coin works perfectly, you can deposit and withdraw .  But when I'm doing the same just with my jetton token, the app failed to make the transaction  Is there any working examples for sending transaction but with jetton ❓

Leo: Im trying with this

WhyesCode: I can help you. (reply to 141196)

Adam: You want to send tokens using ton connect right? (reply to 141196)

Adam: Send tokens is different than sending ton with tonconnect

Leo: Yeah (reply to 141200)

Adam: Sure give me a second ill write

Adam: mport { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'; import { Address, TonClient, TupleBuilder, beginCell, toNano } from '@ton/ton'; import { getHttpEndpoint } from '@orbs-network/ton-access'; const recipient_address = Address.parse("EQCKWxpBi2Jz71cKdWPa3ZkyBuwCTRV648Og8NCD8HhcaXuk");   const Token_Address = Address.parse("EQAM-vWi9yIpZzaK7e3ciFe4hgu1RFzl3o2EGTgKXFHpJoEd");  const getClient = async () => {     const endpoint = await getHttpEndpoint();     return new TonClient({ endpoint});   }; const builder = new TupleBuilder();  builder.writeAddress(recipient_address);  const args = builder.build(); const response = await client.runMethod(           Token_Address,           "get_wallet_address",           args         );   const jettonWallet = response.stack.readAddressOpt();   const forwardPayload = beginCell()           .storeUint(0, 32)           .storeStringTail('this is a transfer of jetton')           .endCell();  const body = beginCell()           .storeUint(0xf8a7ea5, 32)           .storeUint(0, 64)           .storeCoins(toNano(amount))           .storeAddress(recipient_address)           .storeAddress(recipient_address)           .storeBit(0)           .storeCoins(450000000) /// forward amount           .storeBit(1)           .storeRef(forwardPayload)           .endCell();   const transaction = {           validUntil: Math.floor(Date.now() / 1000) + 360,           messages: [             {               address: jettonWallet.toString(),               amount: toNano(0.1).toString(),               payload: body.toBoc().toString('base64'),             }

Adam: then send this transaction

Leo: Is this also working for type script? (reply to 141206)

Adam: this in js but same logic for ts (reply to 141207)

Adam: const forwardPayload = beginCell()           .storeUint(0, 32)           .storeStringTail('this is a transfer of jetton')           .endCell(); const body = beginCell()           .storeUint(0xf8a7ea5, 32)           .storeUint(0, 64)           .storeCoins(toNano(amount))           .storeAddress(recipient_address)           .storeAddress(recipient_address)           .storeBit(0)           .storeCoins(450000000) /// forward amount           .storeBit(1)           .storeRef(forwardPayload)           .endCell(); this is the important thing

Adam: and you dont send the tx to the person but jetton wallet your jetton wallet is the one responsible of sending the token const transaction = {           validUntil: Math.floor(Date.now() / 1000) + 360,           messages: [             {               address: jettonWallet.toString(),               amount: toNano(0.1).toString(),               payload: body.toBoc().toString('base64'),             }

Leo: It's quite similar to my code, can you check dm?

Dmitriy: Hello everyone, please tell me what's wrong. Why doesn't I get a confirmation in Tonkeeper? PS I'm just starting to learn JS, I used to work only with python:)              const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({         manifestUrl: '.../tonconnect-manifest.json',         buttonRootId: 'ton-connect'     });      ...       async function send() {             const transaction = {                 messages: [                     {                         address: ".....",                         amount: "10000000"                     }                 ]             };              try {                 const result = await tonConnectUI.sendTransaction(transaction);                 console.log("Transaction result:", result);             } catch (error) {                 console.error("Transaction failed:", error);             }         }  The wallet connects successfully

Adam: A dumb question your tx needs a valid until to work on some wallets (reply to 141219)

Adam: And you need to actually send to an address i get you already did that just replace that asdress with … (reply to 141219)

— 2025-02-09 —

Leo: hi, question about verify a transaction of jetton. when using sending transaction with ton, im calling this api:      ->get("https://tonapi.io/v2/blockchain/transactions/$hash"); to verify both address destination if it match. but when doing the same for jetton token i alwasy failed to get the wallet. any example out there to help me verify where is the issue ?

Leo: (php server side)

WhyesCode: Jetton transactions aren't your typical value transfers, they're interactions with smart contracts. The standard transaction API endpoint you're using is designed for basic TON transactions and doesn't unpack the intricate details of Jetton transfers. (reply to 141247)

Leo: so what is the best way to verify the transaction by the server side ? (reply to 141249)

WhyesCode: Use TonAPI's Jetton operations endpoint  $response = $client->get("https://tonapi.io/v2/accounts/{walletAddress}/jettons/operations"); Fetch the operations for the wallet, find the transaction by its hash, and confirm the destination address matches. (reply to 141250)

Leo: ok thanks, will try it!

Hayoung: Is there any reference to make offline signer(JS/TS) on ton?

WhyesCode: Are you asking which SDK or library you can use? (reply to 141255)

&rey: Both @ton/ton and TonWeb are offline, provided you feed seqno and message to be signed. (reply to 141255)

Hayoung: Thank you for your response. I realized that I asked my question incorrectly. I would like to know which method to use in @ton/ton to sign like Ledger and whether there are any best practices for this. (reply to 141257)

&rey: On a quick skim, the best way is to mock TonClient and use just sendTransfer. (reply to 141259)

James: Error: Unable to execute get method. Got exit_code: -13 at TonClient.runMethod

James: Hi, Can someone help me with this error ? (reply to 141263)

WhyesCode: Is -13 used intentionally in the code to signal a specific condition? (reply to 141263)

fedya eremin: Sorry for interfering, but it seems so, because it is not a known exit code of tvm (reply to 141265)

Aidar | Compass Labs: gm all - I am new to TVM development but very seasoned with EVM. I am looking to develop a ZKP project but can't decide what language I should use. What is the most suitable one for ZKPs: FunC, Tolk or TACT? Looking at https://docs.ton.org/v3/guidelines/dapps/tutorials/zero-knowledge-proofs seems like FunC is the (only) fit? Any tips/docs would be much appreciated

Adam: Either func or tact are good , tact is compiled back ro func (reply to 141271)

Adam: You are using an unknown get method for the contract (reply to 141263)

Olimp X: Greetings! I need a Ton for my project, my team and I are testing the Crypto Testnet bot, and we also plan to distribute a Ton sometimes, but not much, and so it is necessary for the project, please help me

WhyesCode: Paid task? (reply to 141298)

Ghosthawk: idk any other faucet has or not but i only know this @testgiver_ton_bot you can get 2 TON/h for your testnet project (reply to 141300)

Green: How much you need? (reply to 141300)

Olimp X: 90 TON (reply to 141305)

Adam: testnet ton or real ton? (reply to 141307)

Olimp X: Testnet (reply to 141308)

Oken: #report wallet.ton.org leak my IP address for no reason

Ghosthawk: this is not leak, it is github protection (reply to 141310)

Ghosthawk: It probably thought you entered too many requests and reacted like this, you can learn more in detail by searching 'rate limit github'. (reply to 141310)

Oken: https://testnet.tonviewer.com/transaction/22953f7813ee51e9f2a8e791f06d13a63a4c9dca3089db799e9d48aba09a8a73

Oken: Why did it bоunce bаck

Adam: I hope you understand how ton works

Adam: the bounce has nothing to do with them but i has everything to do with your wallet

WhyesCode: Looks like your transaction didn't go through... and could be due to insufficient funds, a smart contract error, or network hiccups.  Can you share the error message for details? (reply to 141314)

Adam: atleast deploy a contract in that address

Adam: the contract how it is rn cant accept anything try deploying and try again

Adam: or send to the none bouceable address of the comtract so it wont bounce

Adam: if you send to this address : UQAvj87v6E5803-Xr_nn_jX71fZeWqXhopiPAi9cesv48i35

Adam: it wont bounce this is the nonbounceable address

Oken: I just transferred with tonkeeper (reply to 141319)

Adam: check your wallet sent you TONs and it did not bounce you need to understand the basic knowledge of ton if you want a tx to not bounce you send it to the none bounceable address you want it to bounce you send it to the bounceable address (reply to 141316)

Adam: here is your none bounceable address : UQAvj87v6E5803-Xr_nn_jX71fZeWqXhopiPAi9cesv48i35

Adam: bounces are just a protection in case the smart contract behave well it returns money to you

Adam: try this and tell me (reply to 141328)

Adam: that's like the introduction of ton bounces understanding and stiff like that

Minimal ☄️: Can TON domain be assigned to Highload wallet?

WhyesCode: Yes (reply to 141337)

Minimal ☄️: How can I do that? (reply to 141340)

Adam: You can assign ton doman to literally any address on ton (reply to 141341)

Adam: you have the domain name in your wallet rn? (reply to 141341)

Minimal ☄️: Yes, I have the domain and the highload wallet (reply to 141345)

Minimal ☄️: How can I do that? (reply to 141344)

Adam: let's move to dms so we dont annoy people here (reply to 141347)

&rey: That's not a good idea; working with DNS contracts is actually a very relevant topic, and by asking for DMs you defect against building well of knowledge. (reply to 141348)

Adam: oh ithought it will be annoying the chat (reply to 141349)

Adam: let's keep it here then (reply to 141347)

Adam: you assisgn here the domain to any address you want doesnt matter if higload wallet or not

Adam: and you can anytime edit it for the dashboard too

— 2025-02-10 —

TON Bounty Bridge: ​TON Connect SDK for Swift  🏷 Developer Tool  Summary:I propose developing a fully functional TON Connect SDK in Swift, enabling seamless wallet integrati...  Rewards: • SBT Bounty Reward • 1500 USD in TON  Created by Immadominion

yuichi: Different addresses created using the same mnemonic. Do you know the cause?  Pattern 1 Import from ton keeper using mnemonic  Pattern 2 Created using tonweb sdk  const seed = mnemonicToSeedSync(mnemonic);  const seed32Bytes = seed.slice(0, 32); const tonweb = new TonWeb(); const keyPair = await tonweb.utils.keyPairFromSeed(seed32Bytes); const WalletClass = tonweb.wallet.all["v4R2"]; const wallet = new WalletClass(undefined!, { publicKey: keyPair.publicKey }); const walletAddress = await wallet.getAddress();

Adam: You sure you used same wallet version ? (reply to 141383)

Adam: And check in the tonviewer of both addresses reffer to same wallet can be just bounceable and none bounceable address

Adam: Same mnemonic can give multiple address for v3 v4 and v5

yuichi: Yes, both versions are on v4R2.

Adam: Can you send both addresses

Adam: They can be same address different versions

yuichi: The following is the address that I created.  ・Tonweb EQAnTDXhNydVXgwZlnQ7YaIgh2LQjH7XoQ4ADoZ6kPWomHnl  ・Tonkeeper UQDtZQ0arq5vtGnzcP333dL18NqXl1LA5UPvNCaIdO24f8E3 (Base64) EQDtZQ0arq5vtGnzcP333dL18NqXl1LA5UPvNCaIdO24f5zy (HEX)

Adam: wait sorry that's weird you sure it's same mnemonic same wallet version (reply to 141392)

Adam: you cant end up with two different addresses if it's the same mnemonic

Adam: there is maybe an error how the mnemonic is parsed

Adam: use this model

Adam: import tonMnemonic from "tonweb-mnemonic"; const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic);

Adam: Allows you turn mnemonic to keypair without turning it to seed first

yuichi: Thank you very much. I was able to create the same address from tonweb as tonkeeper.

Adam: You are welcome (reply to 141400)

Ted: Gm devs

Adam: Gm

Павел: Hello everyone! I'm writing smartcontract on FunC and I want to understand how to get Jetton master address from incoming JettonTransferNotification? Can I do it during transfer notification handling or I need to send separate messages to Jetton Wallet / Master?

Павел: I mean only by parsing jetton transfer notification (reply to 141410)

&rey: Sending separate messages won't help either. (reply to 141410)

Павел: Understand you. I forgot to clarify. I know the expected master address and I want to check that the expected tokens arrive. Can I do it only by parsing incoming message? (reply to 141412)

Павел: * transfer notification (reply to 141413)

&rey: Generally, if you know jetton master's code, data and address, then you can validate calculated jw(your address) against sender of transfer notification. (reply to 141413)

Павел: I mean onchain notif verif. During smartcontract internal msg handling (reply to 141416)

Adam: you have a smart contract and you want it to verify the notify ?

Антон: Hey guys, I've noticed that in some TON contracts, op codes are defined like: const op::approve = "approve"c; From my understanding, some string op codes (like "approve"c) are predefined and automatically resolve to specific numeric values.  Is there an official list of all predefined string op codes in TVM?

&rey: "..."c is a checksum literal. (reply to 141421)

Павел: If my smartcontract need to have possibility of jettons handling, do I need to deploy jetton wallet for it (smartcontract's jetton wallet)? From jetton spec: Example: if you release a Jetton with circulating supply of 200 jetton which are owned by 3 people, then you will deploy 4 contracts: 1 Jetton-master and 3 jetton-wallets. Very hope that no, but sounds like it is so...  What confuses me, I have never deployed Jetton Wallets for myself. Its because of hidden work of Tonkeeper, Wallet and etc?

Adam: Nah (reply to 141426)

Павел: ? (reply to 141427)

Adam: You need to understand when someone sends you tokens if you don’t have a jetton wallet they deploy it for you first

Adam: So it’s the job of the others jetton wallet to deploy you one

Adam: So first the smart contract when you mint token deploy a jetton wallet for you and send you tokens

Adam: Then when you transfer tokens to someone you deploy them jetton wallet and send tokens to them etc etc

Adam: That’s how you end up with jetton wallets when you receive jettons

Павел: Aaa Thats very nice

Павел: Thx

Adam: You welcome bro 😎

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 54 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 33  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Alan | Torch: Can we create exotic cell manually? Simply put, if I use dictionary.generateMerkleProof, can I modify the merkle root in its returning result?

Alan | Torch: If so, mintless jetton, compress-nft and even TVM are dangerous.

Alan | Torch: Sure, our research team just recognize this with audit firm, we are trying to reproduce it. (reply to 141450)

&rey: Deserializing BOC validates contained hashes. That's part of reason why cell creation is made so expensive. (reply to 141446)

Alan | Torch: Then, if the smart contract itself only verifies whether the Merkle root matches (compare with the merkle root in the exotic cell and the one store in contract), is there a risk? (reply to 141452)

&rey: The smart contract is still guarded by TVM and validators deserializing BOCs; it can't receive a cell if it's not correct. (reply to 141453)

Alan | Torch: Got it. Thus, the TVM will attempt to protect it against attacks. (reply to 141454)

&rey: That's like the entirely wrong framing. Would you suggest that inability to add some TON to your contract via external message is "node code protecting TON invariants against attacks"? (reply to 141455)

&rey: The wording I would use is "you are unable to add TON to your contract because blockchain interface, nor its internal structure, make that possible".  Exotic cells are indeed hard to understand, so you should play around with that.

Alan | Torch: What I want to express is: Throughout the entire process of verifying the Merkle proof and Merkle root, which specific step ensures that the Merkle root in an exotic cell is necessarily computed from the Merkle proof stored inside it?  It sounds like an invalid cell cannot be processed correctly at all, so when a node receives it, the transaction itself cannot be executed.  Is my understanding correct?

Ted: Which RPC providers are you guys using?

Ad: hello, is there away to know all jetton wallets associated with a wallet v4 (for example)? i d like to display a user wallet and all the jettons in one view.

&rey: Tonapi / Toncenter v3. (reply to 141466)

Ad: thx! (reply to 141467)

Adam: you can use the toncenter provider it's working fine (reply to 141460)

Евгений: Hi guys. Does anyone work with ton transactions ok Angular app? Have small question about verification

Daivd: yes (reply to 141482)

Евгений: Can I ping you in private ? (reply to 141483)

Daivd: sure (reply to 141485)

TON Bounty Bridge: ​Vampire97  Created by usha998

Andrea | Colossus: hi guys, I'm trying to deploy a new wallet (v4) using the '@ton/core' '@ton/ton' typescript library. Is there a working example ?

Adam: You can deploy it using tonweb it’s faster (reply to 141490)

Adam: But if you intend to use ton/ton

Adam: import { TonClient, WalletContractV4, internal } from "@ton/ton"; import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";  // Create Client const client = new TonClient({   endpoint: 'https://toncenter.com/api/v2/jsonRPC', });  // Generate new key let mnemonics = await mnemonicNew(); let keyPair = await mnemonicToPrivateKey(mnemonics);  // Create wallet contract let workchain = 0; // Usually you need a workchain 0 let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey }); let contract = client.open(wallet);  // Get balance let balance: bigint = await contract.getBalance();  // Create a transfer let seqno: number = await contract.getSeqno(); let transfer = await contract.createTransfer({   seqno,   secretKey: keyPair.secretKey,   messages: [internal({     value: '0.1',     to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',     body: 'Hello world',   })] });

Andrea | Colossus: i just tried to install the tonweb library but I got a lot of warnings so I decided to use the ton/ton but I'm getting crazy (reply to 141491)

Adam: You can do this (reply to 141493)

Adam: Upon send a ton amount the contract will get deployed

Adam: And before doing that get the contract address (reply to 141493)

Andrea | Colossus: mmm ok, so  can i just send some dust to myself and the wallet will be deployed ? I have another problem, I can't sign the deploy/tx with the code, the wallet is a custody wallet. I need to generate the signing payload , sign it externally, put the signature into the unsigned tx and broadcast it ☺️

Andrea | Colossus: i know not very common , but that's it 😅

Andrea | Colossus:         client = await initClient();         const wallet = WalletContractV4.create({ publicKey: PUBLIC_KEY, workchain: 0 });          console.log('Wallet address:', wallet.address.toString({          bounceable: false,          testOnly: true          }));              // Check the balance         const balance = await client.getBalance(wallet.address);         console.log('Wallet balance:', fromNano(balance));                  // 1. Build the StateInit         const stateInit = wallet.init;         const stateInitCell = beginCell()             .store(storeStateInit(stateInit))             .endCell();          // 2. Build the signing body         const signingCell = beginCell()             .storeUint(0, 32) // seqno             .storeUint(0, 32) // op code (deploy)             .storeRef(stateInitCell)             .endCell();          // 3. Prepare the signing hash         const hashToSign = signingCell.hash();         console.log('Hash to sign:', hashToSign.toString('hex'));          // 4. Get the signature         const signature = Buffer.from('143367adbb52e38dab94acc0b3f5e47c9762406c7a456f58ad10ab5f76364f893d323b91d4d73d2ddf09fd97d8887a2962fc4bd7c369636883b2d740c805cd06', 'hex');          const body = beginCell()             .storeBuffer(signature)             .storeBuffer(PUBLIC_KEY)             .storeUint(0, 32) // seqno             .storeUint(0, 32) // op code             .storeRef(stateInitCell)             .endCell();          // 5. Broadcast the tx         await client.sendExternalMessage(wallet, body);         console.log('Tx sent!');

Andrea | Colossus: This is my try , but maybe I'm missing something (or a lot of things)

⚡Mohammed: Hello TON Developers! 👋  I am developing a Mini App inside Telegram Web Apps and using TON Connect UI React to allow users to pay for VIP channel subscriptions.  ✅ Current Setup in My App:  Users connect their wallet (Tonkeeper or any supported wallet) to the app. When subscribing, Tonkeeper opens for payment confirmation. Currently, payments are made in TON, and funds are sent to my bot's wallet. 🎯 What I Want to Change: 🔹 I want to receive payments in USDT on the TON network instead of TON. 🔹 I want TON Connect UI to function the same way but display USDT payments instead of TON.  🔥 Anyone with experience in this field who can guide me on the correct way to achieve this, I would greatly appreciate your help! 🙏🔥

Adam: const signature = Buffer.from('143367adbb52e38dab94acc0b3f5e47c9762406c7a456f58ad10ab5f76364f893d323b91d4d73d2ddf09fd97d8887a2962fc4bd7c369636883b2d740c805cd06', 'hex');??

Adam: you are having the signature before signing the hash how?

⚡Mohammed: Current Payment Code (TON) Right now, I am using the following function to send payments in TON:   const handleTonPayment = async () => {     setPaymentStatus('pending');     try {         const transaction = {             validUntil: 1739029805,             messages: [                 {                     address: "UQAWb4x9KVxA51hf0rq5iRSOJRawd_UeMTEuUELub_iy6cp",                     amount: "5000000",                     payload: "te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g=="                 }             ]         };          await tonConnectUI.sendTransaction({             messages: transaction.messages,             validUntil: transaction.validUntil,         })         .then(() => {             setPaymentStatus('success');             showTelegramAlert('✅ Payment successful!');         })         .catch((error: Error) => {             setPaymentStatus('failed');             showTelegramAlert(❌ Payment failed: ${error.message});         });      } catch (error) {         console.error("❌ Error while initiating TON payment:", error);         setPaymentStatus('failed');         showTelegramAlert("❌ Failed to initiate TON payment. Please try again.");     } }; (reply to 141504)

Adam: yeah you need then to send jetton instead and verify if the wallet received those jetton (reply to 141507)

Adam: so you parse the message to check if the usdt is received

Adam: It's a little more complex then sending just ton

Andrea | Colossus: ahahah don't mind at that value , is an old signature from a previous test , I'll generate a new one each time (reply to 141506)

Adam: I see this will only work if you want to send a message to an already deployed wallet

⚡Mohammed: Thank you for your response! I understand that sending Jettons (USDT) is more complex than sending TON. Could you please provide more details on: 1️⃣ How exactly should I structure the Jetton transaction using TON Connect UI? 2️⃣ How do I properly parse the message to verify if USDT has been received? 3️⃣ Is there an official documentation link or an example that explains how to handle Jetton transfers and verification?  I appreciate any guidance or resources you can share! 🚀🙏" (reply to 141511)

Adam: but the contract is not depolyed yet so it won't process you external message (reply to 141513)

Adam: you need to deploy the wallet first then communicate with it using signed messages

Adam: for now this message of yours wont do anything

Adam: contracts are only deployed through internal messages

Adam: you can check ton documents the jetton processing section it hs everything you need (reply to 141514)

⚡Mohammed: Thanks for the guidance! I’ll check the TON documentation under the Jetton processing section. Do you have a specific link to the relevant documentation or examples? That would help me get started faster. Appreciate your help! 🚀🙏 (reply to 141519)

&rey: Your code should request that user's jetton (USDT) wallet transfers appropriate amount to you. (reply to 141504)

TON Bounty Bridge: ​Implementing ton-dns in tact.  🏷 Education  Summary:here is currently no publicly availableTON-DNS contractexample written inTact. This makes it difficu...  Created by Vodka2134156

WhyesCode: I have a working script that does this transaction in react. (reply to 141514)

..: hello every one

..: I'm working on an application that supports payments via TON Connect SDK, where users can pay for their subscription fees using USDT Jettons through Tonkeeper. The goal is to successfully transfer USDT Jettons from the user's wallet to the bot's wallet, ensuring that the invoice is displayed correctly in Tonkeeper, and the bot receives the payment.

Daivd: Do you have some problem? (reply to 141543)

— 2025-02-11 —

TON Bounty Bridge: ​"Innovative Educational Resources to Boost the TON Ecosystem"  🏷 Education  Summary:Create innovative educational materials for the TON ecosystem, focusing on interactive live simulati...  Created by miladshahi

yuichi: We are using tonweb to create a wallet. const WalletClass = tonweb.wallet.all.v5r1; to error. const WalletClass = tonweb.wallet.all.v4r2; succeeds. Does tonweb not support v5r1?

Adam: Yes (reply to 141558)

Adam: there is no v5 in tonweb sadly

&rey: Btw what's the usecase of v5 in automated scripts? There are better... well, presumably better... specialized wallets for any usecase.

Adam: You mean highload if the goal is to send a batch of messages? (reply to 141562)

&rey: I actually mean yet another wallet contract, not highload. (reply to 141563)

Adam: They probably want to use wallet v5 for the 255 messages feature (reply to 141564)

&rey: I see, but v5 is not the first, nor the cheapest, for that. Highload is not the cheapest either. (reply to 141565)

Adam: What you think it’s the cheapest solution

Adam: That would be so helpful because most people think v5 is the way to go

Adam: What?

albert: Scamer (reply to 141567)

albert: Adam ton  is a scammer, he took my money and didn't do my job.

Adam: You asked me to make a wallet drainer bro and it’s very irrelevant to chat (reply to 141574)

Adam: I have right to refuse no?

albert: I wanted you to create a smart contract, not a drainer. (reply to 141577)

Adam: A smart contract that does this what do you even mean? (reply to 141578)

yuichi: I see. Thank you for your answer. (reply to 141561)

Adam: Lmao the funny part is you are the one that sent me a dm to make it after one person in this chat warned people about a scam of getgems name

&rey: Ah, the curse of non-shared knowledge...  There is a thingy called "preprocessed-v2" (https://github.com/pyAndr3w/ton-preprocessed-wallet-v2/tree/main), whose features are just to check signature and perform a list of sent actions. It allows to send 255 messages, and has very low gas usage (since it constructs one cell only during its operation). It is seqno-based, but if one wants to submit 2550 messages, one can simply use 10 such wallets as senders (make sure your RPC supports submitting multiple externals).  I do wonder why people can't find it in the chat. (reply to 141567)

Adam: Does it have a seqno? (reply to 141582)

albert: I didn't ask for anything like that. You're trying to scam everyone, you idiot. (reply to 141579)

&rey: Moderator decisions (or, actually, allegations as of now) are better discussed in private, aren't them?

Adam: So you still have to wait for seqno that can be extremely slow and high in api usage that’s why people go for wallet v5 (reply to 141583)

Adam: Thanks (reply to 141585)

&rey: You know that v5 has seqno as well, right? And I said quite literally:  It is seqno-based, but if one wants to submit 2550 messages, one can simply use 10 such wallets as senders (make sure your RPC supports submitting multiple externals). (reply to 141586)

Adam: Yes but can send 255 message at once without caring about seqno (reply to 141589)

Tim: Because there are no official examples with this wallet and it has no official support (reply to 141582)

Adam: Never mind just read this well , it’s very op I did not know about it (reply to 141582)

Flaff: I am Flavio from THORWallet. We would like to integrate TON into our wallet solution. Would love to chat with someone from the team about the possibbilities. Thanks for getting back to me.

WhyesCode: We can initiate a chat on the details (reply to 141605)

&rey: Chat with someone from what, sorry? (reply to 141605)

Flaff: From the team that gives out TON grants

Flaff: Or someone else from the bus dev team.

&rey: Sealed, sorry. (reply to 141613)

&rey: There actually are several. TON's is at https://ton.org/grants. (reply to 141612)

Flaff: Thanks. I am looking for a Defi grant. Anyone know someone from that team?

Alan | Torch: When would we need an External Address? Are there any use cases? The explanation in the TON documentation is not very clear.  https://docs.ton.org/v3/documentation/data-formats/tlb/msg-tlb#msgaddressext-tl-b

&rey: Null address is the most common use, of course. (reply to 141622)

Alan | Torch: I see. However there is another type of external address, what is the purpose and what is the usecase for it ? (reply to 141623)

&rey: Just alternative for payload, intended to indicate an external subject who may be interested in the message. (reply to 141624)

Alan | Torch: Thanks a lot (reply to 141625)

Aleks: Hey guys  How can you convert a tx hash to have the right format supported by toncenter /api/v3/transaction ?         const sendTransactionResponse = await tonConnectUI.sendTransaction(transaction)        const cell = Cell.fromBase64(sendTransactionResponse.boc)       const buffer = cell.hash()       const hashBase64 = buffer.toString("base64")   The output gives me the tx in tonviewer bon tonviewer endpoint returns empty  Same with “hex”

Aleks: Ok got it, the boc returned by tonConnectUI is not the same as the finalized transaction… got to query the wallet directly... (reply to 141630)

Adam: The format supported is base64 and that’s very wrong (reply to 141631)

Adam: The boc returned by tonconnect describe the external message which is the same on chain

Adam: So you can still look for that hash in the wallet transaction directly

Adam: So this message here is wrong (reply to 141631)

Adam: Just look for that external message hash you can use either toncenter or tonapi

Aleks: So the boc returned by tonConnectUI.sendTransaction(transaction) is a message or a txHash?  Do you have a code example by any chance? (reply to 141636)

Adam: each tree of transactions starts with an external message

Adam: So if you find the external message you can parse the whole transaction

&rey: Ext message, 'course. TC2 doesn't wait for transaction to be included in blockchain. (reply to 141642)

Adam: It’s as easy as calling ton api (reply to 141642)

&rey: Toncenter v3 as well. (reply to 141645)

Adam: ‘’’https:// tonapi.io/v2/blockchain/transactions/${hash}’’’

Adam: Yeah that works too stick with whatever one is cheaper (reply to 141648)

Adam: @pcrafter you think it’s mandatory to check the outmessage too? (reply to 141649)

Adam: Which is the internal transfer

Adam: For exemple I transfered 1 ton i found the external message is there a need to verify that the internal message that the contract issued is a success

&rey: Well now I'd recommend you to get a specialist to help understanding all that. (reply to 141651)

Denis: Maybe you need /v2/traces/{hash} ? (reply to 141653)

Adam: Did not know about that api endpoint too i was tracing the whole tx manually sheesh (reply to 141655)

Adam: Thanks

Ad: I want to destroy a wallet and transfer all value to another account. do i achieve this using special send mode?

Mohsen: const message = await walletContract.createTransfer({   seqno: seqNo,   secretKey: keyPair.secretKey,   bounce: false,   messages: [internal({     value: amount,     to: targetAddress,     body: comment,   })] }); const result = await walletContract.send(message);  How can i get TX hash after sending transaction? send function is void and don't return anything

&rey: 1. Move all jettons, NFTs and other non-native assets using appropriate methods.  2. Send message with value 0 and mode 128. (reply to 141663)

Ghosthawk: why testgiver marked as SCAM?

Klay.D: Hi, is it possible for multiple transactions to have the same logical time? In which case?

&rey: If those transactions are on different accounts and not causally related. (reply to 141674)

Lex: where can I find mintless jetton?

Aleks: So basically the response I get from await tonConnectUI.sendTransaction(transaction) gives back the hash of a message.  I could then grab the ins and outs tx from that message hash using toncenter /api/v3/transactionsByMessage  Looks good. Guess I we don’t have to listen to all the incoming txs on a wallet to confirm if the payment went through 👍️️️️ (reply to 141647)

Vitalii: Hello. Anyone can help me host file on ton storage?

&rey: Generally, you still should listen to anything incoming, to catch any incoming transfers where frontend has disconnected (certain platforms have that). (reply to 141686)

&rey: or to catch those done without frontend help at all, such as just coming through blockchain.  An appropriate way to credit those would be: 1. If transfer contains specific deposit / valid account ID, credit there. If not, 2. If the source wallet is TON-Connected to a certain user, credit to them. If not, 3. If there was a previous deposit, credit to the same destination. Otherwise, 4. Create a new entry indicating that some address sent you money without setting the recipient; get ready for manual handling.

— 2025-02-12 —

Benchikh: Hello is there any other option to become validator others than the 300k-400k ton option?

Adam: I dont think so , ton work with proof of staking concept with no ton staked you cant be trusted as a validator (reply to 141694)

Benchikh: But 300k-400k ton is too much (reply to 141695)

Pham: try this:     async send(): Promise<TransactionId> {         await this.wallet.send(this.signedData)         return await this.provider.findTxHashByMessageHash(             this.wallet.address,             this.signedData.hash().toString('base64')         )     } // funcs     async retry<T>(fn: () => Promise<T>, options: { retries: number; delay: number }): Promise<T> {         let lastError: Error | undefined         for (let i = 0; i < options.retries; i++) {             try {                 return await fn()             } catch (e) {                 if (e instanceof Error) {                     lastError = e                 }                 await new Promise((resolve) => setTimeout(resolve, options.delay))             }         }         throw lastError ?? new Error('Unknown error')     }      async findTxHashByMessageHash(address: Address, _hash: string): Promise<string> {         return await this.retry(             async () => {                 const transactions = await this.client1.getTransactions(address, {                     limit: 5                 })                 for (const tx of transactions) {                     const hash = tx.inMessage?.body.hash().toString('base64')                     if (hash === _hash) {                         return tx.hash().toString('hex')                     }                 }                 throw new Error('Transaction not found')             },             { retries: 30, delay: 1000 }         )     } (reply to 141668)

Pham: I have a problem when try to get transaction by hash in ton I tried with TonClient but I get an invalid hash error when I try the hash from the TonKeeper wallet that shows up in the scanner.  Also what exactly is logical time (lt)? Is there any way to get the transaction data with just transaction hash without using lt and address?  https://testnet .tonscan. org/tx/6f97ca02d8f20151210ca2bef32340804214e4f74eebf6a9edf13b727ac2527e  // get tx data ;(async () => {     const lt = String(1)     const senderAddress = Address.parse('0QBh14OFHZqXqMyAHUio8EZ9FAf5smnkcmb0j533aHtFNcsF')      const tonTransferTx = '6f97ca02d8f20151210ca2bef32340804214e4f74eebf6a9edf13b727ac2527e'     const transactionData = await client.getTransaction(senderAddress, lt, tonTransferTx)      console.log('Transaction Data:', transactionData) })()  returning error      data: { ok: false, error: 'Invalid hash', code: 503 }   },   status: 503

Pham: do you know how to fix it?

Aria: Helllo friend. Lets dive in.  1. Input validation errors:    - Invalid hash format    - Missing or incorrect hash length  2. Network errors:    - Connection issues    - API endpoint problems  3. Response validation:    - Empty responses    - Invalid transaction data    - Missing required fields  4. API-specific errors:    - Status codes    - Error messages from the TON network  You can test different error scenarios by: 1. Using an invalid hash (wrong length or format) 2. Using a non-existent transaction hash 3. Testing with network disconnected 4. Testing with invalid API endpoint (reply to 141704)

Aria: Invalid Hash Error: The error message "Invalid hash" suggests that the hash you are providing to the getTransaction function is not recognized or is in an incorrect format. Ensure that the hash you are using (tonTransferTx) is the correct hash for the transaction you are trying to retrieve. Double-check that you are copying the hash accurately from the TonKeeper wallet or the provided URL.  Logical Time (LT): Logical Time (LT) is a concept in the TON blockchain that represents the order of transactions. It is a monotonically increasing value assigned to each transaction to ensure the correct sequencing of events. LT is crucial for determining the order of operations and preventing conflicts. You can learn more about LT and its significance in the TON blockchain by referring to the official documentation or community resources.  Retrieving Transaction Data: To get transaction data using only the transaction hash, you can try the following approach:  // get tx data const tonTransferTx = '6f97ca02d8f20151210ca2bef32340804214e4f74eebf6a9edf13b727ac2527e'; const transactionData = await client.getTransaction(tonTransferTx); console.log('Transaction Data:', transactionData); In this code, we are directly passing the transaction hash (tonTransferTx) to the getTransaction function without specifying the lt and senderAddress. This approach should retrieve the transaction data if the hash is valid and the transaction exists on the blockchain.

Aria: Test these :

Aria: I can’t send the code ?

Pham: can you put it into this link https://notepad .pw/BaDiWwzHxTrXWWPGXmxD

Aria: Sure

Pham: in my local it have error when calling the function

Pham: the current ton version is "@ton/ton": "^15.2.1"

Aria: Try these 3. One of them is errorless. Test all and I'm sure your problem will be solved.   https://notepad.pw/share/vvCyKeld1387ICg5laCJ

Pham: it have the same error with 1. But the final target I want to archive is check for the transfer transaction is successe  or fail. Can you give the some suggestion to do it Aria (reply to 141716)

Aria: you want to check if a TON transfer transaction was successful. Let me help you with a better solution: [ code in link that i share ] 1. Uses getTransactionsByHash instead of getTransaction - this is more reliable for hash lookups  2. Properly checks transaction success by looking at:    - Compute phase success (did the smart contract execute correctly)    - Action phase success (did the transaction complete all its actions)  3. Returns detailed status information including:    - Clear success/failure indication    - Timing information    - Transaction fees    - Error reasons if something failed  To use this code:  1. Replace 'YOUR_API_KEY' with your actual TON Center API key if you have one 2. Pass in your transaction hash 3. Check the success boolean in the response  The code will tell you if: - The transaction completed successfully - The transaction failed (with reason) - The transaction couldn't be found - There was an error checking the status 1. Uses getTransactionsByHash instead of getTransaction - this is more reliable for hash lookups  2. Properly checks transaction success by looking at:    - Compute phase success (did the smart contract execute correctly)    - Action phase success (did the transaction complete all its actions)  3. Returns detailed status information including:    - Clear success/failure indication    - Timing information    - Transaction fees    - Error reasons if something failed  To use this code:  1. Replace 'YOUR_API_KEY' with your actual TON Center API key if you have one 2. Pass in your transaction hash 3. Check the success boolean in the response  The code will tell you if: The transaction completed successfully The transaction failed (with reason) The transaction couldn't be found There was an error checking the status. Chek 2 other codes in Note link. (reply to 141719)

Aria: The other 2  https://notepad.pw/share/Y2nRVkWg0mILfdEqIhII (reply to 141716)

Pham: I check and it have error like this

Pham: it dont have fucntion getTransactionsByHash

Aria: My bad 🙏  https://notepad.pw/share/8FISO3FUJ9pDkOCAkPKL (reply to 141723)

Pham: Thanks Aria but it isnt work for me, I will find some way to work around (reply to 141724)

Aria: Whats the problem (reply to 141725)

Pham: have the same problem with this (reply to 141713)

Sam: you need to supply the first argument as address in this method, use a different method if you want to get tx by hash (reply to 141727)

Sam: you can use v3 api for getting tx by hash https://testnet.toncenter.com/api/v3/index.html#/blockchain/api_v3_get_transactions

Pham: Thank you Sam, I am trying to use trace api to get detail for transaction and it's pretty ok now

Sam: you're welcome :) (reply to 141731)

Saurav: Is Tact a better language than FunC for developing smart contracts on the TON blockchain? Does it have any major bugs or limitations? Can I use Tact for a large-scale project with very long contracts, or is FunC still the better choice? If Tact is suitable, what important factors should I consider before starting smart contract development on TON?

Andrey: Try tolk language instead (reply to 141734)

Saurav: Okay, but is there any specific reason? (reply to 141735)

Saurav: @andreypfau why not tact

Hunter: ton bridge is blocked,is there anyone can resolve this issue?

Andrey: Because tact is overhead abstraction over func, it compiles to not optimized func and then to bytecode. Tolk compiles directly to bytecode and has more friendly syntax like modern languages (reply to 141737)

Saurav: @andreypfau  thanks

Saurav: @andreypfau  One more question: Is tolk there any gas optimization issue? I mean, does it consume more gas compared to Func in TON OS or similar?

Andrey: tolk is fork of func, gas consumption is same as in func and sometimes less, because have extra optimizations for compilation bytecode (reply to 141741)

Saurav: @andreypfau  okay , thanks

Hunter: I found that all cross-chain requests have been blocked, which seriously affects the normal use of cross-chain. I think this has a great negative impact on the ecological development of ton, and all users who want to enter the ton ecology from other ecosystems will be blocked. (reply to 141738)

Hunter: @IAmAnEmpire @malev @tsivarev (reply to 141744)

Hunter: @tsivarev hey,why all the msg has been deleted? The problem doesn’t resolved

&rey: You hereby have a moderator warning for pinging a large amount of users at once,  and for saying things that are false. There haven't been "all your msgs deleted". (reply to 141746)

Hunter: what? Other things are put on hold for the time being. I want to know why ton bridge can't be used now? This is an objective fact. (reply to 141747)

Combot: Combot has warned Albert Lee (2/3) Reason: Word ******* is not allowed

GCGC: Hi, I have a question, we use @tonconnect/ui to integrate on the client side, but our app still cannot confirm the transaction, and it says: Unable to verify transaction,anyone know how to deal with it?

WhyesCode: Where does this image lead to? (reply to 141756)

WhyesCode: What is the transaction error code in tonviewer.com? (reply to 141756)

GCGC: hi，I replied you through DM (reply to 141762)

Emil: hi everyone, I have difficulties with the integration of the scanner for the ton blockchain, when I receive information in the blocks of addresses in an incomprehensible format Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF I hope you can tell me what I'm doing wrong, I use pytonlib

mort- x: Hello everyone

mort- x: Anyone has experience setting up an archive node?

Павел: What is the best FunC contracts dev IDE? Now I'm using VSCode with FunC Language Support (Whales Corp) extension, but it feels like FunC support is very basic compared to support for Python, TS, Rust, etc...

Павел: For example here:  () load_storage() inline {     slice ds = get_data().begin_parse();     ...     storage::owner = ds~load_msg_addr();     ... }  Its not suggest load_msg_addr(). Feels like I'm writing inside text editor with only syntax highlighting

Павел: May be pycharm is better?

Павел: At first glance, PyCharm is better

Павел: Help pls 🙏🙏🙏 What is the difference between coins and int? And between load_uint and load_coins?  In docs of load_coins I see: Loads serialized amount of Toncoins (any unsigned integer up to 2^120 - 1). So, at first glance it is for TON operations.  But in get_pool_data method of stonfi pool I see field reserve0 with type coins that other stonfi contracts parses by load_coin. The problem is that the reserve0 represents amount of Jettons, not TON.   What am I getting wrong? If coin and load_coins is for TON, why not to use int and load_uint for Jettons?

Yaroslav Bocharov: Hi all, is there an example of a mini apps, where payment goes autosubscription starace? like a subscription.

&rey: ~load_coins supports 120-bit integers at most, uses up to 124 bits in cell, uses shorter encoding for lower numbers, is obviously binary-incompatible with ~store_uint, and that's pretty much all. (reply to 141779)

Adam: Wallet v4 allow that , people can use wallet v4 for subscription that are paid monthly (reply to 141780)

Adam: check dapps/defi/subscriptions on TON docs

Yaroslav: How many tons should specify in ui for script deployLibrary.ts for stablecoin jetton  from this repo https://github.com/ton-blockchain/stablecoin-contract/blob/main/scripts%2FdeployLibrary.ts?

Adam: 0,5 ton should be more than enough (reply to 141790)

Adam: But you can experiment how much it’s needed to not fail

Osiris ᕫ: Hello, if you don't mind me asking, when we finish the ton blockhain  quiz, when do we expect to receive the sbt? Thanks!

Nerses: is there account abstraction in TON like EVM's EIP1271 ?

&rey: Wallet v1r3, wallet v4r2 or wallet v5 depending on what you mean exactly. (reply to 141804)

Nerses: smart contract wallet that can support different methods of signing (reply to 141807)

&rey: v4/v5 or inplug-v2. Former have extensions deployed as separate contracts, latter supports it without any extra transactions. (reply to 141808)

TON Bounty Bridge: ​https://github.com/Shahabdastan/Shahab.git  🏷 Developer Tool  Summary:https://github.com/Shahabdastan/Shahab.git  Created by Shahabdastan

Steve: hi, does stonfiv1 pools have 1 router only?  EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt

know: Is there any documentation that goes in-depth explaining the mechanics and use cases of jUSDT? The wiki has some info but a lot of stuff isn’t clear.

Ad: when using the pytoniq lite-client, the run-get-method calls regularly fail, with an error saying the server does not know about the block in question ("possibly not in db"). is the pytoniq client buggy, or is this expected? what am i doing wrong?

&rey: Use a LiteClient connected to single server. Doing otherwise indeed triggers a bug: latest block might be obtained from one server but subsequent get-method call be done to another one, which might've not synced that block yet. (reply to 141820)

&rey: Said jetton quite outdated given true USDT@TON. (reply to 141815)

Ad: As far as i know, the LiteClient class only connects to one node. I am not using LiteBalancer... (reply to 141823)

&rey: Looks like a node bug actually. You should try debug-printing the block which get-method is requesting (patching pytoniq sources).

Osiris ᕫ: @admin🙏 (reply to 141797)

know: Do you know what determines the maximum supply of jUSDT? Is it the max supply of USDT on Tron? Is the balance of the contract only to cover gas fees? (reply to 141824)

Ad: it turns out that the pytoniq LiteClient starts an async background task to fetch the most recent MC block always. When i stop that task, i am getting a much more stable experience... (reply to 141826)

.: Hi. trying to create transaction and open link, but its just open wallet without transaction. Have you please some solutions? https://t.me/wallet?startattach=pay_destination-address_10000000

Bus: Hi, does FunC has something like selfdestruct in Solidity?

Gleb: Hi, could you please suggest, how to troubleshoot a case when a validator suddenly wasn't elected? It happened only once (or one cycle), many cycles before it was elected, next cycle after - elected. I have a vanilla setup with mytonctrl and stuff

Gleb: Some logs, election details and so on - where to get/to seek?

Gleb: The stake was sent to the elector for the election period and just returned back at the end of the election period (w/o rewards obviously)

Gleb: Ah, forgot to say: the stake was ~520k TON - seems like more than enough to get elected. This happened a couple of days ago, on Tuesday

— 2025-02-13 —

Nhat Nguyen: ton address difference raw address while same menomics generate address mainnet and testnet. how to gen same raw address?

&rey: That's a recent fix and they should be different indeed. (reply to 141854)

Nhat Nguyen: how to generate raw address testnet i can't gen it (reply to 141856)

Nhat Nguyen: when using memonics i can generate raw mainnet only i can't gen raw test net

Maxey: I noticed that when a contract emits a log, the cost is related to the size of the data in the log. If the contract needs to charge for this, how should the fee be calculated? Can fwdFee be used for estimation?

Vanshika: Hi Guys,  I am trying to understand how frozen stake works in TON.  Is there any documentation present to understand the holding period which we can follow? @pcrafter

&rey: There is. (reply to 141862)

&rey: In fact, https://docs.ton.org/v3/documentation/infra/nodes/validation/staking-incentives#validator-selection-algorithm

Charles: Hi guys are there any team members in here?

Андрей: nometa.xyz (reply to 141867)

Gleb: @pcrafter probably you could suggest, sorry for tagging (reply to 141840)

Gleb: just show me the right direction 🙂 I will start digging in it

&rey: Probably global version mismatched (late upgrade) so consensus didn't include your application. (reply to 141843)

Gleb: Will check, thank you! (reply to 141875)

UIU: hi bro (reply to 141875)

Combot: Combot has warned véronique⁴² (2/3) Reason: Word ******* is not allowed

fedya eremin: Hello, I have a question. How do I implement wallet polling, e.g I want to get transactions on my wallet over time, parse comments, store a breakpoint in db for correct service restart?

WhyesCode: Ask (reply to 141895)

— 2025-02-14 —

Artem: Error: Invalid address     at openContract (/usr/local/lib/node_modules/ton-core/dist/contract/openContract.js:18:15)     at NetworkProviderImpl.open (/usr/local/lib/node_modules/@ton-community/blueprint/dist/network/createNetworkProvider.js:166:44)     at Object.run (/Users/Shared/stablecoin-contract/scripts/deployJettonMinter.ts:24:29)     at async run (/usr/local/lib/node_modules/@ton-community/blueprint/dist/cli/run.js:16:5)     at async main (/usr/local/lib/node_modules/@ton-community/blueprint/dist/cli/cli.js:62: please help with this error

Artem: this error when deploying a contract

TON Bounty Bridge: ​Ну что там  Created by Zhenya1991

Sam: Use tonapi There's a get transactions method   For the transactions, store the latest one's 'lt' Then in the next fetch, supply the 'lt' in the after_lt param to get transactions after the latest one previously fetched (reply to 141912)

yuichi: I would like to create a code to transfer a Token other than Ton (e.g. USDT). I created the code as follows, but it gives me an error. Does tonweb support Token other than Ton to begin with?            const usdtTransferMessage = new TonWeb.Contract({             address: params.usdtContractAddress         }).methods.transfer({             to: params.usdtContractAddress,             amount: params.amount * 1e9,              payload: "",         });          const result = await params.wallet.methods.transfer({             secretKey: params.keyPair.privateKey,             toAddress: params.recipientAddress,             amount: TonWeb.utils.toNano(0.05),              payload: await usdtTransferMessage.getQuery(),         }).send();

best: hello, guys can i introduce myself in here?

Adam: You can check my repo (reply to 141933)

Adam: Vodka2134156/SEND_TOKEN_TONWEB

Adam: Has already an exemple set for tonweb sending tokens

Florina · Cyberscope: hey! anyone in need of a consensus hk ticket? can no longer attend :(!

&rey: No because it is utterly irrelevant to TON. (reply to 141950)

fedya eremin: Thank you! Which wallet should I look for jettons? Jetton wallet governed? (reply to 141928)

Deleted Account: Race condition in FunC    Hi everyone, someone ask of this in ton research anybody wanna help out?  I am trying to manifest a race condition using FunC as a part of my project. Below is the code   (int) load_data() inline {     var ds = get_data().begin_parse();     return (ds~load_uint(64)); }  () save_data(int counter) impure inline {     set_data(begin_cell()     .store_uint(counter, 64)     .end_cell()); }  () recv_internal(int msg_value, cell in_msg, slice in_slice) impure {     if(in_slice.slice_empty?()) {         return ();     } else {         var counter = load_data();          int i = 0;         while(i < 5) {             i += 1;         }         ;; send_raw_message(begin_cell().end_cell(), 64);          counter += 1;         save_data(counter);     } }  (int) get_counter() method_id {     return load_data(); }  When writing tests, I am sending two internal messages. The final value of counter should be 1 after execution of both messages due to the race but it is actually 0. Can anyone tell me what I am doing wrong and is race condition even possible in TON?

Sam: I didn't understand your question (reply to 141953)

fedya eremin: I'd like process payments in jetton, polling over my wallet. AFAIK in this handler in tonapi jetton operations are not in response, only operations with TON (reply to 141958)

Sam: oh there's a different api for jettons (reply to 141959)

fedya eremin: Also, this handler does not give any information about transaction comment (or I am doing sth wrong)

fedya eremin: I don't see any suitable handler in tonapi Jetton section ( (reply to 141960)

Sam: it gives, if the comment is present, check carefully (reply to 141961)

fedya eremin: It seems to ban links, could you give name of handler?)

fedya eremin: Or can I DM you? (reply to 141963)

&rey: No, all messages are executed in sequentially consistent order. (Moreover, they are executed in order of creation-logical-time.) (reply to 141957)

Павел: Hi! Can I test with Sandbox messages that my contract sends during handling recv_internal?  I send msg to my contract like this:  await provider.internal(via, {     value,     sendMode: SendMode.PAY_GAS_SEPARATELY,     body: beginCell()         ...         endCell() })  And expect messages of my contract here:  expect(res.transactions).toHaveTransaction({     ... })

Павел: I dont see them and cannot understand is it problem in tests or in my contract...

Павел: * But in debug I see messages of sender and bounce fees with success: true from my contract.

Павел: If I send test message before all logic I dont see it too...

Sumit: How can i make sure that the jettons that i am receiving inside a contract are coming from a correct contract?

Павел: What do you mean by "correct" contract? (reply to 141977)

&rey: Perhaps compute/action phase is failing? (reply to 141976)

Sumit: I want to only handle token transfers for a specific token (reply to 141980)

Павел: Yes... Trying to understand why I have exit code 7 on any global value access... (reply to 141981)

&rey: You'll have to store your jetton wallet address. (reply to 141977)

&rey: It can't be put into StateInit directly, but can be provided on initialization (preferably if there's admin) or calculated using jetton master code, data, address.

Павел: Yea, you need to check that sender is jetton wallet contract of your contract (reply to 141982)

Sumit: But i wont have it when i am initiating the contract? Since this is a constructor argument? (reply to 141985)

Павел: May be someone know why it is so? (reply to 141984)

Sumit: Its like a circular dependency? (reply to 141988)

&rey: Have you actually inited them? They don't persist between transactions. (reply to 141984)

Павел: Yes (reply to 141991)

Павел: With calling this func:  () load_storage() inline {     slice ds = get_data().begin_parse();     storage::is_complete = ds~load_uint(1);     ... } (reply to 141992)

&rey: impure specifier together with inline. (reply to 141993)

&rey: > It can't be put into StateInit directly, but can be provided on initialization (preferably if there's admin) or calculated using jetton master code, data, address.  Both those ways break the dependency. (reply to 141990)

Павел: You are legend. Thank you (reply to 141994)

Bus: For anybody searching the same: There is no selfdestruct like in Ethereum but there is set_code() for updating a contract's code. But you are only able to update it, if you implemented set_code() in your contract before! (reply to 141838)

&rey: Yes. Send outgoing message with mode 160. Non-native assets must be moved separately. (reply to 141838)

Combot: Combot has warned глухой музыкант (1/3) Reason: Word ******* is not allowed

UIU: Can you introduce someone to do the smart contract project (reply to 142026)

Barack 💎: Hey. I have full experience with Func and Tolk now. If you need someone to then I’m here :D

&rey: It's quite interesting to know why you didn't work with the person one message up; is there a twist? (reply to 142035)

Mikey: Anyone in need of FunC developer? Hit me up. More than happy to help!

boot adbot: other than just scraping fragment or getgems, is there a way to get the owner address of a telegram username nft with just the username?

Mr: Hello   Please can anyone help me   I'm trying to create a token transfer using ton connect but it doesn't seem to work   Also checked stack overflow but couldn't find a solution to it

&rey: The right way is 1. Open https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md which says what that mysterious "transfer" message is and how to serialize it. 2. Take the TL-B scheme: transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress                  response_destination:MsgAddress custom_payload:(Maybe ^Cell)                  forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)                  = InternalMsgBody; 3. 1-to-1 convert it: begin_cell().store_uint(0x0f8a7ea5, 32).store_uint(0, 64)             .store_coins(amount).store_slice(destination)             .store_slice(my_address()).store_uint(0, 1)             .store_coins(0).store_uint(0, 1) .end_cell() 4. Look at any related notes. "Should be rejected if: 1. message is not from the owner. <...>" tells us that sender must give the transfer order to sender's jetton wallet. (reply to 142044)

Mr: Okay   Thanks  I'll check them out (reply to 142045)

best: guys, I have good experience in FunC. if anyone need Dev, let me know.

— 2025-02-15 —

&rey: Do you happen to have TON DNS resolver? If so, resolve <user>.t.me.resolve-contract.ton and call get_nft_data get-method on the returned contract. (reply to 142042)

0x: I am trying to transfer jetton from TON chain.  I would appreciate it if you could provide me the endpoint required to transfer jetton.

FREEZZZZ: how to get transaction status using BOC in golang?

yuichi: Thank you for your response.  What is this repo? It would be helpful if you could provide links, etc. (reply to 141945)

TON Bounty Bridge: ​Thank you  🏷 Developer Tool  Summary:Thankful  Created by mahdi858

WhyesCode: Let me help (reply to 142052)

iAbdurahmon: Hello I created a simple site on django and launched it on the .ton domain But for some reason login doesn't work - it loads endlessly after sending a request. And if you log in through the Telegram application, not only login but also the search does not display results Although on a regular domain the site is fully functional.

know: Are there chats devoted to the tokenomics side of TON?

know: https://github.com/jpantunes/awesome-cryptoeconomics  Just found this; If anyone has or wants to make a TON-specific version of this, that would be rad af. (reply to 142063)

Kevin: can you share a link? it sounds like you don't know what the issue is and this would help anyone help debug (reply to 142061)

Zbyl: Hi, are the Stonfi V1 contracts available on the testnet? or only V2?

iAbdurahmon: nanotech.ton (reply to 142082)

Kevin: if you use telegram desktop or a browser extension for .ton domains then you can use devtools to investigate (reply to 142087)

iAbdurahmon: Which extension can i use for .ton domains? (reply to 142088)

Kevin: TON Connector in chrome (reply to 142089)

Setmax: Hey guys, I want to use a user-signed message in the frontend, send it through the backend, and then forward it to the network. How can I get a signed message from TonConnectUI?

Kevin: But a signed message ≠ a signed transaction, can’t necessarily be broadcast to chain (reply to 142091)

Jomari: how do i get w5 version wallet

Jomari: I'm new

Jomari: Hello who can help me..because i try to send my balance in my wallet from ton space but i don't know where is the money now

Jomari: Please help me to understand this situation

&rey: Not possible for reasons of user security. (reply to 142091)

Jomari: I don't know if i already send it again in my ton space balance..but the money is nothing..don't know where is it🥺

⚡Mohammed: Hello TON Community,  I’ve been working on integrating USDT (Jettons) payments into my project, but I’m facing some challenges in tracking transactions.  1️⃣ Webhook: I tried using the webhook, but it doesn’t return all the necessary details I need to confirm payments.  2️⃣ Custom Payload: I attempted to use a custom payload when sending the transaction, but it seems that it doesn’t appear in the webhook data, making it difficult to link the transaction to the correct user.  3️⃣ TON Console Invoices: I found in the TON Console documentation that I can create an invoice to track payments. However, this method requires verifying my account by messaging Rostislav on Telegram. I sent a message three days ago, but I haven’t received a response yet.  🚀 My Question:  Is creating an invoice through TON Console the correct way to track Jetton payments? Or is there a more efficient or recommended way to accurately track payments? Looking forward to your insights and experiences. Thank you! 💙

WhyesCode: Hey! Creating invoices via TON Console does track Jetton payments, but if the verification is taking too long, you might want to use blockchain APIs like TON API or TONCenter.  They let you monitor transactions directly and get all the details you need. (reply to 142114)

⚡Mohammed: Thanks for your response! That sounds like a great alternative. Could you please share the relevant documentation for TON API or TONCenter that explains how to track Jetton payments effectively?  I want to ensure I’m getting all the necessary details from transactions, so any official guides or examples would be really helpful.  Appreciate your help! 🚀 (reply to 142115)

WhyesCode: https://tonapi.io/doc/ (reply to 142117)

⚡Mohammed: Hello TON Community,  I'm getting a "can't decode address transactions" error from the /v2/jettons/transactions endpoint.  Problem: GET request to: https://tonapi.io/v2/jettons/transactions?jetton_address={JETTON_CONTRACT_ADDRESS}&account={WALLET_ADDRESS}  Returns: ```json {     "error": "can't decode address transactions" } Context: Trying to get Jetton payment records for a wallet. Using Jetton contract & wallet addresses as parameters.  Tried:  User-Friendly & Raw formats for WALLET_ADDRESS. Verified JETTON_CONTRACT_ADDRESS format. Addresses valid on explorers. Reviewed API docs, no error info. Questions:  Is /v2/jettons/transactions the right endpoint for wallet payment records? If not, which one is? Correct formats for WALLET_ADDRESS & JETTON_CONTRACT_ADDRESS? Raw WALLET_ADDRESS mandatory? Why "can't decode address transactions" error? Address format issue? API issue? Any help appreciated! I would be very grateful for any help or suggestions to resolve this issue. Thank you in advance for your assistance!

— 2025-02-16 —

TON Bounty Bridge: ​Ok  🏷 Developer Tool  Summary:Hello  Created by mahdisafarzade

WhyesCode: Looks like the error's due to the address format. Try using the raw hexadecimal format for both your jetton contract and wallet addresses, without any prefixes like "0:". The API expects plain 64-character hex strings. (reply to 142122)

Adam: Who ever asked me about this

Adam: I want to create a token that will also depend on the price of gold (for example, gold is growing my token will also grow, gold falls, the price of my token will also fall) ie just will be partially dependent on gold. I chat gpt made a smart contract I don't think it will be right, so I would like to work with a person who develops his own smart contracts and work with him. I need token only reacts to the rate of gold.

Adam: I lost your message somehow

&rey: They opted to delete their message IIRC. (reply to 142143)

Adam: Weird they dmed me this and I couldn’t even find my reply to it (reply to 142147)

Kaio: Look for someone who can develop a simple bot that show in telegram channel successful deployments from tonfun contracts(Blum)

WhyesCode: I can help (reply to 142152)

userton: qq guys! trying to use tonapi to get ton price / jetton price, but my request seem use the wrong end point, and it seems that in this tonapi version changes have been made to this method. Can someone pls share the solution / approach / endpoints / methods?  like, this thing ``${API_BASE}/rates?ids=the-open-network`;` wont work, error response from api  tried ton, toncoin, the-open-network :/

Adam: You can just question for the pool reserves (reply to 142155)

perfogic: @pcrafter hi, is there any lib that can be replaced for ton-lite-client on npmjs ?

perfogic: since pytoniq is same as ton-lite-client but their development is quite active, ton-lite-client is 2 years ago

Green: Hi Senior devs, when I deploy the contract like this beginCell()         .storeRef(             beginCell()                 .storeAddress(config.employerAddress)                 .storeAddress(config.employeeAddress)                 .storeAddress(config.commissionReceiverAddress)                 .endCell()         )         .storeUint(config.totalAmount, 64)         .storeUint(0, 64) .endCell();  when I try to read that data on frontend,   const res = await provider.get('get_config', []);         const addrs = res.stack.readCell();         const addrStack = addrs.beginParse();         const employerAddr = addrStack.loadAddress();         const employeeAddr = addrStack.loadAddress();         const commissionReceiverAddr = addrStack.loadAddress(); those 3 addresses are null, is there any wrong I did?

Green: which part? (reply to 142169)

— 2025-02-17 —

pop: hi

pop: I have some problems to mint jetton token

WhyesCode: What is the issue? (reply to 142179)

pop: When a user sends TON to the token contract plus a specific payload, the contract automatically mints new tokens at a defined rate. but what should I do, minting new token?

d: Hello, dear community members! I’m currently working on testing and need a significant amount of TON testnet tokens (100k–1M) to proceed with my tasks.  If any validators or community members could spare a large quantity of testnet tokens, your contribution would greatly help me in completing my work. I’d be immensely grateful for your support!  My testnet wallet address: 0QARhSFoBnRaVZtThxmTT_OZ_rWOsArgYZhQyV1pJKaD09Mm  Thank you so much for your generosity and assistance!

⚡Mohammed: Hello Senior devs,,  I'm facing an issue retrieving Jetton transactions using the Toncenter API endpoint /getTransactions.  Currently, I'm using the /getTransactions endpoint from the TONCenter API to fetch the transaction history of the bot's wallet. My code is designed to work with the TONCenter API. However, it seems that /getTransactions only returns transactions for the native TON currency and does not include Jetton USDT transactions.  Although I’ve implemented a filter in my code to look for Jetton Transfer Notifications, I still don’t see any Jetton transactions in the API response.  Additionally, I tested the /getTransactions endpoint directly using a simple GET request in the browser:  bash Copy Edit GET https://toncenter.com/api/v2/getTransactions?address={WALLET_ADDRESS} The response only contains native TON transactions, with no trace of Jetton USDT transactions.  Here’s a simplified snippet of my code that processes transactions: python Copy Edit async def parse_transactions(provider: LiteBalancer):     my_wallet_address = BOT_WALLET_ADDRESS     transactions = await provider.get_transactions(address=my_wallet_address, count=10)      for transaction in transactions:         if transaction.in_msg.is_internal and transaction.in_msg.info.dest.to_str(1, 1, 1) == my_wallet_address:             if transaction.in_msg.msg_data and transaction.in_msg.msg_data.get('@type') == 'msg.dataRaw':                 if 'JettonTransfer' in transaction.in_msg.msg_data.get('body', ''):                     logging.info("🎉 Jetton Transfer Notification detected!")                     # ... Process Jetton transaction ... My Questions: Should the /getTransactions endpoint return Jetton transactions by default when using the TONCenter API? Are there any specific parameters or options that need to be used with /getTransactions in TONCenter API to include Jetton transactions in the response? Is there another endpoint in the TONCenter API specifically designed for fetching Jetton transactions? Has anyone successfully retrieved Jetton transaction history using TONCenter API or any other tools? Any tips or alternative solutions for working with TONCenter? Thanks in advance for your help! 🚀

&rey: 1. Jetton transfer is nothing but four TON transfers (five transactions, to be precise) with some changes to contracts' states. 2. Use Toncenter v3 API. (reply to 142193)

⚡Mohammed: Thank you for the clarification! Could you please provide more details on how to use Toncenter v3 API to track Jetton transfers? Which specific API endpoint should I call, and do I need any extra parameters? (reply to 142194)

yuichi: Please answer this one. (reply to 142056)

Green: anyone? (reply to 142164)

&rey: 1. Are you loading addresses from the root cell? 2. Are they stored in the root cell? (reply to 142164)

Green: Like this, on root cell, I store one cell more. beginCell()         .storeRef(             beginCell()                 .storeAddress(config.employerAddress)                 .storeAddress(config.employeeAddress)                 .storeAddress(config.commissionReceiverAddress)                 .endCell()         )         .storeUint(config.totalAmount, 64)         .storeUint(0, 64)         .storeUint(config.endTime, 64)         .storeUint(config.paidTime, 64)         .storeUint(config.pausedTime, 64)         .storeUint(config.hourlyRate, 64)         .storeUint(config.intervalBetweenPayments, 64)         .storeUint(config.ActiveTime, 64)         .storeUint(config.commissionPercent, 16)         .endCell(); and gonna try to read those three addresses, but can't read... (reply to 142200)

&rey: Just answer two questions I provided. It will hint. (reply to 142201)

Green: um... sorry, I can't get you. 😅

Green: should I store those addresses on root cell so that read easily?

&rey: You should read them from ref. (reply to 142204)

Green: um... yes, that's why I did like this const addrs = res.stack.readCell();         console.log(addrs)         const addrStack = addrs.beginParse(); the cell's first is cell so I read that and beginparse, after then gonna loadAddress, but can't read anything... nulll, what's the problem

Green: what should I do now? pls help me...

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 54 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 37  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Nerses: It can be because of different wallet versions (reply to 142214)

yuichi: Are you saying that the 100USDT transferred does not appear in the hold account address because the source wallet version is v4 and the destination foret version is v5? How can I retrieve this 100USDT? (reply to 142216)

Nerses: yeah I suppose it is the case (reply to 142218)

&rey: I congratulate you with losing 100 USDT. You have not transferred them to a contract which can send them ever; instead, they are now OWNED by jetton wallet (handled, thus, by jetton wallet's jetton wallet). (reply to 142214)

yuichi: Does that mean I can rescue 100 USDT by manipulating my jetton wallet? However, I hear that tonweb supports v4 wallet operation, but not v5 operation. How can I rescue 100USDT? (reply to 142224)

&rey: Jetton wallet doesn't have such an option IIRC. Only Tether can help you, however unlikely that might be in itself. (reply to 142226)

fedya eremin: you'd faster earn 100usd again (reply to 142226)

Kevin: If the Jetton wallet contract is mutable then maybe you can add the missing functions (reply to 142226)

Aleks: Hey guys. Where can I find the official USDT jetton address on testnet?

Setmax: Guys, have you encountered this issue before?  I retrieved a transaction using api/v3/transactionsByMessage and also fetched transactions from api/v2/getTransactions. The idea is to get confirmation from the first API in dapp and use the second one in backend to read transactions and events to update database records.  However, the strange thing is that the two transactions for the same action appear to be different. But when I search for them in the explorer, both point to the same transaction details.  Example transaction hashes:  bd97d5b14bc90cb29a86a0af9f98b16b8da0406917dca343cd80e95005f80816  f47c56feab6e34203fea82cfd97308437095b1eacc5aff2c656f8e6c95391460  Has anyone experienced something similar or knows why this might be happening?

&rey: Because there were several transactions in a tree. (reply to 142233)

&rey: I don't think Tether has established such. What would "official test stablecoin" even mean? (reply to 142231)

Setmax: Got it. From my perspective, it would be better to create a transaction hash for all operations/txs within a tree structure. This would make life easier for indexers and RPCs. Alternatively, RPCs could use this approach to generate a transaction hash using the Merkle tree concept for all txs within a tree, aligning with the asynchronous nature of the TON blockchain. (reply to 142234)

Aleks: Yea I get your point. Other stablecoin providers do have “official” testnet contracts deployed eg USDC (reply to 142235)

&rey: User may send two deposits (10 and 300 TON) by single external message = in the same tree. You must handle both. (reply to 142237)

Jimmy: Hello everyone, I need help with a project where the contract is in tact and the front end is in react. My contract has mint and burn functions, which when executed, the wallet currently logged in will need to interact to confirm the mint or burn. Would it be possible to make this transaction not appear? For example, the mint or burn can run without the user needing to confirm.

Alena: Hey everyone! We’re working on a project in the TON ecosystem 💎 Right now, we need a lot of test coins. Does anyone know how to get them in large amounts?

&rey: Without confirmation... it'd mean the backend must do transactions. (reply to 142252)

Jimmy: Do you know of any material, tutorial or repo that shows how to interact with a tact contract from the backend? (reply to 142259)

Setmax: I should give you a big-picture view of our flow: 1. A user sends a certain amount of TON along with some arguments to the smart contract. 2. The contract emits an event containing the TON amount and those arguments. 3. The frontend should display a transaction confirmation to the user and send the transaction hash retrieved using getTransactionByMessage (which seems to be the first transaction in the tree). 4. The backend uses getTransactions to detect new emitted events, update the database, and compare the received hash with the one fetched using getTransactions (which corresponds to the second transaction hash in the tree). 5. Now, I’ve found a way for the backend to establish a relationship between these two hashes using adjacentTransactions. By providing the first hash in the tree, it returns the second hash, allowing the backend to confirm the entire process.  I understand that the second phase of confirmation isn’t strictly necessary due to the event-based design, but I’m just curious about the simplest approach to trace transactions within the tree. (reply to 142251)

Bright: Hello, I have two questions,  1. Is there any perfect way to obtain the transaction has of a sent transaction, currently I use the Toncenter api to fetch all transaactions from the account and filter by a specific unique data put in there, (doesnt work all the time), wish there was a way to determine it after it is sent. 2. When it comes to stars from a bot, is there a list where we can see the regions they can be withdrawn, as I hear some regions are not allowed to withdraaw stars

WhyesCode: Yeah, getting the transaction hash right after sending on TON isn't straightforward... there's no perfect method yet.  As for withdrawing stars from bots, some regions do have restrictions, but there's no official list published.  What kind of projects are you working on in the TON ecosystem? (reply to 142265)

Combot: Combot has warned Felix (1/3) Reason: 1 reports (reply to 142273)

Bright: thanks for the answer, im working on an ato start swapping bot (reply to 142272)

FREEZZZZ: i only use BOC from ton connect, convert into hash and find transaction by hash using toncenter api. i think it's better thant fetch all transaction from wallet (reply to 142265)

Bright: This makes sense, but I am using one of the nodejs libraries as the transactions are signed and sent on the backend not the front end (reply to 142278)

Bright: And I fetch transactions with a limit of 15 (reply to 142278)

Bright: The only issue with this is, it does have a fail rate where around 20% of the time an actual transaction isn’t found

FREEZZZZ: what libraries you used? (reply to 142279)

Bright: @ton/ton and @ton/core

FREEZZZZ: idk, but i think it's possible to get BOC from Transaction (reply to 142283)

Bright: I tried this so many ways based on docs and all

Bright: And I kept getting different hashes that were all not correct

— 2025-02-18 —

Duck: how to get TxHash from Boc?

Ziom👽: Can anyone tell how do you learn to make smart chain contracts

Ziom👽: A step by step guide wld be amaculate

Duck: you can learn from youtube (reply to 142290)

Duck: so many video in there for learning TON smart contract

Duck: you can find AlefmanVladimirEN on youtube

Alchi: There's sterik video tutorial

Ziom👽: Thnx pal 🙌 (reply to 142298)

Ziom👽: Alright 🙌 thnx (reply to 142299)

Duck: how to get TxHash from Boc?

Nhat Nguyen: hey guys, how to create highload-wallet-v3

&rey: 1. Toncenter's /sendBocReturnHash will wait until an actual transaction is sent.     /sendBoc or TON Connect's .sendTransaction do not wait for transaction being sent (thus don't guarantee it) so you can't obtain transaction hash from those. 2. Off topic. (reply to 142265)

Bright: Makes sense I’ll give it a shot (reply to 142310)

Mingyeom: Are there any good videos for developing in FunC

Mingyeom: there seems to be video on tact only

Jimmy: Hello everyone, I need help with a project where the contract is in tact and the front end is in react. My contract has mint and burn functions, which when executed, the wallet currently logged in will need to interact to confirm the mint or burn. Would it be possible to make this transaction not appear? For example, the mint or burn can run without the user needing to confirm.  can some one recommend me some doc, tutorial do to that?

WhyesCode: If you want to execute mint and burn functions without the user needing to confirm every transaction, you might look into "Meta-transactions". They allow you to relay transactions on behalf of the user, reducing the need for wallet confirmations. (reply to 142323)

T: Hi All, if i have 10,000 ton wallet address, can i get changed wallet balance real time ?

Black: I think you can (reply to 142325)

Green: maybe should use tonapi or toncenter api, ofc paid key (reply to 142325)

KBA07: What is the recommended way to store the TransactionHash in the database. Is it base64 or Hex.

Yonat: How to rename My Ton Address?

&rey: You can obtain a domain (.ton, .t.me) and connect it to the same wallet. Explorers tend to recognize this and substitute your base64 address (UQ...) with that domain. Remember that's at discretion of each individual service you use. (reply to 142330)

&rey: Byte array would be best if your language supports it (SQL does). Remember to document which hash in tree do you use specifically. (reply to 142329)

&rey: Please try to engage with the question more, because now your message requires anyone to Google the keyword to check if it is even applicable to TON. (reply to 142324)

A: Hello, I want to test usdt on TON testnet… how can I receive something like 10 USDT on my ton testnet address to test a token transfer…?

&rey: You can use arbitrary jetton, including you newly introduce via https://minter.ton.org/?testnet=true. (reply to 142342)

A: Ok thanks for the answer, I’ll test it

🇵🇸: is there any graphql service for accounts lookup based on their code hash?

&rey: There is https://dton.io/graphql. (reply to 142345)

🇵🇸: most of the time timeout error paid plans are expensive. (reply to 142347)

&rey: Well it IS a resource-intensive query, probably without an index attached. You'd have to download blockchain state and put it into your own database to do that faster. (reply to 142349)

🇵🇸: how to download? (reply to 142350)

🇵🇸: should i run a full node?

&rey: It's an option but I don't know how to load list of contracts from it easily. (reply to 142352)

Tom: You could optimize your query further. Read their docs (reply to 142349)

Hadi: I am a beginner in working with TON blockchain, and I would like to retrieve transaction details, including the Txid (hash), sender address, amount, contract address, as well as the transaction payload. Could you please guide me on what steps I need to take?

&rey: You literally have those judging by the screenshot, therefore you have to take no extra steps. (reply to 142358)

Hadi: Yes, that's correct, but I am unable to retrieve the token address and its amount! In fact, I can't decode the Message (reply to 142359)

&rey: Nothing hard: the token in each individual transaction is always, in 100% cases, called TON. (reply to 142360)

&rey: Jettons are constructs implemented by smart contract systems, and jetton transfers are chains of several transactions which happen to change those contracts' "jetton balance" (storage variables). Along with moving TON, of course.

Hadi: Does that mean I cannot retrieve the token information through the "getTransactions" method? (reply to 142363)

&rey: You want "traces" some APIs provide; please check out TonAPI. (reply to 142365)

Nikita👨‍💻: async function test() {              // Initialize the client         const client = new TonClient({             endpoint: '',             apiKey: ''         });          // Configure the wallet         const mnemonic ='';         const keyPair = await mnemonicToPrivateKey(mnemonic.split(" "));         const wallet = WalletContractV5R1.create({             publicKey: keyPair.publicKey,             workchain: 0         });          console.log(wallet.address);          }  I have a question regarding the operation of the ton blockchain.   in this code I get the address using the seed phrase and public key, for reasons unknown to me the address that I output to the console and check via tonorg has testnet and mainmet, I have not created a testnet address before.  question how does this happen?  how do I add it to tonkeeper?

best: when you generate an address from a seed phrase and public key, the same address exists on both mainnet and testnet because addresses are derived from the same cryptographic components regardless of the network. It's similar to how Ethereum addresses work - the same private key/public key pair will generate identical addresses on mainnet and testnet. (reply to 142386)

Nikita👨‍💻: how can i use test address if in tonekeeper test address is created based on main (reply to 142388)

&rey: Those just indicate all the ways one might refer to your account. (reply to 142386)

Hadi: I am using the TON blockchain! QuickNode (https://www.quicknode.com/docs/ton/) (reply to 142367)

Ted: You might want to have a look at the TON API on Tatum as well 👍 https://docs.tatum.io/reference/rpc-ton (reply to 142367)

Ted: Oh that was for you actually 🙂 (reply to 142358)

— 2025-02-19 —

Denis S: Hi, friends   We are looking one dev to complete our team for TON hackathon.  Please DM me if you interested.

Alchi: Hi this is ton smart contract developer with experience on full-stack development. (reply to 142421)

Hadi: not difference between them (reply to 142410)

Hadi: Now my problem is to be able to get the fu**ing jetton transactions from rpc !

Hadi: Or decode msg_data correctly !

&rey: Use tonapi.io/v2/accounts/{account_id}/jettons/{jetton_id}/history. (reply to 142429)

Erdan: i can't connect telegram-wallet  generated_url = await connector.connect(wallets_list[0])  bridge error ! ?

WhyesCode: @ton_help_bot (reply to 142435)

Morpheus || $SHIVA: I have an issue with something related to verification in my bot.  the form of verification is the user paying a fee and generating a random payload with the transaction, so we confirm by checking the users last transaction if it contains the payload generated for them.  now all transactions are showing suspicious on tonviewer, even the previous ones that wasn't, how do I fix it?

TON Bounty Bridge: ​Main  Created by saroukhani

Kevin: This isn’t a ton-network specific thing AFAIK, it’s just tonviewer using some auto-detection. You may have better luck asking their support (reply to 142447)

Silvio Oliviero🌿: hi all! everyone using the tonconnect-ui.min js script to connect a ton wallet using javascript?

Kevin: @pcrafter convo deleted?

Kevin: Why?

&rey: I have misunderstood it, others may have too.  Summary what actually was needed: intermediate contract forwarding TON (it'd be good to do so with any kind of asset but not really possible) upon any receipt to its admin. (reply to 142471)

S | Coder: Ohh, I can’t do it with ton and usdt? (reply to 142472)

&rey: TON is vastly easier: upon receiving any* internal message (recv_internal), send a message of value 0 mode 128 to admin address. (reply to 142474)

S | Coder: Ohh

&rey: *To pull out anything precious that will get to such contracts, you need ability to send custom messages; there will be no TON to handle an external. Check if message comes from admin address, and if so do whatever actions (set_c5) which are requested.

S | Coder: And one more question. How I can compile .fc and use it on js code? I try to use ton-community/func-js, but I got errors (reply to 142478)

&rey: Use toncli... or is that outdated... what errors, do you say? (reply to 142479)

S | Coder: One sec

S | Coder: I have this, is correct or not?

S | Coder: Oh, I fix that

S | Coder: This my code  #include "stdlib.fc";   const slice admin_address = "addrres"a;  () recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {     if (msg_value == 0) {         return ();     }      var cs = in_msg.begin_parse();     var flags = cs~load_uint(4);       int is_empty_body = (in_msg_body.slice_bits() == 0) *                         (in_msg_body.slice_refs() == 0);          if (is_empty_body) {         int reserve = 5000000;         int amount_to_send = msg_value - reserve;          send_raw_message(             begin_cell()                 .store_uint(0x10, 6)                 .store_slice(admin_address)                 .store_coins(amount_to_send)             .end_cell(),             3         );     } else {         var op = in_msg_body~load_uint(32);         if (op == 0x7362d09c) { ;; transfer_notification             var query_id = in_msg_body~load_uint(64);             var amount = in_msg_body~load_coins();             slice sender = in_msg_body~load_msg_addr();             var forward_payload = in_msg_body~load_ref();              send_raw_message(                 begin_cell()                     .store_uint(0x10, 6)                     .store_slice(admin_address)                     .store_coins(0)                     .store_uint(0x7362d09c, 32)                     .store_uint(query_id, 64)                     .store_coins(amount)                     .store_slice(sender)                     .store_ref(forward_payload)                 .end_cell(),                 3             );         }     } }  I deploy it to my address without errors. But when I sent money from another wallet I don’t get it to admin_address. What wrong?

— 2025-02-20 —

S | Coder: When I deployed this contract, I got bounce (reply to 142498)

Ti: hello! Could anyone explain why the 0Q addresses generated from the same mnemonic on TONHub and TONKeeper are different on the testnet, but when trying to transfer between them, an error pops up saying 'cannot transfer to your own account'?

S | Coder: Help me please!! (reply to 142498)

&rey: Please try to help yourself for the time being. (reply to 142521)

S | Coder: I try, I just don’t know what’s wrong with my code, here https://tonscan.org/tx/b08cd36d07f7e6b136a90bf90e7371f8d8377eb8d479837093e461ef4a80bc9a (reply to 142522)

Jaskirat: Hey guys, I am facing the failed to unpack account state while sending jetton using tonweb:    async transferJettonTokens({ toAddress, amount }: { toAddress: string; amount: string }): Promise<any> {     try {       if (!toAddress || typeof amount !== 'string') {         throw new Error('Invalid parameters provided.')       }        const walletAddress = await this.getTonAddress()       const userWalletAddress = new TonWeb.utils.Address(walletAddress)       const wallet = await this.getWallet()       const jettonMinter = new TonWeb.token.jetton.JettonMinter(this.tonweb.provider, {         address: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',       } as JettonMinterOptions)       const privateKey = await this.web3AuthService.getPrivateKey()       const keyPair = this.getKeyPairFromPrivateKey(privateKey)        const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(userWalletAddress)        const jettonWallet = new TonWeb.token.jetton.JettonWallet(this.tonweb.provider, {         address: jettonWalletAddress,       })        const transferParams = {         to: toAddress, // Recipient's address         amount: TonWeb.utils.toNano(amount), // Amount to transfer (in nanograms)         amountJetton: Number(amount) * 1e9,       }        const seqno = (await wallet.methods.seqno().call()) ?? 0        const comment = new Uint8Array([...new Uint8Array(4), ...new TextEncoder().encode('text comment')])        const amountJetton = (Number(amount) * 1e6).toString() ?? ''        const payload = await jettonWallet.createTransferBody({         toAddress: new TonWeb.utils.Address(transferParams.to),         tokenAmount: amountJetton,         forwardAmount: TonWeb.utils.toNano('0.00001'),         forwardPayload: comment,         responseAddress: userWalletAddress,       })        const result = await wallet.methods         .transfer({           secretKey: keyPair.secretKey,           toAddress: jettonWalletAddress,           amount: TonWeb.utils.toNano(amountJetton),           seqno,           payload,           sendMode: 3,         })         .send()        return result     } catch (error) {       console.error('Error transferring Jetton tokens:', error)       throw error // Re-throw to handle in the calling function if needed     }   } }

Jaskirat: It was working previously, but it stopped working after sometime not sure if something has changed since previous release

Jaskirat: It failed const result = await wallet.methods         .transfer({           secretKey: keyPair.secretKey,           toAddress: jettonWalletAddress,           amount: TonWeb.utils.toNano(amountJetton),           seqno,           payload,           sendMode: 3,         })         .send() here only

Vladimir: 📝 TON devs — we need your feedback!  Building on TON? Tell us what works (and what doesn’t) in a quick survey on:  • Developing on TON, tooling, programming languages (FunC, Tact, Tolk), TMAs, guides  Fill it out, drop your wallet & claim an exclusive reputation SBT!  Make your voice count.  (forwarded from Society Builders)

Kevin: This is not an NPS survey (reply to 142528)

𝚠𝚊𝚕𝚝𝚌𝚘𝚘𝚔𝚜: gm

𝚠𝚊𝚕𝚝𝚌𝚘𝚘𝚔𝚜: how long it takes for tonviewer to revalidate updated nft metadata?

🇵🇸: can anybody explain what is extra currency?

🇵🇸: is it alternative to jettons ? (reply to 142537)

Mr X | PLANT GAME 🌿 |: Hey guys I got one question for you, as I'm developing a Telegram mini app and is required a Ton wallet connection, however when I've tried on my ton wallet to search it on tonscan(.)org my official wallet is: EQDFONMPzOn2vaQtuhDc5DD-pvG_oIhFRGb0M_uDOvNLGSs3  But I've noticed the tonscan is reverting my wallet back into this one: UQDFONMPzOn2vaQtuhDc5DD-pvG_oIhFRGb0M_uDOvNLGXby  The founds in it are the same, so I'm wondering if I send some ton to the first wallet would it work correctly or I will lose the transaction?

&rey: Those addresses are same. (reply to 142542)

Mr X | PLANT GAME 🌿 |: Yep just wondering why on tonscan and tonviewer just change the address wallet automatically 😅 (reply to 142543)

Mikey: Ton has 5 diff format of wallets address   Raw Bounceable Non-Bounceable  Bounceable Urlsafe Non-Bounceable Urlsafe (reply to 142542)

Masa: hii I’m also looking for Ton community in ETH Denver.   Did you have any updates? (reply to 44336)

&rey: Blockchain works fine. Interfaces should too but who knows when they break. (reply to 142549)

Roma: Hi, how can i use multisig address for defi? (reply to 140414)

Павел: How can I deploy contract on chain? I want to make factory contract that will deploy other contracts

Павел: Btw what is a format of deploy message?

Kirill: Hello everyone, I would like to create a keypair generator for TON to derive new addresses from a mnemonic and an HD key. Is this possible for the TON network?

&rey: Message with StateInit attached. (reply to 142566)

BS: I want to send USDT to contract X (nonexist) and forward state_init of contract X at the same time. Is it possible to do? (Maybe using forwardPayload?)  Is there any example of this?

&rey: Unfortunately no well-known jettons support that. (reply to 142574)

— 2025-02-21 —

Jack: Hi, How to merge multiple transactions into one transaction, any useful information is appreciated

Shining: /stat@combot

Combot: Total messages:142590

TON Bounty Bridge: ​Adding new member  Created by djarjun4u

TON Bounty Bridge: ​Q  Created by cvcpolsla

tp: Hi, what's the popular way the get the contract's data. For one contrs I get use the getter method in contract, but what if I have thousand of contracts to get. In evm, we have "multicall" contract to get data in one request. Is that possible in TON? Or is there some scanner way to sync onchain data like thegraph?

Mr X | PLANT GAME 🌿 |: Hey guys do you know where these Icon and the sub-text is to make the change as you can see, we managed to connect our game on tonkeeper but we haven't notice anything to where to change the icon and the sub-text as the screenshot....

TON Bounty Bridge: ​Important Guidelines to help beginers improve Ton Ecosystems  🏷 Education  Summary:For starters, the system owners or authorities should map out simple steps to guide it's students to...  Created by MarykAnolue

Павел: Hey guys! I want to test my contracts in testnet.  Is anybody has some testnet TONs for me?

Виконт vangaard: @testgiver_ton_bot (reply to 142607)

&rey: In the tonconnect-manifest. (reply to 142604)

Mr X | PLANT GAME 🌿 |: Thanks 😍❤️ (reply to 142609)

Павел: 2 TONs per hour... (reply to 142608)

Виконт vangaard: Or send your testnet address (reply to 142611)

&rey: Request tonapi, all the contracts data will refer to the same block.  If you need to query more, use pytoniq while specifying the block to query everything at. (Don't forget you need masterchain, not shard, block identifier as it defines whole blockchain state). (reply to 142603)

Ghosthawk: how much you need 1 million? (reply to 142611)

&rey: Have you tested your contracts in @ton/sandbox? (reply to 142607)

Павел: Yes, now I want to test interactions with other contracts (reply to 142615)

Mr X | PLANT GAME 🌿 |: We did that but still no change on ton connect apps, do you know how long we need to wait for the change to be made? Also do you know if the .png file is allowed to use as iconapp? Or should be .ico? (reply to 142609)

&rey: 1. Users who want a new icon will need to reconnect obviously. 2. PNG. (reply to 142618)

&rey: Hmm... do you know that sandbox actually supports cross-contract interaction? Also: use RemoteBlockchainStorage to bring in real contracts. (reply to 142617)

Mr X | PLANT GAME 🌿 |: Ok thanks, I've try to reconnect still not working 😅 😢 (reply to 142619)

Mr X | PLANT GAME 🌿 |: Yes it's working on wallet but not on tonkeeper...any idea?

TON Bounty Bridge: ​developer tools for Chromebook  🏷 Education  Summary:i have been getting to get developing started for a career change and i have a chrome book and turns...  Created by Fupostman

Павел: My contract needs to know its Jetton Wallet address to increase its balance upon a jetton top-up.  I see two possible approaches:  1) Construct the contract and retrieve its Jetton Wallet address online from Master's get_wallet_address, then build it, set the jetton address, and finally create a jetton transfer. The issue here is that the user would need to execute three separate transactions (deploy, set the jetton address, top-up), waiting for each of them to complete. However, this approach ensures robust compatibility with any jetton.  2) Alternatively, the contract could extract the jetton address from the master address/code within its logic. However, it seems there might be issues due to variations in jetton implementations (see the attached screenshot from the TON docs). Is this a real concern, or are the differences between tokens minor enough to make implementation straightforward?

&rey: For jettons, these are three main approaches:  1.  The contract calculates [its jetton-wallet]. You need: two cells (the token master's code and data) plus its address, RUNVM support. This works synchronously. 2.  The jetton master does. You need: the jetton master's address, TEP-89 support, and a couple of messages back and forth. Keep in mind that the contract won't know its wallet for a while. 3.  The deployer does. You need: space for one address in the deploy message. Important: you can't let just anyone specify this address, or there'll be a race condition with scammers. (reply to 142627)

tp: Thanks, so if I use tonapi, I can call multiple contract's get method in one request, right? And for the pytoniq, It's a public service, or I should run my own node? (reply to 142613)

Павел: I need to support all jettons from StonFi. I know jetton before deploy and my contract will have only one jetton wallet, but it can be any jetton on TON. So I'm afraid of issues with different jetton implementations... Is it real problem? (reply to 142628)

Павел: See screenshot

tp: I think if you wan to use jettonWallet in contract, you should pass the jettonWallet to the contract when constructor. (reply to 142630)

Павел: It will change the state and address of contract (and as a result the contract's jetton wallet address) (reply to 142632)

Павел: Recursion...

tp: yes, I said it wrong, not constructor, but an init method with permission control (reply to 142633)

&rey: pytoniq is Python library connecting via liteservers — either public ones or custom, you can specify. (reply to 142629)

&rey: 1) and 3) will work. (reply to 142630)

tp: Is there public liteservers or I should run myself? (reply to 142636)

&rey: There are. (reply to 142638)

Павел: Are you proposing to recreate the output of the get method of the master inside smartcontract? Not getting the wallet address by wallet code/data? (reply to 142628)

&rey: Yes. (reply to 142640)

Павел: May be you have code implementations of this idea? (reply to 142641)

&rey: https://gist.github.com/ProgramCrafter/53fc3a4846397ee5f3f3b25ca3356ab5. (reply to 142642)

Павел: In addition to the wallet address of my contract, in the current implementation I store the wallet addresses of other contracts that are known in advance. Do you think I can get some benefits if I know the addresses of contracts and get wallet addresses using this function? Maybe less commissions for storage? (reply to 142643)

&rey: Jetton wallets of other contracts seem useless; you don't interact with them, after all. (reply to 142648)

Павел: I use them to make my own (contract's) transfers (reply to 142650)

Павел: In transfer.destination

&rey: No-no-no, that's an error! You have to use common contract address there. (reply to 142651)

Павел: Aaa, thx. Will fix it. (reply to 142653)

GAMER 👾: hello developer  i am having error with setting up the tonconnect SDK, when i try to connect to telegram, getting the app manifest error and this is my manifest json setup:  {     "url": "https://alphai-miniapp.vercel.app/",     "name": "Alpha Agent",     "iconUrl": "https://ibb.co/Y4328ct2"   }     please where am i having the errrors

&rey: The icon URL does not point to image. (reply to 142656)

GAMER 👾: what is the right ipfs platform to host the image please? (reply to 142657)

Mr X | PLANT GAME 🌿 |: We had the same issue, or you can host the image on the vps or just use a image redirect and not the link like that (reply to 142660)

GAMER 👾: alright thank you, would check vps and update (reply to 142661)

Mr X | PLANT GAME 🌿 |: It took 5 mins more or less to appear on the tonkeeper to refresh after disconnect and reconnect the wallet, on wallet in telegram is straightforward (reply to 142664)

GAMER 👾: alright, thanks (reply to 142666)

&rey: Why? Just fix the link so that it points to image, not to wrapper page. (reply to 142660)

GAMER 👾: alright, let me see to that 👍🏽 (reply to 142669)

High/or: Hello

High/or: any idea why -dton.magic.org dont works with all TON sites ?

High/or: Most of my TON sites works well on http with -dton-.magic.org   but have one that is not working with

High/or: i mean foundation.ton can be open like this foundation-dton.magic.org

High/or: well foundation not works too

High/or: well when i click on foundation.ton which is the official TON site of TF   translate :  This site has been reported as insecure Hosted by foundation-dton.magic.org Microsoft recommends you leave this site. It has been reported to Microsoft as containing phishing threats that could steal your personal or financial information.

High/or: first ton.run stopped working then now -dton.magic.org which is the bridge that telegram use to display TON sites within telegram  sry for fl00d

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: Hi does anyone know how developer of Tonnel bot made system that detects when on their channel or giftrelayer was sent new gift?

Kevin: Probably telegram userbot with mtproto (reply to 142698)

— 2025-02-22 —

Еqf: Can i generate ton wallets locally (v4r2 format) without using third-party apis (ton api)  and then use them as usual wallet ( which anyone can create in tonkeeper or somewhere else ) ? Or i anyway will have to create and deploy smart contract to mainnet?

&rey: Um... 1. Anyone creates TON wallets locally, API is useless for that. Mnemonic is that secret so it MUST NOT leave the device except for safekeeping. 2. Yes wallets created in different ways are usable the same. Yes the blockchain will not know anything except address and balance. 3. any [unbounceable] incoming transfer will set up the record that there is nonzero balance. Deploying has to be done to send messages out (and is usually done automatically). (reply to 142711)

High/or: update if it interested someone :   so idk about foundation, but about my TON sites i realized only DNS with a "-" inside dont works with -dton.magic.org as http bridge.    i used the same config of my wesbiste not working and just change to a different dns without "-" inside and it works well  bug or feature ? (reply to 142694)

High/or: so e.g : my-website -dton.magic.org will not work   but mywebsite -dton.magic.org will works (reply to 142713)

High/or: #suggestion   the ability to add a tonsite://yourwebsite.ton link for mini-apps in BotFather  actually https is required  Telegram announced recently the TON blockchain's exclusivity for mini-apps   it makes sense to allow tonsite://website.ton as mini-app links

High/or: should be the same about the manifest for TON connect  it should be possible to host it on TON sites (reply to 142715)

&rey: That's not for this chat. (reply to 142715)

High/or: sorry i posted in case it attracts the attention of TON devs / TF  also post it on Telegram Beta group (reply to 142717)

TON Bounty Bridge: ​An app for creating online events and paid tickets for them  🏷 Developer Tool  Summary:The Ecosystem Lacks a Simple SBT Minting App for Online Events  Created by barillax-crypto

Potok: Hi, can you tell me if there is a source code for a bot with authorization through a transaction?

&rey: Nothing well-known, but why? (reply to 142727)

Green: maybe you can develop it. (reply to 142727)

Green: delete this message, bro (reply to 142735)

Green: if not, admin will block you

&rey: Most probably you used a ticker of some well-known jetton listed in Tonkeeper's repository. Actually they have exclusive authority over what is labeled what on Tonviewer so this chat is not the right place. (reply to 142735)

&rey: Goodbye! (reply to 142737)

Павел: Hi! When I call calc_my_jetton_wallet I have 103289 as output (in ~dump). What I'm doing wrong? (reply to 142643)

Павел: I'm not 100% sure that my params of master code and data is correct, but maybe you have first thoughts?

&rey: vmLogs or retracer would be useful. (reply to 142741)

Павел: Hm... Now I changed jettons and have exit code 9 (Cell underflow) inside vm::invoke_get_addr... And I don't understand code inside it...

Павел: I'm getting code and data from get_jetton_data (jetton_content -> data, jetton_wallet_code -> code)

Павел: But... Is it master code and data?? Or jetton wallet data...

Randolph: have any good people help me ? why my function need contract provider param . i don't know how to provide it ?

&rey: Master's code, data and address. (reply to 142747)

Павел: Its a naming problem (reply to 142748)

&rey: You just get master's state, no need to call any get-methods: contract will handle everything itself.

Павел: try sendSet... (reply to 142748)

Randolph: oh my god ! it work . thank you very much . this question cost me few days (reply to 142752)

Павел: No logs from VM... Just a 9 exitcode. (reply to 142744)

yuichi: I would like to confirm that the transaction I submitted has been successfully completed. What items in the transaction can I look at to determine if it ended normally or in error? The types of transactions I want to check are swap and token remittance.

&rey: blockchain.setLogLevel({vmLogs: true}) set? (reply to 142754)

Павел: I dont have this method in Blockchain from sandbox (reply to 142756)

Павел: execute CTOS     handling exception code 9: failed to load library cell     default exception handler, terminating vm with exit code 9 (reply to 142756)

Nikita👨‍💻: Hello everyone. I'm currently trying to set a price for nft using the getgems smart contract. Maybe someone has a ready-made request body, but now I'm getting an error.?

&rey: Should work fine in mainnet. Am I right you're trying to handle USDT? (reply to 142759)

Павел: + (reply to 142761)

Павел: If I switch addresses from USDT/TON (Proxy Ton) its working as expected... But I need stablecoins too...

&rey: You have to bring USDT's lib into sandbox. Its README had something on how to do it.

Павел: Btw in mainnet stablecoins will work? (reply to 142765)

Bus: Hi, is it now possible to set up a smart contract that can serve a small TON HTML site directly from the blockchain? If not, is there an estimated time for it to arrive?

Kevin: https://blog.ton.org/ton-storage  U can serve files from here (reply to 142777)

Bus: With this solution it is not stored on chain. I wish to store the website on blockchain so it stays there forever.. (reply to 142778)

A: Hi I requested tonkeeper to verify my coin. How long they reply?

Kevin: I see. Is this possible on other chains? (reply to 142782)

TON Bounty Bridge: ​Was ist das?  Created by Bonito82

Bus: Not fully sure but there is for example Swarm on Ethereum and AR.IO (reply to 142790)

— 2025-02-23 —

&rey: No such standard exists yet but please try to introduce a concept. (reply to 142777)

Adam: Howdy all 👋  I've been building a TON mini-app that is an NFT farming game.  I come from an EVM/solidity background and curious what the recommended language + standard is for NFTs on TON?  I've seen multiple programming languages + tens of different implementations. Is there a recommended or standard approach to building and deploying NFT smart contracts?

yuichi: Hello everyone. Could you answer this question. (reply to 142755)

&rey: Those are transaction trees. So do you want an easy correct way or way by definition? (reply to 142755)

yuichi: I would like to know the easy and correct way. (reply to 142807)

yuichi: For example, Tonviewer shows “Confirmed transaction” and transaction processing is successful. How can I know this in the code

&rey: Call tonapi and check if trace is indicated as "in progress". You most care about value flow – that is, how owned amounts changed. (reply to 142809)

soltan: Hello, is there a real bot for mining the ton coin?

&rey: Mining ended a few years ago. (reply to 142814)

&rey: For your information, "mining" means "testing a real lot of numbers with your hardware, and the ones which fit some hard condition are eligible to get you money". It cannot even be done via bot with any efficiency. (reply to 142814)

Mr.AiKen: I have difficulty downloading FunC on my windows.I've already used Bin from the GitHub repository, I've already used wsl and docker And everything is wrong, how do I solve this?

&rey: Have you installed OpenSSL 1.1.1? (reply to 142827)

Mr.AiKen: I installed before docker (reply to 142828)

&rey: And what "everything" is wrong? Do func.exe -V, fift.exe -V work in the directory where you've downloaded the files? (reply to 142829)

Mr.AiKen: I think the problem is with my computer . Can you send the link to your GitHub repository?To settle down from there.I can't create the FunC .exe (reply to 142830)

&rey: Here you are: https://github.com/ton-blockchain/ton/releases/tag/v2025.02. (reply to 142832)

Mr.AiKen: Thank you, I will remember you 😭 (reply to 142833)

Ad: Hi, i am trying to use Ton-connect with TonKeeper. my app opens bridge channel, and make qr code of univrrsal link. Wallet replies through bridge an error "CLEARTEXT NOT PERMITTED". but how can i encrypt, if i dont know the recipient? that makes no sense. amAny idea what i am doing wrong?

&rey: Have you tried, y'know, looking at actual TON Connect SDK? (reply to 142851)

Ad: i have read several docs, they are all pretty bad. ChatGpt is even worse. The one i am looking at now is github ton-blockchain/ton-connect repo...

know: try open-deep-research, it’s pretty good at web crawling for answers and it compares and contrasts the info that it finds (reply to 142853)

know: also 100% agree; the documentation is extensive but it’s also all over the place, some things are up to date and others are obsolete by years

know: Is it possible to apply for a grant to fix All of the documentation?

Ad: do you have a pointer to some up-to-date docs? (reply to 142852)

&rey: I guess it is but you should try demonstrating competence on a select part. (reply to 142856)

&rey: If you're fine with using SDK itself, these ARE up-to-date: https://docs.ton.org/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk. If not, you'll have to read source code (https://github.com/ton-connect/sdk) and core ideas in adjacent repositories. (reply to 142857)

Ad: those are the doc pages i am reading. thanks. (in the meantime, i figured that TonKeeper wants a https manifest url, http is not accepted. (reply to 142859)

Vasyl: tonkeepeer doesnt open mini app after transaction, apparently only on iphone, i recall it did before, is there a fix?

&rey: Yes; to use something other than iPhone. It was Apple's changes preventing this behavior. (reply to 142862)

Gyorgy: Recently? Not noticed, it works fine with our app (reply to 142863)

Gyorgy: It has its flaws, If twaReturnUrl set well should work. As long as well implemented. Can be issue if moving pages, or telegram js not included in headers.

Gyorgy: @pcrafter Seeing you in this group helping for a year now, amazing what you do.

Adam: Just checking if anyone had some recommendations on this 🙏 there’s a lot of choices (reply to 142805)

Daivd: Check this. (reply to 142878)

Mr.travellerr: write in English (reply to 142881)

Lo: /stat@combot

Combot: Total messages:142888

— 2025-02-24 —

Vladimir: He is a spammer. (reply to 142916)

TKAINU: Hello, i receive err: Retry limit reached: Unable to execute get method. Got exit_code: -13 Help me

tp: Hi, is there any documents about message processing sequence rules? If I have a contract "C", which will send message "M" to other contract when receive message. There are two user "user1" and "user2". First, "user1" send message to contract "C" and generate a "message1", then "user2" send message to contract "C" and generate a "message2", Whether "message1" and "message2" will be processed in order?

KBA07: I tried send ton from my tonkeeper wallet to and external wallet. I see the transaction on tonviewer workchain but i don’t see the transaction on tonscan at all. Further, I don’t see any recent blocks or transactions being processed on master chain. Is there any maintenance/upgrade or configurational changes done on ton testnet which i am not aware of ?

KBA07: @here There are no new blocks being processed on the masterchain of Ton testnet. Are there any issues/thread which tracks the progress of this issue?

&rey: *no shown on Tonscan, you presumably mean (reply to 142950)

KBA07: @pcrafter  Are there any other scanner besides testnet.tonscan where i can see that new blocks are being produced on the masterchain.

&rey: Testnet tonviewer, of course. (reply to 142952)

Wiz Haze: can any one help me out . i am creating a ido on ton with tact . now when i send tokens to contract . it is not getting transfered

KBA07: @pcrafter  Thanks for pointing it out. Can we rely it on more than testnet.tonscan ?

&rey: And what is getting done instead? (reply to 142955)

TKAINU: when i call runMethod, i receive error: Request failed with status code 405 please help me

Павел: Have you read "Messages and Transactions" on "docs ton org"? (Cannot send link because of spam protection) (reply to 142942)

&rey: They won't. Actually, there isn't a single total order which would even allow to say "user1 sent message earlier than user2". (reply to 142942)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 42  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

mort- x: Hello guys

mort- x: [warning] 24.02.2025, 10:25:20.667 (UTC)  <MainThread>  The config file is broken self.local.db: {'config': {'logLevel': 'info', 'isLimitLogFile': True, 'isDeleteOldLogFile': False, 'isIgnorLogWarning': False, 'isStartOnlyOneProcess': True, 'memoryUsinglimit': 50, 'isLocaldbSaving': False, 'isWritingLogFile': True}, 'validatorConsole': {'appPath': '/usr/bin/ton/validator-engine-console/validator-engine-console', 'privKeyPath': '/var/ton-work/keys/client', 'pubKeyPath': '/var/ton-work/keys/server.pub', 'addr': '127.0.0.1:30011'}, 'modes': {}, 'saveOffers': {}} [info]    24.02.2025, 10:25:20.667 (UTC)  <MainThread>  Restoring the configuration file [error]   24.02.2025, 10:25:21.669 (UTC)  <MainThread>  load_db error: read_db error: maximum recursion depth exceeded [warning] 24.02.2025, 10:25:21.670 (UTC)  <MainThread>  The config file is broken self.local.db: {'config': {'logLevel': 'info', 'isLimitLogFile': True, 'isDeleteOldLogFile': False, 'isIgnorLogWarning': False, 'isStartOnlyOneProcess': True, 'memoryUsinglimit': 50, 'isLocaldbSaving': False, 'isWritingLogFile': True}, 'validatorConsole': {'appPath': '/usr/bin/ton/validator-engine-console/validator-engine-console', 'privKeyPath': '/var/ton-work/keys/client', 'pubKeyPath': '/var/ton-work/keys/server.pub', 'addr': '127.0.0.1:30011'}, 'modes': {}, 'saveOffers': {}} [info]    24.02.2025, 10:25:21.670 (UTC)  <MainThread>  Restoring the configuration file

mort- x: Please I get maximum recursion depth exceeded when I try to run mytconcrtl

mort- x: I also get this   Broken config file error (reply to 142988)

Terry: hi, just wondering, is it more recommended to learn Tolk or Tact for new developers?

MD ASIF: Why i am not getting TonWeb.HighloadWallets this instance from tonWeb sdk my tonWeb version is '0.0.66'  there is example shown in the github/toncenter/examples/blob/main/withdrawals-highload-batch.js

Павел: My contract has its own jetton wallet. When the wallet is topped up, it receives a notification and updates its balance.  Can I deploy my contract and make a jetton transfer to it in a single transaction (for user convenience) without losing the top-up? Because if the transfer happens before the deployment, my contract will miss it and won’t update its balance...  Or am I wrong?

&rey: No, such synchronization is not possible. (reply to 142999)

BroccoliFart: I am trying to build an api

BroccoliFart: I can give whitepaper  I am not a dev 😥😥sadly I wish I can work with dev for equity

Павел: Tokens/Jettons has different basic units (TON has 10^9 (nanoTons), USDT has 10^6...). Where can I get them all?

Павел: To view on frontend (reply to 143004)

&rey: For any specific jetton, load its metadata and check out if 'decimals' field is filled. (reply to 143004)

Vanshika: Hi, were you able to create the nominator pool? I want to know how we can provide a description to our pool which would be visible to the public/nominators (reply to 98492)

SU ~: Hi, What features should my site have so that I can display it as a mini app on Telegram?

Alfred🖤: i want to use Tonconnect in my web app and add a feature for users that they can buy items with ton  so i need to send transaction with Tonconnect  now im confused how can i handle the paymentin backend after sending transaction with Tonconnect  i searched for sample code i found some codes that they used ton console api but it has limits  i want something unlimited

Павел: Nothing Any site can be viewed as TMA But with TMA your users can come from TG with hidden authorization  But I think you need another chat) This chat is about TON blockchain (reply to 143009)

Vanshika: can anyone else help me on this? (reply to 143008)

&rey: Generally, absence of leading towards other blockchains. (reply to 143009)

Tony: Hello, we have exactly the same need. Someone have a solution for this? (reply to 143013)

Whyte: Hi there i've got one question for you,  i'm actually trying to create a TMA with a shop. I want to allow users to easily pay with TON (once their wallet is connected) In order to receive the payment, and use ton proof payment, to setup an account on :  ? Or I can simply setup a destination wallet adress ?  How things are working ?  thanks in advance for your responses.  Because on WALLET PAY i'm getting some restrictions, due to FRANCE location ... :/

TON Bounty Bridge: ​Ozbaytar  Created by ozbaytar

&rey: Just use github.com/gobicycle/bicycle, it is TON-based and accepts payments in decentralized way (processing is on your backend though). (reply to 143030)

&rey: You should do the same ^ (reply to 143013)

— 2025-02-25 —

Vanshika: I looked into the documentation but didn't find any way how we can add the description to the nominator pool but when I checked tonvalidators.org, there some pools have description added to them can someone please let me know how we can add it (reply to 143016)

Howie: Anyone know the chat for game devs to get help in launching?

Makis: Hey everyone! I am trying to find the start of a message sequence and then track it until the end (to get the complete tx tree). I am using tryLocateTx but its not detecting this testnet transaction (https://testnet.tonviewer.com/transaction/d0e58797a0932aaf2742f72d9c62542ebb98089ddeb2fb27345a3b330b4217c8) Am I doing something wrong? I am using https://testnet.toncenter.com/api/v2/#/ for the api.

&rey: It doesn't. (reply to 143057)

Timur: Tonkeeper doesn't want to back my mini app after signing external message, i use iphone, it's okay? I just remember that, several months ago it works good! Can i fix this somehow?  Ton Space by @wallet it works good  I use tonconnect/ui and my config like this:  new TonConnectUI({ actionsConfiguration: {     twaReturnUrl: 'https://t.me/my_bot',     returnStrategy: 'back',    }, })  https://t.me/tondev_eng/142866 🤔

&rey: I'd like to reiterate it is not on topic for this chat. (reply to 143079)

Timur: oops, i got you (reply to 143080)

bulul: Hello friends! I started designing a system for a potential high-load web3 game and I needed advice and working practices. Which DBMS is better to use for storage/what DBMS do you use?

WhyesCode: Does your game mechanics require complex transactions and relationships? (reply to 143093)

KarnageKane: Is TON EVM compatible?

WhyesCode: No (reply to 143098)

🛍️: Any tool I can use to deploy a smart contract on TON testnet with a few clicks ?  I need this help please 🙏.

bulul: Relationships, but complex transaction - idk(i dont understand 😂) For example tap to earn games: notcoin, catizen, hamster… (reply to 143097)

WhyesCode: Ton sandbox (reply to 143100)

KarnageKane: working off of another game the game is a database in space.

WhyesCode: You need to use an IPFS (reply to 143101)

bulul: Thx, I'll see what it is))) (reply to 143109)

best: I think Postgresql + Redis will be good option for you. structured storage + real time caching

bulul: Ah, what you think about a horizontal scaling of Postgres? (reply to 143111)

WhyesCode: Bro, he needs decentralized storage solution for storing assets in a distributed manner. (reply to 143111)

bulul: Btw, at what stage should ton contracts be implemented in my case? (Sorry guys I came to you from Java))) (reply to 143109)

bulul: And will it be necessary at all? (reply to 143114)

WhyesCode: What stage is your game at? (reply to 143114)

bulul: Idea (reply to 143116)

&rey: You won't know before architecture stage. (reply to 143114)

bulul: Thx for answers!

&rey: Good latency from Tonviewer caches might happen to be more important, depending on usage patterns. (reply to 143113)

WhyesCode: That's a great point you brought out. (reply to 143123)

best: postgresql is not good for horizontal scaling. but there are solutions. I just saw your message. I was eating something, lol (reply to 143112)

— 2025-02-26 —

FREEZZZZ: what indicator if the transaction is success while using /api/v3/transactions?

bulul: Still, ipfs is used in applications such as catizen (accounting for taps, for example) or is this just a suggestion for use. I read that IPFS is quite buggy and can be slow. (reply to 143109)

bulul: What are you talking about? (reply to 143123)

Vanshika: @pcrafter can you please help in this? (reply to 143047)

Basil: Hello i have error when using ton wallet with next js   "TypeError: Cannot read properties of undefined (reading 'ReactCurrentDispatcher')" how can i solve it.

Daivd: Can you share your code? (reply to 143155)

WhyesCode: Try adding ssr: false when dynamically importing the TON Wallet component in Next.js to ensure it's only rendered client-side. This should resolve the error. (reply to 143155)

Basil: Okay let me do that. (reply to 143161)

Basil: this is correct (reply to 143161)

Еqf: Im trying to generate v4r2 wallets for tonkeeper, myTonWallet etc. They should be compatible with most of ecosystem products, the problem i have is when wallet generated - i get wrong format (not sure what it is) and i cant add it to tonkeer or smth (incorrect phrase)  can anyone explain me what im doing wrong ?

Еqf: i can send code if needed too ( im using web assembly + rust )  dont ask me why i do it in this horrible way

Basil: Not working same error. (reply to 143161)

Еqf: it looks kinda like it, any advices would be appreciated (reply to 143168)

&rey: Wt* is Mnemonic::from_entropy_in? TON doesn't have such conversion. (reply to 143170)

Еqf: i saw it in this lib (reply to 143171)

Еqf: or im stupid and its doing other thing

Еqf: ok seems like its backwards

Еqf: am I thinking in the right direction?

&rey: You can just translate the JS code into Rust and it will work then.

Еqf: i mean its too much code

Еqf: the only working script i found on js used at least 2 massive libs

Еqf: ok, maybe not that massive, but I can't put the whole puzzle together and figure out what and how I should rewrite -_-

Еqf: i guess i have to search for all used crypto libraries and use rust analog libs

Еqf: and if they doesnt exist or working not as expected i will have to rewrite something or fuck around

Еqf: gg

&rey: 3 files are? (reply to 143177)

Еqf: i mean considering if all needed libs will be working fine and i wont have to rewrite my own implementation it would be fine

Еqf: maybe whole script  will fit in about 1k - 2k lines

Еqf: but anyways its not just copy paste my brain is melting

Nikita👨‍💻: I am a beginner programmer currently writing a smart contract for ton. i need help. i can't list my nft on getGems, what could be the problem? Maybe someone has an example of ready-made code?

Еqf: provide more details at least (reply to 143187)

&rey: Certain things may be helpful in doing a rewrite if you copy original code in (however it's safe to assume LLMs know nothing about TON). (reply to 143186)

Еqf: actually they now a bit (reply to 143189)

Еqf: considering my near zero knowledge in rust it will take some time, and  i hope it will be working faster that 1 threaded js, otherwise everything is in vain

&rey: Vanity? Generating custom mnemonics for a special address prefix? (reply to 143192)

Еqf: and webAssembly don't bother you at all yeah? (reply to 143193)

Еqf: there a few scripts for gpu but they doing some bs

Еqf: like not 0 workchain or smth

&rey: Generally, you're almost there. (reply to 143192)

&rey: 1,2 steps are incorrect. Loop through mnemonic candidates (random 24-word combinations) until it isBasicSeed. (reply to 143170)

Еqf: thanks for your optimism 😃 (reply to 143197)

Basil: Worked with Next 14 .. 15 is the issue  . (reply to 143155)

Hrach: Interesting...any Github issue link on this?   Was thinking to migrate to 15 lately (reply to 143201)

&rey: you should really do GPU acceleration since those crypto.subtle functions call upon browser intrinsics (reply to 143192)

Еqf: its will be to hard to write all from scratch something on cuda or wsgl or smth (reply to 143205)

Еqf: for me definitely

Basil: Yeah there is an issues .. (reply to 143203)

Basil: Please don't ... (reply to 143203)

Еqf: 😴😭

Еqf: @pcrafter can u remind me pls what tag should be used here? lost info about it in depth of docs

&rey: 0x51, workchain ID, SHA-256 of StateInit, CRC16-CCITT of everything prior. (reply to 143214)

Alfred🖤: I have never worked with Tonconnect before and have no idea how to do it. Is there anyone who can help me get it done? Or someone who can take care of this part of the project for me, and I’ll pay for it? (reply to 143038)

WhyesCode: You can hire me (reply to 143216)

𝓢𝓽𝓮𝓵𝓵𝓪: Can I help you? (reply to 143216)

Еqf: is that right code for v4r2 contract?  B5EE9C724101010100620000C0FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED543FBE6EE0

Еqf: do i need it at all ?

Павел: How can I eval address from contract's code and data cells?

&rey: workchain: arbitrarily chosen from {0: base, -1: master, thousand times more expensive} (init code, init data) —> StateInit —> StateInit hash = hash part of address (reply to 143221)

Павел: If I made like this (python)? There is a problem in hash, cause its type is bytes, but chatgpt suggested to convert in hex. Is it correct?  state_init = (     begin_cell()     .store_ref(self.code_cell)     .store_ref(data_cell)     .end_cell() ) address = Address(     f"{self.masterchain}:{state_init.hash.hex()}" ) (reply to 143222)

&rey: Some bits are missing, namely .store_uint(0b00110, 5). (reply to 143223)

Павел: Added them. What about converting hash bytes to hex? Zero trust to ChatGPT (reply to 143224)

&rey: Hash bytes to hex? Correct. As for choosing masterchain instead of basechain (0), that'd spend your money on nothing. (reply to 143225)

Павел: I will set basechain) (reply to 143226)

bulul: Hey guys, what do you think about IPFS performance? What is the bandwidth?

&rey: I guess no collection author had problems with it. (reply to 143230)

bulul: =) ok, bro) (reply to 143231)

Еqf: does it look better?

Еqf: ive managed to generate some fked mnemonics and addresses that works nowhere except my dreams

&rey: generate_mnemonic remains invalid. (reply to 143237)

&rey: also, I'm not quite sure if you serialized all the bits in StateInit

&rey: Please check against https://github.com/xssnick/tonutils-go/blob/master/example/vanity_fast/main.go.

— 2025-02-27 —

crypto: How should I solve this problem

TON Bounty Bridge: ​Ton code  Created by maksi2224

WhyesCode: What is the issue? (reply to 143259)

- Макс: Error: contracts\nft_item\nft_item.tact:58:17: Incompatible types "Address" and "<null>" for binary operator "!=" Line 58, col 17:   57 |             msgValue = msgValue - ctx.readForwardFee(); > 58 |             if (msg.response_destination != null) {                        ^~~~~~~~   59 |                 send(SendParameters{   what is problem?

Mark: Gm Gm everyone

Mark: I want to ask, is there any getgems package, that can checks for NFT sale or transfer or nft history?

&rey: Use Address? in message structure. (reply to 143278)

crypto: const client = new Tonclient({endpoint:"https://testnet.toncenter.com/api/v2/jsonRPC" }); const contractAddress = Address.parse("EQBadTFGHcofHnEiurYsb12Wj8Q5ZEdvs-H_NzIm8L0-4PsD"); const userAddress =Address.parse("EQDaESRC3ynZT4DnNsxLpNvH_Lry7j_T6RKBFKBp5WucSzrr"); const addresscell=beginCell().storeAddress(userAddress).endcell()// Call get method const result = await client.runMethod( contractAddress, 'getCurrentClickTimes',[addressCell]

crypto: error: Error: Unsupported stack item type: -1

FREEZZZZ: what indicator if the transaction is success while using /api/v3/transactions?

&rey: What do you consider a transaction[ tree] failure? (reply to 143305)

FREEZZZZ: Yes, how to know a transaction (Transfer TON) fails (transaction tree) or Is there a specific endpoint to check whether the entire transaction was successful or not? (reply to 143307)

&rey: Well, let's start with the fact that TON transfer is chain of two transactions, one on source contract and one on destination. (reply to 143309)

FREEZZZZ: Ok, I have done a fetch between the sender and the recipient. What should I do next, to find out if the transaction between the sender and the recipient was successful? btw thank you for your help (reply to 143310)

FREEZZZZ: Is there a standard procedure / good procedure to implement whether the transaction is successful between the sender and recipient?

&rey: I'm trying to find out your definition of "successful" first. Blockchain doesn't quite offer it. (reply to 143312)

FREEZZZZ: The meaning of this success is, when we send a token to the recipient, the token sent from the sender has arrived at the recipient. How to know the token has been sent to the recipient (reply to 143313)

&rey: The easiest way is to check Tonapi's traces, that in-progress is false and value flow indicates recipient getting their tokens. (reply to 143314)

FREEZZZZ: Okay, I will do the test. Thanks for your answer and help 😊 (reply to 143315)

uchebnick: hello everyone, What determines the cost of creating a cell in a blockchain more, the restructuring of the Merkle tree or the mere storage of data?

High/or: How to claim an expired DNS ? 👀   Had a very good DNS on a wallet 1 year ago , but i deleted my wallet like a retard   Now its expired, can i claim it ?

High/or: Well, i just find out, i need to run a new auction via fragment (reply to 143321)

Mr: Good evening  I have a project I’m building and I want to integrate telegram stars as payment method   But I can’t find telegram stars as payment method in the bot settings

Mr: Please anyone has an idea how to go about ?

&rey: The first thing should be to get to the right chat. @devs, IIRC. (reply to 143333)

Mr: Thank you (reply to 143335)

— 2025-02-28 —

匿名的 👮🏻: /stat@combot

Combot: Total messages:143348

safal: Hello everyone, Is there a way to recover TON from a smart contract that fails on all transactions? I was developing a contract using tact and now because of some upgrade I made on the contract I’m unable to interact with it as all the  transactions are failing with an issue. As a result, my funds are stuck on the contract and I cannot perform "withdraw safe" as well. Any guidance on possible recovery methods would be greatly appreciated.

&rey: Not possible if it truly fails on all messages. Smart contract is the only one having control over its balance. (reply to 143353)

Patrick: hello friends. i got a question for you: i wanna use Tonconnect in my WebApp  as you know after sending a transaction with Tonconnect we get transaction's boc  now i wanna check transaction in the backend  but i have no idea how can i find the transaction and check it with toncenter api i searched about my question in this group and i got some details but i didn't understand what should i do

&rey: Hmm... why do you even want to receive something from client? User might repeat payment through their wallet app manually. (reply to 143371)

Patrick: the web app is kind of store  i have to check payment was successful or not (reply to 143372)

sna1l1: Hello everyone, I am a LazyCoin Dev and I need a help with smart contract code and client-side a little bit (contract in func and client-side is in react). I want to deploy and Interact with my smart contract on the client side. If you can help me for a certain pay - dm me.

&rey: Generally, you should listen to anything incoming to your store's wallet, to catch any incoming transfers where frontend has disconnected (certain platforms have that).  or to catch those done without frontend help at all, such as just coming through blockchain.  An appropriate way to credit those would be: 1. If transfer contains specific deposit / valid account ID, credit there. If not, 2. If the source wallet is TON-Connected to a certain user, credit to them. If not, 3. If there was a previous deposit, credit to the same destination. Otherwise, 4. Create a new entry indicating that some address sent you money without setting the recipient; get ready for manual handling. (reply to 143373)

Patrick: The question now is: how can I listen to all incoming transactions?  I saw your message where you introduced Bicycle, but I couldn’t find any documentation to help me configure and run it.  Also, it requires a LiteServer. I searched about it, and it seems that running our own LiteServer requires a high-performance server, which is very expensive. (reply to 143375)

Aleks: Go through the docs and the tma-usdt-payments-demo github repo. All your answers are in there  https://docs.ton.org/v3/guidelines/ton-connect/frameworks/react#sending-transactions  https://docs.ton.org/v3/guidelines/dapps/asset-processing/payments-processing/#send-payments  https://github.com/ton-community/tma-usdt-payments-demo (reply to 143377)

Combot: Combot has warned Basil _01 (1/3) Reason: Word **** is not allowed

WhyesCode: What is the issue? (reply to 143374)

FREEZZZZ: @pcrafter thanks for your help before, i already implemented traces and it successfully. But for now, how to know the transfer is Fail (The Token Fail to transfer to Destination Address)? (reply to 143316)

&rey: The easiest way is to check Tonapi's traces, that in-progress is false and value flow indicates recipient NOT getting their tokens. (reply to 143386)

FREEZZZZ: Oke, very thanks (reply to 143387)

— 2025-03-01 —

Anton: Time to upgrade to Tact 1.6.0, folks  https://t.me/tondev_news/191

Ash: What is the process for obtaining the public key from a friendly text address on TON

&rey: Query get-method get_public_key from blockchain on the given address. If that contract is not initialized, you are out of luck. (reply to 143413)

Ash: How to find out the public key of my wallet address?

&rey: Only possible to do from mnemonic. Imagine what would happen if you could take someone's address and determine their private key. It wouldn't make a good distributed payment system) (reply to 143417)

Saurav: Can anybody help me? I am new to TON and recently learned FunC, but I am very confused about the message model and message handling in FunC contracts. I don’t understand how to handle messages, gas fees, and sending amounts. I have read a lot of documentation, but I still don't have clarity. Can anybody help me with this? Any good documentation or videos would be even better.

Anton: have you tried https://docs.tact-lang.org?  even FunC devs use the Tact documentation because sometimes it explains concepts in a simpler manner (reply to 143421)

Saurav: No I am using func (reply to 143422)

Anton: yes, but the concepts are still the same

Saurav: Okay let me try (reply to 143424)

Saurav: @AntonTrunov one question do you thing tact will be better option for big projects i mean in terms of gas consumption or speed

Daniil: it is already (reply to 143426)

Anton: I’m biased here since I’m leading the Tact development, but you can *already* write more efficient contracts in Tact, check out this https://t.me/tondev_news/191 (reply to 143426)

Anton: sometimes it can be up to 10% more efficient, some times it can be 5% less efficient, but we are working on shaving off those 5% and even more

Saurav: 👍 (reply to 143430)

Dmitry: If you want to challenge your knowledges - check it out  https://t.me/hacktheton/138

Alireza: Exactly, I read all Ton official docs,  but I grasped it by reading Tact docs (reply to 143422)

Mehrdad: Hello, sometimes toncenter v3 sendmessage api returned wrong message_hash from response even though transaction will successfuly confirmed but with the diffirent message_hash and this way I cannot track these transactions. any idea?

Higher Thought Sandeep: Ton dev here anyone

User: You can get tx hash from your external msg, before sending it to toncenter (reply to 143435)

Еqf: can i in theory just use this library, instead of writing on rust? (reply to 143245)

۰: /

۰: /stat@combot

Combot: Total messages:143466

FREEZZZZ: { "type": "ord", "aborted": true, "destroyed": false, "credit_first": true, "storage_ph": { "storage_fees_collected": "1000000", "storage_fees_due": "954894", "status_change": "unchanged" }, "compute_ph": { "skipped": true, "reason": "no_gas" } }  What is the meaning of each value in reason, like no_gas or no_state, what all the values can be shown in reason on compute_ph and their meaning?

— 2025-03-02 —

S | Coder: Hello everyone! I have trouble with my ton contract. I make forwarder contract(to make payment system)  Here my code:  #include "stdlib.fc";  ;; Адрес администратора, на который будут пересылаться средства const slice admin_address = "address"a;  () recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {     ;; Если сообщение пустое или сумма равна 0, ничего не делаем     if (msg_value == 0) {         return ();     }      ;; Парсим входящее сообщение     var cs = in_msg.begin_parse();     var flags = cs~load_uint(4); ;; Загружаем флаги      ;; Проверяем, пустое ли тело сообщения     int is_empty_body = (in_msg_body.slice_bits() == 0) *                         (in_msg_body.slice_refs() == 0);      ;; Резерв для комиссий (0.01 TON)     int reserve = 10000000; ;; 0.01 TON в нанотонах     int amount_to_send = msg_value - reserve;      ;; Если тело сообщения пустое, пересылаем средства на адрес администратора     if (is_empty_body) {         if (amount_to_send > 0) {             send_raw_message(                 begin_cell()                     .store_uint(0x10, 6) ;; Флаги (0x10 — обычное сообщение)                     .store_slice(admin_address) ;; Адрес администратора                     .store_coins(amount_to_send) ;; Сумма для отправки                 .end_cell(),                 3 ;; Режим отправки (3 — игнорировать ошибки)             );         }     } }  I compile by func-js, when I try to deploy I got bounced  const stateInit = beginCell()             .storeBit(0) // split_depth             .storeBit(0) // special             .storeRef(compiledCode) // code             .storeRef(new Cell()) // data             .endCell();  What I need to do?

— 2025-03-03 —

xin: ？what is problem

&rey: That's scam, as it happens. (reply to 143514)

xin: lol

Tonenthu: @delovoyslava could you check your DM,

Void: Please I need an experienced Ton developer

Daivd: ??? (reply to 143526)

Philip: nometa.xyz? (reply to 143526)

Elio: What is the reason for the failure of the getTransactions interface request?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 39  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Nerses: When transferring USDT in the Telegram wallet, I had no TON coins to cover fees, yet the transaction was completed successfully. It seems like the protocol covered the fees on my behalf. Since there’s no approve mechanism like in ERC-20 on EVM, I’m curious how this is handled in the Telegram wallet. Does anyone know how it works or have relevant materials to share?

&rey: Telegram wallet is not reflected in blockchain. (reply to 143536)

Nerses: So, under the hood, is it working like a traditional payment system, similar to transferring money between bank cards? (reply to 143537)

0xElements.sol: Hello  I was #memhash miner Is there way to make refund for stars or make complaint bec memhash have blue tike kyc They scam 97% of #miners insves  We are all in loss This is pay to loss project  I was number 543 in ranking

Combot: Combot has warned Abdo Saiko (1/3) Reason: Word ******* is not allowed

Nik: I'm trying to build a TMA. I need to test onboadring - 1st time user experience. For that I need multiple user accounts - just for testing. I've tried the ALT-Shift R button on New Account - but it doesn't work. Is there a way to get test accounts for basic QA? Thanks

Nik: OR, is there a way to clear an individual TMA cache and data so I can see it as if for the first time?

Mohammad: Hey everyone. I am using WebStorm and installed TON plugin and trying to write smart contracts in Tact lang. but I don't get any syntax or snippet help from my IDE. I am using the latest version of both WebStorm and  TON plugin. Should I do something special?

2024: Anyone familiar with TON infrastructure for running apps/servers?

❤️♣️Oliver | Waiger ♠️♦️: Hi all - nice to meet you. Had a question regarding questing in Tg apps.

❤️♣️Oliver | Waiger ♠️♦️: If we are attaching some progression or task completion to the reward, How does the partner verify this with us?  What is that communication layer? Is there a standard middleware/API where they ask us to confirm that the user has competed said objective. Is there external software we can use or are we building this?

Petr: Hey, Tact support in WebStorm is currently outdated 😢, try VS Code with official extension (reply to 143560)

Petr: This one: https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact (note: this extension currently in alpha)

Philip: (Petr is too shy to say he's exactly the person who has huge experience with JB plugins, but too busy at the moment) (reply to 143560)

Petr: Tact will definitely get great support in JB IDE, but a bit later 🙂

WhyesCode: Yes, what is the issue? (reply to 143566)

2024: How can I deploy FastAPI service on Ton Network?   Lets say I want to be on ubuntu linux and run some services on it. Whats involved in making this APi available to TON applications etc?

0xElements.sol: https://telegram.org/tos/stars#3-1-disputing-purchases  Is this rule fair? There was 600000 miner  97% of community invest in loss At least 20% of some miners have -5x loss frome Orginal strars purchase (reply to 143543)

WhyesCode: To verify task completion in a Telegram app, you can create a custom API that partners can call, or use webhooks to notify them in real-time. (reply to 143572)

❤️♣️Oliver | Waiger ♠️♦️: Would this work on a task completion basis e.g get to level 3 on the game?

❤️♣️Oliver | Waiger ♠️♦️: And are you aware of any existing apis that can be used/copied (reply to 143572)

WhyesCode: It should work. Platforms like PlayFab or Firebase can also help streamline this process. (reply to 143586)

❤️♣️Oliver | Waiger ♠️♦️: Thanks for your help @whyescode

WhyesCode: TON applications can now interact with API over HTTP/HTTPS just like any web service. (reply to 143580)

WhyesCode: If you are concerned about the process, we can initiate chat.

Farel: how to get TxHash from Boc?

&rey: Are you aware that TC2's BOC doesn't guarantee that any transaction happens? How would you get hash of something, logical time of which will be decided by blockchain, if it's not yet bound to happen? (reply to 143600)

Farel: yes, I want to learn how to parse boc into a potential hash (reply to 143601)

&rey: Or do you maybe want to learn how to track transaction tree originating from your message? (reply to 143602)

Farel: https://tonwhales.com/tools/boc If that's what you're talking about, then no (reply to 143603)

Farel: or is it possible to get a hash from this data?

&rey: Please don't misread my words. If I may suggest a rest? (reply to 143604)

X 💎: Sorry mate

X 💎: Can I talk to you about this in private chat? (reply to 143606)

&rey: No point in that unfortunately. (reply to 143610)

&rey: Unfortunately TON, as The Open Network, cannot provide guarantees for all the projects ran over here; developers on TON (i.e. this chat) can provide even less. Thus, your message is off topic.. (reply to 143543)

Mr: Hi guys I’m trying to implement cross chain trading bot using ptb and python ..   Which docs should I read to so I can implement the swap feature I.e exchanging ton to a jettons?  Chcked ston-fy from github also ton sdk   Really need help thanks

YesCoiner: I'm sorry but I'm a new programmer and I want to know how can I prevent testnet payment

&rey: Well for that you just check your mainnet account's balance. (reply to 143617)

YesCoiner: How do I verify? (reply to 143620)

&rey: Use common scanners — that is, https://tonscan.org, https://tonviewer.com. Don't click on links provided to you by someone else, since those might imitate UI and not reflect actual balances. (reply to 143621)

YesCoiner: Yes, I understand you, but how do I check the account balance? I do not understand this word and what is the benefit of checking the account balance? They pay from tonkeeper testnet. (reply to 143620)

&rey: Balance. The amount of money which you have in your wallet (=account), which you can freely spend (=transfer). It is one of fundamental parts of any accounting systems, including blockchains, including TON.  It is reasonable to say that you got paid whenever your balance increased (i.e. you can manage more TON).  If someone paid from Tonkeeper testnet, the money WOULD NOT arrive to your account mainnet, thus balance check would indicate you did not get paid. (reply to 143623)

YesCoiner: Oh now I understand you, if you have a ready code can you give it to me?! (reply to 143624)

&rey: You want an automatic check? Let's start with Python through Toncenter. There is a real LOT of ways to check everything. import requests  addr = 'UQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrX0-' url = f'https://toncenter.com/api/v3/accountStates?address={addr}&include_boc=true' info = requests.get(url).json()  nanoton = info['accounts'][0]['balance'] (reply to 143625)

YesCoiner: Thanks Bro ❤️ (reply to 143626)

YesCoiner: I succeeded, thank you, my brother. I thank you very, very, very, very much. Have a nice day. ❤️ (reply to 143626)

— 2025-03-04 —

Hong Kyun: looking for someone that has experience using TON Storage Daemon as a CDN for a MiniApp

WhyesCode: What is the issue? (reply to 143635)

Vanshika: Hi, I am running validator in mainnet, and have setup private alert bot in it using https://docs.ton.org/v3/guidelines/nodes/maintenance-guidelines/mytonctrl-private-alerting once in a while I get error from the bot "ADNL connection failed" but when I check in mytonctrl status, there is no error for ADNL, neither I could find any error logs in that timestamp. Can anyone please help? @pcrafter @TrueCarry

Elio: Hi, Why does the getTransactions request of https://toncenter.com/api/v2/jsonRPC show 500?

X1ag: that link returns me: {"ok":false,"error":"Method Not Allowed","code":405} (reply to 143638)

Elio: This is an rpc node, which requires SDK to request

Elio: Request through API interface is also 500

Elio: https://toncenter.com/api/v2/getTransactions?address=UQB8Ywa3tKwXR2vATgImu-1kILlcpNYLFxDr0EPOYAMGkow4&limit=10&to_lt=0&archival=false

X1ag: Try to insert another address (reply to 143642)

Elio: I tried many addresses, but only some of them can be queried through the interface.

Elio: Is there any way to solve this problem?

X1ag: It works for me. I think you are pasting the wrong address which has a specific lt. https://toncenter.com/api/v2/getTransactions?address=EQCup4xxCulCcNwmOocM9HtDYPU8xe0449tQLp6a-5BLEegW&limit=10&to_lt=0&archival=false

Starsquid: Hi, what does it take to set up my own local chain without using MyLocalTon? I'd like to create an initial state which then could be used with the docker image later

Elio: I copied the address on the browser: https://tonscan.org/address/UQBaeD1t0e2qwMGEehSe2vWaLxM_CoyRD2iJNXlqbJJi522d. lt is not a required field. (reply to 143648)

X1ag: try to insert that address EQCup4xxCulCcNwmOocM9HtDYPU8xe0449tQLp6a-5BLEegW (reply to 143651)

Elio: This address can query transactions, but why can't I query the address I entered?   UQBaeD1t0e2qwMGEehSe2vWaLxM_CoyRD2iJNXlqbJJi522d

Elio: And this address can be queried on the browser

X1ag: Because he has a transaction with specific logical time

Elio: Is there any way to solve this problem?

Pankaj: hi  I am not able to find master block for this word shard- 0:A000000000000000:30536993  is there any API to do it and link master block to worker block?

Pankaj: Above block is for testnet

KBA07: @here  There is a discrepancy between the /shards API and the /api/v3/masterchainBlockShards api provided on testnet.toncenter Which one should we use. As when we are trying to record the multi-send transaction. We are missing some transaction data.

&rey: It must've been acknowledged together with next shard block. (reply to 143664)

Pankaj: thanks for replying. master shard on v3 API has this work shard but v2 API does not have it. shard API for v2 is giving different set of shards in comparision to v3 API.  v3 api- /api/v3/transactionsByMasterchainBlock?seqno=28727425&limit=100&offset=0&sort=desc  v2 api-  curl --location 'https://testnet.toncenter.com/api/v2/jsonRPC' \ --header 'accept: application/json' \ --header 'Content-Type: application/json' \ --data '{     "id": 1,     "jsonrpc": "2.0",     "method": "shards",     "params": {         "seqno": 28727425     } } ' (reply to 143668)

Евгений: /shards

Pankaj: @here I have created an issue on github. Can anybody please help- https://github.com/ton-blockchain/ton/issues/1544

&rey: Stop pinging everyone since that's impolite even disregarding it does not work.  Your desired shard is available at ID -6917529027641081856. (reply to 143680)

Jared: Gm All, I ordered a website, it worked, but now when launched via 'npm start' it gives an error, I need you to fix it, since I don’t understand this at all and maintain the site

Pankaj: noted.  shard is known. How to find this shard from master block? If possible, please check shared github issue. (reply to 143683)

Aybars: Hello all,  I have a question for you;  Q: Are there any open-source contracts similar to Uniswap v2, and developed in Tact?   Additional Question: Do you know?

0xElements.sol: Gm developer's  Have great day Is there way to make complaint against #memhash? 97% of community are ine loss and unhappy They don't listen to community  just ban

C.: Not in tact but ston.fi contracts are open-sourced but in FunC (reply to 143687)

C.: You can try func to tact converter though

Kaligun: The GET method is not supported for route xxxxx. Supported methods: OPTIONS.   The get method is also defined but I get a 405 method not allowed error. What is the reason?

&rey: This is wrong place. Please use this chat for matters about how to develop on TON. (reply to 143688)

KBA07: @pcrafter  Is it possible for ton node to have impartial data even after a block is mined on the master chain. cc @pankaj

&rey: Yes. Only 2/3 of validators are needed for consensus, not 100%. Status of other full nodes isn't considered at all. API might return outdated info compared to the block being loaded as well. (reply to 143695)

Altaaf | proSEED: Any doc on TON based smart contract development??

&rey: Yes. History of this chat, docs.ton.org and so on. (reply to 143698)

Altaaf | proSEED: Thanks (reply to 143699)

KBA07: @pcrafter  So, there is a chance that the data is updated even after the block is mined and it reaches eventual consensus. In terms of syncing ton block data how do we ensure that we eventually update the missing block data. In terms of our design we just synchronously fetch the block data once and continue with other master chain blocks.  But knowing this how do we write a logic to update the block data because our current design involves poling the block information. 1. Are there any streaming or websocket apis which provides update for this? 2. Should we have a delay of n number of blocks before checking the block data 3. Do we have to retrieve the information from all the validators and check which has the maximum number of info. If so then how do we do that.  I am sorry for asking these many question. I am looking forward to your response.

&rey: Update? No, it's all atomic. If you query a single liteserver, that is, which might not be the case with Toncenter. (reply to 143701)

KBA07: @pcrafter We are trying record ton txns. The recording is happening on masterchain. The logic is that we take a range of masterchain blocks get shard blocks for these master chain using the /v2/shards and then try to fetch all the transactions happening on the shard blocks using /api/v3/transactions.  Now there are couple of observations on this. /v2/shards returns different set of shards when compared to /api/v3/masterchainBlockShards. Some shards which are return by /v2/shards doesn't have the workchain txn which we get while getting the txn details.  Can you let us know that which is the api and the pattern which the community uses or recommends. Since, we are missing some transaction data during our recording.

&rey: They are same as I have said. -6917529027641081856 <—> A000000000000000 (reply to 143703)

KBA07: Let's ignore 2's complement of shard for a while and focus just on seqno  curl --location 'https://testnet.toncenter.com/api/v2/jsonRPC' \--header 'accept: application/json' \ --header 'Content-Type: application/json' \ --data '{     "id": 1,     "jsonrpc": "2.0",     "method": "shards",     "params": {         "seqno": 28727425     } } '   Returns 4 workchain shard blocks 1.  "workchain": 0,                "shard": "2305843009213693952",                 "seqno": 30542574, 2.  "workchain": 0,                "shard": "6917529027641081856",                 "seqno": 30539770, 3.  "workchain": 0,                "shard": "-6917529027641081856",                 "seqno": 30536994, 4.   "workchain": 0,                "shard": "-2305843009213693952",                 "seqno": 30501264,   If we call this API  curl --location 'https://testnet.toncenter.com/api/v3/masterchainBlockShards?seqno=28727425&limit=10&offset=0' \--header 'accept: application/json'  We get 3 shards  1.  "workchain": 0,            "shard": "A000000000000000",             "seqno": 30536993, 2.  "workchain": 0,            "shard": "A000000000000000",             "seqno": 30536994, 3.  "workchain": 0,            "shard": "6000000000000000",             "seqno": 30539770,   Notice how 30536993 is included in the v3 API but not in the v2 API.

Sentinel: Hi👋

Combot: Combot has warned Sentinel (1/3) Reason: Word ******* is not allowed

Sentinel: Witch word? (reply to 143712)

Sentinel: My team and I created a new air  drop project

Sentinel: And We want to create our own token on  Ton blockchain to be traded on the Tonkeeper platform (reply to 143714)

Sentinel: Can sb guide me? (reply to 143715)

F: The analogue of the v2 shards method is in v3: masterchainBlockShardState - https://testnet.toncenter.com/api/v3/index.html#/blockchain/api_v3_get_masterchainBlockShardState It returns all existing shards.  And masterchainBlockShards returns only new blocks that appeared after the previous seqno (i.e. if the shard was standing, it will not be given away)  Toncenter support: @toncenter_support (reply to 143706)

Vg_r: hello friends, I have such a problem. I'm writing code in js that should buy a coin on the blum site, I found the operation code 0xaf750d3, and JettonInternalTransfer, and my code looks like this (I haven't tested it yet)  import TonWeb from 'tonweb'; const AMOUNT_TON = 0.01;  const SWAP_PAYLOAD = TonWeb.utils.hexToBytes("af750d34"); const seqno = await wallet.methods.seqno().call();          const transferTx = wallet.methods.transfer({             secretKey: keyPair.secretKey,             toAddress: TOKEN_ADDRESS,             amount: TonWeb.utils.toNano(AMOUNT_TON),             seqno: seqno,             payload: SWAP_PAYLOAD         }); await transferTx.send();  , but is it written correctly? will this code make the purchase of a token?

Vg_r: I'm looking at this transaction.   https://tonviewer.com/transaction/919094d397e392c5a941b6066b82aa00db57ba426ad2be3610d1b7bee203215c

Ghost developer: hi i am facing issue in transfer jettons usdt Can anyone help me ?

Ghost developer: i am transfering usdt from my tonkeeper to other wallet using react js

Ghost developer: its paid task

Arseniy: Hi chat, I have question about contract code changes: how to properly deploy them?  I've tried following:  - updated func code, compiled it,  - created a blueprint script that connects to existing contract address, sets the new code and sends message with ContractProvider.internal() - like in initial deply.  - npx blueprint run updateContract Transaction is succesfull but the code does not update. What is correct way to update or maybe just to delete a contract? Thank you

— 2025-03-05 —

WhyesCode: What's the error? Can you send a code snippet (reply to 143749)

2024: Greetings! i am looking for FunC developers and those familar with TON Networking/Filesystem to start a fun project.  Dm is fine

3,1415: Hello everyone, please tell me how to bypass the blocking of a bot from reading messages from other bots?

&rey: Not related to TON at all. If it's not documented in Telegram bot docs, it is unlikely to be possible. (reply to 143781)

3,1415: thank you

Ar: Guys is TON testnet excluded from tonkeeper?

Aleks: I have testnet wallets on TonKeeper and all works just fine. What do you mean exactly? (reply to 143784)

Ar: Just can't the find an old way of switching to it by clicking to the logo 5 times. That's probably the resason why blueprint refers to the main wallet where I have 0 TON of course even when testnet was chosen

Ar: . (reply to 143786)

&rey: Using same seed phrase for both networks is wrong and was a common source of errors in the past. You can generate a phrase and then add testnet wallet in the wallets selector now. (reply to 143784)

Ar: ok I created new one how do I make it operate on testnet (reply to 143790)

&rey: "Import testnet wallet" option. (reply to 143793)

Ar: Tnx (reply to 143794)

&: dm (reply to 143773)

William: hello guys

William: i am adding "Connect wallet button" to Unity telegram bot, is there some samples?

Sentinel: Hi bro I have a question (reply to 143794)

&rey: Hello! My telepathic device is being repaired now so please ask away – if that's related to how to develop on TON, that is. (reply to 143804)

Jack: Is there anyone who can develop a TON coin smart contract?

Jack: I'll pay a small fee.

Sentinel: I started my own air  drop project; The token will be launched on the ton blockchain But my main problem is the users (reply to 143805)

Sentinel: You mean mint a token? (reply to 143808)

Jack: yes (reply to 143811)

Ar: Devs which command will clear blueprint wallet history?

Ar: I am trying to use different wallet when deploying

&rey: No, this is not welcome. (reply to 143810)

Jackson: Hi guys! I am creating a TON ↔ ETH bridge for exercise and I have this code here, so I am trying to execute the calculateAndSendTax, and it works on mint function but in burn the function not execute don't sendTransaction and also don't calculate fee the final amount is always the initial amount from param.  Someone has some idea why the calculateAndSendTax only works in mint function, not in burn?

Illia: What wallets do you use for developing on localnet (MyLocalTon)?

Abdi: 😂😂

Joey: Ton

Hong Kyun: Does anyone have experience here using TON Storage as a CDN for a Telegram Mini App?

Hong Kyun: I assume Telegram Cloud Storage is meant for lightweight user-data management and TON storage for actual file storage.  But is it plausible to use it as CDN?

— 2025-03-06 —

ManduLadino__: I'm researching this to apply to a personal project, but at the same time learning about blockchain, platforms, technologies and ecosystem. Soon, I hope to be able to help (reply to 143853)

Developer: Hello is there any Func - Tact converter ?

final: Do you know any python to js converters or c++ to python? (reply to 143857)

Developer: I understand what you mean, these types of products usually don't work properly, but they can give you an idea. That's what I was hoping for. (reply to 143858)

final: Then you can ask ChatGPT about it (reply to 143859)

Developer: I am talking it :D but it is writing solidity and says it is tact :D (reply to 143860)

final: You can share some code in tact and provide it with docs or syntax, with func it usually works, not perfect but somehow (reply to 143861)

Developer: At the end of the day , I am sure I should use AI. thanks (reply to 143862)

KBA07: I am trying to figure out a way to transfer all the balance from ton wallet. After reading the ton docs i found that we can use mode 128 with any balance under the current wallet balance and send the txn. I tried creating and sending a transaction https://testnet.tonscan.org/tx/f8dcb3ab521f2db9794a582f7f1105f13591f5c96c9091625538d12efc5a7d74 but, it doesn't do anything. The wallet version is v5r1.

KBA07: Okay, I was able to send it. I believe ignore errors is a must.

Sufiyan: Hey everyone,  I'm working on parsing TON blockchain transactions and currently using the TON API. It has an event API that provides high-level actions, making parsing easier. However, I'm stuck on how to paginate through results. The response includes next_lt: some_timestamp, but I don’t see any parameter to pass it for fetching the next page.  Additionally, I noticed that preview.toncenter API is being used in Tonscaner. Would it be a better alternative for parsing transactions? Has anyone worked with it before?  Any insights would be really helpful! 🚀

Ar: Error: Method name must be a string for TonClient provider  Anybody aware of this error message? It seems like a blueprint issue opened here issue

Lase: Hi devs. Im chocos. A fullstack web developer and a writer.  If you’re building a dev tool or something of sort on TON ecosystem.  I would love to work with you as a technical writer

Dmitry: You might be interested https://t.me/tonhunt/725 (reply to 143880)

Vanshika: Hi Team, I was checking my adnl stats in validator-console using below command: get-adnl-stats It showed me a list of peers but in the end it says PEERS[0], what does that mean? Can anyone please help?

Ar: Hi all. I have initialized a blueprint project which generated wrapper,test and tact contract named A. Then I manually added a file in contracts named B. How do I make it generate wrapper and tests for it too?

BenVu: For TON Bridge for ETH L2 to TON Jetton, the new Jettons... 1. Add a "j" to the symbol and 2. didn't keep the icon image   Is there a way to update the icon image and the jetton symbol? I don't have authority to the bridge contract.

— 2025-03-07 —

perfogic: you have to write it manually (reply to 143899)

🛍️: Can I get a working link to this? (reply to 143102)

Starsquid: Hi, is there a way to create my own genesis state of the chain for local testing?

渝味屋: Hi there, our contract was freezed for a while and our code and data has been deleted. Can anyone help us?

Starsquid: Haha, yeah obviously. Can you point me in some direction on how that can be done? (reply to 143938)

渝味屋: We have tried to unfreeze but it seems too big to send a hash (reply to 143944)

渝味屋: please check the detials (reply to 143942)

渝味屋: Is there any doc of them? (reply to 143950)

渝味屋: code snippet of what？

渝味屋: it not works, there are not many data in our contract storage, it’s big since too many users call it (reply to 143950)

&rey: The network does not allow such big contracts to exist anymore. If you managed to deploy one, it wouldn't be functional too. (reply to 143947)

&rey: Then you must've ignored TON guides when writing the contract, since usually users' data is kept on separate contracts to facilitate infinite sharding. (reply to 143962)

&rey: Checked again. You just have to compare with previous masterchain block and loop for every shard that advanced. (reply to 143686)

Shadow: Hi

Sehm: I need help to build a dapp for SBT claim.

Yash: Anyone knows tonvalidators(.org) site team? We are looking to list out our nominator pool there.

F: Accommodation requests are no longer accepted. (reply to 143986)

Рахманов: So, tonkeeper support recomended me you about a small issue (reply to 143990)

Рахманов: I have send toncoins to token adress, is anyone help me ? Can i hope?

Denis: Hi,  Do getgems, tonviewer, etc. have native integration with TON Storage? I tried to use manual how-to-migrate-ton-nft-content-to-ton-storage from docs.ton.org but without success. GetGems doesn't load metadata by url tonstorage://<my_bag_id>/image.png Does anybody know working TON Site or NFT Content placed in TON Storage as an example?

— 2025-03-08 —

Yash: Ah okay are you from team tonvalidators? (reply to 143990)

TON Bounty Bridge: ​[เครื่องมือสำหรับนักพัฒนา] - พัฒนาเครื่องมือสำหรับการจัดการบล็อกเชน TON  🏷 Developer Tool  Summary:เรากำลังมองหานักพัฒนาที่สามารถสร้างเครื่องมือสำหรับการจัดการและตรวจสอบบล็อกเชน TON ซึ่งเครื่องมือนี้...  Rewards: • 100 TON  Created by PTDEV43

Dmitry: Hi, anyone knows how to calculate fee of Toncoin transaction?

‌‌ ‌‌‌Mohammad: Hi folks, I purchased a plus plan of toncenter And we use it in our mini app or the frontend.  Can someone find out the apikey and abuse it? Any thoughts?

fedya eremin: sure, it can be seen through webview inspector (reply to 144043)

‌‌ ‌‌‌Mohammad: Makes sense Anyway to harden it? (reply to 144044)

fedya eremin: just make api requests on ur backend and retrieve result (reply to 144045)

— 2025-03-09 —

ERAX: How can I verify the token?

ERAX: on ton ??

WhyesCode: Hi, I do. (reply to 144040)

Dmitry: Could u explain how to do it, please? (reply to 144060)

Daivd: Its simple.  https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees (reply to 144062)

Павел: I need to evaluate the result of a transaction execution based on a TonApi trace. Is it possible that the transaction appears gradually? I mean, for example, there is already a StonFi funds transfer in the response, but the swap has not yet taken place and its result will appear later?

Павел: I'm writing a backend that tracks the result of a transaction.

perfogic: i want to buy large ton testnet for testing, any provider ? Thanks for your time!

ANAS: is there a way i can use ton for a custom in-app purchases in my android application?  if there's a platform or something it would be great

&rey: I don't really know but if .in_progress field is false then all the effects (aka all transactions in the tree) have completed. (reply to 144072)

Aybars: Hello, everyone. After deploying the NFT contract, the images are visible on Tonscan but not on Tonviewer. What is the main reason for this? Is there anyone who can help?

Nemo: Hello, how to get new address format which starts from 0Q, from typescript app?

Nemo: can someone unban me on TON Dev Chat (РУ) as sent link to ton sample in first message?

— 2025-03-10 —

WhyesCode: Tonviewer is stricter about metadata formats and image URLs. Tonscan may work even if the metadata isn’t perfect, but Tonviewer expects a precise structure and accessible HTTPS links. (reply to 144089)

perfogic: Hello, i'm developing CLAMM on TOn and i really need TON testnet, anyone can faucet for me on ton giver on this address 0QBkxNmedeIS12e9bD0PO6nPaRMpU3dnijh90OH5Dtjqpbjb. Thanks for your time! Here is the link for faucet: @testgiver_ton_bot  FYI: i'm a developer, not a bot

Sachin Kshatriya: Hello everyone   We are looking for Ton blockchain developer who is ready to join us to handle following issues  The contract's Jetton wallet address is always inactive, preventing Jettons from being transferred to the user. Additionally, there is no proper frontend interaction documentation for the purchase process.  Other issues include: The Jetton wallet might not be initialized automatically, requiring manual intervention. There is no clear error feedback when a transfer fails, making debugging difficult. Gas fees might not be properly estimated or included, causing transactions to fail silently. The contract does not provide events or logs that indicate why the transfer is failing. The wallet address may not be linked correctly to the user's account, leading to incorrect recipient addresses.  Incorrect contract jetton wallet is calculated during the initialization  Interested person connect us

Angle: Hello everyone ,  We have series game on Telegram , we use TON blockchain in game . We need some developer market .

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 45  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

&rey: Use of LLMs tends to fail in TON, sometimes probably spectacularly.  What's that actually happened? If contract's jetton wallet is not initialized, then it certainly doesn't have anything to transfer. (reply to 144114)

Sachin Kshatriya: Our developer connect you soon  Thank you (reply to 144136)

Alexey: Hi! We want to make paid broadcast and i have few questions. 1. Whats the right way to populate balance by stars? 2. We already populate it by created invoice, but now we have to wait then balance will be available for spending. is it possible to resolve it faster?

Andrew: buy stars at fragment dot com? (reply to 144139)

Alexey: buying stars is not a problem, but whats the way to top up balance of bot? (reply to 144141)

Andrew: one solution is to deploy a simple code for the bot with top up logic and you topup (reply to 144142)

Alexey: looks like we walking around, please reread my post (reply to 144139)

Alexey: looks like now we have to wait for 21 days, before we can be able to use it for paid broadcast

Andrew: ok, I see. (reply to 144144)

&rey: Please use proper chats. This is about dev on TON. Telegram features are not that. (reply to 144139)

Alexey: can you suggest chats for that? here or in pm

Mr.AiKen: Good afternoon, does anyone have a link to any documentation on developing Dapps using Python?

&rey: Mind possible scam. (reply to 144153)

filatov: why brother? (reply to 144154)

WhyesCode: It is a warning ⚠️ (reply to 144155)

Keep: Looking for a Blockchain Developer (Multichain Integration) for DeFi-related tasks!   I'm looking for an experienced developer to help with blockchain integrations, including:  ✅ Developing a multichain wallet (TON, Solana, BNB, Ethereum) ✅ Setting up APIs and interacting with different blockchains ✅ Working with oracles and price feeds ✅ Optimizing infrastructure and ensuring scalability  If you have relevant experience, send me a DM with:  A brief description of your experience Your LinkedIn / GitHub profile Your tech stack

User<7894330870>: Maybe, I can help you (reply to 144089)

— 2025-03-11 —

Vanshika: Hi  Can anyone please help how we can downgrade mytonctrl version

Behrooz: Hi👋 How can I verify my account by ton?

Behrooz: Like this

&rey: Please explain the usecase to @f_closer. (reply to 144177)

Андрей: MyTonCtrl> update <older_hash_or_version> (reply to 144183)

F: Hey all guys! Does anyone know how to speedup the process of telegram ads approval (it's 4+ days "in review" status)

FREEZZZZ: You can claim testnet TON on faucet (reply to 144177)

Ackermann: Hey guys, I’m facing a problem with my nft contract   It deploys and mint but it doesn’t get collection details and image but it fetches nft item metadata with all the details  What do I do

Mikey: Sent DM (reply to 144162)

Olesia: Hello, could someone please explain the reasoning of updating fwd_fee in this commit https://github.com/ton-blockchain/token-contract/commit/88ba20dec780062f1f1f8473a79958014dd2240e ? and what is the impact of using old calculation

Behrooz: Tell me pls (reply to 144188)

&rey: Telegram shenanigans are out of my control, knowledge, and out of scope for this chat. (reply to 144189)

Behrooz: Ok (reply to 144208)

Nikhil: Hi guys, wanted to ask whether there is any way to simulate data races in smart contracts in TON?  for example a smart contract has 2 functions recv_internal and recv_external, both modify the same persistent storage. It receives 2 messages at same time, one for recv_internal and other for recv_external. Is a race possible here?  If not, can there be some other way?

&rey: All incoming messages are serialized. Also, two A—>B messages are guaranteed to arrive in order. (reply to 144223)

Nikhil: is there any scenario where a data race could be possible due its asynchronous nature

Nikhil: and what happens in case of A->B and C->B?

&rey: A data race, by definition, occurs when 2 instructions from different threads access the same memory location, at least one of these accesses is a write and there is no synchronization that is mandating any particular order among these accesses.  It is impossible in TON because there are no different threads which could access the same data. (reply to 144225)

&rey: Those would not be ordered in any way. (reply to 144226)

&rey: On the other hand, to explore race conditions, you should check out TON Hack Challenge 1. (reply to 144225)

Sam: hola ! can you tell if its possible to deploy contract without executing it ? 🤔

Sam: I'm deploying contract with @ton/core and @ton/sandbox but whenever it deploys the recv_internal gets executed

&rey: Send 0 TON along with the deploy message. (reply to 144234)

Sam: how do you pay for storage then ? shouldn't validators ignore such message ? (reply to 144235)

&rey: Well what storage if that's the first transaction? (reply to 144236)

Jimmy: Hello everyone  Can someone help me? I can't run multiple sends within a single function in a contract in tact, for example:  I want to make a payment transaction, and I need to reduce the payment amount by 2% and send it to a different wallet, but all these operations must run in a single function

&rey: Mind valuea and send modes. Remember that contract's computations are paid for from incoming message value. (reply to 144238)

WhyesCode: Maybe your contract only returns token metadata. You likely need a contractURI() (or similar) that points to collection-level metadata including the image and details. (reply to 144200)

Ackermann: Can I share a part of my code??? (reply to 144243)

— 2025-03-12 —

0x: Maybe, I can help you (reply to 144043)

Vanshika: Hi Team, yesterday I backed up my config files for TON validator and started a new container for mytonctrl then I stopped mytoncore and validator service, replaced the config files with my backed up one and  started the mytoncore and validator service  everything else seems fine, I can see my old wallet address, adnl address but my validator-console doesn't seem to be working, it's still picking up the old port for that:

WhyesCode: No problem (reply to 144247)

Ackermann: https://github.com/draysongz/brytenft (reply to 144257)

Еqf: hey, I have one more question. So in theory if I manage to put this script inside of WASM module, will it be possible to run it on client side inside of TMA ? Im not sure if the size of final bundle will fit in 200 or 250 mb ( TMA ram limits for mobile devices ) (reply to 143245)

&rey: It might be... you should try parallelizing computations with WebGPU or what it was called again. (reply to 144260)

Еqf: WebGPU doesnt supported yet in TMA webview ) (reply to 144261)

Еqf: already made research

Еqf: yet enough im ok with using cpu power only

Еqf: wasm is the only way to somehow fix one threaded slow js

Еqf: i guess telegram team will enable it only after it will be stable on all devices and browsers (reply to 144261)

Еqf: what will take some time, maybe couple yrs

Еqf: made some research, it seems like 200mb will be enough, app should be using 50-100 mb max (reply to 144260)

Gagan: Hi Team,  I want to discuss a partnership proposal regarding developer ecosystem expansion. With whom can i talk?

Daivd: It is related with Ton? (reply to 144272)

Gagan: Yes (reply to 144273)

Daivd: Good (reply to 144275)

Nikhil: in FunC, is each message executed atomically by a smart contract? Or can they be schedulled in something like a round robin manner?

Nikhil: Can 2 different smart contracts have access to some shared memory?

Chris | MC²Fi| NetworkState: hey guys - did anyone got ton multisigs to work with ston liquidity provosioning - or are all the lp pools hold by eoa wallets?

WhyesCode: Each message is executed atomically...it's fully processed before another one can start, with no interleaving. (reply to 144279)

WhyesCode: No, smart contracts are isolated, they don't share memory. They only communicate by sending messages to each other. (reply to 144280)

WhyesCode: From what I've seen, most LP pools in STON liquidity provisioning are still managed by EOAs rather than multisig contracts. There have been experiments with multisig setups, but they tend to be more complex and haven't seen widespread adoption yet. (reply to 144281)

Chris | MC²Fi| NetworkState: yes - thats also our experience - launching our token today (actually in 4 hours) - will be exciting. and also will handle it via eoas it seems. (reply to 144284)

Sam: for storing the contract on-chain of course, otherwise the contract can be frozen is it not ?  so, in other words the contract gets always executed when deployed right ? the only way to prevent execution is to fail it (insufficient gas) ? (reply to 144237)

perfogic: Hi @pcrafter, what is the size of c3 ? I want to know about the maximum size of code that i can store

&rey: You'd be hard pressed to store more than 255 cells in depth there, plus contract storage in total cannot exceed 65535 unique cells. (reply to 144299)

perfogic: thanks so it is only have to obey the rule 65535

— 2025-03-13 —

Lee: How to parse USDT transfers in the Ton transaction records?

Silentium: how? (reply to 144324)

WhyesCode: I think you need to decode the message body for the USDT transfer opcode. (reply to 144321)

Leonid: Hi guys! I`m Leon BDm at 99blocks.  We are a growth & development studio, and besides top-tier marketing services and fundraising, we also specialize in cutting-edge Web3 development!  We’re always open to collaborations! If you’re looking for a trusted partner to bring your Web3 vision to life, send us a message—let’s build something great together.

Mr.AiKen: Hi, does anyone have documentation that teaches how to connect python with a wallet within blockchan Ton?

Daivd: https://docs.ton.org/v3/documentation/archive/tg-bot-integration-py (reply to 144333)

Dario: { error: 'no protocol found for given message', error_code: 40007 }

Dario: someone knows why I received this response trying to simulate a gasless tx?

Bright: Jetton Transactions are not going through anymore, anyone knows why?  They have been working all this time, I didnt change the code, but suddenly doesnt work today

Daivd: I think your code issue (reply to 144340)

Bright: Been using the same code for a month and a half it always worked (reply to 144341)

Bright: Just happened today transactions don't  get sent

Bright: Are you okay taking a look at it? (reply to 144341)

Anoke: hi maybe someone have code of using gasless transactions with v5 addresses in ts/js or using ton/ton lib?

Anoke: or any realisation of gasless transaction)

Bright: This is my code if anyone has an idea        const forwardPayload = beginCell()     .storeUint(0, 32) // 0 opcode means we have a comment     .storeStringTail(comment)     .endCell();      const messageBody = beginCell()     .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer     .storeUint(transferQueryId, 64) // query id     .storeCoins(1 * 10^9 ) // jetton amount, amount * 10^9     .storeAddress(recipientAddress)     .storeAddress(vaultContractAddress) // response destination     .storeBit(0) // no custom payload     .storeCoins(toNano('0')) // forward amount - if >0, will send notification message     .storeBit(1) // we store forwardPayload as a reference     .storeRef(forwardPayload)     .endCell();      const internalMessage = internal({         to: vaultWalletJettonAddress,         value: toNano('0.1'),         bounce: true,         body: messageBody     });            const transfer = walletContract.createTransfer({         seqno,         secretKey,         messages: [internalMessage],         sendMode: SendMode.IGNORE_ERRORS // Using Wallet V5       })        await walletContract.send(transfer) (reply to 144340)

&rey: Should be fine. What happens instead? (reply to 144348)

Bright: Nothing at all (reply to 144349)

Bright: Doesnt error out, just nothing happens

&rey: Well await walletContract.send... isn't actually guaranteed to do anything on a single try... (reply to 144352)

Bright: wow, but its always worked before today (reply to 144353)

Bright: So what is the right way to go about it?

Bright: I was really scared that it was a network thing, that all the tries I have done are still recorded in the network just waiting to be sent, if thats the case, I am in big trouble 😭

&rey: Seqno protects you. (reply to 144358)

Bright: alright then, thats a relief (reply to 144359)

&rey: IF your client does not acknowledge any transactions happened on the wallet and returns the old seqno, THEN all the transfers were signed under it and no more than one may happen.

Bright: Makes sense

Bright: so from this, you saying the best way to solve this would be to retry over and over again (reply to 144353)

&rey: Generally it's possible to retry sending the same external with the same seqno. It may complete or fail in one of the two ways. (reply to 144363)

Bright: I created an internal tho, is this an issue? (reply to 144364)

&rey: createTransfer makes an external. (reply to 144365)

Bright: smart

Bright: So its just a retry thats needed, not bad of a solution

Bright: I do run extra checks for the txn hash after the send, maybe I add a callback if not hash was returned after the wait period, try again

Bright: Its just a bit funny, never had this issue before and now it comes up lol

&rey: to check: nothing onchain either? (reply to 144352)

Bright: nothing (reply to 144372)

Bright: I changed my rpc provider and it worked

Bright: Used TonCenter now

S: Hello everyone! I want to stop spending real TON while testing on the project. I'm considering MyLocalTon or the testnet. We have direct interactions with DeDust and StonFi.  Question 1: Is it possible to do this on MyLocalTon, considering that some of the contracts we interact with have unpublished code?  Question 2: Do DeDust and StonFi contracts work properly on the testnet?  Thanks!

Anoke: can i fail all transfers in v5 wallet batch-transaction, if one transfer failed?

&rey: What exactly do you mean by "transfer failed"? (reply to 144379)

Anoke: when transfer failed for some reason (out of gas, not enough token/ton on balance to perform tx) example of transaction where it failed in one transfer, but second passed (can check in value flow) https://tonviewer.com/transaction/6a015ec4677d31e10f300df5800667ccc37c602ef2db371868e7d7183e8ac8d2 (reply to 144381)

&rey: It is not possible for contract to revert anything that has already happened, in particular the messages sent to initiate further transactions. (reply to 144383)

Anoke: okay thanks a lot (reply to 144384)

Padil 🦉Tearline Roko ⛏️: I have a problem with my email for transaction verification, the email I use is no longer permanently active and I have to change it, and changing it requires a code, can you help me replace it so that it is not verified via email, but is replaced with verification using a telephone number?  and it still requires a code from my email which is no longer permanently active

&rey: No one in this chat (or whoever would DM you) can help you with that because we have no authority over certain services like TON Space. (reply to 144387)

&rey: So why do you store anything in the message body? (reply to 144400)

&rey: Well if you don't know operating conditions of contract then how would you use it later? (reply to 144404)

Ad: I was reading this in the TON roadmap document: "We want to strive for external messages to be delivered to validators in a single hop. Fast delivery is already supported now when sending via Toncenter API." what is this fast delivery? is this faster than using lite-client?

— 2025-03-14 —

perfogic: u can use @ton/sandbox for simulating onchain (reply to 144378)

Mikal: It is possible to use MyTonCtrl, but you will have to deploy all the contracts you need to use and interact with. It is probably easier to get started with testing and development using TON Blueprint / Sandbox, there you can write proper tests against the contracts. The development cycle on TON Sandbox is much faster than with MyTonCtrl. You can look into MyTonCtrl later when you want to test interaction that is closer to testnet / mainnet. (reply to 144378)

S: Thank you guys

S: 😄

S: Can u repeat pls

Mikal: All right, don't know which word it doesn't like, and I am not allowed to know what I said wrong 🙁

Mikal: I got started with My Local Ton, that is difficult and slow. Am now using TON Blueprint, it is much faster for contract development.

perfogic: Yup just as a note to save your time, there will be some jettons that you need to install libs and you will have to import it on sandbox to simulate

Kerolis🇵🇸: Hi

Kerolis🇵🇸: Looking at python Ton SDKs, it seems like there's 9 different libs  Which one is used to interact with the blockchain? Create wallets, send raw transactions, etc

&rey: I've always chosen pytoniq but had reports that tonutils is as fine. (reply to 144474)

Kerolis🇵🇸: Thanks (reply to 144475)

Little Black: Hello guys, I’m new to TON and I’m very confused about the part for deploying contracts. Like if I have an NFT collection, in theory, everyone will be able to calculate the next address of NFT and possibly do deployment to fake the contract? Or is there any security mechanism to prevent that from happening? Thank you very much for any help!

Алина: I want to parse a little part of a hex-encoded boc with a sort of sliding window because i don't have the full schema. Can this at least in theory work out?     for (var i = 0; i < 512; i++) {    const s = Cell.fromHex(hex).beginParse();     try {     s.skip(i);      return [      s.loadUint(32),      s.loadAddress(),      s.loadUint(160),      s.loadCoins(),      s.loadAddress(),      s.loadUint(1),     ];    } catch (err) {     // console.log(err);    }   }

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: Hi. Does anyone know how to mint nfts with python?

&rey: Well it might but what if the data is in reference? (reply to 144479)

&rey: Possibly do deployment, yes. Fake the contract, no (because the only contract with StateInit matching that address will be the NFT). (reply to 144478)

Алина: It actually is in a ref, not really sure what it means. Does it mean that the hex layout will change in a crazy non-linear way? (reply to 144482)

&rey: It means that it is not in the bits of cells you're parsing; each cell is at most 1023 bits length, after all. You'd need to go down the references. (reply to 144484)

Алина: Can i do that if i don't know where the references are in the schema? (reply to 144485)

Алина: Oh, its just Cell.refs?

&rey: References are loaded in separate array so it's alright. (reply to 144486)

Little Black: Thanks for your response. Yep, I may deploy the same contract with the same state but change the owner. As the initstate code for nft item only takes item index and NFT code. I successfully calculated it using the blueprint, but when I deployed it, it reverted for some reason. So I’m trying to understand why (reply to 144483)

— 2025-03-15 —

SINKOOK: Hello everyone. I have a game that is being serviced using TON. Since a few hours ago, the game has been having some UI-related issues, so I looked into it and found that  TON_CONNECT_UI, which is being used as a CDN, cannot be used.

SINKOOK: So I looked into it and found that the  @tonconnect/ui@latest/dist/tonconnect-ui.min.js link that is provided in  package/@tonconnect/ui is no longer opening. Where should I report this?

Okan: f8f057643d143a806f156b3dbde4d21c1c2ec8baa73d6608d50ac2d9d26f0231 anyone can help me??

&rey: Jetton master doesn't support that strange opcode. What should it have done? (reply to 144512)

&rey: NFTs resist attempts to assign initial ownership from anyone except collection. (reply to 144489)

Okan: i am trying buy this token for test. i am developing python trade bot (reply to 144513)

Okan: How should PAYLOAD be? I tried everything. I can't overcome this problem for 3 days. The money is being refunded.

&rey: would you like there to be no refund either? I don't have docs for said jetton. I'd suggest obtaining it from the dev team.  Commonly, jetton is acquired from decentralized exchange. (reply to 144515)

&rey: That's not the code which got run. (reply to 144517)

Okan: This is the Blum memeped token. (reply to 144518)

&rey: Names like "blum" mean pretty much nothing, I still stand by my suggestion on docs. (reply to 144520)

User: https://www.npmjs.com/package/@fiscaldev/blum-sdk  Look at this lib sources, there you can find correct payload for buy and sell Blum jettons (reply to 144520)

Okan: thanks i will check (reply to 144522)

Antoxa: Hello Why can't I leave a message?

Ad: anybody knows what fast delivery is and where i can read more about it? (reply to 144411)

Antoxa: Connecting TonConnect UI CDN <script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({         manifestUrl: '—————/tonconnect-manifest.json'       });  1) How to withdraw the number of the connected wallet? 2) How to properly transfer (payload)?  $(document).on('click', 'a.tza', function (e) {         e.preventDefault();         let id = $(this).attr("data-id");         let axresult = $(this).siblings('.ax-result')          let formData = new FormData();         formData.append('id', id);          App.sendAx('/ax/pool/buy', formData, {           silence: true,            successFunction: function (d) {              window.transactionData = {               validUntil: Math.floor(Date.now() / 1000) + 60,               messages: [{                 address: 'gfgfdgfdgfdgfdgfdgfdgdfg',                 amount: '0.001',                 payload: 'Hello Word'               }]             };              if (!tonConnectUI.connected) {               tonConnectUI.onStatusChange(wallet => {                 if (wallet) {                   tonConnectUI.sendTransaction(window.transactionData);                 }               });             } else {               tonConnectUI.sendTransaction(window.transactionData);             }           },           errorFunction: function (d) {            }         });       });  If I pass it this way (payload: 'Hello Word'), it displays an error when paying (User has already opened the previous request).

Kerolis🇵🇸: Gm/Gn  Is there a doc/video to explain how to buy nfts from contracts like GetGems/Fragment/Etc ?

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: Can anyone help how to mint nfts with python on ton blockchain?

Aleksandr: Gm  Does anyone have experience with memepads and bonding curves?   Need help checking the formula/logic before/after listing and is it in the market or no)  DM if you can help, will connect with the devs  Thx

Okan: I'm trying to buy blum meme tokens but I think the payload is invalid and the transaction is failed. I've tried a lot of things for 3 days but I still can't get it. Can anyone help?

fedya eremin: could u provide any details about operation exit codes? (reply to 144538)

fedya eremin: and, i dont remember, does 3 send mode stand for testnet or i missin something? (reply to 144540)

Satoshi: I lost my deposit... I can’t find it....

Okan: i dont know, i am new in ton (reply to 144543)

Okan: i tried 0 1 2 now

fedya eremin: ok, so give at list exit codes of your transactions (reply to 144545)

fedya eremin: hell no, there two of them 3 and minus something:) (reply to 144546)

Okan: https://tonviewer.com/transaction/788f5055cd2b326ee3587eb04c5c7afeae91c3b83e58d55676aef5f42df319e6

fedya eremin: you now have to find a proper payload opcode (reply to 144539)

Okan: opcode list from code. But when I check the successful operations, I see that the opcode I entered is correct. Also, this was in the sample tone SDK files.  BUY_OP = 0xaf750d34  # Buy operation code

Kerolis🇵🇸: Gm/Gn  Is there a doc/video to explain how to buy nfts from contracts like GetGems/Fragment/Etc ?

User: https://www.npmjs.com/package/@fiscaldev/blum-sdk open this lib sources and see how you need to build cell (reply to 144538)

User: Getgems sale contracts are open sourced, just open them to see what payload you need to send (reply to 144556)

Kerolis🇵🇸: Where are they (reply to 144558)

Okan: already i checked (reply to 144557)

User: https://github.com/getgems-io/nft-contracts (reply to 144559)

&rey: This. Is. Not. The code. Which got run.  Or tonsdk messed up cells yet again. (reply to 144539)

Kerolis🇵🇸: Thanks (reply to 144561)

Kerolis🇵🇸: Uhhhhhhhhhhhhh (reply to 144561)

&rey: Ah I see. Remove .to_boc(False) in the return line, so that .create_transfer_message recognizes its payload is a cell. (reply to 144539)

Okan: like this? (reply to 144565)

Kerolis🇵🇸: What does this mean? (reply to 144564)

WhyesCode: You can hire me (reply to 144534)

Okan: lol (reply to 144565)

Okan: The money was gone and nothing came back this time :)

&rey: Well now you need to configure minimum amount to receive I believe. In that same function. (reply to 144569)

Raymond: New to TON.  Is it possible to build Dapps and SCs in GO of are we limited to their C clone?

Raymond: If so is there any appetite for creating a GO, Rust or MOVE SDK for TON?

&rey: Eventually, any smart contract has to be compiled into TVM assembly. There are no pointers, threads, etc, so common programming languages are just not suitable.  Btw SDK usually has another meaning, being "library to interact with blockchain". (reply to 144572)

𝙑𝘼𝙎𝙄𝙇𝙄𝙔: I don't wanna pay (reply to 144568)

— 2025-03-16 —

Okan: Even when I try it with a low ton fee, it doesn't give an error and transfers money like a normal transfer. In other words, it doesn't see the transaction as a token purchase. I still haven't figured out where the problem is. (reply to 144571)

KTO: Try to increase forward_ton_amount (reply to 144581)

🇵🇸: what does SPECIAL x{010170825CFBA4309E71EB9878798BD781377FA465EED872EEF4EB57C674608C94450014}  mean?   i see it in many contract data.

&rey: You really should emulate those messages first, via tonapi or @ton/sandbox. (reply to 144581)

cryptoDegen: Hello, As an experienced blockchain and fullstack developer, I have great expertise in TON network. Also have already built some Dapps and smart contracts I can work with you. Plz DM me (reply to 144573)

Hobbs: Gm

Daniel: Hi, can I clarify this issue please?   When I connect a wallet using Tonkeeper - I am being automatically redirected back. All the time.   But when I try to make a transaction and use Tonkeeper to confirm it - I am not being sent back to telegram anymore (previously it worked fine). And it also works like this on Android as well. There is no consistency, sometimes it does sometimes it doesn’t. (reply to 142863)

Ad: hello, i am trying to debug my contract using the tvm emulator (pytvm). how do i change the blockLT and current time?

cryptoDegen: Hello! As an experienced Ton developer, I can help you. Plz DM me (reply to 143635)

WhyesCode: You can override them by injecting a custom context with your desired values (reply to 144606)

WhyesCode: custom_context = { "block_lt": 123456789, "time": 1610000000 } result = pytvm.run_message(contract=your_contract, method="your_method", context=custom_context) Just adjust the keys if your pytvm version uses different names.

Ad: None of the methods of pytvm accept a "context" parameter.... (reply to 144609)

WhyesCode: You won't be able to pass those values via a context parameter... instead, you can monkey-patch the TVM globals used by your contract (reply to 144610)

Ad: The example you wrote has a context parameter though... where is that function located? (reply to 144611)

Okan: i didnt fix this problem (reply to 144589)

— 2025-03-17 —

S: hey, guys. how can I check the dump console when I develop a contract with FunC? I have used ~dump() but can't see exact data, instead it shows encrypted value.

TON Bounty Bridge: ​Blockchain Config page  🏷 Approved 🏷 Developer Tool  Summary:Blockchain Config page  Rewards: • 3000 USD in TON  Assignees: ingria Created by ingria

Dario: funcbox (github.com/ston-fi/funcbox) has console::log() function, check it out (reply to 144622)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 54 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 47  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Никита: Can anyone tell me if it's possible to call payload in a transaction without writing a contract?

Freed: in transaction to whom? (reply to 144637)

Freed: you either interact with existing smart contract or create your own

Никита: From the application, call a transaction to a wallet connected by the user (reply to 144639)

Андрей: Let me check your abilities - please describe briefly the steps for placing a MiniApp in the TonStorage (reply to 144607)

&rey: The words to be used are "from the application, request user's wallet application to send a specific message with some payload". It is possible both via ton://transfer and TON Connect 2. (reply to 144641)

Sam: hola! when testing contracts with @ton/sandbox can we safely rely on gas and fee values to be same in testnet and mainnet ?

S: thx for your reply. I have some issue. now I am developing a contract, some kind of parent pattern. and this contract can deploy jetton minter contract. I made this contract can deploy jetton minter contract but jetton minter contract can't send message to jetton wallet contract. more exactly it is working when deployed jetton minter contract is called outside of contract. when it is called by contract, it can't send message to wallet contract. how can I handle this? (reply to 144627)

Michaelzy: Hello good evening. I wrote a script that interacts with my ton smart contract (testnet) using blueprint and it's been working fine the past few days but today i accidentally disconnected blueprint in the 'connect app' section of my wallet (tonkeeper) and now blueprint still shows 'connected' and tries to generate transactions i build but the transactions do not pop up in my wallet. I decided to use generate a qr code for the transaction but when i scan it with my testnet wallet i get an error 'failed'. however it displays when i scan with a mainnet wallet Please is there a fix for I cannot find anything helpful online or in the docs

Michaelzy: hello were you later able to clear it? (reply to 143814)

User<7894330870>: Maybe, I can help you (reply to 143978)

— 2025-03-18 —

Mr: Hello guys I’m building an agent that can swap sell and buy ton with natural language when I ask tge bot to this it does it well but ton keeper flags the transaction as spam   https://tonviewer.com/transaction/c7b6204003f8216c92c76309bd812c620951736c651cace69d6a492d9f0f2074

Mr: Can you pls help me (reply to 144669)

Andrew: The root cause is that 0.01 TON is too small, and Tonviewer thinks this is a weird transaction, possibly a scam or advertisement.  Tonviewer is an independent commercial product. Being tagged as suspicious by Tonviewer is not important. Just ignore it if you are using it for testing purposes. (reply to 144669)

Mr: Right thanks (reply to 144671)

Starsquid: Hi, anyone here that could help me with some fift code? I'm trying to create an initial state for testing using: https://github.com/neodix42/mylocalton-docker/blob/main/docker/scripts/gen-zerostate.fif. The only thing I am missing is to create an account with some funds on the workchain.

Blayce: Hi, I am having issue integrating ton pay to my mini app using ton connect. I built the js file using npm and added the js file locally to my project but ton connect ui stays undefined despite that, I am stuck, I don't know what to do. Can anyone help?

WhyesCode: Fift... I can help (reply to 144678)

Daivd: I can help you. (reply to 144682)

WhyesCode: If you want a complete working script, I have it in react (reply to 144682)

Starsquid: Nice! So what would be the simplest way to get a wallet created and funded in that gen-zerostate.fif? There are numerous wallet creation steps in there, but when I set chain 0 instead of -1, the accounts are created, but I assume not persisted, looks to me that the workchain state is written/saved in the very beginning. That's where I'm stuck atm (reply to 144683)

WhyesCode: Just insert a short snippet that creates your wallet's cell, I mean with its funds and calls add_account into the workchain state before it’s finalized. (reply to 144687)

Starsquid: Yeah, that's my issue. I have no idea what it needs. I assume it's not much, but I am no fift dev. Just want to get a state, to boot up a chain and then be able to interact with that account right away. If someone could provide that needed snipped, that would help me a lot (reply to 144689)

WhyesCode: \ Load the wallet contract definitions include "wallet.fif"  \ Define a fixed wallet public key and compute its address on workchain 0 "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF" hex2bin constant WALLET_PUBKEY 0 WALLET_PUBKEY new_wallet_address constant WALLET_ADDR  \ Set initial funds (e.g., 1 TON = 1e9 nanotokens) 1000000000 nano constant INIT_FUNDS  \ Build the wallet initialization cell (code and state with its funds) INIT_FUNDS WALLET_PUBKEY wallet_init_state constant WALLET_STATE  \ Create a mutable workchain state for chain 0 0 constant WORKCHAIN WORKCHAIN init_workchain_state constant WS  \ Inject your wallet account into the workchain state WS WALLET_ADDR WALLET_STATE add_account  \ Finalize the workchain state (freezing it for genesis) WS finalize_workchain_state (reply to 144690)

Еqf: Found working go script for vanity generation, but in doest work in wasm, it seems like curve25519-voi module uses some assembly optimizations that doesnt suppoerted in wasm, can someone explain how can i fix it ?

meomeocoj | Mike: Hi guy how i can get the BOC code of library, i have key is the code in TonViewer. I have case must test on testnet now in TON sandbox

— 2025-03-19 —

&rey: Generally, you are not entitled to private help from anyone, are you? Please don't call people who behave in just ways like they are scammers, there is already a lot of latter. (reply to 144724)

User<8116657447>: What are you talking about? (reply to 144730)

Combot: Combot has warned DCOD (2/3) Reason: Word **** is not allowed

Ar: Hia Fellas, why the hell getter doesn't work const test = provider.open(await Test.fromInit(54325n)); const counter = await test.getCounter(); Method name must be a string for TonClient provider

Nick: hey, developers  I'm new in TON, but I've worked a lot with EVM, Solana and many other networks.  Is there a service like deBank that would return me data on  DEX Liquidity: Tokens and liquidity retention time in the protocol DEX Trading volume: Tokens and trading volume  Lending/Borrow: Supplied Tokens, Borrowed Tokens +How much and how long is in the position  Yield and Farming: Token + Holding time

Michaelzy: hey

Saksham: Hello everyone, does any one know about the ton-connect sdk for Unity. There are no official docs for that it redirects to an empty page

JΛ⃝: Hi friends, I wanted a code that will allow you to perform a transaction using a 24 word mnemonic and will be automatic. I would appreciate your guidance.

&rey: Have you checked out chat history yet? (reply to 144754)

JΛ⃝: no (reply to 144757)

&rey: Well it has it. https://t.me/tondev_eng/121717 (reply to 144758)

JΛ⃝: Thank you very much. If I want to post a comment, what should I add to the code in the transaction? (reply to 144759)

&rey: "body": "your comment" works fine.  Alternatively, "body": begin_cell().store_uint(0, 32).store_snake_string("your comment").end_cell(). It would port easily to the case where you send some non-text payload. (reply to 144760)

JΛ⃝: This gave an error. remote get method result is not provable, use run_get_method_local for local tvm execution Traceback (most recent call last):     raise LiteServerError(result["code"], result["message"]) pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 0 code. Message: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction 54A08D089124EAA6728CBF04AF492DF947E47EB737430E8051174A7F80DD6680: exitcode=36, steps=13, gas_used=0 VM Log (truncated): ...CTPUSHCONST 19 (xC_,1) execute DICTIGETJMPZ execute PUSHPOW2 9 execute LDSLICEX execute DUP execute LDU 32 execute LDU 32 execute LDU 32 execute XCHG s2 execute NOW execute LEQ execute THROWIF 36 default exception handler, terminating vm with exit code 36  Exception ignored in: <function _ProactorBasePipeTransport.__del__ at 0x0000025031418A60> Traceback (most recent call last):   File "C:\Users\MrRadikal\AppData\Local\Programs\Python\Python310\lib\asyncio\proactor_events.py", line 116, in __del__   File "C:\Users\MrRadikal\AppData\Local\Programs\Python\Python310\lib\asyncio\proactor_events.py", line 108, in close   File "C:\Users\MrRadikal\AppData\Local\Programs\Python\Python310\lib\asyncio\base_events.py", line 745, in call_soon   File "C:\Users\MrRadikal\AppData\Local\Programs\Python\Python310\lib\asyncio\base_events.py", line 510, in _check_closed RuntimeError: Event loop is closed Exception ignored in: <function _ProactorBasePipeTransport.__del__ at 0x0000025031418A60> (reply to 144761)

&rey: Please re-synchronize time on your computer and try again. (reply to 144763)

JΛ⃝: Is my tonkeeper wallet causing any problems? (reply to 144764)

&rey: Well it does NOT influence the script in any way so no it isn't. (reply to 144766)

JΛ⃝: This gave an error. remote get method result is not provable, use run_get_method_local for local tvm execution Error: Liteserver crashed with 0 code. Message: cannot send external message : duplicate message Exception ignored in: <function _ProactorBasePipeTransport.__del__ at 0x0000025926428A60> Exactly what value should be set to send ton (reply to 144764)

JΛ⃝: this is code  async def main():     provider = LiteBalancer.from_mainnet_config(1)     await provider.start_up()      wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)      transfer = {         "destination": "UQD53QuJnplwiHS2GIpigmbITtirt_bQp9QflLVOy5Ue_FTI",           "amount": int(10**9 * 0.2),         "body": None,      }      try:         await wallet.transfer(**transfer)         print("Transfer successful!")     except Exception as e:         print(f"Error: {e}")     finally:         await provider.close_all()  asyncio.run(main())

&rey: That's very much fine actually. (reply to 144768)

JΛ⃝: Can you help me? (reply to 144770)

&rey: Didn't the transfer complete? You should check in explorer, I mean. (reply to 144771)

S: hey, do I need to set allowance and transferFrom function when I build jetton_wallet contract?

&rey: Well jettons do not support such things by TEP-74. Though, it is The Open Network, so you can try building a sound architecture which'd allow transfers not by owner. (reply to 144779)

S: thx for your reply. so where can I research for tis sound architecture? (reply to 144780)

&rey: Well my main choice would be university courses, or alternative, leading to the track of Software Architect.  An important idea from security mindset is: "assume your project/code will fail sneakily, unless you prove otherwise". (reply to 144781)

S: It's perfect. ayk, we set approve to the others when we send tx. but in Ton, don't we need to set this actions? I can't see any actions like this in default jetton wallet contract. (reply to 144783)

&rey: TEP-74 jetton mirrors native TON: owner, and only her, may send transfer order directing her jetton wallet to transfer some to another. (reply to 144785)

JΛ⃝: Yes, thank you for your guide. (reply to 144778)

S: awesome. thx for your support.🫡 (reply to 144786)

J: is the set of validators guaranteed to change between validation epochs?

Пашкевич: Hi friend! I'm trying to create a simple wallet tracker bot that can notify users about any transactions on the wallets they specify.  I've run into a problem — the bot doesn't distinguish between regular transfers and swaps. Regular transactions are easily parsed through the TON API, but swaps just don’t work and bot interpret it like a two separate transactions no matter what I try. I can't figure out which values need to be parsed.  Help me please, am I missing something, or can swaps only be identified through a DEX`es API?

JD: Hello! quick question: is there another docs portal? I'm trying to access https://docs.ton.tg/ but it seems like the site es down

&rey: The one you mention NEVER was official documentation. The right one is https://docs.ton.org. (reply to 144793)

JD: Because that's the link you are opening up when you hit the documentation section

&rey: Scam warning. Official TON site is https://ton.org. (reply to 144796)

JD: Ohh makes total sense now. Thank you

Johanna | Venn Network: Is there a ton builders group or is this where the devs mostly hang out?

cryptoDegen: Hello! Are you looking for ton developer? am here (reply to 144802)

— 2025-03-20 —

CHeCHeN: /stat@combot

Combot: Total messages:144814

Andrew: hi， does anyone know how to generate a ton wallet in Java thanks

Johanna | Venn Network: We're trying to build out detectors for wallet security infrastructure. If the solution is good it can be plugged into a decentralized security network where you're rewarded on an ongoing basis. (reply to 144805)

cryptoDegen: can we discuss in DM? (reply to 144822)

Ar: Hi everyone. Guys where can I check for current Gas prices? Also how much does TON and Jetton transfer cost, are those fixed?

&rey: Gas doesn't change dynamically. You can see its current config at https://tonviewer.com/config. (reply to 144836)

Ar: And is there an official calculated fee for Jetton and TON transfer from SC to Wallet? Just not to overcomplicate my calculations, I believe those should not vary much (reply to 144837)

X1ag: hi everyone, how to send message with only state_init? How much bits i need before store_ref(state_init)?

&rey: Well, that's like .store_uint(0x10, 6) .store_slice(ctr) .store_uint(6, 4 + 108) .store_ref(ctr_init) at mode 3. (reply to 144839)

X1ag: thanks a lot) (reply to 144840)

Daniel: Hey guys, I got a .ton domain for my project but I cant figure out how to connect it.  I did everything through the ton.run website, but they are silent.   Is there another way I can do this?

&rey: It so happens there is. https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees/#fees-for-sending-ton (reply to 144838)

Harry: https://ton.org/grants - I went through this and i am thinking this is a great way to contribute to the ecosystem while recieving funding , I have 2 very stong ideas on this that I wanna build but wanna gather some feedback from y'all , First Idea is to build out a Concentrated Liquidity Market Maker - This is what I saw I have deep interests in building out financial models for trading and the second is a Upwork Marketplace for telegram based on TON (mainly becauase I feel the need that there is no ecosystem to work in this chain and I think with the speed the adoption is growing there should be) - lemme know what do you  guysthink !

X1ag: shouldn't store_coins() also be added? (reply to 144840)

cryptoDegen: Hello! I can work for your defi product as a blockchain and fullstack developer Plz DM me (reply to 144850)

&rey: Already accounted for. (reply to 144847)

Islom: Hello, I have a problem with my TON wallet. It seems compromised because whenever I deposit TON, it gets withdrawn immediately.   Is there any way to protect my funds using a smart contract?   Can anyone help me?

&rey: You must create a new one. (reply to 144854)

X1ag: What if I need to send a certain amount to a smart contract when I make a transaction? How many bits do I need to put in? (reply to 144852)

&rey: Well you'll be better served by ... destination ...     .store_coins(amount of nanotons)     .store_uint(6, 108) (reply to 144868)

X1ag: and send mode equal 0 or 3?😅 (reply to 144869)

&rey: 3, or perhaps 17, depending on whether failure to send message is acceptable or catastrophic. (reply to 144870)

X1ag: but if i put 17 i have actionResultCode: 37 (reply to 144871)

&rey: Y'know, those codes are not secret... https://docs.ton.org/v3/documentation/tvm/tvm-exit-codes#standard-exit-codes Not enough TON to send. Are you trying to send all of those, by any chance? (reply to 144872)

X1ag: no, i'll send 100000000 (0.1 ton) when on balance 10000000000 (10 ton) (reply to 144873)

&rey: Then your destination address must probably be incorrectly stored. (reply to 144874)

X1ag: ok, thanks, i will check it out (reply to 144875)

— 2025-03-21 —

Nish: Hello guys !!! Can I please understand what tech support can be provided by TON nest in building the project, thanks 🙏

TON Bounty Bridge: ​Creating a FunC Language Track on Exercism.org  🏷 Approved 🏷 Education  Summary:This project is about creating a FunC language track on Exercism, an open-source code-academy-like p...  Rewards: • Standard TON Footstep NFT • 1000 USD in TON  Assignees: chakzefir Created by SwiftAdviser

Ar: Devs, Is there a difference of fees between Storage fee for initializing unexisting wallet and storage fee activating an inactive wallet? How can I distonguish this values in config file? https://tonviewer.com/config  Also is there a more detailed doc explaining each value in the config and how this config is defined and where is it stored (on Chain offchain)? Is it modified through TIPs?

&rey: The events you mentioned are the same exactly.  There is. It is stored in the Config special smart contract in masterchain, and instantly available to execution of any smc throughout TON. It can be modified through validator voting only. (reply to 144904)

Maryam: Hey

Ar: What about the DOCS? I feel like there should be one detailed. This raw params don't tell much (reply to 144905)

&rey: I have already said that there is docs page available. It's located at https://docs.ton.org/v3/documentation/network/configs/blockchain-configs, if anything. (reply to 144907)

Buschi: good morning ++ how i can find for our app a TON price_FEED to add also ton in our system ? 🤔

— 2025-03-22 —

卓一凡: Hi everyone, I am developing a new VM that can compile a new smart contract language to various smart contract languages from various blockchains.

&rey: Pray tell, what guarantees can it give? (reply to 144932)

Андрей: @erdchem Good day. I saw your message earlier that you made an analogue of the fragment without the kyc - riftn (similar split). The channel administrators do not approve of advertising messages, so I recommend making a link to your resource on ton.app. I would also like to ask if you are planning to add the possibility of adding coins to Telegram Ads? It would be very useful.

Сергей: Hi everybody! Does anybody develop connection of the telegram bot (not miniapp) to the telegram Wallet? I used this docs https://docs.ton.org/v3/documentation/archive/tg-bot-integration It works fine with Tonkeeper but does not with Wallet (Wallet application claims connection established but connector in bot does not get state update)

卓一凡: you can try it directly (reply to 144935)

Ar: Hi all. is there proposal standard in TON ecosystem like in Ethereum EIPs?

&rey: Yes, it is called TEP. (reply to 144945)

Sebass: Hi every one, Im using tonConnectUI in react to sent a transaction to blockchain. The return is a boc. But is there a way that i could wait until the transaction is completed in order to fetch the JettonData? Or for example when i add a beneficiary to a vesting we specify the token amount. But if we receive the boc fron tonConnetUi and then we fetch the beneficiary data from blockchain some times is to fast and will return the data that is not updated for instance.  Im new to this by the way.  Thank you

₿_taha bayrami_₿: I need a team of TON network blockchain experts for my token project

— 2025-03-23 —

Kunal: Can anyone help me to decode boc to get txHash

&rey: You do know that TC2's BOC doesn't reflect a transaction so it doesn't have transaction hash, right? (reply to 144999)

Kunal: I don't know. So how we can get txn details. Cause when I'm doing txn I'm only getting boc

&rey: Well the good news is, you don't need transaction hash, external message's (in normalized form) hash is quite sufficient.

Kunal: I need txn details like amount, sender and receiver. I'm using tonConnectUI and getting boc

&rey: By the way I recommend against repeating the same message.  In past cases, when it'd been violating chat rules and deleted by me, then second attempt led to ban.

&rey: So did you call tonConnectUI.sendTransaction? (reply to 145007)

Kunal: yes (reply to 145009)

&rey: Then sender is tonConnectUI.account.address, and receiver + amount are those from the object you passed to the sendTransaction call. (reply to 145010)

Kunal: Yes. But how can I confirm the txn is successful or not?

&rey: Wait. You just need a transaction processing service for your backend so that you can accept TON? (reply to 145012)

Kunal: First txn is sent from frontend. Then I want to check txn details from backend to cross verify

&rey: You'd be best served by https://github.com/gobicycle/bicycle. (reply to 145014)

Keshav: hi devs how are we

Keshav: like i am following ton ecosystem from past few years now

Keshav: i am thinking to create a basic onchain kit/ sdk such that dapps can be made in few mins

ＡλＩ: Hi, can I serve .ton DNS over HTTPS? For example, when someone taps on hithere.ton, are there any ways to display something on a regular browser through HTTPS?

Keshav: was looking for feedback from other devs here, what features the dev community needs etc. (reply to 145031)

know: would it be like blueprint? if it generated wallets or other boilerplate contracts besides a “counter” app, that would be interesting (reply to 145033)

TON Bounty Bridge: ​Searching  Created by asim123456789

— 2025-03-24 —

ANDY: Thanks (reply to 145083)

TON Bounty Bridge: ​Dhh  🏷 Developer Tool  Summary:This community will allow you to have referral  Created by maggiston

perfogic: you can check event or trace of tonapi. For txhash, use boc and seqno to calculate external message hash and trace from it! (reply to 145014)

X1ag: @pcrafter Hi, i used what you recommended, but I'm getting a cskip_no_gas error. How can this be fixed? () master::send_deploy(slice user_position_address, cell state_init) impure {     var msg = begin_cell()                       .store_uint(0x10, 6)                       .store_slice(user_position_address)                       .store_uint(6, 4 + 108)                       .store_ref(state_init)                       .end_cell();     send_raw_message(msg, 3); }  From D -> to E  https://testnet.tonviewer.com/transaction/99b52bcbafd265123f0d0ff1f13e7f70e53fddeb482c508b6f02beb76f3985be

.: Hi, Can anyone help me please? I have problem with FunC  Why my smart contract didn’t send transaction?  #include "stdlib.fc";  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {      cell body = begin_cell()         .store_uint(0xaf750d34, 32)         .store_uint(9745, 64)      .store_coins(0)      .store_uint(0, 1)      .store_slice("kQBgxvTSp_Y33NN5gKcOI3su5chy8hgjkThK-08GCLZ0NmkP"a)     .end_cell();      cell msg = begin_cell()         .store_uint(0x18, 6)         .store_slice("kQBgxvTSp_Y33NN5gKcOI3su5chy8hgjkThK-08GCLZ0NmkP"a)         .store_coins(50000002)         .store_uint(0, 1 + 2)         .store_uint(1, 1)         .store_ref(body)     .end_cell();     send_raw_message(msg, 3);}

X1ag: Here’s error (reply to 145102)

X1ag: try to store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)

X1ag: try to: cell msg = begin_cell()         .store_uint(0x10, 6)         .store_slice("kQBgxvTSp_Y33NN5gKcOI3su5chy8hgjkThK-08GCLZ0NmkP"a)         .store_coins(50000002)         .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)         .store_ref(body)     .end_cell();  send_raw_message(msg, 0); }

.: Returned code 34: Unsupported action (reply to 145104)

.: https://testnet.tonviewer.com/transaction/9a5e6ac4a523ec2aad1cae4c07097866237e088508c1a34bc7e56c44a4f1993a?utm_source=tonkeeper

Ar: GM all. Is there a good article explaining how to use VRF Oracle in TON Tact

Nikhil: In TON, due to no shared memory there are no data races but can race between messages from different smart contract exist?  like A->B and C->B  If yes, can someone share any idea for a vulnerable smart contract where such a race causes issues?

Combot: Combot has warned shunz (1/3) Reason: Word **** is not allowed

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 19 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 45  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

.: I redo code for Tact and now smart send transactions, but Jetton master return error wrong op code  But I used this op code and all good  testnet.tonviewer.com/kQBpCFvxvoGLNjs8GSmHSK2nOV7gfRkFNud7om-py1onGlmd (reply to 145106)

Ar: Devs, where can I find a VRF Oracle for TON? I find nothing nor in redstone neither in pyth

Buschi: i searching too :( (reply to 145120)

Buschi: any price feed but looks as no one have

.: Do anyone why smart return wrong op code ?   https://testnet.tonviewer.com/transaction/bbce8655aa678457fb7b0820890581ffb02ef4d887829b3e1ae41d0debd71f7a  Code of my smart: send(SendParameters{                  to: address("kQBgxvTSp_Y33NN5gKcOI3su5chy8hgjkThK-08GCLZ0NmkP"),                  value: ton("0.0501"),                  mode: SendIgnoreErrors,                  body: beginCell().storeUint(0xaf750d34, 32).storeUint(3744717, 64).storeCoins(100000).storeUint(0, 1).storeAddress(sender()).endCell(),              });

&rey: TON Hack Challenge 1's bank: race between  [A =>] B => B A => B (reply to 145112)

&rey: I don't think there is any, since I've shut my one down. (reply to 145120)

Buschi: how a big token as ton can have no pricefeed ?

&rey: Historically, the statement was: 1 TON = 1 TON, exactly. Whichever things are out there, were less relevant.

&rey: There are pricefeeds onchain now,  aren't there?

Buschi: ok so our app do run in $ and can calculate what ever abotu 17 tokens into $ BUT no ton and funny no $_based_tokens   "i love blockchain (TM)"

Ar: But it was your custom right? There weren't multiple nodes supporting your Oracle, so technically it can't be considered decentralised/safe (reply to 145127)

Ar: It works like in chainlink right?

Patrick: Hi, does anyone know how I can estimate the fee of a transaction in Python? Actually, I don't want to use external APIs like Toncenter or others.

&rey: Offchain, that's available. From several sources, which fail at different times.   Onchain, https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/ton-connector/contracts is available.   And Telegram Mini Apps, while offchain, would strongly want you to drop other chains. (reply to 145131)

Buschi: cool thx yess lets build ... but tomorrow(TM)  :))

&rey: Centralized, right. The node was sound in sense that no one could have predicted its random response, and it could not choose to its benefit: that's how Verified Random Functions work. Not particularly safe because oracle could go down any time, probably interrupting contracts which rely on entropy. (reply to 145132)

Ar: Well in that case there is no sense of creating a separate Oracle for this. Better to have VRF in BE it it guarantees things you've just said (reply to 145137)

Ro: Hi, can anyone explain how to make a backup mining(validator) node, can I keep the same wallet for both nodes or how to ensure fault tolerance?  The more precise question is "Can I use the same keys for both nodes, just 1 of them with enabled validator options and another one with disabled one"?

&rey: Better not to do this. Any setting slips and your node signs a fork. (reply to 145142)

&rey: You can have another server but turned off, IIRC.

Ro: If it's turned off for a long period in any emergency case we need to synchronize the stopped node first, that can take a lot of time. (reply to 145158)

Тимур: Hello, did anyone have this problem? exception in fetch(https://ton.access.orbs.network/mngr/nodes?npm_version=2.3.3) I tried using vpn, but still doesn't work

Tronic: I like funC

McDuck | White Core: Have you tried to change the vpn provider? Maybe it will help (reply to 145167)

&rey: The service is sometimes down. It happens. You can see https://tonstat.us to check. (reply to 145167)

— 2025-03-25 —

Not a Pro: Hello, anyone knows how to connect .ton domain to my mini app? The ton.run web service is dead. No one is responding.

Клецка: i beleve, that you just need to add this domain via bot father (reply to 145184)

Mike: Yo, guys! I got four solid devs who just became available — real good at TacT, FunC, Move, Rust, Solidity, Node, and TypeScript. No active project for them right now, so if anyone’s looking for a fire team, hit me up. I vouch for these guys 100%, they’re top-tier. Slide into my DMs if you wanna know the details

Ro: any ideas? (reply to 145142)

jennifer [afk]: hi everyone! can @tonconnect/ui send more than 4 messages?

Linthero: Hi

Saurav: I am new to TON, and I am very frustrated when trying to calculate the transaction fee while sending a transaction to a contract. When executing any custom opcode, I cannot find any tool that accurately calculates the total transaction fee in a single method call, including all fees such as storage fee, forward fee, and compute fee.  I used an API provided by TON Center, but it does not return the correct total transaction fee. Can anyone help me understand how to calculate the fee correctly? Also, how can I calculate the fee when one contract sends a message to another contract?  If there is any tool or method available, please let me know. However, please do not provide a link to the TON documentation, as it is difficult to understand for a beginner. The documentation is filled with links but lacks a single, well-explained article that covers everything in a simple way.

Linthero: Don't worry I've been developing on TON for almost an year now and I'm still frustrated. Basic stuff is not documented well, asking for help usually only results in being mass attacked by scammers (reply to 145201)

&rey: 1. The appropriate way is to tell the sender stateInit also. 2. The common way is to send to UQ- (unbounceable) form of address. (reply to 145200)

fade: do you send ton to the wallet using code or a wallet app? if you use code then you must set the Bounceable flag to false (reply to 145200)

Linthero: Yes, this was the issue, thank you! (reply to 145203)

fade: does anyone know if there is an AST library for func to generate code?

Linthero: Thank the Bounceable flag was the issue (reply to 145204)

Ramesh: I am deployed my own jetton contract in test net it shows the total holders and total supply that same contract deployed in mainnet it will not show total supply and total holders count

Ramesh: Please anyone guide me

Slava: The thing is that you can't predict all the fees accurately. You should make an educated guess based on the properties of your execution chain (like a gas consumption). Measure the fees and adjust accordingly. The established pattern is to send slightly more coins that are required and then pay back the change in the end of your execution chain.  I would recommend looking into jetton wallet implementation for examples. (reply to 145201)

Saurav: 👍 (reply to 145215)

Semion: Hi everyone! I'm trying to implement a TON-USDT swap on StonFi in the testnet.  I encountered an error during the estimation of USDT minOut, the error being: "account not found".  After looking into the library source code I'm using, I realized that the error occurs because the obtained pool address doesn't exist.  func (s *Stonfi) EstimateMinOut(ctx context.Context, amount big.Int) (*big.Int, error) {  _, value, err := abi.GetPoolAddress(ctx, s.cli, s.router, s.token0.ToMsgAddress(), s.token1.ToMsgAddress())  if err != nil {   fmt.Println("Error getting pool address:", err)   return nil, err  }   result, ok := value.(abi.GetPoolAddress_StonfiResult)  if !ok {   fmt.Println("Failed to cast value to GetPoolAddress_StonfiResult")   return nil, err  }   pool, err := ton.AccountIDFromTlb(result.PoolAddress)  if err != nil {   fmt.Println("Error parsing pool address:", err)   return nil, err  }   // WARN: outputted address doesn't exist  fmt.Println("Pool:", pool)   _, output, err := abi.GetExpectedOutputs(context.Background(), s.cli, *pool, tlb.Int257(amount), s.token0.ToMsgAddress())  if err != nil {   fmt.Println("Error getting expected outputs:", err)   return nil, err  }   result2, ok := output.(abi.GetExpectedOutputs_StonfiResult)  if !ok {   fmt.Println("Failed to cast output to GetExpectedOutputs_StonfiResult")   return nil, err  }    outputValue := big.Int(result2.Out)   return &outputValue, nil }   Is it even possible to make such a swap on testnet?

Ar: if you want to make a new contract file (.tact .funC) without manually writing wrappers and tests for them from zero just  npx blueprint create [contractName] inside already created project :)))..... The first bad option was answered to me here and I was asked about it by another one whom I don't remember to tag.. Sorry, hope u see this

Defi Fomo: Looking for people with a deep understanding of dex on ton  Details in dm

0x: Maybe, I can help you (reply to 145219)

Jimmy: Can i make site on .onion and use it for checking Crypto Price?  For sure i need to ask, can i check crypto price on some site with .onion domain?

&rey: Specific domain does not do anything in regards to functionality of external APIs. Any API for querying TON price should work the same. (reply to 145228)

Jimmy: I asked a stupid question, I forgot about filtering onion servers (reply to 145229)

Jimmy: Sorry for time

Jimmy: That's your people? (reply to 145229)

&rey: No. Admins don't DM you, nor ask anything first (money especially). You can block that chat. (reply to 145233)

Jimmy: Yes, i can. But i want show it to you. That's all (reply to 145234)

Jimmy: I can scam scammer?) (reply to 145234)

&rey: 1. Scamming is illegal in most jurisdictions. I cannot recommend it. 2. It is risky on psychological basis, since it can be turned back sometimes. We shall stop at this. (reply to 145236)

Buschi: biggest sacm on me was a complete fake telergam group from an exchain which not have any telegram group.. and i found a lot of project websites which have no telegram link but any telegram rooms are running in her names ... there must be any way to scan the project pages by a bot and do a sign on the group for "tihis is not linked on from original website" ...   "hmmm" ...

ＡλＩ: Can we convert TON to Stars and send them to a profile using the API?

F.R.E.D: Hello guys  Pls I need help with telegram mini app  I'm trying to access the user telegram id on the frontend so I can use that to add to the body of an endpoint for the backend of our application  Pls does anyone here know how to go about that?

Whoami: Can anyone here help me with fragment for a username exchange?

&rey: It is not related to development over TON. Please use secure facilities (preferably onchain, like Fragment or Getgems) and remember to doubt any DMs from scammers. (reply to 145267)

&rey: As a first step, you can go in @devs. (reply to 145258)

&rey: I suppose it is possible to organize a program if there is a pool of money, though it will still suffer from information shortage on new projects. Not very related to development over TON, though; I've seen that topic fit in TON Society chats. (reply to 145262)

Daniel: At Aura, we strive to change the way users interact with DeFi, and we need a middle Backend Developer! 🚀  We are looking for a Python Middle Developer to create SWAP and limit order systems in Telegram applications through integration with DEX. If you are passionate about blockchain and fintech, this is your chance!  Why Aura?  Cutting-Edge Tech: Work with DEX protocols, Telegram Bot API, and financial systems. Impact: Your code will ensure trading security for users. Growth: Join a fast-growing startup where innovation is valued.  What we are looking for: — 3+ years of experience with Python (async/await, Web3, REST/WebSocket). — Knowledge of DEX integrations (Uniswap, PancakeSwap) and fintech systems. — A secure approach to handling users' funds.  Ready to get started? Information about the vacancy: https://lnkd.in/dUF2hPUV  Documentation for the project: https://lnkd.in/d-AFnzEN  Apply: Send your resume and a description of your relevant project in DEX/fintech.  Format for incoming messages:  — Can you describe a project where you designed and implemented a backend system in Python? — Do you have any experience with blockchain, especially the TON blockchain, or are you willing to learn? — Have you worked with decentralized exchanges or bot development, like for Telegram, and if not, are you open to learning? — Can you share a project where you handled financial data, and what interests you about the crypto space?  Also, please share your CV and link to GitHub. Contact @kk_sudo

F.R.E.D: Thanks (reply to 145269)

— 2025-03-26 —

NeiroDoge: Help, Does anyone know how to solve this garbled problem?

⚡Mohammed: Hello TON Community,  I'm currently working on a payment management system on the TON network, and it works well with internal payments coming from Web3 wallets that include Jetton data and memo information. I now want to expand the system to support external payments coming from exchanges such as Binance using the TONCENTER library.  My question is:Is there a reliable way to process external payments through the TONCENTER library? What are the best strategies to distinguish these payments (for example, by using the memo address) so that they can be correctly identified and linked to the payment records in my system?  Any advice or practical experiences from the community would be greatly appreciated. Thank you very much!

Combot: Combot has warned Hustler ! (1/3) Reason: Word **** is not allowed

Nikhil: can someone please give me an overview to understand the vulnerability in TON hack challenge-1 for bank

Алина: ext-in message can not contain the sender's address at all?

&rey: It can. Such an address cannot be trusted, though. (reply to 145310)

Muhammad Javad: Hello guys I have a simple error in RunGetMthod using tonutils. Anybody can help to find the solution?  https://github.com/xssnick/tonutils-go/issues/313

Vladimir: @tonrh (reply to 145315)

WhyesCode: What's the issue? (reply to 145315)

Muhammad Javad: Fixed! By using beginParse method on builder in tonutils SDK (reply to 145330)

Sandra: /stat@combot

Combot: Total messages:145334

Timofei: Hi guys, please help. I tryed many things but can't figure out what the issue is... I deployed the same NFT contract for collection as getgems uses (literaly took it from tonviewer) but i don't understand how to enforce tonviewer to see my metadata hosted offchain.   My contract: https://testnet.tonviewer.com/kQCmS4UcTk1lUv2g3w9q-mWVHREazOs0RJ4dN7yncAkYZqzC The origin contract: https://testnet.tonviewer.com/kQBrgmknEuON060A7Ixdoxl_EzuLqxwjKEuBh6NmbEGQO-Lt  I compared results from get_collection_data and they are the same... Where am i wrong?  Edit: on getgems website everything works fine, but on tonviewer not :(

&rey: looks fine to me (reply to 145340)

— 2025-03-27 —

Timofei: Hmm, indeed, today it looks indexed and fine but my previous one still not indexed: https://testnet.tonviewer.com/kQAQBZC3rOO4S2mMeKUooKrki7dqEqfzWEaNOjvUJia0TQ16  Did you do something or just opened the link? (reply to 145341)

&rey: I just opened it. (reply to 145365)

Lasha: Hey everyone, I'm trying to generate a wallet address using just a private key and HD index, without on a mnemonic. As far as I know, it should be possible, right? I’ve been trying to do it in Python but haven’t gotten it working yet.

&rey: await wallet.from_private_key or like. (reply to 145379)

Ali:  2. Send message paying for storage, with StateInit = last stored state. Anyone can do this. Yes, having those cells is required; if archival nodes are available, that is quite easy.  and what if size is >64kb? +- 98kb still not possible? (reply to 136374)

— 2025-03-28 —

TON Bounty Bridge: ​Ton  🏷 Developer Tool  Summary:Best token  Created by azz89

Ro: Hi, still want to repeat my question, how to ensure fault tolerance of validator node? How to switch keys between nodes? Can I just have 2 nodes with the same keys(wallets), but 1 with option validator = active, another one without it and in emergency case just to make active a second one? Is there another option for this purpose?

Oleg: Hey all, how to get USDT on testnet

Andrey: Just mint your own (reply to 145415)

Sergei: Hi, everyone! Can you guys recomend mass payout service?

Slava: Hey. Why not use a highload wallet and a simple script? (reply to 145430)

Sergei: There are business requirement, that single transaction for all payouts should be signed outside of backend app (reply to 145433)

Anoke: hi maybe someone can explain this thing Sometimes I try to send my transaction in chain but it doesnt mine in block. I should retry broadcasting a lot of times to see that my ransaction mined. I use tonweb.js

Ro: So ton devs don't have ideas how their product works?) (reply to 145410)

Jimmy: Hi, everyone!  Could someone point me to a tutorial, article, doc or any other material that could help me execute signed transactions in ton?

Anoke: i used ton official documentation and sdk(also can be found in docs) (reply to 145437)

Slava: Build the transaction and deliver it to a client app, sign with TON Connect.  You can even do it entirely on the client without using a backend if you like. (reply to 145434)

Slava: I'm sure that there are some common sense things that you can implement on your own, however you can also contact the validator support for advice. (reply to 145410)

Jimmy: Could you please send me the link where this info is? (reply to 145439)

Slava: Hey, external messages are unreliable. You should continue sending them until the message is processed. Sending through several different endpoints will also help. Ideally, you should run your own LS. (reply to 145435)

Sergei: I try to implement scenario, when I prepare raw transaction on backend, sent it on front for sign there. I don't want to store seed phrase on backend. First what I do, it's wallet contract opening on backend:   const subWalletIdResult = await tonClient.runMethod(Address.parse(this.tonConfig.walletAddress), 'get_subwallet_id'); const subWalletId = subWalletIdResult.stack.readNumber();  const publicKeyResult = await tonClient.runMethod(Address.parse(this.tonConfig.walletAddress), 'get_public_key'); const publicKey = Buffer.from(publicKeyResult.stack.readBigNumber().toString(16), 'hex');   const networkGlobalId = this.tonConfig.chain === 'mainnet' ? -239 : -3;  console.log({ subWalletId, publicKey, networkGlobalId });  const v5Wallet = WalletContractV5R1.create({   publicKey,   walletId: {     networkGlobalId,     context: subWalletId,   } });  return {   a: Address.parse(this.tonConfig.walletAddress).toRawString(),   b: v5Wallet.address.toRawString(), };   Values of subWalletId and publicKey are correct, I checked on tonviewer, but addresses a and b in result are different. I think I do something wrong with walletId, but not sure.   Thanks everyone for advance!

perfogic: will do check for you the reason tomorrow but to answer your question. Yes, it is possible. You can build the boc message like this: ''' return (builder: Builder) => {     builder.storeUint(0x0f8a7ea5, 32);     builder.storeUint(opJettonTransferSwap.query_id, 64);     builder.storeCoins(opJettonTransferSwap.jetton_amount);     builder.storeAddress(opJettonTransferSwap.to_address);     builder.storeAddress(opJettonTransferSwap.response_address);     builder.storeSlice(opJettonTransferSwap.custom_payload.beginParse(true));     builder.storeCoins(opJettonTransferSwap.forward_ton_amount);     builder.storeBit(opJettonTransferSwap.either_payload);     let cell1 = beginCell();     storeSwapParams(opJettonTransferSwap.swap)(cell1);     builder.storeRef(cell1);   } ''' Send this boc in base64 or hex to client. Wallet will fetch it's seqno and sign it create signed boc and broadcast it. Fe use some thing called ton-connector if i remember it right (reply to 145446)

&rey: Shouldn't this be simply subWalletId? The onchain value is already combined. (reply to 145446)

Sergei: Thanks for your answer. It will help me on next steps. Currenty I'm trying to open V5 wallet contract for sign atleast simple transfer transaction (reply to 145450)

Sergei: Sorry, didn't understand you (reply to 145451)

Dmitry | backend4you.ton: If you use TonConnect on front to sign tx - you don’t need to think about sub wallets and contracts on backend. Prepare body/payload in backend and return it to front. Front / tonconnect will pass your data to current user wallet for sign. You will not even know address of signer u til it actually signs (front can return signed tx box back to backend if you want to parse it) (reply to 145446)

Sergei: Yes, thank you. I got it. But still curious, what is wrong in my snippet (reply to 145454)

— 2025-03-29 —

Nikita: Thanks for the elaboration, very helpful (reply to 145215)

&rey: Frontend will: tonConnectSdk.account!.address! (reply to 145454)

Jorge del Christo: Does anyone here know a storage app like Dropbox but in Ton or Telegram?

Jorge del Christo: storage apps, Store data on the blockchain or on distributed network nodes.

Kirill: Hello everyone. Please tell me how best to make sure that the first message always goes one hundred percent. Right now, 0.003 tones are enough to send, but as I understand it, in theory, it may stop being enough   fun createUser(userStorageAddress: Address, userAddress: Address, invitedId: Int, value: Int) {         let userId: Int = self.nextUserIndex;         self.nextUserIndex = self.nextUserIndex + 1;         nativeReserve(self.minTonsForStorage, 0);          send(SendParameters{             to: userStorageAddress,             value: ton("0.003"),             mode: SendIgnoreErrors,             body: SetupUserStorage{                 userId: userId             }.toCell()         });          let init: StateInit = initOf FtUserMain(userId, myAddress());         send(SendParameters{             to: contractAddress(init),             value: 0,             mode: SendRemainingBalance,             body: SetupUserMain{                 owner: userAddress,                 invitedId: invitedId,                 programs: self.programs             }.toCell(),             code: init.code,             data: init.data         });     }

Dmitry | backend4you.ton: Indeed. But to pass this value to backend in safe manner (without risk of being changed or faked) he’ll need to verify tonProof which will require him to get wallet public key (backend side, read from blockchain). Not a problem of course, but still design decision that not always actually needed. (reply to 145465)

Dmitry | backend4you.ton: Good TON practice: put more than needed and return excess back (reply to 145469)

Kirill: Thanks (reply to 145471)

Markus: What kind of data do you want to store? (reply to 145467)

crypto: how to get transection hash before the transection confirmation

crypto: anyone please reply

crypto: which tool using the tonviewer to get it

Jack: 2025-03-29T06:29:54.457Z WARN  [tonlib_client::client::callback] [ton-conn-3] Invocation error: request_id: 3, method: RawSendMessageReturnHash, elapsed: 557.177333ms: Tonlib error (Method: RawSendMessageReturnHash, code: 500, message: LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction D1AEC6F54204E9E651574F58D395ADAF58BBB94AF70A47FD215B07CECC4DDBF5: exitcode=133, steps=49, gas_used=0 VM Log (truncated): ...SIGNU execute PUSHCONT x28945F0ADB31E1F2C087 execute IFNOT execute XCHG s2 execute NOT execute XCHG2 s0,s7 execute AND execute THROWIF 132 execute XCPU s2,s5 execute EQUAL execute THROWIFNOT 133 default exception handler, terminating vm with exit code 133 what's the error in testnet? thanks

crypto: /stat@combot

Combot: Total messages:145495

&rey: It has some parameters that are only determined in the gen block so TRANSACTION hash isn't possible to get in advance. (reply to 145478)

&rey: Normalized-external-message hash, actually. (reply to 145481)

Dmitry | backend4you.ton: These high (> ~30) exit codes are not standardized, every contract throw them “when it wants”. Generally, you need source code of contract to find when it throws this error code.  Probably you are dealing with regular wallet, so first of all check that seqno is correct. I don’t remember exit codes for wrong seqno, so it’s just a guess (reply to 145482)

Jack: thank you

Anoke: here is documentation and sdk that TON recommend to use https://docs.ton.org/v3/guidelines/dapps/apis-sdks/sdk (reply to 145444)

Hello, World: Hello!  Can you recommend templates code for jetton, nft to develop on top of them smart-contracts fast?  I found out a project: "tonion-contracts" and want to choose it to not reinvent the wheel, but maybe you can share more code templates that better than this one?  I would like to know a little bit more about code templates written in TACT language.

Anton: hi, you can find jetton contracts here: https://github.com/tact-lang/jetton (reply to 145507)

Hello, World: Yeah, thanks.  I can see some repositories with tact jetton used 'jetton-helper' file to create a metadata for jetton. But how can I create a metadata in tact code?  For example: Main smart contract deployer: to deploy jettons (for example create pools when user call some function inside there).  So, the answer where can I read more about how cell works under the hood to understand the logic of that js code and how to recreate it in tact. (reply to 145508)

— 2025-03-30 —

Alexey: Hello everyone!  Maybe someone tried to build TON monorepo for WASM? I'm struggling with the same issue on both testnet and mainnet branches related to autogeneration in tl subdirectory which for some reason don't generate files during cross-compiling  if (NOT CMAKE_CROSSCOMPILING)   find_program(PHP_EXECUTABLE php)    set(GENERATE_COMMON_CMD generate_common)   add_executable(generate_common ${TL_GENERATE_COMMON_SOURCE})   target_link_libraries(generate_common PRIVATE tdtl tdutils)   add_custom_command(     WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}     COMMAND ${GENERATE_COMMON_CMD}     COMMENT "Generate common tl source files"     DEPENDS generate_common scheme/ton_api.tlo scheme/lite_api.tlo scheme/tonlib_api.tlo     OUTPUT ${TL_TON_API} ${TL_LITE_API} ${TL_TONLIB_API} ${TL_TONLIB_API_JSON}   )   add_custom_target(tl_generate_common DEPENDS ${TL_TON_API} ${TL_LITE_API} ${TL_TONLIB_API} ${TL_TONLIB_API_JSON})   if (TONLIB_ENABLE_JNI)     target_compile_definitions(generate_common PRIVATE TONLIB_ENABLE_JNI=1)   endif() else()   add_custom_target(tl_generate_common) endif()  make[3]: *** No rule to make target '/ton/tl/generate/auto/tl/ton_api.cpp', needed by 'tl/CMakeFiles/tl_api.dir/generate/auto/tl/ton_api.cpp.o'.  Maybe someone faced the same problem?

Adam: Hi, if anyone need a ton smart contract developer contact me

TON Bounty Bridge: ​Saroukhani  Created by saroukhani

angel: The problem occurs because the TL  code generation step is skipped during cross-compilation, but the build still expects those generated files to exist. (reply to 145535)

Alexey: Exactly, but I'm not trying to build anything other than funcfiftlib, func, fift, tlbc, and emulator-emscripten using the standard bash script in the assembly/wasm directory. Why do these components depend on generated sources even if this step is skipped, and if it shouldn't be skipped, why is that? (reply to 145557)

angel: even though you're only building func, fift, tlbc, and emulator-emscripten, some of these targets have transitive dependencies on TL-generated sources (like ton_api.cpp) due to shared internal libraries. (reply to 145559)

angel: The reason the generation step is skipped during cross-compilation is because generate_common is a native binary and cannot be executed in the emscripten environment. To resolve this, the recommended approach is to run tl_generate_common natively on your host machine, copy the generated files to tl/generate/auto/, and then proceed with the WASM build.

angel: This ensures all required files are in place without modifying the cross-compilation flow.

Alexey: Ow, thanks a lot, it explains much, can i ask for another one hint, how can i run tl_generate_common, its uodate-tlo.sh in scheme folder, or i need to just run native build for my platform and they will be generated? (reply to 145564)

angel: don’t need to run update-tlo.sh. just run native build for your platform. (reply to 145565)

Alexey: thanks again, you are awesome) (reply to 145567)

angel: welcome (reply to 145568)

Adam: Sure thing (reply to 145572)

Adam: You can look for the tx hash using any tonapi

&rey: You'll get external message hash (which doesn't yet guarantee anything). Tonapi can find corresponding transaction chain. You should check that inProgress is false and value movement for your receiver account is correct. (reply to 145577)

Adam: Not the tx hash but the external message hash (reply to 145577)

&rey: Please check Toncenter's https://toncenter.com/api/v3/index.html#/actions/api_v3_get_actions. (reply to 145581)

TON Bounty Bridge: ​Addressed #335  Created by MazepaDeni

— 2025-03-31 —

Alexander: Hello, is it possible for a bot to buy Gifts for itself? And can a bot find out what Gifts a user has?

Hello, World: On chain buying? (reply to 145592)

Rodrick: We mean usual telegram nft gifts (for example right now I have 1 onchain gift and 2 usual gifts in my profile) — is it possible for bot to get info about them? (reply to 145593)

Hello, World: I guess through user bot you can try to get it (reply to 145594)

Hello, World: Check telegram api

Rodrick: Yep it possible through user bot, but it’s not always comfortable( That’s why it’s interesting if it’s possible to do using usual tg bot (reply to 145595)

&rey: Not related to TON. (reply to 145594)

Rodrick: Em, on chain telegram gifts are related to TON (reply to 145598)

&rey: Well onchain interface of those gifts is 1. NFT interface 2. closed-source oracle called Fragment.  A question related to this chat would be "how to buy an NFT verifying it is of specific collection?" (reply to 145599)

Rodrick: Oh I got your point If I want to find out info about if bot can check that user have these nft gifts and if bot can own/forward these nft gfts — where should I ask this question? (if you know) (reply to 145609)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 19 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 47  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Hello, World: But how actually on chain verification for jetton/nft on ton works?  Or it requires off chain getter of collection code and particular nft code to pass it into on chain in message and then do something with it? (reply to 145609)

&rey: More precisely, collection code, collection data and NFT index. I don't know if there are faster general solutions. (reply to 145612)

Hello, World: Thanks (reply to 145613)

Lasha: Hi, I need Python library which help me to use RPC methods, this is so import I need RPC methods. methods what i want, get balance jetton and ton, send jetton and ton, scan block or get transactions based on Address

Lasha: Can someone suggest me?

Mr: https://chatgpt.com/share/67ea6f56-f0e4-800c-8964-aa370b6f39a6 (reply to 145617)

Lasha: None of the options are working.

Lasha: The second option, TonWeb, is not an available library in Python—ChatGPT provided incorrect information.

&rey: Check out pytoniq and/or tonutils, please. (reply to 145617)

Lasha: pytoniq have RPC Support?

&rey: Using LLMs to guide you in TON has proven outright dangerous. Please don't do it since it may even harm you. (reply to 145619)

&rey: No, it has support for direct connection to liteservers. That's safer but if not available then use next option:  tonutils does. (reply to 145624)

Lasha: How can i get transactions based on address? Can you show some example? (reply to 145626)

Lasha: As i get if i want to get this function i have to use liteservers

Hello, World: Sorry for asking again, but how can I pass other information if JettonTransfer placed in payload and if I will modify it the event will no longer sent token event.  It works, I can handle it with: Part of tact code:  receive(msg: JettonTransferNotification) {         self.forward(             self.owner,             "JettonTransferNotification event".asComment(),             true,             null,         );     }  But have no idea how to get info about token, because I call jetton wallet to sent token and when it's done, I get message in my smart-contract (I sent tokens to smart contract), but in this case no possible way to pass data to token receive handler. (reply to 145613)

Hello, World: For now the graph path looks that (image pinned above).  From my ton keeper I sign transaction (by using TS code to init transaction in my above dialog message) .  It goes through jetton wallets to my smart-contract.  Smart-contract when receive message (any token transfer) sent message to some address (in this way for the same address that deployed contract).  So, the code works fine, but next I would like to process this token, get it info, verify it to do other next operations. But no idea how to pass jetton info via all of this transaction messages.

&rey: .storeMaybeRef(yourForwardPayload) after 0.17 TON.  In fact, without it your message is not TEP-74 compliant and fails on some jettons. (reply to 145630)

Hello, World: So, I can pass my data in the Cell inside storeMaybeRef? (reply to 145632)

Hello, World: And then this payload data will be available to parse in receiver(msg: JettonTransferNotification) ?

&rey: msg.forwardPayload.loadRef() and use it however you want. (reply to 145634)

Hello, World: So, it is safe? No will destroy origin structure / message structure? (reply to 145635)

User<7619500073>: /stat@combot

Combot: Total messages:145638

zoie: hello, I made a transaction , a highload v3 wallet transfer ton to a v5r1, and depoly v5r1 contract and transfer v5r1's usdt.   but transaction failed with code 37(compute phrase),  Can anyone help me？     https://tonviewer.com/transaction/0eba55113beb9c0bd322b35e77098f8620ceb3bf249e3693adadb1b044fb3f17

&rey: Moreover it is intended for that usage. (reply to 145637)

&rey: Well absence of that hash doesn't necessarily mean transfer failed, IIRC. (reply to 145640)

Hello, World: So, now call func addr look like this, But jetton transfer is 0x0f8a7ea5. However, the transfer is complete. (reply to 145648)

Hello, World: Now, I have this code in payload.  And can handle passed data.  But still no idea how can handle token validation, maybe I can get jetton wallet address and get some info in getter (get_wallet_data) then get owner and try to connect them both (calculate if they are matched)

Hello, World: Is this only for off-chain call or I can pass message to it getter to obtain info about jetton wallet?

Slava: Find the transaction in the Blockchain and verify it's properties, like message hash, value, etc. (reply to 145651)

Slava: Why don't you read the official docs for starters? (reply to 145661)

Slava: https://docs.ton.org/v3/guidelines/dapps/asset-processing/payments-processing (reply to 145664)

Sir Bosco 7⃣2⃣: Hey TON Dev Community, I'm looking for a Technical Co-Founder to Build Vibex – A Music Platform with Web3 Rewards on TON.  I’m Okoro JohnBosco, a passionate founder working on Vibex, a music platform that blends Web2 streaming with Web3 rewards, built on TON’s fast and scalable blockchain. I’m looking for a technical co-founder to join me in creating a new way for artists and fans to connect through music.  What is Vibex?  Vibex is a music platform where Artists can upload their songs for streaming, reaching fans worldwide.  Fans can stream music and earn tokens as a reward for their engagement.  We are leveraging TON to bring Web3 benefits to the music industry, creating a fairer ecosystem for artists and fans.  What I Bring to the Table  Clear Vision: I have defined Vibex’s core features and a roadmap to launch an MVP by early 2026.   Funding Plan: I’m preparing to apply for a TON Grant to support development.    What I’m Looking For  A technical co-founder who's have experience with Web3 and TON blockchain passionate about music and Web3 to help build Vibex.  If you are interested, DM me here or email me at okorojohn12@gmail.com to learn more. I will love to chat and share more about my vision for Vibex.  Looking forward to connecting!   OKORO JOHNBOSCO   Founder, Vibex

User<7596541438>: hi do you still need TON dev? I am a func & TS developer. (reply to 140181)

DeFi: What are you offering in exchange for a technical founder? How much are you hoping to raise in grants or investment? (reply to 145669)

— 2025-04-01 —

zoie: hi, highloadv3 how can send a msg with init?

zoie: found it!  containing state init (such messages, if required, may be sent using the special op code to set the action cell after an internal message from Highload wallet to itself) (reply to 145684)

Hello, World: Hello!  If I understood it right for now no way to validate jetton / nft on-chain that jetton has master wallet that I need, as also as NFT item can't be validated that from NFT collection that I need?  I don't found a messages to send from jetton master key by its address to verify that jetton wallet is true its wallet, and I can get nft static data (and collection address), but collection smart-contract has no on-chain message to verify that NFT item is really from right collection that I needed to handle when receive to my smart-contract?

Willy: https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md  You can make something similar on any master type contract (reply to 145686)

Hello, World: Ok, thanks. But this implementation for jettons only? Not for NFT to be able to validate all nft items from the nft collection? (reply to 145687)

Willy: If you are writing a smart contract yourself,  you can add similar messages into your master/wallet contracts

Willy: Maybe I am not understanding you correctly

Willy: This is standard requirements, rather than implementation (reply to 145688)

Hello, World: Yes, you're right that I can do this on my own. But I can do this only with jettons because for jettons I do my own implementation. However I want to support any NFT collections with default standard and there's no on-chain proof (that nft item is really from collection that I need to handle) for this unfortunately. (reply to 145689)

Hello, World: Yeah, true (reply to 145691)

Willy: Oh, yes, if you want to interact with many NFT master contracts, there is no current standard for such NFT proof, as it is in jetton standard (reply to 145692)

Hello, World: I trying to write a smart-contract that will able:  1. Receive NFT 2. If NFT from the collection I needed I want to handle it (for example send something to user) 3. The problem is I can get NFT but can't be sure that NFT is from the right collection (reply to 145690)

Willy: You may be able to calculate and check initOf data if you have master address init data and contract binarys/source code/smth (reply to 145695)

Willy: Not sure tho

Hello, World: But it's works only for one nft item (reply to 145696)

Hello, World: Also as a check received nft item address

Willy: You need to pass all this data for each transaction (reply to 145698)

Hello, World: But in this way users can pass it's own data and smart contract will work not as expected (for example handle other nft, that I do not want to) (reply to 145700)

Willy: If you save only one specific NFT master address in your contract, you will handle only needed (as only they will give you correct initOf data for your master contract)

Hello, World: But it requires to pass data/code in forward payload for each nft or so, in every transaction that user interact with? (reply to 145702)

Willy: Sounds like you really want to have a forward message in your NFT transfer.

Hello, World: Yeah, I will try it out (reply to 145704)

Hello, World: I hope in forward payload I can put lots of data, so it will enough memory to put nft item code for example.

&rey: You know the collection address since before deploying the contract? You can embed all of collection address, code and data; forward payload would only contain 256-bit NFT index.

Hello, World: Yes, I thought about this way, but wanted to pass nft code in forward payload. Because some smart contracts can change their code so if nft collection update the code my smart contract will has an error while trying to verify with old code/data? (reply to 145708)

&rey: 1. Your way accepts malicious NFTs. 2. Can NFT collection even change the NFTs it refers to? I don't think TEP-62 is fine with it. (reply to 145709)

Hello, World: No, I will check nft collection address with StateInit address and then calculate nft address (based on data passed) and check if it matches with received nft (reply to 145710)

&rey: But that doesn't handle "if nft collection update the code" in any way. (reply to 145711)

Hello, World: So, it would be better to add its code right in smart contract, if in previous your message you said that it's not changes over time (reply to 145712)

Ar: Hi all. Do I get it right there is no VRF currently in TON, but anyoine can become a kind of a node as it works in chainlink, gather some trust score and become a valid provider?

User<7062442470>: How to look at the transaction that appears on tonkeeper and make one?

User<7062442470>: With the help of tonweb (reply to 145721)

TON Bounty Bridge: ​Interactive Tutorial for Tolk (like the one in Codecademy)  🏷 Resource  Summary:Hi, right now there are no interactive courses on Tolk where users can see the tutorial, tweak the c...  Created by terryds

User<7596541438>: I am a func ton developer, if anyone wants to build mini-app or other projects on TON, let me know

Saurav: I used Multisig Contract v2 code in my project, where the order contract code is stored in a ref cell and fetched by the multisig contract to deploy new orders. Initially, I encountered some errors related to this, as well as multiple errors while deploying a new order, including exit code 9. To fix these issues, I made some changes, with the major one being that instead of storing the order contract code in a ref cell on the blockchain, I stored it inside the multisig contract (parent) and deployed it from there.  I just want to know if this is the correct approach or not. If not, does anyone have the latest code along with the least Blueprint dependencies? The existing code seems very old, and the dependencies are outdated, which is also causing some Blueprint  command fail with erros.

🇵🇸: can anybody tell what does special x{}  mean?

🐼 Sild: that it's not a data-cell (in fact it's a library cell: Library cell contains 8-bit tag of library 0x02) https://docs.ton.org/v3/documentation/data-formats/tlb/library-cells (reply to 145730)

DEVCW75: Hello, how can I do a swap using a walletContractV4? (I'm using stonfi as a dex). I followed the guide on stonfi but I don't want to use tonconnect. I just want to try send the transaction using only ton package.  Are there some conditions different to a normal transfer?

Денис: I caught a bug on a random transaction that query_id is incorrectly displayed in tonviewer

Денис: Tx: 41d3f9fd9b30d85acc640926c3e1b09106d7000f5c2fc8cb58ad3f5458d6c813  query_id displayed: 6083770389372068000, right one: 6083770389372067676  Why so:  Take body, remove 32 bits for opcode, take following 64 bits for query_id:  0F8A7EA5546DE4EF998FDF5C4033B06C080125C28235CA... => 546DE4EF998FDF5C Convert into dec => get right number

Денис: Unfortunately can't add links

Denis: This is javascript rounding bug in GUI. We will fix it

Ali: Hey. Still not possibile to unfreeze frozen contract if data >64kb ?

&rey: I don't think it will be possible; after all, chain doesn't support new big contracts either. (reply to 145759)

— 2025-04-02 —

Willy: Hey everyone 🖖🏻  Is there anyone, who has tried both Tact and Tolk?  Can someone share a difference between these languages for an average smart contract developer?  Is Tolk more efficient in terms of gas?  Does Tolk support functionality, that is not included in Tact?  I know, if I want a bridge type contract or something very efficient I need FunC.   But my question is should I go from Tact to Tolk like right now, as fast as I could? Or is Tolk still in the early development phase, so its functionality is not yet fully developed and tested?  Please, Tolk/Tact developers, share your thoughts  Thanks in advance

Daniil: Tolk is a low-level language, a fork of FunC with many enhancements, while Tact is a high-level language with many abstractions. So, Tolk gives you more control over logic.  At the same time, abstractions in Tact make development easier, faster, and more maintainable without losing much gas efficiency.  But note that Tolk is not released yet. For now, it’s better to use either FunC or Tact. (reply to 145766)

Ar: @pcrafter Hi do you have docs on how to settle my own oracle up?

&rey: Unfortunately not. (reply to 145772)

Ar: But is it technically possible for users? (reply to 145773)

Ar: I just don't get the model

&rey: If you're speaking of ECVRF, it is possible (by consulting the docs linked and implementing algorithm from there, since my impl was proprietary due to certain requirements). (reply to 145774)

&rey: Here are the steps: https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-vrf-15#name-ecvrf-proving.

Ar: I am not talking only about VRFs, I can implement it myself. I am talking about settling up an oracle ourselves and becoming a trusted datafeed provider like it works in chainlink for EVM chains. Does it work here too? If yes are there plans to make it more accessible for devs and make some materials explaining the architecture. (reply to 145777)

&rey: "trusted" is only relative to some protocol. TON doesn't have embedded protocols for importing data so no "trusted" definition.  (well except oracles to Ethereum and Binance, which are stored in network config) (reply to 145778)

&rey: 1. tonConnectSDK.sendTransaction can return a BOC even if no transaction is actually requested of blockchain. It isn't safe to credit user outright. (reply to 145780)

&rey: 2. To actually wait for transaction tree, use https://docs.tonconsole.com/academy/transaction-tracking. (reply to 145780)

Ar: In EVMs this feature is not integrated too, but it is implemented by pseudoSmartContracts that communicate with it's outter component on BE. But at least it is protocolised and anyone can a chainlink node itself and provide data (Protocol also defines user's score based on valid data provided by the particular provider). That's chainlink, what I see in TON? RedStone and Pyth which I guess don't have cgainlink's abilities. Do I get you right, we should create this datafeed infrastructure ourselves by injecting data into TON? (Won't be decentralised though) (reply to 145779)

dicke: Hello: I would like to ask how to connect the ton wallet, because I have an h5 game that I want to put on the TON APP. Are there any specific steps?

dicke: Since it was my first contact, I didn’t quite understand it.

Brad: Hello, is it possible for a wallet to relay a transaction for another wallet? I am interested in providing Gasless transactions for our users that are sending a custom Jetton. Currently from my understanding gasless transactions are limited to the Jettons available at /v2/gasless/config

&rey: The latter one must be v5, and its app must support signing internal-msg requests. (reply to 145788)

Brad: Thank you! Do you know if the flow is documented anywhere or if there are any examples available in code? (reply to 145789)

&rey: The code is most faithful and complete documentation :-( (reply to 145790)

Brad: very true, are you aware of any examples available in code? where the messages are built and sent?

&rey: Tonkeeper app must have it m (reply to 145793)

Odd: Hello Sers! Anyone here looking for skilled team of devs & designers? Reach out for our portfolio & let’s build!

Aleks: Anyone knows if GetGems have APIs to bulk refresh NFT items metadata?

Ilya: Hi! Can you tell me, please, if there is a way to calculate how often I need to top up my smart contract or send messages to keep it active? Let's say I have a smart contract that is active, but I rarely or never send messages to it, but the data it stores is important to me.

&rey: There is. (reply to 145800)

dicke: H5 game is listed on Tonapp and Tonapp responded that there is no Ton ecosystem. What does it mean?

Ilya: Can you explain, please? (reply to 145801)

boot adbot: Is there a way to bulk generate wallets? similar to solana-keygen, i want to create a vanity address

&rey: Sorry for the delay; I hope you were able to find https://docs.ton.org/v3/documentation/smart-contracts/transaction-fees/fees-low-level#calculator-example in meantime. (reply to 145804)

ANDY: Hello Ton Developers

— 2025-04-03 —

Ay: Hello

Ay: I want to join a group of developers working in the field of website and application development.

TON Bounty Bridge: ​Ton payer  Created by ruslan328

Egene: Does anyone have any experience with hosting large websites on .ton ?

Egene: For some reason whenever I use anything that is just a bit more complex than some simple html and css the website no longer loads ...

Egene: Are there any examples of any .ton sites that actually work other than: foundation.ton ???

Egene: foundation.ton

Egene: Lol even the foundation.ton doesn't load when opening it from this group chat 😂

Egene: Are ton sites dead?

Hello, World: I can open a .ton domain websites, just clicked at the link in tg and it did open (reply to 145831)

Egene: I can load it up once in 2-3 tries

Egene: Some times this warning

Egene: Are there any other sites that work? (reply to 145833)

Hello, World: I tried reopen it multiple times and sometimes it is not loading a website content (reply to 145834)

Hello, World: Maybe something in a server or in protocol or in telegram, who knows

Hello, World: I will try to load it from my smart phone, maybe telegram client produce this error

Egene: That's the issue I am having with my site.  If I upload something extremely simple (for example the default apache index.html)  It works fine.  If it's anything with loads of stuff (images, JS and a lot of CSS) It seems not to work (reply to 145840)

Egene: I tried via my own ton proxy as well, seems to be about the same

Hello, World: From smart phone it's the error when open a site

Hello, World: Always occurs in my case

&: Does anybody knows how does c5 pop work?

angel: first: install ton connect sdk. second: connect to wallet third: send transaction accord to gam logic (reply to 145786)

Web3: Hello everyone Gm gn y'all, hope you are doing well.

ANDY: Yh surw (reply to 145858)

gyn: Hello all, noob question: what could be the best way to run local network on ci testing?

Mahyar | TeleSwap: Gm, we are developing Bitcoin<>TON bridge. We need 100 testnet TON for testing. How can I get that?

&rey: Please check that with @f_closer. (reply to 145877)

User<7596541438>: Hi, Could you share the current status of development? (reply to 145877)

Mahyar | TeleSwap: doing final tests on testnet (reply to 145888)

User<7596541438>: great. are you developing it alone? (reply to 145889)

— 2025-04-04 —

Mahyar | TeleSwap: we are a team (reply to 145890)

User<7596541438>: oh, do you have any other plan to develop new thing or expand the current project after this test? (reply to 145891)

Mahyar | TeleSwap: we plan to launch btc<>ton bridge/swap on mainnet in 2-3 weeks (reply to 145892)

User<7596541438>: yeah, it would be great (reply to 145893)

User<7596541438>: I mean, after this, what do you plan any other thing? (reply to 145893)

perfogic: this sounds great. i used to build a btc<>cosmos/swap, can i get your docs to know more about your project ? On Ton, i'm building CLMM 😆 (reply to 145893)

Willy: You have experience on cosmos? What are your thoughts on the ecosystem and today's stage of their tech?  In terms of scalability, they are TONs direct competitors for building new internet, I think. But I don't hear from them that often (reply to 145897)

Combot: Combot has warned Hello, World (1/3) Reason: Word **** is not allowed

PetX: @vladislavmain Check my DM

Hello, World: Well, I even don't know what word is not allowed by this bot (reply to 145910)

&rey: One about "without charge", 'course.  Check out Toncenter's v3 indexing API (it might be in Orbs as well), check out tonapi. (reply to 145912)

Hello, World: But what that word is not allowed to write 🧐 (reply to 145913)

Hello, World: I was able to only use some basic methods by using orbs provider with ton client from ton library. And it requires to check all the things manually.  Maybe I had misreading documentation in some point.  I will check that again. (reply to 145913)

Lasha: Hi, I have jetton boc, i want to decode it. Can someone help me? i need python code

Mahyar | TeleSwap: nice 👌 DMed you (reply to 145897)

QWxp: got 48 (reply to 145877)

German: Could you share an advise, people? Conencted new TON Wallet with UI, but some rare people don't see it loading. Tested on all devices, it works everywhere for me, so I cannot reproduce it 🙁 What can be an issue?  The app is named Jivo Pets. Cannot share a direct link here.

Hello, World: I did a little more research. Orbs ton-access has no support of toncenter v3 api (only v2 without lots of handy methods). However, toncenter has 1 request per second without api key, so I will use it for get started. Thanks for your help. (reply to 145913)

Ivan: You can register an API key for Toncenter for free.Then it will have unlimited RPS (reply to 145928)

Ivan: Hello developers, I've encountered an issue and can't figure out what's causing it.  I'm trying to use the swap functionality through StonFi, using their SDK in TypeScript, along with @ton/ton. However, when I call router.getSwapTonToJettonTxParams(params); it results in endless requests being sent.  Has anyone come across this behavior? I can't understand what's going wrong.

🐼 Sild: Hey it's better to ask in https://t.me/stonfichat (reply to 145934)

— 2025-04-05 —

Hello, World: I through I find a way to validate NFT on-chain and it works, but now I understood that someone else can write a custom nft contract to look like another nft collection.  Code from tact docs: inline fun calculateNFTAddress(index: Int, collectionAddress: Address, nftCode: Cell): Address {     let initData = NFTItemInitData{         index,         collectionAddress,     };      return contractAddress(StateInit{code: nftCode, data: initData.toCell()}); }    My code for on-chain nft check: receive(msg: OwnershipAssigned) {         let forward_payload: Cell = msg.forward_payload.asCell().beginParse().loadRef();          let nft_index: Int = forward_payload.beginParse().loadUint(64);         let nft_code: Cell = forward_payload.beginParse().loadRef();          let calculated_address: Address = calculateNFTAddress(nft_index, self.NFT_COLLECTION_ADDRESS, nft_code);          let string_builder: StringBuilder = beginComment();         if(calculated_address == sender()) {             string_builder.append("NFT is correct! ");         } else {             string_builder.append("ERROR NFT!");         }         string_builder.append(nft_index.toString());         string_builder.append(" ");         string_builder.append(calculated_address.toString()); ................. }  It works fine, but I guess if someone will write a custom item contract that will have the same init as passed via payload forward, so my contract will check it and say that nft is correct, but it's not the correct one!  So, now I have no idea how to really check (on-chain) nft item that this is the item from collection I need, not from another collection.  Only can imagine to pass NFT item code when init my smart-contract, because when I did my tests with getgems test version, all my nft had the same smart-contract code.

Daivd: Hi. How can I connect Ton wallet on PHP?

₿_taha bayrami_₿: Hi

₿_taha bayrami_₿: I am looking for a blockchain development team, project manager, and advertising manager.

Daivd: No, just wanna connect on PHP

&rey: Connection is mostly about client side. (reply to 145952)

Daivd: I am using PHP as client side (reply to 145967)

&rey: Please give a snippet via "page source" tool in browser because you're likely mistaken on this. (reply to 145968)

nkr: Hey, do you know any platforms similar to Sellix for integrating crypto payments on a site, with no KYC or restrictions, where you can sell anything? Thanks

&rey: Consider installing bicycle for server side; the stack will be clear from documentation. (reply to 145978)

— 2025-04-06 —

Combot: Total messages:146003

Victor: Hi, I have enabled ton payments with tonconnect ui on my telegram mini app, but seems that Nigeria users are not able to fetch the logo image from two of the wallets. I have tested it myself under a nigerian IP and that's true, two of the tonconnect included wallet logos are not fetched,so my question is, is there a way to filter the wallets that will display the tonconnect widget?

Rocket: Hi everyone, could someone please advise on the correct way to verify a transaction when using Ton Connect?  As I understand it, there are several approaches:  Sending a BOC from the frontend and then verifying it afterward.  Monitoring our wallet directly, checking all incoming transactions, and crediting user balances based on transaction comments, for instance.  What is the most appropriate and efficient way to handle this?

WhyesCode: Try different IP (reply to 146005)

Timur: what’s up guys!  i looked at the wallet v5 code, did i properly understand, that i can allow someone on my behalf to send message for example to my jetton wallet etc?  and based on this trusted person will pay commissions, right?

₿_taha bayrami_₿: I need a developer for my blockchain project.

WhyesCode: Okay. Reach out (reply to 146020)

₿_taha bayrami_₿: Thank you, buddy.

User<7894330870>: I have experience with that. (reply to 146019)

&: DM me (reply to 146020)

— 2025-04-07 —

Combot: Hello vinyl☉market! Click on the button below so that we understand that you are not a bot who came to tell us about how Durov is giving away bitcoins as a gift.

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 19 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 50  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

0xbadcode: Hello guys, I'm trying to send a message to tact contract from the wallet owner using pytoniq, but I received exit code 35. All is working in TonIde, does anyone have any idea of the problem?

0xbadcode: import asyncio from pytoniq import LiteBalancer, begin_cell, WalletV3R2  from config import CONTRACT_ADDRESS, MNEMONIC  async def execute():     async with LiteBalancer.from_testnet_config(trust_level=1) as client:                  wallet = await WalletV3R2.from_mnemonic(client, MNEMONIC)          try:             result = await wallet.transfer(                 destination=CONTRACT_ADDRESS,                 amount=10_000_000,                 body=begin_cell().store_uint(0, 32).store_snake_string("Message").end_cell()             )             print("reault:", result)         except Exception as e:             print(f"err: {e}")   if __name__ == "__main__":     asyncio.run(execute())

&rey: Contract's problem; please attach transaction hash and/or contract source. (reply to 146050)

Hon. Festus: @pcrafter thanks for your help so far... How can I get my Jetton Wallet Address, not the jetton master

&rey: That's detailed in https://docs.ton.org/v3/guidelines/dapps/cookbook#tep-74-jettons-standard. Precalculate it for well-known jettons. (reply to 146059)

&rey: Notes: 1. If you don't recognize a jetton wallet, then it most certainly isn't a valuable thing. 2. Should you implement autodetection, remember that contract might pretend it's jetton wallet, reporting any master of its choice. Check with master and owner address. 3. Remember that transfer notifications are not mandatory. (reply to 146060)

0xbadcode: The contract is ok, running via TonIDE works normally and also via TonConnect via telegram bot and approving the transaction, as per the code below. However, I want to implement the automatic execution of this message. async def execute():     connector = TonConnect(MANIFEST_URL)     transaction = {         'valid_until': int(time.time() + 3600),         'messages': [             {                 "address": CONTRACT_ADDRESS,                 "amount": str(10_000_000),                 "payload": urlsafe_b64encode(                     begin_cell()                     .store_uint(0, 32)                     .store_string("Message")                     .end_cell()                     .to_boc()                 )                 .decode()             }         ]     }     result = await asyncio.wait_for(connector.send_transaction(         transaction=transaction     ), 300)     print("result:", result) (reply to 146057)

Evgenii: La dirección de TON se pasa como una cadena? (reply to 146062)

&rey: In English, please. (reply to 146062)

mikey: I can help you (reply to 146019)

0xbadcode: Sorry, my bad (reply to 146064)

0xbadcode: Edited (reply to 146062)

Manuel: Hello everyone,  I'm trying to set up my development environment to start building on TON, and I've encountered an issue with @ton/blueprint. I installed it globally using npm:  Bash  npm install -g @ton/blueprint The installation seemed to complete without critical errors, although I did get some cleanup warnings initially, which I resolved by forcing the installation.  However, when I try to run the blueprint command, I get the error:  Error: command not found. Run 'blueprint help' to see available commands I have verified that the npm global prefix is C:\Users\mepf\AppData\Roaming\npm, and this directory is included in my system's Path environment variable. I also confirmed that C:\Users\mepf\AppData\Roaming\npm\node_modules\.bin is in my Path.  Interestingly, I found a .bin directory containing what might be the blueprint executable at the following location:  C:\Users\mepf\AppData\Roaming\npm\node_modules\@ton\blueprint\node_modules\.bin However, when I navigate to this directory in my terminal and try to run ./blueprint --version (or ./blueprint.cmd --version), I get a "command not found" error.  Could someone please provide guidance on how to correctly use the blueprint command after a global installation? Is it intended to be run differently, or am I missing a configuration step?  Any help would be greatly appreciated!  Thank you.

0xbadcode: In this case, yes (reply to 146063)

Aleksandr: Token launchpad on TON — live, backed by tier-1 investors, and evolving into a core DeFi layer. The focus now is scaling infrastructure for meme coins, community tokenization, and beyond.  We're looking for a Technical Lead to join part-time and go deeper if there’s mutual interest. The role is flexible — you’ll start by advising, but there’s plenty of room for hands-on involvement and shaping the direction of the tech.  What you'll do:  – Review, audit, and provide feedback on smart contracts (TON/TVM) – Identify architectural weaknesses or tech debt and suggest fixes or rewrites where needed – Help build a clean and scalable infrastructure for the token launchpad and future products – Collaborate on developer workflows and internal tools/processes – Guide the team on best practices for scaling towards more complex products (e.g., a DEX and beyond) – Be a technical sounding board for product and roadmap decisions – Optional: contribute hands-on with code or reviews when it feels impactful  DM me if this sounds like your kind of thing

— 2025-04-08 —

Алина: Does the number of instructions in a wallet's smart contract affect the speed of transaction inclusion in the blockchain?

mikey: Maybe not as the number will be affected to gas fee as I see... (reply to 146080)

Arash: Hello, I have 1 question: Does TON Blockchain supports secp256r1?  Or it is only supports secp256k1 (K1) ???

Алина: From the validator sources (which are hardly readable) i get a sense that mempool transactions are pushed into a vector and then just  processed one-by-one in a first-in-first-out fashion without randomly shuffling and without processing them in paralell (which is surprising). Can someone confirm my observations? 😅😅

mikey: Sure (reply to 146089)

Alice: Hi all, i wonder does any bot support sending alert on swap for a specific token? i knew there were some for evm,but wonder if there is possible on ton

&rey: There are some (and mentioning specific ones happens to be out of scope of this chat). (reply to 146092)

&rey: I can confirm they are hardly readable. (reply to 146089)

Алина: 😳 is there's anyone walking the face of the earth or some specification that could explain how mempool is queued/dequeued? (reply to 146095)

Desmond: Hi folks, do we have TON dev from Ghana 🇬🇭 here?

WhyesCode: Can someone here help with an issue in my fift code pls?

mikey: Here (reply to 146107)

mikey: I am from Gana

Mr. Barry: Yoo fam, I need a help plz dm me I will pay for your help

&rey: Asking for DMs is not allowed. Please describe what's the problem. (reply to 146132)

Mr. Barry: Ohh (reply to 146133)

Mr. Barry: OK, I see (reply to 146133)

Сергей: Hello! Can anyone advise how to verify a coin on ton, github request was rejected by some unclear reason . Does anyone know how to handle it? Thank you for help in advance!

Vardan: Do you mean TonKeeper? (reply to 146138)

— 2025-04-09 —

Сергей: Yes (reply to 146142)

Vardan: I have not solution, will follow that other guys will offer in this chat, it will be useful for me too. (reply to 146147)

Lee: Why does the same transaction of ton have two different hash values?

Lee: https://tonviewer.com/transaction/0e9be81a7c5d2dacac8e45f46d770fad40a5e91d862cc3dc71bc3c692c150117 https://tonviewer.com/transaction/d53bcc9c74f7a5f9c00f49843127664be1d4959dc70bec7ba61eedcbdd1a0ebc

&rey: Because it's not the same *transaction* if we're using TON terms correctly. https://docs.tonconsole.com/academy/transaction-tracking (reply to 146159)

Dmitry | backend4you.ton: because TON actually has TWO transactions here (reply to 146159)

Devmustee💎: Platforms like Getgems and Tonviewer don’t currently support native ton-storage:// links for loading NFT metadata or media.  If you’ve migrated your NFT content to TON Storage but it’s not displaying, here’s why: You’ll need to use an HTTPS gateway to serve the content — ton-storage:// URIs won’t render directly (yet).  Use a public gateway (if available) to convert your TON Storage links into HTTPS URLs for compatibility. (reply to 143998)

Devmustee💎: TON uses two types of hashes: Logical hash: Based on the transaction content  consistent across the network. Physical hash: Includes block-specific data can vary even for the same transaction. (reply to 146159)

Devmustee💎: So if you see two different hashes for the same TX, it’s just different layers of representation. Stick to the logical hash for reliable tracking.

&rey: This is false or wildly relabelled. (reply to 146170)

Lee: How can these two hash values be converted? (reply to 146159)

Lee: The hash value I got with tonutils-go is different from the one in the browser.

卓一凡: dm me (reply to 146020)

Hon. Festus: That's the problem of the ton blockchain... Different value for same parameter it can get really confusing... Especially for beginner devs

Alireza: Hi there, something strange happened. I bought the domain angelerator.ton from https://dns.ton.org/, and it was available at the time.  However, after a few days, I checked the domain again and saw that it now points to a different address and is owned by someone else — without any indication that I was ever the original owner, and without me selling or transferring it!  Here is my transaction: https://tonviewer.com/transaction/bda80027ec65a595a0441d8fed030d4e6b72cbc15ec0922afcec2fc1962c9a05  And this is where the domain is now: https://dns.ton.org/#angelerator  It seems like a bot might be stealing domains. Could you please help me understand what happened?

Slava: You've probably started the auction by your initial transaction and then someone outbid you.  You can't just "buy" the domain name directly. You can do this only via an auction. And you better have enough TON coins to even start it, because squatters (bots) will try to still it from under you and then make you pay a hefty price for it. (reply to 146181)

Alireza: isn't it ridiculous? when I get an untaken domain it should be mine basically and it should be me hold a auction! (reply to 146182)

Slava: Well, the system is designed to give everyone a chance 🤷‍♂️ (reply to 146183)

Alireza: this way only bots will be holders since they are getting stronger over time, so no value to have any domains

Slava: I don't really like the bot situation either. Well, in any case it is too late to do anything about this.

Alireza: how to propose to fix this bad design on Ton, it's bothering the community? (reply to 146187)

Slava: 99% chance you won't be able to do anything about this. However, you can always create a proposal. (reply to 146188)

Alireza: you mean more about bots or changing the way it's held? because it could be fixed just by not holding aution for the first purchase (reply to 146190)

Slava: There's nothing you can do about bots, technically speaking.

Alireza: yes but we could do it costy for them,  at the momemt they are waiting for a domain to be purchased then they go for it because it's way cost efficient for them rather than paying hugebamount of money for random domains (reply to 146193)

Thaha: Hi, who has experience with llm please write to dm, I have a few questions, I'll give you a small gift for your help

Slava: What does that have to do with TON? (reply to 146196)

Thaha: dapp

Hello, World: Just use chat gpt api (you can use it with llama as well) (reply to 146196)

sniper07: Hello. I am looking at a good TON smart contract developer

&: You can see different tx hash on each contract/address. actually there's many txs when you submit external message. (reply to 146160)

Alchi: Post jobs on @tonhunt. (reply to 146202)

Nxrix: Does dedust have api for getting price of a jetton?

Start: So Im trying to run my own testnet with TON (not connected/related to public testnet) but I dont wanna use that Java tool with GUI(forgot its name) in my head steps should be like this (BTW Im coming from EVM based chains so bear with me)  1. generate keys for 2 Docker nodes 2. set config for different blockchain ID  3. maybe some network adjustments for these two to find each other on Docker localnet   couldnt find any good resources. even had problems to generate keys can some one point me to good direction cheers

&rey: Well you should consider checking how exactly MyLocalTon does it, even if not running it. You might need more nodes than just two. (reply to 146224)

Start: it's what im doing ATM but honestly reading Java i a pain. was hoping there is a docker-compose somewhere (reply to 146227)

&rey: I don't think your hope is founded. On the other hand, Java code can be converted into text pseudocode using LLMs.  Note: LLMs do not know TON. That prevents them from writing correct code in FunC or Tact, or from having correct context. However, they still retain general capabilities of re-explaining code they see. (reply to 146228)

— 2025-04-10 —

Goose: Hey - I tried using the support bot linked on the TON site, but it isn't working. Kind of trying whoever I can get at this point.  Can anyone help me with this? Seem to have encountered a bug with the TON bridge, sent 2k USDC and didn't receive it on the other side, and it's hard to get into contact with anyone.  https://x. com /0xChefGoose/status/1910173100001423455

Ansar: hi everyone,

Ansar: i am new to Ton network can someone suggest me resources about smart contract development and testing on Ton network . thanks

Dmitry | backend4you.ton: https://docs.ton.org ? (reply to 146249)

Lee: how to get usdt transaction's payload with tonutils-go?

Alchi: You can see sample txs on tonviewer. Tonviewer shows detailed tx boc structure. (reply to 146252)

mikey: This is one of the most famous scammer! I did the call with him. (reply to 146266)

Hon. Festus: Thanks bro. This was helpful.  What I'm noticing now is that, even if a user doesn't have a particular jetton, for example USDT but they have TON in their wallet, it doesn't say insufficient balance but just transfers fees and adds the transaction onchain like they sent the expected value. (reply to 146060)

Hon. Festus: I am trying to send USDT here but instead of saying insufficient balance as I do not have any USDT in the wallet... It's sending TON. And then saves onchain with the expected value.

Dmitry | backend4you.ton: do you have tx explorer link ? (reply to 146271)

Hon. Festus: https://tonviewer.com/transaction/448ecd8f17c6ec61173af8d2252a06013b4779785d3eb827a2fccb7ca8a23995 (reply to 146272)

Dmitry | backend4you.ton: You are sending message to nonexisting contract. It fails to process it (it does not exist) and transaction bounces back to you, minus gas spent. (reply to 146273)

Dmitry | backend4you.ton: That's "expected" blockchain behavior.  The App that created message for you to sign should, maybe, check that you have something, before giving you a sign request. (reply to 146274)

Dmitry | backend4you.ton: Also, maybe you have wrong address - jetton transfer message has no indication what jetton is being transferred, so message (sign) data is not enough to check that you really have enough of some jetton

Hon. Festus: I am using tonapi getBlockchainTransactionByMessageHash endpoint to validate transactions from my backend.  I do not get this indication from the payload so I can just check against it to avoid crediting value to users in this category. (reply to 146274)

Hon. Festus: When I test the app against a Jetton I actually have in my wallet it works as expected... (reply to 146276)

Dmitry | backend4you.ton: who _created_ the tx that you are tracking ? (reply to 146277)

Hon. Festus: I am building the app... And testing it... I created the tx (reply to 146279)

Dmitry | backend4you.ton: maybe because when you _have_ some jetton - its jetton wallet contract do exist, and tonkeeper (etc) can see that this is jetton wallet and understand what jetton it bound to, and check that you actually have required amount... But in tx above - nobody can stop you from sending "random" message to "random" nonexisting contract ) (reply to 146278)

Dmitry | backend4you.ton: so, before creating tx for user to send his jettons - check that jetton wallet address actually exists. (reply to 146281)

Hon. Festus: I think I get you here...   I can actually check that the user has enough jetton balance before asking to sign but I still want to be able to validate that from a backend to ensure that wasn't bypassed somehow... (reply to 146275)

Dmitry | backend4you.ton: that's two different things.  you should check user jetton wallet before giving him tx to prevent him from losing TONs for gas if he doesn't have that jetton.  and later you should find his transaction in your wallet (find JettonNotification from your jetton wallet about transfer from user wallet) to verify that transfer actually happened (reply to 146284)

Hon. Festus: Yeah you're right... (reply to 146285)

Dmitry | backend4you.ton: also, make sure that you won't "find" same transfer notification for two different user transfers for same amount (imagine user uses phone and notebook to initiate two transfers from same wallet for same amount at same time, you give him two TX to sign (actually, two identical ones), he signs one of them, but you "wait" for both on backend, and when one arrive - you should not mark "two" transfers as completed, only one of them :) ) (reply to 146285)

Hon. Festus: "Find JettonNotification in your jetton wallet"  Can you elaborate on this? Is there an API endpoint I can use for this? (reply to 146285)

Hon. Festus: Hmmm... 🤒 (reply to 146287)

Hon. Festus: Exactly will definitely check against this... (reply to 146287)

Dmitry | backend4you.ton: that's "usual" endpoints for reading wallet transactions. you should check opcode (=jetton transfer notification) and then look into payload (see TEp-74) to find amount and sender. (reply to 146288)

Hon. Festus: Okay noted. Thank you (reply to 146291)

Hon. Festus: With the endpoint I was using before getBlockchainTransactionByMessageHash, it'll still record the expected value and sender address, so cannot use that to validate who actually made the transfer and who didn't. (reply to 146291)

— 2025-04-11 —

sniper07: Is there anyone who is familiar with smart contract development in TON?

Yeifry Trader: I'm a test developer (reply to 146307)

sniper07: Do you have experience in smart contract development? (reply to 146314)

Yeifry Trader: Yes

Yeifry Trader: Something basic like scripts in Code Spaces Developing

Lasha: Hi, I generated a wallet address, the state was nonexistent. After that, I transferred USDT from Binance to this wallet, but the address was not activated, and now the wallet status shows as uninitialized. Later, I also transferred TON from Tonkeeper, but the status remains uninitialized.  https://tonviewer.com/EQCu8rrU3XYl9QXxXWEVMn16X2fWFQYmIFzz5nM3qEVUAWd3

Eva: Do any send transaction from your wallet (reply to 146328)

sayhelloandrey: hello guys, tell me pls how to parse tx results onchain?

Denis: It will be automatically activated on first outgoing transfer. It's ok. (reply to 146328)

Lasha: Okay thanks, and can you suggest me when i have to use bouncable true to sending transaction? what is the best practice?

&: If you do sth with that wallet then you can see it's initialized (reply to 146328)

&rey: If transaction can, in theory, fail, and there are funds left to return to user. (reply to 146334)

Lasha: As i checked binance does not send bouncable tx, it is so weird for me. And also they use send mode 1

ㅤㅤ: Hello everyone, Ok I need some information, Suppose I have a token on BNB chain and it’s a Main Network project as well. Can I also create its pair on TON and link it with the BNB or and the Main net.

Kourakos: Hey i'm new here. (Sorry if i dont speak english that good). So i had an idea about an app in the ton blockchain whih i think that it would be a very interesting project and also attracte many users into the blockchain. Though i can't make it happen alone but I don't know where and with whom to share. Any ideas? I appreciate any help

Kourakos: I believe that it would become mainstream easily and also help its users for real (not like most of the projects😕)

Kourakos: Is there like someone or some bot that you share your ideas with

WhyesCode: Yes. You need help? (reply to 146307)

Dmitry | backend4you.ton: when you pay to somebody (e.g. just give him money) use bounce=false, because his wallet may be still uninitialized. when you send message to smartcontract which you expect should do something - use bounce=true so if it fails - you will receive your money back (well. minus gas fees). (reply to 146334)

Mfizo: I would  like to know who I can contact regarding partnerships and collaborations. Thank you.

— 2025-04-12 —

&rey: If you're contacting TON Foundation, then you're welcome at partnership@ton.org. Anyways, this chat is NOT the place to discuss such. (reply to 146367)

🔳 ivan: Hi everyone. Looking and NFT Item code (nft created on getgems) I see there is no way to get NFT owner address onchain. How can I onchain verify that an address actually is the owner of the NFT?

Willy: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md  NFT Item must implement "get" methods to meet the  requirements of TEP standart (reply to 146374)

&rey: Such a guarantee would be void by moment it arrives, because user can transfer her NFT to another wallet addr. (reply to 146374)

— 2025-04-13 —

Mojisola🍅 🍅: you should first ensure nft is in the right address you want before you can proceed because ton is asynchronous network (reply to 146374)

— 2025-04-14 —

Lasha: Hi, how can I check the status of an outgoing transaction? I'm using send mode 3, and the compute phase completes without any errors.

Mojisola🍅 🍅: you query the address of receiver or transaction for status

Lasha: I don't want to query address of receiver, so what option do i have?  Can you tell me which rpc method do i need to get transaction status?

Mojisola🍅 🍅: ton blockchain is different.  you have to query an address for it latestss transactions

Lasha: Well, I have just one option, if I want to detect my outgoing transaction status, I will scan receiver address. right?

Lasha: otherwise i have to use another send mode, i use sendmode 3

Kourakos: Hey guys. I am trying to built a team to develop a very interesting project in ton Blockchain. Though i find it very difficult to find useful people. My idea is a very interesting non profit project that would really help crypto users, non crypto users, ton Blockchain and everyone if it is built. If you think you can do anything to help this project become achievable or help build it, please dm me.

A: Please how can I track my ton coin

Mojisola🍅 🍅: sendmode doesn't matter regarding checking a transaction status (reply to 146447)

Mojisola🍅 🍅: yes. or the sender as well. Just check the transaction and pick what  you are looking out for (reply to 146445)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 19 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 56  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Hon. Festus: After transaction you receive boc, decode that, extract message hash, then use that to fetch the transaction on the blockchain using tonapi (reply to 146450)

Алина: How is everx-labs/ever-node related to TON?

TON Bounty Bridge: ​@antipainK Hi, The usage of `idLessThan` is to query the next page. Assume there are 100 pieces of data, `limit` = 10,  Created by MazepaDeni

— 2025-04-15 —

Lee: 235e11cb96c6909f5a684f6710c9be84f9465b21cefead5069171ccc2fd31f49  和1e5ba94cd335ba5e8b4d96c75f0a790a06b48981a26f01a429ee278b829a3b1b  是同一笔交易的tx  hash，为什么会出现2个hash?

Combot: Combot has warned Crypto Coders (1/3) Reason: Word **** is not allowed

Vladimir: 🧠 Tact Smart Battle 🤜  Join the ultimate smart contract challenge powered by Tact, organized by TON Studio & Codeforces  🏅 Prize Pool — $20,000 in Toncoin!  🎯 Challenge Tasks: 1. Simple Voting — basic voting system. 2. Serial Voting — multiple proposals via a master contract. 3. Scalable Voting — support up to 4 billion voters. 4. Voting with Refunds — refunds to voters. 5. Gas-Managed Voting — fully optimized contracts.  🏆 Rewards: - Top 128 participants share the prize pool and receive exclusive Soulbound Tokens (SBTs). - All participants with valid solutions also receive a Participant SBT. - SBTs include embedded on-chain developer reputation.  ⭐️ Additional Perks: - Top participants will be invited for job interviews at TON Studio.  ⏰ Duration: 7 days  🗓️ Start Date: April 21, 12:00 (UTC+3) 🛑 Deadline: April 28, 12:00 (UTC+3)  Registration: 👉 Challenge Link (Codeforces)   Registration guide: 👉 Notion link  Community & Support: 👉 Telegram Challenge Chat  Good luck and may your contracts be efficient and bug-free! 🚀🔥 (forwarded from TON Contests)

Richard: Can anyone explain to me why if I send Jettson to someone it costs me about USD0.32 but if I send TONcoin to them it costs me USD0.01 yet both are on the same blockchain

Dmitry: When you send toncoin to someone, there is one external message from your wallet app and one internal message from your wallet contract to their wallet contract.  When you send jetton, it triggers a chain of several messages between wallet and jetton wallet smart contracts. You pay transaction fees for each. That's why it gets more expensive (reply to 146519)

Complex: Hello everyone. I created an open-source, self-hosted service for non-custodial payment processing in TON.  I'd like to share it with people, but the bot bans links. I'll write it like this: github com txsociety spice-harvester.

Willy: Sending native coins (changing native balance) and sending tokens (changing smart contract information) always will cost differently, because it is literally a different amount of bits (one's and zero's) that needed to be changed in the system.  Works for every chain. (reply to 146519)

Lasha: Hi guys, Can you tell me how can i track my jetton transfer, i have just message hash. I want to identify this transaction from getTransactions call

Sir_B🍅🦉🍅▪️: Because jetton transfer involves lots of computation and you pay for all this in gas fee while ton transfer is a simple transfer and have very low computation (reply to 146519)

Sir_B🍅🦉🍅▪️: There are resources on "jetton processing" online. U can use unique text to check each transfer, query the address for status and completion (reply to 146534)

&rey: To which end, viewing from backend side? 1) to verify that your outgoing transfer was started 2) to verify that your outgoing transfer has arrived 3) to verify that an incoming transfer has arrived 4) to verify that a transfer to you was initiated by someone (reply to 146534)

&rey: And, generally, https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons plus https://docs.tonconsole.com/academy/transaction-tracking.

Lasha: I want to identify it with message hash.

Lasha: When i send tx i save message hash

Hon. Festus: Use tonapi getBlockchainTransactionByMessageHash (reply to 146540)

Lasha: Yes, but i don't want to use indexer, i use TonCenter v2

Hon. Festus: If I may ask, any reasons you don't want to use tonapi? (reply to 146544)

Lasha: I want to have several services for business continuity. TonApi is just one, i use RPC of TonCenter, Quicknode and other providers

Lasha: 👋👋 I'm working on tracking a transaction on the TON blockchain and need some help.  I send a transaction and store the message hash of that transaction. To normalize the hash, I use the same method as in the NormalizeHash example(https://github.com/tonkeeper/tonapi-js/blob/main/examples/track-transaction.ts)  then, I try to retrieve the transaction using the getTransaction method, I'm not sure how to correctly identify the transaction from the message hash.  A few important notes: I'm using Toncenter V2 – this is a strict requirement. My goal is to locate the specific transaction that corresponds to the stored message hash.  How can I reliably identify or retrieve the transaction using the message hash with Toncenter V2?

KBA07: @here I was trying to do a full send on TON. It was successful but i see the address received 0.001 from https://testnet.tonscan.org/address/0QAOezNX4xAtnUE3dSspVdjyiZD2QQ0qGVQ93K352MjQfxrv If i check memo then i see the receive is from Scalien. Does anyone have any idea about this?

&rey: Looks like they want you to speak to them (possibly to identify your acc with testnet address or to bait then mark-as-spam). Mind scam/bots/etc. Remember that you are never REQUIRED to confirm any transaction. (reply to 146548)

KBA07: But, i received some funds from them. Should, i happily accept it? This will not cause any kind of issues in the future right?

&rey: *testnet TON, not abstract "funds". The blockchain does not impose any obligation to return it, services on TON do not either. (reply to 146550)

KBA07: @pcrafter Thanks or the quick response. I will then do nothing about it.

Евгений: Maybe I'm wrong, but you need to iterate all transactions for certain address via getTransactions until you find one with your message (reply to 146547)

Евгений: How to track number of child contracts when they can be added and removed? The only good way I see is that child should send notification when it created or deleted to parent contract which then updates the counter

&rey: Subcontracts are usually being created with the sole purpose that root contract does not track ANYTHING about them. (reply to 146562)

&rey: In case of NFTs, well, each deploy goes through collection so it can update counter if applicable.

Евгений: There was task in the contest, to track number of subcontracts accounting for deleted ones, so I'm curious (reply to 146563)

Евгений: Yeah I thought about NFTs too and saw that counter only goes up for them (reply to 146564)

&rey: Then your solution seems right, even if task is somewhat useless. (reply to 146565)

Евгений: haha thank you (reply to 146568)

— 2025-04-16 —

Lasha: @pcrafter mr moderator do not know answer? (reply to 146547)

Daddy: Guys pls what's the realistic budget to pay devs (including UI/UX smart contract Dev etc) To build a a token with a game mini app on TON

Slava: Development is expensive, the good developers are very rare and cost a lot. There is no single answer to this question. If you don't know anything about development you should hire some good (confirmed) IT lead that will hire a team for you. Doing so by yourself will probably make you fail in the long (sometimes short) run. (reply to 146586)

Sir_B🍅🦉🍅▪️: You can pay between 0 to 10,000$ (reply to 146586)

Combot: Combot has warned Daddy Dddd (2/3) Reason: Word ******* is not allowed (reply to 146587)

Daddy: Where do you suggest I get a good IT lead. I want to hire easter European devs (reply to 146587)

Slava: That's the hard part. Talk with people that you can trust, ask around. If you have investors/funds ask them, they should probably know. Watch development conferences, look for professional people in chats, that have a reputation. Ask other entrepreneurs. (reply to 146593)

Slava: And of course, studying the subject will help a lot. Try to understand development to a degree.

Daddy: Thank you slava

Yemane: Thanks

Yemane: Send me the link

Yemane: What I work

Ad: Hi Chat, i am trying to use pytvm emulator to compute jetton wallet addresses offline. It works fine when i initialize the tvm with the right code and data, but i dont know how and where to fetch the contract master address code ans data. can some one shate some example code pls?

&rey: Toncenter's getAddressInformation. Tonviewer's tabs with code and data. So on. (reply to 146607)

Ad: ok thank you. i will try that later.

David: Hey, quick question. Looking to make security tooling that helps the TON smart contract ecosystem. My hope was Tolk/FunC/Fift would emit an AST/IR so tooling can base itself off of that. But it doesn't seem to.   I started looking at adding AST output to Tolk and it looked like it could be done neater with an AST visitor class (they already have). For FunC, it seemed like the internal IR is very weak, doesn't track source mappings (only location), the parser is more brittle (though I see you have tree-sitter grammars in your vscode plugins), and a lot of info is emitted at codegen based on inferred properties not always stored in IR. And what's evaluated for codegen by then already drops some tokens you might want represented in an AST (was my impression).  I started feeling that if I rewrote some of the IR to better capture some of this info, it would be a big change that might get rejected by the devs ("who is this random rewriting chunks of the compiler, accepting this PR seems unsafe")  Is there any notion to output an IR in Tolk/FunC like this? Would there be any interest? Any thoughts on what I said above in general? I could rely on the tree-sitter grammars, but without source mappings, I end up in a place where I can abstract away stdlib.fc functions by saying "this emits the expected assembly", but I know conceptually that can be arbitrarily expanded with more stdlib functions (or the users own), and knowing if they're always safe would imply modeling TVM behavior, which would be fine, but the code that's _generated_ will not be mapped neatly. So in any approach, I feel capabilities are limited by this.  I guess I'm just seeking input from the devs about how they'd look to solve this problem, how open they'd be to extending FunC/Tolk, even if by external contribution, etc.

Slava: Maybe the @AntonTrunov can recommend something. (reply to 146611)

David: It's also possible I overlooked some easier pathway to dump what I need from FunC, but I found myself having to replicate a lot of logic in the codegen routine, looping through global vars, funcs, then serializing all the ops by switching on each one. If I added source mapping, I'd imagine you'd want to better track instructions emitted in an IR or at least its positions/mapping instead of currently inline emitting text. And I'd imagine the ops are incomplete in incapsulating the AST info its derived from at that stage, so maybe some of the routines/flow/objects here would need to be modified.  But again, this is just from an initial look. It's possible, maybe even likely, that some assertion I made here is wrong. But I think the gist is essentially correct from my scan. Let me know your thoughts. Thanks! :D

David: I just found myself basically saying "this requires larger changes to FunC to write the tool I want, and I think they'll reject it even though it provides great benefit" vs "I can write my own parser based off your grammar, but then I'll be a 'dumber' tool lacking a lot of other info, redesigning notions of CFG the compiler already is authoritative about.

Anton: If you are interested in contributing to the Tact ecosystem, then starting v1.7 we will have a typed AST for third-party tools (tracked in this issue: https://github.com/tact-lang/tact/issues/572). You can also check what misti does: https://github.com/nowarp/misti (reply to 146613)

David: That sounds nice. Although my concern would be with FunC/Tolk, where such capabilities don't exist and there's less supportive tooling for this. There are many FunC smart contracts still written/being deployed, etc.

David: I did note that these improvements are being made for Tact and some folks began building analyzers/other tooling for it though, very nice :)

David: Would it be the TON devs position then that there is no official interest in adding an IR/AST to FunC/Tolk, or would you folks have some interest in doing this? Or what would be your stance on if some external contributor began rewriting parts of FunC to do this? I guess the nightmare scenario for me is "I can continue writing my own parser, but it will be a parallel effort to the compiler and lack info only the compiler will know" vs "I can try to improve FunC itself, but maybe weeks of effort will result in a rejected PR because it overhauls a lot and seems unsafe to accept without you being a core part of the PR development"

David: (Just trying to find out the least painful path for myself developing this tooling)

Slava: I believe FunC is a solidified technology that is not going to be developed further. Your best bet would be to collaborate on Tact or Tolk.

🏆: why not tact? (reply to 146625)

Tom: Tolk is a first-class citizen. https://docs.ton.org/v3/documentation/smart-contracts/tolk/overview (reply to 146626)

🏆: any good course? I learnt tact then func and now tolk 😁 (reply to 146627)

Tom: I will put money on Tolk. Read the docs, some codebase and this group is enough I think.

Slava: Or Tact, of course :) (reply to 146626)

Tom: Imo, have a purpose / some contracts you want to write instead of bumping into any course. (reply to 146628)

Tom: I learnt FunC by writing a multisender for TON. Not good in any mean but I learnt a lot.

Arti: Hey fam 👋  Tomorrow we’re running a chill text-only DeFi workshop with Tonstakers and Evaa Protocol. Diving into liquid staking, leverage via lending, and how it all works in the TON ecosystem.  If that’s your vibe, DM me and I’ll send over the info.

Anton: Tact is actually officially supported by TON Foundation and recommended to use in production (reply to 146627)

Terry: How about Func then? (reply to 146643)

Anton: Well, I cannot disclose the TF stance on FunC at this moment (reply to 146644)

Anton: I’m willing to bet against :) Like real money. Let’s settle on a good metric and actually bet a few hundred or thousand USDT :) (reply to 146629)

— 2025-04-17 —

Tom: Lol, I don’t have that kind of money. Just my pov, please take it with a grain of salt 😁 (reply to 146647)

&rey: I'd suggest play money because of possible insider knowledge (many platforms do not take kindly to it). Unfortunately, I haven't yet reimplemented Manifold's features in TON... (reply to 146647)

Nova: Hi.  I'm trying to add a comment to each "Call Contract" message. Can you tell me if this is possible? Or can a comment only be made without calling the contract method?

&rey: First, do you know how comment is represented in a message? (reply to 146658)

Nova: I only get a comment without a contract message.  I'm trying to merge a message with a comment like this:   b_0.storeUint(767997046, 32); b_0.storeUint(message.bid, 64);  const forwardPayload = beginCell()     .storeUint(0, 32) // 0 opcode means we have a comment     .storeStringTail('Hello, TON!')     .endCell();  b_0.storeBit(1) // we store forwardPayload as a reference b_0.storeRef(forwardPayload)  const bidCell = b_0.endCell();   but it doesn't work (reply to 146659)

&rey: Comment is simply an interpretation of message payload. Only jettons and NFTs support passing text comment alongside the actual request. (reply to 146661)

Nova: Thanks.  So if I implement my own Jetton, and use that Jetton for transactions instead of Ton, then I can add a comment? (reply to 146663)

&rey: You don't need to implement a custom jetton actually. However, you'll need an auction contract accepting it. (reply to 146664)

&rey: Why do you need some payload for the contract, though? Can't bid amount be inferred from message value?

Nova: I just want the client to see a description of what exactly these funds are going to from the "Call contract". Without this, it's a bad user experience. In my case, there are 3 write-offs: network commission, client bid, and project commission for contract expenses. (reply to 146666)

&rey: 1. dApp looks a better place to describe what is about to happen. 2. well I am suggesting to drop payload and make contract process text comments as bids. (reply to 146667)

PetX: Hello, I want to create a token that ends with the same token name as NOT. EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT

Еqf: can you guys explain whats up with payment methods in TMA ? does apple bans apps that use tonconnect ? is it necessary to use tg stars as payment method ?

Nova: 2. Can you direct me where I can find out more about this? (reply to 146668)

🇵🇸: any experienced ton developer here to architect a design for an indexer? will compensate good for your time and help.

🇵🇸: indexer that will index all nft collection,items and its states. (reply to 146674)

Felix: Just shipped integration of TON swaps for jettons in gem wallet, whoever needs zero tracking swaps its available on latest build.

User<7894330870>: That's because it also needs to interact with the jetton wallet smart contract. (reply to 146519)

— 2025-04-18 —

AGT: How to batch increase holding addresses on TON Chain? Are there any relevant tools?

WhyesCode: There's no ready-made tool for that. You would typically create a custom script using the TON SDK to batch generate addresses and handle token transfers. (reply to 146734)

Darshan: Arweave Mini-Hackathon Alert!  Arweave is hosting a unique mini-hackathon with exciting vibes and opportunities! 🔗 Register now: https://lu.ma/vibe-code-hackathon?tk=Va1Jgv  ✨ Pro Tip to Increase Selection Chances: Make sure to register for Arweave Day India as well – it boosts your chances! 👉 https://lu.ma/arweave-day-ind?tk=7mSiZM  Don’t miss out on this! Let’s build something awesome

AGT: OK，thank you sir (reply to 146746)

&rey: Please see https://github.com/gobicycle/bicycle (reply to 146734)

Pouya: Tonkeeper doesn't want to back my mini app after signing external message, i use iphone, it's okay?

Pouya: is there anyone here to help me? (reply to 146767)

WhyesCode: Hi, it might just be an iOS callback glitch with Tonkeeper. Have you tried updating the app or re-checking the integration? (reply to 146767)

Pouya: yes we didn't change anything And before that it works correctly.also every packages are updated (reply to 146772)

Abdo: Hello everyone one I want to know how to save the wallet address in sql

WhyesCode: You can store it just like any other string in your database (reply to 146775)

WhyesCode: Just treat it like a string

— 2025-04-19 —

Maxey: I currently deployed a jetton using a stablecoin contract. The fields in my metadata URI comply with the jetton standard requirements:  {   "name": "",   "description": "",   "image": "",   "symbol": "" }   The decimals field is defined in the contract.  On TON Scan, my metadata is displayed correctly, and the TON Center API also returns the correct data. However, TON Viewer fails to display it. How can I resolve this issue?

WhyesCode: Just add the decimals field in your metadata JSON since TON Viewer only reads what's off-chain. (reply to 146799)

Alan Roberto: I am developing a networking TMA

Alan Roberto: Would you like opinions on optimizing data insertion or maximum registration data?

Alan Roberto: ?

&rey: This chat is about developing on TON, so mostly about smart contracts. Please keep discussion on topic.

Alan Roberto: Ok. Sorry (reply to 146821)

&rey: That sounds like it will be appreciated in @devs. I'd advise to write a full article first, and to have a summary for chat. (reply to 146819)

Alan Roberto: Of course my friend (reply to 146823)

— 2025-04-20 —

Dilan: Hi.. does anyone know about BitTON.ai? They claim that the CTO of TON is involve in bitTon.ai , is that TRUE??

Андрей: No, its scam (reply to 146827)

Denis: The main problem what TON doesn't have CTO. Everybody wants to be CEO (reply to 146827)

Dilan: Thanks for the Info..

Dilan: What are the most reliable staking platform for staking TON right now?

Denis: Tonstakers

Moaad: hello im building a website similar to pump.fun but on Ton Blockchain the thing is i still have difficulty to let users connenct their wallets

WhyesCode: Are you seeing a specific error? (reply to 146833)

Vladimir: 🌄 Blessed resurrection sunday!

Majid: Good evening, I would like to be informed if there is a possibility to recover lost currency by sending them to the wrong address? or if you can solve this problem ahead?

&rey: Blockchain transactions are not cancellable. (reply to 146837)

Majid: I know, but validators should think about it after a moment of understanding, coding and all this source should realize the pain to which new users are exposed,I think that like any worthy platform you will have to let me recover my loss and your network continues to flourish, as in all education otherwise

Majid: the users are lead and no hopes is given to them, I already have some example who lost their spouse,or their sister’s soul for the same reasons,the aspect you are talking about is very much in the adventure of crypto wealth

Shyaamal | TON: The TACTical Launchpad by TON Society India 💎  Ummmm what is this.....  So basically it's a code plus writing challenge where we are giving you the TACT code templates for performing some specific functions and all you have to do is to understand them and write a descriptive article on any one of them according to your choice   Prize: 1000$ (to be distributed between the Top 20 winners)🚀🚀 Deadline: 5th May, 2025 (11:59 PM IST)  How to proceed:  Step 1: Head on to https://tact-by-example.org/all for finding the code templates  Step 2: Choose any one of the following code templates (choose only from the options provided below in the list)  • Receiving TON Coins • Messages Between Contracts • Sending TON Coins, Emitting Logs • The Ownable Trait • The Ownable-Transferable Trait • Writing Your Own Trait • Calculate Contract Address • Multiple Contract Instances • A Contract Deploying Another • Parent-Child Relationship • Communicating with Sub-Contract • Authenticating Children • Unbounded Maps - Simplified Token • Jetton Token  Step 3: Go though the chosen code template, understand its syntax and what is the logic behind it  Step 4: Finally write a blog on medium on what is the logic behind the smart contract's code (Be as creative as possible)  Step 5: Fill out this form -> https://forms.gle/kw4HaruhsRWmsNuv7  So what are you waiting for go and start exploring TACT by example and launch yourselves in the TON ecosystem through this TACTical launchpad   Let's keep building on TON

&rey: Any blockchain is a database (or should I say "coin-database"?) driven by specific operation rules, and validators are just the representatives who uphold the rules. This allows to do certain kinds of automation.  An ability to pull money back would undermine literally everything. Imagine that you complete some work, receive a bit of TON only to have them pulled back in a few minutes. (reply to 146840)

— 2025-04-21 —

K4L1NUX 💻🐉: Hello

Johnny Le: Hi guys, im testing a mini app using BSC, but as Ton rule, mini app without TON wont work after. So far Im still using my test okay, but what will happen if I still use it? will my mini app being force close? Thanks

WhyesCode: In a simple answer... YES. (reply to 146850)

Johnny Le: I still see HOT wallet running normal, so I want to know that when mate (reply to 146851)

WhyesCode: It may not be an instantaneous crash but rather a gradual phasing-out that results in interrupted user experiences or outright removal from the platform.

Sir_B🍅🦉🍅▪️: The Tact contest is live.   7 days. I am participants also. Just reminder.  https://codeforces.com/contest/2105/

Sir_B🍅🦉🍅▪️: There may be a way the mini app platform will check if TON is not in use or so. (reply to 146850)

Johnny Le: thanks, cause i see no app got effect yet (reply to 146855)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 19 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 56  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

amir: We are a startup team working on Toncoin. I was wondering if you know of a place that would give us a grant?

Mark: I want to understand how to resolve .ton domains using ton dns  If I use tonweb:  tonweb.dns.resolve(     'howtorunsite.ton', TonWeb.dns.DNS_CATEGORY_SITE );  it resolves to an ADNL address.  but how do I resolve it to a publicly linked http url (if one exists)? Is that even possible?

Slava: There is no such record type in the standard. (reply to 146862)

Moaad: I need team members for my website i will be sharing the specific percentage of the profits there's no payment upfront   Conditions   1- knowledge of programming  2- creating smart contracts  3- know tonconnect SDK

&rey: That's not exactly on topic for this chat. I'm not sure what penalty will be applied, but in any case it cannot be more than permanent ban from Telegram; I've heard a case where person was prevented from creating any bots. (reply to 146850)

User<7894330870>: Which chain should the app run on? (reply to 146850)

&: DM me (reply to 146864)

mikey: send me DM, plz (reply to 146864)

— 2025-04-22 —

K4L1NUX 💻🐉: That depends on the amount of functionality you want the bot to have, and the number of hours of work that need to be put into it. (reply to 146885)

K4L1NUX 💻🐉: And I'm talking about very serious projects, no bots looking for references and scamming.

Nova: Hi.  How can I get contract transactions in a date range? Please tell me)

Syed Mahdi | Salvation: Hi there, I have question about rules of Telegram mini apps and TON blockchain, who can I speak with?

Syed Mahdi | Salvation: If I have a game or app in other chain, do I need totally transfer it to TON to be able utilize it in mini app? (reply to 146933)

Daivd: Yes (reply to 146935)

Syed Mahdi | Salvation: Can't I bridge TON to the origin chain and keep the contract unchanged? (reply to 146936)

Giorgi: Hello everyone, I'm new to TON and I have a question:  When I process a jetton withdrawal, I want to check the full transaction details and validate them step by step in my code. For example, I want to perform out message checks based on the source, destination, and created_lt parameters. I'm using the https://toncenter.com/api/v2/ endpoint with /tryLocateResultTx in Swagger  Sometimes, the API returns the expected data, but other times it gives me the following response:  {   "ok": false,   "error": "Tx not found",   "code": 503 }  What could be the reason for this?  transaction example: https://tonscan.org/tx/d6cfd66ed39de92ed9d36b4ff81abb325bcf9efcd94242fafffe695d6a38d499

MBA: Hey everyone, How should I catch exitCode -14 in Tact?  I tried to deploy another contract and the initiated transaction fails because of insufficient gas. I want to handle this condition inside my contract. Is there any way?

User<7894330870>: yeah (reply to 146935)

WhyesCode: Do you have a backend? (reply to 146939)

Syed Mahdi | Salvation: Complete game! (reply to 146969)

&rey: The transaction not being there at the moment. (reply to 146939)

Giorgi: @pcrafter But it actually is, yet it still can't find it I don't know why (reply to 146973)

cm4a: Can I create a ton wallet for send and receive

&rey: Yes. In automated manner? (reply to 146978)

cm4a: Users deposit ton or withdraw like that

&rey: Consider github.com/gobicycle/bicycle (reply to 146983)

DeFi: Under current app store guidelines, yes. (reply to 147007)

Zafar: I’m sorry then but we tried hard with Grok to help Ton and Telegram 😢 (reply to 147009)

Саша: I am facing a problem, on the local request to ton network works, on the server does not, heard something about udp ports, can it be somehow related to this? Using tonutils-go

— 2025-04-23 —

Crypto c’est le futur: I have do error in my memo transaction can you help me

Daivd: what kind of error? (reply to 147028)

DÄÑÏÊŁŚ: Hello everyone

Chace: Guys I fucked, what can I do now? I was supposed to recv AuctionFillUp amount but because of my custom auction deploy I didnt, now Its in NFT's balance, any way to get nft balance ?

Chace: https://tonviewer.com/transaction/02616061be684ebe6f40f04e1b2ca95ff5ffdde842d99b295ab3cdb578b434ae

WhyesCode: I can help you. (reply to 147059)

Chace: yes please (reply to 147076)

Saurav: Can anybody help me figure out how I can store a list of addresses in a contract that can grow infinitely? I do not want to use the master-child pattern. Has anyone implemented something like this? I really need help with this. Also, deploying a child contract just to store one address doesn't seem like a good idea. Does anyone have any suggestions?

Saurav: any contract code example

WhyesCode: Paid task? (reply to 147086)

&: Bro, why don't you check dict? (reply to 147086)

Saurav: So where can I store an infinite number of addresses that keeps growing? How does it impact storage fees, and what are the implications for changing or modifying the data? (reply to 147093)

Dzik: func NewTonAPI(endpoint string) (*TonAPI, error) { ctx := context.Background()  liteClient := liteclient.NewConnectionPool()  err := liteClient.AddConnectionsFromConfigUrl(ctx, endpoint) if err != nil {   return nil, fmt.Errorf("failed to load lite servers from config: %w", err) }  apiClient := ton.NewAPIClient(liteClient)  _, err = apiClient.CurrentMasterchainInfo(ctx) if err != nil {   return nil, fmt.Errorf("no active lite servers responded: %w", err) }  return &TonAPI{   api: apiClient, }, nil }

&: Check docs.ton.org for more details on dict. (reply to 147094)

0x: You can get all transaction history and retrieve transaction history according to a specific date. (reply to 146898)

TON Bounty Bridge: ​Implement Turnkey Ton signer integration and examples  🏷 Developer Tool  Summary:IntegrateTurnkey’ssecure, custodial key management infrastructure into TON to enable custody wallets...  Created by KuznetsovNikita

Emir ZS TUBE: If you are interested in react (next.js) tailwindcss (jsx - tsx) and blockchain, please dm us. We are looking for a developer for a big project.

Daivd: Hello (reply to 147120)

Lawrence Marius: Anyone who can me on how to sell photos as nft?

Willy: You can put an image as data for each NFT item on Blockchain   Or you can use NFT master contract and NFT item contracts to store parts of URL to place, where you store image online  Either way you need to deploy NFT contract's system    About onchain/offchain metadata: https://docs.ton.org/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing (reply to 147125)

Lawrence Marius: Thanks very much (reply to 147126)

Саша: Good evening, there is an api that calls ADNL over UDP (to interact with nodes TON), udp are open, on the local everything works, on the server I get exceeding the limit of the time limit of the response request, has anyone encountered?

&rey: Have you tried checking system firewall's stats of dropped packets? (reply to 147136)

Mr.Lightcode: Hi friend's 👋

Slava: You shouldn't use TON then, I'm afraid. (reply to 147086)

— 2025-04-24 —

Kirill: Hello everyone. please tell me what to do to raise your liteserver and it has synchronized enough public global.config just stops at this point when syncing (Local validator initial sync status: downloading all shard states, mc seqno 47083830) and does not go further

WhyesCode: Try updating to the latest global.config and liteserver version first (reply to 147161)

Kirill: I download from https://ton-blockchain.github.io/global.config.json

WhyesCode: Ok, you are using the official config file. Maybe a quick restart or full resync might help clear things up. (reply to 147163)

Kirill: how i make 'quick restart'? mytonctrl restart?

WhyesCode: Yes. (reply to 147165)

Kirill: I opened the states folder and it's clear that the last file was written just 40 minutes ago when I ran mytonctrl. mytonctrl restart didn't change anything  ls -lh /var/ton-work/db/archive/states | tail -n 10                                                                         ton-node-test: Thu Apr 24 07:15:14 2025  total 5.2G -rw------- 1 validator validator 5.2G Apr 24 06:37 state_47083830_-1_8000000000000000_A37F0B69DBE4AAFE9D72231CA06DFB48CE2EFA250C1926F103843348EF6F39B2

Kirill: can you plz help me how to make full resync?

WhyesCode: Can you share the logs error message? (reply to 147167)

Kirill: there are no errors in the logs (reply to 147169)

WhyesCode: You will need to stop the node, remove the local database, and then restart so it rebuilds its state from scratch or If you have a snapshot, you can import it instead. (reply to 147168)

professor x: Hi guys I am new on Ton development...I want to learn everything...any course here or books or videos to watch?  I have Ubuntu 24 LTS distribution ready...what tools do I need to download? all of them

&: check sterik videos  https://stepik.org/lesson/1011498/step/2?unit=1019358 (reply to 147172)

AGT: I bought a .ton domain name, how can I use it and what can it be used for?

&rey: Basically, four things: dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 }   cap_list:flags . 0?SmcCapList = DNSRecord; dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord; dns_adnl_address#ad01 adnl_addr:bits256 flags:(## 8) { flags <= 1 }   proto_list:flags . 0?ProtoList = DNSRecord; dns_storage_address#7473 bag_id:bits256 = DNSRecord; (reply to 147175)

&rey: Those being "point domain at a contract", "attach a DNS subresolver", "deploy site accessible via ADNL and point domain to it", "deploy static site to some provider of TON Storage and point domain to it".

Kirill: please tell me, where can I buy a lite server where it is most profitable? i know about only ton console

AGT: If a wallet is bound, does it mean that I can transfer money directly to this domain name? (reply to 147179)

Michael: Hi everyone, hope someone can help me with my nft minting code, I am using tonutils library for generating nft collection and passing that step successfully. Then on minting smart contract execution is failing with error and not able to understand what is wrong on my side.

Michael: here is the link to corresponding transaction: https://tonscan.org/tx/053f8d3e5aa56ac17eec67a3acfcdc0b4c8162d9cad38444e7892bf6db25a5b1

mohamad1: Is there a person who uploads a smart contract?

Michael: I've deployed nft collection from my code

Sir_B🍅🦉🍅▪️: That is d bread and butter of TON.  It is also very cheap to use TON.  That is the only way to build something big on TON (reply to 147086)

Sir_B🍅🦉🍅▪️: Hope you got solution already?  U can have a contract that verifies the child contract securely. And you can build to trillions data👍👍 (reply to 147094)

Sir_B🍅🦉🍅▪️: Hope you got it working now? (reply to 147182)

Sir_B🍅🦉🍅▪️: What do you want to do? (reply to 147184)

Sir_B🍅🦉🍅▪️: Ok.... (reply to 147185)

Michael: not yet (reply to 147189)

Sir_B🍅🦉🍅▪️: Provide details of your issue

WhyesCode: I think I can help (reply to 147182)

Michael: hmmm looks like have it working ... so sender should be the owner of collection right ?

Sir_B🍅🦉🍅▪️: Correct (reply to 147195)

Michael: thanks a lot !

Sir_B🍅🦉🍅▪️: And once ownership is assigned to another user, you don't have right over it anymore

Levon: Hey!  I want to understand, how I can check if the contract address is active or not in runtime, I tried a lot of things (even tried to find something related to asm functions), but  couldn’t find anything.

Mujtaba: Hello, I don’t think you can do it.  From a low-level perspective, infinite sharding mechanism keeps you from querying any contract state or invoking any contract synchronously

AGT: How do I bind my website to a ton domain name?

&rey: That's half misleaded. TON sites are served with a special application (RLDP reverse proxy) not just bound via HTTP URLs. More details are in the docs.ton.org (reply to 147201)

AGT: That means I can't bind my website to .ton, right? (reply to 147204)

&rey: There might be a misunderstanding with all the terms. (reply to 147206)

AGT: Well, I really don’t understand how to use this. Is it just to simplify my address?

&rey: You can make server provide the site contents on .ton domain, irrespective of existing web2 domains already bound or not. (reply to 147208)

AGT: So, what is TON Site (ADNL address) used for? Can I enter the domain name of an existing website?

AGT: I'm sorry for not understanding this, which makes me look like an idiot, but I like the TON ecosystem and I'm willing to pay for TON.

&rey: I literally said: "irrespective of existing web2 domains..." – you can't bind domain names. Specialized software on server, on the other hand, does the management automatically. (reply to 147210)

AGT: 👌

&rey: Surely the docs must open OK? https://docs.ton.org/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site (reply to 147211)

Dark Star: Hey everyone  I’m exploring ways to monitor balances for 1000+ wallets in TON.  In my case, each user in the system has a unique wallet address, and I need to track incoming deposits efficiently.  In other networks like ETH, BSC, Tron, and Polygon, I handled this via a smart contract that aggregates balances. However, from what I’ve seen, replicating this in TON seems non-trivial due to architectural differences (e.g., lack of a standardized balanceOf call and no dynamic iteration in contracts).  One approach I’m considering is polling balances sequentially (1/sec), but since I also need to check USDT on TON and interact with the system backend, I might run into API rate limits. Using multiple API keys could help, but I’d love to hear if someone has found a more scalable or efficient strategy.  Also — is there an RU TON dev community?

Dark Star: Found the Russian-speaking community

Denis: https://docs.tonconsole.com/tonapi/webhooks-api (reply to 147215)

Victor: Hey guys! @TONX ENG just dropped a deep dive into TON Mintless Jetton - covering the architecture, operational flow, and code demos.  👉 https://blog.tonx.ai/mintless-jetton-a-technical-analysis-of-tons-efficient-airdrop-protocol/  If you’re building on TON, this is a must-read. Enjoy!

Еqf: guys is there any way to programatically  verify that the mnemonic of 24 words from the bip39 sheet is valid ?

Еqf: mnemonic is not valid in tonkeeper, however ive made every step that required for it from official docs ( pbkdf, checksum, sha256, sha512 ) (reply to 147226)

&rey: 1. https://github.com/gobicycle/bicycle 2. You can make intermediate contracts just forwarding everything to the master. (reply to 147215)

Еqf: 👋 can you help with my question ? (reply to 147231)

Еqf: i can give more context if needed

&rey: Please check out source code of Tonkeeper because I don't remember. (reply to 147227)

Еqf: somewhere here i suppose ? (reply to 147234)

&rey: I believe, https://github.com/tonkeeper/tonkeeper-web/blob/7d6d95e2468571da871bc0ed6ecc72659a911eb6/packages/core/src/service/mnemonicService.ts#L72. (reply to 147235)

Georgiy: Initializing the library const TonWeb = require('tonweb');   const client = new TonWeb(new TonWeb.HttpProvider(''link to toncenter (v2/jsonRPC)''), {     apiKey: 'key'   });  a transfer is being made to a person from our wallet const transfer = await wallet.methods.transfer({                 secretKey: keyPair.secretKey,                 toAddress: toAddressStr,                 amount: amountNanotons,                 seqno: String(seqno),                 sendMode: '3',               });  then there is a check on the success of the transfer in order to remove the balance that he deduced from the database.                const transactions = await client.provider.getTransactions(wallet.address, 1);               console.log('Recent transactions:', JSON.stringify(transactions, null, 2));               if (transactions.length > 0) {                 const latestTx = transactions[0];                 if (latestTx.out_msgs && latestTx.out_msgs.length > 0) {                   const outMsg = latestTx.out_msgs[0];                   if (                     outMsg.dest === toAddressStr &&                     outMsg.value === amountNanotons                   ) {                     transactionConfirmed = true;                     console.log('Transaction confirmed on blockchain');                     txHash = latestTx.transaction_id?.hash || txHash;                     break;                   }  but after that, there is a constant ratelimit exceed

&rey: There is a certain thing wrong. Can you guess? (reply to 147242)

Georgiy: ? (reply to 147243)

&rey: Why do you assume that transaction will be immediately available? (reply to 147244)

Georgiy: console.log('Waiting for transaction confirmation...');           await new Promise(resolve => setTimeout(resolve, 20000)); (reply to 147245)

&rey: And what if transaction is there in ~18s and RPC is behind for ~4s? (reply to 147246)

Georgiy: What can you suggest? (reply to 147248)

&rey: Also, this will almost always return an incoming message from spammers which are out there. (reply to 147242)

&rey: I haven't ever tried to write the correct solution in JS/TS. (reply to 147249)

Georgiy: How would you fix it in another language? (reply to 147251)

&rey: It's kinda 150 lines of code in Python (in a proprietary script I've seen), quite long to explain. (reply to 147252)

&rey: The interface is class WalletWrapper:     ...     async def send_certainly(self, msgs: list[pytoniq.WalletMessage],             continue_on_timeout: Callable[[], bool],             continue_on_replaced: Callable[[pytoniq.Transaction], bool]             ) -> Optional[pytoniq.Transaction]:

— 2025-04-25 —

Jolly: hello, does anyone know the difference between transfer and contract while we create a payment order for our user using Ton space?  Especially, is there a fee difference?

Hobbs: Gm guys

Hobbs: 1. *Transfer*: A direct transaction from one wallet to another, typically straightforward and simple. Fees are usually standard transaction fees.  2. *Contract*: Involves interacting with a smart contract on the blockchain, which might have additional logic or requirements. Fees can vary based on the contract's complexity and computational resources needed.  *Fee Difference*: Contract interactions often incur higher fees due to the computational complexity and potential for more data storage or complex logic execution. Transfers are generally cheaper, as they're simpler transactions.  For precise fee details, it's best to check Ton Space's documentation or consult their support, as fees can change and depend on network connections (reply to 147261)

Jolly: okay, thank your ~ Even though the contract charge a higher fee, but I still saw lots of app using the contract mode to receive payments, is there any advantage make developers choose contract over transfer? (reply to 147263)

Enver: hello guys, i dunno if here's the right place to ask this, but i have an issue trying to register events in tganalytics.xyz, i send the request with all the require parameters but always i'm get the same msg {   "status": 400,   "messages": [     "property events[0].app_name has failed the following constraints: app_name should not be null or undefined, app_name must be a string",     "property events[0].user_id has failed the following constraints: user_id should not be null or undefined, user_id must be a number conforming to the specified constraints",     "property events[0].event_name has failed the following constraints: event_name should not be null or undefined, Unknown event name",     "property events[0].session_id has failed the following constraints: session_id should not be null or undefined, session_id must be a UUID"   ] } anyone can help me with this?

mohamad1: Create a pre-sale of our own currency  For example, someone sends a ton coin to our address, and our coin is sent to an automatic buyer. (reply to 147190)

Sir_B🍅🦉🍅▪️: Ok. This is doable. (reply to 147267)

WhyesCode: You can hire me (reply to 147267)

Hobbs: Yes, despite higher fees, developers might prefer contract mode for payments due to several advantages:  1. *Programmability*: Smart contracts allow for complex logic and automation, enabling features like escrow, conditional payments, or subscription models. 2. *Security*: Contracts can hold funds securely until conditions are met, reducing the risk of fraud or non-payment. 3. *Flexibility*: Contracts can be customized to handle various payment scenarios, such as multi-signature wallets or token-based transactions. 4. *Transparency*: Contract interactions are recorded on the blockchain, providing a transparent and auditable payment history. 5. *Decentralized applications (dApps)*: Contracts enable dApps to interact with users and facilitate trustless transactions, which is essential for many blockchain-based applications.  While fees are higher, the benefits of programmability, security, and flexibility often outweigh the costs for developers building complex applications or requiring specific payment logic. (reply to 147264)

Jolly: got it, thanks~ (reply to 147276)

Jolly: Can I use TRON account as a receiving account in mini app?

WhyesCode: Controversial, but in a simple sentence... NO.  TMA requires TON-based accounts, so you can't use a TRON account. (reply to 147280)

Jolly: got it .thx (reply to 147281)

Bryan: Hey, guys. I'm not a dev. I'm here because I have an idea for a dapp that I think would be perfect for the TON mini app ecosystem. But I need some help. I need to talk to some devs so that they can point me in the right direction

Sam: hola ! what exactly my_address() return ? is it initial address of the contract ? what if the contract code has changed ?

&rey: Address doesn't change anyways. (reply to 147294)

wisderfin: Hello everyone I can't join a Russian-speaking chat using the TON. I would be grateful if someone could tell me where to turn for help. [TON Dev Chat (РУ)]

boot adbot: is there a way to buy tele stars with TON without fragment?

&rey: Telegram or the intermediary may do anything (including annulling) with such stars so I will not recommend any such services. Please note it is also off topic for this chat. (reply to 147300)

— 2025-04-26 —

Виконт vangaard: Does Tonviewer or any other explorer have an API I can use?

Daniil: Tonviewer is powered by TON API: https://tonapi.io/ (reply to 147306)

Pasha: Right, can I query for a specific payload in a transaction history using the API? (reply to 147307)

devhost: DYOR.io is powered by DYOR   https://docs.dyor.io/rest-api/jettonsservice/getjettons

Andrey: docs.dton.io GraphQl, raw_transactions (reply to 147308)

sniper07: how can I fetch the token price in testnet?

&rey: You mean "zero point zero"? If not, use get-methods on DEX pools. (reply to 147312)

sniper07: I have deployed one smart contract of jetton token on testnet. Here, I want to know there is any way to fetch the token price

sniper07: To make the price of the new token, should I create the pool and set the liquidity?

&rey: Yes. Price is a derivative construct of "if I have that much tokens, can I swap them for anything else and how much at most?" — and thus useless in half the cases.

sniper07: So if I make and apply my logic according to the token price, is it not possible to simulate it on testnet as the token has no price?

&rey: You should mock-test those APIs instead. (reply to 147317)

sniper07: Oh, I can mock it in the backend by setting manually, right?

sniper07: @pcrafter, Thank you for your help...

Hon. Festus: So I'm building a community based game on Telegram and I want users to be able to claim specific SBT (NFT) Item for completing each level.  If I have level 1-5 would I need to deploy 5 contracts or 1 contract with 5 items?  1 meta.json and 5 item.json Or 5 different meta.json and item.json for the 5 different levels

Sir_B🍅🦉🍅▪️: Returns contract address and it never changes. It compute the data, codes of the contract and use to generate d address (reply to 147294)

Sir_B🍅🦉🍅▪️: It is left to u to prepare for what u want.  1 contract will be easier. But u wud av programmed the expectables into it. (reply to 147321)

Hon. Festus: Okay, thanks for your response...  When you say program the expectables into it, what do you mean, could you throw some more light? (reply to 147323)

Sir_B🍅🦉🍅▪️: 1 contract that will give 5 nft based on level. Each user wallet may av to be linked

Sir_B🍅🦉🍅▪️: So as dey reach level,

Sir_B🍅🦉🍅▪️: Each level, or grow to each level

Sir_B🍅🦉🍅▪️: Your frontend verifies securely and then contract simply do what u av programmed iT to do and release the nft to d user

Hon. Festus: So it's possible to program for users to mint just a specific item in a collection right? (reply to 147328)

Sir_B🍅🦉🍅▪️: Yea

Alexander: Hello. Does anybody has example of how to send usdt from tonkeeper wallet to any address in TON network?

Daivd: yes (reply to 147331)

Alexander: Can you share? (reply to 147332)

Daivd: yes (reply to 147333)

Silver: How to list a coin in the wallet  This token is listed on binance, Okx, Revolut and every big exchange I am a representative from this coin and would like to discuss the possibility of this

&rey: In which wallet? TON doesn't have a unique one. (reply to 147338)

Silver: The wallet in telegram (reply to 147340)

Silver: @wallet

&rey: You should contact Telegram over that, because TON has no control over Telegram Wallet. (reply to 147341)

Silver: Can you forward me to the right person to contact

&rey: If you're referring to your wallet being inactive: it is quite normal. There is almost no need to deploy wallet if you are not doing any outgoing transfers. It will be deployed automatically by your wallet app upon first outgoing transfers.  Otherwise: mind scams. You never need to pay money to another person for your wallet to work. (reply to 147345)

— 2025-04-27 —

Met: If we build mini app on tele ton network Would you have any support to us? 🤔 (reply to 147343)

Met: And could you send to us address gmail contact to introduce out mini app? 😊 (reply to 147307)

— 2025-04-28 —

Jolly: Hi guys, how to get the balance of USDT account in My Ton Space in telegram wallet ? So far, I could only get the balance of TON account in My Ton Space

Daivd: https://docs.ton.org/v3/documentation/dapps/assets/usdt (reply to 147376)

Jolly: Thank you. BTW, do you know how to get contract payments between wallets? (reply to 147377)

Daivd: jetton? (reply to 147378)

&rey: Automated? https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons#send-jettons-with-comment. (reply to 147378)

Jolly: okay, thanks, let me check (reply to 147384)

Ton: Hello

Ton: I've submitted a project to TON Grants and seems it takes a long time to get response unless I have a contact with the TON dev team. Is there anyone help me on review my mini app - it's MVP ready and fun turnchain NFT card game.

Met: Coul you answer me? (reply to 147384)

&rey: I'm not the slightest bit interested in miniapps. On the other hand, if you wish to partner with TON Foundation (and that presumably has a high threshold), the email is partnership@ton.org. (reply to 147391)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 19 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 57  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Jolly: I got stuck with contract payment using TON in TON space, there is no estimated fee using this method, does anyone know why?

Sir_B🍅🦉🍅▪️: There is supposed to be gas fee charges before u approve a transaction.   Usually less than <=0.1 ton and excess ton is refunded back to ur wallet. (reply to 147402)

&rey: Did you understand the original question correctly? If so, how your message even responds to it? (reply to 147407)

Combot: Combot has warned Jared Woodard (1/3) Reason: Word **** is not allowed

— 2025-04-29 —

🎐*<@Maxim: can you throw in some Mintless Point Jetton if you have any left? (reply to 107750)

Bryce: no sorry i dont have any (reply to 147441)

Mojisola🍅 🍅: hey, what you mean? you mean the contract or what? (reply to 107750)

Mojisola🍅 🍅: hi, now that the contest is over, yet to get any update.... (reply to 146516)

🎐*<@Maxim: Why in "Claim Operation" picture: extra amount and expire_at for mintless proof? even in official demo it only: uint(0x0df602d6).ref(proof_cell) ? and if so, why only expire_at without start_from? (reply to 147219)

Combot: Combot has warned Тоха Синоптик (1/3) Reason: 1 reports (reply to 147453)

Алексей: Hello! How to contact with administration of chat? Thx

Matic: how to fetch ton balance from its address

WhyesCode: What is the issue? (reply to 147467)

Matic: can you pls  i am trying to build an api in whiich if user pass the TON address , it will fetch its balance

&rey: Call getAddressInformation endpoint in Toncenter. (reply to 147467)

Matic: can you pls provide me the complete blockoff code

Matic: from where can i get apikey

&rey: 1. Generally... so do you already need it? 2. @toncenter (reply to 147478)

professor x: So can u make money from this? (reply to 147474)

professor x: Any idea on what I can develop on ton and make money on it (reply to 147479)

&rey: This is perhaps better suited for individual thought or TON Society chats. See also past hackathons for inspiration and contact with actual teams. (reply to 147481)

Matic: i am just building to explore TON network not to earn money my dear friend

Matic: thanks @pcrafter

Matic: when i dirrectly hit in browser it worked

Matic: but when i try to hit it in code using axios it is getting failed

Matic: "error": "Failed to fetch balance from Toncenter",

TON Bounty Bridge: ​Angular UI Components Library for Telegram Mini Apps  🏷 Developer Tool  Created by ablagovestnov

— 2025-04-30 —

Michaelzy: hello guys im trying to interact with my smart contract and call a message 'mint'

Michaelzy: here is the code:  message Mint{     query_id: Int as uint64;        name: String;     image: String;     author: String;     producer: String;     artist: String;     publisher: String;     mintAddress: Address;     fraction_count: Int as uint64; }

Michaelzy: here is the message i added to my transaction build. But for some reason i keep getting exit code error 9: cell underflow but i have all the required fields in my message  const message = beginCell()         .storeUint(2016634319, 32)         .storeUint(query_id, 64)         .storeStringTail("test name")         .storeStringTail("test image")         .storeRef(beginCell().storeStringTail("Author:").endCell())         .storeRef(beginCell().storeStringTail("Producer:").endCell())         .storeRef(beginCell().storeStringTail("Publisher").endCell())         .storeRef(beginCell().storeStringTail("Artist:").endCell())         .storeAddress(userAddress)         .storeUint(fractionCount, 64)         .endCell();

Mojisola🍅 🍅: written in funC or Tact? (reply to 147525)

Michaelzy: tact (reply to 147529)

Michaelzy: this is part of a script i wrote with node.js to interact with the contract (reply to 147528)

Michaelzy: other messages work fine but this is the first message i wrote where it has more than one field and it keeps failing

&rey: How would contract get that the first string ends with " name" and next bits/refs represent the next string? (reply to 147528)

Mojisola🍅 🍅: first, you can use ts from your build folder to work with this and it is simpler.

Michaelzy: are you saying string can only be single words without whitespaces? (reply to 147533)

&rey: No, that's not right either. (reply to 147535)

Michaelzy: here is the transaction build from the ts. i am confused on how ti implement it properly and i even made a different 'ref' const and attached it but it still returned code 9: cell underflow  export function storeMint(src: Mint) {     return (builder: Builder) => {         let b_0 = builder;         b_0.storeUint(2016634319, 32);         b_0.storeUint(src.query_id, 64);         b_0.storeStringRefTail(src.name);         b_0.storeStringRefTail(src.image);         let b_1 = new Builder();         b_1.storeStringRefTail(src.author);         b_1.storeStringRefTail(src.producer);         b_1.storeStringRefTail(src.artist);         b_1.storeStringRefTail(src.publisher);         b_1.storeAddress(src.mintAddress);         b_1.storeUint(src.fraction_count, 64);         b_0.storeRef(b_1.endCell());     }; } (reply to 147534)

Mojisola🍅 🍅: if you check ur build folder, open the typescript file (reply to 147528)

Michaelzy: it's above any suggestion on how to build my payload (reply to 147538)

Mojisola🍅 🍅: import the file or copy this portion to ur nodejs (reply to 147537)

Mojisola🍅 🍅: then errors will definitely pop up😀😂

Michaelzy: lol

Mojisola🍅 🍅: import those too

Michaelzy: im trying to import but the functions are not avalilable (reply to 147540)

Mojisola🍅 🍅: okay. let me check something

Mojisola🍅 🍅: const forwardPayload = beginCell()         .storeUint(0, 32) // 0 opcode means we have a comment         .storeStringTail('...')         .endCell();      //const forwardPayload = beginCell().endCell()              const messageBody = beginCell()         .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer         .storeUint(0, 64) // query id         //.storeCoins(toNano("213.543297652")) // jetton amount, amount * 10^9         .storeCoins(toNano("0.002"))          .storeAddress(destinationAddress)         .storeAddress(destinationAddress) // response destination         .storeBit(0) // no custom payload         .storeCoins(toNano('0.000000001')) // forward amount - if >0, will send notification message         //.storeCoins(toNano('0.02')) // forward amount - if >0, will send notification message         .storeBit(1) // we store forwardPayload as a reference         .storeRef(forwardPayload)         .endCell();

Mojisola🍅 🍅: this is for jetton though, but see if you can adapt it for yours, the string etc (reply to 147549)

Michaelzy: ok

&rey: Copy just a) the import from ton/ton, b) the definition of Mint structure,  c) the function.  It will work. (reply to 147542)

Mojisola🍅 🍅: probably. cos that code is in typescript and his code is in js (reply to 147552)

Michaelzy: i figured it out the ts was using .storeStringRefTail but i was using .storeStringTail (reply to 147552)

Mojisola🍅 🍅: good (reply to 147555)

Pouya: I wanna use ton society api to generate sbt for my project through ton society csbt generator. what should I do?

Pasha: Hello, is there a way I can get the mainnet version of a Testnet address? Like the usual testnet 0QAR... for the mainnet EQ or UQ

&rey: Address.parse('...').toString({testOnly: false, bounceable: ...}) (reply to 147582)

Stefan | CTIDAO: hello everyone! we are exploring solutions for DAO governance in the TON ecosystem. who can recommend any project or framework that can help us achieve transparent and decentralized governance voting?

— 2025-05-01 —

Sam: hola ! how do you change gas price in @ton/sandbox ?

&rey: You'll have to change config cell. I changed gas credit using https://github.com/ProgramCrafter/ecvrf-coordinator-contract/blob/f61efafc30f56dc9995022f849faa9e005c5dfa2/main.ts#L105-L121. (reply to 147636)

— 2025-05-02 —

AGT: Gentlemen, can the contract address of Jettons be customized?

AGT: Dogs' contract address is the last four digits of DOGS, like this.

DeFi: Yes, of course (reply to 147644)

DeFi: medium (DOT) com/@Mhbdev/introducing-the-ton-vanity-contract-your-gateway-to-custom-addresses-40738b429627

AGT: Thank you, sir. I'll study this carefully. (reply to 147648)

Samyar: Hi, has anyone encountered the problem with tonconnect in miniapps that it tries to open the transaction inside the miniapp in android phones?

Samyar: for tonkeeper (reply to 147663)

Дмитрий: Hi , I need a code in node.js from which I can send tokens from wallet to another wallet

Mojisola🍅 🍅: I have this code (reply to 147666)

&rey: Hereby you have a moderator warning. Your message doesn't quite help devs (in particular, future devs) to complete their task.   Btw an answer is in docs at https://docs.ton.org/v3/guidelines/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment (reply to 147667)

Nick: Hello,  Nice to meet you! Admin, can I share my project here? 😊  It a telegram app listing for developers, they can list their products

&rey: No. (reply to 147679)

Nick: Hi guys. I use the toncenter api to get the latest transactions. Please tell me how can I determine the currency in which the transaction took place?

Nick: Forget it. I'll use methods for getting actions from API v3. (reply to 147683)

Sam: hola ! how do you compile FunC code for production ? (omitting all debugging instructions like STRDUMP) I'am using blueprint

— 2025-05-03 —

&rey: Normally, debugging functions do not live in contract's source till production; however, you can also replace a few lines of stdlib.fc to make the dump functions just drop their arguments (+ remove impure specifier so that their arguments are not calculated at all). (reply to 147690)

Игорь: does anyone have @ton/ton documentation or an example of jetton sending?

TON Bounty Bridge: ​ParityHash — verifiable RNG via TON_hash mod N  🏷 Developer Tool  Summary:ParityHash is an ultra‑light RNG that turns the current TON block hash into a verifiable random numb...  Created by Multipiston

Morpheus || $SHIVA: anyone understands why this isn't working anymore, I get a 404 error - https://eco.ton.org/en/opportunities/make-sbt-campaign

Morpheus || $SHIVA: you can't create an SBT campaign and the GitHub readme was talking about contacting them or something

— 2025-05-04 —

wy: hi how can i make a pull request. i would like to verify my token

🔳 ivan: hi! is there a recipe to simulate contract execution with internal message and get its new state?

Combot: Combot has warned Georgiy Komarov (1/3) Reason: Word **** is not allowed

Артур: Hello everyone! Does anyone know if there’s a way to verify on-chain that an NFT belongs to a certain collection? I mean, I can’t call get_collection_data on-chain because it’s a get-method. And I can’t rely on get_static_data / report_static_data, because these messages can be faked.

TON Bounty Bridge: ​Trouble  Created by 4ak7P

Mojisola🍅 🍅: can't you call directly the contract address of the nft? (reply to 147799)

Артур: Yes, I can call the get_static_data method of the NFT item contract and get a response with information about the collection. But that information can be faked. Someone could create a fake NFT item contract that claims the NFT belongs to a collection it doesn’t actually belong to. (reply to 147801)

Артур: It would be great if the NFT collection contract had a method that could confirm whether a given NFT actually belongs to that collection. Unfortunately, TEP-62 doesn’t provide for such a method. (reply to 147802)

&rey: You can "import" collection address, data and code into your contract — more precisely, place these cells in whatever way you see fit. Then, call https://github.com/ProgramCrafter/tvm-quirks/blob/master/ok-nft-addr-onchain.fc. (reply to 147799)

Артур: Yes, but my goal is to make my contract compatible with any contract that implements the NFT standard. So unfortunately, hardcoding the collection’s data and code isn’t a viable option for me. (reply to 147804)

&rey: Those could be set on contract deployment, for most applications I can imagine. (reply to 147805)

Артур: I hadn’t considered that approach 🤔 I’ll give it a try—thank you! (reply to 147806)

Mojisola🍅 🍅: what's the scope though, is it going to be your own created nfts or nfts from other people?  if from others, not sure you can run away from fakes except you manually check originals

— 2025-05-05 —

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 19 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 61  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

@CryptoCops: Hello. May I please know the different organizations to reach out to for project funding?

Michaelzy: does anyone have the correct format of how to store jetton content metadata on chain? (and off chain) currently i am doing this in my init: self.content = TempMetadata {             name: "Michaelzy",             description: "Michaelzy Tunez",             symbol: "MZT",             decimals: 0,             image_data: "jfhvbgfdfweuihfiwsfdsjbfdsfb",         }.toCell();  where TempMetadata is a custom struct with 5 fields fro the metadat as defined by TEP-64

Michaelzy: my jetton is showing name as unkown in tonviewer and tonscan

&rey: It wouldn't work; TEP-62 wants another data serialization compared to the .toCell() call. (reply to 147836)

Chace: I'm getting cell Underflow error code 9, but unable to find out what's missing, tried to use retracer but that unable to understand that too, can anyone guide or enlighten me

Willy: If you're developing contacts yourself - try debugging with "dump()" or smth else to see which line creates an error. (reply to 147854)

Андрей: Good evening. I have the TMA app and I want to exclude several wallets from the list that TonСonneсtUI offers.  <TonConnectUIProvider                 walletsListConfiguration={{                   includeWallets                 }}               >  I pass here a list of wallets that I would like to see in the modal window. But this list does not change

— 2025-05-06 —

Abrham: Hi, I've developed a web app similar to Polymarket where users can deposit Toncoin and interact with the platform. When a user wants to withdraw their balance, the process should be automatic.  I understand how to handle deposits using TON Connect, but my question is: How can I automate withdrawals without requiring my manual intervention?

Daivd: You mean, withdraw? (reply to 147867)

Abrham: yes (reply to 147869)

Daivd: https://docs.ton.org/v3/guidelines/dapps/asset-processing/payments-processing/#toncoin-withdrawals-send-toncoins (reply to 147870)

Kenny: Hi guys. I want to develop a Telegram Bot (not mini app) that allows users to send TON to a specific address. I find this doc and this GitHub repo . Those are very helpful, but why does the doc say it's outdated? I've run the demo project, and it's exactly what I want.

Star1004: Interested (reply to 147873)

FREEZZZZ: hello, why in ton center, the output like this: {   "ok": false,   "result": "Network not allowed",   "code": 403 }

Chace: I dont own the contract (reply to 147858)

Alex: Because a bot's UX/UI contains many issues, developers who start using bots can't resolve them.   All these issues are solved in TMAs with TON Connect protocol.   So, if you plan to build any TON-based service with a nice UX/UI, it is suggested that you make it with TMA. (reply to 147873)

Kenny: Thanks Alex. Could you please specify what issues does bot have? I'm thinking that the text based UI is actually very good.  Besides, the doc also says TMA is more secure. I can't understand in which way TMA is more secure.  Thanks in advance 🙏 (reply to 147879)

Андрей: Could you guys help me? (reply to 147861)

Mojisola🍅 🍅: the Tact Smart Battle Contest rewards have been distributed hours ago.  any participant here..

Jacob: hello,   1. issue description.     err  {"message":"Request failed with status code 500","code":"ERR_BAD_RESPONSE","name":"AxiosError","status":500,"response.config.data":"{\"id\":\"1\",\"jsonrpc\":\"2.0\",\"method\":\"getTransactions\",\"params\":{\"address\":\"EQDlYDH0PmST2okwTluXJ2mUDMDCzPzXF1gGz24U6H2tE24h\",\"limit\":91,\"archival\":true,\"to_lt\":\"0\",\"lt\":\"34281132000001\",\"hash\":\"f72e8179fb68469156ccf7f0d78b794e331f9e999bcb8050bfffc65ee09f258d\"}}","response.data.error":{"ok":false,"error":"LITE_SERVER_UNKNOWN: cannot compute block with specified transaction: cannot find block (0,e56031f43e6493da) lt=34075122000001: lt not in db","code":500}}   1) for testnet , above is the issue.   2) for mainnet , there is no such issue.   3)   testnet url: https://testnet.toncenter.com/api/v2/jsonRPC  mainnet url: https://toncenter.com/api/v2/jsonRPC    2. is there stable rpc url for testnet when we call getTransactions?

leo: i'm having the exact same issue here. the mainnent it's working well but the tesetnet getTransactions is failing (reply to 147893)

Андрей: Please help me I have the TMA app and I want to exclude several wallets from the list that TonСonneсtUI offers.                  walletsListConfiguration={{                   includeWallets                 }}               > I pass here a list of wallets that I would like to see in the modal window. But this list does not change

&rey: Are the wallets you want to exclude buggy? (reply to 147902)

Андрей: bitget (reply to 147903)

Artur: Hi! I used the built-in swap in Trust Wallet to exchange 18 TON for SOL on May 5th. The transaction failed and was marked “Suspicious” in TON Explorer. Funds were sent to contract  0:aa4ee3d2f9c30df5249185a16bc093862fb74a90517c0b46b4e60d96cc8f6e44 and never returned.  Does anyone recognize this contract? Is it part of a legit DEX or bridge? Any hope to recover funds?

Mojisola🍅 🍅: why do this? (reply to 147910)

Combot: Combot has warned LodStorn (1/3) Reason: Word **** is not allowed

LodStorn: I need help to build AMM working on TON. dm if you have FunC experience

TON Bounty Bridge: ​Toolbox for creating .ton subdomains  🏷 Developer Tool  Summary:A toolbox for TON developers and users to create and manage .ton subdomains. It includes smart contr...  Rewards: • TBD USD in TON • SBT Bounty Reward  Created by nessshon

Albert: Ping me (reply to 147919)

— 2025-05-07 —

Desconocido: Help me Could someone tell me if I have just been robbed, because they made a payment to me with this currency and at first everything was fine and then Telegram marked it as spam

Mojisola🍅 🍅: you should verify. that should be easy (reply to 147944)

Jolly: Hi everyone, we are preparing to launch our app on the Telegram Mini App Store and begin operations. Initially, we plan to use Telegram’s native advertising system for promotion, but we’re currently unsure how to track the performance of these ads. Does anyone have any recommendations?

Daivd: You can use your mini app (reply to 147947)

Jolly: how to trace the ad performance by my mini app? Is there any API or SDK to plug in? (reply to 147948)

Daivd: No, implement that function. (reply to 147949)

Jolly: Sorry, I didn't get it, what function? (reply to 147951)

Daivd: You can make the section to track in your mini app. (reply to 147952)

&rey: Totally off topic for the chat. (reply to 147947)

Andy: If a message is sent to a contract in the same shard, can it get processed in the same block?

Mojisola🍅 🍅: why do you need this details?

Max: generally it will be, yeah (reply to 147965)

Andy: just thinking how much I can reduce confirmation time by sharding contracts (reply to 147967)

Andy: that's great news. what decides whether it will though? (reply to 147968)

Max: it's somewhere in sources of blockchain, won't be able to tell you rn where exactly. i'm pretty sure it's like 90% of the time that the same shard tx will be processed in same block, but i'm not sure what happens if, for example, you try to recursively call, for example, yourself a million times: it would make sense that these messages won't all be in the same block, but i'm not that sure (reply to 147970)

Andy: that makes sense. thank you!

&rey: Validator, based on block limits. There is also some lower or upper bound (I don't remember) on ratio of external to internal messages processed. (reply to 147970)

Ad: Gm. how can i disassemble a contract code found on the chain? disassemble to fift fx

&rey: Approximately like https://github.com/ProgramCrafter/wallet-contract/blob/c4e9271abae8abe554a82e7d34f8c87b073acd8e/build.ts#L3-L10. (reply to 147978)

Terminator: hey is there any tutorial or docs available with examples how to build on ton?

Ad: yes. maybe tvm-disassembler s what i need thanks! (reply to 147992)

Boris: Hello, a question from a newbie, I have debug enabled in the compilation of a file and I use the dump function to output an error via try...catch, how can I view the error itself, do I need to view it somehow via tonviewer testnet?

klass: You need to write and run tests to make the error visible. Dump is used to output variable values to the terminal when running the program, but the error itself will be displayed without it as a result of the test execution with debugging enabled. Additionally, you can use more detailed debugging with verbosity, which is also specified in the tests as follows:  await blockchain.setVerbosityForAddress(orderNft.address, {     vmLogs: 'vm_logs_full',     print: true,     blockchainLogs: false,     debugLogs: false })  However, there are also options for "live" testing... You can conduct a transaction through the blockchain on either the mainnet or testnet and check the result of its execution via an explorer that supports debug display, but currently, it is less clear than in a test environment. (reply to 148000)

— 2025-05-08 —

Jolly: Hello everyone, I'm currently encountering an issue with the withdrawal process from our product to users. When I try to withdraw 5 USDT to a user's wallet via a contract from a certain app, TON first deducts a fee of 0.25 TON. My app also wants to implement such an order, but I haven't been able to achieve it. I don't understand where this 0.25 TON fee is specified in the code.  Could anyone help?

Desconocido: Could you help me please? (reply to 147946)

Russia: Everyone, can you tell me if Nextjs 15 can use tonConnectUI?

&rey: Please note you are not interacting with TON in any way; Telegram is a distinct entity not controlled by the chain. (reply to 148016)

Jolly: I thought this is an interaction with TON, okay, thx (reply to 148024)

&rey: Anyone can create their own jetton with pretty much any display info and behavior. You should open tonviewer's main page, find true USDC and then enter your address to check if you have any. (reply to 147944)

Russia: I want to connect ton wallet and pay on ton wallet on my website made with nextjs 15. I copied from my reactjs source and it runs normally but through nextjs it doesn't show popup to connect wallet and also shows error code. @pcrafter

.6: I can do it. (reply to 148028)

? NOT SANCHEZIO ?: there is no USDC on ton chain so most likely you got scammed 😔 (reply to 147944)

Sam: hola! can someone explain why this happens inside telegram mini app sometimes when using ton connect ?  also - sometimes the app page is replaced by the ton keeper page for some reason  ton keeper app is installed (android)

Sam: like this (reply to 148055)

Skidrow: hello guys. hacker withdrawal my funds from MYTONwallet 4 hours ago

Skidrow: my telegram account was hacked as well

&rey: This group has nothing to do with it nor has any ability to help. (reply to 148062)

Sam: this page is especially annoying because it breaks user interaction with the app - any ideas ? (reply to 148056)

TON Bounty Bridge: ​Add support for wallet connection via QR code  🏷 Developer Tool  Summary:Implement a tool that enables users to connect their TON wallet by scanning a QR code, streamlining ...  Created by my9letters

— 2025-05-09 —

Pasha: Wtf 🤣 (reply to 148076)

Jan: Hi Ton devs I am following the smart contract tutorial When I run npx blueprint run, It asks "Which wallet are you using?". I remember in deploy script we already hardcord mnemonic. Which option should I choose?

klass: Hello. Please try out Tonkeeper. (reply to 148106)

Aleks: toncenter TESTNET v2/jsonRPC throwing 500s

Boris: Hello! have a small question - TON wallet doesn't get activated after top ups. What's the cause?

Boris: address is UQDCxTpNnwrU8IuuBbPe2vCBWY7ZbJdz9ldNyBP5mB8TQQz2

jennifer [afk]: u need to make transaction (reply to 148110)

Артур: At least one outgoing transaction is required (reply to 148110)

Boris: ok thanks (reply to 148113)

Boris: another one question - how to find the reason why transaction is partially applied? a5f34cb3071144275f75910b875a7a3afc60373eb5104d5edc05bb76540ff887

&rey: Insufficient TON, in all probability? (reply to 148115)

Boris: 2.97+ 0.25245 + 0.04455 = 3.267 < 3.27 without PayGasSeparately flag

&rey: And where did you count 0.007 TON in fees? (reply to 148117)

Boris: but it's deducted from each amount isn't it? (reply to 148118)

Boris: unclear for me from the docs

Boris: reality = intention - fee right?

Boris: is there any guide how withdraw funds to multiple accounts at once and understand how much of them are really withdrawable without PayGasSeparately flag?

Gg: Hello everyone. Are there any representatives of Fragment here? Or what are the current ways to contact them?

klass: Please make a constant for the costs to calculate available funds on-chain or I got smthng wrong? 🚀 (reply to 148123)

&rey: You didn't account for compute fees (needed for processing your order at all). And for storage which happened to be zero. (reply to 148122)

Boris: so they should be accounted separately even without PayGasSeparately flag right? (reply to 148127)

Boris: got it - thanks)

&rey: You could make the biggest message have flag 128 (SendRemainingBalance) value 0, and rotate list to send it last.

&rey: I don't think there were any contact options whatsoever. (reply to 148125)

&rey: Anyways, not relevant to this chat.

Jan: Also which wallet contract instance do I have to use from @ton/ton lib? Here is my wallet address (w5) in testnet - 0QCI4TmOUkA6y_AjBnmaTmdjNQHe6qdovWMN-AWlhMR81Bda (reply to 148107)

klass: Well, try one of the latest for confidence, so that if you will implement some newest functionality, you will not have to change this for more amount of time.  import { WalletContractV5R1 } from '@ton/ton/dist/wallets/WalletContractV5R1'; (reply to 148135)

Jan: I tried this but with same mnemonic it shows different wallet address. When you check above wallet address in tonscan, it's version is wallet_v5 (reply to 148137)

klass: There are different addresses formats, there were several transitions. I recommend you to use Tonviewer OR not paying attention to this issue, as it is obvious to use the same Wallet version instance you are actually deploying  https://testnet.tonviewer.com/kQCI4TmOUkA6y_AjBnmaTmdjNQHe6qdovWMN-AWlhMR81Eqf (reply to 148138)

Jan: Problem is even if I use WalletContractV5R1, it says the the different wallet address connected. And says wallet is not deployed Code:   const key = await mnemonicToWalletKey(mnemonic.split(" "));   const wallet = WalletContractV5R1.create({ publicKey: key.publicKey, workchain: 0 }); Logs: Using file: deployCounter ? Which network do you want to use? testnet ? Which wallet are you using? TON Connect compatible mobile wallet (example: Tonkeeper) Connected to wallet at address: EQBC4Zd6VA00TaOF6z2IFaj0rU3RqrSBd17JbkgUW_L7VM71 contract address: EQBUDBeL9w5Br1o0c4DlI9ZUrJZtnAsRK3AIEkOpc023MuxQ wallet is not deployed

klass: Blueprint environment creates you a "random" wallet to deploy your contract from the script, so it shows you the address of that newly created deploy-wallet. If you want to actually deploy a wallet using terminal, you can git clone that repository and do that for example:  https://github.com/tonkeeper/w5  Another practice is to create necessary wallets manually and just use them. For example you can use Tonkeeper PRO for comfort.  Apart from that blueprint creates a config file for the newly created wallet. If you want to put there your custom wallet, you can just change the config manually as well.  So deploy-wallet created automatically is not the same as the contract of wallet you are deploying with blueprint environment.  Please give a feedback if I misunderstood you. (reply to 148140)

Jan: I am following the smart contract tutorial now and got stuck in step 8 (reply to 148141)

Jan: helloworld dot tonstudio dot io

Jan: In the deploy script, we put mnemonic   // open wallet v4 (notice the correct wallet version here)   const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)   const key = await mnemonicToWalletKey(mnemonic.split(" "));   const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });   if (!await client.isContractDeployed(wallet.address)) {     return console.log("wallet is not deployed");   }  So this tutorial is incorrect one?

&rey: It might be outdated or very outdated. (reply to 148146)

Jan: Then which tutorial can I try? (reply to 148147)

klass: Tutorial is correct, change here as well  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });  And check in tonviewer if you like ) (reply to 148146)

Andy: Since w5 allows for arbitrary actions, that means all w5 contracts can be updated similar to SETCODE right?

Jan: I changed WalletContractV4 to WalletContractV5R1 but as I mentioned above it shows different wallet address. (reply to 148149)

klass: it shows just another wallet format, do not worry (reply to 148155)

Jan: Using file: deployCounter ? Which network do you want to use? testnet ? Which wallet are you using? TON Connect compatible mobile wallet (example: Tonkeeper) Connected to wallet at address: EQBC4Zd6VA00TaOF6z2IFaj0rU3RqrSBd17JbkgUW_L7VM71 contract address: EQBUDBeL9w5Br1o0c4DlI9ZUrJZtnAsRK3AIEkOpc023MuxQ wallet is not deployed But as you've seen my wallet is already deployed but it says it's not deployed

&: Can I get exact token output amount on swap?

— 2025-05-10 —

Kenny: Hi guys. Which language is suggested to use now to develop smart contracts? FunC, Tact or Tolk? There are so many there... Which language has the most mature ecosystem? Thanks!

Master: Tact is more powerful, I think. (reply to 148174)

Kenny: But afaik,wallet contracts are developed in FunC...

Kaveh: 📩 Official Invitation to the TON Community Dear TON Community, On the occasion of Technology Day, which coincides with the birth anniversary of Muhammad ibn Musa al-Khwarizmi – the father of algebra and one of the greatest contributors to mathematics and computer science – we are delighted to invite you to participate in the upcoming TechDay Khuzestan event in Iran. This event will be held at Gundishapur University in Ahvaz – recognized as the world’s first university – and will focus on innovation, emerging technologies, blockchain, and the TON ecosystem. 🗓 Date: July 13, 2025 Registration & More Info: https://www.techday.top 📩 Email: techday.khuzestan@proton.me We warmly welcome your participation, presence, or contribution to this historic celebration of technology and legacy.

Combot: Hello Алексей Не важно! Click on the button below so that we understand that you are not a bot who came to tell us about how Durov is giving away bitcoins as a gift.

:3: Crypto Bot? (reply to 148201)

&rey: There is https://github.com/gobicycle/bicycle (if you need any automatic processing; manually, just a wallet address would suffice). (reply to 148201)

Complex: https://github.com/txsociety/spice-harvester  I have made simple server for this (reply to 148201)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;(": TON needs a tool like hel.io for creating invoices and simple paylinks (reply to 148204)

&rey: You know that ton://transfer links do exist, right? (reply to 148207)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;(": I mean a service to simplify creating invoices and checkout flow (reply to 148208)

Complex: This one. You can creae invoice and receive it status. Very simple (reply to 148206)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;(": How can you create an invoice with product details and customer info with deeplinks?

Complex: https://github.com/txsociety/spice-harvester/blob/main/api/example.http (reply to 148211)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;(": nice job, thanks for sharing. Its can be infrastructure for what i said. Because needs a friendly UI to creating and monitoring invoices (reply to 148210)

Complex: Coming soon. (reply to 148213)

&rey: Asking for DMs is not permitted. Please describe your task a bit more detailed than "I have one".

MoeMoney: /help

— 2025-05-11 —

Kenny: Hi guys. According to docs, transaction fee consists of 5 parts: storage_fee, in_fwd_fee, computation_fee, action_fee, out_fwd_fee. Assume a transaction will send an internal message to another contract, and there's no in_fwd_fee (which incurs when receiving external messages) and out_fwd_fee (which incurs when sending messages to outside blockchain like logging). We don't consider IHR either. We only consider the other 3 fees.  storage_fee and computation_fee is easy to understand. But I'm really confused with the action_fee. According to docs, action_fee is calculated by:  total_fwd_fee = lump_price + ceil((bit_price * number_of_bits + cell_price * number_of_cells) / 65536)  action_fee = total_fwd_fee * first_frac / 65536  where lump_price, bit_price, cell_price, first_frac is in the config parameter 24 & 25.  So, we are actually calculating total_fwd_fee first, and then action_fee is approximately 1/3 of this total_fwd_fee. And action_fee is actually part of total_fwd_fee. The remaining 2/3 of the total_fwd_fee is the forward fee of the newly created internal message.  So here comes 2 questions that confuse me a lot:  1. The word "forward" and its short form "fwd" are used everywhere. What exactly is a "forward fee"?  2. In my image, the amount I actually spend on fees should be the sum of all. How ever, the message forward fee (i.e., 2/3 * total_forward_fee) isn't counted into the transaction_fee. We can also confirm this on tonviewer.com. Why is it the case? Is it because the action_fee and message forward fee will be awarded to different validators?

Leo: 1. forward fee is paid to validators along the routing path of outgoing messages 2. yes, total_fee only counts 1/3 of total forward fees that are paid to the validator responsible for the tx that sends messages

Kenny: Oh! I understand. But why isn't the forward fee counted into the transaction_fee? To me (and possibly other people coming from other chains), in a naive toncoin transfer scenario, the "transaction fee" should be the amount that I am debited but not credited to recipient

Kenny: I mean, the "transaction fee" should be equal to the rewards of all validators plus burnt amount

User<7802931480>: Transaction fee includes the amounts paid immediately. Forward fee is deducted on outgoing message kick off. (reply to 148239)

Kenny: What? Do you mean the forward fee is deducted gradually as the message is routed and getting closer to target contract? (reply to 148241)

User<7802931480>: I mean not every transaction will cause an outbound message from the smart contract, so there would be no any forward fee in that case (reply to 148242)

Kenny: You are right. But when there IS an outbound message, I think the forward fee should be counted into the "transaction fee", but the fact is that forward fee isn't counted into transaction fee.

User<7802931480>: Outbound message would be another transaction. (reply to 148244)

Kenny: Yes there's one more transaction. But the forward fee isn't counted into either transaction.

User<7802931480>: That's something in between two transactions. (reply to 148246)

Kenny: So the forward fee is indeed deducted gradually? If I query the balance of my wallet contract multiple times after my wallet contract sends an outbound internal message, and before the message reaches target contract, I might get different results?

User<7802931480>: Well, on smart-contract execution, a queue for all actions is formed, including outbound messages. Forward fees are deducted from the smart-contract balance on outbound message creation, and the amount for validators is attached to the message.

Kenny: The queue is formed during action phase of the transaction, isn't it? It seems not something in between two transactions...

User<7802931480>: As far as I know, messages are formed on compute phase, than sent on action phase.

Kenny: OK, so they are formed on compute phase of the transaction. Still seems not something in between two transactions

User<7802931480>: Yes, sorry for small confusion

Leo: the total_fee field is for validators constructing merkle proofs of the shard block, instead of for you users to get the "transaction fee" (reply to 148240)

Leo: so it's augmented by the fees only charged by the validator responsible for the tx

Kenny: OK I understand. But this is still confusing. Why doesn't any Ton explorer show the actual transaction fee paid by users? All Ton explorers only shows total_fee, which is only collected by the validator responsible for the tx...

Leo: bcoz explorers usually only show native data in the blockchain node

Leo: all fields in, say tonviewer transaction page, are directly obtained from the tx cells in node database

User<7802931480>: So that data is not consistent with real fees?

&rey: Value flows are more relevant indeed. (reply to 148260)

Kenny: Thanks a lot! 🙏

Leo: it's consistent if you do not misunderstand meaning of the total_fees field (reply to 148260)

User<7802931480>: I see... As explorers show forward fees as well. Thank you.

Kenny: But from a user's perspective, I have to manually calculate the sum of them. And if there are many outbound messages, this is a little bit painful... (reply to 148265)

Seva: You can use ready-made emulation for estimation.

Leo: you can simply do total_fee-action_fee+fwd_fee or storage_fee+gas_fee+fwd_fee, these fields are already summed (reply to 148266)

Kenny: Oh! Make sense! 👍 (reply to 148269)

James: Hi there? Anyone here need full-Stack and Web3 d.e.v?

— 2025-05-12 —

Kenny: Hi guys. If a contract has some operations that can only be called by an admin, there seems to be 2 ways to achieve this. One is to store an owner address, and check if the internal message sender is equal to this (e.g., Jetton Wallet). The second way is to store an Ed25519 public key, and verify signature in the external message (e.g., Wallet).  Seems that the first approach is more preferrable. But with the second approach, we can save some fee that would've been used for paying internal message forward fee, right? Is there any best practice like "just don't handle external messages yourself"?

Leo: Not only cost, but the functions are not equal with the two methods. With the first, you can set any address as the admin, be it a wallet, multi-sig, or more complicated contracts. But with the second, only Ed25519 keys can be set and that's neither flexible nor secure.  Generally storing an address is common practice in most cases, which may cost more storage fees but the difference is negligible. Do not over-optimize, focus on more important aspects.

&rey: unfortunately it's counterbalanced by "just don't make extra messages in transaction chains" (reply to 148305)

Kenny: Thanks a lot!! 🙏

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 19 ✅ Approved bounties: 0 🔄 Bounties seeking suggestions: 65  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

JD: Hello everybody.  Is tvm:-239 (mainnet ) and tvm:-3 (testnet) the correct CAIP2 ids ?

JD: i've found the docs about it that is a draft that i can't post on the channel apparently and couldn't find anymore informations.

Seva: > Is tvm:-239 (mainnet ) and tvm:-3 (testnet) the correct CAIP2 ids?  Yes

Michaelzy: good day everybody please what is the recommended library to use in backend to interact with tact smart contracts

Michaelzy: I am currently using @ton/ton  But when i send transaction there is no was to check if transaction is successful or not because the sendMessage fn returns a void Promis

&rey: Hint question: which of the transactions? (reply to 148328)

Secret: Hello everyone, I am passionate blockchain developer, if you need my help I am willing to help you

Michaelzy: i created an nft collection. i then wrote a script using @ton/ton library to send a transaction to the contract and mint an nft item i currently have no way of retrieving the contract address of the deployed nft item after it is deployed (reply to 148330)

Dark Star: Hey everyone! I’m running into an issue while building a function to send tokens – mainly interested in sending USDT on TON.  Here’s what my function currently looks like: public static async sendToken(from: string, to: string, amount: number) {     try {         const privateKeyHex = '';         const privateKey = Buffer.from(privateKeyHex, "hex");                  const jettonMinter = new JettonMinter(tonweb.provider, {             address: new Address('EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'),             adminAddress: new Address('EQBkQP48aUEDg5Y5RRc8SxFHm_C5tNcJDlh3e9pYHC-ZmG2M'),             jettonContentUri: 'https://tether.to/usdt-ton.json',             jettonWalletCodeHex: 'b5ee9c72010101010023000842028f452d7a4dfd74066b682365177259ed05734435be76b5fd4bd5d8af2b7c3d68',         });          const fromAddress = new Address(from);         const toAddress = new Address(to);          const senderJettonWalletAddress = await jettonMinter.getJettonWalletAddress(fromAddress);         const senderJettonWallet = new JettonWallet(tonweb.provider, {             address: senderJettonWalletAddress,         });          const transferBody = await senderJettonWallet.createTransferBody({             tokenAmount: utils.toNano(amount.toString()),             toAddress: toAddress,             responseAddress: fromAddress,             forwardAmount: utils.toNano('0.01'),             forwardPayload: new TextEncoder().encode('gift'),         });          const WalletClass = tonweb.wallet.all.v3R1;         const wallet = new WalletClass(tonweb.provider, {             publicKey: utils.nacl.sign.keyPair.fromSecretKey(privateKey).publicKey,         });         await wallet.deploy(privateKey);          const seqno = await wallet.methods.seqno().call() || 0;         const transaction = await wallet.methods.transfer({             secretKey: privateKey,             toAddress: new tonweb.Address(to),             amount: utils.toNano('0.01'),             seqno: seqno,             payload: transferBody,             sendMode: 3,         }).send();          Print.ev('Token Send: ', transaction);     } catch(error) {         Print.error('Ton | sendToken | Error: ', error);     } }  After running it, I see a new transaction on tonscan with “Action Called Contract”, and it deducts 0.05 TON and sends it to the recipient – but the USDT token itself doesn’t get transferred.  I tried tweaking the jettonTransferBody according to the docs: https://docs.ton.org/v3/guidelines/dapps/cookbook  But when I do, I get an error: Invalid character.  Feels like the issue is with how I’m building the jettonTransferBody. Any idea what I might be doing wrong?  Thanks in advance

Dark Star: Never mind, I figured out the issue, I was using the wrong address for the recipient 😅 Turns out I was passing the user’s wallet address directly, but it should’ve been the Jetton wallet address instead.  Now the transaction goes through, but there’s a new problem: it sends 0 USDT instead of the intended 0.5 USDT. Not sure yet if it’s an encoding issue or something else, still digging into it. (reply to 148335)

&rey: TonWeb bindings issue. (reply to 148338)

Asrorbek: There should be a common issue and solution website for those facing issues like this. (reply to 148341)

&rey: TonWeb reads jettonAmount but binding labelled it tokenAmount.

&rey: There is. Namely, github.com. (reply to 148342)

Dark Star: So, as I understand it, I need to pass a parameter called "jettonAmount" when creating the transfer body. But TypeScript throws an error saying that this property doesn’t exist in the TransferBodyParams type. (reply to 148343)

&rey: Absolutely. You have to do some typing tricks if you want it work with TonWeb. A more common library for TS is @ton/ton.  I should also note that you cannot forward 0.01 TON out of 0.01 you provide for completing the transfer, which is an issue with your parameters. (reply to 148346)

Dark Star: Thanks a ton for the help. That cleared things up. I’ll take another look tomorrow and consider switching to @ton/ton. Really appreciate the support.

— 2025-05-13 —

Howard: anyone heard any project similar like Skatechain.org that help people interacting with other chains in TON?

Nihal: Hello TON community  I am seeking a ZK dev ? Anyone here? ( Unpaid, looking for a contributor)

.6: Yeah, ZK dev here. Worked with zk-SNARKs, Circom, and smart contract integration. Let’s chat. (reply to 148385)

Вадим: Looking for a developer experienced with TON (smart contracts, FunC/Tact). We're applying for a grant to build a project that combines an AI agent + DAO constructor on TON. The idea: a decentralized service with auto-payments and onchain logic. If you're interested in joining as a co-creator — DM me, I’ll share the pitch and details.

Seva: Отписал (reply to 148387)

Terry: @pcrafter  I have question I run the script to mint the new jetton when deploy, I use onchain metadata so after mint, send 0x04 message to change content, jetton's metadata even jetton_content changed, I can't see any change on explorer Can you explain about it?

Terry: ok solved problem. it takes some time to show the updated metadata (reply to 148395)

.6: I'm an expert in TON (reply to 148387)

Seva: I have written him (reply to 148399)

TON Bounty Bridge: ​From f0c421f85f2d28fd6e43ef100b2a9293c9df0a13 Mon Sep 17 00:00:00 2001  Created by Eikyarkway

— 2025-05-14 —

SINISTER: I'm looking for someone who can measure the creditworthiness of smart contracts. Is there anyone here to help me

professor x: Do u know how I can learn about creating smart contracts and wallets and sending money (reply to 148443)

ሏጠሀፐየሀህ ፎዐየዐዘሀዘ: Good morning to everyone!  👋 Who can give you the code for a crypto bot, from which you can start writing your own, like the basis for a crypto bot. Please! 🙏

SINISTER: Can I send you the address? (reply to 148446)

professor x: I don't know how to check validity (reply to 148449)

SINISTER: Well, that's my problem, bro 🤣🤣 (reply to 148450)

SINISTER: You don't have a friend or acquaintance whose source code is publicly available

professor x: Nope (reply to 148452)

Hooman: for learning smart contract on TON, search for "funC" and "tact" programming language. (reply to 148444)

ሏጠሀፐየሀህ ፎዐየዐዘሀዘ: Good morning to everyone!  👋 Who can give you the code for a crypto bot, from which you can start writing your own, like the basis for a crypto bot. Please! 🙏

Tharun Tej: How to create multi-sig wallet on TON?

Seva: multisig.ton.org (reply to 148458)

Tharun Tej: Can you guide me how to use it and how will it work, pls? (reply to 148459)

Ricardo: Hey guys, im trying to parse and decode a transaction before sending it to the network to understand all the details involved.      const message = beginCell()       .storeWritable(         storeMessage(           external({             init: seqno == 0 ? contract.init : undefined,             to: contract.address,             body: transfer           })         )       )       .endCell()  are there any tools?

fedya eremin: hey, guys, does gobicycle require personal liteserver?

.6: Interested (reply to 148455)

&rey: Prerequisites point 2: it requires personal liteserver only for reliability. (reply to 148467)

&rey: It is strange to try decoding the thing you just constructed. (reply to 148466)

&rey: On https://docs.ton.org. (reply to 148444)

Daniel: Is anyone looking for a FunC dev?

JD: Usefull for multisigs etc. Standard stuff (reply to 148479)

Seva: DM (reply to 148484)

Dark Star: Hey folks, me again 😅 Ran into another issue – this time I’m trying to parse a Jetton transfer transaction.  For regular transactions, I can get the amount and other info from targetTx.inMessage?.info, but with Jetton transfers, the actual amount isn’t there. GPT says I should look in targetTx.inMessage.body, but when I try to parse it, I get this error:  No overload matches this call. Argument of type 'Cell' is not assignable to parameter of type 'string | Buffer | ArrayBuffer...'   Turns out inMessage.body is already a Cell, and I guess I was treating it like a base64 string or buffer 🤦  Any idea how to properly extract the amount from Jetton transfers? Or maybe I’m just missing something obvious after switching to @ton/core. Appreciate any tips!   Full code: public static async transactionsTokenFounder(adr: string, tx: string) {     try {         const wallet = Address.parse(adr);         const transactions = await client.getTransactions(wallet, { limit: 5 });         const targetTx = transactions.find(t => t.hash().toString('hex') === tx.toLowerCase());          if (targetTx && targetTx.inMessage?.body) {             console.log('FOUND THIS SHIT!', targetTx.inMessage?.info)             const hash = targetTx.hash().toString('hex');             const from = targetTx.inMessage?.info.src?.toString() ?? 'unknown';             const to = targetTx.inMessage?.info.dest?.toString() ?? 'unknown';                          const bodyBuffer = Buffer.from(targetTx.inMessage.body, 'base64');             const cell = Cell.fromBoc(bodyBuffer)[0];             const slice = cell.beginParse();              slice.skip(32);             slice.skip(64);              const amount = slice.loadCoins();             console.log('Amount:', amount.toString());             //@ts-ignore             const fee = targetTx.totalFees?.coins ?? 0n;             const timestamp = new Date((targetTx.now ?? 0) * 1000).toISOString();                      console.log(                 'Found transaction:\n' +                 `hash:   ${hash}\n` +                 `from:   ${from}\n` +                 `to:     ${to}\n` +                 `amount: ${fromNano(0)} TON\n` +                 `fee:    ${fromNano(fee)} TON\n` +                 `date:   ${timestamp}`             );                     } else {             console.log('All hashs found transactions:');             for (const tx of transactions) {                 const hash = tx.hash().toString('hex');                 console.log(`- ${hash}`);             }         }     } catch (error) {         console.error('Ton | transactionsTonFounder | ERROR: ', error);         throw new Error(`Ton | transactionsTonFounder | ERROR: ${error}`);     } }

Nemo: Hi guys, could you please help, I want to track if a transaction I sent by tonconnect is completed, how this can be done?

&rey: Please see https://t.me/tondev_eng/145782. (reply to 148491)

Tharun Tej: Use tonviewer (reply to 148493)

Slava: You can use Cell.fromBase64() directly. (reply to 148489)

&rey: Is that a valid TON address though? (reply to 148493)

Tharun Tej: Easy bro! (reply to 148491)

Slava: import assert from 'node:assert/strict';  import { Address, Cell } from '@ton/core';  interface JettonTransfer {   queryId: bigint;   amount: bigint;   from: Address;   responseAddress: Address;   forwardTonAmount: bigint;   forwardPayload: (Cell | undefined); }  const MSG_OP_CODE_SIZE = 32;  const JettonOpCodes = {   transfer: 0x0f8a7ea5,   transfer_notification: 0x7362d09c,   excesses: 0xd53276db,   burn: 0x595f07bc,   provide_wallet_address: 0x2c76b973,   take_wallet_address: 0xd1735400,   internal_transfer: 0x178d4519,   burn_notification: 0x7bdd97de,  } as const;  export function parseJettonTransfer(   cell: Cell  ): JettonTransfer {    const slice = cell.beginParse();    /**    * internal_transfer#178d4519    *   query_id:uint64    *   amount:(VarUInteger 16)    *   from:MsgAddress    *   response_address:MsgAddress    *   forward_ton_amount:(VarUInteger 16)    *   forward_payload:(Either Cell ^Cell)    *    * = InternalMsgBody;    */    const op = slice.loadUint(MSG_OP_CODE_SIZE);   assert.equal(op, JettonOpCodes.internal_transfer);    const queryId = slice.loadUintBig(MSG_QUERY_ID_SIZE);    const amount = slice.loadCoins();    const from = slice.loadAddress();    const responseAddress = slice.loadAddress();    const forwardTonAmount = slice.loadCoins();    const forwardPayload = slice.loadMaybeRef();    return {     queryId,     amount,     from,     responseAddress,     forwardTonAmount,     forwardPayload: (forwardPayload ?? undefined),   };  } (reply to 148489)

Pesy: import assert from 'node:assert/strict';  import { Address, Cell } from '@ton/core';  interface JettonTransfer {   queryId: bigint;   amount: bigint;   from: Address;   responseAddress: Address;   forwardTonAmount: bigint;   forwardPayload: (Cell | undefined); }  const MSG_OP_CODE_SIZE = 32;  const JettonOpCodes = {   transfer: 0x0f8a7ea5,   transfer_notification: 0x7362d09c,   excesses: 0xd53276db,   burn: 0x595f07bc,   provide_wallet_address: 0x2c76b973,   take_wallet_address: 0xd1735400,   internal_transfer: 0x178d4519,   burn_notification: 0x7bdd97de,  } as const;  export function parseJettonTransfer(   cell: Cell  ): JettonTransfer {    const slice = cell.beginParse();    /**    * internal_transfer#178d4519    *   query_id:uint64    *   amount:(VarUInteger 16)    *   from:MsgAddress    *   response_address:MsgAddress    *   forward_ton_amount:(VarUInteger 16)    *   forward_payload:(Either Cell ^Cell)    *    * = InternalMsgBody;    */    const op = slice.loadUint(MSG_OP_CODE_SIZE);   assert.equal(op, JettonOpCodes.internal_transfer);    const queryId = slice.loadUintBig(MSG_QUERY_ID_SIZE);    const amount = slice.loadCoins();    const from = slice.loadAddress();    const responseAddress = slice.loadAddress();    const forwardTonAmount = slice.loadCoins();    const forwardPayload = slice.loadMaybeRef();    return {     queryId,     amount,     from,     responseAddress,     forwardTonAmount,     forwardPayload: (forwardPayload ?? undefined),   };  }

Nemo: maybe you know, are there testnet version for the base url tonapi.io ? (reply to 148492)

&rey: Well testnet.tonapi.io should work. (reply to 148505)

Nemo: Thank you, (reply to 148506)

zerox: You can use indexer for ton network, like tonindexer or tonresearch (reply to 148491)

zerox: or theGraph is better

Nemo: Thank you will check (reply to 148509)

zerox: I suggest theGraph (reply to 148510)

Dark Star: Thanks a lot, that really helped! (reply to 148499)

Andrei: Hey! Does anyone experiences problems with deploying smart contract through the tonkeeper wallet? It works fine on desktop, but neither on android nor on ios, transaction is perceived as a smart contract deployment, rather as a normal send transaction.

DexfLo: Hello.  We are developing a protocol for TON that is an extension of a live protocol on EVM. It mitigates impermanent loss, at times converting it to an impermanent gain. There is also a lending protocol attached to it that generates synthetic usd from yield earned. With permission, I can drop a pitchdeck on here so you can get a better idea, because it's a bit complex to describe without me leaving a big wall of text that nobody will take the time to read lol.

&rey: Do you have insights which are relevant to ways how to develop on TON by any chance? (reply to 148523)

&rey: Examples of contracts are also appreciated, once you know that they work (as opposed to "well we tested it on a couple of messages and it looked fine").

&rey: If you have any relevant questions, you can either search in chat history and ask!

DexfLo: we have the entire blueprint.  You can't translate the code literally of course, but we have the entire codebase from evm and... what could you possibly have said that was an infraction (reply to 148524)

DexfLo: im going to try to drop this pdf on here and see what happens..  nah.. won't let me

&rey: (I managed to hit word which is used in most scam messages so very convenient to remove them automatically) (reply to 148529)

&rey: On average, knowledge of EVM hindered development for TON compared to general programming experience. (reply to 148529)

DexfLo: anyway, we have a sound plan. Im in the midst of applying for a grant. This can work as a standalone dex/lending protocol, or it can integrate with any other dex/liquidity pool

DexfLo: i just sent u a message

— 2025-05-15 —

Mojisola🍅 🍅: was restricted for 5 days. now it has elapsed. Will I be restricted again....

Lasha: Hey, How can I send a Jetton transaction that will bounce?

Mojisola🍅 🍅: send above your balance, it will bounce

Giorgi: Hello

Giorgi: I have problem while deploying jetton_wallet using hub.docker.com/r/trinketer22/func_docker/  sudo docker run --rm -it -v /path/to/project:/code -v /path/to/toncli_conf_dir/:/root/.config toncli-local deploy --net testnet   address is active but contract type is unknown (testnet address: kQAum8jtCv0jiFZsZUoMAzQFoUOgKR2PZK0Q5kpMfv28DG2f)   error while deploying INFO: 🚀 You want to interact with your contracts ['jetton_wallet'] in testnet - that's great! INFO: 🦘 Found existing deploy-wallet [kQAum8jtCv0jiFZsZUoMAzQFoUOgKR2PZK0Q5kpMfv28DG2f] (Balance: 1.998173999💎, Is inited: True) in /root/.config/toncli INFO: 👻 Your smart contract project [/code] is now going to be deployed, get ready! INFO: 🌈 Start building:  failed to create output file /code/build/jetton_wallet.fif Traceback (most recent call last):   File "/usr/local/bin/toncli", line 8, in <module>     sys.exit(main())   File "/toncli/src/toncli/main.py", line 67, in main     CommandsExecuter(command, string_kwargs, parser)   File "/toncli/src/toncli/modules/utils/commands/commands_executer.py", line 42, in __init__     self.command_mapper[command](self)   File "/toncli/src/toncli/modules/utils/commands/commands_executer.py", line 73, in deploy_command     return DeployCommand(self.string_kwargs, self.parser)   File "/toncli/src/toncli/modules/utils/commands/command_classes/deploy_command.py", line 17, in __init__     deployer.publish(real_args[2:])   File "/toncli/src/toncli/modules/deploy_contract.py", line 81, in publish     self.compile_func(real_contracts)   File "/toncli/src/toncli/modules/abstract/deployer.py", line 153, in compile_func     fift_build(self.project_root, cwd=self.project_root, contracts=contracts)   File "/toncli/src/toncli/modules/utils/func/commands.py", line 47, in build     build_files(contract.func_files_locations, contract.to_save_location, func_args, cwd))   File "/toncli/src/toncli/modules/utils/func/commands.py", line 81, in build_files     get_output = check_output(build_command,   File "/usr/lib/python3.8/subprocess.py", line 415, in check_output     return run(*popenargs, stdout=PIPE, timeout=timeout, check=True,   File "/usr/lib/python3.8/subprocess.py", line 516, in run     raise CalledProcessError(retcode, process.args, subprocess.CalledProcessError: Command '['/usr/local/bin/func', '-o', '/code/build/jetton_wallet.fif', '-SPA', '/root/.config/toncli/func-libs/error_codes.func', '/root/.config/toncli/func-libs/stdlib.func', '/root/.config/toncli/func-libs/math.func', '/code/func/helpers.func', '/code/func/op-codes.func', '/code/func/params.func', '/code/func/jetton-utils.func', '/code/func/jetton-wallet.func']' returned non-zero exit status 2.   Any ideas?

Ricardo: Hey guys, what methods are availiable for me to fetch fees for a simple transaction? is it possible to fetch normal and fast fees if i want the tx to be included faster?

Ricardo: ideally using '@ton-api/client' or '@ton/ton' libraries

Mojisola🍅 🍅: ton is a kind of different network.  you send enough ton for a transaction and return excess to your wallet.   because it is asynchronous and transaction confirms later not instant like ethereum

Mojisola🍅 🍅: why do you need to know fees??

&rey: No doubt you know that even TON transfer uses two transactions, but fees are fixed by config – there is no "fast fee" whatsoever. (reply to 148567)

&rey: Either your command works wrong with Docker (maybe extra colon in first -v argument), or contract doesn't compile. (reply to 148566)

&rey: Not really topic for public chat. It has to do with whether responses help people. (reply to 148550)

Shemhamforash: you mean tonscanner* (reply to 148494)

Tharun Tej: That is also one of the option (reply to 148577)

&rey: I haven't heard of project with that name. A well-known one is https://tonscan.org . (reply to 148577)

Tharun Tej: That's what he is about to say 🤣 (reply to 148581)

Shemhamforash: You always, want to use native scanner not a 3rd party ones

&rey: Nope. Native one, which is https://explorer.toncoin.org/status, is kinda not convenient to use. (reply to 148584)

Shemhamforash: https://tonscan.org/ is also good (reply to 148585)

— 2025-05-16 —

Alexander: Hello everyone. Is there a way to on-chain verify that the STON.fi router address passed to the contract actually belongs to STON.fi? DeDust has this option and it is implemented by creating a proof for a specific pair of jettons (there is an example in their sdk), which does not allow funds to be sent to the hacker's wallet

Denis: You can't verify this (reply to 148610)

Alexander: Can't verify only for STON fi? Is this implementation for DeDust absolutely correct?  // DeDust contract type const DEDUST_CONTRACT_TYPE_VAULT: Int = 1; const DEDUST_CONTRACT_TYPE_POOL: Int = 2; const DEDUST_CONTRACT_TYPE_LIQUIDITY_DEPOSIT: Int = 3;  // DeDust factory address const DEDUST_FACTORY_ADDRESS: Address = address(   "EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67" );  // DeDust contract code const DEDUST_BLANK_CODE: Cell = cell(   "te6ccgEBBAEAlgABFP8A9KQT9LzyyAsBAgJwAwIACb8pMvg8APXeA6DprkP0gGBB2onai9qPHDK3AgFA4LEAIZGWCgOeLAP0BQDXnoGSA/YB2s/ay9rI4v/aIxx72omh9IGmDqJljgvlwgcIHgmmPgMEITZ1R/V0K+XoB6Z+AmGpph4CA6hD9ghDodo92qYgjCCLBAHKTdqHsdqD2+ID5f8=" );  // Create proof to confirm DeDust address fun createProofAddress(   factoryAddress: Address,   contractType: Int,   jettonAddress: Address? ): Address {   let data = beginCell()     .storeAddress(factoryAddress)     .storeUint(contractType, 8);    if (jettonAddress == null) {     data = data.storeUint(0b0000, 4);   } else {     let parsedAddress = parseStdAddress(jettonAddress!!.asSlice());      data = data       .storeUint(0b0001, 4)       .storeInt(parsedAddress.workchain, 8)       .storeUint(parsedAddress.address, 256);   }    return contractAddress(     StateInit {       code: DEDUST_BLANK_CODE,       data: data.endCell()     }   ); }  // Create proof to confirm the DeDust vault address fun createVaultProofAddress(   factoryAddress: Address,   jettonAddress: Address? ): Address {   return createProofAddress(     factoryAddress,     DEDUST_CONTRACT_TYPE_VAULT,     jettonAddress   ); }  // Verification of DeDust vault address fun verifyVaultAddress(   vaultAddress: Address,   factoryAddress: Address,   jettonAddress: Address? ) {   require(     vaultAddress == createVaultProofAddress(factoryAddress, jettonAddress),     "Invalid DeDust vault address"   ); } code taken from DeDust sdk (reply to 148612)

Andrei: Hey! Quick question. Can somebody please tell what are the common reasons for transaction being marked as suspicious on tonviewer?

Denis: Usually long text with some keywords and low amount attached to message (reply to 148614)

Denis: Yes (reply to 148613)

Alexander: This means that there are 2 solutions for absolute security of swaps: 1. Refuse STON fi and use only DeDust 2. Create a multisig contract that stores all STON fi router addresses and manually update them when new routers appear Right? Do you think that no one has yet implemented the second point in the same way? (reply to 148617)

Lasha: Hi, I’d like to install Func on Ubuntu. Could you please share an article or guide on how to do that?

Andy: Hi! Is there any way to accept_message an internal message with a value of one nanoton, to pay for everything from contract's balance?

&rey: No. TVM is already not launched for it. (reply to 148642)

Master: Who can help me with my project? I need to create a Lenling website and a Telegram bot on a volunteer basis. Please become my partner in developing my project.

Combot: Combot has warned Daivd Eason (1/3) Reason: Word ***** is not allowed (reply to 148644)

Daivd: open source? (reply to 148644)

BizX: Hey, what kind of project are you developing? (reply to 148644)

Slava: Anyway, you need to pay forward fees to send the message in the first place, why not pay minimal gas fees as well? (reply to 148642)

Andy: That's true. The case I'm considering is doing something on-chain once a simple jetton transfer from a wallet is received (which at least in mytonwallet generates a transfer notification with 1 nanoton) (reply to 148652)

Slava: It can be zero with the same effect. Just increase the value. (reply to 148656)

— 2025-05-17 —

Nasri: Hi guys, can i check if there is a developer program on TON?

Mojisola🍅 🍅: what do you mean? (reply to 148667)

+888: #Is logical time of each message within a transaction unique ?  A transaction can consist of several messages within a smart‑contract. But if 2 messages are executed exactly at the same moment, for example by being started at the exact same moment within 2 different transactions, can this result in logical time not being unique ?  Or more generally, is there any way to make logical time not unique ?

Mojisola🍅 🍅: no sure 2 similar transaction can have same logical time.  and why will this matter though.

&rey: Logical time is not unique. Logical time + contract's address is. (reply to 148680)

+888: So it’s impossible to make logical time not unique for the same smart‑contract despite it’s possible to have the code of smart contract being run line by line at the same time ? (reply to 148682)

&rey: Always unique. And FYI smart contract executions are sequentially consistent (and I don't think a validator ever runs same contract in parallel threads). (reply to 148683)

