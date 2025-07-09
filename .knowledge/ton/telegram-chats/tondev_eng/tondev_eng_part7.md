Gleb: Our team just became bigger  🇯🇵 🇩🇪 🇺🇦🇵🇱🇷🇺🇧🇾🇳🇬🇦🇪🇹🇭  We are excited to announce the expansion of our team, now encompassing talents from Japan, Germany, Ukraine, Poland, Russia, Belarus, Nigeria, the United Arab Emirates, and Thailand. If you are a developer interested in joining our diverse team to create Telegram Mini Apps, please reach out to me directly at @glebfinup.  Github : Challenge-day

TON Bounty Bridge: ​Educational content - News Platform / Turkish  🏷 Education  Summary:Turkey holds a significant position in the world of cryptocurrency markets, emerging as one of the t...  Created by japethh

User<7339990981>: can we discuss? (reply to 69176)

Mitchell: are you the best? (reply to 69284)

&rey: This is not the appropriate chat, please use @tonhunt. (reply to 69284)

User<7339990981>: well? 🤔 (reply to 69285)

Crypto: Hi, Nice to meet you. How to install FunC and fift on my local? And this installing is necessary for develop and deploy the smart contract? Pls let me know.

User<7339990981>: follow the instructions. (reply to 69289)

Crypto: How?? (reply to 69290)

&rey: This is but one of the ways to set up development environment. Instructions are on https://docs.ton.org. (reply to 69289)

Crypto: Thank you,  But I have one question. If I wanna develop the FunC smart contract, do I have to install FunC on my local? (reply to 69294)

&rey: You don't have; you can use blueprint instead, which has FunC compiler executable in WebAssembly form inside. (reply to 69295)

Crypto: But if I have to use fift, then how?

&rey: Fift or TVM assembly? The difference is important here. (reply to 69297)

Crypto: for write and deploying the contract.

Crypto: Pls let  me know.

.: Hi there, i tried implementing /toncenter/ton-wallet by myself import { generateMnemonic, mnemonicToKeyPair } from 'tonweb-mnemonic'; import TonWeb from "tonweb"; async function wordsToPrivateKey(words: any) {     const keyPair = await mnemonicToKeyPair(words);     return TonWeb.utils.bytesToBase64(keyPair.secretKey.slice(0, 32)); } async function showCreated() {     const ton = new TonWeb();     const myMnemonicWords = await generateMnemonic();     const privateKey = await wordsToPrivateKey(myMnemonicWords);     const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(TonWeb.utils.base64ToBytes(privateKey));     const walletVersion = 'v3R2';     const WalletClass = ton.wallet.all[walletVersion];     const walletContract = new WalletClass(ton.provider, {         publicKey: keyPair.publicKey,         wc: 0     });     console.log(walletContract)     return (await walletContract.getAddress()) }   OUTPUT: WalletV3ContractR2 {   provider: HttpProvider {     host: 'https://toncenter.com/api/v2/jsonRPC',     options: {}   },   options: {     publicKey: Uint8Array(32) [       147, 148,  39,  56, 214,  90,  26, 166,       169, 152, 138,  65, 247, 125, 216, 113,       173, 189, 115, 107, 190,  98, 212, 167,       227, 156, 118, 224,  84,  43,  55,   6     ],     wc: 0,     code: Cell { bits: [BitString], refs: [], isExotic: 0 },     walletId: 698983191   },   address: null,   methods: {     transfer: [Function: transfer],     transfers: [Function: transfers],     seqno: [Function: seqno]   },   deploy: [Function (anonymous)] }  ⨯ node_modules/tonweb/src/utils/Utils.js (23:31) @ digest  ⨯ TypeError: Cannot read properties of undefined (reading 'digest')     at async showCreated (./app/page.tsx:33:12)     at async Home (./app/page.tsx:36:16) null  ⨯ node_modules/tonweb/src/utils/Utils.js (23:31) @ digest  ⨯ TypeError: Cannot read properties of undefined (reading 'digest')     at async showCreated (./app/page.tsx:33:12)     at async Home (./app/page.tsx:36:16) digest: "3404389260" null

TON Bounty Bridge: ​htyu  🏷 Resource  Summary:vhnu  Created by nitrl

Zeus: blessings to all... if I would like to send information about how to get started in programming or blockchain development and specifically in the TON network to a person with basic notions... what links should I send them?  Can somebody help me??  Thanks in advance...

— 2024-06-11 —

TON Bounty Bridge: ​6219861961488110  🏷 Developer Tool  Summary:yoones65857@gmail.com  Created by 6037701556160635

uzbc0der: How can I verify my coin on tonkeeper?

uzbc0der: ? (reply to 69370)

feng: Is there any tool that can query the BOC string of a transaction? For example, Ton explorer

Matthew: hello guys, I'm building my own fullnode and got some latency problem. Does anyone have experience on build a fast and secured one?   1. best cloud provider location 2. best machine type 3. etc vv

User<6230231504>: DM (reply to 69395)

User<5148608697>: re

Fyz: Hi, can you give me some testnet TON for this address: EQDh4t2-B-5GcaC63ZdU_zsiOZWSdjvFJxbKFp6HNly-HFIz

Bobby: hi, Fees for sending Jettons reduced from 0.037 to 0.006?

MRT: hi, why jettonMinter always return address with workchain id 0 ?  for transfer when i want send to wallet address i got error 333 ( wrong work chain) but i try  send to jettonAddress with getWalletAddress method but in this case explorer show me the account is owner! https://testnet.tonscan.org/jetton/EQA5TZ1CalPHnll8ZDo_A00GRJRIXBGZcMUESsOo7gG0h_Ay

Ali: Hi, dear friends. Can anybody tell me what’s the most suitable IDE for coding in Tact?

Matthew: how many do you need? (reply to 69408)

MRT: oh, we should change workchain param when comple contract 😄 (reply to 69410)

Fyz: 10 TON or more, I need it for my BUIDL project (reply to 69413)

mohsen: How can I get token data using pytoniq library?

Matthew: dm me your wallet address (reply to 69419)

K.: @testgiver_ton_bot gives out 5 testnet TON / hour (reply to 69408)

K.: VSCode with Tact extension or IntelliJ IDEA with TON plugin. (reply to 69412)

K.: https://github.com/tonkeeper/ton-assets (reply to 69370)

Anton: in addition to the already mentioned VS Code and Intellij IDEA plugins, there are Vim/Neovim and Sublime Text Tact plugins (reply to 69412)

K.: Here you go: https://docs.ton.org/develop/overview. A one-page entry point to everything you will need. (reply to 69342)

JVI: anybody knows, if ledger nano can interact with smart contracts in TON ? i had some errors

uzbc0der: I found solve (reply to 69425)

uzbc0der: How i enter tonkeeper wallet with code for example python

Anastasiia: Hi! I am wringing a func smart contract and need to ensure that the msg_value minus gas fees spend for the execution of the current contract will be sufficient to cover gas costs for the outbound message that my contract sends to the other contract. Are there any example of how to calculate it dynamically? Probably, using these opcodes: https://docs.ton.org/learn/tvm-instructions/fee-calculation-instructions#opcodes-to-process-config-parameters

Behrang: https://github.com/HipoFinance/contract/blob/ce0cff85a25964d71094c88d89989b8918a4fb3b/contracts/imports/utils.fc#L655 (reply to 69441)

Nerkrkririei I Think I Need A It's A: failed to send message: lite server error, code 0: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction E4CA80FF6500B55E97E788DBEF5E134466D9949545B7E4C84700F22A8168EC17: exitcode=33, steps=23, gas_used=0 VM Log (truncated): ...te NOW execute LEQ execute THROWIF 36 execute PUSH c4 execute CTOS execute LDU 32 execute LDU 32 execute LDU 256 execute LDDICT execute ENDS execute XCPU s4,s3 execute EQUAL execute THROWIFNOT 33 default exception handler, terminating vm with exit code 33  How can I fix this? I am sending jettons and this happens only with some of them

mohsen: I am using pytoniq library transfer function and it returns "1" in any case. Why?

Mohammadreza: Duplicated transfer (reply to 69447)

TON Bounty Bridge: ​Имя  🏷 Developer Tool  Summary:Рождения  Created by SHAXRUX1991

Aibar: did ton get faster after yesterdays update?

Harry: guys, why contract failled? i try to mint nft. Am i doing right?

K.: "nftCollections" or "nftCollectionsOwner" are not valid TON addresses. You need to change those to actual addresses. (reply to 69462)

Harry: Thanks for your support. I knew it, i just dont want to public my collection address 🥲 (reply to 69463)

K.: Are you trying to send the transaction to testnet? I am not sure if using the "network" property is correct. TonClient should be using a testnet endpoint for it to actually send to testnet. (reply to 69464)

Harry: yeah, it's call to testnet tonkeeper... but the contract failed before i confirm (reply to 69465)

Behrang: Masterchain blocks are now generated faster, which has a positive effect on everything. (reply to 69456)

K.: You mean in the simulation? Then you do have something wrong in the transaction. Check that your addresses are for sure correct, also see if you are sending enough "value" for the transaction to go through. (reply to 69466)

Nerses: I have two versions of parsing the data one is this javascript let builder = new Builder();             builder.storeStringTail(data);             const slice = builder.asSlice();             console.log(functionMap[result[0]](slice));    and in second one i create buffer from data and then use storeBuffer. In buffer case it pareses correctly in case size of data isnt huge but stringTail case it parse incorrectly. So what can cause this ,any hints or 'predictions' ?

Trassos: https://www.youtube.com/@yougodanang/videos this guy has the course! thank you youganang parama (reply to 66688)

ztwq: Dear, I have fee questions between contract and contract call.1.Is the get call free? 2.Is the write call to another contract free?

ztwq: pls help check it (reply to 69463)

&rey: Any interactions between contracts are done with TON-carrying messages and incur corresponding fees. There is no concept of synchronous calls. (reply to 69477)

mohsen: I am using pytoniq library transfer function and it returns "1" in any case. Why?\

gavin: Guys, I want to ask if this multi-signature is official? Is there any more usage documentation? https://multisig.ton.org/

uzbc0der: How i enter tonkeeper wallet with code for example python

Crypto Notte: Good evening gents, may I request around 50-100 testnet TON for some testing? The bot is currently giving only 2 TON and I need some larger amounts for some edge cases. Appreciated 👍🏻  kQAMIp2pmd5TiVsmH4B8FyTY5kuq43EGM1I8dGchMC5JT17I

Fyz: Did payload size while send a TON can increased the fee?

Ash: Hi Guys,  I'm creating a fungible token on Ton using Tact.  Is there any documentation or code example that I can refer to?   Thank you in advance

&rey: Main standard: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md. Implementation with some errors, I don't remember where: https://github.com/ton-core/tact/blob/main/stdlib/libs/jetton.tact. (reply to 69500)

Sunil | Aerius Labs: Is this the correct way to watch transaction events, I have added code that in my counter.fc file as well (reply to 69134)

&rey: counterValue is obtained incorrectly, also you're not checking if message is log or outgoing message to another contract.

Rishabh: Hello erveryone  can you explain me how to show price ton to usdt acc to market

Sunil | Aerius Labs: Thanks, Is this the correct way to emit event (reply to 69506)

&rey: No, it is not. Please consult block.tlb for ext-out flag and additional fields which must be set. (reply to 69510)

Sunil | Aerius Labs: Can you give a example or resource to read about that ? (reply to 69511)

Nerses: i have done transaction and id succeded but for unknow reason the TON bounced back.What can cause that ?   https://testnet.tonscan.org/address/EQCA5WdfZ_il-bFktDYao5h4zf7sw_64KZRx1Yc2eJrRC9Yj

&rey: Contract execution failed because contract was uninit, so message bounced. (reply to 69514)

Nerses: thanks (reply to 69516)

soleil: Hello friends. A perhaps simple question from a beginner. How to get the transaction history of an address? For example, the history of the last 5 days.  Actually, I want to search inside the transactions of a Toncoin blockchain address, what is the best and easiest way?  In normal mode, we go to tonviewer and we search and find it. What should we do when there are so many transactions that we cannot find them manually and for example we are looking for a specific amount or a specific comment? There is no ready code for this?

&rey: Use dton.io/graphql. (reply to 69518)

soleil: Is it possible to explain more? I did not understand how to use it for my purpose. (reply to 69519)

&rey: An example: https://dton.io/graphql#query=query%20%7Btransactions(%0A%20%20address_friendly%3A%20%22UQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrX0-%22%2C%0A%20%20in_msg_comment%3A%20%22Job%20destroyed.%22%0A)%20%7B%0A%20%20lt%20%20hash%20%20gen_utime%20%20in_msg_value_grams%20%20out_msg_count%0A%7D%7D&operationName=QueryInComment. (reply to 69520)

soleil: thanks. I changed the code as follows:  query {transactions(   address_friendly: "UQBdWoMOSCFHkfSrU1KQDGJNO_88Xv1jAZaxgBWOt4mZDwmZ",   in_msg_comment: "1043241212" ) {   lt  hash  gen_utime  in_msg_value_grams  out_msg_count }}  But it did not give any results. While I know there are several transactions with the comment I want. Like the following transaction: https://tonviewer.com/transaction/8a0bc6e135eb77b79e5fcc9e215130b90c1c698518e4a2e6dce42676e46f0df0 (reply to 69521)

&rey: It doesn't support getting jetton transfers by comment. (reply to 69522)

uzbc0der: How i use this git link can you write dm (reply to 69425)

soleil: thanks. Is there no other way for jettons? (reply to 69523)

M: Hey, I am doing a website with TON Connect. I have already implemented it. Can someone suggest how do I verify on my back-end that the transaction was succesful?  Is there a way in TON connect to get status of transcation?

Lsynd: Hey guys! Just deployed archive node from scratch, and somehow it doesn't contain any info on existing txs or anything  Previously, I've downloaded archive backup, something like 3.7T, mounted its contents as /var/ton-work After that, I've waited for sync to be done, it was something like week to sync, now de-sync is something like 9 seconds But, any request i do now to liteserver on this node - is always returning 500 "error": "not found tx 5d18818300cc1afa7c1210b015d8173a88f041671f89d0f4083db9911af444e5" What could have gone go wrong here?  Also in mytonctrl logs there are some lines like this: GetValidatorIndex warning: index not found GetValidatorEfficiency warning: efficiency not found Node has no adnl address required for custom overlay default_elid1718112008 Any idea what i can be doing wrong?

User<6981260071>: how do I send a transaction with a message. I get unable to load fees in wallet when i add payload to the messages array

K.: https://docs.ton.org/develop/dapps/ton-connect/message-builders#transfer-with-a-comment (reply to 69530)

&rey: TON Connect is write-only. (reply to 69528)

Witter: Does ton connect support sign message?

Kiba: Not yet, because the standard is not finalized (reply to 69536)

Witter: Thanks for your kind reply,  and I was wondering if there is a planned time for this

Nerses: i have such code             // version 1             let builder = new Builder();             builder.storeStringTail(data);             const slice = builder.asSlice();             console.log(functionMap[result[0]](slice));              // version 2             let builder2 = new Builder();             let buffer = Buffer.from(data,'hex');             builder2.storeBuffer(buffer);             const slice2 = builder2.asSlice();             console.log(functionMap[result[0]](slice2)); version2 works but version1 doesnt work.What can cause that ?

User<6981260071>: syntax error on image. Why ?

Fyz: Use coingecko API (reply to 69508)

Aibar: Why tonviewer is putting suspicious transaction on event?

&rey: What programming language is that? (reply to 69544)

&rey: Because they are not equivalent. Version 1 stores your hex string directly, version 2 parses it to bytes and stores those. (reply to 69541)

Nerses: in second version i get overflow in case of big data.Would you give some hint how can i parse to bytes and store in bitBuilder without overflow ? (reply to 69556)

&rey: What contract is ready to accept a long byte array? (reply to 69557)

Nerses: my goal is to parse data and parsing function accepts slice type argument while I get data in string.So these methods just approach to reach parsing (reply to 69558)

Panda: Hi,if a contract could hold a jetton token?

&rey: The most known example is wallet contract owning jettons, but actually any contract can. (reply to 69561)

Panda: Thanks

Lovely: Hello, everyone

Panda: Another question is how to transfer token with a contract that hold the jetton token? (reply to 69563)

&rey: The contract must send jetton transfer message to its own jetton wallet. (reply to 69573)

Lovely: I have a trouble getting token from connected wallet in my dapp. Anyone help?

&rey: 1. Obtain jetton wallet address by token master and user address. 2. Call get-method on said jetton wallet. (reply to 69575)

Panda: We should imp transfer method in contract? (reply to 69574)

Panda: and call it through wallet

&rey: Wdym "transfer" "method"? Form and send message on whatever code path you need this on. If you need to transfer jettons upon request from admin, do so; otherwise, call that under another conditions... (reply to 69577)

Panda: Ok

Nerses: let sc_0 = slice;     if (sc_0.loadUint(32) !== 585546945) { throw Error('Invalid prefix'); }     let _data = loadTonTransferClaimed(sc_0);     return { $$type: 'Redeem' as const, data: _data }; }    these are functions generated by compiler and I try to use them to parse export function loadTonTransferClaimed(slice: Slice) {     let sc_0 = slice;     let ___hashlock = sc_0.loadIntBig(257);     let ___secret = sc_0.loadIntBig(257);     let ___amount = sc_0.loadIntBig(257);     return { $$type: 'TonTransferClaimed' as const, __hashlock: ___hashlock, __secret: ___secret, __amount: ___amount }; } could you please give any hint how I can convert from big data string to argument that can be passed to this function ? (reply to 69558)

&rey: How do you obtain big data string? Does it start with "te6cck" by any chance? (reply to 69583)

Nerses: No.It is just too long that cant be stored in bitBuilder. smth like this b5ee9c720101070100a10002096a0867afe001020203d00803040203d008050600410a9b98fd9d43a15c7729519ad641ccddbcf532337839e47cb8d230143f6b068c50004108fe26fb6c388fa76dc0202fcfc36cae092da74ad7d44548459d14f6be4a6a90b0004100000000000000000000000000000000000000000000000000000019d1d1ef6f70004100000000000000000000000000000000000000000000000000000015ad4e4ffff0 (reply to 69585)

&rey: It is BOC in base16. Cell.oneFromBoc( something_decoding_base16('b5ee...') ).beginParse() (reply to 69586)

Nerses: using this I can store the data in Cell ? (reply to 69587)

Vova: Hi, can i get more than 5 test ton, we are testing max balance to buy on our presale?

Ranel: Check vanity contract by ton-community on GitHub (reply to 67833)

Daniel: You can get Toncoins in testnet from this bot every hour: @testgiver_ton_bot (reply to 69593)

mohsen: how I can generate wallet address(E... address) in local? without API call (reply to 69587)

&rey: Hmm... that is easy. In fact, I cannot imagine a way that would require API call. (reply to 69602)

mohsen: mnemonics = mnemonic_new() client = LiteBalancer.from_mainnet_config(trust_level=1)  await client.start_up()  wallet = WalletV4R2.from_mnemonic(client, mnemonics, 0) address = wallet.address (reply to 69605)

mohsen: I am looking for a way to replace this without API call (reply to 69605)

&rey: In fact, this does a call, but only to read contract state... Well, let's rewrite it: (reply to 69606)

Mikey: How to have suffix on contracts addresses?  EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS  like this example

Emil: Hi everyone, I am currently working with TON and I need to make transactions idempotent. This means that if I send the transaction multiple times, it should only be applied once. I am aware that on the EVM chain, this can be achieved by specifying a nonce. Could anybody please advise on the alternative method to achieve idempotency on the TON blockchain?

&rey: mnemonics = mnemonic_new() public_key, private_key = mnemonic_to_private_key(mnemonics) code = WALLET_V4_R2_CODE data = WalletV4Data(seqno=0, wallet_id=698983191, public_key=public_key).serialize() state_init = StateInit(code=code, data=data).serialize() address = Address((0, state_init.hash)) (reply to 69606)

&rey: You can mine appropriate init cell (data, mainly) so that its hash, encoded appropriately, creates the suffix. (reply to 69609)

mohsen: oh It was a little difficult (reply to 69612)

Mikey: Can you give example (reply to 69612)

&rey: I assume you mean transactions on the wallet? Specify seqno (feature of wallet contracts); message with invalid seqno will not be sent, thus one message won't get sent twice. (reply to 69610)

&rey: https://github.com/ton-community/vanity-contract (reply to 69614)

mohsen: Are you sure It's works? (reply to 69612)

&rey: Modulo possible typos, it should. (reply to 69617)

Emil: Do you have any examples or maybe know where I can find one?  I looked on the tonscan and I dont see any seq number there (reply to 69615)

mohsen: seqno=0, wallet_id=698983191 What is the reason for these numbers? (reply to 69618)

mohsen: This piece of code you gave helped me. thank you. Is wallet_id an arbitrary expression? (reply to 69611)

&rey: Wallet applications define it. If you don't desire your wallet to be importable normally, you may use arbitrary 32-bit number. In particular, wallet_id must be different between testnet and mainnet, however no app ensures that. (reply to 69628)

&rey: How are you sending transaction? (reply to 69622)

Colin: Hey guys, I'm looking run an Archive node. What sort of Data egress does it have?

PavelN: Hi guys! Just updated my nodes to the new version and have connection refused while querying my liteserver. Should I wait for sync? Just looks like my node is already synced: Last masterchain block 6381ms Last known key block 2347s Shard client 6381s

Masih Joneid: Circulating supply changed ?!

Smart: hello, can you help please, i am stuck how to send message type:       $$type: 'Transfer',       new_owner: newAddress,       queryId: 0n,     }     //const payloadString = String(internalMessageBody);     const payload = beginCell();     payload.storeStringTail(internalMessageBody.new_owner).storeUint(internalMessageBody.queryId,32);       let result = await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [       internal({         to: contractAddress,         value: "0.03",         body: payload.endCell(),          bounce: true,                },)     ],     sendMode: 1 + 2   });  it is ok when message as comment, but i dunno howabout $$type

Masih Joneid: where can i see and monitor shards of ton

Phạm Thanh Phước Lộc: How to fix error "getContractState" is not a function when I use minterController. Any solution ? Please help me

uzbc0der: how can i verify my token on tonkeeper

uzbc0der: i created json file and i wwrote my coin's details there

Emil: I am using this lib https://github.com/xssnick/tonutils-go  I think I figured out how to do that

Behrang: https://t.me/tonblockchain/241 (reply to 69638)

uzbc0der: ? (reply to 69648)

a14: Hello, anyone struggling implementing this ts project in js?  https:// github. com/ ton-blockchain/minter-contract  Its a script for deploying jettons.  I really struggle to refactor it to js with newest @ton/ton and @ton/core package.  With older ton v11.x version i come further..

Masih Joneid: why changed (reply to 69658)

Masih Joneid: how we can trust this report changed again this much alot

Hossein: Hello, i want check the last jetton(for example usdt or notcoin) transaction with curl.

Maxey: Has anyone tried the High Load Wallet V3? I have successfully deployed the wallet, but when I try to send a simple TON transfer, I keep getting AxiosError: Request failed with status code 500 or AxiosError: timeout of 5000ms exceeded.

Hossein: ?? (reply to 69672)

User<5435924052>: here's experienced skilled ton developer with extensive experiences of FunC/Tact . if you are in need of developer , reach me out . thanks

🅰🅻🅰🅽: We have found a wierd bug in FunC, and submit a issue to github  https://github.com/ton-blockchain/ton/issues/1022  ///////////  When we call the is_claimed function with the index parameter set to 0, the claim_bit_index is calculated as 0 % 256, which results in claim_bit_index = 0. Consequently, int mask = 1 << 0, meaning mask = 1.  As we start using the mask variable for some comparisons, we notice an interesting situation. The mask currently equals 1, but when we compare it with mask == 1, the result dumped is 0, which is not what we expected. It should be -1, because mask = 1 and 1 == 1. Then, when we compare mask != 1, the dumped result turns out to be -1, which is also contrary to common logic.

^_^: Hi eveyone, How are you doing today? This is a TON blockchain developer. I can develop the telegram bot, mini app and smart contract. If you are looking for a developer, can we work together? 🤝

MEW: dm (reply to 69529)

Kryptonite: is there any example on how to update or save data ?

Kryptonite: to give context of my problem i have some parameters that i load using load_data() while deploying my SC

Kryptonite: but i wan to keep track of total ton i received through internal call deposit so i want to update data using save_data()   but somehow it is not working for me

Kryptonite: can anyone help me to understand whats wrong 🧐

Hossein: please answer (reply to 69676)

Pouya: Hi  Maybe TonApi help you (reply to 69700)

Hossein: Im using toncenter (reply to 69702)

Pouya: Does it solve your problem? (reply to 69703)

MEW: tonapi is better, lol

Marsown: Hey im a blockchain dev have worked with all evm for past 5 years but this this my start with ton what you guys doing is amazing but late to join but here we go im ready to collab or start exploring things with open network

Binaplexus1: Hi guys

Binaplexus1: I have created game in construct 3 how can I connect plugin with my ton project To rewards players

Hossein: I don't know how can i receive jetton transaction for an address,i want create gateway to receive jettons with curl (reply to 69704)

Pouya: Did you read the documents or toncenter or tonapi!? (reply to 69713)

Hossein: Yes , i was recieve the transactions ,but i dont know how to handle the amount and other params for my code (reply to 69715)

Pouya: Any code that you can share? (reply to 69716)

Mohammadreza: Use js sdk examples (reply to 69716)

Mohammadreza: And implement it

&rey: save_data should have modificator impure and contain set_data(begin_cell()....end_cell()); (reply to 69698)

Hossein: this is my code and i want process the payment (get amount,check if is not message and etc.) (reply to 69717)

Hossein: im using curl with php (reply to 69719)

Mohammadreza: Toncenter or tonapi (reply to 69726)

Hossein: Toncenter (reply to 69728)

Smart: how to transfer $$type message to smart contract using ton/ton?

&rey: Copy function that serializes cell from autogenerated wrappers. (reply to 69645)

Mohammadreza: I mean use one of them (reply to 69729)

Hossein: I know,i was get data but i don't know how can i check the transactio(amonut and another details) (reply to 69734)

TON Bounty Bridge: ​@airdropnesiann  🏷 Education  Summary:Even though it has quite promising advantages or potential, Toncoin (TON) still has several challeng...  Created by Aldykenz

Rasmun: For when a good decentralized sports bookmaker on TON? One that it is better than the other chains..

Inayat: Hi there! I am using @tonconnect/ui  I am trying to getConnected WalletAddress, using  tonconnect.wallet);  The walletAddress I am connected to is different from here. publicKey is also not look like my address,  Can anyone please Help me getting the exact walletAddress I am connected to. I am not able to retrieve it.

Tim: Ton.org/address (reply to 69753)

Inayat: for? (reply to 69756)

Tim: Paste address there and you will see (reply to 69757)

Inayat: Is there Any way I can get the Mainnet BounceableAddress, Programmatically.  And Can you explain what is difference between Counceable and non bounceable? (reply to 69758)

Tim: I can’t, but docs.ton.org can (reply to 69759)

Inayat: I could not find out how to retrieve the MainnetAddress from HEX anywhere. Can you help me with this at least. (reply to 69760)

Tim: https://docs.ton.org/develop/dapps/cookbook#working-with-contracts-addresses (reply to 69762)

Inayat: Great! Thanks (reply to 69764)

— 2024-06-12 —

Triệu Hồng: Hello, let me ask how to call ton contracts in the front end in the simplest way, everyone

Triệu Hồng: And which library do you usually use to connect?

Harry: everyone, how to check platform with TON? i saw one, but now i can't find it in which library

Illia: This is a JavaScript library for TON (https://github.com/ton-core/ton)  However, you're probably looking for TON Connect (https://docs.ton.org/develop/dapps/ton-connect/overview)  This is a nice guide on how to integrate TON Connect with React, but there are also guides for vanilla JS and telegram bots. (reply to 69782)

Illia: Can you clarify what you mean by 'to check platform with TON'? (reply to 69788)

Triệu Hồng: I want to make a web3, how can I call contracts from the blockchain in the frontend :< (reply to 69791)

Triệu Hồng: I'm a beginner and actually a bit vague about ton's documentation

Harry: i saw one of my ton library can do something like library.platform.window/library.platform.android/...  but now i dont remember which ones can do that.. i try to detect which platform user using (reply to 69793)

Illia: I started my web3 journey on NEAR Protocol, and, to be honest, it wasn't easy. Therefore, I completely understand you.  This is how to send a transaction: https://docs.ton.org/develop/dapps/ton-connect/react#sending-transactions  However, this shows how to send just Toncoins. If you want to go beyond that and interact with smart contracts, then you need to get someone to provide you with wrappers for these contracts or you have to write wrappers yourself.  To write wrappers yourself, you need to know how the blockchain works so reading docs is a must-have. You have to open the docs read though and do your best to understand. If you don't understand, then ask a question here.  This is a hard way, but the only way.  You may try learning Solidity to see how Ethereum works. I improved my knowledge by learning Solidity after contracts written in Rust for NEAR Protocol. (reply to 69795)

Triệu Hồng: thank you very much sir (reply to 69799)

uzbc0der: Hoe can i verify my tokens on tonkeeper help me

Illia: Have you tried User Agent?  https://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript  This will allow you to get complete information about the platform the user is using. (reply to 69798)

uzbc0der: ? (reply to 69802)

Illia: what do you mean by verify? (reply to 69802)

uzbc0der: Nee tokens has got unverified token word in tonkeeper (reply to 69805)

uzbc0der: Like this

Baldwin: I am a front end developer, how do I know if a transaction was successful or failed sir?

uzbc0der: Can you help me (reply to 69805)

Illia: This is an official script by Tonkeeper for verifying tokens  https://github.com/tonkeeper/scam_backoffice_rules  This is a JSON file of verifiied tokens https://raw.githubusercontent.com/tonkeeper/ton-assets/main/jettons.json  But it's better to use the script cause it also checks if tokens look similar to valid ones  https://github.com/tonkeeper/scam_backoffice_rules/blob/main/jetton_verifier.go#L128

uzbc0der: How can i use repositories (reply to 69810)

Kryptonite: my save_data() does have begin_cell()….end()); still values are not updated. (reply to 69722)

uzbc0der: Can i write your dm (reply to 69810)

Illia: you can, but it's better to chat there so if other people have similar issue, they can find a solution there (reply to 69813)

uzbc0der: Ok (reply to 69814)

Illia: If you don't know how to use GitHub, then this course is good. https://skills.github.com/ You can also download the repo as zip if you go Code -> Download ZIP. There's no guide on how to run go scripts so you'll have to figure it out yourself (reply to 69811)

cindy: Hi,I have deployed the demo Counter contract to the mainnet. however, it occurs TypeError: fetch failed when i deployed the contract again. what is the reason?anyone can help?

User<7123272744>: What errors are you facing? (reply to 69820)

Kryptonite: you will have to create a lp pool either on ston fi or dedust and raise a verification request (reply to 69807)

cindy: I just tried again to deploy it, it shows error: Awaiting contract deployment... [Attempt 2/10]AxiosError: timeout of 5000ms exceeded. (reply to 69825)

cindy: The proxy is needed in my location.

Kryptonite: tonkeeper, systems keeps a sync on these exchanges verified tokens, once it is verified either by dedust or stonfi your token will be shown as verified token (reply to 69813)

Triệu Hồng: Please tell me how to get the url and iconUrl??? I have read the documentation and description of the fields but still don't understand what it is and how to get it

MRT: https://pub.dev/packages/ton_dart

MRT: hi, guys its possible to run your own Ton blockchain? like substrate, eth and cosmos sdk ?

MRT: I want to run my own blockchain, I work with many networks and I am interested in Ton more than Substrate, can anyone help me with this?

Harry: guys, how i can call send function with TON to call MintTo.. i tried but it dont call any wallet

cindy: TACT? (reply to 69837)

Harry: sr, wdym? (reply to 69839)

cindy: Is your contract wrote in TACT or Func?

Harry: Func (reply to 69842)

&rey: MyLocalTon allows that, yes. (reply to 69834)

&rey: URL is what opens if you click on already-connected app from wallet; presumably main page. iconUrl points to image how your app is displayed in wallet. (reply to 69832)

Tele: hello

Tele: can I ask a question concern with my ton wallet?

Tele: what will happen when you repeat the transition in "Myton wallet" to fund to the telegram ads?

uzbc0der: Namely i will create liquid pool, and my token verify automatically (reply to 69826)

Kryptonite: yeah and apply for token verification on dedust

Kryptonite: on their google form you will see the requirements to get verified

Kryptonite: like how much TVL you should have in your LP  to get verified by dedust etc etc

Kryptonite: once they verify you , tonkeeper systems automatically sync the data and verify your token

Masih Joneid: ? (reply to 69667)

TON Bounty Bridge: ​Anton0096  🏷 Developer Tool  Summary:Antuan de sent aasadsf  Created by Anvar0096

Mahima Thacker: Hey guys, how to add buy/sell functionality in the tact nft collection contract? Is there any example out there on this?

Triệu Hồng: Can you guys give me an example code on how to call a smart contract from the blockchain and use it on the front end?

Triệu Hồng: I can't find it in ton's source code example :<

User<7123272744>: https://tonhelloworld.com/01-wallet/ (reply to 69875)

Triệu Hồng: thank you sir (reply to 69877)

User<7224218320>: 👍🏻

Nikita: Hello! Want to know is it possible to determine address where contract will be deployed  and then send transaction by arbitrary user to initialize such  contract?  If yes, how can I do it?  I found that I can determine address by calculate hash of: workchain, constructor arguments, source code  But don't understand how to deploy such contract on chain

Haris: Hi, I am receiving following error in compiling smart contract in tact language does anybody know how to resolve it.  Tact compilation failed Error: Duplicate error id: Access denied     at (workspace/NFT/node_modules/@tact-lang/compiler/dist/types/resolveErrors.js:30:27     at traverse (workspace/NFT/node_modules/@tact-lang/compiler/dist/grammar/ast.js:74:5)     at traverse (workspace/NFT/node_modules/@tact-lang/compiler/dist/grammar/ast.js:152:9)     at traverse (workspace/NFT/node_modules/@tact-lang/compiler/dist/grammar/ast.js:121:13)     at resolveStringsInAST (workspace/NFT/node_modules/@tact-lang/compiler/dist/types/resolveErrors.js:17:24)     at resolveErrors (workspace/NFT/node_modules/@tact-lang/compiler/dist/types/resolveErrors.js:63:19)     at precompile (workspace/NFT/node_modules/@tact-lang/compiler/dist/pipeline/precompile.js:26:45)     at build (workspace/NFT/node_modules/@tact-lang/compiler/dist/pipeline/build.js:55:43)     at doCompileTact (workspace/NFT/node_modules/@ton-community/blueprint/dist/compile/compile.js:70:44)     at doCompileInner (workspace/NFT/node_modules/@ton-community/blueprint/dist/compile/compile.js:92:22) Error: Could not compile tact  Thanks,

Haris: anybody? (reply to 69894)

Wayne: The error you're encountering indicates a "Duplicate error id: Access denied" during the Tact compilation process. Here are some steps to help you troubleshoot and resolve the issue:  1. Check for Duplicate Error IDs: The error message suggests there is a duplicate error ID in your code. Go through your Tact code and ensure that each error is uniquely identified. Duplicate IDs can cause conflicts during compilation.  2. Review Error Handling: Verify your error handling code. Ensure that each error message and ID is distinct and correctly implemented.  3. Update Dependencies: Sometimes, errors can be caused by outdated dependencies. Ensure all your npm packages are up to date by running:      npm update     4. Clean and Rebuild: Clean your project to remove any cached or residual files that might be causing issues:      npm run clean    npm run build     5. Check Compiler Configuration: Ensure that your Tact compiler configuration is correct and there are no conflicting settings.  6. Consult Documentation and Community: Refer to the Tact language documentation for any known issues or updates related to error handling. Additionally, reaching out to the Tact community (e.g., forums, GitHub issues) might provide more specific guidance and solutions.  If these steps do not resolve the issue, please provide a snippet of your Tact code, specifically the parts where errors are defined and handled, so I can give more targeted advice. (reply to 69898)

Wayne: Response from GPT ) (reply to 69899)

Haris: yeah i have already checked it with gpt but it did not help

Dmytro: It's better to use FunC rather than Tact. FunC is an older language with no compiler issues. (reply to 69894)

Masih Joneid: it is not logical binance send all project team to ask them for list 😂

Haris: Yeah but there must be a resolution to it (reply to 69906)

Phạm Thanh Phước Lộc: anyone have this error ? how to fix this

User<6329807391>: Hi! We need a developer who can fix a bug in the code, we are developing a mini app.  And there is a task with sending 0.3 tones and receiving tokens, but in some cases tokens are sent to the user 2-3 times. The task was developed using tonconnect-ui for react

G: Is there any TON wallet with 12 seed words?

G: How can I contact TON chain technical support?

Li: Hello, Could I see your code? (reply to 69921)

Cat: Hello! Could you please tell me how to send a message to a smart contract from a specific wallet using Java? For some reason, I can't find the relevant documentation. I need to send messages from the backend to my smart contract, which expects these messages to come from one specific address.

User<6329807391>: Dm (reply to 69929)

cindy: i believe you need the sdk to do it. (reply to 69933)

cindy: Hi TON dev, if the transcation failed,can the asset  return to the wallet user immediatelly? is there a situation when the transaction failed, the asset still can't return to the user wallet?

Cat: Yes, but I only found Tonlib, which seems to be able to send external messages only. I think it would work for me if I could figure out how to make my smart contract (written in TACT) accept such messages only from my backend. (reply to 69935)

User<7123272744>: mainnet address: EQBl0MXGyXXxt7Sm7YRDPm0HQoY5XjSwV6Aukfl9JJL-Nbeh  I tried to deploy a new contract but failed with exit code9 like above image. What is wrong?

Anton: how about you provide the source code? (reply to 69898)

Haris: i got the error where it is coming from but it is not making any sense following is the code  require(sender() == collection_address, "not from collection"); (reply to 69940)

Haris: if i comment it the code compile successfuly

Harry: any ones? (reply to 69837)

Anton: do you have another instance of require with the same error string? (reply to 69941)

K.: Exit code 9 is "Cell underflow. Read from slice primitive tried to read more bits or references than there are".  Make sure you are sending all the data that the contract expects to read. Commonly happens if you are reading from the message body and forgot to add some data there.  (Source) (reply to 69938)

Haris: nope (reply to 69945)

Anton: can you share the contract code or at least all other error messages coming from require builtins? (reply to 69941)

Hossein: ?? (reply to 69725)

Emeka: Anyone know any library for getting all transactions from a particular address

Амир: For python i used pyton-api as I remember (reply to 69958)

Евгений Алексеевич: Good afternoon, please tell me how to leave 0 TON with a comment on the translation? I use python-api

Emeka: Wow thanks (reply to 69959)

Emeka: Does anyone know any library for typescript?

Kryptonite: hi everyone, i am trying to write testcases, in a particular unit test i have a  time constraint so i am setting  blockchain.now to desired time , but it is giving me “Unknown emulation error”

Miguel: Good morning. Is there a regex that always matches to a TON wallet address?

Miguel: for example this address: UQBGJu6favq3UZEIt0zaOFvm757V9C-UapVZJyEk0oKMO0i2   Does it always have the same nmr of chars then a "-" then the same number of chars?

Макс: Hi everyone, I've encountered an issue where the transaction results in Bounce · 0xffffffff, even though I'm following the documentation for @tonconnect/ui  Despite this, the result is still Bounce · 0xffffffff. Can anyone help figure out what's missing and whether a custom message is needed?

Nerses: I wrote this code         console.log(Cell.fromBoc(decodeBase16(data))) but get error Error: Not enough bytes for magic prefix (reply to 69587)

Mohammadreza: Any hints about finding jetton deposits without notification message!?

&rey: There is not (except one enumerating all possible addresses), since TON user-friendly address has checksum which cannot be validated.  dApps must accept TON contract identifiers in three kinds: raw (hexadecimal) addresses, user-friendly (base64) addresses and TON DNS. (reply to 69971)

User<7123272744>: cell msg_body = begin_cell()                             .store_uint(op::transfer(), 32)                             .store_uint(0, 64)                             .store_coins(amount)                             .store_slice(to_address)                             .store_slice(to_address)                             .store_uint(0, 1)                             .store_coins(1)                             .store_uint(0, 1)                         .end_cell();          var msg = begin_cell()                     .store_uint(0x10, 6)                     .store_slice("test")                     .store_coins(0)                     .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)                     .store_ref(msg_body);          send_raw_message(msg.end_cell(), 0);  This code does not work well. I am going to transfer Ton from smart contract to another wallet. What is wrong?

Tin: /

Miguel: thank you! (reply to 69998)

User<7123272744>: @pcrafter  Please check this code and let me know the issues (reply to 69999)

&rey: TON isn't a jetton, so you don't need a jetton transfer request. (reply to 69999)

User<7123272744>: What is ton transfer message? (reply to 70004)

User<7123272744>: from smart contract to user wallet address (reply to 70005)

&rey: It is the root cell of message, actually. So         var msg = begin_cell()                     .store_uint(0x10, 6)                     .store_slice("EQtest"a)                     .store_coins(nanotons)                     .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);          send_raw_message(msg.end_cell(), 0); is the correct way. (reply to 70005)

User<7123272744>: This is a destination address?

&rey: Use available indexers or scan blockchain yourself. (reply to 69997)

Mohammadreza: Doing it, but the problem is I can't reach the comment from the message my jetton wallet receives (reply to 70009)

Colin: I'm trying to run an archive node. The instructions say: Request user and password credentials to gain access for downloading dumps in the @TONBaseChatEn Telegram chat.  But I cannot join this chat, is says Channel is private. Any ideas how I can get the credentials?

Hossein: Anyone can help me (reply to 69725)

Nerses: @pcrafter i changed code again             let cl: Cell = tonweb.boc.Cell.oneFromBoc(tonweb.utils.hexToBytes(data));             console.log(cl) and get this error  Not enough bytes for cells data. It seems this way isnt solution as well am I right ?

Patoshi Duromoto: 👋   I’m hoping to get more info around “custom contract addresses”   Where the contract address for the token ends or starts with a specific word. Could anyone point me in the right direction?

NPA120: Looking for a Staking developer who can start immediately. You must be a senior dev not beginner.

Sunil | Aerius Labs: How to run funC based test ?

User<7311948310>: Please DM me (reply to 69921)

dddanivs: Hi! Anyone is currently running a node? I was wondering the real requirements Ram wise

dddanivs: 128 seems a lot

Egene: I also found it to be a bit excessive, but for someone willing to lock 340K TON should not be a problem cost wise (reply to 70047)

Egene: If you aren't planning on becoming a validator, and only plan running it in LiteServer mode I think you could try it out with less RAM and see how it goes

dddanivs: I just want to run a node that stays in sync with the Network and send and receive from It, i dont want to be a validator and just run a full node

Egene: you aren't under any financial risk of losing your staked TON if running in LiteServer mode

dddanivs: However i still want to have full history of the blockchain

Egene: Do you already have hardware? If yes, just try with what you have, worst case scenario it will just not be able to process transactions fast enough. just make sure that you have enough SWAP to cover for the missing RAM I am practically certain that you will be able to keep up with the real blockchain transactions, you might just get out of sync during peek times when a lot of transactions are happening at the same time and your slower node is not able to process them as fast as full nodes (reply to 70054)

Egene: We are planning on deploying a couple nodes in the very near future. Hardware is not really a problem for us the requirements seem very reasonable and are lower than most servers we generally deploy for clients  Our main worry is the fact that no ISP can give us a reasonable SLA that would not have us losing a lot of TON during a network outage. In theory you are penalized 101 TON for not participating in block creation and transaction signing for a significant amount of time during a validation round.  We can't find any info online on what a "significant amount of time" is. We just assumed the worst case scenario of being fined 101 TON per every block creation that happens every 5 seconds. We can achieve a reasonable SLA on our end that any TON fines that occur are covered for by the rewards on a year's timeframe.  However from the ISP's side no one is willing to give an SLA of 99.9999% uptime

Mr. Phong: connect wallet

Mr. Phong: Connect completed and open webapp

Mr. Phong: reload

Mr. Phong: why? help me!

Mr. Phong: After connecting the wallet for the first time, the wallet cannot be connected automatically. After reloading the second time, it worked. 10$ to fix this

Vitalik: HI. Who can help with connecting Highload Wallet v3?

Aleksandr: I've deployed a TON Site with .ton domain and trying to access it via publicly accessible TON Proxy (in1[.]ton[.]org, in2[.]ton[.]org, in3[.]ton[.]org) — it almost never succeeds. Most of the time public proxies are responding with 502 Bad Gateway, 504 Gateway Timeout or not responding at all. I was able to access my TON Site maybe 1-2 times out of over hundred attempts.  I also tried to use tonutils-go to access same sites using liteclient, as it shown in this [github[.]com/xssnick/tonutils-go/blob/master/example/site-request/main.go] example on GitHub, but after client.Get(..) it never goes any further (no error and no response) and just hangs indefintetely, even if I explicitly specify Timeout in http.Client object. Few times it moved forward with following errors:  1. failed to query http over rldp: response deadline exceeded, err: context deadline exceeded (Client.Timeout exceeded while awaiting headers) 2. failed to resolve host mydomain[.]ton, err: failed to run dnsresolve method: deadline exceeded, node 135[.]181[.]140[.]221:46995, err: context deadline exceeded (Client.Timeout exceeded while awaiting headers)  Some additional info: - TON Site deployed with Tonutils Reverse Proxy on Ubuntu 24.04 LTS, firewall disabled; - Domain linked successfully (according to reverse proxy logs); - Server with the site is the VPS server with well-known cloud provider; - Already tried switching connection and devices on the client side — issue still there;

Aleksandr: Is there anyone who can assist with that or point me to the right direction? Thanks in advance. (reply to 70099)

Paul: Hi, What is the best way to send back the remaining ton amount in msg value to sender?

Patoshi Duromoto: Any insights guys? 🚽 (reply to 70033)

Ronaldo: I'm facing issue on the second transaction on TON.  After sending the first transaction, the status of my wallet changed to the following: { "ok": true, "result": { "wallet": true, "balance": "3994185995", "account_state": "active", "wallet_type": "wallet v4 r2", "seqno": 1, "last_transaction_id": { "@type": "internal.transactionId", "lt": "22423546000001", "hash": "/L0lIwVJuSOUTCJD3SdcOzr9R58VCmN3UdkpMlt9Tvc=" }, "wallet_id": 698983191 } }  When attempting to send the second transaction, I receive the following error: `{     "ok": false,     "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction 82B922F74D2BFA47C2E5B4CE220F9B0AAD330C3C36246A373803A65C4B4620D2:\nexitcode=33, steps=23, gas_used=0\nVM Log (truncated):\n...te NOW\nexecute LEQ\nexecute THROWIF 36\nexecute PUSH c4\nexecute CTOS\nexecute LDU 32\nexecute LDU 32\nexecute LDU 256\nexecute LDDICT\nexecute ENDS\nexecute XCPU s4,s3\nexecute EQUAL\nexecute THROWIFNOT 33\ndefault exception handler, terminating vm with exit code 33\n",     "code": 500 }`

Ronaldo: this is my wallet: https://testnet.tonviewer.com/kQCCuSL3TSv6R8LltM4iD5sKrTMMPDYkajc4A6ZcS0Yg0tKO

Mr: Hello guys - any ideas where we can get few thousand dollars in testnet TON tokens (e.g. 200/300 TON)?  We have a trading app and we want to stress test a bit the infra by simulating multiples trades and see if there are anomalies

Colin: Can anyone help me get credentials to run an Archive node? (reply to 70014)

Kürşad: hi everyone, i have problem. how can i read contract function for my react project. contract write is tact language. if you can know a github example repo, can you share with me please.

TON Bounty Bridge: ​Tact source code formatter  🏷 Developer Tool  Summary:Implement Tact source code formatter as part of it's compiler. This can provide a basic solution for...  Created by heli0dus

Tefaul: Hi

META: hi, is it possible to make transfer when user decrypting encrypted message?

Tefaul: How many language options are there?

META: beware of scam (reply to 70156)

Trassos: I am not getting anything from Testgiver TON bot. Is it working?

Амир: Why I got all my balance drained? (reply to 70162)

Fantom▪️🐾: Hi guys

Амир: Wdym by "problems in system addressing" (reply to 70175)

— 2024-06-13 —

Wang: It's working well. I've tested it using tonkeeper wallet. (reply to 70163)

User<6288216921>: anyone need a dev?

Paul: This message seem error in client when call to testnet. Retry (reply to 70112)

Ronaldo: The first transaction of the wallet works fine (reply to 70215)

Ronaldo: If I try with a new wallet, will works. And them, when I try second transaction will shows that error

Paul: Can you share the sending script?

Paul: you just want to send ton from address to address

Harry: anyones have a example call an function in ABI of TON contract

Ronaldo: yep (reply to 70219)

Ronaldo: https://github.com/trustwallet/wallet-core/issues/3887 (reply to 70219)

Long: hi guys, how can I detect a deposit is bounce back and not sucess?

Long: like this, I send Ton and the tx send back

Long: is there a field where I can check this is bounce or not?

Long: I see bounce and bounced here but there is no docs for it?

Long: what are meaning of these two field?

Long: also when the message bounced back, the exit_code still zero so it not a failed tx

Long: example tx here: https://testnet.tonviewer.com/transaction/d6ebe2f24c70976a99d8222caa02b0a4555e4593b3b31560da5c4341a1d4851e

Long: appreciate any help

User<6452070203>: i download plugin TON Foundation in my webstorm IDE, why i have errors?

Sunil | Aerius Labs: How to run funC based test ?

Khang Pham: Hi guys I’m new, I would ask Func or tact? Which one is better to start doing a ton mining game? Should I use blueprint to develop or it must be used?

User<5513110293>: how to I get data of peding swap order in stonfi? I lisner and receive a message which's data is = ""b5ee9c72010102010054000101c001009b259385618004fa3e47....0c41c0a477ce848cfd5c2cdfa3cb50". I use boc.DeserializeBoc and receive a "Bag of cells:  [0xc00011e120] First root cell from boc:  x{C_}  x{259385618004FA3...xxx........48CFD5C2CDFA3CB5_}

User<5513110293>: *pending swap order

Ma><im: it will also have the status of uninited, how can I make it active immediately? (reply to 58684)

Cesar: Hey guys, can anyone help me out with tonapi's get trace endpoint? I'm getting some error on their golang sdk:   decode response:\n    github.com/tonkeeper/tonapi-go.(*Client).sendGetTrace\n        /home/ubuntu/go/pkg/mod/github.com/tonkeeper/tonapi-go@v0.0.3/oas_client_gen.go:8865\n  - error:\n    github.com/tonkeeper/tonapi-go.decodeGetTraceResponse\n        /home/ubuntu/go/pkg/mod/github.com/tonkeeper/tonapi-go@v0.0.3/oas_response_decoders_gen.go:6488\n  - code 404: {Error:entity not found}

Александр: Did you use correct TraceID? (reply to 70296)

Cesar: yeah - but it doesn't happen for all transactions

Cesar: only some transactions are erroring out like this

Александр: Can you provide a couple of examples of such TxIDs?

Wukong: Hi everyone, does TON have the ability to auto approve/auto-confirm transaction like in SOL or SUI? I want to reduce the hassle for user when they need to confirm transaction over and over again

Андрей: Nope (reply to 70312)

Wukong: What about this one: https://docs.ton.org/develop/dapps/defi/subscriptions. It sounds similar to infinite approval, I'm not sure if I understand it correctly (reply to 70316)

prodvd: Hey TON dev fam.  Is anyone faced telegraf issue (https://www.npmjs.com/package/telegraf) when you develop TON app?

User<6828012762>: how to deploy HighloadWalletV2Contract please help me

Harry: guys, i minted my nft... now how i can get my list on getgems? i don't saw their docs for api

&rey: bounce: message can bounce if its processing fails (for instance, if destination contract is uninitialized) and there are not enough TON bounced: this is bounced message, indicating failure ^  These flags are mutually exclusive (bounced cannot be set manually, and upon bounce the former flag is reset automatically). (reply to 70252)

&rey: Attach StateInit in transfer to destination contract. If you mean that wallet is uninit, it should work fine anyway. (reply to 70293)

&rey: You can't add them with TON Connect so you'll have to request user's mnemonic. Generally, this is possible but needs significantly more trust to work. (reply to 70318)

Nerses: has anyone example how to parse data that is longer than cell size using load*  functions of build file ?

meomeocoj | Mike: hi guy, i wonder that is there any way to track the tx-chain if my smart contract have multi hook message

zolnex: The new coin Telegram Stars(XTR), is it deployed on ton chain?

Long: Thank you. So we need to check if there is a inMessage that have bounced:true to check the deposit is fail? (reply to 70334)

к.: Hi, how can we obtain a wallet public key to encrypt a message with it?  1. When the wallet is deployed and not deployed.  2. on-chain and off-chain.  In all of these cases.  Also, consider that we only have a wallet address like:  EQBF35mKBqM_HhNhOND6nMHGgmQ4uv29sZBP20ip2bNNYdkY  This address is random and invalid

&rey: Yes, if you're checking your wallet.  Or you can check destination wallet: then you need to find transaction's outMsgs and check if there is one with bounced:true. (reply to 70350)

&rey: Only onchain when the wallet is deployed (or if you get its StateInit, which is case with TON Connect 2).  You need to call get-method get_public_key. (reply to 70351)

Long: ,"bouneecePhase":{"type":"ok","messageSize":{"cells":"0","bits":"0"}  The tx.description has this bouncePhase, can I use this to check? (reply to 70352)

к.: Thanks.🙏  So, we can call this method of each wallet when it's deployed on-chain?  And, are the results suitable for encryption? Or any conversion is required?  Can we use the ton connect ask to the wallet for encryption and decryption of a message? (reply to 70354)

&rey: Existing wallet implementations return 256-bit slice with Ed25519 public key. Whether it is fit for your application, it's for you to decide.  No, TON Connect 2 doesn't support arbitrary message encryption/decryption. (reply to 70356)

Łukasz: Hi folks, I'm working on the client web app and I'm struggling with two obstacles: 1) I don't know how to properly parse jetton content (with metadata as a dictionary).  Tried with solutions from docs about asset-processing metadata and without success 😄 2) I'm unsure how to create a decent transaction status flow (at once I have to send a transaction after successfully finishing the previous transaction).  I've checked docs, TON cookbook, and the Internet and I couldn't figure out any solutions for those obstacles.  Thanks in advance for any clues!

к.: Thanks a lot.  Is such addition (adding API for encryption and deception of arbitrary message) possible on ton connect? Can anyone make these additions or only the ton keeper team can change the protocol? (reply to 70357)

Haris: hi, is there any way to manipulate time in test suites i am  using tact lang and blueprint

Haris: anyone ? (reply to 70363)

Łukasz: Follow up, any help is really welcome 🙏 (reply to 70360)

Łukasz: At this point, we don't need more hands, but thank you for the interest 🙂  Right now I just need some clues about those two basic things (from the web app perspective) and I will be able to move forward 😄

PavelN: Hi guys! Did someone face this issue before? Trying to get wallet data via Toncenter API from my node:  curl --location 'http://ton-node:port/runGetMethod' \ --header 'Content-Type: application/json' \ --header 'Accept: application/json' \ --data '{     "address": "address",     "method": "get_wallet_data",     "stack": [] }'   Response:  {"ok":true,"result":{"@type":"smc.runResult","gas_used":1056,"stack":[["num","0x0"]],"exit_code":5,"@extra":"1718277510.1155472:11:0.6248927768674714"}}   Public nodes return wallet data, but my node doesn't.

Binaplexus1: I am I need developer who can create click and earn website (reply to 70374)

Haris: please anyone? (reply to 70363)

&rey: Search for blockchain.now or something like that. (reply to 70363)

Haris: yeah i changed it but it is giving me error unknown simulation error

&rey: Please make certain that it is integer. (reply to 70387)

Haris: yeah i have checked

It's: Have you guys found any good stater template?

Haris: blockchain.now = Date.now();

Khang Pham: Im stucked to start my first TON mining game, anyone can help please or any helpful resource is good for me, thank you guys

Haris: both are numbers type

any: Where did you see the notification in the screenshot? I didn't notice the node upgrade, and now my node is unable to sync. (reply to 68966)

Haris: i think there is a difference as if i get the time from transaction it is showing me milliseconds and Date.now() is returning in nano seconds (reply to 70392)

C: I checked and it seems that the top Jettons on the TON chain do not have contracts to open source their own Jetton_wallets. Does anyone know which Jettons on the TON chain are completely open source

&rey: "integer" is a number that is whole: 0/1/... blockchain.now = Math.floor(Date.now() / 1000); is better. (reply to 70392)

Haris: yeah i have already done that and got it resolved thanks for the support

Jamie: Hi devs. Does anybody know of a good bridge for TON that supports more than $1000 a tx (layerswap) or doesn’t cost 80bps (ton bridge)? TYSM!

Ma><im: where can I get a state init for my wallet? I do it through pytonconnect (reply to 70336)

&rey: You ask users to transfer TON to your uninitialized wallet, is that correct? (reply to 70416)

Ma><im: so that when transferring funds to a wallet, they do not return back (reply to 70416)

Ma><im: yes (reply to 70417)

&rey: Where do you get your wallet address from?

Ma><im: pytonconnect (reply to 70421)

&rey: I assume that's false, since you can only get user's wallet address from there, not yours. (reply to 70422)

Ma><im: я хочу деплоить кошельёк и чтобы на него переводили (reply to 70423)

Ma><im: кошелёк как посредник

&rey: If I understand correctly, then you do have mnemonic for the intermediate wallet. How are you converting it into address? pytonconnect doesn't support that IIRC. (reply to 70424)

De-Fi: Hi, pls i need help on how to transfer jetton tokens via react

User<7123272744>: Do you mean Jetton token? (reply to 70433)

De-Fi: yes i mean jetton token

Miguel: Hi! How do I fetch the Toncoin total supply?

እሙቲ🐾: Tapswap info

eax: this is a chat for ton developers 🔨 (reply to 70448)

Williams: Hello, I have issue with transaction on Telegram Ton wallet . I sent 3000usd from telegram wallet to my Bybit wallet but mistakenly I inputed wrong Tag. I contacted Bybit and they confirmed the fund refund to the source wallet . But since 2nd of June the fund is not reflecting . Kindly help. Here is the refund Id:  5bebf7e376d3e11bbd83b2b38cf04b657abb5415ac132621e7d4f1eb4cac9267  The transaction Hash: afa6438419a2de27dd8cc946589ec199316e2ae56e080d5cc915fc49598b6d42

Williams: Here is the source address :   Transaction originated wallet: UQBPRfxibH8gNpKrW7rbWTDSB1TUvleFwx9JBdhTnJTW_XOH Network: TON  Coin :USDT Value :3000usd

De-Fi: ..... (reply to 70433)

Nerses: what for are generated load* functions in build files while compiling tact contract ?

&rey: You must contact @wallet providing info about refund, as mentioned in bottom of the page. (reply to 70455)

Williams: They don’t respond to messages at all . I have proof

M: Does someone know how to use TON Verifier?

M: I need some help with which files do I need to upload?

Khang Pham: Can anyone here please help me in setting up the environment for developing TON game using Func please? Thank you so much

Stefan: Like sepolia and devsol, is there any test ton network?

User<7123272744>: I don't think it exists on Ton chain. Only mainnet and testnet (reply to 70487)

Stefan: so How can you test it? where can we get virtual, dev ton?

&rey: testnet. You can also use @ton/sandbox for very-local tests and MyLocalTon to test full project. (reply to 70487)

User<7123272744>: yup, sandbox is similar to dev net in solana (reply to 70491)

User<7123272744>: In general, I test my smart contract on testnet. (reply to 70490)

Stefan: Thank U. I have ex in EVM and SOLANA. and now I want ton tech. And mentioning about Func, is it difficult?

Daniel: It’s not that difficult, just need to understand principles of cells (https://docs.ton.org/learn/overviews/cells)  The documentation is quite helpful and understandable (reply to 70497)

User<7123272744>: Is is easy to learn. If you have rich experience in blockchain space, you can learn FunC with ease. Please refer to Ton document. (reply to 70497)

Alexey: Hey guys, are there any FunC examples of creating a pool and providing liquidity for DeDust or StoneFi? I'm specifically looking for a FunC code that does this from a smart contract. Thank you!

mohsen: transaction = await wallet.transfer(**transfer) Why does the transfer function return only "1"? How do I get more(hash, fee, etc.)? (reply to 70501)

&rey: Because it doesn't track whether the transfer gets sent. (reply to 70510)

mohsen: Isn't it strange? How can you send a transaction and there is no indication that you can track what happened to that transaction? (reply to 70511)

&rey: I have written a script that sends transaction certainly (sorry, it is proprietary), it has ~120 lines relevant to tracing tx.  You have to listen to messages on the sender's wallet. (reply to 70512)

mohsen: How do I distinguish it from other transactions when I have no indication of the transaction I am sending? Can't I have every indication of the transaction before sending it? (reply to 70513)

&rey: You're sending external message, actually, and a couple of parameters (creation logical and UNIX time) are rewritten before inclusion into blockchain in unpredictable way. (reply to 70515)

&rey: By effects performed. By signature within the message (or full message body, for optimization). (reply to 70515)

mohsen: I know I can use them but the project I'm working on, hash output is a requirement. (reply to 70517)

mohsen: I have implemented this function for more than 20 blockchains and they all return a transaction hash (reply to 70517)

&rey: You have to listen to messages on the sender's wallet, distinguishing them by signature or full external message body. (reply to 70518)

&rey: TON doesn't currently have a guarantee that any external message will be included in blockchain. In particular, most likely it won't get included instantly, instead appearing within 0-30s from sending.

meomeocoj | Mike: I should write the trace for each smart contract if i have a chain of message hook, shouldn't I ? (reply to 70522)

&rey: Do you wish to get the result of transactions chain? If yes, then you do need that.  However, once internal (cross-contract) message is sent, it will get delivered sometime, so you may already activate offchain features/... (reply to 70525)

soleil: my problem: How to get the transaction history of an address? For example, the history of the last 5 days.  Actually, I want to search inside the transactions of a Ton blockchain address, what is the best and easiest way?  In normal mode, we go to tonviewer and we search and find it. What should we do when there are so many transactions that we cannot find them manually and for example we are looking for a specific amount or a specific comment? There is no ready code for this? I should say that I want to search for transactions in which the NOT token was transferred. I want to search the comments and the number of not token sent.   my solution: import requests from datetime import datetime, timedelta  # Replace these with your actual values address = "UQBdWoMOSCFHkfSrU1KQDGJNO_88Xv1jAZaxgBWOt4mZDwmZ" api_url = "https://api.tonviewer.com/v1/transactions" token_name = "NOT" specific_comment = "1043241212"  # Date range: last 10 days end_date = datetime.now() start_date = end_date - timedelta(days=10)  # Format dates start_date_str = start_date.strftime('%Y-%m-%d') end_date_str = end_date.strftime('%Y-%m-%d')  # Fetch transactions from API response = requests.get(api_url, params={     'address': address,     'start_date': start_date_str,     'end_date': end_date_str })  if response.status_code != 200:     raise Exception(f"API request failed with status code {response.status_code}")  transactions = response.json()  # Filter transactions filtered_transactions = [     tx for tx in transactions     if tx['token'] == token_name and specific_comment in tx['comment'] ]  # Display filtered transactions for tx in filtered_transactions:     print(f"Amount: {tx['amount']}, Comment: {tx['comment']}, Date: {tx['date']}")   error: requests.exceptions.ProxyError: HTTPSConnectionPool(host='api.tonviewer.com', port=443): Max retries exceeded with url: /v1/transactions?address=UQBdWoMOSCFHkfSrU1KQDGJNO_88Xv1jAZaxgBWOt4mZDwmZ&start_date=2024-06-03&end_date=2024-06-13 (Caused by ProxyError('Cannot connect to proxy.', OSError(0, 'Error')))    Can anyone guide me on how to solve it?

Louis: i created a custom contract A and transferred TON into it, how do i transfer TON back to my deploy wallet??

User<7123272744>: is there withdraw function in your custom contract? (reply to 70532)

Амир: No way, if u havent specified such function in the logic of ur contracf (reply to 70532)

Louis: no :< Can I use the deployer wallet to send a message to the contract to transfer the TON back to the deployer wallet? (reply to 70533)

Louis: thank you 🙏🙏 (reply to 70535)

De-Fi: Hi, pls i need help on how to transfer jetton tokens via react

Louis: https://docs.ton.org/develop/dapps/ton-connect/message-builders here, or you can reuse blueprint function (reply to 70541)

ALena Govaleva: Hi, could you please tell me what the minimum amount for a Call Contract operation is and what it depends on?

User<7123272744>: impossible (reply to 70536)

Louis: yep, I have added the withdrawal TON function to the contract, thank you (reply to 70549)

St: Hi all , is there any one here who do a node for TON ?

Meshchain.Ai: I sent Ton token from Ton space to Ton wallet and it was successful but not credited.please I need help

TON Bounty Bridge: ​Enhancing the TON Ecosystem Map and Repository with Interactive Features  🏷 Resource  Summary:Propose the development and integration of interactive features into the TON Ecosystem Map and Aweso...  Created by JackReachy

TON Bounty Bridge: ​Creating Comprehensive Educational Materials for Developers in the TON Ecosystem  🏷 Education  Summary:Develop an extensive suite of educational materials aimed at developers who are new to the TON ecosy...  Created by JackReachy

&rey: Please search in this chat. (reply to 70558)

Nerses: If I have map in my contract and I (delete it)assign one of its (key,value) pair null.Is that (key,value) pair still occupying storage ?

&rey: No, it is not. (reply to 70577)

Nerses: So contract shouldn't pay storage fees for it,yeah ? (reply to 70578)

Colin: anyone know proximately how big latest mainnet dump is?

User<6397988095>: I'm full-stack and web3 & web4 engineer If anyone has the web application project I can handle plz DM me

Ronaldo: I have a question:  How can I determine if the transaction was accepted/mined/confirmed ? Like, in ethereum after receive the Hash not means it was confirmed... we need to wait it became mined and them wait confrimations... what about TON?  https://testnet.toncenter.com/api/v2/getTransactions?address=EQBry_ewauy7EZ8UzqQwAkQY4T402qNlvyUYyldsE4XhY7G3&limit=1&hash=2982f43223f9ffdf799b4abb731bd9ea1e5058252ea550a5cdbcdb86971c64cb&to_lt=0&archival=false

Pirate: Админы , дрейнер в чате ))) (reply to 70595)

Daniel: Попогите, у меня пропали два пула когда я выполнял таски, почему?

Daniel: Wait a minute, two pools disappeared when I was completing tasks, why? Please help, from the very beginning of staking I received only one pool, the rest disappear when I complete the task.

Daniel: Help, two pools disappeared when I was completing tasks, why? Please help, from the very beginning of staking I received only one pool, the rest disappear when I complete the task.

Behrang: I believe the max punishment is 101 TON for a whole validation round, not per block. (reply to 70060)

Michael: Hello guys, I've got a little problem

Michael: At this stage, is it downloading the dumps? Because i don't see any more prints on the console or is it how it behaves?  The first time I did this installation, it didn't take so much time compared to this.

Michael: It has been like this for over 30 mins. Don't understand what's going on. (reply to 70630)

Daniel: Please (reply to 70622)

MEW: do not use -d to download (reply to 70630)

MEW: do not use wget to download

Michael: I followed their doc step by step and it worked perfectly when I used a non root user but then I tried to replicate the same steps on another server but with a root user, it stops working (reply to 70640)

MEW: do not use root user

Michael: I saw someone that used root and it worked (reply to 70643)

Hossein: Hi,i want get toncoin on testnet

Hossein: Please answer (reply to 70650)

&: You can get from testgiver bot on tg (reply to 70651)

Hossein: I was send the wallet on the bot ,but i didn't receive in wallet (reply to 70653)

Buddle: I code website & contracts and tg bots for meme coin & dApps(EVM, Sol, TON, Bitcoin etc). Does anyone need?

User<6605078239>: Hi everyone, Good day! This is a TON blockchain developer. I can develop the telegram bot, mini app game like notcoin, tapswap and some smart contracts. If you are looking for a developer, can we work together?

Gamja: hello~ Just wanted to ask if there is any information/documentation available for tokenized telegram stickers on TON? I saw news about this some time ago, and was wondering if there is any info out there

— 2024-06-14 —

Ronaldo: what wallet is this? (reply to 70614)

kaykluba: I am new here

kaykluba: Hello people 👋

kevin: it is easy, npm like func-js include all binary to compile func into boc (reply to 70484)

kevin: Ton developer looking for chance to work for you, if you need a dev please DM me.

Daniel: Notcoinbot (reply to 70678)

Daniel: Can you help me ? (reply to 70678)

Harry: how we can get NOT balance.. i knew how to get TON, but NOT???

Ronaldo: THIS IS A GOOD QUESTION haha (reply to 70698)

Ronaldo: whats your problem? (reply to 70692)

Harry: i dont want to use abi, so i try to ask to find the easier ways : )) (reply to 70699)

Daniel: .. (reply to 70700)

Daniel: . (reply to 70622)

kevin: there are multiple ways to get that data depends on your circumstance , as I know indexer like tonapi / anton  have that API. if you check network request like tonkeeper / stonfi / dedust, they all have API retrieve jetton balance of any address. and also you can query directly to ADNL with SDK like tonutils-go. (reply to 70698)

kevin: curl -X 'GET' \   'https://tonapi.io/v2/accounts/UQAMLht_mIo-0OMkDLni6hr_fu01-BNSEd77f4ucVSHJllOA/jettons?currencies=ton,usd,rub' \   -H 'accept: application/json'

kevin: https://anton.tools/api/v0/accounts?owner_address=UQAMLht_mIo-0OMkDLni6hr_fu01-BNSEd77f4ucVSHJllOA&

kevin: this is stonfi

kpo: The contracts on the Ton chain look like a LIFO stack structure. Will ton follow this rule every time he packages a transaction?

3BASE: Hello everyone,  We are 3Base, a platform dedicated to the Ton DApps Store. We want to help developers promote their Mini APPS for free.  🚀 Just publish on 3Base now, 🔥 and you can get over 20,000 initial users for free.  🤖 Bot: @ton_3base_bot 📢 Channel: @official3basechannel  👤 Publish Support: @Ton_3Base

crazycats: Hi all...  New dev here and I am like.... really really new in this whole blockchain too.   I understand I can google my answers, but is there a way/course/program/learning path for beginners to start learning TON?   I do have basic programming skills, but I am no way a master. Feels kinda overwhelmed with lots of new things to learn here and there, and unlike React/python/commonly known programming language and framework, there is no popular course in TON.  And one last thing, is there any PC minimum specification to start developing in TON ? I am kinda stuck financially and can't upgrade my 5 year old laptop. It has windows and 16gb of ram

User<7123272744>: Welcome to Ton. Your PC is good for handle Ton contract and you learn it's concept from Ton document. https://docs.ton.org/develop/overview (reply to 70730)

Abdulaziz: Who the fuсk are he, I was asked about github link of ton blockchain open source

Tim: Scam (reply to 70734)

Abdulaziz: There is no report feature on telegram, i cannot even report, i can only block him, it gives limit for 3 days, there is less chance to limit his account (reply to 70734)

Abdulaziz: He thinks he can scam dev xD (reply to 70735)

Abdulaziz: Do you have ton blockchain open source, github link, i wanna learn somethings from it (reply to 70735)

crazycats: thank you (reply to 70732)

Tim: https://github.com/ton-blockchain/ton (reply to 70739)

Abdulaziz: Thanks (reply to 70742)

Abdulaziz: And can i generate cold wallet address with private key using ton api?

Tim: You don’t need ton api for that. Just use library for your lang. docs.ton.org @ton/crypto (reply to 70744)

Abdulaziz: Do i need a team to create web app like notcoin with NFT and token airdrops or it's possible to create it alone? (reply to 70745)

final: You can create google by our own, it’s just about time (reply to 70747)

Tim: I think your questions are a bit vague (reply to 70747)

Abdulaziz: yes i know i had to do a lot thinks, like creating design, interface for playing game, the main thing is safety so that no one abuses bugs what was happened with notcoin (it has also bug with missions). Also i need create smart contract to make feature of nft creating, i need domain on getgems and my hosting or server with domain and etc (reply to 70749)

Abdulaziz: I would like to know how difficult it is, this will be my first big project

Abdulaziz: Maybe i can't know without trying, at least i need a team for fast work, or it can take few months (reply to 70751)

Abdulaziz: I would like to know some information from those who have already created such projects (reply to 70750)

Tim: It will take months with a team. But this chat is more about code questions

Tim: I don’t know where you can get advice about creating your own project. Try to find other founders and ask them if there any chats like that

Abdulaziz: How did Notcoin make a bug, or was it on purpose? It would be good If I don't repeat their mistake so that my application won't be abused either (reply to 70750)

Panda: @pcrafter Hi dude how can I destory the contract that I deployed?

Tim: send message with mode 32, but I would not recommend that (reply to 70758)

Ronaldo: I found this, it's better than the previous, because it get only the jetton you want... not all  https://tonapi.io/v2/accounts/UQAMLht_mIo-0OMkDLni6hr_fu01-BNSEd77f4ucVSHJllOA/jettons/0:1371473af6c19208231269db1550a746c0cd4130a4be1ca09618f93ad3164683?currencies=usd (reply to 70698)

Teiv 🦴: Hello guys, I would like to ask if there's a function that could help us to sponsor the gas fee for users to play? It means to prevent the sign the signature pop-up (we'll cover the gas fee and use can continue to play without signing anything)

Yashwanth: when i am deploying my contract TESTNET, its getting this error,   Connected to wallet at address: EQClDfMMa9oPq1UXQw3n8H83r3rWAoR8UWmkIMiogSIRxMzz err---> Error: Invalid address. Got EQClDfMMa9oPq1UXQw3n8H83r3rWAoR8UWmkIMiogSIRxMzz     at BitBuilder.writeAddress (/Users/yashwanth/other-projects/web3/ton/practice-ton/adtoken_contract/n      const adminWalletAddress = address("0QClDfMMa9oPq1UXQw3n8H83r3rWAoR8UWmkIMiogSIRxCq8")     const senderWalletAddress = address("UQAnm-0lRvKvQ9lwwIpYj8gyFK7uVSp49bG100aFpv6Isihf")  My createConfig look like this const myContract = MainContract.createFromConfig(       {         adminAddress: adminWalletAddress,         budget: 1,         campaignWalletAddress: senderWalletAddress,         category: categoryCell,         companyName: companyNameCell,         originalUrl: originalUrlCell,     },       await compile("MainContract")     );        const openedContract = provider.open(myContract);  I couldn't figure out where is the issue, Any suggestion ?

Think: I'm building the eco project

Harry: how i can get response after transaction? i try to return and console.log but dont get anything

Cat: Hello! Could you please tell me what could be wrong? I'm trying to use this method to update the smart contract field, but it does not work.  message SetPubKey {     pubKey: Int; }      receive(msg: SetPubKey) {         self.requireOwner();          self.pubKey = msg.pubKey;          self.reply("Success".asComment());     }  I send a message like this.      await contract.send(         provider.sender(),         {             value: 0n,         },         {             $$type: 'SetPubKey',             pubKey: 21654535335766613313092577796973970768002909532340125725186078057571523008359n         }     );

Harry: my abi (reply to 70789)

&rey: You need to pay for computation so value should not be zero. (reply to 70795)

User<7123272744>: what is minimum transfer amount of Ton?

User<7123272744>: May I send 0.0000007 Ton from contract to other address?

Samuel: Yes

daniel: anyone has any info about ton ledger development ? when it will be normally supported ?

User<7123272744>: but I am getting insufficient funds for this transfer. I have enough Ton in contract (reply to 70810)

Cat: Oh, wait. You are right... I forgot about it because I got used to working with EVM, where the gas is separated from the value. Thank you very much! (reply to 70803)

&rey: There is transfer fee, around 0.00001 TON or like that. Flag +1 when sending accounts for it. (reply to 70812)

User<7123272744>: I tested it but min amount was 0.001 Ton (reply to 70818)

User<7123272744>: what do you mean by Flag +1? How to do it? (reply to 70818)

&rey: send_raw_message(..., flag_with_+1); — possible example of flag is 3 (SEND_PAY_GAS_SEPARATELY | SEND_IGNORE_ERRORS). (reply to 70821)

0x0liver: is there any tutorial to run a anton indexer?

User<7123272744>: send_raw_message(msg, 1) or send_raw_message(msg, 2)  right? I sent it to 0. (reply to 70822)

De-Fi: Hello, does anyone have an idea on how i can get all the jetton in an address programatically?/

Behzad: Hallo guten Morgen

K.: You can use an API that returns that data. At least the most popular ones have such functionality. (reply to 70828)

&rey: 1 or 3. (reply to 70824)

User<7123272744>: I don't see 3 mode in Ton document (reply to 70841)

&rey: Please learn of number binary representation (bitmasks). (reply to 70842)

Max: Hi guys, I come from a Web3 infra provides decentralized storage, DWeb hosting, RPC, civerse developer services. Our solution can support Ton developers on infra part. Can I learn is there a standard or how to be included in ton.app-dev tools?

K.: If you scroll below in the docs: "To build a mode for the send_raw_message, you just have to combine modes and flags by adding them together."  3 = 0+2+1 (reply to 70844)

Nerses: How can i create getter in tact that returns how much storage occupies my contract currently ?

Dmitriy: Hi!  I have a contract which interacs with different jettons (for now it’s not yet decided whether it should be some specific list of jettons or any of them). This contract receives transfer_notification message from its jetton wallet and then runs some logic. I want to validate that the transfer_notification message came from contract’s jetton wallet, but not somebody else. Smth like this:   slice jetton_wallet_addr = get_jetton_wallet_address(my_address, jetton_minter_address) ;; maybe some other arguments too throw_unless(228, equal_slices(msg_sender, jetton_wallet_addr))   IOW, I want to have something similar to associated token account program from Solana.  Is it possible to implement this? I see that jetton minter does have get_wallet_address, but it’s supposed to be called off-chain, and I want to use it on-chain.  Thanks in advance!

Hossein: ? (reply to 70654)

User<6809510202>: /stat@combot

C: Does anyone have Jetton's deployment script in the Blueprint environment help I want to learn something

NPA120: Yes, I have and it is open source (reply to 70867)

Haris: you can get them from here  https://github.com/alefmanvladimir/lesson8/tree/main/scripts (reply to 70867)

Kürşad: How do you read data from the contract with the client?

Khang Pham: guys please correct me the syntax error of this code:

Амир: I guess at least all get functions are pure by definition (reply to 70879)

Амир: And use ifnot(found) (reply to 70879)

Khang Pham: yeah Im confusing with the syntax rn, thank you

Khang Pham: is it different than "if (~found)"? (reply to 70882)

Амир: Yesssss sir (reply to 70884)

C: thanks, Do you have a func version? (reply to 70876)

Khang Pham: thank you a lot, are you a professional ton developer?

Haris: yeah you can find that also (reply to 70886)

Haris: https://github.com/ton-blockchain/stablecoin-contract/tree/main/contracts

User<7123272744>: It is very simple and easy (reply to 70878)

Kürşad: I use this code, but the data comes as Cell. I can't parse (reply to 70892)

User<7123272744>: What type of data do you want to get? (reply to 70893)

Kürşad: It will be json, I will use it in the frontend (reply to 70894)

Александр: Simply create a dictionary to store the list of wallet addresses for jettons. Add or remove them as necessary. Within the smart contract, look for the sender's address among the dictionary keys.  You can use the wallet version 4 code as an reference: https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc (reply to 70855)

User<7123272744>: How did you save it into the contract? (reply to 70895)

Kürşad: I made the contract and deployment with Tact, now I want to read data with address (reply to 70899)

User<7123272744>: Sorry to say this. I am not good at Tact. (reply to 70900)

User<7123272744>: But it is similar to FunC. just my thought

Nerses: i have a problem with parsing message. What to do if i get long string with api and dont know in what type of variable to store it (as it overflows) to load data from it bit by bit ? any hints or approaches ?

Khang Pham: guys correct me the syntax error here please

Dmitriy: Thank you! (reply to 70898)

PZ: anyone knows how to call this function?

PZ: what parameters should I put in? many thanks in advance

PZ: https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post

Wesend 🛍️: Can anyone teach me how to make web3 games privately?

G: dm (reply to 70930)

Wesend 🛍️: Done (reply to 70936)

Armin: What's the usage of this function for you? It's used for contract call, so you must pass the correct data based on your usage. (reply to 70916)

Abdulaziz: Ban him @admin (reply to 70950)

Abdulaziz: Sсаm (reply to 70950)

Cybr4x: Can I write solidity and deploy on ton network?

&rey: No, you can't. In particular, contracts architecture is different. (reply to 70956)

Nerses: have someone else encountered issue in testnet right now. i am trying to do transaction but it neither fails nor confirms

Nerses: to: sender(),                     bounce: true,                     value: ctx.value,                     mode: 0                     });                   self.contracts.del(msg.data.__hashlock);         self.contractLength -=1;  } send operation will be done in the end ? or operations are done from start to end ?

Амир: Of course (reply to 70887)

boot adbot: anyone know how to swap ton to another token using tonweb?

Armin: Have you checked ston.fi ? (reply to 70978)

User<7037859753>: Hi guys anyone have mini game telegram bot ?

User<7123272744>: I have one (reply to 70985)

User<7037859753>: dm pls (reply to 70991)

Khang Pham: guys anyone can help me on this error please, it said "error: persistent_storage is not a type identifier   persistent_storage dict(int, int);"

&rey: This isn't valid FunC syntax (nor Tact, actually). Where have you obtained it? (reply to 70995)

Khang Pham: Im just learning to build a simple ton game, and I asked chat gpt to write me the sample one :((

Khang Pham: any open source code sharing the ton game so i can learn from that please if you know

MEW: As synchronization progresses, the archived data becomes increasingly smaller.

MEW: What is the reason for this phenomenon?

MEW: 🥺

Wesend 🛍️: Fishing (reply to 71011)

MEW: anyone knows? (reply to 71007)

User<7277762156>: Guys, does anyone know any other chat rooms where I can find devs?

User<7123272744>: what developer are you looking for? (reply to 71022)

Nxrix: what could I do with tonconnect to first show connect wallet if they haven't connected then send transaction? I need to know what code to use

O: https://testnet.tonviewer.com/transaction/392f5721fe440dd6b816daab4bbb5af9aa6834bc92ac916e4d10ff916b6dfe15 can someone expain Exit code: 5 means try to send jetton

O: when send jetton, jetton_wallet_address - is it master address or my address ?

Александр: If you want to send a jetton from your address, you need to send a message to the address of your jetton_wallet (which can be obtained from the public method get_wallet_address). Specify the master address as the recipient, and the smart contract will automatically calculate the recipient's jetton_wallet address.  https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/contracts/jetton-wallet.fc#L64 (reply to 71038)

Cobalt: Hello. I'm looking for a paid developer to create a simple airdrop bot  The input is a file with a list of wallets, amount and comment. Next, tokens are sent to these wallets.  The main requirement is high speed

Александр: Have you tried using publicly available services like https://ton.oneclicksender.com? (reply to 71065)

Denis: Hi, is native TON Coin transfer trigger TokenNotification on recipient?

Decentralized: wonder is there anyway to switch tonconnect wallet to testnet

Амир: Yes (reply to 71091)

Decentralized: i read all the doc but couldn't find it (reply to 71093)

— 2024-06-15 —

Decentralized: can u help send an example if it's possible? seem no way to switch network (reply to 71093)

Yoni: Hi

Nxrix: Any idea what is wrong?

Whitey: Hi there! Can you tell me best way to get programmatically all existent NFT collections on TON blockchain?

Whitey: Is there this way or it's not possible? (reply to 71140)

Ton: Hello, anyone knows how to solve this problem about ConnectUI  NotSupportedError: Failed to execute 'define' on 'CustomElementRegistry': the name "tc-root" has already been used with this registry

User<7123272744>: You can use Ton API to get all NFTs (reply to 71140)

Binaplexus1: Hi Please how can I develop my dex under ton Blockchain

Li: I think for that first you need to develop smart contract based on your dex architecture and then add liquidity and swap tokens something like that. (reply to 71146)

_chocolate.py: save address

soleil: Hello, another perhaps simple question. Where can you check which wallets have between 5000 and 5200 not or other tokens? Or, for example, exactly 6237? Is there a ready code for this?

_chocolate.py: can i save address to hashmap ?

Александр: Do you mean if it's possible to use an address as a key in a dictionary? In that case, you can try something like this:  https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L25 (reply to 71151)

Kurian: Hello Everyone I'd like to introduce 0xMAHa- a Telegram Mini App hackathon     Why are we doing this?    It's quite simple- We're quite excited about the possibilities and want YOU in on this!      🛠️ Here's how it works:   - Head to our website 0xmaha.com to register or find us on Dorahacks - Check out the website for all the open tracks.   - Pick a track of your choice and start building!   - Last date to submit your projects is- 30th June.   - Best projects will be chosen and announced on July 6th.           💰💰 We have a prize pool of $22,000 and we are looking for the best TG mini apps to distribute this amongst!      Let's get building folks! 🛠️🛠️🔥🔥

Александр: Just copy the code from any DEX and claim you wrote it yourself. Everyone does it.  https://github.com/ston-fi/dex-core (reply to 71146)

Whitey: Where I can read about some examples? (reply to 71145)

Александр: Try this one: https://tonapi.io/api-v2 (reply to 71159)

kevin: https://anton.tools/api/v0/accounts?interface=nft_collection&latest=true (reply to 71140)

kevin: DM pls (reply to 71065)

Timothy Ram.: Found a bug both in android and ios clients. Who I can contact with for solving the issue?

TON Bounty Bridge: ​Develop SDK Libraries for Toncenter REST Endpoints (Rust and TypeScript)  🏷 Developer Tool  Summary:SDK Libraries for Rust and TypeScript for Toncenter REST endpoints.  Rewards: • SBT Bounty Reward • 1000 USD in TON (500 USD for each SDK: TypeScript and Rust)  Created by liketurbo

Hakiem: Hi guys, if i ChangeOwner of my jetton master to EQD__________________________________________0vo, i have revoked ownership?

C:   type Metadata = {     name: string;     description: string;     symbol: string     decimals: number     image : string };  // Function to convert Metadata to Cell function metadataToCell(metadata: Metadata): Cell {     return beginCell()         .storeUint(metadata.name.length, 32) // Store name length with 32 bits         .storeStringTail(metadata.name) // Store name         .storeUint(metadata.description.length, 32) // Store description length with 32 bits         .storeStringTail(metadata.description) // Store description         .storeUint(metadata.symbol.length, 8) // Store symbol length with 8 bits         .storeStringTail(metadata.symbol) // Store symbol         .storeUint(metadata.decimals, 8) // Store decimals with 8 bits         .storeUint(metadata.image.length, 32) // Store image length with 32 bits         .storeStringTail(metadata.image) // Store image     .endCell(); } Is it correct for me to convert metadata to Cell code like this

C: export type MinterConfig = {     adminAddress: Address;     content:Cell; //is me add     jettonWalletCode: Cell; };  export function minterConfigToCell(config: MinterConfig): Cell {     return beginCell()         .storeCoins(0)         .storeAddress(config.adminAddress)         // .storeUint(0, 2) //is me delete         .storeRef(config.content) //is me add         .storeRef(config.jettonWalletCode)     .endCell(); } My Jetton no longer displays metadata, or it doesn't recognize me as Jetton. I only added this part, and before that, it had no metadata. Do any friends know? My code comes from https://github.com/TonDevStudy/sandbox-fees-sendmodes/tree/sandbox-chapter/sandbox-testing

feng: How to get the ton wallet address created in the last 5 days?

Rohit: How to switch testnet in tonkeeper wallet.? After clicking 5 times it show this but earlier there is option to switch testnet and mainnet.

Dmitry | backend4you.ton: Enable dev mode, then return to main screen and add new account - you’ll see testnet option there (reply to 71180)

Rohit: I have already existing testnet account... Then how to get that account.? (reply to 71181)

Dmitry | backend4you.ton: Same way as existing mainnet (reply to 71182)

Rohit: Ok thanks 🙏 (reply to 71183)

O: Guys, please help understand how jetton works and what to specify for transaction (testnet) My jetton master contract here: kQB8j8y0XGAtj5JyawkiajN9LscnFdjSOidz1UoMeTJgPqjj Address1(owner) - 0QCfF1wlJPy7U8WhGcuVHAeT6kMP3c6fz3oa4oqQOEHvDL1- Address2(user) - 0QDH30Hrh_cYoMHaUFrZP8U_qUpSzx98BHDNxVFGRmHmNn71 I would like to send 10 jettons from user to owner using @tonconnect/ui-react using documentation Help me figure out jettonWalletContract, Wallet_DST, Wallet_SRC ? 🙏  const jettonWalletContract = ''; const Wallet_DST = ''; const Wallet_SRC = '';  const body = beginCell() .storeUint(0xf8a7ea5, 32)                 // jetton transfer op code .storeUint(0, 64)                         // query_id:uint64 .storeCoins(1000000)                      // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default) .storeAddress(Address.parse(Wallet_DST))  // destination:MsgAddress .storeAddress(Address.parse(Wallet_SRC))  // response_destination:MsgAddress .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell) .storeCoins(toNano(0.05))                 // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message .storeUint(0,1)                           // forward_payload:(Either Cell ^Cell) .endCell();

O: my understanding is next  const jettonWalletContract = 'kQBXK0Eh2LiX_qBaZc_NfVkPgI93grqcXtdGj1RAHQ9NT8-f'; - this is a jetton wallet (Address2) const Wallet_DST = '0QCfF1wlJPy7U8WhGcuVHAeT6kMP3c6fz3oa4oqQOEHvDL1-'; const Wallet_SRC = '0QDH30Hrh_cYoMHaUFrZP8U_qUpSzx98BHDNxVFGRmHmNn71';   But the error example

Dmitry | backend4you.ton: How Jetton works Check https://t.me/tondev_eng/34329 (reply to 71187)

O: Thanks, that flow I already understand, now I'm trying to send via @tonconnect/ui-react jettons from JU to JA(who is also JU, right?) So I need to use JUW as jettonWalletAddress and set JU to wallet_dst ? (reply to 71192)

Dmitry | backend4you.ton: You should send msg to your JUW, but all addresses inside body - JU (reply to 71193)

O: Here is my JUW - https://testnet.tonviewer.com/kQBXK0Eh2LiX_qBaZc_NfVkPgI93grqcXtdGj1RAHQ9NT8-f  My JU - 0QDH30Hrh_cYoMHaUFrZP8U_qUpSzx98BHDNxVFGRmHmNn71 Receiver JU - 0QCfF1wlJPy7U8WhGcuVHAeT6kMP3c6fz3oa4oqQOEHvDL1-   const jettonWalletContract = 'kQBXK0Eh2LiX_qBaZc_NfVkPgI93grqcXtdGj1RAHQ9NT8-f'; const Wallet_DST = '0QCfF1wlJPy7U8WhGcuVHAeT6kMP3c6fz3oa4oqQOEHvDL1-'; const Wallet_SRC = '0QDH30Hrh_cYoMHaUFrZP8U_qUpSzx98BHDNxVFGRmHmNn71';    const body = beginCell() .storeUint(0xf8a7ea5, 32)                 .storeUint(0, 64)                         .storeCoins(toNano(10))                   .storeAddress(Address.parse(Wallet_DST))  .storeAddress(Address.parse(Wallet_SRC))  .storeUint(0, 1)                          .storeCoins(toNano(0.05))                 .storeUint(0,1)                           .endCell();          const response = await tonConnectUI.sendTransaction({         validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec         messages: [           {             address: jettonWalletContract, // sender jetton wallet             amount: toNano(0.05).toString(), // for commission fees, excess will be returned             payload: body.toBoc().toString("base64") // payload with jetton transfer body           }         ]       });  Result of the transaction is here. https://testnet.tonviewer.com/transaction/4d58eaca81253ccd46eb555898e057dc041d1c62cf714e7fd62cf4194988589b  No clue, wtf is going on (reply to 71194)

Silicon: How can I earn from ton coin

O: thanks, it works the error was here .storeCoins(toNano(0.05))  When I changed to   .storeCoins(1)  works as expected.. (reply to 71194)

O: Do you have information about the cells ?  Honestly its the most confusing part here On high level  +- understand but need to practice how to properly build cells (reply to 71194)

Stack Merth: This user made a bot called TonSwapsRobot and is sending scam requests that sweep wallets to unsuspecting users   ⚠️⚠️⚠️⚠️

PZ: i am trying to check how many notcoins in the wallet via ton blockchain (reply to 70943)

Think: Wow you need a security bot  I can see some flaws shall we build one

Think: We build one for the fire brigade

Think: Hi has the design competition finished for uk

C: i have a question  exit code 65535 is error?

User<7123272744>: Often you can see the exit code 0xffff (65535 in decimal form). This usually means that the received opcode is unknown to the contract. When writing contracts, this code is set by the developer himself. (reply to 71214)

C: This is what the documentation says, but I don’t quite understand it.

C: Is it because I set an unknown opcode that this result occurs? So he wasn't a mistake, was he?

&rey: Who needs, you mean? TON Blockchain already has one. (reply to 71209)

Cake: Why can't TON Connect demo pull up @wallet wallet on demo-dapp-with-react-ui?

Cake: Can I directly connect to the @wallet in telegram?

Think: I'm looking for the contest in England

&rey: Probably no. (reply to 71224)

Cake: why? It's need apply? (reply to 71231)

&rey: Well, in @wallet Telegram (or, generally, backend) manages the keypair, not user, so they don't support authenticating users via TON Connect.  Additionally, transactions are sent from central wallet IIRC, which in most cases is not what developer of a dApp intends. So your users should not use @wallet. (reply to 71232)

Cake: What should I do? demo-dapp-with-react-ui demo the first big button is connect @wallet

Cake: But it didn’t working

Edward: Hello,   If I would like to send TON from one wallet to another, programmatically, could anyone point me in the right direction / idea of how to achieve this?   Thanks!

User<7123272744>: You deploy a new smart contract and deposit your TON to it. When you want to send your Ton to another, you send it from the contract to them.  I already have this code. If you want to buy it, let me know asap (reply to 71240)

&rey: Btw, does your script handle both possible modes of failure? (reply to 71241)

musashi: why we need a middle smart contract? the wallet is already a contract =)

&rey: This is the basic script handling 0/2 failure modes. from pytoniq import LiteBalancer, WalletV4R2 import asyncio  mnemonics = []  async def main():      provider = LiteBalancer.from_mainnet_config(1)     await provider.start_up()      wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)      transfer = {         "destination": "UQC25k6lIqOL6Zut4OWKpLNDKmlDdXiRe02IO0yAAZ_ViKQR",    # please remember about bounceable flags         "amount":      int(10**9 * 0.05),              # amount sent, in nanoTON         "body":        "wdwwdwddwdwqwd",       # may contain a cell; see next examples     }      await wallet.transfer(**transfer)     await client.close_all()  asyncio.run(main()) (reply to 71240)

Edward: Thanks for the information. Is there a TON SDK to help with this? (reply to 71241)

Edward: Awesome. Is this possible with JavaScript / TS? Not so fluent with python! ☺️ (reply to 71244)

musashi: yes, try @ton/ton package (reply to 71247)

&rey: There is sample code! https://docs.ton.org/develop/dapps/cookbook#how-to-transfer-ton-how-to-send-a-text-message-to-other-wallet It handles zero of two failure cases, as well, but lacks functionality which would allow to handle them correctly. (reply to 71247)

Edward: Thanks a bunch guys!

Emmanella: You're welcome! (reply to 71250)

Nxrix: utils.str2cell = (str, cell) => {   const bytes = Math.floor(cell.bits.getFreeBits() / 8);   const chars = Math.floor(bytes);   if(chars < str.length) {     const substring = str.substring(0, chars);     cell.bits.writeString(substring);     const newCell = utils.str2cell(str.substring(chars), new TonWeb.boc.Cell());     cell.refs.push(newCell);   } else {     cell.bits.writeString(str);   }   return cell; } how could I do that for 16 bit strings?

&rey: Doesn't it work correctly natively? (reply to 71252)

Nxrix: no it goes into bitstring overflow error (reply to 71258)

Nxrix: also why dton is showing nothing for the address txs Is it because the address has been deployed today?

&rey: Page 1 might contain txs? (reply to 71261)

Nxrix: no it starts from 0 I tested with another address (reply to 71262)

_chocolate.py: how to write wrapper for function (slice) get_info_by_address(slice address) method_id {}

_chocolate.py: with params is a slice

𝕖𝕊𝕒𝕓𝕚𝕥: I have a dumb question, I received a (unverified according to Tonkeeper) Jetton worth some $ out of the blue. Is it possible to get my wallet drained if I try and sell it in a legit dex(stonfi dedust)???

luca: I use tonConnectUI.sendtransaction to send ton coin.

_chocolate.py: how to write test to this function

_chocolate.py: with params is owner_address

Nimet: UQAzVtLlE2YERHvhRdmmXFYTBEgfGxpOPF5eUNLHgXLIeCJI

&rey: Please look carefully at TON amount that is sent to transfer the jetton, and at TON amount you'll obtain from the swap (NOT the price!) NFTs and other jettons on your wallet will be safe certainly. (reply to 71278)

Nxrix: Any other api like dton allowing to get 16 by 16 txs? (reply to 71262)

Владимир Гром 🦍: Hey! I have a question about highload wallets.  I want to receive many deposits to my highload wallet. Do I understand correctly that workflow must be something like this:  1) On the frontend user connects his wallet using TonConnect 2) Frontend prepares information about upcoming TON message, sends it do backend 3) Backend somehow signs it using secret key, and sends signed message back to frontend 4) On the frontend I just do sendTransfer of the signed message received from backend  Is it correct? Does anyone know where I can find working example of such workflow?

Александр: Could you clarify, when you say "receive," do you mean "получать" or "отправлять"? (reply to 71325)

Владимир Гром 🦍: "получать"  I repeated my question in russian speaking chat (reply to 71328)

Александр: Then just publish your wallet address, and anyone can send you coins. You don't need a backend for this. To receive transfers, you don't need a highload wallet; it's needed for sending a large number of transfers. (reply to 71329)

Владимир Гром 🦍: I see. People in Russian speaking chat say the same (reply to 71330)

Nxrix: not png but I did something similar and made something using it (reply to 69027)

Nxrix: I made a gallery that is fully based on that 💀😂

Freed: 💀 (reply to 71368)

Dylan: can anyone take a look at this. and help me figure out why it seems to be failing to send the jetton transfers. seems like it maybe has something to do with forward_payload however i havent been able to find anything that points me in the right direction. https://testnet.tonviewer.com/transaction/b1bdcabe98195870feee3f96739c9f96a5d698031f7a45851229532a3df3e77d

Dylan: also curious if anyone knows why its showing up as a StonFi Swap even though its a custom swap contract with opcode being a crc32 of "swap".

Александр: Not enough gas to process the transaction because the forward_fee is zero.  Exit code 709: https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/contracts/jetton-wallet.fc#L88 (reply to 71379)

Александр: Because Ston-Fi were the first to use this op-code in their smart contract. 😀  https://github.com/ston-fi/dex-core/blob/6ab5b1cb3ddb6a37a070f980bae84acbb0197814/contracts/router/op.func#L4C7-L4C11 (reply to 71380)

Dylan: i saw that. however when i adjusted the gas to be sent as forward_fee i continued to receive errors. its also passing all blueprint testing. any ideas where i might need to look? would it be in the inital external message or the contracts jetton tranfer message

— 2024-06-16 —

Александр: > its a custom swap contract   Sorry, it's the weekend, so all the psychics who can read code telepathically are off duty. 🙂  I think there’s simply not enough gas. Try increasing the value in your smart contract. (reply to 71383)

Dylan: hahaha. wasn't expecting any quick fixes more just some confirmation that i was looking in the right area. which you provided. thank you.

Александр: Check the value set in your smart contract. The message received by the Jetton wallet has a value of 0.039275200 TON. As far as I remember, you need at least 0.05 + forward_ton_amount. (reply to 71386)

Dylan: these are the current transactions im getting through blueprint.

Khang Pham: guys correct me the syntax please var dict persistent int256 user_coins; var dict persistent int256 user_spins;

O(log(n)): It's possible to connect my miniapp to my users' wallet and allow them to send TON, USDT or bitcoin being in my miniapp?

O(log(n)): If yes, pls how to start?

&rey: FunC: (cell user_coins, cell user_spins) = (..., ...); By the way, you shouldn't store all users in single contract unless you're certain that there will be less than thousand of them, and you don't have automatic persistence, you must store the parameters in a cell that gets set_data-ed (and correspondingly load them). (reply to 71405)

Step: anybody know how to fix this error in full node?

TON Bounty Bridge: ​Sumanlimbu52  🏷 Developer Tool  Summary:HappyOrHappy  Created by sumanlimbu52

Roman: Hi! Can you please elaborate on that. Why storing more 1k may be a problem? Btw I stored 1.5K and it worked... What problems should I expect to happen? (reply to 71410)

&rey: a. Height of tree increases as you store more users, so fees on cell creation increase as well. (They are main portion of the fees, IIRC) b. Each entry in dictionary costs two cells in contract storage. When you reach 65536 cells, contract will simply fail to update because of the storage limit. (reply to 71421)

Roman: So ~30K items in dict will be OK ? (reply to 71422)

Roman: Thanks!  There is another thing that bothering me a bit. I use an address as key in dict. It works.. for now. Address  get from sender address of incoming int message. Address is 267 bit long afaik. I’m not sure is key size in dictionary limited by size or not. I saw they use hash+workchain (256+8=264bit) as dict key in wallet_v4. I’m wondering could be there any problems in future (I mean using full address as a key)… (reply to 71422)

Behrang: It won't be a problem. However, to optimize storage, remove as many bits as possible from the key part. For example, if all addresses are always on basic work chain, then you may be able to store addresses using 256 bits, by storing only the hash part. (reply to 71426)

Artem: Same problem. Did you solve it? (reply to 69008)

&rey: Have you searched in the very this chat? (reply to 71439)

musashi: I think we should have something like FAQ for the chat haha (reply to 71450)

&rey: Unfortunately, those newly coming in the chat only to ask a question wouldn't know to look there. Likely. (reply to 71451)

دی دی پرایم: Hi. There is a TON DNS Domain I want to purchase which expired long time ago but not in sale nor auction state.

&rey: Have you searched through the chat? I believe there was a template for payment link which would release domain for auction. (reply to 71457)

دی دی پرایم: I can't find anything can you help me pls (reply to 71458)

Nxrix: is there a limit for number of cells connected to one cell or the comment length?

Nxrix: I still haven't figured out how to fix problems with utf 16 strings in comment cells

&rey: 511 cells in depth maximum. (reply to 71469)

Think: How can I move from coin base to ton wallet

User<6242359642>: Send your coins to a no-custo wallet  create a Tonkeeper wallet  Bridge ur fund to TON (reply to 71474)

Nxrix: Just frontend? (reply to 71477)

Big Chiano: check dm (reply to 71477)

发财: Dm me (reply to 71477)

Vlad: Hello guys⚠️  Important info for all programmers tone, perhaps - we need to solve the problem‼️  Bugs have become more frequent when launching the tapps bot after updating TG iOS to the latest!!!  This only happens with TG iOS on different devices, but on the web version of Telegram webA, not a single crash has occurred.  Is there a reason to worry about future updates from Apple, and can they screw up the program to the point that we will have to mint browser windows on the desktop❓

Nxrix: I can do it (reply to 71480)

MEW: Does fwd_fee include action_fee?

MEW: In this picture, Inbound Value - Gas fee - Storage fee - End balance = Outbound Value1 + Outbound Value2 (reply to 71493)

MEW: The white paper mentions that after the Compute Phase is completed, the actions stored in the action list in C5 during the Compute Phase will be executed, which incurs costs.   Is this fee included in the forward fee?

MEW: 👁

MEW: help me, boss

MEW: Total fee = Gas fee + Storage fee + Action fee

MEW: I am doing some mev work and I want to optimize gas consumption to the extreme

MEW: 🥸

C: Hello guys

C: I don't think my own Jetton liquidity ratio is right. Isn't it 1:1 in ston fi? I added 1000_000_Jetton: 0.000_001Ton for my Jetton that never added liquidity, but when I swap it the ratio is 0.000_001Ton: 0.0025_273_13Jetton? Why is that?

&rey: Is there any particular reason you want that domain, by the way? Just curious. (reply to 71457)

MEW: boss, fwd_fee include action_fee, am i right? (reply to 71508)

&rey: I don't know which fees include what, as I commonly don't use those fields and instead look on balance changes. (reply to 71513)

MEW: thank you, boss

&rey: Please try ton://transfer/EQA3PDvmgwwrVgae7Ws_-HhmUcozx3O6TdDimJH90yrlLdSs?bin=te6ccsEBAQEADgAAABhO0UtlAAAAAAAAAACvkFQ4&amount=5000000000. Address can be obtained entering <domain>.ton.resolve-contract.ton in an explorer. Amount is based on current price for a same-length domain. Binary payload is always same. (reply to 71515)

&rey: There most definitely is. Learn how smart contracts are created, then you can find out where to send the message requesting auction release + what the payload is. (reply to 71520)

Nxrix: Can I renew my domains for 10 years?

User<5306174933>: Yes (reply to 71522)

NNAMDI: Okay (reply to 71524)

Howard: so many... spam

User<5306174933>: Alot (reply to 71529)

User<5306174933>: Please find an admin to remove all this

Nxrix: I wish I was admin 😆 (reply to 71529)

Nxrix: Every time I take a look at the chat there is someone names Notcoin

Александр: Did you try it? 🤔

&rey: Please take a note that their messages are not standing for long. It is a questionable path to go blocking people based on nicknames immediately (though if they send scam in DM then report so by all means!) (reply to 71533)

mordecai: Nothing to do

Behrang: You have to renew it every year. (reply to 71522)

Gyorgy: Spam and scammers on all channels. As community members all we can do to report them. This is one of the most peaceful channel of all tbh. Just devs chatting 🙂 (reply to 71529)

🦴majoson: did doc website can open?

Roman: docs.ton.org (reply to 71574)

🦴majoson: tks

🦴majoson: can dev miniprogram by vue？

NPA120: yup, absolutely possible (reply to 71579)

Chris: Hello devs,   I am a crypto marketer and KOLs manager. We are recruiting a team of experienced devs for a ton ecosystem game (like tapswap, hamster and notcoin) If you are working on any existing projects or want to work with us from scratch we offer a great co-working space and environment with good monetary value for freelancers or payscale devs.   Budget is good kindly let me know if you are interested by sending a CV and LinkedIn (if available)

ຮꫀթí: Hello guys, How can send a jetton like usdt and ton , together ? In js with @ton/ton, Please help or send an example

&rey: TON? Pass it within forward amount. They will go truly together. (reply to 71594)

Maxey: Hi, I'm currently using ton-connect-ui for my frontend, but every time I click to confirm a transaction on TON Keeper and return to the app, the page automatically refreshes.   Does anyone know why this issue is happening? I need the page to not refresh so I can continue with subsequent operations.

mordecai: How do we spread the good new of tons to African developers

Амир: Tell your friends and colleagues about ton :) (reply to 71605)

User<6779439263>: I have much experience in building blockchain projects on EVM networks, solana, ton and cardano. Feel free to reach out me if you need one.

Амир: I guess this happens bcs of some reactive variable changes its state (reply to 71604)

Dylan: does anyone know why transactions would be succeeding in blueprint but failing after being deployed on testnet or mainnet? the tokens are moving from jetton-wallet A to jetton-wallet B in blueprint as expected but they fail on sendtoken call after deploying.  i've attached the code that sends the message if that helps at all. any ideas? (reply to 71388)

Амир: exit code? (reply to 71622)

— 2024-06-17 —

TON Bounty Bridge: ​ارتقا بیشتر  🏷 Developer Tool  Summary:پاداش بیشتر برای فعالیت بیشتر  Rewards: • 1ton  Created by Vahidkarina

TON Bounty Bridge: ​رابط کاربری راحت تر  🏷 Resource  Summary:کم کردن محدودیت کشور ها  Created by Vahidkarina

Paul: too hard to calculate the right jetton wallet address in smart contract. do you send your own jetton token? (reply to 71622)

Dylan: Yes. I have the init data from code to create the address and it seems to work on blueprint. (reply to 71639)

Paul: In failed message, have exit code. Could you share failed message transsaction? This is my code to send any jetton token in sc : var msg_body = begin_cell()             .store_uint(op::transfer(), 32)             .store_uint(0, 64)             .store_coins(jetton_amount)             .store_slice(buyer) ;; destination             .store_slice(buyer) ;;response_destination             .store_uint(0, 1)             .store_coins(const::min_tons_for_storage()) ;;forward_payload             .store_uint(0, 1)             .end_cell();             var msg = begin_cell()                 .store_uint(0x18, 6)                 .store_slice(ctx_wallet_token_address)                 .store_coins(const::min_tons_for_storage())                 .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)                 .store_ref(msg_body);             send_raw_message(msg.end_cell(), 64); (reply to 71640)

User<7037859753>: Hi guys anyone have source like hamster notcoin any thing like this

Dylan: Exit code is 709. https://testnet.tonviewer.com/transaction/b1bdcabe98195870feee3f96739c9f96a5d698031f7a45851229532a3df3e77d (reply to 71644)

Paul: 709 is your transsaction is not enough fees. Increase small amount in msg_value when we call to jetton wallet

发财: dm me pls (reply to 71645)

User<7037859753>: Check dm pls (reply to 71650)

User<7311948310>: Pls DM me (reply to 71588)

Triệu Hồng: Hello everyone, I'm a developer and learning about Ton Network. I have a mintToken contract written in Tact language and have deployed it. Now how can I call and use that contract on the frontend?

Triệu Hồng: It's like I already have that smart contract, I want to use the deployed contract address to call the contract and use it in the front end

Zccen: Hello guys, I use @tonconnect/sdk create one pay service like 'Telegram Bot JS'， But this error often occurs: /home/ubuntu/tma/server/payserver/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:408                 throw new TonConnectError(Aborted after attempts ${i});                       ^  TonConnectError: [TON_CONNECT_SDK_ERROR] TonConnectError Aborted after attempts 1     at /home/ubuntu/tma/server/payserver/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:408:23     at Generator.next (<anonymous>)     at fulfilled (/home/ubuntu/tma/server/payserver/node_modules/@tonconnect/sdk/lib/cjs/index.cjs:39:58)  please help me, thanks!

Quillen: anyone know how the op codes were genarated? i've followed this document (https://docs.ton.org/develop/data-formats/crc32) but the result is different with the op-codes in staking contract by TON foundation https://github.com/ton-blockchain/liquid-staking-contract/blob/main/contracts/op-codes.func#L23

Triệu Hồng: help me pls (reply to 71661)

Baldwin: https://tonhelloworld.com/03-client check it (reply to 71669)

Prashant Tiwari: Hey everyone,  Can  you let me know the best frontend technologies for creating a TON blockchain game?  Thanks!

Triệu Hồng: cảm ơn  nhiều nha ní (reply to 71671)

Mohammad: Hi everyone,  Is anyone familiar with the xssnick/tonutils-go package? I used my own wallet's seed to connect to blockchain but when I try to get balance it always returned zero. So, I tried to check if the wallet address is correct but the w.WalletAddress() returns a different value than my actual wallet.  I used the example wallet.V3 to create my wallet from seed, does anyone know how to fix it?

Think: It seems you need different wallets to do different things ie web 3  I'm having the same problem

Mohammad: I gave my wallet address to tonviewer and saw the correct version. Fixed the problem. (reply to 71684)

Veritas: Chris, need an investor ? (reply to 71588)

_chocolate.py: how can i pass address to TupleItemSlice

Think: How can I add coinbase to receive my airdrops,,and connect wallets for games

Think: Can I enter the design competition  My uncle was in hospital I had a load of stress

Step: ??? (reply to 71415)

Nerses: to: sender(),                     bounce: true,                     value: ctx.value,                     mode: 0                     });         }            self.contracts.del(msg.data.__hashlock);         self.contractLength -=1;       } in this code which order will be executed the code ?

Pete: is this an official NOTCOIN bot does anyone know?

Nerses: will first transaction be done ande then remaining part or transaction is always done in the end ? (reply to 71715)

Adarsh: Looking for frontend developers to join our team

Habib: Is this real or a scam hack? (reply to 71723)

Dr. Awesome Doge: I want to make sure of a few things 1. Is your host a fixed IP? 2. Is the IP address written in your config.json file correct? 3. Does your host have enough memory? 4. Does your host have enough hard disk? 5. Does your firewall have the validator port opened? (reply to 71415)

P4alpha: Gm can anyone here help with some details about stonfi and how to create and add LP?

Nerses: how can i 'force' compiler to do certain line of the code in the end of all computations ?

John: ☕️ Dear Partners,  We are excited to invite you to join us for our "TON Summer Airdrop 2024" event.  Introduction: The "TON Summer Airdrop 2024" is a co-branded campaign initiated by England FanToken, in collaboration with TonFish. This initiative aims to bring together top projects from various industries to participate, allowing users to enjoy an airdrop feast and celebrate the launch of England FanToken project token airdrops. The campaign is designed to facilitate traffic interaction and rapid growth for all participating projects. We look forward to expanding our product line and services in the future.  Event Details: - Time: June 22-24 - Host: TonFish - Co-host: England FanToken  Highlights: 1. Expected participation from over 10~30 projects 2. Promotion by over 10 KOLs 3. Estimated participation of more than 200k users from around the world, including but not limited to Europe, America, the Middle East, Southeast Asia, and Africa 4. Mega Space in X   Support from TonFish and England FanToken: 1. $10,000 worth of $ENG tokens 2. 2,000 USDT 3. 3 Deleted Ghost Club NFTs with a floor price of 200+ TON  Participating Projects Provide: 1. One specified horizontal banner, avatar, name, and description 2. Ability to set up 3 tasks: Follow Twitter, repost a specific post, join Telegram Channel/ Join Ton's project bot 3. Provision of $250 worth of token rewards and $100 usdt  We look forward to your participation and to making this joint event a great success together!  Host: TonFish  Co-Host: England FanToken  Special Guest:  Catizens  Thank you and Happy New Week Ton Society! 💎  Join us ❤️

Sunflower: Hey, Is there any marketplace for developers where i can add my app\bot and users will be able to see it?

Nerses: is Tact  compiled or interpreted language ?

mordecai: I don't think for now (reply to 71749)

ℝ𝕒𝕒𝕊: As I remember there was few telegram bot listing which all of them is Russian soo (reply to 71749)

Sunflower: Can you find them please? (reply to 71753)

Sunflower: Or name of the bot at least

ℝ𝕒𝕒𝕊: it was site not bot (reply to 71755)

Hakiem: https://tonscan.org/jetton/EQBzSGYJMv2rmeh0yMsqzSar5IzSuX5j-fJCtWcQcJz6j_Uu  https://tonviewer.com/EQBzSGYJMv2rmeh0yMsqzSar5IzSuX5j-fJCtWcQcJz6j_Uu  why does the metadata not load?

Gyorgy: It's there. But Ipfs, depends on availability and might need time. (reply to 71757)

Stuart: how do i get the balance of an address from my test suite

P: Hi, guys! Can I access phone's periphery from the mini app? (e.g. get an access to the microphone, speaker, gyroscope, e.t.c.?)

Gyorgy: So you use any library? What language? (reply to 71766)

Stuart: Tact, sandbox (reply to 71771)

Gyorgy: Same as any other browser app, you need to ask permission for those, each time from the user. (reply to 71770)

Hakiem: Accessing the link directly works. But takes time for tonscan and tonviewer to display? (reply to 71764)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 36  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Anton: compiled (although it’s usually technically incorrect to refer to languages as compiled or interpreted)  also, how would you interpret Tact? TON blockchain can only execute TVM instructions (reply to 71750)

Aleksey: Hello, are there any mechanics similiar to Solidity events in FunC language?   I need to collect and parse contract interaction events into my DB.

Guillaume: Hello, I would like to get the transactions on a specific contract, from a block x to y, and I need to provide the transaction hash, is there an endpoint I can use the get the first transaction from a block ? or is there an easier way ?

Никита: Hello everyone, does anyone want to develop an online-offline tone game along with a cool product? Write to me

Stefan: we eager to. Ton Ton! (reply to 71798)

User<5306174933>: What do you need (reply to 71803)

&rey: Events? There are external-out messages, quite useless as you can simply listen to transactions on contract. (reply to 71788)

&rey: You should get account state corresponding to block Y, and find last transaction lt+hash there. (reply to 71789)

ℝ𝕒𝕒𝕊: https://www.tapps.center/ (reply to 71755)

Sunflower: Thanks! (reply to 71812)

Nerses: How many bits do I need to store Address (i know about storeAddress,just in case if i want to know if I have enough space) ?

&rey: Up to 511 IIRC, but generally 267. (reply to 71814)

Nerses: as you said generally is 267 exact number or upper bound ? (reply to 71815)

&rey: Sender address is currently exactly 267 bits. User-provided address can use any length in range 2-511 bits. (reply to 71816)

kevin: Ton dev available for hire, DM pls.

&rey: Please use @tonhunt. (reply to 71819)

Guillaume: I can't find the endpoint to it, I'm following the api on https://toncenter.com/api/v2/#/ is there a better one ? (reply to 71808)

دی دی پرایم: If we put a TON Domain in getgems for sale, and after a year no one buys it, is it considered expired and must go for auction?

Nxrix: is it possible to turn payload back to comment using tonweb?

Ruslan: looking for a smart contract developer dm @quialorraine

&rey: It can go for auction, yes. In particular, sale contract may even not know about that. (reply to 71824)

Nxrix: The fee for sending 2 utf-8 is equal to sending 1 utf-16?

P: tried it on IOS and looks like there is no way to do it. any docs can you refer me to? (reply to 71776)

Gyorgy: You can’t sadly they not added ton:// to Tonkeeper Pro [Desktop software] (yet).   Only tonkeeper:// available for now. Hopefully they will add in a new release.  Edit: Github pull request about this can be found here. https://github.com/tonkeeper/tonkeeper-web/pull/96 (reply to 71841)

&rey: https://app.tonkeeper.com/transfer/... instead of ton://transfer/.... Unfortunately they have removed support for latter. (reply to 71841)

mordecai: I am here (reply to 71803)

RISKY: Hi

RISKY: Hi, is token-gating possible on ton network+telegram? so for example , anyone who want to join a gated channel should have x amount of a jetton?

mordecai: Okay (reply to 71855)

Think: Hi could I know how to connect wallets to games

Амир: No, it's secret information (reply to 71857)

Guillaume: I'm calling getTransactions with a lt 47151258000001 and a matching hash, and I'm getting transactions with a lt lower than than the one from my request, for example 47148082000001 , am I missing something ?

Nerses: how can i know binary representation of address

Midnight: 🦀

TyR: hello , can someone help me , i did adding liquidity on stonfi , 92 ton and 5168 llama , and i check on liquidity its showing that failed and any option to return token , when i click it only my 92 ton return to wallet without my 5168 llama , and i did many times asking to stonfi support and they don't care about it

TyR: how to call the missing token ?

Howard: - have you check with the token contract you deployed is success or not? - Whether it's having amount of token in your balance? (reply to 71622)

Mover: Hi Devs,  I'm working with TON jetton, I've been able to successfully encode the token metadata as Cell for storage on chain But I'm kinda stuff on how to parse the Cell data and turn it back into a dictionary

ຮꫀթí: hello guys,  exist an api explorer or a way for show a ton wallet address jettons assets and nft items?

Aleksey: https://tonscan.org/ (reply to 71918)

Yashwanth: Hello TON devs,  After integrating TON smart contract Typescript wrapper to the React.js frontend,  How to get the TX confirmation ?  const tx = await mainContract?.sendCampaignCreation(sender, toNano(parseFloat(budget)), campaignconfig)  here tx is always coming undefined and its not awaiting until to get the response.  So anyone knows about it ?

Nxrix: Send message to stonfi support (reply to 71869)

Chibuikem: Okay (reply to 71936)

Nxrix: https://t.me/stonfichat (reply to 71936)

Hossein: hi,i am using toncannect using vanilla js. how can i detect when wallet connect?

Chris: DM portfolio. We have a close circle of private investors. (reply to 71694)

Hossein: ? (reply to 71962)

Frances: GM guys

Frances: i am new to ton, EVM dev and solana dev here.

Frances: comparing to funC and tact, where one you guys think would be better?

Frances: If i want to build a toy project for learning, eg build uniswap v2 in Ton using either funC or tact

Frances: Appreicate thoughts, thx!

Binaplexus1: Can you create a defi for me (reply to 71972)

Illia: tact for sure, FunC is still better for aggressive optimizations...  https://tact-by-example.org/all  + do https://github.com/ton-org/blueprint  i did fairy complex system of 3 smart contracts just under a week (i have quite a few chains of 7 actions)  it would take me at least month to do something like that in func (reply to 71972)

Frances: maybe later pal, i am a experienced defi dev, but ton is really new to me lol. I will focus on learning in the coming weeks. (reply to 71974)

Frances: Wow, thank you pal, I will start with tact then, i will check your reference out. (reply to 71976)

Tech🧑‍💻🐾: Do you need a Dev for a defi project? (reply to 71974)

Bilal: Can someone explain to me the difference of masterchainBlockShards and masterchainBlockShardState. I'm trying to build an app that queries all transactions for specific set of blocks but I noticed that I get more shards sometimes with one of those calls and vice versa?

Frances: Does any pal friends have some extra testnet ton?

Frances: I used up my quota

Gyorgy: Try again in 50 minutes 🙂

Frances: Thank you guys, 1 - 2 test ton is fine.

Frances: Thx pal, i want to continue to build instead of wait lol (reply to 71986)

Frances: Is the bot only sauce to get testnet ton?

Gyorgy: On testnet work with less ton 0.1 TON etc.. you can get 5TON/free/hour from the bot.   You usually sending from one wallet to another, you can send back from your second wallet.

Frances: ok, i met some problem while sending to my ios tonkeeper wallet

Bilal: sure I can give you mine

Bilal: whats your wallet address?

Frances: UQAO4fZOBAlB09KEgMhu748ykWlYKVXq0bmMm1hCZ4pTONm3 (reply to 71996)

Frances: Thank you guys

Frances: Thx!

User<6452070203>: Exit code: 44083 ?

Culp: Do you need a frontend & contract developer who have experience in EVM, sol, ton and cardano?

ຮꫀթí: How I can show my address like this when anyone want send to my address ?

Александр: https://dns.ton.org/about.html (reply to 72008)

ຮꫀթí: If I buy a nft ton dns domain, does it show its name instead of my wallet address? (reply to 72013)

Frances: Hi friend, your name handle is quite cool (reply to 71986)

Frances: did you bought the dns?

Frances: And how does it showned naturally as xxx.ton ?

Gyorgy: Yes, thats my name 😁 Its just a emoji status with telegram premium (reply to 72018)

Gyorgy: but bought the domain, yes

Frances: i see. Unless i bet .ton would be more popular comparing to .eth , since .eth does not have any popular socialfi dapp yet

Frances: Is the emoji tradable like NFT? (reply to 72020)

Frances: I heard rumors that the founder of telegram would love to nftize  the emojis.

Gyorgy: not yet, but soon

Frances: Ok looking forward to it, it is a good feature, but not on Ton network roadmap as i see.

Frances: They focus more on infra

Gyorgy: roadmap not updated there, couple things already ready, some coming in the next 1-2 weeks. Including final Wallet V5 with gasless transactions (with relays, already available on tonapi).

Illia: Cheeky (reply to 72034)

Gyorgy: Cheeky what? 🙂 (reply to 72036)

Illia: excited about so many new features; including W5; haven't seen that they updated roadmap 🤷‍♂️  do you know where to find some docs on extra currencies? what it will look like? (reply to 72037)

Gyorgy: I assume it was USDT and such partnerships.

Gyorgy: What already announced since, I not know much more than anyone here, I’m not official representative. Just a community member.

Illia: "Sharding Guidelines and Tools" is probably most exciting part, at least for me

Illia: if ton fees decrease a lot it can literally be like AWS but decentralized with smart contracts as services; that's sick

Gyorgy: V5 wallets already can save up 25% fees with some transfers, but already quiet fair priced. Lot of things what seems more expensive now is due smart contracts had fees hardcoded before (ton was $1-2). Since its suggested to use dynamic fee calculations and do not set 0.05 or 0.5 ton fees 🙂 Already you can send a transfer from few cents at the moment, other improvements on the way just good news to hear. Agreed.

yolo: Hi guys!  How can i saw my transactions? Python

Illia: https://github.com/yungwine/TonTools (reply to 72046)

yolo: No, just Tontools don't work now (reply to 72047)

Kotin: looking for someone who can build token contracts on Radix please let me know if you are interested in me

Hossein: i am reciving transaction boc . how can i decode that?

Illia: https://github.com/ton-core/ton-core/blob/e0ed819973daf0484dfbacd0c30a0dcfe4714f8d/src/boc/Cell.ts#L40  it's likely to be base64 boc so u can use this method on your cell  once you got your cell, you can begin_parse() in JS (reply to 72056)

Hossein: Thanks bro

Illia: Pleasure (reply to 72059)

TyR: i did many times , but they won't carr (reply to 71936)

— 2024-06-18 —

d00g: How to use test environment and wallet?

Alex: Hi! Is there any guides on FunC VPN contracts ?

C: Hello, my friend. I need your help.  Is it feasible to add liquidity in my jetton?

_chocolate.py: how can i find claim token contract example

Александр: I'm not entirely sure, but I think the simplest and quickest way to find an example of a smart contract is to use an internet search engine. For instance, Google or Bing would work perfectly.  https://www.google.com/search?q=ton+jetton+claims+smart+contract+merkle+tree  https://github.com/Gusarich/airdrop (reply to 72092)

User<7123272744>: I have built it several times. (reply to 72092)

_chocolate.py: can i ask you some questions (reply to 72094)

User<7123272744>: sure, I am here to help you (reply to 72096)

&rey: As VPN is offchain service, you need an oracle which would confirm or deny that certain amount of traffic was passed (probably just reporting the number). This warrants either a limited subscription plugin on user's wallet or money locker contract that would forward some TON based on service usage; onchain part won't differ at all between different services. (reply to 72072)

Long: how to build token on network ton?

Александр: Use the official tool:  https://minter.ton.org (reply to 72105)

Thomas: Is your contracts is public source? (reply to 62459)

Alice: Anyone know if there is any possible to include a royalty fee into the NFT Contract? I mean the royalty fee for the creater not the marktetplace party. I could see the mkt royalty fee in the sale contract but wonder where i should put the royalty fee for the creator.

Cat: Hi! Could someone please tell me what kind of scheme an external incoming message has? Unfortunately, I haven't found any relevant examples.

Frances: Hi, guys!, in ton ecosystem, is there equivalent of "subgraph" for data indexing?

&rey: Royalty is normally sent to creator. (reply to 72115)

ຮꫀթí: How can calculate estimate fee how much ton for jetton transfer?

Abdulaziz: @t1modev check dm

eqasw: 🤐

d00g: Hey everyone, can someone explain how do I check my bot (deposit and transfer ton between wallets) in a test environment?

Harry: can we get telegram ID? with any ton library?

Alice: Tysm! (reply to 72126)

Alice: Wonder how could we pay for the gas in the future in the miniapp? I read the policy and seems like we need to change all payment to STAR. Does it also apply to the gas fee?

Think: Loooooool how about kicking it (reply to 71860)

musashi: node-telegram-bot-api node package mate (reply to 72153)

Son: Hi. In ton, what would be equivalent to blockhash in bitcoin?

Andy: How accurate is the description of comment behavior in docs  ton org / develop / func / comments ?  The lexer used for the docs as well as the FunC extension for VS Code clearly do not follow said behavior!

&rey: Block ID. IIRC it is triple (root hash, file hash, seqno). (reply to 72164)

Son: Thank you. So I found this is the ton codebase ton/blob/master/tl/generate/scheme/tonlib_api.tl. As I understood, the blockId is the internal value which consists of workchain, shard and seqno but the blockIdExt is the external value that would be equivalent to the blockhash. Is that correct?   ton.blockId workchain:int32 shard:int64 seqno:int32 = internal.BlockId; ton.blockIdExt workchain:int32 shard:int64 seqno:int32 root_hash:bytes file_hash:bytes = ton.BlockIdExt; (reply to 72173)

Harry: can we convert TON to USD with library?

Elaine¹ ⁸: Yes

kevin: swap with ston.fi (reply to 72177)

Harry: i want to show it on UI, so do i need use API or something else? (reply to 72180)

D: hey , how could i can have offline ton blockchain transactions database?

Mikko: 1) You run a Ton node 2) you read transactions from the node and store in your database (reply to 72184)

Mikko: if that's your question

D: so i need to run that 128gb ram server to being a node? i want old transactions not new or realtime (reply to 72185)

David: Hi guys, I got error code 9. Under flow  when sending Jetton from smart contract to user wallet, any idea why?

&rey: Offline dump won't be of much use if you don't run a node. (Though you can really use 16/32 GB RAM server, just disconnecting the node from the network so that it doesn't use resources.) (reply to 72189)

D: have any link?

D: I just need offline database of old transactions for a mini research. But i did not find on anywhere (reply to 72198)

Alice: 😆😆😆😆

&rey: That database is probably more than 2 TB; are you sure you can't do with online requests? (reply to 72200)

D: 2tb is fine (reply to 72202)

&rey: So here it is. https://archival-dump.ton.org/. (reply to 72204)

Andy: lol wtf!  In FunC TIL whitespace before and after operators is necessary??  if (op==1) { save_data(counter+1);  ;; wrong syntax, confuses the compiler  if (op == 1) { save_data(counter + 1);  ;; compiles cleanly

&rey: Yes, because a*x+b*y is a valid variable name. (reply to 72207)

Chris: Simple one.. if running lite is there a json rpc end point available? I dont need the uber low level of liteclient

yolo: Guys, how can i get my transactions? I'm tried to do in documentations, but my address didn't see PYTHON

Gandalf: Hey guys! Please tell me how to transfer tokens on TON with Java using ton4j, I haven’t found any clear examples anywhere

Andy: Great explanation.  The LLMs can be impressive at times but GPT-4o, Gemini, DeepSeek Coder-v2 all failed to infer that from the short "Identifiers" section on docs ton org /develop/func/literals_identifiers   This is really a pretty interesting design decision of FunC, it has to have some great advantages for such a radically different design to be chosen.  A lot of people will trip on this like me, I believe. (reply to 72208)

&rey: Please try to find examples in other languages (TON Cookbook has sample script and scheme which may be helpful + TEP-74 explains everything in detail) and port them to ton4j. (reply to 72212)

jord: Hello I am an experienced crypto project director and and soon looking to launch a token creator based on TON.  I'm not here to waste time and just want to partner with a knowledgeable and trustworthy engineer. Therefore, could you outline your experience, and projects you have worked on before I consider you for the next stage. Regards  Barry.

Stuart: if i send a message to contract A, which then sends a message to contract B, but contract B is froze, does the transaction abort?

&rey: TON architecture is different. There is no single transaction working on your wallet, contract A, B, etc. (reply to 72223)

Stuart: i understand this

&rey: If contract B is uninitialized or fails to process the message (including case when contract is frozen), and message is sent in bounceable mode, then it bounces. To contract A.

Stuart: bounce means it goes back to contract A and doesnt fail

Ash: Hi  I am working on creating a jetton (Fungible Tokens) and I need to allows users to pay commission on the token that I have created. How can I do it? Can someone plz help me with this

Creator: Hi everyone! How can I get shard masterchain seqno by transaction? I got transaction array from lite client or toncenter.

Nerses: If my contract get message consisting of maps and I dont know length of it.How can I parse that data ?

&rey: udict_get_next? may be helpful. (reply to 72238)

Nerses: could you please share any material or documenatation ? (reply to 72249)

&rey: @tonhunt, please. (reply to 72251)

&rey: Doc. https://docs.ton.org/develop/func/cookbook#how-to-iterate-dictionaries. (reply to 72250)

Nerses: what will be to handele when message has more than one dictionary as these function can be used in limits of certain dicitionary.how to know where starts next one ? (reply to 72253)

Mahima Thacker: Hey guys, I am facing an error called:- Unsupported item type: tvm.stackEntrySlice     at parseStackEntry (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:284:19)     at Array.map (<anonymous>)     at parseStackItem (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:316:34)     at parseStack (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:326:20)     at TonClient.runMethod (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:45:49)      I am trying to get the function data using TonClient:-   const items = await client.runMethod(collectionAddress, 'get_market_item',[   { type: 'int', value: 0n}   ]);   console.log(items);   And here's the tat contract code:-      struct MarketItem {         index: Int;         nftContract: Address;         seller: Address;         owner : Address;         price : Int;         isListed: Bool;         sold: Bool;     }      sales: map<Int, MarketItem>;     get fun get_market_item(item_index: Int): MarketItem? {          return self.sales.get(item_index);       }  So can anyone tell me what could be the issue here?

Nerses: and also is there something similiar written in ts ? (reply to 72253)

P: What's the fun of the open league?

Jay: Hi  I am almost new to the TON network. And I am trying to transfer jetton from one wallet to another. After huge efforts I was finally able to complete the script using TONWEB (typescript).   But know I want to save the transfers and as i have gone through the docs. I understand that there wouldn't be one tx hash for the transfer. So, how do you suggest to save the transfers and anyone can help me with some examples

User<7257315147>: Hi

User<7257315147>: Can anyone help? I'd like to know how to create a Tax, Refelection Token on TON

&rey: Please try to explain the idea without keywords. Preferably in terms what messages should be sent, but algorithm of balance changes is also sufficient. (reply to 72283)

Vitor: Reflection tokens have a 'tax' on buy/sell and distributes those to hodlers. (reply to 72285)

&rey: How is "buy" different from "transfer"? (reply to 72287)

Vitor: It isn't, in practice. A more 'safe' implementation (in Ethereum) would be to only 'tax' transfers when a contract is a counterparty (or explicit tax some AMMs). I haven't seen a good implementation of this concept though. (reply to 72289)

Mikko: Much better solution for this problem is to create a AMM pool with high fee % and then direct fee to a treasury (reply to 72291)

Vitor: Agreed. (reply to 72293)

User<7257315147>: So I'm looking to create a Token with 2% tax.   1% tax is used for distributing $TON back to holders who hold a certain amount.   Then the other 1% in $TON for Team wallet and Marketing (reply to 72285)

User<7257315147>: Just an example... not much of a Dev, reason I'm asking is; I'd like to know if this would be possible with a Generated token from Jetton (reply to 72295)

Vitor: 'Jetton' is the standard, akin to 'ERC-20'. I'm not aware of any Jetton implementation with a tax. (reply to 72296)

User<7257315147>: Exactly why i asked, so if I wish to set tax how will i do it then? And can one Make changes to the Contract from Jetton generator? (reply to 72298)

Vitor: You can make changes to a Jetton contract, yes. There's no "standard" contract AFAIK. I would consider hiring a freelance dev to implement that. Or you know, post a bounty.

User<7257315147>: Alright, thank you (reply to 72300)

Rony: any admin there?

D: How can I send usdt from one wallet to another in my React.js project ? I use @tonconnect/ui-react package.

Syna: hi. if I add a slippage to my coin with a code, will people buy it? or if they set a low slippage, they may think the coin is corrupt and not buy it? (reply to 72298)

Vitor: I'm sorry, I do not understand your question. (reply to 72311)

Syna: you know redo coin. how does redo coin raise budget for marketing? normally it is necessary to get slippage. does he create his budget by selling his tokens? (reply to 72313)

Vitor: REDO doesn't have "taxes" or anything like that. (reply to 72314)

Syna: okay thanks (reply to 72315)

Elliot | $FRZ: How do they create marketing funds? (reply to 72315)

Vitor: Off topic for a dev chat. I recommend asking the REDO folks. (reply to 72317)

Syna: not specifically for redo. how do ton tokens create a budget in general? (reply to 72318)

Syna: by selling tokens?

Juned: /stat@combot

Elliot | $FRZ: Not for just redo i'm asking about lots of memecoins on ton chain (reply to 72318)

Kryptonite: Hi fellow devs, i am trying to write some custom smart contracts using blueprint sdk, for the flow i want to add jettons as well, so i lookeup to jetton smart contracts, i referred to old smart contracts that are committed to 2yrs ago , and latest stablecoin smart contract committed to official TON github repo.

Kryptonite: i have a doubt , in new stablecoin jetton smart contract , i see uri set for metadata . and in old smart contract there is just a cell reference for content.

Kryptonite: so if offchain uri is set ? will it affect the token metadata or still it will parse without any issue

Kryptonite: which approach would be better: 1. store metadata on chain as refering to old jetton_minter smart contract? 2. Store uri in content cell ? -> in this case will be explorers and wallets get my token metadata correctly ?

Thomas: hey guys, how to check a slice is empty or not? I've also tried with .slice_empty?() or .slice_data_empty?() but it doesn't work

Morphius: Hi, looking for someone who know MPC wallet generation with turnkey. com , or other mpc providers.

User<5895306823>: Hi, I can ask for 2 pieces of information:  1. If I have the Secret Seed Wallet, can I access my ton wallet?  2. How do I do a ton transfer using Python?

Nerses: is there in lib in typescript to parse the dictionaries ?

&rey: 1. Yes. 2. Approximate script, handling 0/2 failure cases but otherwise working quite well: wallet = await pytoniq.WalletContract.from_secret_key(...) await wallet.transfer(**details) (reply to 72345)

User<5895306823>: for the first question how? all wallets need seed phrase (reply to 72348)

&rey: Programming interface (pytoniq, for instance), or TonDevWallet (you can find link in this very chat). (reply to 72351)

Nerses: I think this can help you https://docs.ton.org/develop/dapps/apis/sdk#python (reply to 72351)

Rony: What's the elligble cietra to join ton partnership?

yolo: Hi how to convert from 0:584fe686fd70db305b009827589d64448b2fdbc1ecd85a3d63d805dc4f03fda4 address to  kQBYT-aG_XDbMFsAmCdYnWREiy_bwezYWj1j2AXcTwP9pAaQ address

Александр: Use this tool:  https://ton.org/address/ (reply to 72358)

yolo: and how can i do it in python? (reply to 72359)

Nerses: try to use one of these sdk s https://docs.ton.org/develop/dapps/apis/sdk#python (reply to 72361)

Son: https://github.com/toncenter/pytonlib/blob/main/pytonlib/utils/address.py probably can use this (reply to 72361)

yolo: thx (reply to 72364)

Chibuikem: some should pls answer

Александр: https://github.com/yungwine/pytoniq-core/blob/master/examples/boc/address.py (reply to 72361)

User<5895306823>: but TonDevWallet is something who i can install on my pc? (reply to 72352)

Nerses: how can I check if the message which triggered to be done transaction.Is transaction successfully done or not ?

Александр: You can check the transaction using any blockchain explorer. I recommend using https://tonviewer.com. Simply copy and paste the transaction TxID there. (reply to 72379)

Nerses: I want to do that check in level of code (reply to 72381)

TON Bounty Bridge: ​Make an App outside of Telegram for mimi lunches  🏷 Education  Summary:Cause of hanging in telegram application, we can make an application different from Telegram outside...  Created by Yasindj12

User<5895306823>: it doesn't work AttributeError: module 'pytoniq' has no attribute 'WalletContract'  I try with WalletV4R2 but it doesn't work too  AttributeError: type object 'WalletV4R2' has no attribute 'from_secret_key' (reply to 72348)

Александр: I apologize, I must have been very inattentive when reading your question. TonViewer uses the API from tonapi.io, and they have excellent documentation (https://tonapi.io/api-v2). Here is an example in Rust that you can use. I hope this answers your question. Have a good day! (reply to 72385)

Nerses: thnx a lot (reply to 72392)

Kos: Hello There are posts in Tg that some bots are being blocked cuz all the payments within mini apps must now be in Stars so maybe admins know - is connecting wallets via ton connect and topping-up in-game balances using TON/USDT will be acceptable?

Ram: Hi guys, any idea why a hash saved in a contract is cut off when retrieved?

Ram: Example: <Buffer 5e 86 3a f8 4a ae 7a 70 ...> will only be  <Buffer 5e 86 3a f8> when saved

fade: Was there any changes on the ton blockchain recently? There aren't as much shards now as it was a month ago, resulting in faster transaction processing

Jim: hi guys

Jim: how to resolve timeout error when deploy func smart contract on testnet with blueprint

Blocketize: I want to deploy contract, so I use "npx blueprint run" command. but this error.

Blocketize: root@Ubuntu-2204-jammy-amd64-base ~/work/TON_CONTRACT/my-counter # npx blueprint run Cannot find module 'node:path' Require stack: - /root/work/TON_CONTRACT/my-counter/node_modules/@tact-lang/compiler/dist/utils/filePath.js - /root/work/TON_CONTRACT/my-counter/node_modules/@tact-lang/compiler/dist/pipeline/build.js - /root/work/TON_CONTRACT/my-counter/node_modules/@tact-lang/compiler/dist/main.js - /root/work/TON_CONTRACT/my-counter/node_modules/@ton/blueprint/dist/compile/compile.js - /root/work/TON_CONTRACT/my-counter/node_modules/@ton/blueprint/dist/build.js - /root/work/TON_CONTRACT/my-counter/node_modules/@ton/blueprint/dist/cli/create.js - /root/work/TON_CONTRACT/my-counter/node_modules/@ton/blueprint/dist/cli/cli.js

Mikko: Can you check your node version with node --version command? (reply to 72405)

Blocketize: thanks

Blocketize: It's my fault

TON Bounty Bridge: ​TL-B serialization in Rust  🏷 Approved 🏷 Developer Tool  Summary:Implement a Rust library for effective and convenient TL-B (Typed Language Binary) serialization and...  Created by mitinarseny

User<5895306823>: @admin someone could help me? (reply to 72391)

Blocketize: How can I deploy contract without mobile

Aydin: Tonkeeper Pro for desktop (reply to 72427)

Blocketize: web is okay?

Dan: Hello devs! I'm trying to bring Telegram Stars to my application. I already done with payment link creation and receiving successful payments. But I can't figure out how to get balance of my bot/app and how to withdraw stars to TON.  As Durov said that it can be done via fragment. But can't see anything about stars on it

Blocketize: But I have to scan QR code

Blocketize: How can I skip this

User<835351458>: Withdrawal of stars as ton from fragment happens later.  I read a giant thread about this. (reply to 72431)

Angel: I am looking for a FunC developer who can build a token staking smart contract with $500 budget. If you can start immediately, let me know asap.

User<835351458>: What i don't understand is does that mean game/mini app devs on Telegram must accept stars as payment too?  Doesn't this kinda kill utility of toncoin? (reply to 72436)

Dan: That is, the stars are simply saved on the bot’s account, and they can be withdrawn later? (reply to 72436)

User<835351458>: Telegram will convert stars to toncoin for you to withdraw from fragment. (reply to 72440)

Dan: Cool! Thank you (reply to 72441)

Kryptonite: @pcrafter  ? (reply to 72334)

User<835351458>: Fees are scarily huge.  If someone buys $100 worth of Telegram stars from Apple or Google Play and pays your TG app in stars...  You will receive only 65% (no vat deduction) or 45% (after vat) of that amount.  Google and Apple take a 30% cut of the stars that people buy from their play stores.  TG takes another 5% cut approx.  And German apps cannot accept stars so they basically have no payment channel on Telegram.  And if you don't comply, your app or bot will be removed from Telegram.  It is a mandatory, not an optional policy.  Bots have been removed already from Telegram for not accepting stars as payment. (reply to 72441)

Blocketize: How can I deploy smart contract on Ton without QR code scan?

Mikhail: you can add wallet mnemonic to .env file and then call  blueprint run deployContract --mnemonic (reply to 72448)

Blocketize: thanks (reply to 72449)

Blocketize: How can I make mnemonic? Can you suggest a sample file of .env? (reply to 72449)

Mikhail: mnemonic is 24 words you got when you were creating a wallet  basically you .env file would look like this  WALLET_VERSION = "v4" WALLET_MNEMONIC = "word1 word2 word3 ... etc." (reply to 72452)

Blocketize: Thanks. I'll try this (reply to 72453)

Chris: Hello devs,   I am a crypto marketer and KOLs manager. We are recruiting a team of experienced devs for a ton ecosystem game (like tapswap, hamster and notcoin) If you are working on any existing projects or want to work with us from scratch we offer a great co-working space and environment with good monetary value for freelancers or payscale devs.   Budget is good kindly let me know if you are interested by sending a CV and LinkedIn (if available)  Note : We are also making good investments via our VC branch and if you have ideas or existing projects we would be glad to arrange meeting for grants/scholarship.

Fractured: Where did you find a giant thread on this? (reply to 72436)

User<835351458>: Oh I forgot but managed to find it. In the BotTalk group.  This is why Telegram had to implement stars:  Apple's policy: "If you want to unlock features or functionality within your app, (by way of example: subscriptions, in-game currencies, game levels, access to premium content, or unlocking a full version), you must use in-app purchase.Apps may not use their own mechanisms to unlock contentor functionality, such as license keys, augmented reality markers, QR codes, cryptocurrencies and cryptocurrency wallets, etc." (reply to 72457)

User<835351458>: So to comply with Apple and Google play stores' policies, Telegram had to implement the "stars" thingy so that TG may be downloaded from those stores without violating their policies. (reply to 72465)

Eoy❓: Are there any programmers here who are ready to write a simple clicker game in a web application for 200-300 dollars, write to me

KavEmmy🐾#Duck🦆🐾🦴: No (reply to 72476)

Fractured: Thnk you! My head is spinning with the Stars curveball just days before we launch. But hey that’s life 😂  Trying to figure out solutions and get over the fact that it’s annoying (reply to 72467)

KK: Hey. Does anyone know any info about TON browser release date?

&rey: I don't think it's in development, although I may be mistaken. (reply to 72483)

User<7121766667>: Hi, I got this error while deploying my first smart contract on testnet, can you tell me what is the problem and why this error is happening?

User<835351458>: Read Sections 3.1 (Payments) and 3.2 (Other Business Model Issues) in online Apple developer docs for app store guidelines.  Those sections have details for how to handle crypto payments, in-game currencies, donations, etc. (reply to 72478)

User<835351458>: Telegram has become the de facto enforcer of those guidelines and will remove mini apps and bots from Telegram if they don't comply, even if these apps and bots were never downloaded from Apple or Google app store.  This is to ensure that Telegram itself can still be downloaded from Apple and Google app stores. (reply to 72497)

— 2024-06-19 —

orlimors: anybody have a working link for where i can learn about ton connect

Doorً`: Hi I have a question   I want to define a project on the network, should the project be reviewed and evaluated by your team?

Riesling: Hello, I can’t figure out which engine to use to create a game in Telegram?

User<7140350050>: Hey guys, Is there a webhook service on TON?

D: Hi guys, I could send usdt from one wallet to another in React.js using tonConnectUI. I applied it to Notcoin as well, but it doesn't work for Notcoin. Notcoin has any special thing ?

fade: notcoin uses jetton wallet v2 but the jetton transfer message should be the same (reply to 72523)

D: @thedemons_ton , yeah, you are right, thanks. I made some mistake. I solved it

Max: I find a tx that sending messages to many wallet. How to do that?

Wukong: Hello, do anyone know if TON support Account Abstraction or not?

Blocketize: I used "@ton-community/blueprint" module.  but this error ----Cannot find module '@ton-community/blueprint' or its corresponding type declarations-----

Blocketize: Hello what is this error?

Decentralized: hey i put a tact.config.json in the root dir of the project created by blueprint but it never prints out the dump, wonder how to print it? {     "projects": [       {         "name": "SimpleCounter",         "path": "./contracts/simple_counter.tact",         "output": "./contract_output", // this dir non-existent for my setup         "options": {           "debug": true         }       }     ]   }

Anton: https://docs.tact-lang.org/ref/core-debug (reply to 72544)

Mahima Thacker: Hey guys, I am facing an error called:- Unsupported item type: tvm.stackEntrySlice     at parseStackEntry (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:284:19)     at Array.map (<anonymous>)     at parseStackItem (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:316:34)     at parseStack (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:326:20)     at TonClient.runMethod (webpack://token-smash/./node_modules/@ton/ton/dist/client/TonClient.js?:45:49)      I am trying to get the function data using TonClient:-   const items = await client.runMethod(collectionAddress, 'get_market_item',[   { type: 'int', value: 0n}   ]);   console.log(items);   And here's the tat contract code:-      struct MarketItem {         index: Int;         nftContract: Address;         seller: Address;         owner : Address;         price : Int;         isListed: Bool;         sold: Bool;     }      sales: map<Int, MarketItem>;     get fun get_market_item(item_index: Int): MarketItem? {          return self.sales.get(item_index);       }  So can anyone tell me what could be the issue here?

Decentralized: i read everything there but can't find how? still can't see the dump info, anything i missed? (reply to 72547)

Anton: sorry, wrong link, here you go: https://docs.tact-lang.org/book/debug (reply to 72549)

Anton: more precisely this https://docs.tact-lang.org/book/debug#tests-dump

Gowtham: Hi

Long: How to verify token on network ton?

Gandalf: Hello friends! Help me please, I'm using ton4j and trying to create a Tonlib instance as described in the doc: https://github.com/neodix42/ton4j/blob/main/smartcontract/jetton-example.md but I get the error: Exception in thread "main" java.lang.UnsatisfiedLinkError: Unable to load library 'tonlibjson.dylib': Process finished with exit code 1  The full error log is presented here: https://gist.github.com/morbiuslevakov/a6de44e4a5792a1bf941639a6511cd85

GENTLE_IAA CLONE: Good morning

mcmuffin: Does anyone know how I could get the transaction hash of a wallet.transfer()? For example with DeDust swap I execute           receipt = await wallet.transfer(destination=native_vault_address,  # native vault                               amount=swap_amount,                               body=swap)  I want to get the hash of this transaction.

Long: i want verify token on network ton?

Tech🧑‍💻🐾: I can help you build a token on ton chain, can you share me more details about the token (reply to 72567)

Alex: Hi, please download tonlib shared library for your OS and specify path to its location in Tonlib builder via setting pathToTonlibSharedLib (reply to 72563)

Gandalf: Thanks! Its working, but now I got this error:  Exception in thread "main" java.lang.UnsatisfiedLinkError: Error looking up function 'tonlib_client_json_create': dlsym(0x7ff909a5ea20, tonlib_client_json_create): symbol not found  at com.sun.jna.Function.<init>(Function.java:252)  at com.sun.jna.NativeLibrary.getFunction(NativeLibrary.java:600)  at com.sun.jna.NativeLibrary.getFunction(NativeLibrary.java:576)  at com.sun.jna.NativeLibrary.getFunction(NativeLibrary.java:562)  at com.sun.jna.Library$Handler.invoke(Library.java:243)  at jdk.proxy1/jdk.proxy1.$Proxy0.tonlib_client_json_create(Unknown Source)  at org.ton.java.tonlib.Tonlib$CustomTonlibBuilder.build(Tonlib.java:201)  at com.yusra.io.Main.main(Main.java:32) (reply to 72569)

Alex: tell me pls what macOS version are you running and what tonlib library you have downloaded? (reply to 72572)

Alex: usually this error means that tonlib x86-64 is used on OS with arm64 architecture, or vice versa.

Gandalf: I use mac os Ventura and I dowloaded the latest library: https://github.com/ton-blockchain/ton/releases/download/v2024.06/fift-mac-x86-64 (reply to 72574)

Alex: latest mac ventura can have both architectures, but I believe yours is on arm64 - you can check it with a sw_vers command. Also you have to download tonlib, not func-linux, try this (reply to 72575)

Gandalf: Its working, thank you very much! ❤️ (reply to 72576)

Alex: btw, instead of downloading binaries from github you can now use brew manager on mac, check this out (reply to 72577)

Daniel: Hi all, will deploying over the deployed contract cause any problems?

wassup dude▪️: someone help me to switch to testnet network in tonkeeper i've try it in browser extension version and mobile version

Tharun: hi, i have doubt i have deployed a smart contract and this is my code to transfer the ton coins    import { Address, Sender, toNano } from '@ton/core'; import { Gasless } from '../wrappers/Gasless'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const counter = provider.open(         Gasless.fromAddress(Address.parse('EQDDeEICbV4sg49ZcWEYWy_HguaNCesMzMXNOnANZaAFdwhu')),     );          await counter.send(         provider.sender(),         {             value: toNano('0.05'),         },         {             $$type: 'Transferparams',             destinationAddress: Address.parse('0QBe3eHtG4thL6HoGiBAkDOqX-MsjbpMhkCU_31W-SJM8oVn'),             amount: 100000000n,          },     );     console.log('counter.address: ', await counter.getBalance());  }  i want my another address to pay the gasfee for this transactions it is possible ?

Tharun: can anyone help me plz

Dmitry: Hello everyone!  As games on Telegram are gaining momentum, it's a good time to share about the incubation platform gdhub.io. It's a place where you can assemble teams for your ideas, find specialists, mentors, and game development expertise.  This is also an open and non-commercial community project, and you can actively participate in its development: - As a co-developer, there's still a lot to be done. For now, it's a web2 project, but one of the features will be based on tokens, specifically the distribution of shares within teams. - We also don't have an English community chat yet, so someone can create and promote it as well. Our chat (ru): @gdhub_io  #gamedev #ton_blockchain

ຮꫀթí: How can get estimate fee for transfer Jettons?

tMΞTA: hey guys! I have been trying to create a game bot, but I am not sure where I should insert the HTML5 game URL I am hosting the game in. Should it happen in the BotFather setup? I don't see a step where I can insert it

gavin: You may need a backend API to process the bot's request and return the game button. (reply to 72599)

tMΞTA: I see ill try that

Gandalf: Guys, tell me why this error happens, I'm trying to create an instance of TweetNaclFast.Signature.KeyPair: Pair pair = Mnemonic.toKeyPair(seed); TweetNaclFast.Signature.KeyPair keyPair = TweetNaclFast.Signature.keyPair_fromSecretKey(pair.getSecretKey()); JettonWallet jettonWallet = JettonWallet.builder().keyPair(keyPair).address(jettonAddress).tonlib(tonlib).build();  I get this error: Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 32 out of bounds for length 32   at com.project.io.Main.keyPair_fromSecretKey(Main.java:56)   at com.project.io.Main.main(Main.java:35)

Super Man: Hello everyone

Super Man: when run above code, I get this error

Super Man: I am using create-react-app framework for web client and @ton/core, @ton/ton packages. I would appreciate if you help me this issue.

Super Man: @ton libraries have some issues?

black: Hi

black: If anyone can write contracts, please message me privately

tMΞTA: I created a flask app, and when I click play now it just returns the HTML code of my deployment for some reason 😅 how do I display the game directly on telegram? (reply to 72600)

Ihor: Hi! We're facing a significant decreasing in the speed of TON nodes syncing (nodes simply cannot catch up on any gap, even a day, for about a week) and snapshots downloading speed (now it takes 3 days to download full snapshot against 1 day in past weeks). Have anyone encountered same problem?

Амир: No, we do not have our own nodes (reply to 72625)

Ihor: Do you know by any chance who we can contact with on this question? (reply to 72626)

Амир: Povel Durev? (reply to 72627)

Dylan: dm me (reply to 72621)

Ihor: Any node operators chat maybe? (reply to 72628)

Dmitriy: Hi! Is it true that when message processing failed, all the outgoing messages sent within this transactions are reverted?

musashi: no, only that message failed (reply to 72633)

&rey: They just do not get sent. (reply to 72633)

Dmitriy: I see, thanks.  I’m implementing the processing of transfer_notification message (when my contract’s jetton wallet got some funds from sender) and want to return the jettons back to sender if the processing failed. What’s the canonical way to inform the sender that something went wrong? Should I use the forward_payload for it and write the error message there? (reply to 72637)

musashi: the standard jetton contract code already has the onBounce method to handle this I guess (reply to 72639)

Dmitriy: I’m checking it by writing the following sandbox test scenario:  1. Send the transfer message with malformed forward_payload 2. Assert that sender’s jetton balance before == sender’s jetton balance after  But this assertion fails, and the actual sender’s balance after is less than initial balance exactly at the number of jettons sent, so it seems that it doesn’t work like this, unless I’m missing something (reply to 72640)

musashi: oh my bad, the onBounce method to handle the bounced message from internal_transfer not transfer_notification opcode

Dmitriy: Got it, thank you (reply to 72643)

musashi: btw, can you share the code with the forward_payload your implementing?

Dmitriy: Currently it’s quite a dirty draft, but I can explain what it’s supposed to do if you want (reply to 72646)

musashi: I think your goal is pretty clear

ຮꫀթí: How can get estimate fee for transfer Jettons?

Fractured: Thank you. I assume this is what we're all pretty much working with now  "3.1.3(b) Multiplatform Services: Apps that operate across multiple platforms may allow users to access content, subscriptions, or features they have acquired in your app on other platforms or your web site, including consumable items in multi-platform games, provided those items are also available as in-app purchases within the app." (reply to 72498)

&rey: This is offtopic for this chat. (reply to 72652)

KR-Wilson: Sorry

Stephan: Hi guys, please tell me, what frameworks, languages and technologies do major projects on TON work with?

Daniel: for example: https://tonviewer.com/EQDmkj65Ab_m0aZaW8IpKw4kYqIgITw_HRstYEkVQ6NIYCyW .. not coin premarket doesn't op set_code, does it mean 3k TON not widthdraw?

&rey: You should consider gas; the most common way is to use map.

Nerses: how to parse map if it is part of the message.In case of Int you know that it will be 257 bits and so can parse while in case of map it is problem. Has anyone such problem ?

Nas: Can someone help me understand how does the TON value flow works as shown attached?

ຮꫀթí: ForwardTon is for what In message payload? And if it equal 0 not problem happened?

Jay: Hello..  Any help on this.. (reply to 72276)

jo 🌙: Hi, I would like to ask what will happen to my testnet wallet in tonkeeper if I don't move the TON that I got from @testgiver_ton_bot? and how can I send it back if ever? I don't fully understand the instructions that I got to do testnet so decided not to proceed anymore.

&rey: Map? It is Maybe ^Cell, loaded with ~load_dict(). (reply to 72676)

&rey: Generally, if you don't sign any transactions, nothing will happen. (reply to 72686)

Nerses: sorry it seems i described problem not completely. I get message with api and want to parse it and that message type consists of maps.I think ~load_dict() is for FunC,I cant use it in ts (reply to 72689)

&rey: native fun (reply to 72693)

Nerses: so solution for my problem is pares it using FunC language ? (reply to 72698)

&rey: Yes. Or... doesn't Tact support putting multiple maps in a message?

Nerses: It supports.i used Tact to write smart ciontract and message type in that contract has few maps (reply to 72701)

Nerses: 1) is there way to write func code in tact    2) read data in tact from differnet file (reply to 72701)

Anton: 1) https://docs.tact-lang.org/book/functions#native-functions  2) unclear what you mean (reply to 72703)

Nerses: for example I read data with api (code written in ts) then store the data in .txt file.How i can read that data from tact file (reply to 72704)

d00g: I have a problem, when trying to connect wallet I click 'Open Wallet in Telegram' but it does not loads at all. Can someone help with that and suggest a solution?

Anton: I still don’t get what you mean, sorry  btw, more on interop with FunC: https://docs.tact-lang.org/book/import#import-func-code (reply to 72707)

Manav: Hello everyone i am transfering jettons from one wallet to another and i want the response. Of that transfer and want to know if it is successful or not is there any way to get that. ??

User<7385614905>: who needs TON Trading BOT developer dm me sniper, limit , copytrade, fast swap feature available

Nerses: sorry for bad explanation. i want to do kind of this operation in tact  const fs = require('fs');  fs.readFile('example.txt', 'utf8', (err, data) => {     if (err) {         console.error('Error reading the file:', err);         return;     }     console.log(data); }); (reply to 72710)

Kirill: Hello everyone. Please tell me how I can use the wallet number to see how long a user has an nft. Conditionally, I still have the address of the required collection. Tell me please

ຮꫀթí: A simple way is, you check last transaction wallet (reply to 72712)

Manav: Any other way this method has lot of problems? (reply to 72716)

&rey: You can make native FunC intrinsic, in which you make native Fift intrinsic, in which you read an adjacent file. Of course the read will be done offchain, during compilation. (reply to 72714)

User<6995531243>: I am proficient in building dApps, telegram mini apps & bots on EVM, Solana, TON, Bitcoin etc. Does anyone need?

&rey: Please visit @tonhunt and report back if there are no vacancies suitable for you. (reply to 72722)

Linthero: Hi! I'm a bit in loss when it comes to handling Jettons. Where can I find an example of how to handle USDt deposits/withdraws in my existing contract? And also, is it possible to get USDt on the testnet?

&rey: Please check how jettons are handled; DEX contracts are one of such examples. Testnet doesn't have USDT, but you can use arbitrary jetton instead. (reply to 72729)

Nerses: i get exit code 128 Null reference exception what can cause this ? couldnt f8ind that exit code in docs

Nerses: I think that exit code is generated by compiler as i havent added it as error message while reverting

Williams: Dear Devs , is there anyway you know how I can reach the Telegram Wallet Support . I have a fund refunded and they don’t respond for more than 20days now to credit the fund back to my wallet . There’s no live support nor anyway I tried that works. I’ll appreciate anyone who could help  The case I have is I send 3000usdt from telegram wallet to Bybit with wrong tag , Bybit acknowledged that I used wrong tag and the fund was fully refunded, but I was told only wallet support can credit the fund back to my account as it wasn’t sent with tag: Here is the Refund Txid: 5bebf7e376d3e11bbd83b2b38cf04b657abb5415ac132621e7d4f1eb4cac9267

Tech🧑‍💻🐾: Hi me (reply to 72744)

Tech🧑‍💻🐾: I hope you've contacted them already (reply to 72744)

Williams: I did , they don’t respond

wikig: Hello guys ~  Some questions here   is there any document or rules about the Telegram star ?   When will my bot or webapp have to use telegram start instead of using crypto currency directly .

Decentralized: anyone knows why this emit(TransferEvent{amount: myAmount, recipient: sender}.toCell());   throws err?

Decentralized: anyone can explain how ton actually handle deployment, is it similar to cosmos where code is upload and then separately instantiate as many times or like ethereum where each contract deployment is independent?  is there a factory model that can handle deployment of many contracts? can someone leave some fund to contract upon deployment instead of separating it to 2 different tx? is there any plan to decrease the gas fee on ton, even without many activities, the gas fee is at least 1000x more than solana or 100x more than aptos/sui...

Ophere: sorry wahe ton wanted to know

Behrang: 1- You will provide init state (that is initial code and data) and if it is not already deployed, will be deployed.   2- what are you trying to achieve?  3- yes  4- no, it's already cheap enough, and contrary to other blockchains, will not get expensive with high load and traffic. If TON price increases a lot, then validators consider decreasing fees, which happend once recently. (reply to 72788)

User<835351458>: In Telegram's Wallet tab, there is Contact Support which connects u to wallet support bot.  In future, use Ton Space (non-custodial) instead of main wallet address (custodial).  Both the custodial and non-custodial wallets can be accessed within your Telegram Wallet. They have 2 different ton addresses.  Or use Tonkeeper, a separate wallet which u access via Wallet Connect. (reply to 72744)

User<835351458>: Most of the clicker games and mini apps on TG are offchain and don't require gas.  Fot example in notcoin, you paid nothing in gas or any other fees to click within app and receive your $400 airdrop. (reply to 72788)

User<835351458>: This is why the TG apps have gone viral.  They are truly free to play as they are offchain.  And then a month later u collect your airdrop.  You can reach 1 billion users on Telegram and they can play and collect their airdrop without knowing anything about crypto or spending any gas fees. (reply to 72812)

Decentralized: trying to figure out how to use tonconnect to send a deploy tx (reply to 72810)

kevin: Hi, is there a way to identify all simpleTransfer or transfer with comment transactions, I want built some tool that can identify big amount of TON transfer .

r_os_e: yes but they are incompetent still looking.  current requirement is for a bot chat dev for what is effectively a dice game.  @healerdev took a down payment for the dapp and delivered no functional code at all just a jpeg and a lot of questions. do not hire, they are either not competent or a complete scammer. (reply to 67217)

flamespit: im in a good crypto community they have a lot of devs (reply to 72828)

r_os_e: please share (reply to 72830)

flamespit: dm me

Decentralized: is there anyway to use tonconnect in telegram bot

r_os_e: connect TON wallet to join a channel? seems suspicious (reply to 72832)

flamespit: i didnt go through those verifications when i joined

flamespit: they announced it 2 days ago for new members

flamespit: couldnt share the group with you that was in the bio of the channel

Blocketize: Hello, devs!  it's my code. export function proxyConfigToCell(config: ProxyConfig): Cell {     return beginCell().storeAddress(config.owner).endCell(); }

Blocketize: How can I get owner?

Blocketize: I'm new in ton.

Blocketize: Please help me!

— 2024-06-20 —

Blocketize: Who can help me?

Blocketize: I have to get owner address when deploy contract. But I don't know how to input address.

Morphius: hi do you know about mpc? we need help. (reply to 17249)

Morphius: dm (reply to 20939)

Blocketize: Hello, Can you help me?

^_^: Hi, This is a TON blockchain developer, I can develop the telegram bot, mini app game like notcoin and smart contract. If you are looking for a developer, can we work together?

Diamond: need developer for mini apps/telegram bot

Blocketize: Hello, I can help you (reply to 72864)

Diamond: DM me

Triệu Hồng: Hello everyone, I am new to learning about smart contracts in ton network, can you give me source code examples of contracts like pool, stake or swap? I looked for documents and source examples on github and found them not very promising, the source example written in tact would be better.

gavin: Hey, maybe you can learn this https://github.com/ston-fi/dex-core (reply to 72870)

Williams: I did contact the support there , there has not been no single response for 20days now . It’s one of the worst support I ever come across in years trading crypto (reply to 72811)

Williams: Everything is not run by Bots . No live support which makes it worse. Take for example. Bybit said only support can credit the fund refunded but support never respond

Cuong: Hi everyone, I am new to learn build something on TON. I want to build a example new token on TOn by tact. I read document abot Jetton tonken that builts by Func. Any standard for token on Ton by tact ? thank

Triệu Hồng: Is there any source example written in tact sir? (reply to 72874)

Tech🧑‍💻🐾: Still needed? If yes, I can help you! (reply to 72864)

gavin: I didn't find any examples related to Tact. I think you should be proficient in Func language. (reply to 72878)

Triệu Hồng: use library @ton (reply to 72884)

Triệu Hồng: I have a source example called contract mint and used in react, do you want to check it out? This is the most basic way to call it, because I'm also a newbie. (reply to 72884)

Quillen: I understand that the TON blockchain supports asynchronous internal messages between smart contracts, which means that some messages can fail independently of others. For example, if UserA initiates a transferToken call in my contract, the process flow is as follows: UserA --> WalletA --> MyVaultContractWallet --> MyContract receives Notification from VaultContractWallet.  The question is, what happens if the validation fails in the My Contract? The contract will have already received funds from the user. How should we handle such a case? Should we return the tokens to the users? Are there any similar contracts that handle this scenario, and how do they manage it?

r_os_e: gambling bot. also hold a TON domain trying to figure out if that is useful for a bot or an app (reply to 72850)

wikig: Cool what's your x user name so i cam check (reply to 72790)

User<5657418771>: Hello, I'm a YouTuber I've got an advertising partnership offer for your admin. Notify me when you see this.

&rey: I believe you should return funds (if there is enough TON to do so). What about similar contracts... they tend to swallow the assets, not returning and not processing them. (reply to 72892)

&rey: Please reach out to partnership@ton.org. (reply to 72901)

d00g: Can someone please help? When clicking on Connect Wallet and the user is sent to Telegram Wallet, on the wallet it freezes and does nothing.. What maybe the issue? I do have manifest file.

Ash: Hi Guys... I'm writing a jetton contract in tact. Is there any jetton project live in TON using tact language?

Thomas: I'm trying too, but I think maybe the problem is about these parameters: rndShift, rndBitNum, createdAt, subwalletId, timeOut,... (reply to 69673)

Thomas: Do you successfully run the sending script? (reply to 59465)

Thomas: with my exp, please ensure the manifest link is available (reply to 72908)

d00g: It is, 100%

d00g: Really don't know what else to do, because it is working but the wallet does not load..

Simon: thanks for asking. nope, this having troubles. (reply to 72913)

Maxey: I’ll try again today. Last time I ran it, I didn’t spend much time figuring out where the problem was. (reply to 72912)

Thomas: I coded a testing site for connecting wallet: https://ton-connect-example.vercel.app/ (reply to 72917)

Thomas: maybe can help u (reply to 72917)

d00g: I'll try doing that

Thomas: I saw you are using the similar parameters with highload wallet v3 unit test, I checked the unit test, it ran successfully but if I change the createdAt to Date.now(), I receive the same error with you (reply to 72921)

d00g: Thank you! (reply to 72925)

Triệu Hồng: Everyone please help me, I am looking for source code example for contract pool, stake and swap written in tact

Triệu Hồng: I tried searching a lot but couldn't find it :(((

d00g: Any admins? A user called Costomer Support just send me a dm and tried to hook me

d00g: Anyone else here, be careful

User<6650251888>: What he wrote? (reply to 72931)

d00g: I asked for help so he said that he can help me connect the wallet, and then asked me some questions, finally send a link to some url.

User<6650251888>: What's the link? Maybe there are instructions there? (reply to 72934)

d00g: Yeah, for sure there were instructions.. haha

d00g: So why he removed the messages when I told him that he was trying to fish me

d00g: And he should not do that

&rey: I assume the rewards are set at backend? If so, you're looking for airdrop-like contract with claim by user. There is one, https://github.com/Gusarich/airdrop. (reply to 72942)

Ash: Is there any code in tact language? It would be really helpful :)

Thomas: is there any solution with dynamic claim data, this airdrop just work with fixed merkle-tree? (reply to 72944)

Thomas: like the model: BE sign to approve claim request, user bring the signature to SC to claim

&rey: You can write it itself. Consider replay protection. Consider what contract should fulfill the claim request: jetton master, jetton wallet or an external contract.  Jetton wallet is actually one of easiest options. BE should sign claim request with user address and total amount of jettons issued to user; jetton wallet then must up-mint required amount of jettons (according to how much user has already claimed) and send custom notification about that to jetton master so that it updates total supply. (reply to 72948)

Thomas: thanks a lot, I've been thinking about this direction, appreciate so much for your confirmation (reply to 72949)

Degen: Hi

3BASE: Hello everyone,  🌟 We are 3Base, one of the Largest Telegram Apps Stores. 🛫 We are dedicated to helping developers promote their Mini APPS for free.  🚀 Publish your app on 3Base now, 🔥 and gain at least 2,0000 users for free!  🤖 Bot: @ton_3base_bot 📢 Channel: @official3basechannel  🌐 Website: https://3base.io 🐦 Twitter: https://twitter.com/3base_io  👤 Publish Support: @Ton_3Base  🚀 Exclusive Opportunity: Enjoy free top banner ad placement for a limited time! Act fast and submit your app today!

0.07: hi, i need some help currently i'm facing a honey pot that block me from selling the jetton on any DEX (Dedust, Stonfi)  the jetton address here: https://tonviewer.com/EQA6Jp0NCnltUjlylPmn0OUH5pXSSmDDVVOWZqiVyghvGmDt

0.07: how can i bypass the blacklist and make a transaction?

d00g: Does anyone here created an app with ton-connect and react next.js?

Maxey: I did it! I’ll upload my script to here later. (reply to 72927)

Thomas: cool, you're an incredible dev 🤩 (reply to 72961)

V 🍅 🐾: Previously I used gram wallet to create Ton seed phrase, after about a while I logged back into Ton wallet and couldn't find its wallet address.   EQDJnRhneMjbuYW3lPE62QjnS0joElkuotcdO5j7PhVN4Fsv  birth water siege welcome easy faith weather current edge silent general almost earn zoo defy space collect suffer section innocent rate salon remains basic

d00g: Please help me, don't care to pay. (reply to 72960)

Амир: I guess almost everyone has (reply to 72967)

d00g: what

Амир: 🤯

K.: For a React app you can use: https://www.npmjs.com/package/@tonconnect/ui-react. Haven't personally used it with NextJS, but it should work. (reply to 72960)

d00g: Yeah, that's what I am using. But there is a problem there which I cannot overcome.. 🙁

K.: You can describe the issue here, perhaps someone will help. Also try searching this chat, maybe you are not the first one 🙂 (reply to 72973)

Hybrid: Hi everyone. Please I wanted to know if I could build games using flutter and connect with TON?

d00g: Sure, the issue is when adding <TonConnectUIProvider> to layout.js (using the new app router) it crashes because it is a server component and <TonConnectUIProvider> is a client component. Loading it else where just doesn't work. Does anyone has an experience with it? (reply to 72974)

Diamond: Need TON & Telegram dev

David Goku: const result = await tonConnectUI.sendTransaction(transaction);  How to get this result in telegram webapp environment while webapp is closed to open wallet. Please help me or give me solution!

David Goku: Helpme pls (reply to 72979)

User<6650251888>: Scam, He doesn’t need any developer, he’s collecting subscribers for his channel (reply to 72978)

Diamond: If you are incapable of verifying yourself in a Telegram channel, why should I use you as a developer.

Diamond: This unnecessary statement further proved my point

artviewer: you are talking shit. (reply to 72983)

Diamond: 🤦‍♂️

artviewer: cunning fox

User<6650251888>: Did he also tell you to log in somewhere? (reply to 72989)

artviewer: nope. It's enough for me to see your screenshot. He is looking for dev but he even doesn't know which language skill he need.

User<6650251888>: It’s not that the language says that the bot doesn’t work like that and you need to join some kind of chat to look at it))) but he can’t just send the bot, there’s no link to the group (reply to 72991)

artviewer: anyway I reported his messages as spam (reply to 72993)

User<6650251888>: Me too ) (reply to 72994)

Амир: dm (reply to 72978)

User<6650251888>: He doesn't need anything, he's a scammer (reply to 72997)

Амир: I just wanted to report him ( (reply to 72998)

User<6650251888>: Ahh, great, you need to write reports on these guys (reply to 73000)

d00g: Anyone has an idea why Telegram wallet modal opens but when clicking "Open Wallet in Telegram" it loads and loads, until returns "Dapp manifest not found"? I am using React Next.js

d00g: I do have a manifest file online and it's working.

Mohammad: Hey guys 👋 How can I store social_links on-chain to add support for nft social links on getgems?

максим: Hi, how do you write something like this on tact?

kevin: Hey, I just built tool to monitor NOT and TON transfer on chain, if you need the tool DM me and I will share you the code on github

d00g: Ok for anyone who may facing the issue, I had a comma (,) after the last JSON row which causing it to have syntax error. (reply to 73002)

Ash: I have written a Jetton smart contract where I have a onlyOwner mint function where only the owner is allowed to mint tokens and I also have a public mint function where users can able to mint specific amount of tokens as per the work they have done.  Here there's a vulnerability in my code where users who have not done any tasks can also be able to claim tokens since this is a public function.  Here is the detailed flow of my application  1) Users login to my application  2) They watch my TV for certain time  3) Will be rewarded some amount of tokens as per the time they have watched  4) Users can now be able to claim the rewards by paying gas fees (This is the only place where users directly interact with the blockchain).    How can I acheive this?

Vitor: Sign something in a backend, give to the users to submit the message, check the signed payload with ecrecover. (reply to 73014)

L: I am looking for TON blockchain developers on a permanent basis. It requires knowledge of building dapps with TON Proxy, TON Sites, TON DNS, TON connect, TON storage, etc., the ability to work with TON smart contracts in the Blueprint framework, in the FunC language and writing scripts for them in Java Script/Type Script.  The salary is negotiable, message me your CV if you are interested

Paul: What is the best solutions about scan all transactions of my application? If Using ton rpc to scan transaction, i don't know the result of some internal message(when it failed). If using tonAPI, can't get the inbound message?

Амир: tonapi is the best (reply to 73021)

Paul: Yess, they will be best if they give the raw inbound message of each actions. (reply to 73022)

Амир: It gives (reply to 73023)

fade: /v2/blockchain/accounts/{address}/transactions has "raw_body" field (reply to 73023)

Anton: it’s not possible to do it exactly like this in Tact at the moment, only if you compute crc32 and hardcode into your code (possibly with comment) (reply to 73008)

RISKY: Guys Is there any tool or bot that can check user Jetton balance in telegram built-in wallet or tonkeeper?

&rey: In Tonkeeper, yes. In Telegram wallet, no, as it doesn't use blockchain as balances storage. (reply to 73037)

Stephan: Hi guys, please help me, which language and framework is the best to use for the backend with TON dapps and TON smart contracts?

<You>: Whatever you know (reply to 73041)

Raihan: hey guys im thinking of implementing your chat system and blockchain in our ecosystem

Raihan: but i got few doubts

Raihan: can anyone help me with that?

Максим: /stat@combot

Rohit: I am using receiver method in Tact ...when I console response it show undefined..how I get this response?

&rey: Well, the result isn't available at least until your tactsM contract processes the message, and that may be quite later than the request is sent. (reply to 73059)

Rohit: is there any way to get transacion hash at least? (reply to 73061)

ALena Govaleva: Hi, We are developing an application for real estate investment on the TON blockchain. Could you please advise if it is possible to request several thousand coins in the testnet for testing the application?

&rey: I recommend to use @ton/sandbox first. (reply to 73065)

&rey: No. In fact, request may be sometimes lost (that is, sender's wallet will not have any outgoing transactions, thus transaction chain will not happen at all). (reply to 73063)

Nerses: I have created contract which message has different type fields like Int , Address or Map. Is serialization of message deterministic ? I mean that in messages of the same type, fields are stored at the same bit position in each Cell.

Anton: Yes, message serialization is deterministic in Tact (reply to 73068)

Rohit: Grateful for your support! (reply to 73067)

TON Bounty Bridge: ​6219861961488110  🏷 Developer Tool  Summary:Yoones  Created by 6037701556160635

TTran: how can I auto create wallet TON using programing?

TTran: i'm trying using python to create wallet, but it has some error I cant fix

Maxey: Here is my highload-wallet-v3 scripts, you can try it. If you have any problems, feel free to discuss with me (reply to 72961)

Raihan: can i deploy my own smart contracts in ton?

&rey: Yes. Attach its StateInit to a message which would be the first for the contract. Address is deterministically derived from start code and data. (reply to 73079)

Nerses: for eexample if i have such message message Hello {     hi: Int;     hello: Address;     goodDay: map<Int,Int>; } and in serialization field hello ends at bit x will goodDay start at x+1 bit ? Or how they will be stored ?

&rey: For Tact, it is unspecified. You should check TL-B wrappers in files generated during compilation. (reply to 73083)

Development: Hello. I'm looking for a paid job, I'm new to programming, I completed a ton dev study

Nerses: If I am not mistaken you meant this export function loadHello(slice: Slice) {     let sc_0 = slice;     if (sc_0.loadUint(32) !== 2935203360) { throw Error('Invalid prefix'); }     let _hi = sc_0.loadIntBig(257);     let _hello = sc_0.loadAddress();     let _goodDay = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_0);     return { $$type: 'Hello' as const, hi: _hi, hello: _hello, goodDay: _goodDay }; } but from this code it isnt obvious how fields will be stored. (reply to 73087)

Nerses: But it is deterministic,isnt it ? (reply to 73087)

&rey: You can find export function loadHello(...)     ... sc_0.loadUint(32)     ... sc_0.loadIntBig(257)     ... sc_0.loadAddress()     ... Dictionary.load(..., sc_0) Unfortunately, different addresses may have different length in bits, so you can't precalculate specific bit offsets in general. (reply to 73090)

Nerses: so what will be the solution for parsing such message ? (reply to 73093)

&rey: You should load fields in order. Using loadHello function itself is a safe bet, for instance. (reply to 73094)

RISKY: Thanks for the answer, what I am looking for is bot like collab.land but for ton network that can verify a user holds x amount of a jetton and give the user access to a channel or group (reply to 73039)

RISKY: Thinking about building such bot but thought if it already exists, why reinvent the wheel :)

uchebnick: Hello, did I understand correctly that in order to transfer currencies, you need to deploy the wallet contract and then deploy the contract that will interact with the wallet contract?

Nerses: I tried to use loadHello to parse but encountered problem that it accepts argument of type slice while data strign is too long to be stored in slice (reply to 73095)

&rey: What does it mean, to seal? (reply to 73112)

uchebnick: Deploy

User<6981260071>: Hey how do i only allow users to access to mainnet with there wallet with tonconnect-ui/react

User<6981260071>: what should i give as value for network ? i tried "mainnet" but still acceptes tx on testnet

User<6981260071>: tried this but then it want open wallet

uchebnick: if you send money from a wallet (for example tonkeeper) to some kind of smart contract, that the wallet itself deploy a smart contract of wallet for a smart contract?

User<6981260071>: anybody able to helpt its urgent please :) (reply to 73122)

Daniel: You have to define useTonClient() hook to set up testnet or mainnet transactions (reply to 73129)

User<6981260071>: can you please help me in privat :) ? (reply to 73132)

Daniel: Check this post http://tonhelloworld.com/03-client/ (reply to 73129)

User<6981260071>: i understand the code.. But how do i implement it in my transaction ? (reply to 73134)

Technari: npx blueprint build npm error could not determine executable to run npm error A complete log of this run can be found in: /home/technari/.npm/_logs/2024-06-20T18_21_38_019Z-debug-0.log     ——- help——-                   func works, but tact has an error

Mr: gm guys - what is the official burner for ton?

Mr: is this still correct?  https://answers.ton.org/question/1574561668367650816/is-there-a-blackhole-address-on-ton-for-nft-burning

Tech🧑‍💻🐾: Still opened? If yes, I am interested! (reply to 73018)

&rey: Yes. (It's worth noting that TON and jettons can be true-burned, actually.) (reply to 73148)

Mr: sorry, what does this mean? (reply to 73152)

User<5323537699>: are there any webhooks for ton chain? to track events?

&rey: Removed from total supply, instead of simply being inaccessible. (reply to 73155)

L: yes dm me your CV please (reply to 73151)

Tech🧑‍💻🐾: Am unable to message first can you add me to your contact (reply to 73158)

&rey: Please try Tonapi. (reply to 73156)

User<6981260071>: How do I specify network on a ton transfer?

ຮꫀթí: Do you mean chain? (reply to 73174)

User<6981260071>: yes (reply to 73176)

User<6981260071>: can you help me in privat mate (reply to 73176)

ຮꫀթí: Ok (reply to 73178)

User<5323537699>: link please (reply to 73163)

&rey: https://docs.tonconsole.com/tonapi/api-v2. (reply to 73185)

Ronaldo: how write a message for SWAP?

Ronaldo: i'm able to send ton and jetton tranction, but i want to perform the swap

Luis: Hello yall

Luis: Im a developer and im creating a wallet, im using this to create a wallet from mnemonic phrase      let tonKey = await mnemonicToWalletKey(mmnicarr);     let w = WalletContractV4.create({publicKey: tonKey.publicKey, workchain: 0});     console.log(w.address.toString());  but when creating, im getting this as wallet address:  EQEdKpZlijuxZbjRXvQ4-uUffLgFbJP2oy8pQycq14sXmF1H  Is that expected? a wallet with a "-" in the middle? sometimes it does return with 1 "-" sometimes 2 "-"s and sometimes it returns me no "-", can anyone help me

Max: yes it's fine, it can also contain underscores _ address is encoded using urlsafe base64 which uses these symbols

Luis: Oh and how I can use it to search in tonscan?

Luis: Cause I’m getting this if search for it in tonscan

.: How much money do i need to launch my own jetton on ton blockchain?

Diamond: Not a lot (reply to 73208)

— 2024-06-21 —

Thomas: awesome, lmc (reply to 73077)

Super Man: Hello everybody. I'd like to build smart contract to add liquidity on the ston.fi using func. But I can't find any reference and samples. I'd like to send me sample contract to add liquidity on the ston.fi.

Anng: Hi, I am using records: map<Address, Int> to record my data, but I don't know how to loop through all addresses in this map in Tact. Please help. foreach (key, value in records) was not working.

Anng: Less than 1 TON (reply to 73208)

User<6981260071>: I try to set the network when a user have to send a tx with tonconnect/sdk   But it still allow user to send on testnet.

meomeocoj | Mike: hi guy i'm researching the best practice for tracing a chain of tx, any example ?

prometheusoo: Can the administrator help me unblock this group? I don't know why I was banned

TON Bounty Bridge: ​Jj  Created by Taner3312

Nexus: What happened to all my TON stacked. This morning I opened the app TonKeeper and all my TON stacked dissapear

Nexus: Is there any admin?

User<7311948310>: Hi everyone, Who needs a full-stack blockchain developer? We're a dev team based in VietNam with an hourly rate from 15$-50$ depending on developer level. DM me if you're a start-up as we have a special discount for you. I assure you, you will not be disappointed!

Cuong: I try to run terminal : npm run build on contracts jetter-mint of TON community. But it show error as images. I download all file and path and set up environment variables it in enviroment. But error still exist. Any helpings and thanks.

agile_ape: see this: https://x.com/tontasten/status/1803127049747570747 (reply to 73203)

agile_ape: can i ask - how can i use ton library to send a message to a smart contract? here's my code but it doesn't work. i think the way i construct my message as Cells is not right?      const tonCenterEndpoint4 = await getHttpV4Endpoint({       network: "mainnet",     });      const client4 = new TonClient4({       endpoint: tonCenterEndpoint4,     });          let messageBody = beginCell()       .storeUint(0, 32)       .storeStringTail("increment")       .endCell();        let externalMessage = beginCell()       .storeUint(0b10, 2)       .storeUint(0, 2)       .storeAddress(counterAddress)       .storeCoins(0)       .storeBit(0)       .storeBit(1)       .storeRef(messageBody)       .endCell();          const result = await client4.sendMessage(externalMessage);      console.log("Message sent. Transaction hash:", result);  I get a bad response error code

Super Man: Hello Everyone. I am looking for a sample contract written by Func that can add liquidity on the ston.fi with custom jetton and TON.

Super Man: who can help me?

Super Man: can pay for that

User<7369227251>: i can help you (reply to 73268)

Pegu: Hi, is there more documentation on encoding payload? I managed to encode a payload (without contract wrapper) for deployed on chain contract (unverified) method but theres another external message out on step C of the transaction

User<835351458>: Neobanks are launching full banking apps on telegram with crypto and fiat services and launching their own tokens on ton. 🤗

User<835351458>: Plus pre-ipo shares in crypto blue chip companies sold as nfts on ton...investment banking services on telegram lol.  With TG games to earn points/vouchers which can be redeemed for pre-ipo nfts or flipped on getgems lol. (reply to 73284)

User<835351458>: Such an exciting time for devs on ton.  Build something meaningful which changes lives. Leave a legacy for your grandkids and lots of bedtime stories.

prodvd: Who can suggest me good documents for TACT and FUNC?

Егор: need telegram gamebot runs on TON, looking for dev

prodvd: Heya (reply to 73304)

prodvd: What are you going to develop? Can you elaborate via DM?  As a full-stack engineer, I can help you with TON app and bots.

Vitor: Dude, go scam people somewhere else and stop spamming the chat. (reply to 73330)

User<6193384291>: My project is urgently recruiting tech talent proficient in TON development. This is a remote position with open compensation plus token bonuses. If interested, please contact me.

Tris: Hi guys, Is there any way to convert int to slice string in funC language?

Nerses: this is from compilation file .md. Does this give any imformation about in which bit position is allocated every field ?  `## Hello TLB: hello#aef3a620 hi:int257 hello:address goodDay:dict<int, int> = Hello Signature: Hello{hi:int257,hello:address,goodDay:dict<int, int>}`

ຮꫀթí: Can you write it? (reply to 73193)

ຮꫀթí: -- Define a function to convert an integer to a slice string fun intToSliceString(n: Int): String {     -- Convert the integer to a string     let nStr = intToString(n)     -- Concatenate to form the slice string     return "[" + nStr + "]" }  -- Usage let n = 5 print(intToSliceString(n))  -- Output: "[5]" (reply to 73339)

0x0liver: should i return cell for get methods in smart contract, or parse it into slice and int?

Tris: thanks for you answer, but can you give me this code in FunC language please (reply to 73344)

ຮꫀթí: Of course, () int_to_slice_string(int n) {   ;; This function converts an integer to a slice string representation like "[n]"    ;; First, allocate a cell to build the string   slice cell_s = begin_cell();      ;; Add the opening bracket   cell_s = store_uint(cell_s, '[');      ;; Convert the integer to a string and add it to the cell   int temp = n;   if (temp < 0) {     cell_s = store_uint(cell_s, '-');     temp = -temp;   }      ;; Handle the digits   int reverse_digits = 0;   int num_digits = 0;   do {     reverse_digits = (reverse_digits * 10) + (temp % 10);     temp = temp / 10;     num_digits = num_digits + 1;   } while (temp > 0);      do {     cell_s = store_uint(cell_s, (reverse_digits % 10) + '0');     reverse_digits = reverse_digits / 10;     num_digits = num_digits - 1;   } while (num_digits > 0);      ;; Add the closing bracket   cell_s = store_uint(cell_s, ']');      ;; Store the built string slice in a cell and return it   return end_cell(cell_s); } (reply to 73347)

Kaito Lee: Has anyone written code to swap ton on dedust from sdk to funC ?

Ton: anyone knows why?

Matsu: Hello guys, is there any library that supports reading transaction receipt based on transaction hash? Currently I am using ton-api-sdk but if the traffic is large it will cause rate limit

Ton: @pcrafter could you pls help me with this problem?

User<6650251888>: Своровали (reply to 73255)

Matthew: Hi I tried deploying a Jetton master and when i tried creating a Jetton wallet, it says uninit but it only sent TON to it without initializing the contract.

L: I am looking for TON blockchain developers on a permanent basis. It requires knowledge of building dapps with TON Proxy, TON Sites, TON DNS, TON connect, TON storage, etc., the ability to work with TON smart contracts in the Blueprint framework, in the FunC language and writing scripts for them in Java Script/Type Script

Henry: Hi everyone. I got this when trying to send message to contract. What could be wrong?  The wallet is about to open, but it doesn't load to verify transaction.

saul: Hi 👋  https://docs.ton.org/participate/web3/dns  The code for SDK zone dns in that article doesn't seem to work.  It outputs a null value.

saul: Is there a workaround?

Crypto Notte: gm team, what are some best practices around high tx transactions processing? Any recommended repo?

Nerses: is there any example how to parse dictionary using libs in ts ?

Егор: looking for a designer/ illustrator for ton project (pls a girl)

Diamond: 💀 (reply to 73398)

ຮꫀթí: 🤣 (reply to 73398)

Амир: u are not afraid of women? wow (reply to 73398)

Амир: ironman

Vol Pigrukh: Hi all! What multisig do you use for your projects on TON? And if you use the standard one from TON org, what is your experience with it?

Nadya: Hey everyone,  I'm a UX/UI designer looking for new projects! I also create illustrations, 3D models, and motion graphics.  What sets me apart is my ability to bring any of your ideas to life, from NFT collections to various services, apps, and platforms. I specialize in designing Telegram apps and have successful case studies to share. My strength lies in testing designs for maximum conversion rates before final approval.  Feel free to DM me for my portfolio! 😉

Nerses: In what data type of TACT i can store map ?

Shawn: DMed (reply to 73413)

ຮꫀթí: How I can get Jettons like usdt in testnet ton?

Vladimir: You can deploy your own ))  https://github.com/ton-blockchain/stablecoin-contract (reply to 73431)

&rey: You can mint a standard jetton, it isn't much different ) https://minter.ton.org/?testnet=true (reply to 73431)

Hakiem: anybody else getting 504 gateway timeout for tonconnect ui react?

Dmitriy: Hi!  I’m trying to follow the contract sharding approach, and implement storing a (key, value) pair in dict in a separate contract to avoid storing unbounded map (it could be really big). Basically I want to calculate this contract address by key and query its storage (by sendig the message to it and processing its reply) in my main contract. Now I’m trying to figure out how effective it will be in terms of storage costs, so I have a question:  Ideally I’d like to not allocate some toncoins to this contract balance (i.e. I want to keep it zero or some small amount of toncoins) and want to make message sender to pay storage fee. But the problem is that storage phase is executed first (before credit phase), so it seems that the contract balance should be large enough to cover storage fee before it gets the message. Is it right?

ຮꫀթí: how can mint a nft on testnet? (reply to 73433)

&rey: In https://testnet.getgems.io/. (reply to 73438)

&rey: You'd better do const keyPair = TonWeb.mnemonic.mnemonicToKeyPair('... ... ...'.split(' ')); (of course moving mnemonic to some secure place where you can't accidentally publish it) (reply to 73443)

Gandalf: wow 🤩 you is cool =) (reply to 73446)

Elizabeth: Okay

gimbljimbl: UQD__________xYt  Can someone confirm that this is the burn address

&rey: A burn address for what? NFTs? (reply to 73470)

gimbljimbl: Lp and renounce ownership (reply to 73471)

gimbljimbl: Do you know what this address is?  UQD__xYt

gimbljimbl: EQD__________0vo  Or this address

gimbljimbl: Help please

Gabry: guys I need a good dev to start a project

T: what kind of project? (reply to 73479)

Gabry: I need a meme coin on chain ton, write me if interested (reply to 73480)

Амир: It is invalid i guess (reply to 73473)

Vitor: THere's no canonical burn address. This works. Or EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c. (reply to 73470)

Ronaldo: I need to know how to write the message to swap (reply to 73342)

Abdulaziz: What i get if i became node of TON? Do i get some toncoins? I have no toncoin for stake, but i have a server which can be a node

Abdulaziz: I mean if i became full node, what i get to return (reply to 73489)

&rey: Nothing. On the other hand, they don't require TON in stake. (reply to 73491)

Abdulaziz: If I understand correctly, it says that If i wanna earn ton, i need a good server and about 340k ton it's about 2.7mln USD, right? (reply to 73492)

Abdulaziz: There is only 349 nodes, I don't even know how this Blockchain still works with this less amount of nodes (reply to 73493)

Амир: I guess even 3-4 nodes are sufficient for blockchain to function (reply to 73494)

ຮꫀթí: How can I remove this button when wallet connected? this is inside the wc element

gimbljimbl: It's there any official source saying that this is good for burn? (reply to 73483)

Амир: Just use zero address man (reply to 73499)

Амир: As I remember its two zero bits

Abdulaziz: EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c This address for burn NFTs (reply to 73470)

Abdulaziz: I don't know how they can process transactions over $300 million per day (reply to 73495)

Tech🧑‍💻🐾: I can help you with that bro (reply to 73304)

TON Bounty Bridge: ​ GitHub (Enseñanza educativa )  🏷 Education  Summary:Para algunas enseñanzas dependiendo el tipo en el que se emplea la enseñanza podríamos brindar un f...  Created by BLADIMIR007

TON Bounty Bridge: ​Hey! When it comes to suggesting new tools for developers or community improvements, one idea could be creating a platform that connects developers with mentors in their field. This way, developers can receive guidance and support from experienced professionals, fostering growth and collaboration within the community.  🏷 Developer Tool  Summary:Sure thing! One suggestion could be to develop a platform that facilitates mentorship connections fo...  Created by Leila82qorbani

Henry: I'm using TON Connect in my react-app. I'm sending a message to a contract and using Tonkeep wallet. But the transaction shows failed status in the verify transaction popup. Is there a known issue? (it is successful if I call via blueprint script)

— 2024-06-22 —

gimbljimbl: I assume nobody has access to it then (reply to 73503)

kpo: @TrueCarry  Does ton-lite-client, a nodejs sdk, have a get example with parameters? For example, how to query the following contract method get_sicy ? int get_sicy(slice cs) method_id {}

Tim: Look at ton http api v4

User<835351458>: Via dynamic sharding and parallel processing.   Ton is the fastest blockchain rn verified by independent testing. Pantera made the biggest investment ever in its history by investing $250m in ton.  From ton blog: "The TON Blockchain consists of one masterchain and up to 2^32 workchains. Each workchain is a separate chain with its rules. Each workchain can further split into 2^60 shardchains, or sub-shards, containing a fraction of the workchain's state. Currently, only one workchain is operating on TON - basechain.  Each workchain can split into one quintillion, one hundred fifty-two quadrillion, nine hundred twenty-one trillion, five hundred four billion, six hundred six million, eight hundred forty-six thousand, nine hundred seventy-six shardchains.  This means that TON is not just a single blockchain but a blockchain of blockchains." (reply to 73494)

Hakiem: Hi guys, once i add these tags to my App component,      <TonConnectUIProvider manifestUrl="..../tonconnect-manifest.json">     </TonConnectUIProvider>   whole app crashes. get this error when inspect chrome: ERR_ABORTED 504 (Gateway Timeout)  I have already verified that the manifest url is accessible through browser

MB: Hello guys, I hope you are doing well Have any of you ever seen a Ton network based payment gateway plugin for WordPress?

Smart: i get payment is expired in modal with telegram stars payment, how can i catch this error?

Allen: Hello guys, Does anyone know how to detect the contract have implemented somehow interface method , such as ERC165

Амир: Ping each of them?) (reply to 73574)

&rey: You mean "contract processes specific message opcode" or "contract has get-method with specified ID"? (reply to 73574)

Allen: I want to know whether a certain contract complies with the implementation of a specific contract. For example, how can I judge whether a certain contract is an NFT master? There is a similar method in EVM (EIP-165). I saw that tact mentioned the relevant OTP(OTP-001). But in func, is there any way for me to determine the contract type ? (reply to 73577)

&rey: TEP-62 (https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#nft-collection-smart-contract) defines NFT collection contract as one having three specific get-methods: get_collection_data, get_nft_address_by_index and get_nft_content. You can simply attempt calling those get-methods and see if they succeed. (reply to 73579)

&rey: (In particular, contract types are not mutually exclusive. There can be jetton wallet which is jetton master itself.)

Allen: But this method requires special processing for a certain contract. Is there any method that can be processed like EIP-165? If I want to determine whether it is a wallet contract, NFT item or a specific contract (reply to 73580)

Allen: /

Allen: Like tact otp001. If your contract implements a specific type of contract, your method id will match a specific hash. Through the hash of the get method id, it is easy to determine whether it is a specific contract type.

Dhruv: hello devs, can anyone please help me here, how to wait till send transaction is completed? The storeOnDB function gets called after sending the send transaction but i want it to call after the send transaction is executed, how can i make it possible.   const mintPost = async (data) => {         if (!postContractInstance) return;          const res = await postContractInstance.send(             sender,             {                 value: parseTon("0.05")             },             {                 $$type: 'Mint',                 query_id: BigInt(Math.floor(Math.random() * 1000)),             }         ).then(async () => {             await storeOnDB(data);         });     }

&rey: You need to wait until tx (probably send from the wallet) is recorded on blockchain. Are you doing this in backend or frontend? (reply to 73591)

Dhruv: I'm doing it from frontend, but the storeOnDB funtion is called right after the "send" transaction is send to the blockchain not after completly executing on the blockchain. (reply to 73591)

&rey: You know that any code executed on frontend side cannot be trusted, right? (so location of `storeOnDB`cannot be relied on in security context) (reply to 73595)

Dhruv: so I can not make call storeOnDB funtion after completion of send transaction? (reply to 73596)

&rey: First let me guess what you're trying to do: You want to allow users to mint your tokens, limiting the offer either to unique users or by mint count. Said check is done at frontend side in your example. (reply to 73598)

Smart: i am not able to pay with stars, when confirmation modal button "confirm and pay star" pressed, it says please wait and then request for payment has expired. has somebody same issue?

&rey: I guess this is offtop for this chat. (reply to 73601)

Dhruv: what I am doing is allowing user to mint token and after that I'm storing some data of the user on DB. So what my issue here is, that the mint tx is sent to the blockchain and then without even comfirming that mint tx is executed succesfully the storeOnDB function is executing, so now if the mint tx is got failed in that case also the storeOnDB function is executeing. (reply to 73599)

&rey: The problem is, a malicious user can simply call storeOnDB without sending any transactions (regardless of how you write your script). Is it alright with your usecase? (reply to 73603)

Nexus: /stat@combot

Dhruv: yes (reply to 73604)

Smart: why offtop, i integrated telegram stars into my app, but can't make payment, it is telegram API problem may be, but i asked before how i can catch this response? i think i am not only one who encounters this? (reply to 73602)

&rey: Because this chat is not about Telegram at all, it is about development on TON; mainly about smart contracts. (reply to 73608)

Smart: ok ,i see , sorry 😂 too many chats (reply to 73609)

specuLenny | Dev: Looking for a dev who can help with contract deployment and creating a script that call the contract  DM me for details

Nikolaj: Hello, I'm trying to figure out the contract scripts now, but I'm getting an error. this is a simple contract with 2 fields deployed on testnet

&rey: You cannot pay more fee. You cannot make your message be processed after or before another. (reply to 73622)

&rey: Actually, if you have already seen another message, it's quite likely it will be processed before yours.

&rey: You should become a validator yourself; then, in a block generated by your validator, you can put your own external messages before any others. (reply to 73625)

&rey: Nope. You should compile such a list; I believe it would be nice to have! Not sure if it gets a bounty but it can. (reply to 73628)

Nxrix: How many utf-8 chars can I have in one cell?

Nxrix: I want to calculate the maximum length of text we can send

&rey: You can have up to 1023 bits; it's up to you to encode the text into bytes and split so it fits. (reply to 73633)

Dmitry | backend4you.ton: You may put text parts into different chained cells, look for something like store-string-snake in your sdk (reply to 73634)

Christian: Hi, I try to create a signed transaction on a backend and send the base64 encoded transaction to a frontend where it is processed with tonConnectUI.sendTransaction(... payload...).  I was able to make the transaction on the backend with a wallet in the backend using pytoniq. I'm able to send the unsigned transaction to the frontend, which fails there, because it is not signed with the backends wallet. Question: maybe someone has a peace of code how to sign the transaction with pyoniq.  My second try is to create the transaction with tonlib-rs in rust:  let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs() as u32;     let body = signer_wallet.create_external_body(now + 60, seqno.try_into()?, transfer_cells)?;     let signed = signer_wallet.sign_external_body(&body)?;      let wrapped = signer_wallet.wrap_signed_body(signed, false)?;     let boc = BagOfCells::from_root(wrapped);     let tx = boc.serialize(false)?;  I fail here to understand what boc.serialize format is. In the python version I have to base64 the boc, here I dont know what vec<u8> contains.  Question summarized: Any idea, how to create a base64_raw_transaction with pytoniq or better tonlib-rs that can be consumed as rawTxBase64 in sendTransaction? Example:  const response = await tonConnectUI.sendTransaction({     validUntil: Math.floor(new Date() / 1000) + 360,     messages: [         {             address: destinationAddress,             payload: rawTxBase64,             amount: "100000000"         },     ], });

Wang: Hi, I'm TON smart contract beginner.  Help me please. Could I send transaction with withdraw message? Now I can't send message to contract.

Dmitry | backend4you.ton: Yes you can. Start at docs.ton.org (reply to 73656)

User<6329807391>: A TON developer is required to join the team.

TON Bounty Bridge: ​automatic receipt of sbt  🏷 Developer Tool  Summary:Sbt  Created by Korkin-ton

&rey: This is wrong in its very base.  Do you want user or your backend wallet to pay TON and send the message? (reply to 73641)

Игорь: Hello. How to explore all transactions that was confirmed in master block? Now i got only last shard blocks in response of toncenter or tonapi.  Thats looked like i should save seqnum for all shards and if its changed in shards of master block observe all that was not included in previous master block.  Then observe all transactions in those blocks. Does you know any other way to explore all transactions that was included on master block? Not only last block in shard

Henry: How do I get transaction exit code (before it is executed)? I want to know the reason why it failed? (reply to 73532)

Амир: xD (reply to 73671)

Christian: I want send Jetton from my backends wallet to the users wallet, but let the user pay the transaction ton-fee. (reply to 73667)

&rey: This is very non-trivial. (reply to 73673)

musashi: I guess we can achieve this with a jetton vault contract with claim function that charge fee from users (reply to 73673)

musashi: oh that's quite similar to airdrop =)

Christian: Yes, maybe it's the same, thanks for the hint 😊️️️️

musashi: yeah, with airdrop aproach, you cannot control the time user claim the tokens

Christian: I hoped I could just sign the jetton_transfer from following example and let the user do the transfer:   async fn create_jetton_transfer() -> anyhow::Result<()> {      let seqno:i32 = 30000000;      let self_address: TonAddress = "EQB2BtXDXaQuIcMYW7JEWhHmwHfPPwa-eoCdefiAxOhU3pQg "         .parse()         .unwrap();     let mnemonic_str = "mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic";     let mnemonic: Mnemonic = Mnemonic::from_str(mnemonic_str, &None).unwrap();     let key_pair: KeyPair = mnemonic.to_key_pair().unwrap();     let jetton_master_address: TonAddress = "EQDCJL0iQHofcBBvFBHdVG233Ri2V4kCNFgfRT-gqAd3Oc86"         .parse()         .unwrap();      let client = TonClient::default().await?;         let contract_factory = TonContractFactory::builder(&client).build().await?;     let jetton_master =         contract_factory.get_contract(&jetton_master_address);     let self_jetton_wallet_addr = jetton_master.get_wallet_address(&self_address).await?;     let wallet = TonWallet::derive_default(WalletVersion::V4R2, &key_pair)?;     let dest: TonAddress = "<destination wallet address>".parse()?;     let src: TonAddress = "<source wallet address>".parse()?;     let jetton_amount = BigUint::from(1000000u64);     let jetton_transfer = JettonTransferMessage::new(&dest, &jetton_amount)         .with_query_id(100500)         .with_response_destination(&self_address)         .build()?;     let ton_amount = BigUint::from(200000000u64); // 0.2 TON     let transfer = TransferMessage::new(&src, &ton_amount)         .with_data(jetton_transfer)         .build()?;     let now = SystemTime::now()         .duration_since(SystemTime::UNIX_EPOCH)?         .as_secs() as u32;     let body = wallet.create_external_body(now + 60, seqno.try_into().unwrap(), vec![transfer])?;     let signed = wallet.sign_external_body(&body)?;     let wrapped = wallet.wrap_signed_body(signed)?;     let boc = BagOfCells::from_root(wrapped);     let tx = boc.serialize(true)?;      let hash = client.send_raw_message_return_hash(tx.as_slice()).await?;      Ok(()) } (reply to 73678)

&rey: No, this is not possible unless you have a custom contract as backend wallet. (reply to 73684)

musashi: yeah, your goal is something like by somehow you take money from users wallet without their permission which is impossible

Buggy: Any new project?

Christian: In ethereum context it is a relay transaction I think. In this context the backends jetton wallet would give the permission by creating the raw (offline) transaction. The users wallet would send this transaction and has to pay the ton fee.

Christian: I am working on a grammar learning telegram mini app. Learners should be motivated by some gamification parts and get jettons in the end. The telegram bot is @KonnektorenHelpBot if you are interested. (reply to 73687)

PasswordKay (I Don't DM First! ) 🦠: Hello, need help with telegram mini game dev. A good mini game dev for telegram can DM please. Thanks

Wang: Thank you, I've seen that, but I don't know well how to make transaction payload. If you have any example, could you tell me about this? (reply to 73663)

Dmitry | backend4you.ton: Dapps -> Cookbook (reply to 73706)

Peter: Hello guys, im looking for a developer for TON web application - long-term cooperation requried - send me to DMs your previous works or some information about you if interested

Gabry: Guys I need someone who can make me a good website for a crypto project. Dm me if interested

Wang: I've seen all reference books. but I've not found how to make message payload related to following example receive function:  message Withdraw {     amount: Int as coins; }  receive(msg: Withdraw) {         require(sender() == self.owner, "Only deployer is allowed to withdraw");         let amount: Int = min(msg.amount, myBalance() - context().value - self.MinTonForStorage);         require(amount > 0, "Insufficient balance");         send(SendParameters{             to: sender(),             bounce: true,             value: amount,             mode: SendRemainingValue + SendIgnoreErrors         });     } In this case, how to send message payload in frontend. (reply to 73713)

&rey: Have you compiled the contract? If so, you have autogenerated wrappers, with some function like storeWithdraw. (reply to 73723)

Heydar: guys do you think it's scam contract address? https://tonviewer.com/EQBADxsf9xxuibdUxUPPDygFLYg2Xu7SbtT94xzpGd6HxIFL?section=code

ຮꫀթí: Yes (reply to 73750)

— 2024-06-23 —

Tech🧑‍💻🐾: Still needed or you've got someone else? Kindly let me know, to know what to offer you next! (reply to 73617)

Wang: Yeah, I've compiled and deployed on testnet, and it's working well such "withdraw all". I've send transaction with following message for withdraw all. messages: [     {       address: contractAddress,       amount: toNano('0.5')       payload: beginCell()       .storeUint(0, 32)        .storeStringTail(" withdraw all")        .endCell()     },   ], (reply to 73745)

O: Hey there, Any contact can receive jettons, right? So if my Counter contract received USDT, where I can check example how to withdraw funds USDT from Counter Contract?

milad: assets/0000-my-new-standard

TON Bounty Bridge: ​Introducing TonUp (TON UPDATE) to be renamed if approved  🏷 Developer Tool  Summary:Developer Tool for the TON Ecosystem  Created by Mandara7030

TTran: how can I auto create many wallets TON using python?

Angus: any Ton BD here ?

TON Bounty Bridge: ​Sardorking  🏷 Developer Tool  Summary:Full meet  Created by Sardorking606

Liu Queng: Hi guys, I'm trying to build Bot Alert new contract, I saw transaction of new jetton created in block ((0,c000000000000000,xxxxxx), but I can't request it by API cause c00000000000 it's not interger, what I need to do to fix it?

Marc: Hello devs. Did anyone already develop a bot that checks the balance of a token/jetton that the user owns and based on that accepts them in the group or channel? Thanks

Crind: Hi. I can implement in python for 5 ton (reply to 73833)

Aibar: Hey how can I get more ton on testnet?

Angel: I am looking for a senior FunC developer who can start immediately. DM me if you are interested in it.

Crind: DM (reply to 73847)

MRT: hi, how to emulate transaction ?

MA: hello, I want to decode body and find the text comment, usually I'll do it with decode body and read ref and find the payload but in this transaction when I decode the body there is not ant ref. how can I extract text comment ?  this is the body te6cckEBAQEAZwAAyg+KfqUAAAAAAAAAAGAUX2gLAAgBlbExZAFBJp3ILYQHN35+uv40ZGLlDrZ4M6bxTeqB72MANgSkcS5zcOC/KZGJe4jopIpOPBCXqdL+1/L1yTMrj96CAgAAAAAyMTIyMzA0NTI5hzA1AA==  and this is the tx hash 86b148cca0c4af5bb05c1475fc605f56091562329f823ead6f48f7874caf7e9f  I am using python

Armin: In this transaction, the comment has stored in transaction cell, not any separated cell. (reply to 73865)

MA: so how can I decode payload in general for all possible transactions? Is there any tool or document to help me decode all possible transactions? (reply to 73871)

UncleRooks: Hello pls I am new to TON development  Trying to set up my compile workflow on VS code and I keep getting error message: cannot find module

Амир: That's insane! (reply to 73878)

ຮꫀթí: how can fetch transaction info from txid in ton network?

Mr: tonconsole api (reply to 73887)

User<6728518356>: We need a person to reverse engineer a smart contract, write in private messages

Buggy: Any Dev who build a boxing game in here?

ຮꫀթí: i couldn't found a api from ton console for this, i want fetch transaction info like this (reply to 73891)

ຮꫀթí: there is an api for this? (reply to 73901)

musashi: https://docs.tonconsole.com/tonapi/api-v2 (reply to 73902)

musashi: try this one mate  /v2/blockchain/transactions/{transaction_id}

&rey: Bottom right corner of the page should show the specific endpoint. (reply to 73902)

Ankit j: Is there any Token distribution (to many users) feature on Ton website after token is created?

Anonymous: Hey is it possible to develop in Windows?

Anonymous: Yes there is an option (reply to 73909)

Ankit j: Thanks for reply, that's great then.. i won't need to integrate claim page on our project.. (reply to 73912)

Anonymous: Ton Mass Sender (reply to 73913)

Ankit j: How to access it ? (reply to 73916)

Ankit j: Yes, it's possible.. (reply to 73911)

Anonymous: Go to Ton Main page then build and go down to meme Coin section there you will find the Mass Sender dovumentation (reply to 73917)

&rey: You may not ask for DMs in this chat. Actually, I can't find any issue with reverse engineering it right here. (reply to 73894)

Anonymous: Wrong? (reply to 73921)

Angel: https://ton.oneclicksender.com/ (reply to 73917)

Anonymous: Which assembler development do i need to use for develop on Ton if i use Windows (reply to 73917)

&rey: It turns out you're correct, I was just surprised. (reply to 73922)

Ankit j: Oh, this works with csv..to how many users addresses limit at 1 time ? (reply to 73923)

Anonymous: Bro do you really want to send for free how Many liquidity do you have what Kind of a token you want to bring to the Market? (reply to 73927)

Anonymous: And allow me please one Next question what about marketing?

Ankit j: No, I am still building a webapp on Ton.. (reply to 73930)

&rey: 0xc000000000000000 is the valid shard ID. (reply to 73829)

Ankit j: Marketing, depends on your solution you are building.

Liu Queng: Is there a way to identify its specific shard? (reply to 73933)

&rey: You mean, address range? (reply to 73936)

𝚕𝚞𝚗𝚊𝚝𝟷𝚔: Hello everyone, I want to send a TON to another wallet, but an «entity not found» error occurs, my code is: method_result = await tonapi.blockchain.execute_get_method(    wallet.address.to_string(False), "seqno"     ) How to fix this?

&rey: Probably your wallet is not initialized; you can use seqno=0 in this case. (reply to 73946)

Artem: Hello everyone, please tell me how to solve this problem

Liu Queng: Like this on, I want quert all transaction in this block, but when I write shard is c00000 it will show error (reply to 73945)

𝚕𝚞𝚗𝚊𝚝𝟷𝚔: thx bro, one more question, can I send a comment without size restrictions, if so, how? (reply to 73947)

Crypto Notte: We are looking for a consultancy from someone with experience in managing high load of TON transactions and seqno, if this is you get in touch with me 😃

Ankit j: I want to know how token Launch price is decided at Ton for a project that gained much popularity like Notcoin & marketing but having 0 initial funding..?

Ankit j: Anyone knows ? (reply to 73955)

web3: I need a Dev TON for work on Tap2Earn project somebody are interested DM

максим: Hi, does anyone know if tact has an analog with ether tx.origin? that would get in any case the address of the sender of the transaction or ctx.sender and guarantees it?

Md.: 🆗

User<6576297005>: Please let me know if you are in need ofdev.

Fractured: I guess it depends on the initial liquidity provided so it’s a very broad question you’re asking.  Would greatly depend on whether the project is funded by the founders, has secured investments or generated revenue  before launch (reply to 73959)

Aibar: Collector Address  of TON -ETH bridge ?

User<835351458>: You look at the metrics of the project, like number of active users, or TVL, the sector such as AI, socialfi, or whatever, and look for similar projects already listed to get idea of market cap for your project.  If a similar project is listed at $200M market cap and your project has a billion tokens, then the listing price should be lower than $0.20.   $0.10 = 2x  $0.05 = 4x  The lower the listing price from fmv, the more fomo and excitement for the project, and the greater the demand. (reply to 73955)

W. [Разработка сайтов]: If you need help in creating a site, write me!

Bromelia: @admin holy crap, one click away from falling for this and def not a noob. ffs (reply to 73997)

Veritas: I'm looking to create a game on Telegram TONchain and need some good Devs.

Bromelia: @pcrafter please delete, when you get a chance (reply to 73997)

Bromelia: SCAM (reply to 73992)

𝚕𝚞𝚗𝚊𝚝𝟷𝚔: Guys, please give me the code for creating a long comment for a transaction in python

gimbljimbl: Hello, is there any guide on minting large nft collections?

Anton: hey folks, take a look, we just announced a new Sublime Text plugin for Tact: https://t.me/tondev_news/120

N: Hey guys, im trying do a miniapp but im receiving Unable to retrieve launch parameters from any known source. someone know how can i fix?

gimbljimbl: Anybody? (reply to 74034)

TechGuru: what token? (reply to 74015)

— 2024-06-24 —

Constantine: If i use this endpoint to find a transaction by hash: https|toncenter|com|api|v3|#|default|get_transactions_api_v3_transactions_get then it will return only confirmed transactions? I just can't find the field in the response where it was stated that the transaction was confirmed. Pls help

Golddy: Hi, You want to build Tap2Earn project and in need of developer? (reply to 73962)

White: hey is there anyone who is from the ton foundation that i can talk to for joining their ecosystem?

发财: dm， give you a demo (reply to 73962)

becon: where is site to check ton based coin chart?

Ankit j: Agree with you...so this depends more on number of active users..a token created without any pre-funding or without providing any initial liquidity and solid demand over ton...can also get decent launching price. (reply to 73995)

Dung LQ: Hello, I'm making a wallet on Ton and with Ton Connect I'm using https://tonapi.io/v2/wallet/emulate to emulate transactions on Ton but I get the error: {  "error": "grams overflow" }. Here are the details about the request api: curl -X 'POST' \   'https://tonapi.io/v2/wallet/emulate' \   -H 'accept: application/json' \   -H 'Accept-Language: ru-RU,ru;q=0.5' \   -H 'Content-Type: application/json' \   -d '{   "boc": "te6cckEBAgEAiAABbQ+KfqUAAABvG9oW3kBfXhAIAO87mQKicbKgHIk4pSPP4k5xhHqutqYgAB7USnesDnCcECwbgQMBAJclk4VhgBD3JEg1TUr75iTijBghOKm/sxNDXUBl7CD6WMut0Q85yASoUVkAEx0Sdc4HXNn5Oj9+dz3FLESwHdbajyZX2FjBL3X1t8/Qf2VY5A==",   "params": [     {       "address": "EQARULUYsmJq1RiZ-YiH-IJLcAZUVkVff-KBPwEmmaQGH6aC",       "balance": 285000000     }   ] }' Can someone help me check if I'm going wrong or give me documentation about this function?. I sincerely thank you!

Crypto Notte: Hello team, any good repo where I can see how to have multiple messages in one tx (eg send multiple Jettons in one tx). Thanks. If you know how to do this get in touch we are looking for some paid hours of consultancy.

Tech🧑‍💻🐾: Still needed? (reply to 73847)

Kennyy: dm me (reply to 73962)

Harry: i need to convert current time to logical time to filter transaction.. how we can do that? i searched but don't find the way

Whitey: it's different entities, and not crossing at all (reply to 74104)

Harry: i try to use getblock api.. so i need to pass created_lt=logical time  if i can't create logical time, do you have any idea to get status after transaction? (reply to 74105)

Whitey: you can't create, but can get logical time from api (reply to 74106)

Aibar: is ton testnet bridge working?

Tech🧑‍💻🐾: Yes am here 👋 (reply to 74002)

Harry: how, can you give me exam or explain. please (reply to 74107)

Allen: I wrote an article about transactions and waiting for transaction completion, hoping it can help everyone understand TON a bit better. link.medium.com/MT3daYriGKb

Aibar: Hey. Could someone explain the ton-evm bridge in more details?

Crind: DM (reply to 74119)

Anng: Can anyone help me? (reply to 73238)

MA: hello guys, how can I decode all possible type of transactions body for getting the text comment? some time the comment in a ref of body but some time it is in the body.

Lurpis Wang: hello guys, are there any light clients available in the Ton consensus at present?

&rey: Tact does not support that. Please consider moving to FunC. (reply to 73238)

&rey: Any... sorry, what do you mean? "Liteclient" is a local thing that connects to liteservers specified in TON network JSON. (reply to 74133)

&rey: You need to read CommonMsgInfo first; its last bit indicates whether comment starts immediately or in a ref. (reply to 74128)

Aibar: hey! Is there a working ton-evm testnet bridge?

MA: I think you talking about this part. if is that true this is not my problem. I have the body base64 itself and I need to read the comment from the body. this image shows where is the body not the payload in the body. please correct me if I wrong (reply to 74137)

&rey: You want to universally get text comment from TON, jetton and NFT transfers? (reply to 74145)

MA: yes (reply to 74146)

Stefan: Hi, @everyone, I am studying dedust. and I want to test. is it possible on the testnet with testton?

W. [Разработка сайтов]: If you need help in creating a site, write me!  I will help you as much as I can

Alice: Does anyone know how to add whitelist feature into an nft mint contract? We would like to giveaway some whitelists to our og for minting nft

Thomas: I created a SC with recv_external(), but when call external to it I got this error Error while executing transaction: External message not accepted by smart contract Do you guys have any solution to trace the bug?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 55 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 40  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

&rey: Is there any TVM log? Does your contract call accept_message(); when it's certain that message is valid? (reply to 74168)

TON Bounty Bridge: ​6219861961488110  🏷 Developer Tool  Summary:توران موسوی  Created by 6037701556160635

Thomas: No, I call with an empty cell, and in recv_external() just return (); (reply to 74161)

Aibar: is bridge working rn?

MA: can you please send a sample code for any library that I can achieve that goal with it ? (reply to 74146)

Nigatu: Work shop

Nerses: how can i convert BoC base64 to Slice type ?

Artem: Please , help

&rey: Cell.fromBase64('te6cck...').beginParse() (reply to 74187)

к.: Hi, is there any source for understanding cell data structure in depth? A simple explanation.

&rey: A simple: all data in TON is represented as bit sequence, split into cells with max size of 1023 bits. (reply to 74192)

к.: I'm Searching for a full explanation. To understand the TL-B then.   But the existing document is a little confusing. (reply to 74193)

Stefan: Hi, @everyone, I am studying dedust. and I want to test. is it possible on the testnet with testton?

Aibar: why ton bridge doesn't work on testnet?

Stefan: import { Asset, Factory, TESTNET_FACTORY_ADDR } from "@dedust/sdk"; TESTNET_FACTORY_ADDR no there... or am I wrong?

Stefan: If my question is stupid, then  pls let me know correct algorithm

Kunal: Try discussing with ChatGpt, helped me understand better. (reply to 74192)

MA: is there anybody that can help me with this question ? (reply to 74181)

balthy: How many item? (reply to 74060)

Nerses: I get invalid magic although the input starts with b5ee9c72, what can cause that ? (reply to 74191)

Pouya: I'm working on a solution that helps collections to be able to handle unlimited item I faced the problem that what if we want to mint a collection that the items id did not incremental in solidity, we use the map data structure but in TON, if we implement the map by cells of just 35000 items we can mint  I have an idea about this problem and I will implement a sample and share the details of this solution here (reply to 74034)

&rey: Because there isn't one IIRC. (reply to 74235)

&rey: b5ee9c72 is hex, not base64. You need to modify code correspondingly. (reply to 74223)

&rey: Well, this is THE reason why NFTs are not stored inside collection but in separate contracts instead. (reply to 74232)

User<91545419>: Hello, I need help with a couple of questions.  I need to implement a feature where a user transfers USDT to a wallet in Telegram and enters from which wallet they transferred. The system should check by polling an endpoint whether the money has arrived from the specified address or not. Please suggest the simplest and most convenient service for this. If there are other ways to achieve the same result, that will also do.  Additionally, I need the ability to send USDT from our Telegram wallet to the user's specified wallet.  If there is something already available, that would be even better. Thank you for your answers.

Ionelion: Hello ,Can someone help me convert an Invoice URL from wallet ton org to HTTPS? There is a way to do this on ton hub, but I would like to do it on wallet ton org

Ankit j: is this github repostory safe to use ? https://github.com/ton-community/twa-template

cai: does any one can help me?

cai: wirte method  abi is this

Teiv 🦴: Hello everyone, I would like to ask about front-end development for Telegram MiniApp.  Currently, I'm designing everything based on iPhones from Pro to Pro Max. But how can I ensure that the app fills the screen on all phones when accessed? Similar to Hamster Kombat, where almost every phone accessing it can have the same screen ratio. So, to handle cases like this, what technologies do I need to use for the Front-end? Thank you.  We primarily focus on Back-end, so we are also learning front-end to serve MiniApp design better.

cai: i use tonutil-go to build body. send transaction failed. what's wrong ?

Dave Martin: Hi guys this might be a bit of a strange one but I’m just reaching out as I’m looking for someone that can launch projects on Ton and has access to the Ton community.   So I’ve had quite bit of work done on my project that was going to launch on BSC.   I have token staking, website, dual token lottery, NFT staking with APR boosters and a game dev building me a battle game similar to Fortnite.   My partner who’s the Dev was meant to be launching for me but he’s really busy with his job.   So I’m kind of stuck looking for someone that may be interested in coming onboard as a full partner and help me launch these products on TON.   As I said the original plan was to launch on BSC but I’ve been researching about TON and love what you guys are doing.   I am really not tech savvy so have no clue to launch everything So I’m trying to find someone capable of launching everything on TON and is capable of reaching out to the huge Ton community in return for becoming a equal partner in my project and helping me do some great things.  If there is anyone that’s up for coming onboard on this with me you can DM me then I’ll be able to show you what I have already built ready to go.

meomeocoj | Mike: hi i'm tracing a transaction on testnet, but seem the rpc not working well to trace the tx

meomeocoj | Mike: Are there any alternative testnet rpc for ton ?

NICK: I got a weird error with my android tonkeeper wallet. 5 wallets were setup and now when opening them they are gone. App asks me to configure wallets again. Does anyone know the file extension for an android tonkeeper wallet? Seems to me that these files have been unlinked from the tonkeeper wallet

Орельан [NEVER DM FIRST]: Hey there guys, i got a question. Does the boc of a mempool transactions hold where that transaction is going and the full payload?

Pouya: how about this situation: I want to deploy an NFT collection(imagine a Number collection, any item is a positive number) that anyone can mint one or many desired numbers. for example: how should we check that number 45632  is minted or not? in normal situations and without limits in storage, etc. I think a map can be a good idea  regarding TVM and Tact documents any smart contract can have about 65000 cells and it constrains the storage limit of maps to be about 30000 key-value pairs for the whole contract constrains the storage limit of maps to be about 30000 key-value pairs for the whole contract.  conclude that a map is not a good idea for handling the collection with a lot of items and we can not use incremental ID for this type of collections  I have an idea but the implementation is not ready yet, I will share it here to discuss about it ASAP  but if there is any solution I'm happy to listen, learn and discuss about that      https://docs.tact-lang.org/book/maps#limits-and-drawbacks (reply to 74240)

&rey: 1. I'm not sure you even need a collection at all; 2. Let NFT itself check whether it's minted or not. (reply to 74273)

Pouya: but we should have a master collection with child item with NFT TEP abstraction  and how to Let NFT itself check whether it's minted or not? (reply to 74274)

&rey: Role of collection can be significantly reduced. NFT is a smart contract, so it itself can be responsible for storing whether it is minted appropriately or not. (reply to 74275)

Pouya: do you accept this: the mint function should be in collection contract and the collection contract should deploy child(item) contracts? (reply to 74276)

&rey: No to both. (reply to 74278)

Pouya: I cannot understand  Could you please provide more description? (reply to 74279)

&rey: Collection MAY be a contract that simply provides common metadata and interface for calculating NFT address by index. In particular, collection MAY or MAY NOT know if an NFT is deployed while calculating its address. (reply to 74280)

&rey: NFT is a smart contract. NFT MAY be deployed by anyone; it MUST store collection address; it can store flag which would indicate if it was initialized appropriately (for instance, with all appropriate payments going through it).

Anon: Hi how to get from public key address of TON wallet what hash it crypting when going from public key to address and what to make to made address from public key?

&rey: public key —> wallet initial data cell —> wallet initial state (StateInit) —> representation hash (SHA-256) is hash-part of address, workchain is usually 0. (reply to 74285)

Anon: we have this all alredy but how to give public addresses from public key (reply to 74287)

Pouya: how should we restrict items to not be duplicated? for instance, user A mints (or deploys manually with correct init cell data) and after that user B does it again (item 4545)  if we provide the owner address in the init data, then the number 4545 has two duplicated item  I think the collection contract should store the valid item address (reply to 74284)

&rey: Make init data not contain the owner address, then. Or contain two zero bits (null address) instead. (reply to 74290)

Pouya: and how to set the owner? after deploying? and if we have a function that sets the owner and we put a condition to just be able to invoke onetime what is someone set the owner faster than us?  I have this idea: deploy the item contract without the owner address in the init data but send the setOwner invoke command in the deploy message body (reply to 74294)

Орельан [NEVER DM FIRST]: Does anyone know some deep/complete literature about fundamentals of how TON works? I'm coming from EVM and that's kinda hard honestly to get on Ton's page. Especially that BOC stuff

&rey: What happens? Exactly same as if collection received request for mint earlier. (reply to 74296)

&rey: https://docs.ton.org/learn/docs really helps. Also, forgetting about EVM is often a good idea. (reply to 74297)

Pouya: and when the collection contract wants to check if the number was minted or not, just calculate the address of the child with constant init data(number, collection address, etc) and send a message with a predefined structure  if item(child) response to the message then the collection can return an error that the number minted and if collection did not received reply from child generated addresses or got error then the item did not minted and able to minty (reply to 74298)

Орельан [NEVER DM FIRST]: Thanks, i kinda skipped those even tho they are probably the most complete lol (reply to 74299)

Pouya: If my solution is ok in your opinion  Im excited to implement a sample and share it with community @pcrafter (reply to 74300)

Ionelion: Hello ,Can someone help me convert an Invoice URL from wallet ton org to HTTPS? There is a way to do this on ton hub, but I would like to do it on wallet ton org

&rey: I still think there is no invoice URL for wallet.ton.org. Is there? (reply to 74305)

Ionelion: How can I achieve a result like the one in the picture? What do I need to implement when adding a URL in my bot to display the result as in the picture ? (reply to 74306)

&rey: 1. This is completely different service, it is not TON's — it is Telegram Wallet. (reply to 74309)

Ionelion: How could I achieve that result in the picture, using the Telegram wallet? (reply to 74310)

N: Hey guys, I'm a bit confused and don't know which SDK to use. Should I use:  - TMA SDK React: https://docs.telegram-mini-apps.com  - TWA-Dev SDK: https://docs.ton.org/develop/dapps/telegram-apps/app-examples  Can someone help me with this?

Ionelion: I can't find any way to generate a payment link with Telegram Wallet. (reply to 74310)

Pouya: May I know your opinion about this solution?  @pcrafter (reply to 74300)

&rey: I think you should skip the step with collection and send mint message to NFT itself. (reply to 74315)

O: Up (reply to 74312)

Pouya: Do you mean this : sent a message to deploy an NFT contract(item) with init code and init data(metadata,collection address, and do not provide owner address in init data) + put setOwner(deployer_address) function invoke  to the body of message  if contract with the provided init code and provided init data(metadata,collection address) did not exist it will be deploy and the setOwner will invoke exactly and nobody can invoke setOwner() faster  and it the provided init code and provided init data(metadata,collection address) exist, we got error   Have I understood correctly? (reply to 74316)

Ionelion: no one can help me ? How can I achieve a result like the one in the picture? What do I need to implement when adding a URL in my bot to display the result as in the picture

𝚕𝚞𝚗𝚊𝚝𝟷𝚔: Guys, please help me how to create a comment for a transaction if it is long. I use pytonapi and pytoniq-core  Code comment: payload = begin_cell().store_uint(0, 32).store_snake_string(comment).end_cell()  Error: if bit_length == 0 or len("{0:b}".format(number)) > bit_length:                               ^^^^^^^^^^^^^^^^^^^^^^ TypeError: unsupported format string passed to Cell.__format__

Dmitry | backend4you.ton: Public key is not enough to compute address. Different wallet versions will result in different addresses for same public key. (reply to 74289)

Dmitry | backend4you.ton: Ask in @devs (reply to 74312)

r_os_e: hey guys ready to hire someone. have spinners.t.me and @spinners and t.me/spinners and spinner.ton  making a TON gambling wheel.  to apply please send me what you have made  want it to be a telegram bot. Accessible from telegram app.  send me:  what you have made in TON network flat price timeline (reply to 72895)

Alex: Hi guys, I'm giving up, can anyone help? What am I doing wrong? The code doesn't trigger correct transfer popup All it shows is TON transfer instead of jettons I've tried to send USDT and GOMINING jettons

&rey: Well, nested tx seems correct? (reply to 74390)

Alex: Is it? Anyway it doesn’t work with usdt this way

Alex: with usdt it looks like this And if I proceed, only TON is being sent, but not USDT 🥲 (reply to 74392)

Marc: Hello guys. I've been looking for a bot or an app that can help me in the management of my group. I need users who apply to join the group to connect their wallet and their wallet to be checked for a token balance. If they have the token, I need to check if the amount they hold is higher than a number in order for them to be accepted in the group. Did anyone come across something like that on TON? It's something similar to the Collabland bot for EVMs. Thanks.

— 2024-06-25 —

Money: i was converting my wton to ton using the official bridge site. the tx was being done on my metamask browser which was 'duckduckgo'. it created the bridge tx, went thru the approve, the 65 blocks, and was doing the layers, and the phone closed on me, when i went back into mm and the browser, the wallet was disconnected n tx wasnt there once i conneceted

Tom: Hi guys. Does anyone know is there any way to increase the speed of transactions being included in the blockchain?

Triệu Hồng: Why can't I call this contract??? it returns as below

Triệu Hồng: These are the data I passed in

Triệu Hồng: Please help me, I don't understand why I can't call the contract but I really don't know what I'm doing wrong

gimbljimbl: 2k (reply to 74217)

gimbljimbl: This is big (reply to 74232)

User<6667113250>: Hi

Otto: Hi everyone! I'm going to write TG mini app and build it in my web server. It will be a game. So, what's better to choose: python for backend and Flet (python framework) for frontend or python for backend and JavaScript for frontend? I have experience in both python and JavaScript

^_^: Hi everyone, How to install @tma.js/sdk-react to Next.js manually? I've installed but have some errors. Currently I'm using app-router. And if I use telegram mini app nextjs template, how to change the color of font and background? Please let me know.

^_^: Hi @pcrafter  Please help me...

马币换usdt，人民币换马币汇率：诚信可靠，📣马币支持银行转账/现金存款 🔘保干净款项有问题全额赔偿 : TGtmitHySoJgLBEkteLtcB6mRhc8DzMnAQ

Jimmy Becen: hi guys How can I send a transaction consisting of multiple messages with TonClient, I can do the same on dapp with TonConnectSDK

User<6397988095>: @sweetdream0118

User<6397988095>: this is scammer

User<6397988095>: I think this is chatgpt 0.01 (reply to 74463)

User<6397988095>: @tsivarev  plz kick this shit guy

Pouya: But this is not a large number nft collection, you can handle it by simple nft collections contract codes (reply to 74426)

🅰🅻🅰🅽: Does anyone know why the original Jetton standard design didn't allow burn to also carry forward_payload? I feel that if it did, burning could be more flexible.

test: pls explain why I am a scammer? (reply to 74466)

test: I think you seems to be a scammer (reply to 74467)

test: @Wagmidevs This is a scammer and fucking guy

Klay.D: hi, could anyone help me with this question? Could the key insertion order (asc or desc) of the dictionary make the binary tree imbalanced and lead to inefficiency in read operation?

Buggy: Can someone please clarify me, TON smart contract will store data in its contract? nor the chain like EVM? If so, wouldn't the contract will be crashed at some point if the data growing and crashes the size limit along passing time?

Linthero: How could I add custom token on Tonkeeper (testnet)?

j: Hi, how can anyone suggest how I can send NOTCOIN via sendTransaction method of TonConnect UI?

&: https://docs.ton.org/develop/dapps/ton-connect/message-builders (reply to 74489)

&: At the settings tab, find "Tokens". (reply to 74486)

Dinkar: Hey are there any legal issues with Gambling games on TON and Telegram?

Dinkar: I mean can someone launch GambleFi mini apps on telegram? (reply to 74500)

Skwad: Has anyone have any luck embedding cocos creator game build into their app since telegram doesn't allow the use of Iframe, object, or embed?

Willie: Hey everyone. I'm playing with the idea of moving the project I'm working on to TON, but there's one crucial part that I need to know and which I wasn't able to find in the docs. Does TON support extended public keys and derivation of new addresses from the xpub? Or is there maybe a different system with similar functionality?  I'm working on a product which requires custodial wallets for users and I don't want to generate private keys for every single one of them due to security reasons. EVM chains allow me to derive master key from the seed, derive xpub from the master and then derive new wallets without generating individual private keys for them unless the funds needs to be moved. I've got the whole infrastructure mapped out and it's working on EVM chains, but I have no idea how to replicate it (if even possible) on TON.

Trassos: By mistake, I deployed a smart contract on the mainchain on TON. That drained some coins from the account. How strange it was to see them back in the wallet today.

&: Which contract did you deployed? Is there any ton sending features in that contract? (reply to 74513)

User<319932362>: Hey guys, is there any solution to integrate passkey with Ton Wallet yet? For now, TVM supports secp256r1 (P256) already but seems that Wallet contract only supports ed25519

Teiv 🦴: That's a WOW. (reply to 74513)

&rey: You probably forgot that USDT has multiplier of one million instead of one billion (decimals=6). (reply to 74393)

&rey: You can use different subwallet IDs and the same keypair. You can use non-HD ways to derive seed (and individual keypair) from user ID and master seed. (reply to 74512)

Ram: Anyone know why jetton transfer bounces and gives this error? Using tonconnect/react-react-ui https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer-with-comment

&rey: I've seen that Telegram prohibits that. TON has no issues with such. (reply to 74500)

Willie: Thank you very much! (reply to 74526)

&rey: Entries are sorted by key. Indeed, specific set of keys can make the tree imbalanced and lead to inefficiency in reads and writes. (reply to 74478)

Dinkar: So can't launch a GambleFi app as a telegram mini app? (reply to 74528)

Coindrop_support: 👋

&rey: Yes, data is stored in contract. If data grows, transactions on contract will indeed fail when limit is reached. (reply to 74481)

Dinkar: This is sad. (reply to 74532)

&rey: Well, for one, you're trying to call jetton receiver without sending any jettons? (reply to 74418)

&rey: There is none. (reply to 74409)

Klay.D: thank a lot, what do you mean by specific set of keys? Is a sorted set one of them? (reply to 74531)

&rey: Order of insertion doesn't matter. I mean something like b00001, b00011, b00111, b01111, b11111. (reply to 74538)

Dinkar: Hey @pcrafter , I believe it will hinder on boarding a big gambling community on-chain.  Can telegram change their thinking around it? (reply to 74532)

&rey: This is offtop for this chat, and actually speculation is pointless. I believe your best bet would be to contact Pavel Durov during a conference. (reply to 74542)

Dinkar: I know that I would have done that if I had the money to travel lol. (reply to 74543)

Dinkar: I was building something around both GambleFi and GameFi myself.

Ankit j: I see that on Ton there r liquidity pools, Automated market makers.etc. does these supply the liquidity to the newly launched tokens at token ?

&rey: One who creates a liquidity pool supplies the liquidity. Though, users can add more. (reply to 74547)

سنــتــــریـــــچ: Does anyone here has written a code that creates TonWallet with python?

Ash: Hi Devs,  Need help‼️‼️‼️  I want to create a public function in Tact language to mint tokens for users who complete certain tasks. The challenge is ensuring that only users who have completed the tasks can claim the rewards, as a public function could be accessed by anyone. How can I restrict access to the claim function so that only eligible users can claim their rewards?

Vitor: Sign a message using a backend, give the signed message to the user, test the signature using ecrecover, mint tokens when the signature check suceeds. (reply to 74554)

Vitor: Add a nonce to avoid replay attacks as well.

سنــتــــریـــــچ: Hi i am using ton lib to create an wallet  it creates it and i print the address  EQBnllcZb3EuS60xsk9rcDiPCyBP_F0qVYUsTu_N0BQB2AXp and i login into the ton keeper with 24 words but the Ton address is different  UQCmwh0Y9r9R0Er5fjVfmL9_fxjcgoj86LK2ps3IIu5Q205c  Could you tell me why?

&rey: Different wallet versions. Maybe different subwallet IDs. (reply to 74575)

سنــتــــریـــــچ: i mean is it ok to send ton in the first on? (reply to 74576)

&rey: If you send TON to the first one, you'll have to use tonlib to operate the wallet. (reply to 74578)

سنــتــــریـــــچ: nonexist is the status of account   to activate it i have to send aome ton (reply to 74579)

&rey: To send some TON and StateInit. StateInit is normally provided at first outgoing transaction. (reply to 74580)

Guillaume: Hello, when I use the sendTransfer method, I'm having the error "extra data remaining in deserialized cell" does anyone know what it could be ?

prodvd: Hey TON devs!

bharath: hi can somebody guide me decoding body cell from actions in events (ton-SANDBOX)

c: Is it possible to withdraw TON from a contract address?

meomeocoj | Mike: hi guy how i get the jetton wallet code of usdt

meomeocoj | Mike: yeah i've checked it but it's boc seem smaller than i copy and compile locally

Ankit j: Once we have build the webapp, do we have to submit for approval to telegram on adding to their app center ?..is it really mandatory step?

c: just waiting for the dev of the contract to message me back, fingers crossed he included a code for withdrawal (reply to 74598)

c: could you send me a dm please (reply to 74598)

Ankit j: Anyone knows ? (reply to 74600)

&rey: Of course. It is a library cell — reference to library containining actual wallet code. (reply to 74599)

Lurpis Wang: hey guy, we are trying to build a trustless cross-chain bridge for Ton Network through light nodes. Do you have any response to the following three questions?  1. Light client specification, that allows resource constrained devices cheaply verify TON's consensus  2. State commitment scheme specification, how do TON network merkelize smart contract state? 3. Header anatomy, do TON network include the state commitments in their block headers?

Paul: hi, what is best solutions to check a transaction is confirmed?

meomeocoj | Mike: Thank u, library reference really a new concept for me. (reply to 74614)

Орельан [NEVER DM FIRST]: Hey there guys, am i supposed to be able to get basic fields when ever i am deserializing the BoC of a mempool transaction? Such as the destAddress, and the payload etc.. ?

~/takezō: Hello I have a question regarding the NFT sale on Getgems (V3R3).  Specifically, how to properly deploy the sale contract. I have this payload, but I don't know where to send it. Sending it to the official Getgems marketplace address doesn't work; it just returns "exit 0 ok," and the contract itself is not deployed.   const saleData = {         isComplete: false,         createdAt: Math.ceil(Date.now() / 1000),         marketplaceAddress: Address.parse('EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS'),         nftAddress: Address.parse(nftItemAddress),         nftOwnerAddress: Address.parse('UQCjt7MJA7vW40OSPTAWaFFCjVobTpttwr5iHyFl2QRdjdII'),         fullPrice: toNano("1"),         marketplaceFeeAddress: Address.parse('EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS'),         marketplaceFee: toNano("0.05"),         royaltyAddress: Address.parse('UQCjt7MJA7vW40OSPTAWaFFCjVobTpttwr5iHyFl2QRdjdII'),         royaltyAmount: toNano("0.15"),         soldAt: 0,         queryId: 0     };      const data = createDataCell(saleData)     const code = createCodeCell()      const stateInit = beginCell()           .store(storeStateInit({code, data}))           .endCell();      const payload = beginCell();           payload.storeUint(1, 32);           payload.storeUint(0, 64)           payload.storeCoins(toNano("0.05"));           payload.storeRef(stateInit);           payload.storeRef(new Cell());      const { contract, keyPair } = await openWallet()     const newSeqno = await contract.getSeqno();     console.log(await contract.sendTransfer({         seqno: newSeqno,         secretKey: keyPair.secretKey,         messages: [             internal({                 value: "0.05",                 to: 'EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS',                 body: payload.endCell(),             }),         ],         sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,     }));    DATA CELL:      const feesCell = beginCell();      feesCell.storeAddress(saleData.marketplaceFeeAddress);     feesCell.storeCoins(saleData.marketplaceFee);     feesCell.storeAddress(saleData.royaltyAddress);     feesCell.storeCoins(saleData.royaltyAmount);      const dataCell = beginCell();      dataCell.storeUint(saleData.isComplete ? 1 : 0, 1);     dataCell.storeUint(saleData.createdAt, 32);     dataCell.storeAddress(saleData.marketplaceAddress);     dataCell.storeAddress(saleData.nftAddress);     dataCell.storeAddress(saleData.nftOwnerAddress);     dataCell.storeCoins(saleData.fullPrice);     dataCell.storeRef(feesCell.endCell());     dataCell.storeUint(0, 32)     dataCell.storeUint(0, 64)      return dataCell.endCell(); }

Paul: I don't know about getGems. But if you deploy your own smartcontract, should have compiled code. If you call to smart contract of getGems, it should have a optscode.

&rey: If an API returned it, then it is confirmed and final. (reply to 74625)

~/takezō: I have the cell with compiled standard code for nft sale (createCodeCell()) (reply to 74644)

&rey: 1. Please look at pytoniq code and its trust levels. 2. Everything is stored in tree of cells, with up to 4 references from each cell. 3. Please look at pytoniq and block.tlb. Probably the merkle update is in block itself. (reply to 74624)

&: You have to know the structure of the boc. Then you can deserialize that boc with datas like cell and uint etc... (reply to 74637)

Орельан [NEVER DM FIRST]: Thanks for the answer, yeah i read about the fact that you need to know the structure to deserialize the boc, but since this is a mempool tx, isn't there a pre-defined structure for external messages holding basic data fields? (reply to 74650)

Paul: console.log(await contract.sendTransfer({         seqno: newSeqno,         secretKey: keyPair.secretKey,         messages: [             internal({                 value: "0.05",                 to: 'EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS',                 body: payload.endCell(),             }),         ],         sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,     }));  Seem this  transaction just send like send ton to EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS. I view some transaction in this, it always include an optcode in msg body. Is your code  followed a documents of getGems? (reply to 74646)

Laop: Hi ! Trieing to initiate a transfer of ton but got this error , any one know a solution ?   const response = await wallet.methods       .transfer({         secretKey: 'secretKey.......',         toAddress: 'address.........',         amount: TonWeb.utils.toNano("0.01"), // 0.01 TON         seqno: seqno,         payload: "Hello",         sendMode: 3,       })       .send();  LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

~/takezō: But I have an OptCode = 1   payload.storeUint(1, 32); payload.storeCoins(toNano("0.05")); payload.storeRef(stateInit); payload.storeRef(new Cell()); (reply to 74655)

Paul: What does Optcode 1 mean for contract getGems?

&rey: This is not the full error. Please send the part with TVM trace. (reply to 74656)

~/takezō: I dont know) I get it from the ton documentation https://docs.ton.org/develop/dapps/tutorials/collection-minting#deploy-sale-contract (reply to 74658)

&: tx hash plz (reply to 74660)

Paul: Oh, optcodes 1 is deploy new contract. but seem EQBYTuYbLf8INxFtD8tQeNk5ZLy-nAX9ahQbG_yl1qQ-GEMS is not a marketplace address. (reply to 74660)

Paul: https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-marketplace.fc

Paul: your should deploy your nft-market place first.

سنــتــــریـــــچ: hey mate, i tried sending some ton in my wallet created by ton  it still says nonexist (reply to 74581)

Crypto Notte: We are looking for someone to do a couple hours paid consultancy for us and help us deploying Wallet w5 from Tonkeeper and do a batch of transactions in TS. Reach out to us if you can help ✈️

Valamar.$888: Guys I have a interesting idea : what if there was a no code platform that allows user to deploy smart contracts or build DApps or website upon the TON Blockchain platform so is there who like the idea

SePi: Mate, the developer needs to write the smart contract by themselves (reply to 74693)

Valamar.$888: Yeah they had to do the basics structure and functions but maybe through the help of AI the smart contracts could be better through expanding the opportunities possible also the users develop them but in a more user friendly interface which they can use multiple fundamentals to build and deploy their projects. (reply to 74699)

SePi: Users should aim to become developers, not just ai tool users (reply to 74701)

SePi: @pcrafter what do you think sir ? (reply to 74702)

Valamar.$888: Well they are developers cause they are developing their idea 💡💡💡 (reply to 74702)

Valamar.$888: Don't you think platforms like bubble or Wiz have helped the internet grew and had helped many start building projects or even start learning to be "developers"

SePi: Designing and arranging the layout and components for the visual appearance of the platform, yes, I agree, this is great idea in TON  when it comes to smart contracts, I don't see these two aspects on the same level. so , user need more knowledge to write smart contract (reply to 74705)

prodvd: Hey guys.  Jetton with tax on TON is possible or not?

kevin: anyone know  is there API to check a contract is verified or not by its address?

Mehdi: Anybody knows rewards-1000.ton

Mehdi: This is tonkeeper transaction history, I received it and guide me to make a transaction to reward me TON, I think this wrong , I just received TONs from my bounty reward

Mehdi: Can anyone help, any idea

Амир: Teach me how to get bounty rewards pls (reply to 74729)

Coalus: u got scammed (reply to 74731)

Mehdi: And nobody can help , it was a bitter experience (reply to 74733)

Mehdi: By bounty program (reply to 74732)

Mehdi: I am not alone, scam is going

Mehdi: Search TON bounty program (reply to 74736)

Mehdi: How we can prevent others from being scammed , or is there any way to pursue it, in which account it will be cashed? Do you or other have any idea (reply to 74733)

~/takezō: I created a standard marketplace contract. when I send my payload, it creates a new sale contract but it's nonexist and not sale_v3 type... (reply to 74663)

— 2024-06-26 —

•: For basic transactions like creating non fungible jetton or fungible Jetton  or business logic like vesting it would be great to create this tool not for developers, but for usual ethusiastic customers (reply to 74693)

•: You can write a loop for check if statement changed every 1-2 seconds in typescript. It would be great solution for you own. (reply to 74625)

•: If there is a function for withdraw -> yes, if not -> no (reply to 74593)

Paul: something wrong here. your contract (mean market place) you call to still not exists and balance = 0. (reply to 74755)

&: Maybe your contract deploying tx have some problems. Check if you added stateinit. Your deploying tx is just a ton sending tx. (reply to 74755)

L (😇,🪽): anyone know how to add lp on stonfi in 4 step like this image ?

&: Just send tx like that (reply to 74775)

&: There's nothing special there.

Paul: stonfi have sdk that provide this function. (reply to 74775)

&: Be careful, Ton / usdt Rewarding NFTs are all scam. The TON wallet drainers made that.

MRT: https://github.com/mrtnetwork/ton_dart

eden: I get an error(cannot apply external message to current state : Failed to unpack account state) when deploying a highload wallet using python sdk, can somebody help?

Elite : Karma Hits Back: Retrieve user profile information and check for the presence of the premium badge. (reply to 74787)

Klay.D: hi, I have a kind of proxy contract that always forwards all incoming ton to another contract, so the proxy balance will always be zero. In blueprint test, I log the transactions fee of proxy contract and see that the storageFeesCollected is always 0 and storageFeesDue keeps increasing over subsequent transactions. Does that mean the proxy contract is never charged on storage fee or it will be frozen at some point in the far future?

Ankit j: How the valuation of new project launches works at Ton Ecosystem, I mean price per token valuation?

cindy: I need your help.How can i send transcations of request params like this to ton?

cindy: The message data structure is map and struct.

Ankit j: Anyone knows? (reply to 74796)

csyr: thank you , i found there is a field to indicate in init token (reply to 74793)

&rey: Whatever the project deposits in a liquidity pool, determines the price of their jetton. (reply to 74796)

&rey: Does your wallet have nonzero balance? (reply to 74790)

&rey: Here they are: https://github.com/ton-society/grants-and-bounties/issues. (reply to 74732)

&rey: In my opinion, developers (on TON, and actually on any platform) should think where the data to run their algorithms is stored, and how to get exactly those pieces of information which are required. In EVM, it is somewhat alleviated by instant cross-contract interaction, but on TON this is the second most-important problem when writing smart contracts (the first being how to allocate TON to messages and balances). Whatever IDE or AI provides useful tools for that, can be used, I think. (reply to 74703)

eden: No, my addres has some TON

Aibar: is 5 ton on bridge hardcoded value?

charlie: is there any doc to introduce how many transaction types? like transfer or stake and so on..

Ehsan: Hello guys  how to decode Bag of Cell (BOC) to get transaction info?

&: You should know the tx structure, and decoding BOC is not smart. Plz check on tonapi.io (reply to 74834)

Ehsan: I want to verify transaction without using payload message. create unconfirmed invocie with BOC and later on confirm it whenever the transaction is confirmed on blockchain. (reply to 74835)

&: There's detailed doc about tx structure at https://docs.ton.org/. (reply to 74836)

Mehrdad: hi, how can i access to TON wallet with mnemonic phrases with python, any lib or api?

Panda: testnet getTransaction with follow error: {   "ok": false,   "error": "LITE_SERVER_UNKNOWN: cannot compute block with specified transaction: cannot find block (0,f78b4425abb825ac) lt=22841388000001: lt not in db",   "code": 500 }

Panda: Could anyone help me?

Guillaume: is it possible to get the transaction hash from the Cell or get it after the transaction is sent to the rpc ?

eden: Yes, my addres has some TON 0.18 (reply to 74809)

itay: tonsdk on pip/github (reply to 74839)

Ankit j: Deposits in liquidity pools are done by investors and they choose to deposit into newly launched coins on Ton ? (reply to 74807)

Super Man: Hello everyone. I am using ton wallet, how to add jetton token and view it in ton wallet? please let me know kindly

User<7198880727>: Hello everyone good morning. Today I started my day bd signup for a tin wallet but few minutes after I did I received this message. I checked the person wallet and made research I also went to minter on ton.org I am surprised someone sent me all this. Please what can I do with it or maybe what I mean is that what is the next step for me. Thanks

•: You must write jetton master contract on func or tact which mint jetton wallet for each consumer. (reply to 74858)

•: Very interesting beginning Looks like spam/scum (reply to 74863)

User<7198880727>: Ha I don’t know any of that

User<7198880727>: Really (reply to 74865)

•: Write what about this story will end (reply to 74866)

&rey: IIRC deposits in liquidity pools are done by creators. (reply to 74851)

Haris: I am receiving following error while deploying on testnet will somebody help:  AxiosError: connect ECONNREFUSED 127.0.0.1:8080

&rey: You can't get transaction hash in advance of it being actually recorded in blockchain. In particular, RPC cannot return it. (reply to 74846)

&rey: What do you mean by "add jetton"? (reply to 74858)

Super Man: I minted jetton to my wallet. so I am going to check if my wallet has jetton. how can I check it? (reply to 74873)

&rey: Wallet apps (Tonkeeper, etc) and explorers (Tonscan, etc) should already show it. (reply to 74874)

Super Man: I am using ton wallet.

&rey: pytoniq supports that (reply to 74839)

&rey: Well, it doesn't support jettons. You can use another wallet app, setting the same mnemonic. (reply to 74876)

Super Man: oh! okay. thank you so much. :)

Haris: please help (reply to 74871)

Daniel: How can I hardcode address to send a message in FunC?  P.S. The code is correct, I tested it with sender to sender address, but it doesn’t work with slice 0:00000…  UPD: Just add “a” in the end of the string: “0:00000…”a  https://docs.ton.org/develop/func/literals_identifiers#string-literals

gammar: looking for skilled web3 dev. hourly rate : $3-4

Ankit j: Great thanks, but if project creators doesn't have required fund to put into the liquidity and project is solid, can create good demand over ton and crypto space, then how the liquidity supplied to token at Ton ? And automated market maker way for such project  ? (reply to 74870)

Valamar.$888: Hi guys I have another interesting idea I need to show you . It's about a new Consensus mechanisms that can be used in the TON Blockchain platform and network . Well it's not maybe completely done but I like it . Anyway review it and tell me your thought.   Proof of Reserves (PoR) is a consensus mechanism that ensures nodes have sufficient financial backing or resources to validate transactions and add new blocks. This concept is particularly useful for enhancing transparency and trust in blockchain networks, especially in contexts like stablecoins, exchanges, or financial services.   Overview   Proof of Reserves (PoR) requires nodes to demonstrate they possess a certain amount of reserves or assets before participating in block validation. This mechanism ties the security and reliability of the blockchain to the tangible resources held by the validators.   Key Components  1. Reserve Requirements :    - Minimum Reserve Threshold: Nodes must hold a minimum amount of reserves, which could be in the form of cryptocurrencies, fiat money, or other assets.    - Periodic Audits : Reserves are periodically audited to ensure compliance. Audits can be conducted by third parties or through on-chain verification mechanisms.  2. Verification Process:    - Proof Submission : Nodes submit cryptographic proofs of their reserves. These proofs can be linked to external audits or on-chain data.    - Public Ledger : Proofs of reserves are published on a public ledger for transparency, allowing the network to verify the authenticity of the claims.  3. Validation and Consensus :    - Eligibility Check : Only nodes that meet the reserve requirements are eligible to participate in block validation.    - Stake and Penalty: Nodes may need to stake a portion of their reserves as collateral. If they act maliciously or fail to maintain the required reserves, they forfeit the staked assets.  4. Incentives :    - Rewards :Nodes that successfully validate blocks receive rewards, which can be proportional to their reserves.    - Reputation System : Nodes earn reputation points for maintaining reserves and acting honestly, which enhances their chances of being selected for future validations.  5. Security and Transparency:    - Anti-Sybil Measures :  Requiring significant reserves prevents Sybil attacks by making it costly to create multiple fake nodes.    - Transparency : Regular publication of reserve proofs ensures transparency and builds trust in the network.  Advantages :   - Increased Trust: Tying validation power to tangible reserves enhances trust and reliability. - Security: Significant reserve requirements deter malicious actors and Sybil attacks. - Transparency : Public proof of reserves ensures accountability and transparency.   Challenges :   - Reserve Verification: Ensuring accurate and tamper-proof verification of reserves can be complex. - Barrier to Entry : High reserve requirements might exclude smaller participants, leading to potential centralization. - Audit Reliance: Depending on external audits can introduce additional complexities and trust issues.    Implementation Steps :   1. Define Reserve Requirements : Establish the types and amounts of reserves required for nodes to participate in validation. 2. Develop Verification Mechanisms : Create cryptographic proofs and audit procedures to verify and publish reserves. 3. Design Incentive Structures: Implement reward and penalty systems to incentivize honest participation. 4. Implement Security Measures: Introduce measures to prevent Sybil attacks and ensure the integrity of the verification process. 5. Ensure Transparency: Regularly publish reserve proofs on a public ledger for community verification.  Example Scenario:   1. Reserve Declaration: A node declares it has 1,000 tokens as reserves.

Super Man: Hello, I've installed ton keeper pro. would you please let me know how to set testnet on it kindly? (reply to 74881)

Valamar.$888: 2. Proof Submission: The node submits a cryptographic proof of these reserves, verified by an on-chain mechanism. 3. Validation Eligibility: The node becomes eligible to validate blocks, staking a portion of its reserves as collateral. 4.Block Validation: The node participates in validating transactions and adding new blocks. 5.Audit and Verification: Periodic audits ensure the node maintains the required reserves. Successful audits increase the node's reputation. (reply to 74896)

Valamar.$888: So in my thoughts by focusing on financial backing, Proof of Reserves could provide a secure and transparent consensus mechanism particularly suitable for applications where trust and transparency are paramount.

Vitor: So, Proof of Stake? (reply to 74901)

Valamar.$888: Yeah type of (reply to 74902)

Valamar.$888: But still working on this do you have any suggestions (reply to 74902)

Thành Lê |: hey can we burn and storage usage and claim the fee back? If yes where can I find the document sers?

Vitor: There's hundreds of variations of PoS out there. Take some look at the Avax papers, as it's well written and academic, learn how to simulate this, and if you have novel results, share. Quite frankly, what you shared so far is so generic that i won't critique. (reply to 74904)

Valamar.$888: Thnx so much (reply to 74908)

&rey: Do you have any issues with current TON model? (reply to 74904)

Ankit j: Any input on this ? (reply to 74895)

Valamar.$888: It's not that I have issues only with TON , but I hate PoS so much that I don't know where this hate comes from , and I was looking if new Blockchain networks use other Consensus Mechanisms (reply to 74911)

Valamar.$888: Like PoS gives a sense of centralisation to the whole network

&rey: Please don't let emotions cloud your judgement, as in Web3 it may lead you to taking more risk without associated gains. (reply to 74913)

&rey: Generally, such premise is not satisfiable. Though, anyone can deposit liquidity, so investors can. (reply to 74895)

liaaa: I have submitted a request, but it has not been reviewed until now. how is that?

Cedric: Good morning everyone, I'm looking for some guidance on how I can get a token verified on TON? It was launched via gas pump and it is on dedust now. Could anyone help me with this? Thanks in advance!

Thành Lê |: hey anyone know that? (reply to 74907)

Anastasiia: Hi! I have few questions:   Docs which describe storage fee contain the following statement: "Only unique hash cells are counted for storage and fwd fees i.e. 3 identical hash cells are counted as one". But it seems to be related to the unique hash cells in scope of a currently executed contract and if we have few contracts that need the same code, we may use library cells.   So the question is: If we store the same data in the library cell, how storage fee is calculated if we have many contracts using it? Are library cells actively used on mainnet or is it a perk for better future?

Anastasiia: If you reference the refund from EVM, where if you delete the contract, you get some ETH back, it's not working this way on TON. Storage fee on TON is paid for the time your contracts exists on-chain and is charged every time someone sends the message to the contract, so there gonna be no refund. If your contract has too small balance to pay, it will be frozen. The most you can get is the contract's balance that left on the contract when you delete it.   https://docs.ton.org/develop/smart-contracts/fee-calculation#storage-fee (reply to 74907)

Alexander: Hello! Is there any API to get info about jettons mints? Toncenter v3 provides info about jetton burns, but it seems there is no endpoint to get the same information about mints

Thành Lê |: hey thank you for yỏu really detail answer! (reply to 74935)

Thành Lê |: btw, we don't support to burn/delete a contract, right?

Anastasiia: To destroy the contract, the contract itself must send a message with flags CARRY_ALL_REMAINING_BALANCE | DESTROY_ACCOUNT_IF_ZERO (128 |32) (reply to 74939)

Anastasiia: Here is an example: https://github.com/ton-community/fireworks-func/blob/main/contracts/fireworks.fc#L342 (reply to 74940)

Thành Lê |: hey could you also share for me (reply to 56310)

Liu Queng: Anyone know about this? I sent "boc":"te6ccgECBQEAARUAAkWIAWTtae+KgtbrX26Bep8JSq8lFLfGOoyGR/xwdjfvpvEaHg" to the chain and get this error.

User<7198880727>: https://tonviewer.com/EQDGJEwGpdrHhetVbUO9x4bHZTCK0yFfcwjXIW8Itv0ehTEh   This is the Jetton. Also sent me many other things . I don’t know why and I don’t know how to move forward. If there is anyone that can help me understand I will be here. Thanks (reply to 74869)

charlie: Hi team，could you share how to get the latest workchain block？

Illia: What's the difference between HASHEXT_SHA256 and HASHEXTR_SHA256 TVM opcodes? Clearly, the second one contains extra R. However, descriptions of the opcodes are identical.  Calculates and returns hash of the concatenation of slices (or builders) s_1...s_n.  Calculates and returns hash of the concatenation of slices (or builders) s_1...s_n.  Is the difference that HASHEXT_SHA256 calculates the hash like sha256(a, b) and HASHEXTR_SHA256 just swaps the 'arguments', i.e., sha256(b, a)

Ankit j: That's really cool, investors do deposit liquidity to the newly launched tokens.. (reply to 74919)

Illia: https://toncenter.com/api/v3/#/default/get_blocks_api_v3_blocks_get (reply to 74949)

Illia: is it base64? seems like you encoded your hash incorrectly (reply to 74946)

Liu Queng: Let me check it again (reply to 74956)

charlie: thanks mate. is there any solution of v2 api to get it？ (reply to 74955)

Illia: https://toncenter.com/api/v2/#/blocks/lookup_block_lookupBlock_get (reply to 74958)

Illia: you will have to parse the block by yourself though (reply to 74958)

Illia: like Cell.fromBase64(result).beginParse()  https://docs.ton.org/develop/data-formats/block-layout#:~:text=A%20block%20in%20the%20blockchain,forming%20a%20chain%20of%20blocks. (reply to 74958)

charlie: yes Im doing it. but I find there is no api of v2 to get it directly.

Illia: yes, that's right, just use v3 and you will have no problem (reply to 74962)

Kryptonite: Hi fellow devs:  if (op == op::burn_notification()) {         int jetton_amount = in_msg_body~load_coins();         slice from_address = in_msg_body~load_msg_addr();         throw_unless(74,                 equal_slices(calculate_user_jetton_wallet_address(from_address, my_address(), jetton_wallet_code), sender_address)         );         save_data(total_supply - jetton_amount, admin_address, content, jetton_wallet_code);         slice response_address = in_msg_body~load_msg_addr();         if (response_address.preload_uint(2) != 0) {             var msg = begin_cell()                     .store_uint(NON_BOUNCEABLE, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000                     .store_slice(response_address)                     .store_coins(0)                     .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)                     .store_uint(op::excesses(), 32)                     .store_uint(query_id, 64);             send_raw_message(msg.end_cell(), 2 + 64);         }         return ();     }  in this code snippet :    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)    this line sets value 0 to the following flags ? right ? , can anyone confirm if my understanding is correct.

trungnotchung: yes, you can read about it in sending messages in TON docs (reply to 74965)

Kryptonite: this one right:  https://docs.ton.org/develop/smart-contracts/messages#message-layout

charlie: git it. it indeed has more data comparing with v2 api. thanks mate (reply to 74963)

trungnotchung: that's right (reply to 74967)

Kryptonite: so can you please help me to understand, in this jetton-minter.fc code:  () mint_tokens(slice to_address, cell jetton_wallet_code, int amount, cell master_msg) impure {   cell state_init = calculate_jetton_wallet_state_init(to_address, my_address(), jetton_wallet_code);   slice to_wallet_address = calculate_jetton_wallet_address(state_init);   var msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(to_wallet_address)     .store_coins(amount)     .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)     .store_ref(state_init)     .store_ref(master_msg);   send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors }   in this function why is :    .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)    why is (4 + 2 + 1) is stored in the flags ? (reply to 74969)

Kryptonite: because i read this as well:  https://docs.ton.org/develop/func/stdlib#send_raw_message

&rey: Custodial services may handle your requests arbitrarily, including throwing them into trash bin. (reply to 74922)

Катя❤: Hello, dear colleagues! I am a python programmer. I would like to know from you if there are any libraries for obtaining information about those NFTs that are on this wallet? Similar to tonviewer, only ready-made queries

oluwatobi: Which is easier for a newbie? Func or Tact?

final: . (reply to 74982)

trungnotchung: https://docs.ton.org/develop/func/cookbook (reply to 74971)

trungnotchung: you can find answer for your question here

trungnotchung: it will send a message with state init and body cell

Kryptonite: This i understood, but my question is why (4 + 2 + 1) ? (reply to 74986)

Kryptonite: why the flags are set to 7 ?

TON Bounty Bridge: ​Support Tact v1.4.0 for tact-vscode  🏷 Developer Tool  Summary:The community ask to improve the tact-vscode tool (already >2K developers use it)  Rewards: • 560 USD in TON equivalent  Created by logvik

Mans: Can you send bundle tx on ton?

Anastasiia: https://docs.ton.org/develop/howto/faq#is-transaction-batching-possible (reply to 74993)

trungnotchung: to set value of last 3 bits to 1 (reply to 74989)

Kryptonite: last three bit i.e   .store_uint(0,  1) ;; no init-field flag (Maybe)     .store_uint(0,  1) ;; inplace message body flag (Either) (reply to 74995)

Kryptonite: what would be the third flag it will be setting?

Kryptonite: so it will set: init-filed flag inplace message body flag i.e either X ^X   what is the third flag it is setting? (reply to 74995)

trungnotchung: () deploy_with_stateinit(cell message_header, cell state_init) impure {   var msg = begin_cell()     .store_slice(begin_parse(msg_header))     .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))     .store_uint(0, 1) ;; body:(Either X ^X)     .store_ref(state_init)     .end_cell();    ;; mode 64 - carry the remaining value in the new message   send_raw_message(msg, 64);  }  () deploy_with_stateinit_body(cell message_header, cell state_init, cell body) impure {   var msg = begin_cell()     .store_slice(begin_parse(msg_header))     .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))     .store_uint(1, 1) ;; body:(Either X ^X)     .store_ref(state_init)     .store_ref(body)     .end_cell();    ;; mode 64 - carry the remaining value in the new message   send_raw_message(msg, 64);  } (reply to 74999)

trungnotchung: you can see that if have state init, 2 bits will be used for state init, last bit for body cell

Kryptonite: ohkay, so the last 1 + 1 + 1 is 2 for state init maybe value  and 1 for inplace msg body maybe value

Liu Queng: Hi sir, can I dm you? I have some question want ask. Do you free? (reply to 74956)

Illia: Will be pleased to help (reply to 75012)

Gabry: Guys I’m looking for a graphic designer for a crypto project, dm me if anyone is interested

charlie: Hi team, could u share the reward details when staking ? I found there is little doc to introduce it.

Think: Hi  all coinbase don't recognize ton wallet

Carter🧹: Which dev ecosystem has the best support for TON? I've seen a few SDKs but nothing that supports everything:  Mempool/block proposal subscriptions (Overlay?) Simulating transactions against current and previous state. Indexing of the underlying database if possible.  Is it JS, Python, Rust? Trying to find the best set of tools for building TON applications.

Think: The bot is too sensitive  There is a chat  Tonight  Bot locked me out over reply saying that's brilliant  I'm trying to move funds but is not connecting to ton wallet

Think: This sensitive nature of the bot will lock out a lot of good people 😞

Ali: Hello guys, is there a any docs for develop ton web app?

&rey: Telegram mini-app or TON dApp? (reply to 75042)

Ali: mini-app/web app

Ali: i mean web app in telegram

&rey: There is some documentation, but I don't remember where. @devs is the appropriate chat. Please remember to read pinned messages. (reply to 75044)

Think: Can I have the design competition for wallet please

&rey: pytonapi, being interface for tonapi.io. (reply to 74980)

Ali: thanks (reply to 75046)

rz: hi. I am getting a TonCoin wallet address with an api call from ton center and I want to compare it to a wallet address that I have in my kotlin app to see if those are same addresses or no. but the wallet address which I get from api is in this format: "0:42209dc44db70ebb930ed5079aa81060104031221fe4cba4e840fe5aceeeec8c" and the wallet address that I have in my app is in this format: "UQBCIJ3ETbcOu5MO1QeaqBBgEEAxIh_ky6ToQP5azu7sjEVj" how can I compare them or convert one format to another format?

Paul: Using Address in ton.core. (reply to 75051)

charlie: Hi all, could u share the reward details when staking ? I found there is little doc to introduce it.

_chocolate.py: how can i send jetton from smartcontract to specific address using func

mohsen: Hi friends Is it possible to pay the transaction fee with USDT?

&rey: Not natively. (reply to 75057)

&rey: Send message to contract's jetton wallet. Message format is detailed in TEP-74 (or shown in TON Cookbook). (reply to 75054)

S: LEARNING TON ?

mohsen: I have seen some software that does transactions without owning TON currency and pays the fee with USDT balance. (reply to 75058)

&rey: See pinned message for references. (reply to 75060)

S: I'm sorry, my English is weak, please send me the link if there is a pamphlet or a book (reply to 75063)

&rey: https://docs.ton.org — this is main page of documentation. (reply to 75064)

_chocolate.py: can you give me a link (reply to 75059)

Dmitry | backend4you.ton: This requires special wallet contract (v5), and special workflow where user signs his tx (and additional tx for transferring USDT as fee to provider), then this two messages are sent via http api to provider, provider checks both and pushes them both to blockchain/node. Provider pays TON for both tx fees, but one of them is your transfer USDT to provider, so you actually buy some TOn from provider (reply to 75062)

Dmitry | backend4you.ton: Check Tonkeeper channel for detailed announcement (reply to 75067)

rz: can you explain a bit? (reply to 75052)

&rey: https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment https://github.com/ProgramCrafter/MulDEX/blob/8d0fa457a2b12339ae090ca2ffdc4cb354971ab0/contracts/multitoken_dex.fc#L111-L118 https://github.com/ston-fi/dex-core/blob/6ab5b1cb3ddb6a37a070f980bae84acbb0197814/contracts/router.func#L66-L68 (reply to 75066)

DEEP: help me please

DEEP: Build script running, compiling Homaland ⏳ Compiling...contracts/homaland.fc:10:17: error: undefined function `~slice_load_uint`, defining a global function of  unknown type       balance = ds~slice_load_uint(64);                   ^ contracts/homaland.fc:11:16: error: undefined function `~slice_load_dict`, defining a global function of unknown type         claims = ds~slice_load_dict();                  ^ Error: Func compilation error: contracts/homaland.fc:20:13: error: cannot apply function store_dict : (builder, cell) -> builder to arguments of type (builder, (slice, slice)): cannot unify type (slice, slice) with cell               .end_cell() help me please

Think: May I ask if you have customer support that calls you ?  If you have a problem

Nel_Z_I: https://docs.telegram-mini-apps.com/packages/tma-js-sdk/components/mini-app#access-requests (reply to 75044)

&rey: Uninvited DMs are scam. (reply to 75075)

&rey: Those functions are actually called ~load_uint(64) and ~load_dict(). (reply to 75074)

DEEP: Are they written correctly in my contract? (reply to 75078)

Valamar.$888: Sorry for interrupting guys just a weird question again: If you were to create a Blockchain network and Platform like ETH,TON , BTC etc what would you name it and what it's goal ??

Think: They called me "   Anyway, what time is the live tonight to join in please" 😀

Think: Has it been announced

Paul: For js, just install @ton/ton. This code could be like import { Address, Cell, TonClient } from '@ton/ton' let addressStr = '0:2123xxxx'  Address.parse(addressStr) (reply to 75069)

Usman ghani 🌊: May I text you sir I want to know some knowledge related to project sir (reply to 75017)

Sagara: Hi,

Sagara: I'm running a ton full node and getting few errors.

Sagara: ```Command '['/usr/bin/ton/lite-client/lite-client', '--global-config', '/usr/bin/ton/global.config.json', '--verbosity', '0', '--cmd', 'runmethodfull -1:5555555555555555555555555555555555555555555555555555555555555555 list_proposals', '-i', '8']' timed out after 3 seconds

Sagara: I see some warnings as well.

Sagara: GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a real number, not 'NoneType'

Gabry: Sure (reply to 75105)

User<694804783>: Hello   How can I verify a Jetton to avoid getting unverified token on tonkeeper

Jawar: /how to verification reject wallet open ?

Veaceslav Kunitki: Hello everyone. Does anyone know how to get the NOTCOIN balance in my TON wallet from a Python script?

Jawar: Help wallet verification reject

Svαtoωλ‎: how to emulate externals from mempool locally?

ᎷᏫᎬᏃ: Guys what need add here for verify

Usman ghani 🌊: Sir I can't text you because of privacy so please text me (reply to 75116)

Faithful1ofall: I had same issues (reply to 75137)

AA DAN: I have exchanged my 10 million notcoin coins into notcoin NFT VOC, but my notcoin NFT VOC doesn't appear in my tonspace wallet & the coins in my notcoin have been deducted Transaction history is successful but notcoin NFT VOC does not appear in my ton space wallet

Jawar: TON space wallet

Sergei: Hello everyone. Could you please let me know if there are any publicly available examples of token staking contracts? Thanks in advance for your help.

Usman ghani 🌊: I am learning from this group seriously as a newbie (reply to 66688)

Usman ghani 🌊: Brother could you please tell me about the proper procedure for lunch my own token. Which things necessary to avoid being scammed with community and how much cost expected and how many earns please

Ingvarr: Hello everyone. I'm using pytonlib and tonsdk together. But I've got a problem with seqno conception. Transactions aren't always sent successfully and I don't even realize how it really works. I consider I've coded everything properly, transactions are proceed sometimes, but some of them are shown neither on tonscan nor history of my wallet that I'm sending from  This is how I'm getting seqno:  async def get_seqno(address: str):     try:         data = await client.raw_run_method(             method="seqno", stack_data=[], address=address         )         return int(data["stack"][0][1], 16)     except Exception as e:         logger.error(f"Unable to get seqno: {e}")  And this is how I'm sending transactions:  query = wallet.create_transfer_message(     to_addr=address,     amount=to_nano(0.02, "ton"),     seqno=seqno + 1,     payload=comment, )  await client.raw_send_message(query["message"].to_boc(False))  And I'm facing the following error message:  LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction 5C10830AA9F52D7840DBC1C71E0AF410A281E3AFD4D5473DFACFF3CFABE3AB24: exitcode=33, steps=23, gas_used=0 VM Log (truncated): ...te NOW execute LEQ execute THROWIF 36 execute PUSH c4 execute CTOS execute LDU 32 execute LDU 32 execute LDU 256 execute LDDICT execute ENDS execute XCPU s4,s3 execute EQUAL execute THROWIFNOT 33

Ingvarr: Couple of times it worked with 0 value, so it's really confusing about why this conception is needed and how it works, and why it's not always the case that it's working (reply to 75165)

Ingvarr: maybe I need to fill this field with something? (reply to 75165)

Agent B: Hey everyone.  I'm very new here.  Working on a TON app.  I transferred some BTC to the telegram bot and swapped it to TONcoin in the app.  I show a balance in the wallet but none of the explorers have a balance for me.  Is this common? It's been a few hours.

Agent B: Another question.  I was able to use the wallet connect UI package to get connected to my wallet in my mini app. Very cool.  But how do I get my account balance?  In the web3 world I would use the metamask provider and do something as simple as getBalance().  Is there a similar function here?

Carter🧹: I'm trying to connect to the DHT and Overlay.  Are these the correct IDs for the networks?   adnl_keys:     dht_key: "0092a775abde7539df5fab97ac32e644eb3bc3711c9136ef3a96be8e290df111"     overlay_key: "f0db73bee16d51b5372540a50a7ed61c11e1527e5f6194579ec9fff3f89be222"

User<7307617656>: /stat@combot

— 2024-06-27 —

charlie: hi all，could u share how to get the token balance of my wallet with api？ thanks a lot

User<835351458>: I figured out how apps are handling the use of telegram stars.  Look at catizen game announcements for their post about how they are handling telegram stars.  If you log into catizen game via android or ios, you must pay with telegram stars.  If you log in via Telegram web or desktop, you can pay with crypto such as via tonkeeper.  😅 (reply to 72653)

User<835351458>: Obviously your app will make a lot more money if users go thru telegram web or desktop and pay you with crypto.  (No need to pay 30% cut to google play or apple store.) (reply to 75209)

Cowboy: hello does anyone have a guide on transitioning from EVM to TON code?

Toto: I can not access document

Toto: Any suggestions?

Sebastian: good morning, I don't know why I lost my notcoin, it's just gone, someone help me

11: can i verify code use blueprint or someting?

prodvd: It is technically impossible.  Because 1) Contracts on EVM is developed by Solidity language, while TON is with FunC  2) Compiler is different 3) Core flow and blockchain is completely different. (reply to 75217)

prodvd: You need to develop jetton (token on TON) from scratch, not from EVM token.

meomeocoj | Mike: hi, i found that jetton have the op::provide_wallet_address(), but seem it's not allow to passing a forward body

prodvd: What is the best tutorial URL to learn and deploy jetton on TON?

meomeocoj | Mike: Any solution for dynamic jetton wallet calculation with forward payload ?

meomeocoj | Mike: or any best_practice_to calculate the jettonWalletAddress for a smart_contract onchain

Cowboy: is there no standard jetton contract? (reply to 75230)

Paul: try to use this https://github.com/ton-blockchain/token-contract. (reply to 75237)

ᎷᏫᎬᏃ: Hello how to can verify my token on tonkepper

User<6888181913>: Stims  Glass/slips  Cook up  Tapin @stimmy_vendor

Cowboy: are there web3 libs for ton like web3js etc?

meomeocoj | Mike: @ton/ton is the most popular one (reply to 75250)

Anurag: My transaction is in queue from 21st June how much time it should take more ??

Sunny: Hey i am just getting started on writing a smart contract for jetton.! is this written in FunC ? can somebody guide me to a good document for it?

meomeocoj | Mike: could u give me the tx_hash (reply to 75255)

Anurag: How can we check from this ?? (reply to 75259)

Kryptonite: Thanks bro it was helpful.👍 (reply to 75003)

Kryptonite: @pcrafter  Thanks for confirming , it was helpful 👍 (reply to 75004)

Step: is it technically possible to run a liteserver node on a server with 200GB of storage?

Tim: no (reply to 75268)

Step: even by adjusting flags like state-ttl block-ttl archive-ttl  to smaller number ? (reply to 75269)

Step: ? (reply to 75270)

&: Check here. https://docs.ton.org/develop/dapps/ton-connect/developers (reply to 75173)

&: Use toncenter API. const tonClient = new TonClient({         endpoint: https://toncenter.com/api/v2/jsonRPC,         apiKey: '481691a73162696f81ea4d2f8441bc405c9c145da567c226849e9f78707a99bb'     });   const jettonRoot = tonClient.open(JettonRoot.createFromAddress(jettonAddress));     let jettonWallet: OpenedContract<JettonWallet>;     jettonWallet = tonClient.open(await jettonRoot.getWallet(walletContract.address)); jettonWallet.address (reply to 75205)

charlie: it's cool. is there any curl examples of it? thanks brother (reply to 75276)

&: Best way is to store, or calculate yourself on your contract. YOu can find code on minter contract. (reply to 75235)

&: Tonapi.io is much easier. (reply to 75278)

charlie: I got u. is it /account/jettons? (reply to 75282)

Ash: Hi All   This is my Sample Jetton in Tact   import "@stdlib/ownable";  message Mint {     amount: Int;     receiver: Address; }  message MintForWatchAndEarn {     amount: Int; }  message DistributeTokens {     distributionWallet: Address;     supply: Int; }   contract MemeTV with Jetton {     totalSupply: Int as coins;     owner: Address;     content: Cell;     mintable: Bool;     // This amount to enough to store 1kb of data for 2.5 years of time     const minTonForStorage: Int = ton("0.01");     max_supply: Int as coins;      // Additional variables from MemeTV     userRewardMintedSupply: Int as coins;     userReward: Int as coins;     totalWatchSeconds: Int;     counter: Int;     perPhaseWatchSeconds: Int;     walletWatchDuration: map<Address, Int>;      init(owner: Address, content: Cell, max_supply: Int, perPhaseWatchSeconds: Int) {         self.totalSupply = 0;         self.owner = owner;         self.mintable = true;         self.content = content;         self.max_supply = max_supply; // Initial Setting for max_supply          // Initialize additional variables         self.userRewardMintedSupply = 0;         self.userReward = 2441406250000000000; // Assuming initial userReward         self.perPhaseWatchSeconds = perPhaseWatchSeconds;         self.counter = 0;         self.totalWatchSeconds = 0;     }      receive(msg: Mint) {         let ctx: Context = context();         require(ctx.sender == self.owner, "Not Owner");         require(self.mintable, "Can't Mint Anymore");         self.mint(msg.receiver, msg.amount, self.owner);// (to, amount, response_destination)     }      receive(msg: MintForWatchAndEarn) { // Public Minting         let ctx: Context = context();         require(self.mintable, "Can't Mint Anymore");         self.mint(ctx.sender, msg.amount, self.owner);     }             receive("Owner: MintClose") {         let ctx: Context = context();         require(ctx.sender == self.owner, "Not Owner");         self.mintable = false;     }      // handler for receiveing Ton without any messages     receive()     {      }      receive("withdraw safe"){         require(sender() == self.owner,"Only Owner is allowed to withdraw");         send(SendParameters{             to: sender(),             bounce:true,             value: myBalance() - context().value - self.minTonForStorage,             mode: SendIgnoreErrors + SendRemainingValue,         });     } }  struct JettonData {     totalSupply: Int;     mintable: Bool;     owner: Address;     content: Cell;     walletCode: Cell; }  // ============================================================================================================ // @interface("org.ton.jetton.master") trait Jetton with Ownable {      totalSupply: Int; // Already set initially      mintable: Bool;     owner: Address;     content: Cell;      max_supply: Int; // This is not in the TEP-74 interface      receive(msg: TokenUpdateContent) {         self.requireOwner();                // Allow changing content only by owner         self.content = msg.content;         // Update content     }      receive(msg: TokenBurnNotification) {         self.requireWallet(msg.owner);                     // Check wallet         self.totalSupply = self.totalSupply - msg.amount; // Update supply          if (msg.response_destination != null) { // Cashback             send(SendParameters{                 to: msg.response_destination!!,                 value: 0,                 bounce: false,                 mode: SendRemainingValue + SendIgnoreErrors,                 body: TokenExcesses{                     queryId: msg.queryId                 }.toCell()             });         }     }

&: yes (reply to 75283)

charlie: thanks brother. I'm doing it (reply to 75286)

charlie: Hi @Borealis_dev could u share how to get the rewards when staked in a pool?

&: Onchain code? or offchain? (reply to 75288)

charlie: onchain. I staked some ton on testnet, but don't know how to get rewards

charlie: it seems no api to get it and no dashboard to observe it. LOL

WinK: Hi guys.  I have created a Jetton and I need to verify my jetton..how can I do it?

Triệu Hồng: How to add a specific wallet to TON wallet for everyone? I am using @tonconnect/ui-react library to code the website

Trevor: Hi all, can someone tell me what is going on with this account? kQBYiHexR3xnafdEIPxo0N11sK6ozrG9ehM2xtV-mVo6makz  First, I funded the account with the testnet bot, then I do a simple transfer to myself while sending a StateInit to activate the account. After that it seems to drain funds over and over for a few minutes (the explorer doesn't even know what happens). Is there some extra fees that occur after activating a wallet? (context: I am creating a wallet library)

meomeocoj | Mike: So, i should precalculate all the jettonwallet of the smartcontrract and store its in a dict right ? (reply to 75281)

User<5306174933>: Where can I verify my contract on ton

Triệu Hồng: Everyone, how do I add a custom wallet to the ton???? someone help me please

Son: Hi, when I use getTransactions rpc method, I get back address in bounceable format (with initial EQ). However on tonscan or tonviewer, these addresses are actually non-bounceable. How do I determine from the rpc response that the receive address is (non)bounceable? For example this tx: https://tonscan.org/tx/C9i8vL88j1OiZdcdoaWCttHJpkrk8V18mEA8MysydL8=

Vitalik: Hi! I need some help with tonConnectUI. Specifically, I want to create a transaction to top up a contract with a token (like USDT or USDC) in the user's wallet, such as Tonkeeper.  I'm happy to pay for your help in TON.

11: hi guy. what mean is this code snippet. https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/contracts/jetton-wallet.fc#L151

11: if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {     var msg = begin_cell()       .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000       .store_slice(response_address)       .store_coins(msg_value)       .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)       .store_uint(op::excesses(), 32)       .store_uint(query_id, 64);     send_raw_message(msg.end_cell(), 2);   }  i don't know why the jetton wallet need the op::excesses code

&rey: It's written in TEP-74 that jetton wallet should return excess TON with that opcode. (reply to 75331)

gavin: When you don't pass response_address, op::excesses will not be triggered (reply to 75331)

&rey: Wdym "add a custom wallet"? Wallet contract or wallet app? (reply to 75322)

Triệu Hồng: wallet app (reply to 75334)

&rey: Have you written one? Does it work on your device? Does it work on beta-testers' devices? (reply to 75335)

Triệu Hồng: I use the code as shown in the document but I cannot connect to safepal

Buggy: Someone please correct me, since the ton smart contract (func) has the limited storage data. What if I want to create a trading platform and let user deposit funds and save state (each address balance). How would it be not crash if there were tons of user deposit to the contract at some point? How to prevent that?

charlie: Hi all, could u share how to get the relation of account and pool?

&rey: Usually, either each user's deposit is in a separate contract or not stored onchain at all. (reply to 75338)

ABDUL: hello everyone i’m unity game developer currently i’m working on TON sdk implementation in my telegram game i followed exactly like mentioned in TON forum but still i’m unable to connect my TON wallet in my telegram game

Buggy: Can I dm, so confusing rn (reply to 75343)

Morphius: im looking for TON samrt contract developer, we have smart contracts on evm and solana, we need to port them to ton!

uchebnick: Hello I am writing a smart contract with payment is it possible to write what should be performed during payment in the handler of transfer_notification?

ABDUL: here is the document which i followed for implementing TON sdk in my unity webgl game

&rey: Yes. It is usually done so. (reply to 75350)

&rey: Unable to connect — does it raise any errors? (reply to 75344)

uchebnick: thanks (reply to 75355)

ABDUL: yes (reply to 75356)

Son: Hi. It would be great if someone can point me to a source to read. Thanks all (reply to 75327)

Valamar.$888: Am I only the one that sees that also TON is becoming full of SCAMS just like other Blockchains   https://t.me/RichQuestBot/app?startapp=7483365675

Valamar.$888: Can you guys also launch it cause I wanna experiment in this shit !!

Morphius: job: need indexers for in go for ton blockchain data.  (Holders indexer) (Pair indexer) (Swap indexer) (AddLiq indexer) (RemoveLiq indexer) (token autid ) ( usd price oracle )

ＡλＩ: Hi I developed functions on TON's HTTP-based API last year, now I want to switch to a library for better integration. Please recommend TON's main Python library (by main library I mean the one that takes updates faster and probably has longer support) that supports async.

&rey: pytoniq. It has wide range of functionality, including different trust levels (thus suitable for security-requiring contexts). (reply to 75371)

Assasin: Hello

Assasin: I need to know...how to transfer to from one address to other..using tonweb

Timothy Ram.: Finally, made with telegram game.js, created a online game with scores sending

Assasin: Anyone here

Cuong: Anyone help me: I try to send message to smartcontract that created & deploy by Tact on TON. receive() function like image 1: & test to send message like image 2. But I call that always show errore as image 3

Valamar.$888: For what are you building it (reply to 75398)

Cuong: I just try to create test contract counter by Tact. And test send message

Crypto Notte: Anyone is getting lot of 500 Internal Error when sending tx, how did you fix it?

&rey: Please check Tonweb examples. (reply to 75382)

Daniel: How do I verify the exact token I want with transfer_notification in my contract?

Assasin: I checked..and always getting the error Lt is not in db (reply to 75411)

Nabhdeep: I can’t find private key in ton keeper  Was searching for a private key like metamask gives? Or mnemonic is the only thing i can get from it?

&: Mnemonic is only one (reply to 75424)

Crypto Notte: We have a 1000$ BOUNTY for whoever can help us with a working implementation step by step of Highload Wallet v3 in TS, included sending more than 4 messages of transfer of Jettons and TON.   The several examples online are not useful for us unfortunately and we are getting many errors when running them. If you know how to solve this, get in touch immediately :D

&: How about Highload wallet v2? Only v3 need? (reply to 75427)

Crypto Notte: V3 would be better, but as soon as it sends more than 4 messages (transfers of TON and Jetton) it should work (reply to 75428)

&: OK i have the code that can buy/sell NFTs bulk what i have developed in v2 (reply to 75429)

Crypto Notte: ping me, I'll give more details (reply to 75431)

&: DM me plz.

&: I can't DM you.

&: DM me (reply to 75346)

Usman ghani 🌊: Last night Mineralz bot app scammed I connect my ton keeper wallet I lost my all asset so how we can recognize  this bot legit or scammed (reply to 75363)

Valamar.$888: Open a fake wallet just like me with 0$

Stepan: Is there a Tact function similar to FunC's set_code?

Anton: no official support yet, but you can check other people’s solutions here: https://github.com/tact-lang/tact/issues/27 (reply to 75456)

Stepan: Thanks so much! (reply to 75457)

&: The free voucher or free airdrop is 99% scam. Someone can send you scam NFTs and msgs, Plz ignore it. (reply to 75445)

Abuchi: Gm people

Paul: address in ton is calculate by using compiled code and init state. if you can provide 2 value. this possible. but this way is not suitable in ton. not all jetton token are used same the code, just provide functions  by standard. (reply to 75235)

Nabhdeep: Is there a jetton faucet or i would have to create it to test it?

Paul: use this https://minter.ton.org/?testnet=true

Nabhdeep: I have an question as in EVM chains we give Private key for generating a transaction. But in TON i can't find a private key in TON keeper   1. Do we have to consider Mnemonic as the private key? as explained in the documentation? Or is there a way that we can consider a hex 64 bytes strings as private keys too?

Ronaldo: toonkeeper not provide, but you could get the private with others wallets (reply to 75494)

User<6288216921>: is there anyone looking for a dev?

Nabhdeep: import { mnemonicToKeyPair } from 'tonweb-mnemonic'  generates 2 thing publicKey and secretKey  Can someone give me some reference to  1. How can we generate public key if we only have the secret key? 2. How are addresses generated in TON?  UPDATE: 1. tonWeb.utils.nacl.sign.keyPair.fromSecretKey()

ᅠ: How often do these scammers text you? I got at least 1-2 messages per week, with the same bot.  They want to buy my username, then they say something about "chinese government" or other reasons to use this TonSwapsRobot bot for the deal, and then they fade away and delete the dialogue. (reply to 71204)

Stephan: Hi guys, please tell me, I have a simple function in the contract that returns a string.  #include "imports/stdlib.fc";   const slice message = "Text!";   int get_message() method_id {     return message; }  () recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {     return (); }    how can I parse it through Go or another language?

User<835351458>: Can u enable my nft project on ton to support unlockable content?  When user browses on getgems, they can't view the unlockable content for the nft until after purchase.  Similar to the unlock feature on darkblock and rarible. (reply to 75467)

Sammy: Hello there!  I'm going to create TapGame. Who can get this project by creating smart contract?  Dm me for fully information. If you well experienced developer, we wait you

Victor: Hi! I have a question about integrating an NFT smart contract into my application. I've already created the contract for the NFT, and I want to make it possible to purchase it within my app for 2 TON.   However, I've noticed that almost all NFTs are minted through an "intermediary smart contract." Could you advise on how to write such an "intermediary" and how it works?   Are there any examples on GitHub that I could use as a starting point?   Thanks in advance for your help!

&: At TON we have to calculate private-public keypair from menmonic. (reply to 75494)

&: DM me plz (reply to 75517)

User<6943543282>: We have idea for memecoin miniapp, any builders here would be interested to develop gambling miniapp with native token system? DM!

Crypto Notte: ^ This is still valid. Any help with v5 or highload v3 for 1000$ (reply to 75427)

elm: Hey guys, is it possible to combine multiple "instructions" in single transaction? For example I want to execute a swap on deDust and then in that same transaction transfer some TON. Here's what I tried but it results in bounce. Couldn't find any node examples or references anywhere

&: Make smart contract to do that. (reply to 75533)

elm: Yeah was leaning towards that but had to check maybe there was simpler option

&: You can capsulate several txs in one tx. Search on docs.ton.org (reply to 75536)

— 2024-06-28 —

bt/ss: Hi all. Is there an example of a Jetton wallet contract that implements a maximum amount a wallet can have?

bt/ss: That uses get_balance and then filters? Why are there no public examples of this?

Tyson (NEVER DM FIRST): "@type": "adnl.address.udp",                 "ip": -1746587354,                 "port": 25975  Is this right for the IP in the generated config for a node or is there some error? Doesn't look like an IP and cannot connect to liteserver with this config

Nabhdeep: So while developing i was thinking to use Secret Key as “root” private key  Which we can get from (nacl.sign.keyPair) (reply to 75564)

Tyson (NEVER DM FIRST): Would it be normal format of an IP? (reply to 75588)

Tyson (NEVER DM FIRST): This is the auto generated config when installing MyTonCtrl

Tyson (NEVER DM FIRST): Could you show me an example of a proper config by any chance? (reply to 75593)

Tyson (NEVER DM FIRST): Thanks very much. Weird that my config is so corrupted. I will try a reinstall. (reply to 75600)

charlie: Hi all, could u share how to get the relation of account and pool?

pony: I am a ton wallet developer. How do I implement the ton-connect bridge in the wallet? I have the content in the QR code and can construct the connect result. Through which interface do I send the response to the dapp? Or do I post the message to the universal url? Is there any corresponding documentation?

User<7367118838>: Hi whats going on with the network

User<7367118838>: can make trades anywhere?

User<7367118838>: ?

User<7367118838>: 2 (reply to 75504)

&rey: You can't do this with provider.internal, but wallet wrappers support that. (reply to 75533)

&rey: I don't think there are any problems? (reply to 75616)

Tyson (NEVER DM FIRST): GetValidatorEfficiency warning: efficiency not found. GetValidatorIndex warning: index not found.   Is this normal? Thanks!

Kurian: Gm everyone

DL: Hi, i'm looking for someone who would be able to help me with a request. I'm looking to be able to input a coin adress and export all the transactions into an csv or something similar in a format like the Dexscreener transactions

&: Have a look at here. https://docs.tonconsole.com/tonapi/api-v2 (reply to 75686)

Daniel: I encountered exit code 7 (type check error). What is the problem with the set_data?

максим: Hi, help please, there is a token code, I want to write a function to minit tokens for myself, after deployment, this is what I got. static mintMessage(         from: Address,         to: Address,         jetton_amount: bigint,         forward_ton_amount: bigint,         total_ton_amount: bigint,         query_id: number | bigint = 0,     ) {         const mintMsg = beginCell()             .storeUint(Op.internal_transfer, 32)             .storeUint(0, 64)             .storeCoins(jetton_amount)             .storeAddress(null)             .storeAddress(from) // Response addr             .storeCoins(forward_ton_amount)             .storeMaybeRef(null)             .endCell();          return beginCell()             .storeUint(Op.mint, 32)             .storeUint(query_id, 64) // op, queryId             .storeAddress(to)             .storeCoins(total_ton_amount)             .storeCoins(jetton_amount)             .storeRef(mintMsg)             .endCell();     }      async sendMint(         provider: ContractProvider,         via: Sender,         to: Address,         jetton_amount: bigint,         forward_ton_amount: bigint,         total_ton_amount: bigint,     ) {         if (total_ton_amount <= forward_ton_amount) {             throw new Error('Total ton amount should be > forward amount');         }         await provider.internal(via, {             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: JettonMinter.mintMessage(this.address, to, jetton_amount, forward_ton_amount, total_ton_amount),             value: total_ton_amount + toNano('0.015'),         }); }  It minit tokens and everything is fine but I think I can not create a pool through this error, but I understand it does not correctly send tones back to the owner.  Constant error 65535, maybe someone knows where the error is.   https://testnet.tonviewer.com/transaction/bde0b7a53046d83b06410d22ec90efc57f8e9a05f1b90fc716c8a7559d07ea64

Sagara: Did you fine any solution for this? I get the same error (reply to 52167)

&: Plz check if your opcode is correct. 0xffff error is come from opcode (reply to 75700)

&: Did you checked cell max size? Or .store_ref() 's param is ok? (reply to 75697)

Daniel: I’ve tested it with null params and seems that was the case, but I’ve encountered another problem.  When I’m trying to mint nft, exit code is 0 but result code is 34 (Unsupported action). (reply to 75704)

&: Maybe  your store_uint(4+2+1, 108) have problem Try with 4+2 or 107or else. Plz have a look what does this mean. (reply to 75718)

&: Visit docs.ton.org to see what does each number mean. (reply to 75717)

Carter🧹: I was able to pull from source and build on a Linux machine, I was building on WSL2 which doesn't seem supported. I did get past it though. Apologise I'm not sure exactly which commit worked now... (reply to 75701)

Nabhdeep: What if i have an xprv (ROOT) , Path For example, you can generate a xprv from mnemonic  https://iancoleman.io/bip39/  1. How can I generate public and private keys and address related to that?  We can have multiple addresses for a single xprv. We just have to increment the index for that path

Triệu Hồng: Why do I connect safepal wallet to ton network and when connecting it says Connect declined?

Sunil | Aerius Labs: await hello.send(     walletSender,     {       value: toNano(MINTING_VALUE),     },     {       $$type: 'NewMe',       seqno: currentSeqno,     },   );  given the above the call how can I get the transaction hash for this transaction

cfs chef: how to generate this file

&rey: Compile the project with blueprint. (reply to 75752)

cfs chef: let me try it now

Paul: do it your self. bluepritn just generate a standard with common function. (reply to 75752)

cfs chef: i had run npx blueprint build, it only generated a json file

cfs chef: So every new contract requires me to write wrappers myself

cfs chef: Physical activity🤣

Sunil | Aerius Labs: Can somebody help me with this ? (reply to 75751)

&rey: Have you searched in this chat? Have you looked in TON Cookbook? (reply to 75751)

Cuong: all test case is passed. But I can not call send from ts-node to send message()

Pam: check with more example code (reply to 75779)

0x0liver: npx blueprint run --mnemonic --testnet  (node:1056892) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead. (Use `node --trace-deprecation ...` to show where the warning was created) ? Choose file to use (Use arrow keys) ? Choose file to use deployCounter Connected to wallet at address: EQC4rcr-yyNLw5M3KqmXzA6BXv8pP-8uhNQYnZUTfiawnf1r AxiosError: timeout of 5000ms exceeded     at RedirectableRequest.handleRequestTimeout (/home/lihwy/Projects/TON/learn/my-counter/node_modules/axios/lib/adapters/http.js:647:16)  is there any problem with blueprint library?

Surajo: H

xo: TON Site   Isn't the address written directly like this? jcdurpyo7qr74fiverd7gx3wnqlhyob4igfimzfi3vefaa2lljy.adnl What is its format

xo: @tondev_eng

Vasily: Hey guys! We are urgently looking for a skilled frontend developer to join our team. We already have an MVP (just a little bit left to finish) and a friendly team aimed at long-term work. About our product. At this stage we do not pay money, but in the future everything is discussed. DM me, thanks!

Matthew: hi all, can i send internal message to smart contract using ton keeper app?

Sunil | Aerius Labs: Let me revise my question, Is there any way to get transaction hash just after executing execution without searching for it in getTransaction response ? (reply to 75776)

&rey: No, there isn't. (reply to 75837)

&: sending message via tonkeeper is external message. Do not confuse between external and internal. (reply to 75831)

Matthew: I'm looking for a way to use ledger wallet to interact with smart contract. I tried using mnemonic to connect wallet v4 via script but failed (reply to 75848)

&: Did you checked ton-connect? (reply to 75851)

Cuong: me too,  Just try create a file newtest in script folder. and run it using npx blueprint run, and call to smart contract that you deployed (reply to 75851)

Konstantin: HI there! Is any one know why contract address is different if I'm trying get this adres directly from my contract and if I'm getting that address from jetton standard method  There are examples:  contract = await MyWallet.fromInit(gamer.address, jetton.address);  contract.address == jetton.getGetWalletAddress(gamer.address); ---> FALSE   But code for getGetWalletAddress is the same like      get fun get_wallet_address(owner_address: Address): Address {         let init: StateInit = initOf MyWallet(owner_address, myAddress());         dump(contractAddress(init));         dump(owner_address);         dump(myAddress());         return contractAddress(init);     }  so all values are correct owner_address and myAddress() in contract the same as in MyWallet.fromInit(gamer.address, jetton.address) but always contractAddress(init) not equal  await MyWallet.fromInit(gamer.address, jetton.address).address  Thanks!

WH: Is it possible to get Mev'd in TON?

ABCDE: Hi all! Tell me, how much does an nft purchase transaction cost on average now? Any NFT, in any service. My tests (not NFT) have a high commission.

midcurve: Hi is there a timeframe on when Ledger and other hardware wallets will support TON smart contract transactions?

Sagara: Hi,  I'm syncing a ton full node to use as a liteserver. Is there any ways to speed up the sync ? It took about 17 hours to reduce 97830 seconds to 61450 seconds. I see log as "does not have a valid ShardAccount to unpack" very frequently. Any one can help me on this please?

midcurve: Hi did you find out about this?? (reply to 70811)

&rey: Yes. Tonkeeper authors (tonapi) reveal your external messages before they are included in blockchain, and someone can race with you sending a lot of their messages. (reply to 75912)

WH: So its just a race in this case, not guaranteed and technically you can sell right after you buy racing them (reply to 75934)

WH: Also about this so if im using tonapi (v2) my tx will be exposed to mempool (the msg reveal) but if im using adnl or v4 it wont? (reply to 75934)

&rey: It probably won't, or will be revealed a bit later – when it's too late to compete. (reply to 75938)

WH: Interesting. Thanks for sharing such information. Any place i can read about tonapi's mempool? (reply to 75941)

&rey: I believe its devs have the most precise information. As it's paid service it is reasonable to expect them sharing the information upon request. (reply to 75942)

Pegu: Is it possible to create a contract to hold all different kind of jetton tokens?

Chinelo: Yes (reply to 75951)

Pegu: :O ok, is there examples of the contracts? (reply to 75952)

hamzah: gm

hamzah: is there a remix like IDE for TON ?

Pegu: Is there any example/doc of ton contract to receive jettons and then sending it?

d-lottery.com: I would like to create a smart contract for guessing bets,which supports transfers with bets, accumulates and ranks the amounts of the same bets,sorts the transferring accounts according to the ranking of the bets and the time of the transfer,and when the accumulated amount reaches half of the total income of the contract,the first-ordered accounts will share the remaining prize money according to the weights of the transfers. The contract lasts for 23 hours, with 1 hour left to randomly close and release the bonus, after which new transfers will be made to start a new cycle. Do people think there are any particularly big loopholes in the program? Is it achievable?

Stephan: Hi guys, please tell me, I have a simple function in the contract that returns a string.  #include "imports/stdlib.fc";   const slice message = "Text!";   int get_message() method_id {     return message; }  () recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {     return (); }    how can I parse it through Go or another language?

0x0liver: is printTransactionFees correct?

meomeocoj | Mike: i try it same mainnet (reply to 76010)

avantor: I can explain in detail first you have to understand difference of the EVM, solana and TON in development language, development environment, porting process and deployment (reply to 75217)

&rey: 1. Forget EVM 2. Write down required interface of contracts system 3. Write down architecture of contracts system 4. Code that (reply to 75217)

Амир: Just ask ChatGPT lol (reply to 75217)

musashi: in my case, just jump into the docs and read it section by section must read for contract dev: https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons (reply to 75217)

Nabhdeep: Can someone explain why is this txn failing  https://testnet.tonviewer.com/transaction/c645018c840ccb6b4654519df3566ddcb0e82485fc0d6f46840365307e3f6d9f

musashi: it throws 709 exit code, which is defined here in Jetton wallet code  throw_unless(709, msg_value >                      forward_ton_amount +                      ;; 3 messages: wal1->wal2,  wal2->owner, wal2->response                      ;; but last one is optional (it is ok if it fails)                      fwd_count * fwd_fee +                      (2 * gas_consumption() + min_tons_for_storage()));                      ;; universal message send fee calculation may be activated here                      ;; by using this instead of fwd_fee                      ;; msg_fwd_fee(to_wallet, msg_body, state_init, 15) (reply to 76033)

musashi: try bigger msg_value mate, should be 0.05 instead of 0.01

Paul: Your question is not make sense. Kind of jetton tokens means ? (reply to 75951)

سنــتــــریـــــچ: hey  Wich lib you're using? (reply to 65793)

Paul: In ton, we should send much more ton value, and it will return remaining value when completed. (reply to 76036)

musashi: I think he want to store different jetton-minter-addresses in the same smart contract (reply to 76038)

Nabhdeep: Thanks  So it's like a low txn fee? (reply to 76037)

musashi: no I mean you should deposit more Ton to make the transaction success, it contains many messages sending so 0.01 Ton is not enough (reply to 76045)

slavagm: basically yes every message is sending ton by fact (reply to 76045)

musashi: the gas_consumption() is already 0.015 TON

Paul: ssew34 store many address in one contract seem not good. just have a optcode that handle sending tokens. receive receiver_address, amount, jetton wallet. Dont forget the permission for this action. (reply to 76043)

JOSEPH: How can I create a flashloan arbitrage trading bot on TON blockchain using TON smart contract

daniel: no (reply to 75926)

User<6535147937>: Hi there!   How can we remove an incorrect scam label on a token? It is hindering our progress as some investors are wary of their token showing as a scam in Tonkeeper.

Liu Queng: Hi guys, I called the API of toncenter to get address information and I got the response like this, I want decode to data to get metadata of the token, anyone know any solution to decode it?   "data": "te6cckECIgEABTUAAlelef3NWzY1PNllCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQECAQMAwAMBFP8A9KQT9LzyyAsSAgEgBAUBQ7/wgutmO1egAZL0pqxGcojfLf7dudob7ij2UhyL69IfHsAGAgEgBwgASgBodHRwczovL3d3dy50b25maXNoLmlvL0JMVUVDT0lOMi5wbmcCASAJCgIBIA0OAUG/RUam/+G3nP3Ya609uHQxPc3i+wXmp0qn81UtlhfHnRMLAUG/btT5QqeEjOLLBmt3oRKMah/4xD9Dii3OJGErqf+riwMMACQAVE9OIEZJU0ggTUVNRUNPSU4ACgBGSVNIAUG/Ugje9G9aHU+dzmarMJ9KhRMF8Wb5Hvedkj71jjT5ogkPAUG/XQH6XjwGkBxFBGxrLdzqWvdk/qDu1yoQ1ATyMSzrJH0RAf4ARklTSCBpcyBhIG1lbWUgdG9rZW4gaW5zcGlyZWQgYnkgJFBFUEUuIEZJU0ggYWltcyB0byBiZWNvbWUgdGhlIHJlcHJlc2VudGF0aXZlIG1lbWUgdG9rZW4gb2YgdGhlIFRPTiBlY29zeXN0ZW0uIEl0J3MganVzdCBhIGZ1EACUbiB0b2tlbiB0aGF0IGRvZXNuJ3QgZ3VhcmFudGVlIGFueSB2YWx1ZSwgYnV0IHRoYXQncyB3aHkgaXQgaGFzIG5vIGxpbWl0cy4ABAA5AgFiExQCAswVFgAboPYF2omh9AH0gfSBqGECAdQXGAIBIBkaAMMIMcAkl8E4AHQ0wMBcbCVE18D8Azg+kD6QDH6ADFx1yH6ADH6ADBzqbQAAtMfghAPin6lUiC6lTE0WfAJ4IIQF41FGVIgupYxREQD8ArgNYIQWV8HvLqTWfAL4F8EhA/y8IAARPpEMHC68uFNgAgEgGxwAg9QBBrkPaiaH0AfSB9IGoYAmmPwQgLxqKMqRBdQQg97svvCd0JWPlxYumfmP0AGAnQKBHkKAJ9ASxniwDni2Zk9qpAHxUD0z/6APpAIfAB7UTQ+gD6QPpA1DBRNqFSKscF8uLBKML/8uLCVDRCcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMkg+QBwdMjLAsoHy//J0AT6QPQEMfoAINdJwgDy4sR3gBjIywVQCM8WcPoCF8trE8yB0CASAeHwCeghAXjUUZyMsfGcs/UAf6AiLPFlAGzxYl+gJQA88WyVAFzCORcpFx4lAIqBOgggnJw4CgFLzy4sUEyYBA+wAQI8hQBPoCWM8WAc8WzMntVAL3O1E0PoA+kD6QNQwCNM/+gBRUaAF+kD6QFNbxwVUc21wVCATVBQDyFAE+gJYzxYBzxbMySLIywES9AD0AMsAyfkAcHTIywLKB8v/ydBQDccFHLHy4sMK+gBRqKGCCJiWgGa2CKGCCJiWgKAYoSeXEEkQODdfBOMNJdcLAYCAhANc7UTQ+gD6QPpA1DAH0z/6APpAMFFRoVJJxwXy4sEnwv/y4sIFggkxLQCgFrzy4sOCEHvdl97Iyx8Vyz9QA/oCIs8WAc8WyXGAGMjLBSTPFnD6AstqzMmAQPsAQBPIUAT6AljPFgHPFszJ7VSAAcFJ5oBihghBzYtCcyMsfUjDLP1j6AlAHzxZQB88WyXGAEMjLBSTPFlAG+gIVy2oUzMlx+wAQJBAjAHzDACPCALCOIYIQ1TJ223CAEMjLBVAIzxZQBPoCFstqEssfEss/yXL7AJM1bCHiA8hQBPoCWM8WAc8WzMntVIIpyXw=

Liu Queng: I want decode it to human-readable.

سنــتــــریـــــچ: why there is not a single one in this group to answer me?

سنــتــــریـــــچ: i want to transfer ton with one of tons lib

سنــتــــریـــــچ: anyone? (reply to 76099)

Paul: which language you want? (reply to 76102)

سنــتــــریـــــچ: python (reply to 76104)

W. [Разработка сайтов]: Im think its not possible (reply to 76088)

ry4n: Hey! I launched my project on Gas Pump, how do I verify the token on Tonkeeper?

Paul: https://www.youtube.com/watch?v=gaowb3KyRyU&list=PLtUBO1QNEKws7aIXxVjhE8y2gJEPlIiwJ. This playlist is so good to start. (reply to 76105)

Nabhdeep: As currently I'm using a Hardcoded value    1. Is there a way to calculate the TXN fees before sending the TXN?  2. I tried calculating with wallet.methods.transfer(txnBody).estimateFee();        '@type': 'fees',        in_fwd_fee: 918400,        storage_fee: 138,         gas_fee: 1323200,         fwd_fee: 712000         but adding these all up and converting fromNano is not enough txn still fails   3. https://docs.ton.org/develop/smart-contracts/fee-calculation I also looked at this where doc told to add up all the fees  Do you have any idea about this? (reply to 76047)

🐤AKINTOLA: Please help me I unstake my ton from tonkeeper since last month but don't reflect on my balance

avantor: yeah it is possible if you have some question, plz let me know (reply to 76114)

&rey: You can't. In particular, flashloans aren't possible. (reply to 76083)

&rey: pytoniq wallet = await WalletContract.create(...) await wallet.transfer(...) (reply to 76105)

Nabhdeep: i wanted to know as that value can be an issue how can we calculate it ? (reply to 76121)

سنــتــــریـــــچ: i tested evven one of his codes in creating wallet  but it doesnt deploy them (reply to 76111)

سنــتــــریـــــچ: ill test (reply to 76124)

qtyyyy🐈‍⬛: Hei, there!   I'm really newbie here. Can u teach me how to revoke approval of my wallet? Is it okay just disconnect dapps from our wallet? or we need to do something to revoke the approval? (reply to 3847)

سنــتــــریـــــچ: BOC created successfully Client initialized successfully Error sending message: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state Client closed Error retrieving wallet state: tonlibjson did not respond Client closed after state retrieval    https://github.com/TonDevStudy/pyton-lessons-eng/blob/main/lesson_1/wallets.py   deploy (reply to 76124)

JOSEPH: I think it should be looked into just like it's done and possible on the Ethereum Blockchain. (reply to 76122)

Nabhdeep: Is there a way to make transactions at intervals of 4-5 seconds or even less or Only Highload wallets can solve this problem?

سنــتــــریـــــچ: @pcrafter  what sh i do? (reply to 76135)

&rey: No wallet apps on TON support approval in the first place. Your funds should be safe in any case. Disconnect dApp to be sure. (reply to 76131)

Ilia S.: Did anyone figure out how to open TON Wallet (telegram miniapp) with deeplink, so that it has amount of TON inserted for transfer? tg/wallet?startattach=send I got that, but it shows 0 TON to transfer. How do I pass amount?

Nel_Z_I: Hey guys, are there no code platforms I can use to create my tokens/Jettons?

&rey: Yes. minter.ton.org. (reply to 76158)

Nel_Z_I: Awesome, thanks.   Do you have one for NFTs? (reply to 76163)

&rey: Yes, getgems.io. (reply to 76166)

Nel_Z_I: I know GetGems. Are you saying I can create NFTs on GetGems? (reply to 76168)

User<6535147937>: Hi there!   How can we remove an incorrect scam label on a token/jetton? It is hindering our progress as some investors are wary of their token/jetton showing as a scam in Tonkeeper.

&rey: Please contact support of tonapi to get instructions on that. It's a custodial service which can do anything in theory. (reply to 76197)

Usman ghani 🌊: I am also facing the same issue bro (reply to 76197)

Usman ghani 🌊: Bro may I text you personal I need some help (reply to 76201)

Usman ghani 🌊: There are privacy issues I think so because telegram restricted me to send text (reply to 76201)

Usman ghani 🌊: I need a solution too (reply to 76109)

Usman ghani 🌊: Hi there!   How can we remove an incorrect scam label on a token? It is hindering our progress as some investors are wary of their token showing as a scam in Tonkeeper.

User<6535147937>: thank you ser (reply to 76201)

kevin: depends on which type of contract,  contact determine the formation of these raw data. (reply to 76096)

Liu Queng: But how to decode it? (reply to 76221)

— 2024-06-29 —

albertus: hello!  does anybody have any idea why there's an address mismatch between bounceable addresses that I have in tonkeeper(v4r2) and that i get via   const keypair = await sign.mnemonicToPrivateKey(<mnemonic>); const wallet_v4_address = client.open(             WalletContractV4.create({                 workchain: 0,                 publicKey: keypair.publicKey,             })         ).address;   the mnemonic is the same word-to-word, but the issue is present across all versions supported by the @ton/ton package

0x0liver: what about testnet, is it correct? (reply to 76013)

meomeocoj | Mike: Yeah nearly same (reply to 76259)

TON Bounty Bridge: ​TON Connect Wallets Swift SDK  🏷 Developer Tool  Summary:Swift SDK that will allow IOS developers to integrate TON Connect into applications such as crypto w...  Created by cryshado

Usman ghani 🌊: Token-keeper .xyz is a legit website?? May I put my key phrase here ??

0x0liver: https://testnet.tonviewer.com/transaction/d456ec225f546f9c0c5f096d2cb70e603639a1ce18b78e06eb3d861e2a72b0f8   opcode, value in and valueout is correct but fee is not, please help me (reply to 76260)

meomeocoj | Mike: you can query your own by config params onchain (reply to 76276)

0x0liver: already did      blockchain = await Blockchain.create({       storage: new RemoteBlockchainStorage(wrapTonClient4ForRemote(new TonClient4({         endpoint: await getHttpV4Endpoint({           network: 'testnet'         })       })), 20548830)     }) (reply to 76278)

0x0liver: do you know whats wrong here

meomeocoj | Mike: may be some opcodes waste more gas onchain

meomeocoj | Mike: but i think the different is too small to consider

0x0liver: thanks i thought it was the same (reply to 76283)

wrong: how to get started guys?

Memes Mask: Hello, how can i send jettons in @tonconnect/react?

Nabhdeep: Im using TONWEB Assuming i get the values from estimateFees(). These values are in NanoTON. Adding them up and converting to TON gives 0.002955738, which seems very low. Am I missing something?  FYI: These are the  actual values fetch from testnet   in_fwd_fee: 918400,         storage_fee: 138,         gas_fee: 1323200,         fwd_fee: 712000   Not the same TXN but i did the same thing here  https://testnet.tonviewer.com/transaction/bb25072322fb9c8af49fe8c6f2947e362dd17f33482d59c8599cf3247392af00 (reply to 76251)

trungnotchung: Hi everyone, are there any ways to calculate the slice_hash in TypeScript?

zevza: hi, how to decode this base64

سنــتــــریـــــچ: any one here yet could've deploy  an inactive wallet? using python or php

O: import "node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";  contract Something{      using SafeERC20 for IERC20;      address owner;      constructor(){         owner = msg.sender;     }      function withdraw(address _token) public {          uint amount = IERC20(_token).balanceOf(address(this));              IERC20(_token).safeTransfer(owner, amount);     } }  Where I can find example on Tact lang ? I need to send jetton from my SC

Snow Lee: import { NetworkProvider } from '@ton/blueprint'; with this NetworkProvider is there a way to initilized it instead of having in in the run() func?

سنــتــــریـــــچ: i am transfering ton using pytoniq and when its done it just returns a 1   what about transaction hash than?

سنــتــــریـــــچ: anyonnnnne? (reply to 76334)

Usman ghani 🌊: My coin's total supply is 90 billion I made a mistake when I was creating pool liquidity I just added 1000000 coins only so now I want to change my pool so how can I change my liquidity? Because i can't find a pool liquidity in myPool

User<7118587076>: WalletContractV4Hello, I need a person who will help me figure out tonconnect-ui, for a fee, write pm It is necessary to develop/finalize the script as tonconnect-ui-mini.js , just finish sending a transaction in addition to connecting, and so that it was one script

Ilia S.: Is this the right channel to seek an advice for using deep links and Ton Wallet?

avantor: sure, you are right (reply to 76360)

Ilia S.: I have this question (asked yesterday). To not copy paste 👆🏻 (reply to 76157)

avantor: yup sure, feel free to share plz (reply to 76362)

avantor: https: //docs.tact-lang.org/ this is tact official docs plz follow this docs if you have some problem or you can ask in here (reply to 76329)

O: No complains, but.. its empty        /**      * Payout the jetton balance to the beneficiary      */     receive("payout") {         require(sender() == self.owner, "Only owner is allowed to initiate payout to the beneficiary");                  let init: StateInit = initOf ???          send(SendParameters {             to: self.beneficiary,             value: 0,             mode: SendRemainingValue,              bounce: false,             body: /// ???,             code: init.code,             data: init.data         });     }   As I understand I need in some way trigger transfer from JW to Address (reply to 76364)

avantor: hi I am not sure what you want? can you explain in detail? (reply to 76366)

O: As owner  I want to trigger Contract  To send jettons from JW to Benefeciary Address (reply to 76372)

Nabhdeep: I think you have to hit the your jetton wallet for sending tokens (reply to 76373)

Ilia S.: @avantor000 do you have an insight on this? (reply to 76157)

Lovelyn🐐🌱SEED: Hello

Kirill: Hi, everyone. Could you help me plz. Why my Toclient don t have "open" method?

O: receive("payout") {         require(sender() == self.owner, "Only owner is allowed to initiate payout to the beneficiary");         let address: Address = myAddress();         // Jetton master address = "kQB8j8y0XGAtj5JyawkiajN9LscnFdjSOidz1UoMeTJgPqjj";         // How send trigger get_wallet_address from jetton master ?         // How to send the jetton from jetton wallet to the beneficiary         send(SendParameters {          });     } (reply to 76375)

&rey: It is scam most certainly. (reply to 76267)

O: basically I need to write in Tact this code        const forwardPayload = beginCell()       .storeUint(0, 32) // 0 opcode means we have a comment       .storeStringTail('custom message')       .endCell();        const body = beginCell()         .storeUint(0x0f8a7ea5, 32)         .storeUint(0, 64)         .storeCoins(toNano(10))         .storeAddress(Address.parse(BENEFECIARY_ADDRESS)) // Destination         .storeAddress(Address.parse(MY_CONTRACT_ADDRESS)) // Source         .storeBit(0) // no custom payload         .storeCoins(toNano(0.005)) // forward amount (if >0, will send notification message)         .storeBit(1) // we store forwardPayload as a reference         .storeRef(forwardPayload)         .endCell();              const response = await tonConnectUI.sendTransaction({         validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec         messages: [           {             address: MY_JETTON_WALLET_ADDRESS             amount: toNano(0.05).toString(),             payload: body.toBoc().toString("base64")           }         ]       });

&rey: beginCell().storeSlice(yourSlice).endCell().hash() using @ton/ton. (reply to 76309)

trungnotchung: thank you it's really helpful

&rey: Have you tested this? (reply to 76398)

&rey: I mean that your code does not have any relation to TON slice hashes. (reply to 76403)

O: Hey man, Does it sounds right +- ?       /**      * Payout the jetton balance to the beneficiary      */     receive("payout") {         require(sender() == self.owner, "Only owner is allowed to initiate payout to the beneficiary");         // Jetton master address = "kQB8j8y0XGAtj5JyawkiajN9LscnFdjSOidz1UoMeTJgPqjj";         // QUESTION 1. how to get the jetton wallet address based on myAddress() and jetton master address ?         // QUESTION 2. how to get all available jetton wallet balance ?          let body: Cell = beginCell()             .storeUint(0xf8a7ea5, 32)                             .storeUint(0, 64)                                     .storeCoins(1000)          // RELATED TO QUESTION 1             .storeAddress(self.beneficiary)             .storeAddress(myAddress())             .storeUint(0, 1)                            .storeCoins(1)                           .storeUint(0,1)                                       .endCell();          send(SendParameters {             to: address(""), // RELATED TO QUESTION 2             value: ton("0.05"),             bounce: false,             mode: SendIgnoreErrors,             body         });     } (reply to 76397)

trungnotchung: thank you i'll try both (reply to 76397)

&rey: 1. Let owner pass the jetton wallet address, it is the simplest solution. If you need jetton wallet address in another handlers, say so, it has a more complex solution.  2. Let owner pass the amount to withdraw. It is impossible to read jetton wallet balance onchain. (You can withdraw all balance sending 120 messages which would move 2^119,2^118,...,4,2,1 tokens in expectation that some messages fail and some succeed, but that is not as cheap.) (reply to 76406)

O: Ok I will try to send as msg params, thanks (reply to 76412)

Viacheslav: Hello I'm getting errors with light api Maybe someone can help?)

yolo: Hi guys, how can I get notification about, sending/recieving crypto?  Python

Vladimir-mini-high: how to get info on token amount change on address, given a transaction ID? I made a parser of transaction traces for dedust swaps, but there should be a more general-purpose approach, right?  On ETH I would just track ERC-20 transfer events

•: have you solved this problem? (reply to 69673)

Slim: Guy please is there a way to activate your wallet using JavaScript

•: in my case there is was bad with rpc... (reply to 69673)

•: oh, i see the solving. Great🔥 (reply to 69673)

avantor: I see (reply to 76373)

yolo: Hi everyone  How can I get notifications about transactions? python

•: In your Jetton wallet contract of owner address must be transfer token function. So call it and send Jetton to address (reply to 76373)

•: Jetton wallet locate at another address of owner (reply to 76373)

yolo: How can i connect webhooks to get notifications? Python

Ehsan: Hello guys How encrypt comment work if we want to do that in code? should we use wallet’s publickey to encode the message? is there any method to be able to encrypt comment in a transaction that can be easily decrypted via tonkeeper by user

&rey: Yes. Do an outgoing transfer, setting seqno=0. (reply to 76438)

Ehsan: How (reply to 76465)

&rey: I don't think there is such API. In particular, there is a lot of transactions, so you must poll them... (reply to 76456)

&rey: See https://docs.ton.org/develop/smart-contracts/guidelines/internal-messages#messages-with-encrypted-comments. (reply to 76463)

Crypto SD: Any rewards contracts available? Either in native token or TON.

Crypto SD: Automatic through token tax, not a claim.

Crypto SD: Or is TON contracts tax free?

&rey: It isn't quite possible, since distribution of reward/tax/etc to N users would involve at least N transactions and therefore be really expensive. (reply to 76474)

Crypto SD: Ok, so would need to create an external source for claim, based on holdings. (reply to 76476)

&rey: This is not the only way. (reply to 76477)

Nabhdeep: @avantor000 (reply to 76306)

avantor: yeah, what about discussing it via DM (reply to 76376)

10x: anyone know a good tutorial for creating an NFT collection on TON? Does it work like ETH nft where the public mints the nfts from the contract? or the NFTs have to be preminted?

COTTON: here is something (reply to 63314)

qtyyyy🐈‍⬛: is it means my wallet safe? by the way, why yesterday so many people got wallet drain because of scam airdrop (Lottefi)?  is it because they don't disconnect dapps on their wallet? Or something else.  Please tell me, bcs i got scared with wallet drain. (reply to 76147)

User<6535147937>: Hi,   is there an official channel for TON API support?

ry4n: How to verify? Already listed on main explorers and DeDust

10xCrazyHorse: gm

10xCrazyHorse: excited to explore ton

Memes Mask: Hi, you need send whitelist to support (reply to 76527)

ry4n: Got a contact?🔥 (reply to 76534)

Memes Mask: Idk, but i know group @dedust_en_chat (reply to 76538)

ry4n: Thanks!

Nabhdeep: How can i batch txns in V4 wallet?

Nabhdeep: Using tonweb

&rey: Don't use Tonweb, don't use its high-level wrappers (form and sign message manually) or don't batch transactions. (reply to 76544)

Michele: Hello mates  So actually we can effectively burn jettons even if ownership is renounced?

Nik: Hello, guys, need a kind of help, did the init_block in config is correct? The node is syncing, but the http_api send this error: ``` code = 500   message = "LITE_SERVER_NOTREADY: cannot load proof link for (-1,8000000000000000,34835953):5695B27CD38B9BC46AB7A09967D7591AA2513B7372AE51C760DD64D682DB27A8:F28D76297E7806D24CF111110F527DED07B565693AD4B208C97C9D9419E2C4AF : not in db(during last block synchronization)" ```

&rey: Yes holders can. (reply to 76554)

к.: Hi, when we send TON to a not deployed TON address we will pay the wallet deploy fee as well.  But the wallet need to contain the public key of receiver to use it for sending transactions later.  Where we get the public?

&rey: No, wallet will remain uninit but with nonzero balance. (reply to 76576)

к.: Got it. Thanks. (reply to 76577)

Nabhdeep: Is there a way to precompute Address with just the public key  without hitting await getAddress()

Roman: Hi! I need to get all the NFTs (from a particular collection) that belong to a specific owner. Is there any efficient way to do so? I mean i can fetch all NFTs one-by-one for this collection and filter only those that are owned by the user.

&rey: tonapi.io or dton.io/graphql offer this. (reply to 76592)

Valamar.$888: Is it possible for a chain split at TON Blockchain happened when one uses POS and the other POW

&rey: In TonWeb, no, as its hash operations are somewhy async and you can't work around having to hash wallet's StateInit. (reply to 76591)

Nabhdeep: I have see address whose status is uninitiated and they still receive token then   How are the addresses computed? There must be a programmatic way to calculate it. Like in EVM chains we can compute addresses with the help of public key (reply to 76595)

&rey: Workchain can be chosen from 0 (basechain) and -1 (masterchain). Hash part is representation hash of contract StateInit cell. (reply to 76598)

Глеб: Hello, when will we be able to see the second quarter?

— 2024-06-30 —

Nabhdeep: Then how is this possible as there is no contract deployed on this address   My question is how can i calculate the address without that async call? (reply to 76691)

Pegu: Yeah my bad, question wasnt the best. I'm trying to create a contract that interacts with all jettons tokens, like a vault tax'ish kind of contract. Is there any contract reference that handles jettons? (reply to 76038)

11: hi, guys, what mean is "$" in this  code?  slice msg::x2()                     asm "<b 124 word Congrats! You have won x2!| $, b> <s PUSHSLICE";

ᎷᏫᎬᏃ: Market cup (reply to 76697)

11: is it just a market cap? 🤔 (reply to 76700)

ᎷᏫᎬᏃ: I think (reply to 76702)

&rey: Please take a look at Fift documentation. IIRC that's "compile-time, store String into Builder". (reply to 76697)

ayushag: Hey people, I'm a blockchain developer. If you are building a company, project (maybe for The Open League), feel free to ping me, I'm looking to contribute to your project for *free* as a part of my growing expertise and community giveback.  ‼️NO SCAMMERS IN DM PLEASE!!  IT'S A COMMUNITY GIVE BACK!

Nabhdeep: @pcrafter (reply to 76693)

Nabhdeep: As you said <workchain>:<contract Statinit> but no contact is deployed on this address (reply to 76712)

Stepan: Is there any way to trigger NFT sell order at getgems.io from my smart-contract?

Stepan: I have a contract that owns some NFTs and I want to make it sell NFTs via marketplace

Stepan: Address is calculated from contract's code and initial data. (reply to 76693)

Nabhdeep: Then how is this address valid. Even this address doesn’t have an contract deployed

Nabhdeep: No contract deployed then there is no contract code (reply to 76726)

Stepan: Just like in ETH and BTC you can send tokens to any address despite of it's private key or smart contract exists

Stepan: If there is no smart-contract and initial data matching this address it will be in such state forever

Nabhdeep: How can i calculate the address without these details.. There must be a way to calculate address as TON also did it (reply to 76733)

Stepan: I suppose you can calculate wallet address from mnemonic/privkey (reply to 76734)

Adapt: Hi, what is the factor or reason that quite often newer internal transaction is minted before some other older transactions? I understand the async way blockchain is built but it's a little bit confusing when some newer jetton swap is minted in one block and other older swap is minted in like 2-3 minutes time window (within many blocks range). What is the mechanism that tells that this event (bunch of internal transactions) will go smoothly in literally 1 block and the other will be split in many blocks? thanks

Nabhdeep: To be more clear   How are TON uninitialised addresses generated?  Is there a way to precalculate it without async call to getAddress(). Just like we calculate it ETH and BTC using public key (reply to 76734)

&rey: Well, it doesn't need to be deployed? (reply to 76714)

Nabhdeep: So how is that address calculated then (reply to 76762)

&rey: From initial contract state. It doesn't need to be present onchain, though. (reply to 76765)

Nabhdeep: If there is no contract deployed  then what would be the initial contract state (reply to 76766)

&rey: Only the program which generated the address knows. Wallet app generates initial state for wallet contract and shows only address, for instance. (reply to 76768)

Nabhdeep: Can you please explain how was this generated then?

Nabhdeep: https://testnet.tonviewer.com/kQAHvVea2EmJ1BLyzNMG-5ask3OR1k_ieWQ2HL99OGjwMFfE

Anton: Is there at least some guide on the Internet on how to create a sniper bot?

Snow Lee: Hi, is there a way to get Jetton balance just by using the json rpc or by other means? I dont want to buy or having to rely on api calls

L (😇,🪽): hey u can try our bot @owaton_bot (reply to 76784)

Anton: I would like to create my own (reply to 76793)

&rey: Yes. Get jetton wallet address. Then call corresponding get-method on it. (reply to 76790)

Dmitry | backend4you.ton: Use any SDK and call get-method on corresponding Jetton contract (reply to 76790)

&rey: I don't think there is; who would share that? (reply to 76784)

Anton: Well, there are quite a few of them now. Perhaps someone shared a simple version of a sniper bot (reply to 76805)

Think: Why is wallet address not picking up in coinbase

Think: Trying to transfer ton , wallet address not acceptable

Snow Lee: Hi, is there an example on this. And thank you so much for responding to my message (reply to 76799)

Snow Lee: Try reinstalling or upgrade the version (reply to 76828)

Дарина: guys my fullnode seems to performance slower than before. why is that? and whats the solution ?

User<7219092765>: Hallo Leute, wir sind auf der Suche nach Mitarbeitern für ein Kryptowährungs-NFT-Projekt:  Beta-Tester ($200/Woche) - keine Erfahrung erforderlich Moderator ($300/Woche) Community Manager ($500/Woche) NFT-Künstler (verhandelbar) Entwickler (verhandelbar)  Wenn du interessiert bist, melde dich bei DM!

&rey: Please use @tonhunt. (reply to 76908)

T: Hey I wrote an article about all the things I learned the last two weeks while developing some tools for ton, it’s focused for developers and contains most of the issues I had and some projects i discovered, would love to have some feedback on the technical parts of i got everything right and if it’s helpful https://medium.com/@crjameson/the-open-network-ton-a-deep-dive-into-how-it-works-popular-memes-defi-and-airdrop-farming-d531e64a8cc5

T: I will do some more how to write a coinsniper and a market making bot and some of the other tools I build

Matthew: hi are you ayush from stanford's Ai lab or is that someone with same full name (reply to 76710)

Matthew: haha looks like common name np all good

Matthew: dear admins ok to put a job advert in the chat? thanks!

Dmitry | backend4you.ton: Never heard of it (reply to 76954)

badbadnotgood: any idea why I cant connect my wallet when providing           tonConnectUi.setConnectRequestParameters({           state: "ready",           value: {             tonProof: payload,           },         });   ?

•: in theory you sholud scrap data and call smart for hot event. you can find more real examples on other blockchains like ethereum, bsc and etc on github or somewhere. create script for server and call smart contract for neccessary event. (reply to 76784)

User<7214255556>: What chain? (reply to 76784)

ayushag: No, I'm not from there 🤔  Its a quite common name 😅 (reply to 76958)

ayushag: You can dm me with that (reply to 76961)

Anton: What do you mean? TON Chain? (reply to 77001)

Амир: Of course Ethereum (reply to 77001)

zeligmann: I have two questions.  1. How is the smart contract balance replenished?  2. Why is it that with any transaction in my contract the same amount of gas arrives in the same wallet?  That is, I send 0.05, but 0.04 comes back to me, although it shouldn’t?

Амир: Maybe ur contract is not deployed yet. As i know at least sending msg to uninit contract causes such behaviour (reply to 77014)

zeligmann: No, my contract is up.  It's active in Tonscan, but I don't understand what's wrong with it. (reply to 77015)

Амир: Send a transaction pls (reply to 77016)

zeligmann: WoIqadpHyXi3689gC+IyGxhIAY80qXVIZbFdgfQf+uA= Here at this hash (reply to 77025)

User<7214255556>: oh then its simple enough, but is there enough liquidty to be snipping? (reply to 77004)

User<7214255556>: or u trying to grab like an nft?

Anton: I'm trying to create a bot to snipe tokens, when liquidity is added it should buy a token

User<7214255556>: yeah i understand, i was asking how big is the trading volume on ton

User<7214255556>: is it worth the effort?

Anton: yep (reply to 77035)

yolo: Hi guys👋  I have this info after receiving transaction, how can I do it in user-friendly form??

User<6976132603>: Hello! I'm currently seeking a new project to join. As a blockchain full stack developer, I specialize in developing DeFi platforms, NFT marketplaces, Telegram bots, and more. Please let me know if there's an opportunity where I can lend a hand!

User<6008048161>: I'm interested in joining a new project where I can apply my full-stack development skills. Specifically, I have experience creating TMAs, Telegram bots, and Telegram stickers. If there's an opportunity where I could assist, please reach out

zeligmann: What mean 128 code in transaction?

User<7219092765>: Leute, unser Team sucht Leute für NFT-GAME  wir suchen Beta-Tester und Chat-Moderatoren 🤑😎 Wer Interesse hat ein Teil unseres Teams zu sein, schreibt mir für Details 🤝.

•: import { Address, fromNano } from "@ton/ton"; console.log(`Wallet Address: ${Address.parse(data.accountId)}`) console.log(`Amount: ${fromNano(data.lt)}`) console.log(`Link: https://tonviewer.com/transaction/${data.tx_hash}`) (reply to 77047)

Dmitry | backend4you.ton: It means contract has thrown this error when one of checks failed. You need to look into contract code to understand exact reason. (reply to 77069)

•: Where you find descriptionn of this code? (reply to 77076)

Nerkrkririei I Think I Need A It's A: Where can I find a good RPC? The public one on ton's website is low quality; it often times out and throws errors  failed to send message: lite server error, code 0: cannot apply external message to current state : Failed to unpack account state

Dmitry | backend4you.ton: You need source code or some other docs about contract which thrown error. Contact contract owner / developer / etc. (reply to 77079)

Oke: Am interested (reply to 77084)

Elite : Karma Hits Back: Scam ? (reply to 77098)

zeligmann: That's my contract. I'm learning to write contracts and I can't tell where exactly I made an error.  Can you help me figure it out?  Or someone who knows how to write them correctly. (reply to 77076)

Greg: I created an AI agent that writes FunC smart contracts pretty well. I'm brand new here so don't want to post a link but you can DM me and I'll send you a link to try it out for free. (reply to 77108)

Greg: Anyone here know what's the general process for proposing/reviewing/submitting a new TEP?

— 2024-07-01 —

N: Could you please clarify where Telegram Stars are deposited? Do they go to the Telegram wallet of the bot owner? Also, is there any configuration required in BotFather for the wallet?

Snow Lee: Hi, sorry to bother you again, is there an example of this online i could find anywhere? (reply to 76799)

avantor: you can find the RPC url in chainlist (reply to 77080)

Snow Lee: How do you retrieve Jetton balance? (reply to 52211)

Snow Lee: Has there been reply to this questions? (reply to 47654)

meomeocoj | Mike: hi guy is there any practice for using sha256 for a snake_slice

meomeocoj | Mike: Because the data i want to hash is larger than 1023 bits.

musashi: https://docs.ton.org/develop/func/cookbook#how-to-send-a-message-with-a-long-text-comment (reply to 77201)

meomeocoj | Mike: i mean how to using sha256 to hash this snake_slice (reply to 77204)

musashi: try this node package @aws-crypto/sha256-js (reply to 77207)

Snow Lee: bác ơi cho em hỏi chút, em đang bị kết nối testnet tonweb fail ko lấy đc data Jetton, bác giúp em với (reply to 77207)

Snow Lee: const jettonWallet = new TonWeb.token.jetton.JettonWallet(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'), {                 address: "kQDOmgR3SnwNNQ0cYnCKGE5P33JLYyglMO5b-3xOtVIlC9eR"             });             const jettonData = await jettonWallet.getData();             console.log(jettonData) Error: http provider parse response error

meomeocoj | Mike: i find a solution for FunC (reply to 77208)

meomeocoj | Mike: Api of Toncenter is not reliable, please try tonapi or alternative solution (reply to 77209)

Snow Lee: i'm using orbs access and it's still the same error (reply to 77213)

musashi: cell_hash(cell, 256) (reply to 77212)

meomeocoj | Mike: orbs've used the same interface and engine like toncenter (reply to 77214)

Snow Lee: i tried the solution of getting jetton data via getData worked on mainnet, but it doesn't work on testnet, that's the problem i'm having (reply to 77217)

meomeocoj | Mike: HASHEXT_SHA256 i found this instruction, but dont known how to passing the slice (reply to 77215)

Snow Lee: via this, works fine in mainnet, broke on testnet when i tried to config tonweb

meomeocoj | Mike: https://docs.tonconsole.com/tonapi/api-v2

meomeocoj | Mike: you can use this instead, this api also have nice wrapper api to use.

meomeocoj | Mike: It is using by tonviewer by both testnet and mainnet

Nobody: Does anyone know why does querying a transaction hash need an address?

meomeocoj | Mike: this function use another opcode F900 instead of F902 in SHA256U (reply to 77215)

Nobody: I want to get the transaction detail but some of the TonClient requires address to query

meomeocoj | Mike: https://docs.ton.org/learn/tvm-instructions/instructions it's not show that using sha256 for hasing ~~

Sagara: Hi,  Status command displays without local node section. I tried to set the validatorWalletName but get this "Error: lock_file error: time out.". Anyone know what is the issue?

Sagara: https://t.me/AnswersTonBot ? (reply to 77237)

Anton: Hey. I know it’s silly question, but still  I’m using tonapi and trying to understand how to get my balance in TON/USD for each token  I’m currently receiving    {     "balance": "29952119503881",     "price": {         "prices": {             "USD": 0.02233574107696259,             "TON": 0.0028974906211804386         },     },     "jetton": {         "name": "$TON Mixer",         "symbol": "MIXER",         "decimals": 9,         "verification": "whitelist"     } }   But if I’ll multiply item.balance * item.price.prices.USD I’ll get some crazy number  So how can I get my actual balance (29951.xxxx) from this number?  I answered myself to this  API returns value in nano, so just need to multiply it by 0.000000001

Nobody: how do i query transaction detail just by using transaction hash? like ton explorer

User<6746015275>: Hlo

Thành Lê |: Hey for TON Open league farmer, we have built DEFI tracking to help

Thành Lê |: https://x.com/get_nimbus/status/1807636040469053665

Usman ghani 🌊: I just want to know how costly it is to make a mini mining app like blum

Yo: Хочешь свой проект запустить? (reply to 77277)

Usman ghani 🌊: Yes (reply to 77280)

Ben: how do i install TON node?

Dmitry | backend4you.ton: Have you tried following docs? (reply to 77305)

Nerkrkririei I Think I Need A It's A: Ton isn't listed (reply to 77186)

Nerkrkririei I Think I Need A It's A: ?? (reply to 77080)

Snow Lee: i don't want to use it because of the scale of my projects, i'd have to buy the api key in order to get more requests (reply to 77227)

Snow Lee: https://docs.ton.org/develop/dapps/asset-processing/jettons#retrieving-jetton-wallet-addresses-for-a-given-user i just need help replicating this code on testnet for tonweb

A: /stat@combot

Dmytro: Hello! My liteserver was working fine for a week, but something happened overnight. Blocks are still coming in, but for some reason, the state is not being serialized. According to the logs, it hasn't been updated since around 10 PM the previous day. At 4 AM, serialization occurred at 04:22:41.479231663 - started serializing persistent state for (-1,8000000000000000,38717249), and then the same thing happened at 5 AM. However, in real-time, the data is not being serialized, and the status shows a delay that is only increasing, not decreasing. According to the logs, last_known_key_block_ago is also only increasing. Does anyone have any ideas why this might be happening?

Lorenzo ⚡️: Hey Ton Team  I want to create an AR Game on Ton Network but I dont see if you have any AR integration on Telegram. Can you someone help on this?

User<7159049465>: Hello, I want to deploy jetton tax contract... Anybody can help me?

User<7159049465>: I tried to modify send_token function but it didn't work well...

v: https://tonviewer.com/transaction/4b957dbc66d5b5cb56ecf9ab34d2bef36c289dcfb515a75650d257f79356c6da  this's SUSPICIOUS transaction， why？

Jiten: any game developer here ?

Rae: Depending on what you are trying to build, I can probably refer you to a good dev studio (reply to 77418)

avantor: what kind of the game dev are you looking for? (reply to 77418)

Jiten: A tap game like hamster (reply to 77446)

avantor: ok, I can do it (reply to 77447)

avantor: can you share the requirement via DM in detail? (reply to 77447)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 58 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 28  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Pegu: How do i enforce a certain amount of fees to be stored in the contract?   My contract flow e.g. -> Receives 1 TON -> Send raw message out 0.9 TON (Essentially taking 0.1 as fees)  Message mode is configured to 0  However, my contract is receiving less than 0.1 TON.  Is it due to rent fees or did i misconfigure stuff?

&rey: Both storage and compute fees. Please take a look at raw_reserve. (reply to 77458)

Nabhdeep: is there a function which can parse rawBody of a txn?  example  b5ee9c7201010101000e000018d53276db0002a4bb2924ffff  Expected  query_id: 744073709551615

&rey: Is the error message below full? (reply to 77080)

Nerkrkririei I Think I Need A It's A: Yes, but I also get errors that the connection timed out (reply to 77468)

&rey: Do you also have TL-B for transaction? (reply to 77467)

zeligmann: Can someone help with a wrapper and tests for a func contract? I already write a contract, wrapper and tests, but they show that my transactions are bounced and I don’t understand why. Naturally not free.

Nabhdeep: yes (reply to 77470)

Jimmy Becen: Hi guys, I have the above problem in testnet, what is the cause?

Nabhdeep: txn id? (reply to 77473)

&rey: boc = base64.b16decode('b5ee9c7201010101000e000018d53276db0002a4bb2924ffff'.upper()) c = pytoniq.Cell.one_from_boc(boc)  # <Cell 96[D53276DB0002A4BB2924FFFF] -> 0 refs> s = c.begin_parse()  opcode = s.load_uint(32) query_id = s.load_uint(64) (reply to 77467)

Jimmy Becen: https://testnet.tonviewer.com/transaction/aab374654d4b5c9d6306292b228a1e5f392c7c70d65ffea1c7908b2500447afb (reply to 77474)

&rey: It isn't a good idea to send messages (from wallet) with mode not involving +2. (reply to 77473)

Nabhdeep: insufficient TON (reply to 77476)

Jimmy Becen: nope, I still have balance, it stops when I try to send tons to another wallet (reply to 77478)

Nabhdeep: probably  the amount you are trying to send it > than ton balance (reply to 77479)

Nabhdeep: can we use query_id for our use like assigning a unique uint64 to it? (reply to 77475)

&rey: It's worth noting that query_id can't be trusted to be unique (clients may select number of their choice), so it can only be used to speed up transaction processing. (reply to 77485)

Sunil | Aerius Labs: How to check if a transaction is success or not, after sending a transaction ?

&rey: The first step is to define success for the exact transaction you sent. (reply to 77488)

&rey: Yes. (reply to 77471)

Tyson (NEVER DM FIRST): Is it better to submit TX to a public RPC vs a private node? I see my TX land a few blocks after others... Should I submit transactions to a public endpoint?

&rey: Wider you distribute the external, earlier it may be recorded. (reply to 77492)

Nabhdeep: what do you mean by "define success" here? (reply to 77489)

Sunil | Aerius Labs: Assume out four transaction I am defining last transaction as success ? (reply to 77489)

Nabhdeep: as i also wanted the same thing 1. Txn is only for a contract what if the txn was success for current wallet_contact but failed at destination? current will still show success

&rey: Transaction chains may have many different outcomes. Let's take a DEX swap: balances may be totally unchanged; tokens may get to the DEX but get eaten somehow; swap may complete but excess TON would not be delivered correctly; etc.  Also, transactions are not literally arranged in chains; jetton transfers usually have two final transactions, those being transfer notification and excess TON return. (reply to 77499)

Tyson (NEVER DM FIRST): Ok thanks :) (reply to 77494)

Nabhdeep: so you meant that excess TON return can be considered as success? (reply to 77502)

Tyson (NEVER DM FIRST): Did the github get altered? I am trying to install MyTonCtrl to setup another node but I am getting this error now:  TON does not exists, building --2024-07-01 13:24:36--  https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/ton_installer.sh 2024-07-01 13:24:36 ERROR 404: Not Found.

Tyson (NEVER DM FIRST): I just used this command the other day to setup nodes tho so weird its broken now

musashi: I think he mean that you need to define success like what's your expectation for some unit tests (reply to 77506)

Nabhdeep: then to be sure we would have to follow the whole chain   for Jetton txn    // sender_wallet_contact-> sender_jetton_wallet-> receiver_jetton_wallet (reply to 77509)

Nabhdeep: or is there some point in the whole txn chain Like after this point that chain will not fail? (reply to 77509)

&rey: There might be. For instance, if you send jetton transfer request (with all previous being complete) when jetton balance and attached TON are sufficient, then that transfer will eventually succeed. (reply to 77512)

Ryan James Smitch: guys, our team is looking peoples for NFT-GAME  we are looking for beta-testers and chat-moderators💲 who interesting be a part of our team text me for details 😮‍💨

Nerses: what can cause such error during compilation npm ERR! could not determine executable to run  ?

Pegu: Thanks, i'll take a look at that (reply to 77464)

Nabhdeep: why there is no gas_fee in the response   {       '@type': 'query.fees',       source_fees: {         '@type': 'fees',         in_fwd_fee: 721600,         storage_fee: 72,         gas_fee: 0,         fwd_fee: 0       }     }  estimateExternalMessageFee()

Pegu: I've added raw_reserve but it seemed like it kept more than what was indicated  My contract process -> Receives 1 TON -> Calculates fee -> raw_reserves(fee, 0) -> send_raw_message(1 TON - fee, mode = 0)  Is there anything wrong here? (reply to 77464)

&rey: Please try — Receives 1 TON — raw_reserve(0.1 TON, 4) — send_raw_message(0, mode = 128) (reply to 77535)

Nabhdeep: @pcrafter (reply to 77531)

Nabhdeep: how do you calculate txn fees?

&rey: From the top of my head, generally. (reply to 77542)

Nabhdeep: Hardcoded?

User<6847374185>: I need help

User<6847374185>: i sent usdt from telegram wallet to OpenMask wallet, but the funds are not showing in OpenWallet.

sparkle: Hi

User<6847374185>: but I can see it in tonscan (reply to 77558)

sparkle: I need developer

Skye2920: what do you need exactly? (reply to 77561)

sparkle: Telegram mini app (reply to 77562)

User<6847374185>: I sent 8 USDT, but its saying 0 TON... (reply to 77558)

User<6847374185>: Worst coin I've ever seen, I've never had a problem like this

User<6847374185>: I still don't understand how this crypto works, as they say there are no fees

&rey: Have you seen "Import tokens" below? (reply to 77572)

User<6847374185>: Yes, but I don't know where I can get this token (reply to 77580)

&rey: Tether USD address is EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs. (reply to 77581)

&rey: Does it work now?

User<6847374185>: So thats the token? Its saying "Name required" (reply to 77582)

User<6847374185>: "name" is required

&rey: USDT. Or however you'd like to label it. (reply to 77585)

Joseph: Hello.

&rey: Ok. It seems Openmask does not support USDT; you may file a bug and use other wallet app meanwhile. (reply to 77589)

User<6610577332>: I used Fragment to withdraw 50% of the advertising revenue of my Telegram channel, a total of 55.20844TON. I connected the Telegram Wallet, but when I clicked to withdraw the rewards, it showed something error, please try again later. Now my revenue have been showing pending status and have not been refunded to my channel. I can't withdraw again.

User<6610577332>: Has anyone encountered this problem?

Pegu: Doesnt mode 128 takes all the balance in the contract? (From previous fees etc) (reply to 77540)

&rey: It does, except those assets reserved with raw_reserve in the same transaction earlier. (reply to 77600)

^_^: Hi everyone, How to verify the social network subscrption in Telegram mini app? Like Twitter and Telegram group subscription. Please let me know.

Pegu: I need to keep the previous fees that my contract stored (reply to 77601)

Pegu: Doesnt 128 get rid of all my fees earned?

Ryan James Smitch: guys, our team is looking peoples for NFT-GAME  we are looking for beta-testers and chat-moderators💲 who interesting be a part of our team text me for details 😮‍💨

Pegu: Ahh maybe its mode 64

yolo: Hi, this is my encrypted transaction. how do I make it user-friendly?  as example: time: sender: receiver: amount: + or -  event: message id: 1719579368150551477 data: {"account_id":"0:584fe686fd70db305b009827589d64448b2fdbc1ecd85a3d63d805dc4f03fda4","lt":23178694000003,"tx_hash":"20343557056e82f53a3dedede35c1c70cf9de8edb046da662c18761fe4d648a2"}

Ihor: Hi! Is there any flag or parameter which can be used in order to determine was this transaction involved in staking (deposit or withdrawal) or not?

Pegu: hmmm using  mode 64 now gives me exit code 37, not enough ton. How do i store the appropriate amount of coins in the message thats remaining balance of the transaction after raw_reserves?  Do i store coins just 0 since 64 will send all? (reply to 77610)

Assasin: Why the transferring funds..working in API but the same code doesn't run in scheduler....Getting a false txnHash...this is rediculous nature... Using tonweb.js

Assasin: Working from past 1 week on this

yolo: How to get unlimited status in tonconsole?

User<6746015275>: Hlo

Nabhdeep: Does anyone have a way to calculate gas before sending txns or should i use this as standard and variate it as per need  https://docs.ton.org/develop/smart-contracts/fees#faq

MT: How to use tonweb to query the nft collection in a wallet address

Anthony: Hello, I'm trying to understand why when decoding users' JWT I don't get the same address they have in the web app. Is that normal? Is there like multiple addresses for a user?

Sagara: Hi,  I'm trying to run a ton RPC node for few days now. I have followed the latest documentation changes (Changes after 2024/06/28).  I have few issues in 3 different nodes.  Node 1. Liteserver node configuration script is pointing to missing file. (https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/ton_installer.sh) So I'm unable to try the liteserver node setup.  Node 2. I tried to build a Full node and use that as RPC node and facing few issues. - Node set up initially worked well and started to sync slowly. - To speed up, I download the latest dump(https://dump.ton.org/dumps/latest.tar.lz) and used that as a DB but it's not picking up the dump data and not even syncing now. Even though both mytoncore and validator is running without errors.  I see the local validator status as "Local validator out of sync: 1719846019 s", value is increasing. Don't see DB size increase(It's stuck at 638 GB).  Node 3. This VM with 32 CPU and 128 GM RAM which I need to set up for a Full node. It is giving me some different errors. With all below point, I see the DB side increase and it's about 720 GB now. - Does not show the Local validator status. Tried to add the local wallet key as suggested in the documentation. But getting a file lock error. At the same time it shows as wallet is set as well as it's already set. - In mytoncore service show this error "save_db error: lock_file error: time out." - In logs I see this log not sure it's a error or not "does not have a valid ShardAccount to unpack"   Can you please help me with this?

&rey: Yes, multiple. They may differ by bounceable flag. (reply to 77674)

Sagara: @tsivarev Would you please help me on this or direct me to some materials please ? (reply to 77676)

&rey: Using those precalculated values is better in terms of app complexity. (reply to 77670)

11: hi guys, why i get error code 9 when i change the counter type.    ;; load_data populates storage variables using stored data () load_data() impure {     var ds = get_data().begin_parse();      ctx_id = ds~load_uint(32);     ctx_counter = ds~load_coins();      ds.end_parse(); }  ;; save_data stores storage variables as a cell into persistent storage () save_data() impure {     set_data(         begin_cell()             .store_uint(ctx_id, 32)             .store_coins(ctx_counter)             .end_cell()     ); }

11: i know error code 9 means "Cell underflow. Read from slice primitive tried to read more bits or references than there are." but this code looks good

&rey: Have you updated contract initial data? Are you sure that cell underflow happens in the quoted code? (reply to 77697)

11: omg, i forget change the wrapper contract

11: thx so much (reply to 77703)

Ryan James Smitch: guys, our team is looking peoples for NFT-GAME  we are looking for beta-testers and chat-moderators💲 who interesting be a part of our team text me for details 😮‍💨

&rey: Please move this to @tonhunt and don't ignore that your message gets deleted. (reply to 77709)

Bilo: Hi all , i want to purchase the ton nft sender with custom message

Alina: it worked for me: Address.parse('EQA.....').address  the word address is not in the prompts, but it worked for me. (reply to 70766)

Yashwanth: Ok (reply to 77761)

oknu: is there no way to generate a transaction hash prior to sending a transfer?

Роспатнюк: Hello everyone, tell me who it is, what am I doing wrong ? (Error: Mnemonic deployer was chosen, but env variables WALLET_MNEMONIC and WALLET_VERSION are not set)  I'll add I'm going through Step 8 now (03. Building your first web client)

oknu: did you set the env variables? (reply to 77783)

Роспатнюк: Most likely not, I don't see the installation command in this tutorial (reply to 77790)

oknu: before your node command or whatever, use WALLET_MNEMONIC="your memonic" WALLET_VERSION=4 or something (reply to 77794)

Роспатнюк: I don't really understand why if I use it anyway (import { TonClient, Cell, WalletContractV4 } from "@ton/ton";)   WalletContractV4 (reply to 77796)

oknu: the error says you need to specify these env variables, so they're referenced somewhere in the code (probably something like process.env.WALLET_MNEMONIC) (reply to 77799)

oknu: you can change them out for your values in code

Роспатнюк: Do I understand correctly that the code from the textbook could already be outdated and in order for it to work, you need to tweak it a little? (reply to 77800)

Zakir M.: Hello everyone, I need to make a bot that needs to process a lot of requests, should I use node js or is it better to choose something else? Taking into account the fact that I have more experience with node js

oknu: it means you need to provide your own wallet to use it (reply to 77803)

Роспатнюк: I provided it in the same way as I did in the previous lesson, testnet is active, mainnet is inactive, and there is a TON there. (reply to 77806)

Роспатнюк: whichever network I choose, the error is the same

Rick: Hello. I'm a developer would like to try Ton. I can do pretty much everything, but I don't want to come up with an idea. Is there anyone here that has 'something simple' hat I could try to implement, to see how this platform works in practice? The docs are great, I just wanted to do something that is not just an example. Thanks.

oknu: try offline transaction signing (reply to 77813)

Rick: Thanks, I'll try that (reply to 77819)

Роспатнюк: that is, I can write the version and mnemonics right in this file without delving into why it doesn't work?

&rey: It's better to set those in .env.ts, so that script doesn't fail check whether keys were provided. (reply to 77824)

TON Bounty Bridge: ​6219861961488110  🏷 Developer Tool  Summary:توران موسوی  Created by 6037701556160635

Usman ghani 🌊: Suggest me please   I want to develop my token airdrop bot  game  so which is the best between  Farming 24 hours or  Tap games like notcoin

Baller: Hi I’m interested in building a project that solve real problem in my locality (reply to 77848)

Baller: I have 0 dev knowledge

Baller: T.y

Nerkrkririei I Think I Need A It's A: ?? (reply to 77080)

User<5188157613>: 1 (reply to 77846)

User<6397988095>: @ballerfx

Yasuke🔥: Hello, I'm a MERN full-stack dev. Looking for a team to work with. Thank you

$hogun: Hey there im looking for a dev with experience building a meme token on telegram.

— 2024-07-02 —

Benjamin🔵 ONUS: UQCCyBxtV_SJQXreFGeubLC792QXq-oYPSJTBYTGDI-xKd1s

Jared: I accidentally sent TON to the USDT master_jetton. Is it possible to get it back?

Jared: Do you know for sure? It was a big amount. (reply to 77905)

Iakov: Hi. i just joined the Russian language group and was banned for sending a link to github official ton-blockchain/token-contract repo..... Is there any way to contact admins to unban me? It was not intentional - I really needed to refer to that repo

meomeocoj | Mike: hi guy wwhat iss the best way to sha256 a data > 1023 bits

User<7376766125>: Farming (reply to 77839)

User<7376766125>: Is it to an exchange (reply to 77897)

Jared: No… I sent TON from my wallet to the USDT master_jetton (reply to 77940)

Jared: And apparently no admins want to help me

User<7376766125>: Can I see the transaction (reply to 77941)

Jared: You’re not on the team man (reply to 77943)

User<7376766125>: No am not but if is something that can be reverted I will guide you on how (reply to 77946)

Jared: e7b663778809cbb4ac7884bfe8b5ada1a0a9145e49208d947cc3ad4769c702da (reply to 77947)

Jared: Sent from my TON wallet to the USDT master_jetton contract

Jared: Are there any admins online??

User<7376766125>: Omo only the team can help not telegram support

Jared: How would I reach out to them? (reply to 77953)

ZQ: Hi, anyone can help me? I am using ton-connect-bot as example to transfer TON to other TON Space address, but it is always bounced back? anyting am I missing?

Kryptonite: can any one suggest me any opensource codebase for how to connect tonconnect to my next.js app and deploy smart contracts and interact with it

Kryptonite: i have already built my project with the help of FunC and Blueprint framework

Kryptonite: i went through tonconnect sdk documentation:  https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html  but this was of no help , and i am clueless how to deploy smart contract using tonkeeper.

&rey: https://docs.ton.org/develop/dapps/ton-connect/transactions#smart-contract-deployment (reply to 77972)

&rey: Jetton code does not allow to get it back. Anyone suggesting otherwise is either willing to finance it himself or a fraud. (reply to 77897)

&rey: You can choose between Tonhub API, Toncenter and Orbs on https://tonstat.us. (reply to 77857)

&rey: HASHEXT_SHA256 opcode as described in https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#hashes. (reply to 77932)

ry4n: Hey, who’s responsible for approving pull requests on Tonkeeper GitHub? Thanks

Tyson (NEVER DM FIRST): Is there anyway to make transactions land faster with private node?

WinK: Hi guys,  Which is better to learn? FunC or Tact? Which has more support and resources?

Assasin: Please help guys

Assasin: How to transfer ton in scheduler

Assasin: But not in scheduler

Sagara: Is there anyone who can help me with these errors. I have already downloaded the dump and restored. I see these error logs. [ 3][t31][2024-07-02 05:34:53.831419953][liteserver.cpp:84][!litequery]  aborted liteserver query: [Error : 651 : cannot load block (0,8000000000000000,44332968):: block (0,8000000000000000,44332968) is not in db (possibly out of sync: shard_client_seqno=38735137 ls_seqno=38735237)] [ 2][t31][2024-07-02 05:34:53.832371730][overlay-manager.cpp:123][!overlaymanager][&OVERLAY_WARNING]  [overlaymanager]: can not parse overlay message: [Error : 0 : Wrong constructor found at 4]

&rey: No. Probably it will be slower instead. (reply to 78009)

Nobody: Is there a way to get transaction detail by transaction hash?

Nazzyexchange 🎖️: Hi guys I noticed that many people here are looking for some help regarding TG games, Bots, Lanuchpads, Market places , Hackathon etc...  Ping me a message and I will tell you more .I am from experienced venture builder and software studio Thank you 😊❤️

Nazzyexchange 🎖️: Use exchange (reply to 78031)

Nazzyexchange 🎖️: Bitget  Gate.io Etc

Nazzyexchange 🎖️: Available Frank What do you want exactly (reply to 77884)

Crypto A99: Mintable

Nerkrkririei I Think I Need A It's A: But how can I use toncenter or tonhub to send a transaction? (reply to 77983)

Орельан [NEVER DM FIRST]: Hey there guys, i got 5 TON on testnet on an address which does not has any code. Can i still deploy some code to this address( wallet v4) or should i deploy the wallet smart contract to another address and then withdraw the testnet ton there?

Nerses: // some code           send(SendParameters{to: msg.data.__messenger,                             bounce: true,                             value: 20000000,                             mode: 0,                             body: data; });               }     in this TACT code in case msg.data.__messenger doesnt have appropriate recieve for handling that message and send fails, will some code be executed ?

Yhåw: Kk

•: If it is basic Jetton master, then it can only mint new Jetton to wallet. And there is no opportunity for sending back TON. Code is the law in ton, but… you can change code inside smart contract if you added code that allow you to update whole code of smart contract. (reply to 77897)

Kryptonite: can someone help me why i am facing this error ?

•: If there is no updating line of code, TON will spent for rent of this smart contract for years and years) (reply to 77897)

Kryptonite: but i am trying to deploy smart contract (reply to 78080)

cfs chef: i`m also deploy contract

cfs chef: let cAddress = contractAddress(0, stateInit);   await tonConnectUI.sendTransaction({                 validUntil: Math.floor(Number(new Date()) / 1000) + 360,                 messages: [                     {                         address: cAddress.toRawString(),

cfs chef: If the problem still cannot be solved, then check the BOC.

&rey: You can deploy only the same contract (that is, same initial code and data) which generated the address. (reply to 78058)

•: Tact is more undestandable and readable, but has more gas optimization issues. It is from community and it is beta. Func native language from TON. It is more hard for understand, more low-level. Need to learn what is cells for example, but here you can control for gas In my opinion, for simple and fast dev, and small project Tact is cool. For big and complex project better is Func. (reply to 78020)

Орельан [NEVER DM FIRST]: But if the address does not have code, and was just generated from a mnemonic, can i still initialize it with any code in it or it will have to be on another address? (reply to 78090)

&rey: It was not "just generated from a mnemonic". In TON, address is hash of initial code and data. The fact that blockchain doesn't have this code yet is irrelevant. (reply to 78094)

Kryptonite: function generateInitCell(code:Cell | undefined,data:Cell | undefined){ return beginCell() .storeMaybeRef(code) .storeMaybeRef(data) .endCell() }  export async function deployDepositSmartContract(params:TestDepositConfig,tonConnection:TonConnectUI){   const contract = TestDeposit.createFromConfig(params,DEPOSIT_CONTRACT_CODE);   const contractAddress = contract.address;   let message = new Cell()   let generatedinit = generateInitCell(contract.init?.code,contract.init?.data);    const tx:SendTransactionRequest={     validUntil:Date.now() + 5 * 60 * 100,     messages:[{       address:contractAddress.toRawString(),       amount:BigInt(toNano('0.02')).toString(),       stateInit:generatedinit.toBoc().toString("base64")     }]   }   console.log("Transaction: ",tx);   await tonConnection.sendTransaction(tx);   return contractAddress; }  this is what i am trying to do and stuck here dont know whats the issue now (reply to 78086)

charlie: Hi all, could u help check the block in workchain is increasing in order rather than the shard number is different.

cfs chef: import { StateInit,  storeStateInit } from "@ton/core";  let code = Cell.fromBase64(MassSenderBocBase64); let data = beginCell().end();  const stateInit: StateInit = {                 code: code,                 data: data             };  stateInit:beginCell().storeWritable(storeStateInit(stateInit)).endCell().toBoc().toString('base64')

cfs chef: Hope that helps

Usman ghani 🌊: Check inbox please (reply to 78032)

Sagara: I managed to fin the solution. Remove the ~/.local/share/mytoncore/mytoncore.db.lock file (reply to 77237)

Kryptonite: tried this (reply to 78101)

Kryptonite: export async function deployDepositSmartContract(params:TestDepositConfig,tonConnection:TonConnectUI){   const contract = TestDeposit.createFromConfig(params,DEPOSIT_CONTRACT_CODE,-3);   const contractAddress = contract.address;   const _stateInit:StateInit={     code:contract.init?.code,     data:contract.init?.data   }    console.log("code: ",_stateInit.code)   console.log("data",_stateInit.data);    const initCell = beginCell().storeWritable(storeStateInit(_stateInit)).endCell().toBoc().toString("base64")    const tx:SendTransactionRequest={     validUntil:Date.now() + 5 * 60 * 100,     messages:[{       address:contractAddress.toRawString(),       amount:BigInt(toNano('0.02')).toString(),       stateInit:initCell     }]   }   console.log("Transaction: ",tx);   await tonConnection.sendTransaction(tx);   return contractAddress; }   refactored my function as mentioned above

Chris: Hello devs,   I am a crypto marketer and KOLs manager. We are recruiting a team of experienced devs for a ton ecosystem game (like tapswap, hamster and notcoin) If you are working on any existing projects or want to work with us from scratch we offer a great co-working space and environment with good monetary value for freelancers or payscale devs.   Budget is good kindly let me know if you are interested by sending a CV and LinkedIn (if available)  Note : We are also making good investments via our VC branch and if you have ideas or existing projects we would be glad to arrange meeting for grants/scholarship.

_chocolate.py: i want to send jetton from a contract to another contract

_chocolate.py: i create simple transfer

_chocolate.py: but not works

_chocolate.py: cell msg = begin_cell()         .store_uint(0x18, 6)         .store_slice(to)         .store_coins(s)         .store_uint(1, 107)         .store_ref(body)     .end_cell();     send_raw_message(msg, mode);

tobenumberone: How can I verify if a transaction on TON was successful?

Illia: what are mode and s variable values? (reply to 78131)

Illia: Tact for sure if you're a new for web3 and TON  https://tact-by-example.org/00-hello-world  do this tutorial (literary rewrite this code and test it out with blueprint https://docs.ton.org/develop/smart-contracts/testing/overview) (reply to 78020)

Illia: I'd love to add my two cents that FunC is lighter as there're smaller overhead and also, since Tact fully compiles into FunC and you can write FunC binding inside Tact (using native functions), they have identical capabilities, but Tact has more abstractions that makes development lifecycle easier (reply to 78108)

Illia: /v2/blockchain/transactions/{transaction_id}  https://docs.tonconsole.com/tonapi/api-v2 (reply to 78137)

джнея: Hi! Could you help me to figure why ton api receives empty array of events when I try to use this endpoint  https://tonapi.io/v2/accounts/{account_id}/jettons/history  where  account_id = EQBghyYO1PSqiHO70FNCE5NpU94rTE3pfxjGpzB2aD6fWQ1L limit = 100 start_date = 1668436763 end_date = 1719917431

果果: how to check ton address using regExp

Illia: scroll down, there will be response  that's example of successful response for default contract (no transfers) (reply to 78163)

джнея: I dont need example, I need events connected to my wallet address I send (reply to 78170)

Illia: can you send the address of your jetton? (reply to 78173)

mohsen: LiteBalancer in pytoniq fails to connect to node and returns error 651

0x0liver: why send raw message with mode 0, i still must pay the fee?

Illia: ton.org/address u can take a look at how different addresses change  have a look at this standard https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md  for the mainnet user-friendly addresses the following should work: [EFUef][a-zA-Z0-9-_]{47}  you can test this out on https://regex101.com/ (reply to 78167)

Tim: It’s bad practice to use regex for address checking. Please refrain from encouraging it (reply to 78191)

Tim: If you want check address for validity - parse it using ton library for your language (reply to 78167)

Illia: can u explain the reason behind it? is it cause regex doesn't calculate the checksum for the address? (reply to 78194)

Tim: Yes. 0:hex is also valid address (reply to 78197)

Illia: all right, that's great, forgot about it, thanks mate (reply to 78198)

0x0liver: it states that mode = 0 i wont need to pay fee, is it true?

Anthony: Hey, does anyone know where I can find docs for telegram based features like sharing something to a friend from a TON mini app, or getting your user's telegram name?

&rey: You have a better chance in @devs. (reply to 78223)

&rey: By the way, your project should support resolving TON DNS — that is, address in form foundation.ton. (reply to 78167)

Nabhdeep: test TXNs going into Pending  https://testnet.tonviewer.com/transaction/d43f4ae0d6317a6b310d22cfd506ac8fdb83b52c33b081ef16c36050235dc4d5

Nabhdeep: as you  see  by going to address the txn was working 20-15 mins back (reply to 78226)

avantor: hi, did you find any developer? (reply to 75346)

Nabhdeep: It took 7 mins on testnet is there a reason behind this? (reply to 78226)

yolo: Hi guys. How i can generate checks and invoices in TON api (python)?

Артем: Hello. I would like to know how to earn the first audience in my project? We went into beta testing just a couple of days ago, but nothing much comes out of regular posts on the forums. Can anyone help with advice?

Mikael: Hi.  who has had experience integrating payments in Jetton into a smart contract on Tact, please tell me a couple of points: 1. How do you identify by Transfer Notification, what is the address of the master contract for this token  2. How do you send tokens back to the user (if such logic is provided in the contract) 3. Could you drop off examples of contracts where this implementation takes place?

&rey: Blockchain does not offer functionality to generate checks. You can generate invoice offline in form https://app.tonkeeper.com/transfer/<your-address>?amount=<nanoTON> and show to user. (reply to 78250)

Nerses: is there address 0 in TON like in ethereums addres(0)  ?

&rey: Yes. For what? (reply to 78270)

Nerses: in case i have address field as an argument I could use address 0 as NULL (reply to 78272)

&rey: Two zero bits are appropriate in this usecase. (reply to 78273)

Nerses: 1) how can I check that address is zero address (reply to 78274)

&rey: Preload two bits of address. If they are zero, this address is null address.

Nerses: 2) how to check if argument with address type can handle certain type of message ?

Nerses: I mean that argument is address of smart contract (reply to 78278)

Nerses: how that check can be done in tact smart contract ? (reply to 78277)

Nerses: after doing let addr: Slice = Address.asSlice() will it modify initial address ?

&rey: Oh. I don't remember Tact all that well, but seems like message Msg {     out: Address?; } receive(m: Msg) {     if (m.out == null) { } else { } } should work. (reply to 78284)

Precious | UZX: . (reply to 78032)

Nerses: i tried to do something like this         let messengerAddress: Slice = msg.data.__messenger.asSlice();         let twoBits: Slice = messengerAddress.preloadBits(2); (reply to 78290)

&rey: Better .preloadUint(2) == 0. (reply to 78295)

&rey: You cannot. (reply to 78278)

Nerses: i think your approach is better to do that check.In case it doesnt work I will do .preloadUint(2) == 0 (reply to 78297)

&rey: Because there were one or two migrations. Old packages are marked deprecated IIRC. (reply to 78301)

Nerses: send(SendParameters{to: msg.data.__messenger,                                 bounce: true,                                 value: 20000000,                                 mode: 0,                                 body: HTLCNotify {data: HTLCNotification {                                                                             htlcID: msg.data.__hashlock,                                                                             sender: msg.data.__sender,                                                                             receiver: msg.data.__srcAddress,                                                                             amount: ctx.value,                                                                             timelock: msg.data.__timelock,                                                                             hashlock: msg.data.__hashlock,                                                                             dstAddress: msg.data.__targetCurrencyReceiverAddress,                                                                             phtlcID: msg.data.__phtlcID                                                                         }}.toCell()});           } for this code I get error Invalid type "Address?" for fields "to" with type Address in type SendParameters Line 237, col 33:   236 |         if(msg.data.__messenger != null){ > 237 |             send(SendParameters{to: msg.data.__messenger,                                         ^~~~~~~~~~~~~~~~~~~~~~~~   238 |                                 bounce: true,    why it throws error ? I check beforehand that address isnt null (reply to 78290)

&rey: msg.data.__messenger!! (reply to 78305)

Nerses: thanks very much (reply to 78306)

&rey: The reverse. @ton/ton, @ton/core and @ton/crypto are fine. (reply to 78309)

0x0liver: hello @pcrafter do you know it? (reply to 78208)

Julien: Hey there! On Ston.fi, how can I get the expected amount out, or the real one even, with the API? I'm doing the swap like this, but I can't find where I can get this info. THanks a lot  P.S. I searched in the chat history but found nothing

Tyson (NEVER DM FIRST): How can we get our transactions to land faster with private node?

Tyson (NEVER DM FIRST): I can see other users hitting the next block when submitting a TX but my node takes a minute to fully land? I see the TX enter the pool right away

Nerses: will i pay transaction fee for this getter     get fun getHTLCDetails(hashlock: Int): HTLC? {         return self.contracts.get(hashlock);     } ?

Tyson (NEVER DM FIRST): Is there a way to bribe a validator or set a gas fee to land faster on TON?

Tyson (NEVER DM FIRST): Or should I turn my node into a full validator to land faster?

Tyson (NEVER DM FIRST): How are these mevs pushing a transaction infront of mine when mine is in the pool before the mev can submit his?

JohnnyBlaze 🧲: hi, does anyone know of any TON tracker wallet bots?

JohnnyBlaze 🧲: and also, is there a thing like Bubble map for Ton as well? :)

&rey: Externals get recorded in arbitrary order IIRC. You can't change gas fee to be faster. Being full validator would help. In blocks generated by you. (reply to 78338)

Tyson (NEVER DM FIRST): This is what I thought. But how is a MEV submitting his TX before mine when mine is already in order in public pool? (reply to 78350)

&rey: No unless you call it from other functions in contract (onchain). (reply to 78335)

Nerses: so this operation self.contracts.get(hashlock);  doesnt affect as it doesnt change state ? (reply to 78354)

Tyson (NEVER DM FIRST): Is there a way to grab the top validators and submit my TXs directly to them instead of the node to pool?

Kevin.eth: Is there an rpc for exploring the chain?

Ben: 🫡

Kevin.eth: I’m looking to create a block listener

Tyson (NEVER DM FIRST): You would want to host your own private node for this so you have no rate limit (reply to 78360)

Kevin.eth: A public node should be enough? What is the avg block time? (reply to 78361)

Tyson (NEVER DM FIRST): Public endpoints wont beable to stream the states in realtime usually they limited

Kevin.eth: Is it possible to create a listener at a certain address for every block?

Tyson (NEVER DM FIRST): Yes but you need to parse every transaction looking for the values you want. You will need a node that can send every transaction in realtime and parse the data for what youre looking for. When I tried that with a public end point I would get kicked off right away from rate limiting. I switched to a private node and now I can stream everything in real time no limits no forced closed connections (reply to 78365)

Tyson (NEVER DM FIRST): Unless you dont care to see them pending. Then you can just check all the transactions per block after the block is mined

Kevin.eth: Damn, seems complicated af coming from an EVM background. (reply to 78366)

Tyson (NEVER DM FIRST): Welcome. I am from EVMs as well. Trying to learn this chain lol (reply to 78368)

JohnnyBlaze 🧲: love to see smart heads around, sup g's

Kevin.eth: Also wtf is FunC, such an esoteric language (reply to 78369)

Tyson (NEVER DM FIRST): Seems they made their own lol (reply to 78371)

Kevin.eth: Also, how do you even create a simple coin? (reply to 78372)

Kevin.eth: With jetton_master?

Mark: Everything is abstracted away so much (reply to 78368)

Kevin.eth: Humbling af not even understanding anything here. (reply to 78375)

Mark: I recently transferred some TON to an address and realized I cannot do anything unless I have a contract deployed

Mark: Wanted to transfer a few tokens to a different address, had to figure out how to use fift and then deploy the contract

&rey: pytoniq has example for this. (reply to 78360)

zeligmann: @pcrafter Hey, can I text you?  I have a question

Sagara: @pcrafter Is there anyone who resolved the issue mentioned in https://github.com/toncenter/ton-http-api/issues/87 This is related to ton-http-api  [2024-07-02 17:38:41 +0000] [8] [ERROR] Exception in ASGI application Traceback (most recent call last):   File "/usr/local/lib/python3.8/dist-packages/uvicorn/protocols/http/h11_impl.py", line 366, in run_asgi    ..............................     raise RuntimeError(f'No working liteservers with ls_index={ls_index}, archival={archival}') RuntimeError: No working liteservers with ls_index=None, archival=None

Tyson (NEVER DM FIRST): raise RuntimeError(f'No working liteservers with ls_index={ls_index}, archival={archival}') RuntimeError: No working liteservers with ls_index=None, archival=None  You need to set a liteserver to connect to in the list. supply ls_index=0 or 1 or whatever server you wish to use (reply to 78388)

.: Hi,   are ton wallet address requires activation?  and what is the fees for that?  is there any documents I can read about activation fees?

Rae: Anyone know the timezone for the Dora hackathon cut off for ton league

Bands: Same bro lmk if you found the solution (reply to 78377)

&rey: Yes. It is done automatically, though. If there are any fees they are less than 0.01 TON. (reply to 78396)

Anderson: Yes I have (reply to 78434)

Enzo: Which wallet you using? (reply to 78435)

Bands: Xton (reply to 78443)

Enzo: You also having same issue (reply to 78444)

.: is there any documents to get this information? (reply to 78421)

MUSA ABUBAKAR: How can I get ton contact address

MUSA ABUBAKAR: In other trust wallet only wrapped ton and xton showing need guidelines please

Bands: What wallet do you use currently to hold ton? (reply to 78454)

— 2024-07-03 —

Tom: Hello！The tonkeeper mobile terminal is switched to development mode, but no test coins are displayed. Does anyone know?

Key: Hello everyone, I'm building a telegram mini app, I want to authenticate users, after verifying init data from frontend by bot token, do I still need to create jwt token, or is that enough?

ieurjcbei345whs: Hello everyone, does anyone have time to develop a mini app? We want to develop some mini apps, but our team is too busy with time. Thank you!

Zero: Hey (reply to 78520)

Zero: What type of mini app do you need? (reply to 78520)

User<6746015275>: Hlo @admin

pony: i guess, if you want to veify users, you need signData and verify it. (reply to 78514)

pony: Always developer! (reply to 78520)

pony: transfer ton. auto activate. (reply to 78396)

🅰🅻🅰🅽: I have a question about address calculation on the TON blockchain:   when deploying a contract, can we deploy it to an arbitrary address that is independent of its smart contract code?

🅰🅻🅰🅽: an expert tells me that today, but i think it is quite wierd

Behrang: No you can't. The init_state must match the address. (reply to 78548)

Sagara: @VeryBigBanane  Thanks for the direction. I changed my local code and it is working now. I have another issue to verify. I need to route the traffic to my Ton full node which is acting as a liteserver. Server is in sync. when I generated the liteserver local configuration with mytonctrl> installer> clcf , It generated the file in /usr/bin/ton/local.config.json. But when I convert the decimal value to IP under liteservers list it is not my server ip. I used https://www.browserling.com/tools/dec-to-ip to convert the decimal to ip. How to make sure that requests are routed to my ouw server? (reply to 78390)

🅰🅻🅰🅽: Is the rule provided in any document? I can’t find it in ton docs (reply to 78551)

Behrang: I don't have a link.  First, I have tested it myself.   Second, if you could deploy anything on any address, then all Ton blockchain smart contracts where endangered. I, for example, could deploy a copy of USDT jetton smart contract on my USDT jetton address for the first time and increase my jetton balance and then convert it to any other asset.  Third, try it yourself. (reply to 78556)

Jeonghwan | Cosmostation: Hi all.  I'm wondering how can I get a test Grams for running validator? It seems to be deprecated getting tokens from sending pow ext message.

musashi: https://docs.ton.org/learn/overviews/addresses#account-id (reply to 78556)

Cloud: In which file and where should I set is_index=0 or 1

Sunil | Aerius Labs: how reliable is this ""@orbs-network/ton-access": "^2.3.3"," as a RPC endpoint ?

Enzo: Sunil mera bhi same question hai :/ (reply to 78567)

Enzo: I also have the same question man no admin is active

🅰🅻🅰🅽: Super awesome that is exactly my concern. (reply to 78559)

🅰🅻🅰🅽: Just knowing this information in a meetup an hour ago, but i think it is totally wrong and gonna try it this at night, thanks a lot (reply to 78574)

Cloud: After the node is upgraded, the API is no longer available  "error": "No working liteservers with ls_index=None, archival=None",

&rey: In whitepapers. Or at https://docs.ton.org/develop/data-formats/tl-b-types#addresses. (reply to 78556)

&rey: Please take a look at https://tonstat.us. (reply to 78567)

&rey: Use "add wallet" in top of the screen. Remember not to use mainnet mnemonic. (reply to 78503)

&rey: This is better tested. (reply to 78448)

Tom: tks,bro！ (reply to 78586)

pony: about ton connect, whether deeplink or  http bridge, the data transmission method is through SSE, right?

L (😇,🪽): sir can you check your dm pls (reply to 78586)

Mr.K: Hi, can anyone here help me with @tonconnect/ui-react ? I wanna trigger modal display of connecting wallet with my custom connect button

avantor: it is possible (reply to 78548)

charlie: Hi all, how to get master chain block id by workchain block id?

Zion / Nick: I have seen the documentation regarding the validator, does it mean if we run it we can get fees from running the node? (reply to 78586)

User<7376766125>: Minter does not work any reason

🅰🅻🅰🅽: Could you explain the reason, I think it is dangerous, and dedust will be hacked under this scenario (reply to 78607)

avantor: to get the master chain block id, you should use the specific tools and API (reply to 78608)

charlie: could u share an api to me? thanks a lot! I don't find it and can not find the relation in explore. 😭 (reply to 78612)

Jeonghwan | Cosmostation: does anyone let me know test giver address on testnet?

avantor: you can check it by tonapi tonapi.io (reply to 78613)

charlie: yes. but the api in this link support query shards info by master seqno rather than support query master seqno by workchain id. could u help more details about it? 🙏 (reply to 78617)

&rey: Please explain your question on such an example: (reply to 78608)

SHERIF: Please admin, TON crystal is not showing on my Trust Wallet  How do I add TON token?

&rey: I think this is more of question for TON Community chat, or to Trust Wallet support. (reply to 78623)

charlie: for example, the block of work chain will sync in master chain. in addition the ton api support query shards info with master seqno. but how to query master block by workchain block id? (reply to 78620)

&rey: You might not have noticed that single shardchain block can have multiple masterchain blocks corresponding to it (1002; for instance, if shard has some issues). (reply to 78625)

charlie: 😵yes, but theoretically, there will be no problem. in addition I check the tonscan and tonviewer explore. there is no way to check master chain block info even I know I send a transaction.. (reply to 78627)

User<7470537046>: hi

&rey: You should search over masterchain blocks. Use binary search if the block you look for is not recent. (reply to 78628)

Mohammad: Hi

charlie: ic. for example https://tonscan.org/block/0:4000000000000000:44354576 if I want to confirm which master block it is. it's impossible to query. right? I must search over masterchain blocks to get the shards info. (reply to 78631)

abhishek: Hi guys . I have a webapp where users can click on a button. They get a Google login popup and user chooses the account to login and logs in. The popup closes and flow goes back to the website and the user logs in using his Google account.   I want this webapp to be present as a mini app with a bot. So user must be able to go to the bot and click on a button. It should open the webapp in telegram and user should be able to click on a button, login with their Google account and all this should happen in this telegram mini app.  Now when I created a bot and connected this webapp to the bot. I click on the telegram bot link and it does open the webapp. I see the button which says login with Google and when I click on it it gives me a popup for Google login but when I choose a Google account and login. The popup doesn't close and the flow doesn't go back to the telegram mini app . Instead in the telegram mini app , I see the login loader spinning as user has not logged in yet. So can someone help me how do I fix this ?  Also suppose I add a telegram login button in the website. What if I want that when anyone opens this webapp in his telegram, he is automatically logged in with his telegram account. Is this possible? If yes , how do I do it? Can someone help me out here please.  Is there any redirect uri I have to configure here or anything like that ?

Орельан [NEVER DM FIRST]: Hey there guys, is there a way to change the FunC compiler in ton blueprint? I'm trying to manually deploy the walletv4 contract but it is on pragma 0.2.2 while blueprints tries to compile it on a higher version. Thanks 🙏

rwxrxrx: how to get all jetton holders? i.e. all not empty jetton_wallets of a specific jetton_master contract?

charlie: Hi all. if one part of transaction tree is failed and the status of transaction is true, did the transaction be rolled back?

Vladimir: Good day.  I have erc20 token with 5% buy/sell fees for uniswap v2 pool  I would like to get it bridged to TON and have same fees on TON DEX  I tried to use bridge.ton.org it created a new jetton then I created a Stone DEX pool  But it - takes only 0.2% fee to LP provider - takes 0.1% to Stone protocol  I see 2 ways 1) find a ton dex with custom fees 2) develop my own jetton with embedded fees on transfers to dex pool and use this customized jetton in bridge   Is there any default solution for fee-on-swap erc20 bridge for TON?  Thank you

charlie: in addition, if the status of one transaction is success, but the event is false. what's the relation between them?

mohsen: How are TON addresses activated?

Enzo: 0.1 ton deposit to that ton address (reply to 78671)

mohsen: How long does it take to activate? (reply to 78672)

User<7376766125>: Immediately (reply to 78673)

mohsen: Is there any documentation on this?  I want to read it (reply to 78675)

User<7376766125>: No you can't bridge the contract but you can write a new contract that has fee   I have one if you need it (reply to 78661)

User<7376766125>: Check ton documentation (reply to 78676)

mohsen: You helped me a lot, I didn't know that. :\ (reply to 78678)

User<7376766125>: https://docs.ton.org/develop/data-formats/tl-b-types#addresses (reply to 78680)

lvann: Does anyone know about this issue?

User<6847374185>: openmask owner just disappeared, its starting to seems like a exit scam

&rey: Something is wrong with network on your machine. (reply to 78686)

&rey: By having message with StateInit. For wallets, this is done automatically on first outgoing transfer (that is, they receive external message with StateInit). Though, any contract can be deployed along with incoming TON transfer. (reply to 78671)

AleXツ: Hi, i read the new ton storage, can i partecipate with a core 2 duo and ddr2 RAM with SSD sata?

mohsen: I transferred 0.2 TON to my new address but after 15 minutes it still Inactive (reply to 78693)

&rey: This isn't question to me but to the first speaker who misled you. You already can use wallet normally, it will be autodeployed on outgoing transfer. (reply to 78695)

lvann: Yes, I switched networks (reply to 78692)

&rey: It is hard. In particular because this causes high load on explorer APIs. (reply to 78655)

mohsen: Is there any detailed documentation on this? (reply to 78697)

&rey: Yes, whitepapers. Consider that wallet contract is first and foremost a smart contract, just with some handy functionality that allows users to command it a bit more than common contracts. (reply to 78700)

&rey: All transactions unrelated to failure will be complete, they won't rollback. (In particular, it's a reason why tree isn't called a single transaction; it is not.) (reply to 78659)

&rey: It is quite the point of TON, by the way. If change is done, something remote (that is, happening on another contract, or in another shard, or in another workchain) cannot affect it. (reply to 78702)

L (😇,🪽): why is that? (reply to 78027)

mohsen: The cosmpy library has been returning this error for some time: pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 651 code. Message: too big masterchain block seqno (reply to 78701)

trungnotchung: i think this code is cell hash not slice hash, do you have any other way ? (reply to 76397)

Buggy: Is the ton network working properly right now? I can't see my Jetton info in any scanner but can do via ts script

PoW: Hi Devs, I have message hash and ecdsa signature, how can I check signature in contract, I only see stdlib have this functionality for Ed25519, is there any way possible?

0x0liver: i am using         "@ton/sandbox": "0.16.0-tvmbeta.3"  and int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";     but it shows error exit code 6

&rey: You'll have to implement check yourself, TVM offers wide range of arithmetic primitives which can help you. Please note that since it is a security-sensitive part, you need to consult existing implementations, pitfalls and write tests (including for edgecases). (reply to 78716)

User<5648379066>: Hello everybody

PoW: Can you pls refer any docs here or impls, do I have to use these opcodes https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07 (reply to 78720)

&rey: Hello. Please don't use AI in the chat, as AI-generated + wrong responses may see you banned. In my experience, https://t.me/tonsupport_aibot provided more precise responses than ChatGPT. (reply to 78722)

User<5648379066>: Ok (reply to 78725)

PoW: @pcrafter pls (reply to 78724)

&rey: Those may be useful depending on which elliptic curve you want to be available. Otherwise, you'll have to reimplement point addition/multiplication with common ADD, MULMOD, etc. (reply to 78724)

PoW: Okay, means I have to implement from zero, thanks, will try to implement it (reply to 78730)

User<5648379066>: I want to show what can be improved in tone! Afternoon. Blockchain has great potential and many areas for improvement. A few suggestions that can make it more advanced and beneficial for developers, users and businesses. Sharding and multithreading improvements to improve performance and scalability. Optimization of existing consensus algorithms to improve throughput and reduce latency. Security and smart contract validation tools to mitigate risks associated with vulnerabilities. Implementing anomaly detection systems to detect network anomalies and prevent and respond to potential attacks. Three. Increasing development efficiency and improving tools. 4. Improving user experience by developing and improving intuitive wallets that are user-friendly across geographies. Five. New integration features with decentralized storage systems such as ipfs, private transactions, decentralized management. These areas can help the ton ecosystem and make it more attractive to developers, users, and businesses.

Cube: Is testnet working fine?

User<5648379066>: Yes (reply to 78737)

Cube: (( (reply to 78738)

Cube: Not for me

User<5648379066>: It's very sad (reply to 78739)

Gyorgy: The testnet is working fine, as is the network.   However, the explorers are out of sync (Tonviewer, Tonscan partially works), and most of the Apps/APIs are not working for sending transactions. We have to wait. I’m sure they are aware of the problem. It has happened a few times before. It will be fine. (reply to 78737)

Paul: Rpc still working, but api is stuck 😩 (reply to 78737)

User<5648379066>: What about my idea for TON ?

Illia: Mate read TON white papers first (reply to 78747)

User<5648379066>: Ok (reply to 78750)

Stephan: hi guys, please help me, how can I create Jeton for free for development? Is it also possible to get it for free as well as TON on testnet?

musashi: https://minter.ton.org/?testnet (reply to 78753)

Stephan: thank you! (reply to 78755)

musashi: hey guys, I got a weird issue in my sandbox testcase, when I print the transaction fees to console, I got the value out ~ 0.12 TON while I only deposited 0.08 TON to the transaction and the contract balance is ~0.01 TON

Marco: Which language is more popular among developers, FunC or Tact?

Paul: what contract do  you send to? seem is bug. (reply to 78761)

musashi: my customized contract mate (reply to 78764)

musashi: here is the flow: my wallet contract -> send 0.08 TON -> customized contract with 0.01 TON balance -> send a message with 0.12 TON attached to another contract

musashi: how could it possible? 0.12 > 0.08 + 0.01 =)

mohsen: The cosmpy library has been returning this error for some time: pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 651 code. Message: too big masterchain block seqno

User<6839885291>: {  "UQ...":{"value":"1","comment":"Hello world!"},  "UQ...":{"value":"2","comment":""},  "UQ...":{"value":"1.3","comment":"no comments :)"}, }  how do i run this ? new to dev stuff

Орельан [NEVER DM FIRST]: Can someone please tell me how to change the FunC compiler version in blueprint so that i can compile contracts which have a pragma version older than the current compiler's?

Vadzim Suhak: May I do something to open miniapp using the menu button as if via using a direct link, i.e. expanded without the input field ? https://docs.telegram-mini-apps.com/components/viewport/views.png

&rey: @devs is the chat for Telegram Mini Apps development. (reply to 78778)

musashi: what should I do mate @pcrafter (reply to 78761)

Paul: posible if your contract have ton balance. seem your deploy contract transacton send 0.05 ton (reply to 78768)

musashi: no it's just 0.01 TON mate (reply to 78784)

Paul: could you share your address contract

musashi: and one more thing, I do the same transaction again after this transaction, it failed because of action code 37

musashi: i'm doing unit test using sandbox, not deployed yet (reply to 78786)

&rey: Maybe that's balance after the transactions? (reply to 78785)

musashi: no, I'm pretty sure that I deployed the contract with just 0.01 TON in value

Paul: or sandbox can send unlimit, do not validate the balance :(

musashi: one more thing is that before I make the second transaction (which is failed with 37 action code), I config the sandbox blockchain timestamp to 10 mins forward (reply to 78787)

Wira Pratama: I'm trying to add haptic feedback into my app when users click on tabs in a tab bar. My tech stack includes Next.js and Tailwind CSS for styling. I've been going through the Documentation on Haptic Feedback and the methods, but I'm still a bit confused on how to integrate this with Next.js and Tailwind. Any example or reference projects would be greatly appreciated

musashi: btw, how can I get balance of contract in sandbox test sir? I just know the way to get balance of treasury contract (reply to 78789)

Paul: The key difference of this package from ton-contract-executor is the fact that the latter only emulates the compute phase of the contract - it does not know about any other phases and thus does not know anything about fees and balances (in a sense that it does not know whether a contract's balance will be enough to process all the out messages that it produces). On the other hand, this package emulates all the phases of a contract, and as a result, the emulation is much closer to what would happen in a real network.

&rey: NetworkProvider should do this. (reply to 78797)

Stephan: hello, who knows if there are any technical channels or groups about testnet in TON?

jaq₿ek.eth: If got questions try @tonsupport_aibot (reply to 78807)

ZQ: Hi, anyone can help me? I am using ton-connect-bot as example to transfer jUSDT to other TON Space address, but it can't be verified? anyting am I missing?

Illia: can you send the logs?   as far as I remember, printTransactionFees prints combined values which is kind of weird and confusing (i.e., all values added up together)  btw you can use this logger github.com/henchtab/shrek 'cause it shows out values separately + shows labeled contract names, sources/destinations (reply to 78761)

musashi: thanks mate (reply to 78813)

Cube: Still this issue.. (reply to 78743)

Gyorgy: Still ongoing, seems yes. (reply to 78815)

Illia: Reload Tonkeeper. Tonkeeper uses tonapi.io and it was out of sync for a while (that's why tonviewer didn't work as well cause it depends on tonapi.io as well) (reply to 78815)

Nerses: can foreach be used for state variables (map)  in TACT ?

Cube: Who knows how to form transactions with Events as described in tonapi (i.e jetton transfer)?

User<5648379066>: Hi everyone how can I create a flashloan arbitrage trading bot on TON blockchain using TON smart contract ?

&rey: You can't. In particular, there is the fact that transaction on loan issuer contract ends before the money is used, so there is no option to reclaim it. (reply to 78840)

&rey: At this point, I believe it is better to switch to FunC. At least, iterating maps needs care and small gas usage, something that Tact does not offer. (reply to 78829)

avantor: I can build it (reply to 78840)

a14: Hello, i deployed a jetton via this repo: https:// github. com/ton-blockchain/minter-contract  How to mint the token to the owner contract? Its not in the deploy script.

Mehran: Hi everyone, looking for a senior smart contract freelance developer for a Ton smart contract project.  If you are a senior FunC developer and ready to work remotely please pm me.  English, Russian & Persian Lang is okay :)

Paul: Start with tact first and current using func 😋 (reply to 78842)

ajtech.: Please I need materials to start building on TON network

Kevin: Hi, hoping someone can help me/point me in the right direction. I'm looking to get some info on overall usage of USDT on TON. In the docs I found ways to query the node for individual addresses but looking to get a holistic overview across all addresses/transactions/blocks? Is there a way to do that?

&rey: https://docs.ton.org or other things named in the pinned message. (reply to 78874)

Cube: To my surprise, a manually generated jetton transfer transaction is determined by TonKeeper correctly, and not as a jetton wallet contract call )) (reply to 78833)

Cube: But such thing does not work with Non fungible tokens as I know (

&rey: It should work fine as well. (reply to 78901)

jaq₿ek.eth: dou you guys here consider building bot that listens blokchain for newly deployed contracts (nothin new) as moraly fine? eticaly ok? i was asking about that on grammY and got answer they dont support scammers

Zumi: Greetings  My staked coin is not showing before the 7th day of withdrawal

Sumit: i am trying to run a lite node for testnet

Sumit: how can i configure it?

zeligmann: How i can sign a transaction with private key via ton/blueprint without generation new mnemonic and etc? I already have a wallet.

JackryptDev: Hi, i am retrieving a list of transaction included in a block, and would like to filter only new jetton deployments. What fields and values should I look for?

Sumit: after this? which port is the HTTP server runnin on? (reply to 41975)

Ronaldo: is not coin app strill running? i tested i do not show nothing (reply to 78911)

&rey: Notcoin (and internal workings of any service except TON Blockchain itself, actually) is offtop for this chat. (reply to 78911)

jaq₿ek.eth: can you give me a hint on how you made that? (reply to 78916)

JackryptDev: i am getting list of tx via ton center  e.g. https://tonapi.io/v2/blockchain/masterchain/38774181/transactions  so how could I find deployment transaction on the list? (reply to 78924)

jaq₿ek.eth: maybe jetton master or jetton wallet would help rather than transactions. (reply to 78928)

jaq₿ek.eth: https://toncenter.com/api/v3/jetton/wallets?limit=128&offset=0

&rey: You can use another API like dton.io/graphql. Filter for contract deployments. Filter for "parsed jetton admin". Read source address (deployer) and destination (jetton). (reply to 78916)

джнея: Hi maybe someone knows I provide liquidity on ston fi, get lp tokens for that. I see them on balance but no info in the history, I don’t understand which transaction and how gives me those jettons

jaq₿ek.eth: // NFT transfer op code 0x5fcc3d14 what op code if for contract deployment?

&rey: NFT deployment is not standardized. (reply to 78938)

jaq₿ek.eth: how about jetton contract deployment? (reply to 78939)

&rey: It is not standardized but it is most commonly done along with "internal transfer" — message depositing jettons to a jetton wallet from other wallet/minter. (reply to 78940)

jaq₿ek.eth: ok so if we want to find newly deployed we should look for internal transfer tx's?

jaq₿ek.eth: im sorry sir im comming from evm and tryin to get familiar with blockchain of blochains ^^

&rey: Oh. I answered about newly deployed jetton wallets. Jetton masters are normally deployed without opcode at all. For those, my solution above (https://t.me/tondev_eng/78932) stands. (reply to 78942)

Morphius: I have 8 smart contract build and working on solana and evm. Looking to port them to TON!  Dev with experience in ton smart contracts dm me.  ESCROW ONLY, SEND GITHUB AND REFERENCE OF PAST WORK.

User<7376766125>: Most function on Solana won't work on ton (reply to 78949)

User<7376766125>: But I can help you with what you want if the functions are on ton then payment after the job or escrow

Morphius: Bro read... I’ve said evm and solana (reply to 78951)

User<7376766125>: Oh shit sorry am retarded let me take my pills (reply to 78956)

User<7192644220>: hi can you DM me? (reply to 78949)

Raf: Hey guys, I'm developing in funC, not a pro yet, does someone know ho opcodes are known (hexadecimal format) ?? I have added a op::decrease opcode from the example, but I need to know its hexadecimal value

Raf: const op::increase = "op::increase"c; ;;0x7e8764ef const op::decrease = "op::decrease"c;

Doug: Hey guys, I'm a beginner developer in the issue of Blockchain, could anyone help me make a back end for an airdrop app, I accept documentation and repository recommendations, if anyone can help me, send me a DM

Angel: I sent  0.1 Ton from one wallet to another. This is a destination address. As you can see, I sent 0.1 Ton but it returned again.  why this happened?

Illia: can u  send link to the tonviewer? (reply to 78972)

Angel: https://testnet.tonviewer.com/0QCtFsOuvZybtO2Y_WX-W8Xb0yzfAulFnuWaKFCzTv3aoR_V

Illia: that's might be cause u send for bouncing address and your wallet doesn't exist (cause you can see that it's nonexist) (reply to 78978)

Raf: spam, please remove

jaq₿ek.eth: is it safe to share my bot here and ask about it?

Ryan: Hey guys, I'm just learning about that rent stuff. If my contract has user's funds in it, but it doesn't have enough TON to pay the rent, it will get frozen.   So it means that the user's funds are now locked and they cannot withdraw it??

Illia: if your user funds are toncoins, then these toncoins will be used up to pay for storage fee  if your user funds are custom tokens (nfts or jettons), then yes, you risk loosing them (reply to 78988)

Raf: hi, did you see my question about opcodes ? thx (reply to 78992)

Ryan: Hm... Ok. Thank you (reply to 78992)

Illia: can u send the link to the example?   cause usually it's derived from the TL-B schema (reply to 78964)

Subdog 🐈‍⬛️: Is it possible to get the token code from the byte data?

Illia: you can load the code as a cell from base64  like Cell.fromBase64("some base64 code")  if u're using ton-core/ton (reply to 78999)

— 2024-07-04 —

Long: Hi everyone, how can I get the transaction hash after sent a tx. I got this answer but it not correct https://answers.ton.org/question/1610092534699134976/how-we-generate-a-transaction-hash-in-the-ton-blockchain

Barbell: Hi I am having an issue when I store Dictionary <number, Address> in InitState. I am getting error on query of the smart contract. Anyone has any example how to init Dictionary in InitState with same value?

Barbell: you need to query your transaction with seq number. I suggest to add message to transaction so you can easilly fetch and filter the tx which one yoyu looking for (reply to 79027)

Long: Thanks, so I have to get a list of my history tx and filter to get the one I just sent? (reply to 79029)

Illia: the answer very much depends on what client you're using; for example, if you're sending transactions with TON Connect UI, then it will return you the hash of your transaction;  what are you trying to do? you can, for example, deploy NFTs by just checking the next collection ID or your wallet's sequence number (reply to 79030)

Long: I am trying to get the tx hash of the transaction I just sent. So the return of the api call is not the tx then. This is weird. In other blockchain it must return the ts receipt that contains tx hash (reply to 79062)

Kat: hey, anyone know how to connect with Ton foundation?

uz: Hello, anyone knows if it is possible that I write a contract in TON and have the user pay the gas to claim anything from my contract, and all I have to do is just to generate a signature similar to the concepts of writing a cheque ?

musashi: merkle airdrop (reply to 79077)

musashi: https://github.com/Gusarich/airdrop

uz: thanks a lot ! you've been a great help (reply to 79078)

uz: oh, I just check it out and it seems I will have to know the list of the claimers in advance, and this isn't exactly the same case as in my scenario (reply to 79079)

musashi: so what's the signature you talking about? (reply to 79077)

uz: I want to implement this as with solidity

uz: I know there is a ecrecover operation code in TON, but I couldn't find examples of its usage🤣

Daniil: take a look at this: https://github.com/ton-blockchain/payment-channels (reply to 79088)

uz: thanks a lot! I think this will help🫡 (reply to 79091)

ztwq: Dear Devs, the error happens when i use the "foreach" : swap_wallet.tact:100:28: Syntax error: expected ")", ",", "{", "(", "!!", ".", "%", "/", "*", "|", "&", "<<", ">>", "-", "+", "&&", "<=", "<", ">=", ">", "==", "!=", "?", or "||"  Line 100, col 28:    99 |  > 100 |         foreach(key, value in orders)                                    ^   101 |         {

ztwq: I have read the examples in the docs,however,there are no differences:  // Iterating over map in contract storage         foreach (key, value in self.oh_my) {             // ...         }

ABRAHAM: Hi everyone, from the example code of ton docs, do I need attach ton amount when send jetton? What happen if sender does not attach ton amount when sending jetton?

ztwq: My codes are here: message PlaceOrders {     orders: map<Int, PlaceOrderParam>; } let orders: map<Int, PlaceOrderParam> = msg.orders;           foreach(key, value in orders)         {              // orderLength += 1;         } (reply to 79095)

Tr: when i ran the install.sh to install mytonctl, the error above occurs. Could anybody help? Very appreciate...

Tr: when i try to run mytonctrl, the cli remind me that the config file is broken.

uz: Yes, you have to send some ton along with the jettons. But you don't need to worry, once the transaction is done, the remaining ton will come back to you after subtracting the gas fee (reply to 79097)

ztwq: why do you believe it's better to switch to FunC? (reply to 78842)

User<5648379066>: Okey thanks (reply to 78841)

vivi: DM if you still need one I can send you my resume (reply to 53162)

Daniil: What version of Tact do you have installed? (reply to 79095)

ztwq: Hi, The version of Tact is 1.2.0 (reply to 79121)

Daniil: foreach loop was introduced in 1.3.0 (reply to 79127)

Daniil: And the latest version is 1.4.0, so you should consider updating your compiler version in the project. There have been many important changes and bugfixes since then.

ztwq: thanks. I will upgrade the verison of TACT to 1.4.0. (reply to 79129)

Pegu: Whats the main reason wallets for TON always refer to the non bouncable address type?

芭比Q: Is there a concept similar to root hash that can directly find the transactions of a complete transaction process?

芭比Q: how to use code to verify jetton token transfer success

Sumit: https://katb.in/tijovawemir I am running a node. and my logs look like this. when i try to query this node using http api i get this error Request failed with status code 503 {   ok: false,   error: 'No working liteservers with ls_index=None, archival=None',   code: 503 }

Sumit: I used this docker https://github.com/fmira21/ton-node-docker to start up the node

Tr: I met an error while trying to install mytonctrl: https://github.com/ton-blockchain/ton/issues/1047. Cloud anybody help? Very appreciate for any guidance...

Daniel: If you are talking about smart contract’s code, you can verify it by handeling receiving messages in your smart contract with opcode 0x7362d09c (Jetton transfer notification)  https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer (reply to 79162)

mohsen: The pytoniq library has been returning this error for some time: pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 651 code. Message: too big masterchain block seqno

Mithra: @tsivarev @AntonTrunov @alefman, guys can you help us launch a TON testnet light node, please? All the existing public solutions fail in the long run. (reply to 79171)

Illia: I believe more libraries will do that in the future.  https://github.com/VanishMax/foton  Have a look at this one if you're building a frontend with React. If not react, then it's a good reference to how gracefully handle transactions (reply to 79064)

Illia: I will add my two cents. If you want to build extremely optimized smart contracts and understand everything that's happening under the hood, then do FunC. If you want to learn or hack quick 0 to 1 MVPs (what's acceptable in lots of cases), then do Tact. FunC requires lots of technical knowledge that Tact hides by default, making it easier to start building (reply to 79105)

charlie: thanks (reply to 78702)

Орельан [NEVER DM FIRST]: Good morning everyone, do you know if there is a way to change the FunC compiler version used in Blueprint? I can't compile the walet v4 contract as it is on pragma 0.2.2 and the blueprint compiler on 0.4.x

ztwq: In a word, TACT: quick0-1. FUNC:extremly optimized smart contract. Thanks. (reply to 79247)

Illia: That's strange that you can't compile wallet V4. I would double-check on that. What's the source code you're compiling?  There's no simple answer on changing FunC versions in blueprint. If you very very need (but I don't think you need in your case) you can try chancing the version of func-js-bin  https://www.npmjs.com/package/@ton-community/func-js-bin?activeTab=versions  But there's no guarantee it will work ok with blueprint so I better not do that (reply to 79264)

Орельан [NEVER DM FIRST]: Hey thanks for the answer, i'm trying to compile this code: https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc which is i believe the version that is deployed automatically by most of wallets currently working on Ton. I think i will just change the pragma version for now in the wallet's V4 code even though i would have preferred not to as it is more a workaround that a real fix (reply to 79275)

Denis: Hi, How to download transaction history of wallet in csv file? Help me please 🙏

芭比Q: This does not guarantee that the verification result is correct, right? It is possible that the transfer was successful but the notification failed. (reply to 79205)

Illia: https://toncenter.com/api/v3/#/default/get_transactions_api_v3_transactions_get  u can use toncenter api v3  just add account field into your request   then just dump it into a csv file (reply to 79281)

Daniel: TVM is deterministic, so if input parameters are correct, the output has to be correct too. It’s all about forward amount and notification will be delivered (reply to 79286)

Denis: Illia, thank you a lot 😇 But I'm not developer, so i will try to understand it with chat gpt 🥲 (reply to 79289)

Illia: you can change the pragma version; it should not fail  i've seen the code of wallet v4 in the repo of tonkeeper v5 yesterday, but now it have disappeared  https://github.com/tonkeeper/w5/commit/c5465be2312b4fd83cb429904828c771db6f7721#diff-5926290f7be6d52ac79cf8a64152be2a06e4cc831b97d777e3bf6bb72896f448  take a look at the deleted file contracts/wallet_v4.fc (reply to 79280)

Ilia S.: Dear community, where do I find a documentation for constructing a proper deeplink for opening TG Wallet: a) wallet should be on "send ton to another wallet" screen b) amount, address and description is inserted  I found only this somewhere on repositories: t{dot}me/wallet?&startattach=send-assetCurrency__100 but that opens the "send to user" window, and nothing is inserted / no documentation on what params to add to make this happen.

Орельан [NEVER DM FIRST]: It was actually failing with changing the pragma verison, because of some types issue, i guess some stuffs were not required in 0.2.0 that are now required in 0.4.4. I've copied the code from the deleted walletV4 0.4.4 implementation, and it compiled great. I just hope they did not delete it because of some vulnerabilities 😁. Thanks a lot 🙏 (reply to 79294)

Illia: based on the source code when it was, it was just used in the tests to compare the performance of wallet v4 to wallet v5 and show that wallet v5 is more efficient (reply to 79299)

Illia: btw you can use wallet v5 in your project; that's absolutely great, has good wrappers (if v4 is not requirement for your project) (reply to 79299)

Anh Dung: Hi, I am just going through the tutorial and currently I am at section 7. In file jetton-minter.fc function mint_token I don't see any import decleartion for  function calculate_jetton_wallet_state_init, which is in jetton-utils.fc. How does it work here?

Illia: when you compile FunC you can choose the order for compiling the source code  the first file you compile will be available in all the files compiled afterwards  e.g. func file1.fc file2.fc file3.fc means that file2 and file3 import file1 and file 3 also imports file 2 (reply to 79308)

Anh Dung: thanks, I suppose that this order is written in compile.sh (reply to 79316)

Illia: Exactly mate (reply to 79324)

Anh Dung: Also why do we store jetton_wallet_code twice here? Once in pack_jettton_wallet_data() with store_ref and the second time in calculate_jetton_wallet_state_init() with store_dict?  cell pack_jetton_wallet_data(int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {    return  begin_cell()             .store_coins(balance)             .store_slice(owner_address)             .store_slice(jetton_master_address)             .store_ref(jetton_wallet_code)            .end_cell(); }  cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {   return begin_cell()           .store_uint(0, 2)           .store_dict(jetton_wallet_code)           .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))           .store_uint(0, 1)          .end_cell(); }

&rey: Because wallets are uninitialized a large chunk of the time. (It is cheaper to have uninit wallet than initialized one.) The funds don't need special processing and shouldn't bounce of such a wallet. (reply to 79155)

&rey: Old kind of jettons (until MYCODE opcode was introduced) stored jetton wallet code in their own data as well. (reply to 79328)

Mithra: Guys, we need help setting a testnet lightnode, we already launched it on Hetzner, but it does not sync. Where can we get help?

Anh Dung: I notice that in all the examples that I have seen that the load_data function always retrieves the whole storage even when only part of it is needed. Isn't it quite inefficient?

&rey: It is. Though, it is rarely noticed. I also do so when starting to write a contract, and only apply optimizations later. (reply to 79347)

User<6943543282>: who can contact for token tonkeeper verification

Tiep: Hello,  how can I send a specific amount of ton to multi wallet with a single transaction using tact lang! I tried to user SendParameters, but it can send only to the first recipient ?

Veaceslav Kunitki: @dev  How on earth can I send coins/jettons (for example, Notcoin) from one wallet to another in Python? No one has a working example. 😞

Illia: You need just to call SendParameters multiple times (reply to 79357)

Illia: I don't have an example, but the main idea is that you need to send an external transaction to your wallet that will contain a valid transfer message. Then, your wallet will accept it (if your signature matches) and forward to your jetton wallet.  Take a look at the standard  https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer (reply to 79363)

Tiep: I did it, but only the firstone execute. Is there any special configuration needed? (reply to 79365)

Tiep: Can you plz give me an example !

Illia: What are you sending parameters?  For example, If you have mode SendRemainingValue, then you will have no toncoins to pay for the consequent calls of the send message.  Have a look at this code:  https://github.com/henchtab/nenuma/blob/main/packages/contracts/contracts/data_stream.tact#L276 (reply to 79370)

Tiep: Appreciate your help. Let me try it out. (reply to 79373)

Veaceslav Kunitki: "your wallet send", "your wallet accept" ? what it need to accept and where to send? (reply to 79366)

Illia: Let's define some actors to simplify the explanation.  Script — it's your Python script that sends the transfer request)  Wallet A — is a wallet that owns jettons and you have its private key, e.g., V4 or V5 beta (btw I tried V5 yesterday, very nice)  Jetton Wallet A — described in the TEP-74; belongs to Wallet A  Jetton Wallet B — described in the TEP-74; belongs to Wallet B  Wallet B — it's the wallet you're sending your transaction to, i.e., it's the destination address.  Script generates an external message, compatible with Wallet A; it should be the Transfer message compatible with the TEP-74 standard which provides a valid signature to authenticate your external message by the wallet.   Once it's authenticated, i.e., the signature matches the public key stored in the wallet, it will send an internal message to Jetton Wallet A on behalf of Wallet A.   Jetton Wallet A transfers jettons to Jetton Wallet B and now Wallet B has new jettons. Job done!  If you're using pytoniq, you can use this wrapper.  https://github.com/yungwine/pytoniq/blob/master/pytoniq/contract/wallets/wallet.py#L339  Before you send the transaction, make sure to get wallet's seqno and then simply do short pooling until the seqno increments to await the transaction (but don't forget to wait, for example, for 2 seconds before running the seqno getter as you can exceeded timeout based on your API provider) (reply to 79389)

Veaceslav Kunitki: I am trying to use this https://github.com/tonfactory/tonsdk/blob/master/examples/tokens/jetton/transfer.py (reply to 79394)

Illia: i've never worked with this lib (reply to 79398)

Veaceslav Kunitki: ok. No problem. I will be happy with any python code what helps me to make jetton transfer (reply to 79400)

Tiep: Your source code is really helpful ! Thank you again ! (reply to 79373)

Illia: pleasure mate (reply to 79438)

Tiep: One more question plz ! How can we control JettonNotify when someone deposit a certain JettonToken into contract? (reply to 79373)

Jenya: "error": "external message is not a tlb.Message"  I try to send a transaction, an error appears. What do I do?

yolo: Guys How to create cheks in TONapi? I want to create bot like a CryptoBot

Jenya: it's off chain function you don't need to use TONapi (reply to 79453)

yolo: And how to do it? (reply to 79454)

Nerses: Who can guide to solve this problem ? Why I cant create another contractin already existing project

Grigoriy: With a capital letter you need

Nerses: thanks a lot.it solved (reply to 79463)

User<6669453785>: I am proficient in building dApps, telegram mini apps & bots on EVM, Solana, TON, Bitcoin etc. Does anyone need?

Jenya: pls help ☺️ (reply to 79451)

&rey: Is there a reason you don't use sendTransfer? (reply to 79451)

Mikael: https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js  Hello everyone, please tell me, I found such a guide from the tone dock. If here  ton web.wallet.all['v3R2'];   - how can this affect the transfer of jetton to users (whose addresses we find out through ton connect)? It's just that as far as I know, now the 4th version of wallets is used by users

Jenya: I don't want to use 2 clients - tonapi and toncenter (reply to 79483)

Illia: That's a good question. Many people asking about that. I'm preparing a tutorial for that right now. The main idea is that you need to create a receiver with transfer_notification opcode. See TEP-74 for mode details (reply to 79444)

Jenya: is it hard to transfer by tonapi? (reply to 79486)

&rey: You need to wrap transfer body in external message, it seems.

Jenya: const internalMessageCell = beginCell()         .store(storeMessageRelaxed(internalMessage))         .endCell();  something like this? (reply to 79490)

Jenya: oh no its internal...

&rey: Like store(external({to: ..., body: raw_transfer})). (reply to 79492)

Jenya: I'il try

Nerses: is there Jetton implementation in TACT ? couldnt find appropriate one for understanding Jetton architecture

Jenya: thank you very much (reply to 79494)

Jenya: it works  const externalMessage = beginCell()         .store(storeMessage(external({to: ownerAddress, body: raw_transfer})))         .endCell().toBoc().toString('base64')

Sagara: Hi @pcrafter  Does the "toncenter/ton-http-api" support web socket request via liteserver?

&rey: I don't think so. (reply to 79519)

Mark: Is there a way to change maximum nominators count in nominator pool contract?

максим: I try to send Ton via transaction to another wallet, but for some reason these Tons just go back, what could be the problem? I will be grateful for the answer.

Stephan: Hi guys, please help me, how can I send my jetton in a contract?

Aibar: are there any faster private ton rpcs?

Mithra: Are you familiar with a node error: error: 'LITE_SERVER_UNKNOWN: cannot compute block with specified transaction: cannot find block (0,392123e321f7cd0d) lt=23071408000001: lt not in db' How can it be fixed?

Aibar: How much are private nodes faster compared to the public ones?

Usman ghani 🌊: Telegram Bot can be hacked guys??

Mithra: I already got DMs from someone who said they were Customer Support and wanted to access my Metamask via a QR code

Aibar: is orbs api  fast?

SrDorki: Hi fam! Im getting TonWeb undefinded when i try to send a transaction. Im using java on html. Imported scripts tonconnec-sdk.min.js and tonweb.min.js from unpkg.... i can connect tonkeeper wallet but when I const httpprovider, endpoint and tonweb I get tonweb undefined:  Const { HttpProvider, utils } = window.TonWeb Const endpoint = 'https://toncenter .com/api/v2/jsonRPC' Const tonweb = new TonWeb(new HttpProvider(endpoint))

M: Good day,  Could you please help me? I need to use TonAPI to subscribe to an NFT collection and track when a transfer transaction occurs within that collection. I would like this transaction to be received as an event in a stream. Does TonAPI have something for this? I looked through the documentation on Tonconsole, but the message doesn't contain information about who sent it, where it was sent, or the name of the transaction. Could you please assist me with this issue?

Rozhen: Me and my friends just launched a coin on TON

Stephan: Hi guys, please help me, how can I send my jetton in a contract?

&rey: Send jetton transfer request to jetton wallet of the contract. (reply to 79583)

Stephan: I don't really understand how to do this. Maybe there are some articles on how to do this? (reply to 79600)

&rey: No, Tonapi doesn't have this functionality. Actually I believe it could be a profitable thing to build such API. (reply to 79574)

Stephan: This is the first time I've come across working with jetton (reply to 79600)

&rey: Just same as when you send jetton on frontend. TON Cookbook can help you. (reply to 79602)

M: yes, sure, I'll build for myself, thanks (reply to 79603)

Stephan: Ok   ‘’’   cell msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(addr)     .store_coins(amount)     .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)     .store_slice(message_body)   .end_cell(); ‘’’  This is the ton sending code, what will the jetton sending code look like? (reply to 79605)

&rey: Please don't try to send message again, I've seen the first... Something like that:   cell msg = begin_cell()     .store_uint(0x18, 6)     .store_slice(jetton_wallet)     .store_coins(30000000)     .store_uint(0x0f8a7ea5, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 32)     .store_uint(0, 64)     .store_coins(amount)     .store_slice(addr)     .store_slice(my_address())     .store_uint(0, 6)   .end_cell(); (reply to 79611)

Stephan: So ok, thank you, i will try it (reply to 79612)

TON Bounty Bridge: ​Bounty  🏷 Developer Tool  Summary:Participation reward  Created by yetneberk

Cube: How can I form dict cell in TypeScript?

SrDorki: Dealling to get estimateFee

Prince: Hi, I wanna deploy contract via blueprint so I use mnemonic. so env I use wallet version as v4 but I get different wallet address. anyone knows that reason?

Gyorgy: for v4 not much difference can be, probably different subwallet id (reply to 79641)

Prince: I see

Gyorgy: wallets typically using this DefaultSubwallet = 698983191 (reply to 79643)

Gyorgy: for v4, for v5 the standard will be 0

Prince: so my test wallet address is 0QDB3TBXG1zJaKP6R8o0gnNZi6WVwSJBkJjc6GZPoNSnynTK but when using blueprint I get EQBgJyFj_w1gsAnF-UqAVeSbpD7AgCU6Dgp3_RxHPkBHwhVC... so diffierent

Gyorgy: wallet standard changed, EQ/UQ depends if wallet or smart contract to control bounce

Prince: so what is the solution? the reason Why I choose using mnemonic is just when I deploy contract on testnet, I don't want to use mobile wallet.

Gyorgy: @pcrafter https://github.com/tonkeeper/tonkeeper-ton/commit/c4ca40117450baaa0b013ec5a3b64f6dea2a67d1#diff-825db445dbe74c1f49c05e985c1607c8c43d60e0161f5ad0ac8b6ddbb419b6c2R91  info from today commit. beta used 0 subwallet id as well. v5r1 (seems official name) aiming for that too

Gyorgy: thats up to your code 🙂 without sharing anything, hard to give any help. “its not the same”. Its not the same as not the same instructions. (reply to 79649)

Gyorgy: If parameters the same, will be the same wallet. Update your code to use different subwallet to match them.

Prince: Thanks, I will try

Prince: so another question, now what is the best choice, most popular deploy the contract on the testnet?

Cryptskii: gm gm! nice to be hear!

Cryptskii: 1st i want to say TON is great and imo which is very hard to please, TON at its core is the only BC that checks all my boxes with only a couple being halfs checks because they are sufficient design choices that are bad just not quite good enough for mass adoption or to be considered as the recommend and choice for replacing banks. SOSO close. This IS the strongest BC and is miles ahead of any other network for being ready for this inevetable need. it would be nice to be fully ready ahead oh the complete banking colapse though no?

Cryptskii: im here with intent to help achieve the levels of privacy and securtiy needed to make TON look at the changes that would be required, for these along wiith higher on-chain scalabiliy

Prince: then can you describe what ton is different from other chain, ton's attractive characters?

Cryptskii: if you are open to my suggestions one big one would be migration from hypercubes to adopting my sharded recusive ZKPs found on eth.research

Cryptskii: are we aloud to share links?

daniel: yes, ton dosnt support ledger , this is a distinct feature, allow scammer, hackers to easily to low cost ton, (reply to 79662)

daniel: share is ok i think, but not publicly loud (reply to 79664)

Prince: let me know more detail... (reply to 79665)

Cryptskii: core sharded architecture you can clearly see the TEAM took things seriously and never had any intentions of riding with vapour on the sucess of TG itself (reply to 79662)

Cryptskii: all choices in TONs desing are well thought out as well as implemtation. TON brings value to telegram not just TG to TON

daniel: yes, they are working hard to make a non wokring ledger apps, and abandon it , leaving ledger users locked the asstes without ability to moving it (reply to 79668)

belac: hey

Prince: then is there any kind of bundle on solana?

daniel: ton is the only chain i know did this

belac: yea (reply to 79673)

Prince: really?

belac: yep

Cryptskii: it would be ideal to remove the need for the payment channels though. ZKPs can do this

belac: doesn't let me type the name it auto deletes

belac: why (reply to 79673)

&rey: ZK development is invested in.

Cryptskii: Solona on the other hand is probably one of the worst BC from a tech standing

&rey: Though please try to combine your thoughts into one message, so that it would be easier to read.

Cryptskii: ethresear   .    ch/t/sharded-recursive-zk-snark-proofs/19480

Cryptskii: i may actually know i thing or 2 and may or may not be one of the handful of fellas actually pushing the tech forward. how you call trailblaze

belac: haha true (reply to 79686)

Cryptskii: or i can just stop talking if your going to be anal like that. just remember you can really change what your potential roster looks like. i wait for someone to reach out then that know better than to be like this as its a really turn off.

Cryptskii: i could bring value here if i feel welcome and accepted for where i excel and for my small quarks you feel the need to poke at after 2 minutes of me being hear. no Kobey or Jordans going to sign up for that kind of welcome. im here for those in here that can speak zkp, sharding, and paychannels on low level with me. DM me. thank you and bye for now

&rey: ZK-proving entire blockchain uses quite a lot of resources, doesn't it? And it imposes cost on new TVM opcodes, which are in my opinion more important.

Cryptskii: wrong (reply to 79695)

Cryptskii: not in that design

Cuddlesaurus: I would like to learn more about TON.

Cuddlesaurus: about the future of TON

Cryptskii: use of epdemic communication and verification between shards and the constant sized storage means the work load per node does not increase in cost or complexity as it scales

Cryptskii: anyways i dont want to annoy you with my trailing thought  habits. keeping the chat well structured comes 1st! ofc

Cryptskii: 🫶

&rey: Feel free to suggest things if you have idea how to integrate them with TON without hindering it much! Though modifying core isn't a simple thing, as I've seen in the code. (reply to 79694)

Cryptskii: well what i actually came her for was to inquire into a grant. for my mini game social app that will move to alpha testing next week

&rey: There is such an initiative. https://github.com/ton-society/grants-and-bounties/. (reply to 79705)

Cryptskii: I want an NDA before i share any of this to even the TON team. Im obsessed with studying the success of these point-fi games and see that 90% are literally just thrown together crap poorly though out and are still doing well lmao. a lot like 2017 how you could spin up an ERC-20 and a pipe dream w.p and have people jump all over it regardless. Hamster Kombat seems to be one of the only ones.  Hamster kombat seemingly has had a solid strategy that started the day after they named it lol. But honestly they know how to get the headcount in the least grindy way and are covering all their bases. If they can clutch things at airdrop i frimly belive they could build up to a amily known household name and likely accuire some massive partnerships. hamster are highly marketable it turns out. I like to be number #1 very much you see. Im taking things to the next level with our project. i can tell you right away 25-40% of the worlds pop already are interested in the narrative we are binging to TON with our game. The other great things is sets itself up for a stong LT apeal based on making fun factor and mass apeal prority which actually start with looking at the concept and asking and looking at it and asking "okay so this is working now, but how well will it work tomorrow. can i picture content writers being able to provide fresh and captivating campains for years like a hit TV show? Or will i be forced to go the multiverse route right away like fornite did so i dont run out a ways to keep my users attention and time fixed which 9/10 will just butcher it anyays.  I dont need the grant that bad. More intersted in a live ptich and demo or i can just wait. I want to get 40% of TGs users owning and using TON wallets

Cryptskii: thays my goal. therfore we are using a non crypto related design with consistant mass apeal since at least the 1800s 😁

slavagm: Is there any conditions to apply for GameFI grant? (reply to 79706)

Cryptskii: a form. and im a non conformist. you can put great ideas on a genralized template. thats insulting imo. i have a sucessful start up and exit already. And this is a simple game im having fun coding in js css etc, its like im laying down while driving compared to coding in haskell. we already have a story line for two seasons and alpa next week. this is a nice change in pace. i forgot what its like to be able to hit the nitrous button LFG!

Cryptskii: hope to make you all proud and make some connections and friends here on my new blockchain of choice. C Yas ✌️🫶

User<6976132603>: I'm interested in joining a new project where I can apply my full-stack development skills. Specifically, I have experience creating TMAs, Telegram bots, and Telegram stickers. If there's an opportunity where I could assist, please reach out

Cryptskii: ill talk to you man (reply to 79739)

Cryptskii: i want to go on a couple dates 1st though. if im going to be held to my above goal metioned. i need the team small and awesome. brother and sisters not just coworkers

SrDorki: Which is the easiest way to use estimateFee to sendTransaction?

Prince: Can we have a meeting? I am really interested in your innovative idea... (reply to 79741)

Cryptskii: ofc (reply to 79747)

— 2024-07-05 —

Antonio: GM  We are a web3 gaming studio with 3 deployed games and 50M downloads. Keen to know more about Ton and their vision about gaming. Can I get connected with a team member?  Thanks!

Prince: Crypskii is genius but he is now trying to make new team for big project. (reply to 79775)

c: run 01-wallet test  error

Prince: now I can't see any recent transaction on testnet. what's the matter?

Snow Lee: pinging this issue again (reply to 42482)

Snow Lee: because no one resolves it

Snow Lee: can't call getData() on Testnet

Tiep: The receiver must be named "TokenNotification" or can I custom this? Let's say the token user will deposit into contract is USDT. (reply to 79487)

&rey: Have you set HttpProvider url appropriately? (reply to 79794)

Snow Lee: yes, I've made sure to use the right apiKey and the testnet config (reply to 79796)

Snow Lee: TonClientURL=https://testnet.toncenter.com/api/v2/jsonRPC this is the tonClientURL

Snow Lee: getData always throws an error

&rey: If exit code is -13, that may indicate that jetton wallet is not deployed (that there are 0 jettons). (reply to 79797)

&rey: You can customize that, however all jettons will be received in the same function. (reply to 79795)

Snow Lee: There are no exit code (reply to 79800)

Snow Lee: I've run the same example on mainnet, which works fine. but on Testnet the config just doesn't seems to work, and I noticed this issue has been replicated here multiple time

&rey: Courtesy of your framework, I assume. You can find exit code in the "network" browser console panel. (reply to 79803)

Snow Lee: Sadly nothing as well (reply to 79807)

Aldo: guys anybody can help? my verification was accepted few weeks ago, then sudenly it was rejected. now i cant transfer my fund

Aldo: there's no contact, only explanation

Aldo: where can i contact support

daniel: just wait for scammers to contact you again (reply to 79814)

Tiep: I see some customize examples, but I still wonder how contract can receive it. My understanding is that all Jettons implement a function called TokenTransfer. How it work ? (reply to 79802)

&rey: All TEP74-compliant jettons send a message of specific format to destination contract, if so requested by sender (forward amount > 0). It has opcode 0x7362d09c, which allows to identify incoming message as token transfer. (reply to 79818)

&rey: I don't think it makes much sense to talk about "implements" "function"; just whether contract processes messages of a specific structure as wanted.

Tiep: Hey got it ! Thank you again ! (reply to 79819)

User<5648379066>: Hello, I'm TON smart contract beginner.  Help me please. Could I send transaction with withdraw message? Now I can't send message to contract.

DL: Hi, I'm not sure if this is the right place to ask. But I've been looking at some addresses on tonviewer and they are sending tokens from that address, but there is no receive of those tokens before they send. Is there some kind of transaction that might not be displayed?

&rey: You can mint your own jetton there. (reply to 79830)

&rey: Yes there can be. For instance, if sender skipped forward notification. (reply to 79831)

DL: Is there any way to track this? (reply to 79835)

Tiep: I did it successfully with direct deposit from user's wallet ! But the contract's jetton- wallet did not receive TokenNotification when it got Jetton-token from StonfiDex-Swap ! How can I catch this event? (reply to 79819)

Victor: Hello.. pls I am trying to get ton testnet tokens but testgiver ton bot is not working

Prince: why? how much do you need? (reply to 79848)

Victor: I want to interact with a project testnet and I just need about 1-2 tokens (reply to 79851)

Prince: give me test wallet address

Victor: 0QBtuHyzw4Me3Zbnn6u5cdbw4GADTyh6DafDnlj-6vZ-GBkq (reply to 79854)

Victor: Thanks (reply to 79858)

Prince: sent

Victor: Seen... Thanks so much (reply to 79861)

Prince: What can I say is "You are Welcome"

Morteza: /

Illia: You can customize it as long as you set the right opcode for the message (reply to 79795)

Tiep: I got it, and understood how it works. But got a new problem here: contract's jetton- wallet did not receive TokenNotification when it got Jetton-token from StonfiDex-Swap ! (reply to 79871)

jaq₿ek.eth: Skem? (reply to 79874)

Sumit: error: 'LITE_SERVER_UNKNOWN: cannot load block (0,2000000000000000,22219808):1163FE0FFDC0778915E50B2CC4B24788E296DE06E1166CD2B752C8248C265544:8D65C317A34D1242ADC00A5822D2CCA70D2708DBEDB937A358DE5EA3DAC93D46 with specified transaction: not in db' what does this error mean, i have a ton-http-api running connected to my own liteserver

Joel Mun: guys. how do you even claim TON on testnet? Seems like @testgiver_ton_bot is not working, so i can't even try deploying contracts on the testnet.

Орельан [NEVER DM FIRST]: Hey guys, maybe that's a dumb question lol but can you enlighten me a bit on one principle. Let's say that i want to deploy a new wallet. As far as i understand, addresses are generated according to some parameters like your smart contract code and its storage, which makes me think that you can't just get an address from a private key.  So if i want t deploy walletv4, i am supposed to fund the future address of that wallet before sending the deployment transaction, righth?

Joel Mun: Someone please help me.. I really want to deploy a contract on testnet so badly. How is everyone even testing with the faucet not working?? (reply to 79892)

Illia: FunC implementation of the Jetton Wallet does the following: hash(code, data) of the contract, and then sends a message to the destination address that transfers Jettons to the destination address from the sender's Jetton Wallet. If there is already a Jetton Wallet, then nothing happens and the transfer is triggered. However, if you don't have such a wallet deployed, i.e. you have 0 jettons, then this data and the code you sent will be used to deploy the contract first and only then to handle the transaction and increase the number of Jettons from 0 to how much you sent (reply to 79893)

wikig: Hello guys , during the using of telegram.js . is that possible to know the currently status of  isExpanded ? Is the isExpanded method ?

Illia: Firstly, you can write tests for your contracts with Blueprint and Sandbox. Then you can setup MyLocalTON and run a simple blockchain, but locally to test out your contracts via the locally hosted TON-HTTP-API. Finally, once you think that your contracts are ready to move forward, you can deploy them. The testgiver will be fixed very soon I believe (reply to 79895)

jaq₿ek.eth: I can send you 2 test ton jettons (reply to 79895)

Joel Mun: Thank you so much. That helped a lot. (reply to 79901)

Joel Mun: well it seems like i can't copy and paste a wallet address here. lol (reply to 79903)

Illia: I've never worked with this library; it may be a better idea to ask in the @devs chat (reply to 79900)

wikig: Oh ,thanks ! (reply to 79908)

WH: Is spamming the same boc a good way to enhance transaction landing?

Illia: It's guaranteed that all transactions will be processed in the order they were added to the blockchain. I don't think that spamming boc will help (reply to 79911)

pony: Why msg hash not match? when i broadcast i got hash is "+", but i can not get transaction by it.  and once i search it on tonscan, i got response is 'Y-' in search bar? anyone can help me?

Vasiliy: Hello everyone. Please help me understand the commissions. When calculating the TON transfer fee, everything is clear and matches up, but when sending jettons (USDT), I can't understand where and why the fees are deducted. Example tx, hash: 4ebe63da62666c87c1bebd9c7853563fb1e79c1c01c6df1ec25e5416623d705f  External-In message: Total fee: 0.005545203  Internal message: Value: 0.01 Forward Fee: 0.000472537  Value flow (for the sender): Network Fee: 0.006414140 Balance change: -0.009363741  How can it be explained that 0.009363741 TON was deducted (when normally sending USDT)? I have checked all the parameters but cannot get this amount. As I understand it, the fee can be calculated as "Total fee" + "Forward Fee" = 0.005545203 + 0.000472537 = 0.00601774. And in the case of a regular TON transfer, this works, plus the Value (0.01) is also sent, but part of it should be returned as Excess.

Frank: Hi guys, I wondering how "burn address" works on TON. All I see is tokens and nft going to UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ  This address is marked as suspended until 2027, meaning potential dump fest starting 2027?  I wondering where I'm wrong and why this isn't supposed to happen. (reply to 73148)

Dmitriy: Hey guys! Could you please tell at which open-source dAapp that interacts with smart contracts I can take a look as a reference of informing user about success/failure of the transaction? I mean, in TON I can’t simply do   const res = await client.sendMessage(msg); if (res.ok) {   // do something } else {   // do something }   So I wonder what’s the best practice here

Biobrain: I am just getting started with TWA and mini apps. I setup the vite boilerplate. How can I open it inside telegram desktop or mobile?

Frank: Maybe by creating a telegram bot defined as webapp type so it can be linked to your app (reply to 79943)

Biobrain: so create a bot first > link an action "say /start" to open the webapp?

Frank: I think yes, last time I did this was weeks ago and I got same memory as 🐟  Go to BotFather to create new bot dedicated to your webapp and try (reply to 79945)

Biobrain: BotFather is interesting because it shows me "newwebapp" and "newbot" as options

Frank: How do you know res contains ".ok"?  Maybe add try/catch surrounded your function in case client.sendMessage failed for another reason   I also recommend, adding test driven approach (using jest for example) and check what kind of return client.sendMessage could return (reply to 79940)

Frank: Exactly (reply to 79947)

Biobrain: I actually got it working through BotFather's setup process for /newapp and just ended up providing it an ngrok url. I wonder if it would be able to work with localhost (reply to 79949)

Dmitriy: The code snippet represents calling smart contracts in another blockchains where it’s possible to synchronously call the smart contract and get the result of transaction execution  In TON it’s not possible, so I’d like to take a look on the best practices how to do it (reply to 79948)

11: Is there an example of trans_tick_tock here?

}Marka{: Hi. I am writing a program in JS using TON Connect UI. I initiate a transaction when connecting a wallet and I would like to add a comment to this transaction, is this possible? I just can’t find it in the documentation

0x0liver: how can i understand raw_reserve function?

&rey: Testing? In mainnet, of course. Or in @ton/sandbox. (reply to 79895)

&rey: It requests certain portion of balance to remain on the contract. (reply to 79965)

0x0liver: do you have any tutorial other than docs? (reply to 79972)

&rey: Of which transaction, I'm sorry? For instance, jetton transfer consists of 3-5 transactions. It isn't simple to get success status of all of them... (reply to 79940)

&rey: Because no one can deploy contract on arbitrary address (unless they know its SHA256 preimage = initial state). (reply to 79937)

&rey: base64 and base64-urlsafe encodings. (reply to 79920)

&rey: It would make transaction inclusion more certain. Though it may still not be included by deadline in the signed message, in which case you will have to update the BOC. (reply to 79911)

Frank: Appreciate your answer, but not very clear to me, I was wondering if this address, once "no more suspended after 2027" will be able to move tokens as he want? xD (reply to 79977)

&rey: > addresses are generated according to some parameters like your smart contract code and its storage Yes.  > you can't just get an address from a private key You can't "just" get, yes. But that algorithm still can be run offchain.  > So if i want t deploy walletv4, i am supposed to fund the future address of that wallet before sending the deployment transaction, righth? Exactly. (reply to 79893)

Frank: pcrafter nice username haha! long life to craftmanships

&rey: After 2027 AND if someone finds contract code+data which make the address hash part match, then the code may get executed moving tokens around. (reply to 79981)

&rey: The latter part of problem is essentially mining, by the way.

Dmitriy: Yeah, it would be correct to call it _transaction tree_ or smth like that  I mean, I have a contract that performs logically a single action but in TON it’s represented by multiple transactions. I’d like to inform the caller of my contract about the fact that something went wrong (in case when the action is completed I send the log message), and I’m wondering how to do it correctly. One of the options is to send a message to sender with some comment contains the failure reason/error code (reply to 79975)

Frank: thanks for your time! (reply to 79986)

Barus: Hi everyone, I am building buy and sell script on TON blockchain, I am going to use tonweb node js lib, how to get private key and public key from wallet seed phrases

Prince: awesome (reply to 79998)

Prince: we are pleased to hear you

Орельан [NEVER DM FIRST]: Thanks man, appreciate it 🙏 (reply to 79982)

&rey: TonWeb.mnemonic.mnemonicToKeyPair from tonweb-mnemonic module. (reply to 79998)

Орельан [NEVER DM FIRST]: What framework are you guys using to deploy contracts 100% automatically, without the need of any human interaction? I only find tutorials using blueprint, or other ways but they all require some QR code approbation

Prince: only with ton.js possible? (reply to 80010)

&rey: You mean, @ton/ton? It also has same function. (reply to 80015)

Prince: yes, javascript sdk, @ton/ton

&rey: I prefer to let users deploy their own contracts. Though, if automatic deploy is needed, then I'd use pytoniq backed by wallet with some TON deposited in advance. (reply to 80014)

Prince: suppose I develop wallet connect with only ton.js then only I can do is use mnemonic?

Орельан [NEVER DM FIRST]: Thanks i'll check it out, i don't use python but nodejs, hopefully i can find a similar stuff on nodejs (reply to 80018)

Орельан [NEVER DM FIRST]: Don;t fall for scammers (reply to 80026)

Prince: Thanks (reply to 80029)

Barus: I already checked this one from github (reply to 80010)

Mikael: Guys, could you help me with Bag Of Cells Maybe someone has example of parsing transcation hash from it?

Sagara: Hi @thecryptogange Would you please provide me a link to all the API and JSONRPC method ids with example? I can't find example values to provide in request calls.

Орельан [NEVER DM FIRST]: I'm not sure to understand what you want, but i'm pretty sure you can find all that's available in the docs. I'm new to TON dev so my knowledge about it is currently pretty limited (reply to 80036)

Sagara: Hi @pcrafter  I have my own ton full node and lite server is exposed via ton-http-api (toncenter/ton-http-api). API - https://toncenter.com/api/v2/#/  Ex: I need to call jsonRPC method get_wallet_data. I need to provide request body with some parameter. {   "method": "string",   "params": {},   "id": "string",   "jsonrpc": "string" } I need to find all the allowed "method" and "params" for each method. How can I find those details. Where can i find the specification for this?

Pegu: Anyone has examples on ton/sandbox jetton transferring on mainnet?

AG: Hi guys, is Ton blokchchain EVM compatible, such that can we use solidity smart contracts on TON? is it possible to create custom tokens on TON blockchain or all the tokens are using one standard as on Solana?

NPA120: I have (reply to 80041)

&rey: It is decidedly not EVM-compatible. In particular, fungible token (jetton) architecture is different, but it is possible to create most kinds of jettons on TON. (reply to 80044)

Pegu: Can you show me? (reply to 80046)

Орельан [NEVER DM FIRST]: I finally managed to deploy the walletv4 100% automatically so if someone is also interested in that here is the code i wrote: (reply to 80014)

NPA120: I shared the link for jetton transfer sample. You asked me it to me

Reuven: You are really cheeky.  He's trying to help you and you act like that (reply to 80057)

Reuven: I know him working with him long enough.  don't talk nonsense (reply to 80057)

Pegu: Anyone would assume sending links thats a claim site to be malicious. I asked for sandbox example, not claim site (reply to 80061)

Pegu: Not causing any harm

Reuven: He was trying to help you bro.  This (reply to 80062)

AG: thanks, currently i only saw one kind of jetton (reply to 80047)

&rey: What do you mean by "one kind of jetton"? (reply to 80066)

AG: i mean is there one standard being used for all tokens or its customizable like on solana there is one spl program on which all tokens gets deployed and all tokens are same (reply to 80087)

&rey: TEP-74 is a common standard that says what "jetton" is, but it is flexible enough... for instance, it doesn't say whether all jetton balances must be positive...  And sure enough most projects have their own implementations. (reply to 80088)

Frank: I'm checking on previous messages but didn't saw anyone sharing sort of JavaScript demo on how to decode in_msg body from a transaction using example of TL-B / base64 formating. I'm interesting if there is such example.

Stephan: hi guys, please help me, how can I view the balance of jetton wallets in the contract/wallet? because this is not shown on testnet tonscan

JackryptDev: I dont see 'contracts deployments' filter, can you please show me what's the query? (reply to 78932)

&rey:   transactions(     orig_status: "nonexist"     end_status: "active"     ... (reply to 80115)

Stephan: Hello, please tell me, is it safe to launch a project in production whose smart contracts were written in Tact and not in Func? It's just that TON warns that the language is created by the community and you need to be more careful

&rey: If there are appropriate unit-tests with 100% coverage it should be safe. (reply to 80123)

Леонид: What is the easiest way to send a text message for the transaction in this example?     const walletContract = client.open(wallet);     const seqno = await walletContract.getSeqno();     await walletContract.sendTransfer({         secretKey: key.secretKey,         seqno: seqno,         messages: [             internal({                 to: sellerContractAddress,                 value: "0.05", // 0.05 TON                 body: beginCell().endCell(),                 bounce: false,             })         ]     });

&rey: body: beginCell().storeUint(0, 32).storeStringTail('text message').endCell(), (reply to 80129)

WH: Any way to detect token honeypots?

JackryptDev: thanks, quite often i got timeout error, i am limiting query to a single seqno. What opcode is used to deploy jetton master? (reply to 80116)

WH: No verified source code (reply to 80136)

WH: https://tonviewer.com/EQAZUcmeLkpxlwyweZe9nhS1sfJl4yA6xTdMvilS81Y8niRL (reply to 80138)

&rey: Then better to not interact with it. (reply to 80137)

WH: Is there a way to detect this programatically?

WH: ya its fine, not a big loss (reply to 80145)

WH: Ya usually those are the signs. I think i'll need to use some simulations to test jettons in general

&rey: Emulate... that's not easy, actually. A more resource-conserving way is not to interact... with any jettons without utility, at least. (reply to 80146)

WH: Ya true but some promise but never do anything

:D: using the @ton/ton js library here. Is there any orebuilt function for me to extract textcomments from a transaction/cell, or would I have to script a parser myself? edit: solved, I was atually looking for outMessage.body.loadStringTail()

:D: eg I have this inmessage

:D: hi, i believe its due to the response_destination being set as your address (reply to 80172)

:D: what probably happened is that you sent more fees over than was actually required during the computation, and those are then returned to you :)

:D: what does this mean? (reply to 80190)

:D: the response_destination was probably still set to your address then

Biobrain: I'm really getting into telegram mini-apps development and I am loving it! I do however feel that there's a lack of examples, documentation, and overall tutorials. Are resources (docs, examples, repos, channels, etc...) you could share that would calm my hunger lol

Biobrain: oh and best practices as well

JackryptDev: Is there a list of well-known operations along with their opcodes? TON transfer, jetton transfer, code deployed etc.?

Migazu: Which TON dapps are quite remarkable and unique compared to other ecosystems?

Ryan: hey guys, how can I know the versions of the funC? like the latest one? I see some contracts defining a pragma version, how do they know the version?

Joel Mun: Hi guys. I'm looking at load_ref in the docs.  (slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";   what does asm( -> 1 0) mean? and where can i find further docs about this syntax?

— 2024-07-06 —

GygaCode: Taking as a reference that I had 5 contracts, of which one is to receive the initial message and then start a chain of messages between the 5 contracts, until a final solution is reached, all these messages and executions could be carried out in the same block? I know that the asynchronous nature of the blockchain does not require this to be the case, but my question is more based on time, from the point of view of user experience.

Simon: A quick question: can people use Rust to develop on Ton?

GygaCode: For drivers, but for contracts use FunC (reply to 80299)

Simon: Found a Rust SDK here, is it solid? https://github.com/ston-fi/tonlib-rs

Snow Lee: my man they're Testnet token, they have 0 value, that's the joke

Ram: Is testgiver down currently?

Snow Lee: No, still using it fine. Any issues? (reply to 80316)

Ram: It doesn’t respond to my get commands

Snow Lee: getData not working? (reply to 80318)

musashi: he mean the /get command

Ram: Yeah this one on the tg bot (reply to 80320)

Snow Lee: the Testgiver Ton Bot that gives you 5 TON per hour? yeah that one is not working

Snow Lee: I've been spamming the button for 5 minutes but to no avail

musashi: same to me, not working

Snow Lee: I am now begging for TON Testnet if anyone could give me

Ram: Oh ok, glad to know it’s not just me. Hope it gets fixed 😔

musashi: send me your address mate (reply to 80326)

Snow Lee: 0QDX6_6gwjoQVoEB5zwuGZMf8K8Qgb04DmB2ULwNVtTrZpWV (reply to 80328)

Snow Lee: any you can share because i'm out of TON Testnet T_T much love

musashi: sent mate

Snow Lee: got it, thanks so much man. Much appreciated

Void;: Hey guys, any way to get latest minted users to fragment? or any source can i get nft usernames on fragment?

Osato IP: Pls I need free Tons for testnet. I want to test for Aqua. Thanks

meomeocoj | Mike: hi is there any way to using sha256 for a data > 1023 bit

Witter: @testgiver_ton_bot doesn't work

Witter: please fix it

Eibrahim: I know of a YouTube channel where you can do but i can't send the link here due to rules (reply to 80196)

Eibrahim: Hy guys I have a question I just learnt about the concept of rent in ton blockchain and how important it is when creating a smart contract  to fund the lifetime of the contract  So how Will one specify the rent amount considering you don't know how long a contract will be active

Ага: Hi! How to create custom Jetton on FUNC? Any guide or instructions please?

Eibrahim: Try to use the Jetton minter website (reply to 80396)

Eibrahim: And there's a tutorial on ton documentation too that you can use (reply to 80396)

Ага: I want custom, not basic (reply to 80397)

Ага: Can you please give link? (reply to 80399)

Eibrahim: I can't send a link in here don't know if it is  permissible (reply to 80401)

Eibrahim: But you can append this path to ton documentation url  /develop/dapps/tutorials/jetton-minter

Heydar: my friend received this nft, and we wanted transfer that , but it's unverified , what's going on ! , we cant understand what happend exactly :/ ?

Орельан [NEVER DM FIRST]: On Ton, if an address that does not have any code deployed, has some TON, it is impossible for this address to transfer the Ton back without having to deploy a contract first?

User<7118587076>: Hello, how i can completely decode transaction payload?

TON Bounty Bridge: ​NFT метка  🏷 Developer Tool  Summary:Сделать нфт метку для оплаты различных услуг  Created by Korkin-ton

Артур: I’m not sure, but I think yes. If you write a script that will try to send TON from that address (using it's mnemonic / private key), this wallet will become become a wallet contract. (reply to 80410)

&rey: It is impossible, yes. (reply to 80410)

Chyl_Phil>~₩*: Смотри, какая крутая игра! Тебе точно понравится 😎 https://t.me/playdeckbot/game?startapp=eyJnYW1lIjp7ImtleSI6IkxNOU5waUJ6TnoiLCJyYXciOnt9fX0=

Орельан [NEVER DM FIRST]: But if you are looking at this address: https://tonviewer.com/EQBm38kkGJO0dhZ1lMpzrZ4vAz0jm6_9HH2WZf4ghqW6ljAG  It received some TON, and withdrew them to another address and yet there is still absolutely no code deployed at this address. Am i missing something? (reply to 80429)

&rey: There is no code now. Who says there wasn't? (reply to 80431)

Орельан [NEVER DM FIRST]: I thought that if someone deploys code to an address, then we will see it in the transactions somewhere that some code was deployed, is my understanding biased? (reply to 80432)

&rey: You've missed the case when the same transaction sends all contract balance out and destroys the contract (so called mode 160). (reply to 80433)

Орельан [NEVER DM FIRST]: Yeah you are right, i haven't dug that much in these modes, will do so now, thanks 👍 (reply to 80434)

Hamed: Hi

Ram: anyone have an idea what this error in jetton wallet is?

User<7118587076>: i can pay for consultation, pm me (reply to 80412)

W. [Разработка сайтов]: Guys all hi there is a project need an estimate of the cost of development in brief, the development of the game with the integration of internal currency TON

W. [Разработка сайтов]: How much do such projects cost in turnkey development?

Huu: Hello everyone, I have a question about an API.  I'm fetching transactions from toncenter api v2 but I can't see the contract address or currency type in the transaction details. Can you help me?

Alan: how to call contract to exchange other coin, example usdt

Alan: https://docs.ton.org/develop/dapps/asset-processing/jettons (reply to 80488)

mohsen: I want to set wallet_id to 1 and get the private key of wallet_id 1. How I can get its private key? mnemonics = mnemonic_new() public_key, private_key = mnemonic_to_private_key(mnemonics) code = WALLET_V4_R2_CODE data = WalletV4Data(seqno=0, wallet_id=698983191, public_key=public_key).serialize() state_init = StateInit(code=code, data=data).serialize() address = Address((0, state_init.hash)) (reply to 80434)

&: Plz have a look on Tonapi.io, It's much easier to use (reply to 80488)

&: If it's a well-known tx, you can use tonapi.io or sth like that. But if it's a customized one you need to know structure. (reply to 80412)

&rey: Its private key is exactly same, surprisingly. (reply to 80500)

&rey: What do you refer to? Actually, there is no possibility to charge your wallet silently, you have to approve the transaction. Or to install a plugin. (reply to 80495)

Eibrahim: Is there a telegram or discord community for English learners on spetik ton blockchain course

&: https://stepik.org/lesson/1011498/step/2?unit=1019358 (reply to 80512)

mohsen: I am going to create a transaction for wallet_id 1 (reply to 80510)

&rey: Then you need to create wrapper appropriately. Keypair will still be same. (reply to 80514)

meomeocoj | Mike: hi rey is there any way to using sha256 for data larger than 1023 bit (reply to 80519)

&rey: Yes. HASHEXT_SHA256 asm instruction converts chunk1:builder/slice chunk2:builder/slice ... chunkN:builder/slice N:int into hash. (reply to 80521)

meomeocoj | Mike: can u give me a example for creating the input, or i need to write it in asm

&rey: Better to write in asm. (reply to 80524)

mohsen: When does this error raise? Get method "seqno" for account Address<address> returned exit code -256 (reply to 80519)

Gyorgy: Do you made transfer on that wallet with TON before? to initalize it? (reply to 80469)

User<6462254965>: How can I remove this ?

User<6462254965>: Admin help

Gyorgy: Its a Developer chat, not Tonkeeper support. Why or what you want to remove? Seems you bought Battery to pay tx fees. (reply to 80544)

Moose: Hi, I am expertise with figma design, front-end and smart contract in FunC or Tact on TON, integration, tg bots & tg mini apps. who needs a developer?

Орельан [NEVER DM FIRST]: Anyone managed to get a transaction from the Ton Client using the "getTransaction" method? I always get "invalid hash" error  EDIT: even tho i input exactly the same hash returned by the hash() method for a transaction in the list i got from the getTransactions() method

Ram: yep, found the issue. It had insufficient ton for processing on multiple jetton wallets (reply to 80539)

YF: Hello everyone, may I ask why some transfers fail and the retry time exceeds the time set by the code when developing ton transfers? Infinite retry until ton transaction fee is exhausted.

YF: For example, in this transaction, I set the retry validity time in the code to 1 minute, but after the failure, the automatic retry exceeded 1 minute until the ton in the wallet was completely lost

YF: UQBLGRH4vhqXHSYNgqi_1X-vWNpWItxywWNKm1KBbMzo9R64

Simon: Got stuck in the last step for hours. Anyone knows why?

Illia: Who sends this transaction with the mode 160?  Is it like including data + code with the transaction, and the code inside is like 'receive and send all the remaining balance + destroy'? (reply to 80434)

Illia: https://www.npmjs.com/package/@ton-community/func-js-bin?activeTab=versions  You can have a look at versions of func-js compiler, that should match with actual versions (reply to 80240)

Illia: You have to look at TEPs for all such operations  https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://github.com/ton-blockchain/TEPs&ved=2ahUKEwjR0MCM-pKHAxVIhP0HHYxJDQ4QFnoECBEQAQ&usg=AOvVaw1IxkMMaj7zgdt2P5i1Szkx (reply to 80200)

Illia: Ston.fi and dedust are both interesting examples of defi built in async distributed manner (reply to 80202)

Illia: docs.ton.org   +  https://tact-by-example.org/  +   https://docs.ton.org/develop/smart-contracts/sdk/javascript  The best way to start mate (reply to 80196)

Stepan: Hi guys.   I'm trying to write functionality in tact to upload NFTs on behalf of a smart contract. I can't seem to properly construct the forward_payload. There is a Cell in which the information for sale is supposedly passed. According to the getgems marketplace code, the first item should be the operation code (uint32, equal to 1), but then I get stuck. There are 512 bits read as a signature. How do I form it? Then another 2 refs, state_init and body, are read. It’s also unclear how to form them. Is there any workaround for listing an NFT on the marketplace?  I'm not particular about the solution being in tact. It can be in TypeScript or func, anything at all.

Stepan: Then would be another challenge to topup defi's liquidity pool from smart socntact..

Jason: Hello, I'm interested in making a bot that accepts payments through telegram's wallet is there a recommended way to start? I tried getting the api but declined and it told me to use stars, I would like to test the functionality first anyone has any good place to start? Like how can I get an api key to test

SrDorki: Is better with mini app (reply to 80612)

SrDorki: Since you can use webpage

SrDorki: I made first send tx with tonkeeper

SrDorki: Use tonconnectsdk (reply to 80617)

SrDorki: And install tonweb

SrDorki: Im about to launch my own tapbot

SrDorki: Anyone interested to work together

Lucky: Hello

S: good evening. what is this ? (reply to 80632)

JOSEPH: Is it advisable to create and launch your token with minter.ton.org

x: hello, any alternatives to @testgiver_ton_bot ?

— 2024-07-07 —

Void;: if the username flagged as "taken" dose that means this username is not owned by Telegram usernames collection?

Void;: also, can I get list of taken usernames by TonAPI somehow?

NonceSence: anyone knows how to save gas fees when swapping token? it's about 0.24 ton per swap transaction

Neo: Hi, anyone knows why testnet api getTransactions returns mainnet address ?

Neo: Here is an example. The source and destination in the response are mainnet address.

Vladimir: yes please if you have a swap-fee contract please share (reply to 78677)

Vladimir: did you find a solution? (reply to 65699)

&: That fee is DEX swap fee, you cannot reduce that fee bcz is Smart contract minimal fee. (reply to 80680)

NonceSence: does the fee really is 0.25-0.3? or it refunds?

Skuli: Hello all Test giver bot not work?

&: It different between buy or sell or providing lp. It's around 0.26TON to 0.3TON This is defined in Smart contract (reply to 80833)

NonceSence: But I noticed that it refunds the amount?

&: a little. extra ton.

Pegu: Does anyone have example of transferring jetton through messages from wallet to jetton wallet? Using @ton/ton library

Snow Lee: It should refunds and should tell you how much you'll get back (reply to 80835)

&: storing message in jetton transfer tx? (reply to 80847)

Gideon: Good morning TON Devs, please my Telegram testnet bot is not responding. What could be the cause?

Samdezero: Hey mates, is there someone interested in building a product on ton chain ?

&rey: It is unstable lately. (reply to 80834)

11: Hi guys, how to use ~dump to print slice address?

Howard: This is cool.  https://github.com/yungwine/pytvm

Totti: Hello, everybody. Nice to meet you here.

Aluma: Hello the testnet bot is not responding.. is there a timer for it to respond or the bot is down!!

mohsen: When does this error raise? Get method "seqno" for account Address<address> returned exit code -256

beck_: Can somebody from admin/team help me with these Qs; 1. How much TON do the TON team, foundation, and ecosystem funds currently hold? Where can I check the complete contract addresses for them?  2. What is the source of the 0.6% TON yearly inflation? Is this supply from the initial 500 million mining allocation or new inflation (after 500 million) from the contract?  3. Are there any updated resources to check TON tokenomics? Earlier, there was freezing for inactive wallets holding TON, making it difficult to identify clear token supply information for TON.  4. Is the number of TON validators limited? Is there a maximum limit for the validator count, or can anyone join the TON validator list at any time?  5. Is Redstone the only Oracle TON is using?  6. In March 2024, Telegram announced that it would share 50% of ad revenue with channel owners and that the payments would be settled on the TON blockchain. What is the status (implemented / still pending) of this information?  7. Where can I check voting proposals for TON? I couldn't find any latest proposal info on TON Vote.  8. Have Dynamic sharding (shardchains and workchains) already been implemented (mainnet or testnet)? If so, are there any examples, or are they just a proof-of-concept at the moment?

&rey: Please look four messages above. It may be down, yes. (reply to 80948)

Aluma: Thank you.. (reply to 80969)

&rey: 2. New TON are minted each block (1/1.7 TON per block). It increases total supply. It's worth noting that half of fees are burned, decreasing total supply. There is no attempt to explicitly balance those.  4. At the moment, the main limit is that Elector smart contract needs to evaluate full candidates list within special gas limit. I believe the limit is around 700 nodes. 5. No. 6. To be asked of Telegram/Fragment.  8. Yes, automatic sharding is online. "Shardchain blocks" on https://tonscan.org/block/latest. (reply to 80966)

Witter: Is there any news on the progress of Ton Connect supporting the sign message standard?

Mr Shi: Hello, anyone having issue with the wallet connect library right now?  Integration was working fine on my app until a few hours ago and now it’s not working anymore. When I click on the connect button, the modal is not opening.  I didn’t do any change on my side

Decosta: Not really (reply to 81000)

Орельан [NEVER DM FIRST]: Hey guys, does anyone have any ressource on how messages are included in blocks, and what can change the speed? Cause sometimes i can do a whole swap in 30 seconds and sometimes that thing takes 2 minutes, i'd like to understand what's behind this

Tom: Hi, I don’t know why the robot I developed will directly exit TG after opening it through a link.

Tom: Has anyone encountered similar problems?

mohsen: When does this error raise in pytoniq? Get method "seqno" for account Address<address> returned exit code -256 (reply to 80971)

&rey: I think when contract is not initialized. Valid seqno for such cases is 0. (reply to 81026)

mohsen: How to I initialized It ? (reply to 81029)

mohsen: hey (reply to 81029)

&rey: Send outgoing message. Or send an incoming message with StateInit (wallet wrapper can provide that, I think). (reply to 81030)

ABRAHAM: Hi everyone. How to track transaction of a large number of addresses? Currently I use ton center to  scan every master chain block and all shards to know which transaction belongs to my address but this solution is quite bad cuz the response time is very slow.

Rayan: Hi. Can somebody explain me Ton transaction structure?

Rayan: txTx.TransactionId =kzAuK93DPslXqDcXSmWqNiiiDA1e1EnUBKhne4pc19w= txTx.Utime =1718621819 txTx.Fee =0.0035108 txTx.InMsg.Message =F41FGQAf9mPtbitgUHhCjJs4AO87mQKicbKgHIk4pSPP4k5xhHqutqYgAB7USnesDnCdACWg1ARi URfs61e1XaY8Y5ey7Mq7q8lMR91dxG9nhKg6gYyG4co=  txTx.InMsg.BodyHash =85s6gxjULilqn4CGKJ8I89+F47WbfA38WZCZVZHy4A8= txTx.InMsg.Destination =EQDOCdudQEQ0EDXL6NiHf18G8S0-LZma18Hchom3LbttCiU9 txTx.InMsg.IhrFee =0 txTx.InMsg.Source =EQA_4uah8neMWm1HDhg-fSCJTQH3OzooYOfhuAosAarJP_nk txTx.InMsg.Value =0.0835176 txTx.OtherFee =0.0035108 txTx.StorageFee =0 msg.Message =1TJ22wAf9mPtbitg  msg.BodyHash =g+uSsVPxpam7VWk73LnCnaZ3WNBaDcOPiRTORBilx4E= msg.Destination =EQCWg1ARiURfs61e1XaY8Y5ey7Mq7q8lMR91dxG9nhKg6og0 msg.IhrFee =0 msg.Source =EQDOCdudQEQ0EDXL6NiHf18G8S0-LZma18Hchom3LbttCiU9 msg.Value =0.0631176  I mean this.

User<6746015275>: India group is available?

User<6746015275>: @mod (reply to 81078)

Stephan: Hello, why are new transactions not displayed on testnet tonscan?

Орельан [NEVER DM FIRST]: Has anyone an idea to decode that? I get this data from base64 that i turn into BoC but i'm not super sure how to get to the body properly

XANDER 💜: You mean you want to creat your own? (reply to 81111)

XANDER 💜: Sure (reply to 81113)

spencer: hi there, was wondering if anyone had recommendations on which python sdk to use 🙂

&rey: pytoniq has wide range of functionality and doesn't use precompiled binaries. (reply to 81142)

Illia: One transaction, one body. You can use w5 to send a batch of actions up to 255 (it will send up to 255 actions from your wallet) (reply to 81150)

&rey: Use @ton/ton wrapper for wallet, it supports multiple messages. For wallets of version 3 or 4, the limit is 4. (reply to 81150)

馬特維: Hi to everyone

馬特維: For some reason, when a transaction is created, an incorrect question is written in Tonkeeper

馬特維: I even enter different TON values, but still (reply to 81164)

Slim: Hey guys

User<5648379066>: Hello 👋,nice to meet you (reply to 81159)

Slim: How do I get the hash of a successful transaction

Slim: Using ton core package on JavaScript

Slim: Please does anyone know this

Illia: Btw do u know why the limit was set to 4 messages? (reply to 81155)

Koleen: Hi All! I am wondering why my balances from Telegram wallet doesnt sync with TonKeeper wallet. Even though they are just same account that I imported from Telegram wallet. I also noticed that there is a different address between telegram wallet and tonkeep iven though they were imported from the same seed phrase. Thank you,

Boris: could be different wallet versions (reply to 81179)

&rey: Because those wallet contracts don't support more. (reply to 81177)

&rey: You've forgotten validUntil field. (reply to 81164)

Illia: You have to check it in the explorer. As it was mentioned by @pcrafter, you can use v3 and v4 for up to 4 messages, v5 supports more, but there are also high load wallets (reply to 81154)

馬特維: Thank you,I’ll try and answer now (reply to 81182)

Illia: Everything has a reason. That's unlikely they just randomly came up with the idea of number 4. I'll explore the contracts to find the reason (reply to 81181)

&rey: + there is commonly forgotten version called preprocessed-v2, which can send 255 messages per transaction and is cheaper than highloads. Its drawbacks are being prone to breaking easily + having to bundle those messages. (reply to 81183)

Aluma: Can someone help me with testnet token? 😔😔

&rey: Have you already tested your project in @ton/sandbox? (reply to 81187)

Illia: Wow, thanks. Could link to the source code? I've never seen this one (reply to 81186)

&rey: Here it is. https://github.com/pyAndr3w/ton-preprocessed-wallet-v2. (reply to 81189)

Illia: That's great, cheers mate (reply to 81190)

馬特維: That’s all too ( (reply to 81192)

Aluma: Not yet working oh that.. the testnet bot is down and I need some Ton testnet token. (reply to 81188)

&rey: Amount must be string, indicating amount of nanoTON to send.

Illia: I may be wrong but validUntil should be bigint (reply to 81192)

Slim: Please guys (reply to 81173)

馬特維: I enter a different number in the line, but still (reply to 81195)

Aluma: I need the testnet token so that after testing on sendbox  I won't have to wait for testnet token.. (reply to 81188)

Aluma: 0QAdhSrIGZA5D2aX2kVYnAHVwn1VPGT6yQ8JsbDnWAYBpzbn

Doug: I can't activate my Ton wallet, when I request the 5 free Ton, so I can then make a smart contract, could anyone help me?

Aluma: Please someone should help me with testnet token. 1 to 3 Ton would do. 😔 (reply to 81205)

Illia: just request it from the test giver bot mate (reply to 81202)

Illia: 5 free ton is just for testnet, just in case (reply to 81206)

Aluma: The bot is down since two days ago. (reply to 81210)

Slim: Guys

Illia: i've just got +5 tons from it (reply to 81213)

Aluma: Let me try it again right now. Thank you mate. (reply to 81217)

Lucky: I want to get a token verified on TON Keeper how do i go about it?

PoW: () emit_log (int event_id, cell data, int need_separate_cell) impure inline {     ;; 1023 - (4+2+9+256+64+32+2) = 654 bit free     var msg = begin_cell()             .store_uint (12, 4)         ;; ext_out_msg_info$11 src:MsgAddressInt ()             .store_uint (1, 2)          ;; addr_extern$01             .store_uint (256, 9)        ;; len:(## 9)             .store_uint(event_id, 256); ;; external_address:(bits len)      if (need_separate_cell) {         msg = msg.store_uint(1, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either                 .store_ref(data);     } else {         msg = msg.store_uint(0, 64 + 32 + 2) ;; created_lt, created_at, init:Maybe, body:Either                 .store_slice(data.begin_parse());     }     send_raw_message(msg.end_cell(), SEND_MODE_REGULAR); }  followed from Jetton contract I got that event that on client side      {       type: 'message_sent',       from: EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G,       to: EQCB97qNd4_ObXJStIHDi8cLA2og9x9UCXuxtN4BS1NCjjDs,       value: 50000000n,       body: x{BE5A75950000000000000000000000000000000104}        x{46F71C103267561A1C0228EF5C06F7549D897AA7400000001000000006F71C103267561A1C0228EF5C06F7549D897AA7400000001000000006F71C103267561A1C0228EF5C06F7549D897AA7400000001000000006F71C103267561A1C0228EF5C06F7549D897AA740000000100000000},       bounced: false     }  How can I decode it, I tried like          const body: Cell = event.body;         const slice = body.beginParse();         console.log(slice.loadUint(4));         console.log(slice.loadUint(2));         console.log(slice.loadUint(9));          const eventId = slice.loadUint(256);         console.log({             eventId,         });          slice.loadUint(64 + 32 + 2);         const red = slice.loadRef().beginParse();  but got error      Index 168 > 168 is out of bounds        66 |         console.log(slice.loadUint(9));       67 |     > 68 |         const eventId = slice.loadUint(256);          |                               ^       69 |         console.log({       70 |             eventId,  I think this error should not come as it should that number of bit as encoded in contract, can some help? What I did wrong here

Memes Mask: Hi, can you send an example with Notcoin transfer https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer

&rey: This is error, it will only get cell data's content. (reply to 81225)

&rey: By the way, you're loading wrong event — one which has internal message inside.

&rey: Have you tried to write it by yourself? (reply to 81226)

PoW: How? As I am reading from result.events[0], result.events length is 1 only (reply to 81228)

PoW: Do know any reference where on client side, Jetton event being decoded? (reply to 81227)

Memes Mask: Yes, I couldn't point to the NOT token (reply to 81229)

&rey: Have you found its token address? It can be found via tonscan.org quite easily, I remember. (reply to 81234)

Memes Mask: Do you have an example where you need to specify the token address in the code? (reply to 81235)

Nick: Does anyone have an working examples of minting a token with Java api? I am not able to get the ones that with ton4j to work

TON Bounty Bridge: ​FunC debugger  🏷 Developer Tool  Summary:A visual debugger that e.g. can debug given on-chain transaction step-by-step (if on-chain code is t...  Created by PanForPancakes

Sulivan: Hi all. How can I be an ambassador of TON from Brazil as Developer too?

XANDER 💜: Do you want to use it for smart contract? (reply to 81142)

XANDER 💜: You mean you need auditing (reply to 81246)

— 2024-07-08 —

User<6503079326>: Hello, can you tell me how this transaction was sent? (Beware of scam!), we need it for the project.

User<6503079326>: tx id 0415766a83b57872b4e7d8ed0170fe8be93f7ea7f6b37bab4f18e0111adbe567

Aabbdev: you may have the explorer

User<6503079326>: how they applied the sending method Nft Ownership Assigned · 0x05138d91?

User<6503079326>: are ready to pay for the right solution, we need to implement such sending with a text comment

Aabbdev: the doc tell you everything normally

User<6503079326>: please help me

Adam: Can someone pls help me confirm this liteserver node issue, does this mean my server is too slow, not enough IOPS maybe?  ton-node    | [ 1][t 5][2024-07-08 03:10:30.092524709][manager.cpp:2524][!manager] STATUS: last_masterchain_block_ago=6092.5ms last_known_key_block_ago=3034.1s shard_client_ago=6092.6ms ton-node    | [ 2][t 5][2024-07-08 03:10:30.095056757][manager.cpp:2616][!manager] Liteserver stats (1 minute): checkExtMessage:9 ton-node    | [ 3][t 7][2024-07-08 03:10:30.221420732][liteserver.cpp:84][!litequery] aborted liteserver query: [Error : -503 : timeout] ton-node    | [ 3][t 4][2024-07-08 03:10:33.859169782][liteserver.cpp:84][!litequery] aborted liteserver query: [Error : -503 : timeout] ton-node    | [ 3][t 5][2024-07-08 03:10:34.012038915][liteserver.cpp:84][!litequery] aborted liteserver query: [Error : -503 : timeout]

&rey: Anyone can send any message from their own wallet. (Unfortunately their wallet is not a valuable NFT...) (reply to 81310)

Alfred: error: parameters of an assembler built-in function must have a well-defined fixed width   ... reate_20((X0, X1, X2, X3, X4, X5, X6, X7, X8, X9, X10, X11, X12, X13, X14, X15, X16, X17, X18, X19) v) asm "20 TUPLE";

Alfred: Can the tact function's input accept a nested struct?

Alfred: Anyone can help explain the above error message? I didn't really get what's the issue.

Alfred: For anyone encountered the same error, it indicates that your struct is too large or the width is not explicit set.

PoW: export const compile: CompilerConfig = {     lang: 'func',     targets: ['contracts/hello/hello.fc', 'contracts/nft/nft.dc'], };  I defined lime this too handle two contract in one project But getting  "Using file: NFT Build script running, compiling NFT Error: Func compilation error: contracts/hello/hello.fc:16:34: error: redefinition of function load_data   () load_data() impure inline_ref {  error Command failed with exit code 1. info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command. "  How can I work with two contract in same project?

&rey: I don't understand what would you expect the compiler to output. Contracts should be compiled separately... (reply to 81357)

PoW: Sorry, I thought I can define in same wrapper.compile, I created new for other, it worked, thanks (reply to 81358)

Kunikimn: how to find a job on Ton network developmemt？

Eibrahim: There's a channel called ton jobs, jobs available in the open network ecosystem are being posted there (reply to 81380)

Kunikimn: thank you, sir! (reply to 81383)

Wlah: Hi, I use pytonconnect to do payment. Sometimes, the call of connect.send_transaction() never return even if I confirm the transaction in TON Space. I don't know why. Anything do I miss out? thanks.

Eibrahim: 😂 you don't have to (reply to 81390)

Eibrahim: Though I really feel like there's a need to bridge the gap for non-russian speakers

Kunikimn: It is necessary. Ton network might change the world.

Eibrahim: There's a need for more advocacy across several languages (reply to 81396)

Rae: This is the most honest observation here. It would be much better for innovation outside the region. (reply to 81393)

Pegu: Like sending the message from wallet to the jetton wallet to initiate the transfer. I'm trying to do emulation from sandbox mainnet but the blockchain only accepts a message (reply to 80853)

Pegu: Is it possible to use @ton/sandbox blockchain to open wallet contract for specific wallet address without mnemonic? I'm trying to do emulation for public users

&rey: You may need to push transaction into its underlying queue, but it should work. (reply to 81437)

mohsen: Can a TON wallet be deployed before receiving anything? (reply to 81444)

Pegu: how i'm emulating jetton transfer is opening up the jetton contract via the sandbox blockchain and using it to transfer. (Requires user mnemonic for sender, so i only can test emulation on my own wallet)  the mainnet blockchain emulation takes in internal messages only e.g.     const result = await blockchain.sendMessage(message);  messages = internal({      from: sender.address,      to: address,      value: toNano('1'),      body: beginCell().storeUint(0, 32).endCell()  I was thinking of crafting the internal message to trigger the jetton transfer? (Not sure if possible)  or is there another method of doing this emulation of public user address (reply to 81444)

&rey: There may be other (possibly private) fields on blockchain which can help with emulation. Or a flag somewhere that disables signature checking; then you can send external to user's wallet to emulate that directly. (reply to 81448)

mohsen: hey Can a TON wallet be deployed before receiving anything? (reply to 81453)

Nerses: I've implemented an HTLC atomic swap in TACT. What key aspects should I consider to enable HTLC for arbitrary Jetton swaps? (e.g. how to recieve and send Jetton)

Tim: Your question is too vague. Can you elaborate? To receive and send Jetton you send specific transactions to your wallet. It’s described in details in docs.ton.org You can also look at ton assets-sdk for js example (reply to 81458)

Rich: I'm sorry but the chain is geniunely so slow. how is this gonna be used for anything? Like I would love to build on TON but simple dex swaps take over a minute when I'm testing

Rich: am i missing something here?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 59 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 21  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

&rey: Use less "simple" DEX swaps and more innovative technologies which would be novel? (reply to 81462)

&rey: After all, it is not quite good for users to make decisions in haste, as well.

mohsen: hey Can a TON wallet be deployed before receiving anything? (reply to 81473)

&rey: No, as any deploy is a transaction which has to be funded somehow. (reply to 81475)

User<6425982764>: How to get jetton wallet for spefific jetton? I mean ston fi

Nerses: I  want to understand how would be interaction of my smart contract and Jettons Master contract in case I want to accept arbitrary Jettons (reply to 81461)

Rich: but doesn't the way you've built the chain completely ruin most apps you can use blockchains for? trading is basically the #1 usecase and u can't really do that on TON (reply to 81472)

&rey: It doesn't have to take ten transactions in chain, I guess. Though that depends, really. (reply to 81481)

Rich: but doesn't the way you've built the chain completely ruin most apps you can use blockchains for? trading is basically the #1 usecase and u can't really do that on TON (reply to 81483)

Rich: like most apps you probably need to do a few tx's in a chain

Rich: whereas on other chains it takes like 1 second.

Rich: how can this ever compete long term?

Ram: What’s the equivalent of storeBuffer in FunC? Used store_uint(buffer, 256) but this will generate a different address when calculated

Cyber: Yeah (reply to 81485)

Alex: Hello guys, are there any guides on FunC VPN writing ? Or any open source  solutions ?

User<6397988095>: I'm a blockchain engineer based in Canada, and I specialize in the following projects:  Memecoin: UX/UI design and creation of new meme arts DApps: Development on EVM, Solana, and Ton networks Telegram Mini Tap Games and Bots Betting Sites and Online Casinos & Stores If I'm bothering you, I apologize. Feel free to ping me if you need a developer who can handle any of these projects.

Alex: oh, thx! (reply to 72098)

Ajy: Hello William, You have accomplished many things. I have a certain project in mind would you like to join but before that we need to check your specs and legitimacy. (reply to 81500)

Nerses: another question is in case i want to do swaps for arbitrary jettons. To send, receive, and burn jettons my HTLC contract should be Jetton wallet.How I can do that for arbitary and unknown Jetton ? (reply to 81461)

Simon: Just heard that contracts on Ton can be upgraded and replaced. Is this one of the reasons that few DeFi projects are on Ton network?

mohsen: I created a new wallet and transferred some USDT to it and tried to see if I could activate it by transferring USDT but it didn't work. Then I transferred some to its TON, but the wallet changed from uninit to Nonexist and its balance became 0. what happened? (reply to 81483)

K: hi i am new here

K: i am a senior dev from web2

K: how about the ton smart contract difficulty

Eibrahim: We can start something though (reply to 81406)

Adam: Has anyone solved this? I can't query my lite server (reply to 59543)

Paul: Hi there! Are there any simple ways to track usdt balance via ton-connect or other libs? I want to know my balance in TON & USDT when my wallet is connected to the dapp Thanks…

Nerses: what happens when Jetton master contract send jettons to an address which doesnt have Jetton wallet ? Is autumatiacally new wallet contract created  by master contract or it depend how master is implemented?

Alex: it will deploy the jetton wallet contract. https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-minter.fc#L35  As you can see here, it has the state init, if an address is not deployed, it will receieve the state init and deploy it (reply to 81535)

Nerses: thanks a lot (reply to 81537)

beck_: Can anybody from admin/team help me with these Qs? few are already addressed above (reply to 80966)

lin: how can I monitor new jetton token           in real-time?

Alan: how to get testnet jusdt

Kunikimn: how to exchange ton with usdt？

Kunikimn: I have some usdt coins. when I start swapping, it told me that the gas fee should be paid by ton. But I have no ton coin. Is this a dead lock？

musashi: so you need to get some Ton from CEX mate (reply to 81555)

Kunikimn: it is a little bit complex for me

Kunikimn: is there any other method to earn ton coins？0.15 ton is enough for me to complete the above currency swap.

Орельан [NEVER DM FIRST]: Hey guys, does anyone have ressource on how to split this kind of data? I'm turning this to a BoC but not completely sure about how to get to the body

&rey: Well, you need to load CommonMsgInfo, then load init, then the remaining part (or its only reference, depending on the bit in Either) is body. (reply to 81561)

Орельан [NEVER DM FIRST]: This is the correct interface right? I'm getting the 3 booleans properly but i fail to loadAddress on src & dest. Is there an intermediary step to include in between? (reply to 81562)

&rey: Have you loaded the first bit, $0? (reply to 81567)

Орельан [NEVER DM FIRST]: No i'm going there straight like that, i guess that's wrong right? 😂 (reply to 81568)

Adam: Has anyone been able to setup a private network using TON?

Орельан [NEVER DM FIRST]: Is there any ressource detailing how to properly read and interpret all these tlb interfaces? I never used that before actually

Paul: anybody 🥲 (reply to 81526)

Орельан [NEVER DM FIRST]: I'm pretty noob on Ton but i guess that if you call the getter get_wallet_data on your jetton wallet address you should get what you need (reply to 81582)

Орельан [NEVER DM FIRST]: That's for USDT (or any other jetton) not for Native Ton (reply to 81585)

Paul: it seems easy, but which lib? 😁 ton-connect? or ton-web or something else? (reply to 81585)

Орельан [NEVER DM FIRST]: I'm pretty much using only https://www.npmjs.com/package/@ton/ton for everything, but i guess you can choose any lib you prefer as they are probably already using this one (or use this one straight) (reply to 81589)

Орельан [NEVER DM FIRST]: Or actually you can just do an http call on the API like they do on tonviewer front-end

Орельан [NEVER DM FIRST]: If anyone looking for this check out: https://docs.ton.org/develop/data-formats/tl-b-types (reply to 81572)

Daryl: Hey guys, I am a wallet developer. I am having an issue where TonCenter API's getTransactions shows a transaction as success while it actually failed. When I check TONViewer, it shows correctly that the transaction failed but not for tonscan. Is this a bug?

Орельан [NEVER DM FIRST]: That's probably on the TonCencer side, i faced a lot of similar issues with EVM explorers, where their scrappers got a wrong info in their DB. (reply to 81595)

charlie: Hi team, is there any api or go sdk to convert the hash format or address format? thanks a lot

Daryl: I have tried tonconsole as well and it is the same thing. The weird thing is Tonscan also shows as success (reply to 81596)

Daryl: Is there an effective way to check whether a transaction has in fact success or fail? because the current way of using the api from toncenter seems to be not reliable

charlie: I found the response format is really different between TonCenter side and Tonconsole side. (reply to 81597)

Орельан [NEVER DM FIRST]: The most trustworthy data gotta be the blockchain itself (reply to 81600)

charlie: you can query transaction detail on Tonconsole side. it's real tx status on chain. (reply to 81600)

Daryl: I have tried using this api from tonconsole, it still shows as success despite transaction failing (reply to 81606)

Daryl: i am quite a junior developer, how do i do this? any simple guidelines? (reply to 81605)

Jim: hi

Jim: if you want , i will send my last Ton staking project

Stephan: hi guys, please help, in the function I send 1 ton to the contract, but something like 0.97832 comes to the contract, how do I make sure that the exact transfer amount comes to the contract. in tact

Jim: you can learn throughout that

Daryl: sure, thanks (reply to 81611)

charlie: 😮ic, maybe u can change to another solution. (reply to 81607)

charlie: Hi brother, could u share it to me as well? 🙏 (reply to 81611)

Орельан [NEVER DM FIRST]: I'm a noob on Ton also, but i guess that you can use the "getTransaction" method on the ton client to get some more details about this TX from a node (reply to 81609)

Christopher: could you send me your last project? (reply to 81613)

Jim: kindly dm me guys if you want to learn

Орельан [NEVER DM FIRST]: Do you send the message with the flag to pay gas seperately ? (reply to 81612)

Daryl: Idk why does Tonscan shows as success while Tonviewer shows correctly as failed. Is Tonscan using Toncenter or Tonconsole's api for its display? (reply to 81617)

Stephan: like this       await pay.send(         provider.sender(),         {             value: toNano('1'),          },         'pay'     ); (reply to 81621)

charlie: Hi @jimbrowne  could u DM me? I can not dm u.

Орельан [NEVER DM FIRST]: Add this flag: sendMode: SendMode.PAY_GAS_SEPARATELY (import from @ton/ton) (reply to 81624)

Stephan: can you please send me example of code (reply to 81627)

Орельан [NEVER DM FIRST]:   const cell = openedContract.createTransfer({     secretKey: key.secretKey,     seqno: 0,     sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,     messages: [       internal({         to: walletContract.address,         value: toNano(0),         bounce: false,         init: openedContract.init,       }),     ],   }); (reply to 81632)

Орельан [NEVER DM FIRST]: I copied this from a function i used before so you might need to modify it

Vladimir: I can't find the chat rules Can I publish a job advertisement here? or just technical issues?

RUN: Hi everybody. I'm new to ton chain and I was solidity developer before this. which language is easier to learn and work with smart contracts?

Paul: have u faced with ‘ReferenceError: Buffer is not defined’ problem? I did all things that mentioned in docs, but.. yeah. buffer 🙆😬 (reply to 81591)

Орельан [NEVER DM FIRST]: Nope, what's the stack trace? (reply to 81654)

Paul: may I dm you? (reply to 81655)

Орельан [NEVER DM FIRST]: Sure (reply to 81657)

&rey: https://t.me/tondev_eng/55215 Jobs are better suited to @tonhunt. (reply to 81645)

&rey: I believe there is benefit to learning FunC, as it would make distinctions from EVM clearer. (reply to 81650)

Stephan: like this?   await contract.send(         provider.sender(),         {             value: toNano('1'),              sendMode: SendMode.PAY_GAS_SEPARATELY,         },         'message'     ); (reply to 81633)

Орельан [NEVER DM FIRST]: Well if the IDE does not give you any syntax error i guess yeah 😁 (reply to 81664)

Kelzworld🐾: Is there anyone that can help me develop a game app on telegram.  The person should chat me up privately.

final: 10k$ (reply to 81669)

User<7306625522>: kindly send me a dm (reply to 81669)

Para: Hi, gm! How can I contribute translating english docs to spanish, my native language? I would love to contribute with this project while I study to integrate it in our products

Орельан [NEVER DM FIRST]: Can't find the bot source on your github? (reply to 81693)

По: can anyone send me a tutorial how to build my own app on ton in telegram?

:D: is the toncenter api unreliable for some of you? sometimes i get a LITE_SERVER_UNKNOWN: cannot compute block with specified transaction: cannot find block (0,<>) lt=<>: lt not in db error randomly

Stephan: hi guys, please help, I'm sending 1 ton to my contract, but something like 0.97832 comes, how do I cover the commission so that exactly 1 comes to the contract? I wrote it on tact    import { Address, toNano,  SendMode, Sender } from '@ton/core'; import { Contract } from '../wrappers/LotteryJtl'; import { NetworkProvider } from '@ton/blueprint';  export async function run(provider: NetworkProvider) {     const contractAddress = 'address';      const contract = provider.open(LotteryJtl.fromAddress(Address.parse(contractAddress)));      await contract.send(         provider.sender(),         {             value: toNano('1'),          },         'pay'     );       }

Peng: hey guys i need some help has anyone deploy mytonctrl via dockerfile?

William: How does someone index the TON blockchain for analytics use cases? Would like to build a dashboard from TON blockchain data

Stephan: toncli? (reply to 81750)

Peng: Im trying to deploy a full node inside a docker container   The purpose is to make it into an archive node   Is toncli the replacement of mytonctrl?  @stepundel1  I am using the wget install script for the docker container

WinK: What is the current mainnet TPS for Ton?

not shinji: Has anyone written code for transferring jettons to another wallet in typescript, using the @ton/ton package?. This is very simple but looks like I can’t find any examples anywhere?

&rey: https://tonviewer.com/ shows that TPS is ~40. (reply to 81757)

&rey: Is there any problem in example which is in TON Cookbook? (reply to 81765)

Mr Shi: check this one as suggested by @pcrafter - https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment (reply to 81765)

Raf: I've just released this, I will add many TON/FunC contracts and experiments https://github.com/fabcotech/ton-func-contracts

GygaCode: This is a good idea (reply to 81893)

TON Bounty Bridge: ​6219861961488110  🏷 Developer Tool  Summary:yoones65857@gmail.com  Created by 6037701556160635

**: My wallet not show my balance

**: Help (reply to 81911)

**: /stat@combot

**: Hy

— 2024-07-09 —

Ilya: Uh, guys. Hi.   Someone wrote a chat bot that checks the coin balance on the wallet. In order to issue a permit.

Peng: Anyone has deployed ton full node with docker before?

K: maybe u r using testnet, but you only have coins on mainnet (reply to 81911)

K: can it cover it's own cost? (reply to 81943)

Peng: What has this got to do with cost? Im just asking if anyone has experience with it (reply to 81947)

K: nothing, but i just so curious about this (reply to 81949)

IW: Gm

IW: Hey please I need assistance, where do I start from if I want to become a ton dev ? 🤲🤲

cfs chef: Hey,how to get ton price in contract

charlie: Hi team, anyone use /v2/liteserver/get_shard_info/ in tonconsole? could u provide some example of the filed named block_id to me? thanks a lot

sangmin: I installed mytonctrl2. Is there a way to view transaction information from mytonctrl2 to transaction hash??

Trung đẹp trai: Hi team, anyone can connect ton wallet (testnet)

Cris Kiee: Hey, I tried submitting the game to telegram but got this message. Is there any way to shorten the application submission time to less than 1 month? Please

David Mindset: I have the same issue what happend ? (reply to 81980)

Doug: Has anyone made a game using Ton's jetton?

Doug: I'm trying to integrate the TON Blockchain API into my game, but I'm having difficulties, could anyone help me?

Evelyn | Twendee: Hello, I'm Evelyn at Twendee - a dev shop from 🇻🇳 with various projects have been done on TON. We have 3 open slots for a free consultation this month. Drop me a DM if that’s something that could help you have a clear strategy for your TMA

sangmin: I installed ton-http-api as an installer, and it comes out as TonlibWorker #000 is dead. The status of mytonctrl is the same as the picture, can you help me??

Joel Mun: Hey guys. Is it possible for a contract to bounce a bounced message again? If this is true, what happens if it just keeps bouncing off forever? Does it just run out of gas and stop? What is a proper way to handle such a situation?

User<6425982764>: Hello. Have question. How to get deployer address jetton?

bharath: Enter the address in ton viewer -> transactions and go to the last transaction and check out the tx who called it is a deployer (reply to 82025)

User<6425982764>: i mean data on chain (reply to 82033)

User<6425982764>: calling the method or something

WinK: Hi guys

WinK: I need to verify my Tact contract in ton verifier. How to do it? Please help me guys

User<6425982764>: you have instruction on the tonverifier web

&: DM me. (reply to 81991)

&: I think TON price is come form DEX, you can get ton price form dex api, not directly on contract (reply to 81956)

&: const tonClient = new TonClient({         endpoint: https://testnet.toncenter.com/api/v2/jsonRPC,     });     const jettonRoot = tonClient.open(JettonRoot.createFromAddress(jettonAddress));     let jettonWallet: OpenedContract<JettonWallet>;     jettonWallet = tonClient.open(await jettonRoot.getWallet(walletContract.address));     const jettonBalance = await jettonWallet.getBalance() (reply to 81941)

&: please pay gas seperately. (reply to 81739)

Cyber: Okay (reply to 82050)

Kryptonite: is there any opensource github, example for jetton lock smart contract ?

zj: https://ton.app/a2/api/v1/jettons?limit=1000&offset=0 can i use this api in production for getting jettons instantly

&: you can use https://app.toninu.tech/locker (reply to 82052)

cfs chef: building some defi project, need oracle (reply to 82046)

TLG👽: How did you end up falling Victim of this (reply to 82058)

Орельан [NEVER DM FIRST]: If the  money went to a wallet for which you don't have access then that's it man, accept the lesson and be more careful next time (reply to 82058)

TLG👽: Which kind of scam is that, crypto scam or what (reply to 82064)

Орельан [NEVER DM FIRST]: What does it have to do with Ton ? (reply to 82066)

TLG👽: Wtf, then how did it get connected to ton (reply to 82066)

User<7376766125>: Maybe they asked him to pay in ton (reply to 82069)

TLG👽: Maybe (reply to 82071)

User<7376766125>: Ah India scammer got to you Or Africa scammer (reply to 82075)

TLG👽: It took 1 months plus and you didn't complain since then, even when the scam wasn't big (reply to 82075)

TLG👽: If you have details of the person, maybe knowing his current country it may help (reply to 82079)

TLG👽: Haa, man forget about it once its a she that's a man for sure using woman profile (reply to 82080)

TLG👽: Investment scam, it has nothing to do with ton (reply to 82085)

TLG👽: A good programmer can track the site domain and other, even get his current location. (reply to 82085)

Орельан [NEVER DM FIRST]: So you got scammed on a fake investment site and you come here asking for money? 😂 (reply to 82089)

TLG👽: Becareful not to get scammed again (reply to 82090)

TLG👽: I'm still trying to figure his point 😆 (reply to 82092)

Roykay: Seeking for a smart contract sample about "Jetton Transfer"

&: check docs.ton.org  func cookbook (reply to 82096)

Орельан [NEVER DM FIRST]: Bro you are never recovering anything, there are thousands of scams like this every day, do you seriously think any entity will do something? No sensed person would "invest" 20k on a sketchy site you know nothing about that promises you interest or something. If you are so easily falling into scams turn off your computer honestly (reply to 82097)

TLG👽: They want quick money 💰 (reply to 82100)

Орельан [NEVER DM FIRST]: /report kick this clown honestly he's just polluting with his scam BS and the dude can't even properly explain himself (reply to 82102)

TLG👽: Let me tell you best way to get the scammer, maybe you can still recover your funds. Go to local authorities in your country mostly into crime, report and share every detail you have with them. Just wait till they get back to you. (reply to 82104)

Артем: Hi! Could you please advise if it's possible to implement a functionality in a smart contract on the TON blockchain where users can only sell a certain percentage of their tokens depending on the day? For example, on the first day, they can sell only 10% of their tokens, on the next day 20%, and so on, increasing the percentage each day. How would you approach implementing such a mechanism?

TLG👽: God grace you still get some funds back, but new people should always be aware, there is nothing like free money without putting much work into. Avoid anyone that message you and invite you to any private group (reply to 82111)

Ankit j: Is "Yarn configbot" command for windows also, for configuring telegram bot on windows,is there a different command ?

Daryl: Hi, how do i check what mnemonic protocol does TON support?

Kryptonite: Thanks bro, but i want to look at smart contract (reply to 82054)

Ankit j: Anyone knows ? (reply to 82119)

Roykay: thx, I find this one works for me  https://docs.ton.org/develop/dapps/asset-processing/jettons (reply to 82098)

:D: im getting an error code 36 with the v4 wallet contract, seems to be thrown here   throw_if(36, valid_until <= now()); any idea what is wrong with this?

Rayan: Hi! How can you find out that this transaction is failed or not from information below. {   "transactions": [     {       "account": "0:CE09DB9D4044341035CBE8D8877F5F06F12D3E2D999AD7C1DC8689B72DBB6D0A",       "hash": "IDQmE6Z/XrQ4z6tBX8L/YX0Z3Xy2AZQ21GS/zxbID4E=",       "lt": "47235709000003",       "now": 1718954894,       "orig_status": "active",       "end_status": "active",       "total_fees": "5056877",       "prev_trans_hash": "kzAuK93DPslXqDcXSmWqNiiiDA1e1EnUBKhne4pc19w=",       "prev_trans_lt": "47150912000001",       "description": {         "type": "ord",         "action": {           "valid": true,           "success": true,           "no_funds": false,           "result_code": 0,           "tot_actions": 1,           "msgs_created": 1,           "spec_actions": 0,           "tot_msg_size": {             "bits": "8799",             "cells": "22"           },           "status_change": "unchanged",           "total_fwd_fees": "4477200",           "skipped_actions": 0,           "action_list_hash": "/OewKj7QV0r5U/Mx/2vCrqP+WbpBlTC+/nIQMd7NKyM=",           "total_action_fees": "1492377"         },         "aborted": false,         "credit_ph": {           "credit": "185000000"         },         "destroyed": false,         "compute_ph": {           "mode": 0,           "type": "vm",           "success": true,           "gas_fees": "3482400",           "gas_used": "8706",           "vm_steps": 175,           "exit_code": 0,           "gas_limit": "462500",           "msg_state_used": false,           "account_activated": false,           "vm_init_state_hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",           "vm_final_state_hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="         },         "storage_ph": {           "status_change": "unchanged",           "storage_fees_collected": "82100"         },         "credit_first": false       },       "block_ref": {         "workchain": 0,         "shard": "C000000000000000",         "seqno": 44144939       },       "in_msg": {         "hash": "gJQtYJOuF4M/Pum9py8mfEVJ5kKuH9zNP1LFg1Xw5Zo=",         "source": "0:9683501189445FB3AD5ED57698F18E5ECBB32AEEAF25311F757711BD9E12A0EA",         "destination": "0:CE09DB9D4044341035CBE8D8877F5F06F12D3E2D999AD7C1DC8689B72DBB6D0A",         "value": "185000000",         "fwd_fee": "741873",         "ihr_fee": "0",         "created_lt": "47235709000002",         "created_at": "1718954894",         "opcode": "0x0f8a7ea5",         "ihr_disabled": true,         "bounce": true,         "bounced": false,         "import_fee": null,         "message_content": {           "hash": "SPYvrVEfKD2KHgYLbQKMmod70RE2v5GFQh3ZWpwtPRo=",           "body": "te6cckEBAgEAywABsg+KfqUAB7OsHWVoZlB4QoybOADvO5kConGyoByJOKUjz+JOcYR6rramIAAe1Ep3rA5wnQAloNQEYlEX7OtXtV2mPGOXsuzKu6vJTEfdXcRvZ4SoOogO5rKBAQDZJZOFYYACKhajFkxNWqMTPzEQ/xBJbgDKisir7/xQJ+Ak0zSAw+nrPudpACWg1ARiURfs61e1XaY8Y5ey7Mq7q8lMR91dxG9nhKg6sAJXpnI3GpDhSbfSWGTb/USCfMHoow3xseDEM4UCreKtljl+w/I=",           "decoded": null         },         "init_state": null       },       "out_msgs": [         {           "hash": "kfMu0tF/2MPYYdB932fTrqjxiEzILzDnBzTmC2NX2OM=",           "source": "0:CE09DB9D4044341035CBE8D8877F5F06F12D3E2D999AD7C1DC8689B72DBB6D0A",           "destination": "0:3FE2E6A1F2778C5A6D470E183E7D20894D01F73B3A2860E7E1B80A2C01AAC93F",           "value": "177040400",           "fwd_fee": "2984823",           "ihr_fee": "0",           "created_lt": "47235709000004",           "created_at": "1718954894",           "opcode": "0x178d4519",           "ihr_disabled": true,           "bounce": true,           "bounced": false,           "import_fee": null,           "message_content": {             "hash": "oGjlr8e2y7F/+1WgTb6azPPCJbcFUhv1yZY9LRyJxnc=",             "body": "te6cckEBAgEAywABsReNRRkAB7OsHWVoZlB4QoybOAEtBqAjEoi/Z1q9qu0x4xy9l2ZV3V5KYj7q7iN7PCVB1QAloNQEYlEX7OtXtV2mPGOXsuzKu6vJTEfdXcRvZ4SoOpAdzWUDAQDZJZOFYYACKhajFkxNWqMTPzEQ/xBJbgDKisir7/xQJ+Ak0zSAw+nrPudpACWg1ARiURfs61e1XaY8Y5ey7Mq7q8lMR91dxG9nhKg6sAJXpnI3GpDhSbfSWGTb/USCfMHoow3xseDEM4UCreKtlolaehw=",             "dec

Rayan: "decoded": null           },           "init_state": null         }       ],       "account_state_before": {         "hash": "cL4nDBliXC1IkKVcOUeLXuPb0wINvhwpV3izPArwitU=",         "balance": "10992042442",         "account_status": "active",         "frozen_hash": null,         "code_hash": "/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=",         "data_hash": "9AmWXjihkMaQMOdbkz+SiyuAbHIlx/+TVCGBHwfYbJk="       },       "account_state_after": {         "hash": "EuuiIK0q/VFHJ8H4xcxbl4W0M7TSJa1Ld76RxyZp1ws=",         "balance": "5773529443",         "account_status": "active",         "frozen_hash": null,         "code_hash": "/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=",         "data_hash": "UzTnTfh5cQ+3v4oGkZ/PHD7oai5YkN/Lrc4KtuDL8BQ="       },       "mc_block_seqno": 38419792     }   ],   "address_book": {     "0:9683501189445FB3AD5ED57698F18E5ECBB32AEEAF25311F757711BD9E12A0EA": {       "user_friendly": "UQCWg1ARiURfs61e1XaY8Y5ey7Mq7q8lMR91dxG9nhKg6tXx"     },     "0:1150B518B2626AD51899F98887F8824B70065456455F7FE2813F012699A4061F": {       "user_friendly": "EQARULUYsmJq1RiZ-YiH-IJLcAZUVkVff-KBPwEmmaQGH6aC"     }   } }  rest of it

Ruslan: You should check the "description.aborted = false". (reply to 82134)

Alfred: When a contract received a TransferNotification, how can we verify that it sends from a desired JettonMaster contract?

Raf: yes thanks, I just added a "10.000 transfers" test suite today, I discovered that sometimes when you send 12 , only 11 are received by the receiver, this happens like one time out of 100 (reply to 81898)

Raf: maybe it's a bug at protocol level, maybe it's known

Rayan: but this transaction is failed on Ton Viewer. (reply to 82136)

Rayan: how is that possible?

Rayan: https://tonviewer.com/transaction/20342613a67f5eb438cfab415fc2ff617d19dd7cb6019436d464bfcf16c80f81

Ruslan: Tonviewer operates in terms of the events and actions. You can find there that action "transfer token" was failed. Nevertheless, this is not "failed" in terms of blockchain

Samyar: hi there, does anyone know when i edit my metadata content of an nft (name and image) how long it takes to getgems get updated?   it looks it has cached the nft metadata

Samyar: when i press refresh metadata it still reads the cached result

Pedro|💲🔓: /nIQMd7NKyM

Rayan: how did you find out that transfer token is failed from this? : https://t.me/tondev_eng/82134  and does this mean that token is not transfered? if its not transfered i assume that a failed transaction. now how can i find out its failed from that info? (reply to 82147)

Ruslan: There is no way to understand it from this response. From tonviewer you can find, that you should check transaction F in the graph, meanwhile the one you've shared is B.  Transaction B was completed successfully, and both toncenter and tonviewer says that. (reply to 82153)

Samaun: Hi

Key: I'm developing a telegram miniapp game, I want to check if users have followed twitter, watched youtube videos, in the task section to receive rewards. Can anyone give me the documentation link for that

&: Do not fear about Tonviewer.com 's fail msg. I have tried to fix normal jetton transfer to control it , and ton viewer told me "fail" but actually jetton is successfuly transferred.

Rayan: Aha, is there any hash for all of a batch transaction which its response contain both B & F transactions? (reply to 82155)

Kat: Hey folks, sorry this may not be the technical question. Wonder if there is any channel for project ecosystem on Ton? Would like to get connected with Ton projects.

Орельан [NEVER DM FIRST]: Has any of you been able to locate your own tx in the mempool websocket provided by tonconsole? I've been running like maybe 10 tests and not a single time i was able to find my own TX in the mempool, even though the transaction has been made while the websocket was sending me transactions, i even kept it open several minutes after and the transaction just never came

Орельан [NEVER DM FIRST]: Actually i understood, i was doing tests by swapping with Crypton bot, but it seems these dudes don't use a public mempool. If i do a swap on DeDust itself i see the tx straight (reply to 82168)

K: for dex swapping which one you prefer? dedust or ston.fi? (reply to 82176)

Орельан [NEVER DM FIRST]: dedust (reply to 82178)

K: is there a way I deploy jetton contract which another master contract?

K: with* sorry

K: or could jetton master contract hold other jetton coins?

Misurio: Gentlemen, tell me, is there any way I can change the logo after transferring the ownership of the token to Ton? I wanted to tweak it a bit. I saw that utyab changed the logo, but I'm not sure if that was after the ownership transfer or not.

User<6776655683>: /nIQMd7NKyM

K.: If your jetton icon is hosted somewhere you control, you can just change the image and that will change the logo. Commonly people use GitHub or their own website to host the image so it can be changed. (reply to 82183)

K: I don't think there has way to do so (reply to 82183)

K: thats an idea! (reply to 82191)

K.: But if it's hosted somewhere outside of your reach and you have already revoked token admin - then, sadly, it's not possible. (reply to 82191)

Misurio: ahhh i see (reply to 82191)

Misurio: ok thank you for respond !

WinK: Telegram mini apps like Notcoin, tapswap   Allows users to tap and earn reward points and be able to mint them on their own.  How is this possible? Even people without doing the tap task can mint tokens as the function is public ?   How this issue is solved in Notcoin?

&rey: Server does or at least signs the mint. (reply to 82199)

WinK: Is there any example or documentation that I can refer into?

alef: How can I change Tonkeeper wallet to testnet

don: is there a Chainlink VRF solution in the works or some alternative?  thinking about building an app but requires verifiable randomness

KD: Hello How to make string from Cell and Cell to string in typescript

Victor: hello guys sorry for the bother... i need test ton tokens but the ton giver bot is not working..

Nerses: Suppose i have smart contract for doing HTLC and user1 wants to do swap of Jetton with user2. when user1 locks his Jetton funds in HTLC smart contract,Jetton wallet will be created for HTLC contarct after it how HTLC smart contract should calculate the Jetton wallet address of user2 to do transfer ? if Jetton wallet for user 2 doesnt exist  what will be done ?

Victor: https://faucet.tonfura.com/

Victor: just found a site that gives free test tons every 12 hrs (reply to 82228)

&rey: No, only jetton wallet address of HTLC. (reply to 82223)

&rey: There is ECVRF, https://ratingers.pythonanywhere.com/ecvrf-about.html. Its backing contract can be checked at https://github.com/ProgramCrafter/ecvrf-coordinator-contract/blob/master/src/coordinator.fc. (reply to 82215)

&rey: Have you tried searching in this chat? Open developers menu in Tonkeeper. Close it. Add new wallet, there will be option about testnet. (reply to 82211)

Nerses: then what address should i specify to transfer user2 ? If I got right it should be user2 ordinary address and under the hood transfer will be done to user2 Jetton wallet if it exists (reply to 82233)

don: thanks. is there any telegram mini app using this under the hood? i would like to see it in action (reply to 82234)

&rey: Unfortunately there isn't. (reply to 82238)

don: hmm. i wonder how safe it is to use (reply to 82239)

don: really would like to build out this TMA, but not having basic stuff like Chainlink VRF or something similar that is safe/standard is limiting

&rey: Its entropy backing is mathematical, instead of DAO. The only issue I can imagine is if server somehow goes offline. That's possible but not very likely. (reply to 82241)

&rey: No one had the need, possibly. (reply to 82242)

don: can you elaborate? wdym server? (reply to 82243)

don: its a very simple idea, but like it can be extrapolated to many many things (reply to 82244)

&rey: Server = oracle = the party which generates provably unpredictable data (random) in response to the challenge in coordinator contract. (reply to 82245)

don: i see. (reply to 82247)

don: im gonna try and build a proof of concept that emulates a dice roll (random value 1-6)

don: this thing you linked, should suffice right?

Nerses: in case user 2 doesnt have Jetton wallet,how will be deployment of Jetton wallet for him ? (reply to 82233)

zeligmann: What's mean code 9 in transaction?

Nerses: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes#:~:text=Cell%20underflow.%20Read%20from%20slice%20primitive%20tried%20to%20read%20more%20bits%20or%20references%20than%20there%20are. (reply to 82255)

&rey: Jetton wallet of HTLC will do so automatically. (reply to 82253)

Nerses: and there is no need HTLC contract to be master contract for being abel to deploy ? (reply to 82258)

Орельан [NEVER DM FIRST]: Is there a way to destroy some of my jetton accounts to get back the Ton in their balance? I have almost a hundred of them and they all have some positive balance between 20 and 80 cents

don: so if i were building a TMA, it wouldn’t be possible to add this directly to my smart contract right? it’d need to be handled/implemented on the app side? client/server (reply to 82247)

&rey: Your TMA doesn't need a server, there is one attached to that specific coordinator contract which is on "about" page. (reply to 82262)

&rey: Unfortunately there isn't. (reply to 82261)

Degen: Hi guys! Are there any TON dev support? Can we start private conversation? I have few questions

User<7376766125>: Say here you will be answer here (reply to 82269)

Degen: It is possible to get "shadow ban" with ton connect? I deployed one ton application and everything works quite well but then there is no possibility to connect wallet on main domain. If we switch domain to different or to localhost there is no problem with ton wallet connecting.

musashi: did you try vpn? (reply to 82273)

Орельан [NEVER DM FIRST]: Damn that's actually pretty stupid lol, is it intentional or? (reply to 82265)

musashi: Ton has a storage fee mechanism (reply to 82276)

musashi: I guess that is the reason

Орельан [NEVER DM FIRST]: Yeah but if i wanna destroy this smart contract it does not need to be stored anymore and i should be able to destroy it and get its balance, just like SOL does (reply to 82277)

Degen: My users won't try VPN. Just our app on main domain doesn't ton connect, but with localhost and different domains there is no problem of connecting and we can't solve it. Shadow ban is the thing I have to check with ton support (reply to 82275)

musashi: I didn't get this issue before, just want to know that was the IP address related to Ton Connect service (reply to 82281)

&rey: Those jetton implementations weren't well thought out. In particular, they don't make use of 0.1 TON credit for storage (contract isn't frozen until its balance reaches -0.1 TON). (reply to 82276)

User<7376766125>: Where do you host (reply to 82281)

Degen: notpump dot fun => here you can't login but with funton dot degen dot pl you can login. You can test it, we get decode error on production but only there. Localhost and different domains works (reply to 82282)

Nerses: does every Jetton able to accept identically same message like this message(0x0f8a7ea5) JettonTransfer {     query_id: Int as uint64;                // arbitrary request number     amount: Int as coins;                   // amount of jettons to transfer     destination: Address;                   // address of the new owner of the jettons     response_destination: Address;          // address where to send a response with confirmation of a successful transfer and the rest of the incoming message Toncoins.     custom_payload: Cell?;                  // optional custom payload     forward_ton_amount: Int as coins;       // the amount of nanotons to be sent to the destination address.     forward_payload: Slice as remaining;    // optional custom data that should be sent to the destination address. }     ?

musashi: yes, if that jetton contract follow TEP-74 standard (reply to 82288)

Nerses: thanks a lot (reply to 82289)

ㅤ: who can help me to create a lottery smart contract mini app bot i will pay

Nerses: how can i calculate arbitrary Jetton wallet address of my smart contract within the smart contract ? any code snippet would be great

Nerses: @pcrafter can you please answer ? (reply to 82259)

musashi: follow the jetton-utils.fc in standard implementation mate (reply to 82296)

eo: Hi. I am wondering if its possible to fork mainnet when testing? I specifically want to use USDT jettons in my forked environment, wondering how I could do this and prank the message sender to send from an arbitrary address (whale) ?

musashi: why you need to use the exact USDT on mainnet mate? you can deploy your own test jetton (reply to 82303)

Nerses: can you please provide any link just couldnt find. I reasearched the Jetton standart in Ton dynasty repo and there wasnt what i wanted(or just couldnt find) (reply to 82302)

musashi: here mate https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-utils.fc#L27 (reply to 82305)

Nerses: thanks a lot (reply to 82306)

&rey: No. (reply to 82259)

&rey: (note: this is not universal) (reply to 82306)

eo: integration tests would give me more confidence if I was using the deployed code of USDT. its a widely used testing strategy in EVM (reply to 82304)

&rey: @ton/sandbox + RemoteBlockchainStorage. (reply to 82303)

eo: could you explain this a little bit more please? 👀 (reply to 82312)

musashi: never heard about this before sir (reply to 82312)

&rey: It is in the README! https://github.com/ton-org/sandbox?tab=readme-ov-file#performing-testing-on-contracts-from-a-real-network.

musashi: thanks sir

eo: thanks this is great.  is it possible to spoof a sender? (reply to 82315)

&rey: Let me check. (reply to 82318)

&rey: I think you can, using let spoofed = blockchain.sender(addr);

Study Labs Dev Team: Good afternoon, tell me, is there any get method or function in the tone libraries that outputs the number or addresses of the nft on the wallet?

eo: thank you, legend (reply to 82320)

Nerses: Do you know is there any implemenation in TACT (reply to 82306)

musashi: I'm not sure but maybe this could help https://github.com/howardpen9/jetton-implementation-in-tact (reply to 82323)

Nerses: Really appreciate it, thanks! (reply to 82324)

Pika: can anyone help me with TON staking with referral system. please share any resources of anything which can help. will appreciate some help here.

Pika: please i need any resources on TON referral staking urgently

eason: 有人有想法做ton链上的短视频平台吗

&: This is eng channel. Eng plz (reply to 82331)

Pika: someone please help me with this (reply to 82327)

Huu: Hi everyone, please help me answer this question.  I want to get the contract address from this API:  curl -X 'GET' \   'https://testnet.toncenter.com/api/v2/getTransactions?address=kQAhgoFCEOfODFnhTjfnsUE6Pl9YHL55mDH-9OeTeMei45Pj&limit=10&to_lt=0&archival=false' \   -H 'accept: application/json'  But in the response, it is not visible. Is there any way to get it?

Alfred: Should be done easily by adding another input param referral address? (reply to 82327)

Pika: Can i get some resource or demo regarding this please (reply to 82343)

Rayan: Guys, Which one of TonViewer and TonScan is better. i have a transaction, TonViewer says its failed, TonScan says its confirmed and TonCenter is like TonScan. Which one is true? and is there another explorer for Ton?

musashi: they are all correct mate (reply to 82351)

Rayan: Another question is that does Ton support batch transaction?  https://tonviewer.com/transaction/ca17464fd9e0200a8848776b36ea9ccb6b26c087bb60b2598e0f699d3169e30d this transaction looks batched, but when you search it on TonScan its one only and each of these transactions has a page for itself. can someone explain it?

Rayan: so why are they different? (reply to 82353)

musashi: actually they are multiple messages (reply to 82354)

musashi: each message can be failed or success

Rayan: Did you open the link? so those 5 transfers are called message?  so why each of them has its in or external messages too? I am new to Ton guys. If you use example each concept in EVM i understand better. (reply to 82356)

musashi: like this one, the third message failed, but other 4 messages was success

Rayan: hash of that message is successful in TonScan. (reply to 82361)

cosdy: is there a func playground？

musashi: on EVM chains, you can make external calls to other contracts, if one of them failed, the whole will be reverted, but on Ton the messages are independent and be processed parallely (reply to 82360)

cosdy: online especially

&rey: Because they define success differently. No explorer can know what user intended to do; Tonscan shows whether contract computation or action phase raised error, Tonviewer likely shows whether the operation indicated by opcode succeeded. (reply to 82355)

&rey: Those rows don't correspond one-to-one to transactions=messages. Please open Transactions tree to see list of messages. (reply to 82359)

Rayan: these rows are transactions or messages? (reply to 82368)

&rey: neither, it's just record of the changes interesting to users.  Modulo special cases, each TON transaction corresponds to one message, which it processes. So when everything is processed (no messages remaining in queues) transaction count is equal to message count. (reply to 82369)

Rayan: so this is all one transaction with few messages? (reply to 82372)

musashi: here mate (reply to 82372)

Rayan: explain please. I dont understand message and transaction concepts. what are transactions and messages on this: https://tonviewer.com/transaction/ca17464fd9e0200a8848776b36ea9ccb6b26c087bb60b2598e0f699d3169e30d

musashi: each line (A -> B), (B -> C), etc is a transaction (also a message)

Rayan: sorry, i didnt see this. (reply to 82372)

Rayan: so what is the line between? why are them connected? (reply to 82378)

musashi: the line A -> B means A sends a message to B

Diana: Hi! Is it possible to integrate tonconnect for jetton transfers?

Tom: Hello guys. Is there any way to speed up transaction confirmation on chain?

Rayan: Aha, so TonScan has a page for each of these lines while Tonviewer shows the graph? and when graph ends? its about time or if F sends message to G graph would continue? (reply to 82381)

&rey: Messages: - external to A (signed request to send a message from the wallet) - A to B, carries 0.185 TON (request to transfer jettons) - B to C, carries 0.177 TON (jetton's internal move) - C to A, carries 0.037 TON (excess TON return) - C to D, carries 0.125 TON (jetton deposit notification, carries request to perform swap) - D to E, carries 0.119 TON (Stonfi's swap request) - E to D, carries 0.054 TON (Stonfi's payout request, likely ref) - E to D, carries 0.054 TON (Stonfi's payout request) - D to F, carries 0.048 TON (request to transfer pseudo-jettons, likely ref) - D to F, carries 0.048 TON (request to transfer pseudo-jettons) - F to G, carries 0.049 TON (payout, likely ref) - F to A, carries 4.207 TON (payout) (reply to 82376)

Rayan: These values contain fees too? or just amount transfered? (reply to 82386)

&rey: Graph ends when transactions in it no longer have outgoing messages. (Tonviewer emulates whole graph ahead of time) (reply to 82385)

musashi: depends on the send mode of the message (reply to 82387)

Rayan: Thanks brothers.

МАВЛУТБУ: @MuggleLinkBot share:campaign mugglelink-pizza-day

SP: How many send mode? (reply to 82389)

musashi: search the docs mate =) (reply to 82394)

musashi: oops my messages get deleted instantly

musashi: https://docs.ton.org/develop/smart-contracts/messages

Mohammad: Hi guys What is the exact value of this transaction? https://tonviewer.com/transaction/8b13e10067e493a80a28fdd95fc720f414c1540776800892b6ed1617d9e6db9a  16257544244 or 16259921853 due to 128 in mod?

uz: Hello, guys. Can anybody help me? I am trying to upload a gif file and retrieve its file_id so as to use in my bot to send a message. How can I get the file_id?

Alfred: I don't have them. Just an idea to implement it. (reply to 82346)

NPA120: which language do you use? if python, you can use this code. `photo_file = update.message.photo[-1].get_file()     if photo_file:         photo_url = photo_file.file_id` (reply to 82410)

uz: I use golang. There should be similar code, thank you!

Buggy: Need 100 ton testnet? (reply to 82220)

Dmitriy: Hi! I’m curious how the transaction F here is marked as failed in tonviewer despite the fact that it has success: true and aborted: false ?

Dmitriy: I mean this link For some reason it doesn’t allow forwards in ths chat :\ (reply to 82376)

&rey: It's swap which cannot afford to fail transaction on blockchain level (or assets would be lost), but it has nonzero "exit" code in outgoing messages. (reply to 82418)

Dmitriy: But looking at the graph, all the messages here have 0 exit code (reply to 82421)

&rey: I mean this (reply to 82422)

Dmitriy: So this exit code isn’t a part of message layout and just kinda convention, right?

Dmitriy: I mean, it’s not a part of any standard, and tonviewer uses the exit_code field in the message to recognize the failure?

Dmitriy: I’ve noticed that I didn’t reply you in the messages above so doing it just in case so you won’t miss the answer Really want to figure out how it’s done (reply to 82423)

&rey: Yes. More precisely, Tonviewer recognizes that message conforms to Stonfi's formats and uses that to load certain bits to get exit_code. (Message isn't a JSON object, after all...) (reply to 82425)

Dmitriy: Got it, thank you  Is it applicable only for stonfi contracts (i.e. stonfi and toncenter devs agreed on it), or this exit_code convention can be applied to any other contract too? I understand that I can try it myself, but maybe it’s already known  I assume the former, but who knows (reply to 82429)

&rey: Only Tonapi developers know. (reply to 82430)

Dmitriy: Got it, thanks (reply to 82431)

Dmitriy: One more question: I see that transaction D -> F has zero forward_ton_amount but there is also F -> G which is a transfer notification Shouldn’t the forward_ton_amount be greater than 0 to make transfer_notification to be sent?

&rey: F seems to be a pseudo-jetton-wallet — TON vault with interface of a wallet. (reply to 82433)

Dmitriy: I see, thanks (reply to 82434)

&: Try with postman. it's much better (reply to 82341)

&: Cell underflow. This happens when tx payload structure is mismatching. (reply to 82255)

D: TonWhales is also possible (reply to 82351)

Nerses: is there any code snippet on how to calculate Jetton wallet address in TACT smart contract ? Thanks for help

馬特維: Hello

Ilya: Thank you. I’ll try (reply to 82049)

馬特維: Who can help with something?

馬特維: With transactions (reply to 82479)

Stephan: Hello everyone, please help me, I have a couple of questions about the storage fee. In general, what is the most important thing to know in this process? How much should the tons be left on the contract, how often is the pay for storage, what will happen to the contract if there are not enough tons, and so on. I will be very grateful to anyone who can help

Johnny Le: https://stepik.org/lesson/1011479/step/3?unit=1019340 (reply to 82483)

Stephan: Thank you (reply to 82492)

WH: Is there a way to listen to mempool using ADNL? I prefer not to use a 3rd party for that

Mohammad: Hi guys, How I can extract sendMode of a transaction with api?

AG: Looking for devs who can make telegram mini apps specifically a game, PM me if you have developed mini apps on ton

LacosteNYC: Hey, how do I get a TON chain token "verified"?

Oke: I have (reply to 82501)

spencer: this is probably a very stupid question

spencer: uh why did that delete

spencer: is there a way to deserialize cell data

spencer: to like get data is actually being stored in the cell

spencer: im using pytoniq btw if anyone's familiar

spencer: for perspective im trying to look inside a swap transaction and get information out of it like the trader, token being traded, etc

Орельан [NEVER DM FIRST]: Yes but you need to load each data piece exactly like how they were serialized in there (reply to 82536)

spencer: how do i tell how they were serialized? (reply to 82541)

spencer: sorry im a complete ton newb lol

Denis: maybe something wrong in your app? what does your app exactly doing? dex? (reply to 82273)

— 2024-07-10 —

Alexander: Hi! Can we send a request to send more than one internal message via TON Connect?

Thomas: GM! Can I send an external message to the contract with an specific TON amount attached?

&rey: Yes. Up to 4 messages; 1-3 certainly work fine. (reply to 82595)

&rey: Look at Stonfi's contracts and see how they deserialize the swap request (or at TL-B, which is more formal description of same). Look at Dedust's contracts and do same. For less known exchanges, you won't be able to parse but you won't notice many transactions at them either. (reply to 82561)

Alexander: Thanks 👍 (reply to 82602)

&rey: No, since all TON are considered to be inside blockchain; external address just doesn't have any TON to send. (reply to 82600)

SrDorki: Ey fam where can I get the template for the wallets connection?

SrDorki: Like a code pre built to call all the wallets buttons with its logos

musashi: just use the TonConnectButton component from tonconnect sdk mate (reply to 82607)

spencer: tysm (reply to 82603)

Prince: Hello everyone. GM please help me. Is there bundling function on TON chain like jito bundling on Solana?

Doug: I wanted to know how to send a repository that I got from github to me, so I can change the settings

Degen: map: map<Address, Int>;  How to determine if an address already exists before adding it?

musashi: use dict_get api mate (reply to 82626)

musashi: you can find in stdlib.fc

Degen: Can tact also use the func method?

Anton: of course (reply to 82634)

Degen: Can these be used? ?

Anton: yes, you just need to write your bindings for those: https://docs.tact-lang.org/book/functions#native-functions (reply to 82637)

Degen: Looks good.

Anton: btw, Tact covers most of those, except _replace/_replaceget functions

Kashish: Pls help me with this. How to switch to testnet network in mobile from mainnet network  in Tonkeeper wallet

Орельан [NEVER DM FIRST]: Has anyone understood why a swap sometimes needs 20 sec to be done from end to end and sometimes 2 min?

Kunikimn: maybe network lagging? (reply to 82660)

Орельан [NEVER DM FIRST]: I doubt the blockchain lags 😁 (reply to 82669)

Kunikimn: I have read the document and it said ton network is based on Catchain mechanism. So its TPS would be higher than btc or eth chain. 2 minute is out of my understanding about Ton chain. (reply to 82670)

Орельан [NEVER DM FIRST]: Can you link me to that document please? (reply to 82672)

Kunikimn: do you know Russian? the video speaker uses Russian to present. (reply to 82673)

Kunikimn: here is the document https://ton.org/catchain.pdf (reply to 82673)

Орельан [NEVER DM FIRST]: My Russian is ok for common speech but not so good for technical documents but i'll give it a try thanks 😁 (reply to 82674)

Kunikimn: I couldnt find the video source, just read the pdf, it is complete.

&rey: Do you know that swap consists of like ten transactions? (reply to 82660)

Орельан [NEVER DM FIRST]: Yeah, usually 5-6 actually (reply to 82679)

Орельан [NEVER DM FIRST]: for dedust at least

&rey: When message in a chain is cross-shard, it won't be processed until next masterchain block at least.

Орельан [NEVER DM FIRST]: Thanks for that info, that's exactly the kind of stuff i'm willing to educate myself on right now, is it also described in the catchain doc or somewhere else? (reply to 82682)

&rey: In the same doc where sharding is described. tblkch.pdf, maybe, I don't remember. (reply to 82685)

Zccen: @AntonTrunov Hello admin! When i use @tonconnect/sdk in server, Why does this error occur after running for a period of time: [TON_CONNECT_SDK] Gateway is already opened, closing previous gateway [TON_CONNECT_SDK] Gateway is already opened, closing previous gateway [TON_CONNECT_SDK] Bridge reconnecting, 5000ms delay [TON_CONNECT_SDK] Bridge reconnecting, 5000ms delay [TON_CONNECT_SDK] Bridge reconnecting, 5000ms delay

Zccen: When the number of connections reaches several hundred, it is easy to encounter

Rayan: Guys, is there any hash for a batch of transactions on Ton or each transaction has its hash and there there no hash for the batch? I mean something like this: https://tonviewer.com/transaction/394a92487944fe99b2125e04ee32bda6bd86a709672f6fd1512acae0025b39fa

Cat: Hi! Could you please tell me if I can change the value in the structure? Because I think I've seen such examples in the documentation, but I get the following error when I try to do it. Syntax error: expected ";", ".", "!!", "%", "/", "*", ">>", "<<", "-", "+", "==", "!=", "<=", "<", ">=", ">", "^", "&", "&&", "|", "?", or "||" Line 290, col 31:   289 | > 290 |         self.round!!.endPrice = msg.endPrice;                                       ^   291 |     }   struct A {     field1: Int as uint256;     field2: Int as uint64;     field3: Int? as uint64; }  contract TestContract {      a: A?;      receive(msg: SomeMsg) {         self.a!!.field3 = msg.someField;     }  }

Alfred: use self.a = A{...} (reply to 82700)

Alfred: If you click on the Transaction tree, you can see each transaction has it's own hash. (reply to 82698)

Cat: Got it, thanks! (reply to 82705)

Rayan: i know, but there is no id or hash for transaction tree itself? (reply to 82706)

Alfred: Nope. I think the first transaction should be.

Rayan: Thanks!

Alfred: I think they are linked together by the outboundMessage

W. [Разработка сайтов]: double-click on the logo (reply to 82654)

&rey: Pull request to https://github.com/tonkeeper/ton-assets/. It will be reviewed... some time, I guess. (reply to 82717)

....: Thank you 💕 (reply to 82718)

Tom K: Hello, How can I fetch wallet's staked TON on a "Single Nominator Pool" ? Which contracts and methods should I interact with?

Degen: In the process of nft mint, how to limit each wallet to mint a fixed amount

Thomas: I got the exitCode 37 (Not enough TON) with this code, but the debug log return the balance amount is larger than the amount I reserved. Anyone can explain for me why?   log:   console.log     #DEBUG#: s0 = 1998005600     #DEBUG#: s0 = 1997876000

Tim: You send more later (reply to 82724)

....: I think that's enough, right? (reply to 82718)

Thomas: what do you mean? 🤔 can you explain more details? (reply to 82727)

Tim: You send message later (reply to 82729)

Thomas: I'm sending an internal message, and the code above I cap from recv_internal() func (reply to 82730)

Thomas: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {  my_balance and msg_value just the parameters

AA DAN: @TheR0cketBoy15 is your spot

AA DAN: How to retrieve my minted nft

Long: Hi, in javascript how can we read a storeSlice() in func?

Long: Dont see any loadSlice() in ton/core?

Anton: just remove the !! (reply to 82700)

&rey: .loadBits(). You must know size beforehand, of course. (reply to 82737)

Nerses: is there any code snippet in TACT how to calculate Jetton wallet address ? thanks for any help

&rey: That exit code is not caused by raw_reserve, instead there is some part of code you have not shown which is responsible. (reply to 82731)

Thomas: Everything is fine if I comment the raw_reserve() line. About what I'm doing here: I want to deduct a specific amount of TON when calling to my SC with internal message (reply to 82741)

&rey: What messages do you send (value, mode)? Do you send them before or after raw_reserve()? (reply to 82742)

Thomas: I send from another contract by send_raw_message, with mode 128+1 the raw_reserve on the destination contract (reply to 82743)

Adam: im trying to use a wallet from https://wallet.ton.org/?testnet=true on testnet but for some reason it doesnt seem to work? balance returns 0 even though it is 5, seed phrase is 100% correct

Thomas: import { getHttpEndpoint } from "@orbs-network/ton-access"; ... const endpoint = await getHttpEndpoint({ network: "testnet" });  use this (reply to 82746)

Tim: Do not use orbs, it’s very unstable (reply to 82747)

Ruslan: As far as I know, wallet.ton.org uses wallet version v3r2 instead of v4. Try v3r2 and v3r1 versions (reply to 82746)

Ruslan: From tonstat.us it follows, that last couple months Orbs became much more stable, than they were before) (reply to 82748)

Adam: v3r2 worked thanks

WinK: How to verify Tact contract on ton verifier? There only option to verify FunC contract

WinK: Pls help guys (reply to 82755)

Nerses: i get this error  346 | fun packJettonWalletData(balance: Int, ownerAddress: Slice, jettonMasterAddress: Slice, jettonWalletCode: Cell): Cell { > 347 |    return  begin_cell()                    ^~~~~~~~~~~~   348 |             .store_coins(balance)   althoght I have this line in the contract import "@stdlib/deploy";  What can cause such error ?

musashi: are you sure it's begin_cell() instead of beginCell()? (reply to 82760)

Nerses: yeah you are right.I corrected now works (reply to 82763)

Volunteer🇻: I want to use @ tonconnect/ui for ton transfer. I wrote it exactly according to the document, but always send it and immediately transfer it to my own address. Can someone help me

&rey: Make unbounceable user-friendly address out of "0:edcd...". (reply to 82769)

Robbie: can someone give an example of the params of hash and LT to use for this endpoint?  https://testnet.toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get  can't seem to get this endpoint to work

Nerses: what method should i use to store dict in TACT ?

dexter.eth: Hi guys

Kochō: Hello there Elsa Drought 🦋 (reply to 82778)

Nerses: return begin_cell() .store_uint(0, 2) .store_dict(jetton_wallet_code) .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))  store_uint(0, 1) end_cell();  } why in this func code is written `store_dict(jetton_wallet_code)` although `jetton_wallet_code has type Cell` ?

&rey: More common way is to write it as begin_cell().store_uint(6, 5).store_ref(jetton_wallet_code).store_ref(...data).end_cell(), but those ways are equivalent.  store_dict is same as store_maybe_ref — adds single 1 bit and a reference. (reply to 82786)

&: HI does tonconnect can do signing msg?

Nerses: Type "Builder" does not have a function named "storeMaybeRef (reply to 82789)

Nerses: I got that error

&rey: No it can't. (reply to 82791)

Prince: then what is the solution?

Donn: hi does anyone use toncenter api sendboc to broadcast transaction? i have a question, why i cannot send 2 transaction within short time, looks like i must wait for about 3-7 sec. after first shot.

AA DAN: Anybody can help me to retrieve my minted nft

&rey: Topic of seqno replay protection is well described in this chat, if not in docs. (reply to 82797)

Mohammad: Hey guys hope you all are doing well. I wanted to know how many entities can I have in dictionary of address(256bit)->coins? Where can I find variable and storage limitations?

&rey: In documentation, I think. https://docs.ton.org/develop/func/dictionaries (reply to 82801)

Donn: ok thanks for the keyword, let me dive in. (reply to 82800)

Taiwo Samson: Hello everyone   Please reach out to me if you are in need of a UI/UX designer.  Thank you.

Rayan: guys what does this mean in tx info? "type": "ord"  i also see type: Internal and external? which one is more relevant in Ton society for tx type? and internal means just Ton transfer and external means smart contract call, right?

&rey: No. External message is one sent from outside of blockchain, paid by contract's funds. Internal is most common. (reply to 82822)

Rayan: is every message that has out_msgs, external? is this true? (reply to 82823)

musashi: external - message from outside of the blockchain internal - message from contract to contract (inside the blockchain) (reply to 82824)

musashi: out_msgs means the messages sent from that contract to other contracts and still internal messages

Rayan: how can i find out that a transaction is external or not with this kind of transaction receipt?  https://t.me/tondev_eng/82134 (reply to 82827)

Rayan: why Ton concepts are so different!!!

&rey: Because TON was designed in a different way. (reply to 82830)

&rey: o.transactions[0].in_msg.source != null internal. (reply to 82829)

Rayan: this means external or internal? (reply to 82832)

Rayan: thanks

Marvin: 🙋‍♂

Rayan: Another dumb quesion. Token Transfer between 2 wallets can be both of external and internal type?

&rey: No, fees for transfer itself must be paid in TON. Actually it consists of 3-5 transactions, first of which is external at sender's wallet and all other are internals. (reply to 82836)

musashi: any messages from contracts to contracts are internal messages the message that you (an external entity from the blockchain perspective) send to your wallet contract is external (reply to 82836)

Carter🧹: Question about TL-B Merkle Update.  In the Exotic Cells section, it says that MerkelUpdate has 0x04 as the initial byte:  {  ....   Merkle Proof: 3,   Merkle Update: 4 }  However, in block.tlb, loading a TLB of MERKLE_UPDATE requires a  #02 discriminator. This of course never matches, what have I misunderstood here?  !merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256   old:^X new:^X = MERKLE_UPDATE X;  Loading BlockInfo, I am able to ignore 0x04 and it will start to load the ShardState, but want to check if this is just a bad definition in the block.tlb or I have something wrong?

Rayan: am i not just a wallet? what does i means? i think i am just a wallet inside blockchain. how am i outside of it?   i read ton docs but i did not find any information about these concepts. (reply to 82839)

Carter🧹: You are an unknown entity outside of the chain, sending an External Message to your Wallet, the wallet will then call other contracts through an Internal Message.  The TON video tutorial goes over these concepts. (reply to 82841)

mohsen: Hi. I created a new wallet and deposited 1 USDT into it and then deposited some TON into it but it got bounced. It does not accept TON addresses now. What happened to this wallet?

Anthony: Hey, I want to make a deeplink for a referral system in my mini app, is there any tips on how to do it?

Rayan: i send messages from tonkeeper which is a wallet. isn't this true? and can you please send the video link? (reply to 82843)

Carter🧹: https://stepik.org/course/176754/syllabus (reply to 82846)

&rey: Bad definition somewhere. I'm not sure which is correct. (reply to 82840)

Rayan: its english or russian? (reply to 82847)

Carter🧹: Super, I thought I was missing a concept. I'll go with 0x04 as a MERKLE_UPDATE TLB discriminator, as I can begin to load this state and get valid data out. I'm failing at the Hashmaps but wanted to check it wasn't because I had pruned branches or something like that. I can pull SeqNo etc out from this CEll. (reply to 82848)

Carter🧹: Both just read it (reply to 82849)

&rey: Using unbounceable address (starting with UQ..) should still work. (reply to 82844)

mohsen: Isn't it risky to use it? (reply to 82854)

&rey: No, there is still checksum in address. (reply to 82855)

mohsen: Why does this happen to this wallet? What is the reason? (reply to 82854)

&rey: If wallet is not deployed and you use EQ.. address, then that should happen. (reply to 82858)

mohsen: This is what happens. But what is the reason for this? (reply to 82859)

&rey: The reason is that deposit transaction fails since contract is not initialized. Blockchain doesn't know if <that unknown address> was supposed to be wallet, custom smart contract or whatever. (reply to 82860)

Rayan: have TonCenter any limit for calls. what about TonWhales?

Eibrahim: Smart contract om which chain (reply to 81650)

Eibrahim: Would love to contribute to this (reply to 81893)

RUN: On ton chain (reply to 82874)

Muhammad: Hey, I am a developer working on untiy ton connect sdk and using tonkeeper, so i want to integrate smart contract and NFT how can i do that, your support will be appreciated.  thanks!

Amir: hi there im using dedust pools for my application but recently dedust api keep crashing is there any way or any other api to get dedust pools ?

Nerses: could you please say is this code version correct ? fun calculateJettonWalletStateInit(balance: Int, ownerAddress: Slice, jettonMasterAddress: Slice, jettonWalletCode: Cell): Cell{       return beginCell()                     .storeUint(0, 2)           .storeRef(jettonWalletCode)           .storeRef(packJettonWalletData(0, ownerAddress, jettonMasterAddress, jettonWalletCode))           .storeUint(0, 1)          .endCell(); } (reply to 82789)

Think: Has all the competitions finished

Rayan: Guys, which one of these is total fee of tx? and how can i find transaction memo or comment? (reply to 82134)

Nerses: how to write this func code in TACT .store_int(workchain(), 8)                      .store_uint(cell_hash(state_init), 256)   ?

L (😇,🪽): can i install multiple lite server on 1 PC ?

Nerses: please can anyone check this code snippet if it is correctly written to calculate smart contracts Jetton wallet address in TACT ?https://gist.github.com/nerses-asaturyan/bba08a545d001717737fbfb00a602bb4

Abdulaziz: @co_durov check DM

beck_: Can somebody from the admin/team help me with these Qs here;  Few have already replied but few new others too;  1. In how much time duration staking rewards are distributed to the validator? Is it based on a validation round? If so, how long in the validation round period?  2. If Redstone isn't the only Oracle used for TON, why there's no details about other Oracle in TON docs?   3. Is dynamic sharding just integration on core TON blockchain architecture or using dynamic sharding other protocol could also be build on top of TON? (reply to 80966)

Abdulaziz: Is telegram webapps supports sounds? I wanna create a dapp like notcoin, but with sounds

Davo: Hello

Davo: Hello. I've been racking my brain but can't figure this out... I have deployed a jetton contract with off-chain content. It's an IPFS uri. Tonscan recognizes the content fine EQBOYDDpytUpWKkdU3QFY5wlPcipDX4QjQ1k9dG29Xb8_Zr8 but tonviewer doesn't and instead shows "Unknown Token" with placeholder metadata.

Davo: I would appreciate someone's help. I must've done something wrong though the content is simply a ref to a cell that has 0x01 as the first 8 bits, then an ascii-encoded URI string.

Illia: What's algorithm used for hashing cells and slices?  HASHCU & HASHSU  Is it not sha256 as for SHA256U by default?

R: Hey guys, I was reading about Workchain's documentation. I noticed that it can be quite expensive 💸 and requires 2/3 of votes from validators. I have a few questions about workchains. For example, is the foundation currently seeking new workchains? ... I want to have a better understanding of ecosystem and roadmap. 🗺

oluwatobi: Scammer (reply to 82893)

Nerses: can I calculate Jetton contract code having only master Jetton contract address ?

Adam: using the js sdk, how can i find all jettons owned by an address?

&rey: Using which SDK, actually? You have to query tonapi.io or dton.io/graphql, and neither of these requires SDK. (reply to 82939)

Adam: the official from @ton-core

Adam: but there must be a way to do it directly on the blockchain as well no? (reply to 82940)

&rey: Blockchain doesn't store "all jettons owned by an address" in single place so it's resource-intensive. (reply to 82942)

Adam: i know but im just asking for whatever the method is, these services must be getting data directly from the blockchain no? (reply to 82943)

Rayan: can someone help? (reply to 82898)

Agent B: what are my options for real time events over websocket?

Pegu: Does anyone know how to decode this transaction?  I know how to get query id, proof but not sure how to get the amount variable  i tried to load asset as ref and then amount as coins but amount is 0

&rey: The thing that allows to do complex requests is called "indexer". (reply to 82948)

&rey: Do you have TL-B of transaction? If it can be found, that's generally inside contract which processed the message. (reply to 82952)

Pegu: Unfortunately not, its one of the transaction that occur in between transactions (reply to 82965)

Dmitriy: Hi!  Is it right that the first element of parse_std_addr(my_address()) may be different depending on the shardchain at which the contract is located at the moment?  If so, is it right that it’s better to use the second element of tuple returned by parse_std_addr i.e. account_id ?

&rey: 1. No. 2. What? (reply to 82983)

Dmitriy: The 2nd question was implied by the fact that the answer on the 1st one is yes, but it seems that it’s no longer relevant  I mean, if the workchain_id is variable thing, it’s better to use the constant part to compare the addresses (e.g. compare if the message sender is a contract admin, etc.) (reply to 82984)

Dmitriy: Thank you, btw!

🦋lala🎀: Which digital wallet app should I use? To transfer coins to Telegram wallet

🦋lala🎀: I chose usdt coin and ton network by transferring via link address. But cannot transfer into wallet account.

Valamar.$888: Hi guys can anyone provide me with a smart contract attack especially re entrance attacks

Амир: Read more about differences between tvm and evm (reply to 83002)

Valamar.$888: Ou.i bet I know the difference can't re entrance attacks be possible on Tron (reply to 83007)

Амир: Yes, Bitcoin chain is a little bit different from it (reply to 83008)

Valamar.$888: Why you putting bitcoin here when we talking about Ethereum and The Open Network (reply to 83009)

Ryan: As TVM (TON Virtual Machine) is Asynchronous, such attack is basically impossible to happen (reply to 83002)

Ryan: Messages are sent after the computation phase, and we don't know when it will arrive

Valamar.$888: Ah . Thanks Ryan (reply to 83012)

Mileta: /+

Peng: Hais anyone deployed ton nodes via docker?  Can i check out ur dockefile for reference

— 2024-07-11 —

Victor: Yes.... Would really appreciate (reply to 82416)

river: Hi Is there any tg bot that makes only token holders to get into the group chat? Like discord bot!

Kunikimn: how could the bot check if anonymous user holds the valid tokens😃 (reply to 83033)

Kunikimn: hello, does someone have the experience working for a web3 company romotely？Is that possible to find a remote job on Ton job channel？ Appteciate your reply in advance！

Kunikimn: I hold enough passion towards Ton network and I really want to devote myself into it.

Prince: but not here... (reply to 83040)

Kunikimn: ok, I got u

feng: How to deploy a set of private ton api services?

Johnny Le: can use this logic: use a bot checker to check if the user holder via a middle contract - only owner wallet can use a function, when call will return amount an a proof code. Then use code to parse into the bot, bot will verify and send user the invite link to grp (reply to 83039)

meomeocoj | Mike: hi guy how to send a multiple message to TOn

WinK: How Notcoin allows users to claim their NOT onchain that is stored in the backend.  What is the process?

Abdulaziz: Why I can't know how this address received airdr*p from notcoin

Abdulaziz: It's an notcoin airdrоp address, right?

芭比Q: how can i get holder address from jetton wallet?

11: Hi guys, how to use ~dump to print slice address?

charlie: Hi team, could u share an nominator pool to stake on testnet?

charlie: in addition, how can I get 10K+ Ton on testnet one time LOL (reply to 83095)

Degen: Unit testing, won't this error be thrown?

Degen: Why is the transaction array empty? How to catch require errors to verify logic

Sammy: Hi all. Due to weak hosting, my bot stopped working due to too many users. If I pay to upgrade my hosting now, will it automatically upgrade to a different one or will I need to move the code as well? If there are specialists, I will pay well

Minh: SELECT     * FROM logs WHERE block_timestamp >= NOW() - INTERVAL '10 DAY' AND      ( -- Uniswap V2 and similar         topics[1] = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'      ) OR ( -- Uniswap V3         topics[1] = '0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde'     ) OR ( -- SushiSwap         topics[1] = '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c4225871ce91223576ff6'      )  ORDER BY block_timestamp DESC     LIMIT 10

Nerses: my smart contract written in TACT is compiled correctly without any error but during deployment it stucks.What can be the problem ?

0xbera: Hello! How does one obtain the hash for a transfer message?

Anton: check the corresponding to your contract .abi file, it should contain all your exit codes and require essentially throws an exit code which is a derivative of the hash of the error string (reply to 83101)

meomeocoj | Mike: hi how i can send multiple message in 1 seqno in TON. ?

ry4n: How to change metadata on Tonviewer?

Harsitha: Hey, who knows any Market Makers?

Smart: In a TON contract, if I retrieve the contract's data using tonClient.getContractState(contractAddress) and the data is stored in a cell like this: begin_cell()     .store_slice(a)     .store_ref(b)     .store_dict(c) .end_cell();  I can directly access a, and how can I directly access c to iterate through this dictionary?

Thomas: What oracle service/solution do you use?  I want to get the TON/USD price onchain and offchain but I cannot get the idea with Redstone and Ticton docs. Anyone have experience can help me?

Kenny$$Shillz: You can use highload wallet to send multiple msgs (reply to 83062)

Kenny$$Shillz: The owner address is contain in the wallet data (reply to 83086)

Kenny$$Shillz: Looooool (reply to 83096)

Kenny$$Shillz: Likely need to increase ton amount (reply to 83114)

&: To change metadata u should build tx yourself. (reply to 83123)

ry4n: Launched two weeks ago, need to request a logo change (reply to 83139)

Think: I'm trying to work with you guys but keep getting banned 🚫 why is this so sensitive it's not great I'm trying so hard to enter competitions and then keep up... With future progress

meomeocoj | Mike: can you give me an example in typescript or javascript (reply to 83134)

&: There's various version of highload wallet contract. I have build a bulk NFT buy/sell bot recently. with highload wallet v2 This can buy 200+ NFT at one time. (reply to 83134)

Smart: I have a question about TON contracts. If I can directly get the real-time data through the contract address using getState, what is the significance of writing get methods?

Nerses: Can this code be used to calculate Jetton wallet address ? fun packJettonWalletData(balance: Int, ownerAddress: Slice, jettonMasterAddress: Slice, jettonWalletCode: Cell): Cell {    return  beginCell()             .storeCoins(balance)             .storeSlice(ownerAddress)             .storeSlice(jettonMasterAddress)             .storeRef(jettonWalletCode)            .endCell(); }  fun calculateJettonWalletStateInit(balance: Int, ownerAddress: Slice, jettonMasterAddress: Slice, jettonWalletCode: Cell): Cell{       return beginCell()                     .storeUint(0, 2)           .storeRef(jettonWalletCode)           .storeRef(packJettonWalletData(0, ownerAddress, jettonMasterAddress, jettonWalletCode))           .storeUint(0, 1)          .endCell(); }  fun calculateJettonWalletAddress( stateInit: Cell): Slice{       return beginCell().storeUint(4, 3)                      .storeInt(0, 8)                      .storeUint(stateInit.hash(), 256)                      .endCell()                      .beginParse(); }  fun calculateUserJettonWalletAddress(ownerAddress: Slice, jettonMasterAddress: Slice, jettonWalletCode: Cell): Slice{   return calculateJettonWalletAddress(calculateJettonWalletStateInit(0,ownerAddress, jettonMasterAddress, jettonWalletCode)); }

musashi: yes (reply to 83154)

Nerses: thanks a lot.One more question can i get jetton code just having jetton master address ? (reply to 83155)

musashi: the same idea as you providing GET APIs for your centralized database (reply to 83147)

musashi: yes, call the get_jetton_data method if that jetton contract follow TEP74 (reply to 83157)

musashi: async getJettonData(provider: ContractProvider) {         let res = await provider.get('get_jetton_data', []);         let totalSupply = res.stack.readBigNumber();         let mintable = res.stack.readBoolean();         let adminAddress = res.stack.readAddress();         let content = res.stack.readCell();         let walletCode = res.stack.readCell();         return {             totalSupply,             mintable,             adminAddress,             content,             walletCode         };     }

Nerses: i want to do that in TACT smart contract.is it possible ? (reply to 83159)

musashi: I don't know much about Tact

musashi: but it's possible

Nerses: Thanks a lot (reply to 83162)

musashi: I wonder to know why people learn Tact instead of jump directly into FunC - the 'main' language with rich documentation and bigger community =)

musashi: it's a bit difficult at first but I think FunC holds the idea of Ton sharding

Nerses: For example I choose Tact as I am new in this field and it is much more easy to write code in tact than func.although after 2 months func is also ok (reply to 83166)

musashi: and then you spend more time to ask question and fixing bugs =) (reply to 83168)

Nerses: I think it will not depend on language (reply to 83169)

0xbera: How do I get the tmestamp at which a block was merged to the chain?  I have this data to work with

0xbera: also, are there different commitment levels like in ethereum? or should a block be regarded as finalized as soon as it is merged?

&: Check tonapi.io That will be enough (reply to 83171)

Vladimir: how can I create a link to receive custom Jetton (usdt or similar)?  I want to receive payments for my telegram bot in my own jetton (not TON)  I dont see any option to set the Jetton address

Vladimir: can I create similar button in my telegram bot to accept Jetton payments?

Vin: Hello. When I run "npx blueprint run", I got an error: Unable to execute get method. Got exit_code: 11  Am I do something mistake?

&rey: Block is final as soon as it is signed by 2/3 validators, though it is considered to be in blockchain once it is in a signed masterchain block. Generally, you can't obtain blocks that are not included in blockchain yet. (reply to 83171)

&rey: You can (at https://github.com/tonkeeper/wallet-api#unauthenticated-jetton-transfer), but some options do not work there. (reply to 83180)

Vladimir: wow! (reply to 83186)

&rey: If you use TON Connect 2 or @ton/ton, SDKs already support this — just pass multiple messages in array to be sent. (reply to 83118)

meomeocoj | Mike: i want use it to relaying messages in backend (reply to 83188)

&rey: You need to load all data of a first, then load b reference, and only then you can check c. (reply to 83128)

Vin: Can anyone help? (reply to 83184)

musashi: exit code 11 means the get method was not found mate (reply to 83184)

musashi: did you call the right get method in your wrapper?

Bianca 🍅: I got same error like you (reply to 83184)

Bianca 🍅: I'm using getCounter as explained in tonhelloworld tutorial (reply to 83196)

musashi: show me your getCounter code mate (reply to 83202)

Bianca 🍅: async getCounter(provider: ContractProvider) {     const { stack } = await provider.get("counter", []);     return stack.readBigNumber();   } (reply to 83203)

musashi: now show me the 'counter' method in your contract code mate (reply to 83204)

Bianca 🍅: #include "imports/stdlib.fc";  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {  } (reply to 83205)

musashi: what is this mate =), show me the counter function which you called in your getCounter method above (reply to 83208)

musashi: is this the code you followed from tonhelloworld?

Vladimir: is anything wrong with my link? I cannot open it on my laptop telegram neither in mobile app 😞 (reply to 83186)

Dinesh: What's this

Dinesh: Help me

&rey: Tonkeeper is wrong, it wants link using their own domain. (reply to 83214)

&rey: What's what? (reply to 83216)

Dinesh: I don't know about this group

Vladimir: what do you mean? I want to use Telegram Wallet (reply to 83219)

Dinesh: Just I join now

Andrey: Hey everyone, we (@dtontech) released a pretty cool update that allows you to make custom queries for TON transactions and accounts. Complex filters, aggregations.   On top of that you can make very interesting applications, analytics, etc.   Read more here: https://t.me/dtontech/905/929

Dinesh: TON?? Explain

&rey: This is group for developers of smart contracts on TON blockchain. Basic information can be found in "overview" on docs.ton.org. (reply to 83222)

Dinesh: Ton how to earn money from ton

&rey: 1. Videos: https://www.youtube.com/@WikiMar 2. Earning examples: completing bounties, creating new projects, participating in contests. (reply to 83228)

Beroo: Hello, you transferred NFT to me Bianis and did not reach me why?

Kunikimn: I build up a telebot that can help search groups about movies, how could I import advertisememts to earn some profit？ (reply to 83231)

&rey: I don't know. Actually this seems offtop for the chat. (reply to 83235)

Kunikimn: okay, let me ask in another way. is that possible to connect telebot with ton network？

Kunikimn: someone might sponse my bot just like that on github. how could I accept ton coins from my sponsors automatically？

charlie: Hi @combot

&rey: Create TON wallet. Provide its address in the bot. (reply to 83238)

Kunikimn: thanks (reply to 83240)

oluwatobi: He's a scammer (reply to 83244)

Beroo: Hello

charlie: Hi admin, could u faucet me 200 ton on testnet? on my side need to test stake in nomination pool. thanks a lot

Bianca 🍅: Yups. Thats the code i followed from tonhelloworld (reply to 83213)

musashi: how did you run the script mate? (reply to 83249)

Bianca 🍅: I run npx blueprint run in project folder using mnemonic

musashi: show me your terminal mate (reply to 83251)

musashi: maybe this could work  npx blueprint run getCounter --testnet --mnemonic

Bianca 🍅: I have followed you, but still got same error (reply to 83254)

Bianca 🍅: Am I put the wrong contract address or else?

cfs chef: how to parse my op core to this value

Taiwo Samson: Hello everyone   Please reach out to me if you are in need of a UI/UX designer.  Thank you.

musashi: it's exit code 13 not 11 (reply to 83257)

musashi: send me your contract address mate

Bianca 🍅: Here is the contract address EQATTIt6isp18EdW5kFjmZUREBMMNXVJPgzP0h1XKBrAmNcJ (reply to 83263)

Bianca 🍅: I have requested the TON testnet to the contract address, but still got a -13 error code

Frank: Looking for opinion. C# compiler for TON smart contracts. Interesting or not, and if so, what use cases/project types?

musashi: no need for that (reply to 83267)

musashi: did you update the counter variable? (reply to 83266)

0xbera: I need to do some experiments on TON I.e. fire batches of 20-30 transactions/transfers in a second and measure timing/landing rates etc.   What RPC node/provider should I use? Any suggestions?

Memes Mask: Hi, I have a similar situation, did you solve it? (reply to 74382)

musashi: try increase the amount of ton, 0.05 instead of 0.02 mate (reply to 74386)

adag1o: what's good

Adam: is there anything i can do to make my transactions land faster?

Buggy: Okay (reply to 83029)

Buggy: Which project? (reply to 83247)

Орельан [NEVER DM FIRST]: That aint a github link (reply to 83317)

Nguyen: Hi everyone, I am implementing tonconnect/sdk to connect my webapp. I create a bot and link my webapp. But when I connect in webapp tele, Telegram wallet override my webapp and I can not back to my webapp? How can I solve it

Rust: Issue Summary: Error Parsing BOC Data with Unknown Magic Prefix Context:  I am attempting to deploy a Jetton Minter contract using the blueprint tool. The compiled JSON files for the JettonWallet and JettonMinter are located in the build directory. The deployment script (deployJettonMinter.ts) is being run from the scripts directory. Despite following the setup steps, I am encountering an error during the execution.  Steps Taken:  Compiled the Jetton Wallet and Jetton Minter contracts, resulting in the following JSON files:  JettonWallet.compiled.json JettonMinter.compiled.json Created a deployment script (deployJettonMinter.ts) with the following structure:  typescript 复制代码 import walletHex from "../build/JettonWallet.compiled.json"; import minterHex from "../build/JettonMinter.compiled.json"; import { sha256 } from "ton-crypto"; // Renamed the imported sha256 import BN from "bn.js"; import { Address } from "ton-x/node_modules/ton/dist/address/Address"; // Corrected import path and order import { beginDict } from "ton-x/node_modules/ton/dist/boc/DictBuilder"; import { beginCell } from "ton-x/node_modules/ton/dist/boc/Builder"; import { Slice } from "ton-x/node_modules/ton/dist/boc/Slice"; import { Cell } from "ton-x/node_modules/ton/dist/boc/Cell"; import { WalletContract } from "ton-x/node_modules/ton/dist/contracts/WalletContract";  export const JETTON_WALLET_CODE = Cell.fromBoc(Buffer.from(walletHex.hex, 'base64'))[0]; export const JETTON_MINTER_CODE = Cell.fromBoc(Buffer.from(minterHex.hex, 'base64'))[0]; Ran the deployment script using:  sh 复制代码 npx blueprint run deployJettonMinter Error Encountered:  The following error is thrown during the execution of the script:  less 复制代码 Error parsing BOC data: Error: Unknown magic prefix     at parseBocHeader (path_to_ton/dist/boc/boc.js:138:15)     at deserializeBoc (path_to_ton/dist/boc/boc.js:242:20)     at Function.fromBoc (path_to_ton/dist/boc/Cell.js:20:41)     at Object.<anonymous> (path_to_scripts/deployJettonMinter.ts:32:28)     at Module._compile (node:internal/modules/cjs/loader:1358:14)     at Module.m._compile (node_modules/ts-node/src/index.ts:1618:23)     at Module._extensions..js (node:internal/modules/cjs/loader:1416:10)     at Object.require.extensions.<computed> [as .ts] (node_modules/ts-node/src/index.ts:1621:12)     at Module.load (node:internal/modules/cjs/loader:1208:32)     at Function.Module._load (node:internal/modules/cjs/loader:1024:12) Details:  The walletHex and minterHex objects are correctly imported and contain the expected hash and hex values. The Cell.fromBoc function is used to parse these hex values into Cell objects. The script fails with an "Unknown magic prefix" error when attempting to parse the BOC data. Request for Assistance:  I need help understanding why this error occurs and how to resolve it. Specifically:  Is there an issue with how the hex data is being converted into Buffer and then parsed? Are there any known issues or additional steps required for the blueprint tool or the ton library? Any guidance or solutions from the community would be greatly appreciated.  I hope this summary helps. If you need further clarification or adjustments, please let me know.

Rust: I've been working on this for a long time and I still have no clue of a solution.

zver7777: hello

zver7777: has anyone played tetris?

Freed: Like everyone?

Freed: Do you want tetris multiplayer game battle royale with nft and token drops?

&rey: walletHex.hex is hexadecimal encoding of bytecode, not base64. You need to modify second argument of Buffer.from. By the way, ton-crypto is not the recommended module. You should use @ton/crypto instead. (reply to 83327)

Mohan: Hey, Ton Blockchain support which languages to write smart contracts? 1. tell all possible languages that supports in ton blockchain 2. And what's the path to write 1st smart contract in TON blockchain

Rust: thank u (reply to 83339)

Ryan: You can write Smart contract in FunC or Tact.  The path is to learn one of them 😅 (reply to 83341)

Ryan: You can use this course https://stepik.org/course/176754 to learn about FunC

Mohan: Thank you, it helps. And also 1. Python not work? 2. What are the best platforms to learn these? (reply to 83343)

Mohan: Thank you (reply to 83344)

Ryan: No Python. You will use exclusively use Typescript to write scripts and tests and FunC or Tact for Smart Contracts.  You can Learn about it in the link that I've posted (reply to 83345)

Mohan: That helps, thank you

&rey: Python can be used for backend interaction with blockchain. It's quite more safe than TS in that regard, if you use libraries correctly. (reply to 83345)

Abdulaziz: How about javascript or php?  Mainly php (reply to 83358)

Abdulaziz: Can i write smart contracts which works with ton blockchain on PHP, or js

&rey: No. Smart contracts are inside blockchain in form of TVM bytecode.

Abdulaziz: If i wanna do mass airdrоp of tokens like notcoin did, php or javascript can help me? (reply to 83364)

&rey: Yes they can, but it is better to use Typescript instead of Javascript (because wrappers are commonly written in @ton/ton). (reply to 83367)

Abdulaziz: I see the airdrоp address, it has enough ton and tokens, there is 3 addresses of notcoin

Abdulaziz: Over than 250 transactions for a minute (reply to 83370)

Stepan: Hi! Who knows how to get seqno of sender wallet on smart contract?

&rey: It is impossible. In particular, sender might be not a wallet. (reply to 83372)

Stepan: How can I ensure replay protection in this case? (reply to 83374)

&rey: Why do you need replay protection in a contract? Some privileges that must be granted only once? (reply to 83375)

Stepan: I need to write selfmintable nft contract. I want to check permissions by signature (check_data_signature), but i don't know how to protect from replays in this case (reply to 83376)

Abdulaziz: I have just 100 GB hosting with php and javascript support, without python, also without react, also i have domain name. I wanna know is that enough to create webapp like notcoin and do airdrоps? I mean for starting the project, i will upgrade my servers when i start earning with my project (reply to 83369)

Stepan: what would you do in this case? (reply to 83376)

Sammy: Guys, i have created my own project Tap2Earn game: @TapMBoys_Bot | @TapMBoys  Project written in PHP. Today i have faced with more bugs. My developer can't fix these bugs due to more problems.  We need support developers for our project. Because we investing more finance for growing up it.  If you professional in PHP. Please DM me. Let's to grow this project. Thank you all!

&rey: Sign NFT data and index so that only one NFT could be minted. (reply to 83380)

Stepan: I removed index from mint msg, because it can expire so fast (reply to 83382)

&rey: You can make collection non-sequential and use atomic counter for NFT index on backend. (reply to 83385)

Stepan: But what if two wallets will try to mint it in parallel? I think one of them will not be able to do it (reply to 83386)

Web3Virtual_assistant 🦴: Guys if you need a personal assistant to help you out in any form  I'd be happy to assist if you reach out!!

Zee~ttah: DMS locked (reply to 83388)

&rey: They won't interfere, since they'd have different NFT indices. (reply to 83387)

Stepan: Yes, but I can't know it in advance (reply to 83399)

programmer: bro should i replace my secret key with keyPair.secretKey ? (reply to 8978)

programmer: Bro did you succeed ? (reply to 8976)

Freed: bro cooked for 2 years (reply to 83415)

User<6447148679>: Yo

Kochō: Hello there, Sunrise 🦋 (reply to 83417)

User<6447148679>: Hey how are you doing Looking to connect with Dev 😊 (reply to 83418)

programmer: I was on this section from morning until tonight  I developed Solana but i confused here😕 (reply to 83416)

Freed: Do you want to develop cutting edge decentralized jetton based door simulator? (reply to 83419)

User<6447148679>: No 😂 just a Job Hunter (reply to 83422)

Kochō: I'm quite ok  That's quite lovely, I wish you the best 🦋 (reply to 83419)

Svein: Whats the total tokens launched on ton ?

— 2024-07-12 —

prodvd: Great.  I am not familiar with PHP, but Javascript. Almost the dapps, webapps, platforms are built with Javascript and it is much more comfortable and good to develop with its great community and ecosystem.  I can help you if you need a Javascript and blockchain engineer. (reply to 83381)

User<7192644220>: Hi, Experts! I am making swap on TON. how can I detect when the swap transaction is done successfully after confirm swap in wallet? I want to show client a notification if swap is finished.

charlie: https://testnet.tonscan.org/address/Ef_OA_OWb2e8-Chkr7HVVVW0EOW8T_93F2Mkz529h9aNnO54 (reply to 83308)

charlie: could u send me 200 ton on testnet to test stake and get rewards?

&rey: Let backend allocate unique indices, once again I say. (reply to 83400)

Stepan: In this case msg data can be copied (reply to 83459)

&rey: Well, it will still be valid for only one NFT? (reply to 83460)

Stepan: No (reply to 83461)

Stepan: Why for only 1?

&rey: Because server would sign specific item index?

Stepan: This (reply to 83387)

Stepan: And this (reply to 83400)

Stepan: I can’t use it for valid checking

User<7192644220>: I tried to do that with modals option of ton-connect ui but even though transaction is done, the modal isn't changed. Please help me (reply to 83451)

meomeocoj | Mike: hi rev i try to create tlb to gen typescript code for my struct (reply to 83464)

meomeocoj | Mike: how to code gen known it will be address or null address

meomeocoj | Mike: packet#ae89be5b seq:(## 64) token_origin:(## 32) remote_amount:(## 128) timeout_timestamp: (## 64) remote_receiver: MsgAddressInt remote_denom: MsgAddressInt ^[local_sender_byte_len: (## 😍 local_sender: Any] = PacketSendToTon;

Mr.A: Hi all, is there any correlation between body hash and in hash in transaction? Is it possible to derive one from the other?

Mr.A: For example, the in hash of this transaction is MicdfY7v3mZkuailupPqsO1EGk67siyOdubUYOqeyio=, the body hash is SifaOX/M2SSBqWfhcCOVFozmbLDG143KAkcRMMS5MYU=, and there is a correlation between these two hashes? https://tonscan.org/tx/by-msg-hash/MicdfY7v3mZkuailupPqsO1EGk67siyOdubUYOqeyio=

Franz in: /stat@combot

Nghĩa: How to use api to check how many holders are holding a token?

&rey: Let server sign specific NFT index and data, user send deploy message to NFT item with that index (there's only one such contract that belongs to the collection, since address calculation is deterministic), NFT item check if message contains valid signature and then going into initialized state. (reply to 83468)

UwU•JJ: Hi, I'm new to TON dev. I encounter something and try to figure this out, can anyone help me?  > What exactly is a WalletStateInit that you retrive when connect your wallet to TonConnect?

&rey: It is (initial) code and data of user's wallet contract, uniquely determining the address. It can be used for obtaining user's public key or deploying user's wallet during TON transfer *to* it. (reply to 83499)

UwU•JJ: As I understood, given the stateInit, you could retrieve {'hashed_address', 'pub_key'} from wallet contract, right?  Then is it possible if the attacker trying to tamper the stateInit so that the hashed_address & pub_key refer to different account?

UwU•JJ: @pcrafter the above would be possible only if you could break the cryptographic hash function right? im not sure if I follow up my idea in the right way.

&rey: Yes, or if backend neglects to check if StateInit matches the address. (reply to 83504)

User<6984952426>: Hello, guys. I'm new here... I'm gonna make telegram mini app, could you recommend game development tools?

UwU•JJ: Thanks!

Hoi: When sending a msg, how do you determin how much value to send to the contract? Does value have the same concept as gas on EVM chain?

Bharathcoorg: ./node_modules/@tonconnect/ui-react/lib/index.mjs  Attempted import error: 'CHAIN' is not exported from '@tonconnect/ui'.  I am stuck with this error.

prodvd: Do you fork ston.fi? If yes, you can find the codes in the codebase. (reply to 83451)

0xbera: /me

Hoi: will the value get refunded to me if the value is larger than needed? (reply to 83511)

Орельан [NEVER DM FIRST]: Is it possible to make it so that when buying a shitcoin, i deploy my own version of the jetton-wallet instead of the common one which does not allow the owner to destroy it after usage?

Freed: Nope, all jetton wallets must have the same code, otherwise they won't be connected to the same jetton.  You can create wrap wallet for someone's jetton but they will store wraps, and not original jettons which won't help you avoid owner (reply to 83522)

Орельан [NEVER DM FIRST]: Hey thanks for the answer, is it really a bytecode level issue or if both interfaces are fully compatible that might be ok? (reply to 83525)

Freed: Jetton has a function to find a wallet address by knowing it's bytecode and init (usually jetton address and address of owner). If you change anything in bytecode, jetton and it's jetton wallets won't work with them as their own (reply to 83527)

Орельан [NEVER DM FIRST]: Ah yeah that makes perfect sense now, thanks for the hint 🙏 (reply to 83530)

Nguyen: Hi I am using @tonconnect/sdk to implement my webapp in telegram. But in MacOs, when I connect telegram wallet, Telegram bot open override my web app. After connect success, I can not go back to my webapp. How can I solve it?

&rey: No unless destination contract explicitly sends remaining value to you. (reply to 83521)

Hoi: I tried to use blueprint to run my deployment on testnet, it is saying that my wallet address is invalid. "Invalid address. Got EQDxnHeLH_ZcbtIGrWnECtgl_Jhmu7_Z5XCSLSlpkRQCrdaG" https://testnet.tonscan.org/address/EQDxnHeLH_ZcbtIGrWnECtgl_Jhmu7_Z5XCSLSlpkRQCrdaG  I have deployed with this wallet before, may I know why it says the address is invalid?

[+_-]: Hi everyone! I am facing with exit code 9, when deploying contract from TonFunClessons_Eng, lesson 5 (I think I'm gonna be banned instantly for link). 9 means cell underflow, reading more data then stored in a cell, so here is data I encoding to my contract: export type AddressSaverConfig = {     manager: Address };  export function addressSaverConfigToCell(config: AddressSaverConfig): Cell {     return beginCell().storeAddress(config.manager).storeUint(0, 2).endCell(); }  And here is save_data in my contract: () save_data(slice manager_address, slice memorized_address) impure inline {     set_data(begin_cell().store_slice(manager_address).store_slice(memorized_address).end_cell()); }  I have tried to encode different addresses and run this code in tests, but without any result. I would appreciate any help or advice🖐

[+_-]: scam (reply to 83539)

programmer: Unapproved means not published?

programmer: If anyone know please help me🙏 (reply to 83542)

Амир: Key pair is the pair of keys: - secret key - corresponding public key (reply to 83542)

Abdulaziz: Testnet and Mainnet has same docs and what works on testnet will work on mainnet?

Elizabeth: Yes (reply to 83546)

elon: How to calculate transaction hash

programmer: So bro i have my 24 words my recovery keys so how can i use it to calculate secret.key or I'm wrong (reply to 83545)

David: Hi, did you find out anything? i encountered the same issue on this course. haha (reply to 83537)

[+_-]: What a mess! Haha, no, asked in a couple of other chats, but it had no effect :( Have you encountered with problems on further lessons?  P.S. Can I dm you, so that if anything happens, we can let each other know  P.S. #2 - I mean, another devs tried to figure it out, but without any success (reply to 83556)

[+_-]: This guy is scamming, how to report? (reply to 83557)

Tom: I deploy contract by blueprint (mnemonic, custom config with endpoint of toncenter) and get a error. Can anyone help me?

programmer: here it use two way should i go according second way ? beacuske in first way it doent take any information about my wallet

&rey: Common /report command should work. (reply to 83559)

Harsitha: Hey, who knows any Market Makers?

&rey: What do you mean? (reply to 83574)

Ankit j: While deploying to live server my bot, I am getting error as Main.tsx & vite.svg files- server unable to load...how to resolve it ?

&rey: Please show full TVM trace (lines with 'execute ...`), because that part is most useful. (reply to 83560)

Tom: Please help me check it. (reply to 83581)

&rey: Seems like message's deadline (validUntil) expired. Possibly time is set wrong on your computer. (reply to 83585)

Tom: I encountered the same error when I sent to Ton. I think it's a TonClient error or toncenter (I purchased the endpoint from toncenter). When I use 'TON Connect compatible mobile wallet (example: Tonkeeper)', it works fine. And I want to know why I encountered that error." (reply to 83586)

Tom: A month ago it worked fine, but now when I want to add new features, it encounters an error.

Nerses: can please someone send docs on Jetton wallet address calculation ?

Hhh: I want to ask how big the small program page size is

Unicorn Degen 🦄 ✨: Hey guys, I am trying to figure out couple of thing and can't seem to put the architecture right. Is there any freelancers that are avaiable ?

David: below is the error log: (reply to 83537)

&rey: This seems perfectly fine if the contract is unable to handle empty messages. (reply to 83598)

Nerses: how can i get jetton code on chain just having master jetton contract address ? or is there any other approach

&rey: Can you have master jetton contract code and initial data as well? (Those are just two constant cells.) (reply to 83606)

nec306: GM

charlie: Hi how can I stake in normination pool on testnet? I found there is no valid pool now. LOL

Adam: Is it possible to track all transactions on the blockchain that contain a specific op code? or what other method would there be if i want to for example listen for all swap in and swap out transactions on dedust?

&rey: dton.io/graphql offers this, yes. (reply to 83615)

Nerses: I can have master jetton wallet address.Isnt it enough ? (reply to 83607)

&rey: No, in general it is not sufficient. (reply to 83619)

Abdulaziz: How to generate testnet wallet?

river: How to store boolean cell in ts ton/core lib?  beginCell().storeInt(isAdmin ? -1 : 0, 1).endcell()  This doesn't work

Abdulaziz: I got it thanks (reply to 83621)

Abdulaziz: @testgiver_ton_bot is only way or there is another methods to get free test net coins?

Nerses: then what data should I have to calculate Jetton wallet address properly ? (reply to 83620)

David: This is when I’m deploying a contract where init data is an empty cell. But seems it cannot be deployed successfully (reply to 83603)

David: Actually the code I’m trying is the same as this Func course https://github.com/romanovichim/TonFunClessons_Eng

Abdulaziz: Can we buy domains on testnet?

Buggy: how much do you need? (reply to 83630)

Son: Hi. How to detect if a tx is success using json rpc api in toncenter v2

Stalooshu: How is monitoring performed at the moment? Is there any way to export some metrics to prometheus?

Smart Ƀart: Hi! Is there a Go SDK for ton? Like ethereum-go? :-)

Jeff: beginCell().storeInt(isAdmin ? -1n : 0n, 1).endCell() (reply to 83622)

river: thanks! (reply to 83653)

Abdulaziz: Is that scam or something?

Abdulaziz: aiotx library, can I trust this library? (reply to 83656)

Abdulaziz: It's testnet (reply to 83656)

programmer: anybody know for why i get this error i trying to transfter jetton from my wallet to another wallet by js

Abdulaziz: Looks like not scam but, i see many scam  messages like "claim your airdrоp" on mainnet, Considering that I'm on the testnet, and there are no links in the comments, only the library, it doesn't look like a scam (reply to 83656)

&rey: Please remember that unknown libraries are pretty much equivalent to programs and may contain a virus, stealer or like.

Son: any hint @pcrafter 😄 (reply to 83645)

&rey: Have you searched in the chat? (reply to 83663)

User<7192644220>: @pcrafter  please help me (reply to 83451)

&rey: Wait until tokens arrive with that query_id and appropriate amount. (reply to 83451)

User<7192644220>: how do Wallets like TonKeeper keep track of transactions?

&rey: They poll own indexers (tonapi) and check traces (transaction trees) whether they are completed or not. (reply to 83667)

User<7192644220>: yeah I used tonapi but transaction hash is changed after it is completed

User<7192644220>: hash on pending status is different with one on complete status

User<7192644220>: I can get hash on pending but can't get one on complete

Son: I have. There were a question and answer regarded the tx success but the response looks like it’s from an indexer. As I understood, to determine if a tx is failure, I have to look for the non-zero exit codes in the prepare phase in tvm but I was unable to obtain it from api such as getTransactions https://getblock.io/docs/ton/json-rpc/ton_gettransactions (reply to 83664)

Pixel: I am proficient in building dApps, telegram mini apps & bots on EVM, Solana, TON, Bitcoin etc. Does anyone need?

User<7051939459>: Please write me (reply to 83674)

Alfred: You can DM me if you still need some help (reply to 83594)

Ankit j: Anyone faced similar issue ? (reply to 83579)

透街二裤: i can not use python request post https://fragment.com/api，I simulated various http headers but not use，Who knows what happened？

透街二裤: <span id="challenge-error-text">Enable JavaScript and cookies to continue</span>

透街二裤: it away return this for me

Nerkrkririei I Think I Need A It's A: Cloudflare? (reply to 83686)

Millju Gana: Some one should put me through on TON I'm new here and I'm interested

Alfred: https://docs.ton.org/develop/overview here (reply to 83690)

透街二裤: you mean Cloudflare deny my request？ (reply to 83688)

Nerkrkririei I Think I Need A It's A: I don't know if fragment uses cloudflare (reply to 83693)

Prince: as dev Or kind of investor? (reply to 83690)

Nerkrkririei I Think I Need A It's A: But you need to solve a challenge which will give you the cookie to use in requests

Millju Gana: Please who are they and where can I find them, I'm really interested I just hope I'm not late on it (reply to 83695)

透街二裤: i think you are really

Prince: of course you are not (reply to 83698)

Millju Gana: Sorry I don't understand (reply to 83696)

Nerkrkririei I Think I Need A It's A: Not you (reply to 83703)

Prince: it's not to you... (reply to 83703)

Nerkrkririei I Think I Need A It's A: You can use cloudproxy but I'm not sure if it still works (reply to 83700)

Millju Gana: Sir please telle more about dev (reply to 83706)

透街二裤: thinks，bro， i will try (reply to 83707)

Millju Gana: I'm actually a new b  And I'm interested in airdrops

Adam: this is how im sending transactions. how can i get the transaction signature that i can use to confirm the transaction landed? im using ton client sdk not tonweb

Shadow: how does explorer understand that the contract implements the interface? And how can I easily change the contract so that it is not identified as jetton_wallet?

&rey: By attempting to call get methods. Remove get_wallet_data. (reply to 83719)

Shadow: Thank you! (reply to 83724)

🐾ΣPraveen: My ton coin has stolen can any body help i have that transaction hash and their wallet address

Chris: Hello devs,   I am a crypto marketer and KOLs manager. We are recruiting a team of experienced devs for a ton ecosystem game (like tapswap, hamster and notcoin) If you are working on any existing projects or want to work with us from scratch we offer a great co-working space and environment with good monetary value for freelancers or payscale devs.   Budget is good kindly let me know if you are interested by sending a CV and LinkedIn (if available)  Note : We are also making good investments via our VC branch and if you have ideas or existing projects we would be glad to arrange meeting for grants/scholarship.

programmer: Sir can you send me link of document of ton client sdk (reply to 83714)

Adam: https://github.com/ton-core/ton (reply to 83735)

Wukong: Hi guys, does anyone know how to make a token to be verified on Tonkeeper? Thank you in advance.

&: do not connect or confirm tx where you cannot believe. Drainers can easily drain all your tokens. (reply to 83733)

&: exit_code 9 means your tx structure is mismatching. Carefully check your tx structure. And if you have problems please search this chat history (reply to 83537)

Bean: Hi everyone! I'm newbie, when reading the document of TON, I see that smartcontract contains address, code, data, balance and others. What is the others stand for?

&rey: Flags requesting tick-tock calls at each block (active only for fundamental contracts), auto-splitting information (reserved) and published library cells. (reply to 83745)

Son: I am able to resolve this using @ton/core sdk (reply to 83673)

Carter🧹: Hi guys, I'm trying to deserialize Block data, and am having trouble with BlockExtra.  According to the TL-B, it should only be 513 bits wide, two 32byte hashes, and a Maybe flag. However my Cell from the network (a Workchain block) is 548 bits wide, 35 bits extra (or one uint32 and change).  Is the TL-B definition for BlockExtra in Git not correct? If I ignore these extra bits, and take the Maybe from the end of the two hashes as described, I get an instruction to deserialize McBlockExtra, but I don't have enough Refs on the Cell to do this, only 3 which are consumed by the first 3 pointers.  block_extra in_msg_descr:^InMsgDescr   out_msg_descr:^OutMsgDescr   account_blocks:^ShardAccountBlocks   rand_seed:bits256   created_by:bits256   custom:(Maybe ^McBlockExtra) = BlockExtra;

Carter🧹: In the documentation, it has an old (different) definition for BlockExtra, so I assume something is out of date here, and it could be the .tlb on Git?

&rey: First, you've forgotten about auto-tag. It's equal to b'J3\xf6\xfd'. (reply to 83751)

Carter🧹: Oh shit, usually they are defined in the TL-B! So this is 32 bits wide? Your encoding is odd in the TG message.

&rey: Second, maybe cell is 545 bits long? I've found tag in https://github.com/yungwine/pytoniq-core/blob/master/pytoniq_core/tlb/block.py.

Carter🧹: Thanks for your help on this, can't belive I got all the way through the block and failed on this hurdle 😂

Carter🧹: Works perfectly, can't believe I missed the discriminator/auto-tag on this object...

User<1132999413>: Any Ton/telegram mini app Developer here??

Abolfazl: yes (reply to 83767)

User<7192644220>: Have you ever use success notification of tonconnect ui?

Abdulaziz: Why the another wallet didn't receive ton, but i paid: https://testnet.tonviewer.com/transaction/0a9aefe252965684526f8febf1e7c3da5c8a98241db512994858deb23371218d  Can anybody explain

Abdulaziz: Should i wait sometime?

User<6552923794>: Hi how can i transfer ton by JavaScript

Владислав: Можете меня разблокировать в Ру чате? Написал вопрос про апи и отправил ссылки на tonapi и coingecko. При чем ссылки во втором сообщении, что не запрещается вроде правилами.

Mohan: Any free course available for ton blockchain course?

rye: I sent some testnet TON to my other wallet using Tonkeeper but it seems to be stuck. Anyone know whats going on here?Transaction: 85d548440cb6ff704f27121a59f2592e86736a97cf74cf62a1e797f8509015fa

User<6981260071>: Hey community!! .. 🙂   Why is ton wallet (tonkeeper) not force  the user to switch chain when i set the network argument to be on mainnet ? i have converted address to hex (raw) format before send transaction.. i use tonconnect/ui-react ..

Alexander: WH& SOME DUMP BOT ALWAYS DELETES MY FUKNG QUESTION EVERY TIME I SEND IT TO THIS CHAT

Abdulaziz: Do not use word airdrоp (reply to 83805)

Abdulaziz: do not use bad words (reply to 83805)

Alexander: I'm trying to ask a question about vscode func plugin, attaching a video and someone instantly deletes my message. I'm not using any of such words (reply to 83806)

Alexander: Look https://imgur.com/a/NlvEjgp (reply to 83807)

Zodomo/: this chat seems to filter links to TON explorers too lmao

Zodomo/: the literal word ton-viewer (without the dash) gets filtered

Alexander: Someone better hire real humans to moderate this chat, instead of creating such rules with bots (reply to 83816)

Abdulaziz: No i think this chat allows ton explorers (reply to 83783)

Alexander: https://tonviewer.com/transaction/560f75b9cd1329ee3906bc30cfe2de73bf85a9840235b23d735443c676714381 (reply to 83821)

Abdulaziz: Looks like scam (reply to 83822)

Alexander: It might be something else triggered the filter (reply to 83818)

Abdulaziz: Almost all, 99.99% transactions with "airdrоp" is a scam (reply to 83822)

Zodomo/: I literally cannot share a tonviewer link

Alexander: I just sent a random transaction link to test filter rules (reply to 83826)

Zodomo/: testnet.ton—viewer,com/transaction/85d548440cb6ff704f27121a59f2592e86736a97cf74cf62a1e797f8509015fa

Zodomo/: I have to destroy the link to get it through

Abdulaziz: maybe try to send like this

Zodomo/: LOL

Zodomo/: cant do that

Zodomo/: if anyone wants to look at testnet TXID 85d548440cb6ff704f27121a59f2592e86736a97cf74cf62a1e797f8509015fa lmk. our simple wallet to wallet TX somehow turned into a contract deployment (that we didn't provide code for) and got completely stuck

Zodomo/: it just shows pending and has for over an hour

Abdulaziz: it's an url to your transaction (reply to 83840)

Abdulaziz: https://testnet.tonviewer.com/transaction/85d548440cb6ff704f27121a59f2592e86736a97cf74cf62a1e797f8509015fa  Bot does not deleting ton explorers (reply to 83783)

Abdulaziz: Maybe your profile on blacklist (reply to 83840)

Zodomo/: I just joined today so maybe (reply to 83846)

Abdulaziz: Blacklist from combot not the chat (reply to 83848)

rye: Another pending TX stuck in limbo. No idea why. Just sending funds to another wallet: 8dc3e18babffaa0e0d40c5fc942f70dbde41f26d2ee07aed62e65070a95b8f60

Dmitry: testnet? (reply to 83851)

rye: Yes (reply to 83852)

Dmitry: same while trying deploy contract)

Dmitry: simple ton sending works fine for me) looks like my problem in contract deployment (reply to 83853)

User<6981260071>: Someone

User<6552923794>: How can i get some jusdc on testnet

Abdulaziz: We all have same problem (reply to 83851)

Abdulaziz: Transaction stuck

John: I tried to create a wallet, but passphrase is not available. Please, someone can help

Abdulaziz: There is a lot methods of creating wallet (reply to 83868)

John: Help please

Agent B: testnet? (reply to 83865)

Agent B: thank god, thought it was just me

Abdulaziz: Yes (reply to 83873)

Agent B: That's a releif

MZ: What is the easiest way to listen for TON transactions? On EVM I usually use Alchemy webhooks where they listen for incoming transactions on a given wallet and send information to my API that such transcation occured.   Do you know similar listening service on TON Network? If not - do you have any useful links/examples, where I can find information about listening transactions?

Abdulaziz: I lost my ton but another wallet didn't receive: https://testnet.tonviewer.com/transaction/0a9aefe252965684526f8febf1e7c3da5c8a98241db512994858deb23371218d

Abdulaziz: still pending

Abdulaziz: how to fix that problem

— 2024-07-13 —

Luca: Hi I'm just learning about ton and I'm a bit confused about how a wallet address is supposed to be derived from an ed25519 key pair? Does anyone have a code snippet or a link to the spec of how it should be done?

Alexander: In TON there’s no direct connection between an ed25519 key pair and the address itself. Address is a sha256 cell hash of a state init (that contains code and data of a particular smart contract). And the data may contain a public key, or may not - as the developer wishes and anywhere in such data cell (reply to 83898)

Luca: Sorry.. so you are saying even if you have your mnemonic/private key you can’t compute your public address? (reply to 83899)

Luca: Oh I see wallets are all smart contracts on ton. So if you have a 24 word mnemonic you could have multiple addresses depending on the wallet version?

Abdulaziz: One 24 word equals to one wallet, wydm (reply to 83902)

Luca: https://tonhelloworld dot com/01-wallet/  Step 5  It looks like it’s possible to derive an address for a version of a wallet offline in step 7. Would anyone have code or pseudocode of how to do that without the ton sdk?

Abdulaziz: BRUH TRYING TO STEAL MY TONS FROM TESTNET LOLL💀 (reply to 83894)

Abdulaziz: How stupid is he? Maybe we can tell him that ton on the testnet is free (reply to 83909)

Abdulaziz: He must be so stupid, he is trying to deceive a developer who knows better than him, and he is trying to steal the tone from the testnet where everything is free. It's my fault that I wasted my precious time on that sоn of а bitсh. (reply to 83910)

Luca: Hmm I see this is a lot more complicated than other chains @agapak   https://github.com/ton-defi-org/ton-offline-transaction

Alexander: Looks a bit too old repo, look at https://docs.ton.org/learn/overviews/addresses (reply to 83914)

Luca: Yeah saw that too. It's older but it actually explains the flow of how it could possibly be computed offline (reply to 83915)

Alexander: Yes, you beed the smart contract code and other stuff. And you even can build a wallet that will not have a public key inside at all (reply to 83900)

Abdulaziz: There is some API for wallet.ton.org?

Alexander: Most of the sdk/libs can compute this offline (reply to 83917)

Alexander: It’s a non custodial wallet, as I know. You can build the same functionality using any SDK for TON (reply to 83919)

Abdulaziz: So i can create a clear wallet address using any ton sdk? (reply to 83921)

Alexander: I don’t know what do you mean by “clear”, but yes you can do it with the most of SDKs (reply to 83922)

Alexander: https://docs.ton.org/develop/dapps/apis/sdk (reply to 83922)

Abdulaziz: The wallet which has no contract, and i can choose one, when i use something like @wallet it chooses the contract automatically (reply to 83923)

Lucky: Hi guys, can I get jetton balance using smart contract? is that possible?

Abdulaziz: I just wanna create a high loaded wallet (reply to 83923)

Alexander: No, you need to handle jetton transfers in your smart contract and update the balance inside it (reply to 83927)

Alexander: Go to any of the SDK and search for examples with this type of wallet (reply to 83928)

Luca: Alright I'll take another look at the sdks. I'm basically trying to figure out if I can get ton to work with a wallet service called turnkey which stores the private key in a secure enclave and gives you a public key (which I wanted to use to derive an address with) and the ability to send payloads to be signed to it. Maybe not feasible on ton? (reply to 83920)

Abdulaziz: It says i can build ton with PHP, this is the language I need (reply to 83924)

Alexander: Yes, you even can build ton with the binary code - why not 😀 (reply to 83935)

Lev1: Hi all, why I can not find any open-source repos 'bout TON

kevin: hey, anyone knows how to LOCK LP from stonfi pool ?

Mohan: I did not get the answer  Can anyone please? (reply to 83792)

Son: Have you tried searching the docs? (reply to 83947)

Mohan: Can you provide the link (reply to 83949)

Sammy: Hello everyone! I need Swap bot which is integrated with Dex platforms, pancakeswap and etc.  For further information please contact me. If you worked on swap projects only DM me!

ecomnazar: hi, i have a problem(  what happens when i not write memo in ton transaction?? can i return my money back??  thanks!

TokenGuide: Hey, does anyone know where we can get our app listed on the app store?

Alan: Hi everyone. Following the shards docs, 1 block in master chain can be sharded into multiple blocks in work chain. But I see a block in work chain but can not find which master chain block it belong to?  For the master block in tonviewer, I look up for master block 20834331 but I do not see the workchain block 22357910 in this master block? (reply to 83968)

Alan: Hi everyone. Following the shards docs, 1 block in master chain can be sharded into multiple blocks in work chain. But I see a block in work chain but can not find which master chain block it belong to? (0,6000000000000000,22357910)  For the master block in tonviewer, I look up for master block 20834331 but I do not see the workchain block 22357910 in this master block?

User<7118587076>: Hello, why my seed from tonkeeper doesnt work with python sdk?

User<7460887195>: 开课

xihucuyu🦴: hello everyone. i try to send a 10 USDT on testnet but the tx is pending for 20 minutes

Frank: Gm! How to parse properly getJettonData() from ton library, content property that contains decimal, in JS/TS ?  It's a Cell, I saw many answers saying it must be parse starting beginParse, but I don't see proper sample explaining how it must be done.

xihucuyu🦴: but the code worked on July 10

User<7460887195>: 营业

User<6552923794>: Sir from where I can get usdt on testnet? (reply to 83989)

&rey: There are! Though, bot is more useful against ad messages, or they would be in chat for a long time — past the moment it makes much sense to delete them. (reply to 83819)

&rey: Poll transactions, either on contract or on whole blockchain. https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py. (reply to 83879)

&rey: Mint your own jetton, https://minter.ton.org/?testnet=true. (reply to 83995)

&rey: Does wallet version match? (reply to 83975)

User<7118587076>: yes

User<7118587076>: a sorry

&rey: If you transfer to non-custodial service, everything is fine. If you transfer to custodial service, you may reach out to their support to get refund to sender address. In certain cases, that's not your address. (reply to 83956)

Abdulaziz: Do i get more than one address with only one 24 words? (reply to 83903)

Mohan: Anyone there to reply? (reply to 83792)

&rey: Yes. At the very least, v3r2 and v4r2. (reply to 84014)

User<7118587076>: i fix it but still show different address (reply to 84007)

MZ: I know https://margin.io/ (reply to 84016)

MZ: So if I have my dapp in Next.js I need a separate server that works 24/7 and listen for incoming transactions using get_transactions(), right?  Is there any more optimal way? (reply to 84005)

&rey: Yes. More optimal way is to rework architecture in a way that would get rid of server at all. (reply to 84022)

&rey: What do you mean? (reply to 84016)

0xJack: ok

MZ: That's exactly what I would like to do, but I'm not sure if I can listen in Next.js app directly.  It would be the best if there were any service that listen for me and send information to my API when transaction on blockchain has been completed. Do you know something like this?  Any idea how to do it without the separate 24/7 working server? (reply to 84023)

User<6552923794>: How can i revoke my ownership (reply to 84006)

Peter: Hi, everyone  How i get all liteservers in TON?

User<7460887195>: 开课看我主页

&rey: Please use English in this chat. (reply to 84033)

User<6552923794>: I entered my 24 recovery on mobile but my wallet address has different from extension and i lost my tons on testnet

User<6552923794>: Cam you explain more i didn't understand (reply to 84037)

Freed: Maybe you picked different wallet version? Also just claim more test tons through bot (reply to 84036)

User<6552923794>: My wallet address on extension Star from 0 and in mobile start from U And i don't receive any test ton mobile (reply to 84039)

Jean Carlo: Okay (reply to 84040)

User<6552923794>: Uh it shows mainnet address but i enabled dev mode (reply to 84040)

&rey: You've forgotten two steps: — close (not disable) dev menu — add new wallet in top menu (reply to 84042)

User<6552923794>: Yes i had to add secret key as testnet (reply to 84046)

User<7352779258>: I'm developing a Telegram web application that needs to accept payments in USDT via Telegram Wallet. Could you please share the necessary documentation and recommend the best library to use?  P.S. The backend is in Python, and the frontend will be in plain JavaScript.  Thank you.  Also, how can I connect to the Telegram Wallet testnet (if it exists), and where can I get USDT for the testnet?

N. T.: Hello, How can i checking transaction status on TON using javascript. In my transaction has multiple internal transaction.

H_A_W_K: Please, does anyone know why my smart contract isn't deploying?

User<6552923794>: Is there any tutorial video that send jetton by js? (reply to 84073)

NPA120: Please make sure your wallet and network is same network. if they are valid, you have to check the version of your wallet. (reply to 84103)

Short: Hi. I'm trying to understand if it's possible to host my Telegram web-app on an .adnl-domain name.   I've followed the guide and hosted the website & rldp-http-proxy. I checked with curl using one of public http-to-adnl proxy servers (curl -x ...) and I can clearly see my page & the request in the server access logs, however when I attach link to bot menu and try to open that link from bot menu - it shows error that domain cannot be resolved.   UPD: actually I'm not seeing requests though the proxy in the nginx logs, so I wonder where does the page comes from. Also any request to any sub-path gives the page at the root  UPD2: I fixed proxy command and now I see requests in nginx logs when accessing adnl domain, but it's still not working from Telegram

Frank: If anyone got that answer let me know, I really don't get it, I mean how does Cell format must be parsed for a given jetton master address. Why these libs don't do that for us 😂 we call function getJettonData but we only have 0_&2937xfGflziSHIT_ 😂😂😂 it's criminal (reply to 83988)

Carter🧹: How can I avoid this error when running toninstaller.sh?  error: externally-managed-environment  It complains about some python config on a fresh Ubuntu install.

Agusti: /stat@combot

Carter🧹: You can run this command to prevent this check by Python  sudo mv /usr/lib/python3.12/EXTERNALLY-MANAGED /usr/lib/python3.12/EXTERNALLY-MANAGED.old (reply to 84120)

Abdulaziz: <?php /** @noinspection PhpUnhandledExceptionInspection */  declare(strict_types=1);  use Olifanton\Interop\Address; use Olifanton\Interop\Units; use Olifanton\Ton\Contracts\Wallets\Transfer; use Olifanton\Ton\Contracts\Wallets\TransferOptions; use Olifanton\Ton\Contracts\Wallets\V3\WalletV3Options; use Olifanton\Ton\Contracts\Wallets\V3\WalletV3R1;  require dirname(__DIR__) . "/common.php";  global $kp, $transport, $logger;  $wallet = new WalletV3R1(     new WalletV3Options(         $kp->publicKey,     ) );  $logger->info(     "Sending from " . $wallet->getAddress()->toString(true, true, false) );  $extMsg = $wallet->createTransferMessage(     [         new Transfer(             dest: new Address("UQAoqXsjSOtWhZo9t0Fiss9BIiV34qHo5eU6mx0SL0zQ5do-"),             amount: Units::toNano("0.011"),         ),         new Transfer(             dest: new Address("EQCrrSblmeNMAw27AXbchzG6MUja9iac7PHjyK3Xn8EMeqbG"),             amount: Units::toNano("0.012"),             payload: "Very long message string. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur aut consectetur et explicabo fuga in incidunt laboriosam minima nemo nulla obcaecati placeat praesentium quam quisquam sint, sunt voluptatibus? Ad, vel?",             sendMode: \Olifanton\Ton\SendMode::PAY_GAS_SEPARATELY,         ),     ],     new TransferOptions(         (int)$wallet->seqno($transport),     ), );  $transport->sendMessage($extMsg, $kp->secretKey);  I wanna know how i can get my secret key, there is only 24 words

K: convert from memo

K: secret pharse

Abdulaziz: I can convert 24 words to private key? (reply to 84167)

Jupiter: Hi everyone, I run a Web3 lab specializing in TON development. Our team consists of three experienced blockchain developers from Europe, with expertise in Telegram mini app (TMA) and smart contract development.  If you need a TMA, func, or tact developer, feel free to reach out. Our DMs are always open.  https://x.com/mrbllab

Abdulaziz: It didn't give me API

User<6552923794>: Last question is from 3 months ago   I asked question and it write unapproved   Is this site work?!!

User<6552923794>: Use this  tonapibot (reply to 84174)

Morphius: Dev job: - telegram mini app that will generate wallets on solana end evm, and will back up the keys to telegram cloud. non custodail wallet.

&rey: This is offtop for the chat. (reply to 84177)

&rey: What functionality you want to be done by blockchain? (reply to 84187)

Hiroto: dm me (reply to 84177)

Даниил: https://tonviewer.com/transaction/d8be70f66c37dc8ee6ab510d36eca1566ed285e09d8b3bb8d6d1483cb43eca6c  Code:  const JETTON_WALLET_ADDRESS = 'UQDq6d-GZ-pJnkmSt0S2Qod5QSfvZNwoTdQ-9GPXsLqbO-A-';   const WALLET_ADDRESS = 'UQBvApfFEEvT0swMtJjqtKUzXFEaJOmx2xYOSG9xiaxg4x4b';   const walletAddress = await wallet.getAddress();    // const JETTON_WALLET_ADDRESS = 'EQBGpCSFJpAb1guZHVWIO8b_8g0e8yxp2ZfZWcTXvTjvvyFd';     // const JETTON_WALLET_ADDRESS = 'EQAG6NvUCTxgQfcuUJVypQxN4rCm6krVH6T-mngXhSQwY0Ae';     // console.log('jettonWalletAddress=', JETTON_WALLET_ADDRESS);    const jettonWallet = new JettonWallet(tonweb.provider, {       address: JETTON_WALLET_ADDRESS   });    const res = await wallet.methods.transfer({       secretKey: key.secretKey,       toAddress: JETTON_WALLET_ADDRESS,       amount: TonWeb.utils.toNano('0.05'),       seqno: seqno,       payload: await jettonWallet.createTransferBody({           tokenAmount: TonWeb.utils.toNano('50'),           toAddress: new TonWeb.utils.Address(WALLET_ADDRESS),           forwardAmount: TonWeb.utils.toNano('0.01'),           responseAddress: walletAddress       }),       sendMode: 3,   }).send();  Why I can't transfer tokens?  I want to send $MIC from this wallet: https://tonviewer.com/UQDq6d-GZ-pJnkmSt0S2Qod5QSfvZNwoTdQ-9GPXsLqbO-A-  To this wallet:  https://tonviewer.com/UQBvApfFEEvT0swMtJjqtKUzXFEaJOmx2xYOSG9xiaxg4x4b

User<6429376720>: hey wassup

Даниил: https://tonviewer.com/transaction/4b6ee57c4f4a861929da80563aa78675a4c1bf65456ef5338199638f0a4cc3c0  const JETTON_WALLET_ADDRESS = 'EQCxJplYQnOuUly0-fxE9sylyOack4GtJncdsnTTOMnVh3VG';   const WALLET_ADDRESS = 'UQBvApfFEEvT0swMtJjqtKUzXFEaJOmx2xYOSG9xiaxg4x4b';   const walletAddress = await wallet.getAddress();    const jettonWallet = new JettonWallet(tonweb.provider, {       address: JETTON_WALLET_ADDRESS   });    const res = await wallet.methods.transfer({       secretKey: key.secretKey,       toAddress: JETTON_WALLET_ADDRESS,       amount: TonWeb.utils.toNano('0.1'),       seqno: seqno,       payload: await jettonWallet.createTransferBody({           tokenAmount: TonWeb.utils.toNano('500'),           toAddress: new TonWeb.utils.Address(WALLET_ADDRESS),           forwardAmount: TonWeb.utils.toNano('0.01'),           responseAddress: walletAddress       }),       sendMode: 3,   }).send();  Why i transfer 0 tokens, if i will send 500 tokens?

Stephan: Hello everyone, does anyone know when you call npx blueprint run the error TypeError: Cannot read properties of undefined (reading 'slice') appears?  Started today, never happened before

Smart Ƀart: Hi! Does anybody have an example of a token that’s taking tax on Dedust or ston.fi and auto sells to TON? 🤔

H_A_W_K: It's same network. I was only able to deploy one smart contract (reply to 84111)

stacc: gm

stacc: does anyone want to see a magick trick

stacc: future

stacc: noone cares for magick?

Treasure: What's the trick? (reply to 84237)

Serж: I have the same problem. I was able to deploy contract once, but it failed a bunch of times before and a bunch of times after. No code was changed (reply to 84221)

User<6552923794>: What is Jetton Wallet Address in toonkeeper i think it's different from toonkeeper wallet address

•: Can you show line of code of this error? (reply to 84214)

coldy: Hi, I wrote my code for a TON based coin. How do I apply it to my coin?

TON Bounty Bridge: ​FunC Code Formatter  🏷 Developer Tool  Summary:Develop a FunC code formatter tool from scratch.  Created by cryshado

stacc: it's only working in certain cases  i'm getting cors errors based on ancestors csp restrictions when I try to use a random ton app within my twitter extension that renders ton apps (reply to 84241)

stacc: works fine for a given one I made last night,

stacc: but it dies when it tries to render oauth telegram org within an app

stacc: curiously - maybe it doesn't matter

Alexander: Hi, guys! If you'd like to see and use a FunC code formatting tool. I'll appreciate your comments on that issue. (reply to 84251)

stacc: give me a random app to try

User<6552923794>: Because you wrote token amount you should write jettonamount (reply to 84210)

User<6552923794>: How you obtain jetton wallet address (reply to 84210)

— 2024-07-14 —

panda: Hello,  I am in need of blockchain developers capable of creating a custom pre-sale website, developing a token on the TON blockchain, and handling additional tasks which I will explain privately. If you are the right fit for this project, please message me. Budget details will be discussed in private.  Thank you.

&rey: Please visit @tonhunt. (reply to 84284)

John: Hi All, how can I validate the transaction jetton master address, It appears two address is the same raw address, should I check the raw address every time transaction happens?

User<6648609302>: Have you launched the project? (reply to 84250)

User<6648609302>: Please if you're a dev in here and you need a community manager or moderator for your project, just dm me

Louis: I am a developer of TON Chain and have already minted Jetton, but I cannot create a swap using the SDK in the documentation

&rey: A developer of chain, sorry? (reply to 84310)

Abdulaziz: can i use php sdk without external APIs? I wanna do all things locally

Abdulaziz: I mean i wanna do ADNL Blockchain connection, but it's impossible with php right? (reply to 84316)

Inayat: I always getting this Error , trying to get jetton balance.  Can somebody help???

Trey: Hi, how much would it cost me to get a dev to bring my game to TON blockchain? Any price estimates

Trey: It's a browser base TCG

User<5417056003>: Can I see the game (reply to 84329)

Trey: yes sure

Trey: can i send the website here

Trey: h t t p s : / / armyofcrypto . c o m

Trey: I tried deploying it on an independent blockchain in the past but found it difficult to find adoption and reach players

Trey: Telegram seems like the perfect opportunity for me to distribute my game to many players

User<5417056003>: Lemme help deploy it (reply to 84336)

Trey: What do you mean? (reply to 84337)

User<5417056003>: On ton blockchain (reply to 84338)

Vlad: Hello! Can anyone tell me about the purpose of the host demo.tonconnect.dev and when I should use it?

Trey: Oh okay but what do you need? (reply to 84339)

Akki: Yes

Trey: send me a DM (reply to 84339)

User<5417056003>: Kk (reply to 84343)

Akki: Brother I don't understand anything

Hoi: I have been using func-js to compile instead of blueprint build since it cannot recognize my compile.ts inside compilables. Anyone having the same issue and have I done sth wrong?

User<5417056003>: I can't Dm you (reply to 84343)

Trey: Lemme double check with the community if I can trust you before I move ahead.  Guys, need some validation please. thumbs up if safe 👍, thumbs down if not👎 (reply to 84347)

Trey: Where is the official chat to ask about such things, isn't it here

Akki: 👍

&rey: I haven't heard about it. I think you shouldn't use things purpose of which you do not know. (reply to 84340)

&rey: @tonhunt is generally used. Please also disentangle Telegram and TON; one doesn't need to work with TON at all to deploy in Telegram. (reply to 84349)

Trey: Oh okay, TON is focused on web3 integration only?

Akki: 👍 (reply to 84353)

Trey: So if I wanted to get a dev to assist me with TON integration???

Trey: I just need to be pointed in the right direction

Centix ・ Kronos Bot: Hello, I completed ton blockchain course one month ago. but I haven't received NFT and my name doesn't appear in ton blockchain course page on ton society website. what's the problem?

Trey: Basically a completed web3 designed TCG, tried and tested on another blockchain and ready to deploy on TON if I can get some assistance

11: hi guys. how to use different env to distinguish mainnet and testnet?

Arsen: hi guys i want to create python script which will buy nft , how  can i do that ?

ORADeF1: Please which material do you use for the ton blockchain course (reply to 84357)

Centix ・ Kronos Bot: https://stepik.org/course/176754/syllabus (reply to 84362)

ORADeF1: Thank you (reply to 84363)

&rey: What's the best solution if I want one contract to have authority over multiple kinds of jettons? That contract would be something like DEX with exception that tokens will not have utility outside it.

&rey: TEP-74 implies that each jetton system must have its master contract, which would provide metadata...

Alfred: Then I think it's not a standard jetton contract and you can ignore the TEP-74 standard. (reply to 84366)

Arsen: does getgemes has api ?

W. [Разработка сайтов]: wait for it to show up. (reply to 84357)

Abdulaziz: How to create wallet using ton sdk, toncenter?

Optimus: Hello guys.  Please what does an uninit wallet mean?  I send token to the address but it shows uninit on the wallet type

&rey: Uninit contract is one that isn't yet deployed to blockchain — that is, blockchain doesn't know what it will be (wallet, jetton master, so on). TON bounce from uninit contracts when bounceable address (EQ...) is used. (reply to 84384)

Solomon: Hello

Prince: Hello, From transaction, it's just about dedust swap and How can I get all information like buy or sell amount, address,, etc?

KEAN: hello, is there private transactions/bundles on ton, like flashbots on ethereum mainnet?

&rey: No, transactions on different contracts cannot be grouped because in general those contracts are in different shardchains. (reply to 84403)

Super_hands: Hi guys, I get a question while investigating jetton-utils.fc. In pack_jetton_wallet_data, cell jetton_wallet_code is stored as ref. But in calculate_jetton_wallet_state_init, cell jetton_wallet_code is stored as dict. Why are both stored differently?

&rey: A more traditional way to write latter function is begin_cell().store_uint(6, 5).store_ref(jetton_wallet_code).store_ref(data...).end_cell(), though they are equivalent. (reply to 84410)

Steven1 PAWS 🐾🦉 🐈‍⬛🍅🦉: I have problems

Super_hands: Thanks! So those are just identical but using store_dict is more common style nowadays? In terms of optimization / fee things, are those equivalent also or not? (reply to 84415)

Steven1 PAWS 🐾🦉 🐈‍⬛🍅🦉: I received toncoin but is not active on my wallet

Super_hands: Maybe too early check or wrong receiver address. Checked all? (reply to 84421)

&rey: Identical. Traditional way uses 3 stores into builder, and common one = 4 stores. Fees in the method are greater proportionally. (reply to 84420)

Super_hands: Hmm, so both are working identically but traditional way is cheaper. Then what are pros of using store_dict? (reply to 84423)

Steven1 PAWS 🐾🦉 🐈‍⬛🍅🦉: Please help to fix it

&rey: I don't know, just someone has written code in that way and it got into public. (reply to 84425)

Steven1 PAWS 🐾🦉 🐈‍⬛🍅🦉: How can I fix the problem (reply to 84426)

&rey: Please take a look at transactions in explorer, not in Tonkeeper. (reply to 84426)

Steven1 PAWS 🐾🦉 🐈‍⬛🍅🦉: But I have received it (reply to 84430)

&rey: Then what's the problem? (reply to 84431)

Steven1 PAWS 🐾🦉 🐈‍⬛🍅🦉: But how can I fix it

Super_hands: Thanks! If someone knows about the pros of using store_dict instead of store_ref, let me know! :) (reply to 84427)

Vladislav: Have a nice day everyone,  please tell me how to solve the error TonConnectUIError: [TON_CONNECT_SDK_ERROR] TonConnectUIError 'localStorage' is unavailable, but it is required for TonConnect  It also redirects me to the documentation - https://github.com/ton-connect/sdk/tree/main/packages/sdk#init-connector  But I use only: "@ton/core": "~0.56.3", "@tonconnect/ui": "^2.0.6",  And don't use `@tonconnect/sdk`package I understand that this package is used inside the UI package But I don’t understand how I can create and set the storage, cause it isn't in the UI package 🤷‍♂️  I think I'm missing something, if anyone knows please help  My web stack: svelte, typescript, @ton/core, @tonconnect/ui

&rey: Where are you opening the dApp? (reply to 84437)

Vladislav: On my local machine with vite dev (reply to 84439)

Vladislav: If you need any other information, just tell me. I just can’t even imagine yet which direction I should look 😔  I've already tried all the options (reply to 84439)

Vladislav: oh, I forgot to check one more thing  I create the connection at the moment the page loads, before waiting for it to fully load. Apparently the storage inside the UI package has not yet had time to load  so I moved my code into onMount method. And it works now :0

mohsen: Hello friends I am a Python developer who has worked on more than twenty of the top blockchains on the market. In your opinion, what are the ways to find remote job positions? Is upwork good?

Павел: Hi. I have a problem. I start learning @tonconnect/ui-react library. But I have disableds button and I have such some mistakes in console. What will I do?

Антон: GreenVault team is looking for a smart contract developer (FunC/Tact)  We are a young project in the DeFi sector on the TON blockchain. We need a talented developer to create smart contracts in FunC or Tact languages.  Requirements: - Experience in smart contract development - Knowledge of FunC and/or Tact - Understanding of TON blockchain principles - Experience with DeFi protocols is an advantage  Responsibilities: - Development and optimization of smart contracts - Participation in designing the architecture of DeFi applications - Interaction with the team for contract integration  We offer: - Work on innovative DeFi solutions - Opportunity for professional growth - % of profits after release  If you want to join the GreenVault team and create the future of decentralized finance, send us your resume in private messages.​​​​​​​​​​​​​​​​

Kinemcodes: Salary or wages? (reply to 84447)

Akki: ? (reply to 84448)

Антон: Only enthusiasm bro, but after release we offer % of our profit (reply to 84448)

Vladislav: You should disable Cross-Site Request Forgery, since you have http and not https Since you are running your site in development mode as I see  For example: I removed this line of code in my svelte.config.js  csrf: {    checkOrigin: true } (reply to 84446)

Павел: Is it middleware config? (reply to 84451)

Vladislav: Sorry, I'm not sure I understand what "middleware" means in this context  it's config for the svelte https://svelte.dev/ (reply to 84454)

Павел: I did not find place with this config in my project. This config used for midlewares slice? Is this config for http headers? (reply to 84455)

spencer: hi, im attempting to get information about StoneFi swap transactions in a given block. here is my current control flow (using pytoniq btw):  block: BlockIdExt = await self.client.lookup_block(workchain_id, shard, seqno) ext_transactions = await self.client.raw_get_block_transactions_ext(block=block[0])  then im iterating through the transactions and looking for 0f8a7ea5 (jetton transfer opcode). im able to pinpoint the transactions im looking for, but im having trouble getting information about the swap itself (token address, amount token, amount TON swapped, etc). is it possible to get this information from the transaction itself, or am i going about this the wrong way? i noticed that the jetton transfer opcode is included in the transaction's out_msgs body, which is a Cell. maybe i need to deserialize the Cell to get the information i need? attached the Cell structure below as well if it helps. any input appreciated!  720[0F8A7EA5000000186598EEF96034F815DAE20800EF3B9902A271B2A01C8938A523CFE24E71847AAEB6A620001ED44A77AC0E709D0037EF56FA125FF70327F2F7F19DA19210377E2B5908F5B5595F66C3A09C35B22B080EE6B281] -> {         878[2593856180022A16A3164C4D5AA3133F3110FF10496E00CA8AC8ABEFFC5027E024D33480C3EA03601D2FE3001F5A5370F91065195BFB19605743CFDFB1BE26359614DFC44F99AA85F9CBF9EAF0037EF56FA125FF70327F2F7F19DA19210377E2B5908F5B5595F66C3A09C35B22B0] }

&rey: You can decode forward payload of jetton transfer, yes. Though I don't know its TLB... (reply to 84459)

Vladislav: I just gave an example of how this problem is solved for svelte, since I use it. But if you have react or something else, you will not have this config, of course  Here is information about what this flag does https://kit.svelte.dev/docs/configuration#csrf (reply to 84456)

spencer: so that out_msg payload would correspond to this information? (reply to 84460)

&rey: Yes. Please remember that the only certain guarantee that swap will have occured is, well, jettons arriving at destination wallet after swap. (reply to 84464)

spencer: ok great. really dont know where to start in regards to deserializing cells, should i start on Ton's BOC docs?

Павел: Yes thank you for this link. Just like I thought. (reply to 84462)

spencer: fuck lol i just discovered that transactions are chained i was looking at the wrong one

spencer: this chain is boiling my blood but i love it

Stephan: hi guys, please help, I have 1000 of my token on my contract, what will the code that will send the token from the contract look like? in tact

User<7118587076>: Hello, how i can create tranfser nft payload with comment?

Lennox: Why is my wallet still not active?

slavagm: you need to send any transaction (reply to 84488)

Lennox: Is there a minimum threshold for amount to be sent? (reply to 84489)

slavagm: no, it just will complete wallet initialization (reply to 84490)

Lennox: Okay  Thank you

Lennox: Then I got a question, was given the aqua sbt NFT but when I switched my wallet version from v4R2 to W5, I can't see it in my collectibles yet it was there, what could be the issue?

TheGreatHB: Because both your wallet addresses are different. (reply to 84495)

Stephan: hi guys, please help, I have 1000 of my token on my contract, what will the code that will send the token from the contract look like? in tact

stacc: "overrides": {     "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",     "@ton-community/func-js": "0.6.3-tvmbeta.1" } npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1   are these on mainnet yet

Даниил: Guys, who knows how you can organize such a transaction  https://tonviewer.com/transaction/708d9b792111ecc483db457ec495d17c8bc2fd491040e9a534e4dc3f6c47227a  For example, sending tokens of 10 pieces to two different people in one transaction

Stephan: hi guys, please help, I have 1000 of my token on my contract, what will the code that will send the token from the contract look like? in tact

Prince: you mean, transfer? (reply to 84523)

Stephan: Yes (reply to 84524)

Prince: too easy

Stephan: How I can do it? (reply to 84526)

Conor: Hi - I'm trying to calculate a hash of a transaction before I send it - is it possible?  I've figured out how to calculate the message hash, but I would like to learn how to calculate the transaction hash.

Ryan: Hey guys, is there an equivalent for AND operator in FunC? Like “&&”?   I want to do something like if (A && B) {}

Victor: Hello, someone see some like this ?

— 2024-07-15 —

Almatbek: Are there any companies or projects seeking a skilled developer?

Sunny: Is there a Merkle proof Library or example on Ton?

^_^: Hi everyone, Have a good weekend? Now I'm gonna send the TON, USDT, BTC in mini app. How to send these tokens? Should I connect ton wallet of the telegram or create new one? If I connect TON wallet of TG, can I send the transaction for USDT and BTC using that wallet? Please let me know. Thank you.

Sunny: Is there a Merkle proof Library or example on Ton?

musashi: https://github.com/Gusarich/airdrop (reply to 84581)

0xAli: hello...

Anshu: I need a developer to assist me accepting TON using api  Preferred language : python   Dm me personally . Happy coding

Kaito Lee: hi all, i wanna know that maybe have lib or code for keccak256 on ton smartcontract ?

User<5323537699>: looking to hire TON dev , experienced with next js frontend

Lennox: Does that mean I will never get the NFT unless I go back to v4R2 version? (reply to 84499)

Ashees: Is there any FunC developer here?

slavagm: you can transfer your nfts to v5 (reply to 84615)

Kryptonite: can someone help me with this error ?

Kryptonite: why it showing cell underflow error ?

musashi: maybe your state init creator method not fit the storage layout (reply to 84625)

Kryptonite: but one of the testcase to check admin passed

Kryptonite: and if i change it, and then try to access it is giving underflow

User<7121766667>: hi, I'm interested in your project. Have rich experience in ton and next.js. DM me. (reply to 84612)

TheGreatHB: You can still access to v4 wallet as well as v5 wallet. Just connect to v4 wallet and transfer it to v5 wallet. (reply to 84615)

Ram: Hello, I'm trying to send an external message to my smart contract but it sends multiple messages to it. The first one succeeds but the others fail

Ram: does anyone know what might be causing it?

&rey: Begging is forbidden in TON chats. (reply to 84635)

Valamar.$888: Man cmon it's a joke 🤣

&rey: That should be OK. External message is retried while it is valid. (reply to 84636)

Ram: oh okay, my problem is it uses the TON in the smart contract every time the external message is run since it calls another contract (reply to 84644)

&rey: Then you should use replay protection. (reply to 84646)

Ram: oh okay you're right. Thanks! (reply to 84647)

Peng: Is there anyone else other than alex which handles ton docs? Kinda need help thx

Kat: do we have like dextool or birdeye on Ton?

Bohdan: hello, Maybe someone could help me. Is there a way to get seqno of a transaction using ton/ton npm lib?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 59 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 22  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

User<7118587076>: Hello, can someone please help me with transfer nft with comment?

Kryptonite: 9 Compute Phase Cell underflow. Read from slice primitive tried to read more bits or references than there are.  can anyone please help to understand (reply to 84625)

Kryptonite: whenever my opcode is using save_data() and then i am trying to access get method i am getting exit_code: 9

Smart Ƀart: Hi! Noob question: I have a private key, generated in a GoLang application. But when I try opening it in a JS project, I get another public key? How does this work with TON?

Laura: Please any dev in the who can help me reach out to telegram support ..

Laura: I would be so grateful for this

&rey: Your save_data must be mismatched with load_data. (reply to 84665)

&rey: {         'address': nft_address,         'amount': str(transfer_fee),         'payload': base64.urlsafe_b64encode(             begin_cell()             .store_uint(0x5fcc3d14, 32)  # op code for nft transfer message             .store_uint(0, 64)  # query_id             .store_address(recipient_address)  # new owner             .store_address(response_address or recipient_address)  # address send excess to             .store_uint(0, 1)             .store_coins(1)              .store_uint(0, 33)  # forward payload with opcode zero             .store_snake_string('your comment')             .end_cell()  # end cell             .to_boc()  # convert it to boc         ).decode('ascii')  # encode it to urlsafe base64     } (reply to 84662)

User<7118587076>: thank you, i will try (reply to 84670)

Smart Ƀart: Can someone please help? In both applications I'm using the wallet V3R2... opening the mnemonic results in different wallet addresses 🤷🏼‍♂️ (reply to 84666)

&rey: Are public keys (not addresses) same? (reply to 84672)

Smart Ƀart: No! That's the weird part (reply to 84673)

User<7118587076>: i think problem in my contract, do you know contracts with forward payload support (reply to 84670)

Smart Ƀart: I'm using this library in Go: "github.com/xssnick/tonutils-go/ton/wallet" And this in JS: import {TonClient, WalletContractV3R2} from "@ton/ton"; (reply to 84673)

&rey: And how do you calculate public key in JS without importing mnemonicToKeyPair? (reply to 84677)

Smart Ƀart: here's the code  // my array with space seperated mnemonic phrases  async function main() {     for (let i = 0; i < mnemonicPhrases.length; i++) {         console.log("Wallet number: ", i + 1)         const mnemonicPhraseString = mnemonicPhrases[i]         const mnemonicPhraseArray = mnemonicPhraseString.split(" ")         console.log(mnemonicPhraseArray);         const keyPair = await mnemonicToPrivateKey(mnemonicPhraseArray);          const workchain = 0;         const wallet = WalletContractV3R2.create({             workchain,             publicKey: keyPair.publicKey,         });         const contract = client.open(wallet);          console.log("Mnemonic phrase: ", mnemonicPhraseString)         console.log("pub key address: ", wallet.publicKey.toString());         console.log("wallet address: ", wallet.address.toString());      } } (reply to 84680)

Smart Ƀart: The wallet addresses generated with the GoLang code start with UQ and the ones with JS with EQ. When opening the mnemonics in TonKeeper I get another another wallet address.   What could go wrong? I'm pretty new to TON, so just trying to understand (reply to 84680)

&rey: this is OK And Tonkeeper uses v4r2 as default. (reply to 84682)

Catid: exsume  want to ask  when i try build my mini apps  then people buy item  transaction will go to my wallet  but result in boc  i cant confirm its success fail / pending  how to do that  iam in react

Jan-Willem: Does somebody know where to contact somebody for issues on toncenter?  I get an error when I try to get the transactions of an address: "LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time"

Apolo: Hi, can someone help to disable vertical scroll? Can’t find working solution

Guillaume: is it only me or toncenter is not working properly ?

Guillaume: I'm getting "500" errors

Jan-Willem: on tonviewer it's fine

Ruslan: Which method fails with 500? (reply to 84692)

Ruslan: Try to add archival=true

Guillaume: sendTransactions

Guillaume: testnet

Ruslan: There is no such a method (reply to 84698)

Guillaume: sendMessage ? (reply to 84700)

Guillaume: sorry it's sendBoc (reply to 84700)

Ruslan: Ah, okay. What exactly does it respond and how do you call this method? (reply to 84703)

Guillaume: it should be on my side then, I just wanted to check if the API was down before I started investigating (reply to 84704)

Ruslan: sendBoc can be called only as POST method. If you check it in browser then you get 500. Call toncenter.com/api/v2/getMasterchainInfo is better way to check the api outage. Or just take a look at tonstat.us (reply to 84705)

Sown: Hi, How can i parse the content Cell data result from getJettonData to a Js object? const { content } = await jettonRoot.getJettonData();

[+_-]: Good day everybody! I'm figuring out Jetton implementation right now, and I'm a bit confused with op::mint() operation as it don't handle revert case properly:  Here we are minting tokens and increasing the supply right after:         mint_tokens(to_address, jetton_wallet_code, amount, master_msg);         save_data(total_supply + jetton_amount, admin_address, content, jetton_wallet_code);  But, if there is a problem, we are not properly handling this case as contract has this code here:     if (flags & 1) { ;; ignore all bounced messages         return ();     } So, does it mean, if something goes wrong on receiver's side, we gonna get inconsistent state (our supply will include non-existent tokens)?

Lennox: Is it v5 or W5, and how do you do that (reply to 84622)

slavagm: just send nft to new address (reply to 84709)

Lennox: The NFT was yet to be minted, is it still transferrable? (reply to 84634)

Lennox: Even the NFT was yet to be minted? (reply to 84710)

Guillaume: thanks for your help. I found the issue, I was out of TON to pay for the gas... (reply to 84706)

Laura: Hi @ruslixag  Is it possible if you could help me reach out to support ... From my end they don't even reply ..  My friends telegram number got banned and there is this project we are working on now ... We've put so much hardwork effort and resources into this for it all to go to waste.. I would appreciate if you reply me ..so as to know the way forward with this thanks  Laura. (reply to 84700)

Eibrahim: Gm gm

Ruslan: Hello, do you mean a telegram bot or mini app? (reply to 84716)

Laura: The  telegram app itself ...  He can't log into his telegram account or have access to his wallet or any mini app (reply to 84720)

Laura: @ruslixag (reply to 84721)

Ruslan: Unfortunately you have to wait the response of the official support. You can try to ask in @devs if there is another way to restore access to your Telegram Mini Apps

0xbera: Hello! Couple of questions: - does TON have a mempool? - is there a validator schedule? how would I know what the next 2-3 validators are?

0xbera: Is there an example somewhere of a transfer message being constructed using cells?

Laura: Thanks @ruslixag I'm grateful for your response (reply to 84724)

Catid: exusme sir ruslan  i use ton connect to buy item in my apps  but when done  result in boc   how to confiim is transaction success / fails ?  cause in my wallet some transaction is check veify (reply to 84720)

Ruslan: Hello, first of all make sure you have sent this BOC in the blockchain. For example, you've called POST-request to toncenter.com/api/v2/sendBocReturnHash or to toncenter.com/api/v3/message. Then you could take a hash of the BOC and try to find the transaction in the blockchain using method toncenter.com/api/v3/transactionsByMessage with hash of your boc and direction="in". Call this method until you get the transaction. (reply to 84729)

Catid: thank you (reply to 84730)

Catid: one questtion  i use my wallet as a bank for receive the people purchase my item  its okay ? (reply to 84730)

Ruslan: If you mean you use it in your Mini app or Telegram bot to receive payments from your clients, then I'd recommend you to create another wallet and periodicaly withdraw TON from it to your main wallet.

Catid: mini apps (reply to 84736)

Ruslan: Yes, better create a separate wallet for your app. (reply to 84737)

Catid: okay thank you  very much  i got 25.000 user ton wallet in my mini apps  some payment is error cause checking scurity  its not my fault right (reply to 84738)

λ markus.py: Hello, I am building an application with TON, and I need to get all the transactions of the blockchain in real time. I thought about connecting with ADNL to a self-hosted liteserver node, but I am finding it difficult to find the exact way to get all transactions, if it's possible at all. I was wondering how explorer websites do it 🤔 Do they poll the block height and when it changes they get all candidates from the previous confirmed block?

Prince: My script is faster than dextools

λ markus.py: I would prefer if it were possible to get unconfirmed transactions too from the mempool, but confirmed-only is okay as well, since TON is fast at confirming them anyway.

λ markus.py: May I ask how it works, or if there are open source examples for my problem? (reply to 84741)

Prince: of course not. kk (reply to 84743)

Ruslan: For now you can use some indexer API. Here are three options: toncenter.com/api/v3/, tonapi.io, dton.io. In case of toncenter.com, you can run your own instance of indexer from this github: github.com/toncenter/ton-indexer, but it actually requires a powerful hardware and some effort. (reply to 84740)

Jan-Willem: I get an error when I try to get the transactions of an address: "LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time"  https://toncenter.com/api/v2/getTransactions?address=UQC0GM7WCQGIsfgGiOFJ4DHzKkIlGXag0MAelUFicdlTCl5T  On tonviewer it's all fine: https://tonviewer.com/UQDDI7K4HvpvKpZyDx775vXnIWOow0FH7pdQ6_llyTV08ziQ

Prince: you want that script? are you dev so that understand mine easily?

λ markus.py: Thanks! Does it work in real time? Or does it require polling? (reply to 84746)

Catid: mr ruslan please  its not my fault right ? (reply to 84739)

Ruslan: Try to add "archival=true" to your request. This error means that your request was dispatched to LiteServer, which GC'd history. (reply to 84747)

Cryptskii: Hey hey. Gm everyone. I'm looking for 1 experienced crypto and or game dev a hungry self starter with a track record of success for business end as well as if anyone know a wicked animator to hire for game cutscenes that will get added to our YouTube channel. We have a product that given the right additional people listed above, can definitely outshine the Hamsters. I have working demo and some awsome ways to sustain the value of our token as it will end up being the governance token for either  a dex/bridge for TON using zpks or or a private payment channel protocol using zkp and bridging for TON maybe looking at Dogecoin or BTC. Don't bother inquiring at this point unless you are cofounder material. Thanks. Have a great day all. We will post something in the future for more non core team /co-founder positions. If you are highly capable you can see for yourself that we also "walk the walk" not just 'talk the talk "  this project has been designed to be fun, simple, attention grabbing, and just enough outrageous aspects to be looked at as a fun telegram bot game that also happens to have a token. Mass adoption happens when  people are using it while barely Even realizing there was a difference. One day you Wael and your using it but without any changes in the users day to days. Like how got us using bank cards instead of checks or dvd instead of VHS. This starts with providing a user experience and appeal base on things you've target customers are already looking at and then sneaking the technology change in. In game Incentives work great up until the drop, for but the numbers aren't even close to what  is maintained LT.   Hamsters has the grind part set up well for ease of olanboarding and feel of accomplishment by providing mini goals as a read crumbs trail to keep it less redundant but they lack a strong storyline and narrative. Crypto exchange CEOs tend to get jail time lol. Our game follows a theme and narrative that has a proven track record of success and constant appeal. Some have their hype cycles but not this. It involves an emersive storyline but without any more attention involved that what is needed for Hamster Kombat. Aldo is you like GTAV art style, you'll for sure love our vibes 😎 if you think you have what it takes to help steer the ship, get at me

Catid: some payment is error cause checking scurity  its not my fault right (reply to 84752)

Ruslan: You didn't provide enoght details to figure this out. (reply to 84750)

λ markus.py: I am a developer, I have little experience with TON, so this is why I was asking for a tool to do it. (reply to 84748)

Jan-Willem: Thanks! That resolved it. (reply to 84752)

Catid: I mean when user send tx to pay item.  Some time tx is. Checking security and fail to deposit to my wallet.   Its not my fault right (reply to 84758)

Ruslan: Depends on your needs. Is this enought to process deposits and withdraws? Yes. Is this the fastest way to receive transactions? No, the fastest is to parse messages from the mempool, and then lookup for transactions manually (second part actually requires indexer). (reply to 84749)

Ruslan: If you check the transaction and see flag description.aborted=true and a message with TON in out_msgs, than this payment failed. (reply to 84762)

Cryptskii: Also not I have successful startup and exit already looking for those like me ty

Ruslan: You may find some information about how to monitor mempool in this chat: @pythonnton (reply to 84749)

λ markus.py: Thanks, your help is really appreciated 🙏🏻 I was wondering, since TON nodes are sharded, does that mean I can only see part of the mempool or can I get all the transactions in the blockchain? (reply to 84764)

Ruslan: TON nodes now store all existing shards (reply to 84770)

^_^: Hi everyone, When I'm using this code. const [invoice] = initInvoice(); this error Type 'Invoice' is not an array type.ts why and how to fix this? please help me...))

Ruslan: Here is a usefull link of mempool listener: https://github.com/yungwine/ton-mempool (reply to 84770)

Hoi: Is there a best practice for the func throw error code? I see sometimes we use 3, 1001, 98 on the tutorials, just wondering if there is any reference to it?

Almatbek: I am a dev you are looking for (reply to 84754)

Almatbek: I am here, smart contract developer (reply to 84685)

Conor: How can I calculate a TON transaction hash before sending the transaction on chain? not the message hash

&rey: You can't, because you don't know created_at and created_lt in advance. (reply to 84785)

jUTON Ⓜ️ MEMES 🦴: Hi

SMI: Hey

Denisa: Hi

Constantine: Hello everyone! I have a problem with sending tons (in MAINNET, NOT a testnet). I got a free api-key to use toncenter API. I make a post request to send tons. Then i get a response with a successful status code (200), but the transaction doesn't happen! I tried to use toncenter api v2 and v3 — the result is the same.  I sure that seqno and mnemonic are right (when I pass the wrong value of one of them expressly, I just catch an error in my try/catch block of code). I use TonSdk .Net for C# (i know that it's not a popular way to work with Ton, but i think my problem is pretty general). I also added the console output to view the response of toncenter, so here it is: response as itself: {   "Version": "1.1",   "Content": {     "Headers": [       {         "Key": "Content-Type",         "Value": [           "application/json"         ]       },       {         "Key": "Content-Length",         "Value": [           "63"         ]       }     ]   },   "StatusCode": 200,   "ReasonPhrase": "OK",   "Headers": [     {       "Key": "Date",       "Value": [         "Fri, 12 Jul 2024 23:55:26 GMT"       ]     },     {       "Key": "Connection",       "Value": [         "keep-alive"       ]     },     {       "Key": "Access-Control-Allow-Origin",       "Value": [         "*"       ]     },     {       "Key": "Access-Control-Allow-Methods",       "Value": [         "GET, POST, OPTIONS"       ]     },     {       "Key": "Access-Control-Allow-Headers",       "Value": [         "User-Agent,Keep-Alive,Content-Type,X-API-Key,X-Ton-Client-Version"       ]     },     {       "Key": "CF-Cache-Status",       "Value": [         "DYNAMIC"       ]     },     {       "Key": "Server",       "Value": [         "cloudflare"       ]     },     {       "Key": "CF-RAY",       "Value": [         "8a24f6cfcd591db1-FRA"       ]     }   ],   "TrailingHeaders": [],   "RequestMessage": {     "Version": "1.1",     "VersionPolicy": 0,     "Content": {       "Headers": [         {           "Key": "Content-Type",           "Value": [             "application/json; charset=utf-8"           ]         },         {           "Key": "Content-Length",           "Value": [             "286"           ]         }       ]     },     "Method": {       "Method": "POST"     },     "RequestUri": "https://toncenter.com:443/api/v3/message",     "Headers": [       {         "Key": "X-API-Key",         "Value": [           "HERE IS MY TONCENTER API KEY"         ]       }     ],     "Properties": {},     "Options": {}   },   "IsSuccessStatusCode": true }  response.Content.ReadAsStringAsync(): "{\"message_hash\":\"JKKwXRW99f9pQHmm7lB4aAjtTzSYZk07nmATtchv3rI=\"}"  I get it when i use toncenter api v3. Then I trying to search for the transaction using this message_hash on the tonviewer or tonscan and every time i get 404. What is interesting (and i dont know — is it because of the lib I use or not🤷‍♂️) — when I use api v2, the last strings will be: response.Content.ReadAsStringAsync(): "{\"ok\":true,\"result\":{\"@type\":\"ok\",\"@extra\":\"1721005373.9275637:5:0.8041017270676435\"},\"id\":\"1\",\"jsonrpc\":\"2.0\"}"  What also is interesting — there is no problems with get methods. I succesfully get the right seqno for my wallet. Also, in another part of my project, i easily run a get-method to search for transaction by msg_hash wich i get when user sends tons to me using tonconnect.  So what can be the reason??? Is it because of my api-key is free (i mean, i use a free plan on toncenter api)??? After all the research i done, i find it the only possible reason🤷‍♂️  Help me please😩😩😩

Denisa: Hello, I am trying to run some custom logic when a specific transaction has been sucessfully completed. Currently, when I send the transaction I get back a bag of cells that i have no ideea how to decode. I need to somehow get the transaction(s) hash so that I can later on validate that it has completed successfully. Can anyone help me achieve this? This is the code that makes the transaction.  const response = tonConnectUI.sendTransaction({           messages: [             {               address: args.to.toString(),               amount: args.value.toString(),               payload: args.body?.toBoc().toString('base64'),             },           ],           validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve         });  How do i decode the bag of Cells that is the response?

0xbera: so, after sending the sending the transaction -- how does one monitor its progress on the chain? (reply to 84786)

Kono: Hello. I can build website & smart contracts and tg bots for meme coin & dApps. Does anyone need?

&rey: Poll transaction history for one of contracts in chain. (reply to 84811)

&rey: This is to be expected. Please try searching after 30s at least. Also, messages may sometimes get lost in mempool. (reply to 84804)

0xbera: fair .. but even when I do this .. how do I recognize a specific tx? In other chains I typically have a tx hash I can match on.. (reply to 84815)

&rey: Here, if you poll on sender contract, you may match in_msg with BOC you have (or its hash). (reply to 84818)

🌊: Halo

Constantine: The problem is that i DO NOT "bombing" ton blockchain at all. It doesn't matter how much time i wait to do a new post-request. The result is the same...  So, as i see the situation, my messages ALWAYS get lost in mempool🤷‍♂  Can the upgrade to some paid plan (at least the cheapest one) fix the situation? (2.5 Ton isn't a big amount of money, but anyway i dont wanna waste it with no effort) (reply to 84817)

&rey: You can try sending message via Orbs. (reply to 84827)

Constantine: Ok, i will think about it. Thanks for support🙏 (reply to 84828)

Buggy: Who need 200 test Ton?

🌊: hello, is there anyone here who can help me regarding sending boom tokens?

🌊: I have sent boom tokens to the boom contract semrt address. Can you please help me solve this??🙏

0xbera: What are orbs? Can you provide a link maybe? (reply to 84828)

&rey: Here it is. https://www.orbs.com/ton-access/. (reply to 84841)

:D: tonConnectUI.sendTransaction(transaction).then((result) => {       const boc = result.boc       const hash = Cell.fromBoc(Buffer.from(boc, 'base64'))[0].hash().toString('hex')       console.log('result', result)       console.log(hash)     })  im using tonConnect to send a transaction. However, the hash retrieved from the boc output doesn't match up to the actual tx hash. how can I retrieve the tx hash from this output?

Snow Lee: You can search for the Retry function on Tonconnect notebook (reply to 84843)

Snow Lee: It has all the answer you needs in term of converting the boc to the hash you need

Snow Lee: And a working example too

SMI: j

SMI: Hello, I try to get a transaction response data but i get an error from the RPC with "invalid hash" but the

:D: gotcha, tysm (reply to 84851)

Egene: Hello!  We are trying to use Tonconnect in a front end only react app and it works when running via HTTP however when we put it behind an HTTPS Reverse Proxy when attempting to connect a wallet we get an error: Uncaught (in promise) Error: Decryption error:   message: <...>  sender pubkey: <...> keypair pubkey: <...> keypair secretkey: <...>      at fh.decrypt (index-Ds1v7hLF.js:73:58900)     at yc.<anonymous> (index-Ds1v7hLF.js:91:19322)     at Generator.next (<anonymous>)     at index-Ds1v7hLF.js:90:703     at new Promise (<anonymous>)     at $e (index-Ds1v7hLF.js:90:503)     at yc.gatewayListener (index-Ds1v7hLF.js:91:19242)     at yc.<anonymous> (index-Ds1v7hLF.js:91:19195)     at Generator.next (<anonymous>)     at index-Ds1v7hLF.js:90:703   Has anyone else seen this?

:D: found it, thanks! (reply to 84857)

SMI: Can you give a link pls (reply to 84851)

:D: https://docs.ton.org/develop/dapps/cookbook ctrl-f "retry" (reply to 84871)

Snow Lee: I recommend uping the retry interval to maybe 3-4 seconds to reduce the api rate limit (reply to 84872)

Snow Lee: Seeing the free keys only have 10 request per second and on a large scale it could timeout your function

:D: gotcha, im just pinging an api rn on the client side to get the info I need rn (reply to 84873)

:D: since they probably wont be ratelimited there

:D: coincidentally, are you familiar with more reliable api options for larger scale projects? eg. 50-100rps kinda deal (reply to 84874)

Snow Lee: Tonapi is the best choice, and not that expensive

:D: even with archival liteservers only(archival=true), I do hit some errors occasionally

Snow Lee: It's like 95 dollars but 100 req/s

:D: doesn't seem too bad at that scale

:D: coincidentally, would you know if the ton/ton and tonconnect libraries are looking for contributors? i extended them w some functionality for my own project and might clean them up and submit a pr

Snow Lee: Nah man, out of my hands atm. What are those functions?

:D: i mainly added helper functions to the ton/ton TonClient class , like filtering for coins value, lt values, timestamps etc I also made stuff like getTransaction more complete by adding an archival parameter etc

:D: just to make it easier for me

:D: didn't really make sense to me how getTransaction(which has no parameter for archival liteservers) called getTransactions which has an archival opt...stuff like that haha

Snow Lee: Have you figured out a way for ton/ton sendTransaction to return output without having to crawl the hash like the frontend do? (reply to 84887)

Snow Lee: Because on tonconnectui they returned a boc which can be decrypt to a hash, i need to do that but on ton/ton

Kryptonite: can someone please help me to understand what does action code 34 states

Kryptonite: as per documentation it says invalid action or not supported action

Frankovitz: Hi guys, how to check if the wallet own specific NFTs using Tonweb? Just can't find any guide, even in official docs.  Or there is a better way maybe?

:D: hm...I haven't had the need to do that yet so no, could take a look though (reply to 84891)

:D: depends on which wallet contract you are using (reply to 84895)

:D: if you're using v4 see here https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc

:D: line 81

User<7118587076>: Can i pay for other user commision ?

boot adbot: query id doesnt matter

JesusAlpha: Hi, hm I'm fighting with this, I'm using global servers https://ton.org/global.config.json, why this dosent work, anyone have this same problem before?

Rudolf: Hi guys, what is the fastest way to swap tokens on TON? I'm new here, so sorry for stupid question. Does it have something like JITO on Solana? Do I need to use private rpc or something else, which library (adnl/tonlib/etc)? Thank you for any advice

kevin: you need a indexer (reply to 84740)

— 2024-07-16 —

Cryptskii: is the someone fron TON team in here?

User<6187875701>: How can I in my contract? I will put TAX in TON

charlie: Hey how can I stake in a single nomination pool on Ton Testnet?  could u share an nominator pool to stake on testnet?

kevin: Hi, anybody know how to create pTON wallet for my wallet contract programmatically ?

mind: ？

mind: Why can't I send tutorial links? Your tutorial on mint nft is incorrect

mind: This directly made me lose confidence in Ton. Why are all the wrong tutorials placed on the official website, misleading developers

Harry: Can the TON package detect changes when a user switches between multiple Telegram accounts on the same device? For example, when I close a mini app connected to my first account, switch account and then open it with my second account, it still shows the wallet from my first account. How can I ensure the mini app recognizes the change in Telegram accounts?

kevin: anyone has good SDK for ston.fi in Golang.

0xbera: /me

Lipids: hey, does anyone have a contract example of a tax-reflection jetton on ton?

0xbera: the toncenter getTransactions query accetpts an lt parameter ("Logical time of transaction to start with, must be sent with hash.")  how do I know / obtain the hash though?

jessepinkman: hi everyone! new to ton, have worked with evm before. can i ask techincal questions here?

sjvczjdylb: hi (reply to 85029)

mind: I suggest that you use Blueprint directly to improve this tutorial for developing contracts on the Ton chain. Other tutorials are outdated and leave developers confused

mind: @tsivarev

sjvczjdylb: hdonmcs

Ali: Hi , Why fees on cotracts on ton network are very high?

&rey: Are they? (reply to 85038)

&rey: Yes, this is the right chat. (reply to 85027)

Ali: Yes For swap more than 1 $ For stake and unstake more than 1$  For others more than 1$ (reply to 85039)

0xbera: I am using getblock.io as an RPC provider .. how do I get a lite client that is configured to talk to getblock.io?

&rey: I've just seen that a two-hop swap uses 0.06 TON. Maybe you're using less efficient platform?  To my knowledge true staking returns almost all TON sent for fees so that isn't more than $1. Liquid staking may have higher fees because of larger amount of users, yes, but that still depends on provider. (reply to 85043)

Inayat: I am getting when trying to transfer jettons.  Any Idea? can someone help?

Javen: Hi guys, i need help.  Does TON liteserver Node have auto prune function or how to prune manually? That would be so large data for a while.

Harry: Can the TON package detect changes when a user switches between multiple Telegram accounts on the same device? For example, when I close a mini app connected to my first account, switch account and then open it with my second account, it still shows the wallet from my first account. How can I ensure the mini app recognizes the change in Telegram accounts?  anyone, help

mind: Error: Function run is missing!     at run (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/node_modules/@ton/blueprint/dist/cli/run.js:22:15)     at processTicksAndRejections (node:internal/process/task_queues:95:5)     at async main (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/node_modules/@ton/blueprint/dist/cli/cli.js:91:5)

Thiru | Metis: hey  I need sign a transfer transaction from node backend  please let me know which sdk i should use

Thiru | Metis: const { mnemonicNew, mnemonicToPrivateKey }  = require( "@ton/crypto");  // Create Client const client = new TonClient({   endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', });  // Generate new key   const func = async ( ) => {    // mnemonic generated     let mnemonics = await mnemonicNew();      console.log("mne", mnemonics);      // replaced with my mnemonics from TON Keeper app     mnemonics = [ 'seek',     'decade',     'midnight',     'year',     'zebra',     'duck',     'stumble',     'satoshi',     'erosion',     'accuse',     'desk',     'share',     'oxygen',     'blade',     'illness',     'arena',     'equip',     'promote',     'inner',     'mind',     'hero',     'attend',     'chimney',     'drift' ]      console.log("mne", mnemonics);          // generating keypair from mnemonics let keyPair = await mnemonicToPrivateKey(mnemonics);  //logging the keypair console.log("pair",keyPair);   // Create wallet contract let workchain = 0; // Usually you need a workchain 0  // creating a wallet instance let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });  console.log("wallet",wallet);   // all the address are considered as contracts, so we need a contract instance to interact with any accounts let contract = client.open(wallet);  // logging the contract instance console.log("contract",contract);   // Get balance let balance = await contract.getBalance();  //logging the balance console.log("balance",balance);   // Get Wallet Seqno let seqno = await contract.getSeqno();  // logging the seqno console.log("seqno", seqno);  let transfer = await contract.createTransfer({   seqno,   secretKey: keyPair.secretKey,   messages: [internal({     value: '1.5',     to: 'EQB_AmFKfZ3yIKdc7q7rKWV2gUKxTvfzQRwBoqLw98D9BiMp',     body: 'Hello world',   })] });  console.log("t");    // console.log("transfer",transfer);  // let sendd = await contract.sender(keyPair.secretKey) // console.log("sendd", sendd);   // sendd.send({    value: '0.5', // to: 'EQB_AmFKfZ3yIKdc7q7rKWV2gUKxTvfzQRwBoqLw98D9BiMp',  // })  try {   // const tx = await contract.sendTransfer({   //   messages:  [internal({   //     value: '1',   //     to: 'EQB_AmFKfZ3yIKdc7q7rKWV2gUKxTvfzQRwBoqLw98D9BiMp',   //     body: 'Hello world',   //   })],   //   seqno:seqno, secretKey:  keyPair.secretKey,        // })      // console.log("tx",tx);    // const bal = await client.getBalance("EQB_AmFKfZ3yIKdc7q7rKWV2gUKxTvfzQRwBoqLw98D9BiMp")   // console.log("Caavba",bal);  } catch (error) {   // console.log("error in transfer", error);   console.log("error", error); }    }  func()   i tried with the above code but i am getting rate limit error with status code 429

Thiru | Metis: don't worry i don't use this wallet with real funds

Thiru | Metis: is there anyone can help It's very urgent

mind: Error: Unable to execute get method. Got exit_code: 9     at TonClient.runMethod (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/node_modules/@ton/ton/dist/client/TonClient.js:42:19)     at processTicksAndRejections (node:internal/process/task_queues:95:5)     at async Object.get (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/node_modules/@ton/ton/dist/client/TonClient.js:364:26)     at async LinkLayerNft.getCollectionData (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/wrappers/LinkLayerNft.ts:23:24)     at a.  why??????

11: Hi all. In blueprint is there already a function to move unix time in the blockchain when testing?

User<7008447298>: Hello, everyoneI am a full stack and blockchain developer I have built lots of smart contracts, gaming (tap-to-earn game), DeFi projects and also supported NFT marketplace using Solidity, Rust, Solana, FunC and etcAnd I am proficient with React, Next.js, Vue.js, Nuxt.js, Svelte.js, Web3.js, C++, Python, Golang, Node.js, Express.js, Nest.js, and so on Also am experienced with Server hosting(AWS Lambda, AWS EC2, Nginx and etc.)Am looking for a developer position

jim: Has anyone had any problems with node synchronization?

Peng: Have anyone sucessfully deploy Ton node in docker?

Peng: u deploying this on vm itself? or in docker (reply to 85085)

jim: We were running normally until yesterday (reply to 85086)

Peng: no i mean ur node, isit inside a docker container? (reply to 85088)

jim: We are running on a kubernetes cluster (reply to 85087)

Prince: Hi, is there any way we can swap on dedust as fast as I can? set the ton high or any method?

mind: export async function run() {    const nft = LinkLayerNft.createFromAddress(nftCollectionAddress);    const nftContract = toncenter.open(nft);     await nftContract.getCollectionData() }

mind: async getCollectionData(provider: ContractProvider) {         const result = await provider.get('get_collection_data', []);         let nextItemIndex = result.stack.readBigNumber();         let contentRoot = result.stack.readCell();         let owner = result.stack.readAddress();              console.log('Collection info, from get_collection_data() method:')           console.log('Next item index:', nextItemIndex.toString());         console.log('Content root cell:', contentRoot);         console.log('Collection owner adress:', owner);              return nextItemIndex;     }

mind: but error : Error: Unable to execute get method. Got exit_code: 9     at TonClient.runMethod (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/node_modules/@ton/ton/dist/client/TonClient.js:42:19)     at processTicksAndRejections (node:internal/process/task_queues:95:5)     at async Object.get (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/node_modules/@ton/ton/dist/client/TonClient.js:364:26)     at async LinkLayerNft.getCollectionData (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/wrappers/LinkLayerNft.ts:23:24)     at async Object.run (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/scripts/getCollectionDta.ts:15:4)     at async run (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/node_modules/@ton/blueprint/dist/cli/run.js:25:5)     at async main (/Users/carver/workspace/tonProject/blue-frame-test/LinkLayer-Contracts/node_modules/@ton/blueprint/dist/cli/cli.js:91:5)

mind: ❓

Anuj: Hello everyone

Anuj: I am trying to follow the tonhelloworld-> 02-contract. When I run the script to deploy the contract, it goes through but I see in testnet/address/EQAbm8T2Yw9q2n-6tHnVUctJUNLAvFC6D8JoV8OEyjxOdgMr the contract is inactive. What could be the reason for that ?

Prince: Hi, is there any way we can swap on dedust as fast as I can? set the ton high or any method?

Prince: who can please help me?

mind: nobody

mind: The official tutorial of Ton is very poor, and there is no one in the group to answer it. How to develop the developer ecosystem

mind: I tried several tutorials, but they all ended in failure and there was no one to guide me

芭比Q: anyone who knows how to use tonweb send transation to custom contract. i use tonweb 【wallet.methods.transfer(params).send()】code it's only send ton coin, It seems that the opcode is not recognized

Mohan: Same question here (reply to 85119)

Prince: I want to swap in lightening speed

Mohan: No one answering that (reply to 85118)

Alfred: I can only do it by try and think what's happening.

Mohan: I believe in TON, But when comes to their management or admins, they are not responding well (reply to 85124)

mind: I think their documentation is too old, and I don't think they have put it into practice themselves. If the official wants to promote blueprint, why not do a good tutorial like Hardhat

mind: I tried mintnft and mintoken, but they all ended in failure and no one replied. How can I become a ton dapp developer

Андрей: Administrators are called only when you need to ban someone. (reply to 85128)

F: / (reply to 85132)

Alfred: It seems that the Telegram is contacting Polygon?

mind: I personally think it's because Ton's application ecosystem cannot be developed, mainly due to poor documentation and development tools that are not easy to use, resulting in no developers willing to continue. Therefore, Polygon CDK is needed to support the ecosystem

芭比Q: is anyone  know this? cell data is sent as a payload comment (reply to 85121)

0xbera: is there a way to see what shardchains exist and which validator is in charge of which shardchain?

Sumit: How can i increase timestamp in typescript tests so that i can test my rewards calculation in my contract?

&rey: Maybe there is parameter like blockchain.now? @imsk_17: this also goes to you. (reply to 85082)

&rey: The masterchain, where all system contracts are.

&rey: Do you want to interact with contracts or to develop new ones?  The former might be best solved with pytoniq, because of various connection options and etc. Some code snippets in documentation are in Python already, some may need changing syntax from another language, but there is even no control flow to rewrite. (reply to 85119)

&rey: You should wait 1.1 seconds between adjacent requests like getBalance, getSeqno or sendTransfer. (reply to 85074)

&rey: This is commonly solved using setTimeout and Promise constructor.

&rey: Bounty applications are generally evaluated by idea and its range of users, not by keywords or well-polished wording. (reply to 84509)

&rey: If you hesitate, you might be able to explain your idea here?

Kryptonite: if you are using blueprint blockchain.now = <desired_timestamp> (reply to 85148)

Gad: Is there any way to contact Ton Foundation or Ton Starter directly?  Applied to their accelerator programs ~2weeks ago an no one even saw the deck I sent.

D: Hi, we can use @ton package in nodejs (reply to 84804)

D: So use @ton/ton and @ton/core, and you should make payload

11: thx！ This is what I need. (reply to 85150)

Qi: Hi pros

Qi: Is there method to transfer USD to TON Coin in is code

Qi: Js code

Денис: Hello everyone. Tell me how to implement the following solidity code on tact, given that in TON mapping users it is a smart contract with its state? Thanks  while (users[_user].uplines[_round] == 0) {             _user = users[_user].uplines[0];         }

Smart Ƀart: Hi! Does STON.fi have a developer telegram chat for questions?

Eibrahim: Regarding this looking to start something soon to make it easier  It has not been easy for me too while learning (reply to 85119)

Creator: Hi all. Guys, who knows how to get a block (shard or master) using transaction info? Those. by hash, lt, and similar information? Or liteclient dont know ? I write in Python.

Smart Ƀart: I'm running into trouble with the ston.fi SDK, is there a specific telegram group to ask, or can I ask here?

&rey: Depends on your contract architecture; it might unroll into a similar loop if everything is in one contract, or might become a message chain. (reply to 85199)

Catid: exusme anyone can tell me what is payload on ton ?

&rey: Part of cell which tells destination contract how to process the message. For TON sending, it is either empty or 32 zero bits with UTF-8 comment following. Comment is normally ignored by contracts. (reply to 85207)

&rey: The method https://github.com/yungwine/pytoniq/blob/ea967cd13d37e9e5e5035a6d8132a6a1abc0d5a4/pytoniq/liteclient/client.py#L733 returns block IDs. (reply to 85204)

Catid: if you send tons  you just don't need to pay for loading, right?   if send ton to buy item what need payload   while the tons sent are from wallet A to wallet B (reply to 85209)

&rey: If you send TON, you don't need payload, right. For buying NFTs, it is not standard and should be checked against specific sale contract.

Catid: thank you (reply to 85212)

Nguyễn Văn Tâm: /

Smart Ƀart: I'm trying to run runGetMethod through JsonRPC and get a 405 response, but I don't get why...  {"id":"1","jsonrpc":"2.0","method":"runGetMethod","params":{"address":"EQC0KYVZpwR-dTkPwVRqagH2D31he931R7oUbPIBo_77F97K","method":"get_wallet_address","stack":[["tvm.Slice","te6cckEBAQEAJAAAQ4AO87mQKicbKgHIk4pSPP4k5xhHqutqYgAB7USnesDnCdASkmt4"]]}}'  I'm using getblock.io as RPC provider. This is part of the ston.fi SDK which doesn't work... I grabbed the address from some random token on Dextools, with a get_wallet_address method in the contract.

Ankit j: Any process to create new manifest url  ? I am getting error on live regarding manifest url..

Zero: Hey what's ton's testnet RPC?

Alexander: Hi! I found a potential vulnerability that could be caused by following the official TON documentation in the context of backend authorization through TON Connect. In the section Checking ton_proof on Server Side#4 it is suggested to check the timestamp that came from the client side. Despite the fact that such a timestamp is part of the signed data, the wallet can still set it to any value. Therefore, we cannot ensure the correctness of "is actual at the moment" statement verifying based on this value. If you'd like to implement a timeout/expire for your payload, it might be worth saving the timestamp on the backend or including it in the signed payload.

Soniya | öřbïş86: Hey guys. Does anyone know if Unity based games can be integrated with TMA with WebGL? If yes, what are the limitations?

Kryptonite: can i send target TON and its fees separately ?

Kryptonite: to maintain state on my smart contract

musashi: yes using PAY_GAS_SEPARATELY send mode (reply to 85231)

Kryptonite: so if i want to send 10 TONs i send 10 and state stores 10

Kryptonite: but still no luck

Kryptonite: await provider.internal(via,{             value:opts.value,             sendMode:SendMode.PAY_GAS_SEPARATELY,             body:beginCell()                 . storeUint(Opcodes.deposit,32)                 . endCell()         }); (reply to 85234)

Eibrahim: Who here is building challenge app

Kryptonite: i am trying to store msg_value on smart contract state

Smart Ƀart: Can somebody explain to me why this swap failed?  https://tonviewer.com/transaction/92c5cb81b9e88f162fb62d7172e817c0df7484d0403f845f82b0081fd4c015de?section=trace

Vladimir: Hey Alexander! I hope that timestamp isn't for trusting/using/saving, it's for checking that signed data is not too old and not outdated, what do you think? (reply to 85222)

Alexander: You can not check, that signed data is not too old and not outdated based on that timestamp. Because the wallet (i.e. user) can set any value that will be for example from the future. (reply to 85244)

Stephan: hi guys, please help, I have 1000 of my token on my contract, what will the code that will send the token from the contract look like? contract in tact

Prince: if I have address 0: ... then How can I convert it into UQ... EQ... ?

Prince: Should I use TonWeb?

&rey: @ton/core is a better choice if your project has Typescript. (reply to 85249)

Prince: which function?

&rey: Address.parse('src').toString({userFriendly: true, bounceable: false}) IIRC (reply to 85251)

Vladimir: This is defense of stealing user data by MITM attack and preventing future usage by hacker, not protecting from your case against user himself is evil

&rey: Send message defined by structure https://t.me/tondev_eng/82288 to your jetton wallet, probably indicated in admin's incoming message. (reply to 85247)

User<7342101956>: Friends, please tell me.    I have a smart contract developed by Tact using BluePrint.  Now I want to make a web2 interface so that everyone can deploy their smart contract in the same way when they click on a button. (Well, I’m still collecting data through the form)  I'm writing an application in React.  It’s not clear how to deploy a smart contract. In Blueprint, the framework does this and compiles 2 times.   How can you do this in a react? Maybe there are guides?  My hypotheses must be some compiled moments after the blue print. Which I just somehow insert into the TS. It’s not clear what kind of instance it is and where to find it? Somewhere in the buffer data?  Thanks if anyone answers ;)

[+_-]: Good day everybody!  Maybe a silly question, but I don't quite understand why when building a message in a short form  with .store_uint(0, 1 + 4 + 4 + 4 + 64 + 32 + 32 + 1 + 1 + 1) line, two VarUInteger 16 values (ihr_fee and fwd_fee) are each encoded with 4 bits?

[+_-]: Can you please clearify, what sort of problem you are facing due contract deployment?  Anyway, if you are building an app, you can compile and deploy any contract via functionality, that is declared by default in blueprint project template, that you can create with $ npm create ton@latest (reply to 85268)

User<7342101956>: Am I understanding correctly that I can't use React and Blueprint at the same time? Should I use the ton library for server deployment? (reply to 85271)

[+_-]: Aw, so you meant that the idea was to compile and deploy contract on the front-end side of application, right?  I haven't tried such an approach, but I think task separation between your frontend and backend sides of application gonna be a really good decision anyway (reply to 85272)

User<7342101956>: I don’t understand how you can pass the user signature to the back end.  Let's say I have a back end with blueprint. I don't quite understand how I can pass the user's transaction signature to the back end (reply to 85273)

:D: is the toncenter api as bad as mainnet as for testnet?

&rey: No, plus Orbs is rather stable for mainnet. (reply to 85275)

[+_-]: Try checking Verifying signed in users on backend part of the documentation (reply to 85274)

User<7342101956>: Thx! (reply to 85277)

:D: gotcha, orbs is not operational for testnet right? (reply to 85276)

&rey: Your contract artifacts should be in some directory like build/ or like. They should be copied into dApp code, then it's easy to deploy contracts without interaction with backend. (reply to 85268)

&rey: By the way, dApps without server don't need to enable tonProof.

ry4n: How to change contract metadata after renouncing?

&rey: It is impossible by definition of renouncing. (reply to 85283)

Carter🧹: When analysing the internal Jetton Wallet msg InternalMsgBody, is the address the tokens are going, always the response_address, or is it possible that this could be a different address than the recipient of the tokens?  I'm trying to track transfers which do not emit a Transfer Notification.

bandhanrabidas8@gmail.com: Hi

Sumit: Cannot reduce expression to a constant integer    141 |     fun calculateAPY(start: Int, token_decimals: Int, total_supply: Int, rewards: Int): Int { > 142 |         let decimals_amount: Int = pow(10, token_decimals);                                                    ^~~~~~~~~~~~~~   143 |         self.ensure_scale(decimals_amount, total_supply, rewards);

Sumit: why am i having this error when pow is available at run time

Gleb: Searching for Front End Team Lead. Equity project

Smart Ƀart: If I'm trying to connect to STON.fi with their SDK, this is the correct router address?  const router = client.open(new DEX.v2.Router("EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt"));

a14: Hi i want to deploy a jetton but i get this error when trying to:   LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction E06520053CA3805BCBBC0A46BA739FB2CA41A3E7E2AD19F397AF6F33699E4B5A: exitcode=0, steps=0, gas_used=0  Any idea how to debug such an error?

I'm: Hi everyone, I want to create a Ton smart contract that can receive an array of wallet and check it's balance in only one request.  1. Does Ton VM support it? 2. Do I have to pay the gas for each wallet to check its balance? In Ethereum, it is free.  Hope to see your help. Thank for your support.

Amir: Hey bro did you find any solutions? (reply to 84869)

Egene: It was extremely weird, it just stopped working out of the blue without any changes in our end.  What's even weirder is that it only did not work when being served via an HTTPS proxy. We tried switching from Apache to Nginx and had the exact same issue. Double checked all configs - nothing.  Then we compared the configs with another WebApp we have that also uses TonConnect. The configs were identical.  What we did was deployed the WebApp in place of the other working WebApp and the problem was magical fixed.  We suspect it had something to do with the fact that the subdomain used starts with a number and Tonconnect does not like it for some reason 🤷‍♂  But that's not certain, we have not investigated the problem further. (reply to 85308)

Almatbek: Could there be an opportunity for a capable developer to contribute to your project?

Alfred: 1. Nope. 2. For offchain client, you don't need to pay the gas unless it's a external call. (reply to 85305)

— 2024-07-17 —

Женя У: Why @tonconnect/ui has this problem? Thanks

Kraven: Can some one guide me how to send jetton in js

Paul: As my understand, you want to do it in smartContract. Now wallet contract and jetton standard does not have optcodes to get balance, so cannot check balance ton and jetton in smartcontract. Need to verify before call sc. (reply to 85305)

Fortuné: HI everyone, I create a new token on TON by using ton miner, everything works fine, but it doesn't appear on new pairs of Dextools. Do anyone have this issue?

musashi: did you add liquidity for it on dexes? (reply to 85358)

Fortuné: yes, I added the lq on dedust (reply to 85359)

musashi: maybe dextools need time for sync

Anton: What tact version are you using? (reply to 85297)

Fortuné: Hi everyone, is there a way to create a new pair on TON without code?

cosdy: is there any best practice on how to handle bounce message ?

Prince: you mean, creating pool? (reply to 85363)

kevin: anybody looking a developer pls PM, I am fullstack developer know TON well.

a14: Hi i want to deploy a jetton but i get this error when trying to:   LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction E06520053CA3805BCBBC0A46BA739FB2CA41A3E7E2AD19F397AF6F33699E4B5A: exitcode=0, steps=0, gas_used=0  Any idea how to debug such an error?

Kashish: Like I wrote a contract in FunC language in vs code now I want to deploy it locally to check whether the contract is error free and also I want to interact locally with the functions perform transactions and then deploy to testnet network. Eg. For above purpose in solidity language Remix exist same kind of thing am asking for funC language

mahdi: /

Himu Globin: Anyone building indie games/gaming studio here guys? multi-player/single player would love to know more and collaborate.

Agusti: /stat@combot

Prince: I think no opensource... but exist (reply to 85363)

User<7121766667>: Hello, I need ton smart contract developer, who can help me? If you are interested, please DM me.

Development: I'm looking for paid tasks, wallet address for communication not-underground.ton

Prince: What do you need? IF you just want consulting, we can tell you. (reply to 85396)

Prince: here.

Raf: Hey guys, I want to build a simple ping/pong contract where a string is toggled, I'm not used to work with slice, can someone help me ?? thanks a lot, this is what I want to build :

Raf: #include "imports/stdlib.fc";  global slice str;  () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     if (in_msg_body.slice_empty?()) { ;; ignore all empty messages         return ();     }      ;; update str to "ping" or "pong"     return (); }  ;; return str so it can be read by javascript slice get_str() method_id {     load_data();     return str; }

Rayan: Hi. Why Ton latest blocks has only 3 transactions each. Is it normal?

Jackie: Has anyone encountered this bug? If so, how was it fixed?

&rey: For masterchain blocks it is normal. You should check out shardchain blocks referred there. (reply to 85408)

mind: slice get_nft_address_by_index(int index) method_id {     var (_, _, _, nft_item_code, _) = load_data();     cell state_init = calculate_nft_item_state_init(index, nft_item_code);     return calculate_nft_item_address(0, state_init); }Why doesn't this code return a value? Didn't it return

Rayan: Is there any main workchain and shardchain? or for each transaction its different? (reply to 85412)

@bbas.♡: /

Chelsea: Gmgm is there any channel I can look for devs to work on side project with me? I want to build minigame based on telegram

Ankit j: Anyone can help me with manifest url, is there process at ton ?  Is it mandatory step for integrating game into ton ?

Almatbek: Could there be an opportunity for a capable developer to contribute to your project?

Manouchehr: hi everyone. how can i make txID from data in tonweb.provider.getTransaction?

Nerses: How can I write analog of this solidity code in TACT ?     commitId = sha256(       abi.encodePacked(         address(this),         msg.sender,         msg.value,         dstChain,         dstAsset,         dstAddress,         srcAsset,         srcReceiver,         timelock,         messenger       )     );  where fields have this types in solidity     string memory dstChain,     string memory dstAsset,     string memory dstAddress,     string memory srcAsset,     address srcReceiver,     uint timelock,     address messenger,uint msg.value,address msg.sender,address address(this)

Adrian: Hi @kryptolittlekitty. I can help you with that. I have experience in minigame development. (reply to 85416)

Thea: I have experience lemme do this 💎 (reply to 85396)

Zccen: Hi manager. I feel that TonSpace still has many bugs, such as when connecting to the tonspace on an Android phone, the window does not pop up, and the tonconnect/sdk, there is no callback after connected, sometimes. but normal connected to other wallets, such as tonkeeper.

Lootbox.meme: can unity webgl game run as ton mini app ?

Abdulaziz: I think you can do every html5 games as ton mini app (reply to 85447)

Kiryoko: Hi! Can I serve my already existing webapp through telegram webapps/miniapps without substantial changes? Does it work like a webview?

Ankit j: i am installing the Tonconnect/core...but getting error as "npm error code E404 npm error 404 Not Found - GET https://registry.npmjs.org/@tonconnect%2Fcore - Not found npm error 404 npm error 404  '@tonconnect/core@^2.0.0-beta.2' is not in this registry. npm error 404 npm error 404 Note that you can also install from a npm error 404 tarball, folder, http url, or git url."..

carlbiotic: Hello, who knows how to submit Token information on TonViewer and TonKepper?

Nerses: Line 153, col 30: > 153 |             let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeUint(ctx.value,257).storeMaybeStringTail(msg.data.dstChain).asSlice(); i got such an error what can cause that as I think everything is ok

Ma><im: TypeError: Cannot read properties of undefined (reading 'v4-testnet')  please tell me what is the error when running this command: npx blueprint run --testnet --mnemonic scriptName

Ma><im: the same problem with the mainnet

Renat: Hi! Are we allowed to share other projectc here? We're building a community for devs, founders and investors for TON ecosystem. Just wanted to share our post

Renat: Oh, auto deleted:(

Almatbek: sure you can (reply to 85449)

Almatbek: interesting, what community (reply to 85469)

BlueDAO (@bluedao): Had to switch profile:) Cannot share anything here. Just go find bluedao in TG and there will be our channel!

User<7121766667>: Please check DM. (reply to 85412)

Qi: hi

Qi: while I am using 'tonConnectUI().openModal()' to connenct the telegram wallet ,got nothing but a 'dapp manifest not found'

Gleb: Searching for a tech partner for SocialFi NFT project.

Qi: but I am sure I can visit the tonconnect-manifest.json by url like xxxx.com/tonconect-manifest.json

Raf: I fail to store a slice with javascript, can someone help me ?

Raf: hey want to contribute to the repo ? (reply to 82876)

Raf: beginCell()   .storeSlice(new Slice(br, [new Cell()]))   .endCell()

Raf: How am I supposed to do this ? Is this correct ?

D: your project should have manifest file (reply to 85483)

D: inside root folder of your project, you can put tonconnect-manifest.json

Nerses: what can cause such error Type "Builder" does not have a function named "storeMaybeStringTail"                                                                               Line 153, col 30: > 153 |             let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeUint(ctx.value,257).storeMaybeStringTail(msg.data.dstChain).asSlice();

Raf: how do you decode string presented in this format ?? x{0000000048656C6C6F2C20544F4E21}

Raf: I did this, I guess it's not very clean :

nick: Hello ladies and gents, any idea how tonviewer gets the jetton holders list? virtual coffe's on me

Khang Pham: guys anyone have the public source code of Hamster kombat game or any tap to mine game?

Tim: Hello everyone, can you tell me how I can track the status of the transaction via @tonconnect/ui-react package, I am interested in the status of the transaction

绿巨人: How to buy this expired ton dns?

Raf: New ping pong contract example on my demo repo 👌🏼🔥🔥🔥 https://github.com/fabcotech/ton-func-contracts

Stephan: hi guys, please help me, I created jeton according to this standard https://tact-by-example.org/07-jetton-standard  after that I had to send my created token from the contract, I sent 1000 tokens to the contract.  Next, I imported the jetton file  import "./sample_jetton";   and used the TokenTrasnfer message  receive("Finish") {         require(self.playersCount == MaxPlayers, "Maximum");         require(sender() == self.owner, "Only owner is allowed to finish game");         require(self.state.status == StatusStarted, "Only started game is allowed to finish");          nativeRandomizeLt();           let wonAmount: Int = (self.ticketsCount * ton("1") - self.meta.comissionAmount);          let winnerTicket: Int = random(1, self.ticketsCount + 1);          let winner: Address = self.state.tickets.get(winnerTicket)!!;          self.state.winnerTicket = winnerTicket;         self.state.status = StatusFinished;                   send(SendParameters{                 to: winner,                  value: 0,                 mode: SendIgnoreErrors,                  bounce: false,                 body: TokenTransfer{                     queryId: 0,                     amount: 100,                     destination: winner,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),             });       }    I wanted to send 100 jettons to the address of the winner in my lottery  then I ran the script. The lottery winner was selected but the tokens were not sent to him.  const sendParams = {         value: toNano('0.1'),          bounce: false      };       await lotteryJtl.send(         owner, {              value: sendParams.value,          },           'Finish'     );   how can I solve this problem, please help me 🙏

Deleted Account: How to deploy 10k NFTs?

&rey: Preferably let users deploy them. (reply to 85531)

Deleted Account: Huh

Lootbox.meme: Hey guys anyone got a solution how to wait and check transaction status in ton connet . net in unity c# i am able to send coins i am able to get cancelation message, but I am not able to get status of transaction and when transaction is complete i can't give player what he purchased.. Is there any info about it some where?

Nerses: because of this line of code compute phase is failed             let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeInt(ctx.value,257).storeSlice(msg.data.dstChain.asSlice()).storeSlice(msg.data.dstAsset.asSlice()).storeSlice(msg.data.dstAddress.asSlice()).storeSlice(msg.data.srcAsset.asSlice()).storeAddress(msg.data.srcReceiver).storeInt(msg.data.timelock,257).storeAddress(msg.data.messenger).asSlice();  how should i write the code to pass it ? i get exit code 8 cell overflow

&rey: You should consult .md file to check how to serialize message to Tact contract. (reply to 85539)

Stephan: hi guys, please help me, I created jeton according to this standard https://tact-by-example.org/07-jetton-standard  after that I had to send my created token from the contract, I sent 1000 tokens to the contract.  Next, I imported the jetton file  import "./sample_jetton";   and used the TokenTrasnfer message  receive("Finish") {         require(self.playersCount == MaxPlayers, "Maximum");         require(sender() == self.owner, "Only owner is allowed to finish game");         require(self.state.status == StatusStarted, "Only started game is allowed to finish");          nativeRandomizeLt();           let wonAmount: Int = (self.ticketsCount * ton("1") - self.meta.comissionAmount);          let winnerTicket: Int = random(1, self.ticketsCount + 1);          let winner: Address = self.state.tickets.get(winnerTicket)!!;          self.state.winnerTicket = winnerTicket;         self.state.status = StatusFinished;                   send(SendParameters{                 to: winner,                  value: 0,                 mode: SendIgnoreErrors,                  bounce: false,                 body: TokenTransfer{                     queryId: 0,                     amount: 100,                     destination: winner,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),             });       }    I wanted to send 100 jettons to the address of the winner in my lottery  then I ran the script. The lottery winner was selected but the tokens were not sent to him.  const sendParams = {         value: toNano('0.1'),          bounce: false      };       await lotteryJtl.send(         owner, {              value: sendParams.value,          },           'Finish'     );   how can I solve this problem, please help me 🙏

Nerses: i corrceted the code.Would be thankful if you take a look             let slc0: Slice = beginCell().storeRef(msg.data.dstChain.asSlice().asCell()).storeRef(msg.data.dstAsset.asSlice().asCell()).storeRef(msg.data.dstAddress.asSlice().asCell()).storeRef(msg.data.srcAsset.asSlice().asCell()).asSlice();             let slc1: Slice = beginCell().storeAddress(msg.data.srcReceiver).storeInt(msg.data.timelock,257).storeAddress(msg.data.messenger).asSlice();             let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeInt(ctx.value,257).storeRef(slc0.asCell()).storeRef(slc1.asCell()).asSlice(); (reply to 85541)

Patrick: Anyone has successfully added vibrations to the project based on react? I was searching for solution but i was unable to find anything that works

Patrick: Of course, i am speaking about dApps/miniapps (reply to 85547)

&rey: Then relevant chat is @devs. (reply to 85548)

Patrick: Thanks

Paul: Should send message to jetton wallet of winner. In your case, you can get jetton wallet address of winner at client and send it in body of message. (reply to 85544)

Stephan: The Jetton Wallet address is similar to a regular TON address. The address is defined in the winner variable (reply to 85551)

Super_hands: Hi guys. I have a something wierd experience. I sent several msgs to testnet by my tonkeeper android app with testnet wallet (starting from 0Q...).  But same transactions sent to mainnet. What's the problem?

Super_hands: It seems I can't upload screen captures. (reply to 85553)

Super_hands: link also :(

Paul: Oh sorry, send it to jetton wallet address of smartcontract. Is your contract hold reward balance, right? (reply to 85552)

&rey: The problem is that you should not have used same mnemonic across networks. Same signatures are valid both in mainnet and in testnet. (reply to 85553)

Super_hands: OMG (reply to 85563)

Super_hands: It's way toooooooooo different with EVM ....

&rey: I doubt. I guess that if you signed a transaction on Ethereum it would be also valid in some fork. (reply to 85565)

Super_hands: Then in tvm, during the process of proving signature is valid or not, the chainId is not considered?

Super_hands: NO in evm, chainId is different between mainnet and testnet. So signature is different even though people use one mneumonic phrase over chains.

&rey: It is not. CHKSIGNU at its core just checks given Ed25519 signature with a public key.  In theory, wallet applications should mix chainId into subwalletId which is in signed data, but they have not done so for unknown reason. (reply to 85567)

Super_hands: Ah you mean, both chainId in mainnet and testnet is equal ???

Bingo: Hello everyone I need your help Recently I am trying to implement same logic with the contract 0x40e9187078032afe1a30cfcf76e4fe3d7ab5c6c5 in ERC-20 But the network will be in Ton. I am trying to code jetton wallet. Please help me how to do this. I am new in Ton so any helps are appreciated

&rey: I mean, subwalletId is equal, and it shouldn't have been. (reply to 85571)

Stephan: Yes, there are 1000 tokens on the contract, but they are not being sent (reply to 85560)

&rey: Please take a look at existing jetton wallet codes. You can do that in explorers (Tonscan/Tonviewer), switching to tab with contract and opening "code". (reply to 85572)

Paul: yes,  send(SendParameters{                 to: winner,<- should be jetton wallet address of smartcontract, not address of winnner                 value: 0,                 mode: SendIgnoreErrors,                  bounce: false,                 body: TokenTransfer{                     queryId: 0,                     amount: 100,                     destination: winner,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),             }); (reply to 85574)

Stephan: Вы имеете ввиду, что контракт пытается отправить токены не со своего баланса, а с баланса Jetton контракта? (reply to 85563)

Super_hands: I see... ty! (reply to 85573)

Bingo: I can see only hex or bytecode if I can see any sample that replicate ERC-20 token, it will be great (reply to 85577)

&rey: That's unfortunate. For some tokens there is verified code. (reply to 85581)

Bingo: can you send me some sample ton smart contract that replicate ERC-20 token? (reply to 85582)

🌱SEED 🐾🐍: Hello guys. I'm new here. In fact, I'm not experienced developing anything.  But I have an idea I wish to develop.  It resounds with the philosophy of TON to put crypto in every pocket.  I'm glad that Telegram, TON and NOTCOIN are paving the way and creating the conducive environment to develop.  However, I still need mentoring. I don't bother going into partnerships.  Hope I'm in the right place otherwise can someone kindly direct me appropriately?

&rey: A bad example: https://tonviewer.com/EQBTr1VlDmXjwt17E74xEo3KYeBEDp1p9xbixjk7eva_OcyH?section=code. Common example: https://tonviewer.com/EQCQ5VLLADthnf96aP5WLyc_6PvUUtiBVUs8T5k0BR2le6sZ?section=code. (reply to 85583)

Bingo: Thank you so much. Really appreciated (reply to 85585)

User<6323497659>: Hey, are game developers / ceo’s here?

Paul: what do you need? (reply to 85589)

User<6323497659>: I’m designer, and I interested to cooperate with gamedev’s / ceo’s

Cuddlesaurus: How can i help you? (reply to 85589)

Cuddlesaurus: please ping me if u want

Paul: dm me your profile

Patrick: Am interested

User<6323497659>: I need a work in anyone project on ton (reply to 85593)

User<6323497659>: you can help with that?

Cuddlesaurus: sure

NPA120: What can I help you? I have a rich experience in TVM. Do you want to build a telegram mini game like Hamster Kombat? (reply to 85584)

🐈: Hi, I have an public key

🐈: how can I generate address from it?

🐈: I want to generate multi address from one seed keys

🐈: similar HD wallet

PAUL 🐾: i am a fullstack web developer , i'm interested to be part of any ongoing project , i need to connect please

Amir: Thank you for your help brother. I think the domain is the problem, we launched the exact same web app on another domain and the wallet connects without any problem, it's very strange! (reply to 85317)

Egene: did your domain also have a number in it? (reply to 85617)

Egene: maybe we should open a github issue? But we need more info on what domains do not work so that the devs have something to work with

Amir: Unfortunately, no, but  the same mini-app works on another domain, the strange thing is that the wallet does not connect only in the mini-app, if we open the site in the browser, it connects.  Also, we tested all the wallets in TonConnect and only TonKeeper does not connect!  Anyway, I don't think it has anything to do with the domain and the problem is probably from TonKeeper's side, because connecting TonKeeper to the Notcoin bot doesn't work either (you can test it right now). (reply to 85618)

Egene: When you open it in the browser are you also opening it via HTTPS (same as in the mini App) or are you testing via HTTP? (reply to 85621)

Egene: Cause from our side we found that via HTTP it works on any domain. Issues only arise when Https gets involved

Amir: Always using HTTPS (Full mode - Cloudflare), with HTTP i got 404 error for tonconnect-manifest.json (so strange again!) (reply to 85624)

Sumit: "@tact-lang/compiler": "^1.2.0", (reply to 85362)

Anton: If you upgrade to 1.3 or 1.4 the error should go away (reply to 85627)

Sumit: i did upgrade it just now. and now i have an error where it doesnt tell me where that error is happening lol (reply to 85630)

Mister.: /

Bingo: anyone can replicate erc-20 token contract in Ton chain?

User<6323497659>: I’m finding work help

User<6323497659>: I’m designer, who have work for me?

CollectiveMind: Gm ton devs, is there group targeted at TON+Rust development

Unicorn Degen 🦄 ✨: How would that look like architectural wise? (reply to 85532)

CollectiveMind: no need but thank you question was is there community where there is RUST talk only or im on right place in this chat? (reply to 85656)

User<6323497659>: I’m designer, who have work for me?

Adam: what would be the best way to monitor all trades on a dex? considering that all tokens have different addresses, what common link is there between them linking them to the dex?

User: op codes (reply to 85661)

Almatbek: I can do it (reply to 85636)

Adam: can i search all transactions by opcode with tonapi? (reply to 85667)

User: No (reply to 85669)

Ilya: It worked with the tone. But it didn't work with jetons. Do It need a special library? (reply to 82049)

ᅠ: Who can help fix it? Next.js (on default react.js it work correctly)

mac/>King: Hello guys, we need someone to help us develop a form submission in a telegram bot mini app, anyone who is available to do this can dm or signify please

Adam: so what should i use? i know of dton but its very slow, it returns transactions like 30-40s after theyve been confirmed (reply to 85670)

User<6323497659>: Hello, I’m designer, I finding work

Almatbek: I can do it (reply to 85674)

🌱SEED 🐾🐍: Yes, something like that. But different approach (reply to 85604)

— 2024-07-18 —

Conor: I'm trying to discover the flows of Jetton tokens in TON transactions and am currently manually parsing them.  Do TON transactions have any concept of "logs" for Jetton transfers or similar to more easily discover jetton movements?

kevin: No event log in ton, but it quite easy to monitor jetton transfer with help of some indexer. (reply to 85688)

Thea: Sure let's do this (reply to 85674)

Thea: You're in the right place let's develop your idea into reality (reply to 85584)

🐈: is Ton support hd wallet?

NPA120: Please share your requirements in private message (reply to 85685)

Catid: exusme  when i use  ton connect  how to filter what wallet can connect ?  like i dont want  to list bitget wallet  ?

Hoi: I see from the jetton contract that it checks if the sender or receiver whether they are from the same workchain, why is it important? Does that mean I cannot send jettons to address that is from a different work chain?

Hoi: Does that mean we cannot interact with jetton from another workchain? let's say we have 2 workchains under masterchain? (reply to 29131)

Sca: Does anyone know why my channel suddenly stopped showing ads or generating ad revenue?

undefined: Hello, I was scammed by @RareEveres and @sierhi Help me (and other) block them  @sierhi offers to sell the telegram username. @RareEveres pretends to be the guarantor TonKeeper wallet where the nft (username) is being asked to be transferred UQDJO1WZ0tkCyzVvvxcmj6BR8n6YW96hY6lp2Q35b7nqo8KC

Farid: Hi  Is there any information about usage of localstorage in the Telegram Mini Apps? How long is it persistently storing information in the localstorage?

Long: Hi guys, is there any alternative to  toncenter.com indexer api?

Long: I made a nft collection and it seems the data is not up to date?

Shotaro Albert: Hi, Could someone tell me if anyone can build on the TON blockchian? If not, are there any applications to send or fees I need to pay?

Paul: https://tonapi.io/. use this service (reply to 85736)

Paul: What do you want to build? (reply to 85740)

Shotaro Albert: I'm not a tech-guy and only here for research, so I might not be able to give you the precise answer  My team is trying to build a game app on telegram that is connected with the TON blockchain and would like to know if there's anything we have to do before we start building (reply to 85743)

Paul: Dm for more details. (reply to 85744)

Liho: I have a problem with commonContent. I cannot load metadata of NFT item when use deployNftCollection with NOT empty commonContent, but it work when commonContent = ''.

Liho: https://github.com/ton-community/assets-sdk/issues/15

Liho: this is the github issue, anyone have any idea?

Liho: but on getgems able to get it

Thea: Ofc. What are you building (reply to 85740)

Long: Thanks, will check this out (reply to 85742)

Shotaro Albert: My team is trying to build a game on Telegram that connects to the TON blockchain We want to know if there's anything we have to do before we start building (submission to use the blockchain, some kind of fee, etc.)  Unfotunately, not looking for developers (reply to 85756)

Nerses: because of this code I get Cell underflow solidity             let slc0: Cell = beginCell().storeRef(msg.data.dstChain.asSlice().asCell()).storeRef(msg.data.dstAsset.asSlice().asCell()).storeRef(msg.data.dstAddress.asSlice().asCell()).storeRef(msg.data.srcAsset.asSlice().asCell()).endCell();             let slc1: Cell = beginCell().storeAddress(msg.data.srcReceiver).storeInt(msg.data.timelock,257).storeAddress(msg.data.messenger).endCell();             let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeInt(ctx.value,257).storeRef(slc0).storeRef(slc1).endCell().asSlice();     Can someone explain what is wrong with that code ?

Thea: Many ways, you Can start building ASAP and maybe apply for grants of join the Hackerthons (reply to 85759)

&rey: No. You'll need some native coin (TON) to deploy contracts. That network fee is 0.1 TON or less. (reply to 85759)

Shotaro Albert: Thanks! (reply to 85761)

Shotaro Albert: Thanks for mentioning the TON for deploying contracts. Totally forgot about that part (reply to 85763)

Liho: anyone help? (reply to 85752)

meomeocoj | Mike: hi rey is there any way to  transform tonconnector to sender ? (reply to 85763)

Nerses: How can i concatenate all this data as String in TACT     myAddress(): Address,     sender(): Address,     ctx.value: Int,     dstChain: String;     dstAsset: String;     dstAddress: String;     srcAsset: String;     srcReceiver: Address;     timelock: Int;      messenger: Address;

Thea: and that's the main thing (reply to 85765)

&rey: Something like that:     sender(connector: TonConnect): Sender {         return {             send: async (args) => {                 let initCell = args.init ? beginCell().storeWritable(storeStateInit(stateInit)).endCell() : undefined;                 return await connector.sendTransaction({                     validUntil: Date.now() + 5 * 60 * 1000,                     messages: [{                         address: args.to.toString({bounceable: args.bounce}),                         amount: args.value.toString(),                         stateInit: initCell?.toBoc()?.toString('base64'),                         payload: args.body?.toBoc()?.toString('base64')                     }]                 });             }         };     } (reply to 85768)

meomeocoj | Mike: Thank you (reply to 85771)

T: Hello, I'm looking for a position in Web3. I have experience working as a Community Manager for a project with 100k members, and the current chat has 17k users. I've worked exclusively with Telegram and the TON blockchain. Additionally, I have a small team that can assist with development.

Karlyo: Hello How I can buy expired ton domain? How to send technical message to start auction?

Itach: Hello, I am interested in (reply to 85779)

Kono: Hello. I can build website & smart contracts and tg bots for meme coin & dApps. Does anyone need?

Nerses: will this work properly ?             let aggregatedData: StringBuilder = beginString()                                         .concat(myAddress().toString())                                         .concat(sender().toString())                                         .concat((ctx.value).toString())                                         .concat(msg.data.dstChain)                                         .concat(msg.data.dstAsset)                                         .concat(msg.data.dstAsset)                                         .concat(msg.data.dstAsset)                                         .concat((msg.data.srcReceiver).toString())                                         .concat((msg.data.timelock).toString())                                         .concat((msg.data.messenger).toString());              let commitId: Int = sha256(aggregatedData.toString());     as in sha256 is written that String input should have a number of bits divisible by 8. Should I do additional check on that ?

Totti: Hi, everybody. Nice to meet you

Totti: https://minter.ton.org/ Here can I create test token?

prodvd: To create a test token you will need to use Open Mask wallet and testnet TON. And then you can follow the steps to deploy jettons.

Totti: I have test ton but it shows my balance is not enough

prodvd: If you need a professional developer's help feel free to DM

Totti: Okay (reply to 85809)

Totti: Is it impossible with TON keeper wallet extension?

&rey: Have you switched to testnet version? https://minter.ton.org/?testnet=true (reply to 85804)

Totti: Thanks for your help (reply to 85814)

&rey: Wait, underflow or overflow? (reply to 85760)

Totti: Thanks it works.

Nerses: at first version it was overflow now it is overflow.But I handled that problem.Although I have another question now (reply to 85817)

Nerses: ; (reply to 85796)

&rey: Using sha256 of string doesn't seem the best way in this problem. (reply to 85796)

Nerses: then what  will be the best solution and why it isnt appropriate (reply to 85823)

@Ngân: I need a TON Developer who have experience code funC, english fluent and vietnamese, living in vietnam. Please contact me

&rey: Because it will skip any data in references of aggregatedData.asCell(), truncating hashed data. (reply to 85824)

Thea: Welcome let's chat (reply to 85825)

Милая: you need to write a token project with a commission for sale with deployment to toncli. if there is anyone, please contact me

Itach: I can help you (reply to 85828)

Nerses: in docs sha256 in case accepts Slice as argument it must also have no references.So in my case i dont pass references,I pass only Strings.Isnt it ok ? (reply to 85826)

&rey: sha256(x.toString()) also depends on fact that x has no references, or so I remember. (reply to 85830)

Nerses: in my case i get x as message fields and all fields are primitve type none of them is cell so cant have references (reply to 85831)

&rey: Concatenating enough strings will get you a reference (see: snake encoding). (reply to 85832)

Nerses: what means enough in this context.So actually in my code I get sha256 only for first element and others are skipped ? (reply to 85834)

Ян: https://testnet.tonviewer.com/transaction/219cb7cbbb6a54a28253217e923099ea99d124db2ca1b40d5e5657765a5df63c  Hello everyone, I'm trying to build a mass sender of tokens, I'm depositing, I'm send tokens to the contract , but for some reason it only sends a ton and bounces with cskip_no_state although I build the state in the contract

&rey: At most 127 bytes were fit into root slice. That is less than 3 user-friendly addresses, each of which takes 48 bytes. (reply to 85836)

Nerses: got it.Then what will be the right way to do sha256 of such data having so much fields ? (reply to 85838)

Sina: Hello, I hope you are doing well.  I am encountering an error after importing the Unity TON SDK.  Has anyone experienced this issue before? I am following the documentation but still facing this problem.  Thank you for your help!

Harsitha: Hey! I'm currently launching the project and looking for a trusted MM team. Could you suggest any?

Nerses: so in my case after 3rd elemenet has no effect on sha256,as they will be included with reference and so ignored ? (reply to 85838)

Thea: What's MM team we (reply to 85852)

Julien: Hello! Is there a way to obtain a list of trades for a specific pool on ston.fi? I found the endpoint for DeDust but haven’t been able to find one for ston.fi.

Prince: middle market maybe 3m ;-) (reply to 85855)

Prince: really? can you share dedust endpoint? I don't use that but another way to obtain a list of trades for buy bot. let's share (reply to 85857)

Thea: Ok understood (reply to 85858)

&: It works with jettons. (reply to 85671)

Julien: I mean, it's in the API doc 🙂 https://api.dedust.io/ (reply to 85859)

Prince: oh

Prince: is it fast? I don't use and you know what? my buybot detects buy trades as soon as dexscreener and faster than dextools

Julien: did not try it yet. What do you use?

Prince: tonapi

Nerses: https://docs.tact-lang.org/ref/core-math#:~:text=Computes%20and%20returns%20the%20SHA,bits%20of%20data%20in%20total).    as sha256 works like this how i can do sha of this data     myAddress(): Address,     sender(): Address,     ctx.value: Int,     dstChain: String;     dstAsset: String;     dstAddress: String;     srcAsset: String;     srcReceiver: Address;     timelock: Int;      messenger: Address;     ?

&: You can get pool address from api, and u can get list from tonapi.io (reply to 85857)

Julien: thanks (reply to 85870)

Frankovitz: Hi guys! I'm trying to get all NFTs addresses from a collection using Tonweb, but can't realize how, because my code returns some info about collection, its owner, but nothing about NFTs themselves.  js const NftCollection = TonWeb.token.nft.NftCollection; const NftItem = TonWeb.token.nft.NftItem; const nftCollection = new NftCollection(tonweb.provider, {      ownerAddress: walletAddress,      nftItemCodeHex: NftItem.codeHex }) console.log(nftCollection);

v1t4l3y: Hi guys  I want to launch a validator in Testnet  Can someone send me enough tokens to apply to the validator list?

Prince: Have you ever used that for kind of dex? (reply to 85870)

&rey: Please contact @f_closer for that. (reply to 85874)

&: Not yet, but have tried similar one (reply to 85877)

Prince: I can get trade transactions and you know amount_in, amount_out, But corresponding to that transaction, what is the best way to get jetton and native's price at that time?

:D: you wish to get the hash of each individual value? or the whole thing (reply to 85869)

:D: just turn each of them into a slice  and pass it in that way

Nerses: i want sha256 of concatenated all that data.but in case i concatenate after 127 bytes everything is added as reference which is skipped by sha function (reply to 85882)

:D: ah yeah, so you can't do it like that

v1t4l3y: @f_closer could you give tokens in testnet to launch validator (reply to 85878)

:D: just the library's limitation

:D: you could make your own custom function, or just turn the slice into a hex encoded string

&rey: The previous option was better (if it had not overflowed)... (reply to 85869)

:D: would be hard to get the pure bytes hashed

Nerses: in simple words i want exactly implement this solidity code in TACT     commitId = sha256(       abi.encodePacked(         address(this),         msg.sender,         msg.value,         dstChain,         dstAsset,         dstAddress,         srcAsset,         srcReceiver,         timelock,         messenger       )     ); (reply to 85887)

Denisa: Hello, how can i possibly decode a boc that i get as a return value from a transaction? Is there a specific algorithm that I can use to decode any boc?

Stephan: hi guys, please help me, I created jeton according to this standard https://tact-by-example.org/07-jetton-standard  after that I had to send my created token from the contract, I sent 1000 tokens to the contract.  Next, I imported the jetton file  import "./sample_jetton";   and used the TokenTrasnfer message  fun jettonWalletAddress(owner: Address): Address {         let init: StateInit = initOf JettonDefaultWallet(myAddress(), owner);         return contractAddress(init);     }  receive("Finish") {         require(self.playersCount == MaxPlayers, "Maximum");         require(sender() == self.owner, "Only owner is allowed to finish game");         require(self.state.status == StatusStarted, "Only started game is allowed to finish");          nativeRandomizeLt();           let wonAmount: Int = (self.ticketsCount * ton("1") - self.meta.comissionAmount);          let winnerTicket: Int = random(1, self.ticketsCount + 1);          let winner: Address = self.state.tickets.get(winnerTicket)!!;          self.state.winnerTicket = winnerTicket;         self.state.status = StatusFinished;          let winnerJettonWallet: Address = self.jettonWalletAddress(winner);          send(SendParameters{                 to: winnerJettonWallet,                  value: ton("0.01"),                 mode: SendIgnoreErrors | SendRemainingValue,                 bounce: false,                 body: TokenTransfer{                     queryId: 0,                     amount: 100,                     destination: winnerJettonWallet,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),             });       }    I wanted to send 100 jettons to the address of the winner in my lottery  then I ran the script. The lottery winner was selected but the tokens were not sent to him.  const sendParams = {         value: toNano('0.1'),          bounce: false      };       await lotteryJtl.send(         owner, {              value: sendParams.value,          },           'Finish'     );   how can I solve this problem, please help me 🙏

Nerses: do you mean this version ? solidity             let slc0: Cell = beginCell().storeRef(msg.data.dstChain.asSlice().asCell()).storeRef(msg.data.dstAsset.asSlice().asCell()).storeRef(msg.data.dstAddress.asSlice().asCell()).storeRef(msg.data.srcAsset.asSlice().asCell()).endCell();             let slc1: Cell = beginCell().storeAddress(msg.data.srcReceiver).storeInt(msg.data.timelock,257).storeAddress(msg.data.messenger).endCell();             let slc: Slice = beginCell().storeAddress(myAddress()).storeAddress(sender()).storeInt(ctx.value,257).storeRef(slc0).storeRef(slc1).endCell().asSlice(); (reply to 85889)

:D: youd have to write your own custom hashing  function then (reply to 85892)

&rey: Isn't there a problem with different address formats? So, one-to-one conversion is not possible. (reply to 85892)

&rey: Yes. What are the types of dstChain/dstAsset/...? (reply to 85895)

Nerses: No in my case i implemented in solidity the smart contract i need to do same for TON blockchain (reply to 85897)

:D: take a look at openssl's implementations etc, or the solidity implementation (reply to 85896)

Nerses: here are all fields types     myAddress(): Address,     sender(): Address,     ctx.value: Int,     dstChain: String;     dstAsset: String;     dstAddress: String;     srcAsset: String;     srcReceiver: Address;     timelock: Int;      messenger: Address; (reply to 85898)

Nerses: is there any reference ? (reply to 85901)

&rey:     let commitId: int = beginCell()         .storeAddress(myAddress()).storeAddress(ctx.sender).storeUint(ctx.value, 120)         .storeRef(beginCell().storeRef(dstChain.asCell()).storeRef(dstAsset.asCell())             .storeSlice(dstAddress.asSlice()).endCell())         .storeRef(beginCell().storeRef(srcAsset.asCell()).storeAddress(srcReceiver)             .storeUint(timelock, 64).storeAddress(messenger).endCell())         .endCell().hash();

&rey: Though you're overengineering atomic swap very much, I feel.

Nerses: thanks a lot,i will try this version (reply to 85904)

Kira: how to change to testnet on my toonkeeper mobile?

Buggy: how much do you need? (reply to 85886)

v1t4l3y: can I get a million ot two tokens? (reply to 85914)

v1t4l3y: 400k to launch a validator ? I d like to launch few of them

&: Your contract is sending tx to unavailable contract. (reply to 85837)

Ян: i dont understand how to activate jetton wallet for transfer(or after transfer) (reply to 85919)

&: Your tx is not jetton transfer tx. plz keep the standard (reply to 85921)

Ян: https://testnet.tonviewer.com/transaction/ba18588e9a287ff5ad75ce331ab9cfa16eeac568838a7ce0ab9da4f906d322f7 (reply to 85922)

&: OK i'll show u the example of breaking standard but keeping send jettons. (reply to 85923)

&: https://testnet.tonviewer.com/transaction/a95d935de6155b9af4689e695be18890d7e56e867c7abb8d0fd2f6b8724a6afb  This is the tx from contract i have made. My contract checks if admin allowed jetton transfer when user try it. If admin allow transfer, the jetton successfully goes, if not, it goes back. (reply to 85923)

&: In this example i kept jetton transfer standard and sender and receiver can see that jetton in their wallet (reply to 85926)

Ян: i cant use jetton master, i want to send jetton which already exists (reply to 85926)

&: then why is jetton transferring opcode is strange? (reply to 85928)

&: Do you need jetton transferring code? (reply to 85928)

Ян: I need mass send, i try to calculate jetton wallet in contract, and try with api. But none of them work. Just bounce with cskip_no_state reason (reply to 85930)

Ilya: May be I do not have a library. (reply to 85861)

&: Are you working with contract? (reply to 85931)

Muhammad Azan: Yes (reply to 85933)

Ян: yes, i try to rebuild this contract  https://github.com/Gusarich/ton-mass-sender (reply to 85933)

Ян: I can share code with you in DM

&: OK i see. How about using highload wallet? There's v3 version now but i have exp on v2, I have built bulk nft buy/sell/transfer bot. (reply to 85938)

T: Hello, I'm looking for a vacancy in Web3. I have experience working as a Community Manager for a project with 100k members, and the current chat has 17k users. I've worked so far with Telegram and the TON blockchain. Additionally, I have a small team that can assist with development.

Ян: how i can load the jetton_wallet_code if jetton already exist to calculate jetton wallet? (reply to 85940)

Ryan: Recently Bitget wallet and OKX Wallet implemented TON. Both are multi-chain (reply to 85939)

&: To get jetton_wallet_code, you can compile it in your pc in developement step and set it when you build.  Also you can get specified wallet's jetton wallet address in offchain by various kinds of apis

&: Here's code  to get jetton wallet address from jetton master.  const jettonRoot = tonClient.open(JettonRoot.createFromAddress(jettonAddress));     let jettonWallet: OpenedContract<JettonWallet>;     jettonWallet = tonClient.open(await jettonRoot.getWallet(walletContract.address));  jettonWallet.address (reply to 85947)

Ян: this is TonWeb? (reply to 85948)

&: No. this is based on @ton/ton @ton/core ....... But tonweb have functions to do that also. (reply to 85949)

&: Check docs.ton.org (reply to 85950)

User<6323497659>: I am looking for a job, I am a UI UX designer and have good experience in the blockchain industry, I will take care of your project  Portfolio on request in the personal account

Nerses: what data is enough to calculate my smart contracts Jetton wallet address on chain ?

Nerses: how to check TON user friendly address validation in type script ?

Itach: faker (reply to 85960)

Huu: https://github.com/olifanton/ton I want to transfer funds using the TON network but without relying on the package mentioned above. Are there alternative methods available using PHP?

Totti: Hi, could you explain about workchain and masterchain? Thanks

&rey: > There is a necessity for the synchronization of message routing and transaction execution. In other words, nodes in the network need a way to fix some 'point' in a multichain state and reach a consensus about that state. In TON, a special chain called MasterChain is used for that purpose.   > Blocks of masterchain contain additional information (latest block hashes) about all other chains in the system, thus any observer unambiguously determines the state of all multichain systems at a single masterchain block. (reply to 85963)

&rey: Both allegations duly noted. Is there supportive evidence? By the way, could this be some misunderstanding? (reply to 85967)

Nerses: In case of Jetton transfer what indicates context .value()  ? is it Jettons count or TON ?

&rey: TON. (Jetton transfers aren't native to TON so they don't replace anything.) (reply to 85969)

Conor: Which indexer service do people use to locate Jetton transfers in a transaction?

Nerses: will it be same number as  forward_ton_amount  field here message(0xf8a7ea5) TokenTransfer {     queryId: Int as uint64;     amount: Int as coins;     destination: Address;     response_destination: Address;     custom_payload: Cell?;     forward_ton_amount: Int as coins;     forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton }  ? (reply to 85970)

&rey: Yes. or approximately. (reply to 85972)

&rey: dton or tonapi. (reply to 85971)

Nerses: how this can be done on chain (TACT)   https://docs.ton.org/develop/dapps/asset-processing/jettons#retrieving-jetton-wallet-addresses-for-a-given-user

Kryptonite: can someone explain me what does this statement does in gusarich smart contract:  () set_claimed() impure asm "<b 1 1 u, b> PUSHREF c4 POP";

Kryptonite: i did understand from documentation that c4 stores persistent storage for smart contract

Kryptonite: when claim is processed smart contract does set_claimed()

Kryptonite: and then this function is used to check:  (int) get_claimed() method_id {     return get_data().begin_parse().preload_int(1); }

User<6323497659>: I am looking for a job, I am a UI UX designer and have good experience in the blockchain industry, I will take care of your project  Portfolio on request in the personal account

&rey: set_data(begin_cell().store_uint(1, 1).end_cell()); is same in effect but costs more. (reply to 85990)

Kryptonite: so if i am right, it pops out previous persistent data and store 1 instead (reply to 85995)

Kryptonite: setting a truthy value to check if it was claimed or not

Kryptonite: cool

James: i'm getting an error from mytonctrl.   GetValidatorStatus warning: int() argument must be a string, a bytes-like object or a real number, not 'NoneType'  anyone seen this before?  know what the issue might be?

Catid: https://tonviewer.com/EQDmUQDdwJW4O3sQpH7Ozyp1C5hmMc-nJ3ryaH5s0aqu1tq9?section=transactions  i try to send ton from wallet telegram to my ton wallet why still 0 ton ?

Greenmind: Hi im a newbie here.. what game engines can we use for telegram games

Greenmind: Like is there sdk for unity or unreal?

ㅤ: guys help pls  where I can get a TONS API???

&rey: Toncenter, Orbs, dton, tonapi. If that doesn't answer your question please say why; if that does please say which API you have chosen. (reply to 86011)

Sumit: so to prevent deduplication of tx, i need to keep track of all the processed hashes (Int). how can i have an infinite data structure for that?

Sumit: since maps cant handle more than 65536 slots of data?

&rey: Why do you need transaction deduplication in such way? (reply to 86014)

Sumit: What else are my options? (reply to 86017)

&rey: Let users' wallets handle that and process all messages coming to your contract. (reply to 86018)

Sumit: so i have a bridge transaction, which we process in our contract. And we dont want to process the same tx again and again (reply to 86019)

Sumit: we want to abort if its already processed (reply to 86021)

&rey: Is there a chance that you can process transactions in order of seqno increase? (reply to 86021)

&rey: Then you can check that seqno of new transaction is greater than of old one.

Sumit: I don’t think so (reply to 86026)

Kryptonite: BitBuilder overflow

Kryptonite: what is this error ?

Kryptonite: i am facing this error while deploying smart contract

Jack: Is their a chat for people from the Netherlands?

Jack: Is their an active moderator atm?

User<6397988095>: @ShadowTi.

ŁUK: Hey there! It's possible to get secretKey needed to send transaction with TonWeb from existing mnemonic?

Hoi: Can 2 workchains interact with each other? like contract A in workchain A can interact with contract in workchain B? (reply to 85965)

oluwatobi: @Oke_olumo is a scammer.  Stay away from them

Ilya: import logging import asyncio from telegram import Update, BotCommand from telegram.ext import Application, CommandHandler, ConversationHandler, MessageHandler, filters, CallbackContext from TonTools import TonCenterClient, Jetton  # Constants TELEGRAM_API_TOKEN = '' TON_API_KEY = '7d834d79529127a231e15957327914b7d199456ada1dde989962238e91fdd69f' JETON_CONTRACT_ADDRESS = ''  # Enable logging logging.basicConfig(     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',     level=logging.INFO ) logger = logging.getLogger(__name__)  # States for the conversation handler ADDRESS, ANOTHER_WALLET = range(2)  async def start(update: Update, context: CallbackContext) -> int:     await update.message.reply_text("Hi give me a ton adress:")     return ADDRESS  async def address_received(update: Update, context: CallbackContext) -> int:     address = update.message.text     context.user_data['address'] = address     await update.message.reply_text(f"got it: {address}\nChrcking balance RIC...")          balance_message = await check_balance_ric(address)     await update.message.reply_text(balance_message)          await update.message.reply_text("Do you want check another wallet. y/n")     return ANOTHER_WALLET  async def check_balance_ric(address: str) -> str:     try:         client = TonCenterClient(base_url='https://testnet.toncenter.com/api/v2/jsonRPC')          jetton = Jetton(client=client, address=RIC_CONTRACT_ADDRESS)         jetton_wallet_data = await jetton.get_wallet_data(address)         balance = jetton_wallet_data['balance']         logger.info(f"Баланс жетона RIC для {address}: {balance}")         return f"Баланс жетона RIC: {balance}"     except Exception as e:         logger.error(f"Ошибка при проверке баланса RIC: {e}")         return "Не удалось получить данные о балансе RIC. Проверьте адрес кошелька."  async def another_wallet(update: Update, context: CallbackContext) -> int:     answer = update.message.text.lower()     if answer == 'да':         await update.message.reply_text("Input TONCHAIN adress:")         return ADDRESS     else:         await update.message.reply_text("До свидания!")         return ConversationHandler.END  def main() -> None:     application = Application.builder().token(TELEGRAM_API_TOKEN).build()      # Define the conversation handler with the states ADDRESS, ANOTHER_WALLET     conv_handler = ConversationHandler(         entry_points=[CommandHandler('start', start)],         states={             ADDRESS: [MessageHandler(filters.TEXT & ~filters.COMMAND, address_received)],             ANOTHER_WALLET: [MessageHandler(filters.TEXT & ~filters.COMMAND, another_wallet)],         },         fallbacks=[CommandHandler('start', start)],     )      application.add_handler(conv_handler)      # Start the bot     application.run_polling()  if name == '__main__':     main()    Why do not work?

MM: Hello, everyone. Is there anyone who can help me to send NFT using highload-wallet-v2?

Vladislav: Hello everyone, I hope you are doing well  I assembled the project using a redirect following the tutorial https://github.com/alefmanvladimir/lesson10/tree/main  Three hooks are implemented from the directory https://github.com/alefmanvladimir/lesson10/tree/main/src/hooks: useAsyncInitialize.ts useTonClient.ts useTonConnect.ts  Using this example, I’m trying to deploy my contract on the TESTNET. I successfully pull the data to initialize the command, I receive a confirmation message in the Tonkeeper, and the transaction is successful. BUT! As a result, my contract is inactive, and Tonscan says: "Uninitialized address This address doesn't contain any data in blockchain — it was either never used or the contract was deleted. Now it just aimlessly floats in the digital void."  I don’t understand where I could have an error, because the transaction is successful, each has an “OK” status. There are such operation codes in transactions, this is apparently a hash of the message sent in the transaction, two are normal, and one seems suspicious to me (the last one) Operation 0x3267f55 Operation 0x946a98b6 Operation 0xffffffff  Every transaction have status "OK"  My code: export function useDeployContract() {     const { client } = useTonClient();     const { sender, connected, wallet } = useTonConnect();     const [error, setError] = useState<string | undefined>(undefined);     const [contractAddress, setContractAddress] = useState<Address | null>(null);     const [loading, setLoading] = useState(false);      const deploy = useCallback(async (arg0: bigint, arg1: boolean) => {         if (!connected || !client || !sender || !wallet) {             setError("No client, sender, wallet or not connected");             return;         }          setLoading(true);         setError(undefined);          try {             const contractInit = await MyContract.fromInit(Address.parse(wallet), arg0, arg1);             const contract = client.open(contractInit);             console.log(contract.address.toString()) // Exists             console.log(contract.init?.code.toString()) // Exists             console.log(contract.init?.data.toString()) // Exists              let isContractDeployed = await client.isContractDeployed(contract.address);             if(isContractDeployed) {                 throw new Error("MyContract already deployed");             }              // this await call is executed instantly             await contract.send(                 sender,                 {                     value: toNano('0.05'),                 },                 {                     $$type: 'Deploy',                     queryId: 0n,                 }             );              // so here I will add senqo checking logic                      isContractDeployed = await client.isContractDeployed(contract.address);             if(!isContractDeployed) {                 throw new Error("MyContract deployment failed");             }                      setContractAddress(contract.address);         } catch (error) {             setError(error.message || "Unknown Error. MyContract deployment failed");         } finally {             setLoading(false);         }     }, [sender, connected, wallet]);      return { deploy, contractAddress, error, loading }; }  I will be glad to any hint or examples, thanks 🙏

Thea: and no problem with contract (reply to 86067)

Vladislav: compilation is successful, all tests too (reply to 86069)

Vladislav: And after sending the transaction via tonconnect/ui-react package, I get this log

— 2024-07-19 —

prodvd: What NFT is trending on TON now a days?

Hong Kyun: Hey guys, we're looking to launch a Ton mini app game soon and starting to test with basic features

Hong Kyun: When I use mini apps on my iPhone, the window is not fuilly open and when I slide down the window goes down too

Hong Kyun: Is this only an iphone issue? or web app on phone in general?

Hong Kyun: can't find a full screen option on my phone

Nguyen: how can I mint nft of jetton from client? Any examples ?

Luke: Hi guys, is there any standard format on how to describe a Jetton token's content and metadata? Thanks!

Luke: Should the content of any Jetton be described in type { type: number; uri: string; } ?

Mitchell: type can be 0 or 1

Mitchell: 1 means test net

Mitchell: You can push metadata to github public repo as .json file

Mitchell: And use this base url https://raw.githubusercontent.com/username/path to get data directly

Lena | Thane: Hello, can someone help me with the following question. What is the correct derivation path for TON chain?

Kryptonite: can someone please help me to resolve this ? (reply to 86034)

Catid: exusme  i want to asking  if i add my wallet address on ton space for receive pay ment its possible or not ?

EREN •TABBY: someone help me

BlockchainDev: How can we help you? (reply to 86133)

EREN •TABBY: i want to get my free ton nft (reply to 86135)

EREN •TABBY: @admins (reply to 86133)

BlockchainDev: Play-to-earn games:  The Ton Play gaming platform offers free, non-transferable NFTs in some of its games, like TON Chess. You typically don't even need to play the game itself, just connect your wallet and wait a few days to receive the NFT (reply to 86136)

EREN •TABBY: i have received 1 nft i want to claim (reply to 86138)

BlockchainDev: Oh okay this different case (reply to 86139)

EREN •TABBY: i have claimed and it deducted 7$ something as fee but got nothing

BlockchainDev: P m me for better discussions:) (reply to 86144)

ŁUK: ReferenceError: mnemonicToKeyPair is not defined in tonweb.js?

ŁUK: how to get key pairs from mnemonic in tonweb? someone know

BlockchainDev: Hi all,  While i send jetton to another wallet via (js) its getting error. I don't know the reason of error. Please give me a suggestion to solve this.

BlockchainDev: let mnemonic = " YOUR MNEMONIC PHRASE" const keyPair = await mnemonicToWalletKey(mnemonic.split(" "));  Now you can get keypair (reply to 86148)

ŁUK: I cant buddy: https://github.com/toncenter/tonweb-mnemonic  // mnemonic is set to window.TonWeb object if it exists:  ReferenceError: mnemonicToKeyPair is not defined

ŁUK: I init TonWeb but it still give me this error

Sina: Hello, I hope you are doing well.  I am encountering an error after importing the Unity TON SDK.   'Wallet' does not contain a definition for 'Account' and no accessible extension method 'Account' accepting a first argument of type 'Wallet' could be found (are you missing a using directive or an assembly reference?)    Has anyone experienced this issue before? I am following the documentation but still facing this problem.  Thank you for your help!

BlockchainDev: Use this  const { mnemonicToWalletKey } = require("@ton/crypto"); (reply to 86153)

User<6323497659>: I am looking for a job, I am a UI UX designer and have good experience in the blockchain industry, I will take care of your project  Portfolio on request in the dm

🅰 🆄 🆃 🅷 🅾 🆁 🅸 🆂 🅴 🆁: @awesome_doge @slavafomin  and other admins  please advise what is going on with the display format of newly minted Telegram usernames in TonViewer, TonScan and wallets including TonKeeper  newly minted names are now displayed via these sources as encoded blockchain address strings  webP previews are not rendered properly and metadata is now not included in the token metadata section  is this a bug or is this a new feature of some form?

Peng: does anyone know what error is this

ŁUK: thank you very much buddy! it work (reply to 86157)

Kryptonite: @pcrafter ? (reply to 86127)

Kryptonite: is there any way i store more information?

Kryptonite: need help please

&rey: In a reference, probably. (reply to 86167)

Kryptonite: but i just want to add a slice

Kryptonite: if i remove it , code works properly

&rey: They do so by sending messages. (All workchains in TON are meant to support messages in form of cells.) (reply to 86059)

Kryptonite: the moment i try to store slice to store address it gives bitbuilder error

&rey: This is scam. (reply to 86140)

&rey: So yes, your builder has insufficient space and you need to store something in a reference. Maybe the address, maybe something coming before it. (reply to 86175)

&rey: The correct key derivation algorithm for TON doesn't use derivation path. Please consult tonweb-mnemonic, @ton/crypto or similar libraries to get actual algorithm. (reply to 86125)

&rey: Standard: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md. (reply to 86115)

minhtienhcmus: if (op == op::withdraw()) {       int key = in_msg_body~load_uint(256);       if(dict_.dict_empty?()){         return ();       }       (slice payload, int success) = dict_.udict_get?(256, key);       throw_unless(98, success);       slice add = payload~load_msg_addr();       int _amount = payload~load_uint(64);       throw_unless(405, equal_slices(sender_address, add));       throw_unless(411, _amount > 0);       send_tokens(sender_address,_amount,query_id,usdt_address);       cell info_reward = begin_cell()               .store_slice(add)               .store_uint(0,64).end_cell();       dict_~udict_set(256, key, info_reward.begin_parse());       store_data(usdt_address, owner_address, monitor_address, dict_, total_add, budget);       return ();     }  When calling the withdraw method,  the send_tokens method fails, the store_data method still updates the data. How can I prevent this from happening? thanks :))

Kryptonite: getting exit code 9 if i am trying to storeRef through oopcode (reply to 86178)

BlockchainDev: 🤝 (reply to 86165)

&rey: Does it fail, or actual jetton transfer fails? (reply to 86183)

minhtienhcmus: actual jetton transfer fails (reply to 86186)

&rey: Then you can't condition store_data on transfer success, since by the time when transfer request is sent contract execution has already finished. (reply to 86187)

&rey: You may try tracking USDT balance in the contract.

Kryptonite: if(op == "setup_deploy"c){     throw_unless(400,equal_slices(sender_addr,admin_address));     extra_info = in_msg_body~load_ref();     save_data();   }  getting exit code 7 . as per documentation that says: Type check error. An argument to a primitive is of an incorrect value type. 1  but i have declared: global cell extra_info; (reply to 86178)

&rey: Probably you have other global variables, some of them being not set and therefore null? (reply to 86192)

Kryptonite: no all of the variables are set correctly if i skip storing this ref (reply to 86193)

Egor: @iam047801 is there way to implement pagination for nfts with anton?

User<6323497659>: I am looking for a job, I am a UI UX designer and have good experience in the blockchain industry, I will take care of your project  Portfolio on request in the dm

minhtienhcmus: use js to check on UI or on contract ?  thanks :)) (reply to 86189)

EREN •TABBY: i got scammed 🥹 (reply to 86177)

Kishidle: Greetings, is there a way to do structs (like C structs) in Fun-C? I see Tact has the functionality but I'm not sure how it translates it to FunC.

Luke: Thamk you so much man (reply to 86121)

Thomas: hey guys, can I get the sender address in recv_internal of FunC?

musashi: () recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {     if (in_msg_body.slice_empty?()) { ;; ignore empty messages         return ();     }     slice cs = in_msg_full.begin_parse();     int flags = cs~load_uint(4);      if (flags & 1) {         return ();     }     slice sender_address = cs~load_msg_addr(); (reply to 86214)

Thomas: oh cool, thanks so much (reply to 86216)

Hong Kyun: Any insight on this issue? (reply to 86097)

Matthew: hello all, why my tx message format is true but i receive unknown tx ( https://tonviewer.com/transaction/0e2435795f6fae207212d49dc3a651c41b650fd63894630fed02266e315231ee) i used bitget wallet. is this bitget's fault?

Sammy: @TapMBoys_Bot this is my project, serving to 30K users.  I want to add some menus and options for increasing interest the users to the game. If you experienced developer, please contact me DM.

Vladislav: Hello guys, please take a look, maybe someone has any ideas (reply to 86067)

Usman ghani 🌊: I am also facing the same issue bro (reply to 85358)

wikig: Hello guys , anyone know how to use your own wallet extension inside the tonconnectui?   Should i create a pull request in tonconnectui origin repo  ?

Paul: https://tonscan.org/tx/DiQ1eV9vriByEtSdw6ZRxBtlD9Y4lGMP7QImbjFSMe4= This send a transaction to itselft. (reply to 86225)

Matthew: This is a transaction where I interact with the smart contract. But there are successful times and uknown times like the above (reply to 86238)

0xbera: Hello! I got banned twice for 3 days for no apparent reason? The second time I asked a technical question and pasted some json  Why am I getting banned..? 😿

0xbera: The first time I got banned I posted a screenshot IIUC.  How are we supposed to have technical discussions if we cannot post screenshots, links and code / json ?

&: Do you want to do only send? (reply to 86066)

Paul: It could be error from web where you connect wallet. (reply to 86239)

Javen: Hi guys, I met such error. After run install.sh to deploy TON node. And validator process exited. validator.service: Failed to determine group credentials: No such process validator.service: Main process exited, code=exited, status=216/GROUP

&: It can be unknown error of the platform. That tx is sent to itself. A bug (reply to 86250)

Matthew: My website works fine with Tonkeeper, but with Bitget Wallet, the above situation occurs? (reply to 86250)

&: Exit_code 9(stack underflow ) occurs when your msg and contract's message have different structure. Carefully check your msgs. (reply to 86184)

Kryptonite: yeah got it bro , Thanks . just finished resolving that issue (reply to 86259)

&: When declearing Tonconnect, you have to set Manifest url. Plz have a look at this point. (reply to 86156)

Огурчік: Hi all, i have a question, i would like to create my own JeTon token, firstly i want use testnet to develop it  1 - I used tonkeeper to make testnet TON wallet 2 - i have done register my token on https://minter.ton.org/  and i connected it to my testnet TON wallet  3 - As i understund, i have to use AMM DEX for the TON blockchain, (i wuild like use TON coins to buy my JeTon ) i know about ston.fi , but it doesnt not work with testnet, and my question, am I doing everything right?? or i lost something?

Sina: Hey thanks for replying,   I assume The part you mentioned should set after I could compile the TonConnect unity package it self, isn't it?  Thanks again (reply to 86262)

&: Yes but for ston.fi testnet, there's no testnet website but there's testnet contract. YOu can try buy/sell/providing pools and etc with testnet version. Even the addresses are the same with mainnet. (reply to 86263)

&: I think Manifest url information should be provided with tonconnect variable. (reply to 86265)

Sina: The problem is wallet class dosent have account property.  So it prevents to compile for demo scene (reply to 86267)

Огурчік: ou, thx.  Okey, where i can find testnect contract to use it for testing? (reply to 86266)

Огурчік: or i something dont understand 😃

&: You can get everything from ston.fi repo on github. Just search ston.fi on github (reply to 86271)

&: Is there any part to declear manifest url? (reply to 86268)

Огурчік: Thanks a lot (reply to 86273)

Sina: not sure .... how define a variable gonna solve my class attribute problem please?   https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started (reply to 86274)

&: Is this correct url in your side? (reply to 86276)

Sina: opening the project to double check   , but I couldn't even come to this stage because I couldn't compile the package (reply to 86280)

Sina: I cant added the script to my object because of compile errors

meomeocoj | Mike: Hi @pcrafter could i share a project about bridge in this channel ?

User<6323497659>: I am looking for a job, I am a UI UX designer and have good experience in the blockchain industry, I will take care of your project  Portfolio on request in the dm

Louis: How to deploy Jetton contract in factory contract

Tang: Hello I am developing a game on unity WebGL to be played as a mini-app inside Telegram. My team and me managed to send a TON transaction using the ton-connect sdk, however we are facing this issue: The telegram wallet does not pop up automatically when receiving the transaction request. Users have to manually switch between the game window and the telegram wallet, which is a huge barrier to make the transaction seamless in our project. I would be very grateful if someone could indicate me how to achieve this, or where to look for to find the documentation telling how to make the telegram wallet window pop-up?

mehrdad: Hello friends, how can I send jetton to another wallet in nodejs

Огурчік: Does anyone have an example of how to set up liquidity for my jeton token using for example tonlib or TONsdk?

&: Which dex do you want to make lp? (reply to 86297)

Огурчік: STON.fi -> https://github.com/ston-fi/dex-core  There is also i found DEX contract for testnet (reply to 86298)

Nerses: is there any example of Jetton transefer (NOT internal).for example how smart contract (TACT) sends Jetton to wallet ?

O: I'm using the Next.js TSDK template, but where can I make global fetch requests? For example, to my createUser API or to use functions like webapp.expand?  RootInner or Root? or anything else?

Nerses: as every Jetton master contract implements method get_wallet_address  can I having only jetton master address do on chain call to that method and get my Jetton wallet address ?

Nerses: what are differnces between TON address and Wallet account  ?

Nerses: just cant understand it in this context https://wallet.helpscoutdocs.com/article/85-collectibles#Are-Collectibles-the-same-as-NFTs-uKr5i:~:text=%E2%9A%A0%EF%B8%8F%20Note%3A%20NFTs%20and%20Jettons%20can%20only%20be%20sent%20to%20other%20TON%20addresses.%20Wallet%20accounts%20do%20not%20support%20NFTs%20or%20Jettons%2C%20and%20if%20they%20are%20sent%20to%20Wallet%20accounts%2C%20they%20will%20be%20lost.

&rey: "Wallet account" is an account in Wallet bot. It is stored in a centralized way, and its deposit address only supports certain kinds of assets. (reply to 86316)

Nerses: what data is needed to calculate Jetton wallet address of smart contract on chain ?

Buggy: Who need 500 test coins?

meomeocoj | Mike: It's honor to see feedback from TON's dev community

&rey: Arbitrary jetton or specific one? (reply to 86322)

Nerses: arbitrary (reply to 86325)

Nerses: I mean in context of minimum needed data.for example if there are more than one approaches I need the one which needs less info

JesusAlpha: Yo guys what the best server for the lite node?

&rey: Jetton master code and data cells. (reply to 86328)

Guillaume: I tried to upgrade my code to use TonClient4 instead of TonClient from @ton/ton, and now sendMessage accepts a Buffer instead of a Message, I can't find the function to convert the Message into a buffer ?

Nerses: what data cells do you mean and also address of smart contract isnt needed ? (reply to 86331)

&: Please have a look at sterik tutorial video. You can get everything from there. (reply to 86333)

&rey: Jetton master address is uniquely determined by its StateInit, so it's not needed once you have all parts of StateInit — namely code and data cells. (reply to 86333)

Morphius: hi there is an opensource wallet, that has a chrome extention. need to proxy it to a telegram mini app. is this possible?

Nerses: does this code has correct structure for sending Jetton from smart contract to receiver ?         send(SendParameters{                 to: jettonWalletAddress,                 value: ctx.value,                 bounce: true,                 mode: 0,                 body: TokenTransfer {                                     queryId: 9072345,//e.g.                                     amount: (self.commits.get(msg.data.commitId)!!).amount,                                     destination: (self.commits.get(msg.data.commitId)!!).sender,                                     response_destination: ctx.sender,                                     custom_payload: null,                                     forward_ton_amount: ctx.value,                                     forward_payload: "Token Transfer".asSlice(),                                  }.toCell(),                 code: init.code,                 data: init.data             }         );

Kenny | Staked: How do we get an api key for toncenter?

NPA120: Kindly use this bot. https://t.me/tonapibot (reply to 86356)

User<6323497659>: I am looking for a job, I am a UI UX designer and have good experience in the blockchain industry, I will take care of your project  Portfolio on request in the dm

Огурчік: where i can read what is liquidity? i would like to add liquidity, to my code, for example now i have this code:    import requests import asyncio from pathlib import Path from pytonlib import TonlibClient  async def main():     loop = asyncio.get_running_loop()     ton_config = requests.get('https://ton.org/global.config.json').json()      keystore_dir = '/tmp/ton_keystore'     Path(keystore_dir).mkdir(parents=True, exist_ok=True)          client = TonlibClient(ls_index=0, # choose LiteServer index to connect                           config=ton_config,                           keystore=keystore_dir,                           loop=loop)           await client.init()          masterchain_info = await client.get_masterchain_info()     print(masterchain_info)      await client.close()   if __name__ == '__main__':     asyncio.run(main())   also: 1 - i maked jeton adress and connect there my testnet wallet 2 - i have dex_contract_address -> EQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33Rbt 3 - And phreses to login to my wallet which i connected to jeton adress  how i can set liquidity? have i to do some transaction? where i cn find examples or at least documentation about this, because a whole day i try to understand it

0xbera: can someone please explain how DeployContractWaitTransaction() in https://github.com/xssnick/tonutils-go works? I am totally lost..

Aleksandr: Hello!  Maybe anyone know how to write JS to closing behaviour for Telegram Web App?  Try different variants, but it's doesn't work =(

0xbera: I am trying to create / deploy a highload wallet contract using go -- are there any working examples of this? Ideally, using DeployContractWaitTransaction()

&rey: This is offtop for this chat; more suited to @devs. (reply to 86375)

Aleksandr: All day no one answer in devs, want to try this chat (reply to 86383)

ና2fii: Whatcan I do?

Vladislav: Hello again Does anyone have code for deploying a contract using the @tonconnect/ui-react package in react? (reply to 86067)

Vladislav: I have identical code for the data cells and the code itself. I checked the data that I receive in sandbox tests and the data that I receive before sending the transaction My transactions are successful  But the contract code is not published, although all transactions are on it  I'm making a mistake somewhere, but I can't figure out where. Well, someone published a contract through React, didn't they? (reply to 86393)

&rey: JS TC2 tutorial can be ported pretty easily. In short, you need to provide stateInit. (reply to 86393)

Vladislav: Thanks for the answer 🙏  but maybe I misunderstood a little, but I have TC2 integrated into the project, and I can send transactions and sign through wallet applications.   For me, the publication of the contract is not happening, I already forcibly made an erroneous transaction and put a little bit of TONs on the address, but it is still inactive (reply to 86397)

Vladislav: that's my problem (reply to 86067)

Vladislav: The wallet itself is connected, I can read the balance and network type. But the problem is with the deploying of the contract

T Rekt: is it possible for jetton to have commission fees?

Амир: Yes (reply to 86404)

T Rekt: okay thanks. any idea where i can read up on this? (reply to 86405)

Vladislav: yes, you can register a reduction in the incoming transaction amount (e.g. context().value in Tact)  by the required amount, and transfer the rest (reply to 86404)

Амир: Yes, learn about jetton smart contracts (reply to 86406)

NH: guys maybe im wrong here but i did use the bridge on dedust to bridge my USDC on ETH to TON 3h ago and something went wrong i did mot receive my USDC on TON but also dont have it anymore on ETH

NH: maybe someone good enough to check tx hash?

NH: 0x5126796c1a9041fa87c36420e711d8f75618b924e1f3fb257054a63e27b0f4ff

Vladislav: https://t.me/dedust_ru_chat  Here's DeDust channel, try writing to them (reply to 86415)

NH: thx

🦴008.000💠: GM

— 2024-07-20 —

Vladislav: [SOLVED] I missed the stateInit field in the message I was sending  In this example https://github.com/alefmanvladimir/lesson10/blob/main/src/hooks/useTonConnect.ts should be block of code like this: const stateInit = (args.init && beginCell()     .store(storeStateInit(args.init))     .endCell().toBoc().toString("base64")) ?? undefined;  tonConnectUI.sendTransaction({     messages: [         {             address: args.to.toString(),             amount: args.value.toString(),             payload: args.body?.toBoc().toString("base64"),             stateInit: stateInit,         },     ],     validUntil: Date.now() + approveDelay, });  and since I was not familiar with react, I hoped that this hook was fully implemented, and I didn’t look there at all  and someone previously answered that it is necessary to provide statInite. But since I didn’t understand what it was and where to look, I was missing a couple of links  Basic documentation: https://docs.ton.org/learn/overviews/addresses#what-happens-when-you-transfer-toncoin-to-an-uninit-address  And a link to an example application code from TC2: https://github.com/ton-connect/demo-dapp-with-react-ui/blob/07342b27e406fd4a00d59f2042afbbdc7bbdefb4/src/server/api/create-jetton.ts#L70  I hope this information will help beginners who will be looking for information (reply to 86067)

Tang: Upping this, in hope someone can help me. (reply to 86291)

Ken: I think there isn't any docs for that. How about implement it via deepLinking? (reply to 86450)

Huu: I encountered this error when transferring money to the TON network using PHP. Has anyone experienced this error before?

&: Have a look at docs.ton.org, search exit_code 33, you can find everything here. (reply to 86457)

Huu: it confuses me (reply to 86463)

Ton: any one knows how to send this message using my wallet?

Ton: how can I use this internalmessageCell?

Dannel: hi, any one knows what is exit code 130 ?

Андрей: you need to look at the source code of the smart contract that generated this error (reply to 86480)

Dannel: i use tact program, i have import  "@stdlib/deploy";  "@stdlib/ownable"; "./jetton"; (reply to 86481)

Dannel: my code have not exit code 130

Anton: of course it has, see https://docs.tact-lang.org/book/exit-codes (reply to 86483)

Dannel: Thank you (reply to 86484)

PizzaVPN: Hello guys I was trying to write some tests for transferring jettons after 10 years inside my func contract but when I moved the blockchain. now  to 10 years later and checked my jetton_wallet account state It says it is frozen.  Afaik this happened because of low credit (less than -0.1 TON).  My questions are: 1. How can I unfreeze my jetton_wallet? Should I first top-up my jWallet's TON balance and then deploy it with the last stateInit? 2. If this happens for all version1 jetton_wallets, what is the universal solution to this situation? people should top-up their wallet balances if they want to keep their jettons?

Tang: Thanks for your answer, yes I think there is some kind of deep link related to the telegram wallet api https://docs.wallet.tg/pay/.  Didn’t find anything that talk about making the wallet window appear though, but I’ll look more into it. (reply to 86456)

Ken: Welcome.

Louis: How to quickly generate this

Louis: I use func

.: Hi How I can to try it in Ton  (How to Connect Ton wallet and create smart contract with this wallet) itnext .io/build-your-first-solidity-dapp-with-web3-js-and-metamask-b18d63196bb5

I'm: Hi all bro, I want to check the token balance in Tôn address. Do you know it or have docs about this? please give it to me. Thank you all.

Anton: Hello everyone! This might be slightly off-topic, but I have a question regarding monetization. I am reading the documentation on the official Telegram website and the TON website. I encountered a contradiction:  In the FAQ section on the Telegram website, there is an answer to the question about whether a mini app can receive payments in cryptocurrencies, and the answer is "no, you must use Telegram Stars." I thought - okay.  But in the documentation about mini apps on the TON website, the very first line says that Wallet Pay is the main payment system for Telegram Mini Apps.  Could you please clarify where the truth lies and maybe explain the differences in a few words? Useful resources are also very welcome. Thanks in advance 🙂

Pouya: hi

Almatbek: Are there any companies or projects seeking a talented developer?

&rey: There are, in @tonhunt. (reply to 86525)

Mahdi: Hi all.  We want to transfer our NFTs from Polygon network to TON network. Our NFTs have a quantity in the polygon network, for example, we have 100 of each item. This quantity for items does not exist in TON network or we did not find a way for it. Can you guide me? This is very important for us, otherwise we cannot use TON network. This may be a problem for many developers.  Thanks for attention

&rey: That concept maps to jettons with "render_type": "game" (per Token Data Standard https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md), though I'm not sure if explorers implemented that. (reply to 86535)

&rey: Please check tonapi API. (reply to 86505)

Mahdi: Thanks for your answer but With this method, can we have meta data that can be defined on NFT on the token? It is important for us that there is metadata in the network. (reply to 86536)

Mahdi: @andreypfau can you help us? (reply to 86535)

Adam: can someone recommend an experienced TON dev? i need some help and i will pay

Mahdi: I mean this Quantity value.  how should we handle this in TON chain? (reply to 86535)

Rayan: ``` {   "transactions": [     {       "account": "0:D7D38298C35D80B92CEF6052A5FDF399F56B0EBD4EE5B839EE8BEFE4AE6755E0",       "hash": "uyCb5wd8euEWWZzGuIRJTyBcxsBgN8oHFl25A0nE1LA=",       "lt": "47840917000001",       "now": 1721321011,       "orig_status": "active",       "end_status": "active",       "total_fees": "4023222",       "prev_trans_hash": "fObKSsdsZl0Eu5CeqPgO6uLWPsCTVE5szH03Wu4WDR8=",       "prev_trans_lt": "47836178000005",       "description": {         "type": "ord",         "action": {           "valid": true,           "success": true,           "no_funds": false,           "result_code": 0,           "tot_actions": 1,           "msgs_created": 1,           "spec_actions": 0,           "tot_msg_size": {             "bits": "2324",             "cells": "6"           },           "status_change": "unchanged",           "total_fwd_fees": "1247200",           "skipped_actions": 0,           "action_list_hash": "3gPF5r+6BamodvXJd9KuVyY9+dDNvDgh2g2OEgSo7B8=",           "total_action_fees": "415726"         },         "aborted": false,         "credit_ph": {           "credit": "63571490"         },         "destroyed": false,         "compute_ph": {           "mode": 0,           "type": "vm",           "success": true,           "gas_fees": "3606800",           "gas_used": "9017",           "vm_steps": 216,           "exit_code": 0,           "gas_limit": "158928",           "msg_state_used": false,           "account_activated": false,           "vm_init_state_hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",           "vm_final_state_hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="         },         "storage_ph": {           "status_change": "unchanged",           "storage_fees_collected": "696"         },         "credit_first": false       },       "block_ref": {         "workchain": 0,         "shard": "C000000000000000",         "seqno": 44626412       },

Rayan: "in_msg": {         "hash": "0HIaZvv1yPQ37SQSGWIvZQxoVtIPYRYAqPbsKl5huIE=",         "source": "0:4CB81E4119B99E08AB3379ACD345E7B2643F54AD8E926B0124884F9AB29493E7",         "destination": "0:D7D38298C35D80B92CEF6052A5FDF399F56B0EBD4EE5B839EE8BEFE4AE6755E0",         "value": "63571490",         "fwd_fee": "535471",         "ihr_fee": "0",         "created_lt": "47840914000002",         "created_at": "1721320995",         "opcode": "0x0f8a7ea5",         "ihr_disabled": true,         "bounce": true,         "bounced": false,         "import_fee": null,         "message_content": {           "hash": "E0vU25u/0tE+vjOq69g2y02fjH+7NtaHs8ZX3ZKMdbg=",           "body": "te6cckEBAgEAagABrg+KfqVUbeTvIH+NPGEjCc5UAAgAurUGHJBCjyPpVqalIBjEmnf+eL36xgMtYwArHW8TMh8AEy4HkEZuZ4IqzN5rNNF57JkP1StjpJrASSIT5qylJPnCAwEAHAAAAAAxOTI4MTE0Njg5+QoErQ==",           "decoded": null         },         "init_state": null       },       "out_msgs": [         {           "hash": "yaULGJzyK+g4dp428IGHCWGo+2qhx+Q5Kq806ft2UQI=",           "source": "0:D7D38298C35D80B92CEF6052A5FDF399F56B0EBD4EE5B839EE8BEFE4AE6755E0",           "destination": "0:BAA5C2BF894631A3158C95F0F6D5487FFE868333ED27A11FE6E17EF33BA97B07",           "value": "58717490",           "fwd_fee": "831474",           "ihr_fee": "0",           "created_lt": "47840917000002",           "created_at": "1721321011",           "opcode": "0x178d4519",           "ihr_disabled": true,           "bounce": true,           "bounced": false,           "import_fee": null,           "message_content": {             "hash": "Hq1rW/lycCFA6/tpsMZ2mQOb+QuMudb2KVYWvdU9VGs=",             "body": "te6cckEBAgEAagABrReNRRlUbeTvIH+NPGEjCc5UAAgAmXA8gjNzPBFWZvNZpovPZMh+qVsdJNYCSRCfNWUpJ88AEy4HkEZuZ4IqzN5rNNF57JkP1StjpJrASSIT5qylJPnEBwEAHAAAAAAxOTI4MTE0Njg59pfEoA==",             "decoded": null           },           "init_state": {             "hash": "uqXCv4lGMaMVjJXw9tVIf/6GgzPtJ6Ef5uF+8zupewc=",             "body": "te6cckEBAwEAbgACATQBAghCAropGMiUfpslr5rBuIM1d1QXPlgS+Aej1uZCoUcJWVOVAIcAgAurUGHJBCjyPpVqalIBjEmnf+eL36xgMtYwArHW8TMh8AC+VYUPEYXaVebrvLjLMLXvBgoP0DSC7A+QyzWA6wz/8rh7N1s="           }         }       ],       "account_state_before": {         "hash": "6pWBHc+trlZtMpZGdDu0lGyf1E2Td9AXAqm59qwNghc=",         "balance": "8393321",         "account_status": "active",         "frozen_hash": null,         "code_hash": "jSjqQht36AX+pSrPM1KWSZ8Drsjp/SHdtfJWSqZcSN4=",         "data_hash": "qVP0dBCmNlLvP1eAXQRTpRoHT+XZqZFGrGBVBFWFXK4="       },       "account_state_after": {         "hash": "cvamXSG2cErV5BlPBFL5SdlKgigdtE1w2mjoY9Arcio=",         "balance": "8392625",         "account_status": "active",         "frozen_hash": null,         "code_hash": "jSjqQht36AX+pSrPM1KWSZ8Drsjp/SHdtfJWSqZcSN4=",         "data_hash": "cczrp61rntYjIAeyY70Kb8XJdCebEhP2voJKR3ZJoXU="       },       "mc_block_seqno": 39100260     }   ], ```

Rayan: Hi guys, this is receipt of a token transfer fetched from toncenter api. How can i find out token transfered amout with this? is decoding needed? (Amount is 20000 NOT)

Louis: what wrong

Амир: Cell underflow (reply to 86568)

Амир: Trying to read more bits than stored in cell

Carter🧹: Question about OutMsgDescr on Block Extra which is a Dictionary of a key byte32 and OutMsg, what does the key represent, is it the Transaction Hash? Because querying tonviewer with the hex for this, does not bring back any transactions?

Bode: I sent usdt to bybit with the wrong tagmemo, I opened a ticket there and it returned it, but I haven't received my funds in my wallet yet, I noticed on tonviewer that the funds come from another wallet and bybit sent them back to that wallet, I believe which is supposed to be a ton wallet, how do I demand my ton funds?

Bode: who can help me please

Highly: You sent a ticket to bybit about it already ?   I don't quite get you though (reply to 86578)

Bode: yes, I already sent the ticket to bybite and they resolved it by sending my funds back, but it does not appear in my ton wallet, I believe that my funds have left and returned from a main ton wallet

Bode: I have the exit and return ID, I leave and enter the same wallet, but it's not mine

Bode: @tom_king_s you are adm?

Highly: Can you send the tonviewer link to DM  You can share it here of you're comfortable with it (reply to 86583)

Highly: No no, I just want to help (reply to 86584)

Highly: Even another on trust wallet, good thing it was opened today hehe

Rayan: Fellas! (reply to 86566)

&rey: I expect that you sent USDT from Telegram's wallet originally? If so, you need to "demand funds" from them, no one except Wallet's support can help you. (reply to 86578)

Carter🧹: What is the appropriate way to determine the Tx Hash of a confirmed transaction? I'm just trying to verify my code.  Is it the representation hash of the OutMsg, the Message, or the Transaction? Or something else entirely?

Carter🧹: I can see here that the OutMsgDescr is the message hash.  But certain messages, when you take their key, are not located on explorers like tonviewer, I assume because they are OutExternal messages, with no destination. I'm trying to find the source Transaction of this message. So assuming I have the correct TxHash, I can use the previous message from this account as the source of this OutMsg?  https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/doc/tblkch.tex#L244  The outbound message description {OutMsgDescr} uses the 256-bit message hash as a key.

Louis: I placed 2 TON why

Louis: I dontknow it

&rey: You're trying to forward 1 TON out of 1 TON provided for jetton transfer processing? (reply to 86611)

&rey: That is not possible because of gas and message fees.

Louis: NO

Louis: I placed 2Ton

musashi: try smaller, 0.05 for example (reply to 86617)

Louis: Excess HOW TO code

Louis: I know it is return to user_wallet

&rey: Better .store_coins(0) and send mode 66. (reply to 86622)

Tuan: Hi, I have a exBoc in the result of sending message, Can I check the corresponding transaction with this exBoc from receiver address

Thea: What help did you need (reply to 86543)

Stephan: Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please

Aes: Hi, I'm trying to send a transaction but I keep getting: pytoniq.liteclient.client.RunGetMethodError: Get method "seqno" for account ... returned exit code -256  looking at different messages in this group I invoked wallet.send_init_external() but now it fails with: Liteserver crashed with 0 code. Message: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by transaction EF01DE36DC0DF649DB23F67884CC7D021D87836F88048ECBA4336703E88DAB5B: exitcode=36, steps=13, gas_used=0 VM Log (truncated): ...CTPUSHCONST 19 (xC_,1) execute DICTIGETJMPZ execute PUSHPOW2 9 execute LDSLICEX execute DUP execute LDU 32 execute LDU 32 execute LDU 32 execute XCHG s2 execute NOW execute LEQ execute THROWIF 36 default exception handler, terminating vm with exit code 36  which, again, seems seqno related.  I'm not directly handling the seqno, I'm just trying to use a smart contract with: await wallet.transfer(     destination="EQD....",     amount=total_amount,      body=swap_message )  any pointers?

final: hi, how to deploy jetton metadata onchain

&rey: Time is set incorrectly on your computer (the error says NOW LEQ THROWIF 36). (reply to 86646)

Mehran: Hi everyone,  We are looking for an option to run a DAO trough ton[dot]vote where our web3 project's token holders could be able to submit proposals or vote for submitted ones.   The main idea is: If a member submitted a proposal to update code of one of our project's smart contracts and this proposal passed successfully (got enough Yes votes) then the community have a way to run the code update request which was inside the proposal.  Is there any way to update the code from DAO? Is there any solution?   Thanks for your support in advance

Aes: I'm trying to swap usdt with dedust but the transaction just fails, no idea why  this is the tx hash; 7e63bd924594b889f788288885fe1c774edca23e56ed9ca22934282b30b6fbda

RUN: hi everybody.

RUN: is it possible to access the tx comment in the contract?

v1t4l3y: Hi guys again  I’m trying to launch few validators in testnet and I need some tokens to start validating who can share enough to launch 3+ validators

Stephan: Hi guys, please help me, I created jetton according to this standard - https://tact-by-example.org/07-jetton-standard  I need to send my token through another contract. Here is my contract     import "@stdlib/deploy"; import "@stdlib/ownable"; import "./sample_jetton";  contract TestJettonTransferV20 with Deployable, OwnableTransferable {     seqno: Int as uint64; //Unique identifcator of game     owner: Address;     tokenMaster: Address;     tokenValue: Int as coins;      init(seqno: Int) {         self.owner = sender();         self.seqno = seqno;         self.tokenMaster = address("EQC2C3NAI10BnSK96hO_fBpAZ4dr8Pc8vXT77qQrKrh7bZ0G");         self.tokenValue = ton("100");     }      receive() {              }      receive("Jetton") {                    let user: Address =  address("0QDUjiO08AZdPz8vzOX4HqqH5nGghOocerxpfPIJZoyltpNx");                  // let init: StateInit = initOf JettonDefaultWallet(self.owner, user);          let initContract: StateInit = initOf JettonDefaultWallet(self.tokenMaster, myAddress());         send(SendParameters{                 to: contractAddress(initContract),                  value: ton("0.1"),                 mode: SendIgnoreErrors,                 bounce: false,                 body: TokenTransfer{                     queryId: 5151556711,                     amount: self.tokenValue,                     destination: user,                     response_destination: self.owner,                     custom_payload: emptyCell(),                     forward_ton_amount: 0,                     forward_payload: emptySlice()                 }.toCell(),                 code: initContract.code,                 data: initContract.data             });       } }   I deployed it and then sent a little TON (for commissions) and my token to it, when I call "Jetton", this error comes out (in the screenshot). I have already made dozens of attempts with different code, but the tokens are not being sent. Help please

&rey: Please check actual error code (shown upon hover over C) against your sample jetton code. (reply to 86666)

Carter🧹: I often get this error when calling run_smc_method, but reposting the request returns a success. Has anyone seen this before?  parameter list boc cannot be deserialized as a VmStack : -400

Misha: Guys, why can exit code -13? I've deposited the money for the contract

— 2024-07-21 —

ahari: Are there developers here on the Ton network?

Thea: Are you looking for one (reply to 86720)

Thea: Chat me (reply to 86720)

TON Bounty Bridge: ​"TONList: Инновационная Платформа для Токенсейлов в Telegram с Внедрением Системы Звезд"  Created by Tonlistio

TON Bounty Bridge: ​Minnonh  🏷 Developer Tool  Summary:Zu hausrär  Created by Luk42077

.Sam.: Hi y’all, there are few taxed jetton tokens going around, can someone hook me up with a developer who has experience making it ?

Justin: Hey everyone, we’re building a Jetton that we need to have certain functionality. We have a cliff on the token and then a vesting schedule.   I know TON has a multisig but it looks pretty rudimentary. Is anyone building a Safe type dApp for TON?  The other thing I’d like is a streaming money solution like Superfluid. Does this exist?  If anyone’s working on these solutions please let me know and we’d love to help with testing

Mahdi: Hi all.  We want to transfer our NFTs from Polygon network to TON network. Our NFTs have a quantity in the polygon network, for example, we have 100 of each item. This quantity for items does not exist in TON network or we did not find a way for it. Can you guide me? This is very important for us, otherwise we cannot use TON network. This may be a problem for many developers.  Thanks for attention (reply to 86549)

ຮꫀթí: Hi , how can transfer TON with mnemonic with nodejs or python ?

&rey: With pytoniq it is quite simple. Do you need script? (reply to 86747)

ຮꫀթí: yes if possible (reply to 86754)

&rey: This should work: https://t.me/tondev_eng/71244. (reply to 86756)

ຮꫀթí: not work  error: remote get method result is not provable, use run_get_method_local for local tvm execution  pytoniq.liteclient.client.LiteServerError: Liteserver crashed with 0 code. Message: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by account 2B433FAC07048742258E27F8D41A19C50E53DE8360B11FEF78DC117118C5F3F8 before smart-contract execution (reply to 86757)

&rey: Is wallet initialized already, by any chance? (reply to 86761)

Abdulaziz: Question about premium, many telegram web applications give a more bonus for telegram premium. Do web app owners get paid to add extra premium bonuses or do they just do it that way?

T: Hello, I'm looking for a vacancy in Web3. I have experience working as a Community Manager for a project with 100k members, and the current chat has 17k users. I've worked so far with Telegram and the TON blockchain. Additionally, I have a small team that can assist with development.

Abdulaziz: t.me/tonhunt (reply to 86781)

T: thank you 💖 (reply to 86782)

ຮꫀթí: Yes, I was able to, and one question, what does this 1 mean in the from_mainnet_config?  provider = LiteBalancer.from_mainnet_config(1) (reply to 86768)

&rey: IIRC it is trust level. 0 would fully check blockchain validity (this is a rare feature among libraries!), while 2 is used with your own node which you trust unreservedly. (reply to 86786)

Shadow: How can I mint SBT on testnet?

Sigrid: I want to do a Cohort Analysis on TON, does anyone have an idea how to do it?

Thea: Chat me I have a job for you (reply to 86781)

Nguyen: How can I get result of transaction with boc? I am using @tonconnect/sdk.

&: Check tonapi.io (reply to 86800)

Neo: hi all gus , i have a question, how to get user avatar in mini app ?

Sina: is there a way to speed up a transaction ?

MZ: When I try to connect wallet on mobile and click "Open Wallet in Telegram" everything works good.  However when I click "Open Wallet in Telegram" using Telegram desktop app it opens Wallet, but I see something like on the screen.  So I dont't see "Connect Wallet" button, but have an option to create a new wallet. Meanwhile as you see I have wallet already created and just would like to connect it.  What is the reason? I use @tonconnect/ui-react.

Kryptonite: export async function sendDeposit(contractAddress:Address,amount:string,tonConnection:TonConnectUI){   const tx:SendTransactionRequest={     validUntil:Date.now() + 5 * 60 * 100,     messages:[       {         address:contractAddress.toString(),         amount:BigInt(toNano(amount)).toString(),         stateInit:undefined,         payload:                   beginCell()                 . storeUint(Opcodes.deposit,32)                 . endCell()         .toBoc().toString("base64")       }     ]   }   await tonConnection.sendTransaction(tx); }   how to configure to send fees separately ?

Son: What data do I need in order to calculate a message hash? When I get the transaction from rpc, I got body hash but it’s always different from the message hash on tonscan. I think the message hash will need the body raw data but with some other data but I have no clue what that is. Thanks for your help.

Bode: I spoke to the wallet support team, but it's been almost 2 days and no one responds to me

Bode: I had a problem with my deposit

Bode: Will anyone still talk to me?

&: Have a look at docs.ton.org, Search pay_fee_seperate (reply to 86820)

&: I think there's no way to boost specified tx in TON, but if you want to send many-many txs at one time, there's solution (reply to 86817)

Kryptonite: but i am using tonconnect sdk bro (reply to 86831)

&: There's no limit wether what sdk you use, Plz have a look on sterik tutorial video (reply to 86833)

&: You should set specfied bit as 1 U can find detail in docs (reply to 86833)

&rey: No one except Wallet support team can help you. They may have attracted significantly more users than support can process... (reply to 86830)

Bode: @pcrafter please help me

Bode: I spoke to the wallet support team, but it's been almost 2 days and no one responds to me

&rey: How!? No one in this chat has Wallet secret keys to process deposit manually or do something like that. (reply to 86837)

Bode: Is this delay normal? Or is there another channel where I can ask for help?

&rey: Yes, this delay is widely reported. I haven't heard of any place to ask for help with Wallet which would work. (reply to 86840)

Bode: I'll wait then, thanks

&: Can you share your tx hash? (reply to 86699)

Misha: I've already fixed it, thanks (reply to 86845)

mohsen: Hello friends How can I encrypt my comments on the TON blockchain? Do TON python libraries support this?

Engue: i'm looking for a dev it's not the right place?

&rey: No. @tonhunt is better. (reply to 86849)

&rey: You have to call cryptography functions yourself IIRC. There is description in docs.ton.org which lists the steps. (reply to 86847)

Engue: thanks didn't know this channel (reply to 86854)

mohsen: Libraries like "pytoniq" do not have this function? (reply to 86855)

Engue: can't contact the support (reply to 86854)

&rey: No I believe. (reply to 86857)

&rey: This looks fine. (reply to 86858)

Engue: yeah but my dm didn't arrived 😂 (reply to 86860)

Lucky: Looks good (reply to 86858)

Jonny: hi everyone, is the L2 based on polygon tech already available? anyone knows where i can get updated on this? https://www.coindesk.com/tech/2024/07/09/ton-blockchain-will-release-new-layer-2-based-on-polygons-technology/ (reply to 36903)

Thea: This news on coindesk (reply to 86863)

&: https://t.me/tondev_news/125 (reply to 86863)

Jonny: thanks! i understand this is not something promoted by TON foundation but i figured it's being developed by others. was i mistaken?

D: Hi  does anyone know how to compile a migration code for migration_code?  execute(migration_code.begin_parse().bless());

Emmanel: Anyone looking for a developer? I'm a fullstack developer with 5 years of experience.  You can contact me

MZ: Anyone? (reply to 86819)

Sina: what is LT in transactions ?

Alex | Rango: it's Logical time or Lamport time (later just lt). It is used to understand which event caused another and what a validator needs to process first.  read more: https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time (reply to 86883)

Vagram: Hello guys.   It turns out when a Telegram Mini App uses Google authentication for signup/signin, I get the following error:  403 disallowed_useragent  Any workaround is possible here?

Emmanel: I guess the issue is with the web app

Emmanel: Route user away from the Web app to a website then send them back to the webapp with an id you can verify in your backend to get the usrt info

Emmanel: I meant the telegram injected browser... I've forgotten what's called (reply to 86909)

Alexander: Hi! Are we able to change the address format that blueprint uses by default? I mean in places like “Connected to wallet at address: ...”. e.t.c.  I'd prefer the "raw" format in such scripts

Mikail: Hello, everyone. I am a frontend developer and am currently on the lookout for a job. I would like to develop TelegramMiniApp.

TON Bounty Bridge: ​###Simplifying training mixed with artificial intelligence  🏷 Education  Summary:By simplifying the teaching tips for the users, especially the beginner user, the complexity of the ...  Created by yalan2ny

User<5912793884>: hello how to write smartcontract with function

— 2024-07-22 —

User<5912793884>: HOW CAN someone created honeypot token ?

Almatbek: token design and deploy (reply to 86930)

User<5912793884>: i buy that and cant sell omg

User<5912793884>: can we talk ? (reply to 86931)

User<5912793884>: so the dev deploy from cli not from minter ton ? (reply to 86931)

Vinícius: I would really appreciate it if someone can help me transfer an amount of Ton from Olx to Telegram Wallett

Khang Pham: Hi guys, does anyone have the public source code of hamster kombat game?

Vinícius: No

Abdulaziz: How to get verification to the token?

He: What does it mean when the contract status shows Frozen?

Prince: you can check here https://docs.ton.org/develop/data-formats/transaction-layout

perfect: Hello, experts. Can anyone help me? I want to introduce a tuple as global variable to blueprint's simple counter contract and I don't know how to rewrite the contract code...

Johnny Le: what kind of honeypot ? (reply to 86930)

Yassin: how to switch tonkeeper web to testnet?

Prince: just click the ton icon several times on setting

Kryptonite: can we delete the smart contract and pass on all the tons to message sender ?

Kryptonite: go to tonkeeper -> settings -> scroll all the way bellow -> click more than 5 times on toknkeeper logo -> you will see the option to switch (reply to 86973)

Louis: How to read the source code

User<5648379066>: You can read source code in visual studio and visual studio code (reply to 86995)

User<5648379066>: But need download code in file

Louis: How to convert (reply to 86997)

Louis: This isn't the code I wrote

Bryce: hi

Bryce: i have a issue in tonconnect that runs into a error in my react app  here is the error Failed to dispose the resource Error: Operation aborted

User<5648379066>: You need go to GitHub of this project and tap on code later you tap download zip (reply to 86998)

Louis: Not open source (reply to 87004)

®0m@1ñ: Hello ! Is it possible ton connect a user with a wallet address in parameter with ton connect ?

Carlos: I Have one problem you can help-me?

0xbera: Hello! How are elected validators chosen to propose a new block? Is this described anywhere?

0xbera: how is the hash of transaction calculated -- is logical time part of the input?

&rey: Yes. Send message with value = 0, mode = 160 to message sender. (reply to 86993)

&rey: Hash of transaction cell. So yes, lt is there, at least when processing external messages. (reply to 87015)

&rey: If there isn't source code published, then there isn't source code. (reply to 86995)

&rey: You have to switch to Tonscan, you'll be able to see TVM assembly; it's the best option you can get.

Peng: Hello i need some help  Can someone tell me for config files How are the ip address converted to long number format

&rey: Depends on the problem, of course. For instance, problems with common custodial services handling your funds incorrectly are offtopic here. (reply to 87012)

&rey: IIRC like so: >>> list((-10008943 % 2**32).to_bytes(4, 'little')) [145, 70, 103, 255]  # stands for 145.70.103.255 (reply to 87025)

Peng: Thank you let me give it a go (reply to 87028)

Kryptonite: Thanks bro ! (reply to 87017)

&: You cannot read this code. Ofc you can get low-level assembly code or persuade code but you can't get a full project code.  But if someone verify this contract code you can read it(like evm) (reply to 86995)

Maede: Hello.I deployed a smart contract in test network. But the jetton parameter data in is not loaded. where is the problem??

Амир: In jetton metadata (reply to 87036)

Nerses: can different Jetton implementations have different names for Token transfer Message ?

&: Did you set stateinit when you deploy Contract?

Nerses: in case smart contract recieves jettons and it should send that jettons to another address.How should smart contract know what is named the transfer logic to send message with correct type ?

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 60 ✅ Approved bounties: 6 🔄 Bounties seeking suggestions: 14  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Nerses: is there any implementation of this flow ?   https://docs.ton.org/develop/dapps/asset-processing/jettons#jetton-wallets-communication-overview

Louis: Thanks bro ! (reply to 87035)

Louis: Is it appropriate for me to only keep 0.001 tons for this jetton_master contract

&: It depends on your mind.  Be aware of gas fees by yourself (reply to 87058)

Louis: but it must nedd storage fee?

Louis: need

Louis: If I only put 0.01 ton, how long can my contract last

Kunal: Hi, is there a way to understand the external messages out structure? There are no docs explaining how to read the body of external out messages.

Maede: Can send me a active contract in test ton network? Usdt is inactive

Arseny: There's an official calculator https://docs.ton.org/develop/howto/fees-low-level#calculator-example It depends on how many bits/cells you plan to store (reply to 87066)

&rey: Yes, if it doesn't store jetton image onchain. Please remember that contract will only be frozen upon reaching -0.1 TON of balance. (reply to 87058)

adb: 1

adb: hi guys, I have a qq regarding minting NFTs with React/NextJs.  Any Help will be appreciated, because I am a bit lost in SDKs...  So there is a TonConnect UI Sdk that I can use to connect with user wallet and send transactions - this is clear.   Then, if I follow this tutorial (https://pinata.cloud/blog/how-to-mint-an-nft-on-ton/) they use tonweb SDK for NFT collection and items deployment.   From what I understand, my steps to deploy an NFT item are:   Use tonconnect for getting wallet info and TonWeb for deploying the NFT collection and minting NFT items. Is that correct or am I missing something?   Secondly, from what I understand the native wallet in telegram doesnt support the testnet. Could you please recommend a wallet that supports testnet?

Ян: Hello, why is this happens?

Manish: 555550

&rey: https://ton.org/wallets, for instance. (reply to 87081)

The: Hi, is it possible to make TON transaction in Telegram WebApp? On websites you would need browser extension, but what about in Telegram WebApp?

Nerses: how can i identify jetton on chain ? as described here : https://docs.ton.org/develop/dapps/asset-processing/jettons#on-chain-processing-recommendations:~:text=Identify%20incoming%20jettons%20using%20their%20wallet%20type%2C%20not%20their%20Jetton%20master%20contract.%20In%20other%20words%2C%20your%20contract%20should%20interact%20(receive%20and%20send%20messages)%20with%20a%20specific%20jetton%20wallet%20(not%20with%20some%20unknown%20wallet%20using%20a%20specific%20Jetton%20master%20contract).

Almatbek: sure it's possible (reply to 87094)

The: Is it done without wallets? Like I can implement to press a button 'Pay' and the payment would be sent? If I have sender address, recipient and amount in TON off course (reply to 87098)

User<6907310132>: Hi everyone,  Have you good weekend?  How can I implement the Copy/Past function in the telegram mini app?

User<7192644220>: Hi @pcrafter  How are you? I am wondering how stonefi makes a pool between one jetton and TON coin? can't find any related part in their core contract

&rey: TWA is a website, actually. (reply to 87094)

&rey: Offtopic for the chat, but it's same as in websites; also, if you use semantically correct HTML elements, copy/paste should work automatically. (reply to 87100)

The: Yes but WebApp is launched inside of Telegram, so there I don't have Browser Extensions.. So how to create transaction without connection to the wallet (reply to 87102)

&rey: You use TON Connect 2 in the same fashion as website accepts connection from mobile wallets. (reply to 87104)

0xbera: Hello! I am struggling with this tonutils-go function: DeployContractWaitTransaction() -- what value should I pass for the 3rd parameter (`contractData`)?

The: Can you provide me with any example or docs? (reply to 87105)

0xbera: I am afraid to paste a code snippet .. I was banned twice last week 🙁

0xbera: May I provide a link?

Nightfall: hello everyone, I have one question AFAIK, a dict in ton is represented as a cell. a cell can only contain upto 1023 bit. Does this mean the dict will have a limit size as well (e.g you cant store more than n key-value pairs)?

Nerses: I think this might be helpful:    https://tact-by-example.org/04-maps#:~:text=Limit%20the%20number%20of%20items (reply to 87116)

0xbera: https://pkg.go.dev/github.com/xssnick/tonutils-go@v1.9.8/ton/wallet#Wallet.DeployContractWaitTransaction (reply to 87109)

Nightfall: thanks a lot man (reply to 87117)

lanford: Could anyone tell me why is this transaction failed? https://tonviewer.com/transaction/a09ec717c47d9dcabb53d57793b01fefbada71955ef7cfa03130747bed9d0e76

lanford: Actually, it is success on https://tonscan.org/tx/a09ec717c47d9dcabb53d57793b01fefbada71955ef7cfa03130747bed9d0e76, I don't know why is it

Dick: I'm experiencing a bug after linking my wallet, can you take a look at it for me?

0xbera: /me

&: Is this your contract? This jetton wallet is not a standard wallet and you need code to get what is wrong. Or contact with developer to find when error 16059 ocurrs. (reply to 87125)

&: If you cannot find it, then have a look at ston.fi client side sdk. (reply to 87101)

adb: Is there a fast way to see the transaction payload like a dictionary

lanford: Thank you! Exit code 16059 means Invalid value  right? I think I have enough balance but this error is still raised (reply to 87135)

User<7192644220>: there doesn't exist a real pool with TON coin in stonfi? (reply to 87136)

&: it's developer defined number, Idk what does it mean only developer knows (reply to 87139)

&: no there is (reply to 87140)

lanford: Thank you! (reply to 87141)

User<7192644220>: but as I checked the core contract, no idea how to make a pool with TON coin (reply to 87142)

User<7192644220>: The pool is made from TokenNotification mesage

User<7192644220>: but in the case of TON coin, it is impossible, right?

&: Please have a look at a pool-making tx, then you can find everything (reply to 87144)

Seyamish: I didn't buy creypto and I can't see my coin

User<7192644220>: I know how it works for making pool between normal jettons. but no idea for a pool with TON coin (reply to 87147)

&: Please have a look at ston.fi sdk, There's everything (reply to 87149)

&rey: Dict is a cell with references; a binary tree, in other words. (reply to 87116)

Dick: Why can't I enter content in the input box after clicking on the telegram to open the wallet?

Nerses: can i send message in body of send() with op_code of message not using name of the message ?

Nerses: to: myAddress(),                 value: ctx.value,                 bounce: true,                 mode: 0,                 body: TokenTransfer {                                     queryId: 9072345,//e.g.                                     amount: (self.commits.get(msg.data.commitId)!!).amount,                                     destination: (self.commits.get(msg.data.commitId)!!).sender,                                     response_destination: ctx.sender,                                     custom_payload: null,                                     forward_ton_amount: ctx.value,                                     forward_payload: "Token Transfer".asSlice(),                                  }.toCell()             } for example insted of TokenTransfer write 0x...

&rey: body: beginCell().storeUint(0x..., 32) ... .endCell() (reply to 87155)

DJ: /Hi @Engue (reply to 86849)

DJ: Did you find a dev?

adb: guys, is there an NFT mint transaction example available somewhere (using tonconnect ?

User<7192644220>: I consulted. they are using getProvideLiquidityTonTxParams(proxy ton) but there is no related part in core contract, as I said (reply to 87150)

User<7192644220>: @pcrafter  any idea? (reply to 87162)

️: what's the easiest way to get pool transactions in real time in Python like it does Tonviewer?

mybucks: is there ZK Proof library built with FunC?

Tim: bro same question (reply to 87165)

Tuan: Is there anybody using this code to find a transaction which matched a exBoc. After finding the approciate transaction, how can I get the amount of this transaction.

:): Does anyone have an example of sending a transaction with WalletContractV5R1?

:): like this with v5 :   import { getHttpEndpoint } from "@orbs-network/ton-access"; import { mnemonicToWalletKey } from "@ton/crypto"; import { TonClient, WalletContractV4, internal } from "@ton/ton";  async function main() {   // open wallet v4 (notice the correct wallet version here)   const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)   const key = await mnemonicToWalletKey(mnemonic.split(" "));   const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });    // initialize ton rpc client on testnet   const endpoint = await getHttpEndpoint({ network: "testnet" });   const client = new TonClient({ endpoint });    // make sure wallet is deployed   if (!await client.isContractDeployed(wallet.address)) {     return console.log("wallet is not deployed");   }    // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e   const walletContract = client.open(wallet);   const seqno = await walletContract.getSeqno();   await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [       internal({         to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",         value: "0.05", // 0.05 TON         body: "Hello", // optional comment         bounce: false,       })     ]   });    // wait until confirmed   let currentSeqno = seqno;   while (currentSeqno == seqno) {     console.log("waiting for transaction to confirm...");     await sleep(1500);     currentSeqno = await walletContract.getSeqno();   }   console.log("transaction confirmed!"); }  main();  function sleep(ms: number) {   return new Promise(resolve => setTimeout(resolve, ms)); }

&rey: It should be equivalent, isn't it? (reply to 87175)

Огурчік: this is my code:    import asyncio from ton.sync import TonlibClient   TonlibClient.enable_unaudited_binaries()  client = TonlibClient(ls_index=1, config="https://ton.org/testnet-global.config.json")   async def main():     try:         await client.init_tonlib()     except Exception as e:         print(e)   if __name__ == '__main__':     loop = asyncio.get_event_loop()     loop.run_until_complete(main())     loop.close()   Why i getting error =  [ 4][t 0][2024-07-22 16:20:14.966678][Client.cpp:84][&tonlib_requests] End to wait for updates, returning object 1 0x600000b755f0 [ 4][t 0][2024-07-22 16:20:14.966952][Client.cpp:78][&tonlib_requests] Begin to wait for updates with timeout 0.100000 INVALID_CONFIG: hardforks differs from embedded hardforks [ 4][t 0][2024-07-22 16:20:15.067981][Client.cpp:84][&tonlib_requests] End to wait for updates, returning object 0 0x0 [ 1][t 0][2024-07-22 16:20:15.078673][Client.cpp:94] ~Impl [ 1][t 0][2024-07-22 16:20:15.079338][Client.cpp:96] Wait till closed [ 4][t 0][2024-07-22 16:20:15.079351][Client.cpp:78][&tonlib_requests] Begin to wait for updates with timeout 10.000000 [ 4][t 0][2024-07-22 16:20:15.079362][Client.cpp:84][&tonlib_requests] End to wait for updates, returning object 0 0x0 [ 1][t 0][2024-07-22 16:20:15.079368][Client.cpp:100] Stop [ 1][t 0][2024-07-22 16:20:15.079392][Client.cpp:102] join [ 1][t 0][2024-07-22 16:20:15.079517][Client.cpp:104] join - done

Огурчік: what i do wrong?

&rey: Your tonlib binaries are too old somehow. (reply to 87187)

Огурчік: how i can upgrade it? because i used pip upgrade, but it doesn't help (reply to 87189)

&: Check TONAPI.io (reply to 87165)

&rey: Is there any chance you could switch to another lib? pytoniq would be significantly easier. (reply to 87190)

Nerses: How to convert Slice to Address  on chain ?

Piyush: Can anyone help me how we can deploy a wallet contract on blockchain for transferring from one wallet to another. Using ton/client testnet

Rahul: Hi! Has anyone worked on ston.fi typescript sdk before for creating liquidity?

Cuddlesaurus: I am a web3 developer with 4 years of experience. please ping me if you need my help. PS: familiar with smart contract

Rahul: I am using funC as my base language for smart contracts

&rey: s.loadAddress() in Tact. (reply to 87193)

️: do you mean /v2/blockchain/accounts/{account_id}/transactions?  I'm not sure if it will be that simple, afaik pool transactions consist of many simple transactions, which requires domain knowledge, parsing many transactions into one human-readable (reply to 87191)

Piyush: Also how we can get wallet information through public key (reply to 87194)

Nerses: as data is more than 1023 bits.What fields should i pass with reference ? and also will not it break TEP 74 ? (reply to 87157)

&rey: Exact data format should be specified in TL-B of destination contract. (reply to 87201)

Nerses: so it is possible existance of two Jettons according to TEP 74 but with different TL-B s ? (reply to 87202)

&rey: TEP-74 fixes only external TL-B interface of jetton systems. (reply to 87203)

Piyush: Please help me for this (reply to 87194)

Nerses: so i cant send jetton transfer message if i dont know certainly how interface is implemented,more specificaly name of messages(although op_codes are same,problem comes with references) (reply to 87206)

Michael: Is there a place to be able to post and look for non-technical potential team members/cofounders  :/?

User<7192644220>: ? (reply to 87164)

&rey: Yes, @tonhunt. You should look for developers there as well, not in this chat. (reply to 87212)

Michael: I feel like that’s more of formal job offers board. I’m rather looking for collaborators/cofounding members (reply to 87215)

Nerses: is it possible to call getter of smart contract inside other smart contract ?

&rey: No. (reply to 87219)

User<6552923794>: How can i get transfer fee of jettons? With tonweb

Rahul: ?? (reply to 87195)

Огурчік: if we talk about it - libtonlibjson.arm64.dylib i have last version, i have get it from github  i dont know, but it works if i remove config and use it like this   Python  import asyncio from ton.sync import TonlibClient   TonlibClient.enable_unaudited_binaries()  client = TonlibClient()   async def main():     try:         await client.init_tonlib()     except Exception as e:         print(e)   if __name__ == '__main__':     loop = asyncio.get_event_loop()     loop.run_until_complete(main())     loop.close()   why? (reply to 87189)

&: Check https://docs.ston.fi/docs/developer-section/api-reference-v2/example_lp_provide (reply to 87195)

Огурчік: lol, it works if i use - https://ton-blockchain.github.io/global.config.json  and doesnt works with https://ton-blockchain.github.io/testnet-global.config.json (reply to 87226)

Огурчік: ton.tonlibjson.TonlibError: INVALID_CONFIG: hardforks differs from embedded hardforks

Огурчік: whats wrong?

Xipz { WILL_NOT_DM_FIRST }: New to TON but I've got a heavy background in EVM

Xipz { WILL_NOT_DM_FIRST }: Any big differences between TRC-20 and ERC-20?

&rey: TRC-20 isn't related to TON in any way. Maybe you wanted to ask about TEP-74? (reply to 87237)

&rey: That's quite unfortunate (many people find they are better off forgetting about EVM). (reply to 87235)

&rey: TON fungible token standard, TEP-74, dictates that each user's token balance is stored in a separate contract called "jetton wallet". "Jetton master" contract is responsible for mint and tracking total amount of jettons.

Xipz { WILL_NOT_DM_FIRST }: EVM made me tonnes in the past so I've got a soft-spot for it.  But, usually I'm in DeFi communities beforehand so I have an idea of the workflow of the blockchain (I.E. What dApps/services people use and the token standards), whereas with TON I literally haven't touched it until a few moments ago. Just looking for a few good sources of documentation haha.

Xipz { WILL_NOT_DM_FIRST }: Okay perfect, so Jettons are the standard for the contract and jettons are how you refer to any given token? (reply to 87241)

Огурчік: Is there an example of how to make a transaction? I opened the documentation, and there is zero mention of how I can import my wallet, for example using a seed, and make a transaction... (reply to 87192)

&rey: Please search in this chat or check out exported items. (reply to 87247)

Огурчік: as for as i understand, this is example 🙃 (reply to 71244)

Огурчік: emm.....  ImportError: cannot import name 'LiteBalancer' from 'pytoniq' (/opt/homebrew/lib/python3.11/site-packages/pytoniq/__init__.py) (reply to 87250)

Огурчік: LOL, i cant find LiteBalancer in lib, sure, i see it in github docs, but thats all, this is tough .... (reply to 87248)

Огурчік: there are a lot of examples, but none of it works, I don’t know how to feel about it

&rey: Well, it most certainly exists (https://github.com/yungwine/pytoniq/blob/master/pytoniq/liteclient/balancer.py), and I was able to load it... (reply to 87255)

Prince: what is the ideal way to store a lot of wallet addresses on contract? using dict? or any good method?

Огурчік: i have installed it useing pip, and in liteclient directory locally a have only these files:😆😆😆  -rw-r--r--  1 who  admin     88 Jul 22 19:25 __init__.py -rw-r--r--  1 who  admin  39800 Jul 22 19:25 client.py -rw-r--r--  1 who  admin   5420 Jul 22 19:25 sync.py -rw-r--r--  1 who  admin    636 Jul 22 19:25 utils.py (reply to 87257)

Огурчік: fucking mac os

&: storing all the addresses in Contract is not smart. Calculate addresses is much better (reply to 87258)

Frosiva: I can't install tontools library in python

yarik: Does anyone know if there is a method on the TonClient to be able to differentiate between an NFT transaction and a regular transaction? I'm able to get all the transactions from a blockchain but I cannot tell regular TON transfers apart from NFT transfers

yarik: Or perhaps a way to tell apart the contract type? I really wish TON was more documented (reply to 87269)

yarik: The only way I've managed to find is by using the tonapi io (reply to 87269)

yarik: in case anyone else needs in the future

Michael: Is there any place by any chance where I can post something to potentially find a non-technical co-founder for a TON project? When i posted about it with description of what im looking for, i got auto-banned from the TON society chat

Ян: https://tonviewer.com/transaction/f3a4e63c8df56ea95674755752b9b40a2fd93e1b96a1455393c3649016fd3142  https://testnet.tonviewer.com/transaction/aa1ebaa3d05adf4090ef2e0a3c732b09b41bc3a7463e93219f68c5772186e4cc  What could be the problem?It worked on the testnet  , but it doesn't work with notcoin in mainnet

User<5912793884>: can buy and cant sell (reply to 86965)

Amir: hi guys recently some group release a pool for ton i think with ability to set tax and developer fee , is there any documentation about this ?  the group name is stonks

Огурчік: i would like to send my jeton tokens to my test ton wallet, i use this code:   import asyncio import logging  from pytoniq import LiteBalancer, WalletV4R2 from pytoniq_core import Address, Cell, Builder  seed_phrase = "seed from my TON wallet witch was connected to my JeTon wallet" connected_jetton_wallet_address = "address from my TON wallet witch was connected to my JeTon wallet" destination_address = "my test TON asdress" jetton_address = "address of my jeton wallet"   mnemonics = [x for x in seed_phrase.split(' ')]  async def main():     logging.basicConfig(level=logging.INFO)     provider = LiteBalancer.from_testnet_config(1)     await provider.start_up()      wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)          owner_address = Address(wallet.address)     request_stack = [owner_address.to_cell().begin_parse()]     result = await provider.run_get_method(address=jetton_address, method='get_wallet_address', stack=request_stack)     sender_jetton_wallet_address = result[0].load_address()     print(f"Sender Jetton Wallet Address: {sender_jetton_wallet_address}")          try:         result = await provider.run_get_method(address=sender_jetton_wallet_address, method='get_wallet_data', stack=[])         jetton_balance = result[0]         print(f"Jetton balance for sender: {jetton_balance} HEAD")     except Exception as e:         print(f"Failed to retrieve Jetton balance: {e}")         return          transfer_amount = int(10**9 * 12000)      builder = Builder()     builder.store_address(Address(destination_address))     builder.store_coins(transfer_amount)     payload = builder.end_cell()      transfer_message = Builder()     transfer_message.store_address(Address(destination_address))     transfer_message.store_coins(transfer_amount)     transfer_message.store_ref(payload)     transfer_body = transfer_message.end_cell()       transfer = {         "destination": sender_jetton_wallet_address,         "amount": 1,         "body": transfer_body     }     await wallet.transfer(**transfer)     print(f"{transfer_amount / 10**9} Sent to {destination_address} from {sender_jetton_wallet_address}.")      await provider.close_all()     asyncio.run(main())   at first sight it works, because there is no errors, but i don't see my jeton tokens on test account, what is wrong?

Almatbek: I am here (reply to 87279)

— 2024-07-23 —

Joel: I have TON's in test ton wallet, my cuestion is: can I sent to other wallet ?

Peng: has anyone ran ton-http-api before? i need some help regardin the main.json

Lee: Hello, everyone.  I want to develop a feature that awards points through a simple game and later converts these points into Jettons through wallet integration. However, when trying to store all game-related data and points on the blockchain, the performance seems too slow and could be inconvenient for users. I am curious about how the TMAs in App Center or the DAPPs in Ton App might have solved this issue. Would it be acceptable to store game and point-related data on Web2 (cloud) and only handle the point-to-Jetton conversion through blockchain transactions?  It's not a short message, but I would really appreciate it if you could read it and respond. Have a great day, everyone.

Lee: What kind of collaboration are you talking about?

User<7248359571>: I want to sell it

Lee: It's still in the development stage, so I'll make a request when the service comes out later. Thank you

Johnny Le: make a custom require to put in the jetton default token, only wl wallet can transfer. Ex in here, add pool address as wl so user can buy (reply to 87283)

Louis: what wrong

User<5912793884>: can i dm you ? (reply to 87327)

𝔸𝕄: Check semicolon higher (reply to 87328)

User<5912793884>: i want ask something (reply to 87327)

ckyth: 🤪

Lee: Would it be better to store game and point data in the cloud for a service that awards points through a game and allows those points to be converted into Jettons? Or should all data be stored on the blockchain? I'm concerned about potential performance issues with the latter. If anyone has any insights, I would really appreciate your response. Thank you.

Catid: exume to build NFT its TON  same like everscale ?

Catid: hellow  want to ask  if we create nft collection on get gems  and we create minter on our apps its possible ?

Amir: hi did you find anyone ? or any document (reply to 86733)

Maede: this community just people questions, anyone no answer

[+_-]: Good day everyone! I've been looking through the core contracts of STON.fi and noticed something that I don't quite understand. It concerns the deserialization of the msg_body from a message with op::transfer_notification. In both repositories, stablecoin-contract and token-contract, the message body is stored in a reference:          var msg_body = begin_cell()             .store_uint(op::transfer_notification(), 32)             .store_uint(query_id, 64)             .store_coins(jetton_amount)             .store_slice(from_address)             .store_slice(either_forward_payload)             .end_cell();          var msg = begin_cell()             .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract             .store_slice(owner_address)             .store_coins(forward_ton_amount)             .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)             .store_ref(msg_body); But on the router contract side, the following code is used:  (int jetton_amount, slice from_user) = (in_msg_body~load_coins(), in_msg_body~load_msg_addr());         ;; Message body in reference?         cell ref_cs = in_msg_body~load_ref();         slice ref_ds = ref_cs.begin_parse();                  throw_unless(INVALID_AMOUNT, jetton_amount > 0);                  (int transferred_op, slice token_wallet1) = (ref_ds~load_uint(32), ref_ds~load_msg_addr()); To load the reference, we need to use ~load_ref(). However, we load int jetton_amount and slice from_user directly from msg_body, although on the token side it is stored like this: .store_ref(msg_body).  Can someone explain why this works correctly? Thanks in advance!

Ankit j: Same question I have.. (reply to 87346)

Ankit j: Considering the scenario, at a time, Large number of users accessing the application..How projects like Tapswap are storing the number of coins in db ? Is it by Json file or Cloud database or local database (PostSql)..?

Louis: Exit code 73

User<5912793884>: check bro (reply to 87327)

User<5912793884>: everyone know where i can deploy token ? i want try other. mostly i use minter jetton and dyor i want try other which can add function or etc thanks before

Snow: I have a chess and card game that I want to cooperate with ton. Is this kind of game allowed to go online?

Pegu: is there a node library to handle jetton decimals?

d1ce: hey guys, is there any quick resources about how to build in TON? im coming from evm dev

&rey: Quick — unfortunately, I doubt. TON has a few concepts like contract isolation (sharding) and messages carrying TON, which need to be learned anew. (reply to 87389)

Nguyễn Linh: Hi, I want to make a Jetton transfer. I'm trying with tonweb lib, but there's an error, can anyone help? "TS2353: Object literal may only specify known properties, and jettonAmount does not exist in type TransferBodyParam"

&rey: TON does not restrict apps you build with it, as it's The Open Network. Telegram might, so you should mind the distinction. (reply to 87378)

&rey: Your IDE should help you; I believe tokenAmount should be used instead of jettonAmount. (reply to 87396)

Nguyễn Linh: Yess, I see the tokenAmount instead of jettonAmount as in the example. But when I use tokenAmount and send the transfer, it shows that I sent 0 jetton on Explorer. (reply to 87398)

Nguyễn Linh: Can you take a look in this transaction: 1de7244832c4f39eaf3800c147e6628da66403dde71f5610c44af09615f0096f

&rey: Oh, I see. You need to bypass type-checking as annotated types are incorrect there. (reply to 87400)

Nguyễn Linh: So the param should still name "jettonAmount"? (reply to 87402)

Nguyễn Linh: quite tricky here 😅

Peng: ton  | [ 2][t 1][2024-07-23 08:18:27.733678407][full-node-shard.cpp:507][!manager]      getnextkey: [Error : 651 : not inited] anyone manage to fix this? i need some help

Nerses: I have encountered an issue that I can't solve.Thanks for help beforehand. Suppose I have a smart contract that receives different jettons. For every jetton, it has a jetton wallet contract. How can I send a transfer message from the smart contract to the jetton wallet contract to send jettons to another receiver?

Sunil | Aerius Labs: Is it possible to write upgradeable contracts in tact for TON ?

zeligmann: Hello. How to send tokens correctly via @tonconnect/ui? I follow the documentation, but it gives me a “commission calculation error”. const body = beginCell()       .storeUint(0xf8a7ea5, 32)                 // jetton transfer op code       .storeUint(0, 64)                         // query_id:uint64       .storeCoins(Number(asset.userBalanceRaw))                      // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)       .storeAddress(Address.parse(Receivers))  // destination:MsgAddress       .storeAddress(Address.parse(Current_Address)) // response destination       .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell)       .storeCoins(toNano('0.05'))                 // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message       .storeUint(0,1)                           // forward_payload:(Either Cell ^Cell)       .endCell();     await tonConnectUI.sendTransaction({       validUntil: Math.floor(Date.now() / 1000) + 360,       messages: [         {           address: Address.parse(asset.address), // sender jetton wallet           amount: toNano(0.05).toString(), // for commission fees, excess will be returned           payload: body.toBoc().toString("base64")          }       ]     });

Coconut: I am using @tonconnect/ui-react but when i click on the connect button the popup doesen t open, why?

Maede: hi, i deployed my contracr in testnet, in the tonviewer can show metadata but in the tonscan can not load name and data. why?  https://testnet.tonviewer.com/EQBe_v6d8gnqFFa3QePWRe_u2D7nfjCC9cGVdhSgSw1JKKG0

Louis: How to update the modified code on the chain

Sammy: Hello everyone! I need Developer for my tapping game project: @TapMBoys_Bot   Please contact me if you experienced in this sphere and you are creative.  Dm: @cSiriusX

Blockchain: Hi, guys. How can I get jetton balance on contract with FUNC?

Nerses: In Jetton TokenTransfer message should queryId be message op-code ?  https://docs.ton.org/develop/dapps/asset-processing/jettons#retrieving-jetton-wallet-addresses-for-a-given-user:~:text=Allows%20applications%20to%20link%20three%20messaging%20types%20Transfer%2C%20Transfer%20notification%20and%20Excesses%20to%20each%20other.%20For%20this%20process%20to%20be%20carried%20out%20correctly%20it%20is%20recommended%20to%20always%20use%20a%20unique%20query%20id.

&rey: You can't. (reply to 87443)

Bode: I had a problem with a deposit and I've been trying to talk to wallet ton support for 3 days now and no one answers me, I don't know what else to do

User<7248359571>: You want?? (reply to 87446)

Nerses: I just understand from the highlighted text that it should be op_code,but the essence of query_id is still unclear for me (reply to 87449)

&rey: Unfortunately nothing. (Please remember that when problems are in custodial services no one can overrule them because services are the key and DB holders.) (reply to 87448)

&rey: query_id is arbitrary number up to 2^64-1, it can be used in indexers for optimization. (reply to 87450)

Nerses: repeated queryId can concern any problems ? (reply to 87452)

&rey: Nope. No one can rely on them anyway because other client may choose same query ID as you. (reply to 87453)

Bode: I need ton to transfer my funds back to my wallet, bybit returned it to ton's wallet

&rey: Yes, that's a common situation and still has no solution to my knowledge. You might try pushing on all links — Telegram Wallet (not ton's wallet!), ByBit, your choice of wallet, etc. (reply to 87455)

User<7248359571>: I don’t understand

&rey: You can't forward 0.05 TON out of 0.05 TON given for transfer processing, since there are nonzero fees. If you want a simple transfer, set .storeCoins(0) for forward_ton_amount. (reply to 87421)

Nerses: let slc: Slice = beginCell().storeInt(num,62).endCell().asSlice()  where num  is 256 bit integer. What will be stored in slc  first 62 bits of num  ?

&rey: If num doesn't fit into 62 bits then there will be error, indicating overflow. (reply to 87459)

Nerses: is there way to store just 62bits ? (reply to 87463)

&rey: Yes. Is num signed, actually, or always 0/positive?

Nerses: it is unsigned,actully i will asign its value now() (reply to 87465)

&rey: now() will return value that would overflow 62 bits approximately never, so you can use .storeUint(now(), 62) freely.  Even .storeUint(now(), 48) would be OK. (reply to 87467)

Nerses: i checked fun now(): Int   as Int is 257 bit but error will not be occured as basically after 48 bit are only zeroes and they will be ignored ? (reply to 87468)

zeligmann: I did this, but nothing changed. (reply to 87458)

Northman: 👀

Prince: If contract sends jetton to users, we should transfer jetton to contract like Ethereum? (reply to 87447)

&rey: Yes. Contract cannot control jettons of others, even yours. (reply to 87474)

Prince: then what is the way?

Prince: should contract just mint its own jetton?

&rey: Admin should transfer jettons to contract. (With previous message I meant they cannot be pulled.)

Prince: when Admin transfer jetton to contract, he should send the amount of jetton too?

&rey: Yes. And some TON should be forwarded if contract needs to process deposit onchain (contract will receive those TON from its own jetton wallet). (reply to 87482)

Prince: and I heard cell just store 1023bit so when I want to store large amount of address : amount dict how can I implement that?

Nerses: how can i get 64 bits from 257 bit integer ?

&rey: Do you need to store address=>amount dict in a single contract at all? (reply to 87485)

Prince: maybe. is there other better way?

&rey: Jettons store amount in a separate contract for each users. That makes storage fees straightforward. (reply to 87488)

Kenny$$Shillz: Create a seperate contract for each address (reply to 87488)

Prince: can you explain more detail? or any source I can see?

Kenny$$Shillz: So like @pcrafter says each user has a separate contract that holds their Jetton balance and each user transfers Jettons by sending a message to their Jetton wallet (reply to 87491)

Prince: it makes sense

Prince: anyway, no opensource?

&rey: Quite a lot of it. https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc. (reply to 87494)

Tony: Hello, I want to make a typescript script that tracks all transactions on the blockchain and filters jetton swaps. The goal is to track token prices. What library and api would you recommend for me to use? I'm having trouble figuring out how to use the toncenter api for this purpose. I also found ton console which has a /rates endpoint that gives the current token price but that won't work for me as it could miss some price spikes.  They also have a streaming api which can give me the transactions of jetton swaps but I don't know how to extract the token price from the transaction.  I'm not looking for dev work just some guidance on what to use but I'm willing to pay for any meaningful information, thank you!

&rey: Though I don't understand how you got to the question "store address=>amount dict" AFTER asking how to interact with jettons.

&rey: Tonapi traces, IIRC, return user's change in TON and jetton balance. (reply to 87497)

Prince: I want presale logic... as I told you

Prince: but I am beginner so there are many things to study and it takes so much time

&rey: Any chance you could use existing technology?

Tony: as far as I can see I can only get a trace by account or trace id. I wouldn't know what to query. I need to track all blockchain activity real time. For now the streaming api of tonapi looks ok but I don't understand how to extract the price from transaction id. With their transaction endpoint I only get the TON value and not the jetton value so I can't calculate price.   Although if someone knows a solution that won't rely on a third party api that would be best. (reply to 87499)

Akachi: Hi, how can I get ton test coin to my wallet?

Prince: maybe it's similar to ICO on github (reply to 87502)

Umar 1000 🍅: I’m here (reply to 87506)

Presidente: /rates

Денис: Greetings to all. Please tell me, is it possible to send a message to the contract in one transaction, when receiving this message, the contract will deposit the children contract, and in the same transaction immediately send a message to the children contract to set the desired state? Init children is not an option to pass state

Buggy: @testgiver_ton_bot (reply to 87506)

Buggy: If you need 1k dm me (reply to 87506)

Nerses: @testgiver_ton_bot (reply to 87506)

T Rekt: can anyone point me to article or website on how to detect if a token is honeypot

Nerses: if in TokenTransfer  forward_ton_amount  should be > 0 in case forward_payload is filled with message, how much TON should I assign to forward_ton_amount  to process correctly and what will be done with remaining amount ?

Огурчік: This is example of code to create wallet:   Python from pytoniq_tools.wallet import WalletV4R2  def main() -> None:     wallet, public_key, private_key, mnemonic = WalletV4R2.create()      print("Wallet created!")     print(f"Address: {wallet.address.to_str()}\nMnemonic: {mnemonic}\n")  if __name__ == "__main__":     main()    how i can create Deterministic wallet? i would like to have one mnemonic, with a lot of wallets

Nerses: if i have smart contract which recives Jetton(actually its Jetton wallet contract receives ) how I can store in smart contract how many Jettons the contract receieved with certain message ? can ctx.value be used in this case ?

Kenny$$Shillz: Have u tried gecko terminal? (reply to 87497)

Kenny$$Shillz: It's complex to explain tbh but it's doable (reply to 87504)

Tony: the problem with using api for token price is that I may have 100k tokens in the future and its unpractical to keep pinging for tokens that are dead and have to transactions. That's why I want either some streaming or manual blockchain parsing (reply to 87545)

Kenny$$Shillz: Depends on the cost of the process u are undertaking (reply to 87529)

Nerses: and what will be done with remaing amount ? (reply to 87549)

Kenny$$Shillz: It can be retained or returned to message sender depending on send mode (reply to 87550)

Kenny$$Shillz: U can get token price from the exchange using the exchange's sdk (reply to 87548)

Tony: But I would still need to query for all tokens in my db? Which is impractical. I need to receive a stream of data and update only whats needed

Kenny$$Shillz: You can subscribe to block notifications using tonapi, query the transactions in each notification and filter them for swaps (reply to 87554)

Nerses: in this code         send(SendParameters{                 to: calculateUserJettonWalletAddress(myAddress().asSlice(),(self.commits.get(msg.data.commitId)!!).jettonMasterAddress,(self.commits.get(msg.data.commitId)!!).jettonWalletCode.asCell()).loadAddress(),                 value: ctx.value/2,                 bounce: true,                 mode: 0,                 body: TokenTransfer {                                     queryId: queryIndex,                                     amount: (self.commits.get(msg.data.commitId)!!).amount,                                     destination: (self.commits.get(msg.data.commitId)!!).sender,                                     response_destination: myAddress(),                                     custom_payload: null,                                     forward_ton_amount: ctx.value/2,                                     forward_payload: "Token Uncommitted".asSlice(),                                  }.toCell(),             }         );    here i have 3 values one is field value ,second one is amount  and 3rd is response_destination s what will be done what each field and what will be returned ? (reply to 87551)

Tony: yep, I mentioned that. I can even subscribe to swaps specifically -> https://docs.tonconsole.com/tonapi/streaming-api#real-time-notifications-about-finalized-transactions  the problem is when I get the transaction id, how do I extract the token price from it? DeDust seems to not have the jetton amount in its inMsg data while StonFi only has minAmount which is good enough I guess (reply to 87555)

Tony: another thing that I see is that this stream also gives failed transactions and I don't see how to check which ones are failed and which not

&rey: Change subwallet ID. Btw, have you learned about wallet version differences, or chosen v4r2 arbitrarily instead? (reply to 87541)

Kenny$$Shillz: I'm not sure I get u but if u look in the stonfi payment from pool message you will be able to see how much was received from the swap .. hope this helps (reply to 87558)

Tony: how can I see the sonfi payment from pool message? which endpoint is this?

Kenny$$Shillz: U filter for the stonfi payment from pool op code instead of the stonfi swap opcode (reply to 87561)

Tony: You mean StonFiPaymentRequest?  Hmm, yeah I see that there is "value": {          "amount0_out": "2948823355752",           "token0_address": "0:27d1f23d42624f723f42abaf1d23efc2e63a5ec7b0e12e54bb026bbe10d42630",           "amount1_out": "0",           "token1_address": "0:1150b518b2626ad51899f98887f8824b70065456455f7fe2813f012699a4061f"         }  but for some reason one of the token amounts is always 0 , although if you check the transaction itself it is a swap. for example this one - d53d80dc1b9872a5091c4cc8fe58f5be232c934513276eac7d5a18a96471d783 (reply to 87562)

Nerses: having only jetton master address can i get init code and init data of that jetton off chain ?

&rey: "out" in English stands for "outgoing" — result of swap — jettons which are sent to user. (reply to 87564)

Tony: Yes, I get that. But the how would I extract the token price from this as I have only the jetton amount and not the TON amount? if I had amount1_in then it would be possible

Nerses: is there any reference ? (reply to 87567)

Kenny$$Shillz: No stonfi payment from pool I think (reply to 87564)

Tony: Also what is the difference between StonfiPaymentRequest and StonfiSwap? Shouldn't the swap be what contains the swap info?

Tony: I think you are confusing it with DedustPayoutFromPool? I don't see such in the list of ops - https://github.com/tonkeeper/tongo/blob/master/abi/messages.md (reply to 87572)

Kenny$$Shillz: You are correct (reply to 87574)

Tony: But DedustPayoutFromPool also seems to contain only jetton amoutn and not TON amount so I can't calculate token price from that either

Tony: Not jetton amount but rather whatevers being payout to user. jetton on buy and TON on sell

Kenny$$Shillz: The ton amount should be contained in the inmsg (reply to 87576)

Tony: i don't see it. For example transaction swapping 1709.9 USDT for 248.23 TON - 45871821f7d4375ad9c5353e1ec4b30584a9a85fd2598da59188e58f487672ed  decoded_body is:  "decoded_body": {      "query_id": 18012948399220787000,       "proof": "b5ee9c72010101010047000089800be0ac9f6bec08f07b6ae0639c39ecd1511a9a9adb4dbc9b6445697241adfb000040100b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe8",       "amount": "1709903440",       "recipient_addr": "0:61ce7a48ecc27b37c2cf8d7ff7b33551e2b05e0adbb0215bdb2a81c84c9d026c",       "payload": null     }

Tony: only the usdt amount is there and I'm not even sure how to tell which token is it only by this data

Tony: Actually this payout seems to not be related to a swap event at all, looking at the transaction tree. It's something related to burn

Tony: So I guess I can't use payout anyway as I need swap data

Tony: shouldn't tracking jetton swaps be something simple 😅 I've done it on evm chains and solana

Огурчік: as i understand, 4 gen of wallet supports also subwallet? (reply to 87559)

T Rekt: anyone? (reply to 87526)

Tony: I will pay $200 just for info on what to use for this task. It doesn't need to be tonapi it could also be toncenter v3/v4, whatever. Just something that can do real time streaming and parsing of jetton swaps and calculating their price. (reply to 87584)

&rey: Do you have transaction ID in objects you get from streaming API? (reply to 87561)

&rey: If so, you can query traces with the transaction hash+lt. Probably.

Stephan: Hello guys. how to send tokens from a smart contract on a clock in addition to wallets?

yarik: Does anyone know if its possible to transfer all NFT's in one transaction via smart contract? How would this be done? Is there a limit?

&rey: Technically no, because each NFT is a separate contract and is thus updated by its own transaction, but you've probably asked another thing. (reply to 87604)

&rey: Actually, transfer from where?

yarik: From one wallet to another

&rey: Then there isn't a need to use any intermediate smart contract. (reply to 87610)

yarik: Could you elaborate? (reply to 87611)

yarik: As far as Im aware you cannot pass multiple transactions into the sendTransaction method in the ton sdk

&rey: You can, up to four for common wallets. (reply to 87614)

&rey: There's a list, after all.

yarik: Really? I didnt know that (reply to 87616)

yarik: I wish the ton docs communicated that better, thank you

Liho: why we need to pass these 2 values, are these value gas fee or storage fee?

Liho: ton asset sdk sendMint

Kiran: Hey guys, My developer has access to the firebase data  of our telegram mini app game on his personal account. We want to transfer this all to mine as we are nearing completion and i am the rightful owner. The app works fine. Its saving the scores. Although we've disconneted from his account. We are unable to view on our firebase account. And dont know where all the scores are saving. Anyone know how we can overcome this?

Hiroto: I can help you dm me (reply to 87631)

Lucky: any idea of how to withdraw jetton send to the contract? maybe in tact language  I'm building a contract that accept jettons, and then forward the jetton to another address. is that possible?

Akachi: How can I connect my chrome extension TON wallet to the TON testnet?

Piyush: Hello everyone  Can anyone tell me how we can deploy a ton wallet contract on blockchain using testnet

Frosiva: the first link doesn't work (reply to 44294)

Ata | PsyFi | SDX (DeFi Options): Gm guys

Danya: Hey! Does anyone encounter any problem with tonconnect-ui sdk recently??

Огурчік: https://answers.ton.org/question/1490342895759134720/does-ton-blockchain-support-hd-wallets  can anyone explain, does TON blockchain support HD wallets? where i can find documentation about this?

H: I went through the stepik tutorial chapter 5.1 to 5.3   To be able see the data that store in contract on react project, but I get this error

H: sorry , solved 😅, i change import { Address, OpenedContract } from "@ton/core"; to import { Address, OpenedContract } from "ton-core"; 😅 (reply to 87670)

Coconut: why I get this error: Tact compilation failed Error: Invalid address hash length: 0

kevin: I have a solution much simper,  DM pls (reply to 87589)

Ahmed: hello everyone, how can i make a swap on dedust using javascript

Ahmed: I checked the documentation

Ahmed: but Im not sure of what is the sender variable

Akachi: In the doc, the wallet in TON is smart contract and we need to deploy it, then what is the wallet with extension browser?

Pibu: hey guys, I'm working on a protocol and I must be able to operate on third party jettons... I am searching for a way to wrap jettons, for example sending usdt to my contract which will then wrap that usdt into it's managed wrapped jetton implementation... but I fail to grasp the necessary flow. I come from solidity and been studying ton for the last couple hours so please be patient 😅

Ян: Hello, unfortunately couple hours doesn’t enough :( (reply to 87686)

User<6839885291>: I need help with mini app dev real quick can someone help pls

Thea: Chat me (reply to 87688)

Pibu: Ha! I know! I still mix up wallet contract with jetton wallet, and then there's jetton master contract :D But I'll get there eventually :) (reply to 87687)

Almatbek: What's the matter? (reply to 87688)

— 2024-07-24 —

User<5912793884>: how to learn creating token with have function whitelist and etc ?

c: tg上怎么调试？ 我只看到 WebApp.showAlert(initDataParsed.user.username); 有没有console.log("Login info sent:", data);这样的方法去调用，或者打断点调试

BlockchainDev: Slide to my inbox thanks (reply to 87440)

B77faw: Hey,I wanna execute my contract step by step

B77faw: Is there are some way that I can do it?

Nightfall: do you mean it will manage the reference automatically? (reply to 87151)

Nightfall: I tested a dict with address as key, added over thousand records and I don't think it has a limit

jojo: What is the capacity of the dictionary  in func？

B77faw: scam!!!!!

Nightfall: Found it  https://docs.ton.org/develop/func/dictionaries  The binary tree for N key-value pairs contains N-1 forks, and thus at least 2N-1 cells in total. Smart contract storage is limited to 65536 unique cells, so maximum number of entries in dictionary is 32768 or slightly more if there are repeated cells.

jojo: thanks

Vetch: What alogrithm is used to generate signature when sending payment on TON? I can't find releated page in the docs?

Louis: Who were called by A and B respectively

Louis: A has received an excess message, so they probably won't call other contracts anymore, right

Tango RFP: Hey fam,   I'm now broker for a decentralised launchpad on TON, looking to meet awesomes devs with tremendous projects.  We will have the first LBP on The Open Network, that's very relevant to launch a token with a reduced budget.   Fair, compliant, decentralised, we want to participate to boostrap The Open Network ecosystem!   Let's chat !

Tiago: Hello guys, we are looking for employees for a cryptocurrency NFT project:  Beta Tester ($200/week) - no experience required Moderator ($300/week) Community Manager ($500/week) NFT artist (negotiable) Developer (negotiable)  If you're interested, DM!

Hiroto: dm me (reply to 87757)

Chi: async function transferJetton() {     const body = beginCell()       .storeUint(0xf8a7ea5, 32) // jetton transfer op code       .storeUint(1, 64) // query_id:uint64       .storeCoins(1_000_000_000) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)       .storeAddress(         Address.parse("0QDWCPJ0wirZzhjdwFsYXljrRWpYS2drY7AJpgkxfNf5vxIA")       ) // destination:MsgAddress       .storeAddress(         Address.parse("0QBmzLAL3h2i78tu72Lt5pc0KxecwVOgpvLu8R-ySb0C4dBf")       ) // response_destination:MsgAddress       .storeUint(0, 1) // custom_payload:(Maybe ^Cell)       .storeCoins(toNano(0.05)) // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message       .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)       .endCell();      const tx = {       validUntil: Math.floor(Date.now() / 1000) + 360,       messages: [         {           address: Address.parse(             "UQBmzLAL3h2i78tu72Lt5pc0KxecwVOgpvLu8R-ySb0C4WvV"           ).toString(),           // sender jetton wallet           amount: "2000000",           payload: body.toBoc().toString("base64"), // payload with jetton transfer body         },       ],     };      await tonConnectUI.sendTransaction(tx);   }   Hello guys, I'm building a jetton transfer function now, but the transaction is always failed after sent

Chi: I think the problem is storeAddress, the parameter to be passed into the storeAddress should be from the jetton wallet address, right?

Chi: I just follow this official guide https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer

User<7050217887>: Scammer (reply to 87758)

User<7050217887>: They ask for an invoice with a balance

Linh: /i don't see it. For example transaction swapping 1709.9 USDT for 248.23 TON - 45871821f7d4375ad9c5353e1ec4b30584a9a85fd2598da59188e58f487672ed  decoded_body is:  "decoded_body": {      "query_id": 18012948399220787000,       "proof": "b5ee9c72010101010047000089800be0ac9f6bec08f07b6ae0639c39ecd1511a9a9adb4dbc9b6445697241adfb000040100b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe8",       "amount": "1709903440",       "recipient_addr": "0:61ce7a48ecc27b37c2cf8d7ff7b33551e2b05e0adbb0215bdb2a81c84c9d026c",       "payload": null     }

Chi: solved (reply to 87760)

[+_-]: Hello everyone! Just want to clarify a take - I don't see significant differences between using set_data with a canonical persistent contract storage and using global variables as an alternative. However, using global variables in the code looks cleaner and more appealing to me personally.  Does anyone have thoughts on this matter? Is there something about the first approach that requires using the contract's persistent storage only in "save_data() and load_data()" format?

Arash: hi mate, can you help me, I had the same problem and still could not do it ok (reply to 87769)

Chi: sure (reply to 87783)

0xbera: Can someone maybe provide an example of a state-init message for a V3 highload wallet? I am trying to put one together and failing ..

tony: Hello everyone! We are a team dedicated to building the TON ecosystem. We have developed several AI bots to assist with development. Currently, we have three bots: a bot to help with the issuance of Jetton tokens, a bot to assist in writing Tact, and a TON documentation assistant bot. We welcome everyone to give them a try!

&rey: You're attempting to forward 0.05 TON out of 0.002 you send for transfer processing; that won't work. (reply to 87760)

Chi: Yes, I resolved it by incresing amount (reply to 87791)

&rey: It isn't fixed on the blockchain level. Existing wallets use Ed25519. (reply to 87740)

&rey: Contract may store up to 65536 unique cells; a dictionary uses two per key-value pair, so less than 33k records. @ninefall you also asked this. (reply to 87721)

&rey: verifier.ton.org; requires 0.5 TON to oracles that would compile it and save its source code onchain permanently. (reply to 87797)

lw: 20 - 3

Nikita: Hi all, does anyone know if there is any information about how much more suboptimal it is to use Tact? Or is there not much difference with FunC?

&rey: TON? docs.ton.org. For other sources, see pinned message. (reply to 87804)

Radek: hey guys, is it possible to access user contacts from TON mini app or bot?

Paul: Hi, any solutions for a aggregators on dexs in TON?

Eugene: https://ton.diamonds/dex/swap (reply to 87814)

Dave: Trying to launch a private liteserver,  is this normal and ill have to wait or?   Local validator out of sync: n/a

NPA120: yes, absolutely possible (reply to 87811)

d1ce: hey, is 1 address is backed by 1 seed phrase? I cant make a new address/ new account in TONkeeper wallet. create new account is forcing me to store the new seed phrase

Yeskendir: hi, could someone help me, im trying transfer NOT , but txs failed (Unable to complete the operation)

Yeskendir: or do someone has ready solutions? )

Radek: would you please help me finding anything about this topic? i cant find any documentation or anything on this 🙁 (reply to 87820)

NPA120: DM me (reply to 87827)

L (😇,🪽): hi is there a way to contact telegram's support? i have a group that im the owner but can't add any bot . and no i don't have any bot that restrict adding other bot (reply to 87806)

&rey: I don't know, Telegram interaction is off topic for this chat. (reply to 87829)

L (😇,🪽): k (reply to 87832)

&rey: You can use any method of deriving keypair from seed, including HD if you find HD lib compatible with Ed25519. Although, common method is changing subwallet ID. (reply to 87667)

0xbera: Question re. highload wallets: is the balance of the contract address separate from the wallet address? after the wallet_highload_v3r1 contract deployment I see a balance for the contract address but none for the wallet address

&rey: Each smart contract has different balance. (reply to 87837)

Огурчік: I would like to use subwallet_id, but i could not find even minimal example, i triyed to set wallet_id while creation wallet using tonsdk, but its generate wallets with same name, and i dont know how i can do that  for example, i read source of pytoniq lib, and i found there parameter wallet_id, but it is not works, also i tried to use pytoniq_tools, but there you can not wallet id, but you can make ordinary wallets using this code:    Python from pytoniq_tools.wallet import WalletV4R2  def main() -> None:     wallet, public_key, private_key, mnemonic = WalletV4R2.create()      print("Wallet created!")     print(f"Address: {wallet.address.to_str()}\nMnemonic: {mnemonic}\n")  if __name__ == "__main__":     main()   it is really tough to understand it for me ... (reply to 87835)

User<6242359642>: Hello, sorry i dont really know where to ask, Telegram is flooded with noob who are there only for tap to earn — feel free to deleted if its off topics   Im looking for the real group with real TON enthusiasts to talks about TON proxy, TON torrents, TON storages, TON sites, web3, cNFT technology, DNS t.me and .ton, Utilities like TONNEL, JVAULT, etc   Not about f*cking dumb tap/poop/sleep-to-earn that only interested poor and opportunistics peoples for $10  Does this group exist?

&rey: This group is generally intended to talk about all of these technologies. Though it might be better to tone down talk a bit so that others can engage.. (reply to 87840)

d1ce: I’d notice there is different prefix in TON wallet eco, there’re wallet address that starts with EQ, OQ, and UQ? what is the difference between these?

Peng: can someone tell me where do i request the username and password to download dumps

Nightfall: thanks, one small question:  what would happen if you use flag 0x10 (first 6 byte in message body, that is represented as non-bounceable), but in send_raw_msg also use mode 16 (bounceable), and the action is failed at the other end? will it bounce back to the sender? (reply to 87794)

&rey: It has another meaning, "bounce CURRENT transaction if message does not get sent". (reply to 87848)

&rey: Though I don't know what happens if contract receives message with flag 0x10 and fails action phase.

Gary: Why delete it?

Nightfall: ah, I got it now, this is quite confusing lol (reply to 87851)

Nightfall: 0x10 is nonbounceable so I think nothing would happen (sender does not get notify) (reply to 87854)

User<6242359642>: Yes, thats why im here, but it’s particularly orienting for developers, I wouldn’t like to disturb this group with long texts talking about my convictions and speculations about web3 etc 🥲 (reply to 87842)

&rey: Because it fits criteria for offtopic. @tonhunt may be better for that. (reply to 87855)

0xbera: I have deployed a V3 highload wallet contract; github.com/xssnick/tonutils-go claims the address of the wallet is UQBSstzJAAuVX7UFHKiPcebfUzzZKCYLsWvpXhpwdkP3Hb0N.  However, tonviewer shows the address as. EQBSstzJAAuVX7UFHKiPcebfUzzZKCYLsWvpXhpwdkP3HeDI  One starts with U - the other with E  what is the difference?

&rey: There isn't much difference, except that tonutils-go claims (UQ) that someone sending TON to the wallet shouldn't request bounce. (reply to 87860)

Nightfall: bro, I have a function to send jettons to 4 different wallets, is there any option to get the tx revert (and reclaim the sent jettons) when a single one fails? (reply to 87854)

Nightfall: I dont think sending jettons is recoverable, right?

&rey: It is impossible. (reply to 87862)

Nightfall: thank you, tvm is so different lol (reply to 87864)

0xbera: I see -- thank you! (reply to 87861)

Gary: Thank you🙏🏻 (reply to 87859)

0xbera: how about the last 3 characters in the addresses ? They differ as well? Any idea why that might be the case? (reply to 87861)

&rey: Last characters are checksum. (reply to 87874)

0xbera: Ah .. interesting .. thank you (reply to 87875)

0xbera: after flipping the bounce bit, the address stays the same: EQBSstzJAAuVX7UFHKiPcebfUzzZKCYLsWvpXhpwdkP3HeDI  is this a bug maybe? (reply to 87875)

0xbera: ah, wait -- I need to check one more thing 😛

I'm: Hi everyone, the picture is receiver jetton_wallet, every time I send token, the Ton balance will increase 0.01. when I transfer token to receiver. The fee deduct in my Ton wallet and added to their jetton_wallet . How to avoid send additonal Ton to them? Thank you so much.

Derek: Hello everyone, is it possible to bid on an expired domain?

Ma><im: int slice_hash(slices) as "HASH SU";  hello everyone! what is the equivalent of this function in TypeScript?

Ma><im: I can't find it, it's the hash from the cell, it's not just sha256

Paul: in transfer token structure payload, have "response_destination". put your sender address as value. It will send remaining ton value to this address. (reply to 87881)

Kashish: I have deployed one contract on testnet I want to integrate it with frontend tell me is it mandatory to verify that contract?

NPA120: No (reply to 87895)

csyr: i want to get telegram passport file from user passport authorization. but i did not receive bot message .  do guys meet this issue before?

0xbera: I believe I have found a bug, https://github.com/xssnick/tonutils-go/issues/219 (reply to 87861)

User<6908616126>: Hi to everyone! tell me what is it "tonapi_brige_key" and where to get it

Diana: Hi! Did someone try send jetton transaction through tonconnect? I don't understand how to get jettonWalletContract

&rey: TON Cookbook has entire two sections devoted to that. (reply to 87904)

Snow Lee: JettonWalletContract is the contractAddress of the jetton itself (reply to 87904)

Snow Lee: You can find a jetton and get its master address

Snow Lee: Can do it straight on tonviewer too, and paste that address in place of the jettonWalletContract

Diana: is means one for all users? (reply to 87907)

Snow Lee: Yes, it's the jetton contract address, not the address holding your jetton, different things (reply to 87913)

Diana: thank you so much! (reply to 87914)

Snow Lee: You're welcome (reply to 87915)

Anton: Hello do you know how to get sender, receiver address from transaction after tonClient.getTransactions() method? Actually it isn't clear for me)

Diana: Also I confused what is the difference between these two addresses? and should it be in friendly or raw format?

Gerald: Hi everyone,  I need to implement a functionality for purchasing Jettons on a web page through ton-connector. This means performing a transaction where a certain amount of USDT is transferred from the user's wallet to ours, and in return, they receive a certain number of Jetton tokens. Could you please let me know if this is possible and, if so, provide a roadmap on how to achieve it?  Thank you very much!

User<7369227251>: hi, i can help you what is your issue? (reply to 87688)

User<7369227251>: hi, i can help you plz check your dm (reply to 87631)

Alfred: Of course. Create a receiver to receive the Jetton Transfer Notification of your contract's wallet and send the jetton from your contract to the user would be enough. (reply to 87923)

Alfred: Message flow: user's USDT jetton wallet -> contract's USDT jetton wallet -> contract -> contract NEW jetton wallet -> user's NEW jetton wallet.

User<7369227251>: using FunC? (reply to 85958)

Nerses: nope.i needed it off chain in type script (reply to 87928)

Hiroto: it is possible, dm me (reply to 87923)

Itach: Hello, I can help you (reply to 87923)

User<7369227251>: do you need code? (reply to 87923)

Gerald: it would be great (reply to 87935)

Ashees: Can anyone tell me how to initialize a dynamic array in FunC?

&rey: Is it up to 255 entries? Then you need to use tuple. (reply to 87939)

Warren: please I need someone to assist me further

Raf: Hi I've been adding many things in my repo. My last issue is comparing sender_address with a slice that is hardcoded (I want to restrain the address that can execute actions). Has someone done something like that somewhere ??

Raf: It seems that `sender_address`is sort of a special slice, that cannot never equals a regular slice, can someone help me with this ?  ~dump(sender_address); // s0 = CS{Cell{00b968010cf5ad0c22c7f07c351e92bdeb4706b4a6f5b9873900377243dd9aaaeda30d95002376fbc2fa0204898b96132939c5781a1850aec8e1bb7cbc527d3f7e5e874e07100bebc2000608235a0000000000d59f82cd41f8500000000540} bits: 4..271; refs: 0..0} ~dump(ctx_address1.begin_parse()); // s0 = CS{Cell{006045514347657461474557503450687150535637316f344e61553372637735794147376b683773315664744747796e5441} bits: 0..384; refs: 0..0}

&rey: Almost everyone does, using "SDEQ" opcode. In fact, data-same slices can be taken from different cell+offsets so they are printed differently. (reply to 87949)

Ashees: I wanted to know, is there any way in which we can read the values from other contracts in FunC?

&rey: Please stop spamming random messages, otherwise you will be banned. (reply to 87959)

Warren: yes there's a way

Raf: it does not work, slices are never the same (reply to 87952)

&rey: Btw, latter slice is not an address. (reply to 87951)

Warren: how do you run it?

Raf: ok so how am i supposed to store an address in a smart contract, and check later that sender_address matches this address ? (reply to 87963)

Raf: git clone git@github.com:fabcotech/ton-func-contracts.git npm i npm run test tests/PingPong2.spec.ts

&rey: (mind ~10s timeout between messages) (reply to 87965)

&rey: "EQC...TA" is not an address. "EQC...TA"a is. (reply to 87965)

Raf: ok I'm beginning to understand, So I guess the following (from contract wrapper) is not a good way of storing an address :  beginCell()     .storeRef(beginCell().storeStringTail('ping').endCell())     .storeRef(       beginCell()         .storeStringTail('EQCGetaGEWP4PhqPSV71o4NaU3rcw5yAG7kh7s1VdtGGynTA')         .endCell()     )     .endCell();  how should I do ?

&rey: .storeAddress(Address.parse('EQCGetaGEWP4PhqPSV71o4NaU3rcw5yAG7kh7s1VdtGGynTA')) would be correct. (reply to 87972)

&rey: Though most examples from that repository don't show much understanding of TVM or programming.

Razak: It 's possible, send me DM. (reply to 87923)

Aonr: /stat@combot

Ajay:  const { TonClient, WalletContractV4, internal, Address, beginCell, toNano } = require("ton"); const { mnemonicToPrivateKey } = require("ton-crypto"); const { getHttpEndpoint } = require("@orbs-network/ton-access");  async function sendJetton(fromWallet, toWallet, amount, jettonMasterAddress) {   try {     // Initialize TON Client     const client = new TonClient({       endpoint: await getHttpEndpoint({         network: "testnet",       }),     });      // Load sender's wallet     const mnemonic = "Your mnemonic";      const key = await mnemonicToPrivateKey(mnemonic.split(" "));     const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });      // Get the sender's jetton wallet address     const jettonWalletAddress = await getJettonWalletAddress(client, fromWallet, jettonMasterAddress);     console.log("Jetton Wallet Address:", jettonWalletAddress);      // Prepare the jetton transfer message     const transferBody = beginCell()       .storeUint(0xf8a7ea5, 32) // op code for jetton transfer       .storeUint(0, 64) // query id       .storeCoins(toNano(amount)) // amount       .storeAddress(Address.parse(toWallet))       .storeAddress(Address.parse(fromWallet)) // response destination       .storeBit(0) // custom payload       .storeCoins(toNano("0.01")) // forward amount       .storeBit(0) // forward payload       .endCell();      const transferMsg = internal({       to: Address.parse(jettonWalletAddress),       value: toNano("0.05"), // Attach some TON for fees       body: transferBody,     });      const contract = client.open(wallet);          // Sign and send the transaction     const seqno = await contract.getSeqno();     const transfer = await contract.createTransfer({       seqno,       messages: [transferMsg],       secretKey: key.secretKey,     });      await contract.send(transfer);      console.log("Jetton transfer initiated");   } catch (error) {     console.error("Error in sendJetton:", error);   } }  async function getJettonWalletAddress(client, ownerAddress, jettonMasterAddress) {   const result = await client.runMethod(     Address.parse(jettonMasterAddress),     "get_wallet_address",     [{       type: "slice",       cell: beginCell()         .storeAddress(Address.parse(ownerAddress))         .endCell(),     }]   );   return result.stack.readAddress().toString(); }  // Usage sendJetton(   "0QCKM7NhPW8y7Bg5wSpxMeEtkyaoxZUPXKZTYr2GnH_TgxgS", // From wallet address   "0QDTdoOcmN44KWTToHvfQzZYzZHP4n3k9R5rEaRGc5fFXWOM", // To wallet address   "0.00000001", // Amount in TON (will be converted to nano)   "kQBP7y6oYP94RIYLmTPT5NNIErpBKi_ST7jMIEz0d7FoxmnG" // Jetton master contract address );   hi, can any one help me  how to transfer jettons wallet A to wallet B  with this code

Raf: thanks a lot I think it's working (reply to 87973)

Ajay: transaction fail on chain

Ajay: Exit code 16059

Grigoriy: Hi, how do I get usdt on a testnet wallet?

Pibu: Can you send jettons to a smart contract? I need a locker that holds jettons for future use (like treasury)

User<6839885291>: anyone has a code that sends message to addys

I'm: Hi thank bro. Do you know how to estimate correctly the total fee? I use the code below but it is incorrect. I calculate it and its value is only = 0.00295 TON. I send 0.05 TON for the fee and got back 0.032 TON. It means the total fee is 0.018 TON. I set forwardAmount = 0 and no comment. (reply to 87892)

Razak: sure, please send me DM (reply to 87985)

Razak: I can help you, please  send me Dm (reply to 87688)

Hiroto: dm me (reply to 87688)

James: is this the appropriate chat to ask questions about running a validator node?

Dave: Stuck in the same problem since morning haha (reply to 87995)

James: what problem are you having?  maybe we can help each other 😄 (reply to 87997)

User<6422235070>: Hello everyone, using pytonconnect, when a user accepts a transaction in their wallet app, the connector.send_transaction(transaction) function often returns nothing (as if it just keeps hanging in await), although it should if the user accepted the transaction. Also, sometimes it does not throw the pytonconnect.exceptions.UserRejectsError error when the user rejects the transaction. Does anyone know what the problem could be? If you enable DEBUG info, you can see that some message arrives when the user accepts a transaction in the application, but the function does not return anything as before

Dave: Local validator out of sync n/a since morning and database still the same (reply to 88000)

User<6839885291>: https://testnet.tonviewer.com/transaction/f7833fec340821feb4c937025a97a2c0f80573ac7c7f7e8ca0795ad6ba0aac2a  anyone has a script that works like this?

James: I haven't even gotten that far.  Following the docs for a full install on the ton site, and mytonctrl status doesn't have the Validator block at all.  😐 (reply to 88003)

Dave: I'm trying to install a liteserver (reply to 88005)

Paul: It seem to hard to cal correct total fees. Now, best solutions is send extra amount and wait the smartcontract return it. Should set amount large than avg fees for make sure your transaction completed. (reply to 87987)

I'm: thank bro (reply to 88008)

pfeffunit: hey everyone! are people using tact for real? the documentation makes it sound like it's risky to use, given that it's still under development

! M.S: Hi there, I have question.  I want to develop simple games with mini apps. Can mini apps work as PWA so user can play games even if they offline?

James: does anyone know what ports I need to open for a ton validator node?

Paul: don;t send msg to jetton master. Send to jetton wallet of from wallet address. (reply to 87979)

Paul: sorry i wrong. Your message throw 16059 error. It's not standard error code of jetton sc. Is your custom token? (reply to 88020)

&rey: Please read chat description once again. (reply to 88030)

Alice: could you please share it with me? (reply to 88031)

Alice: is this such a question that can't be asked in this group?

&rey: "English-speaking TON Developers Chat." TON is not Telegram. (reply to 88032)

Alice: i see i though that's bot

Alice: no problem

Leo nut: Yo do u guys know how to open a TON wallet ?

&rey: Which of ones listed on ton.org/wallets? (reply to 88039)

Lassa: Hi all, I made transfer token by jetton wallet. I check my jetton address and see available the TON balance . How can I withdraw TON in my jetton wallet?

&rey: IIRC you can't do so in common jetton implementations. (reply to 88056)

Mr.travellerr: how to send transaction with notcoin in @tonconnect/ui module?

Mr.travellerr: Is there anyone know about this?

Mr.travellerr: can I send transaction with notcoin or USDT using tonconnect/ui module? I use tonkeeper wallet

&: goto docs.ton.org  and search tonconnect (reply to 88062)

Tanya: do you have a source code about that? (reply to 88065)

&: Did you tried to search? Maybe there's full code in official documentation. (reply to 88066)

&rey: https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment (reply to 88066)

Sumit: would ton ever allow querying other contracts’s state?

&rey: No, since any another contract can be in another shardchain — not available at current validator. (reply to 88070)

Crylion: Hi

User<7050217887>: Get to the point! (reply to 88075)

Crylion: Hello. I'm specialized in UI for webapps and smart contracts. Also I can build tg bots. Who needs?

&rey: Actually that wasn't related to TON development at all.

User<7050217887>: I agree completely (reply to 88094)

User<7050217887>: Why are you writing all this? (reply to 88104)

Tanya: who can give me the sample code about notcoin transaction in @tonconnect/ui module? I already connected tonkeeper wallet in my project. but I don't know how to send notcoin or USDT transaction in tonconnect/ui module.

Mr.travellerr: me,too. please help me

Mitchell: 20..

&rey: I have given link above, is there any problem? (reply to 88112)

Tanya: but I don't understand. please give me the full example code (reply to 88115)

&: Did you studied strik video tutorial? (reply to 88116)

Tanya: no

&: I strongly recommend to study it first (reply to 88116)

&: Then come here again, (reply to 88118)

Tanya: give me the url

&: https://stepik.org/lesson/1011498/step/2?unit=1019358  After this plz try to find yourself what you need. There's answer for your question in this group chat history. (reply to 88121)

James: anybody here run a full node?   i am trying to follow the official docs for setting up a fullnode (https://docs.ton.org/participate/run-nodes/full-node) but I never get the validator status when I'm done...  looking for some assistance

Kassahun: Hi

x: hi (reply to 88129)

Northman: hi everyone

Umar 1000 🍅: Yes what’s up   Any problem ? (reply to 88136)

Northman: do u have a roadmap for a beginner (reply to 88138)

Umar 1000 🍅: You wan to learn ? (reply to 88141)

Umar 1000 🍅: Inbox (reply to 88141)

Northman: yap (reply to 88143)

Umar 1000 🍅: Come (reply to 88146)

Northman: DM? (reply to 88148)

Umar 1000 🍅: Yeah (reply to 88149)

pfeffunit: Anyone aware of any tools or services that will monitor a ton contract for incoming transactions and then call a webhook?

— 2024-07-25 —

Ajay: Yes (reply to 88021)

Perito 🦈: Hi everyone, using clipboardAPI in telegram mini app, it reports error "Permission policy violation: The clipboard API is blocked due to a permission policy applied to the current document. See .. for details." Does anyone know why this is?The problem only occurs on windows and android devices

cindy: How many jetton transfers can be included in a single transaction at most?

TG: Yup, if need any devs we have some who have worked in this before, for offline casual games while travelling in flight etc (reply to 88013)

Shnai: /

Buggy: Hi guys, I have question about calling state of another contract in my own contract. Foe example, in evm I can just use interface and inject address then call function or get state from the target contract, how can I do that in tact lang?

TG: You can call another contract's state using external calls with an interface, like in EVM. (reply to 88196)

Buggy: Do you have an example of how you do in tact? What I seen is only contract calling getter off-chain, how to it on-chain?

TG: Not in tact, but similar in evm  // Interface  interface IUniswapV2Pair {     function getReserves() external view returns (uint112, uint112, uint32); }  // Use the interface to call the function @kinmedai  contract MyContract {     function getUniswapReserves(address pairAddress) public view returns (uint112, uint112, uint32) {         IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);         return pair.getReserves();     }

Андрей: knowledge from evm network is useless (reply to 88201)

Buggy: Yeah, I mean I know how to do it in EVM, but I don't know how to do it in Tact, how can I see the example? (reply to 88201)

Buggy: Just an example of how MyContract.tact call IUniswapPair.getReserves() is ok, would appreciate.

TG: One sec

TG: // Interface for the GameScore contract interface GameScore {     function getReserves() external view returns (int, int, int); }

TG: Then below:  // Main contract that interacts with GameScore contract MyContract {     GameScore gameScore;      // Set the GameScore contract address     constructor(address gameScoreAddress) {         gameScore = GameScore(gameScoreAddress);     }      // Fetch reserves from the GameScore contract     function fetchReserves() external view returns (int, int, int) {         return gameScore.getReserves();     } }

TG: Check this gh repo: should be some good examples in here   howardpen9/nft-template-in-tact   @kinmedai

Ho: I want to develop an app deloy token on the ton chain and be able to deposit it into my app. I want to ask if you provide support API for me to create a wallet, transfer money, get private key and public key, smart contract? I use php to do this! thanks

User<7369227251>: what is your token name you want? (reply to 88222)

Ho: Flexplay Token

Peng: Hey ton team

Peng: Can i know who do i request username and password from for ton dumps?

Paul: In ton, smart contract connect to other by message. If you want to get state of other sc, must implement send message back of target smart contract. Not smimilar EVM (reply to 88196)

Buggy: So, what if that smart contract doesn't have send message of the state so I won't be able to access those states right? (reply to 88229)

Paul: no way. That why in ton, we can not check a jetton balance of a address in smart contact.

sunyoki: hello tvm  exit_code   where query

Alfred: What's the best way to handle storage gas? Reserve around 0.01 ton for gas or pay at each message and send the remaining gas to next contract?

sunyoki: i dont

0xbera: Hello! I am following this tutorial: https://docs.ton.org/develop/howto/step-by-step#3-compiling-a-new-smart-contract and generating a new highload-wallet-v2 as follows: $ fift -s new-highload-wallet-v2.fif 0 4269 test-wallet-1 Creating new v2 high-load wallet in workchain 0 with subwallet id 4269  Saved new private key to file test-wallet-1.pk ... new wallet address = 0:b4f35d2c7d5d5fca553dcd7f24429ffebe3a917c1f5adf0d122dcb953b264869  (Saving address to file test-wallet-14269.addr) Non-bounceable address (for init): 0QC0810sfV1fylU9zX8kQp_-vjqRfB9a3w0SLcuVOyZIaRWa Bounceable address (for later access): kQC0810sfV1fylU9zX8kQp_-vjqRfB9a3w0SLcuVOyZIaUhf ...   However when I read the private key from test-wallet-1.pk as follows:  func testWallet(c *ton.APIClient, pkPath string) (*wallet.Wallet, error) {  pkBytes, err := os.ReadFile(pkPath)  if err != nil {   logger.Error().Msgf("failed to read private key from '%s', %v", pkPath, err)   return nil, err  }  pk := ed25519.PrivateKey(pkBytes)  w, err := wallet.FromPrivateKey(c, pk, wallet.HighloadV2R2)  if err != nil {   logger.Error().Msgf("failed to instantiate wallet from private key, %v", err)   return nil, err  }  w, err = w.GetSubwallet(4269)  if err != nil {   logger.Error().Msgf("failed to get subwallet, %v", err)   return nil, err  }  logger.Info().Msgf("wallet address : %s", w.WalletAddress().Bounce(true).Testnet(false))  return w, nil }   the wallet address does not match .. any idea what might be going wrong here?

0xbera: hmm .. just realized that the pubkey is always a string of zeroes for ed25519 private keys read from the files generated by new-highload-wallet-v2.fif (reply to 88247)

sunyoki: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

Yang: Hello everyone, I would like to ask why the contract I have compiled successfully always fails to deploy. I use IntelliJ IDEA and Blueprint SDK. Can anyone help me? Thank you.

sunyoki: equal

sunyoki: what error

Yang: yangkun@yangkundeMacBook-Pro GAME % yarn blueprint run scripts/deployTEAM.ts yarn run v1.22.22 warning package.json: No license field $ blueprint run scripts/deployTEAM.ts Error: Could not find file with name 'scripts/deployTEAM.ts ' at selectFile (/Users/yangkun/GAME/node_modules/@ton-community/blueprint/dist/utils.js:87:19) at run (/Users/yangkun/GAME/node_modules/@ton-community/blueprint/dist /cli/run.js:8:58) at async main (/Users/yangkun/GAME/node_modules/@ton-community/blueprint/dist/cli/cli.js:62:5) ✨ Done in 4.63s. yangkun@yangkundeMacBook-Pro GAME % Always this feedback, but the folder and file are clearly there.

sunyoki: 😀😀

Nerses: How is specified chainID in TON blockchain ?

Sammy: I need a developer to create a mini-app bot on Telegram for cryptocurrency transactions (sending, withdrawing, and receiving). The bot should support user authentication, wallet management, and basic transaction functionalities. Experience with the Telegram Bot API and cryptocurrency wallets is required.

Mr.travellerr: can I help you? I have much experience about that. If you have a thought to work with me, DM me (reply to 88285)

Nguyễn Linh: Hey, I'm using @ton/ton lib. Does anyone know how to check the connect status when connecting to RPC using TonClient?

&rey: What do you mean by connect status, actually? (reply to 88287)

&rey: There isn't a persistent network connection underlying TonClient.

Nguyễn Linh: because I think there're cases that the RPC is down. So I'm finding a way to check the connection before using (reply to 88288)

Miguel: hi

Miguel: i need help in my project

Miguel: TON project

x: What help is needed? (reply to 88305)

Miguel: I need to plan air drops to community. user and community members who are going to perform the task.

Umar 1000 🍅: Available for you (reply to 88311)

Umar 1000 🍅: Just inbox for the full details (reply to 88311)

Development: Hello. Can I get a paid internship here?

Sina: is there away to execute transaction faster ?

Nerses: how to verify Jetton ?

TG: Please DM, we have some great devs ready for stuff like this (reply to 88285)

Umar 1000 🍅: Inbox me I have added you (reply to 88285)

Nerses: what should be written in the field content init(owner: Address, content: Cell, max_supply: Int) {         self.totalSupply = 0;         self.owner = owner;         self.mintable = true;         self.content = content;          self.max_supply = max_supply; // Initial Setting for max_supply     }  ?

Огурчік: hi all, i used this code to create wallet with subwallet id (i would like use a lot of wallets with one seed)   from pytoniq.contract.wallets import WalletV4R2  from src.ton import client, connect_client, close_client from config import settings  async def new_wallet(wallet_id):     await connect_client()     wallet = await WalletV4R2.from_mnemonic(provider=client, mnemonics=settings.root_seed, wallet_id=wallet_id)     address = wallet.address.to_str(is_bounceable=False)     await close_client()     return address   but my wallet incative even after first transaction, why?

Louis: How to send multiple messages in one contract

Louis: use 3time send_raw_message(msg.end_cell(), 1); can report errors

Nerses: is there any example of script how to send Jetton from jetton owner to arbitrary address ?

Serhii: what’s the fastest way to make the transaction appear in the blockchain network?  should I send via tonapi, to a private or public lightserver, or are there other options?

&rey: If you send transaction everywhere, it may appear quite soon. Though if you send message via tonapi, it is also bound to appear in their, widely used, mempool so others can race against you. (reply to 88354)

Alan: Hi hi

Alan: Somebody from Mexico Over Here?

Mikhail: Hey everyone, this method drops with "cell overflow"      elseif (context::op == op::process_claim) {         cell proof_cell = in_msg_body~load_ref();         int index = in_msg_body~load_uint(256);          (slice cs, int exotic?) = proof_cell.begin_parse_exotic();         throw_unless(42, exotic?);         throw_unless(43, cs~load_uint(8) == 3);         throw_unless(44, data::merkle_root == cs~load_uint(256));          cell dict = cs~load_ref();         (slice entry, int found?) = dict.udict_get?(256, index);         throw_unless(45, found?);          throw_unless(error::wrong_sender, equal_slices(context::sender, helper_address(helper_stateinit(proof_cell.cell_hash(), index))));          send_tokens(entry~load_msg_addr(), entry~load_coins());     }

Mikhail: How and why does this could be happening?

0xbera: how would "racing against" a tx seen in the mempool work? I assumed that each tx has its lamport time set i.e. there's no way to front-run it..? (reply to 88358)

&rey: Mempool only contains (external) messages, logical time is not yet filled at that moment. (reply to 88367)

0xbera: interesting .. at what point is the logical time for a tx set and by whom? (reply to 88369)

&rey: By validator importing that external message in a block. (reply to 88370)

Serhii: how do nodes determine which external txs from the mempool they want to include in the next block? (reply to 88369)

0xbera: ah .. an "external message" is not a tx yet .. hence no logical time set yet (reply to 88369)

&rey: Normally, they include all of them (if they are accepted and so on). Though consensus does not dictate that all messages are included. (reply to 88372)

0xbera: is there a way to construct an external message in such a way that it is more attractive to a validator? higher fee? or anything?

Anthony: how can I get the chat_id of a user when he opens my mini app ?

0xbera: more generally .. how are the fees for external messages determined and set?

Serhii: from what I know the fee doesn’t affect the “attractivness” of the tx (reply to 88375)

0xbera: okay .. any other factors that do ? (reply to 88378)

&rey: The way to solve this question faster is to choose appropriate chat. Perhaps @devs. Second suggestion is to search in that chat history, as this seems like a common question. (reply to 88376)

Anthony: Yeah I searched but didn't find my answer.  Good news I found myself, using telegram sdks for your bot (like node-telegram-bot-api), you can actually send a message using a user's ID as chat_id and it works! (reply to 88381)

User<6839885291>: How do I attach my game to the message my bot sends ?

Vik: add it at the end of the message? (reply to 88383)

User<6839885291>: Just the url ? (reply to 88385)

User<6839885291>: I want it to look like this

Peng: Hello can someone tell Me where to get the username and password for ton dumps

&rey: @f_closer can. (reply to 88411)

к.: Hi, if block time in TON is 5 second, so why some transactions take 2 minutes to be executed?

&rey: 1. Because messages from mempool can be included in some later block than they are published; 2. Because some things are not atomic transactions. (reply to 88416)

Think: Hi all why is it the the ton wallets not recognised address

к.: Got it. Thanks.🩰 (reply to 88417)

UncleRooks: Hello pls is there any library I can learn TON dev

UncleRooks: Documentation, videos

&rey: There is. docs.ton.org. (reply to 88421)

UncleRooks: It’s too difficult to understand

Vladislav: Excellent, thank you very much Allen ❤️🫵😎 (reply to 74118)

UncleRooks: Sorry guys m new to this

&rey: Have you already watched things starting from https://docs.ton.org/learn/introduction? (reply to 88424)

UncleRooks: I have read and watched the intro videos then I was redirected to stepik  I have started with stepik but it’s not explanatory and I always get stuck (reply to 88427)

&rey: The base of TON is that 1. all assets belong to smart contracts; users' wallets are smart contracts as well; 2. contracts can interact with each other using TON-carrying messages with arbitrary data attached, other interaction is impossible; 3. as a consequence of (2), each transaction only changes state of one contract. (reply to 88429)

&rey: Does that coincide with what you learned? Also, what direction do you want to learn next?

UncleRooks: Yes somewhat I wantu learn how to make smart contracts

UncleRooks: I think my major problem is I don’t have any good documentation to learn FunC

Boris: just start straight with the stepic practice, only watching will not bring much (reply to 88429)

Boris: write the tests in blueprint and some simple func logic

UncleRooks: I always get stuck

Boris: If you have specific questions people will help here (reply to 88438)

UncleRooks: Okay thank you  Let me gather all my problems and send

Thea: This guy is a scammwe he gave me work ànd said he will pay after the work is done and the work is done he blocked me and delete the messages I have proof (reply to 88285)

Sammy: 😂😂😂, where is proof? (reply to 88444)

Sammy: And show us too where i have blocked u) (reply to 88444)

Thea: but you deleted the messages why did you have any reason (reply to 88448)

Sammy: Why are u saying like i have blocked u? Show me the result which u have done ur work? (reply to 88449)

Sammy: Why are u scamming these group members? And why are you improving their hate to me? For what reason?

Sammy: Dear admins, please ban this user for false information!

Thea: If you are saying I don't have proofs lemme upload them (reply to 88454)

Sammy: Upload it, we are waiting them! (reply to 88455)

Thea: Ok

User<5912793884>: i need someone tell me how to create coin without minter ton

Sammy: You're just a douchebag who wants to cheat people and get their money. (reply to 88457)

User<5912793884>: stop drama and fighting here

Sammy: Dear influencers, please ignore this guy if he already written to you. He can't do anything and he is scammer! (reply to 88459)

Sammy: And? Have u done it? (reply to 88464)

Sammy: Show me the bot which u have done it!

Marcus: Hello.I'm developer willing to build  innovation applications. My idea is using zk-snark and tlsnotary to build the on-off ramp platform. I looking for a team to build this. Dm me if  you interesting

Mikhail: Guys, i am trying to sign message with private key, but all i have is mnemonic 24 words,  how do i get private key from mnemonic? should i just put it into buffer

Bode: 5 days and no one answers me on TON wallet support, terrible support!

Vladislav: const mnemonics = YOUR_MNEMONIC.split(" "); const keyPair = await mnemonicToPrivateKey(mnemonics); const workchain = 0; // Usually you need a workchain 0  // WalletContractV3R2 or other version wallet here const wallet = WalletContractV3R2.create({ workchain, publicKey: keyPair.publicKey }); const walletContract = this.client.open(wallet);  UPD: client here is TonClient from "@ton/ton" package mnemonicToPrivateKey method from "@ton/crypto" package btw (reply to 88478)

Пользователь: What is the language that used for enquiry in ton console

Emmanel: This kind of bot has to be a TWA.. you can't interact with wallet directly like that, instructions still need to be signed by users (reply to 88285)

Jack: Hey guys, I am launching a new game project on TON. Anyone knows where should i look for collabs?

Think: Hey guys I'm wanting a Caleb to build an eco village already designed ready to be programmed. Please get in touch 🙏

Emmanel: Submit your app to ton app website (reply to 88494)

Jack: Thanks Already done! anyone with projects want to collabs? (reply to 88498)

Emmanel: What's the nature? (reply to 88501)

Jack: It's called The Five Realms. I am not able to send links here.

Think: Sounds cool

Jack: you can search on ton app website : )

User<6839885291>: How do I remove this message it’s not in messages but somehow appears

Emmanel: I meant what type of game,m

Jack: It's an open-world AI and GameFi adventure where players input their actions with text. All game experiences are AI realtime generated.

Emmanel: Ok,  Great, but if you can afford to spend, try and get some influencial article writers and influencers to promote your game it will go well (reply to 88507)

Jack: any recommendations?

Emmanel: None brother. (reply to 88514)

Emmanel: DYOR😊

Emmanel: And be careful not to be scammed

Bode: 5 days and no one answers me on TON wallet support, terrible support!

User<6905330507>: Hi, I am expertise with figma UI/UIX design,smart contract, front-end and integration, tg bot & tg mini apps. Plz let me know if you need a dev.

Thea: I am a Blockchain and Smart Contract Developer  Dm me if you need my service

User<6839885291>: How do I make the bot not say this ?

— 2024-07-26 —

posty: yooo does anyone know the userfriendly regex of all the wallet types in here?

Rick: May I ask which interfaces can obtain the total number of purchases and sales for the wallet address

Rick: /stat@combot

Ton: I've created a bot that can distribute different amounts of TON to up to 254 addresses at once. If you need it, you can use @tontoolsforyoubot.

Nightfall: Hello, I have a question I have an entrypoint function in contract A that is used to create an id (auto increment) to send in a state init to contract B. Should I increase this id in contract A first before sending to contract B, or should I wait for B's confirmation (callback to A in another message) before doing the increment? I mean if I do the latter, is there any risk that 2 concurrent calls to this function will result in 2 contract B instances that share the same id? (reply to 87864)

Nightfall: on the other hand, if I do the increment first and stateinit message to B fails, then that index will also be invalid...

.: Hi how do I send a transaction with multiple recipients?

Pasza: Hello everyone!  I want to use ston-fi to make a swap, but for jetton out to come to another user's address, how do I do this? I specified the referral address, but only a part of the jettons comes there, why is that? I thought all the jettons should come there.

Abdulaziz: Developers are adding extra bonuses for telegram premium in their web applications, is there a reason for this? Are they getting paid for this?

Joel Mun: Is there a binary literal syntax in func? like 0b11. Or is hex notation the only option

Ankit j: Is this the legit account of Ton on GitHub ?

Anton: there are no binary literals in func so far (reply to 88589)

Joel Mun: would love to get one in the future. much more readable when specifying flags and stuff (reply to 88592)

sunyoki: excuse me

David: Hello everyone, can you guys help me answer "does TON have a standard for HD wallet key generation?" Thank you so much

Ivan: Hi, Why are Jetton exists, what advantages do they provide over native TON?

sunyoki: gas charge How  calculated

Ivan: only one ? (reply to 88601)

sunyoki: contract send transaction

sunyoki: gas fee

I16000: Is it possible to change contract storage in get method of contract?(method_id)

Ankit j: Anyone ? (reply to 88591)

sunyoki: how to calculate the cost of implementing this method

Minh Don: Hi everyone, I'm Minh from Hashleap.io - we are building a payment platform for freelancers.   If you are receiving crypto as payment and are still using multiple spreadsheet to manage invoicing, hours tracking, cashflow tracking, constantly reminding clients on payments, drop me a message I would love to get you a free account with us.

&rey: https://github.com/ton-blockchain/ton/ is the account. I do not know about one you've shown. (reply to 88591)

&rey: No, as get-method evaluation doesn't create a transaction. (reply to 88606)

Ankit j: actually i am using this TWA template...is this legit one https://github.com/ton-community/twa-template ? (reply to 88612)

&rey: Send 0.1 TON or like. See how much did the counter's balance increase. Subtract that from 0.1 TON. (reply to 88610)

Nguyễn Linh: Hi, do you guys have any recommendations about free RPCs for Ton and Ton Testnet? At the moment, I'm connecting to https://testnet.toncenter.com/api/v2/jsonRPC and https://toncenter.com/api/v2/jsonRPC.  But when I make requests on both simultaneously, it returns this error and fails the request:   message: "Request failed with status code 429" name: "AxiosError"

Minh Don: @pcrafter haha boss why the laughing emoji did I say something wrong :)) anyway won't disturb the dev-focused chat. I just wanna help 👉👈

Ankit j: @pcrafter is this Legit repo. to use ? (reply to 88614)

&rey: I don't know any freelancers who "are still using multiple spreadsheet". (reply to 88617)

Minh Don: What are yall using

&rey: I don't know. It is probably safe to use, though. In case of doubt, remember to DYOR. (reply to 88618)

&rey: From wallet? You need to use either a library (programming interface for wallet contracts) or TON Connect 2. (reply to 88572)

&rey: If you wait for B's confirmation, it is quite certain that you'll get same id at some point. (And there will be one B contract, actually.) (reply to 88568)

&rey: It pretty much cannot fail, unless you do strange processing in contract B. Summarizing: you should use counter in contract A, it is fine. (reply to 88569)

d1ce: saw about tonhotshot (pumpfun on solana), do you guys have their github repo? need for learning purpose 😅

ngn: How to send a signed transaction to ton blockchain? Any RPC client for swift/kotlin/java?

Nguyễn Linh: can anyone help with this? (reply to 88616)

Paul: If using in backend, should pay. (reply to 88616)

Alexander: Yep, for swift there’s definitely a thing https://github.com/nerzh/ton-sdk-swift (reply to 88629)

&rey: For mainnet, you can use Orbs ton-access. (reply to 88616)

Alexander: Don’t know for what reason people are using Orbs, the most unstable endpoints that I’ve ever seen 🤷‍♂️ (reply to 88634)

&rey: In my experience mainnet Orbs endpoints have rarely failed. (reply to 88635)

Alexander: There’s nothing free in our world, the error is saying that you’ve reached the rate limit. You supposed to set up a some sort of limits of how many requests you are sending OR pay the rpc/node provider OR setup your own node and use it. (reply to 88616)

Nightfall: I mean waiting for B's confirmation as in "successfully processed the state init message, and then calling back contract A with an opcode indicating its success".  The counter still lives inside contract A.  What I want to ask is, since there are multiple messages (txs) in one flow, is there possible that there is another call to contract A before the callback from B arrives in A?  user 1 -> contract A -> state init contract B with id = 1 -> callback to contract A => A increase id to 2 user 2 -> contract A -> state init contract B with id = 1 (since callback to contract A still haven't arrived, so there would be an id conflict) (reply to 88624)

&rey: It is possible and quite certain to happen.

Nightfall: oh god... (reply to 88639)

Nightfall: this just raised the difficulty tenfold 😭

Nightfall: so I need to make absolutely sure that the call to B will be successful

Alexander: Then you’re living outside of the real world, there’s a lot or otherwise you are paying for the software or even hiring someone to manage it to be compliant (reply to 88619)

Alexander: By the way, looks pretty convenient even I haven’t tried it yet. Do you guys support payments on TON? (reply to 88611)

Nguyễn Linh: Thank you. Actually, I come from EVM and Substrate Eco to here. On those chains, there're usually RPCs to connect and rarely down, or they also have backup RPCs. (reply to 88637)

Minh Don: haven't yet EVMs for now. If TON is highly demanded I don't see why not in the future (reply to 88644)

Nguyễn Linh: Connect using this way is quite good option I think (reply to 88634)

Serhii: Is it possible to send external transaction directly to validator bypassing the liteserver?

&rey: Validator's interface to outer world is essentially liteserver, so I doubt so. (reply to 88649)

Alexander: In practice, liteserver usually plays a role of a middleman between you and validators (reply to 88650)

Alexander: Yes you can sending them to an overlay, that validators use to retrieve the messages (reply to 88649)

Slice: Hey guys  will share job promo hope thats ok we are looking for TON dev to epxand our operations

Slice: TON Chain Trading Bot Developer    We are seeking a highly skilled and motivated TON Developer to join our team. The ideal candidate will have experience in developing and maintaining automated bots for executing trading operations operations on the TON chain.   Responsibilities:   - Develop, implement, and maintain trading bots on the TON chain. - Create automated scripts to execute buy and sell orders in real-time. - Develop and optimize algorithms to quickly detect and exploit trading opportunities (react on transactions). - Integrate the bot with various APIs. - Ensure the security and performance of the bot, minimizing risk of losses. - Conduct continuous testing and adjustments to improve the bot’s efficiency and accuracy. - Monitor bot performance and resolve any technical issues that arise. - Document code and developed functionalities. - Collaborate with the development team to align bot operation.   Requirements:  - Strong Rust language foundation and experience - Strong programming skills on FunC. - Knowledge about TVM (TON Virtual Machine). - Experience with smart contracts and blockchain, specifically in TON. - Knowledge of RESTful and WebSocket APIs for integration. - Ability to work independently and proactively solve problems. - Familiarity with software security concepts and blockchain environments. - Experience using version control tools like Git. - Excellent communication skills and ability to work in a team.   Nice to Have:   - Previous experience in a similar role within a startup or fintech company. - Knowledge in data analysis without limited access to libraries (some of them unexisting ones)

Serhii: Is there some docs/knowledge base on how to do it? (reply to 88652)

к.: https://github.com/xssnick/ton-deep-doc  Hi, guys can I find such a document in English as well?

&rey: https://docs.ton.org/develop/network/overlay is a mirror. (reply to 88657)

Urban: Hi all. Regarding native USDt on TON (not jUSDT). Are there any bridges that can be utilized to transfer these to other chains - idealy TON <> Polygon? From https://ton.org/en/borderless there is Symbiosis (cannot transfer from TON) and Layerswap that should support this. But these are swaps. Are there any bridges yet for this?

ຮꫀթí: hello how can use wallet.deploy_via_external() or wallet.is_active with @ton/ton library?

к.: Thanks (reply to 88659)

sunyoki: hello  excuse me

sunyoki: there  transaction  confirm block count?

0xbera: Can you please give an example for the second case (some txs are not atomic)? (reply to 88417)

&rey: Pretty much any action. For instance, TON transfer contains of two transactions: first sends TON from sender's wallet, second credits them to destination wallet. (reply to 88671)

&rey: 1 block is sufficient. (reply to 88669)

sunyoki: ok

sunyoki: how do you calculate gas 🤣🤣🤣

&rey: I believe my message got lost? Alright: Send 0.1 TON or like. See how much did the counter's balance increase. Subtract that from 0.1 TON. (reply to 88678)

sunyoki: are there any other options😂 (reply to 88679)

&rey: Count gas used by contract (summing everything by instruction; taking maximal gas possible for dictionaries/etc). Send exactly that much TON. (reply to 88680)

Tanya: who need a developer in telegram mini app development? I will help you.

[+_-]: Hello everyone! I'm a bit confused about action fees, specifically:  Action fees are deducted from the balance of the source account during the processing of the action list, which occurs after the Computing phase. These are the actions that incur fees:  SENDRAWMSG sends a raw message.  So, this is a separate, legitimate type of fee that needs to be accounted for if there are opcodes that trigger it(if I got this idea the right way). Here's the gas validation in the stablecoin contract: // 3 messages: wal1->wal2, wal2->owner, wal2->response // but the last one is optional (it's okay if it fails) throw_unless(error::not_enough_gas, msg_value > forward_ton_amount + fwd_count * fwd_fee + forward_init_state_overhead() + // additional fwd fees related to init state in internal_transfer get_compute_fee(MY_WORKCHAIN, send_transfer_gas_consumption) + get_compute_fee(MY_WORKCHAIN, receive_transfer_gas_consumption) + calculate_jetton_wallet_min_storage_fee() ); However, action fees aren't considered here. Why not? There is SENDRAWMSG after all. Furthermore, the documentation states: action_fees = sum(out_ext_msg_fwd_fee) + sum(int_msg_mine_fee)  Does this mean that the action fee consists of the forward fee for sending outgoing messages and the compute fee for incoming messages? I'm a bit confused about this, so I'd really appreciate it if someone who understands the fees well could clarify this for me.

Barus: Hello everyone, I recently built smart contracts for chatbot on TON Chain and buy and sell automation code for trading volume bot, If you need help, I can help you, Thank you

Nguyễn Linh: Hey, I wonder if this check, Seqno, is enough to confirm the status of the transaction as failed or confirmed?       const walletContract = client.open(wallet);       const seqno = await walletContract.getSeqno();       console.log(seqno);         await walletContract.sendTransfer({           secretKey: key.secretKey,           seqno: seqno,           messages: [             internal({               to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",               value: "0.09", // 0.05 TON               body: "Hello", // optional comment               bounce: false,             }),           ],         });         let currentSeqno = seqno;         while (currentSeqno == seqno) {           console.log("waiting for transaction to confirm...");           await sleep(1500);           currentSeqno = await walletContract.getSeqno();         }         console.log("transaction confirmed!");

MM: Hello, everyone  I want to transfer NFT to multiple wallets in one transaction with payload message.  Is there anyone who can help me?

Sina: is it possible to get external message before i want to call sendTransaction of TonConnect library ?

Sina: are you looking for this ?  https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer (reply to 88706)

Nerses: can someone help to understand this jetton transfer flow ?   https://testnet.tonviewer.com/transaction/f1d1b48b50bff309f63e74869744eba81fc0cdf0cc35a9f9a5e7946e76e59738

Nerses: here is the code with which i did the transaction   const walletContract = client.open(wallet);   const walletSender = walletContract.sender(key.secretKey);   const seqno = await walletContract.getSeqno();    const contractAddress = Address.parse("0:4d3b789f0240fa5f8577dcaef38447daf69320d6c5fe5130f53bd73ede06f808");   const newContract = JettonDefaultWallet.fromAddress(contractAddress);   const contractProvider = client.open(newContract);    // TokenTransfer details   const queryId = BigInt(Date.now()); // Unique identifier for the transaction   const amount = 10n; // Amount to transfer, here it's 1 TON   const destination = Address.parse("0:37a656eb3793c513b23c22df8014fbd3864104a33a123be83191e0658ff80d21"); // Recipient address   const response_destination = Address.parse("kQCfCUwHtdIzOvupHmIQO-z40lrb2sUsYWRrPgPhCiiw69Rw"); // Address to receive response, usually the sender's wallet   const custom_payload: Cell | null = null; // Optional custom payload   const forward_ton_amount = toNano("0.2"); // TONs to forward with the payload   const forward_payload = beginCell().endCell(); // Forward payload, can be empty     await contractProvider.send(walletSender, { value: toNano("0.3"), bounce: true }, tokenTransferMessage);  specifically i dont understand what wallet is D

&rey: D is recipient address. You've chosen it as destination. (reply to 88713)

Nerses: then what is the C,as nowhere i mentioned it.Is it the master contract ? (reply to 88715)

&rey: Have you already learned how to transfer Notcoin? (reply to 88717)

&rey: C is jetton wallet belonging to D (destination). (reply to 88718)

&rey: Test question. What should be the message destination if you wish to send a jetton (i.e. Notcoin)? (reply to 88721)

Nerses: I already in code mentioned the wallet address of D.so I gave wrong arguments ? shouldnt i specify any jetton wallet address in the code ? (reply to 88720)

&rey: Yes, destination was wrong in the code. (reply to 88724)

Пользователь: How to listen for new transactions

&rey: There are many contracts — wallets, jetton wallets, jetton masters, etc. Which of them? (reply to 88723)

Nerses: I corrected the destination  address.what can cause to get exit code 130 ?  and also why it gets notification ?  https://testnet.tonviewer.com/transaction/37d730b37639f10aca7762f55840afa5fa57d8ce75ecf2bc6c64217afa4c9b59 (reply to 88725)

&rey: Yeah, you need to send message to jetton wallet of sender. (reply to 88730)

&rey: Exit code 130 is caused by logic of destination contract, so it seems fine. Why it gets notification? Because you set forward_ton_amount to be 0.2 TON. (reply to 88729)

Ееее: Hi everyone. I've tried to build and run HTTP API for TON. I've used Docker Compose. And now there is errors on Docker. How I can solve this problems?  https://github.com/toncenter/ton-http-api

&rey: async function requestNotcoinsDeposit(tonConnectUI, destinationAddress, amount) {     const senderAddressString = tonConnectUI?.account?.address;     const senderAddress = Address.parse(senderAddressString!!);     const jettonWalletAddress = await userNotcoinJw(senderAddress);          const messageBody = beginCell()         .storeUint(0x0f8a7ea5, 32).storeUint(0, 64)         .storeCoins(amount).storeAddress(destinationAddress)         .storeAddress(senderAddress).storeBit(0)         .storeCoins(1n).storeBit(0)         .endCell();          await tonConnectUI.sendTransaction({         validUntil: Math.floor(new Date() / 1000) + 360,         messages: [{             address: jettonWalletAddress.toString(),             amount: toNano('0.04').toString(),             payload: messageBody.toBoc().toString('base64'),         }]     }); } (reply to 88733)

ETON: Hello, Why can't I use the “~udict_delete?” method in the on_bounce function Deleting a piece of dictionary data, are there any dictionary operation restrictions on bounce message processing, outside of 224 bits

&rey: Bounce messages are pretty much same as common ones. What error does it give? (reply to 88741)

&rey: Notcoin contract comes into play just in userNotcoinJw function: async function userNotcoinJw(userAddress) {     const jettonMasterAddress = Address.parse('EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT');     const client = new TonClient({endpoint: 'https://toncenter.com/api/v2/jsonRPC'});     const userAddressCell = beginCell().storeAddress(userAddress).endCell();     const response = await client.runMethod(jettonMasterAddress, 'get_wallet_address', [         {type: 'slice', cell: userAddressCell}     ]);     return response.stack.readAddress(); }  Have you known that as well? (reply to 88743)

&rey: Put two transfers in data list. (reply to 88716)

&rey: Alternatively, you can increase forward amount in Notcoin transfer. This approach will be less transferrable to sending multiple tokens, though. (reply to 88749)

&rey: Change the selected part. (reply to 88751)

Пользователь: How to listen for new transactions for wallet_v3r2  Please can anyone tell me (reply to 88726)

&rey: Something like this: https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py. (reply to 88759)

.: Hi  How to do 2 messages in one transaction?  Like it tonviewer/transaction/64fb2ea1f1e21b4db07759b1af63c765dcf28341934bbbf2d02a813759154a91

&rey: It is quite easy; what lib are you using? (reply to 88764)

Пользователь: import asyncio  from pytoniq import LiteClient, MessageAny   async def main():     async with LiteClient.from_mainnet_config(ls_i=0, trust_level=2) as client:          trs = await client.get_transactions(address='EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG', count=3)         print(trs)  # [{'account_addr': '6f5bc67986e06430961d9df00433926a4cd92e597ddd8aa6043645ac20bd1782', 'lt': 39515024000004, 'prev_trans_hash': b'\xe93\xfaM"\xc6Cz\x1a\x8a\xfad\x8fe:\xf9sP!\xa4\x8bG\x02KJm^)w\x02Vq', 'prev_trans_lt': 39515024000003, 'now': 1690098531, 'outmsg_cnt': 0, 'orig_status': {'type_': 'active'}, 'end_status': {'type_': 'active'}, 'in_msg': {'info': {'ihr_disabled': True, 'bounce': True, 'bounced': False, 'src': Address<EQAPYSNXK9Ha7o8Z2cnROAYC22-IMzczCNIX7LsU39YZH8bP>, 'dest': Address<EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG>, 'value': {'grams': 1000, 'other': None}, 'value_coins': 1000, 'ihr_fee': 0, 'fwd_fee': 733339, 'created_lt': 39515024000003, 'created_at': 1690098531}, 'init': None, 'body': <Cell 0[] -> 0 refs>}, 'out_msgs': None, 'total_fees': {'grams': 0, 'other': None}, 'state_update': {'old_hash': b'\xd6U\xcc\x0bD\xf2\xaeh\xcf\xe8\xb7I\xa8v\x1a9\xee\x87\x12\xa0\xdb#\xe4\xc3\xa5\xf3\xf5\xae&\x01\xc7\xa7', 'new_hash': b"\x05\xa9\x7fx\xac\r'\xe2\x0e\xddX\xd2M\xe7\xd4\x19ZG\x08J\xe0\r\xeaW\xdd\xf5\xbdX\x86\x82\xf6*"}, 'description': {'type_': 'ordinary', 'credit_first': False, 'storage_ph': {'storage_fees_collected': 0, 'storage_fees_due': None, 'status_change': {'type_': 'unchanged'}}, 'credit_ph': {'due_fees_collected': None, 'credit': {'grams': 1000, 'other': None}}, 'compute_ph': {'type_': 'skipped', 'reason': {'type_': 'no_gas'}}, 'action': None, 'aborted': True, 'bounce': {'type_': 'nofunds', 'msg_size': {'cells': None, 'bits': None}, 'req_fwd_fees': 1000000}, 'destroyed': False}}, {'account_addr': '6f5bc67986e06430961d9df00433926a4cd92e597ddd8aa6043645ac20bd1782', 'lt': 39515024000003, 'prev_trans_hash': b'>y\xa3L\xd9\x15\x92\xc0P\x93\x8a\x86D`H\xa0\x87Z}S\xb7\xc1h\x97\x1cL\xe3\xf7\xb1\x1f\xa4\x8e', 'prev_trans_lt': 39514911000001, 'now': 1690098531, 'outmsg_cnt': 0, 'orig_status': {'type_': 'active'}, 'end_status': {'type_': 'active'}, 'in_msg': {'info': {'ihr_disabled': True, 'bounce': True, 'bounced': False, 'src': Address<EQAPYSNXK9Ha7o8Z2cnROAYC22-IMzczCNIX7LsU39YZH8bP>, 'dest': Address<EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG>, 'value': {'grams': 1000, 'other': None}, 'value_coins': 1000, 'ihr_fee': 0, 'fwd_fee': 733339, 'created_lt': 39515024000002, 'created_at': 1690098531}, 'init': None, 'body': <Cell 0[] -> 0 refs>}, 'out_msgs': None, 'total_fees': {'grams': 91, 'other': None}, 'state_update': {'old_hash': b'\x03}\xbb\x93v\x00\xa7\xc7w\x96\x07\x14\x9a\xafo\xb0\xc3\x16n)\xc4\x02i\x99s\xef\x1f\xf0\xb2\xb6\xd77', 'new_hash': b'\xd6U\xcc\x0bD\xf2\xaeh\xcf\xe8\xb7I\xa8v\x1a9\xee\x87\x12\xa0\xdb#\xe4\xc3\xa5\xf3\xf5\xae&\x01\xc7\xa7'}, 'description': {'type_': 'ordinary', 'credit_first': False, 'storage_ph': {'storage_fees_collected': 91, 'storage_fees_due': None, 'status_change': {'type_': 'unchanged'}}, 'credit_ph': {'due_fees_collected': None, 'credit': {'grams': 1000, 'other': None}}, 'compute_ph': {'type_': 'skipped', 'reason': {'type_': 'no_gas'}}, 'action': None, 'aborted': True, 'bounce': {'type_': 'nofunds', 'msg_size': {'cells': None, 'bits': None}, 'req_fwd_fees': 1000000}, 'destroyed': False}}, {'account_addr': '6f5bc67986e06430961d9df00433926a4cd92e597ddd8aa6043645ac20bd1782', 'lt': 39514911000001, 'prev_trans_hash': b'\xdc#q\x05\x98\x7f\x90\xa8\xde\x85\xf5\xab\x0bqB\xb9\xae\xb1\xe9:\x8b;t\xf4\\\xa1\xda\xc1V\xa1B\xa7', 'prev_trans_lt': 39496961000001, 'now': 1690098174, 'outmsg_cnt': 1, 'orig_status': {'type_': 'active'}, 'end_status': {'type_': 'active'}, 'in_msg': {'info': {'src': None, 'dest': Address<EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG>, 'import_fee': 0}, 'init': None, 'body': <Cell 648[0317AED6DDEFC03BD811F8EAD1DB34F4FA74E5187B864CADF0C5849E36352CDF995D732967AD0EB474DB41166E1E51FB6D337BA6A0F9C261B4498FA1E37CAE0E29A9A31764BCDA33000000F10000000003] -> 1 (reply to 88760)

.: FunC standard (reply to 88765)

&rey: Write down how much TON do you want to go in each message, then use send_raw_message twice. (reply to 88768)

Пользователь: This will work? (reply to 88766)

.: send_raw_message ? Is example to use ? (reply to 88770)

Nerses: is there any exaple of TokenNotification message that is passed as an argument for forward_payload field TokenTransfer.I get overflow trying to write it

&rey:   send_raw_message(begin_cell()     .store_uint(0x10, 6)     .store_slice(destination_1)     .store_coins(15000000)  ;; 0.015 TON     .store_uint(0, 107)     .end_cell(), 1);   send_raw_message(begin_cell()     .store_uint(0x10, 6)     .store_slice(destination_2)     .store_coins(0)     .store_uint(0, 107)     .end_cell(), 64);  ;; all remaining TON (reply to 88772)

.: Thanks (reply to 88774)

Mikhail: Hey guys, trying to sign a message and check it in smart-contract   let sig = sign(beginCell().storeUint(1,256).endCell().hash(), keypair.secretKey);  await provider.external(beginCell().storeRef(beginCell().storeBuffer(sig).endCell()).endCell());      var signature = in_msg_body~load_bits(512);     int is_valid = check_signature(slice_hash(in_msg_body), signature, const::twitter_checker_address);      I understand that i am missing a message in a check_signature,  then how should i put it into a message?  beginCell().storeRef(beginCell().storeBuffer(sig).endCell()).storeUint(1,256).endCell() ???

Mikhail: like where i should put original message to have valid hash that can be verified on smart-contract?

Nerses: how can i rearrange this code to escape overflow ?   let slc: Slice = beginCell().storeStringTail("You recived tokens succefully").endCell().asSlice();   const forward_payload = beginCell()                           .storeUint(0x7362d09c, 32) // Function selector for the message type                           .storeUint(Number(queryId), 64) // queryId                           .storeCoins(amount) // amount                           .storeAddress(wallet.address) // from address                           .storeSlice(slc) // forward_payload; can be modified with additional data if necessary                           .endCell();

Sina: @pcrafter   I want to use /v2/events/emulate in tonapi but i don't know how pass data to this api  do you know how it works ?

&rey: Use .storeStringTail here. Though you should put 33 zero bits before it. (reply to 88778)

Bohdan: Hello. I need to know if the transaction completed and if there were no errors. How can I check this? I use the pytoniq library for Python I will be grateful for your help

Nerses: here is it but again got overflow const forward_payload = beginCell()                           .storeUint(0x7362d09c, 32) // Function selector for the message type                           .storeUint(Number(queryId), 64) // queryId                           .storeCoins(amount) // amount                           .storeAddress(wallet.address) // from address                           .storeInt(0,33)                           .storeStringTail("success") // forward_payload; can be modified with additional data if necessary                           .endCell(); (reply to 88781)

&rey: Well, overflow isn't in quoted lines. (reply to 88783)

Nerses: I use that forward_payload for this message const tokenTransferMessage: TokenTransfer = {   $$type: 'TokenTransfer',   queryId,   amount,   destination,   response_destination,   custom_payload,   forward_ton_amount,   forward_payload, };   can it cause that ? (reply to 88784)

&rey: It seems you're doing something strange.

&rey: forward_payload should be just beginCell().storeUint(0, 32).storeStringTail("success").endCell(), not the whole message.

User<7207904103>: /

Nerses: and notification message will automatically created by Jetton Wallet ? (reply to 88788)

Mr Radikali: Hey I want to send jetton tonconnect ui without gasless ( without any fee ) in w5 wallet

&rey: Nope, not possible. (reply to 88793)

Mr Radikali: I mean that pay with jetton fees not ton fee in w5 (reply to 88795)

&rey: I understood that, and this functionality is NOT available in TON Connect 2. (reply to 88796)

Mr Radikali: I want this fee   I dont want to pay with ton in W5 wallet (reply to 88798)

Mr Radikali: So its transfer with his jettons like notcoin (reply to 88798)

Nerses: how to get Jetton wallet code off cahin having jettonmaster address ?

musashi: jetton standard has get_jetton_data method for getting it (reply to 88805)

musashi: (int, int, slice, cell, cell) get_jetton_data() method_id {     (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();     return (total_supply, -1, admin_address, content, jetton_wallet_code); }

Nerses: I have the data with getter,but it says that items is private so have no access to it,is there any solution for this case ?  TupleReader {   items: [     { type: 'int', value: 1000000n },     { type: 'int', value: -1n },     {       type: 'cell',       cell: x{8013E12980F6BA46675F7523CC42077D9F1A4B5B7B58A58C2C8D67C07C2145161D7_}     },     { type: 'cell', cell: x{} },     {       type: 'cell',       cell: x{FF00F4A413F4BCF2C80B}        x{62_}         x{D001...1450551443306D6DDB3C019410356C41E2216EB38E9B7003C8018210D5 (reply to 88808)

Adams: Hello,   I wish to transfer Ton from wallet to wallet. Please what should I write in the comment section?   Can anybody help me?

Almatbek: Are there any companies or projects seeking a talented developer?

&rey: If destination isn't a centralized exchange or like, you can use arbitrary comment — it will be public, that's all. (reply to 88814)

Nerses: is there any example in type script to get jetton_jetton_data  ?

