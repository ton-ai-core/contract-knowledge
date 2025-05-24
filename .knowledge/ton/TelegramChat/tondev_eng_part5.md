Andrey: Actually it has addition checks for generated seed, you can check them in tonlib code:  https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/tonlib/tonlib/keys/Mnemonic.cpp#L159 (reply to 43707)

Bear: 😄 (reply to 43706)

Bear: https://github.com/ston-fi/dex-core/blob/b124d4e02d6d32b8d178702a538500f145ba564e/contracts/router/utils.func#L30  it's STON.fi's code (reply to 43706)

Bear: cell calculate_jetton_wallet_state_init(slice owner_address, slice jetton_master_address, cell jetton_wallet_code) inline {     return begin_cell()     .store_uint(0, 2)     .store_dict(jetton_wallet_code)     .store_dict(pack_jetton_wallet_data(0, owner_address, jetton_master_address, jetton_wallet_code))     .store_uint(0, 1)     .end_cell(); } (reply to 43710)

Dario: Check here: https://docs.ton.org/develop/data-formats/msg-tlb#stateinit-tl-b (reply to 43706)

Bear: so in FunC we have to store the other contract's initial Code? (reply to 43712)

Bear: We can't work like Tact here https://tact-by-example.org/06-calc-contract-address?

Nxrix: What is the fastest way of turning seed phrase into wallet address in js?

Daniil: It literally works the same way (reply to 43714)

Dario: Code and init data if you want to init new contracts from another one (reply to 43713)

Bear: any example code? (reply to 43716)

Клецка: ton-crypto (npm) provides function for this (reply to 43715)

Nxrix: There isn't anything faster? (reply to 43719)

Daniil: Why do you need anything faster? (reply to 43720)

Nxrix: I'm trying to make some beautiful wallet (reply to 43721)

Nxrix: like something similar to EQAAAAA....

Nxrix: Maybe someday I will find it 🤣 (reply to 43723)

Sol: How do I connect ton space to my bot so that users can connect to it?

&rey: vanity-contract (reply to 43722)

Nxrix: Yeah I tried it before) (reply to 43726)

Maxim: https://github.com/ton-society/grants-and-bounties/issues/435  Hello!  What do you think of this idea? We see this as an interesting application for both the foundation and the developers

— 2024-02-12 —

Bear: when we want to use Bool, we usually use .uint(1) right?   then, the code here means the 1 as true? if (is_locked) {}  Them why we set with 1 here, and comment with true is -1?  https://github.com/ston-fi/dex-core/blob/b124d4e02d6d32b8d178702a538500f145ba564e/contracts/router/admin-calls.func#L32   ```     if (op == lock) {          storage::is_locked = 1; ;; true = -1 but is_locked is uint         save_storage();         return ();     }      if (op == unlock) {          storage::is_locked = false;         save_storage();         return ();     }      ````

Bear: so it means, we don't have store_bool or load_bool to deal with Bool type.   But rather, we use store_uint(1) to manage the same effect in FunC.  My question is, how to show: if (storage::is_locked is not true) {. ......} ?  eg. if (storage::is_locked) {....}  means it's in TRUE (reply to 43731)

Соус: -1 is true if i remember right (reply to 43732)

Bear: yes, true is -1. But we set it in uint(1). So..... it has to be in 1.  But problem is, what is the value when it needs to be in false?   0 in uint(1) means false. right?   Then how to show it in if (...) {} (reply to 43732)

Bear:     if (~ init?) {         throw_unless(405, equal_slices(collection_address, sender_address));         store_data(index, collection_address, in_msg_body~load_msg_addr(), in_msg_body~load_ref());         return ();     }

Bear: ok seems this shows if the init? is the in false then ..... (reply to 43736)

Behrang: Use int to store a 1-bit boolean flag.  store_int(true, 1) or store_int(false, 1).

Behrang: And use load_int(1) to read it:  int ok? = load_int(1);

Bear: cool, thank you.   Everyone style is different right? In FunC. Quite interesting. I like Hipo Finance. (reply to 43738)

Alex: Hi

MS: Hello, i need your help. I couldn't open storage provider on testnet. I cannot upload files to the storage provider I am running. I need to solve this problem My Task is expiring. Please help me.   walue@walue-ABRA-A5-V15-4:~/Desktop/TON/STORAGE/Deneme3$ storage-daemon-cli -I 0.0.0.0:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub [ 3][t 0][2024-02-06 15:06:30.124567034][storage-daemon-cli.cpp:231][!extclient]  Connected >  >  > create -d "descccccc" denemelik.txt Bag created BagID = 5F5BE0681DB0073F0B8D650B90EC05DF1BC3786856060E9660DB96987290C0DD Index = 0 Added: Tue Feb  6 18:06:49 2024 ----------------------------------- descccccc ----------------------------------- Downloaded: 182B/182B (completed) Dir name:  Total size: 182B Upload speed: 0B/s Root dir: /home/walue/Desktop/TON/STORAGE/Deneme3/ 1 files: ######  Prior   Ready/Size       Name      0: (001)    121B/121B    +  denemelik.txt >

MS: Other storage provider's client is getting this error message "Torrent header is not available"   > add-by-hash FDBBF44B333D282623353953DE90E42B511D68C7377A27E43860D98083CAACB6 --partial testlik.txt --json Bag added BagID = FDBBF44B333D282623353953DE90E42B511D68C7377A27E43860D98083CAACB6 Index = 10 Added: Fri Feb  9 17:06:53 2024 Torrent info is not available Download speed: 0B/s Upload speed: 0B/s Root dir: /home/walue/Desktop/TON/STORAGE/Deneme4/storage-db/torrent/torrent-files/FDBBF44B333D282623353953DE90E42B511D68C7377A27E43860D98083CAACB6 Torrent header is not available

Alex: Banned from writing for what?

MS: I don't understand you. Messages in Russian (reply to 43745)

Alex: They blocked my account, I can't write! I didn't write much in this chat room, I read more!

Alex: unlocked (reply to 43746)

Behrang: It's more like that we're discovering a good style together. (reply to 43740)

sdw: hello everyone,  outMsg: [       {         '@type': 'raw.message',         value: '2000000000',         source: 'EQDssfQIqXUUGPx5L4vWLUriM8wdv6yD8qRF9mZ7k6eqMCBK',         fwd_fee: '666672',         ihr_fee: '0',         message: 'ZU1RjgAAAY2KmnhVMBhqAA==\n',         msg_data: {           body: 'te6cckEBAQEAEgAAH2VNUY4AAAGNipp4VTAYaghtM8ca',           '@type': 'msg.dataRaw',           init_state: '',         },         body_hash: 'vnriTwuxsZmnA9zFZIf2Kmw/reMLaEctcuKlaaWPzH8=',         created_lt: '18915221000002',         destination: 'EQC3S3mLRAbquyxkzVg8a6Ogf71WEz3hy978xdYXKiHvh4oB',       },  do you maybe know how could I possibly decode to utf8 one of the following message or body ? Thank you in advance

𝕖𝕊𝕒𝕓𝕚𝕥: Hi, every third party bridge says my TON addresses are not valid???

𝕖𝕊𝕒𝕓𝕚𝕥: I’ve tried ton space, official wallet, Tonhub wallet, ton keeper wallet

&rey: Maybe (just an idea, though likely) those bridges are scam? (reply to 43752)

𝕖𝕊𝕒𝕓𝕚𝕥: Nope (reply to 43754)

Glen: Hi, What is the best way to list gram TX? time and amount ideally using js sdk

~ The 17th Letter ~: hey Guys can you help me how can i detect subscribe to my wallet changes do i need check my balance in time range or there is any method i can subscribe to my wallet changes like in solana

Daniil: Are you sure you’re entering correct address? (reply to 43752)

𝕖𝕊𝕒𝕓𝕚𝕥: Yeah (reply to 43758)

𝕖𝕊𝕒𝕓𝕚𝕥: “Hello! Due to the maintenance on the provider's side cross-chain transactions to and from the Ton network are currently unavailable.”  That’s what the bridge provider said in responsresponsee to

~ The 17th Letter ~: ???? (reply to 43757)

Клецка: @tontracker_bot (reply to 43757)

Клецка: i think, this is what you're looking for

Tolya: Migration required for early adopters of Toncenter V3  In anticipation of the public release of Toncenter V3, we have made final edits to the V3 API:  — hashes are now in base64 instead of hex;  — methods that returns an array (e.g. /transactions) now return an object with an array {transactions: []};  — _friendly address fields in each object replaced by address_book hashmap;  — transaction.account_state_after_hash and transaction.account_state_before_hash removed;  This latest version of V3 is now on stage.toncenter.com/api/v3 and stage-testnet.toncenter.com/api/v3.  Next week on Monday, Feb 19, 2024, toncenter.com/api/v3  and testnet.toncenter.com/api/v3 will be replaced on this new V3 version. The stage will also remain available.  The current V3 version is backed up at migrate.toncenter.com/api/v3 and migrate-testnet.toncenter.com/api/v3 and will be available for a month.  Required actions  If you are an early adopter of toncenter.com/api/v3 please:  — switch your product to migrate endpoint;  — then migrate your product to new V3 API format located on stage;  If you are not yet a V3 user - we are happy to invite you to try it next week after the public release. (forwarded from Toncenter API)

ＡλＩ: Hi Does TON provide storage? Can I access it from outside the network? I need to store some images, get their direct link, and embed them into my service.

~ The 17th Letter ~: thanks very much but i mean about subscribe from code i have application and need to scan my wallet for new transactions (reply to 43762)

Imam Abubakar: Hello,  I’m new to TON blockchain. I built a simple react application that utilizes Tonconnect React SDK and while testing it works well while sending transactions on testnet but now trying on mainnet it returns cannot calculate gas as the error.  Is there a reason why the gas couldn’t get calculated when I try sending transaction on mainnet?

NDA: implemented a lib to work with the new version of toncenter V3 API on typescript,  those who may need the old version of V3 API, moved it to the migrate branch,  if you find any bugs, you can write directly to PM, we will try to fix them promptly.  https://github.com/ndatg/ton-http-api (reply to 43764)

Andrey: TON Storage :) (reply to 43765)

Nxrix: Is it free? Or does it include any free plan? (reply to 43769)

Andrey: Its like torrent or IPFS (reply to 43770)

ＡλＩ: Saw the blog post but couldn't access the given sample image on regular internet!? (reply to 43769)

satoshi: how do i become a node runner

Aydin: This is quite weird for me! It appears that when I try to deploy a contract on testnet, the same transaction also occurs on mainnet, the deployment fee is deducted from both mainnet and testnet wallets, and both show the transactions in their histories!!  What is going on here? Is this behavior OK? (using Blueprint & Tonkeeper)

— 2024-02-13 —

Dane: Hi guys! I was wondering if anyone could point me into resources where I can learn how to create a very simple contract that goes:  > User sends TON to contract > Contract sends a Token(Jetton) back to that user   —-  Or at least a react sourcecode where they send Jettons to a user, and that user pays for transaction fee

&rey: Normally, you won't even have wallet with the same address on mainnet and testnet. (reply to 43775)

&rey: If you have, though, messages can be replayed.

User<1083813316>: Any example contract that transfer x TON to address1 and y TON to address 2 in the same function

User<1083813316>: Basically I want to include multiple transfers to different addresses in same transaction

Daniil: just send multiple messages then (reply to 43781)

User<1083813316>: Can you share some example contract? (reply to 43782)

Daniil: do you have a contract that sends one single message? (reply to 43785)

User<6955603556>: how can i create cNFT collection in getgem ?

Bear: https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-item.fc

Bear: why do we have this? It's error and not able to compile

Bear: 👍🏿👍🏿👍🏿👍🏿

Dmitry | backend4you.ton: https://github.com/ton-blockchain/token-contract/blob/main/stdlib.fc#L229 (reply to 43789)

Bear: 😳😳😳 (reply to 43791)

Dmitry | backend4you.ton: this is func declaration/mapping to TVM op. Add this line to your stdlib (or even directly in your contract) (reply to 43792)

Aydin: Yeah, recently I've noticed that the mainnet and testnet addresses have become identical. Wondering if this issue is related to the recent DDOS attack on TonAPI or something...  Anyway, is there a remedy for this? Or should we just wait for bug fixes? (reply to 43778)

ethzanity: Hi is there anywhere I can find a list of hackathons available for TON?

User<1083813316>: Is it possible to access mini-app without going through bot

&rey: https://society.ton.org/activities/hackatons (reply to 43795)

ethzanity: Thanks! Are there none in 2024? (reply to 43797)

&rey: TON Foundation doesn't disclose its plans until week or two before the event. (reply to 43798)

Shivam: hi bro , i wam not able to switch ton wallet from mainnet to testnet in chrome browser , can you please help me with that ? (reply to 43775)

Dmitry | backend4you.ton: they always were identical. so if you have same address in testnet and mainnet and somebody ask you to transfer him some coins in testnet - then this transfer message may be copied to mainnet and may be successfully executed (your mainnet coins will be transferred) without your knowledge. some restrictions apply, but generally it can. (reply to 43794)

Shivam: can i anyone help in switching from mainnet to testnet chrome extension wallet ? (reply to 43800)

Shivam: Is this true ? (reply to 43803)

Bear: Is there the Burn for NFT Item?

&rey: Scam. Please block+report the account. (reply to 43803)

&rey: It wasn't included in standard because otherwise indexing NFTs would become harder. (reply to 43805)

Howard: you can transfer the OwnerShip to the emptyAddress (reply to 43805)

punkd.base.eth: Hello

punkd.base.eth: Hey guys, we are trying to get a webapp (build from flutter) to be set up as a TMA - anyone here has any experience, inputs / suggestions on how they have gone / would go about it?

Aydin: No, they were not exactly the same previously.  Before this, testnet adresses were beginning with 0/k; but now, they are beginning with U, exactly the same as mainnet addresses. This is clearly a problem: they shouldn't be so.   Before this, transactions on mainnet and testnet were independent of each other: transferring some testnet coins did not result in transferrebce of real mainnet coins at the same time. But now, they are totally mixed, and transactions occur in both simultaneously! This is obviously a bug. (reply to 43801)

&rey: How did you even obtain same wallets on mainnet and testnet? subwallet_id should have taken care of that. (reply to 43813)

&rey: in which explorer? (reply to 43813)

Dmitry | backend4you.ton: user-friendly form of ton address (https://docs.ton.org/learn/overviews/addresses#user-friendly-address) has 'isTestnetOnly" flag, but internally blockchain uses raw form. So, same seed generates same raw address for mainnet/testnet, and dealing with this flag is pure client software "problem" (reply to 43813)

Dmitry | backend4you.ton: oops :) (reply to 43814)

Aydin: A few days ago, I checked this in Tonkeeper, Tonscan, and Tonviewer. They were all problematic.  Just now, again I checked my Tonkeeper. The addresses were fixed, but mainnet transactions were in place, while they shouldn't occur at all. Because, I have not requested any mainnet transactions these days; all I have done was a number of testnet contract deployments. However, my real mainnet balance has decreasd as well! (reply to 43815)

Aydin: Oh, and I forgot to mention MyTonWallet! That was problematic, too. (reply to 43818)

Kenny$$Shillz: U can use the tonapis getTransactions method passing your wallet address as param. U can send this request every minute and check if the logical time has changed (reply to 43766)

Behrang: Can you share an example of one transaction that has happened on both networks? (reply to 43813)

Aydin: Sure! Here they are. Testnet is marked green, mainnet magenta

Glen: hey any info on how todo batch payment over ton?

Dmitry | backend4you.ton: Up to 4 sends per request/block/10sec - regular wallet, for up to 200-250 - highload wallet (reply to 43826)

Glen: Yea over highload  async function createTransferBody(params): Promise<Cell> {   const Cell = TonWeb.boc.Cell;   const cell = new Cell();   // const cell = new Cell();   cell.bits.writeUint(0xf8a7ea5, 32); // request_transfer op   cell.bits.writeUint(params.queryId  0, 64);   cell.bits.writeCoins(params.jettonAmount);   cell.bits.writeAddress(params.toAddress);   cell.bits.writeAddress(params.responseAddress);   cell.bits.writeBit(false); // null custom_payload   cell.bits.writeCoins(params.forwardAmount  new BN(0));   cell.bits.writeBit(false); // forward_payload in this slice, not separate cell   if (params.forwardPayload) {       cell.bits.writeBytes(params.forwardPayload);   }   return cell; } (reply to 43827)

Barbell: I am having an issue with wallet versioning for MNEMONIC

Barbell: in blueprint

Barbell: Unknown wallet version v4r2

Barbell: how I can specify the correct version of the Wallet

— 2024-02-14 —

punkd.base.eth: Someone pinged me on DM saying they can do this for ~50 TON. Any such experience for anyone here? (reply to 43812)

Barbell: I am getting scammers

Barbell: Lol someone is asking me to put my seed in http:// :D

Barbell: at least use https

Barbell: the unknown wallet version v4r2

Barbell: is here any SC developer who wants to share or exchange the knowledge on building SC on Ton?

&rey: You've meant "not send 24 words anywhere on unknown sites, no matter if that's HTTP or HTTPS". Normally, mnemonic isn't transmitted over network at all. (reply to 43841)

Dane: Hi guys! How do you send Jettons via React?

Dane: Sending TON looks something like this, but I can't wrap my head around sending Jettons

Mikhail: You need to have contract "ABI" and send a message to contract (reply to 43848)

Dane: Thanks @Mikhail! What's a contract ABI? and what kind of message do I need to send?   I'm having trouble finding the relevant docs to make this happen

Mikhail: Guess you need to find JettonWallet compiled code, then send "Transfer" message to it's address. I dont really know if it's possible to do your thing without contract code. I bet you are trying to send one of TEP-74 Tokens, so it wont be a problem to find contract code   Here is an example of sending message to contracts. https://ton-community.github.io/tutorials/03-client/ (reply to 43850)

Barbell: yes it was scam. But I am testing my SC but I don't want to go through tonkeeper all the time. So I wanna use the option to use Mnemonic locally and sign the tx (reply to 43846)

Dane: Yeah I'm just using the default Jetton contract code. I kind of know how to send messages to a contract, but having trouble with the format I guess  Thanks @Mikhail!! (reply to 43851)

&rey: Doesn't just v4 work? (reply to 43834)

Mikhail: Here it is, just found this  https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer (reply to 43853)

Dane: Wait I went through this,, how did I miss this 🥲 Thanks again @Mikhail! (reply to 43855)

Behrang: Can you also share the link to an explorer for both of them? (reply to 43822)

bodasooqa: Hi  Tell me, please, can I get information about the user’s @wallet public address through the bot without connecting a wallet?

Barbell: no I've tried few times (reply to 43854)

Shivam: can please tell me how to switch to testnet from mainnet (reply to 43806)

Yamz: Help sent ton coin with correct address but wrong comment

Yamz: Someone please help me with this (reply to 43861)

Yuri: Hello guys, where can I check ConfigParam 21?

Kenny$$Shillz: to transfer jettons between users you need to send a transfer msg to your jetton wallet contract, passing the number of jettons you want to transfer and the recipients Ton wallet address (reply to 43850)

Kenny$$Shillz: https://docs.ton.org/develop/dapps/asset-processing/jettons (reply to 43850)

Behrang: https://tonviewer.com/config#21 (reply to 43863)

Kenny$$Shillz: is anyone else having a problem with sending ton from tonkeeper wallet on testnet?

Shashank: Stay informed about the latest hackathons and meetups by following the TON Society Regional Hubs. For real-time updates, connect with them on Twitter. Also, mark your calendar for an upcoming event in India scheduled for March 2024. (reply to 43795)

Денис: Hello, please help.  Telegram wallet does not connect. It says that the manifest file was not found, although it exists. I tried to connect to the wallet on Tonkeeper, everything connects.  thank you in advance

&rey: It normally is possible but mini-apps' UI doesn't take that well. (reply to 43796)

Ihor: Hi all! How to get "bounce" flag from the transaction retrieved by getTransactions to know if transaction failed?

Ihor: And are there any options to determine type of transaction from the getTransactions output?

Kenny$$Shillz: Yes use the opcode (reply to 43874)

Ihor: Can I extract it from the API call response? (reply to 43875)

Александр: Hi! Can I get the address which sent message (invoked my contract) in recv_internal?

Kenny$$Shillz: Yes (reply to 43876)

Ihor: do you know by any chance how? (reply to 43878)

Kenny$$Shillz: It's a field in the transaction object

Kenny$$Shillz: use transaction.get("out_msg")[0].get("op_code") (reply to 43879)

Kenny$$Shillz: Then U can check if the opcode returned matches the opcode for the type of transaction you are filtering for

Ihor: I can't see any field that looks similar in response from ton-http-api server. Could you please tell which interface you use? (reply to 43880)

Kenny$$Shillz: I'm using tonapi v2 (reply to 43883)

Александр: I mean, there is gotta be a way. I thought, maybe, sender address is stored in the message.  But, it seems, the message can arbitrary, there are just conventions and good practices.  I've read "internal messages" in TON documentation and it says just that — "op" and "query_id" and the rest — data, I already knew about those. And it's not enforced in any way, just a convention. So, nothing about sender address there.  Do you guys know if that's possible (to get sender address) or where to look it up?  Please help, thanks in advance. (reply to 43877)

Kenny$$Shillz: In contract ? (reply to 43885)

Александр: Yes, I'm writing a small contract in FunC. I want to store the address of whomever invoked it. (reply to 43886)

Александр: And I don't want to just pass the address as then it can be faked, meaning someone else could send a message and pass an arbitrary address in — not what I want.

Ihor: Thank you for quick response, and I'm wondering if there is any other way of getting same info using different service which doesn't do additional processing (e.g. from self-hosted node)? (reply to 43884)

Kenny$$Shillz: Sender (reply to 43887)

Александр: That's right. So what do you think? (reply to 43890)

Kenny$$Shillz: slice cs = in_msg_full.begin_parse(); int flags = cs~load_uint(4);  if (flags & 1) {       return (); } slice sender_address = cs~load_msg_addr();

Aydin: Of course. Here is the mainnet tonscan:  https://tonscan.org/address/UQBduGMWlJTyYrKW5Jgml8mWWfa4AW8e5pPKmaTmUzEYrtMO  And this is the testnet:  https://testnet.tonscan.org/address/EQBduGMWlJTyYrKW5Jgml8mWWfa4AW8e5pPKmaTmUzEYro7L  As you see, for example, for the screenshot of the twin main-test transactions I showed last night, while their timstamps are pretty close:  (mainnet) Feb 10, 2024, 08:00:01 PM  (testnet) 2/10/2024, 7:59:58 PM  their logical times are completely different:  Mainnet LT: 44521624000001  Testnet LT: 18967242000001 (reply to 43857)

Kenny$$Shillz: I think this is what U need (reply to 43891)

Kenny$$Shillz: slice cs = in_msg_full.begin_parse(); int flags = cs~load_uint(4);  if (flags & 1) {       return (); } slice sender_address = cs~load_msg_addr();

Александр: Many thanks, I'll try that. (reply to 43895)

Barbell: I think they must be bug in blueprint

Barbell: const wallets = {     v1r1: ton_1.WalletContractV1R1,     v1r2: ton_1.WalletContractV1R2,     v1r3: ton_1.WalletContractV1R3,     v2r1: ton_1.WalletContractV2R1,     v2r2: ton_1.WalletContractV2R2,     v3r1: ton_1.WalletContractV3R1,     v3r2: ton_1.WalletContractV3R2,     v4: ton_1.WalletContractV4, }; class MnemonicProvider {     constructor(params) {         _MnemonicProvider_wallet.set(this, void 0);         _MnemonicProvider_secretKey.set(this, void 0);         _MnemonicProvider_client.set(this, void 0);         _MnemonicProvider_ui.set(this, void 0);         if (!(params.version in wallets)) {             throw new Error(Unknown wallet version ${params.version});         }         const kp = (0, crypto_1.keyPairFromSecretKey)(params.secretKey);         __classPrivateFieldSet(this, _MnemonicProvider_client, params.client, "f");         __classPrivateFieldSet(this, _MnemonicProvider_wallet, (0, core_1.openContract)(wallets[params.version].create({             workchain: params.workchain ?? 0,             publicKey: kp.publicKey,         }), (params) => __classPrivateFieldGet(this, _MnemonicProvider_client, "f").provider(params.address, params.init)), "f");         __classPrivateFieldSet(this, _MnemonicProvider_secretKey, kp.secretKey, "f");         __classPrivateFieldSet(this, _MnemonicProvider_ui, params.ui, "f");     }

Barbell: this is the source code which explicitly is asking for wallet version after specifying

&rey: Have you reported it on Github? (reply to 43899)

Barbell: set WALLET_MNEMONIC='seed whatever' && set WALLET_VERSION=v3r2 && npx blueprint run

Barbell: it's failing

Barbell: yeah (reply to 43902)

Barbell: I am going to fix it locally lol this doesn't make sense why is not parsing properly or the condition is not working lol (reply to 43902)

Glen: Any real Ton devs here?

&rey: Many of them, actually. (reply to 43907)

Glen: ok i have some legit questions and documentation / examples are not working at all..

&rey: Then go on and ask them! nometa.xyz (reply to 43909)

Glen: I just asked if they are here..

&rey: Go ahead and ask questions, I meant. In particular, I'm TON dev. (reply to 43911)

Glen: Ah yea sry i was getting to it 😉 So i'm trying to setup an automatic batch payment(GRAM jetton)  on TON ( pool side payout)  using some examples from https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#1-transfer

Glen: If i can DM you can send u the code i have so far, but it does not work yet

&rey: Is there any problem with sharing it? In case it's long (and it probably is), you can use gist.github.com. (reply to 43914)

Glen: I can share, will leave out the addresses.

Glen: https://gist.github.com/mrprobz/f591a40c243b99d4512e63a01118b79f

&rey: To transfer jettons, you send message to your jetton wallet.

Glen: Do you have any code example? (reply to 43918)

Glen: i thougth that is what the code is trying todo (reply to 43918)

&rey: https://gist.github.com/ProgramCrafter/a7ebe459e3ec2aacab409b05d3054f06 should work better. (reply to 43919)

Glen: Will have a look and see if that works. Thanks (reply to 43921)

Glen: Property 'getAddress' does not exist on type 'WalletContractV4' ? (reply to 43921)

Andrey: Guys, what python libs do you use for mining? I tried pythoniq, but there's no interatcion with  transation pool

P.I 🦈: guys, who have code for tg bot  , to approve nft hold

Kenny$$Shillz: What do U mean by approve nft hold sir (reply to 43925)

P.I 🦈: what person have nft in my collection on wallet  def get_user_ton_wallet_address(user_id):     # Implement logic to retrieve user's TON wallet address     pass  # Function to check NFT ownership (needs implementation) def check_nft_ownership(wallet_address):     # Implement logic to check NFT ownership using TON API     # e.g., ton_api.check_ownership(wallet_address, nft_id) (reply to 43926)

Kenny$$Shillz: Ok U can use tonapis nft collection endpoint for the second one https://tonapi.io/api-v2 (reply to 43927)

P.I 🦈: Thank You (reply to 43928)

Behrang: The root of the problem is that you are using the same wallet on both testnet and mainnet.  I also think that any user reasonably expects it to be safe to just change the network, and be safe, but your example shows that there is a problem right now.  I saw a solution in wallet v5, that I'm sure is there to fix this problem. Read more here: https://github.com/tonkeeper/w5/blob/main/Specification.md#wallet-id  The above solution (which is not yet available in wallets) helps normal users of wallet apps by creating different wallet addresses for mainnet and testnet. Then when you change network, you will get a different address too.  Dmitry's post here: https://t.me/tondev_eng/43817 shows that wallet_id is a fixed number in some version of wallet (which I don't know).  And about your messages being replicated on mainnet quickly, basically anyone (intentionally or unintentionally) can copy those external messages from testnet to mainnet. So don't expect it to not be copied.  For now I think you should create another wallet on mainnet, and transfer your funds to that new address and don't use the same wallet seed on both networks. (reply to 43894)

Aydin: Oh, that was illuminating. Thanks 👍 (reply to 43930)

Howard: why do we get error sometimes in this contract?  https://ton.cx/address/EQD2GEhVqmBh7zfVf8IMyHyEU6C8_R9GzXEOQPJImwaz9HrA

Aydin: Following Behrang's points, I did an experiment. Tried to transfer two different amounts through mainnet and testnet.   Result. The mainnet transaction didn't affect testnet, but the testnet transaction was replicated in mainnet, too.  Conclusion. Testnet, as a "free test net," is unreliable at the moment. Be careful with it!

Howard: 😳 how possible (reply to 43930)

Aydin: I guess it is most likely related to the recent DDOS attacks (reply to 43935)

&rey: Conclusion. A few testnet wallet apps are "unreliable" in that they don't ensure replay protection between different chains. Be careful with them! (reply to 43933)

Aydin: And are there some alternative wallet apps which DO ensure protection againt replay attacks, available to the public, that you would recommend? (reply to 43937)

&rey: hmm... alright, haven't found one. Though TS wrappers for TON (thus, not an application, just library) process testnet correctly. (reply to 43938)

Aydin: Could you name those wrappers, please? (reply to 43939)

&rey: @ton/ton - WalletContract... (reply to 43940)

Dmitry | backend4you.ton: Exit code 37 - some “throw” in code. Is this standard or custom collection? (reply to 43932)

Howard: I don't know. It's the contract for MDRN's Collection.   https://t.me/ton_mrdn_bot (reply to 43932)

Greg: Hi,  Is this the correct address and function for GRAM mainnet? There are a few addresses associated with this jetton so I'm a bit confused as to which one to use..   const jettonMastAddress = new TonWeb.utils.Address("EQC47093oX5Xhb0xuk2lCr2RhS8rj-vul61u4W2UH5ORmG_O");   const minter = new JettonMinter(tonweb.provider, {     address: jettonMastAddress,   }); const jettonWallet = new JettonWallet(tonweb.provider, {     address: jettonMastAddress,   });  Part2: If I want to use TonWeb to send GRAM, I would pass in this jettonWallet.createTransferBody() into the payload for wallet.methods.transfer() ?

Greg: like this? await wallet.methods     .transfer({       secretKey: keyPair.secretKey,       toAddress: await minter.getAddress(), // address of Jetton wallet of Jetton sender       amount: TonWeb.utils.toNano("0.05"), // total amount of TONs attached to the transfer message       seqno: seqno,       payload: await jettonWallet.createTransferBody({         jettonAmount: TonWeb.utils.toNano("50"), // Jetton amount (in basic indivisible units)         toAddress: recvJettonAddress, // recepient user's wallet address (not Jetton wallet)         forwardAmount: TonWeb.utils.toNano("0.01"), // some amount of TONs to invoke Transfer notification message         forwardPayload: comment, // text comment for Transfer notification message         responseAddress: sendTonAddress, // return the TONs after deducting commissions back to the sender's wallet address       }),       sendMode: 3,     })     .send();

Void;: any python package?

Clone: Any js package?

&rey: pytoniq (reply to 43946)

&rey: TonWeb (reply to 43947)

Void;: ew its async (reply to 43951)

Void;: https://github.com/yungwine/TonTools?tab=readme-ov-file  looks fine

Greg: btw this runs without error... if I invalidate the seqno for example it does error out... but yet nothing in the wallet is sent (reply to 43945)

Greg: the wallet TonWeb shows is  wallet:WalletV3ContractR1 {...}  does TonWeb support WalletV4? not sure if that is part of the problem?

Greg: it shold not be this difficult to do a simple transfer. I've tried 2 different API's now without luck following examples carefully

Barbell: it does (reply to 43957)

Barbell: what kind of error are you getting. Do you use blueprint? Make sure you link the wallet with SC. Ping me so I can explain you. (reply to 43955)

Greg: Thanks, I ended up getting it working, Didn't have much luck with TonWeb, but works constructing the body and sending via LS client (reply to 43961)

— 2024-02-15 —

Ahmed: Hello everyone, can anyone tell me please how can I decode the raw address to get the public address?

Ahmed: by public address I mean Bounceable address

Ahmed: Nevermind, I found a solution

Barbell: can you please share

Barbell: it's good if we also share some code so we can all learn

Dmitry | backend4you.ton: Code in universal language: https://docs.ton.org/learn/overviews/addresses#raw-and-user-friendly-addresses (reply to 43969)

Group Admin: Hi, I am using wallet api and configured high load wallet to transfer ton to my subscribers but when i send this in my wallet all transaction is marked as SPAM ... i am not able to understand why this is marker spam in every transaction when i do with API. if i do a normal transfer it dose not mark anything .  this is my wallet Please check and suggest what changes i need to change in code to avoid this :  https://tonviewer.com/EQDZGs-6gB-wPlA3FPiYENYaMdB_R_5BGtHxSr9HXbDqfF_4

Dmitry | backend4you.ton: this is not your code problem.  its a safety measure that exists in wallets and explorer to protect users from scam and phishing and so on.  the pattern of your transactions is equal to scam pattern (send msg with same text comment and small ton amount to different addreses) (reply to 43972)

Group Admin: is there any why to avoid ... our uses so small trx only . Thank you for reply . (reply to 43973)

Dmitry | backend4you.ton: different wallets and explorers have different rules, for example https://tonscan.org/address/EQDZGs-6gB-wPlA3FPiYENYaMdB_R_5BGtHxSr9HXbDqfF_4 does not mark your transactions (reply to 43974)

Denis: looks like you sending a lot of messages to many users with comment contains link to some suspicious web site. hmmmmm.  it's definetly VERY SUSPICIOUS. you can buy domain like tonk.ton, resolve it to you sending wallet, transfer domain nft  to sending wallet and user will see sender as "tonk.ton" and send message without comment. it will cost less money for you too (reply to 43972)

Mikey: Is there anyway to perform signature verification with TON?

Mikey: How do you guys identify this when writing func "#0524c7ae"? ownership_proof#0524c7ae

Daniil: https://docs.ton.org/develop/data-formats/crc32 (reply to 43978)

&rey: check_signature for Ed25519, and a few new methods. (reply to 43977)

Imam Abubakar: Hello, Can anyone help or advise?  Built a react app with tonconnect-ui/react for wallet connection and transactions work fine when using tonkeeper on desktop but the transaction keeps failing on mobile for tonkeeper

Andrew: provide more logs or screenshot, not your personal inferring (reply to 43981)

Imam Abubakar: That's the problem, there is no error being outputted which is why I don't know how to debug (reply to 43982)

Imam Abubakar: You can test the link here on testnet https://qr-code-ton.vercel.app

Andrew: TON infrastructure is not stable at Mainnet, and even harder at Testnet (reply to 43984)

Mikey: How do you guys perform a signMessage in TON?

Dane: Hello! What causes this failure?

Dane: Here's my code so far. The documentation is a bit challenging to understand, but what is WALLET_DST, WALLET_SRC, and address supposed to be?  I'm trying to send that METXT Jettons from one wallet to another

Dane: send help, thanks!

&rey: https://github.com/toncenter/tonweb/blob/944455da2effaa307a2030d00e19a37e6e94897c/src/contract/wallet/WalletContract.js#L129 (reply to 43986)

&rey: Of course, you can't do that onchain — blockchain isn't a good place for secret keys.

&rey: You send 0.05 TON to jetton wallet and ask it to forward 1 TON out of that to destination. (reply to 43989)

Dane: wait sorry I don't exactly get what you mean... What's WALLET_DST supposed to be? (reply to 43995)

&rey: Contract (TON wallet / DEX / etc) you send tokens to. (reply to 43997)

&rey: WALLET_SRC is your wallet address.

Dane: got it! Just the normal wallet address, not the Jetton contract address right?

Dane: Thenn, what about the address here?

Dane: I'm still getting "unverified Token" "failed" error

&rey: That's your jetton wallet address. (reply to 44001)

&rey: Jetton wallet needs some money for computation/storage/message fees, right? (reply to 44002)

Dane: The sender jetton address right? Still getting this huhu (reply to 43988)

&rey: You can send amount: toNano('0.30'), — excess money will be returned no matter how much there is.

Dane: trying now! Thank you!

Dane: Ohhhh it works!!

Dane: So you need to send some TON it seems

Andrew: u need to read this firstly    https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 43997)

Dane: Sorry for disturbing again, but how do I sign this transaction from within the code?   Maybe using  the mnemonic or private key?  My plan is to sent a certain amount of Jettons to a user when they trigger it from a game.

Dane: Actually, if anyone's offering a service how much does it usually cost to have a relatively simple contract written?  Basically something like: https://github.com/ton-community/simple-distributor  But distributes the received TON to the stakeholders, and returns Jettons to the user who paid

&rey: Cost estimates: https://github.com/ton-society/grants-and-bounties/issues/268 (reply to 44012)

Dane: Thank you!! (reply to 44013)

Sol: [["ton-connect-storage_bridge-connection","{\"type\":\"http\",\"connectEvent\":{\"id\":163,\"event\":\"connect\",\"payload\":{\"items\":[{\"name\":\"ton_addr\",\"address\":\"0:9a6a7314134db7d8c6f8f4456456bf8b564862361e4942d043\",\"network\":\"-239\",\"publicKey\":\"c47d98995ee818b13c70d961ca20815e52f464d52181e719dcdc2b2bc42687f8\",\"walletStateInit\":\"te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQertertFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP84564564IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj456456F8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4C45645656TQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5Ddfgdfgdfgdfgxgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjF8R9mJle6BixPHDZYcoggV5S9GTVIYHnGdzcKyvEJof4QBH7tKw=\"}],\"device\":{\"platform\":\"iphone\",\"appName\":\"Tonkeeper\",\"appVersion\":\"3.6.2.4\",\"maxProtocolVersion\":2,\"features\":[\"SendTransaction\",{\"name\":\"SendTransaction\",\"maxMessages\":4}]}}},\"session\":{\"sessionKeyPair\":{\"publicKey\":\"896ec992971107389d970e6fc5ffb484098612bc5edc9bc53f1713b31274081b\",\"secretKey\":\"99cbe69d5d6caa397099ec96619f2a345a45656456541111369779eb187e13ce\"},\"walletPublicKey\":\"e16b9be1f5c021f8b5ee4564560b15522685248ae773b724bf59fd06300\",\"bridgeUrl\":\"https://bridge.tonapi.io/bridge\"},\"lastWalletEventId\":163,\"nextRpcRequestId\":0}"],["ton-connect-storage_http-bridge-gateway::https://bridge.tonapi.io/bridge","1706030969719197"]]  This is what I have left after ToneConnect authorization!! Question: Where is the wallet address in this shit?

Void;: even if its in, you can see it encrypted. (reply to 44015)

Sol: what method or library? (reply to 44016)

Dane: Bounty is up. Is this a good estimate, or any additional info needed?  https://github.com/ton-society/grants-and-bounties/issues/442

Void;: any public rest api to create ton wallet?

&rey: "name\":\"ton_addr\",\"address\":\"0:9a6a7314134db7d8c6f8f4456456bf8b564862361e4942d043\" (reply to 44015)

&rey: HEX form of address.

Void;: seems no (reply to 44020)

Void;: i've install the https://github.com/toncenter/ton-http-api  but i cannot find any route to create wallet..

NDA: do you need https://toncenter.com/ ? (reply to 44020)

Void;: there is no route to create a walle (reply to 44028)

Void;: i've setup the holy http api, none

NDA: I'm not sure if you need to install your api server (reply to 44025)

NDA: you can use https://github.com/ton-org/ton/tree/master/src/wallets with toncenter api (reply to 44030)

Void;: any example? i dont have skills in ts. (reply to 44032)

NDA: api is only needed to send a message to the blockchain

NDA: with sendBoc / sendMessage methods

NDA: @nxbot https://github.com/ton-org/ton/?tab=readme-ov-file#usage  check usage block

NDA: this example will create a v4 wallet

Void;: can this be in python? golang?

NDA: https://github.com/xssnick/tonutils-go looks good (reply to 44038)

Void;: i've try it, in replit. looks great! (reply to 44037)

— 2024-02-16 —

Dane: Hey guys, how do you make a contract send Jettons to another wallet?

Jeff: You can check this code. Create token transfer body first and send it to contract's jetton wallet. Contract should know its jetton wallet address. https://github.com/ston-fi/dex-core/blob/main/contracts/router.func#L66-L68 (reply to 44044)

Nas: Hi! Can someone pls explain why this attached TX is showing as failed on the explorer? It was successful earlier and funds have been received.  Here is the TX https://tonscan.org/tx/XnjFVUK0lR3bYx83Gn6XkadgQbYm_07xl3hGcMQ_DMI=

User<1083813316>: how can I estimate transaction fees in js

Dima: Gm everyone, happy to be here 🚀

Dima: Does anyone have experience with signing messages using ton connect?

&rey: It can be done only once, as part of ton_proof (user authentication). In particular, you can't sign arbitrary cell via TON Connect 2. (reply to 44050)

Dima: Good point thank you. Been searching for a way for hours. Turns out you can submit a tonproof signature on connection request  https://docs.ton.org/develop/dapps/ton-connect/react#optional-check-ton_proof-on-the-backend (reply to 44051)

Mikey: What cause this error when pulling transaction history from rpc

NDA: check with archival=true (reply to 44053)

Mikey: works thanks

Anh Vũ 🆓: Hello, I transferred Ton to Ton wallet from OKX exchange, the transfer order from OKX exchange has been confirmed since 2pm. But now my Ton wallet doesn't have Ton. Thanks to the team to help me check. Thank you very much.

Anh Vũ 🆓: ID : K/YTt5+yoeQQPn6RNw0T6aqrJwPPZFDfxKqpfrPNS2E=

Dmitry | backend4you.ton: blockchain explorers says you have 5,96 ton on your account, arrived 3H ago: https://tonviewer.com/EQDjp8VRVXmB33sh18dF42lYrPNK2cDwLhV4H4F-9YOp_9ic https://tonscan.org/address/UQDjp8VRVXmB33sh18dF42lYrPNK2cDwLhV4H4F-9YOp_4VZ  it seems problem in your wallet/phone/internet/... that it doesn't see this. (reply to 44057)

Nxrix: I think you have to wait (reply to 44059)

Anh Vũ 🆓: My wallet is in pending status, why?

Nas: Anyone can help on this pls? (reply to 44047)

Anh Vũ 🆓: My wallet is in pending status, why? (reply to 44061)

Nxrix: no the transaction is in pending status (reply to 44063)

Denis: is this custodial @wallet or TonSpace ? (reply to 44066)

Denis: also it better to ask their support

Denis: they have link to support in gui

&rey: I think because wallet was uninitialized and incoming message wasn't empty. Not sure about that, though. (reply to 44047)

Anh Vũ 🆓: This is Ton wallet on telegram. now, what must I do ? (reply to 44068)

Dmitry | backend4you.ton: in settings, it has "Contact support" link that will redirect you to their special support bot (reply to 44074)

Kaspars: Hi, is it possible to do contract init of the inactive address with existing TON balance and transfer out in same tx/boc?   Or we have to init first and only in the next transaction transfer TON out?

Dmitry | backend4you.ton: yes, it is possible. Moreover, the problem "my wallet account is uninitialized" usually solved by telling "make outbound send , send some ton to anybody, including yourself" (reply to 44076)

Kaspars: Thanks, good to know it should be possible, because I keep trying to that for a while and without success  If looking at this example: https://github.com/tonfactory/tonsdk/blob/master/examples/wallets/wallet.py#L16  Which contract method or combination should be used for init and transfer in the same call? (reply to 44077)

Kaspars: To clarify, init of the inactive wallet with the TON on it, to transfer to any external address

Kaspars: When I try using following:  wallet = WalletV4ContractR2(     public_key=address_bytes,     address=address, ) tx = wallet.create_transfer_message(     to_addr=to_addr,     amount=amount,     seqno=0, ) boc = bytes_to_b64str(tx['message'].to_boc(False)) response = rpc.send_boc(boc) print(response)  then response is {'ok': False, 'error': 'LITE_SERVER_UNKNOWN: cannot send external message : duplicate message', 'code': 500}

Kaspars: I see here that if seqno == 0, it should add state_init

&rey: Maybe that's related to recent patch, but something seems off in your code as well. Do you provide secret key as well? (reply to 44080)

Anh Vũ 🆓: I received Ton, thanks for your support.

Anh Vũ 🆓: I received Ton, thanks for your support. (reply to 44075)

Kaspars: Maybe some of previous failure attempts lead to this weird state where some sort of action happened, but incompletely.   because address state from inactive has changed now to "uninitialized" (reply to 44082)

Kaspars: Will try again with fresh address, thanks

Danya: Hi guys!  Is it possible to prevent the web app from closing on swipe down?

Dmitry | backend4you.ton: https://t.me/devs (reply to 44087)

Kaspars: When running this code first time on a inactive address with assets on it, without prior interaction, the error is  {'ok': False, 'error': 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction E42B8561AC5CDB18CB83B2D03F8C5C0F94F9BB79B611DC2CEAD7BCC230E61E0C:\nexitcode=0, steps=0, gas_used=0', 'code': 500} (reply to 44080)

Howard: Is there any better way to know whether the tx has put on-chain or not?

Denis: you should react on changing state and not on transaction happening (reply to 44090)

Greg: Hi All  any idea why I am seeing this error trying to send GRAM to a v3r2 wallet that is active? (works correctly sending from v4r2 to v4r2, but not v4r2 sending to v3r2)    const contract = version === "v3R1" ? WalletContractV3R1 : version === "v3R2" ? WalletContractV3R2 : WalletContractV4;   const wallet = contract.create({ workchain, publicKey: Buffer.from(publicKey) });  Error: cannot apply external message to current state : Failed to unpack account state

&rey: You should change destination address, not source. (reply to 44092)

Greg: ahhh nice thanks bro that was it (reply to 44093)

CripticHood | Drops💧: Hello everyone.  I need help regarding ton-crypto, I used mnemonicToHDSeed to generate public/private key for my derived wallet using my existing Mnemonic phrase. After generating I get the publickey and privatekey the problem arises when I try to use the privatekey to get the publickey using keyPairFromSeed() from ton-crypto by passing my private key, it shows bad seed.  My question is: if keyPairFromSeed sees the private key as bad seed what function can I pass the private key to get the public key back.

CripticHood | Drops💧: my code below:  import { keyPairFromSeed, KeyPair } from 'ton-crypto';  export function getPublicKeyFromPrivateKey(privateKey: Buffer): string {   try {     const keyPair: KeyPair = keyPairFromSeed(privateKey);     return keyPair.publicKey.toString('hex');   } catch (error) {     console.error('Error getting public key from private key:', (error as Error).message);     throw error;   } }  The issue arises when I use the generated private key in the HD wallet generation process, see the code for generating the HD wallet bellow.  // HDWalletGenerator.ts  import { mnemonicToHDSeed, deriveSymmetricPath, keyPairFromSeed, KeyPair, } from 'ton-crypto';  import { WalletContractV4 } from '@ton/ton';  // Export the HDWalletInfo  interface export interface HDWalletInfo { address: string; privateKey: string; walletContract: WalletContractV4; }  export async function generateNewHDWallet(existingMnemonic: string[], sequentialIndex: number): Promise { try { // Generate HD seed from existing mnemonic const seed: Buffer = await mnemonicToHDSeed(existingMnemonic);  // Derive the symmetric key from the seed const derivedKey: Buffer = await deriveSymmetricPath(seed, ['chainadres', 'wallet', sequentialIndex.toString()]); // Create key pair from the derived symmetric key const keyPair: KeyPair = keyPairFromSeed(derivedKey);  // Create wallet contract v4 const walletContract = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });  // Get and return the new wallet address, private key, and wallet contract return {   address: walletContract.address.toString(),   privateKey: keyPair.secretKey.toString('hex'),   walletContract, };} catch (error) { console.error('Error generating new HD wallet:', (error as Error).message); throw error; } }  This displays the public and private keys to my ui  The private key from this derivation is what I'm using in my getPublicKeyFromPrivateKey() above. But keyPairFromSeed sees it as bad seed.

Ahmed: hello everyone, can anyone provide me a documentation or anything of how to implement ton payment with a telegram bot

Nxrix: If I want to explain simply you should figure it out with ton api (reply to 44097)

Ahmed: alright ill check it out, thanks

Salmono: Hello guys, may I know where I can find information about all TON/Jetton standart?

Mike: Anyone know how to get the balances of a LP programatically or throuhg an API?

&rey: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 44100)

Reza◭: Hi guys Do you know which wallet supported icp Blockchain?

&rey: Is that related to TON somehow? (reply to 44103)

Kenny$$Shillz: It's got to do with the version U are using I think (reply to 43983)

&rey: https://docs.dedust.io/reference/pool#get_reserves — call that get-method through API of your choice. Other DEX contracts might not support that method, of course. (reply to 44101)

عبد الرحمن: Hello, does anyone have touturial for TON? And in python if there

NDA: https://docs.ton.org/develop/overview (reply to 44107)

— 2024-02-17 —

Andras: if i should use pow-opencl-miner, where do i find active ton givers address?

🅰🅻🅰🅽: Our team recently developed a useful python toncenter client, pytoncenter, for the backend of our miniapp. It supports both versions 2 and 3, and offers rich typing support, type checking, the ability to obtain transaction traces, among other diverse APIs. We're sharing it with all our partners, and if you like it, feel free to give it a star for support! If you have any questions, please don't hesitate to raise an issue, and we'll be happy to answer it for you.  https://github.com/Ton-Dynasty/pytoncenter

User<5579208602>: Hey im making TMA with tonconnect-ui, however when i connect my wallet and click go back it just goes back to my bot's chat. Is it possible to open TMA again?  <TonConnectUIProvider manifestUrl={tonconnect-manifest.json} actionsConfiguration={         {             returnStrategy: "https://t.me/mybotname",             twaReturnUrl: "https://t.me/mybotname",         }     }>         <RouterProvider router={router} />     </TonConnectUIProvider>

Sol: import TonWeb from "tonweb"; export async function getJettonBalance(walletAddress, jettonAddress) {   try {     return balance;   } catch (error) {     console.error("Error getJettonBalance wallet:", error);     throw error; // throwing a bug   } }  export async function getNft(walletAddress, nftAddress) {   try {        return true || false   } catch (error) {     console.error("Error getNft wallet:", error);     throw error; //  throwing a bug   } } help me do it, l'll pay 10$

Glen: Does this parallel processing also include validation? (reply to 44113)

🅰🅻🅰🅽: In our design, the multicall feature only functions as a job scheduler that allows for the execution of multiple coroutines simultaneously.  The underlying  parameter and return value validation is adapt in all api we provided with supported by Pydantic.  It is important to note that exceptions are treated as results, meaning that if an exception occurs in one of the jobs, it will not cancel the entire batch of jobs. Therefore, it is the responsibility of the user to handle exceptions individually for each result obtained from parallel executions. (reply to 44117)

— 2024-02-18 —

Salmono: thanks!!! (reply to 44102)

User<5677571362>: I want to send TON to the user Which interface implementation should be used in V2 API?

User<5677571362>: v2/wallet/auth/proof Is it this one?

r0uted (@slicebots): Where I can get testnet tokens ?

&rey: Do you understand what is stored in blockchain and what API provides? (reply to 44120)

&rey: Or do you rather think of TON as money storage with fancy words?

Dmitry | backend4you.ton: @testgiver_ton_bot (reply to 44122)

Barin: Hi guys!  I'm happy to announce we released GameFi tools for Phaser game engine and, tutorial article and Flappy Bird demo game. If you are interested in the topic, please check out the links:  - https://github.com/ton-org/game-engines-sdk/ - https://docs.ton.org/develop/dapps/tutorials/building-web3-game - https://github.com/ton-community/flappy-bird  We will be happy to hear from you!

Maryam: Hi guys 🌸, I am a freelance iOS developer, just looking for a project now. Feel free to reach out if you need a mobile developer for iOS applications.

Barbell: Hi guys anyone has example how to store dictionary in dictionary in func?

— 2024-02-19 —

Aron: Hey guys, are there any tools or methods available that allows us to accurately precalculate the fees for executing a smart contract transaction?

Barbell: so SC A -> stored dict which holds ref -> SC B with dict (reply to 44133)

Barbell: if I understand correctly

botmother: Hi, does anyone know how to use ton core js to sign and transfer jettons? I got mnemonics in my code, so i just want to sign and transfer directly without having to approve in CLI

&rey: You can use dict_set_ref, if inner dictionary is always non-empty. (reply to 44132)

Barbell: do you have simple example? (reply to 44138)

Barbell: I will try (reply to 44138)

Behrang: Here I have a 256-bit dict (bucket) inside a 112-bit dict (sorted):  https://github.com/HipoFinance/contract/blob/ba7ede1aadd25b42a69ea9ef3e16147957fab1ba/contracts/treasury.fc#L605 (reply to 44132)

Behrang: I used a custom method to calculate gas units in test cases, then use those values inside the code itself:  https://github.com/HipoFinance/contract/blob/ba7ede1aadd25b42a69ea9ef3e16147957fab1ba/contracts/imports/constants.fc#L146  You have to check the way test cases work. (reply to 44134)

Barbell: how to debug or log error in smart contract ton?

Daniil: What tools are you using? (reply to 44144)

Barbell: blueprint

Barbell: connected to TonKeepr

Barbell: blueprint (reply to 44145)

Daniil: Then you can write tests there easily with sandbox!  But if your question is about an already completed transaction on chain, you can check the details of its execution at tonviewer.com (reply to 44148)

Barbell: ok cool cuz I am trying to store dictionary inside dictionary

Barbell: and it's not working

Yuri: Hello, do we have any working/recommended price oracle provider?

Milad: hi everyone. i have a question about a transaction: this transaction was sent and it shows Success: https://tonscan.org/tx/3qpbwmboxjzCHZEY0sdCfQUM1Ob%2FwPrGWvP22ks2ZqM=  but after some hours ton blockchain sent the amount back to the wallet: https://tonscan.org/tx/29Na-auiWfwKtze0J2fkBkkf2pVrP2D67tkUQxM7kaE=  when i checked the output transaction of the sent transaction it shows Failed: https://tonscan.org/tx/by-msg-hash/b_xoLOyg8X5hYd8x__o_CedF3teq7CvQxgdlqG37xE8=  what happened exactly? what is the problem? thanks

Dmitry | backend4you.ton: https://tonviewer.com/EQDcXBFF9d1PZApvfbAufiNEfzqzfqOL_66nUN1PoTEQmYuT  tx from 17 feb "failed" because there was no wallet deployed. so incoming msg failed to process and due to no "bounce" flag set - TONs stays at destination. yesterday somebdy deployed v3wallet at that address and send instruction to send TONs back (reply to 44154)

User<5461251803>: Is there an OS version of the jettons standard with pause and blocklist functionality?

Milad: Yeah. The bounce flag was false.  As i know if i want to send value to an address that already is inactive i should use bouncable=false. Here I don't understand why the transaction failed. (reply to 44155)

Dmitry | backend4you.ton: because there was no program code to run (no wallet -> no code) (reply to 44157)

Daniil: Hello everyone. During the unpacking of the archive dump, the error occurs:  latest.zfs.lz: Bad header at pos 1556013505155 cannot receive: failed to read from stream  The dump is from last week. Are there any options, or should I download a new dump again?

Milad: Got it. Thanks (reply to 44158)

Вадим: Hi! Do I understand correctly that after receiving the BOC, the transaction was sent to the blockchain and will be confirmed in the near future? Could a situation happen that after receiving the BOC, the transaction will be rejected and not added to the blockchain? https://docs.ton.org/develop/dapps/ton-connect/transactions#2-sending-the-messages

&rey: It can and quite regularly happens. For instance, if validator forming the block doesn't get the message, or if block is already full. (reply to 44161)

Вадим: Thank you! 🙏 (reply to 44162)

Milad: I have another question now :)) As you see in my first message the output of the transaction is Failed. So the amount should not be received by the destination. But as a result of your answers the amount received and the destination wallet owner sent it back manually.   I think because the transaction failed so it was the blockchain that sent the amount back. not the owner of destination wallet. Could you clearify it please? (reply to 44158)

Milad: The transaction logs are here (reply to 44154)

Dmitry | backend4you.ton: blockchain decides send or not failed tx fund back by looking into bounce flag of incoming message if "bounce=true" - TONs will return back to sender if bounce=false - TONs will be kept at reciever's address (reply to 44164)

Dmitry | backend4you.ton: and in your case, later, owner of wallet deployed wallet and gave new/separate instruction to send TONs from his balance to other account.  "Accidentally" to account that tons arrived from, but he/she may send to any other account too

Ra: hi, i want to know more about the ownership rights that token creators have on ton.

Greg: Where can I view the source for a given contract?

&rey: On tonscan.org / verifier.ton.org. (reply to 44169)

Baine: Hello

Baine: Im working on a buybot, how can I add custom emojis to it? Its currently not able to

&rey: Update name, description, decimals, image, mint additional jettons. (reply to 44168)

&rey: How is that related to TON? If it's not, I'll have to delete the message second time. (reply to 44173)

Baine: Well

Baine: I read you have to register your telegram name via TON as a collectible

Baine: Hence why I ended up here

Baine: But I didnt know if that was correct, sorry if I am at the wrong place

&rey: Yes + upgrade it for usage with bots. That costs 5000 TON so I doubt that's really worth it. (reply to 44177)

Baine: Thanks for your answer, can you send me a link to this info?

Vahe: Hi guys, is there anyone who knows how to serialize the params argument properly? Let's say for tuple (int, address).  ton-lite-client , params, buffer cannot deserialize parameter list boc: [Error : 0 : cannot deserialize bag-of-cells: invalid header, error 0]

Vahe: Found the solution by accident, so you guys can use it. there is a function called "serializeTuple" from @ton/ton Use that, it will serialize the tuple by types and give you the cell, convert it to boc (.toBoc()), thats it. Peace!

Carlos: Hi guys. I have been working to send transactions from TON with TonClient for NodeJS. Actually is working, send transactions but some times take a while or just keep sending but not finish never. So, exist one way to return the hash or check if the transaction was sucessfully even if the SEQNO not upload.

Carlos: Im looking for send multiple transactions from a single wallet

Barbell: is here any TON SC dev who is keen for some collaboration?

— 2024-02-20 —

Aron: Does anyone have experience using the checkDataSignature? (Tact)

Aron: I have also attached how we encode the data, which we can verify that it works

Alexander: fragment.com/about (reply to 44181)

J: Is any oracle  on Ton that can fetch data from APIs and perform custom computation,like Chainlink Functions?

ℝ𝕒𝕒𝕊: hello is there any test net for making jetton on ton ? https://minter.ton.org/ this wont switch to testnet

Howard: @pcrafter I think using .storeBuffer is not efficient tho? (reply to 44188)

&rey: Do you know of another way doing the same? (reply to 44196)

Howard: oh, was thinking the String storing. Never mind.

&rey: https://minter.ton.org/?testnet=true (reply to 44194)

Ihor: Hi, how the explorer understands the name of op_code? For example in this case op_code is in human readable format

Vahe: There is a predefined list of possible values, probably (usually you can name everything under an opcode) or they parse it from the verified contract code for more accurate names, imho (reply to 44201)

Ihor: Thanks, do you know by any chance where could be such list? (reply to 44202)

Vahe: Nope brother, cant recall an api/resource providing that, you can find only the ones which are documented in TEP's, or source files (reply to 44203)

Ihor: Got it, thanks for quick reply! (reply to 44204)

🅰🅻🅰🅽: I have a question about the message hash, how can i compute it?  https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees

🅰🅻🅰🅽: here is an (b64 encoded) version message hash, that gerates from tonpy python module, however, if i'm using tonconnect, i cannot retrieve the message hash. PyTonconnect only returns the encoded version of BOC while sending transaction

Denis: nice TUI. what is it? (reply to 44207)

🅰🅻🅰🅽: this is our package in python, named pytoncenter, here is the example for the usage  https://github.com/Ton-Dynasty/pytoncenter/blob/main/examples/v3/get_tx_trace.py (reply to 44208)

Dmytro: Hi. Is there any restrictions per IP when using public liteservers?

Kirill: Hi,  1) Who can explain in simple language how TON is better than SOL? I will be grateful.  In the comparison document on ton.org It is said that Solana gives up to the limit of its capacity at some stage to process the number of transactions per second.As far as I understand, Solana should stall at some point, and TON should fulfill the theoretical promise of covering more than 1M transactions per second.  Link to the document - https://ton.org/comparison_of_blockchains.pdf  2) What other technical aspects of TON prevail over other blockchains?

Denis: c := boc.NewCell() c.WriteUint(100500, 32) c.ToBocBase64() (reply to 44213)

Denis: tonutils-go or tongo

Denis: both library has example directory

Denis: https://github.com/tonkeeper/tongo/blob/master/examples/wallet/simple_send/main.go

Denis: yes

Dane: Hi all! Does anyone know how to write a contract that sends Jettons to a wallet when triggered?

Denis: no. .Send() already have connections inside

Nxrix: Is there any js example of generating wallet seed phrase?

🅰🅻🅰🅽: https://github.com/Ton-Dynasty/ticton-playground/blob/3d38c79b443be6269594c5116543c5ed9386ef39/main.py#L80-L97 (reply to 44232)

🅰🅻🅰🅽: here is an example of generating mnemonics in python

🅰🅻🅰🅽: you can simply run python3 main.py and choose option 0

Nxrix: I wanted js but thanks better than nothing 😂🤝 (reply to 44234)

🅰🅻🅰🅽: https://github.com/toncenter/tonweb-mnemonic (reply to 44236)

🅰🅻🅰🅽: here is an example for typescript (reply to 44236)

Nxrix: Thanks (reply to 44238)

User<5677571362>: Is there any comparison https://ton-blockchain.github.io/global.config.json A faster address? Or can we use the local file JSON?

Greg: Question for you guys... I see sometimes -1 workchain and sometimes 0 updates on masterChainInfo. Am I correct in assuming for any smart contract to update its state on mainnet would require a new roohHash for workchain 0? (And I can safely ignore -1, which I assume is related more to internal validation/non contract stuff?)  e.g. that is the smallest level of resolution for anything on the network to change.. requires a new block with workchain 0 update and I can measure this with a roootHash change? or maybe simply the seqno associated with masterchainInfo.last?

User<5677571362>: https://github.com/tonkeeper/tongo/blob/master/examples/liteapi/main.go   How is this locally loaded configuration file used? I don't see any explanation in the example  options, err := config.ParseConfigFile("path/to/config.json") client, err := liteapi.NewClient(options)    This writing is incorrect

User<6601463160>: hi, does anyone need a dev?

TON Answers Bot (not AI): Transaction not reflecting on Exchange  from Oxconqueror  i sent a transaction from my telegram wallet to an Exchange wallet but forgot to Comment, the transaction is not reflecting on the exchange wallet, is there a way around it or the funds have been lost.  🔗 Answer on TON Overflow

— 2024-02-21 —

Acmos @thesonicsociety: If I'm fairly new to programming and wanna dapple in telegram mini apps do I just need to learn JavaScript to be well equipped?

🅰🅻🅰🅽: Is there any coverage tool in blueprint? I have tried using https://github.com/tact-lang/ton-coverage for testing but it doesn't generate any coverage file

Anton: Can you please open an issue here? https://github.com/tact-lang/ton-coverage/issues Please provide some instructions how to reproduce your issue (reply to 44248)

Bear: hi how can we fetch the amount of holders for a Jetton token?

Bear: 💀 (reply to 41539)

Bobby: Halo

Bobby: how to calculate address checksum

Bobby: I tried CRC16-CCITT write in java ,but result seems not right.

Andrey: Introducing @liteserver_bot: Your Gateway to Enhanced LiteServer Performance!  🚀 Supercharge your applications with our private lite channels!  Experience seamless performance with our cutting-edge auto ADNL balancer and read-only LiteServers, ensuring your applications stay up-to-date and stable even under heavy TON user traffic.  But that's not all! Stay tuned for upcoming features like auto message delivery and seamless integration with dton.io <> LS for proofs for get_nft / get_jettons requests.  Stay in the loop! Subscribe to @dtonforum for exciting updates.  Ready to elevate your application's performance? Enjoy a special 5% discount on our 12-month RPS rate. Act now, only at @liteserver_bot! 😜 (forwarded from dTON Forum)

MS: I wonder something. I made a create bag. I did it in add-by-hash. But storage contracts do not appear in the storage provider. Why is this so?

Shahboz: What api is there for the bot to know the price of jettons

TON Answers Bot (not AI): MultiSender on TON is any simlar app? from Paul  Is there an application to send tokens in bulk ? Like multisender.app but on TON  🔗 Answer on TON Overflow

Carlos: Hi team, any idea about how validate a trx after send? The Seqno + 1 not works because I need send bulk transactions

User: send it with random hash comment and then parse txs from destination wallet and try to find yours (reply to 44261)

Carlos: Nice idea, I will test. Thanks (reply to 44263)

— 2024-02-22 —

MS: How can I save and retrieve files to the storage provider with js client?

🅰🅻🅰🅽: Is there anyone familiar with TVM mechanism? I wish to know whether I can get the message hash from signed BOC or not. If so, how can i achieve it? (reply to 44206)

Danny: Good morning, please I need help on how I can deploy a jetton fungible to testnet/mainnet

🅰🅻🅰🅽: you can simply deploy your own jetton wallet by our repo, just type yarn start  and select the deployJetton.ts then you can get your own jetton contract.  https://github.com/Ton-Dynasty/tondynasty-contracts (reply to 44269)

Danny: Thanks

MS: Hello, How can I save and retrieve files to the storage provider with js client?

Nikita: good day. can someone give me a tip where to dig - https://ton-community.github.io/tutorials/01-wallet/ , 1 script to get address of a wallet via mnemonic . script gives me wrong address but mnemonic in it correct ( logoff and logon via it)

MS: https://answers.ton.org/question/1557066904865083392/  how can i did it  @pcrafter Where did provider come from?

&rey: I believe it would be more use to ping someone who knows rather than one who does not. (reply to 44277)

MS: Aren't you from the support team? (reply to 44279)

&rey: No, I'm just moderating the chat. Actually, I am a developer on TON but never used storage-provider. (reply to 44280)

MS: Isn't this group a place established to support developers? Don't you need to support everything? I couldn't find an answer to all the questions I asked. (reply to 44281)

Vahe: We are all developers as you, and everyone participates in community development as much as they can (reply to 44282)

Vahe: Moderators just keep the chat clean

Vahe: no-one owe anyone anything, just keep in mind

Sol: Hello, I'm seeking an English-speaking company for further practice, work, and growth opportunities

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: maybe this can help you:  https://github.com/alefmanvladimir/BigFiles (reply to 44274)

Frosiva: I get this error for installing tontools: Could not build wheels for bitarray, crc16, which is required to install pyproject.toml-based projects

Sergei: Hey guys, this might be the wrong place to ask, but I'll try:  How can I withdraw TON from KuCoin? it asks me a Memo...

&rey: If you're sending money to non-custodial wallet (Tonhub, MyTonWallet, etc) — or, more precisely, to wallet that is unique to you — you may provide empty or arbitrary memo, it will be used as text comment. (reply to 44291)

Sergei: In this case KuCoin is reverting transaction :/ (reply to 44292)

&rey: Windows doesn't have wheel package for crc16. You may download it from someone who has ported it: https://www.lfd.uci.edu/~gohlke/pythonlibs/.  Or, you may switch to https://github.com/nonam3e/pytonlib library that doesn't have such problems. (reply to 44290)

&rey: Then, some text of your choice. (reply to 44293)

Sergei: I'll try... thanks

Mikhail: Hello everyone, does anyone have problem with different addresses while trying to call state_init for same contract from different files? I have same arguments everywhere and all contracts are importing from one file.

N8: Hey there! How can I go about finding Ton devs?

Sol: The developers of the ton token themselves? Or the developers of the open network? (reply to 44298)

N8: Open network. Like devs building projects on top of ton (reply to 44299)

Sol: I'm undergoing paid training from the developers at the moment (reply to 44300)

N8: Can you shoot me a DM? (reply to 44301)

N8: Tried sending you one but won’t let me

— 2024-02-23 —

MS: We are not playing games here. We are trying to find support for our problems. (reply to 44285)

MS: We are a data center. We decided to run Ton Storage Provider in one of our departments. We ran it on testnet. However, we want to prepare a UI accordingly and provide decentralized data storage service to our Customers on mainnet. Where can I find more institutional support? (reply to 44281)

Андрей: it would be better to wait for a ready-made tool that will install and configure the storage environment ton-storage (reply to 44307)

Д: How to decode boc in_msg -> message_content -> body?  Got this hash: te6cckEBAgEAiAABmq+nfoUDtg0DQjmVoblUSPjIvXx6cBvM7anbn/WY4qz7aYMZHmdZAhENyUKaxqt8Gx6xCd7j2gEVgPD1Q1ABvQMpqaMXZdYy7AAAACQDAQBsQgBpKPVY3sD/FQTLdC7iXXUiX6joY0JEwYqjLNM8wHX4djALHh8tgAAAAAAAAAAAAAAAAAAA7XVayQ==  And need to get a sequence number of a wallet v3 transaction

Daniil: It’s not a hash but BOC. You can decode it using any library that is made for interactions with TON (reply to 44309)

Д: Could you please send the example in any language? (reply to 44310)

Daniil: it depends on what are you expecting to see in that body. (reply to 44311)

Mikhail: Hello everyone, contract dropping me 135 exit code, nevertheless i have init.code and init.data attahed to call

&rey: 135 exit code is custom, meaning problem is with processing of the incoming message. (reply to 44313)

Mikhail: basically it's autogenerated with tact, but       135: { message: Code of a contract was not found },

Д: For example I have this transaction: https://toncenter.com/api/v3/transactions?hash=6iKtf5GfVyFPtV7xvp7JrCZ7_uNouvSrh7FPh3lZjPw%3D&limit=2&offset=0&sort=desc  That is a wallet v3 r2 contract that sends message to transfer some TON. When you are sending TON using wallet v3 you need to specify seqno (sequence number) for each transfer and increment it for the next one.   I need to somehow get that seqno from transaction. (reply to 44312)

Daniil: Why do you want to get the seqno from transaction? (reply to 44316)

Д: I have a payment processor that is sending TON withdrawal. I need to match that specific transaction to a withdrawal. I can also determine it by source, destination and amount. But if I'll have 2 same transactions with the same amount I won't know which one is which.   I also could store a message hash that I am getting after sending boc, but the server can return 500 and send transaction for example. Then I won't have the message hash, so I need a backup plan to be shure that this transaction with this seqno is for that exact withdrawal. (reply to 44317)

Д: Как-то так)

Daniil: Well, you can take the in_msg body of the transaction, skip first 512+32+32 bits and the next 32 bits will be the seqno. (reply to 44318)

&rey: By the way, taking first 512 bits would be better — that's signature, which identifies both seqno and transfer details.

Д: example_transaction https://toncenter.com/api/v3/transactions?hash=f0mrTn2dK1rp2gIn11f1NEgp_ctZT9aeruNrJv6Wflc%3D  seqno should be 9  from base64 import b64decode  data = b64decode(     'te6cckEBAgEAkAABmtoAn2TwajcHs+/qAJCGJdxGlmMMDUqWbpSr9CdppQMp3WY2hkgLzLdC+on9uamXYKJHXP92wpQ+Dy6uGKOkhAMpqaMXZJQKngAAAAkDAQB8YgBkfUxOc+ilDn1RTgCqV3wvKyuS2zQ1SwxHYXBhNzjcISAUBvQAAAAAAAAAAAAAAAAAAAAAAABzdHJpbmd/NYJ1' )  offset = 512 + 32 + 32 bytes_skipped = offset // 8  seqno_bytes = data[bytes_skipped:bytes_skipped + 4]  seqno = int.from_bytes(seqno_bytes, byteorder='big')  print(f"Seqno: {seqno}")  Seqno: 413377668 (reply to 44320)

Д: or I am doing it wrong

Daniil: Install some Python library for ton like “pytoniq” and create Cell object from the original BOC (reply to 44322)

Д:  from pytoniq_core import Cell  body = 'te6cckEBAgEAkAABmtoAn2TwajcHs+/qAJCGJdxGlmMMDUqWbpSr9CdppQMp3WY2hkgLzLdC+on9uamXYKJHXP92wpQ+Dy6uGKOkhAMpqaMXZJQKngAAAAkDAQB8YgBkfUxOc+ilDn1RTgCqV3wvKyuS2zQ1SwxHYXBhNzjcISAUBvQAAAAAAAAAAAAAAAAAAAAAAABzdHJpbmd/NYJ1'  cell = Cell.one_from_boc(     body, )  print(cell)   616[DA009F64F06A3707B3EFEA00908625DC4696630C0D4A966E94ABF42769A50329DD663686480BCCB742FA89FDB9A99760A2475CFF76C2943E0F2EAE18A3A4840329A9A31764940A9E0000000903] -> {   496[6200647D4C4E73E8A50E7D514E00AA577C2F2B2B92DB34354B0C476170613738DC21201406F4000000000000000000000000000000000000737472696E67] } (reply to 44324)

Д: Still don't get how to find that seqno🥲

&rey: .begin_parse() (reply to 44325)

Д: same result  616[DA009F64F06A3707B3EFEA00908625DC4696630C0D4A966E94ABF42769A50329DD663686480BCCB742FA89FDB9A99760A2475CFF76C2943E0F2EAE18A3A4840329A9A31764940A9E0000000903] -> {   496[6200647D4C4E73E8A50E7D514E00AA577C2F2B2B92DB34354B0C476170613738DC21201406F4000000000000000000000000000000000000737472696E67] } (reply to 44327)

Д: @classmethod     def one_from_boc(cls, data: typing.Any) -> "Slice":         boc = Boc(data)         cells = boc.deserialize()         return cells[0].begin_parse()  It was already parsed

&rey: cell.skip_bits(512 + 32 + 32) print(cell.load_uint(32))

Д: from pytoniq_core import Cell  boc = 'te6cckEBAgEAkAABmtoAn2TwajcHs+/qAJCGJdxGlmMMDUqWbpSr9CdppQMp3WY2hkgLzLdC+on9uamXYKJHXP92wpQ+Dy6uGKOkhAMpqaMXZJQKngAAAAkDAQB8YgBkfUxOc+ilDn1RTgCqV3wvKyuS2zQ1SwxHYXBhNzjcISAUBvQAAAAAAAAAAAAAAAAAAAAAAABzdHJpbmd/NYJ1'   def get_seqno_from_boc(boc: str) -> int:     cell = Cell.one_from_boc(boc)     seqno = cell.begin_parse().skip_bits(512 + 32 + 32)     return seqno.load_uint(32)   print(get_seqno_from_boc(boc))  9   Now it's working 🥳

— 2024-02-24 —

Amir: Hi, what is the main reason that most exchanges use memos for depositing Toncoin? I think it's for the storage fee of the wallet. Is there anything else?

Behrang: Implementation wise, it's easier, since there is only one wallet for the exchange and all deposits are sent to it. Also, the exchange needs to maintain only one private key, and pay once for the storage rent of wallet.  Using different wallets for each user is harder, since they have to track many different addresses, and pay for storage of different wallets. (reply to 44333)

AdiSuyash |: Hey TON team, I saw a recent opening for the role of Community Manager TON in India, I would love to apply for the role. Please let me know about further steps how may I apply for it.

Rongxin: Hi all - curious if there will be any TON events at Eth Denver this year?

Javad: Is there document about deep link for telegram wallet ?

Bazamfare M: Please can I get back my assets back, which I sent to wrong address

&rey: All transactions in blockchain are final. If you sent assets to someone other, you may ask them for return; if to some contract, you are unable to do anything with that. (reply to 44338)

Bazamfare M: Thanks (reply to 44339)

Aydin: By wrong address, do you mean that the following code fails to work properly?  const key = await mnemonicToWalletKey(mnemonic.split(" "));   const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });  Please provide more details, and please double-check your code. Maybe you have done a mistake? (reply to 44276)

Nickolay: how can i write this code on tact?        cell.refs[0].beginParse().loadStringTail()

TON Answers Bot (not AI): send JETTONS via @tonconnect/ui or @tonconnect/sdk from XDurex  Please tell me how to transfer tokens without privatekey, I found only such examples in the documentation.  const transaction = {  validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec  messages: [   {    address: '<???>',    amount: 10000000,    payload: <payload ???>,   },  ] } const result = await connector.sendTransaction(transaction);   I tried for a long time, substituted different payloads according to examples, different addresses (tokens and wallets), still nothing works, error - Failed to verify the transaction.  🔗 Answer on TON Overflow

— 2024-02-25 —

&rey: cell.beginParse().loadRef().beginParse().asString() (reply to 44342)

&rey: though you'd better not cast slice to string (you can do more things with slice), so .asString() is not needed.

Handsome: Development is not only about numbers and bootcamp, it's also about making people aware that we exist.

User<6797487887>: Is it possible to retrieve contract revoke and lp burn/lock through on chain data?

Daniil: there's no such thing in jettons (reply to 44362)

User<6797487887>: What do you mean. It is possible to revoke the ownership right? So the jetton contract would be a dead address  So my question is more is it possible to get the owner of a jetton address through on chain data (reply to 44363)

Daniil: you mean the admin of jetton? (reply to 44364)

Daniil: there is no such operation in default jetton minter contract. but it's possible to do via merkle proofs of an account state (however, it requires offchain computations) (reply to 44364)

User<6797487887>: Yes indeed (reply to 44366)

User<6797487887>: Hmm okay all clear. Do you by any chance know services provides this? Same for lp burn/lock? (reply to 44367)

Daniil: provide what? you can check all the info through explorers like tonviewer.com (reply to 44369)

User<6797487887>: Provide through an api or service. Ofcourse tonviewer does it’s job. But automating it (reply to 44370)

Frosiva: I fixed it by running this command: sudo apt-get install python3.12-dev (reply to 44290)

Howard: does anyone using the Expand Network API before?(https://docs.expand.network/integrations/blockchain/non-evm-based-chains/ton

IndexCorp: Hello everyone! Does anyone know if there is a bot that adds to a chat or group after checking the presence of NFTs from a collection?

Bear:     if (~ builder_null?(payload)) {

Bear: where can I import or found the builder_null?

Leyla: Hello, how can we get the NFT of this collection?

— 2024-02-26 —

Bobby: Halo~ a issue about api-v2 ,/v2/blockchain/masterchain/{seqno}/transactions works but /v2/blockchain/transactions/{txid} does not work

daniel: is delegate and undelegate function not supported by ton ledger apps ? when is it expeced to be supported ?

&rey: Not until meaning of that operation and its application to TON is established. (reply to 44388)

Frosiva: I want to connect to LsClient with an HTTP proxy.

Harshul: This group is for?

عبد الرحمن: Ton Dev (reply to 44391)

Andrey: We think of providing websoket proxy in @liteserver_bot  Take a look to https://github.com/ton-core/ton-lite-client (reply to 44390)

Phúc: Hello, How can I transfer TON testnet money on telegram wallet?

Manuel | CM: testnet money isn’t real money (reply to 44394)

Phúc: I want to test the send_tx command, is there any way?

Ronnie 3.0: What are the requirements for being a validator on TON And what are the rewards Plus and related information

Manuel | CM: Call for Network Validators to get in contact The TON blockchain is experiencing reduced performance now due to a backlog of transactions in the queue to be validated. We’ve received a response from many validators on the network who have already upgraded using the patch provided this morning.  However, there are still some we have been unable to reach. We need to collect the machine specifications from all validators to progress the upgrade as quickly as possible. If you maintain a TON validator node, please get in touch with us urgently so we can resolve the network performance issues.   You can reach the team via this google form. If you know someone who maintains a validator node on TON, please also feel free to forward this message. (forwarded from TON Community)

Manuel | CM: kindly read this @mwanjeronnie (reply to 44399)

User<5771046091>: Hey guys, I am looking to build a small project just to learn how TON works. I am wanting to be able to allow a user to come to my website and connect their wallet, and then I can display all the assets they have as a mini portfolio manager. I am currently struggling to grab the assets from my wallet. Does the TON SDK natively support this, or does anyone know any external APIs to do this?

Anastasiia: /v2/accounts/{account_id}/jettons is probably what you are looking for. https://docs.tonconsole.com/tonapi/api-v2  Or using ton api sdk  import { TON_API } from '@config'; import { HttpClient, Api } from 'tonapi-sdk-js'; import { environment } from '@config';  const httpClient: HttpClient = new HttpClient({  baseUrl: new URL(TON_API).origin,  baseApiParams: {   headers: {    'Content-type': 'application/json',    Authorization: `Bearer ${environment.TON_API_KEY}`,   },  }, });  const tonApiHttpClient = new Api(httpClient);  const data = await tonApiHttpClient.accounts.getAccountJettonsBalances(address); (reply to 44402)

Иисус: Hi everyone! Who familiar with ton sites?  How to use proxy to open site in ton network?  I don’t found any good documentation with explanation for this

Dmitry | backend4you.ton: 1) install proxy or get address:port of already installed  2) setup your browser to use that proxy (http) 3) open http://foundation.ton or other  * make sure you open via http://, not https:// ** some ton sites may be hosted in TON Storage. Make sure your proxy can open such sites. (reply to 44404)

Иисус: I guess I tell wrong  I wanna deploy own site (reply to 44405)

Dmitry | backend4you.ton: For static unchanging site you may deploy to TON Storage. You’ll get “bag id” (address of your storage container).   For other sites you need to “traditionally” host it via nginx/other http server and install http-adnl proxy to make your site available in ton network.   Next, use dns.ton.org to put either bagid or adnl address of your proxy to your *.ton dns nft. (reply to 44406)

Иисус: Ton proxy should follow traffic on nginx port where they listen? (reply to 44407)

Иисус: 127.0.0.1:80  And nginx listen 127.0.0.1:80?

&rey: You have accidentally tapped into one of the hardest problems. Users can have many different assets: 1. TON (the only asset balance of which you can find out with one request to blockchain); 2. NFTs, for which they are owners; 3. NFTs in sale contracts, which can be cancelled by the user; 4. cNFTs, not yet revealed but which can be claimed; 5. Jettons in jetton wallets for which the user is owner; 6. Funds reserved as collateral in certain kinds of contracts, mainly The Elector, to which they can lay claim; 7. TON-20 inscriptions: token-like things with zero onchain guarantees; 8. and possibly yet more. (reply to 44402)

&rey: tonconsole.com is almost certainly the most advanced service at loading those all, and that's one of the reasons for it to have paid tier. You may also be interested in dton.io/graphql.

User<5771046091>: this does not seem to be returning the native ton they have (reply to 44403)

&rey: It doesn't return that, since TON isn't actually a jetton. That's covered by a separate request, /v2/accounts/{account_id}. (reply to 44412)

User<5771046091>: yeh had to get familiar on the terminology first (reply to 44413)

User<5771046091>: anyone now why I am getting failed to calculate fees when trying to send ton?

&rey: In Tonkeeper? @subden, the bug is happening again... (reply to 44415)

User<5771046091>: yeah, tonkeeper. I am using tonconnect/ui (reply to 44416)

User<5771046091>: can I not manually get the current gas and set it on the transaction object

Denis: can you describe how i can reproduce it?

Nikola: Hi guys, i have a dev question regarding TonConnect's sendTransaction. Is this chat a place where i can ask such questions?

Gunnar: this wont help if you have tuples from a get-method call - but I made this little tool for pulling apart BoC pieces (it's very much work in progress, but kinda useful already!)   https://bakkenbaeck.github.io/ton-biology-lab/ (reply to 44183)

Andrey: Wow, looks cool. Will be fun to add tlb => ui provider (reply to 44422)

Gunnar: yes - I was thinking about that ... ONE day ;) (reply to 44424)

Kenny$$Shillz: I don't think telegram wallet has testnet support (reply to 44396)

Denis: https://polyprogrammist.github.io/tlb-editor (reply to 44422)

Gunnar: wow! (reply to 44429)

Milad: Hi everyone, i have a question. i sent ton coin from an address to other.  this is the message hash of the transaction: https://tonscan.org/tx/7o%2FHJWAgnMShgWq6kMVIPZVmEmrNSSdYu0CTRTLMSKw=  as you see the Status is Success. but when i look at the out part of the transaction it shows Failed: https://tonscan.org/tx/by-msg-hash/uQXihJTzBFm-8i3bumIWC46Tn-Y_no_OWpSkqOLVOHU=  but amount received by destination: https://tonscan.org/address/EQDbud36o49gRgIy0sRkBu_GDIT4zF6eVANKWIoiSyinkDF1  what is happening here? why it shows Failed? how to solve this problem in my transaction building code?

&rey: Failed because destination contract, being uninitialized, wasn't able to process the message. Maybe it needed to return money to sender, how would blockchain know? (reply to 44431)

&rey: This proves that "success"/"failure" separation in TON isn't very meaningful, and transactions should be labelled by their effect.

Milad: I know that it is because the destination is Inactive. But i use bounce=false flag to send and keep value in destination. But i dont understand why it shows Failed!! (reply to 44432)

Aydin: A suggestion: now try to activate the destination account first (by sending a tiny amount to somewhere), and then retry sending funds to that activated contract. I guess it won't fail then (reply to 44434)

Aydin: Agree with this 👍  Such "failure" label e.g. for transfers to inactive accounts is even misleading (reply to 44433)

Denis: Does anybody saw explanation about value flow in blocks?

Denis: for example last 10 blocks from blockchain. what is fees_collected in flow?

Daniil: Isn’t fees_collected name self-explanatory? (reply to 44438)

Denis: if you suggest what this sum of all transactions fees in blocks - it' not

Denis: in mTONs for readbility

Denis: so burned looks like 50% of all transactions fees (maybe with messages fee)

Denis: but what is collected and imported

&rey: Imported from shardchains. (reply to 44444)

&rey: Collected looks like masterchain + imported fees.

Denis: no. it's not. transactions in masterchain for elector and config doesn't collect fees https://explorer.toncoin.org/transaction?account=-1:3333333333333333333333333333333333333333333333333333333333333333&lt=44864154000002&hash=db3388aa327952b1fbedd3f5c5b1bcbbfb109b5391a6f39f32e33ea7b81f3558

Milad: I dont have access to destination wallet to activate it :( (reply to 44435)

Seitaro: Do not remember exactly, but something like collected in masterchain is sum of fees collected in masterchain block and all committed shards. So if just sum all fees_collected from all blocks, fees related to creation blocks in shardchains will be counted twice (reply to 44442)

Denis: it's current situation. 1 block in masterchain, 1 in basechain.  and in basechain collected not equal sum of all transactions fees

Seitaro: Transactions fee in this table doesn't count for fwd fee, right? (reply to 44451)

Denis: yes. doesn't count. but usually forward fees less than transactions total_fees

Carlos: Hi team, Im sending transactions from wallet to other with this code but is Slow, I need send more than 100 transactions and many are rejected (Not show errors but the wallet dont receive the TON), any suggestions?  Im sending a custom message to check if the transaction was sent sucessfully

User<5771046091>: async function sendFunds() {   const transaction = {     validUntil: Math.floor(Date.now() / 1000) + 60,     messages: [       {         address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",         amount: backToAidsNumber(1),       },     ],   };    try {     const result = await tonConnectUI.sendTransaction(transaction);     console.log("Transaction result:", result);   } catch (e) {     console.error(e);   } }  this seems to fail to calculate fees (reply to 44419)

Denis: so just sending one TON nft account? (reply to 44455)

Denis: and it stable can't calculate fee for you?

Vladimir: /report (reply to 44456)

User<5771046091>: yeh the code I sent whenever I try to send any amount of TON is cannot get the fees. Idk if I am doing something wrong probs am never used TON before. (reply to 44457)

User<5771046091>: yeah cannot calculate the fees (reply to 44458)

Denis: you have never used ton before but chose best nft collection in ton for example :) ❤️  so maybe you have wrong local time on your PC and when you set validUntil it's already expired?

Denis: if my suggestion was correct please notify me. maybe we should improve ton connect standard

User<5771046091>: My localtime is correct just double checked and even if I set the expire time much higher (1hr) it still fails (reply to 44462)

Denis: interesting. do you have one ton on your account?

User<5771046091>: yeah, I got 5 ton in the account right now.

Mikhail: Hello everyone, for some reason StateInit of one of my contract is returning different addresses when imported in another contract, nevertheless the init args are the same. What could be the problem? I am using Tact.

Denis: can you try web tonkeeper?

Denis: https://wallet.tonkeeper.com/

Denis: you can try it without ton connect first. simple sending 1 ton should run same simulation as signing request from ton connect

User<5771046091>: yeah I am using the extension for tonkeeeper (reply to 44469)

Denis: can you say what server return to the request ?

Denis: also looks like you are from Iran or something like this. do you use vpn?

Carlos: Can you help me to improve the performance to send many bulked trxs? I want send more than 100 simultaneously or sequentially (reply to 44263)

User: you can use highload wallet and pack all of them in one big tx (reply to 44474)

User<5771046091>: I got it fixed for some reason my code was not parsing the balance correctly (reply to 44473)

Denis: so you tried to send more than you have? (reply to 44476)

User<5771046091>: not sure I was trying to convert a whole number into the bits function convertToProperNumber(number) {   return (number * 1000000000); } (reply to 44477)

Tim: What if your number too big (reply to 44478)

Carlos: Is possible to pack all in one big if they will send to different address? You know where I can find info about this? About pack all in one (reply to 44475)

Vitor: Guys, is there any mini apps with range sliders?

Vitor: My app moves app and downd when I try to move the slider

Vitor: I would like the app to stay expanded and just the slider moving in the x axis

Barbell: Hi does anyone know how to query Ton Smart Contract in C# TonNET.SDK

Barbell: I can get wallet but there is no way I can query things

Minter: Hello. how to make a transfer from a wallet knowing a mnemonic phrase using node.js

Barbell: who is in the charge for development of c# sdk I would love to participate if there is anyone here?

Minter: please show me an example (reply to 44489)

Barbell: I've tried to use blueprint with mnemonic seed (reply to 44489)

Barbell: but it's not working as it requires specific wallet version which also doesn't work. I think there is bug.

Barbell: are you trying to use mnemonic instead of the wallet right? (reply to 44495)

Barbell: I've tried the same it's not going to work as it will require specific wallet version with all information which won't work. I tried manyu times. I think there is bug in source code. (reply to 44497)

Barbell: the wallet version doesn't exist

Barbell: or is not matching

— 2024-02-27 —

&rey: @barbell_curl @Grtmen23: please try to combine your thoughts into one message. Yes, blueprint (and @ton/ton) somehow has v4r2 wallet version omitted. That can be called a bug, indeed. Please consider using v3r2 in meantime — after all, it is cheaper.

Barbell: thank you for your feedback. I am still getting my head around the whole TON network and sdk. I think you are right next time I should actually raise PR against this. (I've tried even v3r2.) (reply to 44503)

User<5018886941>: Hello everyone

&rey: nometa.xyz (reply to 44509)

ninja: Hey everyone, I am getting  { ok: false, error: "name 'tonlib' is not defined", code: 503 } From the orbs network RPC, when sending a transaction to the network

Daniil: Hello everyone. I encountered a problem: ValidatorConsole error: Validator console is not settings, even though I installed and ran it as a user without root privileges but with sudo privileges. udi256@ip-172-31-20-162:/var/ton-work/mytonctrl$ sudo mytonctrl [warning] 27.02.2024, 07:13:32.867 (UTC)  <MainThread>  The config file is broken local.db: {'config': {'logLevel': 'info', 'isLimitLogFile': True, 'isDeleteOldLogFile': False, 'isIgnorLogWarning': False, 'isStartOnlyOneProcess': True, 'memoryUsinglimit': 50, 'isLocaldbSaving': False, 'isWritingLogFile': True}} [debug]   27.02.2024, 07:13:32.868 (UTC)  <MainThread>  Thread self_test started [debug]   27.02.2024, 07:13:32.869 (UTC)  <MainThread>  Thread write_log started [info]    27.02.2024, 07:13:32.869 (UTC)  <MainThread>  Start program `/usr/src/mytonctrl/mytonctrl.py` Welcome to the console. Enter 'help' to display the help menu. Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1216, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 106, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 122, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings

Maksim: with what mode have you installed mytonctrl? full or lite? (reply to 44513)

Daniil: full sudo bash install.sh -m full -d by this command

Minter: how to get the wallet address and balance knowing the seed phrase?

Vladimir: Hey guys, has anyone minted an NFT and stored the metadata in IPFS?  If I want to add a new NFT item to the collection, then I need to re-upload the entire directory to IPFS and update the commonContentUrl in the collection contract with a new directory hash, right? If so, is there any way I can do this cheaply by updating only this one field?  I was looking at this instruction https://docs.ton.org/develop/dapps/tutorials/collection-minting

Barbell: Does anyone good github repo for running liteserver with api on testnet and mainnet in docker?

F: This account was banned for misinformation about a supposedly approved survey by the administrator. However, your message about the problem was written to the general chat and not to the administrator with whom you supposedly agreed. According to your messages, you don't even know who the administrator is in the chat. Also, your survey was posted on behalf of a channel with 1 subscriber, which indicates spam or scam.  According to these reasons, your previous, current and future accounts will be banned from this chat for misinformation and subsequent offtopic behavior. (reply to 44528)

Андрей: try without sudo (reply to 44513)

Daniil: without sudo the same

Андрей: then in this case the installation was completed incorrectly. Most likely this is due to the -d flag. Try reinstalling without this flag. Don't forget to uninstall what's already installed before installing it again. bash /usr/src/mytonctrl/scripts/uninstall.sh (reply to 44544)

Bear: how many bits for load_ref()?

Daniil: 0 (reply to 44546)

Bear: Na-ni! (reply to 44548)

— 2024-02-28 —

Daniil: When deleting, the script also deleted the deployed archive dump. I unpacked it again and, while installing mytonctrl in full mode without the -d flag, the same error still occurs. (reply to 44545)

dwusiq: I sent ton to another address, the transaction was successful, but ton automatically returned to the sender

Seitaro: https://docs.ton.org/develop/smart-contracts/guidelines/non-bouncable-messages (reply to 44556)

User<6601463160>: hi, do you currently need a developer?

dwusiq: thank you (reply to 44557)

Bear: 👍🏿 (reply to 36021)

Bear:         let stringHash = 'XdS4iCmspzTqrWVl7JPcZLxJwwgFcA5cAIFvRcS05hg=';         let hash = Buffer.from(stringHash, 'base64');         console.log(hash.toString('hex')); (reply to 36021)

Ha: Hello everyone, how do I subscribe to transfer events?

shubham: Hi guys why does a new token comes as unverified on tonkeeper and how to mark it as verified ?

Vladimir: https://telegra.ph/Unverified-Tokens-in-Tonkeeper-02-01 (reply to 44564)

shubham: page not opening (reply to 44565)

Vladimir: create pr here https://github.com/tonkeeper/ton-assets/ (reply to 44567)

shubham: thanks man

Assasin: Why I am getting error while transaction periodically..  Error  Cannot compute blocks for specified transaction

Void;: what is best package for js to make, login, get assets of an wallet in ton ?

***: Need frontender for 3 hours. Please

&rey: @orbs-network/ton-access + @ton/ton (reply to 44572)

&rey: "...: block with specified lt not in db"? Liteserver you're connecting to isn't synchronized with blockchain. (reply to 44571)

Assasin: I am not using any liye server...

Assasin: But why ..it is sometimes sending the transaction

Assasin: And sometimes the error

Void;: this require pubKey

Void;: so i need to use this one? (reply to 44583)

Mikey: Are there any sample repos on utilizing ton blueprint than just counter?

&rey: Then, are you sending transaction via Toncenter endpoint or some other one? (reply to 44582)

&rey: There's not much to see, you'd better ask for sample repos on @ton/ton. For instance, blueprint is used in https://github.com/HipoFinance/contract/. (reply to 44585)

Assasin: Toncenter (reply to 44586)

&rey: Please try switching to Orbs, maybe it will work better. (reply to 44588)

Assasin: Provide the url please

Void;: error: Uncaught (in promise) Error: WalletContract required publicKey or address in options  ???? generating keys are works, except wallet creation.

Adapt: Hi team. Looks like the installation package of full node is broken to all users right now. Installing on fresh Ubuntu results with:  The config file is broken  There's github issue, not resolved. Above users are complaining as well. Tested with and without sudo. Any chance someone can fix so we can run our own full node please?

&rey: tonweb.wallet.create({publicKey: publicInfo.publicKey}). You have problems with JS syntax. (reply to 44591)

Void;: uhm (reply to 44593)

Void;: this from the documents, sir.

&rey: Package @orbs-network/ton-access, method getHttpEndpoint(). (reply to 44590)

&rey: If you write {someVar} in JS, you get object {"someVar": someVar}. (reply to 44594)

Void;: error: Uncaught (in promise) Error: writeUint: value is NaN (reply to 44596)

Void;: i've print response,   the address is Null.

&rey: tonweb.wallet.create({publicKey: publicInfo.publicKey, workchain: 0}) (reply to 44598)

Void;: none is called in example,  + the intelsense of vscode not give me the required arguments. so (reply to 44600)

&rey: @ton/ton is a better lib with regards to type declarations. (reply to 44601)

Void;: idk,  i want a package that login, create, get assets (reply to 44602)

Void;: so someone mention tonweb.

Void;: is there way to login to wallet using pharses?  or the publickey is a pharses but encoding?? (reply to 44602)

&rey: mnemonic —> key pair —> public key —> wallet object —> wallet address —> can get assets mnemonic —> key pair —> secret key —> can send outgoing transfers (reply to 44605)

Void;: uhm, i see  can this be like programming way? (reply to 44606)

Yuri: Hey guys, architecture wise, what's more desirable in the following scenario: I have a protocol contract that receives a query of one NFT and a response from another NFT. Would it be better to store the code of both NFT items in this contract or forward the messages from each of the NFT collection and just store the addresses of both NFT collections in this protocol contract?

Void;: lol no answer (reply to 44607)

Nxrix: Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF Ef8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAU can someone tell me about those two?

Void;: Looks like ton sleepy (reply to 44610)

Howard: hi community, do we have the website can tack the workchain amount?

Dario: There are only two workchain, -1 and 0 (reply to 44613)

Andrey: https://t.me/dtonforum/10/5932  Not a site, but shard information updated in live (reply to 44612)

— 2024-02-29 —

&rey: Storing items is cheaper. Consider: storing collections' addresses needs to do the same computations + forward a couple of messages. Thus, it is more expensive. (reply to 44608)

&rey: https://docs.ton.org/develop/smart-contracts/governance (reply to 44610)

Dane: Hello! I need a smart contract developer to create this SC + a boilerplate frontend that triggers this SC.  Budget $200  Use case: Player plays game to earn Jettons. Player clicks on "Claim Token" to receive x amount of Jettons.  (let me know where this should be posted if this isn't the correct place)

Andrew: The root of this requirement is, how the contract know whether the *User* is the right user who win the game (reply to 44623)

Andrew: anyone can claim if no winner checklist

Dane: After a wallet is connected, they'll be clicking a button that is enabled when they have something to claim.   Frontend cheating (i.e. populating the parameters) isn't much of a concern at this stage since we're just trying to get to a proof of concept stage.  So at this point it's basically just  1. Send some TON 2. Receive some Jetton

Dane: anyone available to help? Or point me to a good direction?

Manuel | CM: hello (reply to 44627)

UTKARSH: Hi, I need help in confirming txn status ,using @ton/ton library in js  What should be the keys i should check for in an exectued txn body?

shubham: +1 (reply to 44630)

Andrew: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 44633)

Ar: Can anyone tell me what encoing/decoding is used between this osYfhbQkC5LoDDm5piJ1cp7ALKhH_pK-LCbBzYz70kU= and this osYfhbQkC5LoDDm5piJ1cp7ALKhH/pK+LCbBzYz70kU=, both are TX hashes, but the first one was received from TON HTTP API and the other one was found on tonscan.org?

&rey: url-safe and non-url-safe base64. (reply to 44638)

Ar: Thanks (reply to 44639)

Dane: Hi Manuel, would you be able to help with this sc? (reply to 44628)

Kenny$$Shillz: Hey DM me with more details (reply to 44641)

Пескарь™ | фронтент телефонов: не туда (reply to 44643)

&rey: 32 zero bits, then string itself (UTF-8 encoded, snake-positioned — characters that don't fit go into ref). (reply to 44643)

&rey: begin_cell().store_uint(0, 32).store_slice("Your comment") (reply to 44646)

&rey: No, string interpolation isn't available at all. (reply to 44649)

Daniil: You can just encode data to utf-8 (int to str for example) (reply to 44649)

Dario: take a look at this code (its very expansive, use it only for debugging)  https://github.com/ston-fi/funcbox/blob/main/contracts/console.fc#L48 (reply to 44649)

Dario: thats func code my man

Ar: Using @ton/core @ton/ton I'm trying to read inMessage body but gives me error invalid address: 1 when running this code. Isn't the flags, msgaddress, opcode in every message?

&rey: Address isn't in body of the message. It's somewhere like tx.source. (reply to 44659)

Ar: So I should skip reading the address and go straight to opcode? I was trying to mimic the jetton recv_internal handler, assuming inMessage.body is the cell in_msg_full from the code below      if (in_msg_body.slice_empty?()) { ;; ignore empty messages         return ();     }     slice cs = in_msg_full.begin_parse();     int flags = cs~load_uint(4);      if (flags & 1) { ;; ignore all bounced messages         return ();     }     slice sender_address = cs~load_msg_addr();        int op = in_msg_body~load_uint(32);     int query_id = in_msg_body~load_uint(64);

&rey: inMessage.body is cell of in_msg_body. As its name says, actually. (reply to 44661)

Ar: Oh, got it, and just for clarification inMsg from tx is the message that this contract was called with and outMsgs are the ones that this contract emitted to the blockchain right?

Tumin | Wagmi11: Is there a simpler way to calculate gas fee expect for this? https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc   https://docs.ton.org/develop/smart-contracts/fees#calculator-example  This example is cool but I am not a 100% sure on how much data is going to added (reply to 34878)

Tumin | Wagmi11: yes if you are using jest https://jestjs.io/docs/timer-mocks will help you to do that (reply to 30881)

Anton: Introducing TVM Labs — a cloud infrastructure for TVM networks with GraphQL access and TVM SDK  support.  We have developed an infrastructure to ensure optimal performance, stability, and compatibility with TVM networks, including the newest Acki Nacki consensus protocol from GOSH. In collaboration with Venom Foundation and GOSH, we are enhancing our platform and invite other networks to support it. All code is completely open-source and available in the repository.  GraphQL Access for All TVM Networks   We're excited to announce direct GraphQL access to all TVM networks. This feature is supported and maintained alongside the popular TVM SDK development framework. Experience the platform's capabilities firsthand  with immediate  access on our playground.  Find Essential Resources on Our GitHub  For detailed connection instructions and SDK development resources, please visit our GitHub page. All the information you need is readily accessible.  Furthermore, TVM Labs offers customized deployment and support for any infrastructure, tailored specifically to your TVM requirements. We ensure individualized solutions for each client, providing the flexibility and expertise needed to support any TVM network configuration. To launch your own infrastructure or network, please contact us via a corresponding website form: TON, Venom, Acki Nacki, Everscale. (forwarded from TVM Labs News)

Arti: 💎 LIVE SOON (17 CET): @TONSocietyEurope is hosting a community call with Sophi, the Acceleration Program Lead at TON Foundation: https://twitter.com/i/spaces/1ynJOydzllkKR0466377

Ar: How can I locate the transaction the outMsg is executed based on this code? The tryLocateResultTx is not finding it, am I missing something?    const res = await client.getTransactions(Address.parse(addr as string), {     limit: 1,   });   const tx = res[0];   if (tx.inMessage) {     const hash = tx.hash();     const slice = tx.inMessage.body.beginParse();     const op = slice.loadInt(32);     const queryId = slice.loadInt(64);      console.log({       hash: hash.toString("base64"),       op: op.toString(16),       queryId,     });      if (op === 0x25938561) {       const toAddr = slice.loadAddress();       const sender = slice.loadAddress();       const amount = slice.loadCoins();        console.log({         toAddr: toAddr.toRawString(),         sender: sender.toRawString(),         amount: amount,       });     }      const outMsg1 = tx.outMessages.get(0);     if (outMsg1) {       const src = outMsg1.info.src;       const dest = outMsg1.info.dest;        console.log({         src,         dest,         createdLt: tx.lt,       });        // await new Promise((resolve) => setTimeout(resolve, 1000));        if (src instanceof Address && dest instanceof Address) {         console.log(           await client.tryLocateResultTx(src, dest, tx.lt.toString())         );       } else {         console.log("src or dest is not an address", {           src: src instanceof Address,           dest: dest instanceof Address,         });       }     }

Alexey: is there some project which can show my portfolio including deposits to different dapps?

贸易: I want to know why this domain name has expired and why I can't place a bid. I want to get the answer.

贸易: How do I get the first bid on a domain? (reply to 44672)

User<6639351628>: hi, is there anybody looking for a developer?

&rey: because UI doesn't support that. Don't know why, though. (reply to 44672)

贸易: According to the rules of ton dns, the expired domain name will be released and entered into a new auction.

brian: Can I use this for all type of wallets? When I use 'MyTonWallet' and  parse tx using 'getTxHash', It dose not make correct txHash. It works correctly with 'TonKeeper'.  I am using TonConnect of '@tonconnect/ui-react' And I get tx by using const tx = await tonConnectUI.sendTransaction(request) (reply to 36420)

Nxrix: is it possible to make a testnet giver yourself?

Nxrix: also what is the ton dns domain price based on cause it was 80 ton before but now its 60 ton for the one I want to buy

&rey: Not automatically, of course. (reply to 44677)

&rey: You need testnet TON and server which can perform send by secret key. (reply to 44680)

Nxrix: So it is possible to make one for myself and send 5 ton whenever i need? (reply to 44685)

hfr: Hello. Is there an idiomatic way of checking if transaction has failed?  For example I send transaction with some seqno, can't find it in blockchain for some time. How can i check that transaction really failed and i can create new one with new seqno.

贸易: Can you explain in detail what is happening with the expired domain name?🫡 (reply to 44683)

Ar: How can I call on-chain get method on a contract with @ton/ton TonClient class (or other way), and then how can I read the response (i know the response msg body structure)

Ar: Okay i got it almost, but I'm curious why callGetMethod from TonClient is deprecated, wht? (reply to 44693)

— 2024-03-01 —

User<5771046091>: has anyone got documentation for TACT? Wanna write a smart contract where someone can deposit funds but for some reason the documentation does not cover this.

User<5771046091>: https://github.com/toncenter/examples/blob/main/deposits.js - I seen this but this just sends ton to the contract like a normal address I cannot create custom function to deposit like on eth you can have functions to deposit and it will prompt the wallet differently.

&rey: Nothing until it receives an incoming message. (reply to 44690)

&rey: Have you tried runGetMethod? (reply to 44694)

Ar: There is no such a method on TonClient instance (reply to 44700)

brian: hello, I have question with boc  I got boc using '@tonconnect/ui-react' const { boc } = await tonConnectUi.sendTransaction(request) when I log boc it has two types some start with 'te6cck...' and some with 'b5ee9...'  I thinks it depends on what wallet i use.  What is different? (actually the latter occurs error when calling tonapi with hash which parsed from boc)

&rey: No one to my knowledge adapted that to TON architecture. (reply to 44704)

Dhrumil: I have an object as below I want to convert it to cell how do I do in. I am kinda confused... const jettonParams = {     name: 'Best Practice',     description: 'This is description of Test tact jetton',     symbol: 'XXXE',     image: 'SampleUrl', };

Dhrumil: I need to pass it in init for deployment

Ar: It's just runMethod actually, thanks! (reply to 44700)

Sergiu Popov: Hi, folks, how can I send jetton tokens from our @user1 telegram user to another @user2 but from and to the telegram ID?

Ar: Can chain of transations fail due to not enough gas amount?. There is no infinite loop and other malicious stuff, let's take a Ston.fi swap procedure as an example. If so how can I check if it went successfully? Should I follow the chain of txs and check until outMsg array is empty?

&rey: Yes, it can fail. You may check if transactions have brought the expected results. (reply to 44716)

andy: hey, guys what do failed and aborted statuses mean in this transaction? https://tonscan.org/tx/zwrP-HVyIC6rf-ZmcuyaVTygaD5_HsD3bF6kqm-LAkk=

andy: I still do not understand, how to tell if a transaction was a success or not. Sometimes it fails for any kind of reason and there seems to be no way to tell if it did due to everything not having a direct effect.

PetX: Hi

PetX: How to pre-sell NFTs?

Vitor: Hey I am creating a share button on my TWA and used navigator.share() for it. It works perfectly on iOS devices but not on Android.  Is there a way to implement native share for Android devices in a TMA?

Dmitry | backend4you.ton: Transaction is a “transformation” of in-msg to 0 or more out-msg by contract code. So tx is “successful” when code run to completion and all out msg were sent to their destinations. (reply to 44719)

Dmitry | backend4you.ton: But every business process may have its own meaning of “successful”. E.g. withdrawal from exchange to user wallet - tx on receiving wallet will fail if wallet not deployed yet, but if msg had been sent without bounce - coins will stay at user balance even with failed tx. Still “successful withdrawal” from exchange point of view

andy: Ok, that's fine to me. But how to watch/wait for these messages? Since they don't have any kind anchor to the originally sent one. Except, maybe, for body_hash. Which is not unique, in case there is multiple identical messages being sent at once. (reply to 44723)

andy: Please, help with this, as I'm dying on the inside lol (reply to 44724)

andy: I mean I'd like to know transaction hash of my transfer. I cannot know it beforehand, so it must be committed to the blockchain first. But then again, we're met with the ambiguity of success and our inability to tell our messages apart from the rest of them.

Dmitry | backend4you.ton: Maybe idea of memo text that is required by exchanges can help you? (reply to 44725)

andy: I did payload attachments, but these don't always work. For some reason sometimes one message doesn't go thru (maybe because of lack of enough tokens to pay the gas fees), and it just hangs. There is no way to tell, though, that it hung.

Ar: You could use ton http api to locate tx from which msg was sent (reply to 44727)

Dmitry | backend4you.ton: It’s like you send 3 messages, but not all of them appears in explorers? (reply to 44729)

andy: How do you locate the message? I mean except for body_hash, which is not unique for transfers? E.g. you have the same target address, amount, etc. (reply to 44730)

andy: I've encountered a problem, where I sent a message and it didn't go thru for some reason. And every time I send new messages (transfers) from this address, I receive the PREVIOUS message I had sent, and not the current one. (reply to 44731)

andy: And the wallet is "lagging behind" one message.

Ar: https://toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get this method allows you to find the source tx. TX1 -> msg1 -> TX2 - so when you check the tx2, you have inMsg and you can get the Tx1 by this api (reply to 44732)

andy: ok, but you need to know transaction id beforehand? (reply to 44735)

andy: how do you know it?

Dmitry | backend4you.ton: do you use "regular" wallets with seqno? (reply to 44734)

andy: yes (reply to 44738)

Ar: the tx to event begin with right? (reply to 44736)

andy: yes, you send money from one wallet to another, you must wait for tx to commit to get its hash (reply to 44740)

Ar: so you could periodicly run this endpoint https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get and provide on of the wallets

andy: ok, yes, but how do you locate the message, this was the initial question :) (reply to 44742)

Dmitry | backend4you.ton: they require for seqno to be different every time. once you sent body with seqno 123 - wait corresponding external_in msg on you wallet. after that, send new with seqno 124. new tx will have different body hash due to different seqno. (reply to 44739)

andy: this is interesting (reply to 44744)

andy: external_in message on the wallet, from which I'm sending the funds?

Ar: you have them in the response as inMsg and outMsgs  {       "@type": "raw.transaction",       "address": {         "@type": "accountAddress",         "account_address": "EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt"       },       "utime": 1709296559,       "data": "te6cckECDAEAAtkAA7V3edzIFRONlQDkScUpHn8Sc4wj1XW1MQAA9qJTvWBzhOAAAo4tiAMgsZSDszdhQ+68wxQP+2EDIK+bE98SVJYTi0YKlcMkBK+gAAKOLYgDIJZeHLrwADR6YuDIAQIDAgHgBAUAgnLozVy5YD1l4CnxohoBVULbSPxww+HFBVB0AEZtYaoRzlBrnSymxo8mevQjn5lu/nRZi0wrgR2KOAkpuhutLzpfAhUMCQHZFGYYeTv2EQoLAbFIAdrI51qqzT/qhCnVc0ZZ5paY2JpZtEF5XOKjMpiMDOCHAB3ncyBUTjZUA5EnFKR5/EnOMI9V1tTEAAPaiU71gc4TkB2RRmAGLE/YAABRxbEAZBLLw5dewAYBAd8IAWP5O7Q/AAABjfoDoBuADwK4ZuKmR2Wf+NIWzQV7ey/8r26f4Phd92IFDnU5YLbYyG4cuAcAkVA0U4JKGAEPckSDVNSvvmJOKMGCE4qb+zE0NdQGXsIPpYy63RDznBAARULUYsmJq1RiZ+YiH+IJLcAZUVkVff+KBPwEmmaQGH4BsWgA7zuZAqJxsqAciTilI8/iTnGEeq62piAAHtRKd6wOcJ0AIe5IkGqalffMScUYMEJxU39mJoa6gMvYQfSxl1uiHnOQGfsvIAYk3ZQAAFHFsQBkGMvDl17ACQCyD4p+pQAAAY36A6AbUDRTgkoYAPArhm4qZHZZ/40hbNBXt7L/yvbp/g+F33YgUOdTlgttAB4FcM3FTI7LP/GkLZoK9vZf+V7dP8Hwu+7EChzqcsFtgMZDcOUAnkZ1zAeRvAAAAAAAAAABJgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb8mN0xBMJN1YAAAAAAACAAAAAAAD6m91Bl7u/uneVg4JCI0DDElkJhQjLhOYZPgstCzbSbJAkCxMkoUpYA==",       "transaction_id": {         "@type": "internal.transactionId",         "lt": "44954760000011",         "hash": "73ccPVKOV8bm5n+iTQRUJqo1Vg8UiS6oA5ypbL8VWRE="       },       "fee": "15042000",       "storage_fee": "0",       "other_fee": "15042000",       "in_msg": {         "@type": "raw.message",         "source": "EQDtZHOtVWaf9UIU6rmjLPNLTGxNLNogvK5xUZlMRgZwQ4Gt",         "destination": "EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt",         "value": "124015000",         "fwd_fee": "1452012",         "ihr_fee": "0",         "created_lt": "44954760000009",         "body_hash": "5e+d0RJqtvPBSpRgqbyjwKK+bQ/2h2Kx6hmNsavv4GU=",         "msg_data": {           "@type": "msg.dataRaw",           "body": "te6cckEBAgEAgAABY/k7tD8AAAGN+gOgG4APArhm4qZHZZ/40hbNBXt7L/yvbp/g+F33YgUOdTlgttjIbhy4AQCRUDRTgkoYAQ9yRINU1K++Yk4owYITipv7MTQ11AZewg+ljLrdEPOcEABFQtRiyYmrVGJn5iIf4gktwBlRWRV9/4oE/ASaZpAYfnpgZZg=",           "init_state": ""         },         "message": "+Tu0PwAAAY36A6AbgA8CuGbipkdln/jSFs0Fe3sv/K9un+D4XfdiBQ51OWC22MhuHLA=\n"       },       "out_msgs": [         {           "@type": "raw.message",           "source": "EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt",           "destination": "EQCHuSJBqmpX3zEnFGDBCcVN_ZiaGuoDL2EH0sZdboh5zkwy",           "value": "108973000",           "fwd_fee": "1208010",           "ihr_fee": "0",           "created_lt": "44954760000012",           "body_hash": "CyWIxTJ9hTlRGpfMyWfqDMNqE5LNd2XuzML9rQu57bU=",           "msg_data": {             "@type": "msg.dataRaw",             "body": "te6cckEBAQEAWwAAsg+KfqUAAAGN+gOgG1A0U4JKGADwK4ZuKmR2Wf+NIWzQV7ey/8r26f4Phd92IFDnU5YLbQAeBXDNxUyOyz/xpC2aCvb2X/le3T/B8LvuxAoc6nLBbYDGQ3DlbdWFAw==",             "init_state": ""           },           "message": "D4p+pQAAAY36A6AbUDRTgkoYAPArhm4qZHZZ/40hbNBXt7L/yvbp/g+F33YgUOdTlgttAB4FcM3F\nTI7LP/GkLZoK9vZf+V7dP8Hwu+7EChzqcsFtgMZDcOU=\n"         }       ]     },

Dmitry | backend4you.ton: or, take a look at query_id field - its more "universal" since it applies not only to external-in msg to your wallet

andy: please, do elaborate, as I haven't seen anything that said query_id (reply to 44748)

andy: in any response, it seems

Dmitry | backend4you.ton: usually its second field in body, right after op_code

andy: Dmitry actually made a good point that seqno makes the body_hash unique (reply to 44747)

Ar: also you could look at the create_lt as a synchronization value between messages (reply to 44752)

andy: {       "account": "0:70A57B0856B8A3F144363A93CAD84C9E541AE537A9A73A499385BDE4E8AF941D",       "hash": "zwrP+HVyIC6rf+ZmcuyaVTygaD5/HsD3bF6kqm+LAkk=",       "lt": "44952756000003",       "now": 1709289076,       "orig_status": "uninit",       "end_status": "uninit",       "total_fees": "333329",       "prev_trans_hash": "dzzFAV58ZNR6QNqcDg9eWUCpXDJelP+/CGYRX5OK9tM=",       "prev_trans_lt": "44952750000003",       "description": {         "type": "ord",         "bounce": {           "type": "ok",           "fwd_fees": "666672",           "msg_fees": "333328",           "msg_size": {             "bits": "0",             "cells": "0"           }         },         "aborted": true,         "credit_ph": {           "credit": "20739001",           "due_fees_collected": "139723834098144"         },         "destroyed": false,         "compute_ph": {           "type": "skipped",           "skip_reason": "no_state"         },         "storage_ph": {           "status_change": "unchanged",           "storage_fees_collected": "1"         },         "credit_first": false       },       "block_ref": {         "workchain": 0,         "shard": "8000000000000000",         "seqno": 42196745       },       "in_msg": {         "hash": "Xdl6PSgk3g6xqaYgTFH18L4Vrtu7anxNWA9KIzWLMjo=",         "source": "0:0FA9195EC2E96D97CC4708A1ACADE9DBE0F65A4344037CF6282B57F055438375",         "destination": "0:70A57B0856B8A3F144363A93CAD84C9E541AE537A9A73A499385BDE4E8AF941D",         "value": "20739001",         "fwd_fee": "666672",         "ihr_fee": "0",         "created_lt": "44952756000002",         "created_at": "1709289076",         "opcode": null,         "ihr_disabled": true,         "bounce": true,         "bounced": false,         "import_fee": null,         "message_content": {           "hash": "lqKW0iTyhcZ77pPDD4owkVfw2qNdxbh+QQt4YwoJz8c=",           "body": "te6cckEBAQEAAgAAAEysuc0=",           "decoded": null         },         "init_state": null       },       "out_msgs": [         {           "hash": "sFFiX5T+wB1l53p9/DEoPLOUeaSm+yULh8pDiLVd+uY=",           "source": "0:70A57B0856B8A3F144363A93CAD84C9E541AE537A9A73A499385BDE4E8AF941D",           "destination": "0:0FA9195EC2E96D97CC4708A1ACADE9DBE0F65A4344037CF6282B57F055438375",           "value": "19739001",           "fwd_fee": "666672",           "ihr_fee": "0",           "created_lt": "44952756000004",           "created_at": "1709289076",           "opcode": "0xffffffff",           "ihr_disabled": true,           "bounce": false,           "bounced": true,           "import_fee": null,           "message_content": {             "hash": "2kgTJil7CKGfT/jw1tLMcQJ5ngwOSgK6iXnDY6CA2IY=",             "body": "te6cckEBAQEABgAACP/////btDe4",             "decoded": null           },           "init_state": null         }       ],       "account_state_before": {         "hash": "ID6VUc48es26VmqgQfHDDP9XYRuhZ4CSC2wrsd6eRU4=",         "balance": "100000000",         "account_status": "uninit",         "frozen_hash": null,         "code_hash": null,         "data_hash": null       },       "account_state_after": {         "hash": "Osku7uKT4zxbwLh93v5d+BnZhs9c54tlJpoem9xUa9E=",         "balance": "99999999",         "account_status": "uninit",         "frozen_hash": null,         "code_hash": null,         "data_hash": null       },       "mc_block_seqno": 36411255     } Seems to have no query_id? (reply to 44751)

Ar: You will have to read body cell

andy: is there any predefined structure to the bytes blob? how do i know what the cell contains? (reply to 44755)

Ar: those 2 exists always (reply to 44756)

Ar: later there is app specific data

Ar: that depends on the opCode

&rey: Nope, not always. (reply to 44757)

&rey: Both query ID can be omitted by application, and opcode may be shorter than 32 bits.

Ar: oh didn't know that, thanks

andy: god, why is ton blockchain so overcomplicated. does it actually provide any value?

&rey: It's actually completely logical. (reply to 44763)

&rey: Users can send messages with value from their wallets. To message, an arbitrary cell of payload is attached.

&rey: It's a guideline to use first 32 bits for opcode. It's even more relaxed guideline to use next 64 bits for query_id (it could've served to find next transactions in chain, but now it is safer done directly by tx lt).

&rey: Fees are determinstic, unlike in Ethereum, and quite small.

andy: ok, so but query_id is actually something, that can allow us find the ACTUAL message we sent to the blockchain? it seems to be an arbitrary 64-bit bytes blob?

Ar: Is there any faster way of finding next tx by outMsg than reaching to api with tryLocateResultTx? (reply to 44766)

&rey: It... isn't, custom contracts may even change it in outgoing messages. Though, to load query_id you may use the following code: const getQueryId = msgInfo => {try {     const body = msgInfo.in_msg.message_content.body;     const bodySlice = Cell.fromBase64(body).beginParse();     bodySlice.loadUint(32);     return bodySlice.preloadBigUint(64); } catch {return 0;}};

andy: it's cool, but I'm struggling with transfers for over two weeks now, oftentimes encountering completely unexpected results (such as drainage of wallet if you send to a bounceable address with not enough balance to cover the fee and IGNORE_ERRORS not set) (reply to 44767)

&rey: That's related to external messages and replay protection. Destination address is largely irrelevant. (reply to 44771)

&rey: If your project can use tonapi, you may load the whole transactions tree from there. (reply to 44769)

andy: I'm using tonweb, so I, unfortunately, might have chosen to abstract away from the blockchain far too early. (reply to 44772)

andy: What do you use for transfers in javascript?

Ar: @ton/ton @ton/core, but not for transfer but just reading blockchain, but I think it is possible to do transfers as well

andy: you seem to know a lot about the TON blockchain. Could you please tell where you got the expertise? Could you maybe suggest some sources, where I can learn about the blockchain? (reply to 44770)

andy: the nitty-gritty details of ton

&rey: docs.ton.org is quite good, then proofreading whitepaper and participating in TON Hack Challenge. (reply to 44777)

Ar: I'm using self-hosted ton-http api so I guess I have to do it manually, and actually learn a lot (reply to 44773)

User<7103587547>: Hello. Is there any way to ask user to pay gas consumption and after that call mint method from admin address via backend server?

Kenny$$Shillz: ?? (reply to 44721)

Maxey: Hi everyone, Tic Ton Oracle have organized a quotation testing event, where you can quote by interacting with our Telegram bot! We hope everyone can come and experience the quoting process and also help us test the stability of the quoting mechanism.  For more details, you can refer to this video and this message. Those who help us with quoting will receive an NFT as a reward later on!

Anton: TVM Labs introduces new cloud infrastructure with full GraphQL access tailored for TVM networks, featuring a comprehensive overhaul for optimal performance and compatibility, including integration with the Acki Nacki protocol from GOSH. In collaboration with the Venom Foundation and GOSH, we enhance our platform, inviting all networks to support it. Our commitment to open-source collaboration is reflected in our accessible GitHub repository, ensuring community engagement and contributions.  Our platform provides immediate access via our playground and extensive resources for SDK development, ensuring tailored solutions for every TVM network's needs. Discover the potential within TON, Acki Nacki, Venom, and Everscale networks, facilitated by our dedicated and customizable support. (forwarded from TVM Labs News)

&rey: An interesting thing! Pity it doesn't support TON mainnet; it's much nicer than dton, finally having aggregate functions. query {   blocks(limit: 1,          orderBy: {path: "seq_no", direction: DESC},          filter: {workchain_id: {eq: -1}}) {     gen_utime     seq_no     prev_key_block_seqno     signatures(timeout: 5000) {       sig_weight(format: DEC)       id     }   }   info {     time     lastBlockTime   } } (reply to 44784)

&rey: (Also, is it intentional that signatures returns null anywhere?)

Anton: TON mainnet will be available soon (reply to 44785)

Anton: Join the community for updates, and also there you can ask any questions

PetX: I would like to pre-sell my NFTs. what should i do?

Ar: Question about logical time. When fetching transactions from account, is this logical time unique to this account?

Ar: Or to the whole blockchain?

Dmitry | backend4you.ton: to account

— 2024-03-02 —

will be rich: Hi we renounced and burn...then we changed our logo..how we can change this on tonviewer/stonfi?

&rey: If you renounced admin rights, you can't change logo (expect offchain, but that's a bad idea also). (reply to 44796)

&rey: What does it mean to you, to pre-sell? (reply to 44792)

Kenny$$Shillz: Hi please I need help with docs for heavy duty wallets (reply to 44798)

Kenny$$Shillz: Sorry I just need the reference docs

&rey: Have you checked docs.ton.org on topic of "highload" yet? (reply to 44800)

will be rich: So no One possibility? (reply to 44797)

TON Answers Bot (not AI): Ton Stuck in SafePal Won’t send to TonKeeper from TwizzRGamble  I have some Ton stuck in safepal and when I try to send it to my tonkeeper wallet it just shows the spinning progress logo forever and never changes , and this is happening on all my devices. Ive tried to import wallet but it always shows me a wallet thats not mine on the ton network, while all other assets are correct, what can i do to get my ton out of safepal ?   🔗 Answer on TON Overflow

Aron: So I have my in-message hash for my txn, I then do a lookup using getTransactions to search for the right transaction that contains this in-message  I can visually see which transaction is the right one by logging it, but how can I compare my in-message hash that I have against the getTransactions objects inMessage attribute?   I have seen cases where people have used the base64 stringified hash of the body, but that does not appear to be right either

Tawfik: Is there a better option than buying a subscription if i use tonapi.io about 3 reqs per second

Ar: use tryLocateResultTx from @ton/ton and class TonClient to locate the tx based on src, dest, createdLt from inMsg (reply to 44809)

&rey: Find out if you can utilize other APIs for two of the requests :-) (reply to 44810)

User<5792157962>: Hello, how are you guys? Is tact a good choice for developing a wrapped token on TON or you suggest FunC?

Tawfik: Can i create many bearer tokens from my console and on each request i use a different one or does it give the limitation on the whole account ? (reply to 44812)

Dario: In my opinion, func. You can also find some examples of existing tokens in func  https://github.com/TonoxDeFi/WTON (reply to 44813)

Maxey: Hi everyone, in addition to our Tic Ton Bot for testing quotes, we also have code for arbitrage by monitoring quotes.   If you have time, you can try running it to help us monitor prices and earn some Tic. For more information, you can refer to this link.

User<5792157962>: Thanks so much. (reply to 44815)

andy: Hey, guys.  Are accounts destroyed with DESTROY_ACCOUNT_IF_ZERO (128) flag reusable at all? What I've encountered is:  - You transfer from wallet A to a new uninitialized wallet B. - You transfer from B all the money back to A with destroying it (code below). - After that wallet A becomes unusable: if you send any money to it, it will send all of it to B.  Example code of transfer from B to A, making B unusable. The effect lasts randomly for about 2-4 next incoming transactions:  const toAddressObject = to.address;     const isUserFriendly = true;      const isUrlSafe = false;     const isBounceable = false;      const isTestOnly = false;      const toAddress = toAddressObject.toString(isUserFriendly, isUrlSafe, isBounceable, isTestOnly);     const wallet = from.wallet;     const seqno = (await wallet.methods.seqno().call()) || 0;     const secretKey = from.privateKeyRaw;      const transferParams = {         secretKey,         toAddress,         amount: 0,         seqno,         sendMode: SendMode.CARRY_ALL_REMAINING_BALANCE | SendMode.IGNORE_ERRORS | SendMode.DESTROY_ACCOUNT_IF_ZERO,     };      await wallet.methods.transfer(transferParams).send();  I don't know, if it's a bug or not. Seems like a really strange behavior, if you ask me...   The wallet I've been testing the behavior on: https://tonviewer.com/EQAPqRlewultl8xHCKGsrenb4PZaQ0QDfPYoK1fwVUODdcmY  All the incoming transfers with the same text content (e.g. 16a90454-46dc-43fa-95df-90ef52620eb0) are the result of this "bug".  As you can see, there is plenty of them, as I've been struggling with this particular behavior for a while.

User<5110219069>: How are you doing (reply to 44820)

0xNuejo: Hello all, I represent Divercity Labs, a software company recently formed here in Italy post graduation from the MasterZ in Blockchain and Digital Assets.   We are currently developing an NFT ticketing & aggregator solution for our partner, a 7k+ growing Clubbing & Events Community telegram channel.  We are highly interested in the potential benefits of building our project on top of the TON Network as we believe it could significantly enhance the immersive experience we aim to provide for our audience.   We are looking for mentorship and any guidance from the TON ecosystem and specifically another Blockchain developer to help us out with the smart contracts in Tact and FunC and with the Telegram Web App (TWA) development. We would appreciate the opportunity to schedule a brief call to discuss our project in more detail and see if you are a good fit for our needs.  Thank you for your time and consideration.

andy: This code: (reply to 44821)

andy: import TonWeb from 'tonweb'; import tonwebMnemonic from 'tonweb-mnemonic';   const apiKey = "" || undefined; // WALLET B const mnemonic = "..."; const walletVersion = "v4R2"; // WALLET A const toAddress = "...";   const SendMode = {     CARRY_ALL_REMAINING_BALANCE: 128,     CARRY_ALL_REMAINING_INCOMING_VALUE: 64,     DESTROY_ACCOUNT_IF_ZERO: 32,     PAY_GAS_SEPARATELY: 1,     IGNORE_ERRORS: 2,     NONE: 0 }  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));   (async () => {     const provider = new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey});      const WalletClass = TonWeb.Wallets.all[walletVersion];     const mnemonicArray = mnemonic.split(" ");          let { publicKey, secretKey } = await tonwebMnemonic.mnemonicToKeyPair(mnemonicArray);     publicKey = Buffer.from(publicKey);     secretKey = Buffer.from(secretKey);      console.log(`PUBLIC KEY: ${publicKey.toString('hex')}`);      const wallet = new WalletClass(provider, { publicKey });      const seqno = await wallet.methods.seqno().call() || 0;     console.log(`SEQNO: ${seqno}`);     await sleep(2000);          const transferParams = {         secretKey,         toAddress,         amount: 0,         seqno,         sendMode: SendMode.CARRY_ALL_REMAINING_BALANCE | SendMode.IGNORE_ERRORS | SendMode.DESTROY_ACCOUNT_IF_ZERO,     };      console.log(JSON.stringify({...transferParams, secretKey: transferParams.secretKey.toString('hex')}, null, 2));      const response = await wallet.methods.transfer(transferParams).send();          console.log(`transfer sent to blockchain: ${JSON.stringify(response, null, 2)}`); })();

andy: Example of the bug in action: https://tonscan.org/address/UQAySjlsHUY2EEedO5GTenzFvAnR5E-4ptwfeox6OZYnNqxA

andy: I triggered only the first out transfer. All the others are automatic and uncontrollable.

andy: When you send more TON to this address, it gets sent back ASAP.

andy: All of it.

andy: I described this issue more thoroughly on stackoverflow: https://stackoverflow.com/questions/78094237/ton-transfer-bug-when-using-32-destroy-account-if-zero-flag

TON Answers Bot (not AI): TON transfer bug when using 32 (DESTROY_ACCOUNT_IF_ZERO) flag? from No Name  I've been trying to reuse a wallet deleted by DESTROY_ACCOUNT_IF_ZERO (32) flag. The way I do the transfer:  Imagine we have 2 wallets: A and B.  1. We transfer N1 TON from A to B. E.g. by using a web-based wallet, script, doesn't matter. 2. B is uninitialized - it is not on the blockchain yet. With that in mind, we'd like to send all the money from B back to A. For this we're going to use the attached script. 3. Now we go ahead and transfer N2 TON from A to B again. Doesn't matter how much.  Expected behavior: we get transactions: A->B (N1), B->A (all), A->B (N2); wallet B has N2 TONs in the end.  Actual behavior: we get transactions A->B (N1), B->A (all), A->B (N2), `B->A (all)`; wallet `B` has `0` TONs in the end.  The script for B->A (all) transfer, which causes this behavior:  import TonWeb from 'tonweb'; import tonwebMnemonic from 'tonweb-mnemonic';   const apiKey = "" || undefined; // WALLET B const mnemonic = "..."; const walletVersion = "v4R2"; // WALLET A const toAddress = "...";   const SendMode = {     CARRY_ALL_REMAINING_BALANCE: 128,     CARRY_ALL_REMAINING_INCOMING_VALUE: 64,     DESTROY_ACCOUNT_IF_ZERO: 32,     PAY_GAS_SEPARATELY: 1,     IGNORE_ERRORS: 2,     NONE: 0 }  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));   (async () => {     const provider = new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey});      const WalletClass = TonWeb.Wallets.all[walletVersion];     const mnemonicArray = mnemonic.split(" ");          let { publicKey, secretKey } = await tonwebMnemonic.mnemonicToKeyPair(mnemonicArray);     publicKey = Buffer.from(publicKey);     secretKey = Buffer.from(secretKey);      console.log(`PUBLIC KEY: ${publicKey.toString('hex')}`);      const wallet = new WalletClass(provider, { publicKey });      const seqno = await wallet.methods.seqno().call() || 0;     console.log(`SEQNO: ${seqno}`);     await sleep(2000);          const transferParams = {         secretKey,         toAddress,         amount: 0,         seqno,         sendMode: SendMode.CARRY_ALL_REMAINING_BALANCE | SendMode.IGNORE_ERRORS | SendMode.DESTROY_ACCOUNT_IF_ZERO,         payload: "test bug"     };      console.log(JSON.stringify({...transferParams, secretKey: transferParams.secretKey.toString('hex')}, null, 2));      const response = await wallet.methods.transfer(transferParams).send();          console.log(`transfer sent to blockchain: ${JSON.stringify(response, null, 2)}`); })();   The strange thing is: if you send A->B (N) again, it will create a new transfer B->A (all) again and again automatically. Sometimes it stops at 2 repeats, sometimes at 4.  I use the unbounceable address: UQAPqRlewultl8xHCKGsrenb4PZaQ0QDfPYoK1fwVUODdZRd.  I also tried sending TON from wallet C (C->B). And the money DID stay on B. BUT once I made a transfer A->B again, all the money including the TONs sent from C went to A automatically!  An example of this bug's manifestation (is it a bug??) is here:  https://tonviewer.com/EQAySjlsHUY2EEedO5GTenzFvAnR5E-4ptwfeox6OZYnNvGF  This is B wallet. Only the first message with "test bug" text was sent by the script. The rest of them were sent automatically on any incoming transfer from A.  In this interaction: - A is UQAPqRlewultl8xHCKGsrenb4PZaQ0QDfPYoK1fwVUODdZRd - B is EQAySjlsHUY2EEedO5GTenzFvAnR5E-4ptwfeox6OZYnNvGF - C is UQBwpXsIVrij8UQ2OpPK2EyeVBrlN6mnOkmThb3k6K-UHZyL  I want to understand, why this happens. Is this intended by TON blockchain developers? Is this not a bug? How to go around this and reuse deleted wallets?    🔗 Answer on TON Overflow

Aron: but the only response I got was the signed BOC which I was able to get the inmessage hash out of, it doesnt include the LT in it does it?  But if I wanted to chain transaction lookups, starting by identifying the root transaction by its inmessage hash and going from there (using the out-message hash as the in-message hash of the next transaction) how would I best go about this? (reply to 44811)

Ar: There should be createdLt in info field only if inMessage is internal (reply to 44832)

Ar: Same in outMessage

Alexey: Hey guys, what js framework would you recommend for telegram mini-apps?

User<5792157962>: Guys, is there any good resources for FunC that you suggest?  For project based courses.

Dorberex: @FreeTON_DropBot promo-VfiN22BQWU0j-6723963551

— 2024-03-03 —

Behrang: I checked your question. I don't understand what you have written, but I believe that when you send all the money from B and use +32 flag, your account is deleted.  Then if you want to use it again, you have to provide the code and data again for address of B.  If you provide correct code and data that matches the address, you'll be able to reinit B. (reply to 44830)

author: Colleagues, good afternoon.  I linked the adnl of the page to tondev.ton, the site is currently located on the web2.0 domain zone.  It is of an informational nature for beginners to go to your public page or to tutorials for development in the TON blockchain.  If anyone has the desire and means to take up the issue, - I’m ready to consider a deal.  site page - tondev.ton-s.cam

author: We will know after june🤷‍♂️ (reply to 44846)

F: Postings for sale are prohibited. Edit your message or you will be blocked. (reply to 44844)

author: Completed, msg hasn’t a words about price (reply to 44850)

author: Toxic. I did it free absolutely. For idea.

author: For community

author: Make better

author: Well, compare with others on the ton-s.cam list.  Performs the task, unlike other stubs.  It was assembled using a construction set.

&rey: That's intended behavior. (reply to 44826)

&rey: When you delete contract from blockchain, you also reset its replay protection so message with seqno 0 can be sent again.

&rey: When you send money to bounceable address and destination contract can't process it (for instance, if it is not deployed), money is bounced to you.

cemorum: Greetings! Any examples on lootbox system smart contrats avalable?

Tuan Anh Invest: Hello, where can I find the source code to create tokens? Can you guys help me?

Maxey: Hey Guys! Can someone send me some Testnet toncoin? maybe like 10 - 20? My address: 0QAHg-2Oy8Mc2BfENEaBcoDNXvHCu7mc28KkPIks8ZVqwmzg

Vladimir: @testgiver_ton_bot (reply to 44866)

TON Answers Bot (not AI): Batch/bulk NFT minting from Igor Zapletnev  Hey TON community,  I am building TON-based game that mints some NFTs. My code mostly uses the code from this tutorial and ton/ton-core/ton-crypto libs:   My NFT deploy code: public async deploy(     wallet: OpenedWallet,     collectionAddress: Address,     params: mintParams   ): Promise<number> {     const seqno = await wallet.contract.getSeqno();     await wallet.contract.sendTransfer({       seqno,       secretKey: wallet.keyPair.secretKey,       messages: [         internal({           value: "0.05",           to: collectionAddress,           body: this.createMintBody(params),         }),       ],       sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,     });     return seqno;   }   And after I am waiting seqno: export async function waitSeqno(seqno: number, wallet: OpenedWallet): Promise<number> {   for (let attempt = 0; attempt < 20; attempt++) {     await sleep(2000);     const seqnoAfter = await wallet.contract.getSeqno();     if (seqnoAfter == seqno + 1) {       return Promise.resolve(seqno)     }   }   return Promise.reject(`Seqno ${seqno} timeout`) }  export function sleep(ms: number): Promise<void> {   return new Promise((resolve) => setTimeout(resolve, ms)); }   Then I got the confirmation with seqno I request NFT item address by NFT index:    static async getAddressByIndex(     collectionAddress: Address,     itemIndex: number,     tonCenterApiKey: string   ): Promise<Address> {     const client = new TonClient({       endpoint: "https://toncenter.com/api/v2/jsonRPC",       apiKey: tonCenterApiKey,     });     const response = await client.runMethod(       collectionAddress,       "get_nft_address_by_index",       [{ type: "int", value: BigInt(itemIndex) }]     );     return response.stack.readAddress();   }    The whole process takes up to 30 seconds per 1 NFT. I am curiose is there a better option to mint for example 10 NFTs, or the best way is to mint one by one without hurry?   🔗 Answer on TON Overflow

andy: ton scam 😂😂😂 (reply to 44844)

andy: thank you, yesterday I got that info from guys from RU chat  but what about if I try to send more money than I have on my wallet? basically, the message still comes to the blockchain, and stays in node's cache until its TTL runs out. so in effect if I were to top up my wallet even after the failed send, the wallet would transfer the funds anyway? (reply to 44862)

&rey: If you have flag SEND_IGNORE_ERRORS, transaction would be processed once with seqno changing. (reply to 44871)

andy: For example, I have address A with 1 TON on it I make transfer with IGNORE_ERRORS flag for 10 TON to wallet B It cannot be completed due to lack of funds However, after 5 minutes I make a successful transfer from C to A for 20 TON Will the first transfer be executed by the blockchain after the second transfer? (reply to 44872)

&rey: It won't. (Since the first external message will get invalid.) (reply to 44873)

andy: this is interesting a situation seemingly similar to the DESTROY_IF_EMPTY one, yet the outcome is vastly different basically, here we're dealing with lack of account to run the transaction on VS an erroneous result after running the transaction, which is why the first message stays in node's cache until the account is created VS the message gets invalidated? (reply to 44874)

&rey: Actually not quite similar. The first external message will be executed, its action-phase failure recorded and seqno changed. (reply to 44875)

&rey: *+ storage, forward and gas fees charged, of course.

andy: aha, so even the failure will trigger the seqno change? (reply to 44876)

&rey: Yes, insofar as the signature, old seqno and time deadline are correct. (reply to 44878)

andy: ok, but in the case of DESTROY_IF_EMPTY the message still stays in cache, even after being run by the node. So basically the only thing preventing this kind of "double spend" is active wallet's seqno? The message will still remain in node's cache until TTL runs out?

&rey: Yes. So on contracts without replay protection one external message can be run arbitrary amount of times. (reply to 44880)

andy: ok, I gotchu, thanks for the walkthrough, I really needed the understanding :) (reply to 44881)

Ar: Hey, having owner address and jetton master address, how can I get jetton wallet for that owner and it's balance via @ton/core @ton/ton TS library? Do I have to make a manual rpc call to for get_wallet_address and then get_wallet_data or there are already ready to use methods in the library?

ㅤㅤㅤㅤㅤ: Does anyone know how to use golang to load the mnemonic and then authorize the login fragment?

&rey: That's not that easy: you need to implement bridge connection for your program to emulate wallet. (reply to 44886)

ㅤㅤㅤㅤㅤ: Yeah, I haven't found anything relevant yet

&rey: https://github.com/ton-blockchain/ton-connect/blob/main/bridge.md You can reuse Tonkeeper bridge or like to receive events. (reply to 44888)

ㅤㅤㅤㅤㅤ: How to obtain event monitoring of wallet (reply to 44889)

&rey: @RainaPR please add those vacancies to https://jobs.ton.org/jobs, this isn't the chat for them. (reply to 44890)

Mohammad: Hey guys. How can I calculate sha256 hash of a Cell for sandbox testings. I also need to convert it to Uint256 for validating with string_hash inside FunC contract

🥷👾 BITS🚀❤️🦆🐦🐈‍⬛🥠🐤🌱SEEDBroBee🏝️🦴🐐🦉🐸$X🍅FreeDogs🐶MyStars✨😺▪️FLIES 🪰: Почему админ не удаляе скам .

F: at your request, I deleted your message with a link to the scam and blocked (reply to 44896)

Adrian: What telegram native wallet is used for nfts?

Aydin: The self-custodial wallet TON Space (i.e. the wallet inside the outer custodial wallet). It has a panel for collectibles. (reply to 44898)

Nxrix: is it possible to automate a ton wallet to send an nft from specific collection to each person who sent 1 ton?

Nxrix: can someone guide me? I'm just a beginner

Ar: Guys how can I get all jetton_wallets knowing address of jetton_master? I'm using TON HTTP API for interacting with liteservers

Another: Can you please unban @some_wallet. Got banned for mentioning clicker game in the post about opensourcing smart-contracts of A Careers protocol. Need to get community feedback to exclude the risk of any bugs and issues at launch. No clicker game mentioning further in this chat.  https://github.com/the-real-some-dao/a-careers-smc

Aydin: While reading this post on TonRadar, I was struck with a question regarding contract ownership revoking. To be precise, it states that revoking ownership essentially means transfer of ownership to the Zero Address, which is inaccessible to everybody indefinitely. Now my question is:  Given that an arbitrarily large number of contract ownerships might be tranferred to the Zero Address, isn't there any kind of "upper limit" for such number of transferrences? For example, can, say, a million number of ownerships be transferred to the same Zero Address without causing a bottleneck for the network?

Luki: hey guys

Luki: can anyone here help me out

Luki: how do I hard code an address in a contract using tact

Luki: I can only find documentation for FunC

Nxrix: are ton smart contracts like telegram bots? (reply to 44901)

Daniel: Hello Roman; Can I send you a DM? (reply to 27666)

&rey: They are objects having balance, code and data. (reply to 44915)

&rey: When they receive incoming messages (carrying value, or external from outside the blockchain), that code is executed.

&rey: It can access persistent data, message payload, sender, and on basis of that decide what to send out or what to write in its storage.

Luki: anyone? (reply to 44912)

&rey: IIRC, address("EQAV...") (reply to 44920)

Nxrix: So they are really like telegram bots without need of server) (reply to 44918)

Nxrix: What language is the code? C++ or c?

&rey: One compiled to TVM assembly. FunC, Tact or ton-solidity. (reply to 44923)

&rey: Your project is quite complex (and also "registration" via master contract is a strange and bottleneck-inducing idea for blockchain). Any appeals should be discussed in private with @abslzero. (reply to 44908)

fabriregu: Hi guys, I found this repo https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/nft-marketplace I downloaded the whole repo and installed all the Node packages with "npm i". Now I want to test NftMarketplace.scpec.ts with jest but I get this error.  '\node_modules\ton-compiler\bin\macos\func' is not recognized as an internal or external command,  does anyone have the same problem? How can I solve it?

Ar: Do you have any idea how to get started? Is there a way to check for jetton wallet contract deployment? (reply to 44907)

— 2024-03-04 —

Coby 🏃‍♂️: hi Admin

Coby 🏃‍♂️: Does Don currently have an app wallet on the appstore?

&rey: Tonkeeper, for instance, MyTonWallet or Tonhub. (reply to 44930)

Coby 🏃‍♂️: Is it correct?

&rey: No, I see version with rating 4.6 on 45 reviews. (reply to 44934)

&rey: https://apps.apple.com/us/app/tonhub-ton-wallet/id1607656232

Coby 🏃‍♂️: thanks sir

Coby 🏃‍♂️: I want to get parvite Key? Which section do I get it from?

Coby 🏃‍♂️: @pcrafter

&rey: In @wallet, you can get one only in TON Space (non-custodial part). (reply to 44938)

&rey: Please don't ping me later today, I'll be unresponsive for a few hours. (reply to 44940)

Barbell: hi is there any example how to send internal message to Smart  Contract let's say IncreaseNumber in TonSdk.NET

Barbell: I am getting an error that external msg can't be proceed even I use internal msg based on this library.

Snowkid DM BAD NO: Hey guys - I have a user who accidentally sent funds to trust wallet, but it doesnt look like trust supports jettons. Also the mnemonic on trust is only twelve words and MyTonWallet and TonKeeper both require 24 word seed phrases. Any thoughts on how to init a 12 word mnemonic or perhaps a timeline on when trust wallet will support jettons?

Tim: You need to write code to recover funds (reply to 44945)

Another: User can delete his data from profile through update mechanism any time he likes (reply to 44925)

Snowkid DM BAD NO: this doesnt really help (reply to 44946)

cemorum: Wassup. Does ton have any similar smart contracts to nft lootbox system? For example taking a random nft from the collection

cemorum: like roolz

Kenny$$Shillz: Use ton API to get transactions on block and filter for transactions with Jetton contract deployment opcode in the out message ... I think it's 000015 (reply to 44928)

Ar: this out message comes from jetton master? (reply to 44954)

Kenny$$Shillz: Its a field in the transaction object (reply to 44955)

Kenny$$Shillz: Just go through tonApi docs

Kenny$$Shillz: def is_contract_deployment(transaction):     out_msgs = transaction.get("out_msgs")     if out_msgs:         return out_msgs[0].get("op_code") == "0x00000015"

Ar: Yes I know that, just wanted to know what is the source of this message, is this a jetton_master address or something else? (reply to 44956)

Ar: I don't want to pull any txs from blockchain, but only get the txs of specified address so I would limit resource consumption, but I'm not sure if that's possible

Kenny$$Shillz: It's the deployer wallet address (reply to 44959)

Kenny$$Shillz: Need more context here please (reply to 44960)

Ar: I'm using this api https://toncenter.com/api/v2/ I cannot easily get all the transactions, but only transactions for specified address, thus need to know the deployer address beforehand to find transactions with Jetton contract deployment opcode. Who is the deployer? (So far I know, jetton master address, owner of the wallet that jettons are transfered to) (reply to 44962)

Kenny$$Shillz: Deployer created the contract...  Can be different from owner (reply to 44963)

Ar: Do you have any docs in which the process of jetton wallet deployment is described? (reply to 44964)

cemorum: guys, i need a smart contract for random nft allocation to minter. Reference - Roolz gods and mortals collection. If you have it, please send it to my DM

P.I 🦈: Same question if anyone has a guide for smartcontract ton collection , please dm me

Lucky: Hi, everyone! I'm new here. Just a quick question: why, when I send 1 ton to a smart contract address using a sandbox test (jest), does it send 0.99... instead of 1 ton? Any ideas? It affect my calculation for the amount ton sent

&rey: Forward fee. To pay it from your contract, add +1 flag to send mode. (reply to 44969)

Barbell: Hi  I am getting error while I'm sending InternalMsg in TonSDK.NET C#. cannot apply external message to current state : External message was not accepted. Anyone's got any solution?

shubham: How much time does it usually takes for an approval of PR for tonkeeper assets verification ?

Lucky: It doesn’t help for me, I’ve tried to send from treasury wallet to treasury wallet and it doesn’t send the exact amount too (reply to 44970)

Aydin: Could you share your send command, please? (reply to 44973)

Lucky: Any idea? (reply to 44974)

Lucky: Adding CARRY_ALL_REMAINING_INCOMING_VALUE Flag and nothing change

Aydin: One thing for sure:  Your 1st expect is wrong, because wallet1 will have to pay the forward fee which will be deducted from 9  ton anyway, regardless of how you setup your sendMode (reply to 44977)

Lucky: Ya I know, but the wallet2 doesn't receive exact 1 ton.

Lucky: 1st expect is passing, but not 2nd expect.

Aydin: Yeah. Subtracting the sum of those two balances after tranaction from the whole initial 10 ton, it looks like some 0.05 ton is deduced. I guess this must be for activation of wallet1

Aydin: Wallets get activated by sending messages

Lucky: But wallet2 didn't send any message?

Aydin: Try to modify your code, by doing the same transaction twice. And see if there is any difference the 2nd time

Lucky: So, it means when the wallet2 receive a message, it will cost 0.05 for wallet activation?

Slava: wallet2 actually received exactly 1 ton, but this very small difference represents the fee that was paid by wallet2 when receiving the incoming transfer (storage phase fee + compute phase fee). (reply to 44980)

Aydin: Yes, and actually this may be due to zero-balance deployment of wallet2 from the very beginning. Blueprint template code itself deploys contracts with 0.05 ton, right? (reply to 44987)

Slava: Blueprint deploys treasury contracts. By deploy I mean simply sending a message with the correct stateinit to some address.  Otherwise there will be no transfer from wallet1 to wallet2. (reply to 44988)

Lucky: Ok, but I have deployed a smart contract with 0.05 ton and I send a message to the contract with 1 ton, the contract also didn't receive 1 ton and yes it show 1 ton in the context value but this is the wrong value

Lucky: The 2nd transaction to wallet2 still didn't receive the exact 1 ton amount and deduct the fee Slava mentioned.

Lucky: This also happen in a smart contract, so I can't receive the exact ton amount? means the calculation with the received ton amount will result a wrong value

Slava: Storage phase and compute phase fees will be charged from a smart contract (wallet is a smart contract between) balance on every incoming message (simple TON transfer between 2 wallets is also a message). (reply to 44991)

к.: Hello, guys can we interact with ton storage directly on FunC or tact contract?

&rey: No. (reply to 44994)

Lucky: I see. But, let say I want to store the users ton amount to smart contract when they send a message and I have a getters function to retrieve user's total amount in the contract, the value of the getters will return a true value but it's not valid because user's ton is deducted from the storage phase fee and compute phase fee. How can I fix this issue? (reply to 44993)

Slava: You can expect from users to pay for these fees by sending user_amount + gas_amount, where gas_amount is some small extra TON value to cover a contract execution. After your contract execution you need to send all unused TONs from gas_amount back to sender (via message with sendmode 64 or raw_reserve + message with sendmode 128) (reply to 44996)

Nxrix: Is it possible to use ton like a storage?

Lucky: How can I get the value of the gas_amount? (reply to 44997)

Slava: You need to estimate it, execute this transaction on your contract, then check out result fees. Take this value + some small amount of TONs (extra TONs should be sent back anyway). In most cases gas consumtion is constant. But if you use unbounded dicts the max gas consumtion will be indetermined (reply to 44999)

к.: Is there any possibility for that on future? (reply to 44995)

&rey: I'd guess no, since TON Storage is only based on trust that storage provider wants your money enough to keep files available. (reply to 45001)

Luca | SpyDefi | ⛔️: Hey guys

Luca | SpyDefi | ⛔️: Any news about @wallet support jettons ?

Luca | SpyDefi | ⛔️: Someone can help me pls?

Luca | SpyDefi | ⛔️: I’ve tokens blocked there

Aydin: Nope. This is line 25 of the Blueprint template code (reply to 44989)

к.: Uh, got it. So it's not decentralised? (reply to 45002)

&rey: You can choose storage provider yourself, but you still need certain trust in them. (reply to 45009)

Aydin: Although the ownership info is stored on-chain, the actual data itself is stored off-chain. And this off-chain storage has to be stored somewhere. Therefore, it is not "decentralized" in the blockchain sense. (reply to 45009)

Andrey: Answer yourself: Are classic torrents actually decentralised?  TON Storage decentralised same as classical torrents (reply to 45009)

Сергей: Hello

к.: So, can't it work like IPFS or swarm? But the whole network will get an incentive to keep these data chunks. (reply to 45012)

TON Answers Bot (not AI): Migration from Trust Wallet to other Ton wallets from Alexander  Hi there I had set up Trust Wallet and I have its 12-words seed phrase. I know that for other chains (ethereum for example) I can use this phrase to get access from another wallet (metamask). I see that when I want to receive Ton coin, Trust shows address in Ton network, not erc-20. But if I want to get access from another Ton wallet, I need to provide 24-words seed phrase, while Trust gives me only 12-word seed phrase. The question is: how I can get access to my Ton wallet if I have tokens on trust wallet? I know I can transfer tokens, but I want to have a way to get an access to my wallet from another dapp.  🔗 Answer on TON Overflow

Aydin: Regarding TON Storage, what is currently reflected in the TON Whitepaper (Section 4.1.7, pp. 100, 101) is a mixed offchain-onchain solution which only stores the Merkle tree hashes of (augmented) data chunks onchain.   The above description, I believe, is quite different from, say, Swarm which is a multilayer technology that utilizes DISC (Distributed Immutable Storage of Chunks).  And yes, I totally agree with you that there is a strong need for development of an analogous TON-based (multilayer?) data storage technology. Certainly, people can be incentivized to participate in such a P2P network, just as you have stated.  Also, as TON is a 3rd-generation blockchain with faster transactions and lower fees, I guess its corresponding P2P storage tech would be advantageous compared to Swarm. (reply to 45014)

Luki: Error: Type sendParameters not found I get this error when trying to build a token in tact, any ideas what could be the problem or what imports am I missing

Luki: I followed the guide im using to a t and cant find any helpful info online

Luki: does anyone know what could be the issue?

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: first: DO NOT USE grammar keywords as local variables  then: use Tact group to get answer faster https://t.me/tactlang (reply to 45019)

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: Actually, I'm sure you can fix it by changing: let init: to: let jettonInit: because init is reserved by tact compiler (reply to 45020)

Luki: tried that just now

Luki: and it didnt fix it unfortunatly

&rey: to: contractAddess? (reply to 45020)

Luki: I already started getting a different error

Luki: Invalid type "InternalAdd" for fields "body" with type Cell?  in type SendParameters

Luki: TON needs to get bigger so theres more resoureces online lol

Luki: debugging things is a nightmare

Lucky: Hi everyone, can I have contract code example of calculate a forward fee in Tact?

Arman: Hey guys, is there any trading platforma made a on ton?

&rey: getgems.io, if you are interested in NFTs. (reply to 45033)

Arman: I mean like futures or spot kind of trading (reply to 45034)

к.: Thanks, got it. Yes, that will be good thing on TON. (reply to 45016)

к.: Https://Ton.app (reply to 45035)

к.: Check TON projects here.

Max: Hi, My Web app uses ton-connect SDK for working with Ton contracts via Telegram Wallet (TON Space). Neither on desktop nor on mobile the Telegram Wallet is not activated for confirming transaction. So the app user has to activate Telegram, open wallet via menu, open TON Space section...  Is there any way to customize ton-connect SDK to make this process more user friendly?

Aleksei: Hi,  can anyone help with what libraries are and how to work with them? It's not very clear from the description, and there are no examples anywhere. >using libraries in smart contracts https://docs.ton.org/develop/data-formats/exotic-cells#library-reference

Luki: how much TON is needed to deploy a token?

Luki: I got my code to compile but I get this error Sent transaction Error: Contract was not deployed. Check your wallet's transactions

Luki: could it be because I only have 2 TON in my wallet?

Luki: https://tonscan.org/tx/-qTu3cL6R9gi7LZvF52V76yV9ABjmYeJW4IduzfmDOE=

Luki: here is the transaction

Luki: lol nevermind, just had to do it multiple times for it to go through for some reason

Vitor: up (reply to 44722)

— 2024-03-05 —

Lucky: Hi, how can I verify my contract address build with tact language? what files I need to upload? there's a lot of .fc files on the build folder

Vatshayan: Hy Need TON API KEY AND ENDPOINT for testnet

Vatshayan: how can i get it

𝐻𝒾𝓉𝒶𝓈𝓅("⁧ ;("⁧: https://t.me/tonapibot (reply to 45055)

shubham: Hi guys  Does anyone know why any new token is marked as SCAM Neither icon is getting updated on ton.app/jettons

Max: up (reply to 45040)

MGO: Hi. For TON Devs, I'm a gram miner getting lots of rejects and noticed something weird in that one of the gram pools are doing.. They are submitting many solutions on invalid block id's at the same time.. most disappear, while all my submits are rejected... Are they doing something shady on the ton network, or if not, can someone explain what is happening here?. How the mechanics work on the ton network to do the same. I have some photos from that problems from the explorer. Block ID :(0,0,0) and 3 fork solutions.

Vatshayan: Do we have to use memo for every other user and keep only one wallet for transaction as deposit & withdrawal

Kenny$$Shillz: As cell (reply to 45029)

Kenny$$Shillz: Have U checked if U are using the latest version of the SDK? (reply to 45040)

Vladimir: Hey guys, just wondering if any of you know about any open positions for native iOS developers or Swift teams working with TON? I've checked out some open-source wallets and they seem to be fully cross-platform on Reactive Native.

Max: Hi, 3.0.0 as specified in https://www.npmjs.com/package/@tonconnect/sdk (reply to 45064)

Kenny$$Shillz: Hmm ok (reply to 45066)

Kenny$$Shillz: Try looking here https://docs.ton.org/develop/dapps/ton-connect/tg-bot-integration (reply to 45040)

Jeff: Which one is the exact size of the dictionary? When I use compute_data_size, it returns 671 for data bits, but when I check its console.log(dict.toBoc().byteLength) with method_id function, it returns 176.

Daniil: first one is the total number of bits in the cell tree of a dictionary. second one is the size of that cell tree serialized as BOC. (reply to 45071)

Jeff: Thanks! I'd like to calculate storage fee for saving this dict. Then which value should I use for calculation? (reply to 45073)

Daniil: storage fees are calculated based on total number of cells and total number of bits. the values from compute_data_size are correct for these computations. (reply to 45074)

Jeff: Awesome. Thanks Daniil! (reply to 45075)

Deepam: Hey I am new to TON & Tact. Can someone share any guide to start creating a smart contract

Vladimir: Hey 👋  You can start with https://tact-by-example.org/00-hello-world (reply to 45077)

Deepam: yeah i've gone through that! but its not telling me how to setup locally and deploy a smart contract

&rey: Have you found official TON doc? See section Development — Smart Contracts — Introduction — Quick Start. (reply to 45077)

Vladimir: https://github.com/ton-org/blueprint (reply to 45079)

User<604064618>: Meta and Google down?

#: Where can I watch a video on creating web applications with TonConnect?

Вячеслав: Hello! Is this the right group to form a collaboration? Who can help?

&rey: No, this is group for helping with project development issues. Look for TON Society groups. (reply to 45084)

Вячеслав: About the notcoin? I have issue. I lost all my coins in progress (reply to 45085)

&rey: Notcoin discussion is banned altogether, at rationale  "How is that related to programming?" (reply to 45086)

Вячеслав: Where can I talk about it? And can you tell me where I can talk about collaboration? (reply to 45087)

&rey: If you mean collaboration for a programming project, TON Society groups are the best I guess. Notcoin... I'm not sure but you can try TON Community Chat (or Notcoin support, that's probably better). (reply to 45088)

Вячеслав: Do you have the link of the notcoin support? (reply to 45089)

&rey: I believe it might be useful here for anyone else who decides to ask. Seems like the official community: https://t.me/notcoin_fam. (reply to 45090)

MGO: Hi. For TON Devs, I'm a gram miner getting lots of rejects and noticed something weird in that one of the gram pools are doing.. They are submitting many solutions on invalid block id's at the same time.. most disappear, while all my submits are rejected... Are they doing something shady on the ton network, or if not, can someone explain what is happening here?. How the mechanics work on the ton network to do the same. I have some photos from that problems from the explorer. Block ID :(0,0,0) and 5 fork solutions.

Greg: Hi all, anyone using Orbs with JS/TS here? I'm having trouble with a sendTransfer and not sure what I am doing wrong.. I always get 503.. same message works with LC/LS

&rey: How do you determine that? (reply to 45094)

Kenny$$Shillz: I think testnet has been problematic today (reply to 45095)

Kenny$$Shillz: I saw a notification about it

User<6908616126>: hello everyone! tell me if there is an API for getgems.io which does not block requests by the CORS policy. I found it api.getgems.io but when I try to make a request using axios, I get a 400 code and a CORS error

Nxrix: I also have this problem (reply to 45100)

User<6908616126>: I need to get NFT items with the owner field equal to the wallet address for which I want to get all the nft. if not getgems, how can I get this data?

MGO: 3 extra Contracts send from the same wallet... you can see the Block ID (0,0,0) all that is later destroy, meanwhile my share are all rejected.  You can easy see it in any of the givers how are pending lot of the solutions and only happens all to the same Reward Wallets, all others are in my same situation. (reply to 45096)

MGO: 4 Pending... later is only 1. Always same Reward Wallet the end with _Am. When you click before disappear. What is happening there? (reply to 45096)

Greg: I'm trying on mainnet. I can do read type operations like state/seqno no problem but I cant send a message. I just wonder if I'm doing it wrong (reply to 45097)

Greg: const endpoint = await getHttpEndpoint(); // decentralized RPC endpoint     const orbsClient = new TonClient({ endpoint }); orbsClient         .sendMessage(int1 as Message)         .then((result) => {           console.log(`orbs sendMessage result:`, result);         })         .catch((error) => {           console.error(`Error in orbs sendMessage:`, error.stack);         }); int1 is an internal() but shows type as MessageRelaxed. its possible I am mixing up api's here..

— 2024-03-06 —

Vatshayan: const result = await tonweb.getTransactions(address) this is not working giving method error

Vatshayan: which method is used to get transaction from address?

Vatshayan: 'Method Not Allowed' getting for tonweb.getTransactions !

&rey: If you're sending it to non-custodial wallet like Tonhub, you may fill it any way you like: it will be comment for the transaction. (reply to 45111)

&rey: RPC link is incorrect, probably. (reply to 45114)

Vatshayan: https://toncenter.com/api/v3/  Is this mainnet API ?

Vladimir: yep (reply to 45117)

Vladimir: for testnet add subdomain testnet.  https://testnet.toncenter.com/api/v3/ (reply to 45117)

Vatshayan: I am using mainnet API and key. but still getting error as : Method not allowed !   const wallet_address = 'EQB90pO1r7oIGfEI2f3hlzdm3yfn0yVPvuAvGvhnKqdIcoam' const result = await tonweb.getTransactions(wallet_address, 10, blockIndex, null, toIndex); console.log(result[2]);

Vatshayan: please check

Ruslan: Do you use /api/v3 as an endpoint for tonweb? (reply to 45120)

Vatshayan: yes

User<6295881685>: Hello,I'm having a serious problem with v2 ton access api, I'm using "@orbs-network/ton-access": "^2.3.3", "@ton/ton": "^13.10.0", and when I make a request to the this api to my smart contract it returns me different responses without any error, can't understand why

Vatshayan: require('dotenv').config({}) const TonWeb = require("tonweb"); const TON_API_KEY = '4a75e02db1a6c1c09b9abaedea0187cb21dd525c1f0449eabfb2a2adf69bad40'; const TON_API_ENDPOINT = 'https://toncenter.com/api/v3/'; const tonweb = new TonWeb(new TonWeb.HttpProvider(TON_API_ENDPOINT, { apiKey: TON_API_KEY })); const wallet_address = 'EQBwQD0feMsCenDVRNVMR7Oxw9_cCzracP20kvv-GToySJ9n';  const startTonDeposit = async () => {     try {         let blockIndex = '11679564000001'         let toIndex = Number(blockIndex) + 60000;         if (blockIndex) {             const wallet_address = 'EQB90pO1r7oIGfEI2f3hlzdm3yfn0yVPvuAvGvhnKqdIcoam'             const result = await tonweb.getTransactions(wallet_address, 10, blockIndex, null, toIndex);             console.log(result);         }     } catch (error) {         console.error("Error in result:", error);     } }  startTonDeposit();  Getting Error :> Error in result: Method Not Allowed  Please check !! Its very important for you us toget transcation result of address !

Vatshayan: ?

&rey: Endpoint is https://toncenter.com/api/v2/jsonRPC. (reply to 45125)

Vatshayan: require('dotenv').config({}) const TonWeb = require("tonweb"); const TON_API_KEY = '4a75e02db1a6c1c09b9abaedea0187cb21dd525c1f0449eabfb2a2adf69bad40'; const TON_API_ENDPOINT = 'https://toncenter.com/api/v2/jsonRPC'; const tonweb = new TonWeb(new TonWeb.HttpProvider(TON_API_ENDPOINT, { apiKey: TON_API_KEY })); const wallet_address = 'UQDOzwesMfLFJQS0NzF1_cbV3xAZu7VA_fwrbwH6ZrZiCFR5';  const startTonDeposit = async () => {     try {         let blockIndex = '37930996000003'         let toIndex = Number(blockIndex) + 60000;         if (blockIndex) {             const result = await tonweb.getTransactions(wallet_address, 10, blockIndex, null, toIndex);             console.log(result);         }     } catch (error) {         console.error("Error in result:", error);     } }  startTonDeposit();  Error in result: LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time

Vladimir: Signature of getTransactions in tonweb: getTransactions(address: AddressType, limit?: number, lt?: number, txhash?: string, to_lt?: number): Promise<any>; (reply to 45128)

Vladimir: and you are trying to pass null instead of hash of transaction (reply to 45128)

Vladimir: (hash is required with lt)

Vatshayan: require('dotenv').config({}) const TonWeb = require("tonweb"); const TON_API_KEY = '4a75e02db1a6c1c09b9abaedea0187cb21dd525c1f0449eabfb2a2adf69bad40'; const TON_API_ENDPOINT = 'https://toncenter.com/api/v2/jsonRPC'; const tonweb = new TonWeb(new TonWeb.HttpProvider(TON_API_ENDPOINT, { apiKey: TON_API_KEY })); const wallet_address = 'UQDOzwesMfLFJQS0NzF1_cbV3xAZu7VA_fwrbwH6ZrZiCFR5'; const hash = 'A4UvlTzU24rRtqsjvOe7KQDMaKJFnjybK41QMo51tTE=';   const startTonDeposit = async () => {     try {         let blockIndex = '38688705000001'         let toIndex = Number(blockIndex) + 60000;         if (blockIndex) {             const result = await tonweb.getTransactions(wallet_address, 10, blockIndex, hash, toIndex);             console.log(result);         }     } catch (error) {         console.error("Error in result:", error);     } }  startTonDeposit();

Vatshayan: Error in result: LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time

Vatshayan: Still same issue !

Ihor: Hi Guys! Is there any sort of evidence of a penetration testing being conducted for the TON?

&rey: https://skynet.certik.com/projects/the-open-network (reply to 45136)

&rey: Querying transactions by lt range doesn't work really well in Toncenter. (reply to 45133)

Vatshayan: Is there is any other method for geting transaction using block time in nodejs

Vatshayan: as of now I have used Logical time in blockIndex.

Vatshayan: Please check and let us know asap 1

Vladimir: try to change  await tonweb.getTransactions( to await tonweb.provider.getTransactions( maybe (reply to 45135)

Ruslan: You need to add flag archival=true to method /api/v2/getTransactions (reply to 45133)

Ihor: thanks! (reply to 45137)

Samyar: hey does anyone knows about https://ton-community.github.io/ton/classes/TonClient4.html   what's the difference between TonClient4 and TonClient?

Nxrix: how to get test toncoins without using a telegram bot? is there a specific api?

&rey: There is not. (reply to 45149)

&rey: Seems that v4 should return transaction Merkle proofs. (reply to 45148)

Nxrix: Well then how those bots do it? (reply to 45150)

&rey: They have hold of secret key of their wallet, which contains a large number of testnet TON. (reply to 45153)

Nxrix: How did they get many testnet ton 😂 (reply to 45154)

&rey: Testnet is different from mainnet by TON distribution. Plus roadmap is moving in a bit of advance. (reply to 45155)

Luki: is there a way to send to 2 wallets in one token transfer?

Luki: like tax on ETH/BSC

Luki: I tried calling send(SendParameters.. twice once for each address but transactions just kept failing

Mikey: How do you guys create the cell for NFT metadata readable in getgems?

Mikey: https://getgems.io/nft/UQAahgrsCZ7DwmxZ0-_VkdFGmIRHGT1C-46iMjzR4k0xaeYT

Mikey: const contentCell = beginCell().storeBuffer(Buffer.from([0x01])).storeStringTail(params?.contentUrl).endCell()              const itemCell = beginCell()         .storeAddress(Address.parse(params?.owner))         .storeRef(contentCell)         .storeAddress(Address.parse(params?.owner))         .storeMaybeUint(0, 64)         .endCell()          const payloadCell = beginCell()         .storeUint(1, 32)         .storeUint(params?.queryId  0, 64)         .storeUint(params?.itemIndex, 64)         .storeCoins(toNano(params?.amount  '0.05'))         .storeRef(itemCell)         .endCell()

Mikey: metadata is not loading in get gems

Mikey: something I must do?

Ihor: Is there a way to point tryLocateSourceTrx to the workchain as by default it's querying masterchain and I keep getting 503?

P A R S A: is tonvalidators website legit?

P A R S A: it only shows a deposit button, and I don't know what happens if I deposit?!

P A R S A: how and when will I receive my share of income?

@Pacica_S: Please provide the support team email address for Tonkeeper. I repeatedly emailed the support team whose email address was on the website but there was no response

Mikey: anyone can help out? (reply to 45166)

Mikey: Is this an active dev group?

User<5619119025>: Hello, if  I mint some jetton, can I make it nontradable? It will still be transferable, but not for money (it can't be traded on DEX's, etc)

&rey: No. You cannot determine if the contract it is sent to is DEX or a wallet. (Actually, with a bit of custom work and modifying standard transfer message you can, but this involves wallets whitelist so I, as an interested party, won't help to build this.) (reply to 45181)

&rey: Maybe your collection already contains prefix of contentUrl? (reply to 45167)

&rey: You need to specify TON value for each transfer separately. How to split incoming TON, is your task to figure out) (reply to 45163)

Luki: where can I look up how to do that (reply to 45184)

Luki: this is the way I tried doing it that didnt work

Synth: Hello guys

Synth: When I am running the validator this error is appearing Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1216, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 106, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 122, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings joud@DESKTOP-TBDL4F7:/mnt/c/Users/jouda/My Documents/erp-infra$ sudo mytonctrl  [debug]   06.03.2024, 15:55:31.690 (UTC)  <MainThread>  Thread self_test started [debug]   06.03.2024, 15:55:31.691 (UTC)  <MainThread>  Thread write_log started [info]    06.03.2024, 15:55:31.691 (UTC)  <MainThread>  Start program /usr/src/mytonctrl/mytonctrl.py Welcome to the console. Enter 'help' to display the help menu. MyTonCtrl update available. Please update it with update command. Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1216, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 106, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 122, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1929, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 66, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings

Synth: Why?

Synth: I am following the website steps

Synth: When I dont use sudo mytonctrl then I can use mytonctrl

Synth: But the error is still there and only when using sudo it happens

Synth: Any help?

User<6908616126>: https://tonapi.io/v2/accounts/<wallet address>/nfts?limit=1000&offset=0&indirect_ownership=false   here is the solution to the problem  https://docs.tonconsole.com/tonapi/api-v2 (reply to 45101)

Synth: What about mine) (reply to 45196)

&rey: You can't send RemainingValue twice, can you? (reply to 45188)

User<6908616126>: yours is more difficult)) (reply to 45197)

Synth: Let me make it easy for you

Synth: For validators shall I use mytonctrl?

Synth: Or what

Synth: For maximum gains

User<6908616126>: I haven't worked with them, so I won't tell you)

Synth: Okay thanks

Synth: Anyone has any idea about validator

Synth: ?

&rey: Any tool that lets you validate TON will get you entitled to the same reward, proportional to blocks you create. (reply to 45203)

Synth: Which one is best to use?

Synth: Because mytonctrl keeps on giving errors

&rey: Have you tried mytonctrl in Docker? I keep remembering that there is a working image.

Synth: No

Synth: I am using the install methode from ton.org

Synth: With the bash script

Synth: But this is the issue (reply to 45193)

&rey: https://github.com/kdimentionaltree/ton-docker-ctrl (reply to 45211)

cemorum: hello guys! Do any of you have a source code of RoOlz random NFT minter?

Nxrix: https://github.com/LaDoger/doge.fc any guide on how to run that code on a smart contract in testnet?

&rey: https://docs.ton.org/develop/dapps/ton-connect/transactions#smart-contract-deployment from a testnet wallet. (reply to 45218)

Nxrix: well can I also have full access to the created contract from a wallet or app? (reply to 45219)

&rey: If by "full" here you mean "the same that anyone other has", yes, you can. (reply to 45220)

Nxrix: does it have 24 word seed phrase? (reply to 45221)

&rey: Doge? No, it doesn't have any key at all. (reply to 45222)

Nxrix: not just the github thing I mean is it possible to have code on a 24 word base wallet or have the words for a created contract? (reply to 45223)

&rey: 24 words are specific to wallet contracts, which have private+public keys. Except for inplug-v1, they don't support executing TVM code on themselves. (reply to 45224)

Nxrix: well one more question if I made the contract I can do anything I want with it that others can not? for example sending ton to it or then sending it back or change and edit the code

&rey: No, blockchain doesn't provide you any special privileges beyond those contract's code (NFT/jetton/etc) gives you. (reply to 45226)

&rey: https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers

Nxrix: so I should be sure about the code before creating the contract right? (reply to 45227)

&rey: Yes. Fortunately, you can test it locally. (reply to 45229)

Nxrix: can they save data in themselves? like a contract you give it some ton and data in comment then it will send it back when you send a transaction again with comment load for example? (reply to 45230)

&rey: Yes, they can. TON smart contracts are entities with balance, code and storage. (reply to 45231)

Nxrix: Is there a limit?

&rey: 65536 cells, meaning all dictionaries in total cannot hold more than 32K key-value pairs. (reply to 45233)

Nxrix: One more question that is my main goal is it possible to make the contract work like an api of binary data storage that people can have access to change or load the data from it? (reply to 45234)

Nxrix: everyone can read the contract storage right?

Aydin: Yes, contracts can be traced by their addresses in trackers (reply to 45236)

Aydin: Of course, if they have proper access to that contract. For example, on Web3 platforms, people log in using their wallets. (reply to 45235)

Nxrix: Deployed contracts can't be deleted?

Aydin: They can. Sending a message with mode 160 (= 128 + 32) destroys the contract:  https://docs.ton.org/develop/smart-contracts/messages#message-modes (reply to 45239)

Ar: Do you have an example transaction in which one out of out messages is a jetton deploy message?

Ar: Do you know why using ton http api sometimes tryLocateResultTx cannot find the transaction based on out message parameters? I can see this tx on tonviewer and other but cannot query it from api. The tx is like 1 day old

#: Is it possible to make SBT NFT on tonsdk in python?

User<5110219069>: How

Ilya: 🔍 Person wanted for the team  🟢 Required:  • knowledge of principles and structure of TON blockchain  • experience in writing smart contracts for staking and liquidity pools  • understanding of principles, preferably experience in designing DeFi systems in conjunction with web technologies  Contact here: @donlusofon  We are ready to pay well. Some nice token options will be added to the salary  🚬

Synth: How can I check if the wallet has became a validator on my on in cli?

Synth: In the mytonctrl cli

Barbell: in documentation there is command how you can check. (reply to 45246)

Barbell: I am getting few errors ->   data: { ok: false, error: "name 'tonlib' is not defined", code: 503 } on orbs api? Is this only for testnet or mainnet too?

Barbell: also how I can catch the error which I throw in Smart Contract -> Client Side

Synth: Yeah but the issue is thay are not letting me be able to do ew address keys in base64

Synth: In mytonctrl

Barbell: Hi all why  ton client doesn't support slice?

Barbell: function parseStackEntry(s) {     console.log(s["@type"]);     switch (s["@type"]) {         case "tvm.stackEntryNumber":             return { type: 'int', value: BigInt(s.number.number) };         case "tvm.stackEntryCell":             return { type: 'cell', cell: core_1.Cell.fromBase64(s.cell) };         case 'tvm.stackEntryTuple':             return { type: 'tuple', items: s.tuple.elements.map(parseStackEntry) };         default:             throw Error("Unsupported item type: " + s["@type"]);     } }

— 2024-03-07 —

Barbell: I am getting error  throw Error("Unsupported item type: " + s["@type"]);

Barbell: where us directly calling api returns slice

Barbell: which is address

Barbell: I got call from scammer asking to connect my wallet to another site.  I have an sdk issue not connecting wallet. This is like third attempt. Guys please be careful and not connect your wallet or seed to any external side.

Kai Jie: hi can i ask why do jetton transfers result in TONs transferring into and out of the jetton addresses https://tonviewer.com/transaction/90e455be899657005fba4a0c282e2f086897b94437d92d588098bbbae5bd3685?section=valueFlow

TON Answers Bot (not AI): some questions need help answering from dino  Hey TON community,I have some questions that I need your help answering 1. Are there any special tips for recharging, such as lunc , deduct 1 Lunc from the account for the first time of recharging, 2. What type of chain does ton chain belong to, evm? Or other types？ 3. Is the recharge confirmation based on confirmation num or bundle?  🔗 Answer on TON Overflow

&rey: All operations in TON are done by TON-carrying messages with some payload. (reply to 45259)

&rey: The last message is forward notification, so that destination contract knows about incoming jettons.

Kai Jie: how are the amount of payload calculated and will we be able transfer ton away from jetton addresses to normal addresses (reply to 45262)

&rey: From the end of transaction chain. Forward amount is sent to receiver, and internal amounts are not so easy. (reply to 45264)

&rey: If there remain some... No for most of them. (reply to 45264)

Nxrix: what will happen if testnet ton giver bots get out of ton?

Kai Jie: which means the tons in the jetton addresses cannot be retreived back to the main address even if there are no more jetton in the account (reply to 45266)

Nxrix: we will be unable to do anything 😂 (reply to 45267)

Nxrix: Is it possible to do ton contract development even with phone?)

Nxrix: ton dns domains exist for testnet?

Vatshayan: 'LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time'    for tonweb.getTransaction

Synth: So you have an idea about how to get mytonctrl workingv

Synth: Because I am inputting iw address key-phrase(in base64) and still not working

Synth: Now its giving 1037373929s out of sync status

Synth: Now when asking for status even I am putting the wallet secret phase

Synth: When asking for status its returning pk not found

Synth: Mytonctrl is full on shit

Vatshayan: 'LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time'    for tonweb.getTransaction const result = await tonweb.getTransactions(address);

Vatshayan: require('dotenv').config({}) const TonWeb = require("tonweb"); const TON_API_KEY = '4a75e02db1a6c1c09b9abaedea0187cb21dd525c1f0449eabfb2a2adf69bad40'; const TON_API_ENDPOINT = 'https://toncenter.com/api/v2/jsonRPC'; const tonweb = new TonWeb(new TonWeb.HttpProvider(TON_API_ENDPOINT, { apiKey: TON_API_KEY })); const wallet_address = 'UQDOzwesMfLFJQS0NzF1_cbV3xAZu7VA_fwrbwH6ZrZiCFR5'; const hash = 'A4UvlTzU24rRtqsjvOe7KQDMaKJFnjybK41QMo51tTE=';   const startTonDeposit = async () => {     try {         let blockIndex = '38688705000001'         let toIndex = Number(blockIndex) + 60000;         if (blockIndex) {             const result = await tonweb.getTransactions(wallet_address, 10, blockIndex, hash, toIndex);             console.log(result);         }     } catch (error) {         console.error("Error in result:", error);     } }  startTonDeposit();   Error : Error in result: LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time  RPC & Key is correct.   please check is there is any issues from API ?

Vatshayan: what is issues? else what we can do to get trasaction history of history ?

Synth: Yes but that is t that helpful

Synth: I am running into out of sync

Synth: Even I am getting an error just because I put sudo mytonctrl

Synth: And works without sudo

Андрей: It’s worth sharing a screenshot of the status from mytonctrl, there’s quite a lot of useful information there for understanding what’s happening (reply to 45284)

Synth: Ok will do

Андрей: why do you need to run as superuser? it does not need to be run as superuser (reply to 45285)

Synth: Because the turorial proposes to do that

Synth: This is after I ran it without same error after reinstalling (reply to 45289)

Андрей: I sent you a video, watch it carefully, there it starts without a superuser (reply to 45291)

Synth: I know

Synth: But now after I reinstalled I am running it without sudo

Synth: And not working (reply to 45289)

Synth: This is issue #1

Synth: Issue #2 is this sync issue

Synth: It keeps saying out of sync

Synth: Issue #3 When I am inputting iw address key-phrase (normally) its not working

Synth: And when I am putting it in base64 its accepting it but returning key phrase not found in dir wallet_002

Synth: Eventhough I inputted it

Synth: In the video they show you that they do set stake x  And its working (reply to 45282)

Synth: But when I am checking on tonscan the address is not appearing as validator

Synth: Even if I reinstalled it (reply to 45300)

Андрей: Your node here only works for six minutes. synchronization takes a long time, at least several hours, sometimes up to a day. all this was said in the video, watch it again.  and try to write in one message, your messages may cause inconvenience to other chat users (reply to 45299)

TON Answers Bot (not AI): some questions need help answering from dino  Is the deposit confirmation based on confirmation num or bundle  🔗 Answer on TON Overflow

Synth: Excuse me and thank you

Synth: When and any idea about this issue as in using base64 is good or not? For keyphrases (reply to 45302)

Vatshayan: require('dotenv').config({}) const TonWeb = require("tonweb"); const TON_API_KEY = '4a75e02db1a6c1c09b9abaedea0187cb21dd525c1f0449eabfb2a2adf69bad40'; const TON_API_ENDPOINT = 'https://toncenter.com/api/v2/jsonRPC'; const tonweb = new TonWeb(new TonWeb.HttpProvider(TON_API_ENDPOINT, { apiKey: TON_API_KEY })); const wallet_address = 'UQDOzwesMfLFJQS0NzF1_cbV3xAZu7VA_fwrbwH6ZrZiCFR5'; const hash = 'A4UvlTzU24rRtqsjvOe7KQDMaKJFnjybK41QMo51tTE=';   const startTonDeposit = async () => {     try {         let blockIndex = '38688705000001'         let toIndex = Number(blockIndex) + 60000;         if (blockIndex) {             const result = await tonweb.getTransactions(wallet_address, 10, blockIndex, hash, toIndex);             console.log(result);         }     } catch (error) {         console.error("Error in result:", error);     } }  startTonDeposit();   Error : Error in result: LITE_SERVER_UNKNOWN: cannot locate transaction in block with specified logical time   we are geeting LITE_SERVER_UNKNOWN issues everytime even we have changed address. API

He: How to calculate the gas required for a transaction? I am currently using a very stupid method, which is to reduce the gas required to initiate send bit by bit until the request fails😂, and then monitor the balance of the contract before and after the initiation. This way It’s not very efficient, and it requires interaction between multiple contracts. Monitoring is relatively troublesome to write. Is there a better way to do this?

Manuel | CM: Hello excellent devs 👋🏼 can i gain your attention for a minute, thanks i would like to ask you if you can provide this junior Dev with links to other Developer groups on Telegram i would like extend my connections. thanks 🙏🏼 my dms are open for the links

solfKwolf: 😅

Жоуд: Codiay.com (reply to 45313)

Snowkid DM BAD NO: So apparently the ton ecosystem is incompatible with 12 word mnemonics. But trust wallet issues twelve word mnemonics and somehow works, but they dont support Jettons.  I’ve tried to get tonweb and tonweb-mnemonic to generate an address using a twelve word mnemonic from trust wallet, and the result is a different address than the address generated by trust wallet. Therefore, it appears that trustwallet is issuing addresses using an uncommon method.   If I look on tonviewer, it says the address rendered by trustwallet is a v4R2 address so I try to initialize it using the mnemonic and this code:    const Tonweb = require('tonweb') const tonweb = new Tonweb()  const { mnemonicToSeed } = require('tonweb-mnemonic')      const provider = tonweb.provider     const seed = await mnemonicToSeed([mnemonic])     const keyPair = tonweb.utils.nacl.sign.keyPair.fromSeed(seed)     const wallet = new tonweb.wallet.all.v4R2(provider, {       publicKey: keyPair.publicKey,       wc: 0     })     const address = await wallet.getAddress()     const nonBounceableAddress = address.toString(true, true, false)ng     const balance = await provider.getBalance(nonBounceableAddress)     console.log(nonBounceableAddress, balance)    I’ve looked at all of the wallets supporting jettons and none of them provide an interface to generate a 12 word mnemonic.   So the question is how to recover jettons wrongly sent to trust wallet, who doesnt support jettons but somehow supports 12 word mnemonics

dwusiq: hello, I have deployed a smart contract, and calling the get interface is fine, but calling the set interface results in an error of "Unable to complete the operation"

Daniil: Click on the transaction to see more detailed info (reply to 45318)

dwusiq: This is the code I called (reply to 45318)

Daniil: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes  Out of gas. Send more TON as value (reply to 45320)

dwusiq: Thank you. I tried 0.1ton and succeeded. In addition, is there any way to calculate gas (reply to 45323)

Daniil: Common practice is to just attach a little more than is expected to be consumed and return excess to user after execution (reply to 45325)

dwusiq: OK, thank you. (reply to 45326)

Ihor: Hi Guys! Is there a way to request tryLocateSourceTrx on workchain?

Samyar: what is queryId? is it to locate the transaction on the blockchain ?   how can i use it or generate a valid one

&rey: Yes, intended for transaction locating. Any value is valid, a common method is to use UNIX timestamp of message generation. (reply to 45329)

&rey: Actually, nowadays query_id is quite useless.

Samyar: why?   what im does not return anything other than a promise<void> so is there another way to locate the transaction?  i was using boc to do it previously but it i don't have access to it (reply to 45332)

&rey: You can find message by its parameters in indexers like tvmlabs.io. (reply to 45333)

Nxrix: where to learn func any documentation?

Nxrix: both testnet and mainnet wallets have the same seed phrase?

&rey: Just as you wish. Addresses are different, though. (reply to 45336)

&rey: docs.ton.org (reply to 45335)

Doggetti: I have a question regarding tx speed per ton? What is the average time from message sending to swap execution on ston.fi in your projects?

Seitaro: It highly depends on network condition. Currently average swap occurs within 5 seconds range on average (if you count difference between sending message and timestamp of the block that includes jetton receive), but you will get information about it a little bit later: 15-18 seconds on average. Under high load swap chains are sharded and may take more time like minute (sometimes more). (reply to 45339)

User<5896227458>: I want to communicate with a developer on the platform

User<5896227458>: .. (reply to 45341)

User<5896227458>: can you help me (reply to 45340)

Luki: hey guys this isnt really a dev thing per say, but what is the standard burn address on TON?

Andrew: Hi! We want to integrate the TON Index v3 API into our on-chain analytics project and have some technical questions. Anyone here to discuss that?

Andrew: This describes the burn address. You will get the same address if you generate it from the FunC code (cannot give the code to generate it - but I've personally checked that).  https://answers.ton.org/question/1592829823879745536/discrepancies-in-ton-network-burning-mechanism-elector-smart-contract-burn-address-and-tonstat-data-what-s-going-on (reply to 45344)

Andrey: If you are using dton.io graphql, please note the method migration.  Changes are planned for early next month, until then please migrate requests to transactions / account_states to raw_transactions / raw_account_states.  https://t.me/dtonforum/1/6001

User<5896227458>: Can someone help me update the search engines?

&rey: What search engines? I haven't heard of any related to TON. (reply to 45348)

User<5896227458>: How to know when the Telegram company calculates the premium for channels (reply to 45349)

User<5896227458>: I mean special (reply to 45350)

&rey: Depends on what you want to burn, I think? EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c or null (on low level, two zero bits) is fine for tokens, -1:FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF for TON. (reply to 45344)

&rey: How is that related to TON? (reply to 45350)

User<5896227458>: How much is the platform’s commission when I upload a username and buy it for me from the same wallet? (reply to 45352)

User<5896227458>: Sorry, I thought you knew something about him (reply to 45353)

User<5896227458>: 🔍This month we changed how searching public channels and groups works on Telegram.  Previously, public channels with more subscribers would appear higher in the search results. That system worked fine for a while, but was increasingly getting abused by spammers. That's why we now only count genuine subscribers of channels for ranking.  For example, channels with more Premium subscribers will generally rank higher. However, if a specific Premium subscriber joins too many channels, they won't give those channels as big of a search ranking boost. Of course, the new search also prioritizes results from your country.  The feedback on this change is overwhelmingly positive. Channels with an inflated subscribers count have become less visible, while useful groups and mini-apps are now attracting more users. 🚀 (reply to 45353)

&rey: I remember that you just need to outbid anyone who wants the same username. In principle, it might be as little as 5 TON. (reply to 45354)

User<5896227458>: Can you please understand this message for me? (reply to 45356)

&rey: I believe you'd better search a group discussing Telegram in your language. (reply to 45358)

User<5896227458>: I made a bid for Userin and paid 22TON, and after the auction ended, the platform did not return the rest to me (reply to 45357)

User<5896227458>: Possible link to the group (reply to 45359)

&rey: Yes, that's to be expected. Fragment platform is not exactly well documented. (reply to 45360)

User<5896227458>: It is not possible for every user to raise the platform’s commission of 6TON

&rey: Then they do not need NFT usernames, right? (reply to 45364)

User<5896227458>: I had a royal license and I wanted to raise a platform. I went and submitted it for 11 tons. It sat for a week and I received the banner and it came back to me for 5 tons. I took the platform and 6 tons as a commission. I went and uploaded two more banners. I paid 11 tons for each user. After the end of the auction, it did not come back to me and there was not a ton in the wallet. Can you tell me where the problem is? (reply to 45365)

User<5896227458>: Did you understand what I mean? (reply to 45365)

User<5896227458>: I don't understand you

Dane: Hello! Is anyone available to develop a ton smart contract?

Aydin: Oh, sorry that I misunderstood your question 😓 It was just after reading &rey's answer that I got it. My apologies. (reply to 45329)

Клецка: queryId is needed to prevent somebody to send your signed external message twice (reply to 45329)

&rey: No, seqno does that. (reply to 45371)

Nxrix: Anyone knows a good free service to store small binary or text data around 64kb-256kb?

Vitor: up (reply to 44722)

Aydin: Why not Google Drive, for example? Gives 15 GB free space per Gmail account. Also, there is InfiniCloud, with 20 GB free space + 5 GB extra for referrals. (reply to 45374)

Nxrix: I need rest api you know (reply to 45376)

Aydin: Perhaps this link might help you. But please be more specific about your needs, and about how they are related to TON. This way, I'm sure that there are more experienced devs here to help you. (reply to 45377)

Ar: Hi, have a question regarding finding the tx based on out message of previous tx. I'm processing some old(few days) swap on stonfi and I cannot find the resulting tx of out message, toncenter v2 api can't find it. Is this possible that it is too old or smth? Or I have some error in my code and the tx should always be found? Thanks for help in advance!

black: hi，I want to render TonConnect using the Mobile universal modal page content. How can I set it up?

black: https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html

black: Currently, my website is rendering the Desktop universal modal page content.

black: Could you provide an example for reference?

Pete GTO: hello everyone. Anyone knows if I can use the sendTransaction to transfer other Jettons? For example jUSDC?

Pete GTO: Cannot find anything like that in the documentation and this is a bummer if not feasible

Pete GTO: anothee question, the getBalance method returns only the TON balance and skip the balance of other coins, how to get the balance of the specic jetton or a total balance of the address?

Aydin: You have to write appropriate getter methods for the jettons by yourself. (reply to 45387)

Pete GTO: thank you Aydin, any documentation or example? I cannot find anything in the API (reply to 45388)

Aydin: You're welcome. For jettons, IMHO, I would recommend nothing better than Vladimir Alefman's tutorial:  https://www.youtube.com/watch?v=MYSQMq-NaVM&pp=ygUQYWxlZm1hbiB2bGFkaW1pcg%3D%3D (reply to 45389)

Aron: hey guys, quick question, if I use the sendRemainingBalance flag (Tact) to set a contracts balance to 0, what happens to the contracts state long term? Does it get deleted? Because thats what I thought the deletion flag was for?

y: Feeling uncertain about where to start, , I am eager to immerse myself in a community like Furlough to learn, grow, and perhaps even succeed.

Andrew: Yes, according to documentation. But I did not check that in practice. So, therefore some opcode exists to reserve some amount for such operation (reply to 45391)

Andrew: For each jetton you need to call the get_jetton_data (low level). In the wallet, this seems to be loaded from the Index API. I assume, you need the second (reply to 45387)

— 2024-03-08 —

Barbell: why ton-http-api every second requests throw {"ok":false,"error":"name 'tonlib' is not defined","code":503}

Barbell: it is very unstable.

Barbell: I work with more than 10 another blockchain/API and never had the issue like this. What about v4? Should we switch or not yet?

Kaspars: Anyone knows a way to approximately estimate fees for High-Load v2 wallet transaction with multiple recipients?  Tried using estimateFee with init_code and init_data it shows way off fee, most likely because it also returns gas_fee=0 but gas_fee changes based on amount of recipients, so not sure how to calculate.

Kaspars: Example: https://tonviewer.com/transaction/3bfdbb066d852b0811320baf19df0af385ee7c90cc5d1fb46a95bd5c5796b78f  For this tx estimate was: {   "@type": "query.fees",   "source_fees": {     "@type": "fees",     "in_fwd_fee": 7749000,     "storage_fee": 33,     "gas_fee": 0,     "fwd_fee": 0   },   "destination_fees": [], }

Жоуд: Hey guys, What is seqno

Жоуд: What do they mean by that?

&rey: Have you looked in official TON documentation, docs.ton.org? (reply to 45389)

&rey: In particular, DApps / TON Cookbook.

&rey: https://docs.ton.org/develop/smart-contracts/tutorials/wallet#replay-protection---seqno (reply to 45401)

Behrang: It will have a negative balance, because of storage cost.   Any message sent to it must have enough TON to make it positive, or it will not be accepted.   If it goes past a config value (which is currently -0.1) it will get frozen and you must first unfreeze it.   If it goes past another config (which is currently -1 TON) it will be deleted. (reply to 45391)

Codex: how does a contract balance get to -0.1 without any interactions?

&rey: Storage fees accumulate; when contract receives a message (1 nanoTON, for instance), it is exacted from the balance. This can make balance negative. (reply to 45407)

&rey: It's worth noting that the contract itself cannot send out TON that it doesn't have (cause itself to have negative balance and other contract's balance to increase).

Жоуд: Does the validator reflect the tons per hour per day or per month?

Tawfik: how can i generate a address when the user completes the payment?

&rey: when user completes the payment? (reply to 45411)

Tawfik: yup (reply to 45412)

&rey: What do you need an address for, then?

&rey: Why my address ratelance.ton, for instance, would not work for you?

&rey: Reflect where? (reply to 45410)

Pete GTO: thx for the reply, yes I did. Im also new to TON so I could miss something. Im also looking for a way to transfer programmatically other tokens than TON (for example jUSDC) any help on that? (reply to 45403)

&rey: Have you looked in official TON documentation, docs.ton.org? In particular, DApps / TON Cookbook. (reply to 45418)

Pete GTO: yes I did, I also chekced the github repo for the dapp (reply to 45419)

&rey: Have you looked through section https://docs.ton.org/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment "How to construct a message for a jetton transfer with a comment?" (reply to 45420)

Pete GTO: thx for the hint, will check it out later. I appreciate your time (reply to 45421)

Tawfik: The address name itself won't be a problem i just want to get an event or something when the user completes the purchase to deliver it's product (reply to 45415)

&rey: To deliver? You want to generate a physical address? 😄 Could you describe in bullet-point list what does user do, how your platform must respond and where you have the problem? (reply to 45423)

Tawfik: I'm developing a bot to do some service but at some point the user should pay to procced the service i just want to check programmatically when he make the transaction (reply to 45424)

&rey: 🎉 then you don't need to generate any address! https://github.com/toncenter/examples/blob/main/deposits.js (reply to 45425)

Tawfik: I think that's exactly what i was looking for thank you :))

Vladimir: Please merge broken link fix if you can https://github.com/toncenter/examples/pull/4 (reply to 45426)

Tawfik: Is there a similar one with python 🙃

&rey: I believe you can write one based on examples! https://github.com/yungwine/pytoniq#blocks-transactions-scanning (reply to 45429)

Жоуд: On the wallet how do you see the ton growth from the validator (reply to 45416)

Жоуд: Do you see it straight on the wallet if you iw your wallet and took it as validator

&rey: As far as I remember, no. (reply to 45434)

&rey: At least, validators have separate wallets, located in masterchain and controlled by mytonctrl.

Жоуд: Mmhmm ok

Жоуд: This the wallet type and this is what I an getting

Жоуд: Should I reset the version of the wallet or what thats very weird

Жоуд: Fyi I am using locked tons only open for validation

Yemight: How can I validate ton wallet address?

Жоуд: Download mytonctrl

Жоуд: Then from there you go and input  iw address 24 keys(in base64)

Жоуд: You change the  mytonctrl> set validatorWalletName validator_wallet_001(the wallet name you want)

Жоуд: Check it by doing Status (in mytonctrl)

Жоуд: If you see it then it has been set

Жоуд: https://github.com/ton-blockchain/mytonctrl/blob/master/docs/en/import-wallets.md

shubham: Hi guys has anyone got TONKeeper Assets verified

shubham: i was raised PR

shubham: but PR's after that got closed but our is still open

stenolog: Is there another TON repository with a better response-time to issues? Looks abandoned: https://github.com/ton-blockchain/ton/issues

stenolog: zero issue-processing, why? https://github.com/ton-blockchain/ton/pulse/monthly

&rey: It is the main repository of TON Blockchain. (reply to 45454)

&rey: Ping @subden. (reply to 45453)

&rey: Probably because of ongoing rework (collator-validator separation, for instance). (reply to 45455)

shubham: Thanks mate (reply to 45457)

&rey: Do you need to validate it to send funds to it, or to receive them, or for a some third option? (reply to 45444)

Komron: Hello guys, I'm newbie here  I have a question, I have TMA and I need to add ton connect there, like the subscription service with TON payment, any starter point or any article which will guide me to do it ?

🅰🅻🅰🅽: Is there anyone who has experience about writing plugins for wallet v4? I’m curious about this topic, and wish to know how it works, or any other use cases

Vladimir: What do you mean “plugins” for wallet? Any links? (reply to 45462)

&rey: https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc (reply to 45463)

&rey: You may consider inline plugins (functions executed on behalf of the wallet) as well. For instance, only they can process NFTs or jettons. (reply to 45462)

🅰🅻🅰🅽: https://github.com/tonkeeper/wallet/issues/256

&rey: They are supported in other wallet contract, inplug-v1 (https://github.com/ProgramCrafter/wallet-contract/). (reply to 45465)

🅰🅻🅰🅽: Yeah, I want to know if there is a plugin that’s for production use.

🅰🅻🅰🅽: All I found are examples and do not mass adopt

🅰🅻🅰🅽: I want to build erc4337 wallet on TON with social recovery

🅰🅻🅰🅽: Is it possible to implement it via a plugin?

Жоуд: Hello I am facing this after the installation of mytonctrl and trying to run it in non-root

Жоуд: Any idea why

Жоуд: Same with sudo

Жоуд: All what I did is the installation from the validation steps on the website

&rey: Is there a keyring directory placed correctly? (reply to 45473)

Жоуд: I only followed the code in the validator website thats all

Жоуд: So I dont know after creating the instance

— 2024-03-09 —

Codex: Hey guys, seem to be getting an issue, if I use the getTransactions endpoint and only set to_lt (to conform with the 100 max return limit). The return does not contain any transactions. I'm not setting lt or hash for the call because this is the first run of the program and I do not know the start LT and transaction hash.

Codex: Is there no way to get the first ever transaction of a contract without having to start the indexing from the latest transaction?

Codex: actually doesn't even seem like setting the first ever tx LT and HASH and setting the latest tx LT as to_lt does anything, returns 0 transactions.

Behrang: Is there any similar UI that takes a hex string and a TLB and show field values?  I want to give it a binary input, and a schema, and see fields' values separately.  Currently I do it manually field by field and it's cumbersome. (reply to 44429)

Codex: can anyone tell me what im doing wrong here?

&rey: Using Toncenter instead of other indexers to filter transactions by lt 😀 (reply to 45490)

Vladimir: Which one did you suggest?) (reply to 45491)

&rey: I see the equivalent method in tonapi. Could you try it out, please?

Codex: interesting, you think orbs network doesn't fulfill correct API requests? The thing is, if I don't put any LTs/Hashes and just get all (the contract has 8 transactions). You end up getting all the transactions correctly (reply to 45491)

&rey: I'm almost certain Orbs doesn't fulfill certain requests correctly (even when Toncenter does). I also think I can provide request that Toncenter doesn't process correctly too.

Codex: let me try another RPC

Codex: anyone got a good testnet rpc?

kevin: It seems payment gateway like Stripe needed in the TON world. (reply to 45461)

Kenny$$Shillz: Tonapi (reply to 45492)

Codex: same issue for toncenter

Codex: if anyone can confirm, im just trying to index the transactions of this contract: https://testnet.ton.cx/address/EQDEHcU3_gHBytKQh9fcYB1Zv8vba5XHGqzwlri-Aac8GheE

Codex: maybe theres no capability for it on testnet?

Codex: so tonapi works BUT its not an RPC endpoint, its an indexed database which would vendor lock us to them (comes with its own API schemas). Rather not go down that path

наз: does anyone have an example of a link to the tonkeeper, when clicking on which a user can get a certain number of tokens to his wallet?

Codex: Jettons or Ton? (reply to 45505)

наз: thx, already got an answer (reply to 45506)

kevin: https://github.com/xssnick/tonutils-go/blob/master/example/transfer-url-for-qr/main.go (reply to 45507)

kevin: is this help ?

Codex: hop hey la la lay! (reply to 45508)

kevin: 👏🏻 (reply to 45510)

Codex: Has anyone here successfully indexed accounts on TON? Would love to pick your brains

kevin: love  to know the solution as well (reply to 45512)

Kenny$$Shillz: ?? (reply to 45512)

Codex: Have a look at my previous messages above about the issue (reply to 45514)

Codex: This (reply to 45486)

Yemight: I just need to validate before send fund (reply to 45460)

&rey: import {Address} from '@ton/ton`; function isAddrValid(destination: string): boolean {     try {         let a = Address.parse(destination);         return a.workChain === 0 || a.workChain === -1;     } catch (e) {return false;} }; (reply to 45517)

Yemight: Okay, thanks (reply to 45518)

Kultasuu: Hello,  I hope this message finds you well. I am currently working on an NFT project that I'm very excited about and have chosen to build on the TON blockchain due to its remarkable features and capabilities.  As I delve into the development process, I've encountered a few questions that I believe your team's expertise could help clarify. Your support would be invaluable in progressing with our project, and any guidance you can provide would be greatly appreciated.  Question 1: I came across the following function in the documentation which reads a Cell from a base64 representation of a collection smart contract:  private createCodeCell(): Cell {     const NftCollectionCodeBoc =       "te6cckECFAEAAh8AART/APSkE/S88sgLAQIBYgkCAgEgBAMAJbyC32omh9IGmf6mpqGC3oahgsQCASAIBQIBIAcGAC209H2omh9IGmf6mpqGAovgngCOAD4AsAAvtdr9qJofSBpn+pqahg2IOhph+mH/SAYQAEO4tdMe1E0PpA0z/U1NQwECRfBNDUMdQw0HHIywcBzxbMyYAgLNDwoCASAMCwA9Ra8ARwIfAFd4AYyMsFWM8WUAT6AhPLaxLMzMlx+wCAIBIA4NABs+QB0yMsCEsoHy//J0IAAtAHIyz/4KM8WyXAgyMsBE/QA9ADLAMmAE59EGOASK3wAOhpgYC42Eit8H0gGADpj+mf9qJofSBpn+pqahhBCDSenKgpQF1HFBuvgoDoQQhUZYBWuEAIZGWCqALnixJ9AQpltQnlj+WfgOeLZMAgfYBwGyi544L5cMiS4ADxgRLgAXGBEuAB8YEYGYHgAkExIREAA8jhXU1DAQNEEwyFAFzxYTyz/MzMzJ7VTgXwSED/LwACwyNAH6QDBBRMhQBc8WE8s/zMzMye1UAKY1cAPUMI43gED0lm+lII4pBqQggQD6vpPywY/egQGTIaBTJbvy9AL6ANQwIlRLMPAGI7qTAqQC3gSSbCHis+YwMlBEQxPIUAXPFhPLP8zMzMntVABgNQLTP1MTu/LhklMTugH6ANQwKBA0WfAGjhIBpENDyFAFzxYTyz/MzMzJ7VSSXwXiN0CayQ==";     return Cell.fromBase64(NftCollectionCodeBoc);   }  In this code, we just read Cell from base64 representation of collection smart contract.   } Could you please provide some insights into the specific smart contract being referred to here?  Question 2: I'm trying to understand how to generate .fif files from TypeScript. However, I'm struggling to find resources or documentation that explains what wallet.fc is. Could you point me in the right direction?  Question 3: After compiling the contract, I noticed that the output is in HEX format, without a binary or base64 representation. Is there a standard procedure to convert this HEX into a format suitable for deployment on the TON network?  I am eager to learn and adapt, and your expert advice on these matters would greatly expedite our development process. Thank you for creating such a forward-thinking platform and for supporting developers like us.  Looking forward to your response.

Nxrix: can a smart contract code access an api server I have? Or is it supported in specific languages

&rey: No, it can't. (reply to 45523)

Nxrix: how does for example getgems send data to their site from contracts or reverse (reply to 45524)

&rey: Getgems site pulls data from blockchain via get-methods. (reply to 45525)

Nxrix: so there is no way to have access to text from my rest api to the contract?

&rey: Of course no. Contract execution must be reproducible even in a few years, when your server could be well off. (reply to 45527)

Никита Рязанов: How to get this comment from transaction with tongo?

Kultasuu: Hello. I put dm for you (reply to 45400)

Kultasuu: Can you recommend a consultant from this group who could help with TON NFT project and is proven to be professional at his job?

Kenny$$Shillz: I sent you a DM (reply to 45533)

Жоуд: Hello guys any idea what version a locked wallet would be

Жоуд: Because it doesnt say anything on tonkeeper

Жоуд: And when I choose a version from the versions on tonkeeper the locked tons disappear

Жоуд: As the locked tons only for validation

Aydin: The burn address (i.e. the zero address) is inaccessible to everyone. Thus, it seems that not (reply to 45538)

Aydin: And besides, contracts interact with outside world by means of external messages. But an API server does not per se send external messages. Am I correct in this regard? (reply to 45528)

&rey: External message sending must be confirmed by validators to be recorded in blockchain. But RPCs and other APIs to TON do send external-in messages to liteservers and validators. (reply to 45544)

Denis: https://github.com/tonkeeper/tongo/blob/master/abi/inspect.go#L107 (reply to 45529)

­😇: We need a programmer knowledgeable in java and func. Work area: java - fix the code in the bot. make sure that if the user is in the database, then the affiliate code is not given to him again. The affiliate code is then transferred to the smart contract. The "change address" button does not change the wallet address to show statistics from the smart, but simply freezes after entering the wallet. Func - In smart, help launch a function on behalf of the owner, which is registered there. Perhaps it will be necessary through a script. If you have any questions, let me know in a private message.

— 2024-03-10 —

Codex: Damn so many people asking questions, not enough answering 😅

Codex: Why did you go down the route of func over something like tact? (reply to 45547)

stenolog: mess: telegramm is a chat system. useless as a serious support tool... (reply to 45552)

Dmitry | backend4you.ton: Yes, unless it has custom code with additional ways to mint. Make sure its source code is shown/visible in explorers and it has no backdoors. (reply to 45538)

Ton Inu advertising: Is available UI ston.fi testnet version?

Dario: No (reply to 45557)

Жоуд: My validator stopped syncing how can I resync it?

Ahmet Said: where can i find jetton minter address for usdt, jusdc ?

Ahmet Said: for mainnet

User<6488595691>: Hi everyone. Is it possible to get 50-100 TON on testnet to test my gambling project?

Denis: tonconsole.com (reply to 45562)

User<6488595691>: Thanks a lot (reply to 45563)

&rey: @Gettteg: @toncoin_rus_chat for non-dev-related discussion in Russian. (reply to 45565)

Nxrix: Can I send data to my smart contract from a server? does it cost gas?

&rey: Yes, via external messages or internals from your wallet. Yes, it does. (reply to 45567)

cfs chef: Is there a VRF on the ton chain that can be used

&rey: https://t.me/tondev_eng/43219 Mainnet node: EQCwaEBhdPAl8Lj5ctJjB_6dZv2qOoeuIrjVPgDFvVTvDRL- (reply to 45569)

GB🥠: Yes, of course, I'm sorry (reply to 45566)

Ar: How can I calculate hash of inMessage that ton/ton js lib returns as a Transaction object type? I want to get the hash from screenshot, all I managed to get was the message content hash :/

GB🥠: OK (reply to 45579)

Ar: Any hint or suggestion how to do it? (reply to 45579)

­😇: Good job

к.: Hello guys, is it possible to implement and run algorithms such as perlin noise using FunC on TON?

Aydin: As TVM is Turing-complete, implementing any algorithm on it should be possible in theory. However, you have to clarify its relevance to TON blockchain first. (reply to 45585)

к.: Uh, got it thanks.  I need this algorithm in my project. (reply to 45586)

— 2024-03-11 —

&rey: Create inMessage according to TL-B (beginCell().store(...internal(...)) will not help here, since you need to use all fields) and hash that cell. (reply to 45579)

Ram: Hello, is it possible to have a nested smart contract in TON or deploy a smart contract within a smart contract?

&rey: Yes. See: NFT collections. (reply to 45591)

Nxrix: Can a smart contract change it's code itself? Also what is the limit of comments?

Dmitry | backend4you.ton: yes. moreover - only sc can change its own existing code (calling set_code) (reply to 45593)

🅰🅻🅰🅽: If what you want is to calculate message hash after sending the boc, use: Cell.one_from_boc(result['boc']).hash.hex() and use api toncenter.com/api/v3/transactionsByMessage (reply to 45579)

Ar: Thanks @pcrafter and Alan Hsu. Got that. Just out of curiosity is there a faster way (less code) to do this after getting the TX from tonClient?

TON Bounty Bridge: ​Create ton SDK for laravel and free api  🏷 Developer Tool  Summary:  My suggestion and idea is, make a Ton SDK for Laravel.  Creator: khzg

User<5842008916>: Hi friends, hope someone here can help me understand my problem. I have an nft but it's on a evm wallet. This problem makes that i cant connect to ton dapps. But i can see the nft on the tonchain explorer. Someone knows if there is any chance (or will be) to move this nft to a compatible ton wallet??

TON Bounty Bridge: ​Creation of a CMS Drupal Plugin for TON Payments  Summary:  Develop a CMS Drupal plugin that facilitates payments using TON  Rewards: • SBT Bounty Reward • 600 USD in TON  Creator: seriybeliy11

TON Bounty Bridge: ​TON Payment Modules Plugin for October CMS  Summary:  Development of a TON payment plugin for October CMS.  Rewards: • SBT Bounty Reward • 700 USD in TON  Creator: seriybeliy11

Haerul: https://coinmarketcap.com/community/coins/toncoin/top/

TON Bounty Bridge: ​l10n for Tact-by-Example  🏷 Education  Summary:  Add to Tact-by-Example ability to localization.  Creator: chiliec

TON Bounty Bridge: ​Rust Example of Processing ton_proof on the Server-Side  🏷 Developer Tool  Summary:  Authorization on the backend for Rust stack applications  Creator: liketurbo

Ihor: Hi Folks! Is there a way to get transactions for "Inactive" address via API or it will show empty response until it's not initialized?

Жоуд: Hey guys I am trying to input my 24 keys and address in the mnemonic2key and keep getting back this error typeErrorL cannot read property subtle undefined even though I am just doing node index.js 24keys address

Жоуд: Using this

Жоуд: Even using this did not help or is this function incomplete (even though it outputs the base64 but rejected in mytonctrl) (reply to 45613)

&rey: Your site doesn't use HTTPS so browser refuses to provide cryptography functions. (reply to 45610)

Жоуд: Mmhmmm o

Жоуд: When I am moving tons from wallet to another it keeps returning this (take into account that the tons are locked)

Mahdi: Hello guys... Is there any open source project based on TON blockchain to contribute? Or does anyone need a junior developer on Ton??

Komron: Hey guys, is there any example usage of tonconnect for app subscription one time ?

Komron: How it should be done correctly?

Yhwach: { ok: false, error: "name 'tonlib' is not defined", code: 503 } https://ton.access.orbs.network 503  Is there any problem with network?

Uvix🌐: We are aware of this in to access

Uvix🌐: We are still inspecting

Yhwach: ah okay (reply to 45624)

PIMP: Hi there. Is any dev good with Ton NfT Contracts in here?

— 2024-03-12 —

B_BIG_MIC: How to make token verifed?

TonMoneyBox: Write to TonKeeper Support. (reply to 45628)

Жоуд: Should I keep reentering the elections every cycle or it does it automatically because I see cycles

Жоуд: I am using mytonctrl

­😇: Dont scam. Dev help me💪👍🔥 (reply to 45584)

Yhwach: is there a workaround for this problem? (reply to 45623)

&rey: Other RPC. (reply to 45634)

Yhwach: can't I host my own node and interact with it? (reply to 45635)

Ruslan: toncenter.com/api/v2/ (reply to 45634)

Yhwach: I actually tried to host my own node and I have an active node running

Ruslan: https://github.com/toncenter/ton-http-api (reply to 45636)

&rey: You can but it's not well-documented how. (reply to 45636)

Yhwach: yes exactly (reply to 45639)

Yhwach: I am using this one, but this is not connecting to the node I created

Yhwach: for some reason, even though I copied the local config to its folder

Ruslan: Do you mean ton-http-api readme? (reply to 45640)

&rey: docs.ton.org, mainly. (reply to 45644)

Yhwach: I am running a full node in the server, I did this and copied it to secrets mainnet file. Still connecting this one. What could be the issue? (reply to 45623)

Yhwach: The problem was I was using the client like this; const endpoint = await getHttpEndpoint({host: "http://123.123.123.123/jsonRPC"});  const client = new TonClient({endpoint});  while because I am hosting my own node, I could just use it like this:   const client = new TonClient({endpoint: "http://123.123.123.123/jsonRPC"});  Doing so fixed the problem. Thanks to @ruslixag for helping identifying the issue.

P.I 🦈: Hi guys, we look some of developers who can create bot in TG like this project - @ArrakkenPlanet_bot Or who can create mini game in TG

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 53 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 27  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

TON Bounty Bridge: ​TWAP Functionality for TON Blockchain  Summary:  Implement Time Weighted Average Price (TWAP) functionality to enhance TON blockchain trading experience  Rewards: • SBT Bounty Reward • TBD USD in TON   Created by kovetskiy

MS: How can i cross chain interoperability. I want to interact SUI Dapp by TON Dapp.

Vatshayan: How to verify the transaction hash? Is there is function present to validate hash ? using tonweb using nodejs

Mohammad: I am trying to write tests for telemint contracts but I am not able to send that one external message to touch the contract after deploying.  I get "Error while executing transaction: External message not accepted by smart contract". I am sure that the contract is active (by sending internal message with #topup comment) and it has enough balance to accept_message from external sources.  Am I doing something wrong?

Maxey: Is there a Jazzicon package available for TON?

Vatshayan: can getting information about transaction is possible through hash ? in tonweb ? is there is any tonweb

Kamran: Hi 👋🏻 Sorry if not in the right place, I'm looking for people who can build a simple game in WEB app. Maybe there are acquaintances who can help, I would be grateful for help.

Kushagra: Hi everyone, any multisig wallet application which I can use for TON?

Kenny$$Shillz: What type of transaction are you sending please (reply to 45654)

Mohammad: async sendTouch(provider: ContractProvider) {     await provider.external(beginCell().endCell());   } (reply to 45664)

Kenny$$Shillz: I'm not familiar with this workflow tbh (reply to 45665)

Mohammad: for this contract I am also trying to set initial data but I am confused.  I am trying to get subWalletId from the treasury contract below:  let deployer = await blockchain.treasury('deployer');  deployer.subwalletId  but it is not a 32 bit bigint and it says:  bitLength is too small for a value 25864362031580051672881143262354961757203966019052258013919040532360395946956. Got 32  based on telemint's contract I expect to store a 32-bit uint as subwallet_id but I don't know how to create one. (reply to 45664)

Mohammad: I am using blueprint and @ton/sandbox for testing (reply to 45666)

Kenny$$Shillz: Hmm I'm still not sure what U need subwalletid if you are just testing though (reply to 45668)

Kenny$$Shillz: I believe Subwalletid has a default value

Kenny$$Shillz: So why not just use that ?

Kenny$$Shillz: 698983191

Mohammad: To create contract from config I should put default data alongside the code.  nftCollection = blockchain.openContract(NftCollection.createFromConfig({       full_domain: 'full_domain',       content: 'content',       item_code: nftItemCode,       owner_key: deployer.address.hash,       royalty: beginCell()         .storeUint(10n, 16) // numerator         .storeUint(100n, 16) // denominator         .storeAddress(deployer.address)         .endCell(),       subwallet_id: deployer.subwalletId,       touched: false     }, code)); (reply to 45669)

Mohammad: I don't know if the error "External message not accepted by smart contract" is related to subwallet_id or what. (reply to 45672)

Kenny$$Shillz: Not it isn't (reply to 45674)

Mohammad: When I move accept_message to the top in recv_external it works fine

Mohammad: () recv_external(slice in_msg) impure {     var (touched, subwallet_id, public_key, content, item_code, full_domain, royalty_params) = unpack_collection_data();     throw_if(err::forbidden_touch, touched);     accept_message();     save_collection_data(true, subwallet_id, public_key, content, item_code, full_domain, royalty_params); }

Kenny$$Shillz: That's probably because it didn't have to validate the external message (reply to 45676)

Mohammad: I think there must be an error unpacking collection data so I think I have something wrong when initializing telemint's collection contract (reply to 45677)

Kenny$$Shillz: What is this contract doing please (reply to 45677)

Mohammad: This is the smart contract that Telegram intends to use in order to put some of its best usernames up for auction.  https://github.com/TelegramMessenger/telemint/tree/main (reply to 45680)

Жоуд: Why is the validator efficiency on 0.0?

Жоуд: Is it okay for a first cycle?

ally11: hello guys, is there a method for estimate correct fees for ton sending (tonweb)

ally11: import { WalletContractV4, TonClient, internal } from '@ton/ton';  const client = new TonClient({   endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', });  const wallet = WalletContractV4.create({   publicKey: key.publicKey,   workchain: 0, });  const walletContract = client.open(wallet); const seqno = await walletContract.getSeqno();  const transfer = await walletContract.createTransfer({   secretKey: key.secretKey,   seqno: seqno,   messages: [     internal({       to: secondAddress,       value: sendAmount,       body: "Hello",       bounce: false,     })   ], });  console.log('estimate:', await client.estimateExternalMessageFee(wallet.address, { body: transfer } ));  await walletContract.send(transfer);

ally11: Estimation output {   '@type': 'query.fees',   source_fees: {     '@type': 'fees',     in_fwd_fee: 1564000,     storage_fee: 108763,     gas_fee: 3308000,     fwd_fee: 1000000   } } Sum of storage_fee + in_fwd_fee + fwd_fee + gas_fee equals 5980763 which is 3 gram less then real fee paid for the transaction https://testnet.tonscan.org/tx/2xRWxV-7sIxMWpT8xmLGYgc5Z8YOk93GZVURJzw2Ro0= (0,005980766 TON = 5980766).  Fee estimation shortage may differ from 2 to 100 grams, but always less then real fee.  How to accurately calculate the transfer fee?

&rey: Check detalization for actual transaction. Likely storage fee is off. (reply to 45687)

&rey: Also, 1 TON = 1 Gram (called that in the past) = 1'000'000'000 nanoTON, indivisible units without specific name.

ally11: so how this need to be fixed? (reply to 45688)

Behrang: Since the storage fee is calculated per second, I believe that's a really hard and error prone task to calculate it exactly.   Maybe by the time you send the request, some time passes and the storage fee increases.   Maybe by the time your request arrives, another message has paid the due storage fee and you actually sent it more than needed.   I would just send more gas and try to return the remaining value in contracts.

TON Bounty Bridge: ​Add prefix dictionaries support to @ton/core  🏷 Developer Tool  Summary:  The idea is to expand functionality of the current .storeDictDirect method or add a new method (e.g. .storePfxDictDirect), that will accept slice key and convert it to prefix code.   Created by somewallet

Оскар: hi is it possible to get variable value in contract's storage without get method?

— 2024-03-13 —

Andrew: By parsing transactions yourself (reply to 45694)

Big: hello every one ! how can i get price of jetton token ? Please help

&rey: How do you define the price of jetton? (reply to 45696)

fatality: Is there an automatic fee change mechanism implemented in ton? Over the last week, the cost of ton has increased several times, while fees have remained at the same level. Are there plans to reduce fees?

Behrang: Fees are a calculated in TON. As price of TON has increased, transactions have increased fee in fiat money, but remained the same in TON value.  To change the transaction fees, validators have to decide on changing a config parameter.  I don't know of any plans currently, and prices are very volatile right now, but if TON stabilize at a higher number, say 10 or 20 USD per TON, then I think they will try to reduce fees.  Just note that contrary to other blockchains, transaction fees are not increased because of number of transactions or queue of transactions, or because users try to include theirs on the next block.   Transactions will be confirmed quickly thanks to dynamic sharding architecture. (reply to 45703)

Farshid: Hello, i've created mnemonic with @ton/crypto, but when i import in ton wallet gives another address wallet

Kenny$$Shillz: Did U activate the wallet by sending a transaction ? (reply to 45705)

Farshid: i just call open method in TonClient (reply to 45706)

Farshid:     const mnemonic = await mnemonicNew();     console.log(mnemonic.join(" "))     const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });     const key = await mnemonicToPrivateKey(mnemonic);     const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });     let contract = client.open(wallet);

Kenny$$Shillz: So the wallet is not active and that address isn't permanent yet (reply to 45708)

Vatshayan: Hy what is logical time in ton ? Is it the time at which transaction happen ?

Kenny$$Shillz: U have to send ton to the address and send one message from it before importing

Vatshayan: How to get ton transaction confirmation using ton hash ?

Vatshayan: is there is any method to do so?

Ar: Is it possible that while getting the transactions of account in 20 - 50 lt range the first time let's say it returns 20txs but when I ran this second time with the same lt range it will return 25tx? I'm using ton http api v2 if that matters

Kenny$$Shillz: Can U explain this a bit more please? (reply to 45712)

&rey: Is that just first and 4 last letters? (reply to 45705)

Kira: how can i create meme token on ton blockchain ? who can show me tutorial ?

Семён: Hi all, I have the same problem. Has anyone found a solution? (reply to 34279)

Farshid: Can i use message instead of tag memo?

Daniil: "tag" and "memo" are just nicknames for comments on exchanges (reply to 45719)

Adrian: Hello guys, I'm sure TON had somehting like revenue sharing/fee distribution on smart contracts to the smart contract creator, I've read it ages ago, I can't find it anywhere tho, can someone point me out in the right direction?

Daniil: there's no such thing in TON blockchain itself, but you're free to implement any kind of algorithms and rules in your own smart contracts (reply to 45721)

Adrian: I swear I've read this in several places, must be hallucinating :/ (reply to 45722)

&rey: Actually, some LLM might have hallucinated that in articles. (reply to 45724)

Kenny$$Shillz: If U are talking about distributing jettons then yes U can with highload wallets (reply to 45724)

Adrian: Any link? (reply to 45726)

Adrian: I really don't know in what context, I just know I've read it somewhere, a few times actually

Adrian: I guess that would be bypassable like nft royalty's in eth, right? (reply to 45722)

Daniil: Depends on how you implement it (reply to 45729)

Kenny$$Shillz: Search highload wallets on doc (reply to 45727)

Kenny$$Shillz: In docs

Kenny$$Shillz: I think you are talking about the nft sales contracts (reply to 45729)

Kenny$$Shillz: There'e an article about it on the cookbook I think

User<6123789878>: anyone needs developer?

Elio: Hi devs,  I'm looking for a developer who can help me with coding the source from EVM to TON. I already have the Frontend, Backend, and smart contract code on the EVM side.

Adrian: So there's theoretical ways to implement it that are superior to eth in that regard, because I don't think it can be solved in eth, right? (reply to 45730)

jasio: Hey devs, with stonks team we create first trading bot on TON chains. We already hit 10k users.  If you dont mind, I encourage you to check how it works and test it. I will be greateful if you use my referral link: @stonks_bot  sTONks telegram:  @stonksonton  You can dm me if you have some questions :)

Kaspars: @TrueCarry Hi, in the official TON docs there are links to your repo, which isn't found anymore: https://github.com/TrueCarry/ton-contract-forwarder/blob/main/func/ton-forwarder.fc  Any chance on restoring the examples? Thanks.

Tim: where? (reply to 45740)

Kaspars: Here https://docs.ton.org/develop/smart-contracts/examples is link to ton-forwarder.fc which doesn't resolve and shows 404 error

Vatshayan: In Ton getTransaction function, as a response we got all the details except status of transaction. But in explorer , status is also mentioned. Kindly resolve my issue.

Deedee: help me set FIFTPATH in macos

Vatshayan: Also response from getTransaction is coming different expect hash. as Account, destination and source is coming different as in tonscan

Vatshayan: ?

brian: Did you got any solution? (reply to 45712)

MS: Hello, How can i do cross chain interoperability?

Vatshayan: NO I dint got ! (reply to 45749)

Cryptofessor: try to use websockets (reply to 45751)

Deedee: can i help me (reply to 45745)

Cryptofessor: Is it possible to perform a swap using this guide/link, can anyone push me in the right direction? https://docs.ton.org/develop/smart-contracts/tutorials/wallet#sending-multiple-messages-simultaneously

TON Bounty Bridge: ​TON and Tact Chinese education materials  🏷 Approved 🏷 Education  Summary:  OpenBuild and ScaleBit team propose to create a series of educational videos about the TON ecosystem & Tact language development in Chinese. Our goal is to educate more people about TON Ecosystem and increase the number of developers, let more developers dive into TON Ecoststem, and develop products. This proposal contains examples of videos and docs.  Assignees: jueduizone

&rey: https://docs.ton.org/develop/dapps/cookbook#how-to-send-a-swap-message-to-dex-dedust. (reply to 45755)

Cryptofessor: I already tried this tutorial but unfortunately get an error when initialising the factory (reply to 45757)

Cryptofessor: Is it possible for example to perform a swap in combination with a transfer within the same transaction?

Cryptofessor: Is it okay if I send you the error later today? (reply to 45758)

Behrang: export FIFTPATH=/ton/crypto/fift/lib (reply to 45745)

Жоуд: Hello guys any idea about how to break the validator cycle?

&rey: set stake 0. (reply to 45763)

&rey: You may share it in chat as well, I guess? (reply to 45760)

Жоуд: The thing is that the wallet reentered the election

Жоуд: And I want to exit when I set stake 0 its still there

Жоуд: So should I wait till the next cycle?

Cryptofessor: Yes will do. I meant in the chat haha. Will do when I get home (reply to 45765)

Fortuné: Hello, do we have web or telegram bot to update realtime the new token recently release?

Fortuné: And if we have any documents about new listing token?

Kenny$$Shillz: I made one that reports new token contract deployments but it's currently not hosted (reply to 45773)

Cryptofessor: Not sure if you're available at the moment, but having this in my code; const tonClient = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com", }); const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));  gives the next error; Error: Invalid address (for line const factory = ....) (reply to 45765)

User<6301772465>: I want to development an mini app cam anyone help me

Doggetti: hi

Doggetti: Is there a maximum number of transactions a block can hold?

User<6237448962>: Who needs developer?

Dauda: Rf

User<6301772465>: I need developer (reply to 45782)

User<6237448962>: pls dm me (reply to 45784)

Howard: Do we have any Jettom Staking to farm tokens example tho?

Howard: https://github.com/JVault-app/fixed-staking-contracts/blob/master/contracts/lockup_nft_collection.fc (forwarded from nonam3e)

Howard: I know this is one part. But this is based on NFT design. Think can more easier.

Nha: hi, do you know where I can get support about TonBridge? I have not received my funds after 30 minutes already. ^_^

Bear: how many bits in store_coins ?

Howard: check with https://t.me/ton_help_bot (reply to 45789)

Daniil: it depends on how large is your number (reply to 45790)

— 2024-03-14 —

Cryptofessor: @pcrafter any chance you could check this out ser (reply to 45778)

к.: Hello guys, can you help me with That?  Custom or application-specific primitives — Efficiently perform spe-  cific high-level actions required by the application (in our case, the  TON Blockchain), such as computing hash functions, performing ellip-  tic curve cryptography, sending new blockchain messages, creating new  smart contracts, and so on. These primitives correspond to standard  library functions rather than microprocessor instructions.  Does that mean hash functions, deploying contracts, sending messages, etc. are not TVM instructions and OP codes at all? And they will get done by some libraries written in high level languages which get compiled into TVM instructions too?   Or no, they have their own OP code too?

Kenny$$Shillz: 128 I think (reply to 45790)

Kenny$$Shillz: Hope you are not passing a string for factory address (reply to 45778)

&rey: 4-124. Its name in serialization is "VarUInteger 16". (reply to 45790)

Elio: Hi devs,  I'm looking for a developer who can help me with coding the source from EVM to TON. I already have the Frontend, Backend, and smart contract code on the EVM side. Thanks

Bear: people said it's dymamics (reply to 45803)

Kenny$$Shillz: I wasn't sure tbh (reply to 45807)

Hà My: Can someone help me?

Hà My: My token was created successfully (where can I go to update social  and how to add liquidity)

Fortuné: https://dedust.io/pools/deposit (reply to 45810)

Hà My: thank sir (reply to 45811)

Hà My: Please tell me more (where can I lock my lp or token, sir)

Hà My: and let me ask (when I have added LP to the test, can I withdraw the lp from the test project)

Behrang: More details here:  https://t.me/tondev_eng/42653 (reply to 45790)

Vatshayan: How to confirm ton transaction ? is there is any api method or any status to check transaction is confirmed or not ? please help

Hà My: I want to develop a mini app for my project (but I don't know about code, can anyone help)

&rey: TON consensus is built in the way that any transaction requires only one confirmation. (reply to 45818)

🅰🅻🅰🅽: you may search for dpos algorithm, which does not require any finalize step, i remember that cosmos is also one of it (reply to 45818)

&rey: Finality levels: 1. Containing block is referenced in masterchain. 2. Shardchain block is signed by 2/3 of validators. 3. [x] Shardchain block is signed by one validator, who generated it. 4. [x] Transaction emulation results.

Doggetti: But how many txs can be included in one block ?

Doggetti: Max

Behrang: As much as it fits. Depends on the gas usage of transactions included in that block. (reply to 45823)

Vatshayan: https://tonscan.org/tx/Csnb6MjHNuBXopzMKhZxYl-Sa8AmW3zFwHfRTTlTdXA= This transaction has been showing failed on the explorer for almost a day, but today it is showing success, how is that possible ?

&rey: Because there is no definition of success yet. (reply to 45826)

saul: How can I close a pool and withdraw its balance?  I've withdrawn all of nominators and validator staking amounts, but there's still 22 TON left in the pool's balance.

Vatshayan: but yesterday it was showing failed on status !! (reply to 45827)

MS: Hello, How can i do cross chain interoperability?

Cryptofessor: It’s actually the exact same as in the docs. I’m very confused (reply to 45804)

Paul: hi ton team. If we build a dapp on your chain, will we still have support?

&rey: Is there any reason why it couldn't be so? (reply to 45830)

&rey: Not documented. (reply to 45831)

MS: Thanks for your reply (reply to 45835)

&rey: The exact same support, meaning no special consideration from the core team. (reply to 45833)

Big: hi team, how to send jetton token with nodejs ! Anyone help ?

Ihor: Is there a way to get current TON self-hosted node version? Tried through validator-engine-console and getstats but no version is there.

N - RFNW: Hello, where can I find documents about deloying my coins to ton?

&rey: minter.ton.org (reply to 45840)

Vatshayan: We are working on a exchange crypto wallet, after monitoring for addresses or hashes we need to update the balance of user, if there won't be any definition of success, how can we add the balances or our users ? Suppose we update a user's wallet with 1 million tokens and the next day it fails, how we will manage it ? (reply to 45827)

&rey: Then it's your own definition of success: "your service's wallet has received deposit that didn't bounce back". Then, you should check for that. (reply to 45842)

Mikko: As a developer, what kind of features I can use in my Telegram mini app to block bots?

TON Bounty Bridge: ​No/Low-code Smart Contract Creator Application  🏷 Developer Tool  Summary:  This proposal outlines the development of a user-friendly application that simplifies ...   Created by mhbdev

Kim Búp - 0856.628.628: Hello, how can i become a validator of Ton network? How many Ton for 1 node, and the benifits now? thanks you so much

Babak: Hi all.  I created a wallet in Feb2022, and backed up the address, pubkey and seed words.  Now when I recover the wallet using seed it shows a different address and zero balance.  Any ideas how I can recreate my wallet with the legacy addresses?

&rey: What was its version? Also, the wallet might be frozen. (reply to 45853)

&rey: 400K TON of stake at the minimum. (reply to 45848)

Babak: I only know it was the reference wallet from Ton.org as of late Jan/early Feb 2022 (reply to 45855)

PMAR56: Hello everyone! I need to know if there is a way to recover my secret words so I can access my TON wallet. Someone to communicate with or some recovery method. Thanks a lot!

&rey: What do you have then, if not secret words? (reply to 45859)

PMAR56: My wallet number and my data associated with the creation of the wallet (My name, email and phone number)

User<6601463160>: Hello, I am a senior front-end & contract developer, looking for an open position now.

LeO: Hi sir

&rey: None of that data was used to generate secret key, so you are unable to restore it by anything short of mining the mnemonic. (reply to 45861)

Dmitry | backend4you.ton: There were several different versions of wallet (v1, v2, v3r1, v3r2, v4) that have different features and make different address from same seed words. Try wallet that can check all previous versions of wallet type. Tonhub is one of them as I remember, but maybe Tonkeeper too… never tried. Look for feature called like “old wallet versions” or “upgrade wallets”. (reply to 45853)

Dmitry | backend4you.ton: Also, open your address in explorer and check what “wallet type/version” it says (reply to 45874)

Sina: What will hapen for transactions fee when TON price goes up ? Forexample 1TON = $1 and every transaction has 0.01 TON fee, and it's $0.01 What will happen if price go up to $100, is the fee stay at $0.01 or it's goes up to $1 ?

Cryptofessor: @pcrafter hey man any chance you could check this our?:) (reply to 45778)

&rey: Check const factory = tonClient.open(Factory.createFromAddress(Address.parse(MAINNET_FACTORY_ADDR))); (reply to 45778)

Cryptofessor: if (source.indexOf(':') === -1) {                    ^ TypeError: source.indexOf is not a function     at Address.isRaw (/node_modules/ton-core/dist/address/Address.js:74:20)     at Address.parse (/node_modules/ton-core/dist/address/Address.js:104:26)  Error I get on that line

Cryptofessor: nevermind, apparently MAINNET_FACTORY_ADDR is an object

Cryptofessor: and not a string

Cryptofessor: it's just so hard if the docs aren't reflecting the real case haha

Cryptofessor: const nativeVault = tonClient.open(             VaultNative.createFromAddress(                 await factory.getVaultAddress(Asset.native()),             ),         );   Gives me this error "DeDust error:  Error: Invalid argument". I can also send the whole stacktrace but thats kinda much hehe. Let me know if that is needed please. And thanks in advance!

Cryptofessor: same error when trying to get the pool, so im temporarily did a workaround to check if it would work.   const pool = tonClient.open(             Pool.createFromAddress(                 // await factory.getPoolAddress({                 //     poolType: PoolType.VOLATILE,                 //     assets: [Asset.jetton(Address.parse(PROXY_TON)), Asset.jetton(jetton.address)],                 // }),                 Address.parse("EQBI2Zke6sLTTxjMTi-kuacCEqBYHooO7TQqDKw_V9dZOcdu")             ),         );

alkhanov: hello, I can't connect to my highload wallet using mnemonics, although everything was fine before that. Does anyone know what happened?

&rey: Do you perhaps have the error text? (reply to 45887)

alkhanov: Traceback (most recent call last):   File "/home/tests/highload_wallet.py", line 29, in <module>     mnemonics, pub_k, priv_k, hv_wallet = Wallets.from_mnemonics(mnemonics=mnemonics, version=WalletVersionEnum.hv2, workchain=0)   File "/usr/local/lib/python3.9/dist-packages/tonsdk/contract/wallet/__init__.py", line 57, in from_mnemonics     raise InvalidMnemonicsError() tonsdk.crypto.exceptions.InvalidMnemonicsError: Invalid mnemonics error. (reply to 45890)

alkhanov: everything worked before that

Hà My: How to create nft ton chain sir ?

Вадим: Hi! I want to run a TON Site and a reverse proxy on different servers, as described in the documentation . Do I need to establish communication between the site and the reverse proxy via https if I want secure communication?

Sina: Where can i find the answer ? (reply to 45877)

Babak: Thank you.  I tried recovering my wallet on Tonhub (Android) but still showing zero balance and a different address.  On tonscan.org my address says State inactive.  It doesn’t provide a wallet version.  Same on tonwhales.com explorer (reply to 45874)

Cryptofessor: @pcrafter any idea ser :)? Sorry for bothering constantly (reply to 45885)

Dmitry | backend4you.ton: Secure against what? If you think that your hosting provider can intercept and modify data between your servers - maybe this provider can also modify data directly on servers? (reply to 45894)

Dmitry | backend4you.ton: Tonhub had a special screen where you can see all previous versions with corresponding addresses. Have you checked them all? (reply to 45896)

Вадим: if the website and the reverse proxy, for example, are located on machines of different providers, then the traffic between the servers will be routed over the public Internet and/or pass through one or more network segments managed by third parties. And it seems that if you do not configure transport encryption, then traffic in plaintext can be easily eavesdropped on. (reply to 45898)

Dmitry | backend4you.ton: If your servers are in different networks and you do not trust all intermediate nodes - yes, add https (reply to 45900)

Вадим: Thanks! (reply to 45901)

Handsome: Hello guys.  The only token with real utility is on the polls to be added to the open league. True developers will support their own to vote The tonnel in the open League. The only token with real utility.  Think about what I said. Memecoins or meme tokens will never develop the toncoin community.  Vote for privacy, vote for freedom 💪  Vote Tonnel for the open league  Vote 👉 here

olfix 🦴: Could you elaborate a lil bit more? (reply to 45906)

Lorenzo: Hi everyone, I would like to automate the sending and receiving of payments that I receive in tons on my wallet, but I'm not very expert in programming. Is there a way to manage my wallet via server by configuring it quite simply? Alternatively, is there a service that allows me to manage my wallet through the use of API?  Thank you

Sina: What is @wallet deeplink schema ?

— 2024-03-15 —

Kristina: I think nowpayments will suit you  Or another gateway:) (reply to 45910)

🆙 UXUY 🌱SEED 🐸' 🐾 📦 Bums: how to set auto confirm transaction in wallet?

&rey: No way available and unlikely to be created. (reply to 45913)

🆙 UXUY 🌱SEED 🐸' 🐾 📦 Bums: i have multi transaction

🆙 UXUY 🌱SEED 🐸' 🐾 📦 Bums: i cannot confirm manual

&rey: Then wallet applications do not suit you.

Elio: Hi devs,  I'm looking for a developer who can help me with coding the source from EVM to TON. I already have the Frontend, Backend, and smart contract code on the EVM side.

Hà My: How to verify token sir

Nxrix: If I make a ton wallet and make the source public can it be added to the websites who show recommend wallets to use?

Maller🆓 🦴🐈‍⬛: Hello sir  Can I ask how to create your own token on ton chain? (reply to 45914)

Nxrix: you can use minter.ton.org (reply to 45926)

Behrang: In your example it will go up to $1. However it's likely that the config is updated to bring it down to usable and cheap levels. (reply to 45877)

Maller🆓 🦴🐈‍⬛: After creating my token, where to add lp? (reply to 45927)

Nxrix: sadly I don't have more information about these( (reply to 45930)

Maller🆓 🦴🐈‍⬛: It's okay thanks (reply to 45931)

TON Bounty Bridge: ​Игры по типу старого денди  🏷 Developer Tool  Summary:Денди или сега это игровые приставки, о которых большинство вспомнят и будет интересно играть и внед...  Created by Autoperekup

MS: Hello, How can i use bridge.ton.org with testnet?

Maksim: if youre in election process than you are not validator yet. you can also check this using status command, validator index will be -1 if you are not validator and positive number otherwise (reply to 45935)

Sina: Where to get test TON ?

Berkay: Why i didn't receive it?

Behrang: https://t.me/testgiver_ton_bot (reply to 45939)

David Prince: hi any admin here?

David Prince: I have a pending transaction, how do I resolve it?

David Prince: Me too (reply to 45940)

Berkay: They say ıt's suspended, they are working on it (reply to 45945)

Sergey: how to switch to testnet in tonkeeper with 4.0 version? I don't see any choice anymore

Оскар: enable dev mode in "secret settings" and add new wallet - you will see new option about testnet wallet (reply to 45947)

Александр: https://t.me/wallet_supportbot (reply to 45949)

David Prince: me too (reply to 45949)

K: Hey Guys I'm a Solidity dev and one of my clients is looking for a TON contract, spent a few days diving into it but its just a completely different world to EVM so I've told them i'll try and find them a proper TON dev. If anyone is looking for work and has knowledge or experience on how to develop a taxable contract or Rewards Contract drop me a DM

Nxrix: is there a free api to get data of all nfts in my collection?

Nxrix: how to turn this type of address into EQDU... address simply in js?

Sina: How get contract state in blueprint ?  I use  provider.api().getContractState  But it's get error

will be rich: Hi need an help for a pool farm on stonfi..someone could help me..i m not a dev but take the project..so will be very appreciated an help

TON Bounty Bridge: ​Lootbox Contract  🏷 Approved 🏷 Developer Tool  Summary:The following footstep suggests to create a standard for Lootboxes contracts  Rewards: • 1000 USD in TON  Assignees: TheSmartnik Created by TheSmartnik

Nxrix: how to parse raw address in to base64 url address using js

&rey: https://docs.ton.org/learn/overviews/addresses (reply to 45963)

Denis: also please notice what it's ony representation form and you should use internal in your system raw address. and for representation form your should use flag .is_wallet from response (reply to 45958)

Denis: UQAddRESS for wallets and  EQaDDreSs for non-wallets

Nxrix: yeah I think someone said EQ is for smart contracts and ... but UQ is for wallets (reply to 45966)

Андрей: nometa.xyz (reply to 45968)

Arena: for what (reply to 45972)

Zyxep: در چه موردیه (reply to 45975)

Shishir: Hello everone, we are in the process of creating a MultiSig wallet. Does anyone know if there's a widely recognized MultiSig wallet built on TON that we can use for our project?

User<7129843206>: Hello everyone, an admin of TON society introduced this chat room to me, can I post about my expertise pls  @awesome_doge or other admins

Hidanz: Can someone help me i have trouble making this working , so basically i am using ton-connect to connect a wallet , and want to transfer x amount of a jetton from the connected wallet to another wallet , this is my code but when i want to confirm the transaction it says unable to verify transaction, this is my code :  const connector = getConnector(chatId);      await connector.restoreConnection();     if (!connector.connected) {       await ctx.reply("Connect wallet to send transaction");       return;     }     const connectedAddress = connector.account?.address!;     console.log(connectedAddress);      const jettonAddress = "EQD7zP5MJ1SUHzcAerqSc5fGwpfytew5fNPkZWIG79JRS-UC";     const receiveraddress = "UQCi0thc5PzBv3mup9g-kvYIu4uMBfIIoSkrqzuc-sEuD7gi";     const amount = 1000000000000; // 10,000 tokens with decimal = 9      const body = beginCell()       .storeUint(0xf8a7ea5, 32)       .storeUint(0, 64)       .storeCoins(amount)       .storeAddress(Address.parse(receiveraddress))       .storeAddress(Address.parse(receiveraddress))       .storeUint(0, 1)       .storeCoins(500000000)       .storeUint(0, 1)       .endCell();     pTimeout(       connector.sendTransaction({         validUntil: Math.round(           (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) /             1000         ),         messages: [           {             address: jettonAddress, // Sender jetton wallet             amount: toNano(0.5).toString(), // Amount in nano tokens for network fees             payload: body.toBoc().toString("base64"), // Payload with jetton transfer body           },         ],       }),       Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)     )       .then(() => {         ctx.reply(`Transaction sent successfully`);       })

— 2024-03-16 —

Dickson: Hello, I sent Ton from my walet to my Ton space. It’s been 13 hours and the transaction is still pending

Komron: hello guys

Komron: what's the prefered size of iconUrl in tonconnect-manifest

Elio: Hi devs,  I'm currently seeking a skilled developer to assist me in coding the source from EVM to TON. I already have the Frontend, Backend, and smart contract code on the EVM side. If you have experience and expertise in working with TON and are interested in this project, please reach out to me.

Alex👌👌🤪🤪: const connector = getConnector(chatId);      await connector.restoreConnection();     if (!connector.connected) {       await ctx.reply("Connect wallet to send transaction");       return;     }     const connectedAddress = connector.account?.address!;     console.log(connectedAddress);      const jettonAddress = "EQD7zP5MJ1SUHzcAerqSc5fGwpfytew5fNPkZWIG79JRS-UC";     const receiveraddress = "UQCi0thc5PzBv3mup9g-kvYIu4uMBfIIoSkrqzuc-sEuD7gi";     const amount = 1000000000000; // 10,000 tokens with decimal = 9      const body = beginCell()       .storeUint(0xf8a7ea5, 32)       .storeUint(0, 64)       .storeCoins(amount)       .storeAddress(Address.parse(receiveraddress))       .storeAddress(Address.parse(receiveraddress))       .storeUint(0, 1)       .storeCoins(500000000)       .storeUint(0, 1)       .endCell();     pTimeout(       connector.sendTransaction({         validUntil: Math.round(           (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) /             1000         ),         messages: [           {             address: jettonAddress, // Sender jetton wallet             amount: toNano(0.5).toString(), // Amount in nano tokens for network fees             payload: body.toBoc().toString("base64"), // Payload with jetton transfer body           },         ],       }),       Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)     )       .then(() => {         ctx.reply(`Transaction sent successfully`);       })

Ginafer: const connector = getConnector(chatId);      await connector.restoreConnection();     if (!connector.connected) {       await ctx.reply("Connect wallet to send transaction");       return;     }     const connectedAddress = connector.account?.address!;     console.log(connectedAddress);      const jettonAddress = "EQD7zP5MJ1SUHzcAerqSc5fGwpfytew5fNPkZWIG79JRS-UC";     const receiveraddress = "UQCi0thc5PzBv3mup9g-kvYIu4uMBfIIoSkrqzuc-sEuD7gi";     const amount = 1000000000000; // 10,000 tokens with decimal = 9      const body = beginCell()       .storeUint(0xf8a7ea5, 32)       .storeUint(0, 64)       .storeCoins(amount)       .storeAddress(Address.parse(receiveraddress))       .storeAddress(Address.parse(receiveraddress))       .storeUint(0, 1)       .storeCoins(500000000)       .storeUint(0, 1)       .endCell();     pTimeout(       connector.sendTransaction({         validUntil: Math.round(           (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) /             1000         ),         messages: [           {             address: jettonAddress, // Sender jetton wallet             amount: toNano(0.5).toString(), // Amount in nano tokens for network fees             payload: body.toBoc().toString("base64"), // Payload with jetton transfer body           },         ],       }),       Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)     )       .then(() => {         ctx.reply(`Transaction sent successfully`);       })

Dickson: Why is no one here replying me. You are devs but know nothing and a ton pending transaction for hours (reply to 45980)

&rey: Because blockchain is quite fine, it doesn't consist of @wallet only, is it? (reply to 45986)

&rey: I guess you will either get an auto-refund or transaction will be complete.

A: A: Hi auction ended , but the button to accept the highest bid did not appear , stuck ?   getgems .io/nft/EQAPrE21jalztoJxl3d20m_YNna3HZdACZ6ePdyz9bFkV5ey  Is it possible to accept the offer differently by sending for a contract ?

PhantomX: Hello everyone  I’m a junior front end developer Currently in search for open roles

финн: Hello everyone, let me introduce myself. I am backend Node.js/ Golang dev with 3 year of experience. And I probably would like to particiape in any kind of development somehow related to TON) For profit or just for fun  Have a nice day. (reply to 45992)

Kenny$$Shillz: Just be patient there was some network issues yesterday (reply to 45986)

&rey: *there were certain service issues yesterday, blockchain worked fine. (reply to 45994)

Kenny$$Shillz: Is there a limit to how many storage variables that can be added to jetton contract? (reply to 45995)

&rey: They all must fit into 65535 cells. Processing and saving them must fit in 1 TON of gas. (reply to 45996)

Kenny$$Shillz: For example im trying to make a Jetton seeks to implement a max supply, a fee percentage and max transfer amount variable.. but it compiles well when I pass these as arguments to the contract init function and set them within  the constructor.. but when testing I observed that the initial mint operation doesn't seem to have run.. I expect the Jetton balance of the owner contract to equal the initial mint amount but I get 0

Kenny$$Shillz: Solved!!  I fixed this issue by simply increasing the amount of ton used to deploy the contract from 0.05 to 0.1ton (reply to 45998)

Corvus: How long to receive TON when deposit? I wait 30 minutes and still can't see my funds in TON wallet?

Corvus: This is my tx hash https://tonscan.org/tx/by-msg-hash/8RFQIF1PqOvw2zG0TtDzzPgUp_FnDNzj4GF9av-nZM0=

Corvus: Can everyone help?

Corvus: I use telegram wallet

&rey: Wdym can't see? (reply to 46000)

&rey: And then point to some transaction.

🆙 UXUY 🌱SEED 🐸' 🐾 📦 Bums: Why can a transaction be completed in a few seconds, I haven't even seen it yet 😄 https://getgems.io/nft/EQC1MGPMUQg8yaM6yNzVI63k-y-gr8opArEC1ZbSNoaEoAV8 (reply to 45999)

DEEP: 👍😁 (reply to 46006)

&rey: Sale, you mean? Because it can... (reply to 46006)

🆙 UXUY 🌱SEED 🐸' 🐾 📦 Bums: this bot? (reply to 46008)

🆙 UXUY 🌱SEED 🐸' 🐾 📦 Bums: you can do it? (reply to 46008)

Amir Kahoori | P2P.org: Hey there, Is there a method for enforcing comments on incoming transactions for a particular address? For example, can exchanges require(On-Chain) that users include a comment or tag/memo when transferring funds to the address?

&rey: I have guesses about the theory how to build it. Yes, those are bots. (reply to 46010)

&rey: Yes, that requires a custom smart-contract. (reply to 46011)

Amir Kahoori | P2P.org: So the address should be a contract? Is there a sample contract I can check out? (reply to 46013)

Nxrix: is it possible to get total sale volume of NFT collection for owner

&rey: Actually, every initialized account is a contract) Sample... I believe no, just read about bounce. (reply to 46014)

🆙 UXUY 🌱SEED 🐸' 🐾 📦 Bums: in can send private message for you (reply to 46012)

Hidanz: what does exit code : 705 in transaction mean ?

MisterWhales: Is there a way to create a meme coin easily like we do on solana chain?

Komron: return await tonConnectUI.sendTransaction({   validUntil: Math.floor(Date.now() / 1000) + 60,   messages: [     {       address: walletAddress,       amount: toNanoTON(calculatedCommission.amount),     },     {       address: commissionAddress,       amount: toNanoTON(calculatedCommission.commission),     },   ], });    Hey guys, does tonconnectUI support batch transactions ?

&rey: minter.ton.org (reply to 46019)

&rey: Depends on how the contract defines it. Is that NFT? (reply to 46018)

Hidanz: no jetton transfer (reply to 46023)

Ton Inu advertising: https://app.toninu.tech/tools/jettons (reply to 46019)

Ton Inu advertising: it is better than minter

Ton Inu advertising: they shold add taxes soon

&rey: How so? (reply to 46026)

&rey: You're not wallet owner, it seems. (reply to 46024)

Ton Inu advertising: because it is creator jetton and locker (reply to 46028)

Ton Inu advertising: soon should be possible set tax

Komron: Could someone answer this, bacause I made a several transactions, they lost (reply to 46020)

Komron: Didn’t get any toncoin

&rey: Were they sent? (reply to 46032)

Komron: Yes (reply to 46034)

&rey: Maybe there was not enough gas?

Komron: It’s been over 30 mins

Hidanz: i am using ton-connect to transfer jetton from connected wallet to another (reply to 46029)

Komron: Heres the transaction link

&rey: Well, it did transfer TON! What's the problem, then? (reply to 46039)

Komron: Of course, but I do not see it on my wallet’s (reply to 46040)

Komron: Like I didn’t received any notification and etc. the balance hasn’t changed

&rey: Is your wallet UQAujiC3EvnTiJSZ_NAjntGA-rxVimZB5oCi-NLI8DG_e0x9? (reply to 46041)

Komron: Yes they are both of mine

&rey: Then your wallet app is failing. (reply to 46044)

Komron: And one question, can It depend on WebApp url on tonconnect-manifest ?

Komron: Meaning, I run the webapp which is not equal to tonconnect manifest’s url ?

Komron: I run the webapp from the button in other bot, but the webapp url in manifest is different

Komron: And I noticed one thing, I defined 2 transactions, but in some cases I see 1 defined when I need to confirm the payment. I think if the balance is less than total, it will show the nearest acceptable amount and show it

AIMICRYPTO MeshChain.Ai: I deposited ton to my wallet over 20 minutes ago it's not yet in my wallet  What's to be done

Equfix: Hey , so I sent some TON from my ton space to my telegram ton wallet like over an hour ago   TX link : https://tonviewer.com/transaction/480f293daafc0e3450b2175befc86f01a1440ded909f9af5332ba14defba5dcf   - the transactions appear to be successful and the balance does show up in the explorer but in my telegram wallet the deposit isn't showing up    - I did check the Verify the address

Komron: Same here (reply to 46052)

AIMICRYPTO MeshChain.Ai: Same issue I'm having  Deposited from OKX (reply to 46052)

No: Hi guys. How do I switch to testnet on tonkeeper? Before I could do it by pressing the version on settings several times, but now the switch button in Dev Menu is gone

Komron: Guys, I have a question about tonconnect-ui/react. Now I'm doing 2 transactions. 1 TON, 0.97 TON to one wallet, and second is 0.3 TON. But when user have inufficent balance, the modal shows nearest acceptable transaction. I want to show inufficent balance when the user's wallet cannot pay both of them. is there any solution ?

Sina: Hello I sent a token to my contract, I expected the recv_internal function of my contract to be executed, but it has not executed  i checked in tonviewer, and i found this   Compute Phase Skipped: true

Sina: https://testnet.tonviewer.com/transaction/aa8da3ad7be812b0b52812c98cfcee2fbad8b66030bc7e9392d09bae89288daf (reply to 46060)

&rey: Notification message didn't contain enough TON. (reply to 46060)

nonam3e: You may create your own deserialization type (reply to 46065)

Sina: how gassless transactions works ? as i saw, gasless is in TON roadmap and where can i read more about it ? is there any document ?

&rey: Plugins are one way to implement them. (reply to 46068)

Sina: How is works ? I mean the mechanics of gasless (reply to 46071)

Sina: How is possible to calculate gasfee off-chain ? I want to calculate the fee before broadcast the transaction

TON Bounty Bridge: ​TON Static Analysis based on Symbolic Execution  🏷 Developer Tool  Summary:Static analysis tool for TON with following advantages:  Rewards: • 💰 9000 USD • 🕑 6 weeks (3 sprints)  Created by korifey

Komron: Any solutions please ? (reply to 46058)

Elvis Javier DUCKS 🦆 : Hello, I have a question when a transfer is in pending status for how long can it be successful?

nik: Hello, I am trying to swap token -> ton with dedust sdk.  https://docs.dedust.io/docs/swaps  It works when I am swapping ton to jetton. But not jetton -> ton.  In the docs, VaultJetton.createSwapPayload({ poolAddress }), where is VaultJetton from?  Is it this ?  const tokenVault = tonClient.open(await factory.getJettonVault(Address.parse(tokenAddress))); but in this case, it does not have createSwapPayload function  Thanks

— 2024-03-17 —

nik: And question, tokenWallet == sender.address? tokenWallet https://tonviewer.com/EQCGvn3Ao52y_FgqAsmpwW4FZH1LyM2xRYTEYzrQJPbGmALI, tonviewer empty

Roche: New Jetton: JASON (JASON)  CA: EQDSPVjysEwDjoboug88loqEwDQqXvU9EEhTlJAG4JS1nnEK  Supply: 1,000,000,000 (+9 decimals)  🔗: TG ? | Web ? | Twitter ?  Code | Deployer | Holders

昊京无敌666🧢: what's this bot? (reply to 46081)

Roche: No

DEEP: 👍 (reply to 46081)

Dmitry | backend4you.ton: After enabling dev mode, return to main screen and start adding new wallet - you’ll see new/4th option “testnet” (reply to 46057)

Octree: hello there.  How to send transaction using ton js or tonweb? I want to send transaction that stonfi sdk generated.

Kenny$$Shillz: Use the stonfi docs (reply to 46087)

Octree: Stonfi is just a use case. I am a junior dev. And I just don’t know how to send transactions using ton or tonweb. And the doc of ton only contains the transfer (reply to 46088)

Dmitry | backend4you.ton: Any “special” transaction needs “special” body. You need to read docs of corresponding system to understand what body structure it expects. One wrong bit and your tx may be rejected/returned or ignored. (reply to 46089)

к.: https://kehiy.medium.com/ton-virtual-machine-its-design-and-how-it-works-5e6a8fba3bf7

🆙 UXUY 🌱SEED 🐸' 🐾 📦 Bums: how to track all transaction of nft in tonview?

nik: Is there any way to get new jetton deployements on TON?  With api

nik: https://github.com/tonkeeper/tongo/blob/master/abi/messages.md  which code for deploy jetton?

Nxrix: https://tonviewer.com/EQBoG5I1YO750C1jCp0EtjASwi8lE_YoENoN_Qe3YIAFvKN_ is that a bot?

Bruce Long: How to create contract presale sir

CryptoMM Cool: How to deploy contract wallet when send TON to orther wallet by js code?

Bruce Long: Can anyone guide me to deploy the presale contract? I will pay a fee of 5ton

nik: https://github.com/tonkeeper/tongo/blob/master/abi/messages.md  is this list still updated?  for dedust nothing works, for stonfi quite ok

Sina: What is proxy-ton ?

Nxrix: There are more random wallets in testnet right? I wrongly entered my seed phrase in testnet and saw a used wallet

Вадим: Hi! Please tell me, if I place a TON Proxy between the client and the server, how will websocket connections work? If they do not work correctly, what tools can be used for this?

Дмитрий: Hello, guys! I have a question. Can I edit already deployed smart contract?

Daniil: Only if such functionality was included in smart contract (reply to 46109)

— 2024-03-18 —

Virus.X 📓: how to create token on Ton chain ? pls

&rey: minter.ton.org (reply to 46113)

Howard: Hey everyone, we're hosting the HackerHouse in Hong Kong on April 4th.  The prize pool exceeds $1 million; please review the details and register now if you're interested!  - https://tonhackerhouse.com - https://twitter.com/TONHackerHouse - https://t.me/hackerhouse_ton  Feel free to DM me or Jessie(@jessieagain) on Telegram, or set up the call with howard@ton.org. If you're interested in either sponsoring or becoming a tutor, you're very welcome as well.  Thank you. (forwarded from Howard)

Virus.X 📓: thanks !!! (reply to 46115)

Howard: I mean we also need tutor, cc @pcrafter , @Gusarich , @TrueCarry , @andreypfau 😃😽 (reply to 46116)

TON Bounty Bridge: ​Bounty Bridge: Connecting Developers to Bounties Initiatives through Automated Alerts  🏷 Approved 🏷 Developer Tool  Summary:The bot will monitor repositories for new issues, automatically informing developer chats about new ...  Rewards: • SBT Bounty Reward • 1800 USD in TON  Assignees: nessshon Created by delovoyhomie

TON Bounty Bridge: ​Bounty for Updating TVM Instruction Documentation  🏷 Approved 🏷 Education  Summary:Update the TVM Instruction documentation including internal search functionality and distribution of...  Rewards: • SBT Bounty Reward • 200 USD in TON  Assignees: krau5 Created by reveloper

Hung: hi there, i just deploy a new jetton on minter.ton.org but after deploy it didn't redirect me to the new jetton address page that why i didn't know which is my jetton address May i ask is there any way to know my jetton address through my wallet?

Vladimir: Try look at explorers like https://tonviewer.com/ (reply to 46128)

Hung: i have look but i couldn't find any jetton address there (reply to 46129)

Hung: ah ok i got it. thank you very much

Howard: nice (reply to 46127)

Alexey: Hi, maybe someone developed gambling on TON Blockchain? I'd like to chat about this.

MS: Hello, I want to election on the TON network and How can i use bridge.ton.org with testnet? How can I do these?

Nxrix: Is it legal to make a contract that will trade tokens automatically ?

&rey: This isn't quite question about blockchain development? (reply to 46135)

Kenny$$Shillz: Use ton viewer and search for token deployment transaction in your wallet transa (reply to 46128)

Nxrix: Well I saw something that wasn't a wallet and It was exchanging ton and tokens automatically then sending the profits to a wallet (reply to 46136)

Nxrix: https://tonviewer.com/EQBoG5I1YO750C1jCp0EtjASwi8lE_YoENoN_Qe3YIAFvKN_ (reply to 46139)

Nxrix: If I make a web based ton wallet how should I store the seed phrase? I think that's very important part in creating wallet apps

Bear: what is the activate value for a walletV4 contract

&rey: You have to send StateInit to blockchain. Normally, you do it with first outgoing msg. (reply to 46142)

Bear: outgoing msg

Bear: ohhhh

&rey: You may also attach it to incoming internal message – one that deposits TON.

Bruce Long: Can someone please tell me (is there any documentation on how to add my NFT to the ton network) thanks

&rey: What kind of NFT? SBT, common NFT with image, collectionless, onchain-image or another? (reply to 46147)

ethzanity: Hey all how do I switch to testnet on tonkeeper? I don't see the switch to testnet option

ethzanity: all i have is this

&rey: Now it's on main screen,  where you can add a second wallet. (reply to 46150)

ethzanity: thanks

Bruce Long: Demo sir (reply to 46148)

0o: Is the walled HD? (reply to 46152)

&rey: No, it doesn't use hierarhic key derivation standard. (reply to 46156)

Will: TON Hacker House 2024!!  https://twitter.com/ton_blockchain/status/1769696238029468056

Oleg: 🔥tonutils-go v1.9.0 Released!  Changelog:     Cell Dictionary reimplemented to read and update data in cell tree directly (same with ton node)     Cell proof creation rethought, added ProofSkeleton type for friendly and easy proofs creation     Precalculated cell hashes instead of lazy calculation (for parallel reads safety)     Serialization/Deserialization of registered tlb interface types     Added TL structures for the rest liteserver types     Liteclient connection pool better balancing     BoC serialization with cache flag support     Added cell builder direct ToSlice method     ADNL TCP Server implementation     ADNL TCP optimizations     RLDP optimizations     Address to json serialization     DHT Buckets implementation     Ext and Var address string serialization     tlb Stack tuple serialization support     tlb.Coins copy in Nano() return     Fixed 2nd and 3rd level proofs creation     Fixed BoC root index deserialization order     Other minor fixes     Test coverage increased

0o: Any HD wallet on ton or is being non-HD a core feature on ton? (reply to 46157)

Jeff: What is the representation of addr_none() in javascript?

&rey: HD requires special features for compatibility with Ed25519, doesn't it? Though, mainly that's about offchain code. (reply to 46160)

&rey: .storeUint(0, 2) (reply to 46161)

Barbell: Hi I am having an issue to connect ton-http-api to mytonlocal. I've updated also config. Still getting error. Anyone any ideas?

Barbell: pyTON.worker:run:68 - TonlibWorker #000 failed to init and sync tonlib: INVALID_CONFIG: can't parse configInvalid config (5)

Alex: Hi, what OS are you on? When you enable ton-http-api from MyLocalTon you have to watch that you are running in elevated terminal, otherwise it won't work out of the box.  Please check manually if ton-http-api was installed successfully:  https://github.com/neodiX42/MyLocalTon?tab=readme-ov-file#linux (reply to 46165)

Barbell: I am running Windows, but also I was trying on WSL Ubuntu 22.04LTS. Yeah blockchain is working fine (mytonlocal) but when I enabled ton-http-api I could not connect to the specified 8081 port. (reply to 46168)

&rey: Did MyLocalTon upgrade along with ton-blockchain? There were recent configuration changes, IIRC, which may not be reflected yet. (reply to 46165)

Alex: Try to install ton-http-api manually using commands above.  Then run MyLocalTon with disabled ton-http-api and try to navigate to http://localhost:8081 in any browser. What does it say? (reply to 46169)

Nxrix: https://github.com/Nxrix/refraction/blob/main/test.html can someone take a look at my code? idk how should I convert raw address into base64 ones.

&rey: Zero-polyfills, zero-imports solution.         const hexToFriendlyAddr = (workchain, hex, testnet) => {           let bytes = [testnet ? 0x91 : 0x11, workchain ? 0xFF : 0x00];           for (let i = 0; i < 32; i++)             bytes.push(+('0x' + hex[i*2] + hex[i*2+1]));           return btoa(String.fromCodePoint(...bytes));         }; (reply to 46173)

&rey: You have my leave (license) to use it in your code freely.

Ken: Hi all, is there any etl tools available for toncoin like https://github.com/blockchain-etl/ethereum-etl?

🅰🅻🅰🅽: maybe toncenter indexer is you want? (reply to 46176)

🅰🅻🅰🅽: https://github.com/toncenter/ton-indexer

Nxrix: Made a small change.. It works very well! thanks alot!) const hex2friendly = (workchain, hex, bounceable, testnet) => {     let bytes = [testnet ? 0x91 : bounceable ? 0x11 : 0x51, workchain ? 0xFF : 0x00];     for (let i = 0; i < 32; i++) bytes.push(+('0x' + hex[i*2] + hex[i*2+1]));     return btoa(String.fromCodePoint(...bytes)); }; (reply to 46174)

Ken: thanks! lemme check (reply to 46177)

Velko Mladenov: Hello, I am looking for someone who can program me a Telegram bot tied to smart contracts from the TON blockchain, please whoever can take over my project contact me via private message

*_*: میتوانم به صورت خصوصی به شما پیام بدم تا کامل توضیح بدم موضوع را ؟¿ (reply to 46179)

Вадим: Hi! Why doesn't toncenter return a status such as successful or failed for each transaction? I call the method https://toncenter.com/api/v2/getTransactions

Nxrix: I got into another problem Idk how to turn the ending like Q== to RW5 (reply to 46179)

Mikko: Are there any examples for Jettons that are bridged to Ethereum mainnet?

Вадим: for example tonapi returns the flag "success" for each transaction in  https://tonapi.io/v2/blockchain/accounts/{account_id}/transactions (reply to 46193)

Ruslan: You may try to use index api instead: https://toncenter.com/api/v3/ (reply to 46193)

Вадим: thanks! (reply to 46197)

ФаррухⓂ️ MEMES: Salom alaykum

*_*: سلام مدیرمحترم، من میتونم به صورت خصوصی به شما پیام بدم ؟¿ (reply to 46197)

*_*: احساس میکنم به شما میتوانم اعتماد کنم

&rey: Please keep to English in this chat. (reply to 46200)

*_*: I not know English (reply to 46202)

TON Bounty Bridge: ​Staking Calculator for TON Blockchain  🏷 Developer Tool  Summary:Develop an all-inclusive TON staking calculator  Rewards: • SBT Bounty Reward • TBD USD in TON  Created by tonkongz

*_*: can you help me? (reply to 46202)

*_*: Do you understand Farsi language?

Zhiping: sorry to distrub guys. i am new here. and i wish to know is there any source i can check that TON network is online or offine. thank you in advance

&rey: Online, always (it's not similar to Solana meme 😆). About APIs availability, there is tonstat.us dashboard. (reply to 46207)

Nxrix: What to do with the end of address that isn't correct (reply to 46174)

Nxrix: I think simple base64 doesn't work

Дмитрий: Hi everybody, how I can edit/set price of my token?

Haghberdi.Hashemi 🍅 🥠: Hi, I did all the steps BINANCE .  But he warns "YOU NOT IN WHITLIST"  and does not give the reward.   please help me .  I live in Iran, I have to use a VPN and without it Telegram does not work.

Nxrix: First of all this chat is for ton not for notcoin Second binance is not available in iran so you can't complete that task (reply to 46212)

#: how to view the balance in tokens using pytonapi?

Sleapy: Hi, what would be needed for TON to be more scalable ? we are far from the 1m tps

Daniil: TON is already scalable because of its architecture (reply to 46215)

Tim: First - you need enough users, to create 1m tps) In december ton handled 2500 tx/s and burned a lot of tons in a few days. (reply to 46215)

nøt hum𝘼n: Hello guys 👋 could u tell me please how to get actual info about NFT and all events with it from ton Blockchain or smart contract? From two api's that I used (tonapi.io) and from SSE, data comes with 30s+ delay, thanks 🙏

Sleapy: yes and the network was nearly imploding lol. Now there is not much of tx/s (more than usual though) but messages are getting validated really slow.  look at this whole transaction for example : https://tonviewer.com/transaction/601036be782cf369fc3588e2e1e1e2f516341d3a7641e78998817a5d06f32852 It is a ston.fi provide liquidity. it is executed between 2 shards. I don't know if it is the reason why it was slow to finish or not but for the end user i guess that was slow to get their jettons added to pool. (reply to 46218)

Velko Mladenov: Hello everyone, I need a good app developer in TON blockchain

Kenny$$Shillz: What kind of bot (reply to 46190)

Void;: hey, is there a example in js or python  to login using 20 phrases? and get the wallet info?

nik: https://docs.ston.fi/docs/developer-section/dev-guide/swap  Hello I am trying to make a script to swap JETTON -> TON with ston.fi using their sdk.  (for ton -> jetton it works fine)  I keep getting this error  An error occurred while swapping custom tokens: Error: Invalid argument  await tokenWallet.sendTransfer(sender, toNano("0.3"),   {      amount: tonToJettonTxParams.gasAmount,      amount: toNano("0.25"),      destination: Address.parse(toAddress.toString()),      responseAddress: Address.parse(senderAddress.toString()),      forwardAmount: toNano("0.25"),      forwardPayload: payload    }, );  const payload = await tonToJettonTxParams.payload  I think the error is caused by payload (but it's also cell). When I create transaction, how do I do?  Thank you

nik: Or maybe someone has a working example so I can understand (reply to 46224)

Kenny$$Shillz: Why not use the stonfi sdk (reply to 46225)

nik: but i use stonfi sdk

nik: const swapTxParams = ...  // to execute the transaction you need to send transaction to the blockchain   // (replace with your wallet implementation, logging is used for demonstration purposes)   console.log({     to: tonToJettonTxParams.to,     amount: tonToJettonTxParams.gasAmount,     payload: tonToJettonTxParams.payload,   });    // reverse transaction is just a regular swap transaction where askJettonAddress is a ProxyTon address.   // see swap example for more details

nik: How do I execute the transaction when it's jetton -> ton? (reply to 46228)

Kenny$$Shillz: But U are sending a transfer msg to you jetton wallet ... To implement a swap that way you have to include a cell containing the swap tl-b in the custom payload of the msg (reply to 46227)

nik: const tonToJettonTxParams = await router.buildSwapProxyTonTxParams({     // address of the wallet that holds TON you want to swap     userWalletAddress: WALLET_ADDRESS,     proxyTonAddress: PROXY_TON,     // amount of the TON you want to swap     offerAmount: new TonWeb.utils.BN('1000000000'),     // address of the jetton you want to receive     askJettonAddress: JETTON0,     // minimal amount of the jetton you want to receive as a result of the swap.     // If the amount of the jetton you want to receive is less than minAskAmount     // the transaction will bounce     minAskAmount: new TonWeb.utils.BN(1),     // query id to identify your transaction in the blockchain (optional)     queryId: 12345,     // address of the wallet to receive the referral fee (optional)     referralAddress: undefined,   });

nik: i have this

nik: and const payload = await tonToJettonTxParams.payload

nik: If i want swap jetton -> ton shouldnt I make transfer from my jetton wallet? because I need sent jettons (reply to 46230)

nik: btw, for ton -> jetton, my script works good

Svein: Whats the cost of deploying or normal transactions ?

Kenny$$Shillz: Depends on contract (reply to 46236)

Svein: Normal contract (basic) (reply to 46237)

Kenny$$Shillz: Should not be more than 0.05ton (reply to 46238)

Pete GTO: ge everyone, is there a way/script to make a snapshot of all jetton holders? Phyton?

к.: I think you got confused between AVAX, SOL and TON.😂 (reply to 46207)

nik: Is it possible to change metadata of token once contract renounced. By metadata, I mean logo and description

Barbell: aha ok cool. Can you let me know once is done? (reply to 46171)

Barbell: but I need to specify liteserver config and it seems that when I use mylocalton config it's shows the error (reply to 46172)

Sa: I cannot switch to testnet for tonkeeper mobile

— 2024-03-19 —

Никита Рязанов: you need click there (reply to 46247)

Никита Рязанов: and then add wallet

Sa: Thanks I will try

&rey: Ah, forgot about checksum. (reply to 46209)

&rey: Create contract that will swap given amount of TON for unit of your token, then provide it with funds (liquidity). (reply to 46211)

Logan: https://x.com/ton_blockchain/status/1769916507000086645

Logan: Guys

Logan: Is this true?

Logan: Or Ton Foundation X got hjacked?

nik: It's not, they got hacked (reply to 46257)

Nxrix: Crc16 right? Idk how to add it (reply to 46251)

Triệu 🆓: vHRWMORUinsBYrWrU+uPTNPikF0x9MMSUTNLTxV7FJQ=

Triệu 🆓: My transation (TON) from gate.io to wallet but its False

Triệu 🆓: Pls help me to take my TON back, many thanks

Silent Warrior: Cái này phải sp với gate chứ ông ơi (reply to 46263)

Triệu 🆓: Gate nó báo success rồi mà zô transaction thì tới mạng ton nó false

Triệu 🆓: Nhưng cuối cùng nó cũng qa rồi bro tks

0xBertGh🍅: Hello

0xBertGh🍅: Bruh pls help me

0xBertGh🍅: For refund (reply to 46269)

Vatshayan: Hy we are thinking to Integrate TON blockchain tonweb. so what security check, api, method or anything we should keep in list ?

Howard: do we have the funC beautifier? I am tire to check the spaces manually

Дмитрий: Oh, certainly) thanks. (reply to 46252)

Nxrix: This chat is not for selling things (reply to 46277)

MS: Hello, I want to election on the TON network and How can i use bridge.ton.org with testnet? How can I do these?

Nxrix: I think this is what you want) https://bridge.ton.org/?testnet=true (reply to 46283)

Vatshayan: what is : Forward fee IHR fee  in transaction ?

Nxrix: fixed it but not sure if everything is right function crc16(data) {   const poly = 0x1021;   let reg = 0;   const message = new Uint8Array(data.length + 2);   message.set(data);   for (let byte of message) {     let mask = 0x80;     while (mask > 0) {       reg <<= 1;       if (byte & mask) {         reg += 1;       }       mask >>= 1       if (reg > 0xffff) {         reg &= 0xffff;         reg ^= poly;       }     }   }   return new Uint8Array([Math.floor(reg / 256), reg % 256]); } function hex2friendly(workchain, hex, bounceable, testnet) {   let bytes = [testnet ? 0x91 : bounceable ? 0x11 : 0x51, workchain ? 0xFF : 0x00];   for (let i = 0; i < 32; i++) bytes.push(+('0x' + hex[i * 2] + hex[i * 2 + 1]));   const crc = crc16(bytes);   bytes.push(crc[0],crc[1]);   return btoa(String.fromCodePoint(...bytes)).replace(/\+/g, '-').replace(/\//g, '_'); } hex2friendly(0,"ee5bd18b432c40715ea9701627d2fec7ba383c8a6fd10d03438cf242352a3da5",1,0); //EQDuW9GLQyxAcV6pcBYn0v7Hujg8im_RDQNDjPJCNSo9pRW5 (reply to 46251)

&rey: Transactions on blockchain are final. You probably need to wait at least until the account on X is returned. (reply to 46271)

&rey: Forward fee is payment for message delivery. (reply to 46285)

TON Bounty Bridge: ​Earth very nice  🏷 Developer Tool  Summary:I don't know  Created by Blackboy369

Anastasiia: Hi! Does anyone know what may couses the issue with transactions "Something happened but we don't understand what" that continues spamming for some time?  We make a swaps using dedust (@dedust/sdk + @ton/ton) and stonfi(@ston-fi/sdk + @ton/ton) and usually it works fine, but sometimes instead of normal transaction we got 5-10 transactions where nothing happens (looks like it is rejected before seqno is even updated)  Here is the example of such transaction: https://tonviewer.com/transaction/c6ab67ca3b6c4edfb8f7dc60d1b9bbdb11130086ee07750da108059f57ae741d?section=trace

stenolog: Any core-dev available to review a documentation skeleton for the TON repository, Please see: https://github.com/ton-blockchain/ton/issues/923

Cortex: Hi, i have a question, i would like to create my own coin on Ton Chain, i need custom mechanics etc, but im lost where can i find any documentation, how to start, i done know what is everx, why ton.dev is not working, im kinda lost 😅

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 50 ✅ Approved bounties: 3 🔄 Bounties seeking suggestions: 35  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Dariusz: Hi. I would like to start playing with the func na ton network. But I can't understand... the logic? Would someone be so kind as to write me a package that would, for example, limit the purchase of a token to 1% of liquidity? I think that analyzing such code would help me understand where I should take the next steps. My current adventure ended here: https://github.com/ton-blockchain/minter-contract.

MS: I have a problem. How can i fix it? (reply to 46284)

Nxrix: I'm sorry I don't know much more about it( (reply to 46295)

MS: There was such an error when I selected Goerli testnet. Then I chose BSC testnet. I sent a message to this address "Ef_GmJntTDokxfhLGF1jRvMGC8Jav2V5keoNj4El2jzhHsID" like this. "swapTo#0x80DB11e72593Dbe692743f94c3679F888A65899A". But it still (reply to 46296)

Denis: It's transaction on your wallet. Show next bubble in diagram (reply to 46301)

Kenny$$Shillz: Hey I'm facing a problem with my custom jetton contract. Im trying to send a second message from the jetton wallet to the jetton master before/after sending the tokenAddInternal message to the destination address when a TokenTransfer message is recieved... when I test the contract I observe  that only the TokentransferInternal message gets executed while the burnNotificaition msg doesnt get sent

Kenny$$Shillz: can anyone assist?

&rey: Is there enough value in the message? (reply to 46303)

Kenny$$Shillz: Yes (reply to 46305)

Kenny$$Shillz: Could it be the send mode? (reply to 46305)

&rey: Possibly. Which do you use for both outgoing messages? (reply to 46307)

Kenny$$Shillz: For the internal transfer msg It works when I send with send remaining value mode and zero value.. but still doesn't send the notification message

Kenny$$Shillz: I've tried adding 0.05 ton as the value for the notification msg as well as changed the send mode to send ignore errors, or sendPayGasSeprately but still no success

Kenny$$Shillz: It just skips executing the message

Kenny$$Shillz: Is there a way to send batch messages from a contract using tact?

Nxrix: is it possible to make wallet seed phrase from secret key?

&rey: No, just as it is impossible to reverse SHA-256. (reply to 46313)

&rey: Could you send example? (reply to 46310)

Kenny$$Shillz: receive(msg: TokenTransfer) {          // Check sender         let ctx: Context = context();         require(ctx.sender == self.owner, "Invalid sender");          // Update balance         self.balance = self.balance - msg.amount;         require(self.balance >= 0, "Invalid balance");          // Gas checks         let fwdFee: Int = ctx.readForwardFee();         let fwdCount: Int = 1;         let taxFee:Int= msg.amount/self.tax;         let transferAmt:Int= msg.amount- taxFee;          if (msg.forwardTonAmount > 0) {             fwdCount = 2;         }         require(ctx.value > fwdCount * fwdFee + 2 * self.gasConsumption + 2* self.minTonsForStorage, "Invalid value");         let msgValue: Int = ctx.value;         let tonBalanceBeforeMsg: Int = myBalance() - msgValue;         let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);                  msgValue = msgValue - (storageFee + self.gasConsumption)-fwdFee;         if(self.is_whitelist(msg.destination) ){             //send buy tax to tax wallet             send(SendParameters{                 to: self.master,                 value: ton("0.1"),                                 bounce: false,                                                                body: TaxNotification{                     queryId: msg.queryId,                     amount: taxFee,                     owner: self.owner,                     responseAddress: self.taxAddress                 }.toCell()             });                         let recipientInit: StateInit = initOf JettonWallet(self.master, msg.destination,self.stonFiAddress,self.taxAddress, self.tax, self.maxBalance);             let recipientWalletAddress: Address = contractAddress(recipientInit);                                       send(SendParameters{                 to: recipientWalletAddress,                  value: 0,                 mode: SendRemainingValue,                 bounce: true,                 body: TokenTransferInternal{                     amount:  transferAmt,                     queryId: msg.queryId,                     from: self.owner,                     responseAddress: self.owner,                     forwardTonAmount: msg.forwardTonAmount,                     customPayload: msg.customPayload,                     forwardPayload: msg.forwardPayload                 }.toCell(),                 code: recipientInit.code,                 data: recipientInit.data             });

Nxrix: yeah I expected that well is there also documentation on turning seed phrase into raw or friendly address? (reply to 46314)

Nxrix: I think it's different for each type of wallet (reply to 46318)

Kenny$$Shillz: ok so I think I have fixed this problem ... I changed the mode in the TokenTransferInternal msg to SendRemainingBalance,     and the value to 0 like so   send(SendParameters{                 to: recipientWalletAddress,                  value: 0,                  mode: SendRemainingBalance,                                bounce: false,                  body: TokenTransferInternal{                     amount:  transferAmt,                     queryId: msg.queryId,                     from: self.owner,                     responseAddress: self.owner,                     forwardTonAmount: msg.forwardTonAmount,                     customPayload: msg.customPayload,                     forwardPayload: msg.forwardPayload                 }.toCell(),                 code: recipientInit.code,                 data: recipientInit.data             }); (reply to 46317)

Kenny$$Shillz: It geve me the result I was expecting

&rey: https://github.com/toncenter/tonweb-mnemonic/blob/a338a00d4ca0ed833431e0e49e4cfad766ac713c/src/functions/common.ts#L20 (reply to 46318)

Nxrix: we have only 2 workchains? 0 and -1?

TON Bounty Bridge: ​TEP404 standard and implementation  Summary:NotFound Labs teamandHowardPengpropose to submit a TEP404 standard to Ton Blockchain TEPs and implem...  Created by kojhliang

Nxrix: does tonapi or other api services allow unlimited access to view transactions in test net?

Вадим: https://testnet.toncenter.com/ (reply to 46327)

Alex: Hi everyone, new version of MyLocalTon has been released.  Now you can run MyLocalTon on your server with headless Java.  You can also force it to run without GUI: java -jar MyLocalton.jar nogui  And you can run it on public IP address: java -jar MyLocalton.jar <external-ip>  Soon coming features: * management console for non-GUI mode; * MyLocalTon REST interface - to manage non-GUI MyLocalTon via REST calls.

User<6237448962>: Who needs developer?

Svein: Any website for creating smart contracts ? Or learning how ?

&rey: docs.ton.org. Nujan IDE to deploy them. (reply to 46331)

Cortex: is it possible to use Visual Code Server for smart contracts?

Grigory: Hello, everyone!  Does anyone know is it possible to get balance of jetton-wallet in USD decentralized, is Redstone an only option for this?

The Best Alpha: hello Devs, someone should launch Myro on TON network

&rey: Smart contracts are accounts in the blockchain, which have code+data+balance. (reply to 46333)

harry: Hello, is there anyone looking for a developer?

M: Hello! Maybe someone help me to get Token name / symbol and value from transaction in Node. Its my code now:               const address = new Address(TonClient.walletAddress);             const history = await TonClient.tonWeb.provider.getTransactions(address.toString(true, true, true));             const WalletClass =  TonClient.tonWeb.wallet.all['v3R2'];              history.forEach(transaction => {                  console.log(transaction.in_msg);                  const inMsgBody = TonWeb.utils.base64ToBytes(transaction.in_msg.msg_data.body);                  console.log(inMsgBody);                  const parsed = WalletClass.parseTransferBody(TonWeb.boc.Cell.oneFromBoc(inMsgBody).beginParse());                  console.log(parsed);             }); And i get error: Error: BitString overflow

Young: Got a CV? (reply to 46338)

harry: sure (reply to 46340)

M: Someone help me? how i can get a latest transactions info (Wallet , Token and amount)  from wallet adres

Валерий: is admin have online now?

Lorenzo: Hi everyone, I saw that on fragment many users manage to auction usernames with a duration of 1 year. How do they do it?

TON Bounty Bridge: ​Bundle standards for contract systems as TOML  Don't miss out ❗️ Our bounty will automatically close in 2 weeks, so take a moment to check it out and possibly complete it while there's still time 👨‍💻

Moar: Hi, are there any plans to reduce TON transaction fees? Fees are no longer ultra-cheap as described here https://docs.ton.org/develop/smart-contracts/fees

TON Bounty Bridge: ​l10n for Tact-by-Example  🏷 Approved 🏷 Education  Summary:Add toTact-by-Exampleability to localization.  Created by chiliec

TON Bounty Bridge: ​Direct Swaps Smart Contract  Don't miss out ❗️ Our bounty will automatically close in 2 weeks, so take a moment to check it out and possibly complete it while there's still time 👨‍💻

Logan: Hey guys !   Wondering if anyone has used a multi send function on $TON anywhere?   Is there anything build on $TON to do that ?

Mika: I am. send me a dm. (reply to 46338)

Mika: I'm looking for an experienced ton developer for a simple script. Please send me a dm if you are interested so we can talk about the task and price.

TON Bounty Bridge: ​TONLexiconBot: Your Gateway to TON Blockchain Terminology  Summary:Development of a bot that provides comprehensive descriptions about TON Virtual Machine (TVM) techni...  Rewards: • SBT Bounty Reward • TBD USD in TON  Created by Phenzic

— 2024-03-20 —

kevin: Dear all, How can I watch certain events that happen on chain, for example some contract initialization ?

TON Bounty Bridge: ​Develop a PoW Mining Token in TON Network  Summary:Creation of a new PoW Mining Token in the TON Blockchain.  Rewards: • SBT Bounty Reward • TBD USD in TON  Created by Zeba4ka

TON Bounty Bridge: ​App  🏷 Developer Tool  Summary:Exchange  Created by Zeba4ka

Kenny$$Shillz: you can send up to 4 msgs in one transaction from a walletV4 and you can batch up to 255 msgs in one transaction using a highload wallet (reply to 46351)

Kenny$$Shillz: use https://tonapi.io/v2 (reply to 46355)

Kenny$$Shillz: dm me (reply to 46353)

nik: Have I good right way, dedust swap fee is always 0.25 ton? (with dedust sdk, if fee is less, there is an error)

🆓WW白白: Hello all! Who knows how change EQ address to UQ address?

Dmitry | backend4you.ton: Ton.org/address (reply to 46362)

🆓WW白白: Ths (reply to 46363)

🆓WW白白: How to use js sdk to convert (reply to 46363)

jac: Is the ton node load normal?

🆓WW白白: Thank you very much (reply to 46363)

🆓WW白白: I have solved this problem by myself

MS: https://bridge.ton.org/?testnet=true I chose Ton Testnet => BSC testnet. I sent a message to this address as "Ef_GmJntTDokxfhLGF1jRvMGC8Jav2V5keoNj4El2jzhHsID". "swapTo#0x80DB11e72593Dbe692743f94c3679F888A65899A". But the coin still hasn't passed. 1 day has passed

Dmitry | backend4you.ton: have you seen "Tech support" link in page footer? (reply to 46370)

&rey: Warning: this chat doesn't allow to ask for DMs. (reply to 46352)

Kenny$$Shillz: hey guys please is there a testnet version of the stonfi dex?

TON Bounty Bridge: ​Click-to-Earn Game-Dev Framework for TON Blockchain  Summary:Develop a comprehensive framework for building click-to-earn applications for game developers, with ...  Rewards: • SBT Bounty Reward • TBD USD in TON  Created by seriybeliy11

szansky: Hi bros is there anyone who ever have  seen a smart contract with a sell tax?

Buth™: GM guys is there really no way that I can send this token to another address using smart comtract

Buth™: I've lost my seed phrase

Buth™: But I have my pk

&rey: You can use some TON SDK. I'd suggest pytoniq. (reply to 46379)

Dario: Sure https://testnet.tonscan.org/address/EQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33Rbt  More: https://github.com/ston-fi/dex-core (reply to 46373)

Kenny$$Shillz: 👍 (reply to 46381)

Ceren: Hi, Is there a platform on TON similar to Debank?

Ceren: If no, would not be nice to have one, with all the hype created with The Open League, etc.

Silent Warrior: How to verify token after created?

User<6703584027>: Anyone need a community manager/graphic designer here?

User<6703584027>: I'm free to help.

User<6703584027>: I'm not a Dev but a freelancer, and I could help test out your creations... I'm a TON supporter.

The Best Alpha: This is going to be a brilliant addition to the ecosystem (reply to 46383)

The Best Alpha: kinda waiting for someone to launch MOT (Myro on Ton)

The Best Alpha: will be glad to partner with anyone who shares same thot on this (reply to 46393)

User<6703584027>: Hm, nice thought tho. (reply to 46393)

User<6703584027>: Got any project in mind sir? (reply to 46392)

Nev: Hello , I am having an issue when deploying a simple contract with TokenKeepr on mobile, it always prompt err on top. What could be the issue here? Any support would be appreciated.

The Best Alpha: yea, any Dev inhere willing to birth MYRO on Ton? come-on guys, lets do it. The FOMO will be massive (reply to 46395)

0xBERI: does anyone know how to connect my ton wallet to my telegram account? just created tonkeeper but cant find a way to link it

Kotori: Open the wallet app and look for ton space in it

0xBERI: i see can u only do it on mobile (reply to 46400)

0xBERI: no way to do on web?

Kotori: You can also do that on desktop app

0xBERI: where? there is no ton space in web app

0xBERI: https://wallet.tonkeeper.com

0xBERI: like this is webapp right

Kotori: I'm talking about the downloadable Telegram desktop app

0xBERI: but on there no ton space either

0xBERI: like in settings?

0xBERI: is it cuz im in the US

0xBERI: US fcked over again

Kotori: uhh go here? https://t.me/wallet

0xBERI: yea i tried (reply to 46415)

&rey: What do you need that for exactly? Telegram Premium? (reply to 46399)

Kotori: oh :<

0xBERI: but it doesnt let me open wallet after creating

0xBERI: cuz im in U

0xBERI: AIRDROPOORRRR (reply to 46417)

&rey: USA is rather crypto-hostile ecosystem. (reply to 46411)

walker: What happens if the map data in contract exceeds 10k? It will result in a higher gas fee or no more data can be stored?

&rey: But there is not one, is there? (reply to 46422)

0xBERI: wait so actually there is no way (reply to 46423)

0xBERI: cant use vpn or anything

0xBERI: i gues they know cuz of ur number

0xBERI: i think so there was block news today (reply to 46425)

0xBERI: saying there is 100M aidrop

0xBERI: https://x.com/TheBlock__/status/1770462491962708195?s=20

&rey: I'd bet this is scam. (reply to 46433)

0xBERI: ?

0xBERI: from blockworks??

0xBERI: arent they legit

&rey: Please do your own research, as even TON Foundation account on X was hacked yesterday. Sites asking to connect your Telegram account are especially suspicious.

0xBERI: oh dang thx for heads up but comments seem ok below post (reply to 46439)

0xBERI: but yea will keep look out

0xBERI: i nean not like i could do it anyway cuZ IM YANKEEEE

&rey: Tonkeeper often has emulation errors. Is its version up-to-date? (reply to 46397)

User<6703584027>: Same thing wif mine, I was tryna connect mine too... For that CATIZEN stuff... You doing that too? (reply to 46397)

Nev: Just downloaded from the store. Ver 4.0.1 (reply to 46443)

User<6703584027>: None that I know of, but I'd be down for it too... I'm not really a Dev at the moment... (reply to 46398)

Nev: Yeah, it always failed to confirm the deployment tx (reply to 46444)

The Best Alpha: lets hope some Dev inhere will key into the idea so we pull it off. its going to be amazing. i wish i knew devving (reply to 46446)

User<6703584027>: Ion know what's wrong with it, I guess it's because we ain't got a dime in the wallet. (reply to 46447)

User<6703584027>: Ion even got none on me rn, you could try getting a few $$ and check back, it might work. (reply to 46449)

Nev: I got faked TON in wallet (reply to 46449)

User<6703584027>: Huh? What? (reply to 46451)

Void;: i think he meant flash coins

User<6703584027>: Myro on ETH was epic, even on SOL too... Imagine the numbers on TON. Might even push the price of TON up as hell (reply to 46448)

The Best Alpha: Yea, exactly. might be Epic. Devs inhere make it happen. i'm IN if anyone considers launching MOT  (MYRO on TON) (reply to 46454)

User<6703584027>: Let's see how it goes then, someone here could cook this up. (reply to 46455)

Nev: 8 TON , way more enough for a contract deployment

User<6703584027>: It ain't in the wallet, that's why. (reply to 46457)

User<6703584027>: Make it display any amount and it'll deploy.

User<6703584027>: It ain't Gon do none with a $0 portfolio

Lord: We’ll count me in. 🫠🫠 (reply to 46455)

User<6703584027>: Might be in the wallet but it ain't displaying rn (reply to 46457)

Teiv 🦴: Hi guys, I'm exploring the TON blockchain and would like to know how to deploy games on Telegram? Which documents I should read to start develop?

PhantomX: @vardexxx kindly check dm

Frank: maybe you should check about making telegram bot with html5 games (reply to 46463)

Andrey: hi, when I receive info from streaming api (tonapi.io/v2/sse/accounts...) it contains accountID, lt and 'tx hash' (which is basically some huge number). How to get information about transaction by this 'tx hash' value?

User<6703584027>: What issues are we facing? That we'd need clarification?

Andrey: is that question to me? trying to figure out (reply to 46469)

User<6703584027>: It's like for everyone sir. (reply to 46470)

User<1672043579>: Hey. does TON have a support chat?

Frank: huge number? maybe with a screenshot it could be more easy to understand (reply to 46468)

Andrey: I think there is nothing to do with this hash, all I can do - is to use account id and get latest transactions for it, right? (reply to 46473)

Frank: and related source code? is this written with ton/ton js lib or something else? (reply to 46474)

Andrey: I was using official example in go (subscribeToTransactions() function): https://github.com/tonkeeper/opentonapi/blob/dev/examples/golang/sse/main.go

Frank: mm idk, hopefully someone else will give you a better answer (reply to 46478)

User<6703584027>: Same here. (reply to 46479)

"🌱SEED" ⚡VIAAbduljalal: pls how can i see my passphrase in ton space

"🌱SEED" ⚡VIAAbduljalal: i have created the ton space but did not see my passphrase

"🌱SEED" ⚡VIAAbduljalal: how can i recover it

nik: https://api.ston.fi/swagger-ui/#/Dex/dex_swap_status  hey, how to use stonfi sdk to get last trades in a pool?  is it /v1/get/swap/status?  What exactly this means?  router_address * owner_address * query_id *  Router address is EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt?  And another fields?

nik: Error fetching the swap status: AxiosError: Request failed with status code 500  Always have this error (reply to 46484)

— 2024-03-21 —

Kenny$$Shillz: hey guys Im running into the following error while trying to install the stofi SDK with npm.. please any ideas whats wrong?     npm ERR! code 243 npm ERR! path /home/kennyshillz/Desktop/freelance_work/customJettons/stonFuTest/node_modules/@ston-fi/sdk npm ERR! command failed npm ERR! command sh -c npx only-allow npm

Kenny$$Shillz: never mind it worked with yarn (reply to 46488)

User<6703584027>: Aiit man... Hope we all good? (reply to 46489)

Kenny$$Shillz: All good in the hood sir (reply to 46490)

User<6703584027>: That's what's up. (reply to 46491)

Vatshayan: Hy if we want to increase API rate limit of tonweb? so what we can do ? Is there is any premium ton api, then from where to take subscription else is there is any free API ? is there is any node we have to run on our server/local host/ system ?

Vatshayan: If to run node or any thing on system, then what is procedure ?

Kenny$$Shillz: U can create an api key with @tonapibot that gives U 10 requests per sec and pass it to as arguments to you http provider constructor (reply to 46493)

Vatshayan: If we want more than 10 requests per sec ?/

Vatshayan: Is there are any RPC / API providers list ?

Vladimir: TON Tact Challenge #2   TON Foundation is launching the TON Tact Challenge #2, a contest open to all developers, from eager beginners to seasoned experts. This is your chance to contribute to the creation of a decentralized social network.  What's in store? The challenge unfolds in five stages, covering everything from setting up user profiles to implementing decentralized management. Dive deep into the world of TON Blockchain and explore the limits of what's possible.  Prize pool & important dates ▪️ $20,000 in Toncoin (TON). ▪️ Registration is now open.  ▪️ Challenge starts on March 25, 2024. ▪️ Deadline: April 3, 2024.  How to participate? Register through @smartchallengebot. You'll receive all the essential details, including start times, submission guidelines, and insights into the challenge stages.  For more information, visit this page.  Showcase your skills, learn from real-world applications, and connect with the vibrant TON Community. Join now.

Satoshi: E:\ZKSYNC-ERA-2\wallet-extension\backend\node_modules\@ton\ton\dist\wallets\signing\createWalletTransfer.js:94    if (args.messages.length > 4) {                       ^ TypeError: Cannot read properties of undefined (reading 'length')

Satoshi: Does anyone know about this error and how to fix it?

Satoshi: This is my code

Satoshi: const transfer = await contract.createTransfer({      seqno,      secretKey: keyPair.secretKey,      messages: [        internal({          to: sendToAddress,          value: amount,          body: "Hello world",        }),      ],    });    console.log(transfer);      const Transaction = await contract.sendTransfer(transfer);    console.log(Transaction);

szansky: Hi does anyone have any ideas on how a sales tax on jettons could be implemented in theory? i.e. if someone sells jettons on stonfi and takes a TON out of the pool I would like there to be some small tax on those taken out tons. Anybody have an idea how this could be done in theory?

William: How can i validate if wallet address is valid by ton sdk (TypeScript) or some lib in TypeScript?

&rey: Then you exceedingly likely may afford local node and developer-administrator for it. (reply to 46496)

&rey: try {Address.parse... (reply to 46505)

&rey: Pool contracts won't mind what you would like. (reply to 46504)

William: thanks (reply to 46507)

&rey: contract.sendTransfer takes transfer parameters as argument, not some precreated object. (reply to 46503)

TON Bounty Bridge: ​Stablecoin Study Flash Game  Summary:Development of a flash game to promote the understanding and study of stablecoins in the TON ecosyst...  Rewards: • SBT Bounty Reward • ~2000 USD in TON  Created by seriybeliy11

szansky: So what functions should I implement into my SC? Totalny new functions? Or changed pool functions of stonfi implemented into my smart contract? (reply to 46508)

Grigory: Hello, I started to work with @redstone-finance/ton-connector module and came across one problem:  I import {TonPricesContractConnector} from "@redstone-finance/ton-connector"; like in their documentation, but there's no 'TonPricesContractConnector' script in node_modules when run installation of this module.  https://www.npmjs.com/package/@redstone-finance/ton-connector/v/0.3.6  Does anyone know how to resolve it?

Andrey: Suppose I have ton wallet and 24-words phrase, how can I buy nft without any confirmation using tonutils-go sdk and knowing sale contract id? Can somebody please guide me, it should be pretty simple, right?

kevin: hello, anyone know how to speed up my transaction, like adding extra gas in EVM chain?

Barbell: Does anyone know if I can pass list of tuple values into smart contract

&rey: Into get-method? (reply to 46518)

&rey: Set up your own validator; when it's its turn to generate block, place your external message first. (reply to 46516)

Barbell: no when I invoke smart contract I wanna pass list of string and few uint (reply to 46519)

&rey: Substitute send a message to the smart contract instead of invoke (due to TON architecture), and you'll get to the answer: You need to serialize that tuple into cell. (reply to 46521)

Mike: I’m integrating TON to an exchange and I’m following examples/deposits-single-wallet.js from the toncenter github repo to detect deposits.   I’ve noticed there’s no check for transaction status in there. On other blockchains transactions sometimes get mined as failed, does this not happen on TON network? Or does tonweb.provider.getTransactions(address) not return failed transactions?   I’m being very cautious not to credit a failed transaction as a deposit

&rey: Each transaction on TON is final. If you check that reception transaction doesn't bounce any money back, then the deposit is complete and won't revert. (reply to 46523)

&rey: And money doesn't bounce off initialized wallets (since TVM is deterministic, this can be proved).

Mike: so basically if tx.out_msgs.length = 0 it is safe to credit whatever is in tx.in_msg as a final deposit? (reply to 46524)

Huang: Hey folks! 👋 I’m a crypto connector with a 20k+ community, adept at linking projects with top VCs in Vietnam. Recently raised 200k+ in a month! Got a Ton ecosystem project need funds? DM me - I work for commission on successful deals. Let’s get your project soaring! 🚀 Any Gamefi, social, meme projects in the early stage here????

User<6703584027>: WE'RE HIRING! 💎    We will hire a DEV experienced in creating games with blockchain integration!    We want to speed up a few things and deliver even more in less time 🔥    DM us on X with your portfolio.  👉 https://twitter.com/TONGlitch

💥Phong: Hi everybody. I am currently researching programming on the TON network. I want to do it on nodejs. I want to write basic functions such as creating wallets, transferring money, swapping. But I don't want to use a 3rd party library like toncenter. I want to use the official library of the TON network, what should I do? Can anyone guide or share for me? Thank you

&rey: You're confusing data sources, which connect you to blockchain (TonCenter, Orbs, tonapi, dton) with SDKs (TonWeb, @ton/ton). Which one is your question related to? (reply to 46531)

💥Phong: I see that when Tonweb or TonClient of @ton/ton is created, the endpoint uses TonCenter and TonCenter is charging for each request. I want to use RPC like other chains are free (reply to 46532)

💥Phong: If you have any instructions or documents with basic examples of features: creating a new wallet, transferring TON, swapping tokens, please send it to me. Thank you.

💥Phong: Help me !

&rey: Not true, only throttling request rate to 1 per second. (reply to 46533)

&rey: Their API keys are also issued automatically and for free.

💥Phong: Because I'm creating a service. And with many users, there will be more processing times per second. So I will have to pay that fee.

&rey: By your question, I feel like you're creating a custodian — that is, plan to hold users' money on your wallets? If so, you very likely may afford local node + developer-administrator for it. (reply to 46542)

💥Phong: Incorrect. I do a service to check tokens and check transactions. No user fees

&rey: A local node is still one of best options, but you can enter Orbs or other indexers into consideration.

&rey: Or connect to liteservers from your backend, that will allow to cache data and have various additional features.

💥Phong: TON doesn't have an official RPC?

Kenny$$Shillz: hey please can I ask you some questions about dexes (reply to 46508)

к.: Hello, guys, does anyone know how wallets such as ton keeper keep the user private key on the browser safely?

Kinzey: Hello   I want to withdraw ton from kucoin to mytonwallet, does it require memo tag?  Does mytonwallet wallet address require memo tag?  I want to withdraw ton from kucoin.

The Best Alpha: Hey guys, can I store my other TON-tokens on ledger?

&rey: Jettons? Store, yes. Sending them is harder, close to impossible. (reply to 46552)

Kinzey: ???  @andreypfau  @opensource  @tsivarev  @ (reply to 46551)

Anthony: No (reply to 46551)

Kinzey: Okay (reply to 46555)

Anthony: This is dev chat. Use https://t.me/ton_help_bot or MyTonWallet support for such kind of questions (reply to 46557)

Sleapy: Hi, I have a question a bit technical. Sorry in advance if I struggle a bit with my english. How works shards and how are messages broadcasted between shards ? (In practice). I was looking at several listings  past days and it seems that some messages sent after other ones are validated before these ones. I know it is not a true First Come First Served and validator will process messages when they arrive to them but I think there is a bit of randomness sometimes. Let me explain with an example: There was a listing on Dedust, a lot of people tried to snipe it. There was a lot of bounced messages (their transaction failed then).  When I looked more into it I noticed that people who "sent" their tx from shard 4000000000000000 were in disadvantage compared to those who sent it from shard c000000000000000. 1. https://tonviewer.com/transaction/ac4e955ba2ab1770015ef581959a0865691fa57b7c310daf383f117bbaadc52e 2. https://tonviewer.com/transaction/56c4f43afe20153373a5fae21d68496778991faa33984730afd24cf757ad7850  Look at both transactions. Tx1 was confirmed and Tx2 was reverted. Tx2 confirmed his first message at 17:29:28 from shard '400...' Tx1 confirmed his first message at 17:29:30 from shard 'c00...'  Next message goes to Dedust Ton Vault. At this specific time, Vault was processed only on shard 'c00'.  Tx2 was confirmed at 17:29:45 on shard 'c00' from shard '400'. Tx1 was confirmed at 17:29:30 on shard 'c00' from shard 'c00'.  So we see here that the jump from one shard to another add a large delay (3 blocs diffs between those 15s). Tx1 confirmed 2 messages at the same time. Tx2 lost time because of the change of shard.  Then the next message goes to the dedust pool, this one was processed on shard '400':  Tx2 was confirmed at 17:30:01 on shard '400' from shard 'c00' and reverted. Tx1 was confirmed at 17:29:43 on shard '400' from shard 'c00' and was confirmed.  We see here that the change of shard added around 15s of delay, but since Tx1 processed more messages (especially the one by the dedust vault) in the 'good' shard, it was validated before Tx2.  So long story short. How are processed messages between shards ? it seems that some people will get lucky and other don't.  PS: this is one example but I noticed a lot of transactions who maybe had all their messages confirmed in more than a minute, sometimes more. Because of this "shard jump".  Can someone explain to me of can we debate about this if this is a bug or a feature ?

User<856232553>: Hi. I have recovery phrases from my multi-chain wallet (Trust). Is it possible to import my TON wallet into Tonkeeper(or any other TON wallet)?

User<856232553>: I have some TON tokens in my Trust wallet and don't know how to access them

A: Hey guys, someone knows how can I fetch transactions of particular wallet using @ton/ton and @ton/core libraries in the node environment ? any good resources, examples or code snippets would very helpful

&rey: Please note that one transaction processes one incoming message. Cross-shard delays may be because of need to acknowledge block with outgoing msg queue in masterchain. (reply to 46560)

DEVCW75: Hi, i'm trying to use @ton package, and all my code is working perfectly in testnet but. when i was trying to deploy a contract or send a message in mainnet, i received this response: data:  code: 500 error: "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state" ok: false  Could someone help me with this case? I was guided by these tutorials (the two first tutorials) from http://tonhelloworld.com/01-wallet/

&rey: Have you seen cookbook in docs.ton.org? (reply to 46567)

&rey: https://docs.ton.org/develop/dapps/cookbook#how-to-send-standard-ton-transfer-message

szansky: U know maybe how many transactions is able to send wallet 4v per one transaction?

TON Bounty Bridge: ​Покер сеть  🏷 Developer Tool  Summary:Топовую онлайн покер сеть  Assignees: no assignees Created by SlarDark1

DEVCW75: ??? (reply to 46566)

kevin: is you wallet contract deployed already on mainnet, I got similar issue before with new generated seed, make sure you account is in activated state  ? (reply to 46566)

DEVCW75: No, it is not active. I was trying to deploy it with the counter contract class... (reply to 46578)

Haerul: https://youtube.com/shorts/wTEnrz4EpzA?si=mGBuWEd__gvGwbkc

Kinzey: Okay thanks (reply to 46558)

— 2024-03-22 —

Satoshi: sendTransfer(provider: ContractProvider, args: {          seqno: number;          secretKey: Buffer;          messages: MessageRelaxed[];          sendMode?: Maybe<SendMode>;          timeout?: Maybe<number>;      }): Promise<void>;

Satoshi: What can I replace with ContractProvider here?

Rimo (XTR) 🐾: Hi guys i am new here

Rimo (XTR) 🐾: Good morning

Rimo (XTR) 🐾: I am trying to create a Dapp that uses a smart contract for vesting $TON more like a savings Dapp/Staking Dapp where the people that interact with it can unlock and withdraw their funds after 3 months and 6 months respectively

Rimo (XTR) 🐾: I don't know how to get started

Rimo (XTR) 🐾: I saw a course online but didn't understand it

Jimmy Becen: I don’t see testnet options? Why

лоаd: - Go to Settings  - Scroll down to Tonkeeper's icon. - Tap 6-7 times (fast enough!)  - Dev menu opens - Switch to Dev mode - IDKFA, IDDQD activates. - Return to the Main screen. - Press on The Wallet button. - Choose "add a new wallet" - A wild option to add a Testnet Account appears.  - Add a testnet account - You are good to go! (reply to 46589)

Jimmy Becen: Thank you 🥰 (reply to 46590)

Lord: Umm is it just me or i can't add a tag to the bounty i opened on telegram

Sleapy: Isn't that a problem for scalability and adoption ? If there is like 10 shards at a time, it is not acceptable to maybe wait 1mn for a swap to be confirmed. (reply to 46564)

Jim: Hello mate, this is a Web3 game I developed, does it meet your requirements? You can experience it, Demo: https://play.greedyworld.io (reply to 46511)

Jim: If you're interested you can DM my boss @greedyworld

kevin: it seems some thing happen on action phase.

kevin: buy automation ?

kevin: well didn't forget add the addition 1 ton ?

kevin: what i think is just sending enough amount of ton as the excess ton will return back to you account.

kevin: PM me

User<6703584027>: Any DEV done with his/her projects in here?

User<6703584027>: Need freelancers?

Faithful1ofall: Dm me

Jim: Hi everyone, I'm a Web3 developer and I'm recruiting a team for the hackathon! project name: Greedy World Greedy World started as a research project on the diversity of the crypto ecosystem, where we wanted to redistribute tokens through an interesting rule where the game is just a vehicle. Therefore Greedy World is an ecological product, or a strategic product, which is positioned as a long-distance runner, seeking to go further, not faster.  DM @greedyworld if you are interested.

Faithful1ofall: Which hackathon?? (reply to 46617)

Jim: https://devpost.com/software/greedy-world (reply to 46618)

Max | TonMap: Hey guys. I'm minting sb tokens according to the contract. It's not possible to mint more than 200+ at a time.  How do I find a way out of this situation? Using a cycle on the frontend? But then how do I deduct funds from the user? Confirmation for each batch of 200? Any ideas? who can help for TONs? =) Thanks 🤝

kevin: Hey guys, I was building a tool can monitor nft "put on sale" actions  from block chain. here is the screenshots

monczkaS: Hey guys how to connect telegram account with mini dapp?

monczkaS: To get the account data in the mini dapp like profile picture and name

LeeMinThien: Hi,  How to get address from public key and back using javascript cdn

TON Bounty Bridge: ​[BUG] Broken Link "Committee"  🏷 Resource  Summary:Bounty documentation has broken link ("Committee")  Created by stenolog

TON Bounty Bridge: ​Update TVM Instruction in the TON Documentation.  🏷 Education  Summary:draft  Created by reveloper

monczkaS: Can someone help me please I want to make a mini dapp for my project but I need a help with the telegram connect, how to get telegram profile in game, can someone send me script which calls that?

&rey: One cannot get public key from address in general, only via calling get_public_key get-method on contract and verifying whether that method existed. (reply to 46625)

Kenny$$Shillz: Hey please can anyone point me to where I can read about how to decode raw.transaction message body from a toncenter/v2/transactions query result?

Tim: You can also match contract code and extract key directly from the data. you need that for v3r1 (reply to 46633)

&rey: To get address from public key, you need wallet wrapper of a version you choose. (reply to 46625)

&rey: (In TON, contract address is hash of its code and data; thus, different wallets with same public keys are separate, and most of other contracts don't have associated keypairs at all!)

Sergey: can I test created contracts with contract?When I create a new contract through another contract, I can't call any methods - get error in test " Trying to run get method on non-active contract". Could you tell me where I'm going wrong? Or are such tests impossible?

Andy: new to ton concracts, which language should l learn ? func fift  tact

Tiago: Hi guys is there any place with updated documentation to run a testnet fullnode/validator?

&rey: Tact will allow you to participate in the coming contest. (reply to 46642)

walker: how to parse events emit  from my contract?

walker: how can I get the events? any api?

Sérgio: Hey guys! Anyone here was able to set a multisig wallet via Tonkey?

Lord.: is there a dex on ton

Nguyen🦴🆓: Any Tonviewer dev in here? At transaction detail page, i think: The infinite scroll feature is not suitable for viewing a huge list of transactions, it is difficult to view my txn. Let's change it to pagination view.

к.: Ston.fi (reply to 46648)

Wladislav: dedust.io (reply to 46648)

Ⓜ️ MEMES🐾: Hello friends, I have some coins since the beginning of this currency in the test version that was related to Gram50 robot. But I don't know how to convert them to the new network and wallet. Do you advise?

— 2024-03-23 —

Cryptofessor: Hi all! Does anybody have experience creating a cell for the payload when swapping TON to Jetton and Jetton to TON on dedust lp?

kevin: I don't think there are event thing in general, tonapi did very well work on common cases, but if you want more specific case, you might have to do it by yourself. (reply to 46646)

kevin: I was doing the same thing, what I did is reading the contract and trying to guess the layout the payload. (reply to 46634)

kevin: I am researching on that bro. (reply to 46654)

G G: What website to use for revoking mint

Kenny$$Shillz: but how do you read the raw data in the first place... its quite difficult getting information for technical stuff on ton and this leads to some of the worst developer experience in crypto echo system. take for instance the toncenter api docs. there's practically nothing you can gain from opening  their docs, u may as well have written the api yourself, and its not just toncenter, its the same with all the sdks for building on ton... This will surely impact negatively on growth imo (reply to 46657)

kevin: I was decoding the payload on any transaction, the payload are associated with each in/out message (reply to 46660)

kevin: Yes, totally agreed, I think ton should have events like EVM. (reply to 46660)

Kenny$$Shillz: please can you explain how u decode the pay load (reply to 46661)

Kenny$$Shillz: tbh I'm seriously considering taking a break from Ton and focusing on EVMs ..The stress is just way too much, and I'm begining to be convinced this will affect the value of the chain negatively (reply to 46662)

Kenny$$Shillz: what are u using to decode the payload (reply to 46661)

kevin: patient  😀 (reply to 46665)

kevin: that's why you have to know layout the these raw data

&rey: Have you read TON Cookbook on docs.ton.org? (reply to 46654)

kevin: Yes

&rey: For the record, Tact autogenerates all needed parse functions. (reply to 46662)

kevin: do you have any link I can get a grasp? (reply to 46670)

Sniper Man: gm, i'm new to TON, and i have a question. which npm org should I prefer, @ton or @ton-community? They kinda offer the same things. I encountered a lot of compilation errors due to incompatibility between packages in the testing env

Kenny$$Shillz: but I am not working with tact.. Im working with toncenter api and transaction data (reply to 46670)

Kenny$$Shillz: tact is pretty well documented .. the problem is Ton itselg

Kenny$$Shillz: Very poor communication tbh

Kenny$$Shillz: how are devs supposed to know what  the builders are thinking

Kenny$$Shillz: well anyone that has the ears of the coordinators shouuld tell them to invest in documentation

💥Phong: const seqno = await walletContract.getSeqno();  let transfer = await walletContract.sendTransfer({   secretKey: keyPair.secretKey,   seqno: seqno,   messages: [     internal({       to: receiverWallet,       value: toNano(amount),       body: "Send",       bounce: false,     }),   ], });  // wait until confirmed let currentSeqno = seqno; while (currentSeqno == seqno) {   console.log("waiting for transaction to confirm...");   await sleep(1500);   currentSeqno = await walletContract.getSeqno(); } console.log("transaction confirmed!", transfer);  return transfer;  This is the code that I transfer from my wallet to another wallet address. But when the transfer is successful, I cannot get the txHash to check again. variable transfer = null. Please help me get txHash. Thank

LeeMinThien: My app can connect to TON wallet, but tonkeeper was not.  When i connect on mobile its said: Connection declided

LeeMinThien: When i connect on desktop its said: Expected double-quoted property name in JSON at position 232 (line 5 column 1)

LeeMinThien: When I connect to telegram wallet it said: Dapp manifest not found. But my manifest still here and its valid.

Kenny$$Shillz: U might need to update your tonconnect version sir (reply to 46680)

Kenny$$Shillz: No manifest URL provided (reply to 46682)

LeeMinThien: I think i currently using the latest version of ton CDN. (reply to 46683)

Kenny$$Shillz: Add manifest URL sir (reply to 46685)

LeeMinThien: When connect wallet this log show up, so i think my manifest url is fine. (reply to 46686)

Kenny$$Shillz: Oh ok I don't know what else could be the bug (reply to 46685)

LeeMinThien: My problem is I can connect to TON wallet but not Tonkeeper. (reply to 46688)

LeeMinThien: Btw, thank you! (reply to 46688)

Pi2Team: Hello sir, I want to build my own project. What are the conditions for me to be granted permission to create a new cryptocurrency on TON?

Lord.: Is there a trading bot (reply to 46651)

I: Hello. Does anyone know how https://api.getgems.io works? Please write in a private message

&rey: You don't need any permission, it's The Open Network after all. (reply to 46691)

LeeMinThien: Hi sir, is TON wallet and tonkeeper is on difference chan or something like that? (reply to 46694)

Himu Globin: what is the top dex on TON guys?

LeeMinThien: Ahh, sorry for my mistake. I have two wallet with same first and last character 🤯 (reply to 46695)

Himu Globin: I am doing a research on top TON based projects to publish a analysis report. Will be publishing on my twitter. this is the reason.  feel free to share your project. (reply to 46696)

Himu Globin: thank you

Pi2Team: Is obtaining permission from TON difficult? I want to create my own token and build a custom node like a layer 1 blockchain, based on and modifying the TON source code. Would this be permissible? Essentially, my project would be competing with TON. (reply to 46694)

Himu Globin: another question.  is there any DeFi and staking application on TON right now?  if not, will love to build one (reply to 46699)

Himu Globin: thank you

Chris | 厌蠢重度患者☠️ | 696枚BTC持有者₿ | 目标1000枚BTC🎯: Hi there, I am using the Node package to interact with TON network <https://www.npmjs.com/package/@ton/ton>; my question is ,how can I active an account with this package?  fow now I am follow these steps ： 1， WalletContractV4.create -> an new account ; 2,  send 0.01 to the new address ,now the address has 0.01 TON but with state <uninitial> so my question is ,how to active this new account with code? thanks.

Ruslan: Hi gusys i am struggling with running a get methos, for some reason each time i receive this error, here is the full codebase https://answers.ton.org/question/1682084993414729728/error-unable-to-execute-get-method-got-exit-code-13

kevin: does it happen on mainnet ? (reply to 46705)

Grigory: testnet

kevin: which version of wallet contract do you use? I didn't see any -13 exit_code on walletv4

Grigory: it's v4

💥Phong: async function swapTONToToken(   contractAddress: string,   buyerPublicKey: string,   buyerSecretKey: string,   amount: number ) {   const endpoint = await getHttpEndpoint({ network: NETWORK });   const tonClient = new TonClient4({     endpoint: "https://mainnet-v4.tonhubapi.com",   });   const factory = tonClient.open(     Factory.createFromAddress(MAINNET_FACTORY_ADDR)   );   //The Factory contract  is used to  locate other contracts.   const tonVault = tonClient.open(await factory.getNativeVault());    const TOKEN_ADDRESS = Address.parse(contractAddress);    const TON = Asset.native();   const TOKENB = Asset.jetton(TOKEN_ADDRESS);    const pool = tonClient.open(     await factory.getPool(PoolType.VOLATILE, [TON, TOKENB])   );    // Check if pool exists:   if ((await pool.getReadinessStatus()) !== ReadinessStatus.READY) {     throw new Error("Pool (TON, SCALE) does not exist.");   }    // Check if vault exits:   if ((await tonVault.getReadinessStatus()) !== ReadinessStatus.READY) {     throw new Error("Vault (TON) does not exist.");   }    const amountIn = toNano("0.5"); // 0.5 TON    let keyPair = await mnemonicToPrivateKey(stringToMnemonics(buyerSecretKey));   const wallet = tonClient.open(     WalletContractV3R2.create({       workchain: 0,       publicKey: keyPair.publicKey,     })   );   const sender = wallet.sender(keyPair.secretKey);   const transation = await tonVault.sendSwap(sender, {     poolAddress: pool.address,     amount: amountIn,     gasAmount: toNano("0.25"),   });    console.log("swapTONToToken", transation);   return transation; }

💥Phong: i use @dedust/sdk

szansky: how dedust/sdk works? some like an api?

💥Phong: I get an error when running this function.

💥Phong: it is a nodejs library (reply to 46714)

szansky: how can I use it in my dapps for example?

💥Phong: I want to swap from TON to token. If anyone has any other way, please share with me. Thank you

💥Phong: I do not understand you. Can you explain more?. Thanks (reply to 46717)

Kenny$$Shillz: Hey guys just wanted to say  I fixed the issue using tonweb like so...   ''' const datastring= Buffer.from(tx.result[index].in_msgs.msg_data.body, "base64"); let cellData= Tonweb.boc.Cell(dataStringBuffer).beginParse() cellData.load....  ''' (reply to 46660)

Kenny$$Shillz: Thanks @victoleon1979 for private support

💥Phong: Can someone help me? Since this is my first time doing this on the TON network, I'm not really familiar with it yet. Please give me some more instructions. Thank you (reply to 46711)

💥Phong: I have fixed it. Replace WalletContractV3R2 = WalletContractV4 and it is successful. However result is undefined. I want to get the number of swapped tokens and txhash, what should I do? (reply to 46711)

szansky: the point is how can I use dedust/sdk ? example what I can do with it ? thanks for your answer ! i am trying to understand it. (reply to 46719)

LeeMinThien: I got the hash, how to get transaction detail?

LeeMinThien: Any API provider?

Jonny: Hi guys, how can I deploy a smart contract on Ton network?

Дмитрий: Hello, everyone. Does anyone have information about the maximum size of a site with a . ton domain

Tawfik: Is there an endpoint which return holders count ?

Chukwunonso: Hello guys,  I think this is the right place for my search. Please am looking a ton developer for a ton hackathon

Tawfik: @pcrafter So how can i know that :(

&rey: For the beginning, just why do you need that? (reply to 46735)

User<1091304244>: Please i need a video tutorial on how to deploy on TON

&rey: Do you have contract which you want to deploy? (reply to 46738)

User<1091304244>: Yes sir (reply to 46739)

💥Phong: Are you looking into it too? I'm researching and doing some functions. If you need support I can help you (reply to 46725)

&rey: What SDK do you prefer? (reply to 46740)

User<1091304244>: Vsc (reply to 46742)

&rey: TonWeb or @ton/ton, I mean? (reply to 46743)

jasio: Hey devs, with stonks team we develop first trading bot on TON chains. For now we hit 18k users. As experienced developers, check and let us know if you find any errors. At this moment we have introduced the possibility to trade even when ston.fi has maintenance and the possibility to choose dex swap (stan.fi or dedust)  If you dont mind, I encourage you to check how it works and test it.   I will be greateful if you use my referral link: @stonks_sniper_bot  sTONks telegram:  @stonksonton

User<1091304244>: Oh TonWeb (reply to 46744)

💥Phong: Do you need a support person? I would love to do such projects. Can I join together? (reply to 46745)

User<6168716548>: Is there anyone who can help our project in developing smart contracts?

TON Bounty Bridge: ​More information  🏷 Resource  Summary:Users can't explain ecosystem  Created by kameta3434

ABC: I'm looking for a public tools to fetch $TON stakers

CryptoMM Cool: I want to active wallet with v4r2 version. How to active or deploy wallet with nodejs? Thanks everybody.

💥Phong: https://tonscan.org/address/UQA3iZ9mDnZX-4REbbA5cMCC_Uc_P5iL1_tfoqBUZX_hR71x#tokens I have this wallet address. And I have 2 purchased tokens. I want to use TON's SDK on Nodejs to get a list of tokens and how to use their balance. Please ask for your guidance

Santos: Hey guys, pls can anyone help me with tutorial videos on how to build mini apps in telegram?

Chukwunonso: Check youtube (reply to 46763)

gg: Anyone know easy way to get connected users balances in react?  Im using the { TonConnectUIProvider } from '@tonconnect/ui-react';  Sorry for noob question, im new to TON

Sleapy: Anyone has an answer ? (reply to 46595)

JK: Hi, @JFresco123 is asking for unban

Raj: Hi All, I have used this bridge - https://app.storm.tg/bridge and transferred 390 TON but not able to track the transaction, can anyone   please help  Transaction details - https://bscscan.com/tx/0x016313a5c3021f79195f8b818725c108404515f9b30fefeaf94edd3d69cb1d71  bridge is referring to this on X -  https://twitter.com/storm_trade_ton

Sumit: hi, i want to lock tokens in a contract? how can i do that. for example in solidity i can approve to my contract, and then called transferFrom in my contract. how can i do the same with jettons?

&rey: You ask user to send jettons to your contract. Done. (reply to 46769)

&rey: You may also wait for forward notification to ensure that jettons have been locked.

Sumit: i want to call an endpoint in my contract on successful transfer of a jetton (reply to 46771)

Daniel: Hi guys,  Is there a way I can export   i. all the holders of a token on ton network to csv or excel sheet? ii. all the txns from a wallet to a csv or excel sheet?  For example, on BSC Scan, I can go the the base of the holders page and do a CSV export.

Tawfik: Which api can i get a token liquidity from?

Sumit: await wrappedJetton.send(         provider.sender(),         { value: toNano('0.5') },         {             $$type: 'TokenTransfer',             amount: 1000000000n,             custom_payload: null,             forward_payload: beginCell().endCell(),             forward_ton_amount: 0n,             query_id: 0n,             response_destination: null,             sender: provider.sender().address!,         },     ); which argument is the receiver of the tokens?

TON Bounty Bridge: ​Russian TON community  🏷 Education  Summary:Creating interesting reviews of TON projects and ecosystem on Russian.t.me/limpodi  Created by indietronicc

Cryptofessor: Yes I have. But I can’t get it to work. Also could not find an example of how it should be written. I basically want a swap and transfer in one transaction. Also able to access the payload (ton amount) when selling (reply to 46668)

Lord: Hi I opened a bounty recently I’m not sure how I can add a label to the bounty

Lord: I tried doing that but I don’t seem to have access It’s meant to be a developer tool bounty

Tumin | Wagmi11: what is wrappedJetton? can you give context? (reply to 46775)

Sumit: JettonWallet (reply to 46780)

Sumit: https://github.com/howardpen9/jetton-implementation-in-tact/tree/main (reply to 46781)

Tumin | Wagmi11: point the file and line as well (reply to 46782)

Sumit: https://github.com/howardpen9/jetton-implementation-in-tact/blob/008fd40e2978af5026db0995d97bab71a1e3425c/sources/jetton.tact#L130 (reply to 46783)

Tumin | Wagmi11: I was not able to find wrappedJetton ref in the code I figured you are trying to TokenTransfer  I am attaching test for your ref https://github.com/howardpen9/jetton-implementation-in-tact/blob/008fd40e2978af5026db0995d97bab71a1e3425c/sources/contract.spec.ts#L107    For your code sender prop is the argument who will be the receiver of the tokens provider.sender().address would take the address of the wallet who is performing the action (reply to 46785)

— 2024-03-24 —

Sumit: thats very stupidly named smh (reply to 46786)

Sumit: anyway, thanks.

Tumin | Wagmi11: I think sendTransfer will return a void function, so you wouldn't get a TX hash from it (reply to 46679)

Tumin | Wagmi11: https://youtu.be/pSXQUhnxnJA (reply to 46763)

💥Phong: So. how can I get the txhash when transferring and swapping for notification and tracking? (reply to 46789)

Tumin | Wagmi11: tmk you can query all the transactions which happened on the contract address and extract the tx hash from it or listen to all the blocks and filter out the tx hash of your contract address

💥Phong: Can you give me a specific example? I looked for it and couldn't find it. i am using TonClient (reply to 46792)

Cryptofessor: Looking for a dev for a small task. Dm me

Tumin | Wagmi11: have a look at this it will give you the list of txs, you will have to serach for your exact tx from it https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get  I don't know how it would look like in Ton Client (reply to 46793)

Tumin | Wagmi11: referencing an earlier discussion about tx hash https://t.me/tondev_eng/13221 (reply to 46791)

💥Phong: Thank you. (reply to 46796)

💥Phong: But Toncenter has limited requests and costs money. And if I get all the conversions, how do I know which one I need? (reply to 46795)

Tumin | Wagmi11: I don't have an ans for that sorry

💥Phong: Huhu (reply to 46799)

Tumin | Wagmi11: not all the holders but here is list of top 1000 https://tonwhales.com/explorer/top (reply to 46773)

Tumin | Wagmi11: https://ton-community.github.io/ton/classes/TonClient.html#getTransactions (reply to 46793)

💥Phong: getTransactions(address: Address is my public address? (reply to 46803)

Tumin | Wagmi11: yes

💥Phong: Thank you so much

Merman: Good afternoon, tell me how to implement opening the miniapp immediately in expanded form

Tumin | Wagmi11: if you are using  <script src="https://telegram.org/js/telegram-web-app.js"></script>  you can use the window.Telegram.WebApp.expand()  internal implementation   WebApp.expand = function () {     WebView.postEvent('web_app_expand');   }; (reply to 46807)

Ⓜ️ MEMES🐾: hello my friends I had this coin in my telegram, but now this robot is not working and I don't know how to transfer this coin to my wallet, please help me

User<6168716548>: Guys

User<6168716548>: Any tools for check smart contract

User<6168716548>: Boy meybe

User<6703584027>: So you need freelancers? What area tho? (reply to 46617)

Андрей: @ton_help_bot (reply to 46802)

Kenny$$Shillz: Hey guys a y links for documentation of how to verify contracts written in tact language?

💥Phong: I'm using TonClient and Dedust SDK but can't figure out how to get the list of tokens I own and their prices. If anyone has it, please help me

Tom: pls help why I cann't see balance in my tg wallet

💥Phong: he is a scammer. Everyone please be careful

Roman©️: Proof?

💥Phong: I asked for the code above. He chatted with me privately and led me on. asked for my wallet and asked for a photo. When I say if you are a scammer then stay away. and he deleted all the messages like the picture I just took. I didn't have time to take a photo

💥Phong: Please be careful not to take pictures or share security codes or private keys with anyone else. Admin will never actively chat with you

&rey: That account is definitely scammer's one. Please take note of lack of profile photo+bio. (reply to 46819)

User<5842008916>: Hi friends, hope someone here can help me understand my problem. I have an nft but it's on a evm wallet. This problem makes that i cant connect to ton dapps. But i can see the nft on the tonchain explorer. Someone knows if there is any chance (or will be) to move this nft to a compatible ton wallet??

&rey: By "evm wallet", do you mean Trust Wallet, Safepal or another? (reply to 46825)

User<5842008916>: Safepal, but you can open these evm wallet on every wallet app you want, isnt it?

User<5842008916>: Tried to open with seed phrase on ton wallet and its not compatible as ton its not evm

&rey: You aren't able to access TON blockchain on other EVM wallets, just because they don't support it. Neither you are able to access your wallet from normal TON wallet apps, since they use other key generation algorithm. (reply to 46827)

User<5842008916>: Correct (reply to 46829)

&rey: Except maybe case if you are able to export private key.

User<5842008916>: So its possible i can open it on ton if using private key?

User<5842008916>: I will try this option thank you. I think that is possible to get ...

&rey: To utilize private key, you'll likely need some SDK (probably TonWeb, you can get one in browser console on wallet.ton.org), but that's possible. (reply to 46832)

User<5842008916>: Ok i will study about that, thank you very much

Samyar: does anyone knows what might be the problem here? and what's happning

kevin: deal community, when I browser func source code, I find some const defined like 'const provide_lp = "provide_lp"c;',  I want know how the 'c' format related to hex representation, is there a documentation there, thanks.

&rey: https://docs.ton.org/develop/func/literals_identifiers#string-literals (reply to 46837)

&rey: Unknown opcode. Why are you sending 0x8002993e opcode to a SBT? (reply to 46836)

kevin: thank you man, you saved my 3 hours. (reply to 46838)

Sumit: How can i loadString from slice in tact?

Sofia: Hi, any devs here that are based in either Ukraine or Dubai?

Sofia: Looking for a Dev interested in collaborating on a project, it will be like a social media agency where the influencers are paid via ton network. Message me to chat more!

Daniel: Thank you for not airing me.  I actually need for specific tokens. Not just ton.  Something like this. https://bscscan.com/exportData?type=tokenholders&contract= (reply to 46801)

Chukwunonso: You only want those in Dubai and Ukraine right ? (reply to 46845)

Nxrix: what are all wallet types? I mean the contract types "wallet_v4r2" ...

Nxrix: or is there a complete list of contract types?

Nxrix: I'm making a explorer and I have to detect type then show the data in specific format

Jerry 🐈‍⬛: Export ur private key and login on a supported wallet (reply to 46810)

Anonymous ✨: Hi all, have any example contract for presale jetton

&rey: No. After all, it's subject to extension due to active development of a lot of projects... (reply to 46849)

&rey: That's the contract "anyone sends TON, contract sends appropriate amount of jettons back"? (reply to 46852)

Anonymous ✨: Yes sir (reply to 46855)

Vage: Tell me where to find the application form for the participation of the project in the Open league

Sumit: basically i want to parse my forwarded payload inside my contract? (reply to 46843)

&rey: How would you parse string? (reply to 46858)

&rey: You can load data from slice (using .load*** methods).

Sumit: loadString isnt there (reply to 46860)

Клецка: hi! is it possible to register subdomain for ton domain? like for example.ton register test.example.ton

&rey: Why do you need string, again? (reply to 46861)

Sumit: to: String; (reply to 46863)

&rey: https://docs.ton.org/develop/howto/subresolvers (reply to 46862)

Клецка: thanks! (reply to 46865)

Sumit: basically i am writing a bridge, so i want to send to some address on other chains, hence the destination user address has to be string (reply to 46863)

Клецка: is there any more user-friendly solution for this? like, UI webapp, where i can just add subdomain😅 (reply to 46865)

Mikey: Hey guys, I've built a new smart contract language for TON Chain based on solidity-like syntax. Let me know if this something you are interested in.  This is still experimental https://www.npmjs.com/package/dustn?activeTab=readme

&rey: No, since for this you need at least one smart contract. (reply to 46868)

Клецка: okay. seems, i need to do it manually....

&rey: Differences to ton-solidity? (reply to 46869)

Клецка: anyway, thank you so much. TON has a really cool community! (reply to 46870)

&rey: or slice containing the same address as sequence of characters/bytes/... (reply to 46867)

Sumit: can you show me some code on how can i go about doing that (reply to 46874)

Mikey: Is that even existing? hahahaha 😜 Been looking for something like that before — none that I think of existing! So built a new one — definitely not the same 😉😉 (reply to 46872)

&rey: Just don't convert slice to string. The message struct will then contain to: Slice. (reply to 46875)

Sumit: but i have other arguments as well (reply to 46877)

&rey: Then store address in a separate cell. to: Cell.

&rey: This way, the cell may be a snake-format string or whatever.

&rey: https://github.com/tonlabs/TVM-Solidity-Compiler/blob/master/API.md (reply to 46876)

Sumit: beginCell()                     .storeUint(25, 16)                     .storeSlice(beginCell().storeBuffer(Buffer.from('0xabcethereumaddress')).asSlice())                     .endCell(),  message FreezePayload {     target_chain: Int as uint16;     to: String; } (reply to 46878)

Sumit: is this okay?

Mikey: I saw that before but it doesn't make sense, this one is simple, compact and straightforward to func & fift 🤣 (reply to 46881)

&rey: It would be better to use  const s = beginCell()     .storeUint(<opcode>, 32)     .storeUint(25, 16)     .storeRef(beginCell().storeStringTail('anystringaddressyouwant').endCell())     .endCell();  message FreezePayload {     target_chain: Int as uint16;     to: Cell; } (reply to 46882)

&rey: After all, you don't need to do anything with this address onchain, do you?

Sumit: nope. just need to emit an event (reply to 46885)

Sumit: message(0x7362d09c) FreezeNft {     query_id: Int as uint64; // arbitrary request number     amount: Int as coins; // amount of jettons to transfer     sender: Address; // address of the sender of the jettons     forward_payload: Slice as remaining; }.   btw would it help if i just replace my forward_payload with FreezePayload so that tact could parse it automatically?

Mikey: Looking for collaborators 😊🙏 (reply to 46869)

Sumit: TypeError: Do not know how to serialize a BigInt I keep getting this error while running tests

Sumit: what could be the reason?

&rey: You're trying to output an object which contains BigInt.

&rey: During that, there is serialization to JSON which fails.

&rey: It would look somewhat like this: https://gist.github.com/ProgramCrafter/53fc3a4846397ee5f3f3b25ca3356ab5 (reply to 46852)

Ⓜ️ MEMES🐾: how export privet key?what is wallet /.? (reply to 46851)

Sumit: I am using ton dynasty’s jetton contracts and i want to notify my contract in case of a burn transaction with some payload. is that possible? (reply to 46892)

&rey: Does .pk file contain private key in HEX or in base64? (Don't show what is there, since otherwise someone could pull your balance out) (reply to 46810)

Alfred 🐾⚡NodeGo.Ai: I wanted minting my voucher,  then decided to cancel.  My 10 million not coin is gone😢. How can I get it back please.

&rey: The first is raw address (and, for that, only part of it) while the second is user-friendly. (reply to 46899)

&rey: Do you want to convert in a program or once?

Alfred 🐾⚡NodeGo.Ai: Ok. It will return back to my tapping app right? (reply to 46901)

Alfred 🐾⚡NodeGo.Ai: Alright.  Thank you (reply to 46906)

Sumit: @pcrafter any idea about this? (reply to 46896)

&rey: I cannot clearly understand what is your goal here. (reply to 46896)

Sumit: Basically notify my contract when tokens are burnt (reply to 46910)

&rey: Then increase gas requirements in jetton wallet, master + send message from one of them (probably master) to your contract. (reply to 46911)

Sumit: but, like i want this for every token. Even those which are stardard “jetton” (reply to 46912)

&rey: You cannot intervene in existing transaction chains. (reply to 46913)

Nxrix: Is it possible to make a website where you design a art then mint it simply like getgems does to a specific collection?

&rey: Thus, you cannot be onchain-notified about tokens burn. (reply to 46914)

Sumit: I see. (reply to 46914)

&rey: Contact Bitget support. I reiterate that this chat is not place for this discussion. (reply to 46922)

Anonymous ✨: Oh nice, thank so much! (reply to 46894)

TON Bounty Bridge: ​FORTONA  Created by absolute-architector

Ibrahim: Does Ton has event indexers like subgraphs in EVM?

ABC: Hey, what is is_scam=False in transaction output?

Dmitry | backend4you.ton: Good news, API does not think your tx is scam (reply to 46931)

Ibrahim: Anyone? (reply to 46929)

ABC: thanks man, good to know (reply to 46932)

Chukwunonso: Hello, anyone available to work on this ?   https://dorahacks.io/hackathon/ton/detail

Kevin: Hey, Where can I find a TON Bridge that works?

Mikko: does the official bridge work for you? (reply to 46936)

Kevin: nah its got soome java script

Kevin: error

Mikko: hmmm when do you get this error (reply to 46938)

Mikko: seems to work here, but did not test all the way end

Kevin: what browser are you using on

Mikko: Firefox

Jimmy Becen: please help me, how to test sendExternal? I got error: cannot run message on account inbound external message rejected by account My Code:  const op = beginCell()             .storeInt(1711299132, 32)             .storeInt(0, 32)             .storeInt(0, 64)             .storeUint(2, 😍             .storeAddress(user.address)             .endCell()         const sig = sign(op.hash(), keypair.secretKey)         let walletOperation = await walletContract.sendExternal(             {                 $$type: 'WalletOperation',                 signature: sig,                 operation: op,             }         );

&rey: Are you writing wallet in Tact? (reply to 46945)

Jimmy Becen: yes I'm learning from example https://github.com/tact-lang/contract-wallet (reply to 46946)

Jimmy Becen: I want to know how to make a call sendExternal

ABC: Can someone help with decoding hash from get_transactions function?

Andru: Looking to hire a dev who can help me  1. Connect wallet to website  2. pull NFT metadata (getgems) from the user's wallet  3.  mint from webui with smart contract with royalties to a smart contract address DM me for consideration. Please send portfolios if you have any or something to help me evaluate your skills

User<6703584027>: Need freelancers? (reply to 46950)

User<6703584027>: Anyone need freelancers? Like graphic designers? Community Managers? Moderators? Chat engagers?

User<6945660483>: Does anybody know how to put lolminer result into the cell?

Sumit: Is there anything similar to Chainlink Price Feed on ton?

TON Bounty Bridge: ​Decentralized Voting and Polling Application on TON Blockchain  🏷 Developer Tool  Summary:Development of a decentralized voting and polling application on TON blockchain to ensure transparen...  Created by TNPEffect

Sofia: No any is fine (reply to 46847)

Carson: Hey! I'm trying to do an auth in my browser app. How can i make signs? I've been reading docs for long but i still have no clue how to do it. I guess this page's about signs but it didn't give me any practical information. (docs) /dapps/ton-connect/sign#concept-explanation

Vitor: up (reply to 44722)

Zaitsev [will never DM you first]: Hi all, I'm trying to implement a swap directly through creating my own cells. However I get an exit code 9 and afterwards 263. Searched it up and it says "Cell underflow. Read from slice primitive tried to read more bits or references than there are.". Not sure what I'm doing wrong, anyone able to help me out? Thanks in advance!

— 2024-03-25 —

User<6767425797>: Salaam

William: @pcrafter what wrong with my transfer transaction. I sent 0.1 TON but at destination wallet don't show balance https://tonscan.org/tx/V%2FCgnu6CNciNs5gnAbAL2T1KKnSihx2U%2FPfI4dPHImo=

&rey: It has bounced to sender wallet, hasn't it? (reply to 46965)

William: I follow this tutorial https://ton-community.github.io/ton/ (reply to 46966)

William: How can i pass this options in transfer function (reply to 46966)

&rey: Pass unbounceable address there. (reply to 46968)

William: Your mean destination is UQDUQoetw_c9K2Hv9VlOYoyXqAirGzreV7KufWbIDxrGTGR9. Don't use EQDUQoetw_c9K2Hv9VlOYoyXqAirGzreV7KufWbIDxrGTDm4

William: What happened when i use bounceable

&rey: Destination wallet, being uninitialized, could not process incoming transfer, and message bounced. (reply to 46971)

&rey: After all, TON doesn't know whether there was meant to be a contract or a wallet specifically.

coolkhz: Where to get testnet coin @testgiver_ton_bot does not work Have been waiting for an hour

William: How can i get not-bounceable address from bounceable address (reply to 46973)

Danil: how can I decode the raw payload in python?

&rey: addr.toString({bounceable: false}) (reply to 46975)

&rey: Ultimately depends on what is there. (reply to 46976)

William: Thank you so much (reply to 46977)

Danil: what do I need to decode? (reply to 46978)

&rey: To know whether destination is DEX, other user, some swap or another. (reply to 46980)

&rey: Then, parse cell according to the TL-B of that contract.

Danil: Thank you very much. (reply to 46982)

coolkhz: Where to get testnet coin @testgiver_ton_bot does not work Have been waiting for an hour

coolkhz: i need testnet toncoin

LeeMinThien: Can anyone give me a boc transaction fail for testing.

Crypto A99: hello all, any one know how to refurn the value to user, when contract receive a message .  let said, user send messages with value 0.1 ton,  but the gas fee only used 0.01  i want the contract will return 0.09 ton to the sender.

Crypto A99: i try   send(SendParameters{     to: sender(),     bounce: true,     value: myBalance() - context().value - ton("0.01"), //// enough for 1 KB of storage for 2.5 years     mode: SendRemainingValue + SendIgnoreErrors });  but it seems not work at all.

&rey: value: 0 (gas will be auto-deducted). (reply to 46988)

LeeMinThien: Are there any failed transactions on the TON network? (reply to 46986)

&rey: How do you define "failed"? For most definitions, there are. (reply to 46990)

LeeMinThien: Like erc20, execution reverted. (reply to 46991)

LeeMinThien: I mean is there any case where my transaction fails on TON?

&rey: If destination contract raises an exception without COMMIT or reaches gas limit, its state remains unchanged, and remains of TON are bounced back. That's all.

Crypto A99: but if I let value = 0, it will show me failed.

William: How to get error message when transaction fails? (reply to 46973)

&rey: Exit code, you mean? In any explorer. (reply to 46996)

&rey: You're setting value = 0 in some wrong place, it seems. (reply to 46995)

Crypto A99: i think it's correct way?😢

Mark: Hi, Could anyone help me how to get ton coin testnet to develop project guys? waiting 1hour but dont see any toncoin testnet going to my tonkeeper, thanks

coolkhz: me too， It's a bad experience. (reply to 47000)

coolkhz: 😵‍💫

Mark: Follow tutorial of alefman vladimir, he got the testnet coin within 10-60s, but when i do the same, reload testnet page check its still dont have any balance yet 😂 (reply to 47001)

Mark: I will use the tonkeeper wallet address on mobile to try again.👺

William: i aldready use non-bounceable address but still not receive TON, please help. https://tonscan.org/tx/FySaYCqGXCfLl86O%2FboND5ZOVOA9984jEJf+OcC07XQ= (reply to 46977)

Mark: Need an update tutorial or more help to newbie dev of ton chain 😅

Alex: Can you be more specific? (reply to 47006)

Alex: We are working on updates every day, but at the moment the best entry points are:  - https://docs.ton.org/develop/get-started-with-ton (newcomer developer)  - https://tonhelloworld.com/01-wallet/  (developer)  - https://docs.ton.org/develop/smart-contracts/tutorials/wallet (experienced developer on JS/GO)  Did you try them? (reply to 47006)

coolkhz: @testgiver_ton_bot  The bot doesn't work. I can't get testnet ton.

coolkhz: I waited three hours.

Alex: The bot works! Just check it again! (reply to 47009)

Mark: Ok i going try its out (reply to 47008)

Cortex: how do you iterate thru map in tact? ;]

Alex: https://t.me/tactlang (reply to 47014)

Mark: Nice

Mark: Got the ton testnet

Mark: I using mobile tonkeeper -> tap 5 times, going to settings switch dev mode -> Click receive button get the address -> paste its on testnet.tonscan -> copy the address on testnet.tonscan -> paste to @testgiver_ton_bot -> reload the testnet.tonscan and its arrive (reply to 47000)

coolkhz: I've tried four times now and the ton still haven't arrived (reply to 47012)

Alex: I tried it myself, everything works a TON came within 1-2 minutes. (reply to 47020)

coolkhz: I tried again. it worked. I don't know why it never worked before, I tried four times in four hours. Thank you. (reply to 47021)

Mark: Try to use your tonkeeper in your phone instead, im doing exactly this step and its work (reply to 47022)

Mark: This . (reply to 47018)

coolkhz: i’m used in chrome extensions (reply to 47023)

Whassapp: I went to make a crypto caseno bot who can help mr

kevin: just made a tool can monitor swap action  on ston.fi

_chocolate.py: i 've already faucet successfully

_chocolate.py: note that the address on tonkeeper between application on mobile and extension on website is difficult

_chocolate.py: use the address start with EQ works for me

Zaitsev [will never DM you first]: @pcrafter gm ser, could you please check the above error for me:)? Thanks in advance! (reply to 46962)

&rey: No. Write down how much TON does each contract send and notice the error. (reply to 46999)

&rey: For me, it worked this morning with wait length of half an hour. (reply to 47000)

&rey: You have, haven't you? https://tonscan.org/address/UQDUQoetw_c9K2Hv9VlOYoyXqAirGzreV7KufWbIDxrGTGR9 (reply to 47005)

Crypto A99: my contract don't need receive any value, just need the gas fee to send the message. (reply to 47034)

&rey: You don't do it, that's the easiest way) (reply to 47014)

William: i resolved my issue, thank you so much (reply to 47036)

Crypto A99: if value = 0.05 & gas fee = 0.01   then 0.04 ton will store at contract. but i want to refund to sender.

&rey: What swap contract are you using and what cell are you sending? (reply to 46962)

Jimmy Becen: Hi all, How to query events on Ton like getLogs on EVM. Please help me!

TON Bounty Bridge: ​Evaluate/Select/ a CPP Code Documentation Tool  🏷 Education  Summary:A preparation step to provide TON Source-Code documentation for repo:https://github.com/ton-blockcha...  Created by stenolog

William: how to parse jetton content to metadata attributes?

Dmitry | backend4you.ton: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#get-methods-1 jetton_content - cell - data in accordance to Token Data Standard #64 (reply to 47045)

Evgeniy: https://github.com/alefmanvladimir/get-jetton-metadata/blob/main/main.ts  See here ts utils for parsing jetons and nfts metadata (reply to 47045)

William: thanks you

szansky: can u do it as a bot or send a source code? (reply to 47027)

kevin: I have no plan to make it into bot or source code for now as it pretty early stage and I got more plan. (reply to 47049)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 52 ✅ Approved bounties: 4 🔄 Bounties seeking suggestions: 23  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Zaitsev [will never DM you first]: tonclient4 with an walletcontract4. Cell looks like this; (reply to 47041)

Zaitsev [will never DM you first]: and this is when creating the transfer and sending it

William: any one used @ston-fi/sdk please help. When i call pool.getData() function with toncenter api provider i got this error:

William: I followed this guide: https://docs.ston.fi/docs/developer-section/dev-guide/getters

💥Phong: I'm doing it too (reply to 47041)

💥Phong: I'm doing it too. I can swap from TON to tokens and from tokens to TON. However, when the swap is completed, I am not returned the txhash. I don't know if you have done it yet? (reply to 47053)

Andru: Looking to hire a dev who can help me  1. Connect wallet to website  2. pull NFT metadata (getgems) from the user's wallet  3.  mint from webui with smart contract with royalties to a smart contract address DM me for consideration. Please send portfolios if you have any or something to help me evaluate your skills

User<7003351347>: 🦐

Sumit: i am using blueprint and tact but i am unable to print anything using dump()

Tawfik: - EQD36Lxp6p4FMzHQThWzvFNaqhbT8Qip4rMF1NYjCSgY6ksE  - 0:f7e8bc69ea9e053331d04e15b3bc535aaa16d3f108a9e2b305d4d623092818ea  What is the difference between these contracts they are for the same token? And how can i get the first one format from the second?

Zaitsev [will never DM you first]: It doesnt return the tx hash yet because it has to be included in a block as far as I know (reply to 47061)

&rey: Address.parse(any form).toString() or .toRawString(). (reply to 47065)

kevin: https://docs.ton.org/develop/dapps/cookbook             this might answer your question (reply to 47065)

Gunnar: https://ton.org/address/ (reply to 47065)

💥Phong: I have this wallet address. And I have 2 purchased tokens. I want to use TON's SDK on Nodejs to get a list of tokens and how to use their balance. Please guide  https://tonscan.org/address/UQA3iZ9mDnZX-4REbbA5cMCC_Uc_P5iL1_tfoqBUZX_hR71x#tokens  This is my wallet. Now I want to get a list of 2 tokens that I am holding. information about them such as: symbol, address, amount...

Tiago: Hi guys, any way to get enough Testnet TON tokens to spin up a validator pool?

Zaitsev [will never DM you first]: @pcrafter can you please check this out? Thanks in advance!! (reply to 47053)

&rey: Do you have DEX doc link? (reply to 47053)

Zaitsev [will never DM you first]: https://docs.dedust.io/docs/swaps (reply to 47077)

Zaitsev [will never DM you first]: I basically wrote the cells myself because I want several internal transactions before the actual swap

&rey: You're trying swap TON—>jettons? (reply to 47079)

&rey: And is error occuring on pool or vault contract?

Zaitsev [will never DM you first]: Yes indeed (reply to 47080)

Sumit: @pcrafter (reply to 47064)

Zaitsev [will never DM you first]: I get exit code 9 and/or 263 (reply to 46962)

&rey: Have you changed appropriate config value? (reply to 47083)

Sumit: yes (reply to 47085)

Sumit: blockchain.setVerbosityForAddress(bridge.address, {             debugLogs: true,         });

Zaitsev [will never DM you first]: https://tonviewer.com/transaction/5c5083314de3c55ce8ab60ac82ab0d70bf3b0ab6245d5489297f26bd816f30db (reply to 47081)

&rey: And in Tact compilation config? (reply to 47086)

Zaitsev [will never DM you first]: Here a tx so you will have a better sight :)

&rey: Have you deducted TRADE_FEE? (reply to 47090)

&rey: https://docs.dedust.io/recipes/write-a-func-contract-to-swap-ton-to-scale-and-send-to-recipient

Sumit: oh, didnt enable that (reply to 47089)

Zaitsev [will never DM you first]: Yes, I deduct 1% from the initial amount. That is step A -> B. A -> C should be the swap

&rey: The code I've sent deducts 0.2 TON always. (reply to 47094)

Zaitsev [will never DM you first]: Im doing it in JavaScript btw. Guess that wouldn’t matter regarding the cells right? (reply to 47095)

Sumit: dump cant print Address?

&rey: No, since it's represented by Slice in TVM, and you don't want to see slice representation. (reply to 47097)

Zaitsev [will never DM you first]: Hmm, I assume the example you send is regarding the FEE for the gas. But I want to create a transaction where the user pays a fee for using the service. So lets say the user swaps 1 TON. 1% from that should be send to a specific address for using the service (reply to 47095)

Zaitsev [will never DM you first]: @pcrafter sorry for bothering again. Can you check this out please? (reply to 47099)

&rey: I suppose vault still requires that amount to swap is <= received amount - 0.2 TON? (reply to 47099)

Zaitsev [will never DM you first]: so basically when storeCoins I have to deduct the fee for the service being used and the gas being spent?

Zaitsev [will never DM you first]: hmm you were right about the gas. Now it indeed does not throw an error, but somehow the swap does not take place. It returns the TON back to the sender. Do you have any idea why @pcrafter https://tonviewer.com/transaction/3151ca34673a21b22e18bda983e4d99931f677ea6ef7ee5ff58b5654639e0c16

&rey: Maybe your swap params are invalid or ask to return TON for TON received? (reply to 47102)

Zaitsev [will never DM you first]: it's like the exact same as a succesfull swap. I'm confused because of that (reply to 47104)

Mohammad: Hey guys How can I store nft content string from inside of my FunC contract?  The same as typescript snippet below:  let itemContent = beginCell().storeBuffer(Buffer.from("x.json")).endCell();  I tried this but the outputs are not the same: slice  nftItemMeta = "x.json"; begin_cell().store_slice(nftItemMeta).end_cell()  I get exitCode:9 (cell underflow) using the FunC code above!

Sumit: {         lt: 8000000n,         now: 1711385195,         outMessagesCount: 1,         oldStatus: 'uninitialized',         endStatus: 'non-existing',         totalFees: 333328n,         from: EQCKkUEP8Fz1C8o3jKxbLP1cmyS3c4jDHElPBKm4BsfJnjvO,         to: EQDDNmthRkSuF39HZ-3D_2SR7BUET8XKtFH9H6UscFrkq1MR,         on: EQDDNmthRkSuF39HZ-3D_2SR7BUET8XKtFH9H6UscFrkq1MR,         value: 1482031000n,         body: x{89B71D098011522821FE0B9EA17946F1958B659FAB936496EE7118638929E0953700D8F933D00154BDB6D76832B9FC2CEAD2AD6361649FDAFAE58B36909A9A9BB9D4720B3AB47C00000000000000000000000000000000000000000000000000000000000000020},         inMessageBounced: false,         inMessageBounceable: true,         op: 2310479113,         initData: undefined,         initCode: undefined,         deploy: false,         aborted: true,         destroyed: false,         exitCode: undefined,         actionResultCode: undefined,         success: false       }  How should i debug this transaction?

William: how can i get top holders of jetton or lp token?

Zaitsev [will never DM you first]: @pcrafter is it possible to send half of the TON from a transaction to one wallet and the other half to another wallet when performing a JETTON > TON swap?

Zaitsev [will never DM you first]: Couldn't find something usefull in the docs

Zaitsev [will never DM you first]: probably overseen it

&rey: Yes. This doesn't even require any special configuration in swap. (reply to 47112)

Zaitsev [will never DM you first]: Are there docs to show how this works? I basically want to transfer a % of the received TON after a JETTON > TON swap (reply to 47115)

&rey: Hint: you need to transfer a % of the received TON <after something which does not matter>. (reply to 47116)

Sumit: can i convert address to string before dumping it?

Zaitsev [will never DM you first]: I want it to be in the same tx though. Is it possible to get data from an internal message? And then perform another internal message based on the received data? (reply to 47117)

Zaitsev [will never DM you first]: I dont have too much experience with cells so could be me asking too much. Just curious if it’s possible and if there is an example :)

&rey: You know that any tx happens on one contract exactly, right? (reply to 47119)

&rey: Yes. Somewhere out there is even a FunC implementation. (reply to 47118)

Zaitsev [will never DM you first]: Not sure what you mean here (reply to 47121)

Zaitsev [will never DM you first]: I want to interact with lets say the dedust contract. Performing a JETTON > TON swap. Lets say I get 10 TON. I want to forward half of the received TON to another wallet in the same tx

Sumit: let init: StateInit = initOf WrappedJettonWallet(myAddress(), msg.contract);         let wallet: Address = contractAddress(init);          send(SendParameters{             body: JettonTransfer{                 query_id: 0,                 amount: msg.amount,                 destination: msg.to,                 response_destination: msg.contract,                 custom_payload: null,                 forward_ton_amount: 0,                 forward_payload: beginCell().asSlice()             }.toCell(),             to: wallet,             value: 0,             bounce: true,             mode: SendRemainingValue          });  I am trying to transfer the jetton that my contract has to a receiver. i am unable to make this work. it fails with some error (reply to 47123)

Sumit: what i think the proble is that the wallet address is being calculated incorrectly

Sumit: hence the failure

&rey: Do you know what is transaction on TON? (reply to 47124)

Sumit: @pcrafter (reply to 47125)

&rey: Please stop pinging me, (@zaitsevp also)! (reply to 47129)

Sumit: sure, i though you missed. (reply to 47130)

MisterWhales: I just minted a jetton

MisterWhales: I want to launch it for fundraising

MisterWhales: What to do?

Sumit: this doesnt work, but if i create the address off chain and send as argument then it works (reply to 47125)

Sergey: i use @orbs-network/ton-acces and always get this error when trying to read the contract. How can I fix this?

Sergey: solved. Change ton package to @ton/core (reply to 47136)

TON Bounty Bridge: ​Complete a DAO smart-contract with voices weight and funds distribution  🏷 Developer Tool  Summary:Draft:https://github.com/the-real-some-dao/a-dao  Created by somewallet

TON Bounty Bridge: ​Launch first freelance-exchange protocol  🏷 Developer Tool  Summary:Launch and test freelance exchange protocol:https://github.com/the-real-some-dao/a-careers-smc  Created by somewallet

Zaitsev [will never DM you first]: hi all, anyone else experiencing some lag retrieving data from tonviewer and tonconsole api?

Zaitsev [will never DM you first]: my tx on tonwhales explorer has gone through but it takes like 50 to 60 seconds until that data is seen on tonviewer and tonconsole api too

Iván: Hey guys, what I can do with the pattern like this?    cell: <Cell 724[7779DCC815138D9500E449C5291E7F12738C23D575B5310000F6A253BD607384E0000295EECB5C4CB1D1E33B8F13B5E72467622B424A82E7A51D5CFC104B9D0DB403F8BC56F51A7B60000295EECB5C4C96601EFBB000347A846820] -> 3 refs> >  I am trying to study transactions, mostly with pytoniq lib. What I can assume about the transaction to decode it more? where I can read about the from BOC to BOC encoding? could you guide me please?

— 2024-03-26 —

Kenny$$Shillz: he guys just made this bot that reports swaps on stonfi ... I would appreciate ant feed back i get Thanks!!!   https://t.me/TonTokenSnipper

Kenny$$Shillz: Any good guide for contract verifivation?

William: . please help (reply to 47111)

nik: Hello, what is the best way to check if a swap on dedust/stonfi was fulfilled?

nik: If I send a lot of transactions from one address, how do I handle the seqno?  if seqno has yet not been increased, how does it happen? Then two transactions will have same seqno and fail?

&rey: verifier.ton.org (reply to 47154)

&rey: https://t.me/tondev_eng/16069 (reply to 47158)

&rey: Please note that not all wallets have seqno.

nik: Thanks! (reply to 16069)

nik: Okay. If have, how do I handle this situation? To send 5 transactions in one second for example and then seqno has yet not been incremeneted? (reply to 47161)

nik: possible to put some random seqno?

nik: some random number between 9999 and 99999999

&rey: Yes, in a highload wallet. (reply to 47164)

nik: Ok, thanks.   So if ordinary v3 r2 wallet, and potentially need create a lot of transactions per minute, then only way is to wait the previous address to be confirmed?  Really no other way to handle this situation? (reply to 47166)

nik: Does highload wallet work in same way like ordinary wallet?  For create, make transfer, send jettons, and so on? (reply to 47166)

&rey: It has another wrapper, but differences quite end there. And it's a bit more expensive. (reply to 47168)

&rey: You may also use preprocessed wallet, which allows to send up to 255 messages per tx, and has usual seqno protection.

nik: Okay thanks! (reply to 47169)

nik: I prefer to find a solution with ordinary wallets.  but If a transaction fails, how to make to update the seqno anyway? (reply to 47169)

User<6861867033>: hi guys, who can help me with swap?

User<6861867033>: result: {     '@type': 'smc.runResult', exitcode:-13

User<6861867033>: const tonToJettonTxParams = await router.buildSwapProxyTonTxParams({ userWalletAddress: WALLET_ADDRESS, proxyTonAddress: PROXY_TON, offerAmount: new TonWeb.utils.BN('1000000000'), askJettonAddress: JETTON0, minAskAmount: new TonWeb.utils.BN(1) });

nik: How to increase seqno no matter transaction fails or no?

&rey: Wdym fails? Transaction processing external message to wallet should not fail, it may have unforeseen consequences. (reply to 47172)

&rey: Is contract initialized? (reply to 47176)

&rey: Does it have get-method you are calling?

User<6861867033>: How can i change into other method? (reply to 47181)

&rey: Ah, I see, you use preexisting lib... Is router contract deployed?

User<6861867033>: I used ston.fi sdk. I run sample code on doc but errors are coming out 🤮 (reply to 47183)

Kenny$$Shillz: Stonfi documentation is not too helpful tbh (reply to 47185)

William: yep (reply to 47186)

Jimmy Becen: Hello everyone! Please help me process this request!    receive("refunding increment") {          // print how much TON coin were sent with this message         dump(context().value);         // Todo: The smart contract will take a portion of the context().value and return all the unused excess TON coin value.         // For example: User sends 1Ton. The smart contract takes 0.5Ton and returns the remaining unused amount to the sender                  // return all the unused excess TON coin value on the message back to the sender (with a textual string message)         self.reply("increment refund".asComment());     }

User<6861867033>: result: {     '@type': 'smc.runResult', exitcode:-13 What does this error mean? is there any document about like these errors?

User<6861867033>: And can i try swap on testnet?

Dmitry | backend4you.ton: https://docs.ton.org/learn/tvm-instructions/tvm-exit-codes (reply to 47189)

User<6861867033>: but there's no -13 cases (reply to 47191)

nik: Hello, I have a question  Using dedust sdk, how to handle multiple swaps in short period of time? Like 5 swaps ton -> jetton from one wallet  https://docs.dedust.io/recipes/how-to-swap-ton-to-scale-using-dedust-sdk  I am trying the code provided in the recipe, but there is a problem. Only first swap is good. Another ones are not even sent  Is it a seqno issue? (reply to 47092)

nik: @pcrafter Okay, so if it's a seqno issue can I provide seqno directly like this?  await nativeVault.sendSwap(     sender,     {       poolAddress: pool.address,       amount: amountIn,       limit: minAmountOut,       gasAmount: toNano("0.25"),       seqno: seqno     },   );  And to handle the seqno issue, store pending transaction and every time a swap is created increment the pending transaction  and then seqno = seqno + pendingTransactions

nik: I did the following way and the seqno is correct, but still only first swap is finalized, another not even saved in blockchain.  Does TON allow to make a transef when seqno still not updated? (reply to 47194)

nik: Or should the seqno be defined in another place when creating the swap? (reply to 47194)

nik: So basically my question is :  Is it possible to initiate with a wallet a lot of transfers in one second, and setting seqno = network seqno + known number of pending transactions

V 🍅 🐾: A few years ago I created a wallet address on Gram wallet to participate in Airdrop on Telegram. whose wallet address is EQDJnRhneMjbuYW3lPE62QjnS0joElkuotcdO5j7PhVN4Fsv Today when I went back to using the seed phrase to log in again, the wallet addresses changed, and I couldn't find my Ton.

Conight: Hey guys, I’m using blueprint to run scripts and show error   Property 'getContractState' does not exist on type 'TonClient4 | TonClient'.   Property 'getContractState' does not exist on type 'TonClient4'.  41     const curState = await provider.api().getContractState(minterContract.address);  How to fix it

Andre 🍅: which is the testnet address sir?

Andre 🍅: OQ / UQ?

&rey: No. Once again, https://t.me/tondev_eng/16069. (reply to 47195)

Tumin | Wagmi11: avoid this by converting all the big int props of the object to string (reply to 46890)

Sumit: Got it (reply to 47204)

Tiago: Hi guys, would it be possible to contact anyone from the Ton team?

&rey: partnership@ton.org (reply to 47206)

&rey: 0Q / kQ is testnet. (reply to 47201)

Tiago: thank you @pcrafter (reply to 47207)

William: this error because this address of pool does not exists from STONfi.dex, check it (reply to 47189)

N/A: Hey guys. I tried to bridge from TON to ETH using official bridge. It asked me for $2,000 in fees on the ETH end to accept the funds. Then the transaction to accept the funds dissapeared altogether. I have raised an issue with the support but no response. They burned my token but now I have no way to get them. Any help would be appreciated.

Anthony: Have you reached https://t.me/ton_help_bot ? (reply to 47211)

Tumin | Wagmi11: Any reference for SBT with blueprint implementation I checkout out multiple source but I am falling to parse to parse sbt item data

N/A: Reached out multiple times with no response. (reply to 47213)

Conight: Someone help me? (reply to 47199)

Tumin | Wagmi11: TonClient4 doesn't have this method https://ton-community.github.io/ton/classes/TonClient4.html But is is present on TonClient https://ton-community.github.io/ton/classes/TonClient.html#getContractState  Try explicitly defining a client of type TonClient, and call the method (reply to 47199)

Conight: I’m using example scripts from ton.  https://github.com/ton-blockchain/token-contract/tree/main/scripts  But not working.  Is there a better example project? Thx a lot. (reply to 47217)

Tumin | Wagmi11: link the file and line (reply to 47218)

Conight: https://github.com/ton-blockchain/token-contract/blob/main/scripts/minterController.ts  This file and run with command npx blueprint run minterController (reply to 47219)

Conight: error:  scripts/minterController.ts:41:43 - error TS2339: Property 'getContractState' does not exist on type 'TonClient4 | TonClient'.  Property 'getContractState' does not exist on type 'TonClient4'. 41     const curState = await provider.api().getContractState(minterContract.address);                                              ~~~~~~~~~~~~~~~~scripts/minterController.ts:77:43 - error TS2339: Property 'getContractState' does not exist on type 'TonClient4 | TonClient'.   Property 'getContractState' does not exist on type 'TonClient4'. 77     const curState = await provider.api().getContractState(minterContract.address);                                             ~~~~~~~~~~~~~~~~ scripts/minterController.ts:110:41 - error TS2339: Property 'getContractState' does not exist on type 'TonClient4 | TonClient'.  Property 'getContractState' does not exist on type 'TonClient4'. 110         const contractState = await api.getContractState(minterAddress);                                             ~~~~~~~~~~~~~~~~ (reply to 47219)

Anthony: As I know they have asked to provide some information (reply to 47215)

Chukwunonso: Please what's the latest method to switch ton keeper wallet to testnet, can't find the charge network button

Conight: And i noticed that except custom network, ton source code will only create TonClient4 instance          if (network === 'custom') {             ......          }          else {              tc = new ton_1.TonClient4({                  endpoint: await (0, ton_access_1.getHttpV4Endpoint)({ network }),              });          } (reply to 47219)

Conight: Browser version need to click bottom logo several times in Settings tab. (reply to 47224)

Chukwunonso: Am using app version and did similar stuff, I only saw button. To switch to dev mode and other stuff but no switch network button

R.s: Hi please helpe me my page have error  and Icannt mine

N/A: Yes we got it sorted now thank you.  Great service by the TON team! (reply to 47223)

Sleapy: Hi, I'm trying to send a transaction to a "nonexist" or "uninited" address through tonlibapi but it won't create the query and revert with this: "DANGEROUS_TRANSACTION: Transfer to uninited wallet"  here is the code who throw the error: if (destination.get_wallet_type() == AccountState::Empty && destination.get_address().bounceable) {       if (!allow_send_to_uninited_) {         return TonlibError::DangerousTransaction("Transfer to uninited wallet");       }       destination.make_non_bounceable();       LOG(INFO) << "Change destination address from bounceable to non-bounceable ";     }   If i allow tx to be sent to uninited account I lost the bounceable field and I may lose the value associated with the message.  I see on explorers that some people can send to nonexist or uninited address and still get bounced back if the message fail.  How can I do it ?

Carson: Is there a way i can check signature in js?

LeeMinThien: Use ton-crypto .signVerify (reply to 47231)

&rey: Transaction to uninited account will fail 100%. (reply to 47230)

Sleapy: I know, but I want to be able to send them anyway (reply to 47235)

&rey: They do that from other TON SDKs. (reply to 47236)

Sleapy: Ok that was my guess. Maybe from higher level api than tonlib (reply to 47237)

Sleapy: thanks :)

nik: https://docs.ton.org/develop/dapps/tutorials/simple-zk-on-ton  so is tvm for zk proofs available on mainnet now?

Andre 🍅: oh OQ AND UQ same right? (reply to 47208)

Buggy: Is there a developer here who wants to launch his project and need more users ?

coin2600☮️🥝🐾🍋| Drops💧#wenkolo Hivera✌️Yescoiner NodeGo.Ai: I need detailed step by step instructions to create a token on the ton network

&rey: https://minter.ton.org/ (reply to 47244)

V.: Hello all,   Can u help me with sending transaction from backend, we send request to node(TONcoin) - and receive «ok» from node, but transaction don’t processed to blockchain   When we retry this to another node, or again to this node - transaction going to node, maybe u know how solve this?

Chukwunonso: Please has anyone used Tonhub wallet with Blueprint? Am trying to deploy to testnet but everything I scam qr code I get authentication failed

dëv: Whats a good charting site

N: Hello everybody, I need a Developer who can make a simple game and delpoy it onto TON Telegram, is there anyone available ?

در انتهای صبر، طلا می نشیند.: A (reply to 36875)

Nikita: Hey! I'm trying to make a swap TON -> JETTON using STON.fi SDK and tonweb I wonder which address I should use for offerJettonAddress for TON? Currently I found EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c  const swapTxParams = await router.buildSwapJettonTxParams({                 userWalletAddress: WALLET,                 offerJettonAddress: order.secondaryToken,                 offerAmount: new TonWeb.utils.BN('1000000000'),                 askJettonAddress: order.targetToken,                 minAskAmount: new TonWeb.utils.BN(1),             });  I would be so glad for help,  info or resources  🙏

Daniel: Is it normal that Ton Keeper desktop app shows this after I download? Is that the right website?

Daniel: Is it normal that Ton Keeper desktop app shows this after I download? Is that the right website?

&rey: Yes, the website is right. You may notice that warning merely asks you whether you *trust* the app, not declaring it a danger. (reply to 47256)

&rey: It's downloaded from Github Actions artifacts in official Tonkeeper repository, as well.

Svein: Simple smart contract how ?

Svein: Open zeppelin ?

Mikko: funC and simple do not fit into the same sentence, or even into the same book

Doggetti: hi

Doggetti: is there any charting solution for TON?

Doggetti: ston.fi and dedust

Nikita: You can use coingecko terminal public API (reply to 47266)

Nikita: If I understand your needs correctly

Doggetti: yes but Refused to display 'https://www.geckoterminal.com/' in a frame because it set 'X-Frame-Options' to 'sameorigin'.

Doggetti: when <iframe

Nikita: I’ll check tomorrow, going to sleep (reply to 47270)

Nikita: Guys, anyone who is familiar with STON.fi SDK or DEX swaps from code — I’m looking for someone who can consult/help me and I am ready to pay a few tons for all help requests

N: Any one ? (reply to 47249)

— 2024-03-27 —

A: Hello, I am here to help you (reply to 47273)

&rey: https://tonalytica.redoubt.online/dashboards (reply to 47266)

Long: Hi all, I have a question relate to blockchain indexer. Do we have anything similar to Event on Ton Smartcontract, that an offchain indexer can index and store relevant data on a db?

kevin: Try tonapi.com, if that not enough for you, should do it by yourself. (reply to 47277)

Long: thanks Kevin , I can get the transaction detail. Is it best practice is decoding the in_msg or out_msg to get the data?

Long: for example I have the transaction.in_msg.msg_data.body, I have to decode this to get the action call on the contract with params right?

Long: is there any js code sample I can follow to decode this data?

kevin: that's true, I not using JS before, but as golang code, you have to cell.BeginParse() and read each field accordingly,  methods like loadCoins/loadUint/loadAddr (reply to 47279)

Long: thanks, look like I am going the right direction here (reply to 47282)

&rey: in_msg is one already processed by a transaction, so it may prove more useful parsing them. (reply to 47279)

Long: I have another question since I am new to Ton, what is the different of in_msg and out_msg?

kevin: message are passing between contracts, when you call a contract, underlaying is sending a message. There is only one in_msg for each TX, 0 or multiple out_msg for a TX. out_msg count is determined by how many message a sent by that TX. (reply to 47285)

kevin: Anybody know how to get price in $ of any jetton asset on TON chain?

&rey: dton.io. (reply to 47287)

kevin: is there a way we can get that from original source, not through API? or another way to ask the question, how did dton.io get that data? (reply to 47288)

Grigory: Hello everyone, what version of tonweb the one that is in docs: https://docs.ton.org/develop/dapps/asset-processing/jettons#overview? Because when i write: const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"}); I get error, it needs JettonMinterOptions, not a single address

wikig: Hello guys ! are there any vanilla-js demo of @tonconnect/ui-react  ?

Amir Kahoori | P2P.org: Hi, is anyone here a dev for telegram wallet? @wallet

Kenny$$Shillz: Should you not batch the  two transfer messages in one transaction with same seqno? (reply to 47196)

wikig: Hello guys ! is there any way to use @ton/ton via html/js in front-ent ? Or is there any other js/class that can do beginCell() ?

wikig: I try using tonconnect to send transaction with payload . But it seems like i have to do body.toBoc().toString("base64")  , i notice the official docs import { beginCell } from '@ton/ton' . but i am using raw-html/js . how can i do the same thing to encode the text ? Thanks ! (reply to 47297)

Kenny$$Shillz: Use tonclients rungetmethod to call the ton/usdj stonfiefi pools get_asset_data (reply to 47294)

Kenny$$Shillz: client=new TonClient() let poolData= await client.runGetMethod(ton_usdj_pool_addrss,"get_asset_data")

Kenny$$Shillz: Destructure poolData to get values

Alexs: hi guys, im a developer making a bot for telegram with TON enviroment, it's a AI that let you see a 3d imagen from a real picture, pls help us with some feedback and a coffe if you would like to support us. @MiruAI_bot

Kenny$$Shillz: I think there's also another method to get the price directly from the pool just go through the stonefi SDK docs and API refs

Nikita: Wow! I am really happy to hear it 🙂  Now I am trying to make a jUSDT -> TON swap, and facing tx revert again here is code   const swapTxParams = await router.buildSwapJettonTxParams({         userWalletAddress: WALLET,         offerJettonAddress: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA",         offerAmount: data.balance,         askJettonAddress: "EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez",         minAskAmount: new TonWeb.utils.BN(5000000000),     });      await wallet.methods.transfer({         secretKey: keyPair.secretKey,         toAddress: "EQBA6vnP10U3au62S8aez5KxmYqeTH_LEudZ8ke5gI6BCYZs",         amount: swapTxParams.gasAmount,         seqno: Number(await wallet.methods.seqno().call()),         payload: swapTxParams.payload,     }).send();   here is failed tx:  https://tonviewer.com/transaction/757e8c16039b3cf7dc1508ad5f5e1610680f4d58f1c87c4f63f76beef42bf191 (reply to 47275)

Samyar: how can i get a list of all minted nfts in the collection?

Samyar: did you found any ? (reply to 45955)

Nxrix: Well yeah I used tonapi.io (reply to 47306)

Nxrix: The only problem is that the new nfts metadata is not shown

MEW: Where can I see the geographical distribution of TON nodes

MEW: I remember there was a place I could see before, but I couldn't find it anymore

&rey: dton.io/graphql (reply to 47305)

Samyar: thank you bro 👌👍 (reply to 47308)

&rey: https://ton-validators-map.vercel.app/ (reply to 47309)

MEW: cool

MEW: Do you have any resources related to TON's MEV?

Jimmy Becen: Error: Unsupported item type: tvm.stackEntrySlice  call getter function return Unsupported item type: tvm.stackEntrySlice Code getter function:   get fun orderInfo(orderId: Int): OrderInfo? {         return self.orderMap.get(orderId);     }  Why does this simple getter function always return an Unsupported item type? I also tested common types like String, and Int but only on returning structs have error.

👉👑𝐏𝐚𝐢𝐝 𝐏𝐫𝐨𝐦𝐨𝐭𝐞𝐫 𝐒𝐢𝐚𝐦 {20𝐤}🇧🇩🌏◡̈⃝: @admin give me please ton withdraw and deposit code.🙏

👉👑𝐏𝐚𝐢𝐝 𝐏𝐫𝐨𝐦𝐨𝐭𝐞𝐫 𝐒𝐢𝐚𝐦 {20𝐤}🇧🇩🌏◡̈⃝: @admins (reply to 47317)

F: The only reason why administrators are called is to ask to block someone. Reply to this message to get blocked. (reply to 47318)

Семён: Hi all, is it possible in Tact or Func to get any extra sender information, such as wallet transaction count, last_transaction_id, etc?

Семён: Or maybe prev_trans_hash/lt, like here? (reply to 47321)

TON Bounty Bridge: ​Provide a graphical TON system overview  🏷 Education  Summary:This affects In-Source-Documentation.  Created by stenolog

N: Hello, I need a developer to use PlayDeck to Launch my Game on Telegram, is there anyone available ?

Joey: hello, I currently have $478 USDT stuck in the ton bridge. The problem is the tonkeeper wallet keeps giving me a "failed to calculate fee" error when it comes to confirming the transaction. The fee should be 1 $TON to use the bridge. Any ideas?  Thank you in advance

Joey: I am using the chrome extension

Xander: I want to use this contract as a trait to create my own jetton contract by tact, how could I do it?

User<6123789878>: who needs developer?

Nikita: Are you familiar with STON.fi SDK and swaps using it? (reply to 47328)

User<6123789878>: yes, ever built swap platform on TON network before, please dm me (reply to 47329)

Mikhail: Hello everyone, im getting exit code 9 while trying to do:   let bet_id: Int = sha256(beginCell().storeAddress(msg.caller).storeInt(msg.event_id, 64).asSlice());

&rey: Well, your bit count is not divisible by 8. (reply to 47331)

Mikhail: what is the bit count for address? 257? (reply to 47332)

&rey: Standard addresses are 267-bit (3 flag bits + 8 for workchain + 256 hash part). (reply to 47333)

Mikhail: thanks! (reply to 47334)

&rey: Tact protects you from other kinds of addresses, but they may range from 2 to ~510 bits.

Mikhail: i am fixed it by just calculating hash of a slice, thanks! (reply to 47336)

&rey: Please note that's expensive! It might be cheaper using .storeInt(msg.event_id, 69). (reply to 47337)

Mikhail: sha256 is cheaper that calculating hash of a slice? wow, thought it's doing absolutely the same (reply to 47338)

&rey: Hash of a slice converts it into cell (via builder), which costs 500 gas at minimum. (reply to 47339)

Mikhail: thanks! We'll do optimisation later! gonna mark it on todo (reply to 47340)

𝐴𝑅𝐸𝐹 𝑆𝑆: I think it's a silly question,but applications that require heavy processing can be launched on the Open Network blockchain?

&rey: What kind of heavy processing? (reply to 47343)

&rey: If it's with public algorithm, you may create ZK L2 for your application.

&rey: If it parallels with number of users + users pay for that, then you can create a suitable contract system.

&rey: Otherwise... you don't move the application into blockchain!

𝐴𝑅𝐸𝐹 𝑆𝑆: For example, run an ai model on blockchain.  Is it even possible? (reply to 47344)

&rey: You don't run it on blockchain, you run it on the backend and prove results with ZK layer, as in https://orion.gizatech.xyz/academy/tutorials/mnist-classification-with-orion. (reply to 47348)

𝐴𝑅𝐸𝐹 𝑆𝑆: A Zero-Knowledge Proof is a cryptographic protocol that allows one party to prove the truthfulness of a statement (such as the ownership or validity of data) without revealing any information about the data itself.  Did I get it? (reply to 47349)

&rey: Yes. You have to not reveal your neural network, for instance, because it is too big for that. (reply to 47350)

Boris: Is there a chat to promote a demo?

Boris: Or beta.. would be cool to have smth line that.

Jimmy Becen: hi everyone How to query event on Ton Network

𝐴𝑅𝐸𝐹 𝑆𝑆: And If we want train model on blockchain? What will the structure be like? Does the Open Network have the ability to do that? (reply to 47351)

&rey: Let's rephrase: does any blockchain support that? (reply to 47356)

𝐴𝑅𝐸𝐹 𝑆𝑆: Blockchains such as filecoin can provide storage space for files.  Can't other blockchains use miners' processing power for AI? (reply to 47357)

&rey: You do understand that then they need to multiply training/eval resource consumption by number of nodes, increasing it hundredfold, right? (reply to 47358)

𝐴𝑅𝐸𝐹 𝑆𝑆: Why (reply to 47359)

&rey: Because blockchain consensus depends on nodes checking each other if the result is correct. (reply to 47360)

𝐴𝑅𝐸𝐹 𝑆𝑆: So How does ICP work? (reply to 47361)

Jonny: Hi, why I received the error exit code 136 when I tried to transfer jetton token?

Tawfik: https://tonapi.io/v2/traces/{tx_id}  how can i extract swap details from this endpoint ?

Nxrix: What is highload v2 r2

Nxrix: A type of wallet used for exchange platforms?

TON Bounty Bridge: ​Publications Support  🏷 Education  Summary:The publication support program is aimed at stimulating the creation and distribution of quality con...  Created by kuhel

Soheil: https://tonviewer.com/transaction/e2f317a0563adce72f4931e47fe5a2e4d87d1f924bb4431d3c80434579b41341?section=trace I made this transaction, but after 5 hours, my wallet has not been deposited into my account, what should I do now?!

Soheil: I made this transaction, but after 5 hours, my wallet has not been deposited into my account, what should I do now?!

Nxrix: First of all this chat is not related to notcoin Second just Wait (reply to 47369)

Soheil: I also have a question about Natcoin The question was why my transfer was not credited to the ton coin network (reply to 47370)

Nxrix: Idk what you mean (reply to 47371)

LeeMinThien: Can I call a getmethod with query is a string like orderID "HK3123mM"? Any SDK can handle this?

&rey: Yes. Just put this string into cell. (reply to 47373)

Sumit: https://testnet.ton.cx/address/EQD0Vwdo1km2pg8L00Uv_MmBSZ8BLwOWKaq4ODhz7hhxuzKk Can anybody tell me what am i doing wrong?

Boris: Has someone experience with nft.storage ?

Boris: Its says its free ipfs storage, how does it work?

Boris: Ok, interesting..  How is NFT.Storage free to use? Filecoin storage providers commit their hard drive capacity to the Filecoin network, and earn significant block rewards for doing so. This translates into real-world profits for storage providers, which incentivizes them to continue committing additional hard disk space to the Filecoin network. However, when storage providers are storing data from Filecoin users, their likelihood of winning block rewards goes up by a big factor 一 10x! Because NFT.Storage participates in the Filecoin Plus program, all data uploaded through the service is eligible for this 10x reward multiplier. This is such a powerful incentive for Filecoin storage providers to store user data that they tend to be willing to offer free storage and retrieval services in order to get this block reward multiple. As a result, most storage providers offer free storage and retrieval on Filecoin today and will continue to do so as long as block rewards continue to be a powerful incentive. This should be true for a very long time 一 for example, it is still the case that block rewards are powerful incentives for Bitcoin miners today. While there is some additional infrastructure cost associated with running the NFT.Storage service, Protocol Labs is committed to maintaining this infrastructure indefinitely as part of our mission to grow the decentralized storage ecosystem and preserve humanity's information for future generations.

Sumit: i cant figure it out (reply to 47376)

Sumit: why is this happening

Afarin: Could you please advise on the body/ parameters of the get_public_key RPC method?

Afarin: Trying to retrieve a the publick key associated with a TON address

Андрей: This has nothing to do with TON (reply to 47380)

Boris: I know, but its common to use ipfs for nfts, for example getgems supports ipfs (reply to 47385)

Boris: Btw, does anyone know whats the status of TON Storage?

Boris: would be nice to use the TON ecosystem for as much as possible imho.

ℛ𝒾𝒸𝒽𝒶𝓇𝒹: Hi guys, Can u help me set up opentonapi in docker and add address to python library pytonconnect?

NICK: I did browse trough the TON white paper. Solana is compared there to a high-tech steam roller using outdated tech.  When sending transactions and comparing these it feels for me that somehow Solana transactions are confirmed faster.  Is my feeling right? Can anyone provide technical specs for transaction finalization comparing Solana and TON?  Please understand I am a huge fan of TON and I want it to succeed. Next problem I see are the swapping fees.  Now I am paying between 0.1 to 0.3 ton to swap coins on stonfi. Already when TON is at 5USD fees might be expensive for some people from Africa or India. Will the fees be lowered soon or are they going to increase  even further in the future?

Xander: How can I set addr_none (aka store_uint(0, 2)) in tact lang?

Ceren: When I wanted to connect my metamask wallet to ton.bridge.org, I got the following error message and I could not perform the transaction: "Cannot read properties of undefined (reading '0')"

.: tell me how to implement the selected piece of code (reply to 47397)

.: @myancore778 ?

Sumit: error: previous function return type ((int, int, int, int, int, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, int), int) cannot be unified with implicit end-of-block return type (): cannot unify type () with ((int, int, int, int, int, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, cell, int), int)   } What could be the reason for this?

Андрей: ton-torrent + mytonstorage.ton (reply to 47387)

Mohammad: Hi everyone. I'm new to web3, coming from strong web2 development experience, and excited to learn about new technologies.  I'm following the guid in documentation, however, I've got a question which maybe due to my lack of experience in decentralized environments.  For example, to develop a scalable leaderboard we have technologies like Redis, highly scalable and fast. How ever, as mentioned in documentation, the company or developers can easily change and modify the leaderboard, because of lack of transparency in web2:  So, i tried to develop a contract that can hold thousands or even millions of records as a sorted set, with basic functionalities.  However, now I have these questions:  1. Holding millions of records requires a lot of space, especially if I want to have daily and hourly leaderboards, and even if I only hold first 1000 items, then the leaderboard is not reliable and transparent.  2. If i have methods like addScore(user, score), then the calculation of the score is not transparent. The company can add huge numbers to chosen accounts. So, should I also implement the logic of score calculations? Even that still needs arguments that can be modified by the company.  3. From what I've understood, still the main functionality relies on web2, like a game or a social app. For this hackathon, how much should we use web2? Is there a rule of thumb? I'm new to this concept and will appreciate every experience you can give me.

Can: Hello, I have an issue with bridge.ton.org when I connect my metamask to bridge it shows "You have only 0 TONCOIN" although I see the token in my metamask wallet?

— 2024-03-28 —

User<6861867033>: Hello TON chain experts! Please help me to find the issue.

User<6861867033>: Why was this tx is failed? I can't find answer https://tonviewer.com/transaction/aecb44934fa48c9caf5965bad0ef86321e6cc3aed0c824e67060527740d7065c

William: how can i get all transaction of swap action form begin transaction? like this:

XuanXue: Anyone knows how to solve this issue when running full node  Exception: ValidatorConsole error: Validator console is not settings

&rey: You don't have return in the end of function. (reply to 47401)

Jimmy Becen: hi guys, How to parse event message ?  {   "messages": [     {       "hash": "5lObryWXeCxrbyZHeZFhU6rrMazmirfSm66/Avu86kc=",       "source": "0:3A0FA6015D4A698E77F6E812FED3DD8E0FCCE42EE9A17143C249CFF63F008378",       "destination": null,       "value": null,       "fwd_fee": null,       "ihr_fee": null,       "created_lt": "20294636000002",       "created_at": "1711594897",       "opcode": "0xa4387a51",       "ihr_disabled": null,       "bounce": null,       "bounced": null,       "import_fee": null,       "message_content": {         "hash": "ahvT+9KApheeuDBd7J4oGkhwPn1OgxYN7uDG4YrH2qc=",         "body": "te6cckEBAQEATAAAlKQ4elEAAAAAAAAAAAAAAAAAAAAAAAAAAAAyM7itOaErm7o6IcACUhJOC9sJH8v7ZjGeeKtWGAetm8DzZuDnnL3cb0f72dQdzWUA3PRH9g==",         "decoded": null       },       "init_state": null     }   ] }

Dmitry | backend4you.ton: click this in right bottom corner (reply to 47412)

William: Thanks you so much (reply to 47417)

Jonny: https://ton.cx/tx/45489976000003:a6Zq/xuvmmYogu1hSSzhu3yq1yfG8zXyo/kgupcnuDo=:EQA6RC5hvOHtalQeJTjLCq8ggYbl3xsiUjbLSJPaTIDZMxeC Help me why this tx was failed? I got the exit code is 136 when transfer jetton token.

JK: Hi to all Ton experts here.  Would like to ask questions about the minting nft flow.  Scenario 1 If I use frontend web to connect the wallet and send mint payload to my contract to mint the nft, how can my backend to capture the transaction status  Scenario 2 Can my backend handle all minting flow (like my frontend only needs to call 1 of my own backend API)  - I am not sure how can my backend to know which wallet address (without frontend pass me those sensitive data like private key or seed phases)  Hope you can share me your knowledge about this. 🫡

Nxrix: What were the languages for creating smart contracts? Can a smart contract access price of tokens and ton?

Nxrix: tact is better or func

Dmitry | backend4you.ton: you need to view into jetton source code to understand what check it performs before throwing 136. Your jetton has custom code (not default), so there is no source code available in explorers. (reply to 47419)

User<6861867033>: Hello TON chain experts! Who knows about exit code 709?

Dmitry | backend4you.ton: Programmer who wrote that smartcontract (reply to 47426)

User<6861867033>: You mean only the programmer knows that? (reply to 47427)

User<6861867033>: This is ston.fi's first entry smart contract's error code. https://tonviewer.com/transaction/3d556a8fa6efcea21873de4552e95bc3c00e4a7e410f5ff5f6f203e1bce17cc4 (reply to 47427)

Dmitry | backend4you.ton: And documentation he created for his program, of course :)  If you are experienced in FIFT you can try to read disassembled contract code too. (reply to 47428)

User<6861867033>: Can you review my tx? (reply to 47430)

Dmitry | backend4you.ton: step 1) take tx hash and open in tonscan: https://tonscan.org/tx/PVVqj6bvzqIYc95FUulbw8AOSn5BD1_19vID4bzhfMQ= step 2) go to account https://tonscan.org/address/EQAdDhnWrRuIppgIF9JFjtCCrsRtWDn4quo_jjF0gxaN0t4N step 3) switch to "contract" tab: https://tonscan.org/address/EQAdDhnWrRuIppgIF9JFjtCCrsRtWDn4quo_jjF0gxaN0t4N#source step 4) look for "709" in code, two places. I guess you case is first one - wrong ton amount values. (reply to 47429)

User<6861867033>: Thanks, can you give me this case's appropriate msg ton amount? Sorry i'm new to TON chain. (reply to 47432)

Dmitry | backend4you.ton: better track some actual stonfiswap tx. You're putting values (into body cell) that you dont understand, so either blindly copy "original" value, or you need to deep-dive into https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md jetton standard (reply to 47434)

LeeMinThien: My tonconnectUI sendTransaction request work on pc but not on mobile, what would be wrong here?

LeeMinThien: I can connect wallet on mobile but when send a transaction it say: bad request

Jonny: I use this source as I want to try jetton in tact: https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://github.com/Ton-Dynasty&ved=2ahUKEwjJ5768wpaFAxUhslYBHXtnB9kQjjh6BAgOEAE&usg=AOvVaw24Kx7PmXDT4KiKvKOU913R (reply to 47425)

User<1691331052>: Anyone here willing to become my new friend and to be partner in learning and helping?  I have 6 years of experience as frontend developer. Last 7 days I'm spending time learning funC and writting smart contracts. I would like to have someone to chat with, connect to meeting and discuss problems. I'll help you and you can help me 🫠

User<6861867033>: 🙏 Wow you hit the point! I finally understand what's going on!!!,  But thanks to my low knowledge in english I cannot understand 100%, to solve this problem I should send another tx to the destination? (reply to 47435)

Jonny: I found it, may be the code gen the invalid address for jetton. (reply to 47438)

Tony: Hi all, my purpose gets the latest transaction of all addresses. I'm using /GetTransactions API, but it seems it just only gets the transactions in specific address.

Tony: So do you have any way to do it ?

User<1691331052>: Anyone else with this issue?

User<6861867033>: What does bounce and bounced  mean? (reply to 47445)

User<1691331052>: When transaction is bounced it means value that has been sent with transaction is returned back to sender. Transaction has failed

User<6861867033>: You're right. this tx is failed. but successed tx have bounce:true and bounced:false. Is this important? (reply to 47447)

User<6861867033>: URL is here. failed https://tonviewer.com/transaction/3d556a8fa6efcea21873de4552e95bc3c00e4a7e410f5ff5f6f203e1bce17cc4 successed  https://tonviewer.com/transaction/40bd0e080f90ec6d6f4e2e240cf826c08ddb4c73e1be3584a48ce4e0833a9c5f Can you tell me solution?

User<1691331052>: https://docs.ton.org/develop/smart-contracts/guidelines/non-bouncable-messages this is a good starting point to learn about it

Dmitry | backend4you.ton: bounce - is a flag set by you (sender) that allow this msg to bounce back (with remaining TON value) if it fails to process. Without this flag, TONs from failed tx will stay at recipient address. TVM looks at this flag and sends bounce msg back if needed.  bounced - is a sign that this msg IS a bounce of some other msg. TVM sets this flag in msg. (reply to 47448)

xandrew: how can i get a jetton mc cap?

User<6861867033>: Your URL was a BIG help for me, But my english is bad so i cannot understand 100%. I can understand the reason of 709 error but cannot understand the solution. (reply to 47435)

xandrew: i couldn't find the endpoint

Pike 🦴 🏴‍☠️: hi everyone. does anyone have an example of cross contract message sending, like how do i identify the target contract and the message body

NFN: Hi for deploying my contract which version do i have to set in my contract while my tonkeeper wallet is on version 4.1.0?

NFN: WalletContractV4? (reply to 47456)

LeeMinThien: I found my problem, validUntil need to put outside of messages 😀 (reply to 47436)

User<6861867033>: Thanks. Can you review my code for swap? My error is come from this code and needs your help!!!!! 🙏 The red circle at the top is the end of sample code on Ston.fi documentation, And i created a tx on my own from that parameters but error is coming out. (reply to 47451)

User<1691331052>: Is there anywhere good documentstion how to work with dictonary, make it a tuple and return list back?

&rey: https://docs.ton.org/develop/func/cookbook#how-to-iterate-dictionaries https://docs.ton.org/develop/func/cookbook#how-to-iterate-through-lisp-style-list (reply to 47460)

User<1691331052>: Thanks 💫 And when I use get method in wrapper I am not sure how to read tuple I returned... where to find more info about that?  Btw, is there any kind of debuging smart contract? I'm from Javascripr world and I wonder is there anything like console.log()? 😄

Nxrix: is it possible to mint nfts with code? js? I want to mint so many

A: Hello (reply to 47463)

A: I can help you. (reply to 47463)

Nxrix: oh thanks) (reply to 47465)

TON Bounty Bridge: ​[PROCESS] Revise "Hall of Fame" Requirements  Created by stenolog

TON Bounty Bridge: ​Bounty task  Created by sweeded3

&rey: dump() (reply to 47462)

User<6861867033>: Hello Ton chain experts!  Can anyone review my code for swap? My error is come from this code and needs your help!!!!! 🙏 The red circle at the top is the end of sample code on Ston.fi documentation, And i created a tx on my own from that parameters but error is coming out.

User<1691331052>: wow, and where can I see those logs? (reply to 47469)

&rey: Sandbox returns them when running transaction chains. (reply to 47471)

💥Phong: How do you get the price of 1 tokene on TON? I searched but couldn't get its price. Can you tell me how to get it or tell me where I can get a reference?

User<1691331052>: Thanks! (reply to 47472)

&rey: How do you define price of jetton? (reply to 47473)

xandrew: interesting too (reply to 47475)

💥Phong: When the jetton has liquidity and is traded, it will have a price. I can make other chains. but TON is quite new to me and the documentation is not much so I still haven't figured out how (reply to 47475)

&rey: You need to enumerate DEXes with an indexer like dton.io / tonalytica.redoubt.online and aggregate their results. (reply to 47477)

💥Phong: For input, I have the token address available. I want to get the price of that token (reply to 47478)

&rey: The task, per your definition, is not very easy. Though IIRC TONAlytica can help you here. (reply to 47479)

💥Phong: like BSC or Solan on blockchain can get price through RPC easily via sdk. On TON I'm trying to do the same but can't (reply to 47480)

&rey: Are you ignoring my message? (reply to 47481)

💥Phong: Is this? (reply to 47480)

xandrew: is the information on redoubt up to date? (reply to 47478)

xandrew: no matter how many times I look, the information through the api is outdated. which is current as of last month.

💥Phong: I think it can solve my question. Can you help me how to use it? Or is there any document about it? (reply to 47487)

JK: how can we get tx hash after minting from frontend

xandrew: also outdated information xd (reply to 47487)

&rey: https://docs.ton.org/develop/dapps/cookbook#how-to-find-transaction-for-a-certain-ton-connect-result (reply to 47492)

JK: thanks expert

JK: May I dm you @pcrafter

&rey: You may not ask for DMs in this chat... (reply to 47497)

💥Phong: after swapping tons with tokens. i want to get txhash of that transaction. but I haven't done it yet. I referred to this link but don't know where the res came from. i write in nodejs. thanks (reply to 47495)

&rey: What SDK do you use for the swap? (reply to 47499)

JK: Got it. Thanks. Do you have golang sample

💥Phong: I use Dedust SDK (reply to 47500)

User<1691331052>: How to get address in human readable format or printout tuple? Any links to more about this topic? On ton website it doesn't says much about it and does not provides examples

A: Yes, I have golang sample. (reply to 47501)

&rey: And for sending transaction? (reply to 47502)

Greg: how can I reduce the fees for sending jetton via highload v2? its costing ~5 ton to send 50 transfers (!!)

💥Phong: I couldn't find a way to swap on TOn's document. Can you guide me? I want to swap TON -> token and token->TON (reply to 47505)

&rey: I think you can try calibrating the TON amount so that there is no need to send excess back; that will decrease messages count by 25%. (reply to 47506)

&rey: https://docs.ton.org/develop/dapps/cookbook#how-to-send-a-swap-message-to-dex-dedust (reply to 47507)

&rey: Though jetton-TON swaps are a bit outside of scope of TON documentation, aren't they? (reply to 47507)

Greg: thanks @pcrafter

💥Phong: Yes (reply to 47511)

💥Phong: export async function swapTONToToken(   contractAddress: string,   buyerPublicKey: string,   buyerSecretKey: string,   amount: number ) {   try {     const tonClient = await getClient();     const factory = tonClient.open(       Factory.createFromAddress(MAINNET_FACTORY_ADDR)     );      //The Factory contract  is used to  locate other contracts.     const tonVault = tonClient.open(await factory.getNativeVault());      const TOKEN_ADDRESS = Address.parse(contractAddress);      const TON = Asset.native();     const TOKENB = Asset.jetton(TOKEN_ADDRESS);      const pool = tonClient.open(       await factory.getPool(PoolType.VOLATILE, [TON, TOKENB])     );     // Check if pool exists:     if ((await pool.getReadinessStatus()) !== ReadinessStatus.READY) {       throw new Error("Pool (TON, SCALE) does not exist.");     }     // Check if vault exits:     if ((await tonVault.getReadinessStatus()) !== ReadinessStatus.READY) {       throw new Error("Vault (TON) does not exist.");     }     const amountIn = toNano(amount);      let keyPair = await mnemonicToPrivateKey(stringToMnemonics(buyerSecretKey));     const wallet = tonClient.open(       WalletContractV4.create({         workchain: 0,         publicKey: keyPair.publicKey,       })     );      const { amountOut: expectedAmountOut } = await pool.getEstimatedSwapOut({       assetIn: Asset.native(),       amountIn,     });      // Slippage handling (1%)     const minAmountOut = (expectedAmountOut * BigInt(99)) / BigInt(100); // expectedAmountOut - 1%      const sender = wallet.sender(keyPair.secretKey);     const transation = await tonVault.sendSwap(sender, {       poolAddress: pool.address,       amount: amountIn,       limit: minAmountOut,       gasAmount: toNano("0.2"),     });      console.log("swapTONToToken", transation, minAmountOut);     return { message: "Successful transaction" };   } catch (error) {     console.log("Buy error", error);     return { message: "Transaction error:" + error };   } } (reply to 47511)

💥Phong: My Code

💥Phong: await scaleWallet.sendTransfer does not return a value, it is void (reply to 47509)

&rey: It's best patched in the library. (reply to 47516)

xandrew: so do you think i can get jetton info somewhere? price & mc cap  your suggestions above unfortunately don't work (reply to 47517)

Pike 🦴 🏴‍☠️: does dedust has a testnet that we can work on?

Viki C: Hello! Any admin here?

Viki C: I’m Bria from LBank, and we currently need a doc of latest api. May I ask who should I talk to?

nohara: Hi, just new to TON, anyone know how to store the content properly with jetton-minter.fc contract. I've got an error with Key serializer is not defined.  Here is my codes:

Tony: Hi everyone, how can I get the token name from account address ?

Tony: {       "account": "-1:5555555555555555555555555555555555555555555555555555555555555555",       "hash": "wrNCAgxwk8O0oy3sTh8stLOHx9IUSmGZn4IYBkhwn7E=",       "lt": "45537002000003",       "now": 1711627830,       "orig_status": "active",       "end_status": "active",       "total_fees": "0",       "prev_trans_hash": "TO6HJi0droDeQW3tMJVP8nsMG5i/JpjEvwYLDFVHrKQ=",       "prev_trans_lt": "45537001000003",       "description": {         "type": "tick_tock",         "action": {           "valid": true,           "success": true,           "no_funds": false,           "result_code": 0,           "tot_actions": 0,           "msgs_created": 0,           "spec_actions": 0,           "tot_msg_size": {             "bits": "0",             "cells": "0"           },           "status_change": "unchanged",           "skipped_actions": 0,           "action_list_hash": "lqKW0iTyhcZ77pPDD4owkVfw2qNdxbh+QQt4YwoJz8c="         },         "aborted": false,         "is_tock": true,         "destroyed": false,         "compute_ph": {           "mode": 0,           "type": "vm",           "success": true,           "gas_fees": "0",           "gas_used": "2486",           "vm_steps": 46,           "exit_code": 0,           "gas_limit": "35000000",           "msg_state_used": false,           "account_activated": false,           "vm_init_state_hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",           "vm_final_state_hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="         },         "storage_ph": {           "status_change": "unchanged",           "storage_fees_collected": "0"         }       },       "block_ref": {         "workchain": -1,         "shard": "8000000000000000",         "seqno": 36979712       },       "in_msg": null,       "out_msgs": [],       "account_state_before": {         "hash": "OmD4/yDa4HS/MYbfpkZvQFIeBlVWQ8FHZbNC8klvoFA=",         "balance": "1652459595885",         "account_status": "active",         "frozen_hash": null,         "code_hash": "ZKQ5cPIAeh2m1vyBdzzAldHMJw6BNZ5HHzsDRpq+t7U=",         "data_hash": "/dUEwjTWj/SC/lddW1tm2QIJFE7QEmVZ2up/NpOyEp0="       },       "account_state_after": {         "hash": "OrR1lZTgMXTxmD2XqcUiLgxWHQ6olaKGqZyPwuOCm/g=",         "balance": "1652459595885",         "account_status": "active",         "frozen_hash": null,         "code_hash": "ZKQ5cPIAeh2m1vyBdzzAldHMJw6BNZ5HHzsDRpq+t7U=",         "data_hash": "/dUEwjTWj/SC/lddW1tm2QIJFE7QEmVZ2up/NpOyEp0="       },       "mc_block_seqno": 36979712     },

JK: Hi experts Can we like getting all minted nfts under one collections then compare the owner address from there

Tony: This is the transaction that I got from TON, but actually I don't know how we can get the token name from it. I'm a new in TON

&rey: It isn't even a token transfer, actually. (reply to 47528)

Tony: Actually I got the transactions from API: /api/v3/transactions (reply to 47529)

Tony: It isn't, so how can we get token transfer ?

Tony: Thank you so much!

V: Hey everyone!  Could anyone please point me into the right direction where I can read how to retrieve list of jetons associated with wallet account at a specific block?

Long: hi everyone, with an in_msg, how can I decode the body to get which function is called:     in_msg: {     '@type': 'raw.message',     source: 'EQBV43Qj_jQAhOQvy9esZ7ij1Qbo7wF4ciPXDQ65fSu_ni_s',     destination: 'EQC-aJHV2JShPGoR0hDKRmsuxTEezH--mGLOjmKYAgrtTply',     value: '50000000',     fwd_fee: '1994682',     ihr_fee: '0',     created_lt: '20301141000002',     body_hash: 'lqKW0iTyhcZ77pPDD4owkVfw2qNdxbh+QQt4YwoJz8c=',     msg_data: {       '@type': 'msg.dataRaw',       body: 'te6cckEBAQEAAgAAAEysuc0=',       init_state: 'te6cckEBDAEAmAACATQBAgEU/wD0pBP0vPLICwMAEAAAIhsAAAAAAgFiBAUCAs4GBwIBbgoLAgEgCAkAGU+EL4QcjLH8sfye1UgAZxsIiDHAJFb4AHQ0wMwcbCRMODwAdMf0z8xAYIQfodk77qb0x8w+EIBoPhi8ALgMIQP8vCAAHTtRNDTHwH4YdMfAfhi0YAANtUc+AD8IMAANtj/+AD8IUMldB/g='     },     message: ''   }, Like this?

Long: any example in nodejs

Long: I want to make make a cell by       body: 'te6cckEBAQEAAgAAAEysuc0=', but can not find any example or library to do it

XuanXue: Is there any way to close validator-engine

💥Phong: I did the same as you. However, I don't know how to use code to request it to get the value (reply to 47487)

&rey: If you aren't elected, then I believe systemctl stop ... will do that. (reply to 47537)

XuanXue: systemctl stop validator

krau5: How to mint a jetton with FunC (deploy contract, etc.)? I know about 0-code solutions, but I want to try to do that from scratch.   By the way, has someone tried to use nft template in tact?

TON Bounty Bridge: ​Publications Support  🏷 Approved 🏷 Education  Summary:The publication support program is aimed at stimulating the creation and distribution of quality con...  Created by kuhel

A: I have one issue right now

A: Here, sender.address returns undefined

A: I should use sender.address, btw

&rey: await wallet.getSender (reply to 47547)

A: wallet.getSender seems not defined, what do you think of this ? (reply to 47549)

در انتهای صبر، طلا می نشیند.: Hey, It seems like there might be a mismatch between the versions of @tonconnect/sdk and @tonconnect/protocol. Ensure that you have the latest versions of both packages installed.   If the issue persists, I'd recommend opening a bug report in the issues section on our GitHub repository: https://github.com/ton-connect/sdk/issues.   This will help us investigate the problem more effectively.

Max | TonMap: Hey guys! How can i  use the purchase method of contract in my react app?  Ton-connect use.  I use this code in my contract project (with wrappers and blueprint)  export async function run(provider: NetworkProvider) {     const sellerAddress = '';     const seller = provider.open(Seller.createFromAddress(Address.parse(sellerAddress)));     const items = [1,2,3];     const itemCountBigInt = BigInt(items.length);     const totalPrice = toNano('0.04') * itemCountBigInt + toNano('0.05');     await seller.sendPurchase(provider.sender(), totalPrice, {         items,      }); }  But how  can i do it in other app with ton-connect?

Max: Hello! Could you please help me.  Currently the following code await connector.sendTransaction(...) hangs in most cases (not always) when ton-connect works with Ton Space wallet inside Telegram. And it is strange because the transaction goes to blockchain with success after the confimation in the wallet! Previously we didn't observe this issue. What can be the cause? Thank you.

Lucas W.: Hello

Lucas W.: I am integrating the TON network into our wallet project. Let me ask how to send TON and Jetton using React Native

Tim: https://github.com/ton-community/assets-sdk (reply to 47562)

&rey: + https://docs.ton.org/develop/dapps/ton-connect/overview (reply to 47562)

User<1691331052>: How to debug this kind of error message?

User<1691331052>: Cell underflow. Read from slice primitive tried to read more bits or references than there are. (forwarded from User<1691331052>)

&rey: You've misread, that ought to be other exit code... (reply to 47566)

User<1691331052>: Type check error. An argument to a primitive is of an incorrect value type. 1   How to debug in this kind of situation?

Lucas W.: Thanks !!! (reply to 47563)

&rey: Something has wrong type.

&rey: I even know what. You need to process given element first and move to next second, not in reverse order.

User<1691331052>: Hmmm, how?

User<1691331052>: Docs...

User<1691331052>: I dont need line below while loop?

User<1691331052>: Aha I see now, that line has to be on last line in while loop

William: using https://tonapi.io/v2/blockchain/transactions/{txhash} (reply to 47534)

Lucas W.: Hello. Someone help me. I want to send TON or Jetton with core, I want to send with nodejs or reactnative.

William: i think this function can help you. https://github.com/dedust-io/sdk/blob/main/src/contracts/dex/pool/Pool.ts#L43 (reply to 47473)

Lucas W.: i'm using: let responseSend = await  contract.send(transfer);  But get error LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state

Lucas W.: i understand this error. can you help me>

William: reffer https://github.com/alefmanvladimir/get-jetton-metadata/blob/main/main.ts (reply to 47525)

Lucas W.: i getted Jetton metadata.. Now, i want to send TON or Jetton by nodeJS or React Native (reply to 47582)

William: https://docs.ton.org/develop/dapps/cookbook#how-to-send-standard-ton-transfer-message https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/test-jetton.js#L128 (reply to 47583)

Valix: hi

Nxrix: is it possible to get trust wallet ton seed phrase?

Max | TonMap: Anyone know? :) (reply to 47554)

Lucas W.: Hi. I'm dev in nodejs. Once create new diffirent Mnemonic , but genaration same address. Why? Can anyone help me?

&rey: Wdym same address? (reply to 47589)

Lucas W.: return same address

Lucas W.: but mnemonics are diffrent

&rey: Do you have an example?

Lucas W.: this is example

Lucas W.: code here (reply to 47589)

Sumit: if i transfer a jetton to a completely new address (it never had this jetton before), a jetton wallet is deployed for that address? is that right?

Alex: hello guys, need help with 'ton-core'  and  '@ton-community/blueprint' in import { toNano } from 'ton-core';  import { Main } from '../wrappers/Main';  import { compile, NetworkProvider } from '@ton-community/blueprint';

Alex: what should i change it to ?

Alex: it gives me "Cannot find module 'ton-core' or its corresponding type declarations."

Alex: figured it out, should be @ton/core and @ton/blueprint

Клецка: did you installed all packages? (reply to 47604)

Клецка: also, you, better, should install some plugin for NodeJS/Typescript to have your imports automatically resolved (reply to 47604)

M: Hi  Why i can't withdraw toncoin to tonkeeper wallet? What's ghe problem?

M: The*

Клецка: What's the trouble, exactly? (reply to 47607)

Sumit: the wallet address that i calculate on the chain and the ones i calculate off the chain are different for some reason. can anyone help me debug this?

Alex: yeah ill do it, thx for the tip (reply to 47606)

Клецка: check for initial data. an address is calculated with initial data and code (reply to 47610)

TON Bounty Bridge: ​Navigating the Complexities: Unveiling the Risks of Composable NFTs vs. Standardized NFTs  🏷 Education  Summary:This article explores the unique risks associated with using composable NFTs (cNFTs) compared to sta...  Rewards: • 500 USD in TON  Created by seriybeliy11

Sumit: let init:StateInit = initOf WrappedJettonWallet(myAddress(), token.address);         let wallet: Address = contractAddress(init);         send(SendParameters {             to: wallet,             body: JettonTransfer {                 amount: amount,                 destination: to,                 response_destination: context().sender,                 custom_payload: null,                 forward_ton_amount: 0,                 forward_payload: beginCell().asSlice(),                 query_id: 0             }.toCell(),             code: init.code,             data: init.data,             value: ton("0.5"),             bounce: true         });  i am trying to calculate the address of JettonWallet for my contract address (reply to 47612)

Sumit: and this calculation seems to be off for the same arguments on chain and off chain

Mark: #JobVacancy Lead Software Engineer  tl;dr -  Lead SWE, 5+ years of experience, en, ru, remote, agile work hours, 5000$  Gemz Trade - #1 Trading App on TON is looking for Lead SWE  What we are looking for: 🔸 5+ years of experience. 1+ year with FunC 🔸 Full Stack(TS, Go, Python, FunC) 🔸 Good Communication Skill  🔸 English B1+ 🔸 Ability to work alone and in a team  What you get: ❤️5000$ (2000$ + 3000$ in $GEMZ token allocation) ❤️Agile Work Hours ❤️Remote Work ❤️Great team and a ton of opportunity to grow  Dm in telegram https://t.me/marktraid with your CV

Жоуд: Why am I getting this error when I do status on mytonctrl

Tiago: Hi guys any way to get enough testnet tokens to activate a validator on testnet? Without hitting the faucet for 5 ton multiple times?

TON Bounty Bridge: ​Article: How to create your memecoin on TON  🏷 Education  Summary:Write an article how to create your memecoin on TON Blockchain  Created by krau5

0xJayT: Hello guys, I have a question about the transaction fee. How we can set the transaction fee like this: 1. Transfer X token to Y wallet 2. Transfer X tax (token) to X wallet

— 2024-03-29 —

TON Bounty Bridge: ​Developer Grants Program  🏷 Developer Tool  Summary:The proposed Developer Grants Program aims to incentivize developers to create innovative applicatio...  Created by hebosho911

Long: I already can get the transaction data What I want to do next is how to decode the in_msg body to get values? (reply to 47577)

Long: Is there any sample code show how to parse this?

William: Body has been parsed from this endpoint. Did you try to get info from this? (reply to 47624)

Long: "in_msg":{      "msg_type":"int_msg",     "created_lt":20301164000002,     "ihr_disabled":true,     "bounce":true,     "bounced":false,     "value":50000000,     "fwd_fee":666672,     "ihr_fee":0,     "destination":{         "address":"0:be6891d5d894a13c6a11d210ca466b2ec5311ecc7fbe9862ce8e6298020aed4e",         "is_scam":false,         "is_wallet":false     },     "source":{         "address":"0:55e37423fe340084e42fcbd7ac67b8a3d506e8ef01787223d70d0eb97d2bbf9e",         "is_scam":false,         "is_wallet":true     },     "import_fee":0,     "created_at":1711620511,     "op_code":"0x7e8764ef",     "raw_body":"b5ee9c720101010100120000207e8764ef000000000000000000000001"  },  I only got the op_code and raw_body, how can I parse the action params?

William: So try this endpoint: https://tonapi.io/v2/events/13e44b4abfd96623bb040b9947b7d456f854022ec57a1a2c7a69f25b9d1f19a0 (reply to 47627)

Long: thank you, but what about event that custom for a new contract, not like these transfer that widely used and already known

Long: like my contract want to emit an event BuyPackage(itemId)

Long: is there a way to emit this event

Long: I only see in_msg and out_msg, which is function call on the contract

User<1691331052>: What method to use if I loop through dictonary with ref? get next doesnt return cell

LeeMinThien: Anyone know TON testnet Supply?

&rey: You may count it yourself! I've explained the process in Russian: https://t.me/tondev/171887; just use testnet explorer. (reply to 47635)

Valix: Uncaught ReferenceError: Buffer is not defined     at node_modules/ton-core/dist/boc/BitString.js (chunk-TTJAH3NT.js?v=ac92962e:557:37)     at __require2 (chunk-GFT2G5UO.js?v=ac92962e:18:50)     at node_modules/ton-core/dist/boc/BitBuilder.js (chunk-TTJAH3NT.js?v=ac92962e:569:23)     at __require2 (chunk-GFT2G5UO.js?v=ac92962e:18:50)     at node_modules/ton-core/dist/boc/Builder.js (chunk-TTJAH3NT.js?v=ac92962e:15109:24)     at __require2 (chunk-GFT2G5UO.js?v=ac92962e:18:50)     at node_modules/ton-core/dist/address/contractAddress.js (chunk-TTJAH3NT.js?v=ac92962e:15654:21)     at __require2 (chunk-GFT2G5UO.js?v=ac92962e:18:50)     at node_modules/ton-core/dist/index.js (chunk-TTJAH3NT.js?v=ac92962e:18457:29)     at __require2 (chunk-GFT2G5UO.js?v=ac92962e:18:50)  i encounter this error in browser console log when running front end of my contract. how can i fix it?

Lucas W.: Hello. Can you help me. I cannot create new wallet on expo react-native

Void;: again guys, any package that make me login with my 20 pharses?

Henry: I have tried with ton onboarding tutorial and see the error

Henry: everyone has the same or pls give me a hand

&rey: from "@ton/ton" (reply to 47644)

Henry: {   "name": "ton-onboarding-challenge",   "version": "1.0.0",   "main": "index.ts",   "scripts": {     "start": "ts-node index.ts"   },   "license": "MIT",   "dependencies": {     "@orbs-network/ton-access": "^2.3.3",     "@ton-community/func-js": "^0.1.5",     "bn.js": "^5.2.1",     "qrcode-terminal": "^0.12.0",     "ton": "^6.13.1",     "ton-contract-executor": "^0.8.4",     "typescript": "^4.8.4"   },   "devDependencies": {     "@types/bn.js": "^5.1.1",     "@types/jest": "^29.1.2",     "@types/node": "^18.8.4",     "jest": "^29.1.2",     "ts-jest": "^29.0.3",     "ts-node": "^10.9.1"   } }

Henry: currently I am using ton not @ton (reply to 47646)

Henry: https://docs.ton.org/develop/get-started-with-ton

&rey: It's outdated and may be taken over with some scam in future. Please stay up-to-date and safe. (reply to 47648)

Henry: where can i find the updated document? (reply to 47650)

LeeMinThien: ~~5B? (reply to 47638)

spanish-or-vanish: Hi everyone i have issues using the tonweb lib.  im creating a jettonwallet for a jetton on testnet, use a valid api key and use the testnet toncenter jsonRPC and once i want to call .getData() i get the following error: Error: http provider parse response error  result: {     '@type': 'smc.runResult',     gas_used: 0,     stack: [ [Array] ],     exit_code: -13,     '@extra': '1711647832.0476854:2:0.8666809185643223'   }

Sumit: bumping this again (reply to 47614)

Xander: Hello everyone, I would like to ask how I can send a message when deploying the contract in FunC. For example, when deploying the jetton master, I premint a certain number of jettons to the owner.

&rey: https://t.me/tactlang/15201 (reply to 47655)

&rey: You may store a variable "was_init?". (reply to 47656)

Tony: Hi experts, how can we get the Market cap ?

LeeMinThien: How to parse a cell to readable data?

Max: up (reply to 47558)

Max | TonMap: Hey guys! How can I enable the testnet in @wallet?

Haq: Good morning guys 😌  I’m starting to work with TON Connect and integrate it in my react app and I was wondering if any of you faced a error like:  ‘EventSource's response has a MIME type ("text/html") that is not "text/event-stream". Aborting the connection.’  I’m wondering if that can be connected with wrong “manifest” file?   Thanks for any help 😌

Xander: So I need to send another message to the new contract, then it will send a message back? Or I can deploy contract and get permint in just one message? (reply to 47658)

Андрей: no way (reply to 47663)

Rhoda: Hello please help me out. What do I enter as comment while withdrawing TON from OKX please. Comment --------------

&rey: The variable will be in your contract storage, an implementation detail. (reply to 47665)

&rey: If you send to non-custodial wallet, any message you want. (reply to 47667)

&rey: Do you also have message scheme for that cell? (reply to 47661)

&rey: I'm long interested why so many people are interested in prices/market caps. Are you building an explorer? (reply to 47659)

Xander: May I dm you later? (reply to 47668)

Tony: Hi expect, yeah I'm building the explorer for my team. (reply to 47671)

Rhoda: Trying to top up my Telegram TON wallet (reply to 47669)

&rey: It has separate wallets for each user, IIRC? (reply to 47674)

&rey: If so, you may enter arbitrary comment.

LeeMinThien: Message scheme mean what I stored in that cell? (reply to 47670)

Cherry Partner: Hi everyone, who should i connect to join TON Ecosystem?

Rhoda: Have you gotten my question like this Sir, please what to comment? (reply to 47675)

Rhoda: Even though you no longer respond I have tried the withdrawal without comment with little funds and it was credited, it works. Thank you (reply to 47674)

&rey: To join in what regard? (reply to 47680)

LeeMinThien: Now, I create a new cell with the same data and compare two cell. Is this a way? (reply to 47677)

&rey: That's not parsing but validating, isn't it? (reply to 47686)

User<1691331052>: What method to use if I loop through dictonary with ref? udict_get_next doesnt return int cell int

&rey: slice player_ref cell player = player_ref.preload_ref() (reply to 47689)

&rey: Or, better, define asm operation.

LeeMinThien: Yes I want to verify data. But i don't know how to parse cell or boc data so I create a same one and compare them. (reply to 47688)

&rey: .beginParse().load... (reply to 47692)

User<1691331052>: on what line should I do it? (reply to 47690)

LeeMinThien: I tried this but nothing happen maybe my lib have an error. (reply to 47693)

&rey: What lib? Not TonWeb, I hope? (reply to 47696)

Cherry Partner: We would like to join as a part of TON ECOSYSTEM (reply to 47685)

LeeMinThien: @ton/core npm (reply to 47697)

&rey: Does it throw an error? (reply to 47699)

&rey: That's pretty undefined term, isn't it? (reply to 47698)

TON Bounty Bridge: ​Support NFT for Telegram Profile Photo  🏷 Developer Tool  Summary:Creating and enabling users to utilize their profile pictures on Telegram as NFTs could potentially ...  Rewards: • 1000 USD in TON  Created by chauanhtuan185

&rey: The same as "we're committed to transparency, users' data safety, etc" in some companies: defines the general direction but not even extent of the measures. (reply to 47701)

LeeMinThien: Not thing, just log origin cell (reply to 47700)

TON Bounty Bridge: ​Bounty: Transcribe and Analyze the Podcast Episode  🏷 Education  Summary:The task is to create an article presenting a transcription and analysis of an episode of the podcas...  Rewards: • 250 USD in TON  Created by begovatovd

TON Bounty Bridge: ​An article on "Is Telegram the new WeChat?"  🏷 Education  Summary:Telegram is partially adopting functionality from WeChat, improving it in every way. Users will be a...  Created by dacrimes

&rey: Why is that an issue? (reply to 47713)

M: Hi  Now how can i transfer toncoin to tonkeeper?

&rey: By address. (reply to 47716)

M: I already have many toncoin and i want to transfer to tonkeeper

M: Because network is suspand

Dung: Could anyone help me how can I interact with mint function of smart contract via client using python or typescript?

TON Bounty Bridge: ​Update TVM Instruction in the TON Documentation.  🏷 Approved 🏷 Education  Summary:Update the TVM Instruction documentation including internal search functionality and distribution of...  Rewards: • SBT Bounty Reward • 100 USD in TON  Assignees: krau5 Created by reveloper

Max: Hello! I'm looking for a frontend developer with experience in inserting data into a transaction payload cell for a small task.

Ihor: Hi Folks, is there a way to determine what is in public key prefix without parsing it with TL-B?

Paul: Hey, Im writing smartcontract staking on Ton, user deposit Ton to my contratct and receipt my token. I want to save a stake infomation of user (amount, time,…). So how can I implement this and How can i save stake infomation of user. Please, help me.

Андрей: by pytoniq await wallet.raw_transfer([wallet.create_wallet_internal_message(address, 0, gas_for_deploy, state_init=StateInit(code=code, data=data), body=body)]) (reply to 47722)

Zaitsev [will never DM you first]: is it possible to dyanmically adjust the status from nonexist to active or any other which accepts transfers using WalletV4ContractR2

Kushagra: I am trying to do jetton token transfer in node.js, the transaction executed, but is there a way to check if the transaction was succesfull or not.  const internalMessage = internal({     to: jettonWalletAddress,     value: toNano('0.05'),     bounce: true,     body: messageBody });  const seqno = await walletContract.getSeqno();  const transaction = await walletContract.sendTransfer({     secretKey: key.secretKey,     seqno: seqno,     messages: [         internalMessage     ], });

&rey: No way except fetching said transactions and checking their results. (reply to 47730)

Kushagra: Any other function/library that I can use to get transactionHash in the response of jetton transfer?

&rey: tonconsole.com allows to fetch "traces"; please check out those. (reply to 47732)

Kushagra: Okay @pcrafter thanks! Any thoughts or help for parsing transactionHash form the boc object?

💥Phong: Hello, I just found ở error of tonscan.org

💥Phong: transation 13 minutes

💥Phong: but https://tonscan.org/tx/2-_RMbRrAGlK4nxLGuy3pcR5liNTecSd6nH-uUrjHKQ=

💥Phong: it's show 6 days ago

User<6419778319>: @tsivarev Kindly check your DM. ty

Ibrahim: Hi devs, is it possible to use ston.fi to swap tokens from a third party smart contract?

Vahid: Hi Yes it's possible (reply to 47741)

Deepam: https://github.com/dfinity/examples/tree/master/motoko/icp_transfer

&rey: I'm announcing a new beta wallet contract for TON: inplug-v2! It has traits of existing wallets and additional functionality: — can send money, as any wallet since v1 — allows to send many (255) messages in one transaction, as preprocessed — has plugins system, as v4r2 — plugins are separated into trusted and untrusted (with limited invocation frequency, amounts to send and opcodes — to stop unwanted NFT/jetton transfers) — allows to invoke code onchain  A potential use for onchain code invocation is frontrunning; you may randomly send an outgoing message with higher probability towards start of the block, and on average it will end up earlier than others.  Repository link (to file with tests): https://github.com/ProgramCrafter/wallet-contract/blob/main/test-wallet-inplug-v2.ts Issues, test extensions and discussions are welcome! Also, do you think there is a bug somewhere in implementation?

Ibrahim: Do you know any guideline I can follow? (reply to 47742)

AaaW: When create transaction, i have a boc. How i can check transaction detail by boc ?

Vahid: https://docs.ton.org/develop/func/stdlib#send_raw_message  https://docs.ton.org/develop/smart-contracts/messages (reply to 47746)

Tony: I have same question?please help me? (reply to 47747)

Mohammad: Vscode only because the plugin on jetbrains doesn't support code completion for tact (reply to 47750)

Sergey: bad for mac with silicon (m1, m2) (reply to 47751)

Sergei: what u mean? Like vscode is bad for macs? (reply to 47752)

Я̨kov: Can somebody pin it for a short while? It would be nice to see what people are working with, aside from obvious winners :) (reply to 47750)

Sergey: it works through with rosetta 2. There are problems when compiling (sometimes).  i use intellij, but there is no autocomplete tact support (reply to 47753)

Sergei: looks like it's good now

Sergey: I have seen that. But my computer is heating up like a stove. (reply to 47756)

Sergei: interesting using air m2 with vscode and it's fine with heating (reply to 47757)

Tony: Some body can help me. (reply to 47749)

Ibrahim: Thank you (reply to 47748)

Ibrahim: Is it possible to call the get func of a child contract in tact? (reply to 47748)

Ibrahim: Or what options are available for example reading child contract state

Andrey: I noticed sending USDT between telegram users is not available now, right? Only TON allows to select a telegram contact, but not other currencies. Was this reverted back? I remember it was announced that not only Ton but also usdt would be available to send between telegram users.

User<6703584027>: Hello

Tawfik: How can i get jetton name from here ? (reply to 47577)

Raden0x: i keep getting this error when trying to deploy contract:   Error: no healthy nodes for v4-testnet

Buggy: Does anyone need 100 $TON testnet here ?

Xela: how to lower memory usage of ton node lite server?

— 2024-03-30 —

Alex: guys i need help, it gives me error in createFromConfig({ //here} , contract returns sender and reciever addresses and checks if any of addresses belongs to owner, and  if true, it wont return it . Code and error below:                                                                                     import { toNano } from '@ton/core';  import { Proxy } from '../wrappers/Proxy';  import { compile, NetworkProvider } from '@ton/blueprint';    export async function run(provider: NetworkProvider) {      const proxy = provider.open(Proxy.createFromConfig({}, await compile('Proxy')));        await proxy.sendDeploy(provider.sender(), toNano('0.05'));        await provider.waitForDeploy(proxy.address);        // run methods on proxy  }

Alex: its a script btw

🐾D3ra.: please can i get a solution to this error code in the terminal

User<5487356724>: What is the solution?

💥Phong: await scaleWallet.sendTransfer(sender, toNano("0.3"), {         amount: amountIn,         destination: scaleVault.address,         responseAddress: sender.address, // return gas to user         forwardAmount: toNano("0.25"),         forwardPayload: VaultJetton.createSwapPayload({           poolAddress: pool.address,         }),       }); amountIn is the amount of TON I want to swap. 0.25 TON is the fee that users must pay when trading. toNano("0.3") then I see it as value: But don't know what it is and what it means. And will the user lose this 0.3?

💥Phong: I use  tonClient.getTransactions(myAddress, {     limit: 5,   }); To get the transition after swapping from TON => LAC. I want to get the price I swapped and get the amount of LAC tokens I received after the swap, how do I do that?

Rose Ann: I see (reply to 47781)

💥Phong: I need everyone to rate me. Is this a reputable man? Or a scammer. Thank you.

eax: just don't send any money first (reply to 47787)

💥Phong: Thank you. I will not deposit money in advance. Because I saw he sent me a completely new wallet. And I think it is necessary to have results before sending money. (reply to 47789)

Lord.: is there any who wants to work on a yield farm bot on TON with me

Rahul: I can (reply to 47792)

Lord.: i am a developer, we would be working together

💥Phong: Can you help me with 2 functions: 1. Function used to swap from TON to TOKEN. The returned result is txhash. Number of tokens received, Price that I swapped successfully. 2. Function used to swap in the opposite direction from TOKEN to TON. The returned result is txhash. The amount of TON received, the price I swapped successfully.  I can do both of those functions. However, I cannot get the price when swapping and the number of tokens received when swapping. (reply to 47794)

0xCathyue: Anyone know the meaning of contract type dedust_vault ?

0xCathyue: https://tonviewer.com/EQCklyfK3XqZgcceV2jfwuSitrsn3Lv0UQhB3PNnMrXpjWHe

MissXDark: Добрый день.  При выполнения задания возникла проблема как исправить? На самом простом               npx ts-node step9.ts  wallet is not deployed

&rey: Russian chat: @tondev (reply to 47802)

Ferrari: Hello everyone. Can anyone hepl me? How get Jetton Data by TonWeb?

Heydar: Hello guys, Im beginner (just I have very low knowledge in tact) ,what's best refrence to learn FunC as fast(and considering important things)? and also do we have func group? thanks for guiding me

Kenny$$Shillz: const datastring= Buffer.from(tx.result[index].in_msgs.msg_data.body, "base64"); let cellData= Tonweb.boc.Cell(dataStringBuffer).beginParse() cellData.load.... (reply to 47536)

Long: Thanks, this is what I needed👍 (reply to 47807)

NICK: Does anyone has info how to participate soon to provide storage for TON storage?

Ealr: Hi can i tak with any administrator please?

Lex: Hi! How to get actual bitcoin price in tact contract? Want send ton if price more than bet

Sergey: You cannot make network requests from a contract. Perhaps you need to update such a rate in the contract yourself (on a schedule) (reply to 47811)

Jimmy Becen: Hi guys, Can I get properties of children contract from parent contract

JalolMurad: How can I create my own crypto token on the TON blockchain and store and sell it in wallets similar to TonKeeper? And the issue of listing it on exchanges such as MEXC, Bitget, BingX. Is there a separate community to discuss this topic?

Father Pepe Of: Hey all, looking to add to TON to my platform,  any tips how to add it? Ie the network info

Nxrix: how to get price of any ton token by it's address

&rey: No. Blockchain acknowledges no such hierarchy, in particular, it is a higher-level concept. (reply to 47813)

Crypto A99: It’s possible to do erc712 at tvm?   Signature Verification. 1, admin wallet will sign a signature with the same payload 2, user use the signature to send the msg  3, contract will check the signature is signed by admin, and execute the function

Crypto A99: Cause i want to do a staking contract, because there have some conditions, I  need to use backend to control.   Like if your nft is dead. You can’t withdraw  So my flow is: 1, user send withdraw request to backend  2, backend return signature  3, user use the signature to withdraw   🙏🏻

Жоуд: Hello guys after the holding my money did not come back to my wallet can someone please help me

Жоуд: I am using mytonctrl for validation

Nxrix: can someone tell me what are the possible letters to appear in the end of wallet? EQCY4M6TZYnOMnGBQlqi_nyeaIB1LeBFfGgP4uXQ1VWhales I found this wallet that is so cool to me 😆

Жоуд: My wallet was empty (reply to 47823)

Жоуд: How can  get the tons from the validator

F: @ton_help_bot (reply to 47824)

Paul | AssetScooper: Where is the TON developer's resources link for those looking to learn tact or func?

Жоуд: If I did not get my ton after the holding phase because my wallet has less than 1TON does it mean that I need to wait until the next holding cycle to end so I can get my tons from the validation back? Its a serious matter please (reply to 47829)

&rey: Yes. Please see check_signature and don't get too obsessed with standards in the process. (reply to 47821)

Никита: Who knows what the problem is? Do you remember there was a task for 3 million coins, I completed it, but I was not given 3 million coins, although the task is indicated as completed?

Андрей: It’s better to ask where you were given such a task. This was not the case here (reply to 47833)

Я̨kov: Tact: https://tact-lang.org FunC: https://docs.ton.org/develop/func/overview (reply to 47830)

Paul | AssetScooper: Thank you. (reply to 47835)

南方: I want to use the ts library @ton/ton to write a jetton token transfer code, but I don’t know how. Can anyone help me? Thanks

Жоуд: If anyone would to ever encounter this issue just know that your validator wallet must contain an amount above 20TONs for assurance as the elector wallet give your 1TON and takes it back after the validation is done (reply to 47831)

Bear: does TonViewer has testNet API?   I want to find the external message log .... @Gusarich

Ruslan: toncenter.com/api/v3/messages с destination=null (reply to 47841)

۵۶۷۳۳: Hay

Tony: Hi all, how can we get the information from account with contract type is wallet_v4r2 ?

Tony: It seems we don't have any information about

Tony: TON API is focusing in Jetton.

Denis: what type of information do you need?

Denis: "TONAPI focusing on Jettons" it's very funny :)

Tony: Actually I tried to get the information same as requesting with Jetton address:

Tony: {"mintable":true,"total_supply":"0","metadata":{"address":"0:0bb5a9f69043eebdda5ad2e946eb953242bd8f603fe795d90698ceec6bfc60a0","name":"WTON","symbol":"SCAM","decimals":"9","image":"https://cache.tonapi.io/imgproxy/nsV7NfixDG5-FwLjdUQvyvllz_D8nS4j70CoLj4iJSA/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdC50b25veC5vcmcvd3Rvbi5wbmc.webp","description":"Wrapped TON"},"verification":"blacklist","holders_count":0}

Tony: But I can't find any API to get these information with address has contact type is wallet_v4r2

Tony: But in real we have many account in wallet_v4r2

Tony: So any mistakes in my side 🥺

Sofia: Hi does anyone know any solutions to easily send coins to multiple wallets at once on ton?

Denis: But wallet contract doesn't have metadata or any information like Jetton. (reply to 47852)

Ruslan: You can get list of jetton wallets by an address of the owner wallet here: /api/v3/jetton/wallets with owner_address = <address of you TON wallet> (reply to 47852)

Ruslan: Example: https://toncenter.com/api/v3/jetton/wallets?owner_address=UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI

Ruslan: toncenter.com/api/v3/transactions with parameter account and limit+offset. It will skip offset last transactions and give you limit transactions of an account. You should implement pagination to read whole history (reply to 47861)

Ruslan: For this purpose you can setup your own /api/v3 (github.com/toncenter/ton-indexer) and collect data from PostgreSQL.

Ruslan: Or just download PostgreSQL dump here: https://index-dump.toncenter.com

Ruslan: In this case, new transactions will not appear in the database.

User<5972983507>: Are there any programmers here who need investments of up to $2000 at the start, our team is ready to consider your proposals, write in private messages. We are looking for talents for the more global development of our project on the TON blockchain.

ed: send a message to the child which would reply with its state (reply to 47764)

Tony: Thanks Ruslan. I found the solution to fix my problems. It saves my times (reply to 47860)

Andy: IntelliJ's TON development plugin is great and I generally prefer IntelliJ over VSCode, but VSCode has builtin JS/TS support which makes it easier to use Blueprint, so I use VSCode now when interacting with TON I'll happily switch to Neovim once the language servers for FunC and Tact come out though, as that's my primary editor (reply to 47750)

User<1384034483>: Hello admin  I have lost my key phrase of beta ton space i have two nft there please help

User<1384034483>: Please help 😭 (reply to 47872)

Клецка: there is no way of restoring seed phrase. it is unique for every wallet, and there is no any CA who owns them (reply to 47872)

User<1384034483>: How to recover from email

Andrey: Ultimate Intellij and WebStorm has TS/JS support and also integration with blueprint (native support in plugin) (reply to 47871)

Heydar: rate of what? what's the base? 🙏🏽 (reply to 47812)

Heydar: I never could have easy instructions to init func projects in fresh Debian OSs :/

Vladislav: Good day everyone, friends. please tell me, when I place a position on farming in Ston.fi, does my pool position on the providing still work, or do they function exclusively separately?

Vladislav: I will be very grateful for the advice🙏🏻

— 2024-03-31 —

Heydar: how I can be sure about that? (reply to 47605)

p_h_i_l 🆓: You probably have to uninstall (just delete the app from applications folder) your old VS Code version and reinstall the one with native Apple Silicon support.   After doing that try right-clicking the installed Visual Studio Code.app in your /Applications folder andy make sure that application type is universal and that the check box in front of open with rosetta is unchecked. (reply to 47757)

Emelife: declarations

Jimmy Becen: Hi guys How long will it take for a contract with balance = 0 to be inactive?

Sonny: pls , How can I write a smart contract for staking tokens? How will the contract work? Is it similar to evm in that the contract will hold tokens?

TON Bounty Bridge: ​Anti-fraud system for TON ecosystem  🏷 Developer Tool  Summary:Creating an effective anti-fraud system for theTONcoin (TON)ecosystem involves a multifaceted approa...  Created by Niknafsali

&rey: Yes. Your contract cannot transfer tokens it does not own. (reply to 47893)

&rey: Until its balance reaches -1 TON. (reply to 47892)

&rey: Meanwhile, when it reaches -0.1 TON, contract will be replaced with hash, and afterwards it is too hard to spend all the remaining TON on storage fees.

Sonny: how to build contract staking token on TON

Pedro Costa |: First create the token and then the staking contract and its interface (reply to 47903)

Sonny: Yes , i created token jetton , Is the flow of operations of a contract on ton similar to evm? The contract will hold the tokens of the staking user ???

Pedro Costa |: Ton is not an EVM network, its TON Virtual Machine (TVM) and its programing language is FunC. Meaning you need to create the smart contract in a completly different way. And yes, the staking contract will hold the staked tokens (the tokens you just created) (reply to 47905)

Pedro Costa |: You can check some of the tools here (reply to 47750)

Sonny: Sorry to ask, I read the docs, I really don't understand what Sending Messages in TVL TON is for.

&rey: The only way for contracts to interact in TON is to send messages (some amount of TON + payload) to each other. (reply to 47908)

Bear: do we have test net (https://docs.tonconsole.com/tonapi/api-v2)? (reply to 47858)

Anton: There is also Tact in addition to FunC: https://tact-lang.org (reply to 47906)

Denis: yes. Just replace tonapi.io with testnet.tonapi.io (reply to 47910)

Bear: what is this even mean?  Constructor of class 'Dictionary<K, V>' is private and only accessible within the class declaration.ts(2673)

Andrey: I recommend to read this article:  https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers (reply to 47905)

&rey: Dictionary<number, bigint>.create() (reply to 47913)

Bear: eeqweqweqwklejkl;we;jrl;kwrej;jklw2erj;r

Bear: 😵‍💫😵‍💫😵‍💫 (reply to 47915)

&rey: Or .empty(), or something like that, I don't remember precisely.

XuanXue: Hello, there， are there any way to limit validator-engine resources usage.

Bear: found;   const user_list: Dictionary<bigint, bigint> = Dictionary.empty();

stenolog: no link? (reply to 47899)

Клецка: you can just try to reinstall them (reply to 47887)

Heydar: thanks , it's solved,  I have new problem! (reply to 47922)

Heydar: scripts/deployCounter.ts:6:35 - error TS2345: Argument of type 'Counter' is not assignable to parameter of type 'Contract'.   Types of property 'init' are incompatible.     Type '{ code: Cell; data: Cell; } | undefined' is not assignable to type 'Maybe<StateInit>'.       Type '{ code: Cell; data: Cell; }' is not assignable to type 'Maybe<StateInit>'.         The types of 'code.bits' are incompatible between these types.           Type 'import("/home/sc/tmp/func_1/my-counter/node_modules/ton-core/dist/boc/BitString").BitString' is not assignable to type 'import("/home/sc/tmp/func_1/my-counter/node_modules/@ton/core/dist/boc/BitString").BitString'.             Types have separate declarations of a private property '_offset'.  6     const counter = provider.open(Counter.createFromConfig({}, await compile('Counter'))); (reply to 47923)

&rey: You have two different libraries installed, ton-core and @ton/core. Remove the first. (reply to 47925)

Heydar: thanks for hint but when I delete it , it has another errors: wrappers/Counter.ts:10:8 - error TS2307: Cannot find module 'ton-core' or its corresponding type declarations.  10 } from 'ton-core'; (reply to 47926)

&rey: Update wrapper, then, to import from @ton/core. (reply to 47927)

Heydar: Sooooooooooooooo many thanks ❤️ (reply to 47928)

Heydar: for this modules, shall i install them or change the code?  import { compile, NetworkProvider } from '@ton-community/blueprint';  because I have same error for them too. I want to know which modules are better to track  and what's the difference between '@' or '' (reply to 47928)

&rey: @ton/blueprint is the up-to-date version. It started with migration from "ton-community" Github user to "ton-org". (reply to 47930)

Hạo: I'm doing this example https://github.com/howardpen9/staking-in-tact , but when I read the contract, I will encounter this problem

Samyar: global int storage::merkle_root;  what t does storage:: do?  i couldn't find it in the documentation in ton.org

&rey: Part of identifier. (reply to 47933)

Navajjoo: Hello everyone, I have a question/request regarding assistance. I'm trying to create a project for an NFT collection on TON in the testnet. Previously, I've worked on Cronos using Visual Studio Code. I'm having some trouble with TON, feeling a bit lost. I'm currently taking a course on TON by Oleganza, but honestly, it's still quite challenging for me. Would anyone be willing to help on a volunteer basis with writing some basic code? I would be very grateful. Feel free to message me privately at any time. Thank you!

Heydar: Thanks for the guides. (reply to 47931)

Kenny$$Shillz: U need the pool contract (reply to 47818)

Nxrix: I have the address (reply to 47937)

Kenny$$Shillz: So use the pools get method to get the price (reply to 47938)

Kenny$$Shillz: Use highload wallet (reply to 47856)

dropout.io: How much cap actually needed to initiate a project in Ton? (reply to 47868)

User<5972983507>: 1ton 😁👍 (reply to 47941)

dropout.io: wow that's surprisingly cheap. (reply to 47942)

Sonny: Sorry for the stupid question, what is the purpose of TON Add Message?

Hung: Does anybody know how to customize the jetton that every wallet can mint(not only admin)?

Dmitry | backend4you.ton: Remove check for admin ? :) (reply to 47945)

Hung: can you give me some suggestion how to do that? (reply to 47946)

Dmitry | backend4you.ton: Have you found “standard” Jetton code?

Dmitry | backend4you.ton: Remove line 60 https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc#L60

Hung: the problem here is that i deploy my jetton from minter.ton.org

Hung: do i have to deploy my jetton through my own code?

Kent: Hello, how can I contact with TON foundation? Our devs are in Vietnam

Amir: hi  i generate the new wallet v3r2 and deposit 0.6 ton to the wallet  after that some transactions happen to the wallet like this and consumed the wallet amounts  is this possible ?!

🦍: Required:Smart Contract Engineers,Web Designers,DApp engineers. For work conditions and for an interview, write in private messages.

User<6864657803>: anyone know where to list projects for open leauge

User<6864657803>: Proper struiggling to find any clear nformation

Sergey: hot to parse cell with @ton/ton library in js?

Клецка: hi! is there any dex which allows to swap jUSDT on TON to USDT on eth?

Bored: Hey guys I am exploring building mini dapps on Ton, do I need to learn Tact, or I will be albe to just use React and Solidity?

Клецка: if you're going to write a smart contract - you need to learn tact, because this is the only way to create smart contract on TON (reply to 47962)

Bored: I was planning to do chatgpt :D (reply to 47963)

Bored: I am more like designer than a developer, I do have  skillset of development tho.

Клецка: it won't really help (reply to 47964)

Клецка: it can help only if you know what you're doing (reply to 47966)

Bored: I did some smart contracts on solidity/react already tho, so I guess it will be simmilar here just slight change in syntax maybe? (reply to 47967)

Maksim: where can i find WTON address? (reply to 31611)

Клецка: the main issue is performance per gas (reply to 47968)

Bored: expensive? (reply to 47970)

Клецка: yes. FunC is much more efficient (reply to 47971)

&rey: Could you elaborate what you mean? (reply to 47944)

Клецка: but, it is not too hard: see guide on nujan.io (reply to 47971)

&rey: 0 real TON, if you're working in sandbox or testnet. (reply to 47941)

&rey: And you don't need to get in touch with TON Foundation in almost all cases! @kent_tek this also concerns you.

V: Hey all! My team an  I are runnijg into some issues with jetton. Does anyone know how we could determine what jetton is in a transaction in each block?

Aydin: No, I'm afraid. Because, TON is an entirely different blockchain with completely new fundamental concepts. It is not another copy of Ethereum, but a novel one. Please visit the following link for more information:  https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers (reply to 47968)

dropout.io: I lost $50 because of this wallet not working

dropout.io: damn

マムル: Hello friends. I was trying to deploy a very simple smart contract on ton testnet following the video on YouTube. And everything was going just fine, including tests, until it came to an actual deployment. The guy on YouTube had no issues and successfully deployed the contract but I have encountered an issue - AxiosError: timeout of 5000ms exceeded.  I cannot wrap my head around this problem rn, because of my current knowledge level. And would really appreciate, if you guys point me out to the right direction!

User<1691331052>: You can't do nothing about it. Do deployment couple of times and one of them will work...

User<1691331052>: Why is this showing up? Using getHttpV4Endpoint

マムル: Does it mean I just chose bad timing for deployment? (reply to 47986)

Nxrix: server problems  there are different things causing it from high load and ... (reply to 47987)

User<1691331052>: I'm seeing them 3 days in a row.. Any plans to fix it?

Raden0x: dealing with that same error (reply to 47993)

Tawfik: What is the difference between a bouncable and unbouncable wallet address will the transfers to it have any change?

Nxrix: Nope I also had the same problem a few months ago when I was using it (reply to 47993)

マムル: As far as I know it bounceable addresses return ton… (reply to 47995)

Клецка: are you sure about "address", not "transaction"? (reply to 47995)

NodeGo.Ai: Where can I create a liquidity pool to trade my token?

NodeGo.Ai: Can someone help me

Tawfik: Yup (reply to 47999)

Клецка: it is a first time i see smth like that (reply to 48002)

Клецка: i'm interested too, now)

Клецка: SOOOOO (reply to 48002)

Клецка: i think, i got an answer

Tawfik: What is it (reply to 48006)

Клецка: bounceable address - is when you're not sure, that smart contract exists on that address. if there is no smart contract - you will get your ton back

Клецка: https://docs.ton.org/develop/howto/step-by-step (reply to 48009)

User<6461782270>: We're launching a newly backed TON memecoin – with zero premine and the tokens being fully distributed via an airdrop; lmk what you think about this concept @xicoinbot

Tawfik: I think it won't make a difference for normal wallet address (reply to 48009)

Клецка: seems so (reply to 48012)

Ian: would you like a wizard for people to do no code deployments? I am working on this for another chain right now and I think TON has better tech

STXI: GA, team. Can u help me and give me answers? I'm newbie in ton  blockchain development 1. What language and libraries for interaction with ton blockchain are you using? 2. Which IDE you prefer and plugins for ton development?  3. FunC or Tact? Can I start from Tact and dont meet unsolving problems?

Клецка: Sandbox and nujan.io for development. I'm using VIM, but, if you're not experienced in one - better use VSCode there are plugins for development in FunC If you just want to entertain yourself - write in Tact, if you want to write contract with normal performance - use FunC (reply to 48015)

STXI: Is the tact not optimized or is it at the language construction level of the problem? (reply to 48016)

Клецка: it is high level language. it is good, but, sometimes, not really efficient (reply to 48017)

STXI: Wrapped func?

— 2024-04-01 —

Bear: hi all, get this issued for storeDict    // Send the Price Data         const priceData: Dictionary<number, bigint> = Dictionary.empty();         priceData.set(1, BigInt(1_000_000_000));         priceData.set(2, BigInt(2_000_000_000));         priceData.set(3, BigInt(3_000_000_000));         priceData.set(4, BigInt(4_000_000_000));         priceData.set(5, BigInt(5_000_000_000));         priceData.set(6, BigInt(6_000_000_000));         priceData.set(7, BigInt(7_000_000_000));          // prepare the external message         let valid_until = BigInt(getCurTime() + 60);         let seqno = await register.getSeqno();         let hash = beginCell()             .storeUint(seqno, 32)             .storeUint(valid_until, 32)             .storeDictDirect(priceData)             .endCell()             .hash();

Bear: either storeDictDirect() or storeDict() both have same error when I dealiong with externalMessage :(

Bear: 🐱 (reply to 48021)

Bear: good, but wondering why it doesn't work at my External MEsssage (reply to 22941)

Bear: bro....

Bear:         // Send the Price Data         const priceData: Dictionary<number, bigint> = Dictionary.empty();         priceData.set(1, BigInt(1_000_000_000));         priceData.set(2, BigInt(2_000_000_000));         priceData.set(3, BigInt(3_000_000_000));         priceData.set(4, BigInt(4_000_000_000));         priceData.set(5, BigInt(5_000_000_000));         priceData.set(6, BigInt(6_000_000_000));         priceData.set(7, BigInt(7_000_000_000));          // prepare the external message         let valid_until = BigInt(getCurTime() + 60);         let seqno = await register.getSeqno();         let hash = beginCell()             .storeUint(seqno, 32)             .storeUint(valid_until, 32)             .storeDict(priceData, Dictionary.Keys.Uint(8), Dictionary.Values.BigUint(256))             .endCell()             .hash();   DONE (reply to 48021)

&rey: Contact exchange's support. Make sure to provide wallet address that is controlled by you. (reply to 48028)

LeeMinThien: FunC and Tact which is better?

LeeMinThien: Any limit on Tact?

Speculator: Fift » FunC » Tact (reply to 48031)

shubham: hi ton team submit for ton starter page is giving ssl error   https://forms.tonstarter.com/build?source=launchLP

LeeMinThien: Code after verify contract is FunC right? (reply to 48032)

shubham: or does anyone knows any other place to submit project

Kayrin🌙🌙: I just minted tokens on Ton. Do the following to post to launchpad.?

Kayrin🌙🌙: me too (reply to 48035)

Kayrin🌙🌙: hi admin help me how to submit project to launchpad

Jimmy Becen: curl -X 'POST' \   'https://testnet.toncenter.com/api/v3/runGetMethod' \   -H 'accept: application/json' \   -H 'Content-Type: application/json' \   -d '{   "address": "EQCDtEmOxDhXfE-wF88_iPZ5bZH6LPYs1iwsEzPq3nFDVF79",   "method": "orderAddress",   "stack":[     {       "type": "cell",       "value": "te6cckEBAQEAJAAAQ4AEpCScF7YSP5f2zGM88VasMA9bN4HmzcHPOXu43o/3s7CPTN4k"     },          {       "type": "cell",       "value": "te6cckEBAQEACgAAEGYzWjFTMjFHT3vU4w=="     },       ] }'  my func  get fun orderAddress(orderId: String, owner: Address): Address {         let init: StateInit = initOf Order(orderId, owner, myAddress());         return contractAddress(init);     }  hi guys, why when I runGetMethod with the above parameter always error "JSON decode error'. Can someone tell me where I went wrong

Ruslan: Hello, first of all. You can’t use comments in body) Second: please, use tuples instead of dicts: [“cell”, “<value>] (reply to 48040)

Jimmy Becen: thanks, I have solved it (reply to 48041)

Sonny: Please tell me what is the difference between this code, Message Add vs receive("increment")

Kenny$$Shillz: Ston.fi (reply to 48000)

Anton: well, “increment” only allows you to increment val by one at a time, whereas “msg: Add” lets you do arbitrary increments that you configure via the amount field in the message (reply to 48044)

dropout.io: Anyone knows best tutorial to deploy website using ton domain?

Dung: Hi everyone.  How can I set metadata and total supply for my own token using this repo? https://github.com/ton-blockchain/token-contract

User<1691331052>: oh servers...

Bear: sorry, how to conver the output message which is String turn to general Slice?  "te6ccuEBAQEANgBsAGeAEfziBmkSHZl4aXkFQ53y9T7uiIQA6s3pnb8L0G1XJg9IO5rKAKszXGxtTMFRXQAAAGXwHaIlRA=="  https://t.me/tactlang/18913

TON Bounty Bridge: ​Article: How to create your memecoin on TON  🏷 Education  Summary:Write an article how to create your memecoin on TON Blockchain  Assignees: no assignees Created by krau5

Zack: does anyone know where i can find these files

Zaitsev [will never DM you first]: Hi all, is it possible to forward a certain amount from a swap to another wallet address? Basic service usage fee

Yhwach: is tonapi rates endpoint down?

Howard: this is dope: https://toncenter.com/api/v3/#/default/get_jetton_transfers_api_v3_jetton_transfers_get

Long: https://tonapi.io/v2/accounts/0:5a1ff1b4200949a6892427c5bf0f6e1b655febb8414c18a8babfb235a875a758/publickey This result in error: "entity not found" How can I get the public_key for an address?

マムル: ton wallet addresses have 3 types, if I'm not mistaken. Including bounceable and non-bounceable (reply to 48012)

マムル: ton testnet seem to be overloaded. But I still have a question that bothers me - am I the only one who's having a trouble while trying to deploy a smart-contract?

Mohammad: Hi 👋   I am trying to write a pre-sale contract for my jetton and I have an important question.  Consider someone tries to buy 10 jettons and contract's jetton balance is less than requested amount (like 5)  How should I buy 5 and send back remaining TON to the buyer (pre-sale contract caller)

Mohammad: Is there any open source pre-sale contract for minted jettons out there?

Mohammad: Do I need to have a corresponding balance variable for my pre-sale contract? 🤔 (reply to 48069)

Vladislav: Good day everyone, good people 👋🏻)  My name is Vladislav, and I am a kind of “ideological representative”. I have a lot of good ideas and, accordingly, many promising projects, all win-win.  But I need your help.  I want to gather powerful, strong, experienced mastodons in the field of programming as colleagues 🚀  By combining our efforts, we will influence the course of history, which is rapidly developing in our time❗️  (P.S. Personal messages 🤝)

Sumit: hi, i want to make sure that jettons are burned for sure then only my contract is called.

Sumit: what i have done is make a burner contract that can accept tokens and this contract can further call my original contract with the JettonBurnNotification to make sure that there are no shady contracts

Sumit: is this fine?

Sumit: because right now i have a transaction in my test transaction flattened list that is 0xd53276db (which is JettonExcesses) which fails with a 130 error code

Aydin: .asSlice() (reply to 48058)

Sumit: mode: SendRemainingValue should send all the tokens that are left in the txn to next send?

Daniel: Hi fam,  How do I upload NFTs to Getgems in mass. Like a collection of 2000. I also want the community to mint at a fee rather than buy on auction or at a fixed price.  I just made a test and it made me upload one by one which was excruciating and I had to pay gas for each.  I don't mind any help.

ℛ𝒾𝒸𝒽𝒶𝓇𝒹: Hi, I have installed mytonctrl2 and THA but If I use THA I always have the same answer: {   "ok": false,   "error": "No working liteservers with ls_index=None, archival=None",   "code": 503 } can u help me fix it?

Denis: Does anybody know good seed recorevery tools for ton?

— 2024-04-02 —

Lucas W.: Hello everyone. I want implement TON CONNECT to my project wallet on TON. Can you help me ? My wallet project is using React-Native

Creative: no nft in wallet https://tonviewer.com/transaction/d4e5594d84bdfac943239d113bea4423b171adc9e21ed77e6478f3e9bc2a862f

Creative: help with the problem

Jimmy Becen: Hi guys, Today I can't find the Jetton Token Launchpad TonUp example anymore :(. Can someone who cloned it please send it to me?

Sonny: hi guys How can I compile the methods opcode ? 0x9b3aa3fa,0x2c76b973, ...etc

Dmitry | backend4you.ton: For your contract? In general, you can use any values you want. A “good practice” is to make this value a CRC from tl-b of your message/op. IIRC, Tact does this automatically. (reply to 48093)

&rey: They are not in use. (reply to 48095)

Kenny$$Shillz: Why not just implement mint msg that requires ton in the nft collection contract (reply to 48079)

Kamil': If I run an archive node will I be able to get the contract state for a specific block? Smth like this: client.run_get_method("get_pool_data", block=500)

Dmitry | backend4you.ton: And a msg to withdraw TONs to admin address (reply to 48097)

&rey: Much different, or first + 4 last chars? (reply to 48101)

Sumit: how can i integrate ton wallet with @ton/core library?

Daniel: It's on Getgems. Can I do that on getgems? can you share how? (reply to 48097)

Tim: Hi  I can't figure out how to get historical data (something similar to eth_call on a specific block). Could anyone share an example?

cliff: How my wallet private key is managed in the wallet, and how to restore it if i lost the phone. The wallet does not ask me to make a copy of the seeds of my wallet

&rey: In @wallet? It controls private keys itself and does not allow you to do that. Other apps do ask you to write seed phrase down. (reply to 48107)

Kenny$$Shillz: Oh if it's minted already then no (reply to 48105)

Sumit: hi, can you help me with wallet integration? (reply to 48108)

&rey: Could you send link to collection contract? (reply to 48079)

cliff: Any tech details? Otherwise i might think its unsecure (reply to 48108)

cliff: How do i know ton does not save my private keys in the backend

&rey: No custodial services on TON shared details about security. Evaluate their safety appropriately. (reply to 48112)

&rey: *Telegram, not TON. (reply to 48113)

cliff: Kindly provide a link

&rey: "@ton/ton", actually. Here's an example how to work with a similar wallet wrapper: https://github.com/ProgramCrafter/wallet-contract/blob/main/basic-interaction-wallet-inplug-v2.ts (reply to 48104)

Sumit: well, i want to to connect the ton wallet chrome extension in my code. (reply to 48117)

Sumit: i can see it has send() method, but the wrapper generated does not return a body.

Daniel: How do I get the contract of an NFT that is uploaded to get gems? Do I have to first upload it all to getgetms?  Oh.  this is it.  https://tonviewer.com/EQABtKitVhDWUTR7443QV17VKBvJxdDP-20mtUPyKEsGvTfo\ (reply to 48111)

Daniel: I have now seen the collection contract. How do I implement mint msg.  Thank you (reply to 48097)

BRANDON: i have mint a new contract on TON, i have game ready to play. What can i do to contact the TON starter to check my project? i know you guys have form to submit but direct talk will be better

User<6703584027>: Any DEV here in need of workers?

Zack: Anyone know if my Jetton is in wallet instead of ton space wallet can I still transfer it out?

&rey: Is version same? (reply to 48126)

Zhang: message TokenPayout{     value: Int as coins; }  receive(msg:TokenPayout){...} this is smart contract snippet. how I can run this "receive" function from frontend , especially react app? thanks for any help

Sumit: export async function senderFromWindow(wallet) {   const connect = await wallet.send('ton_requestAccounts', undefined)   return {     address: Address.parse(connect[0]),     send:async  (args) => {       const response = await wallet.send("ton_sendTransaction", [{         data: args.body,         to: args.to.toString(),         value: args.value.toString(),       }]);       return response     },   }; }

Sumit: i wrote a wrapper to make extension sign my transaction

Sumit: but i get DOMException: Failed to execute 'postMessage' on 'Window': (allowExotic = false) => {       if (this.isExotic && !allowExotic) {         throw new Error("Exotic cells can...<omitted>... } could not be cloned.     at TonProvider.send (chrome-extension://nphplpgoakhhjchkkhmiggakijnkhfnd/js/extension/provider.js:84:20)     at Object.send (http://localhost:3000/static/js/bundle.js:33604:37)     at Object.internal (http://localhost:3000/static/js/bundle.js:1291130:17)     at Bridge.send (http://local

Zhang: hello everyone! message TokenPayout{     value: Int as coins; }  receive(msg:TokenPayout){...} this is smart contract snippet. how I can run this "receive" function from frontend , especially react app? thanks for any help

&rey: Via wallet contract. (reply to 48133)

Zhang: thanks for reply. Actually I connected tonkeeper on frontend and want to call receive function of smart contract. I will appreciate that if you can share some code snippet or doc link (reply to 48134)

&rey: You need to send message containing some TON. That is definitely on docs.ton.org. (reply to 48135)

Zhang: definitely,  here is what I tried. but I am not sure this is correct or no (reply to 48136)

Sumit: can anybody help? (reply to 48131)

&rey: That which words you enter, pretty much uniquely (modulo wallet contract version) determines the wallet. Safekeeping seed phrase is user's responsibility. Isn't it? (reply to 48141)

Zaitsev [will never DM you first]: Hi all, is there an example of a payload after a specific internal transaction has succeeded/fulfilled?

&rey: This is not chat for discussing Notcoin. (reply to 48149)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: Hi all! Does anyone know what could be causing the error Error: no healthy nodes for v4-testnet when deploying a contract?

Tiger: hello, i want to convert a unity game into telegram mini game, has ton support unity or cocos2d yet? thanks!

&rey: Absence of testnet nodes of certain kind available, I guess. (reply to 48157)

&rey: You aren't allowed to ask for DMs IIRC. (reply to 48160)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: Ah ok, can I deploy ton blockchain locally? (like ganache)? (reply to 48159)

nyssa: Hello guys, how do i get access to MainTONDB schema in redoubt tonanalytica?

&rey: MyLocalTon, but that's often superflous; you can run tests in sandbox. (reply to 48162)

ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠᅠ ᅠ: ok, ty so much (reply to 48164)

Kenny$$Shillz: You can do it in tact the mint massage can simply contain the address of the new owner . And U just require the msg value to be greater than or equal to  the price of the nft plus the gas and storage fees (reply to 48122)

Daniel: Thank you for being kind  can you share a resource that can guide me to do this? (reply to 48166)

&rey: There is batch deploy available. You need to form message with opcode 2. Ask developers for help if you don't know how to do this. (reply to 48121)

&rey: https://docs.ton.org/develop/dapps/cookbook#how-to-use-nft-batch-deploy (reply to 48168)

Kenny$$Shillz: Actually I haven't found any (reply to 48168)

Kenny$$Shillz: I however created the Goblin nft contract with same feature...

TON Bounty Bridge: ​ Formal Verification semi-automated toolkit support for FunC and Tact  Don't miss out ❗️ Our bounty will automatically close in 2 weeks, so take a moment to check it out and possibly complete it while there's still time 👨‍💻

Jimmy Becen: Hi guys How can the contract take the user's jetton token?

&rey: You request user to send you jettons, then process incoming forward notifications. (reply to 48174)

&rey: You are unable to pull tokens, including pulling two kinds of tokens simultaneously.

Где: Hello, I have problems with @wallet, support don't ask

Jimmy Becen: Okay, thank you (reply to 48175)

Zaniyar | MetaRoom.city: is it posaible to only allow minting of an NFT if a user is member of a specific group?   Since minting trigger is happening in the frontend of a webapp, it could be faked right?

Sonny: hi everyone . execute me , How can I set the contract name and ontract type  when deploying?

Denis: it's manually managed off-chain  list

Sonny: execute me , How can I do it? (reply to 48182)

Ngoc: Hi everyone, I tried to upload the game to the store by Telegram bot. But it seem not working . I tried to search for other ways but was also directed to Telegram bot. Where am I wrong or miss take? I can enter the group later than everyone else, so I can miss this information, can anyone help me with this problem? Many thanks.

Mirai: Hi together, I am sorry I have to bother with this. But neither Mercuryo nor Neocrypto giving me a chance to buy TON atm. Is there any other way to get TON via a Credit Card to use it for Fragment? I just wanna buy a friend TG Premium 😭

Olya Nemo: @cryptobot, @wallet (reply to 48185)

Caio: Hello guys! Is there anyone I can talk to about a proposal?

Kingsley: Hello Everyone

Kingsley: Please Admin my TON WALLET is having an issues for over weeks now. How can you help resolve the very issue.  See the screenshot of the problem below 👇

Kingsley: Here is the screenshot (reply to 48191)

— 2024-04-03 —

Eagle: Hello would like to connect with serious devs for a web3 game for language learning project for Open League Hackhaton

&rey: Since over weeks, @wallet has decided that it will not work in your region. Please use a non-custodial wallet from ton.org/wallets. (reply to 48190)

William: what is Token per network, please help me explain

&rey: Access tokens. (reply to 48201)

William: thank you (reply to 48202)

DogPay.: {"stack":[["tvm.Slice","te6cckEBAQEAJAAAQ4AfQKfWtCH9i1rtDsPGCTUIu1NqbN+BZPrxUlGMgEB/GxCG6SCC"]],"address":"EQDt9gsR0bNcAcy8x6z_bGDiY4N0vuu0N5X4vYAo1tt8L4eI","method":"get_user_data"} {"ok":false,"error":"'cell'","code":503}

DogPay.: why?

DogPay.: postman request is ok

&rey: Service unavailable? (reply to 48204)

Hung: export type TokenUpdateContent = {     $$type: 'TokenUpdateContent';     content: Cell | null; }  I want to update my jetton with mintable = false, I'm trying like this but this is not assignable to type  Cell:   const message: TokenUpdateContent = {                 $$type: "TokenUpdateContent",                 content: {                     mintable: false                 }             } Any body can help me how to define the "content" variable with Cell type?

&rey: Mintable is usually not content parameter but matter of revoking ownership (transferring control to null address). (reply to 48208)

DogPay.: change curl is ok

Samyar: what is apiLink in compressed cNFTs ? i could find the implementation of cNFTs on GitHub but not an explanation of what are the methods and why we should create them?

Samyar: https://github.com/ton-community/compressed-nft-contract/blob/main/contracts/collection_new.fc  there is no use case for api link in the contract  except for storing it and getting it back (reply to 48212)

doni: I have a general question    Im looking to find contracts with a certain codehash , Is there a service that Index contracts address and codehash ?

Samyar: i found something  https://github.com/ton-blockchain/TEPs/pull/126/commits/91bd43e74531885bb8239cb0c14193f47151345a?short_path=9674d17#diff-9674d171507b12135402b87668a65511057474f2ee253923acc2ae33587a4d26 (reply to 48213)

MA: Hello everyone,  I created a wallet using Tonkeeper. However, when I import the wallet using its mnemonic phrase into the Python or Golang SDK, the generated address differs from the address shown in Tonkeeper. Is there a specific derivation path used by Tonkeeper that I should be aware of?

&rey: There is no derivation path. Is version same? Is public key same? (reply to 48216)

MA: Thanks, It was a version  mismatch (reply to 48217)

Mohammad: Hi I have a dictionary in my contract's storage  Loading dict in load_data function inside contract: get_data().begin_parse()~load_dict()  Exposing dict using getter method (method_id) return load_data()  storing dict using Typescript: beginCell().storeDict(Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())).endCell()  loading dict from getter method in typescript: Dictionary.load(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell(), stack.readCell())  What am I doing wrong?  I end up getting Not a cell: null or no more references errors all the time! what should I do

Vladislav: Hello everyone 👋🏻  We are looking for a graphic designer to join our progressive and promising project.  Master of 3D graphics and animation.  A mastodon of his craft.   We won't hurt you about money. 💰😉   (P.S. private messages)

Behrang: Try Dictionary.loadDicret (reply to 48219)

Mohammad: getting Not a cell: null 😔   Dictionary.loadDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell(), stack.readCell()),  the problem is with stack.readCell() I think but what should I do? is an empty dictionary equal to a null (empty) cell? (reply to 48221)

Ilan: Hey guys

Ilan: What is the minimum stake to be in the validator set?

Gifter: Hello everyone, I'm looking for a developer of a simple smart contract. Details in DM.

Tuấn: i go try demo tranfer, when running i got err  : redirect-boundary.js:57 Uncaught AxiosError: Request failed with status code 429

Tuấn: any help

Ser Krechet: Good afternoon, everyone.  Looking for an experienced telegram bot developer with practical knowledge of blockchain.  Details in PM.

Behrang: Use stack.readCellOpt() (reply to 48222)

Mohammad: Using loadDirect and readCellOpt will change the error to No more references (reply to 48231)

Behrang: A validator currently needs around 350,000 TON to be able to validate for a single round. 700K TON if you want to validate at both odd and even rounds. (reply to 48226)

Behrang: Maybe it's the Value type. Define this:  export const emptyDictionaryValue: DictionaryValue<unknown> = {     serialize: function () {         return     },     parse: function (): unknown {         return {}     }, }  Then use it as the value type:  Dictionary.loadDirect(Dictionary.Keys.BigUint(256), emptyDictionaryValue, stack.readCellOpt()) (reply to 48232)

Mohammad: Thank you so much you are a life saver ❤️ (reply to 48234)

Mohammad: I have a treasury const x = await blockchain.treasury('x'); and I stored last 256 bits of its address inside my contract. how can I write a test to check if the addresses are equal? 256-bit stored one in smart contract and this Adderss type I have in typescript?

Behrang: This might help:  const x: bigint = ... Address.parseRaw('0:' + x.toString(16)) (reply to 48236)

Дмитрий: Hello, can you help me? I trying to bring jetton walet address from jetton master, but my contract cant receive this message

Дмитрий: Tact code   receive(msg: TakeWalletAddress) {         let ctx: Context = context();         require(ctx.sender == self.master, "Invalid sender");         self.jetton_wallet = msg.wallet_address;     }

Ilan: What is the difference between an even and odd round? If i have 700k, on the current round do I earn on the 700k or on the 350k used for the voting? Or do I setup a pool with let say 800k ton and 1 pool with 350k ton and I vote on each round to have my pool with 800k in the set? Or each pool is attributed to the same node? Meaning i make 2 pools of 350k and always validate for 700k in each round? (reply to 48233)

Miguel: Hey fam

Miguel: Hi,how to create a tonv4 wallet? We couldn’t find the information in the documentation.

Heydar: guys please can someone help me in learning ton and func ... no youtube video for func and also I dont know after learning TON , how we can earn moneys by that knowledge Im c++ software engineer. can someone guide me? please

&rey: Yes. If TS wrapper doesn't understand that, it's its problem. (reply to 48222)

Heydar: what's best refrences to learn ... (reply to 48246)

Heydar: can I DM you please, is that allowed? (reply to 48247)

Ilan: What is the difference between an even and odd round? If i have 700k, on the current round do I earn on the 700k or on the 350k used for the voting? Or do I setup a pool with let say 800k ton and 1 pool with 350k ton and I vote on each round to have my pool with 800k in the set? Or each pool is attributed to the same node? Meaning i make 2 pools of 350k and always validate for 700k in each round?

&rey: Pools are paired; funds of one are staked for validation, while funds of second are locked after previous round of validation (rewards intentionally aren't distributed immediately). (reply to 48241)

Ilan: So it doesn't affect my returns on the 350k if i have 1 pool or 2 as I can earn on a certain stake only on 1 out of 2 rounds? Or did i miss something (reply to 48251)

Ilan: I mean if I make 2 pools of 350k, I don't earn more than if i have just 1 pool of 350k in terms of %?

Kaito Lee: Hi guys, i have a question, i want list i4 token to dex on ton network, but i see if listing a token, i can submit and waiting for verify from dex dao. Is there any dex exchange that supports filling in information such as amount token a and b and total liquidity to create a pool ?

Heydar: ok sorry I dont DM you, I understand you tired from the question,  thanks ❤️ (reply to 48251)

Gifter: Still relevant (reply to 48227)

Facu: Hello! I am starting working with TON, trying to interact with a smart contract at the front end, with ton connect. For some reason I am getting an error when openeing the contract, however when I do the same at the backend it is opening it without issues. May be something different at frontend that I should take into account?

Facu: this is at the backend how the contract is opened

Facu: This is the code at frontend. I wonder if the address format is fine, at serverside I am doing the same.

&rey: 1. Videos: https://www.youtube.com/@WikiMar 2. Earning examples: completing bounties, creating new projects, participating in contests. (reply to 48246)

Kiri: 嗨！

&rey: Please share area of expertise in this chat, that will increase the chances for help. (reply to 48256)

&rey: Seems that wrapper is doing something wrong. (reply to 48260)

&rey: Please use English in this chat. (reply to 48262)

Facu: The wrapper is auto generated (I am using TACT) and I saw that the generated code have some differences comparing to previous versions that I see in tutorials

Facu: I can see that in current version the constructor is private, so insted of using new ClassName , it has now a static fromAddress function to create the object, and also is generating 1 function send with all optional parameters instead of 1 function for every send type

&rey: Please share it via gist.github.com. (reply to 48267)

Heydar: for creating new projects(any project, for example some tools , not dapps) ,How I can know how much it can receive? (reply to 48261)

&rey: This requires a business plan and is out of scope for this chat. Though, spending is usually a fair bit less than Web2 projects have. (reply to 48283)

Facu: Yes, sorry. I've realized then. 🙂  https://gist.github.com/facundofierro/ebaa43962602b99f9466f150ffc470b4 (reply to 48282)

Heydar: thanks , you are my life saver ❤️ sorry about this question(Im a beginner in block-chain), do we have c++ apis to create dapp that working on block chain, do you offer something to me? ( I could find somethings, but Im not sure which one is better to start with) (reply to 48284)

&rey: Blockchain runs smart contracts: programs which have balance and persistent data. Their functionality is limited, so they use a separate bytecode and TON Virtual Machine (TVM). (reply to 48286)

&rey: C++ "API" will only allow to interact with smart contracts from outside of blockchain. This is possible, and ton-blockchain repository contains examples.

Heydar: I mean something like blueprint that create some typescripts working with smart contracts in TON  Im not js developer, so I want to works with contracts by C++ , not js. (reply to 48287)

Heydar: Thank you so much, so we have that wrapper scripts in c++ too? (that is creating by blueprint) (reply to 48288)

&rey: You will have to write functions yourself, but base utilities are available. (reply to 48290)

Heydar: please can you send me a link about that utilites? (Im pretty sure that is not any documents for that too :(   ) (reply to 48291)

Jimmy Becen: Hi guys! I have a deposit contract that accepts jetton A. When the user transfers an amount of jettons X to the above contract. How do I know that Jetton X is a Jetton A token? I'm listening to Jetton Notify. And check to see if there is a jetton master A address in forward_payload? However, I realized that anyone can transmit the jetton master A address via forward_payload when transferring jetton X to the contract.

&rey: https://github.com/ton-blockchain/ton/blob/master/crypto/smc-envelope/TestWallet.cpp (reply to 48292)

Heydar: Thanks , is this your account? (reply to 48294)

&rey: You get your jetton wallet address and then check sender.  You can get jetton wallet address in different ways. Probably the best one is storing master contract state in your data and then running a function. (Only do this for jetton contracts you trust.) - mitigated by using RUNVM.  The function ought to look something like that: https://gist.github.com/ProgramCrafter/53fc3a4846397ee5f3f3b25ca3356ab5. (reply to 48293)

Facu: Okay, reviewing that .... following the code that is executed in ton-core (reply to 48264)

Facu: This error is that is failing to check with Address.isAddress

&rey: Does your code use @ton/core or ton-core? (reply to 48297)

&rey: The first one is valid.

Facu: let me check

Facu: the wrapper seems good

Facu: seems that I have a mix 😅 ... I will clean up all ton-core (reply to 48299)

Heydar: it was russian videos  I think may I should try & error 😐 thanks (reply to 48261)

hai: hi, any ideia of how to make a swap (trade)  using python?

Facu: That solved the issue! Thank you! 🙌 (reply to 48303)

Jimmy Becen: Thank you, I solved it! (reply to 48296)

Vitor: Hey guys.   Anyone has a lib / framework / platform to recommend for running tests for the Front-End of the TMA?

𝑻𝑶𝑵𝒀: Need a Developer to Make Software on nodejs/python for Token Volume (Purchase/Sale)  Ston Fi dex  dm

Heydar: do you need an intern too? (reply to 48309)

spanish-or-vanish: Looking for a dev to make wallet interaction working in node

User<5018886941>: Hello

&rey: As here? https://github.com/ProgramCrafter/wallet-contract/blob/main/basic-interaction-wallet-inplug-v2.ts (reply to 48312)

spanish-or-vanish: yes (reply to 48314)

User<5901725413>: hey, how to airdrop jettons to 1000 holders in an efficient way?

Jimmy Becen: sorry, how to get master_data? I found master_code by get_jetton_data but I can't find master_data (reply to 48296)

ᅠ: How can I send TON to many wallets in one transaction ?

Sergey: I wanted to know how wallets like the Tonkeeper make money? Do they charge additional transaction fees?

Denis: Good idea.🤔 (reply to 48319)

||#*™sman: Hello friends, I will be making a project on the ton ​​network, which ten sales platforms are good?

Yannis: Hey guys, Can any one recommend an api service for TON?

ᅠ: I'll give you 1 TON for the answer (reply to 48318)

Sumit: how can i generate a ton keypair?

Sumit: without using Tonweb

NDA: https://github.com/ton-core/ton-crypto (reply to 48325)

Oba: New to this dev thing. Want to know where is the best place to start to start developing coins

Oba: Have no coding experience but willing to learn

K.: If you want to develop tokens as in Jettons, then this is a great starting point: https://docs.ton.org/develop/dapps/tutorials/jetton-minter (reply to 48329)

Oba: Thank you 🙏🏾 (reply to 48332)

Amir: Hello, is it possible to generate a Jetton wallet address offline without using ToncenterApi?

— 2024-04-04 —

kevin: PM me (reply to 48312)

kevin: ADNL with a public liteserver also works well. (reply to 48334)

kevin: as i know some contract trade may have referra fee . (reply to 48319)

Musa: Help

&rey: Cell overflow... (reply to 48339)

&rey: Maybe sender info + key + dict tags don't fit into 1023 bits?

Kenny$$Shillz: hey please what library are you using to instantiate the wallet obj with  this transfer method (reply to 47304)

AA: Hi , if there is a sample code how can you show on the web page the  recent transactions of a wallet  For example wallet message amount EQAhmbN9yEm5A4mihjUvGoRqL9rNjwlHhisngC6RtUB6vqKU Donate +1TON EQAhmbN9yEm5A4mihjUvGoRqL9rNjwlHhisngC6RtUB6vqKU project help +0.5TON EQAhmbN9yEm5A4mihjUvGoRqL9rNjwlHhisngC6RtUB6vqKU Good luck!                         +0.01TON   Trying via github .com/orbs-network/ton-access

&rey: You find master code and data by retrieving its state via explorer. (reply to 48317)

&rey: You've found wallet code, actually, and it's not that useful.

AA: ? (reply to 48345)

AA: link tutorial

&rey: Try new TonClient(...).getTransactions(...) (reply to 48349)

&rey: But Orbs is bad at retrieving historical data.

AA: I liked the fact that you don't have to use api code.   maybe tonweb is needed as an alternative? (reply to 48351)

AA: What's the best one to use? I just want it to be safe and steel, to display information.

&rey: No, SDK doesn't ultimately matter here, only API you choose. I've found Toncenter more reliable in this task. (reply to 48352)

AA: Okay, I'll try to use  Toncenter and new TonClient(...).getTransactions(...). (reply to 48355)

_chocolate.py: i'm writting test for collection nft contract but it show me bitbuilder overflow. Please help

moges: Hello there i recommended to ask here...i didn't receive the voucher of this transaction😔

ioyudy: so I sent 17.43 TONS from UQDvm-RoZi8OTOfNANJTfmfMjdWam3a3k766rJZFtpYWmxZv (my Telegram Ton Wallet) to EQBfAN7LfaUYgXZNw5Wc7GBgkEX2yhuJ5ka95J1JJwXXf4a8 (my Okx Wallet) but I entered the wrong tag/memo/comment "21191997" which should have been filled in with "615128"  transaction route: from UQDvm-RoZi8OTOfNANJTfmfMjdWam3a3k766rJZFtpYWmxZv to EQA2JYPGPywx6Sn590nUd06B2HgOkFvJ-cCnTO6yTEdacbUG  txHash:224085d14773750b12a35091f1b143647e27e3e461b999fdb1d2d2cf4f36c30a  then forward from EQA2JYPGPywx6Sn590nUd06B2HgOkFvJ-cCnTO6yTEdacbUG to UQBfAN7LfaUYgXZNw5Wc7GBgkEX2yhuJ5ka95J1JJwXXf9t5 with comment 21191997 txhash: 61ca9cce42945f42a787804548039d423c11dd9c685ffea57a3e4c2b2e9bd071  if OKX want to refund to the EQA2JYPGPywx6Sn590nUd06B2HgOkFvJ-cCnTO6yTEdacbUG am i get my refund to the  UQDvm-RoZi8OTOfNANJTfmfMjdWam3a3k766rJZFtpYWmxZv (TON Telegram Wallet Address)?

kevin: Got question on ton blockchain tx, since multiple tx formed a single event(which I borrow from TONAPI, like a swap or a add liquid ) , how do I known these transaction are related ?

MT: When I followed the official tutorial to write the first smart contract, this error "undefined function ~load_unit" occurred during compilation.

MT: I think I've imported the standard library

Heydar: inline is doing same as inline in C++? also if I do that , is that forcing the compiler doing inline, or it's like gcc compilers? (it's a hint for compiler)

MT: https://tonhelloworld.com/02-contract/

MT: I don't know, I'm following the instructions in the tutorial

MT: It seems that my grammar and spelling are wrong. Is there a plug-in like eslint that can check it?

&rey: uint or unit? (reply to 48361)

&rey: Also, you should put spaces around + operator.

&rey: Like attribute((always_inline)) – except recursion, forces inline. (reply to 48365)

Heydar: Thanks (reply to 48371)

Heydar: guys  can you guide me when you refer this link and when you use the instructions in func? https://docs.ton.org/learn/archive/tvm-instructions  I need whats best practice on that?

Hustle: Hey guys, i managed to clone the twa-template from github and built a ton miniapp, but the thing is when i try to integrate it with github web flow ( while typing /yarn) the following error occurs :  Workspaces can only be enabled in private projects  I guess this happens since i forked the official telegram miniApp template and made changed there, so any idea on how to solve this?

Heydar: I want to learn create telegram mini app, do we have any tutorial or very simplest one? please. (reply to 48374)

Hustle: Not sure, but you can use the starter template on github to figure out things (reply to 48375)

Heydar: Thanks. please can you give me the link? or how I find that.(Im beginner) (reply to 48376)

K.: Try this:  http://tonhelloworld.com/03-client/ (reply to 48375)

Heydar: Thanks🙏🏽 can I ask a another question? Im so sorry for weak questions ... I just want to rearrange the informations in my opinion. I thought it should use func language too, is that right? in this example it didnt use. (reply to 48378)

K.: It uses func in the second tutorial when you build the smart contract. But Telegram mini apps are commonly Javascript/React based. They are just like any other web application, but just embedded in Telegram. (reply to 48379)

Heydar: ok, thanks for the help ❤️ do you have any suggest to where I can learn create first dapp by func in ton? (reply to 48380)

K.: From some Google-ing, it’s seems like a bug Yarn hasn’t fixed for over a year. (reply to 48374)

K.: From the same link I sent there’s a menu on the right for 4 tutorials. If you do them in order, you should have a basic understanding of everything. (reply to 48381)

K.: If you want a full course on everything, then check out this: https://stepik.org/course/176754/syllabus

Rowena: Hi

Heydar: Ohhhhhhh  , I thought it's prepared in RU  language, Thank you ❤️ (reply to 48384)

Hustle: Thankyou ❤️  Btw, does this has anything to do with the miniapp getting failed?  I configured the bot but when i try to open mini-app / github web page link, all i see is an empty page :/ (reply to 48382)

K.: Are you getting any errors in the console when running the app? (reply to 48388)

MA: Hello guys, I have this Tx-Hash "dLOKQMi+AqNijhpEAsgAU2Hp/kUYl33LhPkOq5Sn4Js=" but when I call it with this Api returns 404 : " https://tonapi.io/v2/events/{event_address}" after I checked the Tonviewer, I found out the site convert the Tx-Hash to this value : "74b38a40c8be02a3628e1a4402c8005361e9fe4518977dcb84f90eab94a7e09b" and calling the Api with this converted Tx-Hash returns correct transaction how can I Convert the Tx-Hash ?

Jimmy Becen: please give me the api or any link examples through explore! Help me (reply to 48346)

Heydar: int x = cs~load_uint(8);  it means that cs changed in the function too?

Hustle: . When running developmental server, i face no issues, the web page is loading but my github pages + bot both shows empty page (reply to 48389)

Abbas: Hi guys , anyone in here know how to revoke owner jetton?

czajek: hi

czajek: I have a problem, I sent my TON to Kucoin and did not provide MEMO. The funds did not arrive, I want to return the funds to the source address, but the funds did not come directly from my address, but from some indirect one.

czajek: https://tonviewer.com/transaction/2d6502b99cb76149184311c3e4f981fa02f9c98f8e457ec968af478d05260343?section=valueFlow

czajek: my true adress

czajek: UQCYH3_n0l0X8kXaZVGozsNljx_YuMtk0j4Ukk_FMGp8OzNx

czajek: Dear Valued KuCoin User,   Thank you for reaching out to KuCoin Customer Support.   Please note that we only could help you return the TON token to the sending address since you put the incorrect memo, as you can see the source address is EQA2JYPGPywx6Sn590nUd06B2HgOkFvJ-cCnTO6yTEdacbUG from TX https://tonscan.org/tx/X%2FQ5nG1Am0WOYENx2ioaq+LGeWPDSFUyubzoKjS9yuE=, may we know where did you send the TON token from? Please kindly confirm with the original sending platform to see if you could receive the TON token without memo after we return the TON token to address EQA2JYPGPywx6Sn590nUd06B2HgOkFvJ-cCnTO6yTEdacbUG, thank you.

&rey: https://tonscan.org/address/EQBfmFA98_e_0cbJdZFuBQEn16NWbgD7vobRsvgNuY35MfSj#source, Raw data + Bytecode/base64. (reply to 48391)

&rey: Base64 to HEX in your preferred programming language. (reply to 48390)

&rey: You need to contact @wallet support. Generally, this isn't topic for this chat. (reply to 48402)

Lincoln: I have fullnode of ton. But cant install opentonapi. How can i do that? Thanks

Hustle: Should the telegram miniapp components only be of .tsx extension? Or we could make with .jsx aswell?

Sumit: Hi, I want to track transactions for my contract. How should i do that? For examples i can get logs in a 1000 blocks on EVM?

Sergey: I get an error when deploying to the mainnet. I found the contract address in the transaction history. Why did I get an error?

&rey: Consider TMA simply as a website. (reply to 48407)

Hustle: Alright ❤️ (reply to 48411)

Lincoln: Like topapi dont wanna make it public and runable. 6 month not update docker :(

Hustle: Tsx has more conditions, like need to mention the type when we fetch datas etc. Also, im much familiar with jsx than tsx. So (reply to 48414)

Hustle: Yes, but not in evry case (reply to 48417)

Patrick: Hey, can someone help me get pr through at ton-assets repo? I am waiting since 2 weeks for an accept and getting frustrated

User<1384034483>: I want help admin

User<1384034483>: This guy sell me voucher and he locked the nft what will I do now

Đường Tăng: Hi there, I want to use Python for generating a seed phrase for a TON wallet. Is there any library that supports this? Thank you.

&rey: Pretty much any of https://docs.ton.org/develop/dapps/apis/sdk#python. (reply to 48422)

User<1384034483>: Aadmin please help (reply to 48421)

&rey: What do you mean by "locked the NFT"? At whose account is it? (reply to 48421)

User<1384034483>: The nft transaction is successful but it's writting that wait ton

K.: that writing alone doesn’t mean anything, can you send the transaction hash? (reply to 48429)

User<1384034483>: ee61bb0d5ea46fd93ff20d22bca8e6eb759577611a7c317fbe2a850a9bbc70b9

P000RI: Hi is there someone to help me?  I've sent my 10mil notcoin voucher to a contract address which is  EQB0rh9vFtP0siwaLEf1hSoI-HamnloH_j1V3eheS932H4E4  please help me to get it back  And this is my transaction ID  https://tonviewer.com/transaction/c5c3997b1f374110d6fc96e0510bf1e9003911a525161f28867c15e41c4c09e9  Please help me if there's anyway to get it back   And I own the single NFT which relates to that contract address  There should be a way because the contract address is editable  I would be grateful if you could give me a solution

K.: I don’t see anything odd with the transaction, the NFT now belongs to https://tonviewer.com/EQCLpumxLcV31yyCsw6Ifj8WRWoFh2MTiAFsH9X-X9gOy5p8 (i assume your address). So how exactly is it blocked? the address doesn’t have any balance so you won’t be able to do anything (reply to 48433)

K.: idk if i can help you any further

User<6861867033>: Hello TON chain experts!. I have trouble on sending jettons with secretKey with ton.js(not Tonweb)

User<1384034483>: UQCLpumxLcV31yyCsw6Ifj8WRWoFh2MTiAFsH9X-X9gOy8e5 (reply to 48438)

User<6861867033>: Please help me with sample code. (reply to 48440)

User<1384034483>: This is voucher address please check whether nft is mine or not please (reply to 48438)

K.: the nft belongs to this address (reply to 48441)

User<1384034483>: But in my wallet it doesn't show

K.: is your wallet address the same as you just pasted?

User<1384034483>: Yes this is my (reply to 48441)

K.: yeah so you have it

K.: i see no problem

User<1384034483>: But it doesn't appear in my wallet (reply to 48448)

MA: Hi guys,  I have this code for sending some Jetton now I want to add comment in it, how can i do that?  I am using tonsdk for python          _, _, _, wallet = Wallets.from_mnemonics(private_key.split(","), version=WalletVersionEnum.v4r2)                  wallet_address = self.get_token_wallet_address(from_address, contract_address)         seqno = self.get_seqno(from_address)          body = JettonWallet().create_transfer_body(             to_address=Address(to_address),             jetton_amount=amount,         )         boc = wallet.create_transfer_message(             to_addr=wallet_address,             amount=to_nano(0.05, "ton"),             seqno=seqno,             payload=body         )["message"].to_boc(False)         result = self.send_boc(boc)

K.: the wallet you are using might not see it 🤷 (reply to 48452)

K.: this is a question to the wallet devs then

User<1384034483>: Yes

User<1384034483>: Hey admin i want help (reply to 48425)

K.: this chat is for people developing on Ton, not specifically any project

K.: the “admin” you are referring to is just moderating this chat

User<1384034483>: Then where I can seek for help

K.: check who created the wallet you are using and find their support details

User<1384034483>: Bro the seller is saying I have locked my voucher if you send more money then I will unlock is that true

&rey: I'm not familiar with Notcoin but in 99% cases this is scam. Voucher is already on your wallet, there was just a scary comment "Wait ton". (reply to 48463)

User<1384034483>: Where I can seek help for this topic (reply to 48464)

User<1384034483>: Because the nft is not received yet in my wallet

K.: your wallet doesn’t have any TON, so technically it’s not operating right now. If you deposit some to your address you’ll then be able to do anything with the NFT (reply to 48463)

&rey: Have you sent NFT to @wallet (not TON Space)? (reply to 48466)

P000RI: Hi is there someone to help me?  I've sent my 10mil notcoin voucher to a contract address which is  EQB0rh9vFtP0siwaLEf1hSoI-HamnloH_j1V3eheS932H4E4  please help me to get it back  And this is my transaction ID  https://tonviewer.com/transaction/c5c3997b1f374110d6fc96e0510bf1e9003911a525161f28867c15e41c4c09e9  Please help me if there's anyway to get it back   And I own the single NFT which relates to that contract address  There should be a way because the contract address is editable  I would be grateful if you could give me a solution (reply to 48467)

&rey: No, there is no way to retrieve it. Editable NFTs are not that flexible. (reply to 48469)

P000RI: 😱 (reply to 48470)

MA: can anyone helping me in this question? (reply to 48453)

User<6861867033>: Hi hope you're doing great, Can you help me with the sending Jettons with @ton/ton(not tonweb?) (reply to 48470)

&rey: Have you read TON Cookbook on docs.ton.org already? (reply to 48473)

&rey: Does tonsdk (where have you found it, by the way?) support forward payload? (reply to 48453)

P000RI: I have the single NFT which belongs to this contract so can notcoin support convert this to 10 mil tokens for me in future? (reply to 48470)

User<6861867033>: Yeah but there's no code for ton.js only for tonweb. (reply to 48474)

P000RI: Ok so I'll hold the contract's single NFT until not release (reply to 48477)

&rey: If so, you may pass begin_cell().store_uint(0, 32).store_string_tail('...').end_cell() there + nonzero forward amount. (reply to 48476)

MA: yes but it will accept in bytes, I found it in one youtube tutorial (reply to 48476)

User<6861867033>: Can you help me with sample code? (reply to 48480)

&rey: Example: https://github.com/HipoFinance/contract/blob/d5b0d2eab0ff64a0b148c0e36acb61afac202b12/wrappers/Wallet.ts#L96 (reply to 48478)

&rey: I believe you will find it similar enough to port this to your jetton implementation.

&rey: b'\0' * 4 + b'your comment', but that has a highly limited length. (reply to 48481)

MA: this is worked thanks (reply to 48485)

Tse: Hi I’m looking into implementing minting whitelist for a NFT collection contract in Tact language. I’m wondering if any of you guys happen to know an open source project with similar functionality?

BTC25: Hello everyone 🤝, we, the TonMiner team, announced a token to me, and we need its development, games, NFTs and so on, we need active, purposeful people in our startup, I’m looking forward to it 🤝 write me in a personal message. .

mumu: How to add liquidity so that you can trade?

Тимур: Greetings, are there any developers here with experience launching ICOs with vesting and cliffing using Jetton? I've been tasked to finish an ICO by the end of April, but I only have a week's experience in it and read documentation)  Are there any working contracts or libraries in the public domain? Hoping for any help, thanks!

User<1384034483>: Hey admin how to run a debugging service in get gems

Mohammad: Hey guys I have a telegram mini app and I wanted to call getters of my contract. What is the best approach here?  Can I do this for free? What should I do?

Nikita: Hi guys, is there any way to use tonapi for tonweb provider?

Creator: Hi guys.  Can I calculate storage_fees by account address and how?   We have formula: storage_fee = (cells_count * cell_price + bits_count * bit_price)   / 2^16 * time_delta  for example:  wallet: UQBssjPV-McNyveYoCAiNlMNYwgSkPoJXrgeT2X6fJF_VEjw there is one input transaction. Like, I created a Web3 wallet for myself, threw Tons there for 50 bucks and want to keep them for 1 year, and then sell them.  Thanks for any advise!

K.: Have you checked this out?:  https://docs.ton.org/develop/smart-contracts/fees#calculator-example (reply to 48494)

Creator: Sure. But how can I calculate size?

K.: I am pretty sure some explorers show the size of the contract.

K.: But AFAIK a wallet is a small contract, so the storage fee for it shouldn’t be big.

Creator: Thanks. this is just an example about smal size.

Kenny: what is V4R2?

Creator: Wallet version. (reply to 48500)

Creator: mnemonics, pub_k, priv_k, wallet_1 = Wallets.from_mnemonics(     mnemonics=mnemonic_for_path_1,     version=settings.wallet_version,     workchain=settings.wallet_workchain ) x = wallet_1.create_state_init() s = wallet_1.options for key, va in s.items():     if key == "code":         value = va.bits         print(value.get_used_bits()) # 80  for key, value in x.items():     if key == "code":         print(value.bits.get_used_bits()) # 80     elif key == "data":         print(value.bits.get_used_bits()) # 321     elif key == "state_init":         value = value.bits         print(value.get_used_bits()) # 5   How do you think, sum of values (80 + 321 + 5) is size of WalletContract? (reply to 48495)

Captain: Hello guys  We are trying to Move from Sol to TON and i really don't know so much. I heard i will get alot of support here.  We intend building An NFT collection and an NFT market place with some unqiue functionality

_chocolate.py: can i send simple transfers to deployed contract via blueprint ?

K.: yes, just add this functions under scripts folder and blueprint can run it (reply to 48505)

_chocolate.py: i try to run this code but don't know where the contract address (reply to 48506)

_chocolate.py: i want to test with another wallet to send transfer to this contract address

_chocolate.py: Is address of contract in "compile()"

_chocolate.py: and how i can sure that is the same address every run

&rey: Nope. You need to check size of full account state that includes balance. You can use explorer.toncoin.org. (reply to 48502)

&rey: In Counter.createFromConfig({}, ...). Contract address is deterministically constructed from code and data. (reply to 48509)

Creator: For calculating should I use Workchain or Masterchain coefficient? It have different price per kb (reply to 48511)

&rey: You take that from account address. Normally, that is basechain. (reply to 48513)

Zzz: Hey guys, I need a TON Developer for my project, anyone available ?

Zzz: Same here, i need ones too, please drop me a message if you' (reply to 48516)

Haq: Guys to I try to create a new wallet for testnet on Tonkeeper on iPhone app but after clicking “Testnet Account” nothing is happening. Anyone had this issue or anyone now how to handle it?

Chester: close app and reopen (reply to 48519)

Haq: No way… is working. Thx!  Soo silly bug. (reply to 48520)

Adi: Hello, I'm having a problem, I sent it to the address and it was successful, the problem is that I didn't give a memo. can i pray it back then send it back with a memo?

Adi: anyone help me, otherwise I will lose my money

K.: you cannot revert a transaction anymore, but you can contact the exchange support and ask them about the situation (reply to 48523)

K.: provide the address you deposited from and any other info

Charlie: Hello I need help about an issue that comes oftenly. When I'm trying to connect my wallet to the Stakee App I have this error . Did you know how I can resolve this to avoid this kind of error in the future ? Thanks community

Sumit: any help? (reply to 48409)

Flyheck: how can i get active auctions on fragment/.ton from my application on react?

Haq: Seqno ✨ Guys I have questions 🤓  What is the best way to ‘getSeqno’.  I’m using TonClient and I need a wallet object with type ‘Contract’ to open contract and then be able to use method ‘.getSeqno’ what is the best way to get it from address of wallet which is connected to DAap with TON-Connect?

Sergey: https://github.com/orbs-network/ton-access (reply to 48531)

Haq: But which approach?  I’m using Orbs for the endpoints  .  Probably I miss some utils for get Seqno from already connected wallet address. (reply to 48532)

Mr: The only way contact exchange.   Write to support aur live chat if available on your exchange. Or open ticket must add transactions I'd and write detail about your issue. Once I had same issue on binance after contacting support my issue was resolved. (reply to 48523)

Mr: He just added comment which is not a lock. But I can suggest you something which can be helpful to avoid fear. Create a new wallet for yourself and try sending your nft to new address you will see it's not a lock (reply to 48463)

User<1384034483>: Ok (reply to 48535)

— 2024-04-05 —

User<5110219069>: How much is

Barbell: Hi how I can get status code from ton http api v2 getTransactions

Barbell: there is no such as thing as status code or exit code

Mark: Hi, how i could see balance of an address. I get the balance and its in Promise <Big Int> type

Mark: Use fromNano() but its say not found

Khang: Hi guys, is there any change that I could base on ton blockchain smartnode, something like ton-docker-node, mytonctrl on git, but making changes in configs to run like a private node for my own 🤔️️

Mark: Eh forgot to import fromNano() from ton lib (reply to 48541)

User<5901725413>: Hey, how can i listen for new swaps on dedust/stonfi. Is there any api for this?

User<5901725413>: Also, how to easily get dex info of a token, like lp size, and so on without checking and comparing between stonfi and dedust sdk just some direct way to get it (reply to 48546)

Haq: Hey, but if you are getting “Promis….” That’s mean you didn’t wait for response from async call. You are lack of key word “await” from   ‘ const balance = await client.getBalance(wallet.address)  ‘  And also your function on the beginning need to be declared like a async one. GL (reply to 48541)

parker: Who can tell me which Chinese development group is

parker: Thank you so much

Capitan: Hello. Please help me. I moved my project token from the erc 20 network to the ton network via a bridge. How do I change to my project logo?

K.: https://t.me/tondev_zh (reply to 48550)

K.: try this then: t.me/addlist/1r5Vcb8eljk5Yzcy

K.: It has the Chinese chat included

parker: Thank you so much

parker: why

parker: I want to use header Java to process query blocks and send transactions. Do I need to build a node myself? What nodes are currently commonly used in production?

&rey: You cannot do that since you don't hold ownership over that token in TON. (reply to 48552)

Heydar: so , if we have same code and data like another person in the world , the address will be same?

Heydar: for example people learning hello world in block chain and all deploying same code, so the addresses that they will generate should be same?

&rey: This is true. So you need to include variable like time in contract. (reply to 48566)

Nguyen🦴🆓: Bad UX Design Fails Scroll to hell...

&rey: This is also useful: if two contracts have same code and data, they behave same, so why splitting assets. (reply to 48567)

Nguyen🦴🆓: The infinite scroll is not good . Have to change to pagination view.

Heydar: and cause of this issue all nodes should save extra storage? however it can be a benefit too. and if someone didnt consider , or all be same , what happen when it's deploying on the chain? (reply to 48567)

&rey: Money used for deploy will be added or bounced depending on the program. (reply to 48571)

Heydar: and sorry another question so now if some conracts want to tell lie to another contracts, it can and another contract cant believe that?(so all people should be developer to detect lies)  and also can we see ton balance of another contracts without message it?

&rey: 2. Contracts are fully isolated, so no. (reply to 48573)

Heydar: Thank you (reply to 48574)

Heydar: what's the communication protocol between the contracts is that using protobuf on grpc?

&rey: Messages packed in cells. (reply to 48576)

Heydar: so how they receive messags? (reply to 48577)

Heydar: what's the protocol via interent? (peer to peer)

&rey: recv_internal/external (reply to 48578)

Heydar: I mean low level (TVM maybe)  the main protocol that transmitting the data_binary data (reply to 48580)

&rey: Contracts are stored in blockchain, and messaging is implemented in validator node. (reply to 48581)

&rey: Blockchain synchronization uses TL + ADNL.

Heydar: 🙏🏽🙏🏽 got it, so when a data while is exchanging between validators, how it's done? it should use some standards, like TCP/UDP, on some protocols like RPC/DDS/... (reply to 48582)

&rey: Usually the contracts trusted are subcontracts with known code. (reply to 48573)

&rey: ADNL over UDP. (reply to 48585)

&rey: docs.ton.org for reference.

Heydar: Thanks, how it can be sure that the message received then! (reply to 48587)

&rey: You are mixing up contracts and validators. (reply to 48589)

Heydar: your right, I think Im asking wrong question, I will search more about it, Started by this link: https://docs.ton.org/learn/networking/adnl (reply to 48590)

musashi: hi guys, how to store tupple as value in hashmap using FunC?

Pho: Why some tx could be finalized and show on tonviewer sooner than the other one?

Pho: How can I speed up the finalization of a tx

Heydar: it should be done by smart contracts code manually? or it's done underhood? (reply to 48567)

&rey: Store its values... (reply to 48592)

&rey: Manually. (reply to 48595)

&rey: What do you mean by "finalized"? (reply to 48593)

&rey: External messages are included in indeterminate order. To make them faster by half a block, you need own validator.

&rey: Internal messages are processed deterministically, but cross-shard delivery is quite slow at the moment.

Joy: How do you launch a token on TON ?

Сергей: Hi, do somebody use/know any wrappers for highload wallet on js?

Dexter: https://github.com/tonlabs/ton-client-js (reply to 48605)

Сергей: I need to send more than 4 transactions simultaneously from one wallet on a Node.js server. To do this, highly loaded wallets are implemented TON, for which I need a wrapper or library for high-level interaction which i`m searching (reply to 48606)

Dexter: https://github.com/scaleton-labs/highload-wallet (reply to 48607)

musashi: i'm building a Presale contract for a Jetton and using hashmap to store amount bought buy each user

musashi: is it ok to store like 100k users info?

Raden0x: hey guys i keep dealing with this error:  app-index.js:35 Error: [TON_CONNECT_SDK_ERROR] ManifestNotFoundError: Manifest not found. Make sure you added tonconnect-manifest.json to the root of your app or passed correct manifestUrl.  i am running a NextJs project to wrap around my main.. but still dealing with this issue.. what is considered the root of the project for a next js project? the root root or the public folder? but even so for both it keeps giving me this error

Raden0x: you can see here thats the root

won: https://tonviewer.com/transaction/b5e6329a7a5a8e3024052217311003e2fbafc59d1fb3c83ae0a5144208d9aa4b Hello, what is the reason for error (exit code 705)?

Dexter: the tonconnect-manifest.json file is in the same directory as the package.json file. (reply to 48612)

Raden0x: you can see in the pic below thats where it is at (reply to 48615)

Raden0x: so why is it still giving me this issue -__-

Raden0x: ive also read, that it needs to be in the public folder for static assets

Dexter: yes, is manifesturl accurate? double-check that the url points to the correct location of the manifest file (reply to 48616)

Raden0x: fixed it

Raden0x: needs to be in public folder for nextjs

musashi: i'm building a Presale contract for a Jetton and using hashmap to store amount bought buy each user (forwarded from musashi)

musashi: is it ok to store like 100k users info? (forwarded from musashi)

musashi: anyone know guys?

musashi: i tested my contract with 10 users and it still works well

Doge: How to creat a meme Token in TON blockchain

musashi: use ton minter bro (reply to 48627)

Doge: Thanks bro (reply to 48628)

K.: It might still work even with 100k users but the problem you will face at that point is the storage fee. TON is scalability-first, so building large contracts (storage wise) is discouraged. (reply to 48626)

musashi: ah I see

musashi: so for each tx I have to charge my user more fee, right?

Doge: How to burn LP

K.: it will happen automatically because of how the blockchain works (reply to 48633)

musashi: ok I will try to use the same architecture as the jetton minter - jetton wallet (reply to 48635)

K.: with how low the fees usually are, at some point they'll become to large to make sense

K.: Check this ICO/presale contract example: https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter-ICO.fc  Might be useful

musashi: thanks sir

Nxrix: is there anyone who can make a small and simple smart contract for 1 ton?

Doge: HI everone, help How to burn LP How to lock LP Thanks

musashi: u should read the stonfi contract repo (reply to 48645)

Doge: Thanks (reply to 48646)

musashi: https://github.com/ston-fi/dex-core

Heydar: I like this man ,  I think it's first time his tutorial on videos(just I'm guessing), but exactly he is best body I remember in teaching , so clear talking and nice teaching! and very understandable explanations!❤️❤️❤️👍🏽

Haq: Can you share link? (reply to 48652)

Gary: Hello everyone, does anyone here know if there is a token holder snapshot tool available on TON?

Oak Investor®: Hi! Is there any documentation out there how to implement wallet connect into tg app?😌

Yannis: Hey guys, how do I create wallets in bulk?

chals: Helo yuor may ferands

Heydar: https://stepik.org/course/176754/syllabus (reply to 48653)

LEGION_MASTER $LGN24: Hello guys! Can somebody help me? Please. Im trying to make app right now and got a problem with resolution. Is there any docs about this topic? Cant find it by my self. For example. I wanna make +- the same resolution like mobile version on pc(should be lil biger than on phone). Do somebody had this "problem"? How can i manage resolution for pc which i need?

— 2024-04-06 —

won: Hello, How can I find jettonwallet address of highload wallet?

Raden0x: Does anyone know if there is a way to fetch if a user has accepted to connect their wallet to your application?

Raden0x: Like is there somewhere to grab a signature

_chocolate.py: how can i random a number and save it to dictionary on funC

_chocolate.py: i tried but not works

Heydar: in ether(solidity) when you using getters method you dont pay anything  but in TON because you should pay and the main cons was that to having scalability, is that right?

_chocolate.py: getter no fee

Heydar: in TON? even from another contracts? (reply to 48674)

_chocolate.py: only interal message has fee

Heydar: and how about external? (reply to 48676)

_chocolate.py: https://docs.ton.org/develop/smart-contracts/fees (reply to 48677)

Launch: How to Call a Smart Contract Function in Python

User<6126125525>: please help me...

Dario: Use another wallet, check out tonkeeper (reply to 48680)

Dario: That's a very old one

User<6126125525>: Before I speak, I'm using ChatGPT because I'm not good at English. I bought toncoin in December 2021 and stored it in my wallet. However, when I checked now in 2024, the toncoin is gone. Could it disappear if it's been a long time? (reply to 48682)

User<6126125525>: my 300$…

User<6126125525>: 😭

Haq: Guys, can someone help me?     I'm trying to get the Seqno number from wallet which already existed.   I found that TonWeb lib gives you the option, with a wallet address you can create an object and then trigger the inner method to get it but I'm getting "null".     tonweb.wallet.create() - I try with wallet V3 and wallet V4 address and is the same.     Some ideas on what is wrong or other options to get Seqno after the user connects the wallet in DAsp?     Thanks for any tips/suggestions

Mohammad: Hey guys What should I do to avoid seeing that SCAM symbol next to my jetton?

Louis: Hello everyone, I want to create a Telegram bot like @tontracker_bot, updating the balance and transactions from my wallet in real-time. Could someone provide me with documentation?

User<6952362368>: Good afternoon  In have a HTML 5 game. I have been able to make it a telegram app and integrated TON connect. But I want to tokengate it. I don't want users to be able to play it if they don't have a certain nft in their wallet and I want them to earn some of jusdt when they have finished playing the game.

Sul: Hello friends How to make a token verified?

&rey: 1. Have a project with some utility 2. Send PR to Tonkeeper's repository https://github.com/tonkeeper/ton-assets/. (reply to 48711)

Sul: can you be a little more detailed, I'm new to this 😅 (reply to 48712)

&rey: This casts doubt on whether your token needs verification. (reply to 48713)

Sul: I'm learning how to do all this, please explain (reply to 48714)

Sul: I made a token for testing using mintor

Adam: https://tonviewer.com/transaction/f642de60228a2d48d3cef6a501b19c6dfc0eb3bd7afb7effd32c5e31c630fe4c

Adam: Any idea why this fails guys

&rey: Verification is not normally given lightly (without reasons) by explorers. (reply to 48715)

Nick1368: hi bros, can someone show me how to lock token but dont use Tonraffles services, please

Sul: if you don't want to help then keep quiet (reply to 48719)

||#*™sman: Good luck bro, how do I send bulk coins to wallets?

Heydar: is the op code same as enum in c++?

Vahid: In general, yes (reply to 48723)

Heydar: Thanks dadash ,  the main difference is just it is magic number 😐 and dirty syntax in func. (reply to 48724)

Vahid: check this maybe this can help you  https://blog.ton.org/ton-payments (reply to 48722)

Vahid: As @pcrafter said  You need to Pull Request on tonkeeper repository ! ( read more about Pull Request in github )  this is tonkeeper repository :  https://github.com/tonkeeper/ton-assets/ (reply to 48711)

Vahid: Hey check this   https://docs.tonconsole.com/ (reply to 48709)

Vahid: Hey What is your jetton symbol ? (reply to 48707)

Louis: thanks very much🙏🙏🙏 (reply to 48728)

Amirlan: Yo guys where is the best tutorials for ton developers?

Sul: Он про то что токен не проверен (reply to 48729)

Roman: http://tonhelloworld.com https://stepik.org/course/176754 https://docs.ton.org https://answers.ton.org (reply to 48731)

Kos: Hey team! Is there somebody who is in competence to answer questions related to Ton Grants program?

Vahid: Hey maybe this can help you : @tonsociety_chat (reply to 48736)

Kos: thanks, appreciated will try (reply to 48737)

Heydar: diving in the TON is really so hard for me to understand , I think the problem is cause of that I was not starting with Ether and Solidity ... what do you think?  maybe it's really hard and need very huge efforts , its not cause of that reason I said.  what's best road map? can someone help me please ... Im just a c++ software engineer, and I just want going on through TON blockchain and smart contracts.

Vahid: Ok What is your problem now ? (reply to 48740)

Vahid: If you want to learn smart contract, It's better to start with simple task  A counter contract is a simple task (reply to 48740)

Vahid: @FuncHacker  FunCHacker ? (reply to 48740)

Heydar: It's easy for me now I mean complex terms ... like Jetton  wallets Any hard words :D (like mint, token verification, challenges after deploying , etc) (reply to 48742)

Vahid: It's not hard if you learn fundamentals   What part of jetton and wallet is hard ? (reply to 48744)

Navajjoo: Hello guys. What is workChain number for TON?

Navajjoo: For testnet is -1 or 0 ?  Currently, only the masterchain (workchain_id=-1) and occasionally the basic workchain (workchain_id=0) are running in TON Blockchain Network. Both of them have 256-bit addresses, so we henceforth assume that workchain_id is either 0 or -1 and that the address inside the workchain is exactly 256-bit.

Heydar: Thanks, I will create some UML tomorrow , I will show which parts is hard for me.  I have so many questions , but I thought asking them is not good idea here, because we have so may experts here. (reply to 48747)

Vahid: Did you read this ?  https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons (reply to 48750)

Heydar: nope, so let me read this , review my questions , and then ask mt questions about it. (reply to 48751)

Heydar: when we deploy a contract, at the first stage we upload a code to a address, what's that address? where it's placed? the address. I read something that telling about some tables. so where is the table? (the ip address I mean)

Vahid: Hey, Check this  https://blog.ton.org/what-is-ton-a-beginners-guide-to-the-open-network (reply to 48748)

Navajjoo: thank you (reply to 48754)

Vahid: we do not deploy a contract to a address ! the address is created according to the contract itself, even before deployment, it can be obtained  check this  https://docs.ton.org/learn/overviews/addresses (reply to 48753)

Heydar: so when you want to migrate from local to the blockchain, you should upload something , is that right? what we will upload? and where we upload? (reply to 48756)

Muyiddini: Yes (reply to 48757)

Vahid: You entered to this blockchain with a mentality outside the blockchain and you are comparing everything with non-blockchain systems. (reply to 48753)

Vahid: some of your question is in TVM we are upload the compiled contract to blockchain (it's kind of transactions that upload the contract and .... ) (reply to 48757)

Heydar: ah ok, so we should do that from a wallet? (reply to 48760)

Heydar: I know my questions have so many problems , i just want to rearrange data in my mind sorry

Vahid: Yes (reply to 48761)

Heydar: and what's the difference between validators and ndoes?  who will run the contracts instruction that we deployed?

Vahid: Full Nodes: These nodes store the entire blockchain history and execute smart contracts whenever a transaction involving a contract is submitted. They independently verify the execution and the resulting state changes.  Validators: These are a subset of full nodes responsible for validating new blocks and adding them to the blockchain. They rely on the consensus of all full nodes regarding the validity of smart contract execution. (reply to 48764)

Vahid: https://docs.ton.org/participate/nodes/node-types

Heydar: Thank you so much ❤️ , and that node doing first stage validation not finilize the transactions (I forgot its name) , is that full node too? grouping them was shards , is that right? ok let me read the links you shared , and again I can ask.  thanks. (reply to 48765)

Vahid: shard is a different term !   https://medium.com/@thedailyton/the-main-feature-of-ton-sharding-in-simple-terms-4dfc30838e24 (reply to 48767)

— 2024-04-07 —

N - RFNW: Is there any documentation or samples on building a game on telegram? I need it

Vladimir: https://core.telegram.org/bots/webapps (reply to 48770)

N - RFNW: Many thanks (reply to 48771)

Mark: The testnet.tonscan doesn't display nft, while the testnet.getgems and ton keeper display the nft of address

Deemaz: Hi there. I lost one of 24 seed word of wallet from 2022 :)  I even can guess that is in 2nd half of frase.  Anybody help me with script?  There should be 100 tons.  Reward: 25 Потерял сид слово  от старого кошелька.  там 100 тон, кто нить может помочь подобрать слово?. Знаю даже что оно потеряно где то во второй части всей фразы.

Deemaz: Or maybe somebody knows, where I can find a solution (reply to 48778)

LeeMinThien: Hi I'm looking for some instructions on create smartcontract on TON in english like a youtube tutorial. Can anyone recommend me some refs.

Vahid: Hey Check this  https://docs.ton.org/develop/overview (reply to 48780)

Vahid: Hi what wallet did you use ?  this is list of the words of tonkeeper wallet : https://github.com/tonkeeper/wallet/blob/develop/packages/%40core-js/src/utils/mnemonic/bip39.ts (reply to 48778)

K.: You can use something like this:  import { getHttpEndpoint } from "@orbs-network/ton-access"; import { mnemonicToWalletKey } from "@ton/crypto"; import { WalletContractV4, TonClient, fromNano } from "@ton/ton";  async function main() {   // open wallet v4 (notice the correct wallet version here)   const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)   const key = await mnemonicToWalletKey(mnemonic.split(" "));   const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });    // initialize ton rpc client on testnet   const endpoint = await getHttpEndpoint({ network: "mainnet" });   const client = new TonClient({ endpoint });    // query balance from chain   const balance = await client.getBalance(wallet.address);   console.log("balance:", fromNano(balance));    // query seqno from chain   const walletContract = client.open(wallet);   const seqno = await walletContract.getSeqno();   console.log("seqno:", seqno); }  main();  Just turn this into a loop that would swap your missing word with ones from a list. I am not sure what list of mnemonic words did your wallet use, but I think this should be fine:  https://www.blockplate.com/pages/bip-39-wordlist  EDIT: Here's a better list: https://github.com/tonkeeper/wallet/blob/develop/packages/%40core-js/src/utils/mnemonic/bip39.ts (reply to 48778)

K.: As a side note, if you know what word specifically is wrong, then it will take just 2048 tries to get it. But if you don't, then the number of tries grows to the point where it mathematically will take a VERY long time.

Фарух: how i can start programming apps on TON platform and were i can find useful infomation  about this?

Deemaz: I'm almost sure that missed word at second part. From 12 to 24 (reply to 48784)

Deemaz: Actually even from 16 to 22 :) (reply to 48786)

K.: Trying 2048 words in 12 positions will take 5271537971301488476000309317528177868800 tries (reply to 48786)

Deemaz: Are you sure? We don't need to find the rest of words, only 1 in 12 positions. 12x2048=24576. Seems real to find (reply to 48788)

K.: 16 to 22 is a less of a number, but still a lot :) The computational power required for this is big.

K.: Yeah, you are right it's 25k (reply to 48789)

K.: Finding a free HTTP provider that will serve 25k requests from a single IP within a small period of time is a challenge in its own.

Deemaz: But, I don't know how to use  code/script, at all.. if somebody can help me, please dm.  25 ton (reply to 48789)

Twayne: hey hey guys! can somebody understand how to toggle bounce flag? https://gist.github.com/satanworker/0f953f616085fcc559d90440d9cc5952 When I send transfer if it fails it never bounces back and the money is jsut wasted

Mahdi: Hi everyone Do we have MultiSig in TON? How can I create a treasury fund for a collective of people who want to decide about allocating funds to different initiatives?  Do you know a method for that?

Vahid: Hey  check this https://github.com/ton-blockchain/multisig-contract-v2 (reply to 48795)

wikig: Hello guys ! Is there any service like Gas-station or AA in TON ?   Is there anyway for me to pay the transactions for another account  ?

Haq: Guys how you will describe in the easiest way the difference between FunC and Tact but in high lvl understanding. Also when to use and which one?

Vahid: What is it ? (reply to 48797)

wikig: Via solana , i can require a signature from account A , and then , send out transaction by account B . (reply to 48799)

wikig: Via evm , i  can setup an abstruct account for account A , and require account A to give a a singature . then i can help account A to pay the transaction of acbstruct account .

wikig: To slove the problem of new user to this chain have no gas to boardcast it's transaction .

K.: Both of them are languages that compile into a low language understood by TVM. Tact is easier (subjective) and actually compiles into Func. (reply to 48798)

wikig: And i wonder if TON chain have similar solutions or not .  Because the account abstruct is native in TON chain , i notice that it have many different account types  V3R1 V3R2 V4R1 .... And the first transaction of new account will auto init the account . So i think it is sth like abstruct account or contract account , which means it should have a way to prepaid gas of a transaction by sign .

Haq: Thanks for your answer 😊  I also think Tact is easier and I'm wondering if it has any limitations in order to build some big project or do some complex operations. (reply to 48803)

Vahid: it's interesting But did you know the contracts can pay the fee ?  users can send transaction without paying fee and contract can pay by itself !  I think that the Gas-station or AA you mentioned is built into wallet version 5, I'm still not completely sure, I have to check them (reply to 48802)

K.: I am fairly sure that Tact is still in active development, but it’s likely that soon it shouldn’t matter which one you chose. I personally only use Func because of its C-like style and also all of the docs are written for it :) (reply to 48805)

Tse: TON allows external messages,  so it is possible I guess. I think you should be able to deploy a smart contract with TON balance which accept and forward the message from any users (not necessarily an account) (reply to 48800)

wikig: Sounds great , i am still reading the docs of TON contract development .🫡 (reply to 48806)

wikig: And then , verfiy the signature on-chain (If that's possible) . If it works , we can prepaid the gas for user's transactions & contract-send . (reply to 48808)

Heydar: npm ERR! code ERESOLVE npm ERR! ERESOLVE unable to resolve dependency tree npm ERR!  npm ERR! While resolving: Multiowner@0.0.1 npm ERR! Found: @ton/core@0.54.0 npm ERR! node_modules/@ton/core npm ERR!   dev @ton/core@"^0.54.0" from the root project npm ERR!   peer @ton/core@">=0.49.2" from @ton/blueprint@0.15.0 npm ERR!   node_modules/@ton/blueprint npm ERR!     dev @ton/blueprint@"^0.15.0" from the root project npm ERR!  npm ERR! Could not resolve dependency: npm ERR! peer @ton/core@">=0.56.0" from @ton/ton@13.11.1 npm ERR! node_modules/@ton/ton npm ERR!   dev @ton/ton@"^13.10.0" from the root project npm ERR!   peer @ton/ton@">=13.4.1" from @ton/blueprint@0.15.0 npm ERR!   node_modules/@ton/blueprint npm ERR!     dev @ton/blueprint@"^0.15.0" from the root project npm ERR!  npm ERR! Fix the upstream dependency conflict, or retry npm ERR! this command with --force or --legacy-peer-deps npm ERR! to accept an incorrect (and potentially broken) dependency resolution.   and also I did npm audit fix —force

Heydar: can somebody help me?

wikig: What have you run before ? (reply to 48812)

Heydar: I just ran few projects. and now in this new project I just did this: npx blueprint built  npx install npx blueprint built  npx audit fix —force  ... (reply to 48813)

wikig: Hello , is there anyone know about how to sign a message using Tonconnect  ? I follow docs :  https://docs.ton.org/develop/dapps/ton-connect/sign And build this function . But seems like i can't call up the wallet for sign ( The wallet is able to called up for connect already )

Heydar: played with these commands

wikig: have the node-version / npm -version been checked  ? (reply to 48814)

Heydar: yeah, latest version is installed too.

wikig: @ton/core@0.54.0 and peer @ton/core@">=0.56.0" from @ton/ton@13.11.1  Seem like the dependences version confliect (reply to 48811)

Behrang: These are not account types, but wallet versions. Wallet V5 by Tonkeeper will have support for such functionality:  https://github.com/tonkeeper/w5/blob/main/Specification.md#can-the-wallet-outsource-payment-for-gas-fees (reply to 48804)

wikig: WoW , looks wonderful , then i can just wait for the V5 wallet and use it . (reply to 48820)

User<1691331052>: With help of you and TON tutorials I've created my first project: https://earnplaying.org/ If any of you needs help, you can DM me

Heydar: How I can delete all of them and install again? (reply to 48819)

User<1691331052>: Delete nodes modules folder, set correct versions and packages inside package.json, run npm install afterwards

Heydar: in the project folder? or in system-wide? because I did that in project directory , and didnot work (reply to 48824)

User<1691331052>: In project directory, I DM you and will try to help you (reply to 48825)

Heydar: thanks (reply to 48826)

Heydar: Thank you so much for the help. (reply to 48826)

?*10^∞: hi frens. i am looking for an expert to develop a TON app like Notcoin in terms of functionality and core mechanics.   is it the right place or maybe there are some chats specialized for recruiting in the ecosystem?  any help/advise/DMs with info about u will be much appreciated

Heydar: what's default initialization for the variables in load_data in func? do they have initialization values?

.: Hi , where can I find the tl-b schematic for forward_payload?

LeeMinThien: Can I store a string to wallet contract?

K.: you can initialize those values when deploying the contract - just make sure to include a Cell in the deployment message formatted correctly (reply to 48831)

Heydar: if I dont do that, what's the value? (reply to 48834)

K.: Nothing is then stored there

Heydar: wait , I can ask better with code:  slice ds = get_data().begin_parse(); theDataBool = ds~load_bool();  in the recv_internal I do that, first time I load the data, what's the value? it does not have any default value?

Vahid: it's not like c++ ! 😄  But it would be interesting if the data inside the memory could be seen, like C++, which can be traced (reply to 48835)

K.: If you didn't deploy the contract with initial data or haven't used set_data before to set that value - then there should be nothing

K.: It won't exist

Heydar: thanks, for the guide.

Vahid: every contract has limit storage, and you must control the data So it doesn't matter if the data has already been saved or not, you request to read, for example, 3 bytes of data, if the data is already there, it will get the data, otherwise it will give you zero(i'm not 100% sure about zero but 99%, One percent because you doubted me).

Heydar: because of that Im confused when we do the init transaction, we just use fc code, but in local when working with typescript it take init data too(Im not sure I learned correct or not) so when in recv_internal we loading data from the storage, what's the default value for first time ? (reply to 48842)

Heydar: sorry if it's not good question

Vahid: The default data is always send, because if there is no initial data, the contract address will not be created! (reply to 48843)

Vahid: check this  https://docs.ton.org/learn/overviews/addresses

Heydar: your right, thanks (reply to 48845)

.: Hi , where can I find the tl-b schematic for nft_sale_v2?

&rey: If you have deployed contract with empty data, the loading will fail. (reply to 48837)

Jimmy Becen: hi guys how to generate error code from string. for example: /*      NFT Auciton Market Error Code :     3724: Bid doesn't meet the minimum increase requirement     11017: Contract is already initialized     19941: Only owner can build nft auction contract     20805: Only owner can init auction end time.     20844: BuyNowPrice must be greater than reservePrice   */

Hàn Lập (😇,🪽): tonweb by default is deploying wallet_v3r1, how to deploy wallet v4?

&rey: 1. Are you sure you need wallet v4? 2. tonweb.wallets.ALL.v4r2 (reply to 48853)

Hàn Lập (😇,🪽): nah, just for learning purpose. thank you (reply to 48854)

Yannis: Hey guys

Yannis: How can I know the cheapest times to send transactions on TON?

Dmitry | backend4you.ton: every time. in TON, fees are fixed (reply to 48857)

Yannis: When I put liquidity it says between 0.2-1.3 TON

Yannis: What is that based on?

Kamil: Hi, I have a similar question, when trying to swap in myspace wallet between wNOT and TON it gave a range for gees between 0.07 to 0.3 ton. I tried swapping 3 times, all of the transaction ended up failing (although the wallet interface showed confirmation) and fees were deducted every single time. How is this normal?

Kamil: And how can I ensure that the transaction goes through (knowing that I put slippage to the highest, amount was average, and the gas fees were at the top of the range , 0.3 ton each time)

Yannis: What can I use to see the network congestion levels?

Heydar: Sorry , do we have a function that just run in initiating the contract?(when sending init data)

Heydar: to prevent deploying contract. (reply to 48864)

Heydar: atually I want to bounce back and throw error in deploying in some situations, that is checking some data in deploying  is that possible? (reply to 48865)

Heydar: When receiving a message (recv_internal), because the network layer is doing that in an async way, will the messages in the contract  be queued? and consuming in one thread? or the recv_internal will execute in an async way? (for example, two messages are processing simultaneously).

Daniel: What variable in TON Connect holds the actual wallet address?

— 2024-04-08 —

Ton: Hello, I am studying TON tutorials and have a question I'd like to ask (I'm just starting to learn): 1) Store in c4 the address of the sender of the last message and the integer total - a 32-bit unsigned number; 2) When receiving an internal incoming message, the contract must take the address from in_msg, a 32-bit unsigned integer from the body of the message, add it to total, and store the address and amount in the contract data; 3) The smart contract must have a get_sum method that allows you to return the total value;  Here is my code:  #include "imports/stdlib.fc";  () recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {     slice cs = in_msg.begin_parse();     int flags = cs~load_uint(4);     slice sender_address = cs~load_msg_addr();     int num = in_msg_body.load_uint(32);     set_data(begin_cell().store_slice(sender_address).store_uint(32).end_cell()); }  int get_sum() {     slice ds = get_data().begin_parse();     slice ds = ds~load_msg_addr();     int num = ds~load_uint(32);     return num; }  Questions: 1. Does each message have a flag? Are they all 4 bits? 2. Should in_msg_body contain only data and no address? 3. There is a problem with int num = in_msg_body.load_uint(32); when compiling. 4. Is my get_sum method correct?  Can any expert please help answer these questions? Much appreciated.

Danil: https://www.youtube.com/watch?v=sv3m6BBqKSw&ab_channel=TON-TheOpenNetwork

Danil: Today, we have a packed schedule of presentations related to TON. Below is the agenda:  Schedule Bootcamp Demo Day  10:00-10:05 — Opening by Nina小耳朵, Co-Founder of Knowhere Media  10:05-10:13 — "Universal Basic Phone: Using Blockchain to Achieve Digital Equity for Everyone" by Howard, CEO of Oyster Labs  10:13-10:21 — "Building the Infrastructure for Liquidity Distribution on TON" by James, Head of BD at Tradoor  10:21-10:29 — "Empowering the Entertainment Industry with Web3 on Telegram" by Luke, Founder of TONTIX  10:29-10:37 — "No Code Deployment on TON via Telegram" by Charles Tan, Chief Strategy Officer at Xircus  10:37-10:45 — "Unveiling the Power of Social Commerce in Telegram" by HM, Founder of BountyBay, focused on the Asian Community & Early Adopters  10:45-11:05 — Inscription Panel with Lucas, Founder of TONOT; Alex, Contributor at FairTON; Maxwell, Core Contributor at TownSquare Community; and Vivi, Lead of Research at APAC TON Foundation  11:05-11:20 — "Tonkeeper and TonAPI: Making TON Technology User-Friendly for the Masses" by Oleg Illarionov, CPO & Co-founder at Tonkeeper  11:20-11:30 — "TownSquare Community: Boosting The Mandarin-Speaking TON Developer Ecosystem" by Maxwell, Core Contributor at TownSquare  11:30-11:45 — "Launch Any Game on Telegram" by Daria Novikova, CPO of TON Play  11:45-12:00 — "TON's Achievement in Asia and TON Society HK" by John, Lead of APAC TON Foundation, and Jessie, Lead of TON HK Society  Intro to TON Ecosystem  13:30-13:45 — "TON – The Web3 in Telegram & Incentive Program" by Steve Yun, President of TON Foundation, and Anthony Tsivarev, Director of Ecosystem Development at TON Foundation  13:45-14:10 — "Wallet in Telegram" by Andrew Rogozov, Founding Member of TON Foundation and CEO of TOP labs  14:10-14:25 — "TON for Developers: Build Your Next Killer App" by Xiu, Ecosystem Marketing Lead at TON Foundation  14:25-14:40 — "TON's 2024 Roadmap & Asian Expansion" by Dr. Awesome Doge, Founding Member of the TON Core Dev Team  14:40-14:55 — Panel Discussion with Steve Yun, President of TON Foundation; Andrew Rogozov, Founding Member of TON Foundation and CEO of TOP Labs; and Jack Booth, Director of Marketing at TON Foundation

Ton: @pcrafter @AnswersTonBot (reply to 48871)

&rey: Messages are processed in way that guarantees that they are atomic. (reply to 48867)

&rey: Have you already read about the diff between ~ and . ? (reply to 48871)

&rey: connector.wallet.address for SDK (reply to 48868)

NEFRAMOCH: Guys, please who's present at the TON Web3 festival in Hong Kong or know a friend present.

Ton: not yet. Where can I check? (reply to 48877)

kevin: Hi, any body how these transaction are related, what is the pattern?

kevin: https://tonviewer.com/transaction/d9e89512d9799eccda778bb8de005ebf7d7d99e5d49dc5fd8112cffb5296cc5a?section=trace

Classifiedweb3: Can you tell me more ? (reply to 48710)

Classifiedweb3: Did u get help?? (reply to 48716)

Classifiedweb3: Yes check out bookpad (reply to 48720)

LeeMinThien: Hi, can someone give me some contract with code verified. I learned func, but dont know how a real contract look like.

Sul: Нет (reply to 48887)

Vladislav: Hello everyone 👋 In general, I am an architect of ideas. I cannot realize all my ideas by myself because there is no end to them.  Here I will post worthy ideas and you can take them for free and use them for the benefit of the entire TON community ❤️  I hope this will be useful  And today’s idea:   I was watching the Hong Kong conference and came across TON Asia and there is no…..China. there are a lot of people in China (although who am I telling :))  So the idea is to integrate TON into WeChat through long and persistent efforts.   Good luck to all 🍀!

kevin: You know China too little :) (reply to 48894)

Vladislav: Quite possible. Depending on who you compare with ;). But I know for sure that everything is possible. (reply to 48895)

Heydar: so when we talking about remaining value in message processing , we just talk about the remain value in that message, not whole messages? (reply to 48876)

Jimmy Becen: hi guys I am implementing Jetton vesting contract Currently I am listening for the response_destination message in the vesting contract when transferring tokens from the contract to the userWallet. And mark the claimed user However, I have a problem, User can send 2 claim messages at the same time and he can do vesting twice! How should I handle it accurately and securely? please help me!   Another way I mark the user as claimed right after sending the message transfer. This ensures that the user can only claim once, however the contract does not guarantee that the token has been sent to the user's wallet successfully

Heydar: do we have? someone have any link about it? (reply to 48864)

Yhwach: Hello, how can I export this password protected mnemonic to passwordless mnemonic?

Yhwach: the library is ton/crypto

Yhwach: I need to import this wallet to an external wallet but no user wallet support password-protected mnemonics

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 56 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 16  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

_chocolate.py: how can i withdraw ton from collection contract ?

wikig: Hello guys !  When i try using the official bridge  : https://bridge.ton.org/  I noticed i have to pay for some additional bridge fee. But i don't know and not sure for how it charge .  Is there any docs or announcements about the fee rate of official bridge ? Is that fix amount for bridge fee or it takes percentage  ?  Thanks

K.: From the docs:  “The commission fee for this service remains at a fixed price of 1 TON, in addition to Ethereum's network fees for the transaction.” (reply to 48911)

wikig: Well . here's what i found .   I trace transactions happened on BSC and TON , and match those 2 transactions as a bridge action together  :  https://bscscan.com/tx/0x4e987cf0d5f63cedcec8bc1c649a000e4f37f7458f8b916a1ddf5b20faa6f653  https://tonviewer.com/transaction/695c493377e0a5b25b0cd29bf870d33fba812472073172b00272a94da727026b  It is a bridge from BSC to TON , i can get the target user's TON address by decode the address by bscscan. (reply to 48912)

wikig: But finally , the user seems only got 39.21 TON . Which seems far more less than  44.3 bTON it supply on BSC .

Killua: hey how do i add test network in tonkeeper

Semyon: 5 times click on tonkeeper logo in settings (reply to 48915)

Killua: its showing like this no test net options

K.: Go to app config - and change keeper to testnet in the Tonapi host (reply to 48917)

K.: I should really make an FAQ from all the common questions here 🙂

_chocolate.py: what's problem ?

musashi: haha I just got the same

Behrang: Now try to add a new wallet. There will be a new option for wallet on testnet. (reply to 48917)

musashi: maybe testnet RPC is bad now

_chocolate.py: take a rest

musashi: i cannot do this on browser or desktop (reply to 48916)

musashi: btw, i'm big fan of HxH too (reply to 48915)

Semyon: I do it in mac m1 (reply to 48926)

Sergey: enabled dev mode and add new wallet select "testnet network" (reply to 48928)

musashi: I'm using mac m1 too lol

Semyon: yep I know it, thank you (reply to 48929)

Killua: Thank you this worked (reply to 48918)

K.: Keep in mind that this turns the whole app to testnet. If you want to use it in mainnet, you’ll have to switch back to “keeper” (reply to 48932)

K.: But you can use this ^ method to create just one dedicated testnet wallet, I think. (reply to 48929)

Vladislav: Hello again everyone 👋  Second idea for today, take it if you want :)  Project “Agora” (from ancient Greek this is a trading area, market)  Applications in Telegram and TON-keeper.  Meme tokens are very popular now.  Agora will involve trading tokens on the TON blockchain. Well, the main essence of the project is that you can create your own meme token right in this application.  After creating your token, you will be given the opportunity to fully design its trading card - i.e. why it’s worth buying, what “story” backs it up, etc.)  The honesty and righteousness of the market will be monitored by Agoranomos (like TON validators) They will receive a portion of the fees from transactions.  Also, if you are interested and would prefer to work on this project, I can help bring the idea to the perfection, taking into account all the nuances and subtleties.  All the best and good luck 🍀 ❤️

_chocolate.py: can i update contract after deploy ?

_chocolate.py: like proxy in ethereum

&rey: Directly, using SETCODE. (reply to 48936)

musashi: is there a testnet faucet api beside the Testgiver Ton bot?

Heydar: can someone help me?😢 (reply to 48864)

Heydar: so how users be sue that we dont change our code? (reply to 48938)

Behrang: Not in FunC or TVM in general, but any deploy script can have that role. For example, in blueprint, you can use a deploy script to do whatever you want and create the init state. (reply to 48864)

Heydar: I want prevent deploying if someone wanted to send deploy with wrong init data do you think is that a problem? (reply to 48942)

Behrang: If you do not include such functionality in your contract, then it will not be upgradable. If you include a SETCODE opcode, then you may have good reason for it, or safe guard it, so only admin/governor can upgrade it. (reply to 48941)

Behrang: TON network does this automatically for you. You can't deploy a contract to an address that does not match the init state (code and data) of the contract. (reply to 48943)

Heydar: Thanks for the help, so let me describe better my case study , I want to bounce backa nd make it failure if someone sending the init data that is an int , with lower than 100, is that possible? or is that good job? or Im doing in wrong way this limitation! (reply to 48945)

User<6703584027>: Any DEV in here looking for volunteers?  I'd be willing to help you with anything as long as it's what I do.

Kenny$$Shillz: please help!! how do i verify my contract on tonscan after deployment?

George: Hello. I am exploring TON Sites and I have 2 questions, and I can't find a good answer to them. I would be really glad if someone could help me understand. Honestly, I think I don't understand the concept very well. 1. Is there a possibility to open .ton site in telegram mini app without setting up proxy on my device? Yeah, it's not like I believe it much, but who knows, it would be cool. 2. (That's actually the more important one) How can I easily open a .ton site in my browser without manual proxy setting? I know about MyTonWallet, but it actually works very bad. As I undestand it, it only uses one of the three available proxy, and can't switch between them, and it's often that this proxy that MyTonWallet uses doesn't work for me...

финн: u can just add .run to the url  http://foundation.ton.run (reply to 48949)

George: Could you please elaborate? How should it work and why? I tried to open my .ton site adding .run in the end, it didn't work. (reply to 48950)

Haq: Guys fast question:   How to send the transaction to some SmartContract from the Web2 app which requires:   { $$type: "SomeType", amount: 2n }  ??

финн: I think ton.run backed sends request into the ton network instead of u and then returns back. My advise is to use ton proxy directly. You can find the instructions in the docs) https://docs.ton.org/participate/web3/how-to-open-any-ton-site

George: Thanks. (reply to 48953)

George: Also... I am trying to understand smth, I opened foundation.ton and it opened pretty much as fast as a normal website, but my website takes a LOT of time to load, it can be up to minutes sometimes, or not load at all. It does work, but it's incredibly slow. I used this guide... https://docs.ton.org/develop/dapps/tutorials/how-to-run-ton-site  May be there are some unusual reasons for ton sites to load slowly?

_chocolate.py: begin_cell()     .store_slice(owner_address)     .store_uint(next_item_index, 64)     .store_ref(content)     .store_ref(nft_item_code)     .store_ref(royalty_params)     .store_uint(mint_price, 64)     .store_uint(max_quantity, 64)     .end_cell() i store more mint_price and max_quantity like that but deploy contract error. Why?

Behrang: You need to change your mindset.   Anyone can deploy any contract. This process needs a state_init. This state_init has a code part and a data part. Since the deployer has access to both data and code, any kind of control that you put in the code can be removed before deployment.   I think it's a good opportunity to read more about jetton architecture and learn how jetton wallets are working and prevent an attacker from deploying an arbitrary jetton wallet with whatever balance they want. (reply to 48946)

Heydar: Baz ham Thanks ❤️ (reply to 48957)

User<6329807391>: Hi, everybody I need a Mini App developer in telegram

Vitor: I started trying to convert my notes while I was learning Tact into a primer... I did very rough first draft https://vitorpy.com/2024-04-08-tact-primer-for-solidity-devs/ if someone has some free time, I'd love to get some feedback and see how can I make it better

Xaceo: Hello, i have a question, how to burn Jettons? Actually burn not send to an address??

Jilius: Hi everyone

cryptocoder0x: Hi guys, I'm looking for a good TON developer. Anyone here who can join the team ? We are seasoned builders and looking for long term engagements.

K.: A Jetton should always have a burn function.  TEP: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#2-burn Contract: https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/ft/jetton-wallet.fc#L163 (reply to 48962)

Dmytro: Hi! Sometimes when I send url: 'https://toncenter.com/api/v2/jsonRPC', data: '{"id":"1","jsonrpc":"2.0","method":"getMasterchainInfo","params":{}}' ...request to toncenter.com i got... data: 'error code: 502' ...response. I don't understand what's wrong. It happens at random times. Can someone help me?

Xaceo: Yes, but how to burn? I guess all jettons have this function? (reply to 48966)

Buggy: Hi Rohit, i know someone who can help you manage a community for your project (reply to 48964)

User<7118534515>: Hi, does anyone need a front-end & contract developer?

Komron: Who knows, in which case tonconnectui gives "Unable to verify transaction" ?

Jason Day: Any devs here?

Денис: Hi guys, what should i put in the "appname"? I tried putting a random value like "game", but then it just opens the chat with my bot, not the web app itself (reply to 39429)

Roman: send “/newapp” command to BotFather and get app name (reply to 48980)

Денис: thx!🤗 (reply to 48981)

Jason Day: Best way to attach logo on jetton.  I tried everything

K.: You need to provide a URL for the logo when minting. (reply to 48983)

Jason Day: I tried, it just doesn't accept (reply to 48984)

Amir: how can i get  the message payload in tontools or tonsdk libraries ?

Navajjoo: Hey guys. Can anyone in his free time to help me understand my issues with tutorial code, creating nft collection. It can be live share in visual studio code or on GitHub. Thank you!

Nam: how to buy TON phone?

User<6703584027>: You got the money sir? (reply to 48988)

User<6703584027>: Wow, I'd love to get it tho but I don't got money

User<6703584027>: But I know how to get it tho

Nam: thanks (reply to 48991)

User<6703584027>: No problem (reply to 48992)

User<6703584027>: You could ask a founder of a project (reply to 48993)

— 2024-04-09 —

Heydar: FunC has support for type inference. Types _ and var represent type "holes" which can later be filled with some actual type during type checking.   so if I dont want use a return value from a function(one var of the tuple) that can help in optimzation too? (using underscore)

Andrey: just use   () foo() impure {     ;; some operations } (reply to 48997)

Heydar: I want to know if Im calling the function that returning tuple(3 variables) I want to ignore one of them by hole(underscore) is that helping in optimization or not? (reply to 48998)

Andrey: No (reply to 48999)

Heydar: :( Thanks (reply to 49000)

小龙: How to query order information in Golang

Ey: I sent 10 TON to my telegram wallet(@wallet), but i did not receive it. I checked with Tonscan and found that my wallet address is inactive  Check Plz  my wallet address : UQCi3IQjMkSECnIYy5wFjY3dTbVHesc6pyNk-e1F2DFThdNI

&rey: That is not a development topic. Please contact @wallet support; money should be processed then. (reply to 49004)

Ey: I already inquired about @wallet support bot yesterday, but I haven't received a related answer yet. I'll wait a little longer.

Ey: Thanks

MBA: Hi guys, how can i avoid SCAM When i mint my Jetton?

&rey: Why is it not scam? (reply to 49009)

nick: HI, how can activate my Uninit address?

wikig: Sent out a transaction (reply to 49011)

&rey: Send ingoing message with StateInit (hard) or send outgoing message (which under the hood sends ingoing external message with StateInit). (reply to 49011)

wikig: You can send to anyone , event send to your self

MBA: I got tokenomic and plans for it? (reply to 49010)

&rey: If your project ticker collides with existing well-known token, there is a problem. Otherwise, you should send PR to github.com/tonkeeper/ton-assets (reply to 49015)

MBA: Is that so, thank you 🙏 (reply to 49016)

Zachary: Hey guys, we are lookin for an experienced developer who can build TON apps ( with react) our Telegram mini-app app got completed like 60% already and we need some hands to get this completed, dm me or tag me here if someone is interested,   will be paid good

wikig: Including any kinds of crypto payment require  ? (reply to 49018)

Zachary: Wdym? Can you be more clear (reply to 49019)

MBA: How much time takes to approve? (reply to 49016)

Zachary: So we should be editing the JETTONS.json and submit as PR? There isn't any details guide on readme (reply to 49016)

MBA: I think you should create a .yaml file with your jetton info in jetton folder. (reply to 49022)

&rey: It's not on readme but in PR placeholder description:  > Please make sure you change the original ones .yaml fiels in directories accounts/, collections/ or jettons/ and do not touch automatically generated .json files in the repository root. (reply to 49022)

nick: @pcrafter @carzygod  Unable to transfer out, error will be reported: (reply to 49014)

nick: {"ok":false,"error":"LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\nCannot run message on account: inbound external message rejected by transaction 2BBCFE75966D5161D3C5B6ACE83A0E59BCECA483B853CCE5029482310F5D1A41:\nexitcode=0, steps=0, gas_used=0","code":500}

nick: My sender address (reply to 49027)

wikig: Well , just ask if your project needs any crypto payment solution to generate crypto  invoices or something like that . (reply to 49020)

Zachary: Nope (reply to 49030)

wikig: Well . Have you using any wallet to transfer out ?  Remember to transfer toaddress that ... isBounceable   ( i am not sure if it speal right ) (reply to 49025)

.: Hi , where can I find the tl-b schematic for nft_sale_v2?

nick: Solved, thanks (reply to 49032)

Андрей: most likely you can find the structure of the cell you need only in the source code of the contract (reply to 49033)

.: There's no such information there (reply to 49035)

kevin: I don't there is one, but the source code pretty self-explanatory (reply to 49033)

.: The source code doesn't have this information (reply to 49037)

.: I don't even know where to look anymore, I've probably looked everywhere

&rey: Source code parses that cell? That definitely defines what you store there. (reply to 49036)

musashi: hey, I'm trying to solve the "partial execution" stuff. my contract updated its state but the message that send money to the user failed. I want to revert the updated state if the sending message failed. how could I do that?

&rey: Message sending failed or user couldn't process it? (reply to 49041)

&rey: Don't use commit + don't use flag 2 (IGNORE_ERRORS), and everything should work fine.

musashi: actually it's the 709 error from Jetton wallet contract (reply to 49049)

musashi: I want to revert the updated state if this 709 error happens

&rey: That's a significantly harder task. You should process bounced messages.

musashi: could u pls give more details? (reply to 49053)

&rey: You can either 1. Track your jetton balance; 2. Allow users to lose funds; 3. Allow admin to set balance you have; 4. Load bounced message and understand that since it's truncated you don't have address of original TON sender; 4.1. push for changes in TON consensus that would return the full root cell 4.2. lock contract until this swap is done 5. certain other ways (reply to 49054)

&rey: 2 is my favourite, followed by 3.

kevin: https://tonviewer.com/EQCcwYDDcpA8Clwwsj9BNS9-nUYPPeIt9uJsK6CKyspcO-ZU?section=code        check this out, if you really undestand the source code, it is quite simple to figure the data structure out. (reply to 49039)

.: thanks (reply to 49057)

wikig: Hello guys !   Is that possible to make MEV profites on TON  ?  If i pay more gas , can my transation be speed up  ?

&rey: No. (reply to 49059)

wikig: Okay , so if i send out a transaction , no matther how much gas i spend , i won't able to make my transaction faster or being font of others  ?

K.: That’s right (reply to 49061)

wikig: Okay , so i don't need to worries about being MEV attack event if i set up a really height slippage in TON's DEX ?

wikig: That sounds good !

Heydar: Even if you be a validator? (reply to 49061)

_chocolate.py: how can i get value of tons when send to contract

_chocolate.py: how to load this value in contract

𝐓𝐃: Hi all, I want to introduce my AI bot that I trained from a collection of data from official TON documents and data about TON on the internet. I will try to train more. Hopefully this bot can help answer some basic knowledge questions as well as further develop the TON community.  Bot name: Utya Professor (@utyapro_bot)

K.: Validators cannot manipulate the speed of specific transactions, otherwise the network would be unfair. (reply to 49065)

&rey: Validators can only change order of external messages in their blocks. (reply to 49065)

Amir: any idea ? (reply to 48986)

NY: hi fam, is this phone from ton blockchain?

TON Bounty Bridge: ​Các người dùng tương tác với nhau nhiều hơn  🏷 Developer Tool  Summary:đưa một nhiệm vụ hay vấn đề để một nhóm người dùng cùng nhau giải quyết, các trò chơi gắn liền với t...  Created by Thanh9219

_chocolate.py: how can i validate amount token send to contract ?

TON Bounty Bridge: ​Formatter syntax for func code in visual studio  🏷 Developer Tool  Summary:I have installed FunC language in visual studio code but still cannot format the code every time I p...  Rewards: • 5 TON  Created by thinhnguyen1105

Aleksei: Nope. Just startup. (reply to 49088)

TON Bounty Bridge: ​Formatter syntax for func code in visual studio  🏷 Developer Tool  Summary:I have installed FunC language in visual studio code but still cannot format the code every time I p...  Rewards: • 5 TON  Assignees: no assignees Created by thinhnguyen1105

Yeager: hi, i found that tact have framework in ts, but here some framework in python ?

K.: You can use load_coins from the message body:  https://docs.ton.org/develop/func/stdlib#load_coins (reply to 49090)

Sleapy: Hi. Where can we debate on the future of TON ? How can it be more scalable ? 3-4 shards and we already see that transactions take 3 to 5mn to get entirely confirmed. Or sometimes pending tx are not picked up.  It's not fud it's serious questions. I love TON but the network can't keep up now. How can it changes ?

musashi: I have a question about dictionary in FunC each key-value is counted as 1 cell for storage fee, right?

0xNuejo: Hello Everyone! Happy to connect with TON Devs & Enthusiasts! ⭐️  https://t.me/hackatonx/11987/12449

dio: is faucet working?

musashi: i cannot deploy my contract to testnet anymore lol

Slava: There are works in testnet scheduled until 05:45 PM GMT (approximately).

musashi: oh

musashi: great, now I have a good reason to take a nap lol

_chocolate.py: so lag

_chocolate.py: :v

musashi: wait, so it takes like 17 hours from now =) (reply to 49103)

Slava: No, it's 05:30 PM now. So I hope the works will be completed soon. (reply to 49108)

BakaFT: anybody received this nft collection? EQD0S9gwHxm-vF2XKXw-Cp8oifK2Tr6S0hUKCD-iAo7DNkh1

BakaFT: I found it comes from https://society.ton.org/ton-hacker-house-2024-ton-dev-journey

0xluong: Still doesn’t works 🥲 (reply to 49103)

Petr: if you work with tonkeeper try tonhub, this switch worked for me (reply to 49112)

XFT: What happen to @wallet anyone know?

Vladimir: Wallet is currently experiencing extraordinarily high user activity. Please note: this does not mean that your Wallet is blocked. It indicates that our third-party service is blocking the connection between you and Wallet. Our team is investigating the issue and taking necessary action. Rest assured, all your funds are secure, and your Wallet will soon function properly.  We will inform you as soon as everything is back to normal and appreciate your understanding and patience. 🫡 (reply to 49116)

Евгений: Hi guys! I'm trying to get current price of MEH on dedust and i'm noticed that dedust sending POST requests to https://api.dedust.io/v2/routing/plan (is this not documented https://api.dedust.io/#/v2 or maybe I didn’t find it?) to get jetton price with the params:  1. amount: "123000000000" 2. from: "jetton:0:15c3eeac2bb3497a94a3807d605bad256049076334a62bda476d7b2d08294363" 3. to: "native"  I understand what is amount and native, but can someone explain me what "jetton:0:15c3eeac2bb3497a94a3807d605bad256049076334a62bda476d7b2d08294363" string means?

— 2024-04-10 —

He: `let b: StringBuilder = beginTailString(); b.append(forward_payload);  send(SendParameters{     value: ton("0.1"),     to: jetton_address,      mode: 0,     body: JettonTransfer {         query_id: query_id,         amount: amount,         destination: to,         response_destination: myAddress(),         custom_payload: null,         forward_ton_amount: ton("0.01"),         forward_payload: b.toSlice()     }.toCell(),     bounce: bounce  }); ` How to add a text postscript when transferring money with Jetton? I tried following the writing method in the document and it still showed up in the browser. Call: 0x00a8d0c2 does not display text message like Ton transfer

Kaito Lee: Hello everyone, can someone explain to me more about these parameters in message swap?

Kaito Lee: const poolAddress = Address.parse('kQCyg9mPeuXM07ku0tv6oNy_S9H4gYPJUeJ2ZaTshUkyHrjv');      const pool = provider.open(         Pool.createFromAddress(poolAddress)     );      // console.log('ID', await pool.getPoolData());      const tx = await pool.sendSwap(provider.sender(), toNano('0.01'), Address.parse('UQBXej0Wfxpb9P0t7AAM4RGecR1HggjC4n_eiySK-yjoabF6'),         Address.parse('kQCNGqdBWXKsO5cINAyMHmEgKsunseFKGZYDeSMHEhMM-OGy'), BigInt(1000000000), BigInt(1)     );      console.log("tx", tx); i choose a pool address (ton/doge) on testnet. This my code, i try on send a message but it not work

musashi: hi guys, what's the best practice to solve the cell underflow TVM exit code 9?

Matthew: why i transfer ton into testnet address but it not active?

&rey: Because no one provided initial state for the wallet contract. You may do so by internal message (same that transfers TON) or, in an easier way, using external message (that requests sending TON out). (reply to 49125)

Matthew: but yesterday, is is active? (reply to 49127)

&rey: Could you describe more clearly what has been and what should have? (reply to 49128)

William: How can i get message hash from Cell? (reply to 49127)

He: `let b: StringBuilder = beginTailString(); b.append(forward_payload);  send(SendParameters{     value: ton("0.1"),     to: jetton_address,      mode: 0,     body: JettonTransfer {         query_id: query_id,         amount: amount,         destination: to,         response_destination: myAddress(),         custom_payload: null,         forward_ton_amount: ton("0.01"),         forward_payload: b.toSlice()     }.toCell(),     bounce: bounce  });` How to add a text postscript when transferring money with Jetton? I tried following the writing method in the document and it still showed up in the browser. Call: 0x00a8d0c2 does not display text message like Ton transfer

&rey: forward_payload: "***".asComment() (reply to 49133)

He: The type does not match😂

He: asComment() type is cell (reply to 49134)

&rey: forward_payload: "***".asComment().beginParse()

AC: can someone from the team help me make a telegram bot for me? I work on one and I want to keep my name on it, but it needs to be optimized by a professional team and I think that you would be the most suitable. Thank you

AC: don't dm in pv anymore, who can help me from the team can answer me here so I know for sure that he is a reliable person, I'm tired of scammers who write to me privately

He: The Payload value is shown as Call: 0x00000000😂 (reply to 49137)

Matthew: hello everyone, i have a issue: i using telegram bot connect tonkeeper and send transaction but when i pass payload into transaction param then tonkeeper have error

Matthew: anyone who has experience with this issue please help me, thank

Matthew: const tonWeb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));             const bocCell = tonWeb.boc.Cell.oneFromBoc(tonWeb.utils.base64ToBytes(response.boc));             const hash = tonWeb.utils.bytesToHex(await bocCell!.hash());  and when send transaction i received response boc, i want get hex string to fetch transaction with tonapi.io but above code return hash not same with hash of tonscan

wikig: Hello guys , anyone have suggestions about bridges on TON  ?

wikig: try toBoc() (reply to 49144)

Matthew: can you give more detail? i still don't understand (reply to 49148)

wikig: Can you show more informations about how it not same ?  I think the transaction you trace might not the same .... (reply to 49146)

wikig: a.bits.writeUint(0, 32);     a.bits.writeString('Hello world);     let payload = TonWeb.utils.bytesToBase64(await a.toBoc()); (reply to 49148)

Matthew: i already have boc from response of sendTransaction

Matthew: boc i received: te6cckEBAgEAqQAB4YgANHGhMXIt48UwB2pWDK/ThPKh+CyVsRZ33trYz3JQsKoBcQBOUn4aDc8m4gD5DWJZdGHm2LZmKsoeshmPCnUumSwAjbvNi7bWL/8qb6prENNqtStbb/mM0t8gBfqIO4OYUU1NGLswsd2gAAAAuAAcAQBmYgA+/C4cVK3dOcWWi8W9fiwdZxxs5595v+qpzTBwSKcNpxzEtAAAAAAAAAAAAAAAAAAArZAAxA==

Matthew: hex from this code: f4c0d2121bf9e625dea2b9089b0c18c1880df2f475518c79487c0bde09786c7c (reply to 49146)

Matthew: i use it search on testnet.tonscan sill found transaction (reply to 49154)

Matthew: but hex i expect is hash is 50feabeeffd9acf5c56a3a4544e8ec63dc88cdfed40df8ba6801daff548a3b21

wikig: Well . What i means is that , you can't just pass payload  in utf-8 . You will need to toBOC() as the code above . (reply to 49144)

Matthew: only fetch transaction from tonapi by it (reply to 49157)

Matthew: oh, thanks, i will try it (reply to 49158)

Matthew: but sendTransaction interface not require boc? only string (reply to 49158)

Matthew: connector.sendTransaction({             validUntil: Math.round(                 (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000             ),             messages: [                 {                     amount: '10000000',                     address: '0:7df85c38a95bba738b2d178b7afc583ace38d9cf3ef37fd5539a60e0914e1b4e'                     // payload: '66150c39648c431ebebf0985_661516f6648c431ebebf098f_1'                 }             ]         }),

Matthew: this is my code

wikig: As for the second question.  Honestly speaking , what i did is to wait for the address's latest transaction to avoid search hash directly .   https://stackoverflow.com/questions/73817581/how-can-i-wait-for-transaction-to-confirm-using-tonweb  ( (reply to 49146)

wikig: a.bits.writeUint(0, 32);     a.bits.writeString('hello world');     let payload = TonWeb.utils.bytesToBase64(await a.toBoc());      console.log(payload)      const transaction = {       validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec       messages: [           {               address: "address",               amount: amount,               payload: payload           }       ]   }       const result = await tonConnectUI.sendTransaction(transaction);   My codes here , seems work (reply to 49162)

Matthew: ok thanks

wikig: But what i using is tonConnectUI , Not directly using Tonkeeper . Not sure if it is the same . (reply to 49166)

Matthew: it work for me, thank you (reply to 49168)

Matthew: that is a solution but why do i convert boc to base 60 correctly but convert it to hex doesn't match (reply to 49165)

wikig: Well , i am not sure if i understand you correctly .  But you can see  :  https://testnet.tonviewer.com/transaction/50feabeeffd9acf5c56a3a4544e8ec63dc88cdfed40df8ba6801daff548a3b21  https://testnet.tonviewer.com/transaction/b10d579bd0737aa8c16740fd5df5d082ac73137b3af4f9c97947063a22a491a1  And you might understan what i try to means ( (reply to 49170)

Sniper Man: is there any method like Multicall on TON, I want to fetch info for multiple tokens within one call

小龙: telegram "mini app", don`t work keyboard after open other chat and click arrow came back to "mini app"

Ta: Can amybody Tell me how to get my Tonup back Thats Stuck in my contract because i forget to added the Memo Tag

小龙: After opening other chats on the Telegram mini app and returning to the Telegram mini app, the keyboard cannot be pulled up

Fortuné: hello all, I have a question, can we know the new tokens that have just been created and added liquid on TON?

Fortuné: I want to create trading bot, it can snipe token same as SOL Trading bot, ...

Klay.D: hi, does the official bridge support bridging from any original token in TON to wrapped token in Ethereum?

Tran: interest (reply to 49181)

Nastya: Hello everyone! Can you tell me how to make comments mandatory when sending messages to a specific address?

wikig: try add payload in your transaction (reply to 49183)

wikig: Nope. seems like now official bridge support for TON & WTON only (reply to 49181)

Heydar: in the recevier contract , you should throw unless it have not that message. (reply to 49183)

Heydar: sorry sir, Im just a beginner, trying to learn , and I thought may it help you.

Heydar: slice get_text_comment(slice in_msg_body) impure inline {     if (in_msg_body.slice_refs() == 0) {         return in_msg_body;     }      ;;combine comment into one slice     builder combined_string = begin_cell();     int need_exit = false;     do {         ;; store all bits from current cell         ;; it's ok to overflow here, it means that comment is incorrect         combined_string = combined_string.store_slice(in_msg_body.preload_bits(in_msg_body.slice_bits()));         ;;and go to the next          if (in_msg_body.slice_refs()) {             in_msg_body = in_msg_body.preload_ref().begin_parse();         } else {             need_exit = true;         }      } until (need_exit);     return combined_string.end_cell().begin_parse(); }

Heydar: you can modify this to take the message, and throw if you didnt take special message. (reply to 49188)

Heydar: caller did that:          slice text_comment = get_text_comment(in_msg_body);         throw_unless(error::unknown_op, equal_slices_bits(text_comment, "approve"));

Heydar: the refrenece:  https://github.com/ton-blockchain/multisig-contract-v2/blob/107ee13aa4cbabdc9ff0684b738dcd272c4211bc/contracts/order.func#L175-L176

Diat: How can I test swapping tokens on the Stonfi testnet? Here is my code: const JETTON1 = "kQCyg9mPeuXM07ku0tv6oNy_S9H4gYPJUeJ2ZaTshUkyHrjv";   const PROXY_TON = "EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez";    const provider = new TonWeb.HttpProvider(     "https://testnet.toncenter.com/api/v2/jsonRPC",     {       apiKey: "",     }   );   const myMnemonic = ""; // your 24 secret words (replace ... with the rest of the words)   const myKey = await mnemonicToWalletKey(myMnemonic.split(" "));   const tonweb = new TonWeb(provider);   const myWallet = tonweb.wallet.create({     address: "",   });    const WALLET_ADDRESS = await myWallet.getAddress(); // ! replace with your address   // console.log(WALLET_ADDRESS);    const router = new Router(provider, {     revision: ROUTER_REVISION.V1,     address: "EQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33Rbt",   });    const tonToJettonTxParams = await router.buildSwapProxyTonTxParams({     // address of the wallet that holds TON you want to swap     userWalletAddress: WALLET_ADDRESS,     proxyTonAddress: PROXY_TON,     // amount of the TON you want to swap     offerAmount: new TonWeb.utils.BN("1"),     // address of the jetton you want to receive     askJettonAddress: JETTON1,     // minimal amount of the jetton you want to receive as a result of the swap.     // If the amount of the jetton you want to receive is less than minAskAmount     // the transaction will bounce     minAskAmount: new TonWeb.utils.BN("0"),     // query id to identify your transaction in the blockchain (optional)     // address of the wallet to receive the referral fee (optional)   });    const seqno = await myWallet.methods.seqno().call();   console.log(seqno);   if (!seqno) return;   console.log(tonToJettonTxParams.to.toString());   var result = await myWallet.methods     .transfer({       secretKey: myKey.secretKey,       toAddress: tonToJettonTxParams.to,       amount: new TonWeb.utils.BN("1"),       seqno: seqno,       payload: tonToJettonTxParams.payload,     })     .send();

Matthew: const bocCell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(response.boc)); const hash = TonWeb.utils.bytesToBase64(await bocCell.hash());  hash: WTTD3+dPBKzqDQbaybHvX6p+SuNFnDUOgkGdj+w4huA= expect: y2pjCrViuvKDAV2u6wXnDiUySBgjfwI+o84Y3VxeLiA=  why hash diffirent but still searchable on tonscan

gavin: Hello everyone! I want to learn Ton smart contract development, and I saw that there are several development languages, such as FunC, Fift, and Tact. Which one should I choose?

K.: Fift is the low-level language that is executed by TVM. Choose Func or Tact. Tact is easier but still in active development. Func is more like C, but almost all docs are written for it. (reply to 49195)

K.: And Func is, I guess, the “standard” for development.

gavin: Thank you, I think so too (reply to 49197)

Klay.D: then do you know any other bridges solution supporting that? (reply to 49185)

wikig: Nope , but i do think it is possible to build one  . Currently we are working on it (reply to 49199)

Sleapy: Anyone ? (reply to 49098)

💥Phong: Why when I make a transaction but when checking txhash tonscan returns success. and tonviewer returns failure: Toscan: https://tonscan.org/tx/6b2fb11e8c052304e5c00be0fdd7bc0c392d8aac79260c4eac1d6dea93abf6bf Tonviewer: https://tonviewer.com/transaction/6b2fb11e8c052304e5c00be0fdd7bc0c392d8aac79260c4eac1d6dea93abf6bf

Ton: hi, when I check the transaction, I got  "address": "0:95c39cce9d9c2daf1bae02139c02427af946fd9e488222947fc19522ce7875d6", it's not the same as address. I think it's address_id. What's the relationship between these two?

💥Phong: 6b2fb11e8c052304e5c00be0fdd7bc0c392d8aac79260c4eac1d6dea93abf6bf is txhash

💥Phong: 95c39cce9d9c2daf1bae02139c02427af946fd9e488222947fc19522ce7875d6" i don;t know (reply to 49204)

Ton: I check the document

Ton: one is raw address

Ton: the other is user-friendly address

Ton: I don't know how to change from each other

💥Phong: Can you show me how to swap from jetton to ton? (reply to 49210)

💥Phong: I use it: https://docs.dedust.io/docs/swaps#multi-hop-swaps

Ton: not konw yet

💥Phong: I have fixed it. Gas fees are not enough. Must be 0.3 and 0.25. But the Dedust SDK code doesn't return any value to me. So I don't know if this transaction will be successful or not? I want to know the transaction status after the swap is completed.

Kenny$$Shillz: hey Guys please does anyone have any good documents for compressed NFTs (cNFTs)?

walker: Is there any function like signMessage in tonconnect?

K.: Aren’t they still in the proposal phase?  Best I could find: https://github.com/ton-blockchain/TEPs/pull/126 (reply to 49215)

Mahdi: every one worked with multisig-v1 do you now why we leftshift current time??   var bound = (now() << 32);   throw_if(33, query_id < bound);

Kenny$$Shillz: Can't you just use the web app? It cost like 1 sol to create a token contract (reply to 49217)

cryptocoder0x: hi guys, I'm using https://toncenter.com/api/v2/jsonRPC RPC to make contract calls but the majority of contract calls are failing.

cryptocoder0x: Is there a paid RPC available for TON ?

K.: Check out https://www.orbs.com/ton-access/ (it’s free) (reply to 49222)

Buggy: Who have a project in Ton ?  Like memecoin, game, or etc

Azhman: Someone with the ability to write a smart contract can help us

GigaDev: Send DM (reply to 49225)

Mahdi: any one ????? (reply to 49219)

ARSUN: Hi guys using @tonconnect/ui-react how to show Tonkeeper wallet alone in modal pls help

Azhman: check (reply to 49227)

Eagle: Hello guys one question which language should be used on backend if you wanna build on TON?

K.: If you want to build a true DApp, then a smart contract should be your "backend". In such case use Func or Tact. As for the webapp, TypeScript/JavaScript is the most popular choice (and it has ready-made libraries made for it). (reply to 49233)

K.: Python is also popular with a lot of libraries.

K.: You can open a specific wallet (e.g Tonkeeper):  https://github.com/ton-connect/sdk/tree/main/packages/ui#open-specific-wallet (reply to 49231)

cryptocoder0x: even this is not working (reply to 49223)

K.: what error are you getting? maybe you are making too many requests at the same time? (reply to 49237)

cryptocoder0x: no, we are deploying a NFT collection. We are making requests every 5 seconds

cryptocoder0x: https://tonviewer.com/EQC4TQ_X-Tx7UUHhc5hFrL-_-scElAbX-joew_hfV4Fg1zTd

cryptocoder0x: the transactions are bouncing, not sure what does it mean

cryptocoder0x: we also tried with changing the time to 30 seconds

K.: It's not the fault of HTTP provider, but rather the smart contract is returning errors - something is wrong with it.

cryptocoder0x: we have referred this https://docs.ton.org/develop/dapps/tutorials/collection-minting, is it possible for you to check if there is any limitation with this code ?

cryptocoder0x: also some of the NFTs were minted, so do you still think its contract error ?

cryptocoder0x: just to let you know the contract worked perfectly fine on testnet

musashi: I think it because of contract error, maybe related to the 'excess()' one, I made this 65535 error before and in my case it because I set the wrong the response_address

musashi: I wonder to know that in the Jetton minting flow, why we don't have to handle the bounced message if the 'internal_transfer' from Jetton Minter to Jetton Wallet failed?

musashi: could u pls help me explain this case sir @kllvn

Rahul: Could you explain by referring the code that is in the documentation? (reply to 49247)

musashi: just see the 'on_bounce()' in jetton-wallet, no 'on_bounce()' in jetton-minter.fc (reply to 49248)

musashi: just my guess sir (reply to 49251)

K.: it's also throwing 402. at least the error chain has started with it.  here's the error-throwing part in the NFT contract: https://github.com/getgems-io/nft-contracts/blob/97a427b23cf71736e04d752055ab976acfd28260/packages/contracts/sources/nft-single.fc#L84 (reply to 49247)

K.: 65535 is the latest and according to docs:  Often you can see the exit code 0xffff (65535 in decimal form). This usually means that the received opcode is unknown to the contract. When writing contracts, this code is set by the developer himself.

musashi: what about this sir? 🙏 (reply to 49248)

K.: that - I am not sure :( (reply to 49256)

musashi: yeah, i think if the internal_transfer failed, the total_supply still increased but the real number of token in circulation is not the same amount

musashi: one more question

musashi: if we got the 707 error in line 119, the balance still get updated, right?

Boris: Guys, how do you manage individual content of a nft where for the collection the only identification is the actual index? I mean how do you assign the actual individual traits to it?

Azhman: Someone with the ability to write a smart contract can help us (reply to 49257)

K.: the variable balance is changed, but the data is not saved in the contract storage (if you are using read_data - save_data flow). based only on the code snipped you shared (reply to 49261)

musashi: got it sir, I forgot the save_data() lol

cryptocoder0x: Hey sir, can you help us with this ? (reply to 49243)

musashi: can u share your code?

K.: the setup instructions actually reference outdated/deprecated npm packages 🤔  ton ton-core ton-crypto should be @ton/ton @ton/core and @ton/crypto  Although it's not the error you are experiencing, just a side note (reply to 49244)

cryptocoder0x: sure, I can via DM. Can i DM you ? (reply to 49267)

musashi: damn i just go to bed lol

musashi: it's 1am in my zone

cryptocoder0x: no worries, would be good if you take a look tomorrow morning

K.: That NFT guide was last updated a day ago, so if you follow everything closely it should work 🤷‍♂️

cryptocoder0x: thanks, my dev will take a look on it. Thanks again (reply to 49273)

BakaFT: https://tonviewer.com/transaction/f7dba75ae1e21555ec677bc3062229694c8d45d83430ce46a4f7583bcd1e7842 A question that may be little bit off-topic. This TX begins at 1h40 mins ago, but it seems stuck and the duration is only 1min3s. Does TON network forgot about it?

0xNuejo: Hello is there any experienced blockchain developer on TON that would like to take on a challenge with my team and participate in the TON Hackathon?  - Project: GameFi/GambleFi hybrid casino  - Role: Senior Blockchain developer  - Major complexities to be worked through are vrf/rng integration with a private state model (possibly powered by ZKPs) that we have conceptualized.  - Core team is fully formed except for this senior blockchain dev we’re looking for.  DM me for more if interested 👍👍

jUTON Ⓜ️ MEMES 🦴: Hello, good evening, I would like to know if there is any contract to make multi-transactions on the ton network?, thank you very much in advance.

Белый: Guys

Белый: Who can make sniper bot?

Белый: To buy tokens at same time with liquidity is adding

Белый: If it will work

Белый: I will pay much

Белый: ? (reply to 49289)

Nxrix: Is it possible to search for a ton address that you have only a few characters of it?

Белый: No (reply to 49292)

Nxrix: It's possible  All the addresses are not used and initialized (reply to 49293)

Амир: Hello everyone. I try to deploy my contract to testnet. In tutorial it is said to use TonHub (sandbox), however, it is more convenient for me to use tonkeeper. Is there a link to tonkeeper testnet, or maybe a full-fledged guide?

Nxrix: You should click on the tonkeeper logo a few times in settings (reply to 49295)

Амир: I mean can I get testnet link for TonKeeper like this? (reply to 49296)

Nxrix: 1 minute I'll try to find it (reply to 49297)

K.: You can use ton:// instead of tonhub.com and it will work with any wallet IIRC. Just make sure your wallet is in testnet (reply to 49297)

K.: Example:  let link = `ton://transfer/` +     address.toString({       testOnly: true,     }) +     "?" +     qs.stringify({       text: "Simple test transaction",       amount: toNano("0.05").toString(10),     });

Nxrix: Well from what I know you can use tonkeeper itself but just the wallet should be in testnet (reply to 49298)

Амир: Wow, grace (reply to 49300)

Амир: ty

Амир: Ty, got it (reply to 49301)

— 2024-04-11 —

TON Bounty Bridge: ​Support NFT for Telegram Profile Photo  🏷 Developer Tool  Assignees: no assignees Created by chauanhtuan185

Kenny$$Shillz: where can i get a list of message op codes?

nohara: Hi, anyone knows how to make a staking pool contract for staking Jetton?  Or for another words,is that possible for func contract like solidity contract on Ethereum which can receive ERC20 and add the ERC20 balance to the contract?

nohara: From my knownledge, once the contract receive jetton, it would create a jetton wallet for this contract, and the problem becomes that once a contract receive jetton, how the contract get its balance of jetton token?

cryptocoder0x: Hey bro, can we connect now ? (reply to 49270)

Slava: Can you clarify the case when it can actually fail? (reply to 49248)

&rey: By counting in transfer notifications, which may be absent. (reply to 49309)

nohara: Thanks, is there any reference or example about this? (reply to 49312)

cryptocoder0x: Hi all, I'm looking for a dev who can fix our NFT minting contract. Its a paid task, looking for some good devs. We also have other products we are working so its going to be a long term work! Thanks.

Matthew: i'm newbie in ton smart contract, i clone token-contract github repo, but i have isssue when create wrappers/NftCollectionEditable.ts? how auto gen it?

Rahul: Hi everyone, we referred to this documentation and deployed a contract using it. We are stuck on nft deployment because it is failing after deploying 12 NFTs. Please help us to understand if there is anything wrong with the contract provided in the documentation. (reply to 49244)

nohara: You may try blueprint (https://github.com/ton-org/blueprint), however, it only generates very basic of the wrappers, you still have to edit it to match your own contracts. Or you can take a look at https://docs.ton.org/develop/dapps/tutorials/collection-minting, hope that helps (reply to 49315)

Slava: I guess you can modify the contracts to make these notifications mandatory (if you control the Jetton of course). You just need to make sure that there is always enough message value to pay for all the fees. (reply to 49312)

Sergey: "Excuse me, I'm writing with a translator. Could you please tell me who to contact if a transaction on the network went through, but the tokens haven't been credited yet, it's been 12 hours already?"    https://tonviewer.com/UQBbPFuvLZjlu5IdGhuVCY-kdaHKufQAWKanL6t5UeIqFEk3 last transaction

nohara: Accutally, i want the staking pool capable for all standard jetton, not the jetton i've customized, otherwise, there would be a very limited usage (reply to 49318)

&rey: Use Tonscan, it works better. (reply to 49319)

Killua: I have deployed a simple counter contract but while opening it using client it is showing following error

Killua: Can anyone help?

I_U_ansayo: I deposited the ton with a transfer function to a Tonwallnet Telegram friend, but the accept button disappeared. How should I handle it?

K.: Npm package mismatch, you are using “ton” somewhere, which is deprecated. Change “ton” to “@ton/ton” and all “ton-core” to “@ton/core” (reply to 49329)

Killua: Thank you (reply to 49333)

Zachary: Hey guys we are hiring for ton developers who has experience in making telegram mini-apps, interested people can dm me with their github / proof of previous works

wikig: what kinds of mini-app ? (reply to 49335)

John CTOq: Hello guys I looking for developer can create a mini app with ton smartcontract

Zachary: Like a coinhub ( ex: moontok ) we built almost like 60% already, just needs to finish with some ton wallet interaction on site + some ui upgrades (reply to 49336)

wikig: What tonconnect for ? i means , what actions . i do not event see a connect wallet button in moontok .... (reply to 49339)

Butterfly: Hello everyone! I was advised to look for upcoming projects seeking funding on the website "ton". However, I can't seem to find that particular section with projects. Could you please help?

Sonny: hi everyone , How can I set the name when deploying like that?

&rey: You can buy corresponding TON DNS item: a domain or Telegram username. (reply to 49343)

Sonny: tks so much (reply to 49344)

Sonny: How can I change the Contract type like that?

&rey: Create a popular species of smart contracts. (reply to 49346)

wikig: Is there any launch pad like pink-sale in TON  ?

K.: Check out: https://ton.app/launchpads (reply to 49348)

wikig: Sure , have search that before , but ........ Well , none of it works like pink-sale for pre-sale in no KYC or limit

K.: I guess that spot is free to be filled in, time to build :)

wikig: yep , now working on it

Sonny: hi , how can i decode OP

Zachary: Hey guys, why does the burn addres shows "suspended"

K.: So that the burn address doesn’t spend things sent to it 😁 (reply to 49354)

User<5901725413>: Hey guys,   We are looking for developers (blockchain ton, frontend, telegram bots).  For a long term project.  Please send me a message in private with - your field of expertise - your experience  If you don't have experience and are just learning by yourself, it's also good. We will provide you with a test task. And if everything is good, we can talk salary.

Nice: Hi guys, I’m newbie with tonconnect-ui lib, so I have some misunderstanding with how to work with ton connect provider on localhost.   I did all as documentation says but when I try to connect my tonkeeper wallet i receive a message that there is no tonconnect-manifest.json file on my root  I do the project using nextjs

NICK: Any TON dev here who can help to write a smart contract? Please DM me or reply please here in the group.

K.: If you access that localhost link, can you see the JSON? Looks like Ton connect cannot access the file. (reply to 49357)

NICK: Can pay in TON or USDT for the setup of the smart contract.

Nice: u are right, and i don't see JSON file :c (reply to 49360)

K.: put it in the /public folder and it should appear there.

K.: (not sure with nextjs, but that’s how it is with Vite)

Nice: yeah it worked  now i can access from the link in browser, but still doesn't work for connect wallet (reply to 49363)

K.: hmm, technically it should work, maybe try restarting the dev server. Generally, though, the manifest is uploaded to e.g. GitHub and served from there

Nice: still this issue, but when open this link i can see my manifest file

Nice: ok thanks I'll try to make it (reply to 49366)

K.: try just /manifest.json or /assets/manifest.json instead of localhost… Should work according to google

wikig: Hello guys , how you guys bridge tokens to TON chain ?  I try few bridges in  https://ton.app/bridges  Most of them not support for bridge TON , official bridges support ETH & BSC only and charge 5TON (which i think is not cheap at all ) And how can bridge asserts or tokens from solana chain & base chain ?   Currently we are working on build a bridge aggregator on TON , But found out that no much working bridges at all ....  Any suggestions  ?

Nice: That sounds good i will try all😂🤌 (reply to 49369)

Nice: Idk is it working fine on vite?

Nice: For example if work from localhost   @kllvn

K.: yeah, but I only use remote urls for manifest.json. i could try to get it working your way later

Sumit: I am deploying a jetton from another contract. how can i store individual content ie symbol and decimals inside a jetton from the contract itself?

Nice: I tried with github but i passed localhost url in “url” key and it says that there is a problem with manifest, i dont have deployed website yet and what can I use for that url? (reply to 49374)

K.: if you have uploaded the manifest.json to GitHub, just open it and click “Raw” to open a raw file. Copy the URL and use that. (reply to 49376)

Ton: hi,where can I check if the pool is locked and the time?

Nice: Great thank you mate, my bad it works now for me🥳🥳🥳 (reply to 49377)

Dim: is there an RPC provider that allow to query historical native and token balances for an account ?  Except this one https://github.com/ton-community/ton-api-v4

User<6443539520>: If anyone here has any already built TON utilities (games, bots etc) and you dont know how you will market it, please let me know 👍

Vladimir: 🎮 Upcoming Workshop Alert: Unlimited Opportunities in GameFi on TON and Telegram 🎮  Join us for a deep dive into GameFi on TON and Telegram, featuring GameFi lead at TON, Inal Kardan! This workshop is your gateway to exploring the potential and mechanics of GameFi.  👾 Speaker: Inal Kardan, GameFi Lead at TON.  Get ready to unlock the secrets of GameFi development with insights from the top. Whether you're a developer or a GameFi enthusiast, this is for you!  📺 Watch Live: - Binance Live: Click here - YouTube: Watch here  ⏳Time: in 5 minutes❗️  Don’t miss this opportunity to level up your GameFi knowledge!

Klay.D: hi, this tutorial shows the way to batch transactions by using just ordinary wallet? Then what is the difference between ordinary vs highload wallet if ordinary wallet can do batching as well? https://docs.ton.org/develop/smart-contracts/tutorials/wallet#sending-multiple-messages-simultaneously

Nxrix: Is it possible to swap tokens of my wallet using a code or http request in php?

My signature: How do I launch a project on ton chain ?

wikig: not likely , you might need something like tonconnect-ui to call up the wallet unless you have privatekey (reply to 49385)

King: Hello Friends  How can do a system  Inside telegram but also acces iframe in Playstore or web   This example is my best  But no only open in the bot  I want use in all ways posible   https://t.me/xrocket/cex?startapp=trade-TON-USDT_ref-lzg5WjPUuU   I want create a system casino 🎰 with ton tools wallets and other things The Open Network provided

Nxrix: I have the seed phrase (reply to 49387)

wikig: well , still you needs to recover it to privatekey(keypair) and sign data / send transactions (reply to 49389)

Nxrix: Is there any document explaining? (reply to 49390)

wikig: https://docs.ton.org/develop/dapps/ton-connect/tg-bot-integration  Well , i think this might help (reply to 49391)

Sumit: can anyone point me to any example/documentation? (reply to 49375)

Eagle: Alright thanks (reply to 49234)

Zachary: Hey guys, using this repo https://github.com/ton-blockchain/minter-contract   Its possible to build a telegram bot from which we can deploy jettons right

Zachary: Lmk if you someone here could do this, we are ready to hire (reply to 49395)

K.: yes, absolutely (reply to 49395)

Mika: Hello, is any ton developer here? I want someone who could write me an API for fetching trades from dedust and stonfi, pls dm me if you can do the task. Thanks.

Nerses: Hi! I'm exploring HTLC protocol implementations in FunC. Has anyone here worked on or knows of any HTLC examples or resources in FunC ? Any leads would be appreciated. Thanks!

User<798352611>: The language FunC hinders the development of Ton ecology. Compared with solidity, it is too difficult.

Kenny$$Shillz: U can add a custom payload in the transfer msg to your jetton wallet when transferring jettons to the staking contract. The custom payload will be sent to the staking contract address from it's jetton wallet when it receives the internal transfer as notification.  then update the staking contract data using the message  contained in the custom payload as per your staking logic (reply to 49309)

&rey: I claim that EVM (and Solidity) creates lots of strange unnoticeable implications, which are often security vulnerabilities. (reply to 49404)

Kushagra: Hi Guys, I am building an application on TON, which have couple of jetton token airdrop based on some situations.. Is there any default way I can try to bundle these airdrop to transfer jetton tokens to multiple wallet address, to save the gas fees?

Kenny$$Shillz: Use a highload wallet contract (reply to 49408)

Kushagra: Any documentation to refer?

Boris: How long does it take for the contract to be removed after sending all remaining Balance?

Boris: From the docs it says, that in the receive step, some value is already deducted for storage. Is it somewhere defined, for how long it is?

&rey: Till -1 TON of balance. (reply to 49411)

Boris: Oh, this is pretty long.. (reply to 49413)

Boris: Is it defined somewhere? (reply to 49413)

Rahul: I'm curious to know why a new language instead of Go or Rust. (reply to 49404)

Vinograd: what ide i can use to compile my token contract?

Boris: Is it possible to define an expiration in the contract itself? I am OK, if a zombie contract is hosted for free, but I think this could potentially lead to a mass of zombies, and fill bloat the whole system. (reply to 49413)

&rey: Because TVM has other data types; in particular, no pointers or references. (reply to 49416)

&rey: You can use flag 32 to delete contract's state manually. (reply to 49418)

&rey: You need flag 128 to go with it, though.

Boris: yes, this would make sense in the execution phase of the contract itself, but in my case the expiration > execution time, so one would need to send a separate message, which is nonsense in this case. (reply to 49420)

K.: Could you technically leave so little TON on the balance so the contract gets deactivated because of no storage fee 🤔 Then you could achieve somewhat of a expiration time limit. But this sounds so wrong by design :)

Andrey: Contract can self-destruct when send all toncoins to another contract with +32 flag

K.: True true, but I think Boris wants the contract to destruct by itself after some time.

Vinograd: anybody can help me? (reply to 49417)

K.: If you do 128+32 message flag that destroys the contract completely.

Vinograd: maybe some services or frameworks to use to deploy token contract

K.: Look into blueprint (https://github.com/ton-org/blueprint) (reply to 49426)

Амир: What may be the reason that while deploying a contract to testnet, it reverts my transaction. Contract still stay inactive

K.: Depends on the exit code, look at the transaction. (reply to 49430)

最も弱い: Please help me, after updating the TonSDK libraries, my program broke down and the build flew, can you please send an example of the contract connection code

User<798352611>: As a result, 99% of developers cannot enter, and the learning cost is too high. (reply to 49416)

K.: Technically, the "learning cost" of Rust is also too high, compared to say JavaScript. Func enables TON to be secure and good, that's almost never possible to achieve with a "easy language". (reply to 49434)

K.: And there is no such thing as "easy language" too 🤷‍♂️It's all relative

Vinograd: where i can get test tokens TON? (reply to 49429)

K.: https://t.me/testgiver_ton_bot (reply to 49437)

nyssa: guys anyone from tonalytics/redoubt db seems down , can't query

User<798352611>: I think it’s acceptable to learn solidity from a developer’s perspective, but my friends and I don’t feel good about learning FunC. This actually illustrates the problem. (reply to 49435)

Boris: Does the size of a contract matter for the gas consumption?

Alexander John: can smart contracts on TON call other smart contracts?

K.: of course, your wallet is a smart contract, and it works by interacting with other smart contracts :) (reply to 49442)

Alexander John: but not in a single tx?

Alexander John: https://answers.ton.org/question/1485787094973419520/how-can-one-smart-contract-on-ton-blockchain-call-a-method-on-another-smart-contract

Alexander John: I just learned this today, realized DeFi isn't possible on TON

Alexander John: :(

K.: https://docs.ton.org/learn/overviews/addresses#everything-is-a-smart-contract

K.: This is related to get methods, smart contracts communicate via internal messages (reply to 49445)

K.: wdym? there are a lot of DeFis on TON: https://ton.app/dex. It's more than possible (reply to 49446)

Nikku.Dev |: Any resources to start from TON?? I’m coming from evm development background!!!   Thankyou in advance!!!

Dario: Even if you cant call synchronous another contract, you can do anything you want on ton (reply to 49446)

Web DUCKS 🐦 SUI 🐾: Hello devs can I ask you a question. I just want to know about My wallet Tonkeeper. there was three adress in the past where we can choose from The last adress from one wallet but now the option is removed so I just want to know if I stored some ton There now where can I find those ton

Web DUCKS 🐦 SUI 🐾: Also in the past we can switch

Mike: Seems like a ton dev will be a very needed position soon

Rahul: That's why WASM based blockchains are growing. It is not only the problem of devs but also of employers. They also can't find skilled devs (Because tech -- the new language they create-- itself is immature) (reply to 49434)

Rahul: That is true. Learning cost of Rust is high (reply to 49435)

Rahul: But as far as I know, Rust based blockchains are compiled to WASM. So, those blockchains have also started to support TypeScript

Mika: Are you an experienced ton developer? (reply to 49140)

Shahboz: Is there code to connect Ton Blockchain wallets to Telegram bot Example code for PyTelegramBotAPI library

Амир: can i dm you? (reply to 49432)

Mika: Could you dm pls (reply to 49461)

Andrey: Why not? (reply to 49446)

Alexander John: let's say you are building an AMM, or even a p2p dex. Just to get the balance of a token in the smart contract, you have to break it into several transactions. This means there is opportunity for arbitrage. It will be very difficult to build a defi application in an asynchronous virtual machine. (reply to 49464)

Andrey: Difficult != Impossible

&rey: you have to store it inside. That solves your problem, tada! (reply to 49465)

&rey: Try frontrunning a DEX on TON, for instance.

Dario: Do not be afraid (reply to 49465)

Nacho: Hey there! I'm using the pytonlib (python sdk) to send transactions. From what I see, the private key you use to sign txs is stored in a tmp directory, and I would like to be able to save it elsewhere, like plain text. Is it possible to do that? Also, being in a temporary directory, is it possible for the key to be deleted at some point? Thanks in advance

cryptocoder0x: Hi all, I'm looking to hire a TON developer. Someone who has experience with writing contracts on TON

Nacho: In other blockchains you just have a keypair address/prv key, so i would like to replicate this but it seems that TON is particularly different

&rey: no, except in validator software. (reply to 49470)

&rey: In TON, usually you use Ed25519 keys: 256-bit secret and 256-bit public. (reply to 49472)

&rey: But all wallets are accounts, and their address is derived from init state, not directly from public key.

Crypto A99: Hi anyone can help me ?   i using Wallet A 's public Key as self.publicKey    But i using Wallet B to sign the signature. it passed the require, which mean checkSignature return true.  suppose of checkSignature sign from Wallet A can pass the condition. any wrong about my code..  checkSignature(hash, msg.signature, self.publicKey)

Nacho: And for each address derived, can I use the wallet secret to sign the transactions? (reply to 49475)

Nikku.Dev |: TON resources ?? Anyone

&rey: docs.ton.org (reply to 49478)

Nacho: thanks @pcrafter

&rey: Why do you need signatures from the wallet? (reply to 49476)

Crypto A99: Because our project have some conditions depends database. So if user eligible, our backend will sign the signatures. then user can use the signatures to call the contract. (reply to 49481)

Nikku.Dev |: Anyone is here starting tact language from beginning??

Vinograd: can i deploy contract with help of minter.ton.org but in testnet?

Амир: Me, but FunC (reply to 49483)

Nikku.Dev |: What’s difference?? (reply to 49485)

Амир: I guess it is high level language that compiles into func (reply to 49486)

Амир: But I am not sure

Nikku.Dev |: Okay ✅

Nikku.Dev |: Put some resources that you are follow

Амир: The main course I'm taking https://stepik.org/course/176754/info (reply to 49490)

Амир: have anyone faced such a thing that the contract is successfully deployed locally and passed the tests, but transaction bounces after trying to deploy to testnet?

K.: https://minter.ton.org/?testnet=true (reply to 49484)

Vinograd: which of these legit?

Dylan: hey guys im looking to bring real world application use to $TON i need help finding a partner exchange that will automatically convert $TON to Fiat USD

Dylan: Similar to tongpt4 the user needs to pay in ton but the service has to pay the provider in USD

Dylan: can anyone point me in the right direction?

Bums: How to sell ton nft?

King: Only swap $TON to USD fiat or many others currency 💲? (reply to 49501)

Dylan: only need to swap for USD Fiat (reply to 49504)

Dylan: im build a business that will need to pay in USD fiat when making api call request after the user pays in TON

King: User will have toncoins in wallets cryptobot or inside app ? (reply to 49508)

Dylan: users will connect wallet to my app to make payments for products that need to purchase in USD fiat (reply to 49509)

King: GetGems friend 🤗 (reply to 49503)

King: Ok invoice the receipt 🧾 (reply to 49510)

Dylan: i need to convert USD or find a currency float service

King: A bot is useful for your users? (reply to 49515)

&rey: Stop advertising a third party service, the intent is understandable enough without that. (reply to 49514)

Nxrix: Possible to do a simple swap of tokens by having the seed phrase?

Nxrix: Any direct example?

Biruk: their is an issue due to the trasfer of ton to the address     EQBX63RAdgShn34EAFMV73Cut7Z15lUZd1hnVva68SEl7sxi and i think i entered the wrong comment i don't know how the comment affect the transaction and how can i fix this

Nxrix: Explain more about the problem (reply to 49520)

Biruk: From Toncoin Wallet to Mexc wallet with wrong Comment id    i send  5 ton to my friend  .  How can i return my ton

Dylan: Depends what type of bot I guess (reply to 49516)

Dylan: But this isn’t really helping solve my question

&rey: Contact support of MEXC (reply to 49522)

Mike: almost all the way to depolying my hello world contract but get this error.  I did fill in the MNEMONIC phrase on the deploy contract

Mike: Mnemonic deployer was chosen, but env variables WALLET_MNEMONIC and WALLET_VERSION are not set

Boris: put it in .env (reply to 49527)

Mike: I just read the changelog (reply to 49528)

Mike: guess the tutorial is out of date a bit

David: hi, is there any way to get id of the sent transaction using '@tonconnect/ui-react'?

David: upd: is there any lib for boc parsing

User<6703584027>: Once more, Any founder in here that needs freelancers?

&rey: It is not. The link shouldn't be [clickable] in this chat either. (reply to 49537)

hasan_🦴_ 🐶🌱SEED_🐾: How to do KYC again

&rey: Is that related to TON development? (reply to 49539)

N95: Здравствуйте! При отправке монет на биржу не правильно указал мемо,биржа отправила на исходный адрес,но средства не пришли,поддержке написал,прошло две недели,как быть?

Dylan: This is the English chat (reply to 49542)

N95: Где Российский? (reply to 49543)

&rey: @tondev. (reply to 49544)

— 2024-04-12 —

nohara: Thanks for the very detailed explaination, I found the correct docs (https://docs.ton.org/develop/dapps/asset-processing/jettons#how-to-send-jetton-transfers-with-comments-and-notifications) about how to make this work. Really aprreciate for that. (reply to 49405)

CYFHER: How do I add an image to my token?  I tried what was listed but still gave me "?' (reply to 49493)

Nghĩa: hello, i have a wallet EQDZtffnYA9P6yeKvR_5MEgxyjKiQ_uzMLiPQP7PvKWSKXFC. why tonscan alway redirect to UQDZtffnYA9P6yeKvR_5MEgxyjKiQ_uzMLiPQP7PvKWSKSyH

Nxrix: you need link of the image and add it to the image field (reply to 49547)

hosermage: Jettons are erc20s for ton chain? (reply to 49546)

Nghĩa: what diffrient between GRAM wallet and Tonkeeper wallet???. i have a  wallet from 4 years ago. hen i import private phrase to Gram wallet it show 30 TON in wallet.  But when i import this private phrase to Tonkeeper it show diffrient address and not show the balance?

nohara: Yeah, i believe so, they’re just protocols for fungible tokens on different chain(jetton for ton, erc20 for ethereum) (reply to 49552)

Development: hi/ tell me?

tony: any suggestion on token batch transaction tool?

tony: I have tried oneclicksender but seems a bit expensive

CYFHER: How do I get the image link? It's in Jpeg (reply to 49551)

Nxrix: you should upload it somewhere (reply to 49559)

CYFHER: Where? (reply to 49560)

Nxrix: There are so many services maybe you can use GitHub (reply to 49561)

CYFHER: That's the one I used, but my image isn't visible, showing me '?' (reply to 49562)

Nxrix: well the link should be directly to the image  also try png format maybe (reply to 49563)

CYFHER: Can I DM you? (reply to 49564)

CYFHER: Tried, not going Please send Hi to me.

CYFHER: Please (reply to 49564)

Ton: hi, anyone know how to deal with "boc"?

Kenny$$Shillz: pleasure to be of service sir (reply to 49546)

Kenny$$Shillz: please can anyone help? I am trying to check the opcode contained in the foward payload of a jetton transfer msg within a custom jetton wallet contract's receive(msg: TokenTransfer)  function definition in tact language. how can I deserialize the forward payload in the TokenTransfer msg to extract the opcode in tact language

Development: Help please (reply to 49555)

K.: you used // as a comment, comments in Func are done with ; (reply to 49555)

Lemon: Looking for game dev, dm me

David Tai: How to link tweet and website to jetton token

monczkaS: https://unpkg.com/@tonconnect it works for you? I can not get right now TON Connect SDK

wikig: Hello guys , any bridge between sol & ton ?

Zachary: Yo, check dm pls (reply to 47153)

Nxrix: is there testnet version of ston.fi or dedust?

Evelyn | Twendee: Please dm me, my team can handle that (reply to 49471)

Shauno73: Hey guys, is there a tool for users to do a quick contract scan? Like ETH has token sniffer etc. Other than that, what forms of due diligence are available on TON?

K.: There are testnet contracts of ston.fi that you can interact with. (reply to 49584)

Kenny$$Shillz: Oh really? Can u share the router address on testnet (reply to 49587)

Nxrix: well is it possible to swap something in testnet? I was looking for website to use (reply to 49587)

K.: See the “Contract deployments”: https://github.com/ston-fi/dex-core (reply to 49588)

Matthew: how create uinit address same as https://testnet.tonviewer.com/kQAMl6BVegC0IOZPLhLzWBHCnK4iO4G5eNu4qn_NKQnoIZBs

Matthew: can someone help me

Ankit: Hello folks 👋  We're thrilled to announce the launch of an exciting opportunity for you all: the Ton Society x Nujan SBT challenge🚀🚀  This challenge is your gateway to mastering the foundational aspects of writing smart contracts on the TON blockchain 🩵 utilizing the TACT programming language and earning some exciting rewards 💰  So here's how it works:  💎Access our curated TACT learning resources and challenges  💎Engage with the material, test your knowledge, and complete the challenges  💎Demonstrate your mastery of TACT and win some amazing rewards  After finishing each level, you'll receive an SBT (Soul Bound Token)🪙 deposited directly into your Telegram wallet. Additionally, there's a monthly prize pool of TON coin🤑 available for grabs!  This challenge is designed to cater to all skill levels.   Ready to accept the challenge? Head over to https://learn.nujan.io/ to get started!  Let's unlock the world of TACT and build the TON ecosystem together🤝 (forwarded from TON Society India Announcements)

Nxrix: how should I make my jetton have price?

Kenny$$Shillz: I don't think there is a frontend web app th (reply to 49589)

Kenny$$Shillz: Add liquidity on dedust or stonfi (reply to 49594)

Nxrix: Is this possible even if it's not listed anywhere? will people be able to buy or sell?  I looked at ston.fi listing requirements and saw that needs 5000 ton but I don't have that much so want to start with simple things (reply to 49596)

Kenny$$Shillz: Yes it just won't be displayed on stonfi website but people with the token address should be able to buy and sell it on stonfi (reply to 49597)

Nxrix: I wish there was one so I was able to test adding liquidity how should I revoke owner of token? (reply to 49595)

User<6864657803>: It’s pretty simple (reply to 49599)

User<6864657803>: You can lock the tokens on ton raffle

User<6864657803>: Etc

Kenny$$Shillz: I think there's a message for transferring ownership of the jetton master if it uses the ownerble trait (reply to 49599)

Matthew: hello everyone (reply to 49591)

Nerses: Hello, TON developers! I'm currently diving into the intricacies of Hashed Timelock Contracts (HTLCs) and their potential applications within the TON ecosystem. HTLCs are fascinating as they allow for conditional, time-bound transactions, which are crucial for implementing secure cross-chain trading and other decentralized trust protocols. I'm particularly interested in seeing how these are implemented using FunC. Does anyone have experience with or know of any HTLC examples or resources specifically in FunC? I’d greatly appreciate any examples, code snippets, or pointers you could share. Thank you!

Josip: Tell them to make scroller more visible as on low monitor brightness it’s invisible. Almost gave up on first step because of it. 🙂 (reply to 49593)

gavin: Have the lectures started now? (reply to 49593)

Danny: Goodday everyone, can anyone help me with this error. This error is throw "Failed to calculate fee" when i transfer using  const body = beginCell()   .storeUint(0, 32)    .storeStringTail("Hello, TON!")    .endCell();  tonConnectUI.sendTransaction([   {     validUntil: Date.now() + 1000000,     messages: [       {           address: Address.parse(tonWalletReceiverAddress),            amount: toNano("0.5"),           payload: body.toBoc().toString("base64")       }   ]   } ])

Anton: Hi everyone What is the Comment format for a TON address? Saw only a numerical value on СEXs, maybe something else (alpha-numeric, alpha-numeric with special characters)?

User<6396669229>: Hey all 🙏

wikig: Hello guys , is there any solustions like CCIP ?

Femi: Gm here  Anyone here familiar with the grant program Questbook page?

Danny: Hello (reply to 49612)

Dominik: Hello, docs site seem to be unavailable (no links from the main site work). Did the url change?

Dominik: oh I see, it's docs.ton.org  all documentation links from ton.tg point to docs.ton.tg

Boris: I'm playing with the nft example, and then the question crept in whether it would be more efficient to separate Transfer and Initialization. In the example both are handled by the same receive Transfer block. But it checks everytime for the initialization flow  if (self.is_initialized == false {  ... }   And every Transfer is checked.  Here I separated these two procedures, and the code turned out to be more understandable and lighter. During initialization, many things can be neglected, because we can assume that the message comes from the collection.  But I'm new to this, so I wanted to ask, what do you think about this?

User<7157392393>: 👨‍💻 Yo, I build UI, smart contracts and web3️⃣ integration with clean code. Does anyone need?

Shashank: Yes (reply to 49608)

Van Chip93: I don't know how to open the testnet

ダーリン: enable dev mode and then add again your wallet to tonkeeper but with testnet option (reply to 49627)

0xluong: I'm facing an issue when loading the web app on the Telegram mobile bot. Upon the first load, the 'initData' variable is empty, only upon the second load does data appear. Has anyone encountered a similar issue?

Roman: Initdata is filled by telegram_web_apl.js script. It’s probably loaded asynchronously. So initdata is filled _after_  script.m is loaded. (reply to 49629)

Ma><im: Does anyone know how to send more than one message per transaction?   As far as I know, it is possible to send 4 messages in one transaction in TON.   Perhaps someone knows or someone has code examples in TypeScript?   Thank you in advance!

Roman: You can put up to four references to cells in one message.  https://docs.ton.org/learn/overviews/cells  Maybe you mean this. (reply to 49633)

Ma><im: Thanks for the answer!   I wanted to find out if, for example, I can deploy two NFT tokens at once in one transaction or send a TON to two addresses at once.   So that this action is counted as a single transaction (reply to 49634)

Roman: 🤣😉 and you are smart one. No you can’t (reply to 49635)

Roma: Hello everyone. There are those who bought TON from a card via Moonpay or simplexcc.com ? I really need your help!

User<6861867033>: Hello everyone, Is there anybody who can help me with swap on ston.fi I successed TON => JETTON but JETTON=>TON is not working Please give me sample code,  Thanks.

Danil: Can snip-bots be defeated by establishing low liquidity?

Kenny$$Shillz: please wat does exit code 130 mean?

Kenny$$Shillz: its a baiting strategy (reply to 49641)

Kenny$$Shillz: can i see your source code? (reply to 49640)

Danil: Are there others? (reply to 49643)

Kenny$$Shillz: Im working on implementing it on the jetton contract tho, so far encountering errors qwith integrating with dexes (reply to 49645)

Slava: You can have up to 255 outgoing messages in one transaction. But you need a wallet contract that can support this.  A new highload wallet (v3) was recently released. It could even daisy-chain transaction to deliver even more messages. (reply to 49635)

Louis: I encountered this error when trying to use the swap function as in the example provided by ston.fi, https://docs.ston.fi/docs/developer-section/dev-guide/swap. Can anyone help me?

Roman: https://tonresear.ch/t/cnft-community-outreach/3564 (reply to 49635)

User<6861867033>: Sure No problem (reply to 49644)

User<6861867033>: No1 (reply to 49644)

User<6861867033>: second (reply to 49644)

User<6861867033>: Jetton0 = jUsdt address   JETTON1 = proxy TON address But the tx is failed with 709 error https://tonviewer.com/transaction/9dc5f9829c95a7c49bb18b51410c70e9f97de8ae6d3b85165e589da5c0155ec9 (reply to 49644)

&rey: Insufficient TON to send jettons. (reply to 49664)

User<6861867033>: Can you tell me the exact parameter? (reply to 49665)

User<6861867033>: Can you please review my code page 2? I think the second image's amount parameter is wrong. Am i right? (reply to 49665)

User<6861867033>: I tested with 0.3 TON on ston.fi I think it will be enough. (reply to 49665)

User<6861867033>: Is anybody have any good sample code to swap Jetton => Jetton on ston.fi? Please help me 🙏

&rey: Jetton wallet wanted at least 307404037 nanoTON, as per emulation in https://dton.io/tx/771A1B4A1AB8A4F70982B3F188FC0A0F7DAF618D5C8B72ACFEB40A4CE4FF2CE2?time=2024-04-12T17:55:44. (reply to 49666)

Амир: Can someone explain difference between using ~ and . pls

&rey: int flags = main_cell_slice~load_uint(4) is equivalent to (main_cell_slice, int flags) = load_uint(main_cell_slice, 4); (reply to 49680)

&rey: The second shouldn't work at all, but it's int flags2 = load_uint(main_cell_slice, 4);

&rey: In short, the first form changes main_cell_slice, removing bits read.

Амир: I just was confused about why do we use specific symbol ~ instead of usual . (reply to 49682)

Buth™: I must be blind honestly. Some rookie mistake should not exist . Jetton worth 3k gone

Buth™: Fvk

Vinograd: if i have contract fc how to deploy it on chain?

K.: by writing a deploy script from scratch or in a dev env like Blueprint https://github.com/ton-org/blueprint (reply to 49688)

User<6703584027>: Has anyone finalized their project?  Just asking.

&rey: 1. You should compile it into code cell. 2. There are various ways, even a webpage allowing to deploy contract by its code and init data. (reply to 49688)

User<6703584027>: Hey man, mind if I DM ya? (reply to 49690)

Амир: Can someone share sources where I find out about the structure of the incoming in_msg slice?

Амир: For example, I know that first 4 bits are used for some flags, then sender address

Roman: https://docs.ton.org/develop/smart-contracts/messages#message-layout (reply to 49698)

Амир: ty, legend (reply to 49700)

TON Bounty Bridge: ​Example NFT and cNFT for TACT language  🏷 Education  Summary:There is currently no example code for developing cNFT contract. Developers who are just starting to...  Created by sitenativedev

— 2024-04-13 —

User<6703584027>: Hey y'all, who's up?

Амир: good night (reply to 49710)

User<6703584027>: Good night at your place sir? (reply to 49711)

User<6703584027>: It's actually midnight from my end, but I got a lil bit of extra work, so I'm still up.

Амир: exactly 😁 (reply to 49712)

User<6703584027>: lol man 😂 (reply to 49714)

User<6703584027>: Whatchu working on tho?

Амир: I m playing ton poker :/ (reply to 49716)

Амир: But 1 hour ago I was studying ton dev course (reply to 49716)

Амир: Now its time to waste some money

User<6703584027>: Hm, whatchu got in mind? (reply to 49721)

User<6703584027>: I'm not a Dev tho, but I like Dev talk 😂

Амир: I m still not dev too (( (reply to 49723)

Амир: But who are you?? (reply to 49723)

Амир: Travis Scott?

User<6703584027>: lol, Lil Yachty 😂 (reply to 49726)

Vũ Ne0: I want creat my project on Tonraffles. How can i ?

User<6703584027>: Hm, really? (reply to 49728)

Vũ Ne0: I had been creat one ticket on bot but don't have any one reply me

Kenny$$Shillz: import TonWeb from 'tonweb'; import { mnemonicToWalletKey } from '@ton/crypto'; import { Router, ROUTER_REVISION, ROUTER_REVISION_ADDRESS } from '@ston-fi/sdk'; import dotenv from 'dotenv' import { toNano, Address, TonClient, internal, WalletContractV4, SendMode } from '@ton/ton'; import { params } from './config';   const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));  (async () => {   dotenv.config()    const provider= new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey:params.toncenterApiKey})    const tonweb = new TonWeb(provider);   const walletVersion = "v4R2";   const V4_MNEMONIIC= params.wallet_mnemonic;   const WALLET_ADDRESS = params.walletAddr;   const JETTON0 = params.jettonMasterAddr;    const PROXY_TON = params.proxyTonAddr;       const key = await mnemonicToWalletKey(V4_MNEMONIIC.split(" "));    const router = new Router(provider, {     revision: ROUTER_REVISION.V1,     address: ROUTER_REVISION_ADDRESS.V1,   });        // transaction to provide TON to JETTON/TON pool   const tonProvisionTxParams =     await router.buildProvideLiquidityProxyTonTxParams({            userWalletAddress: WALLET_ADDRESS,       proxyTonAddress: PROXY_TON,             sendAmount: params.initialTonLpAmount,          otherTokenAddress: JETTON0,          minLpOut: new TonWeb.utils.BN(1),            queryId: 12345,     });    // transaction to provide Jetton to JETTON/TON pool     const jettonProvisionTxParams =     await router.buildProvideLiquidityJettonTxParams({            userWalletAddress: WALLET_ADDRESS,             sendTokenAddress: JETTON0,           sendAmount: params.initialJettonLpAmount,        otherTokenAddress: PROXY_TON,        minLpOut: new TonWeb.utils.BN(1),            queryId: 12345,     });          const WalletClass= TonWeb.Wallets.all[walletVersion];     const wallet = new WalletClass(provider, { publicKey :key.publicKey});         let seqno = await wallet.methods.seqno().call();          let res1 = await wallet.methods.transfer({         secretKey:key.secretKey,         toAddress: router.address,         amount: TonWeb.utils.toNano("1.1"), // 1.1 TON         seqno: seqno,         payload: tonProvisionTxParams.payload,         sendMode: SendMode.CARRY_ALL_REMAINING_BALANCE | SendMode.IGNORE_ERRORS,     }).send();      await sleep(2000);     seqno=await wallet.methods.seqno().call();      let res2 = await wallet.methods.transfer({       secretKey:key.secretKey,       toAddress: router.address,       amount: TonWeb.utils.toNano("0.1"), // 1.1 TON       seqno: seqno,       payload: jettonProvisionTxParams.payload,       sendMode: SendMode.CARRY_ALL_REMAINING_BALANCE | SendMode.IGNORE_ERRORS,   }).send();     })();  I'm trying to add liquidity on stonfi via the above script followung the stonfi sdk documanetation from https://docs.ston.fi/docs/developer-section/dev-guide/lp_provide. when I run it I get the following error  [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted Cannot run message on account: inbound external message rejected by account B2ABE7B56ECEC214B4B5C372D05ACC4885FDAA891D70FF735BA39141FF1EAF4C before smart-contract execution".] {   code: 'ERR_UNHANDLED_REJECTION' } please can anyone assist me with answers?

Kenny$$Shillz: and it also deducted some jettons and 2.6 ton from my wallet https://tonviewer.com/transaction/7fc25801bccc885b08b738f435c6ee482134de0bd775e6289acffc1f73d2abce?section=trace

&rey: 2 seconds between two outgoing transactions is insufficient. (reply to 49752)

&rey: Now you need to complete that same swap: execute the second send.

Kenny$$Shillz: ohok so should i do 5secs? (reply to 49755)

&rey: Normally, you send both messages in one transaction, but TonWeb may be inconvenient for doing so.

&rey: 20-25 seconds, better. (reply to 49757)

Kenny$$Shillz: so run the script twice? (reply to 49756)

Kenny$$Shillz: oh ok (reply to 49759)

Kenny$$Shillz: will try (reply to 49759)

&rey: To not lose those 2.6 TON, you need to comment out first send and execute script again. That should work. (reply to 49760)

&rey: Take one-two blocks (1..2 * 5sec) for your external message to be distributed, one more block (now 2..3 * 5sec) for it to be executed and yet one more (3..4 * 5sec) for liteservers to know about it. (reply to 49759)

D: Hello, the ton ai support told me to come here to ask about an issue

D: My issue is, I bridged my ton from ton to eth many hours ago and I still haven't received the ethereum version

D: I sent the ton to the address it said and added the comment, but my funds still hasn't arrived

D: What could be the issue?

D: If links are allowed, I can send the ton transaction link

D: Here are the 3 hashes: d72c62c70189336d66b7d91103b00d82d659b6672725d96d9327fc97ad20e114  e30cae06aa11ab850298b0a5cc1232f3963ab6d936f08a80384b04a942f97943  86c74f85338ed987ed0761b7d67b5c93d2e476e121287ec40defe6b888200f6f

Kenny$$Shillz: hi i have tried this and Im still getting a failed transaction  here https://tonviewer.com/transaction/a0ce8a1a952eea8820580786a1f3504efb638a47ada002f6f7f0649ed46ec9df?section=trace (reply to 49764)

&rey: Have you messaged @ton_help_bot? Other than that, we the developers cannot help you either. (reply to 49766)

D: I did, got no response and it's been hours (reply to 49776)

Kenny$$Shillz: Hi please what could be causing the tx to fail (reply to 49776)

&rey: Wait, have you read about TON smart contracts system?

Kenny$$Shillz: Most of what's out there I guess (reply to 49780)

Kenny$$Shillz: But why u ask this?what am I doing wrong pleas (reply to 49780)

wonderful: do you have the Java version of ton nows?

Matthew: hello all, has anyone coded nft reverse aunction on funC? can you give me solution or example here?

Philip 菲力: yo bro (reply to 49790)

Matthew: My idea is for users to transfer money to the nft collection wallet, at the end of the auction we will give the user mint nft at the lowest price of the auction, if the user transfers more than the price of nft, we will send it back surplus money (reply to 49790)

Kenny$$Shillz: It seems the contract verification application doesn't work for contracts written in tact lang

Kenny$$Shillz: I think there's an implementation of nft sale contract on thecookbook (reply to 49794)

Philip 菲力: i see, i think you can look into all of the contracts in getgems github repo: https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources  and try to modify the nft-collection contract since your goal is not really a reverse auction (reply to 49794)

Matthew: I have read through the sale contract but I see that its flow is to mint nft first and deploy the marketplace & sale contract to handle the logic. I am having difficulty without minting nft first. When the bidding user sends money to the contract I want to save it. create an array so that when mint checks how much money the user has transferred into the contract, I tried using a tuple but it doesn't seem to work well as a global variable. (reply to 49797)

Kenny$$Shillz: Why not just mint the nft to the user when the send ton to the collection contract (reply to 49799)

Kenny$$Shillz: Like the goblin nft collection

Philip 菲力: creating an unbounded array in a single contract is dangerous due to the storage limit (maximum 65535 cells) (reply to 49799)

Matthew: because we want users to mint themselves at the final price of the auction and bear the cost of deploying nft item contract (reply to 49800)

Kenny$$Shillz: I keep hearing this statement with no explanation as to how or why this is the case (reply to 49802)

Kenny$$Shillz: This makes little sense tbh (reply to 49803)

Philip 菲力: yea this info is hidden in the section about highload wallet: https://docs.ton.org/participate/wallets/contracts#highload-wallet-v2 (reply to 49804)

Kenny$$Shillz: Why would users be bibding on the mint Price

Kenny$$Shillz: Tbh ton documentation is crap for every single project and topic on the chain ... Ridiculously expensive learning curve imo (reply to 49806)

Андрей: you can always contribute to improve it (reply to 49808)

Kenny$$Shillz: Lol ikr but I don't think hoping for some random dev to materialize and write about a platform he/she didn't build is a winning strategy for a competitive space like this (reply to 49810)

Kenny$$Shillz: Usually the successful projects take user feedback and make appropriate changes.. not hope for users to make changes to their application.. good thing most ppl are ignorant of these issues so hopefully there's till time before the effects begin to kick in

Matthew: how to init global tuple? i have issue exit code 7 when get tupple element

&rey: You are trying to transfer jettons by sending some message to router, not to your jetton wallet. (reply to 49781)

&rey: The limit of storage? It is imposed. You need a specific link into validator code? (reply to 49804)

Kenny$$Shillz: Please elaborate (reply to 49818)

K.: What is modern way to build a dictionary using @ton/ton ? I am trying to rewrite the minter-contract scripts using latest libraries, but hitting a roadblock since [this part](https://github.com/ton-blockchain/minter-contract/blob/074b7d5f45f43552146fdf54f972020b2757bc18/build/jetton-minter.deploy.ts#L44) relies on beginDict from the deprecated ton library.* Also methods writeUint8 and writeBuffer are gone. I got around beginDict by re-writing it into a custom module, but that seems wrong.  Any pointers would be appriciated. <3  *which does not exist on @ton/ton or @ton/core. Idk if it was not transferred or deprecated, there's no changelog or docs.

&rey: How your message, sent to Ston-Fi's "router" contract, is going to pull jettons out of your wallet for liquidity provision? (reply to 49821)

Kenny$$Shillz: Ok so if I understand u correctly the toAddress in the transfer method Params should be  my jetton wallet address? (reply to 49825)

Kenny$$Shillz: For both transfers (reply to 49825)

Kenny$$Shillz: ?

&rey: No, the first one transfers TON so that uses normal destination. (reply to 49827)

Kenny$$Shillz: Router.address? (reply to 49829)

Kenny$$Shillz: And the second should be my jetton wallet address?

Богдан: Guys, where can I get a ton testcoin?

&rey: Seems that you need something like this: let d = Dictionary.empty(Dictionary.Keys.BigInt, Dictionary.Values.BigInt); // ... let b = beginCell().store(d.store).endCell(); (reply to 49823)

K.: https://t.me/testgiver_ton_bot (reply to 49832)

K.: Thanks, I'll check this out. 👑 (reply to 49833)

Богдан: i need more (reply to 49834)

Kenny$$Shillz: Wait an hour (reply to 49837)

Kenny$$Shillz: Ok thanks will try this (reply to 49829)

&rey: Have you already done sandbox (local) tests? (reply to 49837)

Богдан: i need around 800 testcoin ton

Kenny$$Shillz: Please what about contract verification on tonviewer , has anyone achieved this successfully for contracts written with tact lang? (reply to 49840)

Богдан: where i can find them?

&rey: verifier.ton.org (reply to 49842)

Kenny$$Shillz: It doesn't work sir (reply to 49845)

Kenny$$Shillz: I uploaded the generated pkg file but it keeps giving a hash mismatch error

&rey: Then why I see Tact contracts in recentmost verified? https://verifier.ton.org/EQDz3jwUq41wzt5I9fyX69SVdyzinhFhfnrIs7aCTHY8LPsf (reply to 49846)

&rey: Ah. Probably you have outdated Tact and should upgrade. (reply to 49847)

Kenny$$Shillz: How do I update min tact please (reply to 49849)

Kenny$$Shillz: I use blueprint

&rey: Use npm utilities to update that.

Kenny$$Shillz: Sorry but please be more specific (reply to 49852)

Kenny$$Shillz: But I'm using the latest blueprint version (reply to 49852)

Kenny$$Shillz: And I see that it has tact version 1.2

Kenny$$Shillz: Please do yo know who deployed this? (reply to 49848)

&rey: Don't have the slightest idea how to contact the person, except by sending a fraction of TON to their wallet. You may find it in transaction history of contract that was deployed. (reply to 49856)

Kenny$$Shillz: I see they used tact version 1.11 (reply to 49857)

Kenny$$Shillz: Could it be a problem with version 1.2

Kenny$$Shillz: It seems the verification app selects the tact version for u when u upload the pkg file

Deniel: Is that still possible to take a part in this hackathon? I don’t know how to register there 🙃  https://dorahacks.io/hackathon/the-open-league-hackathon/detail

K.: The last day of submissions is Apr 30, so yeah, still possible.  https://dorahacks.io/hackathon/the-open-league-hackathon/detail#entry-requirements (reply to 49869)

Eric: hello everyone, i want to verify ton address using regular expression. Can anyone assist me on this?

K.: Thank you, that solved it. For any future readers with the same problem, here's the solution:  https://github.com/VopxTech/minter-contract-blueprint/blob/b6cf2f1d1e89a2b05e99e8f7929216d809dddafe/wrappers/JettonMinter.ts#L53 (reply to 49833)

nguyen: Hello I'm having some problems and hope you can help. After the OKX exchange resolved the incorrect transfer of the TON system mome tag. they transferred TON back to the main wallet EQA2JYPGPywx6Sn590nUd06B2HgOkFvJ-cCnTO6yTEdacbUG instead of the old wallet UQCU2FkTlTVbWszILOPwNoTiVX0E0tNZuLOGakNeEEBmudlr

&rey: You need to contact @wallet support, and preferably use non-custodial wallets like Tonhub in the future. (reply to 49880)

nguyen: Where can I get reputable support? can you help me?

Nxrix: Can someone tell me about the possible letters at the end of base64 address and at the start?

Nxrix: I want to make addresses that contain specific words so need to know (reply to 49885)

&rey: User-friendly address has a checksum in the end, and you can't validate that with regexp. (reply to 49876)

&rey: At the end, anything. (reply to 49886)

Nxrix: And after the UQ? Or EQ (reply to 49888)

&rey: Also anything. While adjacency to UQ/EQ/kQ/0Q/Ef/... is not that nice, it is unlikely to be changed with next address format. (reply to 49889)

Kenny$$Shillz: Hey I am still encountering a problem with adding liquidity on stonfi for my custom jetton, the sendTon transaction always fails while the send Jetton transaction succeeds (reply to 49890)

Kenny$$Shillz: it bounces at the jetton Tranfer op from the proxy ton contract

Kenny$$Shillz: here is a trace of one of the failed txs https://tonviewer.com/transaction/29ded1a33fe12c3883ec868c6271337592b923f965816f487b355d3a0b8cd48b?section=trace

Kenny$$Shillz: I feel like I'm close to sorting this task out

nguyen: Can someone assist me in transferring wallet from OKX exchange to TON wallet EQA2JYPGPywx6Sn590nUd06B2HgOkFvJ-cCnTO6yTEdacbUG but my wallet address UQCU2FkTlTVbWszILOPwNoTiVX0E0tNZuLOGakNeEEBmudlr I don't know where to get reputable support from

Nxrix: Ef-m2UP6rg1Izra_yzSOvPboEem9d2HFzdWarnuNvrWhales Like this is possible? (reply to 49890)

Nxrix: Is starting with Ef a wallet address?

&rey: Yes, use vanity-contract. (reply to 49898)

Kenny$$Shillz: you want to transfer ton from okex to tonkeeper? (reply to 49897)

&rey: One in masterchain. (reply to 49899)

&rey: https://t.me/wallet_supportbot. No one in this chat can help you, including ones who DM (scammers). (reply to 49882)

Mohammad: Hi Mr Norouzinia I faced an issue while testing different addresses. There is a possibility of getting an invalid address hash from x.toString(16) and it needs a zero fill I think!  009cbce8fdf099444170359493131c581f93fcd2db1e0396e31cf44df413a861  x.toString() trims 2 first zeros! I was wondering if I should fill these zeros to get the correct address or not.  Thank you ❤️  Update:  I wrote this `zeroFill` function and place it here. it might be helpful for someone.  function zeroFill(str: string, targetLength: number = 64): string {   return str.padStart(targetLength, '0'); } (reply to 48237)

&rey: Yes, zerofill up to 64 characters is needed. (reply to 49904)

Nxrix: Are they easy to use? (reply to 49900)

Mohammad: Thank you 🙏 (reply to 49905)

Nxrix: I think they can't be used with wallets  Getting needed word at end of address is faster for vanity contracts and slow for wallets?

Yannis: Hi guys,  How can I download the data of the entire blockchain?

&rey: Set up an archival node according to instructions from docs.ton.org + seeking help to get everything working from obscure sources. (reply to 49910)

Yannis: What is the current size of the blockchain?

&rey: 2-3 TB or like so. (reply to 49912)

FRENSdly: is there any repository that has examples code to do swaps via stonfi and dedust? (without using their sdk)  Either python or js. Also is still unclear to me if i should use a RPC or ADNL SDK. I need to performa swaps via backend code. Thanks!

&rey: ADNL is much safer, but you should consider propagating external messages (to send the transactions) via tonapi — it pushes data to validators via many routes. (reply to 49915)

Kenny$$Shillz: dm (reply to 48309)

Kenny$$Shillz: use highload wallet (reply to 48316)

Nice: can someone explain how to send a transaction to the deployment of a new smart contract using the @tonconnect/ui-react library. I have my own pet project in which I want to embed an NFT smart contract on the network, I have an NFT class that has the functions of mining and doing NFT, but they are done through the @ton/core library, how can I combine both of these libraries so that when interacting with a button on the site, the user can a new contract for the network?  In photo u can see my functions

Kenny$$Shillz: import { mnemonicToWalletKey, mnemonicNew } from '@ton/crypto';   async function main() { // const mnemonicArray = 'put your mnemonic'.split(' ') // get our mnemonic as array const mnemonicArray = await mnemonicNew(24); // 24 is the number of words in a seed phrase const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic console.log(mnemonicArray) // if we want, we can print our mnemonic  }  main().finally(() => console.log("Exiting...")); (reply to 48324)

Sumit: Thanks (reply to 49923)

FRENSdly: Is there any code example to swap tokens on stonfi in python, or js?

Kenny$$Shillz: There's none published .. the stonfi doc contains implementation for creating the swap msg payload only (reply to 49929)

&rey: Could you get the relevant code out of SDK + higher in this chat? (reply to 49915)

chto: hot to fix unverified token on blockchain?? pls help 🙏🙏

SMAYKA® "🌱SEED": how to create a token on the tron ​​network

Андрей: minter.ton.org (reply to 49939)

SMAYKA® "🌱SEED": And how much does it cost to create it on this website? (reply to 49940)

Амир: Can someone tell me, is in_msg_body a slice that comes immediately after the init field of the internal message?

&rey: Only deployment fees. (reply to 49942)

Javad: hi

David 🦴: Hello guys

David 🦴: I need a Ton Dev

Lighted Alpha ✍️: Can’t someone do a recorded video on how to create a ton project

&rey: There were a few in Hack-TON-Berfest, for instance https://t.me/c/1919190447/1299. Absolutely real, with only a little preparation, and shows how you run into problems and maybe solve them. (reply to 49974)

David 🦴: No one here ...  I want to hire one (reply to 49971)

Дарий: can someone explain how to send a transaction to the deployment of a new smart contract using the @tonconnect/ui-react library. I have my own pet project in which I want to embed an NFT smart contract on the network, I have an NFT class that has the functions of mining and doing NFT, but they are done through the @ton/core library, how can I combine both of these libraries so that when interacting with a button on the site, the user can a new contract for the network?  In photo u can see my functions (reply to 49919)

Дарий: Guys, who's available to give us some advice? (reply to 49978)

Fahim |: I’m looking too (reply to 49977)

&rey: Return the object with value and payload: beginCell()..., then pass it to connector object. (reply to 49919)

Zaitsev [will never DM you first]: Hi all, I'm having a hard time to understand exactly why this transaction failed, it seems like all steps succeeded, but somehow the transaction failed. Is it a gas problem? That was my assumption. Thanks in advance! https://tonviewer.com/transaction/ae89c575605f993f6c9b1c172a1d07aa9b4a3f607ff2980ff457c70379b46a8d

&rey: "Stonfi Payment Request" segment failed. query_id: 4530856772251330 owner: 0:97281d62c416ca4cc6694e08a313fb0d44aa0fa0d39e1e1c6bbfce526a1afa1f exit_code: 1610486421 params:   is_right: true   value:     amount0_out: "1409503641791456"     token0_address: 0:a155685cc2fb5a497d2e91f3929d2f151aee369a83201c89abfdf695cdd98ca1     amount1_out: "0"     token1_address: 0:1150b518b2626ad51899f98887f8824b70065456455f7fe2813f012699a4061f (reply to 49991)

John: anyone knows why TonConnectUI is not working in telegram games? clicking on "Open Wallet on Telegram" has no effect.

John: while in WebApps it's working

Glenn: guys,   which language should I learn first, FunC or Tact?

Амир: I'm trying to deploy the contract via blueprint, but I'm faced with an endless download of transaction confirmation. Someone knows how to deal with it?

Sergey: there was a similar problem. I just switched from my home network to mobile internet (reply to 49999)

Zaitsev [will never DM you first]: Is it the value if amount1_out? What seems to be the exact problem here?  And how did you find out this was segment it failed? (reply to 49994)

Martin | Listing Partner: How to add burn function in TON coin

Martin | Listing Partner: I only request to add the burn feature when accounts are transferred to each other 1% token burn, how can I put this function to my coin

John: hello, i run the script to setup a node on my server. Setup is done, but if i run mytronctrl, it crash.  ton@Ubuntu-2204-jammy-amd64-base:/usr/src/mytonctrl$ mytonctrl [warning] 13.04.2024, 18:39:07.188 (UTC)  <MainThread>  The config file is broken local.db: {'config': {'logLevel': 'info', 'isLimitLogFile': True, 'isDeleteOldLogFile': False, 'isIgnorLogWarning': False, 'isStartOnlyOneProcess': True, 'memoryUsinglimit': 50, 'isLocaldbSaving': False, 'isWritingLogFile': True}} [debug]   13.04.2024, 18:39:07.188 (UTC)  <MainThread>  Thread self_test started [debug]   13.04.2024, 18:39:07.188 (UTC)  <MainThread>  Thread write_log started [info]    13.04.2024, 18:39:07.188 (UTC)  <MainThread>  Start program `/usr/src/mytonctrl/mytonctrl.py` Welcome to the console. Enter 'help' to display the help menu. Traceback (most recent call last):   File "/usr/src/mytonctrl/mytonctrl.py", line 1228, in <module>     console.Run()   File "/usr/src/mytonctrl/mypyconsole/mypyconsole.py", line 97, in Run     self.startFunction()   File "/usr/src/mytonctrl/mytonctrl.py", line 114, in PreUp     check_vport()   File "/usr/src/mytonctrl/mytonctrl.py", line 130, in check_vport     vconfig = ton.GetValidatorConfig()   File "/usr/src/mytonctrl/mytoncore.py", line 1951, in GetValidatorConfig     result = self.validatorConsole.Run("getconfig")   File "/usr/src/mytonctrl/mytoncore.py", line 67, in Run     raise Exception("ValidatorConsole error: Validator console is not settings") Exception: ValidatorConsole error: Validator console is not settings ton@Ubuntu-2204-jammy-amd64-base:/usr/src/mytonctrl$

&rey: Maybe Cloudflare or similar issues? (reply to 49999)

Амир: idk (reply to 50009)

Амир: Same issue in tonhub

Амир: Am i doing everything right?

K.: Have you tried deleting the temp folder and connecting again?

Амир: I dont have such folder. I guess bcs I havent initialized my project with npm create ton@latest (reply to 50014)

Амир: But in tutorial everything works ok

K.: If you haven't initialized the project using `npm create ton@latest`, did you then create everything from scratch?

K.: You can try setting up a new project using the npm create and copy-paste everything then. Should take a minute max.

Diat: How can i deploy wallet to blockchain after create wallet in local. because after crate mnemonic, i check this wallet didn't deploy. here is my code: const myMnemonic = await mnemonicNew();   const myKey = await mnemonicToPrivateKey(myMnemonic);   const myWallet = WalletContractV4.create({     publicKey: myKey.publicKey,     workchain: 0,   });    const client = new TonClient({     endpoint: "https://toncenter.com/api/v2/jsonRPC",     apiKey: "",   });   if (!(await client.isContractDeployed(myWallet.address))) {     return console.log("wallet is not deployed");   }

K.: Since wallet is a smart contract, you deploy it by interacting with it (sending a message). In the context of a wallet, that would mean sending TON to it. (reply to 50023)

Zaitsev [will never DM you first]: Could anyone check this out please? Thanks in advance! (reply to 50003)

Diat: In other words, I need to transfer funds into that wallet before calling the isContractDeployed function, right? (reply to 50026)

Артур: Hello! Does anybody know is it possible to create a TON wallet programmatically? I mean using SDKs

K.: Of course :) You may find this useful: https://tonhelloworld.com/01-wallet/ (reply to 50032)

T🦴: Tontools in github (reply to 50032)

User<6703584027>: Anyone in here in need of testers?

User<6703584027>: Greetings everyone

— 2024-04-14 —

Kenny$$Shillz: I think it's better to learn funC... I feel like tact is still  very young... (reply to 49998)

Elizabeth: I agree (reply to 50065)

Jeremy: TON WSL ubuntu22.04   fift -V How can I do ?

TON Bounty Bridge: ​Telegram bot for controlling access to private chats via Jetton and/or NFT  🏷 Developer Tool  Summary:Given the activity in TON and the increasing popularity of Jetton tokens, as well as the necessity f...  Rewards: • SBT Bounty Reward • 2000 USD in TON  Created by nessshon

boot adbot: anyone know how to create an nft with python

Glenn: Okay thank you (reply to 50065)

Zaitsev [will never DM you first]: Can anyone check this out please (reply to 50003)

发财: hello

Kaito Lee: hi, does anyone know what is the difference between setting normal data and adding storage::data on ton smart contract?  exam: global slice storage::router_address | global slice router_address

&rey: Either you can download ton monorepo and compile it for your device, or upgrade hardware. (reply to 50068)

sarah: is there any Ton event hold on dubai during token 2049?

&rey: Exactly zero difference. This is not Solidity, where names can matter. (reply to 50087)

&rey: Both are variable identifiers and need to be saved/loaded explicitly.

Svαtoωλ‎: For liteserver can i use ddr3? Or need ddr4?  And what about ghz on cpu, Does it play a role?

إسماعيل: Hello, is it possible to call transfer_notification when minting a jetton (https://github.com/ton-blockchain/minter-contract)? I would like people to see what amount is being minted/how much they are receiving in the transaction message const internalTransfer = beginCell()             .storeUint(0x178d4519, 32)             .storeUint(0, 64)             .storeCoins(toNano(200))             .storeAddress(null)             .storeAddress(minterAddress)             .storeCoins(0)             .storeBit(false)             .endCell()         const mintOperation = beginCell()             .storeUint(21, 32)             .storeUint(0, 64)             .storeAddress(minterAddress)             .storeCoins(toNano('0.2'))              .storeRef(                 internalTransfer               )             .endCell();

Kenny$$Shillz: Maybe include a forward payload with the desired message in the mint functions internaltokentransfer msg? (reply to 50102)

Kenny$$Shillz: With minter's address as response destination

إسماعيل: That would be just a comment no? (reply to 50104)

Kenny$$Shillz: Ye so the comment can be the mint amount (reply to 50106)

إسماعيل: That's one way to do but I'm seeking something more like this, "Swap" in this case is my "Mint" func while "+12.58 jUSDT" is going to be the amount of jettons the user minted/is going to mint (reply to 50107)

Yannis: Hi guys, anybody here as experience in setting up a full node+ liteserver and looking for some work?

KingMax👑: Hey guys. I'm an aspiring dev, looking to build a project on this innovative chain someday(in some near time), as I'm learning the ropes.  In the meantime, I like to volunteer as community manager/MOD for developers who are already building.  So guys, if any dev needs someone who could volunteer for their projects, while also learning the ropes, I'm down for it.  Regards🫡

Pavel: Hi all, been doing .net for 3 years. Quit my job and am excited to get into blockchain tone, which raises a question for me. The steps I've taken are npm create ton@latest Selected a counter Navigated to the folder npx blueprint build npx blueprint run And selected mainnet. It generated a QR for TonKeeper. When reading the contract, in loads the contract but unsuccessful, infinite load.  Has anyone encountered this thing? How to solve it?

Nick: Hello, I'm quite new to TON and just learning the fundamentals, so sorry if I'm asking a dumb question. I was reading in this chat that flashloans are not possible in TON. is this because of async nature of internal message delivery? If so, theoritically, can't an unreliable flashloans still be done?  I mean flashloans that sometimes works and sometimes fails the transaction.  What I mean is, let's consider 4 messages: A. User requests a flashloan B. User receives flashloan C. User does some arbitrary action D. User repays a flashloan  I understand that the order of these messages are not guaranteed so sometimes the transaction will fail, but some other times when the order happens to be just right it is going to work isn't it?

&rey: The problem is not order of the messages but that user can skip repaying the flashloan. (reply to 50127)

Nick: so there is no mechanism to invoke a check at the end that would verify if it was repaid? (reply to 50128)

&rey: At the end of what? Your contract's execution ends exactly where it sends flashloan to user. (reply to 50129)

&rey: Afterwards, that contract has zero claim to what's on user's wallet.

&rey: Please note that TON transactions are atomic but involve one contract only.

German: Does anyone know? There will be a huge event in Dubai next week, but I can't find any information about TON sections or TG bot dev. Will there be any workshops or anything related?

Nick: okay, seems like I need to learn a bit more about TON :) (reply to 50134)

Malik: Hello

Milad: Hi everyone, is it possible to modify wallet contract V4R2 so that it doesn't accept messages or incoming transfers without a 'payload'? How can I implement that in the contract code? (forwarded from Milad)

K.: Try deleting the temp folder and trying again. Happened to me once. Also try both testnet and mainnnet to see if it's related to one or both networks. (reply to 50126)

Milad: Should i check this parameter in wallet contract? (reply to 50141)

&rey: That's other branch, plugin installation. (reply to 50144)

Milad: Here:  https://github.com/ton-blockchain/wallet-contract  Linked from docs.ton/ types of wallet contracts (reply to 50145)

Pavel: TEMP folder in project or in windows? (reply to 50143)

K.: In project. Blueprint uses it to store wallet sessions.

Pavel: can you tell me how to get relative path to TEMP folder from project folder? (reply to 50152)

K.: The temp folder should be in the project's folder, like so in the image. If you don't have that, then blueprint hasn't been able to successfully connect to your wallet. (reply to 50153)

Pavel: When i try to connect throw the test net. I got this error  Scan the QR code in your wallet or open the link...[TON_CONNECT_SDK] Wallet message received: {   id: 0,   event: 'connect_error',   payload: { code: 3, message: 'Manifest content error' } } ManifestContentErrorError: [TON_CONNECT_SDK_ERROR] ManifestContentErrorError: Passed `tonconnect-manifest.json` contains errors. Check format of your manifest. See more https://github.com/ton-connect/docs/blob/main/requests-responses.md#app-manifest Manifest content error     at ConnectErrorsParser.parseError (D:\Projects\counter\node_modules\@tonconnect\sdk\src\parsers\connect-errors-parser.ts:26:16)     at TonConnect.onWalletConnectError (D:\Projects\counter\node_modules\@tonconnect\sdk\src\ton-connect.ts:377:43)     at TonConnect.walletEventsListener (D:\Projects\counter\node_modules\@tonconnect\sdk\src\ton-connect.ts:336:22)     at D:\Projects\counter\node_modules\@tonconnect\sdk\src\provider\bridge\bridge-provider.ts:282:39     at Array.forEach (<anonymous>)     at BridgeProvider.<anonymous> (D:\Projects\counter\node_modules\@tonconnect\sdk\src\provider\bridge\bridge-provider.ts:282:19)     at Generator.next (<anonymous>)     at fulfilled (D:\Projects\counter\node_modules\node_modules\tslib\tslib.es6.js:71:58) ManifestContentErrorError: [TON_CONNECT_SDK_ERROR] ManifestContentErrorError: Passed `tonconnect-manifest.json` contains errors. Check format of your manifest. See more https://github.com/ton-connect/docs/blob/main/requests-responses.md#app-manifest Manifest content error     at ConnectErrorsParser.parseError (D:\Projects\counter\node_modules\@tonconnect\sdk\src\parsers\connect-errors-parser.ts:26:16)     at TonConnect.onWalletConnectError (D:\Projects\counter\node_modules\@tonconnect\sdk\src\ton-connect.ts:377:43)     at TonConnect.walletEventsListener (D:\Projects\counter\node_modules\@tonconnect\sdk\src\ton-connect.ts:336:22)     at D:\Projects\counter\node_modules\@tonconnect\sdk\src\provider\bridge\bridge-provider.ts:282:39     at Array.forEach (<anonymous>)     at BridgeProvider.<anonymous> (D:\Projects\counter\node_modules\@tonconnect\sdk\src\provider\bridge\bridge-provider.ts:282:19)     at Generator.next (<anonymous>)     at fulfilled (D:\Projects\counter\node_modules\node_modules\tslib\tslib.es6.js:71:58) Unable to connect to wallet.

K.: Have you done any modifications to the project? The error you are seeing is related to a wrong Manifest file, which shouldn't happen if you just installed the project. (reply to 50155)

Pavel: No, I didn't make any changes. It must be a problem in my work environment. I'll try reinstalling my windows OC (reply to 50156)

boot adbot: I ❤️ the TON blockchain

&rey: What's the manifest content? (reply to 50157)

&rey: What are you using to create such a working sequence of transactions? (reply to 50159)

boot adbot: tontools on python

Nxrix: I don't think that's ton problem (reply to 50159)

&rey: Do you call transfer methods with the same parameters all the time? (reply to 50171)

Carter🧹: Please can you recover my just deleted message I'm not a bot I'm just asking for help =(

Carter🧹: I'm trying to use TONAPI to get_pool_address on dedust, but getting exit code 262 which I can't find in the list of standard exit codes, and it doesn't look like dedust code is public.  Anyone have any idea where i'm going wrong here?  v2/blockchain/accounts/EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67/methods/get_pool_address?args=B5EE9C72410101010003000001088597E2FF&args=B5EE9C72410101010003000001088597E2FF&args=B5EE9C72410201010000230000421065AAC9B5E380EAE928DB3C8E238D9BC0D61A9320FDC2BC7A2F6C87D6FEDF92087FDDAE6C

Carter🧹: First two args are cell hex encoded zero (pool_type is zero, first asset is native TON). Last arg is dedust specific encoded jetton for SCALE

Carter🧹: I am able to make a successful call to get_vault_address but one for pool addresses I just can't make work.  v2/blockchain/accounts/EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67/methods/get_vault_address?args=B5EE9C72410101010003000001088597E2FF

Gad DeGods: im trying test "renouce"  function my contract but dont know how in testnet env, someone can help me

Gad DeGods: someon help me pls (reply to 50183)

chebu: helloo! is there a way to open the mini app after returning from connecting a wallet? i set twaReturnUrl for ton-connect api to open the chat but i wonder if i could also open the mini app

Nxrix: Is vaniton safe?

H: Me too (reply to 50189)

K.: Your twa has a url too, I am pretty sure it's the bots username followed by /<app_name>. You can check with Bot Father what is it exactly.  E.g.: t. me/example/launch (reply to 50193)

User<6703584027>: Any founder in here looking for an ambassador or freelance jobber?

User<6703584027>: Do they sell usernames? (reply to 50202)

K.: Telegram usernames can (an probably should) be bought and sold on the official marketplace:   https://fragment.com/ (reply to 50205)

User<6703584027>: Oh I understand now. (reply to 50208)

Blockchain Dev: hello

Blockchain Dev: I would like to request to connect wallet ton using html.

Blockchain Dev: Does anyone have a sample or demo?

Blockchain Dev: good (reply to 50208)

K.: Check out this: https://docs.ton.org/develop/dapps/ton-connect/developers (reply to 50215)

Blockchain Dev: I only know how to use php and html and javascript. i connected successfully with openmask. but with tonkeeper I get an error. (reply to 50218)

K.: What kind of error are you seeing? Are you using some public code example?  TonConnect (the one I linked) is the golden standard for connecting wallets, so your best bet is to learn to use it. (reply to 50219)

Blockchain Dev: Failed to fetch

Blockchain Dev: failed to fetch 500 error

K.: But how exactly are you trying to connect? Are you using blueprint or a webapp? "Failed to fetch" is not a very specific error. (reply to 50225)

Blockchain Dev: yes i use for web connection. (reply to 50230)

Blockchain Dev: Then I want to get the wallet address and use the transaction for the user to "vote".

Anfert: Hello

Anfert: someone help me

Anfert: In pancakeswap, it won't let me buy the ton tokens, it tells me that "THERE IS NOT ENOUGH LIQUIDITY TO CARRY OUT THIS OPERATION."

Mike: Sorry for the noobish question but what is Tact.  I'm just learning FUNC .. should I learn Tact instead?  I'm kinda confused.  😁😁 (reply to 49593)

Амир: Tact is higher level programming language for ton Blockchain that is still developing (as i know) (reply to 50240)

Амир: And it compiles to func

Амир: In my mind, it is better to start with func

Амир: But i am beginner too, and it is just my choice

User<6530258477>: Hi  Pls pm me if you have a project (reply to 50245)

Bryan Le: he guys, nice to me here

Bryan Le: coming from Solana to TON and totally fresh

Bryan Le: want to ask you guys if there is any monitoring method like Helius webhook on Ton?

User<6703584027>: Please PM me if you need freelancers on your project.

User<6703584027>: Hey man, glad to have you man. (reply to 50251)

— 2024-04-15 —

Alhaji: Hello guys, cool to be amongst you guys

Russia: Hi guys, i'm doing swap TON to JETTON. I made it based on DEDUST. My code worked. However i can convert TON to Scale, RAFF or other jettons, but why can't convert TON to jetton GRAM?

Bryan Le: i guess no liquidity pool? (reply to 50270)

Bryan Le: thks man (reply to 50257)

Bryan Le: so I guess there is no mechanism to listen to activity of a wallet/contract on TON but i have to actively poll it?

Russia: Error: Pool (TON, SCALE) does not exist. (reply to 50271)

Russia: what will be the solution?

Bryan Le: find another pool; TON >> A, then A >> scale

Russia: What would A be here. In documention DEDUST, i see multi-hop swaps, but it swap to different jettons through TON. Ton is intermediary. Here swap TON to GRAM, what is intermediate between TON and GRAM? (reply to 50278)

Kaito Lee: hi all, i have a question, on stonfi, i want create a pair (token Jetton/Ton), this problems on stonfi when i deploy a new pool, two address params just's jetton wallet. Does anyone know how to solve it ?

Pike 🦴 🏴‍☠️: hello, any wss service that can be utilized to get events and such>

Bryan Le: looking for this now but still nothing (reply to 50281)

nohara: Any func experts knows how to store/load a tuple type variable?

Jimmy Becen: hi guys I make a transaction containing 2 messages: 1. Deploy Contract 2. Send jetton to contract above.  Message Jetton Notify does not work even though it was sent successfully. I noticed that the message sent to the contract has the status nonexist → uninit. What should I do to be able to execute the above flow correctly This is transaction:  https://testnet.tonviewer.com/transaction/086cf829b75d175b7f339a14b7cfb89581f5901563d73d7864fc9a5bf89a6c8a

Скул: Hi! This is my first time working with the TON network. I have question how to implement transactions? I want to specify address of nft collection in code and buy it from getgems site. Maybe on github there is a ready code how to do it?

User<6156051718>: So I have made a project which has the same symbol as a project in the list. Is that why my project is flagged as SCAM?   But my project is completely different than the other. And the other project is already completely dead. So is this really a problem and there is no way that 2 projects can have the same symbol? (reply to 49016)

User<6156051718>: Like last trade on this token was made on 26.03 and it has 0 volume so the project is dead

User<5606745514>: Hi, Which wallet supports ton test network?

User<5606745514>: Plz let me knwo if anyone knows about this.

NFN: Tonkeeper, Tonhub (reply to 50294)

User<5606745514>: Does this chrome extension? (reply to 50296)

User<5606745514>: Thanks for reaching out to me. But Plz kindly let me know, How can I add testnet to Tonkeeper wallet. (reply to 50296)

NFN: Multiple press on logo in settings and turn on the DEV mode then try to create a testnet wallet (reply to 50298)

User<5606745514>: oh thanks

jack Froze: Hi, Which wallet supports ton test network?

jack Froze: ,How can I add testnet to Tonkeeper wallet.

K.: Go to Settings, tap on the version until a menu pops up, enable Dev mode, go back to the main screen and click Add Walet. You’ll see a testnet one. (reply to 50308)

Aref: Is ton network slower than usual?

William: How can i pass queryId to transfer transaction from @ton/ton lib

Semyon: Hi, how I send many NFT from hightload wallet v2r2 to other wallet in one transaction? Do you have some code for that?

LeeMinThien: How to get Bounceable address from HEX or Non-bounceable?

LeeMinThien: Ton core lib only return Non-bounceable address, but that not is the address show on wallet extension.

&rey: .toString({bounceable: true}) ? (reply to 50325)

LeeMinThien: Thank. (reply to 50329)

TON Bounty Bridge: ​INTEGRATION OF TON BLOCKCHAIN ON TRUST WALLET  🏷 Developer Tool  Summary:Proposal:I propose that the TON community initiates discussions with Trust Wallet to integrate TON b...  Created by jen2jaysmart

K.: Yes, Jetton Wallet has a Get method for retrieving its balance:  https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc  (last few lines) (reply to 50335)

K.: But keep this in mind: https://answers.ton.org/question/1485787094973419520/how-can-one-smart-contract-on-ton-blockchain-call-a-method-on-another-smart-contract

Gad DeGods: im trying test "renouce"  function my contract but dont know how in testnet env, someone can help me

K.: What is your case? What are you trying to do exactly? If you want to just make a basic Jetton, it’s probably better if you use the ready Jetton Minter & Wallet contracts to deploy it. If you want a Jetton with custom behavior, then it’s also best if you edit the existing contracts and add that behavior on top.  A good read about this: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 50342)

K.: You need to simply add a get method function to your wrapper and call it, here’s an example of such: async getBalance(provider: ContractProvider) {     const { stack } = await provider.get("balance", []);     return {       balance: stack.readNumber(),     };   }  This works assuming that the get method in the contract is called exactly balance and only returns a number. You’ll have to modify these according to the contract you are working with.  https://docs.ton.org/develop/smart-contracts/testing/overview  https://docs.ton.org/develop/smart-contracts/testing/writing-test-examples (reply to 50347)

KingMax👑: Gm based davs, I'm an aspiring dev, looking to build a project on this innovative chain someday(in some near time), as I'm learning the ropes.  In the meantime, I like to volunteer as community manager/MOD for developers who are already building.  So guys, if any dev needs someone who could volunteer for their projects, while also learning the ropes, I'm down for it.  Regards🫡

Amir: when i use python tontools sdk to  transfer  jetton, the transaction will succeed but the Transfer_notification (Jetton Notify · 0x7362d09c) do not  generate on network i set the forward_pay_load and set TON amount more than 0.05 this is the body jetton payload:     def create_transfer_body(             self,             to_address: Address,             jetton_amount: int,             forward_amount: int = 0,             forward_payload: str = None,             response_address: Address = None,             query_id: int = 0     ) -> Cell:         cell = Cell()         cell.bits.write_uint(0xf8a7ea5, 32)  # request_transfer op         cell.bits.write_uint(query_id, 64)         cell.bits.write_grams(jetton_amount)         cell.bits.write_address(to_address)         cell.bits.write_address(response_address)         cell.bits.write_bit(0)  # null custom_payload         cell.bits.write_grams(forward_amount)         cell.bits.write_bit(0)  # forward_payload in this slice, not separate cell         if forward_payload:             cell.write_cell(begin_cell().store_uint(0, 32).store_string(forward_payload).end_cell())         return cell

&rey: Is there an example? (reply to 50358)

Jimmy Becen: hi guys why not show Transfer token in transaction? why not show opcode Jetton Transfer? My body message in tact    beginCell().storeUint(0xf8a7ea5, 32).storeUint(0, 64).storeCoins(msg.amount).storeAddress(sender() //                 ).storeAddress(sender()).storeBool(true).storeRef(beginCell().endCell()).storeCoins(ton("1")).storeSlice(beginCell().storeBool(true).endCell().beginParse()).endCell()

&rey: Because you're storing custom payload, thus your transaction may mean something else. (reply to 50361)

Amir: destination_address = Address(data['to']).to_string(is_user_friendly=True, is_url_safe=True, is_bounceable=False)         jetton_wallet_address = Address(data['jetton_wallet_address']).to_string(is_user_friendly=True, is_url_safe=True, is_bounceable=False)         forward_payload = data['memo']         body = custom_jetton_wallet().create_transfer_body(             to_address=Address(destination_address), # destination main wallet address             jetton_amount=data['value'], #nano, different for each type of jetton             forward_payload=forward_payload,             response_address=wallet.address, # response_destination is address where you want unspent money to return, for example you send 2 tons to nft for transfer, it uses 0.1, returns 1.9             query_id=0         )         query = wallet.create_transfer_message(             to_addr=jetton_wallet_address, #  jetton address of source wallet             amount=50000000, # this amount will pay as network fee in nano TON             seqno=seqno,             send_mode=3,             payload=body         )         message = query["message"]         raw_tx = bytes_to_b64str(query["message"].to_boc(False))         in_msg_tx_hash = bytes_to_b64str(message.bytes_hash())  transaction_hash: https://tonviewer.com/transaction/003d6c0c08f741e0427448feeca9b602bedafca003bd4d2061e495103ed5daac (reply to 50360)

Jimmy Becen: tks for rep! But I removed the store custom payload but still nothing changed 🙁 (reply to 50362)

&rey: Well, now you're attempting to store forward payload in ref but don't provide said ref. (reply to 50361)

Matthew: hello everyone, i custom nft contract , i have issue, when bid, i save bid param (address, price) but when deploy new nft i get bid param but dict search not found

Matthew: can anyone help me

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 56 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 26  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

Jimmy Becen: tks, Can you give me the code example for the correct forward payload? (reply to 50366)

&rey: .storeBool(false). (reply to 50371)

Jimmy Becen: beginCell()                     .storeUint(0xf8a7ea5, 32)                     .storeUint(0, 64)                     .storeCoins(msg.amount)                     .storeAddress(sender())                     .storeAddress(sender())                     .storeBool(false)                     .storeCoins(ton("1"))                     .storeSlice(beginCell().storeBool(false).endCell().beginParse())                     .endCell()   Is that what you mean above? (reply to 50372)

&rey: 1. You have a security issue, loading amount of TON sent from in_msg_body — data exclusively controlled by sender. You should use 3rd-from-end argument of recv_internal, called msg_value, instead. (reply to 50367)

&rey: Does it throw 405? (reply to 50375)

Matthew: ok thank you, (reply to 50377)

&rey: Please remember that your bid code starts storing bids at key 0, and flag is -1 when value is found, not absent.

Matthew: no, it doesn't throw 405 (reply to 50378)

Matthew: oh let me fix, thank you (reply to 50380)

Jimmy Becen: Thank you very much, you saved me :)) (reply to 50372)

Groot: how I can get the value from an external-in message in TON? Unlike internal messages, the Info in external-in doesn't provide value information.  My understanding is that external-in transactions are those sent from my wallet, and internal transactions are those received by my wallet. I can query the amounts received by my wallet, but I can't seem to find the amounts I sent out. Is that correct?

Miguel: Hey everyone, my logo gone from tonviewer and now it’s gone from Tonkeeper also

Miguel: We have this problem on the early days of the project and tonviewer  fixed it for us

Miguel: Probably the cache down again idk

Miguel: Tonviewer sent me here

musashi: hey guys, I have a question: ton wallets (tonkeeper, mytonwallet) automatically estimate gas fee for our transactions right?

musashi: can I attach more TON to the transaction?

musashi: I mean attach more TON in the wallet interface, not programmatically =)

&rey: No, dApp developers do that. (reply to 50395)

&rey: If they don't suggest amount to send and provide you with ton://transfer link, then you can change that amount.

musashi: damm, seems like my customized jetton need more fee to transfer than the estimated amount by wallet

musashi: no error code logged, just exit code 0 lol

&rey: No. External-in messages are going from outside of blockchain to your wallet, and they only cause outgoing internal messages to be sent. (reply to 50387)

&rey: You have to look into outMsgs list.

&rey: External-in messages can't carry any value since there is no TON outside the blockchain.

Аооао: Hi, i wanted to ask how to list a jetton on the blockchain and make it get a price

Аооао: If someone knows please tell

K.: Generally speaking, you need to mint your Jetton and add liquidity on a DEX to make it tradeable. (reply to 50409)

Аооао: I already minted it and can you recommend me a platform to do that? (reply to 50411)

K.: https://ton.app/dex (reply to 50412)

Аооао: Thanks (reply to 50413)

Oleg: hello, do the ton network have a  VRF  DAO?

&rey: Why do you need a DAO? VRF, yes, there is one. (reply to 50415)

Oba: Hello. New to developing and I am just at the point where I have created a token and connected it to my wallet on the minter. Just wanted to know before transferring to wallet should I burn before transferring or can that be done later?

Oleg: The use randomize_lt() and random()  looks good but I theenk this is unsafe  because  validators can still affect the result of the random number (reply to 50416)

Jimmy Becen: how to Create a popular species of smart contracts? Please give me the document link (reply to 49347)

Gad DeGods: How can i revoke my contract, pls help

Nishant: Hello your wallet address as be diagnosed and it been review that your said token is in your wallet..... Kindly synchronize your wallet through the node dapp to flush out all congested tokens as your Notcoin token is stuck in the blockchain wall of your wallet.

K.: A popular species of a smart contract means a popular contract that’s used by a lot of people. Then explorers can start recognizing it and labeling. (reply to 50422)

r0uted (@slicebots): How do I enable testnet in TONkeeper ?   I don't see any option after I click 5 times

Ferretxe: There is a way to know when you call a Mint Smart Contract (NFT) are you able to know before calling it which Item(NFT) is gonna be the one minting from the IPFS?

K.: Enable Dev mode and make a new wallet, you’ll get an option for testnet (reply to 50433)

Олег: Hello, I experimented, wrote tests and got up.  Invalid magic  let d = Cell.fromBoc(Buffer.from(base64, 'base64')) //base64 — .jpeg encoded to base64    I went searching downstairs and came to these lines   function parseBoc(src) {     let reader = new BitReader_1.BitReader(new BitString_1.BitString(src, 0, src.length * 8));     let magic = reader.loadUint(32);  if (magic === 0x68ff65f3) { ... } else if (magic === 0xacc3a728) { ... } else if (magic === 0xb5ee9c72) { ... } else {         throw Error('Invalid magic');     } }  Can you tell me what I'm doing wrong?)

Semyon: https://t.me/tondev_zh/22834 (reply to 50433)

&rey: There is Elliptic Curve Verified Random Function. It's backed by math, not by requirement for some DAO. https://ratingers.pythonanywhere.com/ecvrf-about.html (reply to 50421)

&rey: What contract, exactly? Most contracts already give you no special rights. (reply to 50423)

&rey: Scam. (reply to 50426)

&rey: Does your image also happen to be a bag-of-cells representation (could be saved in .boc format)? If not, you need to chunk-encode it. (reply to 50441)

William: https://tonviewer.com/transaction/0032edeaaf7b04b5c89795b628203abcde21cf058179593183e64903a8918a18

William: Any one can help? I got exit code 709, and don't know reason

&rey: You're sending insufficient TON. Emulate transaction via dton.io to get how much the contract requires.

Slava: DPDM  Just found a very cool node.js tool that can analyze your source code by following all the imports recursively and report all the found issues (like circular dependencies and broken imports).  I was using madge before, but DPDM looks more modern and convenient. And, of course, it fully supports TypeScript out of the box.  Install it with:  npm i -g dpdm  And run like this:  # Simple usage dpdm ./src/index.ts  # Print circular dependencies only dpdm --no-warning --no-tree ./src/index.ts (forwarded from JavaScript Best Practices)

Gad DeGods: my ct have the same problem like this and i want change this (reply to 50445)

William: in this transaction sell, are we need 0.3 + 0.25 TON for sell? (reply to 50452)

&rey: No. 0.3 which you're sending = 0.25 forwarded + some fee.

Nishant: No Brother, I was saying this here i need help i had minted notcoin voucher but i haven’t received so that i talk to notcoin support they send this message to me so I just want to know that this message is real or fake (reply to 50447)

K.: are you sure the support was legit? there are many fake / scam ones these days. And i have to agree the message looks like a scam (reply to 50458)

Nishant: don’t know that’s why I am asking here (reply to 50460)

&rey: You shouldn't listen to suggestions to move other tokens out of your wallet, since in TON that does not matter: Notcoin contracts cannot see other jettons. Point. (reply to 50458)

William: So 0.3 is dynamic and 0.25 is fixed? (reply to 50457)

&rey: Both are fixed. (reply to 50464)

Nishant: okay its mean they wanted to do a scam with me. (reply to 50462)

William: Ok thanks (reply to 50465)

(⁠◠⁠‿⁠◕⁠) Sharon: Does TON has anything similar for bounty programs like Immunify (reply to 47723)

&rey: That's an interesting point, actually, even though Notcoin is offtopic for this chat.  ⚠️ Scam warning. If someone suggests that airdrop does not work because of "congested tokens" or something like that, and asks to move those assets, DON'T DO SO! Or, if you're worried, move tokens to your other wallet. TON architecture ensures that transactions can't fail because you have additional jettons; existing contracts cannot see that. (reply to 50462)

Nishant: But what should I do now, I was mint my not coins. But they did not come to my wallet. i have gave my fees (reply to 50466)

DevBot: are their developers who are configuring the ton q server

DevBot: GraphQL

&rey: First of all, why "the"? Official interface for TON is a list of liteservers.

&rey: You're probably looking for developers of dton.io/graphql? (reply to 50473)

DevBot: yeah iam trying to query the TON blockchain using graphql

Klay.D: is it true that smart contract can only handle fee deducting with measured assumption, which is not the exact amount of fee that is charged, like fwd_fee, storage_fee? If so, smart contract will always make assumption on those fees and then overcharge fee amount on user, right? What would happen to the amount of overcharged fee which accumulates overtime in the contract?

Slava: Often, contract chain is designed that way so unspent fees are returned back to the sender in the end. (reply to 50479)

musashi: In Ton, do we have something like events in EVM?

&rey: External-out messages, which are extremely hard to collect across all the shardchains. Or internal messages to one contract, which may as well be your jetton master. (reply to 50483)

musashi: how does Ton explorers like Tonscan get the list of jetton holders sir?

&rey: By scanning whole blockchain. (reply to 50485)

Rahul: same 🥲 (reply to 50159)

Rahul: https://tonviewer.com/EQC4TQ_X-Tx7UUHhc5hFrL-_-scElAbX-joew_hfV4Fg1zTd?section=transactions (reply to 50159)

Development: Hi. Graduated from ton dev study. looking for a paid internship

Semyon: Hi, can you help correctly formatted message for that?

Development: I can't write. Can you write to me? (reply to 50498)

Crypto A99: any one know how to pass the address to ton Api runGetMethod?   I try to use  { type: 'slice', cell: beginCell().storeAddress(_address).endCell() }  But it's not correct   {   type: 'slice',   cell: x{8008FC0AC2C73A042EB19C99E6F8E72A9383F76CD3CA53AE0C09A00D06A9D09F739_} }

Diat: After transferring funds, the wallet remains in an uninitialized state, leading to an error 500 when I attempt to call sendTransfer. How can I activate it for use? (reply to 50030)

K.: Try sending something from that wallet. (reply to 50505)

K.: So when is your wallet smart contract being deployed? This would normally happen when you execute your first transaction - normally an outgoing transfer.  from: https://tonhelloworld.com/01-wallet/ (Step 4) (reply to 50508)

Crypto A99: Fixed (reply to 50503)

DevBot: iam trying to fetch all transactions from the address: query {   blockchain {     transactions(       filter: {         account_addr: {           eq: "EQDQMxKXCEWs4ILJltwZKXyeBnqr79evv0ROARFi2NapQthS"         }       }     ) {       edges {         node {           id           tr_type           tr_type_name           account_addr           balance_delta(format: DEC)         }         cursor       }       pageInfo {         endCursor       }     }   } }

DevBot: are there people who can read the query

Heydar: when we write '?' after calling a function , what's meaning of that '?'?

Heydar: for example:  (int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";

K.: It means that the function may not execute.  https://docs.ton.org/develop/func/stdlib#dict_get_min_ref (reply to 50518)

Heydar: Why it may not execute?! I thought if we dont write impure , it will happen in sometimes that compiler doing something for  optimization (reply to 50520)

K.: I mean, this is a function that returns something, in case of udict_get_min_ref, specifically, it returns the only reference in the value as a reference. So if it cannot return such, it gives an error. If it can it returns the result. That's why we have the ?  It's the same way as in many other programming languages. (reply to 50521)

K.: Hopefully this is not confusing 😅

Matheus: Can a smart contract query addresses ton balance? 🤔

Heydar: so how I be sure that it return correct value? (reply to 50522)

Heydar: Thanks , I got it , just I want to learn completely. (reply to 50523)

K.: It's not about the correctness of the value, but whether you'll get the value or not. Google conditional operator. (reply to 50525)

Heydar: I asked wrong way , I mean if it could not return the value, How caller know that? is that giving default value? or how? (reply to 50527)

K.: I think it returns a -1 flag, can't remember exactly. I am trying to find this in the TON docs right now. (reply to 50528)

Heydar: I thought may we should use try catch (reply to 50529)

Heydar: Thanks, I will find it then .❤️ (reply to 50529)

User<6457918847>: Hello all i need a dev that can write smart contract and create toekn asap

User<6457918847>: Hello can you write smart contract for us (reply to 50482)

Father Pepe Of: anyone got any idea how to use the tonweb,js

Father Pepe Of: keep getting this error   root@vmi1637970:~/tontipbot/tonweb/dist# node tonweb.js /root/tontipbot/tonweb/dist/tonweb.js:2 !function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.tonweb=e():t.TonWeb=e()}(self,(function(){return(()=>{var t=[(t,e,r)=>{const i=r(1),n=i.Address,s=r(21),o=r(25),a=r(27).default,{Contract:h}=r(26),u=r(30).default,l=r(38).default,c=r(42).default,f=r(45).default,d=r(50).default,{BlockSubscription:p,InMemoryBlockStorage:m}=r(53),{SubscriptionContract:g}=r(56),{Payments:y,PaymentChannel:w}=r(57),v=r(60).default,b=r(115).default,E=r(116).default,{Dns:A,DnsCollection:C,DnsItem:M}=r(231).default,B="0.0.66";class F{constructor(t){this.version=B,this.utils=i,this.Address=n,this.boc=s,this.Contract=h,this.BlockSubscription=p,this.InMemoryBlockStorage=m,this.provider=t||new a,this.dns=new A(this.provider),this.wallet=new u(this.provider),this.payments=new y(this.provider),this.lockupWallet=l}async getTransactions(t,e=20,r,i,n){return this.provider.getTransactions  SyntaxError: Unexpected token .     at Module._compile (internal/modules/cjs/loader.js:723:23)     at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)     at Module.load (internal/modules/cjs/loader.js:653:32)     at tryModuleLoad (internal/modules/cjs/loader.js:593:12)     at Function.Module._load (internal/modules/cjs/loader.js:585:3)     at Function.Module.runMain (internal/modules/cjs/loader.js:831:12)     at startup (internal/bootstrap/node.js:283:19)     at bootstrapNodeJSCore (internal/bootstrap/node.js:623:3)

Оскар: what is max count for action list? ton docs have exit code 33 for "too long action list" but doesn't specify how long

Оскар: found 255 (reply to 50542)

pust: do you know how to fix that?

Олег: How to store files in Cell, suggest a way to encode say .jpg in Cell. I'm just writing tests in TypeScript, I really need it. Help me please

Олег: I was told this won't work because I need to chunk-encode it.  I don’t know how to do this, where can I read it?

User<6457918847>: Are you writting smart contracts (reply to 50546)

Олег: Yes, and I need to put a cell in a smart contract that would store a file that, after transformations, would be in jpg format. I thought this could be done by putting a string in a base64 cell after converting the jpg to base64, but I was told it wouldn’t work that way. (reply to 50547)

Олег: this does not work  let base64 = await encode(filePath) //some func to encode file to base64  let d = Cell.fromBoc(Buffer.from(base64, 'base64')) (reply to 50548)

User<6457918847>: I have offer can we talk in dm (reply to 50548)

Олег: I wrote (reply to 50550)

Vlad: Hi! Who have experience in transfer NFT from highload wallet with tonutils-go or tonweb?

— 2024-04-16 —

Дмитрий: Hello everybody! Please tell me, what are the approximate fees for sending TON and Tokens at the moment?

Father Pepe Of: no one can help with this no..? (reply to 50540)

Father Pepe Of: tonweb.js is broken

Bob | Cobo.com: Hello everyone,anyone can kindly tell me the difference and association between this two txhash please? These are difference txhash , but they direction to a same transaction when I search in the Ton Scan  051f492b6fe05f935bd59ed0e519e3338f86ac753a0fcc587e52f6bf49036f0b 6fcc81ae1aeb63906dd6c8fe06c92830b1db31589a35d90c5fa33f9434a8a1a1

Оскар: please, mark these as monospace or paste urls  but at first glance probably they point to different "small" txs inside "one big" tx (reply to 50565)

Bob | Cobo.com: Thanks and the first url is  https://tonscan.org/tx/6fcc81ae1aeb63906dd6c8fe06c92830b1db31589a35d90c5fa33f9434a8a1a1 (reply to 50566)

Bob | Cobo.com: the second is https://tonscan.org/tx/051f492b6fe05f935bd59ed0e519e3338f86ac753a0fcc587e52f6bf49036f0b

Оскар: this lead to transaction where 27.97 ton are sent (reply to 50567)

Оскар: and this to external message which sends 4 internal messages with one previously mentioned (reply to 50568)

Bob | Cobo.com: Yes ,thans Ockap, my another question is , when I only know the first transaction , can I find the second transaction by it ?  Cause I see 1 input, 0 output in the tonscan

Bob | Cobo.com: I other words,I need to find a way to find  the after  transaction when I just know the txhash of the previous transaction in my work. (reply to 50570)

Оскар: because first tx (where wallet received 27 tons doesnt output more tx) but the second one have 4 output txs (reply to 50571)

Оскар: you can use https://toncenter.com/api/v3/#/default/get_transactions_api_v3_transactions_get  api/v3/transactions  out msgs (transactions) are in "out_msgs" of response (reply to 50573)

Bob | Cobo.com: Now I understood. Thanks you very much for your help .Wish you have a nice day. (reply to 50577)

Alhaji: Please can anyone tell me how I can get list of transactions using @ton/ton nodejs library?

Vladimir: use api (reply to 50580)

Father Pepe Of: Nodejs library don't work / sdk (reply to 50580)

Baldwin: Why are there no specific instructions for tokens or nft for tact? Actually, tact is a language that needs more attention

MEW: I want to check if a certain account can sell a specific token to verify if the token is a honeypot contract.   I'm currently implementing this in Sandbox, and would like to ask how to make the sender become a specified wallet for this selling transaction?

MEW: Does Blueprint and Sandbox have official discussion groups?

Fast is slow: hi I have the following code. And give me the error: Invalid type "Int?" for binary operator "+" if (self.farmCount.get(addr) != null) {             count = self.farmCount.get(addr) + 1;         }

Fast is slow: farmCount is a map

nohara: Hi, anyone know how to send jetton from a contract to an user's wallet?   Here is the case, i'm working on a staking contract, which someone can deposit jetton to the contract by sending  jetton to the contract address, and others can claim from this staking contract. The staking processing works fine, but the claim doesn't work. Tried to send a message with op::transfer() from contract to contract wallet address, doesn't work. What am i missing?

nohara: here is my func code

ACOM Sovereign: Any Developers interested in earning some TON to help us build some basic Telegram Mini Apps

nohara: and the message i send to the contract

Matthew: hello everyone, this is my code, but i receive tvm exit code = 0. can anyone help me

Zero: does anyone know where to get the LP status of a token on TON?

kevin: https://docs.ston.fi/docs/developer-section/api-reference/router#get_pool_address  are you looking for something like this ? (reply to 50603)

aslan: Hi, guys.I installed a ton full node, but can't sync blocks properly, could someone help me? https://github.com/ton-blockchain/ton/issues/967

Rahul: anyone knows Tonapi devs? Seems like their api stopped working overall

Rahul: there are new transactions here, but not showing up because their api is not working.

Rahul: tonviewer uses their api

&rey: Why should it? Try import { JettonMaster } from '@ton/ton`; (reply to 50613)

&rey: And... using TonWeb with @ton/ton is nonsense.

&rey: You should also add JettonWallet; yes, you can. (reply to 50620)

Panda: "error": "LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state"

Panda: How can I fix this error?

&rey: import { Address, toNano } from '@ton/core'; import { WatermelonToken } from '../wrappers/WatermelonToken'; import { NetworkProvider } from '@ton/blueprint'; import { JettonMaster, JettonWallet } from '@ton/ton';  export async function run(provider: NetworkProvider, args: string[]) {     const ui = provider.ui();      const address = Address.parse('xxxxxxxxx');     const userAddress = Address.parse('xxxxxxxxx');      if (!(await provider.isContractDeployed(address))) {         ui.write(`Error: Contract at address ${address} is not deployed!`);         return;     }      const watermelonToken = provider.open(WatermelonToken.fromAddress(address));     const jettonWalletAddress = await watermelonToken.getGetWalletAddress(userAddress);      ui.write(`jettonWalletAddress: ${jettonWalletAddress}`);          const jettonWallet = provider.open(JettonWallet.fromAddress(jettonWalletAddress));     const watermelons = await jettonWallet.getBalance();      ui.clearActionPrompt();     ui.write(`Jetton balance: ${watermelons.toString()}`); } (reply to 50622)

&rey: What are you trying to do? (reply to 50624)

Panda: deploy a wallet

Panda: endpoint: 'https://toncenter.com/api/v2/jsonRPC'

&rey: Have you set seqno to zero? (reply to 50628)

Jimmy Becen: Hi guys Is it possible to get messages through rpc like this api api/v3/messages?

&rey: Which of the messages? (reply to 50637)

Jimmy Becen: It is Emitting Logs! (reply to 50638)

&rey: Oh. Is one contract emitting logs, or several? (reply to 50639)

Panda: Of course i did it (reply to 50636)

&rey: Is that the full error text? (reply to 50623)

Panda: ^ AxiosError: Request failed with status code 500     at settle (/Users/meta/ton/wallet/node_modules/axios/lib/core/settle.js:19:12)     at IncomingMessage.handleStreamEnd (/Users/meta/ton/wallet/node_modules/axios/lib/adapters/http.js:589:11)     at IncomingMessage.emit (node:events:526:35)     at IncomingMessage.emit (node:domain:489:12)     at endReadableNT (node:internal/streams/readable:1359:12)     at processTicksAndRejections (node:internal/process/task_queues:82:21)     at Axios.request (/Users/meta/ton/wallet/node_modules/axios/lib/core/Axios.js:45:41)     at processTicksAndRejections (node:internal/process/task_queues:95:5)     at async HttpApi.doCall (/Users/meta/ton/wallet/node_modules/@ton/ton/dist/client/api/HttpApi.js:263:19)     at async HttpApi.sendBoc (/Users/meta/ton/wallet/node_modules/@ton/ton/dist/client/api/HttpApi.js:238:9)     at async TonClient.sendFile (/Users/meta/ton/wallet/node_modules/@ton/ton/dist/client/TonClient.js:188:9) {   code: 'ERR_BAD_RESPONSE',   config: {     transitional: {       silentJSONParsing: true,       forcedJSONParsing: true,       clarifyTimeoutError: false     },     adapter: [ 'xhr', 'http' ],     transformRequest: [ [Function: transformRequest] ],     transformResponse: [ [Function: transformResponse] ],     timeout: 30000,     xsrfCookieName: 'XSRF-TOKEN',     xsrfHeaderName: 'X-XSRF-TOKEN',     maxContentLength: -1,     maxBodyLength: -1,     env: { FormData: [Function], Blob: [class Blob] },     validateStatus: [Function: validateStatus],     headers: Object [AxiosHeaders] {       Accept: 'application/json, text/plain, */*',       'Content-Type': 'application/json',       'X-Ton-Client-Version': '13.11.1',       'X-API-Key': '55d27cc284e9b9bc3f508820e03efe1a94a93123d0f6e488c16988c2b33ada64',       'User-Agent': 'axios/1.6.8',       'Content-Length': '585',       'Accept-Encoding': 'gzip, compress, deflate, br'     },     method: 'post',     url: 'https://toncenter.com/api/v2/jsonRPC',     data: '{"id":"1","jsonrpc":"2.0","method":"sendBoc","params":{"boc":"te6cckECDgEAAXQAAkWIAPrs2BImR6D41UXQ+C4KNolGgIVTl+0WIUpICUlIOC7YHgELAgE0AgoBFP8A9KQT9LzyyAsDAgEgBAkCAUgFBgAE0DACAUgHCAAXuznO1E0NM/MdcL/4ABG4yX7UTQ1wsfgAlvKDCNcYINMf0x/THwL4I7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDoMAGkyMsfyx/L/8ntVABQAAAAACmpoxeDGjbQDxiIDNsXG5ergRtcWxQvL3GKNbz/6xLkHheKlwGaea6o4J3wjweBE5KNGBCM2GVxSVCGifhuxMhqCBjugfKCbcgQsmkndhBBI89dyvPkQsJKhPuJyWbBz8hF68XEACmpoxdmHgTAAAAAAAMMAWhCAC0jSl1pI9w0HjuuTX+5SmPbyoisEAMTzJr9IG8oYmo3oA5OHAAAAAAAAAAAAAAAAAABDQAeAAAAAEhlbGxvLCBUT04hN8Iq5w=="}}'   },   request: <ref *1> ClientRequest {     _events: [Object: null prototype] {       abort: [Function (anonymous)],       aborted: [Function (anonymous)],       connect: [Function (anonymous)],       error: [Function (anonymous)],       socket: [Function (anonymous)],       timeout: [Function (anonymous)],       finish: [Function: requestOnFinish]     },     _eventsCount: 7,     _maxListeners: undefined,     outputData: [],     outputSize: 0,     writable: true,     destroyed: false,     _last: true,     chunkedEncoding: false,     shouldKeepAlive: false,     maxRequestsOnConnectionReached: false,     _defaultKeepAlive: true,     useChunkedEncodingByDefault: true,     sendDate: false,     _removedConnection: false,     _removedContLen: false,     _removedTE: false,     strictContentLength: false,     _contentLength: '585',     _hasBody: true,     _trailer: '',     finished: true,     _headerSent: true,     _closed: false,     socket: TLSSocket {       _tlsOptions: [Object],       _secureEstablished: true,       _securePending: false,       _newSessionPending: false,       _controlReleased: true,       secureConnecting: false,       _SNICallback: null,       servername: 'toncenter.com',       alpnProtocol: false,       authorized: true,       authorizationError: null,       encrypted: true,       _events: [Object: null prototype],       _eventsCount: 10,       connecting: false,       _hadError: false,       _parent: null,       _host: 'toncenter.com',       _closeAfterHandlingError: false,

Panda: sorry it is so long

Panda: response: {     status: 500,     statusText: 'Internal Server Error',     headers: Object [AxiosHeaders] {       date: 'Tue, 16 Apr 2024 04:54:30 GMT',       'content-type': 'application/json',       'content-length': '134',       connection: 'close',       'access-control-allow-origin': '*',       'access-control-allow-methods': 'GET, POST, OPTIONS',       'access-control-allow-headers': 'User-Agent,Keep-Alive,Content-Type,X-API-Key,X-Ton-Client-Version,X-Ray-ID',       'access-control-expose-headers': 'Content-Length,Content-Range',       'cf-cache-status': 'DYNAMIC',       server: 'cloudflare',       'cf-ray': '875193e4ca2385e0-HKG'     },     config: {       transitional: [Object],       adapter: [Array],       transformRequest: [Array],       transformResponse: [Array],       timeout: 30000,       xsrfCookieName: 'XSRF-TOKEN',       xsrfHeaderName: 'X-XSRF-TOKEN',       maxContentLength: -1,       maxBodyLength: -1,       env: [Object],       validateStatus: [Function: validateStatus],       headers: [Object [AxiosHeaders]],       method: 'post',       url: 'https://toncenter.com/api/v2/jsonRPC',       data: '{"id":"1","jsonrpc":"2.0","method":"sendBoc","params":{"boc":"te6cckECDgEAAXQAAkWIAPrs2BImR6D41UXQ+C4KNolGgIVTl+0WIUpICUlIOC7YHgELAgE0AgoBFP8A9KQT9LzyyAsDAgEgBAkCAUgFBgAE0DACAUgHCAAXuznO1E0NM/MdcL/4ABG4yX7UTQ1wsfgAlvKDCNcYINMf0x/THwL4I7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDoMAGkyMsfyx/L/8ntVABQAAAAACmpoxeDGjbQDxiIDNsXG5ergRtcWxQvL3GKNbz/6xLkHheKlwGaea6o4J3wjweBE5KNGBCM2GVxSVCGifhuxMhqCBjugfKCbcgQsmkndhBBI89dyvPkQsJKhPuJyWbBz8hF68XEACmpoxdmHgTAAAAAAAMMAWhCAC0jSl1pI9w0HjuuTX+5SmPbyoisEAMTzJr9IG8oYmo3oA5OHAAAAAAAAAAAAAAAAAABDQAeAAAAAEhlbGxvLCBUT04hN8Iq5w=="}}'     },     request: <ref *1> ClientRequest {       _events: [Object: null prototype],       _eventsCount: 7,       _maxListeners: undefined,       outputData: [],       outputSize: 0,       writable: true,       destroyed: false,       _last: true,       chunkedEncoding: false,       shouldKeepAlive: false,       maxRequestsOnConnectionReached: false,       _defaultKeepAlive: true,       useChunkedEncodingByDefault: true,       sendDate: false,       _removedConnection: false,       _removedContLen: false,       _removedTE: false,       strictContentLength: false,       _contentLength: '585',       _hasBody: true,       _trailer: '',       finished: true,       _headerSent: true,       _closed: false,       socket: [TLSSocket],       _header: 'POST /api/v2/jsonRPC HTTP/1.1\r\n' +         'Accept: application/json, text/plain, */*\r\n' +         'Content-Type: application/json\r\n' +         'X-Ton-Client-Version: 13.11.1\r\n' +         'X-API-Key: 55d27cc284e9b9bc3f508820e03efe1a94a93123d0f6e488c16988c2b33ada64\r\n' +         'User-Agent: axios/1.6.8\r\n' +         'Content-Length: 585\r\n' +         'Accept-Encoding: gzip, compress, deflate, br\r\n' +         'Host: toncenter.com\r\n' +         'Connection: close\r\n' +         '\r\n',       _keepAliveTimeout: 0,       _onPendingData: [Function: nop],       agent: [Agent],       socketPath: undefined,       method: 'POST',       maxHeaderSize: undefined,       insecureHTTPParser: undefined,       joinDuplicateHeaders: undefined,       path: '/api/v2/jsonRPC',       _ended: true,       res: [IncomingMessage],       aborted: false,       timeoutCb: null,       upgradeOrConnect: false,       parser: null,       maxHeadersCount: null,       reusedSocket: false,       host: 'toncenter.com',       protocol: 'https:',       _redirectable: [Writable],       [Symbol(kCapture)]: false,       [Symbol(kBytesWritten)]: 0,       [Symbol(kNeedDrain)]: false,       [Symbol(corked)]: 0,       [Symbol(kOutHeaders)]: [Object: null prototype],       [Symbol(errored)]: null,       [Symbol(kHighWaterMark)]: 16384,       [Symbol(kRejectNonStandardBodyWrites)]: false,       [Symbol(kUniqueHeaders)]: null     },     data: {       ok: false,       error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state',       code: 500     }   } }

&rey: How did you create that external message?

&rey: Tonapi fails to decode it as one.

Zero: am looking for an API that can provide LP tokens locked percentage for any token (reply to 50604)

Zero: if there's no API then any way of finding it myself?

Zero: there's a dead address so can checking the LP held by it but there are other ways too ig

Zero: like Ton Raffles and Ton Inu that provide lock

Panda: const externalMessage = beginCell().   storeUint(0b10, 2). // indicate that it is an incoming external transaction   storeUint(0, 2). // src -> addr_none   storeAddress(contractAddress).   storeCoins(0). // Import fee   storeBit(1). // We have State Init   storeBit(1). // We store State Init as a reference   storeRef(stateInit). // Store State Init as a reference   storeBit(1). // We store Message Body as a reference   storeRef(body). // Store Message Body as a reference   endCell(); (reply to 50649)

Panda: client.sendFile(externalMessage.toBoc());

&rey: I think you've forgotten to store creation and logical time in the message.

Panda: .storeUint(Math.floor(Date.now() / 1e3) + 60, 32)

&rey: Even .storeUint(0, 32) would be valid — actually, validators rewrite this field. (reply to 50660)

Panda: Thanks

Panda: How can I fix this? any hints? (reply to 50661)

Panda: I deployed to testnet ,it worked...

Development: Hi. Ready to crack the potential of my mind and reach new heights with you! 💡 Trained in The Open Network and skilled in blockchain programming, I'm ready to contribute to your projects. 💼 For the first week-month my rate is only $30 per hour, and then $50 per hour. 📈 Plus, I will provide all the necessary training material at a discount! 📚 Let's create something awesome together!

&rey: let count: Int? = ... (reply to 50669)

&rey: Also, your contract architecture is wrong. Since there won't be more than 32K entries in farmCount, one users can hinder others from using the contract. You should consider sharding it in separate contracts for each user (+ supporting SBT standard would be a next logical step).

&rey: I issue you a moderator warning.  If your message had more emojis, it would've been indistinguishable from scam. If you'd put more desperation in it, it would cross the line to begging. At the moment, you've crossed neither, but I feel obliged to warn. (reply to 50665)

&rey: Then you need to disable the formatter (perhaps for that line). (reply to 50674)

&rey: I don't use any. (reply to 50676)

Jimmy Becen: contract emitting logs (reply to 50640)

Matthew: hello everyone, max dictionary element?

&rey: In FunC, udict_get_max? (reply to 50683)

Matthew: max length? (reply to 50684)

&rey: You mean, current length? Should be counted separately. (reply to 50685)

&rey: Double length is upper-bounded by count of cells that can be stored in contract – that is, 65536.

Matthew: I mean how many key values ​​can I add to the dictionary, sorry I didn't ask clearly (reply to 50686)

&rey: 32767, if your contract doesn't have other values stored. (reply to 50689)

&rey: Get transactions of that contract, logs should be in outMsgs. (reply to 50682)

&rey: Problem in line 209, column 22, you've typo in "balance". (reply to 50693)

&rey: If there are 32K unique addresses using your game, next user will be unable to join, and previous ones will pay extremely high computation fees. (reply to 50695)

Matthew: line 209? (reply to 50694)

&rey: That's what the photo said. (reply to 50698)

Matthew: no, that's just an error when I compiled the code. I'm concerned with the above structure, how many key value pairs can my bid_params dict contain? (reply to 50699)

&rey: Make each user interact with separate farm contract. These will be equivalent to SBTs. Or jettons, I guess. (reply to 50701)

&rey: Up to 32765. (reply to 50702)

Matthew: ok thanks (reply to 50704)

&rey: You have to use that architecture, so it makes sense to label your farms NFTs; one could watch over them via explorer this way. (reply to 50706)

&rey: Or, if land is transferrable, you should consider jettons.

Michael: Hi, is there a way to read the value such as balance using tonconnect/ui-react this package? Thank you

aslan: Hi, guys.I installed a ton full node, but can't sync blocks properly, could someone help me? https://github.com/ton-blockchain/ton/issues/967

&rey: No, it's write-only interface to blockchain. (reply to 50712)

Michael: Thanks, so how can I read the value such as the balance? which package should I use in React? (reply to 50714)

&rey: decimals = 0 solves your problem. (reply to 50715)

Ton: hello guys! any tutorials for wrappers? I think I am ok with func and test, but not for wrappers

&rey: Though, should land be displayed in indivisible units altogether?

Ton: I am stunned because of it

Ton: hello, sir, any recommedations? (reply to 50719)

Ton: appreciate it very much if you tell me something

&rey: Yeah. Example. https://github.com/ProgramCrafter/wallet-contract/blob/main/wallet-inplug-v2.ts (reply to 50722)

Ton: ok thank you

Ton: I want to initiate my contract  and the error shows :  Argument of type 'MainContract' is not assignable to parameter of type 'Contract'.   Types of property 'init' are incompatible.     Type '{ code: Cell; data: Cell; } | undefined' is not assignable to type 'Maybe<StateInit>'.       Type '{ code: Cell; data: Cell; }' is not assignable to type 'Maybe<StateInit>'.         The types of 'code.bits' are incompatible between these types.  code like this:  const myContract = blockchain.openContract(       await MainContract.createFromConfig(         {           owner: initAddress.address,         },         codeCell       )     );  and this is my MainContract:    import {   Address,   beginCell,   Cell,   Contract,   contractAddress,   ContractProvider,   Sender,   SendMode, } from "ton-core";  export type MainContractConfig = {   owner: Address; };  export function mainContractConfigToCell(config: MainContractConfig): Cell {   return beginCell().storeAddress(config.owner).endCell(); }  export class MainContract implements Contract {   constructor(     readonly address: Address,     readonly init?: { code: Cell; data: Cell }   ) {}    static createFromConfig(     config: MainContractConfig,     code: Cell,     workchain = 0   ) {       const data = mainContractConfigToCell(config);       const init = { code, data };       const address = contractAddress(workchain, init);        return new MainContract(address, init);   }   async getSenderAddress(provider: ContractProvider) {     const { stack } = await provider.get("load_data", []);     return {       recent_sender: stack.readAddress(),     };   }   async sendInternalMessage(     provider: ContractProvider,     sender: Sender,     value: bigint   ) {     let { stack } = await provider.get("parse_sender_address", []);     console.log(stack)     let recent_sender = stack.readAddress();     let owneraddress = await provider.get("load_data", []);     // let owneraddress = stack.readonly();      await provider.internal(sender, {       value,       sendMode: SendMode.PAY_GAS_SEPARATELY,       body: beginCell().storeAddress(recent_sender).endCell(),     });   } }

wikig: Hello guys , is there any TON mixer onchian ?

wikig: Most of mixer i found is more than 5 years ago  https://github.com/dkaraush/ton-mixer  And none of them still alive ....

Michael: Hello, how can I read the value such as the balance? which package should I use in React?

K.: You can use @ton/ton to get a TonClient and query the balance.  Like in Step 8 of this tutorial: https://tonhelloworld.com/01-wallet/ (reply to 50737)

K.: If you have a get method on your smart contract to query the balance, they you can use the same library to call the contract.  Step 9 here: https://tonhelloworld.com/02-contract/

Tolya: Reducing transaction costs — a guideline for developers — MUST READ  As you know the TON provides for the possibility of reducing the price of gas and message forwarding by a network-wide vote.  What developers need to know with this lowering transaction costs:  1) Current smart contracts where fees are hardcoded will not break, as there will be a decrease of gas/forward price, not an increase.  2) Please use new TVM opcodes in your smart contracts to dynamically calculate fees and do not hardcode fees in Toncoins in the smart contract code.  3) No one knows Toncoin future market dynamic. This means that after a decrease, after some time there may be a increase of transaction costs measured in TON.  Never hardcode fees in Toncoin at a reduced price in the smart contract code, otherwise your smart contract will break at a possible increase of gas price.  We can guarantee that the gas price will not be higher than the current price (as of April 16, 2024). (forwarded from TON Dev News)

Midnight: Hey, every one has slow transaction at current time?

wonderful: Has anyone used it before

Jimmy Becen: hi guys, how to parse this value

musashi: is there API for getting holders of a specific jetton?

kevin: https://tonapi.io/api-v2 (reply to 50752)

musashi: thanks sir

Blockchain Dev: I need an investor to support me, receive a 50% presale discount on the memecoin project. Hold to die!!!

K.: Can’t you simply send  1 TON+gas fee to account for that? From how you describe the problem, that’s the obvious solution. (reply to 50748)

K.: https://docs.ton.org/develop/smart-contracts/fees (reply to 50760)

K.: If you send 1 TON to the contract with a “Pay fees separately” mode, then the contract will receive exactly 1 TON to its balance. (reply to 50762)

K.: https://docs.ton.org/develop/smart-contracts/messages#message-modes

User<5606745514>: Hi, Everyone. Plz let me know the contact address of the token that is launched in TON test network.

K.: You define it when sending a transaction. (reply to 50768)

User<5606745514>: Does anyknow know about this? (reply to 50766)

Ha: Hello, everyone. How does Ton implement cross-contract call

User<5606745514>: Plz give me transaction url.

Panda: Someon can tell me, why I sent 0.5 ton to my wallet ,it balance 0?

Panda: https://tonscan.org/address/UQB9dmwJEyPQfGqi6HwXBRtEo0BCqcv2ixClJASkpBwXbOjf#transactions

K.: https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees (reply to 50773)

K.: Transaction was reverted (reply to 50778)

Panda: But sender not received back ton

Panda: where is 0.5 ton?

Panda: 😂

K.: sender received back 0.499 TON (reply to 50781)

Klay.D: what is max_viewed_cells in compute_data_size func?

Panda: Ok I check it (reply to 50785)

Panda: But I don't know why reverted?

Philip 菲力: yes he did received the TON: https://tonviewer.com/transaction/d6632f1c942ad5bc662182387898ab94873e3e3833674734429858d3f96d50a3 (reply to 50781)

Philip 菲力: use tonviewer for better view for the flow, tonscan sucks

Panda: Ok thanks

User<5606745514>: Plz let me know about this. (reply to 50766)

&rey: Have you set that in jetton content? (reply to 50729)

Screens: Hi all, not sure if this is this best channel to ask?..but here goes   I am a co-founder of an AI powered sports betting and casino platform. We use the latest in machine learning theory (LSTM/RNN) to process data and predict outcomes of sporting events. We already have a working product for Baseball and are looking to build out a full sportsbook and casino platform.   We are impressed by TONs technology stack, but want to learn about the community and ultimately looking to launch a token. How do people do that on $TON are there launch pads? Are there investor/whale groups where we can talk directly with TON investors?  Any pointers most welcome

Josip: Look into Tonstarter for example or  - https://ton.org/grants or  - https://ton-org.notion.site/TON-Accelerator-2f8e21d464234258a9cd43e8adf7ae9e or  - https://toncoin.fund/  You may also want to submit your app to App center: @app_moderation_bot (reply to 50800)

&rey: Does AI improve your calibration compared to other prediction markets?  You can ultimately create a token (minter.ton.org can help you, since I do not foresee additional functionality in your jetton itself)! (reply to 50800)

Matthew: hi all, now() return secord or milisecord?

&rey: Seconds. Of block generation. (reply to 50803)

Heydar: guys when you send a code to deploy on TON , how much money you will send with that to remain on the blockchain? or Im thiking in wrong way?

Heydar: I mean how you calculate the minimum ton requirement for 1year (reply to 50805)

musashi: hi all, each key-value in a dictionary takes 1 cell of storage, right?

musashi: you can read more here https://docs.ton.org/develop/smart-contracts/fees#storage-fee (reply to 50806)

&rey: No. Since they need to be combined into tree, if dictionary has N key-value pairs, it has 2N-1 cells. (reply to 50807)

&rey: Assuming that value is short enough to be stored as slice.

&rey: If you use udict_set_ref or like, dict will have 3N-1 cells.

musashi: wow, seems like using dictionary on Ton is quite expensive

&rey: 0.05 TON is almost always enough. You don't need to pay for 1 year of storage upfront. (reply to 50805)

Heydar: Thanks, but this work for just few days , right? why I dont need that? do you mean that I can add more ton later? (reply to 50813)

&rey: Yes, or users during contract operation. (reply to 50814)

&rey: Unless contract is big, for a month at least. (reply to 50814)

Heydar: thanks , how about dynamic storage, like dict? how it will be calculated? (reply to 50816)

&rey: You need to count all cells and all bits in storage. (reply to 50817)

musashi: for example we have a contract with 1 MB storage and it has no transactions for a year, then an user call the contract, does he have to pay 6 TON for his transaction?

Heydar: nice bussiness plan , I like it 😂😂 (reply to 50819)

Sonny: How can I know how many MB the contract is storing?

&rey: Validators probably do so as well) (reply to 50820)

musashi: if so, what should we do to create better UX?

musashi: if I was that user, I will think that 'oh, something wrong with the wallet' =)

&rey: See in dton.io. In most cases, less than 4 KB. (reply to 50821)

&rey: Periodically pay for your contract storage, maybe) (reply to 50823)

Heydar: Im wonder that smart contract can handle a game that need refreshrate about 1second. is that possible?

&rey: With certain offchain help, like payment channels, yes. (reply to 50827)

&rey: That requires either a backend or a WebRTC connection between players, though.

Heydar: how I can find more information about that and a tutorial? (reply to 50830)

&rey: In docs.ton.org, surprisingly! (reply to 50832)

Crypy 🇳🇱: Hello, we are a team of developer on telegram and ton ecosystem, just wonder if there is an API to bridge the usdt for eth/tron to ton as we are about to launch the jetton of our project

Heydar: Im absolutely ok with that ! just my problem is that the smartcontract need a long time to accept a transactions, so the players cant interact with eachother under 1seconds on TON (reply to 50831)

Heydar: I should search again for the payment channels ... in that , I didnt see that in the docs. (maybe cause of that Im not reading right :D) (reply to 50833)

Screens: Yes it does, we will use it as the core of our risk management engine to offer odds like traditional bookmakers (not prediction markets) a fully licensed sportsbook. We back tested our baseball models over the 2023 season and had a 6-8% margin over pinnacle (one of the largest US sports book) we may also look to build.these 'odds Oracles' on-chain. Accessed by tokens. Lots cooking.  We are not really interested in grant programmes for 50k, we have a working and probable.product already and are looking to raise funds to build out the full sports book and casino platform 750k-1m over 9-12 months. We prefer token raise to VC raise as we want to be for the people.   Can legit projects raise this kind of money on $TON via token sale/IDO? (reply to 50802)

&rey: TON is The Open Network. Some launchpads may reject your applications, some will accept. In either case, hosting a static page about your project in TON Storage would be beneficial. (reply to 50838)

&rey: Sum raised isn't question for developers chat, actually. Perhaps you would like a prediction market on that.

Deniel: Hello! I'm currently trying to customize a tonconnect ui, but here (https://docs.ton.org/develop/dapps/ton-connect/react) I didn't found what I need - display qr on connect wallet popup opening (like on screenshot)  And also would be great if someone tell me how to hide that TON icon from the connect button

&rey: 1. @tondev (reply to 50845)

Vladimir: Perhaps you are on the black list. (reply to 50848)

&rey: 2. No. Supply is 5bn + validators' reward -- burned fees. (reply to 50845)

NFN: Hi anyone knows that how can i get the jetton wallet address that dex uses to swap a coin for me?

musashi: hey guys, any example contracts that ultilize these updates? https://docs.ton.org/learn/tvm-instructions/fee-calculation-instructions#opcodes-to-process-config-parameters

K.: It just went live today and still in preview in blueprint and sdks, so you’ll have to wait a bit for examples :) (reply to 50855)

Nxrix: I know this is a little off topic but is there a way to know how much bitcoin is connected to TON markt cap?

musashi: is it a good practice to use msg_fwd_fee() instead of a hardcoded fee?

musashi: https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc

Behrang: There are new opcodes for calculating fees. Use them. They're easy and cheap. (reply to 50858)

Behrang: https://docs.ton.org/learn/tvm-instructions/fee-calculation-instructions

musashi: that's why I asked for some examples using these opcodes lol (reply to 50862)

K.: I’ll try to assemble some later today. Will probably need to rewrite most of my contracts with them anyway. (reply to 50864)

musashi: i'm waiting for that sir

musashi: hmm seems like our group auto delete messages with emoji

czajek: Who should I talk to if I sent funds to the hot TON wallet?

Behrang: More detail are available here:  https://t.me/tondev_eng/50741 (reply to 50864)

Behrang: Another example here:  https://github.com/HipoFinance/contract/blob/d5b0d2eab0ff64a0b148c0e36acb61afac202b12/contracts/imports/utils.fc#L481 (reply to 50866)

K.: This is not using the new op codes, right? As far as I see it relies on a custom calculator. (reply to 50875)

Ma><im: hello everyone! please tell me, is it preferable to organize the unloading and loading of contract memory through global variables?   and not just by passing arguments to set_data and taking from load_data

peilipu: hello everyone, which wallet i can't add custom jetton and transfer?

peilipu: seems like the chrome extension is not support jettons

czajek: https://twitter.com/Czajek93/status/1780214659406073927

Screens: Thanks for your reply, yes I understand this is probably not the best group for such a question, is there a better one you can point me too? Perhaps a whale or investor group? (reply to 50842)

Nacho: Hey there! Is there a way to get the transaction hash from the body obtained in query.Info? e.g.:  ({    "@type":"query.info",    "id":1,    "valid_until":1713277676,    "body_hash":"TIb1.....al7B70=",    "body":"te6cckEBAgE......ZXJlZPeVcpM=",    "init_state":"",    "@extra":"1713277635.399508:0:0.4140636815706208" }, {    "@type":"ok",    "@extra":"1713277637.295559:0:0.05489693502345294" })

User<6703584027>: 9k DEVs? Beautiful!

musashi: in the msg_fwd_fee method, which contract does the init_state argument represent? int msg_fwd_fee(slice destination, cell message_body, cell init_state, int max_viewed_cells) inline

musashi: the destination contract init state?

Slim: hi guys, please can anyone tell me how to deploy a newly created ton wallet with javascript

Mithra: Hi, guys. Are there reliable Ton-Testnet RPC nodes people can use without being rate-limited?

Behrang: It's using the new opcodes. (reply to 50876)

Behrang: Yes, but don't use that method from reference jetton implementation. Instead, use the new opcodes. (reply to 50901)

Rishabh: Hey everyone, I tried to get the balance of a ton testnet wallet address. it works. but, when I try to get the token balance (USDC) from the same rpc. I get Error 429: Too Many Requests.

Behrang: Each has it's own advantages and disadvantages.   If you use global variables, you will end up with fewer lines of code and more readable code. But gas fee may increase slightly. This depends on the code and you have to test it.  If you don't use global variables, you will end up with a more complex stack, which may also need some gas fee to manage the stack.  You may test both approaches and decide on one.  I personally started without using global vars, but after a while, switched to global vars, and my code is smaller and more readable. Maybe gas fees are increased a little, but I value readability. (reply to 50882)

K.: Ah, I see it now :) My bad (reply to 50909)

Behrang: If you're using toncenter api, add a delay of 1 second between your requests. (reply to 50912)

Rishabh: I am only sending one request (reply to 50915)

User<7195257024>: Hello, I am a developer looking for a job. web3, smart contract and scripts of any complexity

K.: then wait for some time, you probably made too many recently (reply to 50916)

Rishabh: I tried with a vpn aswell still doesn’t work (reply to 50918)

K.: are you 100% sure you are not making multiple requests per second? (reply to 50919)

Rishabh: Yes (reply to 50920)

Rishabh: (0 , paddedBits_1.bitsToPaddedBuffer)(...).copy is not a function whats this error?

inv: Anyway, try adding a 5 second timeout after the request. Did that solve your problem? (reply to 50912)

Sumit: descriptor.js:31 Uncaught (in promise) TypeError: (0 , paddedBits_1.bitsToPaddedBuffer)(...).copy is not a function     at getRepr (descriptor.js:31:1)     at wonderCalculator (wonderCalculator.js:117:1)     at new Cell (Cell.js:128:1)     at ./node_modules/@ton/core/dist/boc/Cell.js (Cell.js:207:1)     at options.factory (react refresh:6:1)     at webpack_require (bootstrap:22:1)     at fn (hot module replacement:61:1)     at ./node_modules/@ton/core/dist/boc/Builder.js (Builder.js:12:1)     at options.factory (react refresh:6:1)     at webpack_require (bootstrap:22:1)

Sumit: what am i doing wrong?

&rey: You probably have content JSON somewhere. (reply to 50922)

&rey: You need to change it.

&rey: Depending on what should "pay fees separately". (reply to 50934)

Kay: Hello all , I would like to ask if the Tact language is a genuine support to replace FunC and is created by the foundation team.

&rey: Tact has a larger support team than FunC, although probably not the foundation one. (reply to 50936)

Hustle: Hello, could someone here can make the "jetton minter" page into a telegram bot, where we can deploy jettons?  If yes, ping me please if you guys are okay with our budge of 1000$

&rey: Try attaching "minter.ton.org" page as TMA to your bot. (reply to 50938)

Zachary: TMA? (reply to 50940)

&rey: While developing in Tact, you'll run into certain unsolvable problems and a few easy ones. (reply to 50936)

&rey: Telegram Mini App (= into a Telegram bot). (reply to 50943)

&rey: Frontend. (reply to 50948)

&rey: If you do transaction via TON Connect, that should've been done already. (reply to 50951)

&rey: Does message fail at the first require or somewhere in mint function?

Svαtoωλ‎: how to allow only one person with key access to own liteserver? And how i can create multiple keys for each user

Hustle: Thankyou ❤️. But we are lookin to build like a traditional bot with commands etc (reply to 50940)

Louis: oh???

Louis: I'm talking about creating a jetton contract, why was my message deleted?

Louis: when I create jetton A, how do I know what Bob's or Alice's jetton wallet A is? Is there any way for me to find out?

Dmitry | backend4you.ton: Usually, you dont need it. More details in https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md (reply to 50977)

Danny: How do I fix this issue in my Telegram Mini App? I get a successful request for my Telegram mini app on desktop devices but returns a request status code of 0 ("Request aborted") on some user's Telegram Mini App.

&rey: Restricting jettons to certain users is not aligned with open, equal-permissioned community and is borderline with scam. (reply to 50976)

Boris: well, one could bind it to a NFT/SBT condition for example (reply to 50981)

Slim: hi guy

Slim: please how to deploy anewly created wallet

Slim: with javascript

virgiltho | SUIcker.xyz: hey, is there any public repository with jetton deployment scripts using blueprint stack?

Slim: hii, did you find a solution to this (reply to 50023)

K.: https://tonhelloworld.com/01-wallet/ (reply to 50984)

DevBot: guys i need to read all transactions from the jetton addres

Slim: this doesnt work

DevBot: import { HttpClient, Api } from 'tonapi-sdk-js';  // Configure the HTTP client with your host and token const httpClient = new HttpClient({     baseUrl: 'https://tonapi.io/',     baseApiParams: {         headers: {             Authorization: no key provided , // Replace YOUR_TOKEN with your actual token             'Content-type': 'application/json'         }     } });  // Initialize the API client const client = new Api(httpClient);  async function fetchAllJettons() {     try {         let hasMore = true;         let offset = 0;         const limit = 50;  // Fetch 50 jettons at a time, adjust as necessary          while (hasMore) {             const jettons = await client.jettons.listJettons({ limit, offset });             console.log("Jettons Data:", jettons);              // Print each jetton info if needed             jettons.items.forEach(jetton => {                 console.log(Jetton Address: ${jetton.address}, Symbol: ${jetton.symbol}, Name: ${jetton.name});             });              // Update offset to fetch the next batch of jettons             offset += limit;             hasMore = jettons.items.length === limit; // Check if there are more jettons to fetch         }     } catch (error) {         console.error("Error fetching jettons:", error);     } }  fetchAllJettons('EQDQMxKXCEWs4ILJltwZKXyeBnqr79evv0ROARFi2NapQthS');

K.: https://github.com/ton-blockchain/token-contract uses blueprint but one of the scripts in broken. Had to rewrite it myself. (reply to 50987)

Slim: they direct you to use tonkeeper which will deploy automatically and i want to deploy with javascript (reply to 50989)

K.: From Steps 6 it shows how to make and use a wallet using JS (reply to 50995)

Slim: yes, but the wallet satus is still inactive even after sending ton to it

Slim: this is the wallet

Slim: EQCJAFays-CfDPdtK178HHGC1fAO11BYl59zx2VNPZQvoinn

virgiltho | SUIcker.xyz: oh thanks. Can you say which one was broken? (reply to 50994)

K.: `minterController.ts`is broken, deploying works fine 👌 (reply to 51002)

K.: Also wrapper works and other stuff.

K.: send something from that wallet and it will become active, like 0.0001 TON (reply to 50997)

Slim: this is only using tonkeeper (reply to 51006)

Slim: i want to do it with javascript

Slim: did you ever find out how to do this (reply to 34449)

Crypto A99: same issue. ton-connect can't pop up TonSpace confirmation at web app. (reply to 45040)

Амир: have someone faced with such issue?

&rey: This name should start with capital letter. (reply to 51013)

Андрей: Hi, has anyone added liquidity to dedast pools through smart contracts on funC? I only found libraries for TS. I would like to know in what format to send messages (I assume an empty message with tones/tokens, but I want to make sure)

Oba: How do you add liquidity pool to a ton token created on ton minter?

K.: By adding it on a DEX: https://ton.app/dex (reply to 51017)

Амир: Pls help, how much grams in 1 ton?

Амир: Not grams, nanoTons

Komron: export const toNanoTON = (amount: number) => String(amount * 10 ** 9); (reply to 51019)

virgiltho | SUIcker.xyz: how can I store slice value as a global (or even as local) variable? Would like to store a raw address of other contract/account

virgiltho | SUIcker.xyz: In funC of cource

K.: 1 TON = 1*10^9 nanoTON (reply to 51020)

K.: If you want to store some address in a smart contract, you can use the set_data function and storeAddress (reply to 51022)

virgiltho | SUIcker.xyz: yea, but i'm looking for something similar to it but for slice  int workchain() asm "0 PUSHINT";

Sumit: require(myBalance() > amount, "Insufficient Funds");         self.TVL -= amount;         send(SendParameters{value: amount, to: to, body: "From Emmet.Finance Bridge".asComment(), bounce: true});

Sumit: my this transaction is failing with Code 40

Sumit: what could be the problem?

Haq: Guys can you help me pls. How to create instance of contract which I build in Tact in my Web app to be able to read data and use get functions from my contract?   And second question is somewhere documentation or some example how to build and send message with the type and custom payload via TonConnect?   Thank you for any help / information ☀️

Амир: Tell me where is better to store the address of the contract owner, in c4 or c7 (global variables)

Sumit: imagine i want to pay just 14nano to someone, how do i do that? (reply to 51030)

Олег: Hello, I'm trying to make a token, I took the token details from a friend, he said figure it out, and I have these lines. Can you please tell me what this is and how it is implemented?  Tokenomics:  50% LP Locked 15% Dex Listing/Partnerships 15% Development and Marketing 10% Dev/Team (Locked for 3 month) 10% Airdrop  Trading % Percentage  Buy = 0% Sell ​​= 1%

Олег: That is, I deploy the token, and its owner then implements Tokenomics?

— 2024-04-17 —

Omprakash: Notcoin Voucher still not received txn Date 1st April......? Any update about it pls help

MEW: any LP token locker on TON?

MEW: any chart tool besides geckoterminal?

Russia: hello guys, I am making a bridge from Ton to ethereum and Ethereum to TON. Can anyone share with me the documents to do this?

Амир: Can someone explain how to accept transactions only from wallets. For example only having their code

Russia: hello guys, I am making a bridge from Ton to ethereum and Ethereum to TON. Can anyone share with me the documents to do this?

Kabir: The same issue please (reply to 51060)

末: Recruitment: TON Wallet Developer  We are currently seeking experienced blockchain developers to join our project and collaborate on the development of a TON wallet. If you are passionate about cryptocurrencies and blockchain technology, and have relevant development experience, we welcome your application.  Requirements:  - Proficiency in blockchain technology and cryptocurrencies - Experience in developing wallets for TON or similar platforms - Ability to work independently while also collaborating within a team  We offer:  - Competitive compensation - Flexible working hours  If interested, please contact us via private message. We look forward to collaborating with you!

Baldwin: Honestly speaking, we should focus more on tact than fc language, it will be very difficult for newbies to learn fc and tact language is very close.

Satoshi: const { amount, addressOne, addressTwo } = req.body;    console.log("amount:", amount);    try {      if (!process.env.MNEMONIC) {        throw new Error("Environment variable MNEMONIC is required.");      }      const tonClient = new TonClient4({        endpoint: "https://mainnet-v4.tonhubapi.com",      });        const mnemonic = process.env.MNEMONIC.split(" ");        const keys = await mnemonicToPrivateKey(mnemonic);      const wallet = tonClient.open(        WalletContractV4.create({          workchain: 0,          publicKey: keys.publicKey,        })      );      console.log("wallet:", wallet);      const sender = wallet.sender(keys.secretKey);      console.log("sender:", sender);      const factory = tonClient.open(        await Factory.createFromAddress(MAINNET_FACTORY_ADDR)      );      console.log("factory:", factory);      console.log("addressOne:", addressOne);      const SCALE_ADDRESS = Address.parse(addressOne);      console.log("SCALE_ADDRESS:", SCALE_ADDRESS);      const TON = Asset.native();      console.log("ton:", TON);      const SCALE = Asset.jetton(SCALE_ADDRESS);      console.log("SCALE:", SCALE);      const pool = tonClient.open(        await factory.getPool(PoolType.VOLATILE, [SCALE, TON])      );      console.log("pool:", pool);      const poolAddress = pool.address;      console.log("poolAddress:", poolAddress);      const scaleVault = tonClient.open(        await factory.getJettonVault(SCALE_ADDRESS)      );      const scaleRoot = tonClient.open(        JettonRoot.createFromAddress(SCALE_ADDRESS)      );      console.log("scaleRoot:", scaleRoot);      const scaleWallet = tonClient.open(        await scaleRoot.getWallet(sender.address)      );      console.log("scaleWallet:", scaleWallet);      const amountIn = toNano(amount);      console.log("amountIn:", amountIn);      console.log("AWAIT ...");      console.log("scaleVaultAddress:", scaleVault.address);      sleep(2500);      const response = await scaleWallet.sendTransfer(sender, toNano(amount), {        amount: amountIn,        destination: scaleVault.address,        responseAddress: sender.address, // return gas to user        forwardAmount: toNano("0.25"),        forwardPayload: VaultJetton.createSwapPayload(poolAddress),      });      console.log(response);      console.log("success");        res.status(200).json(response);

Satoshi: I can't execute the above code, can anyone tell me the reason?

Omprakash: Who is taking care of this....? Response awaited.......? You guys can't help.....?  . . Still notcoin voucher not received or refund for this (reply to 51060)

Satoshi: I was not able to swap from jetton to ton

Raden0x: anyone know the best place to find airdrops on TON only?

Satoshi: I just received a schedule to send and receive free gas (reply to 51078)

&rey: No. We do not have authority over Notcoin project. (reply to 51079)

Omprakash: Who can help me... (reply to 51085)

Puneet: Anyone building an memecoin utility on Ton like pump.fun

Satoshi: I used the code from ton's documentation but could not perform the swap

Aka | Web3 builder: hi team, why i submit app and wait 1 month not receive feedback

Haq: Up 🥺 (reply to 51037)

&rey: c7 do not persist between transactions. (reply to 51039)

Heydar: guys do you have any link of a github source that using twa and telegraf for creating a simple TWA?

ARSUN: using users tonkeeper wallet address I need find user have balance in  gram/ton ,anon/ton this pairs

K.: Just a side note, this test case will almost always succeed. You should check that the transaction was actually successful and also use test case functionality like expect and others to actually check some values. For instance, you could compare the balance before and after. (reply to 51120)

Rhonda: How to transform a user-friendly address into a raw one?

K.: toRawString()  https://docs.ton.org/develop/dapps/cookbook#how-to-convert-user-friendly---raw-assemble-and-extract-addresses-from-strings (reply to 51129)

Rhonda: thx,bro (reply to 51130)

wikig: Hello guys , is there any open source TON mixer onchain ?

&rey: You may be interested in Tonnel project. (reply to 51137)

&rey: .mint() isn't a black-box function itself, is it? (reply to 51135)

User<5018886941>: Sabah al-khayr

Sonny: Let me ask, how can the front end catch the transaction event whether it is processed successfully or failed or pending

Sonny: when I confirm , such data is received

wikig: Thanks ! (reply to 51139)

Jitsu: hey I see top 10 holders hold 60% of TON supply. And top 100 holders hold 90% of TON. This is not FUD, but many people say TON is a scam because of this, can you please clarify this situation for me? It is no FUD I simply want more clarification as a holder and believer of TON

Jitsu: this is not FUD, I just want to get some more information from those in the know about this blockchain. I think it has great potential and Telegeam is obviously huge, but the distribution is what is scary to many people.

wikig: Well ... unavoidable . Once you know the history of TON ... you do might know why will it happened like that . (reply to 51153)

Jitsu: so please explain a little more. I just want to know that TON won’t crash one day because a whale decides to sell 10%? (reply to 51155)

Jitsu: Everyone says TON is sus because of this and that all the top holder whales are related to TON foundation…

wikig: https://en.wikipedia.org/wiki/The_Open_Network (reply to 51156)

wikig: And  https://ton.org/mining

wikig: Which makes the early stage miner have lot of TON token . (reply to 51159)

wikig: Well ..... i got to say i am not sure about it . If some early whale (miner) decide to sell ... it is possible , but i think they won't sell it in market , which will make market react terrible (reply to 51156)

Jitsu: I did see that it’s possible some of those top holder wallet holding TON is actually smart contract

Jitsu: Still I think TON should be transparent about this because it is scaring people away from TON thinking it is a scam with what looks to the outside a horrible token distribution.

wikig: Sure , but what i think the core back of TON is telegram .... 800M user still trust in this IM chat . (reply to 51164)

Jitsu: I agree telegram integration and onboarding of the hundreds of millions on telegram to TON is a huge bullish perspective on the future of TON

wikig: Sry , but i am just noob here (lol) (reply to 51167)

Jitsu: I think it would be in TON best interest to not dump TON or else telegram reputation will go down as well

Jitsu: I believe they have a lot at stake here with TON, it’s just that everyone sees the token distribution and think that TON will dump massively as soon as a whale sells and that our market cap is fake because of the distribution

wikig: Well, yes there are lot guys stake TON in same address . but still , it's uncertent for how many token the early stage miner have . it's still possible for those wale holder .....Just ,none of us hope that happen anyway . (reply to 51170)

User<6990623648>: I have some issue when check a token is locked LP or not. can someone teach me please

Klay.D: how to manage with overflow/underflow in FunC? Is it automatically managed by compiler like in Solidity?

jac: EQCfwe95AJDfKuAoP1fBtu-un1yE7Mov-9BXaFM3lrJZwqg_ Where can I see the source code for the contract code at this address?

Zero: how can I swap TON for SOL or ETH

Zero: am looking for any exchanges

Fereshte: Hi everybody.. Im using ton-kotlin library and I'm trying to transfer some nanotons but i get this error:  LiteServerUnknownException: cannot apply external message to current state : External message was not accepted     Cannot run message on account: inbound external message rejected by account 7608E01F739F9F04651861ADEE13DC2D89189B480E6744E17D09A98B2495EDA4 before smart-contract execution  how can i fix it

User<6990623648>: can anyone help me please? (reply to 51173)

Vlad: Hi!  Is there way to send multiple massages in 1 transfer with “tonweb”?

Klay.D: how to advance blocks in testing?

Matthew:     if (op == 1) { ;; deploy new nft         throw_unless(400, next_item_index < get_total_supply());         int now_time = now();         int price = get_mint_price(now_time);         ;; throw_unless(407, now_time > get_auction_end_time());          int counter = 0;         int index = 1;         if (bid_params.dict_empty?()) { ;; Determine if dict is empty             throw(402);         }         int is_whitelist = 0;         int totalRefund = 0;         cell nft_content = in_msg_body~load_ref();         slice nft_content_parse = nft_content.begin_parse();         var nft_content_owner_address = nft_content_parse~load_msg_addr();         cell nft_content_uri_content = nft_content_parse~load_ref();                              while (index <= bid_length) {             (slice, int) (bid_params_data, flag) = udict_get?(bid_params,256, index);             if(flag == -1){                 slice bid_address = bid_params_data~load_msg_addr();                 if(equal_slices(sender_address, bid_address)) {                     cell new_nft_content = begin_cell().store_slice(nft_content_owner_address).store_ref(nft_content_uri_content).end_cell();                     counter += 1;                     if (counter >= 250) { ;; Limit due to limits of action list size                         throw(399);                     }                     ;; if(is_whitelist != 1){                     int bid_price = bid_params_data~load_coins();                     is_whitelist = 1;                     int refund_value = bid_price - price;                     ;; if(refund_value > 0) {                     (cell new_bid_params, int flag_udict_delete) = udict_delete?(bid_params,256, index);                     bid_params = new_bid_params;                     totalRefund = totalRefund + refund_value;                      deploy_nft_item(next_item_index, nft_item_code, get_deploy_fee(), new_nft_content);                     next_item_index += 1;                     ;; } else {                     ;;     throw(408);                     ;; }                     ;; }                 }             }                          index =  index + 1;         }          throw_unless(401, is_whitelist == 1);          [int balance, _] = get_balance();          var refund_msg = begin_cell()                             .store_uint(0x10, 6) ;; nobounce                             .store_slice(sender_address)                             .store_coins(totalRefund)                             .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);          send_raw_message(refund_msg.end_cell(), 1);          save_data(sender_address, next_item_index, content, nft_item_code, royalty_params, bid_length,  bid_params, collection_owner_address);          return ();     }  hello everyone, can anyone check my above code, why when mint 2 nft is the same as metadata, the logic code is give 1 user mint many nft at once

Blockchain Dev: How to access capital flow on the TON network. When you don't have the budget to promote your project?

Michael: Hello guys, is there a way to listen to the transaction whether it is successful at front end?

musashi: check the seqno of the wallet contract (reply to 51196)

musashi: const key = await mnemonicToWalletKey(WALLET_MNEMONIC.split(" "));     const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });     if (!await client.isContractDeployed(wallet.address)) {         return console.log("wallet is not deployed");     }      // open wallet and read the current seqno of the wallet     const walletContract = client.open(wallet);     const walletSender = walletContract.sender(key.secretKey);     const seqno = await walletContract.getSeqno();      // transaction call here      // wait until confirmed     let currentSeqno = seqno;     while (currentSeqno == seqno) {         console.log("waiting for transaction to confirm...");         await sleep(1500);         currentSeqno = await walletContract.getSeqno();     }     console.log("transaction confirmed!"); (reply to 51205)

Russia: can you help swap jetton to ton please? i use dedust.io

K.: Have you checked this: https://docs.ton.org/develop/dapps/ton-connect/transactions ? (reply to 51190)

wikig: Hello guys . we build a simple bridge aggregator base on official bridge . And now under test . If anyone interest in it , please try https://t.me/tonsbridge_bot   We needs some suggestions !  Thanks !  And now it is still demo version which means it might not very stable , so .... it might have many bugs (lol 🫡

wikig: And now we are working on build a bridge for 3-th part jetton , which might allows anyone to bridge it's asserts to other chains ( if the target chain have pool exist) (reply to 51223)

Fereshte: Has anyone worked with ton-kotlin? (reply to 51188)

Alhaji: Please I am trying to get network fees before transaction is posted   const wallet = WalletContractV4.create({ publicKey: key.publicKe const endpoint = await getHttpEndpoint({ network: "testnet" });     const client = new TonClient({ endpoint });     const address = wallet.address const args = {         body: '',         initData: '',         ignoreSignature: true     };      const fee = await client.estimateExternalMessageFee(address, args);   I keep getting error

Blockchain Dev: I want to develop launcher on TON network.  Do you think we should just leave it to Memes or Other Projects?

&rey: Depends on content of .mint(), doesn't it? (reply to 51162)

&rey: Automatically managed by TVM, not even by compiler. (reply to 51179)

&rey: On tonscan.org. (reply to 51185)

&rey: ton.app (reply to 51187)

&rey: What is a successful transaction? More precisely, which transactions in chain caused by your message must succeed? (reply to 51196)

&rey: Look at sending mode. Carefully. (reply to 51219)

K.: Send mode is literally marked as mode (reply to 51237)

&rey: 1. Network fees, modulo storage, are constant; 2. Calculating them in advance is very hard. (reply to 51227)

K.: bingo

&rey: Now, where those TON sent out come from? (reply to 51241)

&rey: Can you send "TON received from sender" out twice? (reply to 51245)

&rey: Thus, in calls to send you need to set value to be sent to jetton wallets explicitly, and use mode SendPayGasSeparately. (reply to 51248)

&rey: Have a happy and safe development trajectory! (reply to 51250)

Sergiu Popov: Guys, how to get rid of these buttons in my miniAPP? I could not find anywhere

Matthew:   public createMintBody(params: mintParams): Cell {     const body = beginCell();     body.storeUint(1, 32);     body.storeUint(params.queryId || 0, 64);     body.storeUint(params.itemIndex, 64);     body.storeCoins(params.amount);      let itemsMap = new Map<bigint, any>()      for (let i = 0; i < 2; i ++) {         itemsMap.set(BigInt(i), null)     }      let dictCell = beginCell();      serializeDict(itemsMap, 256, (src, cell) => {       const nftItemContent = beginCell();       nftItemContent.storeAddress(params.itemOwnerAddress);          const uriContent = beginCell();       uriContent.storeBuffer(Buffer.from(params.commonContentUrl));       nftItemContent.storeRef(uriContent.endCell());        cell.storeRef(nftItemContent);     }, dictCell);      body.storeRef(dictCell.endCell()); // Convert dict to Cell before storing it in body     return body.endCell();   }      if (op == 1) { ;; deploy new nft         throw_unless(400, next_item_index < get_total_supply());         int now_time = now();         int price = get_mint_price(now_time);         ;; throw_unless(407, now_time > get_auction_end_time());          int counter = 0;         int index = 1;         if (bid_params.dict_empty?()) { ;; Determine if dict is empty             throw(402);         }         int is_whitelist = 0;         int totalRefund = 0;         cell deploy_list = in_msg_body~load_ref();                               while (index <= bid_length) {             (slice, int) (bid_params_data, flag) = udict_get?(bid_params,256, index);             if(flag == -1){                 slice bid_address = bid_params_data~load_msg_addr();                 if(equal_slices(sender_address, bid_address)) {                     var (item_index, item, f?) = deploy_list~udict::delete_get_min(256);                     counter += 1;                     if (counter >= 250) { ;; Limit due to limits of action list size                         throw(399);                     }                     ;; if(is_whitelist != 1){                     int bid_price = bid_params_data~load_coins();                     is_whitelist = 1;                     int refund_value = bid_price - price;                     ;; if(refund_value > 0) {                     (cell new_bid_params, int flag_udict_delete) = udict_delete?(bid_params,256, index);                     bid_params = new_bid_params;                     totalRefund = totalRefund + refund_value;                      deploy_nft_item(next_item_index, nft_item_code, get_deploy_fee(), item~load_ref());                     next_item_index += 1;                     ;; } else {                     ;;     throw(408);                     ;; }                     ;; }                 }             }                          index =  index + 1;         }          throw_unless(401, is_whitelist == 1);          [int balance, _] = get_balance();          var refund_msg = begin_cell()                             .store_uint(0x10, 6) ;; nobounce                             .store_slice(sender_address)                             .store_coins(totalRefund)                             .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);          send_raw_message(refund_msg.end_cell(), 1);          save_data(sender_address, next_item_index, content, nft_item_code, royalty_params, bid_length,  bid_params, collection_owner_address);          return ();     }  hi all, can someone help me, i'm stuck when the above code deploy nft item with duplicate metadata

Michael: What I mean is that is there a way to listen to the transaction whether it is confirmed at front end? (reply to 51233)

Rahul: What is the TonLibClient (python lib) alternative for js/ts lib? I want to connect to the lite server we have configured using typescript

Rahul: I am following this video: https://www.youtube.com/watch?v=p5zPMkSZzPc&t=600s

K.: Are you looking for this?  https://docs.ton.org/participate/run-nodes/full-node#interaction-with-liteserver  You can switch languages for instructions. (reply to 51257)

Alhaji: You suggesting I make it fixed? (reply to 51240)

Rahul: Yes. I did that. But I want to interact with contracts. Like, minting nfts and sending related transactions. So, Is there any specific library where I do not need to connect to the external RPCs and just connect to the local liteserver that I have created? (reply to 51259)

Matthew: https://testnet.tonviewer.com/transaction/1c64ad32607efef8857e05b51815e19e00c78352a710522a198eacaccc399f40  hi all, why payload duplicate when call deploy 2 nft item

Ton: Hi, anyone could help me about this problem? I am doing a test and it shows  "Trying to run get method on non-active contract"  import { Cell, SendMode, toNano } from "ton-core"; import { hex } from "../build/main.compiled.json"; import { Blockchain } from "@ton-community/sandbox"; import { MainContract } from "../wrappers/MainContract"; import "@ton-community/test-utils";  describe("main.fc contract tests", () => {   it("a message sent from a wallet not owner", async () => {     // to restore our hex and get a real Cell, we will use this command     const blockchain = await Blockchain.create();     const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];      const ownerAddress = await blockchain.treasury("owner");     const senderWallet = await blockchain.treasury("sender");     const myContract = blockchain.openContract(await MainContract.createFromConfig({owner:ownerAddress.address},codeCell));     console.log("Contract Deployed Successfully\nowner Address:",ownerAddress.address,               "\nContract Address:",myContract.address,               "\nsender Address:",senderWallet.address);        const getOwnerAddress = (await myContract.getOwnerAddress()).ownerAddress     expect(ownerAddress).toEqual(getOwnerAddress);

Alhaji: Would also want to ask, how can I always check to see current fee? (reply to 51240)

MA: Hello guys,  I want to create a decentralised lottery application for jettons.  In solidity we have approve and transfer_from that can be used by the contract. So we can create fully decentralised application for tokens.  But as i realised, in jetton standard we don't have this ability. Is there any alternative way to do some work when the contract receives some jetton?

wikig: Without chainlink random oracle .... How can you build lottery onchain ? (reply to 51265)

K.: I haven’t used a Liteserver, but from that code it seems to give you client. Which I suppose you can then use to make transactions together with @ton/ton library.  In this guide: http://tonhelloworld.com/01-wallet/  In step 8, it creates a client from an HTTP endpoint. Perhaps you can try this, but with your LiteServer?  (again, I haven’t tried this personally, so treat this is as more like a pointer than actual answer) (reply to 51261)

&rey: First, user sends some jettons to you, then you process transfer_notification. (reply to 51265)

&rey: There is an oracle, run by me, personally! https://ratingers.pythonanywhere.com/ecvrf-about.html (reply to 51266)

&rey: But you haven't actually sent any message (nor internal nor external) to the contract to deploy it? (reply to 51263)

wikig: Looks cool ! (reply to 51270)

&rey: I'm planning to update the page with reference to standard which proves I don't need a DAO except for service stability.

wikig: Is there any price oracle or RWA oracle on TON ?

&rey: Wait, shouldn't nftItemContent have the part unique between NFTs? (reply to 51254)

wikig: still , there is no any future/derivatives like GMX onchain

&rey: You are now sending zero TON to a contract, while expecting it to process your message. Actually, SendPayGasSeparately only pays fees for message sending, not for its processing (since those cannot be determined in advance and from possibly other shardchain). (reply to 51252)

&rey: No, I mean you need to change value. Probably increase it. (reply to 51279)

&rey: And decrease value sent in other message correspondingly, so your contract doesn't go bankrupt.

&rey: Maybe transaction log will help? Help you, I mean.

&rey: Yes, "forward all TON received in this message except spent during computations". (reply to 51289)

Matthew: i see the example code from ton doc, it only save owner address and nft common url (reply to 51275)

Matthew: why when i deploy 1 nft 1 wallet it true, but when deploy batch nft item then duplicate metadata (reply to 51294)

&rey: Because TON is native currency for paying for computation and message delivery. (reply to 51291)

Rahul: Thanks, K. I will try. (reply to 51267)

&rey: Unless you send TON, the message can't be processed. (reply to 51297)

ASD: What's the commission on the full deployment + mint auth revoke costs in Ton ?

&rey: If you mean a simple token, that should turn out to be less than 0.5 TON. (reply to 51300)

User<7195257024>: Hello, I'm a TON developer.  Write to me, I develop projects on TON, I know how to make smart contracts.

Matthew: i sill dont understand, i want user deploy 1 transaction have many nft, is there anyway to do it? (reply to 51299)

Matthew: i code same as the batch deploy of ton example

Kenny$$Shillz: U need the pool address for that. U can use the dex sdk and call the pools getter function (reply to 50603)

&rey: I can't see the relationship between index and item_index. Is there some intuition for it? (reply to 51254)

Zero: Like? (reply to 51305)

Zero: LP tokens can be locked in multiple ways

Zero: One being sending them to dead address

Matthew: i dont use index and item_index, i increase next_item_index to control nft id (reply to 51306)

Zero: The other two ways being locking at Ton Inu or Ton Raffles

Sergiu Popov: Guys, can bot hold a telegram balance (Web2) and/or a Space balance (Web3)?

&rey: Bot is an application on your server. It can hold TON. I note that there is no such thing as "telegram balance". (reply to 51314)

MA: Is the  notification calls my contract functions automatically after receive some jettons?  I mean, should I run some code to check transfer_notification and call my contract function? If yes it would be a centralised application  and if not and notification automatically calls my contract function, can you please tell me what should I search and where can I find documentation? (reply to 51269)

&rey: Yes. Unless user forgets that, in which case these tokens are lost; you have no way to learn of them. (reply to 51321)

Sergiu Popov: Yes, but has an ID. Can this bitID hold any balance? (reply to 51320)

&rey: No, just as your Telegram account doesn't hold any. (reply to 51323)

Sergiu Popov: TelegramID has an attributed balance (non custodial) (reply to 51324)

Sergey: Hi, how can I find out the jetton to ston rate from the contract?

Ton: Thanks. (reply to 51271)

Ton: So at least I need to send an internal message to it. (reply to 51327)

Ton: And that’s deploying. (reply to 51327)

Амир: Error: Func compilation error: contracts/raffle_contract.fc:40:25: error: cannot apply function rand : int -> int to arguments of type (): cannot unify type () with int       int winner = rand() % 11; Can someone please explain how to correctly use rand() function?

&rey: 1. randomize_lt() or preferably an oracle with verified random function; 2. rand(11) (reply to 51331)

Амир: So rand and random can be predicted contrary to randomize_lt()? (reply to 51335)

&rey: Yes. They are constant during a block, to be precise. (reply to 51339)

&rey: And someone can send future bets conditional on first one succeeding. (reply to 51341)

Амир: I am just afraid of using oracles in the beginning

&rey: Don't send all value in first message, nor in second. (reply to 51342)

Амир: Saw such issues in solidity auditing :)) (reply to 51343)

TON Bounty Bridge: ​Development of a TON Trading Telegram Bot  🏷 Developer Tool  Summary:Creation of a Telegram Trading Bot capable of executing trades, checking balances, and tracking new ...  Created by AndyYaG

&rey: SendPayGasSeparately (without SendIgnoreErrors, likely), and set outgoing value to something reasonable that will be covered by incoming message — like ton("0.48"). (reply to 51348)

Амир: If someone also will be interested in random number generation, you can check this https://docs.ton.org/develop/smart-contracts/guidelines/random-number-generation

Амир: I still got this (reply to 51335)

&rey: I meant randomize_lt(); int winner = rand(11);

Амир: Can someone explain difference between new_data.store_slice(new_address).end_cell(); set_data(new_data); and new_data.store_slice(new_address); set_data(new_data.end_cell());

Амир: At first code I get compilation error, while second works fine

Yannick | Chorus One: I don't see an option with validator-engine binary to specify keyring directory path to store the node keys under another location. Is it possible to achieve this with the config.json or something ? I would like to store the keys in memory and not on disk.

&rey: 1. TVM objects are immutable, so you need var x = new_data... 2. .end_cell() returns cell instead of builder. so that can't be stored in the same variable. (reply to 51365)

Haq: Hi 👋, @pcrafter Is there any chance to get any advice about these questions? (reply to 51037)

&rey: 1. Once you have @ton/ton installed and can use it in web page, you should copy wrapper for contract from autogenerated files. (reply to 51037)

&rey: 2. You have to convert that message into cell.

Jimmy Becen: hi guys Why error when use pow

Амир: I faced such problem, that my inline function is skipped during execution. Two throw methods reverts transactions, however any throw in store_address() function does not work

Амир: Can someone help please

Andrey: add impure

Andrey: if you call function without impure and dont save any result of execution - that means compiler optimizing it by removing

Samyar: hi, how can i contact a maintainer in ton-community GitHub organization  i have found several issues in several repos. made issues a couple of month ago. but no response

Амир: Ty (reply to 51382)

fabriregu: Hello everyone, I'm following lesson at https://github.com/TonDevStudy/pyton-lessons-eng/blob/main/lesson_4 and when I'm deploying new collection I've got error tonlibjson did not respond  May someone can help me to understand?

Bring Your Mind: Hi guys there Is any Dev here can help for a collection of nft?

Blockchain Dev: I want to get a domain name to develop the Defi MEME ecosystem

Haq: Thanks for your answer ❤️  I'm taking the file which is pointed in the wrapper file in the build folder of my contract and try to use it in my app but I get an Error with the address I don't know why ehh. Here is an example of my code maybe someone will notice a mistake which I mad (reply to 51373)

Haq: do you have maybe any example of how the object should look or something ? (reply to 51374)

TON Bounty Bridge: ​Fix for "boxen module not found" in ton-community/assets-sdk  🏷 Developer Tool  Summary:After the recent update of thehttps://github.com/ton-community/assets-sdkan error appeared related t...  Created by samyarkd

&rey: TON DNS offers .ton and .t.me domains. (reply to 51393)

Blockchain Dev: yes I understand but I want to compete with Pinksale

Blockchain Dev: I'm debating between Finace or .IO

Blockchain Dev: memeton. finance hoặc memeton .io

fabriregu: please guys (reply to 51389)

&rey: Do you know that in TON, any onchain interaction with other contract is done via sending message. (reply to 51405)

&rey: Each interaction option, message kind ("call", as you could phrase it coming from EVM) can be encoded in cell and sent.

Zαχαρίας: Guys, please advise on the easiest and safest way to distribute jetton's. There is a list of addresses available

Bring Your Mind: Up? (reply to 51392)

Anton: it’s a compile-time only function currently (reply to 51376)

&rey: It's some issue with message sent to your contract, not in it itself.

&rey: TON Connect? If so, somehow base64-encode body.toBoc(). (reply to 51420)

&rey: Do you have the contract link? (reply to 51423)

&rey: It seems wrapper is not storing valid opcode. Could you send auto-generated TL-B tables? (reply to 51432)

Bring Your Mind: There Is any Dev can help me for a nft collection ?

&rey: TL-B? A scheme describing possible inbound messages. In text, preferably. (reply to 51435)

&rey: It should be somewhere in tact_FarmLandToken.md

Bring Your Mind: ??? (reply to 51436)

Klay.D: hi, if smart contract pays for fee on its own, then ddos attack like sending invalid opcode message leading to failed transaction could drain the contract's balance?

&rey: In most cases, it does not. For instance, computation is paid by incoming message value; if it carries too little TON (1 nanoTON, for instance), TVM isn't even launched. (reply to 51446)

&rey: The contract doesn't have according receiver. Have you put it into the correct contract (jetton master)? Are you sending messages to the newest version? (reply to 51444)

&rey: Did it solve the problem?

&rey: from "@ton/ton"; (reply to 51476)

Carter🧹: How can I start my TON node syncing?  failed to download proof link: [Error : 651 : no nodes]

&rey: Are (I don't know which exactly) ports open? (reply to 51484)

Carter🧹: Ports (TCP+UDP) are open and NATTed to this host.

Carter🧹: I can open a socket to this port from the outside world [TcpListener.cpp:64][!TcpListener[port:43678]]  Accept

Carter🧹: I want to run a local node as the ADNL connections using tonlib often either fail, or do not have sufficient data to query (maybe this is why, not enough nodes available?)

Klay.D: hey, how to calculate the Total fee that is displayed on tonviewer, I try to look into serveral transactions and sum all the fees but the result is  either less or greater than the Total fee. This transaction, for example, has the sum of all other fees (Fwd.fee + Gas fee + ...) greater than the Total fee: https://tonviewer.com/transaction/43506b57d270ebf62f24294b88119e12373bed880916fbf7c8583daf7cb02478

otorotok: Hello everyone, thank you in advance for what you can do. I acquired a domain using the safepal wallet connected to the dapp Ton domain but as soon as I tried to set it from the dapp, it does not let me send the signed transaction and restores me a generic error. As far as I understand, the wallet does not support NFT management. Is there a way to sign a transfer from this wallet to a native one? For example, by interacting directly from a contract or a dapp that can support the transfer? I didn’t see the feature on TON DOMAIN TON’s assistance gave me this group to ask for support. Thanks a lot

ARSUN: /v2/accounts/{account_id}/jettons   I'm using testnet wallet address 0QCWj7C2EKK_6BUspFpRbYIv9OFCpif37rBcZ_cMYbkfH6up   It's showing balances [ ]

K.: If your wallet does not support working with smart contracts, have you tried using the one that does (e.g.: Tonkeeper)? Not sure how safepal works, but if you use the same mnemonic in Tonkeeper, you’ll get the same wallet and will be able to interact with the DApp with no problem. (reply to 51499)

K.: That address doesn’t have  any Jettons https://testnet.tonviewer.com/kQCWj7C2EKK_6BUspFpRbYIv9OFCpif37rBcZ_cMYbkfH_Zs (reply to 51510)

&rey: Maybe you could try routing connections to other nodes via some server in VPN format? (You'll have to open port on it, meaning that you should have access to that server) (reply to 51489)

Carter🧹: Is there a way to manually add known good nodes to force a connection, maybe there is a website of active nodes like there is for eth? (reply to 51515)

&rey: Iterate through the config, there should be one good node. I believe. (reply to 51516)

Амир: Am I doing cell construction right? Caz new_address is never stored in c4 after set_data(new_data.end_cell());

fabriregu: Hi, I'm following the tutorial at https://github.com/TonDevStudy/pyton-lessons-eng/tree/main/lesson_4 i can see the collection in testnet at https://testnet.tonscan.org/address/EQAKWS8H4roMJWZcfui9Md8PVdNlEGljuZzoGDDXRTPXD9sA but when i click on Contract type to see the collection... this error is shown: This address is not an NFT  What does it mean? how can i fix?

otorotok: Thank you very much for the answer: in my opinion it supports smart contracts, in fact it allowed me to interact with the NFT mint contract. The theme is that by importing I’m not sure if I get the same wallet back, for example I imported on a ledger that I connected with both mytonwallet and openmask but it generates addresses (openmask only 5) but that are different from the one on safepal. In both I have not seen the possibility of settings in the import phase. (reply to 51511)

ARSUN: Thanks 👍 (reply to 51514)

A: Hello, does anyone know how to place a token on the TONRAFFLES Launchpad.?

.Sam.: hi guys, i had a quick question:   Is there a way with wallet.methods.transfer to trigger 2 payloads at same time, so we don't have to make 2 seperate transactions

Behrang: Use ~ instead of . On the last line. (reply to 51523)

Crypto A99: I have a large maps , want to send to Contract. But rpc flow me 413 Request Entity Too Large. Any Suggestion ?   My Maps Size aroun 12k records

Амир: Hmmm

Behrang: So use this:  new_data = new_data.store_slice(...

Амир: Point is that it is not convenient to use it in this part of code. That is why I am confused (reply to 51550)

Heydar: #Question notcoin is an contract code? what's the contract address??

K.: https://tonviewer.com/EQDtU7yZnlpK9po_nD3lN299kMSH4VKPMx5xbb6FkD1REsF3  Labeled as “Notcoin” (reply to 51553)

Heydar: Thanks, can I ask a question, do you have any github source that creating a game like notcoin full open source? to learn. it's not func or tact, it's fift code :( (reply to 51555)

Ulug‘bek: What should I do to get the value of TON in realtime?

&rey: Up-define ~store_slice in stdlib, then. (reply to 51551)

Амир: TY (reply to 51558)

Ulug‘bek: /// (reply to 51557)

Heydar: Please someone can guide me to find a game that has full open source code on func and the TWA(IDK TMA is correct or TWA , Im not sure what's the diffrence between them, sorry.) (reply to 51556)

.Sam.: Hi

.Sam.: Can someone help me with TON_PROXY address

dp: We are a dynamic startup building an innovative play-to-earn game on the TON blockchain, utilizing our own $SOUL cryptocurrency. We are looking for an experienced Backend Developer to join our team and drive the development of our game's server infrastructure and blockchain integration.  DM me! ❤️

Амир: Maybe someone knows why I got exit code 8 (cell overflow) in following code?

Амир: If I sequentially store many addresses - there is no overflow. While in such construction - it is

Ma><im: Hello everyone!  I get the dictionary from the get method of my contract, the dictionary is stored in a global variable of type Cell.   When trying to get it through  TypeScript, an error is received: No more references   Does anyone know how to fix it? thank you in advance!

&rey: Because one address is at least 267 bits, and cell is able to fit 1023 bits only. (reply to 51583)

Амир: got it, ty (reply to 51594)

Oliver: Hello everyone.   Glad to here.

Oliver: I would like to get a Dev recommendation here. Someone who is willing and ready to build for a project which I live already.

Амир: Where can I find info about address storage occupation (reply to 51594)

&rey: Count it in TL-B type. (reply to 51603)

Sumit: I need more than 5 tokens from the faucet?

virgiltho | SUIcker.xyz: Is it possible to get account balance (TONs) using sandboxed blockchain in blueprint?

Heydar: do we have better alternative (completer) instead of using Mark42?

badbadnotgood: Hey guys, is there a way to send a user deeplink to top up with telegram wallet? This doesn’t work ton://transfer/<wallet_address>?amount=<amount_in_nano>&text=<uuid>

Denis: Hi, can you tell me how to get a private wallet key?

K.: import { mnemonicToWalletKey } from "@ton/crypto";  const mnemonic = "unfold sugar water ...";  const key = await mnemonicToWalletKey(mnemonic.split(" "));  Then key.secretKey is the private key and key.publicKey is public. (reply to 51613)

Denis: How will this program connect to my wallet and ask it for my key? (reply to 51615)

K.: This is based on you providing the mnemonic in the mnemonic variable. Did you want to do it some other way? (reply to 51616)

Denis: what should I put in const mnemonic?

K.: The mnemonic (24 words) for the wallet you want to get the key for.

Denis: Is that a wallet address? (reply to 51619)

K.: No... when you were creating a wallet, you were given 24 mnemonic words to write down. You need to put those separated by space in the variable. (reply to 51621)

Denis: Is there somewhere I can look up those 24 words?

Heydar: each user can steal people's wallet then 😐 how telegram allow this job? (reply to 51615)

Heydar: ohhhhhhhhhhhhhh, got it , thanks , Sorry (reply to 51619)

K.: Also, are you 100% sure you know what you are doing? Like, you know that you need the private key for yourself.  Just for your information, the private key gives full access to the wallet and if you share it with anybody, it can result in them taking over your wallet. And no, you cannot lookup these words, because they are secret that only should be known to you. (reply to 51623)

Heydar: Guys what's the diffrence TMA vs TWA?

I16000: Guys,good night,can someone help me, i am trying to make dedust swap from ton kotlin lib,i have trouble with building cell,function "addrToCell" doesnt exists,can anyone show me how to convert AddrStd to CellSlice?

K.: TMA Telegram Mini Apps TWA Telegram Web Apps  They are the same thing, just referred to differently. https://core.telegram.org/bots/webapps (reply to 51627)

Heydar: I know the abbreviation :D, but I cant get what's the difference in the docs and tutorials.  thanks. (reply to 51629)

Denis: can you write it in python? (reply to 51615)

Heydar: can someone guide me how create realtime game(users interact with to gether, refresh rate is 1seconds) on TON and TWA, or helping me by a link simple project like that ...

Heydar: npm i @tma.js/sdk  do you think which one should be used then? tma or twa sdk? (reply to 51629)

Heydar: I checked the functionalities , it seems it's like twa but twa has more functionalities, but because Im not expert in this way , so Im not sure that is correct conclusion or not, can someone help me? Shall I use TWA or TMA? or totally they are different and are not alternatives ...? (reply to 51633)

Heydar: also latest ton docs is using twa

Heydar: https://docs.ton.org/develop/dapps/telegram-apps/app-examples#:~:text=%27./App.css%27-,import%20WebApp%20from%20%27%40twa%2Ddev/sdk%27,-function%20App( (reply to 51635)

Alexey: Hey guys, a noob question. The following code deposits less than value to a smart contract:      await provider.internal(sender, {       value,       sendMode: SendMode.PAY_GAS_SEPARATELY,       body: msgBody,     });  How can we make sure that an external message transfers to the contract the exact amount? Thanks!

Heydar: how it's possile when you wrote value? you are sending value , so it's equal value, how you are saying that is less than value?? (reply to 51637)

Alexey: My guess is that it for some reason it takes gas fees from the value. When I test locally with the value = toNano("3"), the following test passes:     const balanceResponse = await myContract.getBalance();     expect(balanceResponse.balance).toBeGreaterThan(toNano("2.99"));     expect(balanceResponse.balance).toBeLessThan(toNano("3"));  where getBalance wrapper invokes:  (int) balance() method_id {   var [balance, _] = get_balance();     return (balance); } (reply to 51643)

Heydar: did you print  balanceResponse.balance? (reply to 51644)

Alexey: yeap (reply to 51645)

Sumit: why cant i use @ton libraries with vite ?

Амир: Can someone share guide how to deal with dictionaries in FunC?

Heydar: so it's cause of the rent fee, I think. Im beginner too. (reply to 51646)

Alexey: yeah, most probably. i just wonder how can I send enough so it covers the rent fee. thanks anyway! (reply to 51649)

Heydar: I asked that before 😂😂  wait. (reply to 51650)

Heydar: @akalmykov (reply to 50813)

Alexey: thanks man, appreciate it! (reply to 51652)

Heydar: Thanks to the experts that helping us in this way ... ❤️ (reply to 51653)

fabriregu: Does anyone know the origin of this error? (reply to 51528)

Амир: Can someone help? var (participant_address, flag) = participants.idict_get(16, i);  But I face following error: Error: Func compilation error: ( function `.idict_get` undefined ) cannot generate code for function `.idict_get`: contracts/raffle_contract.fc:54:55: error: .idict_get           var (participant_address, flag) = participants.idict_get(16, i);

Амир: It is defined in stdlib.fc as: (slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";

Амир: 😭😭😭

— 2024-04-18 —

Boris: have you included stdlib? just in case.. (reply to 51660)

Boris: Oh, its defined as idict_get? you are using idict_get (reply to 51659)

Амир: Yes, i use it as it is defined ( (reply to 51664)

慢的: Sorry I'm a beginner  How can the tokens we create produce a K/chart line?

wonderful: why is my dependency file missing when I run it

musashi: hey guys, I got an issue: a JettonWallet contract doesn't have transaction for 1 week, then today when I try to fetch its information, I got error -13, when I check the contract on Tonscan, it shows that the contract is inactive with 0 Ton in balance

musashi: how can I handle this case sir @pcrafter

Michael: Hello, is there a way to decode the BOC when I got the result from tonConnectUI.sendTransaction, I would like to decode it so that I can load the event, Thank you

musashi: https://github.com/howardpen9/nft-template-in-tact (reply to 51681)

Klay.D: hi, how to convert address slice to uint64 in FunC? My contract needs to make user address as query_id when sending message to jetton wallet.

N: /

musashi: getgems store their metadata uri with this format the link + nft item index (reply to 51699)

musashi: u should read their contract code

musashi: idk =) (reply to 51702)

musashi: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#nft-metadata (reply to 51707)

musashi: yep, for example: https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/1.json

musashi: I told u to read their contract code

musashi: I didn't try it before so idk =)

musashi: no, I guess

Jin Crypto: Hello everyone, I have a problem that I hope you can answer. I want to send transaction with message like below, but I want to use ton-core (not use tonConnect), how to do it? Thanks everyone function transactionParams() {   let payload = beginCell()       .storeUint(0x3F5C2970, 32)       .storeUint(0, 64)       .endCell()   let boc = payload.toBoc().toString('base64')    return {     validUntil: Math.floor(Date.now() / 1000) + 300,     messages: [       {         address: this.GET_USER_INFO?.contract_address,         amount: toNano("0.12").toString(),         payload: boc       }     ]   } }  async function claimTransaction() {   try {     let res = await this.tonConnectUi.sendTransaction(transactionParams())     console.log(res);   }   catch (e) {     console.error(e)   } }

Heydar: when people creating their token, is that mean they used jetton contract? to creating their token?

K.: If by token you mean Jetton, then yes, they deploy a Jetton Minter contract. There are other tokens like NFTs, but they are also created through smart contracts, obviously (reply to 51729)

K.: You can use @ton/ton to create a local wallet and send transactions from it:  Check step 8 here: http://tonhelloworld.com/01-wallet/  This will then not require any additional confirmations and will just execute the transaction. (reply to 51724)

Jin Crypto: I mean . If tonConnect uses the above code to send transactions with params , what will the rewritten ton/ton look like? Thank you for replying me (reply to 51731)

K.: Well, based on the example i linked you should be able to rewrite the tonconnect code into a script. The most important parts are the payload and the messages array, as those are the transaction parameters. (reply to 51733)

Jin Crypto: Thanks sir

K.: you are not using this link in the code (reply to 51745)

K.: Because this is a directory of files. Not sure if it picks it up correctly if you are trying to mint 1 NFT… (reply to 51753)

K.: Have you tried using this link? (reply to 51745)

K.: are you following some tutorial? could you link it? I want to see if perhaps the instructions are unclear there or misleading. (reply to 51756)

Роман: Hello, everyone! Any idea why transaction failed? https://tonviewer.com/transaction/90c407eaa081e509d9936a3459f27420db3bd0868200ed8655e66ef4a85c7974

kevin: https://tonviewer.com/EQAD7T3O_zG4kBUvJFoGGkYCoCwk84epEfHvjdfvPBF8ngYw?section=code        line 23 (reply to 51760)

Роман: In what file? (reply to 51761)

Роман: errors.fc?

Heydar: so when a game create a token for their game , what's that ? how detect that is jetton or nft? Sorry I want to know more about this bussiness plan, what should I search in google? (reply to 51730)

Genn: Привет, может кто-нибудь помочь/проконсультировать касаемо минтинга жетонов и лока суплая? Спасибо

K.: They make a Jetton, here’s an example of a game powered by a token on the docs:  https://docs.ton.org/develop/dapps/tutorials/building-web3-game (reply to 51768)

Heydar: Thanks for the hints , Really because we have not a book in TON , Im asking so many question that all are low quality ... sorry. (reply to 51770)

sdw: Hello,  Is there a way to find if transaction is already broadcasted if I have only raw transaction? thanks in advance

MA: Hello guys Is there any documentation or tutorial for processing transactions_notification with smart contracts ?

Heydar: guys why this contract didnt upload func or tact? is that any reason underhood? (reply to 51555)

Vladimir: Hi guys! Meet the hero of Tact - Anton Trunov🔥  Enjoy the episode, it's in Russian, but there are automatic subtitles.  https://www.youtube.com/watch?v=Cg7geUDHH4A  And drop by our hackathon, there are 12 days left to register.  By the way, Anton is holding a live workshop today.

Professor: Need small help I have some ton on Fragment how can I get back in ton wallet ?

Professor: I added it to run telegram ads

wikig: did telegram ads support for withdraws  ? (reply to 51793)

Professor: Don’t know (reply to 51795)

wikig: Well , if it support withdraws , you can withdraws your token back form telegram ads . and it can't if it not support

Heydar: how we can be sure that initdata that sent from telegarm to miniapp is the user's telegram and it's not from another people?

wikig: Decode it from your backend (reply to 51799)

wikig: The init data should have a sign to decode .  And sure , if someone have the initdata and open it with params, it's noable to tell the different

Heydar: Sorry I cant get it , what do you mean ? Im not professional. just was worry how we handle that? (reply to 51800)

wikig: https://core.telegram.org/bots/webapps

Heydar: so it's done underhood? (reply to 51801)

wikig: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app (reply to 51804)

wikig: The data can be verfiy by the telegram bot api-key

Heydar: 🙏🏽🙏🏽🙏🏽🙏🏽🙏🏽 Thankssssss (reply to 51806)

Амир: I am using following code for generation random number in range [0,10], however in my tests winner always equals to 4. Someone knows what may be the reason of such behaviour

User<5606745514>: GM!, I should calculate the transaction fee for TON testnet network in node. How can I do this?

peilipu: hi ,anyone is using github.com/xssnick/tonutils-go sdk , how to parse jetton transaction? i can't find the jetton amount in the transaction

peilipu: and when a tx is jetton transaction ,the comment from t.IO.In.AsInternal().Comment() is empty

Nxrix: how to send jettons instead of ton using ton connect?

K.: https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer (reply to 51824)

Roman: I`m trying to setup my website in .ton domain https://github.com/tonutils/reverse-proxy And I`m getting this error afte reverse-proxy process started: panic: failed to get masterchain info: get masterchain info error (*liteclient.ConnectionPool): adnl request timeout Is there anybody who can shed some light on this issue ?

.Sam.: Hi guys, is it normal when doing big payload request on smart contract to take 15seconds to 25 seconds ?

Development: I graduated from school ton dev study, take me to study further in practice, at school I learned nothing but to write off the monitor

&rey: It is normal for any request. (reply to 51834)

Hidanz: hey guys, how can i create a highload wallet ?

&rey: You could get more knowledge by answering questions in this chat. (reply to 51835)

.Sam.: Thank you ❤️ (reply to 51836)

Hidanz: can someone help please (reply to 51837)

K.: This is a good starting point: https://docs.ton.org/participate/wallets/contracts#highload-wallet-v3 (reply to 51837)

musashi: i wonder to know that with the below minting logic, if 2 users call the mint opcode at the same time, then they will have 2 nft items with the same index, right?

musashi: if (op == 1) { ;; deploy new nft   int item_index = in_msg_body~load_uint(64);   throw_unless(402, item_index <= next_item_index);   var is_last = item_index == next_item_index;   deploy_nft_item(item_index, nft_item_code, in_msg_body~load_coins(), in_msg_body~load_ref());   if (is_last) {     next_item_index += 1;     save_data(owner_address, next_item_index, content, nft_item_code, royalty_params);   }   return(); }

&rey: Wdym at the same time? Each transaction is atomic operation. (reply to 51842)

musashi: I still think that TVM processes the transactions in parallel sir =)

musashi: so it stills happpen in order right?

&rey: Yes. In order of creation logical time.

musashi: just thought I catch a big bug in Ton eco haha =)

musashi: is the Ton storage fee the same as storage staking mechanism in Near protocol?

&rey: The fee rate is constant in time, provided contract storage doesn't change. (reply to 51851)

musashi: can we display the full dictionary offchain like printing an object in Javascript instead of traversing through each key?

Max: Hello, We are using TonConnect in our dApp Currently connection does not work. We see the following error in one of Web sockets: {"id":0,"jsonrpc":"2.0","error":{"code":3000,"message":"Unauthorized: origin not allowed","data":"OriginNotAllowed"}}  Do you face such issue?

Hidanz: thanks a lot i managed to go far with it , but now i have an uninit highload wallet, how can i initialize it ? (reply to 51841)

&rey: Why do you need to initialize it before usage? (reply to 51860)

Hidanz: i can't send any transaction from it using js i always get this error :  LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +         'Cannot run message on account: inbound external message rejected by transaction 765EC8E648D5E81BE171873CDFE6392AD3EC41CB30B4007C1E90C60867B46DF1:\n' +         'exitcode=35, steps=71, gas_used=0\n

Hidanz: this is the full error message :  {   ok: false,   error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +     'Cannot run message on account: inbound external message rejected by transaction 765EC8E648D5E81BE171873CDFE6392AD3EC41CB30B4007C1E90C60867B46DF1:\n' +     'exitcode=35, steps=71, gas_used=0\n' +     'VM Log (truncated):\n' +     '...xecute EQUAL\n' +     'execute THROWIFNOT 38\n' +     'execute NOW\n' +     'execute PUSH s10\n' +     'execute SUB\n' +     'execute PUXC s5,s-1\n' +     'execute GREATER\n' +     'execute THROWIFNOT 35\n' +     'execute XCHG s4\n' +     'execute NOW\n' +     'execute LEQ\n' +     'execute THROWIFNOT 35\n' +     'default exception handler, terminating vm with exit code 35\n',   code: 500 } (reply to 51861)

&rey: Time on your computer is set incorrectly. (reply to 51866)

&rey: Or timeout is too small.

Hidanz: await contract.sendExternalMessage(keyPair.secretKey, {       createdAt: Date.now(),       message: internal({         to: Address.parse(to),         value: toNano(amount),       }),       mode: 3,       query_id: new HighloadQueryId(),       subwalletId: 0x10ad,       timeout: 60 * 60 * 1000,     });

Hidanz: i made timeout to 1 hour (reply to 51868)

JL: Hi my wallet says the requested operation cannot be processed in your region. How can I resolve it?

&rey: @wallet? Yes, it dissupports does not support certain regions. (reply to 51882)

N: Hi, I am writing a contract in a testnet. I want to transfer that contract to a main ton address. please support me .

User<6468801057>: Hi everyone in the chat, I would like to invite you to join our new web3 project. We need experienced translators and nft makers, also looking for beta testers. From us: decent pay and good schedule. If you are interested, I am waiting for you in private messages.

Boris: oh, ton.answers is down: https://answers.ton.org/question/1537301150401826816/what-is-the-recv-internal-function-and-what-are-its-arguments-for?desc=false

Green: Hi EveryoneCurrently, can anyone deploy the contract to the following endpoint tonhubapi v4 mainnet?

Green: I met 500 Internal Error when deploying with this endpoint

JL: Yes I see. And telegram wallet doesn't support testnet? (reply to 51884)

K.: It does not. (reply to 51899)

M: Hello!  Im new on Ton Chain and i have a little problem. Its my code To sen Jetton   const seqno = await this.wallet.methods.seqno().call() || 0;             const numericAmountInTon = parseFloat(amountInTon);             const amountInNano = TonWeb.utils.toNano(numericAmountInTon.toString());              const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode("ID #" + generateHash)]);              const jettonWalletAddress = this.jettons[id_crypto].jettonWalletAddress.toString(true, true, true);              const transfer = await this.wallet.methods.transfer({                 secretKey,                 toAddress: jettonWalletAddress,                 amount: TonWeb.utils.toNano('0.01'),                 seqno: seqno,                 payload: await this.jettons[id_crypto].jettonWallet.createTransferBody({                     jettonAmount: amountInNano,                     queryId: seqno,                     toAddress: new TonWeb.utils.Address(toAddress),                     forwardPayload: comment,                     responseAddress: this.hotWalletAddress                 }),                 sendMode: 3,             }); And in transfer response i see: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state  how its wrong?

Carter🧹: Hi have my node syncing now, but I get a lot of these messages during sync:  [!peerpair][&ADNL_WARNING] dropping too big huge message: size=203300  Is there a config setting I need to adjust somewhere?

Nxrix: when I used ton connect to send a transaction how to get the transaction data? so I can check if it was successful and done

M: Someone help me ? (reply to 51904)

&rey: In docs.ton.org - TON Cookbook. (reply to 51912)

Denis: Can you tell me why this error may occur?

Boris: its ethereum stuff, ton is other blockchain (reply to 51917)

Denis: and how do I use it for ton?

Chukwunonso: Please does anyone know of any custodial wallet provider that works with TON network

Mineverse: Hello everyone, who can help with creating a selection of wallets in TON based on specific parameters, for a reward?

Denis: where you can find out the wallet class in Tonkeeper?

&rey: @CryptoBot. @wallet. Others from ton.app. (reply to 51923)

George: Is there a way of generating a url with prefilled values like ton://transfer... but for telegram wallet? The only thing I found it Wallet Pay, but honestly... Such a long registration process just for a prefilled url. I do understand, that Wallet Pay is more than that, but for people who literally just need a url with prefilled values that's a bit too much..

Амир: Is there any way to get all transactions of contract instance defined like: let raffleContract: SandboxContract<RaffleContract>;

Андрей: It’s interesting how some validators specifically do not vote for some proposals. If we take the discrepancies between the validators who voted between the first (125699...613720) and the second (314010...889801) proposal, then you can find out specific validators who are against reducing the network commission: ['13', '30', '44', '46', '47', '48', '49', '50', '98', '99', '100', '101', '103', '104', '105', '106', '107', '108', '109', '121', '150', '151', '152', '153', '154', '155', '156', '266', '267']

Андрей: Let's take their addresses from the validation loop election_id = 1713393416, maybe they will feel ashamed and vote: Ef8woB-NyFWJDRiBxr6tft-HjpjqK8bqHL6IpDmBIFXeti0j Ef8FW-UwiybhnAwoGCofHPSNzRZWakhDC3SeS61PR7emUFtU Ef9umO66maEI1se8VB56aHkSEyP8VrOtaV4oue163hGlB8A8 Ef8QSmAbFJMv3tPXgQOIQsqtsQErQPT6bixVKjZ76pYrqkHu Ef-e1ZJV_658Ab5SZIH0aaNatXdq1nIJznPz7vp7vNpAWXFB Ef_tO7zze-3B_OjPTIAusSULvi1hNw8ZGxDLVptl7VXq8qc2 Ef93tNMK4uUVsAlE0R1wx-w7S5H15urAx5KY21E0wV5hb8rs Ef8l8JgPWrkFHxWj-ExI-EUfHL6-iyh_AzPOEz-ZNON3vRad  Ef-WJ4iHqFUPBzHSlX_yCoEfdVru57qgr8iLK4WujY2F3ZXr Ef-Qy_IWAgz7jnm_D8ybrEL8CwHFTXs6Wq40qif41dz1pe_P Ef-H8Yz4ALmQyCF7cB1hY0s5KRsXzKJ-96r6mmHW7_mTjxij Ef8rPb2hEamareiHsp8RHG0xNSfxvQR51OPDfkjRmVC5rtDv Ef_t--M9GsEsO8VKuPPWQYdV6hrEsM54d5up-46hxtpAQKfL Ef9URz_3xexyMXKrhgA0KIAa_Yfvoj62QAtWlLMW1EDZW8nD Ef_mialZ83KWdYmQRSl9vTg8IISlpVHSeOe6ToeB_I7vagso Ef8DkmTWSq2-FeoykG6DVz-o9jCoy3wl7j0ExDjqqk3_B5mE Ef9se8eeMb2Q3CwLHwRncY4PpxII8AvmNDYUQguoKo5DBmvN Ef-DSqNH8fEolTI6rYvOf-OVmDIrDJCDyK8of1b5_Yzs_p2t Ef8EKY-EdGvlOrupkfR4BHXRT_QqzcRRu_5oKqyj_dKcLb1d  Ef8eWpCZ7U0WWxCFEnXsae_3GTPnAWyolMp6KkWAWetQcjZj Ef9YS30SNJyJv4DWTrPXSDQaaTgPryWPMIz-QKU2aC1yeePS Ef9w0EQ0HIFwiWukVN45cJLuysFzhaAC0aehg0fyvtPzv4Ri Ef8i2chD5IfPkSXafvNC-G-qzNoaNO7nMrRhb-ZlJqz9skie Ef8SgHecBgQgcpTvC_hKms7fr925q9jvWqi60d74_0Fmk7rO Ef_UbDtI4dNA05mzyGLMkYA796KnG-9x8nnNucpcGFxQyQLj Ef9R2vrnxDDf7ispTpFvKAyu-ut6MSFnTCmyGAI2RE1FzhwK Ef_Mh328CYiQkFrRh69RgTGiNxNuLwiXSzU8_jvMTzD_tm11   Ef9kVJqeekA2amHWaOjOwYVaE4Xcm1MuSzWgA2MRgCaTXJcX Ef-V032PbxylvYsjEmTQNjhqdJ4ESPA1EQMb2kb5LcV8oBFZ

virgiltho | SUIcker.xyz: Can someone help me recognize the issue why the last tx failed? I'm doing this from code. https://tonviewer.com/transaction/553921a4f12f6fb1faf51d2c7962a2247c27a9f211830e771a1e594e02d356fc

virgiltho | SUIcker.xyz: Did I set too much of forward ton amount?

virgiltho | SUIcker.xyz: How can I calculate it then? Or what is the common amount of these?

Aram: We just launched USDT support for bridging to TON. (From Arbitrum, BSC, Ethereum, Starknet, Optimism and more)

Aram: https://www.layerswap.io/app?to=TON_MAINNET

Aram: will be happy to hear feedback from fellow devs

&rey: If you need for it to be visible in explorers, 1 nanoTON. Otherwise, you should retain forward amount and increase value sent to something like toNano("0.4"). (reply to 51944)

Aram: please keep it secret for now, it's not publicly announced yet

&rey: I can help to keep it secret so that you don't need to trust all 9K people, do you need that?))) (reply to 51949)

Aram: gotcha - by secret I meant to not share 'too much' (reply to 51950)

Андрей: https://tether.to/usdt-ton.json (reply to 51949)

K.: Nice OSINT skills there :) (reply to 51952)

&rey: Is there some reference to what code oracles run? I haven't found that on Github. (reply to 51947)

virgiltho | SUIcker.xyz: If I would like to send the same amounts like in this tx https://tonviewer.com/transaction/c8e1c99604f8aa4d18a4f760e9bc6467b96b560bd0915f531efa3ab9447fd134 (which was sent from minter.ton.org). What should be the fwd ton amount? (reply to 51948)

Hidanz: @pcrafter please can you help with this , i can't fix this error , i tried everything : Function :  export const SUBWALLET_ID = 239; export const DEFAULT_TIMEOUT = 128;  export const maxKeyCount = 1 << 13;  export const maxShift = maxKeyCount - 1; export const send = async (to: string, amount: number) => {   try {     if (!contract) {       await initWallet();     }      if (!contract) {       throw new Error("Contract is not initialized");     }      console.log("sending TON to", to, "amount", amount);      const msgCount = 3;     const msgs: OutActionSendMsg[] = new Array(msgCount);     const curQuery = new HighloadQueryId();      for (let i = 0; i < msgCount; i++) {       msgs[i] = {         type: "sendMsg",         mode: SendMode.PAY_GAS_SEPARATELY,         outMsg: internal({           to: Address.parse(to),           value: toNano("0.015"),           // body: beginCell().storeUint(i, 32).endCell(),         }),       };     }      const res = await contract.sendBatch(       keyPair.secretKey,       msgs,       SUBWALLET_ID,       curQuery,       DEFAULT_TIMEOUT     );      console.log("res", res);   } catch (e: any) {     console.log(e.message);   } };  The error :  {   ok: false,   error: 'LITE_SERVER_UNKNOWN: cannot apply external message to current state : External message was not accepted\n' +     'Cannot run message on account: inbound external message rejected by transaction 75CDBDD9F0E6688E2EE122A5D489487EFF5C28FBECF916F5AA9D9B213F6EC87F:\n' +     'exitcode=35, steps=71, gas_used=0\n' +     'VM Log (truncated):\n' +     '...xecute EQUAL\n' +     'execute THROWIFNOT 38\n' +     'execute NOW\n' +     'execute PUSH s10\n' +     'execute SUB\n' +     'execute PUXC s5,s-1\n' +     'execute GREATER\n' +     'execute THROWIFNOT 35\n' +     'execute XCHG s4\n' +     'execute NOW\n' +     'execute LEQ\n' +     'execute THROWIFNOT 35\n' +     'default exception handler, terminating vm with exit code 35\n',   code: 500 }

Komron: const transaction = {   validUntil: Math.floor(Date.now() / 1000) + 60,    messages: [     {       address: wallet,       amount: toNanoTON(ton),     },   ], };  const p = await tonConnectUI.sendTransaction(transaction);  Hello guys, do I need ton proof in this case ? Just to send transaction from wallet ?

W4rLock: .

W4rLock: admin, please, I can't send my message in the group, it keeps getting deleted all the time

&rey: Do you have time set correctly on your computer? (reply to 51962)

Hidanz: yes, it's very weird (reply to 51977)

Hidanz: here you can see (reply to 51977)

&rey: Responding to your message, I don't know the reason why that keeps failing. (reply to 51973)

W4rLock: It seems to be some forbidden word, but my text is big, I have no idea what the problem may be. (reply to 51980)

Flyheck: import TonWeb from "tonweb"; const tonweb = new TonWeb(); const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"}); const address = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address("<OWNER_WALLET_ADDRESS>")); // It is important to always check that wallet indeed is attributed to desired Jetton Master: const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {   address: jettonWalletAddress }); const jettonData = await jettonWallet.getData(); if (jettonData.jettonMinterAddress.toString(false) !== new TonWeb.utils.Address(info.address).toString(false)) {   throw new Error('jetton minter address from jetton wallet doesnt match config'); }  console.log('Jetton wallet address:', address.toString(true, true, true)); Could you please confirm if my understanding is correct that the second check is necessary in case the master token returns a completely wrong address? If so, I'm not quite clear on how this check.  What would be the optimal way to perform this check using tonapi?

Амир: Can someone explain me how can I construct and specify the message body in the following code?  let link =         `https://app.tonkeeper.com/transfer/` +         address.toString({             testOnly: true,         }) +         '?' +         qs.stringify({             amount: toNano(0.05).toString(10),         });      qrcode.generate(link, { small: true }, (code) => {         console.log(code);     });

Evgeniya: Good evening, maybe someone knows where to write to me regarding my question. I sent ton to the bybit exchange wallet, but entered an incorrect memo. Bybit was returned to me back to the sender's address. They didn't reach me. I was told to contact telegram support. Like my ton is on their platform and I need them to help me transfer from the platform to my deposit wallet address. Help 🆘 technical support is not responding. Where else can I write??? Has anyone encountered this problem?

Boris: Guys, this does not look like a very good way of creating a slice (end_cell + begin_parse)  Is this is the only technique to do so?

— 2024-04-19 —

optictopic: Quick question, I had some TON sent from Kucoin to my Trust Wallet. The TON was never deposited. When I went to TONscan and put in the destination address in changes the last 3 characters of the wallet address and shows the correct balance. How do I get access to the TON?

0xBullboy: Hi Team, how can I sell/buy jettons programatically ? I'm using pytonlib for creating my wallet and it works fine but I can't make transactions related to jettons

&rey: This is the only way to create a slice, though you do not need slice there in most cases; builder would've been stored much cheaper. (reply to 51998)

&rey: docs.ton.org - TON Cookbook (reply to 52010)

Boris: you mean builder as address? (reply to 52015)

&rey: Have you tried reloading everything? (reply to 52005)

&rey: By tracking either source or destination contract. (reply to 52008)

Boris: good to know, thank you 👍️️️️️️

&rey: This check is not needed (since jetton master is always right) and may even be wrong, if said jetton wallet is not deployed. (reply to 51985)

Nxrix: https://github.com/ton-society/grants-and-bounties/blob/main/grants/GRANT_PROGRAM_GUIDELINES.md does anyone know how much time we have for applying to this?

Eric: Any one knows why there is a check on the seed before creating the key? https://github.com/xssnick/tonutils-go/blob/master/ton/wallet/seed.go#L89

TON Bounty Bridge: ​ Creation of ShiftX Platform on TON Blockchain  🏷 Developer Tool  Summary:The need to create a multi-functional platform called ShiftX using DeBots SDK to interact with TON B...  Rewards: • SBT Bounty Reward • 10000$ in TON  Created by AndyYaG

&rey: How much TON are you asking jetton wallet to forward? How much does it receive? Does it spend zero on computation and other fees? (reply to 52023)

&rey: @ThanhNgalt Please answer these three simple questions. (reply to 52029)

Russia: i transfer 50 JETTON GRAM to TON, forwardAmount: 0.25 TON (reply to 52031)

&rey: Well, how much TON does jetton wallet receive from your message requesting transfer? (reply to 52032)

Russia: 0.25 ton (reply to 52033)

&rey: Tada! And does it spend zero TON on computation fees? (reply to 52034)

Russia: 0.01 TON (reply to 52035)

&rey: Don't you think that jetton wallet can't receive 0.25 TON, spend 0.01 in fees and forward still 0.25?

Russia: So you think, what would be the solution for me? (reply to 52037)

&rey: Increase TON sent to jetton wallet to 0.30. (reply to 52038)

Nxrix: How to get transaction id from ton connect

Nxrix: I need a way to check the transaction

Russia: I tried increasing it to 0.3 with the following code: const amountIn = toNano("50");       console.log("amountIn:", amountIn);       sleep(5000);       await scaleWallet.sendTransfer(sender, toNano("0.30"), {         amount: amountIn,         destination: scaleVault.address,         responseAddress: sender.address,         forwardAmount: toNano("0.30"),         forwardPayload: VaultJetton.createSwapPayload({           poolAddress: pool.address,         }),       }); but i don't transfer GRAM to TON (reply to 52039)

&rey: Don't you think that jetton wallet can't receive 0.30 TON, spend 0.01 in fees and forward still 0.30? (reply to 52042)

nguyen: Please someone let me know.  support wallet telegram is it still active?  I sent a lot of support but got no reply from them

Russia: Can you tell me how many inputs I need to fill in to execute this command? (reply to 52043)

Nxrix: Can someone change ton connect things and fool the website to think it's connected to a specific address?

&rey: Yes (see manual in docs), unless the site requests ton-proof. (reply to 52052)

&rey: For true dApps, this does not matter since hacker still wouldn't be able to send transaction from this address.

Naved: Argument of type 'NftCollection' is not assignable to parameter of type 'Contract'.   Types of property 'init' are incompatible.     Type '{ code: Cell; data: Cell; } | undefined' is not assignable to type 'Maybe<{ code: Cell; data: Cell; }>'.       Type '{ code: Cell; data: Cell; }' is not assignable to type 'Maybe<{ code: Cell; data: Cell; }>'.         The types of 'code.bits' are incompatible between these types.

Naved: i am new to ton

Naved: i am following this  https://github.com/howardpen9/nft-template-in-tact

&rey: Replace imports from "ton" to "@ton/ton", "ton-core" to "@ton/core". (reply to 52058)

Bumea Bumba: Hello, I am new to Ton. On the official Ton website is a link: Download Blueprint SDK. But if I click it it says page not found.

cemorum: Hi, is there an SDK for ton connect kotlin?

Eric: anyone has a working golang example to init wallet?  I always receive:   SendWaitTransaction err: failed to send message: lite server error, code 0: cannot apply external message to current state : External message was not accepted  following https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go

Heydar: so how the games can handle the latency in TON?🙏🏽 (reply to 51836)

&rey: They do not go for realtime onchain recording. (reply to 52077)

Heydar: So it's semi centralized? (reply to 52078)

Elon: Why does this code send TON back again?

Elon: const transaction = {     validUntil: Math.floor(Date.now() / 1000) + 360,     messages: [{         address: "0:recipient_address", // Replace with the recipient's address         amount: "amount_in_nanotons",   // Replace with the amount in nanotons         bounce: false,                   // Set to false to prevent bouncing     }] };  export const SendTON = () => {     const [tonConnectUI] = useTonConnectUI();      return (         <button onClick={() => tonConnectUI.sendTransaction(transaction)}>             Send TON         </button>     ); };

Tran: I have same issue :( (reply to 52081)

&rey: I haven't said anything about centralization! There are different solutions. (reply to 52079)

Russia: can you help me swap JETTON to TON? This is my first time doing this. Please tell me more (reply to 52043)

Heydar: your right , I read some repositories and source codes, and in my obtaining information , I saw they collecting batch of the results and sending in some period times or  maximum bits.(using some schedulers)  but Im wonder how they make an interactive multiplayer game on TON ... is that possible or not? (reply to 52088)

&rey: I don't remember flag "bounce" from docs of TC2, so probably it is not checked there. (reply to 52081)

&rey: Then, are you familiar with TON principles and architecture? (reply to 52090)

Elon: It will still return without this parameter. I have tried it many times (reply to 52092)

&rey: TC2 may have no support for non-bounceable messages, I mean. (reply to 52095)

Elon: thank you (reply to 52096)

Klay.D: hi, how to simulate bounced message in testing? I use blueprint

Elon: Is there no other way to send a TON to another address using tonconnect/ui-react?

Russia: a little. I tried to swap according to dedust's instructions, but when I did the transaction, it didn't include <amountIn> but only sent 0.3 and received 0.299. So I hope to receive your help @pcrafter

&rey: Please try learning from simple TON transfers and contract "invocations" to the complex interaction chains like swaps. docs.ton.org will help you in that. (reply to 52102)

Russia: I see on the ton that swap is also done through dedust? (reply to 52104)

wikig: Hello guys  , is there any origin USDT token/jetton on TON ?

Heydar: #Question,  I can use  getters method(method_id) without paying transaction fee? or it's just usefull in sanbox testing?

Crypto: Hello guys, Is there any possibility to mint or pay for NFT in other coin than TON?

User<6156051718>: Guys one question about LP Pool. If I create a pair like say Ton/not do i get two kinds of LP tokens like one for ton and one for not? Or do i just get one kind of LP tokens?

M: Hello!  Im new on Ton Chain and i have a little problem. Its my code To sen Jetton   const seqno = await this.wallet.methods.seqno().call() || 0;             const numericAmountInTon = parseFloat(amountInTon);             const amountInNano = TonWeb.utils.toNano(numericAmountInTon.toString());              const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode("ID #" + generateHash)]);              const jettonWalletAddress = this.jettons[id_crypto].jettonWalletAddress.toString(true, true, true);              const transfer = await this.wallet.methods.transfer({                 secretKey,                 toAddress: jettonWalletAddress,                 amount: TonWeb.utils.toNano('0.01'),                 seqno: seqno,                 payload: await this.jettons[id_crypto].jettonWallet.createTransferBody({                     jettonAmount: amountInNano,                     queryId: seqno,                     toAddress: new TonWeb.utils.Address(toAddress),                     forwardPayload: comment,                     responseAddress: this.hotWalletAddress                 }),                 sendMode: 3,             }); And in transfer response i see: LITE_SERVER_UNKNOWN: cannot apply external message to current state : Failed to unpack account state  how its wrong?

M: I send some TON for help :) (reply to 52120)

musashi: i'm searching for an implementation of Merkle tree in Func/Tact

musashi: u guys know any repos?

&rey: Yes, you can call them offchain. (reply to 52113)

&rey: Merkle proof, you mean? There is a guide on docs.ton.org. (reply to 52124)

musashi: yes sir, i'm building an airdrop like Uniswap

K.: You don't pay TX fees to call get methods. You can even call them in https://tonviewer.com/  (Methods tab) (reply to 52113)

&rey: It's just an example. I recommend you to start with fundamentals. (reply to 52105)

musashi: still not find it out sir (reply to 52127)

&rey: TON is native blockchain currency, required for computations. If you find a "gas provider" that agrees to pay TON if you send them jettons, you can. (reply to 52115)

K.: I suppose this can depend on the pool implementation, but generally (and logically) you get 1. (reply to 52119)

&rey: https://docs.ton.org/develop/data-formats/exotic-cells#simple-proof-verifying-example (reply to 52131)

Heydar: thanks for the sharing (reply to 52129)

musashi: thanks ser (reply to 52135)

Kalen: Is Ton-connect not working right now?

Tran: I'm using sendTransaction of tonconnect/sdk. But my transaction always send back TON to my sender wallet

Bumea Bumba: Hello, I am new to Ton. On the official Ton website is a link: Download Blueprint SDK. But if I click it it says page not found.

K.: Are you looking for this: https://github.com/ton-org/blueprint ? (reply to 52145)

User<6468801057>: Hi everyone in the chat, I would like to invite you to join our new web3 project. We need experienced translators and nft makers, also looking for beta testers. From us: decent pay and good schedule. If you are interested, I am waiting for you in private messages.

Jimmy Becen: Hi guys, How to wait until the transaction is successful? I am using @tonconnect/ui-react

Winglabs Agency: GM

Амир: Can someone explain hot to send such user-friendly messages from contract?

Winglabs Agency: Can any devs here tell me whether Tokens on TON can be programmed with TAX?

Carter🧹: When running a node, how can I fix error "failed to init crypto" when trying to open a ADNL query to my node?

WRed: Hello, could you please share the code example for sending Jettons to multiple recipients (10+) in a single transaction? Is this possible with tonweb?

WRed: And what about the fee - is it paid once like with TON, or is there a fee for each Jetton message?

wikig: Hello guys , is there any way to avoid being limit by the startapp length limit ?    How can i pass params like 512 B length  ?

Aram: Guys how the jUSDT is different from Tether USD?

David: Hello TON team/admins. Do you have a customer support email ? I am not getting any attention from the wallet support team. I will need your help please!!!

&rey: So you suppose people outside of wallet support team can change the blockchain records? (reply to 52189)

&rey: They can. (reply to 52165)

David: Dude I asked for a customer support email ID contact. How is that anything to do with changing blockchain records ? (reply to 52190)

Komron: Hi, when tonconnect will receive updates related to usdt ?

Heydar: is that good idea to save billion of contract address in one func code(contract)?

Heydar: something like dict.

K.: Not a good idea for sure. The transaction cost of interacting with such contract will be huge, same as storage fee. (compared to other contracts) (reply to 52202)

Dario: also, you wont be able to retrieve entries from such a big dict, since it will hit gas limit (reply to 52204)

Heydar: so how it should be done? when you need to save the income addresses? (reply to 52204)

K.: why do you need to store so many users? there are definitely other ways to solve your problem without storing so many addresses (reply to 52207)

Heydar: I want to store some informations about the users for example today a user have new story , and I want to have a history of him for example few days. and we have so many users. (reply to 52209)

Сергей: Hello everyone, can you please tell me if it's possible to send jettons using '@ton/ton' sendTransfer / sendMessage? All I've managed to do is to retrieve the jetton balance. All the examples I've come across use client SDKs

musashi: sharding way: in Ton u split data structures into separate contracts (reply to 52210)

musashi: https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons

Boris: btw sharding, currently validators have to host a full node, does anyone know if this will change in the future? (reply to 52212)

K.: Yes, it is possible. You send Jettons by sending an internal message to your Jetton Wallet and including the amount and destination address in the body of the message.  See how transferring is implemented in this wrapper and should get the idea:  https://github.com/ton-blockchain/token-contract/blob/main/wrappers/JettonWallet.ts (reply to 52211)

User<7195257024>: Hello, I am a developer at TON.  I am ready to work now, I can do smart contracts, scripts of any complexity and web3.

User<7195257024>: Yes, pleas message me.

Сергей: thanks (reply to 52215)

W4rLock: Hello, I'm trying to use this for my website.  https://github.com/tonutils/reverse-proxy  I try to execute this command   ./tonutils-reverse-proxy-linux-amd64 --domain your-domain.ton   And I get this message    goroutine 1 [running]: main.setupDomain(0xc000142800, {0x7ffc47eb07fb, 0xf}, {0xc00006eca0, 0x20, 0x20})  /Users/xssnick/dev/ton/reverse-proxy/cmd/proxy/main.go:211 +0x865 main.main()  /Users/xssnick/dev/ton/reverse-proxy/cmd/proxy/main.go:120 +0x40e  But if I run only this part of the command, it works  ./tonutils-reverse-proxy-linux-amd64   but the adnl address it returns to me cannot be registered in my domain dns.ton.org because it returns the message "The ADNL address is invalid." But it is valid, I can access it through my browser and everything works fine.  Does anyone know how I can solve this?

Амир: Can someone can help me with this issue https://stackoverflow.com/questions/78354769/unable-to-send-internal-message-with-utf-8-comment-in-func-tvm-exit-code-9

Nxrix: How to have ton connect dark them in html,js? I saw in the documents that THEME.DARK was used but this is not defined in js

🩸m/m 🍌🥕🦴: Hi guys, is there a solution that I can see the full list of the key tree in my Ledger?

Nikolay Kovalkov: Looking for a job as a developer ton graduated ton dev work on web3, smart contracts and write scripts of any complexity

Nikolay: Hello everyone, this is a question, my team made an MVP, we want to connect it with the TON ecosystem.  Who knows, maybe there are some qualifying stages for projects?  What are the stages in general, if there is such an idea?

David: I am a newbie developer on TON network, Can I ask you guys how to listen swap event on TON? Thank you so much

Abd: I need someone that can write smart contract and payment on contract please dm right away

&rey: IIRC you may not ask for DMs in TON official chats. (reply to 52296)

Abd: Ok thanks (reply to 52298)

Kom: who needs a dev?

&rey: That's a hard task, above your level and above average developer's one! (reply to 52286)

David: How the tonscan can recognize these messages, IN, OUT and SWAP 🤔

avesda: Guys I need help understanding addresses.   I sent some ton to recipient address A. But on explorer it shows as if I sent to B. If searched for address A it leads to B.  What is this sorcery

&rey: Let me guess, one starts with EQ and other with UQ? (reply to 52305)

avesda: Yes

&rey: They are the same address.

avesda: I see, what is the reason for this? How can I search for this in docs ?

&rey: Non-bounceable flag. (reply to 52311)

avesda: Thanks 🙏 (reply to 52312)

Chernikov: Hi every one! Can anyone advise - how do I pull a user's balance if they have given their mnemonic phrase, but within the Mini App, and I want if the user enters a command into the bot there, it will give them their balance back? Bot is written on python

Heydar: because of this code:  expect(sentMessageResult.transactions).toHaveTransaction({       from: senderWallet.address,       to: myContract.address,       success: true,     });  Im confused one message sending can have more transactions!? (because it's array)

&rey: [almost] Each transaction is processing of one message. (reply to 52320)

Heydar: Thanks. Hence why we have array of transactions here? (reply to 52324)

Oba: How do you burn liquidity pool stonfi?

TON Bounty Bridge: ​Article: Direct and Indirect Approaches to Reading Contract State Variables in Tact  🏷 Resource  Summary:This material should be a guide for Tact developers who want to understand and implement methods for...  Created by seriybeliy11

🩸m/m 🍌🥕🦴: I have the same problem, I bought a ledger I thought I could get the address, but I had no luck. I took out the private key from safepal and tried to sign the transaction and get my address and it didn't work either( There is only one solution is to make the safepal team finalize the PR to support TON CONNECT. (reply to 51511)

🩸m/m 🍌🥕🦴: In general, it is strange that TON works with bip39 in a very peculiar way and safepal wallet has announced support for the network but has not made it possible to work with TON CONNECT and it remains only to wait

spanish-or-vanish: Hi everyone, im looking for a ton js/ts lib thats well maintained, any suggestions?

User<6821103918>: GM y'all

User<6821103918>: Perry in here? The XSYCOIN DEV? Please DM me.

comfix: Hello, I need your help.  I deposited the tsTON that was stored in gateio's TON wallet. Is there any way to find it?

— 2024-04-20 —

fade: Hello, is anyone here running a fullnode and having trouble with opentonapi doesn't index tx and wallet jettons?

fade: Is there anything that can be done to make it work?

Blockchain Dev: hey

Blockchain Dev: Can anyone help me create an airdrop contract? when users claim 0.1 TON fee and then they receive Token.

Thang: Hi there, How can I collect the swap fee of a Jetton token?  In solidity I can handle it in erc20's transfer function.  For example, when an user swaps 100 erc20 tokens, I will take 5% fee and the user receives 95 tokens.

Matthew: hi all, i want deploy jetton include buy/sell fee. it is feasible? because i see ston swap goes through many steps, how do i know if it is a buy/sell transaction from ston swap?

User<6156051718>: Guys, if I add a dex pair to ston.fi will it also be tradeable on other dexed like dedust? What would be the best dex to create a dex pair? ston.fi or dedust? Or should I create a dex pair on both?

bharath: Both if it wants to be tradeable on both dexes (reply to 52364)

User<6156051718>: okay thank you (reply to 52365)

Howard: Hi, I noticed that: https://docs.ton.org/develop/howto/blockchain-configs#param-4 / https://docs.ton.org/participate/web3/dns#first-level-domain shows:   This could change in the future. Adding a new first-level domain will require new root smart contract and general vote to change the network config #4.  but haven't see how they add the .ton, .t.me or .gram over there?   - contract: https://tonviewer.com/config#4

Abd: Yes let's discuss (reply to 52350)

Matthew: https://testnet.tonviewer.com/transaction/4e3bfcaf9a4de680b940b27a06afc6a32210aa3c74be4d9ff04e63a8f9aaded7  hi all,  i using repo token-contract to deploy my jetton but i have issue when mint token, why i receive excess and exit code 65535?

Fereshte: Does anyone know what is this error for when transfering: Cannot run message on account: inbound external message rejected by transaction 5A28832AE409B6A7FADF4752054F0B0D587C4190EA4B4E6C146A29F9163E2595:     exitcode=0, steps=0, gas_used=0

Maxey: I used ton-connect in the mini app, and I want to batch multiple transactions so that users can consent in the wallet all at once.   However, I found that ton-connect can only package up to 4 transactions at a time. Is there any other way to bundle more than 4 transactions?

Matthew: i have same issue, have you found the solution yet? (reply to 52356)

Thang: Not yet, but I have thought of a solution.  jetton wallet sends notification to jetton minter, swap vault address + swap fee percentage is configured at minter, minter processes fee and sends back to wallet.  Is that reasonable? (reply to 52389)

GoldRiver: Where to burn Lp token in tonchain fam?

GoldRiver: I have new meme token lauch on ton, but i dont find where to burn lp token

Matthew: i also think the same as you, but i'm having a problem with token contract repo when minting through exit code 66535, i am trying to fixed it before handle the swap fee logic (reply to 52391)

backed.ton: This burn address UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ (reply to 52392)

Thang: Have you minted the token yet?  I also got an error in the mint token step but it was still successfully minted. Try increasing the amount of TON on the client side, maybe due to gas fee. (reply to 52395)

Matthew: I also minted the token but there were excesses error occurred, (reply to 52399)

Thang: The token is minted only once for the admin, then the owner is transferred to zero address.  The admin holding the token can distribute or add lp. Does that error affect your business? (reply to 52400)

Matthew: no but because I wanted to understand clearly why that error resulted while reading the source code I did not detect the problem that led to that error. It's just a mistake to ensure the integrity of the token (reply to 52401)

Thang: I'm new to TON stack, I don't deeply understand the cause of the error, my current deadline is swapping taxes 😅😅 (reply to 52402)

Thang: I think the error were not reverted because of sendMsg mode

Heydar: few contract addresses have some text description when you open their tonscan contract at top of the page. how they do that? sending some text with deploy initialize?

Matthew: me too, we can contact more to discuss this issue, two people are always betten than doing it alone (reply to 52403)

K.: like “jetton_master” or “wallet”? (reply to 52405)

K.: those are very popular contract types that are recognized by the explorers

Heydar: no ,it can be custom text.  but I saw someone was not popular  I cant find it now (reply to 52407)

Heydar: it seems something like json is uploaded too!  {   "url": "main url www ...",   "name": "naming" }  manifest.

Heydar: I cant find it , sorry

User<7195257024>: Hello, I am a developer at TON. Offer your tasks, I will consider every task.  web3, smart contracts, and other scripts.

Denis: How do I handle errors related to token delivery failures to the wallet, I use TS https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer.

Kushagra: Hi everyone, I have a jetton token on the mainnet.. Which when I import in the Ton Space Beta.. It says "There is no community information on this jetton. Please exercise caution".  How and where can I put in my information.. Simmiliarly how to get the logo of my token visible on TonViewer and tonscan? Any guidance would be really appreciated.

Denis: does anyone know how to translate the string with the wallet address into an object of the Addres class

K.: Address.parse(“EQ….”) (reply to 52432)

Stanislav: ton proof, what is exactly BackendTokenContext must be? what are the requirements for its implementation and maybe there is an example of it

Jeremy: Hey everyone, How can I create other contracts from the factory contract?

ZeZeze▪️: Yay I can type!

Sofia: Same question (reply to 52441)

Heydar: Sorry Im confused,  we are inheriting from Contract   export class TestPrj implements Contract {     async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {         await provider.internal(via, {             value,             sendMode: SendMode.PAY_GAS_SEPARATELY,             body: beginCell().endCell(),         });     } }  so when we call      await testPrj.sendDeploy(provider.sender(), toNano('0.05'));  we dont send the ContractProvider on calling side, so I assume something like that we send this as that parameter by default(like self in python) but when we inhertited Contract, why we send ContractProvider!? please can someone help me.

Tran: wwhat different between yellow and green

Tran: how to get green transaction hash from boc when using SendTransaction of tonconnect

Андрей: hi, where can i get more than 5 TESTNET TON/ 1 hour ?) thank you.

Tran: https://t.me/testgiver_ton_bot (reply to 52447)

Gyorgy: Why you need more? Just adjust your test application to use lower prices. (reply to 52447)

Андрей: In case of testing highload wallet with many transactions ( more than 300 in one script ). In default wallet I need to check seqno, I wanna know what I need to check in highload (reply to 52456)

Gyorgy: You can test with 0.01 TON transactions / each.

Gyorgy: Ask twice 5TON / hour from https://t.me/testgiver_ton_bot

Андрей: I can get only once 5 TON /hour , not twice (reply to 52460)

Gyorgy: Yes. You ask now, and in one hour again. Then you have 10 TON, plenty to test with your use-case.

Андрей: Oh , tg delete previous message , thanks for idea, can send 1 nanoton / transaction (reply to 52459)

Gyorgy: That’s just spamming the network for no reason. You said 300 transaction in one script.  0.01 is more than enough to test that.   To test the script you can test with 1-2 transaction if all works properly, you test with all 300 with 0.01 each. Theres no reason to go below that.

Андрей: You misunderstood a little, I want to send 300 messages in 2 transactions (I may have expressed myself incorrectly before), a regular wallet allows you to send 4 messages in one transaction. The point is to send all 300, since highload allows you to send up to 254 messages, I want to send 254 messages + 46 messages at once (reply to 52465)

Gyorgy: That’s different, but still should be enough to cover it.  Highload v3 can only send 1 message from any given external message, however it can send that message to itself with a special op code, allowing one to set any action cell on that internal message invocation, effectively making it possible to send up to 254 messages per 1 external message (possibly more if another message is sent to highload wallet again among these 254).   As far as I know theres no way to go above that limit, only to make in 2 parts. I’d go with 2*150 messages if 300 your goal.

DILAVAR Singh: Hi

Denis: how to handle errors in sending transactions in TON walletContract.sendTransfer?

Gyorgy: It’s really up to your code. Go/Python/Js?   Maybe use universal try/catch block and handle events there, then once you recognised where things go wrong, hardcode those events and only catch unexpected errors.   Easy, you got this 🙂 (reply to 52474)

Denis: Type Script

Gyorgy: Start here:   try {     // Your code here } catch (error) {     // Code to handle the error     console.error("An error occurred:", error); }    Then adjust further.

Denis: it doesn't work for the case when for example I make too small commission, the catch fails and the transaction is not created.

Gyorgy: Somewhere, you must identify an error to handle it.   Where do you find the log that it insufficient to cover the transaction? If you spot it, you can manage it.   Perhaps the library you are using has specific error-handling functions; in that case, refer to the documentation of those libraries. (reply to 52480)

Denis: Does anyone have bad wallet addresses, I'm writing tests for my program.

Gyorgy: Bad? You mean incorrect? Easy, just make a typo then to check if it’s valid or not 🙂 (reply to 52483)

Heydar: can some help me? (reply to 52443)

Roman: “bad-wallet-address” (reply to 52483)

Denis: I'm catching this (reply to 52484)

Denis: I mean wallets that exist, but to which you cannot transfer tokens

Roman: deploy contract with this code, it can`t receive tokens () recv_internal (int msg_value, cell in_msg_full, slice in_msg_body) impure {   throw 777; } (reply to 52488)

peilipu: hi ,how to parse jetton transaction's body(payload)?

peilipu: i can get body from tx.IO but how can i parse body to readable text?\

peilipu: arr, _ := tx.IO.Out.ToSlice() body := arr[0].AsInternal().Body

peilipu: i want to parse body to get jetton transfer amount and comment

ch4rter: Hello everyone, please help me, I have two questions: 1) I can’t get into the RU chat, can the admins help? 2) Please tell me what I need to know to create dapps? Do you have any good courses for beginners? What languages should I learn?

Roman: https://tonhelloworld.com/01-wallet/ https://docs.ton.org/develop/smart-contracts/ https://stepik.org/course/176754/syllabus (reply to 52496)

Vladimir: The workshop "Introduction to Programming Smart Contracts in Tact" will begin in two minutes, you can watch there https://www.youtube.com/watch?v=0TfwDGYjCHQ (reply to 52496)

peilipu: hi everyone , who can help me solve my problem which i have recorded here ,thanks https://github.com/xssnick/tonutils-go/issues/186

Heydar: Please help me , at least what I search for this problem in google (Im not react js developer) Im trying to learn func now, and js later. (reply to 52443)

Denis: what does your code do? (reply to 52489)

Roman: just throws exception on any incoming message so that any incoming assets will be bounced back (reply to 52506)

Heydar: https://tonscan.org/address/UQCfWKFMxYLnQCM5Gk3M-Q9pr5mM0v8563fPELMUv_YKtm7g  what's crypto bot!? why it's not contract address?

K.: provider, in this case, is the interface that allows you to interact with the contract. It has methods for internal and external messages, getting the state of the contract and etc. In your example, the provider sends an internal message to the contract. (reply to 52443)

Denis: and you don’t know if there are already written tests for distributing tokens in the TON blockchain? (reply to 52507)

K.: Crypto bot is the wallet behind @wallet IIRC. Used for depositing and withdrawing. (reply to 52508)

&rey: client.open adds a parameter. See: function currying. (reply to 52443)

Heydar: Thank you so much

&rey: Explorers replace some addrs with their known names. (reply to 52508)

Heydar: Im not go developer, but in the type structures , you can take Amount and  Body.Dump()  it seems it's string, check this line url. (reply to 52502)

&rey: Any contract [in basechain] can own tokens. (reply to 52488)

&rey: TON will bounce (unless message is non-bounceable). Jettons and NFT won't, which is the reverse of what was asked. (reply to 52507)

Heydar: Guys, if someone finds a bug in TON (code base), is there any prize for that? https://github.com/ton-blockchain/ton sorry if it's not the related to the topic .

Roman: @sti11er I misread initial question. My bad. Under «assets» I meant TONs, Jettons and NFTs (and other types of tokens) are just data inside contracts storage so they won`t be bounced automatically. (reply to 52519)

peilipu: thanks your replay , but this amount is for TON, i want the jetton amount and comment (reply to 52517)

Boris: only for send/get* methods 😉 (reply to 52512)

peilipu: which language you are using? how do you get jetton amount and comment from transaction in your language lib? (reply to 52517)

Boris: this is a bit confusing for newcommers, because in fact any contract can be owner of a token-wallet, only token wallets can hold token amount actually (reply to 52518)

Boris: I think TON is so much different from other systems, there must be much more education programs, imho.

Gyorgy: There are a lot actually on ton website in Docs section and around github in examples and various projects. But I believe its always updated, extended and feedbacks welcomed. (reply to 52528)

Boris: There are, I did not said there aren’t. )) (reply to 52530)

Piotr: Hi, has anyone used tonfree website before and can say whether it is legit or a scam? Please🙏

MIrzaGhaniUs Gra-Gra $X 🥠 🆙 UXUY: hi developers i want to know one thing i want to create a token so which things i need to follow about token and any developer here who guide me how many cost expected to create a token  to till lounch

MIrzaGhaniUs Gra-Gra $X 🥠 🆙 UXUY: inbox me if any one have good experience to guide me thanks

Boris: this https://tonfree.win ? scam 100% (reply to 52534)

Gyorgy: Most of the things what looks to be so good to be true, it’s a scam 🙂

Piotr: yes this one (reply to 52537)

Piotr: Ok thanks <3

Gyorgy: The best advice for such situations is to follow official channels to know whether something is real or not.   External websites promising something are 100% likely to be a scam.

User<7195257024>: Hello, I am a developer at TON. Offer your tasks, I will consider every task.  web3, smart contracts, and other scripts.

Crypto A99: hello, Can i ask for how to Unfreeze the contract? when contract is Frozen   https://tonviewer.com/EQCctNuvDyHi391daUIldqh80cSLKVKbOrZkOuwv93JZiwjk

Stanislav: How I can get such categories for transactions?

&rey: It's hard. Please note that's not transactions view but aggregation. (reply to 52551)

Stanislav: thanks for the answer, sometimes I see that decoded_op_name allows to see it, but sometimes it's empty, or because of coments somehow (reply to 52552)

Slims (Ø,G): Hello DEVELOPERS if yall looking for a moderator on your project's group or channel .. Am just a DM I can handle that perfectly .thanks and please I prefer legitimate projects cos I love my sanity ..

Pike 🦴 🏴‍☠️: Hello guys. How do i get the result of a simple transfer transaction contract.sendTransfer({     seqno,     secretKey: keyPair.secretKey,     messages: [internal({       value: amount,       to: to,       body: "Test",     })]   });

Pike 🦴 🏴‍☠️: I want to know if it is success or not, akin to tx.wait() in evm

Stanislav: maybe someone has worked with a similar problem and is ready to share ideas - I will be grateful (reply to 52551)

Sofia: Looking for a dev that can code a simple telegram bot that also has some ton payment features. We can either do revenue share or I will pay for the job. DM

nyssa: guys could anyone provide bridge address from evms(eth, bnb ) please

🐾: Ca

&rey: By polling either source or destination contract. (reply to 52557)

&rey: You should poll destination contract because it can bounce money to you, which you'd want to know. But that transaction may be a minute after TON sending, depending on number of shards.

Blockchain Dev: I want to write a similar contract: https://tonscan.org/address/EQCaFoHe_hgwwtj3n5gjUsmGcxHA0X_-q2mZTxyzmvbWnEtC just send TON to this wallet address and the tokens will be paid immediately.

&rey: That's like a DEX without price change? The contract is quite simple, do you want to write one yourself? (reply to 52577)

Blockchain Dev: I still don't have the starting materials. (reply to 52578)

&rey: docs.ton.org. TON Cookbook there may prove useful. (reply to 52580)

&rey: If you miss something in it, please do say!

Blockchain Dev: I'm building Memelandia and look forward to your support.

Blockchain Dev: Having videos or pictures would be better. I'm used to solidity :(

&rey: https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers (reply to 52584)

&rey: There were some links to video materials as well + TON Cookbook comes with message chain schemes.

Blockchain Dev: wow. So it is possible to deploy Solidity on the TON network

harry: Hello, I have deep experience in blockchain & full stack. Is there anyone needs these skills?

&rey: No. Architecture is completely different, starting with the fact that contracts are isolated. (reply to 52587)

Blockchain Dev: demo ton (reply to 52588)

Blockchain Dev: So where should I start? (reply to 52589)

Blockchain Dev: I'm familiar with remix.ethereum.org

Blockchain Dev: Ton has the same thing?

&rey: From whitepaper would be the best time investment. (reply to 52591)

Sumit: BitBuilder overflow        343 |         if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }       344 |         b_0.storeCoins(src.forward_ton_amount);     > 345 |         b_0.storeBuilder(src.forward_payload.asBuilder());           |             ^       346 |     };       347 | }       348 |

Sumit: getting this

Sumit: how should i fix this?

Boris: https://stepik.org/course/176754 (reply to 52591)

&rey: By storing forward payload in reference. (reply to 52604)

Blockchain Dev: thank (reply to 52605)

Sumit: okay, i fixed that. thanks (reply to 52606)

Sumit: i have a Transaction from ‘@ton/ton’ how can i check if it was a success or failure?

&rey: Depends on what you'd consider failure. (reply to 52610)

Sumit: anything other than a success is failure (reply to 52611)

&rey: And anything other than a failure is success, right?) You should check if the intended effect took place. Whether the tokens were delivered, etc. (reply to 52612)

Sumit: https://testnet.tonviewer.com/transaction/950c3cbba8c1b7d2e1dab7dc79bb50b0bd16bb5e87c0d6363ea03b0c78d24857 (reply to 52613)

Sumit: ie the explorer knows it failed

Sumit: and i would consider the same criteria be a failure

&rey: 1. That could have been the intended effect, 2. Transaction matcher has appropriate field. {..., success: true}.

&rey: However, if contract processed jettons and failed gracefully (that is, returning jettons back), you wouldn't see the failure flag at all.

Sumit: isee (reply to 52618)

Sumit: got it

Sumit: const seqNo = (await signer.getSeqno()) + 1;  await contract.send(…)  while ((await signer.getSeqno()) === seqNo) {         await new Promise((e) => setTimeout(e, 1000));       }       const lastTx = await provider.getTransactions(contractAddress, {         limit: 1,       });  this is how i get the txn hash that i just sent. is this correct? (reply to 52618)

&rey: Conditional on sender not doing more transactions plus not receiving incoming TON, you're doing right. (reply to 52623)

Sumit: okay (reply to 52624)

&rey: Also, this loop may become infinite.

Sumit: is there a better solution?

fade: anyone know how to raw_send_message_return_hash with pytoniq?

Heydar: C++,  I wanted to say something , but I see that you found the solution , sorry. (reply to 52526)

Heydar: I checked but could not understand. we have 3 arguments for the method. but it passing just two variables.  so whats happend to first variable that it ignored? (reply to 52509)

Heydar: I saw that , but I could not make relation between them ... sorry. what do you mean client.open adds a paramtere:  my code before calling:       const testPrj = provider.open(         TestPrj.createFromConfig(             {                 id: Math.floor(Math.random() * 10000),                 counter: 0,             },             await compile('TestPrj')         )     ); (reply to 52512)

&rey: TestPrj.createFromConfig(...).sendDeploy would require three parameters. provider.open(TestPrj...).sendDeploy requires two.

Heydar: so this will be passed as first paramter if it's not explicitly assigned in calling? (reply to 52640)

Heydar: oooooooooooohhhhhhhhhh got it, it's a template type!

Heydar: and wrapp their method in that template and passing it as first parameter. is that right?

Heydar:      [P in keyof F]: P extends `${'get' | 'send'}${string}` ? (F[P] extends (x: ContractProvider, ...args: infer P) => infer R ? (...args: P) => R : never) : F[P];

Heydar: got it, thank you so much.  so why we do that? wrapping that in OpenedContract?

&rey: For easier usage, I guess. (reply to 52645)

Heydar: thanks (reply to 52646)

Boris: In the standards smart contracts the upper version is used, why?   int op::get_static_data() asm "0x2fcb26a2 PUSHINT"; const int op::get_static_data = 0x2fcb26a2;

Boris: I find, that the second version is simpler and clear, why the explicit asm stuff?

PavelN: Guys, does someone know how to obtain an archive state on a Testnet node?  I tried to resync the node from genesis with following parameters:  validator-engine -c /ton-work/db/config.json -C /ton-work/db/ton-global.config --db /ton-work/db --state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000   I expected that with 10-year lifetime all blocks will be retained, but it did not do the trick and I obtained quite a short state starting from around 18511000. How can it be configured? Alternatively, can I somehow get an archive state for Testnet?

Boris: Аnswer: historically there were no constants in func. (reply to 52649)

Heydar: or maybe optimization reason? (reply to 52653)

Boris: That is what I was thinking, but it is very unlikely in case of an explicit const (reply to 52656)

Blockchain Dev: Can a person disconnect the ton wallet and send the "TON" token transaction to a wallet or contract in html.

Heydar: let's assume if you could using uint8 instead that int , in this scale it's good optimization. I dont say that is the reason , just I thought about something like that. (reply to 52657)

Boris: https://docs.ton.org/develop/func/literals_identifiers#constants (Read the docs, they said 😅️️️️️️)

Heydar: I was reading same exactly now😂 (reply to 52661)

Blockchain Dev: Is there anyone here who accepts writing airdrop contracts?

Komron: is there any updates related to TON Connect UI ? Meaning USDT related updates

— 2024-04-21 —

&rey: github.com/Gusarich/airdrop (reply to 52667)

Bear: should we implement the  op::provide_wallet_address() in JettonWallet?  - https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md

Bear: oh, never mind (reply to 52689)

Жоуд: Hello guys mytonctrl validator was working but out of the blue it stopped being in sync any idea on how to fix it?

Behrang: Check your disk, maybe it's filled. (reply to 52696)

Жоуд: Nope

Heydar: it never go to the infinit stage,  because the balance will be ended by fees? and stop? crash or what? 🤔🤔🤔🤔 (reply to 52626)

Heydar: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#drawbacks (reply to 52526)

User<7195257024>: Hello, now ready to work on any orders. I am a developer on TON, great experience, can write smart contracts, web3, and scripts of any complexity. (reply to 52502)

Rishabh: Hi everyone, I am facing a problem, whenever I try to connect my tonkeeper wallet using the qr code, I get “Can’t get https//../tonconnect-manifest.json”. It works just fine for other wallets like tonhub

Anarion: 😊Hi guys! Today I was amazed and decided to write my projects, which I have been running for 15 years, under the TON blockchain, the first day I got acquainted with the chat, but I was banned from the neighboring Russian one. Maybe I expressed myself impolitely about something? I'm sorry. But without the support of the Russian-speaking community, it will be difficult for me to fit in. How can I find out how long the ban is there? Or is it eternal?😅 Can someone put in a good word for me? I will behave well.🙏🙏🙏

5 Slice Pie 🐲: Looking for a ton blockchain dev @roolzgods dm me if your interested

ayushag: Hey, I am new to TON Blockchain and my learning way is by building and collaborating. So, Can I have some Opensource projects or your projects to work on?

Gy: Hi

Gy: hello guys can i ask something?, i want to make telegram bot but i need tutorial link from ton official

Frank: Hi everyone

Frank: Are explorer links banned?

Frank: That's not very handy

Frank: Can someone tell me what is going on in the transaction tonscan . org / tx/1vt7HDFs7Sf2FxQtb48+SjYmuy8pwhNEazUc8o8gIeI=  ?

Carmine: Hey can someone point me to some tutorial or guide on how to build a bot for airdrop my own Jetton to group members ?

K.: There are 3 great Telegram bot examples on the docs: https://docs.ton.org/develop/dapps/tutorials/accept-payments-in-a-telegram-bot  Assuming you want to build a bot that works with TON, of course. (reply to 52742)

Sumit: How do i get txn hash in frontend?

Sumit: Since i dont have control over seqNo here

K.: A staking pool has added more stake. (reply to 52751)

Dmitry: hello! are there any restrictions on running archive node and liteserver on the same server?

Сергей: Hello, can you help me with transferring a jetton, which needs to be sent within an internal message using 'ton/ton'? I know the jetton's address, but I'm not sure at which stage to pass it: in the body or at the stage of client.open() in JettonWallet where only balance and address retrieval methods are available

Adarsh: Looking for TON developers to join team for TON hackathon. Kindly DM with your past work please.

&rey: You're running this validation loop offchain, on your server, so it will run pretty long. (reply to 52703)

&rey: I mean, external message might get lost.

Heydar: ahhh got it , I combined some concepts :D , my bad , sorry. (reply to 52768)

User<6952362368>: Is there a way I can get the list of every holder of an NFT collection on?

!van: Hello. Do TON RPC nodes have a common API? I want to write one integration code for several public nodes

PavelN: Probably, Toncenter API will do the trick for you: under the hood, it connects several public liteservers. (reply to 52781)

!van: I don't want to depend on one service because my project needs fault tolerance, so I'm looking to integrate several. (reply to 52783)

PavelN: You can deploy your own Toncenter instance. (reply to 52785)

Blockchain Dev: Is there any direct implementation like https://remix.ethereum.org/ (reply to 52686)

Stanislav: How can I create web page for edit smartcontract? for example in smartcontract there are "field" address,  I want to put it from input form

&rey: Orbs already has balancer and has same API as Toncenter, so you can integrate those two. (reply to 52785)

&rey: Please note that they have different bugs though!

&rey: I don't think so. Who would want to host a huge list of address-amount pairs not for their service? (reply to 52788)

Gyorgy: It looks like some Visual Studio Code implementation online with a few demo projects and examples. There are also a lot of examples and open-source projects available on GitHub for Ton. I'm not aware if such an exact form exists, but I don't think there's much need for it.

Krakovia: I found this one https://ide.nujan.io/ (reply to 52788)

Blockchain Dev: thanks bro

Амир: I am trying to use import { TonClient } from "@ton/ton"; with vue.js, however I face such error Uncaught ReferenceError: Buffer is not defined at node_modules/@ton/core/dist/boc/BitString.js (@ton_ton.js?v=00a0b5cb:557:37). Can someone help to handle it?

Oliver: How can I send tokens to multiple wallets I'm one transaction? Like airdrop distribution?

peilipu: hi guys， what is magic '#7362d09c' stand for? i thought the jetton transfer is '#0f8a7ea5', but i received a token transaction with '#7362d09c'

!van: Thanks! Where can I find a list of bugs? (reply to 52791)

&rey: Easter eggs are only found by testing))) I know that it's virtually impossible to enumerate transactions on long-unused contracts. (reply to 52811)

!van: Ok, thanks 👍 (reply to 52812)

Heydar: when in contracts they write: const int op::new_order = 0xf718510f;  why they dont use decimal base , and using hex base? is that any reason?

Heydar: for example they could write: const int op::new_order = 4145565967;

&rey: Because that makes it clear what length should the number have, makes it easier to compare with what explorer shows, easier to validate cell content, etc. (reply to 52814)

Heydar: Thanks for the help, explorer showing the int numbers as hex? and how you validating the cell contents when it's hex? just one example? or giving me a link to read see better in action. (reply to 52816)

peilipu: how to split a cell contents like this dump 496[7362D09C0000000000000000609184E72A0008002B97FA3F36FB1B0A6289FFA970FE2E760A6EDEBE114FB1DE958BA19FE689643C00000000313233343536]

🅰🅻🅰🅽: Searching for experienced DeFi frontend engineer, familiar with vite / react.js / next.js typescript and tailwind!

إسماعيل: Hello, is there any NFT APIs for TON that comes with floor/pricing?

User<6952362368>: Sorted it out manually.

Nyxra: Hey guys, how can I check the amount of a token balance a wallet holds?

Nyxra: Is there any API for this? (reply to 52831)

Gyorgy: Toncenter V2 API? /getTokenData (reply to 52832)

Gyorgy: Or is your address Jetton balances what you are asking for? Toncenter/Tonapi and there are several other APIs to look for. Some data you can gather from liteservers too; that’s not that complicated either, but it needs to have exceptions for failures, which requires more development.

Nyxra: Yes (reply to 52835)

Gyorgy: Check tonapi-v2, it has jetton balances. Not pasting link here as on some communities not allowed.

Nyxra: Thanks found it (reply to 52837)

On-Chain ⛓️: Hi guys, which API can I use for a TG bot on Ton?

در انتهای صبر، طلا می نشیند.: https://t.me/TONSocietyAfrica

Boris: Guys, when the internal deploy message gets into exception, the contract will not be deployed at all, right?

R: Hey Any TON developers available for hire?

Boris: well, I should write a test =) (reply to 52852)

K.: please report back i’m also curious now (reply to 52854)

&rey: No, everyone is testing whether contracts can be undeployed and publicly predicting if prefix hashmaps have a bug) (reply to 52853)

Boris: I’ve tested with a simple counter example just added throw_unless(100, 0); at the top of the body, and send a deploy command, despite the deploy message was not successful the contract was deployed, and I could run a get method on it. I am a bit confused about that. I think this is a strange behaviour, maybe someone could clearify why that is? (reply to 52855)

&rey: Because contract must be deployed for it to process message. It seems that bounce does not undeploy it. (reply to 52859)

Boris: Ok, in my understand the first message deploys the contract. But Ok, good to know, need to find a way to deal with it. (reply to 52861)

Boris: Can I be sure, that when an exception is thrown, the contract will not accept any ton?

&rey: No. Don't forget about non-bounceable messages. (reply to 52863)

Boris: got it

&rey: Why does the contract need to reject all TON?

Boris: I want to have a simple check against got enough from user, or not at all, so I can forward the amount into the next steps

Boris: if the contract got the accepted amount, I could just check for my_balance > 0 via an external message

Boris: Ok I think there are other ways to check for it, the amount is floating anyway, if the gas is not payed separately

Blockchain Dev: instead we send TON using await function tonConnectUI.sendTransaction(transaction); How can we send Tokens with contract or USDT?

&rey: Destination = sender's jetton wallet, payload = transfer message. (reply to 52873)

User<7118534515>: plz check dm (reply to 52853)

&rey: Please be careful in DM communication, since there is a lot of scam lately. (reply to 52853)

Meloo: Hi. I minted tokens on ninja.dyor and i want add liquidity. Where i can do it?

R: Thanks for the heads up (reply to 52876)

Blockchain Dev: Destination? (reply to 52874)

&rey: However it's called in transaction object. (reply to 52881)

Blockchain Dev: messages: [{             destination: "",             address: "",             amount: amount * 1000000000         }]

Blockchain Dev: async function transaction() {     if (!tonConnectUI) {         console.error('TON Connect UI is not initialized yet.');         return;     }     const amount = document.getElementById('amount').value;     const transaction = {         validUntil: Math.floor(Date.now() / 1e3) + 600,         messages: [{             address: "",             amount: amount * 1000000000         }]     };     try {         await tonConnectUI.sendTransaction(transaction);     } catch (e) {         console.log(e);     } }

Blockchain Dev: Here is what I wrote.

&rey: There is whole article section about that. https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer (reply to 52884)

Blockchain Dev: How to display ton wallet login address.

Blockchain Dev: I want it to display the wallet address in the html after connecting.

K.: https://docs.ton.org/develop/dapps/ton-connect/react#usetonaddress  There’s a hook in the tonconnect ui (reply to 52888)

Heydar: load_coins: unsigned integer up to 2^120 - 1  load_uint(8): signed 8-bit integer  Im writting a test in javascript , shall it be number for both ? or using bigInt and number?

Blockchain Dev: thanks (reply to 52889)

Blockchain Dev: but it is react , I use javascript and html :(

Heydar: so you should create a image link and create deep link for that onclicked and save that in cache to show later. however so many things you should handle, it's better migrate to reactjs Im not reactjs developer, but I found that is better to use that because of big community in TON UI components and so many utilities. (reply to 52892)

Heydar: https://github.com/tonkeeper/wallet-api?tab=readme-ov-file#payment-urls (reply to 52892)

Gyorgy: var wallet = tonConnectUI.account.address;   This one, I assume 🙂 (reply to 52892)

Gyorgy: But you need to wait for DOMContentLoaded or something to make sure window.TON_CONNECT_UI is ready.

Haq: Hey guys, can someone help with errors from smart contract.  How to decode the payload on the web side after I get some failed transaction?   Or How to decode failed transactions on Tonviewer ?  to understand more way transaction was failed.

Blockchain Dev: TON Connect UI is not initialized yet. (reply to 52897)

Blockchain Dev: let tonConnectUI; fetch('/assets/ton/tonconnect-ui.min.js').then(response => response.text()).then(script => {     eval(script);     tonConnectUI = new TON_CONNECT_UI.TonConnectUI({         manifestUrl: 'http://localhost/assets/ton/ton-manifest.json',         buttonRootId: 'ton-connect',     }); }).catch(error => console.error('Error loading tonconnect-ui.min.js:', error));

Gyorgy: Read after DOMContentLoaded, set some delays, or wait until tonConnectUI is loaded. Or use a mix of all three.   That’s not really related to TON; that's generic JavaScript. Once tonConnectUI is loaded (or however you're calling that variable—since you haven't shared any piece of code to provide better help), it will work.   You can test with a simple function too, like:   function sayHi() {     alert(tonConnectUI.account.address); }   and set it to an input button onclick="sayHi()" after the wallet connects loaded. (reply to 52903)

Gyorgy: Uh, you are really overcomplicating 🙂 (reply to 52904)

Blockchain Dev: good

Gyorgy: <head>     <!--  Ton Connect -->     <script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>     <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js"></script>   That’s all to call it.   then from your code copied:   var tonConnectUI = new TON_CONNECT_UI.TonConnectUI({         manifestUrl: 'http://localhost/assets/ton/ton-manifest.json',         buttonRootId: 'ton-connect',     });

Blockchain Dev: document.addEventListener("DOMContentLoaded", function() {     setTimeout(function() {         checkTonConnectUI();     }, 100); });  function checkTonConnectUI() {     if (typeof tonConnectUI !== 'undefined') {         var wallet = tonConnectUI.account.address;         alert(wallet);     } else {         setTimeout(checkTonConnectUI, 100);      } }

Blockchain Dev: :D

Blockchain Dev: 🥲🥲🥲

Blockchain Dev: it worked (reply to 52909)

Gyorgy: Can be async too:    async function connectToWallet() {                 const connectedWallet = await tonConnectUI.connectWallet();

Blockchain Dev: Is this address correct: 0:6c90c1ea6f18bcc45261cbe3ac6800bf08910b903cb107b81717343b3cd49837

Gyorgy: Raw address, you need to parse it.

Blockchain Dev: What else to analyze? I thought we could use it to distinguish wallet addresses.

Blockchain Dev: I want to save the wallet address for user identification.

Gyorgy: You can go ahead and save that. It’s a valid address.   You need to parse it to see the user-friendly address; it’s a raw address. You can copy/paste your raw address and view it in explorers; they support reading those as well. Probably use the search function on this channel; it must have been shared a couple of times how to parse.  (Update: e.g: https://t.me/tondev_eng/52433) (reply to 52918)

Blockchain Dev: Using raw addresses to identify users seems reasonable. It's like a public key. (reply to 52919)

Blockchain Dev: it's just that users won't be able to distinguish which is their address.

Gyorgy: That’s why you need to convert that to user-friendly with code. (reply to 52922)

Blockchain Dev: If you can show the same address as in the connected wallet, that would be great.

Blockchain Dev: So is there any way to convert it to javascript? 😍😍😍 (reply to 52924)

Blockchain Dev: Thank you everyone for your enthusiastic support.

Blockchain Dev: Hopefully TON will have quality products to contribute to the community. thanks

Gyorgy: It’s the same address, but raw format not user-friendly format. All on your code and libraries what you using to convert it.  Check for tonweb .js to convert it. On other hand, buttonRootId: 'ton-connect’, the div already showing the connected wallet for the end user. (reply to 52925)

Oscar: I just made a TON wallet using ton keeper and sent 1 TON from coinspot to it. It didn't show up in the wallet though.

Oscar: I looked at TONscan, and it said that the wallet was inactive

Gyorgy: Your wallet is "inactive" until you make your first transaction from it to initialize it. That's normal.

Yakitori: What happens if an error happens in the middle of a transaction, after a few "hops" between messages? Is the whole transaction reverted, or only the last message call?

Heydar: #Question   I have this code:  (slice, int, int, int, int, int, cell) load_data() {     slice ds = get_data().begin_parse();     return(         ds~load_msg_addr(), ;; owner_address         ds~load_uint(8),          ... }  now  in js I did saving the owneraddress for creating init config as slice, as Address, as Cell,  but Im getting 9 error exit code. what's the problem? how you debug these situations?

Heydar: Sorry what's meaning of hops? (reply to 52937)

Артур: Hello guys! Can you advice me an IPFS to store NFT assets?

Yakitori: "hops" in this context are cross-contract messages.  Say for instance I send jettons to a contract, in order to get something done in the contract e.g mint other jettons as part of a presale.   The later contract fails, because there are no jettons left to be sold.   Does the whole transaction reverts, or does only the presale contract part of the call? In this case, I wouldn't get my jettons back, right? (reply to 52939)

Grigory: Гетгеймс онли (reply to 52941)

Артур: thank you! can you provide a link, please? (reply to 52943)

Heydar: Sorry  ,Im noob,I just was interesting to learn that too.  but In my opinion Its dependent the implementation (in jetton it seems it will be back). maybe this help you too: https://docs.ton.org/img/interaction-schemes/ecosystem.svg (reply to 52942)

Yakitori: Ok! I'll look into it and dm you if I find the answer (reply to 52945)

Grigory: https://getgems.io/

Grigory: Гугл в помощь😁👋

Артур: oh no, im looking for IPFS storage (not NFT market) (reply to 52949)

Grigory: https://t.me/hackatonx

Grigory: Тут кто-то ответит, обязательно...✌️

Heydar: do we have timers in func? or any implementation in func, not typescript.

Heydar: shall I use this: https://github.com/ProgramCrafter/ton-stable-timer ? (reply to 52955)

— 2024-04-22 —

Panda: Hi ,how to detect if a contract  is deployed using tonweb?

Heydar: is that possible?!I dont think , because it's not between the client and rpc node.(just guessing) (reply to 52957)

Panda: Tonclient can do that well

kevin: Hi, how can I calculate next transaction hash if I know a out_msg of the previous transaction.

Heydar: I mean , tonclient is sending init code and the code so it dont send any extra data , and also because tonweb is doing that , may it adding some extra data to deploy, so we can detect that by that extra data, but I dont think it add something . however maybe Im thinking totaly different. (reply to 52960)

Gy: Oh thank you (reply to 52753)

Heydar: Im doing load_uint(32) in the func contract and in typescript using number type , now when I just change bit-length to 8 ->  load_uint(8) my tests failed, what's the problem? what type should I use in typescript for that length?

Yakitori: Is it possible to pull the bytecode of a contract deployed at a designated address from inside a contract?

Russia: I want to transfer one jetton from this address to that address. Can you help me the solution?

Looper: Hey, any documentation for python? or the recommended libraries

Boris: is get_balance a build-in get method, or just an internal function?

123xfs: index.esm.js:13 [TON_CONNECT_SDK] Bridge connection aborted  What is the problem with the abnormal connection of the mini program to the TG wallet on the phone and the normal TG on the client

123xfs: Using Components  <TonConnectButton className="my-button-class" />

ayushag: Can I expect some help? (reply to 52732)

Oscar: Hi All, I'm trying to create a new blockchain that's based on the TON blockchain source code.

Matthew: () receive_tokens (slice in_msg_body, slice sender_address, int my_ton_balance, int fwd_fee, int msg_value) impure {   ;; NOTE we can not allow fails in action phase since in that case there will be   ;; no bounce. Thus check and throw in computation phase.   (int balance, slice owner_address, slice jetton_master_address, cell jetton_wallet_code) = load_data();   int query_id = in_msg_body~load_uint(64);   int jetton_amount = in_msg_body~load_coins();   balance += jetton_amount;   slice from_address = in_msg_body~load_msg_addr();   slice response_address = in_msg_body~load_msg_addr();   throw_unless(707,       equal_slices(jetton_master_address, sender_address)       |       equal_slices(calculate_user_jetton_wallet_address(from_address, jetton_master_address, jetton_wallet_code), sender_address)   );   int forward_ton_amount = in_msg_body~load_coins();    int ton_balance_before_msg = my_ton_balance - msg_value;   int storage_fee = min_tons_for_storage() - min(ton_balance_before_msg, min_tons_for_storage());   msg_value -= (storage_fee + gas_consumption());   if(forward_ton_amount) {     msg_value -= (forward_ton_amount * 2 + fwd_fee);     slice either_forward_payload = in_msg_body;      var msg_body = begin_cell()         .store_uint(op::transfer_notification(), 32)         .store_uint(query_id, 64)         .store_coins(jetton_amount)         .store_slice(from_address)         .store_slice(either_forward_payload)         .end_cell();      var msg = begin_cell()       .store_uint(0x10, 6) ;; we should not bounce here cause receiver can have uninitialized contract       .store_slice(owner_address)       .store_coins(forward_ton_amount)       .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)       .store_ref(msg_body);      send_raw_message(msg.end_cell(), 1);      var master_msg_body = begin_cell()     .store_uint(op::transfer_notification(), 32)     .store_uint(query_id, 64)     .store_coins(jetton_amount)     .store_slice(from_address)     .store_slice(either_forward_payload)     .end_cell();      var master_msg = begin_cell()       .store_uint(0x18, 6)       .store_slice(owner_address)       .store_coins(forward_ton_amount)       .store_uint(2, 1 + 4 + 4 + 64 + 32 + 1 + 1)       .store_ref(master_msg_body);      send_raw_message(master_msg.end_cell(), 1);   }    if ((response_address.preload_uint(2) != 0) & (msg_value > 0)) {     var msg = begin_cell()       .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 010000       .store_slice(response_address)       .store_coins(msg_value)       .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)       .store_uint(op::excesses(), 32)       .store_uint(query_id, 64);     send_raw_message(msg.end_cell(), 2);   }    save_data(balance, owner_address, jetton_master_address, jetton_wallet_code); }  hi all, this is code of jetton wallet contract, i want jetton noti 2 times to owner address but i receive tvm exit code 0. can anyone review help me.

Oscar: Does anyone have any ideas? (reply to 52998)

Oscar: Please help 🙂

Nyxra: You're awesome man, thanks for the help (reply to 52837)

&rey: Your flags have drifted between msg and master_msg, from 1 to 2. (reply to 53001)

Matthew: ok thank, i fixed (reply to 53005)

Behrang: JavaScript numbers can store integer values up to 2^53. If you want to work with integers bigger than 53 bits, you have to use something else, like BigInt. (reply to 52890)

Behrang: Your chain of messages will break. You have to handle it if you want to create a good smart contract.  - Either check for all the conditions at the start of transaction chain,  - Or throw (or send back a message) to rollback the changes in earlier contracts. (reply to 52937)

&rey: Message chains are not grouped in one transaction at all. (reply to 52937)

Behrang: From inside itself you can with my_code().   For other contracts, you may send a message to them asking for their code, and they have to implement the message handler. (reply to 52967)

&rey: Onchain or offchain? (reply to 52967)

Behrang: https://github.com/hipofinance/contract (reply to 52732)

Meloo: Hi gays. How can i burn my tokens if i cant send them on empty adress?

&rey: Most tokens have native burn function. How to invoke it from user's perspective... well, that's harder. (reply to 53015)

Slava: Thanks. Are you planning to update canonical SMCs like this one to use new instructions? (reply to 50741)

Heydar: Thanks ❤️ , how about my last quest: https://t.me/tondev_eng/52964 (reply to 53007)

Heydar: do we have any doc that show the table of corresponding types between js and func?

&rey: The problem is in your tests. (reply to 52964)

&rey: Or perhaps you didn't update contract in all places.

Heydar: ok I will double check and I will try minimize my problem and coming back soon :D (reply to 53024)

Tahmores: Hi

okolo: Hi All! i'm backend dev, python, i have experience working with telegram bots with TON transactions. I wanna to start working with dApps with smartcontracts on Tact. Question: do dApps have to be written in JS/TS, or is there a way to use python?

Eric: https://docs.ton.org/develop/dapps/apis/sdk#python? 🙂 (reply to 53032)

&rey: dApps are executed on client side (as they don't have backend). You can totally use Brython (browser-based Python) for that! (reply to 53032)

okolo: wow, great idea! thanks (reply to 53039)

Russia: I want to transfer one jetton from this address to that address. Can you help me the solution? @pcrafter

&rey: docs.ton.org — TON Cookbook has a good tutorial. (reply to 53042)

Russia: I use tonweb, but it is effective (reply to 53043)

Sumit: why doesnt the wrappers generated by blueprint dont return signed boc from the function

Sumit: i want to use it to get the transaction hash

User<7195257024>: Ready developer for any complexity of work. web3, smart-contract , scripts of any complexity. I will respond to any task.

Deny: Hello, Sometimes I send 2 or more transaction, but there are a missing transaction, I assume transaction replaced with same seqno. Any idea for handle this? Thanks

Behrang: - Read current seqno - Send first transaction - Wait until the last read seqno changes - Send your second transaction (reply to 53055)

Deny: Is it possible if I increment manually every send transaction ? (reply to 53057)

Behrang: No, since the current seqno is not increased and if you manually increase it, it will not match the current seqno. With normal wallets, you have to wait for the change. Unless you use a highload wallet. (reply to 53058)

Deny: Oh I see, thank you for explanation very helpfull (reply to 53059)

kevin: Any toncenter.com developer here? I want know how a message hash was calculated?

MA: Hello guys  I am building a lottery application that choose one user as a winner in all participants. Something like Yolo Games  spin. The participants of the current live round will be unlimited. So as the ton storage best practice it should deploy a contract for each user something like jetton_wallet and jetton_master.   When the live round ends, master contract will generate a random number to choose between participants. Now in the ton storage structure how can I find out which user is the winner?  Data of each user stored in their own contract such as user chance, address and etc. and the master contract only now the total chance and total participants.   For example this is the sample storage on Master contract: total_chance : 5000 total _participants: 2  User 1 wallet contract: user_address: <some_address> chance : 3000  User 2 wallet contract: user_address: <some_address> chance : 2000  now in the master contract if the random number would 2800, the first user is the winner. But my question is how the master wallet can find out which user is winner and what is the optimum way to implement this functionality?

Heydar: https://github.com/twa-dev/types is exist in https://github.com/twa-dev/SDK? I mean, what's the difference?

Vladislav: Some developers don't need the SDK, but Telegram SDK types only.  But yeah, you could still just install SDK and use types from it (reply to 53064)

Heydar: Thanks sir (reply to 53065)

Heydar: I want to make my webapp seems like telegram themes and etc ... is that possible to do that with sdk, everything that I need is exist there? because I saw another library too (Mark42) (reply to 53065)

Vladislav: Probably. I am not using Telegram SDK. There is an alternative:  — https://github.com/Telegram-Mini-Apps/tma.js — https://docs.telegram-mini-apps.com/packages/tma-js-sdk (reply to 53067)

Heydar: so in this library(tma sdk) you have all things to do that? (reply to 53068)

Heydar: oops , this repo is recently updated and also it has more activity , so I should use that too (I think) thanks ❤️ (reply to 53068)

Mikko: Are there any examples of Merkle tree drops on Ton?

Mikko: Any reason why it should/should not be technically feasible?

Fereshte: Does ton have derivation path?

Mikko: or any kind of account abstraction to pay gas fees for airdropped users somehow?

&rey: Yes, for some wallets that are not actually used. (reply to 53073)

&rey: github.com/Gusarich/airdrop (reply to 53071)

Mikko: Ser, you are a legend (reply to 53076)

даня: how can i importe v3r2 imewallet to ton keeper?

Frank: What is the best indexer provider atm?

Thang: Do you have example about TON upgradeable smart contract? (reply to 53076)

Speculator: how can I get list all jetton wallet of an address without call to each jetton master.

Ceren: I am asking just for educational purpose: Would connecting a TON wallet to a malicious site allow malicious actors to withdraw funds from my wallet without my consent? This happens often with EVM wallets like metamask, but I don't know what the situation is with TON.

&rey: No, if TON Connect 2 is used. It requires confirmation for each set of transfers. (reply to 53086)

Speculator: how can I get list all jetton wallet of an address without call to each jetton master

&rey: Of course you shouldn't give mnemonic to other actors. (reply to 53086)

Ceren: TON Connect 2? Is this different from TON Connect? (reply to 53087)

TON Bounty Bridge: 📊 Update Digest!  🔍 Active bounties: 56 ✅ Approved bounties: 5 🔄 Bounties seeking suggestions: 31  📣 We value your feedback! Join the community discussion and participate in shaping the future. Click the 'Create Your Own Bounty' button to get started.  Happy contributing!

&rey: I haven't seen TC1 for a long time, and haven't seen its docs so don't know if it is secure as well. (reply to 53090)

&rey: Sites use TC2 now.

Ceren: Thank you (reply to 53094)

Mikko: No (reply to 53086)

Pop: why was my message deleted?

&rey: Using @wallet always is ill-considered; it does not have certain crucial features, like decentralized access or storing your balances in blockchain. (reply to 53097)

&rey: I'd say there are more than one official wallets.

Mikko: TON Spaces inside wallet does this, though, right? (reply to 53098)

Pop: no no I mean something like tonkeeper

Speculator: how can I get list all jetton wallet of an address without call to each jetton master

Pop: in fact if web3 apps want to get your private key or mnemonic, it is malicious

&rey: Yes, modulo you will be unable to open it if @wallet is unavailable. (reply to 53100)

Mikko: Same here. I have no idea. There is some unspeakable reason not to speak about @wallet here? (reply to 53097)

Pop: @wallet is centralized, so it is not recommended (reply to 53110)

Mikko: That's very understood. However TON Spaces offers Ton Connect like any other wallet, and it is likely the first wallet any Telegram users will use to interact with Ton ecosystem. Thus, it is very important to know how it compares to other wallets and what are the situations when it can be recommended for the users. (reply to 53111)

MA: Can anybody help me with this issue? (reply to 53062)

&rey: You have to combine contracts into tree-like structure. Consider treap (Decart tree), R/B tree and B-tree. (reply to 53062)

Yakitori: Onchain - I'm coming from solidity where you can pull bytecode from an address if you need. I wanted to get it to verify that the received token was indeed the right one, by computing the wallet address using the contract init state. (reply to 53012)

Yakitori: Since wallet contracts can differ, it's not so simple to do it.

MA: So you mean I should store all data in one cotract but for better efficiency use tree structure to store data in storage? (reply to 53116)

Yakitori: Hoho hello Mikko, nice to see you here! are you developing on TON too? (reply to 53113)

&rey: @miohtama and @popmoore are muted for meta-discussion of moderation decision, which is that choice of exact wallet from ton.org/wallets is not topic for this chat.

&rey: You usually embed the code of jetton wallets you want to process. (reply to 53118)

Yakitori: As you wish, however @miohtama is a top 0.1% Stack overflow dev, if I may vouch for him, he's a real wealth of knowledge and very helpful (reply to 53122)

Yakitori: I understand, however what happens if I want to whitelist jettons on the fly, or if the code isn't available? I understand that there are workarounds, just asking theoretically (reply to 53123)

musashi: hey guys, how can I convert .t.me domain to Ton address on mainnet?

musashi: @pcrafter any advice sir

musashi: I tried dns.ton.org but seems like they don't support this type of domain

Dario: If you want to be sure the sender is the correct jetton wallet, you can store jetton minter and then call take jetton wallet address on minter (reply to 53125)

Dario: So, you don't have to store jetton wallet code / init state in another contract

Yakitori: Thanks! I actually went to see your StonFi contracts to figure this out (reply to 53131)

Dario: We don't have whitelist or anything: contract receives jetton notification and forward to correct pool (reply to 53132)

Dario: Based on payload

Dario: We assume all sender are valid jetton wallet contracts

Yakitori: My question was more regarding when you had an exotic jetton wallet (reply to 53135)

Yakitori: So the initState would be different than what you would have with a standard jetton

Dario: We dont need to know anything about the jetton itself

Dario: Transfer and jetton notification are part of standard, as long they are implemented properly, swaps will work

Yakitori: How can you know the master contract from the payload? (reply to 53138)

Dario: In fact, pton proxy is a custom contract that only implements these two methods, and works fine with the dec

Dario: We dont need it (reply to 53141)

Dario: A pair is made by jetton wallets, not jetton master

Yakitori: How do you identify which jetton it is? (reply to 53143)

Dario: By jetton wallets

Yakitori: But you compute the jetton wallet from the master address + the contract code (if I understand) to check if the jetton is the desired one?

Yakitori: Say I have a staking contract that accepts only one jetton

Dario: No, we dont check anything

Dario: The router (main receiver) is stateless, doesn't know anything about sender or anything about pairs themselves

Dario: Okay, in such case, you can either store jetton wallet address (AFTER contract deployment) or request it onchain to jetton minter (this time, minter address can be stored in stateinit at deployment time) (reply to 53148)

Yakitori: Ok, thanks (reply to 53153)

wikig: Hello guys , i send out a transaction of USDT using @wallet   https://tonviewer.com/transaction/74ae3367aa9215caa5dbb12a45deba762a0f83133bf92134e47ca365961501ca  And i notice that i paid for 0.05 TON and 0.047 TON go to an address not belong to be and not belong to the address i send      https://tonviewer.com/EQBugU5kUOjFeAZ7tlYpj7TQE5fdFQGNfzTcNp6rpMIRHLwm

wikig: And i wonder what this address is , and why will it cost 0.047 TON to send to this address (reply to 53156)

Gyorgy: Most of transactions take 0.05 or 0.1 Ton depends on contract, then you get back the rest above network fee. 0.025-0.04 is common network fee. (reply to 53157)

wikig: Okay , so the logic is :  I send out TON as gas fee into contract . and when it done , it will send me back , right  ?  But according to the txn it shows , this transaction finally send those TON into a 3th part address ,which not returned . (reply to 53158)

&rey: It may send remaining money anywhere depending on contract logic. (reply to 53159)

wikig: And i am not sure what this contract is ,  due to it have no any .... well , contract type   https://tonviewer.com/EQBugU5kUOjFeAZ7tlYpj7TQE5fdFQGNfzTcNp6rpMIRHLwm (reply to 53159)

Gleb: Hello 👋🏼  I'm looking for a cool community manager to promote, develop, and build a strategy around the TON Hunt project.

&rey: It is highload. Probably vault for @wallet's outgoing messages. (reply to 53161)

wikig: Yes , iknow that  , but i do send usdt by using inside the @wallet which saids   send to your contacts (reply to 53160)

Gyorgy: If you send to your contact, it’s within Telegram. Not necessarily need blockchain transaction.

&rey: Have you paid the fee from your TON balance? (reply to 53164)

wikig: Possible . But why will it final to this address  ? Is that @wallet require to take some part of txn fee when i send out USDT ? (reply to 53163)

Gyorgy: It’s in a common wallet, you can send between contacts for free. Once withdrawed they moving those from the common wallet, like an exchange for my understanding.

wikig: That's what i think so , but when i trace the transactions onchain . i found it do have a txn here , and that's wired .... (reply to 53165)

wikig: I am not sure , i check the transactions for this reason .   I do notice the end-balance do reduce (reply to 53166)

Gyorgy: That’s common in practice to move to shared wallet.  Custodial Wallets works that way.  They holdig the key, you deposit. That’s how it can be free transfer as not necessarily need blockchain transaction.  Non-Custodial Wallets (Telegram Wallet Spaces) the key with yours, it’s your wallet.  All fine there.

&rey: Is the source wallet yours? (reply to 53171)

&rey: If not, that's @wallet's balance as well, so they just moved a fraction of TON.

wikig: I think so , from @wallet , which i think should be a shared wallet . (reply to 53174)

wikig: Okay , sounds similar to logic of  abstruct-account .  If what i understand right , it should be sth like gasless service right  ? (reply to 53173)

wikig: And which i think should not change the End balance of the source wallet (? (reply to 53177)

wikig: Yes , that's how i used to think so .   I do check my transactions to find out if it works like that . But i found that the End balance do change when this transaction happened . So that confuse me , i don't know if this action do cost TON as gas (which should not i think ) (reply to 53169)

Gyorgy: If you're using Custodial Wallets, it doesn’t really matter much what happens on-chain. They manage the fees and the internal transfers, while you, the end user, are there to enjoy a painless experience.   If you're using Telegram Spaces, where you have your keys, fees, and everything works as usual, the wallet is designed to be user-friendly, allowing for free transfers between your contacts. So, it should be all good there. Not really worth checking the blockchain; it works in your favor.

Bear: hi, in FunC, true = -1?

Bear: Let's say we want to check if any event is relevant. To do this, we use the flag variable. Remember that in FunC true is -1 and false is 0.  URL: https://docs.ton.org/develop/func/cookbook#how-to-write-an-if-statement (reply to 53181)

Gyorgy: If you just want true it’s a simple boolean. Not really need hard-code -1 but you can echo the flag to verify.    if (flag) {      ;; do something } else {     ;; reject the transaction }  But you can write simple test with  int flag = 0;  and int flag = -1;   to see what and when triggered. (reply to 53182)

wikig: Okay , thanks !  I do think i currently using Custodial wallet of @wallet provide . And i just wants to know what happened when i click the transfer to contact  Which they claim free .   So , if i  don't have any TON in my balance , will the transaction still happen ? I just , got confuse ... (reply to 53180)

yakuza: Heh i need a simple and fast tutorial for the func lang, yall guys can you suggest some ?

Gyorgy: It will, once you deposited, it belongs to main wallet. Not really need to move anything on-chain.  (That doesn't mean it will not move; it's moved internally when necessary and between main wallets as well) (reply to 53185)

Gyorgy: Maybe FunC Cookbook is a good way to start. Link is just above your message by 2. (reply to 53186)

wikig: Yes , it not really need to move anything on-chain . I do agree with this , and that's the reason why i trace it on explorer to find out if it do nothing onchain .   Still , i found a transaction takes my TON and change the TON balance ......well , that's wired because i do also think it should no need to be on-chain for Custodial wallet .... (reply to 53187)

Gyorgy: For Ton transfers there are non. Tested before. For Jettons maybe there are some, or being worked on as its new feature. Time will tell.  But there’s no free transfer for external wallets. Keep in mind. If you using telegram username contact, it’s free. If you withdraw it will cost fees always. (reply to 53190)

Partner: Hi! Did you know about the SDK of EVAA FunC-native #1 Lending and Borrowing Protocol on TON with the new USDt integration?

wikig: Okay . i just , interest in it . Currently we are working on gasless service developing , so we send some USDT using @wallet to check how it works .....   Thanks a lot. (reply to 53191)

Partner: 1) We have the SDK LIVE and you can start building DeFi TON 2.0 telegram mini-apps on top of the base protocols.  Make an EVAA-based project as part of the Open League hackathon with a prize pool of 2 million. We will support your EVAA SDK-based project and promote any integration! If you need teammates, DM us and we will add you to the EVAA Builders Chat.  There will also be a lot of ecosystem support for projects that will use the USDt lend & borrow EVAA SDK,like multi-protocol telegram mini apps with lend - borrow - stake - swap - repet with USDt - and then try to get an ecosystem grant for your Telegram mini app with our support.  2) Try running your own open source EVAA liquidation bot and join the army of liquidatiors. (reply to 53194)

Gyorgy: Well, then you not sent to your contact in telegram, but sent external wallet. It will always cost fees. Only free if you send to contact (to telegram username) not to wallets. (reply to 53196)

wikig: Well , we do use sent to your contact , Because we wants to know how the sent to your contact work with no fee to pay .   And we just test again to use another account which have no TON balance to send the  usdt .... we notice the @wallet saids i recive the usdt , but  unable to find the transaction on-chain ........   I think they might have some ... check ?  for the sender's balance ? i am not sure , and i don't even know which account/address own the usdt jetton now ... (reply to 53198)

Gyorgy: 'Contact' means a Telegram username, not a wallet of the contact.  If you transfer internally to a username, it's instant, at least with TON. I'm not sure about USDT.   In short, the idea is to select a friend from your contact list and not enter their wallet for free transfers. If you enter a wallet, it must cost something.  (Update: Check TON Community channel, new news on that) (reply to 53201)

Fereshte: We have a wallet that supports multiple networks..now we want to add ton, our mnemonic generation is like trust wallet..is it possible to generate addresses like ton trust wallet with libraries like ton-kotlin? (reply to 53075)

Richard Lane: Anyone here from TON?

Nikolay Kovalkov: what do you mean (reply to 53210)

Richard Lane: Thinking that Telegram should have it's own digital currency exchange -

Richard Lane: for free

Richard Lane: Free currency exchange works well with free payments and free remittances

Richard Lane: ... who is available to speak to about this - we have an exchange that scales to > 100M TPS currently live in production - would like to gift that to your eco-system

&rey: You can generate address, yes. From public key.  If you use Trust Wallet's algorithms, please make sure you clearly describe that in docs, because TON standard differs. (reply to 53203)

Санёк: ? (reply to 53216)

&rey: The Open League, I'd guess. (reply to 53215)

Richard Lane: not sure who that is but the only thing missing from your eco-system is a free digital currency exchange (reply to 53218)

Fereshte: how exactly? Should I get the public key from ton-kotlin? and then set the trust wallet derivation path to it? (reply to 53216)

Richard Lane: ... that scales to exceed the global FX footprint -   that would be us

&rey: What? The reverse, if you have mnemonic. (reply to 53221)

Jon: gmgm, hope this is the right place to post this - but we’re looking to hire a developer to build an POC Ton miniapp for us. This will be a paid gig, with the potential to convert to a full time role with our company down the road. Please kindly dm me your experience with building ton miniapps to be considered. Ty sers 🫡

Nikolay Kovalkov: I'm waiting to hear from you. (reply to 53224)

Jon: just sent u a msg

Oliver: Hi,   Our project needs a web developer who has experience working with TON domains.   Please send me a DM

wikig: Use tweetnacl to generate kp . Similar to solana (reply to 53203)

Bear: wondering why people still using the .store(0, 1) rather than .storeBool in most of code (reply to 53184)

Alex: hello guys, what could be the issue ?  Connected to wallet at address:  EQC-2_4kglkWzoqt3VFPdvUXdXgKr3YhRx8zWdyC8i-XsKWq contract address: EQDkxvu7b9Ecm0gWq1NI8uPoWPrjU585aacIy8QhpK_SvEOm wallet is not deployed

Alex: i checked my tonkeeper version and its 4.2 as it should be in my contract

&rey: Do you have TON so that contract can be deployed?

Alex: yeah, 3$ shopuld be enough for tutorial contract

Ken: you need the cell structure to decode it (reply to 53246)

Ken: 你腦子有病吧，是你要解析又不是我要解析

Alex: do you have any other thoughts on what is causing the problem ? (reply to 53242)

Ken: 你的問題不清楚，我想回答也回答不了哈 (reply to 53251)

Oliver: Please can someone refer me to a working Ton Jettons multisender for sending tokens ton multiple wallets in one transaction?

Roman: Hello everybody. Tell me if I understand correctly. I can register my coin in TON and then I can hook up the API in node-red for transactions e.g.

Sunny: Let me know please if you figure it out.. (reply to 53258)

Oliver: Still finding.   Found OneClickSender but it doesn't proceed after it gets to confirm page and it also doesn't support TonKeeper (reply to 53261)

Sunny: Although i have just started looking into transaction but this is also one of the requirements that i will have to do

&rey: @opkedaya please use English in this chat. There are separate chats for Chinese: @toncoin_cn_chat.

&rey: How many destinations? (reply to 53258)

&rey: I don't believe there is an UI tool for that.

L (😇,🪽): hey bro can u check your dm pls (reply to 53271)

User<5018886941>: Hello

Silver: Hello guys. Does anyone have example code how to make swap on DeDust Go language?

Andrei: Hello everyone  What TON sdk I can use to implement USDT TON blockhain Integration to my payment system?   Please suggest either python or ts sdk's

Pixel: Who needs a senior frontend and smart contract engineer?

Daniel: If you can develop a play to earn game on the TON blockchain, kindly DM.

Mithra: What is the correct native USDT contract on TON?

&rey: See it on tether.to. (reply to 53297)

Buggy: is it possible to put liquidity with TON/USDT pair now? (reply to 53299)

SSLCertificates: Yes, lots of LP provided already (reply to 53308)

trungnotchung: I'm planning to modify the Jetton-minter smart contract. How can I ensure it remains recognized as a Jetton contract on TON Viewer after the changes?

Buggy: where can i do that? (reply to 53309)

User<6821103918>: Any founder here?

123: anyone has any examples on how to send jettons through ton-connect sdk?

K.: https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer  Switch to @tonconnect/sdk (reply to 53320)

123: yeah, i saw that, but im afraid i cant use @ton/ton on browser, so i tried using tonweb's cell creation, but no success

K.: Why can't you use @ton/ton? IIRC you need to configure polyfills and it should be fine. (reply to 53322)

Santosh | Wagmi11: gm fam, how do toggle to testnet in tonkeeper in the new update?

Santosh | Wagmi11: i dont see the network toggle button anyone after new update.

K.: Enable DEV mode and create a new wallet. (reply to 53324)

Santosh | Wagmi11: ty resolved.  1. enabled dev mode 2. Added new wallet for testnet. (reply to 53326)

princekamil: Hello I’m looking for a legit dev 💎 contact me prive! It would be nice to have someone based in Poland to have a meeting 📅

princekamil: Hello is it a good place to find a TON developer? 💎 Bot developing with the NFT utilities.   We can discuss all the details priv. 🤝🏻💵

0o: Does assigning a cell type to a variable copy a reference of the cell to the variable? Or does it copy the whole value of the cell type to the variable?

&rey: Reference whole. At least since cells cannot be read from until they are converted to slices. (reply to 53344)

&rey: You need to use load methods explicitly.

&rey: That's one of TON features, actually: code explicitly stating what will happen. Where messages with TON will be sent, who can change NFT content, etc.

&rey: (Compare with Ethereum, where it's unclear what a called contract will do, and functions have not-very-visible modifiers) (reply to 53347)

Амир: Can someone explain following code: int forward_ton_amount = in_msg_body~load_coins(); int fwd_count = forward_ton_amount ? 2 : 1;

Zeptimus: Hello devs, i used the bridge and my funds are not coming (i did this this morning) i cant send a picture yet

User<5606745514>: How can I get only trend transactions for token address in TON network? I am using node. It is paid project.

Zeptimus: why i cant share links?

&rey: Please message @ton_help_bot for problems with bridge. (reply to 53360)

&rey: I assume the link must have some description.  Your failed tx is at https://tonviewer.com/EQA-ypik3Knp5-K54n7nephfS-XVq6RHPuukH1A6iWsiOVTd, right? (reply to 53363)

Zeptimus: yes thats my transaction

Zeptimus: did i fucked it up or is solveable?

&rey: That's Bridge problems, I think.

Zeptimus: does it mean i have to wait and funds will come to my wallet?

&rey: . (reply to 53368)

Zeptimus: gotcha thanks buddy

Michael: Can't DM you. Please add me as a contact (reply to 53341)

User<6331219307>: 'TonLib' object has no attribute '_tonlib_json_client_destroy'   I installed the "TonTools" library, I get this after calling await client.init_tonlib()

//Kalos: Bro please can help me ?i need telegram id support (reply to 53374)

Panda: Hi all. I’m new to developing on TON or telegram in general. Dumb Q: if I’m building a bot that interacts with ton, do I need to first learn how to build a standard telegram bot (telegram dev docs), and then learn w ton docs to integrate with TON services?    Or will I learn all of it, if I start with ton dev docs.

Blockchain Dev: It turns out that ton allows sending money via raw address in the form of 0:5334abf1490c1daa0a936f8ed06527e54b4d29f96e2

Blockchain Dev: Is there a way to convert this raw form to the correct wallet address form? in javascript

Амир: Address.parse(raw) I guess (reply to 53400)

Blockchain Dev: document.addEventListener("DOMContentLoaded", function() {     checkTonConnectUI();     setInterval(checkTonConnectUI, 3000); });  function checkTonConnectUI() {     if (typeof tonConnectUI !== 'undefined') {         var wallet = tonConnectUI.account.address;         document.getElementById("tonAddress").textContent = wallet;     } else {         setTimeout(checkTonConnectUI, 100);     } } (reply to 53401)

Blockchain Dev: I did that to get the raw address back.

Амир: Is this pure js? (reply to 53402)

Blockchain Dev: Can someone fix it? Instead of the raw form, we output the correct address

Blockchain Dev: That's right. I use pure js (reply to 53404)

Амир: So u dont have acces to Address object? (reply to 53405)

Blockchain Dev: yes

Blockchain Dev: let tonConnectUI; fetch('/assets/ton/tonconnect-ui.min.js').then(response => response.text()).then(script => {     eval(script);     tonConnectUI = new TON_CONNECT_UI.TonConnectUI({         manifestUrl: 'http://localhost/assets/ton/ton-manifest.json',         buttonRootId: 'ton-connect',     }); }).catch(error => console.error('Error loading tonconnect-ui.min.js:', error));

Blockchain Dev: It's still a connection to tonsconnect.js

Blockchain Dev: web3 for metamask they can simply show the correct wallet address

Boris: why not just a script tag? <script src=„/assets/ton/tonconnect-ui.min.js“

Blockchain Dev: the way I did it also made the connection to tonconnect and performed the functions perfectly and I was looking for a way to display the wallet address

Boris: well, you need to parse it

Амир: Well I tried to find easy and beautiful solution, however I could not (reply to 53414)

— 2024-04-23 —

Blockchain Dev: try to change tonsConnectUI.account.address

Blockchain Dev: It can be said that this is TON's Publickey: 0:5334abf1490c106a9a97f8ed06527e54b4d29f96e2

Boris: no no, its not the public key, its the hash of the address the 0: is the workchain. You should check out the Address class from ton/core I guess, there is the conversion happening, if you don’t want to load the whole lib. (reply to 53418)

Амир: It is said in the docs that u can covert ur (raw) address to user friendly one just by encoding it using either base64 or base64url (reply to 53418)

Амир: But i haven't succeed with that

Boris: tricky ton=)

Blockchain Dev: Is there any way to receive successful sending results from ton wallet after sending a successful transaction?

Blockchain Dev: async function transaction() {     if (!tonConnectUI) {         console.error('TON Connect UI is not initialized yet.');         return;     }     const amount = document.getElementById('amount').value;     const transaction = {         validUntil: Math.floor(Date.now() / 1e3) + 600,         messages: [{             address: "",             amount: amount * 1000000000         }]     };     try {         await tonConnectUI.sendTransaction(transaction);     } catch (e) {         console.log(e);     } }

Blockchain Dev: I want to record the history, and notify that the transaction was successful.

Boris: I would look into the result of this: await tonConnectUI.sendTransaction(transaction); (reply to 53426)

Blockchain Dev: How?

Blockchain Dev: console.log("Transaction successful:", result);???

Blockchain Dev: Is it accurate???

Boris: yeah, why not, what does console.log print?

Blockchain Dev: web3 metamask i also have to use get notification result from metamask for successful transaction. then confirm that it is a valid transaction.

Blockchain Dev: we need hash or tx to check it. (reply to 53434)

Boris: what are you building a bridge?

Blockchain Dev: i am building user trading activity on my system.

Blockchain Dev: When users use my service, they have to pay a fee. I want to find a way to check if the transaction is valid so I can confirm it.

Boris: Well, I am doing something similar, for this I let the user deploy an order, store there the fee, its then activated, and then I run it. (reply to 53439)

Blockchain Dev: yes how can I verify. (reply to 53440)

Boris: what verify?

Blockchain Dev: after successful transaction await tonConnectUI.sendTransaction(transaction); need something to view trading results.

Blockchain Dev: successful transaction. (reply to 53442)

Boris: this? (reply to 53432)

Blockchain Dev: console.log("Transaction successful:", result);?

Boris: try it..

Blockchain Dev: Is it sure the transaction was successfully sent.

Blockchain Dev: I'm afraid it will fail during sending.

Boris: Idk, must be in the docs of tonConnect I guess

Boris: What are you afraid of, we will all die anyway 😅️️️️️️ (reply to 53449)

Blockchain Dev: Transaction successful: {boc: 'te6cckEBAgEAqQAB4YgA+yKcnwQCs1xAwIEKKB4DvkIdXNjL6B…T9O/zMyXaWgCkj71lgxzEtAAAAAAAAAAAAAAAAAAAec1bKA=='}

Blockchain Dev: This is just a sent notification. As for whether the transaction is successful or not, we don't yet have it.

Boris: maybe you should provide a get method

Boris: to be very sure

Blockchain Dev: 😮‍💨

Blockchain Dev: Do you understand? That means when the payment is successful, there will be such a notification. not a notification that payment has been sent.

Blockchain Dev: https://cdn.jsdelivr.net/npm/tonrocket-api-sdk@1.2.0/index.min.js

Gyorgy: Verify from the blockchain always. Load back transactions with tonapi or toncenter (these apis easy to use), or with rpc. (reply to 53453)

Gyorgy: Should be some backend for your application to verify. Once callback successful you can process it. Thats the most solid method and most secure.

Blockchain Dev: is this https://unpkg.com/tonweb@0.0.41/dist/tonweb.js

Blockchain Dev: <script src="https://unpkg.com/tonweb@0.0.41/dist/tonweb.js"></script> <script>     window.onload = async () => {         window.connector = new TonConnectSDK.TonConnect({             manifestUrl: 'http://localhost/assets/ton/ton-manifest.json'         });         connector.restoreConnection();     } </script>

Gyorgy: tonweb for what? tonapi and toncenter are APIs.

Gyorgy: look their website, check your transaction on the blockchain if successful on your backend and send response code to your frontend.

Blockchain Dev: 1: show the logged in user's wallet 2: I want to check the transaction results, after sending successfully. (reply to 53465)

Blockchain Dev: try {         const result = await tonConnectUI.sendTransaction(transaction);         console.log("Transaction successful:", result.boc);     }

Blockchain Dev: I finally found a way to convert raw: curl -X 'GET'\    'https://toncenter.com/api/v2/detectAddress?address=raw' \    -H 'accept: application/json'

Blockchain Dev: 🥱🥱🥱

perfogic: Hello everyone Do anyone have env of ton-trustless-bridge-relayer ? I really want to take a look on bridge to create relayer from ton to other chain

perfogic: @tsivarev can you share it ^ ^

Behrang: This is a little tricky.  In jetton standard implementation, it checks whether it need to send a notification message or not. If it's needed to send a notification, another forward fee must be paid.  So, in short, if there is no need for a forward notification, then only a message with receive_tokens operation will be sent and 1 fwd_fee will be needed, hence fwd_count is set to 1.  If a notification is needed, after receive_tokens, another message with transfer_notification opcode must be sent, so in total 2 fwd_fee is needed, hence fwd_count is set to 2. (reply to 53354)

AA: Comrades) How to show the comment of a wallet transaction   Java script request what ?  for example on  1 wallet comment balance

Hellmut88: Hi is here anyone from ton team?

Bobby: https://github.com/tonkeeper/opentonapi/pull/302  I'm getting a lot of errors because tonapi.io API is rate-limited, the whole point of running opentonapi is to use my own node & lite server, I don't understand why this change is necessary.  2024-04-08 13:00:36 {"time":"2024-04-08T06:00:36.334764054Z","level":"ERROR","prefix":"-","file":"market.go","line":"122","message":"[sendRequest] bad status code: 429, https://tonapi.io/v2/jettons/0:54bf44ac61bfc7a535fe5dd3a0149c1b99dda284c7115e75b52a99819850beb6"}

Bobby: This merge doesnot make sense

Tân: Hi guys, im newbe

Tân: Can anyone help me, how to decode body data in transaction?

Tân: I research google to much but not found any information :(

&rey: That's BOC — tree of cells. Format of inner data is defined by smart contract. (reply to 53498)

Jeff: jeff bro

&rey: Thus, it is not REST: transaction (message) body can't be decoded only on itself. (reply to 53503)

Tân: Can you send me some document to for it, thank you so much, If there is an example that would be great. (reply to 53503)

Matthew: hi all, i have jetton master and jetton wallet, i want to create cell from master for jetton wallet be able read it and handle logic? it is feasible?

Louis: I have an array of objs in the backend like this:  [{ address: "UQDH....", amount: 1000}, { address: '"UQBV....", amount: 2000}],  how to push it up and save it in the contract as map<Addres, Int>?

Louis: Can someone help me?

yuanx: Will there be notification of completion of TMA audit?

yuanx: I made a TMA, but it's wating for review as long time.

Partner: Hi there!  The TON and Waves ecosystem teams are hosting a community stream on DeFi Lending today (16 CET). Don’t miss out on understanding how it all works!  Catch the AMA session here: https://t.me/evaaprotocol/264.  See you soon!

Santosh | Wagmi11: anyone working on bridges?

Иван: Здесь есть кто кто нибудь, кто мог бы помочь сделать легенькое приложение ( майнинг кран ) для телеграмма на добровольных началах для совместного проекта ?  напишите в личку    Is there anyone here who could help make a lightweight application (mining crane) for telegram on a voluntary basis for a joint project? write to your personal account

Codex: hi, can anyone get me in touch with the https://tonscan.org/ owners?

MA: Hi is there any tutorial or example for storing tree structure in storage ?

wikig: Hello guys .

wikig: I try using tonconnect-ui . and i meet this issue here .

wikig: i print tonConnectUI.modalState , it shows json {     "status": "closed",     "closeReason": null }  , Which i think can be considerate as unconnected.  But when i try tonConnectUI.openModal(); . it still tolds me that connection already there , and require me to disconnect . (reply to 53547)

MJ: Hello guys 👋🏻

wikig: Later , when i try add a limit check :            if(state && (state.status != 'closed' || state.closeReason == 'wallet-selected' || !state.closeReason))           {             console.log("Disconnect for connection reload")               await tonConnectUI.disconnect();           }   It tolds me that Send transaction or other protocol methods called while wallet is not connected. (reply to 53548)

wikig: So , how can i know the state of the tonconnectUI , connected or not ? (reply to 53552)

MJ: Hey guys, I'm working on setting up validation for the Ton blockchain using a regular expression. I'm currently using this one: ^(0|-1):([a-f0-9]{64}|[A-F0-9]{64})$, but I want to ensure it covers all cases.

User<6821103918>: You're a founder? (reply to 53341)

<You>: hello. can i use cookie or local storage in mini apps?

wikig: Yes, it's totally H5 . it works with cookies and local-storage as global data (reply to 53559)

<You>: thank you (reply to 53560)

User<6821103918>: I've got a developer tho, a real good one. (reply to 53341)

Panda: When I transfor jetton token,it give me follow error:

Panda: and transfer failed

Panda: https://dev.tonviewer.com/transaction/d90fd04855a7e56a4175ee363f10d62b7e18c1d84380dbc91d37c0e579c95a51

MJ: Guy can anyone help plz? (reply to 53554)

Rahul: LinkedIn Post - https://www.linkedin.com/posts/rantcell_hyperconnected-mnos-qos-activity-7188488701000208384-pmhd?utm_source=share&utm_medium=member_desktop

Pavel: I create empty project. End i got this error when i try to run contract in testnet Scan the QR code in your wallet or open the link...[TON_CONNECT_SDK] Wallet message received: {   id: 0,   event: 'connect_error',   payload: { code: 3, message: 'Manifest content error' } } ManifestContentErrorError: [TON_CONNECT_SDK_ERROR] ManifestContentErrorError: Passed `tonconnect-manifest.json` contains errors. Check format of your manifest. See more https://github.com/ton-connect/docs/blob/main/requests-responses.md#app-manifest Manifest content error     at ConnectErrorsParser.parseError (C:\Users\Pavel\Test\node_modules\@tonconnect\sdk\src\parsers\connect-errors-parser.ts:26:16)     at TonConnect.onWalletConnectError (C:\Users\Pavel\Test\node_modules\@tonconnect\sdk\src\ton-connect.ts:377:43)     at TonConnect.walletEventsListener (C:\Users\Pavel\Test\node_modules\@tonconnect\sdk\src\ton-connect.ts:336:22)     at C:\Users\Pavel\Test\node_modules\@tonconnect\sdk\src\provider\bridge\bridge-provider.ts:282:39     at Array.forEach (<anonymous>)     at BridgeProvider.<anonymous> (C:\Users\Pavel\Test\node_modules\@tonconnect\sdk\src\provider\bridge\bridge-provider.ts:282:19)     at Generator.next (<anonymous>)     at fulfilled (C:\Users\Pavel\Test\node_modules\node_modules\tslib\tslib.es6.js:71:58)

Pavel: I got ManifestContentErrorError, how to fix it?

Alex: To much Dev scammer on ton now... Need node to auto lock LP auto launch CA 😢😢

Anil: Hello guys

Anil: there is scam about ton giveaway or this is legit ?

wikig: Example ? How they scam ? rug the pool  ? (reply to 53572)

K.: A lot of ppl/bots posing as “devs” and running with money, stealing wallets, etc. (reply to 53577)

wikig: But how ? User hold it's privatekey in Tonkeeper / @wallet   .....  If it's not a easy thing to let user send the seed or key out i think . (reply to 53581)

K.: You can use a hook: import { useTonConnectUI } from "@tonconnect/ui-react"; import { Sender, SenderArguments } from "@ton/core";  export function useTonConnect(): { sender: Sender; connected: boolean } {   const [tonConnectUI] = useTonConnectUI();    return {     sender: {       send: async (args: SenderArguments) => {         tonConnectUI.sendTransaction({           messages: [             {               address: args.to.toString(),               amount: args.value.toString(),               payload: args.body?.toBoc().toString("base64"),             },           ],           validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve         });       },     },     connected: tonConnectUI.connected,   }; }  Then import useTonConnect and call: const { connected } = useTonConnect(); (reply to 53553)

wikig: Is jetton have logic like approve ? if it have so .... well , that's possible to

K.: Or just tonConnectUI.connected basically, should be a boolean

wikig: Thanks !   Well , now the problem is , i try check the currently status of the tonconnect-ui connection .   I use tonConnectUI.modalState ...  Is there any table or docs about the stander tonConnectUI.modalState ?   Because i can't tell what is unconnected , what is connected already .  they all sad it closed . (reply to 53583)

musashi: no (reply to 53584)

wikig: Thanks , currently testing . (reply to 53586)

wikig: Well , if jetton don't have approve , then i think it's no possible to build scams like approve some important asserts right  ? (reply to 53588)

Sunny: how how can i fetch the transaction hash after successfully doing the transaction?   connector.sendTransaction({             validUntil: timeout, // timeout is SECONDS             messages: [                 {                     amount: '100000000',                     address: 'address'                 }             ]         })         .then(() => {             bot.telegram.sendMessage(chatId, `Transaction sent successfully`);         })         .catch(e => {             if (e instanceof UserRejectsError) {                 bot.telegram.sendMessage(chatId, `You rejected the transaction`);                 return;             }              bot.telegram.sendMessage(chatId, `Unknown error happened`);         })         .finally(() => connector.pauseConnection());      let deeplink = '';     const walletInfo = await getWalletInfo(connector.wallet?.device.appName);     if (walletInfo) {         deeplink = walletInfo.universalLink;     }      await bot.telegram.sendMessage(         chatId,         `Open ${walletInfo?.name || connector.wallet?.device.appName} and confirm transaction, Please note transaction will be discarded after ${timeout}`,         {             reply_markup: {                 inline_keyboard: [                     [                         {                             text: 'Open Wallet',                             url: deeplink                         }                     ]                 ]             }         }     ); (reply to 53583)

K.: No, but you can just make one that sends Jettons directly by asking a user to execute a transaction 🤷🏻‍♂️ (reply to 53590)

K.: It’s really not always about the tech, people are the ones getting exploited

/ Stars Bank: Hi, everybody How can multiple transactions be sent from a highload at once? Are there any examples?  Js

wikig: lol . that's true . (reply to 53592)

User<6861867033>: who can help me to find pool address of this token? Someone help me https://www.geckoterminal.com/ton/pools/EQBoRXPqMGXrtX-N5sQyg0pU7H_HSXS39XipBUEB-_l922Ru

Клецка: EQBoRXPqMGXrtX-N5sQyg0pU7H_HSXS39XipBUEB-_l922Ru (reply to 53614)

Buggy: Who need more ton testnet?

Rasoul: Hi  guys how to find tokenomics ton?

Rasoul: I want to know who owns the offered tokens

Ma><im: hello everyone!   please tell me how the same tonscan or tonviewer will determine the type of contract? Whether it's a token wallet or an NFT collection?  by the getters and by what lies in the memory of the contract? Or what?

K.: By code mostly, I suppose. Contracts for Jettons and NFTs are mostly the same - it’s metadata that makes them different. (reply to 53633)

K.: Also there are getters that are defined (required) by TEPs, so that could be used to.

Bollus: Hey devs  Happy to be here.  I'm taking the TON Blockchain Course to become a TON Dev, but I have some knowledge gaps to fill, since I only have basic knowledge of HTML, CSS, and JS.  Any advice on how to go about having a strong foundation?

Gyorgy: Have a project idea and try to make it a reality. Always the best way of learning 🙂 Then research and fill the gaps. (reply to 53639)

Bollus: Great 👍   It just so happens that I have an idea.  Thanks. (reply to 53640)

Rasoul: help (reply to 53631)

Gyorgy: Misunderstood the question. Answer is below. ⬇️ (reply to 53644)

K.: Last page here:  https://ton.org/whitepaper.pdf  More info:  https://ton.org/en/toncoin https://www.tonstat.com/ (reply to 53631)

SSLCertificates: scams don’t click

User<6821103918>: Some delete this. (reply to 53650)

K.: There’s a neat /report command you can use in a message reply :)

K.: Wouldn’t hurt to enlarge the active mod team with how big the chat is getting.

SSLCertificates: OK

User<6821103918>: Yeah this too. (reply to 53656)

Gyorgy: It’s pretty okay here compared to Community chats what I saw there.  🙂 (reply to 53656)

K.: True 😅 (reply to 53659)

User<6821103918>: Yeah this too (reply to 53659)

&rey: Thanks for the recognition of effort of our team! (reply to 53659)

Gyorgy: It must be hard, I well understand lot of scammers and spammers out there. But yet we still able to communicate normally, hats off! 🙂 (reply to 53662)

Vova: hi im trying to learn ton/core and ton smartcontracts can you recomend me all useful corces and materials

Yannick | Chorus One: We plan to run a validator on mainnet. We need first to run an active validator on testnet to build monitoring, failover and automation around it. The documentation in the repo how to get test grams seems out of date. How to get enough test grams to get into active validator set ?

Richard: Hi everyone,   Happy to be here.

Richard: I'd like to ask help in working with a TON developer and Telegram Mini-app developer

Richard: Can you point a resource where I can search for TON devs and Telegram mini-app devs?

Blockchain Dev: I had to get toncenter to decode the raw address, and the wallet's token count. javascript

Андрей: launch your test network with mylocalton and raise your validator in it (reply to 53668)

Dung LQ: Hello everyone, I'm stuck at the gas fee estimate step for sending transaction, can someone help me with the documentation on this part?

Yannick | Chorus One: This is not a suitable test. I need to run the validator on a real network and observe how the node participate to consensus. Isn't it possible to get test gram ? What is the purpose of the testnet then ? (reply to 53684)

Ken: Hi, new to the ton community n still exploring the cool stuffs here! Wondering if anyone can give me some pointers on if any attestation concept working in the ton ecosystem like https://attest.sh/? Thanks!

perfogic: Hello everyone

perfogic: how to call on liteserver

perfogic: i can 't do it even i use the liteserver on here: https://ton.org/testnet-global.config.json

Speculator: How to get jetton balance?

Speculator: does anyone have code snippet?

Baco: What do you want to do? (reply to 53694)

Baco: U able to check on github  https://github.com/alefmanvladimir/get-jetton-metadata (reply to 53696)

perfogic: i want to run the trustless relayer (reply to 53698)

perfogic: but it need LITE_ENDPOINT

perfogic: i do like this

perfogic: the liteserver node i get it from here: https://ton.org/global-config.json

perfogic: can you give me a check ^ ^ (reply to 53698)

Baco: you able to see it in json file        "ip": 1592601963,       "port": 13833, (reply to 53701)

Baco: Ping me I will share how to connect to lite server (reply to 53706)

perfogic: thank you mate

perfogic: already ping u (reply to 53708)

Pavel: And QR is inserted when depositing the contract. After scanning it through TonKeeper, it takes forever to load it Can someone help me?

User<7133578437>: Who can help with deploying NFT to an existing collection?

User<7137101737>: Dm (reply to 53714)

Heydar: can someone tell me what's the difference between tma-sdk and twa-sdk modules in npm? which one you will use to creating your telegram webapp?

perfogic: hello anyone can help me to know which type of lite_api here, where i can get it ?

perfogic: @alefman

perfogic: anyone can help me ^ ^

lafi: Dose Ton have its own language

Baco: Was it helpful for you? Chapter 2.2    https://docs.ton.org/trustless-interaction-with-ton_v1.1_23-05-15.pdf (reply to 53722)

&rey: Yes. Not one, actually, but whole range: from ll Fift to FunC to hl Tact. (reply to 53725)

&rey: Please message @f_closer. (reply to 53687)

Boris: check this https://github.com/ton-org/ton-core/blob/main/src/address/Address.ts#L125 (reply to 53682)

&rey: docs.ton.org; it has plenty of outgoing links as well. (reply to 53667)

Pavel: And QR is inserted when depositing the contract. After scanning it through TonKeeper, it takes forever to load it Can someone help me?

&rey: Maybe a Tonkeeper problem? Do other wallets work? (reply to 53731)

Pavel: My ton keeper throws  ManifestError

Pavel: I mean my ton wallet

&rey: What do you have in tonconnect-manifest.json?

Pavel: When i create project. Manifest dont create (reply to 53735)

Pavel: Only this

Louis: How do I add comments when sending Token Transfer messages guys?

User<7137101737>: Func (reply to 53725)

User<7137101737>: Fift, you can  also interact with smart contracts using golang and typescript (reply to 53740)

User<6943543282>: Hello can someone assist to add token to tonkeeper/ton-assets repository?

User<7137101737>: Dm (reply to 53739)

&rey: beginCell().storeUint(0, 32).storeStringTail(...).endCell() (reply to 53739)

Louis: thank you, let me try (reply to 53745)

Ar: Do we have a bridge from TON to for example EVM chain?

&rey: bridge.ton.org. It may be quite unstable, admittedly. (reply to 53748)

Ar: Unstable? What you mean?

Ar: Any fund lose potentially?

&rey: Once in two days, one reports that funds did not come after waiting a few hours. Unfortunately, I don't receive info about whether the transaction passed afterwards; @ton_help_bot is support for the bridge. (reply to 53750)

Ar: Okay, thanks!

lafi: Okay amma look into it 💯🤝 (reply to 53728)

User<791660114>: Hello sir, i have issue with my wallet

User<791660114>: I didn’t recieved my ton which i withdraw from kucoin 5 hours ago

User<791660114>: And on explorer it is showing successfull transaction but wallet is not reflecting my funds

Marco: Hi Team 🙂 I'm using Pythons "pytoniq" library in order to create a wallet then send some TONs to the wallet it works fine so far.

Marco: But when I check the wallet on tonscan I can clearly see it's not initialized. I see the following :   Uninitialized address This address doesn't contain any data in blockchain — it was either never used or the contract was deleted. Now it just aimlessly floats in the digital void.

Father Pepe Of: Could anyone assist me in building a TON tipbot?

Father Pepe Of: I tried it with the SDK but some reason it didn't work

Father Pepe Of: Think we need to make a group for active developers where we can share ideas etc

Marco: I agree

— 2024-04-24 —

إسماعيل: Is there any NFT API out there that includes pricing please? (other than nftscan, they're down like 50% of the time)

ثائر: Hi I’m not a bot and The Notcoin bot says “script detected” and -99% shows zero not  though I didn’t use any auto clicker but one thing actually happened when mining phase ended but my Notcoin bot still running for awhile  Please I need your help

ثائر: If that wasn’t your field just instruct me for what I should do

g: May I ask how to determine which user has successfully transacted using the React UI demo, based on the transaction information obtained from toncenter.com/api/v2/getTransactions? This is because the React UI demo does not support passing text parameters

perfogic: anyone know how to use this

perfogic: https://tonapi.io/v2/liteserver/get_block/(-1,-9223372036854775808,37485850,a32169b496650ee64fa61aed3147f980c0f3aea4d9b9c931db50b15742ff867c,6f19ab2fdf0c46d54411012346b07140d60913f6f2bb0b944a59467c3939e6f4)

Kenny$$Shillz: Also u may want to refactor the code so that both messages are sent at the end of the computations (reply to 53006)

Pike 🦴 🏴‍☠️: Hi guys, does anyone know how to generate tactlike abi from func?

lampamazaza: Can I query contract data that has been deleted due to  lack of TON to pay a storage fee ?

Matthew: ok thank you (reply to 53797)

loo: hi guys, does anyone know the VRF like chainlink on ton

&rey: As a matter of fact, I created one. ratingers.pythonanywhere.com/ecvrf-about.html. Please say if you have any integration problems. (reply to 53808)

loo: thx bro

Alex: Attention TON Developers   The TON Dev Community calls on your expertise to contribute to advancing the TON ecosystem. Your insights and experiences in development are invaluable in making TON more robust and user-friendly.  We encourage every community member to share their experiences with TON development by participating in our survey.  The survey encompasses four key topics and will take approximately 5-8 minutes of your time.   https://nletwfvh.paperform.co

Louis: hello, why did my notify token fail? Is it because the gas is too low? (reply to 53745)

Louis: https://testnet.tonviewer.com/transaction/906ab9018ba880a3fc9db8d4ff1724d68d6312eb731850fc362341987c1ef533

Oscar: I want to use the Jetton Minter to mint a token which also takes a 3% fee for every transaction and sends it to a wallet. How should I edit the smart contract.

Haq: Hey guys 👋🏼 TON has some utils to get info about NFT holders, snapshot of whole items from collection?

Yaku: Ton is pretty new to NFTs I know of GetGems and TonDiamonds for anything NFT  And DaoLama for NFT lending (reply to 53818)

Behrang: When you send jettons from Tonkeeper, it sets the notification amount to 1 nanoTon. This is just a hint to the receiving wallet, and helps you with lowering gas fee for the transaction. No need to worry.  Usually you don't need any notification message, unless you're using a dapp which will set the correct params. (reply to 53813)

Haq: I ask Getgems but they don’t have that kind of option and I was wondering if exists any util for that (reply to 53819)

Yaku: I haven’t figured the complete NFT infrastructure out on TON yet (reply to 53823)

Yaku: I’m preparing for launch on TON

Haq: That sounds cool 👌🏼

Yaku: But trying to figure out if there is an option to add a WL to your collection like you can on Opensea and more marketplaces

Haq: Yes you can, by script in your Smart Contract

Haq: You need to have it in your contract before you deploy it and then you create script to call it

Yaku: Can we keep adding adresses as the WL might grow as effect of community events (reply to 53830)

Haq: Yes (reply to 53831)

Yaku: I’m new to ton, so checking what my options are.

&rey: You mean, for initial mint? (reply to 53827)

Yaku: Thank you (reply to 53832)

Yaku: Yes. My TON collection is almost ready for the first drop. And now wanting to make sure everything will be butter smooth and perfect as far that goes (reply to 53834)

&rey: Do you happen to know the limit, by the way? (reply to 53832)

Haq: You need to have in your construct storage variable with type “map<Address, Bool>” and  work on it with scripts

Yaku: 850 NFTs in total, 700 for mint. 150 reserved for community events and giveaways (reply to 53837)

&rey: Please take a look on cNFT standard: it is optimized for case when you know addresses where to drop, but don't want to pay for said drop. (reply to 53836)

Yaku: Do these apply to TON as well I know it’s commonly used on Solama (reply to 53841)

Haq: @pcrafter  and you maybe know some utility for snapshot on NFT items holders?

Yaku: I guess collab. land bot is not yet supporting TON? Because snapshots can be taken with that

Haq: Do you have way to manage the traffic during a mint session? Calls to contract with the same index? (reply to 53842)

Yaku: More frequently used as gatekeeper for tokenized communities

&rey: ton.vote does so internally, I know. (reply to 53843)

Haq: Gracias, I will check it (reply to 53847)

Yaku: Let me know if you found it 🙏🏽 (reply to 53848)

Haq: I will if not maybe I will build something like that (reply to 53849)

Yaku: Let’s stay in touch! (reply to 53850)

KaKui: Can anyone tell me what the queryId is used for when sending a transaction? What rules should be used to manage queryId?

&rey: You take arbitrary. Contracts may respect queryId and pass it along message chain. Other people can use same queryId once they see your external. (reply to 53853)

Kenny$$Shillz: U shouldn't use unbounded data structures in a ton contract as it becomes exponentially expensive to use (reply to 53831)

KaKui: What do you guys pass in queryId? I wanted to pass in the ID of the business in the database, but I found that the number might be too big. (reply to 53855)

Sunny: hey is it possible to create ton wallet on my own server and send rewards to users directly from server instead of interacting with ton wallet to sign txn?

wikig: Hello guys . is there any community or group chat about telegram game DEV  ?

K.: Yes, https://tonhelloworld.com/01-wallet/ (reply to 53871)

&rey: I pass zero, usually. (reply to 53869)

&rey: After all, since others can use same queryId, it's useless to me.

Nyxra: Guys is there any API that helps me send jetton to another TON wallet address?

&rey: And storing zero onchain is a bit cheaper.

&rey: Use @ton/ton lib. (reply to 53882)

Oscar: Does anyone want to help 🙂 (reply to 53816)

